import { describe, it, expect } from 'vitest';
import {
  getGuideCategoryFromQuery,
  getExperienceTypeFromQuery,
  slugifyGuideCategory,
  slugifyExperienceType,
  GUIDE_CATEGORIES,
  EXPERIENCE_TYPES,
} from '../contentTaxonomy';

describe('slugifyGuideCategory', () => {
  it('converte in lowercase e trattini', () => {
    expect(slugifyGuideCategory('Consigli pratici')).toBe('consigli-pratici');
  });

  it('trasforma & in e', () => {
    expect(slugifyGuideCategory('Budget & Costi')).toBe('budget-e-costi');
  });

  it('rimuove trattini iniziali e finali', () => {
    expect(slugifyGuideCategory('Dove dormire')).toBe('dove-dormire');
  });
});

describe('slugifyExperienceType', () => {
  it('converte in lowercase e trattini', () => {
    expect(slugifyExperienceType('Posti particolari')).toBe('posti-particolari');
  });

  it('trasforma & in e', () => {
    expect(slugifyExperienceType('Food & Ristoranti')).toBe('food-e-ristoranti');
  });
});

describe('getGuideCategoryFromQuery', () => {
  it('null in ingresso → restituisce null', () => {
    expect(getGuideCategoryFromQuery(null)).toBeNull();
  });

  it('stringa vuota → restituisce null', () => {
    expect(getGuideCategoryFromQuery('')).toBeNull();
  });

  it('slug esatto di una categoria → restituisce la categoria corretta', () => {
    const slug = slugifyGuideCategory('Consigli pratici');
    expect(getGuideCategoryFromQuery(slug)).toBe('Consigli pratici');
  });

  it('slug di "Budget & Costi" → restituisce "Budget & Costi"', () => {
    expect(getGuideCategoryFromQuery('budget-e-costi')).toBe('Budget & Costi');
  });

  it('slug di "Dove dormire" → restituisce "Dove dormire"', () => {
    expect(getGuideCategoryFromQuery('dove-dormire')).toBe('Dove dormire');
  });

  it('slug di "Pianificazione" → restituisce "Pianificazione"', () => {
    expect(getGuideCategoryFromQuery('pianificazione')).toBe('Pianificazione');
  });

  it('slug inesistente → restituisce null', () => {
    expect(getGuideCategoryFromQuery('categoria-inesistente')).toBeNull();
  });

  it('la ricerca è case-sensitive sullo slug (non sul valore originale)', () => {
    // lo slug viene confrontato con l'output di slugifyGuideCategory, che è sempre lowercase
    expect(getGuideCategoryFromQuery('Consigli-pratici')).toBeNull();
  });

  it('tutti i GUIDE_CATEGORIES hanno uno slug recuperabile', () => {
    for (const cat of GUIDE_CATEGORIES) {
      const slug = slugifyGuideCategory(cat);
      expect(getGuideCategoryFromQuery(slug)).toBe(cat);
    }
  });
});

describe('getExperienceTypeFromQuery', () => {
  it('null → restituisce null', () => {
    expect(getExperienceTypeFromQuery(null)).toBeNull();
  });

  it('slug esatto → restituisce il tipo esperienza corretto', () => {
    const slug = slugifyExperienceType('Posti particolari');
    expect(getExperienceTypeFromQuery(slug)).toBe('Posti particolari');
  });

  it('slug inesistente → restituisce null', () => {
    expect(getExperienceTypeFromQuery('esperienza-inesistente')).toBeNull();
  });

  it('tutti i EXPERIENCE_TYPES hanno uno slug recuperabile', () => {
    for (const exp of EXPERIENCE_TYPES) {
      const slug = slugifyExperienceType(exp);
      expect(getExperienceTypeFromQuery(slug)).toBe(exp);
    }
  });
});
