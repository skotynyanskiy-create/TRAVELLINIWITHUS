---
type: evaluation
area: workspace
status: lab
tags:
  - ai
  - tooling
  - evaluation
  - design
---

# Tooling Evaluation — SuperDesign

## Summary

- **Name**: SuperDesign
- **Type**: design tool (open-source IDE extension, built on Claude Code SDK)
- **Source**: https://github.com/superdesigndev/superdesign — superdesign.dev (~6.6k★, ~150 commits, 712 forks, open-source, actively maintained)
- **Status**: lab
- **Owner**: Rodrigo (site owner)
- **Date**: 2026-06-18

## Use Case

- **Travellini problem solved**: rapid in-IDE visual exploration during the current structure/graphics phase — spin up multiple UI directions for a hero/section/page before committing to React implementation.
- **Expected benefit**: 10x faster parallel mockups, same Claude model family, fully local, no repo pollution (output isolated in `.superdesign/`).
- **Who uses it**: owner, with the `travellini-ui-designer` brand-fit lens applied to every output.
- **When to use it**: early concepting of a NEW section/page direction, or to break a design block.
- **When not to use it**: never to write repo code; never for final brand-approved UI (that path stays `DESIGN.md` → `travellini-ui-designer` → `travellini-frontend-builder` → UI QA). Not for editorial copy.

## Risk And Permissions

- **Permissions required**: local filesystem (writes only to `.superdesign/`); an LLM key — uses your existing Claude/Cursor subscription, or an OpenAI-compatible endpoint.
- **Secrets required**: no project secrets. Uses your own model subscription/key, not any `VITE_*`/Stripe/Firebase secret.
- **Can operate read-only (re: repo)**: yes — it does not modify `src/`; it produces throwaway mockups in `.superdesign/`.
- **External services touched**: the LLM provider you configure (Anthropic by default).
- **Production impact**: none (no build, deploy, or repo-code path).
- **Prompt-injection or data-exfiltration risk**: low — local extension; main cost is credit burn on generation.
- **Duplication with existing tools**: overlaps `travellini-ui-designer` + `/design-research`, but adds what they lack — actual parallel visual generation inside the IDE.

## Lab Plan

- **Sandbox scope**: the `.superdesign/` folder only (add to `.gitignore` for the trial). No `src/` writes.
- **Commands or actions**: install the extension manually; generate 5–10 variants for ONE target (e.g. a new "Esperienze" section), with every prompt carrying the brand constraints from `DESIGN.md` (premium editorial, sand/ink tokens, no SaaS, no gradient blobs, no fake controls, Italian copy).
- **Test data**: real Travellini copy + brand constraints + 1–2 reference images.
- **Success criteria**: at least one direction worth adapting that passes the brand bar; net time saved vs. doing it in-thread.
- **Failure criteria**: all outputs off-brand SaaS, extension unstable on this setup, or disproportionate credit burn.

## Adoption Plan

- **Files/configs involved**: add `.superdesign/` to `.gitignore`; note in `docs/AI_TOOLING_RADAR.md` + `docs/AI_AGENT_STACK.md`.
- **Docs to update**: radar (move row scout→adopt), AI_AGENT_STACK design-tools section.
- **Validation commands**: none needed (no repo code); any adapted UI later goes through `npm run typecheck` / `audit:ui` / `audit:visual` as normal.
- **Rollback**: uninstall the extension + delete `.superdesign/`. Zero repo footprint.
- **Manual confirmation required**: yes — installing the extension is an owner action.

## Decision

- **Decision**: lab
- **Reason**: only tool of the scouted set that fills a real gap (in-IDE parallel visual exploration) with a clean local, low-risk, fully-reversible footprint. Worth one controlled trial before any adoption.
- **Next review date**: after the first trial session.
