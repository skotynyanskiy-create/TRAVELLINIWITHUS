# Agent Workflows

This repository now keeps the Claude-oriented setup and a Codex-usable equivalent side by side.

## Mapping

| Claude artifact | Purpose | Codex-usable equivalent |
| --- | --- | --- |
| `.claude/skills/audit-ui/SKILL.md` | UI consistency review | `npm run audit:ui` |
| `.claude/skills/firebase-check/SKILL.md` | Firestore and security audit | `npm run audit:firebase` |
| `.claude/skills/stripe-flow/SKILL.md` | Checkout flow audit | `npm run audit:stripe` |
| `.claude/skills/new-page/SKILL.md` | New page scaffold workflow | `npm run scaffold:page -- PageName route-slug` |
| `.claude/skills/predeploy/SKILL.md` | Release readiness check | `npm run predeploy` |

## Important Caveats

- `.claude/settings.json` remains Claude-specific. Codex does not execute those hooks.
- The npm scripts added for Codex are static audits. They are intentionally lightweight and conservative.
- `npm run predeploy` now acts as the shared preflight entry point across agents.

## When To Use What

- Use `audit:ui` before or after frontend-heavy edits.
- Use `audit:firebase` after touching Firestore queries, rules or admin data flows.
- Use `audit:stripe` after changing cart, coupon, checkout or webhook logic.
- Use `scaffold:page` to generate a new page file that matches current project patterns.
- Use `predeploy` before a release candidate or a large handoff.
