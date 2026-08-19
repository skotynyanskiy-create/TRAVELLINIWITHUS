import { describe, expect, it } from 'vitest';
import {
  getAudienceHomePath,
  getAudienceInterests,
  getMapTypeForInterest,
  rankByInterest,
  rankFamilyByInterest,
} from './audienceInterests';

describe('audience interests', () => {
  it('keeps three valid, audience-specific choices for every public', () => {
    expect(getAudienceInterests('viaggiatori')).toHaveLength(3);
    expect(getAudienceInterests('family')).toHaveLength(3);
    expect(getAudienceInterests('brand')).toHaveLength(3);
  });

  it('ranks matching travel content first without discarding the catalog', () => {
    const ranked = rankByInterest(
      [
        { id: 'food', types: ['Food & Ristoranti'] },
        { id: 'unusual', types: ['Insolito'] },
        { id: 'weekend', types: ['Weekend romantici'] },
      ],
      'fuori-rotta',
      (item) => item.types
    );

    expect(ranked.map((item) => item.id)).toEqual(['unusual', 'food', 'weekend']);
  });

  it('ranks family advice by the selected moment without hiding other real advice', () => {
    const ranked = rankFamilyByInterest(
      [
        { id: 'pregnancy', category: 'gravidanza' as const },
        { id: 'packing', category: 'zaino-family' as const },
      ],
      'essenziali-family'
    );

    expect(ranked.map((item) => item.id)).toEqual(['packing', 'pregnancy']);
  });

  it('maps audiences and compatible map filters to stable public routes', () => {
    expect(getAudienceHomePath('viaggiatori')).toBe('/');
    expect(getAudienceHomePath('family')).toBe('/family');
    expect(getAudienceHomePath('brand')).toBe('/collaborazioni');
    expect(getMapTypeForInterest('fuori-rotta')).toBe('insolito');
  });
});
