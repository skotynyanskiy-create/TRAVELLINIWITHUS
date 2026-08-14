---
name: cwv
description: Audit Core Web Vitals reale per TRAVELLINIWITHUS via Chrome DevTools MCP (LCP, CLS, INP, TBT, Lighthouse). Usa quando l'utente dice "performance audit", "CWV", "lighthouse", o dopo cambi UI rilevanti per verificare regressioni perf.
---

# Core Web Vitals Audit — Travelliniwithus

Audit performance reale via `mcp__chrome-devtools__*`. Va oltre il visual Playwright.

## Quando attivare

- "Verifica le performance"
- "Lighthouse della homepage"
- "CWV su /destinazioni"
- Dopo cambi a hero, immagini, font, route principali

## Prerequisiti

- Dev server attivo (`npm run dev` → localhost:3000)
- MCP `chrome-devtools` connesso (vedi `.mcp.json`)
- Pagina target identificata

## Pipeline

1. **Identifica pagina target** (default: homepage `/`)
2. **Lancia audit** via Chrome DevTools MCP:
   - Naviga alla URL
   - Cattura Lighthouse report
   - Estrai metriche: LCP, CLS, INP, TBT, FCP, Speed Index, TTI
3. **Confronta con i budget di `lighthouserc.json`**:
   - LCP < 2.5s
   - CLS < 0.1
   - INP < 200ms
4. **Identifica regressioni**:
   - Immagini hero senza preload?
   - Font display: swap mancante?
   - Layout shift su skeleton?
   - JS bundle bloat (chunks > 500kb)?
5. **Output**: tabella metriche + 3 fix prioritari + diff suggerito.

## Output template

```markdown
## Pagina auditata

URL: [url]
Viewport: mobile (375px) / desktop (1440px)

## Metriche

| Metric | Valore | Target  | Status           |
| ------ | ------ | ------- | ---------------- |
| LCP    | X.Xs   | < 2.5s  | ok / warn / fail |
| CLS    | X.XX   | < 0.1   | ok / warn / fail |
| INP    | XXXms  | < 200ms | ok / warn / fail |
| TBT    | XXXms  | < 200ms | ok / warn / fail |

## Top 3 fix prioritari

1. [Problema] -> [Fix concreto con file path]
2. ...
3. ...

## Verdict

[Pass / Warn / Fail] - commit blocker?
```

## Fix comuni nel repo

- LCP alto: preload hero image (vedi `vite.config.ts` + `OptimizedImage`)
- CLS: assicurarsi che skeleton riservi spazio identico al contenuto finale
- INP: ridurre interazioni JS bloccanti, lazy-load mappa Mapbox
- Bundle: gia escluso chunk pesanti da `modulePreload` (vedi commit `cdd1777`)

## Skill correlate

- `npm run audit:visual` per UX visiva
- `/audit-browser` per UX reale
- `/predeploy` include CWV nel sweep finale

## Local CLI alternative (opt-in)

Quando il Chrome DevTools MCP non e' disponibile o si vuole una baseline locale riproducibile:

- `npm run audit:cwv` — Lighthouse CI (`@lhci/cli`) su pagine chiave con budget assertion. Config attesa: `lighthouserc.json` con preset `lighthouse:no-pwa`.
- `npm run audit:bulk` — Unlighthouse: crawla tutte le 36 pagine pubbliche, report HTML interattivo in `.audit-screenshots/unlighthouse/`.
- `npm run audit:size` — size-limit: bundle budget JS/CSS gzipped, fail se sforato.
- `npm run audit:bundle:viz` — treemap interattivo HTML per esplorare il bundle.

Dettagli in [docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md](../../docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md).

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
