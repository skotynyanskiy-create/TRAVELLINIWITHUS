/**
 * Travel filter system for the magazine platform.
 * Used across destination finder, itinerary archive, search and quiz.
 */

// --- Content types ---

export const CONTENT_TYPES = [
  'pillar',
  'guide',
  'itinerary',
  'hotel-review',
  'food-guide',
  'resource',
  'product',
  'case-study',
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  pillar: 'Guida completa',
  guide: 'Guida pratica',
  itinerary: 'Itinerario',
  'hotel-review': 'Dove dormire',
  'food-guide': 'Food guide',
  resource: 'Risorsa',
  product: 'Prodotto',
  'case-study': 'Case study',
};

// --- Travel style ---

export const TRAVEL_STYLES = [
  'Coppia',
  'Avventura',
  'Relax',
  'Cultura',
  'Weekend',
  'Road Trip',
  'Budget',
] as const;

export type TravelStyle = (typeof TRAVEL_STYLES)[number];

// --- Duration ---

export const DURATION_RANGES = [
  '1-3 giorni',
  '4-7 giorni',
  '1-2 settimane',
  '2+ settimane',
] as const;

export type DurationRange = (typeof DURATION_RANGES)[number];

// --- Season ---

export const SEASONS = ['Primavera', 'Estate', 'Autunno', 'Inverno', "Tutto l'anno"] as const;

export type Season = (typeof SEASONS)[number];

// --- Budget ---

export const BUDGET_BANDS = ['€', '€€', '€€€'] as const;

export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const BUDGET_LABELS: Record<BudgetBand, string> = {
  '€': 'Economico',
  '€€': 'Medio',
  '€€€': 'Alto',
};

// --- Filter state ---

export interface TravelFilters {
  style?: TravelStyle;
  duration?: DurationRange;
  season?: Season;
  budget?: BudgetBand;
  country?: string;
  contentType?: ContentType;
}

// --- Slug helpers ---

function normalizeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugifyTravelStyle(value: string) {
  return normalizeSlug(value);
}

export function slugifyDuration(value: string) {
  return normalizeSlug(value);
}

export function slugifySeason(value: string) {
  return normalizeSlug(value);
}

export function getTravelStyleFromQuery(rawValue: string | null): TravelStyle | null {
  if (!rawValue) return null;
  return TRAVEL_STYLES.find((s) => slugifyTravelStyle(s) === rawValue) ?? null;
}

export function getDurationFromQuery(rawValue: string | null): DurationRange | null {
  if (!rawValue) return null;
  return DURATION_RANGES.find((d) => slugifyDuration(d) === rawValue) ?? null;
}

export function getSeasonFromQuery(rawValue: string | null): Season | null {
  if (!rawValue) return null;
  return SEASONS.find((s) => slugifySeason(s) === rawValue) ?? null;
}
