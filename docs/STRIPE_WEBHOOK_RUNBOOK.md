---
title: Stripe Webhook — Production Runbook
type: runbook
status: active
date: 2026-04-20
owner: Rodrigo
tags: [stripe, payments, webhook, deploy]
---

# Stripe Webhook — Production Runbook

Il webhook è il punto in cui un pagamento riuscito diventa un ordine reale in Firestore e una mail al cliente. Se è rotto o non configurato in produzione, ogni acquisto va a buon fine su Stripe ma il sito non lo registra. Questo runbook serve per non farlo succedere.

## Stato del codice

- Endpoint: `POST /api/webhook` in [server.ts:801](../server.ts).
- Signature verification: `stripe.webhooks.constructEvent` sul raw body + `STRIPE_WEBHOOK_SECRET`.
- Evento gestito: `checkout.session.completed` → crea doc in `orders/` via REST Firestore.
- Guard: se `STRIPE_SECRET_KEY` o `STRIPE_WEBHOOK_SECRET` mancano, l'endpoint risponde 400 senza crashare.

Il codice è production-ready dal punto di vista logico. Quello che manca in produzione è la **configurazione degli endpoint Stripe + env vars + primo smoke test**.

## Requisiti pre-attivazione

- Account Stripe attivo (live mode) con Identity/Business verificata.
- Dominio `travelliniwithus.it` collegato a Firebase Hosting / Vercel.
- Deploy produzione del backend Express raggiungibile da `https://travelliniwithus.it/api/webhook` (o sub-domain API).
- Almeno 1 prodotto reale in Firestore `products/` con `published: true` e `price > 0`.

## Setup Stripe (live mode)

### 1. Crea endpoint webhook

Stripe Dashboard → Developers → Webhooks → **Add endpoint**

- URL: `https://travelliniwithus.it/api/webhook`
- API version: usa la stessa pinata in `server.ts` (`2026-02-25.clover`). Aggiorna se Stripe la deprecaria.
- Eventi da ascoltare (minimo):
  - `checkout.session.completed`
  - `checkout.session.expired` (per analytics future)
  - `payment_intent.payment_failed` (per alert)
- Copia il "Signing secret" (`whsec_...`).

### 2. Setup env vars di produzione

Vercel (o host backend):

| Variabile | Valore |
|-----------|--------|
| `STRIPE_SECRET_KEY` | `sk_live_...` da Stripe Dashboard → API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` dal passo 1 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (usato client-side) |
| `APP_URL` | `https://travelliniwithus.it` |
| `MAIL_TO_OWNER` | email ordini |

> Dopo l'aggiornamento env: **forza redeploy**. Vercel/Firebase non rileggono le env per i container già running.

### 3. Abilita il prodotto reale

Nel pannello admin (`/admin/products/new`):
- `published = true`
- `price > 0`
- `isDigital = true` + `downloadUrl` valido se guida PDF
- `stock` coerente (o illimitato per digital)

## Smoke test (obbligatorio post-deploy)

Esegui in quest'ordine. Se anche uno solo fallisce, **rollback della env var `published` del prodotto** finché non fixato.

### A — Test su carta di test (anche in live mode) — NO

> In live mode le carte test `4242` non funzionano. Per smoke test usa Stripe **test mode** prima di live, e solo dopo un pagamento reale di importo minimo.

### A — Smoke in test mode

1. Switcha env a Stripe test keys (`sk_test_...`, `whsec_test_...`) in ambiente staging.
2. Esegui checkout con carta `4242 4242 4242 4242`, data futura, CVC qualsiasi.
3. Verifica:
   - Stripe Dashboard (test) → Events → `checkout.session.completed` ✅
   - Stripe Dashboard (test) → Webhook endpoint → Delivered 200 ✅
   - Firebase console → collection `orders/` → nuovo documento con tutti i campi ✅
   - Email conferma arrivata al buyer (controlla SPAM) ✅

### B — Smoke in live mode (pagamento reale minimo)

Dopo che A è passato:

1. Attiva live keys in produzione.
2. Esegui acquisto reale di 1 prodotto minimo (es. guida 5€) usando la tua card.
3. Ripeti le 4 verifiche di A in live mode.
4. Rimborsa tramite Stripe Dashboard (test completato).

### C — Test di error handling

1. In Stripe Dashboard → Webhooks → endpoint → **Send test webhook** → scegli evento random (es. `invoice.created`) → invia.
2. Il server dovrebbe rispondere 200 (evento ignorato) senza crashare.
3. Modifica temporaneamente il webhook secret errato → triggera un pagamento → verifica che il server risponda 400 con "signature verification failed" nei log.

## Monitoraggio continuo

- **Stripe Dashboard → Webhooks**: setta alert mail se delivery fallisce > 3 volte consecutive.
- **Sentry** (quando attivato, vedi [DECISION_ERROR_TRACKING_STRATEGY.md](20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md)): filtro per `source: express-error-middleware` + `path: /api/webhook`.
- **Firebase console**: verifica settimanale che `orders/` riceva entry coerenti con Stripe payments.
- **Dashboard Stripe**: reconcile mensile tra Stripe volume e Firestore orders count. Devono essere uguali ±0.

## Procedura in caso di incidente

### "Pagamento ricevuto ma ordine mancante in Firestore"

1. Stripe Dashboard → Payments → localizza il pagamento → copia `checkout.session.id`.
2. Controlla Webhook endpoint → Events → trova l'evento corrispondente.
3. Se stato = Failed, apri l'evento → **Resend** (Stripe ritriga il webhook).
4. Se stato = Delivered ma nessun record in `orders/`: verifica log server. Probabile fail su fetch Firestore REST — controlla `firebase-applet-config.json` presente in deploy.
5. Fallback manuale: inserisci l'ordine a mano in Firestore copiando i campi dal session Stripe.

### "Duplicati in orders/"

Il webhook è idempotente a livello di evento (Stripe ritenta con stesso id), ma il codice **non fa upsert**. Se noti duplicati: apri bug in `docs/14_Bugs/` e pianifica fix con `orders/` chiave = `stripeSessionId`.

### "Signature verification failed" persistente

- Verifica che il secret in env corrisponda esattamente a quello mostrato da Stripe (niente whitespace, spesso copy/paste include trailing space).
- Verifica che il body arrivi raw: in Express, il middleware `express.raw({ type: 'application/json' })` DEVE precedere `express.json()` globale. Nel file attuale è inline sulla route — ok.

## Cosa NON è coperto (ancora)

- Riconciliazione automatica orders → Stripe payments.
- Gestione refund (evento `charge.refunded` non ascoltato).
- Webhook su Payment Links (questo endpoint copre solo Checkout Sessions).

Questi sono gap accettabili per lo sprint 1. Vanno pianificati in sprint 2-3 quando il volume lo giustifica.

## Riferimenti

- [server.ts](../server.ts) — endpoint `/api/webhook`
- [src/pages/Shop.tsx](../src/pages/Shop.tsx) — checkout client
- Stripe docs: https://docs.stripe.com/webhooks
- Stripe CLI per test locali: https://docs.stripe.com/stripe-cli
