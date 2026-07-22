---
title: ROUTING_LOG
type: reference
status: active
area: workspace
created: 2026-07-22
---

# Routing log

Auto-appended by `scripts/hooks/routing_log.py` on every subagent dispatch.
Read it during a routing review to find agents that are consistently
over-escalated (opus doing mechanical work) or under-escalated (sonnet output
rejected and redone). Rules live in `CLAUDE.md` > Model routing.

| data       | agent           | task                                   | output   |
| ---------- | --------------- | -------------------------------------- | -------- |
| 2026-07-22 | code-explorer   | Trivial lookup to test hook            | 1338 ch  |
| 2026-07-22 | general-purpose | Fix hook paths and obsidian statuses   | 8935 ch  |
| 2026-07-22 | Explore         | Map brand, content, media assets       | 24699 ch |
| 2026-07-22 | Explore         | Map business, ops, Higgsfield state    | 26117 ch |
| 2026-07-22 | Explore         | Map codebase and current state         | 38319 ch |
| 2026-07-22 | Plan            | Pressure-test technical migration plan | 36156 ch |
