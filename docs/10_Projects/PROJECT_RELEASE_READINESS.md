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

> [!info] Latest pass — 2026-04-24
> La snapshot operativa più recente è [[PROJECT_RELEASE_READINESS_2026_04_24_PRODUCTION_PASS]]. Questa nota rimane la master checklist (fase A, B, Sprint 1); per lo stato concreto dell'ultimo production pass consultare la snapshot.

## Obiettivo

Tenere sotto controllo cio che manca per una release pulita e verificabile della V1.

## Checklist

- [x] verificare home e hero
- [x] verificare destinazioni
- [x] verificare navbar e navigazione
- [x] verificare contenuti, funnel e shop
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

## Sprint 1 — 2026-04-20 — Infrastruttura production-gate

Roadmap di riferimento: `C:/Users/admin/.claude/plans/sei-un-principal-ai-dreamy-penguin.md`. Obiettivo Sprint 1: chiudere tutti i gap **non dipendenti da contenuto** prima della sessione finale con chiavi API.

### Completato

- [x] Admin auth multi-utente via Firebase Custom Claims → decision doc [[20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS]] con procedura di migrazione, template rule aggiornate, test di verifica.
- [x] Affiliate tracking v1 end-to-end: `src/lib/affiliate.ts` unifica `prepareAffiliateLink` + `trackAffiliateClick`, Risorse.tsx migrata ai partner AFFILIATE_PARTNERS, UTM idempotenti, evento `affiliate_click` gated su `canLoad('analytics')`. Heymondo + Airalo + grid risorse coperti.
- [x] Editorial validator: `src/utils/articleValidator.ts` con regole (titolo 20-75, slug kebab-case, descrizione 80-170, ≥600 parole, ≥3 heading, cover obbligatoria). Integrato in `ArticleEditor.handleSave` → errori bloccano publish, warning confermano.
- [x] Checklist editoriale operativa per autori in `docs/13_Content/EDITORIAL_PUBLISH_CHECKLIST.md`.
- [x] Schema.org travel esteso in `src/components/SEO.tsx`: `TouristDestination`, `TouristTrip` (con `subTrip` multi-stop + `geo`), `Review` + Article esteso con `articleSection`, `keywords`, `wordCount`, `about`.
- [x] Error tracking **predisposto** (senza install SDK, per rispettare "chiavi solo in sessione finale"): client `src/lib/errorTracking.ts` + `ErrorBoundary` hook, server `src/lib/serverErrorTracking.ts` + Express error middleware + `unhandledRejection`/`uncaughtException`. Attivazione reale via [[20_Decisions/DECISION_ERROR_TRACKING_STRATEGY]].
- [x] Disaster recovery Firestore: workflow GitHub Actions `.github/workflows/firestore-backup.yml` (weekly cron + manual dispatch, OIDC WIF, export su GCS). Runbook completo [[DISASTER_RECOVERY_RUNBOOK]] con RPO ≤7d, RTO ≤4h, setup bucket/IAM, scenari restore, monitoraggio trimestrale.
- [x] Runbook Stripe webhook production: [[STRIPE_WEBHOOK_RUNBOOK]] con setup endpoint, env vars, smoke test A/B/C, procedura incidente.
- [x] Cookie consent riaperibile: `src/lib/consent.ts` aggiunge `openConsentPreferences` (CustomEvent), `ConsentBanner` ascolta e riapre in modalità `customize`, pagina `/cookie` mostra pulsante "Apri preferenze cookie" in evidenza.
- [x] Cookie policy espansa con disclosure vendor specifici (GA4, Meta Pixel, TikTok Pixel) + partner affiliate (Booking, Heymondo, Skyscanner, GetYourGuide, Airalo, Amazon).
- [x] Verifica finale: `typecheck` clean, `lint` 0 errori (14 warning pre-esistenti invariati), `audit:ui` 0 errori, `audit:agents` PASS, `build` OK (PWA 73 entry precached).

### Aperto (per sessione finale pre-deploy)

- [ ] Contenuti reali (5 articoli + 3 prodotti) — owner content work, fuori scope Sprint 1.
- [ ] Attivazione chiavi: Stripe live keys + webhook secret, Sentry DSN, Mapbox token, GA4/Meta/TikTok IDs, Brevo list.
- [ ] Esecuzione migrazione Custom Claims sugli account owner + redeploy rules.
- [ ] Setup WIF + bucket GCS + lancio primo backup Firestore reale.
- [ ] Run smoke test Stripe A/B/C in produzione.

## Audit 2026-04-22 — technical-operational pass

Audit completo repo + workspace locale con focus su quality gates, automazioni e coerenza doc/config (multi-agent: Claude Opus 4.7 + Codex).

### Verificato

- [x] `npm run audit:quality` PASS.
- [x] `npm run predeploy` PASS.
- [x] `npm run e2e` PASS dopo riallineamento dei test Playwright alla UI e allo stato reale dello shop demo.
- [x] `scripts/check-ui.mjs` ripulito da riferimenti stantii e da un falso positivo su `noscript`.
- [x] `docs/DEPLOYMENT_RUNBOOK.md` riallineato al bootstrap Firebase reale via `firebase-applet-config.json` e ai nomi env analytics effettivamente usati dal codice (`VITE_GA_ID`, `VITE_META_PIXEL_ID`, `VITE_TIKTOK_PIXEL_ID`).
- [x] Typecheck esteso a `server.ts` + `scripts/` via `tsconfig.node.json`; `typecheck:strict` portable via wrapper Node (`scripts/typecheck-strict.mjs`).
- [x] Security hardening: chiavi Gemini dietro endpoint server `/api/ai/verify-*` con rate limiting (non più esposte al client).
- [x] `npm audit fix` non-breaking: 30 → 19 vulnerabilità (CRITICAL protobufjs risolta).
- [x] Smart routing AI: `CLAUDE.md` Smart Routing Protocol + hook BARC `.claude/settings.json`.

### Follow-up aperti (priorità decrescente)

- [x] Chiudere migrazione admin a Firebase Custom Claims e rimuovere la allowlist client hardcoded in `src/config/admin.ts`.
- [x] Unificare bootstrap Firebase: scelto `firebase-applet-config.json` come unica fonte di verità per client e server.
- [x] Convergere analytics su un solo loader consent-gated: rimosso l'init legacy da `firebase.ts`, tutto centralizzato su `services/analytics.ts`.
- [x] Auth check sugli endpoint `/api/ai/*` (risolto tramite middleware `requireAdmin` con Custom Claims in server.ts).
- [ ] Piano "strict by slice" per TypeScript: lontano dall'adozione con >100 errori strict oggi.
- [ ] Modularizzazione `server.ts` (1586 righe) quando si aprirà un task backend dedicato.

### Note

- `audit:ui` resta WARN-only e segnala ancora 34 warning non bloccanti: soprattutto raw color token locali e inline style usati per motion/illustrazioni. Dal 2026-04-22 è presente un **baseline esplicito** (`audit-ui-baseline.json`): nuovi warning fuori dal baseline vengono marcati `NEW-WARN` e spiccano nel report.
- Lo shop resta correttamente in modalità preview/demo: i test E2E ora verificano questo stato invece di assumere un checkout attivo su prodotti demo.
- `public/media-kit.pdf` e `public/sitemap.xml` vengono rigenerati dai check di build/predeploy; mantenerli versionati resta una decisione operativa esplicita.
- **Design system cheatsheet** consultabile: [[DESIGN_SYSTEM_CHEATSHEET]] — reference completa di CSS vars, layout primitives, atoms riusabili, motion presets.

## Strict TypeScript — Piano "by slice" (2026-04-22)

Adozione progressiva di strict TS come audit continuo, senza rendere `typecheck:strict` un gate bloccante. Comando: `npm run typecheck:strict` (wrapper Node portable, sempre exit 0).

### Stato attuale

- `tsconfig.strict.json` esiste con `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true`.
- Errori rilevati oggi: >100 sparsi (principalmente `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + qualche `implicit any` in moduli minori).

### Slice roadmap (ordine di riduzione errori, facile → difficile)

| Slice  | Area                      | Rationale                                                               | Effort stimato |
| ------ | ------------------------- | ----------------------------------------------------------------------- | -------------- |
| **S1** | `src/utils/`              | Funzioni pure, basso blast-radius, isolate                              | 1 sessione     |
| **S2** | `src/hooks/`              | Custom hooks: pattern prevedibili, fix mirati                           | 1 sessione     |
| **S3** | `src/lib/`                | Helper condivisi (animations, consent, stripe, firestore error handler) | 1 sessione     |
| **S4** | `src/services/`           | Service layer (analytics, aiVerificationService, ecc.)                  | 1-2 sessioni   |
| **S5** | `src/context/`            | Context React (Auth, Cart, Favorites, Consent)                          | 1-2 sessioni   |
| **S6** | `src/components/` atoms   | Componenti UI riusabili (Button, Card, Skeleton, ecc.)                  | 2 sessioni     |
| **S7** | `src/components/` sezioni | Feature folder (home, destinazioni, discovery, article, ecc.)           | 3-4 sessioni   |
| **S8** | `src/pages/`              | Top-level pages                                                         | 2-3 sessioni   |
| **S9** | `server.ts`               | Dopo modularizzazione server.ts (non prima)                             | 2 sessioni     |

### Regole per ogni slice

- Non forzare `!` non-null assertion in modo sistematico: preferire guard-clause + narrowing esplicito.
- Non rendere opzionale un campo obbligatorio solo per spegnere errore `exactOptionalPropertyTypes`: preferire `| undefined` espliciti.
- Dopo ogni slice: run `npm run typecheck:strict`, documentare errori rimasti.
- Commit per slice: `refactor(ts-strict): S<N> <area> — N errors -> M`.
- Non unire slice: un commit = un'area, per facilità review e rollback.

### Gate finale

Quando S1-S8 completati: valutare se portare `strict` dentro `tsconfig.json` base e rendere `typecheck` unificato. S9 (server.ts) dopo modularizzazione.

## Link

- [[DEPLOYMENT_RUNBOOK]]
- [[LAUNCH_CHECKLIST]]
- [[OPERATIONAL_VERIFICATION_REPORT]]
- [[90_Templates/TPL_Release_Note]]
- [[STRIPE_WEBHOOK_RUNBOOK]]
- [[DISASTER_RECOVERY_RUNBOOK]]
- [[20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS]]
- [[20_Decisions/DECISION_ERROR_TRACKING_STRATEGY]]
- [[13_Content/EDITORIAL_PUBLISH_CHECKLIST]]

## Build pass 2026-04-24 - planning IA + hotel detail layer

### Completato

- [x] `npm run typecheck` pulito dopo fix `ArticleEditor` su `shopCta.productUrl`.
- [x] `npm run lint` pulito.
- [x] `npm run build` pulito.
- [x] Navbar e footer riallineati al modello `Esplora / Guide / Pianifica / Collaborazioni / Chi siamo`.
- [x] `siteContent` esteso con il nuovo layer `planning` e label dedicate per nav/footer.
- [x] `Inizia da qui` aggiornata come ingresso del funnel `Pianifica`.
- [x] Introdotta la route pubblica `/dove-dormire/:slug` con scheda hotel dedicata.
- [x] Introdotto il content model hotel (`HotelEntry`) con fallback locale e service Firestore `hotels`.
- [x] Sitemap estesa al nuovo layer hotel detail.
- [x] `audit:ui` migliorato: i `NEW-WARN` scendono a 5 e restano solo inline style residui su discovery/home.

### Ancora aperto

- [ ] Verifica roundtrip reale Firestore per `leads`, `newsletter` e `media-kit`.
- [ ] Popolare la collection Firestore `hotels` con asset e copy reali.
- [x] Chiusi tutti i `NEW-WARN` di `audit:ui`: baseline rigenerato in `64dc005`, snapshot 11 baseline / 0 new / 0 errori.
- [ ] Risolvere il warning CSS storico in build legato a una utility CSS var placeholder malformata.

## Sessione 2026-04-24 pomeriggio - consolidamento + safety-net + demo gating

### Completato

- [x] **Commit split** in 4 commit tematici (`48ab143` verticals, `c3d9f4f` editorial, `3b2dfdf` docs, `c60a9b1` security+infra) per chiudere il flight-state di 55 modificati + 29 untracked.
- [x] **Unit test baseline** in `33f229e`: 4 file test (`articleRoutes`, `articleValidator`, `contentTaxonomy`, `articleData`) per 71 nuovi test, suite complessiva 86/86 verde. Prima sessione con coverage unit.
- [x] **Seed DEV guard** in `64dc005`: `src/data/seedArticle.ts` console wrappati in `import.meta.env.DEV`, aggiunto `throw error` per evitare silent-fail.
- [x] **audit:ui baseline rigenerato**: 23 warning risolti (CrossLinkWidget, HomeDiscoveryCards, Navbar, discovery), snapshot 11 baseline / 0 new / 0 errori.
- [x] **Demo-gating leak chiusi** in `fcfeea1`:
  - `src/pages/Articolo.tsx`: invertito ordine, Firestore per primo, `PREVIEW_ARTICLES[slug]` fallback solo se `demoSettings.showEditorialDemo` attivo (false in prod by default).
  - `src/pages/ProductPage.tsx`: `demoFallback` gated su `showShopDemo`, `useQuery.enabled` sempre attivo (Firestore tentato sempre).
  - `SearchModal.tsx` era gia gated, nessun fix necessario.
- [x] **Predeploy gate 10/10 PASS**: typecheck, lint, test, build, audit:ui/firebase/stripe/agents, static files, firebase consistency — tutti verdi su `fcfeea1`.
- [x] **audit:visual 33/33 verde** (mobile/tablet/desktop) nel run intermedio pre demo-gating.

### Ancora aperto (action owner)

- [ ] Verifica roundtrip reale Firestore per `leads`, `newsletter` e `media-kit` (schema audit: payload coerente con rules, manca solo il roundtrip live).
- [ ] Popolare almeno 1 articolo Firestore `type='pillar'` con `verifiedAt` + `disclosureType` + >=3 hotels reali + `shopCta` — sblocca Phase 2 governance validation.
- [ ] Revisione umana finale degli screenshot `playwright-report/`.
- [ ] Mapbox token reale in env production.
- [ ] E2e Playwright hotel-flow (scrivibile senza Firestore) + shop-happy-path (richiede Stripe test keys).

## Build pass 2026-04-22 - content model and public funnel

### Completato

- [x] Estensione non-breaking del content model articoli: `tripIntents`, `budgetBand`, `verifiedAt`, `disclosureType`, `featuredPlacement`.
- [x] `ArticleEditor` aggiornato per leggere/salvare i nuovi campi.
- [x] Validazione publish aggiornata: `disclosureType` e `verifiedAt` ora sono richiesti in fase di pubblicazione; `budgetBand` e `tripIntents` restano warning.
- [x] `siteContent.collaborations` esteso con copy admin-driven per `positioning`, `fit` e `no-fit`.
- [x] Footer allineato allo `Shop gate`: niente promo shop in navigazione finche non ci sono almeno 3 prodotti reali pubblicati.
- [x] `/shop` resta accessibile ma va in stato editoriale "in apertura" quando il gate e chiuso.
- [x] `typecheck`, `build`, `audit:ui` eseguiti con esito positivo.

### Ancora aperto

- [x] Verificare in browser il nuovo pass su `Home`, `ChiSiamo`, `Collaborazioni`, `Risorse` e `Shop`.
- [ ] Aggiornare i contenuti demo/editoriali in Firestore usando i nuovi campi, cosi il layer `featuredPlacement` e i badge trust si vedono anche fuori dai fallback locali.
- [x] Confermare il warning CSS Tailwind storico relativo a una utility CSS var placeholder malformata (risolto con refactoring utility standard in CartDrawer.tsx).

## Build pass 2026-04-23 — Salt-style premium layer + pillar infrastructure

### Completato

- [x] Articolo premium Salt-style: integrati in `src/pages/Articolo.tsx` i 4 componenti `AffiliateBar`, `HotelRecommendations`, `PinterestSaveBanner`, `ShopContextualCta` con rendering condizionale sui campi `hotels` / `shopCta`.
- [x] Fix encoding `Shop.tsx:278` ("finchÃ©" → "finché").
- [x] Sample preview Dolomiti in `src/config/previewContent.ts` con `hotels[]` + `shopCta`: testabile in dev su `/articolo/dolomiti-rifugi-design`.
- [x] Homepage ri-orchestrata a portale: `DestinationScroller` montato, nuovi `InstagramFeed` (fixture in dev) e `PartnerLogos` (prop-driven) inseriti prima della newsletter.
- [x] Nuova route `/dove-dormire`: hub affiliate curato con 12 hotel su 4 destinazioni, schema `CollectionPage` + `ItemList` + `LodgingBusiness`, breadcrumb JSON-LD, tracking Booking via `prepareAffiliateLink`.
- [x] Link `/dove-dormire` in Navbar (gruppo Guide) e Footer (blocco Scopri). Generator sitemap aggiornato.
- [x] Collaborazioni B2B: `PartnerLogos` montato con lista dedicata (`PARTNER_SHOWCASE`). Componenti `Testimonials` e `CaseStudies` creati come riusabili, auto-render condizionale su `siteContent.collaborations.testimonials/caseStudies` quando popolati.
- [x] Pillar infrastructure (M5): nuovi `ArticleType = 'article' | 'pillar'`, `NormalizedArticle.type` con default `'article'`, validator pillar-aware (min 1500 parole, 5 heading, hotels e shopCta consigliati), badge visuale "Guida completa" in `ArticleHero`, pill "Pillar" in `AdminDashboard` articles list.
- [x] Admin editor (`src/pages/admin/ArticleEditor.tsx`): UI completa per `type` (select), `hotels[]` (array editor add/remove con 7 campi per hotel), `shopCta` (sotto-form 3 colonne). Load/save Firestore + validator pass con `type`.
- [x] Breadcrumbs UI+JSON-LD su `ChiSiamo` e `Destinazioni` (prima erano solo testuali nel schema).
- [x] A11y pass su `InstagramFeed` + `PartnerLogos`: `role="list"/"listitem"`, `aria-label` su grid partner.
- [x] Documentazione: nuovo `TPL_Pillar_Guide.md` in templates, nuovo `PROJECT_DOVE_DORMIRE.md`, pass aggiornamento `PROJECT_HOME_HERO_NAV_REFINEMENT.md`.
- [x] Gates passati: `typecheck`, `audit:ui` (0 errori, 4 warning advisory inline-style giustificati), `build` (70 precache entries).

### Ancora aperto pre-deploy

- [ ] Popolare almeno 1 articolo Firestore con `type='pillar'`, `hotels[]` reali, `shopCta` reale — per validare end-to-end in prod.
- [ ] Popolare `siteContent.collaborations.testimonials[]` e `caseStudies[]` quando quote/progetti reali sono pronti (le sezioni appariranno automatiche).
- [ ] Design review dedicato (M2 del piano `facciamo-un-piano-prendendo-groovy-harp.md`): decisione owner su palette / tipografia / token.
- [ ] Contenuti pillar italiani (Sardegna, Puglia, Grecia delle isole) — work di content strategist.
- [ ] Primi 3 prodotti shop reali: Google Maps locations + 1 ebook + 1 preset Lightroom (richiede Stripe live keys).
- [ ] Instagram Graph API live + Stripe live keys + release hardening finale (M8).

### Note

- Tutti i componenti nuovi sono **non-breaking**: articoli e pagine esistenti che non espongono i nuovi campi continuano a funzionare esattamente come prima.
- Restyle visivo (M2) **non eseguito** in questa build pass — il design system (palette, tipografia, spacing) resta invariato per preservare coerenza con foto brand già in hero.
