import type { ContentItem, PartnershipKind } from './content';

/**
 * Modello dei contenuti Travellini Family — consigli su gravidanza, primi mesi
 * e viaggio in famiglia, derivati SOLO da post/reel reali di @travellinifamily
 * (o dal filone family del profilo travel). Seed separato da `ContentItem`:
 * un consiglio non è un "posto" (niente place/zone) e non deve entrare nei
 * feed discovery travel (/esplora, /mappa).
 */

export type FamilyCategory =
  | 'gravidanza'
  | 'viaggiare-in-gravidanza'
  | 'primi-mesi'
  | 'zaino-family';

export const FAMILY_CATEGORY_LABEL: Record<FamilyCategory, string> = {
  gravidanza: 'Gravidanza',
  'viaggiare-in-gravidanza': 'Viaggiare in gravidanza',
  'primi-mesi': 'Primi mesi',
  'zaino-family': 'Zaino family',
};

export interface FamilyEntry {
  /** ID stabile (slug, es. "volare-in-gravidanza"). */
  id: string;
  /** Titolo editoriale breve. */
  title: string;
  /** Hook a domanda/enunciato, voce R+B. */
  hook: string;
  /** Riassunto di una riga per le card. */
  excerpt: string;
  /** Punti del consiglio (righe reali della caption, ripulite). Mai inventati. */
  body?: string[];
  /** Cover reale (frame/copertina del post). */
  cover: string;
  coverAlt: string;
  /** Focale verticale del crop (0-100): >50 esclude la title-card in alto. */
  coverFocusY?: number;
  category: FamilyCategory;
  /** Trasparenza partnership (AGCOM) — stessa semantica del content travel. */
  partnership: { kind: PartnershipKind; partner?: string };
  /** Offerta/codice sconto reale collegato. Rendered SOLO se presente. */
  deal?: ContentItem['deal'];
  /** Permalink del post Instagram sorgente. */
  sourceUrl: string;
  /** ISO date di pubblicazione del post. */
  publishedAt?: string;
  /** True finché mancano cover o dati reali. */
  isPlaceholder: boolean;
}
