---
name: predeploy
description: Pre-deployment gate for TRAVELLINIWITHUS. Runs the canonical S6 sequence — quality-auditor (static) + security-auditor (secrets/rules/Stripe) + perf-engineer (CWV) + browser-auditor (real-browser smoke) — in parallel where possible, then aggregates. Blocks deploy on any CRITICAL/HIGH finding.
---

# /predeploy

Canonical sequence S6 — the only path to production.

## When to use

- Before every deploy to production (no exceptions)
- After merging a feature branch into main
- After any change to `src/server/apiRoutes.ts`, `functions/`, `server.ts`, `firestore.rules`, `src/config/admin.ts`, Stripe handlers, env files
- After a release candidate is staged

## Protocol — S6 gate

Execute in 3 phases. Phase 1 is parallel; phase 2 sequential.

### Phase 1 — Parallel audits (all 4 must run)

Invoke these in parallel (single message with 4 Agent tool calls):

1. **`travellini-quality-auditor`** — static gate
   - Scope: full repo if `package.json` or `*.config.*` changed; delta otherwise
   - Runs: `npm run typecheck`, `lint`, `test`, `audit:ui`, `audit:agents`, `audit:firebase`, `audit:stripe`, `audit:visual`, `build`
   - Blocks on: any error in scripts, missing H1, English placeholder, leaked secrets in grep
2. **`travellini-security-auditor`** — security gate
   - Scope: full (always)
   - Checks: secrets in tracked + git history, Firestore rules, Vite `VITE_*` exposure, Stripe webhook signature/idempotency/price-integrity, CORS, security headers, admin gate, rate limits
   - Blocks on: any CRITICAL or HIGH
3. **`travellini-perf-engineer`** — performance gate
   - Scope: all public routes (default top 5: `/`, `/destinazioni`, `/salento`, `/collabora`, `/articolo/<latest>`)
   - Viewport: mobile 375 / 4G throttle
   - Blocks on: LCP > 2.5s, INP > 200ms, CLS > 0.1, TTFB > 800ms (hard ceilings)
4. **`browser-auditor`** — real-browser smoke
   - Dev server must be running (`http://localhost:3000`); if not, ask user to start
   - Routes: same top 5
   - Blocks on: broken route, missing H1, console error on load, broken navbar, broken checkout, horizontal scroll mobile

### Phase 2 — Sequential resolution (if any blocker)

For each blocker found in phase 1:

- Quality/code blocker → hand off to `travellini-frontend-builder` or `travellini-backend-engineer`
- Security blocker → hand off to `travellini-backend-engineer`, then re-run `security-audit`
- Perf blocker → hand off per `perf-engineer`'s rubric (asset-curator / frontend-builder / backend-engineer), re-run `perf-audit`
- Browser blocker → hand off to `frontend-builder`, then re-run `browser-auditor`

After each fix, re-run the failed phase-1 step. Loop until all 4 are green.

### Phase 3 — Sign-off

Once all 4 green:

1. Update `docs/10_Projects/PROJECT_RELEASE_READINESS.md` with the audit results + date
2. Create a release note draft from `docs/90_Templates/TPL_Release_Note.md`
3. Return to user: "✓ Ready to deploy. Run `/deploy` to ship."

## Skip rules (when to narrow scope, not skip gate)

- **Doc-only changes (`docs/**`, README, agent specs)\*\* → skip phase 1 steps 2/3/4. Run only quality-auditor in delta mode.
- **Skill / agent file changes** → run `npm run audit:agents` + quality-auditor delta. Skip security/perf/browser.
- **Pure styling change in one component** → run quality-auditor delta + browser-auditor smoke on affected route. Skip security. Run perf only if route is in top-5.

For all other changes: full S6 gate, no shortcuts.

## Output to user

```
## Pre-deploy gate — S6
Date: <YYYY-MM-DD>
Scope: <full / delta>
Branch: <branch>

## Phase 1 results
| Audit | Status | Blockers | Detail |
|---|---|---|---|
| quality-auditor | PASS/FAIL | N | <link to handoff> |
| security-auditor | PASS/FAIL | N | <link to handoff> |
| perf-engineer | PASS/FAIL | N | <link to handoff> |
| browser-auditor | PASS/FAIL | N | <link to handoff> |

## Blockers (if any)
<list with owner agent + fix link>

## Verdict
<✓ Ready to deploy / BLOCK — N blockers, see above>

## Next action
- If green: run `/deploy`
- If blocked: invoke <owner agent> with handoff <path>
```

## Hard rules

- **Never deploy with a CRITICAL or HIGH finding open.**
- **Never skip phase 1 step 2 (security)** unless change is pure doc / agent files.
- **Always run perf** on routes that have changed substantively.
- **Always run browser-auditor** unless dev server cannot start (in which case, block on infra fix first).
- **Italian copy** on all public touchpoints — non-Italian placeholders are a blocker.

## When NOT to use this skill

- For a non-prod environment deploy (use ad-hoc audits)
- For a hotfix that bypasses normal flow — that requires explicit user approval and still runs phase 1 step 2 (security) at minimum
- For investigating a regression (use `/bug-triage` or `/data-review`)

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
