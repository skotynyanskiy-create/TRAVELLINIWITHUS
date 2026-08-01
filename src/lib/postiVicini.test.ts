import { describe, it, expect } from 'vitest';
import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { getCoordinates } from '@/src/utils/geo';
import { postiVicini, formattaDistanza, RAGGIO_DINTORNI_KM } from './postiVicini';

const REALI = CONTENT_ITEMS.filter((i) => !i.isPlaceholder && getCoordinates(i));

describe('postiVicini', () => {
  it('non restituisce mai il posto stesso', () => {
    for (const posto of REALI) {
      expect(postiVicini(posto).some((v) => v.item.id === posto.id)).toBe(false);
    }
  });

  it('restituisce solo schede verificate', () => {
    for (const posto of REALI) {
      for (const vicino of postiVicini(posto)) {
        expect(vicino.item.isPlaceholder).toBe(false);
      }
    }
  });

  it('resta dentro il raggio dichiarato', () => {
    for (const posto of REALI) {
      for (const vicino of postiVicini(posto)) {
        expect(vicino.distanzaKm).toBeLessThanOrEqual(RAGGIO_DINTORNI_KM);
      }
    }
  });

  it('ordina dal più vicino al più lontano', () => {
    for (const posto of REALI) {
      const distanze = postiVicini(posto).map((v) => v.distanzaKm);
      expect(distanze).toEqual([...distanze].sort((a, b) => a - b));
    }
  });

  it('rispetta il numero massimo richiesto', () => {
    for (const posto of REALI) {
      expect(postiVicini(posto, 3).length).toBeLessThanOrEqual(3);
      expect(postiVicini(posto, 1).length).toBeLessThanOrEqual(1);
    }
  });

  it('è simmetrico: se A vede B a X km, B vede A alla stessa distanza', () => {
    const [primo] = REALI;
    const vicino = postiVicini(primo, 1)[0];
    if (!vicino) return;
    const ritorno = postiVicini(vicino.item, 20).find((v) => v.item.id === primo.id);
    expect(ritorno?.distanzaKm).toBe(vicino.distanzaKm);
  });

  it('copre la maggioranza delle schede — sotto quella soglia la sezione non varrebbe', () => {
    const conVicini = REALI.filter((p) => postiVicini(p).length > 0);
    expect(conVicini.length / REALI.length).toBeGreaterThan(0.7);
  });

  it('torna vuoto, non un riempitivo, per un posto senza coordinate', () => {
    const senzaCoord = { ...REALI[0], place: { ...REALI[0].place, coordinates: undefined } };
    expect(postiVicini(senzaCoord)).toEqual([]);
  });
});

describe('formattaDistanza', () => {
  it('usa la virgola decimale sopra il chilometro', () => {
    expect(formattaDistanza(11.8)).toBe('11,8 km');
  });

  it('passa ai metri sotto il chilometro', () => {
    expect(formattaDistanza(0.5)).toBe('500 m');
  });
});
