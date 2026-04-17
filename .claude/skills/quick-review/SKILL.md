---
name: quick-review
description: Fast targeted code review of specified or recently changed files. Bug-focused, not style-focused. Use before committing or opening a PR.
---

# /quick-review

Review the specified file(s) or run `git diff HEAD` to find what changed. Check only these categories:

1. **Logic errors** — wrong conditions, off-by-one, stale closures, undefined access
2. **Type safety** — new `any`, missing prop types, unsafe casts
3. **Security** — XSS, injection, exposed keys, unvalidated user input, Firestore reads without auth checks
4. **Firebase/Stripe** — missing `.auth()` guards, unchecked error paths, double charges
5. **Null safety** — missing null checks on API responses, optional props, user input

Do NOT flag: formatting, naming conventions, missing comments, refactoring opportunities, test coverage.

Return a numbered list of real issues with `file:line`. If none found, say "No issues found."
