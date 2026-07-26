---
title: 'Evidenza — sicurezza'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Security & Defensive Audit — TRAVELLINIWITHUS

## 1. Static & Runtime Security Scans

- **Dependencies Audit (`npm audit`)**: 0 high/critical vulnerabilities detected in production dependencies. `[COMMAND, SECURITY]`
- **Secret Leak Scanner**: `.env` is properly listed in `.gitignore` and no private secret keys (`sk_live_`, `serviceAccount`) are committed in tracked source code files. `[FILE, SECURITY]`
- **Stripe Server Pricing Integrity**: Client checkout payload sends only product `id` and `quantity`. `server.ts` calculates prices authoritatively from database records. `[FILE, SECURITY]`
- **Stripe Webhook Signature**: `/api/webhook` reads the raw body (`express.raw`, mounted before `express.json`) and verifies every event with `stripe.webhooks.constructEvent`; it fails closed when the secret or the header is missing. Unsigned, malformed and forged-signature requests all return HTTP 400 — verified at runtime by `e2e/stripe-webhook-signature.spec.ts`. Orders are persisted idempotently on `orders/{stripeSessionId}`, so Stripe retries cannot duplicate them. `[PLAYWRIGHT, RUNTIME, SECURITY]`
- **Open gap**: no startup fail-fast when `STRIPE_WEBHOOK_SECRET` is missing in production — see `[AUDIT-008]` / `TASK-033`. `[FILE, SECURITY]`
- **Rate Limiting**: `express-rate-limit` middleware protects `/api/create-checkout-session` (20/15min) and `/api/contact-lead` (5/10min, shared with `/api/media-kit-lead`) against automated brute-force / spam attacks. Verified at runtime by `e2e/contact-rate-limit.spec.ts` — the 6th request returns HTTP 429. `[PLAYWRIGHT, RUNTIME, SECURITY]`
- **Protected Routes Guard**: `ProtectedRoute.tsx` verifies Firebase Auth state before rendering `/admin`, `/admin/editor`, `/admin/product-editor`. `[FILE, BROWSER]`

---

## 2. Cloud Configuration Recommendation

- **Firebase Web API Key**: exactly **one** real key exists in repository history (SHA-256 fingerprint `bfe5a2e6a546`), in `firebase-applet-config.json` and `docs/10_Projects/PROJECT_FIREBASE_HARDENING.md`; the working tree is clean and the value now comes from `VITE_FIREBASE_API_KEY` at build time. A Firebase Web API key is **public by design**, so rewriting history would not make it private — the fix is restriction, not rotation. Pending owner action on Google Cloud Console: HTTP referrer restriction on `apiKeyId 6f7a0fce-54de-428b-9931-69e308a32efb`. Runbook: `docs/20_Decisions/DECISION_FIREBASE_WEB_API_KEY_2026-07-23.md`. `[COMMAND, SECURITY]`
