---
name: plan
description: Entry-point skill for fuzzy or multi-domain requests. Invokes travellini-orchestrator to produce a multi-agent plan with locked decisions and handoff briefs. Use when the user says "voglio lanciare X", "fai una pagina /Y", "facciamo una campagna su Z", "come procedo?", or any request touching 2+ specialist domains. Does NOT execute — produces the plan; the user/main thread executes.
---

# /plan

The single front door for complex work. Saves time by avoiding mis-routing.

## When to use this skill

- The request crosses 2+ domains (e.g. "nuovo articolo sul Salento" = growth + seo + editorial + asset + frontend + social + quality)
- The user said "voglio lanciare", "facciamo", "fai una pagina", "ho un'idea"
- You're unsure which specialist agent to invoke
- Before any pre-deploy gate

## When NOT to use

- Lookup question ("dove sta X?") → `code-explorer` directly
- Single-domain ask ("scrivimi la meta della homepage") → invoke that specialist directly
- Trivial edit (typecheck, rename) → default thread, no agent
- Status report ("come va?") → read `docs/MARKETING_OPERATIONS_HUB.md` + `PROJECT_RELEASE_READINESS.md`, no agent
- Pure data question → `travellini-data-analyst` directly

## Protocol

1. **Restate** the user's request in one sentence. Confirm scope.
2. **Invoke `travellini-orchestrator`** with the full user request + any context you already have.
3. **Receive the plan**: canonical sequence (S1-S9 or custom), locked decisions, open questions, handoff briefs written to `docs/50_Scratch/`.
4. **Surface to user**:
   - Executive summary of the plan (3-5 bullets)
   - Any open questions BEFORE work can start
   - First concrete action ("Now invoke <first-agent> with: <prompt>")
5. **Do not execute** the plan yourself. Wait for user confirmation.

## Output to user

```
## Piano per: <slug>

Sequence: <S1-S9 or "custom">
Effort: <S/M/L>
Handoff briefs: <count> in docs/50_Scratch/

## Decisioni da bloccare (prima di iniziare)
1. ...
2. ...

## Prima azione consigliata
<one sentence — usually "invoke <agent>">

Full plan: docs/50_Scratch/PLAN_<slug>.md
```

## Hard rules

- Never bypass the orchestrator for multi-domain work, even if "you know" the sequence.
- Italian-first for any public artifact the plan references.
- If orchestrator returns "decisions needed", stop and ask the user — never guess.

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
