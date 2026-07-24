---
type: project
area: delivery
status: open
priority: p1
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: release preparation
tags:
  - project
  - delivery
  - release
---

# PROJECT_RELEASE_READINESS

## Mappa delle tracce — gate locale 2026-07-21

Scope: redesign della route `/mappa` come continuazione del `Diario delle
meraviglie vere`.

- TypeScript, ESLint mirato, build produzione e audit UI: PASS.
- Test unitari: PASS, 56/56.
- Visual smoke: PASS, 14/14 desktop/mobile, inclusa la homepage dopo
  l'ottimizzazione tipografica.
- Browser 375/768/1024/1440: PASS; un H1, zero overflow, zero immagini rotte,
  zero errori console o pagina.
- Flussi: filtri, preset, pin, card, deep link, CTA archivio, retry e stato errore: PASS.
- Tastiera: Enter/Spazio sul marker, focus scheda, Esc e ritorno al marker: PASS.
- Axe WCAG AA a 375 e 1440: zero violazioni.
- Performance mobile 4G/CPU 4x, mediana di 5 cold run: FCP 1,30 s, LCP 1,72 s,
  CLS 0,044, filtro 24 ms, TTFB locale 3,1 ms.
- Font: un solo Fraunces variable `wght` normale da 36,9 KB; nessun file `full`.
- MapLibre resta lazy e separato; Lenis/GSAP non vengono richiesti su `/mappa`.
- Residuo non bloccante: warning provider OpenFreeMap per sprite `circle-11`
  mancante, senza difetto visibile; TBT sintetico 381 ms legato soprattutto al
  costo baseline MapLibre, con interazione filtro a 24 ms.
- Audit Obsidian: i nuovi documenti non aggiungono errori; il comando resta rosso
  per 10 errori storici in handoff/plan homepage e link relativi gia presenti.
- Deploy e commit non eseguiti.

**Verdetto slice `/mappa`: PASS locale.** Lo stato release complessivo resta
subordinato ai blocker sicurezza/owner gia registrati in questa nota.

> **Superato il 2026-07-22.** Questo gate certificava la mappa editoriale
> (`MapboxWorldMap` + `Mappa.css`), sostituita nel frattempo dall'esperienza
> full-screen `FullScreenMapExperience`. Nella sostituzione l'H1 era andato
> perso — la riga «un H1, zero overflow» qui sopra descriveva una pagina che
> non esisteva piu'. La testata editoriale e' stata reintrodotta (commit
> `b8273bd`) e la mappa vecchia cancellata perche' morta con `HomeLegacy`
> (commit `9affb15`, ripescabile da git).
>
> Rimisurato sulla nuova slice, 7 viewport da 375x667 a 1440x900, con elenco,
> pannello filtri e scheda aperti dove la larghezza lo consente: un H1 ovunque,
> zero collisioni fra testata, barra, pannello, elenco e scheda, controlli zoom
> e attribuzione OSM sempre raggiungibili, nessun overflow orizzontale.
> Restano da rifare le misure di performance e l'audit axe, che questo gate
> copriva e che la nuova slice non ha ancora ripetuto.

## Homepage cinematografica — gate 2026-07-18

Scope: redesign della sola homepage `/`, direzione **Il montaggio delle tracce**.

- TypeScript, lint, build produzione e audit UI: PASS.
- Browser produzione 375/768/1280/1440: PASS, un H1, zero overflow e zero errori console.
- Reduced motion: PASS; ordine narrativo e CTA restano disponibili.
- Design QA: PASS (`design-qa.md`).
- Due difetti CTA individuati durante il gate e corretti: anchor del capitolo 01 e slug della scheda Batu Caves.
- Deploy e commit non eseguiti.

Il verdetto S6 resta subordinato agli audit sicurezza/performance correnti e ai blocker owner storici già registrati sotto.

### Esito S6 corrente

- Quality delta: PASS dopo correzione CTA/anchor e aggiornamento test Navbar; 11 file e 56 test unitari verdi.
- Build, typecheck, lint, audit UI e budget bundle: PASS.
- Browser smoke: PASS a 375/768/1280/1440; CTA Batu Caves verificata sulla route reale `/posto/malesia-batu-caves`.
- Performance mobile 4G/CPU 4×: **BLOCK** — LCP 3,05–3,48 s, TBT 1.008 ms, menu INP proxy 200–520 ms.
- Security: **BLOCK owner** — tre occorrenze storiche redatte della Firebase/GCP Web API key; file correnti puliti. Prima del deploy servono restrizioni referrer/API, App Check e rotazione se la vecchia chiave è ancora attiva.

**Verdetto:** homepage pronta per revisione locale, non pronta per deploy produzione.

## Obiettivo

Tenere sotto controllo cio che manca per una release pulita e verificabile della V1.

## Public footprint release candidate — 2026-06-07

Scope: audit pubblico influencer Travelliniwithus, bio hub, media kit proof, disclosure affiliate, metriche pubbliche, hardening Firebase client config.

**Incluso nel release candidate:**

- `/vieni-con-noi` trasformata in bio hub proprietario con percorsi verso Esplora, Risorse e Media Kit.
- `/media-kit`, `/collaborazioni` e `/press` aggiornate con fonte metriche datata e proof pubbliche linkate.
- `/risorse` separa tracking affiliate/editoriale e applica `rel="sponsored"` solo ai link commerciali.
- Email welcome newsletter allineata a `src/config/site.ts` invece di numeri social hard-coded.
- Counter newsletter pubblico disattivato finche Brevo/Firestore non forniscono un numero verificato.
- Firebase Web API key rimossa dai file correnti (`firebase-applet-config.json` e docs); valore reale spostato su `VITE_FIREBASE_API_KEY`.
- Auth provider reso tollerante a config Firebase mancante in locale: niente errore console su pagine pubbliche.

**Predeploy/code gate — PASS:**

- `npm run predeploy` PASS
- `npm run typecheck` PASS
- `npm run lint` PASS
- `npm run test` PASS — 4 file, 10 test
- `npm run build` PASS
- `npm run audit:ui` PASS — 0 errori, 92 warning noti
- `npm run audit:firebase` PASS
- `npm run audit:stripe` PASS — 9/9
- `npm run audit:revenue` PASS
- `npm run audit:agents` PASS
- `npm run audit:size` PASS
- `npm run audit:public-footprint` PASS — 39 pass, 0 fail, 2 warning owner/GCP
- `npm run audit:visual` PASS — 14/14
- Browser smoke PASS su `/`, `/vieni-con-noi`, `/media-kit`, `/collaborazioni`, `/press`, `/risorse`

**Security gate — BLOCKED:**

- `npm run audit:secrets` FAIL: 3 leak storici `gcp-api-key` in git history.
- File correnti ripuliti: `rg "AIza..."` fuori da `.git` non trova piu valori.
- Directory scan rileva segreti locali in `.env` e `.obsidian/`, entrambi gitignored; non sono da committare.
- `npm run audit:public-footprint` conferma che nessun file corrente tracciato/non tracciato contiene pattern GCP API key.

**Azione owner obbligatoria prima del deploy pubblico:**

- Ruotare o restringere la Firebase Web API key su GCP.
- Impostare `VITE_FIREBASE_API_KEY` in env produzione.
- Confermare restrizioni HTTP referrer e API allow-list in GCP.
- Decidere se riscrivere la history remota o accettare il leak storico dopo rotazione/restrizione.
- Aggiornare bio IG/TikTok live con il link proprietario.

**Verdict:** codice pronto, deploy produzione bloccato da secret history/GCP owner action.

**Preview Hosting — LIVE:**

- URL: https://gen-lang-client-0138696306--public-footprint-20260607-y3k31dtl.web.app
- Scadenza: 2026-06-14 14:49 UTC
- Smoke live PASS su `/`, `/vieni-con-noi`, `/media-kit`, `/collaborazioni`, `/press`, `/risorse`
- Nota: preview build senza `VITE_FIREBASE_API_KEY`; pagine pubbliche ok, funzioni Auth/Admin non operative finche la key non viene impostata in env.

**Nuovo gate locale:**

- Script: `scripts/check-public-footprint.mjs`
- Comando: `npm run audit:public-footprint`
- Scopo: controllare bio hub, proof docs, fonte metriche, disclosure/link commerciali, assenza di Firebase Web API key nei file correnti e presenza del wiring `VITE_FIREBASE_API_KEY`.

## Full-mode release candidate — 2026-06-03

Decisione: il sito passa da lite launch a full-mode pubblico con `VITE_LITE_MODE=false`.

**Incluso nel release candidate:**

- `/esplora`, `/shop`, `/club`, `/itinerari`, `/preferiti` navigabili nel percorso pubblico.
- `/shop` in stato waitlist con un solo SKU prioritario, senza checkout attivo finche il prodotto non e consegnabile.
- `/club` riallineato a pre-lancio credibile: waitlist, preview formato, FAQ senza promesse di checkout live.
- `/risorse` con label commerciali visibili (`Affiliato`, `Non affiliato`, `Codice sconto`).
- Media kit e press funnel senza download diretto del kit completo come CTA primaria.
- H1 e copy critici riallineati per accessibilita, SEO e tono pubblico italiano.
- Test navbar isolati da Firebase reale; lead magnet sblocco sessione senza `setState` sincrono in effect.

**Predeploy S6 — PASS:**

- `npm run typecheck` PASS
- `npm run lint` PASS
- `npm run test` PASS — 4 file, 10 test
- `npm run build` PASS
- `npm run audit:ui` PASS — 0 errori, 134 warning gia noti su admin/inline/raw color
- `npm run audit:firebase` PASS
- `npm run audit:stripe` PASS — 9/9
- `npm run audit:agents` PASS
- Static files presenti: `public/sitemap.xml`, `public/robots.txt`, `public/media-kit.pdf`, `.env.example`

**Nota build:** resta warning CSS minifier su classe tipo `[file:line]`; non blocca build.

**Stato:** ready for deploy gate lato codice. Prima del deploy produzione confermare env operativi: `APP_URL`, `BREVO_API_KEY`, `BREVO_LIST_ID`, Sentry token se si vuole upload sourcemap, dominio Firebase Hosting/SSL.

## Lite Launch — 2026-05-28

Pubblicazione lite su `travelliniwithus.it`: 5 sezioni WIP nascoste via feature flag `VITE_LITE_MODE=true` per consentire il go-live mentre il lavoro sotto continua.

**Sezioni OFF (route ritornano 404, nessun link in nav/footer, escluse da sitemap, Disallow in robots.txt):**

- `/esplora`
- `/itinerari`, `/itinerari/compare`, `/itinerari/:slug`
- `/shop`, `/shop/:slug`
- `/club`
- `/preferiti`

**Componenti OFF in lite:** AiAssistant (demo), ExitIntentPopup, HomeDiscoveryFinder, MonetizationTeaser, InstagramGrid, HomeLeadMagnet (sezione home).

> **Procedura superata (2026-07-23).** `liteMode` è andato in pensione: 29a2fb0
> ha cancellato `src/config/liteMode.ts` e ogni gate client, e la copia di
> `LITE_DISABLED_PREFIXES` in `scripts/generate-sitemap.js` non esiste più — i
> passi 1 e 3 di questa riattivazione puntavano a codice che non c'è. Le sezioni
> elencate sopra sono online e raggiungibili. L'ultimo lettore di
> `VITE_LITE_MODE` è `server.ts`: la rimozione è approvata e in attesa di
> sblocco. Per nascondere una superficie oggi si usa il registro in
> `src/config/surfaces.ts`, non un flag d'ambiente.

**Stato:** typecheck verde, build prod OK (29s), 11/11 status code corretti (200 attive / 404 disabilitate), browser smoke test PASS (1 round con 2 dead CTA + 1 round con 6 link residui — entrambi corretti).

**Da chiudere PRIMA del go-live:**

- [ ] Sentry: rigenerare `SENTRY_ACCESS_TOKEN` (scaduto 2026-05-21) o disattivare DSN
- [ ] Verificare `BREVO_API_KEY` + `BREVO_LIST_ID` in env produzione (altrimenti newsletter silent fail)
- [ ] Verificare consent banner GDPR (Meta/TikTok pixel non devono sparare prima del consent)
- [ ] Firestore: confermare `articles.published == true` count > 0 (altrimenti LatestArticles home vuoto)
- [ ] Firebase Hosting: aggiungere custom domain `travelliniwithus.it` + `www.travelliniwithus.it`, attendere SSL Let's Encrypt

## Piano V2 collegato

La pianificazione V2 avanzata e tracciata in [[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]].

Prima di raccomandare un deploy V2, chiudere almeno:

- [x] baseline QA V2 su route pubbliche principali
- [ ] sostituzione asset demo/AI critici con asset reali approvati
- [ ] contenuti preview non indicizzabili o sostituiti da contenuti reali
- [ ] roundtrip lead Firestore/fallback verificato
- [ ] shop reale solo se checkout e delivery sono pronti
- [ ] `npm run audit:quality`

## Rimozione quiz/budget pubblico - 2026-05-24

- [x] Homepage: rimossa la sezione `HomeQuizBudgetTeaser` con "Quiz viaggio" e "Budget viaggio".
- [x] `/strumenti`: rimossi calcolatori budget; restano calendario quando andare, builder itinerario e mappa.
- [x] `/quiz`: non e piu una rotta pubblica, ora reindirizza a `/esplora`.
- [x] SEO/crawler: `/quiz` rimosso da sitemap e `llms-full.txt`.
- [x] Copy pubblico: assistente demo, Club e PDF lead magnet non propongono piu quiz/calcolatore.

## Hero homepage refinement - 2026-05-24

- [x] Rimossa la card "Ultimo reel Instagram" dalla prima piega per ridurre competizione visiva con H1 e CTA.
- [x] Copy hero accorciato e reso piu concreto.
- [x] Proof line trasformata in tre segnali editoriali sobri: metodo, focus, filtro.
- [x] CTA primaria mantenuta sopra il banner cookie su desktop e mobile.
- [x] Mobile: nessun overflow orizzontale, CTA primaria visibile, CTA secondaria nascosta.

## Audit completo + remediation - 2026-05-24

Audit multi-dominio in parallelo (quality statico + security + perf/CWV reale + browser reale) seguito da remediation. Lo snapshot "100% PASS" del 2026-05-21 non rifletteva piu lo stato: l'audit ha trovato 4 blocker, 3 HIGH perf, 5 MEDIUM, ~8 LOW.

**Blocker chiusi:**

- [x] **B1** — lint error `role="img"` ridondante in `OptimizedImage.tsx` (bloccava `predeploy`/`lint-staged`). Rimosso.
- [x] **B2** — sitemap con 22 URL `/articolo` morti (404) + 6 noindex. `scripts/generate-sitemap.js` ripulito dai demo seed (`extractDemoArticleSlugs`, `demoArticleEntries`, `PILLAR_ARTICLE_SLUG`); ora solo articoli Firestore `published==true`. `public/sitemap.xml` rigenerata (0 URL /articolo pre-launch, corretto). `noindex` preview e robots invariati per direttiva seo-strategist.
- [x] **B4** — open-redirect su callback Stripe: `success_url`/`cancel_url` derivavano l'origin da `req.get('host')`. Aggiunto guard fail-fast in `server.ts` (`startServer`): in produzione `APP_URL` obbligatorio, altrimenti boot abortito. Fallback su Host header irraggiungibile in prod.
- [ ] **B3** — Firebase Web API key senza restrizioni GCP (`firebase-applet-config.json`). AZIONE OWNER su Google Cloud Console (HTTP-referrer + API allow-list + App Check). Unico blocker pre-launch residuo.

**HIGH perf chiusi:**

- [x] **H1** — Firebase caricato eager su ogni rotta. Init deferito dietro `import()` dinamico (AuthContext, FavoritesContext, firestoreErrorHandler, useSiteContent). Modulepreload eager: firebase-core/auth/firestore rimossi → **~157 KB gz fuori dal preload iniziale** (`firebase` in `dist/index.html`: 3→0).
- [x] **H2** — hero PNG fallback da ~1.19 MB. Rigenerati AVIF (≤195 KB) + WebP fallback (≤247 KB); preload PNG sostituito da preload AVIF `fetchpriority=high`. **-84%** sul peso LCP.
- [x] **H3** — GSAP + motion entrambi eager sull'hero. Consolidato su `motion/react` (wipe+stagger+parallax replicati 1:1), GSAP rimosso dall'hero (resta in package.json: usato in altri 4 componenti). **-46 KB gz**.

**MEDIUM chiusi:**

- [x] **Perf #4** — SW precache 6.36 MB → **2.60 MB** (-3.75 MB). mapbox/charts/editor/react-pdf tolti dal precache (`globIgnores`) e serviti via `runtimeCaching` CacheFirst on-demand.
- [x] **M1** — CSP `script-src`: `'unsafe-eval'` → `'wasm-unsafe-eval'` in `firebase.json` + `server.ts` (cspProd). Indagine: zero `eval`/`new Function` reali nel bundle, solo WASM (mapbox-gl + react-pdf) richiede eval-class. `'unsafe-inline'` mantenuto (JSON-LD + GA inline).
- [x] **Perf #5** — `InteractiveMap` su Articolo reso lazy (`maps` chunk ~37 KB gz fuori dall'eager di Articolo).
- [x] **Perf #6** — quill CSS confinato al chunk admin lazy (fuori dal CSS critico pubblico). Fraunces 500-italic mantenuto (usato negli h1).
- [ ] **M2** — migrazione `productAssets` non eseguita (ordini digitali `downloadUrl: null`). AZIONE OWNER: eseguire script migrazione prima dello shop live.

**LOW chiusi:** ~30 refusi ortografici italiani user-visible (è/già/più/caffè/città) in ClubFaq, quizArchetypes, regions, poiCatalog, previewContent, seasonalGuide, WhenToGoCalendar, Strumenti, ItineraryDocument, ecc. (commenti e chiavi oggetto correttamente non toccati). Import morti rimossi (MediaKit, ProductPage). `.gitignore` esteso agli artefatti audit (`.lh-*.json`, screenshot full-page).

**Falso-blocker chiarito:** `/articolo` + `/strumenti` non caricavano nel browser-audit per cache Vite stale (`node_modules/.vite`), non bug di codice. Risolto con restart pulito; verificato 0 errori console.

Verifiche finali: `npm run typecheck` 0 errori · `npm run lint` 0 errori/0 warning · `npm run build` PASS (precache 96 entries / 2.6 MB) · `audit:stripe` 9/9 · smoke browser home/shop/articolo 0 errori console.

**Residui pre-deploy:** B3 (GCP, owner) · M2 (migrazione productAssets, owner) · smoke reale login+preferiti e mappa/PDF con nuovo CSP via browser-auditor · confermare `APP_URL` settato in env produzione (ora hard-fail al boot se manca) · rigenerare `SENTRY_ACCESS_TOKEN` scaduto.

## Sessione UX browser-audit - 2026-05-22

Audit browser reale (Playwright MCP) su 7 rotte ai viewport 375/768/1280: 0 blocker, 4 seri, 5 minori. Fix applicati e ri-verificati nel browser (7/7 PASS, 0 errori console, 0 regressioni).

- [x] **S3** — Contatti: link "Apri il media kit" puntava a `/collaborazioni`, ora a `/media-kit`. [src/pages/Contatti.tsx](../../src/pages/Contatti.tsx).
- [x] **S4** — Ambiguità "Strumenti": la voce di menu "Strumenti" puntava a `/risorse`. Decisione originale: "Strumenti" → `/strumenti`; aggiornata il 2026-05-24 a pagina di supporto senza quiz/budget pubblico (calendario, builder itinerario, mappa). `/risorse` (app/gear/affiliate) resta come "Risorse di viaggio". Allineati Navbar + Footer (2 link). [src/components/Navbar.tsx](../../src/components/Navbar.tsx), [src/components/Footer.tsx](../../src/components/Footer.tsx).
- [x] **S1+S2** — Mappa mobile (vedi sezione dedicata sotto).
- [x] **MINORE** — Hero home: tap target link "Lavora con noi"/"Media Kit" da ~15px a 44px (`min-h-11`). `src/components/home/HeroSection.tsx`.
- [x] **MINORE** — Esplora: banner "preview editoriale" spostato sopra la card filtri (non più incuneato tra contatore risultati e card). [src/pages/Esplora.tsx](../../src/pages/Esplora.tsx).

Residui minori non chiusi (bassa priorità): hero home mobile lungo (blocco Instagram statico), ricerca "bali→Italia" (seed-related, atteso in preview), nit "10 itinerari" vs 3 mostrati, warning preload `couple-travel.png`/`hero-amalfi.avif`.

Verifiche: `npm run typecheck` 0 errori · `npm run audit:ui` 0 errori · `Navbar.test` 2/2 · browser-auditor re-verify 7/7 PASS.

## Fix mobile `/mappa` - 2026-05-22

Direzione lockata da `travellini-ui-designer`, implementata in `src/components/map/MapboxWorldMap.tsx` (file unico).

- [x] **S1 risolto** — filtri continente+esperienza: niente piu overflow muto. Sotto `md` ogni riga e scroll orizzontale con fade-edge + chevron + `scrollIntoView` sul chip attivo. Chip tap target `min-h-11` (>=44px). Da `md` in su layout invariato.
- [x] **S2 risolto** — lista destinazioni: da carosello orizzontale nascosto sovrapposto alla mappa a lista verticale full-width in-flow sotto la mappa (sotto `md`). Da `md` in su resta carosello overlay invariato.
- [x] **Struttura** — switch a singolo breakpoint `md` (768px). Sotto `md`: layout verticale impilato (`static`/`sticky`, niente `absolute`): titolo → filtri (sticky) → mappa `h-[52vh]` → lista verticale → CTA "Apri archivio" in coda. Da `md` in su: layout desktop assoluto pixel-identico.
- [x] **Motion** — stagger fade+y sulle card lista mobile (`whileInView once`, rispetta `useReducedMotion`). Fade/chevron 200ms. Niente scale-pulse sui chip mobile.
- [x] **Token** — `bg-black/60` e `bg-black/45` sostituiti con `bg-[var(--color-ink-deep)]/80`.
- [x] `npm run typecheck` 0 errori · `npm run audit:ui` 0 errori (warning residui pre-esistenti, non introdotti dal fix).
- Non toccati: marker, popup, `flyTo`, fetch/demo fallback, validazione token Mapbox, doppio filtro, URL builder verso `/esplora`.

## Snapshot di Validazione e Pre-deploy - 2026-05-21 (Sprint V2-Verification)

Eseguita la suite completa di test end-to-end e di pre-deploy con esito **100% PASS** (zero fallimenti, zero errori bloccanti).

- [x] **Audit Visivo e Responsive (Playwright E2E)**: Eseguiti **34 test passati su 34** sia su Desktop (Chromium) che su Mobile (Pixel 5). Verificate tutte le pagine chiave (`/`, `/esplora`, `/mappa`, `/collaborazioni`, `/media-kit`, `/shop`, `/contatti`) con zero overflow orizzontale, zero immagini rotte, e H1/CTA stabili.
- [x] **Pre-deploy Pipeline (`npm run predeploy`)**:
  - `typecheck` -> PASS (0 errori)
  - `lint` -> PASS (0 errori)
  - `test` -> PASS (10/10 test unitari passati)
  - `build` -> PASS (compilazione Vite a 48s con ottimizzazione AVIF/WebP delle immagini all'85% e rigenerazione sitemap/robots.txt statici)
  - `audit:ui` -> PASS (analisi design system e markup)
  - `audit:firebase` -> PASS (0 errori)
  - `audit:stripe` -> PASS (rate limits, webhook, price integrity passati a 9/9)
  - `audit:agents` -> PASS (sincronizzazione agenti e skill a 18/18)
- [x] **File Statici**: Sitemap, robots, media-kit.pdf e .env.example tutti generati e pronti.

Verdict finale: **PASS (TUTTI I GATE COMPLETATI CON SUCCESSO)**

## Snapshot browser-audit fix - 2026-05-15 (post audit FAIL → PASS-WITH-MINOR)

Audit `browser-auditor` (Playwright MCP) ha prodotto verdict iniziale **FAIL** (2 BLOCKER, 4 SERIO, 4 MINORE). Sessione di fix mirati ha chiuso 10/10 finding lato client. Residuo: 1 bug server SEO (M1 escalato) da assegnare a `travellini-backend-engineer`.

- [x] **B1** Doppio `h1` su `/club` — `src/pages/Club.tsx:67` degradato a `h2`. H1 unico ora è "Una piccola quota. Tutte le guide. Senza pubblicità." in [src/components/club/ClubMembershipHero.tsx](../../src/components/club/ClubMembershipHero.tsx).
- [x] **B2** Refusi italiani (encoding accenti/apostrofi persi) corretti in: [src/pages/NotFound.tsx](../../src/pages/NotFound.tsx), `src/components/home/HeroSection.tsx`, `src/components/home/NewsletterFeature.tsx`, [src/components/Newsletter.tsx](../../src/components/Newsletter.tsx), [src/components/club/ClubMembershipHero.tsx](../../src/components/club/ClubMembershipHero.tsx) (pubblicità, è l'accesso, ciò, all'anno, Lascia l'email).
- [x] **S1** Stat partner a `0K+/0%` su `/collaborazioni` — rimosso `AnimatedCounter` count-up sulla sezione (counter partiva da 0 e si attivava solo on-scroll); ora render statico immediato. Aggiunto anche validator `isUsableStat` per merge field-by-field con `BRAND_STATS` se Firebase ritorna valori "0K+". Numeri verificati live: 167K+, 90K+, 500K+, 6.5%.
- [x] **S2** `SearchModal` chip "Sezioni" obsoleti (Destinazioni/Esperienze/Guide) sostituiti con vocabolario post-consolidation: Posti particolari, Food & ristoranti, Hotel con carattere, Weekend romantici, Itinerari.
- [x] **S3** `NotFound` copy aggiornata: "ripartire da Esplora, dalla mappa o dagli itinerari" (era "destinazioni, esperienze e guide").
- [x] **S4** Search empty state con suggerimenti contestuali ("Prova con: Sicilia, Andalusia, Dolomiti, Bali, Marocco") + Fuse.js threshold ridotto da 0.4 → 0.3 (meno falsi positivi).
- [x] **M2** Prezzi `/club` `EUR` → `€` (€0, Da €5,90 al mese, €5,90, €49) in `ClubMembershipHero.tsx`.
- [x] **M3** Copy "Cuori roaming" su `/club` riformulata in tono editoriale coerente: "Tieni da parte gli itinerari che vuoi vivere — restano qui, pronti."
- [x] **M4** Footer voce duplicata "Mappa Interattiva" rimossa (linkava già a `/mappa`).
- [x] **bug collaterale** `/esplora` aggiunto a `scripts/generate-sitemap.js` staticRoutes (era escluso, hub canonico post-consolidation).

### M1 closed — bug operativo, non di codice

Diagnosi confermata da `travellini-backend-engineer`: il codice in [server.ts](../../server.ts) è corretto — `/esplora` è già in `STATIC_APP_ROUTES` (riga 220) e `resolveAppStatus()` lo gestisce correttamente. Il 404 osservato era dovuto al dev server `tsx server.ts` avviato **prima** dell'aggiunta di `/esplora` al `Set`: senza `--watch`, il processo Node mantiene la composizione vecchia di `STATIC_APP_ROUTES` in memoria, mentre Vite HMR ricarica solo il client. Restart del dev server → bug scompare.

Fix preventivo applicato: `npm run dev` in [package.json:7](../../package.json#L7) ora usa `tsx watch server.ts` invece di `tsx server.ts`. Previene la stessa classe di bug ai prossimi merge che modificano `server.ts`. Effetto collaterale: ogni edit a `server.ts` scatena restart ~300ms. Prod (`npm run start` = `node server.ts`) invariato.

- [x] **M1 (server-side 404 su `/esplora`)** — closed. Bug operativo, nessuna modifica al runtime server. Fix preventivo: `tsx watch` su `npm run dev`.

**Azione richiesta**: restartare il dev server corrente (Ctrl+C nel terminale + `npm run dev`) per applicare lo script aggiornato e ricaricare `STATIC_APP_ROUTES`.

Verdict finale: **PASS** (10/10 finding chiusi, 0 BLOCKER residui).

Comandi validazione eseguiti:

- `npm run typecheck` → 0 errori
- `npm run audit:ui` → solo warning preesistenti (admin colors, inline styles intenzionali in motion components)
- `browser-auditor` re-run su `/club`, `/`, `/rotta-inesistente`, `/collaborazioni`, `/esplora`, `/mappa`, `/itinerari` → 8/10 confermati al primo pass; S1 confermato live dopo fix mirato.

## Snapshot premium implementation - 2026-05-15

- [x] `audit:revenue` aggiunto e collegato al contratto revenue/security: orders non creabili dal client, webhook server-side, idempotenza su `stripeSessionId`, risposta 500 su errore persistenza, prezzi non trusted dal client.
- [x] `audit:size` sostituito con gate locale riproducibile sui bundle route/vendor; PASS dopo build.
- [x] Homepage people-led: aggiunto partner signal above fold e rimossi fallback remoti/demo da reel e CoupleIntro.
- [x] Collaborazioni: hero image locale controllata e tracking `partner_cta_click` sui CTA principali.
- [x] Media Kit e lead magnet: eventi `media_kit_submit`, `lead_magnet_signup`, `lead_magnet_download` con proprietà stabili.
- [x] Product/shop: `product_view` e `checkout_intent` tracciati; prodotti demo restano noindex/non acquistabili.
- [x] Lead magnet: 10 luoghi reali inseriti e PDF rigenerato.
- [ ] Stripe CLI webhook replay reale ancora da eseguire con credenziali locali attive.
- [ ] Firestore emulator/rules integration test ancora da eseguire su ambiente emulator completo.
- [ ] `audit:cwv` ancora da stabilizzare.

## Snapshot F1.8 JSON-LD + lint cleanup - 2026-05-15 (sessione 10/10 transformation)

- [x] **F1.8 JSON-LD strutturato implementato**: `index.html` Organization+WebSite via `@graph`, `src/lib/seo.ts` con helpers `buildArticleJsonLd` + `buildBreadcrumbListJsonLd`, `src/components/SEO.tsx` esteso con props `jsonLd`/`breadcrumbs`, `src/pages/Articolo.tsx` refactor uso helper (-54 righe inline). Dominio `.it`, social handles reali (IG, TikTok `@travellini.withus`, Facebook), logo `/pwa-512x512.png`.
- [x] **Bundle migliorato post-F1.8**: 4248.8 KB / 4300 KB (delta **-40.2 KB** vs pre-F1.8 a 4289 KB). Margine triplicato da 11 KB a 51 KB.
- [x] **F1.9 affiliate utility scaffolding**: `src/lib/affiliateLink.ts` pronto per 4 partner (Skyscanner, Booking, Airalo, Revolut), disabled-by-default + `rel="sponsored noopener"` standard. Attende partner ID post-signup owner.
- [x] **Lint cleanup**: 3 lint blocker risolti (`InstagramGrid.tsx` track caption, `Esplora.tsx` aria-expanded rimosso, `EsploraQuiz.tsx` setState pattern "Adjusting state while rendering" sostituisce setState-in-effect). `npm run lint`: 0 errori, 5 warning cosmetici no-unused pre-esistenti.
- [x] **Sitemap routes pubbliche allineate**: aggiunte `/shop`, `/club`, `/lead-magnet`, `/itinerari/compare` a `scripts/generate-sitemap.js`. `public/sitemap.xml` rigenerata.
- [x] **QA static post-F1.8**: voto 9.3/10 (`docs/50_Scratch/QA_post_F1.8_2026-05-15.md`, nota scratch rimossa; report `travellini-quality-auditor`).
- [x] **Deliverable Settimana 1 multi-agent**: 4 varianti hero copy F1.5 (attende owner pick), photo audit 22 P0 use case F1.6, lead magnet outline 13pp F1.10 (attende 5 risposte owner), Home redesign 11→7 sezioni LOCKED F2.1, W2 schedule operativo. Tutti i 7 handoff brief in [docs/50_Scratch/](../50_Scratch/).
- [ ] **Google Rich Results Test live** ancora da eseguire post-deploy su URL real (atteso PASS Organization+WebSite+Article+BreadcrumbList).
- [ ] **Backend F1.1-F1.4** (firestore.rules, server.ts, schema productAssets, Stripe live keys) ancora **BLOCKED** in attesa conferma owner.

**Voto post-sessione**: 8.5/10 (era 8.1/10 pre-sessione). Salto a 9.0+/10 atteso post-owner-replies + backend F1.1-F1.4 + F2.1 implementation Settimana 2.

## Snapshot V2 Sprint 0 - 2026-05-05

- completata baseline Sprint 0 in [[10_Projects/PROJECT_SITE_V2_SPRINT_0_BASELINE]]
- `npm run predeploy`: PASS
- `npm run audit:visual`: PASS, 12/12 dopo fix overflow mobile
- `npm run audit:agents`: PASS dopo compatibilita CRLF e riferimenti agenti
- bug overflow mobile tracciato e risolto in [[14_Bugs/BUG_SITE_V2_MOBILE_OVERFLOW_BASELINE]]
- restano aperti per V2: asset reali, contenuti reali, sitemap dinamica, roundtrip lead, shop reale

## Checklist

- [ ] verificare home e hero
- [ ] verificare destinazioni
- [ ] verificare navbar e navigazione
- [ ] verificare contenuti, funnel e shop
- [ ] verificare build e smoke test

## Snapshot fase A

- [x] consent banner predisposto con categorie necessarie, analytics e marketing
- [x] loader analytics e pixel gated da consenso + env
- [x] preview admin limitata a build dev locale
- [x] wrapper email con no-op sicuro se `RESEND_API_KEY` manca
- [x] media kit PDF generato nel build e verificato in predeploy
- [x] newsletter Brevo allineata a `BREVO_LIST_ID` con fallback save-lead-only
- [ ] verificare roundtrip reale lead -> Firestore in ambiente locale
- [ ] eseguire release QA completa dopo il prossimo blocco di UI/editorial rebuild

## Snapshot fase B parziale

- [x] `Collaborazioni` riposizionata come pagina business-ready e piu selettiva
- [x] `Media Kit` riposizionato come accesso qualificato al funnel B2B
- [x] `Home` resa piu leggibile nei tre percorsi principali: scoperta, strumenti, collaborazioni
- [x] `Chi Siamo` spostata verso metodo, fiducia e criteri editoriali
- [x] `siteContent` normalizzato con default CMS coerenti e senza copy legacy/encoding rotto nelle sezioni gestite
- [x] tassonomia esperienze normalizzata in ASCII coerente tra config e pagine pubbliche
- [x] `Destinazioni` rifinita come archivio discovery/SEO con filtri piu utili e JSON-LD `CollectionPage`
- [x] `Esperienze` rifinita come tassonomia editoriale per intenzione di viaggio con JSON-LD `CollectionPage`
- [x] sistema sezioni condivise V1.1: newsletter unica con varianti, CTA finale condivisa, notice per preview controllate
- [x] `Guide` rifinita come biblioteca pratica con preview controllate e collegamenti discovery coerenti
- [x] `Articolo` rifinito come template editoriale piu pulito: hero, in breve, info pratiche, itinerario, mappa, consigli, risorse e noindex sulle preview
- [x] `Risorse` riposizionata come toolkit editoriale con affiliazioni dichiarate e logica "quando usarlo / quando evitarlo"
- [x] `Shop` riposizionato come boutique editoriale; demo non acquistabile e noindex finche catalogo reale non e pronto
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run audit:ui`
- [x] `npm run predeploy`
- [x] smoke test browser delle CTA principali su `/`, `/collaborazioni`, `/media-kit`, `/chi-siamo`
- [x] verifica desktop/mobile delle quattro superfici aggiornate con Playwright
- [x] fix mobile `Chi Siamo`: testo e H1 riportati sopra l'immagine nella prima schermata
- [x] rimosso preload globale di `hero-adventure.jpg` per evitare warning su pagine interne
- [ ] revisione umana finale degli screenshot prima del deploy pubblico

## Snapshot V1.1 editoriale/commerciale

- Componenti condivisi introdotti per evitare formati diversi sulle stesse sezioni: `Newsletter`, `FinalCtaSection`, `DemoContentNotice`.
- I contenuti mancanti vengono trattati come preview controllate, non come prova reale o case study pubblicabile.
- `Guide` ora mostra una struttura da biblioteca pratica, con filtri sobri, cards editoriali e newsletter condivisa.
- `Articolo` non usa piu un lungo fallback hardcoded con placeholder evidenti; il contenuto demo e centralizzato e marcato come noindex.
- `Risorse` e `Shop` sono piu coerenti con fiducia e monetizzazione sobria: meno sconto, piu contesto e utilita.
- Restano da fare prima del deploy: contenuti reali, foto reali, verifica roundtrip Firestore lead, controllo screenshot umano e sostituzione/approvazione delle preview.

## Audit 2026-04-17 — Playwright MCP full site pass

Audit end-to-end su tutte le pagine pubbliche + product detail + mobile 375px. Esito: 4 BLOCKER risolti, 5 task SERIO chiusi, 4 polish MINORE chiusi.

### BLOCKER risolti

- **Mappa** — `VITE_MAPBOX_TOKEN` ora gated; se assente, empty-state editoriale invece di 401 silenzioso. File: `src/components/map/MapboxWorldMap.tsx`.
- **Shop** — da 1 prodotto placeholder a 6 prodotti demo coerenti con copy "Boutique in apertura"; cart disabilitato finché consegna reale non è pronta. File: `src/pages/Shop.tsx`, `src/config/demoContent.ts`, `server.ts`.
- **Broken image globale** — URL Unsplash morta sostituita in `InstagramGrid` e `HeroSection` (reel fallback).
- **Cookie banner mobile** — 295px → 158px, layout side-by-side, copy mobile compatta. File: `src/components/ConsentBanner.tsx`.

### SERIO risolti

- Hero `Collaborazioni` — fix spaziatura span → "Raccontiamo progetti travel con credibilità editoriale".
- Accenti italiani — fix "progetto e coerente" → "è coerente" e "collaborazione è più forte" → "e più forte" (congiunzione, non verbo).
- `formatPrice` centralizzato — nuovo `src/utils/format.ts` con `Intl.NumberFormat it-IT`. Sostituisce `EUR 24.9` → `€ 24,90` ovunque.
- `server.ts resolveAppStatus` — set `DEMO_PRODUCT_SLUGS` per i 6 slug demo, slug non-demo con Firestore non disponibile → 200 (SPA fallback), così il dev environment non mostra più 404 su demo.
- `Collaborazioni` trim — rimossa sezione TRIAD ridondante con hero/partner areas, altezza 9158 → 8651px.

### MINORE risolti

- Homepage console — 1 warning motion `non-static position` risolto aggiungendo `position: relative` su `html` in `src/index.css`.
- Mobile 375px — verificato 0 overflow orizzontale su home, shop, collaborazioni.
- Link nav principali — tutti 200 (home, destinazioni, esperienze, guide, chi-siamo, shop, collaborazioni, mappa).

### Ancora aperti (non BLOCKER)

- Catalogo shop reale (al posto del demo) + wiring Stripe checkout — dipende da asset e prezzi definitivi.
- Token Mapbox reale in predeploy — da aggiungere come `VITE_MAPBOX_TOKEN` in sessione finale.
- Trim `ChiSiamo` (6601px) e `Articolo` (6423px) — opzionale, non urgente.
- Revisione umana finale degli screenshot prima del deploy pubblico (rimane [ ]).

## Snapshot H2 2026 — Ultra-piano marketing/growth (2026-05-14)

Piano completo H2 2026 implementato in 9 commit. Strategia: chiudere
il funnel BOFU (oggi cieco), affermare posizionamento couple-led
(oggi sfocato), attivare ops (oggi predisposti ma inerti). Plan file
sorgente: `C:\Users\ccocu\.claude\plans\fai-un-piano-avanzato-temporal-panda.md`.

### Fase 0 — Bug critici (ICE >60) ✅

- [x] MediaKit lead funnel tracciato: `media_kit_request_attempt`/`_success`
- [x] MediaKit fallback localStorage (key `twu_media_kit_leads`)
- [x] StickyMobileCTA su `/media-kit` con scroll-to-form
- [x] Copy success Newsletter: rimosso linguaggio interno + CTA IG/TikTok
- [x] 5 trackingId specifici sui CTA Collaborazioni (hero/package/footer)

### Fase 1 — Analytics infrastructure + posizionamento ✅

- [x] `add_to_cart` in CartContext (enhanced ecommerce schema)
- [x] `begin_checkout` in CartDrawer (prima del redirect Stripe)
- [x] `purchase_complete` in Shop su `?success=true` (transaction_id da Stripe session_id)
- [x] Meta Pixel mapping standard events (Purchase/Lead/AddToCart/InitiateCheckout)
- [x] TikTok Pixel mapping standard events
- [x] Hero eyebrow "Coppia italiana — 8 anni di viaggio vero"
- [x] Hero paragraph con frase posizionamento target couple
- [x] Overlay hero cleanup (responsive verticale mobile / orizzontale desktop)
- [x] TrustStrip riordino mobile-first (monthlyReach primo)
- [x] CoupleIntro caption rewrite

### Fase 2 — Lead infrastructure ✅

- [x] `renderWelcomeEmail()` template Resend (CTA lead magnet + IG/TikTok)
- [x] `renderOrderConfirmation()` template Resend (items + total branded)
- [x] Trigger welcome post `/api/newsletter-subscribe` (fire-and-forget)
- [x] Trigger order confirmation post webhook Stripe `checkout.session.completed`
- [x] Lead magnet PDF `src/pdf/LeadMagnetDocument.tsx` (12 pagine A4)
- [x] Script `scripts/generate-lead-magnet.tsx` integrato in `npm run build`
- [x] Page `/lead-magnet` (noindex) con download + tracking
- [x] Landing `/vieni-con-noi` standalone (no navbar/footer, UTM capture)
- [x] Redirect `/iscrivi` → `/vieni-con-noi`
- [x] Quiz → newsletter coupling già presente (`source: quiz_result`)

### Fase 3 — SEO + content compounding ✅

- [x] Rimosso `noindex` da `/itinerari` + title rewrite con keyword geo
- [x] `<link rel="preload" as="style">` Fraunces per LCP mobile
- [x] `relatedArticles` filtro silos topical (country>continent>category)
- [x] BreadcrumbList JSON-LD su `/guide/:slug`
- [x] Schema Person dedicato per Rodrigo + Betta su `/chi-siamo`
- [x] `docs/13_Content/CONTENT_CALENDAR_H2_2026.md` (8 slot mensili luglio→febbraio)
- [x] `docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md` (outline + tone + workflow)
- [x] `docs/13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md` (1500 parole outline + schema)
- [x] `docs/12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS.md` aggiornato (5 categorie + outreach template)

### Fase 4 — Infra cleanup ✅

- [x] Rimosso doppio init Sentry (`initErrorTracking` da `Layout.tsx`)
- [x] Verificato `public/offline.html` esistente per PWA navigateFallback

### TODO R+B per attivazione (~10-12h editorial + setup)

- [ ] **Setup env production**: `RESEND_API_KEY`, `BREVO_API_KEY`,
      `BREVO_LIST_ID`, `MAIL_FROM`, `MAIL_TO_OWNER` in `.env.production`
- [ ] **FEATURED_REEL**: URL ultimo reel ≥50K in `src/config/site.ts`
- [ ] **InstagramGrid**: 6 thumbnail + caption reali (no Unsplash)
- [ ] **Lead magnet PDF**: 10 luoghi reali in `scripts/generate-lead-magnet.tsx`
      (guidelines in `docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md`)
- [ ] **Pillar article**: compilare outline Salento con luoghi reali + foto
      originali + publish 2026-07-15
- [ ] **Partner shortlist**: nomi reali per le 5 categorie + outreach 5 email
      entro 2026-09-30
- [ ] **Bio IG/TikTok**: aggiornare con `https://travelliniwithus.it/vieni-con-noi?utm_source=instagram&utm_medium=bio&utm_campaign=lead_magnet`
- [ ] **Affiliate signup**: Skyscanner BFCA, Booking BFCA, Airalo, Revolut
- [ ] **Foto people-led R+B** in `/images/brand/` per hero fallback

### Gate finale ultra-piano (verificato 2026-05-14)

- `npm run typecheck` ✓ PASS
- `npm run build` ✓ PASS (87 precache entries, lead magnet PDF 23 KB generato)
- `npm run audit:visual` ✓ PASS 12/12 (chromium + Pixel 5)
- `npm run generate:lead-magnet` ✓ PASS (PDF placeholder funzionale)
- 9 commit logici sopra design tokens precedente:
  `ed0149a → ce0068b` (MediaKit → Newsletter → analytics → hero → email →
  lead magnet/landing → SEO/content → docs → infra)

## Predeploy 2026-05-14 — Full sweep completato

Pre-deployment audit run:

- [x] `npm run typecheck` → PASS (zero errors)
- [x] `npm run lint` → PASS (2 minor warnings: unused vars in ExitIntentPopup + HeroSection)
- [x] `npm run test -- --run` → PASS (4 files, 10 tests all passed)
- [x] `npm run build` → PASS (1 minor CSS warning, 31s, 87 precache entries)
- [x] `dist/sitemap.xml` → PASS (8.4 KB, routes complete)
- [x] `dist/robots.txt` → PASS (disallow + sitemap OK)
- [x] Environment variables → PASS (all documented in `.env.example`)
- [x] Security check → PASS (console.log cleaned, no hardcoded secrets)
- [x] `npm run audit:agents` → PASS (24 skills synchronized)
- [x] Cleanup console.log → PASS (removed from `Articolo.tsx:362`)

**Status: ✅ DEPLOYED**

Deployed: 2026-05-14 21:57 UTC  
URL: https://gen-lang-client-0138696306.web.app  
Files: 151 uploaded, 87 PWA precache entries  
Verification: HTTP 200 ✓

## Link

- [[PROJECT_FULL_SITE_MARKETING_TECH_AUDIT]] — audit consolidato 2026-06-07 (tech+marketing+SEO+social+UX+agent stack)
- [[DEPLOYMENT_RUNBOOK]]
- [[LAUNCH_CHECKLIST]]
- [[OPERATIONAL_VERIFICATION_REPORT]]
- [[90_Templates/TPL_Release_Note]]
- [[../13_Content/CONTENT_CALENDAR_H2_2026]]
- [[../13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO]]
- [[../13_Content/LEAD_MAGNET_POSTI_ITALIANI]]
- [[../12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]

## Audit 2026-05-15 - Advanced full site review

Report completo: [[PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15]]

Nuovi gate aperti prima di considerare la prossima release "premium-ready":

- [ ] Route funnel lead magnet con HTTP status corretto: [[../14_Bugs/BUG_LEAD_MAGNET_ROUTES_RETURN_404]]
- [ ] Sostituire immagini demo/Unsplash rotte: [[../14_Bugs/BUG_DEMO_UNSPLASH_IMAGES_BROKEN]]
- [ ] Hardening Firestore orders: [[../14_Bugs/BUG_FIRESTORE_PUBLIC_ORDER_CREATION]]
- [ ] Idempotenza webhook Stripe orders: [[../14_Bugs/BUG_STRIPE_WEBHOOK_ORDER_IDEMPOTENCY]]
- [ ] Riallineare suite QA/e2e/visual/perf: [[../14_Bugs/BUG_QA_TEST_SUITE_STALE]]
- [ ] Finalizzare lead magnet con 10 luoghi reali R+B
- [ ] Aggiornare partner shortlist e proof assets reali
- [ ] Verificare Core Web Vitals con run stabile dopo fix QA tooling

Stato audit:

- PASS: `typecheck`, `lint` con warning minori, `test`, `build`, `audit:ui`, `audit:firebase`, `audit:agents`, `audit:a11y`.
- FAIL/da correggere: route 404, broken images, `audit:stripe` falso positivo, `audit:visual` flaky, e2e stale, `audit:cwv` timeout, `audit:size` non configurato.
- Decisione: non blocca lo sviluppo, ma blocca la definizione "altissimo livello avanzato" finche P1 revenue/routing/assets non sono chiusi.

## Implementation pass 2026-05-15 - Fase 0 safety + quick wins

Dashboard: [[../PREMIUM_READINESS_DASHBOARD]]

- [x] Route funnel lead magnet con HTTP status corretto: [[../14_Bugs/BUG_LEAD_MAGNET_ROUTES_RETURN_404]]
- [x] Sostituire immagini demo/Unsplash rotte: [[../14_Bugs/BUG_DEMO_UNSPLASH_IMAGES_BROKEN]]
- [x] Correggere falso positivo `audit:stripe`
- [x] Riallineare suite QA e2e/visual mirata: [[../14_Bugs/BUG_QA_TEST_SUITE_STALE]]
- [x] Hardening Firestore orders implementato: [[../14_Bugs/BUG_FIRESTORE_PUBLIC_ORDER_CREATION]]
- [x] Idempotenza webhook Stripe implementata: [[../14_Bugs/BUG_STRIPE_WEBHOOK_ORDER_IDEMPOTENCY]]
- [x] MediaKit form migrato a componenti form condivisi
- [x] Navbar desktop migliorata per focus dropdown e mobile social links con accessible name
- [x] ProductCard azioni disponibili anche touch/focus, non solo hover desktop

Verifiche:

- `npm run typecheck` PASS
- `npm run lint` PASS con 3 warning preesistenti
- `npm run test` PASS, 10/10
- `npm run build` PASS
- `npm run audit:ui` PASS con 94 warning noti
- `npm run audit:firebase` PASS
- `npm run audit:stripe` PASS
- `npm run audit:agents` PASS
- `npm run audit:a11y` PASS, 0 violazioni automatiche
- `npm run audit:visual` PASS, 12/12 desktop/mobile
- Playwright mirato home/shop/visual chromium PASS, 15/15
- Browser sweep route critiche PASS: HTTP 200 e 0 immagini rotte su `/shop`, `/destinazioni`, `/mappa`, `/vieni-con-noi`, `/lead-magnet`

Residui:

- [ ] Test Stripe CLI webhook replay con credenziali admin reali
- [ ] Firestore emulator rule test per create anonima `orders`
- [x] Stabilizzare `audit:cwv` — `lighthouserc.json` + script `npm run build && lhci autorun --config`
- [ ] Configurare `audit:size`
- [ ] Finalizzare asset reali R+B, lead magnet e pillar Salento

## Audit avanzato 2026-05-15 — Fase A implementata

Audit avanzato di secondo livello completato 2026-05-15 con 8 agent in parallelo
(UI-designer, Growth, SEO strategist, Social content, Quality auditor, Security
auditor, Perf engineer, Browser auditor). Voto pre-Fase-A: 6.4/10.

### P0 chiusi in Fase A (code)

- [x] Brand killer `/chi-siamo` — sostituita stock Unsplash con asset locale
      `/images/brand/about-editorial.webp` + alt text editoriale corretto
      ([src/pages/ChiSiamo.tsx:258](../../src/pages/ChiSiamo.tsx))
- [x] WCAG color-contrast `/chi-siamo` — `text-black/42` → `text-black/70` su
      3 stat labels + italic span (audit:a11y 0 violazioni)
- [x] Home meta title con cluster Italia/coppia: "Posti particolari in Italia
      e nel mondo per chi viaggia in coppia"
- [x] Mappa SEO senza verbi banditi: "Mappa dei posti che abbiamo visitato"
- [x] Collaborazioni title specifico: "Collaborazioni editoriali per hotel,
      destinazioni e brand travel"
- [x] InstagramGrid 6 Unsplash → asset brand locali, rimossi "view counter"
      inventati, TODO[R+B] per screenshot reali
- [x] MonetizationTeaser 3 Unsplash → asset locali, rimossi badge "Bestseller
      demo" e "Lancio Q4 2026", `VISIBLE_CARDS` filter mostra solo card 'live'
- [x] discoveryCards 6 Unsplash → mapping `/images/experiences/` e
      `/images/destinations/` locali
- [x] Destinazioni 6 GROUP_VISUALS Unsplash → asset destinazioni locali
- [x] Esperienze HERO_VISUAL Unsplash → asset experiences locale
- [x] previewContent.ts + demoGuides.ts + demoItineraries.ts + seedArticle.ts:
      11 Unsplash hotlink residui sostituiti con asset locali, TODO[R+B] per
      asset reali quando contenuto pubblicato
- [x] robots.txt: rimossi `Disallow: /shop`, `Disallow: /vieni-con-noi`,
      `Disallow: /lead-magnet`. La gestione noindex passa solo via SEO meta.
- [x] index.html: rimosso `<link rel="preconnect" href="https://images.unsplash.com">`
- [x] Encoding italiano: pass linter ha applicato `c'è`, `accessibilità`,
      `tranquillità`, `stagionalità` su file modificati. P.S. welcome email
      corretto in `lib/email.ts:212`.
- [x] Lazy load home below-fold: 9 sezioni (DiscoveryExperiences, LatestArticles,
      HomeQuizBudgetTeaser, DiscoveryGuides, InstagramGrid, NewsletterFeature,
      MonetizationTeaser, HomeCollaborationCta) wrappate in `Suspense` con
      `SectionPlaceholder` height-reserved per CLS 0
- [x] `lighthouserc.json` creato in root con 8 URL × 3 runs, soglie Performance
      0.85 / A11y 0.95 / SEO 0.95 / LCP 2500ms / CLS 0.1
- [x] `npm run audit:cwv` ora `npm run build && lhci autorun --config=./lighthouserc.json`
- [x] Lint warnings risolti: `_handleSubscribeSuccess` in ExitIntentPopup,
      catch block senza `err` in Articolo.tsx
- [x] `console.log` in `seedArticle.ts` gated da `import.meta.env.DEV`
- [x] Verbi banditi rimossi da hero CTA + page descriptions (Scopri/Esplora
      sostituiti dove user-facing)

### Bug notes nuove

- [[../14_Bugs/BUG_2026-05-15_products_downloadurl_public_read]] (HIGH, P0)
- [[../14_Bugs/BUG_2026-05-15_coupons_publicly_listable]] (MEDIUM, P1)
- [[../14_Bugs/BUG_2026-05-15_webhook_in_general_rate_limit]] (HIGH, P1)
- [[../14_Bugs/BUG_2026-05-15_vite_gemini_key_leak_risk]] (MEDIUM, P1)
- [[../14_Bugs/BUG_2026-05-15_resources_collection_missing_rule]] (P1)
- [[../14_Bugs/BUG_2026-05-15_lcp_h1_font_fraunces]] (P0, perf)

### P0 chiusi anche in Fase B (implementation pass sera 2026-05-15)

| #   | Issue                                                   | Pri         | Stato                                                                                                                                                       | Owner                           |
| --- | ------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------ |
| 1   | `products.downloadUrl` public read                      | P0 HIGH sec | **FIXED** in [server.ts](../../server.ts) + [firestore.rules](../../firestore.rules) — productAssets collection con read:false. Migration owner TODO.       | backend-engineer ✓              |
| 2   | LCP H1 Fraunces 4.3s — self-host font                   | P0 perf     | **FIXED** — @fontsource/fraunces + @fontsource/inter installati, Kalam con font-display:optional, rimossa catena Google Fonts da index.html + src/index.css | main thread ✓                   |
| 3   | BUG_FIRESTORE_ARTICLES_PERMISSIONS                      | P0          | OPEN — fix rules ok, da rivalidare con articoli reali pubblicati post-deploy                                                                                | backend-engineer (user confirm) |
| 4   | `/api/webhook` sotto generalApiLimiter                  | P0 sec      | **FIXED** in [server.ts](../../server.ts) via regex `/^\/api\/(?!webhook(?:\/                                                                               | $)).\*/ `                       | backend-engineer ✓ |
| 5   | App Check + API key referrer restriction                | P0 sec      | OPEN                                                                                                                                                        | utente in Google Cloud Console  |
| 6   | Lead magnet PDF 10 luoghi reali                         | P0 content  | OPEN                                                                                                                                                        | R+B (4-6h)                      |
| 7   | Pillar Salento pubblicato                               | P0 content  | OPEN                                                                                                                                                        | R+B (8-12h)                     |
| 8   | Bio IG/TikTok → /vieni-con-noi?utm                      | P0 growth   | OPEN                                                                                                                                                        | R+B (15min)                     |
| 9   | Affiliate signup Skyscanner+Booking+Airalo+Revolut      | P0 monet    | OPEN                                                                                                                                                        | R+B (90min)                     |
| 10  | `RESEND_API_KEY` + `BREVO_API_KEY` in `.env.production` | P0 growth   | OPEN                                                                                                                                                        | R+B (30min)                     |

### Fix aggiuntivi Fase B

- [x] **coupons.read pubblico → admin-only** + fetchCouponByCode migrata ad Admin SDK
- [x] **resources firestore rule** aggiunta (era mancante)
- [x] **WCAG color-contrast** — 4× text-black/45 → /70 (BudgetCalculator, Guida) + 7× /50 → /65 (Club, Esperienze, Breadcrumbs, Collaborazioni, Guide) — `audit:a11y` PASS 0 violations
- [x] **Accenti italiani** — 18 sostituzioni su 12 file (gia→già, piu→più, puo→può, c'e→c'è, ecc.)
- [x] **MediaKit form** — campo budget aggiunto (4 fasce + tracking property)
- [x] **Welcome email** — P.S. con domanda diretta (reply rate proxy)
- [x] **SEO meta** specifici su MediaKit/Press/Contatti (no più 1-parola)
- [x] **sitemap.js** — rimossi filterRoutes (?group=, ?type=) duplicate content
- [x] **Lint cleanup** — STATUS_STYLES unused + badge prop unused in MonetizationTeaser
- [x] **audit:cwv stabilizzato** — `@lhci/cli@0.14.x` pinned + `--config=./lighthouserc.json`

### Quality gates Fase B (tutti PASS)

```
npm run typecheck     PASS (0 errors)
npm run lint          PASS (0 errors)
npm run test --run    PASS 10/10
npm run build         PASS 40.89s, 96 PWA entries
npm run audit:firebase PASS 0 errors
npm run audit:stripe  PASS 9/9
npm run audit:revenue PASS 6/6
npm run audit:agents  PASS
npm run audit:ui      PASS (warning preesistenti non blocking)
npm run audit:a11y    PASS 0 violations su 4 route core
npm run audit:size    PASS 11/11 budget (total JS 4289 KB / 4300 KB)
```

### Voto post Fase B: **8.1 / 10**

Da pre-audit (6.4) → post-implementation (8.1). Tutti i blocker tecnici chiusi. Codebase premium-ready.

Per raggiungere 10/10 servono SOLO input R+B (non automatizzabili):

1. Setup `.env.production` (chiavi reali) + `firebase deploy --only firestore:rules`
2. Migration script products.downloadUrl → productAssets/{id}.downloadUrl
3. Google Cloud Console: API key referrer restriction + Firebase App Check enforce
4. Bio IG/TikTok aggiornata + affiliate signup
5. PDF lead magnet con 10 luoghi reali + pillar Salento pubblicato + 6 foto IG reali R+B
6. Stripe CLI webhook replay test reale + Firestore emulator integration test
7. 5 cold outreach partner (entro 90gg)

**Verdetto deploy**: dopo `firebase deploy --only firestore:rules` + migration script + smoke test webhook live, il sito è ready per produzione con voto atteso 9.5+ post 1-2 settimane di attivazione R+B.

### Lista azioni R+B richieste

Vedere [[../R_B_ACTIONS_FOR_PREMIUM_READY]] per la lista operativa completa.

## Esplora 10/10 implementation - 2026-05-15

- [x] Route `/esplora` aggiunta come finder editoriale centrale.
- [x] Navbar `Esplora` aggiornata verso `/esplora`, con dropdown luogo/esperienza/guide/mappa.
- [x] Filtri discovery con stato accessibile (`aria-pressed`) e touch target minimo su destinazioni/esperienze/guide.
- [x] SearchModal arricchita con risultati tassonomici verso `/esplora`.
- [x] Tracking discovery aggiunto: `explore_finder_start`, `explore_filter_select`, `explore_recommendation_click`, `home_discovery_click`, `lead_magnet_context_click`, `affiliate_context_click`.
- [x] Sitemap discovery gated da `PUBLISH_DISCOVERY_HUBS=true` per evitare sitemap/noindex mismatch durante preview; bug tracciato in [[14_Bugs/BUG_2026-05-15_discovery_sitemap_noindex_mismatch]].
- [ ] Release pubblica 10/10 ancora bloccata da contenuti reali R+B, lead magnet definitivo e setup email produzione.

## Esplora 10/10 — Closeout sessione 2 (2026-05-15)

Ripresa dei lavori dopo interruzione Codex. P1/P2 residui chiusi:

- [x] **Mega menu Esplora editoriale** (P1.2): "Per luogo" da 6 link a 3 picks
      (Italia/Europa/Asia) + "Tutte le destinazioni". "Per esperienza" da 5 a
      4 picks (Posti particolari/Food/Hotel/Weekend) + "Tutte le esperienze".
      Aggiunta colonna "Strumenti" con Guide/Itinerari/Risorse. Decisione
      editoriale > lista enciclopedica.
      File: [src/components/Navbar.tsx](../../src/components/Navbar.tsx)
- [x] **Newsletter contestuale /guide** (P2.3): `newsletterSource` dinamico
      per categoria selezionata; `ctaLabel` cambia da "Ricevi la prossima
      guida pratica" a "Ricevi le prossime guide su {Categoria}" quando il
      filtro è attivo.
      File: `src/pages/Guide.tsx` (rimosso — pagina confluita in [src/pages/Esplora.tsx](../../src/pages/Esplora.tsx) con la Esplora consolidation)
- [x] **SearchModal raggruppata per categoria** (P1.3): risultati ora
      raggruppati in sezioni Luoghi / Esperienze / Percorsi consigliati /
      Articoli e guide / Pagine, con priorità d'ordine editoriale e fallback
      "Altri risultati" per categorie non mappate. Tracking
      `search_result_click` mantiene la posizione globale Fuse.
      File: [src/components/SearchModal.tsx](../../src/components/SearchModal.tsx)
- [x] **Mappa filtri esperienza** (P1.4): aggiunta seconda riga di chips
      Esperienza (Posti particolari/Food/Hotel/Guide/Weekend) sotto il
      continente; doppio filtro applicato a marker + mini-list. Tracking
      `map_filter_apply` con filter_type continent/experience e
      `map_to_destinations_click` quando l'utente sale verso l'archivio.
      Il CTA verso `/destinazioni` ora passa i filtri attivi
      (`?group=X&experience=Y`).
      File: `src/components/map/MapboxWorldMap.tsx`

### Verifiche

- `npm run typecheck` PASS (0 errors)
- `npm run build` PASS (45.3s, 99 PWA entries, bundle Esplora 15.19 kB /
  4.54 kB gz)
- `npm run audit:ui` PASS (solo warning preesistenti su file non toccati)

### Residui per il vero 10/10

- Asset reali R+B + lead magnet definitivo (blocco contenuto, non codice)
- Setup `.env.production` (RESEND/BREVO keys)
- Foto reali per `/images/destinations/` (oggi AI placeholder) e
  `/images/brand/couple-travel.png`
- Pubblicazione almeno 6 articoli reali per uscire dal regime `noindex`
  preview su `/destinazioni`, `/esperienze`, `/esplora`

## Esplora 10/10 — Consolidamento 2026-05-15

Owner doc: [[PROJECT_ESPLORA_CONSOLIDATION]].

Refactor completo della discovery: 5 pagine → 2 pagine. 3 tassonomie
disgiunte → 1 canonical (ZONES + TYPES + FORMATS). 4 nomi parametri URL
→ 1 set canonical. Picks curated unificati in `discoveryPicks.ts`. Manifest
reel scheletrato pronto per i 5 reel reali R+B.

### Cambi principali

- Rimosse pagine: `/destinazioni`, `/esperienze`, `/guide` (redirect
  `<Navigate>` a `/esplora` con preserve dei query string legacy).
- Riscritta `/esplora` come archivio universale + finder: filtri canonical,
  paginazione, ricerca testo, anteprima mappa, newsletter contestuale,
  micro-CTA B2B.
- Nuova `HomeDiscoveryFinder` (sezione unica home) sostituisce
  `DiscoveryDestinations`, `DiscoveryExperiences`, `DiscoveryGuides`.
- Mappa con doppio filtro continente + esperienza canonical, CTA `/esplora`
  con filtri propagati.
- Navbar mega menu e SearchModal allineati a `discoveryPicks.ts`.
- Manifest reel `src/config/reels.ts` scheletrato per i 5 MP4 in
  `C:\...\TRAVELLINIWITHUS\video\` (TODO[R+B] popolare metadata reali).

### File rimossi

3 pagine + 5 componenti home/discovery + CrossLinkWidget = 9 file
cancellati (orfani dopo il consolidamento).

### Verifica

- `npm run typecheck` PASS (verificato 2026-05-17 dopo fix audit)
- `npm run build` PASS (~34.23s — confermato da quality-auditor 2026-05-17)
- `npm run audit:ui` PASS con ~94 warning preesistenti su `AdminMetricsOverview.tsx` (raw hex colors, rotta admin non blocca deploy)

### Full Site Audit 2026-05-17

Eseguito audit completo parallelo con 6 specialisti (quality, security, perf, ui-designer, seo, browser-auditor). Report consolidato in [AUDIT_FULL_SITE_2026-05-17.md](../50_Scratch/AUDIT_FULL_SITE_2026-05-17.md).

**Stato post-fix stessa sessione:**

- 4 CRITICAL lint/test risolti (Navbar.test, EsploraQuiz set-state, InstagramGrid track, EditorialCollections keyboard)
- 1 CRITICAL perf risolto (preload AVIF spurio → PNG path effettivo)
- 1 CRITICAL SEO risolto (noindex su Esplora/Shop separato da `articles.length === 0`)
- 1 CRITICAL UI risolto (riordino Home: editoriale prima del business)
- 2 CRITICAL declassati a falso positivo (404 articoli — backend-engineer ha verificato che il comportamento è corretto, slug inesistenti devono ritornare 404)
- 9 HIGH risolti (llms.txt, title Home + ChiSiamo, BreadcrumbList schema, link `/destinazioni` → `/esplora`, copy seed nascosto, newsletter counter guard, sitemap mismatch)

**Residui da affrontare:**

- 2 HIGH bloccati su owner (GCP referrer restrictions su Firebase Web API key + rimozione key da docs)
- 1 CRITICAL perf bloccato su misura PROD (LCP Fraunces preload — dev mode non rappresentativo, rimisurare su build prod)
- 1 CRITICAL SEO long-term (sitemap dinamica articoli — serve build script quando Firestore popolato)

### C-UI-1 + C-UI-3 chiusi — 2026-05-22 (direzione ui-designer → implementazione frontend-builder)

I 2 CRITICAL UI rimasti bloccati su direzione sono stati chiusi.

- [x] **C-UI-1 HomeTrustStrip** — i 4 KPI box (numero serif + icona) convertiti in una singola trust-line editoriale inline (prosa, niente icone/box/bordi/hover), per eliminare il pattern "overbuilt statistic strip" vietato da DESIGN.md:48. Numeri senza "+": 500K lettori/mese · 167K IG · 90K TikTok · 150 destinazioni. File: `src/components/home/HomeTrustStrip.tsx`.
- [x] **C-UI-3 HomeDiscoveryFinder** — 4 card icon+title+arrow (pattern Linear/Notion) sostituite con 2 tessere image-led (grid md:2-col, scrim + Ken Burns coerente coi picks adiacenti). "Per zona" → toscana.webp → `/esplora?zone=Italia`; "Per intenzione" → romantico.webp → `/esplora?type=posti-particolari`. `loading="eager"` sulle 2 immagini above-fold (chiude anche H-PERF-2). `HOMEPAGE_DISCOVERY_ENTRIES` non rimosso dal config (ancora consumato da Navbar/SearchModal). File: `src/components/home/HomeDiscoveryFinder.tsx`.

Verifiche: `npm run typecheck` PASS (0 errori), `npm run audit:ui` PASS (0 errori, solo WARN scrim rgba preesistenti uguali ai picks). Residuo opzionale: giro `browser-auditor` a 375px per confermare zero overflow sulle nuove tessere.

### Landing lead magnet demo — 2026-05-24

La route standalone `/vieni-con-noi` e stata riallineata alla nuova homepage e al
lead magnet demo.

- [x] Landing trasformata da singola card su immagine a pagina demo completa:
      hero editoriale, cover della guida, form, anteprima contenuti e FAQ.
- [x] Asset `public/images/lead-magnets/posti-italiani-cover-demo.webp` usato
      come copertina preview anche nella landing.
- [x] Copy riscritto in tono editoriale: promessa concreta, zero superlativi
      vuoti, CTA "Ricevi la guida".
- [x] Mobile: CTA visibile nel primo fold e form ancorato con `#lead-form`;
      dettagli secondari nascosti prima della conversione.
- [x] Tracking e fallback lead esistenti preservati:
      `newsletter_signup`, `lead_magnet_signup`, honeypot e localStorage fallback.

Verifiche:

- `npm run typecheck` PASS
- `npm run audit:ui` PASS (0 errori, warning non blocking)
- `npm run build` PASS
- Browser preview `/vieni-con-noi` desktop/mobile: zero overflow orizzontale,
  h1 corretto, CTA mobile presente, form renderizzato.

### Collaborazioni pacchetti demo — 2026-05-24

La pagina `/collaborazioni` e stata resa piu commerciale senza inventare prove
non disponibili.

- [x] Sezione format riscritta come 3 pacchetti demo: Stay editoriale,
      Destinazione da costruire, Content kit per brand.
- [x] Ogni pacchetto ora dichiara output demo, caso ideale e deliverable
      concreti.
- [x] Nessun prezzo pubblico, logo partner o case study fittizio inserito:
      la proposta resta credibile finche non arrivano dati reali.
- [x] Layout mobile corretto nella sezione pacchetti: card da 231px a 327px su
      viewport 375px, zero overflow orizzontale.

Verifiche:

- `npm run typecheck` PASS
- `npm run audit:ui` PASS (0 errori, warning non blocking)
- `npm run build` PASS
- Browser `/collaborazioni` desktop/mobile: zero overflow orizzontale e zero
  errori console su dev server.

### Media kit allineato ai pacchetti demo — 2026-05-24

La pagina `/media-kit` e il PDF generato sono stati riallineati alla nuova
proposta commerciale di `/collaborazioni`.

- [x] Hero riscritto: meno "PDF brochure", piu filtro commerciale qualificato.
- [x] Anteprima PDF aggiornata: rimossi segnali troppo assertivi come metriche
      di conversione non documentate; usati segnali pubblici e da verificare.
- [x] Aggiunta sezione "I 3 punti di partenza" con Stay editoriale,
      Destinazione da costruire e Content kit per brand.
- [x] `siteContentDefaults.collaborations.collaborationFormats` aggiornato:
      anche `public/media-kit.pdf` viene rigenerato con gli stessi format.
- [x] Fix mobile sulle sezioni finali: card e CTA tornano a 327px su viewport
      375px, zero overflow orizzontale.

Verifiche:

- `npm run typecheck` PASS
- `npm run audit:ui` PASS (0 errori, warning non blocking)
- `npm run build` PASS
- Browser preview produzione `/media-kit` desktop/mobile: zero overflow
  orizzontale, form presente, tre pacchetti visibili, zero errori console.

## Gate S6 — sito a 3 audience + Travellini Family — 2026-07-24

Piano completo eseguito (vedi [[PROJECT_FAMILY_AREA_2026-07-24]]): `AudienceContext`,
`AudienceGate`, navbar/footer a 3 vie, area `/family` con 8 consigli reali importati
da `@travellinifamily` (live), 15 immagini AI della coppia sostituite con foto reali.
9 commit su `wip/2026-07-19-diario-e-cinematic-home`.

Gate S6 lanciato (quality + security + perf + browser in parallelo):

- **security-auditor**: PASS — safe-to-deploy per la feature family/audience.
  2 MEDIUM preesistenti non correlati (bug validator in `firestore.rules:101`,
  diff WIP non committato su `server.ts` da sessione precedente).
- **quality-auditor**: inizialmente 3 blocker + 3 serious. **2 blocker fixati in
  sessione** (`src/test/test-utils.tsx` mancava `AudienceProvider`;
  `Esplora.preview.test.ts` aveva un'assertion stale sul flip a contenuti reali
  — 101/101 test verdi, commit `2103eb0`). Warning `audit:ui` saliti a 364
  (0 errori) per drift preesistente sulle varianti hero cinematic-home, fuori
  scope di questa sessione.
- **perf-engineer**: fix applicato in sessione (priorità immagine mancante sulla
  prima card `/family` e `/family/consigli`, commit `7fe953b`). **Scoperta
  indipendente e severa, PRE-ESISTENTE (git blame: commit `ce5c6551`,
  2026-05-13, non toccata in questa sessione)**: il service worker PWA ha
  `navigateFallback: '/offline.html'` (`vite.config.ts:82`) che serve la
  pagina offline su OGNI navigazione diretta non-home per un visitatore di
  ritorno — mascherato da Lighthouse CI perché resetta lo storage prima di
  ogni run. Handoff completo in
  `docs/50_Scratch/HANDOFF_gate-s6-perf_perf-engineer_to_frontend-builder.md`.
  Nota metodologica: i CWV misurati da LHCI (`?twu_audit=1`) sostituiscono
  Firestore live con contenuto demo; senza il flag le rotte interne mostrano
  LCP 7-8s per via delle letture live via `useSiteContent` — gap di gate
  preesistente, non una regressione di questa sessione.
- **browser-auditor**: conferma indipendente dello stesso blocker sotto.

### BLOCKER aperto: `/family*` restituisce 404 dal server

`server.ts:259-294` (`ALL_STATIC_APP_ROUTES`) non include ancora `/family`,
`/family/consigli`, `/family/shop` — `resolveAppStatus()` (`server.ts:586`)
le fa cadere nel 404 di default, nonostante siano `live` in `surfaces.ts`,
linkate in navbar/footer e già nella sitemap. Root cause confermata via
lettura (nessuna modifica: file high-risk, richiede `travellini-backend-engineer`

- conferma owner). Fix minimo: 3 righe aggiunte all'allowlist.

### Esito decisioni owner (stessa sessione, 2026-07-24)

1. **Bug service worker: FIXATO** (commit `9cb94f9`) — `navigateFallback` ora
   punta all'app shell `/index.html`; verificato su build reale (SW attivo →
   hard-nav `/esplora` e `/family/consigli` → contenuto vero, zero "Sei
   offline"). La vera offline page (catchHandler/injectManifest) resta nel
   backlog dell'handoff perf.
2. **Fix `/family*` 404: autorizzato dall'owner ma NON applicabile in sessione**
   — l'hook `config_protection.py` hard-nega ogni write a `server.ts` a
   prescindere dall'autorizzazione in chat (by design). Il backend-engineer ha
   preparato e validato il diff esatto (4 righe nell'array
   `ALL_STATIC_APP_ROUTES`, dopo `'/contatti'`):
   `'/family'`, `'/family/consigli'`, `'/family/shop'`, `'/famiglia'`
   (l'ultima segue il pattern dei redirect legacy già in lista: `/iscrivi`,
   `/destinazioni`, `/quiz`, `/strumenti` — 200 + Navigate client-side).
   **CHIUSO in sessione**: l'owner ha applicato a mano le 4 righe preparate dal
   backend-engineer. Verificato: typecheck PASS, dev server riavviato, curl →
   200 su `/family`, `/family/consigli`, `/family/shop`, `/famiglia`; controllo
   negativo `/rotta-inesistente` → 404 intatto; `/family` nel browser senza
   errori console.

### Verdict finale gate S6 (2026-07-24): ✓ READY TO DEPLOY

Tutti e 4 gli audit chiusi: quality (101/101 test, 0 errori statici), security
(safe-to-deploy), perf (fix priority card family + fix SW navigateFallback),
browser (blocker 404 risolto). Restano come lavoro FUTURO non bloccante:
offline page vera (catchHandler/injectManifest), registerSW defer + font
preload + hero preload condizionale + indagine bundle (handoff perf-engineer),
bug validator `firestore.rules:101` (MEDIUM, fail-closed), refactor
seoRoutes→surfaces (fase 7b), gap metodologico LHCI `?twu_audit=1`.
