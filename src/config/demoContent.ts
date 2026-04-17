export const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';

export const DEMO_ARTICLE_PREVIEW = {
  id: DEMO_ARTICLE_SLUG,
  slug: DEMO_ARTICLE_SLUG,
  title: 'Dolomiti: Tra Rifugi di Design e Vette Leggendarie',
  category: 'Guide',
  image:
    'https://images.unsplash.com/photo-1518420627255-a040b171f114?q=80&w=1200&auto=format&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1499695867787-12ace027e651?q=80&w=1200&auto=format&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1516483638261-f40af5aa3463?q=80&w=1200&auto=format&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1533418264835-9871c7c2dbf0?q=80&w=1200&auto=format&fit=crop',
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
    image:
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200&auto=format&fit=crop',
    excerpt:
      'Dal caos di Manila ai terrazzamenti di riso di Banaue, fino alle tribù del Nord. Un viaggio per animi vagabondi.',
    readTime: '12 min',
    createdAt: '2026-04-05T09:15:00.000Z',
  },
];

export const DEMO_DESTINATION_CARD = {
  id: `destination-${DEMO_ARTICLE_SLUG}`,
  title: 'Dolomiti da esplorare',
  image:
    'https://images.unsplash.com/photo-1518420627255-a040b171f114?q=80&w=1200&auto=format&fit=crop',
  link: DEMO_ARTICLE_PATH,
  region: 'Europa',
  category: 'Guide',
};

export const DEMO_ARTICLE_MARKER = {
  id: DEMO_ARTICLE_SLUG,
  name: 'Dolomiti',
  coordinates: [11.8598, 46.4102] as [number, number],
  link: DEMO_ARTICLE_PATH,
  image:
    'https://images.unsplash.com/photo-1518420627255-a040b171f114?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1518420627255-a040b171f114?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1499695867787-12ace027e651?q=80&w=1200&auto=format&fit=crop',
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
    id: 'planner-viaggio-Islanda',
    slug: 'planner-viaggio-Islanda',
    name: 'Islanda Ring Road Planner',
    price: 29.0,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1547471080-7fc2caa6f7ea?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1551882547-ff40c0d129df?q=80&w=1200&auto=format&fit=crop',
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

// Manteniamo questi due export per compatibilità con altre parti del sito
export const DEMO_PRODUCT_SLUG = DEMO_PRODUCTS[0].slug;
export const DEMO_PRODUCT = DEMO_PRODUCTS[0];
export const DEMO_PRODUCT_PATH = `/shop/${DEMO_PRODUCT_SLUG}`;
