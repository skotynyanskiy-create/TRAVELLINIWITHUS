---
type: reference
area: product
status: active
date: 2026-04-23
source: repo audit
tags:
  - audit
  - architecture
  - routing
  - rebuild
---

# Current State Audit — Site Architecture (23 Aprile 2026)

## Scopo

Prima fotografia operativa del sito attuale per la **Phase 0** del rebuild authority-premium.

Sorgenti verificate:

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/config/contentTaxonomy.ts`
- `src/pages/*.tsx`

## Verdetto rapido

La base pubblica e gia piu evoluta di una semplice V1 creator, ma oggi il sistema soffre soprattutto in tre punti:

1. **route top-level troppo eterogenee**
2. **confini non ancora duri tra discovery, planning e utility**
3. **alcune superfici hanno un buon concept ma non ancora un ruolo unico incontestabile**

Il problema principale non e la mancanza di pagine. E la **responsabilita semantica** delle pagine.

## Inventario route pubbliche attuali

| Route                                            | Pagina           | Ruolo attuale                                   | Verdetto                              |
| ------------------------------------------------ | ---------------- | ----------------------------------------------- | ------------------------------------- |
| `/`                                              | `Home`           | portale editoriale / discovery / trust / B2B    | `keep, da rifare come pagina-sistema` |
| `/destinazioni`                                  | `Destinazioni`   | archive per luogo con filtri multipli           | `keep, da razionalizzare`             |
| `/esperienze`                                    | `Esperienze`     | archive per intento/esperienza                  | `keep con confini piu netti`          |
| `/guide`                                         | `Guide`          | biblioteca pratica / categorie editoriali       | `keep, molto promettente`             |
| `/dove-dormire`                                  | `DoveDormire`    | collection page hotel curati                    | `keep, rafforzare`                    |
| `/italia`                                        | `DestinationHub` | country hub top-level                           | `replace in IA target`                |
| `/grecia`                                        | `DestinationHub` | country hub top-level                           | `replace in IA target`                |
| `/portogallo`                                    | `DestinationHub` | country hub top-level                           | `replace in IA target`                |
| `/inizia-da-qui`                                 | `IniziaDaQui`    | onboarding / metodo / percorso planning         | `merge nel planning system`           |
| `/cosa-mangiare`                                 | `CosaMangiare`   | food guide editoriale autonoma                  | `review: keep solo se scala bene`     |
| `/chi-siamo`                                     | `ChiSiamo`       | trust, metodo, coppia                           | `keep`                                |
| `/collaborazioni`                                | `Collaborazioni` | funnel B2B                                      | `keep`                                |
| `/media-kit`                                     | `MediaKit`       | conversione business qualificata                | `keep`                                |
| `/contatti`                                      | `Contatti`       | contatto generale                               | `keep, ma secondaria`                 |
| `/articolo/:slug`                                | `Articolo`       | contenitore universale per contenuti editoriali | `replace come schema URL finale`      |
| `/preferiti`                                     | `Preferiti`      | utility user-side                               | `demote`                              |
| `/risorse`                                       | `Risorse`        | toolkit/affiliate/planning                      | `merge nel planning system`           |
| `/shop`                                          | `Shop`           | boutique prodotti digitali                      | `keep, gated`                         |
| `/shop/:slug`                                    | `ProductPage`    | dettaglio prodotto                              | `keep, gated`                         |
| `/account/acquisti`                              | `MieiAcquisti`   | area post-acquisto                              | `keep, non core al rebuild IA`        |
| `/privacy`, `/cookie`, `/termini`, `/disclaimer` | legal            | compliance                                      | `keep`                                |

## Cluster semantici attuali

### 1. Discovery

Route coinvolte:

- `/`
- `/destinazioni`
- `/esperienze`
- `/italia`
- `/grecia`
- `/portogallo`

Verdetto:

- il cuore discovery esiste gia
- il problema e che convive con due livelli diversi di gerarchia:
  - archive top-level
  - country hubs top-level

Conseguenza:

- l'utente non capisce ancora se il sistema principale sia `destinazioni` o i paesi singoli

### 2. Planning

Route coinvolte:

- `/guide`
- `/dove-dormire`
- `/risorse`
- `/inizia-da-qui`
- `/cosa-mangiare`

Verdetto:

- qui c'e il maggior potenziale
- qui c'e anche il maggior rischio di sovrapposizione

Conseguenza:

- oggi il cluster planning e ricco, ma non ancora governato da una logica unica

### 3. Editorial core

Route coinvolte:

- `/articolo/:slug`
- `/guide`
- country hubs

Verdetto:

- il template articolo e una delle parti migliori del repo
- ma l'URL universale `/articolo/:slug` non e coerente con l'end-state di un media brand premium

### 4. B2B / commercial

Route coinvolte:

- `/collaborazioni`
- `/media-kit`
- `/contatti`
- `/shop`

Verdetto:

- funnel B2B sopra la media
- shop corretto come superficie secondaria
- contatti da trattare come utility, non come asse principale

## Incoerenze principali osservate

### 1. Country hubs fuori gerarchia

`/italia`, `/grecia`, `/portogallo` sono concettualmente giusti ma architetturalmente fuori asse rispetto a:

- `/destinazioni`
- mega-menu `Esplora`
- target IA del rebuild

Decisione:

- mantenerli come concetto
- spostarli sotto la gerarchia `destinazioni`

### 2. Planning troppo distribuito

`Guide`, `Risorse`, `Inizia da qui`, `Dove dormire`, `Cosa mangiare` oggi convivono senza una scala di importanza definitiva.

Decisione:

- `Guide` deve diventare l'asse editoriale pratico
- `Inizia da qui` deve diventare la porta d'ingresso al planning
- `Risorse` deve essere il toolkit, non la seconda homepage utility
- `Dove dormire` e un vertical forte
- `Cosa mangiare` va tenuto solo se raggiunge massa critica reale

### 3. URL editoriale troppo generico

`/articolo/:slug` funziona tecnicamente, ma:

- non distingue il tipo di contenuto
- non aiuta una IA di publication piu matura

Decisione:

- usare il template `Articolo` come base
- superare l'URL generico nella fase IA/SEO

### 4. Nav e footer anticipano piu ampiezza di quanta l'IA possa gia sostenere

La nav attuale e migliore di prima, ma ancora mescola:

- hub paese
- per luogo
- per esperienza
- guide
- planning

Decisione:

- nav da rifare solo dopo blocco route map finale

## Keep / Merge / Replace / Delete matrix

| Oggetto                | Azione            | Ragione                                                                       |
| ---------------------- | ----------------- | ----------------------------------------------------------------------------- |
| `Home`                 | Keep / Replace    | va tenuta come ruolo, rifatta come pagina-sistema                             |
| `Destinazioni`         | Keep / Refactor   | asse discovery principale per luogo                                           |
| `Esperienze`           | Keep / Narrow     | utile, ma da evitare overlap con guide e food/hotel                           |
| `Guide`                | Keep / Promote    | uno dei pilastri migliori da portare al centro                                |
| `DoveDormire`          | Keep / Promote    | vertical utile, monetizzabile e coerente                                      |
| Country hubs top-level | Replace           | concetto giusto, livello URL sbagliato                                        |
| `IniziaDaQui`          | Keep / Merge      | deve diventare la porta del planning, non una route isolata                   |
| `Risorse`              | Keep / Merge      | va tenuta come toolkit, ma dentro un sistema planning piu chiaro              |
| `CosaMangiare`         | Review / Demote   | buona idea, ma oggi ancora laterale rispetto alla colonna vertebrale del sito |
| `Articolo` template    | Keep / Promote    | base premium forte                                                            |
| `/articolo/:slug`      | Replace           | URL generico non adatto all'end-state                                         |
| `Collaborazioni`       | Keep              | gia forte                                                                     |
| `Media Kit`            | Keep              | gia forte                                                                     |
| `Contatti`             | Keep / Demote     | utility, non asse strategico                                                  |
| `Preferiti`            | Demote            | non core nel rebuild                                                          |
| `Shop`                 | Keep / Gate       | ha senso solo con catalogo reale forte                                        |
| `Account acquisti`     | Keep / Background | utile ma non strutturante per IA                                              |

## Ordine corretto dopo questo audit

### Da fare subito

1. bloccare route map target
2. decidere il destino definitivo di country hubs
3. definire il planning system ufficiale
4. decidere il destino di `Cosa mangiare`
5. aprire la mappa redirect tra architettura attuale e target

### Da NON fare ancora

1. restyle diffuso della homepage
2. rifinitura finale navbar/footer
3. espansione di nuove pagine
4. nuove tassonomie senza prima chiudere quelle correnti

## Conclusione operativa

La **Phase 0** conferma la tesi del `MASTER_PLAN`:

- il sito non va ricostruito da zero
- va **riordinato duramente**
- la leva decisiva e la **nuova IA**

Finche non chiudiamo:

- route map
- confini tra discovery e planning
- gerarchia degli hub paese

ogni miglioramento visivo rischia di restare cosmetico.

## Link

- [[TRAVELLINIWITHUS_MASTER_PLAN]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[10_Projects/PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM]]
