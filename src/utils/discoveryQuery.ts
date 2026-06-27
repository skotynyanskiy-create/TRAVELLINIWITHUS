/**
 * Singolo parser/builder canonical per i filtri Esplora.
 *
 * Param URL canonical:
 *   ?zone=Italia
 *   ?type=posti-particolari
 *   ?format=guida
 *   ?period=estate
 *   ?budget=medio
 *   ?duration=weekend
 *   ?q=puglia
 *
 * Legge anche i param legacy (group/area/region, experience, cat, search)
 * per supportare i redirect lato client dai vecchi URL.
 */

import type { ArchiveItem } from './contentArchive';
import {
  FORMATS,
  TYPES,
  ZONES,
  getBudgetFromQuery,
  getDurationFromQuery,
  getFormatFromQuery,
  getPeriodFromQuery,
  getTypeFromQuery,
  getZoneFromQuery,
  mapLegacyFormat,
  mapLegacyType,
  slugifyFormat,
  slugifyType,
  type Budget,
  type ContentFormat,
  type ContentType,
  type Duration,
  type Period,
  type Zone,
} from '../config/contentTaxonomy';

export interface DiscoveryFilters {
  zone?: Zone | null;
  type?: ContentType | null;
  format?: ContentFormat | null;
  period?: Period | null;
  budget?: Budget | null;
  duration?: Duration | null;
  search?: string | null;
}

export interface DiscoveryUrlTargets {
  explore: string;
  map: string;
}

export function parseDiscoveryFilters(params: URLSearchParams): DiscoveryFilters {
  // Legge canonical + legacy. I redirect /destinazioni → /esplora useranno
  // questo per tradurre i vecchi link.
  const zoneRaw = params.get('zone') || params.get('group') || params.get('region');
  const typeRaw = params.get('type') || params.get('experience');
  const formatRaw = params.get('format') || params.get('cat');
  const searchRaw = params.get('q') || params.get('search') || params.get('searchQuery');

  return {
    zone: getZoneFromQuery(zoneRaw),
    type: getTypeFromQuery(typeRaw) ?? mapLegacyType(typeRaw),
    format: getFormatFromQuery(formatRaw) ?? mapLegacyFormat(formatRaw),
    period: getPeriodFromQuery(params.get('period')),
    budget: getBudgetFromQuery(params.get('budget')),
    duration: getDurationFromQuery(params.get('duration')),
    search: searchRaw?.trim() || null,
  };
}

export function sanitizeDiscoveryFilters(filters: DiscoveryFilters): DiscoveryFilters {
  return {
    zone: filters.zone ?? null,
    type: filters.type ?? null,
    format: filters.format ?? null,
    period: filters.period ?? null,
    budget: filters.budget ?? null,
    duration: filters.duration ?? null,
    search: filters.search?.trim() || null,
  };
}

export function hasAnyFilter(filters: DiscoveryFilters): boolean {
  return Boolean(
    filters.zone ||
    filters.type ||
    filters.format ||
    filters.period ||
    filters.budget ||
    filters.duration ||
    (filters.search && filters.search.trim())
  );
}

export function filterByScope(items: ArchiveItem[], filters: DiscoveryFilters): ArchiveItem[] {
  const search = filters.search?.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.zone && item.destinationGroup !== filters.zone) return false;
    if (filters.type && !item.experienceTypes.includes(filters.type)) return false;
    if (filters.format) {
      // ArchiveItem ha `category` come stringa libera (es. "Guide", "Posti
      // particolari", "Itinerari completi"). Mappiamo al format canonical
      // per filtrare in modo coerente.
      const itemFormat = mapLegacyFormat(item.category) ?? getFormatFromQuery(item.category);
      if (itemFormat !== filters.format) return false;
    }
    if (filters.period && item.period !== filters.period) return false;
    if (filters.budget && item.budget !== filters.budget) return false;
    if (filters.duration && item.duration !== filters.duration) return false;
    if (
      search &&
      !item.title.toLowerCase().includes(search) &&
      !item.location.toLowerCase().includes(search) &&
      !item.category.toLowerCase().includes(search) &&
      !item.experienceTypes.some((experience) => experience.toLowerCase().includes(search)) &&
      !(item.excerpt ?? '').toLowerCase().includes(search)
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
  if (filters.zone) params.set('zone', filters.zone);
  if (filters.type) params.set('type', slugifyType(filters.type));
  if (filters.format) params.set('format', slugifyFormat(filters.format));
  if (filters.period) params.set('period', filters.period.toLowerCase());
  if (filters.budget) params.set('budget', filters.budget.toLowerCase());
  if (filters.duration) params.set('duration', filters.duration.toLowerCase());
  if (filters.search) params.set('q', filters.search);
  return params.toString();
}

export function buildPathWithFilters(pathname: string, filters: DiscoveryFilters): string {
  const query = buildFilterQuery(filters);
  return query ? `${pathname}?${query}` : pathname;
}

export function buildExploreUrl(filters: DiscoveryFilters = {}): string {
  return buildPathWithFilters('/esplora', filters);
}

export function buildMapUrl(
  filters: Partial<Pick<DiscoveryFilters, 'zone' | 'type'>> = {}
): string {
  const params = new URLSearchParams();
  if (filters.zone) params.set('zone', filters.zone);
  if (filters.type) params.set('type', slugifyType(filters.type));
  const qs = params.toString();
  return qs ? `/mappa?${qs}` : '/mappa';
}

export function buildDiscoveryTargets(filters: DiscoveryFilters): DiscoveryUrlTargets {
  const shared = sanitizeDiscoveryFilters(filters);
  return {
    explore: buildExploreUrl(shared),
    map: buildMapUrl({ zone: shared.zone ?? undefined, type: shared.type ?? undefined }),
  };
}

export function isGuideItem(item: ArchiveItem): boolean {
  const cat = (item.category || '').toLowerCase();
  if (cat.startsWith('guid')) return true;
  const mapped = mapLegacyFormat(item.category);
  return mapped === 'Guida' || mapped === 'Lista pratica';
}

// ─── Re-export delle costanti canonical per i consumer ─────────────────────

export { ZONES, TYPES, FORMATS };
