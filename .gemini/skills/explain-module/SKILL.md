---
name: explain-module
description: Quickly understand a file or module — what it does, what it exports, its dependencies, and where it is used. Read-only. Use code-explorer agent to keep cost low.
---

# /explain-module

Given a file path or module name:

1. Read the file. State its purpose in 2 sentences.
2. List public exports with their TypeScript types.
3. List imports: external packages and internal file paths.
4. Grep the codebase for where this module is imported or used.
5. Note anything non-obvious: side effects, global state, Firebase rules assumptions, Stripe dependencies.

Return a compact reference card. Under 30 lines. No padding.

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
