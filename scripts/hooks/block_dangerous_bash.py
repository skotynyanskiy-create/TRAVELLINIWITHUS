#!/usr/bin/env python3
"""PreToolUse hook: block destructive or owner-confirmation Bash commands.

Second net behind `permissions.deny` in .claude/settings.json. The deny list
covers the four worst offenders (rm -rf, force push, reset --hard, git clean);
this hook covers the rest of CLAUDE.md's "NEVER without explicit owner
confirmation" list plus a few destructive commands the deny list does not match.

Exit 2 blocks the call and feeds the message back to the model, which then has
to ask the owner. That is the intended flow: these commands are not forbidden,
they are not the model's to run unilaterally.

Reversible: remove the hook line from .claude/settings.json, or set
HOOK_ALLOW_DANGEROUS_BASH=1 for a one-off override.
"""
from __future__ import annotations

import json
import os
import re
import sys

# (pattern, why). Order matters only for which message the user sees first.
RULES: list[tuple[str, str]] = [
    (r"\brm\s+(-\w*[rR]\w*\s+-\w*f|-\w*f\w*\s+-\w*[rR]|-[a-zA-Z]*[rR][a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*[rR])",
     "recursive force delete"),
    (r"\bgit\s+reset\s+--hard\b", "discards all uncommitted work"),
    (r"\bgit\s+clean\s+-\w*f", "deletes untracked files permanently"),
    (r"\bgit\s+push\s+.*(--force(?!-with-lease)|(?<![\w-])-f\b)",
     "force push rewrites remote history"),
    (r"\bgit\s+checkout\s+(--\s+)?\.(\s|$)", "discards uncommitted changes in the tree"),
    (r"\bgit\s+restore\s+(--\s+)?\.(\s|$)", "discards uncommitted changes in the tree"),
    (r"\bgit\s+branch\s+-D\b", "force-deletes a branch that may not be merged"),
    (r"\bgit\s+add\s+(-A\b|--all\b|\.(\s|$))",
     "CLAUDE.md requires staging selectively by path on this tree"),
    (r"\bgit\s+add\s+[^|;&]*\.(env|mcp\.json)\b", "would stage a secrets file"),
    (r"\bdd\s+if=", "raw disk write"),
    (r"\bfirebase\s+deploy\b", "production deploy needs owner confirmation"),
    (r"\bnpm\s+run\s+deploy\b", "production deploy needs owner confirmation"),
]

INSTALL = re.compile(r"\b(?:npm\s+(?:install|i)|yarn\s+add|pnpm\s+add)\b(.*)")


def installs_new_package(command: str) -> bool:
    """True only when a package name follows — bare `npm install` restores the
    existing lockfile and is harmless."""
    match = INSTALL.search(command)
    if not match:
        return False
    tail = match.group(1).split("&&")[0].split(";")[0]
    return any(not tok.startswith("-") for tok in tail.split())


def main() -> int:
    if os.environ.get("HOOK_ALLOW_DANGEROUS_BASH", "").lower() in ("1", "true", "yes"):
        return 0
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # never block on malformed input

    command = (payload.get("tool_input") or {}).get("command") or ""
    if not command:
        return 0

    for pattern, why in RULES:
        if re.search(pattern, command):
            reason = why
            break
    else:
        if not installs_new_package(command):
            return 0
        reason = "installing a new package needs owner confirmation"

    sys.stderr.write(
        f"BLOCKED: {reason}. Per CLAUDE.md this command is not yours to run "
        f"unilaterally — explain what you want to do and why, and let the owner "
        f"decide. Do not rephrase the command to evade this check. If the owner "
        f"has already approved it, re-run with HOOK_ALLOW_DANGEROUS_BASH=1.\n"
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
