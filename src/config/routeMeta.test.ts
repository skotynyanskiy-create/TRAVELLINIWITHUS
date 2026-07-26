import { describe, it, expect } from 'vitest';
import { STATIC_ROUTE_META, ogSlugForPath, findRouteMeta } from './routeMeta';
import { sitemapPaths } from './surfaces';
import seed from '../data/content-seed.json';

/**
 * L'invariante che conta: ogni rotta che dichiariamo a Google deve avere meta
 * proprie a build time. Se manca, quella pagina serve lo shell generico e la
 * card social e vuota — il difetto che `generate-route-html.js` esiste per
 * chiudere.
 */
describe('routeMeta — copertura delle rotte del sitemap', () => {
  it('ogni rotta statica del sitemap ha una voce in STATIC_ROUTE_META', () => {
    const missing = sitemapPaths().filter((path) => !findRouteMeta(path));
    expect(missing, `rotte senza meta: ${missing.join(', ')}`).toEqual([]);
  });

  it('non dichiara meta per rotte che non sono nel sitemap', () => {
    const inSitemap = new Set(sitemapPaths());
    const orphans = STATIC_ROUTE_META.map((e) => e.path).filter((p) => !inSitemap.has(p));
    expect(orphans, `meta orfane: ${orphans.join(', ')}`).toEqual([]);
  });
});

describe('routeMeta — qualita delle voci', () => {
  it('title e description non sono vuoti', () => {
    for (const entry of STATIC_ROUTE_META) {
      expect(entry.title.trim(), entry.path).not.toBe('');
      expect(entry.description.trim(), entry.path).not.toBe('');
    }
  });

  it('ogni description sta entro il limite utile per la SERP', () => {
    const tooLong = STATIC_ROUTE_META.filter((e) => e.description.length > 200).map(
      (e) => `${e.path} (${e.description.length})`
    );
    expect(tooLong, `description oltre 200 caratteri: ${tooLong.join(', ')}`).toEqual([]);
  });

  it('nessun title porta un suffisso di brand manuale', () => {
    // `fullTitle()` in generate-route-html.js e `SEO.tsx` aggiungono
    // "| Travelliniwithus". Un suffisso scritto a mano produce il doppione
    // "… | Travellini Family | Travelliniwithus".
    const withSuffix = STATIC_ROUTE_META.filter((e) => /\|\s*Travellini/i.test(e.title)).map(
      (e) => `${e.path} → "${e.title}"`
    );
    expect(withSuffix, `title con suffisso manuale: ${withSuffix.join(', ')}`).toEqual([]);
  });

  it('i path sono unici', () => {
    const paths = STATIC_ROUTE_META.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('gli slug OG sono unici — due rotte non possono condividere la stessa card', () => {
    const slugs = STATIC_ROUTE_META.map((e) => ogSlugForPath(e.path));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('ogSlugForPath', () => {
  it('mappa la home su "home" e appiattisce i path annidati', () => {
    expect(ogSlugForPath('/')).toBe('home');
    expect(ogSlugForPath('/family/consigli')).toBe('family-consigli');
    expect(ogSlugForPath('/esplora')).toBe('esplora');
  });
});

/** Solo i campi che questi test leggono: il seed completo vive in ContentItem. */
interface SeedEntry {
  id: string;
  isPlaceholder?: boolean;
  cover?: string;
  place?: { coordinates?: { lat?: number; lng?: number } };
}

const entries = seed as unknown as SeedEntry[];
const realEntries = entries.filter((item) => !item.isPlaceholder);

describe('pagine-posto — solo contenuto verificato', () => {
  it('i posti reali hanno tutti coordinate e cover, cioe sono emettibili', () => {
    expect(realEntries.length).toBeGreaterThan(0);
    for (const item of realEntries) {
      expect(item.place?.coordinates?.lat, item.id).toBeTypeOf('number');
      expect(item.place?.coordinates?.lng, item.id).toBeTypeOf('number');
      expect(String(item.cover || '').trim(), item.id).not.toBe('');
    }
  });

  it('nessun placeholder finisce fra i posti emessi', () => {
    expect(realEntries.some((item) => item.isPlaceholder)).toBe(false);
  });
});
