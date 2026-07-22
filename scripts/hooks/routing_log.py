#!/usr/bin/env python3
"""PostToolUse hook: record every subagent dispatch so routing can be reviewed.

Model/effort routing is decided per task by the main thread. Without evidence
that decision never improves - it just gets re-guessed each session. This hook
appends one line per subagent run to docs/20_Decisions/ROUTING_LOG.md so a
periodic review can spot systematic over- or under-escalation (an opus agent
that only ever runs scripts, a sonnet agent whose output gets rejected).

Never blocks: always exits 0, swallows every error.
"""
from __future__ import annotations

import datetime
import json
import os
import sys

LOG = os.path.join("docs", "20_Decisions", "ROUTING_LOG.md")
# The vault audit (scripts/audit-obsidian.mjs) requires type/status/area on every
# docs/ note; `reference: active` is the registered type for a durable operational
# record consulted on demand.
HEADER = """---
title: ROUTING_LOG
type: reference
status: active
area: workspace
created: {created}
---

# Routing log

Auto-appended by `scripts/hooks/routing_log.py` on every subagent dispatch.
Read it during a routing review to find agents that are consistently
over-escalated (opus doing mechanical work) or under-escalated (sonnet output
rejected and redone). Rules live in `CLAUDE.md` > Model routing.

| data | agent | task | output |
| --- | --- | --- | --- |
"""


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = payload.get("tool_input") or {}
    agent = tool_input.get("subagent_type") or "general-purpose"
    desc = (tool_input.get("description") or "").replace("|", "/")[:70]

    response = payload.get("tool_response")
    size = len(json.dumps(response)) if response is not None else 0

    stamp = datetime.date.today().isoformat()
    row = f"| {stamp} | {agent} | {desc} | {size} ch |\n"

    try:
        os.makedirs(os.path.dirname(LOG), exist_ok=True)
        if not os.path.exists(LOG):
            with open(LOG, "w", encoding="utf-8") as fh:
                fh.write(HEADER.format(created=stamp))
        with open(LOG, "a", encoding="utf-8") as fh:
            fh.write(row)
    except OSError:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
