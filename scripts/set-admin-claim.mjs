#!/usr/bin/env node
/**
 * TRAVELLINIWITHUS — Admin Custom Claim Bootstrap
 *
 * Assegna o rimuove il custom claim `{ admin: true }` a un utente Firebase,
 * abilitando l'accesso admin tramite `request.auth.token.admin == true`
 * nelle regole Firestore (vedi `firestore.rules` → `isAdmin()`).
 *
 * Questo sostituisce la pratica di hardcoded email nelle regole: la mail
 * bootstrap resta come fallback finche non viene assegnato il claim.
 *
 * Requisiti:
 *   - Service account Firebase con ruolo "Firebase Authentication Admin".
 *   - Variabile d'ambiente `GOOGLE_APPLICATION_CREDENTIALS` (JSON path)
 *     oppure Application Default Credentials (ADC) configurate.
 *   - `firebase-admin` installato (gia presente in dependencies).
 *
 * Uso:
 *   node scripts/set-admin-claim.mjs grant <email>
 *   node scripts/set-admin-claim.mjs revoke <email>
 *   node scripts/set-admin-claim.mjs list
 *
 * Esempi:
 *   node scripts/set-admin-claim.mjs grant hello@travelliniwithus.it
 *   node scripts/set-admin-claim.mjs revoke old-admin@example.com
 *
 * Dopo il grant: l'utente deve effettuare logout + login oppure attendere
 * ~1h per la propagazione del token, oppure chiamare `user.getIdToken(true)`
 * lato client per forzare il refresh.
 */

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , command, emailArg] = process.argv;

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.log('Uso:');
  console.log('  node scripts/set-admin-claim.mjs grant <email>');
  console.log('  node scripts/set-admin-claim.mjs revoke <email>');
  console.log('  node scripts/set-admin-claim.mjs list');
  process.exit(message ? 1 : 0);
}

function initAdmin() {
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

  try {
    if (inlineJson) {
      const parsed = JSON.parse(inlineJson);
      return initializeApp({ credential: cert(parsed), projectId: parsed.project_id || projectId });
    }
    if (credsPath) {
      const json = JSON.parse(readFileSync(resolve(credsPath), 'utf8'));
      return initializeApp({ credential: cert(json), projectId: json.project_id || projectId });
    }
    return initializeApp({ credential: applicationDefault(), projectId });
  } catch (err) {
    console.error('Impossibile inizializzare firebase-admin.');
    console.error('Imposta GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT_JSON.');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

async function grant(email) {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  const nextClaims = { ...(user.customClaims ?? {}), admin: true };
  await auth.setCustomUserClaims(user.uid, nextClaims);
  console.log(`OK — claim admin=true assegnato a ${email} (uid=${user.uid}).`);
  console.log('L\'utente deve fare logout/login o chiamare user.getIdToken(true) lato client.');
}

async function revoke(email) {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  const current = user.customClaims ?? {};
  const { admin: _removed, ...rest } = current;
  await auth.setCustomUserClaims(user.uid, rest);
  console.log(`OK — claim admin rimosso da ${email} (uid=${user.uid}).`);
}

async function list() {
  const auth = getAuth();
  let pageToken;
  const admins = [];
  do {
    const page = await auth.listUsers(1000, pageToken);
    for (const user of page.users) {
      if (user.customClaims?.admin === true) {
        admins.push({ uid: user.uid, email: user.email, createdAt: user.metadata.creationTime });
      }
    }
    pageToken = page.pageToken;
  } while (pageToken);

  if (admins.length === 0) {
    console.log('Nessun utente con custom claim admin=true.');
    return;
  }
  console.log(`Admin attivi (${admins.length}):`);
  for (const a of admins) {
    console.log(`  - ${a.email ?? '(no email)'}  uid=${a.uid}  creato=${a.createdAt}`);
  }
}

async function main() {
  if (!command) usage('comando mancante');
  initAdmin();

  switch (command) {
    case 'grant':
      if (!emailArg) usage('email mancante per grant');
      await grant(emailArg);
      break;
    case 'revoke':
      if (!emailArg) usage('email mancante per revoke');
      await revoke(emailArg);
      break;
    case 'list':
      await list();
      break;
    case 'help':
    case '--help':
    case '-h':
      usage();
      break;
    default:
      usage(`comando sconosciuto: ${command}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
