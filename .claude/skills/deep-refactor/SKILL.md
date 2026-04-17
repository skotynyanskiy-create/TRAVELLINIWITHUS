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
5. **High-risk check** — Flag any change near `server.ts`, `firestore.rules`, `src/config/admin.ts` before proceeding.
6. **Verify** — After all steps: run `npm run typecheck` + `npm run build` + relevant audit scripts.

Return: plan → confirmation received → step-by-step execution log → final typecheck/build result → remaining risks.
