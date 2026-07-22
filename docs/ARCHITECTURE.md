---
type: reference
area: delivery
status: active
created: 2026-07-22
tags:
  - architecture
  - routing
  - build
---

# Architettura del sito — stato reale

Fotografia dell'architettura **come è oggi nel codice**, non come è stata
pianificata. Ogni affermazione è derivata leggendo i file citati. Se una nota di
progetto contraddice questo documento, vince il codice.

Fonti lette: `src/App.tsx`, `server.ts`, `vite.config.ts`, `package.json`,
`src/config/liteMode.ts`, `src/components/ProtectedRoute.tsx`,
`scripts/public-route-manifest.js`, `scripts/generate-sitemap.js`,
`src/context/`, `src/lib/`, `src/services/`.

---

## 1. Modello di rendering

SPA React 19 servita da Express.

- **Client**: `src/App.tsx` monta `BrowserRouter` di `react-router-dom` dentro
  una catena di provider: `HelmetProvider` → `QueryClientProvider`
  (`@tanstack/react-query`) → `AuthProvider` → `CartProvider` →
  `FavoritesProvider`. Tutte le pagine tranne `Mappa` sono in `React.lazy` dietro
  un unico `<Suspense>` con fallback brandizzato (`PageLoader`).
- **Server**: `server.ts` (avviato via `tsx` — `npm run dev` / `npm start`) NON
  fa SSR di React. Legge `index.html` (da Vite in dev, da `dist/` in produzione)
  e **inietta meta tag + JSON-LD nell'HTML** prima di restituirlo, poi lascia che
  il bundle client idrati tutto.

### Cosa fa esattamente l'iniezione SSR (`server.ts`)

| Percorso          | Funzione                  | Dati                                                                                                                                                                                                                  |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/articolo/:slug` | `injectMetaTags`          | Firestore REST (`articles`, filtro `published`), cache `NodeCache` TTL 300s. JSON-LD `Article`, più `HowTo` o `FAQPage` se `category === 'Guide'`, più `TouristDestination` se c'è `location`                         |
| `/shop/:slug`     | `injectProductMetaTags`   | Firestore REST (`products`), JSON-LD `Product` + `Offer`                                                                                                                                                              |
| rotte statiche    | `injectStaticMeta`        | Tabella hard-coded `STATIC_ROUTE_META` (12 percorsi: `/`, `/chi-siamo`, `/esplora`, `/mappa`, `/collaborazioni`, `/media-kit`, `/contatti`, `/risorse`, `/club`, `/shop`, `/press`, `/strumenti`) — JSON-LD `WebPage` |
| `/`               | `injectSentieroPrerender` | Inietta dentro `<div id="root">` un blocco `.sr-only` generato da `SENTIERO_STAGES` (`src/experience/sentiero/sentieroData`)                                                                                          |

`resolveAppStatus(pathname)` decide lo **status HTTP** della navigazione (200 vs 404) per i crawler, senza renderizzare l'app: consulta `STATIC_APP_ROUTES`, i set
di slug demo (`DEMO_PREVIEW_ARTICLE_SLUGS`, `DEMO_PRODUCT_SLUGS`),
`VALID_DESTINATION_PATHS` e, in ultima istanza, Firestore.

> Nota: `injectSentieroPrerender` gira ancora sulla home anche se la home
> renderizzata è `AtlanteHome` → `CinematicHomepage`, non l'esperienza Sentiero.
> Il prerender testuale e la pagina reale non descrivono più la stessa cosa.
> [VERIFY: decidere se il blocco va aggiornato al nuovo montaggio o rimosso.]

### Altri endpoint serviti da `server.ts`

`GET /api/health` · `POST /api/webhook` (Stripe, `express.raw`) ·
`POST /api/newsletter-subscribe` · `POST /api/contact-lead` ·
`POST /api/media-kit-lead` · `POST /api/create-checkout-session` ·
`POST /api/admin/ai-verify` · `POST /api/validate-coupon` ·
`POST /api/ai-companion` (stub: risponde 503 finché mancano le chiavi) ·
`GET /sitemap.xml` (dinamico) · `GET /rss.xml` ·
redirect 301 `/articoli/*` → `/guide/*`, `/destinazioni/*` e `/esperienze/*` → `/esplora`.

Rate limit differenziati (`express-rate-limit`), CORS su allowlist esplicita,
header di sicurezza + CSP in produzione, fail-fast all'avvio se `APP_URL` manca
in produzione.

---

## 2. Mappa delle rotte (`src/App.tsx`)

`LITE_MODE` = `import.meta.env.VITE_LITE_MODE === 'true'`
(`src/config/liteMode.ts`). Le rotte marcate _lite-gated_ **non vengono proprio
registrate** quando è attivo.

### Fuori dal `Layout` (nessuna navbar/footer)

| Rotta                              | Componente                                     | Note                              |
| ---------------------------------- | ---------------------------------------------- | --------------------------------- |
| `/vieni-con-noi`                   | `VieniConNoi`                                  | lazy — landing bio-link IG/TikTok |
| `/iscrivi`                         | → redirect `/vieni-con-noi`                    |                                   |
| `/v2`, `/atlante-lab`, `/sentiero` | → redirect `/`                                 | home sperimentali disattivate     |
| `/manifesto`                       | `ManifestoPage` (`src/experience/controluce/`) | lazy — lab WebGL, noindex         |

### Dentro `<Layout />` (eager)

| Rotta                                                                            | Componente                         | Caricamento | Condizione                                                                             |
| -------------------------------------------------------------------------------- | ---------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `/`                                                                              | `AtlanteHome`                      | lazy        | —                                                                                      |
| `/atlante`                                                                       | → redirect `/`                     | —           | —                                                                                      |
| `/esplora`                                                                       | `Esplora`                          | lazy        | lite-gated                                                                             |
| `/destinazione` · `/destinazione/:zoneSlug` · `/destinazione/:zoneSlug/:subSlug` | `Destinazione`                     | lazy        | —                                                                                      |
| `/destinazioni` · `/esperienze` · `/blog`                                        | → redirect `/esplora`              | —           | lite-gated                                                                             |
| `/guide`                                                                         | → redirect `/esplora?format=guida` | —           | lite-gated                                                                             |
| `/chi-siamo`                                                                     | `ChiSiamo`                         | lazy        | —                                                                                      |
| `/collaborazioni`                                                                | `Collaborazioni`                   | lazy        | —                                                                                      |
| `/media-kit`                                                                     | `MediaKit`                         | lazy        | —                                                                                      |
| `/press`                                                                         | `Press`                            | lazy        | —                                                                                      |
| `/contatti`                                                                      | `Contatti`                         | lazy        | —                                                                                      |
| `/articolo/:slug`                                                                | `Articolo`                         | lazy        | —                                                                                      |
| `/itinerari`                                                                     | `Itinerari`                        | lazy        | lite-gated                                                                             |
| `/itinerari/compare`                                                             | `ItinerariCompare`                 | lazy        | lite-gated                                                                             |
| `/itinerari/:slug`                                                               | `Itinerario`                       | lazy        | lite-gated                                                                             |
| `/guide/:slug`                                                                   | `Guida`                            | lazy        | —                                                                                      |
| `/quiz`                                                                          | → redirect `/esplora`              | —           | lite-gated                                                                             |
| `/strumenti`                                                                     | `Strumenti`                        | lazy        | —                                                                                      |
| `/preferiti`                                                                     | `Preferiti`                        | lazy        | lite-gated                                                                             |
| `/risorse`                                                                       | `Risorse`                          | lazy        | —                                                                                      |
| `/shop`                                                                          | `Shop`                             | lazy        | lite-gated                                                                             |
| `/shop/:slug`                                                                    | `ProductPage`                      | lazy        | lite-gated                                                                             |
| `/club`                                                                          | `Club`                             | lazy        | lite-gated                                                                             |
| `/posto/:slug`                                                                   | `Posto`                            | lazy        | —                                                                                      |
| `/mappa`                                                                         | `Mappa`                            | **eager**   | shell editoriale eager per rendere subito l'H1; MapLibre resta lazy dentro `Mappa.tsx` |
| `/_dev/diario-preview`                                                           | `DiarioPreview`                    | lazy        | **solo `import.meta.env.DEV`** — mai registrata in produzione                          |
| `/account/acquisti`                                                              | `MieiAcquisti`                     | lazy        | —                                                                                      |
| `/lead-magnet`                                                                   | `LeadMagnet`                       | lazy        | —                                                                                      |
| `/privacy` · `/cookie` · `/termini` · `/disclaimer`                              | `legal/*`                          | lazy        | —                                                                                      |
| `*`                                                                              | `NotFound`                         | lazy        | —                                                                                      |

### Rotte admin (tutte dentro `<ProtectedRoute>`, tutte lazy)

`/admin` → `AdminDashboard` · `/admin/site-content/:pageId` → `SiteContentEditor` ·
`/admin/editor` e `/admin/editor/:id` → `ArticleEditor` ·
`/admin/product-editor` e `/admin/product-editor/:id` → `ProductEditor` ·
`/admin/users` → `Users` · `/admin/orders` → `Orders`.

`ProtectedRoute` (`src/components/ProtectedRoute.tsx`) è un **gate client-side**:
richiede `user` + `isAdmin` da `AuthContext`. Esiste una scorciatoia di anteprima
`?previewAdmin=1`, attiva solo se `import.meta.env.DEV` **e** hostname
`localhost`/`127.0.0.1`, persistita in `sessionStorage`. La protezione reale dei
dati resta su `firestore.rules`, non qui.

---

## 3. Stato e livello dati

### Context (`src/context/`)

| File                   | Ruolo                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `AuthContext.tsx`      | Firebase Auth (Google sign-in), flag `isAdmin`, `authError`           |
| `CartContext.tsx`      | Carrello shop                                                         |
| `FavoritesContext.tsx` | Preferiti utente                                                      |
| `QuickViewContext.tsx` | Quick view — **non montato in `App.tsx`**, provider locale dove serve |

Cache server-state: `QueryClient` in `App.tsx` con `staleTime` 5 min, `gcTime`
30 min, `refetchOnWindowFocus: false`, `retry: 1`.

### Servizi (`src/services/`)

`firebaseService.ts` (accesso Firestore client, la parte più larga),
`analytics.ts` (`initAnalytics`, `trackEvent`, `trackPageview`),
`aiVerificationService.ts` (chiama `/api/admin/ai-verify`; la chiave Gemini non è
mai nel bundle — vedi commento in `vite.config.ts`),
`instagramContentAdapter.ts` e `instagramCaptionEnrichment.ts`.

### Librerie interne (`src/lib/`)

`firebaseApp.ts`, `firebaseAuth.ts`, `firebaseDb.ts`, `firebaseStorage.ts`
(inizializzazione SDK) · `seo.ts` · `regions.ts` · `consent.ts` · `telemetry.ts` ·
`affiliateLink.ts` · `email.ts` (usato **anche da `server.ts`**) ·
`leadFallback.ts` · `animations.ts` · `errorTracking.ts` (attualmente non
importato da nessuna parte, vedi §5).

### Collezioni Firestore referenziate

Dal client (`collection(db, …)` / `doc(db, …)`): `articles`, `products`,
`orders`, `users`, `leads`, `coupons`, `logs`, `resources`, `settings`,
`siteContent`.

Dal server (Firebase Admin SDK, `server.ts`): `orders`, `coupons`,
`productAssets`. `coupons` e `productAssets` sono **volutamente non leggibili
pubblicamente** in `firestore.rules` e passano solo dall'Admin SDK.

Il server legge inoltre `articles` e `products` via **REST pubblica Firestore**
(`firestore.googleapis.com/v1/...`) per l'iniezione meta, filtrando su
`published`.

---

## 4. Build pipeline

`npm run build` (`package.json`) è una catena sequenziale:

1. `generate:media-kit` — `tsx scripts/generate-media-kit.tsx` (PDF via `@react-pdf/renderer`)
2. `generate:lead-magnet` — `tsx scripts/generate-lead-magnet.tsx`
3. `generate:og` — `node scripts/generate-og-images.mjs`
4. `optimize:images` — `node scripts/optimize-images.mjs` (sharp)
5. `node scripts/generate-sitemap.js` — scrive la sitemap statica
6. `vite build`

### `vite.config.ts`

- Plugin: `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-plugin-pwa`.
- **Service worker**: `VitePWA` con `registerType: 'autoUpdate'`, **disabilitato
  fuori da `mode === 'production'`** per non far ombra all'HMR. Workbox esclude
  dal precache i video e i chunk pesanti (`mapbox-*`, `charts-*`, `editor-*`,
  `react-pdf*`, `three-*`, e le varianti responsive `-320/-480/-768/-1024`),
  serviti poi on-demand via `runtimeCaching` CacheFirst (`heavy-route-chunks`).
  `navigateFallback: '/offline.html'`.
- **`modulePreload.resolveDependencies`**: filtra dal preload dell'HTML i chunk
  `mapbox-`, `charts-`, `editor-`, `maps-`, `markdown-`, `motion-`, `three-`.
- **`manualChunks`** (solo `node_modules`): `react-core` (react, react-dom,
  scheduler, react-is, react-router(-dom), react-query, react-helmet-async) ·
  `three` (three + `@react-three/*` + postprocessing + maath, valutato **prima**
  delle euristiche loose) · `firebase-firestore` / `firebase-auth` /
  `firebase-storage` / `firebase-core` · `motion` · `gsap` · `lenis` · `embla` ·
  `icons` (lucide) · `charts` (recharts) · `maps` (react-simple-maps) · `mapbox`
  (react-map-gl / mapbox-gl) · `markdown` · `editor` (react-quill-new) ·
  `search-utils` (fuse.js, react-error-boundary) · `integrations`
  (`@google/genai`, `@stripe/stripe-js`) · `vite-preload-helper`.
- `chunkSizeWarningLimit: 1800`.
- `resolve.dedupe: ['react','react-dom','three']` e `optimizeDeps.include` sullo
  stack 3D + `react-map-gl/maplibre` + gsap: entrambi sono fix per "Invalid hook
  call" da doppia copia di React nei chunk lazy.

---

## 5. Debito architetturale (con evidenze)

### 5.1 Quattro registri di rotte concorrenti

Non esiste una sola fonte di verità su "quali rotte esistono". Ce ne sono quattro,
mantenute a mano e già divergenti:

1. `src/App.tsx` — le rotte che il client registra davvero.
2. `server.ts` → `ALL_STATIC_APP_ROUTES` (31 voci) — decide il 200/404 per i bot.
3. `scripts/public-route-manifest.js` → `PUBLIC_ROUTE_MANIFEST` (21 voci con
   `role` e flag `sitemap`).
4. Due generatori di sitemap indipendenti:
   - `scripts/generate-sitemap.js` (build-time, legge il manifest + `content-seed.json`);
   - `server.ts` → `GET /sitemap.xml` (runtime, lista `staticRoutes` **hard-coded
     inline**, diversa dal manifest, più gli articoli da Firestore).

Divergenze già presenti oggi:

- `/posto/:slug`, `/manifesto`, `/blog`, `/atlante`, `/admin/site-content/:pageId`,
  `/admin/users`, `/admin/orders` esistono in `App.tsx` e **non compaiono** in
  `ALL_STATIC_APP_ROUTES`.
- `/sentiero` è in `ALL_STATIC_APP_ROUTES` (200 ai bot) ma in `App.tsx` è un
  redirect a `/`.
- La sitemap runtime di `server.ts` include `/vieni-con-noi`, `/itinerari` e le
  sei landing `/destinazione/<regione>`; quella build-time le esclude
  (`sitemap: false` per `/itinerari`, `REGION_LANDINGS_PUBLISHED = false`).
  Le due sitemap non producono lo stesso set di URL.
- `src/config/liteMode.ts` elenca `/strumenti`, `/press`, `/risorse`,
  `/lead-magnet` fra le rotte lite-disabled e `server.ts` le tratta come 404 in
  LITE_MODE, ma in `App.tsx` quelle rotte sono registrate **senza** guardia
  `!LITE_MODE`. In LITE_MODE il client le renderizza e il server risponde 404.

Costo: ogni nuova pagina va aggiunta in quattro posti diversi, e nulla lo verifica.

### 5.2 53 file sorgente morti sotto `src/`

`npm run audit:deps` (knip) riporta **59 file inutilizzati**, di cui 53 dentro
`src/` (gli altri 4 sono schemi Sanity in `docs/99_Archive/`, più
`scripts/generate-assets.mjs` e `scripts/lhci-preview.mjs`).

Sono quasi tutti raggiungibili solo da **quattro pagine non più instradate**:
`src/pages/Home.tsx`, `src/pages/HomeLegacy.tsx`, `src/pages/AtlanteLab.tsx`,
`src/pages/V2/HomeV2.tsx` — le tre rotte che le servivano (`/sentiero`, `/v2`,
`/atlante-lab`) sono oggi `<Navigate to="/" replace />`.

Il grosso dell'albero morto: `src/components/home/` (20 file: `HeroSection`,
`Diary3DScroll`, `SplashIntro`, `CustomCursor`, `LatestArticles`,
`NewsletterFeature`, …), `src/components/home/atlante/` (6 file),
`src/experience/atlante/` (6 file), `src/experience/sentiero/` (7 componenti —
resta vivo solo `sentieroData`, importato da `server.ts` per il prerender),
più `src/components/CartDrawer.tsx`, `src/components/InstagramGrid.tsx`,
`src/i18n/index.ts`, `src/lib/errorTracking.ts`, `src/config/aiCompanion.ts`,
`src/config/atlantePreview.ts`, `src/config/discoveryPicks.ts`,
`src/config/guideContent.ts`, `src/config/reels.ts`.

Non pesa sul bundle (Rollup fa tree-shaking di ciò che nessuna rotta importa), ma
pesa su typecheck, lint, ricerca e orientamento: chi apre `src/components/home/`
trova 18 componenti che non finiscono in nessuna pagina.

[VERIFY: prima di cancellare, decidere se `src/experience/sentiero/*` e
`src/pages/Home.tsx` vanno tenuti come archivio recuperabile — il commento in
`src/App.tsx:33-34` dice esplicitamente "conservate in repo/git per eventuale
recupero". Git è già l'archivio; la decisione è del proprietario.]

### 5.3 Naming che non descrive più il contenuto

La home è `src/pages/AtlanteHome.tsx`, ma il suo unico contenuto è
`<CinematicHomepage />` (`src/components/home/cinematic/CinematicHomepage.tsx`).
"Atlante" era la home precedente al cutover; il nome del file è rimasto.
