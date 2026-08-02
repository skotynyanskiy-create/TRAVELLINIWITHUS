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

/** Etichetta IT visibile per la disclosure partnership (AGCOM/IAP Digital Chart:
 * dicitura chiara, mai nascosta, visibile senza azioni aggiuntive dell'utente). */
export const PARTNERSHIP_LABEL: Record<PartnershipKind, string> = {
  organic: '',
  adv: 'ADV',
  invited: 'Su invito',
  gifted: 'Gifted',
  collaboration: 'In collaborazione',
  affiliate: 'Affiliato',
};

/**
 * Scheda redazionale R+B di un posto. Renderizzata SOLO se presente — mai
 * inventata: nessun ContentItem reale va popolato con dati fittizi.
 *
 * Il giudizio non ha voti. Nessun punteggio, nessuna media, nessun criterio
 * numerico: un numero comprime in una cifra la sola cosa che qui conta davvero,
 * cioè *per chi* un posto vale e *quando*. Il verdetto si scrive a parole.
 */
export interface ContentReview {
  /** Etichetta breve del verdetto (es. "Ci torneremmo"). */
  verdict?: string;
  /** Una riga di giudizio. */
  summary?: string;
  pros?: string[];
  cons?: string[];
  /** Una riga "per chi è" — solo dal materiale editoriale reale. */
  forWho?: string;
  /** Una riga "per chi no" — il limite onesto, mai inventato. */
  notForWho?: string;
}

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
  /** Orari testuali (es. "Mar-Dom 19:00-23:00"). Renderizzato SOLO se presente — mai inventato. */
  hours?: string;
  /** Numero di telefono. Renderizzato SOLO se presente — mai inventato. */
  phone?: string;
  /** Sito ufficiale del posto (non ancora renderizzato in UI — riservato a usi futuri). */
  website?: string;
  /** Link di prenotazione (Business/OpenTable/TheFork/sito). Renderizzato SOLO se presente. */
  bookingUrl?: string;
  /** Override della query di ricerca Google Maps (es. nome esatto scheda Business). */
  googlePlaceQuery?: string;
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
  /** Focale verticale del crop della cover (0-100, default 50). Le cover dei
   *  reel hanno la title-card in alto: un valore >50 la esclude dal crop. */
  coverFocusY?: number;
  /** Alt IT della cover: descrive la scena visibile, non l'hook. Senza questo
   *  il consumer ripiega sul titolo, che descrive il posto e non l'immagine. */
  coverAlt?: string;
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
  /** Scheda redazionale R+B. Renderizzata SOLO se presente — mai inventata. */
  review?: ContentReview;
  /** Offerta/deal affiliato collegato al posto. Rendered SOLO se presente — mai inventato. */
  deal?: {
    kind: 'code' | 'sale'; // codice promo vs sconto/offerta
    url: string; // link (affiliato) all'offerta
    code?: string; // codice promo (se kind==='code')
    label?: string; // es. "-15% sulla prima notte"
    provider?: string; // es. "Booking", "GetYourGuide"
    validUntil?: string; // ISO date opzionale
    terms?: string; // termini/condizioni (accordion)
  };
  /** In evidenza in home/destinazione. */
  featured?: boolean;
  /** True finché mancano cover reale o dati API (consumer applica fallback). */
  isPlaceholder: boolean;
}
