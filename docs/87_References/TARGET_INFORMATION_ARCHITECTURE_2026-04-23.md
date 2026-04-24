---
type: reference
area: product
status: active
date: 2026-04-23
source: phase-1 rebuild
tags:
  - information-architecture
  - routing
  - rebuild
  - product
---

# Target Information Architecture — 23 Aprile 2026

## Decisione centrale

La nuova IA di Travelliniwithus deve essere costruita attorno a tre job-to-be-done:

1. **Esplora** — scegliere dove andare
2. **Pianifica** — capire come viverlo bene
3. **Collabora** — capire come lavoriamo con brand e destinazioni

Questa non e una preferenza di menu. E la struttura portante dell'intero prodotto.

## Top navigation target

### Voci principali

- `Esplora`
- `Guide`
- `Pianifica`
- `Collaborazioni`
- `Chi siamo`

### Regole

- `Shop` resta fuori dalla nav principale finche non raggiunge maturita reale
- `Esperienze` non e una macro-nav primaria: vive dentro `Esplora`
- `Contatti` resta utility secondaria
- `Media Kit` resta figlia di `Collaborazioni`

## Route map target

### Core public routes

| Route target                           | Ruolo                                                 |
| -------------------------------------- | ----------------------------------------------------- |
| `/`                                    | homepage sistema                                      |
| `/destinazioni`                        | archive discovery per luogo                           |
| `/destinazioni/[paese]`                | country hub                                           |
| `/destinazioni/[paese]/[luogo-o-area]` | hub secondario o landing locale                       |
| `/esperienze`                          | archive discovery per intent, subordinato a `Esplora` |
| `/guide`                               | archive editoriale pratico                            |
| `/guide/[slug]`                        | guide e pillar guides                                 |
| `/itinerari`                           | archive itinerari                                     |
| `/itinerari/[slug]`                    | itinerary pages                                       |
| `/inizia-da-qui`                       | porta d'ingresso planning                             |
| `/dove-dormire`                        | vertical hotel / lodging collection                   |
| `/dove-dormire/[slug]`                 | collection o guide lodging per destinazione           |
| `/risorse`                             | toolkit di viaggio                                    |
| `/collaborazioni`                      | pagina business                                       |
| `/media-kit`                           | conversione business qualificata                      |
| `/chi-siamo`                           | metodo, coppia, trust                                 |
| `/contatti`                            | utility contact                                       |
| `/shop`                                | boutique prodotti digitali                            |
| `/shop/[slug]`                         | product page                                          |

## Struttura per sistema

### 1. Esplora

Comprende:

- `/destinazioni`
- `/destinazioni/[paese]`
- `/destinazioni/[paese]/[luogo-o-area]`
- `/esperienze`

Regola:

- qui si decide **dove** e **che tipo di viaggio** fare
- nessun contenuto di puro planning deve sovrascrivere questo asse

### 2. Guide

Comprende:

- `/guide`
- `/guide/[slug]`
- `/itinerari`
- `/itinerari/[slug]`

Regola:

- qui si approfondisce una scelta gia presa o quasi presa
- `cosa mangiare` non resta route madre autonoma: diventa contenuto o categoria dentro il sistema guide

### 3. Pianifica

Comprende:

- `/inizia-da-qui`
- `/dove-dormire`
- `/dove-dormire/[slug]`
- `/risorse`

Regola:

- qui si organizza meglio il viaggio
- `Inizia da qui` e il ponte tra scoperta e pianificazione
- `Risorse` e utility selettiva, non pagina ibrida discovery/editoriale

### 4. Collaborazioni

Comprende:

- `/collaborazioni`
- `/media-kit`
- `/contatti`

Regola:

- funnel separato, premium, con tono coerente ma non invadente rispetto al lato consumer

## Route da migrare

| Route attuale     | Route target                                                     | Azione                   |
| ----------------- | ---------------------------------------------------------------- | ------------------------ |
| `/italia`         | `/destinazioni/italia`                                           | redirect                 |
| `/grecia`         | `/destinazioni/grecia`                                           | redirect                 |
| `/portogallo`     | `/destinazioni/portogallo`                                       | redirect                 |
| `/articolo/:slug` | typed route finale                                               | redirect tramite mapping |
| `/cosa-mangiare`  | categoria guida o eventuale `/guide/cosa-mangiare/[slug]` futuro | declassare / migrare     |

## Regole redirect

### Principi

1. nessuna route attuale importante deve andare persa
2. ogni redirect deve puntare alla pagina semanticamente piu vicina
3. il redirect da `/articolo/:slug` non puo restare generico: serve tabella slug → content type

### Redirect prioritari

- country hubs top-level → gerarchia `destinazioni`
- `articolo/:slug` → `guide/[slug]` o `itinerari/[slug]` o `destinazioni/...`
- eventuale `cosa-mangiare` → guide category page o singole guide food

## Page responsibilities finali

### Homepage

- chiarisce il brand
- orienta tra esplorazione, guide e planning
- mostra il metodo
- apre il B2B senza cambiare tono

### Destinazioni archive

- archive per geografia
- filtro e scansione
- accesso ai country hub

### Country hub

- pagina madre editoriale per paese
- mix tra sub-destinations, guide, hotel e consigli chiave

### Esperienze archive

- archive per intent e stile di viaggio
- non sostituisce destinazioni e non sostituisce guide

### Guide archive

- biblioteca pratica
- cluster editoriali piu maturi

### Itinerari archive

- giornate e sequenze
- travel planning ad alta intenzione

### Inizia da qui

- onboarding utility
- pagina ponte per chi arriva per la prima volta

### Dove dormire

- vertical forte e monetizzabile
- compatibile con future pagine locali

### Risorse

- toolkit e affiliate con filtro editoriale
- niente overlap con `Inizia da qui`

## Decisioni bloccate

1. i country hubs non restano top-level
2. `/articolo/:slug` non e il modello finale
3. `Cosa mangiare` non resta asse primario della IA
4. `Esperienze` resta route viva, ma non nav primaria
5. `Pianifica` diventa il cluster che ordina `Inizia da qui`, `Dove dormire`, `Risorse`

## Prossimo step operativo

Dopo questa nota, il prossimo lavoro sul codice deve essere:

1. definire il mapping slug → content type
2. introdurre le nuove route target
3. migrare i country hubs sotto `destinazioni`
4. iniziare a smontare la dipendenza dal path universale `/articolo/:slug`

## Link

- [[87_References/CURRENT_STATE_AUDIT_SITE_ARCHITECTURE_2026-04-23]]
- [[TRAVELLINIWITHUS_MASTER_PLAN]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
