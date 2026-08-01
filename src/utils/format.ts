const priceFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number, currency = 'EUR'): string {
  if (currency === 'EUR') return priceFormatter.format(amount);
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const MESI = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
];

/**
 * `2026-05-14` → `maggio 2026`.
 *
 * Il giorno non serve — «ci siamo stati il 14» non aiuta nessuno — e invecchia
 * peggio del mese. Parsing a mano invece che `new Date(...)`: su una stringa
 * `YYYY-MM-DD` il costruttore applica il fuso UTC e a inizio mese puo'
 * restituire il mese precedente.
 *
 * @returns null se la stringa manca o non e' una data valida
 */
export function meseAnno(iso?: string): string | null {
  if (!iso) return null;
  const [anno, mese] = iso.split('-');
  const nome = MESI[Number(mese) - 1];
  if (!nome || !/^\d{4}$/.test(anno ?? '')) return null;
  return `${nome} ${anno}`;
}
