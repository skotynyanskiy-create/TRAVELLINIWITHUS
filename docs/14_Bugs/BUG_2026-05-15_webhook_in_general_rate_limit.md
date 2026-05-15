---
type: bug
area: backend
severity: high
status: in-progress
priority: p0
owner: travellini-backend-engineer
opened: 2026-05-15
source: audit avanzato 2026-05-15
tags:
  - bug
  - backend
  - stripe
  - operations
---

# BUG_2026-05-15_webhook_in_general_rate_limit

## Sintesi

`/api/webhook` Stripe è sotto il `generalApiLimiter` (100 req / 15 min) montato a [server.ts:943](../../server.ts) tramite `app.use('/api/', generalApiLimiter)`. Durante un outage Stripe può fare burst di retry; un rate-limit globale può droppare webhook legittimi → ordini persi e gap nei dati.

## Posizione

[server.ts:943](../../server.ts) — applicazione middleware:

```ts
app.use('/api/newsletter-subscribe', newsletterLimiter);
app.use('/api/create-checkout-session', checkoutLimiter);
app.use('/api/contact-lead', contactLimiter);
app.use('/api/media-kit-lead', contactLimiter);
app.use('/api/', generalApiLimiter); // <-- include /api/webhook
```

## Fix proposto

Cambiare l'ultimo middleware in path-specific exclude del webhook:

```ts
// Exclude /api/webhook: Stripe gestisce backoff lato suo,
// un nostro rate-limit globale può droppare webhook legittimi.
app.use(/^\/api\/(?!webhook)/, generalApiLimiter);
```

## Severity rationale

**HIGH (operational risk)** — non c'è data loss certo, ma in caso di Stripe outage + retry burst l'ordine non viene persistito. Dopo 3 giorni di retry falliti, Stripe smette → ordine perso definitivamente.

## Link

- audit avanzato sezione §13 H3
- [[BUG_2026-05-15_products_downloadurl_public_read]]
