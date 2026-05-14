/**
 * Lightweight recommendations engine.
 *
 * Tracks reading history in localStorage and scores candidate articles by
 * category/continent overlap. Pure client-side, no backend, no schema change.
 * Consumed by RelatedArticles to bubble up articles aligned with the reader's
 * recent interests.
 */

const STORAGE_KEY = 'twu_reading_history';
const HISTORY_LIMIT = 20;
const HISTORY_TTL_DAYS = 60;

export interface ReadingHistoryEntry {
  slug: string;
  category?: string;
  continent?: string;
  ts: number;
}

interface ScorableArticle {
  id: string;
  category?: string;
  continent?: string;
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: ReadingHistoryEntry[] = JSON.parse(raw);
    const cutoff = Date.now() - HISTORY_TTL_DAYS * 24 * 60 * 60 * 1000;
    return parsed.filter((entry) => entry && typeof entry.ts === 'number' && entry.ts > cutoff);
  } catch {
    return [];
  }
}

export function recordArticleRead(entry: Omit<ReadingHistoryEntry, 'ts'>): void {
  if (!isBrowser() || !entry.slug) return;
  try {
    const history = getReadingHistory().filter((e) => e.slug !== entry.slug);
    history.unshift({ ...entry, ts: Date.now() });
    const truncated = history.slice(0, HISTORY_LIMIT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(truncated));
  } catch {
    // silent: localStorage may be full or blocked
  }
}

export function scoreArticles<T extends ScorableArticle>(
  articles: T[],
  history: ReadingHistoryEntry[] = getReadingHistory()
): T[] {
  if (!history.length) return articles;

  const categoryCount = new Map<string, number>();
  const continentCount = new Map<string, number>();
  for (const entry of history) {
    if (entry.category)
      categoryCount.set(entry.category, (categoryCount.get(entry.category) ?? 0) + 1);
    if (entry.continent)
      continentCount.set(entry.continent, (continentCount.get(entry.continent) ?? 0) + 1);
  }

  return [...articles].sort((a, b) => {
    const aScore =
      (a.category ? (categoryCount.get(a.category) ?? 0) : 0) * 2 +
      (a.continent ? (continentCount.get(a.continent) ?? 0) : 0);
    const bScore =
      (b.category ? (categoryCount.get(b.category) ?? 0) : 0) * 2 +
      (b.continent ? (continentCount.get(b.continent) ?? 0) : 0);
    return bScore - aScore;
  });
}
