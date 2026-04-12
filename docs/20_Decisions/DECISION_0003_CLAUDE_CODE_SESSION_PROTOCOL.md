---
type: decision
area: workspace
status: active
priority: p2
owner: team
related: "[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]"
source: claude code setup
tags:
  - decision
  - ai
  - claude
---

# DECISION_0003_CLAUDE_CODE_SESSION_PROTOCOL

## Context

Claude Code is one of the main tools used to work on the repository. To avoid re-explaining project memory and marketing context in each session, the repository needs a stable startup protocol.

## Decision

Use the following startup stack for Claude Code:

- `AGENTS.md` as root system of record
- `CLAUDE.md` as Claude-specific entry point
- `docs/AI_COLLABORATION_PROTOCOL.md` as cross-tool workflow reference
- `.claude/CLAUDE_CODE_START_PROMPT.md` as ready-to-paste session prompt

## Consequences

- faster startup for new Claude Code sessions
- less context loss
- stronger consistency between code work and Obsidian documentation

## Links

- [[AI_COLLABORATION_PROTOCOL]]
- [[MARKETING_OPERATIONS_HUB]]
