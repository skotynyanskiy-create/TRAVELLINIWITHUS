---
type: reference
area: workspace
status: active
tags:
  - ai
  - tooling
  - evaluation
---

# Tooling Evaluation — Headroom

## Summary

- **Name**: Headroom (`headroomlabs-ai/headroom`)
- **Type**: library + reverse proxy + MCP server
- **Source**: https://github.com/headroomlabs-ai/headroom (confirmed live via
  GitHub API, not a guess). Docs: https://headroom-docs.vercel.app/docs.
- **Status**: scout (upgraded from radar's 2026-06-22 "defer" — real project
  confirmed to exist; not yet lab-tested)
- **Owner**: Rodrigo
- **Date**: 2026-07-06

## Use Case

- **Travellini problem solved**: long agent sessions and multi-tool workflows
  (this repo's `travellini-*` agents, workflows, Graphify queries) push a lot
  of raw tool output/log/RAG content through the model context. Headroom's
  stated purpose is to compress tool outputs, logs, files and RAG chunks
  before they reach the LLM ("60-95% fewer tokens, same answers" per its own
  repo description — vendor claim, unverified).
- **Expected benefit**: lower token spend on long sessions/workflows without
  changing conversation behavior, if the compression is lossless for the
  parts that matter.
- **Who uses it**: would sit between Claude Code / MCP tool calls and the
  model, not end users directly.
- **When to use it**: only if real session token cost becomes a measured
  problem — not speculative.
- **When not to use it**: this repo already trims cost via `code-explorer`
  (haiku for lookups), scoped `docs/` reads, and the on-demand-only rule for
  workflows. Do not adopt to solve a problem that isn't observed yet.

## Risk And Permissions

- **Permissions required**: unconfirmed from this scouting pass. Repo topics
  include `proxy`, `fastapi`, `mcp` — a proxy/MCP-server deployment model
  implies it would sit in the request path between this environment and the
  Anthropic API (or between agents and MCP tool calls). That position is
  exactly the kind of surface CLAUDE.md flags for prompt-injection/exfiltration
  review — **not yet verified from source**, only from repo metadata.
- **Secrets required**: unknown — **must** be confirmed before any lab trial;
  do not wire this near a real API key until the actual request/response flow
  is read from source.
- **Can operate read-only**: unconfirmed (library mode plausibly yes; proxy/MCP
  mode implies active request interception, which is not read-only).
- **External services touched**: unconfirmed whether compression ever calls
  out to a third-party model/service or is fully local. **Blocking question
  for lab plan.**
- **Production impact**: none today (not installed).
- **Prompt-injection or data-exfiltration risk**: potentially medium-high if
  used as a proxy in front of live API traffic without reading the source
  first — a compression layer that summarizes/rewrites tool output is a
  plausible injection or leak vector if it calls an external service.
- **Duplication with existing tools**: none currently in this repo's stack;
  would be new operational surface area, not a replacement for an existing
  MCP.

## Verified Facts (2026-07-06, via GitHub API + repo metadata — not vendor copy)

- Repo: `headroomlabs-ai/headroom`, org-owned, not a fork.
- Description (repo-authored): "Compress tool outputs, logs, files, and RAG
  chunks before they reach the LLM. 60-95% fewer tokens, same answers.
  Library, proxy, MCP server."
- License: Apache-2.0.
- Primary language: Python.
- `created_at`: 2026-01-07. `pushed_at`: 2026-07-05 — actively pushed as of
  yesterday.
- `stargazers_count`: 56,791. `forks_count`: 4,160. `open_issues_count`: 544.
- Topics: `agent, ai, anthropic, claude-code, compression,
context-engineering, context-window, cursor, fastapi, langchain, llm, mcp,
openai, prompt-engineering, proxy, python, rag, token-optimization, tokens,
typescript`.

**Skeptical read of the above**: 56.8k stars and 4.1k forks in ~6 months
(created January 2026) is an extraordinary growth rate — larger than most
long-established dev tools. This project has previously flagged inflated
GitHub star counts in AI-tool social posts (see the 2026-06-22 syntaix.ai
carousel entry in `docs/AI_TOOLING_RADAR.md`, where posted counts didn't match
reality). Here the number comes directly from the GitHub API, so it is not a
carousel exaggeration, but a 6-month repo with this velocity still warrants
treating the popularity signal as weak evidence of quality/safety on its own
— it does not substitute for reading the source. High open-issue count (544)
on a 6-month repo is also a maintenance-load signal worth watching, not
necessarily disqualifying.

**Naming ambiguity found** (as instructed to check): there are at least two
unrelated "Headroom" projects in this space:

1. `headroomlabs-ai/headroom` (above) — the context-compression library/proxy/
   MCP server, Apache-2.0, Python.
2. `gglucass/headroom-desktop` — a **separate, differently-licensed** (MIT),
   Rust/Tauri **desktop menu-bar app**, described as "Unlock 2x more Claude
   Code and Codex usage", homepage `extraheadroom.com`, 416 stars, 39 forks,
   also actively pushed (2026-07-05). Different author/org, different
   product shape (desktop app vs. library/proxy/MCP server), same naming
   space. Do not conflate the two if this is ever discussed again.
3. `gglucass/headroom-labs` is simply a low-activity **fork** (1 star) of
   #1, not a separate project.

The original radar description ("LLM context/token compression MCP/proxy/lib")
matches project #1, `headroomlabs-ai/headroom`, most closely.

## Source-Read Update (2026-07-06, direct repo clone — the blocking question resolved)

Cloned `headroomlabs-ai/headroom` into an isolated scratchpad directory (no
repo secrets, outside the Travellini working tree) and read the actual
telemetry/subscription/pricing source instead of relying on repo metadata.
Findings, with file:line citations:

- The repo is **much larger in scope** than "a compression library" — it
  ships Rust core crates (`crates/headroom-core`, `headroom-proxy`,
  `headroom-py`), a TypeScript SDK, a web dashboard, a CLI, a `learn`/`memory`
  subsystem, and separate `telemetry/`, `subscription/`, and `pricing/`
  Python packages. This is a full platform, not a small utility — raises the
  overall maintenance-surface and audit burden if ever adopted beyond a
  narrow slice.
- `headroom/telemetry/beacon.py` (the actual gate, read in full): local
  compression-pattern telemetry is **off by default, fail-closed** — enabled
  only via explicit `HEADROOM_TELEMETRY=on`. Per its own docstring: **"the
  anonymous telemetry beacon that previously shipped aggregate stats has been
  removed... nothing is sent to Headroom Labs"** from this path, even when
  enabled locally. `telemetry/collector.py` comments confirm a **past, fixed
  bug** (PR #390): the documented opt-out (`HEADROOM_TELEMETRY=off`) used to
  not actually work due to checking the wrong variable name — a concrete,
  citable historical privacy bug in this exact project, now fixed. Worth
  remembering as a precedent (docs and enforcement drifted apart once
  already).
- `headroom/telemetry/reporter.py`: a **separate** `UsageReporter` class does
  call `https://app.headroomlabs.ai` (`/v1/license/validate`,
  `/v1/license/usage`) — but only when instantiated with a `license_key`,
  i.e. it is the **billing/licensing channel for managed/enterprise
  deployments**, not something a plain open-source library/proxy trial
  triggers. Its own docstring states it never sends message content, API
  keys, prompts, tool results, or user data — only aggregate counts. This
  lines up with the dual AGPLv3 + Enterprise license found for superdesign-
  style open-core products; Headroom appears to follow the same model.
- `headroom/subscription/*.py` is a **distinct, optional feature**: it reads
  the user's own Anthropic (`api.anthropic.com/api/oauth/usage`), Codex/
  ChatGPT (`chatgpt.com/backend-api/wham/usage`), and GitHub Copilot
  (`api.github.com/copilot_internal/user`) subscription-usage endpoints using
  the user's own OAuth session, to answer "how much of my quota have I used."
  This is a legitimate, first-party read (not a Headroom-Labs endpoint), but
  it means enabling this feature hands the tool OAuth-scoped access to those
  accounts — a separate trust decision from just using the compressor.

**Net effect**: the one blocking question from the original Lab Plan — "does
anything leave the machine in plain library/proxy use?" — is now answered
from source: **no**, not by default, and not even when local telemetry is
turned on (the beacon was removed). The `app.headroomlabs.ai` and
subscription-quota calls are separate, opt-in features tied to enterprise
licensing or a specific quota-checking feature, not the core compression
path.

## What Remains Unverified

- Whether the "60-95% fewer tokens, same answers" claim holds under real
  Travellini workflows (agent handoffs, Italian long-form editorial context)
  or only under the benchmark cases in its own docs — not yet benchmarked.
- Exact behavior of the Rust proxy core (`crates/headroom-proxy`) under
  load; the Python-level read covered the telemetry/subscription/pricing
  modules, not the full Rust codebase.
- Whether adopting only the "library mode" slice is practical given how much
  of the repo (dashboard, CLI, memory/learn subsystem, subscription quota
  tooling) is bundled together rather than installable piecemeal.

## Lab Plan

- **Sandbox scope**: throwaway directory (used
  `AppData/Local/Temp/claude/.../scratchpad/headroom-trial`, discarded after
  review), no repo secrets, no real `.mcp.json` wiring, `HEADROOM_TELEMETRY`
  left unset (default off), no license key, no subscription-quota feature
  enabled.
- **Commands or actions**: source clone + targeted grep/read completed
  2026-07-06 (see above). A hands-on compression benchmark against synthetic
  tool output (to check the 60-95% claim) was **not** run in this pass —
  next step if this moves forward.
- **Test data**: non-sensitive sample logs/tool output only — never real
  Firebase/Stripe/Sentry data.
- **Success criteria**: measurable token reduction with no loss of
  information needed for the task; confirmed no outbound network calls in
  library mode — **the network-call check is now satisfied from source**.
- **Failure criteria**: any undocumented outbound network call beyond what's
  documented above, or compression that silently drops information relevant
  to a real task.

## Decision

- **Decision**: **lab-approved, library/proxy mode only** — no license key,
  no subscription-quota feature, `HEADROOM_TELEMETRY` unset. The enterprise
  licensing channel (`reporter.py`) and the subscription-quota feature
  remain **scout**, not lab, since they involve a billing relationship and
  OAuth-scoped access to Anthropic/OpenAI/GitHub accounts respectively —
  separate decisions from trialing the compressor itself.
- **Reason**: the original blocking question (does anything leave the
  machine) is now answered directly from source, not vendor copy: no, in
  the plain OSS/library configuration. The extraordinary star-growth
  caveat from the initial scouting pass still stands as a general skepticism
  note, but it no longer gates the _security_ question, only the
  _popularity-as-quality-signal_ question. The adversarial-verification
  stage of the original research workflow still never completed — this
  source read is a substitute for that, done directly rather than via a
  subagent.
- **Next review date**: after a hands-on synthetic-data compression
  benchmark, before considering the subscription-quota or enterprise-license
  features at all.
