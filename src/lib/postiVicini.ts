import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { getCoordinates, getPlacesNearby } from '@/src/utils/geo';
import type { ContentItem } from '@/src/types/content';

/**
 * «Nei dintorni»: i posti veri a poca strada da quello che stai guardando.
 *
 * Il calcolo non e' nuovo — `getPlacesNearby` esiste gia' in `utils/geo` per il
 * filtro «vicino a me». Qui cambia solo il punto di riferimento: non la
 * posizione di chi guarda, ma il posto stesso.
 *
 * **Il raggio e' 100 km per una ragione misurata, non per gusto**: a 30 km solo
 * 15 posti su 29 avrebbero un vicino, a 100 km sono 24. Sotto quella soglia la
 * sezione sarebbe assente sulla meta' delle schede, e una sezione che di solito
 * non c'e' e' peggio di una che non esiste.
 *
 * Niente riempitivi: se entro il raggio non c'e' nulla la lista torna vuota e
 * la sezione sparisce, invece di proporre un posto a 400 km chiamandolo
 * «dintorni».
 */

/**
 * **Il raggio si stringe dove c'e' densita'** (2026-08-17). I 100 km sono
 * tarati su un archivio sparso; con il corpus diventano una rete che pesca
 * sempre gli stessi posti. Misurato iniettando 533 schede nella pagina viva
 * (`.audit-screenshots/collaudo-533.mjs`): i tre slot si riempivano di posti
 * della stessa citta' e della stessa categoria entro pochi chilometri, perche'
 * l'ordinamento per sola distanza non ha nessun motivo di diversificare.
 *
 * Regola: se entro 25 km ci sono abbastanza candidati si usa quello, altrimenti
 * si torna ai 100. Sul seed di oggi la stringe su 19 schede su 79 — le altre
 * restano com'erano, quindi la ragione originale dei 100 km resta rispettata.
 */
export const RAGGIO_DINTORNI_KM = 100;
export const RAGGIO_DENSO_KM = 25;

export interface PostoVicino {
  item: ContentItem;
  /** Distanza in linea d'aria, gia' arrotondata a un decimale da `utils/geo`. */
  distanzaKm: number;
}

/**
 * I posti piu' vicini a quello dato, dal piu' vicino in poi.
 *
 * @param posto  la scheda che si sta guardando (esclusa dal risultato)
 * @param quanti quante schede restituire al massimo
 */
export function postiVicini(posto: ContentItem, quanti = 3): PostoVicino[] {
  const centro = getCoordinates(posto);
  if (!centro) return [];

  // Solo schede verificate: un placeholder non da' nulla a chi ci arriva.
  const candidati = CONTENT_ITEMS.filter(
    (altro) => altro.id !== posto.id && !altro.isPlaceholder && getCoordinates(altro)
  );

  const entroIlMassimo = getPlacesNearby(
    candidati,
    { latitude: centro.lat, longitude: centro.lng },
    RAGGIO_DINTORNI_KM
  );

  /* Raggio adattivo: si stringe solo se il cerchio piccolo basta da solo. */
  const entroIlDenso = entroIlMassimo.filter((v) => v.distanceKm <= RAGGIO_DENSO_KM);
  const bacino = entroIlDenso.length >= quanti ? entroIlDenso : entroIlMassimo;

  /* Una categoria per slot. Non si completa con un doppione quando le
     categorie finiscono: due card diverse dicono piu' di tre uguali, e il
     modello di questo sito considera l'assenza uno stato legittimo. */
  const scelti: typeof bacino = [];
  const categorieUsate = new Set<string>();
  for (const vicino of bacino) {
    const categoria = vicino.types?.[0] ?? '';
    if (categorieUsate.has(categoria)) continue;
    categorieUsate.add(categoria);
    scelti.push(vicino);
    if (scelti.length >= quanti) break;
  }

  return scelti.map((vicino) => ({ item: vicino, distanzaKm: vicino.distanceKm }));
}

/** «11,8 km» — virgola decimale, e metri sotto il chilometro. */
export function formattaDistanza(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
}
