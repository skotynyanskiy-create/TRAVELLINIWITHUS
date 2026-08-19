---
type: project
area: ai
status: archived
tags:
  - ai
  - agents
  - marketing
  - workflow
priority: p2
owner: team
superseded_by: CLAUDE.md sezione Routing
---

> **Superato il 2026-07-31.** Questo piano non è più "cosa fare".
> Il lavoro ancora vivo è confluito in [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]; la direzione è in `CLAUDE.md sezione Routing`.
> Resta leggibile come storico — non aggiungerci voci nuove.

# Agency Agents Review

## Context

External source reviewed: `https://github.com/msitarzewski/agency-agents`
Reviewed commit: `783f6a72bfd7f3135700ac273c619d92821b419a`

The repository contains a broad public catalog of AI agent prompts across engineering, design, marketing, paid media, product, sales, support, testing, and other domains.

## Decision

Do not install the full upstream catalog into TRAVELLINIWITHUS.

Reason: the local agent stack already has brand, UI, release, page-building, and quality skills that are tied to `docs/`, `DESIGN.md`, Italian copy, and the Travelliniwithus operating model. A full import would add generic behavior and duplicate responsibilities.

Adopt only a reduced, attributed, local adaptation for social/content operations:

- `.agents/skills/travellini-social-content-operator/SKILL.md`
- `.agents/skills/travellini-growth-revenue-operator/SKILL.md`

Patterns considered from upstream:

- `marketing-content-creator`
- `marketing-instagram-curator`
- `marketing-tiktok-strategist`
- `marketing-seo-specialist`
- agency-style growth, sales, analytics, campaign, and commercial planning patterns

## Local Requirements

- Public copy remains Italian-first.
- Campaigns, partnerships, and content plans must use the relevant templates under `docs/90_Templates/`.
- Operational changes must update `docs/MARKETING_OPERATIONS_HUB.md` or the relevant campaign/content/project note.
- Future imports from Agency Agents must follow the same review, reduction, attribution, and documentation process.
- Growth and revenue recommendations must protect reader trust, avoid invented metrics, and connect every commercial action to one primary metric and one next decision.
