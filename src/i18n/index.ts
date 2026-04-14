import itMessages from './locales/it.json';

type Messages = Record<string, string>;

const DEFAULT_LOCALE = 'it';
const SUPPORTED_LOCALES = ['it'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const catalogs: Record<Locale, Messages> = {
  it: itMessages as Messages,
};

let currentLocale: Locale = DEFAULT_LOCALE;

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  currentLocale = locale;
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const messages = catalogs[currentLocale] || catalogs[DEFAULT_LOCALE];
  const fallback = catalogs[DEFAULT_LOCALE];
  const raw = messages[key] ?? fallback[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function hasTranslation(key: string): boolean {
  const messages = catalogs[currentLocale] || catalogs[DEFAULT_LOCALE];
  return key in messages;
}
