import { describe, it, expect } from 'vitest';
import { SURFACES, findSurface, isIndexable, surfaceState, sitemapPaths } from './surfaces';

describe('registro delle superfici', () => {
  it('trova una superficie statica per pathname esatto', () => {
    expect(findSurface('/mappa')?.state).toBe('live');
  });

  it('trova una superficie dinamica per pattern', () => {
    expect(findSurface('/posto/emilia-granduca-di-campigna')?.path).toBe('/posto/:slug');
    expect(findSurface('/destinazione/italia')?.path).toBe('/destinazione/:zoneSlug');
  });

  it('preferisce la rotta statica a quella dinamica quando entrambe combaciano', () => {
    expect(findSurface('/itinerari/compare')?.path).toBe('/itinerari/compare');
  });

  it('considera indicizzabile solo cio che e live e non private', () => {
    expect(isIndexable('/mappa')).toBe(true);
    expect(isIndexable('/shop')).toBe(false);
    expect(isIndexable('/itinerari')).toBe(false);
    expect(isIndexable('/preferiti')).toBe(false);
  });

  it('espone lo stato di una superficie, con live come default per rotte ignote', () => {
    expect(surfaceState('/shop')).toBe('soon');
    expect(surfaceState('/itinerari')).toBe('preview');
    expect(surfaceState('/rotta-che-non-esiste')).toBe('live');
  });

  it('mette in sitemap solo le superfici statiche live e non private', () => {
    const paths = sitemapPaths();
    expect(paths).toContain('/destinazione');
    expect(paths).toContain('/mappa');
    expect(paths).not.toContain('/shop');
    expect(paths).not.toContain('/itinerari');
    expect(paths).not.toContain('/preferiti');
    expect(paths.every((p) => !p.includes(':'))).toBe(true);
  });

  it('non contiene duplicati di path', () => {
    const seen = SURFACES.map((s) => s.path);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('family hub e consigli sono live (8 entry reali, flip 2026-07-24); lo shop resta preview', () => {
    for (const path of ['/family', '/family/consigli']) {
      expect(surfaceState(path), `${path} deve essere live`).toBe('live');
      expect(isIndexable(path), `${path} deve essere indicizzabile`).toBe(true);
      expect(sitemapPaths()).toContain(path);
    }
    expect(surfaceState('/family/shop')).toBe('preview');
    expect(isIndexable('/family/shop')).toBe(false);
    expect(sitemapPaths()).not.toContain('/family/shop');
  });
});
