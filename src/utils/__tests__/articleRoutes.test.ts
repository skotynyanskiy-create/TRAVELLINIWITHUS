import { describe, it, expect } from 'vitest';
import {
  getPublicArticlePath,
  getPublicArticleSection,
  getPublicArticleCollectionPath,
  getLegacyArticlePath,
  isItineraryCategory,
  matchesPublicArticleSection,
} from '../articleRoutes';

describe('getPublicArticleSection', () => {
  it('type itinerary → sezione itinerari', () => {
    expect(getPublicArticleSection({ type: 'itinerary' })).toBe('itinerari');
  });

  it('type pillar → sezione guide (nessuna categoria speciale)', () => {
    expect(getPublicArticleSection({ type: 'pillar', category: 'Consigli pratici' })).toBe('guide');
  });

  it('type guide → sezione guide', () => {
    expect(getPublicArticleSection({ type: 'guide', category: 'Food guide' })).toBe('guide');
  });

  it('categoria "Itinerari completi" → sezione itinerari (anche senza type)', () => {
    expect(getPublicArticleSection({ category: 'Itinerari completi' })).toBe('itinerari');
  });

  it('categoria "Weekend & Day trip" → sezione itinerari', () => {
    expect(getPublicArticleSection({ category: 'Weekend & Day trip' })).toBe('itinerari');
  });

  it('categoria sconosciuta senza type → fallback guide', () => {
    expect(getPublicArticleSection({ category: 'Categoria inesistente' })).toBe('guide');
  });

  it('type itinerary ha priorità sulla categoria non-itinerary', () => {
    expect(getPublicArticleSection({ type: 'itinerary', category: 'Food guide' })).toBe(
      'itinerari'
    );
  });
});

describe('getPublicArticleCollectionPath', () => {
  it('pillar → /guide', () => {
    expect(getPublicArticleCollectionPath({ type: 'pillar' })).toBe('/guide');
  });

  it('itinerary → /itinerari', () => {
    expect(getPublicArticleCollectionPath({ type: 'itinerary' })).toBe('/itinerari');
  });
});

describe('getPublicArticlePath', () => {
  it('guide con slug → /guide/:slug', () => {
    expect(getPublicArticlePath({ type: 'guide', slug: 'costa-amalfitana' })).toBe(
      '/guide/costa-amalfitana'
    );
  });

  it('itinerary con slug → /itinerari/:slug', () => {
    expect(getPublicArticlePath({ type: 'itinerary', slug: 'tre-giorni-sicilia' })).toBe(
      '/itinerari/tre-giorni-sicilia'
    );
  });

  it('pillar con slug → /guide/:slug', () => {
    expect(getPublicArticlePath({ type: 'pillar', slug: 'guida-giappone' })).toBe(
      '/guide/guida-giappone'
    );
  });

  it('senza slug fallback su id', () => {
    expect(getPublicArticlePath({ type: 'guide', id: 'abc123' })).toBe('/guide/abc123');
  });

  it('senza slug né id → restituisce solo il collection path', () => {
    expect(getPublicArticlePath({ type: 'guide' })).toBe('/guide');
  });

  it('slug ha priorità su id', () => {
    expect(getPublicArticlePath({ type: 'guide', slug: 'my-slug', id: 'my-id' })).toBe(
      '/guide/my-slug'
    );
  });
});

describe('getLegacyArticlePath', () => {
  it('restituisce il path legacy /articolo/:slug', () => {
    expect(getLegacyArticlePath('vecchio-slug')).toBe('/articolo/vecchio-slug');
  });
});

describe('isItineraryCategory', () => {
  it('categoria itinerario → true', () => {
    expect(isItineraryCategory('Itinerari completi')).toBe(true);
  });

  it('categoria guide → false', () => {
    expect(isItineraryCategory('Food guide')).toBe(false);
  });

  it('valore undefined → false', () => {
    expect(isItineraryCategory(undefined)).toBe(false);
  });

  it('whitespace attorno al valore → viene trimmato correttamente', () => {
    expect(isItineraryCategory('  Itinerari completi  ')).toBe(true);
  });
});

describe('matchesPublicArticleSection', () => {
  it('articolo guide corrisponde alla sezione guide', () => {
    expect(matchesPublicArticleSection('guide', { type: 'guide' })).toBe(true);
  });

  it('articolo itinerary non corrisponde alla sezione guide', () => {
    expect(matchesPublicArticleSection('guide', { type: 'itinerary' })).toBe(false);
  });
});
