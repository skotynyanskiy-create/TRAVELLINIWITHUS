import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { REELS } from '@/src/config/reels';
import type { ContentItem } from '@/src/types/content';

/**
 * «Portami in un posto a caso»: il bacino e i turni.
 *
 * Un posto entra solo se ha **tutti e tre** i pezzi che servono al gesto:
 * un reel collegato (`postoId`), una scheda verificata (non `isPlaceholder`)
 * e le coordinate per il volo sul globo. Oggi sono 29 su 62 — ed e' giusto
 * cosi': il sorpreso non deve mai atterrare su una scheda vuota.
 *
 * La sorpresa **non ripete** finche' il giro non e' finito. Senza questa
 * regola al terzo click ricompare lo stesso posto e il gioco muore in venti
 * secondi; e' il difetto piu' comune di questi gesti, non un dettaglio.
 *
 * Il caso e' iniettabile perche' un random dentro una funzione non si testa:
 * qui `pick` e' un parametro, nei test diventa una scelta deterministica.
 */

export interface PostoSorpresa {
  item: ContentItem;
  /** Il reel del posto: e' cio' che il visitatore vede per primo. */
  reel: (typeof REELS)[number];
}

/** Il bacino, calcolato una volta: i posti che reggono il gesto per intero. */
export const BACINO_SORPRESA: PostoSorpresa[] = (() => {
  const perId = new Map(CONTENT_ITEMS.map((item) => [item.id, item]));
  return REELS.flatMap((reel) => {
    if (!reel.postoId) return [];
    const item = perId.get(reel.postoId);
    if (!item || item.isPlaceholder || !item.place.coordinates) return [];
    return [{ item, reel }];
  });
})();

/**
 * Estrae il prossimo posto escludendo quelli gia' visti.
 *
 * @param visti id gia' mostrati in questa sessione
 * @param pick  sorteggio iniettabile: `(n) => indice in [0, n)`
 * @returns il posto e la lista aggiornata dei visti; `null` se il bacino e'
 *          vuoto (nessun reel collegato a una scheda verificata)
 */
export function prossimaSorpresa(
  visti: readonly string[],
  pick: (n: number) => number = (n) => Math.floor(Math.random() * n)
): { sorpresa: PostoSorpresa; visti: string[] } | null {
  if (BACINO_SORPRESA.length === 0) return null;

  const rimasti = BACINO_SORPRESA.filter((c) => !visti.includes(c.item.id));
  // Giro finito: si riparte da capo invece di bloccarsi su «non c'e' altro».
  const pool = rimasti.length > 0 ? rimasti : BACINO_SORPRESA;
  const azzerato = rimasti.length > 0 ? visti : [];

  const sorpresa = pool[Math.min(Math.max(pick(pool.length), 0), pool.length - 1)];
  return { sorpresa, visti: [...azzerato, sorpresa.item.id] };
}
