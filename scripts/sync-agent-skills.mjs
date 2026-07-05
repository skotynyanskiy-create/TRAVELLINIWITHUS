import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, '.agents', 'skills');
const targetDirs = [
  path.join(rootDir, '.claude', 'skills'),
  path.join(rootDir, '.github', 'skills'),
  path.join(rootDir, '.cursor', 'skills'),
  path.join(rootDir, '.gemini', 'skills'),
];

// Explicit whitelist: external skill installers (skills.sh, impeccable install)
// drop global skills into .agents/skills, and a blind mirror would spray them
// into every harness dir + git. Only the canonical Travellini set syncs.
const CANONICAL_SKILLS = new Set([
  'a11y-check',
  'animate',
  'audit-browser',
  'audit-ui',
  'backup-rollback',
  'cli-evaluator',
  'copywriting-italian',
  'cwv',
  'deploy',
  'design-research',
  'firebase-check',
  'github-agent-workflow',
  'hooks-audit',
  'innovation-radar',
  'mcp-evaluator',
  'new-article',
  'new-page',
  'plugin-evaluator',
  'predeploy',
  'responsive-check',
  'secret-protection',
  'seo-check',
  'smoke-test',
  'social-card',
  'stripe-flow',
  'travellini-stitch-figma-bridge',
]);

function getSkillDirs(baseDir) {
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Canonical skills directory not found: ${path.relative(rootDir, baseDir)}`);
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name))
    .filter((skillDir) => fs.existsSync(path.join(skillDir, 'SKILL.md')));
}

const allSkillDirs = getSkillDirs(sourceDir);
const skillDirs = allSkillDirs.filter((dir) => CANONICAL_SKILLS.has(path.basename(dir)));
const skipped = allSkillDirs.filter((dir) => !CANONICAL_SKILLS.has(path.basename(dir)));

for (const dir of skipped) {
  console.warn(
    `SKIP ${path.relative(rootDir, dir)} — not in the canonical whitelist. ` +
      `If this is a new Travellini skill, add it to CANONICAL_SKILLS in scripts/sync-agent-skills.mjs.`
  );
}

if (skillDirs.length === 0) {
  throw new Error('No canonical skills found in .agents/skills.');
}

for (const targetDir of targetDirs) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const skillDir of skillDirs) {
    const skillName = path.basename(skillDir);
    const destination = path.join(targetDir, skillName);
    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(skillDir, destination, { recursive: true });
    console.log(`SYNC ${path.relative(rootDir, skillDir)} -> ${path.relative(rootDir, destination)}`);
  }
}

console.log(
  `PASS synced ${skillDirs.length} skills to ${targetDirs.length} agent directories` +
    (skipped.length ? ` (${skipped.length} non-canonical skipped).` : '.')
);
