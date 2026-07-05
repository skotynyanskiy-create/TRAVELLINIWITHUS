---
type: dashboard
area: workspace
status: active
tags:
  - ai
  - dashboard
  - operations
---

# AI Operations Dashboard

Cabina di regia per lavorare con Claude Code, Codex, GitHub Copilot, VS Code
Agent, Antigravity e strumenti futuri senza perdere controllo operativo.

## Current Operating Mode

- **Default mode**: SAFE for audits, research, planning and scouting.
- **Normal build mode**: BUILD after scope is clear and rollback is known.
- **Sensitive mode**: OWNER ONLY for deploy, push, secrets, `.env`, database,
  Stripe, Firebase writes and high-risk files.

## Canonical Sources

- `AGENTS.md` — shared operating rules.
- `CLAUDE.md` — Claude Code routing, quality bar and specialist agents.
- `docs/AI_AGENT_STACK.md` — skills, MCP, innovation policy and operating modes.
- `docs/AI_TOOLING_RADAR.md` — candidates for new MCP, CLI, plugins, agents and skills.
- `docs/90_Templates/TPL_Tooling_Evaluation.md` — evaluation card for adoption.
- `docs/AI_HOOKS_GUARDRAILS.md` — blocking/advisory hook map and future guardrails.
- `DESIGN.md` — design-system truth for UI and visual work.
- `docs/MARKETING_OPERATIONS_HUB.md` — marketing and funnel truth.

## Active Skill System

- Canonical source: `.agents/skills`.
- Synced targets: `.claude/skills`, `.github/skills`, `.cursor/skills`, `.gemini/skills`.
- Current canonical count: 26.
- Required validation after skill edits: `npm run sync:agents` then `npm run audit:agents`.

## Continuous Self-Improvement Rule

Every AI/dev work session should improve the operating system, not only complete
the immediate task. At the end of each meaningful task, check whether one of
these should be updated:

- a reusable lesson in `docs/AI_AGENT_STACK.md`, `docs/AI_TOOLING_RADAR.md` or
  this dashboard;
- a new or improved skill in `.agents/skills`;
- a tooling evaluation card for a promising external capability;
- a guardrail, test, checklist or rollback note that prevents repeating the
  same mistake;
- a simplification that removes duplicated instructions or stale workflow text.

Do not force changes when nothing useful was learned. Do capture recurring
patterns, failures, friction, false positives and newly discovered tools so the
system gets sharper over time.

## Innovation Queue

| Candidate                 | Type         | Current status       | Next step                                                                                                           |
| ------------------------- | ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Figma MCP                 | MCP/design   | connected, on-demand | Use via `/travellini-stitch-figma-bridge` on the next design-heavy task (design->React, React->Figma art direction) |
| GitHub managed MCP        | MCP/repo     | scout                | Compare with existing Codex GitHub plugin                                                                           |
| `gh skill`                | CLI/GitHub   | scout                | Evaluate skill management value                                                                                     |
| Gemini CLI                | CLI/agent    | scout                | Lab as comparison agent only                                                                                        |
| Research/crawl MCP        | MCP/research | scout                | Check privacy, crawl scope and SEO value                                                                            |
| GitHub `.instructions.md` | workflow     | scout                | Consider modular instructions after Copilot cleanup                                                                 |

## Open Risks

- Worktree is currently very dirty; separate AI/dev config work from site,
  backend, generated asset and content changes before commit.
- `npm run audit:secrets` still fails because Git history contains three
  redacted GCP/Firebase API-key findings. Owner action is required in
  Google Cloud/Firebase: rotate or strictly restrict the affected key, then
  decide whether history rewrite is worth the disruption.
- Local ignored secret stores exist by design (`.env`, `.obsidian/`,
  `.mcp.json`, `.claude/settings.local.json`). They must remain ignored and
  must never be copied into docs, prompts, reports or backups.
- MCP and plugin surfaces are powerful; keep stable defaults small and use
  evaluation cards before adoption.
- Copilot instructions must stay short and defer to canonical docs.
- High-risk files remain `server.ts`, `firestore.rules`, and `src/config/admin.ts`.
- Hook policy now blocks destructive Bash patterns, but deploy/push confirmation
  beyond force-push remains a future decision to avoid over-constraining daily work.

## Secret Control

- `npm run audit:env` validates `.env.example` and local `.env` structure,
  duplicate keys, expected key coverage and redacted token shapes without
  printing values. It may fail on the owner's machine until real provider
  values are corrected.
- `npm run audit:secrets:staged` scans staged changes before commit and is wired
  into `.husky/pre-commit`.
- `npm run audit:secrets:history` scans repository history; currently blocked by
  known redacted GCP/Firebase findings until owner remediation.
- `npm run audit:secrets:local` scans the full local working tree including
  ignored files. It is expected to find local secrets in `.env` and Obsidian
  plugin config; use it only for private machine hygiene, never for public logs.
- `.env.example` is the public template and must contain only empty values or
  safe booleans/default URLs.

## CI & Quality Gates

Expanded 2026-06-18 (owner opted into higher-leverage automation).

- `.github/workflows/ci.yml` now runs four parallel jobs on push/PR:
  - **quality** — typecheck, lint, unit tests, build, + static audits
    (`audit:ui/firebase/stripe/env/public-footprint/revenue/size`).
  - **lighthouse** — `audit:cwv` (Lighthouse CI on 6 routes via `vite preview`;
    accessibility >= 0.95 and CLS <= 0.1 are **blocking**, perf/LCP/TBT warn).
  - **e2e** — Playwright (`home`, `shop-and-checkout`, `visual-quality`;
    self-boots the dev server; visual spec is assertion-based, no baselines).
  - **secrets** — gitleaks **working-tree** scan (`--no-git`, no node_modules).
    Deliberately tree-scoped, not history: the redacted legacy GCP/Firebase
    findings live in history and stay an owner action (rotate/restrict the key),
    while this gate catches new leaks in shipping code. Working tree is clean.
- `.github/workflows/claude-review.yml` — Claude reviews each PR against the
  project quality bar. **Dormant** until `ANTHROPIC_API_KEY` is added in repo
  secrets (the job no-ops green without it; it bills the Anthropic API, separate
  from the Claude Code plan).
- **Dynamic workflows** opted in (CLAUDE.md): on-demand subagent orchestration
  (`ultracode:`, `/deep-research`, `/workflows`). On-demand only, never
  `/effort ultracode` as a standing default. Cost discipline unchanged.
- Standing rules added to CLAUDE.md: verify previewable UI changes in a real
  browser before claiming done; trust `context7` live docs over recall for
  React 19 / Tailwind 4 / Vite 6 / Firebase / Stripe.

## Weekly Routine

1. Run `npm run audit:agents` after AI stack changes and
   `npm run audit:obsidian` after vault structure or metadata changes.
2. Review `docs/AI_TOOLING_RADAR.md` for new candidates.
3. Promote only one or two candidates to lab at a time.
4. Create a tooling evaluation card before adoption.
5. Keep rejected/deferred candidates documented briefly to avoid repeat debates.
6. Capture at least one process improvement when the week produced a repeated
   problem, useful new tool, stronger guardrail or reusable workflow.

## Next Decisions

- Decide whether to create modular `.github/instructions/*.instructions.md`.
- Decide whether Figma MCP deserves a lab trial for the next design-heavy task.
- Decide whether `gh skill` improves skill governance enough to test.
- Decide whether deploy and normal push should be blocked by hook or handled by
  manual workflow policy.
- Decide whether to rotate/restrict the leaked GCP/Firebase API key only, or
  also rewrite Git history after all collaborators/backups are accounted for.
