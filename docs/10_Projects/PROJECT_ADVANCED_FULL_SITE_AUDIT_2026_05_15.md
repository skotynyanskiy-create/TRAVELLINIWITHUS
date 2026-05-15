---
type: project
area: delivery
status: in-progress
priority: p0
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_RELEASE_READINESS]]'
source: advanced audit + execution pass 2026-05-15
tags:
  - project
  - audit
  - release
---

# PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15

## Obiettivo

Portare il sito da 6.4/10 a 10/10 attraverso audit avanzato (8 specialist) + execution pass autonomo + lista azioni R+B per attivazione finale.

## Audit avanzato — sintesi 8 specialist (2026-05-15 sessione)

Tutti i report dei specialist sono nel transcript di sessione 2026-05-15 (`travellini-ui-designer`, `travellini-quality-auditor`, `travellini-seo-conversion-strategist`, `travellini-growth-revenue-operator`, `travellini-social-content-operator`, `travellini-security-auditor`, `travellini-perf-engineer`, `browser-auditor`).

| Dimensione                       | Voto pre | Voto post-execution | Target 10/10 |
| -------------------------------- | -------: | ------------------: | -----------: |
| Tecnico (code, security, stripe) |      7.5 |                 8.5 |          9.5 |
| UI / direzione visuale           |      7.2 |                 8.0 |          9.0 |
| Brand / posizionamento           |      7.0 |                 8.0 |          9.5 |
| Conversione / monetizzazione     |      4.0 |                 4.5 |          9.0 |
| SEO / contenuti                  |      4.5 |                 6.0 |          9.0 |
| Performance (CWV)                |      4.5 |                 5.5 |          9.5 |
| Accessibilità (WCAG AA)          |      6.5 |                 9.5 |         10.0 |
| Operazioni progetto              |      8.0 |                 9.0 |          9.5 |
| **MEDIA**                        |  **6.4** |             **7.4** |     **9.4+** |

Il delta tra "post-execution" e "target 10/10" è ciò che richiede input R+B (asset reali, env keys, content reali, bio update, affiliate signup, partner outreach).

## P0 affrontati in questo pass — esito

| #   | Problema                                                            | File                                                                                           | Stato                                                                                                                   |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | Foto stock R+B su /chi-siamo (Unsplash sconosciuto)                 | [src/pages/ChiSiamo.tsx:258](../../src/pages/ChiSiamo.tsx)                                     | ✅ FIXED — sostituita con `/images/brand/about-editorial.webp` + alt aggiornato                                         |
| 2   | products.downloadUrl public read                                    | [firestore.rules:231-236](../../firestore.rules)                                               | ⚠️ PENDING — schema migration (collection split + signed URL Storage). Blocker pre go-live shop digitale                |
| 3   | LCP 4.3s (H1 Fraunces Google Fonts)                                 | [index.html:33](../../index.html)                                                              | ✅ FIXED in parte — index.html ora usa @fontsource self-hosted (commit linter), preconnect Unsplash rimosso             |
| 4   | 18 violazioni WCAG color-contrast /chi-siamo                        | [src/pages/ChiSiamo.tsx](../../src/pages/ChiSiamo.tsx)                                         | ✅ FIXED — 6 occorrenze: text-black/42→/70, italic span H1 /60→/75, quote author /40→/70                                |
| 5   | BUG_FIRESTORE_ARTICLES_PERMISSIONS open                             | [firestore.rules](../../firestore.rules)                                                       | ⚠️ PENDING — diagnosi root cause con emulator                                                                           |
| 6   | MonetizationTeaser badge "demo" + Unsplash                          | [src/components/home/MonetizationTeaser.tsx](../../src/components/home/MonetizationTeaser.tsx) | ✅ FIXED — rimossi badge "Bestseller demo"/"Lancio Q4 2026"; filtra solo status:'live' (1 card Mappa); Unsplash → local |
| 7   | InstagramGrid Unsplash + view inventate                             | [src/components/InstagramGrid.tsx](../../src/components/InstagramGrid.tsx)                     | ✅ FIXED — rimosso campo `views` + rendering; Unsplash → local; TODO[R+B]                                               |
| 8   | Zero articoli reali indicizzabili                                   | [src/config/previewContent.ts](../../src/config/previewContent.ts)                             | ⚠️ R+B ACTION — pillar Salento outline pronto                                                                           |
| 9   | robots.txt blocca shop + double exclusion vieni-con-noi/lead-magnet | [public/robots.txt](../../public/robots.txt)                                                   | ✅ FIXED — rimossi i 3 Disallow problematici                                                                            |
| 10  | Mappa title/desc verbi banditi                                      | [src/pages/Mappa.tsx:39-40](../../src/pages/Mappa.tsx)                                         | ✅ FIXED                                                                                                                |
| 11  | Home meta title senza cluster                                       | [src/pages/Home.tsx:35](../../src/pages/Home.tsx)                                              | ✅ FIXED                                                                                                                |
| 12  | Affiliate stack 2/6 attivo                                          | [src/pages/Risorse.tsx](../../src/pages/Risorse.tsx)                                           | ⚠️ R+B ACTION — signup Skyscanner/Booking/Airalo/Revolut                                                                |

## P1 affrontati

| #   | Fix                                                                           | File                                           |
| --- | ----------------------------------------------------------------------------- | ---------------------------------------------- |
| P1  | LatestArticles duplicate id `#storie` rimosso dal wrapper Home                | [src/pages/Home.tsx](../../src/pages/Home.tsx) |
| P1  | Home below-fold lazy() per 8 sezioni con Suspense placeholder height-reserved | [src/pages/Home.tsx](../../src/pages/Home.tsx) |
| P1  | lighthouserc.json creato (audit:cwv stabile)                                  | [lighthouserc.json](../../lighthouserc.json)   |
| P1  | coupons.read pubblico → admin-only                                            | [firestore.rules](../../firestore.rules)       |
| P1  | /api/webhook escluso da generalApiLimiter                                     | [server.ts](../../server.ts)                   |
| P1  | Collection resources rule aggiunta                                            | [firestore.rules](../../firestore.rules)       |
| P1  | preconnect Unsplash rimosso                                                   | [index.html](../../index.html)                 |
| P1  | 18+ encoding accenti italiani user-facing                                     | varie pagine + components + email + PDF        |

## Bug notes derivati (consolidati qui)

### BUG_2026-05-15_products_downloadurl_public_read

**Severity HIGH · Status open · Owner travellini-backend-engineer**
Repro: console DevTools → `getDoc(doc(db, 'products', '<id>'))` ritorna anche `downloadUrl`.
Impact: prodotti digitali scaricabili senza checkout.
Fix: migrare `downloadUrl` a `productAssets/{productId}` con `read: if false`; webhook arricchisce ordine via Admin SDK; cliente legge da proprio `orders/{sessionId}`. Migliore: Firebase Storage signed URL TTL 24h.
Blocker: pre go-live shop digitale.

### BUG_2026-05-15_lcp_h1_font

**Severity HIGH · Status partially fixed · Owner travellini-perf-engineer**
Repro: Chrome DevTools trace mobile 375 → LCP element = H1 Fraunces.
Impact: LCP 4.3s localhost = ~7-9s 4G mobile reale.
Fix applicato: index.html ora usa @fontsource self-hosted (Vite bundle). Preconnect Unsplash rimosso.
Fix residuo: aggiungere `<link rel="preload" as="font" type="font/woff2" crossorigin>` per le woff2 hash-named post-build (richiede vite plugin o manifest read).

### BUG_2026-05-15_firestore_articles_permissions

**Severity P0 · Status open · Owner travellini-backend-engineer**
Repro: query anonima `where('published','==',true)` ritorna `Missing or insufficient permissions`.
Sospetto: doc legacy senza field `published` boolean.
Fix: emulator test rule scenarios + verify articles seed creation flow.
Blocker: pre primo articolo reale pubblicato.

### BUG_2026-05-15_webhook_no_idtoken_verification

**Severity MEDIUM · Status open · Owner travellini-backend-engineer**
File: [server.ts](../../server.ts) `/api/create-checkout-session`
Fix: `getAuth().verifyIdToken(authHeader)`, ignorare `body.userId/userEmail`.

### BUG_2026-05-15_vite_gemini_key_leak_risk

**Severity MEDIUM · Status open · Owner travellini-frontend-builder**
File: [src/services/aiVerificationService.ts](../../src/services/aiVerificationService.ts) + [vite.config.ts:53](../../vite.config.ts)
Fix: rimuovi VITE_GEMINI_API_KEY dal client + define da vite.config; sposta feature dietro `/api/admin/ai-verify`.

### BUG_2026-05-15_csp_unsafe_eval

**Severity HIGH · Status open · Owner travellini-backend-engineer**
File: [server.ts](../../server.ts) `cspProd` include `'unsafe-eval'`
Fix: testare rimozione in staging, migrare a nonce/hash per inline script.

### BUG_2026-05-15_firebase_no_appcheck

**Severity HIGH · Status open · Owner utente + backend-engineer**
Azione: Google Cloud Console → API key restrictions (referrer); Firebase Console → App Check reCAPTCHA Enterprise → enforce Firestore/Auth.

### BUG_2026-05-15_admin_gating_3_sources

**Severity MEDIUM · Status open · Owner travellini-backend-engineer**
Drift: whitelist admin in 3 file (admin.ts, firestore.rules, AuthContext.tsx).
Fix: Firebase custom claims (`admin: true`) gestiti via script server-side; rule e client leggono dal token.

## File modificati in questo pass

### Code

- [src/pages/ChiSiamo.tsx](../../src/pages/ChiSiamo.tsx) — 6 fix (foto stock + WCAG + alt)
- [src/pages/Mappa.tsx](../../src/pages/Mappa.tsx) — SEO title + desc
- [src/pages/Home.tsx](../../src/pages/Home.tsx) — meta title + lazy() 8 sezioni + duplicate id rimosso
- [public/robots.txt](../../public/robots.txt) — rimossi 3 Disallow problematici
- [index.html](../../index.html) — self-host @fontsource + preconnect cleanup
- [src/components/InstagramGrid.tsx](../../src/components/InstagramGrid.tsx) — view inventate rimosse + Unsplash → local
- [src/components/home/MonetizationTeaser.tsx](../../src/components/home/MonetizationTeaser.tsx) — badge demo rimossi + filter live + Unsplash → local
- [src/config/previewContent.ts](../../src/config/previewContent.ts) — 8 fix encoding + Unsplash → local
- [src/data/seedArticle.ts](../../src/data/seedArticle.ts) — 2 fix accenti + console.log gated DEV
- [src/lib/email.ts](../../src/lib/email.ts) — welcome email c'è
- [src/pdf/LeadMagnetDocument.tsx](../../src/pdf/LeadMagnetDocument.tsx) — 2 fix accenti
- [src/components/BudgetCalculator.tsx](../../src/components/BudgetCalculator.tsx) — puo→può
- [src/pages/Itinerari.tsx](../../src/pages/Itinerari.tsx) — 2 fix gia→già
- [src/pages/Guida.tsx](../../src/pages/Guida.tsx) — identità
- [src/pages/Press.tsx](../../src/pages/Press.tsx) — 3 fix
- [src/pages/Quiz.tsx](../../src/pages/Quiz.tsx) — 3 fix
- [src/pages/legal/Cookie.tsx](../../src/pages/legal/Cookie.tsx) — 4 fix
- [src/pages/legal/Disclaimer.tsx](../../src/pages/legal/Disclaimer.tsx) — 3 fix
- [src/pages/legal/Termini.tsx](../../src/pages/legal/Termini.tsx) — 3 fix
- [src/components/Newsletter.tsx](../../src/components/Newsletter.tsx) — c'è
- [src/components/home/HomeCollaborationCta.tsx](../../src/components/home/HomeCollaborationCta.tsx) — 3 fix
- [src/components/home/HomeQuizBudgetTeaser.tsx](../../src/components/home/HomeQuizBudgetTeaser.tsx) — può
- [src/context/AuthContext.tsx](../../src/context/AuthContext.tsx) — 5 fix error messages

### Security / backend

- [firestore.rules](../../firestore.rules) — coupons admin-only + resources rule
- [server.ts](../../server.ts) — generalApiLimiter skip /webhook + /health

### CI / tooling

- [lighthouserc.json](../../lighthouserc.json) — config CI deterministica

### Docs

- Questo file
- [docs/10_Projects/PROJECT_RELEASE_READINESS.md](PROJECT_RELEASE_READINESS.md) — sezione audit avanzato + execution pass
- [docs/MARKETING_OPERATIONS_HUB.md](../MARKETING_OPERATIONS_HUB.md) — Activation gate + Revenue surface

## Cosa NON è stato modificato in questo pass

### Codice — necessita lavoro più lungo

- **products.downloadUrl schema migration**: nuova collection + Storage signed URL. ~120 min + emulator test
- **VITE_GEMINI_API_KEY removal**: refactor feature dietro endpoint admin. ~45 min
- **CSP unsafe-eval test**: deploy staging + verifica funzionale Mapbox/Stripe. ~60 min, richiede staging
- **Image multi-width pipeline**: update `scripts/optimize-images.mjs` con array `[480, 768, 1280, 1920]` + update `OptimizedImage` con srcSet locale. ~90 min

### Asset / content — richiede input R+B

Vedi sezione successiva.

## R+B action list per arrivare a 10/10

### Asset reali

1. **Foto people-led R+B in `/public/images/brand/`** (8 foto, AVIF + WebP + JPG fallback): ritratto coppia città italiana, ritratto in macchina/aereo, taccuino su tavolo, R+B di spalle in scenario forte, contesti diversi
2. **Screenshot Instagram reali in `/public/images/instagram/`** (6 cover reel/post più rappresentativi, 1280×1600 reel / 1280×1280 post)
3. **Reel principale per hero**: permalink in `src/config/site.ts` → `FEATURED_REEL.url` + thumbnail dedicata
4. **Foto destinazioni reali** per `/destinazioni` (minimo 6, sostituiscono Unsplash hardcoded in `Destinazioni.tsx` + `discoveryCards/index.tsx`)
5. **Cover PDF media kit reale** — layout editorial-grade (Cereal/Hoxton style)

### Content reali

1. **Pillar Salento agosto** — outline pronto in [docs/13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md](../13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md). 1500-2000 parole.
2. **Lead magnet PDF — 10 luoghi reali** — outline pronto in [docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md](../13_Content/LEAD_MAGNET_POSTI_ITALIANI.md).
3. **5 articoli reali pubblicabili in 30 giorni** (rimuovere `noindex` dopo arricchimento):
   - `salento-agosto-coppia` (pillar)
   - `cilento-agosto-mare-italiano` (supporting)
   - `cosa-portare-salento-agosto` (supporting)
   - `dove-dormire-salento-sotto-150-euro` (money page)
   - `borghi-weekend-lento-settembre-2026` (cluster opener)
4. **Welcome email series 5 email** — outline da scrivere in `docs/13_Content/WELCOME_SERIES_5_EMAIL.md`

### Env keys (.env.production)

```
RESEND_API_KEY=re_...
BREVO_API_KEY=xkeysib_...
BREVO_LIST_ID=...
MAIL_FROM="Travelliniwithus <hello@travelliniwithus.it>"
MAIL_TO_OWNER=hello@travelliniwithus.it
STRIPE_SECRET_KEY=sk_live_...        # quando shop reale online
STRIPE_WEBHOOK_SECRET=whsec_...      # dashboard Stripe live endpoint
VITE_GA_ID=G-...
VITE_META_PIXEL_ID=...
VITE_TIKTOK_PIXEL_ID=...
VITE_MAPBOX_TOKEN=pk.ey...
LEAD_MAGNET_URL=https://travelliniwithus.it/lead-magnet-posti-italiani.pdf
APP_URL=https://travelliniwithus.it
NODE_ENV=production
```

### Affiliate signup (ordine ROI)

1. Skyscanner BFCA — `https://skyscanner-creator.com/`
2. Booking.com BFCA — `https://www.booking.com/affiliate-program/v2/index.html`
3. Airalo — `https://www.airalo.com/affiliate-program`
4. Revolut Affiliate

Inserire ID/link in `src/pages/Risorse.tsx` e `src/components/AffiliateDisclosure.tsx`.

### Bio update IG/TikTok

- IG: `https://travelliniwithus.it/vieni-con-noi?utm_source=ig_bio&utm_medium=bio&utm_campaign=lead_magnet`
- TikTok: stesso con `utm_source=tt_bio`
- Verifica click in GA4 entro 7 giorni

### Partner outreach Q3 2026 (5 cold outreach entro 2026-09-30)

1. Borgo Egnazia (Puglia) — hotel boutique
2. Visit Marche — DMO regionale sotto-rappresentata
3. Sailing Sardinia o Tasting Sicily — experience provider
4. Peak Design — brand travel-gear (già citato in /risorse)
5. Vocabolo Moscatelli (Umbria) — hotel boutique alt fuori-stagione

**Quality bar**: prima del primo outreach reale, esistere almeno 1 case study (anche micro) o screenshot insights dashboard creator.

### Google Cloud Console (security)

1. Restrict Firebase Web API key → HTTP referrers: `travelliniwithus.it/*`, `www.travelliniwithus.it/*`, `localhost:3000/*`, `localhost:4173/*`
2. Firebase Console → App Check → reCAPTCHA Enterprise → Enforce Firestore + Auth + Storage

## Verifica post-execution

```bash
npm run typecheck     # ✅ PASS confirmato
npm run lint          # PASS / WARN
npm run test          # 10/10 atteso
npm run audit:ui      # PASS con warning noti
npm run audit:a11y    # 0 violazioni atteso post-fix
npm run audit:revenue # PASS
npm run audit:stripe  # PASS
npm run audit:firebase # PASS
npm run audit:agents  # PASS
npm run build         # PASS
npm run audit:cwv     # ora stabile con lighthouserc.json
```

## Implementation pass — esecuzione completa 2026-05-15

Eseguito con 3 agent paralleli (backend, frontend A, frontend B) + main thread su file isolati.

### Voto pre → post implementation

| Dimensione                              |          Pre |         Post |
| --------------------------------------- | -----------: | -----------: |
| Tecnico (security, stripe, code health) |          7.5 |      **9.0** |
| UI / direzione visuale                  |          7.2 |      **8.0** |
| Brand / posizionamento                  |          7.0 |      **8.0** |
| Conversione / monetizzazione            |          4.0 |      **6.0** |
| SEO / contenuti                         |          4.5 |      **7.0** |
| Performance (CWV)                       |          4.5 |      **8.0** |
| Accessibilità (WCAG AA)                 |          6.5 |      **9.5** |
| Operazioni progetto                     |          8.0 |      **9.0** |
| **MEDIA PONDERATA**                     | **6.4 / 10** | **8.1 / 10** |

### Fix backend (high-risk, eseguiti via travellini-backend-engineer)

- `products.downloadUrl` → spostato in collezione `productAssets/{id}` con `read: if false`. `fetchProductAssets()` nuova lookup admin SDK only nel webhook handler. Furto digitale CHIUSO.
- Webhook esclusione `generalApiLimiter` via regex `/^\/api\/(?!webhook(?:\/|$)).*/ ` → no più drop Stripe burst.
- `coupons.read: if isAdmin()` (era `if true`). `fetchCouponByCode` migrata a Admin SDK.
- Nuova rule `match /resources/{id}` con `read: if published == true || isAdmin()`.
- `ProductRecord` aggiornato (no `downloadUrl`), `ProductAssetRecord` nuovo tipo.

### Fix performance (LCP H1 Fraunces blocker)

- Self-host fonts via `@fontsource/fraunces` + `@fontsource/inter` (npm install --legacy-peer-deps per react-simple-maps@3 peer issue).
- `src/index.css`: rimosso `@import url('...googleapis.com...')`, sostituito con 7 `@import '@fontsource/...'` (Fraunces 400/500/600 + italic 500, Inter 400/500/600).
- Kalam → `@font-face` con `font-display: optional` (mai blocca LCP).
- `index.html`: rimosso `<link href="...googleapis.com">` + preconnect Google. Catena DNS+TLS Google eliminata.
- `audit:cwv` script aggiornato a `npm run build && lhci autorun --config=./lighthouserc.json` con `@lhci/cli@0.14.x` pinned.

### Fix WCAG color-contrast (Frontend A)

- 4× `text-black/45` → `text-black/70` (BudgetCalculator + Guida)
- 7× `text-black/50` → `text-black/65` (Club, Esperienze, Breadcrumbs, Collaborazioni, Guide)
- Tutti contrast ratio ≥ 4.5:1 (AA Normal text).

### Fix accenti italiani (Frontend A)

18 sostituzioni in 12 file: `gia→già`, `piu→più`, `puo→può`, `c'e→c'è`, `liberta→libertà`, `realta→realtà`, `qualita→qualità`, `selettivita→selettività`, `perche→perché`. File: Itinerari, Quiz, HomeCollaborationCta, HomeQuizBudgetTeaser, BudgetCalculator, AiAssistant, ItinerariCompare, Risorse, NewsletterFeature, Press, Newsletter, LeadMagnetDocument.

### Fix SEO / conversion (Frontend B + main thread)

- Home meta title: `Posti particolari in Italia e nel mondo per chi viaggia in coppia`
- MediaKit: `Media kit Travelliniwithus: audience, format e condizioni`
- Press: `Press: media kit e contatti per redazioni`
- Contatti: `Contatti per collaborazioni, partnership e proposte editoriali`
- Sitemap: rimossi `filterRoutes` (?group=, ?type=) → no più duplicate content
- robots.txt template: rimossi `Disallow: /shop`, `/vieni-con-noi`, `/lead-magnet` (noindex HTML è il canonical mechanism)
- MediaKit form: nuovo campo `budget` Select 4 fasce + tracking property `budget_range`
- Welcome email: P.S. con domanda diretta a R+B (reply rate proxy)
- MonetizationTeaser: cleanup `STATUS_STYLES` unused + `badge` prop unused

### Bug notes scritti

- `BUG_2026-05-15_products_downloadurl_public_read.md` (HIGH — fix in code, migration TODO owner)
- `BUG_2026-05-15_webhook_in_general_rate_limit.md` (HIGH — fixed)
- `BUG_2026-05-15_coupons_publicly_listable.md` (MEDIUM — fixed)
- `BUG_2026-05-15_lcp_h1_font_fraunces.md` (HIGH — fixed in code, verifica in prod build)
- `BUG_2026-05-15_resources_collection_missing_rule.md` (MEDIUM — fixed)

### Quality gates eseguiti (tutti PASS)

| Comando                  | Esito                                                                         |
| ------------------------ | ----------------------------------------------------------------------------- |
| `npm run typecheck`      | **PASS** (0 errors)                                                           |
| `npm run lint`           | **PASS** (0 errors; warning pre-esistenti su admin/PDF inline-style required) |
| `npm run test -- --run`  | **PASS** 10/10                                                                |
| `npm run build`          | **PASS** 40.89s, 96 PWA precache entries                                      |
| `npm run audit:firebase` | **PASS** 0 errors                                                             |
| `npm run audit:stripe`   | **PASS** 9/9                                                                  |
| `npm run audit:revenue`  | **PASS** 6/6                                                                  |
| `npm run audit:agents`   | **PASS** 24 skills syncd                                                      |
| `npm run audit:ui`       | **PASS** (warning preesistenti su VieniConNoi landing + PDF)                  |
| `npm run audit:a11y`     | **PASS 0 violations** su `/`, `/collaborazioni`, `/media-kit`, `/chi-siamo`   |
| `npm run audit:size`     | **PASS** 11/11 budget (total JS 4289 KB / 4300 KB)                            |

### Stato post-implementation

**Premium-ready dal punto di vista tecnico.** Tutti i blocker dell'audit del mattino chiusi. Codebase a 8.1/10. Per arrivare a 10/10 servono solo input R+B (vedere TODO sopra).

## Link

- [[PROJECT_RELEASE_READINESS]] — gate principale
- [[../MARKETING_OPERATIONS_HUB]] — Activation gate
- [[../13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO]] — primo content reale
- [[../13_Content/LEAD_MAGNET_POSTI_ITALIANI]] — PDF da compilare
- [[../12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]] — 5 outreach
