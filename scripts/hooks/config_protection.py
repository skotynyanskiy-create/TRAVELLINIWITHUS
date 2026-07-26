#!/usr/bin/env python3
"""PreToolUse hook: block MODIFYING quality/security config files.

Rationale (adapted natively from an idea in affaan-m/ECC, not its code): an
agent under pressure to make CI green will sometimes weaken the lint/typecheck/
secret-scan config instead of fixing the actual code. This hook blocks EDITS to
a small set of guardrail config files while ALLOWING their first-time creation
(nothing to weaken yet).

Fires only on Edit/Write/MultiEdit targeting one of the protected basenames, so
it is silent during normal work. Reversible: remove the hook line from
.claude/settings.json, or set HOOK_ALLOW_CONFIG_EDIT=1 for a one-off override.
"""
from __future__ import annotations

import json
import os
import sys

# Only the knobs an agent could weaken to fake a green build. Deliberately NOT
# package.json (legitimately edited often) — mirrors ECC's pyproject exclusion.
PROTECTED = {
    "eslint.config.js",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    ".gitleaks.toml",
    ".markdownlint.json",
}

# CLAUDE.md's most-repeated rule (stated in 8 places): these belong exclusively
# to travellini-backend-engineer and never move without owner confirmation.
# Until now the rule was documentation only — tool grants in Claude Code carry
# no path scoping, so any thread, subagent or acceptEdits workflow could write
# them. Matched on path suffix, not basename: a bare `admin.ts` would over-match
# unrelated files, while `src/config/admin.ts` is unambiguous.
HIGH_RISK = (
    "server.ts",
    "firestore.rules",
    "src/config/admin.ts",
)


def main() -> int:
    if os.environ.get("HOOK_ALLOW_CONFIG_EDIT", "").lower() in ("1", "true", "yes"):
        return 0
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # never block on malformed input

    tool_input = payload.get("tool_input") or {}
    path = tool_input.get("file_path") or tool_input.get("path") or ""
    if not path:
        return 0

    norm = path.replace("\\", "/")
    base = os.path.basename(norm)

    for risky in HIGH_RISK:
        if norm == risky or norm.endswith("/" + risky):
            sys.stderr.write(
                f"BLOCKED: '{risky}' is a high-risk file. Per CLAUDE.md only "
                f"travellini-backend-engineer edits it, and only after the owner "
                f"has confirmed the specific change. Describe the change you want "
                f"and why, and let the owner decide. Do not route around this by "
                f"editing a different file or rephrasing the path.\n"
            )
            return 2

    if base not in PROTECTED:
        return 0

    # Allow first-time creation; only guard modification of an existing file.
    if not os.path.exists(path):
        return 0

    sys.stderr.write(
        f"BLOCKED: '{base}' is a guardrail config. Fix the source so it passes "
        f"the existing rules - do not weaken {base} to make checks green. "
        f"If this edit is genuinely intended, say so explicitly and let the "
        f"owner confirm.\n"
    )
    return 2  # exit 2 = block + feed stderr back to the model


if __name__ == "__main__":
    sys.exit(main())
