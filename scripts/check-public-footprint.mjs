import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();

const checks = [];

function add(level, message) {
  checks.push({ level, message });
}

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function expectFile(relativePath) {
  if (exists(relativePath)) {
    add('PASS', `${relativePath} exists.`);
    return true;
  }
  add('FAIL', `${relativePath} is missing.`);
  return false;
}

function expectContains(relativePath, needle, passMessage, failMessage) {
  if (!expectFile(relativePath)) return;
  const content = read(relativePath);
  if (content.includes(needle)) {
    add('PASS', passMessage);
  } else {
    add('FAIL', failMessage);
  }
}

function trackedAndUntrackedFiles() {
  const output = execSync('git ls-files -co --exclude-standard', {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return output
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((filePath) => !filePath.startsWith('dist/'))
    .filter((filePath) => !filePath.startsWith('node_modules/'))
    .filter((filePath) => !filePath.startsWith('.git/'));
}

expectContains(
  'src/config/site.ts',
  'export const BIO_LINKS',
  'BIO_LINKS centralizes IG/TikTok bio URLs.',
  'BIO_LINKS missing from site config.'
);
expectContains(
  'src/config/site.ts',
  'export const BRAND_STATS_SOURCE',
  'BRAND_STATS_SOURCE documents metric source/date.',
  'BRAND_STATS_SOURCE missing from site config.'
);
expectContains(
  'src/config/site.ts',
  'export const PUBLIC_PROOF_SIGNALS',
  'PUBLIC_PROOF_SIGNALS centralizes public proof links.',
  'PUBLIC_PROOF_SIGNALS missing from site config.'
);
expectContains(
  'src/config/site.ts',
  'export const NEWSLETTER_RECENT_SIGNUPS = 0',
  'Newsletter public counter is disabled until verified.',
  'Newsletter public counter is not disabled.'
);

for (const routeFile of [
  'src/pages/VieniConNoi.tsx',
  'src/pages/MediaKit.tsx',
  'src/pages/Collaborazioni.tsx',
  'src/pages/Press.tsx',
]) {
  expectFile(routeFile);
}

expectContains(
  'src/pages/VieniConNoi.tsx',
  'bio_hub_path_click',
  '/vieni-con-noi tracks bio hub path clicks.',
  '/vieni-con-noi does not track bio hub path clicks.'
);
expectContains(
  'src/pages/MediaKit.tsx',
  'PUBLIC_PROOF_SIGNALS',
  '/media-kit renders public proof signals.',
  '/media-kit does not render public proof signals.'
);
expectContains(
  'src/pages/Collaborazioni.tsx',
  'BRAND_STATS_SOURCE',
  '/collaborazioni declares metric source.',
  '/collaborazioni does not declare metric source.'
);
expectContains(
  'src/pages/Press.tsx',
  'public_proof_click',
  '/press tracks public proof links.',
  '/press does not track public proof links.'
);
expectContains(
  'src/pages/Risorse.tsx',
  "isCommercialResource(item) ? 'affiliate_click' : 'resource_click'",
  '/risorse separates affiliate and editorial outbound events.',
  '/risorse does not separate affiliate and editorial outbound events.'
);
expectContains(
  'src/pages/Risorse.tsx',
  "'nofollow sponsored noopener noreferrer'",
  '/risorse applies sponsored rel to commercial links.',
  '/risorse does not apply sponsored rel to commercial links.'
);

for (const docPath of [
  'docs/50_Scratch/AUDIT_PUBLIC_FOOTPRINT_TRAVELLINIWITHUS_2026-06-07.md',
  'docs/10_Projects/PROJECT_PUBLIC_FOOTPRINT_ULTRA_IMPROVEMENT_PLAN_2026-06-07.md',
  'docs/20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07.md',
  'docs/13_Content/CONTENT_PROOF_LIBRARY_TRAVELLINIWITHUS.md',
  'docs/12_Partnerships/CASE_STUDY_EMILIA_FANTASTICA_CASTELLI_DUCATO.md',
  'docs/RELEASE_2026-06-07_public-footprint-predeploy.md',
]) {
  expectFile(docPath);
}

expectContains(
  '.env.example',
  'VITE_FIREBASE_API_KEY=',
  '.env.example documents VITE_FIREBASE_API_KEY.',
  '.env.example does not document VITE_FIREBASE_API_KEY.'
);
expectContains(
  'src/lib/firebaseApp.ts',
  'import.meta.env.VITE_FIREBASE_API_KEY',
  'Firebase client config reads API key from env.',
  'Firebase client config does not read API key from env.'
);
expectContains(
  'src/context/AuthContext.tsx',
  'hasFirebaseApiKey',
  'Auth provider guards against missing Firebase API key.',
  'Auth provider does not guard against missing Firebase API key.'
);

if (expectFile('firebase-applet-config.json')) {
  const firebaseConfig = JSON.parse(read('firebase-applet-config.json'));
  if (firebaseConfig.apiKey) {
    add('FAIL', 'firebase-applet-config.json still contains a Firebase Web API key.');
  } else {
    add('PASS', 'firebase-applet-config.json does not contain the Firebase Web API key.');
  }
}

const apiKeyPattern = /AIza[0-9A-Za-z_-]{35}/;
const currentLeaks = [];
for (const filePath of trackedAndUntrackedFiles()) {
  const absolutePath = path.join(rootDir, filePath);
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) continue;
  const content = fs.readFileSync(absolutePath, 'utf8');
  if (apiKeyPattern.test(content)) currentLeaks.push(filePath);
}

 if (currentLeaks.length) {
  for (const filePath of currentLeaks) {
    add('FAIL', `Current tracked/untracked file contains a GCP API key: ${filePath}`);
  }
} else {
  add('PASS', 'No current tracked/untracked file contains a GCP API key pattern.');
}

if (process.env.PUBLIC_FOOTPRINT_REQUIRE_PROD === '1' && !process.env.VITE_FIREBASE_API_KEY) {
  add('FAIL', 'Production gate requires VITE_FIREBASE_API_KEY.');
} else if (!process.env.VITE_FIREBASE_API_KEY) {
  add('WARN', 'VITE_FIREBASE_API_KEY is not set in this shell; production Auth/Admin requires it.');
} else {
  add('PASS', 'VITE_FIREBASE_API_KEY is present in this shell.');
}

add(
  'WARN',
  'audit:secrets still scans git history. Rotate/restrict the historical Firebase Web API key before production deploy.'
);

const passCount = checks.filter((check) => check.level === 'PASS').length;
const warnCount = checks.filter((check) => check.level === 'WARN').length;
const failCount = checks.filter((check) => check.level === 'FAIL').length;

console.log('Public footprint audit');
console.log(`PASS: ${passCount}`);
console.log(`WARN: ${warnCount}`);
console.log(`FAIL: ${failCount}`);

for (const check of checks) {
  console.log(`${check.level.padEnd(4, ' ')} ${check.message}`);
}

process.exitCode = failCount > 0 ? 1 : 0;
