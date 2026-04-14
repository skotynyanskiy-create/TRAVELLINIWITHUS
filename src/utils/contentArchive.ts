import type { NormalizedArticle } from './articleData';
import { DESTINATION_GROUPS } from '../config/contentTaxonomy';

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

export function getArchiveLocationLabel(
  item: Pick<ArchiveItem, 'country' | 'region' | 'city' | 'destinationGroup'>
) {
  if (item.country === 'Italia') {
    return [item.region, item.city].filter(Boolean).join(' / ') || 'Italia';
  }

  return [item.country, item.city].filter(Boolean).join(' / ') || item.destinationGroup;
}
