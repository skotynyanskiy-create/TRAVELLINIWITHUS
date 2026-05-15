# TRAVELLINIWITHUS — Claude Operating Rules

Premium editorial travel site for Rodrigo & Betta (@travelliniwithus). Italian UI.
Role: single-owner marketing lead + website builder. Quality > speed > features.

`AGENTS.md` is the root operating guide. `DESIGN.md` is the design-system source.
The repository root is the active Obsidian vault for Local REST API / MCP automation; `docs/` is the operational note store. Update relevant notes when UI, positioning, campaigns, or release state change.

## Stack

React 19 · TypeScript (non-strict) · Vite 6 · Tailwind 4 + CSS variables · Express · Firebase/Firestore · Stripe · Vitest + Playwright.

## Premium quality bar

- Editorial, image-led, calm hierarchy. No SaaS dashboards, no gradient blobs, no fake controls, no English placeholders.
- Use `PageLayout`, `Section`, lucide-react, CSS vars. Reuse existing components before inventing new ones.
- Every public page: one strong `h1`, Italian copy, specific CTA, no horizontal overflow on mobile.
- Preserve current visual language unless redesign is explicitly requested.

## Code discipline

- Smallest change that solves the problem. Stop there.
- Read only files directly relevant to the task.
- Do not refactor, rename, or restructure during a bugfix.
- No new `any`. No error handling for impossible cases. No comments unless WHY is non-obvious.
- Three similar lines is fine; abstract only at 4+ occurrences with a clear name.
- Run `npm run typecheck` after TypeScript edits. Run `npm run audit:ui` / `audit:visual` for UI work.
- High-risk files (require owner confirmation): `server.ts`, `firestore.rules`, `src/config/admin.ts`.

## Model routing (cost discipline)

Default model is **sonnet**. Never escalate without reason.

### Entry-point decision tree

Use this first for ANY user request. It tells you whether to invoke an agent immediately, plan with the orchestrator, or just answer directly.

```
Is the request a lookup / "where is X" / read a file?
  → code-explorer (haiku). DONE.

Is the request a single trivial edit (typecheck, rename, one-line fix)?
  → default thread (sonnet) directly. No agent. DONE.

Does the request touch ONE domain only?
  → invoke that specialist agent directly. DONE.
  (UI critique → ui-designer; copy → seo-strategist; perf → perf-engineer; etc.)

Does the request touch 2+ domains OR is it open-ended ("voglio lanciare", "fai una pagina /X")?
  → invoke travellini-orchestrator first.
  → It produces the plan + handoff briefs.
  → Then execute the plan agent-by-agent.

Is the request "come va il progetto" / "stato" / general report?
  → read docs/MARKETING_OPERATIONS_HUB.md + docs/10_Projects/PROJECT_RELEASE_READINESS.md, summarize. No agent.

Is the request "cosa dicono i dati"?
  → travellini-data-analyst directly. DONE.

Is the request a pre-deploy gate?
  → orchestrator → parallel: quality-auditor + security-auditor + perf-engineer + browser-auditor. DONE.
```

When in doubt: **invoke `travellini-orchestrator` first.** A 30-second plan saves 10 minutes of mis-routing.

| Task                                                                 | Route to                                       |
| -------------------------------------------------------------------- | ---------------------------------------------- |
| Multi-domain request, "voglio lanciare X", planning, sequence design | `travellini-orchestrator` (opus) — entry point |
| Search, grep, read logs, "where is X", summarize                     | `code-explorer` (haiku)                        |
| Standard bugfix, component, feature, PR                              | default (sonnet)                               |
| UI critique, visual direction, brand fit                             | `travellini-ui-designer` (opus)                |
| Italian copy (landing/CTA/meta), technical SEO, schema.org           | `travellini-seo-conversion-strategist` (opus)  |
| Long-form Italian article body (pillar / destination / itinerary)    | `travellini-editorial-writer` (opus)           |
| Social calendars, Reels/TikTok, newsletter, content repurposing      | `travellini-social-content-operator` (opus)    |
| Growth strategy, offer design, partner pipeline, analytics contracts | `travellini-growth-revenue-operator` (opus)    |
| Read & interpret analytics / Stripe / Sentry / Firestore data        | `travellini-data-analyst` (opus)               |
| Photo selection, crop, alt text, image performance, OG cards         | `travellini-asset-curator` (opus)              |
| React/Tailwind implementation of a clear plan                        | `travellini-frontend-builder` (opus)           |
| `server.ts`, `firestore.rules`, `admin.ts`, Stripe webhooks, API     | `travellini-backend-engineer` (opus)           |
| Web-stack security audit (secrets, Stripe, Firebase, Vite env, CORS) | `travellini-security-auditor` (opus)           |
| Core Web Vitals deep-dive (LCP/INP/CLS), bundle, fonts, code-split   | `travellini-perf-engineer` (opus)              |
| Real-browser UX/responsive/console audit                             | `browser-auditor` (opus) via Playwright MCP    |
| Release-wide QA, static checks, audit script runs, regressions       | `travellini-quality-auditor` (opus)            |
| Multi-file refactor, architecture, hard debugging                    | `code-architect` (opus) — rare                 |

### Cross-agent ambiguity resolution

Topics that touch multiple agents are split by **angle**, not by topic. Use this rule any time more than one agent could claim the work:

- **Media kit / collaborations / shop offer / lead magnet**
  - Strategy + offer + partner choice → `travellini-growth-revenue-operator`
  - Italian copy + meta + structured data → `travellini-seo-conversion-strategist`
  - Visual look + brand fit → `travellini-ui-designer`
  - Photo selection + alt text + image weight → `travellini-asset-curator`
  - Social repurposing + creator briefs → `travellini-social-content-operator`
  - Implementation of the page → `travellini-frontend-builder`
  - Release QA → `travellini-quality-auditor`
- **New pillar article / destination guide / itinerary**
  - Why-now + audience + business goal → `travellini-growth-revenue-operator`
  - Keyword cluster + H1 + slug + meta + schema → `travellini-seo-conversion-strategist`
  - Article body (1500-3500 parole) → `travellini-editorial-writer`
  - Photo plan + alt text → `travellini-asset-curator`
  - Page rendering + route + components → `travellini-frontend-builder`
  - Social repurpose plan → `travellini-social-content-operator`
- **"What is the data telling us?" / weekly review / A/B test interpretation**
  - Pull + interpret the data → `travellini-data-analyst`
  - Decide what to do about it → `travellini-growth-revenue-operator` (consuming the report)
- **Bug touching client + server** — start with `travellini-backend-engineer` for the high-risk side, then hand off to `travellini-frontend-builder`.
- **Visible UI regression** — `browser-auditor` diagnoses, `travellini-frontend-builder` fixes, `travellini-quality-auditor` re-audits.
- **Suspicious performance regression** — `travellini-data-analyst` confirms with Sentry/GA4 data, `travellini-perf-engineer` traces in Chrome DevTools, `travellini-asset-curator` checks image weight, `travellini-frontend-builder` patches, `browser-auditor` validates fix.
- **Pre-deploy security check** — `travellini-security-auditor` audits secrets/rules/Stripe/CORS, `travellini-backend-engineer` fixes, then re-audit.
- **Pre-deploy performance check** — `travellini-perf-engineer` measures all public routes, hands off to `frontend-builder` + `asset-curator` for fixes, then re-measures.

### Quality bar for agent output (applies to every agent)

An agent's response is acceptable only when:

- [ ] **Scope-respecting**: did not produce output outside its own scope (e.g., `ui-designer` didn't write Italian copy; `frontend-builder` didn't touch `server.ts`).
- [ ] **Italian for public output**: any text destined for public pages, social, or customer-facing copy is Italian.
- [ ] **Specific, not generic**: places named, prices stated when known, decisions explicit. No "scopri il magico mondo".
- [ ] **No inventions**: no fabricated numbers, partner names, prices, audience figures, quotes, or analytics data. Unknown facts marked `[VERIFY: ...]`.
- [ ] **Hand-off explicit**: if work continues to another agent, a handoff brief is written or referenced.
- [ ] **Output contract honored**: the structured fields the agent's own definition lists are present and non-empty.
- [ ] **No secrets**: no `sk_live_`, `whsec_`, private keys, service-account JSON, or `VITE_*_SECRET` in any output, even redacted-looking strings.
- [ ] **Docs/ updated** when state changed: campaigns, partnerships, releases, bugs, projects.

When an agent's output fails any of these, the invoking thread (main or orchestrator) should reject and re-prompt rather than passing it downstream.

### Agent hand-off protocol

When work crosses agent boundaries (e.g., growth → seo → editorial → asset → frontend), each agent writes a brief at:

```
docs/50_Scratch/HANDOFF_<feature-slug>_<from-agent>_to_<to-agent>.md
```

using `docs/90_Templates/TPL_Agent_Handoff.md`. The next agent reads the brief before starting. Handoffs lock decisions in writing so receivers don't relitigate them, and they expire (default: 14 days) to prevent stale state.

After consuming a handoff, mark `status: consumed` in the file's frontmatter. After 14 days untouched, the file is considered obsolete and may be deleted by the next session.

### Routing rules

- Default model resta **sonnet**. Gli agent travellini-\* + `browser-auditor` sono escalati a opus 4.7 perché producono decisioni strategiche o QA che condizionano il brand. Tutto ciò che è esecuzione triviale resta su sonnet/haiku.
- Per **lookup, grep, read, "dove sta X"** → sempre `code-explorer` (haiku). Mai opus.
- Per **single-file edit, typecheck, rename, bugfix lineare** → default sonnet, non invocare agent opus.
- **Never edit `server.ts`, `firestore.rules`, or `src/config/admin.ts` from the default thread or from `travellini-frontend-builder`.** Those files belong exclusively to `travellini-backend-engineer`, which requires user confirmation before editing.
- **Never invent analytics numbers.** When a decision depends on data, invoke `travellini-data-analyst` first — never guess.
- Before opening a PR or deploying, route through `travellini-quality-auditor` (static) + `browser-auditor` (real-browser) at minimum.
- For a new pillar article, the canonical sequence is: `growth-operator` → `seo-strategist` (meta/H1) → `editorial-writer` (body) → `asset-curator` (photos) → `frontend-builder` (page) → `social-content-operator` (repurpose) → `quality-auditor` + `browser-auditor` (gate).
- For a deploy to production, the canonical gate is: `quality-auditor` (static) + `travellini-security-auditor` (secrets/rules/Stripe) + `travellini-perf-engineer` (CWV on all public routes) + `browser-auditor` (real-browser smoke).
- **Travellini uses only its own `travellini-*` agents + `code-explorer` + `code-architect` + `browser-auditor`.** Global agents under `~/.claude/agents/` (`security-auditor`, `obsidian-librarian`, `python-implementer`, `risk-reviewer`, `test-runner`, `parser-debugger`, `solana-analyst`, `strategy-designer`) belong to other projects and must NOT be invoked from this repo.

## Commands

```bash
npm run dev                  # local server (via tsx server.ts)
npm run typecheck
npm run build
npm run audit:ui             # CSS vars, inline styles, a11y, icons, wrappers
npm run audit:visual         # Playwright visual quality (e2e/visual-quality.spec.ts)
npm run e2e                  # Playwright full test suite
npm run audit:firebase
npm run audit:stripe
npm run audit:agents         # validate .agents / .claude sync
npm run audit:quality        # full sweep
npm run predeploy
```

## Skill-first workflow

Prefer these when they match the request:

- `/bug-triage` → `/small-fix` for bugs
- `/quick-review` before commit
- `/explain-module` for orientation in unknown code
- `/deep-refactor` only when `/small-fix` is genuinely not enough
- `/audit-browser` per audit UX reale nel browser (dev server deve girare)
- `/smoke-test` dopo modifiche visive importanti
- `/audit-ui`, `/seo-check`, `/firebase-check`, `/stripe-flow`, `/predeploy`, `/deploy`, `/commit`
- `/new-page`, `/new-article`
- Specialist agents: `travellini-ui-designer`, `travellini-seo-conversion-strategist`, `travellini-growth-revenue-operator`, `travellini-social-content-operator`, `travellini-frontend-builder`, `travellini-backend-engineer`, `travellini-quality-auditor`, `browser-auditor`

## When to update `docs/`

- Homepage, navbar, hero, nav → `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
- Destinations → `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`
- Release state → `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Campaigns / partners / content → templates under `docs/90_Templates/` and `docs/MARKETING_OPERATIONS_HUB.md`
- New bug → `docs/14_Bugs/`

Do not load the full `docs/` tree at session start. Read only what the task requires.
