/**
 * Travelliniwithus — Audio Guides narrate da Rodrigo & Betta
 *
 * Marathon FASE 2.B 2026-05-17 — feature signature 2026.
 *
 * Ogni destinazione pillar puo' avere un set di "punti audio": clip da 60-120
 * secondi registrati da R+B in loco, ogni punto e' georeferenziato e linkato
 * a una sezione del pillar article. Riferimento competitivo: nessuno in IT
 * fa audio guide travel di prima persona narrate da coppia editoriale.
 *
 * Pilot: Salento (8-12 punti, target 2026-Q3).
 *
 * Asset audio: caricati in `public/audio/{guide-slug}/{point-id}.mp3` da R+B
 * con microfono Rode + editing in-house (vedi public/audio/README.md).
 */

export interface AudioGuidePoint {
  /** ID univoco del punto (kebab-case) */
  id: string;
  /** Titolo italiano breve (max 8 parole, no clickbait) */
  title: string;
  /** Eyebrow 2-3 parole — categoria narrativa (es. "Caletta", "Sapore", "Sentiero") */
  eyebrow: string;
  /** Durata in secondi (calcolato a editing, usato per UI) */
  durationSec: number;
  /** Path relativo a /public/audio/ — es. "salento/01-marina-serra.mp3" */
  audioPath: string;
  /** Coordinate geografiche per layer Mapbox (FASE 2.B + 3.B) */
  geo: { latitude: number; longitude: number };
  /** Transcript italiano completo per a11y + SEO + indexing AI search.
   *  Anche se l'audio e' la fonte primaria, il transcript e' citabile da LLM. */
  transcript: string;
  /** Narratore — "rodrigo" o "betta" — usato per UI mostra/avatar */
  narrator: 'rodrigo' | 'betta';
  /** Mese e anno di registrazione — per freshness signal + claim verifiability */
  recordedAt: string;
}

export interface AudioGuide {
  /** Slug della guida (corrisponde a destinazione o articolo pillar) */
  slug: string;
  /** Titolo italiano della guida (es. "Salento, agosto, otto punti") */
  title: string;
  /** Sottotitolo / dek breve */
  subtitle: string;
  /** Articolo pillar collegato (per cross-link bidirezionale) */
  pillarSlug: string;
  /** Hero image — riusa foto pillar */
  heroImage: string;
  /** Foto da mettere come poster del player quando il punto e' attivo */
  defaultPoster?: string;
  /** Punti narrativi (8-12 raccomandati) */
  points: AudioGuidePoint[];
  /** Place entity Wikidata principale (per Article.about schema) */
  placeSlug: string;
  /** Apple Podcast RSS feed url quando attivato (post-pilot) */
  podcastFeedUrl?: string;
  /** Stato della guida nel ciclo di pubblicazione */
  status: 'planning' | 'recording' | 'editing' | 'published';
}

/**
 * Catalogo audio guides — inizialmente vuoto, popolato con il pilot Salento.
 *
 * Quando R+B consegnano i file audio + transcript, popolare i `points` e
 * cambiare `status: 'published'`. UI legge automaticamente.
 */
export const AUDIO_GUIDES: Record<string, AudioGuide> = {
  // ─── PILOT Salento ─────────────────────────────────────────────────
  // status 'planning': scheletro pronto, in attesa di registrazione R+B.
  // Le entry sotto sono placeholder strutturali — sostituire con dati reali.
  'salento-agosto': {
    slug: 'salento-agosto',
    title: 'Salento, agosto, otto punti',
    subtitle:
      'Otto luoghi del Salento raccontati a voce, sul posto. Dieci minuti totali, niente foto, solo quello che noi diciamo a chi ci scrive in DM.',
    pillarSlug: 'cosa-fare-salento-agosto-coppia',
    heroImage: '/images/destinations/puglia.webp',
    placeSlug: 'salento',
    status: 'planning',
    points: [
      // PLACEHOLDER — sostituire con i punti reali quando R+B registrano.
      // Mantenuti per testare UI e schema senza audio reale.
      {
        id: 'p01-marina-serra',
        title: 'Marina Serra, la piscina non famosa',
        eyebrow: 'Caletta',
        durationSec: 0, // 0 = non ancora registrato, UI mostra disabled state
        audioPath: 'salento/01-marina-serra.mp3',
        geo: { latitude: 39.8978, longitude: 18.3658 },
        transcript:
          '[Trascrizione da popolare dopo registrazione R+B. Marina Serra, frazione di Tricase, novanta metri a sinistra della piscina naturale — meno gente, stessa acqua.]',
        narrator: 'rodrigo',
        recordedAt: 'pending',
      },
      {
        id: 'p02-tricase-porto',
        title: 'Tricase Porto, la trattoria dove tornare',
        eyebrow: 'Cena',
        durationSec: 0,
        audioPath: 'salento/02-tricase-porto.mp3',
        geo: { latitude: 39.9197, longitude: 18.3933 },
        transcript: '[Trascrizione da popolare.]',
        narrator: 'betta',
        recordedAt: 'pending',
      },
      {
        id: 'p03-otranto-mattina-presto',
        title: 'Otranto centro storico alle sette',
        eyebrow: 'Mattino',
        durationSec: 0,
        audioPath: 'salento/03-otranto-mattina.mp3',
        geo: { latitude: 40.1467, longitude: 18.4906 },
        transcript: '[Trascrizione da popolare.]',
        narrator: 'rodrigo',
        recordedAt: 'pending',
      },
      {
        id: 'p04-porto-badisco',
        title: 'Porto Badisco, scendere a piedi',
        eyebrow: 'Scogliera',
        durationSec: 0,
        audioPath: 'salento/04-porto-badisco.mp3',
        geo: { latitude: 40.0786, longitude: 18.4869 },
        transcript: '[Trascrizione da popolare.]',
        narrator: 'betta',
        recordedAt: 'pending',
      },
    ],
  },
};

/**
 * Helper: ottieni una audio guide per slug.
 */
export function getAudioGuide(slug: string): AudioGuide | undefined {
  return AUDIO_GUIDES[slug];
}

/**
 * Helper: verifica se una guide e' published (ha almeno 1 punto con audio reale).
 * Le UI possono nascondere/mostrare sezione audio condizionalmente.
 */
export function isAudioGuidePublished(guide: AudioGuide): boolean {
  if (guide.status !== 'published') return false;
  return guide.points.some((p) => p.durationSec > 0);
}
