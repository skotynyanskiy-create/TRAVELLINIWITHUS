import type { Guide } from '../types';

/**
 * Demo guide digitali preview-only. Mostra la struttura del marketplace
 * prima del seeding reale. Renderizzate con flag `isDemo: true`.
 */
export const DEMO_GUIDES: Guide[] = [
  {
    id: 'weekend-catania',
    slug: 'weekend-catania',
    title: 'Weekend a Catania',
    subtitle: 'Tre giorni tra mercato, vulcano e cibo di strada',
    destination: 'Catania, Sicilia',
    category: 'Itinerari completi',
    price: 12,
    pages: 38,
    format: 'PDF + Notion',
    language: 'Italiano',
    // TODO[R+B]: cover + preview reali quando guida pubblicata (ritirata cover AI 2026-07-05)
    excerpt:
      "Un weekend a Catania scritto per chi vuole capire la città senza la fila al monumento sbagliato. Mercati, cibo di strada, una sera all'Etna e una colazione vera.",
    inside: [
      'Itinerario giorno per giorno',
      '15 indirizzi food selezionati',
      '6 hotel per fascia e zona',
      'Mappa scaricabile con punti chiave',
      'Tempi di percorrenza realistici',
    ],
    bestFor: ['Coppie short break', 'Lettori che amano il cibo', 'Primo viaggio in Sicilia'],
    updatedAt: '2026-04-12',
    isDemo: true,
  },
  {
    id: 'andalusia-itinerary',
    slug: 'andalusia-itinerary',
    title: 'Andalusia in 7 giorni',
    subtitle: 'Siviglia, Cordoba, Granada con ritmi reali',
    destination: 'Andalusia, Spagna',
    category: 'Itinerari completi',
    price: 18,
    pages: 64,
    format: 'PDF',
    language: 'Italiano',
    // TODO[R+B]: cover + preview reali quando guida pubblicata (ritirata cover AI 2026-07-05)
    excerpt:
      'Sette giorni in Andalusia con tre basi e un ritmo che non brucia il viaggio. Pensato per coppie e viaggiatori lenti.',
    inside: [
      'Itinerario 7 giorni con varianti 5 e 10',
      'Indicazioni treni e bus con orari',
      'Hotel selezionati per zona e budget',
      '30 indirizzi gastronomici',
      'Aree da evitare in alta stagione',
    ],
    bestFor: ['Primo viaggio Andalusia', 'Coppie 30-45'],
    updatedAt: '2026-04-28',
    isNew: true,
    isDemo: true,
  },
  {
    id: 'planner-travel-notion',
    slug: 'planner-travel-notion',
    title: 'Travellini Planner',
    subtitle: 'Template Notion per organizzare il prossimo viaggio',
    destination: 'Universale',
    category: 'Pianificazione',
    price: 9,
    pages: 0,
    format: 'Template Notion',
    language: 'Italiano',
    // TODO[R+B]: cover + preview reali quando guida pubblicata
    coverImage: '/images/brand/about-editorial.webp',
    previewImages: ['/images/brand/about-editorial.webp'],
    excerpt:
      'Lo stesso template che usiamo noi per pianificare ogni viaggio: idee, budget, alloggi, itinerario, checklist.',
    inside: [
      'Database destinazioni e idee',
      'Budget tracker per categoria',
      'Hotel e voli comparison',
      'Itinerario giorno per giorno',
      'Checklist partenza',
    ],
    bestFor: ['Pianificatori metodici', 'Viaggi multi-tappa'],
    updatedAt: '2026-03-08',
    isDemo: true,
  },
];

export const DEMO_GUIDE_SLUGS = DEMO_GUIDES.map((item) => item.slug);
