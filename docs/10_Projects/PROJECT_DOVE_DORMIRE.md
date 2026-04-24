---
type: project
area: product
status: shipped-v1
priority: p2
owner: codex
repo: TRAVELLINIWITHUS
route: /dove-dormire
repo_path: src/pages/DoveDormire.tsx
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: saltinourhair reference + affiliate hub pattern
tags:
  - project
  - affiliate
  - conversion
  - new-page
---

# PROJECT_DOVE_DORMIRE

## Obiettivo

Creare un hub affiliate dedicato agli hotel, separato dall'archivio editoriale, che funzioni come motore di conversione Booking.com curato, nello spirito di saltinourhair.com/where-to-stay.

## Contesto

Fino al 2026-04-23 le raccomandazioni hotel erano solo dentro i singoli articoli (componente `HotelRecommendations`). Mancava un'entry-point tematico che raccogliesse le scelte di Rodrigo & Betta per destinazione, valorizzando il tag affiliate come asset proprio invece che solo complemento dell'articolo.

## Repo context

- route: `/dove-dormire`
- repo_path: `src/pages/DoveDormire.tsx`
- repo_path secondario: `src/components/article/HotelRecommendations.tsx` (riusato)
- repo_path secondario: `scripts/generate-sitemap.js` (aggiunta route statica)
- repo_path secondario: `src/components/Navbar.tsx` (link in `Esplora → Guide`)
- repo_path secondario: `src/components/Footer.tsx` (link in blocco `Scopri`)

## Architettura v1

- hero editoriale con eyebrow `Dove dormire`, H1 con italic accent, intro di ~2 righe che spiega il criterio (visti, dormiti, raccontati)
- breadcrumb `Home → Dove dormire` con `BreadcrumbList` JSON-LD auto
- 4 blocchi destinazione curati (Dolomiti, Puglia, Grecia delle isole, Portogallo), ognuno con:
  - eyebrow nome destinazione
  - tagline editoriale
  - link opzionale a `Leggi la guida` (articolo pillar della destinazione)
  - 3 hotel card via `HotelRecommendations` con `prepareAffiliateLink('booking', ...)`
- newsletter signup a fondo pagina con `source="dove_dormire"` per analytics
- schema JSON-LD `CollectionPage` + `ItemList` di `LodgingBusiness` con `AggregateRating` e `priceRange`

## Monetizzazione

Ogni click hotel passa da `prepareAffiliateLink` e `trackAffiliateClick` (stesso motore di `AffiliateBar` nell'articolo), con context `article_hotel_<destination>` e placement `hotel_widget`. Commissioni Booking.com riconducibili alla sorgente.

## SEO

- canonical `/dove-dormire`
- title/description editoriali, sotto i limiti caratteri
- breadcrumb structured data via componente `<Breadcrumbs>`
- CollectionPage schema con `ItemList` → rich results potenziali
- URL in sitemap.xml generato (priority 0.8, changefreq weekly)

## Accessibility

- breadcrumb con `aria-label="Breadcrumb"` + `aria-current="page"` sull'ultimo
- hero con h1 unico
- hotel card delegate al componente `HotelRecommendations` (già accessibile)
- nessun carousel auto-play, nessuna trap di focus

## Scope deferred

- route `/dove-dormire/:destinazione` (dettaglio per destinazione con 6-8 hotel): rimandata finché il catalogo reale non giustifica la sotto-pagina
- lista ordinata editoriale (scelta editoriale esplicita "Nostra scelta") vs per prezzo: al momento solo evidenziazione di 1 hotel per blocco con badge
- filtri per budget / tipo (wellness / design / borgo): non in v1
- integrazione Booking Affiliate XML Feed per prezzi e disponibilità live: richiede API key

## QA

- `npm run typecheck`
- `npm run audit:ui`
- `npm run build` (genera sitemap con la nuova route)
- visual check: mobile (Safari iOS + Chrome Android), desktop laptop e wide
- link affiliate: verifica tracking click con DevTools Network tab

## Link

- [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[PROJECT_TRAVELLINIWITHUS_SITE]]
- [[PROJECT_RELEASE_READINESS]]
