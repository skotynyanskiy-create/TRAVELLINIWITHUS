import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { TYPES } from '@/src/config/contentTaxonomy';
import type { ContentItem } from '@/src/types/content';

const GRID_SIZE = 9;

function isEligible(item: ContentItem, excluded: Set<string>): boolean {
  return !item.isPlaceholder && Boolean(item.cover?.trim()) && !excluded.has(item.id);
}

// featured prima, poi il più recente (publishedAt ISO, confrontabile come stringa),
// poi id come tiebreak finale — così l'ordine non dipende mai dalla posizione
// nell'array del JSON.
function compareItems(a: ContentItem, b: ContentItem): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  const aDate = a.publishedAt ?? '';
  const bDate = b.publishedAt ?? '';
  if (aDate !== bDate) return aDate > bDate ? -1 : 1;
  return a.id.localeCompare(b.id);
}

export interface HomeGridSelection {
  items: ContentItem[];
  /** id dell'item da rendere come tile grande, o null se nessuno selezionato. */
  featuredId: string | null;
}

/** Seleziona fino a 9 posti per la griglia home: il migliore di ciascuna
 *  categoria presente tra i verificati, poi i più recenti non ancora usati
 *  a riempire gli slot restanti. Deterministico, senza duplicati, e si
 *  auto-aggiorna quando i placeholder diventano reali. */
export function selectHomeGridItems(
  pool: ContentItem[] = CONTENT_ITEMS,
  size = GRID_SIZE,
  excludeIds: readonly string[] = [],
  priorityIds: readonly string[] = []
): HomeGridSelection {
  const excluded = new Set(excludeIds);
  const eligible = pool.filter((item) => isEligible(item, excluded));
  const used = new Set<string>();
  const winners: ContentItem[] = [];

  // Quando la selezione editoriale non ha un blocco dedicato, i suoi posti
  // restano visibili nella griglia prima di completare le categorie.
  for (const id of priorityIds) {
    if (winners.length >= size || used.has(id)) continue;
    const priorityItem = eligible.find((item) => item.id === id);
    if (priorityItem) {
      winners.push(priorityItem);
      used.add(priorityItem.id);
    }
  }

  for (const type of TYPES) {
    if (winners.length >= size) break;
    const best = eligible
      .filter((item) => !used.has(item.id) && item.types.includes(type))
      .sort(compareItems)[0];
    if (best) {
      winners.push(best);
      used.add(best.id);
    }
  }

  if (winners.length < size) {
    const fill = eligible
      .filter((item) => !used.has(item.id))
      .sort(compareItems)
      .slice(0, size - winners.length);
    winners.push(...fill);
  }

  const items = winners.slice(0, size).sort(compareItems);
  const featuredId = items.find((item) => item.featured)?.id ?? null;

  return { items, featuredId };
}
