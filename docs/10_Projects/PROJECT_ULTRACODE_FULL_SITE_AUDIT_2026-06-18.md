---
type: project
area: audit
status: open
priority: p1
owner: team
repo: TRAVELLINIWITHUS
source: ultracode multi-agent audit
related: '[[10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT]]'
tags:
  - project
  - audit
  - ultracode
date: 2026-06-18
---

# ULTRACODE — Full-site audit verso il "definitivo"

Audit fan-out a 6 agenti senior in parallelo (quality, security, UI/design, SEO+AI-SEO,
growth, performance). Obiettivo: NON ri-eseguire i gate statici (già PASS) ma trovare
cosa porta il sito da "launch-ready" a "definitivo, altissimo livello". Niente blocker
owner-side ri-elencati come scoperte.

## Scoreboard per dominio

| Dominio        | Voto attuale | Raggiungibile | Tesi del finding                                                                       |
| -------------- | ------------ | ------------- | -------------------------------------------------------------------------------------- |
| Code-health    | 7.5/10       | 9.3           | Pulizia eccellente sui fondamentali, ma test coverage simbolica + codice orfano        |
| Security       | 7.5/10       | 9.0           | Nessun CRITICAL nuovo; rischi operativi/supply-chain (App Check assente, 12 CVE)       |
| UI/Design      | 7.4/10       | 9.0–9.3       | "Hai la pulizia, ti manca la firma" — infrastruttura premium installata ma sotto-usata |
| SEO tecnico    | 6.5/10       | 8.5           | Metà del sito, per crawler senza JS, è una pagina vuota con meta default               |
| AI-SEO/GEO     | 7.0/10       | 9.0           | Schema incompleto/incoerente, zero VideoObject sui 5 reel reali                        |
| Growth/Revenue | 4.0/10       | 7.5           | Infrastruttura costruita ma scollegata dal valore; nessuna superficie chiude in €      |
| Performance    | 7.5/10       | 9.2           | Fondamenta solide, ma ~50-70KB gz di spreco nel critical path + rischio FOUT LCP       |

## TIER 0 — Azioni owner (sbloccano tutto, NON codice — recap noto)

- Ruotare/restringere Firebase Web API key su GCP + decidere su leak storico in git history.
- Env produzione: `RESEND_API_KEY`, `BREVO_API_KEY`/`BREVO_LIST_ID`, `SENTRY_ACCESS_TOKEN`, `VITE_MAPBOX_TOKEN`, `APP_URL`.
- Affiliate signup (Booking, Airalo prioritari; GetYourGuide + Heymondo già live).
- Foto reali R+B (tetto design a ~9.2 senza).
- Bio IG/TikTok → link `/vieni-con-noi?utm_source=ig_bio`.

## TIER 1 — P0 tecnici verso il definitivo (codice, alto impatto)

| ID      | Dominio  | Intervento                                                                                                                  | File                           | Owner exec               |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------ |
| SEO-F1  | SEO      | SSR meta universale: dizionario `STATIC_ROUTE_META` + `injectStaticMeta(html,path)` per ~25 rotte oggi con meta default     | server.ts:1936-1995            | backend-engineer + owner |
| SEO-F2  | SEO      | Coerenza schema Article SSR (`BlogPosting` povero) vs client (`Article` ricco); flag anti-doppio                            | server.ts:899-915 / seo.ts:141 | backend-engineer + owner |
| DES-D1  | Design   | Hero title reveal per-riga (firma tipografica): H1 oggi statico mentre tutto il contorno si anima                           | HeroSection.tsx:96             | frontend-builder         |
| DES-D2  | Design   | Dispatch Index tipografico (classe `.dispatch-index-number` già scritta in index.css:244 e mai usata) come pausa editoriale | Home.tsx                       | frontend-builder         |
| SEC-1   | Security | Firebase App Check: oggi scrittura REST diretta su `leads`/`users` aggira il rate-limit Express                             | server.ts/firestore.rules      | backend-engineer + owner |
| SEC-2   | Security | `npm audit fix` — 12 CVE high incl. `@grpc/grpc-js` DoS sul path firebase-admin/webhook                                     | package.json                   | frontend/quality         |
| QA-1    | Quality  | Test infra moduli puri (seo/discoveryQuery/affiliateLink/format) — coverage oggi decorativa                                 | src/lib, src/utils             | frontend-builder         |
| PERF-1A | Perf     | `motion` (45KB gz) fuori dal modulepreload HTML                                                                             | vite.config.ts:103             | frontend-builder         |
| PERF-1B | Perf     | Preload woff2 Fraunces-500 + Inter-400 (rischio FOUT sul titolo LCP)                                                        | Home Helmet / index.html       | frontend-builder         |

## TIER 2 — P1 rinforzo

| ID      | Dominio  | Intervento                                                                                                             | File                            |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| SEO-F4  | SEO      | `VideoObject` sui 5 reel MP4 self-hosted (zero concorrenti IT lo fanno)                                                | reels.ts, seo.ts                |
| SEO-F5  | SEO      | `ItineraryGuide`/`HowTo` + breadcrumbs su `/itinerari/:slug` (oggi zero jsonLd)                                        | Itinerario.tsx                  |
| SEO-F6  | SEO      | `FAQPage` sui pillar (oggi solo /club); convertire `tips[]` in Q/A reali                                               | Articolo.tsx                    |
| SEO-F7  | SEO      | 301 server-side per `/destinazioni`,`/esperienze`,`/guide` (oggi `<Navigate>` client)                                  | server.ts                       |
| GRW-G1  | Growth   | Affiliate deeplink: 5/7 link sono domini nudi (Skyscanner/Booking/Airalo/Revolut/Amazon) → tracking sì, commissione no | Risorse.tsx                     |
| GRW-G2  | Growth   | Chiudere funnel lead magnet (PDF + env) → welcome email oggi no-op silenzioso                                          | server.ts, email.ts             |
| GRW-G3  | Growth   | Scegliere UNA offerta a pagamento (raccomandato shop 1-SKU, non club ricorrente)                                       | Shop.tsx, Club                  |
| GRW-G4  | Growth   | `value`+`currency` su `affiliate_click`/`club_waitlist`/`media_kit_submit` → ottimizzazione Meta su valore             | analytics.ts                    |
| QA-H1   | Quality  | Modulo "Audio guida" completo ma orfano (mai importato): cablare su Articolo o rimuovere                               | components/audio/\*             |
| DES-D3  | Design   | Gerarchia di motion: oggi tutto fa `opacity+y`; investire in 1-2 momenti scroll-driven                                 | sezioni home                    |
| DES-D5  | Design   | Navbar: pill `bg-white/50 backdrop-blur` su hero scura = glassmorphism SaaS; trasparente pre-scroll                    | Navbar.tsx:230                  |
| PERF-1C | Perf     | Doppia libreria mappe: `react-simple-maps` (37KB) + `mapbox-gl` (476KB gz) — decisione architetturale                  | InteractiveMap / MapboxWorldMap |
| SEC-3   | Security | Coupon Stripe creati per-checkout → object orfani; security headers (CORP)                                             | server.ts                       |

## TIER 3 — P2 quick-win (<30 min, basso rischio)

**Design (frontend-builder):**

- DES-QW1 `--color-sand` `#fafafa` → off-white caldo (es. `#FAF8F4`) — index.css:23 (1 valore, impatto globale)
- DES-QW3 rimuovere `drop-shadow-lg` da H1 hero (sporca i terminali Fraunces) — HeroSection.tsx:98
- DES-QW4 tagliare CTA hero ridondante (ghost "Ultime guide" / micro-link mobile → stesso target) — HeroSection.tsx:140
- DES-QW5 `font-script` → Fraunces italic nelle firme R+B (fallback cursive di sistema = dettaglio più cheap del sito) — HomeEditorialPromise.tsx:59, CoupleIntro.tsx:158
- DES-QW6 rimuovere badge "Storia in evidenza" (due pill competono sulla cover) — LatestArticles.tsx:234
- DES-QW2 rimuovere trattino accent flottante mega-menu — Navbar.tsx:273
- DES-QW7 ridurre/eliminare polaroid scatter — CoupleIntro.tsx:171

**Perf (frontend-builder):**

- PERF-2A rimuovere `react-intersection-observer` (dead dep, 0 import) — package.json + vite.config.ts:197
- PERF-2B `width`/`height` espliciti su `<img>` hero — HeroBackdrop.tsx:53
- PERF-2E rimuovere `fraunces/latin-500-italic` se non above-fold (-22.9KB woff2) — index.css:8

**SEO file pubblici (frontend-builder, NON server.ts):**

- SEO-Q1 eliminare `public/sitemap.xml` morto (route dinamico vince)
- SEO-Q6 refresh `llms-full.txt` (6 region landing + reel + data)
- SEO-Q7 `robots.txt`: `Disallow: /*?zone=` / `?type=` (crawl budget facet Esplora)

**SEO server.ts (backend-engineer + owner):**

- SEO-Q2 301 per `/destinazioni`,`/esperienze`,`/guide`; SEO-Q3 sitemap + 6 region landing/strumenti/press; SEO-Q4 fix FAQ `name` ripetuto; SEO-Q5 OG fallback `.svg`→`/og/default.jpg`

**Quality (frontend-builder):**

- QA-QW1 rimuovere 3 alias dead `buildDestinationUrl`/`buildExperienceUrl`/`resolveDestinationGroup` — discoveryQuery.ts:181
- QA-QW4 aggiornare `BUG_QA_TEST_SUITE_STALE` (audit:size ora operativo)
- QA-QW5 aprire bug note per cover `-demo` su `/vieni-con-noi` (oggi non tracciato)

**Security:**

- SEC-QW `npm audit fix`; `.husky/pre-push` con gitleaks; untrack `firebase-applet-config.json`; allineare admin allow-list

## Librerie / integrazioni da aggiungere o sostituire

| Azione     | Libreria/tool                                           | Risolve                                               | Dominio    | Nota                    |
| ---------- | ------------------------------------------------------- | ----------------------------------------------------- | ---------- | ----------------------- |
| Aggiungere | `split-type` (~4KB)                                     | Split testo per riga/parola per hero+section reveal   | Design     | con GSAP già montato    |
| Aggiungere | `@axe-core/playwright`                                  | A11y gate nei test e2e (oggi solo axe CLI on-demand)  | Quality    | in CI                   |
| Aggiungere | `vitest-axe`                                            | A11y assertion a livello unit                         | Quality    |                         |
| Promuovere | `knip` (già in audit:deps)                              | Gate orfani in CI → avrebbe preso il modulo audio     | Quality    |                         |
| Aggiungere | `babel-plugin-react-compiler`                           | Auto-memo React 19, taglia re-render Esplora/Articolo | Perf       | lab trial prima         |
| Valutare   | `@builder.io/partytown`                                 | Pixel terzi (GA/Meta/TikTok) su web worker → INP      | Perf/SEO   | solo se INP live soffre |
| Valutare   | image CDN (bunny/Cloudflare Images) o `vite-imagetools` | AVIF/width negoziati per device                       | Perf/Asset |                         |
| Aggiungere | Firebase App Check                                      | Blocca scrittura REST diretta che aggira rate-limit   | Security   | TIER 1                  |
| Aggiungere | Dependabot/Renovate                                     | Freschezza dep + CVE auto                             | Security   |                         |
| Rimuovere  | `react-intersection-observer`                           | Dead dep                                              | Perf       |                         |
| Decidere   | `react-simple-maps` OR `mapbox-gl`                      | Un solo motore mappe                                  | Perf       | architetturale          |
| Rimuovere  | `public/sitemap.xml`                                    | File morto                                            | SEO        |                         |
| Config     | Brevo automation 3-step                                 | Email lifecycle (oggi solo welcome)                   | Growth     | no codice               |
| Config     | coverage threshold vitest                               | Rende bloccante la regressione coverage               | Quality    |                         |

Major upgrade disponibili (da valutare a parte, non urgenti): Vite 6→8, React Router 7→8,
Express 4→5, Stripe SDK 20→22, TypeScript 5→6, lucide 0.x→1.0. Tutto il resto è a
patch/minor di distanza.

## Sequenza raccomandata

1. **Quick-win sicuri** (design + perf + quality + SEO file pubblici) — batch frontend, verificabile subito.
2. **Test infra** (QA-1) + `npm audit fix` (SEC-2) + rimozione orfani/dead dep.
3. **Server.ts SEO P0** (SEO-F1/F2 + 301 + sitemap) → handoff backend-engineer + conferma owner.
4. **Growth funnel** (G2 lead magnet live → G1 affiliate deeplink → G3 scelta offerta) — dipende da azioni owner.
5. **Design strutturale** (D1 hero reveal + D2 dispatch index + D3 motion hierarchy).
6. **Schema avanzato** (VideoObject reel, ItineraryGuide, FAQPage pillar).
7. **App Check** (SEC-1) + re-misura CWV live post-fix.

## Stato esecuzione — 2026-06-18 (questa sessione)

**Implementato + verificato (4 gate verdi: typecheck/lint/test 38·38/build):**

- Quick-win tech: A1 dead alias rimossi · A2 motion fuori preload · A3 react-intersection-observer rimosso · A4 preload font Fraunces/Inter · A5 hero img width/height · A6 `npm audit fix` (high 12→5; le 5 residue richiedono bump major).
- File SEO pubblici: B2 robots facet disallow · B3 llms-full refresh. B1 `public/sitemap.xml` lasciato (lo rigenera `generate-sitemap.js:192` — fix vero = togliere quella scrittura).
- Test infra: C1-C4 (format/affiliate/seo/discoveryQuery) — 38/38.
- Design quick-win: D1 sand `#FAF8F4` · D2 CTA hero · D3 drop-shadow H1 · D4 firme Fraunces italic · D5 badge "Storia in evidenza" rimosso · D6 trattino mega-menu · D7 polaroid scatter.
- **SSR `server.ts` (backend-engineer, owner-approved)**: F1 `injectStaticMeta`+`STATIC_ROUTE_META` (12 rotte, title unici) · F2 schema Article coerente + marker `data-ssr-jsonld` anti-doppione in SEO.tsx · F3 FAQ `name` = prima frase tip · F7 301 `/destinazioni`+`/esperienze` (NON `/guide`: `/guide/:slug` è live) · sitemap +`/press`,`/strumenti`,6 region · OG fallback `.svg`→`/og/default.jpg`.
- Bonus: sistemati 3 gate rossi pre-esistenti del working tree (vitest senza alias `@`, tsconfig che compilava `docs/99_Archive`, `useArticleReadingProgress` setState-in-effect).
- **Design strutturale D1+D2** (frontend-builder D1 + main-thread D2): D1 hero title reveal su 3 righe (clip overflow-hidden + translateY, INTRO_EASE, reducedMotion-safe, LCP-safe senza opacity:0) + drop-shadow-lg rimosso. D2 nuovo `HomeDispatchIndex.tsx` (6 regioni reali da `getAllRegions()`, numeri `.dispatch-index-number`, nomi Fraunces grandi, hover-peek desktop con motion useSpring, wired dopo CoupleIntro). Verificato browser desktop+mobile: 0 errori console, 0 overflow 375px.
- **Design D3+D6**: D3 momento-firma image-reveal su clip-path nelle cover (`IMAGE_WIPE_EASE` in animations.ts, wipe in LatestArticles + HomeFeaturedDestinations, card y 20/28→8, reducedMotion-safe, CLS-safe). D6 trattino accent rimosso dai 2 mega-menu navbar (era stato mancato in un pass precedente + mis-verificato). Gate verdi. D3: clip-wrapper verificato live nel DOM con stato iniziale corretto `inset(100%)`; l'animazione live non catturabile via screenshot (preview smooth-scroll intercetta lo scroll programmatico) ma è lo stesso meccanismo whileInView dei reveal già funzionanti.

**Da fare (non in questa sessione):** design **D5 navbar trasparente su hero** (alto blast-radius cross-page, pass dedicato) + D9 manifesto · schema F4 VideoObject/F5 ItineraryGuide/F6 FAQPage-pillar · growth G1-G3 (owner: env, affiliate, offerta) · SEC-1 App Check + 5 CVE high · librerie split-type/@axe-core/vitest-axe/knip-CI/Dependabot · copy finale eyebrow Dispatch Index (TODO[seo]). Follow-up: Google Rich Results Test su `/articolo` live (un solo Article).

## Handoff scritti dagli agenti

- `docs/50_Scratch/HANDOFF_home-awwwards-elevation_design_to_frontend-builder.md` (design)
- `docs/50_Scratch/HANDOFF_2026-06-18_security_to_backend-engineer.md` (security)
- SEO/growth: handoff da scrivere su conferma decisioni owner (offerta a pagamento, dizionario meta).
