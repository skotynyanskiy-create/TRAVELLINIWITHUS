---
name: travellini-design-director
description: Guide premium UI and visual direction for Travelliniwithus website work, using brand memory, Italian copy, conversion goals, and design-system constraints.
license: internal
---

# Travellini Design Director

Use this skill for homepage, navbar, collaborations, media kit, landing pages, destinations, editorial cards, brand positioning, visual direction, or any request that could change how the site feels.

## Required Context

Read these first:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `DESIGN.md`
4. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`
6. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
7. relevant notes under `docs/`

## Brand Direction

- Brand: Rodrigo & Betta / Travelliniwithus.
- Language: Italian for public UI and copy.
- Positioning: people-led travel creator brand with editorial authority and commercial partnership potential.
- Goals: clarity, trust, useful exploration, partnership conversion, lead capture, affiliate/shop monetization.
- Tone: concrete, warm, editorial, not generic travel brochure.

## Visual Rules

- Preserve the current premium editorial language unless the user explicitly requests a redesign.
- Prefer strong hierarchy, real travel imagery, restrained radius, controlled shadows, and clear rhythm.
- Avoid SaaS dashboards, generic AI gradients, decorative blobs, fake controls, crowded statistic strips, and copy that explains the UI.
- Use existing React, Tailwind, CSS variables, `PageLayout`, `Section`, and local component patterns.
- Important UI changes must update the relevant `docs/` note.

## Workflow

1. Identify the target route, business goal, audience, and conversion action.
2. Check whether the change touches homepage, navbar, collaborations, media kit, content architecture, release readiness, or a bug note.
3. Propose or implement only changes that strengthen the brand and conversion path.
4. Keep UI copy in Italian and directly useful to the visitor.
5. Run or recommend `npm run audit:ui`, `npm run audit:visual`, and relevant build checks after implementation.

## Output Standard

For reviews, report:

- brand fit
- hierarchy and visual rhythm
- conversion clarity
- accessibility and responsive risks
- exact files or docs that need changes
