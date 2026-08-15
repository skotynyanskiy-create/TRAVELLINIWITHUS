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

export interface ContentPlace {
  /** Nome del posto/locale (es. "Granduca di Campigna"). */
  name: string;
  /** Indirizzo con via e civico, quando è più preciso della sola città.
   *  Renderizzato SOLO se presente — mai ricostruito dalle coordinate. */
  address?: string;
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

/**
 * Informazioni pratiche: quello che serve per decidere se e come andarci.
 *
 * Il sito descrive e informa, non giudica. Qui non va nessuna valutazione —
 * niente voti, niente "vale la pena", niente "per chi è". Un lettore che ha
 * letto questo blocco deve poter decidere da solo.
 *
 * **Ogni campo è opzionale, e vuoto è uno stato legittimo.** Il repo ha già
 * dimostrato il modo in cui un modello del genere fallisce, e lo dimostra di
 * nuovo con l'import del 2026-08-15: sul seed di 110 voci, `practical.duration`
 * è compilato **1 volta su 110** e `practical.when` **4 volte su 110** — due
 * campi che quasi non si accendono mai, nonostante siano sempre stati lì. Un
 * campo in più che nessuno riempie non è neutro — fa sembrare la scheda
 * incompleta invece che essenziale. Meglio niente che un dato stimato.
 *
 * **Due provenienze, tenute distinte apposta.** Ciò che si trova online cambia
 * — orari, prezzi, aperture — quindi porta sempre `checked` con fonte e data
 * del controllo. Ciò che si sa per esserci stati porta `visitedAt`, e non si
 * ricava dalla data del reel: `publishedAt` dice quando è uscito il video, non
 * quando ci si è andati.
 */
export interface ContentPractical {
  /** Come ci si arriva: distanze, mezzi, l'ultimo tratto. Prosa breve. */
  gettingThere?: string;
  /** Quanto ci si sta (es. "una notte", "2-3 ore"). */
  duration?: string;
  /** Quando andarci: stagionalità, giorni di chiusura, quando è pieno. */
  when?: string;
  /**
   * Vincoli da sapere prima: gradini, accessibilità, rumore, animali, bambini.
   * È il campo che rende una scheda leggibile da un genitore senza bisogno di
   * una sezione family separata — un vincolo non è un giudizio, è un fatto.
   */
  toKnow?: string[];
  /** Quando ci siamo stati (ISO). Non un verdetto: una data verificabile. */
  visitedAt?: string;
  /** Provenienza dei dati cercati online. Obbligatoria quando il dato non è nostro. */
  checked?: { source: string; at: string };
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
  /** Descrizione voce R+B: cos'è il posto e cosa ci trovi. Descrive, non giudica:
   *  niente "vale la pena", niente "per chi è" — quello lo decide chi legge. */
  description: string;
  /** Luogo strutturato (per destinazioni + mappa). */
  place: ContentPlace;
  /** Informazioni pratiche verificate. Renderizzato SOLO se presente. */
  practical?: ContentPractical;
  /** Zona canonical (tassonomia esistente). */
  zone: Zone;
  /** 1-3 tipi canonical (tassonomia esistente). */
  types: ContentType[];
  /** Trasparenza partnership. */
  partnership: { kind: PartnershipKind; partner?: string };
  /** Dato di valore: prezzo testuale (es. "98€/notte") + fascia budget. */
  value?: { price?: string; budget?: Budget };
  /** Offerta/deal affiliato collegato al posto. Rendered SOLO se presente — mai inventato. */
  deal?: {
    kind: 'code' | 'sale'; // codice promo vs sconto/offerta
    url: string; // link (affiliato) all'offerta
    code?: string; // codice promo (se kind==='code')
    label?: string; // es. "-15% sulla prima notte"
    provider?: string; // es. "Booking", "GetYourGuide"
    /** Data di morte del codice (ISO). **Obbligatoria**: un'offerta senza
     *  scadenza non e' creabile, ed e' la clausola che risolve il problema al
     *  momento della creazione invece che a quello della pulizia. `DealCard`
     *  non renderizza nulla quando e' passata. */
    validUntil: string;
    terms?: string; // termini/condizioni (accordion)
  };
  /** In evidenza in home/destinazione. */
  featured?: boolean;
  /** True finché mancano cover reale o dati API (consumer applica fallback). */
  isPlaceholder: boolean;
}
