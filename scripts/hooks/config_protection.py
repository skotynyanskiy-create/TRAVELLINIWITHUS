#!/usr/bin/env python3
"""PreToolUse hook: block MODIFYING quality/security config files.

Rationale (adapted natively from an idea in affaan-m/ECC, not its code): an
agent under pressure to make CI green will sometimes weaken the lint/typecheck/
secret-scan config instead of fixing the actual code. This hook blocks EDITS to
a small set of guardrail config files while ALLOWING their first-time creation
(nothing to weaken yet).

Fires only on Edit/Write/MultiEdit targeting one of the protected basenames, so
it is silent during normal work.

Release valve (added 2026-07-26): HOOK_ALLOW_CONFIG_EDIT accepts either a
truthy value (unlock everything, blunt) or a comma-separated list of the files
to unlock, e.g. HOOK_ALLOW_CONFIG_EDIT=firestore.rules. Granular is preferred:
the previous all-or-nothing switch meant unlocking one file dropped the guard
on all of them. Set it in .claude/settings.local.json under "env" for the
duration of the work, then remove it.
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

# Files whose contents ARE the security boundary: a bad edit here is exploitable
# in production, not just broken. Tool grants in Claude Code carry no path
# scoping, so without this hook any thread, subagent or acceptEdits workflow
# could write them. Matched on path suffix, not basename: a bare `admin.ts`
# would over-match unrelated files, while `src/config/admin.ts` is unambiguous.
#
# `server.ts` was removed from this set on 2026-07-26. The owner had already
# taken it out of permissions.deny (commit 49adde8) to land the /family route
# fix; the hook kept blocking it anyway, so the fix shipped as a manual owner
# edit (4b1c589) and travellini-backend-engineer could not do the job it exists
# for. Two layers disagreeing is worse than either choice — server.ts is now
# guarded by process (backend-engineer + typecheck + tests), not by a hard stop.
HIGH_RISK = (
    "firestore.rules",
    "src/config/admin.ts",
)


def _unlocked() -> set[str]:
    """Parse HOOK_ALLOW_CONFIG_EDIT into the set of unlocked targets.

    Truthy scalar -> every guarded file. Otherwise a comma-separated list of
    names matched against the guard entry (`firestore.rules`) or its basename.
    """
    raw = os.environ.get("HOOK_ALLOW_CONFIG_EDIT", "").strip()
    if not raw:
        return set()
    if raw.lower() in ("1", "true", "yes", "all"):
        return {"*"}
    return {part.strip().replace("\\", "/") for part in raw.split(",") if part.strip()}


def main() -> int:
    unlocked = _unlocked()
    if "*" in unlocked:
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
            if risky in unlocked or os.path.basename(risky) in unlocked:
                return 0
            sys.stderr.write(
                f"BLOCKED: '{risky}' is a security boundary - a bad edit here is "
                f"exploitable in production. Per CLAUDE.md it belongs to "
                f"travellini-backend-engineer, after the owner has confirmed the "
                f"specific change. Do not route around this by editing another "
                f"file, rephrasing the path, or shelling out.\n"
                f"TO UNLOCK: describe the change to the owner. If they agree, they "
                f"add \"env\": {{\"HOOK_ALLOW_CONFIG_EDIT\": \"{risky}\"}} to "
                f".claude/settings.local.json, restart the session, and remove it "
                f"once the patch has landed.\n"
            )
            return 2

    if base not in PROTECTED:
        return 0

    # Allow first-time creation; only guard modification of an existing file.
    if not os.path.exists(path):
        return 0

    if base in unlocked:
        return 0

    sys.stderr.write(
        f"BLOCKED: '{base}' is a guardrail config. Fix the source so it passes "
        f"the existing rules - do not weaken {base} to make checks green. "
        f"If this edit is genuinely intended, say so explicitly and let the "
        f"owner confirm (unlock: HOOK_ALLOW_CONFIG_EDIT={base}).\n"
    )
    return 2  # exit 2 = block + feed stderr back to the model


if __name__ == "__main__":
    sys.exit(main())
