import type { ArticleType } from '../components/article';
import type { GuideCategory } from '../config/contentTaxonomy';

export type PublicArticleSection = 'guide' | 'itinerari' | 'reportage';

export const ITINERARY_GUIDE_CATEGORIES: readonly GuideCategory[] = [
  'Itinerari completi',
  'Weekend & Day trip',
];

const ITINERARY_CATEGORIES = new Set<string>(ITINERARY_GUIDE_CATEGORIES);

export const GUIDE_LIBRARY_CATEGORIES: readonly GuideCategory[] = [
  'Consigli pratici',
  'Cosa portare',
  'Food guide',
  'Dove dormire',
  'Budget & Costi',
  'Pianificazione',
];

// Reportage: racconti editoriali, non guide pratiche. Usati nel hub /diario per
// distinguere dal contenuto utility. La category in Firestore deve matchare
// uno di questi valori esatti perche un articolo finisca in /reportage.
export const REPORTAGE_CATEGORIES: readonly string[] = [
  'Diario di viaggio',
  'Reportage',
  'Storia personale',
];

const REPORTAGE_SET = new Set<string>(REPORTAGE_CATEGORIES);

interface PublicArticleLike {
  id?: string;
  slug?: string;
  category?: string;
  type?: ArticleType;
}

export function getPublicArticleSection(
  article: Pick<PublicArticleLike, 'category' | 'type'>
): PublicArticleSection {
  if (article.type === 'itinerary') {
    return 'itinerari';
  }

  const category = article.category?.trim() || '';

  if (REPORTAGE_SET.has(category)) {
    return 'reportage';
  }

  if (ITINERARY_CATEGORIES.has(category)) {
    return 'itinerari';
  }

  return 'guide';
}

export function getPublicArticleCollectionPath(
  article: Pick<PublicArticleLike, 'category' | 'type'>
) {
  return `/${getPublicArticleSection(article)}`;
}

export function getPublicArticlePath(article: PublicArticleLike) {
  const slug = article.slug || article.id;

  if (!slug) {
    return getPublicArticleCollectionPath(article);
  }

  return `${getPublicArticleCollectionPath(article)}/${slug}`;
}

export function isItineraryCategory(category?: string) {
  return ITINERARY_CATEGORIES.has(category?.trim() || '');
}

export function matchesPublicArticleSection(
  section: PublicArticleSection,
  article: Pick<PublicArticleLike, 'category' | 'type'>
) {
  return getPublicArticleSection(article) === section;
}

export function getPublicSectionLabel(section: PublicArticleSection) {
  if (section === 'itinerari') return 'Itinerari';
  if (section === 'reportage') return 'Reportage';
  return 'Guide';
}

export function getLegacyArticlePath(slug: string) {
  return `/articolo/${slug}`;
}
