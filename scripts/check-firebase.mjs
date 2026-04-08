import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const servicePath = path.join(rootDir, 'src', 'services', 'firebaseService.ts');
const rulesPath = path.join(rootDir, 'firestore.rules');
const srcDir = path.join(rootDir, 'src');

function pushIssue(issues, level, filePath, line, message) {
  issues.push({
    level,
    filePath: path.relative(rootDir, filePath),
    line,
    message,
  });
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

const issues = [];
const serviceContent = fs.readFileSync(servicePath, 'utf8');
const rulesContent = fs.readFileSync(rulesPath, 'utf8');

for (const match of serviceContent.matchAll(/getDocs\(collection\(db,\s*'((articles|products))'\)\)/g)) {
  pushIssue(
    issues,
    'warn',
    servicePath,
    getLineNumber(serviceContent, match.index),
    `Direct collection read on "${match[1]}" found. Prefer query() with explicit filters and limits.`
  );
}

for (const match of serviceContent.matchAll(/const\s+(\w+)\s*=\s*query\(([\s\S]*?)\);\n/g)) {
  const queryName = match[1];
  const queryBody = match[2];
  if (!queryBody.includes("collection(db, 'articles')") && !queryBody.includes("collection(db, 'products')")) {
    continue;
  }

  const line = getLineNumber(serviceContent, match.index);

  if (!queryBody.includes("where('published', '==', true)")) {
    pushIssue(
      issues,
      'warn',
      servicePath,
      line,
      `Query "${queryName}" reads public editorial/shop data without a published filter.`
    );
  }

  if (!queryBody.includes('limit(')) {
    pushIssue(
      issues,
      'warn',
      servicePath,
      line,
      `Query "${queryName}" has no explicit limit(). Confirm the read is intentionally unbounded.`
    );
  }
}

for (const match of serviceContent.matchAll(/catch\s*\{\s*return\s+null;\s*\}/g)) {
  pushIssue(
    issues,
    'warn',
    servicePath,
    getLineNumber(serviceContent, match.index),
    'Swallowed Firestore error returning null without diagnostics.'
  );
}

if (/allow\s+read,\s*write\s*:\s*if\s+true\b/.test(rulesContent)) {
  pushIssue(issues, 'error', rulesPath, 1, 'Security rule "allow read, write: if true" found.');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (!fullPath.endsWith('.ts') && !fullPath.endsWith('.tsx')) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

for (const filePath of walk(srcDir)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const secretMatch = content.match(/sk_(live|test)_[A-Za-z0-9]+|-----BEGIN [A-Z ]+PRIVATE KEY-----|serviceAccount/);
  if (!secretMatch) {
    continue;
  }

  pushIssue(
    issues,
    'error',
    filePath,
    getLineNumber(content, secretMatch.index ?? 0),
    `Potential secret material found: "${secretMatch[0]}".`
  );
}

const errorCount = issues.filter((issue) => issue.level === 'error').length;
const warnCount = issues.filter((issue) => issue.level === 'warn').length;

console.log('Firebase audit');
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warnCount}`);

for (const issue of issues) {
  const prefix = issue.level.toUpperCase().padEnd(5, ' ');
  console.log(`${prefix} ${issue.filePath}:${issue.line} - ${issue.message}`);
}

if (issues.length === 0) {
  console.log('PASS  No Firebase/Firestore issues detected by static heuristics.');
}

process.exitCode = errorCount > 0 ? 1 : 0;
