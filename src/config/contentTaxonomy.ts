export const DESTINATION_GROUPS = [
  'Italia',
  'Europa',
  'Asia',
  'Americhe',
  'Africa',
  'Oceania',
] as const;

export const EXPERIENCE_TYPES = [
  'Posti particolari',
  'Food & Ristoranti',
  'Locali insoliti',
  'Hotel con carattere',
  'Weekend romantici',
  "Borghi e città d'arte",
  'Passeggiate panoramiche',
  'Relax, terme e spa',
  'Esperienze insolite',
  'Gite e day trip',
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

export function slugifyExperienceType(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugifyGuideCategory(value: string) {
  return value
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
