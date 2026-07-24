import type { FamilyCategory, FamilyEntry } from '../types/family';
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

/** Entry con offerta/codice reale — alimentano la vetrina /family/shop. */
export function getFamilyDeals(): FamilyEntry[] {
  return getFamilyEntries().filter((item) => Boolean(item.deal));
}
