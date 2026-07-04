# PROJECT — Struttura Definitiva del Sito (Atlante Vivo)

- **Data**: 2026-07-04
- **Branch**: audit/full-site-2026-06-07
- **Stato**: PROPOSTA — in attesa di 4 decisioni owner (vedi §6) prima delle azioni distruttive
- **North-star**: la home **Atlante Vivo** già costruita ([[PROJECT_ATLANTE_VIVO_HOME_2026-07-04]]). Tripp = riferimento IA/tassonomia, non codice.
- **Origine**: passaggio multi-agente (research Tripp locale + tripptheme.com/demo + audit IA attuale + audit codice morto → sintesi). Reference visive demo: tripp1 (light) + tripp2 (dark), stessa struttura destinazioni-first.
- **Fuori scope (owner-only)**: server.ts, firestore.rules, src/config/admin.ts.

Questo doc contiene: (1) IA definitiva, (2) tabella per-rotta keep/disable/delete, (3) best-of-Tripp da adottare + da rifiutare, (4) piano pulizia, (5) roadmap a fasi, (6) decisioni owner.

In appendice: gli audit grezzi (Tripp locale, Tripp web, IA attuale, codice morto).

---

# DEFINITIVE SITE STRUCTURE — TRAVELLINIWITHUS

North-star: the already-built **Atlante Vivo** magazine (destinations-first, warm, one WebGL cover beat, category color only inside content). Tripp is an IA/taxonomy reference only — adopt ideas, reject WordPress-magazine surface. `server.ts` / `firestore.rules` / `src/config/admin.ts` are out of scope (owner-only).

---

## 1. DEFINITIVE INFORMATION ARCHITECTURE

The spine is Tripp's best structural idea: **two orthogonal browsable axes** — WHERE (destination geo-tree) × WHAT (theme/category, color only in content). One primary discovery surface (`/esplora`) fed by both.

### Public route tree (canonical)

```
/                         Home — Atlante Vivo (cutover target)
│
├─ ESPLORA (primary discovery)
│  /esplora                       finder: zona × tema × formato × q  [URL-state facets]
│  /mappa                         world map (Mapbox) — secondary lens on same content
│  /destinazione/:continente/:paese[/:regione]   hierarchical place landings (cover+intro+pin)
│  /posto/:slug                   single place (~40 real posts)
│
├─ RACCONTI (editorial)
│  /articoli                      article/guide index (NEW real index, replaces /guide redirect)
│  /articolo/:slug                article detail
│  /guide/:slug                   guide detail  → MERGE under /articoli taxonomy long-term
│  /itinerari                     itinerary index
│  /itinerari/:slug               itinerary detail
│
├─ CHI SIAMO (creator brand)
│  /chi-siamo                     about + creator page (cover, socials, their guides)
│
├─ COLLABORA (business)
│  /collaborazioni                partner/brand — primary CTA target
│  /media-kit                     (footer + linked from /collaborazioni)
│
├─ SHOP (commerce, flag-gated)
│  /shop  /shop/:slug  /club  /account/acquisti
│
├─ CONTATTI
│  /contatti
│
├─ Utility (no primary nav)
│  /preferiti  /strumenti  /risorse  /itinerari/compare  /lead-magnet
│  /vieni-con-noi (+ /iscrivi)    bio-link landing (chrome-less, IG/TikTok)
│
└─ Legal  /privacy /cookie /termini /disclaimer
```

### Primary navbar (commit to ONE calm header — reject Tripp's 4 header variants)

`Destinazioni` (mega-menu: region tree + 2-3 featured guides w/ thumbs) · `Esplora` · `Racconti` · `Chi siamo` · `Shop` — plus utility cluster: **search field** (embedded, desktop-persistent), favorites heart, "Collabora con noi" CTA, user/admin menu.

### Footer (four columns)

- **Esplora**: Destinazioni, Mappa, Esplora, Itinerari
- **Racconti**: Articoli, Guide, Strumenti, Risorse
- **Progetto**: Chi siamo, Collaborazioni, Media kit, Press, Contatti
- **Utility/Legal**: Newsletter, Preferiti, Shop, Club · Privacy/Cookie/Termini/Disclaimer

Decisions locked: `Destinazioni` is **primary nav, not a facet** (Tripp excludes destination from generic filters — correct). `Mappa` must be reachable directly from footer AND surfaced in the Destinazioni mega-menu, never only nested inside Esplora (fixes IA problem #2). `/press`, `/media-kit`, `/risorse`, `/strumenti` are **footer-only**. Bio-landings stay IA-isolated by design but get one inbound link from `/chi-siamo` to accrue equity.

---

## 2. PER-ROUTE DECISION TABLE

Fate of every current route (from `src/App.tsx`). Legend: KEEP / DISABLE (flag-off, keep code) / DELETE / MERGE / RESTRUCTURE.

| Route                                   | Decision                                 | Reason                                                                                                   |
| --------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `/` Sentiero (Home.tsx)                 | **RESTRUCTURE → replace**                | Immersive WebGL dead-end; becomes Atlante Vivo at cutover. Sentiero code archived, not deleted (see §5). |
| `/atlante` AtlanteHome                  | **RESTRUCTURE → promote to `/`**         | The chosen home. Remove `ATLANTE_PREVIEW` gate at cutover; `/atlante` becomes redirect → `/`.            |
| `/v2` HomeV2                            | **DISABLE then DELETE**                  | Third parallel home. Confirm no live IG/TikTok bio link first (owner).                                   |
| `/atlante-lab` AtlanteLab               | **DELETE**                               | GLSL scratch route; its job is done now AtlanteHome ships. Noindex lab, zero inbound.                    |
| `/sentiero` → `/`                       | **KEEP (redirect)**                      | Harmless single-hop dedupe.                                                                              |
| `/esplora` Esplora                      | **KEEP + RESTRUCTURE**                   | Canonical discovery. Add URL-state facets, sort, count badge (Tripp #3/#4).                              |
| `/mappa` Mappa                          | **KEEP**                                 | Secondary lens; must be nav/footer-reachable.                                                            |
| `/destinazione/:regionSlug`             | **RESTRUCTURE**                          | Make hierarchical `/destinazione/:continente/:paese[/:regione]`; add term cover/intro/pin (Tripp #1).    |
| `/destinazioni` → `/esplora`            | **KEEP (redirect)**                      | Legacy consolidation, fine.                                                                              |
| `/esperienze` → `/esplora`              | **KEEP (redirect)**                      | Legacy consolidation.                                                                                    |
| `/guide` → `/esplora?format=guida`      | **RESTRUCTURE → real `/articoli` index** | Asymmetric (index redirects but `/guide/:slug` renders). Give editorial a real index.                    |
| `/guide/:slug` Guida                    | **KEEP → MERGE long-term**               | Keep detail; converge Guida+Articolo under one editorial model + `/articoli` index.                      |
| `/articolo/:slug` Articolo              | **KEEP**                                 | Editorial detail; host for ReviewBlock/DealCard/PostNavigation (Tripp #2/#7/#11).                        |
| `/itinerari` Itinerari                  | **KEEP**                                 | Real index.                                                                                              |
| `/itinerari/:slug` Itinerario           | **KEEP**                                 | Real detail.                                                                                             |
| `/itinerari/compare`                    | **KEEP but link it**                     | Real page, zero inbound — link from Itinerari, or DISABLE if unused (owner).                             |
| `/chi-siamo` ChiSiamo                   | **KEEP + RESTRUCTURE**                   | Upgrade to creator page: cover, socials, their guides (Tripp #12).                                       |
| `/collaborazioni`                       | **KEEP**                                 | Primary CTA target.                                                                                      |
| `/media-kit`                            | **KEEP (footer-only)**                   | Link from `/collaborazioni`.                                                                             |
| `/press`                                | **KEEP (footer-only)**                   | Real.                                                                                                    |
| `/contatti` Contatti                    | **KEEP**                                 | Real.                                                                                                    |
| `/strumenti` Strumenti                  | **KEEP (footer-only)**                   | Real; resolve LITE divergence (§4/IA problem #1).                                                        |
| `/risorse` Risorse                      | **KEEP (footer-only)**                   | "Cosa usiamo" affiliate/gear.                                                                            |
| `/preferiti` Preferiti                  | **KEEP (utility)**                       | Client-state favorites.                                                                                  |
| `/shop` `/shop/:slug`                   | **KEEP (flag-gated)**                    | Stripe.                                                                                                  |
| `/club` Club                            | **KEEP (flag-gated)**                    | Membership.                                                                                              |
| `/posto/:slug` Posto                    | **KEEP**                                 | Core content (~40 real posts).                                                                           |
| `/account/acquisti`                     | **KEEP (utility, purchase-gated)**       | Post-purchase library.                                                                                   |
| `/lead-magnet`                          | **KEEP (utility, isolated)**             | Bio/paid traffic capture.                                                                                |
| `/vieni-con-noi` (+ `/iscrivi`)         | **KEEP (chrome-less)**                   | Bio-link opt-in, real.                                                                                   |
| `/quiz` → `/esplora`                    | **KEEP (redirect)**                      | Archetype quiz retired.                                                                                  |
| `/futuro`                               | **DELETE reference**                     | No `<Route>` exists; stale string in `liteMode.ts:17,33`.                                                |
| `/admin/*`                              | **KEEP (out of scope)**                  | Owner-only.                                                                                              |
| `/privacy /cookie /termini /disclaimer` | **KEEP**                                 | Legal.                                                                                                   |
| `*` NotFound                            | **KEEP**                                 | Fallback.                                                                                                |

**Cutover path (the headline decision):** Atlante Vivo → `/`. Concretely: (1) at `src/App.tsx:110` remove the `ATLANTE_PREVIEW` gate and mount `AtlanteHome` at the index route; (2) move current `Home` (Sentiero) to `/sentiero` as an opt-in "experience" OR archive it; (3) `/atlante` → redirect `/`; (4) delete `/v2` + `/atlante-lab`. One home, one source of truth. This resolves IA problem #3 (four coexisting homes → one).

---

## 3. BEST-OF-TRIPP — RANKED ADOPTION SHORTLIST

Only what raises the bar for a premium creator magazine. Effort S/M/L · Priority P0/P1/P2.

| #   | Feature                                                                                                                                                                                | Maps to                                                                               | Effort | Prio   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ | ------ |
| A   | **Dual taxonomy: destination geo-tree × theme** (both browsable) — hierarchical `/destinazione/:continente/:paese[/:regione]`, term cover+intro+pin; category = color layer in content | `src/data/` (new `destinations` tree), `Destinazione.tsx`, routing, `ContentCard.tsx` | L      | **P0** |
| B   | **Facets → URL state + multi-select + clear-all + count badge**                                                                                                                        | `Esplora.tsx`, `ActiveFilterChips.tsx`                                                | S–M    | **P0** |
| C   | **Sort-by control** (Più recenti / Più letti / Vicino a te)                                                                                                                            | `Esplora.tsx` header                                                                  | S      | **P0** |
| D   | **Country index with REAL entry counts** ("Italia — 8 racconti")                                                                                                                       | Home Atlante `ZoneBand`, `/esplora`                                                   | S      | **P0** |
| E   | **Embedded persistent header search, multi-entity** (destinazioni+guide+itinerari+shop)                                                                                                | `Navbar.tsx` ← promote `SearchModal`/`AutocompleteResults`                            | S–M    | P1     |
| F   | **Mega-menu: destination columns + 2-3 featured guides w/ thumbs**                                                                                                                     | `Navbar.tsx` → `<MegaMenu>`                                                           | M–L    | P1     |
| G   | **Creator/author page richness** (cover, location, socials, their guides)                                                                                                              | `ChiSiamo.tsx`, `AuthorBio.tsx`                                                       | M      | P1     |
| H   | **Post-format variety in grid** (standard/quote/link/gallery)                                                                                                                          | `ContentCard.tsx`/`ArchiveCard.tsx` `format` prop                                     | M      | P1     |
| I   | **Post navigation prev/next** (thumb + destination + back-to-archive)                                                                                                                  | `<PostNavigation>` in `Articolo.tsx`/`Itinerario.tsx`                                 | S      | P1     |
| J   | **Breadcrumb dual-mode** (destination vs category)                                                                                                                                     | `Breadcrumbs.tsx` `mode` prop                                                         | S      | P1     |
| K   | **Instagram "Follow Us" strip** near footer (real posts, single quiet grid)                                                                                                            | `Footer.tsx` area (reuse salvaged `InstagramGrid.tsx`)                                | S      | P1     |
| L   | **Deals/offers as content type** (promo code, validity, terms accordion; JSON-LD offer)                                                                                                | `<DealCard>` in `Articolo.tsx`/`Posto.tsx` + `affiliateLink` lib                      | M      | P2     |
| M   | **Quick-view drawer from archive**                                                                                                                                                     | `<QuickViewDrawer>` reusing `SearchModal` pattern                                     | M      | P2     |
| N   | **Pagination strategy per surface** (load-more on Esplora, numbered on index)                                                                                                          | `Pagination.tsx` `mode` prop                                                          | S–M    | P2     |
| O   | **Restrained route-transition micro-moment** (one line-drawn plane, respects reduced-motion)                                                                                           | `TransitionLink.tsx`/Suspense fallback                                                | S      | P2     |

**Architecture patterns to steal (not features):** typed content-model flags (`format`, `hasReview`, `hasDeal`) as one source of truth; a small `contentVisibility` per-surface config to kill scattered ad-hoc render conditionals.

### Tripp things to REJECT (off-brand bloat)

- **Star ratings / review scores on editorial posts** — a creator's story isn't "4.7"; drop the multi-criterion review block entirely for editorial. (Keep only as an _optional_ structured block for masserie/hotel if owner monetizes — P2, not default. This is the one place I diverge from the local-research "P0 reviews" call: the web/demo stream is right that ratings read as content-farm.)
- **Vanity-metric stacks on cards** (views + comments + shares + play badge) — max one signal (reading time or a single category chip).
- **Dense 8-module homepage** (tripp1) — Atlante Vivo keeps 4-5 calm beats.
- **Inline affiliate ad banners** in the feed.
- **Cart chrome in header** unless shop becomes a real priority.
- **4 header variants / full-screen menu sprawl** — one header only.
- **SPA-mode as a "feature"** — already baseline in React Router.
- WooCommerce hooks, Flextension plugin coupling, dark-mode LocalStorage plumbing — stack already covers these.

---

## 4. CLEANUP PLAN

### [SAFE-DELETE] — execute now (evidence-backed, small blast radius)

Group 1 — dead modules/components:

- `src/lib/errorTracking.ts` (no-op, confirmed removed per `Layout.tsx:63` comment)
- `src/components/CartDrawer.tsx` (orphan; cart uses `CartContext`)

Group 2 — unreferenced scripts:

- `scripts/generate-assets.mjs`, `scripts/lhci-preview.mjs` (not in `package.json` scripts)

Group 3 — untracked dev screenshots at repo root (7): `sentiero-v2-*.jpeg`

Group 4 — commit the §0 pre-existing working-tree deletions (already `D` in git): `src/components/futuro/*`, `src/components/audio/*`, `Futuro.tsx`, `{AffiliateDisclosure,AnimatedCounter,InlineNewsletterBanner}.tsx`, `src/config/{rebuildMode,experiments,integrations,audioGuides,experienceVisuals}.ts`, `seedArticle.ts`, `hooks/{useExperiment,usePagination}.ts`, `article-bali.md` — **and scrub the stale `/futuro` string from `src/config/liteMode.ts:17,33`.**

### [NEEDS-REVIEW] — confirm with owner before deleting

- **§A Legacy home cluster (biggest win, DESTRUCTIVE):** `src/pages/HomeLegacy.tsx` + `src/components/home/*` (20 flat files) + `src/components/InstagramGrid.tsx` + `src/config/discoveryPicks.ts` + `src/i18n/index.ts`. Not routed anywhere. ⚠️ **Do NOT touch `src/components/home/atlante/*`** — that's the NEW Atlante home, KEEP. **Salvage before delete:** `InstagramGrid.tsx` is exactly Tripp adoption #K — extract it before removing the cluster.
- **§B Experimental homes:** `src/pages/V2/HomeV2.tsx` (confirm no live bio link), `src/pages/AtlanteLab.tsx` + `src/experience/atlante/signature/*`.
- **§C Config modules:** `src/config/aiCompanion.ts` (verify `AiAssistant.tsx` doesn't read dynamically), `src/config/guideContent.ts`.
- **§D Unused deps (reversible, verify build):** `better-sqlite3`, `react-hook-form`, `@hookform/resolvers`, `class-variance-authority`, `tailwind-merge`, `@types/mapbox-gl`, `@gsap/react` (dead once §A removed). ⚠️ **Hold `zod` + `@stripe/stripe-js`** — surprising to be unused; likely needed by checkout roadmap. Fix knip "unlisted": add `@eslint/js`, `unist-util-visit`, `mdast` to `package.json`.
- **§E Tracked root screenshots:** `git rm` `home-*.png`, `sentiero-*.jpeg`; add glob to `.gitignore`.
- **§F `claude-plugins-official/`** — cloned plugins repo in root; gitignore or remove.
- **§G 77 unused exports / 33 types** in `contentTaxonomy.ts`, `siteContent.ts`, `firebaseService.ts` etc. — tree-shaken, low-priority follow-up tidy, NOT part of the destructive pass.

### Map-lib redundancy (KEEP, separate investigation)

`mapbox-gl` + `maplibre-gl` + `react-map-gl` + `react-simple-maps` all present. Flag for a dedicated consolidation study — do NOT delete during this pass.

**Irreversible/destructive flags:** §A cluster delete (20+ files), §E `git rm` of tracked history, and the Sentiero home archival at cutover. All should be one-commit-per-group with `typecheck && build && audit:size` between batches.

---

## 5. PHASED ROADMAP

Each phase = self-contained, verifiable, revertable.

### Phase 0 — Commit the working tree (safe, no new work)

- Commit §0 deletions; scrub `/futuro` from `src/config/liteMode.ts`.
- Files: `liteMode.ts`, plus the already-`D` files.
- Verify: `npm run typecheck && npm run build`.

### Phase 1 — Cleanup + IA/nav consolidation

1. Execute [SAFE-DELETE] groups 1-3.
2. Salvage `InstagramGrid.tsx`, then (after owner OK) delete §A legacy cluster.
3. **Resolve LITE_MODE divergence (IA problem #1):** reconcile `src/config/liteMode.ts`, `src/App.tsx` gating, and `Navbar.tsx:180` filter to ONE definition. Ensure `/mappa` reachable in LITE (IA problem #2).
4. Rebuild nav + footer to §1 tree: `Navbar.tsx`, `Footer.tsx`. Replace the hardcoded demo featured card (`Navbar.tsx:151-160`) with a real article. Add real `/articoli` index (fixes asymmetric `/guide`). Link `/itinerari/compare`, `/media-kit`, `/press` per §1.

- Files: `App.tsx`, `Navbar.tsx`, `Footer.tsx`, `liteMode.ts`, new `Articoli.tsx`.
- Verify: `npm run audit:ui`, `npm run e2e`, real-browser smoke.

### Phase 2 — Cutover Atlante Vivo → `/`

1. Remove `ATLANTE_PREVIEW` gate at `App.tsx:110`; mount `AtlanteHome` at index.
2. Archive Sentiero: move `/` Home to `/sentiero` opt-in OR archive `src/experience/sentiero/*` + `src/pages/Home.tsx`.
3. `/atlante` → redirect `/`. Delete `/v2` + `/atlante-lab` (after owner OK).
4. Wire Tripp #D (real country counts) into Atlante `ZoneBand`.

- Files: `App.tsx`, `AtlanteHome.tsx`, `atlantePreview.ts`, `src/components/home/atlante/ZoneBand.tsx`, Sentiero files.
- Verify: `npm run audit:cwv` (a11y≥0.95, CLS≤0.1 blocking), `npm run e2e`, real-browser proof.

### Phase 3 — Tripp P0 discovery upgrades

1. #B facets→URL state + clear-all + count badge; #C sort control (`Esplora.tsx`, `ActiveFilterChips.tsx`).
2. #A hierarchical destination taxonomy + term cover/intro/pin (`src/data/` destinations tree, `Destinazione.tsx`, routing). **The big one — L effort, the spine.**

- Verify: typecheck, e2e, responsive-check 320/375/768/1024/1440.

### Phase 4 — Tripp P1 nav + editorial texture

- #E embedded search, #F mega-menu, #G creator page, #H post-format cards, #I post navigation, #J dual-mode breadcrumbs, #K IG strip.
- Files: `Navbar.tsx`, `ChiSiamo.tsx`, `AuthorBio.tsx`, `ContentCard.tsx`, `Breadcrumbs.tsx`, `Articolo.tsx`, `Footer.tsx`.

### Phase 5 — P2 polish + dep cleanup

- #L deals block, #M quick-view, #N pagination modes, #O route micro-moment.
- Drop §D deps (post-§A), fix unlisted deps, §E/§F gitignore + `git rm`, §G export tidy.
- Verify: `npm run audit:quality`, `npm run audit:size`.

---

## 6. OPEN DECISIONS FOR THE OWNER

1. **Cutover timing:** ship Atlante Vivo to `/` now (Phase 2 immediately after Phase 1), or run it flagged one more review cycle? The whole roadmap keys off this.
2. **Sentiero WebGL fate:** archive it entirely, or preserve as an opt-in `/sentiero` "experience" route reachable from the home? (You invested heavily in it; deleting is irreversible without git history.)
3. **`/v2` deletion:** is `HomeV2` linked from any live IG/TikTok bio right now? If yes we redirect instead of delete.
4. **Legacy home cluster (§A) delete:** OK to remove `HomeLegacy.tsx` + 20 `home/*` files permanently (after salvaging `InstagramGrid`)? Biggest cleanup win, biggest blast radius.
5. **Reviews/ratings — the one research conflict:** I recommend **rejecting** star ratings on editorial (off-brand, content-farm signal) and allowing only an _optional_ structured review block for masserie/hotel/restaurants. Confirm you agree, or do you want the full multi-criterion review system as P0?
6. **Shop prominence:** does Shop/Club stay flag-gated utility (current), or become a top-level primary-nav pillar? This decides whether cart chrome enters the header (Tripp pattern I've provisionally rejected).

---

Anchoring files: `src/App.tsx` (router of truth), `src/config/liteMode.ts` (IA correctness trap), `src/config/atlantePreview.ts` (cutover gate), `src/components/Navbar.tsx` + `src/components/Footer.tsx` (nav rebuild), `src/pages/AtlanteHome.tsx` + `src/components/home/atlante/*` (the home — KEEP), `src/pages/HomeLegacy.tsx` + `src/components/home/*` (delete cluster), `src/pages/Home.tsx` + `src/experience/sentiero/*` (Sentiero, archive at cutover). Spec cross-ref: `docs/10_Projects/PROJECT_ATLANTE_VIVO_HOME_2026-07-04.md`.

---

# Appendice A — Best of Tripp (analisi cartella locale)

I've now read Tripp deeply — functions.php, template-tags/hooks, review + coupon tags, the destination Walker, all content layouts (grid/list/carousel × standard/quote/link), single parts (review/coupon/related/author/navigation), quick-view, header menus, loaders, and the blog/navigation customizer sections — and cross-checked against the live React site's routes and components. Here is the ranked "Best of Tripp" for adoption.

---

# Best of Tripp — Ranked ideas for the Travellini React magazine

Reference source: `C:\Users\ccocu\Downloads\...\tripp`. Ideas only — Tripp's PHP is proprietary; nothing is copied, only re-implemented natively in React 19 / Tailwind 4.

Current-site baseline used for the "already have it" column: routes `/esplora`, `/destinazione/:regionSlug`, `/destinazioni`, `/guide`, `/articolo/:slug`, `/posto/:slug`, `/shop`, `/mappa`; components `RelatedArticles`, `AuthorBio`, `Breadcrumbs`, `SearchModal` + `AutocompleteResults`, `ActiveFilterChips`, `ArchiveCard`, `ContentCard`, `Pagination`, `EditorialCollections`.

---

### 1. Destination as a first-class taxonomy (separate from category)

- **What it is:** Tripp runs a dedicated `destination` taxonomy _in parallel_ to `category`, with its own hierarchical `Tripp_Walker_Destination` (parent/child terms), a per-term feature image used as the archive cover (`tripp_author_page_header` swaps in `flextension_get_term_thumbnail_id` → `fullwidth`), a per-term icon (`tripp_xt_get_term_icon`), a location-pin meta chip (`tripp_get_meta_destination`, `<i class="tripp-ico-location">`), and a breadcrumb mode that is explicitly "Destination based" vs "Category based". Category = _topic_ (Food, Coppia, Fuori rotta); Destination = _place_ (Italia → Puglia → Salento).
- **Why it's strong:** This is the exact spine of the "Atlante Vivo, destinations-first, category color only in content" direction. Two orthogonal axes (place vs theme) let one article live under both without collision, give every place a real landing page with a cover image, and produce clean hierarchical URLs.
- **Maps to:** `/destinazione/:regionSlug` → make it hierarchical (`/destinazione/puglia/salento`), give each term a cover image + intro + pin icon; keep category as the color-coded theme layer inside `ContentCard`. Data model in `src/data/` gains a `destinations` tree distinct from `categories`.
- **Effort:** L (data model + routing + archive templates)
- **Already have it:** Partial (flat region route exists; no hierarchy, no term cover/icon, place vs theme not cleanly separated)

### 2. Reviews block: multi-criterion rating + pros/cons + overall score

- **What it is:** `review-template-tags.php` + `single/review.php` render a structured review: an overline "Review", a title, an overall rating with a comment, a `<ul class="review-ratings">` of named criteria (e.g. Location, Comfort, Value each rated), and a two-column `review-pros` / `review-cons` list. A compact `tripp-rating-button` (`★ 8.6`) also appears in post meta and links to `#review`.
- **Why it's strong:** For masserie, hotel, ristoranti, esperienze this is a genuine premium differentiator, it's inherently `schema.org/Review`-ready (AI-search citable), and the pros/cons pattern is skimmable and trustworthy — exactly the "specific, decisions explicit" bar.
- **Maps to:** new `<ReviewBlock>` component rendered inside `Articolo.tsx` / `Posto.tsx`; a small rating pill in `ContentCard`/`ArchiveCard` meta; emit `Review`/`AggregateRating` JSON-LD via existing `JsonLd.tsx`.
- **Effort:** M
- **Already have it:** No

### 3. Faceted filters with URL state, multi-select, "clear all" + selected-count badge

- **What it is:** `tripp_posts_filter_options()` builds filter columns per public taxonomy, each term is a toggle that adds/removes its slug from a comma-joined query arg (`?category=food,coppia`), shows `is-selected`, keeps a running `selected_items` count that renders as a badge on the filter toggle button, and offers a single "Clear all filters" link. Destination is deliberately excluded from the generic filter panel (it's primary nav, not a facet).
- **Why it's strong:** Real faceted browsing with shareable/back-button-safe URLs and an at-a-glance "3 filtri attivi" affordance — the archive UX that turns a blog into a browsable magazine.
- **Maps to:** `Esplora.tsx` + `ActiveFilterChips.tsx` — you already filter by zona/tipo/periodo/budget; add (a) URL query-param sync, (b) a count badge on the "Filtri avanzati" trigger, (c) a one-tap "Cancella tutti".
- **Effort:** S–M (mostly wiring existing filters to the querystring)
- **Already have it:** Partial

### 4. Sort-by control on archives

- **What it is:** Alongside filters, `tripp_sortby()` exposes ordering (recent, popular, etc.) as a first-class control in `loop/filters.php`, configurable per surface in the customizer.
- **Why it's strong:** Cheap, high-utility. "Più recenti / Più letti / Vicino a te" changes an archive from static to explorable.
- **Maps to:** add a sort dropdown to `Esplora.tsx` header, driven by the same query-param state as #3.
- **Effort:** S
- **Already have it:** No

### 5. Post-format variety in the grid (standard / quote / link)

- **What it is:** The same layout (grid/list/carousel) renders **different card templates by post format**: `content.php` (standard image+title+meta), `content-quote.php` (a pull-quote `tripp_post_quote()` overlaid on the thumbnail, minimal chrome), `content-link.php` (title-only card that links _out_, `rel="nofollow"`, no footer). One archive stream, visually varied cards.
- **Why it's strong:** Breaks the monotonous uniform-card grid that reads as "template". A quote card or a link card among photo cards gives editorial rhythm — the anti-AI-slop principle applied to layout.
- **Maps to:** `ContentCard.tsx` / `ArchiveCard.tsx` gain a `format` prop (`standard | quote | link | gallery`) with distinct sub-layouts; feed it from article frontmatter.
- **Effort:** M
- **Already have it:** No

### 6. Quick-view overlay from the archive

- **What it is:** A "Quick View" button on each card (`tripp_quick_view_button`) opens the post in an overlay (`quick-view/quick-view.php`) — media, title, destination/meta, excerpt _or_ full content, optional review + coupon + related, without leaving the archive. Configurable (full vs excerpt, which meta to show, open-on-title-click).
- **Why it's strong:** Keeps browsing momentum on a discovery-heavy archive; lets someone triage 10 places fast. Feels app-like without being a SaaS dashboard.
- **Maps to:** reuse the existing modal pattern (`SearchModal`) → a `<QuickViewDrawer>` on `Esplora.tsx`/`Posto` cards showing the place's hero, quick facts, and CTA.
- **Effort:** M
- **Already have it:** No

### 7. Coupons / deals block (promo code + validity + terms accordion)

- **What it is:** `coupon-template-tags.php` + `single/coupon.php`: a card distinguishing "Promo Code" vs "Sale", a click-to-copy code button, a "Visit website" affiliate CTA (`rel="nofollow" target="_blank"`), an attributes list (valid-from / "Offer ends on" dates), and a collapsible "Terms and conditions" accordion. Posts with a coupon get a `has-coupon` body class.
- **Why it's strong:** Native, tasteful affiliate monetization — one of the site's weakest domains per the audit. Copy-code + expiry + terms reads as a legit deal, not a spam banner.
- **Maps to:** `<DealCard>` inside `Articolo.tsx`/`Posto.tsx`, wired to the existing `affiliateLink` lib; a "has-deal" flag surfaced as a small badge on cards.
- **Effort:** M
- **Already have it:** No

### 8. Mega-menu with destination columns + featured post rows

- **What it is:** Tripp's fullscreen/centered menus + `Tripp_Walker_Destination` render the destination tree as hierarchical columns, and `tripp_mega_menu_posts_rows` injects 1–2 rows of featured posts into the mega panel. Navigation _is_ the destination map.
- **Why it's strong:** For a destinations-first brand, the primary nav should preview places (with cover thumbnails), not just list words. High-perceived-quality, very "premium travel magazine".
- **Maps to:** `Navbar.tsx` → a `<MegaMenu>` panel for "Destinazioni" showing the region tree + 2–3 featured guides with images.
- **Effort:** M–L
- **Already have it:** No

### 9. Live search embedded in the header (multi-type autocomplete)

- **What it is:** `tripp_live_search()` sits _inside_ the menu bar (`main-search-bar`), persistently visible on desktop, with autocomplete across multiple post types (`flextension_live_search_post_types`), plus a config for showing search on the mobile menu.
- **Why it's strong:** You already have the hard part (`SearchModal` + `AutocompleteResults`); Tripp's lesson is _placement + scope_ — a permanent, fast, multi-entity search (places, guides, itineraries, shop) rather than a hidden modal.
- **Maps to:** promote `SearchModal`'s autocomplete into an always-present `Navbar` search field on desktop; make results span destinations + guide + itinerari + shop.
- **Effort:** S–M
- **Already have it:** Partial

### 10. Archive pagination _strategy_ as a choice (numbered / load-more / infinite / next-prev)

- **What it is:** `tripp_customizer_posts_pagination_options()` offers four pagination modes per surface. Tripp treats pagination as a UX decision, not a default.
- **Why it's strong:** Different archives want different behavior — "Load more" for casual discovery on `/esplora`, numbered for deep archives (SEO-crawlable). Getting this right affects both engagement and crawl depth.
- **Maps to:** `Pagination.tsx` gains a `mode` prop; pick per route (load-more on Esplora, numbered on `/guide`).
- **Effort:** S–M
- **Already have it:** Partial (numbered exists)

### 11. Post navigation: prev/next with thumbnail + destination + "back to archive"

- **What it is:** `single/navigation.php` renders a 3-cell footer nav: previous (thumbnail + "Previous" + title + destination pin), a center "back to all {post type}" archive link, and next (same). Graceful "No older/newer" empty states.
- **Why it's strong:** Richer than a bare ← →: the thumbnail + place context makes the next click compelling, and the center archive link is a smart escape hatch. Keeps readers in the flow.
- **Maps to:** a `<PostNavigation>` at the bottom of `Articolo.tsx` / `Itinerario.tsx`, sequencing within the same destination or theme.
- **Effort:** S
- **Already have it:** Partial/No (RelatedArticles exists, but no ordered prev/next with this treatment)

### 12. Author / creator page richness (cover, location, follow numbers, social, archive)

- **What it is:** Author gets a cover image header (`flextension_author_cover_image_id` → `fullwidth`), and the bio is composed via filters: location, follower numbers, social links, follow button, and a proper author _archive_ of their posts. `single/author.php` renders avatar + name + edit link + assembled bio.
- **Why it's strong:** For Rodrigo & Betta, the "authors" ARE the brand. A cinematic author/creator page (cover, "chi siamo" bio, their guides) is on-brand and trust-building.
- **Maps to:** upgrade `AuthorBio.tsx` and connect to `ChiSiamo.tsx`; optionally an author-scoped archive. Location/social already partly in `site.ts`.
- **Effort:** M
- **Already have it:** Partial (AuthorBio box yes; cover/archive/rich meta no)

### 13. Breadcrumb strategy config: destination-based vs category-based

- **What it is:** `blog_single_post_breadcrumb` lets a single post's breadcrumb follow the **destination** hierarchy or the **category** hierarchy (or off). One switch, two trails.
- **Why it's strong:** With two taxonomies (#1), the breadcrumb should follow _place_ for a destination guide but _theme_ for a listicle. Small config, big IA/SEO clarity.
- **Maps to:** `Breadcrumbs.tsx` gains a `mode: 'destination' | 'category'` prop chosen per article type.
- **Effort:** S
- **Already have it:** Partial (Breadcrumbs component exists; no dual-mode)

### 14. Themed route/loader micro-moment (used sparingly)

- **What it is:** Seven hand-drawn SVG loaders (airplane, camper-van, moon, ripple, water-drop, windmill) shown as a full-screen overlay while content loads, opacity/overlay configurable.
- **Why it's strong:** A branded travel loader is a cheap delight beat. **Caveat for this brand:** the DNA is calm/anti-SaaS — adopt only as a subtle page-transition accent (e.g. a single line-drawn plane on route change), never a spinning gimmick.
- **Maps to:** an optional loader in `TransitionLink.tsx` / route Suspense fallback; one restrained SVG, respect `prefers-reduced-motion`.
- **Effort:** S
- **Already have it:** No

---

## Two structural patterns worth stealing at the architecture level (not features)

- **Per-surface visibility contract (`tripp_post_can_show()` + granular customizer toggles).** Tripp gates every element — thumbnail, title, excerpt, metadata — behind a single `can_show(part, post)` check, and exposes show/hide toggles _per surface_ (archive vs single vs quick-view vs search). Re-implemented as a small `contentVisibility` config, this keeps card/meta rendering consistent and removes ad-hoc conditionals scattered across pages. **Effort M; adopt selectively.**

- **Content-model conventions:** `has-review` / `has-coupon` / post-format body classes drive layout. In React this becomes typed flags on the article/place model (`format`, `hasReview`, `hasDeal`) that downstream cards and pages branch on — one source of truth, no per-component guessing.

---

## What to explicitly NOT adopt

WooCommerce quick-view/product hooks (`wc-template-functions.php`, `search/content-product.php`) — you already run Stripe, not Woo; ignore. The Flextension/Tripp-XT plugin coupling (follow buttons, likes/views, live-search backend) is proprietary — take the _UX pattern_, build the data yourself. Dark-mode LocalStorage plumbing (`template-hooks.php`) — your stack already handles theme; no need to mirror their AJAX user-meta approach.

## Suggested adoption order (impact ÷ effort)

1. **#3 + #4** filters-to-URL + sort (S, immediate archive upgrade, unblocks Esplora)
2. **#1** destination taxonomy hierarchy (L, the spine of Atlante Vivo)
3. **#2** reviews (M, the premium differentiator + AI-search schema)
4. **#5 + #6** post-format cards + quick-view (editorial texture + browse speed)
5. **#7** deals block (M, fixes the weak monetization domain)
6. **#8 + #9** mega-menu + embedded search (nav becomes the map)
7. Polish: **#10–#14**

---

# Appendice B — Tripp web + demo (tripptheme.com)

# "Best of Tripp" — Research Synthesis

WebFetch was 403-blocked by Cloudflare on every `tripptheme.com` URL (root, /documentation, all demo paths). I bypassed it by rendering the live demos in a real browser (Playwright, read-only) and cross-referenced the ThemeForest listing + reseller mirrors + changelog notes via WebSearch/WebFetch. Two demos captured in full DOM (tripp1, tripp4), two partially (tripp2, tripp3). Where a claim comes only from marketing copy and not from a rendered page, I mark it `[copy-only]`.

## Sources

- Marketing/feature list: https://themeforest.net/item/tripp-travel-blog-magazine-wordpress-theme/44958368 (fetch OK)
- Docs (changelog/features, via cached fetch): https://tripptheme.com/documentation (direct fetch 403; content recovered)
- Rendered demos: https://tripptheme.com/tripp1/ , https://tripptheme.com/tripp2/ , https://tripptheme.com/tripp4/ (tripp3 exists, same pattern)
- Reseller descriptions: https://unrealthemes.com/tripp-travel-blog-magazine-wordpress-theme/ , https://athemes.com/collections/best-wordpress-travel-blog-themes/
- Vendor: https://wydethemes.com/

---

## The demos (4, one-click importable)

Tripp ships **4 demo homepages** off one theme, same taxonomy/data, different homepage assembly and header style:

- **tripp1 — "Magazine / flagship" (+ WooCommerce Store).** The most feature-dense: full-bleed hero **featured-post slider**, then `Latest Posts` → affiliate ad banner → `Destinations` → `Pick a country and start exploring!` → `Travel Deals & Offers` → `Meet Our Authors`. Header has a **cart icon**; footer has a `Store` link, newsletter, and a Popular/Recent tabbed widget. This is the "monetized travel magazine" build.
- **tripp2 — editorial/minimal.** Clean centered header, no cart, story-led. (Headings render as image/JS blocks; structure mirrors the others.)
- **tripp3 — variant** (solo/alt layout; same taxonomy).
- **tripp4 — "The Couple" (closest to Travelliniwithus).** Header: social row + centered wordmark logo + live-search + sidebar toggle + **dark-mode toggle**. Nav: `Home · Explore · Destinations · Top Places · About · Contact`. Homepage order: **personal intro block** ("Meet Olivia & Daneil — a couple passionate about photography and travel blogging…" with a stacked photo carousel) → `Destinations` (continent picker) → featured-posts grid → `Categories` → `Explore Stories by Country` (country list **with entry counts**) → `Travel Deals & Offers` (rich post cards) → `Follow Us` (Instagram feed) → recent-posts strip → footer (newsletter + Explore + About + Info).

The vendor is Wyde; the couple demo (tripp4) is the direct analog to Rodrigo & Betta.

## Page types offered (the full template set)

From the rendered demos + ThemeForest/docs:

- **Home** (4 assembly variants above)
- **Blog / Explore archive** (`/blog/`) — filterable feed
- **Single post** — multiple layouts (standard, sticky-image-left, gallery, video/vertical-Shorts) with breadcrumbs, reading time, likes/views/comments/shares, review score, multi-author byline
- **Destination pages** — hierarchical taxonomy: continent → country → region (e.g. `/destination/north-america/united-states/hawaii/`)
- **Category pages** — a _second, orthogonal_ taxonomy by **terrain/theme** (Coast, Desert, Grassland, Lake, Landmark, Mountain, Town)
- **Tag pages** — used for cross-cuts like `?tag=coupon` (the Deals feed is literally a tag)
- **Author pages** — cover image, follower count, social links, guest-author support
- **Shop / WooCommerce** (tripp1 only) — product archive, AJAX filters, quick view, cart
- **About**, **Contact**, **Privacy**, **Login/Registration** `[copy-only]`
- **Deals & Offers** — affiliate/coupon posts with JSON-LD offer schema

## Signature features shown

- **SPA-mode navigation** (client-side page transitions) `[copy-only, docs]`
- **Dark-mode toggle** (live on tripp4 header)
- **Live instant search** in the header
- **Two-axis content model**: WHERE (destination geo-tree) × WHAT (terrain/theme category). Every post carries both.
- **Country index with entry counts** ("Italy — 3 Entries") — a browsable proof-of-depth module
- **Rich post cards**: review score (★4.7), view count, comment count, share count, video-play badge
- **Reviews/ratings with rich snippets**; **Reading Time**; likes/views tracking
- **Vertical video / YouTube-Shorts** post format
- **Deals & Offers** as a first-class, affiliate-plugin-integrated section (ThirstyAffiliates/Pretty Links) with schema
- **Instagram "Follow Us" grid** near the footer
- Header/menu styles: full-screen, centered, standard; sticky; mega-menu `[copy-only]`

---

## What a premium creator travel site SHOULD adopt (the strong patterns)

1. **Two orthogonal taxonomies, both browsable.** WHERE (continent → country → region) and WHAT (theme: coast/mountain/city/food…). This is Tripp's best structural idea and it maps perfectly onto Travelliniwithus's real content (Egitto/Mar Rosso, Volterra, Malesia…). Adopt as the definitive URL/IA spine: `/destinazioni/<continente>/<paese>/…` + a theme taxonomy. It also feeds internal linking and AI/SEO entity clarity.
2. **Country index with entry counts.** "Italia — 8 racconti" is honest social proof of depth and a great low-effort browse module. Adopt (only render counts that are real — never fabricate).
3. **The "Meet [couple]" intro-first homepage (tripp4).** Personal hero → destinations → stories → follow. This is exactly the calm, creator-led structure Atlante Vivo is already reaching for. It validates "personal identity first, destinations-first grid second."
4. **Author/creator pages as real pages** with cover, socials, and their post list. For a two-person brand (Rodrigo & Betta) a proper `/chi-siamo` + per-author archive is high value.
5. **A single, restrained "signature" hero** (tripp4's stacked-photo intro), not a heavy slider. Aligns with the one-WebGL-cover-beat decision.
6. **Reading time + honest post meta.** Reading time and category/destination chips are clean, useful, non-gimmicky. Keep these.
7. **Instagram "Follow Us" strip near the footer** — natural for a creator brand whose center of gravity is IG. Adopt as a single quiet grid (real posts).
8. **Deals/offers as a tag-driven collection, not a bolted-on module.** If Travelliniwithus ever monetizes, model "offerte/partner" as a normal content type with schema, not a dashboard widget.

## What to AVOID (WordPress-magazine bloat that would hurt a calm editorial brand)

1. **Vanity-metric overload on cards** — the ★rating + view count + comment count + share count + play badge stack on every card is classic magazine clutter and reads as "content farm." Keep at most one signal (reading time or a single category chip). This is the single most anti-brand pattern in Tripp.
2. **Star reviews / ratings on editorial posts.** A creator's travel story isn't a "4.7." Drop review scores entirely (they exist mainly to win rich-snippet stars — off-brand and slightly manipulative).
3. **Dense homepage stacking** (hero slider + Latest + ad banner + Destinations + country + Deals + Authors, all on one page — tripp1). Too many competing modules. Pick 4–5 calm beats, not 8.
4. **Affiliate ad banners inline in the feed** (tripp1's `buy-tripp` banner slot). Kills the premium/editorial feel.
5. **WooCommerce/cart chrome in the header** unless the shop is a real priority. A persistent cart icon signals "store," not "editorial travel."
6. **Full-screen/mega-menu + four header variants.** Over-configurable navigation is WP-theme thinking. Commit to ONE calm header.
7. **SPA-mode as a theme gimmick** — you already have real React routing; don't import the concept as a "feature," it's just your baseline.
8. **Feature maximalism in general.** Tripp's selling point is "everything for everyone via demos." Travelliniwithus's is the opposite: one opinionated, calm build. Treat Tripp as an **IA/taxonomy reference**, not a feature checklist.

## Bottom line for the "definitive structure" decision

Steal Tripp's **information architecture** (dual destination×theme taxonomy, country index with real counts, creator/author pages, personal-intro homepage, deals-as-content), and explicitly **reject its magazine surface** (metric-stacked cards, star ratings, inline affiliate banners, cart chrome, 8-module homepages, menu-variant sprawl). That split is the cleanest way to turn "best of Tripp" into the Atlante Vivo direction without importing WordPress bloat.

---

# Appendice C — Audit IA attuale

Full IA audit complete. Findings below.

---

# IA AUDIT — Current site route inventory (`src/App.tsx`)

**Flag state (from `.env`):** `VITE_LITE_MODE=false` → full site active (LITE gates currently OPEN). `VITE_ATLANTE_PREVIEW=true` → `/atlante` mounted in dev. Prod build omits `/atlante` unless the flag is set. All "LITE-gated" rows below are live **today** because LITE_MODE is off; they vanish only if someone flips the flag back to staging.

## Complete route table

Rendering model matters: routes under `<Route path="/" element={<Layout/>}>` (App.tsx:108) get Navbar+Footer+analytics; the five routes **above** that block are standalone (no chrome).

| Path                                          | Component                      | Category                       | LITE-gated?                                           | What it is / content status                                                                                                                                                                                                                                |
| --------------------------------------------- | ------------------------------ | ------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/v2`                                         | HomeV2 (`pages/V2/HomeV2.tsx`) | standalone-landing             | no                                                    | App.tsx:100. Alternate home, no navbar/footer. Bio-link candidate. **Experimental / parallel home #3.**                                                                                                                                                    |
| `/atlante-lab`                                | AtlanteLab                     | standalone-landing             | no                                                    | App.tsx:101. GLSL/shader sandbox (noindex lab). **Experimental.**                                                                                                                                                                                          |
| `/vieni-con-noi`                              | VieniConNoi                    | standalone-landing             | no                                                    | App.tsx:102. IG/TikTok bio-link opt-in page. Real content, deliberately chrome-less.                                                                                                                                                                       |
| `/iscrivi`                                    | → `/vieni-con-noi`             | redirect                       | no                                                    | App.tsx:103. Single-hop alias.                                                                                                                                                                                                                             |
| `/sentiero`                                   | → `/`                          | redirect                       | no                                                    | App.tsx:106. Old preview path; Sentiero was promoted to `/`. Dedup redirect.                                                                                                                                                                               |
| `/` (index)                                   | Home (`pages/Home.tsx`)        | public (home)                  | no                                                    | App.tsx:109. **Sentiero WebGL experience.** Technically under Layout, but Home.tsx:13-36 injects CSS that force-hides nav/footer/assistant and locks the viewport → renders as a full-screen standalone immersive cover. Real (the 5 real reels as tappe). |
| `/atlante`                                    | AtlanteHome                    | public (home, flagged)         | no (ATLANTE_PREVIEW-gated)                            | App.tsx:110. New "Atlante Vivo" home direction, mounted only when `ATLANTE_PREVIEW`. **Experimental / parallel home #2**, browser-verified, not yet cutover.                                                                                               |
| `/esplora`                                    | Esplora                        | public                         | **yes**                                               | App.tsx:111. Primary discovery finder (zone/type/format/q). Real, canonical entry point.                                                                                                                                                                   |
| `/destinazione/:regionSlug`                   | Destinazione                   | public                         | no                                                    | App.tsx:112. Region detail. Real content.                                                                                                                                                                                                                  |
| `/destinazioni`                               | → `/esplora`                   | redirect                       | **yes**                                               | App.tsx:117-119. Legacy consolidation.                                                                                                                                                                                                                     |
| `/esperienze`                                 | → `/esplora`                   | redirect                       | **yes**                                               | App.tsx:120-122. Legacy consolidation.                                                                                                                                                                                                                     |
| `/guide`                                      | → `/esplora?format=guida`      | redirect                       | **yes**                                               | App.tsx:123-128. Index redirect (note: detail `/guide/:slug` still real, below).                                                                                                                                                                           |
| `/chi-siamo`                                  | ChiSiamo                       | public                         | no                                                    | App.tsx:129. About. Real.                                                                                                                                                                                                                                  |
| `/collaborazioni`                             | Collaborazioni                 | public                         | no                                                    | App.tsx:130. Partner/brand page. Real, primary CTA target.                                                                                                                                                                                                 |
| `/media-kit`                                  | MediaKit                       | public                         | no                                                    | App.tsx:131. Media kit. Real. Footer-only.                                                                                                                                                                                                                 |
| `/press`                                      | Press                          | public                         | no in App (but listed LITE-disabled — see divergence) | App.tsx:132. Real. Footer-only.                                                                                                                                                                                                                            |
| `/contatti`                                   | Contatti                       | public                         | no                                                    | App.tsx:133. Contact. Real.                                                                                                                                                                                                                                |
| `/articolo/:slug`                             | Articolo                       | public                         | no                                                    | App.tsx:134. Editorial article detail. Real.                                                                                                                                                                                                               |
| `/itinerari`                                  | Itinerari                      | public                         | **yes**                                               | App.tsx:135. Itinerary index. Real.                                                                                                                                                                                                                        |
| `/itinerari/compare`                          | ItinerariCompare               | public                         | **yes**                                               | App.tsx:136-138. Compare view. Real but **not linked in nav/footer** (only reachable from Itinerari page).                                                                                                                                                 |
| `/itinerari/:slug`                            | Itinerario                     | public                         | **yes**                                               | App.tsx:139. Itinerary detail. Real.                                                                                                                                                                                                                       |
| `/guide/:slug`                                | Guida                          | public                         | no                                                    | App.tsx:140. Guide detail. Real. (Index `/guide` is a redirect — asymmetric.)                                                                                                                                                                              |
| `/quiz`                                       | → `/esplora`                   | redirect                       | **yes**                                               | App.tsx:141-143. Archetype quiz retired into finder.                                                                                                                                                                                                       |
| `/strumenti`                                  | Strumenti                      | public                         | no in App (but listed LITE-disabled — divergence)     | App.tsx:144. Tools/resources hub. Real. Nav+footer "resourcesLabel".                                                                                                                                                                                       |
| `/preferiti`                                  | Preferiti                      | public                         | **yes**                                               | App.tsx:145. Favorites. Real (client-state).                                                                                                                                                                                                               |
| `/risorse`                                    | Risorse                        | public                         | no in App (but listed LITE-disabled — divergence)     | App.tsx:146. "Cosa usiamo" affiliate/gear. Real. Footer-only.                                                                                                                                                                                              |
| `/shop`                                       | Shop                           | public                         | **yes**                                               | App.tsx:147. Product listing. Real (Stripe).                                                                                                                                                                                                               |
| `/shop/:slug`                                 | ProductPage                    | public                         | **yes**                                               | App.tsx:148. Product detail. Real.                                                                                                                                                                                                                         |
| `/club`                                       | Club                           | public                         | **yes**                                               | App.tsx:149. Membership. Real.                                                                                                                                                                                                                             |
| `/posto/:slug`                                | Posto                          | public                         | no                                                    | App.tsx:150. Single place detail (the ~40 real posts). Real, core content.                                                                                                                                                                                 |
| `/mappa`                                      | Mappa                          | public                         | no                                                    | App.tsx:151. Mapbox world map. Real.                                                                                                                                                                                                                       |
| `/account/acquisti`                           | MieiAcquisti                   | public (gated by purchase)     | no                                                    | App.tsx:152. Post-purchase library. Real. **Not in nav/footer.**                                                                                                                                                                                           |
| `/lead-magnet`                                | LeadMagnet                     | standalone-landing (in-Layout) | no in App (but listed LITE-disabled — divergence)     | App.tsx:153. Lead capture. Real. **Not linked in nav/footer.**                                                                                                                                                                                             |
| `/admin`                                      | AdminDashboard                 | admin                          | no                                                    | App.tsx:156-163. ProtectedRoute. Real.                                                                                                                                                                                                                     |
| `/admin/site-content/:pageId`                 | SiteContentEditor              | admin                          | no                                                    | App.tsx:164-171.                                                                                                                                                                                                                                           |
| `/admin/editor` + `/admin/editor/:id`         | ArticleEditor                  | admin                          | no                                                    | App.tsx:172-187.                                                                                                                                                                                                                                           |
| `/admin/product-editor` + `/:id`              | ProductEditor                  | admin                          | no                                                    | App.tsx:188-203.                                                                                                                                                                                                                                           |
| `/admin/users`                                | Users                          | admin                          | no                                                    | App.tsx:204-211.                                                                                                                                                                                                                                           |
| `/admin/orders`                               | Orders                         | admin                          | no                                                    | App.tsx:212-219.                                                                                                                                                                                                                                           |
| `/privacy` `/cookie` `/termini` `/disclaimer` | legal/\*                       | legal                          | no                                                    | App.tsx:222-225. Real.                                                                                                                                                                                                                                     |
| `*`                                           | NotFound                       | fallback                       | no                                                    | App.tsx:227.                                                                                                                                                                                                                                               |

---

## (a) What nav/footer expose vs what exists

**Navbar** (desktop, `Navbar.tsx:162-182`) exposes only 5 items: **Esplora** (mega-menu → `/esplora`, `/mappa`, `/esplora?format=guida`, `/itinerari` + a hardcoded featured card to `/esplora?zone=Italia&type=posti-particolari`), **Strumenti** (`/strumenti`), **Shop**, **Club**, **Chi siamo** (sub: Contatti). Plus utility: "Collabora con noi" → `/collaborazioni`, search, favorites heart (`/preferiti`, `!LITE_MODE`), user menu → `/admin` if admin.

**Footer** (`Footer.tsx`) exposes: Esplora, Mappa, Itinerari, Strumenti, Shop, Club (Scopri col); Newsletter, Preferiti, `/risorse`, `/disclaimer` (Risorse col); Chi siamo, Collaborazioni, Media kit, Press, Contatti, admin (Progetto col); Privacy/Cookie/Termini/Disclaimer (bottom).

**Routes that exist but NO nav/footer surface links to them:** `/media-kit` (footer-only, not nav), `/press` (footer-only), `/lead-magnet`, `/account/acquisti`, `/itinerari/compare`, `/vieni-con-noi`, `/v2`, `/atlante`, `/atlante-lab`, and all detail routes (`/posto/:slug`, `/destinazione/:slug`, `/articolo/:slug`, `/guide/:slug`). The home `/` (Sentiero) itself has no way back to it except the logo — and once on it, its own CSS hides the navbar, so the WebGL experience is a dead-end island unless the user uses the in-experience HUD.

**Navbar featured card** (`Navbar.tsx:151-160`) is a hardcoded placeholder ("Salento ad agosto") flagged in-code as demo — points to a filtered `/esplora`, not a real article.

## (b) Overlaps / duplication / redirect chains

- **Four home implementations coexist in the codebase:** `Home` (Sentiero, live `/`), `AtlanteHome` (`/atlante`, flagged), `HomeV2` (`/v2`), and **`HomeLegacy.tsx` — an orphan file imported nowhere** (confirmed: not referenced in `App.tsx` or any route). No single source of truth for "the homepage."
- **Discovery is fragmented across 5+ live entry points** all covering overlapping content: `/esplora`, `/mappa`, `/itinerari`, `/destinazione/:slug`, `/posto/:slug`, `/guide/:slug` — plus 4 redirects (`/destinazioni`, `/esperienze`, `/guide`, `/quiz`) all funneling into `/esplora`.
- **Redirects are all single-hop** (`/iscrivi`→`/vieni-con-noi`, `/sentiero`→`/`, the four legacy→`/esplora`). No multi-hop chains — good.
- **Asymmetric `/guide`:** index `/guide` is a redirect to the finder, but `/guide/:slug` renders a real `Guida` page. Confusing pairing.

## (c) Orphan / dead routes

- **`HomeLegacy.tsx`** — dead file, not routed. Delete candidate.
- **`/futuro`** — listed in `liteMode.ts:17` (`LITE_DISABLED_ROUTES`) and `:33` (`PREFIX_DISABLED`) but **no `<Route>` for it exists** in App.tsx. Dead reference.
- **`/itinerari/compare`** — real page, zero internal links from nav/footer.
- **`/account/acquisti`, `/lead-magnet`, `/media-kit`, `/press`** — reachable only via deep link or footer; no primary IA path (SEO orphan risk).

## (d) IA problems

1. **LITE_MODE has three divergent definitions of "what's hidden."** `liteMode.ts` declares `/press`, `/risorse`, `/strumenti`, `/futuro`, `/lead-magnet` disabled (lines 3-36), but **App.tsx renders all of these unconditionally** (Press:132, Risorse:146, Strumenti:144, lead-magnet:153) and Navbar's own filter (`Navbar.tsx:180`) only strips 5 hrefs (`/esplora`,`/shop`,`/club`,`/preferiti`,`/itinerari`). So `isDisabled('/strumenti')` returns `true` while the route is live and the navbar still shows it. Three inconsistent notions of the lite surface — a real correctness trap for any future staging build.
2. **In LITE_MODE, `/mappa` becomes unreachable from the navbar.** Mappa is only surfaced inside the Esplora mega-menu, and the whole Esplora nav item is filtered out in LITE (its `href` is `/esplora`, `Navbar.tsx:180-181`). Footer still links it, but the primary nav loses it.
3. **No clear "home" hierarchy.** The live `/` is an immersive WebGL dead-end (nav/footer CSS-hidden) while the actual magazine/commerce content lives on subpages the home barely links into. Competing with it: `/atlante` (next home), `/v2` (another), `HomeLegacy` (a fourth). This is the single biggest IA ambiguity to resolve in the "definitive structure" decision.
4. **Too many overlapping content entry points** (Esplora + Mappa + Itinerari + Destinazione + Posto + Guide + 4 redirects) with no explicit primacy — users and crawlers get 6 doors into the same room.
5. **Standalone bio-landings (`/vieni-con-noi`, `/v2`) and `/lead-magnet` are IA-isolated** — intentional for paid/bio traffic, but they have no internal inbound links, so they accrue no internal-link equity.

**Files referenced:** `src/App.tsx`, `src/config/liteMode.ts`, `src/config/atlantePreview.ts`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/Layout.tsx`, `src/pages/Home.tsx`, `src/pages/HomeLegacy.tsx` (orphan).

---

# Appendice D — Audit codice morto / cruft

Investigation complete. Here is the categorized dead-code / cruft audit. Nothing was modified.

---

# Dead-Code & Cruft Audit — TRAVELLINIWITHUS

Method: `git status --short`, `git stash list` (empty), `npx knip@latest`, `node scripts/check-size.mjs`, plus targeted grep verification of every candidate against `server.ts`, `scripts/`, and `src/`. Router of truth: [src/App.tsx](c:/Users/ccocu/Desktop/TRAVELLINIWITHUS/src/App.tsx). Live home is `<Home/>` → `SentieroExperience` ([src/pages/Home.tsx](c:/Users/ccocu/Desktop/TRAVELLINIWITHUS/src/pages/Home.tsx)).

---

## 0. Pre-existing uncommitted refactor — already deleted in working tree (COMMIT, don't re-audit)

These are `D` in `git status` (the refactor already removed them). No action needed beyond committing; listed so the destructive step doesn't "re-discover" them:
`src/components/futuro/*` (5), `src/components/audio/*` (2), `src/pages/Futuro.tsx`, `src/components/{AffiliateDisclosure,AnimatedCounter,InlineNewsletterBanner}.tsx`, `src/config/{rebuildMode,experiments,integrations,audioGuides,experienceVisuals}.ts`, `src/data/seedArticle.ts`, `src/hooks/{useExperiment,usePagination}.ts`, root `article-bali.md`.
Note: `/futuro` is still listed in `LITE_DISABLED_ROUTES`/`PREFIX_DISABLED` in [src/config/liteMode.ts](c:/Users/ccocu/Desktop/TRAVELLINIWITHUS/src/config/liteMode.ts) — a stale reference to now-deleted Futuro. Clean that string when committing.

---

## [SAFE-DELETE] — clearly unused, evidence-backed, small blast radius

| Path                                                  | Reason                                       | Evidence                                                                                                                                                                                                                  |
| ----------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/errorTracking.ts`                            | Dead no-op module                            | knip "unused files"; [src/components/Layout.tsx:63](c:/Users/ccocu/Desktop/TRAVELLINIWITHUS/src/components/Layout.tsx) comment states its `initErrorTracking()` "era un no-op … Rimossa"; grep shows only self-references |
| `src/components/CartDrawer.tsx`                       | Orphaned; cart UI uses `CartContext`         | knip unused; grep: only self-definition, no importer                                                                                                                                                                      |
| `scripts/generate-assets.mjs`                         | Not referenced by any npm script             | knip unused; not in `package.json` scripts (verified)                                                                                                                                                                     |
| `scripts/lhci-preview.mjs`                            | Not referenced by any npm script             | knip unused; not in `package.json` scripts                                                                                                                                                                                |
| `sentiero-v2-*.jpeg` (7 untracked files at repo root) | Dev screenshots left in root, not gitignored | `git status ??`; `git check-ignore` → not ignored; not referenced in src. Files: `sentiero-v2-{cover-stage2,reel-live-stage02,stage0,stageX,stageX-2,video-active,video-fixed,video-fixed2}.jpeg`                         |

---

## [NEEDS-REVIEW] — probably dead, but owner decision or has references

### A. Legacy home cluster (owner keep-as-reference vs delete)

`HomeLegacy.tsx` is not mounted anywhere in the router (index route renders Sentiero). It transitively pulls a whole dead subtree. knip flags every node as unused; the only importer of the `home/*` flat components is `HomeLegacy` itself.

- [src/pages/HomeLegacy.tsx](c:/Users/ccocu/Desktop/TRAVELLINIWITHUS/src/pages/HomeLegacy.tsx)
- `src/components/home/*.tsx` — **20 flat files**: `HeroSection, HeroBackdrop, SplashIntro, CoupleIntro, Diary3DScroll, CustomCursor, CommercialBlock, HomeCollaborationCta, HomeDiscoveryFinder, HomeDispatchIndex, HomeEditorialPromise, HomeFeaturedDestinations, HomeLeadMagnet, HomePartnerSignal, HomeTrustStrip, InteractiveMapSection, LatestArticles, MonetizationTeaser, NewsletterFeature, PartnerLogosStrip`
- `src/components/InstagramGrid.tsx` (imported only by HomeLegacy)
- `src/config/discoveryPicks.ts` (imported only by `home/HomeDiscoveryFinder`; Navbar reference at line 112 is a comment, not an import)
- `src/i18n/index.ts` (knip unused)

⚠️ Do NOT confuse with `src/components/home/atlante/*` — that subdir (`HeroCopertina, CategoryPill, PezzoForte, ReelStrip, MetodoBand, ZoneBand`) is the NEW Atlante Vivo home and IS imported by `AtlanteHome.tsx`. **KEEP** it.

### B. Experimental home scaffolding — retirable now that Atlante Vivo is chosen (owner decision)

| Path                                                              | Route                             | Note                                                                                           |
| ----------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/pages/V2/HomeV2.tsx`                                         | `/v2` (standalone)                | May still be linked from IG/TikTok bio — confirm before removing. Untracked.                   |
| `src/pages/AtlanteLab.tsx` + `src/experience/atlante/signature/*` | `/atlante-lab` (noindex GLSL lab) | Was the shader scratch route. Likely retirable now Atlante Home exists; owner call. Untracked. |

### C. Config modules flagged unused (verify no dynamic/admin use)

- `src/config/aiCompanion.ts` — knip unused (but `AiAssistant.tsx` exists; confirm it doesn't read it dynamically)
- `src/config/guideContent.ts` — knip unused

### D. Unused dependencies (removal is reversible but verify build)

knip + grep against `server.ts`/`scripts`/`src` found NO usage: `zod`, `better-sqlite3`, `@stripe/stripe-js`, `react-hook-form`, `@hookform/resolvers`, `class-variance-authority`, `tailwind-merge`, `@types/mapbox-gl`. Dev: `@typescript-eslint/eslint-plugin/parser`, `autoprefixer`, `eslint-config-prettier`, `eslint-plugin-react`, `schema-dts`.
`@gsap/react` is used **only** by the dead legacy-home cluster (§A) — becomes truly unused once §A is deleted.
⚠️ `zod`/`@stripe/stripe-js` are surprising to be unused (checkout/validation) — verify against future roadmap before dropping. Also fix knip's "unlisted deps": `@eslint/js`, `unist-util-visit`, `mdast` are imported but not in `package.json`.

### E. Tracked root screenshots (need `git rm`, hence review not safe-auto-delete)

Committed dev screenshots polluting repo root: `home-desktop-1280{,-full}.png`, `home-mobile-375-{full,menu-open,top}.png`, `home-tablet-768-full.png`, `sentiero-desktop-{noassistant,portal,stage0}.jpeg`, `sentiero-mobile-{final-success,final-v2,stage0}.jpeg`. Add `*.jpeg`/screenshot glob to `.gitignore`.

### F. Untracked non-app directory

`claude-plugins-official/` (untracked) — a cloned plugins repo sitting in the project root; knip scans it and reports 12 false-positive "unused files". Not part of the site. Either gitignore or remove; keep out of `src` audits regardless.

### G. Export-level dead code (low priority, tree-shaken — not files)

knip reports **77 unused exports + 33 unused types + 9 duplicate exports**, concentrated in `src/config/contentTaxonomy.ts` (many `slugify*`/`LEGACY_*_MAP`/duplicate `ZONES|TYPES|FORMATS`), `src/config/siteContent.ts` (unused interfaces), `src/services/firebaseService.ts` (many unused fetch/save fns), `src/utils/discoveryQuery.ts`, `src/utils/dateValue.ts`, `src/lib/animations.ts`. These don't ship (tree-shaking) — treat as a follow-up tidy, not part of the destructive file-delete pass. Full list available in knip output if wanted.

---

## [KEEP] — still live, do not touch

- `src/experience/sentiero/*` — the current `/` home. LIVE. (modified in working tree.)
- `src/experience/atlante/*` + `src/components/home/atlante/*` + `src/pages/AtlanteHome.tsx` — the CHOSEN new home, mounted at `/atlante` behind `ATLANTE_PREVIEW` ([src/config/atlantePreview.ts](c:/Users/ccocu/Desktop/TRAVELLINIWITHUS/src/config/atlantePreview.ts)). KEEP through cutover.
- All routed pages in App.tsx (Esplora, Destinazione, Articolo, Itinerari*, Guida, Shop, ProductPage, Club, Mappa, MediaKit, Press, admin/*, legal/\*, etc.).
- Map libraries: `maplibre-gl` (1 importer), `react-simple-maps` (1 importer) confirmed used; `mapbox-gl`/`react-map-gl` show 0 direct `from '…'` hits but the build still emits a `mapbox` chunk (size audit) and `MapboxWorldMap.tsx`/`ItineraryMap.tsx` exist — treat as KEEP but flag the 4-way map-lib redundancy (`mapbox-gl` + `maplibre-gl` + `react-map-gl` + `react-simple-maps`) as a separate consolidation investigation, NOT a delete.
- `node-cache` — used in `server.ts:3` (knip can't see it as a runtime dep of the express server).

---

## Recommended safe order for the destructive step

1. Commit the §0 working-tree deletions (+ scrub `/futuro` from `liteMode.ts`).
2. Delete §[SAFE-DELETE] rows.
3. Owner ruling on §A (legacy home) and §B (V2 / atlante-lab retirement) — biggest win, highest ambiguity.
4. After §A removal, re-run `npm run audit:deps` — then drop §D deps (incl. `@gsap/react`) and re-run `npm run typecheck` + `npm run build`.
5. §E/§F: gitignore + `git rm` screenshots and `claude-plugins-official/`.
6. §G export cleanup as a later low-risk tidy.

Re-run `npm run typecheck && npm run build && npm run audit:size` after each destructive batch; all currently PASS (size audit green, `initial-js` 140.9 KB gz / 250 budget).
