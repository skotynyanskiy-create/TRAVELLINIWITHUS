---
name: security-audit
description: Run a full web-stack security audit via travellini-security-auditor. Covers secrets in repo/history, Stripe webhook integrity, Firestore rules, Vite VITE_* env exposure, CORS, security headers, admin gate, rate limits. Use before first commit, before any deploy, before sharing repo access, after edits to server.ts/firestore.rules/admin.ts, or on a regular cadence (every 2-4 weeks).
---

# /security-audit

Read-only gate. Reports findings, never applies fixes.

## When to use

- Before first commit to a fresh branch
- Before any deploy to production
- After modifying `server.ts`, `firestore.rules`, `src/config/admin.ts`, Stripe handlers, or env files
- Before sharing repo access with a new collaborator
- On a 2-4 week cadence as drift check

## When NOT to use

- For static code quality (use `travellini-quality-auditor`)
- For real-browser CSP verification — that's part of `browser-auditor`'s post-fix check
- For dependency CVE audit — out of scope (use `npm audit` separately)

## Protocol

1. **Invoke `travellini-security-auditor`** with scope:
   - Full audit (default) — all checklist items
   - Delta (when files changed are known) — narrow to affected items
   - Single file deep-dive — when investigating a specific concern
2. **Receive findings** in the standard contract (CRITICAL / HIGH / MEDIUM / LOW + verdict).
3. **Surface to user**:
   - Verdict line first
   - CRITICAL findings inline (always)
   - HIGH summarized with file references
   - MEDIUM/LOW linked in the handoff file
4. **Do not fix.** Findings hand off to `travellini-backend-engineer` (server-side) or `travellini-frontend-builder` (client-side).
5. **Track**: every CRITICAL must be cleared before the next deploy. Append to `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.

## Verdict to action

| Verdict                                      | Action                                  |
| -------------------------------------------- | --------------------------------------- |
| `safe-to-deploy`                             | proceed                                 |
| `fix-this-week`                              | continue work, schedule fix this sprint |
| `fix-before-deploy`                          | block deploy until fixes verified       |
| `do-not-deploy` / `revoke-access-and-rotate` | stop, rotate, purge history if needed   |

## Output to user

```
## Security audit — verdict: <verdict>
Date: <YYYY-MM-DD>
Scope: <full / delta>

## CRITICAL (blocker)
<list with file:line + redacted proof>

## HIGH (fix before deploy)
<list>

## MEDIUM / LOW
<count + handoff file>

## Next action
<one sentence — usually "invoke travellini-backend-engineer with handoff X">

Full report: docs/50_Scratch/HANDOFF_<date>_security_to_backend.md
```

## Hard rules

- Never paste raw secret values. Always redact (`sk_live_***...`).
- Never declare "safe" with a CRITICAL open.
- Always include git history check — rotation without history purge is incomplete.
- Always classify `VITE_*` env vars (they ship to client).

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
