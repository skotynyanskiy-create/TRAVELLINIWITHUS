---
title: HANDOFF_mappa-delle-tracce_asset-seo_to_frontend-builder
status: consumed
created: 2026-07-21
from:
  - travellini-asset-curator
  - travellini-seo-conversion-strategist
to: travellini-frontend-builder
slug: mappa-delle-tracce
expires: 2026-08-04
type: handoff
area: delivery
---

# Handoff: implementare Mappa delle tracce V1

## Obiettivo

Ricomporre `/mappa` come pagina successiva del Diario delle meraviglie vere,
preservando integralmente il motore MapLibre/OpenFreeMap e tutte le funzioni
esistenti.

## Fonti vincolanti

- `docs/50_Scratch/DESIGN_mappa-delle-tracce-v1.md`
- `docs/50_Scratch/ASSET_mappa-delle-tracce-v1.md`
- `docs/50_Scratch/COPY_mappa-delle-tracce-v1.md`
- `docs/50_Scratch/PLAN_mappa-delle-tracce-redesign-2026.md`
- `design-qa.md` per continuità con la homepage

## Implementazione richiesta

1. Trasformare `src/pages/Mappa.tsx` in una pagina scrollabile paper-first con
   ingresso editoriale, un solo H1 e lazy-load preservato.
2. Ricomporre `src/components/map/MapboxWorldMap.tsx`: filtri fuori dal canvas,
   mappa incorniciata, preset laterali desktop/in-flow mobile, risultati sotto,
   scheda pin esplicita e chiudibile.
3. Desktop 1440: tavola 9/3, mappa alta circa 660 px; mobile 375: mappa circa
   430 px, nessun overlay persistente, scheda pin in-flow.
4. Preservare dati, coordinate, cluster, pin, filtri, preset, deep link, tracking,
   Lite Mode e reduced motion. Nessuna migrazione provider o nuova dipendenza.
5. Applicare il copy definitivo del brief, incluso `Europa non ovvia` e la
   distinzione real/mixed/demo.
6. Rendere le immagini opzionali. I sei asset demo locali non devono apparire
   nella nuova UI; i marker Instagram restano paper-first. Le immagini runtime
   non verificate devono poter degradare allo stesso fallback senza layout rotto.
7. Non duplicare CTA mobile sticky e CTA finale nello stesso viewport.

## Verifiche minime del builder

- `npm run typecheck`
- `npm run build`
- `npm run audit:ui`
- controllo locale desktop/mobile senza overflow o errori console

## Fuori scope

- homepage, `/esplora`, navbar/footer globali e route wiring;
- provider/dataset/query/tracking;
- backend, Firebase rules, Stripe, nuovi asset, pacchetti o deploy;
- qualunque claim di visita o prova non presente nei dati.

## Next handoff

Al gate con `travellini-perf-engineer`, `travellini-quality-auditor` e
`browser-auditor` dopo implementazione e controlli base verdi.

## Consumo frontend — 2026-07-21

- Implementata la composizione paper-first in `Mappa.tsx`, `Mappa.css` e
  `MapboxWorldMap.tsx` senza modificare provider, coordinate, query, tracking o
  route wiring.
- Preservati lazy-load, filtri, preset, cluster, marker, deep link, scheda pin,
  Lite Mode e reduced motion; su mobile la scheda selezionata e' in-flow.
- Le immagini restano opzionali e sono mostrate solo con un flag esplicito di
  provenienza verificata; le sei cover demo non entrano nella resa.
- Check builder verdi: `npm run typecheck`, `npm run build`, `npm run audit:ui`;
  smoke locale a 1440 e 375 px senza overflow o errori console.
