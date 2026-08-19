import { describe, it, expect } from 'vitest';
import { buildArticleJsonLd, buildBreadcrumbListJsonLd, buildFaqPageJsonLd } from './seo';
import { SITE_URL } from '../config/site';

const BASE_ARTICLE = {
  slug: 'tre-giorni-salento',
  title: 'Tre giorni in Salento ad agosto in coppia',
  excerpt: 'Guida pratica al Salento in estate: dove dormire, mangiare e cosa evitare.',
  coverImage: '/images/articles/salento-cover.webp',
  publishedAt: '2026-07-15T08:00:00.000Z',
  category: 'Guide',
};

describe('buildArticleJsonLd', () => {
  it('returns @type Article', () => {
    const ld = buildArticleJsonLd(BASE_ARTICLE);
    expect(ld['@type']).toBe('Article');
  });

  it('slices headline to max 110 characters', () => {
    const longTitle = 'A'.repeat(120);
    const ld = buildArticleJsonLd({ ...BASE_ARTICLE, title: longTitle });
    expect(ld.headline.length).toBeLessThanOrEqual(110);
  });

  it('makes relative cover image absolute', () => {
    const ld = buildArticleJsonLd(BASE_ARTICLE);
    expect(ld.image[0]).toMatch(/^https?:\/\//);
    expect(ld.image[0]).toContain(SITE_URL);
  });

  it('keeps already-absolute cover image unchanged', () => {
    const abs = 'https://cdn.example.com/img.webp';
    const ld = buildArticleJsonLd({ ...BASE_ARTICLE, coverImage: abs });
    expect(ld.image[0]).toBe(abs);
  });

  it('sets inLanguage to it-IT', () => {
    const ld = buildArticleJsonLd(BASE_ARTICLE);
    expect(ld.inLanguage).toBe('it-IT');
  });

  it('publisher is Travelliniwithus', () => {
    const ld = buildArticleJsonLd(BASE_ARTICLE);
    expect(ld.publisher.name).toBe('Travelliniwithus');
  });
});

describe('buildBreadcrumbListJsonLd', () => {
  const items = [
    { name: 'Home', url: '/' },
    { name: 'Guide', url: '/esplora?format=guida' },
    { name: 'Salento', url: '/articolo/tre-giorni-salento' },
  ];

  it('returns @type BreadcrumbList', () => {
    const ld = buildBreadcrumbListJsonLd(items);
    expect(ld['@type']).toBe('BreadcrumbList');
  });

  it('positions are 1-based', () => {
    const ld = buildBreadcrumbListJsonLd(items);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
    expect(ld.itemListElement[2].position).toBe(3);
  });

  it('makes relative item URLs absolute', () => {
    const ld = buildBreadcrumbListJsonLd(items);
    ld.itemListElement.forEach((el) => {
      expect(el.item).toMatch(/^https?:\/\//);
    });
  });

  it('leaves already-absolute URLs intact', () => {
    const abs = [{ name: 'External', url: 'https://external.com/page' }];
    const ld = buildBreadcrumbListJsonLd(abs);
    expect(ld.itemListElement[0].item).toBe('https://external.com/page');
  });
});

describe('buildFaqPageJsonLd', () => {
  const items = [
    { question: 'Quanto costa dormire nel Salento ad agosto?', answer: 'Tra 90 e 140€ a notte.' },
    {
      question: "Serve l'auto per girare il Salento?",
      answer: 'Sì, i borghi sono lontani tra loro.',
    },
  ];

  it('returns @type FAQPage with one Question/Answer per item', () => {
    const ld = buildFaqPageJsonLd(items) as {
      '@type': string;
      mainEntity: Array<{
        '@type': string;
        name: string;
        acceptedAnswer: { '@type': string; text: string };
      }>;
    };
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]['@type']).toBe('Question');
    expect(ld.mainEntity[0].name).toBe(items[0].question);
    expect(ld.mainEntity[0].acceptedAnswer).toEqual({
      '@type': 'Answer',
      text: items[0].answer,
    });
  });

  it('drops items with an empty answer but keeps the ones with real text', () => {
    const withEmpty = [...items, { question: 'Domanda senza risposta?', answer: '   ' }];
    const ld = buildFaqPageJsonLd(withEmpty) as { mainEntity: unknown[] };
    expect(ld.mainEntity).toHaveLength(2);
  });

  it('returns null when no item has a real answer', () => {
    const ld = buildFaqPageJsonLd([{ question: 'Domanda?', answer: '' }]);
    expect(ld).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(buildFaqPageJsonLd([])).toBeNull();
  });
});
