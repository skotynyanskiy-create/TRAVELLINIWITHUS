import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const packageManager = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const steps = [
  ['typecheck', ['run', 'typecheck']],
  ['lint', ['run', 'lint']],
  ['test', ['run', 'test']],
  ['build', ['run', 'build']],
  ['audit:ui', ['run', 'audit:ui']],
  ['audit:firebase', ['run', 'audit:firebase']],
  ['audit:stripe', ['run', 'audit:stripe']],
  ['audit:agents', ['run', 'audit:agents']],
];

let failed = false;

for (const [label, args] of steps) {
  console.log(`\n== ${label} ==`);
  const result =
    process.platform === 'win32'
      ? spawnSync(`${packageManager} ${args.join(' ')}`, {
          cwd: rootDir,
          stdio: 'inherit',
          shell: true,
        })
      : spawnSync(packageManager, args, {
          cwd: rootDir,
          stdio: 'inherit',
          shell: false,
        });

  if (result.status !== 0) {
    failed = true;
    console.log(`FAIL ${label}`);
    break;
  }

  console.log(`PASS ${label}`);
}

const publicSitemap = path.join(rootDir, 'public', 'sitemap.xml');
const publicRobots = path.join(rootDir, 'public', 'robots.txt');
const publicMediaKit = path.join(rootDir, 'public', 'media-kit.pdf');
const envExample = path.join(rootDir, '.env.example');

console.log('\n== static files ==');
console.log(fs.existsSync(publicSitemap) ? 'PASS public/sitemap.xml exists.' : 'WARN public/sitemap.xml is missing.');
console.log(fs.existsSync(publicRobots) ? 'PASS public/robots.txt exists.' : 'WARN public/robots.txt is missing.');
console.log(fs.existsSync(publicMediaKit) ? 'PASS public/media-kit.pdf exists.' : 'WARN public/media-kit.pdf is missing.');
console.log(fs.existsSync(envExample) ? 'PASS .env.example exists.' : 'WARN .env.example is missing.');

process.exitCode = failed ? 1 : 0;
