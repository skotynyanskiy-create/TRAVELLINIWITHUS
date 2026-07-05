/**
 * Helper regioni macro per la landing /destinazione/:regionSlug.
 *
 * Decisione owner (sessione 3 — 2026-05-18):
 * - Solo regioni macro italiane. Es. /destinazione/puglia esiste,
 *   /destinazione/salento NO (Salento e' contenuto dentro la pagina Puglia).
 * - CTA principale: pillar piu' forte della regione (lead magnet PDF non
 *   ancora pronto).
 *
 * I dati cluster degli articoli arrivano da DEMO_ARCHIVE_ITEMS (preview-mode
 * fallback quando Firestore e' vuoto). Quando R+B pubblica articoli reali con
 * lo stesso slug, fetchArticles li sostituisce — la landing continuera' a
 * funzionare riusando lo stesso slug di regione.
 */
import { DEMO_ARCHIVE_ITEMS } from '../config/demoArchive';
import type { ArchiveItem } from '../utils/contentArchive';

export interface RegionMeta {
  slug: string;
  /** Nome canonical in italiano, usato come H1 e per matching nei demo seed. */
  name: string;
  country: string;
  /** Assente finché non esiste una foto reale (no stock/AI): la landing mostra l'header sand editoriale. */
  heroImage?: string;
  /** Frase singola R+B (max 160 char) usata sotto l'H1 e come og:description. */
  chapeau: string;
  /** Paragrafo introduttivo autoriale (100-180 parole). */
  intro: string;
  /** Slug del pillar di partenza per la CTA principale. */
  topArticleSlug: string;
  /** Coordinate barycenter regionali per future mappe centrate. */
  coordinates: [number, number];
}

const REGIONS_DATA: RegionMeta[] = [
  {
    slug: 'puglia',
    name: 'Puglia',
    country: 'Italia',
    // heroImage ritirata 2026-07-05: cover AI/stock, no foto reale disponibile.
    chapeau:
      "La Puglia che ci è rimasta addosso — settembre 2025, tre giorni dentro la luce della Valle d'Itria e una settimana sulla costa adriatica.",
    intro:
      'Quando dicono Puglia pensano a Polignano dal porto vecchio, alle masserie con piscina e a un mare che non è Maldive. Noi ci abbiamo passato dieci giorni in tre stagioni diverse — la luce della Valle d\'Itria a settembre, le strade bianche fra Cisternino e Locorotondo dove le distanze sulla mappa mentono sempre per difetto, le sere a Otranto quando i pullman tornano a Lecce. Qui sotto trovi il pillar di partenza, gli itinerari pronti che usiamo davvero, e i racconti di tappa: niente cliché, niente "scopri", solo i posti che abbiamo verificato, gli errori che abbiamo fatto, le ore giuste per arrivarci.',
    topArticleSlug: 'puglia-trulli-masserie',
    coordinates: [17.3845, 40.8333],
  },
  {
    slug: 'sicilia',
    name: 'Sicilia',
    country: 'Italia',
    // TODO[asset-curator]: foto Sicilia reale (Ortigia/Etna/Taormina). heroImage
    // ritirata 2026-07-05: era una cover AI/stock di Puglia, geograficamente disonesta.
    chapeau:
      "La Sicilia che si capisce solo restando — Catania popolare, Ortigia lenta, l'Etna al tramonto e la cena di pesce a Brucoli.",
    intro:
      "La Sicilia non si fa in tre giorni e non si fa con la checklist. Cinque giorni nella parte orientale — Catania, Siracusa, Taormina con calma — sono il taglio minimo per non sembrare turisti in fuga. Qui raccogliamo i nostri itinerari e i racconti dal campo: dove abbiamo dormito davvero, dove abbiamo mangiato due volte perché la prima non bastava, e cosa abbiamo sbagliato la prima volta che siamo saliti sull'Etna senza un piano. La Sicilia premia chi torna più di una volta — questa pagina è fatta per quello.",
    topArticleSlug: 'sicilia-orientale-5-giorni',
    coordinates: [14.0154, 37.5999],
  },
  {
    slug: 'sardegna',
    name: 'Sardegna',
    country: 'Italia',
    // heroImage ritirata 2026-07-05: cover AI/stock, no foto reale disponibile.
    chapeau:
      'La Sardegna che chiede di entrarci dentro — Barbagia, supramonti, pani carasau caldo e il silenzio che cambia il viaggio.',
    intro:
      "La Sardegna che amiamo non è quella delle coste affittate per agosto. È la Barbagia, sono i pastori di Orgosolo, è Mamoiada quando arrivano i mamuthones a febbraio. L'isola interna ti chiede di rallentare — auto a noleggio obbligatoria, strade che salgono lente, paesi dove la cena si decide guardando chi entra in trattoria. Qui mettiamo i nostri racconti dell'interno (e qualcuno dalla costa quando merita): dove dormire fuori dai 4 stelle, cosa portare a casa che non sia il magnete del Costa Smeralda, e quando andare per trovare la Sardegna che non finisce in cartolina.",
    topArticleSlug: 'sardegna-interna-barbagia',
    coordinates: [9.0, 40.1209],
  },
  {
    slug: 'toscana',
    name: 'Toscana',
    country: 'Italia',
    // heroImage ritirata 2026-07-05: cover AI/stock, no foto reale disponibile.
    chapeau:
      'La Toscana oltre Firenze e Siena — Pitigliano sospesa sul tufo, Lucignano circolare, il Casentino di Camaldoli.',
    intro:
      'Tutti vanno a Firenze, tutti vanno a Siena. La Toscana che vale la pena di un secondo viaggio è altrove: è Pitigliano costruita dentro al tufo, è Lucignano con la pianta a cerchi concentrici, è il Casentino di Camaldoli con i suoi monasteri silenziosi. Qui raccogliamo i borghi che restituiscono qualcosa di reale — cucine di famiglia, enoteche di paese, sentieri brevi che premiano chi arriva presto. Niente "tour del Chianti in van": un weekend lungo costruito bene fa più Toscana di una settimana di checklist.',
    topArticleSlug: 'toscana-borghi-nascosti',
    coordinates: [11.2558, 43.7711],
  },
  {
    slug: 'campania',
    name: 'Campania',
    country: 'Italia',
    heroImage: '/images/hero-amalfi.webp',
    chapeau:
      'La Campania a fuori-stagione — Positano in maggio quando si respira, Cilento ad agosto con il mare che non è Capri.',
    intro:
      "La Costiera Amalfitana funziona ad aprile e a settembre, non a luglio. Il Cilento funziona ad agosto, perché è più asciutto della costa sopra e più lento di tutto quello che ha intorno. La Campania che raccontiamo qui è una regione di due velocità: Positano, Amalfi e Ravello fatte fuori dai mesi peggiori, e il Sud cilentano dove le spiagge sono piccole e i paesi di pietra non recitano. Sotto trovi le nostre guide pillar, gli itinerari concreti, e le storie di tappa che spiegano perché la Campania ha senso anche quando il resto d'Italia è al mare.",
    topArticleSlug: 'costiera-amalfitana-fuori-stagione',
    coordinates: [14.6261, 40.6291],
  },
  {
    slug: 'trentino-alto-adige',
    name: 'Trentino-Alto Adige',
    country: 'Italia',
    // heroImage ritirata 2026-07-05: cover AI/stock, no foto reale disponibile.
    chapeau:
      'Le Dolomiti che hanno cambiato lo standard — rifugi di design, Val di Funes a settembre, weekend spa che funziona.',
    intro:
      'Le Dolomiti hanno smesso da tempo di essere solo montagna: oggi sono il laboratorio italiano per la ricettività alpina contemporanea. Rifugi che cucinano come ristoranti urbani, hotel di valle con architettura che non recita il tirolese, spa che valgono il viaggio anche senza sci. Qui raccogliamo cosa vediamo come benchmark — Val di Funes, Alta Badia, Val di Sole, Madonna di Campiglio. Niente "top 10 rifugi pinterest": indirizzi testati, stagioni che funzionano davvero, e le finestre meteorologiche che usiamo per decidere quando partire.',
    topArticleSlug: 'dolomiti-rifugi-design',
    coordinates: [11.121, 46.4983],
  },
];

const REGIONS_INDEX = new Map(REGIONS_DATA.map((r) => [r.slug, r]));

export function getRegionMeta(slug: string): RegionMeta | undefined {
  return REGIONS_INDEX.get(slug);
}

/**
 * Filtra gli articoli del cluster di una regione macro.
 *
 * Match strategy:
 *   1. `item.region` esatto case-insensitive su region.name (es. "Puglia").
 *   2. Fallback su `item.location.includes(region.name)` (case-insensitive).
 *
 * I demo seed in demoArchive.ts hanno gia' `region: 'Puglia'` per ogni voce
 * italiana — la 1 e' la via principale. Il fallback (2) serve per articoli
 * reali da Firestore che potrebbero non avere il campo `region` strutturato
 * ma includono la regione nella location stringificata.
 */
export function getArticlesByRegion(slug: string): ArchiveItem[] {
  const region = REGIONS_INDEX.get(slug);
  if (!region) return [];

  const target = region.name.toLowerCase();
  return DEMO_ARCHIVE_ITEMS.filter((item) => {
    const itemRegion = (item.region || '').toLowerCase();
    if (itemRegion === target) return true;
    if (item.country !== region.country) return false;
    return item.location.toLowerCase().includes(target);
  });
}

export function getAllRegions(): Array<RegionMeta & { articlesCount: number }> {
  return REGIONS_DATA.map((region) => ({
    ...region,
    articlesCount: getArticlesByRegion(region.slug).length,
  }));
}

export const REGION_SLUGS = REGIONS_DATA.map((r) => r.slug);
