---
type: reference
area: design
status: active
tags:
  - design
  - ui
  - cheatsheet
  - reference
---

# Design System Cheatsheet — TRAVELLINIWITHUS

Reference consultabile durante il lavoro UI. **Truth**: [`src/index.css`](../src/index.css) (@theme block) + [`src/components/`](../src/components/) + [`src/lib/animations.ts`](../src/lib/animations.ts).

**Aggiornare questa nota** dopo ogni PR che modifica `@theme` o aggiunge componenti riusabili. Per direzione visuale/brand vedi [`DESIGN.md`](../DESIGN.md).

---

## 1. Color tokens

Tutti definiti in [`src/index.css:10-37`](../src/index.css#L10) dentro il blocco `@theme`. Uso tipico: `bg-[var(--color-X)]`, `text-[var(--color-X)]`, oppure classi Tailwind mappate (`bg-sand`, `text-ink`).

### Brand core

| CSS var | Hex | Uso consigliato |
|---|---|---|
| `--color-sand` | `#f7f7f8` | Sfondo pagina globale (body) — grigio neutro premium |
| `--color-surface` | `#ffffff` | Card, form, surface elevate — bianco puro |
| `--color-ink` | `#111111` | Testo principale, bottoni primary, heading — nero |
| `--color-footer` | `#141414` | Footer — nero profondo (contrasto col body) |

### Accento unico (cuoio/sabbia)

| CSS var | Hex | Quando |
|---|---|---|
| `--color-accent` | `#a8865a` | Divider, icone decorative, CTA accent, link hover |
| `--color-accent-hover` | `#96734a` | Hover state dell'accento (più scuro) |
| `--color-accent-text` | `#7a5c35` | Testo accento su bianco — **WCAG AA 4.77:1** (usare per focus outline e link su surface chiare) |
| `--color-accent-soft` | `#f3efe9` | Sezioni soft, sfondo sottile — sabbia calda |

### Social palette

`--color-social-instagram-start` (#f09433) → `-mid` (#e6683c) → `-end` (#dc2743) gradient Instagram. `--color-social-facebook` (#1877f2), `--color-social-twitter` (#1da1f2), `--color-social-pinterest` (#e60023).

### Affiliate/partner

Ciascun partner ha una coppia `--color-affiliate-<name>` + `--color-affiliate-<name>-soft`:
- `booking` #003580 / soft #eff6ff
- `heymondo` #00d084 (solo strong)
- `skyscanner` #0770e3 / soft #f0f9ff
- `getyourguide` #ff523b / soft #fef2f2
- `amazon` #ff9900 / soft #fff7ed

Usati dinamicamente in [`src/components/AffiliateBox.tsx`](../src/components/AffiliateBox.tsx) e [`src/components/CrossLinkWidget.tsx`](../src/components/CrossLinkWidget.tsx).

---

## 2. Typography

### Font families ([`src/index.css:6-8`](../src/index.css#L6))

| CSS var | Font | Uso |
|---|---|---|
| `--font-serif` | Cormorant Garamond | Tutti gli `h1-h6`, `.font-serif`, display editoriali |
| `--font-sans` | Plus Jakarta Sans | Body, UI, bottoni, form (default via `body` rule) |
| `--font-script` | Kalam | Accenti copy manuali (eyebrow decorativi, citazioni brevi) |

**Caricamento**: `<link rel="preconnect">` + unified family URL in [`index.html:14-17`](../index.html#L14). Nessun `@import` CSS (rimosso per performance).

### Fluid type scale ([`src/index.css:42-46`](../src/index.css#L42))

Usano `clamp(min, fluid, max)` — scalano continuamente col viewport. Applicati via Tailwind arbitrary: `text-[var(--text-h1)]`.

| CSS var | Min → Max | Uso |
|---|---|---|
| `--text-h1` | 2.75rem → 5.5rem | Hero display principale |
| `--text-h2` | 2.25rem → 4rem | Section title (auto-applicato da `<Section title />`) |
| `--text-h3` | 1.5rem → 2.5rem | Subsection / card titoli |
| `--text-body` | 1rem → 1.125rem | Body paragrafi lunghi |

### Tracking utilities

- `--tracking-tight` (-0.025em) per display serif
- `--tracking-wide` (0.05em) per eyebrow/all-caps

Tailwind equivalente: `tracking-tight`, `tracking-wide`. Per eyebrow brand usa la class `.text-eyebrow` (vedi §6).

---

## 3. Radius, shadows, spacing

### Radius ([`src/index.css:49-51`](../src/index.css#L49))

| CSS var | Valore | Uso tipico |
|---|---|---|
| `--radius-xl` | 1.5rem | Card standard, Button primary (rounded-[var(--radius-xl)]) |
| `--radius-2xl` | 2.5rem | Card hero, feature blocks |
| `--radius-3xl` | 3rem | Elementi very prominent (raro) |

### Shadows ([`src/index.css:52-54`](../src/index.css#L52))

| CSS var | Effetto | Uso |
|---|---|---|
| `--shadow-premium` | 20px layered + 10px offset | Card editoriali hover, CTA cards |
| `--shadow-glass` | 8px soft diffused | Overlay, glass button, backdrop-blur surfaces |

### Spacing

**Nessun custom** — usa scale Tailwind default. Convenzioni in corso:
- Section padding verticale: `py-12 md:py-16` (tight) / `py-16 md:py-24` (default) / `py-24 md:py-36` (spacious) — gestito da `<Section spacing />`.
- Container horizontal: `px-6 md:px-12`.
- Card padding: `p-8 md:p-10` (usato da `.card-info`).

---

## 4. Layout primitives

### `<Layout />` — [`src/components/Layout.tsx`](../src/components/Layout.tsx)
Top-level router wrapper. Contiene Navbar + Outlet + Footer + ConsentBanner + tracking. **Uso**: solo nel Router, mai direttamente nelle pagine.

### `<PageLayout>{children}</PageLayout>` — [`src/components/PageLayout.tsx:7-15`](../src/components/PageLayout.tsx#L7)
Wrapper con padding top/bottom che compensa la navbar fissa (`pt-32 md:pt-24`, `pb-32`).
**Uso**: root di ogni pagina in `src/pages/`.

### `<Section>` — [`src/components/Section.tsx:28-63`](../src/components/Section.tsx#L28)

```tsx
<Section
  title?="Qualcosa di grande"          // opzionale, renderizza h2 con font-serif
  subtitle?="EYEBROW"                   // opzionale, uppercase tracked, color accent-text
  ornament?                             // opzionale, diamond gold dot sopra subtitle
  id?="section-id"
  spacing="tight|default|spacious"     // verticale: py-12 → py-16 → py-24
  maxWidth="narrow|default|wide"       // 4xl / 7xl / 1440px
  divider?                             // aggiunge editorial-divider (accent line top)
  className?
>
  {children}
</Section>
```
Auto-anima fade-up on viewport con Framer Motion (viewport once, margin -80px).

### `<SEO />` — [`src/components/SEO.tsx:353-416`](../src/components/SEO.tsx#L353)
Meta tags + JSON-LD automatico via react-helmet-async. Schemi supportati: `article`, `destination`, `itinerary`, `review`, `product`, `website`, `breadcrumbs`. Props core: `title`, `description`, `canonical`, `image`, `type`, `noindex`.

### `<Navbar />` / `<Footer />`
Context-driven (leggono `AuthContext`, `SiteContent`, `FavoritesContext`). Nessun prop da passare. Già inclusi in `<Layout />`.

---

## 5. Atoms & molecules riusabili

| Componente | Path | Uso rapido |
|---|---|---|
| **Button** | [`Button.tsx`](../src/components/Button.tsx) | `variant: primary\|secondary\|outline\|outline-light\|cta`, `size: sm\|md\|lg`. Polymorphic (button / Link / anchor via `to` / `href`). Hover translate-y-0.5 + shadow premium |
| **OptimizedImage** | [`OptimizedImage.tsx`](../src/components/OptimizedImage.tsx) | Responsive srcSet Unsplash/Firebase, blur-up, `priority` per LCP, `warm` per filter caldo |
| **Breadcrumbs** | [`Breadcrumbs.tsx`](../src/components/Breadcrumbs.tsx) | Emette BreadcrumbList JSON-LD automaticamente |
| **EmptyState** | [`EmptyState.tsx`](../src/components/EmptyState.tsx) | `variant: no-content\|no-results`, `onReset` opzionale |
| **Pagination** | [`Pagination.tsx`](../src/components/Pagination.tsx) | Si auto-nasconde se `totalPages ≤ 1` |
| **Newsletter** | [`Newsletter.tsx`](../src/components/Newsletter.tsx) | `variant: sand\|white\|editorial\|compact\|article\|business`. CheckCircle animato on success |
| **Search** | [`Search.tsx`](../src/components/Search.tsx) | Fuse.js full-text articoli |
| **ProductCard** | [`ProductCard.tsx`](../src/components/ProductCard.tsx) | Card prodotto con cart button, badge opzionale |
| **CartDrawer** | [`CartDrawer.tsx`](../src/components/CartDrawer.tsx) | Drawer overlay con coupon manager |
| **JsonLd** | [`JsonLd.tsx`](../src/components/JsonLd.tsx) | Helper low-level per structured data custom |
| **InteractiveMap** | [`InteractiveMap.tsx`](../src/components/InteractiveMap.tsx) | Mapbox GL wrapper |
| **ExitIntentPopup** | [`ExitIntentPopup.tsx`](../src/components/ExitIntentPopup.tsx) | Mouse-out detector + modal |

### Skeleton varianti
[`Skeleton.tsx`](../src/components/Skeleton.tsx), [`ArticleSkeleton.tsx`](../src/components/ArticleSkeleton.tsx), [`ArticlePageSkeleton.tsx`](../src/components/ArticlePageSkeleton.tsx), [`ProductPageSkeleton.tsx`](../src/components/ProductPageSkeleton.tsx), [`FormSkeleton.tsx`](../src/components/FormSkeleton.tsx), [`ListSkeleton.tsx`](../src/components/ListSkeleton.tsx). Tutte con pulse 1.5s loop.

### Utility & infrastrutturali (non visivi)
`ConsentBanner`, `ErrorBoundary`, `ProtectedRoute`, `ScrollToTop`, `AnalyticsScripts`, `DemoContentNotice`, `CouponManager`, `InlineNewsletterBanner`, `InstagramGrid`.

---

## 6. Custom utility classes (@layer utilities)

Definite in [`src/index.css:57-116`](../src/index.css#L57). Usabili come Tailwind class.

### Tipografia

```tsx
<h1 className="text-display-1">Headline mega editoriale</h1>
{/* text-5xl md:text-7xl, font-serif, font-medium, leading-tight */}

<h2 className="text-display-2">Section display</h2>
{/* text-4xl md:text-5xl, font-serif, leading-tight */}

<span className="text-eyebrow">KICKER UPPERCASE</span>
{/* text-[10px], font-bold, uppercase, tracking-[0.25em] */}

<p className="text-body-lg">Lead paragraph lungo con luminosità ridotta.</p>
{/* text-lg, font-light, leading-relaxed, color-mix 60% ink */}
```

### Card tiers

```tsx
<div className="card-editorial">...</div>
{/* rounded-2xl, bg surface, shadow-sm, hover shadow-xl + -translate-y-1 — card prodotto/articolo */}

<div className="card-info">...</div>
{/* rounded-[radius-xl], bg sand, p-8 md:p-10 — informational box denso */}

<div className="card-dark">...</div>
{/* rounded-xl, bg #1C1C1C, hover #242424 — card su sfondi scuri (dashboard admin) */}
```

### Ornamenti brand

```tsx
<div className="editorial-divider"><Section title="X" /></div>
{/* Aggiunge una linea accent 3rem sopra il contenuto */}

<div className="ornament-gold">
  <div className="h-1.5 w-1.5 rotate-45 bg-[var(--color-accent)]" />
</div>
{/* Diamond centrale con linee gradient accent laterali — usato in Section quando ornament={true} */}

<section className="bg-topo">...</section>
{/* Background pattern contour molto sottile (0.06-0.08 opacity) per sezioni scure */}
```

### Img blur-up

```tsx
<img className="img-blur-up" /> {/* blur(20px) + scale(1.1) */}
<img className="img-blur-up loaded" /> {/* reset quando caricata */}
```
Gestito automaticamente da `<OptimizedImage>`.

---

## 7. Motion presets ([`src/lib/animations.ts`](../src/lib/animations.ts))

Tutti `Variants` da `motion/react`. Uso: `<motion.div variants={X} initial="hidden" whileInView="visible" viewport={{ once: true }} />`.

```tsx
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, cardContainer, cardItem, heartPulse } from '@/lib/animations';
```

| Preset | Effetto | Durata |
|---|---|---|
| `fadeInUp` | opacity 0→1 + y 30→0 | 0.6s custom cubic-bezier (editorial ease) |
| `fadeInLeft` | opacity 0→1 + x -30→0 | 0.8s |
| `fadeInRight` | opacity 0→1 + x 30→0 | 0.8s |
| `scaleIn` | opacity 0→1 + scale 0.85→1 | spring stiff 300, damp 25 |
| `cardContainer` | wrapper stagger | stagger 0.08s, delayChildren 0.1s |
| `cardItem` | opacity 0→1 + y 50→0 | spring stiff 200, damp 25 |
| `heartPulse` | scale [1, 1.35, 0.9, 1.1, 1] | 0.4s — keyed a counter |

**Pattern grid con stagger**:
```tsx
<motion.div variants={cardContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  {items.map((i) => (
    <motion.div key={i.id} variants={cardItem}>...</motion.div>
  ))}
</motion.div>
```

**Accessibility**: `@media (prefers-reduced-motion: reduce)` in [`src/index.css:195-204`](../src/index.css#L195) disabilita globalmente. Nessun handling custom necessario.

---

## 8. Regole d'uso (summary decisionale)

| Situazione | Strumento |
|---|---|
| Spacing, layout, flex/grid, hover/focus standard | **Tailwind utility** |
| Colore brand, font family, radius brand-specific | **CSS var custom** (`bg-[var(--color-...)]`) |
| Tipografia ricorrente brand (display, eyebrow) | **Utility class @layer** (`.text-display-1`, `.text-eyebrow`) |
| Card reusable | **Utility class** (`.card-editorial\|info\|dark`) |
| Animazione reveal standard | **Preset motion/react** (da `src/lib/animations.ts`) |
| Inline `style={{ }}` | **SOLO** per: animazioni Framer dinamiche (y, scale, opacity da hook), positioning assoluto da config (affiliate palette, coordinate mappa), constraint third-party (react-pdf, iframe) |
| Icona | **SEMPRE** `lucide-react`. No Heroicons, no custom SVG |
| Mappa interattiva | `mapbox-gl` + `react-map-gl` via `InteractiveMap` wrapper |
| Markdown rendering | `react-markdown` + `remark-gfm` |
| Data fetching | `@tanstack/react-query` (config in `src/App.tsx`) |

### Non fare

- Non usare palette Tailwind generiche (`bg-blue-500`, `text-red-600`) senza motivazione — `audit:ui` le segnala come "non-brand palette". Se davvero servono per un UI semantico (errori, warning), aggiungi il file alla `semanticPaletteAllowlist` in [`scripts/check-ui.mjs`](../scripts/check-ui.mjs).
- Non duplicare componenti che esistono. Prima cerca in `src/components/` e feature folder.
- Non introdurre `tailwind.config.js` — Tailwind 4 usa solo `@theme` in CSS.

---

## 9. Pagine mature come riferimento

Quando fai una pagina nuova o grossa modifica, ispirati a queste:

- **Home** — [`src/pages/Home.tsx`](../src/pages/Home.tsx) — 83 LOC, 9 componenti importati da `src/components/home/`. Modello di composizione pulita per pagina editoriale multi-sezione.
- **Articolo** — [`src/pages/Articolo.tsx`](../src/pages/Articolo.tsx) — pagina editoriale complex: hero + markdown + sidebar sticky + TOC + MobileBottomBar + share + related.
- **Destinazioni** — [`src/pages/Destinazioni.tsx`](../src/pages/Destinazioni.tsx) — pagina con filtri + grid stagger + pagination, 4 componenti dedicati in `src/components/destinazioni/`.

---

## 10. Link correlati

- Direzione visuale + brand voice → [`DESIGN.md`](../DESIGN.md)
- Brand public identity → [`docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`](BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md)
- Smart routing AI (quale agente per quale task UI) → [`CLAUDE.md`](../CLAUDE.md) sezione "Smart Routing Protocol"
- Editorial rules → [`docs/EDITORIAL_GUIDE.md`](EDITORIAL_GUIDE.md)
- Obsidian home → [`docs/OBSIDIAN_HOME.md`](OBSIDIAN_HOME.md)
