/**
 * Single source of truth per i "picks" curati che appaiono in:
 *  - Navbar mega menu Esplora
 *  - HomeDiscoveryFinder (sezione discovery unica della home)
 *  - SearchModal DISCOVERY_RESULTS
 *
 * Cambiando le picks qui, cambia coerentemente ovunque. Niente più liste
 * hardcoded sparpagliate in 3 file diversi.
 */

import type { Zone, ContentType, ContentFormat } from './contentTaxonomy';

export const HOMEPAGE_ZONES: readonly Zone[] = ['Italia', 'Europa', 'Asia'];

export const HOMEPAGE_TYPES: readonly ContentType[] = [
  'Posti particolari',
  'Food & Ristoranti',
  'Hotel con carattere',
  'Weekend romantici',
];

export const HOMEPAGE_FORMATS: readonly ContentFormat[] = ['Guida', 'Itinerario', 'Lista pratica'];

export interface HomepageDiscoveryEntry {
  label: string;
  description: string;
  href: string;
  kind: 'zone' | 'type' | 'map' | 'guides';
}

/**
 * I 4 ingressi della sezione "Da dove vuoi partire?" sulla home.
 * L'ordine qui è l'ordine di apparizione.
 */
export const HOMEPAGE_DISCOVERY_ENTRIES: readonly HomepageDiscoveryEntry[] = [
  {
    label: 'Per zona',
    description: 'Italia, Europa, Asia o oltre. Parti dal posto che hai in mente.',
    href: '/esplora?zone=Italia',
    kind: 'zone',
  },
  {
    label: 'Per intenzione',
    description: 'Food, hotel, weekend, borghi: scegli il ritmo prima della meta.',
    href: '/esplora?type=posti-particolari',
    kind: 'type',
  },
  {
    label: 'Sulla mappa',
    description: 'Vista geo dei posti che abbiamo vissuto, filtrabili per esperienza.',
    href: '/mappa',
    kind: 'map',
  },
  {
    label: 'Guide pratiche',
    description: 'Itinerari, liste e guide per organizzare il viaggio con criterio.',
    href: '/esplora?format=guida',
    kind: 'guides',
  },
];
