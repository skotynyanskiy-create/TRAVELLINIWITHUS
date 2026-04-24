---
type: project
area: product
status: open
priority: p0
owner: team
repo: TRAVELLINIWITHUS
route: site-wide
related: '[[TRAVELLINIWITHUS_MASTER_PLAN]]'
source: master rebuild mandate
tags:
  - project
  - execution
  - rebuild
  - premium
---

# TRAVELLINIWITHUS EXECUTION PLAN

## Objective

Tradurre il `MASTER_PLAN` in una sequenza di implementazione concreta, con dipendenze chiare, criteri di accettazione e una matrice severa di keep / merge / replace / delete.

## Phase 0 — Freeze e audit operativo

### Obiettivo

Congelare la logica del rebuild prima di introdurre altre superfici non governate.

### Deliverable

- inventory definitiva delle route pubbliche
- inventory dei template reali e dei pseudo-template
- scoring delle pagine principali
- lista debito asset e lista contenuti demo
- mappa tassonomie attuali contro tassonomie target

### Exit criteria

- nessuna ambiguita su quali superfici sopravvivono
- keep / merge / replace / delete approvata

## Phase 1 — Information architecture e route system

### Obiettivo

Bloccare la struttura informativa prima di rifinire il design.

### Lavoro

- definire la route map finale
- spostare i country hub sotto `destinazioni`
- decidere le canonical route per guide, itinerari, hotel e risorse
- declassare o accorpare le superfici ridondanti

### Decisioni operative

- `articolo/:slug` non e l'end-state ideale
- `destinazioni`, `guide`, `itinerari`, `dove-dormire`, `inizia-da-qui`, `risorse` devono avere confini espliciti
- niente nuove route finche non esiste il template target

### Exit criteria

- sitemap target definita
- redirect map bozza pronta
- nav finale approvata

## Phase 2 — Content model e governance editoriale

### Obiettivo

Trasformare il CMS da archivio flessibile a sistema editoriale governato.

### Lavoro

- introdurre i tipi contenuto target
- allineare i campi admin ai template pubblici
- rafforzare le validazioni publish
- definire i requisiti minimi per `pillar`, `guide`, `hotel`, `resource`
- introdurre criteri di readiness per asset, trust e disclosure

### Exit criteria

- ogni tipo contenuto ha schema, scopo e template associato
- nessun contenuto pubblicabile senza campi critici

## Phase 3 — Design system hardening

### Obiettivo

Passare da una direzione premium "promettente" a un sistema coerente e riusabile.

### Lavoro

- congelare palette, tipografia, card system, CTA system, spacing rhythm
- definire 4-6 blocchi editoriali core
- definire 3-4 blocchi planning core
- definire 2-3 blocchi B2B core
- ridurre varianti inutili

### Exit criteria

- homepage, hub, guide e B2B usano lo stesso linguaggio
- niente componenti premium solo in una pagina isolata

## Phase 4 — Page system rebuild

### Priorita

1. Homepage
2. Destination hub
3. Pillar guide
4. Standard guide / itinerary
5. Planning pages
6. Collaborazioni / Media Kit

### Regole

- si ricostruisce per template, non per pagina casuale
- ogni template va chiuso prima di passare al successivo
- niente pagine "speciali" che bypassano il sistema

## Phase 5 — Funnel, monetizzazione e commercial clarity

### Obiettivo

Lineare il percorso discovery → planning → trust → monetizzazione / lead.

### Lavoro

- ridurre CTA concorrenti
- chiarire il ruolo di newsletter
- integrare meglio affiliate bar, hotel modules e shop CTA
- mantenere `Collaborazioni` come funnel separato e premium
- mostrare shop solo quando il catalogo lo merita

### Exit criteria

- ogni pagina ha una CTA primaria unica
- il sito non sembra spingere troppe cose insieme

## Phase 6 — SEO migration e redirect strategy

### Obiettivo

Cambiare architettura senza perdere controllo.

### Lavoro

- definire canonical policy
- riscrivere sitemap strategy
- creare mapping old → new route
- separare pagine pillar, hub e archive
- verificare title/meta/schema per tipo contenuto

### Exit criteria

- redirect map pronta
- nessuna nuova route senza policy SEO

## Phase 7 — Asset, contenuto reale e launch hardening

### Obiettivo

Chiudere il gap tra struttura premium e percezione reale.

### Lavoro

- sostituzione prioritaria asset deboli
- selezione contenuti flagship
- QA visuale umana
- QA editoriale
- QA mobile e commercial

### Exit criteria

- il sito puo essere mostrato senza disclaimer impliciti
- le superfici chiave non sembrano in preview

## Keep / Merge / Replace / Delete

| Stato           | Oggetto                                                                  | Azione                                  |
| --------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| Keep            | `Collaborazioni`, `Media Kit`, base admin/CMS, template articolo premium | tenere e rafforzare                     |
| Keep            | newsletter condivisa, final CTA condivise, trust/disclosure layer        | tenere come pattern di sistema          |
| Merge           | `Risorse` + `Inizia da qui`                                              | trasformare in funnel planning coerente |
| Merge           | country hubs sparsi                                                      | portarli sotto `destinazioni`           |
| Replace         | homepage attuale                                                         | rifare attorno a IA definitiva          |
| Replace         | nav attuale                                                              | rifare dopo blocco route map            |
| Replace         | logica `articolo/:slug` come contenitore universale                      | migrare verso URL e template per tipo   |
| Delete / demote | superfici con massa critica insufficiente                                | togliere dal percorso principale        |
| Delete / demote | shop prominence senza catalogo forte                                     | nascondere o declassare                 |
| Delete / demote | blocchi percepiti come demo, social fillers, CTA duplicate               | rimuovere                               |

## Rischi principali

### 1. Rebuild senza gerarchia

Rischio: migliorare singole pagine ma mantenere il caos del sistema.

Contromisura: bloccare IA e page system prima del restyle diffuso.

### 2. Eccesso di ambizione sul perimetro

Rischio: provare a tenere tutte le superfici e abbassare la qualita media.

Contromisura: kill list obbligatoria e demotion delle aree immature.

### 3. Stack distraction

Rischio: spendere energia in migrazioni tecnologiche non necessarie.

Contromisura: replatform solo se emerge un limite concreto non risolvibile.

## Acceptance criteria

### IA

- ogni route ha uno scopo unico
- nessuna duplicazione semantica tra archive, hub e planning pages

### Contenuto

- ogni template ha campi minimi obbligatori
- nessun publish debole

### UX

- mobile-first
- zero overflow
- gerarchia leggibile
- massimo controllo su CTA, card e sezioni ripetute

### Commercial

- B2C, B2B, affiliate e shop non si disturbano
- `Collaborazioni` e `Media Kit` restano premium

### SEO

- sitemap chiara
- canonical coerenti
- redirect definiti

### Tech

- build e typecheck puliti
- complessita ridotta, non aumentata
- admin coerente col public model

## Recommended sequence for implementation

1. inventory + audit matrix
2. route map finale
3. content types + publish rules
4. design system freeze
5. homepage + nav
6. destination hubs
7. guide templates
8. planning system
9. B2B refinement
10. SEO migration + redirects
11. content fill + QA

## Links

- [[TRAVELLINIWITHUS_MASTER_PLAN]]
- [[10_Projects/PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
