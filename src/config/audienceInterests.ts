import type { Audience } from '../context/AudienceContext';
import type { ContentType } from './contentTaxonomy';
import type { FamilyCategory } from '../types/family';

export type InterestId =
  | 'weekend-romantici'
  | 'fuori-rotta'
  | 'mangiare-e-dormire'
  | 'gravidanza'
  | 'viaggiare-in-gravidanza'
  | 'essenziali-family'
  | 'capire-il-fit'
  | 'vedere-i-format'
  | 'richiedere-il-media-kit';

export type MapInterestType = 'all' | 'hotel' | 'food' | 'insolito' | 'relax';

export interface AudienceInterest {
  id: InterestId;
  audience: Audience;
  label: string;
  description: string;
  contentTypes?: readonly ContentType[];
  familyCategories?: readonly FamilyCategory[];
  mapType?: MapInterestType;
  cta: { label: string; to: string };
}

export const AUDIENCE_INTERESTS: Record<Audience, readonly AudienceInterest[]> = {
  viaggiatori: [
    {
      id: 'weekend-romantici',
      audience: 'viaggiatori',
      label: 'Weekend in coppia',
      description: 'Posti, soste e idee per partire in due.',
      contentTypes: ['Weekend romantici'],
      mapType: 'all',
      cta: { label: 'Trova il prossimo weekend', to: '/esplora?type=weekend-romantici' },
    },
    {
      id: 'fuori-rotta',
      audience: 'viaggiatori',
      label: 'Fuori rotta',
      description: 'Indirizzi insoliti che meritano una deviazione.',
      contentTypes: ['Insolito'],
      mapType: 'insolito',
      cta: { label: 'Esplora gli indirizzi insoliti', to: '/esplora?type=insolito' },
    },
    {
      id: 'mangiare-e-dormire',
      audience: 'viaggiatori',
      label: 'Mangiare e dormire bene',
      description: 'Tavole e soggiorni con carattere.',
      contentTypes: ['Food & Ristoranti', 'Hotel con carattere'],
      mapType: 'all',
      cta: { label: 'Apri il registro', to: '/esplora' },
    },
  ],
  family: [
    {
      id: 'gravidanza',
      audience: 'family',
      label: 'Gravidanza',
      description: 'Cose vere da sapere mentre tutto cambia.',
      familyCategories: ['gravidanza'],
      cta: { label: 'Leggi i consigli', to: '/family/consigli' },
    },
    {
      id: 'viaggiare-in-gravidanza',
      audience: 'family',
      label: 'Partire col pancione',
      description: 'Organizzazione e viaggi durante la gravidanza.',
      familyCategories: ['viaggiare-in-gravidanza'],
      cta: { label: 'Prepara il viaggio', to: '/family/consigli' },
    },
    {
      id: 'essenziali-family',
      audience: 'family',
      label: 'Essenziali pratici',
      description: 'Quello che serve davvero, senza riempire lo zaino.',
      familyCategories: ['zaino-family'],
      cta: { label: 'Apri i consigli pratici', to: '/family/consigli' },
    },
  ],
  brand: [
    {
      id: 'capire-il-fit',
      audience: 'brand',
      label: 'Capire il fit',
      description: 'Capire subito se progetto, pubblico e racconto si incontrano.',
      cta: { label: 'Vedi con chi lavoriamo', to: '/collaborazioni#partner-fit' },
    },
    {
      id: 'vedere-i-format',
      audience: 'brand',
      label: 'Vedere i format',
      description: 'Partire da esempi e formati concreti.',
      cta: { label: 'Esplora i format', to: '/collaborazioni#collaboration-formats' },
    },
    {
      id: 'richiedere-il-media-kit',
      audience: 'brand',
      label: 'Richiedere il media kit',
      description: 'Ricevere le basi giuste prima di parlare di progetto.',
      cta: { label: 'Richiedi il media kit', to: '/media-kit' },
    },
  ],
};

export function getAudienceInterests(audience: Audience): readonly AudienceInterest[] {
  return AUDIENCE_INTERESTS[audience];
}

export function getAudienceInterest(interest: InterestId | null | undefined): AudienceInterest | null {
  if (!interest) return null;
  for (const interests of Object.values(AUDIENCE_INTERESTS)) {
    const match = interests.find((candidate) => candidate.id === interest);
    if (match) return match;
  }
  return null;
}

export function isInterestForAudience(interest: InterestId, audience: Audience): boolean {
  return getAudienceInterest(interest)?.audience === audience;
}

export function getAudienceHomePath(audience: Audience): string {
  if (audience === 'family') return '/family';
  if (audience === 'brand') return '/collaborazioni';
  return '/';
}

export function getMapTypeForInterest(interest: InterestId | null | undefined): MapInterestType {
  return getAudienceInterest(interest)?.mapType ?? 'all';
}

export function interestForContentType(type: ContentType): InterestId | null {
  const match = AUDIENCE_INTERESTS.viaggiatori.find((interest) =>
    interest.contentTypes?.includes(type)
  );
  return match?.id ?? null;
}

export function rankByInterest<T>(
  items: readonly T[],
  interest: InterestId | null | undefined,
  getTypes: (item: T) => readonly string[]
): T[] {
  const preferredTypes = getAudienceInterest(interest)?.contentTypes;
  if (!preferredTypes?.length) return [...items];

  return items
    .map((item, index) => ({
      item,
      index,
      matches: getTypes(item).some((type) => preferredTypes.includes(type as ContentType)),
    }))
    .sort((a, b) => Number(b.matches) - Number(a.matches) || a.index - b.index)
    .map(({ item }) => item);
}

export function rankFamilyByInterest<T extends { category: FamilyCategory }>(
  items: readonly T[],
  interest: InterestId | null | undefined
): T[] {
  const preferredCategories = getAudienceInterest(interest)?.familyCategories;
  if (!preferredCategories?.length) return [...items];

  return items
    .map((item, index) => ({
      item,
      index,
      matches: preferredCategories.includes(item.category),
    }))
    .sort((a, b) => Number(b.matches) - Number(a.matches) || a.index - b.index)
    .map(({ item }) => item);
}
