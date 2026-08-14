import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const packageManager = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const steps = [
  ['typecheck', ['run', 'typecheck']],
  ['lint', ['run', 'lint']],
  ['format:check', ['run', 'format:check']],
  ['lint:md:core', ['run', 'lint:md:core']],
  ['test', ['run', 'test']],
  ['functions:build', ['run', 'functions:build']],
  ['functions:smoke', ['run', 'functions:smoke']],
  ['build', ['run', 'build']],
  ['audit:ui', ['run', 'audit:ui']],
  // Aggiunti il 2026-08-14 per riallineare le tre pipeline «controlla tutto»:
  // prima audit:provenance — la regola imagery-truth — non girava ne' qui ne' in
  // CI, solo dentro audit:quality se qualcuno lo lanciava a mano.
  ['audit:provenance', ['run', 'audit:provenance']],
  ['audit:seed', ['run', 'audit:seed']],
  ['audit:llms', ['run', 'audit:llms']],
  ['stato:check', ['run', 'stato:check']],
  ['audit:firebase', ['run', 'audit:firebase']],
  ['audit:stripe', ['run', 'audit:stripe']],
  ['audit:agents', ['run', 'audit:agents']],
  ['eval:skills', ['run', 'eval:skills']],
  ['audit:ai-seo', ['run', 'audit:ai-seo']],
  ['check:graphify', ['run', 'check:graphify']],
  ['audit:public-footprint', ['run', 'audit:public-footprint']],
  ['audit:revenue', ['run', 'audit:revenue']],
  ['audit:size', ['run', 'audit:size']],
  ['audit:obsidian', ['run', 'audit:obsidian']],
  ['audit:env', ['run', 'audit:env']],
  // Ultimo perche' e' l'unico che guarda fuori dal repo: con PROD_URL impostata
  // verifica che /api/** risponda JSON e non lo shell della SPA. Senza, si
  // dichiara saltato. Vedi BUG_API_ENDPOINTS_SENZA_BACKEND_IN_PROD.
  ['audit:api-live', ['run', 'audit:api-live']],
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
console.log(
  fs.existsSync(publicSitemap)
    ? 'PASS public/sitemap.xml exists.'
    : 'WARN public/sitemap.xml is missing.'
);
console.log(
  fs.existsSync(publicRobots)
    ? 'PASS public/robots.txt exists.'
    : 'WARN public/robots.txt is missing.'
);
console.log(
  fs.existsSync(publicMediaKit)
    ? 'PASS public/media-kit.pdf exists.'
    : 'WARN public/media-kit.pdf is missing.'
);
console.log(
  fs.existsSync(envExample) ? 'PASS .env.example exists.' : 'WARN .env.example is missing.'
);

process.exitCode = failed ? 1 : 0;
