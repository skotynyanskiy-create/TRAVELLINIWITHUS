/**
 * Deep-link builders per Google Maps sulla pagina-posto. Pure function, nessuna
 * dipendenza da DOM/router — facili da testare in isolamento.
 */

export interface PlaceLinkInput {
  name: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  /** Override della query di ricerca (es. nome esatto della scheda Google Business). */
  googlePlaceQuery?: string;
}

function buildSearchQuery(place: PlaceLinkInput): string {
  return place.googlePlaceQuery || [place.name, place.city].filter(Boolean).join(' ');
}

/**
 * "Indicazioni": naviga direttamente al posto. Usa coordinate precise quando
 * disponibili, altrimenti cade sulla ricerca testuale nome + città.
 */
export function buildGoogleMapsDirectionsUrl(place: PlaceLinkInput): string {
  if (place.coordinates) {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildSearchQuery(place))}`;
}

/**
 * "Vedi su Google": ancora canonica verso la scheda Business Profile, sempre
 * disponibile anche senza coordinate o dati nativi (hours/phone/bookingUrl).
 */
export function buildGoogleMapsListingUrl(place: PlaceLinkInput): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildSearchQuery(place))}`;
}

/** Hostname pulito (senza www.) da un URL di prenotazione, per l'evento analytics `provider`. */
export function getBookingProviderFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}
