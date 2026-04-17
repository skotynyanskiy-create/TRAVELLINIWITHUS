# Agent Workflows

This repository now keeps the Claude-oriented setup and a Codex-usable equivalent side by side.

See also `docs/AI_AGENT_STACK.md` for the current multi-agent skill stack and `DESIGN.md` for design-system rules.

## Mapping

| Claude artifact                          | Purpose                                   | Codex-usable equivalent                                           |
| ---------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `.claude/skills/audit-ui/SKILL.md`       | UI consistency review                     | `npm run audit:ui`                                                |
| `.claude/skills/firebase-check/SKILL.md` | Firestore and security audit              | `npm run audit:firebase`                                          |
| `.claude/skills/stripe-flow/SKILL.md`    | Checkout flow audit                       | `npm run audit:stripe`                                            |
| `.claude/skills/new-page/SKILL.md`       | New page scaffold workflow                | `npm run scaffold:page -- PageName route-slug`                    |
| `.claude/skills/predeploy/SKILL.md`      | Release readiness check                   | `npm run predeploy`                                               |
| `.agents/skills/*/SKILL.md`              | Canonical multi-agent skill source        | `npm run sync:agents`                                             |
| `.claude/agents/*.md`                    | Claude project-specific specialist agents | Use from Claude Code when specialized review/build work is needed |

## Important Caveats

- `.claude/settings.json` remains Claude-specific. Codex does not execute those hooks.
- The npm scripts added for Codex are static audits. They are intentionally lightweight and conservative.
- `npm run predeploy` now acts as the shared preflight entry point across agents.
- `npm run audit:quality` is the full confidence pass and includes visual QA.
- `npm run predeploy` includes agent stack validation but intentionally excludes visual QA to keep deployment preflight lighter.

## When To Use What

- Use `audit:ui` before or after frontend-heavy edits.
- Use `audit:firebase` after touching Firestore queries, rules or admin data flows.
- Use `audit:stripe` after changing cart, coupon, checkout or webhook logic.
- Use `sync:agents` after editing `.agents/skills`.
- Use `audit:agents` after changing skills, agents, AI instructions or workflow docs.
- Use `audit:visual` after UI-heavy work.
- Use `audit:quality` before major releases or large handoffs.
- Use `scaffold:page` to generate a new page file that matches current project patterns.
- Use `predeploy` before a release candidate or a large handoff.
