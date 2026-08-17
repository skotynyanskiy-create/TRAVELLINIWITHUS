import { describe, it, expect } from 'vitest';
import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { getCoordinates } from '@/src/utils/geo';
import { postiVicini, formattaDistanza, RAGGIO_DINTORNI_KM, RAGGIO_DENSO_KM } from './postiVicini';

const REALI = CONTENT_ITEMS.filter((i) => !i.isPlaceholder && getCoordinates(i));

/** Distanza in linea d'aria, la stessa che usa `utils/geo`. */
function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** I candidati veri entro un raggio, come li vedrebbe `postiVicini`. */
function candidatiEntro(posto: (typeof REALI)[number], raggio: number) {
  const centro = getCoordinates(posto)!;
  return REALI.filter(
    (altro) => altro.id !== posto.id && km(centro, getCoordinates(altro)!) <= raggio
  );
}

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

/**
 * I due comportamenti aggiunti il 2026-08-17, dopo che il collaudo a 533 schede
 * ha mostrato i tre slot riempiti da posti intercambiabili. Erano arrivati in
 * produzione senza test: `knip` lo aveva notato per un'altra via, segnalando
 * `RAGGIO_DENSO_KM` come export che nessuno importa.
 */
describe('postiVicini — densità', () => {
  it('non propone due volte la stessa categoria', () => {
    for (const posto of REALI) {
      const categorie = postiVicini(posto).map((v) => v.item.types?.[0] ?? '');
      expect(new Set(categorie).size, `categoria ripetuta su ${posto.id}`).toBe(categorie.length);
    }
  });

  it('stringe il raggio dove i candidati vicini bastano da soli', () => {
    let verificate = 0;
    for (const posto of REALI) {
      if (candidatiEntro(posto, RAGGIO_DENSO_KM).length < 3) continue;
      verificate++;
      for (const vicino of postiVicini(posto)) {
        expect(vicino.distanzaKm, `${posto.id} pesca oltre il raggio stretto`).toBeLessThanOrEqual(
          RAGGIO_DENSO_KM
        );
      }
    }
    /* Se questo arriva a zero il test non sta piu' verificando niente: il seed
       e' cambiato al punto che nessuna scheda ha tre vicini entro 25 km. */
    expect(verificate, 'nessuna scheda densa nel seed: il test non prova nulla').toBeGreaterThan(0);
  });

  it('resta largo dove i vicini sono pochi, invece di svuotare la sezione', () => {
    let sparse = 0;
    for (const posto of REALI) {
      if (candidatiEntro(posto, RAGGIO_DENSO_KM).length >= 3) continue;
      const lontani = candidatiEntro(posto, RAGGIO_DINTORNI_KM);
      if (lontani.length === 0) continue;
      sparse++;
      /* Con almeno un candidato entro i 100 km la sezione deve esistere: e' la
         ragione misurata per cui il raggio largo esiste, e stringerlo ovunque
         l'avrebbe fatta sparire da meta' delle schede. */
      expect(postiVicini(posto).length, `${posto.id} ha perso la sezione`).toBeGreaterThan(0);
    }
    expect(sparse, 'nessuna scheda sparsa nel seed: il test non prova nulla').toBeGreaterThan(0);
  });

  it('mostra tante card quante sono le categorie disponibili, mai un doppione per riempire', () => {
    for (const posto of REALI) {
      const bacinoStretto = candidatiEntro(posto, RAGGIO_DENSO_KM);
      const bacino =
        bacinoStretto.length >= 3 ? bacinoStretto : candidatiEntro(posto, RAGGIO_DINTORNI_KM);
      const categorieDisponibili = new Set(bacino.map((c) => c.types?.[0] ?? '')).size;
      expect(postiVicini(posto).length, `conteggio sbagliato su ${posto.id}`).toBe(
        Math.min(3, categorieDisponibili)
      );
    }
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
