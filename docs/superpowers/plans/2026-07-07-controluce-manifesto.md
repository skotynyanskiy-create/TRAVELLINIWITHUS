# CONTROLUCE (/manifesto) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the v1 of CONTROLUCE — a scroll-driven WebGL "backlit linen" experience on an isolated, noindex `/manifesto` route, per spec `docs/superpowers/specs/2026-07-07-controluce-manifesto-design.md`.

**Architecture:** One standalone lazy route (no Layout/navbar). A fixed fullscreen R3F canvas renders a single subdivided plane whose ShaderMaterial IS the whole world (anisotropic linen weave, translucency, sun SDF, per-act modules, Fraunces-title occlusion). A tall scroller div (700vh) + dedicated Lenis instance produce master scroll `t∈[0,1]`, remapped by a hand-authored pacing curve. DOM overlay carries all text (Fraunces) + small decorative reel-cover windows, GSAP-synced to the same `t`. Reduced-motion/small screens get a static readable fallback.

**Tech Stack:** React 19, react-router-dom, react-helmet-async (SEO noindex), @react-three/fiber, three 0.185, @react-three/postprocessing, GSAP, lenis, vitest.

## Global Constraints

- All new code under `src/experience/controluce/`; the ONLY file modified outside it is `src/App.tsx` (one lazy import + one standalone `<Route>`).
- Route `/manifesto`: standalone (outside `<Layout>`), lazy, `<SEO noindex />`, NOT added to nav or sitemap.
- No new dependencies. No AI-generated imagery — only existing `public/images/reels/reel-N-cover.webp` assets.
- Public copy in Italian; code/comments per repo conventions (comments only for non-obvious WHY).
- Act 0 hard constraints (spec §3): cloth visible+breathing at frame 1; first Fraunces line legible ≤3s; scroll cue by ~5s; first scroll response instantaneous (no easing ramp at t≈0).
- Near-dark beat floor: backlight never below 20% (spec §2.2). Held frame is v1.1 — NOT in this plan.
- Perf guardrails: DPR clamp 1.5; plane 128×128 (64×64 under 768px); pause render when tab hidden; `prefers-reduced-motion` → static fallback. No videos in v1 (covers only).
- `npm run typecheck` must pass after every task. Tests: `npx vitest run <file>`.
- **Commit policy (entangled working tree):** commit ONLY new files under `src/experience/controluce/` and this plan/spec (stage by explicit path, never `git add -A`). The one-line `src/App.tsx` change stays UNCOMMITTED (file already has unrelated working-tree modifications — same situation that blocked the Atlante commit; owner decides later).

---

### Task 1: Acts config + pacing curve (pure logic, TDD)

**Files:**

- Create: `src/experience/controluce/acts.ts`
- Test: `src/experience/controluce/acts.test.ts`

**Interfaces:**

- Produces: `ACTS: ControluceAct[]` (5 entries), `SCROLL_PAGES = 7` (700vh), `mapScrollToTimeline(raw: number): number`, `getActAt(t: number): { act: ControluceAct; index: number; local: number }`, `getLightAt(t: number): { x: number; y: number; color: [number, number, number]; intensity: number; wind: number }`, `NEAR_DARK = { start: 0.58, end: 0.62, floor: 0.2 }`.
- `ControluceAct = { id: string; title: string; verse: string; window: [number, number]; light: { from: Vec3RGB; to: Vec3RGB; xFrom: number; xTo: number; yFrom: number; yTo: number }; wind: { from: number; to: number }; reel: { cover: string; alt: string; location: string; shape: 'oblo' | 'vetrata' | 'shoji' | 'sfrangiato' | 'portone'; show: [number, number] } }` with `Vec3RGB = [number, number, number]` (linear 0–1).

- [ ] **Step 1: Write the failing test**

```ts
// src/experience/controluce/acts.test.ts
import { describe, expect, it } from 'vitest';
import { ACTS, NEAR_DARK, getActAt, getLightAt, mapScrollToTimeline } from './acts';

describe('ACTS config', () => {
  it('has 5 acts covering [0,1] contiguously', () => {
    expect(ACTS).toHaveLength(5);
    expect(ACTS[0].window[0]).toBe(0);
    expect(ACTS[4].window[1]).toBe(1);
    for (let i = 1; i < ACTS.length; i++) {
      expect(ACTS[i].window[0]).toBeCloseTo(ACTS[i - 1].window[1], 5);
    }
  });

  it('every act has Italian verse and a real reel cover path', () => {
    for (const act of ACTS) {
      expect(act.verse.length).toBeGreaterThan(10);
      expect(act.reel.cover).toMatch(/^\/images\/reels\/reel-\d-cover\.webp$/);
      expect(act.reel.show[0]).toBeGreaterThanOrEqual(act.window[0]);
      expect(act.reel.show[1]).toBeLessThanOrEqual(act.window[1]);
    }
  });
});

describe('mapScrollToTimeline (pacing curve)', () => {
  it('maps endpoints exactly and clamps outside', () => {
    expect(mapScrollToTimeline(0)).toBe(0);
    expect(mapScrollToTimeline(1)).toBe(1);
    expect(mapScrollToTimeline(-0.2)).toBe(0);
    expect(mapScrollToTimeline(1.3)).toBe(1);
  });

  it('is monotonically non-decreasing (no time travel)', () => {
    let prev = 0;
    for (let i = 0; i <= 1000; i++) {
      const v = mapScrollToTimeline(i / 1000);
      expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = v;
    }
  });

  it('is ~identity near t=0 so first scroll responds instantly (Act 0 contract)', () => {
    const v = mapScrollToTimeline(0.02);
    expect(v).toBeGreaterThan(0.012); // slope >= ~0.6 at the very start
  });

  it('compresses Assaporare (act III advances slower per scroll unit)', () => {
    // raw window that lands inside act III vs act II: act III slope must be lower
    const slope = (f: (n: number) => number, a: number, b: number) => (f(b) - f(a)) / (b - a);
    const sII = slope(mapScrollToTimeline, 0.25, 0.3);
    const sIII = slope(mapScrollToTimeline, 0.45, 0.5);
    expect(sIII).toBeLessThan(sII);
  });
});

describe('getActAt / getLightAt', () => {
  it('returns correct act with local progress in [0,1]', () => {
    const { index, local } = getActAt(0.5);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(5);
    expect(local).toBeGreaterThanOrEqual(0);
    expect(local).toBeLessThanOrEqual(1);
    expect(getActAt(0).index).toBe(0);
    expect(getActAt(1).index).toBe(4);
  });

  it('near-dark beat clamps intensity to floor, never below', () => {
    const mid = (NEAR_DARK.start + NEAR_DARK.end) / 2;
    const { intensity } = getLightAt(mid);
    expect(intensity).toBeGreaterThanOrEqual(NEAR_DARK.floor - 1e-6);
    expect(intensity).toBeLessThanOrEqual(NEAR_DARK.floor + 0.05);
  });

  it('light color at t=1 approaches site sand (#faf8f4 linear-ish)', () => {
    const { color } = getLightAt(1);
    expect(color[0]).toBeGreaterThan(0.9);
    expect(color[1]).toBeGreaterThan(0.9);
    expect(color[2]).toBeGreaterThan(0.85);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/experience/controluce/acts.test.ts`
Expected: FAIL — `Cannot find module './acts'`.

- [ ] **Step 3: Write the implementation**

```ts
// src/experience/controluce/acts.ts
/**
 * CONTROLUCE — act configuration + master pacing curve.
 * Spec: docs/superpowers/specs/2026-07-07-controluce-manifesto-design.md
 * Pure logic (no three/react imports) so it stays unit-testable.
 */

export type Vec3RGB = [number, number, number];

export interface ControluceAct {
  id: string;
  title: string;
  verse: string;
  /** timeline window [start, end] in master t */
  window: [number, number];
  light: {
    from: Vec3RGB;
    to: Vec3RGB;
    xFrom: number;
    xTo: number;
    yFrom: number;
    yTo: number;
  };
  wind: { from: number; to: number };
  reel: {
    cover: string;
    alt: string;
    location: string;
    shape: 'oblo' | 'vetrata' | 'shoji' | 'sfrangiato' | 'portone';
    /** visibility window in master t (inside act window) */
    show: [number, number];
  };
}

/** Scroller height in viewport-heights (700vh). */
export const SCROLL_PAGES = 7;

/** Near-dark beat before the Act IV reveal: light clamps to `floor`. */
export const NEAR_DARK = { start: 0.58, end: 0.62, floor: 0.2 } as const;

// sRGB→linear-ish helper kept inline as constants (verse of light per act).
const ALBA_ROSA: Vec3RGB = [0.98, 0.62, 0.55];
const ORO: Vec3RGB = [1.0, 0.78, 0.42];
const VETRATA_ROSSA: Vec3RGB = [0.85, 0.28, 0.2];
const TUNGSTENO: Vec3RGB = [1.0, 0.68, 0.38];
const ORO_VERTICALE: Vec3RGB = [1.0, 0.85, 0.5];
const BRACE: Vec3RGB = [0.76, 0.25, 0.05]; // ~#c2410c
const SABBIA: Vec3RGB = [0.98, 0.97, 0.955]; // ~#faf8f4

export const ACTS: ControluceAct[] = [
  {
    id: 'partire',
    title: 'Partire',
    verse: 'Si parte sempre due volte: una quando lo decidi, una quando chiudi la porta.',
    window: [0, 0.2],
    light: { from: ALBA_ROSA, to: ORO, xFrom: -0.6, xTo: -0.2, yFrom: 0.15, yTo: 0.35 },
    wind: { from: 0.15, to: 1 },
    reel: {
      cover: '/images/reels/reel-1-cover.webp',
      alt: "Acqua trasparente del Mar Rosso vista da sott'acqua, con reef e fondale sabbioso",
      location: 'Egitto · Mar Rosso',
      shape: 'oblo',
      show: [0.08, 0.18],
    },
  },
  {
    id: 'perdersi',
    title: 'Perdersi',
    verse: 'Certe strade esistono solo se le sbagli.',
    window: [0.2, 0.42],
    light: { from: ORO, to: VETRATA_ROSSA, xFrom: -0.2, xTo: 0.35, yFrom: 0.35, yTo: 0.5 },
    wind: { from: 1, to: 0.55 },
    reel: {
      cover: '/images/reels/reel-3-cover.webp',
      alt: 'Vetrata a tema fantasy con drago rosso e torre in una taverna in Toscana',
      location: 'Toscana · Tavernal',
      shape: 'vetrata',
      show: [0.27, 0.38],
    },
  },
  {
    id: 'assaporare',
    title: 'Assaporare',
    verse: 'Certi posti li ricordi con la bocca.',
    window: [0.42, 0.58],
    light: { from: VETRATA_ROSSA, to: TUNGSTENO, xFrom: 0.35, xTo: 0.55, yFrom: 0.5, yTo: 0.28 },
    wind: { from: 0.55, to: 0.12 },
    reel: {
      cover: '/images/reels/reel-2-cover.webp',
      alt: "Sala di un ristorante di sushi in Toscana con passerella sull'acqua",
      location: 'Toscana · Sushi Kibo',
      shape: 'shoji',
      show: [0.46, 0.55],
    },
  },
  {
    id: 'meravigliarsi',
    title: 'Meravigliarsi',
    verse: 'Ogni tanto il mondo è più grande di così.',
    window: [0.58, 0.8],
    light: { from: TUNGSTENO, to: ORO_VERTICALE, xFrom: 0.55, xTo: 0, yFrom: 0.28, yTo: 0.9 },
    wind: { from: 0.12, to: 0 },
    reel: {
      cover: '/images/reels/reel-4-cover.webp',
      alt: 'La statua dorata e la scalinata arcobaleno delle Batu Caves a Kuala Lumpur',
      location: 'Malesia · Batu Caves',
      shape: 'sfrangiato',
      show: [0.66, 0.78],
    },
  },
  {
    id: 'tornare',
    title: 'Tornare',
    verse: 'Si torna sempre un po’ stranieri. È il souvenir migliore.',
    window: [0.8, 1],
    light: { from: BRACE, to: SABBIA, xFrom: 0, xTo: 0, yFrom: 0.9, yTo: 0.5 },
    wind: { from: 0, to: 0.05 },
    reel: {
      cover: '/images/reels/reel-5-cover.webp',
      alt: 'Portone medievale a Volterra con persone in abiti gotici sui gradini',
      location: 'Toscana · Volterra',
      shape: 'portone',
      show: [0.83, 0.92],
    },
  },
];

/**
 * Per-act pacing: slope multiplier per act (montatore graft). Normalized so
 * the curve still maps [0,1]→[0,1]. Assaporare is compressed (slow reveal),
 * Perdersi loose. Piecewise-linear keeps it monotonic by construction.
 */
const ACT_SLOPES = [1.0, 1.15, 0.6, 1.1, 1.0];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Precompute cumulative raw-space widths so slopes integrate to exactly 1.
const actWidths = ACTS.map((a) => a.window[1] - a.window[0]);
const rawWidths = actWidths.map((w, i) => w / ACT_SLOPES[i]);
const rawTotal = rawWidths.reduce((s, w) => s + w, 0);
const rawStarts: number[] = [];
rawWidths.reduce((acc, w, i) => {
  rawStarts[i] = acc;
  return acc + w;
}, 0);

/** Hand-authored scroll→timeline mapping. Monotonic, endpoints exact. */
export function mapScrollToTimeline(raw: number): number {
  const r = clamp01(raw) * rawTotal;
  for (let i = 0; i < ACTS.length; i++) {
    const start = rawStarts[i];
    const end = start + rawWidths[i];
    if (r <= end || i === ACTS.length - 1) {
      const local = rawWidths[i] === 0 ? 0 : (r - start) / rawWidths[i];
      return clamp01(ACTS[i].window[0] + clamp01(local) * actWidths[i]);
    }
  }
  return 1;
}

export function getActAt(t: number): { act: ControluceAct; index: number; local: number } {
  const tt = clamp01(t);
  for (let i = 0; i < ACTS.length; i++) {
    const [a, b] = ACTS[i].window;
    if (tt <= b || i === ACTS.length - 1) {
      const local = b === a ? 0 : clamp01((tt - a) / (b - a));
      return { act: ACTS[i], index: i, local };
    }
  }
  const last = ACTS[ACTS.length - 1];
  return { act: last, index: ACTS.length - 1, local: 1 };
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: Vec3RGB, b: Vec3RGB, k: number): Vec3RGB => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
  lerp(a[2], b[2], k),
];
const smooth = (k: number) => k * k * (3 - 2 * k);

/** Light state (position, color, intensity, wind) at master t. */
export function getLightAt(t: number): {
  x: number;
  y: number;
  color: Vec3RGB;
  intensity: number;
  wind: number;
} {
  const { act, local } = getActAt(t);
  const k = smooth(local);
  let intensity = 1;
  // Near-dark beat (scenografo graft): dip to floor, never below.
  const { start, end, floor } = NEAR_DARK;
  if (t >= start && t <= end) {
    const mid = (start + end) / 2;
    const d = Math.abs(t - mid) / ((end - start) / 2); // 0 center → 1 edges
    intensity = lerp(floor, 1, smooth(d));
  }
  return {
    x: lerp(act.light.xFrom, act.light.xTo, k),
    y: lerp(act.light.yFrom, act.light.yTo, k),
    color: lerp3(act.light.from, act.light.to, k),
    intensity,
    wind: lerp(act.wind.from, act.wind.to, k) * intensity,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/experience/controluce/acts.test.ts`
Expected: PASS (all tests). Then `npm run typecheck` → 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/experience/controluce/acts.ts src/experience/controluce/acts.test.ts
git commit -m "feat(controluce): acts config + pacing curve with near-dark beat"
```

---

### Task 2: Master timeline hook (dedicated Lenis + scroll t)

**Files:**

- Create: `src/experience/controluce/useMasterTimeline.ts`

**Interfaces:**

- Consumes: `mapScrollToTimeline` (Task 1).
- Produces: `useMasterTimeline(scrollerRef: RefObject<HTMLElement|null>): { tRef: MutableRefObject<number>; rawRef: MutableRefObject<number> }` — refs (not state) updated every frame; consumers read them in rAF/useFrame without re-renders.

- [ ] **Step 1: Implementation** (no unit test — DOM/scroll glue; verified in Task 8 browser pass; typecheck gates it)

```ts
// src/experience/controluce/useMasterTimeline.ts
import { useEffect, useRef, type RefObject } from 'react';
import { mapScrollToTimeline } from './acts';

/**
 * Dedicated Lenis on the tall scroller. Global SmoothScrollProvider does not
 * cover standalone routes, so the experience owns its own instance.
 * Exposes refs (no React state) so the canvas reads t at frame rate.
 */
export function useMasterTimeline(scrollerRef: RefObject<HTMLElement | null>) {
  const tRef = useRef(0);
  const rawRef = useRef(0);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const update = () => {
      const el = scrollerRef.current;
      if (!el) return;
      const max = el.scrollHeight - window.innerHeight;
      const raw = max > 0 ? window.scrollY / max : 0;
      rawRef.current = Math.min(1, Math.max(0, raw));
      tRef.current = mapScrollToTimeline(rawRef.current);
    };
    update();

    void import('lenis').then((mod) => {
      if (cancelled) return;
      const lenis = new mod.default({
        // Act 0 contract: first scroll must answer instantly.
        duration: 0.9,
        smoothWheel: true,
      });
      let raf = 0;
      const frame = (time: number) => {
        lenis.raf(time);
        update();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      cleanup = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', update);
      cleanup?.();
    };
  }, [scrollerRef]);

  return { tRef, rawRef };
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run typecheck` → 0 errors.

```bash
git add src/experience/controluce/useMasterTimeline.ts
git commit -m "feat(controluce): dedicated lenis master timeline hook"
```

---

### Task 3: LinenMaterial — the GLSL world

**Files:**

- Create: `src/experience/controluce/LinenMaterial.ts`

**Interfaces:**

- Produces: `createLinenMaterial(): THREE.ShaderMaterial` with uniforms `uTime, uScroll, uLightPos (Vector2), uLightColor (Color), uIntensity, uWind, uTitleTex (Texture|null), uHasTitle, uAspect`.

- [ ] **Step 1: Implementation** (visual code — no unit test; typecheck + browser verify in Task 9)

Write ONE complete vertex + fragment shader pair. Vertex: 2-octave wind billow. Fragment: anisotropic weave + translucency + sun SDF + title occlusion + vignette.

```ts
// src/experience/controluce/LinenMaterial.ts
import * as THREE from 'three';

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uWind;
  varying vec2 vUv;
  varying float vBillow;

  void main() {
    vUv = uv;
    vec3 p = position;
    float w1 = sin(p.x * 2.1 + uTime * 0.7) * cos(p.y * 1.7 + uTime * 0.45);
    float w2 = sin(p.x * 5.3 - uTime * 1.1) * sin(p.y * 4.1 + uTime * 0.8);
    float billow = (w1 * 0.7 + w2 * 0.3) * uWind;
    p.z += billow * 0.18;
    vBillow = billow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uLightPos;
  uniform vec3 uLightColor;
  uniform float uIntensity;
  uniform float uWind;
  uniform float uAspect;
  uniform sampler2D uTitleTex;
  uniform float uHasTitle;
  varying vec2 vUv;
  varying float vBillow;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  // one thread band: bright core, dark gap between threads (per-thread jitter)
  float thread(float coord, float count, float seed) {
    float id = floor(coord * count);
    float j = hash(vec2(id, seed)) * 0.35;
    float f = fract(coord * count + j);
    return smoothstep(0.0, 0.32, f) * smoothstep(1.0, 0.68, f);
  }

  void main() {
    vec2 uv = vUv;
    vec2 suv = vec2(uv.x * uAspect, uv.y);

    // weave: warp x weft, anisotropic — the linen identity, not fbm
    float warp = thread(uv.x + vBillow * 0.02, 220.0, 3.7);
    float weft = thread(uv.y + vBillow * 0.015, 180.0, 9.2);
    float weave = warp * 0.55 + weft * 0.45;

    // flying fibers: gradient noise stretched ~20:1
    float fibers = noise(vec2(suv.x * 3.0, suv.y * 60.0) + uTime * 0.05) * 0.12;
    // slub clumps of handmade linen
    float slub = noise(suv * 8.0) * 0.5 + noise(suv * 23.0) * 0.25;

    float thickness = 0.55 + slub * 0.5 - weave * 0.35 + fibers;
    if (uHasTitle > 0.5) {
      thickness += texture2D(uTitleTex, uv).r * 0.85; // Fraunces blocks the sun
    }

    // backlight: soft sun disc BEHIND the cloth
    vec2 lp = vec2(uLightPos.x * uAspect, uLightPos.y);
    float d = distance(suv, lp * 0.5 + vec2(uAspect * 0.5, 0.5));
    float sun = exp(-d * d * 5.5);
    float backlight = (sun * 1.15 + 0.22) * uIntensity;

    float trans = exp(-thickness * 2.1);
    vec3 lightThrough = uLightColor * backlight * trans;
    float gap = 1.0 - weave;
    lightThrough += uLightColor * sun * gap * gap * 0.55 * uIntensity; // sparkle in gaps

    vec3 sand = vec3(0.98, 0.972, 0.955);
    vec3 ink = vec3(0.11, 0.10, 0.09);
    vec3 cloth = mix(ink, sand, 0.25 + trans * 0.75);
    vec3 col = cloth * 0.35 + lightThrough;

    float vig = smoothstep(1.25, 0.45, distance(uv, vec2(0.5)));
    col *= 0.75 + vig * 0.25;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createLinenMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uLightPos: { value: new THREE.Vector2(-0.6, 0.15) },
      uLightColor: { value: new THREE.Color(0.98, 0.62, 0.55) },
      uIntensity: { value: 1 },
      uWind: { value: 0.15 },
      uTitleTex: { value: null },
      uHasTitle: { value: 0 },
      uAspect: { value: 16 / 9 },
    },
  });
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run typecheck` → 0 errors.

```bash
git add src/experience/controluce/LinenMaterial.ts
git commit -m "feat(controluce): linen weave backlight shader material"
```

---

### Task 4: Title texture (Fraunces occludes the light)

**Files:**

- Create: `src/experience/controluce/titleTexture.ts`

**Interfaces:**

- Produces: `makeTitleTexture(title: string, aspect: number): THREE.CanvasTexture` — white glyphs on black, centered, Fraunces italic; consumed as `uTitleTex` by Task 5.

- [ ] **Step 1: Implementation**

```ts
// src/experience/controluce/titleTexture.ts
import * as THREE from 'three';

const W = 1024;

/** Rasterize an act title so the shader can press it into the cloth. */
export function makeTitleTexture(title: string, aspect: number): THREE.CanvasTexture {
  const h = Math.round(W / Math.max(aspect, 0.5));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, h);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const size = Math.min(W / (title.length * 0.62), h * 0.42);
  ctx.font = `italic 500 ${size}px Fraunces, serif`;
  ctx.filter = 'blur(1.5px)'; // soft press, not laser-cut
  ctx.fillText(title, W / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run typecheck` → 0 errors.

```bash
git add src/experience/controluce/titleTexture.ts
git commit -m "feat(controluce): fraunces title thickness texture"
```

---

### Task 5: ControluceCanvas — R3F scene + frame loop + postFX

**Files:**

- Create: `src/experience/controluce/ControluceCanvas.tsx`

**Interfaces:**

- Consumes: `createLinenMaterial` (T3), `makeTitleTexture` (T4), `getLightAt`/`getActAt` (T1); prop `tRef: MutableRefObject<number>` (T2).
- Produces: default export `ControluceCanvas({ tRef })` — fixed fullscreen canvas, pauses when tab hidden.

- [ ] **Step 1: Implementation**

```tsx
// src/experience/controluce/ControluceCanvas.tsx
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { getActAt, getLightAt } from './acts';
import { createLinenMaterial } from './LinenMaterial';
import { makeTitleTexture } from './titleTexture';

function LinenPlane({ tRef }: { tRef: MutableRefObject<number> }) {
  const material = useMemo(() => createLinenMaterial(), []);
  const { viewport } = useThree();
  const titleCache = useRef(new Map<string, THREE.CanvasTexture>());
  const lastActId = useRef('');

  useFrame(({ clock }) => {
    const t = tRef.current;
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uScroll.value = t;
    u.uAspect.value = viewport.aspect;

    const light = getLightAt(t);
    (u.uLightPos.value as THREE.Vector2).set(light.x, light.y);
    (u.uLightColor.value as THREE.Color).setRGB(light.color[0], light.color[1], light.color[2]);
    u.uIntensity.value = light.intensity;
    u.uWind.value = light.wind;

    const { act, local } = getActAt(t);
    if (act.id !== lastActId.current) {
      lastActId.current = act.id;
      if (!titleCache.current.has(act.id)) {
        titleCache.current.set(act.id, makeTitleTexture(act.title, viewport.aspect));
      }
      u.uTitleTex.value = titleCache.current.get(act.id)!;
    }
    // title pressed only in the act's middle band, absent at the seams
    const ramp = Math.min(1, Math.max(0, Math.min(local * 4, (1 - local) * 4)));
    u.uHasTitle.value = ramp > 0.05 ? 1 : 0;
  });

  return (
    <mesh material={material}>
      <planeGeometry args={[2.2, 2.2, 128, 128]} />
    </mesh>
  );
}

export default function ControluceCanvas({ tRef }: { tRef: MutableRefObject<number> }) {
  // perf guardrail: stop the frameloop entirely when the tab is hidden
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const caOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0004), []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1.1], fov: 60 }}
        frameloop={frameloop}
      >
        <LinenPlane tRef={tRef} />
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.55} mipmapBlur />
          <Noise premultiply opacity={0.5} />
          <ChromaticAberration offset={caOffset} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
```

Implementer note: if `@react-three/postprocessing` prop names differ in the installed version (check with the installed types), adapt Bloom/Noise/CA props minimally — the intent is: soft bloom, film grain, hair of CA.

- [ ] **Step 2: Verify + commit**

Run: `npm run typecheck` → 0 errors.

```bash
git add src/experience/controluce/ControluceCanvas.tsx
git commit -m "feat(controluce): r3f canvas with linen plane and postfx"
```

---

### Task 6: DOM overlay — verses, reel windows, scroll cue (TDD)

**Files:**

- Create: `src/experience/controluce/ControluceOverlay.tsx`
- Test: `src/experience/controluce/ControluceOverlay.test.tsx`

**Interfaces:**

- Consumes: `ACTS` (T1); prop `tRef: MutableRefObject<number>`.
- Produces: default export `ControluceOverlay({ tRef })` — fixed `pointer-events-none` overlay: per-act verse blocks, small decorative reel-cover windows (`aria-hidden`, empty alt), "scorri" cue until first scroll. Visibility driven by a rAF loop writing inline styles from `tRef` (no React state churn).

- [ ] **Step 1: Write the failing test**

```tsx
// src/experience/controluce/ControluceOverlay.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ControluceOverlay from './ControluceOverlay';
import { ACTS } from './acts';

describe('ControluceOverlay', () => {
  it('renders every act title and Italian verse', () => {
    render(<ControluceOverlay tRef={{ current: 0 }} />);
    for (const act of ACTS) {
      expect(screen.getByText(act.title)).toBeInTheDocument();
      expect(screen.getByText(act.verse)).toBeInTheDocument();
    }
  });

  it('marks decorative reel windows aria-hidden with empty alt', () => {
    const { container } = render(<ControluceOverlay tRef={{ current: 0 }} />);
    const windows = container.querySelectorAll('[data-reel-window]');
    expect(windows.length).toBe(ACTS.length);
    windows.forEach((w) => {
      expect(w.getAttribute('aria-hidden')).toBe('true');
      expect(w.querySelector('img')?.getAttribute('alt')).toBe('');
    });
  });

  it('shows the scroll cue at start', () => {
    render(<ControluceOverlay tRef={{ current: 0 }} />);
    expect(screen.getByText(/scorri/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/experience/controluce/ControluceOverlay.test.tsx`
Expected: FAIL — `Cannot find module './ControluceOverlay'`.

- [ ] **Step 3: Implementation**

```tsx
// src/experience/controluce/ControluceOverlay.tsx
import { useEffect, useRef, type MutableRefObject } from 'react';
import { ACTS } from './acts';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 outside [a,b], ramps in/out inside. */
const window01 = (t: number, a: number, b: number, ramp = 0.03) =>
  t < a || t > b ? 0 : clamp01(Math.min((t - a) / ramp, (b - t) / ramp, 1));

const WINDOW_CLIP: Record<string, string> = {
  oblo: 'ellipse(50% 50% at 50% 50%)',
  vetrata: 'polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%)',
  shoji: 'inset(8% 0 8% 0)',
  sfrangiato: 'polygon(3% 6%, 97% 2%, 99% 94%, 5% 98%)',
  portone: 'inset(0 12% 0 12% round 45% 45% 0 0)',
};

export default function ControluceOverlay({ tRef }: { tRef: MutableRefObject<number> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const t = tRef.current;
      const root = rootRef.current;
      if (root) {
        if (t > 0.005) scrolledRef.current = true;
        const cue = root.querySelector<HTMLElement>('[data-cue]');
        if (cue) cue.style.opacity = scrolledRef.current ? '0' : '1';
        ACTS.forEach((act, i) => {
          const [a, b] = act.window;
          const verse = root.querySelector<HTMLElement>(`[data-act="${i}"]`);
          if (verse) {
            const v = window01(t, a + (b - a) * 0.18, b - (b - a) * 0.18, 0.04);
            verse.style.opacity = String(v);
            verse.style.transform = `translateY(${(1 - v) * 14}px)`;
          }
          const win = root.querySelector<HTMLElement>(`[data-reel-window="${i}"]`);
          if (win)
            win.style.opacity = String(
              window01(t, act.reel.show[0], act.reel.show[1], 0.025) * 0.9
            );
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tRef]);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-10">
      {ACTS.map((act, i) => (
        <div
          key={act.id}
          data-act={i}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center opacity-0"
        >
          <h2 className="font-serif italic text-[clamp(3.5rem,9vw,8rem)] leading-none text-[var(--color-ink)] mix-blend-multiply">
            {act.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md font-serif text-lg leading-relaxed text-[var(--color-ink)]/85">
            {act.verse}
          </p>
        </div>
      ))}

      {ACTS.map((act, i) => (
        <div
          key={`w-${act.id}`}
          data-reel-window={i}
          aria-hidden="true"
          className="absolute opacity-0"
          style={{
            width: act.reel.shape === 'shoji' ? 320 : 240,
            left: i % 2 === 0 ? '12%' : 'auto',
            right: i % 2 === 1 ? '12%' : 'auto',
            top: `${30 + (i % 3) * 18}%`,
          }}
        >
          <img
            src={act.reel.cover}
            alt=""
            loading="lazy"
            className="h-auto w-full"
            style={{
              clipPath: WINDOW_CLIP[act.reel.shape],
              filter: 'saturate(0.9) contrast(0.95)',
            }}
          />
          <span className="mt-2 block text-center font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink)]/50">
            {act.reel.location}
          </span>
        </div>
      ))}

      <div
        data-cue
        className="absolute bottom-8 inset-x-0 text-center font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink)]/55 animate-pulse"
      >
        scorri — la luce la muovi tu
      </div>

      {/* Chiusura Atto V (spec par.4): firma + unica uscita dalla pagina. */}
      <div
        data-act-end
        className="pointer-events-auto absolute bottom-16 inset-x-0 text-center opacity-0"
      >
        <p className="font-serif italic text-[var(--color-ink)]/70">Rodrigo &amp; Betta</p>
        <a
          href="/esplora"
          className="mt-4 inline-block font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Esplora l&apos;atlante →
        </a>
      </div>
    </div>
  );
}
```

Sync in the rAF tick (add next to the cue update): `const end = root.querySelector<HTMLElement>('[data-act-end]'); if (end) end.style.opacity = String(window01(t, 0.93, 1.001, 0.04));` — and add a test assertion in Step 1: `expect(screen.getByRole('link', { name: /esplora/i })).toHaveAttribute('href', '/esplora');`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/experience/controluce/ControluceOverlay.test.tsx`
Expected: PASS. Then `npm run typecheck` → 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/experience/controluce/ControluceOverlay.tsx src/experience/controluce/ControluceOverlay.test.tsx
git commit -m "feat(controluce): dom overlay with verses, reel windows, scroll cue"
```

---

### Task 7: Fallback + Experience shell

**Files:**

- Create: `src/experience/controluce/ControluceFallback.tsx`
- Create: `src/experience/controluce/ControluceExperience.tsx`

**Interfaces:**

- Consumes: `ACTS`, `SCROLL_PAGES` (T1), `useMasterTimeline` (T2), `ControluceCanvas` (T5, lazy), `ControluceOverlay` (T6), `useReducedMotion` from `src/hooks/useReducedMotion.ts`.
- Produces: default export `ControluceExperience()` — page body; reduced-motion or <768px → `ControluceFallback` (static readable sequence, real alt text).

- [ ] **Step 1: Implementation**

```tsx
// src/experience/controluce/ControluceFallback.tsx
import { ACTS } from './acts';

/** Static readable sequence: reduced-motion / small screens. */
export default function ControluceFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-sand)] px-6 py-24">
      <div className="mx-auto max-w-2xl space-y-24">
        {ACTS.map((act) => (
          <section key={act.id} className="text-center">
            <h2 className="font-serif italic text-5xl text-[var(--color-ink)]">{act.title}</h2>
            <p className="mt-4 font-serif text-lg leading-relaxed text-[var(--color-ink)]/85">
              {act.verse}
            </p>
            <img
              src={act.reel.cover}
              alt={act.reel.alt}
              loading="lazy"
              className="mx-auto mt-8 w-64 rounded-sm"
            />
            <span className="mt-3 block font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink)]/50">
              {act.reel.location}
            </span>
          </section>
        ))}
        <p className="text-center font-serif italic text-[var(--color-ink)]/70">
          Rodrigo &amp; Betta
        </p>
      </div>
    </div>
  );
}
```

```tsx
// src/experience/controluce/ControluceExperience.tsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SCROLL_PAGES } from './acts';
import { useMasterTimeline } from './useMasterTimeline';
import ControluceOverlay from './ControluceOverlay';
import ControluceFallback from './ControluceFallback';

// three (~500KB) loads lazily; the fallback never downloads it (Sentiero pattern).
const ControluceCanvas = lazy(() => import('./ControluceCanvas'));

export default function ControluceExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [isSmall, setIsSmall] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { tRef } = useMasterTimeline(scrollerRef);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Full-bleed: cloth-colored overscroll on this route only (Sentiero pattern).
  useEffect(() => {
    const prevHtml = document.documentElement.style.background;
    const prevBody = document.body.style.background;
    document.documentElement.style.background = '#f3ede2';
    document.body.style.background = '#f3ede2';
    return () => {
      document.documentElement.style.background = prevHtml;
      document.body.style.background = prevBody;
    };
  }, []);

  if (prefersReducedMotion || isSmall) return <ControluceFallback />;

  return (
    <div ref={scrollerRef} style={{ height: `${SCROLL_PAGES * 100}vh` }}>
      <Suspense fallback={<div className="fixed inset-0 bg-[#f3ede2]" />}>
        <ControluceCanvas tRef={tRef} />
      </Suspense>
      <ControluceOverlay tRef={tRef} />
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run typecheck` → 0 errors. `npx vitest run src/experience/controluce` → all pass.

```bash
git add src/experience/controluce/ControluceFallback.tsx src/experience/controluce/ControluceExperience.tsx
git commit -m "feat(controluce): experience shell with reduced-motion fallback"
```

---

### Task 8: Route page + registration (App.tsx stays uncommitted)

**Files:**

- Create: `src/experience/controluce/ManifestoPage.tsx`
- Modify: `src/App.tsx` (2 lines — DO NOT COMMIT, see Global Constraints)

- [ ] **Step 1: Check the SEO component contract**

Read `src/pages/AtlanteLab.tsx` (lines 1–25) and copy its exact `SEO` import path and prop names for the noindex usage. Adapt the snippet below if they differ.

- [ ] **Step 2: Page with SEO noindex**

```tsx
// src/experience/controluce/ManifestoPage.tsx
import SEO from '../../components/SEO';
import ControluceExperience from './ControluceExperience';

export default function ManifestoPage() {
  return (
    <>
      {/* Lab: manifesto cinematico Controluce. noindex, fuori dal sito pubblico. */}
      <SEO
        title="Controluce — manifesto"
        description="Un giorno di luce attraverso un telo di lino: il manifesto di viaggio di Rodrigo & Betta."
        noindex
      />
      <ControluceExperience />
    </>
  );
}
```

- [ ] **Step 3: Register the route in `src/App.tsx`**

With the other lazy imports (near line 56):

```tsx
const ManifestoPage = lazy(() => import('./experience/controluce/ManifestoPage'));
```

As a standalone route next to `/vieni-con-noi` (near line 99, OUTSIDE `<Route path="/" element={<Layout />}>` so it has no navbar/footer):

```tsx
{
  /* Lab Controluce: manifesto WebGL, noindex, fuori da nav/sitemap */
}
<Route path="/manifesto" element={<ManifestoPage />} />;
```

- [ ] **Step 4: Verify + commit (page only)**

Run: `npm run typecheck` → 0 errors.

```bash
git add src/experience/controluce/ManifestoPage.tsx
git commit -m "feat(controluce): manifesto page with noindex seo"
# src/App.tsx deliberately NOT staged (entangled working tree — owner decision)
```

---

### Task 9: Browser verification + taste baseline (no commit)

**Files:** none (verification only)

- [ ] **Step 1: Dev server + route smoke**

Run `npm run dev` in background; navigate to `http://localhost:3000/manifesto` with browser tooling (playwright or chrome-devtools MCP).
Expected: cloth visible immediately (no blank frame), "Partire" + verse legible, scroll cue visible at bottom.

- [ ] **Step 2: Scroll screenshots at spec checkpoints**

Screenshot at raw scroll ≈ {0, 0.15, 0.35, 0.55, 0.6, 0.75, 0.9, 1.0}. Verify: titles change per act; light follows the act table (alba rosa→oro → vetrata rossa → tungsteno → oro verticale → brace → sabbia); near-dark dip around t≈0.6; reel windows small and marginal; final frame settles toward sand `#faf8f4`.

- [ ] **Step 3: Console + regressions**

Zero console errors on `/manifesto`; `/` home unaffected; `npm run typecheck` and `npx vitest run` green.

- [ ] **Step 4: Taste report to owner**

Deliver the screenshots and the tunable knobs (weave density 220/180, sun falloff 5.5, wind 0.18, thickness 2.1, bloom 0.55) for the iteration loop. No commit in this task.
