---
name: bug-triage
description: Systematic bug investigation — reproduce the symptom, locate the root cause, propose a minimal fix. Always run this before touching any code for a bug report.
agent: code-explorer
---

# /bug-triage

Use `code-explorer` agent for steps 1–3 to keep cost low.

1. **Reproduce** — Confirm the exact symptom. Check console errors, network tab, TypeScript output, and browser behavior.
2. **Locate** — Grep for the relevant function, component, or route. Read only directly relevant code.
3. **Trace** — Follow the data or call chain to the failure point. Note the exact file and line.
4. **Diagnose** — State the root cause in one sentence.
5. **Propose** — Write the minimal fix. One line or one function if possible.
6. **Risk check** — Does the fix touch `server.ts`, `firestore.rules`, or `src/config/admin.ts`? Does it affect other callers?

Return: root cause + `file:line` + proposed patch + risk list. Do not implement until the diagnosis is confirmed.
