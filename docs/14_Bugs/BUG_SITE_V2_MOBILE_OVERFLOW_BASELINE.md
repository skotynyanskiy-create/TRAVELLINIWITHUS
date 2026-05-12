---
type: bug
area: product
status: fixed
priority: p0
owner: codex
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_SITE_V2_SPRINT_0_BASELINE]]'
source: V2 Sprint 0 visual audit
tags:
  - bug
  - qa
  - mobile
  - v2
---

# BUG_SITE_V2_MOBILE_OVERFLOW_BASELINE

## Sintomo

Durante `npm run audit:visual`, il controllo mobile falliva per overflow orizzontale su:

- `/destinazioni`
- `/collaborazioni`

## Impatto

Blocker V2: una pagina con scroll orizzontale su mobile non puo entrare in release readiness.

## Causa

- `/destinazioni`: i gruppi di chip scrollabili dentro grid item senza `min-w-0` allargavano il layout fino a oltre 1200px.
- `/collaborazioni`: micro overflow generato da elementi/animazioni della hero e superfici interne senza clipping orizzontale di pagina.

## Fix

- `src/components/PageLayout.tsx`: aggiunto `overflow-x-clip` al wrapper di pagina.
- `src/pages/Destinazioni.tsx`: aggiunto `min-w-0` al grid dei filtri e ai suoi item.
- `e2e/visual-quality.spec.ts`: reso il visual audit piu stabile usando `domcontentloaded` invece di `networkidle`.

## Verifica

```bash
npm run audit:visual
npm run predeploy
```

Risultato:

- `audit:visual`: PASS, 12/12
- `predeploy`: PASS

## Stato

Risolto il 2026-05-05.
