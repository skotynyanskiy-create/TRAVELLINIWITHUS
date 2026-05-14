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

## Link

- [[DEPLOYMENT_RUNBOOK]]
- [[LAUNCH_CHECKLIST]]
- [[OPERATIONAL_VERIFICATION_REPORT]]
- [[90_Templates/TPL_Release_Note]]
- [[../13_Content/CONTENT_CALENDAR_H2_2026]]
- [[../13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO]]
- [[../13_Content/LEAD_MAGNET_POSTI_ITALIANI]]
- [[../12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
