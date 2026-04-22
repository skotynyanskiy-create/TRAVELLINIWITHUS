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

## Smart Routing Protocol (cost discipline)

**Ceiling**: opus 4.7 high è disponibile come massima potenza. Il main thread **non lo usa automaticamente**: esegue prima un check di classificazione e delega a subagent economici quando il task non richiede opus. Il costo deve emergere dalle chiamate reali, non dalla configurazione statica.

### Before-Action Routing Check (BARC)

Prima di ogni tool call non banale il main thread, in testa al turno:

1. **Classifica** il task contro la tabella qui sotto.
2. **Delega** via `Agent` al subagent indicato se il task rientra in una classe economica.
3. **Giustifica opus** in una riga se il task resta sul main thread opus (es. "multi-file cross-layer debug: restano opus").
4. **Si fida dell'override** se l'owner dice esplicitamente "usa opus" / "fai tu direttamente": salta la delega.

### Tassonomia task → route

| Classe task | Keywords / segnali | Route |
|---|---|---|
| Ricerca, grep, "dove è X", enumerazione, log read | find, grep, search, list, dove, quale, elenca, mostra | `code-explorer` (haiku 4.5) |
| Spiegazione / orientamento in modulo sconosciuto | spiega, explain, cosa fa, come funziona | `code-explorer` (haiku 4.5) |
| Bugfix routine single-file | fix, typo, piccolo errore, rename locale | `travellini-frontend-builder` (sonnet) o edit diretto se ovvio |
| UI critique, direzione visuale | UI, visual, design, estetica, brand | `travellini-ui-designer` (sonnet) |
| Copy italiano, SEO, conversione | SEO, copy, italiano, conversion, lead | `travellini-seo-conversion-strategist` (sonnet) |
| Audit, QA, regressione | audit, QA, regression, release, predeploy | `travellini-quality-auditor` (sonnet) |
| Browser test reale, responsive, form | browser, Playwright, UX, responsive | `browser-auditor` (sonnet) via Playwright MCP |
| Implementazione feature da piano già definito | "implementa", "segui il piano" | `travellini-frontend-builder` (sonnet) |
| Refactor multi-file / architettura / debugging cross-layer | refactor grosso, design arch, bug multi-sistema | main thread opus (giustificato) o `code-architect` |

### Regole assolute

- **Mai opus per**: single-file edit, grep/search, spiegazioni, bugfix routine, typecheck run, qualsiasi cosa completabile in un file.
- **Sempre subagent read-only** quando l'esplorazione richiede >3 file letti.
- **Override owner** batte sempre la tabella.

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
