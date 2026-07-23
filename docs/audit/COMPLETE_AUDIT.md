---
title: 'Complete Master Audit — TRAVELLINIWITHUS'
type: audit
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Complete Master Audit — TRAVELLINIWITHUS (Verifica Forense Completa con Evidenze Realmente Prodotte)

## 1. Executive Summary & Dichiarazione Ricalibrata di Confidenza

Questo documento sintetizza l'Audit Forense Totale svolto sul progetto **TRAVELLINIWITHUS**, supportato dall'esecuzione reale della suite di test Playwright Chromium `.audit-workbench/forensic-audit.spec.ts` `[PLAYWRIGHT]`, audit di compilazione `[COMMAND]`, misurazioni Lighthouse `[LIGHTHOUSE]` e analisi dei bundle `[COMMAND, NETWORK]`.

- **Data Audit**: 2026-07-23 `[CONFIG]`
- **Stato Repository**: Commit `545b4b0` (`main`) `[GIT]`
- **Ambiente di Esecuzione**: Node.js `v22.22.2`, npm `10.9.7`, Playwright `v1.61.1` su `http://localhost:3000`. `[COMMAND, PLAYWRIGHT]`
- **Esito Suite Playwright**: **3/3 test suite passate in 10.8s** (Collaudate 33 route, 9 viewport responsive, 0 overflow orizzontali e percorso e-commerce carrello). `[PLAYWRIGHT]`
- **Confidenza Complessiva Ricalibrata**: **90% (Elevata)** `[ESTIMATE]`
  - _Verificato empiricamente con evidenze salvate in `docs/audit/evidence/`_:
    - Esecuzione suite Playwright Chromium (`3/3 passed in 10.8s`) `[PLAYWRIGHT]`
    - Build di produzione compilata (`npm run build` in 8.81s, 97 asset PWA) `[COMMAND]`
    - 0 errori TypeScript (`tsc --noEmit`) `[COMMAND]`
    - 0 errori ESLint (`npx eslint .`) `[COMMAND]`
    - 18/18 file di test unitari passati (`vitest`) `[COMMAND]`
    - Verificati 9 viewport responsive (`hasHorizontalOverflow: false` su tutti i 9 breakpoint) `[PLAYWRIGHT]`
    - Screenshots generati in `docs/audit/evidence/screenshots/` `[SCREENSHOT]`
    - Isolamento verificato del chunk Three.js (960 kB) alla sola rotta `/manifesto` `[NETWORK, PLAYWRIGHT]`
    - Rate limiting `/api/contact-lead` provato a runtime (5 passano, la 6ª → HTTP 429) — `e2e/contact-rate-limit.spec.ts`, aggiunto 2026-07-23 `[PLAYWRIGHT, RUNTIME]`
    - Verifica firma webhook Stripe provata a runtime (firma assente, malformata e forgiata → HTTP 400) — `e2e/stripe-webhook-signature.spec.ts`, aggiunto 2026-07-23 `[PLAYWRIGHT, RUNTIME]`
    - Click sui path del bio hub `/guida-in-regalo` verificati in browser (`bio_hub_path_click` in console + navigazione) — `src/pages/VieniConNoi.bioHub.test.tsx`, aggiunto 2026-07-23 `[BROWSER, RUNTIME]`
  - _Avvertenza metodologica emersa il 2026-07-23_: un criterio di accettazione espresso come "lo script X risponde 0 FAIL" non prova nulla se lo script è stato modificato insieme al codice. Vedi `[AUDIT-004]`, dove la guardia era stata sostituita anziché soddisfatta. Verificare sempre che la guardia asserisca ancora la proprietà originale.
  - _NON Verificato (Etichettato rigorosamente)_:
    - `[REQUIRES STAGING]`: Transazioni finanziarie reali con carte di credito fisiche su Stripe live API.
    - `[REQUIRES DEVICE]`: Prestazioni GPU e reattività touch del canvas MapLibre GL su smartphone fisici Android/iOS low-end.
    - `[REQUIRES LEGAL REVIEW]`: Conformità formale e parere legale definitivo sui testi della Privacy e Cookie Policy.

---

## 2. Registro Empirico Esecuzione Suite Playwright Chromium

La suite di test automatizzati `.audit-workbench/forensic-audit.spec.ts` `[PLAYWRIGHT]` ha prodotto i seguenti risultati dimostrabili:

| Nome Test Playwright                                     | Durata | Esito    | Evidenze Generate                                                                                                |
| :------------------------------------------------------- | :----- | :------- | :--------------------------------------------------------------------------------------------------------------- |
| **Inspect All 33 Routes & Collect Console/Network Logs** | 7.2s   | **PASS** | `playwright-route-results.json`, `console-errors.json`, `network-failures.json` `[PLAYWRIGHT]`                   |
| **Multi-Viewport Responsive & Overflow Audit**           | 2.5s   | **PASS** | `playwright-responsive-matrix.json`, 9 screenshot viewport in `evidence/screenshots/` `[SCREENSHOT, PLAYWRIGHT]` |
| **E2E Cart & Shop Journey Trace**                        | 1.1s   | **PASS** | `e2e_product_detail.png` in `evidence/screenshots/` `[SCREENSHOT, PLAYWRIGHT]`                                   |

---

## 3. Matrice Viewport & Responsive Verificata via DOM Playwright (`scrollWidth > clientWidth`)

L'ispezione automatizzata Playwright sul DOM per verificare l'assenza di overflow orizzontale (`document.documentElement.scrollWidth > document.documentElement.clientWidth`) `[PLAYWRIGHT]` ha restituito i seguenti valori reali:

| Viewport (W × H) | Dispositivo Emulato | Overflow Orizzontale | Bounding Box Out-of-Bounds | Esito DOM | Screenshot Prodotto                          |
| :--------------- | :------------------ | :------------------- | :------------------------- | :-------- | :------------------------------------------- |
| **320 × 568**    | iPhone SE (1st Gen) | `false`              | Nessuno                    | **PASS**  | `home_viewport_320x568.png` `[SCREENSHOT]`   |
| **375 × 812**    | iPhone 13 Mini / X  | `false`              | Nessuno                    | **PASS**  | `home_viewport_375x812.png` `[SCREENSHOT]`   |
| **390 × 844**    | iPhone 13 Pro / 14  | `false`              | Nessuno                    | **PASS**  | `home_viewport_390x844.png` `[SCREENSHOT]`   |
| **768 × 1024**   | iPad Portrait       | `false`              | Nessuno                    | **PASS**  | `home_viewport_768x1024.png` `[SCREENSHOT]`  |
| **1024 × 768**   | iPad Landscape      | `false`              | Nessuno                    | **PASS**  | `home_viewport_1024x768.png` `[SCREENSHOT]`  |
| **1366 × 768**   | Standard Laptop     | `false`              | Nessuno                    | **PASS**  | `home_viewport_1366x768.png` `[SCREENSHOT]`  |
| **1440 × 900**   | MacBook Pro 15      | `false`              | Nessuno                    | **PASS**  | `home_viewport_1440x900.png` `[SCREENSHOT]`  |
| **1920 × 1080**  | Full HD Desktop     | `false`              | Nessuno                    | **PASS**  | `home_viewport_1920x1080.png` `[SCREENSHOT]` |
| **2560 × 1440**  | QHD Monitor         | `false`              | Nessuno                    | **PASS**  | `home_viewport_2560x1440.png` `[SCREENSHOT]` |

---

## 4. Performance Lighthouse su Build di Produzione (`dist/`)

I report Lighthouse eseguiti sulla build compilata locale `dist/` `[LIGHTHOUSE]` mostrano i seguenti punteggi medi:

| Rotta Target       | Performance  | Accessibilità | Best Practices | SEO           | LCP (s) | CLS  | TBT (ms) |
| :----------------- | :----------- | :------------ | :------------- | :------------ | :------ | :--- | :------- |
| **`/` (Homepage)** | **88 / 100** | **94 / 100**  | **96 / 100**   | **100 / 100** | 1.8s    | 0.02 | 45ms     |
| **`/esplora`**     | **91 / 100** | **92 / 100**  | **96 / 100**   | **100 / 100** | 1.5s    | 0.01 | 30ms     |
| **`/mappa`**       | **76 / 100** | **90 / 100**  | **92 / 100**   | **95 / 100**  | 2.4s    | 0.04 | 120ms    |
| **`/shop`**        | **92 / 100** | **96 / 100**  | **96 / 100**   | **100 / 100** | 1.4s    | 0.00 | 20ms     |
| **`/lead-magnet`** | **94 / 100** | **96 / 100**  | **96 / 100**   | **100 / 100** | 1.3s    | 0.00 | 15ms     |

---

## 5. Registro Ricalibrato dei Finding Confermati con Evidenze

### [AUDIT-001] Disallineamento SSR Express su `/guida-in-regalo` — **RISOLTO 2026-07-23**

- **Gravità**: **P1 (Bug Critico Pre-Rilascio)** → **CLOSED** | **Area**: SSR Routing `[PLAYWRIGHT, RUNTIME]`
- **Causa**: `ALL_STATIC_APP_ROUTES` e sitemap runtime usavano ancora `/vieni-con-noi`; React aveva già `/guida-in-regalo`.
- **Fix applicato**:
  - `server.ts`: `/vieni-con-noi` → `/guida-in-regalo` in `ALL_STATIC_APP_ROUTES`
  - `src/App.tsx`: rimosso redirect/route `/vieni-con-noi` (nessun alias, nessun 301)
  - `src/server/seoRoutes.ts`: sitemap senza `/vieni-con-noi` né `/guida-in-regalo` (private/noindex)
- **Verifica**: GET `/guida-in-regalo` → **HTTP 200**; GET `/vieni-con-noi` → **HTTP 404** senza redirect; test regressione Playwright in `.audit-workbench/forensic-audit.spec.ts`.

### [AUDIT-002] Restrizione HTTP Referrer mancante per la chiave Firebase Web API — **BLOCCATO SU OWNER**

- **Gravità**: **P1 (Sicurezza Cloud)** | **Area**: Security Credentials `[COMMAND]`
- **Rettifica 2026-07-23 — la rotazione non è il rimedio**: il titolo di `TASK-002` era "Rotazione **e** restrizione". Una Firebase Web API key **non è un segreto**: è progettata per essere pubblica ed è incorporata in ogni bundle frontend servito. Rimuoverla dalla history non la renderebbe privata e una chiave nuova sarebbe altrettanto pubblica al primo deploy. La riscrittura della history richiederebbe inoltre un force-push, vietato senza conferma owner. **Il fix è la restrizione**; la rotazione è opzionale e va fatta _dopo_, solo con evidenza di abuso.
- **Esposizione misurata** (regex `AIza[0-9A-Za-z_-]{35}` sui commit di `git log --all -S 'AIza'`):
  - **1 sola chiave reale** in tutta la history (fingerprint SHA-256 `bfe5a2e6a546`), in **2 file**: `firebase-applet-config.json` e `docs/10_Projects/PROJECT_FIREBASE_HARDENING.md`
  - i 7 commit segnalati includono **falsi positivi**: `check-*.mjs`, gli agent `.md` e alcune note contengono la stringa letterale `AIza` come parte del _pattern_ di ricerca
  - **working tree oggi pulito**: in `firebase-applet-config.json` il campo `apiKey` è una stringa vuota; il valore reale arriva da `VITE_FIREBASE_API_KEY` a build time (`src/lib/firebaseApp.ts`)
  - contesto: progetto `gen-lang-client-0138696306`, **billing disabilitato** → l'abuso possibile è consumo di quota, non costo
- **Difetto collaterale trovato e risolto**: il WARN in `scripts/check-public-footprint.mjs` era **hardcoded e incondizionato** — si accendeva sempre, non misurava nulla e non si sarebbe spento nemmeno dopo l'intervento. Il criterio di accettazione di `TASK-002` era quindi inverificabile per costruzione. Ora il check legge lo stato dal decision record; tutti e cinque i suoi rami sono stati provati (non applicata / applicata senza data / lista inline / lista YAML / record assente).
- **Intervento residuo (solo owner)**: restringere la chiave `apiKeyId 6f7a0fce-54de-428b-9931-69e308a32efb` su Google Cloud Console. Runbook completo e campi di stato in `docs/20_Decisions/DECISION_FIREBASE_WEB_API_KEY_2026-07-23.md`. Non eseguibile da Claude Code: richiede accesso alla console GCP.
- **Limite dichiarato**: i campi del decision record sono un'**attestazione dell'owner**, non un controllo tecnico. Leggere lo stato reale richiederebbe `apikeys.googleapis.com` e credenziali GCP che gli agent non devono maneggiare.

### [AUDIT-003] Manca Rate Limiter dedicato sull'endpoint Contatti — **FALSO POSITIVO 2026-07-23**

- **Gravità**: **P1 (Anti-Spam)** → **CLOSED** | **Area**: Server Security `[PLAYWRIGHT, RUNTIME]`
- **Causa del falso positivo**: il finding cercava `/api/contact`, che non è mai esistita. L'endpoint reale è `/api/contact-lead`. L'ispezione era statica (`[FILE]`), quindi l'assenza di quel path è stata letta come assenza del limiter. Due file evidence (`security-results.md`, `user-flow-results.md`) affermavano già il contrario: la contraddizione non era stata riconciliata.
- **Stato reale del codice**:
  - `server.ts:1278-1284`: `contactLimiter` = 5 richieste / 10 minuti per IP, `standardHeaders: true`, messaggio italiano dedicato
  - `server.ts:1287-1288`: montato su `/api/contact-lead` e `/api/media-kit-lead`
  - `server.ts:1186`: `trust proxy: 1`, quindi la chiave è l'IP client reale dietro proxy
  - Il limiter precede `express.json` (`:1435`) e l'handler (`:1579`): una richiesta bloccata non raggiunge né Firestore né l'invio email
- **Verifica**: `e2e/contact-rate-limit.spec.ts`, 6 test verdi — 5 richieste passano, la 6ª restituisce **HTTP 429** con il messaggio del limiter; le richieste invalide consumano comunque il budget; `/api/health` e `/` restano 200. Guardia statica aggiunta in `scripts/check-stripe.mjs` (`npm run audit:stripe` → 10 PASS / 0 FAIL).
- **Osservazione minore (non un difetto di sicurezza)**: sulle risposte passanti gli header `RateLimit-*` riportano `100`, perché il `generalApiLimiter` (`server.ts:1292`, 100/15min) è montato dopo e li sovrascrive. Il blocco reale resta a 5; è impreciso solo l'annuncio al client. Asserito nello spec per intercettare un cambio nell'ordine dei mount.

### [AUDIT-004] Manca il tracciamento degli eventi di click bio su `VieniConNoi.tsx` — **RISOLTO 2026-07-23**

- **Gravità**: **P2 (Analytics)** → **CLOSED** | **Area**: Public Footprint `[BROWSER, RUNTIME]`
- **Causa**: le tre card del bio hub ("Oppure continua sul sito") portavano solo l'attributo `data-track`, **senza alcun `onClick`**. In tutto il repo `data-track` compariva solo lì e nessun listener delegato lo legge (`src/services/analytics.ts` non registra handler globali; il pattern del progetto è `onClick={() => trackEvent(...)}`, come in `Press.tsx:167` e `Risorse.tsx:336`). I click sui path secondari non emettevano quindi nulla.
- **Perché il criterio di accettazione risultava già soddisfatto**: la guardia in `scripts/check-public-footprint.mjs` era stata **sostituita, non soddisfatta** — l'assert su `bio_hub_path_click` era diventato un assert su `landing_view` durante la rinomina della route. `audit:public-footprint` rispondeva 0 FAIL mentre il bug era intatto: la vista pagina non dice nulla sui click.
- **Fix applicato**:
  - `src/pages/VieniConNoi.tsx`: `onClick` reale sulle tre card, evento `bio_hub_path_click` (nome già previsto dalla tassonomia in `docs/superpowers/specs/2026-07-13-travellini-ecosistema-connesso-design.md:309`) con `route`, `source`, `utm_source`, `cta_id` e `destination`. `data-track` mantenuto come selettore stabile per i test.
  - `scripts/check-public-footprint.mjs`: assert su `bio_hub_path_click` **ripristinato accanto** a quello su `landing_view`, non al suo posto.
- **Verifica**: `src/pages/VieniConNoi.bioHub.test.tsx`, 5 test verdi (un `cta_id` per card, propagazione `utm_source`, href corretti). Guardia non vuota: rimuovendo l'`onClick` 4 test falliscono e `audit:public-footprint` va a 1 FAIL. In browser reale, click su "Apri la mappa" → console `[analytics] event "bio_hub_path_click"` e navigazione a `/mappa`.
- **Nota**: `lead_magnet_download` è già emesso da `src/pages/LeadMagnet.tsx:22`, quindi la consegna della guida era e resta tracciata: il buco riguardava solo i path secondari.

### [AUDIT-005] Link markdown spezzati nella vault Obsidian `docs/` — **RISOLTO 2026-07-23**

- **Gravità**: **P2 (Documentazione)** → **CLOSED** | **Area**: Knowledge Vault `[COMMAND]`
- **Natura reale**: alla verifica erano **96** (non 78), e **tutti** riferimenti da note storiche a **codice sorgente** (`../../src/` × 95, `../../public/` × 1) poi cancellato — nessun link rotto tra note, nessun errore di path. Non un problema di integrità della vault, ma record di lavoro passato che puntano a file rimossi (home component in `545b4b0`, cluster itinerario in TASK-034).
- **Fix applicato** (decisione owner: opzione C — scollegare, non riscrivere): per ogni link il cui target è genuinamente inesistente, `[testo](href-rotto)` → `` `testo` `` — l'href rotto sparisce, il testo (path + eventuale `:riga`) resta come codice. La logica di esistenza replica esattamente quella di `audit-obsidian.mjs`: i link a file **ancora esistenti restano cliccabili** (verificato: sulla stessa riga, `NotFound.tsx` resta link, `HeroSection.tsx` cancellato diventa codice).
- **Verifica**: 96 link scollegati in 17 file, `npm run audit:obsidian` → **0 WARN, 0 ERROR**. Nessun `|` di tabella toccato (rimosso solo `](url)`).

### [AUDIT-006] HTTP 429 trattato come invio riuscito nel form contatti — **RISOLTO 2026-07-23**

- **Gravità**: **P2 (Analytics + UX)** → **CLOSED** | **Area**: Client Lead Flow `[BROWSER, RUNTIME]`
- **Causa**: emerso verificando `[AUDIT-003]`. In `src/pages/Contatti.tsx` il 429 finiva nel `catch` generico insieme agli errori di rete, veniva scritto in `localStorage` come lead da recuperare e mostrava all'utente la schermata di successo, emettendo `contact_submit_success`. Un utente rate-limited credeva quindi di aver scritto, il messaggio non partiva, e le analytics contavano una conversione mai avvenuta.
- **Fix applicato**:
  - `src/pages/Contatti.tsx`: ramo esplicito per `response.status === 429` prima del check `!response.ok` — nessun fallback `localStorage`, nessuno stato di successo, evento `contact_submit_blocked` con `reason: 'rate_limit'`, messaggio del server mostrato in `submitError` (già renderizzato, nessun cambio di markup né di stile)
- **Verifica**: budget esaurito da browser (5×200 → 429), poi invio del form da `/contatti` → compare "Troppi invii ravvicinati. Riprova tra qualche minuto.", il form resta compilato e riutilizzabile, **nessuna** schermata di successo, `twu_contact_leads` resta a 0 elementi, console senza errori.

### [AUDIT-007] Verifica firma webhook Stripe — **GIÀ IMPLEMENTATO 2026-07-23**

- **Gravità**: **P1 (Sicurezza Pagamenti)** → **CLOSED** | **Area**: Payments `[PLAYWRIGHT, RUNTIME]`
- **Contesto**: `TASK-003` era l'unico task P1 senza un finding corrispondente in questo registro, ed era etichettato `[FILE]` — cioè verificato per sola ispezione. Questa voce colma l'asimmetria e sostituisce l'ispezione con una prova eseguita.
- **Stato reale del codice**:
  - `server.ts:1298`: `express.raw({ type: 'application/json' })` sulla route, montata **prima** di `express.json` (`:1435`) — il raw body arriva integro alla verifica
  - `server.ts:1303-1306`: fail-closed — senza `stripe`, senza secret o senza header la richiesta è respinta con 400, non processata
  - `server.ts:1311`: `stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)`
  - `server.ts:1390` → `saveStripeOrder(order, event.id)`: idempotenza su `orders/{stripeSessionId}` con `.create()` (`:391-405`), i retry Stripe non duplicano ordini
  - `server.ts:1264-1292`: il webhook è escluso dal `generalApiLimiter`, così un burst di retry non viene throttlato
- **Verifica**: `e2e/stripe-webhook-signature.spec.ts`, 5 test verdi — richiesta senza header, firma malformata, e **firma ben formata prodotta con un secret arbitrario** (il caso che conta) restituiscono tutte **HTTP 400**; `received` non compare mai in una risposta non firmata; 120 richieste consecutive non producono un solo 429. Guardie statiche aggiunte in `scripts/check-stripe.mjs` su raw body, idempotenza e documentazione del secret (`npm run audit:stripe` → 13 PASS / 0 FAIL).

### [AUDIT-008] Nessun fail-fast se `STRIPE_WEBHOOK_SECRET` manca in produzione

- **Gravità**: **P1 (Sicurezza Pagamenti)** | **Area**: Payments / Startup Config `[FILE]`
- **Evidenza**: `server.ts:1193-1198` interrompe l'avvio in produzione se manca `APP_URL`, ma non esiste il controllo equivalente per `STRIPE_WEBHOOK_SECRET`. Con il secret assente o errato il server parte normalmente, il checkout funziona e **il cliente paga**, ma `server.ts:1303` respinge ogni evento con 400: Stripe ritenta per 3 giorni e poi rinuncia. Risultato: nessun ordine in Firestore, nessuna email di conferma, nessun allarme — i 400 sono indistinguibili da un tentativo di forgiatura respinto.
- **Intervento proposto** (mirror di `:1193-1198`, da applicare in `startServer()` subito dopo il controllo `APP_URL`):
  ```ts
  if (isProd && !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      '[startup] STRIPE_WEBHOOK_SECRET non impostata in produzione. Gli ordini pagati non verrebbero mai registrati. Avvio interrotto.'
    );
    process.exit(1);
  }
  ```
- **Bloccato**: `server.ts` è file ad alto rischio (`Edit(server.ts)` è in `deny` in `.claude/settings.json`). Richiede `travellini-backend-engineer` e conferma esplicita dell'owner. Tracciato come `TASK-033`.

### [AUDIT-009] Il gate `npm run predeploy` non era mai stato eseguito — **RISOLTO 2026-07-23**

- **Gravità**: **P1 (DevOps Gate)** → **CLOSED** | **Area**: Release Engineering `[COMMAND]`
- **Contesto**: `TASK-030` era etichettato "TEST NECESSARIO". Alla prima esecuzione reale il gate si è fermato **due volte**, e `predeploy.mjs` interrompe la sequenza al primo fallimento (`break`, riga 46): ogni blocco nascondeva gli step successivi, quindi sono servite tre esecuzioni per arrivare in fondo.
- **Bloccante 1 — `audit:size` (step 14/16)**: budget `react-pdf-lazy-export: bundle not found`. **Non è una regressione**: `/strumenti` è un redirect a `/esplora` (`src/App.tsx:146`), quindi `Strumenti.tsx` → `ItineraryBuilder` → `import('@react-pdf/renderer')` è uscito dal grafo dei moduli e il chunk non viene più emesso. Il budget era rimasto indietro rispetto a una scelta di prodotto.
  - **Fix**: flag `optional: true` su quella sola voce in `scripts/check-size.mjs`. Se l'export PDF torna lato client il limite si riapplica da solo; **gli altri budget continuano a fallire se il chunk sparisce** (verificato rinominando `charts-lazy-route` → ancora FAIL). Deliberatamente _non_ ho reso tollerante il controllo in generale: sarebbe la stessa guardia indebolita di `[AUDIT-004]`.
- **Bloccante 2 — `audit:obsidian` (step 15/16)**: 15 errori, di cui **14 sono i documenti di questo stesso audit** (`COMPLETE_AUDIT.md`, `DEVELOPMENT_PLAN.md`, `PROJECT_DISCOVERY.md` e 11 file in `evidence/`) privi del frontmatter richiesto dallo schema della vault (`type`, `status`, `area`). Il 15° era un `status: pending-owner` non ammesso, introdotto da me in `DECISION_FIREBASE_WEB_API_KEY_2026-07-23.md`.
  - **Fix**: frontmatter conforme sui 14 file, `status: active` sul decision record (descrive la decisione; lo stato dell'azione resta nei campi `restrizione_*`), e `npm run generate:obsidian-index` rieseguito.
- **Esito finale**: `npm run predeploy` → **exit code 0**, 16/16 step PASS.
- **Residui non bloccanti**: `audit:ui` riporta **430 warning** (0 errori) — coperti da `TASK-007`…`TASK-011`; `audit:obsidian` riporta 1 warning per i 78 link rotti — è `TASK-006`.
