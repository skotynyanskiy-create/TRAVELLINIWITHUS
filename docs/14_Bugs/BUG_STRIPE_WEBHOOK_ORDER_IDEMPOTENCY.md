---
type: bug
area: backend
status: done
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
  - stripe
  - webhook
  - orders
  - revenue
---

# BUG - Stripe webhook order creation is not idempotent

## Sintomo

Il webhook `checkout.session.completed` crea un ordine Firestore senza lookup/upsert robusto su `stripeSessionId`. Se la scrittura Firestore fallisce, l'errore viene loggato ma la route webhook puo comunque rispondere success, impedendo retry Stripe.

## Impatto

- Duplicati ordine su retry/event replay.
- Ordini pagati persi se Firestore fallisce.
- Email di conferma e fulfillment non affidabili.
- Revenue operations fragili appena lo shop diventa reale.

## Repo context

- repo_path: `server.ts`
- high-risk: `server.ts`
- related: Stripe checkout + Firestore orders

## Riproduzione

1. Ispezionare handler `checkout.session.completed` in `server.ts`.
2. Verificare creazione documento ordine.
3. Simulare errore Firestore o replay evento.
4. Osservare assenza di upsert/unique guard su `stripeSessionId`.

## Fix

- Usare `stripeSessionId` come chiave idempotente o unique indexed field.
- Prima di creare, cercare ordine esistente con stesso `stripeSessionId`.
- In caso di errore persistente Firestore, rispondere non-2xx al webhook per consentire retry Stripe.
- Salvare anche `stripeEventId` per replay protection.

## Test

- Unit/integration test: stesso evento due volte produce un solo ordine.
- Test errore Firestore: webhook non torna 2xx.
- Test happy path: ordine creato e email conferma inviata una sola volta.

## Root cause

Il webhook tratta l'evento come one-shot invece di usare una write idempotente.

## Fix 2026-05-15

- `server.ts`: l'ordine webhook viene scritto con document id uguale a `stripeSessionId`.
- Replay dello stesso `checkout.session.completed` non crea duplicati.
- Se la persistenza ordine fallisce, il webhook torna 500 invece di success silenzioso.
- Gli errori checkout lato client non espongono piu messaggi raw Stripe.
- `scripts/check-revenue-security.mjs`: nuovo `npm run audit:revenue` blocca regressioni su chiave idempotente, `create()` e fail-closed.

## Test ancora richiesto

- `npm run audit:revenue` PASS il 2026-05-15.
- Stripe CLI replay: stesso evento due volte deve produrre un solo ordine.
- Simulazione errore Firestore/admin credentials: webhook deve tornare non-2xx.

## Chiusura — 2026-07-31

Verificato sul codice durante il consolidamento del backlog: `src/server/apiRoutes.ts:228` → `saveStripeOrder(order, event.id)`, idempotente sull'id evento Stripe.

Nessun lavoro residuo. Vedi [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]] §4.
