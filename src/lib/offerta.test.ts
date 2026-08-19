import { describe, expect, it, vi, afterEach } from 'vitest';
import { offertaAttiva, offertaScaduta } from './offerta';

/**
 * La regola che il conteggio family e la card devono condividere. Nasce da un
 * difetto in attesa: `getFamilyDeals()` contava su `Boolean(deal)` mentre la
 * card non renderizzava le scadute — il giorno della prima scadenza il sito
 * avrebbe promesso codici sopra uno scaffale vuoto.
 */
afterEach(() => vi.useRealTimers());

function conOggi(data: string, prova: () => void) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(data));
  prova();
}

describe('offertaScaduta', () => {
  it('vale per tutto il giorno dichiarato, non fino alla sua mezzanotte iniziale', () => {
    conOggi('2026-12-31T18:00:00', () => {
      expect(offertaScaduta('2026-12-31')).toBe(false);
    });
  });

  it('è scaduta il giorno dopo', () => {
    conOggi('2027-01-01T00:30:00', () => {
      expect(offertaScaduta('2026-12-31')).toBe(true);
    });
  });

  it('senza data non scade', () => {
    expect(offertaScaduta(undefined)).toBe(false);
  });

  it('con una data illeggibile mostra invece di sopprimere', () => {
    expect(offertaScaduta('non-una-data')).toBe(false);
  });
});

describe('offertaAttiva', () => {
  it('un’offerta assente non è attiva', () => {
    expect(offertaAttiva(undefined)).toBe(false);
    expect(offertaAttiva(null)).toBe(false);
  });

  it('un’offerta scaduta non è attiva — è il difetto che questo file esiste per impedire', () => {
    conOggi('2027-01-01T00:30:00', () => {
      expect(offertaAttiva({ validUntil: '2026-12-31' })).toBe(false);
    });
  });

  it('un’offerta valida è attiva', () => {
    conOggi('2026-06-01T12:00:00', () => {
      expect(offertaAttiva({ validUntil: '2026-12-31' })).toBe(true);
    });
  });
});
