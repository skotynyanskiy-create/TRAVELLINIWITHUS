import { getPublicArticlePath } from '../utils/articleRoutes';

export const DEMO_ARTICLE_SLUG = 'dolomiti-rifugi-design';

export const DEMO_ARTICLE_PREVIEW = {
  id: DEMO_ARTICLE_SLUG,
  slug: DEMO_ARTICLE_SLUG,
  title: 'Dolomiti: tra rifugi di design e vette leggendarie',
  category: 'Itinerari completi',
  image:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  excerpt:
    'Un itinerario di tre giorni tra rifugi di design, valli meno battute e spunti pratici per vivere le Dolomiti con ritmo.',
  readTime: '8 min',
  createdAt: '2026-03-17T08:00:00.000Z',
  verifiedAt: '2026-03-19T08:00:00.000Z',
  budgetBand: 'Alto',
  disclosureType: 'none',
  featuredPlacement: 'home-flagship',
  tripIntents: ['Hotel con carattere', 'Posti particolari'],
};

export const DEMO_ARTICLE_PATH = getPublicArticlePath({
  slug: DEMO_ARTICLE_SLUG,
  category: 'Itinerari completi',
});

function getDemoArticlePath(slug: string, category: string) {
  return getPublicArticlePath({ slug, category });
}

/**
 * Articoli demo leggeri per homepage, liste destinazioni/esperienze/guide.
 * Ogni entry ha una controparte full-shape in `previewContent.ts::PREVIEW_ARTICLES`
 * che alimenta le route editoriali typed (`/guide/:slug` e `/itinerari/:slug`) quando Firestore è vuoto.
 */
export const DEMO_ARTICLES_EXTRA = [
  {
    id: 'puglia-roadtrip-borghi-bianchi',
    slug: 'puglia-roadtrip-borghi-bianchi',
    title: 'Puglia slow: roadtrip tra borghi bianchi e masserie',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1499695867787-12ace027e651?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Cinque giorni on the road tra Valle d’Itria, Salento e costa adriatica: masserie vere, borghi bianchi e tavole che restano.',
    readTime: '9 min',
    createdAt: '2026-04-02T09:00:00.000Z',
    verifiedAt: '2026-04-05T09:00:00.000Z',
    budgetBand: 'Medio',
    disclosureType: 'none',
    featuredPlacement: 'home-flagship',
    tripIntents: ["Borghi e cittÃ  d'arte", 'Food & Ristoranti'],
  },
  {
    id: 'sicilia-orientale-5-giorni',
    slug: 'sicilia-orientale-5-giorni',
    title: 'Sicilia orientale in 5 giorni: Ortigia, Etna, Noto',
    category: 'Weekend & Day trip',
    image:
      'https://images.unsplash.com/photo-1523365154888-8a758819b722?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Un itinerario stretto ma denso: luce barocca di Ortigia, pendii lavici dell’Etna e pietra dorata di Noto.',
    readTime: '7 min',
    createdAt: '2026-03-29T09:00:00.000Z',
    verifiedAt: '2026-03-31T09:00:00.000Z',
    budgetBand: 'Medio',
    disclosureType: 'none',
    featuredPlacement: 'home-flagship',
    tripIntents: ['Food & Ristoranti', 'Esperienze insolite'],
  },
  {
    id: 'islanda-ring-road-10-giorni',
    slug: 'islanda-ring-road-10-giorni',
    title: 'Islanda Ring Road: 10 giorni di paesaggi impossibili',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Ring Road con calma: cascate, fiordi dell’Est, grotte di ghiaccio e un ritmo che lascia spazio anche al meteo.',
    readTime: '12 min',
    createdAt: '2026-03-24T09:00:00.000Z',
  },
  {
    id: 'lisbona-weekend-lento',
    slug: 'lisbona-weekend-lento',
    title: 'Lisbona in un weekend lento: pastelarias, miradouros, tram 28',
    category: 'Weekend & Day trip',
    image:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Tre giorni a ritmo morbido tra Alfama, Bairro Alto e Belém, con pause lunghe e niente corsa per vedere tutto.',
    readTime: '6 min',
    createdAt: '2026-03-20T09:00:00.000Z',
  },
  {
    id: 'provenza-lavanda-luberon',
    slug: 'provenza-lavanda-luberon',
    title: 'Provenza a giugno: lavanda, villaggi del Luberon, cene lente',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'La finestra giusta per la lavanda è stretta. Un itinerario di sei giorni tra Gordes, Sault e l’abbazia di Sénanque.',
    readTime: '8 min',
    createdAt: '2026-03-12T09:00:00.000Z',
  },
  {
    id: 'giappone-kyoto-osaka-14-giorni',
    slug: 'giappone-kyoto-osaka-14-giorni',
    title: 'Giappone slow: 14 giorni tra Kyoto, Osaka e Nara',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Non un tour, ma un ritmo: due settimane scandite da onsen, izakaya, templi al mattino presto e pomeriggi lenti.',
    readTime: '14 min',
    createdAt: '2026-03-06T09:00:00.000Z',
  },
  {
    id: 'vietnam-hoi-an-8-giorni',
    slug: 'vietnam-hoi-an-8-giorni',
    title: 'Vietnam centrale: Hoi An, Hue e risaie di Sa Pa',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Otto giorni per capire un Vietnam meno evidente: lanterne di Hoi An, tombe imperiali di Hue, terrazzamenti di Sa Pa.',
    readTime: '10 min',
    createdAt: '2026-02-28T09:00:00.000Z',
  },
  {
    id: 'peru-valle-sacra-machu-picchu',
    slug: 'peru-valle-sacra-machu-picchu',
    title: 'Perù: valle sacra, Cusco e Machu Picchu senza folla',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Come costruire l’itinerario Inca fuori dagli orari peggiori: acclimatamento a Cusco, Ollantaytambo, Machu Picchu all’alba.',
    readTime: '11 min',
    createdAt: '2026-02-22T09:00:00.000Z',
  },
  {
    id: 'west-coast-usa-roadtrip-14-giorni',
    slug: 'west-coast-usa-roadtrip-14-giorni',
    title: 'West Coast USA: roadtrip 14 giorni da Los Angeles a Seattle',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Due settimane lungo la Pacific Coast Highway: Big Sur, Redwoods, Crater Lake, Columbia Gorge. Guidare con calma.',
    readTime: '13 min',
    createdAt: '2026-02-16T09:00:00.000Z',
  },
  {
    id: 'marocco-medina-deserto-7-giorni',
    slug: 'marocco-medina-deserto-7-giorni',
    title: 'Marocco: medine, Atlante e notte nel deserto di Merzouga',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Sette giorni tra Marrakech, passo del Tichka, kasbah di Aït Ben Haddou e una notte sotto le stelle a Merzouga.',
    readTime: '9 min',
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'nuova-zelanda-south-island-12-giorni',
    slug: 'nuova-zelanda-south-island-12-giorni',
    title: 'Nuova Zelanda: South Island in 12 giorni di fiordi e ghiacciai',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1469521669194-babb45599def?q=80&w=1600&auto=format&fit=crop',
    excerpt:
      'Queenstown, Milford Sound, Franz Josef, Lake Tekapo: un itinerario invertito per evitare le rotte più prevedibili.',
    readTime: '12 min',
    createdAt: '2026-02-03T09:00:00.000Z',
  },
];

export const DEMO_DESTINATION_CARD = {
  id: `destination-${DEMO_ARTICLE_SLUG}`,
  title: 'Dolomiti da esplorare',
  image:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  link: DEMO_ARTICLE_PATH,
  region: 'Europa',
  category: 'Itinerari completi',
};

/**
 * Set completo di card destinazione demo, una per ogni DESTINATION_GROUP.
 * Ognuna punta all'articolo flagship di quel gruppo.
 */
export const DEMO_DESTINATION_CARDS = [
  DEMO_DESTINATION_CARD,
  {
    id: 'destination-puglia-roadtrip',
    title: 'Puglia slow da esplorare',
    image:
      'https://images.unsplash.com/photo-1499695867787-12ace027e651?q=80&w=1600&auto=format&fit=crop',
    link: getDemoArticlePath('puglia-roadtrip-borghi-bianchi', 'Itinerari completi'),
    region: 'Italia',
    category: 'Itinerari completi',
  },
  {
    id: 'destination-islanda-ring-road',
    title: 'Islanda: il giro dell’isola',
    image:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop',
    link: getDemoArticlePath('islanda-ring-road-10-giorni', 'Itinerari completi'),
    region: 'Europa',
    category: 'Itinerari completi',
  },
  {
    id: 'destination-giappone-kyoto-osaka',
    title: 'Giappone: Kyoto, Osaka, Nara',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    link: getDemoArticlePath('giappone-kyoto-osaka-14-giorni', 'Itinerari completi'),
    region: 'Asia',
    category: 'Itinerari completi',
  },
  {
    id: 'destination-peru-valle-sacra',
    title: 'Perù: la valle sacra degli Inca',
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
    link: getDemoArticlePath('peru-valle-sacra-machu-picchu', 'Itinerari completi'),
    region: 'Americhe',
    category: 'Itinerari completi',
  },
  {
    id: 'destination-marocco-medina-deserto',
    title: 'Marocco: medine e deserto',
    image:
      'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=1600&auto=format&fit=crop',
    link: getDemoArticlePath('marocco-medina-deserto-7-giorni', 'Itinerari completi'),
    region: 'Africa',
    category: 'Itinerari completi',
  },
  {
    id: 'destination-nuova-zelanda-south-island',
    title: 'Nuova Zelanda: South Island',
    image:
      'https://images.unsplash.com/photo-1469521669194-babb45599def?q=80&w=1600&auto=format&fit=crop',
    link: getDemoArticlePath('nuova-zelanda-south-island-12-giorni', 'Itinerari completi'),
    region: 'Oceania',
    category: 'Itinerari completi',
  },
];

export const DEMO_ARTICLE_MARKER = {
  id: DEMO_ARTICLE_SLUG,
  name: 'Dolomiti',
  coordinates: [11.8598, 46.4102] as [number, number],
  link: DEMO_ARTICLE_PATH,
  image:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
  category: 'Itinerari completi',
  title: 'Dolomiti: tra rifugi di design e vette leggendarie',
};

/**
 * Set completo di marker mappa demo — uno per articolo, con coordinate reali.
 * Alimenta i widget `InteractiveMap` usati nei singoli articoli in fallback.
 */
export const DEMO_ARTICLE_MARKERS: Array<{
  id: string;
  name: string;
  coordinates: [number, number];
  link: string;
  image: string;
  category: string;
  title: string;
}> = [
  DEMO_ARTICLE_MARKER,
  {
    id: 'puglia-roadtrip-borghi-bianchi',
    name: 'Valle d’Itria',
    coordinates: [17.3797, 40.8014],
    link: getDemoArticlePath('puglia-roadtrip-borghi-bianchi', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1499695867787-12ace027e651?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Puglia slow: roadtrip tra borghi bianchi e masserie',
  },
  {
    id: 'sicilia-orientale-5-giorni',
    name: 'Ortigia, Siracusa',
    coordinates: [15.2931, 37.0623],
    link: getDemoArticlePath('sicilia-orientale-5-giorni', 'Weekend & Day trip'),
    image:
      'https://images.unsplash.com/photo-1523365154888-8a758819b722?q=80&w=1600&auto=format&fit=crop',
    category: 'Weekend & Day trip',
    title: 'Sicilia orientale in 5 giorni',
  },
  {
    id: 'islanda-ring-road-10-giorni',
    name: 'Islanda Ring Road',
    coordinates: [-19.0208, 64.9631],
    link: getDemoArticlePath('islanda-ring-road-10-giorni', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Islanda Ring Road: 10 giorni',
  },
  {
    id: 'lisbona-weekend-lento',
    name: 'Lisbona',
    coordinates: [-9.1393, 38.7223],
    link: getDemoArticlePath('lisbona-weekend-lento', 'Weekend & Day trip'),
    image:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop',
    category: 'Weekend & Day trip',
    title: 'Lisbona: weekend lento',
  },
  {
    id: 'provenza-lavanda-luberon',
    name: 'Luberon, Provenza',
    coordinates: [5.3033, 43.8867],
    link: getDemoArticlePath('provenza-lavanda-luberon', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Provenza: lavanda e Luberon',
  },
  {
    id: 'giappone-kyoto-osaka-14-giorni',
    name: 'Kyoto',
    coordinates: [135.7681, 35.0116],
    link: getDemoArticlePath('giappone-kyoto-osaka-14-giorni', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Giappone: Kyoto, Osaka, Nara',
  },
  {
    id: 'vietnam-hoi-an-8-giorni',
    name: 'Hoi An',
    coordinates: [108.338, 15.8801],
    link: getDemoArticlePath('vietnam-hoi-an-8-giorni', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Vietnam centrale: Hoi An, Hue, Sa Pa',
  },
  {
    id: 'peru-valle-sacra-machu-picchu',
    name: 'Machu Picchu',
    coordinates: [-72.545, -13.1631],
    link: getDemoArticlePath('peru-valle-sacra-machu-picchu', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Perù: valle sacra e Machu Picchu',
  },
  {
    id: 'west-coast-usa-roadtrip-14-giorni',
    name: 'Pacific Coast Highway',
    coordinates: [-121.8813, 36.2704],
    link: getDemoArticlePath('west-coast-usa-roadtrip-14-giorni', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'West Coast USA: roadtrip 14 giorni',
  },
  {
    id: 'marocco-medina-deserto-7-giorni',
    name: 'Merzouga, Sahara',
    coordinates: [-4.013, 31.0997],
    link: getDemoArticlePath('marocco-medina-deserto-7-giorni', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Marocco: medine e deserto',
  },
  {
    id: 'nuova-zelanda-south-island-12-giorni',
    name: 'Milford Sound',
    coordinates: [167.9225, -44.6414],
    link: getDemoArticlePath('nuova-zelanda-south-island-12-giorni', 'Itinerari completi'),
    image:
      'https://images.unsplash.com/photo-1469521669194-babb45599def?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    title: 'Nuova Zelanda: South Island in 12 giorni',
  },
];

export const DEMO_PRODUCTS = [
  {
    id: 'guida-premium-dolomiti',
    slug: 'guida-premium-dolomiti',
    name: 'Guida Premium Dolomiti',
    price: 24.9,
    isDigital: true,
    isBestseller: true,
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    description:
      'Un itinerario di 3–4 giorni ordinato per tappe, rifugi selezionati e indirizzi di valle, con mappa interattiva e budget indicativo.',
    features: [
      'Itinerario da 3 a 4 giorni, adattabile al meteo',
      'Rifugi e lodge selezionati con motivazione',
      'Indirizzi food in valle, fuori dai percorsi ovvi',
      'Mappa interattiva con tutti i punti',
      'Budget indicativo per due persone',
      'Packing list dedicata alla montagna estiva',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '48',
      Lingua: 'Italiano',
      Aggiornamenti: 'Inclusi per 12 mesi',
    },
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=1600&auto=format&fit=crop',
    ],
    relatedProductIds: [
      'guida-premium-giappone',
      'guida-premium-puglia',
      'bundle-premium-itinerari',
    ],
    reviews: [
      {
        rating: 5,
        author: 'Giulia M.',
        comment:
          'Usata per un weekend in Val di Funes. Finalmente una guida che seleziona davvero.',
      },
      {
        rating: 5,
        author: 'Luca R.',
        comment: 'Gli indirizzi food in valle sono oro. Zero tempo perso a cercare.',
      },
      {
        rating: 4,
        author: 'Chiara B.',
        comment: 'Chiara e ben scritta. Aggiungerei qualche alternativa pioggia.',
      },
    ],
  },
  {
    id: 'guida-premium-giappone',
    slug: 'guida-premium-giappone',
    name: 'Giappone 14 giorni: itinerario completo',
    price: 39.9,
    isDigital: true,
    isBestseller: true,
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    description:
      'Il nostro itinerario reale di 14 giorni tra Tokyo, Kyoto, Osaka e Nara, ottimizzato su spostamenti JR Pass e ryokan che valgono davvero.',
    features: [
      '14 giorni giorno per giorno, testati sul campo',
      'Guida trasporti: JR Pass, Shinkansen, IC card',
      'Ryokan selezionati con prezzo e criterio',
      'Indirizzi food autentici, non copia-incolla',
      'Mappa interattiva di tutte le tappe',
      'Tips su stagionalità, crowds e costumi',
      'Budget dettagliato per coppia',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '96',
      Lingua: 'Italiano',
      Aggiornamenti: 'Inclusi per 12 mesi',
    },
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1600&auto=format&fit=crop',
    ],
    relatedProductIds: [
      'guida-premium-dolomiti',
      'guida-premium-islanda',
      'bundle-premium-itinerari',
    ],
    reviews: [
      {
        rating: 5,
        author: 'Marco T.',
        comment:
          'Il JR Pass spiegato finalmente in modo umano. Mi ha fatto risparmiare giorni di ricerche.',
      },
      {
        rating: 5,
        author: 'Elena S.',
        comment: 'Gli indirizzi food sono perfetti: niente trappole per turisti.',
      },
      {
        rating: 5,
        author: 'Andrea P.',
        comment: 'Usato per novembre: koyo incredibile, crowds gestibili. Consigliato.',
      },
    ],
  },
  {
    id: 'guida-premium-islanda',
    slug: 'guida-premium-islanda',
    name: 'Islanda Ring Road: il PDF che useremmo noi',
    price: 34.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    description:
      'Ring Road in 10 giorni con piano B meteo, tappe fuori Golden Circle e lodge isolati che valgono la distanza.',
    features: [
      'Itinerario 10 giorni con piano B meteo',
      'Tappe fuori dal Golden Circle',
      'Guida camper vs. auto + hotel',
      'Costi reali per coppia (carburante, cibo, piscine)',
      'Checklist gear per meteo nordico',
      'Mappa interattiva con tutte le tappe',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '64',
      Lingua: 'Italiano',
      Aggiornamenti: 'Inclusi per 12 mesi',
    },
    relatedProductIds: [
      'guida-premium-dolomiti',
      'guida-premium-giappone',
      'bundle-premium-itinerari',
    ],
    reviews: [
      {
        rating: 5,
        author: 'Sara V.',
        comment: 'La parte "piano B meteo" mi ha salvato tre giorni di viaggio.',
      },
      {
        rating: 4,
        author: 'Davide L.',
        comment: 'Ottima. I costi carburante erano aggiornati al mese giusto.',
      },
    ],
  },
  {
    id: 'guida-premium-puglia',
    slug: 'guida-premium-puglia',
    name: 'Puglia slow: masserie, borghi e tavole',
    price: 24.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1499695867787-12ace027e651?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    description:
      'Cinque giorni tra Valle d’Itria, Salento e costa adriatica. Masserie vere, trattorie che reggono il tempo, spiagge lette fuori dall’alta stagione.',
    features: [
      'Itinerario 5 giorni in auto',
      'Masserie selezionate con motivazione',
      'Trattorie vere, niente trappole turistiche',
      'Spiagge lette per stagione e meteo',
      'Mappa interattiva con tutti i punti',
      'Budget indicativo per due persone',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '52',
      Lingua: 'Italiano',
      Aggiornamenti: 'Inclusi per 12 mesi',
    },
    relatedProductIds: ['guida-premium-dolomiti', 'weekend-firenze', 'bundle-premium-itinerari'],
  },
  {
    id: 'planner-viaggio',
    slug: 'planner-viaggio',
    name: 'Planner viaggio Travellini',
    price: 9.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop',
    category: 'Planner & Template',
    description:
      'Template Notion per pianificare un viaggio senza tab caotici: tappe, prenotazioni, spese, packing, documenti.',
    features: [
      'Template Notion duplicabile',
      'Dashboard tappe + prenotazioni',
      'Sezione documenti & scadenze',
      'Budget rapido giorno per giorno',
      'Checklist partenza personalizzabile',
    ],
    specifications: {
      Formato: 'Notion template',
      Lingua: 'Italiano',
      Aggiornamenti: 'Inclusi',
    },
    relatedProductIds: ['budget-tracker', 'packing-checklist', 'couple-starter-kit'],
  },
  {
    id: 'budget-tracker',
    slug: 'budget-tracker',
    name: 'Budget tracker viaggio',
    price: 7.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop',
    category: 'Planner & Template',
    description:
      'Foglio Google Sheets + copia Notion per tenere sotto controllo spese reali di coppia, cambio valuta e sforamenti.',
    features: [
      'Google Sheets + Notion',
      'Multi-valuta con cambio manuale',
      'Split spese di coppia',
      'Categorie pre-configurate',
      'Grafici sforamenti',
    ],
    specifications: {
      Formato: 'Google Sheets + Notion',
      Lingua: 'Italiano',
    },
    relatedProductIds: ['planner-viaggio', 'packing-checklist', 'couple-starter-kit'],
  },
  {
    id: 'packing-checklist',
    slug: 'packing-checklist',
    name: 'Packing checklist couple',
    price: 4.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1600&auto=format&fit=crop',
    category: 'Planner & Template',
    description:
      'Dieci checklist per tipo di viaggio (montagna, mare, città, inverno, deserto, long haul) pensate per due. Stampabili o usabili in Notion.',
    features: [
      '10 checklist per tipologia di viaggio',
      'Pensate per due persone',
      'Stampabili o duplicabili in Notion',
      'Sezione farmacia + documenti',
      'Gear list con alternative leggere',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Lingua: 'Italiano',
    },
    relatedProductIds: ['planner-viaggio', 'budget-tracker', 'couple-starter-kit'],
  },
  {
    id: 'weekend-roma',
    slug: 'weekend-roma',
    name: 'Weekend a Roma: 48 ore curate',
    price: 14.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop',
    category: 'Weekend & Day trip',
    description:
      'Due giornate a Roma costruite per evitare file ovvie: aperture mattutine, trattorie vere in Trastevere, orari che funzionano.',
    features: [
      'Itinerario orario per orario',
      'Aperture mattutine che evitano file',
      'Trattorie a Trastevere e Testaccio',
      'Percorsi brevi a piedi',
      'Mappa interattiva',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '24',
      Lingua: 'Italiano',
    },
    relatedProductIds: ['weekend-firenze', 'weekend-lisbona', 'guida-premium-puglia'],
  },
  {
    id: 'weekend-firenze',
    slug: 'weekend-firenze',
    name: 'Weekend a Firenze: dai Boboli al tramonto su Piazzale',
    price: 14.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop',
    category: 'Weekend & Day trip',
    description:
      'Firenze in 48 ore con ritmo morbido: Boboli di prima mattina, Oltrarno lento, tramonto dal Piazzale senza la folla.',
    features: [
      'Itinerario 2 giorni a piedi',
      'Boboli e Uffizi senza file',
      'Artigiani autentici dell’Oltrarno',
      'Indirizzi food non standard',
      'Mappa interattiva',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '22',
      Lingua: 'Italiano',
    },
    relatedProductIds: ['weekend-roma', 'weekend-lisbona', 'guida-premium-puglia'],
  },
  {
    id: 'weekend-lisbona',
    slug: 'weekend-lisbona',
    name: 'Weekend a Lisbona: pastelarias e miradouros',
    price: 14.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop',
    category: 'Weekend & Day trip',
    description:
      'Tre giorni a Lisbona a ritmo lento: Alfama la mattina, Bairro Alto il pomeriggio, Belém solo se il meteo aiuta.',
    features: [
      'Itinerario 3 giorni ottimizzato',
      'Pastelarias e indirizzi food autentici',
      'Miradouros meno affollati',
      'Piano B meteo per Belém',
      'Mappa interattiva',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: '28',
      Lingua: 'Italiano',
    },
    relatedProductIds: ['weekend-roma', 'weekend-firenze', 'guida-premium-dolomiti'],
  },
  {
    id: 'bundle-premium-itinerari',
    slug: 'bundle-premium-itinerari',
    name: 'Bundle Premium: 4 itinerari completi',
    price: 99.9,
    isDigital: true,
    isBestseller: true,
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop',
    category: 'Itinerari completi',
    description:
      'Dolomiti, Giappone, Islanda e Puglia in un unico pacchetto: 4 itinerari completi con mappa, budget e indirizzi, a prezzo ridotto del 20%.',
    features: [
      'Dolomiti (3–4 giorni)',
      'Giappone (14 giorni)',
      'Islanda Ring Road (10 giorni)',
      'Puglia slow (5 giorni)',
      'Risparmio del 20% sull’acquisto singolo',
      'Aggiornamenti per 12 mesi su tutto il bundle',
    ],
    specifications: {
      Formato: 'PDF + Notion',
      Pagine: 'Oltre 250 complessive',
      Lingua: 'Italiano',
      Aggiornamenti: 'Inclusi per 12 mesi',
    },
    relatedProductIds: [
      'guida-premium-dolomiti',
      'guida-premium-giappone',
      'guida-premium-islanda',
      'guida-premium-puglia',
    ],
    reviews: [
      {
        rating: 5,
        author: 'Francesca D.',
        comment: 'Il bundle ha senso: li ho usati tutti e quattro nell’arco di un anno.',
      },
      {
        rating: 5,
        author: 'Roberto C.',
        comment: 'Prezzo onesto, zero filler. Si vede che sono stati scritti viaggiando.',
      },
    ],
  },
  {
    id: 'couple-starter-kit',
    slug: 'couple-starter-kit',
    name: 'Couple starter kit: planner + budget + packing',
    price: 19.9,
    isDigital: true,
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop',
    category: 'Planner & Template',
    description:
      'Il tris essenziale per partire in due senza caos: planner Notion, budget tracker e dieci packing list. A prezzo ridotto rispetto all’acquisto singolo.',
    features: [
      'Planner viaggio (Notion)',
      'Budget tracker (Sheets + Notion)',
      '10 packing list couple',
      'Risparmio vs. acquisto singolo',
    ],
    specifications: {
      Formato: 'PDF + Notion + Google Sheets',
      Lingua: 'Italiano',
    },
    relatedProductIds: ['planner-viaggio', 'budget-tracker', 'packing-checklist'],
  },
];

// Manteniamo questi export per compatibilità con altre parti del sito
export const DEMO_PRODUCT_SLUG = DEMO_PRODUCTS[0].slug;
export const DEMO_PRODUCT = DEMO_PRODUCTS[0];
export const DEMO_PRODUCT_PATH = `/shop/${DEMO_PRODUCT_SLUG}`;
