---
type: project
area: product
status: active
priority: p1
owner: codex
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: premium v1.1 implementation
tags:
  - project
  - product
  - content
  - release
---

# PROJECT_EDITORIAL_SYSTEM_V1_1

## Obiettivo

Rendere il sito piu coerente e professionale usando sezioni condivise invece di blocchi duplicati pagina per pagina.

## Decisioni

- Newsletter unica con varianti: `sand`, `white`, `editorial`, `article`, `business`, `compact`.
- CTA finali standardizzate per tre intenti: discovery, newsletter, business.
- Contenuti mancanti trattati come preview controllate: utili per visualizzare la versione finale, ma non proof reale.
- Nessuna nuova collection Firestore obbligatoria e nessuna nuova integrazione esterna.

## Stato 2026-04-14

- Creati `Newsletter`, `FinalCtaSection`, `DemoContentNotice`.
- `InlineNewsletterBanner` ora riusa il componente newsletter condiviso.
- `ArticleSidebar` usa newsletter compatta invece di un bottone custom verso fondo pagina.
- `Guide` e stata riscritta come biblioteca pratica con preview editoriali centralizzate.
- `Articolo` e stato alleggerito e trasformato in template piu leggibile: in breve, informazioni pratiche, itinerary, map, consigli, risorse, newsletter e related.
- `Risorse` e stata riposizionata come toolkit editoriale, non pagina coupon.
- `Shop` e stato riposizionato come boutique editoriale, con demo non acquistabile.

## Regole operative

- Se una sezione si ripete in piu pagine, va implementata come componente condiviso.
- Se manca contenuto reale, usare preview controllate con noindex o notice chiara.
- Nessun testimonial, case study, numero o partner va inventato.
- Ogni CTA deve portare a una route o a un flusso realmente esistente.

## Follow-up

- Sostituire preview con articoli/guide reali approvati.
- Allineare eventuali contenuti CMS a `src/config/previewContent.ts` solo se diventano pubblicabili.
- Verificare screenshot umani mobile/desktop per `/guide`, `/articolo/dolomiti-rifugi-design`, `/risorse`, `/shop`.
- Dopo contenuti reali, rivalutare indicizzazione shop e landing SEO future.
