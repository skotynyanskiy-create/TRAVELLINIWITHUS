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

/** Mappa types[0] → @type Schema.org dell'attività recensita (itemReviewed). */
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
 * `offers`, quando `deal` esiste, dichiara sempre chi vende (`seller`) dal
 * campo `provider`: un codice sconto dato direttamente dall'attività e un
 * link di prenotazione con nostra commissione sono la stessa proprietà
 * schema.org solo se si dice onestamente chi è il venditore reale.
 */
export function buildItemReviewedJsonLd(item: ContentItem): Record<string, unknown> {
  const { place } = item;
  const schemaType = PLACE_SCHEMA_TYPE[item.types[0]] ?? PLACE_SCHEMA_TYPE._default;

  return {
    '@type': schemaType,
    name: place.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.city ?? place.region ?? '',
      addressRegion: place.region ?? '',
      addressCountry: place.country,
    },
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
    ...(item.deal
      ? {
          offers: {
            '@type': 'Offer',
            url: item.deal.url,
            availability: 'https://schema.org/InStock',
            ...(item.deal.provider
              ? { seller: { '@type': 'Organization', name: item.deal.provider } }
              : {}),
            ...(item.deal.validUntil ? { priceValidUntil: item.deal.validUntil } : {}),
          },
        }
      : {}),
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
