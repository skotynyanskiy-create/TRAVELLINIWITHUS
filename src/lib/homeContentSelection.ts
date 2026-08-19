import { CONTENT_ITEMS } from '../config/contentLibrary';
import { rankByInterest, type InterestId } from '../config/audienceInterests';
import type { ContentItem } from '../types/content';

export const CURATED_IDS = [
  'novara-emotional-grand-motel',
  'ravenna-better-sushi',
  'londra-warner-bros-studio-harry-potter',
] as const;

function compareRecency(a: ContentItem, b: ContentItem): number {
  const byDate = (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '');
  return byDate || a.id.localeCompare(b.id);
}

/**
 * La home parte sempre da posti verificati con cover. L'interesse riordina il
 * catalogo, mentre la curatela manuale resta un fallback per non perdere la
 * varietà editoriale quando non c'è ancora una scelta personale.
 */
export function selectHomeFeaturedItems(
  interest: InterestId | null | undefined,
  pool: readonly ContentItem[] = CONTENT_ITEMS,
  size = 3
): ContentItem[] {
  const eligible = pool.filter((item) => !item.isPlaceholder && Boolean(item.cover?.trim()));
  const ranked = rankByInterest(eligible, interest, (item) => item.types);
  const curated = CURATED_IDS.map((id) => eligible.find((item) => item.id === id)).filter(
    (item): item is ContentItem => Boolean(item)
  );
  const ordered = interest ? ranked : [...curated, ...eligible.sort(compareRecency)];
  const seen = new Set<string>();

  return ordered.filter((item) => !seen.has(item.id) && Boolean(seen.add(item.id))).slice(0, size);
}
