import { describe, it, expect } from 'vitest';
import { BACINO_SORPRESA, prossimaSorpresa } from './sorprendimi';

describe('bacino della sorpresa', () => {
  it('contiene solo posti con reel, scheda verificata e coordinate', () => {
    expect(BACINO_SORPRESA.length).toBeGreaterThan(0);
    for (const { item, reel } of BACINO_SORPRESA) {
      expect(item.isPlaceholder).toBe(false);
      expect(item.place.coordinates).toBeTruthy();
      expect(reel.postoId).toBe(item.id);
    }
  });

  it('non contiene doppioni', () => {
    const ids = BACINO_SORPRESA.map((c) => c.item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('prossimaSorpresa', () => {
  it('restituisce un posto del bacino e lo segna come visto', () => {
    const esito = prossimaSorpresa([], () => 0);
    expect(esito).not.toBeNull();
    expect(esito!.visti).toEqual([esito!.sorpresa.item.id]);
  });

  it('non ripete finché il giro non è finito', () => {
    let visti: string[] = [];
    const usciti: string[] = [];
    for (let i = 0; i < BACINO_SORPRESA.length; i++) {
      const esito = prossimaSorpresa(visti, () => 0)!;
      usciti.push(esito.sorpresa.item.id);
      visti = esito.visti;
    }
    expect(new Set(usciti).size).toBe(BACINO_SORPRESA.length);
  });

  it('riparte da capo quando il giro è finito, invece di bloccarsi', () => {
    const tutti = BACINO_SORPRESA.map((c) => c.item.id);
    const esito = prossimaSorpresa(tutti, () => 0);
    expect(esito).not.toBeNull();
    // La lista dei visti si azzera e riparte dal solo posto appena estratto.
    expect(esito!.visti).toEqual([esito!.sorpresa.item.id]);
  });

  it('regge un indice fuori scala senza restituire undefined', () => {
    const esito = prossimaSorpresa([], () => 999);
    expect(esito!.sorpresa.item).toBeTruthy();
  });

  it('ogni posto del bacino ha una descrizione da mostrare', () => {
    for (const { item } of BACINO_SORPRESA) {
      expect(item.description?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });
});
