import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const canonicalDir = path.join(rootDir, '.agents', 'skills');
const syncedSkillTargets = [
  path.join(rootDir, '.claude', 'skills'),
  path.join(rootDir, '.github', 'skills'),
  path.join(rootDir, '.cursor', 'skills'),
  path.join(rootDir, '.gemini', 'skills'),
];
const claudeAgentsDir = path.join(rootDir, '.claude', 'agents');
const requiredDocs = [
  'AGENTS.md',
  'CLAUDE.md',
  'docs/',
  'docs/MARKETING_OPERATIONS_HUB.md',
  'docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md',
];
const requiredFiles = ['DESIGN.md', 'docs/AI_AGENT_STACK.md'];
const issues = [];

function relative(filePath) {
  return path.relative(rootDir, filePath).replaceAll('\\', '/');
}

function addIssue(level, filePath, message) {
  issues.push({ level, filePath: relative(filePath), message });
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) {
    return null;
  }

  const endIndex = content.indexOf('\n---', 4);
  if (endIndex === -1) {
    return null;
  }

  const raw = content.slice(4, endIndex);
  const data = {};

  for (const line of raw.split('\n')) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    data[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  }

  return data;
}

function getSkillDirs(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name))
    .filter((skillDir) => fs.existsSync(path.join(skillDir, 'SKILL.md')));
}

function assertNoAbsolutePaths(filePath, content) {
  const absolutePathPattern = /(?:[A-Za-z]:\\|file:\/\/|\/Users\/|\/home\/|\/var\/|\/tmp\/)/;
  if (absolutePathPattern.test(content)) {
    addIssue('error', filePath, 'Absolute machine path found. Use repo-relative paths.');
  }
}

function validateSkillFile(skillFile, { requireDocs }) {
  const content = readFile(skillFile);
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    addIssue('error', skillFile, 'Missing YAML frontmatter.');
    return;
  }

  if (!frontmatter.name) {
    addIssue('error', skillFile, 'Missing frontmatter name.');
  }

  if (!frontmatter.description || frontmatter.description.length < 40) {
    addIssue('error', skillFile, 'Missing or too-short frontmatter description.');
  }

  assertNoAbsolutePaths(skillFile, content);

  if (requireDocs) {
    for (const requiredDoc of requiredDocs) {
      if (!content.includes(requiredDoc)) {
        addIssue('error', skillFile, `Missing required project reference: ${requiredDoc}`);
      }
    }
  }
}

function validateClaudeAgent(agentFile) {
  const content = readFile(agentFile);
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    addIssue('error', agentFile, 'Claude agent missing YAML frontmatter.');
    return;
  }

  for (const key of ['name', 'description', 'tools']) {
    if (!frontmatter[key]) {
      addIssue('error', agentFile, `Claude agent missing frontmatter ${key}.`);
    }
  }

  assertNoAbsolutePaths(agentFile, content);

  for (const requiredDoc of requiredDocs) {
    if (!content.includes(requiredDoc)) {
      addIssue('error', agentFile, `Missing required project reference: ${requiredDoc}`);
    }
  }
}

for (const requiredFile of requiredFiles) {
  const filePath = path.join(rootDir, requiredFile);
  if (!fs.existsSync(filePath)) {
    addIssue('error', filePath, 'Required agent stack file is missing.');
  }
}

const canonicalSkills = getSkillDirs(canonicalDir);
if (canonicalSkills.length === 0) {
  addIssue('error', canonicalDir, 'No canonical skills found.');
}

for (const skillDir of canonicalSkills) {
  const skillFile = path.join(skillDir, 'SKILL.md');
  validateSkillFile(skillFile, { requireDocs: true });

  const sourceContent = readFile(skillFile);
  const skillName = path.basename(skillDir);

  for (const targetDir of syncedSkillTargets) {
    const targetFile = path.join(targetDir, skillName, 'SKILL.md');
    if (!fs.existsSync(targetFile)) {
      addIssue('error', targetFile, 'Synced skill copy is missing. Run npm run sync:agents.');
      continue;
    }

    if (readFile(targetFile) !== sourceContent) {
      addIssue('error', targetFile, 'Synced skill copy differs from .agents/skills source.');
    }
  }
}

for (const skillDir of getSkillDirs(path.join(rootDir, '.claude', 'skills'))) {
  validateSkillFile(path.join(skillDir, 'SKILL.md'), { requireDocs: false });
}

if (!fs.existsSync(claudeAgentsDir)) {
  addIssue('error', claudeAgentsDir, 'Claude agents directory is missing.');
} else {
  const agentFiles = fs
    .readdirSync(claudeAgentsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(claudeAgentsDir, entry.name));

  if (agentFiles.length === 0) {
    addIssue('error', claudeAgentsDir, 'No Claude project agents found.');
  }

  for (const agentFile of agentFiles) {
    validateClaudeAgent(agentFile);
  }
}

console.log('Agent stack audit');
console.log(`Canonical skills: ${canonicalSkills.length}`);
console.log(`Errors: ${issues.filter((issue) => issue.level === 'error').length}`);
console.log(`Warnings: ${issues.filter((issue) => issue.level === 'warn').length}`);

for (const issue of issues) {
  console.log(`${issue.level.toUpperCase().padEnd(5, ' ')} ${issue.filePath} - ${issue.message}`);
}

if (issues.length === 0) {
  console.log('PASS  Agent stack is synchronized and documented.');
}

process.exitCode = issues.some((issue) => issue.level === 'error') ? 1 : 0;
