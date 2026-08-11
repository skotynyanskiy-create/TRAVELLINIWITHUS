/**
 * Local fallback storage for leads when the backend or third-party
 * provider (Brevo/Resend) is unreachable.
 *
 * The fallback stays in localStorage so the admin can still see and
 * export it across browser sessions, but it is bounded to limit how
 * much PII can sit in plain-text storage that any post-consent script
 * (analytics, ad pixels) could in theory read.
 *
 * Rules:
 * - Max 50 entries per key. Oldest entries are dropped first.
 * - Entries older than RETENTION_MS are purged on every read.
 */

const MAX_ENTRIES = 50;
const RETENTION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

interface LeadRecord {
  date: string;
}

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__twu_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function purgeAndCap<T extends LeadRecord>(items: T[]): T[] {
  const cutoff = Date.now() - RETENTION_MS;
  const fresh = items.filter((item) => {
    const ts = Date.parse(item.date);
    return Number.isFinite(ts) && ts >= cutoff;
  });
  return fresh.slice(-MAX_ENTRIES);
}

export function readLeadFallback<T extends LeadRecord>(key: string): T[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    if (!Array.isArray(parsed)) return [];
    const pruned = purgeAndCap(parsed);
    if (pruned.length !== parsed.length) {
      window.localStorage.setItem(key, JSON.stringify(pruned));
    }
    return pruned;
  } catch {
    return [];
  }
}

export function appendLeadFallback<T extends LeadRecord>(key: string, entry: T): boolean {
  if (!isStorageAvailable()) return false;
  try {
    const current = readLeadFallback<T>(key);
    const next = purgeAndCap([...current, entry]);
    window.localStorage.setItem(key, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function clearLeadFallback(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Quando l'API e' irraggiungibile e il lead finisce solo in localStorage, chi
 * ha compilato il modulo deve poter avvisarci davvero — non leggere un falso
 * "successo". Queste funzioni compongono un messaggio precompilato (email o
 * WhatsApp) con i dati gia' scritti, cosi' la persona non li riscrive.
 *
 * Restano pure (nessun JSX): usate sia dai form che dai loro test.
 */
export interface LeadFallbackField {
  label: string;
  value: string;
}

function joinLeadFallbackLines(intro: string, fields: LeadFallbackField[]): string {
  const detailLines = fields
    .filter((field) => field.value.trim().length > 0)
    .map((field) => `${field.label}: ${field.value.trim()}`);
  return [intro, ...(detailLines.length > 0 ? ['', ...detailLines] : [])].join('\n');
}

/** `email` e' l'indirizzo nudo (es. CONTACTS.email), non un `mailto:` gia' pronto. */
export function buildLeadFallbackMailto(
  email: string,
  subject: string,
  intro: string,
  fields: LeadFallbackField[] = []
): string {
  const body = joinLeadFallbackLines(intro, fields);
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildLeadFallbackWhatsAppText(
  intro: string,
  fields: LeadFallbackField[] = []
): string {
  return joinLeadFallbackLines(intro, fields);
}

/** `whatsappUrl` e' il link wa.me base (es. CONTACTS.whatsappUrl), senza query string. */
export function buildLeadFallbackWhatsAppUrl(whatsappUrl: string, text: string): string {
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}
