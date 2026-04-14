export const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';

export const DEMO_ARTICLE_PREVIEW = {
  id: DEMO_ARTICLE_SLUG,
  slug: DEMO_ARTICLE_SLUG,
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
  category: 'Guide',
  image: '/images/destinations/dolomiti.png',
  excerpt:
    'Un itinerario tra rifugi di design, panorami iconici e spunti pratici per vivere le Dolomiti nel modo giusto.',
  readTime: '8 min',
  createdAt: '2026-03-17T08:00:00.000Z',
};

export const DEMO_ARTICLE_PATH = `/articolo/${DEMO_ARTICLE_SLUG}`;

/* Additional demo articles for homepage editorial section */
export const DEMO_ARTICLES_EXTRA = [
  {
    id: 'puglia-trulli-masserie',
    slug: 'puglia-trulli-masserie',
    title: 'Puglia Segreta: Trulli, Masserie e Spiagge Nascoste',
    category: 'Destinazioni',
    image: '/images/destinations/puglia.png',
    excerpt:
      'Oltre il turismo di massa: i luoghi più autentici della Puglia, dalle grotte marine ai borghi in pietra.',
    readTime: '6 min',
    createdAt: '2026-03-14T10:00:00.000Z',
  },
  {
    id: 'toscana-borghi-nascosti',
    slug: 'toscana-borghi-nascosti',
    title: 'Toscana: I Borghi che Nessuno Conosce',
    category: 'Posti particolari',
    image: '/images/destinations/toscana.png',
    excerpt:
      'Lontano da Firenze e Siena, esiste una Toscana fatta di borghi sospesi nel tempo e panorami che tolgono il fiato.',
    readTime: '5 min',
    createdAt: '2026-03-10T09:00:00.000Z',
  },
];

export const DEMO_DESTINATION_CARD = {
  id: `destination-${DEMO_ARTICLE_SLUG}`,
  title: 'Dolomiti da esplorare',
  image: '/images/destinations/dolomiti.png',
  link: DEMO_ARTICLE_PATH,
  region: 'Europa',
  category: 'Guide',
};

export const DEMO_ARTICLE_MARKER = {
  id: DEMO_ARTICLE_SLUG,
  name: 'Dolomiti',
  coordinates: [11.8598, 46.4102] as [number, number],
  link: DEMO_ARTICLE_PATH,
  image: '/images/destinations/dolomiti.png',
  category: 'Guide',
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
};

export const DEMO_PRODUCTS = [
  {
    id: 'guida-premium-dolomiti',
    slug: 'guida-premium-dolomiti',
    name: 'Guida Premium Dolomiti',
    price: 24.9,
    isDigital: true,
    imageUrl: '/images/destinations/dolomiti.png',
    category: 'Itinerari completi',
    description:
      'Una guida premium pensata per raccogliere tappe, indirizzi, consigli pratici e idee già selezionate in un formato ordinato.',
    features: [
      'Itinerario organizzato con tappe',
      'Consigli pratici e indirizzi utili',
      'Mappa interattiva integrata'
    ],
  },
  {
    id: 'guida-premium-giappone',
    slug: 'guida-premium-giappone',
    name: 'Guida Premium Giappone',
    price: 34.0,
    isDigital: true,
    imageUrl: '/images/destinations/giappone.png',
    category: 'Itinerari completi',
    description:
      'Il nostro itinerario reale di 14 giorni in Giappone, ottimizzato per spostamenti, JR Pass e prenotazioni.',
    features: [
      'Itinerario da 14 giorni testato',
      'Guida ai trasporti e pass',
      'Indirizzi food autentici'
    ],
  },
  {
    id: 'itinerario-puglia',
    slug: 'itinerario-puglia',
    name: 'Roadtrip in Puglia',
    price: 19.9,
    isDigital: true,
    imageUrl: '/images/destinations/puglia.png',
    category: 'Weekend & Day trips',
    description:
      'Tutte le tappe perfette per un on-the-road nel sud Italia, tra masserie, mare e posticini segreti.',
    features: [
      'Percorso on-the-road ottimizzato',
      'Selezione masserie e spiagge',
    ],
  },
  {
    id: 'planner-viaggio-Islanda',
    slug: 'planner-viaggio-Islanda',
    name: 'Islanda Ring Road Planner',
    price: 29.0,
    isDigital: true,
    imageUrl: '/images/destinations/islanda.png',
    category: 'Planner & Template',
    description:
      'Come organizzare il viaggio in Islanda in autonomia. Documento Notion pronto da usare e personalizzare.',
    features: [
      'Template Notion organizzativo',
      'Budget tracker incluso',
      'Checklist attrezzatura e meteo',
    ],
  }
];

// Manteniamo questi due export per compatibilità con altre parti del sito
export const DEMO_PRODUCT_SLUG = DEMO_PRODUCTS[0].slug;
export const DEMO_PRODUCT = DEMO_PRODUCTS[0];
export const DEMO_PRODUCT_PATH = `/shop/${DEMO_PRODUCT_SLUG}`;
