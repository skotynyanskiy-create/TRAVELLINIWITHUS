---
type: reference
area: workspace
status: active
tags:
  - ai
  - tooling
  - evaluation
  - design
---

# Tooling Evaluation — superdesign.dev / superdesign

## Summary

- **Name**: superdesign (`superdesigndev/superdesign`)
- **Type**: open-source in-IDE AI design agent (VS Code/Cursor/Windsurf
  extension) + a separate hosted web app product
- **Source**: https://github.com/superdesigndev/superdesign (confirmed
  active org repo). New official extension listing on Open VSX:
  `SuperdesignDev.superdesign-official`. Old listing: `iganbold/superdesign`
  (deprecated). Web product: www.superdesign.dev.
- **Status**: lab (unchanged from radar 2026-06-18, but scope narrowed — see
  Decision)
- **Owner**: Rodrigo
- **Date**: 2026-07-06

## Use Case

- **Travellini problem solved**: fast, disposable, in-IDE UI mockup
  exploration without committing to repo code — useful when brainstorming
  visual direction before `travellini-ui-designer` critique and
  `travellini-frontend-builder` implementation.
- **Expected benefit**: parallel mockup forks generated locally.
- **Who uses it**: owner, in a personal IDE session, never as an automated
  agent step.
- **When to use it**: early visual exploration only, output treated as
  disposable reference — never as a direct source for repo code (this repo's
  bespoke `PageLayout`/`Section`/Tailwind system must not be bypassed).
- **When not to use it**: as a replacement for `travellini-ui-designer` brand
  judgment, or for anything that touches the live web product/account (see
  below — that is a different trust boundary and out of scope here).

## Risk And Permissions

- **Permissions required**: local filesystem access to write into an isolated
  `.superdesign/` folder (confirmed from the project's own README — it does
  **not** write directly into source files). API key for the underlying model
  (can reportedly reuse an existing Claude Code/Cursor subscription, or an
  OpenAI-compatible custom endpoint).
- **Secrets required**: yes, a model API key — use a scoped/dev key, never a
  production key, for any trial.
- **Can operate read-only**: no (it generates files into `.superdesign/`), but
  blast radius is contained to that folder by default.
- **External services touched**: the **IDE extension** operates locally
  against a model API. The **web app** (www.superdesign.dev) is a separate
  hosted product/account — out of scope for this evaluation; do not conflate
  "trial the extension" with "create an account on the web app."
- **Production impact**: none if confined to the isolated folder and never
  merged directly into source.
- **Prompt-injection or data-exfiltration risk**: no telemetry or privacy
  disclosure was found in the README during this pass — unresolved, flag
  before lab.
- **Duplication with existing tools**: partial overlap with
  `travellini-ui-designer` (critique) and `/design-research` (inspiration
  gathering) — superdesign's unique value is generative in-IDE forking, not
  brand judgment, so it complements rather than replaces those.

## Verified Facts (2026-07-06, via GitHub API + Open VSX API + README fetch)

- GitHub repo `superdesigndev/superdesign`: description "AI Product Design
  Agent - Open Source", not a fork, actively committed — **latest commit on
  the main branch: June 29, 2026** (merge of PR #100). This directly updates
  the 2026-06-18 radar note that only flagged "Open VSX listing deprecated"
  as a maintenance concern — the core repo is not stale.
- **Open VSX listing status is more nuanced than the prior radar entry
  implied**:
  - Old listing `iganbold/superdesign`: `deprecated: true`,
    displayName "superdesign (DEPRECATED)", last version 0.0.13, published
    2025-10-28, description explicitly redirects users to the new listing.
  - New official listing `SuperdesignDev/superdesign-official`
    (publisher: JayZeeDesign / Jason Zhou): `deprecated: false`, version
    0.0.14, also published 2025-10-28, only **3,070 downloads** — i.e. the
    "current" listing is live and not deprecated, but adoption of it
    specifically is still low.
  - **However**, the repo's own README states the IDE extension is **"no
    longer actively maintained"** and that **"the main product is now a web
    application at www.superdesign.dev."** This is the load-bearing fact:
    the org is actively developing (June 2026 commits), but that activity is
    reportedly concentrated on the hosted web product, not the local IDE
    extension this evaluation is actually interested in.
- License: **dual-licensed** — primarily **AGPLv3**, with specific files
  under a separate "Super Design Enterprise Commercial License." This was
  not captured in the 2026-06-18 radar entry. AGPLv3's network-copyleft
  clause is not triggered by a personal local trial, but this is worth
  knowing if the tool is ever run as a shared/hosted service internally.
- Storage confirmed isolated to `.superdesign/` in the project root, not
  direct source-tree writes.
- **secure-design fork** (`hbmartin/secure-design`), previously listed in the
  radar as a "privacy-hardened" alternative worth comparing: most recent
  commit found was **October 3, 2025** — roughly 9 months stale relative to
  upstream's June 2026 activity. The prior radar framing ("younger fork,
  smaller community" as the only downside) is now inverted: the fork looks
  **less** active than upstream today, not just smaller.

## What Remains Unverified

- Any telemetry/analytics the extension itself sends while running locally.
- Whether "no longer actively maintained" (per the README) means the
  extension still receives security patches, or is effectively frozen.
- Full terms of the AGPLv3 + Enterprise dual license as they'd apply to any
  output the tool generates (not just the tool's own source).

## Lab Plan

- **Sandbox scope**: install the **current** official extension
  (`SuperdesignDev.superdesign-official`, not the deprecated `iganbold`
  listing) in a disposable/non-production IDE profile, scoped to a throwaway
  directory — never the live Travellini working tree until output is
  manually reviewed.
- **Commands or actions**: generate 2-3 disposable mockups for a real, already
  -decided visual direction (e.g. a section already scoped by
  `travellini-ui-designer`) and compare against manual/`design-research`
  output for speed and brand-fit.
- **Test data**: no real user/customer data; brand direction prompts only.
- **Success criteria**: meaningfully faster exploration without producing
  off-brand (SaaS-generic) output that would need to be discarded anyway.
- **Failure criteria**: output requires so much correction toward the brand
  DNA that it's faster to skip it; or the extension turns out to be
  effectively unmaintained/broken given the "no longer actively maintained"
  disclosure.

## Adoption Plan

- **Files/configs involved**: none in the repo — this is a local IDE-only
  tool; `.superdesign/` output must never be committed as final code.
- **Docs to update**: this card and `docs/AI_TOOLING_RADAR.md` if promoted
  past lab.
- **Validation commands**: manual visual review only; existing
  `npm run audit:ui` / `audit:visual` still gate anything that actually
  reaches the repo.
- **Rollback**: uninstall the extension; delete `.superdesign/`. Zero repo
  surface area if never merged.
- **Manual confirmation required**: yes — owner installs and trials
  personally; this is IDE-local, not something the agent can install itself.

## Decision

- **Decision**: lab (unchanged), but **scope corrected**: trial only the
  current official extension for local, isolated, disposable exploration —
  explicitly excluding the hosted web app (different trust boundary/account)
  and no longer treating `secure-design` as a meaningful comparison (it is
  now the stale option, not upstream).
- **Reason**: repo is genuinely active, not abandoned as the "deprecated
  listing" framing alone might have suggested — but the maintainers'own
  "IDE extension no longer actively maintained, main product is now the web
  app" disclosure means the local-use case this project actually wants is
  secondary to the vendor's roadmap. Worth a small trial, not a stable
  adoption.
- **Next review date**: after one hands-on trial, or if the IDE extension is
  discontinued outright.

## Install Log (2026-07-06)

- Installed via `code --install-extension SuperdesignDev.superdesign-official`
  → confirmed `superdesigndev.superdesign-official` v0.0.14 installed
  successfully (the current, non-deprecated listing — not `iganbold.superdesign`).
- Mechanical install only. The API-key setup (own Claude Code/Cursor
  subscription or OpenAI-compatible endpoint) and the actual mockup trial
  described in the Lab Plan above are hands-on steps for the owner —
  opening the canvas and judging output against brand fit is not something
  this session can do non-interactively.
