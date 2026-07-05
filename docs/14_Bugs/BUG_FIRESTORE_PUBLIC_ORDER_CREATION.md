---
type: bug
area: security
status: in-progress
priority: p1
owner: team
severity: high
repo: TRAVELLINIWITHUS
route:
  - /shop
related:
  - [[10_Projects/PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15]]
  - [[10_Projects/PROJECT_RELEASE_READINESS]]
source: advanced full site audit 2026-05-15
tags:
  - bug
  - firebase
  - firestore
  - stripe
  - security
---

# BUG - Firestore allows public order creation

## Sintomo

Le regole Firestore consentono la creazione pubblica di documenti `orders` validati da `isValidOrder()`. Il client puo potenzialmente fornire `status`, `total`, `items`, `userId`, `stripeSessionId` e creare ordini non provenienti dal webhook Stripe.

## Impatto

- Integrita ordini non garantita.
- Reporting revenue falsabile.
- Possibili ordini `completed` non pagati.
- Dati admin e fulfillment non affidabili.

## Repo context

- repo_path: `firestore.rules`
- high-risk: `firestore.rules`
- related code: Stripe webhook in `server.ts`

## Riproduzione

1. Ispezionare `firestore.rules`.
2. Verificare `match /orders/{orderId}` e `isValidOrder()`.
3. Confermare che una create anonima puo includere campi critici non server-owned.

## Fix

- Rendere `orders` scrivibili solo da server/admin o da percorso controllato.
- Se serve client draft order, separare `checkoutAttempts` da `orders`.
- Vietare client-set di `status: completed`, `total`, `stripeSessionId`.
- Considerare Cloud Function / server endpoint come unica source of truth per order finalization.

## Test

- Emulator suite per rules: anonymous create order deve fallire.
- Webhook Stripe deve poter creare/upsertare ordine.
- Admin read/update deve restare permesso secondo policy.

## Root cause

Le rules proteggono la forma del documento ma non abbastanza la proprieta dei campi economici.

## Fix 2026-05-15

- `firestore.rules`: `orders` non accetta piu create pubbliche dal client.
- `server.ts`: il webhook Stripe usa `firebase-admin` per creare l'ordine finale lato server.
- La creazione ordine finale non dipende piu da write client-side su Firestore.
- `scripts/check-revenue-security.mjs`: nuovo `npm run audit:revenue` verifica automaticamente il contratto statico.

## Test ancora richiesto

- `npm run audit:revenue` PASS il 2026-05-15.
- Eseguire test webhook con Stripe CLI e credenziali admin reali.
- Verificare che una create anonima su `orders` fallisca in emulator suite.
