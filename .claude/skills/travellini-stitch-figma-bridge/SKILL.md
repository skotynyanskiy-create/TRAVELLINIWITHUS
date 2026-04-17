---
name: travellini-stitch-figma-bridge
description: Govern controlled Stitch and Figma usage for Travelliniwithus so generated design work informs the repo without bypassing brand, code, or QA rules.
license: internal
---

# Travellini Stitch Figma Bridge

Use this skill when the user asks for Stitch, Figma, design files, design system rules, design-to-code, UI mockups, page concepts, or visual exploration.

## Required Context

Read these first:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `DESIGN.md`
4. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`
6. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
7. relevant notes under `docs/`

## Policy

- Stitch and Figma are design inputs, not automatic code truth.
- Do not paste generated code into the repo without adapting it to existing React, TypeScript, Tailwind, CSS variables, routing, SEO, and docs rules.
- Use `DESIGN.md` as the prompt source for visual consistency.
- If a Stitch or Figma output changes positioning, homepage, navbar, collaborations, media kit, or release readiness, update the relevant `docs/` note.
- Keep public-facing copy Italian and aligned with Rodrigo & Betta.

## Prompt Requirements

Every Stitch/Figma prompt should include:

- brand: Travelliniwithus, Rodrigo & Betta, Italian travel creator brand
- audience: travelers, partners, tourism boards, brands, editorial readers
- goal: clarity, trust, exploration, partnership conversion, lead capture, shop conversion
- style: premium editorial travel, warm, image-led, restrained interface details
- constraints: no generic SaaS UI, no fake controls, no decorative blobs, no off-brand palette
- source: `DESIGN.md` and `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`

## Conversion Back To Code

When bringing a design into code:

1. Split the screen into existing component responsibilities.
2. Reuse local layout, typography, buttons, cards, and image patterns first.
3. Replace generated colors with CSS variables or existing Tailwind token patterns.
4. Add typed props and avoid new `any`.
5. Run `npm run typecheck`, `npm run audit:ui`, and `npm run audit:visual`.

## Output Standard

Return:

- design intent
- implementation mapping
- risks before code
- QA commands
- docs that must be updated
