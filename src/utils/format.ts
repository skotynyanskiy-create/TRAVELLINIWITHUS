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

/**
 * «ad aprile 2026», «a giugno 2026»: la d eufonica davanti a vocale.
 *
 * Tre mesi su dodici iniziano per vocale — aprile, agosto, ottobre — quindi un
 * «a» fisso stona su un quarto delle schede. Sta qui e non nei componenti
 * perché la stessa riga la scrivono la home, la griglia e la scheda.
 */
export function aMeseAnno(iso?: string): string | null {
  const quando = meseAnno(iso);
  if (!quando) return null;
  return `${/^[aeiou]/i.test(quando) ? 'ad' : 'a'} ${quando.toLowerCase()}`;
}

/** I soli campi che `etichettaPrezzo` legge — non l'intero `ContentItem`, per
 *  restare disaccoppiata da `types/content`. */
export interface ElementoConPrezzo {
  value?: { price?: string; budget?: string };
  isPlaceholder?: boolean;
}

/**
 * Etichetta di prezzo per una scheda "posto particolare": il prezzo reale se
 * c'è, altrimenti la fascia di budget, altrimenti — solo se la scheda è
 * ancora in lavorazione — lo dice apertamente.
 *
 * Regola non negoziabile: mai dedurre una verifica dall'assenza di un dato.
 * L'81/110 dei posti senza `value.price` non sono "verificati sul posto" —
 * per 24 di loro la scheda non è nemmeno pronta.
 */
export function etichettaPrezzo(item: ElementoConPrezzo): string {
  if (item.value?.price) return item.value.price;
  if (item.value?.budget) return `Budget ${item.value.budget.toLowerCase()}`;
  if (item.isPlaceholder) return 'Scheda in lavorazione';
  return 'Prezzo non dichiarato';
}
