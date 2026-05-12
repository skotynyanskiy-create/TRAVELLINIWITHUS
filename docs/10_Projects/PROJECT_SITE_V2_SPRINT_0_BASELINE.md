---
type: project
area: delivery
status: completed
priority: p0
owner: codex
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]'
source: V2 Sprint 0 baseline execution
tags:
  - project
  - delivery
  - qa
  - v2
---

# PROJECT_SITE_V2_SPRINT_0_BASELINE

## Obiettivo

Bloccare una baseline tecnica e visuale affidabile prima di iniziare la V2 di prodotto.

## Esito

Sprint 0 completato il 2026-05-05.

La baseline ora e piu solida:

- test unitari ripristinati
- lint senza errori e senza warning
- agent stack audit funzionante anche su Windows/CRLF
- visual audit Playwright eseguibile localmente
- overflow mobile risolto su `/destinazioni` e `/collaborazioni`
- predeploy completo passato

## Check eseguiti

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:agents
npm run audit:visual
npm run predeploy
```

## Risultati

- `typecheck`: PASS
- `lint`: PASS
- `test`: PASS, 4 file, 10 test
- `build`: PASS
- `audit:ui`: PASS con 57 warning statici gia noti
- `audit:firebase`: PASS, 0 errori, 0 warning
- `audit:stripe`: PASS, 9/9 controlli
- `audit:agents`: PASS, 0 errori, 0 warning
- `audit:visual`: PASS, 12/12 test desktop/mobile
- `predeploy`: PASS

## Fix applicati

### Test infrastructure

- `src/components/Button.test.tsx`: usa il render helper con router/provider.
- `src/test/setup.ts`: aggiunti mock jsdom per `matchMedia`, `scrollTo`, `IntersectionObserver`, `ResizeObserver`.

### Lint baseline

- `eslint.config.js`: esclusi i worktree `.claude` dall'audit ESLint principale.
- `src/components/Footer.tsx`: rimosso import inutilizzato.
- `src/components/Navbar.tsx`: rimossa dipendenza `guideLinks` non usata.
- `src/pages/Guide.tsx`: rimossi import inutilizzati.

### Agent stack audit

- `scripts/audit-agent-stack.mjs`: parsing frontmatter compatibile con CRLF.
- `.claude/agents/*.md`: aggiunti riferimenti obbligatori a `AGENTS.md`, `CLAUDE.md`, `docs/`, `docs/MARKETING_OPERATIONS_HUB.md`, `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`.

### Visual audit

- `e2e/visual-quality.spec.ts`: sostituito `networkidle` con `domcontentloaded` + assert UI reale, per evitare timeout su app con richieste persistenti.
- installato Chromium Playwright locale tramite `npx playwright install chromium`.

### Overflow mobile

- `src/components/PageLayout.tsx`: aggiunto `overflow-x-clip` alle pagine interne.
- `src/pages/Destinazioni.tsx`: aggiunto `min-w-0` ai grid item dei filtri per impedire che le chip scrollabili allarghino il layout.

## Baseline tecnica osservata

- Sitemap generata: 13 route statiche, 22 route filtro, 0 route dinamiche.
- `mapbox` resta il chunk piu grande: circa 1.7 MB raw, 477 KB gzip.
- `charts`, `react-core`, `firebase-firestore`, `editor`, `markdown`, `motion`, `gsap` restano chunk da monitorare per performance V2.
- `audit:ui` resta permissivo: 57 warning non bloccanti, principalmente raw color, inline style e un tracking pixel image senza `alt`.

## Blocker V2 rimasti

- contenuti demo/preview ancora da sostituire o mantenere noindex
- asset AI/placeholder ancora da sostituire con foto reali approvate
- sitemap dinamica ancora a 0 senza accesso Firestore in build
- roundtrip reale lead -> Firestore ancora da verificare
- shop reale e checkout/delivery non ancora pronti per monetizzazione pubblica
- Mapbox token reale ancora da validare in ambiente di release

## Prossimo sprint

Sprint 1 - Trust reale e Home V2.

Priorita:

1. sostituire asset hero/couple con foto reali approvate
2. configurare un reel reale o rimuovere fallback generico
3. trasformare la home in discovery entry piu forte
4. definire tracking CTA principali
5. verificare LCP hero e mobile 375/390

## Link

- [[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[14_Bugs/BUG_SITE_V2_MOBILE_OVERFLOW_BASELINE]]
