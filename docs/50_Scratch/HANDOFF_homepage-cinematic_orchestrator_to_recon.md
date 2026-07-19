---
title: HANDOFF_homepage-cinematic_orchestrator_to_recon
status: blocked
created: 2026-07-18
from: travellini-orchestrator
to: code-explorer
slug: homepage-cinematic-redesign-2026
expires: 2026-08-01
type: handoff
area: delivery
---

# Handoff: evidence-first homepage reconnaissance

## Why this work matters

The redesign must build on the actual active homepage and avoid reintroducing scroll hijacking or costly experimental code.

## Decisions already made

- Native scroll, vertical slice first, progressive enhancement, desktop/mobile/reduced-motion parity.
- No code changes in this step.
- Start only after the five owner questions in `PLAN_homepage-cinematic-redesign-2026.md` are answered.

## Context the receiver needs

- Read `CLAUDE.md`, `DESIGN.md`, both current home project notes and the plan.
- Active route is currently `src/pages/AtlanteHome.tsx` through `src/App.tsx`.
- Sentiero/Atlante/Controluce are evidence and possible leaf-level reuse, not assumed architecture.

## What the receiver should produce

- A path-and-line evidence report covering: route/layout, component tree, styling/tokens, all motion engines and lifecycle cleanup, assets/provenance/weights, CMS/data wiring, breakpoint behavior, current perf/SEO/a11y tests, analytics, and recent git changes touching home.
- Flag shared files likely to conflict in the worktree.
- Write findings into `docs/50_Scratch/HANDOFF_homepage-cinematic_recon_to_ui.md` using the handoff template.

## Out of scope (do NOT touch)

- Code, content, assets, dependencies, git history, high-risk backend files.

## Open questions / decisions for the user

- Inherit the five open questions from the plan; do not infer answers.

## Next hand-off

- Next agent: travellini-ui-designer, preceded by the `design-research` skill.
- Trigger: complete evidence report and owner decisions locked.
