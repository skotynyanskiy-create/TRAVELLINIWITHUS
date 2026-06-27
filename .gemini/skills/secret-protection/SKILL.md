---
name: secret-protection
description: Audit and design secret-protection practices for TRAVELLINIWITHUS without reading or printing secret values. Use when checking .env handling, API keys, tokens, service accounts, MCP credentials, plugin auth, GitHub/Stripe/Firebase/Sentry config, logs, hooks, CI, or generated artifacts for leak risk.
---

# /secret-protection

Protect secrets without exposing them.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
2. Check existence, ignore status and risk category for sensitive files without
   printing values.
3. Prefer metadata and pattern scans that redact values.
4. Verify `.gitignore`, CI logs, MCP env handling, plugin auth flow and hook
   coverage.
5. Recommend rotation or restriction when exposure is possible, especially for
   Firebase, Stripe, GitHub, Sentry, OpenAI, Anthropic, Brevo, Resend and service
   account material.

## Output

Report:

- sensitive surface;
- whether it exists;
- whether it is ignored or tracked;
- risk;
- mitigation;
- owner action;
- validation command.

## Guardrails

- Do not print token, password, API key or private-key values.
- Do not open `.env` unless the user explicitly authorizes value inspection.
- Do not copy secrets into docs, tickets, prompts, logs or backup files.
- Do not run auth/login flows without confirmation.
