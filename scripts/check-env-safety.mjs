import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const envPath = '.env';
const envExamplePath = '.env.example';

const requiredExampleKeys = [
  'APP_URL',
  'VITE_LITE_MODE',
  'MEDIA_KIT_URL',
  'LEAD_MAGNET_URL',
  'MAIL_FROM',
  'MAIL_TO_OWNER',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_CLUB_PRICE_ID',
  'RESEND_API_KEY',
  'BREVO_API_KEY',
  'BREVO_LIST_ID',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'AI_COMPANION_CORPUS_READY',
  'VITE_SENTRY_DSN',
  'SENTRY_DSN',
  'VITE_APP_VERSION',
  'VITE_GA_ID',
  'VITE_META_PIXEL_ID',
  'VITE_TIKTOK_PIXEL_ID',
  'VITE_AFFILIATE_SKYSCANNER_ID',
  'VITE_AFFILIATE_BOOKING_ID',
  'VITE_AFFILIATE_AIRALO_ID',
  'VITE_AFFILIATE_REVOLUT_ID',
  'VITE_MAPBOX_TOKEN',
  'VITE_FIREBASE_API_KEY',
  'VITE_USE_FIREBASE_EMULATOR',
  'VITE_RECAPTCHA_ENTERPRISE_SITE_KEY',
  'FIREBASE_SERVICE_ACCOUNT_JSON',
  'FIREBASE_SERVICE_ACCOUNT',
  'GEMINI_API_KEY',
  'ALLOW_MOCK_CHECKOUT',
  'VITE_TWU_AUDIT_MODE',
  'ADMIN_EMAIL',
  'OBSIDIAN_API_KEY',
  'SENTRY_ACCESS_TOKEN',
  'SENTRY_AUTH_TOKEN',
  'SENTRY_ORG',
  'GITHUB_PERSONAL_ACCESS_TOKEN',
];

const publicViteKeyAllowlist = new Set([
  'VITE_APP_VERSION',
  'VITE_FIREBASE_API_KEY',
  'VITE_GA_ID',
  'VITE_LITE_MODE',
  'VITE_MAPBOX_TOKEN',
  'VITE_META_PIXEL_ID',
  'VITE_RECAPTCHA_ENTERPRISE_SITE_KEY',
  'VITE_SENTRY_DSN',
  'VITE_TIKTOK_PIXEL_ID',
  'VITE_TWU_AUDIT_MODE',
  'VITE_USE_FIREBASE_EMULATOR',
  'VITE_AFFILIATE_SKYSCANNER_ID',
  'VITE_AFFILIATE_BOOKING_ID',
  'VITE_AFFILIATE_AIRALO_ID',
  'VITE_AFFILIATE_REVOLUT_ID',
]);

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, entries: [], invalidLines: [] };
  }

  const invalidLines = [];
  const entries = fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((raw, index) => ({ raw, line: index + 1 }))
    .filter(({ raw }) => raw.trim() && !raw.trim().startsWith('#'))
    .map(({ raw, line }) => {
      const match = raw.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) {
        invalidLines.push(line);
        return null;
      }

      const value = (match[2] ?? '').replace(/^['"]|['"]$/g, '');
      return {
        key: match[1],
        line,
        valueLength: value.length,
        value,
      };
    })
    .filter(Boolean);

  return { exists: true, entries, invalidLines };
}

function duplicateKeys(entries) {
  const seen = new Set();
  const duplicates = new Set();
  for (const { key } of entries) {
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return [...duplicates];
}

function status(value) {
  if (!value) return 'empty';
  if (/^\$\{[^}]+\}$/.test(value) || /^(changeme|change_me|your_|example|placeholder|xxx|todo|replace)/i.test(value)) {
    return 'placeholder';
  }
  return 'set';
}

function add(results, level, message) {
  results.push({ level, message });
}

function checkShape(key, value) {
  if (!value || status(value) === 'placeholder') return null;

  const checks = {
    STRIPE_SECRET_KEY: /^(sk|rk)_(test|live)_[A-Za-z0-9]+$/,
    STRIPE_WEBHOOK_SECRET: /^whsec_[A-Za-z0-9]+$/,
    STRIPE_CLUB_PRICE_ID: /^price_[A-Za-z0-9]+$/,
    GEMINI_API_KEY: /^AIza[0-9A-Za-z_-]{30,}$/,
    VITE_MAPBOX_TOKEN: /^(pk|sk)\.[A-Za-z0-9._-]+$/,
    GITHUB_PERSONAL_ACCESS_TOKEN: /^(ghp_|github_pat_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9_]+$/,
  };

  if (!checks[key]) return null;
  return checks[key].test(value);
}

function gitIgnored(filePath) {
  const result = spawnSync('git', ['check-ignore', '-q', filePath], { stdio: 'ignore' });
  return result.status === 0;
}

const example = parseEnvFile(envExamplePath);
const local = parseEnvFile(envPath);
const results = [];

console.log('Env safety audit');

if (!example.exists) {
  add(results, 'FAIL', '.env.example is missing.');
} else {
  add(results, 'PASS', '.env.example exists.');
}

if (local.exists) {
  add(results, gitIgnored(envPath) ? 'PASS' : 'FAIL', '.env exists and is ignored by Git.');
} else {
  add(results, 'WARN', '.env is missing locally; this is acceptable for CI but local integrations may be disabled.');
}

for (const [label, parsed] of [
  [envExamplePath, example],
  [envPath, local],
]) {
  if (!parsed.exists) continue;

  for (const line of parsed.invalidLines) {
    add(results, 'FAIL', `${label} has an invalid env assignment at line ${line}.`);
  }

  for (const key of duplicateKeys(parsed.entries)) {
    add(results, 'FAIL', `${label} has duplicate key ${key}.`);
  }
}

const exampleKeys = new Set(example.entries.map(({ key }) => key));
for (const key of requiredExampleKeys) {
  if (!exampleKeys.has(key)) {
    add(results, 'FAIL', `.env.example is missing ${key}.`);
  }
}

for (const { key, value, line } of example.entries) {
  const valueStatus = status(value);
  const sensitiveByName = /(SECRET|TOKEN|PASSWORD|PRIVATE|WEBHOOK|SENTRY|STRIPE|OPENAI|ANTHROPIC|GITHUB|BREVO|RESEND|OBSIDIAN|FIREBASE_SERVICE_ACCOUNT)/i.test(
    key
  );

  if (sensitiveByName && valueStatus === 'set' && !['APP_URL', 'MAIL_FROM', 'MAIL_TO_OWNER'].includes(key)) {
    add(results, 'FAIL', `.env.example has a non-empty sensitive-looking value for ${key} at line ${line}.`);
  }
}

if (local.exists) {
  const localKeys = new Set(local.entries.map(({ key }) => key));
  for (const { key, value } of local.entries) {
    const shape = checkShape(key, value);
    if (shape === false) {
      add(results, 'FAIL', `${key} is set but does not match the expected redacted format.`);
    }

    if (key.startsWith('VITE_') && /(SECRET|PRIVATE|PASSWORD)/i.test(key) && !publicViteKeyAllowlist.has(key)) {
      add(results, 'FAIL', `${key} looks like a private secret but would be exposed to the client bundle.`);
    }
  }

  for (const key of ['STRIPE_SECRET_KEY', 'APP_URL', 'VITE_LITE_MODE', 'ALLOW_MOCK_CHECKOUT']) {
    if (!localKeys.has(key)) {
      add(results, 'WARN', `.env is missing ${key}; related local behavior may be disabled.`);
    }
  }
}

const passCount = results.filter(({ level }) => level === 'PASS').length;
const warnCount = results.filter(({ level }) => level === 'WARN').length;
const failCount = results.filter(({ level }) => level === 'FAIL').length;

console.log(`PASS: ${passCount}`);
console.log(`WARN: ${warnCount}`);
console.log(`FAIL: ${failCount}`);

for (const { level, message } of results) {
  console.log(`${level.padEnd(4, ' ')} ${message}`);
}

process.exitCode = failCount > 0 ? 1 : 0;
