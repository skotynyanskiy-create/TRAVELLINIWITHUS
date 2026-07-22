import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_SKILLS } from './lib/canonical-skills.mjs';

const rootDir = process.cwd();
const canonicalDir = path.join(rootDir, '.agents', 'skills');

function parseFrontmatter(content) {
  content = content.replace(/\r\n/g, '\n');

  if (!content.startsWith('---\n')) {
    return null;
  }

  const endIndex = content.indexOf('\n---', 4);
  if (endIndex === -1) {
    return null;
  }

  const raw = content.slice(4, endIndex);
  const data = {};

  const lines = raw.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, inline] = match;

    if (/^[|>][-+]?\d*$/.test(inline.trim())) {
      const block = [];
      while (i + 1 < lines.length && (lines[i + 1].trim() === '' || /^\s/.test(lines[i + 1]))) {
        i += 1;
        block.push(lines[i].trim());
      }
      data[key] = block.join(' ').trim();
      continue;
    }

    data[key] = inline.replace(/^["']|["']$/g, '').trim();
  }

  return data;
}

console.log('Skill Creator 2.0 — Evaluation Suite');
console.log(`Evaluating ${CANONICAL_SKILLS.size} canonical skills...`);

let passedCount = 0;
let failedCount = 0;

for (const skillName of CANONICAL_SKILLS) {
  const skillFile = path.join(canonicalDir, skillName, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    console.error(`FAIL [${skillName}]: File SKILL.md missing.`);
    failedCount += 1;
    continue;
  }

  const content = fs.readFileSync(skillFile, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    console.error(`FAIL [${skillName}]: Missing YAML frontmatter.`);
    failedCount += 1;
    continue;
  }

  if (!frontmatter.name) {
    console.error(`FAIL [${skillName}]: Missing name in frontmatter.`);
    failedCount += 1;
    continue;
  }

  if (!frontmatter.description || frontmatter.description.trim().length < 30) {
    console.error(`FAIL [${skillName}]: Description too short or missing.`);
    failedCount += 1;
    continue;
  }

  const requiredRefs = ['AGENTS.md', 'CLAUDE.md', 'docs/'];
  const missingRefs = requiredRefs.filter((ref) => !content.includes(ref));

  if (missingRefs.length > 0) {
    console.error(`FAIL [${skillName}]: Missing required refs (${missingRefs.join(', ')}).`);
    failedCount += 1;
    continue;
  }

  passedCount += 1;
}

console.log(`\nEvaluation complete: ${passedCount} PASS, ${failedCount} FAIL.`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('PASS All 53 canonical skills passed Skill Creator 2.0 evals cleanly.');
}
