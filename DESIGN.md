# TRAVELLINIWITHUS Design System

This file is the operative design source for agents, Stitch, Figma prompts, and code reviews. It does not replace the codebase. Final implementation remains React, TypeScript, Tailwind CSS, CSS variables, and the repo rules in `AGENTS.md`.

## Source Context

Read these before changing important UI:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`
4. `docs/MARKETING_OPERATIONS_HUB.md`
5. `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
6. relevant notes under `docs/`

## Brand

Travelliniwithus is the travel creator brand of Rodrigo & Betta. The site must feel people-led, editorial, useful, and commercially credible.

Primary site goals:

- clarify who Rodrigo & Betta are
- help readers explore destinations and experiences
- build editorial authority
- convert partners toward collaborations and media kit
- capture leads and newsletter subscribers
- support affiliate/shop monetization

Primary language for public UI and content is Italian.

## Visual Direction

The current direction is premium editorial travel:

- image-led, with people and places at the center
- calm hierarchy instead of visual noise
- warm but precise copy
- generous spacing where it improves comprehension
- restrained radius and shadows
- clear CTA priority
- magazine-like content rhythm

Avoid:

- generic SaaS dashboards
- decorative gradient blobs or random orbs
- fake media controls
- overbuilt statistic strips
- English placeholder copy
- crowded cards or cards inside cards
- redesigns disconnected from `docs/`

## Layout Principles

- Start pages with the real user task, not abstract marketing.
- Every public page needs one strong `h1`.
- CTAs must be specific and action-oriented.
- Mobile layouts must be checked at narrow widths and must not create horizontal overflow.
- Desktop layouts must work on laptop and wide viewports.
- Editorial grids should prioritize scannability over density.
- Partnership and media kit paths must stay visible but not overpower reader-first navigation.

## Components And Styling

- Prefer existing components before adding new ones.
- Use `PageLayout`, `Section`, `SEO`, local buttons/cards, and established page patterns.
- Use CSS variables and local Tailwind conventions.
- Avoid raw colors unless explicitly allowed by a local audit rule.
- Use `lucide-react` for icons, except documented local exceptions.
- Keep props typed with explicit interfaces.

## Design Tokens

All colors must come from CSS variables declared in `src/index.css` `@theme` block. Tailwind v4 generates utilities from these (`bg-sand`, `text-ink`, etc.) but the `var(--color-*)` form is also valid and preferred in places where Tailwind utility resolution is brittle (arbitrary values, dynamic classes).

Public-facing code MUST NOT use raw Tailwind palette utilities like `text-zinc-*`, `bg-red-*`, `text-amber-*`, `bg-emerald-*`, `text-rose-*`, etc. Use these tokens instead:

- Surfaces: `--color-sand`, `--color-surface`, `--color-surface-2`, `--color-muted-bg`, `--color-muted-bg-2`
- Borders: `--color-border`
- Text: `--color-ink`, `--color-ink-2`, `--color-muted`, `--color-muted-fg`, `--color-muted-fg-2`
- Dark surfaces (Mappa, hero scuri, social CTA): `--color-ink-deep`
- Accent: `--color-accent`, `--color-accent-hover`, `--color-accent-text`, `--color-accent-soft`
- Error states: `--color-error`, `--color-error-soft`, `--color-error-text`
- Success: `--color-success`, `--color-success-soft`, `--color-success-text`
- Warning: `--color-warning`, `--color-warning-soft`, `--color-warning-text`
- Info: `--color-info`, `--color-info-soft`, `--color-info-text`

Admin-only files under `src/pages/admin/**` and `src/components/admin/**` may still use Tailwind neutrals (`zinc-*`, etc.) — they are out of the brand surface. Third-party brand colors (Instagram gradient, WhatsApp green, etc.) live in `src/index.css` as `--color-social-*` and `--color-affiliate-*`.

### Temi per audience (2026-08-01)

Il sito cambia pelle in base all'audience. Il meccanismo è **solo** un override
di token: `src/index.css` ridefinisce colori e radius sotto
`:root[data-audience='family']` e `:root[data-audience='brand']`. L'attributo è
scritto da `AudienceProvider` (e da uno script inline in `index.html` prima del
CSS, per evitare il flash — le due mappe rotte→audience vanno tenute in sync).

|             | viaggiatori (default) | family            | brand                |
| ----------- | --------------------- | ----------------- | -------------------- |
| Fondo       | sabbia `#faf8f4`      | azzurro `#eef6fb` | avorio `#f6f4ef`     |
| Accento     | elettrico `#ff4d1a`   | rosa `#f43f77`    | oro antico `#a8842f` |
| Accent-text | terracotta `#c2410c`  | `#c2205a`         | `#7d6426`            |
| Radius      | base                  | +~30% (morbido)   | −~30% (asciutto)     |

Regole non negoziabili:

- **Un tema nuovo è un blocco di override, mai un fork di componenti** e mai
  colori per-audience inline nei `.tsx`.
- **La legge dell'accento vale per ogni tema**: sui riempimenti accent il testo
  è scuro, mai bianco; il testo piccolo usa `--color-accent-text`.
- Ogni valore entra solo dopo la verifica WCAG (accent/sand ≥3 ·
  accent-text ≥4,5 su sand e bianco · bianco/accent-hover ≥4,5 ·
  accent-on-dark/ink ≥4,5 · **muted e muted-fg ≥4,5 su sand**). Le rotte del gate
  Lighthouse coprono i tre temi via `audienceFromPath` (`/family` → family,
  `/collaborazioni` e `/media-kit` → brand).
- **Se un tema ridefinisce `--color-sand`, deve rivedere anche i token di testo,
  non solo gli accenti.** Family e brand erano nati senza override di
  `--color-muted`/`--color-muted-fg`: il `#78716c` di default regge 4,52:1 sulla
  sabbia ma scende a 4,36 su avorio e 4,39 su azzurro, cioè sotto AA su ogni
  didascalia muted delle rotte a tema (audit 2026-08-02). Il token mancava dalla
  checklist qui sopra, e per questo nessuno se ne era accorto.
- Limite noto e accettato: `bg-white`, `text-black` e i `rounded-*` nativi non
  seguono il tema. I fondi restano chiari in tutti e tre proprio per questo.

## Form Components

Use the shared form components rather than reinventing inputs:

- `FormField` — label + hint + error wrapper. Always wrap inputs with this.
- `Input` — text/email/number inputs, supports `variant="boxed"` (default) and `variant="underline"` (editorial pages like Contatti). Forwards `ref`.
- `Textarea` — same API as `Input` for multi-line.
- `Select` — same API for dropdowns.

Pass `error={Boolean(error)}` to apply the error border. The wrapping `FormField` renders the error message under the input with `role="alert"`. Newsletter keeps its pill-shape custom input by design (distinctive brand styling).

## Stitch And Figma Usage

Stitch and Figma are for concepting, design-system extraction, mockups, and critique. They are not code truth.

The brand design system lives in Figma at `https://www.figma.com/design/mDzCLduBV0uDAOH1XGUbHH` (file "TRAVELLINIWITHUS — Design System"). It is generated from these tokens (`Brand Colors` + `Radius` variable collections, type styles for Fraunces/Inter, and a primitives specimen). `src/index.css` remains the source of truth; if a token changes there, re-sync the Figma variables.

Prompts must include:

- Travelliniwithus, Rodrigo & Betta, Italian travel creator brand
- premium editorial travel style
- goals: clarity, trust, exploration, collaboration conversion, lead capture
- constraints: no generic SaaS UI, no fake controls, no decorative blobs, no off-brand palette
- source references: `DESIGN.md` and `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`

Any generated design must be adapted to local React/Tailwind patterns before entering the repo.

## Quality Bar

Before marking UI work as ready:

- `npm run typecheck`
- `npm run build`
- `npm run audit:ui`
- `npm run audit:visual` for UI-heavy changes
- update the relevant `docs/` note when positioning, routes, UI flows, collaborations, or release readiness change

## Decision Log

### Typography delivery — Fraunces weight axis

Fraunces resta il serif di brand. Il sito carica le varianti variable `wght`
normale e corsiva; i file multi-asse `full` non sono ammessi nel percorso
pubblico perche aggiungono oltre 80 KB per stile senza un beneficio sufficiente
sulla UI corrente. I display type usano pesi variabili espliciti, non gli assi
`opsz`, `SOFT` o `WONK`.

### Map provider — MapLibre + OpenFreeMap

The `/mappa` page uses MapLibre GL through `react-map-gl/maplibre`
(`src/components/map/MapboxWorldMap.tsx`) with the OpenFreeMap dark style. The
public map does not require a Mapbox token.

Google Maps and a return to Mapbox are intentionally not adopted:

- MapLibre preserves the existing markers, clusters, popups, filters and deep links;
- OpenFreeMap keeps the dark editorial canvas without adding a public API key;
- changing provider would add cost and migration risk without improving the current discovery flow;
- the filename `MapboxWorldMap.tsx` is retained only to avoid a broad rename during the route redesign.

### Page layout pattern — `<PageLayout>` is the public default

All public routes wrap their content in `<PageLayout>` (`src/components/PageLayout.tsx`). PageLayout applies the page-level padding (`pt-32 md:pt-24 pb-32`), the sand background, and `overflow-x-clip`. Navbar and Footer are mounted globally by `<Layout>` in `src/App.tsx`; pages must not remount them.

Canonical example: `src/pages/Shop.tsx`.

Custom-flat pages (no PageLayout) are reserved for full-bleed experiences only: `Home`, `Mappa`, and admin pages under their own admin shell. Adding a new public page without `<PageLayout>` requires a written reason in this section.

### Allowed inline SVG icons

`lucide-react` is the default icon library. The following inline SVG paths are intentional exceptions because no equivalent lucide icon exists or the brand mark must be preserved verbatim:

- TikTok logo — `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/article/SocialFollowCTA.tsx`
- Pinterest logo — `src/components/article/PinterestIcon.tsx`
- Custom map pin — `src/components/map/MapboxWorldMap.tsx`
- Brand mark variants — `src/pages/Collaborazioni.tsx`

`/audit-ui` and `audit-ui` skill should treat these as documented exceptions, not regressions.
