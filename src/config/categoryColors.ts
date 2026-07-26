/**
 * Mappa `ContentType` → colore-categoria (CSS var). Fonte unica per la home
 * "Atlante Vivo": category rail, pezzo forte, striscia reel. I tipi non mappati
 * (es. "Posti particolari") cadono su un neutro onesto — nessun colore forzato.
 *
 * I colori vivono SOLO nel contenuto (bordi, icone, chip): il testo resta
 * `--color-ink` per il contrasto WCAG. Vedi i token `--color-cat-*` in
 * `src/index.css`.
 */
import type { ContentType } from './contentTaxonomy';

export const CAT_COLOR: Partial<Record<ContentType, string>> = {
  'Food & Ristoranti': 'var(--color-cat-food)',
  Insolito: 'var(--color-cat-insolito)',
  'Relax, terme e spa': 'var(--color-cat-relax)',
  "Borghi e città d'arte": 'var(--color-cat-borghi)',
  'Passeggiate panoramiche': 'var(--color-cat-panoramiche)',
};

/** Label breve per la chiave-colore della riga-indice (i tipi lunghi wrappano male in uppercase 10px). */
export const CAT_SHORT_LABEL: Partial<Record<ContentType, string>> = {
  'Food & Ristoranti': 'Food',
  Insolito: 'Insolito',
  'Relax, terme e spa': 'Relax',
  "Borghi e città d'arte": 'Borghi',
  'Passeggiate panoramiche': 'Panorami',
};

/** Colore-categoria per un tipo, con fallback neutro per i tipi non mappati. */
export function catColor(type?: ContentType): string {
  return (type && CAT_COLOR[type]) || 'var(--color-muted-fg-2)';
}
