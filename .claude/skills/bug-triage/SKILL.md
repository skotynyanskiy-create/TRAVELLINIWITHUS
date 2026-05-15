---
name: bug-triage
description: Systematic bug investigation for TRAVELLINIWITHUS — reproduce, locate root cause, classify scope (client-only S3 vs high-risk server S4), propose minimal fix, route to the right specialist agent. Always run this before touching any code for a bug report.
---

# /bug-triage

Use `code-explorer` (haiku, cheap) for steps 1–3.

## Protocol

1. **Reproduce** — Confirm the exact symptom. Check console errors, network tab, TypeScript output, browser behavior. If user can't reproduce, ask for steps.

2. **Locate** — Grep for the relevant function, component, or route. Read only directly relevant code.

3. **Trace** — Follow the data or call chain to the failure point. Note exact `file:line`.

4. **Diagnose** — State the root cause in one sentence.

5. **Classify scope** — This determines which canonical sequence runs:
   - **S3 — client-only bug** if the fix touches ONLY:
     - `src/pages/*.tsx`, `src/components/*.tsx`, `src/styles/`
     - `src/lib/` (non-firebase, non-stripe, non-admin helpers)
     - Tailwind classes, CSS variables
     - Routing in `src/router*`
     - → Hand off to `travellini-frontend-builder`

   - **S4 — high-risk server / data bug** if the fix touches:
     - `server.ts`, `firestore.rules`, `src/config/admin.ts`
     - `firestore.indexes.json`, `firebase.json`, `.firebaserc`
     - Stripe handlers (webhook, checkout, refund)
     - Firestore data shape, queries with security implications, batched writes
     - admin allow-list or admin route gating
     - env handling (`VITE_*` exposure, .env)
     - → Hand off to `travellini-backend-engineer` with explicit confirmation gate
     - → After fix, REQUIRE re-audit via `/security-audit`

6. **Risk check** — flag if any of these apply:
   - Affects other callers (search for usages)
   - Cross-stack impact (changes both client + server)
   - Visible to users in production right now
   - Touches authentication / authorization
   - Touches payments / refunds
   - Touches PII / user data

7. **Propose minimal fix** — one line or one function. Smallest change that solves the problem. NO surrounding cleanup.

## Output

```
## Bug triage

### Symptom
<one line>

### Root cause
<one sentence + file:line>

### Scope classification
- S3 (client-only) → travellini-frontend-builder
- S4 (high-risk server) → travellini-backend-engineer + /security-audit re-run

### Proposed fix
<minimal patch, file:line>

### Risks
- <list — or "none">

### Next action
- Invoke <agent> with: <one-line prompt>
- After fix: <browser-auditor / quality-auditor / security-auditor as applicable>

### Handoff written
- docs/50_Scratch/HANDOFF_bug_<slug>_triage_to_<agent>.md
```

## Hard rules

- **Do NOT implement during triage.** Diagnosis only, until user confirms the proposed fix.
- **S4 bugs require explicit user "ok proceed"** before `backend-engineer` edits — no auto-fix on high-risk files.
- **After any S4 fix**, re-run `/security-audit` before declaring done.
- **After any UI-visible fix**, verify with `browser-auditor`.
