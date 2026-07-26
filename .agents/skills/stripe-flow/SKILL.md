---
name: stripe-flow
description: Audit the TRAVELLINIWITHUS Stripe checkout flow, including cart, server security, price integrity, webhooks, environment variables, and payment errors.
---

# /stripe-flow

Audit and verify the Stripe checkout flow in the TRAVELLINIWITHUS project.

## What to check

1. **Cart → Checkout Flow** — Trace the complete flow:
   - `CartContext` adds items to cart
   - Cart drawer shows items and total
   - Checkout button calls `/api/checkout` endpoint
   - `server.ts` creates Stripe session
   - Stripe redirects back to success/cancel URL
   - Order is saved in Firestore `orders` collection

2. **Server-Side Security** — In `server.ts`:
   - Stripe secret key loaded from env, never hardcoded
   - Webhook signature verification with `stripe.webhooks.constructEvent`
   - Rate limiting on checkout endpoint
   - CORS configured correctly

3. **Price Integrity** — Verify that product prices come from Firestore (server-side), not from client-submitted data. The client should send product IDs, not prices.

4. **Error Handling** — Check for:
   - Failed payment handling
   - Network error recovery
   - Duplicate order prevention
   - User feedback on success/failure

5. **Environment Variables** — Verify `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` are:
   - Loaded from `.env` (not hardcoded)
   - Not exposed in client bundle (only `VITE_` prefixed vars are client-safe)
   - `ALLOW_MOCK_CHECKOUT` flag works correctly for dev

6. **Webhook Handling** — Verify the Stripe webhook endpoint:
   - Handles `checkout.session.completed` event
   - Creates order in Firestore with correct data
   - Returns 200 to Stripe after processing

## Output

Report the flow status (working/broken/partial) with specific issues found. Include file paths and line numbers.

## Local CLI alternative (opt-in)

Per testare il webhook end-to-end senza tunnel esterno (ngrok/cloudflared):

- `npm run webhook:listen` — Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`. Stream eventi reali Stripe verso il dev server locale.
- `stripe trigger checkout.session.completed` — simula evento per test integrity webhook handler.
- `stripe events resend evt_xxx` — replay di un evento gia ricevuto in prod.

Install Windows: `scoop install stripe` o binary da [stripe.com/docs/stripe-cli](https://docs.stripe.com/stripe-cli).

**Nota su `npm run audit:stripe`:** lo script `scripts/check-stripe.mjs:69` ha una regex greedy che da' falso positivo quando il client traccia `price` in `trackEvent('begin_checkout', ...)`. Il client invia solo `{id, quantity}` al server. Vedi [docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md](../../docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md) sezione "Stripe CLI" per dettagli e fix proposto.

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `DESIGN.md` — design tokens, palette, typography and component conventions.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `docs/AI_AGENT_STACK.md` — current skills, agents, MCP policy.

Every finding must respect Italian public copy, premium editorial tone, and the release readiness gate documented in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
