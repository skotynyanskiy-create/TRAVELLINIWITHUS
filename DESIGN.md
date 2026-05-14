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

## Form Components

Use the shared form components rather than reinventing inputs:

- `FormField` — label + hint + error wrapper. Always wrap inputs with this.
- `Input` — text/email/number inputs, supports `variant="boxed"` (default) and `variant="underline"` (editorial pages like Contatti). Forwards `ref`.
- `Textarea` — same API as `Input` for multi-line.
- `Select` — same API for dropdowns.

Pass `error={Boolean(error)}` to apply the error border. The wrapping `FormField` renders the error message under the input with `role="alert"`. Newsletter keeps its pill-shape custom input by design (distinctive brand styling).

## Stitch And Figma Usage

Stitch and Figma are for concepting, design-system extraction, mockups, and critique. They are not code truth.

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

### Map provider — Mapbox

The `/mappa` page uses Mapbox GL via `react-map-gl` (`src/components/map/MapboxWorldMap.tsx`) with the `mapbox://styles/mapbox/dark-v11` style. The token is supplied through `VITE_MAPBOX_TOKEN`.

Google Maps is intentionally not adopted:

- Mapbox is already integrated (`mapbox-gl@3.20.0`, `react-map-gl@8.1.0`)
- pricing is lower beyond the free tier ($5/1000 loads vs $7/1000)
- the editorial dark style is closer to brand than Google's stock styles
- migration would touch 67 hard-coded country coordinates and the article-marker overlay for no measurable UX gain

### Page layout pattern — `<PageLayout>` is the public default

All public routes wrap their content in `<PageLayout>` (`src/components/PageLayout.tsx`). PageLayout applies the page-level padding (`pt-32 md:pt-24 pb-32`), the sand background, and `overflow-x-clip`. Navbar and Footer are mounted globally by `<Layout>` in `src/App.tsx`; pages must not remount them.

Canonical example: `src/pages/Shop.tsx`.

Custom-flat pages (no PageLayout) are reserved for full-bleed experiences only: `Home`, `Mappa`, and admin pages under their own admin shell. Adding a new public page without `<PageLayout>` requires a written reason in this section.

### Allowed inline SVG icons

`lucide-react` is the default icon library. The following inline SVG paths are intentional exceptions because no equivalent lucide icon exists or the brand mark must be preserved verbatim:

- TikTok logo — `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/article/SocialFollowCTA.tsx`
- Pinterest logo — `src/components/article/PinterestIcon.tsx`
- Mapbox custom pin — `src/components/map/MapboxWorldMap.tsx`
- Brand mark variants — `src/pages/Collaborazioni.tsx`

`/audit-ui` and `audit-ui` skill should treat these as documented exceptions, not regressions.
