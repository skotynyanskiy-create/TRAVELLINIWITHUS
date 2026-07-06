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
