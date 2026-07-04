/**
 * Spina dorsale gerarchica delle destinazioni (Tripp-style: zona → paese/regione).
 *
 * Fonte unica dell'albero /destinazione. Ogni nodo è ancorato SOLO alla
 * geografia reale dei contenuti (`content-seed.json` → `contentLibrary`):
 * niente posti inventati, niente conteggi gonfiati, niente prezzi fittizi.
 *
 * Struttura:
 *   Italia (zona) → 7 regioni  (Toscana, Campania, Lazio, Lombardia, Veneto,
 *                               Emilia Romagna, Alto Adige)
 *   Europa (zona) → 7 paesi    (Francia, Germania, Spagna, Svizzera, Danimarca,
 *                               Regno Unito, Repubblica Ceca)
 *   Africa (zona) → Egitto
 *   Asia   (zona) → Malesia
 *
 * Le zone Americhe/Oceania esistono nella tassonomia ma non hanno contenuti:
 * qui volutamente omesse finché non ci sono posti reali.
 *
 * Le coordinate sono baricentri geografici reali (fatti, non marketing) presi
 * da PLACE_CATALOG dove disponibili, altrimenti centroidi noti. Servono al geo
 * dello schema.org/Place e a future mappe centrate.
 */

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
  /** Cover da /images/destinations/*.webp — solo dove esiste un match sensato. */
  cover?: string;
  /** Inquadratura editoriale onesta (1-2 frasi, nessun dato/prezzo inventato). */
  intro?: string;
  /** Baricentro geografico reale (per geo schema.org + mappe). */
  coordinates?: { lat: number; lng: number };
}

export const DESTINATIONS: DestinationNode[] = [
  // ─── ITALIA ────────────────────────────────────────────────────────────────
  {
    slug: 'italia',
    name: 'Italia',
    level: 'zone',
    zone: 'Italia',
    intro:
      'La casa: le regioni che battiamo di più, dai borghi al mare fuori stagione. Qui raccogliamo i posti particolari che abbiamo visto di persona, regione per regione.',
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
    cover: '/images/destinations/toscana.webp',
    intro:
      'Oltre Firenze e Siena: i borghi, le cene di famiglia e i posti insoliti che ci hanno fatto tornare.',
    coordinates: { lat: 43.7711, lng: 11.2486 },
  },
  {
    slug: 'campania',
    name: 'Campania',
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
  },
  {
    slug: 'alto-adige',
    name: 'Alto Adige',
    level: 'region',
    parentSlug: 'italia',
    zone: 'Italia',
    matchCountry: 'Italia',
    matchRegion: 'Alto Adige',
    cover: '/images/destinations/dolomiti.webp',
    intro: 'Le Dolomiti e le valli altoatesine: rifugi, tavole e posti che valgono la salita.',
    coordinates: { lat: 46.4983, lng: 11.3548 },
  },

  // ─── EUROPA ──────────────────────────────────────────────────────────────
  {
    slug: 'europa',
    name: 'Europa',
    level: 'zone',
    zone: 'Europa',
    intro:
      'I weekend fuori dai confini: capitali, città medie e posti particolari raccolti paese per paese.',
    coordinates: { lat: 50.0, lng: 10.0 },
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
  },

  // ─── AFRICA ──────────────────────────────────────────────────────────────
  {
    slug: 'africa',
    name: 'Africa',
    level: 'zone',
    zone: 'Africa',
    cover: '/images/destinations/africa.webp',
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
    cover: '/images/destinations/africa.webp',
    intro: 'Il Mar Rosso e quello che abbiamo visto sott’acqua e a riva in Egitto.',
    coordinates: { lat: 26.8, lng: 30.8 },
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
  return getContentForDestination(node).length;
}

/**
 * Back-compat per /destinazione/:regionSlug legacy: risolve un nodo dal nome
 * regione (display name). Match su nome o su matchRegion, case-insensitive,
 * con normalizzazione del prefisso "Trentino-" per l'Alto Adige.
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
