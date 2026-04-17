# TRAVELLINIWITHUS — Claude Operating Rules

Premium editorial travel site for Rodrigo & Betta (@travelliniwithus). Italian UI.
Role: single-owner marketing lead + website builder. Quality > speed > features.

`AGENTS.md` is the root operating guide. `DESIGN.md` is the design-system source.
`docs/` is the operational vault; update relevant notes when UI, positioning, campaigns, or release state change.

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

| Task | Route to |
|------|----------|
| Search, grep, read logs, "where is X", summarize | `code-explorer` (haiku) |
| Standard bugfix, component, feature, PR | default (sonnet) |
| UI critique, visual direction | `travellini-ui-designer` (sonnet) |
| Italian copy, SEO, conversion | `travellini-seo-conversion-strategist` (sonnet) |
| Release QA, audits, regressions | `travellini-quality-auditor` (sonnet) |
| Browser audit, UX reale, responsive, form, regressioni | `browser-auditor` (sonnet) via Playwright MCP |
| Implementation of a clear plan | `travellini-frontend-builder` (sonnet) |
| Multi-file refactor, architecture, hard debugging | `code-architect` (opus) — rare |

**Never use opus for:** single-file edits, grep/search, explanations, routine bugfixes, typecheck runs, anything completable in one file. If a subagent is about to read more than 3 files to explore, delegate to `code-explorer` instead.

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
- `travellini-design-director`, `travellini-page-builder`, `travellini-web-quality-auditor`, `travellini-release-quality`, `travellini-stitch-figma-bridge`

## When to update `docs/`

- Homepage, navbar, hero, nav → `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
- Destinations → `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`
- Release state → `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Campaigns / partners / content → templates under `docs/90_Templates/` and `docs/MARKETING_OPERATIONS_HUB.md`
- New bug → `docs/14_Bugs/`

Do not load the full `docs/` tree at session start. Read only what the task requires.
