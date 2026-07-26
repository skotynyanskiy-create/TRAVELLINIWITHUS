---
name: innovation-radar
description: Scout and score emerging AI/dev tooling for TRAVELLINIWITHUS, including skills, agents, subagents, MCP servers, CLI tools, Codex plugins, GitHub workflows, design tools, SEO/marketing automation, and security tooling. Use when the user asks to explore new tools, stay current, evaluate innovation, or build a tooling roadmap without immediately installing or adopting anything.
---

# /innovation-radar

Scout new AI/dev tooling and convert it into actionable evaluation items.

## Workflow

1. Anchor in the project operating system:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
   - `docs/AI_TOOLING_RADAR.md`
2. Search current official or reputable sources when the user asks for latest
   tools, MCP servers, plugins, CLI tools, GitHub agent features, or external
   skill catalogs.
3. Classify candidates as skill, agent, subagent, MCP, CLI, plugin, GitHub
   workflow, design tool, SEO/marketing tool, security tool, or other.
4. Score each candidate on Travellini fit, benefit, risk, permissions,
   duplication, maintenance, testability and rollback.
5. Recommend one of: `scout`, `lab`, `adopt`, `defer`, or `reject`.
6. For anything beyond scouting, require an evaluation card based on
   `docs/90_Templates/TPL_Tooling_Evaluation.md`.

## Output

Return a concise matrix with:

- candidate name;
- type;
- source;
- Travellini use case;
- benefit;
- risk;
- permissions;
- duplication;
- recommended stage;
- next action.

## Guardrails

- Do not install, enable, configure or authenticate tools during scouting.
- Do not read or print secrets.
- Do not recommend permanent adoption without a rollback path.
- Do not import whole external catalogs into the repo.
- Prefer official sources and maintained repositories over novelty lists.
