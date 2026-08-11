---
type: bug
area: map-integration
status: resolved-local
priority: p2
owner: team
severity: low
repo: TRAVELLINIWITHUS
route: /, /mappa
repo_path: src/lib/openFreeMap.ts, src/components/home/HomeMapLibreBackground.tsx, src/components/map/FullScreenMapExperience.tsx
related: '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]], [[30_Design/UI_MAPPA_DELLE_TRACCE_2026]]'
source: browser verification 2026-08-02
tags:
  - bug
  - maplibre
  - openfreemap
---

# BUG_2026-08-02_openfreemap_missing_sprite

## Sintomo

Al caricamento della mappa in home, MapLibre segnalava che l'immagine stile
`circle-11` non era disponibile.

## Root cause

Lo stile remoto OpenFreeMap dark assegna `circle-11` ai layer delle citta a
zoom basso, ma lo sprite remoto corrente non contiene quell'immagine.

## Fix

All'evento `styleimagemissing`, il sito fornisce soltanto per `circle-11` un
fallback locale trasparente 11x11. Le etichette restano disponibili; marker
editoriali, map style, dati, filtri e controlli non vengono alterati.

## Test

- Unit test: fallback aggiunto una sola volta e ignorato per immagini gia
  disponibili o non correlate.
- Browser desktop e mobile: home e `/mappa`, senza warning `circle-11`.
