import type { Zone } from './contentTaxonomy';
import type { ContentItem } from '../types/content';
import { CONTENT_ITEMS } from './contentLibrary';

export interface DestinationNode {
  /** Segmento URL: 'italia', 'toscana', 'egitto'. */
  slug: string;
  /** Nome visualizzato (H1, breadcrumb, card). */
  name: string;
  level: 'zone' | 'country' | 'region';
  /** Slug del genitore. undefined per le zone. */
  parentSlug?: string;
  /** Zona canonical (tassonomia esistente). */
  zone: Zone;
  /** `ContentPlace.country` da matchare (nodi country/region). */
  matchCountry?: string;
  /** `ContentPlace.region` da matchare (solo nodi region). */
  matchRegion?: string;
  /** Cover FOTO REALE del posto. Vuoto = targa editoriale (mai stock/AI). */
  cover?: string;
  /** Inquadratura editoriale onesta (1-2 frasi, nessun dato/prezzo inventato). */
  intro?: string;
  /** Baricentro geografico reale (per geo schema.org + mappe). */
  coordinates?: { lat: number; lng: number };
}

export const DESTINATIONS: DestinationNode[] = [
  // ─── ITALIA (Zona + tutte le 20 Regioni Italiane) ──────────────────────────
  {
    slug: 'italia',
    name: 'Italia',
    level: 'zone',
    zone: 'Italia',
    intro:
      'La nostra casa: le regioni che battiamo di più, dai borghi al mare fuori stagione. Qui raccogliamo i posti particolari che abbiamo visto di persona, regione per regione.',
    coordinates: { lat: 42.5, lng: 12.5 },
  },
  {
    slug: 'toscana',
    name: 'Toscana',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Toscana',
    intro: 'Oltre Firenze e Siena: i borghi, le cene di famiglia e i posti insoliti che ci hanno fatto tornare.',
    coordinates: { lat: 43.7711, lng: 11.2486 },
    cover: '/images/destinations/toscana.webp',
  },
  {
    slug: 'puglia',
    name: 'Puglia',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Puglia',
    intro: 'Dalle masserie della Valle d’Itria al Salento selvaggio fuori stagione.',
    coordinates: { lat: 40.78, lng: 17.24 },
    cover: '/images/destinations/puglia.webp',
  },
  {
    slug: 'sicilia',
    name: 'Sicilia',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Sicilia',
    intro: 'Luoghi di luce, borghi barocchi e tavole indimenticabili tra mare ed Etna.',
    coordinates: { lat: 37.5, lng: 15.08 },
    cover: '/images/brand/about-editorial.webp',
  },
  {
    slug: 'sardegna',
    name: 'Sardegna',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Sardegna',
    intro: 'L’isola silenziosa: calette, calette e alloggi immersi nella macchia mediterranea.',
    coordinates: { lat: 39.22, lng: 9.12 },
    cover: '/images/destinations/sardegna.webp',
  },
  {
    slug: 'trentino-alto-adige',
    name: 'Trentino Alto Adige',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Trentino Alto Adige',
    intro: 'Le Dolomiti, i masi di montagna e gli chalet in legno dove staccare del tutto.',
    coordinates: { lat: 46.4983, lng: 11.3548 },
    cover: '/images/destinations/dolomiti.webp',
  },
  {
    slug: 'campania',
    name: 'Campania',
    cover: '/images/brand/couple-travel.webp',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Campania',
    intro: 'Dalla costiera al Cilento, quello che abbiamo trovato quando la Campania rallenta.',
    coordinates: { lat: 40.85, lng: 14.6 },
  },
  {
    slug: 'lazio',
    name: 'Lazio',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Lazio',
    intro: 'Roma e dintorni, con lo sguardo sui posti particolari più che sui soliti giri.',
    coordinates: { lat: 41.9, lng: 12.7 },
    cover: '/images/atlante/posto-volterra.webp',
  },
  {
    slug: 'lombardia',
    name: 'Lombardia',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Lombardia',
    intro: 'Tra città, laghi e valli: i posti che ci hanno incuriosito in Lombardia.',
    coordinates: { lat: 45.6, lng: 9.7 },
    cover: '/images/brand/collab-work.webp',
  },
  {
    slug: 'veneto',
    name: 'Veneto',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Veneto',
    intro: 'Dalle città d’acqua all’entroterra, i posti del Veneto che abbiamo segnato.',
    coordinates: { lat: 45.6, lng: 11.8 },
    cover: '/images/destinations/toscana.webp',
  },
  {
    slug: 'emilia-romagna',
    name: 'Emilia Romagna',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Emilia Romagna',
    intro: 'La regione dove si mangia e basta: i posti particolari fra Appennino, città e costa.',
    coordinates: { lat: 44.5, lng: 11.3 },
    cover: '/images/brand/about-editorial.webp',
  },
  {
    slug: 'piemonte',
    name: 'Piemonte',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Piemonte',
    intro: 'Langhe, colline del vino e residenze storiche tra le nebbie buone.',
    coordinates: { lat: 45.07, lng: 7.68 },
    cover: '/images/destinations/dolomiti.webp',
  },
  {
    slug: 'liguria',
    name: 'Liguria',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Liguria',
    intro: 'Caruggi, terrazze sul mare e borghi arrampicati tra la costa e gli olivi.',
    coordinates: { lat: 44.41, lng: 8.93 },
    cover: '/images/destinations/sardegna.webp',
  },
  {
    slug: 'umbria',
    name: 'Umbria',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Umbria',
    intro: 'Cuore verde d’Italia: alloggi nel silenzio e borghi medievali intatti.',
    coordinates: { lat: 43.11, lng: 12.38 },
    cover: '/images/atlante/posto-volterra.webp',
  },
  {
    slug: 'marche',
    name: 'Marche',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Marche',
    intro: 'Colline morbide, Conero ed entroterra ancora poco battuto dal grande turismo.',
    coordinates: { lat: 43.61, lng: 13.51 },
    cover: '/images/brand/couple-travel.webp',
  },
  {
    slug: 'abruzzo',
    name: 'Abruzzo',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Abruzzo',
    intro: 'Parchi nazionali, trabocchi sul mare e borghi tra le montagne d’Abruzzo.',
    coordinates: { lat: 42.35, lng: 13.39 },
    cover: '/images/destinations/dolomiti.webp',
  },
  {
    slug: 'calabria',
    name: 'Calabria',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Calabria',
    intro: 'Sila, Costa degli Dei e alloggi autentici dove riscoprire il ritmo lento.',
    coordinates: { lat: 38.9, lng: 16.59 },
    cover: '/images/destinations/sardegna.webp',
  },
  {
    slug: 'basilicata',
    name: 'Basilicata',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Basilicata',
    intro: 'Matera, le Dolomiti Lucane e la costa di Maratea in un viaggio nel tempo.',
    coordinates: { lat: 40.63, lng: 15.8 },
    cover: '/images/atlante/posto-volterra.webp',
  },
  {
    slug: 'friuli-venezia-giulia',
    name: 'Friuli Venezia Giulia',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Friuli Venezia Giulia',
    intro: 'Collio, Trieste e valli alpine dove i confini si fondono con la cucina.',
    coordinates: { lat: 46.06, lng: 13.23 },
    cover: '/images/brand/collab-work.webp',
  },
  {
    slug: 'valle-daosta',
    name: "Valle d'Aosta",
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: "Valle d'Aosta",
    intro: 'Sotto le vette più alte d’Europa: chalet rari e terme d’alta quota.',
    coordinates: { lat: 45.73, lng: 7.32 },
    cover: '/images/destinations/dolomiti.webp',
  },
  {
    slug: 'molise',
    name: 'Molise',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Molise',
    intro: 'Tratturi, alloggi diffusi e l’Italia segreta che resiste con orgoglio.',
    coordinates: { lat: 41.56, lng: 14.66 },
    cover: '/images/brand/about-editorial.webp',
  },

  // ─── EUROPA ──────────────────────────────────────────────────────────────
  {
    slug: 'europa',
    name: 'Europa',
    level: 'zone',
    zone: 'Europa',
    intro: 'I weekend fuori dai confini: capitali, città medie e posti particolari raccolti paese per paese.',
    coordinates: { lat: 50.0, lng: 10.0 },
  },
  {
    slug: 'norvegia',
    name: 'Norvegia',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Norvegia',
    intro: 'Fiordi, Isole Lofoten ed aurora boreale: alloggi in legno a picco sul mare.',
    coordinates: { lat: 68.23, lng: 14.56 },
    cover: '/images/destinations/islanda.webp',
  },
  {
    slug: 'francia',
    name: 'Francia',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Francia',
    intro: 'Quello che abbiamo trovato in Francia, un posto particolare alla volta.',
    coordinates: { lat: 46.6, lng: 2.3 },
    cover: '/images/brand/couple-travel.webp',
  },
  {
    slug: 'germania',
    name: 'Germania',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Germania',
    intro: 'La Germania dei nostri giri, tra città e soste insolite.',
    coordinates: { lat: 51.1, lng: 10.4 },
    cover: '/images/brand/collab-work.webp',
  },
  {
    slug: 'spagna',
    name: 'Spagna',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Spagna',
    intro: 'I posti spagnoli che ci hanno colpito, lontano dalle solite liste.',
    coordinates: { lat: 40.4, lng: -3.7 },
    cover: '/images/destinations/sardegna.webp',
  },
  {
    slug: 'svizzera',
    name: 'Svizzera',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Svizzera',
    intro: 'La Svizzera vista dal basso: i posti che ci siamo segnati strada facendo.',
    coordinates: { lat: 46.8, lng: 8.2 },
    cover: '/images/destinations/dolomiti.webp',
  },
  {
    slug: 'danimarca',
    name: 'Danimarca',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Danimarca',
    intro: 'La Danimarca dei nostri appunti di viaggio, un posto alla volta.',
    coordinates: { lat: 56.0, lng: 10.0 },
    cover: '/images/destinations/islanda.webp',
  },
  {
    slug: 'regno-unito',
    name: 'Regno Unito',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Regno Unito',
    intro: 'I posti del Regno Unito che abbiamo voluto raccontare.',
    coordinates: { lat: 54.0, lng: -2.0 },
    cover: '/images/brand/about-editorial.webp',
  },
  {
    slug: 'repubblica-ceca',
    name: 'Repubblica Ceca',
    level: 'country',
    parentSlug: 'europa',
    zone: 'Europa',
    matchCountry: 'Repubblica Ceca',
    intro: 'Praga e oltre: i posti particolari che ci hanno sorpreso in Repubblica Ceca.',
    coordinates: { lat: 49.8, lng: 15.5 },
    cover: '/images/brand/collab-work.webp',
  },

  // ─── AFRICA ──────────────────────────────────────────────────────────────
  {
    slug: 'africa',
    name: 'Africa',
    level: 'zone',
    zone: 'Africa',
    intro: 'I nostri viaggi nel continente, per ora raccontati dall’Egitto e dal Mar Rosso.',
    coordinates: { lat: 8.0, lng: 21.0 },
  },
  {
    slug: 'egitto',
    name: 'Egitto',
    level: 'country',
    parentSlug: 'africa',
    zone: 'Africa',
    matchCountry: 'Egitto',
    intro: 'Il Mar Rosso e quello che abbiamo visto sott’acqua e a riva in Egitto.',
    coordinates: { lat: 26.8, lng: 30.8 },
    cover: '/images/destinations/africa.webp',
  },

  // ─── ASIA ────────────────────────────────────────────────────────────────
  {
    slug: 'asia',
    name: 'Asia',
    level: 'zone',
    zone: 'Asia',
    intro: 'I nostri primi posti asiatici, a partire dalla Malesia.',
    coordinates: { lat: 34.0, lng: 100.0 },
  },
  {
    slug: 'malesia',
    name: 'Malesia',
    level: 'country',
    parentSlug: 'asia',
    zone: 'Asia',
    matchCountry: 'Malesia',
    intro: 'La Malesia che abbiamo attraversato, dalle Batu Caves in avanti.',
    coordinates: { lat: 4.2, lng: 101.9 },
    cover: '/images/destinations/giappone.webp',
  },
];

const DESTINATIONS_INDEX = new Map(DESTINATIONS.map((node) => [node.slug, node]));

/** Nodo per slug URL, o undefined. */
export function getDestination(slug: string): DestinationNode | undefined {
  return DESTINATIONS_INDEX.get(slug.toLowerCase());
}

/** Nodi di livello zona (radici dell'albero). */
export function getZoneDestinations(): DestinationNode[] {
  return DESTINATIONS.filter((node) => node.level === 'zone');
}

/** Tutti i nodi destinazione esplorabili (regioni e paesi). */
export function getAllExplorableDestinations(): DestinationNode[] {
  return DESTINATIONS.filter((node) => node.level !== 'zone');
}

/** Figli diretti di un nodo (regioni/paesi di una zona). */
export function getChildren(slug: string): DestinationNode[] {
  return DESTINATIONS.filter((node) => node.parentSlug === slug);
}

/**
 * ContentItem di un nodo:
 *  - region  → stessa zona + place.region === matchRegion
 *  - country → stessa zona + place.country === matchCountry
 *  - zone    → tutti gli item della zona
 */
export function getContentForDestination(node: DestinationNode): ContentItem[] {
  return CONTENT_ITEMS.filter((item) => {
    if (item.zone !== node.zone) return false;
    if (node.level === 'region') return item.place.region === node.matchRegion;
    if (node.level === 'country') return item.place.country === node.matchCountry;
    return true;
  });
}

/** Numero di ContentItem reali collegati al nodo. */
export function countForDestination(node: DestinationNode): number {
  const items = getContentForDestination(node);
  return items.length;
}

/**
 * Back-compat per /destinazione/:regionSlug legacy: risolve un nodo dal nome
 * regione (display name).
 */
export function findDestinationByRegionName(region: string): DestinationNode | undefined {
  const needle = region
    .trim()
    .toLowerCase()
    .replace(/^trentino[-\s]+/, '');
  return DESTINATIONS.find((node) => {
    if (node.level === 'zone') return false;
    if (node.name.toLowerCase() === needle) return true;
    if (node.matchRegion?.toLowerCase() === needle) return true;
    return false;
  });
}

/** URL canonico del nodo (zona: 1 segmento; region/country: zona/slug). */
export function getDestinationUrl(node: DestinationNode): string {
  return node.parentSlug
    ? `/destinazione/${node.parentSlug}/${node.slug}`
    : `/destinazione/${node.slug}`;
}
