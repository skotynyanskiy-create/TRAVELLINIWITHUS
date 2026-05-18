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
 * 5 reel LIVE — corrispondono ai 5 file MP4 in `public/video/` (copiati da
 * `C:\Users\ccocu\Desktop\TRAVELLINIWITHUS\video\` tramite `npm run prepare:reels`).
 *
 * Cover sono placeholder editoriali dalle destinations (riusate da
 * `convert-reels.js` quando ffmpeg non è disponibile per estrazione frame).
 *
 * Metadata di transizione: location/zone/type/caption sono best-guess
 * editoriali che riflettono il mix abituale dei contenuti R+B sui social.
 * R+B sostituisce con i dati esatti del singolo post quando disponibili.
 */
export const REELS: ReelEntry[] = [
  {
    id: 'reel-puglia-trulli',
    localPath: '/video/reel-1.mp4',
    cover: '/images/reels/reel-1-cover.webp',
    location: "Puglia · Valle d'Itria",
    zone: 'Italia',
    type: 'Posti particolari',
    caption:
      'Tra trulli, masserie e calette nascoste. Il sud che non si racconta sulle guide turistiche.',
    hook: 'Il sud che non ti aspetti.',
    hashtags: ['puglia', 'travelblog', 'viaggioincoppia', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-toscana-borghi',
    localPath: '/video/reel-2.mp4',
    cover: '/images/reels/reel-2-cover.webp',
    location: "Toscana · Val d'Orcia",
    zone: 'Italia',
    type: "Borghi e città d'arte",
    caption:
      'Cinque borghi toscani lontano dai circuiti del weekend. Mangiare bene, dormire bene, niente coda.',
    hook: 'Toscana senza fila.',
    hashtags: ['toscana', 'borghi', 'slowtravel', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-dolomiti-rifugi',
    localPath: '/video/reel-3.mp4',
    cover: '/images/reels/reel-3-cover.webp',
    location: 'Dolomiti · Alta Badia',
    zone: 'Italia',
    type: 'Hotel con carattere',
    caption:
      'Tre rifugi delle Dolomiti che ci hanno cambiato l\'idea di "andare in montagna". Niente catene, tutto carattere.',
    hook: 'Tre rifugi, tre scoperte.',
    hashtags: ['dolomiti', 'rifugi', 'altabadia', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-sardegna-cale',
    localPath: '/video/reel-4.mp4',
    cover: '/images/reels/reel-4-cover.webp',
    location: 'Sardegna · Costa orientale',
    zone: 'Italia',
    type: 'Weekend romantici',
    caption:
      'Cala Goloritzé, Cala Mariolu, Cala Luna. Tre giorni in barca per le cale più belle della Sardegna.',
    hook: 'Tre cale, una barca, niente fila.',
    hashtags: ['sardegna', 'calagoloritze', 'viaggioincoppia', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
  {
    id: 'reel-islanda-ring-road',
    localPath: '/video/reel-5.mp4',
    cover: '/images/reels/reel-5-cover.webp',
    location: 'Islanda · Ring Road',
    zone: 'Europa',
    type: 'Passeggiate panoramiche',
    caption:
      'Ring Road in 7 giorni: come pianificare tappe, alloggi e meteo senza tour guidati. Tutto in autonomia.',
    hook: 'Islanda da soli, ce la fai.',
    hashtags: ['islanda', 'ringroad', 'roadtrip', 'travelliniwithus'],
    publishedAt: '2026-05-14',
    isPlaceholder: false,
  },
];

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
