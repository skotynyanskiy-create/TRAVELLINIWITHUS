---
type: reference
area: workspace
status: active
tags:
  - ai
  - hooks
  - security
  - workflow
---

# AI Hooks Guardrails

This note maps automation guardrails for TRAVELLINIWITHUS. Use it with
`AGENTS.md`, `CLAUDE.md`, `docs/`, `docs/MARKETING_OPERATIONS_HUB.md`,
`docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`, `docs/AI_AGENT_STACK.md`,
and `docs/AI_OPERATIONS_DASHBOARD.md`.

## Principle

Keep the system creative by default. Hooks should block only actions that are
destructive, irreversible, secret-bearing, or production-impacting. Everything
else should be advisory or handled by explicit audit commands.

## Current Hook Map

| Surface                   | Hook                                 | Mode                          | Purpose                                                                                                     | Notes                                  |
| ------------------------- | ------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Claude `PreToolUse`       | `block_dangerous_bash.py`            | blocking                      | Blocks destructive Bash patterns such as hard reset, force push, broad clean and non-cache recursive delete | Enabled in `.claude/settings.json`     |
| Claude `PreToolUse`       | `scripts/hooks/config_protection.py` | blocking                      | Blocks edits that weaken guardrail configs (eslint, tsconfig, gitleaks, markdownlint)                       | Override: `HOOK_ALLOW_CONFIG_EDIT=1`   |
| Claude `SessionStart`     | project health check                 | reporting                     | Reports dev server, branch, dirty count and `.env` presence                                                 | Does not print secret values           |
| Claude `UserPromptSubmit` | `quality_bar_prompt_validator.py`    | advisory                      | Warns on invented-data requests and agent quality-bar reminders                                             | Does not block normal work             |
| Claude `PostToolUse`      | `quality_bar_agent_output.py`        | advisory                      | Warns on secrets, high-risk files and unverified estimates in agent output                                  | Does not block                         |
| Claude `PostToolUse`      | `scripts/hooks/loop_detector.py`     | advisory                      | Warns when the same Bash call repeats 3+ times (stuck loop)                                                 | Non-blocking by design                 |
| Claude `PostToolUse`      | impeccable `hook.mjs`                | advisory                      | Surfaces UI design findings after Edit/Write on UI files                                                    | Wired in `.claude/settings.local.json` |
| Husky `pre-commit`        | `lint-staged` + gitleaks staged      | blocking                      | Staged lint/format pipeline plus `gitleaks protect --staged` secret scan                                    | Local Git hook                         |
| Husky `post-commit`       | graphify staleness check             | advisory                      | Reminds to refresh the code graph when it falls behind HEAD                                                 | Never blocks a commit                  |
| GitHub Actions            | CI quality job                       | blocking for PR/branch health | Typecheck, lint, test, build, UI/Firebase/Stripe audits                                                     | Remote validation                      |

Retired 2026-07-15: `quality_bar_precommit.py` (invalid `if` hook schema; its
coverage is superseded by lint-staged eslint `no-explicit-any` and
`gitleaks protect --staged` in Husky pre-commit).

## Blocking Guardrails

These should stay blocking because they prevent high-cost mistakes:

- broad destructive filesystem operations;
- `git reset --hard`, force push, broad git clean, branch deletion;
- staged `.env` or service-account style files;
- obvious secret patterns in staged diffs;
- bypassing verification with `git commit --no-verify`.

## Advisory Guardrails

These should stay advisory to avoid turning the system into a cage:

- invented metrics or unverified claims;
- high-risk file mentions in agent output;
- missing docs updates;
- large generated artifacts;
- optional quality improvements.

## Future Candidates

Evaluate these with `docs/90_Templates/TPL_Tooling_Evaluation.md` before
implementation:

- pre-push confirmation for production branches;
- deploy confirmation gate for Firebase Hosting and Sentry release scripts;
- generated artifact size warning;
- hook summary after long AI sessions;
- optional markdown/link audit for docs-heavy changes.

## Rollback

To disable the Bash dangerous-command gate, remove the `PreToolUse` entry from
`.claude/settings.json` and restart Claude Code. Keep the hook script itself
unchanged unless a false positive must be fixed.
