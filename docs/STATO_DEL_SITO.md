---
type: dashboard
area: delivery
status: active
owner: Skott
repo: TRAVELLINIWITHUS
created: 2026-07-31
related:
  - '[[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]'
  - '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
tags:
  - dashboard
  - delivery
  - stato
---

# Stato del sito

Cosa c'è, in che stato, e dove vogliamo arrivare. La §2 e le tabelle del divario
sono **generate da `npm run stato`**: non si scrivono a mano, si rigenerano. Le
sezioni narrative sono le uniche scritte, perché nessuno script può validarle.

Per _cosa fare adesso_ vedi [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]].
Questa nota descrive lo stato, non le priorità.

## 1. Dove siamo davvero

**Il sito non è pubblicato.** Il 2026-07-31 `travelliniwithus.it` risponde 301
verso `www.` e serve una pagina "Coming Soon" WordPress (plugin SeedProd, hosting
Aruba): il dominio non punta al progetto Firebase di questo repo. Tutto ciò che
segue descrive un'applicazione che gira in locale e che nessun visitatore ha
ancora visto.

È una scelta deliberata — si continua a costruire, senza data di pubblicazione —
e va tenuta a mente leggendo il resto: **nessuno dei numeri qui sotto è stato
messo alla prova da utenti reali.** Le quattro home rifatte in due mesi sono il
costo già pagato di questa condizione.

Due rischi noti, aperti, non risolti:

- **Il deploy delle functions crasherebbe.** `functions/package.json` dichiara
  come unica dependency `firebase-functions`, ma lo script di build esclude
  `firebase-admin` dal bundle (`--external:firebase-admin`) senza che sia
  installato. In locale funziona solo perché `functions/node_modules/` è
  popolato a mano.
- **Il backend vive su un solo branch.** Vedi lo stato di consegna qui sotto.

### Stato di consegna

<!-- CONSEGNA:START — generato da `npm run stato`, non modificare a mano -->

- Branch corrente: `chore/config-hardening-2026-07-26` — 59 commit avanti su `main`, 0 dietro.
- File non committati: **541**.
- `functions/` su `origin/main`: **assente**.
- Rewrite `/api/**` in `firebase.json`: presente.

_Blocco volatile: rigenerato da `npm run stato`, escluso da `stato:check`._

<!-- CONSEGNA:END -->

## 2. Cosa abbiamo

<!-- STATO:START — generato da `npm run stato`, non modificare a mano -->

### Superfici pubbliche

**33 superfici registrate** — live 26 · preview 5 · soon 2 · private 5.

Registro: `src/config/surfaces.ts`. È la fonte unica di `noindex` e sitemap:
indicizzabile solo se `state: live` e non `private`.

| Rotta                              | Stato   | Privata | Cosa manca per essere live                    |
| ---------------------------------- | ------- | ------- | --------------------------------------------- |
| `/`                                | live    | —       | —                                             |
| `/esplora`                         | live    | —       | —                                             |
| `/destinazione`                    | live    | —       | —                                             |
| `/destinazione/:zoneSlug`          | live    | —       | —                                             |
| `/destinazione/:zoneSlug/:subSlug` | live    | —       | —                                             |
| `/mappa`                           | live    | —       | —                                             |
| `/chi-siamo`                       | live    | —       | —                                             |
| `/collaborazioni`                  | live    | —       | —                                             |
| `/media-kit`                       | live    | —       | —                                             |
| `/press`                           | live    | —       | —                                             |
| `/contatti`                        | live    | —       | —                                             |
| `/risorse`                         | live    | —       | —                                             |
| `/club`                            | live    | —       | —                                             |
| `/posto/:slug`                     | live    | —       | —                                             |
| `/articolo/:slug`                  | live    | —       | —                                             |
| `/privacy`                         | live    | —       | —                                             |
| `/cookie`                          | live    | —       | —                                             |
| `/termini`                         | live    | —       | —                                             |
| `/disclaimer`                      | live    | —       | —                                             |
| `/family`                          | live    | —       | —                                             |
| `/family/consigli`                 | live    | —       | —                                             |
| `/family/shop`                     | preview | —       | codici sconto family reali e attivi (≥3 deal) |
| `/itinerari`                       | preview | —       | itinerari reali al posto dei due demo         |
| `/itinerari/compare`               | preview | —       | itinerari reali da confrontare                |
| `/itinerari/:slug`                 | preview | —       | itinerari reali al posto dei due demo         |
| `/guide/:slug`                     | preview | —       | guide vere al posto delle due demo            |
| `/shop`                            | soon    | —       | prodotti acquistabili                         |
| `/shop/:slug`                      | soon    | —       | prodotti acquistabili                         |
| `/preferiti`                       | live    | sì      | —                                             |
| `/account/acquisti`                | live    | sì      | —                                             |
| `/lead-magnet`                     | live    | sì      | —                                             |
| `/guida-in-regalo`                 | live    | sì      | —                                             |
| `/manifesto`                       | live    | sì      | —                                             |

### Il divario, per superficie

| Rotta                | Manca                                         |
| -------------------- | --------------------------------------------- |
| `/family/shop`       | codici sconto family reali e attivi (≥3 deal) |
| `/itinerari`         | itinerari reali al posto dei due demo         |
| `/itinerari/compare` | itinerari reali da confrontare                |
| `/itinerari/:slug`   | itinerari reali al posto dei due demo         |
| `/guide/:slug`       | guide vere al posto delle due demo            |
| `/shop`              | prodotti acquistabili                         |
| `/shop/:slug`        | prodotti acquistabili                         |

Ogni superficie non-live dichiara cosa le manca.

### Contenuti

- **Registro** (`src/data/content-seed.json`): 110 item — **79 reali**, 31 placeholder, 2 featured.
- **Family** (`src/data/family-content-seed.json`): 8 item — 8 reali, 0 placeholder. Deal attivi: **0**.
- **Articoli** (`src/data/articles/*.seed.ts`): 6 seed — **0 con `published: true`**, 0 con excerpt ancora `PLACEHOLDER`.
- **Reel** (`src/config/reels.ts`): 67 visibili — 67 compilati, 0 placeholder.

### Integrazioni

**43 variabili dichiarate** in `.env.example`. "Letta da": `app` = `src/`, `server.ts`, `functions/src/`; `tooling` = `.mcp.json`, `scripts/`, workflow CI.
La colonna locale dice solo se la chiave ha un valore su questa macchina — mai quale.

| Variabile                            | Letta da | `.env` locale |
| ------------------------------------ | -------- | ------------- |
| `ADMIN_EMAIL`                        | app      | EMPTY         |
| `AI_COMPANION_CORPUS_READY`          | app      | SET           |
| `ALLOW_MOCK_CHECKOUT`                | app      | SET           |
| `ANTHROPIC_API_KEY`                  | app      | EMPTY         |
| `APP_URL`                            | app      | SET           |
| `BREVO_API_KEY`                      | app      | EMPTY         |
| `BREVO_LIST_ID`                      | app      | EMPTY         |
| `FIREBASE_SERVICE_ACCOUNT`           | app      | EMPTY         |
| `FIREBASE_SERVICE_ACCOUNT_JSON`      | app      | EMPTY         |
| `FIRESTORE_DATABASE_ID`              | app      | EMPTY         |
| `GEMINI_API_KEY`                     | app      | EMPTY         |
| `GITHUB_PERSONAL_ACCESS_TOKEN`       | tooling  | SET           |
| `IG_GRAPH_TOKEN`                     | tooling  | EMPTY         |
| `LEAD_MAGNET_URL`                    | app      | EMPTY         |
| `MAIL_FROM`                          | app      | SET           |
| `MAIL_TO_OWNER`                      | app      | SET           |
| `MEDIA_KIT_URL`                      | app      | EMPTY         |
| `OBSIDIAN_API_KEY`                   | tooling  | SET           |
| `OPENAI_API_KEY`                     | app      | EMPTY         |
| `RESEND_API_KEY`                     | app      | EMPTY         |
| `SENTRY_ACCESS_TOKEN`                | tooling  | SET           |
| `SENTRY_AUTH_TOKEN`                  | tooling  | EMPTY         |
| `SENTRY_DSN`                         | app      | EMPTY         |
| `SENTRY_ORG`                         | tooling  | EMPTY         |
| `STRIPE_CLUB_PRICE_ID`               | tooling  | EMPTY         |
| `STRIPE_SECRET_KEY`                  | app      | SET           |
| `STRIPE_WEBHOOK_SECRET`              | app      | EMPTY         |
| `VITE_AFFILIATE_AIRALO_ID`           | app      | EMPTY         |
| `VITE_AFFILIATE_BOOKING_ID`          | app      | EMPTY         |
| `VITE_AFFILIATE_REVOLUT_ID`          | app      | EMPTY         |
| `VITE_AFFILIATE_SKYSCANNER_ID`       | app      | EMPTY         |
| `VITE_APP_VERSION`                   | app      | EMPTY         |
| `VITE_FIREBASE_API_KEY`              | app      | EMPTY         |
| `VITE_GA_ID`                         | app      | EMPTY         |
| `VITE_LITE_MODE`                     | app      | SET           |
| `VITE_MAPBOX_TOKEN`                  | tooling  | EMPTY         |
| `VITE_META_PIXEL_ID`                 | app      | EMPTY         |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | tooling  | EMPTY         |
| `VITE_SENTRY_DSN`                    | app      | EMPTY         |
| `VITE_TIKTOK_PIXEL_ID`               | app      | EMPTY         |
| `VITE_TWU_AUDIT_MODE`                | app      | SET           |
| `VITE_USE_FIREBASE_EMULATOR`         | tooling  | SET           |
| `VITE_VIDEO_BASE_URL`                | app      | EMPTY         |

Ogni variabile dichiarata è letta da qualche parte.

### Endpoint API

**9 endpoint** definiti in `src/server/apiRoutes.ts`, montati sia da `server.ts` (dev) sia da `functions/src/index.ts` (prod).

| Metodo | Path                           |
| ------ | ------------------------------ |
| GET    | `/api/health`                  |
| POST   | `/api/webhook`                 |
| POST   | `/api/newsletter-subscribe`    |
| POST   | `/api/contact-lead`            |
| POST   | `/api/media-kit-lead`          |
| POST   | `/api/create-checkout-session` |
| POST   | `/api/admin/ai-verify`         |
| POST   | `/api/validate-coupon`         |
| POST   | `/api/ai-companion`            |

<!-- STATO:END -->

## 2-bis. Baseline di qualità — misurata il 2026-07-31

Punto di partenza contro cui misurare ogni elevazione. Scritta a mano perché
richiede build + Lighthouse: si rimisura con `npm run audit:cwv`, non con
`npm run stato`. **Rimisurare prima di dichiarare un miglioramento.**

Lighthouse su build di produzione, 7 rotte, `.lighthouseci/`:

| Rotta             | Perf | A11y | Best practices | LCP   | CLS   | TBT  |
| ----------------- | ---- | ---- | -------------- | ----- | ----- | ---- |
| `/`               | 93   | 100  | 100            | 1,6 s | 0     | 0 ms |
| `/chi-siamo`      | 96   | 96   | 100            | 1,4 s | 0     | 0 ms |
| `/collaborazioni` | 94   | 100  | 100            | 1,5 s | 0     | 0 ms |
| `/esplora`        | 89   | 97   | 100            | 2,1 s | 0     | 0 ms |
| `/family`         | 95   | 100  | 100            | 1,5 s | 0     | 0 ms |
| `/media-kit`      | 95   | 95   | 100            | 1,4 s | 0,001 | 0 ms |
| `/shop`           | 95   | 100  | 100            | 1,4 s | 0     | 0 ms |

Altre dimensioni, stessa data:

| Dimensione                | Comando              | Baseline mattina                                                                                                                                                                                                                          | Dopo la pulizia              |
| ------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Bundle                    | `npm run audit:size` | budget passati, initial JS 237,4 KB gzip su 250                                                                                                                                                                                           | **identico**                 |
| Test                      | `npm run test`       | 146/146 verdi, 30 file                                                                                                                                                                                                                    | 146/146                      |
| Tipi                      | `npm run typecheck`  | pulito                                                                                                                                                                                                                                    | pulito                       |
| Coerenza UI               | `npm run audit:ui`   | 0 errori, **365 warning**                                                                                                                                                                                                                 | **231 warning** (−37 %)      |
| File sorgente scansionati | `npm run audit:ui`   | 189                                                                                                                                                                                                                                       | 165                          |
| Codice morto              | `npm run audit:deps` | **49 file mai importati**                                                                                                                                                                                                                 | **19**, tutti tenuti apposta |
| Lint                      | `npm run lint`       | **rosso in locale**: 6 warning su `functions/lib/index.js`, artefatto di build gitignorato che `eslint.config.js` non esclude. In CI passa (la cartella non esiste su checkout pulito). `eslint.config.js` è hard-blocked: serve l'owner. | invariato                    |

### Pulizia del 2026-07-31 — cosa è cambiato e cosa no

Rimossi 30 file mai importati: quattro home abbandonate
(`InnovativeHomeHero`, `WeekendGeneratorWidget`, `CleanCuratedHero`,
`InteractiveGlobeSection`), l'intera cartella `home/immersive/`, gli alberi
`experience/atlante/` e `experience/sentiero/` (le rotte erano già redirect 301),
più `CartDrawer`, `InstagramGrid`, `RoiCalculatorWidget`, `Press.tsx` orfano,
`lib/errorTracking.ts` e tre config non consumate.

**Lighthouse: invariato su tutte e sette le rotte.** Non è un fallimento della
pulizia — è la prova che quel codice non entrava nel bundle. Il guadagno è di
superficie di manutenzione, non di velocità: prima una modifica alla home poteva
finire in uno di quattro file che nessuno montava.

I 19 file che restano sono tenuti apposta: entry point delle functions, hook
invocati da `.claude/settings.json`, il server di Lighthouse, i 6 seed articoli
in attesa di pubblicazione, l'archivio in `docs/99_Archive/` e
`src/config/aiCompanion.ts`, che documenta l'endpoint stub `/api/ai-companion`.

Aperto, non toccato: **17 dipendenze mai importate** in `package.json`
(`zod`, `react-hook-form`, `date-fns`, `cmdk`, `sonner`, `clsx`…). Rimuoverle
tocca lockfile e supply chain: serve conferma dell'owner.

**Come leggerla.** Il piano tecnico è già alto: performance fra 89 e 96, CLS a
zero, TBT a zero, best practices 100 ovunque, bundle dentro ogni budget. Non è
lì che il sito è basso. È basso su **verità del contenuto** (metà registro è
placeholder, zero articoli pubblicati, zero deal family) e su **peso morto**
(49 file mai importati, fra cui quattro home abbandonate). Elevare la superficie
visiva sopra contenuto placeholder è esattamente ciò che è già successo quattro
volte.

## 3. Dove vogliamo arrivare

Il target non si scrive qui: si scrive **nel codice**, nel campo `missing:` di
`src/config/surfaces.ts`, e da lì lo script lo riporta nella tabella "Il divario,
per superficie" della §2. Una superficie che non dichiara cosa le manca è una
superficie di cui nessuno ha deciso il traguardo.

Regola: **quando decidi cosa serve a una sezione per essere reale, aggiorni
`missing:`, non questo paragrafo.** Così il divario non può divergere dal codice.

Quello che resta irriducibilmente autoriale è la definizione di prodotto — cosa
il sito deve essere per le tre audience (viaggiatori, famiglia, brand). Vive già
in [[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]] e non va riscritta
qui. Il punto aperto di quella spec, ancora fermo in attesa di quattro decisioni
dell'owner: le tre audience dichiarano chi sono all'ingresso, ma la home non
legge mai `useAudience()` — cambiano menu, footer e contatti, il contenuto no.

## 4. Cosa NON stiamo facendo

Scelte, non dimenticanze:

- **Pubblicare.** La Coming Soon resta finché non si decide diversamente.
- **Le roadmap lunghe.** Cinque piani sono in `status: archived` con
  `icebox_reason` — quiz archetipi, pagina club, companion AI, guide audio,
  itinerary builder. Contengono feature mai decise, non lavoro morto: si
  ripescano quando il sito avrà visitatori, non prima.
- **I piani assorbiti.** Diciassette project doc sono `archived` con
  `superseded_by`. Restano leggibili come storico: non aggiungerci voci.
