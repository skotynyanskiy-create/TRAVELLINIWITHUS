---
name: plugin-evaluator
description: Evaluate Codex plugins, GitHub integrations, Figma, Canva, Google Drive, Stripe, or other app connectors before installing, enabling, or using them as stable TRAVELLINIWITHUS workflows. Use when the user asks to assess plugins, connectors, app integrations, or bundled skill/MCP/plugin ecosystems.
---

# /plugin-evaluator

Evaluate plugins and app connectors before adoption.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
   - `docs/AI_TOOLING_RADAR.md`
2. Identify what the plugin bundles: skills, MCP servers, app tools, auth,
   templates, agents, or workflows.
3. Determine whether the plugin serves a real Travellini workflow:
   design handoff, PR/CI, docs, deck creation, payments, analytics, content or
   marketing operations.
4. Check for overlap with existing local skills, MCP servers and npm scripts.
5. Require an evaluation card before stable installation or enablement.

## Output

Provide:

- plugin name and source;
- capabilities;
- required accounts/auth;
- read/write surface;
- likely use cases;
- duplication;
- lab plan;
- rollback;
- decision.

## Guardrails

- Do not install plugins or connectors during evaluation.
- Do not request auth unless the user approves a lab trial.
- Do not use plugins to bypass `DESIGN.md`, Italian copy rules, docs updates or
  project QA.
- Treat generated design/copy/content as draft input until reviewed.
