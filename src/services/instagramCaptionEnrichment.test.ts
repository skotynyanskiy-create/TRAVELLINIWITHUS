import { describe, expect, it } from 'vitest';
import { enrichFromCaption } from './instagramCaptionEnrichment';
import { enrichInstagramFeed, type InstagramMedia } from './instagramContentAdapter';
import fixture from '../data/instagram-media.fixture.json';

describe('enrichFromCaption — pattern caption reali @travelliniwithus', () => {
  it("normalizza l'hook MAIUSCOLO tra 👇 in sentence-case con ?", () => {
    const e = enrichFromCaption('👇🏻 MIGLIOR SUSHI AYCE ROMA? 👇🏻\n...');
    expect(e.hook).toBe('Miglior sushi ayce roma?');
  });

  it('estrae prezzo e fascia budget', () => {
    expect(enrichFromCaption('... 20,90€ a persona').value).toEqual({
      price: '20,90€',
      budget: 'Medio',
    });
    expect(enrichFromCaption('churros a 8€').value?.budget).toBe('Basso');
    expect(enrichFromCaption('degustazione 75€').value?.budget).toBe('Alto');
  });

  it('riconosce la disclosure ADV per tipo + il partner @handle', () => {
    expect(enrichFromCaption('Pubblicità · In collaborazione con @naturooms').partnership).toEqual({
      kind: 'collaboration',
      partner: '@naturooms',
    });
    expect(enrichFromCaption('Invito dal locale').partnership.kind).toBe('invited');
    expect(enrichFromCaption('nessuna disclosure qui').partnership.kind).toBe('organic');
  });

  it('preserva un hook gia in minuscolo senza forzarlo', () => {
    expect(enrichFromCaption('Una spa nella birra a Praga? 🍺\n...').hook).toBe(
      'Una spa nella birra a Praga?'
    );
  });
});

describe('enrichInstagramFeed — pipeline fixture (token-free)', () => {
  it('mappa + arricchisce la risposta API simulata in ContentItem usabili', () => {
    const items = enrichInstagramFeed(fixture as InstagramMedia[]);
    expect(items).toHaveLength(3);

    const sushi = items[0];
    expect(sushi.source).toBe('instagram');
    expect(sushi.mediaType).toBe('reel');
    expect(sushi.permalink).toContain('instagram.com');
    expect(sushi.hook).toBe('Miglior sushi ayce roma?');
    expect(sushi.value).toEqual({ price: '20,90€', budget: 'Medio' });

    expect(items[1].partnership).toEqual({ kind: 'collaboration', partner: '@naturooms' });
    expect(items[2].partnership).toEqual({ kind: 'organic', partner: '@beerspabernard.prague' });

    // I campi non deducibili dalla caption restano da curare.
    expect(items.every((i) => i.isPlaceholder)).toBe(true);
    expect(sushi.place.name).toBe('');
  });
});
