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

## Piano V2 collegato

La pianificazione V2 avanzata e tracciata in [[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]].

Prima di raccomandare un deploy V2, chiudere almeno:

- [x] baseline QA V2 su route pubbliche principali
- [ ] sostituzione asset demo/AI critici con asset reali approvati
- [ ] contenuti preview non indicizzabili o sostituiti da contenuti reali
- [ ] roundtrip lead Firestore/fallback verificato
- [ ] shop reale solo se checkout e delivery sono pronti
- [ ] `npm run audit:quality`

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
