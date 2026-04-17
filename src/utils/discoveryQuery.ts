import type { ArchiveItem } from './contentArchive';
import {
  EXPERIENCE_TYPES,
  GUIDE_CATEGORIES,
  getExperienceTypeFromQuery,
  slugifyExperienceType,
} from '../config/contentTaxonomy';

export interface DiscoveryFilters {
  group?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  experience?: string | null;
  search?: string | null;
}

export function parseDiscoveryFilters(params: URLSearchParams): DiscoveryFilters {
  const typeParam = params.get('type');
  const experienceParam = params.get('experience');
  return {
    group: params.get('group') || null,
    country: params.get('country') || null,
    region: params.get('region') || params.get('area') || null,
    city: params.get('city') || null,
    experience: getExperienceTypeFromQuery(typeParam) || resolveExperience(experienceParam),
    search: params.get('search') || null,
  };
}

function resolveExperience(raw: string | null): string | null {
  if (!raw) return null;
  const match = EXPERIENCE_TYPES.find(
    (item) => item === raw || slugifyExperienceType(item) === raw.toLowerCase()
  );
  return match || raw;
}

export function filterByScope(items: ArchiveItem[], filters: DiscoveryFilters): ArchiveItem[] {
  const search = filters.search?.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.group && item.destinationGroup !== filters.group) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.region && item.region !== filters.region) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (filters.experience && !item.experienceTypes.includes(filters.experience)) return false;
    if (
      search &&
      !item.title.toLowerCase().includes(search) &&
      !item.location.toLowerCase().includes(search) &&
      !item.category.toLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });
}

export function countByScope(items: ArchiveItem[], filters: DiscoveryFilters): number {
  return filterByScope(items, filters).length;
}

export function buildFilterQuery(filters: DiscoveryFilters): string {
  const params = new URLSearchParams();
  if (filters.group) params.set('group', filters.group);
  if (filters.country) params.set('country', filters.country);
  if (filters.region) params.set('region', filters.region);
  if (filters.city) params.set('city', filters.city);
  if (filters.experience) params.set('type', slugifyExperienceType(filters.experience));
  if (filters.search) params.set('search', filters.search);
  return params.toString();
}

export function isGuideItem(item: ArchiveItem): boolean {
  const cat = (item.category || '').toLowerCase();
  if (cat === 'guide' || cat === 'guida' || cat.startsWith('guide')) return true;

  const inTaxonomy = GUIDE_CATEGORIES.some((c) => {
    const cLower = c.toLowerCase();
    return cLower === cat || item.experienceTypes.some((e) => e.toLowerCase() === cLower);
  });

  return inTaxonomy;
}

export function hasAnyFilter(filters: DiscoveryFilters): boolean {
  return Boolean(
    filters.group ||
    filters.country ||
    filters.region ||
    filters.city ||
    filters.experience ||
    (filters.search && filters.search.trim())
  );
}
