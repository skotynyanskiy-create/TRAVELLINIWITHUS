import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const serverPath = path.join(rootDir, 'server.ts');
const cartDrawerPath = path.join(rootDir, 'src', 'components', 'CartDrawer.tsx');
const envExamplePath = path.join(rootDir, '.env.example');

const serverContent = fs.readFileSync(serverPath, 'utf8');
const cartDrawerContent = fs.readFileSync(cartDrawerPath, 'utf8');
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

expectContains(
  serverContent,
  'process.env.STRIPE_SECRET_KEY',
  'Server loads STRIPE_SECRET_KEY from env.',
  'Server does not appear to load STRIPE_SECRET_KEY from env.'
);

expectContains(
  serverContent,
  "app.use('/api/create-checkout-session', checkoutLimiter);",
  'Checkout endpoint is rate-limited.',
  'Checkout rate limiter not found on /api/create-checkout-session.'
);

// Limiter gemello, dichiarato nello stesso blocco di server.ts. Senza questa
// guardia si potrebbe rimuovere il mount del contactLimiter senza che nessuno
// script se ne accorga (regressione anti-spam silenziosa).
expectContains(
  serverContent,
  "app.use('/api/contact-lead', contactLimiter);",
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
expectContains(
  serverContent,
  "app.post('/api/webhook', express.raw({ type: 'application/json' })",
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

expectContains(
  cartDrawerContent,
  "/api/create-checkout-session",
  'Client checkout uses the create-checkout-session endpoint.',
  'Client checkout endpoint call not found.'
);

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
