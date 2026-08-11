import fs from 'node:fs';
import path from 'node:path';
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
const program = [
  "import http from 'node:http';",
  "import express from 'express';",
  "import { api } from './functions/lib/index.js';",
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
};

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
    cwd: rootDir,
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
