---
name: deep-refactor
description: Controlled multi-file refactor with written plan and owner sign-off. Use only when small-fix is genuinely not enough. Expensive — use sparingly.
---

# /deep-refactor

Use `code-architect` agent to plan before touching code.

1. **Scope** — List every file that changes. State the before/after contract for each.
2. **Confirm** — Present the plan and wait for owner confirmation before writing anything.
3. **One unit at a time** — Refactor in atomic logical steps. Run `npm run typecheck` between each step.
4. **No mixed concerns** — Do not fix bugs, add features, or improve styles during a refactor. One goal only.
5. **High-risk check** — Flag any change near `src/server/apiRoutes.ts`, `functions/`, `server.ts`, `firestore.rules`, `src/config/admin.ts` before proceeding.
6. **Verify** — After all steps: run `npm run typecheck` + `npm run build` + relevant audit scripts.

Return: plan → confirmation received → step-by-step execution log → final typecheck/build result → remaining risks.

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
