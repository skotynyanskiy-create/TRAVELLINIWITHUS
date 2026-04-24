import { describe, it, expect } from 'vitest';
import { normalizeFirestoreArticle } from '../articleData';

// Helper: crea un record Firestore minimale valido
function makeRecord(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    title: 'Articolo di test',
    slug: 'articolo-di-test',
    excerpt: 'Un articolo di prova per il test suite.',
    content: 'Contenuto di esempio.',
    coverImage: '/images/test.jpg',
    category: 'Food guide',
    published: true,
    ...overrides,
  };
}

describe('normalizeFirestoreArticle — featuredPlacement', () => {
  it('home-flagship viene preservato come featuredPlacement', () => {
    const article = normalizeFirestoreArticle(
      'id-1',
      makeRecord({ featuredPlacement: 'home-flagship' })
    );
    expect(article.featuredPlacement).toBe('home-flagship');
  });

  it('hub-destination viene preservato', () => {
    const article = normalizeFirestoreArticle(
      'id-2',
      makeRecord({ featuredPlacement: 'hub-destination' })
    );
    expect(article.featuredPlacement).toBe('hub-destination');
  });

  it('hub-experience viene preservato', () => {
    const article = normalizeFirestoreArticle(
      'id-3',
      makeRecord({ featuredPlacement: 'hub-experience' })
    );
    expect(article.featuredPlacement).toBe('hub-experience');
  });

  it('valore non valido → featuredPlacement è null', () => {
    const article = normalizeFirestoreArticle(
      'id-4',
      makeRecord({ featuredPlacement: 'valore-inventato' })
    );
    expect(article.featuredPlacement).toBeNull();
  });

  it('assente → featuredPlacement è null', () => {
    const article = normalizeFirestoreArticle('id-5', makeRecord());
    expect(article.featuredPlacement).toBeNull();
  });
});

describe('normalizeFirestoreArticle — type', () => {
  it('type "pillar" viene mantenuto', () => {
    const article = normalizeFirestoreArticle('id-6', makeRecord({ type: 'pillar' }));
    expect(article.type).toBe('pillar');
  });

  it('type "itinerary" viene mantenuto', () => {
    const article = normalizeFirestoreArticle('id-7', makeRecord({ type: 'itinerary' }));
    expect(article.type).toBe('itinerary');
  });

  it('type "article" legacy → normalizzato a "guide"', () => {
    const article = normalizeFirestoreArticle('id-8', makeRecord({ type: 'article' }));
    expect(article.type).toBe('guide');
  });

  it('type invalido con categoria "Itinerari completi" → itinerary', () => {
    const article = normalizeFirestoreArticle(
      'id-9',
      makeRecord({ type: 'sconosciuto', category: 'Itinerari completi' })
    );
    expect(article.type).toBe('itinerary');
  });

  it('type assente con categoria normale → guide come default', () => {
    const article = normalizeFirestoreArticle('id-10', makeRecord({ type: undefined }));
    expect(article.type).toBe('guide');
  });
});

describe('normalizeFirestoreArticle — slug e id', () => {
  it('usa lo slug dal documento quando presente', () => {
    const article = normalizeFirestoreArticle('doc-id', makeRecord({ slug: 'slug-esplicito' }));
    expect(article.slug).toBe('slug-esplicito');
  });

  it('fallback su id del documento quando slug è assente', () => {
    const record = makeRecord();
    delete record.slug;
    const article = normalizeFirestoreArticle('fallback-id', record);
    expect(article.slug).toBe('fallback-id');
    expect(article.id).toBe('fallback-id');
  });
});

describe('normalizeFirestoreArticle — budgetBand', () => {
  it('budgetBand esplicita "Medio" viene mantenuta', () => {
    const article = normalizeFirestoreArticle('id-11', makeRecord({ budgetBand: 'Medio' }));
    expect(article.budgetBand).toBe('Medio');
  });

  it('budgetBand inferita da campo budget con parola "lusso" → Alto', () => {
    const article = normalizeFirestoreArticle(
      'id-12',
      makeRecord({ budgetBand: undefined, budget: 'Viaggio di lusso' })
    );
    expect(article.budgetBand).toBe('Alto');
  });

  it('budgetBand inferita da budget con "econom" → Economico', () => {
    const article = normalizeFirestoreArticle(
      'id-13',
      makeRecord({ budgetBand: undefined, budget: 'Viaggio economico' })
    );
    expect(article.budgetBand).toBe('Economico');
  });

  it('budgetBand invalida → undefined', () => {
    const article = normalizeFirestoreArticle(
      'id-14',
      makeRecord({ budgetBand: 'Misterioso', budget: '' })
    );
    expect(article.budgetBand).toBeUndefined();
  });
});

describe('normalizeFirestoreArticle — disclosureType', () => {
  it('valore canonico "affiliate" viene mantenuto', () => {
    const article = normalizeFirestoreArticle('id-15', makeRecord({ disclosureType: 'affiliate' }));
    expect(article.disclosureType).toBe('affiliate');
  });

  it('legacy "Ospitati" → gifted', () => {
    const article = normalizeFirestoreArticle('id-16', makeRecord({ disclosureType: 'Ospitati' }));
    expect(article.disclosureType).toBe('gifted');
  });

  it('legacy "Viaggio personale" → none', () => {
    const article = normalizeFirestoreArticle(
      'id-17',
      makeRecord({ disclosureType: 'Viaggio personale' })
    );
    expect(article.disclosureType).toBe('none');
  });

  it('valore sconosciuto → undefined', () => {
    const article = normalizeFirestoreArticle('id-18', makeRecord({ disclosureType: 'qualcosa' }));
    expect(article.disclosureType).toBeUndefined();
  });
});

describe('normalizeFirestoreArticle — cover image fallback', () => {
  it('usa coverImage se presente', () => {
    const article = normalizeFirestoreArticle(
      'id-19',
      makeRecord({ coverImage: '/images/cover.jpg', image: '/images/thumb.jpg' })
    );
    expect(article.coverImage).toBe('/images/cover.jpg');
  });

  it('fallback su image se coverImage mancante', () => {
    const record = makeRecord({ image: '/images/thumb.jpg' });
    delete record.coverImage;
    const article = normalizeFirestoreArticle('id-20', record);
    expect(article.coverImage).toBe('/images/thumb.jpg');
  });

  it('fallback su immagine di default se entrambe mancanti', () => {
    const record = makeRecord();
    delete record.coverImage;
    delete record.image;
    const article = normalizeFirestoreArticle('id-21', record);
    expect(article.coverImage).toBe('/images/hero-amalfi.png');
  });
});
