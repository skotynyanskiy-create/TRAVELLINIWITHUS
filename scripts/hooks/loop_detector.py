#!/usr/bin/env python3
"""PostToolUse hook: warn when the same tool call repeats (stuck loop).

Rationale (adapted natively from an idea in affaan-m/ECC): agents sometimes
retry an identical failing command several times instead of rethinking. This
hook keeps a tiny per-session ring buffer of recent (tool + args-hash) calls and
injects a NON-BLOCKING warning when the same call appears >=3 times.

Non-blocking by design: it only ever adds a line of context, never stops a tool.
Silent during normal (varied) work. Reversible: remove the hook line from
.claude/settings.json.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import tempfile

RING = 8          # how many recent calls to remember
THRESHOLD = 3     # emit once the same call has happened this many times


def _state_path(session_id: str) -> str:
    safe = hashlib.sha1(session_id.encode()).hexdigest()[:12]
    return os.path.join(tempfile.gettempdir(), f"tw_loop_{safe}.json")


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    tool = payload.get("tool_name") or "?"
    tool_input = payload.get("tool_input") or {}
    session_id = payload.get("session_id") or "default"

    sig = tool + ":" + hashlib.sha1(
        json.dumps(tool_input, sort_keys=True, default=str).encode()
    ).hexdigest()[:16]

    path = _state_path(session_id)
    recent: list[str] = []
    warned: list[str] = []
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
            recent = data.get("recent", [])
            warned = data.get("warned", [])
    except (OSError, json.JSONDecodeError, ValueError):
        pass

    recent.append(sig)
    recent = recent[-RING:]
    count = recent.count(sig)

    emit = count >= THRESHOLD and sig not in warned
    if emit:
        warned = (warned + [sig])[-RING:]

    try:
        with open(path, "w", encoding="utf-8") as fh:
            json.dump({"recent": recent, "warned": warned}, fh)
    except OSError:
        pass

    if emit:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": (
                    f"LOOP DETECTED: {tool} called {count}x with identical args "
                    f"this session. Stop repeating it — diagnose the root cause "
                    f"or change approach before trying again."
                ),
            }
        }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
