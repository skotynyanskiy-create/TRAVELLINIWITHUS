---
type: project
area: product
status: active
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

## Link

- [[OBSIDIAN_DASHBOARD]]
- [[QUICK_START]]
