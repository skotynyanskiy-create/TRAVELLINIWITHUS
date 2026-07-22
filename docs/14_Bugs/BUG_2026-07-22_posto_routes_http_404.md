---
title: 'BUG — /posto/:slug risponde HTTP 404 (soft-404 per i bot)'
type: bug
status: open
priority: P1
area: backend
found: 2026-07-22
found_during: verifica vertical slice Atlante
tags:
  - server
  - seo
  - posto
---

# BUG — tutte le rotte `/posto/:slug` rispondono HTTP 404

## Sintomo

`GET /posto/campania-burton-juice` (e ogni altro `/posto/:slug`) risponde **HTTP
404** dal server Express; la SPA client-side renderizza comunque la pagina
correttamente. Risultato: soft-404 — i bot vedono status 404 su pagine che per
l'utente esistono. Verificato in locale (dev server porta 3000) con Playwright.

## Root cause

`server.ts` → `resolveAppStatus(pathname)` (circa righe 577-643) enumera i rami
per `/articolo/`, `/shop/`, `/admin/editor/`, `/itinerari/`, `/guide/`,
`/destinazione/` — **non esiste alcun ramo per `/posto/`**, quindi ogni slug
posto cade nel `return 404` finale. La famiglia di rotte `/posto/:slug` è stata
aggiunta al router client senza aggiornare il resolver server. Bug
**pre-esistente** alla vertical slice Atlante (non introdotto da essa).

## Impatto

- Oggi: basso per gli utenti (la SPA renderizza), ma i 40 posti sono già
  linkati dal registro in home → i crawler seguiranno link verso pagine 404.
- **Bloccante per il piano Atlante**: `/posto/:slug` è il prodotto SEO del
  redesign. Nessun posto può passare a `isPlaceholder: false` (indicizzabile)
  finché il server risponde 404.

## Fix proposto (bozza per travellini-backend-engineer)

In `resolveAppStatus`, aggiungere prima del `return 404` finale:
ramo `pathname.startsWith('/posto/')` → slug presente negli id di
`src/data/content-seed.json` (importabile lato server come per gli altri
dataset) → `200`, altrimenti `404`. Nessun accesso Firestore necessario: il
seed è statico.

## Vincoli

`server.ts` è file ad alto rischio: la modifica passa SOLO da
`travellini-backend-engineer` con conferma owner, in una PR separata — è
naturale accorparla alla Fase 6 del piano Atlante (rimozione
`injectSentieroPrerender` + allineamento meta `/`), che tocca lo stesso file.
