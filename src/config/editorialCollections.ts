/**
 * Collezioni editoriali curate Esplora — pattern Atlas Obscura + Roadbook.
 *
 * Tre "stanze editoriali" sopra l'archivio che mostrano la voce di R+B come
 * curatori, non come aggregatori. Ogni collezione punta a slug specifici
 * dell'archivio (ArchiveItem.id) — niente filtri automatici, è curatela
 * manuale.
 *
 * Visibilità: la sezione `EditorialCollections` si mostra in /esplora SOLO
 * quando non ci sono filtri attivi (utente in modalità scoperta, non caccia).
 * Quando l'utente filtra, le collezioni si nascondono per non distrarre.
 *
 * Update cadence: R+B aggiorna ~1 collezione al mese (rotazione stagionale).
 * Mese corrente in `MONTH_LABEL`; quando cambia, la lista qui sotto va rivista.
 *
 * Quando uno slug non è presente in archivio (Firestore o demo), viene
 * silenziosamente saltato — il render fallisce safe.
 */

export interface EditorialCollection {
  /** ID stabile per analytics e linking. */
  id: string;
  /** Eyebrow piccolo sopra il titolo (es. "Stagione · Estate"). */
  eyebrow: string;
  /** Titolo serif, max 8 parole. */
  title: string;
  /** Una frase, max 18 parole. Voce R+B, no marketese. */
  description: string;
  /** Slug ArchiveItem.id in ordine editoriale (3-4 voci). */
  slugs: string[];
  /** CTA opzionale verso /esplora filtrato (es. "Vedi tutti i ...") */
  ctaHref?: string;
  ctaLabel?: string;
}

export const MONTH_LABEL = 'Maggio 2026';

const RAW_EDITORIAL_COLLECTIONS: EditorialCollection[] = [
  {
    id: 'italia-estate-senza-fila',
    eyebrow: 'Stagione · Estate',
    title: "Italia d'estate, senza fila",
    description:
      'Tre posti italiani che reggono ad agosto senza diventare un parcheggio. Dove andiamo noi quando serve mare buono e meno gente.',
    slugs: [
      'puglia-trulli-masserie',
      'costiera-amalfitana-fuori-stagione',
      'sardegna-interna-barbagia',
    ],
    ctaHref: '/esplora?zone=Italia',
    ctaLabel: 'Vedi tutta Italia',
  },
  {
    id: 'hotel-con-carattere-italia',
    eyebrow: 'Filo conduttore · Carattere',
    title: 'Hotel con carattere, dalle Dolomiti al Salento',
    description:
      'Strutture che pesano sul ricordo del viaggio. Non per stelle o piscina: per come ti fanno sentire la sera, a luci spente.',
    slugs: ['dolomiti-rifugi-design', 'trentino-spa-weekend', 'puglia-trulli-masserie'],
    ctaHref: '/esplora?type=hotel-con-carattere',
    ctaLabel: 'Tutti gli hotel con carattere',
  },
  {
    id: 'slow-itinerari-lunghi',
    eyebrow: 'Ritmo · Slow',
    title: 'Itinerari slow da 8+ giorni',
    description:
      'Quando hai due settimane libere e non vuoi sprecarle. Tappe già messe in fila, distanze umane, niente corsa.',
    slugs: ['giappone-14-giorni-itinerario', 'vietnam-nord-slow', 'slovenia-8-giorni-slow'],
    ctaHref: '/esplora?duration=settimana',
    ctaLabel: 'Itinerari lunghi',
  },
];

/**
 * Sfoltimento "solo la collection piu' forte" — 2026-05-19.
 *
 * RAW_EDITORIAL_COLLECTIONS contiene 3 collection (archivio dormiente).
 * EDITORIAL_COLLECTIONS esporta solo "italia-estate-senza-fila" — coerente
 * con tesi pillar Puglia ("fuori stagione"). Le altre 2 referenziano slug
 * di articoli nascosti dallo sfoltimento (cilento, trentino-spa, giappone,
 * vietnam, slovenia) e renderizzerebbero card vuote.
 *
 * Per ri-attivare: aggiungere id a VISIBLE_COLLECTION_IDS.
 */
const VISIBLE_COLLECTION_IDS = new Set<string>(['italia-estate-senza-fila']);

export const EDITORIAL_COLLECTIONS: EditorialCollection[] = RAW_EDITORIAL_COLLECTIONS.filter(
  (collection) => VISIBLE_COLLECTION_IDS.has(collection.id)
);
