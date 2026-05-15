import type { Itinerary } from '../types';

/**
 * Demo itinerari preview-only. Mostrano la struttura del tipo `Itinerary`
 * prima del seeding reale. Renderizzati con flag `isDemo: true` e DemoContentNotice.
 */
export const DEMO_ITINERARIES: Itinerary[] = [
  {
    id: 'sicilia-orientale-5gg',
    slug: 'sicilia-orientale-5gg',
    title: 'Sicilia orientale in 5 giorni',
    destination: 'Sicilia',
    region: 'Sicilia',
    continent: 'Europa',
    duration: 'Settimana (4-7 giorni)',
    durationDays: 5,
    period: 'Primavera',
    budget: '600 - 1500 a testa',
    budgetTier: 'medium',
    style: 'Slow & culturale',
    // TODO[R+B]: cover reale per itinerario Sicilia orientale
    image: '/images/destinations/sardegna.webp',
    excerpt:
      'Da Catania a Taormina passando per Siracusa: cinque giorni costruiti per leggere la Sicilia orientale senza farsi prendere dalla checklist.',
    highlights: [
      'Catania popolare, mercato della Pescheria al mattino',
      'Siracusa e Ortigia in un pomeriggio lento',
      'Etna al tramonto con guida locale',
      'Taormina vista dal Castelmola, fuori orario picco',
      'Cena di pesce a Brucoli, fuori rotta',
    ],
    stages: [
      {
        day: 1,
        title: 'Catania popolare',
        description:
          'Arrivo al mattino, base nel centro storico, mercato della Pescheria, granita e brioche col tuppo. Cena bassa in via Plebiscito.',
        sleep: 'Catania - palazzo storico ristrutturato',
      },
      {
        day: 2,
        title: 'Etna al tramonto',
        description:
          'Mattina tranquilla, partenza alle 14 con guida verso quota 1900. Discesa tra colate del 2002 e cena in cantina.',
        sleep: 'Catania',
      },
      {
        day: 3,
        title: 'Siracusa lenta',
        description:
          'Ortigia al mattino, pausa al porto piccolo, fonte Aretusa. Pomeriggio al Parco archeologico senza fretta.',
        sleep: 'Ortigia - relais sul lungomare',
      },
      {
        day: 4,
        title: 'Da Noto a Brucoli',
        description:
          'Mattina barocca a Noto, deviazione per Marzamemi (no folla aperitivo), sera a Brucoli per cena di pesce.',
        sleep: 'Brucoli',
      },
      {
        day: 5,
        title: 'Taormina senza tour bus',
        description:
          'Salita a Castelmola in tarda mattinata, Taormina nel pomeriggio basso (16-19) per la luce migliore.',
        sleep: 'Rientro o pernotto Taormina',
      },
    ],
    costs: [
      { label: 'Alloggi (4 notti, coppia)', range: '480 - 720' },
      { label: 'Cibo e ristoranti', range: '180 - 280 a testa' },
      { label: 'Etna con guida', range: '80 - 110 a testa' },
      { label: 'Spostamenti (noleggio + benzina)', range: '220 - 280' },
    ],
    bestFor: ['Coppie', 'Viaggiatori lenti', 'Chi vuole capire la Sicilia oltre la cartolina'],
    notFor: ['Chi cerca tour organizzati', 'Chi vuole solo mare a luglio-agosto'],
    relatedArticleSlug: 'cosa-vedere-catania',
    relatedGuideSlug: 'weekend-catania',
    isDemo: true,
  },
  {
    id: 'andalusia-weekend',
    slug: 'andalusia-weekend',
    title: 'Andalusia in un weekend lungo',
    destination: 'Andalusia',
    region: 'Andalusia',
    continent: 'Europa',
    duration: 'Weekend (2-3 giorni)',
    durationDays: 4,
    period: 'Autunno',
    budget: '600 - 1500 a testa',
    budgetTier: 'medium',
    style: 'Romantico in coppia',
    // TODO[R+B]: cover reale per itinerario Andalusia
    image: '/images/destinations/toscana.webp',
    excerpt:
      "Quattro giorni tra Siviglia e Cordoba pensati per chi non ha tempo ma vuole entrare nel ritmo dell'Andalusia senza tirare diritto.",
    highlights: [
      'Siviglia di notte, tapas in Triana',
      'Alcazar la mattina presto, evita la fila',
      'Mezquita di Cordoba in luce bassa',
      'Bagno arabo al rientro',
    ],
    stages: [
      {
        day: 1,
        title: 'Arrivo Siviglia',
        description:
          'Arrivo nel tardo pomeriggio, base a Santa Cruz. Aperitivo con vermouth e cena di tapas a Triana.',
        sleep: 'Siviglia - boutique in Santa Cruz',
      },
      {
        day: 2,
        title: 'Siviglia',
        description:
          'Alcazar all apertura, cattedrale e Giralda, pausa pranzo a Las Setas. Tramonto in barca sul Guadalquivir.',
        sleep: 'Siviglia',
      },
      {
        day: 3,
        title: 'Cordoba e Mezquita',
        description:
          'Treno di prima mattina, Mezquita all apertura, vagare tra patii e juderia. Rientro a Siviglia per cena.',
        sleep: 'Siviglia',
      },
      {
        day: 4,
        title: 'Bagno arabo e ritorno',
        description: 'Bagno arabo nel pomeriggio prima del volo, cena leggera a Triana.',
        sleep: 'Rientro',
      },
    ],
    costs: [
      { label: 'Voli a/r', range: '160 - 240 a testa' },
      { label: 'Alloggi (3 notti, coppia)', range: '320 - 480' },
      { label: 'Treni Siviglia - Cordoba', range: '40 - 60 a testa' },
      { label: 'Cibo e ristoranti', range: '120 - 180 a testa' },
    ],
    bestFor: ['Coppie short break', 'Primo viaggio in Andalusia'],
    relatedArticleSlug: 'andalusia-weekend',
    relatedGuideSlug: 'siviglia-cordoba',
    isDemo: true,
  },
  {
    id: 'dolomiti-3gg',
    slug: 'dolomiti-3gg',
    title: 'Dolomiti slow in 3 giorni',
    destination: 'Trentino-Alto Adige',
    region: 'Trentino-Alto Adige',
    continent: 'Europa',
    duration: 'Weekend (2-3 giorni)',
    durationDays: 3,
    period: 'Estate',
    budget: 'Sopra i 1500 a testa',
    budgetTier: 'premium',
    style: 'Boutique & design',
    // TODO[R+B]: cover reale per itinerario Dolomiti slow
    image: '/images/destinations/dolomiti.webp',
    excerpt:
      'Tre giorni costruiti per leggere le Dolomiti senza affannarsi: una valle, due punti forti, un rifugio scelto bene.',
    highlights: [
      'Rifugio con architettura contemporanea',
      'Sentiero panoramico evitando le ore centrali',
      'Cena di malga firmata',
      'Bagno freddo in lago alpino',
    ],
    stages: [
      {
        day: 1,
        title: 'Arrivo e prima luce',
        description: 'Base in valle, passeggiata breve, cena semplice per entrare nel ritmo.',
        sleep: 'Rifugio di design',
      },
      {
        day: 2,
        title: 'Camminata e malga',
        description:
          'Sentiero panoramico al mattino, pausa lunga in malga, ritorno con luce bassa.',
        sleep: 'Rifugio',
      },
      {
        day: 3,
        title: 'Lago alpino e ritorno',
        description: 'Mattina al lago, bagno breve, rientro nel pomeriggio.',
      },
    ],
    costs: [
      { label: 'Rifugio (2 notti, coppia)', range: '420 - 680' },
      { label: 'Cibo e malghe', range: '90 - 140 a testa' },
      { label: 'Carburante', range: '60 - 100' },
    ],
    bestFor: ['Coppie', 'Primo viaggio Dolomiti', 'Lettori con poco tempo'],
    notFor: ['Trekker hardcore', 'Chi cerca grandi distanze'],
    relatedArticleSlug: 'demo-articolo-dolomiti',
    isDemo: true,
  },
];

export const DEMO_ITINERARY_SLUGS = DEMO_ITINERARIES.map((item) => item.slug);
