import type { FamilyCategory, FamilyEntry } from '../types/family';
import { offertaAttiva } from '../lib/offerta';
import seed from '../data/family-content-seed.json';

/**
 * Libreria contenuti Travellini Family — fonte unica per /family/*.
 * Popolata dal seed JSON, alimentato SOLO da import reale di @travellinifamily
 * (pipeline reel). Separata da `contentLibrary` (posti travel): vedi
 * `src/types/family.ts` per la motivazione.
 */
export const FAMILY_ITEMS: FamilyEntry[] = seed as unknown as FamilyEntry[];

/** Consigli pubblicabili, dal più recente. */
export function getFamilyEntries(): FamilyEntry[] {
  return FAMILY_ITEMS.filter((item) => !item.isPlaceholder).sort((a, b) =>
    (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
  );
}

export function getFamilyByCategory(category: FamilyCategory): FamilyEntry[] {
  return getFamilyEntries().filter((item) => item.category === category);
}

/**
 * Entry con offerta/codice **attivo** — alimentano la vetrina /family/shop.
 *
 * Attivo, non solo presente: prima qui bastava `Boolean(item.deal)`, mentre
 * `DealCard` non renderizza le scadute. Il giorno della prima scadenza il
 * conteggio avrebbe promesso codici sopra uno scaffale vuoto.
 */
export function getFamilyDeals(): FamilyEntry[] {
  return getFamilyEntries().filter((item) => offertaAttiva(item.deal));
}
