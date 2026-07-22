---
title: HANDOFF_homepage-cinematic_ui_to_asset-seo
status: consumed
created: 2026-07-18
from: travellini-ui-designer
to: travellini-asset-curator + travellini-seo-conversion-strategist
slug: homepage-cinematic-redesign-2026
expires: 2026-08-01
type: handoff
area: delivery
---

# Handoff: lock media and semantic content for the slice

## Why this work matters

Implementation cannot be credible or performant until each visual and text slot has a real source and budget.

## Decisions already made

- Use the approved storyboard only; no added scenes.
- Real/approved Rodrigo & Betta media wins over placeholders.
- One visible H1; destination and CTA must lead somewhere real.

## Context the receiver needs

- Read plan, recon, approved UI storyboard, brand snapshot, `src/config/reels.ts`, content/CMS configs and existing SEO component.

## What the receiver should produce

- Asset curator: manifest with source/provenance, crop per breakpoint, alt/decorative decision, poster/fallback, dimensions/formats and byte budget.
- SEO strategist: H1, eyebrow, destination microcopy, CTA labels, title/description, JSON-LD decision and analytics event vocabulary.
- Merge both outputs into `HANDOFF_homepage-cinematic_asset-seo_to_frontend-slice.md`.

## Out of scope (do NOT touch)

- Page implementation, invented metrics/claims, placeholder publication, backend/CMS migration.

## Open questions / decisions for the user

- Owner must explicitly approve any hero image/video featuring R&B and the destination selection.

## Next hand-off

- Next agent: travellini-frontend-builder.
- Trigger: every slice slot has approved content/asset or an intentional static fallback.
