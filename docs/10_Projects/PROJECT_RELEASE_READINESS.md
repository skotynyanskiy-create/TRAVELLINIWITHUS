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

## Obiettivo

Tenere sotto controllo cio che manca per una release pulita e verificabile della V1.

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

- [ ] Chiudere migrazione admin a Firebase Custom Claims e rimuovere la allowlist client hardcoded in `src/config/admin.ts`.
- [ ] Unificare bootstrap Firebase: scegliere una sola fonte di verità tra `firebase-applet-config.json` (oggi usato) e env vars `VITE_FIREBASE_*` (documentate in vari posti).
- [ ] Convergere analytics su un solo loader consent-gated (`AnalyticsScripts` vs `initAnalytics()` convivono).
- [ ] Auth check sugli endpoint `/api/ai/*` (oggi solo rate limit 5/min protegge la quota Gemini).
- [ ] Piano "strict by slice" per TypeScript: lontano dall'adozione con >100 errori strict oggi.
- [ ] Modularizzazione `server.ts` (1586 righe) quando si aprirà un task backend dedicato.

### Note

- `audit:ui` resta WARN-only e segnala ancora 34 warning non bloccanti: soprattutto raw color token locali e inline style usati per motion/illustrazioni.
- Lo shop resta correttamente in modalità preview/demo: i test E2E ora verificano questo stato invece di assumere un checkout attivo su prodotti demo.
- `public/media-kit.pdf` e `public/sitemap.xml` vengono rigenerati dai check di build/predeploy; mantenerli versionati resta una decisione operativa esplicita.

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
