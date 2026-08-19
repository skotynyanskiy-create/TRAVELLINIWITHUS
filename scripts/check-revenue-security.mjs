import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assertCheck(name, condition, detail) {
  checks.push({ name, ok: Boolean(condition), detail });
}

/**
 * Il webhook Stripe non vive piu' in `server.ts`: dallo stadio 2 del refactor
 * sta nel router condiviso (`src/server/apiRoutes.ts`), che monta sia il server
 * di sviluppo sia la Cloud Function, e la persistenza sta nel data layer
 * (`src/server/data.ts`).
 *
 * Questo script leggeva solo `server.ts` e dava **quattro FAIL su codice
 * corretto**. Un audit di sicurezza che guarda il file sbagliato e' peggio di
 * nessun audit: o grida al lupo, o — se qualcuno lo "aggiusta" spostando il
 * codice sotto il suo naso — rassicura a vuoto. Qui si concatenano i file che
 * compongono davvero il percorso dei soldi, cosi' il controllo segue il codice
 * anche se si sposta di nuovo.
 */
const PERCORSO_PAGAMENTI = ['server.ts', 'src/server/apiRoutes.ts', 'src/server/data.ts'];
const server = PERCORSO_PAGAMENTI.map((file) => read(file)).join('\n');
const rules = read('firestore.rules');
const cart = read('src/context/CartContext.tsx');

assertCheck(
  'client-cannot-create-final-orders',
  /match\s+\/orders\/\{orderId\}/.test(rules) && /allow\s+create:\s*if\s+false\s*;/.test(rules),
  'Firestore rules must deny client-side order creation.'
);

assertCheck(
  'webhook-persists-orders-server-side',
  /async function saveStripeOrder/.test(server) && /stripeSessionId/.test(server),
  'Stripe checkout.session.completed must persist an order from the server.'
);

assertCheck(
  'stripe-session-is-idempotency-key',
  /collection\('orders'\)\.doc\(order\.stripeSessionId\)/.test(server),
  'Order document id must be stripeSessionId.'
);

assertCheck(
  'webhook-uses-create-not-overwrite',
  /await orderRef\.create\(\{[\s\S]*\.\.\.order[\s\S]*\}\)/.test(server),
  'Webhook must create once and treat already-exists as duplicate replay.'
);

assertCheck(
  'webhook-fails-closed-on-persistence-error',
  /failed to persist order/i.test(server) && /res\.status\(500\)\.json/.test(server),
  'Firestore/admin persistence errors must return non-2xx so Stripe retries.'
);

assertCheck(
  'client-sends-checkout-intent-not-trusted-price',
  /const getCheckoutItems = \(\) => items\.map\(\(\{ id, quantity \}\) => \(\{ id, quantity \}\)\)/.test(
    cart
  ),
  'Checkout request must send ids/quantities only; server owns prices.'
);

const failures = checks.filter((check) => !check.ok);

for (const check of checks) {
  const prefix = check.ok ? 'PASS' : 'FAIL';
  console.log(`[audit:revenue] ${prefix} ${check.name} - ${check.detail}`);
}

if (failures.length > 0) {
  console.error(`[audit:revenue] ${failures.length} revenue/security checks failed.`);
  process.exitCode = 1;
} else {
  console.log('[audit:revenue] Revenue/security contract checks passed.');
}
