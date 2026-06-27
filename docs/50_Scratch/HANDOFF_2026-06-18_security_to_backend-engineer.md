---
title: HANDOFF_security-hardening-2026-06-18_security-auditor_to_backend-engineer
status: open
created: 2026-06-18
from: travellini-security-auditor
to: travellini-backend-engineer
slug: security-hardening-2026-06-18
expires: 2026-07-02
---

# Handoff: hardening security pre-deploy "definitivo" (oltre i blocker owner noti)

## Why this work matters

Audit fresh-eyes da pentester: nessun CRITICAL nuovo, history git pulita da segreti
reali, rules tight, Stripe webhook solido. I rischi residui sono operativi/supply-chain
e portano il voto da 7.5 a ~9/10. Da chiudere prima del deploy pubblico "definitivo".

## Decisions already made (non rilitigare)

- Git history e' CLEAN: 0 valori segreti reali (sk*live*/whsec\_ full-length: 0; private key: 0).
  I match -S sono placeholder in file SKILL stripe-flow + pattern-list nell'agent .md. NON serve history rewrite per questi.
- VITE\_\* e' pulito: zero segreti reali nel bundle. GEMINI_API_KEY gia' de-bundlizzata correttamente.
- Webhook Stripe: signature verify + idempotenza (doc-id = stripeSessionId) + price server-lookup = OK. Non toccare la logica core.
- success_url/cancel_url gia' server-constants con fail-fast su APP_URL = OK.
- I blocker owner NOTI (rotazione Firebase Web key su GCP + 3 leak storici gcp-api-key + env prod) restano owner-side, fuori scope di questo handoff.

## Context the receiver needs

- Source files (high-risk, richiedono conferma owner):
  - [server.ts] — coupon F3 (1640-1671), CSP F4 (1048-1057), metadata cartItems F6 (1685, fallback 1211-1218), CORP F9, log PII F10 (1385,1478), admin email F7 (1707)
  - [firestore.rules] — admin email hardcoded F7 (riga 84)
  - [firebase.json] — CSP F4 (riga 54), header CORP F9
  - [src/config/admin.ts] — allow-list F7
- Client (deleghi a frontend-builder): [src/lib/firebaseApp.ts] App Check F1, [src/services/firebaseService.ts:453] dead-code addDoc(orders)
- Related: [docs/10_Projects/PROJECT_FIREBASE_HARDENING.md] (Fase 3 App Check + Fase 4 untrack config gia' specificate)

## What the receiver should produce

Fix prioritizzati (server-side, con conferma owner sui 3 file high-risk):

- **F2 / quick (no high-risk file):** `npm audit fix` (no --force). Patcha ws/vite/launch-editor + parte grpc. firebase-admin@14 in branch separato.
- **F5 / quick:** aggiungere `.husky/pre-push` con `npm run audit:secrets` (gitleaks full-tree).
- **F1 (P1):** Firebase App Check reCAPTCHA Enterprise — chiude scrittura REST diretta su leads/users che bypassa il rate-limit Express. Codice gia' abbozzato in PROJECT_FIREBASE_HARDENING.md Fase 3. Enforcement dopo baseline.
- **F3 (P2):** sostituire stripe.coupons.create() per-checkout con coupon pre-creati / promotion_codes (evita coupon-object orfani).
- **F6 (P2):** persistere carrello server-side pre-checkout (doc Firestore), referenziare ID in metadata invece di cartItems JSON (evita troncamento 500-char + fallback che perde downloadUrl).
- **F4 (P2, L):** CSP script-src senza 'unsafe-inline' (nonce/hash) in firebase.json + server.ts.
- **F9 / quick:** header `Cross-Origin-Resource-Policy: same-origin` accanto a COOP.
- **F7 (P3):** allineare/centralizzare admin allow-list (admin.ts + rules:84 + server.ts:1707); idealmente custom claims.
- **F8 (P3):** untrack firebase-applet-config.json, costruire config da env (Fase 4 doc).
- **F10 (P3):** redarre email nei console.error o verificare sink log non indicizza PII.

## Out of scope (do NOT touch)

- Logica di verifica firma webhook / idempotenza / price-lookup (gia' corretta).
- Rotazione Firebase Web key e leak storici (owner-side).
- Qualsiasi rewrite della git history (non necessario).

## Open questions / decisions for the user

- Conferma owner per editare server.ts / firestore.rules / admin.ts (richiesta dal protocollo high-risk file).
- firebase-admin@14 e' semver-major: vuoi testarlo in branch prima del bump?
- App Check: setup console GCP/Firebase e' owner-side (reCAPTCHA Enterprise key). Coordinare prima di abilitare l'enforcement.

## Next hand-off

- Next agent: browser-auditor (verifica reale CSP/headers dopo F4) + travellini-quality-auditor (re-audit + Dependabot/CI gate)
- Trigger: F4 mergiato e App Check in unenforced mode

## Notes

- npm audit: 27 vuln (12 high). Highlight runtime: @grpc/grpc-js CVSS 7.5 (DoS su firebase-admin, path webhook), ws memory disclosure.
- seedTestData (firebaseService.ts:426) e' admin-gated da AdminDashboard e comunque bloccato da `orders create: if false` — l'addDoc(orders) e' innocuo ma da rimuovere per igiene.
- OAuth: signInWithPopup Firebase, nessun redirect URI custom da validare (gestito da authorized domains in console).
