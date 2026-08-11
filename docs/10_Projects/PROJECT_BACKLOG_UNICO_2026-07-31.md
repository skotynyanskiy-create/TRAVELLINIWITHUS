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

| #   | Voce                                                                                                                                                                                     | Effort    | Impatto                                          | Chi                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------ | ------------------- |
| 1   | **Pubblicare `burton-juice`**: restano 2 blocker, entrambi tuoi — cover reale e verdetto R+B (`[SEZIONE RECENSIONE]` nel corpo). Excerpt, tag e percorso di pubblicazione sono pronti    | S + asset | Sblocca la catena §1. Massimo ROI del repo       | Skott + R+B         |
| 1b  | **Scrivere gli altri 5 articoli**, oggi abbozzi da 89-214 parole (vedi §7)                                                                                                              | L         | Volume editoriale                                | editorial-writer    |
| 2   | **[OWNER] Deploy delle functions**: il codice è pronto e con gate, mancano piano Blaze, 5 segreti in Secret Manager e i parametri `APP_URL`/`FIRESTORE_DATABASE_ID`/`BREVO_LIST_ID`     | M         | Chiude il p0 "8 endpoint senza backend in prod"  | Skott (console)     |
| 3   | ~~`/posto/:slug` → 404~~ — **chiusa**: `scripts/generate-route-html.js` è committato dal `000d847` e cablato in `npm run build`                                                         | —         | —                                                | —                   |
| 3b  | **[OWNER] Ripuntare il dominio**: `travelliniwithus.it` risponde da `aruba-proxy` con marker WordPress — non serve il progetto Firebase (verificato 2026-08-11 da `audit:api-live`)     | S         | Senza questo nessun deploy è osservabile         | Skott (DNS/hosting) |
| 4   | **[OWNER] Restrizione Firebase Web API key su dominio**                                                                                                                                  | S         | È dichiarato blocker deploy in 2 doc dal 14/05   | Skott (console GCP) |

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

Aggiornata il 2026-08-11: #3 è chiusa e il lavoro di codice di #1 e #2 è fatto.
Quello che resta in P0 è **quasi tutto tuo**, non mio.

1. **#3b + #4** — finché il dominio sta su Aruba e la API key è aperta, deployare
   non produce niente di osservabile. Sono il vero primo passo.
2. **#2** — Blaze + 5 segreti + 3 parametri, poi `firebase deploy --only functions:api,hosting`.
3. **#1** — cover reale e verdetto R+B. Lo script si rifiuta di pubblicare finché mancano.
4. **#5** in parallelo: tiene ferma la home.
5. Poi #1b, poi P1 residuo, poi P2.

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

## 7. Revisione 2026-08-11 — cosa diceva questa nota e cosa dice il codice

Sei affermazioni di §2 sono state ricontrollate sul repo. Quattro erano sbagliate.
Le correzioni sono già riportate sopra; qui resta la prova, perché è il motivo
per cui la regola «una voce si chiude quando il codice lo dimostra» esiste.

| Diceva                                                                 | Dice il codice                                                                                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| «corpo e excerpt già scritti in 5 casi su 6»                           | Invertito. Parole nel `content`: burton **1563**, malesia 214, slovenia 141, jesolo 116, madrid 96, romagna 89. Cinque su sei sono abbozzi |
| «manca solo l'excerpt di burton»                                       | L'excerpt mancava solo a burton, vero — ma è l'unico articolo con un corpo. Gli altri cinque hanno l'excerpt e non hanno l'articolo        |
| «togliere `published: false`» come lavoro da 2h                        | I seed non erano importati da nessun modulo runtime: il sito legge Firestore. Il flag da solo non produceva nessun effetto                 |
| «la fix di `/posto/:slug` è nel WIP non committato»                    | `scripts/generate-route-html.js` è committato dal `000d847` e cablato in `npm run build`                                                  |
| «21 file non committati»                                              | 78 al 2026-08-11                                                                                                                           |
| il dominio è un dettaglio di deploy                                    | `travelliniwithus.it` risponde da `aruba-proxy` con marker WordPress: non è il progetto Firebase                                          |

### Quattro difetti trovati durante la revisione, non presenti in nessuna nota

1. **La disclosure ADV non era scrivibile.** `partnership` è letto da
   `normalizeFirestoreArticle` e renderizzato da `ArticleHero`, ma non è fra i
   campi ammessi da `isValidArticle()` in `firestore.rules`, e `ArticleEditor`
   non lo invia. Nessuna scrittura client poteva pubblicare un articolo con la
   dicitura ADV — e `burton-juice` è `kind: 'adv'`. Risolto con
   `scripts/publish-article-seed.mjs`, che scrive via Admin SDK.
2. **La sitemap interrogava il database sbagliato.** `getFirestore()` senza id
   punta a `(default)`; il database reale è quello nominato in `firebase.json`.
   Zero URL `/articolo` anche dopo aver pubblicato, in silenzio.
3. **`BREVO_LIST_ID` non era dichiarato** fra i parametri della Cloud Function:
   la newsletter sarebbe degradata a save-lead-only senza dirlo a nessuno.
4. **`og:image` era relativo** per gli articoli (`coverImage` da Firestore):
   ogni link condiviso sarebbe uscito senza immagine.

### Decisione registrata

`AiAssistant` è stato smontato da `Layout.tsx`. L'endpoint `/api/ai-companion`
risponde 503 per progetto, quindi il widget cadeva sempre sul fallback a
keyword e prometteva itinerari e una guida PDF che non esistono. Componente,
endpoint e config restano in repo: si rimonta quando il RAG avrà un corpus.
