---
name: travellini-web-quality-auditor
description: Audit Travelliniwithus web quality across accessibility, performance, SEO, Core Web Vitals, responsive behavior, and release-readiness signals.
license: internal
---

# Travellini Web Quality Auditor

Use this skill for quality reviews, pre-release checks, accessibility issues, performance regressions, SEO audits, visual QA, and Core Web Vitals work.

## Required Context

Read these first:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `DESIGN.md`
4. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`
6. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
7. relevant notes under `docs/`

## Audit Model

Use the local repo checks as the source of truth:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:ui`
- `npm run audit:firebase`
- `npm run audit:stripe`
- `npm run audit:agents`
- `npm run audit:visual`
- `npm run audit:quality`

Reference standards, adapted locally:

- Vercel-style web interface guidelines: semantic HTML, focus states, forms, images, interaction states, i18n.
- Addy Osmani-style web quality: Lighthouse categories, Core Web Vitals, accessibility, SEO, best practices.
- WCAG 2.2 AA as the practical accessibility floor.

## What To Check

- Exactly one useful `h1` per public page.
- No horizontal overflow on mobile or desktop.
- Images load, have useful dimensions, and have appropriate alt text.
- CTA text is visible, specific, and Italian.
- Interactions support keyboard focus and do not depend on hover only.
- Motion respects layout stability and reduced-motion intent.
- SEO uses canonical URLs, clear titles, descriptions, Open Graph images, sitemap, robots, and structured data where relevant.
- Performance protects hero LCP, avoids oversized images, avoids layout shifts, and keeps route bundles reasonable.

## Output Standard

Group findings as `FAIL`, `WARN`, and `PASS`. Every actionable finding must include:

- route or component
- file path when known
- why it matters
- concrete fix

If the issue changes release readiness, update or request an update to `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
