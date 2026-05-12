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

## Current Integrations

- Codex plugin: GitHub is enabled in the local Codex config for repository, issue, pull request and CI workflows.
- Codex MCP: Playwright is enabled in the local Codex config for browser QA parity with Claude Code.
- Claude Code project MCP: `.mcp.json` currently enables only Playwright.
- Claude Code project hooks: `.claude/settings.json` uses PowerShell-based safety hooks for this Windows workspace.
- Obsidian memory: `docs/` is the project vault and operational memory. Do not duplicate stable project facts into a separate AI memory unless they are cross-project user preferences.

## Curated External References

These sources informed the local stack and should be reviewed before importing future material:

- Vercel Agent Skills: `https://github.com/vercel-labs/agent-skills`
- Addy Osmani Web Quality Skills: `https://github.com/addyosmani/web-quality-skills`
- Google Labs Stitch Skills: `https://github.com/google-labs-code/stitch-skills`
- Google Labs Stitch Loop: `https://github.com/google-labs-code/stitch-loop`
- Figma Skills directory: `https://officialskills.sh/figma/skills`
- VoltAgent Claude Subagents: `https://github.com/VoltAgent/awesome-claude-code-subagents`
- Agency Agents: `https://github.com/msitarzewski/agency-agents` reviewed at `783f6a72bfd7f3135700ac273c619d92821b419a`; only locally adapted slices should be imported.

Do not install a whole upstream catalog into this repo. Copy, reduce, attribute, and adapt only the pieces that match the brand and workflow.

## MCP Policy

Keep MCP servers minimal. Every added server must have a concrete use case, a trusted source, auth handled through environment variables, and documentation in this file or a linked project note.

Current default:

- `playwright`: browser QA, visual review, responsive checks and smoke tests.

Approved candidates when the task requires them:

- GitHub MCP or GitHub plugin: pull requests, issues, review comments, CI and repository operations. Prefer the existing Codex GitHub plugin where available.
- Stripe MCP: Stripe docs, checkout, webhook and sandbox work. Enable only for Stripe tasks.
- Firebase MCP: Firebase/Firestore inspection and debugging. Enable only with explicit auth and task scope.
- Figma MCP: design-to-code context from real Figma files. Enable only when there is a concrete Figma file or Dev Mode workflow.
- Obsidian MCP: optional for external vault automation. Not needed for normal Travellini work because `docs/` is already repo-local.

Do not add broad MCP registries, random community servers or full external agent catalogs as default project tools.

## Local Skills

- `travellini-design-director`: brand, visual direction, Italian copy, premium editorial UX.
- `travellini-web-quality-auditor`: accessibility, performance, SEO, Core Web Vitals, responsive QA.
- `travellini-stitch-figma-bridge`: controlled Stitch/Figma usage and design-to-code handoff.
- `travellini-page-builder`: route-aware React page creation with SEO and docs.
- `travellini-release-quality`: release gates, visual QA, docs, and deployment readiness.
- `travellini-social-content-operator`: social, editorial, campaign, creator, and partnership content planning adapted from the Agency Agents marketing patterns.
- `travellini-growth-revenue-operator`: growth, partnerships, media kit conversion, affiliate/shop, campaign prioritization, and analytics planning adapted from agency-style commercial patterns.

## Claude Project Agents

- `travellini-ui-designer`: read-only design critique.
- `travellini-frontend-builder`: implementation agent for React/Tailwind work.
- `travellini-quality-auditor`: read-only quality and release review.
- `travellini-seo-conversion-strategist`: SEO, content architecture, conversion and marketing alignment.
- `travellini-social-content-operator`: social calendars, Reels/TikTok concepts, campaign briefs, creator partnerships, newsletters, and content-to-conversion planning.
- `travellini-growth-revenue-operator`: growth strategy, partner pipeline, media kit conversion, affiliate/shop planning, campaign prioritization, offer design, and analytics events.

## Operating Rules

- Every agent must treat `docs/` as operational truth.
- UI, positioning, collaboration, homepage, navbar, release, bug, campaign, partner, and content changes must update the relevant note.
- Stitch/Figma outputs must pass through repo adaptation and QA before becoming code.
- `npm run predeploy` excludes visual QA by design; use `npm run audit:quality` for the full pass.
