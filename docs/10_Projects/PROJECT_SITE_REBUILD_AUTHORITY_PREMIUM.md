---
type: project
area: product
status: open
priority: p0
owner: team
repo: TRAVELLINIWITHUS
route: site-wide
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: Apr 2026 rebuild mandate
tags:
  - project
  - rebuild
  - product
  - premium
---

# PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM

## Obiettivo

Ricostruire Travelliniwithus come travel media brand editoriale premium, con authority prima della semplice presenza creator.

## Contesto

Il repo ha gia una base pubblicabile, ma la struttura del sito non e ancora abbastanza severa per sostenere un end-state best-in-class. Il rischio non e tecnico: e strategico e architetturale.

## Decisione guida

La direzione ufficiale del rebuild e:

- benchmark principale: Salt in Our Hair
- benchmark di tono: Along Dusty Roads
- priorita assoluta: authority editoriale
- approccio: rifondazione guidata, non replatform impulsivo

## Deliverable madre

- [[TRAVELLINIWITHUS_MASTER_PLAN]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[87_References/COMPETITIVE_ANALYSIS_TRAVEL_INFLUENCER_SITES]]

## Scope

- information architecture
- route system
- page system
- content model
- design discipline
- B2C/B2B funnel clarity
- SEO migration logic

## Non scope immediato

- cambio stack senza motivazione forte
- crescita indiscriminata del catalogo shop
- pubblicazione di superfici deboli solo per copertura

## Snapshot 2026-04-23

- creati i documenti madre `MASTER_PLAN` e `EXECUTION_PLAN`
- formalizzato il rebuild come progetto a priorita `p0`
- definito il criterio: semplificare, unificare, alzare il livello medio, eliminare il debole

## Phase 0 completata

- completato audit architettura attuale e inventario route in [[87_References/CURRENT_STATE_AUDIT_SITE_ARCHITECTURE_2026-04-23]]
- confermata la tesi centrale: il problema principale e semantico/architetturale, non di stack
- confermato che il primo vero blocco implementativo deve essere la nuova IA, non il restyle diffuso

## Phase 1 bloccata

- definita la IA target in [[87_References/TARGET_INFORMATION_ARCHITECTURE_2026-04-23]]
- bloccata la decisione: `Esplora / Guide / Pianifica / Collaborazioni / Chi siamo`
- bloccata la migrazione dei country hubs dentro `destinazioni`
- bloccato il superamento del path universale `/articolo/:slug`

## Phase 1 - primo step implementato

- aggiunta route target `destinazioni/:country`
- aggiunti redirect legacy da `/italia`, `/grecia`, `/portogallo`
- aggiornati i link principali che puntavano agli hub top-level storici

## Phase 1 - secondo step implementato

- introdotte le route pubbliche typed `guide/:slug` e `itinerari/:slug`
- mantenuto il path legacy `/articolo/:slug` solo come redirect resolver verso la nuova route pubblica corretta
- riallineati search, related articles, liste editoriali, preferiti e fallback demo al nuovo criterio di URL
- rimosso l'uso runtime del path universale legacy dalle superfici pubbliche principali

## Phase 1 - terzo step implementato

- separati davvero gli archive pubblici `guide` e `itinerari`, con pagine distinte e SEO distinto
- introdotto un archive condiviso come base unica, per evitare duplicazioni strutturali fra le due superfici
- portata la distinzione anche su query param categoria, browser categorie, CTA di rientro dagli articoli e navigazione principale
- riallineati home discovery, footer, search modal e `inizia-da-qui` alla nuova semantica editoriale

## Phase 1 - quarto step implementato

- riallineate le superfici secondarie `dove-dormire` e `cosa-mangiare` come sottosezioni reali del layer `guide`
- introdotto un nuovo cross-link `to-itinerari` per evitare CTA generiche o semantica ambigua nei footer editoriali
- resa coerente la home editoriale: il blocco `LatestArticles` ora dichiara apertamente che mostra sia guide pratiche sia itinerari
- corrette alcune CTA trasversali (`FinalCtaSection`, `Risorse`) per non promettere "guide" dove il sistema ora e piu articolato

## Phase 1 - quinto step implementato

- ripulite le superfici discovery residue `Preferiti` e `NotFound`, che ora parlano la lingua reale del nuovo sistema editoriale
- riallineati i copy della newsletter per distinguere meglio tra guide pratiche, itinerari e contenuti generali del sito
- aggiornata la ricerca globale e la search entry compatta con placeholder, chip e titoli coerenti con il nuovo modello
- eliminati piccoli residui di semantica `guide = tutto` nei punti di rientro e ritrovamento contenuti

## Phase 1 - sesto step implementato

- riallineato il layer CMS `siteContent` con una label dedicata per `itinerari`, cosi navigazione e footer non dipendono piu da copy hardcoded fuori modello
- ripulito l'admin editoriale: dashboard ed editor ora parlano di `contenuti editoriali`, distinguono meglio tra formato del pezzo e sezione pubblica, e mostrano path coerenti con la nuova IA
- corretta l'anteprima SEO admin, che non usa piu il vecchio path `/articolo/:slug` ne il dominio legacy errato
- sistemati alcuni copy pubblici ancora ambigui (`home`, `inizia-da-qui`, CTA editoriali) per evitare ricadute nel linguaggio del vecchio sistema

## Stato attuale della discovery trasversale

- chi arriva da ricerca, 404 o preferiti non rientra piu in un sistema semantico ambiguo
- la newsletter promette contenuti veri del prodotto attuale, non una vecchia struttura editoriale ormai superata
- il percorso di ritrovamento contenuti e piu coerente: destinazioni, esperienze, guide pratiche e itinerari hanno ora nomi leggibili anche fuori dagli archive principali

## Stato attuale del CMS e dell'admin editoriale

- il lessico operativo non spinge piu l'owner a trattare tutto come `articolo`: il sito pubblico resta separato in `guide` e `itinerari`, mentre l'admin chiarisce che il tipo `pillar` riguarda il formato, non la route
- i path mostrati nell'admin sono ora quelli pubblici reali, quindi il controllo editoriale e piu affidabile
- l'anteprima SEO torna a essere utile per il rebuild, perche riflette dominio e URL finali del prodotto attuale

## Stato attuale delle superfici secondarie

- `dove-dormire` non e piu una pagina isolata: rimanda al filtro hotel del layer guide, agli itinerari e agli hub destinazione
- `cosa-mangiare` e ora leggibile come verticale `food guide`, con collegamenti espliciti a `guide`, `esperienze food` e `risorse`
- i widget cross-link iniziano a distinguere davvero tra layer pratico e layer itinerari
- la homepage non usa piu una CTA fuorviante che chiama "guide" un blocco editoriale misto

## Stato attuale degli archive editoriali

- `guide` ora raccoglie solo contenuti pratici di supporto: pianificazione, budget, packing, food, hotel, consigli
- `itinerari` raccoglie solo viaggi completi e `weekend/day trip`
- il sito ha ora una distinzione leggibile tra archivio pratico e archivio di piani viaggio
- la logica di separazione e centralizzata, quindi nuovi contenuti pubblici seguono la stessa regola anche su card, ricerca e link interni

## Stato attuale della migrazione editoriale

- il sistema pubblico ha ora una distinzione reale tra collezione editoriale e legacy compatibility
- i contenuti demo e preview rispettano la nuova semantica dei path
- il residuo `/articolo/:slug` esiste solo come compat layer intenzionale, non come modello pubblico da estendere

## Phase 2 - In corso (Content Model & Governance)

- [x] Estendere le validazioni CMS per differenziare rigorosamente i requisiti tra formati (es. `pillar` vs `guide`)
- [x] Rendere obbligatori i campi di trust (`disclosureType`, `verifiedAt`) per la pubblicazione finale
- [x] Allineare la validazione visuale in admin ai template pubblici

## Verifica 2026-04-23

- `npm run typecheck` superato
- `npm run build` superato
- nota emersa in build: warning CSS su utility CSS var placeholder risolto (refactoring `CartDrawer.tsx` su standard `accent`)

## Dipendenze

- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[MARKETING_OPERATIONS_HUB]]

## QA

- ogni modifica al rebuild deve riflettersi nei documenti madre
- i milestone di implementazione devono alimentare `PROJECT_RELEASE_READINESS`

## Link

- [[OBSIDIAN_DASHBOARD]]
- [[TRAVELLINIWITHUS_MASTER_PLAN]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
