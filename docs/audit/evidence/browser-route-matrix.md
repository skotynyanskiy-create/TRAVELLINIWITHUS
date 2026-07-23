---
title: 'Evidenza — matrice rotte in browser'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Definitive Browser Route Matrix — TRAVELLINIWITHUS

## 1. Route Inventory & Empirical Server Status (38 Surfaces)

| Route Path                           | Component File          | Category               | Auth Guard       | Direct HTTP GET Status | Client SPA Navigation Status   | Critical Rilievo                                              |
| :----------------------------------- | :---------------------- | :--------------------- | :--------------- | :--------------------- | :----------------------------- | :------------------------------------------------------------ |
| `/`                                  | `AtlanteHome.tsx`       | Homepage               | Public           | **200 OK**             | **200 OK**                     | Production Ready `[RUNTIME]`                                  |
| `/guida-in-regalo`                   | `VieniConNoi.tsx`       | Canonical Lead (unica) | Public (noindex) | **200 OK**             | **200 OK**                     | **RISOLTO 2026-07-23** in `ALL_STATIC_APP_ROUTES` `[RUNTIME]` |
| `/vieni-con-noi`                     | —                       | Eliminata              | Public           | **404 Not Found**      | **404 standard** (no redirect) | Non è più route; assente da router/sitemap `[RUNTIME]`        |
| `/esplora`                           | `Esplora.tsx`           | Discovery Engine       | Public           | **200 OK**             | **200 OK**                     | Working filters `[RUNTIME]`                                   |
| `/destinazione`                      | `Destinazione.tsx`      | Destinations Hub       | Public           | **200 OK**             | **200 OK**                     | All 20 regions mapped `[RUNTIME]`                             |
| `/destinazione/toscana`              | `Destinazione.tsx`      | Region Detail          | Public           | **200 OK**             | **200 OK**                     | Working region view `[RUNTIME]`                               |
| `/destinazione/toscana/chianti`      | `Destinazione.tsx`      | Sub-region             | Public           | **200 OK**             | **200 OK**                     | Valid sub-slug `[RUNTIME]`                                    |
| `/articolo/dolomiti-rifugi-design`   | `Articolo.tsx`          | Pillar Article         | Public           | **200 OK**             | **200 OK**                     | Valid article slug `[RUNTIME]`                                |
| `/articolo/slug-non-esistente-99`    | `Articolo.tsx`          | Article 404            | Public           | **404 Not Found**      | **404 Rendering**              | Correct fallback `[RUNTIME]`                                  |
| `/itinerari`                         | `Itinerari.tsx`         | Itineraries List       | Public           | **200 OK**             | **200 OK**                     | Working catalog `[RUNTIME]`                                   |
| `/itinerari/compare`                 | `ItinerariCompare.tsx`  | Comparatore            | Public           | **200 OK**             | **200 OK**                     | Table responsive scroll `[RUNTIME]`                           |
| `/itinerari/sicilia-orientale-5gg`   | `Itinerario.tsx`        | Itinerary Detail       | Public           | **200 OK**             | **200 OK**                     | Valid itinerary slug `[RUNTIME]`                              |
| `/guide/guida-alla-toscana`          | `Guida.tsx`             | Guide View             | Public           | **200 OK**             | **200 OK**                     | Working guide `[RUNTIME]`                                     |
| `/mappa`                             | `Mappa.tsx`             | Interactive Map        | Public           | **200 OK**             | **200 OK**                     | Lazy MapLibre GL `[RUNTIME]`                                  |
| `/chi-siamo`                         | `ChiSiamo.tsx`          | About Brand            | Public           | **200 OK**             | **200 OK**                     | Rodrigo & Betta story `[RUNTIME]`                             |
| `/collaborazioni`                    | `Collaborazioni.tsx`    | Partnerships           | Public           | **200 OK**             | **200 OK**                     | B2B case studies `[RUNTIME]`                                  |
| `/media-kit`                         | `MediaKit.tsx`          | Media Kit              | Public           | **200 OK**             | **200 OK**                     | Download PDF button `[RUNTIME]`                               |
| `/contatti`                          | `Contatti.tsx`          | Contact Form           | Public           | **200 OK**             | **200 OK**                     | Rate limited endpoint `[RUNTIME]`                             |
| `/risorse`                           | `Risorse.tsx`           | Affiliate Tools        | Public           | **200 OK**             | **200 OK**                     | rel="sponsored" links `[RUNTIME]`                             |
| `/shop`                              | `Shop.tsx`              | Digital Store          | Public           | **200 OK**             | **200 OK**                     | Store catalog `[RUNTIME]`                                     |
| `/shop/guida-premium-dolomiti`       | `ProductPage.tsx`       | Product Detail         | Public           | **200 OK**             | **200 OK**                     | Valid product slug `[RUNTIME]`                                |
| `/shop/slug-prodotto-finto`          | `ProductPage.tsx`       | Product 404            | Public           | **404 Not Found**      | **404 Rendering**              | Correct fallback `[RUNTIME]`                                  |
| `/club`                              | `Club.tsx`              | Community              | Public           | **200 OK**             | **200 OK**                     | Membership hero `[RUNTIME]`                                   |
| `/posto/emilia-granduca-di-campigna` | `Posto.tsx`             | Location Stamp         | Public           | **200 OK**             | **200 OK**                     | Valid place slug `[RUNTIME]`                                  |
| `/preferiti`                         | `Preferiti.tsx`         | Saved Drawer           | Public           | **200 OK**             | **200 OK**                     | LocalStorage state `[RUNTIME]`                                |
| `/account/acquisti`                  | `MieiAcquisti.tsx`      | Customer Portal        | Protected        | **200 OK**             | **Guarded Auth**               | AuthContext protected `[RUNTIME]`                             |
| `/lead-magnet`                       | `LeadMagnet.tsx`        | Direct Access          | Public           | **200 OK**             | **200 OK**                     | Direct download `[RUNTIME]`                                   |
| `/admin`                             | `AdminDashboard.tsx`    | Admin Overview         | Protected        | **200 OK**             | **Protected Auth**             | ProtectedRoute guarded `[RUNTIME]`                            |
| `/admin/site-content/home`           | `SiteContentEditor.tsx` | CMS Content            | Protected        | **200 OK**             | **Protected Auth**             | ProtectedRoute guarded `[RUNTIME]`                            |
| `/admin/editor`                      | `ArticleEditor.tsx`     | Article CMS            | Protected        | **200 OK**             | **Protected Auth**             | ProtectedRoute guarded `[RUNTIME]`                            |
| `/admin/product-editor`              | `ProductEditor.tsx`     | Product CMS            | Protected        | **200 OK**             | **Protected Auth**             | ProtectedRoute guarded `[RUNTIME]`                            |
| `/admin/users`                       | `AdminUsers.tsx`        | User Admin             | Protected        | **404 Not Found**      | **Protected Auth**             | SSR GET Mismatch `[RUNTIME]`                                  |
| `/admin/orders`                      | `AdminOrders.tsx`       | Order Admin            | Protected        | **404 Not Found**      | **Protected Auth**             | SSR GET Mismatch `[RUNTIME]`                                  |
| `/manifesto`                         | `ManifestoPage.tsx`     | WebGL Lab              | Lab (`noindex`)  | **404 Not Found**      | **200 OK (Client)**            | Three.js chunk isolated `[RUNTIME]`                           |
| `/privacy`                           | `Privacy.tsx`           | Legal Privacy          | Legal            | **200 OK**             | **200 OK**                     | GDPR text `[RUNTIME]`                                         |
| `/cookie`                            | `Cookie.tsx`            | Legal Cookie           | Legal            | **200 OK**             | **200 OK**                     | Consent policy `[RUNTIME]`                                    |
| `/termini`                           | `Termini.tsx`           | Legal Terms            | Legal            | **200 OK**             | **200 OK**                     | Terms text `[RUNTIME]`                                        |
| `/disclaimer`                        | `Disclaimer.tsx`        | Legal Disclaimer       | Legal            | **200 OK**             | **200 OK**                     | Disclaimer text `[RUNTIME]`                                   |
