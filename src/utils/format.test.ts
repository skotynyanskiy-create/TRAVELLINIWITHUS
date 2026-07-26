import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';

// Intl separa numero e simbolo con uno spazio non-breaking (NBSP/narrow):
// normalizziamo a spazio normale così l'assert non dipende dal carattere ICU.
const norm = (s: string) => s.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('formats 5.9 as "5,90 €" in it-IT locale', () => {
    expect(norm(formatPrice(5.9))).toBe('5,90 €');
  });

  it('formats integers with two decimal places', () => {
    expect(norm(formatPrice(10))).toBe('10,00 €');
  });

  it('formats zero correctly', () => {
    expect(norm(formatPrice(0))).toBe('0,00 €');
  });

  it('formats a larger amount', () => {
    // Il separatore di migliaia it-IT (punto) c'è solo con ICU completo:
    // in ambienti small-icu può mancare, quindi accetta entrambe le forme.
    expect(norm(formatPrice(1234.56))).toMatch(/^1\.?234,56 €$/);
  });

  it('respects a currency override', () => {
    const result = norm(formatPrice(9.99, 'USD'));
    expect(result).toContain('9,99');
    // it-IT rende USD come "USD"; alcune ICU usano il simbolo "US$".
    expect(result).toMatch(/USD|US\$/);
  });
});
