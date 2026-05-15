---
name: firebase-check
description: Audit Firebase and Firestore usage in TRAVELLINIWITHUS for published filters, timestamps, limits, error handling, security rules, and client-side safety.
---

# /firebase-check

Audit Firebase/Firestore usage in the TRAVELLINIWITHUS project.

## What to check

1. **Published Filter** — Every public-facing query on `articles` and `products` collections MUST include `where('published', '==', true)`. Check `src/services/firebaseService.ts` and any other file that queries Firestore.

2. **Timestamps** — All `setDoc`, `addDoc`, `updateDoc` calls must use `serverTimestamp()` for `createdAt` and `updatedAt` fields. Flag any `new Date()` or `Date.now()` usage for these fields.

3. **Query Limits** — All `getDocs` queries should include `limit()` to prevent unbounded reads. Flag queries without limits.

4. **Error Handling** — Firestore operations must have proper try/catch with meaningful error messages. Flag any swallowed errors or missing catch blocks.

5. **Security Rules Alignment** — Read `firestore.rules` and verify that:
   - Public reads require `published == true`
   - Writes to `leads` allow anonymous
   - Admin operations check auth + role
   - No overly permissive rules (`allow read, write: if true`)

6. **Client-Side Safety** — Verify no Firebase config, API keys, or admin credentials are exposed in client-side code (check for hardcoded strings in `src/`).

7. **Index Requirements** — Check if queries use compound `where` + `orderBy` that would require composite indexes. List any that might need manual index creation.

## Output

Report findings with file paths, line numbers, and severity. Group by category.

## Local CLI alternative (opt-in)

Per diagnosticare problemi di rules / permissions senza toccare prod:

- `npm run emulators` — avvia Firestore + Auth emulator locali. Setup richiesto: `firebase.json` con sezione `emulators` + `connectFirestoreEmulator(db, 'localhost', 8080)` in `src/services/firebaseInit.ts` quando `VITE_USE_FIREBASE_EMULATOR=true`.
- `firebase emulators:exec "npm test"` — esegue test isolati contro emulator.
- `npm run audit:secrets` — gitleaks scan per leak di `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_ADMIN_*` in repo o staged files.

Cruciale per [BUG_FIRESTORE_ARTICLES_PERMISSIONS](../../docs/14_Bugs/BUG_FIRESTORE_ARTICLES_PERMISSIONS.md). Dettagli in [docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md](../../docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md).

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
