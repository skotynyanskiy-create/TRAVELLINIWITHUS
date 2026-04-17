---
type: reference
area: workspace
status: active
tags:
  - obsidian
  - taxonomy
  - workspace
---

# Obsidian Taxonomy

## Standard properties

Usa queste properties nelle note operative:

- `type`: vedi lista completa sotto
- `status`: vedi per tipo sotto
- `priority`: `p0`, `p1`, `p2`, `p3`
- `area`: `engineering`, `brand`, `operations`, `delivery`, `workspace`, `content`, `product`, `marketing`, `commercial`, `social`
- `owner`: persona responsabile (rodrigo | betta)
- `due`: data target
- `repo`: nome repo
- `repo_path`: file o cartella rilevante nel repo
- `route`: pagina o area del sito coinvolta
- `branch`: branch di lavoro
- `commit`: commit rilevante
- `blocked_by`: dipendenza esplicita
- `related`: nota madre o nota collegata principale
- `source`: documento o meeting sorgente

## Tipi e status per tipo

### Engineering / Operations
| type | status possibili |
|------|-----------------|
| `project` | open \| in-progress \| blocked \| done \| archived |
| `task` | open \| in-progress \| blocked \| done |
| `bug` | open \| in-progress \| blocked \| done |
| `decision` | active \| superseded \| archived |
| `meeting` | active \| archived |
| `daily` | active \| archived |
| `release` | draft \| published \| archived |
| `ui-change` | open \| in-progress \| done |
| `sop` | active \| archived |
| `hub` | active |
| `dashboard` | active |
| `reference` | active \| archived |
| `workflow` | active \| archived |

### Editoriale / Brand
| type | status possibili |
|------|-----------------|
| `article` | idea \| draft \| review \| published \| archived |
| `guide` | draft \| review \| published \| archived |
| `itinerary` | draft \| review \| published \| archived |
| `place` | visitato \| da-visitare \| archiviato |
| `seo-page` | da-ottimizzare \| in-corso \| ottimizzato |
| `keyword` | tracking \| opportunità \| archiviata |

### Commerciale / Marketing
| type | status possibili |
|------|-----------------|
| `campaign` | planned \| active \| paused \| done \| archived |
| `collaboration` | lead \| proposta \| negoziazione \| attiva \| conclusa \| rifiutata |
| `partner` | lead \| active \| paused \| done |
| `product` | idea \| in-sviluppo \| live \| archiviato |
| `content-brief` | open \| in-progress \| done |

### Social / References
| type | status possibili |
|------|-----------------|
| `social-post` | idea \| in-produzione \| review \| schedulato \| pubblicato |
| `design-reference` | active \| archived |
| `web-clip` | da-processare \| processato \| archiviato |

## Properties editoriali specifiche

Usa solo nelle note editoriali:

- `destination`: luogo/città/regione/paese
- `country`: paese
- `region`: regione geografica
- `pillar`: `destinazione` \| `stile-viaggio` \| `pratico` \| `ispirazione` \| `shop`
- `keyword_primaria`: keyword SEO principale
- `keyword_secondarie`: lista keyword correlate
- `published_at`: data pubblicazione (YYYY-MM-DD)
- `author`: rodrigo \| betta
- `season`: primavera \| estate \| autunno \| inverno \| tutto-lanno
- `budget`: low \| mid \| high
- `duration`: weekend \| 3-5gg \| 1-settimana \| 2-settimane
- `rating`: 1-5 (per luoghi)
- `price_range`: € \| €€ \| €€€ \| €€€€
- `affiliate_link`: URL affiliato
- `category`: sottotipo specifico per places, products, clips
- `score`: stima qualità SEO 1-10
- `last_audit`: ultima data audit SEO

## Properties commerciali specifiche

- `company`: nome azienda/brand
- `contact`: nome contatto
- `offer_type`: press-trip \| gifting \| paid \| affiliate \| content \| evento
- `fit_brand`: valutazione aderenza brand (testo libero)
- `deliverable`: lista deliverable
- `deadline`: data scadenza
- `related_campaign`: campagna collegata

## Social properties specifiche

- `channel`: instagram \| tiktok \| newsletter \| blog
- `format`: post \| reel \| stories \| carosello \| video
- `publish_date`: data/ora prevista pubblicazione
- `caption_ready`: true \| false

## Naming

### Engineering / Ops
- `PROJECT_<TOPIC>` — note progetto
- `TASK_<TOPIC>` — task atomici
- `BUG_<TOPIC>` — bug
- `UI_<TOPIC>` — modifiche visive
- `DECISION_<nnnn>_<TOPIC>` — decisioni (es. `DECISION_0001_VAULT_STRATEGY`)
- `MEETING_<yyyy-mm-dd>_<topic>` — meeting / handoff
- `RELEASE_<yyyy-mm-dd>_<topic>` — release note

### Editoriale
- `DEST_<NomeLuogo>` — destinazione (es. `DEST_Lisbona`)
- `ART_<slug-breve>` — articolo (es. `ART_weekend-barcellona`)
- `PLACE_<nome>` — luogo (es. `PLACE_Hotel_Neri_Barcelona`)
- `ITIN_<dest>_<durata>` — itinerario (es. `ITIN_Lisbona_3gg`)

### Commerciale
- `COLLAB_<brand>` — collaborazione
- `PROD_<nome>` — prodotto shop

### SEO e Social
- `SEO_<route-slug>` — pagina SEO (es. `SEO_guida-lisbona`)
- `KW_<cluster>` — keyword cluster
- `POST_<yyyymmdd>_<canale>` — social post

### References e clips
- `CLIP_<yyyy-mm-dd>_<titolo-breve>` — web clip
- `REF_<titolo-breve>` — design reference

### Regola generale
- MAIUSCOLO: hub, workflow, taxonomy, progetti, decisioni
- lowercase-trattini: contenuti editoriali, luoghi, itinerari, SEO

## Link policy

- Dentro Obsidian: sempre wikilink `[[NomeNota]]`
- Fuori Obsidian (repo, doc esterne): path assoluti
- Ogni nota con `route` punta a una pagina del sito
- Ogni nota con `repo_path` punta a un file del repo
- Note con `source` → nate da meeting, handoff o chat Claude

## Tag policy

Tag stabili e pochi:

- `obsidian` — meta-vault
- `engineering` — codice, bug, deploy
- `brand` — identità, visual, voice
- `content` — articoli, guide, itinerari
- `marketing` — campagne, SEO, social
- `commercial` — shop, collaborazioni, affiliati
- `workspace` — configurazione vault

## Schemi rapidi

### Articolo blog
```yaml
type: article
status: draft
priority: p2
area: content
pillar: destinazione
destination: Lisbona
keyword_primaria: cosa fare a lisbona
route: /blog/cosa-fare-lisbona
author: betta
```

### Guida destinazione
```yaml
type: guide
status: draft
area: content
destination: Lisbona
country: Portogallo
keyword_primaria: guida lisbona
route: /destinazioni/lisbona
```

### SEO page
```yaml
type: seo-page
status: da-ottimizzare
priority: p1
route: /destinazioni/lisbona
keyword_primaria: guida lisbona
score: 4
```

### Collaborazione
```yaml
type: collaboration
status: lead
company: NomeBrand
offer_type: press-trip
fit_brand: alta - travel lifestyle allineato
owner: rodrigo
```

### Bug
```yaml
type: bug
status: open
priority: p1
area: engineering
repo_path: src/components/home/HeroSection.tsx
```
