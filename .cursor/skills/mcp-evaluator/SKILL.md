---
name: mcp-evaluator
description: Evaluate Model Context Protocol servers before enabling, testing, or adopting them in TRAVELLINIWITHUS. Use when the user asks whether to add, remove, compare, secure, or trial an MCP server for Claude Code, Codex, GitHub Copilot, VS Code Agent, Figma, Firebase, Stripe, browser tooling, search, analytics, or other integrations.
---

# /mcp-evaluator

Evaluate MCP candidates before they become operational tools.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
   - `docs/AI_TOOLING_RADAR.md`
2. Identify the MCP candidate, source, transport, auth model, tools exposed and
   whether it can run read-only.
3. Compare it with existing MCP/plugin coverage before recommending adoption.
4. Classify permissions:
   - read-only context;
   - local browser/devtools;
   - repository write;
   - external service write;
   - payment, deploy or database operations.
5. Require manual confirmation before any lab trial that authenticates, writes,
   deploys, migrates, or touches production data.
6. Use `docs/90_Templates/TPL_Tooling_Evaluation.md` for lab or adoption.

## Output

Provide:

- concrete use case;
- risk rating;
- minimum permissions;
- safe lab setup;
- adoption blockers;
- rollback;
- decision: scout, lab, adopt, defer or reject.

## Guardrails

- Do not add MCP config during evaluation.
- Do not run MCP login flows unless the user explicitly approves a lab trial.
- Do not use production credentials for lab.
- Do not enable broad MCP registries or community servers by default.
- Keep default MCP set small; prefer task-scoped activation.
