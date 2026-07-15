---
type: evaluation
area: workspace
status: adopted
tags:
  - ai
  - tooling
  - evaluation
  - obsidian
---

# Tooling Evaluation — Dataview (Obsidian community plugin)

Retroactive card: this plugin was already installed and load-bearing
(`docs/OBSIDIAN_DASHBOARD.md` runs live Dataview queries) before this
evaluation was written. Filed now to close the gap flagged by the
2026-07-15 workbench audit — `docs/OBSIDIAN_WORKFLOW.md` claimed "no
additional plugins" while three were already in daily use.

## Summary

- **Name**: Dataview
- **Type**: Obsidian community plugin
- **Source**: `blacksmithgu/obsidian-dataview` (GitHub releases/latest, no version pin)
- **Status**: adopt
- **Owner**: Rodrigo
- **Date**: 2026-07-15 (retroactive; actual install predates this card)

## Use Case

- **Travellini problem solved**: live, queryable views over vault notes (project status, bug lists, content calendar) instead of manually maintained index pages.
- **Expected benefit**: `docs/OBSIDIAN_DASHBOARD.md` stays accurate automatically as notes change status/frontmatter.
- **Who uses it**: Rodrigo, in Obsidian directly (not a Claude Code MCP tool).
- **When to use it**: any dashboard or index note that should reflect live frontmatter state.
- **When not to use it**: content that needs to render outside Obsidian (the website itself does not depend on Dataview).

## Risk And Permissions

- **Permissions required**: none beyond normal vault read access.
- **Secrets required**: no.
- **Can operate read-only**: yes — Dataview only reads frontmatter/content, does not write to notes.
- **External services touched**: none at runtime; install fetches a release from GitHub.
- **Production impact**: none — vault-only, does not touch the website build or repo code.
- **Prompt-injection or data-exfiltration risk**: none identified — local rendering only.
- **Duplication with existing tools**: none.

## Lab Plan

- **Sandbox scope**: n/a (already adopted).
- **Validation**: `docs/OBSIDIAN_DASHBOARD.md`'s Dataview blocks render without errors when Dataview is enabled.

## Adoption Plan

- **Files/configs involved**: `docs/.obsidian/plugins/dataview/` (gitignored, machine-local), `docs/.obsidian/community-plugins.json` (gitignored).
- **Docs to update**: `docs/OBSIDIAN_WORKFLOW.md` (done, 2026-07-15 — corrected the "no additional plugins" claim).
- **Validation commands**: `npm run setup:obsidian-plugins` reproduces the install on a fresh machine.
- **Rollback**: disable in Obsidian's community plugins settings, or delete `docs/.obsidian/plugins/dataview/` and re-run setup without it.
- **Manual confirmation required**: no — vault-local, no repo/production surface.

## Decision

- **Decision**: adopt
- **Reason**: already in daily use, zero production/security surface, purely a vault-authoring convenience.
- **Next review date**: pin an exact release tag in `scripts/install-obsidian-plugins.mjs` if a Dataview update ever breaks a dashboard query (currently unpinned — acceptable given no production impact).
