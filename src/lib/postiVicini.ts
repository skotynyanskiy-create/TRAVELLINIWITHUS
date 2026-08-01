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

/** Raggio entro cui due posti si considerano parte dello stesso giro. */
export const RAGGIO_DINTORNI_KM = 100;

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

  return getPlacesNearby(
    candidati,
    { latitude: centro.lat, longitude: centro.lng },
    RAGGIO_DINTORNI_KM
  )
    .slice(0, quanti)
    .map((vicino) => ({ item: vicino, distanzaKm: vicino.distanceKm }));
}

/** «11,8 km» — virgola decimale, e metri sotto il chilometro. */
export function formattaDistanza(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
}
