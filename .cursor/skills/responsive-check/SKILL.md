---
name: responsive-check
description: Verifica responsive matrix TRAVELLINIWITHUS via Playwright MCP — testa una rotta a 320/375/768/1024/1440 e identifica horizontal overflow, layout shift, CTA nascosti. Usa quando l'utente dice "verifica mobile", "responsive", "viewport check", "controlla 375px".
---

# Responsive Check — Travelliniwithus

Audit responsive multi-viewport via `mcp__playwright__*`. Default: dev server su `http://localhost:3000`.

## Quando attivare

- "Verifica mobile della homepage"
- "Controlla che non ci sia overflow a 375px"
- "Responsive di /destinazioni"
- Dopo cambi a hero, navbar, grid, hero CTA

## Vincoli da `DESIGN.md`

- Mobile @375px MAI horizontal scroll (regola non negoziabile).
- CTA primario sempre visibile in viewport mobile (above fold o sticky).
- H1 sempre wrappa correttamente, no text overflow.
- Immagini hero sempre cover responsive, no crop testa creator.

## Pipeline

1. **Identifica route target** (default: `/`).
2. **Matrix viewport** (5 sizes):
   - 320px iPhone SE / Android small
   - 375px iPhone standard
   - 768px tablet portrait
   - 1024px tablet landscape / laptop small
   - 1440px desktop standard
3. **Per ogni viewport**:
   - `mcp__playwright__browser_resize(width, height)`
   - `mcp__playwright__browser_navigate(url)`
   - `mcp__playwright__browser_snapshot()` per accessibility tree
   - `mcp__playwright__browser_take_screenshot()` full page
   - Check console errors via `mcp__playwright__browser_console_messages()`
4. **Verifica esplicita**:
   - Horizontal overflow? (snapshot bbox o JS eval `document.documentElement.scrollWidth > window.innerWidth`)
   - H1 presente e leggibile?
   - CTA primario visibile?
   - Nessun testo in inglese su pagina pubblica?
5. **Output**: tabella per viewport con verdict + screenshot reference.

## Output template

```markdown
## Pagina auditata

URL: [url]

## Matrix

| Viewport | Overflow | H1 ok | CTA visible | Console errors | Verdict |
| -------- | -------- | ----- | ----------- | -------------- | ------- |
| 320      | no       | si    | si          | 0              | pass    |
| 375      | no       | si    | si          | 0              | pass    |
| 768      | no       | si    | si          | 0              | pass    |
| 1024     | no       | si    | si          | 0              | pass    |
| 1440     | no       | si    | si          | 0              | pass    |

## Problemi trovati

[lista puntuale con file/line e fix suggerito]

## Verdict

[pass / warn / fail]
```

## Fix comuni

- Overflow horizontal: cerca `min-w-` o `whitespace-nowrap` o flex senza `flex-wrap`
- CTA tagliato: sticky mobile? Usa `StickyMobileCTA` esistente
- H1 troppo largo su 320: aggiungi `text-balance` o `break-words`
- Hero image crop sbagliato: verifica `object-position` + altezza min

## Skill correlate

- `npm run audit:visual` per regression visiva
- `/cwv` per perf metric durante test
- `/a11y-check` per WCAG su ogni viewport

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `DESIGN.md` — design tokens, palette, typography and component conventions.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `docs/AI_AGENT_STACK.md` — current skills, agents, MCP policy.

Every finding must respect Italian public copy, premium editorial tone, and the release readiness gate documented in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
