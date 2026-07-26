/**
 * Tassonomia canonical Esplora (3.0 — consolidamento 2026-05-15).
 *
 * Una sola fonte di verità per la discovery editoriale. Ogni contenuto ha
 * esattamente:
 *  - 1 ZONE (zona geografica)
 *  - 1-3 TYPES (tipo di posto / intenzione di viaggio)
 *  - 1 FORMAT (cosa è il contenuto: storia, guida, itinerario, lista pratica)
 *  - 0-1 PERIOD / BUDGET / DURATION (vincoli pratici opzionali)
 *
 * Le vecchie tre tassonomie disgiunte (DESTINATION_GROUPS / EXPERIENCE_TYPES /
 * GUIDE_CATEGORIES) sono state unificate qui per eliminare sovrapposizioni
 * semantiche tra "Weekend" come experience type e "Weekend & Day trip" come
 * guide category.
 */

export const ZONES = ['Italia', 'Europa', 'Asia', 'Americhe', 'Africa', 'Oceania'] as const;

export const TYPES = [
  'Posti particolari',
  'Food & Ristoranti',
  'Hotel con carattere',
  "Borghi e città d'arte",
  'Passeggiate panoramiche',
  'Relax, terme e spa',
  'Weekend romantici',
  'Insolito',
] as const;

export const FORMATS = ['Storia', 'Guida', 'Itinerario', 'Lista pratica'] as const;

export const PERIODS = ['Primavera', 'Estate', 'Autunno', 'Inverno', "Tutto l'anno"] as const;
export const BUDGETS = ['Basso', 'Medio', 'Alto'] as const;
export const DURATIONS = [
  'Giornata',
  'Weekend',
  'Weekend lungo',
  'Settimana',
  'Due settimane',
] as const;

export type Zone = (typeof ZONES)[number];
export type ContentType = (typeof TYPES)[number];
export type ContentFormat = (typeof FORMATS)[number];
export type Period = (typeof PERIODS)[number];
export type Budget = (typeof BUDGETS)[number];
export type Duration = (typeof DURATIONS)[number];

// ─── Itinerari (sottosistema separato, invariato) ───────────────────────────

export const ITINERARY_DURATIONS = [
  'Weekend (2-3 giorni)',
  'Settimana (4-7 giorni)',
  'Slow trip (8-14 giorni)',
  'Long stay (15+ giorni)',
] as const;

export const ITINERARY_STYLES = [
  'Slow & culturale',
  'Romantico in coppia',
  'Avventura outdoor',
  'Food & vino',
  'Boutique & design',
  'Famiglia',
  'Roadtrip',
] as const;

export const ITINERARY_BUDGETS = [
  { id: 'lean', label: 'Sotto i 600 a testa' },
  { id: 'medium', label: '600 - 1500 a testa' },
  { id: 'premium', label: 'Sopra i 1500 a testa' },
] as const;

export const ITINERARY_PERIODS = [
  'Primavera',
  'Estate',
  'Autunno',
  'Inverno',
  'Tutto l anno',
] as const;

export type ItineraryDuration = (typeof ITINERARY_DURATIONS)[number];
export type ItineraryStyle = (typeof ITINERARY_STYLES)[number];
export type ItineraryBudget = (typeof ITINERARY_BUDGETS)[number]['id'];
export type ItineraryPeriod = (typeof ITINERARY_PERIODS)[number];

// ─── Slug helpers ───────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const slugifyZone = slugify;
export const slugifyType = slugify;
export const slugifyFormat = slugify;
export const slugifyPeriod = slugify;
export const slugifyBudget = slugify;
export const slugifyDuration = slugify;

export function getZoneFromQuery(raw: string | null): Zone | null {
  if (!raw) return null;
  const decoded = decodeURIComponent(raw);
  return ZONES.find((zone) => zone === decoded || slugify(zone) === slugify(decoded)) ?? null;
}

export function getTypeFromQuery(raw: string | null): ContentType | null {
  if (!raw) return null;
  const needle = slugify(raw);
  return TYPES.find((type) => slugify(type) === needle) ?? null;
}

export function getFormatFromQuery(raw: string | null): ContentFormat | null {
  if (!raw) return null;
  const needle = slugify(raw);
  return FORMATS.find((format) => slugify(format) === needle) ?? null;
}

export function getPeriodFromQuery(raw: string | null): Period | null {
  if (!raw) return null;
  const needle = slugify(raw);
  return PERIODS.find((period) => slugify(period) === needle) ?? null;
}

export function getBudgetFromQuery(raw: string | null): Budget | null {
  if (!raw) return null;
  const needle = slugify(raw);
  return BUDGETS.find((budget) => slugify(budget) === needle) ?? null;
}

export function getDurationFromQuery(raw: string | null): Duration | null {
  if (!raw) return null;
  const needle = slugify(raw);
  return DURATIONS.find((duration) => slugify(duration) === needle) ?? null;
}

// ─── Legacy → canonical mapping ─────────────────────────────────────────────
//
// I redirect lato client da /destinazioni, /esperienze, /guide usano questi
// per tradurre i param vecchi alle URL nuove di /esplora.

export const LEGACY_TYPE_MAP: Record<string, ContentType> = {
  // dalla vecchia EXPERIENCE_TYPES (10 voci) → nuova TYPES (8 voci)
  'Locali insoliti': 'Insolito',
  'Esperienze insolite': 'Insolito',
  'Gite e day trip': 'Weekend romantici',
};

export const LEGACY_FORMAT_MAP: Record<string, ContentFormat> = {
  // dalla vecchia GUIDE_CATEGORIES (8 voci) → nuova FORMATS (4 voci)
  'Itinerari completi': 'Itinerario',
  'Consigli pratici': 'Lista pratica',
  'Cosa portare': 'Lista pratica',
  'Food guide': 'Guida',
  'Dove dormire': 'Guida',
  'Budget & Costi': 'Lista pratica',
  Pianificazione: 'Lista pratica',
  'Weekend & Day trip': 'Guida',
};

export function mapLegacyType(raw: string | null): ContentType | null {
  if (!raw) return null;
  const decoded = decodeURIComponent(raw);
  // 1. canonical exact match
  const direct = TYPES.find((type) => slugify(type) === slugify(decoded));
  if (direct) return direct;
  // 2. legacy label match
  if (LEGACY_TYPE_MAP[decoded]) return LEGACY_TYPE_MAP[decoded];
  // 3. legacy slug match
  for (const [legacyLabel, canonical] of Object.entries(LEGACY_TYPE_MAP)) {
    if (slugify(legacyLabel) === slugify(decoded)) return canonical;
  }
  return null;
}

export function mapLegacyFormat(raw: string | null): ContentFormat | null {
  if (!raw) return null;
  const decoded = decodeURIComponent(raw);
  const direct = FORMATS.find((format) => slugify(format) === slugify(decoded));
  if (direct) return direct;
  if (LEGACY_FORMAT_MAP[decoded]) return LEGACY_FORMAT_MAP[decoded];
  for (const [legacyLabel, canonical] of Object.entries(LEGACY_FORMAT_MAP)) {
    if (slugify(legacyLabel) === slugify(decoded)) return canonical;
  }
  return null;
}

// ─── Back-compat alias (temporanei durante migrazione) ──────────────────────
//
// I file legacy (Destinazioni/Esperienze/Guide e discovery home) sono in
// rimozione. Per non rompere import durante la migrazione step-by-step
// esportiamo i vecchi nomi come alias dei nuovi. Da rimuovere quando tutti
// i call site sono migrati.

export const DESTINATION_GROUPS = ZONES;
export const EXPERIENCE_TYPES = TYPES;
export const GUIDE_CATEGORIES = FORMATS;

export type DestinationGroup = Zone;
export type ExperienceType = ContentType;
export type GuideCategory = ContentFormat;

export const slugifyExperienceType = slugifyType;
export const slugifyGuideCategory = slugifyFormat;
export const getExperienceTypeFromQuery = getTypeFromQuery;
export const getGuideCategoryFromQuery = getFormatFromQuery;
