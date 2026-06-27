/**
 * Travelliniwithus — Cost Baselines per destinazione.
 *
 * Marathon FASE 3.C 2026-05-17 — Cost Calculator "Quanto costa il vostro viaggio".
 *
 * Ogni destinazione mappa a un range di costi giornalieri (per coppia) per 4
 * voci principali: alloggio, cibo, trasporti locali, attivita. I range sono
 * basati sui field report R+B (aggiornati al timestamp indicato).
 *
 * IMPORTANTE: questi sono dati TIPICI, NON garanzie. L'UI deve mostrare
 * sempre il range completo (min-max) e timestamp di aggiornamento.
 *
 * Da aggiornare a cadenza trimestrale via field report R+B aggiornati.
 */

export type TravelStyle = 'lean' | 'medium' | 'premium';
export type SeasonPeriod = 'bassa' | 'spalla' | 'alta';

export interface CostBreakdown {
  /** Costo giornaliero alloggio (coppia, EUR) — range [min, max] */
  alloggio: [number, number];
  /** Costo giornaliero cibo (coppia, EUR) — range [min, max] */
  cibo: [number, number];
  /** Costo giornaliero trasporti locali (coppia, EUR) — range [min, max] */
  trasporti: [number, number];
  /** Costo giornaliero attivita/ingressi (coppia, EUR) — range [min, max] */
  attivita: [number, number];
}

export interface DestinationBaseline {
  slug: string;
  /** Nome italiano destinazione */
  name: string;
  /** Categoria geografica (per filtraggio) */
  region: 'Italia-Sud' | 'Italia-Centro' | 'Italia-Nord' | 'Italia-Isole' | 'Europa' | 'Mondo';
  /** Note specifiche su questa destinazione */
  notes?: string;
  /** Costi per style — lean / medium / premium */
  costs: Record<TravelStyle, CostBreakdown>;
  /** Moltiplicatori stagionali sul totale (1.0 = baseline) */
  seasonalMultiplier: Record<SeasonPeriod, number>;
  /** Mesi tipici di "alta stagione" (1-12) */
  highSeasonMonths: number[];
  /** Mesi tipici di "spalla" (1-12) */
  shoulderSeasonMonths: number[];
  /** Timestamp ultimo aggiornamento (YYYY-MM) */
  updatedAt: string;
}

/**
 * Baseline destinazioni — popolato con range tipici da esperienza R+B.
 *
 * Inizia con 6 destinazioni pillar Travellini. Si estende mano a mano che
 * R+B pubblicano nuovi field report e validano i numeri.
 */
export const DESTINATION_BASELINES: Record<string, DestinationBaseline> = {
  salento: {
    slug: 'salento',
    name: 'Salento',
    region: 'Italia-Sud',
    notes:
      'Costi tipici Lecce + costa adriatica/ionica. Ad agosto i lidi raddoppiano. Alloggio in masserie/B&B fuori Lecce risparmia 30-40%.',
    costs: {
      lean: {
        alloggio: [55, 85],
        cibo: [35, 50],
        trasporti: [15, 25],
        attivita: [10, 20],
      },
      medium: {
        alloggio: [95, 160],
        cibo: [55, 90],
        trasporti: [25, 40],
        attivita: [20, 40],
      },
      premium: {
        alloggio: [180, 320],
        cibo: [100, 180],
        trasporti: [40, 70],
        attivita: [40, 90],
      },
    },
    seasonalMultiplier: { bassa: 0.7, spalla: 1.0, alta: 1.6 },
    highSeasonMonths: [7, 8],
    shoulderSeasonMonths: [6, 9],
    updatedAt: '2025-09',
  },
  sicilia: {
    slug: 'sicilia',
    name: 'Sicilia',
    region: 'Italia-Isole',
    notes:
      "Range alto data la varieta isola: Palermo + Eolie e' diverso da Ragusa. Stima media Sicilia orientale (Catania-Noto-Modica-Ragusa).",
    costs: {
      lean: {
        alloggio: [50, 80],
        cibo: [30, 50],
        trasporti: [20, 35],
        attivita: [10, 25],
      },
      medium: {
        alloggio: [90, 150],
        cibo: [50, 85],
        trasporti: [30, 55],
        attivita: [25, 50],
      },
      premium: {
        alloggio: [170, 300],
        cibo: [95, 170],
        trasporti: [55, 90],
        attivita: [45, 100],
      },
    },
    seasonalMultiplier: { bassa: 0.7, spalla: 1.0, alta: 1.5 },
    highSeasonMonths: [7, 8],
    shoulderSeasonMonths: [5, 6, 9, 10],
    updatedAt: '2025-10',
  },
  dolomiti: {
    slug: 'dolomiti',
    name: 'Dolomiti',
    region: 'Italia-Nord',
    notes:
      'Doppia alta stagione (estate + inverno). Rifugi prezzi simili tra loro, escursionismo abbatte costi attivita.',
    costs: {
      lean: {
        alloggio: [60, 95],
        cibo: [35, 55],
        trasporti: [15, 30],
        attivita: [10, 25],
      },
      medium: {
        alloggio: [110, 180],
        cibo: [55, 90],
        trasporti: [25, 50],
        attivita: [20, 45],
      },
      premium: {
        alloggio: [200, 350],
        cibo: [95, 170],
        trasporti: [50, 90],
        attivita: [40, 90],
      },
    },
    seasonalMultiplier: { bassa: 0.8, spalla: 1.0, alta: 1.45 },
    highSeasonMonths: [7, 8, 12, 1, 2],
    shoulderSeasonMonths: [6, 9, 11, 3],
    updatedAt: '2025-08',
  },
  toscana: {
    slug: 'toscana',
    name: 'Toscana',
    region: 'Italia-Centro',
    notes: 'Firenze drains budget alloggio. Campagna senese 30% più economica con qualità simile.',
    costs: {
      lean: {
        alloggio: [55, 90],
        cibo: [40, 60],
        trasporti: [20, 35],
        attivita: [15, 30],
      },
      medium: {
        alloggio: [100, 170],
        cibo: [60, 95],
        trasporti: [30, 50],
        attivita: [25, 55],
      },
      premium: {
        alloggio: [190, 350],
        cibo: [110, 190],
        trasporti: [50, 90],
        attivita: [45, 110],
      },
    },
    seasonalMultiplier: { bassa: 0.75, spalla: 1.0, alta: 1.4 },
    highSeasonMonths: [6, 7, 8, 9],
    shoulderSeasonMonths: [4, 5, 10],
    updatedAt: '2025-09',
  },
  sardegna: {
    slug: 'sardegna',
    name: 'Sardegna',
    region: 'Italia-Isole',
    notes:
      'Volo o traghetto = costo extra fisso non incluso. Costa Smeralda raddoppia tutto, nord-ovest equilibrato.',
    costs: {
      lean: {
        alloggio: [60, 100],
        cibo: [35, 55],
        trasporti: [25, 45],
        attivita: [10, 25],
      },
      medium: {
        alloggio: [110, 180],
        cibo: [55, 90],
        trasporti: [40, 70],
        attivita: [25, 55],
      },
      premium: {
        alloggio: [200, 380],
        cibo: [100, 180],
        trasporti: [65, 110],
        attivita: [50, 120],
      },
    },
    seasonalMultiplier: { bassa: 0.65, spalla: 1.0, alta: 1.7 },
    highSeasonMonths: [7, 8],
    shoulderSeasonMonths: [6, 9],
    updatedAt: '2025-09',
  },
  lisbona: {
    slug: 'lisbona',
    name: 'Lisbona',
    region: 'Europa',
    notes:
      'Città europea con costi cibo ancora abbordabili. Quartieri Alfama/Bairro Alto più cari di Anjos/Marvila.',
    costs: {
      lean: {
        alloggio: [55, 90],
        cibo: [30, 50],
        trasporti: [15, 25],
        attivita: [15, 30],
      },
      medium: {
        alloggio: [100, 170],
        cibo: [50, 85],
        trasporti: [20, 40],
        attivita: [25, 50],
      },
      premium: {
        alloggio: [190, 330],
        cibo: [90, 160],
        trasporti: [40, 70],
        attivita: [45, 95],
      },
    },
    seasonalMultiplier: { bassa: 0.85, spalla: 1.0, alta: 1.25 },
    highSeasonMonths: [6, 7, 8, 9],
    shoulderSeasonMonths: [4, 5, 10],
    updatedAt: '2025-11',
  },

  procida: {
    slug: 'procida',
    name: 'Procida',
    region: 'Italia-Isole',
    notes:
      'Isola piccola, prezzi raddoppiano ad agosto. Marina di Corricella è la zona più cara. Traghetto Pozzuoli-Procida + voce extra.',
    costs: {
      lean: {
        alloggio: [70, 110],
        cibo: [35, 55],
        trasporti: [15, 30],
        attivita: [10, 25],
      },
      medium: {
        alloggio: [120, 200],
        cibo: [55, 90],
        trasporti: [25, 45],
        attivita: [25, 50],
      },
      premium: {
        alloggio: [220, 380],
        cibo: [100, 170],
        trasporti: [45, 80],
        attivita: [45, 100],
      },
    },
    seasonalMultiplier: { bassa: 0.7, spalla: 1.0, alta: 1.75 },
    highSeasonMonths: [7, 8],
    shoulderSeasonMonths: [5, 6, 9],
    updatedAt: '2025-09',
  },

  marche: {
    slug: 'marche',
    name: 'Marche',
    region: 'Italia-Centro',
    notes:
      'Regione sottovalutata: borghi entroterra (Fermo, Offida) + Conero costa. Prezzi 25-30% sotto Toscana.',
    costs: {
      lean: {
        alloggio: [45, 75],
        cibo: [30, 50],
        trasporti: [15, 30],
        attivita: [10, 20],
      },
      medium: {
        alloggio: [85, 140],
        cibo: [50, 80],
        trasporti: [25, 45],
        attivita: [20, 40],
      },
      premium: {
        alloggio: [160, 280],
        cibo: [90, 160],
        trasporti: [45, 80],
        attivita: [40, 90],
      },
    },
    seasonalMultiplier: { bassa: 0.75, spalla: 1.0, alta: 1.35 },
    highSeasonMonths: [7, 8],
    shoulderSeasonMonths: [5, 6, 9, 10],
    updatedAt: '2025-08',
  },

  liguria: {
    slug: 'liguria',
    name: 'Liguria di Levante',
    region: 'Italia-Nord',
    notes:
      'Da Camogli a La Spezia. Cinque Terre raddoppia prezzi in alta stagione. Levante meno turistico (Tellaro, Lerici) per equilibrio.',
    costs: {
      lean: {
        alloggio: [60, 100],
        cibo: [35, 55],
        trasporti: [15, 30],
        attivita: [10, 25],
      },
      medium: {
        alloggio: [110, 190],
        cibo: [55, 95],
        trasporti: [25, 50],
        attivita: [25, 55],
      },
      premium: {
        alloggio: [200, 360],
        cibo: [100, 180],
        trasporti: [50, 90],
        attivita: [45, 110],
      },
    },
    seasonalMultiplier: { bassa: 0.75, spalla: 1.0, alta: 1.5 },
    highSeasonMonths: [7, 8],
    shoulderSeasonMonths: [5, 6, 9],
    updatedAt: '2025-09',
  },

  marrakech: {
    slug: 'marrakech',
    name: 'Marrakech',
    region: 'Mondo',
    notes:
      'Voli stagionali. Riad in medina = esperienza, hotel Hivernage più europei. Volo escluso, voce non trascurabile.',
    costs: {
      lean: {
        alloggio: [30, 55],
        cibo: [20, 35],
        trasporti: [10, 20],
        attivita: [15, 30],
      },
      medium: {
        alloggio: [70, 130],
        cibo: [40, 70],
        trasporti: [20, 40],
        attivita: [30, 60],
      },
      premium: {
        alloggio: [150, 320],
        cibo: [75, 140],
        trasporti: [40, 80],
        attivita: [60, 130],
      },
    },
    seasonalMultiplier: { bassa: 0.9, spalla: 1.0, alta: 1.2 },
    highSeasonMonths: [3, 4, 10, 11, 12],
    shoulderSeasonMonths: [2, 5, 9],
    updatedAt: '2025-10',
  },
};

/**
 * Calcola stima budget totale per coppia data destinazione + giorni +
 * stile + periodo (mese 1-12).
 *
 * Ritorna range [min, max] in EUR.
 *
 * NOTA: non include voli/traghetti — quelli vanno calcolati separatamente.
 * UI deve esplicitarlo all'utente.
 */
export function calculateBudget(
  destSlug: string,
  days: number,
  style: TravelStyle,
  month: number // 1-12
): {
  min: number;
  max: number;
  breakdown: CostBreakdown;
  multiplier: number;
  isHighSeason: boolean;
} | null {
  const baseline = DESTINATION_BASELINES[destSlug];
  if (!baseline) return null;

  const breakdown = baseline.costs[style];
  const isHighSeason = baseline.highSeasonMonths.includes(month);
  const isShoulder = baseline.shoulderSeasonMonths.includes(month);
  const multiplier = isHighSeason
    ? baseline.seasonalMultiplier.alta
    : isShoulder
      ? baseline.seasonalMultiplier.spalla
      : baseline.seasonalMultiplier.bassa;

  const dailyMin =
    breakdown.alloggio[0] + breakdown.cibo[0] + breakdown.trasporti[0] + breakdown.attivita[0];
  const dailyMax =
    breakdown.alloggio[1] + breakdown.cibo[1] + breakdown.trasporti[1] + breakdown.attivita[1];

  return {
    min: Math.round(dailyMin * days * multiplier),
    max: Math.round(dailyMax * days * multiplier),
    breakdown,
    multiplier,
    isHighSeason,
  };
}
