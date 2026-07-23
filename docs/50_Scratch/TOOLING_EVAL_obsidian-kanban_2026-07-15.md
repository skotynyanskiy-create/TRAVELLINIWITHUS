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

# Tooling Evaluation — Obsidian Kanban

> **2026-07-23 — REJECTED / removed from stack.** Zero board nel vault; pipeline
> coperta da Bases. Rimosso da `community-plugins.json` e
> `scripts/install-obsidian-plugins.mjs`.

Retroactive card, same context as [[TOOLING_EVAL_obsidian-dataview_2026-07-15]] —
filed to close the documentation gap the 2026-07-15 workbench audit found.

## Summary

- **Name**: Kanban
- **Type**: Obsidian community plugin
- **Source**: `mgmeyers/obsidian-kanban` (GitHub releases/latest, no version pin)
- **Status**: adopt
- **Owner**: Rodrigo
- **Date**: 2026-07-15 (retroactive)

## Use Case

- **Travellini problem solved**: lightweight board view for content/task pipelines (e.g. content calendar stages) without a separate external tool.
- **Expected benefit**: fewer context switches for Rodrigo/Betta managing editorial pipeline state.
- **Who uses it**: Rodrigo, in Obsidian directly.
- **When to use it**: any note that benefits from a board/column view over a list of cards (leads, content stages, partner pipeline).
- **When not to use it**: anything that needs to be queried by Dataview or scripted — Kanban boards are markdown checklists under the hood, not structured data.

## Risk And Permissions

- **Permissions required**: none beyond normal vault read/write access.
- **Secrets required**: no.
- **Can operate read-only**: no — it's an authoring tool, writes board state back into the note.
- **External services touched**: none at runtime; install fetches a release from GitHub.
- **Production impact**: none — vault-only.
- **Prompt-injection or data-exfiltration risk**: none identified.
- **Duplication with existing tools**: none.

## Adoption Plan

- **Files/configs involved**: `docs/.obsidian/plugins/obsidian-kanban/` (gitignored), `docs/.obsidian/community-plugins.json` (gitignored).
- **Docs to update**: `docs/OBSIDIAN_WORKFLOW.md` (done, 2026-07-15).
- **Validation commands**: `npm run setup:obsidian-plugins` reproduces the install on a fresh machine.
- **Rollback**: disable in Obsidian's community plugins settings, or delete `docs/.obsidian/plugins/obsidian-kanban/`.
- **Manual confirmation required**: no — vault-local, no repo/production surface.

## Decision

- **Decision**: adopt
- **Reason**: already in use, zero production/security surface.
- **Next review date**: none scheduled — revisit only if a board-based workflow is retired.
