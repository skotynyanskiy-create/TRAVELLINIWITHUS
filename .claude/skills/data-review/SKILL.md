---
name: data-review
description: Ad-hoc data question for TRAVELLINIWITHUS. Invokes travellini-data-analyst to pull and interpret GA4, Sentry, Stripe, or Firestore data for ONE specific question. Use when the user asks "quanto ha convertito X?", "perché signups sono giù?", "il test A/B è significativo?", "quanti utenti hanno hit questo errore?". Different from /weekly-review which is the Monday cadence.
---

# /data-review

Single-question data Q&A via `travellini-data-analyst`. For the recurring Monday review use `/weekly-review` instead.

## When to use

- One specific data question with a clear scope
- A/B test interpretation (significance, effect size, decision)
- Bug-impact assessment ("how many users hit Sentry issue X?")
- Conversion attribution for a specific campaign
- Spike or drop investigation ("why are signups down this week?")
- Pre-launch baseline check ("what's normal for /collabora visits?")

Do NOT use for:

- Defining what to track → `travellini-growth-revenue-operator`
- Implementing tracking code → `travellini-frontend-builder` or `travellini-backend-engineer`
- Strategic decisions on the data → `travellini-growth-revenue-operator` after this report

## Protocol

1. **Refine the question with the user** before invoking. A good question has:
   - a specific metric (signups, orders, errors, LCP)
   - a specific period (last 7d, last 30d, since deploy on YYYY-MM-DD)
   - a specific scope (route, source, cohort, error ID)
   - a baseline for comparison (vs previous period, vs target)

   "Why is traffic down" is too vague. "Why are organic signups on /salento down 30% week-over-week vs last 4 weeks average" is actionable.

2. **Invoke `travellini-data-analyst`** with the refined question. The agent will:
   - Restate the question narrowly
   - Identify the right data source(s) (Firestore / Stripe / Sentry / GA4 / grep)
   - Pull raw counts (via firebase/stripe/sentry MCP)
   - Compare against baseline
   - Form a hypothesis with confidence level
   - Recommend ONE next action

3. **Receive the report**. If "data unavailable" is flagged for a critical area, do NOT proceed to action — first decide whether to invest in tracking that data (hand off to `growth-operator` for an event contract).

4. **Hand off the decision** if action is needed:
   - Strategic decision based on data → `travellini-growth-revenue-operator`
   - Bug fix needed → `code-explorer` → appropriate fix agent
   - New tracking needed → `growth-operator` (contract) → `frontend-builder` or `backend-engineer` (impl)

5. **Update docs** if the insight changes the state of a campaign or experiment:
   - `docs/11_Campaigns/<campaign>.md` for campaign data
   - `docs/14_Bugs/<bug>.md` for bug impact
   - `docs/MARKETING_OPERATIONS_HUB.md` for funnel state changes

## Output to user

```
## Data review — <question slug>
Period: <start → end>
Sample size: <N>

### Findings
- Headline: <metric + value + comparison>
- Anomalies: <spikes / drops with timestamps>

### Hypothesis
<one sentence + confidence level>

### Recommended next action
<one concrete step + owner agent>

### Data gaps (if any)
<what we'd need to know that we don't track today>
```

## Hard rules

- **Never invent numbers.** "Data unavailable" is a valid finding.
- **Always cite source** (collection name, event name, date range, filter).
- **PII protection**: aggregate or anonymize. No raw emails, names, payment IDs.
- **Stripe references**: last-4 or anonymized only — never full payment intent IDs in docs.
