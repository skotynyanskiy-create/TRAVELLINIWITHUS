---
name: github-agent-workflow
description: Design and audit GitHub AI workflows for TRAVELLINIWITHUS, including Copilot custom instructions, .github/instructions files, GitHub custom agents, Agent HQ, PR review automation, issue templates, reusable CI workflows, gh skill usage, and GitHub MCP/plugin choices.
---

# /github-agent-workflow

Design GitHub AI workflows that improve quality without duplicating repo rules.

## Workflow

1. Anchor in:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/`
   - `docs/MARKETING_OPERATIONS_HUB.md`
   - `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
   - `docs/AI_AGENT_STACK.md`
   - `docs/AI_TOOLING_RADAR.md`
2. Inspect existing `.github/copilot-instructions.md`, workflows, Dependabot
   config and issue/PR templates before proposing changes.
3. Keep GitHub instructions short and point to canonical repo docs instead of
   copying full Claude/Codex rules.
4. Prefer modular `.github/instructions/*.instructions.md` only when they reduce
   duplication or target a clear domain.
5. Evaluate GitHub MCP, Codex GitHub plugin, `gh skill`, Copilot custom agents
   and Agent HQ with the tooling evaluation template before stable adoption.

## Output

Return:

- recommended GitHub workflow;
- instruction files to keep, split or simplify;
- CI/checks impact;
- permissions and auth needs;
- tests;
- rollback.

## Guardrails

- Do not push branches, open PRs, change repository settings or install GitHub
  extensions without manual confirmation.
- Do not duplicate `CLAUDE.md` into GitHub instructions.
- Do not expose secrets in issues, PR descriptions, workflow logs or comments.
