---
name: travellini-page-builder
description: Build or plan new Travelliniwithus React pages with routed SEO, Italian copy, project documentation updates, and existing component conventions.
license: internal
---

# Travellini Page Builder

Use this skill for new public pages, landing pages, content hubs, collaboration pages, lead capture pages, and major page rewrites.

## Required Context

Read these first:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `DESIGN.md`
4. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`
6. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
7. relevant notes under `docs/`

## Page Requirements

- Use React 19, TypeScript, Vite 6, Tailwind CSS 4, and CSS variables.
- Use existing page patterns from `src/pages`, `PageLayout`, `Section`, `SEO`, and lazy routes in `src/App.tsx`.
- Public copy must be Italian.
- Every public page needs a clear `h1`, SEO title, SEO description, canonical URL, and a primary CTA.
- Static public routes must be considered for sitemap generation.
- Important page work must update the relevant `docs/` project or marketing note.

## Build Flow

1. Define route, audience, business goal, CTA, and content source.
2. Check for an existing page or route before creating a new one.
3. Scaffold the page using local conventions, not external template assumptions.
4. Wire route and navigation only when the page should be discoverable from the main site.
5. Keep Firestore access in services unless there is a documented reason.
6. Add or update tests when the page affects a critical path.

## Quality Bar

- No raw colors unless already allowed by local patterns.
- No inline styles unless required by a third-party or animation API.
- No generic placeholder copy in production surfaces.
- No visual work without responsive mobile consideration.
- No release-ready claim without `npm run typecheck`, `npm run build`, and relevant audits.

## Output Standard

For implementation, report:

- route
- changed files
- docs updated
- checks run
- follow-up content or asset gaps
