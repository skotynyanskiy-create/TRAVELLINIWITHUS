import { describe, it, expect } from 'vitest';
import { validateArticle } from '../articleValidator';
import type { NormalizedArticle } from '../articleData';

// Articolo pillar che supera tutti i controlli obbligatori
const PILLAR_VALIDO: Partial<NormalizedArticle> = {
  title: 'Guida completa al Giappone: tutto quello che devi sapere',
  slug: 'guida-giappone-completa',
  description:
    'La guida definitiva per viaggiare in Giappone: itinerari, budget, dove dormire e consigli pratici per un viaggio indimenticabile.',
  content:
    '## Introduzione\n\n' +
    'Parole '.repeat(200) +
    '\n\n## Dove dormire\n\n' +
    'Parole '.repeat(200) +
    '\n\n## Budget e Costi\n\n' +
    'Parole '.repeat(200) +
    '\n\n## Itinerario consigliato\n\n' +
    'Parole '.repeat(200) +
    '\n\n## Quando andare\n\n' +
    'Parole '.repeat(200),
  type: 'pillar',
  coverImage: '/images/giappone-hero.jpg',
  author: 'Rodrigo',
  category: 'Consigli pratici',
  disclosureType: 'none',
  verifiedAt: { toDate: () => new Date(), seconds: 0, nanoseconds: 0 } as never,
  hotels: [
    {
      name: 'Hotel Tokyo Palace',
      image: '/images/hotel-tokyo.jpg',
      bookingUrl: 'https://booking.com/hotel-tokyo',
      rating: 4.5,
      priceHint: '€€€',
    },
  ],
  budgetBand: 'Medio',
  tripIntents: ['Cultura', 'Avventura'],
};

// Articolo guide (non-pillar) minimale valido
const GUIDE_VALIDA: Partial<NormalizedArticle> = {
  title: 'I migliori ristoranti di Napoli: food guide completa',
  slug: 'ristoranti-napoli-guida',
  description:
    'Una selezione curata dei migliori ristoranti di Napoli con indirizzi, prezzi e consigli pratici per mangiar bene in città.',
  content:
    '## Dove mangiare\n\n' +
    'Parole '.repeat(150) +
    '\n\n## Centro storico\n\n' +
    'Parole '.repeat(150) +
    '\n\n## Quartieri Spagnoli\n\n' +
    'Parole '.repeat(150),
  type: 'guide',
  coverImage: '/images/napoli-food.jpg',
  author: 'Betta',
  category: 'Food guide',
  disclosureType: 'affiliate',
  verifiedAt: { toDate: () => new Date(), seconds: 0, nanoseconds: 0 } as never,
  budgetBand: 'Economico',
  tripIntents: ['Food'],
};

describe('validateArticle — pillar valido', () => {
  it('non produce errori bloccanti', () => {
    const report = validateArticle(PILLAR_VALIDO);
    const errors = report.issues.filter((i) => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('ok è true quando non ci sono errori', () => {
    const report = validateArticle(PILLAR_VALIDO);
    expect(report.ok).toBe(true);
  });

  it('stats.wordCount riflette il contenuto', () => {
    const report = validateArticle(PILLAR_VALIDO);
    expect(report.stats.wordCount).toBeGreaterThan(0);
  });

  it('stats.hasHero è true con coverImage impostata', () => {
    const report = validateArticle(PILLAR_VALIDO);
    expect(report.stats.hasHero).toBe(true);
  });
});

describe('validateArticle — pillar senza verifiedAt', () => {
  it('produce un errore sul campo verifiedAt', () => {
    const article: Partial<NormalizedArticle> = { ...PILLAR_VALIDO, verifiedAt: undefined };
    const report = validateArticle(article);
    const err = report.issues.find((i) => i.field === 'verifiedAt' && i.severity === 'error');
    expect(err).toBeDefined();
  });

  it('ok è false perché manca verifiedAt', () => {
    const article: Partial<NormalizedArticle> = { ...PILLAR_VALIDO, verifiedAt: undefined };
    expect(validateArticle(article).ok).toBe(false);
  });
});

describe('validateArticle — pillar senza hotel', () => {
  it('produce un errore content per hotel mancanti', () => {
    const article: Partial<NormalizedArticle> = { ...PILLAR_VALIDO, hotels: undefined };
    const report = validateArticle(article);
    const err = report.issues.find(
      (i) => i.field === 'content' && i.severity === 'error' && i.message.includes('hotel')
    );
    expect(err).toBeDefined();
  });

  it('ok è false quando la pillar non ha hotel', () => {
    const article: Partial<NormalizedArticle> = { ...PILLAR_VALIDO, hotels: undefined };
    expect(validateArticle(article).ok).toBe(false);
  });
});

describe('validateArticle — guide senza hotel', () => {
  it('non produce errori per hotel mancanti (hotel è pillar-only)', () => {
    const report = validateArticle(GUIDE_VALIDA);
    const hotelErrors = report.issues.filter(
      (i) => i.severity === 'error' && i.message.toLowerCase().includes('hotel')
    );
    expect(hotelErrors).toHaveLength(0);
  });
});

describe('validateArticle — disclosure mancante', () => {
  it('produce errore su disclosureType quando non impostata', () => {
    const article: Partial<NormalizedArticle> = { ...GUIDE_VALIDA, disclosureType: undefined };
    const report = validateArticle(article);
    const err = report.issues.find((i) => i.field === 'disclosureType' && i.severity === 'error');
    expect(err).toBeDefined();
  });
});

describe('validateArticle — titolo mancante', () => {
  it('produce errore bloccante quando il titolo è vuoto', () => {
    const article: Partial<NormalizedArticle> = { ...GUIDE_VALIDA, title: '' };
    const report = validateArticle(article);
    const err = report.issues.find((i) => i.field === 'title' && i.severity === 'error');
    expect(err).toBeDefined();
    expect(report.ok).toBe(false);
  });
});

describe('validateArticle — slug invalido', () => {
  it('produce errore per slug con caratteri maiuscoli o spazi', () => {
    const article: Partial<NormalizedArticle> = { ...GUIDE_VALIDA, slug: 'Slug Non Valido' };
    const report = validateArticle(article);
    const err = report.issues.find((i) => i.field === 'slug' && i.severity === 'error');
    expect(err).toBeDefined();
  });
});

describe('validateArticle — cover image mancante', () => {
  it('produce errore media quando coverImage e image sono entrambe vuote', () => {
    const article: Partial<NormalizedArticle> = {
      ...GUIDE_VALIDA,
      coverImage: '',
      image: '',
    };
    const report = validateArticle(article);
    const err = report.issues.find((i) => i.field === 'media' && i.severity === 'error');
    expect(err).toBeDefined();
  });
});
