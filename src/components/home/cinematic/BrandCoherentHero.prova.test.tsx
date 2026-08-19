import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getContentById } from '@/src/config/contentLibrary';

/**
 * L'hero è il punto in cui il sito dice «Provato» nel modo più visibile che ha.
 * Prima puntava a un posto `isPlaceholder` e `adv` sotto un'immagine a
 * provenienza non certificata (DECISION_IMAGERY_TRUTH_RULE_2026-07-22): la
 * rivendicazione più forte poggiava sul dato più debole.
 *
 * Questi test tengono legate le quattro cose che devono restare la stessa cosa:
 * il posto in copertina, il suo frame reale, la didascalia e il preload
 * dell'LCP in `index.html`. Un commento non l'aveva impedito; un test sì.
 */

const HERO_SOURCE = readFileSync(resolve(__dirname, 'BrandCoherentHero.tsx'), 'utf8');
const INDEX_HTML = readFileSync(resolve(__dirname, '../../../../index.html'), 'utf8');

const featuredId = /const FEATURED_POSTO_ID = '([^']+)'/.exec(HERO_SOURCE)?.[1] ?? '';

describe('Hero home: il posto in copertina regge la parola «Provato»', () => {
  it('punta a un posto che esiste nel registro', () => {
    expect(featuredId).not.toBe('');
    expect(getContentById(featuredId)).toBeDefined();
  });

  it('non è una scheda in lavorazione', () => {
    expect(getContentById(featuredId)?.isPlaceholder).toBe(false);
  });

  it('ha una cover certificata: un frame dei nostri reel, non un asset journal', () => {
    const cover = getContentById(featuredId)?.cover ?? '';
    expect(cover).toMatch(/^\/images\/reels\/.+\.webp$/);
  });

  it('ha alt e ancora di crop: la foto non entra nel 4:5 tagliata a caso', () => {
    const item = getContentById(featuredId);
    expect(item?.coverAlt).toBeTruthy();
    expect(typeof item?.coverFocusY).toBe('number');
  });

  it('il preload LCP in index.html carica esattamente quella cover', () => {
    const cover = getContentById(featuredId)?.cover ?? '';
    const base = cover.replace(/\.webp$/, '');
    const preload = /<link\s+rel="preload"[^>]*imagesrcset="([^"]+)"/s.exec(INDEX_HTML)?.[1] ?? '';
    expect(preload).toContain(`${base}-320.avif`);
    expect(preload).toContain(`${base}-480.avif`);
    expect(preload).toContain(`${base}-768.avif`);
    expect(preload).toContain(`${base}.avif`);
  });

  it('`imagesizes` del preload è identico a `sizes` dell’immagine', () => {
    const preloadSizes = /imagesizes="([^"]+)"/.exec(INDEX_HTML)?.[1]?.trim() ?? '';
    const heroSizes = /sizes="([^"]+)"/.exec(HERO_SOURCE)?.[1]?.trim() ?? '';
    expect(preloadSizes).not.toBe('');
    expect(heroSizes).toBe(preloadSizes);
  });
});
