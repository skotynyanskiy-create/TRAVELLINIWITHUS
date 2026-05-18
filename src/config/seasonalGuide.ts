/**
 * Travelliniwithus — Seasonal Guide "Quando andare"
 *
 * Marathon FASE 3.B 2026-05-18.
 *
 * Dataset 12-mesi per destinazione con: temp media (°C), giorni piovosi tipici,
 * affollamento percepito (low/medium/high), raccomandazione R+B testuale +
 * eventi notabili. Dataset statico baseline — refreshabile via field report
 * R+B trimestrali o batch script Open-Meteo Archive API.
 *
 * Coerente con `costBaselines.ts`: i mesi marcati come 'high' qui mappano sui
 * `highSeasonMonths` del catalogo costi (cross-check coerenza dati).
 *
 * Valori da knowledge cutoff + Climate normals 1991-2020 ENEA/ISPRA per Italia.
 * Aggiornare trimestralmente via batch Open-Meteo Archive API
 * (https://archive-api.open-meteo.com/v1/archive).
 */

export type Crowding = 'low' | 'medium' | 'high';

export interface MonthData {
  /** Indice mese 1-12 */
  month: number;
  /** Temperatura media giornaliera (°C) */
  tempC: number;
  /** Giorni piovosi tipici nel mese */
  rainDays: number;
  /** Livello affollamento turistico percepito da R+B */
  crowding: Crowding;
  /** Bollino R+B: true = mese consigliato, false = sconsigliato */
  recommended: boolean;
  /** Nota R+B specifica per il mese (max 100 char, italiano, voce R+B) */
  note?: string;
  /** Eventi notabili nel mese (festival, sagre, ricorrenze) */
  events?: string[];
}

export interface SeasonalGuide {
  /** Slug destinazione (deve corrispondere a costBaselines.ts + placeCatalog.ts) */
  slug: string;
  /** Nome italiano destinazione */
  name: string;
  /** Sintesi annuale R+B 1-2 frasi */
  yearSummary: string;
  /** Mesi migliori consigliati R+B (1-12) — comodo per UI ranking */
  bestMonths: number[];
  /** Mesi sconsigliati R+B (1-12) — affollamento estremo o clima ostile */
  avoidMonths: number[];
  /** Dataset 12 mesi */
  months: MonthData[];
  /** Timestamp ultimo aggiornamento (YYYY-MM) */
  updatedAt: string;
}

/* Helper interni — riducono boilerplate. */
const m = (
  month: number,
  tempC: number,
  rainDays: number,
  crowding: Crowding,
  recommended: boolean,
  note?: string,
  events?: string[]
): MonthData => ({ month, tempC, rainDays, crowding, recommended, note, events });

export const SEASONAL_GUIDES: Record<string, SeasonalGuide> = {
  salento: {
    slug: 'salento',
    name: 'Salento',
    yearSummary:
      'Meglio settembre e prima meta giugno: mare ancora caldo, niente folla di agosto, sere lunghe.',
    bestMonths: [5, 6, 9],
    avoidMonths: [7, 8],
    months: [
      m(1, 10, 8, 'low', false, "Tutto chiuso fuori Lecce, vento dall'Adriatico. Per noi no."),
      m(2, 10, 7, 'low', false, 'Carnevali nei borghi ma freddo per costa.'),
      m(3, 13, 6, 'low', false, 'Primi giorni belli ma trattorie costa ancora chiuse.', [
        'Festa di San Giuseppe',
      ]),
      m(
        4,
        16,
        6,
        'medium',
        true,
        'Iniziano ad aprire i lidi. Settimana santa = pasqua salentina.',
        ['Pasqua a Galatina']
      ),
      m(5, 20, 4, 'medium', true, 'Mese sottovalutato: mare 21°C, aperto tutto, no folla.'),
      m(6, 24, 3, 'medium', true, 'Prima meta perfetta. Seconda meta inizia a riempirsi.', [
        'Festa di San Giovanni (Otranto)',
      ]),
      m(
        7,
        27,
        2,
        'high',
        false,
        'Affollamento alto, prezzi ombrellone +60%. Vale solo se non hai scelta.'
      ),
      m(8, 28, 2, 'high', false, 'Ferragosto = traffico letale + lidi pieni. Vedi guida agosto.', [
        'La Notte della Taranta (Melpignano)',
      ]),
      m(9, 24, 4, 'medium', true, 'Il mese top. Mare ancora caldo, gente parte, prezzi scendono.'),
      m(10, 19, 6, 'low', true, 'Primi 15 giorni ottimi. Trattorie chiudono dal 15 in poi.'),
      m(11, 15, 9, 'low', false, 'Pioggia frequente, vento, tutto chiuso. Niente.'),
      m(12, 11, 8, 'low', false, 'Solo per Natale a Lecce centro storico.'),
    ],
    updatedAt: '2025-10',
  },

  sicilia: {
    slug: 'sicilia',
    name: 'Sicilia',
    yearSummary:
      'Aprile-giugno e ottobre i mesi piu equilibrati. Luglio-agosto solo se sai dove muoverti.',
    bestMonths: [4, 5, 10],
    avoidMonths: [8],
    months: [
      m(1, 12, 8, 'low', false, 'Vento, mare mosso. Per citta storiche fattibile.'),
      m(2, 12, 7, 'medium', true, 'Mandorli in fiore in Val di Noto, Carnevale di Acireale.', [
        'Carnevale di Acireale',
        'Mandorli in fiore (Agrigento)',
      ]),
      m(3, 14, 6, 'medium', true, 'Pasqua siciliana spettacolare, ancora poca gente.'),
      m(4, 17, 5, 'medium', true, 'Mese ideale per citta + entroterra. Mare ancora freddo.'),
      m(5, 21, 4, 'medium', true, 'Top per combinato mare+cultura. Etna ben visitabile.'),
      m(6, 25, 3, 'high', true, 'Bello ma inizia il caldo. Eolie/Egadi gia affollate.'),
      m(7, 28, 2, 'high', false, 'Caldo intenso entroterra (>35°C), folla sulle isole.'),
      m(8, 28, 3, 'high', false, 'Evita: ferragosto = ovunque pieno, prezzi raddoppiano.'),
      m(9, 25, 4, 'medium', true, 'Settembre top: mare caldo, gente parte, prezzi calano.'),
      m(10, 21, 6, 'low', true, 'Mese romantico: vendemmia, cibo di stagione, no folla.'),
      m(11, 17, 8, 'low', false, 'Pioggia frequente, sirocco. Solo citta.'),
      m(12, 13, 7, 'low', false, 'Natale catanese vivace, ma costa morta.'),
    ],
    updatedAt: '2025-10',
  },

  dolomiti: {
    slug: 'dolomiti',
    name: 'Dolomiti',
    yearSummary:
      'Doppia stagione: trekking giugno-settembre, sci dicembre-marzo. Maggio e novembre vuoti per riposare.',
    bestMonths: [6, 9, 1, 2],
    avoidMonths: [4, 11],
    months: [
      m(1, -3, 8, 'high', true, 'Sci pieno. Prenotazione 4 mesi prima per rifugi top.'),
      m(2, -2, 7, 'high', true, 'Carnevale + sci. Settimana bianca = boom.'),
      m(
        3,
        2,
        6,
        'medium',
        true,
        "Ultime settimane sci con sole alto. Aprire l'ombrello al rifugio."
      ),
      m(4, 6, 8, 'low', false, 'Stagione di mezzo: impianti chiusi, sentieri ancora innevati.'),
      m(5, 11, 9, 'low', false, 'Disgelo, sentieri fangosi. Aperti pochi rifugi.'),
      m(6, 15, 8, 'medium', true, 'Inizio trek serio. Fiori in quota. Ancora poca gente.'),
      m(7, 18, 7, 'high', true, 'Top trek ma rifugi pieni. Prenotare 2-3 mesi prima.'),
      m(8, 17, 8, 'high', false, 'Ferragosto: code sui sentieri famosi (Tre Cime, Seceda).'),
      m(9, 13, 6, 'medium', true, 'Mese top: trek, larici dorati, niente folla, malghe aperte.'),
      m(10, 8, 7, 'low', true, 'Prime nevicate, fine stagione trek, prezzi crollano.'),
      m(11, 2, 8, 'low', false, 'Stagione di mezzo opposta: tutto chiuso prima sci.'),
      m(12, -2, 7, 'high', true, 'Apre sci, Natale a Bolzano = mercatini.', [
        'Mercatini di Natale Bolzano',
      ]),
    ],
    updatedAt: '2025-09',
  },

  toscana: {
    slug: 'toscana',
    name: 'Toscana',
    yearSummary:
      'Tre finestre buone: aprile-maggio, settembre-ottobre, fine novembre. Estate solo se ami il caldo.',
    bestMonths: [4, 5, 9, 10],
    avoidMonths: [8],
    months: [
      m(1, 7, 8, 'low', false, 'Firenze fattibile ma piove. Campagna chiusa.'),
      m(2, 8, 8, 'low', false, 'Carnevale di Viareggio, ma campagna ancora morta.', [
        'Carnevale di Viareggio',
      ]),
      m(3, 12, 7, 'medium', true, "Primi caldi in citta, fioriture in Val d'Orcia."),
      m(4, 15, 7, 'medium', true, 'Pasqua + 25 aprile, agriturismi riaprono. Mese top.'),
      m(5, 20, 6, 'high', true, 'Mese piu bello: papaveri, lavanda inizio, sole. Si riempie pero.'),
      m(6, 24, 4, 'high', true, 'Inizia caldo serio. Costa ok, citta sopportabile.'),
      m(7, 28, 2, 'high', false, '>32°C in citta, Firenze invivibile per camminare.'),
      m(8, 28, 2, 'high', false, 'Evita Firenze. Costa pero meno orribile (sirocco fa pendere).'),
      m(9, 24, 4, 'medium', true, 'Vendemmia, top per cibo, ancora caldo per Costa.'),
      m(10, 18, 7, 'medium', true, 'Tartufo bianco, colori autunnali, prezzi calano.', [
        'Mostra Tartufo (San Miniato)',
      ]),
      m(11, 12, 9, 'low', true, 'Sottovalutato: piove ma luce bellissima, tutto vuoto.'),
      m(12, 8, 8, 'low', false, 'Natale a Firenze ok, campagna chiusa.'),
    ],
    updatedAt: '2025-10',
  },

  sardegna: {
    slug: 'sardegna',
    name: 'Sardegna',
    yearSummary:
      'Maggio e settembre i due mesi top. Agosto evitare salvo programma fitto + nervi saldi.',
    bestMonths: [5, 6, 9],
    avoidMonths: [8],
    months: [
      m(1, 11, 7, 'low', false, 'Tutto chiuso fuori Cagliari. No.'),
      m(2, 11, 6, 'low', false, 'Mandorli, primi sentieri. Costa morta.'),
      m(3, 13, 6, 'low', false, 'Pasqua riapre qualcosa. Sant Efisio prep.'),
      m(4, 16, 6, 'medium', true, 'Primi mesi buoni. Mare 17°C: solo coraggiosi.', [
        "Sant'Efisio (Cagliari, fine mese)",
      ]),
      m(5, 20, 4, 'medium', true, 'Mese top: aperto tutto, mare 19-21°C, no folla.'),
      m(6, 24, 3, 'medium', true, 'Bellissimo. Seconda meta inizia a riempirsi su Costa Smeralda.'),
      m(7, 27, 2, 'high', false, 'Folla, traghetti caro, lidi tutti prenotati.'),
      m(8, 28, 2, 'high', false, 'Evita salvo prenotazione 6 mesi prima. Prezzi 2x.'),
      m(9, 25, 4, 'medium', true, 'Top: mare caldo, traghetti scendono, locali aperti fino al 15.'),
      m(10, 21, 6, 'low', true, 'Primi 10 giorni meravigliosi, poi piano piano chiude.'),
      m(11, 16, 8, 'low', false, 'Pioggia frequente, mistral forte. Solo Cagliari.'),
      m(12, 12, 7, 'low', false, 'Solo Cagliari per Natale.'),
    ],
    updatedAt: '2025-09',
  },

  lisbona: {
    slug: 'lisbona',
    name: 'Lisbona',
    yearSummary:
      "Citta tutto l'anno fattibile. Aprile-maggio e ottobre i mesi piu equilibrati clima/prezzi/folla.",
    bestMonths: [4, 5, 10],
    avoidMonths: [],
    months: [
      m(1, 12, 9, 'low', true, 'Pioggia frequente ma poca folla, hotel scontati 40%.'),
      m(2, 13, 8, 'low', true, 'Mese sottovalutato: meno gente, sole alterno, prezzi bassi.'),
      m(3, 15, 7, 'medium', true, 'Riapertura completa, primi caldi.'),
      m(4, 17, 6, 'medium', true, 'Mese top: fiori, sole, ancora prezzi ragionevoli.', [
        '25 de Abril (festa nazionale)',
      ]),
      m(5, 20, 4, 'medium', true, 'Top + 1 di aprile: clima perfetto, sere lunghe.'),
      m(6, 23, 3, 'high', true, 'Festas dos Santos Populares = atmosfera unica.', [
        'Festas de Santo Antonio (12-13 giugno)',
      ]),
      m(7, 26, 1, 'high', false, 'Caldo serio + folla. Alfama invivibile alle 14.'),
      m(
        8,
        27,
        1,
        'high',
        false,
        'Evita: lisboeti partono, citta vuota di residenti, turisti ovunque.'
      ),
      m(9, 25, 3, 'medium', true, 'Settembre top: mare ancora caldo per gita a Cascais.'),
      m(10, 21, 6, 'medium', true, 'Ottobre top per ritmo lento: sole alterno, prezzi calano.'),
      m(11, 16, 9, 'low', true, 'Sottovalutato. Pastel + caffe + libreria = stagione perfetta.'),
      m(12, 13, 8, 'low', true, 'Natale tranquillo, ottimi prezzi voli.'),
    ],
    updatedAt: '2025-11',
  },

  procida: {
    slug: 'procida',
    name: 'Procida',
    yearSummary:
      'Isola piccola che ad agosto raddoppia. Giugno prima meta e settembre prima meta sono le finestre giuste.',
    bestMonths: [5, 6, 9],
    avoidMonths: [8],
    months: [
      m(
        1,
        11,
        9,
        'low',
        false,
        'Quasi tutto chiuso, traghetti ridotti. Solo se cerchi silenzio assoluto.'
      ),
      m(2, 12, 8, 'low', false, 'Vento, mare mosso. Pochi locali aperti.'),
      m(3, 14, 7, 'low', false, 'Inizia a respirare ma niente bagni ancora.'),
      m(4, 16, 6, 'medium', true, "Pasqua riapre l'isola, primi mesi belli."),
      m(5, 20, 4, 'medium', true, 'Mese top: aperto tutto, mare 19°C, no folla.'),
      m(6, 24, 3, 'medium', true, 'Prima meta perfetta. Seconda meta = inizia il pieno.'),
      m(7, 27, 2, 'high', false, 'Affollamento + prezzi raddoppiano. Corricella foto-fila.'),
      m(8, 28, 2, 'high', false, 'EVITA. Traghetti pieni, ristoranti senza posto, prezzi 2x.'),
      m(9, 25, 4, 'medium', true, 'Prima meta = mare ancora caldo, gente che parte. Top.'),
      m(10, 20, 7, 'low', true, 'Ottimo se trovi alloggio, ma molti chiudono dal 15.'),
      m(11, 15, 9, 'low', false, 'Pioggia frequente, traghetti ridotti.'),
      m(12, 12, 8, 'low', false, 'Solo per Natale a Napoli + gita giornaliera.'),
    ],
    updatedAt: '2025-09',
  },

  marche: {
    slug: 'marche',
    name: 'Marche',
    yearSummary:
      'Regione tre-stagioni: Conero estate, borghi entroterra autunno, citta universitarie inverno.',
    bestMonths: [5, 6, 9, 10],
    avoidMonths: [],
    months: [
      m(1, 6, 8, 'low', false, 'Pesaro e Macerata vivaci, borghi morti.'),
      m(2, 7, 8, 'low', false, 'Carnevale di Ascoli Piceno, resto pian piano riapre.', [
        'Carnevale di Ascoli Piceno',
      ]),
      m(3, 11, 7, 'low', true, 'Primi sentieri Conero, mandorli in fiore Fermo.'),
      m(4, 14, 7, 'medium', true, 'Pasqua marchigiana, riapertura agriturismi.'),
      m(5, 18, 6, 'medium', true, 'Top: campi gialli, Conero ancora vuoto, weather perfetto.'),
      m(6, 22, 5, 'medium', true, 'Prima meta perfetta, seconda meta inizia caldo serio.'),
      m(7, 26, 3, 'high', true, 'Caldo, Conero affollato weekend, borghi sopportabili.'),
      m(8, 26, 4, 'high', false, 'Ferragosto caos sul Conero. Entroterra ok.', [
        'Festival di Pesaro (cinema)',
        'Macerata Opera Festival',
      ]),
      m(9, 22, 5, 'medium', true, 'Settembre top: vendemmia, Conero quasi vuoto, mare 22°C.'),
      m(10, 17, 7, 'low', true, 'Tartufo, autunno colori bellissimi, no folla. Top mese.'),
      m(11, 11, 9, 'low', false, 'Piove. Solo citta universitarie (Urbino, Macerata).'),
      m(12, 7, 8, 'low', false, 'Natale ad Ascoli (presepi), resto chiuso.'),
    ],
    updatedAt: '2025-08',
  },

  liguria: {
    slug: 'liguria',
    name: 'Liguria di Levante',
    yearSummary:
      "Bella tutto l'anno fuori luglio/agosto. Maggio + settembre + autunno tardo i mesi top.",
    bestMonths: [5, 6, 9, 10],
    avoidMonths: [7, 8],
    months: [
      m(1, 9, 9, 'low', false, 'Vento di mare, locali piccoli aperti weekend.'),
      m(2, 9, 8, 'low', false, 'Carnevale piccoli paesi, costa ancora morta.'),
      m(3, 12, 8, 'low', true, 'Riapre tutto pian piano, primi gelati fuori.'),
      m(4, 14, 8, 'medium', true, 'Pasqua: Cinque Terre cominciano a riempirsi.'),
      m(
        5,
        18,
        6,
        'medium',
        true,
        'Mese top: temperatura perfetta, mare ancora freddo ma sentieri ok.'
      ),
      m(6, 22, 5, 'high', true, 'Prima meta perfetta. Cinque Terre attenzione weekend.'),
      m(
        7,
        25,
        3,
        'high',
        false,
        'Cinque Terre = folla insostenibile. Tellaro/Lerici sopportabile.'
      ),
      m(8, 26, 3, 'high', false, 'EVITA Cinque Terre. Levante meno turistico ok ma caro.'),
      m(9, 23, 5, 'medium', true, 'Top: mare 23°C, treno regionale vivibile, prezzi calano.'),
      m(10, 18, 8, 'medium', true, 'Autunno mediterraneo, focacce calde, no folla.'),
      m(11, 13, 9, 'low', false, 'Piove parecchio, mareggiate. Solo Genova fattibile.'),
      m(12, 10, 9, 'low', false, 'Natale a Genova vivace, costa morta.'),
    ],
    updatedAt: '2025-09',
  },

  marrakech: {
    slug: 'marrakech',
    name: 'Marrakech',
    yearSummary:
      'Marzo-aprile e ottobre-novembre le finestre top. Estate troppo calda, inverno tiepido di giorno.',
    bestMonths: [3, 4, 10, 11],
    avoidMonths: [7, 8],
    months: [
      m(
        1,
        13,
        4,
        'medium',
        true,
        'Tiepido di giorno (18°C), freddo notte. Riad con caminetto = magia.'
      ),
      m(2, 15, 4, 'medium', true, 'Mandorli in fiore Atlas, ancora poca folla.'),
      m(3, 18, 3, 'high', true, 'Top: temperature 24°C, fioriture, riad pieni ma vivibile.'),
      m(
        4,
        21,
        3,
        'high',
        true,
        'Ramadan variabile (controlla calendario). Pasqua europea = pieno.'
      ),
      m(5, 25, 2, 'medium', true, 'Inizia caldo serio. Souk roventi alle 14.'),
      m(6, 30, 1, 'low', false, 'Caldo intenso (>35°C). Solo se ami il deserto.'),
      m(7, 33, 0, 'low', false, 'EVITA: >40°C, riad invivibili senza piscina.'),
      m(8, 33, 0, 'low', false, 'Stesso luglio. Solo Marocchini di ritorno.'),
      m(9, 28, 1, 'low', true, 'Settembre tardo si abbassa il termometro. Buono inizio.'),
      m(10, 23, 3, 'high', true, 'Mese top: tappeti, festival, temperature perfette.', [
        'Festival International du Film de Marrakech (fine mese)',
      ]),
      m(11, 19, 3, 'high', true, 'Novembre top + 1: clima mite, prezzi non ancora alle stelle.'),
      m(12, 15, 4, 'high', true, 'Capodanno marocchino = riad pieni a partire da 26 dicembre.'),
    ],
    updatedAt: '2025-10',
  },
};

/** Helper: ottieni seasonal guide per slug destinazione. */
export function getSeasonalGuide(slug: string): SeasonalGuide | undefined {
  return SEASONAL_GUIDES[slug];
}

/** Labels italiani mese (1-12) — riusabili in UI. */
export const MONTH_NAMES_SHORT = [
  'Gen',
  'Feb',
  'Mar',
  'Apr',
  'Mag',
  'Giu',
  'Lug',
  'Ago',
  'Set',
  'Ott',
  'Nov',
  'Dic',
];

export const MONTH_NAMES_FULL = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
];
