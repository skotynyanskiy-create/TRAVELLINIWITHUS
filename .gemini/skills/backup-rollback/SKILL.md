---
name: backup-rollback
description: Prepare backup, restore, and rollback plans before sensitive TRAVELLINIWITHUS work, especially AI/dev configuration changes, MCP or plugin adoption, hooks, deploy, Firebase, Stripe, server.ts, firestore.rules, src/config/admin.ts, generated assets, or large refactors.
---

# /backup-rollback

Define a rollback path before sensitive work starts.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
2. Identify whether the task touches:
   - high-risk files;
   - secrets or local config;
   - generated assets;
   - database, hosting, payments or deploy;
   - AI agent, skill, MCP, hook or plugin configuration.
3. Record current state with non-secret metadata: branch, dirty file list,
   relevant config filenames and planned restore points.
4. Choose rollback method:
   - git revert for tracked files;
   - local gitignored config backup for machine-specific settings;
   - previous deployment/rules version for hosting or Firebase;
   - migration inverse or data export for database work.
5. Define validation after rollback.

## Output

Provide:

- backup scope;
- files/configs covered;
- what is excluded because it is sensitive;
- rollback command or procedure;
- manual confirmations required;
- validation checks.

## Guardrails

- Do not copy `.env`, tokens, service accounts or secrets into repo backups.
- Do not run destructive rollback commands without explicit confirmation.
- Do not assume uncommitted user changes can be discarded.
- Keep backup artifacts gitignored when they are machine-specific.
