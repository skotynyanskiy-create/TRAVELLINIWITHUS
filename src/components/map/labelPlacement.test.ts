import { describe, it, expect } from 'vitest';
import { placeLabels, type LabelCandidate } from './labelPlacement';

const c = (
  item: string,
  x: number,
  y: number,
  priority = 0,
  width = 120
): LabelCandidate<string> => ({ item, x, y, priority, width });

describe('placeLabels', () => {
  it('etichetta tutti quando c’è spazio per tutti', () => {
    const { labelled, dots } = placeLabels([c('a', 0, 0), c('b', 400, 300)], 28);
    expect(labelled).toHaveLength(2);
    expect(dots).toHaveLength(0);
  });

  it('degrada a punto chi si sovrappone, senza farlo sparire', () => {
    const { labelled, dots } = placeLabels([c('a', 100, 100), c('b', 110, 105)], 28);
    expect(labelled).toEqual(['a']);
    expect(dots).toEqual(['b']);
  });

  it('non perde mai nessun punto', () => {
    const punti = Array.from({ length: 62 }, (_, i) => c(`id-${i}`, (i * 13) % 300, (i * 7) % 200));
    const { labelled, dots } = placeLabels(punti, 28);
    expect(labelled.length + dots.length).toBe(62);
    expect(new Set([...labelled, ...dots]).size).toBe(62);
  });

  it('la priorità decide chi tiene il nome quando due si contendono lo spazio', () => {
    const { labelled } = placeLabels([c('basso', 100, 100, 1), c('alto', 105, 100, 9)], 28);
    expect(labelled).toEqual(['alto']);
  });

  it('più spazio significa più nomi: è l’effetto dello zoom', () => {
    const vicini = [c('a', 100, 100), c('b', 220, 100), c('c', 340, 100)];
    const lontani = [c('a', 100, 100), c('b', 400, 100), c('c', 700, 100)];
    expect(placeLabels(vicini, 28).labelled.length).toBeLessThan(
      placeLabels(lontani, 28).labelled.length
    );
  });

  it('un nome lungo occupa più spazio e ne scaccia di più', () => {
    const corti = [c('a', 100, 100, 1, 60), c('b', 180, 100, 0, 60)];
    const lunghi = [c('a', 100, 100, 1, 240), c('b', 180, 100, 0, 240)];
    expect(placeLabels(corti, 28).labelled).toHaveLength(2);
    expect(placeLabels(lunghi, 28).labelled).toHaveLength(1);
  });

  it('l’esito non dipende dall’ordine di ingresso', () => {
    const punti = [c('a', 100, 100, 5), c('b', 108, 104, 3), c('z', 500, 400, 1)];
    const dritto = placeLabels(punti, 28);
    const rovescio = placeLabels([...punti].reverse(), 28);
    expect(dritto.labelled).toEqual(rovescio.labelled);
    expect(dritto.dots).toEqual(rovescio.dots);
  });
});
