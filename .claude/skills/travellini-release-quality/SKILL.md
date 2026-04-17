---
name: travellini-release-quality
description: Coordinate Travelliniwithus release readiness by combining checks, visual QA, agent stack validation, documentation updates, and risk reporting.
license: internal
---

# Travellini Release Quality

Use this skill before deployment, after large UI changes, after agent stack changes, or when preparing a handoff.

## Required Context

Read these first:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `DESIGN.md`
4. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`
6. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
7. `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
8. relevant notes under `docs/`

## Checks

Run the smallest sufficient set for the change:

- Agent/workflow changes: `npm run sync:agents`, `npm run audit:agents`
- UI-heavy changes: `npm run typecheck`, `npm run build`, `npm run audit:ui`, `npm run audit:visual`
- Full confidence pass: `npm run audit:quality`
- Production preflight: `npm run predeploy`

## Release Rules

- Do not recommend deploy if typecheck, lint, test, build, Firebase, Stripe, or agent stack checks fail.
- Keep `npm run predeploy` lighter than full visual QA; `npm run audit:quality` owns visual QA.
- Update `docs/10_Projects/PROJECT_RELEASE_READINESS.md` when release state changes.
- Create or update a bug note if a bug is introduced or resolved.
- For marketing-impacting releases, update `docs/MARKETING_OPERATIONS_HUB.md` or the relevant campaign/partner/content note.

## Output Standard

Report:

- checks run
- PASS/FAIL/WARN status
- release blockers
- docs updated or still required
- whether deploy is recommended
