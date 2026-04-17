---
type: guide
area: workspace
status: active
tags:
  - ai
  - workflow
  - workspace
---

# AI Collaboration Protocol

## Goal

Make every AI tool work on the same project memory, same documentation system and same operating rules without rebuilding context each time.

## System of record

- repo root = source of code truth
- `docs/` = source of operational truth
- `DESIGN.md` = source of design-system truth for agents and design tools
- `.agents/skills` = canonical local skill source
- `docs/AI_AGENT_STACK.md` = source of AI stack and external-reference policy
- `docs/MARKETING_OPERATIONS_HUB.md` = source of marketing truth
- `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md` = source of project truth

## For every AI tool

Any assistant used on this repo should:

1. read `AGENTS.md`
2. read `CLAUDE.md`
3. read `DESIGN.md` for UI and design-system work
4. read `docs/AI_AGENT_STACK.md` for skill and agent workflow rules
5. use `docs/` as the working documentation vault
6. update the relevant note when work changes scope, decisions or delivery state

## Multi-agent workflow

- Edit canonical local skills in `.agents/skills`.
- Run `npm run sync:agents` to sync skill copies to agent-specific directories.
- Run `npm run audit:agents` after agent, skill, instruction or workflow changes.
- Use Stitch/Figma as controlled design inputs only; implementation remains repo-native React/Tailwind.
- Use `npm run audit:visual` for UI-heavy changes and `npm run audit:quality` for major release confidence.

## Minimum update policy

### UI / UX change

- update a `project`, `task` or `ui-change` note
- store `route` and `repo_path`

### Bug

- update or create a `bug` note
- store reproduction, fix and impacted files

### Marketing work

- use campaign / partner / content notes
- connect website work to business goals, not only code changes

### Release work

- update release readiness or release note

## Why this works

- files live in the repo, so every tool can read them
- Obsidian is only the UI on top of those files
- the system does not depend on one vendor or one assistant

## Main links

- [[OBSIDIAN_HOME]]
- [[OBSIDIAN_DASHBOARD]]
- [[MARKETING_OPERATIONS_HUB]]
- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
