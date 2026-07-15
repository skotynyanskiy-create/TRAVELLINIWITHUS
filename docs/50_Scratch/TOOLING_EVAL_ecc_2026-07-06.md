---
type: reference
area: workspace
status: active
tags:
  - ai
  - tooling
  - evaluation
---

# Tooling Evaluation - ECC (affaan-m/ECC)

## Summary

- **Name**: ECC ("agent harness operating system"), `affaan-m/ECC`
- **Type**: multi-harness agent config megapack (skills + agents + hooks +
  commands + MCP configs) installed into every AI tool's config dir
- **Source**: https://github.com/affaan-m/ECC (MIT core; ECC Pro is a paid
  hosted GitHub App at $19/seat/mo)
- **Status**: reject (for adoption) / mined (2 ideas re-implemented natively)
- **Owner**: Rodrigo
- **Date**: 2026-07-06

## Verdict: REJECT for adoption, but MINED for ideas

Studied read-only in an isolated sandbox (shallow clone, no script executed,
no `install.sh`/`install-apply.js` run). Do NOT install it.

### Why reject

- **Star count is not credible**: GitHub API reports ~226k stars / ~34k forks
  on a repo created 2026-01-18 (~6 months), maintained by a single dev. That
  growth rate is numerically implausible - it would rank ECC among the ~15
  most-starred repos on all of GitHub. Treat popularity as zero evidence of
  quality/safety. (Same skepticism already applied to Headroom's 56k stars.)
- **Invasive installer**: `install.sh` -> `npm install` -> `scripts/install-apply.js`
  writes into every agent config dir (`.claude/`, `.mcp.json`, `hooks/`, ...) -
  exactly the high-risk surface `CLAUDE.md` protects and requires owner
  confirmation for. Never run it here.
- **Duplication + anti-lean**: its `.mcp.json` mounts `chrome-devtools` (already
  canonical here); 277 skills / 67 agents is precisely the accumulation the
  2026-07-05 lean-config audit exists to prevent.
- **Price is NOT the reason**: the code is MIT/free; the objection is trust +
  blast radius, not cost.

### What was mined (re-implemented natively, no ECC code/installer)

A read-only survey (subagent) extracted the reusable engineering ideas from the
branding/paid-feature noise. Only two passed the filter of "genuinely useful +
low-noise + reversible + fits a single-owner who dislikes flow-interrupting
hooks":

1. **config-protection** (from ECC's `config-protection.js` idea) ->
   `scripts/hooks/config_protection.py`. PreToolUse `Edit|Write|MultiEdit` hook
   that blocks MODIFYING a small set of guardrail configs
   (`eslint.config.js`, `tsconfig*.json`, `.gitleaks.toml`, `.markdownlint.json`)
   so the agent fixes the code instead of weakening the check. Allows first-time
   creation. Override: `HOOK_ALLOW_CONFIG_EDIT=1`.
2. **loop-detector** (from ECC's context-monitor idea, loop slice only) ->
   `scripts/hooks/loop_detector.py`. PostToolUse `Bash` hook, NON-blocking:
   emits one `additionalContext` warning when the same Bash call repeats >=3x in
   a session, then stays silent. Catches the "retry the same failing command"
   pathology.

Both are unit-tested (pipe-tested: correct block/allow, loop fires once on the
3rd identical call and is silent otherwise) and wired into
`.claude/settings.json` with the `if`/matcher in the correct position.

### Ideas deliberately NOT adopted

- **Fact-forcing gate** (ECC's cleverest idea): blocks the first edit to every
  file to force a facts-statement. Genuinely smart, but it would interrupt this
  owner's flow on every file - the exact frustration that got the misconfigured
  precommit hook removed on 2026-07-06. Left as opt-in only.
- **Batch typecheck at Stop**: adds latency to every turn end - poor fit for a
  flow-sensitive owner. Skipped.
- **Continuous-learning "instinct" apparatus, agent self-eval rubric,
  stale-replay banner**: already covered by auto-memory, the agent-output
  validator hook, and the CLAUDE.md quality bar. Not re-implemented.

## Activation note

Newly-added hooks are not picked up by the running session's settings watcher;
they activate after opening `/hooks` once or restarting Claude Code. Live
smoke-test on 2026-07-06 confirmed config-protection was wired correctly but not
yet firing in-session (an Edit to `eslint.config.js` reached "string not found"
instead of "BLOCKED"). Rollback: delete the two hook blocks from
`.claude/settings.json` and the two files under `scripts/hooks/`.

## Decision

- **Decision**: reject the tool; adopt 2 ideas natively (config-protection,
  loop-detector) as reversible project hooks.
- **Reason**: ECC's value is in a handful of engineering patterns, not the
  package; the package itself is untrustworthy (inflated stars) and invasive.
  Mining the ideas captures the upside with zero installer risk.
- **Next review date**: n/a (tool rejected). Revisit the hooks after one week
  of real use; drop either if it proves noisy.
