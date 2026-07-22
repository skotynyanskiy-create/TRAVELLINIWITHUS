import { spawnSync } from 'node:child_process';
import path from 'node:path';

const rootDir = process.cwd();

console.log('Obsidian Vault — Unified Sync & Verification Suite');

const steps = [
  ['Index Generation', ['node', 'scripts/generate-obsidian-index.mjs']],
  ['Plugin Setup & Sync', ['node', 'scripts/install-obsidian-plugins.mjs']],
  ['Taxonomy Audit', ['node', 'scripts/audit-obsidian.mjs']],
];

let failed = false;

for (const [label, args] of steps) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(args[0], args.slice(1), {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    console.error(`FAIL ${label}`);
    failed = true;
    break;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('\nPASS Obsidian vault is perfectly organized, synchronized, and audit-aligned.');
}
