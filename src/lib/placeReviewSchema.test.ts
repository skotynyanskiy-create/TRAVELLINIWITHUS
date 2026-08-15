import { describe, expect, it } from 'vitest';
import { buildItemReviewedJsonLd, buildReviewJsonLd } from './placeReviewSchema';
import { getContentById } from '../config/contentLibrary';
import type { ContentItem } from '../types/content';

/**
 * Prima di questo modulo `Posto.tsx` emetteva un `Restaurant` con
 * `name: item.title` (il titolo editoriale) e `url` sul nostro dominio —
 * "noi siamo quel ristorante". Questi test bloccano il regresso sulla forma
 * corretta: `Review` con `itemReviewed`, mai un voto, mai la nostra identità
 * al posto di quella dell'attività.
 */

const BASE_ITEM: ContentItem = {
  id: 'test-posto',
  source: 'instagram',
  permalink: 'https://www.instagram.com/travelliniwithus/reel/xyz/',
  mediaType: 'reel',
  cover: '/images/reels/test-posto-cover.webp',
  hook: 'Vale il viaggio?',
  title: 'Un titolo editoriale diverso dall’insegna',
  description: 'Descrizione editoriale reale: cos’è, quanto costa, per chi vale la pena.',
  place: {
    name: 'Trattoria da Mario',
    city: 'Verona',
    region: 'Veneto',
    country: 'Italia',
    coordinates: { lat: 45.4384, lng: 10.9916 },
  },
  zone: 'Italia',
  types: ['Food & Ristoranti'],
  partnership: { kind: 'organic' },
  isPlaceholder: false,
};

describe('buildItemReviewedJsonLd — l’attività recensita, mai noi', () => {
  it('usa l’insegna reale (place.name), non il titolo editoriale', () => {
    const itemReviewed = buildItemReviewedJsonLd(BASE_ITEM);
    expect(itemReviewed.name).toBe('Trattoria da Mario');
    expect(itemReviewed.name).not.toBe(BASE_ITEM.title);
  });

  it('mappa il tipo canonical sullo @type schema.org corretto', () => {
    expect(buildItemReviewedJsonLd(BASE_ITEM)['@type']).toBe('Restaurant');
    expect(buildItemReviewedJsonLd({ ...BASE_ITEM, types: ['Hotel con carattere'] })['@type']).toBe(
      'LodgingBusiness'
    );
    expect(buildItemReviewedJsonLd({ ...BASE_ITEM, types: ['Insolito'] })['@type']).toBe(
      'TouristAttraction'
    );
  });

  it('non contiene mai un url che punti a noi (nessun campo url senza place.website)', () => {
    const itemReviewed = buildItemReviewedJsonLd(BASE_ITEM);
    expect(itemReviewed.url).toBeUndefined();
  });

  it('usa place.website come url solo quando il dato esiste davvero', () => {
    const withWebsite = buildItemReviewedJsonLd({
      ...BASE_ITEM,
      place: { ...BASE_ITEM.place, website: 'https://trattoriadamario.example' },
    });
    expect(withWebsite.url).toBe('https://trattoriadamario.example');
  });

  it('non emette mai sameAs: nessun link Maps costruito per euristica', () => {
    const itemReviewed = buildItemReviewedJsonLd(BASE_ITEM);
    expect(itemReviewed.sameAs).toBeUndefined();
  });

  it('omette address/geo che il dato non ha, senza inventare valori', () => {
    const noCoords = buildItemReviewedJsonLd({
      ...BASE_ITEM,
      place: { name: 'Posto senza coordinate', country: 'Italia' },
    }) as { geo?: unknown; address: { addressLocality: string; addressRegion: string } };
    expect(noCoords.geo).toBeUndefined();
    expect(noCoords.address.addressLocality).toBe('');
    expect(noCoords.address.addressRegion).toBe('');
  });

  /* Il caso opposto di prima: fino al 2026-08-15 questi due test verificavano
     che `offers` ci fosse e dichiarasse il venditore. Ora verificano che non ci
     sia affatto — l'offerta commerciale non entra nell'`itemReviewed` di un
     `Review` di prima parte, nemmeno dichiarata bene. */
  it('con un deal collegato, offers NON entra nello schema editoriale', () => {
    const withDeal = buildItemReviewedJsonLd({
      ...BASE_ITEM,
      deal: {
        kind: 'code',
        url: 'https://trattoriadamario.example/promo',
        code: 'TRAVELLINI',
        provider: 'Trattoria da Mario',
        validUntil: '2027-01-31',
      },
    });
    expect(withDeal.offers).toBeUndefined();
  });

  it('senza deal, nessun campo offers viene inventato', () => {
    expect(buildItemReviewedJsonLd(BASE_ITEM).offers).toBeUndefined();
  });
});

describe('buildReviewJsonLd — recensiamo, non possediamo', () => {
  it('emette @type Review con author Organization, mai Restaurant come nodo principale', () => {
    const jsonLd = buildReviewJsonLd(BASE_ITEM, BASE_ITEM.description);
    expect(jsonLd['@type']).toBe('Review');
    expect(jsonLd.author).toEqual({ '@type': 'Organization', name: 'Travelliniwithus' });
  });

  it('non contiene mai reviewRating né aggregateRating: nessun voto auto-prodotto', () => {
    const jsonLd = buildReviewJsonLd(BASE_ITEM, BASE_ITEM.description);
    expect(jsonLd.reviewRating).toBeUndefined();
    expect(jsonLd.aggregateRating).toBeUndefined();
  });

  it('annida itemReviewed con l’insegna reale, non il titolo editoriale', () => {
    const jsonLd = buildReviewJsonLd(BASE_ITEM, BASE_ITEM.description) as {
      itemReviewed: { name: string; '@type': string };
    };
    expect(jsonLd.itemReviewed.name).toBe('Trattoria da Mario');
    expect(jsonLd.itemReviewed['@type']).toBe('Restaurant');
  });

  it('include datePublished solo quando publishedAt esiste sul dato', () => {
    expect(buildReviewJsonLd(BASE_ITEM, 'x').datePublished).toBeUndefined();
    expect(buildReviewJsonLd({ ...BASE_ITEM, publishedAt: '2026-01-16' }, 'x').datePublished).toBe(
      '2026-01-16'
    );
  });

  it('usa esattamente il reviewBody passato, senza riscriverlo', () => {
    const jsonLd = buildReviewJsonLd(BASE_ITEM, 'Testo editoriale specifico di questo blocco.');
    expect(jsonLd.reviewBody).toBe('Testo editoriale specifico di questo blocco.');
  });
});

describe('buildReviewJsonLd — sanity check su un posto reale del registro', () => {
  it('per "verona-bbq-magi" (title diverso da place.name) usa comunque l’insegna', () => {
    const item = getContentById('verona-bbq-magi');
    expect(item).toBeDefined();
    if (!item) return;
    expect(item.title).not.toBe(item.place.name);

    const jsonLd = buildReviewJsonLd(item, item.description) as {
      itemReviewed: { name: string };
    };
    expect(jsonLd.itemReviewed.name).toBe(item.place.name);
    expect(jsonLd.itemReviewed.name).not.toBe(item.title);
  });
});
