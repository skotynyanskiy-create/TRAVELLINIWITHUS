import type { ExperienceType } from './contentTaxonomy';

export const EXPERIENCE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop';

export const HOME_EXPERIENCE_TYPES: ExperienceType[] = [
  'Posti particolari',
  'Food & Ristoranti',
  'Hotel con carattere',
  'Weekend romantici',
  "Borghi e citta d'arte",
  'Relax, terme e spa',
];

export const EXPERIENCE_CARD_LABELS: Partial<Record<ExperienceType, string>> = {
  'Food & Ristoranti': 'Food',
  'Hotel con carattere': 'Hotel',
  "Borghi e citta d'arte": 'Borghi',
  'Relax, terme e spa': 'Relax',
};

export const EXPERIENCE_DESCRIPTIONS: Partial<Record<ExperienceType, string>> = {
  'Posti particolari': 'Luoghi insoliti, salvabili e facili da immaginare nel prossimo viaggio.',
  'Food & Ristoranti': 'Tavole, mercati e indirizzi scelti per atmosfera e sostanza.',
  'Hotel con carattere':
    'Posti dove dormire che fanno parte del viaggio, non solo della logistica.',
  'Weekend romantici': 'Idee brevi, curate e realistiche per partire in coppia.',
  "Borghi e citta d'arte": 'Centri storici, scorci e cultura da vivere senza correre.',
  'Relax, terme e spa': 'Pause lente, terme e soggiorni dove staccare davvero.',
};

export function getExperienceCardLabel(type: ExperienceType) {
  return EXPERIENCE_CARD_LABELS[type] ?? type;
}

export function getExperienceDescription(type: ExperienceType) {
  return EXPERIENCE_DESCRIPTIONS[type] ?? 'Idee di viaggio selezionate per scegliere meglio.';
}
