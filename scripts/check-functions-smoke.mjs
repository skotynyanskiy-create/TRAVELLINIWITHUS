import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const bundlePath = path.join(rootDir, 'functions', 'lib', 'index.js');

if (!fs.existsSync(bundlePath)) {
  console.error(
    'Functions smoke test requires functions/lib/index.js. Run npm run functions:build first.'
  );
  process.exit(1);
}

// Il programma gira in un processo figlio con un env controllato: e' l'unico
// modo di verificare il comportamento della function *senza* la configurazione,
// visto che i parametri Firebase si leggono da process.env al primo accesso.
// L'import e' un URL assoluto perche' il figlio gira in una cwd temporanea:
// serve a NON far trovare `firebase-applet-config.json`. `loadFirebaseConfig`
// (src/server/data.ts:63-66) da' priorita' a quel file su `process.env`, quindi
// finche' il figlio partiva dalla radice del repo il `FIRESTORE_DATABASE_ID`
// impostato qui veniva ignorato e le prove che arrivano alla scrittura
// colpivano il database VERO. E' successo davvero il 2026-08-14.
const bundleUrl = pathToFileURL(bundlePath).href;
// Anche express va per percorso assoluto: dalla cartella temporanea la
// risoluzione per nome non trova `node_modules`.
const expressUrl = pathToFileURL(path.join(rootDir, 'node_modules', 'express', 'index.js')).href;

const program = [
  "import http from 'node:http';",
  `import express from '${expressUrl}';`,
  `import { api } from '${bundleUrl}';`,
  'const host = express();',
  'host.use(api);',
  'const server = http.createServer(host);',
  "await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));",
  'const { port } = server.address();',
  "const probePath = process.env.PROBE_PATH || '/api/health';",
  "const probeMethod = process.env.PROBE_METHOD || 'GET';",
  'const probeBody = process.env.PROBE_BODY;',
  'try {',
  "  const response = await fetch('http://127.0.0.1:' + port + probePath, {",
  '    method: probeMethod,',
  "    headers: probeBody ? { 'Content-Type': 'application/json' } : undefined,",
  '    body: probeBody,',
  '  });',
  "  const payload = await response.text();",
  "  console.log(probeMethod + ' ' + probePath + ' -> ' + response.status + ' ' + payload);",
  '  if (response.status !== Number(process.env.EXPECTED_STATUS)) process.exitCode = 1;',
  '} finally {',
  '  await new Promise((resolve) => server.close(resolve));',
  '}',
].join('\n');

const CONFIGURED = {
  APP_URL: 'https://example.test',
  FIRESTORE_DATABASE_ID: 'test-db',
  // Senza un projectId finto la config ripiegherebbe sull'ambiente reale.
  GCLOUD_PROJECT: 'smoke-test-project',
  GOOGLE_CLOUD_PROJECT: 'smoke-test-project',
};

// Cartella temporanea come cwd del figlio: e' cio' che impedisce a
// `firebase-applet-config.json` di sovrascrivere l'env di prova.
const sandboxDir = fs.mkdtempSync(path.join(os.tmpdir(), 'twu-smoke-'));

function runCase(label, { expectedStatus, set = {}, unset = [], expectStderr }) {
  const env = {
    ...process.env,
    ...set,
    EXPECTED_STATUS: String(expectedStatus),
    NODE_NO_WARNINGS: '1',
  };
  for (const key of unset) {
    delete env[key];
  }

  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', program], {
    cwd: sandboxDir,
    env,
    encoding: 'utf8',
  });

  const output = [result.stdout, result.stderr].filter(Boolean).join('').trim();
  let failed = result.status !== 0;

  if (expectStderr && !output.includes(expectStderr)) {
    console.error(`  atteso nel log: ${expectStderr}`);
    failed = true;
  }

  console.log(`${failed ? 'FAIL' : 'ok  '}  ${label}: ${output || 'no output'}`);

  if (failed) {
    process.exitCode = 1;
  }
}

// Il gate di configurazione: senza i parametri obbligatori l'API non serve nulla.
runCase('503 senza configurazione obbligatoria', {
  expectedStatus: 503,
  unset: ['APP_URL', 'FIRESTORE_DATABASE_ID'],
});

runCase('200 su /api/health con configurazione', {
  expectedStatus: 200,
  set: CONFIGURED,
});

// Prova che il router condiviso e' montato davvero e che il parsing JSON del
// body funziona nel bundle esbuild: un 404 qui significherebbe che il rewrite
// /api/** arriva a una function che non conosce i propri endpoint.
runCase('400 su POST /api/newsletter-subscribe con email non valida', {
  expectedStatus: 400,
  set: {
    ...CONFIGURED,
    PROBE_PATH: '/api/newsletter-subscribe',
    PROBE_METHOD: 'POST',
    PROBE_BODY: JSON.stringify({ email: 'non-una-email' }),
  },
});

// Regressione: BREVO_LIST_ID non era dichiarato fra i parametri della function,
// quindi la newsletter cadeva su save-lead-only senza dirlo a nessuno.
runCase('avviso quando BREVO_API_KEY e presente ma BREVO_LIST_ID manca', {
  expectedStatus: 200,
  set: { ...CONFIGURED, BREVO_API_KEY: 'smoke-test-key' },
  unset: ['BREVO_LIST_ID'],
  expectStderr: 'BREVO_LIST_ID non configurato',
});

// Regressione (2026-08-14): senza BREVO_API_KEY il ramo di avviso precedente non
// partiva, perche' richiedeva a sua volta la chiave — era il caso piu' frequente
// e il piu' silenzioso. E il salvataggio del lead segnava comunque successo,
// quindi il server rispondeva 200 per un'iscrizione finita nel nulla.
// FIRESTORE_DATABASE_ID punta a un database inesistente apposta: la scrittura
// fallisce, nessun documento viene creato, e il gate 503 deve scattare.
runCase('503 e avviso quando BREVO_API_KEY manca e il lead non si salva', {
  expectedStatus: 503,
  set: {
    ...CONFIGURED,
    PROBE_PATH: '/api/newsletter-subscribe',
    PROBE_METHOD: 'POST',
    PROBE_BODY: JSON.stringify({ email: 'smoke@example.test', source: 'smoke-test' }),
  },
  unset: ['BREVO_API_KEY', 'BREVO_LIST_ID'],
  expectStderr: 'BREVO_API_KEY assente',
});
