---
title: HANDOFF_real-content-realign_frontend_to_gate
status: consumed
created: 2026-06-22
from: travellini-frontend-builder
to: travellini-quality-auditor + browser-auditor
slug: real-content-realign
expires: 2026-07-20
type: handoff
area: workspace
---

# Handoff: gate qualità finale del riallineamento contenuto reale

## Why this work matters

Prima di considerare chiuso il riallineamento social-first servono i gate:
nessuna regressione, nessun placeholder inventato residuo, CWV tenuti sotto
controllo con la griglia fitta, zero overflow mobile, schede e badge ADV
coerenti.

## Decisions already made (LOCK)

- Direzione social-first decisa; non è in discussione qui.
- Placeholder inventati rimossi/migrati: Dolomiti seed, pillar Salento, lead
  magnet "10 posti italiani". I 5 reel reali migrati a ContentItem.

## Context the receiver needs

- Pagine toccate: `/esplora` (griglia social-first), `/destinazione/:regione`
  (nuovi hub), Home se consuma reels/ContentItem.
- Seed reale: file config prodotto da frontend-builder.
- Tutti gli handoff `HANDOFF_real-content-realign_*` per le decisioni a monte.

## What the receiver should produce

travellini-quality-auditor (static):

- `npm run typecheck`, `npm run audit:ui`, `npm run audit:quality`, build PASS.
- Grep di sicurezza: nessun residuo dei placeholder inventati (Dolomiti demo,
  "10 posti italiani", pillar Salento) raggiungibile in produzione.
- Ogni ContentItem monetizzato mostra il badge ADV corretto (no contenuto
  monetizzato senza disclosure).

browser-auditor (real browser, Playwright MCP):

- `/esplora` e `/destinazione/:regione` su 375px e 1280px: zero overflow
  orizzontale, griglia leggibile, hook/prezzo/badge visibili, console pulita.
- LCP check sulle nuove rotte pubbliche (se >2.0s mobile → escalare a
  perf-engineer prima del go-live).

## Out of scope (do NOT touch)

- Fix di codice (rimanda a frontend-builder; backend a backend-engineer).
- Nuovo copy/design.

## Open questions / decisions for the user

- Soglia minima di ContentItem nel seed per uscire da `noindex` (coordinare con
  la regola hub di growth).

## Next hand-off

- Next agent: nessuno — review finale con owner + decisione go-live.
- Trigger: gate verde.
