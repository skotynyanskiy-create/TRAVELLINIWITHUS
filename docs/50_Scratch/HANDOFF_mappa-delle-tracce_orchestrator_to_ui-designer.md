---
title: HANDOFF_mappa-delle-tracce_orchestrator_to_ui-designer
status: consumed
created: 2026-07-21
from: travellini-orchestrator
to: travellini-ui-designer
slug: mappa-delle-tracce
expires: 2026-08-04
type: handoff
area: delivery
---

# Handoff: trasformare `/mappa` nel seguito diretto del Diario delle meraviglie vere

## Why this work matters

La nuova homepage porta più volte l'utente alla Mappa, che oggi funziona ma parla ancora il linguaggio visuale precedente. Serve una direzione esecutiva unica che conservi la mappa reale e la faccia sembrare il capitolo successivo dello stesso taccuino.

## Decisions already made

- La homepage è approvata e non va ridisegnata o modificata.
- La prossima route è `/mappa`; `/esplora` verrà dopo.
- Il concept è **Mappa delle tracce**: carta piegata nel taccuino, non dashboard né atlante enciclopedico.
- Mappa scura centrale, carta calda, rilegatura/inchiostro blu, Fraunces e terracotta coerenti con la home.
- L'implementazione corrente MapLibre/OpenFreeMap, i filtri, preset, marker, cluster, popup, deep link e tracking restano.
- I seed demo devono essere dichiarati; nessuna immagine AI può diventare prova di visita.
- Mobile verticale/in-flow; motion minima e disattivabile; nessun pacchetto nuovo.
- Solo localhost: niente Sites, deploy o modifica di file backend/high-risk.

## Context the receiver needs

- Source visual truth: `docs/30_Design/references/home-journal-target-2026-07-21.png`
- QA della homepage: `design-qa.md`
- Homepage: `src/components/home/cinematic/CinematicHomepage.tsx` e relativo blocco `journal-*` in `src/index.css`
- Route: `src/pages/Mappa.tsx`
- Esperienza mappa: `src/components/map/MapboxWorldMap.tsx`
- Rebuild: `docs/10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026.md`
- Release state: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Brand: `DESIGN.md` e `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
- Piano completo: `docs/50_Scratch/PLAN_mappa-delle-tracce-redesign-2026.md`

Nota di drift: `DESIGN.md` descrive ancora Mapbox/token, mentre il componente corrente importa `react-map-gl/maplibre` e usa OpenFreeMap. Non proporre una migrazione; segnala soltanto l'aggiornamento documentale necessario.

## What the receiver should produce

- Una sola direzione consigliata, non tre concept alternativi.
- Wireframe/descrizione misurabile per desktop 1440 px e mobile 375 px.
- Gerarchia dei moduli: ingresso, mappa, filtri, percorsi suggeriti, scheda pin, lista mobile, CTA archivio.
- Component map che distingua ciò che si conserva, ciò che si ricompone e ciò che si elimina.
- State matrix per loading, real/mixed/demo, empty, selected pin, error e reduced motion.
- Motion grammar con durata, proprietà e fallback; massimo tre elementi animati insieme.
- Regole responsive, tastiera, focus, contrasto e target touch.
- Contratto visuale abbastanza preciso da evitare nuove decisioni al frontend-builder.
- Handoff successivo in `docs/50_Scratch/HANDOFF_mappa-delle-tracce_ui-designer_to_asset-seo.md` usando il template canonico.

## Out of scope (do NOT touch)

- Non modificare codice.
- Non cambiare homepage, navbar globale, footer o route wiring.
- Non cambiare provider mappa, dataset, coordinate, query Firestore o tracking.
- Non progettare `/esplora`, `/destinazione/italia`, `/chi-siamo` o `/collaborazioni`.
- Non introdurre WebGL decorativo, video, nuove librerie, integrazioni o deploy.
- Non inventare luoghi, visite, metriche, prezzi o partner.

## Open questions / decisions for the user

Nessuna domanda è necessaria per produrre la direzione V1. Se un media corrente non è pubblicabile, progettare un fallback testuale/paper-first e marcarlo per l'asset-curator.

## Next hand-off

- Next agent: `travellini-asset-curator` + `travellini-seo-conversion-strategist`
- Trigger: direzione desktop/mobile e state matrix complete, senza ambiguità per il builder

## Notes

La qualità da preservare è quella documentata in `design-qa.md`: gerarchia editoriale calma, pagina-oggetto, motion leggera, mobile intenzionale e zero fake proof. La Mappa deve aggiungere utilità senza sembrare un'app separata dal brand.
