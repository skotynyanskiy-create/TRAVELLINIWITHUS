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
