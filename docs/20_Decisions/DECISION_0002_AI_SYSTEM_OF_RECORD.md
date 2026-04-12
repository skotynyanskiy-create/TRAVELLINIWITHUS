---
type: decision
area: workspace
status: active
priority: p1
owner: team
related: "[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]"
source: ai workflow setup
tags:
  - decision
  - ai
  - workspace
---

# DECISION_0002_AI_SYSTEM_OF_RECORD

## Context

The project is worked on with multiple AI tools, editors and workflows. Without a shared operating protocol, context gets fragmented and work must be re-explained repeatedly.

## Decision

Adopt the repository itself as the cross-tool AI operating system:

- `AGENTS.md` as root instruction file
- `CLAUDE.md` as assistant-specific but aligned entry point
- `.github/copilot-instructions.md` aligned to the same rules
- `docs/` as the shared Obsidian vault and operational memory
- `docs/AI_COLLABORATION_PROTOCOL.md` as the canonical explanation of how tools should collaborate

## Consequences

- less context rebuilding
- stronger continuity between coding, marketing and release work
- lower dependence on one specific AI tool

## Links

- [[AI_COLLABORATION_PROTOCOL]]
- [[OBSIDIAN_WORKFLOW]]
- [[MARKETING_OPERATIONS_HUB]]
