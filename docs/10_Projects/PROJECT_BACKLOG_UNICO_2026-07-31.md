---
type: project
area: delivery
status: in-progress
priority: p0
owner: Skott
repo: TRAVELLINIWITHUS
created: 2026-07-31
source: consolidamento di 33 project doc aperti + 11 bug, verificati sul codice
related:
  - '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
  - '[[MARKETING_OPERATIONS_HUB]]'
tags:
  - project
  - delivery
  - backlog
---

# BACKLOG UNICO — 2026-07-31

**Questa nota sostituisce ogni altra lista "cosa fare".** Se un piano non è
citato qui, o è chiuso o è in icebox: vedi §4 e §5.

Per lo _stato_ — cosa esiste e in che condizione — vedi [[STATO_DEL_SITO]], che
si rigenera da `npm run stato`. Questa nota dice cosa fare, quella dice cosa c'è.

## 0. Metodo — perché questa lista è diversa dalle precedenti

Le liste precedenti si citavano a vicenda senza mai essere ricontrollate sul
codice. Ogni voce qui sotto è stata **verificata sul repo il 2026-07-31**, non
ereditata da un doc. Il risultato: **9 voci su 20 erano già fatte** e tenevano
aperto il backlog per niente.

Regola d'ora in poi: una voce si chiude quando il codice lo dimostra, non
quando un doc lo dice.

## 1. La catena critica

Quasi tutto il backlog dipende da una sola cosa:

```
6 articoli seed con published: false
   └─> regime noindex su /esplora e discovery
        └─> sitemap incoerente (80 URL dichiarati, contenuto in demo)
             └─> zero SEO organico
                  └─> niente traffico da qualificare
                       └─> affiliate, shop e pipeline partner senza volume
```

**Finché i 6 articoli restano `published: false`, il 70% del backlog marketing
non è bloccato da lavoro tecnico: è bloccato da quella riga.** È il motivo per
cui quattro home rifatte in due mesi non hanno mosso niente — si è ridisegnata
la vetrina di un negozio vuoto.

## 2. Lista prioritizzata

Effort: **S** < 2h · **M** 2-6h · **L** > 6h. `[OWNER]` = non lo posso fare io.

### P0 — sbloccano la catena critica

| #   | Voce                                                                                                                                                                                                        | Effort | Impatto                                              | Chi                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------- | ------------------- |
| 1   | **Pubblicare i 6 articoli seed**: togliere `published: false`, verificare uscita da noindex. Corpo e excerpt sono già scritti in 5 casi su 6 — manca solo l'excerpt di `burton-juice-ristorante-tim-burton` | S      | Sblocca l'intera catena §1. Massimo ROI del repo     | seo-strategist      |
| 2   | **Far atterrare il WIP e deployare le functions**: 21 file non committati contengono il backend `/api/**` (`functions/` + rewrite in `firebase.json`) mai deployato                                         | M      | Chiude il p0 "8 endpoint senza backend in prod"      | backend-engineer    |
| 3   | **`/posto/:slug` → 200**: verificato oggi, risponde ancora **404**. La fix (`scripts/generate-route-html.js` che genera `dist/posto/<id>/index.html`) è nel WIP non committato                              | S      | 40 posti già linkati in home sono soft-404 per i bot | backend-engineer    |
| 4   | **[OWNER] Restrizione Firebase Web API key su dominio**                                                                                                                                                     | S      | È dichiarato blocker deploy in 2 doc dal 14/05       | Skott (console GCP) |

### P1 — direzione e fiducia

| #   | Voce                                                                                                                                                              | Effort    | Impatto                                 | Chi                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------- | --------------------- |
| 5   | **[OWNER] 4 decisioni sulla spec home**: la spec `PROJECT_HOME_RICOMPOSIZIONE` è ferma dal 26/07 in attesa di 4 ok. Senza, la home resta muta per 3 pubblici      | S         | Sblocca la quinta home — e la ferma qui | Skott                 |
| 6   | **Foto reali R+B**: le foto "coppia" nel repo sono generate, in violazione della regola imagery-truth. Nel codice i `TODO R+B` non ci sono più: mancano gli asset | S + asset | Trust del posizionamento people-led     | Skott + R+B           |
| 7   | **Test end-to-end pipeline email**: `RESEND_API_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID` sono in `.env` locale. Da verificare nell'env delle functions in prod      | S         | Oggi ogni lead catturato è silenzioso   | backend-engineer      |
| 8   | **Reel reale in `FEATURED_REEL`** + cover dal brand al posto dello stock                                                                                          | S         | Trust in home, bounce rate              | Skott + asset-curator |

### P2 — conversione

| #   | Voce                                                    | Effort | Impatto     |
| --- | ------------------------------------------------------- | ------ | ----------- |
| 9   | Lead magnet PDF come offerta nell'`ExitIntentPopup`     | S      | lead B2C    |
| 10  | Screenshot del media kit nella pagina `/media-kit`      | S      | lead B2B    |
| 11  | Campi "budget" e "periodo" nel form media kit           | S      | qualifica   |
| 12  | Compilare il PDF "10 posti italiani" con luoghi reali   | L      | lead magnet |
| 13  | Shortlist 5 partner con nomi reali + prime 2-3 proposte | M      | pipeline    |

### P3 — igiene

| #   | Voce                                                                                | Effort |
| --- | ----------------------------------------------------------------------------------- | ------ |
| 14  | 10 PR aperte, 8 dependabot, due ferme da aprile: mergiare o chiudere in blocco      | S      |
| 15  | Schema `Place`/`Person`, `llms-full.txt`, allowlist bot AI in `robots.txt`          | M      |
| 16  | Migrare `/risorse` e articoli a `buildAffiliateLink` (gli ID affiliate ci sono già) | M      |

## 3. Sequenza consigliata

1. **#2 + #3 insieme** — stesso branch, stesso deploy. Il WIP è fermo da 5 giorni e blocca tutto il resto.
2. **#1** — è la voce con più leva del repo.
3. **#4 + #5** in parallelo: sono tue, non mie, e #5 tiene ferma la home.
4. Poi P1 residuo, poi P2.

Non toccare P2/P3 prima che #1 e #2 siano in produzione: sono ottimizzazioni di
un funnel che oggi non ha ingresso.

## 4. Chiuse — verificate fatte, il doc era vecchio

Nessuna di queste richiede lavoro. I doc corrispondenti vanno messi a `done`.

| Voce dichiarata aperta                    | Verifica sul codice (2026-07-31)                                   |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Firestore: creazione ordini pubblica      | `firestore.rules:270` → `allow create: if false`                   |
| Firestore: coupon leggibili pubblicamente | `firestore.rules:279` → `allow read: if isAdmin()`                 |
| Firestore: `resources` senza regola       | `firestore.rules:285-288` → regola presente, read solo published   |
| Stripe: webhook non idempotente           | `src/server/apiRoutes.ts:228` → `saveStripeOrder(order, event.id)` |
| Stripe: webhook dentro il rate limit      | `apiRoutes.ts:128` → esplicitamente escluso                        |
| QA: test suite stale e flaky              | 30 file, 146 test, **tutti verdi in 5,8 s**                        |
| LCP: catena Google Fonts su H1 Fraunces   | Nessun `googleapis`/`gstatic` in `index.html` né `src/index.css`   |
| Homepage: placeholder `TODO R+B`          | Zero occorrenze di `TODO R+B` in `src/`                            |
| 4 signup affiliate da completare          | `VITE_AFFILIATE_{BOOKING,SKYSCANNER,AIRALO,REVOLUT}_ID` in `.env`  |

## 5. Piani superati

Restano leggibili, ma non sono più "cosa fare". Marcati `status: archived` —
l'unico stato di chiusura ammesso dalla tassonomia del vault per i `project` —
con banner in testa e il motivo reale nel frontmatter: `superseded_by:` per i
piani assorbiti, `icebox_reason:` per quelli congelati.

- **Home** — `CINEMATIC_REBUILD_HOME_2026`, `ATLANTE_VIVO_HOME_2026-07-04`,
  `HOME_HERO_NAV_REFINEMENT`, `ATLANTE_MERAVIGLIE_VERE`, `REDESIGN_DIREZIONE_2026-07-22`
  → assorbiti da `PROJECT_HOME_RICOMPOSIZIONE_2026-07-26`, che è l'unico con la
  diagnosi giusta (la home non legge `useAudience()`).
- **Audit di sito** — `ADVANCED_FULL_SITE_AUDIT_2026_05_15`,
  `ULTRACODE_FULL_SITE_AUDIT_2026-06-18`, `VISUAL_COPY_CONTENT_AUDIT`,
  `AUDIT_V1_VS_V2_2026-06-27`, `SITE_V2_ADVANCED_IMPROVEMENT_PLAN`,
  `PUBLIC_FOOTPRINT_ULTRA_IMPROVEMENT_PLAN_2026-06-07`,
  `FULL_SITE_MARKETING_TECH_AUDIT`, `30DAY_BACKLOG` → confluiti in §2 e §4.
- **Tooling** — `V2_TOOLING_DECISION_MATRIX` (duplicato di quello del 28/06),
  `AI_STACK_SYNC_AUDIT_2026_05_12`, `AGENT_STACK_AGENCY_AGENTS_REVIEW`,
  `CLI_TOOLING_INTEGRATION` → decisioni già riflesse in `CLAUDE.md` §Config truth.
- **Roadmap lunga** — `MARATHON_FULL_90_DAYS`, `ELEVATION_BRAINSTORM_2026-07-04`,
  `ELEVAZIONE_TOTALE_2026-07`, `MODERNIZATION_PLAN`, `SITE_BLUEPRINT_2026`
  → **icebox, non superati**: contengono feature reali mai decise (quiz
  archetipi, pagina club, companion AI, guide audio, itinerary builder). Vanno
  ripescati _dopo_ che il funnel ha un ingresso, non prima.

## 6. Cosa resta canonico

| Nota                                                           | Ruolo                              |
| -------------------------------------------------------------- | ---------------------------------- |
| **questa**                                                     | cosa fare adesso                   |
| `PROJECT_HOME_RICOMPOSIZIONE_2026-07-26`                       | spec home, in attesa di 4 ok owner |
| `PROJECT_RELEASE_READINESS`                                    | log dei gate, storico              |
| `PROJECT_FIREBASE_HARDENING`                                   | checklist sicurezza a 5 fasi       |
| `PROJECT_ESPLORA_CONSOLIDATION`                                | spec di `/esplora`                 |
| `PROJECT_FAMILY_AREA_2026-07-24`                               | spec area famiglia                 |
| `PROJECT_EDITORIAL_SYSTEM_V1_1`                                | primitive editoriali               |
| `MAP_CUSTOM_STYLE_INSTRUCTIONS`, `RUNBOOK_INSTAGRAM_GRAPH_API` | runbook operativi                  |
