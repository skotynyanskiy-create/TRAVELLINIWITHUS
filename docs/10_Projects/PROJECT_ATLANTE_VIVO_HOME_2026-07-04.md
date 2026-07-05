---
type: project
area: site-evolution
status: in-progress
priority: p1
owner: team
repo: TRAVELLINIWITHUS
created: 2026-07-04
related: '[[10_Projects/PROJECT_DEFINITIVE_STRUCTURE_2026-07-04]]'
source: spec multi-agente Atlante Vivo home (fetta 1)
tags:
  - project
  - site-evolution
  - atlante
---

# PROJECT — Atlante Vivo · Nuova Home (Fetta 1)

- **Data**: 2026-07-04
- **Branch**: audit/full-site-2026-06-07
- **Stato**: SPEC APPROVATO — pronto per implementazione (build-task-list in §8)
- **Owner decisions (bloccate)**:
  1. Sito nuovo **da zero** (nuovo linguaggio front-end).
  2. Anima **fusione magazine caldo + momenti WebGL** (riferimento creativo: tema Tripp; se ne prende l'energia, non il codice).
  3. Fondamenta **stesso repo React 19 / Vite / R3F**: riuso server.ts hardened, Stripe, Firebase, CMS, WebGL Atlante. Sito live intatto, cutover incrementale dietro flag.
- **Mockup visivo (concept, contenuti reali)**: https://claude.ai/code/artifact/f00a7675-dbed-493f-8eb9-986951e81ab1

## Come è nato questo spec

Generato con un passaggio di design multi-agente (workflow `atlante-vivo-home-design`, 11 agenti):
recon del codice/contenuti → 3 direzioni rivali (warm-magazine / webgl-cinematic / editorial-restraint) → panel di 3 giudici (brand · reader-task · fattibilità) → sintesi.

**Verdetto panel**: punteggi aggregati editorial-restraint 127 > warm-magazine 120 > webgl-cinematic 105; ma la lente brand/art-direction (l'asse che la visione bloccata privilegia) incorona **warm-magazine**. Sintesi = **warm-magazine come spina dorsale estetica**, irrobustita col rigore reader-task + mobile-safety di editorial-restraint, accesa dall'unico battito cinematico WebGL (`#0b0805` → luce sabbia) di webgl-cinematic.

## Vincoli di realtà (governano tutto)

- **Contenuto quasi tutto placeholder**: gli unici contenuti reali sono i **5 reel** (`src/config/reels.ts`, `isPlaceholder:false`) + la tassonomia. I 40 item di `content-seed.json` sono tutti placeholder → **non vanno mostrati** in home. Il design deve far sembrare ricchi ~5 pezzi, senza fingere volumi.
- **Zero dati inventati**: niente follower count in home (170K/90K sono "da confermare" → off-page), niente testimonial/loghi/conteggi. Trust = solo credenziali reali (AGCOM, Meta verificato, disclosure).
- **Dipendenza Instagram Graph API**: permalink/view/cover fresche arrivano con l'import; il design NON deve dipendere da quei campi.

---

# TRAVELLINIWITHUS — FINAL Homepage Design Spec (implementation-ready)

Synthesis verdict: aggregate scores are editorial-restraint 127 > warm-magazine 120 > webgl-cinematic 105, but the brand/art-direction lens (the axis the locked vision cares about) crowns **warm-magazine**, and both other judges converge on the same three grafts. So the winner is **warm-magazine as the aesthetic spine**, hardened with editorial-restraint's reader-task rigor and mobile safety, and lit by webgl-cinematic's single `#0b0805`→daylight cinematic beat. Every judge's `mustGraft` is folded in below.

---

## 1. Creative north-star

A warm travel magazine printed on calm sand/ink paper, whose _cover_ is one contained WebGL moment and whose _color_ lives exclusively in the content the eye browses. The reader lands in a warm near-black cover (`#0b0805`), the trace draws itself, then the page resolves into sand "daylight" — the single deliberate cinematic beat, no second dark band. Below the fold, five real reels and a real taxonomy do all the work: category-colored tags and hover tints turn ~5 pieces into a browsable issue with sections, a cover story, and two browse axes (by tipo, by zona) — never by faking article counts. Restraint is the discipline; Tripp's playful energy is expressed only through the category-color system and the kinetic reel strip. Reader first (scoprire → fidarsi → capire come andarci), commerce second (partner outlet in the closing band). One strong Fraunces `h1` is always the LCP; the canvas never is.

---

## 2. Section-by-section blueprint

### §1 — Hero "La copertina" (contained WebGL, the single dark beat)

- **Purpose:** in 3 seconds signal craft + warmth + the reader task; establish the magazine cover.
- **Desktop:** `<section className="relative w-full h-[72svh] min-h-[560px] overflow-hidden" style={{background:'#0b0805'}}>`. `TraceSignature` fills it `absolute inset-0`; sibling overlay `z-10 pointer-events-none` bottom-left, copy in a `max-w-2xl` column. Below the subhead, a compact **taxonomy entry** (grafted from editorial-restraint, kept editorial not SaaS): a single row — zona chips `Italia · Europa · Mondo` + a small `Tutti i tipi` select — that routes to `/esplora?zone=…&type=…`. This is `pointer-events-auto`, one line, not a full search UI (preserves cover restraint per brand judge).
- **Mobile:** `h-[62svh] min-h-[480px]`; copy stacked bottom; primary CTA full-width pill; taxonomy entry collapses to two chips + "Esplora tutto" link (no page overflow at 375px). `lowPower` on.
- **Real content / copy:**
  - Eyebrow (`.text-eyebrow`, `tracking-eyebrow`, terracotta `--color-accent`): **Rodrigo & Betta · Travelliniwithus**
  - **H1 (Fraunces `.text-display-1`, sand on `#0b0805`, the LCP): "Posti particolari che valgono davvero."**
  - Subhead (Inter, `--text-body-lg`, sand/80): **"Andiamo, proviamo, e solo dopo consigliamo — con atmosfera, costi reali e il consiglio onesto se un posto merita il viaggio."**
  - Primary CTA (`Button variant="cta"`, `magnetic`, `trackingId="hero_esplora"`): **"Scopri le destinazioni"** → `/esplora`
  - Ghost CTA (`variant="outline-light"`): **"Guarda gli ultimi reel"** → `#reel`
- **Color/type/motion:** only dark surface on the page; trace draws in once (`animate={!reduced}`), terracotta on primary CTA + live pin glow. `MagneticWrapper` on primary CTA.
- **Reuse:** [TraceSignature.tsx](../../src/experience/atlante/signature/TraceSignature.tsx) via `lazy`+`Suspense` mirroring [AtlanteLab.tsx](../../src/pages/AtlanteLab.tsx); [Button.tsx](../../src/components/Button.tsx); [MagneticWrapper.tsx](../../src/components/MagneticWrapper.tsx); [OptimizedImage.tsx](../../src/components/OptimizedImage.tsx) (poster). See §4 for fallback.

### §2 — Category rail "Sfoglia per tipo" (the color reveal)

- **Purpose:** instantly say "magazine with sections"; first appearance of category color.
- **Desktop:** horizontal row of 5 pill-cards. **Mobile:** 2-col grid (no horizontal scroll).
- **Real content:** the 5 vision categories mapped to real taxonomy types → routes:
  - Food (`--color-cat-food` #fe6d73) → `/esplora?type=Food%20%26%20Ristoranti`
  - Insolito (`--color-cat-insolito` #c0afff) → `/esplora?type=Insolito`
  - Relax (`--color-cat-relax` #4cb2be) → `/esplora?type=Relax,%20terme%20e%20spa`
  - Borghi (`--color-cat-borghi` #fdaf40) → `/esplora?type=Borghi%20e%20citt%C3%A0%20d'arte`
  - Panoramiche (`--color-cat-panoramiche` #11884f) → `/esplora?type=Passeggiate%20panoramiche`
- **Color/type/motion:** cards stay sand; color = thin top-border + `hover:bg-[color]/8` tint + lucide icon in category color. Label `.text-eyebrow`; **no counts**. Stagger fade via `Section` built-in `whileInView`.
- **Reuse:** [Section.tsx](../../src/components/Section.tsx) (`title="Sfoglia per tipo"`); `lucide-react`; new lightweight `CategoryPill` (see §8). No heavy new component.

### §3 — "Il pezzo forte" (cover-story reel, grafted from warm-magazine, endorsed by 2 judges)

- **Purpose:** give one reel lead-story weight so a thin catalogue reads as an edited issue.
- **Desktop:** asymmetric 60/40 — large 4:5 cover left, editorial text block right on sand. **Mobile:** cover top, text below.
- **Real content:** `reel-toscana-tavernal` — hook **"Cenare nella tana dei draghi."**, Toscana · Insolito, cover `/images/reels/reel-3-cover.webp`, video `/video/reel-3.mp4`.
- **Color/type/motion:** Insolito melrose `--color-cat-insolito` as tag chip + hairline rule under eyebrow. Fraunces `--text-h2` title, `.drop-cap` on the pull-copy. `TiltCard maxTilt={5}` on the cover; click opens the §4 lightbox.
- **Reuse:** [TiltCard.tsx](../../src/components/TiltCard.tsx); [OptimizedImage.tsx](../../src/components/OptimizedImage.tsx); scrim `.twu-card-scrim`.

### §4 — Reel film-strip "Le storie" `id="reel"` (grafted from webgl-cinematic, made mobile-safe by editorial-restraint)

- **Purpose:** kinetic on-field proof; the density that makes the remaining 4 reels read as a full spread.
- **Desktop:** embla horizontal scroll-snap row of tall 9:16 cards. **Mobile:** same embla, 1.2 cards visible to signal "more" (no page overflow).
- **Perf decision (locked, per feasibility + conversion judges):** **poster-first, click-to-play** — cards render `OptimizedImage` cover + play icon; tapping/clicking opens the existing video lightbox. **No multi-video hover autoplay** (kills the mobile/CWV/data risk the judges flagged).
- **Real content:** the 4 remaining reels from [reels.ts](../../src/config/reels.ts) `getPublishedReels()` (Tavernal already spotlighted in §3, still allowed in the strip):
  - Egitto/Mar Rosso — "Mar Rosso senza spendere una fortuna." — Relax `#4cb2be`
  - Sushi Kibo — "Il sushi più bello della Toscana?" — Food `#fe6d73`
  - Batu Caves — "Batu Caves: vale la pena?" — Posti particolari → **neutral ink** (no category color; honest — it maps to no vision category)
  - Volterra Volturi — "Aperitivo coi vampiri a Volterra." — Insolito `#c0afff`
- **Color/type/motion:** category-color chip is the **only saturated element** on each sand card; `.card-editorial` (hover lift -2px) + `.twu-card-scrim` over cover. Fraunces hook (verbatim), Inter location meta. CTA under strip: **"Apri il profilo"** → `INSTAGRAM_URL` from [site.ts](../../src/config/site.ts).
- **Reuse:** adapt [InstagramGrid.tsx](../../src/components/InstagramGrid.tsx) (already `getPublishedReels()` + click video lightbox) into an embla layout; `embla-carousel-react` (installed, currently zero imports — first use here); `type→color` map (§6).

### §5 — "Il metodo" (trust, LIGHT band — no second dark surface)

- **Purpose:** credibility without fabricated stats.
- **Decision (per brand judge graft):** this band is **sand / `--color-surface-2`, NOT dark** — the hero is the only dark beat. Do **not** use `HomeEditorialPromise` (it's `ink-deep`) or `HomeTrustStrip` (static unverified numbers).
- **Desktop:** 2-col — left method copy, right 3 credential chips. **Mobile:** stacked.
- **Real content** (from [siteContent.ts](../../src/config/siteContent.ts) + [site.ts](../../src/config/site.ts) `BRAND_CREDENTIALS`):
  - Eyebrow "Il metodo"; title **"Andiamo, proviamo, / solo dopo consigliamo"**; quote _"Non ci interessa mostrare tutto. Ci interessa consigliare bene."_
  - 3 real chips: **"Iscritti elenco AGCOM" · "Profilo Instagram verificato" · "Disclosure sempre dichiarata"**
  - CTA "Come lavoriamo davvero" → `/chi-siamo`
  - **NO follower numbers** (170K/90K are `da confermare` → `[VERIFY: Insights R&B]`, kept off the page).
- **Reuse:** [Section.tsx](../../src/components/Section.tsx) + new `MetodoBand` (light); `.drop-cap`; terracotta minimal.

### §6 — "Esplora per zona" (grafted from warm-magazine, 2 judges — second browse axis)

- **Purpose:** imply breadth via geography, complementing the type axis.
- **Desktop:** 3 tall image-cards Italia / Europa / Mondo. **Mobile:** horizontal snap or stack.
- **Real content:** zones from taxonomy; Italia leads (imagery from Toscana reels), Europa, Mondo (Egitto/Batu Caves). Links `/esplora?zone=…`. **Drop the "27 entries" count claim** — cover imagery carries it (per all 3 judges).
- **Color/type/motion:** terracotta accent only; Fraunces labels overlaid on `.twu-cover-scrim`.
- **Reuse:** [OptimizedImage.tsx]; `.twu-cover-scrim`; `Section`. Reference the grid logic in [HomeFeaturedDestinations.tsx](../../src/components/home/HomeFeaturedDestinations.tsx). Do **not** mount live Mapbox (perf).

### §7 — Newsletter `id="newsletter"`

- **Purpose:** the single reader conversion.
- **Desktop:** 2-col sand feature. **Mobile:** stacked.
- **Real content:** copy _"Un posto vero, ogni volta che ne troviamo uno che vale."_ Counter hidden (real value 0, hidden <50).
- **Reuse:** [Newsletter.tsx](../../src/components/Newsletter.tsx) `variant="editorial"`; pill input; terracotta CTA. (Footer's `#newsletter` scroll target lands here.)

### §8 — Final CTA + Footer (dual reader/partner outlet, grafted from conversion judge)

- **Purpose:** discovery + partner outlet in the funnel.
- **Real content:** [FinalCtaSection.tsx](../../src/components/FinalCtaSection.tsx) `intent="discovery"`; secondary link → `/collaborazioni` (adds the partner path the conversion judge flagged missing). Global [Footer.tsx](../../src/components/Footer.tsx).

---

## 3. Design-language deltas — `src/index.css`

Add to the `@theme` block (after the accent block, ~line 40) so Tailwind auto-generates `bg-cat-food`, `text-cat-insolito`, `border-cat-relax`, etc.:

```css
/* Category colors — live ONLY in content: tags, borders, hover tints */
--color-cat-food: #fe6d73; /* Food & Ristoranti  */
--color-cat-insolito: #c0afff; /* Insolito           */
--color-cat-relax: #4cb2be; /* Relax, terme e spa */
--color-cat-borghi: #fdaf40; /* Borghi e città d'arte */
--color-cat-panoramiche: #11884f; /* Passeggiate panoramiche */
```

- **Type scale:** no additions needed. Reuse `--text-display-1` (H1), `--text-h2` (pezzo forte / section titles), `--text-body-lg`, `.text-eyebrow`, `.drop-cap`. All exist.
- **Motion / Lenis:** reuse existing `--ease-out cubic-bezier(0.16,1,0.3,1)`, `--duration`, and `Section`'s built-in `whileInView`. Optionally wrap the page in [SmoothScrollProvider.tsx](../../src/components/SmoothScrollProvider.tsx) (Lenis) — but since this mounts inside `Layout`, verify no double-Lenis conflict first; **default: do not add Lenis** (Layout owns global scroll). No new keyframes.
- **Branded loader:** the Suspense fallback for the WebGL hero is a `#0b0805` box with a centered terracotta `.twu-pulse-ring` (existing utility) — a themed loader that matches Tripp's "themed loader" energy without new CSS. Reuse `.twu-pulse-ring` / `twu-pulse`.
- **Category-color utility helper** (optional, in `@layer utilities`): a `.cat-chip` base (radius `--radius-sm`, `.text-eyebrow`) that takes the color via inline `style={{ color: var, borderColor: var }}` from the `type→color` map — avoids 5 hardcoded variants and keeps it data-driven.

---

## 4. WebGL hero behavior + static fallback + reduced-motion

Follow the [AtlanteLab.tsx](../../src/pages/AtlanteLab.tsx) reuse pattern exactly, **branch BEFORE the lazy import** (the [SentieroExperience](../../src/experience/sentiero/SentieroExperience.tsx) convention):

```tsx
const TraceSignature = lazy(() => import('../experience/atlante/signature/TraceSignature'));
const reduced = useReducedMotion(); // src/hooks/useReducedMotion.ts
const [isSmall, setIsSmall] = useState(false); // innerWidth < 1024, set in effect

// Static path — NO three.js shipped (a11y + CWV):
if (reduced || isSmall) return <HeroStatic />; // poster + overlaid H1, bg #0b0805

// Full path:
<section
  className="relative w-full h-[72svh] min-h-[560px] overflow-hidden"
  style={{ background: '#0b0805' }}
>
  <OptimizedImage
    src="/images/reels/reel-3-cover.webp"
    priority
    className="absolute inset-0 z-0 object-cover w-full h-full"
    alt=""
  />
  <Suspense
    fallback={
      <div className="absolute inset-0 bg-[#0b0805] grid place-items-center">
        <span className="twu-pulse-ring" />
      </div>
    }
  >
    <TraceSignature animate={!reduced} lowPower={isSmall} />
  </Suspense>
  <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12">
    …H1 + CTA…
  </div>
</section>;
```

- `animate={!reduced}` is the only reduced-motion signal `TraceSignature` honors (it does **not** read `matchMedia` internally — caller must pass it).
- `lowPower={isSmall}` cuts particles 16000→6000 and drops the Noise pass.
- **Poster `z-0` behind the canvas** gives `GLBoundary` resilience: on WebGL-init failure the boundary replaces the canvas and the poster shows through instead of bare gray text. On success the opaque canvas (`alpha:false`, bg `#0b0805`) covers it.
- **`HeroStatic`** = `reel-3-cover.webp` via `OptimizedImage priority` + `.twu-hero-scrim` + the same overlaid H1/eyebrow/CTA on `#0b0805`, zero three.js. The **text H1 is the LCP**, never the canvas — model on [SentieroFallback.tsx](../../src/experience/sentiero/SentieroFallback.tsx).
- **Do NOT** reuse `SentieroCanvas`/`AtlanteCanvas` (both need `ScrollControls` = full-viewport scroll hijack, incompatible with a page that scrolls past the hero). `TraceSignature` is the only correct reuse target.
- **Do NOT** inject the chrome-hiding `<style>` block from [Home.tsx](../../src/pages/Home.tsx) / AtlanteLab (`html,body{overflow:hidden;100dvh}` + `nav/footer{display:none}`). Containment comes solely from the `position:relative h-[72svh]` wrapper; the navbar/footer stay visible and the page scrolls normally.

---

## 5. Non-destructive mounting plan

- **Route:** `/atlante` — mounted as a **nested child of `<Route path="/" element={<Layout />}>`** in [App.tsx](../../src/App.tsx) (after the index route, ~line 108) so Navbar + Footer render (unlike `/v2` and `/atlante-lab`, which are standalone/chrome-hidden — do not copy them).
- **Flag:** mirror the `LITE_MODE` idiom exactly. New file `src/config/atlantePreview.ts`:
  ```ts
  export const ATLANTE_PREVIEW = import.meta.env.VITE_ATLANTE_PREVIEW === 'true';
  ```
  Gate the route: `{ATLANTE_PREVIEW && <Route path="atlante" element={<AtlanteHome />} />}`. Set `VITE_ATLANTE_PREVIEW=true` in `.env.local`; omit in prod → route absent from the production bundle.
- **`/` untouched:** `<Route index element={<Home />} />` (Sentiero) stays byte-for-byte identical. Zero change to the live home until deliberate cutover.
- **Preview hygiene:** `AtlanteHome` carries `<SEO noindex>` while in preview; not added to Navbar links; opts INTO `PageLayout` (or `Section`s within Layout's `<main>`).
- **Cutover (later, one line):** point the index route at `AtlanteHome` (or swap the `Home` lazy target), then delete the `/atlante` preview route + flag + drop `noindex`.

---

## 6. Content wiring (real only)

- **Reels:** `getPublishedReels()` from [reels.ts](../../src/config/reels.ts) — the 5 `isPlaceholder:false` entries are the ONLY real content. Covers exist at `/images/reels/reel-{1..5}-cover.webp`; videos at `/video/reel-{1..5}.mp4`.
- **`type→category-color` map** (single source, used by §2/§3/§4):
  ```ts
  const CAT_COLOR: Record<string, string> = {
    'Food & Ristoranti': 'var(--color-cat-food)',
    Insolito: 'var(--color-cat-insolito)',
    'Relax, terme e spa': 'var(--color-cat-relax)',
    "Borghi e città d'arte": 'var(--color-cat-borghi)',
    'Passeggiate panoramiche': 'var(--color-cat-panoramiche)',
    // 'Posti particolari' → undefined → neutral ink (honest, no category)
  };
  ```
- **Placeholders hidden:** all 40 entries in [content-seed.json](../../src/data/content-seed.json) are `isPlaceholder:true` with empty `cover` — **do not surface any of them** on this homepage. Category rail and zone band link to `/esplora?…` (browse routes), not to individual placeholder posts.
- **No fabricated data:** no follower counts, no testimonials, no partner logos, no article counts, no signup counter. Credentials (AGCOM/Meta/Disclosure) are the only trust claims, and they're real ([site.ts](../../src/config/site.ts) `BRAND_CREDENTIALS`).
- **Instagram-import dependency:** all 5 reels have `instagramUrl` UNSET, so the lightbox plays the local MP4 and any "open on IG" link falls back to the profile URL (`https://www.instagram.com/travelliniwithus/`). This is acceptable for launch. **Blocked-until-import upgrades** (Instagram Graph API): real per-reel permalinks, view counts, and fresh covers. Spec no UI that assumes those fields (no view-count chips, no per-reel deep-links) until the import lands — the design must read as rich with today's data.

---

## 7. A11y + responsive + perf checklist

- **One `h1`** (hero), Fraunces, Italian, and the **LCP** on both WebGL and static paths (canvas/poster is `z-0`, never LCP).
- **Reduced-motion:** full three.js path skipped entirely (`reduced || isSmall` branch → `HeroStatic`, no GPU). All section motion is `Section`'s `whileInView` fade, already reduced-motion guarded.
- **Mobile 375px:** zero horizontal page overflow — category rail is 2-col grid (not scroll); reel strip uses embla with `overflow` contained to its own track; zone band snaps or stacks. Verify at 320/375/768/1024/1440 (`/responsive-check`).
- **Contrast (WCAG AA):** category colors are decoration only (borders/hover/chips), never load-bearing text on sand — chip **text** uses `--color-ink`, color is the border/icon. Sand-on-`#0b0805` hero text passes AA. Use `--color-accent-text #9a3412` for any terracotta text on white.
- **Keyboard/lightbox:** reel cards are real buttons/links; lightbox trap + Esc close (inherit InstagramGrid behavior). Category/zone cards keyboard-focusable with visible focus.
- **Perf:** three.js only on desktop non-reduced path via `lazy`+`Suspense` (out of initial bundle); `lowPower` on <1024; **poster-first click-to-play** reels (no autoplay video weight, no hover-video data cost); `OptimizedImage priority` on hero poster only, lazy elsewhere; no live Mapbox. Run `npm run audit:cwv` — a11y≥0.95 & CLS≤0.1 are the blocking CI gates.
- **Fixed dimensions** on all image/card wrappers (`aspect-[4/5]`, `aspect-[9/16]`, hero `h-[72svh]`) to keep CLS≤0.1.

---

## 8. BUILD TASK LIST (dependency order)

**Tokens & config (no deps):**

1. `src/index.css` — add the 5 `--color-cat-*` tokens to `@theme`; optional `.cat-chip` utility in `@layer utilities`.
2. `src/config/atlantePreview.ts` — `export const ATLANTE_PREVIEW = import.meta.env.VITE_ATLANTE_PREVIEW === 'true';`
3. `.env.local` — add `VITE_ATLANTE_PREVIEW=true` (dev only).
4. `src/config/categoryColors.ts` — export the `CAT_COLOR` `type→var()` map (single source for §2/§3/§4).

**Leaf components (create):** 5. `src/components/home/atlante/CategoryPill.tsx` — props `{ label, type, to, icon }`; sand card, colored top-border + hover tint from `CAT_COLOR`. (§2) 6. `src/components/home/atlante/ReelStrip.tsx` — embla strip of `getPublishedReels()`, poster-first `OptimizedImage` + play icon → opens shared video lightbox; category-color chip. Adapt lightbox logic from [InstagramGrid.tsx](../../src/components/InstagramGrid.tsx). (§4) 7. `src/components/home/atlante/PezzoForte.tsx` — 60/40 cover-story for `reel-toscana-tavernal`; `TiltCard` + `.drop-cap`; opens the same lightbox. (§3) 8. `src/components/home/atlante/MetodoBand.tsx` — LIGHT (surface-2) 2-col method + 3 real credential chips. (§5) 9. `src/components/home/atlante/ZoneBand.tsx` — 3 image-cards Italia/Europa/Mondo → `/esplora?zone=…`, no counts. (§6) 10. `src/components/home/atlante/HeroCopertina.tsx` — the contained WebGL hero + `HeroStatic` fallback + reduced-motion branch + taxonomy entry row (§1, §4 behavior). Reuses `TraceSignature`, `Button`, `MagneticWrapper`, `OptimizedImage`, `.twu-pulse-ring`.

**Page (create):** 11. `src/pages/AtlanteHome.tsx` — composes §1–§8 inside `PageLayout`; `<SEO noindex title description jsonLd>`; imports the reused `Newsletter` (`variant="editorial"`, `id="newsletter"`) and `FinalCtaSection` (`intent="discovery"` + `/collaborazioni` secondary). Must **not** inject any chrome-hiding `<style>`.

**Wiring (touch):** 12. `src/App.tsx` — add `const AtlanteHome = lazy(() => import('./pages/AtlanteHome'));` (~line 31) and the gated child route `{ATLANTE_PREVIEW && <Route path="atlante" element={<AtlanteHome />} />}` inside the `path="/"` Layout block (~after line 108). **Do not touch the index `Home` route.**

**Verify (per CLAUDE.md gate):** 13. `npm run typecheck` → `npm run audit:ui` → real-browser check at `/atlante` (navbar visible, no overflow at 375px, LCP = H1, no console errors) via chrome-devtools/Playwright → `npm run audit:cwv` (a11y≥0.95, CLS≤0.1).

**Files reused unchanged (no edits):** [TraceSignature.tsx], [Button.tsx], [MagneticWrapper.tsx], [TiltCard.tsx], [OptimizedImage.tsx], [Section.tsx], [Newsletter.tsx], [FinalCtaSection.tsx], [SEO.tsx], [PageLayout.tsx], [useReducedMotion.ts], [reels.ts], [site.ts], [siteContent.ts]. **High-risk files (`server.ts`, `firestore.rules`, `admin.ts`) are NOT touched** by any task above.
