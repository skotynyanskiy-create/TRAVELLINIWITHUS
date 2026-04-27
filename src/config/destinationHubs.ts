/**
 * Destination Hub Pages — pillar landing pattern saltinourhair.com.
 * Una entry per paese. Route target `/destinazioni/:country` con redirect dalle legacy top-level.
 * Il template React è `DestinationHubLayout.tsx`.
 */

export interface SubDestination {
  name: string;
  tagline: string;
  /** URL del filtro archive o pillar article dedicato */
  href: string;
  image: string;
  /** Se presente, mostrata come badge "In evidenza" */
  featured?: boolean;
}

export interface HubTravelTip {
  title: string;
  text: string;
}

export interface HubFoodPreview {
  name: string;
  region: string;
  description: string;
}

export interface DestinationHub {
  slug: string;
  country: string;
  flag: string;
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroImage: string;
  methodCards: { title: string; text: string }[];
  subDestinations: SubDestination[];
  /** Slug articoli da evidenziare. Se mancano dal catalogo fallback a ultimi recenti. */
  featuredArticleSlugs: string[];
  travelTips: HubTravelTip[];
  foodPreview: HubFoodPreview[];
  /** Copy iniziale della CTA Booking/Heymondo/Skyscanner section. */
  affiliateIntro: string;
  /** Keyword primaria + descrizione meta per SEO. */
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  /** Slug del paese parent quando questo hub e' una regione (es. 'italia'). */
  parent?: string;
  /** Valori `region` (case-insensitive) che matchano questo hub negli articoli Firestore. */
  regionMatcher?: string[];
  /** Override admin: forza visibilita' indipendentemente da soglia contenuti. */
  isPublished?: boolean;
  /** Soglia minima di articoli pubblicati per esporre l'hub. Default 3. */
  minArticlesToPublish?: number;
}

export const DESTINATION_HUBS: Record<string, DestinationHub> = {
  italia: {
    slug: 'italia',
    country: 'Italia',
    flag: '🇮🇹',
    heroEyebrow: 'Italia',
    heroTitleMain: 'Italia,',
    heroTitleAccent: 'il nostro modo di esplorarla',
    heroDescription:
      "Non è la guida che promette 'le 100 cose da fare'. È il modo in cui scegliamo posti, ritmi e stagioni per vivere davvero il paese che conosciamo meglio — senza trappole turistiche e senza finti segreti.",
    heroImage:
      'https://images.unsplash.com/photo-1533165850316-22f9d4d37d0d?q=80&w=2000&auto=format&fit=crop',
    methodCards: [
      {
        title: 'Scegliamo con criterio',
        text: 'Dormiamo, mangiamo, camminiamo prima di consigliare. Niente hotel visti solo su Instagram.',
      },
      {
        title: 'Niente trappole',
        text: 'Il ristorante pieno di turisti non entra. Il borgo che sembra messo in posa neanche. Filtro duro.',
      },
      {
        title: 'Stagione giusta',
        text: 'Diciamo chiaramente quando andare e quando non andare. Agosto raramente è la risposta.',
      },
    ],
    subDestinations: [
      {
        name: 'Sardegna',
        tagline: 'Gallura, Costa Smeralda, Asinara. Il nord in 7 giorni.',
        href: '/itinerari/sardegna-nord-7-giorni-guida-completa',
        image:
          'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=1600&auto=format&fit=crop',
        featured: true,
      },
      {
        name: 'Puglia',
        tagline: 'Masserie, borghi bianchi, olio buono e tempo dilatato.',
        href: '/itinerari/puglia-roadtrip-borghi-bianchi',
        image:
          'https://images.unsplash.com/photo-1583407723467-9b2d22504831?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Dolomiti',
        tagline: 'Rifugi contemporanei e sentieri da scegliere in quota.',
        href: '/itinerari/dolomiti-rifugi-design',
        image:
          'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Sicilia orientale',
        tagline: 'Taormina, Siracusa, Noto. Cinque giorni pieni.',
        href: '/itinerari/sicilia-orientale-5-giorni',
        image:
          'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Borghi lenti',
        tagline: 'Weekend tra pietra, vino e cene lunghe.',
        href: '/itinerari/weekend-borgo-lento',
        image:
          'https://images.unsplash.com/photo-1533662654863-10b9d6ed02a3?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Tutte le destinazioni italiane',
        tagline: "L'archivio completo con tutti i filtri per regione, periodo, budget.",
        href: '/destinazioni?group=Italia',
        image:
          'https://images.unsplash.com/photo-1512757776214-26d36777b513?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    featuredArticleSlugs: [
      'sardegna-nord-7-giorni-guida-completa',
      'puglia-roadtrip-borghi-bianchi',
      'dolomiti-rifugi-design',
    ],
    travelTips: [
      {
        title: 'Periodo migliore',
        text: "Maggio e settembre sono la finestra d'oro quasi ovunque. Luglio e agosto solo dove hai prenotato con mesi d'anticipo.",
      },
      {
        title: 'Noleggio auto',
        text: 'Indispensabile fuori dalle grandi città. Prenota 4-6 settimane prima per tenere i prezzi sotto controllo.',
      },
      {
        title: 'Bancomat e pagamenti',
        text: 'Le carte funzionano ovunque nelle città. Tieni 50-100€ contanti per trattorie di paese e piccoli mercati.',
      },
      {
        title: 'Orari inaspettati',
        text: 'In molte zone i ristoranti chiudono tra le 15 e le 19. Evita di arrivare in un borgo a pranzo alle 14:45.',
      },
    ],
    foodPreview: [
      {
        name: 'Culurgiones',
        region: 'Sardegna',
        description:
          "Ravioli di patate e menta cuciti a mano. Cercali nelle trattorie dell'interno, non sulla costa.",
      },
      {
        name: 'Orecchiette alle cime di rapa',
        region: 'Puglia',
        description: 'La versione vera ha acciuga e aglio soffritto. Rifiuta i piatti con panna.',
      },
      {
        name: 'Cannolo siciliano',
        region: 'Sicilia',
        description:
          'Riempito al momento o non vale la pena. Se sono pronti in vetrina, continua a camminare.',
      },
    ],
    affiliateIntro:
      'Servizi che usiamo davvero quando viaggiamo in Italia. Prenotando da qui ci aiuti a mantenere il progetto, senza costi extra.',
    seo: {
      title: 'Italia — Guida di viaggio Travelliniwithus',
      description:
        "Destinazioni, itinerari, hotel curati e food guide per esplorare l'Italia davvero. Il nostro modo di viaggiare nel paese che conosciamo meglio.",
      keywords: ['italia viaggio', 'cosa vedere italia', 'itinerario italia', 'guida italia'],
    },
  },

  grecia: {
    slug: 'grecia',
    country: 'Grecia',
    flag: '🇬🇷',
    heroEyebrow: 'Grecia',
    heroTitleMain: 'Grecia,',
    heroTitleAccent: 'oltre le cartoline Cicladi',
    heroDescription:
      "Non solo Santorini e Mykonos. La Grecia vera inizia quando sposti l'attenzione dalle isole sulle copertine a quelle che richiedono un traghetto in più — e premiano la scelta con calette vuote e taverne di paese.",
    heroImage:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop',
    methodCards: [
      {
        title: 'Isole con criterio',
        text: 'Non tutte le isole sono uguali. Ti diciamo quali scegliere per slow travel vs nightlife vs trekking.',
      },
      {
        title: 'Traghetti e logistica',
        text: 'Capire i traghetti è metà del viaggio. Calendari, operatori, orari reali verificati sul posto.',
      },
      {
        title: 'Cena di paese',
        text: 'La taverna giusta non ha menù in 4 lingue. Abbiamo imparato a riconoscerle dopo diversi errori.',
      },
    ],
    subDestinations: [
      {
        name: 'Cicladi',
        tagline: 'Oltre Santorini: Paros, Naxos, Milos, Folegandros.',
        href: '/destinazioni?group=Europa&region=Cicladi',
        image:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop',
        featured: true,
      },
      {
        name: 'Dodecanneso',
        tagline: 'Rodi, Simi, Karpathos. Grecia meno turistica.',
        href: '/destinazioni?group=Europa&region=Dodecanneso',
        image:
          'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Peloponneso',
        tagline: 'Mani, Monemvasia, Nafplio. Road trip continentale.',
        href: '/destinazioni?group=Europa&region=Peloponneso',
        image:
          'https://images.unsplash.com/photo-1561611345-c8a0d1a5c7d0?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Creta',
        tagline: 'Sud selvaggio, gole di Samaria, taverne di villaggio.',
        href: '/destinazioni?group=Europa&region=Creta',
        image:
          'https://images.unsplash.com/photo-1602868054930-ceec9b56c6b1?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Tutte le destinazioni greche',
        tagline: "L'archivio con i filtri per budget, isola, periodo.",
        href: '/destinazioni?group=Europa',
        image:
          'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    featuredArticleSlugs: [],
    travelTips: [
      {
        title: 'Finestra ideale',
        text: 'Metà maggio - metà giugno, e settembre intero. Fuori stagione molti ristoranti delle isole chiudono.',
      },
      {
        title: 'Traghetti',
        text: 'Prenota su ferryhopper.com con 3-4 settimane di anticipo. Gli orari "veri" cambiano di settimana.',
      },
      {
        title: 'Noleggio ATV',
        text: "Sulle isole piccole il modo più flessibile è l'ATV (quad). 25-35€ al giorno, patente B sufficiente.",
      },
      {
        title: 'Siesta reale',
        text: 'Tra le 14 e le 17 i villaggi sono fermi. Usa quella finestra per spiaggia, non per pranzo in trattoria.',
      },
    ],
    foodPreview: [
      {
        name: 'Gyros vero',
        region: 'Tutta la Grecia',
        description:
          'Gyros al maiale, non al pollo. Se vedi il pollo ovunque sei in un posto da turisti.',
      },
      {
        name: 'Octopus grigliato',
        region: 'Isole del Dodecanneso',
        description:
          'Asciugato al sole prima di finire sulla brace. Lo vedi appeso fuori dalle taverne buone.',
      },
      {
        name: 'Loukoumades',
        region: 'Atene',
        description:
          'Frittelle al miele calde. Cercale in caffè storici, non nei chioschi turistici.',
      },
    ],
    affiliateIntro:
      'Servizi per navigare la Grecia senza stress: traghetti, eSIM, assicurazione di viaggio. Tutti testati da noi.',
    seo: {
      title: 'Grecia — Guida di viaggio Travelliniwithus',
      description:
        'Isole greche, Cicladi, Dodecanneso e Peloponneso. Itinerari curati, hotel scelti, food guide reale. Oltre Santorini.',
      keywords: ['grecia viaggio', 'isole greche', 'cicladi itinerario', 'cosa vedere grecia'],
    },
  },

  portogallo: {
    slug: 'portogallo',
    country: 'Portogallo',
    flag: '🇵🇹',
    heroEyebrow: 'Portogallo',
    heroTitleMain: 'Portogallo,',
    heroTitleAccent: 'il paese che cambia ritmo ogni 100 km',
    heroDescription:
      'Lisbona lenta, Alentejo profondo, Algarve sopra le scogliere, Madeira verticale. Il Portogallo ha quattro anime molto diverse, e sono tutte raggiungibili in un singolo viaggio ragionato.',
    heroImage:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2000&auto=format&fit=crop',
    methodCards: [
      {
        title: 'Tre anime in un viaggio',
        text: 'Lisbona + Alentejo + Algarve in 10 giorni è fattibile. Te lo raccontiamo senza farti correre.',
      },
      {
        title: 'Vinho e petiscos',
        text: 'I portoghesi mangiano in piccole porzioni condivise. La tavola è rituale, non cronometro.',
      },
      {
        title: 'Costa vera',
        text: "L'Algarve non è solo Lagos. Le scogliere migliori sono dopo Sagres, dove quasi nessuno va.",
      },
    ],
    subDestinations: [
      {
        name: 'Lisbona',
        tagline: 'Alfama, Chiado, Belém. La capitale senza fretta.',
        href: '/itinerari/lisbona-weekend-lento',
        image:
          'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1600&auto=format&fit=crop',
        featured: true,
      },
      {
        name: 'Alentejo',
        tagline: 'Ulivi, vigneti, villaggi bianchi. Il Portogallo profondo.',
        href: '/destinazioni?group=Europa&region=Alentejo',
        image:
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Algarve',
        tagline: 'Scogliere dorate, cale nascoste, pesce del giorno.',
        href: '/destinazioni?group=Europa&region=Algarve',
        image:
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Madeira',
        tagline: 'Oceano, foreste e sentieri verticali.',
        href: '/destinazioni?group=Europa&region=Madeira',
        image:
          'https://images.unsplash.com/photo-1525428935428-a32d8d2bf4cb?q=80&w=1600&auto=format&fit=crop',
      },
      {
        name: 'Tutte le destinazioni portoghesi',
        tagline: "L'archivio completo con tutti i filtri.",
        href: '/destinazioni?group=Europa&country=Portogallo',
        image:
          'https://images.unsplash.com/photo-1544948503-7ad532c2c32d?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    featuredArticleSlugs: ['lisbona-weekend-lento'],
    travelTips: [
      {
        title: 'Quando partire',
        text: 'Aprile-giugno o settembre-ottobre. Agosto è caldo e caro, gennaio è piovoso ma affascinante.',
      },
      {
        title: 'Tuk-tuk a Lisbona',
        text: 'Evitali: i quartieri veri si vivono a piedi o con tram storico. I tuk-tuk sono tassisti travestiti.',
      },
      {
        title: 'Autostrade',
        text: "Hanno pedaggi elettronici automatici. Prendi l'EasyToll all'arrivo in autostrada se vieni in auto.",
      },
      {
        title: 'Vini di Douro',
        text: "Il Porto non è l'unico vino portoghese. Alentejo e Dão producono rossi strutturati sorprendenti.",
      },
    ],
    foodPreview: [
      {
        name: 'Bacalhau',
        region: 'Tutto il paese',
        description:
          'Dicono che ci siano 365 modi per cucinarlo. Provane almeno 3 diversi durante il viaggio.',
      },
      {
        name: 'Pastel de nata',
        region: 'Lisbona',
        description: 'Il vero è quello di Belém o di Manteigaria. Caldo e spolverato di cannella.',
      },
      {
        name: 'Cataplana',
        region: 'Algarve',
        description:
          'Stufato di pesce in pentola di rame. Ordinala almeno una volta stando sulla costa.',
      },
    ],
    affiliateIntro:
      'Strumenti che usiamo per viaggiare in Portogallo: noleggio auto, assicurazione, eSIM per coprire zone meno connesse.',
    seo: {
      title: 'Portogallo — Guida di viaggio Travelliniwithus',
      description:
        'Lisbona, Alentejo, Algarve e Madeira. Il nostro modo di esplorare il Portogallo con itinerari curati e hotel veri.',
      keywords: [
        'portogallo viaggio',
        'cosa vedere portogallo',
        'itinerario portogallo',
        'lisbona guida',
      ],
    },
  },
};

export function getDestinationHub(slug: string): DestinationHub | null {
  return DESTINATION_HUBS[slug] ?? null;
}

export const DESTINATION_HUB_SLUGS = Object.keys(DESTINATION_HUBS);

/**
 * Visibility gate by content. Un hub regionale appare in navbar/sitemap solo se:
 * - `isPublished` esplicitamente true, oppure
 * - il numero di articoli matchanti `regionMatcher` raggiunge `minArticlesToPublish` (default 3).
 * Hub paese top-level (Italia, Grecia, Portogallo) sono sempre visibili.
 */
export function isHubVisible(hub: DestinationHub, articleCount: number): boolean {
  if (!hub.parent) return true;
  if (hub.isPublished === true) return true;
  if (hub.isPublished === false) return false;
  return articleCount >= (hub.minArticlesToPublish ?? 3);
}

/** Conta gli articoli che matchano il `regionMatcher` di un hub regionale. */
export function countMatchingArticles(
  hub: DestinationHub,
  articles: Array<{ region?: string; country?: string }>
): number {
  if (!hub.parent || !hub.regionMatcher || hub.regionMatcher.length === 0) {
    return 0;
  }
  const matchSet = new Set(hub.regionMatcher.map((r) => r.toLowerCase()));
  return articles.filter((a) => {
    const region = a.region?.toLowerCase();
    return region ? matchSet.has(region) : false;
  }).length;
}

/**
 * Helper per costruire hub regionali italiani con default sensati. Riduce il rumore
 * delle 20 regioni mantenendo la struttura tipizzata. Override mirati per le
 * regioni con copy editoriale custom.
 */
function createItalianRegionHub(input: {
  slug: string;
  name: string;
  heroEyebrow: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroImage: string;
  regionMatcher: string[];
  subDestinations?: SubDestination[];
  methodCards?: { title: string; text: string }[];
  travelTips?: HubTravelTip[];
  foodPreview?: HubFoodPreview[];
  featuredArticleSlugs?: string[];
  seoKeywords?: string[];
  minArticlesToPublish?: number;
}): DestinationHub {
  const defaultMethod = [
    {
      title: 'Selezione con criterio',
      text: 'Ogni indirizzo entra solo se l abbiamo provato e regge davvero, fuori stagione compresa.',
    },
    {
      title: 'Ritmo locale',
      text: 'Ti diciamo quando andare e quando evitare. Non tutti i mesi sono uguali.',
    },
    {
      title: 'Niente posa',
      text: 'Niente posti messi in vetrina solo per Instagram. Quello che consigliamo regge ai giorni veri.',
    },
  ];

  const defaultTips: HubTravelTip[] = [
    {
      title: 'Periodo migliore',
      text: 'Ti suggeriamo le finestre stagionali piu sensate appena pubblichiamo articoli pillar dedicati.',
    },
    {
      title: 'Come muoversi',
      text: 'Auto, treno, traghetto — ogni regione ha la sua logistica ideale, la documenteremo nei contenuti.',
    },
    {
      title: 'Budget realistico',
      text: 'Range orientativi e voci di spesa appariranno nelle guide pratiche dedicate alla regione.',
    },
    {
      title: 'Cosa evitare',
      text: 'Trappole turistiche e errori comuni: la lista nera arriva nelle prime guide pubblicate.',
    },
  ];

  return {
    slug: `italia/${input.slug}`,
    country: input.name,
    flag: '🇮🇹',
    heroEyebrow: input.heroEyebrow,
    heroTitleMain: `${input.name},`,
    heroTitleAccent: input.heroTitleAccent,
    heroDescription: input.heroDescription,
    heroImage: input.heroImage,
    methodCards: input.methodCards ?? defaultMethod,
    subDestinations: input.subDestinations ?? [
      {
        name: `Tutte le destinazioni in ${input.name}`,
        tagline: "L'archivio filtrato per regione, periodo e budget.",
        href: `/destinazioni?group=Italia&area=${encodeURIComponent(input.name)}`,
        image: input.heroImage,
      },
    ],
    featuredArticleSlugs: input.featuredArticleSlugs ?? [],
    travelTips: input.travelTips ?? defaultTips,
    foodPreview: input.foodPreview ?? [],
    affiliateIntro: `Servizi che usiamo per esplorare ${input.name}. Prenotando da qui ci aiuti a mantenere il progetto, senza costi extra.`,
    seo: {
      title: `${input.name} — Guida di viaggio Travelliniwithus`,
      description: input.heroDescription.slice(0, 158),
      keywords: input.seoKeywords ?? [
        `${input.name.toLowerCase()} viaggio`,
        `cosa vedere ${input.name.toLowerCase()}`,
        `itinerario ${input.name.toLowerCase()}`,
      ],
    },
    parent: 'italia',
    regionMatcher: input.regionMatcher,
    minArticlesToPublish: input.minArticlesToPublish ?? 3,
  };
}

/**
 * 20 regioni italiane come struttura preparata. Visibili in navbar/sitemap solo
 * quando hanno >=`minArticlesToPublish` articoli (default 3) — vedi `isHubVisible`.
 * Le 5 regioni brand-priority (Sicilia, Puglia, Trentino-Alto Adige, Toscana,
 * Sardegna) hanno copy editoriale custom; le altre usano default coerenti.
 */
export const ITALIAN_REGION_HUBS: Record<string, DestinationHub> = {
  'italia/sicilia': createItalianRegionHub({
    slug: 'sicilia',
    name: 'Sicilia',
    heroEyebrow: 'Sicilia',
    heroTitleAccent: 'isola che cambia faccia ogni 50 km',
    heroDescription:
      "Taormina, Siracusa, Noto, Palermo, l'entroterra. La Sicilia non e una destinazione: e cinque viaggi diversi nello stesso mese. Ti diciamo come scegliere fra est barocco, ovest arabeggiante, isole minori e Etna.",
    heroImage:
      'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=2000&auto=format&fit=crop',
    minArticlesToPublish: 1,
    regionMatcher: ['Sicilia', 'Sicilia orientale', 'Sicilia occidentale'],
    foodPreview: [
      {
        name: 'Cannolo siciliano',
        region: 'Sicilia orientale',
        description:
          'Riempito al momento, ricotta di pecora, pistacchio di Bronte. Mai dalla vetrina.',
      },
      {
        name: 'Pasta alla Norma',
        region: 'Catania',
        description:
          'Melanzane fritte, pomodoro, ricotta salata, basilico. La trovi vera nelle trattorie di paese.',
      },
      {
        name: 'Arancina/o',
        region: 'Palermo / Catania',
        description:
          'Femminile a Palermo, maschile a Catania. La differenza non e solo grammaticale.',
      },
    ],
  }),
  'italia/puglia': createItalianRegionHub({
    slug: 'puglia',
    name: 'Puglia',
    heroEyebrow: 'Puglia',
    heroTitleAccent: 'tempo dilatato e olio buono',
    heroDescription:
      'Valle d Itria, Salento, Gargano, Murgia. La Puglia e la regione del ritmo lento ben fatto: masserie, borghi bianchi, cene lunghe, mare onesto. Ti diciamo dove andare in alta stagione senza farti rovinare l esperienza.',
    heroImage:
      'https://images.unsplash.com/photo-1583407723467-9b2d22504831?q=80&w=2000&auto=format&fit=crop',
    minArticlesToPublish: 1,
    regionMatcher: ['Puglia', 'Salento', 'Valle d Itria', 'Valle d’Itria'],
    foodPreview: [
      {
        name: 'Orecchiette alle cime di rapa',
        region: 'Puglia',
        description:
          'Acciuga soffritta, aglio, peperoncino. Niente panna mai. Trattoria di paese, prezzo sotto i 12.',
      },
      {
        name: 'Bombette pugliesi',
        region: 'Valle d Itria',
        description:
          'Capocollo, formaggio, prezzemolo. In macelleria-braceria, alla griglia, davanti a te.',
      },
      {
        name: 'Pasticciotto leccese',
        region: 'Salento',
        description: 'Pasta frolla e crema pasticcera tiepida. Colazione vera al bar di paese.',
      },
    ],
  }),
  'italia/trentino-alto-adige': createItalianRegionHub({
    slug: 'trentino-alto-adige',
    name: 'Trentino-Alto Adige',
    heroEyebrow: 'Dolomiti',
    heroTitleAccent: 'rifugi contemporanei e quote di pace',
    heroDescription:
      'Dolomiti, Val Gardena, Val Pusteria, Val di Fassa. La regione che ha reinventato il rifugio di montagna: design contemporaneo, cucina alpina seria, sentieri da scegliere in quota. Stagione, prenotazione, scelta del lodge: ogni dettaglio conta.',
    heroImage:
      'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2000&auto=format&fit=crop',
    minArticlesToPublish: 1,
    regionMatcher: ['Trentino-Alto Adige', 'Trentino', 'Alto Adige', 'Dolomiti', 'Sudtirol'],
    foodPreview: [
      {
        name: 'Canederli',
        region: 'Alto Adige',
        description:
          'Pane raffermo, speck, formaggio, brodo. Il piatto che ti rimette in piedi dopo una camminata.',
      },
      {
        name: 'Speck Alto Adige IGP',
        region: 'Val Pusteria',
        description: 'Affumicato lentamente al ginepro. Cercane uno stagionato 24+ settimane.',
      },
      {
        name: 'Strudel di mele',
        region: 'Tirolo italiano',
        description: 'Pasta sottile, mele renette, uvetta, pinoli. In rifugio col Vinschger.',
      },
    ],
  }),
  'italia/toscana': createItalianRegionHub({
    slug: 'toscana',
    name: 'Toscana',
    heroEyebrow: 'Toscana',
    heroTitleAccent: 'la regione che chiunque crede di conoscere',
    heroDescription:
      'Chianti, Val d Orcia, Maremma, Firenze, Lucca. La Toscana che funziona davvero non e quella delle cartoline. Ti diciamo dove dormire senza turistificazione, dove mangiare lontano dai tour bus, e quando andare per evitare il caos di luglio.',
    heroImage:
      'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?q=80&w=2000&auto=format&fit=crop',
    minArticlesToPublish: 1,
    regionMatcher: ['Toscana', 'Chianti', 'Val d Orcia', 'Maremma'],
    foodPreview: [
      {
        name: 'Bistecca alla fiorentina',
        region: 'Firenze / Chianti',
        description: 'Chianina o maremmana, taglio alto, alla brace. Solo al sangue, mai discusso.',
      },
      {
        name: 'Pici cacio e pepe',
        region: 'Val d Orcia',
        description:
          'Pasta tirata a mano, pecorino di Pienza, pepe. La semplicita che non fa errori.',
      },
      {
        name: 'Lampredotto',
        region: 'Firenze',
        description:
          'Quarto stomaco del bovino, in panino con salsa verde. Street food vero, non per tutti.',
      },
    ],
  }),
  'italia/sardegna': createItalianRegionHub({
    slug: 'sardegna',
    name: 'Sardegna',
    heroEyebrow: 'Sardegna',
    heroTitleAccent: 'non solo Costa Smeralda',
    heroDescription:
      'Gallura, Asinara, Ogliastra, Sulcis, interno barbaricino. La Sardegna premia chi va oltre la costa nord patinata. Calette deserte, agriturismi seri, montagna che pochi raccontano. Ti diciamo come muoverti, dove dormire e cosa salvare per stagione.',
    heroImage:
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=2000&auto=format&fit=crop',
    minArticlesToPublish: 1,
    regionMatcher: ['Sardegna', 'Gallura', 'Ogliastra', 'Sulcis', 'Barbagia'],
    foodPreview: [
      {
        name: 'Culurgiones',
        region: 'Ogliastra / Barbagia',
        description:
          'Ravioli di patate, menta, pecorino, chiusura a spiga. Solo nelle trattorie dell interno.',
      },
      {
        name: 'Porceddu',
        region: 'Tutta la Sardegna',
        description:
          'Maialino arrosto, mirto, lentamente. Da vivere in un agriturismo di campagna.',
      },
      {
        name: 'Bottarga di muggine',
        region: 'Cabras',
        description: 'Grattugiata su spaghetti aglio e olio. Il caviale del Mediterraneo.',
      },
    ],
  }),
};

/**
 * Sub-hub Grecia per macro-area. Stessa logica di visibility gate dei regionali Italia.
 */
export const GREECE_SUB_HUBS: Record<string, DestinationHub> = {
  'grecia/cicladi': {
    slug: 'grecia/cicladi',
    country: 'Cicladi',
    flag: '🇬🇷',
    heroEyebrow: 'Cicladi',
    heroTitleMain: 'Cicladi,',
    heroTitleAccent: 'oltre Santorini',
    heroDescription:
      'Paros, Naxos, Milos, Folegandros, Amorgos. Le Cicladi che premiano chi sposta lo sguardo dalle isole-cartolina. Calette quasi vuote, taverne di paese, traghetti meno facili — e proprio per questo piu vere.',
    heroImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop',
    methodCards: [
      {
        title: 'Isola con criterio',
        text: 'Ogni Ciclade ha un mood diverso. Ti diciamo quale scegliere per ritmo, calette o nightlife.',
      },
      {
        title: 'Traghetti veri',
        text: 'Calendari, operatori, orari reali. La logistica e meta dell esperienza.',
      },
      {
        title: 'Taverne autentiche',
        text: 'Niente menu in 4 lingue. Cerchiamo la cucina di paese, non la versione patinata.',
      },
    ],
    subDestinations: [
      {
        name: 'Tutte le Cicladi',
        tagline: 'Archivio filtrato per isola, periodo, budget.',
        href: '/destinazioni?group=Europa&region=Cicladi',
        image:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop',
      },
    ],
    featuredArticleSlugs: [],
    travelTips: [
      {
        title: 'Quando andare',
        text: 'Meta maggio - meta giugno e settembre intero. Fuori stagione molte taverne chiudono.',
      },
      { title: 'Traghetti', text: 'Ferryhopper.com con 3-4 settimane di anticipo.' },
      { title: 'Noleggio', text: 'ATV o quad sulle isole piccole, auto solo dove ha senso.' },
      { title: 'Siesta', text: 'Tra le 14 e le 17 i villaggi sono fermi. Programma diversamente.' },
    ],
    foodPreview: [],
    affiliateIntro:
      'Servizi che usiamo per le Cicladi: traghetti, eSIM, assicurazione di viaggio. Tutti testati.',
    seo: {
      title: 'Cicladi — Guida Travelliniwithus',
      description:
        'Le Cicladi oltre Santorini: Paros, Naxos, Milos, Folegandros. Itinerari, hotel, food guide testati sul campo.',
      keywords: ['cicladi viaggio', 'isole greche', 'paros naxos milos', 'cicladi cosa vedere'],
    },
    parent: 'grecia',
    regionMatcher: ['Cicladi'],
    minArticlesToPublish: 3,
  },
  'grecia/dodecanneso': {
    slug: 'grecia/dodecanneso',
    country: 'Dodecanneso',
    flag: '🇬🇷',
    heroEyebrow: 'Dodecanneso',
    heroTitleMain: 'Dodecanneso,',
    heroTitleAccent: 'la Grecia meno turistica',
    heroDescription:
      'Rodi, Simi, Karpathos, Patmos, Tilos. Isole sul confine turco, mix di Bizantino e influenze ottomane, ritmo piu lento delle Cicladi.',
    heroImage:
      'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per il Dodecanneso: traghetti, eSIM, assicurazione.',
    seo: {
      title: 'Dodecanneso — Guida Travelliniwithus',
      description:
        'Rodi, Simi, Karpathos, Patmos. La Grecia meno turistica con itinerari, hotel e food guide.',
      keywords: ['dodecanneso', 'rodi viaggio', 'simi karpathos', 'isole greche orientali'],
    },
    parent: 'grecia',
    regionMatcher: ['Dodecanneso'],
    minArticlesToPublish: 3,
  },
  'grecia/peloponneso': {
    slug: 'grecia/peloponneso',
    country: 'Peloponneso',
    flag: '🇬🇷',
    heroEyebrow: 'Peloponneso',
    heroTitleMain: 'Peloponneso,',
    heroTitleAccent: 'road trip continentale',
    heroDescription:
      'Mani, Monemvasia, Nafplio, Olimpia, Mistra. Il Peloponneso e il road trip greco per eccellenza: rocche bizantine, archeologia di prima fila, calette segrete, cucina rurale.',
    heroImage:
      'https://images.unsplash.com/photo-1561611345-c8a0d1a5c7d0?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per il Peloponneso: noleggio auto, eSIM, assicurazione.',
    seo: {
      title: 'Peloponneso — Guida Travelliniwithus',
      description:
        'Road trip nel Peloponneso: Mani, Monemvasia, Nafplio, Mistra. Itinerari curati, hotel, archeologia.',
      keywords: [
        'peloponneso road trip',
        'mani peninsula',
        'monemvasia nafplio',
        'grecia continentale',
      ],
    },
    parent: 'grecia',
    regionMatcher: ['Peloponneso'],
    minArticlesToPublish: 3,
  },
  'grecia/creta': {
    slug: 'grecia/creta',
    country: 'Creta',
    flag: '🇬🇷',
    heroEyebrow: 'Creta',
    heroTitleMain: 'Creta,',
    heroTitleAccent: 'sud selvaggio e gole nascoste',
    heroDescription:
      'Chania, Rethymno, Heraklion, Sfakia, Plakias, Samaria. La Creta del sud e ancora meno turistica del nord: gole, taverne di villaggio, montagne che cadono in mare.',
    heroImage:
      'https://images.unsplash.com/photo-1602868054930-ceec9b56c6b1?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per Creta: noleggio auto, eSIM, assicurazione.',
    seo: {
      title: 'Creta — Guida Travelliniwithus',
      description:
        'Creta sud: Chania, Sfakia, gole di Samaria, taverne di villaggio. Itinerari curati e hotel testati.',
      keywords: ['creta viaggio', 'chania rethymno', 'samaria gole', 'creta sud'],
    },
    parent: 'grecia',
    regionMatcher: ['Creta'],
    minArticlesToPublish: 3,
  },
  'grecia/grecia-continentale': {
    slug: 'grecia/grecia-continentale',
    country: 'Grecia continentale',
    flag: '🇬🇷',
    heroEyebrow: 'Grecia continentale',
    heroTitleMain: 'Grecia continentale,',
    heroTitleAccent: 'oltre le isole',
    heroDescription:
      'Atene, Meteore, Delfi, Pelio, Epiro, Macedonia. La Grecia continentale e meno fotografata ma piu profonda. Monasteri sospesi, cucina di terra, montagne dell Epiro.',
    heroImage:
      'https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per la Grecia continentale: noleggio auto, eSIM, assicurazione.',
    seo: {
      title: 'Grecia continentale — Guida Travelliniwithus',
      description:
        'Atene, Meteore, Delfi, Pelio, Epiro. La Grecia continentale fuori dalle rotte mainstream.',
      keywords: ['grecia continentale', 'meteore monasteri', 'delfi pelio', 'epiro'],
    },
    parent: 'grecia',
    regionMatcher: ['Grecia continentale', 'Atene', 'Meteore'],
    minArticlesToPublish: 3,
  },
  'grecia/isole-ionie': {
    slug: 'grecia/isole-ionie',
    country: 'Isole Ionie',
    flag: '🇬🇷',
    heroEyebrow: 'Isole Ionie',
    heroTitleMain: 'Isole Ionie,',
    heroTitleAccent: 'verde, mare, calma',
    heroDescription:
      'Corfu, Cefalonia, Itaca, Lefkada, Zante, Paxos. Le Ionie sono piu verdi delle Cicladi, l acqua cristallina, le influenze veneziane visibili. Per chi vuole calette spettacolari senza l aridita egea.',
    heroImage:
      'https://images.unsplash.com/photo-1582719367507-ad04e10c4d59?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per le Ionie: traghetti, eSIM, assicurazione.',
    seo: {
      title: 'Isole Ionie — Guida Travelliniwithus',
      description:
        'Corfu, Cefalonia, Itaca, Lefkada, Zante. Le Ionie verdi e cristalline con itinerari testati.',
      keywords: ['isole ionie', 'corfu cefalonia', 'lefkada zante', 'ionie viaggio'],
    },
    parent: 'grecia',
    regionMatcher: ['Isole Ionie', 'Corfu', 'Cefalonia', 'Lefkada', 'Zante'],
    minArticlesToPublish: 3,
  },
};

/**
 * Sub-hub Portogallo per area. Stessa logica visibility gate.
 */
export const PORTUGAL_SUB_HUBS: Record<string, DestinationHub> = {
  'portogallo/lisbona': {
    slug: 'portogallo/lisbona',
    country: 'Lisbona',
    flag: '🇵🇹',
    heroEyebrow: 'Lisbona',
    heroTitleMain: 'Lisbona,',
    heroTitleAccent: 'la capitale che cambia ritmo a ogni quartiere',
    heroDescription:
      'Alfama, Bairro Alto, Chiado, Belem, LX Factory. Lisbona vista bene non e una citta da fotografare in due giorni: e una capitale che si svela quartiere per quartiere, con tempo lento e tram storico.',
    heroImage:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: ['lisbona-weekend-lento'],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per Lisbona: hotel, esperienze, eSIM.',
    seo: {
      title: 'Lisbona — Guida Travelliniwithus',
      description:
        'Lisbona quartiere per quartiere: Alfama, Chiado, Belem, LX Factory. Itinerari lenti e indirizzi testati.',
      keywords: ['lisbona guida', 'lisbona cosa vedere', 'lisbona quartieri', 'weekend lisbona'],
    },
    parent: 'portogallo',
    regionMatcher: ['Lisbona'],
    minArticlesToPublish: 3,
  },
  'portogallo/alentejo': {
    slug: 'portogallo/alentejo',
    country: 'Alentejo',
    flag: '🇵🇹',
    heroEyebrow: 'Alentejo',
    heroTitleMain: 'Alentejo,',
    heroTitleAccent: 'il Portogallo profondo',
    heroDescription:
      'Evora, Monsaraz, Mertola, Comporta. L Alentejo e la regione del ritmo dilatato: ulivi, vigneti, villaggi bianchi, agriturismi seri. Per chi vuole un Portogallo lontano dalle costiere turistiche.',
    heroImage:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per l Alentejo: noleggio auto, hotel, eSIM.',
    seo: {
      title: 'Alentejo — Guida Travelliniwithus',
      description:
        'Alentejo profondo: Evora, Monsaraz, Comporta. Agriturismi, vigneti e villaggi bianchi del Portogallo lento.',
      keywords: ['alentejo viaggio', 'evora monsaraz', 'portogallo entroterra', 'comporta'],
    },
    parent: 'portogallo',
    regionMatcher: ['Alentejo'],
    minArticlesToPublish: 3,
  },
  'portogallo/algarve': {
    slug: 'portogallo/algarve',
    country: 'Algarve',
    flag: '🇵🇹',
    heroEyebrow: 'Algarve',
    heroTitleMain: 'Algarve,',
    heroTitleAccent: 'oltre Lagos',
    heroDescription:
      'Lagos, Sagres, Alvor, Tavira, costa Vicentina. L Algarve vero e quello dopo Sagres, dove le scogliere sono piu grandi e i turisti piu pochi. Pesce del giorno, calette nascoste, surf serio.',
    heroImage:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per Algarve: noleggio auto, hotel, surf school.',
    seo: {
      title: 'Algarve — Guida Travelliniwithus',
      description:
        'Algarve oltre Lagos: Sagres, costa Vicentina, calette nascoste. Itinerari surf e slow travel.',
      keywords: ['algarve viaggio', 'sagres costa vicentina', 'algarve calette', 'algarve surf'],
    },
    parent: 'portogallo',
    regionMatcher: ['Algarve'],
    minArticlesToPublish: 3,
  },
  'portogallo/madeira': {
    slug: 'portogallo/madeira',
    country: 'Madeira',
    flag: '🇵🇹',
    heroEyebrow: 'Madeira',
    heroTitleMain: 'Madeira,',
    heroTitleAccent: 'oceano, foreste, sentieri verticali',
    heroDescription:
      'Funchal, Camara de Lobos, Porto Moniz, Pico Ruivo, levadas. Madeira e l isola atlantica per chi vuole trekking serio, panorami brutali e poesia portoghese vera.',
    heroImage:
      'https://images.unsplash.com/photo-1525428935428-a32d8d2bf4cb?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per Madeira: noleggio auto, hotel, esperienze trekking.',
    seo: {
      title: 'Madeira — Guida Travelliniwithus',
      description:
        'Madeira atlantica: Funchal, levadas, Pico Ruivo. Trekking, oceano e poesia portoghese vera.',
      keywords: ['madeira viaggio', 'levadas trekking', 'pico ruivo', 'madeira cosa vedere'],
    },
    parent: 'portogallo',
    regionMatcher: ['Madeira'],
    minArticlesToPublish: 3,
  },
  'portogallo/azzorre': {
    slug: 'portogallo/azzorre',
    country: 'Azzorre',
    flag: '🇵🇹',
    heroEyebrow: 'Azzorre',
    heroTitleMain: 'Azzorre,',
    heroTitleAccent: "le Hawaii d'Europa",
    heroDescription:
      'Sao Miguel, Pico, Faial, Terceira, Flores. L arcipelago atlantico portoghese: vulcani attivi, lagune nei crateri, balene, idromassaggi termali in mezzo all oceano.',
    heroImage:
      'https://images.unsplash.com/photo-1562882527-1d8a17a5e94f?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per Azzorre: voli interni, hotel, esperienze whale watching.',
    seo: {
      title: 'Azzorre — Guida Travelliniwithus',
      description:
        'Azzorre vulcaniche: Sao Miguel, Pico, Flores. Lagune, balene e termali atlantiche.',
      keywords: [
        'azzorre viaggio',
        'sao miguel pico',
        'azzorre cosa vedere',
        'whale watching azzorre',
      ],
    },
    parent: 'portogallo',
    regionMatcher: ['Azzorre', 'Acores'],
    minArticlesToPublish: 3,
  },
  'portogallo/porto-e-douro': {
    slug: 'portogallo/porto-e-douro',
    country: 'Porto e Douro',
    flag: '🇵🇹',
    heroEyebrow: 'Porto e Douro',
    heroTitleMain: 'Porto e Douro,',
    heroTitleAccent: 'il vino e il fiume',
    heroDescription:
      'Porto, Vila Nova de Gaia, Pinhao, Peso da Regua, Lamego. La regione del Porto wine, terrazzamenti che salgono dal Douro, cantine storiche, treno panoramico.',
    heroImage:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2000&auto=format&fit=crop',
    methodCards: [],
    subDestinations: [],
    featuredArticleSlugs: [],
    travelTips: [],
    foodPreview: [],
    affiliateIntro: 'Servizi per Porto e Douro: hotel, tour cantine, treno panoramico.',
    seo: {
      title: 'Porto e Douro — Guida Travelliniwithus',
      description:
        'Porto e la valle del Douro: vini fortificati, terrazzamenti UNESCO, cantine storiche, treno panoramico.',
      keywords: ['porto portogallo', 'douro valle vino', 'pinhao porto wine', 'douro train'],
    },
    parent: 'portogallo',
    regionMatcher: ['Porto', 'Douro'],
    minArticlesToPublish: 3,
  },
};

// Merge regional + sub-hubs nel registro principale.
Object.assign(DESTINATION_HUBS, ITALIAN_REGION_HUBS, GREECE_SUB_HUBS, PORTUGAL_SUB_HUBS);
