import type { ContentItem } from '../types/content';
import type { ContentType } from './contentTaxonomy';
import seed from '../data/content-seed.json';
import { resolveVideoUrl } from '../utils/mediaUrl';

/**
 * Libreria contenuti "posti particolari" — fonte unica per mappa, destinazioni,
 * esplora e home. Oggi popolata dal seed JSON (geocodato con
 * `npm run geocode:content`); domani dall'API Instagram via
 * `services/instagramContentAdapter.ts` → Firestore.
 */
export const CONTENT_ITEMS: ContentItem[] = (seed as unknown as ContentItem[]).map((item) =>
  item.videoSrc ? { ...item, videoSrc: resolveVideoUrl(item.videoSrc) } : item
);

/** Item con coordinate valide — pronti per i pin della mappa. */
export function getGeocodedContentItems(): ContentItem[] {
  return CONTENT_ITEMS.filter((item) => Boolean(item.place.coordinates));
}

/** Pin per la mappa: prima i posti REALI, poi i placeholder. Stessa regola di
 *  `getRegistroItems` — il seed non è ordinato, quindi tagliare senza ordinare
 *  riempiva la mappa di schede in lavorazione e lasciava fuori i posti
 *  verificati. */
export function getMapPinItems(limit?: number): ContentItem[] {
  const geocoded = CONTENT_ITEMS.filter(
    (item) => item.place?.coordinates?.lat && item.place?.coordinates?.lng
  );
  const ordered = [
    ...geocoded.filter((item) => !item.isPlaceholder),
    ...geocoded.filter((item) => item.isPlaceholder),
  ];
  return limit ? ordered.slice(0, limit) : ordered;
}

/** Item di una zona (Italia/Europa/Asia/...). */
export function getContentByZone(zone: ContentItem['zone']): ContentItem[] {
  return CONTENT_ITEMS.filter((item) => item.zone === zone);
}

/** Item che includono un tipo (Food/Hotel/Insolito/...). */
export function getContentByType(type: ContentItem['types'][number]): ContentItem[] {
  return CONTENT_ITEMS.filter((item) => item.types.includes(type));
}

/** Item di una regione italiana (es. "Toscana") — per /destinazione/:regione. */
export function getContentByRegion(region: string): ContentItem[] {
  return CONTENT_ITEMS.filter((item) => item.place.region?.toLowerCase() === region.toLowerCase());
}

/** Singolo item per slug/id — per /posto/:slug. */
export function getContentById(id: string): ContentItem | undefined {
  return CONTENT_ITEMS.find((item) => item.id === id);
}

/** Item per il registro in home: prima i posti REALI (scheda completa), poi i
 *  `featured` ancora placeholder, poi il resto. Così l'indice apre con ciò che
 *  è davvero verificato e cliccabile, non con schede in lavorazione. */
export function getRegistroItems(limit = 6): ContentItem[] {
  const real = CONTENT_ITEMS.filter((item) => !item.isPlaceholder);
  const featuredPlaceholder = CONTENT_ITEMS.filter((item) => item.isPlaceholder && item.featured);
  const rest = CONTENT_ITEMS.filter((item) => item.isPlaceholder && !item.featured);
  return [...real, ...featuredPlaceholder, ...rest].slice(0, limit);
}

// ─── Intenzioni di viaggio (per le pagine destinazione) ──────────────────────

export type Intention = 'mangiare' | 'dormire' | 'esperienze' | 'vedere';

export const INTENTION_LABEL: Record<Intention, string> = {
  mangiare: 'Mangiare',
  dormire: 'Dormire',
  esperienze: 'Esperienze',
  vedere: 'Vedere & relax',
};

/** Mappa il tipo canonical sull'intenzione mostrata in pagina destinazione. */
const TYPE_TO_INTENTION: Record<ContentType, Intention> = {
  'Food & Ristoranti': 'mangiare',
  'Hotel con carattere': 'dormire',
  Insolito: 'esperienze',
  'Passeggiate panoramiche': 'esperienze',
  'Relax, terme e spa': 'vedere',
  'Posti particolari': 'vedere',
  "Borghi e città d'arte": 'vedere',
  'Weekend romantici': 'vedere',
};

export function getIntention(item: ContentItem): Intention {
  return TYPE_TO_INTENTION[item.types[0]] ?? 'vedere';
}

/** Raggruppa gli item nelle 4 intenzioni (per Mangiare/Dormire/Esperienze/Vedere). */
export function groupByIntention(items: ContentItem[]): Record<Intention, ContentItem[]> {
  const groups: Record<Intention, ContentItem[]> = {
    mangiare: [],
    dormire: [],
    esperienze: [],
    vedere: [],
  };
  for (const item of items) groups[getIntention(item)].push(item);
  return groups;
}

/** Ordine di visualizzazione delle intenzioni. */
export const INTENTION_ORDER: Intention[] = ['mangiare', 'dormire', 'esperienze', 'vedere'];
