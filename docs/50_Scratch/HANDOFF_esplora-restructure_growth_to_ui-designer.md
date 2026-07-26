---
title: HANDOFF_esplora-restructure_growth_to_ui-designer
status: obsolete
created: 2026-05-24
from: travellini-growth-revenue-operator
to: travellini-ui-designer
slug: esplora-restructure
expires: 2026-06-07
type: handoff
area: workspace
---

# Handoff: information architecture, flow e gerarchia visiva di Esplora

## Why this work matters

Con il job-to-be-done e le decisioni strategiche lockate da growth, serve tradurle in una IA e un flusso concreti: cosa vede l'utente prima, in che ordine, quante scelte per schermata, come la curatela si rapporta al finder, e come Esplora si distingue visivamente da Mappa e Itinerari. Obiettivo: massima esperienza d'uso per coppie italiane, premium editorial, anti-SaaS.

## Decisions already made

- Tutte le decisioni nel brief growth (`HANDOFF_esplora-restructure_orchestrator_to_growth.md`, sezione output) e la sua risposta. NON relitigare il job-to-be-done ne' l'ordine curatela/finder deciso da growth.
- Quiz pubblico rimosso: se growth lo dichiara morto, NON reintrodurre un quiz modal; al massimo proporre un finder guidato inline coerente.
- Vincoli brand: PageLayout/Section, lucide-react, CSS vars, palette sand/ink, serif-led, no gradient blobs, no fake controls, no SaaS dashboard, no dimensioni statistic-strip overbuilt (vedi DESIGN.md). Una sola h1 per pagina.

## Context the receiver needs

- Direzione growth: leggi la risposta di growth + [HANDOFF_esplora-restructure_orchestrator_to_growth.md]
- Pagina attuale e blocchi: [src/pages/Esplora.tsx] (hero photographer-first -> anteprima mappa -> big choice 3 zone -> barra filtri -> collezioni -> risultati griglia magazine -> newsletter + B2B)
- Stato IA consolidata: [docs/10_Projects/PROJECT_ESPLORA_CONSOLIDATION.md]
- Componenti riusabili discovery: ArchiveCard, ActiveFilterChips, AutocompleteResults in [src/components/discovery/]

## What the receiver should produce

Direzione UX/UI lockata (inline) con:

1. **Sequenza dei blocchi** della pagina /esplora dall'alto, con razionale: cosa taglia, cosa promuove, cosa collassa. In particolare la decisione curatela-prima-del-finder resa visivamente.
2. **Gerarchia filtri**: quali dimensioni sono chip sempre visibili, quali in accordion, quali rimosse in regime archivio-vuoto. Coerente con la priorita' decisa da growth.
3. **Stato archivio vuoto/preview**: come deve apparire Esplora con pochi contenuti reali senza sembrare rotto o finto. Empty-state, collezioni curate, banner preview.
4. **Distinzione visiva Esplora / Mappa / Itinerari** perche' l'utente capisca al volo dove si trova e perche' usarne una invece dell'altra.
5. **Mega menu navbar Esplora**: allineamento o ripensamento rispetto alla pagina.
6. Specifiche per asset-curator (quali immagini servono per big-choice/collezioni: quante, formato, mood) e per frontend-builder (componenti da riusare/modificare/eliminare, incluso il destino di EsploraQuiz.tsx).

## Out of scope (do NOT touch)

- Strategia/offer/metriche (gia' deciso da growth).
- Copy italiano dei filtri/CTA/meta/schema (-> seo-strategist).
- Implementazione codice (-> frontend-builder).
- Selezione/crop/alt foto effettivi (-> asset-curator); qui solo brief di cosa serve.

## Next hand-off

- Next agent: travellini-seo-conversion-strategist (in serie) + travellini-asset-curator (parallelo)
- Trigger: direzione UX approvata dall'owner.
