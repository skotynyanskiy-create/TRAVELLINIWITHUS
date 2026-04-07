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

expectContains(
  serverContent,
  'stripe.webhooks.constructEvent',
  'Stripe webhook signature verification is present.',
  'Stripe webhook signature verification is missing.'
);

expectContains(
  serverContent,
  "event.type === 'checkout.session.completed'",
  'Webhook handles checkout.session.completed.',
  'checkout.session.completed handler not found.'
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

if (/body:\s*JSON\.stringify\(\{[\s\S]*price:/m.test(cartDrawerContent)) {
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
