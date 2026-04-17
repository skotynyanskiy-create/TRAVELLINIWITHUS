---
type: guide
area: workspace
status: active
tags:
  - ai
  - agents
  - skills
  - workflow
---

# AI Agent Stack

## Purpose

Keep every AI assistant aligned on the same local operating system for TRAVELLINIWITHUS: brand memory, design rules, quality gates, documentation updates, and release readiness.

## Local Policy

- Canonical project skills live in `.agents/skills`.
- Synced copies live in `.claude/skills`, `.github/skills`, `.cursor/skills`, and `.gemini/skills`.
- Claude project agents live in `.claude/agents`.
- External skills are reference material only until reviewed and adapted locally.
- `DESIGN.md` is the design-system prompt source for Stitch, Figma, agents, and code reviews.

## Commands

```bash
npm run sync:agents
npm run audit:agents
npm run audit:visual
npm run audit:quality
```

Use `npm run sync:agents` after editing `.agents/skills`. Use `npm run audit:agents` before committing agent, skill, or workflow changes.

## Curated External References

These sources informed the local stack and should be reviewed before importing future material:

- Vercel Agent Skills: `https://github.com/vercel-labs/agent-skills`
- Addy Osmani Web Quality Skills: `https://github.com/addyosmani/web-quality-skills`
- Google Labs Stitch Skills: `https://github.com/google-labs-code/stitch-skills`
- Google Labs Stitch Loop: `https://github.com/google-labs-code/stitch-loop`
- Figma Skills directory: `https://officialskills.sh/figma/skills`
- VoltAgent Claude Subagents: `https://github.com/VoltAgent/awesome-claude-code-subagents`

Do not install a whole upstream catalog into this repo. Copy, reduce, attribute, and adapt only the pieces that match the brand and workflow.

## Local Skills

- `travellini-design-director`: brand, visual direction, Italian copy, premium editorial UX.
- `travellini-web-quality-auditor`: accessibility, performance, SEO, Core Web Vitals, responsive QA.
- `travellini-stitch-figma-bridge`: controlled Stitch/Figma usage and design-to-code handoff.
- `travellini-page-builder`: route-aware React page creation with SEO and docs.
- `travellini-release-quality`: release gates, visual QA, docs, and deployment readiness.

## Claude Project Agents

- `travellini-ui-designer`: read-only design critique.
- `travellini-frontend-builder`: implementation agent for React/Tailwind work.
- `travellini-quality-auditor`: read-only quality and release review.
- `travellini-seo-conversion-strategist`: SEO, content architecture, conversion and marketing alignment.

## Operating Rules

- Every agent must treat `docs/` as operational truth.
- UI, positioning, collaboration, homepage, navbar, release, bug, campaign, partner, and content changes must update the relevant note.
- Stitch/Figma outputs must pass through repo adaptation and QA before becoming code.
- `npm run predeploy` excludes visual QA by design; use `npm run audit:quality` for the full pass.
