---
type: reference
area: workspace
status: active
tags:
  - ai
  - tooling
  - evaluation
  - assets
  - video
---

# Tooling Evaluation — Motion (motion.so)

## Summary

- **Name**: Motion — "the Frontier Agent for Motion Design" (`motion.so`)
- **Type**: SaaS AI video generator + MCP server + API
- **Source**: https://motion.so (official). Learn page:
  https://motion.so/learn/best-ai-motion-graphics-generators (vendor-authored).
- **Status**: **reject** for referential video · **defer** for craft-only overlay
- **Owner**: Skott
- **Date**: 2026-08-02
- **Triggered by**: owner question — "può essere utile? possiamo fare qualcosa
  di ibrido?"

### Name collision — read before searching

Three unrelated products share the name. Search results conflate them and any
figure inherited from the wrong one is wrong:

| Product                     | What it is                                                                | Not this                            |
| --------------------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| **`motion.so`**             | AI motion-graphics video generator                                        | ← the subject here                  |
| `usemotion.com`             | AI calendar / task manager ($19–29 Pro/Business)                          | most "Motion pricing 2026" articles |
| `motion.dev` (npm `motion`) | animation library — **already a dependency**, `package.json:117` v12.42.2 | —                                   |

## Use Case

- **Travellini problem solved**: candidate — none confirmed. Nominally, turning
  published articles into social video (the `/repurpose` lane).
- **Expected benefit**: prompt-to-finished-MP4 without an editing timeline;
  callable from Claude Code over MCP.
- **Who uses it**: would sit under `travellini-social-content-operator` /
  `travellini-asset-curator`.
- **When to use it**: no confirmed case. See §Hybrid.
- **When not to use it**: any output depicting a place, a person, a trip or an
  experience. This is most of what a travel brand needs, and it is barred by
  `DECISION_IMAGERY_TRUTH_RULE_2026-07-22` regola 1 and `ASSET_STRATEGY §6`.

## What it actually does — verified

From the official site:

- Text prompt → **finished MP4**. Handles research, design, motion, voiceover,
  editing in one agent.
- Accepts business context, aspect/duration, **uploaded assets, screenshots,
  design systems and style-reference URLs**; reads a site to pick up its real
  colours and type.
- **MCP + API**: "Call Motion from Claude, ChatGPT, Cursor, or any agent over
  MCP." Confirmed on the homepage; `motion.so/docs/mcp` returns 404, so the
  exposed tool surface is **not verified**.
- Target use cases: launch videos, product demos, explainers, branded motion
  graphics — product-marketing register.

**The finding that decides this evaluation** — from Motion's own Learn page:

> it is "not a traditional timeline editor or manual compositor" — it does not
> composite over real video footage.

Uploaded assets act as **style reference**, not as a base layer. The output is a
generated scene, not your footage with something laid over it.

## The hybrid question

The owner asked whether real R&B material could be combined with AI craft.

**That hybrid is already project policy — it is not a new idea and does not need
a new tool.** `DECISION_IMAGERY_TRUTH_RULE_2026-07-22` §Conseguenze operative
and `ASSET_STRATEGY §7` already define exactly this split:

| Layer                                                           | Provenance                       | Rule                                                            |
| --------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| Base — places, people, experiences                              | real frames / real photos of R&B | `real-photo` / `real-frame`, regola 1                           |
| Craft over it — paper, ink, stamps, map wash, transition mattes | generated                        | `craft`, regola 2 + metadata card §5 + per-asset owner approval |
| Text                                                            | HTML on site surfaces            | `ASSET_STRATEGY §6` — text inside an image or video is a bug    |

So the real question is not _"is a hybrid allowed"_ but _"does motion.so do the
craft half better than the tool already chosen for it?"_

**Answer: no, and structurally so.** The hybrid needs one of two things:

1. a compositor that lays craft over real footage — Motion explicitly is not
   one; or
2. craft exported **with alpha**, composited by us — no alpha or overlay output
   is documented anywhere on the official site.

Motion does neither. Its output is a finished, self-contained generated video.
For a travel brand that means it generates the scene — the one thing regola 1
forbids. Used "correctly" (craft only, nothing referential) it would be a $29/mo
abstract-texture generator whose entire product design fights that constraint.

### Open sub-question — text burned into social video

`ASSET_STRATEGY §6` bans text inside images and video without qualifying the
surface. Read literally it also bans burned-in captions on a Reel, which is
standard practice and not "interface text". **This is a genuine ambiguity in the
rule, independent of motion.so**, and it will block any kinetic-typography work
until the owner says which reading is intended. Flagged, not assumed.

## Risk And Permissions

- **Permissions required**: SaaS account; MCP server would need enabling in
  `.mcp.json` + `settings.json` allowlist.
- **Secrets required**: yes — API key for MCP/API use.
- **Can operate read-only**: no; it is a generation service.
- **External services touched**: motion.so cloud. Uploaded brand assets and any
  connected site content leave the machine.
- **Production impact**: none directly — output would be a file, gated by the
  §5 metadata card and per-asset owner approval like any generated asset.
- **Prompt-injection / exfiltration risk**: moderate. "Connectors" + "reads your
  site" + MCP callable by an agent means a third-party service ingesting brand
  context on an agent's initiative. Would need the same OWNER-ONLY treatment as
  other write-capable MCPs.
- **Duplication**: **high** — Higgsfield already occupies this slot, has a
  written compatibility table (`ASSET_STRATEGY §7`), and its allowed operations
  (`reframe`, `personal_clipper`, `upscale_video`, `dubbing`) are precisely the
  _transform-real-material_ half of the hybrid, which Motion cannot do at all.

## Cost — NOT verified

The official site shows **no pricing** (only "Book a Demo" / "Get Started").

`[VERIFY: pricing]` — figures below come from **motionflare.ai, a competitor
selling against Motion**, and are unconfirmed by any first-party source:

- Flex $5 one-time / 200 credits · Pro $29-mo / 1,250 credits · Max $99-mo /
  5,000 credits; export 3 credits @1080p, 8 @4K; ~$6.90 per finished minute;
  no free tier.

Do not quote these as fact. They are recorded only to show the order of
magnitude of a second subscription.

## Lab Plan — only if the owner wants the craft lane tested

Not recommended before Higgsfield is actually turned on. If run anyway:

- **Sandbox scope**: one non-referential craft asset — a map wash or a paper
  transition matte. No places, no people, no brand claims.
- **Success criteria**: (a) output exports with **alpha**, usable as an overlay;
  (b) the abstract-craft register can be held for a full clip without the tool
  reintroducing product-demo motion language; (c) result is visibly better than
  the same asset from Higgsfield.
- **Failure criteria**: no alpha export → the hybrid is impossible by
  construction → **full reject**. Any generated place/person in output → instant
  stop, regola 1.
- **Test data**: no real R&B footage uploaded during the trial. A style
  reference is enough; do not hand brand material to an unevaluated service.

## Adoption Plan

Not applicable — no adoption proposed.

- **Rollback if ever trialled**: cancel account; remove any `.mcp.json` entry
  and allowlist rule; delete staged output from `generated/`. No repo code would
  depend on it.
- **Manual confirmation required**: yes — account creation, payment and MCP
  enablement are all OWNER-ONLY per `CLAUDE.md §Security`.

## Decision

- **Decision**: **reject** as a video generator · **defer** as a craft-asset
  source, pending the alpha-export answer.
- **Reason**: the capability the hybrid actually needs — laying craft over real
  footage — is the one capability Motion states it does not have. What remains
  is generated scenes, which regola 1 forbids for a brand whose value
  proposition is "ci siamo stati davvero". The residual craft-only lane is
  already assigned to Higgsfield, which additionally covers the
  transform-real-material half that Motion cannot touch.
- **The finding that matters more than the verdict**: Higgsfield is decided,
  documented, has a written capability table — and is **not authenticated**, so
  none of it runs today. This is the same dormant-capability pattern the radar
  flagged on 2026-07-06: the leverage is turning on what is already decided, not
  adding a second tool in front of it.
- **Next review date**: only if Higgsfield proves insufficient for craft assets
  after it is actually in use.
