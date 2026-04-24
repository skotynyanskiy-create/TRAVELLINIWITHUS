import type { ArticleData } from '../components/article';
import { DEMO_ARTICLE_SLUG } from './demoContent';

type PreviewArticle = ArticleData & { id: string; slug: string; excerpt: string };

export const PREVIEW_EXPERIENCE_TYPES: Record<string, string[]> = {
  'dolomiti-rifugi-design': ['Hotel con carattere', 'Passeggiate panoramiche', 'Posti particolari'],
  'puglia-roadtrip-borghi-bianchi': [
    "Borghi e città d'arte",
    'Food & Ristoranti',
    'Hotel con carattere',
  ],
  'sicilia-orientale-5-giorni': [
    "Borghi e città d'arte",
    'Food & Ristoranti',
    'Esperienze insolite',
  ],
  'islanda-ring-road-10-giorni': [
    'Posti particolari',
    'Passeggiate panoramiche',
    'Esperienze insolite',
  ],
  'islanda-ring-road-inverno': [
    'Posti particolari',
    'Passeggiate panoramiche',
    'Esperienze insolite',
  ],
  'lisbona-weekend-lento': ['Food & Ristoranti', 'Locali insoliti', "Borghi e città d'arte"],
  'provenza-lavanda-luberon': [
    'Passeggiate panoramiche',
    "Borghi e città d'arte",
    'Food & Ristoranti',
  ],
  'giappone-kyoto-osaka-14-giorni': [
    'Posti particolari',
    'Food & Ristoranti',
    'Hotel con carattere',
  ],
  'vietnam-hoi-an-8-giorni': ['Esperienze insolite', 'Food & Ristoranti', 'Posti particolari'],
  'peru-valle-sacra-machu-picchu': [
    'Passeggiate panoramiche',
    'Esperienze insolite',
    'Posti particolari',
  ],
  'west-coast-usa-roadtrip-14-giorni': [
    'Passeggiate panoramiche',
    'Hotel con carattere',
    'Posti particolari',
  ],
  'marocco-medina-deserto-7-giorni': [
    'Esperienze insolite',
    'Food & Ristoranti',
    'Hotel con carattere',
  ],
  'nuova-zelanda-south-island-12-giorni': [
    'Passeggiate panoramiche',
    'Posti particolari',
    'Esperienze insolite',
  ],
  'weekend-borgo-lento': ["Borghi e città d'arte", 'Weekend romantici', 'Gite e day trip'],
  'sardegna-nord-7-giorni-guida-completa': [
    'Hotel con carattere',
    'Passeggiate panoramiche',
    'Posti particolari',
  ],
};

export const PREVIEW_ARTICLES: Record<string, PreviewArticle> = {
  [DEMO_ARTICLE_SLUG]: {
    id: DEMO_ARTICLE_SLUG,
    slug: DEMO_ARTICLE_SLUG,
    title: 'Dolomiti: rifugi di design e sentieri da salvare',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Tre giorni tra rifugi contemporanei e sentieri panoramici, pensati per chi vuole un weekend forte senza trasformarlo in una checklist.',
    description:
      'Una guida editoriale tra rifugi contemporanei, panorami forti e scelte pratiche per vivere un weekend sulle Dolomiti con ritmo calmo, senza ridurlo a una lista di cose da spuntare.',
    location: 'Trentino-Alto Adige, Italia',
    period: 'Giugno - ottobre',
    budget: '€€',
    duration: '3 giorni',
    readTime: '9 min',
    date: '17 marzo 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
Le Dolomiti non sono un luogo da spuntare. Sono un ritmo: una salita fatta con calma, un rifugio scelto bene, un punto dove fermarsi prima che arrivi la folla. Questa guida e il weekend che ci siamo costruiti noi, tra Val Gardena e Alpe di Siusi, pensato per chi ha tre giorni reali e vuole viverli senza correre.

## Perche andarci

Il valore delle Dolomiti non sta nella foto panoramica, ma nel modo in cui cambia la luce in mezz'ora: una parete verticale diventa rosa al tramonto, un lago piatto si copre di vapore all'alba. Ci sono sentieri che premiano la lentezza e rifugi dove la cena e un gesto lento, non una tappa.

## Cosa sapere prima

La finestra migliore va da meta giugno a fine settembre. Luglio e agosto sono carichi, quindi i rifugi principali vanno prenotati 3-4 mesi prima. Giugno e settembre restituiscono una montagna piu vera: temperature giuste, luce pulita, pochi gruppi organizzati. L'attrezzatura base e scarponi gia rodati e una giacca antivento: il meteo cambia in fretta oltre i 2000 metri.

## Quando andare

Alba e tardo pomeriggio sono il momento in cui le Dolomiti diventano credibili. La fascia 11-15 sui sentieri famosi e da evitare: troppa gente, luce piatta, zero margine per fotografare senza stress. Prevedi almeno una giornata con partenza prima delle 7 e una cena al rifugio.

## Come arrivare

Per un weekend corto ha senso muoversi in auto e costruire una base unica in valle, invece di cambiare alloggio ogni notte. L'aeroporto di riferimento e Venezia (3h) o Innsbruck (2h). Una volta sul posto, molti passi si raggiungono solo in navetta nei weekend di alta stagione.

## Dove dormire

I rifugi contemporanei sono la vera differenza. Cerca strutture con architettura integrata, ristorazione onesta e prima colazione abbondante. Evita gli hotel "di passaggio" con decor stanco: in Dolomiti la stanza e parte dell'esperienza, non un letto neutro.

## Consiglio Travellini

Non cercare di vedere tutto. Scegli una valle, due punti forti e un margine per fermarti quando trovi qualcosa che funziona. Un viaggio piu corto ma leggibile resta molto piu memorabile di tre giorni a inseguire mete.
`,
    highlights: [
      'Rifugi con architettura contemporanea e vista aperta',
      'Sentieri panoramici gestibili in un weekend',
      'Periodo e ritmo pensati per evitare l effetto checklist',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo in valle e prima luce',
        description:
          'Check-in nella base scelta, passeggiata breve al tramonto e cena lenta. Serve per entrare nel ritmo senza bruciare energie al primo giorno.',
      },
      {
        day: 2,
        title: 'Sentiero panoramico e rifugio',
        description:
          'Giornata piena dedicata al percorso piu scenografico, con pausa lunga in rifugio e rientro prima del buio. Partenza alle 7 per avere il sentiero libero.',
      },
      {
        day: 3,
        title: 'Lago o belvedere finale',
        description:
          'Ultima tappa leggera prima del rientro, scelta in base a meteo e traffico del passo. Meglio chiudere con qualcosa di calmo che con un altro sentiero impegnativo.',
      },
    ],
    tips: [
      'Prenota rifugi e hotel 3-4 mesi prima se viaggi nei weekend tra luglio e agosto.',
      'Tieni sempre un piano B breve per i cambi meteo improvvisi oltre i 2000 metri.',
      'Scarica mappe offline: in quota la connessione non e affidabile.',
      'Evita le ore centrali sui sentieri famosi, luce piatta e troppa gente.',
      'Prevedi 2 litri d acqua e snack salati per i percorsi sopra le 4 ore.',
    ],
    packingList: [
      'Scarponi da trekking gia usati',
      'Giacca antivento leggera',
      'Pile tecnico per la sera in quota',
      'Borraccia o thermos da 1 litro',
      'Power bank 10.000 mAh',
      'Mappe offline su smartphone',
      'Crema solare fattore 50',
      'Occhiali da sole con lente scura',
    ],
    hiddenGems: [
      {
        title: 'Malga Furcia dei Fers',
        description: 'rifugio piccolo con cucina casalinga e vista aperta',
      },
      {
        title: 'Sentiero dell Adolf Munkel al mattino',
        description: 'prima che arrivino i gruppi',
      },
    ],
    localFood: [
      { name: 'Canederli', description: 'In brodo in un rifugio di quota' },
      {
        name: 'Speck e formaggio di malga con pane di segale',
        description: 'Speck e formaggio di malga con pane di segale',
      },
      { name: 'Strudel fatto', description: 'In casa con gelato alla vaniglia' },
    ],
    costs: {
      alloggio: '80-140 € a notte per coppia',
      cibo: '25-40 € a persona in rifugio',
      trasporti: '10-20 € al giorno',
      attivita: '550-750 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 1 },
      { month: 'Febbraio', rating: 1 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 3 },
      { month: 'Maggio', rating: 3 },
      { month: 'Giugno', rating: 5 },
      { month: 'Luglio', rating: 5 },
      { month: 'Agosto', rating: 5 },
      { month: 'Settembre', rating: 5 },
      { month: 'Ottobre', rating: 3 },
      { month: 'Novembre', rating: 3 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'alpe-siusi',
        name: 'Alpe di Siusi',
        title: 'Alpe di Siusi',
        category: 'Altopiano',
        coordinates: [11.6372, 46.5428],
      },
      {
        id: 'seceda',
        name: 'Seceda',
        title: 'Seceda',
        category: 'Vetta panoramica',
        coordinates: [11.7558, 46.6037],
      },
      {
        id: 'tre-cime',
        name: 'Tre Cime di Lavaredo',
        title: 'Tre Cime',
        category: 'Sentiero iconico',
        coordinates: [12.2958, 46.6182],
      },
    ],
    mapCenter: [11.8598, 46.55],
    mapZoom: 9,
    isMarkdown: true,
    shopCta: {
      productType: 'maps',
      productUrl: '/shop/mappa-dolomiti-rifugi',
      count: 18,
    },
    hotels: [
      {
        name: 'Forestis Dolomites',
        image:
          'https://images.unsplash.com/photo-1578898886225-c7b38bfe1d45?q=80&w=1600&auto=format&fit=crop',
        bookingUrl: 'https://www.booking.com/hotel/it/forestis-dolomites.it.html',
        category: 'Wellness in quota',
        rating: 9.4,
        priceHint: '€420',
        badge: 'Nostra scelta',
      },
      {
        name: 'Adler Lodge Ritten',
        image:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600&auto=format&fit=crop',
        bookingUrl: 'https://www.booking.com/hotel/it/adler-lodge-ritten.it.html',
        category: 'Lodge contemporaneo',
        rating: 9.2,
        priceHint: '€310',
      },
      {
        name: 'Icaro Hotel',
        image:
          'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?q=80&w=1600&auto=format&fit=crop',
        bookingUrl: 'https://www.booking.com/hotel/it/icaro.it.html',
        category: 'Design di montagna',
        rating: 9.0,
        priceHint: '€240',
      },
    ],
  },

  'puglia-roadtrip-borghi-bianchi': {
    id: 'puglia-roadtrip-borghi-bianchi',
    slug: 'puglia-roadtrip-borghi-bianchi',
    title: 'Puglia slow: roadtrip tra borghi bianchi e masserie',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Cinque giorni tra Valle d Itria, masserie di pietra e tavole lente. Un itinerario costruito per non ridurre la Puglia a una cartolina.',
    description:
      'Un roadtrip di cinque giorni tra borghi bianchi, masserie e cene lente della Valle d Itria: un itinerario pugliese costruito per non ridurre la regione a una cartolina affollata.',
    location: 'Valle d Itria, Puglia, Italia',
    period: 'Maggio - giugno, settembre',
    budget: '€€',
    duration: '5 giorni',
    readTime: '10 min',
    date: '2 aprile 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    verifiedContext: '5 giorni in Valle d’Itria',
    factBox: {
      title: 'Valle d’Itria in breve',
      items: [
        { label: 'Durata', value: '5 giorni' },
        { label: 'Periodo ideale', value: 'Maggio–giugno, settembre' },
        { label: 'Budget 2 pax', value: '€€' },
        { label: 'Distanze massime', value: '≈40 km' },
      ],
    },
    pullQuote: {
      text: 'Alberobello al mattino presto, mai di pomeriggio. E soprattutto: non riempire ogni giorno. La Puglia funziona se lasci spazio alle cene lunghe, non se corri tra trulli e selfie.',
      attribution: 'Consiglio Travellini',
    },
    content: `
La Puglia vissuta nei weekend di agosto e un altra cosa rispetto a quella di fine maggio. Quando la luce e piu pulita e i borghi si svuotano, i muri bianchi e le masserie di pietra recuperano la loro gerarchia. Questo itinerario e il nostro piano per chi ha cinque giorni reali e vuole evitare il circuito sovraffollato.

## Perche andarci

La Valle d Itria e uno dei pochi luoghi in Italia dove l architettura vernacolare resiste al marketing turistico. Trulli autentici, masserie fortificate, borghi bianchi appesi su piccole alture: la coerenza visiva e rara. Aggiungi una cucina di territorio senza compromessi e una distanza corta tra i punti di interesse, e l itinerario si costruisce da solo.

## Cosa sapere prima

Evita luglio e agosto se vuoi vedere davvero la Puglia. Maggio, giugno e settembre sono i mesi giusti: temperature miti, mare balneabile, borghi vivibili. Prenota la masseria-base 3 mesi prima: le migliori hanno pochissime stanze. Serve un auto a noleggio: i trasporti pubblici tra i borghi sono lenti e poco frequenti.

## Come arrivare

L aeroporto di riferimento e Bari (1h dalla valle) o Brindisi (45 min). Prendi l auto in aeroporto e non lasciarla per i 5 giorni. Le distanze sono brevi (max 40 km tra i punti), ma le strade bianche rurali richiedono attenzione.

## L itinerario

Giorno 1: arrivo a Locorotondo, passeggiata al tramonto, cena in masseria. Giorno 2: Alberobello al mattino presto (prima delle 9), pomeriggio a Cisternino, tappa gelato. Giorno 3: Ostuni e costa di Polignano. Giorno 4: Martina Franca barocca e cantina. Giorno 5: mare a Torre Guaceto o rientro lento.

## Dove dormire

Base unica in masseria: evita il turn-over notturno. Cerca strutture con piscina, ulivi secolari e ristorazione interna. La masseria giusta e gia il 50% del viaggio: e il luogo dove farai colazioni lunghe e apertivi senza uscire.

## Consiglio Travellini

Alberobello al mattino presto, mai di pomeriggio. E soprattutto: non riempire ogni giorno. La Puglia funziona se lasci spazio alle cene lunghe, non se corri tra trulli e selfie.
`,
    highlights: [
      'Base unica in masseria per ridurre stress e ottimizzare cene lente',
      'Circuito Alberobello-Locorotondo-Cisternino-Martina Franca senza folla',
      'Focus food e vini del territorio, non solo architettura',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo e Locorotondo',
        description:
          'Pick-up auto in aeroporto, check-in masseria, passeggiata al tramonto nel borgo piu fotogenico della valle, cena in masseria.',
      },
      {
        day: 2,
        title: 'Alberobello e Cisternino',
        description:
          'Alberobello alle 8 del mattino per i trulli senza folla, pranzo a Cisternino, pomeriggio lento in masseria con piscina.',
      },
      {
        day: 3,
        title: 'Ostuni e mare',
        description:
          'Ostuni citta bianca al mattino, pranzo veloce, pomeriggio a Polignano a Mare con bagno e aperitivo vista scogliera.',
      },
      {
        day: 4,
        title: 'Martina Franca e cantina',
        description:
          'Martina Franca barocca, pranzo in trattoria, visita cantina con degustazione primitivo di Manduria nel pomeriggio.',
      },
      {
        day: 5,
        title: 'Mare e rientro',
        description:
          'Mattinata a Torre Guaceto (riserva naturale), pranzo leggero, rientro aeroporto nel pomeriggio.',
      },
    ],
    tips: [
      'Prenota masserie 3 mesi prima, le migliori hanno 5-8 stanze totali.',
      'Alberobello solo al mattino presto o al tramonto, mai in fascia 11-17.',
      'Taglia il primo a pranzo e chiedi solo antipasti: la varieta e la parte piu forte.',
      'Porta contanti per i mercati rurali: non tutti accettano carta.',
      'Noleggia auto piccola: i vicoli dei borghi sono stretti.',
    ],
    packingList: [
      'Scarpe da passeggio con suola robusta (pietre lisce)',
      'Costume da bagno',
      'Giacca leggera per la sera',
      'Cappello da sole',
      'Crema solare fattore alto',
      'Borraccia',
    ],
    hiddenGems: [
      {
        title: 'Trattoria Terra Madre a Cisternino',
        description: 'cucina contadina senza turismo',
      },
      { title: 'Riserva di Torre Guaceto', description: 'mare trasparente a 30 min da Ostuni' },
    ],
    localFood: [
      { name: 'Orecchiette con cime di rapa', description: 'In trattoria di campagna' },
      { name: 'Bombette cistranesi alla brace', description: 'Bombette cistranesi alla brace' },
      { name: 'Focaccia barese calda al mattino', description: 'Focaccia barese calda al mattino' },
    ],
    costs: {
      alloggio: '120-200 € a notte per coppia',
      cibo: '30-50 € a persona',
      trasporti: '35-50 € al giorno',
      attivita: '1.200-1.600 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 3 },
      { month: 'Febbraio', rating: 2 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 5 },
      { month: 'Maggio', rating: 5 },
      { month: 'Giugno', rating: 5 },
      { month: 'Luglio', rating: 2 },
      { month: 'Agosto', rating: 2 },
      { month: 'Settembre', rating: 5 },
      { month: 'Ottobre', rating: 4 },
      { month: 'Novembre', rating: 2 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'alberobello',
        name: 'Alberobello',
        title: 'Alberobello',
        category: 'Borgo UNESCO',
        coordinates: [17.2356, 40.7833],
      },
      {
        id: 'ostuni',
        name: 'Ostuni',
        title: 'Ostuni',
        category: 'Citta bianca',
        coordinates: [17.5794, 40.7293],
      },
      {
        id: 'polignano',
        name: 'Polignano a Mare',
        title: 'Polignano',
        category: 'Costa',
        coordinates: [17.2197, 40.9961],
      },
      {
        id: 'locorotondo',
        name: 'Locorotondo',
        title: 'Locorotondo',
        category: 'Borgo',
        coordinates: [17.3264, 40.7536],
      },
    ],
    mapCenter: [17.35, 40.82],
    mapZoom: 9,
    isMarkdown: true,
  },

  'sicilia-orientale-5-giorni': {
    id: 'sicilia-orientale-5-giorni',
    slug: 'sicilia-orientale-5-giorni',
    title: 'Sicilia orientale in 5 giorni: Ortigia, Etna, Noto',
    category: 'Weekend & Day trip',
    image:
      'https://images.unsplash.com/photo-1559113202-c916b8e44373?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Cinque giorni tra barocco di Noto, scirocco di Ortigia e lava dell Etna. Un itinerario costruito per evitare il giro frettoloso.',
    description:
      'Un itinerario pensato di 5 giorni tra Ortigia, il barocco di Noto e l Etna: Sicilia orientale vissuta lentamente, senza ridurla a una fotografia da feed.',
    location: 'Sicilia orientale, Italia',
    period: 'Aprile - giugno, settembre - ottobre',
    budget: '€€',
    duration: '5 giorni',
    readTime: '9 min',
    date: '15 marzo 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
La Sicilia orientale in cinque giorni si puo fare, ma solo se rinunci all idea di vedere tutto. Questo e il nostro piano: base unica a Siracusa, quattro escursioni precise e una giornata sull Etna. Luce forte, cibo onesto, ritmo che non si spezza.

## Perche andarci

L oriente siciliano ha tre cose che non trovi altrove nella stessa regione: un isola barocca (Ortigia), un vulcano attivo raggiungibile in auto (Etna) e una cittadina patrimonio UNESCO (Noto) tutta in pietra giallo oro. Aggiungi cucina di pesce e granita al mattino, e l itinerario si costruisce senza sforzo.

## Cosa sapere prima

Evita luglio e agosto: Catania supera i 38 gradi, Siracusa e invasa. Aprile-giugno e settembre-ottobre sono i mesi giusti. Per l Etna serve giacca antivento anche d estate: in cima la temperatura crolla. Prenota guida certificata se vuoi salire sopra i 2500 metri.

## Come arrivare

Aeroporto di Catania (40 min da Siracusa). Auto a noleggio obbligatoria: i trasporti pubblici tra Ortigia e i paesi circostanti sono lenti. In centro Siracusa non portare l auto, usa i parcheggi esterni e spostati a piedi.

## L itinerario

Giorno 1: arrivo a Siracusa, sera a Ortigia. Giorno 2: Ortigia a piedi, mattina ai mercati, pomeriggio al mare a Fontane Bianche. Giorno 3: Noto e Marzamemi (barocco + pesce fresco). Giorno 4: Etna con guida, rifugio a meta altezza, cantina sul ritorno. Giorno 5: Modica e Ragusa Ibla, rientro in serata.

## Dove dormire

Base unica a Ortigia: un B&B in un palazzo storico, dentro la zona pedonale. Eviti il traffico di Siracusa moderna e vivi a piedi ogni sera. Cerca strutture con terrazza sul mare o vista sul Duomo: le notti estive sono il momento piu forte.

## Consiglio Travellini

L Etna non e una gita di mezza giornata, dedicale tutto il tempo. E Ortigia al tramonto e un rituale, non una tappa: prendi un aperitivo sul mare prima di cena, ogni singola sera.
`,
    highlights: [
      'Base unica a Ortigia, zero spostamenti notturni',
      'Etna in una giornata piena con guida certificata',
      'Noto + Marzamemi in un giorno, pranzo di pesce fresco',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo a Siracusa',
        description:
          'Pick-up auto a Catania, check-in a Ortigia, passeggiata al tramonto sul lungomare e cena di pesce.',
      },
      {
        day: 2,
        title: 'Ortigia e mare',
        description:
          'Mattina al mercato, visita al Duomo e alle vie del centro storico, pomeriggio al mare a Fontane Bianche.',
      },
      {
        day: 3,
        title: 'Noto e Marzamemi',
        description:
          'Noto barocca al mattino, pranzo di pesce a Marzamemi, rientro a Ortigia al tramonto.',
      },
      {
        day: 4,
        title: 'Etna con guida',
        description:
          'Salita all Etna con guida certificata, rifugio a quota 2500, discesa in cantina per degustazione di nerello mascalese.',
      },
      {
        day: 5,
        title: 'Ragusa Ibla e rientro',
        description:
          'Modica (cioccolato artigianale), Ragusa Ibla a pranzo, rientro aeroporto nel pomeriggio.',
      },
    ],
    tips: [
      'Parcheggia fuori Ortigia, gira solo a piedi.',
      'Per l Etna scegli sempre guide certificate se sali sopra i 2500 m.',
      'Granita con brioche al mattino: pistacchio e gelsi sono le due migliori.',
      'Prenota Noto al tramonto, la luce sulla pietra vale il biglietto.',
    ],
    packingList: [
      'Scarpe comode per pietra lisciata',
      'Giacca antivento per l Etna',
      'Costume e asciugamano mare',
      'Cappello e crema solare',
      'Felpa leggera per le sere a Ortigia',
    ],
    hiddenGems: [
      { title: 'Marzamemi al tramonto', description: 'borgo di pescatori senza folla' },
      { title: 'Cantina Planeta sull Etna', description: 'vini di nerello mascalese' },
    ],
    localFood: [
      { name: 'Pasta alla norma', description: 'In trattoria catanese' },
      {
        name: 'Arancino al ragu caldo al mattino',
        description: 'Arancino al ragu caldo al mattino',
      },
      {
        name: 'Cannolo siciliano fresco con ricotta',
        description: 'Cannolo siciliano fresco con ricotta',
      },
    ],
    costs: {
      alloggio: '90-150 € a notte per coppia',
      cibo: '1.100-1.500 €',
      trasporti: '30-45 € al giorno',
      attivita: '80-120 € a persona',
    },
    seasonality: [
      { month: 'Gennaio', rating: 3 },
      { month: 'Febbraio', rating: 4 },
      { month: 'Marzo', rating: 5 },
      { month: 'Aprile', rating: 5 },
      { month: 'Maggio', rating: 5 },
      { month: 'Giugno', rating: 3 },
      { month: 'Luglio', rating: 2 },
      { month: 'Agosto', rating: 2 },
      { month: 'Settembre', rating: 5 },
      { month: 'Ottobre', rating: 5 },
      { month: 'Novembre', rating: 4 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'ortigia',
        name: 'Ortigia',
        title: 'Ortigia',
        category: 'Isola storica',
        coordinates: [15.2929, 37.0597],
      },
      {
        id: 'etna',
        name: 'Etna',
        title: 'Etna',
        category: 'Vulcano attivo',
        coordinates: [14.9934, 37.751],
      },
      {
        id: 'noto',
        name: 'Noto',
        title: 'Noto',
        category: 'Barocco UNESCO',
        coordinates: [15.07, 36.89],
      },
    ],
    mapCenter: [15.1, 37.2],
    mapZoom: 8,
    isMarkdown: true,
  },

  'islanda-ring-road-10-giorni': {
    id: 'islanda-ring-road-10-giorni',
    slug: 'islanda-ring-road-10-giorni',
    title: 'Islanda Ring Road: 10 giorni di paesaggi impossibili',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Dieci giorni in senso orario sulla Ring Road, tra cascate, ghiacciai e spiagge nere. Itinerario costruito per chi non vuole correre.',
    description:
      'Un itinerario di 10 giorni sulla Ring Road islandese in senso orario, tra cascate potenti, ghiacciai e spiagge nere: viaggio costruito per chi vuole vedere senza correre.',
    location: 'Islanda',
    period: 'Giugno - agosto',
    budget: '€€€',
    duration: '10 giorni',
    readTime: '12 min',
    date: '8 marzo 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    verifiedContext: '10 giorni lungo la Ring Road',
    factBox: {
      title: 'Ring Road d’estate in breve',
      items: [
        { label: 'Durata', value: '10 giorni' },
        { label: 'Ring Road', value: '1.332 km' },
        { label: 'Periodo', value: 'Giugno–agosto' },
        { label: 'Budget 2 pax', value: '€4.500–5.800' },
      ],
    },
    pullQuote: {
      text: 'Non inseguire ogni cascata. Scegli le 5 migliori e dedica tempo a ognuna: le altre sono ripetizioni.',
      attribution: 'Consiglio Travellini',
    },
    content: `
L Islanda in dieci giorni sulla Ring Road e il classico viaggio dove ogni curva sembra uno sfondo impossibile. Il rischio e volerlo fotografare tutto e perderci il ritmo. Il nostro piano riduce le tappe a 5 basi notturne, non 10, e concentra la guida sulla mattina.

## Perche andarci

Non c e un altro paese in Europa dove trovi cascate potenti, ghiacciai accessibili a piedi, spiagge vulcaniche nere e geyser attivi nella stessa settimana. La Ring Road (strada 1) e l ossatura: 1.332 km che chiudono l anello. Farla in senso orario funziona meglio: i luoghi piu spettacolari del sud sono alla fine, e vali la pena arrivarci con occhi gia abituati.

## Cosa sapere prima

Periodo giugno-agosto per avere giorni lunghi (luce quasi 24h a giugno). Settembre per l aurora boreale ma clima rigido. Auto 4x4 solo se prevedi strade F (altopiani): per la Ring Road base bastano station wagon 2WD. Costi alti: hotel 180-250 € a notte, cena 60-80 € a coppia, pieno benzina 90 €.

## Come arrivare

Aeroporto di Reykjavik Keflavik. Pick-up auto in aeroporto, primo pernottamento a Reykjavik per smaltire jet lag. Noleggio auto da prenotare 4 mesi prima in alta stagione, altrimenti restano solo categorie basiche a prezzi altissimi.

## L itinerario

Giorno 1-2: Reykjavik + Golden Circle (Thingvellir, Geysir, Gullfoss). Giorno 3-4: costa sud (Seljalandsfoss, Skogafoss, Vik, Reynisfjara). Giorno 5: Vatnajokull (laguna glaciale di Jokulsarlon, spiaggia dei diamanti). Giorno 6-7: Fiordi orientali e Egilsstadir. Giorno 8: Myvatn e bagni geotermali. Giorno 9: Akureyri e penisola di Snaefellsnes. Giorno 10: rientro Reykjavik.

## Dove dormire

Cerca guesthouse con colazione inclusa e aria di casa, non hotel catena. I B&B islandesi sono spesso fattorie ristrutturate con cucina comune e prezzi sensati. Per notti chiave (Vik, Myvatn) prenota 4 mesi prima.

## Consiglio Travellini

Non inseguire ogni cascata. Scegli le 5 migliori (Gullfoss, Seljalandsfoss, Skogafoss, Dettifoss, Godafoss) e dedica tempo a ognuna. Le altre sono ripetizioni. E porta crema solare: a giugno il sole a mezzanotte brucia senza che te ne accorgi.
`,
    highlights: [
      'Ring Road in senso orario con 5 basi notturne, non 10',
      'Luce quasi 24h a giugno, aurora possibile da fine agosto',
      'Focus su 5 cascate principali invece di 20 ripetizioni',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Reykjavik',
        description:
          'Arrivo, passeggiata in centro, cena in ristorante islandese, early night per jet lag.',
      },
      {
        day: 2,
        title: 'Golden Circle',
        description: 'Thingvellir, Geysir, Gullfoss in giornata, rientro a Reykjavik o base sud.',
      },
      {
        day: 3,
        title: 'Costa sud: cascate',
        description: 'Seljalandsfoss, Skogafoss, notte a Vik.',
      },
      {
        day: 4,
        title: 'Spiagge nere e Vatnajokull',
        description: 'Reynisfjara, attraversamento verso la laguna glaciale, notte a Hofn.',
      },
      {
        day: 5,
        title: 'Jokulsarlon',
        description:
          'Laguna glaciale in barca, spiaggia dei diamanti, partenza verso i fiordi orientali.',
      },
      {
        day: 6,
        title: 'Fiordi orientali',
        description: 'Guida panoramica, Egilsstadir come base, sera in guesthouse.',
      },
      {
        day: 7,
        title: 'Myvatn',
        description: 'Bagni geotermali, Dettifoss, campi lavici, notte a Myvatn.',
      },
      {
        day: 8,
        title: 'Akureyri e nord',
        description: 'Akureyri capitale del nord, Godafoss, notte in penisola.',
      },
      {
        day: 9,
        title: 'Snaefellsnes',
        description: 'Kirkjufell, spiagge, notte ultima in guesthouse.',
      },
      {
        day: 10,
        title: 'Rientro',
        description: 'Trasferimento in aeroporto, volo rientro nel pomeriggio.',
      },
    ],
    tips: [
      'Prenota auto e guesthouse 4 mesi prima in alta stagione.',
      'Pieno sempre oltre la mezza tacca, stazioni rade nel nord.',
      'App Vedur.is per meteo affidabile, cambia ogni ora.',
      'Crema solare anche se sembra coperto, UV alto sul ghiaccio.',
      'Non uscire dalle strade segnate: multe salate.',
    ],
    packingList: [
      'Giacca impermeabile tecnica',
      'Scarponi impermeabili',
      'Strati tecnici merino',
      'Cappello e guanti leggeri',
      'Costume da bagno (piscine geotermali)',
      'Crema solare fattore 50',
      'Mascherina per dormire (luce 24h a giugno)',
      'Power bank grande',
    ],
    hiddenGems: [
      { title: 'Seydisfjordur', description: 'villaggio colorato nei fiordi orientali' },
      { title: 'Hverir', description: 'area geotermale fumante a Myvatn senza folla' },
    ],
    localFood: [
      {
        name: 'Zuppa di agnello islandese (kjotsupa)',
        description: 'Zuppa di agnello islandese (kjotsupa)',
      },
      { name: 'Pesce bianco freschissimo a Vik', description: 'Pesce bianco freschissimo a Vik' },
      {
        name: 'Skyr con frutti di bosco a colazione',
        description: 'Skyr con frutti di bosco a colazione',
      },
    ],
    costs: {
      alloggio: '180-250 € a notte per coppia',
      cibo: '50-80 € a persona al giorno',
      trasporti: '80-110 € al giorno',
      attivita: '4.500-5.800 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 3 },
      { month: 'Febbraio', rating: 3 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 3 },
      { month: 'Maggio', rating: 3 },
      { month: 'Giugno', rating: 5 },
      { month: 'Luglio', rating: 5 },
      { month: 'Agosto', rating: 5 },
      { month: 'Settembre', rating: 3 },
      { month: 'Ottobre', rating: 2 },
      { month: 'Novembre', rating: 1 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'reykjavik',
        name: 'Reykjavik',
        title: 'Reykjavik',
        category: 'Capitale',
        coordinates: [-21.9426, 64.1466],
      },
      {
        id: 'vik',
        name: 'Vik',
        title: 'Vik',
        category: 'Costa sud',
        coordinates: [-19.0083, 63.4194],
      },
      {
        id: 'jokulsarlon',
        name: 'Jokulsarlon',
        title: 'Jokulsarlon',
        category: 'Laguna glaciale',
        coordinates: [-16.1795, 64.0784],
      },
      {
        id: 'myvatn',
        name: 'Myvatn',
        title: 'Myvatn',
        category: 'Area geotermale',
        coordinates: [-16.9333, 65.6],
      },
    ],
    mapCenter: [-18.5, 64.9],
    mapZoom: 5,
    isMarkdown: true,
  },

  'islanda-ring-road-inverno': {
    id: 'islanda-ring-road-inverno',
    slug: 'islanda-ring-road-inverno',
    title: 'Islanda in inverno: Ring Road in 10 giorni, tra aurora e ghiaccio',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1504829857797-ddff29c27927?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Ring Road completa da novembre a febbraio. Quattro ore di luce, hot springs a meno 15, aurora hunting onesto. Non per tutti — ma unica.',
    description:
      'Itinerario circolare completo dell Islanda da novembre a febbraio, con 5 strutture testate, regole di guida invernale, e aurora hunting raccontato senza false promesse.',
    location: 'Islanda',
    period: 'Novembre - febbraio',
    budget: '€€€',
    duration: '10 giorni',
    readTime: '12 min',
    date: '24 aprile 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    verifiedContext: 'Ring Road in pieno inverno, 10 giorni',
    factBox: {
      title: 'Ring Road d’inverno in breve',
      items: [
        { label: 'Durata', value: '10 giorni' },
        { label: 'Ring Road', value: '1.332 km' },
        { label: 'Periodo', value: 'Novembre–febbraio' },
        { label: 'Budget 2 pax', value: '€3.500–5.000' },
      ],
    },
    pullQuote: {
      text: 'Metà febbraio è la nostra sweet spot: neve piena per le foto, giornate leggermente più lunghe di gennaio, aurora ancora forte.',
      attribution: 'Consiglio Travellini',
    },
    content: `
L Islanda d estate e bella ma e un parco a tema per bus turistici. L Islanda da novembre a febbraio e un altro paese: meno del 30% dei visitatori, aurora boreale regolare, prezzi hotel ragionevoli, paesaggi davvero solitari.

## Perche l inverno

Non e la vacanza facile. Dovrai guidare su ghiaccio 8 ore al giorno, gestire vento a 100 km/h, cambiare piani per meteo due volte al giorno. In cambio ottieni il cielo piu scuro del pianeta, hot springs private, 12 ore di notte utili per aurora hunting.

## Itinerario 10 giorni — Ring Road da Reykjavik

Giorno 1: Keflavik arrivo, Reykjavik. Giorno 2: Golden Circle (Thingvellir, Geysir, Gullfoss) + sud, notte Vik. Giorno 3: Skaftafell, Diamond Beach, notte Hof. Giorno 4: fiordi orientali. Giorno 5: Dettifoss, Myvatn. Giorno 6: Myvatn Nature Baths, Godafoss. Giorno 7: Akureyri. Giorno 8-9: Snaefellsnes peninsula, Hotel Budir. Giorno 10: rientro Keflavik.

## Dove dormire

Cinque strutture testate: Konsulat (Reykjavik), Hotel Kria (Vik), Fosshotel Glacier Lagoon (Hof), Vogafjos Farm Resort (Myvatn), Hotel Budir (Snaefellsnes). Prezzi inverno €200-380/notte — sensibilmente piu accessibili dell estate.

## Aurora boreale: verita

L indice Kp non basta. Cielo coperto = niente aurora anche con Kp 6. Controlla vedur.is (meteo islandese) insieme al Kp. Fascia tipica: mezzanotte-2am, ma puo apparire alle 22 o alle 4. Chi promette "aurora guaranteed" sta mentendo — su 10 notti abbiamo visto aurora 4 volte.

## Guida invernale

Auto 4x4 obbligatoria (Duster o sopra), gomme chiodate, controlla SafeTravel.is ogni mattina. F-roads (altopiano) chiuse ottobre-maggio. Mai uscire di strada per una foto: multa €300 + danno irreversibile.

## Consiglio Travellini

Meta febbraio e la nostra sweet spot: neve piena per le foto, giornate leggermente piu lunghe di gennaio, aurora ancora forte. Budget realistico 10 giorni in 2: €3.500-5.000 esclusi voli. Prenota tutto 4-5 mesi prima.
`,
    highlights: [
      'Ring Road completa con 5 basi notturne, rispettando ritmo invernale',
      'Aurora hunting onesto: come combinare Kp, meteo e luoghi bui',
      'Cinque strutture di design scelte per posizione e atmosfera invernale',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo Keflavik e prima notte Reykjavik',
        description:
          'Pickup auto 4x4, check-in Konsulat. Cena lenta in centro, jet lag soft. Prima uscita aurora se il cielo e libero.',
      },
      {
        day: 2,
        title: 'Golden Circle + costa sud',
        description:
          'Thingvellir, Geysir, Gullfoss al mattino. Seljalandsfoss e Skogafoss nel pomeriggio. Notte a Vik, Hotel Kria.',
      },
      {
        day: 3,
        title: 'Costa sud-est e laguna glaciale',
        description:
          'Parco Skaftafell, Diamond Beach, laguna Jokulsarlon al tramonto. Aurora da Fosshotel Glacier Lagoon.',
      },
      {
        day: 4,
        title: 'Fiordi orientali',
        description:
          'Trasferimento lento verso Egilsstadir. Pause a Djupivogur, tunnel Lagarfljot. Giornata di guida ma panorami solitari.',
      },
      {
        day: 5,
        title: 'Mývatn da est',
        description:
          'Dettifoss lato est (accessibile in inverno), area geotermica Namafjall. Check-in Vogafjos.',
      },
    ],
    tips: [
      'Auto 4x4 obbligatoria, gomme chiodate comprese nel noleggio.',
      'SafeTravel.is ogni mattina per chiusure strade e allerte vento.',
      'Power bank caldo addosso: l iPhone a -10°C muore in 20 minuti.',
      'Mezza giornata in piu per meteo imprevisto: non programmare ogni ora.',
      'Maschera da sci per vento laterale — serve davvero.',
    ],
    packingList: [
      'Merino 200g + pile tecnico + piumino + guscio Goretex',
      'Pantaloni tecnici + sotto-pantaloni merino',
      'Scarponi waterproof con ramponcini',
      'Cappello copri-orecchie + muffole',
      'Maschera da sci per vento',
      'Power bank 20.000 mAh',
      'Costume da bagno per hot springs',
    ],
    hiddenGems: [
      {
        title: 'Seljavallalaug pool',
        description: 'piscina termale abbandonata nella valle, accesso gratuito',
      },
      {
        title: 'Studlagil canyon',
        description: 'colonne basaltiche nell est, fuori dai tour classici',
      },
    ],
    localFood: [
      { name: 'Plokkfiskur', description: 'stufato di pesce e patate da Messinn, Reykjavik' },
      { name: 'Zuppa di agnello', description: 'calda e lenta da Svarta Kaffid, Reykjavik' },
      { name: 'Trota affumicata Laxa', description: 'servita al ristorante Vogafjos, Myvatn' },
      {
        name: 'Pane di segale cotto a vapore geotermico',
        description: 'Fontana Bakery, Laugarvatn',
      },
    ],
    mapMarkers: [
      {
        id: 'reykjavik',
        name: 'Reykjavik',
        title: 'Capitale',
        category: 'Capitale',
        coordinates: [-21.9, 64.1],
      },
      {
        id: 'vik',
        name: 'Vik',
        title: 'Costa sud, spiaggia nera Reynisfjara',
        category: 'Costa sud',
        coordinates: [-19.0, 63.42],
      },
      {
        id: 'jokulsarlon',
        name: 'Jokulsarlon',
        title: 'Laguna glaciale e Diamond Beach',
        category: 'Ghiacciai',
        coordinates: [-16.18, 64.05],
      },
      {
        id: 'myvatn',
        name: 'Myvatn',
        title: 'Area geotermica nord, Nature Baths',
        category: 'Area geotermale',
        coordinates: [-16.9333, 65.6],
      },
      {
        id: 'snaefellsnes',
        name: 'Snaefellsnes',
        title: 'Penisola vulcanica, Hotel Budir',
        category: 'Peninsula',
        coordinates: [-23.7, 64.84],
      },
    ],
    mapCenter: [-18.5, 64.9],
    mapZoom: 5,
    isMarkdown: true,
  },

  'lisbona-weekend-lento': {
    id: 'lisbona-weekend-lento',
    slug: 'lisbona-weekend-lento',
    title: 'Lisbona in un weekend lento: pastelarias, miradouros, tram 28',
    category: 'Weekend & Day trip',
    image:
      'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Tre giorni a Lisbona tra colline, vista sul Tago e pastelarias: un weekend costruito per evitare la trappola del tour veloce.',
    description:
      'Un weekend lento a Lisbona tra miradouros, pastelarias storiche e colline di Alfama: tre giorni per vivere la citta senza ridurla al tram 28 e ai pastel de nata.',
    location: 'Lisbona, Portogallo',
    period: 'Tutto l anno',
    budget: '€',
    duration: '3 giorni',
    readTime: '7 min',
    date: '20 febbraio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
Lisbona in un weekend funziona solo se rinunci all idea di fare troppo. Tre giorni reali bastano per Alfama, Baixa e un pomeriggio a Belem, ma devi accettare di camminare molto in salita e di bere caffe lungo tre volte al giorno. Questo e il ritmo giusto, non il tour dei bus.

## Perche andarci

Lisbona e una delle capitali europee meno snaturate: azulejos sui palazzi, tram gialli ancora funzionanti come mezzi veri, pastelarias di quartiere dove il pastel de nata costa ancora 1,30. La luce del Tago al tramonto e un pattern visivo unico, e il jet lag e minimo anche dall Italia.

## Cosa sapere prima

Periodo: tutto l anno, anche gennaio-febbraio (15 gradi medi). Agosto caldo ma non estremo. Evita maggio-luglio se odi la folla: le crociere scaricano 5.000 turisti al giorno. Scarpe con suola antiscivolo: i pavimenti di calcada sono scivolosi con la pioggia.

## Come arrivare

Volo diretto dai principali aeroporti italiani (2h30). Dall aeroporto di Humberto Delgado, metro linea rossa fino a Baixa (30 min, 1,80 euro). Non serve auto in citta: tutto e a piedi o con tram/metro. Prendi il Lisboa Card se resti piu di 48h e usi spesso i mezzi.

## L itinerario

Giorno 1: Baixa, Rossio, Chiado a piedi. Bar Alto al tramonto. Giorno 2: Alfama, Castello Sao Jorge, cena con fado autentico (non turistico). Giorno 3: Belem mattina (pasteis originali, torre, monastero), pomeriggio a Cascais in treno.

## Dove dormire

Base in Baixa o Chiado: zone centrali ma vissute dai locali, e puoi evitare il tram 28 affollato. Un appartamento con balcone vista Tago vale 20 euro in piu a notte. Evita Bairro Alto se dormi male con rumore: e zona movida fino alle 4 di notte.

## Consiglio Travellini

Pastel de nata solo a Belem (Pasteis de Belem, fila di 15 minuti ma vale). Il fado al ristorante Sr. Fado de Alfama, non nei posti con insegna "fado show" per turisti. E il tram 28 alle 8 di mattina, mai in fascia 11-17.
`,
    highlights: [
      'Weekend lento tra 3 quartieri, non tour veloce',
      'Pastel de nata originale a Belem',
      'Fado autentico, non spettacolo per turisti',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Baixa, Chiado, Bairro Alto',
        description:
          'Passeggiata in centro, pranzo in cervejaria, aperitivo al Miradouro de Sao Pedro de Alcantara al tramonto.',
      },
      {
        day: 2,
        title: 'Alfama e fado',
        description:
          'Salita al Castello Sao Jorge al mattino, pranzo in tasca, pomeriggio nei vicoli di Alfama, cena con fado autentico.',
      },
      {
        day: 3,
        title: 'Belem e Cascais',
        description:
          'Pasteis de Belem al mattino presto, torre e monastero dos Jeronimos, treno pomeriggio per Cascais.',
      },
    ],
    tips: [
      'Scarpe con suola antiscivolo, calcada e scivolosa con pioggia.',
      'Tram 28 solo prima delle 9 o dopo le 19.',
      'Pasteis de Belem e originale, le imitazioni non reggono.',
      'Lisboa Card conviene solo se entri in 3+ musei.',
      'Cascais raggiungibile in 40 min in treno da Cais do Sodre.',
    ],
    packingList: [
      'Scarpe da passeggio antiscivolo',
      'Ombrello pieghevole',
      'Felpa leggera',
      'Power bank',
    ],
    hiddenGems: [
      { title: 'Miradouro da Graca al tramonto', description: 'meno folla del Santa Luzia' },
      {
        title: 'Time Out Market ma solo per gli stand indipendenti',
        description: 'evita il mainstream',
      },
    ],
    localFood: [
      { name: 'Pastel de nata originale a Belem', description: 'Pastel de nata originale a Belem' },
      { name: 'Bacalhau a Bras', description: 'In tasca di Alfama' },
      { name: 'Ginjinha', description: 'In un bar di Rossio' },
    ],
    costs: {
      alloggio: '70-120 € a notte per coppia',
      cibo: '30-50 € a persona',
      trasporti: '3-10 € al giorno',
      attivita: '500-750 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 3 },
      { month: 'Febbraio', rating: 4 },
      { month: 'Marzo', rating: 5 },
      { month: 'Aprile', rating: 5 },
      { month: 'Maggio', rating: 3 },
      { month: 'Giugno', rating: 2 },
      { month: 'Luglio', rating: 2 },
      { month: 'Agosto', rating: 3 },
      { month: 'Settembre', rating: 5 },
      { month: 'Ottobre', rating: 5 },
      { month: 'Novembre', rating: 1 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'baixa',
        name: 'Baixa-Chiado',
        title: 'Baixa',
        category: 'Centro',
        coordinates: [-9.1425, 38.7101],
      },
      {
        id: 'alfama',
        name: 'Alfama',
        title: 'Alfama',
        category: 'Quartiere storico',
        coordinates: [-9.1295, 38.7127],
      },
      {
        id: 'belem',
        name: 'Belem',
        title: 'Belem',
        category: 'Area monumentale',
        coordinates: [-9.2036, 38.6977],
      },
    ],
    mapCenter: [-9.15, 38.71],
    mapZoom: 13,
    isMarkdown: true,
  },

  'provenza-lavanda-luberon': {
    id: 'provenza-lavanda-luberon',
    slug: 'provenza-lavanda-luberon',
    title: 'Provenza a giugno: lavanda, villaggi del Luberon, cene lente',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1499002238440-d264edd596ec?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Cinque giorni in Provenza nel momento giusto: lavanda in fiore, villaggi del Luberon e cene in bistrot. Senza il circuito dei bus.',
    description:
      'Un itinerario di 5 giorni in Provenza a giugno tra lavanda in fiore, villaggi del Luberon e cene lente in bistrot: viaggio costruito per evitare il circuito turistico di massa.',
    location: 'Provenza, Francia',
    period: 'Giugno - meta luglio',
    budget: '€€',
    duration: '5 giorni',
    readTime: '9 min',
    date: '10 marzo 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
La Provenza a giugno e il momento in cui le foto famose diventano realta: campi di lavanda violacei, villaggi di pietra appesi alle colline, cene lunghe sui tavoli fuori. La finestra e stretta: ultime due settimane di giugno e prime di luglio. Noi ci siamo andati fuori dal circuito dei bus.

## Perche andarci

Il Luberon e una delle poche aree europee dove i borghi medievali sono rimasti abitati, con botteghe vere e non solo souvenir. La lavanda di Valensole e il cliche per eccellenza, ma se arrivi a giugno puoi ancora trovarti in un campo da solo. Aggiungi mercatini settimanali, cucina di territorio e distanze brevissime, e l itinerario funziona.

## Cosa sapere prima

Fioritura lavanda: seconda meta di giugno fino a meta luglio. Oltre, i campi vengono tagliati. Prenota gite di Valensole e Sault prima dell alba: alle 7 la luce e perfetta e i bus non sono ancora arrivati. Auto a noleggio obbligatoria: i villaggi del Luberon sono collegati solo da strade minori.

## Come arrivare

Aeroporti: Marsiglia (ottimo per Luberon), Nizza (buono per Valensole). Pick-up auto in aeroporto, base unica in un villaggio del Luberon (Bonnieux o Gordes). Evita Aix-en-Provence come base: troppo grande e trafficata.

## L itinerario

Giorno 1: arrivo, base Luberon, cena in bistrot. Giorno 2: Gordes + Abbazia di Senanque (lavanda al mattino). Giorno 3: Roussillon (borgo ocra) + Bonnieux + cena. Giorno 4: Valensole all alba, pranzo a Moustiers-Sainte-Marie. Giorno 5: mercato provenzale e rientro.

## Dove dormire

Base in un mas (fattoria provenzale ristrutturata) o B&B di villaggio. Cerca strutture con piscina e giardino mediterraneo. Cena inclusa facoltativa ma spesso vale la pena: i ristoranti dei paesi sono piccoli e si riempiono in fretta in alta stagione.

## Consiglio Travellini

Valensole all alba, punto. Alle 7.30 la luce e perfetta e i campi sono vuoti. Alle 10 i bus arrivano e finisce tutto. E cerca i campi lungo la D8 anziche i "lavender fields famosi": meno folla, stessa resa.
`,
    highlights: [
      'Lavanda a Valensole all alba, senza bus',
      'Base in mas provenzale nel Luberon',
      'Cene lente in bistrot di villaggio',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo Luberon',
        description:
          'Pick-up auto a Marsiglia, trasferimento al mas (1h30), passeggiata in villaggio, cena in bistrot.',
      },
      {
        day: 2,
        title: 'Gordes e Senanque',
        description:
          'Gordes al mattino, Abbazia di Senanque con campo di lavanda, pomeriggio in piscina al mas.',
      },
      {
        day: 3,
        title: 'Roussillon e Bonnieux',
        description: 'Roussillon per il colore ocra, pranzo a Bonnieux, cena nel villaggio base.',
      },
      {
        day: 4,
        title: 'Valensole all alba',
        description:
          'Partenza alle 5.30, Valensole alle 7, pranzo a Moustiers-Sainte-Marie, rientro pomeriggio.',
      },
      {
        day: 5,
        title: 'Mercato e rientro',
        description:
          'Mercato provenzale al mattino (Isle-sur-la-Sorgue se e venerdi/domenica), pranzo leggero, rientro aeroporto.',
      },
    ],
    tips: [
      'Valensole sempre all alba, mai di giorno in alta stagione.',
      'Prenota cene nei villaggi piccoli il giorno prima.',
      'Noleggia auto piccola: i vicoli sono stretti.',
      'Porta asciugamano: piscina del mas vale metta del viaggio.',
      'Controlla giorni di mercato: cambiano per villaggio.',
    ],
    packingList: [
      'Scarpe da passeggio con suola',
      'Costume da bagno',
      'Cappello di paglia',
      'Giacca leggera per la sera',
      'Crema solare alta protezione',
      'Macchina fotografica (lavanda)',
    ],
    hiddenGems: [
      {
        title: 'Campo di lavanda lungo la D8 prima di Valensole',
        description: 'quasi sempre vuoto',
      },
      { title: 'Oppedele-le-Vieux', description: 'villaggio abbandonato medievale' },
    ],
    localFood: [
      { name: 'Ratatouille', description: 'In bistrot di villaggio' },
      { name: 'Formaggio di capra provenzale', description: 'Formaggio di capra provenzale' },
      { name: 'Aioli con pesce bianco', description: 'Aioli con pesce bianco' },
    ],
    costs: {
      alloggio: '150-220 € a notte per coppia',
      cibo: '40-60 € a persona',
      trasporti: '35-50 € al giorno',
      attivita: '1.500-2.000 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 1 },
      { month: 'Febbraio', rating: 2 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 3 },
      { month: 'Maggio', rating: 4 },
      { month: 'Giugno', rating: 5 },
      { month: 'Luglio', rating: 3 },
      { month: 'Agosto', rating: 3 },
      { month: 'Settembre', rating: 4 },
      { month: 'Ottobre', rating: 3 },
      { month: 'Novembre', rating: 2 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'gordes',
        name: 'Gordes',
        title: 'Gordes',
        category: 'Villaggio Luberon',
        coordinates: [5.2, 43.9119],
      },
      {
        id: 'valensole',
        name: 'Valensole',
        title: 'Valensole',
        category: 'Campi di lavanda',
        coordinates: [6.0739, 43.8369],
      },
      {
        id: 'roussillon',
        name: 'Roussillon',
        title: 'Roussillon',
        category: 'Borgo ocra',
        coordinates: [5.2928, 43.9028],
      },
    ],
    mapCenter: [5.6, 43.87],
    mapZoom: 9,
    isMarkdown: true,
  },

  'giappone-kyoto-osaka-14-giorni': {
    id: 'giappone-kyoto-osaka-14-giorni',
    slug: 'giappone-kyoto-osaka-14-giorni',
    title: 'Giappone slow: 14 giorni tra Kyoto, Osaka e Nara',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Quattordici giorni di Giappone centrale vissuto lentamente: Kyoto come base, Osaka per il cibo, Nara per i templi senza folla.',
    description:
      'Un itinerario di 14 giorni in Giappone centrale tra Kyoto, Osaka e Nara: viaggio costruito per vivere il Kansai con base fissa e slow pace, evitando il tour frenetico.',
    location: 'Kansai, Giappone',
    period: 'Marzo - aprile, ottobre - novembre',
    budget: '€€€',
    duration: '14 giorni',
    readTime: '14 min',
    date: '5 febbraio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Asia',
    content: `
Il Giappone in 14 giorni si puo fare in due modi: il tour veloce con 6 citta e jet lag costante, oppure il ritmo lento con una base unica e deviazioni in giornata. Noi abbiamo scelto il secondo: due settimane a Kyoto, con Osaka e Nara raggiunte in giornata. E il modo giusto per capire il Kansai senza ridurlo a checklist.

## Perche andarci

Il Kansai e la culla della cultura giapponese tradizionale: templi millenari, giardini zen, cerimonia del te, ryokan. Aggiungi la scena gastronomica di Osaka (capitale street food del paese) e la densita di daini a Nara, e hai tre citta complementari a meno di un ora di treno. La base a Kyoto ti permette di vedere tutto senza cambiare hotel.

## Cosa sapere prima

Periodo: sakura (cherry blossom) a fine marzo-inizio aprile, momiji (foglie rosse) a fine ottobre-novembre. Evita Golden Week (fine aprile-inizio maggio): sovraffollato. JR Pass da 14 giorni conviene solo se prevedi escursioni a Tokyo o Hiroshima. Per solo Kansai, biglietti singoli sono piu sensati.

## Come arrivare

Volo diretto Roma-Tokyo o scalo Dubai/Doha. Dall aeroporto di Kansai (Osaka), treno HARUKA fino a Kyoto (75 min). Prenota ryokan/hotel Kyoto 6 mesi prima se viaggi in sakura: sold out a febbraio.

## L itinerario base

Settimana 1: Kyoto centrale (Gion, Higashiyama, Arashiyama, Fushimi Inari, Nishiki Market, templi). Settimana 2: deviazioni (Osaka 2 giorni, Nara 1 giorno, Koyasan 2 giorni in tempio, Himeji 1 giorno), rientro a Kyoto per ultime 2 notti.

## Dove dormire

Base a Kyoto: mix di 10 notti in hotel boutique + 4 notti in ryokan tradizionale. Il ryokan non e opzionale: futon sul tatami, bagno termale privato, cena kaiseki in stanza. E l esperienza core del viaggio. Prenota a Gion o Higashiyama per essere a piedi dai templi.

## Consiglio Travellini

Kyoto la mattina presto: Fushimi Inari alle 7 e deserto, alle 10 e una fila. Arashiyama alle 8. Gion al tramonto per le geishe che vanno al lavoro. Osaka e una citta notturna, vala la pena solo per cena. E Koyasan (monte sacro buddhista) vale assolutamente due notti: dormire in tempio con cena vegetariana e cerimonia all alba resta il ricordo piu forte del viaggio.
`,
    highlights: [
      'Base unica a Kyoto per 14 giorni',
      'Koyasan 2 notti in tempio buddhista',
      'Osaka solo per cibo e sera',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo Kansai',
        description: 'Volo + treno HARUKA, check-in hotel Gion, cena leggera, riposo.',
      },
      {
        day: 2,
        title: 'Kyoto centro',
        description: 'Higashiyama, Kiyomizu-dera, vicoli di Gion, cena in izakaya.',
      },
      {
        day: 3,
        title: 'Arashiyama',
        description: 'Bambu grove alle 8, Tenryu-ji, Sagano railway, pomeriggio a Kyoto.',
      },
      {
        day: 4,
        title: 'Fushimi Inari',
        description:
          'Partenza alle 6.30, salita completa (2h30), pomeriggio riposo, cena in trattoria.',
      },
      {
        day: 5,
        title: 'Nishiki e templi nord',
        description: 'Nishiki Market al mattino, Kinkaku-ji, Ryoan-ji.',
      },
      {
        day: 6,
        title: 'Ryokan',
        description: 'Check-in ryokan in Higashiyama, cena kaiseki in stanza, onsen privato.',
      },
      {
        day: 7,
        title: 'Nara',
        description:
          'Treno per Nara al mattino (45 min), daini nel parco, Todai-ji, rientro Kyoto sera.',
      },
      {
        day: 8,
        title: 'Osaka',
        description: 'Dotonbori al tramonto, street food (takoyaki, okonomiyaki), rientro a Kyoto.',
      },
      {
        day: 9,
        title: 'Koyasan',
        description: 'Treno per Koyasan (2h30), check-in tempio, cena vegetariana shojin ryori.',
      },
      {
        day: 10,
        title: 'Koyasan cerimonia',
        description: 'Cerimonia buddhista all alba, Okunoin cimitero, rientro Kyoto sera.',
      },
      {
        day: 11,
        title: 'Himeji',
        description: 'Treno per Himeji (50 min), castello (3h), rientro Kyoto nel pomeriggio.',
      },
      {
        day: 12,
        title: 'Cerimonia del te',
        description: 'Cerimonia del te in casa di maestro, pomeriggio libero, cena leggera.',
      },
      {
        day: 13,
        title: 'Kyoto libera',
        description: 'Giardini minori, mercato Nishiki seconda visita, cena finale kaiseki.',
      },
      {
        day: 14,
        title: 'Rientro',
        description: 'Check-out, HARUKA per aeroporto Kansai, volo rientro.',
      },
    ],
    tips: [
      'Fushimi Inari prima delle 8, sempre.',
      'JR Pass conviene solo con escursioni Hiroshima/Tokyo.',
      'Ryokan 6 mesi prima in sakura, piu tardi in autunno.',
      'Contanti: molti ristoranti piccoli non accettano carta.',
      'Treno ultima corsa Osaka-Kyoto verso 23.30.',
    ],
    packingList: [
      'Scarpe da toglire facilmente (templi e ryokan)',
      'Calzini coprenti (spesso richiesti)',
      'Giacca leggera per sera',
      'Adattatore tipo A',
      'Pocket wifi o eSIM',
      'Power bank',
      'Abbigliamento modesto per templi',
    ],
    hiddenGems: [
      { title: 'Honen-in tempio', description: 'giardino zen senza turisti' },
      { title: 'Nishiki Market dopo le 18', description: 'i locali cenano qui' },
    ],
    localFood: [
      { name: 'Kaiseki ryori', description: 'In ryokan, 8 portate' },
      { name: 'Takoyaki di Osaka', description: 'In strada' },
      { name: 'Matcha e wagashi', description: 'In tea house di Gion' },
    ],
    costs: {
      alloggio: '130-300 € a notte',
      cibo: '50-100 € a persona al giorno',
      trasporti: '10-25 € al giorno',
      attivita: '6.500-9.000 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 2 },
      { month: 'Febbraio', rating: 2 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 2 },
      { month: 'Maggio', rating: 3 },
      { month: 'Giugno', rating: 1 },
      { month: 'Luglio', rating: 3 },
      { month: 'Agosto', rating: 3 },
      { month: 'Settembre', rating: 3 },
      { month: 'Ottobre', rating: 5 },
      { month: 'Novembre', rating: 5 },
      { month: 'Dicembre', rating: 2 },
    ],
    mapMarkers: [
      {
        id: 'kyoto',
        name: 'Kyoto',
        title: 'Kyoto',
        category: 'Antica capitale',
        coordinates: [135.7681, 35.0116],
      },
      {
        id: 'osaka',
        name: 'Osaka',
        title: 'Osaka',
        category: 'Capitale street food',
        coordinates: [135.5023, 34.6937],
      },
      {
        id: 'nara',
        name: 'Nara',
        title: 'Nara',
        category: 'Antichi templi',
        coordinates: [135.8048, 34.6851],
      },
      {
        id: 'koyasan',
        name: 'Koyasan',
        title: 'Koyasan',
        category: 'Monte sacro',
        coordinates: [135.585, 34.216],
      },
    ],
    mapCenter: [135.65, 34.8],
    mapZoom: 9,
    isMarkdown: true,
  },

  'vietnam-hoi-an-8-giorni': {
    id: 'vietnam-hoi-an-8-giorni',
    slug: 'vietnam-hoi-an-8-giorni',
    title: 'Vietnam centrale: Hoi An, Hue e risaie di Sa Pa',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Otto giorni di Vietnam slow tra lanterne di Hoi An, tombe imperiali di Hue e risaie terrazzate del nord.',
    description:
      'Un itinerario vietnamita di 8 giorni tra le lanterne di Hoi An, la citta imperiale di Hue e le risaie terrazzate di Sa Pa: viaggio costruito per scoprire il Vietnam senza la fretta dei tour.',
    location: 'Vietnam',
    period: 'Febbraio - aprile',
    budget: '€€',
    duration: '8 giorni',
    readTime: '10 min',
    date: '18 febbraio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Asia',
    content: `
Il Vietnam in 8 giorni e una corsa, ma se lo concentri su due aree (centro + nord) funziona. Il nostro piano evita la trappola delle 5 citta in 10 giorni: Hoi An come base di 3 notti, Hue in giornata, poi volo a Sa Pa per le risaie. Rimasto colpito dalla calma di Hoi An al tramonto, quando accendono le lanterne sul fiume.

## Perche andarci

Il Vietnam centrale e una sintesi perfetta: architettura coloniale, cucina regionale, villaggi rurali a 30 minuti. Hoi An di notte con lanterne e un pattern visivo unico, Hue ha le tombe imperiali sul Fiume dei Profumi, Sa Pa ha le risaie terrazzate delle minoranze H mong. Costi bassi, persone disponibili, infrastruttura turistica buona ma non ancora invadente.

## Cosa sapere prima

Periodo: febbraio-aprile per il centro (caldo ma asciutto). Maggio-settembre e stagione monsoni. Visto e-visa online 30 giorni, 25 euro. Cambia contanti dong vietnamiti all arrivo: la maggior parte delle botteghe non accetta carta. App Grab per taxi affidabili ed economici.

## Come arrivare

Volo Roma-Hanoi con scalo Dubai/Doha (12h totali). Da Hanoi, volo interno per Da Nang (1h15, 60 euro), poi taxi a Hoi An (30 min). Rientro: volo Hanoi-Italia dopo Sa Pa.

## L itinerario

Giorno 1: arrivo Hanoi, notte. Giorno 2: volo Da Nang, check-in Hoi An, sera lanterne. Giorno 3: Hoi An centro storico, corso di cucina. Giorno 4: Hue in giornata (tombe + citta imperiale). Giorno 5: My Son rovine Cham + mare a Cua Dai. Giorno 6: rientro Hanoi, treno notte Sa Pa. Giorno 7: trekking risaie H mong. Giorno 8: rientro Hanoi, volo serale.

## Dove dormire

Hoi An: boutique hotel nel centro storico o homestay sul fiume. Evita resort esterni: perdono il senso del luogo. Sa Pa: eco-lodge in un villaggio H mong, non hotel in centro citta (brutto e tradizionale). Cucina inclusa spesso vale la pena.

## Consiglio Travellini

Hoi An di notte e il momento. Accendono le lanterne dalle 18, i ristoranti sul fiume servono pesce fresco, il centro si pedonalizza. Resta 3 notti minimo. E un corso di cucina di mezza giornata e il modo migliore per capire la cucina vietnamita: spese 25 euro, torni a casa con 4 ricette.
`,
    highlights: [
      'Hoi An 3 notti base, lanterne e corso cucina',
      'Hue in giornata con tombe imperiali',
      'Sa Pa trekking con minoranze H mong',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo Hanoi',
        description: 'Volo lungo con scalo, check-in Hanoi old quarter, cena pho, riposo.',
      },
      {
        day: 2,
        title: 'Volo Hoi An',
        description:
          'Volo interno Da Nang, taxi a Hoi An, sera lanterne sul fiume, cena pesce fresco.',
      },
      {
        day: 3,
        title: 'Hoi An centro',
        description: 'Centro storico al mattino, pranzo cao lau, corso di cucina nel pomeriggio.',
      },
      {
        day: 4,
        title: 'Hue',
        description: 'Treno per Hue (3h), tombe imperiali e citta imperiale, rientro Hoi An sera.',
      },
      {
        day: 5,
        title: 'My Son e mare',
        description:
          'Rovine Cham al mattino, pranzo, pomeriggio al mare di Cua Dai, cena in villaggio.',
      },
      {
        day: 6,
        title: 'Rientro Hanoi + treno notte',
        description: 'Volo Da Nang-Hanoi, giornata in citta, treno notte per Sa Pa (8h).',
      },
      {
        day: 7,
        title: 'Sa Pa trekking',
        description:
          'Arrivo Sa Pa alba, colazione, trekking risaie con guida H mong (5h), cena in eco-lodge.',
      },
      {
        day: 8,
        title: 'Rientro Hanoi',
        description: 'Volo Hanoi al mattino, giornata in citta, volo serale per Italia.',
      },
    ],
    tips: [
      'E-visa online prima del volo, 25 euro.',
      'Grab app per taxi, evita le truffe tassametro.',
      'Cambia contanti all arrivo, carta rara fuori dai grandi hotel.',
      'Hoi An centro e pedonale dalle 18.',
      'Treno notte Hanoi-Sa Pa in cabina 4 posti con aria condizionata.',
    ],
    packingList: [
      'Scarpe trekking leggere',
      'Sandali per Hoi An',
      'Felpa per Sa Pa (fresco)',
      'Impermeabile leggero',
      'Crema solare e repellente',
      'Adattatore tipo A',
    ],
    hiddenGems: [
      { title: 'An Bang beach', description: 'spiaggia senza resort a 4 km da Hoi An' },
      { title: 'Mercato notturno di Hue', description: 'cucina locale non turistica' },
    ],
    localFood: [
      {
        name: 'Cao lau Hoi An (solo qui nel mondo)',
        description: 'Cao lau Hoi An (solo qui nel mondo)',
      },
      { name: 'Bun bo Hue piccante', description: 'Bun bo Hue piccante' },
      {
        name: 'Pho alla stazione di Hanoi al mattino',
        description: 'Pho alla stazione di Hanoi al mattino',
      },
    ],
    costs: {
      alloggio: '40-90 € a notte per coppia',
      cibo: '15-25 € a persona al giorno',
      trasporti: '1.800-2.500 €',
      attivita: '50-80 € a persona',
    },
    seasonality: [
      { month: 'Gennaio', rating: 3 },
      { month: 'Febbraio', rating: 5 },
      { month: 'Marzo', rating: 5 },
      { month: 'Aprile', rating: 5 },
      { month: 'Maggio', rating: 1 },
      { month: 'Giugno', rating: 2 },
      { month: 'Luglio', rating: 2 },
      { month: 'Agosto', rating: 2 },
      { month: 'Settembre', rating: 2 },
      { month: 'Ottobre', rating: 2 },
      { month: 'Novembre', rating: 4 },
      { month: 'Dicembre', rating: 4 },
    ],
    mapMarkers: [
      {
        id: 'hoi-an',
        name: 'Hoi An',
        title: 'Hoi An',
        category: 'Citta delle lanterne',
        coordinates: [108.338, 15.8801],
      },
      {
        id: 'hue',
        name: 'Hue',
        title: 'Hue',
        category: 'Citta imperiale',
        coordinates: [107.5909, 16.4637],
      },
      {
        id: 'sa-pa',
        name: 'Sa Pa',
        title: 'Sa Pa',
        category: 'Risaie terrazzate',
        coordinates: [103.8448, 22.3364],
      },
    ],
    mapCenter: [108, 18],
    mapZoom: 5,
    isMarkdown: true,
  },

  'peru-valle-sacra-machu-picchu': {
    id: 'peru-valle-sacra-machu-picchu',
    slug: 'peru-valle-sacra-machu-picchu',
    title: 'Peru: valle sacra degli Inca, Cusco, Machu Picchu senza folla',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Dieci giorni di Peru tra Cusco, valle sacra e Machu Picchu. Itinerario per evitare il circuito dei bus e vivere l acclimatamento giusto.',
    description:
      'Un itinerario peruviano di 10 giorni tra Cusco, valle sacra e Machu Picchu: viaggio costruito con acclimatamento progressivo e accessi al sito nei momenti piu calmi.',
    location: 'Peru, Ande',
    period: 'Maggio - settembre',
    budget: '€€€',
    duration: '10 giorni',
    readTime: '13 min',
    date: '28 gennaio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Americhe',
    content: `
Machu Picchu e la cosa che tutti vogliono vedere in Peru, ma il modo in cui ci arrivi fa la differenza tra una gita e un viaggio. Noi abbiamo speso 10 giorni per l acclimatamento e gli accessi al sito nei momenti giusti: risultato, siamo stati al Santuario quasi da soli alle 6 del mattino.

## Perche andarci

Il Peru concentra in 400 km di Ande il meglio del Sud America: archeologia inca, mercati andini autentici, villaggi rurali a 3.500 metri, cucina creativa di Lima a 10 ore di autobus. La valle sacra e una macchina del tempo: terrazze coltivate identiche a 500 anni fa, cerimonie quechua attive nelle feste, mercato di Pisac con tessuti di alpaca veri.

## Cosa sapere prima

Altitudine: Cusco a 3.400 m, mal di montagna reale nelle prime 48h. Acclimatamento progressivo: Lima (livello mare) 2 notti, poi valle sacra (2.800 m) 3 notti, solo dopo Cusco (3.400 m) 2 notti. Machu Picchu richiede biglietto + treno prenotati 3 mesi prima. Periodo maggio-settembre asciutto, dicembre-marzo stagione piogge.

## Come arrivare

Volo Roma-Lima con scalo Madrid o Amsterdam (14h totali). Volo interno Lima-Cusco (1h15) ma rischio altitudine shock: meglio Lima-Urubamba (valle sacra) via volo Cusco + transfer diretto senza fermarsi. Per Machu Picchu: treno da Ollantaytambo (1h30).

## L itinerario

Giorno 1-2: Lima (centro storico + Miraflores). Giorno 3: volo + transfer valle sacra. Giorno 4: Pisac mercato + rovine. Giorno 5: Ollantaytambo. Giorno 6: Machu Picchu (alba, 6.00). Giorno 7: Aguas Calientes relax. Giorno 8-9: Cusco centro + quartiere San Blas. Giorno 10: volo rientro via Lima.

## Dove dormire

Valle sacra: lodge di fattoria in Urubamba con giardino andino e cucina locale. Cusco: hotel boutique in San Blas, zona artistica a piedi dalla Plaza de Armas. Aguas Calientes: solo 1 notte, hotel medio basta. Evita tutto cio che e "luxury resort" nel contesto peruviano: sembra sempre disconnesso dal luogo.

## Consiglio Travellini

Machu Picchu alle 6, mai dopo. Alle 9 iniziano i bus da Aguas Calientes e il sito si riempie. E acclimatamento sul serio: il mal di montagna rovina tutto. Foglie di coca in infuso funzionano davvero, usale appena arrivi in valle sacra.
`,
    highlights: [
      'Acclimatamento progressivo Lima-valle-Cusco',
      'Machu Picchu alle 6, quasi vuoto',
      'Pisac mercato autentico, non tour organizzati',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Lima centro',
        description: 'Arrivo, check-in Miraflores, cena cucina peruviana moderna (ceviche).',
      },
      {
        day: 2,
        title: 'Lima storica',
        description: 'Centro storico al mattino, pomeriggio Barranco, sera pisco sour.',
      },
      {
        day: 3,
        title: 'Volo valle sacra',
        description:
          'Volo Lima-Cusco, transfer diretto a Urubamba senza fermate, riposo per altitudine.',
      },
      {
        day: 4,
        title: 'Pisac',
        description: 'Mercato andino al mattino, rovine di Pisac pomeriggio, rientro in lodge.',
      },
      {
        day: 5,
        title: 'Ollantaytambo',
        description: 'Fortezza inca al mattino, passeggiata nel villaggio, cena in lodge.',
      },
      {
        day: 6,
        title: 'Machu Picchu',
        description:
          'Treno alle 5, bus alle 5.30, sito alle 6, visita 3h con guida, rientro Aguas Calientes.',
      },
      {
        day: 7,
        title: 'Aguas Calientes',
        description: 'Bagni termali, passeggiata fiume, treno pomeriggio per Cusco.',
      },
      {
        day: 8,
        title: 'Cusco centro',
        description: 'Plaza de Armas, cattedrale, Qoricancha, pranzo in mercato San Pedro.',
      },
      {
        day: 9,
        title: 'San Blas',
        description: 'Quartiere artistico a piedi, botteghe tessili, cena pisco sour.',
      },
      {
        day: 10,
        title: 'Rientro',
        description: 'Volo Cusco-Lima, connessione Italia, rientro notte.',
      },
    ],
    tips: [
      'Acclimatamento progressivo, non andare direttamente a Cusco.',
      'Foglie di coca in infuso contro il mal di montagna, funzionano.',
      'Machu Picchu biglietto + treno prenotati 3 mesi prima.',
      'Contanti soles: fuori Lima la carta e poco accettata.',
      'Bottiglia d acqua con filtro, acqua del rubinetto non potabile.',
    ],
    packingList: [
      'Scarpe trekking leggere',
      'Giacca antivento',
      'Strati termici (escursioni altitudine)',
      'Cappello sole e beanie',
      'Crema solare fattore 50',
      'Medicinali altitudine (diamox opzionale)',
      'Adattatore tipo A/B',
    ],
    hiddenGems: [
      { title: 'Moray terrazze circolari inca', description: 'senza tour' },
      { title: 'Salineras de Maras', description: 'saline andine ancora attive' },
    ],
    localFood: [
      { name: 'Ceviche a Lima', description: 'In cevicheria di quartiere' },
      { name: 'Lomo saltado', description: 'In trattoria di Cusco' },
      { name: 'Cuy (porcellino d india) se oso', description: 'specialita andina' },
    ],
    costs: {
      alloggio: '120-200 € a notte per coppia',
      cibo: '4.000-5.500 €',
      trasporti: '180 € a persona',
      attivita: '150 € a persona',
    },
    seasonality: [
      { month: 'Gennaio', rating: 1 },
      { month: 'Febbraio', rating: 1 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 4 },
      { month: 'Maggio', rating: 5 },
      { month: 'Giugno', rating: 5 },
      { month: 'Luglio', rating: 3 },
      { month: 'Agosto', rating: 5 },
      { month: 'Settembre', rating: 4 },
      { month: 'Ottobre', rating: 3 },
      { month: 'Novembre', rating: 1 },
      { month: 'Dicembre', rating: 1 },
    ],
    mapMarkers: [
      {
        id: 'lima',
        name: 'Lima',
        title: 'Lima',
        category: 'Capitale',
        coordinates: [-77.0428, -12.0464],
      },
      {
        id: 'cusco',
        name: 'Cusco',
        title: 'Cusco',
        category: 'Antica capitale inca',
        coordinates: [-71.9675, -13.5319],
      },
      {
        id: 'machu-picchu',
        name: 'Machu Picchu',
        title: 'Machu Picchu',
        category: 'Sito UNESCO',
        coordinates: [-72.545, -13.1631],
      },
      {
        id: 'pisac',
        name: 'Pisac',
        title: 'Pisac',
        category: 'Mercato andino',
        coordinates: [-71.85, -13.4167],
      },
    ],
    mapCenter: [-73, -13],
    mapZoom: 7,
    isMarkdown: true,
  },

  'west-coast-usa-roadtrip-14-giorni': {
    id: 'west-coast-usa-roadtrip-14-giorni',
    slug: 'west-coast-usa-roadtrip-14-giorni',
    title: 'West Coast USA: roadtrip 14 giorni da Los Angeles a Seattle',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Duemila miglia di costa ovest: da LA a Seattle tra redwood, Highway 1 e citta che cambiano a ogni fuso orario.',
    description:
      'Un roadtrip di 14 giorni sulla costa ovest americana, da Los Angeles a Seattle, tra redwood giganti, Highway 1 costiera e citta che cambiano carattere a ogni ora di guida.',
    location: 'West Coast, USA',
    period: 'Maggio - ottobre',
    budget: '€€€€',
    duration: '14 giorni',
    readTime: '15 min',
    date: '22 gennaio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Americhe',
    content: `
La West Coast in 14 giorni e il classico viaggio dove si pensa di vedere tutto e si finisce stanchi. Il nostro piano riduce le mete a 6 basi notturne, concentra la guida al mattino e lascia spazio alle citta. LA e Seattle come estremi, Highway 1, redwood e parchi nazionali nel mezzo.

## Perche andarci

La costa ovest americana non ha eguali per densita di paesaggi diversi: deserto a Joshua Tree, oceano iconico lungo Highway 1, foreste millenarie a Redwood, vulcani a Crater Lake, skyline modernista a San Francisco e Seattle. Aggiungi la cucina californiana, la scena wine country di Napa e il caffe di Portland/Seattle, e il viaggio si costruisce su piu livelli.

## Cosa sapere prima

Auto a noleggio one-way (pick-up LA, drop-off Seattle, surcharge 200-400 dollari). Patente italiana valida con traduzione internazionale. Periodo maggio-ottobre per avere strada 1 sempre aperta. Estate alta e sovraffollata a Yosemite: prenota 4 mesi prima. Budget alto: 200-280 dollari a notte hotel medi.

## Come arrivare

Volo Roma-LA con scalo Londra/Amsterdam (13h totali). Ritorno Seattle-Roma con scalo. Pick-up auto aeroporto LAX, drop-off SEA. Prenota auto grande (SUV) se siete in 2+: baule spazioso serve per 14 giorni.

## L itinerario

Giorno 1-2: LA (centro, Santa Monica, Griffith). Giorno 3: Highway 1 LA-Big Sur. Giorno 4: Big Sur-Monterey-SF (300 miglia, lunga). Giorno 5-6: San Francisco. Giorno 7: Napa Valley giornata. Giorno 8: SF-Redwood (300 miglia). Giorno 9: Redwood e Crescent City. Giorno 10: Crater Lake (grande deviazione). Giorno 11: Portland. Giorno 12-13: Seattle. Giorno 14: rientro.

## Dove dormire

Mix motel pittoreschi + boutique hotel. LA: hotel a Santa Monica (oceanfront) o Venice Beach. SF: zona Union Square o Mission. Seattle: quartiere Capitol Hill o downtown. Per le tappe brevi (Big Sur, Redwood) motel con vista oceano o foresta, niente di luxury.

## Consiglio Travellini

Highway 1 da LA a SF e l icona, ma la parte piu bella e da Big Sur a Monterey. Fatto di notte non la vedi: parti al mattino presto, fai pause lunghe, arriva a SF alle 18. E Napa in giornata da SF e sufficiente: un intero giorno tra cantine e' gia molto.
`,
    highlights: [
      'Highway 1 da LA a SF con tappa a Big Sur',
      '6 basi notturne, non 10',
      'Mix costa + foreste + vulcano + 3 citta',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo LA',
        description: 'Pick-up auto LAX, hotel Santa Monica, sera in spiaggia.',
      },
      {
        day: 2,
        title: 'LA',
        description: 'Griffith Observatory, centro, cena a Venice.',
      },
      {
        day: 3,
        title: 'Highway 1 a Big Sur',
        description: 'LA-Big Sur 300 miglia con pause a Cambria, arrivo sera.',
      },
      {
        day: 4,
        title: 'Big Sur a SF',
        description: 'Monterey al mattino, 17 Mile Drive, Santa Cruz, arrivo SF.',
      },
      {
        day: 5,
        title: 'San Francisco',
        description: 'Golden Gate, Alcatraz, Fisherman Wharf, cena cinese in Chinatown.',
      },
      {
        day: 6,
        title: 'SF quartieri',
        description: 'Mission, Castro, Haight-Ashbury, sera in Castro.',
      },
      {
        day: 7,
        title: 'Napa Valley',
        description: 'Giornata tra cantine, pranzo in winery, rientro SF sera.',
      },
      {
        day: 8,
        title: 'SF a Redwood',
        description: 'Guida lunga 5h, arrivo in foresta di sequoie, passeggiata al tramonto.',
      },
      {
        day: 9,
        title: 'Redwood',
        description: 'Trek tra le sequoie, costa selvaggia, cena in lodge.',
      },
      {
        day: 10,
        title: 'Crater Lake',
        description:
          'Grande deviazione interna, lago vulcanico blu intenso, notte vicino al parco.',
      },
      {
        day: 11,
        title: 'Portland',
        description: 'Arrivo Portland, caffe tour, Powell s Books, cena food truck.',
      },
      {
        day: 12,
        title: 'Seattle',
        description: 'Arrivo Seattle, Pike Place Market, Space Needle.',
      },
      {
        day: 13,
        title: 'Seattle lento',
        description: 'Chihuly garden, Capitol Hill quartiere, cena ultima.',
      },
      {
        day: 14,
        title: 'Rientro',
        description: 'Drop-off auto SEA, volo pomeridiano per Italia.',
      },
    ],
    tips: [
      'One-way surcharge 200-400 dollari, budget in.',
      'Yosemite prenotazione 4 mesi prima se in itinerario.',
      'Benzina piena sempre, stazioni rade tra Redwood e Crater.',
      'App Waze per traffico SF/LA.',
      'Costume + asciugamano sempre pronti per soste oceano.',
    ],
    packingList: [
      'Scarpe trekking leggere',
      'Sneaker per citta',
      'Giacca impermeabile Seattle/Portland',
      'Strati per sbalzi termici',
      'Adattatore tipo A',
      'Power bank',
      'Carta di credito international',
    ],
    hiddenGems: [
      { title: 'Big Sur McWay Falls', description: 'cascata che cade in oceano' },
      { title: 'Arcata sulla costa Redwood', description: 'piccola citta hippie bohemien' },
    ],
    localFood: [
      {
        name: 'In-N-Out burger al primo pit stop california',
        description: 'In-N-Out burger al primo pit stop california',
      },
      {
        name: 'Sourdough bread a SF Boudin bakery',
        description: 'Sourdough bread a SF Boudin bakery',
      },
      { name: 'Salmon cedar plank a Seattle', description: 'Salmon cedar plank a Seattle' },
    ],
    costs: {
      alloggio: '200-280 $ a notte',
      cibo: '9.000-13.000 €',
      trasporti: '600-800 $ totali',
      attivita: '9.000-13.000 €',
    },
    seasonality: [
      { month: 'Gennaio', rating: 3 },
      { month: 'Febbraio', rating: 1 },
      { month: 'Marzo', rating: 3 },
      { month: 'Aprile', rating: 4 },
      { month: 'Maggio', rating: 5 },
      { month: 'Giugno', rating: 5 },
      { month: 'Luglio', rating: 2 },
      { month: 'Agosto', rating: 2 },
      { month: 'Settembre', rating: 5 },
      { month: 'Ottobre', rating: 5 },
      { month: 'Novembre', rating: 1 },
      { month: 'Dicembre', rating: 1 },
    ],
    mapMarkers: [
      {
        id: 'la',
        name: 'Los Angeles',
        title: 'Los Angeles',
        category: 'Citta californiana',
        coordinates: [-118.2437, 34.0522],
      },
      {
        id: 'sf',
        name: 'San Francisco',
        title: 'San Francisco',
        category: 'Baia modernista',
        coordinates: [-122.4194, 37.7749],
      },
      {
        id: 'redwood',
        name: 'Redwood NP',
        title: 'Redwood',
        category: 'Sequoie giganti',
        coordinates: [-124.0046, 41.2132],
      },
      {
        id: 'seattle',
        name: 'Seattle',
        title: 'Seattle',
        category: 'Pacifico nord',
        coordinates: [-122.3321, 47.6062],
      },
    ],
    mapCenter: [-121, 41],
    mapZoom: 5,
    isMarkdown: true,
  },

  'marocco-medina-deserto-7-giorni': {
    id: 'marocco-medina-deserto-7-giorni',
    slug: 'marocco-medina-deserto-7-giorni',
    title: 'Marocco: medine, atlas e notte nel deserto di Merzouga',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Sette giorni in Marocco tra Marrakech, Atlas e una notte in tenda berbera nel deserto di Merzouga.',
    description:
      'Un itinerario marocchino di 7 giorni tra le medine di Marrakech e Fes, l Atlas e una notte in tenda berbera nel deserto di Merzouga: viaggio costruito per vivere il paese senza correre.',
    location: 'Marocco',
    period: 'Ottobre - aprile',
    budget: '€€',
    duration: '7 giorni',
    readTime: '10 min',
    date: '25 gennaio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Africa',
    content: `
Il Marocco in sette giorni si fa, ma solo se eviti la trappola delle 5 citta. Il nostro itinerario e: Marrakech due notti, Atlas con tappa in Ait Ben Haddou, due notti a Merzouga con deserto, rientro via Fes. Base fissa in riad, spostamenti solo al mattino.

## Perche andarci

Il Marocco concentra cio che cerchiamo quando parliamo di viaggio sensoriale: spezie nei mercati, architettura berbera e moresca, paesaggi che cambiano in 3 ore di guida. La medina di Marrakech al tramonto, il silenzio del deserto di notte, il the alla menta in un riad sono esperienze che non trovi altrove in questa combinazione.

## Cosa sapere prima

Periodo: ottobre-aprile. Estate troppo calda (40+ gradi a Marrakech). Ramadan da evitare: ristoranti chiusi di giorno, atmosfera diversa. Guida privata per Atlas/deserto quasi obbligatoria: strade di montagna tortuose, non e un paese per self-drive al primo viaggio. Contratta sempre: e parte della cultura, non prendertela.

## Come arrivare

Volo diretto Roma-Marrakech (3h30). Aeroporto Menara Marrakech a 15 min dalla medina in taxi (negozia 150 dirham). Da Marrakech prendi auto con autista (200-250 euro al giorno per 3 giorni verso deserto). Rientro: volo Fes-Italia o Marrakech-Italia.

## L itinerario

Giorno 1-2: Marrakech (medina, souk, Jardin Majorelle). Giorno 3: trasferimento in Atlas, notte a Ait Ben Haddou. Giorno 4: gole di Dades, arrivo Merzouga pomeriggio. Giorno 5: deserto in tenda berbera, cammelli al tramonto. Giorno 6: rientro via Fes (8h di guida), notte in riad. Giorno 7: Fes medina e volo rientro.

## Dove dormire

Riad (palazzo tradizionale con patio interno): questa e l esperienza base. Marrakech zona Bahia o Mouassine, Fes zona Batha. Cerca strutture con 6-8 stanze, cena facoltativa (spesso e la migliore della citta), piscina fredda sul patio. Nel deserto: tenda berbera permanente con letto vero e bagno, non avventurosa.

## Consiglio Travellini

Il souk di Marrakech solo con guida il primo giorno: ti fa risparmiare ore, ti spiega come contrattare, ti porta dove i locali comprano. Il deserto solo al tramonto e all alba: le ore centrali sono dure. E il the alla menta e la moneta sociale del paese, accettalo sempre.
`,
    highlights: [
      'Due notti deserto in tenda berbera',
      'Attraversamento Atlas con tappa Ait Ben Haddou',
      'Due medine imperiali: Marrakech e Fes',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo Marrakech',
        description: 'Volo Roma-Marrakech, check-in riad, cena sul tetto.',
      },
      {
        day: 2,
        title: 'Marrakech medina',
        description:
          'Souk con guida al mattino, Jardin Majorelle pomeriggio, sera a piazza Jemaa el-Fnaa.',
      },
      {
        day: 3,
        title: 'Atlas e Ait Ben Haddou',
        description:
          'Transfer in auto con autista, passo Tizi n Tichka, arrivo Ait Ben Haddou al tramonto.',
      },
      {
        day: 4,
        title: 'Gole e Merzouga',
        description:
          'Gole del Dades al mattino, guida attraverso Todra, arrivo Merzouga al tramonto.',
      },
      {
        day: 5,
        title: 'Deserto',
        description:
          'Cammelli al tramonto, cena attorno al fuoco con musica berbera, notte in tenda.',
      },
      {
        day: 6,
        title: 'Rientro via Fes',
        description: 'Guida lunga 8h, arrivo Fes sera, riad in medina.',
      },
      {
        day: 7,
        title: 'Fes e volo',
        description:
          'Mattina nella medina di Fes (concerie, moschee), pranzo, volo pomeridiano rientro.',
      },
    ],
    tips: [
      'Guida privata per souk primo giorno, fa risparmiare stress.',
      'Contratta sempre, in souk e nei taxi non ufficiali.',
      'Beve solo acqua in bottiglia sigillata.',
      'Ramadan da evitare se possibile, esperienza diversa.',
      'Niente foto alle persone senza chiedere, offensivo.',
    ],
    packingList: [
      'Scarpe chiuse comode',
      'Abbigliamento modesto (donne)',
      'Sciarpa leggera',
      'Giacca per sera nel deserto (fresco)',
      'Crema solare e occhiali',
      'Contanti in euro (cambi meglio sul posto)',
    ],
    hiddenGems: [
      { title: 'Concerie di Fes dalla terrazza', description: 'colori incredibili' },
      { title: 'Cafe des Epices Marrakech', description: 'tetto vista medina' },
    ],
    localFood: [
      { name: 'Tajine di pollo al limone', description: 'In riad' },
      {
        name: 'Couscous del venerdi tradizionale',
        description: 'Couscous del venerdi tradizionale',
      },
      { name: 'The alla menta', description: 'rituale quotidiano' },
    ],
    costs: {
      alloggio: '70-150 € a notte per coppia',
      cibo: '1.800-2.500 €',
      trasporti: '600-800 € totali',
      attivita: '120-180 € per coppia',
    },
    seasonality: [
      { month: 'Gennaio', rating: 5 },
      { month: 'Febbraio', rating: 5 },
      { month: 'Marzo', rating: 5 },
      { month: 'Aprile', rating: 5 },
      { month: 'Maggio', rating: 3 },
      { month: 'Giugno', rating: 3 },
      { month: 'Luglio', rating: 2 },
      { month: 'Agosto', rating: 2 },
      { month: 'Settembre', rating: 3 },
      { month: 'Ottobre', rating: 5 },
      { month: 'Novembre', rating: 5 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'marrakech',
        name: 'Marrakech',
        title: 'Marrakech',
        category: 'Medina imperiale',
        coordinates: [-7.9811, 31.6295],
      },
      {
        id: 'merzouga',
        name: 'Merzouga',
        title: 'Merzouga',
        category: 'Deserto sahariano',
        coordinates: [-3.9896, 31.0994],
      },
      {
        id: 'fes',
        name: 'Fes',
        title: 'Fes',
        category: 'Medina spirituale',
        coordinates: [-5.0003, 34.0181],
      },
      {
        id: 'ait-ben-haddou',
        name: 'Ait Ben Haddou',
        title: 'Ait Ben Haddou',
        category: 'Ksar UNESCO',
        coordinates: [-7.1292, 31.0472],
      },
    ],
    mapCenter: [-5.5, 32],
    mapZoom: 6,
    isMarkdown: true,
  },

  'nuova-zelanda-south-island-12-giorni': {
    id: 'nuova-zelanda-south-island-12-giorni',
    slug: 'nuova-zelanda-south-island-12-giorni',
    title: 'Nuova Zelanda: South Island in 12 giorni di fiordi e ghiacciai',
    category: 'Itinerari completi',
    image:
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Dodici giorni sulla South Island neozelandese tra fiordi, ghiacciai e citta piccole. Lontano dall itinerario Queenstown-Milford classico.',
    description:
      'Un itinerario di 12 giorni sulla South Island della Nuova Zelanda tra fiordi di Milford, ghiacciai di Franz Josef e la tranquillita di Wanaka: viaggio costruito per vivere il paese senza fretta.',
    location: 'South Island, Nuova Zelanda',
    period: 'Novembre - marzo',
    budget: '€€€€',
    duration: '12 giorni',
    readTime: '14 min',
    date: '15 gennaio 2026',
    author: 'Rodrigo & Betta',
    continent: 'Oceania',
    content: `
La Nuova Zelanda e un viaggio lungo: Roma-Auckland sono 25 ore, e la South Island richiede tempi non comprimibili. Dodici giorni sono il minimo per fare il circuito senza bruciare tutto in una settimana. Il nostro piano evita Queenstown come base, sceglie Wanaka piu calma, e dedica due giorni ai fiordi (non uno).

## Perche andarci

La South Island ha una densita di paesaggi diversi che non esiste altrove: fiordi scozzesi, ghiacciai accessibili a piedi, laghi alpini, coste selvagge con foche, vigneti marlborough. Tutto in 1.200 km di strada. Le citta sono piccole ma moderne, l accoglienza e rilassata, il cibo e eccellente (agnello, frutti di mare, sauvignon blanc).

## Cosa sapere prima

Periodo: novembre-marzo (estate australe). Dicembre-gennaio alta stagione. Febbraio-marzo clima migliore, meno folla. Patente italiana valida. Guida a sinistra. Auto 2WD sufficiente per il circuito principale. Periodi estivi prenota 6 mesi prima, non scherzo.

## Come arrivare

Volo Roma-Auckland via Dubai/Singapore (25h totali). Volo interno Auckland-Christchurch (1h30, obbligatorio). Pick-up auto a Christchurch, drop-off Christchurch (loop), oppure one-way Queenstown con surcharge 150 dollari.

## L itinerario (loop da Christchurch)

Giorno 1-2: arrivo Christchurch + acclimatamento. Giorno 3: Christchurch a Aoraki/Mount Cook. Giorno 4: Mount Cook + Tasman Glacier. Giorno 5: Mount Cook a Wanaka. Giorno 6: Wanaka + Roy Peak. Giorno 7: Wanaka a Te Anau. Giorno 8: Milford Sound giornata. Giorno 9: Doubtful Sound (meno folla). Giorno 10: Te Anau a Franz Josef (lunga guida). Giorno 11: Franz Josef ghiacciaio. Giorno 12: rientro Christchurch + volo.

## Dove dormire

Mix B&B di fattoria + boutique motel. Evita catene internazionali: il vero Kiwi hospitality e nelle strutture piccole. Per notti chiave (Mount Cook, Franz Josef) prenota 6 mesi prima in estate. Wanaka e piu calma di Queenstown e costa la meta.

## Consiglio Travellini

Milford Sound sempre al mattino (alle 9 tour in barca, alle 15 e gia folla). Se hai tempo, Doubtful Sound al posto (o in aggiunta): meno famoso, piu selvaggio, meno persone. Il meteo cambia velocissimo: porta sempre antipioggia anche in estate.
`,
    highlights: [
      'Wanaka come base, non Queenstown',
      'Due fiordi: Milford + Doubtful Sound',
      'Mount Cook e Franz Josef ghiacciaio nello stesso viaggio',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo Christchurch',
        description: 'Volo lunghissimo, acclimatamento jet lag, cena e notte.',
      },
      {
        day: 2,
        title: 'Christchurch lento',
        description: 'Botanic Gardens, passeggiata, pick-up auto, cena ultima prima del tour.',
      },
      {
        day: 3,
        title: 'Mount Cook',
        description: 'Guida a Lake Tekapo e Pukaki, arrivo Mount Cook pomeriggio.',
      },
      {
        day: 4,
        title: 'Tasman Glacier',
        description: 'Trekking Hooker Valley, Tasman Glacier viewpoint, cena in lodge.',
      },
      {
        day: 5,
        title: 'Wanaka',
        description: 'Transfer via Lindis Pass, arrivo Wanaka pomeriggio, sera lake.',
      },
      {
        day: 6,
        title: 'Roy Peak',
        description: 'Trek 6h andata-ritorno Roy Peak al mattino, riposo pomeriggio.',
      },
      {
        day: 7,
        title: 'Te Anau',
        description: 'Transfer a Te Anau via fiordland, check-in, cena in pub.',
      },
      {
        day: 8,
        title: 'Milford Sound',
        description: 'Partenza alle 7, tour in barca sul fiordo alle 10, rientro sera.',
      },
      {
        day: 9,
        title: 'Doubtful Sound',
        description: 'Day tour Doubtful (piu lungo, meno folla), cena a Te Anau.',
      },
      {
        day: 10,
        title: 'Franz Josef',
        description: 'Guida lunga via Haast Pass, arrivo Franz Josef sera.',
      },
      {
        day: 11,
        title: 'Ghiacciaio',
        description: 'Elicottero + trekking ghiacciaio Franz Josef, cena lodge.',
      },
      {
        day: 12,
        title: 'Rientro',
        description: 'Guida Franz Josef a Christchurch (5h), drop-off auto, volo notte.',
      },
    ],
    tips: [
      'Patente internazionale non richiesta, italiana valida.',
      'Guida a sinistra, attenzione nei primi giorni.',
      'Prenota 6 mesi prima per alta stagione.',
      'Meteo variabile anche in estate, porta sempre antipioggia.',
      'Assicurazione auto full-coverage, strade montane.',
    ],
    packingList: [
      'Giacca impermeabile tecnica',
      'Scarponi impermeabili',
      'Strati merino',
      'Cappello sole e felpa',
      'Costume (laghi freddi)',
      'Power bank grande',
      'Adattatore tipo I',
    ],
    hiddenGems: [
      { title: 'Lake Matheson al tramonto', description: 'riflesso Mount Cook' },
      { title: 'Roys Peak Wanaka all alba', description: 'Roys Peak Wanaka all alba' },
    ],
    localFood: [
      { name: 'Agnello neozelandese a Wanaka', description: 'Agnello neozelandese a Wanaka' },
      { name: 'Green-lipped mussels ai fiordi', description: 'Green-lipped mussels ai fiordi' },
      { name: 'Sauvignon blanc di Marlborough', description: 'Sauvignon blanc di Marlborough' },
    ],
    costs: {
      alloggio: '180-280 € a notte per coppia',
      cibo: '8.500-12.000 €',
      trasporti: '1.200-1.600 € totali',
      attivita: '800-1.000 € coppia',
    },
    seasonality: [
      { month: 'Gennaio', rating: 5 },
      { month: 'Febbraio', rating: 5 },
      { month: 'Marzo', rating: 5 },
      { month: 'Aprile', rating: 3 },
      { month: 'Maggio', rating: 2 },
      { month: 'Giugno', rating: 3 },
      { month: 'Luglio', rating: 3 },
      { month: 'Agosto', rating: 3 },
      { month: 'Settembre', rating: 3 },
      { month: 'Ottobre', rating: 3 },
      { month: 'Novembre', rating: 3 },
      { month: 'Dicembre', rating: 3 },
    ],
    mapMarkers: [
      {
        id: 'christchurch',
        name: 'Christchurch',
        title: 'Christchurch',
        category: 'Porta di ingresso',
        coordinates: [172.6362, -43.5321],
      },
      {
        id: 'mount-cook',
        name: 'Mount Cook',
        title: 'Mount Cook',
        category: 'Vetta piu alta',
        coordinates: [170.1417, -43.5945],
      },
      {
        id: 'milford',
        name: 'Milford Sound',
        title: 'Milford',
        category: 'Fiordo',
        coordinates: [167.9295, -44.6716],
      },
      {
        id: 'franz-josef',
        name: 'Franz Josef',
        title: 'Franz Josef',
        category: 'Ghiacciaio',
        coordinates: [170.1823, -43.3894],
      },
    ],
    mapCenter: [170, -44],
    mapZoom: 6,
    isMarkdown: true,
  },

  'weekend-borgo-lento': {
    id: 'weekend-borgo-lento',
    slug: 'weekend-borgo-lento',
    title: 'Weekend lento in un borgo: come sceglierlo bene',
    category: 'Weekend & Day trip',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Criteri pratici per scegliere un borgo che abbia davvero senso: accessibilita, atmosfera, cibo, ritmo e cose da fare senza correre.',
    description:
      'Criteri pratici per scegliere un borgo italiano che abbia davvero senso per un weekend lento: accessibilita, atmosfera, cibo, ritmo e cose da fare senza trasformare tutto in un tour veloce.',
    location: 'Italia',
    period: 'Primavera e autunno',
    budget: '€',
    duration: '2 giorni',
    readTime: '6 min',
    date: '10 aprile 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
Un borgo non basta fotografarlo. Per diventare un buon weekend deve avere ritmo, accoglienza e almeno un motivo vero per restare oltre la passeggiata principale. Questa guida e il metodo che usiamo noi per scegliere dove andare senza rimanere delusi.

## Perche andarci

Il weekend lento funziona quando riduce attriti: arrivo semplice, distanze brevi, una buona tavola e qualche deviazione interessante intorno. Il borgo sbagliato e quello scelto solo da una foto: bello in cartolina, morto di sabato sera. Il borgo giusto ha una comunita viva che ci abita, ristoranti aperti anche fuori stagione, un motivo per restare domenica mattina.

## Cosa valutare

Prima di scegliere guarda tre cose concrete: parcheggio o stazione raggiungibile, orari reali di ristoranti e botteghe (non quelli sul sito), presenza di percorsi brevi nei dintorni. Se tutto vive solo in alta stagione, serve cautela: potresti arrivare in un set cinematografico senza attori.

## Quando andare

Primavera e autunno sono spesso migliori dell estate. Meno folla, luce piu morbida, prezzi piu sensati. I weekend di maggio e ottobre sono ideali. Evita ferragosto: i borghi turistici si riempiono fino al soffocamento, i ristoranti triplicano i prezzi e la cucina cala di qualita.

## Le domande da fare

Come si mangia la sera? Se la risposta e "un pizza bar e un ristorante turistico" e gia un problema. C e qualcosa da fare domenica mattina? Un mercato, una camminata, una chiesa aperta. Il borgo e raggiungibile senza auto? Se si, e un vantaggio per il rientro senza stress.

## Consiglio Travellini

Scegli un posto dove puoi fare meno, ma farlo meglio: una trattoria di cui fidarti, un belvedere, un indirizzo artigiano, una camminata breve. Un weekend non e un itinerario, e un cambio di ritmo. Se torni a casa piu stanco di come sei partito, hai sbagliato scelta.
`,
    highlights: [
      'Criteri concreti per non scegliere solo da una foto',
      'Ritmo adatto a coppie e weekend brevi',
      'Focus su food, camminate leggere e atmosfera',
    ],
    tips: [
      'Controlla sempre gli orari aggiornati dei locali, non il sito.',
      'Evita borghi bellissimi ma troppo isolati se hai solo una notte.',
      'Cerca un secondo punto vicino per evitare un viaggio troppo monotematico.',
      'Parti venerdi sera se possibile: sabato mattina e gia un altra cosa.',
      'Chiedi al B&B dove mangiano loro, non la lista ufficiale.',
    ],
    packingList: [
      'Scarpe comode per pietra',
      'Giacca leggera',
      'Prenotazioni salvate offline',
      'Contanti per mercati',
    ],
    isMarkdown: true,
  },

  'guida-prima-di-prenotare': {
    id: 'guida-prima-di-prenotare',
    slug: 'guida-prima-di-prenotare',
    title: 'Prima di prenotare: la checklist Travellini',
    category: 'Consigli pratici',
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Una checklist editoriale per capire se una destinazione e coerente con tempo, budget e aspettative prima di cliccare prenota.',
    description:
      'Una checklist editoriale di domande da farsi prima di prenotare un viaggio, per capire se una destinazione e coerente con il tempo, il budget e le aspettative reali.',
    location: 'Metodo di viaggio',
    period: 'Tutto l anno',
    budget: 'Variabile',
    duration: 'Checklist',
    readTime: '5 min',
    date: '2 aprile 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    content: `
La scelta migliore non e sempre quella piu spettacolare. E quella che regge il tempo che hai, il budget reale e il tipo di energia che vuoi portare nel viaggio. Questa checklist nasce dopo anni di viaggi fatti bene e male. Serve a evitare decisioni prese solo da una foto Instagram.

## Perche usarla

Prima di prenotare conviene verificare se la destinazione e davvero compatibile con giorni, spostamenti, stagione e aspettative. Prenotare per entusiasmo e normale: il problema e quando non si controlla nulla e ci si ritrova a contare giorni persi in transfer, cene deludenti, distanze sottostimate.

## Le domande base

Quanto tempo perdo negli spostamenti? Se voli 10 ore per stare 4 giorni, il viaggio e gia compromesso. Cosa succede se piove? Una destinazione valida deve avere un piano B meteo. Ho almeno due motivi forti per scegliere questo posto? Un motivo solo e fragile. Il budget resta sensato anche nei costi nascosti (parcheggi, mance, attivita extra)?

## Gli errori tipici

Prenotare solo per una foto, sottovalutare distanze (400 km in Islanda sono 6 ore, non 4), ignorare stagionalita (la Provenza senza lavanda e un posto come un altro), accumulare troppe tappe in pochi giorni. Un viaggio con 5 basi in 7 giorni e gia esaurito prima di cominciare.

## Cosa aggiungere al conto

Tasse di soggiorno, parcheggi, pedaggi, costi di transfer aeroporto, mance culturali (USA, Canada, Egitto), assicurazione viaggio. In alcuni paesi questi costi sommati pesano il 15-20% in piu sul budget previsto. Non scoprirli all arrivo fa la differenza tra un viaggio rilassato e uno teso.

## Consiglio Travellini

Lascia sempre un margine di 1-2 giorni non programmati nel viaggio. Serviranno: per meteo avverso, per un posto che meritava piu tempo, per un riposo inaspettato. Un itinerario troppo pieno e il modo piu sicuro per trasformare una vacanza in una maratona.
`,
    highlights: [
      'Domande pratiche prima di acquistare voli o hotel',
      'Riduce itinerari troppo pieni',
      'Aiuta a scegliere destinazioni coerenti',
    ],
    tips: [
      'Controlla sempre il tempo reale degli spostamenti, non solo i chilometri.',
      'Prepara un piano B meteo per ogni giornata chiave.',
      'Lascia almeno un margine libero nel programma.',
      'Somma i costi nascosti al budget preventivato.',
      'Verifica orari stagionali reali di luoghi e trasporti.',
    ],
    packingList: ['Note salvate', 'Budget indicativo', 'Mappa offline'],
    isMarkdown: true,
  },

  'sardegna-nord-7-giorni-guida-completa': {
    id: 'sardegna-nord-7-giorni-guida-completa',
    slug: 'sardegna-nord-7-giorni-guida-completa',
    title: 'Sardegna del nord in 7 giorni: la nostra guida completa',
    category: 'Itinerari completi',
    type: 'pillar',
    image:
      'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=2000&auto=format&fit=crop',
    excerpt:
      'Sette giorni tra Gallura, Costa Smeralda e Asinara. Calette che vale la pena cercare, masserie contemporanee, cosa mangiare davvero e come muoversi senza trasformare la vacanza in un circuito turistico.',
    description:
      'Guida completa alla Sardegna del nord in 7 giorni. Itinerario giorno per giorno, hotel curati, food guide, budget reale, hidden gems. Tutto quello che serve per pianificare il viaggio senza altri tab aperti.',
    location: 'Sardegna, Italia',
    period: 'Maggio - giugno, settembre',
    budget: '€€€',
    duration: '7 giorni',
    readTime: '14 min',
    date: '20 aprile 2026',
    author: 'Rodrigo & Betta',
    continent: 'Europa',
    budgetBand: 'Alto',
    tripIntents: ['Posti particolari', 'Hotel con carattere', 'Passeggiate panoramiche'],
    disclosureType: 'none',
    verifiedAt: '2026-04-12',
    featuredPlacement: 'hub-destination',
    content: `
La Sardegna del nord non e una destinazione da spuntare in tre giorni. E una costa piu lunga di quanto sembri, con tre anime distinte — Gallura, Costa Smeralda, Asinara — che chiedono tempo per essere lette senza banalizzarle a "mare cristallino e basta".

Questo itinerario viene dai sette giorni che ci siamo costruiti noi a maggio. Non e una lista di "10 cose da vedere": e il ritmo che abbiamo verificato sul posto, con i tempi reali di spostamento, le calette che vale la pena cercare anche a piedi, e le scelte di alloggio che hanno fatto davvero la differenza.

## Perche andarci (e perche non in agosto)

La Sardegna funziona quando il mare e pulito, le strade non sono intasate e puoi trovare un tavolo a cena senza prenotare due settimane prima. Questo significa maggio, giugno prima del 20, o settembre dopo il 10. Fuori da questa finestra si entra in una logica completamente diversa: folla, prezzi premium su hotel medi, ristoranti che tirano via.

La finestra che consigliamo e la meta di maggio. Acqua ancora fresca ma nuotabile, temperature diurne 22-26 gradi, luce lunga per camminare al tramonto, paesi che si svegliano lentamente per la stagione. Se il mare caldo e fondamentale, sposta tutto a settembre: il mare resta balneabile fino a meta ottobre in certe baie riparate.

## Come arrivare e muoversi

Tre aeroporti di riferimento, ognuno con una logica diversa. Olbia e il piu vicino a Costa Smeralda e Gallura, ed e anche quello con piu voli low-cost da Roma, Milano e molte citta europee. Cagliari serve chi vuole mischiare sud e nord in un road trip piu lungo. Alghero e la porta d'ingresso naturale se il focus e ovest: Asinara, Bosa, Stintino.

Noleggia l'auto all'aeroporto e tienila tutta la settimana. I mezzi pubblici in Sardegna non coprono bene l'itinerario da viaggio: ci sono autobus estivi che collegano spiagge principali, ma perderai flessibilita e tempo. Con l'auto puoi decidere ogni mattina dove fermarti, cambiare destinazione per meteo, cercare calette che richiedono 200 metri di sterrato.

Il costo medio di un noleggio compatto a maggio e 35-55 euro al giorno, piu carburante (conta 60-80 euro per tutta la settimana se non esageri con le deviazioni). Prenota con 4-6 settimane di anticipo: i prezzi salgono ripidamente quando gli slot piu economici si esauriscono.

## Itinerario giorno per giorno

Questo e il ritmo che ha funzionato per noi. Parti da Olbia o da Alghero, ma adatta in base al tuo aeroporto di arrivo. Le tappe sono ordinate per ridurre al minimo i backtrack.

Giorno 1: atterraggio e Costa Smeralda leggera. Arrivi, ritiri l'auto, eviti la tentazione di fermarti subito in una caletta intasata. Sali verso Porto Cervo e poi ti sposti a Porto Rotondo per una prima serata calma. Cena leggera, pranzo del giorno dopo lo programmi sulla costa nord.

Giorno 2: la Costa Smeralda vera. Cala di Volpe, spiaggia del Principe, Cala Granu. Vai presto (entro le 9 sei gia in acqua) per evitare la folla che inizia alle 11. Piccolo secondo bagno al pomeriggio in un punto meno famoso come Portisco o Piccolo Pevero. Tramonto da Romazzino con vista sulla baia.

Giorno 3: arcipelago della Maddalena. Traghetto da Palau (15 minuti, ogni 20 minuti d'estate). Una giornata intera non basta per tutto, scegli: se hai tempo e meteo buono affitta una barca a vela con skipper (250-350 euro per un giorno, 4 persone) e vedi Budelli e Spargi. Alternativa low-budget: noleggio scooter sulla Maddalena e giro di Caprera + La Maddalena citta a piedi.

Giorno 4: Gallura interna. Lascia la costa per un giorno. San Pantaleo per il mercato del giovedi, un pranzo da dentro (non turistico, ma di paese) e poi Tempio Pausania o Aggius per vedere la Sardegna che non sta su Instagram. Ti servira per capire la regione, non solo per fotografarla.

Giorno 5: traversata verso ovest. Guida 2h30 da Olbia a Stintino passando per Castelsardo. Sosta pranzo a Castelsardo in uno dei ristoranti con vista sul golfo, poi scendi verso la Pelosa. La Pelosa e stupenda ma richiede prenotazione obbligatoria a pagamento (3.50 euro a persona, numeri chiusi giornalieri): fallo dal sito ufficiale due-tre settimane prima.

Giorno 6: Asinara. Parti da Porto Torres con una escursione guidata (metti in conto tutta la giornata, 50-70 euro a persona con pranzo). Il parco non e accessibile in modo libero, quindi scegli tra un giro in jeep fuoristrada con guida o una barca che fa il giro perimetrale fermandosi in tre calette. Noi abbiamo scelto la jeep: porta in posti che dalla barca non vedi e ha un altro ritmo.

Giorno 7: Bosa e rientro lento. Se il tuo volo parte di sera, fai Bosa al mattino con calma: una delle piu belle cittadine della Sardegna, colori pastello, una passeggiata lungo il Temo, un caffe nel centro storico. Poi rientro ad Alghero per l'aeroporto o ad Olbia (2h30 di strada panoramica) per i voli orientali.

## Cosa mangiare davvero

La cucina sarda non e "pasta allo scoglio e basta". Ci sono tre-quattro piatti firmati che valgono davvero il chilometro in piu, e altrettanti da riconoscere come trappole turistiche che aggirare.

Mangia sicuramente: culurgiones di patate e menta (ravioli sardi), fregola con frutti di mare (granello di grano duro tostato, consistenza unica), porceddu se incontri un vero ristorante di campagna (mai quello dei buffet grand hotel), pane carasau con olio e pomodoro fresco, bottarga di tonno grattugiata su spaghetti semplici. Per dolce, seadas con miele di corbezzolo.

Diffida di: menu turistici a 25 euro con "antipasto misto-primo-secondo-dolce" dove tutto sa di surgelato; pasta con "specialita locali" scritta in quattro lingue; cestini di pane industriale sul tavolo invece del carasau vero. Sono i tre segnali che il posto serve volume, non cucina.

Tre ristoranti su cui non abbiamo dubbi a consigliare: Agriturismo Li Licci (Aggius, Gallura) per il pranzo della tradizione vera, Il Gallinaro (Castelsardo) per pesce giornaliero a prezzi onesti, Andreini (Bosa) per un'ultima cena di viaggio in centro storico.

## Budget reale per 7 giorni in due

Questi sono i numeri che abbiamo speso noi a maggio 2026, stando su hotel di fascia media-alta ma senza resort iconici. Utili come baseline, poi tu modulici in base alle scelte. Coppia, due persone.

Voli andata-ritorno Milano-Olbia: 160-220 euro a persona se prenoti 6-8 settimane prima. Noleggio auto 7 giorni compatta: 320 euro totali. Carburante: 80 euro. Pedaggi e parcheggi: 30 euro. Hotel per 6 notti in strutture scelte come quelle che trovi sotto: 1400-1800 euro. Pranzi in spiaggia o trattoria semplice: 40-55 euro per due, cene in ristoranti decenti: 70-110 euro. Attivita singole (Asinara, La Maddalena): 180-280 euro. Spuntini, gelati, caffe: 120 euro.

Totale realistico per due: 2700-3500 euro tutto compreso, se fai scelte intelligenti senza rinunciare a qualita sulle due-tre serate importanti.

## Hidden gems che non leggi ovunque

Ci sono posti che non finiscono nelle top list ma che spesso sono la parte che ti ricordi piu di tutto. Questi sono i nostri quattro.

Cala Coticcio, Caprera. La chiamano Tahiti per l'acqua. Per raggiungerla servono 45 minuti a piedi con un po' di dislivello, e questo filtro naturale tiene lontana meta della folla. Porta acqua vera, non ombrellone: non c'e ombra naturale.

Spiaggia delle Saline, Stintino. A cinque minuti dalla Pelosa ma con un decimo della gente. Non e fotogenica come la sorella famosa, ma per stare in acqua un intero pomeriggio in pace, nessuna competizione.

Argentiera, Alghero. Miniera abbandonata sul mare, villaggio minerario in disuso, scogliere rosse. Non e balneabile, e una tappa estetica e storica. Ci vai al tramonto per la luce.

Bar Chiosco del Borgo a San Pantaleo. Il giovedi mattina mentre gli altri sono al mercato, tu ti siedi qui per la colazione vera con pastorelle e anziani del paese. E il nord Sardegna che non compare sulle guide.

## Link utili e risorse

Per pianificare meglio: assicurazione Heymondo con il nostro 10% di sconto dedicato, eSIM Airalo se il tuo piano dati europeo non basta, escursioni verificate su GetYourGuide per Maddalena e Asinara. Tutti i link che trovi nella barra affiliate in fondo sono servizi che abbiamo usato davvero.

Se vuoi espandere il viaggio: abbiamo una guida dedicata alla Sardegna del sud (Cagliari, Costa Rei, Villasimius) per chi vuole completare l'esperienza, e una sezione dedicata ai rifugi di design nelle Dolomiti se il tuo prossimo viaggio guarda verso la montagna invece del mare. Tutto linkato nella sezione articoli correlati.
`,
    highlights: [
      'Itinerario giorno per giorno testato sul campo — tempi e costi reali di maggio 2026',
      '3 hotel curati personalmente con budget, posizione e carattere molto diversi',
      'Food guide con piatti sardi veri e come riconoscere le trappole turistiche',
      '4 hidden gems che non trovi nelle top list generiche',
      'Budget completo in due (2700-3500 euro), scomposto per categoria',
    ],
    tips: [
      'Vai meta maggio, prima settimana di giugno o dopo il 10 settembre. Agosto solo se non hai alternativa.',
      'Prenota Pelosa online con 2-3 settimane di anticipo, altrimenti non entri in spiaggia.',
      'Noleggia lo scooter sulla Maddalena se vuoi esplorare Caprera senza barca.',
      'Parti presto ogni mattina: alle 9 sei in spiaggia con luce migliore e poca gente.',
    ],
    packingList: [
      'Scarpe da trekking leggere (per Cala Coticcio e sentieri costieri)',
      'Costume asciugabile due pezzi',
      'Borsa termica piccola per acqua e pranzo',
      'Cappello e protezione 50+',
      'Powerbank per giornate fuori dalla struttura',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrivo e Costa Smeralda leggera',
        description:
          'Ritiro auto, primo giro senza fretta tra Porto Cervo e Porto Rotondo. Cena calma.',
      },
      {
        day: 2,
        title: 'Costa Smeralda al massimo',
        description:
          'Cala di Volpe, Spiaggia del Principe, Cala Granu al mattino. Tramonto da Romazzino.',
      },
      {
        day: 3,
        title: 'Arcipelago della Maddalena',
        description:
          'Traghetto da Palau. Barca a vela con skipper verso Budelli e Spargi oppure scooter Caprera + Maddalena citta.',
      },
      {
        day: 4,
        title: 'Gallura interna',
        description:
          'San Pantaleo, Tempio Pausania o Aggius. La Sardegna che non sta su Instagram.',
      },
      {
        day: 5,
        title: 'Traversata verso ovest',
        description: 'Castelsardo a pranzo, Pelosa nel pomeriggio con prenotazione.',
      },
      {
        day: 6,
        title: 'Asinara',
        description: 'Giornata intera al parco con jeep fuoristrada guidata o barca perimetrale.',
      },
      {
        day: 7,
        title: 'Bosa e rientro',
        description:
          'Mattinata tra colori pastello e lungofiume Temo. Rientro lento verso aeroporto.',
      },
    ],
    hotels: [
      {
        name: 'Su Gologone Experience Hotel',
        image:
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1600&auto=format&fit=crop',
        bookingUrl: 'https://www.booking.com/hotel/it/su-gologone.it.html',
        category: 'Interno Gallura — arte e memoria',
        rating: 9.5,
        priceHint: '€280',
        badge: 'Nostra scelta',
      },
      {
        name: 'Hotel Pelicano',
        image:
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1600&auto=format&fit=crop',
        bookingUrl: 'https://www.booking.com/hotel/it/pelicano-palau.it.html',
        category: 'Palau — base Maddalena',
        rating: 9.1,
        priceHint: '€210',
      },
      {
        name: 'Capo Falcone Charming Apartments',
        image:
          'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1600&auto=format&fit=crop',
        bookingUrl: 'https://www.booking.com/hotel/it/capo-falcone-stintino.it.html',
        category: 'Stintino — vista Asinara',
        rating: 9.3,
        priceHint: '€240',
      },
    ],
    shopCta: {
      productType: 'maps',
      productUrl: '/shop/mappa-sardegna-nord',
      count: 24,
    },
    mapCenter: [9.3117, 40.9265],
    mapZoom: 8,
    mapMarkers: [
      {
        id: 'porto-cervo',
        name: 'Porto Cervo',
        title: 'Costa Smeralda',
        coordinates: [9.5368, 41.1413],
        category: 'Zona',
      },
      {
        id: 'la-maddalena',
        name: 'La Maddalena',
        title: 'Arcipelago',
        coordinates: [9.4069, 41.2142],
        category: 'Escursione',
      },
      {
        id: 'stintino-pelosa',
        name: 'Stintino — Pelosa',
        title: 'Spiaggia',
        coordinates: [8.2239, 40.9597],
        category: 'Spiaggia',
      },
      {
        id: 'asinara',
        name: 'Parco Asinara',
        title: 'Parco nazionale',
        coordinates: [8.2822, 41.0678],
        category: 'Parco',
      },
      {
        id: 'bosa',
        name: 'Bosa',
        title: 'Borgo',
        coordinates: [8.4992, 40.2967],
        category: 'Borgo',
      },
    ],
    isMarkdown: true,
  },
};

export const PREVIEW_GUIDES = Object.values(PREVIEW_ARTICLES).map((article) => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  category: article.category,
  image: article.image,
  excerpt: article.excerpt,
  readTime: article.readTime,
  createdAt: article.date,
}));
