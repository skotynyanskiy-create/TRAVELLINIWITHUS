/**
 * Travelliniwithus — Quiz "Che coppia di viaggiatori siete"
 *
 * 6 archetipi italiani per coppie. Risultato del quiz mappa l'utente su uno
 * di questi, lo segmenta nella mailing list, e abilita personalizzazione
 * della homepage + suggerimenti articolo + lead magnet differenziati.
 *
 * Marathon FASE 1.B — 2026-05-17.
 *
 * Riferimento strategico: docs/10_Projects/PROJECT_MARATHON_FULL_90_DAYS.md
 */

export type ArchetypeId =
  | 'lento-del-sud'
  | 'cercatrice-borghi'
  | 'alpinista-civile'
  | 'coppia-di-costa'
  | 'famiglia-in-movimento'
  | 'notturno-urbano';

export interface Archetype {
  id: ArchetypeId;
  /** Nome breve da mostrare al risultato (italiano, evocativo, non clickbait) */
  name: string;
  /** Sottotitolo descrittivo 1 riga */
  tagline: string;
  /** Descrizione lunga 2-3 frasi (mostrata sul risultato + email onboarding) */
  description: string;
  /** Eyebrow tematico per scheda (8-12 char, uppercase) */
  eyebrow: string;
  /** Foto hero archetype — DEVE essere una foto reale R+B su una destinazione coerente */
  heroImage: string;
  /** Alt italiano descrittivo per heroImage */
  heroImageAlt: string;
  /** 3 destinazioni-firma dell'archetype (slug nell'archivio articoli) */
  signatureDestinations: string[];
  /** Tag GA4 per user property */
  ga4Tag: string;
  /** Mailing list segment label */
  segmentLabel: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  'lento-del-sud': {
    id: 'lento-del-sud',
    name: 'Il Lento del Sud',
    tagline: 'Siesta, ulivi, mare alle cinque.',
    description:
      "Vi piacciono i posti dove il pomeriggio dura ore. Mangiate dove cucina la famiglia, dormite con la finestra aperta, e non avete fretta di tornare alla macchina. Il sud lento dell'Italia e' il vostro stato naturale.",
    eyebrow: 'SUD LENTO',
    heroImage: '/images/destinations/puglia.webp',
    heroImageAlt:
      'Vicolo bianco con bouganville nel centro storico di un borgo pugliese al tramonto',
    signatureDestinations: ['salento-agosto', 'cilento-paestum', 'matera-fuori-stagione'],
    ga4Tag: 'lento_del_sud',
    segmentLabel: 'Sud Lento',
  },
  'cercatrice-borghi': {
    id: 'cercatrice-borghi',
    name: 'La Cercatrice di Borghi',
    tagline: 'Piazze piccole, pietra, una mostra che non sa nessuno.',
    description:
      'Tre borghi in un weekend non vi stancano: anzi, vi caricano. Cercate quelli giusti, non quelli votati come "piu belli". Un\'enoteca che ha tre tavoli, un museo civico aperto solo il sabato, una passeggiata al cimitero monumentale.',
    eyebrow: 'BORGHI CIVILI',
    /* TODO R+B: sostituire con foto Marche/Umbria/Tuscia autentica quando disponibile.
       Fallback Toscana mantiene coerenza visiva (borgo collinare italiano). */
    heroImage: '/images/destinations/toscana.webp',
    heroImageAlt: 'Borgo collinare italiano al tramonto con campanile e cipressi sullo sfondo',
    signatureDestinations: ['umbria-spoleto-cascia', 'marche-fermo-offida', 'tuscia-bomarzo'],
    ga4Tag: 'cercatrice_borghi',
    segmentLabel: 'Borghi Civili',
  },
  'alpinista-civile': {
    id: 'alpinista-civile',
    name: "L'Alpinista Civile",
    tagline: 'Cammino, mangio bene, dormo presto.',
    description:
      "Non siete da camere d'albergo che danno sul parcheggio. Quando partite, lo fate per le Dolomiti minori, per la Val Maira a giugno, per la Carnia in autunno. Un sentiero E ai vostri occhi e' poco; cercate i T che diventano EE in due ore.",
    eyebrow: 'ALPE LENTA',
    heroImage: '/images/destinations/dolomiti.webp',
    heroImageAlt:
      'Sentiero alpino di alta quota con coppia di camminatori che osserva un panorama dolomitico',
    signatureDestinations: ['val-maira', 'dolomiti-minori', 'carnia-autunno'],
    ga4Tag: 'alpinista_civile',
    segmentLabel: 'Alpe Lenta',
  },
  'coppia-di-costa': {
    id: 'coppia-di-costa',
    name: 'La Coppia di Costa',
    tagline: 'Falesia, scogliera, una caletta al chilometro sette.',
    description:
      'Mare ma non lido. Voi siete quelli che parcheggiano al chilometro sette del lungomare, scendono 200 gradini, si tuffano dalla roccia e bevono il caffe alle dieci in un baretto di pescatori. Conero, Levante ligure, Gargano vi capiscono.',
    eyebrow: 'COSTA VERA',
    /* TODO R+B: sostituire con foto Liguria/Conero/Gargano. Fallback Sardegna
       per coerenza visiva (mare italiano con scogliera). */
    heroImage: '/images/destinations/sardegna.webp',
    heroImageAlt: 'Caletta rocciosa italiana con acqua trasparente e scogliera al sole',
    signatureDestinations: ['conero-numana-sirolo', 'levante-tellaro', 'gargano-vieste-peschici'],
    ga4Tag: 'coppia_di_costa',
    segmentLabel: 'Costa Vera',
  },
  'famiglia-in-movimento': {
    id: 'famiglia-in-movimento',
    name: 'La Famiglia in Movimento',
    tagline: 'Due bambini, una macchina, tre fermate al giorno massimo.',
    description:
      "Viaggiate con due piccoli (o uno + un cane), e avete imparato che la distanza giusta non e' quella sulla mappa: e' quella che reggono loro. Cercate posti dove il ristorante ha menu vero per bambini e l'albergo ha la lavatrice. Trentino, Maremma, Sardegna del nord.",
    eyebrow: 'FAMIGLIA SLOW',
    /* TODO R+B: sostituire con foto Trentino/Maremma con famiglia. Fallback
       Dolomiti per coerenza visiva (paesaggio alpino italiano). */
    heroImage: '/images/destinations/dolomiti.webp',
    heroImageAlt: 'Paesaggio dolomitico con prato alpino e lago di montagna sullo sfondo',
    signatureDestinations: ['trentino-laghi', 'maremma-castiglione', 'sardegna-stintino'],
    ga4Tag: 'famiglia_in_movimento',
    segmentLabel: 'Famiglia Slow',
  },
  'notturno-urbano': {
    id: 'notturno-urbano',
    name: 'Il Notturno Urbano',
    tagline: "Citta' grandi, dopo le dieci, prima di mezzanotte.",
    description:
      'Voi siete da citta. Ma non dalle dieci del mattino: dalle dieci di sera. Cercate il caffe storico ancora aperto, il jazz club nel seminterrato, la trattoria che chiude alle due. Napoli, Palermo, Bologna by night vi parlano.',
    eyebrow: 'NOTTE CIVILE',
    /* TODO R+B: foto Napoli/Palermo/Bologna notturna. Fallback Puglia per
       coerenza visiva (vita serale italiana del sud). */
    heroImage: '/images/destinations/puglia.webp',
    heroImageAlt:
      'Vicolo del centro storico italiano illuminato dalle luci calde dei locali serali',
    signatureDestinations: ['napoli-spagnoli-night', 'palermo-vucciria', 'bologna-via-dei-poeti'],
    ga4Tag: 'notturno_urbano',
    segmentLabel: 'Notte Civile',
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as ArchetypeId[];

/**
 * Quiz domande con scoring matrix.
 *
 * Ogni risposta assegna punteggi (0-3) a uno o piu archetipi.
 * L'archetipo con punteggio totale piu alto vince.
 * In caso di pareggio, sceglie il primo nell'ordine di ARCHETYPE_IDS.
 */
export interface QuizQuestion {
  id: string;
  /** Domanda italiana, max 14 parole, no marketese */
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  /** Risposta italiana, max 12 parole */
  label: string;
  /** Scoring: archetype → punti */
  score: Partial<Record<ArchetypeId, number>>;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-stagione',
    question: 'Quando partite, di solito?',
    options: [
      {
        id: 'q1-estate-piena',
        label: "Agosto, anche se c'e' gente.",
        score: { 'lento-del-sud': 2, 'coppia-di-costa': 2, 'famiglia-in-movimento': 3 },
      },
      {
        id: 'q1-mezza-stagione',
        label: 'Maggio o settembre, mai a Ferragosto.',
        score: { 'cercatrice-borghi': 3, 'coppia-di-costa': 2, 'alpinista-civile': 2 },
      },
      {
        id: 'q1-inverno',
        label: "Anche d'inverno se il posto regge.",
        score: { 'alpinista-civile': 3, 'notturno-urbano': 2, 'cercatrice-borghi': 1 },
      },
    ],
  },
  {
    id: 'q2-posto',
    question: 'Il prossimo viaggio, dove vi vedete?',
    options: [
      {
        id: 'q2-mare-roccia',
        label: 'Mare con scogliera, non lido attrezzato.',
        score: { 'coppia-di-costa': 3, 'lento-del-sud': 1 },
      },
      {
        id: 'q2-borgo-collina',
        label: 'Borgo medievale dove dormono in due.',
        score: { 'cercatrice-borghi': 3, 'lento-del-sud': 1 },
      },
      {
        id: 'q2-montagna',
        label: 'Rifugio in quota, due notti.',
        score: { 'alpinista-civile': 3 },
      },
      {
        id: 'q2-citta',
        label: 'Una citta grande, dieci giorni.',
        score: { 'notturno-urbano': 3, 'famiglia-in-movimento': 1 },
      },
    ],
  },
  {
    id: 'q3-ritmo',
    question: 'Una giornata tipo in vacanza?',
    options: [
      {
        id: 'q3-due-cose',
        label: 'Due cose al massimo, con tempo a vuoto.',
        score: { 'lento-del-sud': 3, 'coppia-di-costa': 2, 'famiglia-in-movimento': 2 },
      },
      {
        id: 'q3-quattro-cose',
        label: 'Quattro tappe ma a piedi, vicine.',
        score: { 'cercatrice-borghi': 3, 'notturno-urbano': 2 },
      },
      {
        id: 'q3-attivita-fisica',
        label: 'Sentiero al mattino, libro al pomeriggio.',
        score: { 'alpinista-civile': 3, 'cercatrice-borghi': 1 },
      },
    ],
  },
  {
    id: 'q4-cibo',
    question: 'Dove mangiate la sera?',
    options: [
      {
        id: 'q4-trattoria-paese',
        label: 'Trattoria di paese, dove cucina la famiglia.',
        score: { 'lento-del-sud': 3, 'cercatrice-borghi': 2, 'famiglia-in-movimento': 1 },
      },
      {
        id: 'q4-osteria-urbana',
        label: "Osteria in citta', tavoli stretti, lista corta.",
        score: { 'notturno-urbano': 3, 'cercatrice-borghi': 1 },
      },
      {
        id: 'q4-rifugio',
        label: 'Rifugio: polenta e formaggi di malga.',
        score: { 'alpinista-civile': 3 },
      },
      {
        id: 'q4-cala-tramonto',
        label: 'Stabilimento sul mare aperto la sera.',
        score: { 'coppia-di-costa': 3, 'famiglia-in-movimento': 1 },
      },
    ],
  },
  {
    id: 'q5-budget',
    question: 'Budget per una settimana, in coppia (senza voli)?',
    options: [
      {
        id: 'q5-low',
        label: 'Sotto i 1.000 € se possibile.',
        score: { 'famiglia-in-movimento': 2, 'cercatrice-borghi': 2 },
      },
      {
        id: 'q5-mid',
        label: 'Tra 1.000 e 2.000 €.',
        score: {
          'lento-del-sud': 2,
          'coppia-di-costa': 2,
          'alpinista-civile': 2,
          'notturno-urbano': 2,
        },
      },
      {
        id: 'q5-high',
        label: 'Oltre 2.000 €, se vale.',
        score: { 'notturno-urbano': 1, 'cercatrice-borghi': 1, 'alpinista-civile': 1 },
      },
    ],
  },
  {
    id: 'q6-mezzo',
    question: 'Come vi muovete?',
    options: [
      {
        id: 'q6-auto',
        label: 'In macchina, per fermarci dove vogliamo.',
        score: {
          'lento-del-sud': 2,
          'cercatrice-borghi': 2,
          'famiglia-in-movimento': 3,
          'alpinista-civile': 2,
        },
      },
      {
        id: 'q6-treno',
        label: 'Treno, anche se piu lento.',
        score: { 'notturno-urbano': 2, 'coppia-di-costa': 1 },
      },
      {
        id: 'q6-aereo',
        label: 'Aereo + auto in loco.',
        score: { 'notturno-urbano': 1, 'famiglia-in-movimento': 1 },
      },
    ],
  },
  {
    id: 'q7-quando-felici',
    question: 'Quando siete piu felici, in viaggio?',
    options: [
      {
        id: 'q7-mattina',
        label: 'Al mattino presto, prima della folla.',
        score: { 'alpinista-civile': 3, 'cercatrice-borghi': 2, 'famiglia-in-movimento': 1 },
      },
      {
        id: 'q7-pomeriggio-lento',
        label: 'Al pomeriggio, con il caldo e il niente.',
        score: { 'lento-del-sud': 3, 'coppia-di-costa': 2 },
      },
      {
        id: 'q7-sera-tardi',
        label: 'La sera tardi, quando le strade si svuotano.',
        score: { 'notturno-urbano': 3, 'cercatrice-borghi': 1 },
      },
    ],
  },
];

/**
 * Calcola l'archetipo vincente dato l'array di optionId scelte dall'utente.
 *
 * Logica: somma punteggi cross-questione per ogni archetipo, ritorna l'archetype
 * con score massimo. In caso di pareggio, primo nell'ordine ARCHETYPE_IDS.
 */
export function computeArchetype(selectedOptionIds: string[]): ArchetypeId {
  const scores: Record<ArchetypeId, number> = {
    'lento-del-sud': 0,
    'cercatrice-borghi': 0,
    'alpinista-civile': 0,
    'coppia-di-costa': 0,
    'famiglia-in-movimento': 0,
    'notturno-urbano': 0,
  };

  for (const optionId of selectedOptionIds) {
    for (const question of QUIZ_QUESTIONS) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const [archId, points] of Object.entries(option.score)) {
        scores[archId as ArchetypeId] += points ?? 0;
      }
    }
  }

  let winner: ArchetypeId = ARCHETYPE_IDS[0];
  let maxScore = -1;
  for (const id of ARCHETYPE_IDS) {
    if (scores[id] > maxScore) {
      maxScore = scores[id];
      winner = id;
    }
  }
  return winner;
}
