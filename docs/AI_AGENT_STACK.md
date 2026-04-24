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

## Alignment model

The stack has two layers and they are not equivalent:

- Shared layer: `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `docs/`, canonical `travellini-*` skills in `.agents/skills`, repo commands, and project notes.
- Claude-only runtime layer: `.claude/settings.json`, `.claude/settings.local.json`, `.claude/skills/` helper workflows, and `.claude/agents`.

Rule: if a behavior must apply across Codex, Claude Code, Cursor, Gemini, GitHub, or future assistants, it must be expressed in the shared layer. If it exists only in `.claude/settings*.json`, it is a Claude convenience, not shared truth.

## Shared vs Claude-only

Shared across tools:

- `travellini-*` skills in `.agents/skills`
- brand, docs, design system, release and marketing notes
- quality gates and repo commands
- high-risk file list
- update-the-docs discipline for homepage, nav, collaborations, release, campaigns, and bugs

Claude-only by design:

- slash-style workflow helpers in `.claude/skills/` such as `small-fix`, `audit-browser`, `predeploy`, `seo-check`, `commit`, `deploy`
- Claude project agents under `.claude/agents`
- hook-based runtime warnings and command blocks in `.claude/settings.json`
- local permission allowances in `.claude/settings.local.json`

Do not try to mirror `.claude/settings.local.json` into shared repo policy. It is workstation-specific and may contain personal or temporary allowances.

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

## Portable runtime rules

The following Claude runtime behaviors are important enough that they should be treated as shared policy:

- Before-action routing check: search/orientation first, smallest edit path second, heavier multi-file work only when justified.
- Dangerous command guardrails: no destructive cleanup, force-push, hard reset, or production deploy behavior without explicit owner confirmation.
- High-risk file warnings: `server.ts`, `firestore.rules`, and `src/config/admin.ts`.

These are mirrored into `AGENTS.md` so non-Claude assistants can follow the same intent even without Claude hook support.

## Operating Rules

- Every agent must treat `docs/` as operational truth.
- UI, positioning, collaboration, homepage, navbar, release, bug, campaign, partner, and content changes must update the relevant note.
- Stitch/Figma outputs must pass through repo adaptation and QA before becoming code.
- `npm run predeploy` excludes visual QA by design; use `npm run audit:quality` for the full pass.
