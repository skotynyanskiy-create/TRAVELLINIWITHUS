import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const servicePath = path.join(rootDir, 'src', 'services', 'firebaseService.ts');
const rulesPath = path.join(rootDir, 'firestore.rules');
const srcDir = path.join(rootDir, 'src');
const firebaseJsonPath = path.join(rootDir, 'firebase.json');
const functionsPackagePath = path.join(rootDir, 'functions', 'package.json');
const functionsEntryPath = path.join(rootDir, 'functions', 'src', 'index.ts');
const functionsEnvExamplePath = path.join(rootDir, 'functions', '.env.example');
const functionsGitignorePath = path.join(rootDir, 'functions', '.gitignore');
const ciWorkflowPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');

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

for (const match of serviceContent.matchAll(
  /getDocs\(collection\(db,\s*'((articles|products))'\)\)/g
)) {
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
  if (
    !queryBody.includes("collection(db, 'articles')") &&
    !queryBody.includes("collection(db, 'products')")
  ) {
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
  // Cerca il MATERIALE, non il nome della variabile. Prima bastava la parola
  // `serviceAccount` per far fallire l'audit: in `src/server/data.ts` c'e'
  // `const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON`,
  // cioe' esattamente il modo giusto di prenderlo, e l'audit lo segnalava come
  // segreto. Un controllo che punisce il codice corretto insegna a ignorarlo.
  // Quello che va intercettato e' un JSON di service account incollato dentro:
  // lo si riconosce da `"type": "service_account"` e da `private_key`.
  const secretMatch = content.match(
    /sk_(live|test)_[A-Za-z0-9]+|-----BEGIN [A-Z ]+PRIVATE KEY-----|"type"\s*:\s*"service_account"|"private_key(_id)?"\s*:/
  );
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

function deliveryError(filePath, message) {
  pushIssue(issues, 'error', filePath, 1, message);
}

const firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
const functionsConfig = Array.isArray(firebaseJson.functions)
  ? firebaseJson.functions.find((entry) => entry?.codebase === 'api')
  : firebaseJson.functions;

if (!functionsConfig || functionsConfig.source !== 'functions') {
  deliveryError(
    firebaseJsonPath,
    'Firebase Functions codebase "api" must use functions/ as its source.'
  );
} else {
  const predeploy = Array.isArray(functionsConfig.predeploy) ? functionsConfig.predeploy : [];
  if (!predeploy.some((command) => command.includes('npm --prefix "$RESOURCE_DIR" run build'))) {
    deliveryError(firebaseJsonPath, 'Functions must build through a Firebase predeploy hook.');
  }
}

const apiRewrite = firebaseJson.hosting?.rewrites?.find(
  (rewrite) =>
    rewrite.source === '/api/**' &&
    rewrite.function?.functionId === 'api' &&
    rewrite.function?.region === 'europe-west1'
);
if (!apiRewrite) {
  deliveryError(firebaseJsonPath, 'Hosting must rewrite /api/** to the europe-west1 api Function.');
}

// La CSP dell'header `**` e' l'unica che raggiunge un browser: Hosting serve le
// pagine, la Function risponde solo su /api/**. Dal 2026-08-11 anche server.ts
// la legge da qui invece di tenerne una copia, quindi toglierla spegnerebbe la
// policy in produzione e fermerebbe l'avvio del self-host.
const hostingCspHeader = (firebaseJson.hosting?.headers ?? [])
  .filter((rule) => rule?.source === '**')
  .flatMap((rule) => (Array.isArray(rule.headers) ? rule.headers : []))
  .find((header) => header?.key === 'Content-Security-Policy');

if (!hostingCspHeader?.value) {
  deliveryError(
    firebaseJsonPath,
    'Hosting must declare a Content-Security-Policy header for source "**" (server.ts reads it from here).'
  );
}

const functionsPackage = JSON.parse(fs.readFileSync(functionsPackagePath, 'utf8'));
if (functionsPackage.main !== 'lib/index.js') {
  deliveryError(functionsPackagePath, 'Functions package entrypoint must be lib/index.js.');
}
if (!functionsPackage.scripts?.build) {
  deliveryError(functionsPackagePath, 'Functions package must define a build script.');
}
for (const dependency of ['firebase-functions', 'firebase-admin']) {
  if (!functionsPackage.dependencies?.[dependency]) {
    deliveryError(
      functionsPackagePath,
      'Functions package is missing runtime dependency ' + dependency + '.'
    );
  }
}

const functionsEntry = fs.readFileSync(functionsEntryPath, 'utf8');
// BREVO_LIST_ID non blocca le richieste come gli altri due, ma va dichiarato:
// senza, la newsletter cade su save-lead-only e il lead non arriva mai a Brevo.
for (const parameter of ['APP_URL', 'FIRESTORE_DATABASE_ID', 'BREVO_LIST_ID']) {
  if (!functionsEntry.includes("defineString('" + parameter + "'")) {
    deliveryError(
      functionsEntryPath,
      'Function must declare required parameter ' + parameter + '.'
    );
  }
}
// Solo i segreti che un endpoint legge davvero. `defineSecret` blocca il deploy
// finche' il segreto non esiste in Secret Manager, quindi elencarne uno di
// troppo costringe a creare una chiave per una funzionalita' spenta.
// OPENAI_API_KEY e ANTHROPIC_API_KEY servono al solo /api/ai-companion, che
// risponde 503 per progetto: rimetterli qui insieme all'implementazione RAG.
for (const secret of [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'BREVO_API_KEY',
  'GEMINI_API_KEY',
]) {
  if (!functionsEntry.includes("defineSecret('" + secret + "'")) {
    deliveryError(functionsEntryPath, 'Function must bind Secret Manager secret ' + secret + '.');
  }
}
if (
  !functionsEntry.includes('secrets: apiSecrets') ||
  !functionsEntry.includes('missingRequiredRuntimeConfig')
) {
  deliveryError(
    functionsEntryPath,
    'Function must bind its secrets and reject missing required runtime configuration.'
  );
}

const functionsEnvExample = fs.readFileSync(functionsEnvExamplePath, 'utf8');
for (const key of ['APP_URL', 'FIRESTORE_DATABASE_ID']) {
  if (!new RegExp('^' + key + '=', 'm').test(functionsEnvExample)) {
    deliveryError(functionsEnvExamplePath, 'Functions env template is missing ' + key + '.');
  }
}

const functionsGitignore = fs.readFileSync(functionsGitignorePath, 'utf8');
if (!functionsGitignore.includes('.env.*') || !functionsGitignore.includes('!.env.example')) {
  deliveryError(
    functionsGitignorePath,
    'Functions must ignore project-specific env files while tracking .env.example.'
  );
}

const ciWorkflow = fs.readFileSync(ciWorkflowPath, 'utf8');
if (
  !ciWorkflow.includes('npm ci --prefix functions') ||
  !ciWorkflow.includes('npm run functions:build') ||
  !ciWorkflow.includes('npm run functions:smoke')
) {
  deliveryError(
    ciWorkflowPath,
    'CI quality gate must install, build and smoke-test Firebase Functions.'
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
