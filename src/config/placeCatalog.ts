/**
 * Travelliniwithus — Catalogo Place entities con Wikidata Q-ID.
 *
 * Marathon FASE 1.D 2026-05-17 — Entity layer per AI search citation.
 *
 * Ogni entry mappa un place name canonico al suo Wikidata identifier + geo
 * + tipo Schema.org. Gli articoli pillar referenziano questo catalogo via
 * `article.about` o `article.mentions` per disambiguare le entita davanti
 * a crawler AI (ChatGPT search, Perplexity, Google AI Overviews).
 *
 * Wikidata Q-ID verificabili su https://www.wikidata.org/wiki/{Q-ID}.
 * Per aggiungere una destinazione: ricerca su wikidata.org, copia URL.
 */

import type { PlaceEntity } from '../lib/seo';

export const PLACE_CATALOG: Record<string, PlaceEntity> = {
  // ─── Italia: regioni / aree ──────────────────────────────────
  salento: {
    name: 'Salento',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q239456',
    placeType: 'AdministrativeArea',
    geo: { latitude: 40.15, longitude: 18.1667 },
  },
  puglia: {
    name: 'Puglia',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1447',
    placeType: 'AdministrativeArea',
    geo: { latitude: 41.1255, longitude: 16.8629 },
  },
  sicilia: {
    name: 'Sicilia',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1460',
    placeType: 'AdministrativeArea',
    geo: { latitude: 37.6, longitude: 14.0 },
  },
  trentino: {
    name: 'Trentino-Alto Adige',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1450',
    placeType: 'AdministrativeArea',
    geo: { latitude: 46.4983, longitude: 11.3548 },
  },
  liguria: {
    name: 'Liguria',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1256',
    placeType: 'AdministrativeArea',
    geo: { latitude: 44.4264, longitude: 8.9333 },
  },
  marche: {
    name: 'Marche',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1456',
    placeType: 'AdministrativeArea',
    geo: { latitude: 43.6166, longitude: 13.5168 },
  },
  toscana: {
    name: 'Toscana',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1273',
    placeType: 'AdministrativeArea',
    geo: { latitude: 43.7711, longitude: 11.2486 },
  },
  umbria: {
    name: 'Umbria',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1280',
    placeType: 'AdministrativeArea',
    geo: { latitude: 43.0939, longitude: 12.6182 },
  },
  sardegna: {
    name: 'Sardegna',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1462',
    placeType: 'AdministrativeArea',
    geo: { latitude: 40.0833, longitude: 9.0 },
  },

  // ─── Italia: città e località ──────────────────────────────
  lecce: {
    name: 'Lecce',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q34843',
    placeType: 'City',
    geo: { latitude: 40.3528, longitude: 18.1742 },
  },
  otranto: {
    name: 'Otranto',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q257812',
    placeType: 'City',
    geo: { latitude: 40.1467, longitude: 18.4906 },
  },
  matera: {
    name: 'Matera',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q83056',
    placeType: 'City',
    geo: { latitude: 40.6664, longitude: 16.6043 },
  },
  procida: {
    name: 'Procida',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q83019',
    placeType: 'City',
    geo: { latitude: 40.761, longitude: 14.021 },
  },
  capri: {
    name: 'Capri',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q173527',
    placeType: 'City',
    geo: { latitude: 40.55, longitude: 14.2333 },
  },
  napoli: {
    name: 'Napoli',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q2634',
    placeType: 'City',
    geo: { latitude: 40.8333, longitude: 14.25 },
  },
  palermo: {
    name: 'Palermo',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q2656',
    placeType: 'City',
    geo: { latitude: 38.1157, longitude: 13.3613 },
  },
  bologna: {
    name: 'Bologna',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1891',
    placeType: 'City',
    geo: { latitude: 44.4938, longitude: 11.3387 },
  },
  pantelleria: {
    name: 'Pantelleria',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q179304',
    placeType: 'City',
    geo: { latitude: 36.83, longitude: 11.95 },
  },
  favignana: {
    name: 'Favignana',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q49250',
    placeType: 'City',
    geo: { latitude: 37.9333, longitude: 12.3333 },
  },
  noto: {
    name: 'Noto',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q124066',
    placeType: 'City',
    geo: { latitude: 36.8911, longitude: 15.0667 },
  },
  ostuni: {
    name: 'Ostuni',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q123316',
    placeType: 'City',
    geo: { latitude: 40.7286, longitude: 17.5775 },
  },
  'polignano-a-mare': {
    name: 'Polignano a Mare',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q49264',
    placeType: 'City',
    geo: { latitude: 40.9963, longitude: 17.2185 },
  },
  cisternino: {
    name: 'Cisternino',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q49276',
    placeType: 'City',
    geo: { latitude: 40.7438, longitude: 17.4214 },
  },
  locorotondo: {
    name: 'Locorotondo',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q49281',
    placeType: 'City',
    geo: { latitude: 40.7547, longitude: 17.3275 },
  },
  gallipoli: {
    name: 'Gallipoli',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q123305',
    placeType: 'City',
    geo: { latitude: 40.0556, longitude: 17.9928 },
  },
  'valle-itria': {
    name: "Valle d'Itria",
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1130200',
    placeType: 'AdministrativeArea',
    geo: { latitude: 40.7833, longitude: 17.4 },
  },
  'torre-sant-andrea': {
    name: "Torre Sant'Andrea",
    placeType: 'Beach',
    geo: { latitude: 40.2333, longitude: 18.4333 },
    address: "Torre Sant'Andrea, Melendugno (LE), Puglia",
  },
  'punta-della-suina': {
    name: 'Punta della Suina',
    placeType: 'Beach',
    geo: { latitude: 40.0125, longitude: 17.9569 },
    address: 'Punta della Suina, Gallipoli (LE), Puglia',
  },
  'masseria-il-frantoio': {
    name: 'Masseria Il Frantoio',
    placeType: 'TouristAttraction',
    geo: { latitude: 40.7775, longitude: 17.5408 },
    address: 'SS16 km 874, 72017 Ostuni (BR), Puglia',
  },
  'masseria-cervarolo': {
    name: 'Masseria Cervarolo',
    placeType: 'TouristAttraction',
    geo: { latitude: 40.7372, longitude: 17.4675 },
    address: 'Contrada Cervarolo, 72014 Cisternino (BR), Puglia',
  },
  'borgo-egnazia': {
    name: 'Borgo Egnazia',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q3641957',
    placeType: 'TouristAttraction',
    geo: { latitude: 40.8869, longitude: 17.3789 },
    address: 'Strada Comunale Egnazia, 72015 Savelletri (BR), Puglia',
  },

  // ─── Estero ────────────────────────────────────────────────
  lisbona: {
    name: 'Lisbona',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q597',
    placeType: 'City',
    geo: { latitude: 38.7223, longitude: -9.1393 },
  },
  bali: {
    name: 'Bali',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q22078',
    placeType: 'AdministrativeArea',
    geo: { latitude: -8.4095, longitude: 115.1889 },
  },
  marrakech: {
    name: 'Marrakech',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q101625',
    placeType: 'City',
    geo: { latitude: 31.6295, longitude: -7.9811 },
  },
  atene: {
    name: 'Atene',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1524',
    placeType: 'City',
    geo: { latitude: 37.9838, longitude: 23.7275 },
  },

  // ─── 6 schede prioritari Wave D (dossier 2026-07-23) ─────────
  'burton-juice': {
    name: 'The Burton Juice',
    placeType: 'TouristAttraction',
    geo: { latitude: 40.88, longitude: 14.38 },
    address: 'Via Marigliano 168, Somma Vesuviana (NA), Campania',
  },
  'malesia-batu-caves': {
    name: 'Batu Caves',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q810998',
    placeType: 'TouristAttraction',
    geo: { latitude: 3.237, longitude: 101.682 },
    address: 'Batu Caves, Kuala Lumpur, Malesia',
  },
  'slovenia-bled': {
    name: 'Bled (Garden Village Glamping)',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q15854',
    placeType: 'TouristAttraction',
    geo: { latitude: 46.366, longitude: 14.1 },
    address: 'Bled, Slovenia',
  },
  'caraibi-italia': {
    name: 'Caraibi in Italia (Jesolo area)',
    placeType: 'TouristAttraction',
    geo: { latitude: 45.53, longitude: 12.63 },
    address: 'Litorale di Jesolo, Veneto',
  },
  'madrid-malocchio': {
    name: 'Locale malocchio / ritual Madrid',
    placeType: 'TouristAttraction',
    geo: { latitude: 40.42, longitude: -3.7 },
    address: 'Madrid, Spagna',
  },
  'sushi-kibo': {
    name: 'Sushi Kibo',
    placeType: 'TouristAttraction',
    geo: { latitude: 44.5, longitude: 11.3 },
    address: 'Romagna / area Bologna, Italia',
  },
};

/**
 * Helper: ottieni PlaceEntity dal catalogo per slug (case-insensitive).
 * Ritorna undefined se non trovato — il chiamante deve gestire fallback.
 */
export function getPlace(slug: string): PlaceEntity | undefined {
  return PLACE_CATALOG[slug.toLowerCase()];
}
