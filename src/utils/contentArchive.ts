import type { NormalizedArticle } from './articleData';
import { DESTINATION_GROUPS } from '../config/contentTaxonomy';
import type { ArticleData } from '../components/article';

type PreviewLike = ArticleData & { id: string; slug: string; excerpt?: string };

export interface ArchiveItem {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  link: string;
  category: string;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  location: string;
  destinationGroup: string;
  experienceTypes: string[];
  primaryExperience?: string;
  period?: string;
  budget?: string;
  duration?: string;
}

export function getDestinationGroup(article: Pick<NormalizedArticle, 'country' | 'continent'>) {
  if (article.country === 'Italia') {
    return 'Italia';
  }

  if (article.continent && DESTINATION_GROUPS.includes(article.continent as (typeof DESTINATION_GROUPS)[number])) {
    return article.continent;
  }

  return article.country || article.continent || 'Altro';
}

export function mapArticleToArchiveItem(article: NormalizedArticle): ArchiveItem {
  const experienceTypes = article.experienceTypes || [];

  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || article.description,
    image: article.image,
    link: `/articolo/${article.slug || article.id}`,
    category: article.category,
    country: article.country,
    region: article.region,
    city: article.city,
    continent: article.continent,
    location: article.location,
    destinationGroup: getDestinationGroup(article),
    experienceTypes,
    primaryExperience: experienceTypes[0],
    period: article.period,
    budget: article.budget,
    duration: article.duration,
  };
}

export function mapPreviewToArchiveItem(
  preview: PreviewLike,
  experienceTypes: string[] = [],
): ArchiveItem {
  const locationStr = preview.location || '';
  const isItaly = /italia/i.test(locationStr);
  const continent = preview.continent;
  const destinationGroup = isItaly
    ? 'Italia'
    : continent && DESTINATION_GROUPS.includes(continent as (typeof DESTINATION_GROUPS)[number])
      ? continent
      : 'Altro';
  const country = isItaly ? 'Italia' : undefined;

  return {
    id: preview.id,
    title: preview.title,
    excerpt: preview.excerpt || preview.description,
    image: preview.image,
    link: `/articolo/${preview.slug}`,
    category: preview.category,
    country,
    continent,
    location: locationStr,
    destinationGroup,
    experienceTypes,
    primaryExperience: experienceTypes[0],
    period: preview.period,
    budget: preview.budget,
    duration: preview.duration,
  };
}

export function getArchiveLocationLabel(
  item: Pick<ArchiveItem, 'country' | 'region' | 'city' | 'destinationGroup'>
) {
  if (item.country === 'Italia') {
    return [item.region, item.city].filter(Boolean).join(' / ') || 'Italia';
  }

  return [item.country, item.city].filter(Boolean).join(' / ') || item.destinationGroup;
}
