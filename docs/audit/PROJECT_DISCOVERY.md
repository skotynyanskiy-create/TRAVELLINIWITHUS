---
title: 'Project Discovery — mappa rotte e superfici'
type: audit
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Project Discovery — TRAVELLINIWITHUS (Verifica Forense Completa)

## 1. Local Workspace & Execution Environment Identification

- **Analyzed Path**: `c:\Users\carme\Desktop\TRAVELLINIWITHUS\TRAVELLINIWITHUS` `[FILE]`
- **True Project Root**: `c:\Users\carme\Desktop\TRAVELLINIWITHUS\TRAVELLINIWITHUS` (Confirmed by root `package.json`, `server.ts`, `vite.config.ts`, `firebase.json`, `firestore.rules`) `[CONFIG]`
- **Operating System**: Windows 11 (PowerShell / `pwsh`) `[COMMAND]`
- **Environment Versions**: Node.js `v22.22.2`, npm `10.9.7`, Playwright `v1.61.1`. `[COMMAND]`
- **Version Control**: Git initialized (`.git` present) `[GIT]`
  - **Current Branch**: `main` `[GIT]`
  - **Head Commit**: `545b4b0` (`chore(cleanup): remove 19 unused orphan home components`) `[GIT]`
- **Verified Execution Environment**: Node.js Express server running locally on `http://localhost:3000` via `tsx watch server.ts` (`npm run dev`). Tested with Playwright Chromium test suite (`.audit-workbench/forensic-audit.spec.ts`). `[COMMAND, RUNTIME, PLAYWRIGHT]`

---

## 2. Inventario Definitivo delle Route (38 Superfici Distinte)

L'analisi integrata tra Playwright Chromium `[PLAYWRIGHT]`, la suite di test `.audit-workbench/forensic-audit.spec.ts` `[PLAYWRIGHT]`, le chiamate HTTP sul server local Express `[RUNTIME]` e il pre-render `seoRoutes.ts` `[FILE]` ha censito **38 superfici distinte**:

| Rotta / Path                         | Componente Principale   | Ambito / Ruolo          | Status HTTP Diretto | Playwright Navigation Status                  | Critical Rilievo                                                   |
| :----------------------------------- | :---------------------- | :---------------------- | :------------------ | :-------------------------------------------- | :----------------------------------------------------------------- |
| `/`                                  | `AtlanteHome.tsx`       | Homepage "Atlante Vivo" | **200 OK**          | **PASS** (`Viaggi reali e posti particolari`) | Production Ready `[PLAYWRIGHT]`                                    |
| `/guida-in-regalo`                   | `VieniConNoi.tsx`       | Canonical Lead (unica)  | **200 OK**          | **PASS** (H1 + canonical)                     | **RISOLTO 2026-07-23** — in `ALL_STATIC_APP_ROUTES` `[PLAYWRIGHT]` |
| `/vieni-con-noi`                     | —                       | **Eliminata**           | **404 Not Found**   | **404 standard** (nessun redirect)            | Non più route; non in router/sitemap `[PLAYWRIGHT]`                |
| `/esplora`                           | `Esplora.tsx`           | Discovery Engine        | **200 OK**          | **PASS** (`Esplora viaggi scelti a mano`)     | Active filters `[PLAYWRIGHT]`                                      |
| `/destinazione`                      | `Destinazione.tsx`      | Destinations Hub        | **200 OK**          | **PASS**                                      | 20 regions mapped `[PLAYWRIGHT]`                                   |
| `/destinazione/toscana`              | `Destinazione.tsx`      | Region Detail           | **200 OK**          | **PASS**                                      | Valid region slug `[PLAYWRIGHT]`                                   |
| `/destinazione/toscana/chianti`      | `Destinazione.tsx`      | Sub-region              | **200 OK**          | **PASS**                                      | Valid sub-slug `[PLAYWRIGHT]`                                      |
| `/articolo/dolomiti-rifugi-design`   | `Articolo.tsx`          | Pillar Article          | **200 OK**          | **PASS**                                      | Valid article slug `[PLAYWRIGHT]`                                  |
| `/itinerari`                         | `Itinerari.tsx`         | Itineraries List        | **200 OK**          | **PASS**                                      | Catalog active `[PLAYWRIGHT]`                                      |
| `/itinerari/compare`                 | `ItinerariCompare.tsx`  | Comparatore             | **200 OK**          | **PASS**                                      | Responsive table `[PLAYWRIGHT]`                                    |
| `/itinerari/sicilia-orientale-5gg`   | `Itinerario.tsx`        | Itinerary Detail        | **200 OK**          | **PASS**                                      | Valid itinerary slug `[PLAYWRIGHT]`                                |
| `/guide/guida-alla-toscana`          | `Guida.tsx`             | Guide View              | **200 OK**          | **PASS**                                      | Valid guide slug `[PLAYWRIGHT]`                                    |
| `/mappa`                             | `Mappa.tsx`             | Interactive Map         | **200 OK**          | **PASS**                                      | Lazy MapLibre GL `[PLAYWRIGHT]`                                    |
| `/chi-siamo`                         | `ChiSiamo.tsx`          | About Brand             | **200 OK**          | **PASS**                                      | Brand story `[PLAYWRIGHT]`                                         |
| `/collaborazioni`                    | `Collaborazioni.tsx`    | Partnerships            | **200 OK**          | **PASS**                                      | B2B hub `[PLAYWRIGHT]`                                             |
| `/media-kit`                         | `MediaKit.tsx`          | Media Kit               | **200 OK**          | **PASS**                                      | PDF download `[PLAYWRIGHT]`                                        |
| `/contatti`                          | `Contatti.tsx`          | Contact Form            | **200 OK**          | **PASS**                                      | Rate limited endpoint `[PLAYWRIGHT]`                               |
| `/risorse`                           | `Risorse.tsx`           | Affiliate Tools         | **200 OK**          | **PASS**                                      | rel="sponsored" links `[PLAYWRIGHT]`                               |
| `/shop`                              | `Shop.tsx`              | Digital Store           | **200 OK**          | **PASS**                                      | Store catalog `[PLAYWRIGHT]`                                       |
| `/shop/guida-premium-dolomiti`       | `ProductPage.tsx`       | Product Detail          | **200 OK**          | **PASS**                                      | Valid product slug `[PLAYWRIGHT]`                                  |
| `/club`                              | `Club.tsx`              | Community               | **200 OK**          | **PASS**                                      | Membership hero `[PLAYWRIGHT]`                                     |
| `/posto/emilia-granduca-di-campigna` | `Posto.tsx`             | Location Stamp          | **200 OK**          | **PASS**                                      | Valid place slug `[PLAYWRIGHT]`                                    |
| `/preferiti`                         | `Preferiti.tsx`         | Saved Drawer            | **200 OK**          | **PASS**                                      | LocalStorage state `[PLAYWRIGHT]`                                  |
| `/account/acquisti`                  | `MieiAcquisti.tsx`      | Customer Portal         | **200 OK**          | **Guarded Auth**                              | AuthContext protected `[PLAYWRIGHT]`                               |
| `/lead-magnet`                       | `LeadMagnet.tsx`        | Direct Access           | **200 OK**          | **PASS**                                      | Direct access `[PLAYWRIGHT]`                                       |
| `/admin`                             | `AdminDashboard.tsx`    | Admin Overview          | **200 OK**          | **Protected Auth**                            | ProtectedRoute guarded `[PLAYWRIGHT]`                              |
| `/admin/site-content/home`           | `SiteContentEditor.tsx` | CMS Content             | **200 OK**          | **Protected Auth**                            | ProtectedRoute guarded `[PLAYWRIGHT]`                              |
| `/admin/editor`                      | `ArticleEditor.tsx`     | CMS Articoli            | **200 OK**          | **Protected Auth**                            | ProtectedRoute guarded `[PLAYWRIGHT]`                              |
| `/admin/product-editor`              | `ProductEditor.tsx`     | CMS Prodotti            | **200 OK**          | **Protected Auth**                            | ProtectedRoute guarded `[PLAYWRIGHT]`                              |
| `/admin/users`                       | `AdminUsers.tsx`        | User Admin              | **404 Not Found**   | **Protected Auth**                            | SSR GET Mismatch `[PLAYWRIGHT]`                                    |
| `/admin/orders`                      | `AdminOrders.tsx`       | Order Admin             | **404 Not Found**   | **Protected Auth**                            | SSR GET Mismatch `[PLAYWRIGHT]`                                    |
| `/manifesto`                         | `ManifestoPage.tsx`     | WebGL Lab               | **404 Not Found**   | **200 OK (Client)**                           | Three.js chunk isolated `[PLAYWRIGHT]`                             |
| `/privacy`                           | `Privacy.tsx`           | Legal Privacy           | **200 OK**          | **PASS**                                      | Legal text `[PLAYWRIGHT]`                                          |
| `/cookie`                            | `Cookie.tsx`            | Legal Cookie            | **200 OK**          | **PASS**                                      | Consent policy `[PLAYWRIGHT]`                                      |
| `/termini`                           | `Termini.tsx`           | Legal Termini           | **200 OK**          | **PASS**                                      | Terms text `[PLAYWRIGHT]`                                          |
| `/disclaimer`                        | `Disclaimer.tsx`        | Legal Disclaimer        | **200 OK**          | **PASS**                                      | Disclaimer text `[PLAYWRIGHT]`                                     |
| `/v2`, `/atlante-lab`, `/sentiero`   | Legacy Pages            | Old Home Versions       | Disattivate         | Redirezionate a `/` `[FILE, PLAYWRIGHT]`      |
