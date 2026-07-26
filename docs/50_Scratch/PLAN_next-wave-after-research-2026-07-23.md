---
type: plan
area: delivery
status: active
priority: p0
owner: team
created: 2026-07-23
related: '[[BRAND_KNOWLEDGE_MOC]] · [[10_Projects/PROJECT_RELEASE_READINESS]] · [[VAULT_AND_GRAPHIFY_OPERATING_STATE]]'
tags:
  - plan
  - next-wave
  - release
---

# PLAN — Next wave dopo ricerca + vault (2026-07-23)

## Richiesta (1 frase)

Dopo iperanalisi sito, presence social, Family, Obsidian/Graphify e pulizia plugin: **cosa fare adesso** per avvicinare un sito presentabile e coerente, senza ricostruire da zero.

## Cosa è già chiuso (non rifare)

- Iperanalisi codice/architettura (sessione)
- Dossier presence Part I–III + Family ufficializzato + decision boundary
- Vault MOC brand, hub allineati, audit:obsidian PASS
- Graphify index refresh
- Plugin stack ridotto (no Kanban/Excalidraw)
- Conoscenza gap: holding live, truth copy, CartDrawer, perf home, secret history owner

## Sequenza consigliata (custom, non S1–S9 pieno)

### Wave A — Truth & coerenza pubblica (Effort S, 1 sessione Build)

**Obiettivo:** un solo racconto pubblico, zero contraddizioni AI/llms/UI.

| #   | Task                                                                                 | Dominio      | File tipici                               |
| --- | ------------------------------------------------------------------------------------ | ------------ | ----------------------------------------- |
| A1  | Timeline unica (anni 5 vs 8 vs 2017/2018)                                            | owner + copy | `ChiSiamo.tsx`, `i18n/it.json`, `site.ts` |
| A2  | Nazionalità Rodrigo (cubano vs llms italiano)                                        | owner        | `llms.txt`, `llms-full.txt`, Brand Memory |
| A3  | Bio hub path unico (`/vieni-con-noi` vs `/guida-in-regalo`)                          | frontend     | `site.ts` BIO_LINKS, App routes, docs     |
| A4  | Rewrite `public/llms.txt` + `llms-full.txt` (Family sub-brand, metriche 172K datate) | seo/ai       | public/llms\*                             |
| A5  | Posts 1.268 vs 1.272 + `BRAND_STATS_SOURCE.observedAt`                               | config       | `site.ts`, snapshot                       |

**Gate:** typecheck; nessun claim non verificato; Family non sommata.

**Blocca senza owner:** A1, A2 (altrimenti fix solo path/metriche “sicure”).

### Wave B — Integrity home & UX (Effort S–M, 1 sessione Build)

| #   | Task                                           | Perché |
| --- | ---------------------------------------------- | ------ |
| B1  | Rimuovere nested `<main>` in CinematicHomepage | a11y   |
| B2  | Hero `responsiveWidths` + lazy featured images | LCP    |
| B3  | Defer/lazy weekend + reels sotto fold          | TBT    |
| B4  | Map spin rispetta reduced-motion               | a11y   |
| B5  | Reel cards keyboard + aria lightbox            | a11y   |
| B6  | Footer `#newsletter` o rimuovi handler su home | UX     |

**Gate:** typecheck + smoke home 375/1440.

### Wave C — Commerce honesty (Effort S)

| #   | Task                                                                      |
| --- | ------------------------------------------------------------------------- |
| C1  | Montare CartDrawer **oppure** nascondere add-to-cart finché shop soon     |
| C2  | Nav: non promuovere shop/itinerari come live se surfaces say soon/preview |

### Wave D — Owned content seed (Effort M, multi-agent se espanso)

| #   | Task                                                                            |
| --- | ------------------------------------------------------------------------------- |
| D1  | 6 schede prioritari: Burton, KL, Bled, Caraibi IT, Madrid ritual, sushi Romagna |
| D2  | Lead magnet 10 luoghi — input R+B                                               |
| D3  | Bio IG → hub sito (owner)                                                       |

### Wave E — Release path (Effort M, owner-heavy)

| #   | Task                                                     |
| --- | -------------------------------------------------------- |
| E1  | Decisione Hosting-only vs Node API                       |
| E2  | Owner GCP key rotate/restrict                            |
| E3  | predeploy + CWV home                                     |
| E4  | Sostituire holding “SITO IN COSTRUZIONE” con build reale |

## Decisioni da bloccare PRIMA di Build ampio

1. **Timeline pubblica** (quanti anni / anno nascita brand)
2. **Origine Rodrigo** in copy pubblico (sì Cuba / no / silenzio)
3. **Bio hub slug** definitivo
4. **Shop:** montare carrello o spegnere CTA
5. **Deploy topology:** static Hosting vs Node
6. **Quando** bio IG lascia Linktree

## Cosa NON fare adesso

- Nuova iperanalisi generica
- Redesign Awwwards / riattivare lab 3D home
- Installare altri plugin Obsidian
- Sommare audience Family+Travel
- Deploy prod senza E1–E2

## Effort totale stimato

| Wave | Effort | Dipende da               |
| ---- | ------ | ------------------------ |
| A    | S      | owner A1–A2 parziale     |
| B    | S–M    | solo Build               |
| C    | S      | decisione shop           |
| D    | M      | contenuti R+B            |
| E    | M      | owner security + hosting |

**Raccomandazione ordine:** A (truth) → B (home) → C (shop honesty) → D (content) → E (release).

## Stato Wave D (proceduto 2026-07-23)

- placeCatalog aggiornato con le 6 entità prioritarie.
- Seed files creati per: malesia-batu-caves, slovenia-bled-glamping, caraibi-italia-jesolo, madrid-malocchio, romagna-sushi-kibo.
- Burton seed già esistente e avanzato.
- reels.ts collegati con postoId dove possibile.
- Burton rimane il più maturo (ha articolo dettagliato in docs).

Prossimo: integrare nei componenti home/explora, foto reali, review complete con R+B.

## Prima azione (dopo conferma utente)

Modalità **Build**, scope Wave A **senza indovinare** A1/A2:

1. Chiedere all’utente le 2 decisioni timeline + nazionalità (o “lascia silenzio”)
2. Eseguire A3–A5 + rewrite llms coerente con Family decision
3. Poi Wave B in stessa o prossima sessione

## Handoff briefs

Nessun handoff multi-agent finché Wave A–B restano single-thread Build.  
Se parte Wave D (6 schede): allora S1 ridotto growth→seo→editorial→frontend.

## Stato git

Branch WIP ahead; molti file dirty (docs + public + src). Prima di Wave A grande: commit o stash slice “vault/research” separato da “code truth”.
