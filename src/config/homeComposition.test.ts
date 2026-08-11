import { describe, expect, it } from 'vitest';
import { compositionFor } from './homeComposition';

describe('home composition for Viaggiatori', () => {
  it('uses one places collection without a separate featured section', () => {
    expect(compositionFor('viaggiatori').sections).toEqual([
      'grid',
      'map',
      'reels',
      'method',
      'index',
    ]);
  });

  it.each(['weekend-romantici', 'fuori-rotta', 'mangiare-e-dormire'] as const)(
    'keeps the same rule for the %s interest',
    (interest) => {
      const sections = compositionFor('viaggiatori', interest).sections;

      expect(sections).not.toContain('featured');
      expect(sections).toContain('grid');
    }
  );

  it('allinea la CTA Brand al bisogno scelto', () => {
    expect(compositionFor('brand', 'vedere-i-format').voice.cta).toEqual({
      label: 'Esplora i format',
      to: '/collaborazioni#collaboration-formats',
    });
  });

  it('ignora un interesse appartenente a un pubblico diverso', () => {
    expect(compositionFor('brand', 'fuori-rotta')).toEqual(compositionFor('brand'));
  });
});

describe('home composition for Brand', () => {
  it("la CTA parla della lingua della pagina d'arrivo, non promette un download", () => {
    expect(compositionFor('brand').voice.cta.label).toBe('Richiedi il media kit');
  });
});
