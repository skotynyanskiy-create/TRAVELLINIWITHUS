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

export const ITINERARY_DURATIONS = [
  'Weekend (2-3 giorni)',
  'Settimana (4-7 giorni)',
  'Slow trip (8-14 giorni)',
  'Long stay (15+ giorni)',
] as const;

export const ITINERARY_STYLES = [
  'Slow & culturale',
  'Romantico in coppia',
  'Avventura outdoor',
  'Food & vino',
  'Boutique & design',
  'Famiglia',
  'Roadtrip',
] as const;

export const ITINERARY_BUDGETS = [
  { id: 'lean', label: 'Sotto i 600 a testa' },
  { id: 'medium', label: '600 - 1500 a testa' },
  { id: 'premium', label: 'Sopra i 1500 a testa' },
] as const;

export const ITINERARY_PERIODS = [
  'Primavera',
  'Estate',
  'Autunno',
  'Inverno',
  'Tutto l anno',
] as const;

export type DestinationGroup = (typeof DESTINATION_GROUPS)[number];
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];
export type ItineraryDuration = (typeof ITINERARY_DURATIONS)[number];
export type ItineraryStyle = (typeof ITINERARY_STYLES)[number];
export type ItineraryBudget = (typeof ITINERARY_BUDGETS)[number]['id'];
export type ItineraryPeriod = (typeof ITINERARY_PERIODS)[number];

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

export function getExperienceTypeFromQuery(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }
  return EXPERIENCE_TYPES.find((item) => slugifyExperienceType(item) === rawValue) || null;
}
