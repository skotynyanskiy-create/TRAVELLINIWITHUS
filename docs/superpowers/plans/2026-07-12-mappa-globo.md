# /mappa → globo MapLibre Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve `/mappa` (TRAVELLINIWITHUS) from a flat Mercator map to a MapLibre globe projection, with native clustering to fix overlapping markers, minimal a11y/reduced-motion compliance, and a primary-nav entry — without changing the existing dark/terracotta visual identity.

**Architecture:** Additive changes to one existing component (`src/components/map/MapboxWorldMap.tsx`) plus one nav entry (`src/components/Navbar.tsx`). No new files, no new dependencies, no new visual language. Clustering uses MapLibre's native GeoJSON `cluster: true` source (zero new deps), gated by zoom so the existing React `Marker`/`Popup` interaction (accessibility, hover, click-to-focus) is preserved above the cluster threshold and only the low-zoom "many overlapping pins" case gets a new rendering path.

**Tech Stack:** React 19, TypeScript, `react-map-gl/maplibre` v8.1.0 (`@vis.gl/react-maplibre`), `maplibre-gl` v5.24.0, Tailwind 4, `motion/react`.

## Global Constraints

- Never touch `server.ts`, `firestore.rules`, `src/config/admin.ts`.
- No new npm dependencies (spec §2: native MapLibre clustering, not Supercluster).
- No new colors — reuse existing brand hex values: accent/terracotta `#c2410c`, ink `#0a0a0a`, white `#ffffff`.
- No new visual direction — the existing dark map, filter chips, editorial route cards, and popup card stay exactly as they are today.
- Every step that changes `.tsx`/`.ts` files must be followed by `npm run typecheck` passing clean before moving to the next step.
- `MapboxWorldMap.tsx` has no existing unit test file and is primarily a MapLibre integration component (WebGL canvas rendering) — per the approved spec, verification for map-visual changes is `npm run typecheck` + live check in the running dev server (already up on `http://localhost:3000`) via the Preview MCP tools, not fabricated Vitest unit tests that can't observe canvas output. `Navbar.tsx` has a real test file (`Navbar.test.tsx`) and gets a real TDD step.
- Italian UI copy only, no English strings introduced.

---

### Task 1: Commit the already-applied Vite dependency-optimization fix

This fix was applied and verified working during the design investigation (uncommitted in the working tree). Landing it as its own commit keeps history readable and gives the rest of this plan a stable, non-crashing `/mappa` to build on.

**Files:**

- Modify (already edited, needs commit): `vite.config.ts`

**Interfaces:**

- Produces: a working `/mappa` route with zero "Invalid hook call" / "Cannot read properties of null (reading 'useContext')" console errors — all later tasks assume this is true.

- [ ] **Step 1: Confirm the fix is present**

Read `vite.config.ts` and confirm `optimizeDeps.include` contains `'react-map-gl/maplibre'` alongside the three.js/R3F entries. If it is missing (e.g. a fresh checkout), add it:

```ts
optimizeDeps: {
  include: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'react-map-gl/maplibre',
  ],
},
```

- [ ] **Step 2: Verify no console errors on /mappa**

With the dev server running (`Travellini Vite dev (questo repo)` on port 3000), navigate the Preview browser to `http://localhost:3000/mappa`, reload, and check console errors:

```
mcp__Claude_Preview__preview_eval: window.location.href = 'http://localhost:3000/mappa'
mcp__Claude_Preview__preview_console_logs: level "error"
```

Expected: no "Invalid hook call" or `_Map` useContext errors. (A `Service firestore is not available` message may appear in sandboxed dev environments without real Firebase credentials — this is a pre-existing, unrelated environment gap, not a regression; ignore it.)

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "fix(vite): pre-bundle react-map-gl/maplibre to prevent Invalid hook call

Same class of bug already fixed for three.js/R3F: react-map-gl/maplibre
was discovered late by Vite's dep scanner (lazy mapbox chunk), forcing
a re-optimize + reload while the Map component was already mounted."
```

---

### Task 2: Globe projection + dark sky

**Files:**

- Modify: `src/components/map/MapboxWorldMap.tsx:670-679` (the `<Map>` element)

**Interfaces:**

- Consumes: nothing new.
- Produces: the `<Map>` element now renders in globe projection — later tasks (clustering, camera) build on top of this same element without further projection changes.

- [ ] **Step 1: Add the projection and sky props**

In `src/components/map/MapboxWorldMap.tsx`, find:

```tsx
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 12.5,
            latitude: 42.0,
            zoom: 3.5,
            pitch: 45,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/dark"
        >
```

Replace with:

```tsx
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 12.5,
            latitude: 42.0,
            zoom: 3.5,
            pitch: 45,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/dark"
          projection="globe"
          sky={{
            'atmosphere-blend': 0.8,
            'sky-color': '#0a0a0a',
            'fog-color': '#1a1a1a',
            'horizon-fog-blend': 1.0,
          }}
        >
```

`projection="globe"` renders a sphere that auto-flattens to standard Mercator once the view zooms in close (verified in `node_modules/maplibre-gl/dist/maplibre-gl.d.ts:10136-10151`) — the existing `focusArticle` `flyTo` to zoom 5.2 will land on a normal, readable flat view, not a distorted sphere. The `sky` object replaces MapLibre's default blue-tinted atmosphere with the brand's dark tones so the globe doesn't look like a generic weather-app sphere.

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If TypeScript rejects `projection="globe"` as a string literal, use the object form instead: `projection={{ type: 'globe' }}` (both are valid per the type union at `node_modules/@vis.gl/react-maplibre/dist/components/map.d.ts:39`).

- [ ] **Step 3: Verify visually**

```
mcp__Claude_Preview__preview_eval: window.location.href = 'http://localhost:3000/mappa'
mcp__Claude_Preview__preview_screenshot
```

Expected: the map renders as a visible curved sphere (not a flat rectangle) at the initial zoom 3.5, with a dark horizon glow instead of the default blue MapLibre atmosphere. Filter chips, editorial cards, and existing markers still render on top exactly as before.

- [ ] **Step 4: Commit**

```bash
git add src/components/map/MapboxWorldMap.tsx
git commit -m "feat(mappa): switch to MapLibre globe projection

projection=\"globe\" auto-flattens to Mercator on zoom-in (verified in
maplibre-gl typings), so the existing flyTo-to-destination behavior is
unaffected. Sky recolored dark to match brand instead of MapLibre's
default blue atmosphere."
```

---

### Task 3: Reduced-motion compliance (camera flight + marker hover)

**Files:**

- Modify: `src/components/map/MapboxWorldMap.tsx:340-350` (`focusArticle`)
- Modify: `src/components/map/MapboxWorldMap.tsx:450-453` (marker hover scale)

**Interfaces:**

- Consumes: `prefersReducedMotion` (already imported at line 254 via `useReducedMotion()` — no new import needed).
- Produces: `focusArticle(article)` — same signature as before, now motion-safe.

- [ ] **Step 1: Gate focusArticle's flyTo on reduced motion**

Find:

```tsx
const focusArticle = (article: ArticleWithCoords) => {
  setSelectedArticle(article);
  mapRef.current?.flyTo({
    center: [article.lng, article.lat],
    zoom: 5.2,
    duration: 1200,
    essential: true,
  });
};
```

Replace with:

```tsx
const focusArticle = (article: ArticleWithCoords) => {
  setSelectedArticle(article);
  mapRef.current?.flyTo({
    center: [article.lng, article.lat],
    zoom: 5.2,
    duration: prefersReducedMotion ? 0 : 1200,
    curve: prefersReducedMotion ? 1 : 1.42,
    essential: true,
  });
};
```

`duration: 0` makes MapLibre jump instantly (WCAG 2.1 2.3.3 — no motion when the user has requested none). `curve: 1.42` (MapLibre's `flyTo` accepts a `curve` easing factor, default `1.42`) is kept explicit here so the value is documented and easy to tune later for a more cinematic feel; `curve: 1` degrades to a flatter, faster path when motion is reduced but not fully instant duration edge cases are hit.

- [ ] **Step 2: Gate marker hover/active scale on reduced motion**

Find (inside the `pins` memo, riga ~450):

```tsx
            <div
              className={`relative cursor-pointer transition-transform ${
                isActive ? 'scale-125' : 'hover:scale-110'
              }`}
              aria-label={`${visual.label}: ${article.title}`}
            >
```

Replace with:

```tsx
            <div
              className={`relative cursor-pointer ${
                prefersReducedMotion
                  ? ''
                  : `transition-transform ${isActive ? 'scale-125' : 'hover:scale-110'}`
              }`}
              aria-label={`${visual.label}: ${article.title}`}
            >
```

With reduced motion, the marker no longer scales on hover/active — it stays static, avoiding a WCAG 2.1 A violation on animation triggered by user interaction.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Verify with reduced motion emulated**

```
mcp__Claude_Preview__preview_resize: colorScheme unaffected, but emulate reduced motion via preview_eval:
mcp__Claude_Preview__preview_eval: window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

If the Preview tool does not support emulating `prefers-reduced-motion` directly, verify by reading the code path only (the `useReducedMotion` hook is already used identically elsewhere in the codebase, e.g. `QuickViewDrawer`/`ControluceFallback`, and is trusted) plus confirm normal (non-reduced) behavior still works:

```
mcp__Claude_Preview__preview_click: selector for a destination card in the bottom list
mcp__Claude_Preview__preview_screenshot
```

Expected: clicking a card still flies the camera to that destination and opens the popup (unchanged from before this task).

- [ ] **Step 5: Commit**

```bash
git add src/components/map/MapboxWorldMap.tsx
git commit -m "fix(mappa): gate camera flyTo and marker hover on prefers-reduced-motion

WCAG 2.1 A (2.3.3). The globe projection adds more camera movement,
so this needed fixing before extending motion further."
```

---

### Task 4: Marker accessibility — keyboard navigation + touch target size

**Files:**

- Modify: `src/components/map/MapboxWorldMap.tsx:439-482` (the `Marker` JSX inside the `pins` memo)

**Interfaces:**

- Consumes: `focusArticle` (Task 3, signature unchanged).
- Produces: each marker is a real interactive control (keyboard + pointer), same visual footprint otherwise. Task 6 (clustering) relies on this same marker block still existing unchanged above the cluster zoom threshold.

- [ ] **Step 1: Add keyboard support and enlarge the touch target**

Find the full `Marker` block:

```tsx
return (
  <Marker
    key={`marker-${article.id || index}`}
    longitude={article.lng}
    latitude={article.lat}
    anchor="bottom"
    onClick={(e) => {
      e.originalEvent.stopPropagation();
      focusArticle(article);
    }}
  >
    <div
      className={`relative cursor-pointer ${
        prefersReducedMotion
          ? ''
          : `transition-transform ${isActive ? 'scale-125' : 'hover:scale-110'}`
      }`}
      aria-label={`${visual.label}: ${article.title}`}
    >
      <span
        aria-hidden="true"
        className={`twu-pulse-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
          article.isPartner ? 'bg-[var(--color-success)]/40' : 'bg-[var(--color-accent)]/35'
        }`}
        style={{ left: '50%', top: '50%' }}
      />
      <span
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-xl md:h-11 md:w-11 ${
          article.isPartner
            ? 'border-white bg-[var(--color-success)] text-white'
            : 'border-white bg-[var(--color-accent)] text-white'
        }`}
      >
        <CatIcon size={16} />
      </span>
      {article.isPartner && (
        <span
          aria-label="Partner"
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[var(--color-success)] shadow-md"
        >
          <Star size={9} fill="currentColor" />
        </span>
      )}
    </div>
  </Marker>
);
```

Replace with:

```tsx
return (
  <Marker
    key={`marker-${article.id || index}`}
    longitude={article.lng}
    latitude={article.lat}
    anchor="bottom"
    onClick={(e) => {
      e.originalEvent.stopPropagation();
      focusArticle(article);
    }}
  >
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          focusArticle(article);
        }
      }}
      className={`relative flex h-11 w-11 cursor-pointer items-center justify-center ${
        prefersReducedMotion
          ? ''
          : `transition-transform ${isActive ? 'scale-125' : 'hover:scale-110'}`
      }`}
      aria-label={`${visual.label}: ${article.title}`}
    >
      <span
        aria-hidden="true"
        className={`twu-pulse-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
          article.isPartner ? 'bg-[var(--color-success)]/40' : 'bg-[var(--color-accent)]/35'
        }`}
        style={{ left: '50%', top: '50%' }}
      />
      <span
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-xl md:h-11 md:w-11 ${
          article.isPartner
            ? 'border-white bg-[var(--color-success)] text-white'
            : 'border-white bg-[var(--color-accent)] text-white'
        }`}
      >
        <CatIcon size={16} />
      </span>
      {article.isPartner && (
        <span
          aria-label="Partner"
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[var(--color-success)] shadow-md"
        >
          <Star size={9} fill="currentColor" />
        </span>
      )}
    </div>
  </Marker>
);
```

The outer `div` grows to a fixed `h-11 w-11` (44px) hit area at every breakpoint — a real, always-44px touch/click target — while the inner visible badge (`h-9 w-9 md:h-11 md:w-11`) keeps its exact current look on mobile (still a 36px visible circle, just now sitting inside a properly-sized invisible hit area) and is visually unchanged on desktop. `role="button"` + `tabIndex={0}` + `onKeyDown` make the marker keyboard-operable (Enter/Space), matching the pattern already used by the destination cards below the map (`motion.button`, riga 807).

**Known trade-off (deliberate, not fixed here):** `Marker` elements stay mounted in the DOM even when MapLibre transforms them off-screen, so with `filteredArticles` around 40-70 items a keyboard user may tab through several off-screen markers before reaching the next page element. Fixing that would require viewport-bounds culling, which is out of scope for the approved spec (zero keyboard access today is a worse, blocking problem than a long-but-functional tab sequence). Flagging as a natural follow-up rather than shipping it silently.

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Verify keyboard navigation**

```
mcp__Claude_Preview__preview_eval: window.location.href = 'http://localhost:3000/mappa'
mcp__Claude_Preview__preview_snapshot
```

Confirm the accessibility tree now shows marker elements with `role="button"` and a label (e.g. "Posto particolare: <title>"). Then:

```
mcp__Claude_Preview__preview_eval:
  (() => {
    const marker = document.querySelector('[role="button"][aria-label*="Volterra"], [role="button"]');
    marker?.focus();
    return document.activeElement === marker;
  })()
```

Expected: `true` — a marker can receive keyboard focus.

- [ ] **Step 4: Verify touch target size**

```
mcp__Claude_Preview__preview_resize: preset "mobile"
mcp__Claude_Preview__preview_inspect: selector '[role="button"]' (first marker), styles ['width', 'height']
```

Expected: `width`/`height` computed as `44px` (or the container is at least 44×44 even if the visible badge inside remains 36px).

- [ ] **Step 5: Commit**

```bash
git add src/components/map/MapboxWorldMap.tsx
git commit -m "fix(mappa): make markers keyboard-operable and enlarge touch target to 44px

WCAG 2.1 A (2.1.1) - markers had no role/tabIndex/onKeyDown, unlike the
already-correct destination cards below the map. Touch target grows to
the 44px hit-area standard while the visible badge is unchanged."
```

---

### Task 5: Popup fixes — mobile overflow + stacking under filter bars

**Files:**

- Modify: `src/components/map/MapboxWorldMap.tsx:700-701` (`Popup` `maxWidth`)
- Modify: `src/components/map/MapboxWorldMap.tsx:704-705` (popup card fixed width)
- Modify: `src/index.css` (new `.twu-map-popup` rule)

**Interfaces:**

- Consumes: nothing new.
- Produces: no interface change — purely CSS/prop-value fixes.

**Scope addition (owner-reported during live review, 2026-07-12):** on desktop, a popup opened on a marker in the upper half of the viewport renders UNDER the floating filter-chip bars and the intro/route cards — all those overlays have `z-10` (righe 502, 531, 592) while the MapLibre popup container (`.twu-map-popup`, riga ~720) has no z-index of its own inside the map container. The popup is a transient, user-summoned element and must win over the persistent overlays while open.

- [ ] **Step 1: Fix the Popup and card widths**

Find:

```tsx
              closeButton={false}
              closeOnClick={true}
              className="twu-map-popup"
              offset={[0, -40]}
              maxWidth="320px"
            >
              {(() => {
                const cardClass =
                  'group relative block w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-ink-deep)] shadow-2xl transition-all duration-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-white/20';
```

Replace with:

```tsx
              closeButton={false}
              closeOnClick={true}
              className="twu-map-popup"
              offset={[0, -40]}
              maxWidth="min(320px, calc(100vw - 32px))"
            >
              {(() => {
                const cardClass =
                  'group relative block w-[min(300px,calc(100vw-48px))] overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-ink-deep)] shadow-2xl transition-all duration-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-white/20';
```

`min(320px, calc(100vw - 32px))` caps the MapLibre popup container itself; `w-[min(300px,calc(100vw-48px))]` caps the inner card (with extra margin so it never touches the screen edges) — on a 375px viewport the card becomes `327px` capped correctly instead of overflowing at a fixed `300px` + popup chrome.

- [ ] **Step 1b: Raise the popup above the floating overlay bars**

In `src/index.css`, find the existing custom-utilities/component-styles area (search for other `.twu-` prefixed rules to colocate; if none exist, add at the end of the file's custom rules section) and add:

```css
/* Popup mappa: deve vincere sugli overlay persistenti (chips z-10, card z-10)
   mentre e' aperto — e' transiente e invocato dall'utente. */
.twu-map-popup {
  z-index: 20;
}
```

`z-index: 20` beats the `z-10` filter bars and intro/route cards but stays below the full-screen loading overlay (`z-20` appears only while the popup cannot exist) and the site navbar (`z-50`).

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors (both are string literals inside existing `className`/prop positions, no type changes).

- [ ] **Step 3: Verify on a narrow viewport**

```
mcp__Claude_Preview__preview_resize: width 320, height 700
mcp__Claude_Preview__preview_eval: window.location.href = 'http://localhost:3000/mappa'
```

Click a marker or a destination card to open the popup, then:

```
mcp__Claude_Preview__preview_eval:
  (() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)()
```

Expected: `true` — no horizontal overflow at 320px width with the popup open.

- [ ] **Step 3b: Verify popup stacking on desktop**

At desktop viewport, open a popup on a marker positioned in the upper half of the map (where the filter chip bars float), then screenshot: the popup card must render ON TOP of the chip bars, not clipped under them.

- [ ] **Step 4: Commit**

```bash
git add src/components/map/MapboxWorldMap.tsx src/index.css
git commit -m "fix(mappa): popup width capped to viewport + raised above overlay bars

Fixed 320px/300px widths could overflow horizontally below ~350px
viewports (iPhone SE class). Popup also rendered under the z-10
filter-chip bars when opened on upper-half markers (owner-reported):
.twu-map-popup now carries z-index 20."
```

---

### Task 6: Native clustering

**Files:**

- Modify: `src/components/map/MapboxWorldMap.tsx` — imports (riga 1-34), new state + memo (near riga 250-330), new `Source`/`Layer` JSX inside `<Map>` (riga 670+), new cluster click handler.

**Interfaces:**

- Consumes: `filteredArticles` (existing memo, riga 273-282, unchanged), `focusArticle` (Task 3).
- Produces: `viewZoom: number` (new state), `handleClusterClick(e: MapLayerMouseEvent): Promise<void>` (new handler) — no other task depends on these names, this is the last map-internals task before the nav task.

- [ ] **Step 1: Import `Source`, `Layer`, and the mouse event type**

Find:

```tsx
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  type MapRef,
} from 'react-map-gl/maplibre';
```

Replace with:

```tsx
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  type MapRef,
  type MapLayerMouseEvent,
  type GeoJSONSource,
} from 'react-map-gl/maplibre';
```

- [ ] **Step 2: Add zoom-tracking state and the GeoJSON conversion memo**

Find:

```tsx
const [activeContinent, setActiveContinent] = useState<ContinentFilter>('all');
const [activeExperience, setActiveExperience] = useState<ExperienceFilter>('all');
```

Replace with:

```tsx
const [activeContinent, setActiveContinent] = useState<ContinentFilter>('all');
const [activeExperience, setActiveExperience] = useState<ExperienceFilter>('all');
const [viewZoom, setViewZoom] = useState(3.5);

const CLUSTER_MAX_ZOOM = 6;
```

Then find the `filteredArticles` memo (riga 273-282) and add a new memo directly after it:

```tsx
const filteredArticles = useMemo(
  () =>
    articles.filter((a) => {
      const continent = (a as { continent?: string }).continent;
      const matchContinent = activeContinent === 'all' || continent === activeContinent;
      const matchExperience = activeExperience === 'all' || a.category === activeExperience;
      return matchContinent && matchExperience;
    }),
  [articles, activeContinent, activeExperience]
);

const clusterGeoJSON = useMemo(
  () => ({
    type: 'FeatureCollection' as const,
    features: filteredArticles.map((article, index) => ({
      type: 'Feature' as const,
      properties: { id: String(article.id || index) },
      geometry: {
        type: 'Point' as const,
        coordinates: [article.lng, article.lat],
      },
    })),
  }),
  [filteredArticles]
);
```

- [ ] **Step 3: Add the cluster click handler**

Directly after `focusArticle` (Task 3's version), add:

```tsx
const handleClusterClick = async (e: MapLayerMouseEvent) => {
  const feature = e.features?.[0];
  if (!feature || feature.properties?.cluster !== true) return;

  const clusterId = feature.properties.cluster_id as number;
  const source = mapRef.current?.getSource('destinations') as GeoJSONSource | undefined;
  if (!source) return;

  const zoom = await source.getClusterExpansionZoom(clusterId);
  const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates;
  mapRef.current?.easeTo({
    center: [lng, lat],
    zoom,
    duration: prefersReducedMotion ? 0 : 800,
    essential: true,
  });
};

const handleUnclusteredPointClick = (e: MapLayerMouseEvent) => {
  const feature = e.features?.[0];
  const id = feature?.properties?.id as string | undefined;
  if (!id) return;
  const article = filteredArticles.find((a, index) => String(a.id || index) === id);
  if (article) focusArticle(article);
};
```

- [ ] **Step 4: Render the Source/Layer and gate the existing Markers by zoom**

Find:

```tsx
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 12.5,
            latitude: 42.0,
            zoom: 3.5,
            pitch: 45,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/dark"
          projection="globe"
          sky={{
            'atmosphere-blend': 0.8,
            'sky-color': '#0a0a0a',
            'fog-color': '#1a1a1a',
            'horizon-fog-blend': 1.0,
          }}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />

          {pins}
```

Replace with:

```tsx
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 12.5,
            latitude: 42.0,
            zoom: 3.5,
            pitch: 45,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/dark"
          projection="globe"
          sky={{
            'atmosphere-blend': 0.8,
            'sky-color': '#0a0a0a',
            'fog-color': '#1a1a1a',
            'horizon-fog-blend': 1.0,
          }}
          onZoom={(e) => setViewZoom(e.viewState.zoom)}
          interactiveLayerIds={viewZoom < CLUSTER_MAX_ZOOM ? ['clusters', 'unclustered-point'] : []}
          onClick={(e) => {
            const feature = e.features?.[0];
            if (!feature) return;
            if (feature.layer?.id === 'clusters') {
              void handleClusterClick(e);
            } else if (feature.layer?.id === 'unclustered-point') {
              handleUnclusteredPointClick(e);
            }
          }}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />

          <Source
            id="destinations"
            type="geojson"
            data={clusterGeoJSON}
            cluster
            clusterMaxZoom={CLUSTER_MAX_ZOOM}
            clusterRadius={50}
          >
            <Layer
              id="clusters"
              type="circle"
              filter={['has', 'point_count']}
              layout={{ visibility: viewZoom < CLUSTER_MAX_ZOOM ? 'visible' : 'none' }}
              paint={{
                'circle-color': '#c2410c',
                'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
            <Layer
              id="cluster-count"
              type="symbol"
              filter={['has', 'point_count']}
              layout={{
                visibility: viewZoom < CLUSTER_MAX_ZOOM ? 'visible' : 'none',
                'text-field': '{point_count_abbreviated}',
                'text-size': 12,
                'text-font': ['Noto Sans Bold'],
              }}
              paint={{ 'text-color': '#ffffff' }}
            />
            <Layer
              id="unclustered-point"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              layout={{ visibility: viewZoom < CLUSTER_MAX_ZOOM ? 'visible' : 'none' }}
              paint={{
                'circle-color': '#c2410c',
                'circle-radius': 7,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </Source>

          {viewZoom >= CLUSTER_MAX_ZOOM && pins}
```

Below `CLUSTER_MAX_ZOOM` (world/continent view), the GeoJSON cluster and unclustered-point layers render instead of the React `Marker`s — fixing the overlapping-pin bug, since MapLibre's clustering algorithm aggregates nearby points into a single circle instead of stacking dozens of individual pins. At/above `CLUSTER_MAX_ZOOM` (the zoom level `focusArticle`'s `flyTo`/`easeTo` land on, 5.2/expansion zoom), the layers hide and the existing rich `Marker`/`Popup`/keyboard/hover interaction (Tasks 3-4) takes over exactly as before — nothing about that code path changes.

- [ ] **Step 5: Add an aria-label live region for cluster count (screen reader support)**

Since the cluster/point circles are canvas-rendered (not real DOM elements, so they cannot carry `aria-label` themselves), add a visually-hidden live region that announces the currently visible destination count — reusing the count already computed for the panel copy (riga 515-517):

Find:

```tsx
<p className="mt-4 text-xs font-light text-[var(--color-ink)]/50">
  {filteredArticles.length} {filteredArticles.length === 1 ? 'destinazione' : 'destinazioni'}
  {usingDemo ? ' (anteprime editoriali)' : ' esplorate'}
  {activeContinent !== 'all' && ` · ${activeContinent}`}
  {activeExperience !== 'all' &&
    ` · ${EXPERIENCE_FILTERS.find((f) => f.id === activeExperience)?.label ?? ''}`}
</p>
```

Replace with:

```tsx
<p className="mt-4 text-xs font-light text-[var(--color-ink)]/50" role="status" aria-live="polite">
  {filteredArticles.length} {filteredArticles.length === 1 ? 'destinazione' : 'destinazioni'}
  {usingDemo ? ' (anteprime editoriali)' : ' esplorate'}
  {activeContinent !== 'all' && ` · ${activeContinent}`}
  {activeExperience !== 'all' &&
    ` · ${EXPERIENCE_FILTERS.find((f) => f.id === activeExperience)?.label ?? ''}`}
</p>
```

This existing text already updates with `filteredArticles.length` whenever filters change; making it a polite live region means screen reader users hear the count change without needing to parse the canvas cluster circles directly.

- [ ] **Step 6: Typecheck**

```bash
npm run typecheck
```

Expected: no errors. If `GeoJSONSource` is not exported from `react-map-gl/maplibre`, import it directly from `maplibre-gl` instead: `import type { GeoJSONSource } from 'maplibre-gl';`.

- [ ] **Step 7: Verify clustering visually**

```
mcp__Claude_Preview__preview_eval: window.location.href = 'http://localhost:3000/mappa'
mcp__Claude_Preview__preview_screenshot
```

Expected: at the initial zoom (3.5), the previously-overlapping tangle of individual pins in Central/Southern Europe is now one or more numbered circles (clusters). No individual `Marker` pins are visible at this zoom.

- [ ] **Step 8: Verify cluster click zooms in**

```
mcp__Claude_Preview__preview_click: selector for a cluster circle (use preview_snapshot first to find its position, or preview_eval to dispatch a click at the cluster's screen coordinates via the canvas)
```

Expected: the map animates to a closer zoom; once zoom crosses 6, the cluster circles disappear and individual `Marker` pins (with the popup-on-click behavior from before this task) appear in their place.

- [ ] **Step 9: Verify individual point click at low zoom still opens the right destination**

At the initial zoom, click an isolated (non-clustered) point circle if one is visible (e.g. Egitto or Malesia, which have only one nearby item per the spec's data notes). Expected: the correct popup opens for that destination, matching what clicking the equivalent `Marker` would have shown before this task.

- [ ] **Step 10: Run the existing test suite**

```bash
npm run typecheck && npx vitest run
```

Expected: all existing tests still pass (no test currently covers `MapboxWorldMap.tsx` directly, so none should be affected).

- [ ] **Step 11: Commit**

```bash
git add src/components/map/MapboxWorldMap.tsx
git commit -m "feat(mappa): native GeoJSON clustering below zoom 6

Fixes the overlapping-marker bug (individual Marker per article, no
aggregation) by adding MapLibre's built-in cluster:true GeoJSON source
below the zoom level focusArticle's camera lands on. Above that zoom,
the existing React Marker/Popup interaction is unchanged. Zero new
dependencies. Destination count panel is now a polite live region so
screen readers hear count changes the canvas layers can't announce."
```

---

### Task 7: Promote "Mappa" to the primary navigation

**Files:**

- Modify: `src/components/Navbar.tsx:151-167` (`navItems` array)
- Modify: `src/components/Navbar.test.tsx` (extend the existing nav-links test)

**Interfaces:**

- Consumes: nothing (standalone `NavItem`, no `subLinks`/`primaryLinks`/`feature`, matching the existing "Esplora"/"Shop" pattern exactly).
- Produces: nothing consumed elsewhere.

Grounding note: `isItemActive()` (riga 177-206) already has a generic fallback (riga 195-197: `if (item.href && item.href !== '#' && path === item.href.split('?')[0]) return true;`) that correctly handles a plain item like `{ name: 'Mappa', href: '/mappa' }` with no special-casing needed — confirmed by reading the function, no change required there. `/mappa` is also not present in `LITE_DISABLED_ROUTES`/`PREFIX_DISABLED` (`src/config/liteMode.ts`), so it is already reachable in lite mode today (e.g. via the footer) — the nav item should therefore remain visible in lite mode too, requiring no addition to the `disabledHrefs` filter at riga 169.

- [ ] **Step 1: Write the failing test**

In `src/components/Navbar.test.tsx`, extend the existing test:

```tsx
it('renders navigation links (IA definitiva 2026-07-04)', () => {
  const { getAllByText } = renderNavbar();
  // Due assi ortogonali: DOVE (Destinazioni) × COSA (Racconti), più Esplora,
  // Chi siamo, Shop. Strumenti e Club sono ora nel footer, non in nav primaria.
  expect(getAllByText(/Destinazioni/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Esplora/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Mappa/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Racconti/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Chi siamo/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Shop/i).length).toBeGreaterThan(0);
  // CTA nav reader-first (B2, 2026-07-04): la pill primaria è "Vieni con noi"
  // (/vieni-con-noi); "Collabora" resta come link secondario a /collaborazioni.
  expect(getAllByText(/Vieni con noi/i).length).toBeGreaterThan(0);
  expect(getAllByText(/Collabora/i).length).toBeGreaterThan(0);
});
```

(Only the `expect(getAllByText(/Mappa/i).length).toBeGreaterThan(0);` line is new.)

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/Navbar.test.tsx
```

Expected: FAIL — `getAllByText(/Mappa/i)` finds zero elements (the current `navItems` array has no "Mappa" entry).

- [ ] **Step 3: Add the nav item**

In `src/components/Navbar.tsx`, find:

```tsx
      { name: 'Esplora', href: '/esplora' },
      { name: 'Racconti', href: '/esplora?format=storia', subLinks: raccontiLinks },
```

Replace with:

```tsx
      { name: 'Esplora', href: '/esplora' },
      { name: 'Mappa', href: '/mappa' },
      { name: 'Racconti', href: '/esplora?format=storia', subLinks: raccontiLinks },
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/Navbar.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Verify visually (desktop + mobile)**

```
mcp__Claude_Preview__preview_eval: window.location.href = 'http://localhost:3000/'
mcp__Claude_Preview__preview_snapshot
```

Expected: "Mappa" appears as a top-level nav link between "Esplora" and "Racconti".

```
mcp__Claude_Preview__preview_click: selector for the "Mappa" nav link
```

Expected: navigates to `/mappa` and the link is visually marked active (terracotta text + underline, per `isItemActive`'s generic path match).

```
mcp__Claude_Preview__preview_resize: preset "mobile"
mcp__Claude_Preview__preview_click: selector '[aria-label="Menu"]'
mcp__Claude_Preview__preview_snapshot
```

Expected: "Mappa" appears in the mobile drawer menu as a plain link (no submenu chevron, matching "Esplora"/"Shop").

- [ ] **Step 7: Commit**

```bash
git add src/components/Navbar.tsx src/components/Navbar.test.tsx
git commit -m "feat(nav): promote Mappa to primary navigation

Was previously reachable only via footer/contextual links. isItemActive
already handles a plain href-only item via its generic fallback, and
/mappa was already excluded from LITE_MODE's disabled routes, so no
other logic needed changing."
```

---

## Final verification (after all tasks)

- [ ] **Full typecheck + test suite**

```bash
npm run typecheck && npx vitest run
```

Expected: all pass.

- [ ] **Full audit sweep**

```bash
npm run audit:ui
```

Expected: no new violations introduced by these changes.

- [ ] **Browser smoke test** (per spec §Testing)

Using the Preview MCP tools against `http://localhost:3000/mappa` and `http://localhost:3000/`:

1. Globe projection visible at initial load.
2. Filter chips (continente/esperienza) still filter correctly and the destination count updates.
3. Editorial "Percorsi suggeriti" cards still apply filters on click.
4. Cluster click zooms in; individual marker click opens the popup; popup CTA still links correctly (internal article or external reel URL).
5. "Apri archivio" CTA still links to `/esplora` with the right query params.
6. Nav "Mappa" entry present and functional at 1280px and 375px.
7. No horizontal overflow at 320/375/768/1280px.
8. No new console errors.
