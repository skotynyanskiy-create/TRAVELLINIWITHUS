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

// --- firebase project consistency check ---
// Verifica che firebase-applet-config.json (usato a runtime da client e server)
// combaci con .firebaserc (usato da firebase CLI per deploy) e con FIREBASE_PROJECT_ID
// se presente in env. Previene deploy sul progetto sbagliato.
console.log('\n== firebase consistency ==');
try {
  const appletConfigPath = path.join(rootDir, 'firebase-applet-config.json');
  const firebaseRcPath = path.join(rootDir, '.firebaserc');

  if (!fs.existsSync(appletConfigPath)) {
    console.log('FAIL firebase-applet-config.json mancante — richiesto a runtime per client + server bootstrap.');
    failed = true;
  } else if (!fs.existsSync(firebaseRcPath)) {
    console.log('WARN .firebaserc mancante — non bloccante ma firebase CLI ne ha bisogno per deploy.');
  } else {
    const appletConfig = JSON.parse(fs.readFileSync(appletConfigPath, 'utf8'));
    const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
    const appletProjectId = appletConfig.projectId;
    const rcProjectId = firebaseRc?.projects?.default;
    const envProjectId = process.env.FIREBASE_PROJECT_ID;

    if (!appletProjectId) {
      console.log('FAIL firebase-applet-config.json manca il campo projectId.');
      failed = true;
    } else if (rcProjectId && rcProjectId !== appletProjectId) {
      console.log(`FAIL projectId mismatch: .firebaserc.default=${rcProjectId} vs firebase-applet-config.json=${appletProjectId}`);
      failed = true;
    } else if (envProjectId && envProjectId !== appletProjectId) {
      console.log(`FAIL projectId mismatch: FIREBASE_PROJECT_ID=${envProjectId} vs firebase-applet-config.json=${appletProjectId}`);
      failed = true;
    } else {
      console.log(`PASS firebase projectId coerente: ${appletProjectId}${envProjectId ? ' (env allineato)' : ''}`);
    }
  }
} catch (error) {
  console.log(`WARN firebase consistency check ha errori di parsing: ${error.message}`);
}

process.exitCode = failed ? 1 : 0;
