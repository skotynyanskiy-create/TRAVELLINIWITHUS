---
name: perf-audit
description: Run a Core Web Vitals deep-dive via travellini-perf-engineer. Measures LCP, INP, CLS, TTFB, TBT, bundle composition, font/image loading, third-party scripts. Use before deploy on perf-sensitive routes, after large refactors, when data-analyst flags a real-user regression, or on a cadence for top-traffic pages.
---

# /perf-audit

Measure-first skill. Diagnose then hand off — never patches.

## When to use

- Before deploy of any new public route
- After refactor of a top-traffic page (homepage, top articles, /collabora, /salento, etc.)
- When `travellini-data-analyst` flags a real-user CWV regression
- On a monthly cadence for the top 5 routes by traffic
- When the user says "lento", "performance", "LCP", "CWV"

## When NOT to use

- For static code quality → `travellini-quality-auditor`
- For visual / interaction nits not affecting metrics → `browser-auditor`
- For implementing fixes (this skill diagnoses only)

## Protocol

1. **Dev server must be running** (`http://localhost:3000`). If not, ask the user to start it.
2. **Invoke `travellini-perf-engineer`** with:
   - target routes (default: top 5 public routes if not specified)
   - viewport (default: mobile 375×667, 4G throttle)
3. **Receive measurements**: LCP/INP/CLS/TTFB/TBT/FCP per route + weight budget + ranked fixes.
4. **Compare to targets** (from agent spec):
   - LCP ≤ 2.0s (ceiling 2.5s)
   - INP ≤ 150ms (ceiling 200ms)
   - CLS ≤ 0.05 (ceiling 0.1)
   - TTFB ≤ 500ms (ceiling 800ms)
5. **Surface to user**:
   - Pass/fail per route
   - Top 3 blockers ranked by expected gain (ms or KB)
   - Owner agent for each fix
6. **Hand off** fixes:
   - Image weight → `travellini-asset-curator`
   - Code-split / lazy / font / bundle → `travellini-frontend-builder`
   - TTFB / cache / server → `travellini-backend-engineer`
7. **After fix, re-invoke** this skill on the same routes to verify gain.

## Output to user

```
## Perf audit — <date>
Viewport: mobile 375 / 4G

| Route | LCP | INP | CLS | TTFB | Verdict |
|---|---|---|---|---|---|
| / | 2.8s | 110ms | 0.04 | 620ms | FAIL (LCP) |
| /salento | ... | ... | ... | ... | ... |

## Top blockers (this session)
1. <route>: <fix> — gain ~Xms — owner: <agent>
2. ...

## Next actions
- <action 1 → agent>
- <action 2 → agent>

Full report: docs/50_Scratch/HANDOFF_<route>_perf_to_<owner>.md
```

## Hard rules

- Always measure on mobile + 4G throttle first. Desktop is secondary.
- Never propose a fix without estimated gain in ms or KB.
- Never blame "React" or "the framework" — find the specific component / asset / route.
- Cross-reference with `travellini-data-analyst` for real-user CWV when available — synthetic is a proxy.

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
