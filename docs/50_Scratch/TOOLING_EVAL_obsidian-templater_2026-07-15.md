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

# Tooling Evaluation — Templater

Retroactive card, same context as [[TOOLING_EVAL_obsidian-dataview_2026-07-15]] —
filed to close the documentation gap the 2026-07-15 workbench audit found.

## Summary

- **Name**: Templater
- **Type**: Obsidian community plugin
- **Source**: `SilentVoid13/Templater` (GitHub releases/latest, no version pin)
- **Status**: adopt
- **Owner**: Rodrigo
- **Date**: 2026-07-15 (retroactive)

## Use Case

- **Travellini problem solved**: dynamic note templates (dates, prompts, boilerplate frontmatter) so new notes in `docs/` start with the right taxonomy fields already filled in.
- **Expected benefit**: fewer manual frontmatter mistakes when creating new project/bug/decision notes by hand in Obsidian.
- **Who uses it**: Rodrigo, in Obsidian directly.
- **When to use it**: creating new notes under `docs/90_Templates/`-backed types.
- **When not to use it**: notes scaffolded by Claude Code skills (those already write correct frontmatter directly).

## Risk And Permissions

- **Permissions required**: Templater's "user scripts" feature can execute JS from a designated folder — not enabled by this install (no user-scripts folder configured in `scripts/install-obsidian-plugins.mjs`), so it runs in template-only mode.
- **Secrets required**: no.
- **Can operate read-only**: no — writes generated content into new notes at creation time.
- **External services touched**: none at runtime; install fetches a release from GitHub.
- **Production impact**: none — vault-only.
- **Prompt-injection or data-exfiltration risk**: low as configured (user-scripts off); would need explicit re-evaluation if user-scripts mode is ever turned on.
- **Duplication with existing tools**: none.

## Adoption Plan

- **Files/configs involved**: `docs/.obsidian/plugins/templater-obsidian/` (gitignored), `docs/.obsidian/community-plugins.json` (gitignored).
- **Docs to update**: `docs/OBSIDIAN_WORKFLOW.md` (done, 2026-07-15).
- **Validation commands**: `npm run setup:obsidian-plugins` reproduces the install on a fresh machine.
- **Rollback**: disable in Obsidian's community plugins settings, or delete `docs/.obsidian/plugins/templater-obsidian/`.
- **Manual confirmation required**: no as configured (template-only mode); yes if user-scripts execution is ever enabled.

## Decision

- **Decision**: adopt (template-only mode)
- **Reason**: already in use, low risk as configured, zero production surface.
- **Next review date**: re-evaluate if Templater's user-scripts (JS execution) mode is ever turned on.
