import type { ContentItem } from '../types/content';
import type { ContentType } from '../config/contentTaxonomy';

/**
 * JSON-LD `Review` onesto per una pagina-posto: Travelliniwithus RECENSISCE
 * l'attività, non la possiede. Prima di questo modulo `Posto.tsx` emetteva un
 * `Restaurant`/`LodgingBusiness`/... con `name: item.title` (il titolo
 * editoriale, non l'insegna) e `url` sul nostro dominio — cioè dichiarava "noi
 * siamo quel ristorante". Usato anche da `:::verdetto` (stessa disonestà
 * strutturale, stesso rimedio) e da `scripts/generate-route-html.js` (stesso
 * schema anche nell'HTML prerenderizzato, non solo dopo l'idratazione React).
 *
 * Condiviso invece che duplicato: la mappa tipo→schema e la costruzione di
 * `itemReviewed` sono identiche nei tre punti di emissione, e un errore in una
 * sola copia (es. rimettere `name: title`) sarebbe silenzioso.
 */

/** Mappa una categoria editoriale → @type Schema.org dell'attività recensita. */
export const PLACE_SCHEMA_TYPE: Record<ContentType | '_default', string> = {
  'Food & Ristoranti': 'Restaurant',
  'Hotel con carattere': 'LodgingBusiness',
  'Relax, terme e spa': 'HealthAndBeautyBusiness',
  Insolito: 'TouristAttraction',
  'Passeggiate panoramiche': 'TouristAttraction',
  'Posti particolari': 'TouristAttraction',
  "Borghi e città d'arte": 'TouristAttraction',
  'Weekend romantici': 'TouristAttraction',
  _default: 'TouristAttraction',
};

/**
 * Sceglie il `@type` più specifico fra le categorie della scheda.
 *
 * **Perché non basta `types[0]`.** La tassonomia del sito e' *editoriale*:
 * descrive che esperienza e' un posto, non che attivita' e'. «Insolito» e
 * «Weekend romantici» sono ortogonali a «ristorante» e «hotel», e l'ordine
 * dentro `types` e' una scelta di racconto — il Burton Juice e' catalogato
 * `["Insolito", "Food & Ristoranti"]` perche' la stranezza viene prima nel
 * pezzo, non perche' sia meno un ristorante.
 *
 * Prendendo `types[0]` il risultato era che **14 schede su 79 (misurato il
 * 2026-08-15)** dichiaravano `TouristAttraction` pur essendo ristoranti, hotel
 * o spa: il tipo giusto era gia' nei dati, solo non in prima posizione. Un
 * `@type` troppo generico non e' un errore di validazione — e' semplicemente
 * un'entita' diversa da quella che il posto e', e i rich result che ne
 * dipendono non si attivano.
 *
 * Quindi: vince la prima categoria che porta semantica di attivita'; se non ce
 * n'e' nessuna si ricade su `types[0]`, e l'ordine editoriale resta intatto —
 * questa funzione legge la lista, non la riordina.
 */
export function pickSchemaType(types: ContentType[]): string {
  const specifica = types.find(
    (t) => PLACE_SCHEMA_TYPE[t] && PLACE_SCHEMA_TYPE[t] !== 'TouristAttraction'
  );
  return PLACE_SCHEMA_TYPE[specifica ?? types[0]] ?? PLACE_SCHEMA_TYPE._default;
}

/**
 * L'entità recensita — sempre l'attività di terzi, mai la nostra pagina:
 * `name` è l'insegna reale (`place.name`), non il titolo editoriale, e non
 * c'è nessun `url` che punti a noi (solo `place.website`, se il dato esiste
 * davvero, quasi mai il caso oggi).
 *
 * Nessun `sameAs`: l'unico link Google Maps disponibile
 * (`buildGoogleMapsListingUrl`) è una query di ricerca testuale, non un
 * identificativo stabile della scheda — dichiararlo "stessa entità" sarebbe
 * un'affermazione che il dato non garantisce (può risolvere su un'attività
 * omonima diversa). Meglio ometterlo che inventare una corrispondenza.
 *
 * **Nessun `offers`.** Fino al 2026-08-15 il nodo dell'offerta — con `seller` e
 * l'URL affiliato — stava qui dentro, cioè dentro l'`itemReviewed` di un
 * `Review` di prima parte. Nello stesso oggetto strutturato il sito diceva
 * «questo è il nostro contenuto editoriale» e «ecco l'offerta commerciale»: la
 * regola che vieta di mettere la prova commerciale accanto al giudizio vale nel
 * livello che i motori leggono per primo, non solo sullo schermo. Con due deal
 * costava poco toglierlo; a trenta sarebbe stato sistemico.
 *
 * L'offerta resta visibile e dichiarata dove serve davvero — `DealCard` sulla
 * pagina, con la disclosure AGCOM — che è il posto in cui un lettore la legge.
 */
export function buildItemReviewedJsonLd(item: ContentItem): Record<string, unknown> {
  const { place } = item;
  const schemaType = pickSchemaType(item.types ?? []);

  return {
    '@type': schemaType,
    name: place.name,
    address: {
      '@type': 'PostalAddress',
      /* `streetAddress` e `telephone` aggiunti il 2026-08-15. Mancavano, e la
         conseguenza non era ovvia: la passata di ricerca sulla Lombardia stava
         riempiendo via e telefono su decine di schede, quei dati comparivano in
         pagina, e **nessuno dei due arrivava ai motori** — che per le ricerche
         locali («dove dormire a…», «orari di…») leggono prima questo livello.
         Un sito che vende informazione pratica la stava tenendo fuori dallo
         strato in cui l'informazione pratica viene letta. */
      ...(place.address ? { streetAddress: place.address } : {}),
      addressLocality: place.city ?? place.region ?? '',
      addressRegion: place.region ?? '',
      addressCountry: place.country,
    },
    ...(place.phone ? { telephone: place.phone } : {}),
    ...(place.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.coordinates.lat,
            longitude: place.coordinates.lng,
          },
        }
      : {}),
    ...(place.website ? { url: place.website } : {}),
  };
}

/**
 * Review editoriale di prima parte. Nessun voto: né `aggregateRating`
 * (self-authored su un'attività terza — vietato dalle policy dei motori di
 * ricerca), né `reviewRating` (il giudizio qui non è un numero, è
 * `reviewBody`).
 */
export function buildReviewJsonLd(item: ContentItem, reviewBody: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    inLanguage: 'it-IT',
    author: { '@type': 'Organization', name: 'Travelliniwithus' },
    reviewBody,
    ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
    itemReviewed: buildItemReviewedJsonLd(item),
  };
}
