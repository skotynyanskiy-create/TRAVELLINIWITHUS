import { describe, it, expect } from 'vitest';
import { sitemapPaths } from './surfaces';

/**
 * Guardia di non-regressione: i 15 URL gia in sitemap al 2026-07-22 devono
 * restarci, tranne quelli che l'owner ha deciso di togliere.
 * 2026-07-23 (TASK-034): /strumenti rimosso — la pagina e il cluster itinerario
 * erano codice orfano dietro un redirect a /esplora; l'owner ha reso il redirect
 * definitivo, quindi l'URL esce dalla sitemap (restano 14).
 * 2026-08-15: /press rimosso, stesso caso e su decisione dell'owner. Era
 * dichiarato `live`, stava in sitemap e aveva meta proprie — quindi il build
 * generava `dist/press/index.html` con un canonical su `/press` — ma
 * `App.tsx` lo redirige a `/collaborazioni` e **nessuna pagina del sito ci
 * linka**. Un crawler riceveva due segnali in conflitto sullo stesso fetch.
 * Restano 13. Se un giorno serve una pagina stampa vera, va rifatta come
 * pagina: le redazioni cercano «contatti stampa», non «collaborazioni».
 */
const GIA_IN_SITEMAP = [
  '/',
  '/esplora',
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
