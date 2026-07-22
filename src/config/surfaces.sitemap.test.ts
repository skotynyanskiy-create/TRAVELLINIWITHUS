import { describe, it, expect } from 'vitest';
import { sitemapPaths } from './surfaces';

/**
 * Guardia di non-regressione: i 15 URL gia in sitemap al 2026-07-22 devono
 * restarci, tranne quelli che l'owner ha deciso di togliere.
 */
const GIA_IN_SITEMAP = [
  '/',
  '/esplora',
  '/strumenti',
  '/press',
  '/mappa',
  '/chi-siamo',
  '/collaborazioni',
  '/media-kit',
  '/contatti',
  '/risorse',
  '/club',
  '/privacy',
  '/cookie',
  '/termini',
  '/disclaimer',
];

describe('sitemap dal registro', () => {
  it('non perde nessuno dei 15 URL gia pubblicati', () => {
    const paths = sitemapPaths();
    for (const url of GIA_IN_SITEMAP) {
      expect(paths, `${url} sparito dalla sitemap`).toContain(url);
    }
  });

  it('aggiunge /destinazione, che mancava', () => {
    expect(sitemapPaths()).toContain('/destinazione');
  });
});
