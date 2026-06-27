import type { Zone, ContentType, Budget } from '../config/contentTaxonomy';

/**
 * Modello unico dei contenuti Travelliniwithus ("posti particolari").
 *
 * Un ContentItem rappresenta un post/reel reale (IG/TikTok) trasformato in
 * voce editoriale del sito. Alimenta: /destinazione, /esplora, /mappa, home,
 * guide. I campi "raw" arrivano dall'API Instagram (vedi
 * `services/instagramContentAdapter.ts`); i campi "curati" si arricchiscono
 * via parsing caption o pannello admin.
 */

/** Come l'item è stato ottenuto/pubblicato — disclosure trasparente (AGCOM). */
export type PartnershipKind =
  | 'organic' // nessuna collaborazione
  | 'adv' // pubblicità a pagamento
  | 'invited' // invito / ospitalità
  | 'gifted' // prodotto regalato
  | 'collaboration' // collaborazione
  | 'affiliate'; // link affiliato

export interface ContentPlace {
  /** Nome del posto/locale (es. "Granduca di Campigna"). */
  name: string;
  /** Città (es. "Praga"). */
  city?: string;
  /** Regione — usata per le destinazioni italiane (es. "Emilia Romagna"). */
  region?: string;
  /** Paese (es. "Italia", "Repubblica Ceca", "Egitto"). */
  country: string;
  /** Coordinate per la mappa Mapbox. Riempite da `scripts/geocode-content.mjs`. */
  coordinates?: { lat: number; lng: number };
}

export interface ContentItem {
  /** ID stabile (slug, es. "praga-dog-cafe"). */
  id: string;
  source: 'instagram' | 'tiktok';

  // ── Campi raw (popolati dall'adapter API Instagram) ──────────────────
  /** Permalink pubblico. ← IG API `media.permalink` */
  permalink: string;
  /** ← IG API `media.media_type` */
  mediaType: 'reel' | 'post' | 'carousel';
  /** Cover statica (frame/thumbnail). ← IG API `media.thumbnail_url | media_url` */
  cover: string;
  /** Video locale (mp4) se ospitato sul sito. */
  videoSrc?: string;
  /** Caption originale completa. ← IG API `media.caption` */
  caption?: string;
  /** Data pubblicazione ISO. ← IG API `media.timestamp` */
  publishedAt?: string;

  // ── Campi curati (enrichment: parsing caption o admin) ───────────────
  /** Hook a domanda, voce R+B (es. "Dormiresti in una Mirror House?"). */
  hook: string;
  /** Titolo editoriale breve. */
  title: string;
  /** Descrizione voce R+B: cos'è + dato di valore + "vale la pena? per chi". */
  description: string;
  /** Luogo strutturato (per destinazioni + mappa). */
  place: ContentPlace;
  /** Zona canonical (tassonomia esistente). */
  zone: Zone;
  /** 1-3 tipi canonical (tassonomia esistente). */
  types: ContentType[];
  /** Trasparenza partnership. */
  partnership: { kind: PartnershipKind; partner?: string };
  /** Dato di valore: prezzo testuale (es. "98€/notte") + fascia budget. */
  value?: { price?: string; budget?: Budget };
  /** In evidenza in home/destinazione. */
  featured?: boolean;
  /** True finché mancano cover reale o dati API (consumer applica fallback). */
  isPlaceholder: boolean;
}
