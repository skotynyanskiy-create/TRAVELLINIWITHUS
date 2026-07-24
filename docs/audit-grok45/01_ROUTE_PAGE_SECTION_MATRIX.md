---
type: reference
area: quality
status: active
owner: team
tags:
  - reference
---

# 01 — Route / Page / Section Matrix

**Snapshot:** 2026-07-24  
**Fonte primaria routing:** `src/App.tsx`  
**Layout shell:** `src/components/Layout.tsx` → `Navbar` + `<Outlet />` + `Footer`  
**Label:** VERIFICATO DAL ROUTING | VERIFICATO DAL CODICE | INFERENZA RAGIONEVOLE

---

## 1. Conteggio sintetico

| Metrica                                                                                 |                                               Valore | Label                  |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------: | ---------------------- |
| Path pattern definiti in `App.tsx` (incl. redirect, admin, catch-all, DEV condizionali) |                                              **~52** | VERIFICATO DAL ROUTING |
| Redirect-only client                                                                    |                                               **13** | VERIFICATO DAL ROUTING |
| Pagine/componenti page attivi (non-pure-redirect)                                       | **~32** (pubblici + admin + legal + manifesto + DEV) | VERIFICATO DAL ROUTING |
| Pagine pubbliche attive (esclusi admin/DEV/catch-all)                                   |                               **~26** famiglie route | VERIFICATO DAL ROUTING |
| Route orfane di pagina (file page non wired)                                            |                                  **1** (`Press.tsx`) | VERIFICATO DAL CODICE  |
| Homepage alternative (component family non su `/`)                                      |                                      **≥6** famiglie | VERIFICATO DAL CODICE  |
| Navbar attive                                                                           |                                                **1** | VERIFICATO DAL CODICE  |
| Footer attivi                                                                           |               **1** (nascosto su `/guida-in-regalo`) | VERIFICATO DAL CODICE  |
| Full React SSR                                                                          |                         **0** (CSR + meta injection) | VERIFICATO DAL CODICE  |

---

## 2. Shell e navigazione

| Ruolo         | Implementazione attiva                    | Alternative                                                                           | Status                               |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| Homepage      | `/` → `AtlanteHome` → `CinematicHomepage` | Diario (DEV), Sentiero/Atlante3D (orfani), Controluce (`/manifesto`), hero kit unused | ATTIVA                               |
| Navbar        | `src/components/Navbar.tsx`               | nessuna seconda implementazione runtime                                               | ATTIVA                               |
| Footer        | `src/components/Footer.tsx`               | nessuna                                                                               | ATTIVA                               |
| Layout router | `Layout.tsx`                              | —                                                                                     | ATTIVA                               |
| Page chrome   | `PageLayout.tsx`                          | —                                                                                     | ATTIVA (quasi tutte le content page) |
| Admin gate    | `ProtectedRoute.tsx`                      | —                                                                                     | ATTIVA                               |

### Nav primaria (hardcoded Navbar + labels siteContent)

| Label tipico     | Target                                              | Note                                                        |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| Destinazioni     | `/destinazione` (+ Italia/Europa)                   |                                                             |
| Guide e racconti | `/esplora` (+ filter format, `/itinerari`)          |                                                             |
| Mappa            | `/mappa`                                            |                                                             |
| Chi siamo        | `/chi-siamo`                                        |                                                             |
| CTA              | `/guida-in-regalo`, `/collaborazioni`, `/media-kit` |                                                             |
| Mode switch      | B2C ↔ B2B                                           | WIP: switch naviga a `/collaborazioni` o `/` + localStorage |

Footer: shop, club, preferiti, risorse, legal, admin se loggato.  
Label: VERIFICATO DAL CODICE (WIP Navbar su dirty tree).

---

## 3. Tabella route completa

### 3.1 Redirect client

| Path               | Target                  | Layout | Status                  |
| ------------------ | ----------------------- | ------ | ----------------------- |
| `/iscrivi`         | `/guida-in-regalo`      | None   | REDIRECT                |
| `/italia-nascosta` | `/guida-in-regalo`      | None   | REDIRECT                |
| `/v2`              | `/`                     | None   | REDIRECT (ex home V2)   |
| `/atlante-lab`     | `/`                     | None   | REDIRECT                |
| `/sentiero`        | `/`                     | None   | REDIRECT (ex home 3D)   |
| `/atlante`         | `/`                     | Layout | REDIRECT                |
| `/destinazioni`    | `/esplora`              | Layout | REDIRECT (+ server 301) |
| `/esperienze`      | `/esplora`              | Layout | REDIRECT (+ server 301) |
| `/blog`            | `/esplora`              | Layout | REDIRECT                |
| `/guide`           | `/esplora?format=guida` | Layout | REDIRECT                |
| `/press`           | `/collaborazioni`       | Layout | REDIRECT                |
| `/quiz`            | `/esplora`              | Layout | REDIRECT                |
| `/strumenti`       | `/esplora`              | Layout | REDIRECT                |

### 3.2 Pubbliche attive

| Path                               | Componente                        | Layout           | Tipo         | Dati (import)                 | Nav          | Footer | Status                 | Browser audit |
| ---------------------------------- | --------------------------------- | ---------------- | ------------ | ----------------------------- | ------------ | ------ | ---------------------- | ------------- |
| `/`                                | `AtlanteHome`→`CinematicHomepage` | Layout           | static       | site + seed + reels           | sì (logo)    | sì     | **ATTIVA**             | P0            |
| `/guida-in-regalo`                 | `VieniConNoi`                     | Layout no Footer | static       | site + lead API               | CTA          | no     | **ATTIVA**             | P0            |
| `/esplora`                         | `Esplora`                         | Layout+PL        | static+query | FS/seed/demo                  | sì           | sì     | **ATTIVA**             | P0            |
| `/destinazione`                    | `Destinazione` hub                | Layout+PL        | static       | destinations + library        | sì           | sì     | **ATTIVA**             | P1            |
| `/destinazione/:zoneSlug`          | `Destinazione`                    | Layout+PL        | dynamic      | destinations tree             | indiretto    | sì     | **DINAMICA**           | P1            |
| `/destinazione/:zoneSlug/:subSlug` | `Destinazione`                    | Layout+PL        | dynamic      | tree                          | indiretto    | sì     | **DINAMICA**           | P1            |
| `/chi-siamo`                       | `ChiSiamo`                        | Layout+PL        | static       | siteContent + site            | sì           | sì     | **ATTIVA**             | P1            |
| `/collaborazioni`                  | `Collaborazioni`                  | Layout+PL        | static       | site + stats + collab widgets | CTA B2B      | sì     | **ATTIVA**             | P0            |
| `/media-kit`                       | `MediaKit`                        | Layout+PL        | static       | site + form API               | CTA          | sì     | **ATTIVA**             | P0            |
| `/contatti`                        | `Contatti`                        | Layout+PL        | static       | contacts + API                | footer       | sì     | **ATTIVA**             | P1            |
| `/articolo/:slug`                  | `Articolo`                        | Layout+PL        | dynamic      | FS + PREVIEW                  | indiretto    | sì     | **DINAMICA**           | P1            |
| `/itinerari`                       | `Itinerari`                       | Layout+PL        | static       | DEMO_ITINERARIES              | footer badge | sì     | **ATTIVA** (preview)   | P1            |
| `/itinerari/compare`               | `ItinerariCompare`                | Layout+PL        | static       | demo                          | link interno | sì     | **ATTIVA** (preview)   | P2            |
| `/itinerari/:slug`                 | `Itinerario`                      | Layout+PL        | dynamic      | demo                          | indiretto    | sì     | **DINAMICA** (preview) | P1            |
| `/guide/:slug`                     | `Guida`                           | Layout+PL        | dynamic      | DEMO_GUIDES                   | indiretto    | sì     | **DINAMICA** (preview) | P1            |
| `/preferiti`                       | `Preferiti`                       | Layout+PL        | static       | Favorites + FS                | footer       | sì     | **ATTIVA** (private)   | P2            |
| `/risorse`                         | `Risorse`                         | Layout+PL        | static       | FS + locale                   | footer       | sì     | **ATTIVA**             | P2            |
| `/shop`                            | `Shop`                            | Layout+PL        | static       | FS + DEMO waitlist            | footer       | sì     | **ATTIVA** (soon)      | P1            |
| `/shop/:slug`                      | `ProductPage`                     | Layout+PL        | dynamic      | FS + demo                     | indiretto    | sì     | **DINAMICA** (soon)    | P1            |
| `/club`                            | `Club`                            | Layout+PL        | static       | Auth + FS                     | footer       | sì     | **ATTIVA**             | P1            |
| `/posto/:slug`                     | `Posto`                           | Layout+PL        | dynamic      | contentLibrary seed           | indiretto    | sì     | **DINAMICA**           | P0            |
| `/mappa`                           | `Mappa`→FullScreenMap             | Layout           | static       | seed + MapLibre               | sì           | sì     | **ATTIVA**             | P0            |
| `/account/acquisti`                | `MieiAcquisti`                    | Layout+PL        | static       | Auth + orders                 | account      | sì     | **ATTIVA** (private)   | P2            |
| `/lead-magnet`                     | `LeadMagnet`                      | Layout+PL        | static       | session gate + PDF            | gated        | sì     | **ATTIVA**             | P1            |
| `/privacy`                         | `Privacy`                         | Layout+PL        | static       | hardcoded                     | footer       | sì     | **ATTIVA**             | P2            |
| `/cookie`                          | `Cookie`                          | Layout+PL        | static       | hardcoded                     | footer       | sì     | **ATTIVA**             | P2            |
| `/termini`                         | `Termini`                         | Layout+PL        | static       | hardcoded                     | footer       | sì     | **ATTIVA**             | P2            |
| `/disclaimer`                      | `Disclaimer`                      | Layout+PL        | static       | hardcoded                     | footer       | sì     | **ATTIVA**             | P2            |
| `*`                                | `NotFound`                        | Layout+PL        | static       | —                             | —            | sì     | **ATTIVA**             | P2            |

### 3.3 Lab / sperimentale / admin

| Path                          | Componente                   | Status            | Note                       |
| ----------------------------- | ---------------------------- | ----------------- | -------------------------- |
| `/manifesto`                  | `ManifestoPage` (Controluce) | **SPERIMENTALE**  | fuori Layout, noindex      |
| `/diario-preview`             | `DiarioPreview`              | **PROTOTIPO**     | solo `import.meta.env.DEV` |
| `/_dev/diario-preview`        | `DiarioPreview`              | **PROTOTIPO**     | duplicato DEV              |
| `/admin`                      | `AdminDashboard`             | **ATTIVA** (auth) |                            |
| `/admin/site-content/:pageId` | `SiteContentEditor`          | **DINAMICA**      |                            |
| `/admin/editor`               | `ArticleEditor`              | **ATTIVA**        |                            |
| `/admin/editor/:id`           | `ArticleEditor`              | **DINAMICA**      |                            |
| `/admin/product-editor`       | `ProductEditor`              | **ATTIVA**        |                            |
| `/admin/product-editor/:id`   | `ProductEditor`              | **DINAMICA**      |                            |
| `/admin/users`                | `Users`                      | **ATTIVA**        |                            |
| `/admin/orders`               | `Orders`                     | **ATTIVA**        |                            |

### 3.4 Server redirect (Express)

| Path                             | Target                   | Status   |
| -------------------------------- | ------------------------ | -------- |
| `/articoli`, `/articoli/*`       | `/guide`, `/guide/*` 301 | REDIRECT |
| `/destinazioni*`, `/esperienze*` | `/esplora` 301           | REDIRECT |

Label: VERIFICATO DAL CODICE (`server.ts`).

---

## 4. Inventario sezioni — pagine attive chiave

### 4.1 Homepage `/` — `CinematicHomepage.tsx`

| #   | Sezione           | Componente               | File                                     | Scopo           | Pubblico    | Dati                            | CTA             | Interazione | Anim    | Browser  |
| --- | ----------------- | ------------------------ | ---------------------------------------- | --------------- | ----------- | ------------------------------- | --------------- | ----------- | ------- | -------- |
| 1   | Hero              | `CleanCuratedHero`       | `home/curated/CleanCuratedHero.tsx`      | Promise + trust | both        | `BRAND_*`, image                | Esplora, Guida  | link        | pulse   | P0 LCP   |
| 2   | Featured places   | `CleanFeaturedPlaces`    | `home/curated/CleanFeaturedPlaces.tsx`   | 3 posti pin     | viaggiatori | hardcoded array                 | Esplora / posto | card        | —       | P1       |
| 3   | Map teaser        | `HomeMapSection`         | `home/HomeMapSection.tsx`                | push mappa      | viaggiatori | MapLibre lazy                   | Apri mappa      | hover       | in-view | P0 tiles |
| 4   | Editorial promise | `CleanEditorialPromise`  | `home/curated/CleanEditorialPromise.tsx` | 3 pilastri      | both        | `BRAND_PROMISE` + body hardcode | —               | —           | —       | P1 claim |
| 5   | Reels             | `HiggsfieldReelCarousel` | lazy                                     | video locale    | viaggiatori | `reels.ts`                      | IG / posto      | modal       | motion  | P0 video |
| 6   | Indice vivo       | `HomeIndiceVivo`         | lazy                                     | ledger posti    | viaggiatori | contentLibrary                  | Mappa, Esplora  | cards       | —       | P1       |

**NON in home live:** `WeekendGeneratorWidget` (file orfano).  
Label: VERIFICATO DAL CODICE.

### 4.2 Esplora `/esplora`

1. Header + search
2. Guide intents chips
3. Type chips + advanced filters
4. Editorial collections
5. Results grid (FS | seed | DEMO)
6. Inline map toggle
7. Newsletter
8. Cross-link itinerari

**Rischio:** preview/noindex se solo placeholder. Browser P0.

### 4.3 Destinazione `/destinazione/*`

| Mode          | Sezioni tipiche                                                              |
| ------------- | ---------------------------------------------------------------------------- |
| Hub           | SEO, breadcrumbs, H1, search+pills, cards                                    |
| Zone/sub      | Hero cover, breadcrumbs, children, content by intention, cards, map, related |
| Legacy region | template `lib/regions.ts`                                                    |

Browser P1 hierarchical empty states.

### 4.4 Mappa `/mappa`

Un mega-componente `FullScreenMapExperience`: pins seed, filtri, drawer, sound, breakpoint desktop ≥1024×800 vs mobile panel. Browser P0.

### 4.5 Posto `/posto/:slug`

1. PostoStamp
2. H1 + VerdictSeal
3. Salva / Condividi
4. Info pratiche (ore/phone se presenti)
5. ReviewBlock
6. DealCard
7. PostNavigation
8. Newsletter

**noindex se placeholder** — seed 40/40. Browser P0.

### 4.6 Articolo `/articolo/:slug`

Hero → overview → body → pratico → itinerario → mappa → consigli → risorse → author/related → mobile TOC/bar. Dati FS o PREVIEW. Browser P1.

### 4.7 Itinerari / Guide (demo)

| Page                 | Sezioni                                  | Dati             |
| -------------------- | ---------------------------------------- | ---------------- |
| `/itinerari`         | hero, filters, cards, compare            | DEMO (3 visible) |
| `/itinerari/:slug`   | hero, days, cost                         | DEMO             |
| `/itinerari/compare` | table                                    | DEMO             |
| `/guide/:slug`       | hero, price, inside, gallery, sticky CTA | DEMO locked      |

### 4.8 Chi siamo

1. Hero + stats
2. Notebook portrait
3. Focus / principles (CMS)
4. Timeline 2016–2026
5. Guardrails + credentials
6. Audience + CTA collab
7. Newsletter

### 4.9 Collaborazioni (B2B) — 14 sezioni

| #   | Sezione                 | Componente / note                    |
| --- | ----------------------- | ------------------------------------ |
| 1   | Hero + checklist + CTAs | page                                 |
| 2   | Stats strip             | BRAND_STATS / fetchStats             |
| 3   | Partner areas           | PARTNER_AREAS                        |
| 4   | Proof sobria            | PROOF_SIGNALS                        |
| 5   | Public proof links      | PUBLIC_PROOF_SIGNALS (Castelli URLs) |
| 6   | **RoiCalculatorWidget** | tier €1200/3000/6000 stime           |
| 7   | **CaseStudiesSection**  | 3 case + metriche hardcode           |
| 8   | **PressProofSection**   | quote media senza URL                |
| 9   | Services                | siteContent                          |
| 10  | Anti-targets            | “no desk reviews”                    |
| 11  | Process                 | siteContent                          |
| 12  | Formats + CTAs          | media-kit / contatti                 |
| 13  | FAQ + JsonLd            |                                      |
| 14  | StickyMobileCTA         |                                      |

Browser P0 — claim surface critica.

### 4.10 Media kit

Hero stats → public proof → qualifying → package previews → PDF slides mock → form → sticky CTA. Browser P0 form.

### 4.11 Contatti

Hero → recapiti → form B2C/B2B (WIP: company/budget UI). Browser P1 payload.

### 4.12 Shop / Club / Lead / Legal / 404

| Page            | Sezioni chiave                          | Note          |
| --------------- | --------------------------------------- | ------------- |
| Shop            | waitlist hero, filters, cards, approach | cart disabled |
| Product         | detail waitlist                         | demo fallback |
| Club            | hero, lock, FAQ, waitlist / logged tabs |               |
| guida-in-regalo | hero, cover, form, value                | no footer     |
| lead-magnet     | unlock PDF                              | session gate  |
| legal×4         | prose                                   | hardcoded     |
| 404             | message + CTA home/esplora/mappa        |               |
| manifesto       | WebGL Controluce                        | sperimentale  |

---

## 5. Componenti alternativi e codice non attivo

| Asset                                               | Import runtime                                   | Status           | Rischio                          |
| --------------------------------------------------- | ------------------------------------------------ | ---------------- | -------------------------------- |
| `WeekendGeneratorWidget.tsx`                        | nessuno su path prod                             | ORFANA           | rumore; allineato rimozione home |
| `DiarioMasterpieceHome` + stack                     | solo DEV routes                                  | PROTOTIPO        | non shippare senza gate          |
| `experience/sentiero/*`                             | no route UI; data usata da server prerender home | LEGACY/ORFANA UI | drift SEO HTML                   |
| `experience/atlante/*`                              | nessuno                                          | ORFANA           | dead weight                      |
| Wow / Immersive / Innovative / BrandCoherent heroes | nessuno                                          | ORFANA           | ≥5 famiglie                      |
| `pages/Press.tsx`                                   | non lazy in App; `/press` redirect               | ORFANA           | surfaces.ts ancora `live`        |
| `ATLANTE_PREVIEW` flag                              | non consumato                                    | LEGACY           |                                  |
| Controluce `/manifesto`                             | sì                                               | SPERIMENTALE     | ok se noindex                    |

**Homepage alternative count (component families):** ≥6  
**Navbar alternative:** 0  
**Footer alternative:** 0

Label: VERIFICATO DAL CODICE.

---

## 6. Inconsistenze routing / surfaces / SEO

| Issue                                                            | Evidenza                | Label                         |
| ---------------------------------------------------------------- | ----------------------- | ----------------------------- |
| `/press` live in `surfaces.ts` + sitemap server, ma App redirect | surfaces + App + server | VERIFICATO DAL CODICE         |
| `/manifesto` private ma fuori nav/Layout                         | App                     | VERIFICATO DAL ROUTING        |
| Home prerender ancora `injectSentieroPrerender`                  | server.ts               | LEGACY residue                |
| Dual path Diario DEV                                             | App                     | VERIFICATO DAL ROUTING        |
| Commenti stale su Sentiero come home                             | atlantePreview / docs   | CONTRADDETTO dal routing live |

---

## 7. Matrice priorità browser (prossima fasi)

| Priorità | Route                                                                                      |
| -------- | ------------------------------------------------------------------------------------------ |
| P0       | `/`, `/collaborazioni`, `/media-kit`, `/mappa`, `/posto/*`, `/esplora`, `/guida-in-regalo` |
| P1       | destinazioni, articolo, shop, club, contatti, chi-siamo, itinerari/guide                   |
| P2       | legal, preferiti, risorse, 404, admin smoke                                                |

---

## 8. Note metodologiche

- Un componente **esiste** ≠ è **attivo** (es. WeekendGenerator, Press.tsx).
- Una route **esiste** ≠ è **collegata** da nav (es. `/manifesto`, `/disclaimer`).
- Surface `preview`/`soon` ≠ nascosta da crawler automaticamente — serve verifica SEO successiva.
- Questa matrice è input per FASE 4–14; **nessuna valutazione UX definitiva qui**.
