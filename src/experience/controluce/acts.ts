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
    verse: "Si torna sempre un po' stranieri. È il souvenir migliore.",
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
  if (raw <= 0) return 0;
  if (raw >= 1) return 1;
  const r = raw * rawTotal;
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
