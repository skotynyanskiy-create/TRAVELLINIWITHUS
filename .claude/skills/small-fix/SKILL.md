---
name: small-fix
description: Apply a minimal, verified patch for a known bug or simple change. One targeted edit, typecheck, done. No surrounding cleanup.
---

# /small-fix

Use after `/bug-triage` confirms the root cause, or when the fix location is already known.

1. Read only the affected file(s). Do not open unrelated files.
2. Apply the smallest possible change. Do not refactor, rename, or clean up surrounding code.
3. Run `npm run typecheck` and confirm zero new errors.
4. If the fix touches UI, state what to verify manually (route, interaction, visual).
5. If the fix touches `server.ts`, `firestore.rules`, or `src/config/admin.ts` — pause and confirm with the owner.

Return: changed file(s) with line numbers, what changed, typecheck result, manual verification needed.
