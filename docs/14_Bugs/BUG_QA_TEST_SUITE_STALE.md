---
type: bug
area: quality
status: partially-fixed
priority: p2
owner: team
severity: medium
repo: TRAVELLINIWITHUS
related:
  - [[10_Projects/PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15]]
  - [[10_Projects/PROJECT_RELEASE_READINESS]]
source: advanced full site audit 2026-05-15
tags:
  - bug
  - qa
  - playwright
  - tests
---

# BUG - QA test suite stale and partially flaky

## Sintomo

Alcuni test Playwright falliscono per aspettative non piu allineate al prodotto attuale, non necessariamente per bug utente.

## Impatto

- Predeploy rumoroso.
- Regressioni reali piu difficili da distinguere.
- Falsa sicurezza se i test vengono ignorati.

## Evidenze

- `home.spec.ts` cerca hero copy precedente (`L'Arte di...`) mentre la home attuale usa `Posti particolari che valgono davvero.`
- Test shop puntano a slug prodotto vecchi o demo non acquistabili.
- `audit:visual` fallisce su mobile per `body` hidden in 3 route, ma manual check dopo 1s mostra body/H1 visibili.
- `audit:size` non e' operativo per mancanza preset/dependency `size-limit`.
- `audit:cwv` va in timeout.

## Repo context

- repo_path: `e2e/`, `scripts/`, package scripts

## Fix

- Aggiornare selectors e copy expectations ai testi attuali.
- Separare test demo shop da test checkout reale.
- Stabilizzare wait strategy visual audit.
- Configurare `size-limit` oppure rimuovere temporaneamente il gate.
- Rendere `audit:cwv` riproducibile e con timeout coerente.

## Test

- `npm run test`
- `npx playwright test --project=chromium`
- `npm run audit:visual`
- `npm run audit:cwv`
- `npm run audit:size`

## Root cause

Il prodotto e' stato aggiornato piu velocemente della suite e2e/visual/perf.

## Fix 2026-05-15

- Aggiornato `e2e/home.spec.ts` al copy hero attuale e al controllo diretto della route destinazioni.
- Aggiornato `e2e/shop-and-checkout.spec.ts` per distinguere prodotti demo non acquistabili da prodotti reali.
- Stabilizzato `e2e/visual-quality.spec.ts` eliminando attese `networkidle` fragili.
- Verifica: `npx playwright test e2e/home.spec.ts e2e/shop-and-checkout.spec.ts e2e/visual-quality.spec.ts --project=chromium` PASS, 15/15.

## Residuo

- `audit:cwv` e `audit:size` restano da stabilizzare/configurare.
