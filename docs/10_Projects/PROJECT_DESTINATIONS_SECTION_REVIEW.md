---
type: project
area: product
status: closed
priority: p1
owner: team
repo: TRAVELLINIWITHUS
route: /destinazioni
repo_path: src/pages/Destinazioni.tsx
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: existing project work
tags:
  - project
  - product
  - content
---

# PROJECT_DESTINATIONS_SECTION_REVIEW

## Obiettivo

Mantenere ordinata e monitorata la sezione destinazioni senza perdere le modifiche gia sistemate.

## Contesto

La sezione destinazioni e gia stata toccata e non va sovrascritta accidentalmente durante i lavori sulla home o sul branding.

## Repo context

- route: `/destinazioni`
- repo_path: `src/pages/Destinazioni.tsx`

## Checklist

- [x] documentare lo stato attuale della sezione
- [x] annotare eventuali follow-up visuali o contenutistici
- [ ] collegare bug o tweak futuri a questa nota

## Snapshot 2026-04-14

- `/destinazioni` e stata riposizionata come archivio discovery autorevole: promessa piu chiara, filtri per luogo/esperienza/periodo/budget/durata, mappa e griglia collegate nello stesso flusso.
- Le card ora mostrano motivo editoriale, localita, esperienza primaria, periodo, budget e durata quando disponibili.
- I contenuti demo restano controllabili da admin, ma quando visibili sono trattati come preview temporanea e non come proof reale.
- Aggiunto JSON-LD `CollectionPage` + breadcrumb per la pagina.
- Follow-up V1: inserire contenuti reali sufficienti per sostituire ogni demo/fallback prima del deploy pubblico.

## Esperienze collegate

- `/esperienze` ora funziona come tassonomia editoriale per intenzione di viaggio: posti particolari, food, hotel, borghi, relax, weekend e day trip.
- Le categorie sono pensate come porte tematiche verso articoli e destinazioni, non come semplici filtri tecnici.
- Follow-up: valutare route future `/esperienze/:categorySlug` solo dopo avere contenuti reali minimi per ogni categoria prioritaria.

## Sessione Esplora P0 - 2026-05-15

- Ripulito il pannello mappa di `/destinazioni` da copy tecnico interno: la promessa pubblica ora spiega come usare mappa e filtri.
- `/destinazioni` e `/esperienze` passano `noindex` quando stanno mostrando seed/demo o quando non ci sono articoli reali.
- Titoli SEO resi piu descrittivi: destinazioni particolari, esperienze food/hotel/borghi/weekend.
- Newsletter di fondo pagina tracciata con source specifica per destinazioni ed esperienze.
- Filtri e card archivio emettono eventi analytics (`destination_filter_apply`, `experience_filter_apply`, `archive_card_click`).
- La mappa embed e' stata resa piu accessibile: paesi e marker sono attivabili da tastiera, con label e chiusura card nominata.
- `/guide?cat=` ora inizializza il filtro categoria, cosi le card discovery mantengono l'intento fino alla pagina di arrivo.

## Sessione Esplora 10/10 - 2026-05-15

- `/esplora` diventa il finder editoriale centrale: filtri per luogo, esperienza, periodo, budget e durata.
- `src/utils/discoveryQuery.ts` diventa il contratto condiviso per parsing, validazione e URL builder discovery.
- `/destinazioni` e `/esperienze` mantengono le viste specializzate, ma i filtri ora espongono stato `aria-pressed` e touch target minimo.
- Gli empty-state rimandano anche a `/esplora`, non solo al reset filtri.
- Newsletter source segmentata con intento attivo, cosi il funnel puo distinguere luogo/esperienza/periodo.
- La sitemap esclude gli hub discovery finche `PUBLISH_DISCOVERY_HUBS=true`, evitando mismatch tra sitemap e pagine `noindex` in preview.
- Blocco release: sostituire seed/preview con contenuti e foto reali R+B prima di considerare Esplora pubblicabile come 10/10.

## Chiusura — 2026-05-15

La pagina `/destinazioni` è stata assorbita in `/esplora` come parte del
consolidamento Esplora (vedi [[PROJECT_ESPLORA_CONSOLIDATION]]). La rotta
fa redirect `<Navigate to="/esplora" replace />` e i suoi filtri legacy
(`?group`, `?area`, `?type`) sono letti come alias di `?zone` e `?type`
canonical.

Tutti i lavori futuri sull'archivio destinazioni proseguono nel progetto
consolidamento.

## Link

- [[PROJECT_ESPLORA_CONSOLIDATION]]
- [[OBSIDIAN_DASHBOARD]]
- [[QUICK_START]]
