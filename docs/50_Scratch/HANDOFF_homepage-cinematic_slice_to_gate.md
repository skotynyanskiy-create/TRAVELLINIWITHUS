---
title: HANDOFF_homepage-cinematic_slice_to_gate
status: consumed
created: 2026-07-18
from: travellini-frontend-builder
to: travellini-perf-engineer + travellini-quality-auditor + browser-auditor
slug: homepage-cinematic-redesign-2026
expires: 2026-08-01
type: handoff
area: delivery
---

# Handoff: adversarial gate for the vertical slice

## Why this work matters

The owner should judge the creative direction only after proving it does not trap scroll, exclude reduced-motion users or violate performance budgets.

## Decisions already made

- Gate is read-only/reporting; defects return to frontend-builder.
- Responsive matrix: 320, 375, 768, 1024, 1440.

## Context the receiver needs

- Read plan acceptance contract and implementation notes appended here.

## What the receiver should produce

- Perf: LCP/CLS/INP, media/network/bundle behavior, low-power and failure fallback.
- Quality: scripts, semantics, one-H1/SEO, a11y, reduced-motion static audit.
- Browser: real scroll/touch/keyboard, overflow, focus, console, visual sequence at all widths and emulated reduced-motion.
- Consolidate blockers into `HANDOFF_homepage-cinematic_gate_to_owner.md`.

## Out of scope (do NOT touch)

- Implementation fixes, design changes, deploy.

## Open questions / decisions for the user

- None; report PASS/FAIL and evidence.

## Next hand-off

- Next: owner approval or frontend-builder remediation.
- Trigger: zero critical/high defects and all slice budgets green.
