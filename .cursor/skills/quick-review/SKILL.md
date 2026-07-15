---
name: quick-review
description: Fast targeted code review of specified or recently changed files. Bug-focused, not style-focused. Use before committing or opening a PR.
---

# /quick-review

Review the specified file(s) or run `git diff HEAD` to find what changed. Check only these categories:

1. **Logic errors** — wrong conditions, off-by-one, stale closures, undefined access
2. **Type safety** — new `any`, missing prop types, unsafe casts
3. **Security** — XSS, injection, exposed keys, unvalidated user input, Firestore reads without auth checks
4. **Firebase/Stripe** — missing `.auth()` guards, unchecked error paths, double charges
5. **Null safety** — missing null checks on API responses, optional props, user input

Do NOT flag: formatting, naming conventions, missing comments, refactoring opportunities, test coverage.

Return a numbered list of real issues with `file:line`. If none found, say "No issues found."

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
