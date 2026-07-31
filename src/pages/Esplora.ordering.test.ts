import { describe, expect, it } from 'vitest';
import { partitionRealFirst } from './Esplora';
import { CONTENT_ITEMS } from '../config/contentLibrary';

/**
 * Guardia di non-regressione per il difetto segnalato dall'owner: la mappa e
 * la home ordinavano già i posti reali prima dei placeholder
 * (getMapPinItems/getRegistroItems in contentLibrary.ts), ma Esplora no —
 * mostrava schede in lavorazione mescolate senza criterio a quelle verificate.
 */
describe('partitionRealFirst', () => {
  it("separa reali e placeholder mantenendo l'ordine relativo interno di ciascun gruppo", () => {
    const items = [
      { id: 'a', isPlaceholder: true },
      { id: 'b', isPlaceholder: false },
      { id: 'c', isPlaceholder: true },
      { id: 'd', isPlaceholder: false },
    ];
    const { real, placeholder } = partitionRealFirst(items);
    expect(real.map((i) => i.id)).toEqual(['b', 'd']);
    expect(placeholder.map((i) => i.id)).toEqual(['a', 'c']);
  });

  it('non perde e non duplica elementi', () => {
    const items = [
      { id: 'a', isPlaceholder: true },
      { id: 'b', isPlaceholder: false },
    ];
    const { real, placeholder } = partitionRealFirst(items);
    expect(real.length + placeholder.length).toBe(items.length);
  });

  it("sul catalogo reale, unendo reali+placeholder nell'ordine reali-prima, il primo item è sempre verificato quando esiste almeno un reale", () => {
    const { real, placeholder } = partitionRealFirst(CONTENT_ITEMS);
    expect(real.length).toBeGreaterThan(0);
    expect(placeholder.length).toBeGreaterThan(0);
    const ordered = [...real, ...placeholder];
    expect(ordered[0].isPlaceholder).toBe(false);
    expect(ordered[ordered.length - 1].isPlaceholder).toBe(true);
  });
});
