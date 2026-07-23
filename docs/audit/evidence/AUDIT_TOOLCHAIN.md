---
title: 'Evidenza — toolchain di audit'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Audit Toolchain & Verification Infrastructure (Passaggio 4)

## 1. Toolchain & Testing Environment

- **Execution Runtime**: Node.js v22.22.2 (`pwsh` shell on Windows 11) `[COMMAND]`
- **Local Test Server**: Express + Vite SSR Server (`http://localhost:3000`) `[COMMAND, RUNTIME]`
- **Browser Automation & Testing Suite**:
  - Playwright E2E framework (`@playwright/test` v1.61.0) `[CONFIG]`
  - Playwright Chromium engine `[COMMAND]`
  - Vitest unit test runner (`vitest` v4.1.9) `[COMMAND]`
  - ESLint static code analyzer (`eslint` v9.39.4) `[COMMAND]`
  - TypeScript compiler (`tsc` v5.8.2) `[COMMAND]`
- **Audit Domain Scripts (`scripts/`)**:
  - `check-stripe.mjs` (Stripe contract & rate-limit static string checks)
  - `check-firebase.mjs` (Firestore rules & SDK query checks)
  - `check-revenue-security.mjs` (Order idempotency and price integrity checks)
  - `check-ui.mjs` (Tailwind non-brand palette utility checks)
  - `check-public-footprint.mjs` (Analytics tracking and bio click checks)
  - `check-graphify.mjs` (Code knowledge graph index checks)
  - `audit-obsidian.mjs` (Vault markdown reference checks)
  - `check-env-safety.mjs` (Environment variable leak checks)

---

## 2. Reversibility & Workspace Isolation

- **Isolated Evidence Directory**: `docs/audit/evidence/` `[FILE]`
- **Workbench Workspace**: `.audit-workbench/` `[FILE]`
- **Application Code Policy**: **Strict Zero Code Mutation**. No bug fixes, refactoring, dependency upgrades, or configuration overrides executed on production code files. All diagnostics run via read-only inspection, terminal commands, HTTP requests, and browser rendering.
