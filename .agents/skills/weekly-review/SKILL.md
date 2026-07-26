---
name: weekly-review
description: Weekly cadence skill for TRAVELLINIWITHUS. Coordinates a data pull (data-analyst) → priority decisions (growth-operator) → docs update, producing a single weekly state document. Use every Monday morning or when the user says "weekly review", "stato della settimana", "cosa è successo", or "cosa facciamo questa settimana". The skill runs on the main thread — it invokes specialist agents in sequence and consolidates their output.
---

# Weekly review — TRAVELLINIWITHUS

Cadence: every Monday morning (or on demand). Output: a single dated document at `docs/40_Daily/WEEKLY_<YYYY-MM-DD>.md`.

## Protocol

Run these steps in order. Stop on blocker (user input needed).

### 1. Read current state

Before invoking any agent, read:

- `docs/MARKETING_OPERATIONS_HUB.md` — what was running last week
- `docs/10_Projects/PROJECT_RELEASE_READINESS.md` — release blockers
- `docs/10_Projects/PROJECT_30DAY_BACKLOG.md` — short-term priorities
- the most recent `docs/40_Daily/WEEKLY_*.md` if any — last week's plan, to compare against

### 2. Invoke `travellini-data-analyst`

Prompt:

> Produce the weekly insight report for the period `<last Monday → yesterday>`. Cover:
>
> - traffic (top routes, sources, week-over-week)
> - lead capture (signups by source, conversion rate)
> - shop (orders, gross, refunds, top SKUs)
> - errors (Sentry: top issues, new issues, regressions)
> - performance (any CWV regression vs baseline)
> - editorial (article views vs prior week, repurposing performance)
>
> Use only real data. Flag any "data unavailable" gaps. Output as the standard weekly report contract from your spec.

Save the analyst's report verbatim. Do NOT proceed if data is missing for a critical area — surface the gap to the user.

### 3. Invoke `travellini-growth-revenue-operator`

Prompt:

> Read the weekly insight report from `travellini-data-analyst` (above). Produce next-week priorities:
>
> - the ONE highest-leverage move for this week (concrete, time-boxed)
> - 2-3 supporting moves
> - what to STOP doing (if anything is wasting effort)
> - which agent owns each move + estimated R&B time
> - kill criteria for each move
>
> Apply your decision framework. Do not invent metrics.

### 4. Identify deploy / release window

If `growth-operator` proposes a launch this week, check with the user:

- Is the deploy window open this week?
- Is anyone on holiday / unavailable for emergency response?
- Are there in-flight handoffs (`docs/50_Scratch/HANDOFF_*.md`) that block work?

### 5. Write the weekly state document

Create `docs/40_Daily/WEEKLY_<YYYY-MM-DD>.md` (the Monday date):

```markdown
---
title: WEEKLY_<YYYY-MM-DD>
period: <Monday → Sunday>
status: active
created: <YYYY-MM-DD>
---

# Settimana del <date range>

## Headline (1 frase)

<the single thing that matters this week>

## Data snapshot

<paste data-analyst report — preserve structure>

## Priorità della settimana

<paste growth-operator priorities — preserve structure>

## What we're NOT doing this week

<explicit deprioritization>

## Open handoffs in flight

<grep docs/50*Scratch/HANDOFF*\*.md → list active ones with status>

## Quality / security / perf debt

- Quality blockers from last week: <list>
- Security findings open: <list>
- Perf regressions open: <list>

## Decisions needed from R&B before Wednesday

1. ...
2. ...

## Calendar

- Mon: ...
- Tue: ...
- Wed: ...
- Thu: ...
- Fri: ...

## Stop condition for this week

<when can we call this week successful>
```

### 6. Update Marketing Operations Hub

Append a one-line link to the new weekly doc inside `docs/MARKETING_OPERATIONS_HUB.md` under a "Weekly state" section.

### 7. Hand off to user

Return to the user:

- one-paragraph executive summary
- the file path of the new weekly doc
- the 1-3 decisions blocked on their input

## Anti-patterns

- **Don't invent data.** If `data-analyst` reports gaps, surface them. Do NOT fill in plausible numbers.
- **Don't over-program the week.** 1 primary + 2-3 supporting moves. R&B's time is the bottleneck.
- **Don't skip the "what we're NOT doing".** Explicit deprioritization is half the value of the review.
- **Don't repeat last week's plan verbatim.** If a move from last week didn't ship, explain why and decide: continue / pivot / kill.
- **Don't invoke other agents beyond data-analyst + growth-operator** unless one of them explicitly hands off (e.g., to security-auditor for an open finding).

## Hand-off coordination

This skill writes a "consumed" status on any `HANDOFF_*.md` files that delivered work last week, and may write a fresh `HANDOFF_<slug>_orchestrator_to_<agent>.md` for the week's primary move (or invoke `travellini-orchestrator` if the primary move requires multi-agent coordination).

## Definition of done

- [ ] `docs/40_Daily/WEEKLY_<date>.md` exists with all required sections
- [ ] `docs/MARKETING_OPERATIONS_HUB.md` linked to the new weekly doc
- [ ] User received the executive summary and decision asks
- [ ] No invented numbers; all gaps surfaced

## When NOT to use this skill

- Outside the weekly cadence (use `travellini-data-analyst` directly for a one-off question)
- For a launch decision in the middle of the week (use `travellini-orchestrator`)
- For a bug-impact assessment (use `data-analyst` + `quality-auditor` directly)

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
