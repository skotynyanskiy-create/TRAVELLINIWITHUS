---
title: Migrazione admin auth a Firebase Custom Claims
type: decision
status: implemented
date: 2026-04-20
owner: skotynyanskiy@gmail.com
tags: [security, firebase, auth, admin]
---

# Decisione — Migrazione admin auth a Firebase Custom Claims

## Contesto

Prima di questa decisione, `firestore.rules` verificava l'accesso admin con tre meccanismi incrociati:
1. `request.auth.token.email == "skotynyanskiy@gmail.com" && email_verified` — email hardcoded.
2. `users/{uid}.role == 'admin'` letto da Firestore (richiede un lookup a ogni regola).
3. Allowlist in `src/config/admin.ts` replicata lato client.

Problemi:
- Email hardcoded = single point of failure; cambio owner o utilizzo di account dedicato (`admin@travelliniwithus.it`) richiede redeploy rules.
- Lookup Firestore a ogni regola = latenza e costo aggiuntivo.
- Tre fonti di verita duplicate (rules, Firestore doc, client code) = rischio drift.

## Decisione

Introduciamo **Firebase Custom Claims** come fonte primaria di autorizzazione admin. Il token ID dell'utente porta il claim `admin: true` assegnato via Firebase Admin SDK.

`firestore.rules` → `isAdmin()` verifica in ordine:
1. `request.auth.token.admin == true` (**primario**, zero letture extra, firmato da Firebase).
2. `users/{uid}.role == 'admin'` (legacy, per utenti non ancora migrati).
3. `request.auth.token.email == "skotynyanskiy@gmail.com" && email_verified` (fallback bootstrap, da rimuovere dopo migrazione completa).

## Implementazione

### File modificati
- [firestore.rules](../../firestore.rules) — nuova `isAdmin()` con controllo claim primario.
- [package.json](../../package.json) — nuovi script `admin:grant`, `admin:revoke`, `admin:list`.

### File nuovi
- [scripts/set-admin-claim.mjs](../../scripts/set-admin-claim.mjs) — CLI bootstrap custom claim.

## Runbook operativo

### Prerequisiti
1. Installare `firebase-admin` (gia nelle dependencies).
2. Ottenere una service account key da Firebase Console:
   - Project Settings → Service Accounts → Generate new private key.
   - Salvare il JSON **fuori dal repo** (es. `~/.firebase/travelliniwithus-admin.json`).
3. Esportare la credenziale:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.firebase/travelliniwithus-admin.json"
   ```
   In alternativa, su CI/CD, impostare `FIREBASE_SERVICE_ACCOUNT_JSON` con il contenuto JSON inline.

### Assegnare admin a un utente
```bash
npm run admin:grant -- hello@travelliniwithus.it
```
L'utente target deve aver effettuato almeno un login Google. Dopo il grant, l'utente deve:
- fare logout + login, oppure
- chiamare `user.getIdToken(true)` lato client per forzare il refresh del token.

### Rimuovere admin da un utente
```bash
npm run admin:revoke -- old-admin@example.com
```

### Listare admin attivi
```bash
npm run admin:list
```

### Rimozione fallback email (post-migrazione)
Quando almeno un account operativo ha il claim attivo e verificato:
1. Rimuovere il blocco `request.auth.token.email == "skotynyanskiy@gmail.com"` da `firestore.rules` → `isAdmin()`.
2. `firebase deploy --only firestore:rules`.
3. Testare login admin con l'account migrato prima di fare logout dall'owner originale.

## Verifica

- [ ] `npm run admin:list` ritorna almeno 1 utente con claim.
- [ ] Login con quell'utente → accesso a `/admin` → lettura di `/articles` draft OK.
- [ ] Login con utente senza claim ne ruolo → accesso negato.
- [ ] `firebase deploy --only firestore:rules` eseguito dopo modifiche rules.

## Trade-off

**Pro**
- Zero letture Firestore per auth check (claim nel token).
- Supporto multi-admin senza cambio codice.
- Separazione auth source vs profile data.

**Contro**
- Propagazione claim richiede refresh token (max ~1h senza force-refresh).
- Richiede service account key per il bootstrap (gestione sensibile).

## Riferimenti

- Firebase docs: https://firebase.google.com/docs/auth/admin/custom-claims
- [firestore.rules](../../firestore.rules)
- [scripts/set-admin-claim.mjs](../../scripts/set-admin-claim.mjs)
