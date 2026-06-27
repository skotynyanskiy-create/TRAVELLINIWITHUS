---
name: hooks-audit
description: Audit and design automation hooks for TRAVELLINIWITHUS, including Claude Code hooks, Husky hooks, GitHub Actions, pre-commit checks, pre-push checks, dangerous-command blockers, secret-protection hooks, deploy gates, and quality automation.
---

# /hooks-audit

Review automation guardrails before adding or changing hooks.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
2. Inventory existing hooks and automation:
   - Claude project settings and global hook scripts;
   - Husky hooks;
   - GitHub Actions;
   - npm scripts used as gates.
3. Classify each hook as advisory, blocking, mutating or reporting.
4. Identify gaps for destructive commands, secret leakage, high-risk files,
   deploy/push confirmation, lint/test/build gates and final summaries.
5. Prefer fast, deterministic hooks. Move slow checks to explicit scripts or CI.

## Output

Provide:

- current hook map;
- missing guardrails;
- proposed hook;
- trigger;
- benefit;
- false-positive risk;
- performance impact;
- rollback.

## Guardrails

- Do not add hooks during audit unless the user explicitly asks to implement.
- Do not make hooks mutate files by default.
- Do not block routine read-only exploration.
- Do not store secret values in hook config or logs.
