---
name: cli-evaluator
description: Evaluate new command-line tools before installing, scripting, or adding them to stable TRAVELLINIWITHUS workflows. Use for AI coding CLIs, GitHub CLI extensions, security scanners, SEO tools, Lighthouse tools, deployment CLIs, package utilities, or any external CLI being considered for the project.
---

# /cli-evaluator

Evaluate CLI tools before they enter the project workflow.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
   - `docs/AI_TOOLING_RADAR.md`
2. Identify the CLI source, install method, update channel, Windows support,
   license, auth requirements and whether `npx` or local-only use is possible.
3. Check whether an existing npm script, installed CLI, MCP, plugin or skill
   already covers the same need.
4. Prefer lab-only trials before stable installation.
5. For stable adoption, require docs, rollback and a validation command.

## Output

Return:

- use case;
- install scope: none, temporary, local dev dependency, global, or system;
- benefit;
- security/supply-chain risk;
- maintenance burden;
- existing alternatives;
- test plan;
- rollback;
- decision.

## Guardrails

- Do not install new CLI tools during evaluation.
- Do not add package dependencies unless explicitly approved.
- Do not run commands that mutate repo, secrets, databases, hosting or payment
  settings unless the user approves that specific lab.
- Prefer existing `package.json` scripts when they satisfy the use case.
