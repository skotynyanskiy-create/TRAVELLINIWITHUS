export const DESTINATION_GROUPS = ['Italia', 'Grecia', 'Portogallo'] as const;

export const EXPERIENCE_TYPES = [
  'Food & Ristoranti',
  "Borghi e città d'arte",
  'Hotel con carattere',
  'Weekend romantici',
  'Esperienze insolite',
] as const;

/**
 * Categorie tematiche del blog Guide di Viaggio.
 * Diverse dalle aree geografiche — identificano il tipo di contenuto editoriale.
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

export type DestinationGroup = (typeof DESTINATION_GROUPS)[number];
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];

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
