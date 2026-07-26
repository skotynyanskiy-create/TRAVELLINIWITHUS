---
title: HANDOFF_mappa-delle-tracce_ui-designer_to_asset-seo
status: consumed
created: 2026-07-21
from: travellini-ui-designer
to:
  - travellini-asset-curator
  - travellini-seo-conversion-strategist
slug: mappa-delle-tracce
expires: 2026-08-04
type: handoff
area: delivery
---

# Handoff: asset e SEO/conversione per Mappa delle tracce

## Why this work matters

La direzione UI V1 rende `/mappa` il seguito diretto del Diario: carta editoriale attorno alla mappa dark, gerarchia non-dashboard e flusso mobile in pagina. Prima del builder servono un controllo sugli asset già associati ai marker e un contratto di copy/SEO che non trasformi seed demo o media non verificati in prova di visita.

## Decisions already made

- Unica direzione: “carta piegata nel taccuino”.
- La mappa resta MapLibre/OpenFreeMap; nessuna migrazione o nuovo pacchetto.
- Dati, filtri, preset, cluster, marker, deep link e tracking restano invariati.
- Desktop: mappa 660 px in griglia 9/3; filtri fuori dal canvas; preset laterali.
- Mobile: flusso verticale, mappa 343 × 430 px, scheda pin in-flow, lista verticale.
- Demo/mixed devono essere dichiarati; nessuna immagine è prova di visita.
- L’esperienza deve funzionare paper-first anche senza immagini.

## Context the receiver needs

- Direzione esecutiva: `docs/50_Scratch/DESIGN_mappa-delle-tracce-v1.md`
- Handoff precedente: `docs/50_Scratch/HANDOFF_mappa-delle-tracce_orchestrator_to_ui-designer.md`
- Route: `src/pages/Mappa.tsx`
- Componente corrente: `src/components/map/MapboxWorldMap.tsx`
- QA visuale di riferimento: `design-qa.md`

## What the receiver should produce

- Asset curator: classificare immagini correnti come pubblicabili, fallback o da sostituire; definire crop 16:9 per scheda pin e thumbnail quadrata lista; nessuna nuova immagine obbligatoria.
- SEO/conversion: validare H1, intro, microcopy real/mixed/demo/empty/error, CTA archivio e metadata; mantenere italiano naturale e claim verificabili.
- Consegnare al frontend-builder un handoff unico, con copy definitivo e tabella asset per stato/tipo contenuto.

## Out of scope (do NOT touch)

- Non modificare codice, provider mappa, dataset, coordinate, query, tracking, homepage o route wiring.
- Non inventare luoghi, visite, metriche, prezzi, partner o prove visuali.
- Non introdurre asset AI come documentazione di un viaggio reale.
- Non pubblicare o fare deploy.

## Open questions / decisions for the user

Nessuna bloccante. Se un asset non è chiaramente pubblicabile, scegliere il fallback testuale/paper-first e segnalarlo al builder.

## Next hand-off

- Next agent: `travellini-frontend-builder`
- Trigger: copy/stati validati e asset matrix completata senza ambiguità

## Notes

La fonte di verità UI è `DESIGN_mappa-delle-tracce-v1.md`. La documentazione legacy che cita Mapbox/token è in drift rispetto al componente corrente e va segnalata, non usata per proporre una migrazione.
