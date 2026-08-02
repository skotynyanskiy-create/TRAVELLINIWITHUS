import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const envExamplePath = path.join(rootDir, '.env.example');

/**
 * Il percorso dei pagamenti lato server e' cambiato due volte: prima tutto in
 * `server.ts`, oggi nel router condiviso (`src/server/apiRoutes.ts`) che monta
 * sia il dev server sia la Cloud Function. Si legge l'insieme, cosi' il
 * controllo segue il codice invece di inseguirlo.
 */
const serverContent = ['server.ts', 'src/server/apiRoutes.ts', 'src/server/data.ts']
  .map((file) => fs.readFileSync(path.join(rootDir, file), 'utf8'))
  .join('\n');

/**
 * Il client del checkout **puo' non esistere**: da quando lo shop e' in lista
 * d'attesa (`Shop.tsx`, `disableCart`) non c'e' piu' `CartDrawer.tsx`, e questo
 * script moriva con ENOENT invece di fallire — cioe' i controlli Stripe non
 * giravano piu' affatto, e `audit:all` cadeva con lui.
 *
 * Si prende il primo file presente fra i candidati; il contratto vero («al
 * server vanno id e quantita', mai i prezzi») vive comunque in `CartContext`.
 */
const CANDIDATI_CLIENT = [
  'src/components/CartDrawer.tsx',
  'src/context/CartContext.tsx',
  'src/pages/Shop.tsx',
];
const clientPath = CANDIDATI_CLIENT.map((file) => path.join(rootDir, file)).find((file) =>
  fs.existsSync(file)
);
const cartDrawerContent = clientPath ? fs.readFileSync(clientPath, 'utf8') : '';
const checkoutLatoClient = /\/api\/create-checkout-session/.test(cartDrawerContent);

const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

const results = [];

function addResult(level, message) {
  results.push({ level, message });
}

function expectContains(content, needle, passMessage, failMessage) {
  if (content.includes(needle)) {
    addResult('PASS', passMessage);
  } else {
    addResult('FAIL', failMessage);
  }
}

/**
 * Come `expectContains` ma su espressione regolare.
 *
 * Serve perche' i controlli erano scritti sulle stringhe esatte `app.use(...)`
 * e `app.post(...)`: da quando le rotte stanno su un `express.Router()`
 * condiviso si chiamano `router.use` / `router.post`, e tre controlli davano
 * FAIL su codice corretto — rate limiter applicati e `express.raw` al posto
 * giusto. Un audit che fallisce per il nome della variabile insegna a
 * ignorarlo.
 */
function expectMatches(content, regex, passMessage, failMessage) {
  if (regex.test(content)) {
    addResult('PASS', passMessage);
  } else {
    addResult('FAIL', failMessage);
  }
}

expectContains(
  serverContent,
  'process.env.STRIPE_SECRET_KEY',
  'Server loads STRIPE_SECRET_KEY from env.',
  'Server does not appear to load STRIPE_SECRET_KEY from env.'
);

expectMatches(
  serverContent,
  /(?:app|router)\.use\('\/api\/create-checkout-session',\s*checkoutLimiter\)/,
  'Checkout endpoint is rate-limited.',
  'Checkout rate limiter not found on /api/create-checkout-session.'
);

// Limiter gemello, dichiarato nello stesso blocco di server.ts. Senza questa
// guardia si potrebbe rimuovere il mount del contactLimiter senza che nessuno
// script se ne accorga (regressione anti-spam silenziosa).
expectMatches(
  serverContent,
  /(?:app|router)\.use\('\/api\/contact-lead',\s*contactLimiter\)/,
  'Contact endpoint is rate-limited.',
  'Contact rate limiter not found on /api/contact-lead.'
);

expectContains(
  serverContent,
  'stripe.webhooks.constructEvent',
  'Stripe webhook signature verification is present.',
  'Stripe webhook signature verification is missing.'
);

// Senza il secret in produzione ogni evento cade nel ramo 400 e gli ordini
// pagati non vengono mai registrati, in silenzio. Fail-fast all'avvio, gemello
// del check APP_URL. Senza questa guardia il fail-fast potrebbe sparire da
// server.ts senza che nessuno se ne accorga (TASK-033 / AUDIT-008).
expectContains(
  serverContent,
  'isProd && !process.env.STRIPE_WEBHOOK_SECRET',
  'Server fails fast when STRIPE_WEBHOOK_SECRET is missing in production.',
  'Missing production fail-fast for STRIPE_WEBHOOK_SECRET; paid orders would be lost silently.'
);

// Il raw body e' il presupposto della verifica di firma: se qualcuno montasse
// express.json prima di questa route, constructEvent fallirebbe su OGNI evento
// e gli ordini sparirebbero in silenzio.
expectMatches(
  serverContent,
  /(?:app|router)\.post\('\/api\/webhook',\s*express\.raw\(/,
  'Webhook reads the raw body before signature verification.',
  'Webhook does not use express.raw; signature verification would break.'
);

expectContains(
  serverContent,
  "event.type === 'checkout.session.completed'",
  'Webhook handles checkout.session.completed.',
  'checkout.session.completed handler not found.'
);

// Stripe ritenta lo stesso evento per 3 giorni: senza chiave idempotente si
// creerebbero ordini duplicati a ogni retry.
expectContains(
  serverContent,
  'saveStripeOrder(order, event.id)',
  'Webhook persists orders idempotently using the Stripe event id.',
  'Webhook does not pass the Stripe event id to saveStripeOrder; retries could duplicate orders.'
);

expectContains(
  serverContent,
  "process.env.ALLOW_MOCK_CHECKOUT === 'true'",
  'Mock checkout fallback is present for local/dev flows.',
  'ALLOW_MOCK_CHECKOUT fallback not found.'
);

// Nessun checkout lato client non e' un errore: e' lo stato dichiarato dello
// shop (lista d'attesa). Va detto, non fatto fallire.
if (checkoutLatoClient) {
  addResult('PASS', 'Client checkout uses the create-checkout-session endpoint.');
} else {
  addResult(
    'INFO',
    'Nessuna chiamata di checkout lato client: shop in lista d’attesa, Stripe non è raggiungibile dal browser.'
  );
}

const checkoutPayloadMatch = cartDrawerContent.match(
  /body:\s*JSON\.stringify\(\s*\{(?<payload>[\s\S]*?)\}\s*\)\s*,?\s*\n\s*\}\s*\)/
);

if (checkoutPayloadMatch?.groups?.payload && /\bprice\s*:/.test(checkoutPayloadMatch.groups.payload)) {
  addResult('FAIL', 'Client appears to send a price field during checkout; server-side price integrity may be compromised.');
} else {
  addResult('PASS', 'Client checkout payload does not send price fields.');
}

expectContains(
  envExampleContent,
  'STRIPE_SECRET_KEY',
  '.env.example documents STRIPE_SECRET_KEY.',
  '.env.example does not document STRIPE_SECRET_KEY.'
);

expectContains(
  envExampleContent,
  'STRIPE_WEBHOOK_SECRET',
  '.env.example documents STRIPE_WEBHOOK_SECRET.',
  '.env.example does not document STRIPE_WEBHOOK_SECRET.'
);

expectContains(
  envExampleContent,
  'APP_URL',
  '.env.example documents APP_URL.',
  '.env.example does not document APP_URL.'
);

const failCount = results.filter((result) => result.level === 'FAIL').length;
const passCount = results.filter((result) => result.level === 'PASS').length;

console.log('Stripe audit');
console.log(`PASS: ${passCount}`);
console.log(`FAIL: ${failCount}`);

for (const result of results) {
  console.log(`${result.level.padEnd(4, ' ')} ${result.message}`);
}

process.exitCode = failCount > 0 ? 1 : 0;
