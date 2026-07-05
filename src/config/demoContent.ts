export const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';

const LOCAL_IMAGES = {
  dolomiti: '/images/destinations/dolomiti.webp',
  puglia: '/images/destinations/puglia.webp',
  toscana: '/images/destinations/toscana.webp',
  costiera: '/images/hero-amalfi.webp',
  filippine: '/images/destinations/giappone.webp',
  islanda: '/images/destinations/islanda.webp',
  giappone: '/images/destinations/giappone.webp',
  africa: '/images/destinations/africa.webp',
} as const;

// Country/continent valorizzati per essere indicizzabili dalla mappa
// interattiva (MapboxWorldMap.tsx fa lookup su COUNTRY_COORDS).
// Per gli articoli italiani usiamo la regione come "country" per
// distribuirli geograficamente invece di accatastarli tutti su Roma.
export const DEMO_ARTICLE_PREVIEW = {
  id: DEMO_ARTICLE_SLUG,
  slug: DEMO_ARTICLE_SLUG,
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
  category: 'Guide',
  country: 'Dolomiti',
  continent: 'Europa',
  image: LOCAL_IMAGES.dolomiti,
  excerpt:
    'Un itinerario tra rifugi di design, panorami iconici e spunti pratici per vivere le Dolomiti nel modo giusto.',
  readTime: '8 min',
  createdAt: '2026-03-17T08:00:00.000Z',
};

export const DEMO_ARTICLE_PATH = `/articolo/${DEMO_ARTICLE_SLUG}`;

/* Additional demo articles for homepage editorial section */
const RAW_DEMO_ARTICLES_EXTRA = [
  {
    id: 'puglia-trulli-masserie',
    slug: 'puglia-trulli-masserie',
    title: 'Puglia: Trulli, Masserie e Costa Adriatica',
    category: 'Destinazioni',
    country: 'Puglia',
    continent: 'Europa',
    // Demo partner flag: simula un articolo prodotto in collaborazione
    // con un partner editoriale (es. Masseria Brugia). Marker apparira'
    // con badge verde Star + label "Partner" nella mini-card.
    // R+B sostituisce con dati reali quando shortlist Q3 chiude un partner.
    isPartner: true,
    image: LOCAL_IMAGES.puglia,
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
    country: 'Toscana',
    continent: 'Europa',
    image: LOCAL_IMAGES.toscana,
    excerpt:
      'Lontano da Firenze e Siena, esiste una Toscana fatta di borghi sospesi nel tempo e panorami che tolgono il fiato.',
    readTime: '5 min',
    createdAt: '2026-03-10T09:00:00.000Z',
  },
  {
    id: 'costiera-amalfitana',
    slug: 'costiera-amalfitana',
    title: 'Costiera Amalfitana: Sfuggire alla Folla e Trovare la Magia',
    category: 'Weekend & Day trips',
    country: 'Costiera Amalfitana',
    continent: 'Europa',
    image: LOCAL_IMAGES.costiera,
    excerpt:
      'Come godersi Positano, Amalfi e Ravello evitando i periodi peggiori e scoprendo calette intime e ristoranti segreti.',
    readTime: '7 min',
    createdAt: '2026-04-01T14:30:00.000Z',
  },
  {
    id: 'nord-delle-filippine',
    slug: 'nord-delle-filippine',
    title: "Nord delle Filippine: L'Itinerario Non Turistico",
    category: 'Itinerari completi',
    country: 'Filippine',
    continent: 'Asia',
    image: LOCAL_IMAGES.filippine,
    excerpt:
      'Dal caos di Manila ai terrazzamenti di riso di Banaue, fino alle tribù del Nord. Un viaggio per animi vagabondi.',
    readTime: '12 min',
    createdAt: '2026-04-05T09:15:00.000Z',
  },
];

/**
 * Sfoltimento "1 per regione" — 2026-05-19.
 *
 * RAW_DEMO_ARTICLES_EXTRA contiene 4 articoli inline (archivio dormiente).
 * DEMO_ARTICLES_EXTRA esporta solo i 2 coerenti con gli slug visibili
 * (puglia, toscana). Esclusi: costiera-amalfitana (duplica
 * costiera-amalfitana-fuori-stagione gia in SEEDS) e nord-delle-filippine
 * (hidden dallo sfoltimento articoli).
 */
const VISIBLE_EXTRA_SLUGS = new Set<string>(['puglia-trulli-masserie', 'toscana-borghi-nascosti']);

export const DEMO_ARTICLES_EXTRA = RAW_DEMO_ARTICLES_EXTRA.filter((item) =>
  VISIBLE_EXTRA_SLUGS.has(item.slug)
);

export const DEMO_DESTINATION_CARD = {
  id: `destination-${DEMO_ARTICLE_SLUG}`,
  title: 'Dolomiti da esplorare',
  image: LOCAL_IMAGES.dolomiti,
  link: DEMO_ARTICLE_PATH,
  region: 'Europa',
  category: 'Guide',
};

export const DEMO_DESTINATION_CARDS = [
  DEMO_DESTINATION_CARD,
  {
    id: 'destination-puglia-trulli-masserie',
    title: 'Puglia: trulli, masserie, mare',
    image: LOCAL_IMAGES.puglia,
    link: '/guide',
    region: 'Italia',
    category: 'Destinazioni',
  },
  {
    id: 'destination-toscana-borghi-nascosti',
    title: 'Toscana: borghi sospesi nel tempo',
    image: LOCAL_IMAGES.toscana,
    link: '/guide',
    region: 'Italia',
    category: 'Posti particolari',
  },
  {
    id: 'destination-costiera-amalfitana',
    title: 'Costiera Amalfitana fuori stagione',
    image: LOCAL_IMAGES.costiera,
    link: '/guide',
    region: 'Italia',
    category: 'Weekend & Day trips',
  },
  {
    id: 'destination-nord-delle-filippine',
    title: 'Nord delle Filippine, lontano dai circuiti',
    image: LOCAL_IMAGES.filippine,
    link: '/guide',
    region: 'Asia',
    category: 'Itinerari completi',
  },
  {
    id: 'destination-islanda-ring-road',
    title: 'Islanda: Ring Road in autonomia',
    image: LOCAL_IMAGES.islanda,
    link: '/guide',
    region: 'Europa',
    category: 'Itinerari completi',
  },
] as const;

export const DEMO_ARTICLE_MARKER = {
  id: DEMO_ARTICLE_SLUG,
  name: 'Dolomiti',
  coordinates: [11.8598, 46.4102] as [number, number],
  link: DEMO_ARTICLE_PATH,
  image: LOCAL_IMAGES.dolomiti,
  category: 'Guide',
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
};

const RAW_DEMO_PRODUCTS = [
  {
    id: 'guida-premium-dolomiti',
    slug: 'guida-premium-dolomiti',
    name: 'Guida Premium Dolomiti',
    price: 24.9,
    isDigital: true,
    // imageUrl ritirata 2026-07-05: cover AI/stock, no foto reale disponibile
    // (ProductCard/ProductPage mostrano già un fallback editoriale senza foto).
    category: 'Itinerari completi',
    description:
      'Una guida premium pensata per raccogliere tappe, indirizzi, consigli pratici e idee già selezionate in un formato ordinato.',
    features: [
      'Itinerario organizzato con tappe',
      'Consigli pratici e indirizzi utili',
      'Mappa interattiva integrata',
    ],
  },
  {
    id: 'guida-premium-giappone',
    slug: 'guida-premium-giappone',
    name: 'Guida Premium Giappone',
    price: 34.0,
    isDigital: true,
    imageUrl: LOCAL_IMAGES.giappone,
    category: 'Itinerari completi',
    description:
      'Il nostro itinerario reale di 14 giorni in Giappone, ottimizzato per spostamenti, JR Pass e prenotazioni.',
    features: [
      'Itinerario da 14 giorni testato',
      'Guida ai trasporti e pass',
      'Indirizzi food autentici',
    ],
  },
  {
    id: 'itinerario-puglia',
    slug: 'itinerario-puglia',
    name: 'Roadtrip in Puglia',
    price: 19.9,
    isDigital: true,
    imageUrl: LOCAL_IMAGES.puglia,
    category: 'Weekend & Day trips',
    description:
      'Tutte le tappe perfette per un on-the-road nel sud Italia, tra masserie, mare e posticini segreti.',
    features: [
      'Percorso on-the-road ottimizzato',
      'Selezione masserie e spiagge',
      'Food guide annessa',
    ],
  },
  {
    id: 'planner-viaggio-islanda',
    slug: 'planner-viaggio-islanda',
    name: 'Islanda Ring Road Planner',
    price: 29.0,
    isDigital: true,
    imageUrl: LOCAL_IMAGES.islanda,
    category: 'Planner & Template',
    description:
      'Come organizzare il viaggio in Islanda in autonomia. Documento Notion pronto da usare e personalizzare.',
    features: [
      'Template Notion organizzativo',
      'Budget tracker incluso',
      'Checklist idonea al meteo nordico',
    ],
  },
  {
    id: 'safari-template-sudafrica',
    slug: 'safari-template-sudafrica',
    name: 'Safari in Sudafrica - Kruger Planner',
    price: 22.5,
    isDigital: true,
    imageUrl: LOCAL_IMAGES.africa,
    category: 'Planner & Template',
    description:
      "Tutte le informazioni, i contatti e l'organizzazione per fare un safari fai-da-te ed abbattere i costi senza rinunciare ai lodge di charme.",
    features: [
      'Schede preparatorie e Packing list',
      'Contatti agenzie e Lodge validati',
      'Guida pratica Noleggio auto',
    ],
  },
  {
    id: 'weekend-trentino-spa',
    slug: 'weekend-trentino-spa',
    name: 'Fuga in Trentino, 3 giorni spa & relax',
    price: 14.9,
    isDigital: true,
    imageUrl: LOCAL_IMAGES.dolomiti,
    category: 'Weekend & Day trips',
    description:
      'Solamente due notti e tre giorni pieni per ricaricarsi in montagna mangiando da Dio e riposando bene. Tutti i dettagli pronti.',
    features: [
      'Migliori Hotel Spa testati',
      'Indirizzi food zero-stress',
      'Passeggiate leggere di livello facile',
    ],
  },
];

/**
 * Sfoltimento "1 per tipo" — 2026-05-19.
 *
 * RAW_DEMO_PRODUCTS contiene prodotti in lavorazione (archivio dormiente).
 * DEMO_PRODUCTS esporta solo il primo SKU prioritario: la pagina shop deve
 * sembrare una lista d'attesa curata, non un catalogo vendibile finto.
 *
 * Per ri-attivare un prodotto nascosto: aggiungere lo slug a VISIBLE_PRODUCT_SLUGS.
 */
const VISIBLE_PRODUCT_SLUGS = new Set<string>(['guida-premium-dolomiti']);

export const DEMO_PRODUCTS = RAW_DEMO_PRODUCTS.filter((item) =>
  VISIBLE_PRODUCT_SLUGS.has(item.slug)
);

// Manteniamo questi due export per compatibilità con altre parti del sito
export const DEMO_PRODUCT_SLUG = DEMO_PRODUCTS[0].slug;
export const DEMO_PRODUCT = DEMO_PRODUCTS[0];
export const DEMO_PRODUCT_PATH = `/shop/${DEMO_PRODUCT_SLUG}`;
