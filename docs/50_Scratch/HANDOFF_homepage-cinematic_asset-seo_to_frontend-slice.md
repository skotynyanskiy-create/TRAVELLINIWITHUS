---
title: HANDOFF_homepage-cinematic_asset-seo_to_frontend-slice
status: consumed
created: 2026-07-18
from: travellini-asset-curator + travellini-seo-conversion-strategist
to: travellini-frontend-builder
slug: homepage-cinematic-redesign-2026
expires: 2026-08-01
type: handoff
area: delivery
---

# Handoff: implement the isolated vertical slice

## Why this work matters

The slice proves the narrative, accessibility and performance before multiplying the pattern across the homepage.

## Decisions already made

- Implement exactly the locked storyboard/content/asset manifest.
- Natural document scroll; no global overflow lock, mandatory snap, wheel interception or hidden chrome.
- Heavy media is enhancement; complete poster/text fallback is required.

## Context the receiver needs

- Read all preceding handoffs and inspect concurrent worktree changes before editing.
- Prefer a preview route or local flag that preserves the current `/` rollback until owner approval.

## What the receiver should produce

- Hero, first scroll scene, transition, destination and CTA.
- Intentional 375/768/1440 layouts and reduced-motion branch.
- Typed components, existing tokens, analytics hooks, lazy media, cleanup for observers/timelines.
- No new dependency without explicit approval and measured need.

## Out of scope (do NOT touch)

- Remaining homepage, navbar/footer redesign, backend/high-risk files, deploy.

## Open questions / decisions for the user

- None once this handoff is marked ready; escalate any missing asset rather than substituting silently.

## Next hand-off

- Next agents: perf-engineer, quality-auditor, browser-auditor.
- Trigger: typecheck/build pass and slice available locally.
