export const DESTINATION_GROUPS = ['Italia', 'Grecia', 'Portogallo'] as const;

export const EXPERIENCE_TYPES = [
  'Food & Ristoranti',
  "Borghi e città d'arte",
  'Hotel con carattere',
  'Weekend romantici',
  'Esperienze insolite',
  'Viaggi di coppia',
] as const;

/**
 * Categorie tematiche del blog Guide di Viaggio.
 * Diverse dalle aree geografiche — identificano il tipo di contenuto editoriale.
 * @deprecated Use TRAVEL_TIP_CATEGORIES for the new magazine architecture.
 * Kept for backward compatibility with existing guide archive.
 */
export const GUIDE_CATEGORIES = [
  'Itinerari completi',
  'Consigli pratici',
  'Cosa portare',
  'Food guide',
  'Dove dormire',
  'Budget & Costi',
  'Pianificazione',
  'Weekend & Day trip',
] as const;

/**
 * New editorial category system for /travel-tips.
 * Replaces GUIDE_CATEGORIES as the primary taxonomy for practical content.
 */
export const TRAVEL_TIP_CATEGORIES = [
  'Consigli pratici',
  'Budget & Costi',
  'Cosa portare',
  'Food guide',
  'Dove dormire',
  'Pianificazione',
  'Weekend & Day trip',
  'Viaggiare in coppia',
  'Come muoversi',
] as const;

/**
 * Sub-areas per country hub. Chiave = country slug, valore = aree disponibili.
 */
export const COUNTRY_AREAS: Record<string, readonly string[]> = {
  italia: [
    'Puglia',
    'Sicilia',
    'Sardegna',
    'Costiera Amalfitana',
    'Toscana',
    'Dolomiti',
    'Liguria',
    'Lago di Como',
  ],
  grecia: ['Cicladi', 'Creta', 'Ionie', 'Atene', 'Peloponneso'],
  portogallo: ['Algarve', 'Lisbona', 'Porto', 'Azzorre', 'Madeira'],
} as const;

export type DestinationGroup = (typeof DESTINATION_GROUPS)[number];
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];
export type TravelTipCategory = (typeof TRAVEL_TIP_CATEGORIES)[number];

function normalizeSlugSource(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugifyExperienceType(value: string) {
  return normalizeSlugSource(value)
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugifyGuideCategory(value: string) {
  return normalizeSlugSource(value)
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugifyTravelTipCategory(value: string) {
  return normalizeSlugSource(value)
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getGuideCategoryFromQuery(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }

  return GUIDE_CATEGORIES.find((item) => slugifyGuideCategory(item) === rawValue) || null;
}

export function getExperienceTypeFromQuery(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }
  return EXPERIENCE_TYPES.find((item) => slugifyExperienceType(item) === rawValue) || null;
}

export function getTravelTipCategoryFromQuery(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }
  return TRAVEL_TIP_CATEGORIES.find((item) => slugifyTravelTipCategory(item) === rawValue) || null;
}
