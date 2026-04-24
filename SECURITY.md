# Security Policy — TRAVELLINIWITHUS

This repository powers the public website and marketing operations for the brand `@travelliniwithus`. Security is treated as a first-class concern because the site handles leads, payments (Stripe), authentication (Firebase), and admin flows.

## Reporting a vulnerability

Email the maintainer directly at **hello@travelliniwithus.it** with:

- a short description of the issue
- steps to reproduce (or a minimal PoC)
- impact assessment (data exposure, privilege escalation, etc.)
- any logs or screenshots, with secrets redacted

Please **do not** open public GitHub issues for security reports. Expect a first response within 72 hours.

Scope covered:

- this repository and its deployed site (`travelliniwithus.it`, `www.travelliniwithus.it`)
- Firestore rules in `firestore.rules` and security assumptions in `src/config/admin.ts`
- Stripe checkout / webhook flow (`server.ts`, `scripts/check-stripe.mjs`)

Out of scope:

- social-engineering, physical attacks, or third-party services we do not operate
- DoS/volumetric attacks
- findings on archived experiment repositories

## Secrets and environment variables

- The canonical template is `.env.example`. It is committed and **never** contains real values.
- Real values live only in `.env.local` (dev) and the deployment environment (Vercel / Firebase), and are ignored by git.
- Every integration is gated behind a guard clause: the site must build and run with zero external keys set. When adding a new integration, keep this contract.
- High-risk keys that must never be committed:
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  - `RESEND_API_KEY`, `BREVO_API_KEY`
  - `SENTRY_DSN` (server-side DSN)
  - `GEMINI_API_KEY`
  - any Firebase service-account JSON (`service-account*.json`)
- Claude Code hooks enforce these rules at the tool layer (see `.claude/settings.json`): reading `.env.local` / `.env.production` / service-account JSON / `*.pem` is blocked.

## High-risk files (owner confirmation required)

- `server.ts` — Express entry, CORS, rate limits, Stripe webhook
- `firestore.rules` — Firestore security rules
- `src/config/admin.ts` — admin whitelist / claim logic
- `firebase-applet-config.json`, `.firebaserc`, `vercel.json`, `firebase.json` — deploy topology

Any change to these files must be reviewed explicitly by the owner. Claude Code surfaces a warning through a `PreToolUse` hook on Edit/Write.

## Authentication and admin model

- Admin access is claim-based (Firebase custom claims). Email whitelist in `src/config/admin.ts` seeds initial grants via `npm run admin:grant`.
- Protected routes use `<ProtectedRoute>` + `useAuth().isAdmin`. Client-side checks are UX; Firestore rules are the real security boundary.

## Payments

- Checkout flow: Stripe Checkout Sessions created server-side (`server.ts`). The publishable key is the only Stripe value exposed to the browser.
- Price integrity is enforced server-side: never trust a client-supplied amount.
- Webhook signing secret (`STRIPE_WEBHOOK_SECRET`) verifies inbound events. Missing or invalid signatures → 400.

## Dependency hygiene

- Dependabot (`.github/dependabot.yml`) opens PRs weekly for npm + GitHub Actions.
- Run `npm audit` before a release tag. High/Critical advisories block the release until resolved or explicitly accepted in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
- `npm run audit:quality` runs typecheck, lint, test, build, UI audit, Firebase audit, Stripe audit, agent-stack audit, and Playwright quality suite.

## Incident response

See `docs/DISASTER_RECOVERY_RUNBOOK.md` for:

- Firestore restore procedure (from the scheduled backup workflow)
- Stripe webhook rotation
- Admin claim revocation

## Policy ownership

Owner: Denys / Travelliniwithus. Last reviewed: 2026-04-24.
