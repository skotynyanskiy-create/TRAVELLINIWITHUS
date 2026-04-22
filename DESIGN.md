# TRAVELLINIWITHUS Design System

This file is the operative design source for agents, Stitch, Figma prompts, and code reviews. It does not replace the codebase. Final implementation remains React, TypeScript, Tailwind CSS, CSS variables, and the repo rules in `AGENTS.md`.

## Source Context

Read these before changing important UI:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
4. `docs/MARKETING_OPERATIONS_HUB.md`
5. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
6. relevant notes under `docs/`

## Quick Reference

- **Token tecnici** (CSS vars, componenti riusabili, motion presets, utility classes): vedi [`docs/DESIGN_SYSTEM_CHEATSHEET.md`](docs/DESIGN_SYSTEM_CHEATSHEET.md) — aggiornarlo dopo PR che modificano `@theme` o aggiungono atoms.
- **Baseline UI consistency**: `npm run audit:ui` confronta col file `audit-ui-baseline.json` committato. Nuovi warning fuori dal baseline spiccano come `NEW`. Per accettare un nuovo set: `npm run audit:ui:update-baseline`.
- **Pagine mature di riferimento** (composizione pulita da cui copiare pattern):
  - Home → [`src/pages/Home.tsx`](src/pages/Home.tsx)
  - Articolo → [`src/pages/Articolo.tsx`](src/pages/Articolo.tsx) (pagina editoriale complex)
  - Destinazioni → [`src/pages/Destinazioni.tsx`](src/pages/Destinazioni.tsx) (filtri + grid + pagination)

## Brand

Travelliniwithus is the travel creator brand of Rodrigo & Betta. The site must feel people-led, editorial, useful, and commercially credible.

Primary site goals:

- clarify who Rodrigo & Betta are
- help readers explore destinations and experiences
- build editorial authority
- convert partners toward collaborations and media kit
- capture leads and newsletter subscribers
- support affiliate/shop monetization

Primary language for public UI and content is Italian.

## Visual Direction

The current direction is premium editorial travel:

- image-led, with people and places at the center
- calm hierarchy instead of visual noise
- warm but precise copy
- generous spacing where it improves comprehension
- restrained radius and shadows
- clear CTA priority
- magazine-like content rhythm

Avoid:

- generic SaaS dashboards
- decorative gradient blobs or random orbs
- fake media controls
- overbuilt statistic strips
- English placeholder copy
- crowded cards or cards inside cards
- redesigns disconnected from `docs/`

## Layout Principles

- Start pages with the real user task, not abstract marketing.
- Every public page needs one strong `h1`.
- CTAs must be specific and action-oriented.
- Mobile layouts must be checked at narrow widths and must not create horizontal overflow.
- Desktop layouts must work on laptop and wide viewports.
- Editorial grids should prioritize scannability over density.
- Partnership and media kit paths must stay visible but not overpower reader-first navigation.

## Components And Styling

- Prefer existing components before adding new ones.
- Use `PageLayout`, `Section`, `SEO`, local buttons/cards, and established page patterns.
- Use CSS variables and local Tailwind conventions.
- Avoid raw colors unless explicitly allowed by a local audit rule.
- Use `lucide-react` for icons, except documented local exceptions.
- Keep props typed with explicit interfaces.

## Stitch And Figma Usage

Stitch and Figma are for concepting, design-system extraction, mockups, and critique. They are not code truth.

Prompts must include:

- Travelliniwithus, Rodrigo & Betta, Italian travel creator brand
- premium editorial travel style
- goals: clarity, trust, exploration, collaboration conversion, lead capture
- constraints: no generic SaaS UI, no fake controls, no decorative blobs, no off-brand palette
- source references: `DESIGN.md` and `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`

Any generated design must be adapted to local React/Tailwind patterns before entering the repo.

## Quality Bar

Before marking UI work as ready:

- `npm run typecheck`
- `npm run build`
- `npm run audit:ui`
- `npm run audit:visual` for UI-heavy changes
- update the relevant `docs/` note when positioning, routes, UI flows, collaborations, or release readiness change
