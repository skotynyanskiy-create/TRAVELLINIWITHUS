/**
 * Reel manifest — single source of truth per i reel Instagram/TikTok di
 * Rodrigo & Betta integrati nel sito.
 *
 * Consumato da:
 *  - `HeroSection.tsx` → FEATURED_REEL fallback dinamico (sceglie il reel
 *    con più views se manifest popolato, altrimenti fallback editoriale).
 *  - `InstagramGrid.tsx` → render delle cover come grid masonry.
 *  - `Esplora.tsx` (futuro) → anchor visivo contestuale quando l'utente
 *    filtra `?zone=X` e c'è un reel `zone === X` disponibile.
 *
 * TODO[R+B]: compilare ogni entry con i metadati reali del post pubblicato.
 * Finché `caption`, `instagramUrl` o `cover` restano vuoti, il manifest è
 * marcato come `isPlaceholder: true` e il consumer applica fallback editoriale.
 *
 * I 5 file MP4 sono in `/public/video/` (originali in `C:\...\video\`).
 * Per servirli dal browser vanno copiati/linkati in `/public/video/`.
 */

import type { ContentType, Zone } from './contentTaxonomy';

export interface ReelEntry {
  /** ID stabile per analytics e routing (es. "salento-agosto-2025"). */
  id: string;
  /** Path locale relativo a `/public/`. */
  localPath: string;
  /** Cover statica per browser preview / lazy load (webp consigliato). */
  cover: string;
  /** Localita' descrittiva (es. "Salento · Spiaggia di Pescoluse"). */
  location: string;
  /** Zona canonical (per filtraggio in /esplora). */
  zone: Zone;
  /** Tipo canonical primario del reel (per filtraggio in /esplora). */
  type: ContentType;
  /** Caption completa del post Instagram/TikTok. */
  caption: string;
  /** Prima frase di hook (primi 60-80 caratteri della caption). */
  hook: string;
  /** Hashtag senza '#'. */
  hashtags: string[];
  /** URL pubblico del post Instagram (https://instagram.com/p/...). */
  instagramUrl?: string;
  /** URL pubblico del post TikTok (https://tiktok.com/@.../video/...). */
  tiktokUrl?: string;
  /** Views totali (Instagram + TikTok aggregato), se note. */
  views?: number;
  /** ISO date di pubblicazione. */
  publishedAt: string;
  /** True finché i metadati sono placeholder TODO[R+B]. */
  isPlaceholder: boolean;
}

/**
 * 5 reel LIVE — corrispondono ai 5 file MP4 in `public/video/`.
 *
 * Cover = frame reali estratti dai video con ffmpeg (2026-06-18), salvati in
 * `public/images/reels/reel-N-cover.webp`. Le vecchie cover stock placeholder
 * sono in `backups/ultracode-2026-06-18/old-reel-covers/`.
 *
 * Metadata (location/zone/type/caption/hook) derivati dal contenuto REALE dei
 * video. Mancano ancora `instagramUrl`/`tiktokUrl`/`views` per ciascun post: il
 * consumer usa il fallback al profilo IG finché R+B non li fornisce.
 */
const RAW_REELS: ReelEntry[] = [
  {
    id: 'reel-egitto-mar-rosso',
    localPath: '/video/reel-1.mp4',
    cover: '/images/reels/reel-1-cover.webp',
    location: 'Egitto · Mar Rosso',
    zone: 'Africa',
    type: 'Relax, terme e spa',
    caption:
      'Un resort economico sul Mar Rosso: acqua trasparente, reef a due passi dal pontile e ristoranti. Quanto costa davvero e se vale.',
    hook: 'Mar Rosso senza spendere una fortuna.',
    hashtags: ['egitto', 'marrosso', 'snorkeling', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-toscana-sushi-kibo',
    localPath: '/video/reel-2.mp4',
    cover: '/images/reels/reel-2-cover.webp',
    location: 'Toscana · Sushi Kibo',
    zone: 'Italia',
    type: 'Food & Ristoranti',
    caption:
      "Uno dei sushi più belli della Toscana: sala spettacolare sull'acqua, all-you-can-eat e un prezzo che non ti aspetti.",
    hook: 'Il sushi più bello della Toscana?',
    hashtags: ['sushi', 'toscana', 'ristoranti', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-toscana-tavernal',
    localPath: '/video/reel-3.mp4',
    cover: '/images/reels/reel-3-cover.webp',
    location: 'Toscana · Tavernal',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      'Una taverna a tema tra draghi e nani dove ti senti dentro una leggenda. Porzioni abbondanti e una fiorentina come si deve.',
    hook: 'Cenare nella tana dei draghi.',
    hashtags: ['toscana', 'ristorantiatema', 'insolito', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-malesia-batu-caves',
    localPath: '/video/reel-4.mp4',
    cover: '/images/reels/reel-4-cover.webp',
    location: 'Malesia · Batu Caves',
    zone: 'Asia',
    type: 'Posti particolari',
    caption:
      'Vale la pena visitare le famosissime Batu Caves di Kuala Lumpur? È gratis, il posto è indescrivibile — e occhio alle scimmie.',
    hook: 'Batu Caves: vale la pena?',
    hashtags: ['malesia', 'batucaves', 'kualalumpur', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-toscana-volterra-volturi',
    localPath: '/video/reel-5.mp4',
    cover: '/images/reels/reel-5-cover.webp',
    location: 'Toscana · Volterra',
    zone: 'Italia',
    type: 'Insolito',
    caption:
      "Un aperitivo dai Volturi a Volterra: drink che sembrano sangue, atmosfera gotica e un po' di scena. Per chi ama l'insolito.",
    hook: 'Aperitivo coi vampiri a Volterra.',
    hashtags: ['volterra', 'toscana', 'insolito', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
];

/**
 * 5 reel reali pubblicati — 2026-06-18.
 *
 * Metadati e cover ora corrispondono ai video veri (frame estratti dai MP4).
 * Tutti e 5 sono visibili. Per nasconderne uno: rimuovere il suo id da qui.
 */
const VISIBLE_REEL_IDS = new Set<string>([
  'reel-egitto-mar-rosso',
  'reel-toscana-sushi-kibo',
  'reel-toscana-tavernal',
  'reel-malesia-batu-caves',
  'reel-toscana-volterra-volturi',
]);

export const REELS: ReelEntry[] = RAW_REELS.filter((reel) => VISIBLE_REEL_IDS.has(reel.id));

/**
 * Helper: ritorna i reel pubblicabili (non placeholder), ordinati per views
 * decrescenti. Usato da HeroSection per scegliere il FEATURED_REEL e da
 * InstagramGrid per popolare la griglia.
 */
export function getPublishedReels(): ReelEntry[] {
  return REELS.filter((reel) => !reel.isPlaceholder).sort(
    (a, b) => (b.views ?? 0) - (a.views ?? 0)
  );
}

/**
 * Helper: ritorna il reel più rilevante per una zona (se esiste).
 * Usato da /esplora come anchor visivo quando l'utente filtra `?zone=X`.
 */
export function getReelForZone(zone: Zone): ReelEntry | null {
  return getPublishedReels().find((reel) => reel.zone === zone) ?? null;
}

/**
 * Helper: ritorna il reel più rilevante per un tipo (se esiste).
 * Usato da /esplora come anchor visivo quando l'utente filtra `?type=X`.
 */
export function getReelForType(type: ContentType): ReelEntry | null {
  return getPublishedReels().find((reel) => reel.type === type) ?? null;
}
