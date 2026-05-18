import type { ArchiveItem } from '../utils/contentArchive';
import type { DestinationGroup, ExperienceType, GuideCategory } from './contentTaxonomy';

/**
 * Demo archive — 30 voci editoriali distribuite su tutti i gruppi/tipi.
 *
 * Usato come fallback quando Firestore `articles` e' vuoto (dev/preview mode),
 * cosi' che /destinazioni, /esperienze, /guide, /itinerari, /mappa abbiano
 * sempre contenuto da mostrare in archivio.
 *
 * Ogni voce e' marcata implicitamente come preview perche' linka a slug che
 * vivono in PREVIEW_ARTICLES (gestiti come noindex finche' contenuto reale
 * non e' pronto). Sostituzione hot-swap quando R+B pubblica un articolo reale
 * con lo stesso slug su Firestore.
 */

const IMG = {
  dolomiti: '/images/destinations/dolomiti.webp',
  puglia: '/images/destinations/puglia.webp',
  toscana: '/images/destinations/toscana.webp',
  sardegna: '/images/destinations/sardegna.webp',
  amalfi: '/images/hero-amalfi.webp',
  giappone: '/images/destinations/giappone.webp',
  islanda: '/images/destinations/islanda.webp',
  africa: '/images/destinations/africa.webp',
  americhe: '/images/destinations/americhe.webp',
  oceania: '/images/destinations/oceania.webp',
  romantico: '/images/experiences/romantico.webp',
  gastronomia: '/images/experiences/gastronomia.webp',
  avventura: '/images/experiences/avventura.webp',
  insolito: '/images/experiences/insolito.webp',
  about: '/images/brand/about-editorial.webp',
  couple: '/images/brand/couple-travel.webp',
} as const;

interface ArchiveSeed {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: GuideCategory | string;
  country: string;
  region?: string;
  city?: string;
  continent: string;
  destinationGroup: DestinationGroup;
  experienceTypes: ExperienceType[];
  period: string;
  budget: 'Lean' | 'Medio' | 'Premium';
  duration: string;
  readTime: string;
  coordinates: [number, number]; // [lng, lat]
}

const SEEDS: ArchiveSeed[] = [
  // ====== ITALIA (10) ======
  {
    slug: 'salento-agosto-coppia',
    title: 'Salento ad agosto in coppia: 3 giorni reali, niente fila',
    excerpt:
      'Tre giorni tra masserie, calette e cucina di mare a misura di coppia, evitando le ore di folla e i circuiti gonfiati.',
    image: IMG.puglia,
    category: 'Itinerari completi',
    country: 'Italia',
    region: 'Puglia',
    city: 'Otranto, Gallipoli, Castro',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Hotel con carattere', 'Weekend romantici', 'Food & Ristoranti'],
    period: 'Maggio - Settembre',
    budget: 'Medio',
    duration: 'Weekend lungo',
    readTime: '9 min',
    coordinates: [18.1604, 40.1187], // Lecce
  },
  {
    slug: 'cilento-mare-italiano',
    title: 'Cilento ad agosto: il mare italiano fuori dal radar',
    excerpt:
      'Un Sud più lento di Capri, più asciutto della Costiera: spiagge piccole, paesi di pietra e una cucina che non recita.',
    image: IMG.amalfi,
    category: 'Posti particolari',
    country: 'Italia',
    region: 'Campania',
    city: 'Palinuro, Marina di Camerota',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Posti particolari', 'Passeggiate panoramiche', 'Food & Ristoranti'],
    period: 'Giugno - Settembre',
    budget: 'Medio',
    duration: 'Settimana',
    readTime: '8 min',
    coordinates: [15.281, 40.0339], // Palinuro
  },
  {
    slug: 'toscana-borghi-nascosti',
    title: 'Toscana: i borghi che nessuno conosce',
    excerpt:
      'Lontano da Firenze e Siena, una Toscana di borghi sospesi nel tempo: Pitigliano, Lucignano, Casentino.',
    image: IMG.toscana,
    category: 'Posti particolari',
    country: 'Italia',
    region: 'Toscana',
    city: 'Pitigliano, Lucignano, Poppi',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ["Borghi e città d'arte", 'Posti particolari'],
    period: "Tutto l'anno",
    budget: 'Medio',
    duration: 'Weekend lungo',
    readTime: '7 min',
    coordinates: [11.667, 42.638], // Pitigliano
  },
  {
    slug: 'costiera-amalfitana-fuori-stagione',
    title: 'Costiera Amalfitana: sfuggire alla folla e trovare la magia',
    excerpt:
      'Come godersi Positano, Amalfi e Ravello evitando i periodi peggiori: calette intime, sentieri panoramici, ristoranti fidati.',
    image: IMG.amalfi,
    category: 'Weekend & Day trip',
    country: 'Italia',
    region: 'Campania',
    city: 'Positano, Amalfi, Ravello',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Weekend romantici', 'Passeggiate panoramiche', 'Hotel con carattere'],
    period: 'Aprile - Giugno, Settembre',
    budget: 'Premium',
    duration: 'Weekend lungo',
    readTime: '8 min',
    coordinates: [14.6261, 40.6291], // Amalfi
  },
  {
    slug: 'puglia-trulli-masserie',
    title: 'Puglia: trulli, masserie e costa adriatica',
    excerpt:
      'Oltre il turismo di massa: i luoghi più autentici della Puglia, dalle grotte marine ai borghi in pietra bianca.',
    image: IMG.puglia,
    category: 'Itinerari completi',
    country: 'Italia',
    region: 'Puglia',
    city: 'Alberobello, Polignano, Locorotondo',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ["Borghi e città d'arte", 'Food & Ristoranti', 'Hotel con carattere'],
    period: 'Maggio - Settembre',
    budget: 'Medio',
    duration: 'Settimana',
    readTime: '10 min',
    coordinates: [17.3845, 40.8333], // Ostuni area
  },
  {
    slug: 'dolomiti-rifugi-design',
    title: 'Dolomiti: tra rifugi di design e vette leggendarie',
    excerpt:
      'Un itinerario tra rifugi di design, panorami iconici e spunti pratici per vivere le Dolomiti nel modo giusto.',
    image: IMG.dolomiti,
    category: 'Guide',
    country: 'Italia',
    region: 'Trentino-Alto Adige',
    city: 'Val di Funes, Alta Badia',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Posti particolari', 'Passeggiate panoramiche', 'Hotel con carattere'],
    period: 'Giugno - Settembre',
    budget: 'Medio',
    duration: 'Weekend lungo',
    readTime: '8 min',
    coordinates: [11.8598, 46.4102],
  },
  {
    slug: 'sicilia-orientale-5-giorni',
    title: 'Sicilia orientale in 5 giorni: Catania, Siracusa, Etna',
    excerpt:
      'Da Catania popolare a Ortigia lenta, passando per l Etna al tramonto e la cena di pesce a Brucoli.',
    image: IMG.sardegna,
    category: 'Itinerari completi',
    country: 'Italia',
    region: 'Sicilia',
    city: 'Catania, Siracusa, Taormina',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Food & Ristoranti', "Borghi e città d'arte", 'Insolito'],
    period: 'Primavera - Autunno',
    budget: 'Medio',
    duration: 'Settimana',
    readTime: '9 min',
    coordinates: [15.0873, 37.5079], // Catania
  },
  {
    slug: 'sardegna-interna-barbagia',
    title: 'Sardegna interna: la Barbagia oltre il mare',
    excerpt:
      'L isola che pochi cercano: pastori, supramonti, pani carasau caldo, feste antiche e un silenzio che cambia il viaggio.',
    image: IMG.sardegna,
    category: 'Posti particolari',
    country: 'Italia',
    region: 'Sardegna',
    city: 'Orgosolo, Mamoiada, Nuoro',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Posti particolari', 'Insolito', 'Food & Ristoranti'],
    period: 'Aprile - Ottobre',
    budget: 'Lean',
    duration: 'Weekend lungo',
    readTime: '7 min',
    coordinates: [9.3306, 40.319], // Nuoro
  },
  {
    slug: 'roma-quartieri-fuori-rotta',
    title: 'Roma: quartieri fuori rotta che vale la pena vivere',
    excerpt:
      'Garbatella, Pigneto, Quadraro: una Roma di trattorie quotidiane, street art e ritmo lontano dai bus turistici.',
    image: IMG.toscana,
    category: 'Posti particolari',
    country: 'Italia',
    region: 'Lazio',
    city: 'Garbatella, Pigneto, Quadraro',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Insolito', 'Food & Ristoranti', "Borghi e città d'arte"],
    period: "Tutto l'anno",
    budget: 'Lean',
    duration: 'Weekend',
    readTime: '6 min',
    coordinates: [12.4964, 41.9028], // Roma
  },
  {
    slug: 'trentino-spa-weekend',
    title: 'Fuga in Trentino: 3 giorni spa e relax in montagna',
    excerpt:
      'Due notti, tre giorni pieni, una spa scelta bene, due passeggiate facili e cene di malga. Il weekend lento che funziona.',
    image: IMG.dolomiti,
    category: 'Weekend & Day trip',
    country: 'Italia',
    region: 'Trentino-Alto Adige',
    city: 'Val di Sole, Madonna di Campiglio',
    continent: 'Europa',
    destinationGroup: 'Italia',
    experienceTypes: ['Relax, terme e spa', 'Hotel con carattere', 'Weekend romantici'],
    period: "Tutto l'anno",
    budget: 'Premium',
    duration: 'Weekend',
    readTime: '6 min',
    coordinates: [10.8267, 46.2289], // Madonna di Campiglio
  },

  // ====== EUROPA (8) ======
  {
    slug: 'islanda-ring-road',
    title: 'Islanda: Ring Road in autonomia, 10 giorni',
    excerpt:
      'Come pianificare tappe, alloggi e meteo per la Ring Road senza tour guidati: il viaggio nordico fatto bene.',
    image: IMG.islanda,
    category: 'Itinerari completi',
    country: 'Islanda',
    region: "Tutta l'isola",
    city: 'Reykjavík, Vík, Höfn',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Passeggiate panoramiche', 'Posti particolari', 'Insolito'],
    period: 'Giugno - Agosto',
    budget: 'Premium',
    duration: 'Slow trip',
    readTime: '12 min',
    coordinates: [-18.4836, 64.9631],
  },
  {
    slug: 'andalusia-4-giorni-coppia',
    title: 'Andalusia in 4 giorni: Siviglia, Cordoba, ritmo reale',
    excerpt:
      "Quattro giorni tra Siviglia e Cordoba pensati per chi non ha tempo ma vuole entrare nel ritmo dell'Andalusia.",
    image: IMG.toscana,
    category: 'Weekend & Day trip',
    country: 'Spagna',
    region: 'Andalusia',
    city: 'Siviglia, Cordoba',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Weekend romantici', "Borghi e città d'arte", 'Food & Ristoranti'],
    period: 'Marzo - Maggio, Settembre - Ottobre',
    budget: 'Medio',
    duration: 'Weekend lungo',
    readTime: '8 min',
    coordinates: [-5.9845, 37.3891], // Siviglia
  },
  {
    slug: 'praga-febbraio-coppia',
    title: 'Praga a febbraio in coppia: 3 giorni a -5° C che vale la pena',
    excerpt:
      'Cosa fare a Praga d inverno per evitare la folla, scaldarsi nei caffè storici e capire la città oltre il Ponte Carlo.',
    image: IMG.islanda,
    category: 'Weekend & Day trip',
    country: 'Repubblica Ceca',
    region: 'Boemia',
    city: 'Praga',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Weekend romantici', "Borghi e città d'arte"],
    period: 'Dicembre - Febbraio',
    budget: 'Lean',
    duration: 'Weekend',
    readTime: '7 min',
    coordinates: [14.4378, 50.0755],
  },
  {
    slug: 'slovenia-8-giorni-slow',
    title: 'Slovenia slow in 8 giorni: Bled, Lubiana, Soča',
    excerpt:
      'L Europa minore che merita: lago, capitale piccola, valle alpina, vini orange e prezzi sensati.',
    image: IMG.dolomiti,
    category: 'Itinerari completi',
    country: 'Slovenia',
    region: 'Carniola, Valle dell Isonzo',
    city: 'Lubiana, Bled, Kobarid',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Insolito', 'Passeggiate panoramiche', 'Posti particolari'],
    period: 'Maggio - Settembre',
    budget: 'Medio',
    duration: 'Settimana',
    readTime: '9 min',
    coordinates: [14.5058, 46.0569],
  },
  {
    slug: 'cornovaglia-mare-inglese',
    title: 'Cornovaglia: il mare inglese che non ti aspetti',
    excerpt:
      'Scogliere, villaggi di pescatori, fish & chips e sentieri sospesi: la Cornovaglia che vale il viaggio.',
    image: IMG.islanda,
    category: 'Posti particolari',
    country: 'Regno Unito',
    region: 'Cornovaglia',
    city: 'St Ives, Padstow, Tintagel',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Passeggiate panoramiche', 'Posti particolari', 'Food & Ristoranti'],
    period: 'Maggio - Settembre',
    budget: 'Medio',
    duration: 'Settimana',
    readTime: '7 min',
    coordinates: [-5.0527, 50.2129], // St Ives
  },
  {
    slug: 'lisbona-quartieri-locali',
    title: 'Lisbona oltre Belém: quartieri vivi, locali veri',
    excerpt:
      'Marvila, Graça, Alfama: la Lisbona dove si lavora, si mangia e si beve come ai tempi pre-Instagram.',
    image: IMG.toscana,
    category: 'Posti particolari',
    country: 'Portogallo',
    region: 'Estremadura',
    city: 'Lisbona',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Insolito', 'Food & Ristoranti', "Borghi e città d'arte"],
    period: "Tutto l'anno",
    budget: 'Lean',
    duration: 'Weekend lungo',
    readTime: '7 min',
    coordinates: [-9.1393, 38.7223],
  },
  {
    slug: 'croazia-isole-dalmazia',
    title: 'Croazia: isole della Dalmazia oltre Hvar',
    excerpt:
      'Vis, Korčula, Lastovo: piccole isole più lente, taverne di famiglia, calette dove non passano gli yacht.',
    image: IMG.puglia,
    category: 'Posti particolari',
    country: 'Croazia',
    region: 'Dalmazia',
    city: 'Vis, Korčula, Lastovo',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Posti particolari', 'Weekend romantici', 'Food & Ristoranti'],
    period: 'Giugno - Settembre',
    budget: 'Medio',
    duration: 'Settimana',
    readTime: '8 min',
    coordinates: [16.4399, 43.0584], // Hvar area
  },
  {
    slug: 'norvegia-fiordi-roadtrip',
    title: 'Norvegia: fiordi e Trollstigen in roadtrip',
    excerpt:
      'Quindici giorni in auto tra Bergen, Geirangerfjord e Lofoten: distanze gestibili, parcheggi reali, alloggi sostenibili.',
    image: IMG.islanda,
    category: 'Itinerari completi',
    country: 'Norvegia',
    region: 'Fiordi occidentali',
    city: 'Bergen, Ålesund, Lofoten',
    continent: 'Europa',
    destinationGroup: 'Europa',
    experienceTypes: ['Passeggiate panoramiche', 'Posti particolari', 'Insolito'],
    period: 'Giugno - Agosto',
    budget: 'Premium',
    duration: 'Slow trip',
    readTime: '12 min',
    coordinates: [5.3221, 60.3913], // Bergen
  },

  // ====== ASIA (5) ======
  {
    slug: 'giappone-14-giorni-itinerario',
    title: "Giappone in 14 giorni: l'itinerario che usiamo davvero",
    excerpt:
      'Tokyo, Hakone, Kyoto, Naoshima: due settimane reali con tempi di spostamento veri e indirizzi food testati.',
    image: IMG.giappone,
    category: 'Itinerari completi',
    country: 'Giappone',
    region: 'Honshu, Shikoku',
    city: 'Tokyo, Kyoto, Naoshima',
    continent: 'Asia',
    destinationGroup: 'Asia',
    experienceTypes: ['Food & Ristoranti', 'Posti particolari', "Borghi e città d'arte"],
    period: 'Marzo - Maggio, Ottobre - Novembre',
    budget: 'Premium',
    duration: 'Slow trip',
    readTime: '14 min',
    coordinates: [139.6917, 35.6895], // Tokyo
  },
  {
    slug: 'nord-delle-filippine',
    title: "Nord delle Filippine: l'itinerario non turistico",
    excerpt:
      'Dal caos di Manila ai terrazzamenti di riso di Banaue, fino alle tribù del Nord. Un viaggio per animi vagabondi.',
    image: IMG.giappone,
    category: 'Itinerari completi',
    country: 'Filippine',
    region: 'Luzon',
    city: 'Manila, Banaue, Sagada',
    continent: 'Asia',
    destinationGroup: 'Asia',
    experienceTypes: ['Insolito', 'Passeggiate panoramiche', 'Posti particolari'],
    period: 'Novembre - Aprile',
    budget: 'Medio',
    duration: 'Slow trip',
    readTime: '12 min',
    coordinates: [121.0612, 14.5995], // Manila
  },
  {
    slug: 'vietnam-nord-slow',
    title: 'Vietnam del Nord slow: Hanoi, Ninh Binh, Ha Giang',
    excerpt:
      'Dieci giorni tra città lenta, risaie ridenti e passi di montagna: il Vietnam autentico in moto e in barca.',
    image: IMG.giappone,
    category: 'Itinerari completi',
    country: 'Vietnam',
    region: 'Nord',
    city: 'Hanoi, Ninh Binh, Ha Giang',
    continent: 'Asia',
    destinationGroup: 'Asia',
    experienceTypes: ['Insolito', 'Food & Ristoranti', 'Passeggiate panoramiche'],
    period: 'Ottobre - Aprile',
    budget: 'Lean',
    duration: 'Settimana',
    readTime: '10 min',
    coordinates: [105.8542, 21.0285], // Hanoi
  },
  {
    slug: 'indonesia-sumba-isola',
    title: "Sumba, Indonesia: l'isola che pochi raggiungono",
    excerpt:
      'Lontano da Bali e Lombok, Sumba ha villaggi tribali, spiagge selvagge e ritmo lento. Il viaggio che ricorderete.',
    image: IMG.giappone,
    category: 'Posti particolari',
    country: 'Indonesia',
    region: 'Piccole Isole della Sonda',
    city: 'Waikabubak, Tarimbang',
    continent: 'Asia',
    destinationGroup: 'Asia',
    experienceTypes: ['Posti particolari', 'Hotel con carattere', 'Insolito'],
    period: 'Maggio - Ottobre',
    budget: 'Premium',
    duration: 'Settimana',
    readTime: '8 min',
    coordinates: [119.5, -9.6667],
  },
  {
    slug: 'bali-sud-uluwatu',
    title: 'Bali sud: Uluwatu, surf e hotel con vista',
    excerpt:
      'La parte più poetica di Bali: scogliere, surf scuole, hotel boutique e ristoranti dove tornare ogni sera.',
    image: IMG.giappone,
    category: 'Hotel con carattere',
    country: 'Indonesia',
    region: 'Bali',
    city: 'Uluwatu, Bukit',
    continent: 'Asia',
    destinationGroup: 'Asia',
    experienceTypes: ['Hotel con carattere', 'Weekend romantici', 'Passeggiate panoramiche'],
    period: 'Aprile - Ottobre',
    budget: 'Premium',
    duration: 'Settimana',
    readTime: '7 min',
    coordinates: [115.0858, -8.8294], // Uluwatu
  },

  // ====== AMERICHE (3) ======
  {
    slug: 'patagonia-trek-torres',
    title: 'Patagonia: trek alle Torres del Paine in autonomia',
    excerpt:
      'W trek o O trek? Quando andare, cosa portare, come prenotare rifugi. La Patagonia spiegata senza retorica.',
    image: IMG.americhe,
    category: 'Itinerari completi',
    country: 'Cile',
    region: 'Patagonia cilena',
    city: 'Puerto Natales, Torres del Paine',
    continent: 'Americhe',
    destinationGroup: 'Americhe',
    experienceTypes: ['Passeggiate panoramiche', 'Insolito', 'Posti particolari'],
    period: 'Novembre - Marzo',
    budget: 'Premium',
    duration: 'Settimana',
    readTime: '11 min',
    coordinates: [-73.0867, -50.9423], // Torres del Paine
  },
  {
    slug: 'cuba-strade-musica',
    title: 'Cuba: strade, musica e case particular',
    excerpt:
      'Quindici giorni tra L Avana, Trinidad e Viñales. Casas particulares, viaggi in collettivo e cucina cubana vera.',
    image: IMG.americhe,
    category: 'Itinerari completi',
    country: 'Cuba',
    region: 'Caraibi',
    city: 'L Avana, Trinidad, Viñales',
    continent: 'Americhe',
    destinationGroup: 'Americhe',
    experienceTypes: ['Insolito', 'Food & Ristoranti', "Borghi e città d'arte"],
    period: 'Novembre - Aprile',
    budget: 'Lean',
    duration: 'Slow trip',
    readTime: '10 min',
    coordinates: [-82.366, 23.1136], // L'Avana
  },
  {
    slug: 'messico-yucatan-cenotes',
    title: 'Yucatán: cenote, rovine maya e cucina di strada',
    excerpt:
      'Tre settimane tra Mérida, Valladolid e la costa Tulum: cenote segreti, mercati e tacos al pastor a 10 pesos.',
    image: IMG.americhe,
    category: 'Itinerari completi',
    country: 'Messico',
    region: 'Yucatán',
    city: 'Mérida, Valladolid, Tulum',
    continent: 'Americhe',
    destinationGroup: 'Americhe',
    experienceTypes: ['Posti particolari', 'Food & Ristoranti', 'Insolito'],
    period: 'Novembre - Aprile',
    budget: 'Medio',
    duration: 'Slow trip',
    readTime: '10 min',
    coordinates: [-89.5926, 20.967], // Mérida
  },

  // ====== AFRICA (2) ======
  {
    slug: 'marocco-riad-fes',
    title: 'Marocco: Fes, riad e medine ancora vere',
    excerpt:
      'Cinque giorni a Fes per chi vuole capire il Marocco oltre Marrakech: riad di famiglia, hammam, sufismo e cucina lenta.',
    image: IMG.africa,
    category: 'Hotel con carattere',
    country: 'Marocco',
    region: 'Atlante',
    city: 'Fes, Chefchaouen',
    continent: 'Africa',
    destinationGroup: 'Africa',
    experienceTypes: ['Hotel con carattere', "Borghi e città d'arte", 'Posti particolari'],
    period: 'Marzo - Maggio, Ottobre - Novembre',
    budget: 'Medio',
    duration: 'Weekend lungo',
    readTime: '8 min',
    coordinates: [-5.0078, 34.0181], // Fes
  },
  {
    slug: 'sudafrica-kruger-safari',
    title: 'Sudafrica: safari al Kruger in autonomia',
    excerpt:
      'Come organizzare un self-drive safari al Kruger senza tour-operator: campi reali, costi reali, leoni a 10 metri.',
    image: IMG.africa,
    category: 'Itinerari completi',
    country: 'Sudafrica',
    region: 'Mpumalanga',
    city: 'Kruger Park, Hazyview',
    continent: 'Africa',
    destinationGroup: 'Africa',
    experienceTypes: ['Insolito', 'Hotel con carattere', 'Posti particolari'],
    period: 'Maggio - Settembre',
    budget: 'Premium',
    duration: 'Settimana',
    readTime: '11 min',
    coordinates: [31.4659, -24.9947], // Kruger Park
  },

  // ====== OCEANIA (2) ======
  {
    slug: 'australia-outback-uluru',
    title: "Australia: roadtrip nell'Outback fino a Uluru",
    excerpt:
      'Sette giorni nel rosso centro australiano: Alice Springs, Kings Canyon, Uluru. Aborigeni, stelle e silenzi.',
    image: IMG.oceania,
    category: 'Itinerari completi',
    country: 'Australia',
    region: 'Territorio del Nord',
    city: 'Alice Springs, Uluru, Kings Canyon',
    continent: 'Oceania',
    destinationGroup: 'Oceania',
    experienceTypes: ['Insolito', 'Passeggiate panoramiche', 'Posti particolari'],
    period: 'Maggio - Settembre',
    budget: 'Premium',
    duration: 'Settimana',
    readTime: '9 min',
    coordinates: [131.0369, -25.3444], // Uluru
  },
  {
    slug: 'nuova-zelanda-south-island',
    title: 'Nuova Zelanda: South Island in 12 giorni',
    excerpt:
      'Fiordland, Wanaka, Aoraki Mount Cook: dodici giorni tra ghiacciai, laghi turchesi e cieli stellati senza confronti.',
    image: IMG.oceania,
    category: 'Itinerari completi',
    country: 'Nuova Zelanda',
    region: 'South Island',
    city: 'Queenstown, Wanaka, Milford Sound',
    continent: 'Oceania',
    destinationGroup: 'Oceania',
    experienceTypes: ['Passeggiate panoramiche', 'Posti particolari', 'Insolito'],
    period: 'Novembre - Marzo',
    budget: 'Premium',
    duration: 'Slow trip',
    readTime: '12 min',
    coordinates: [167.9214, -44.6711], // Milford Sound
  },
];

const BUDGET_TO_LABEL: Record<ArchiveSeed['budget'], string> = {
  Lean: 'Sotto i 600',
  Medio: '600 - 1500',
  Premium: 'Sopra i 1500',
};

export const DEMO_ARCHIVE_ITEMS: ArchiveItem[] = SEEDS.map((seed) => ({
  id: seed.slug,
  title: seed.title,
  excerpt: seed.excerpt,
  image: seed.image,
  link: `/articolo/${seed.slug}`,
  category: seed.category,
  country: seed.country,
  region: seed.region,
  city: seed.city,
  continent: seed.continent,
  location: [seed.country, seed.region, seed.city].filter(Boolean).join(', '),
  destinationGroup: seed.destinationGroup,
  experienceTypes: seed.experienceTypes,
  primaryExperience: seed.experienceTypes[0],
  period: seed.period,
  budget: BUDGET_TO_LABEL[seed.budget],
  duration: seed.duration,
}));

export const DEMO_ARCHIVE_SLUGS = SEEDS.map((seed) => seed.slug);

/**
 * Marker mappa per /mappa — uno per destinazione, con coordinate reali e
 * categoria primaria mappata a icona/colore via experienceVisuals.
 */
export const DEMO_ARCHIVE_MAP_MARKERS = SEEDS.map((seed) => ({
  id: seed.slug,
  name: seed.city || seed.region || seed.country,
  coordinates: seed.coordinates,
  title: seed.title,
  category: seed.experienceTypes[0],
  image: seed.image,
  link: `/articolo/${seed.slug}`,
}));

/**
 * Esposizione del raw seed per builders di preview content (previewContent.ts)
 * che hanno bisogno di tutti i campi originali (readTime, coordinates etc.).
 */
export type { ArchiveSeed };
export const DEMO_ARCHIVE_SEEDS = SEEDS;
