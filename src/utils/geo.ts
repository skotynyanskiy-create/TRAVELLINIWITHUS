/**
 * Geo utilities per Travelliniwithus: calcolo distanza Haversine, geolocalizzazione utente,
 * ordinamento "Vicino a me" e link di navigazione Google Maps.
 */

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface PlaceWithCoordinates {
  id?: string;
  place?: {
    coordinates?: LocationCoordinates;
  };
  coordinates?: LocationCoordinates;
}

/**
 * Calcola la distanza Haversine tra due punti geografici in km, arrotondata a 1 decimale.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raggio della Terra in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formatta la distanza in km o metri per la UI italiana.
 */
export function formatGeoDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m da te`;
  }
  return `${distanceKm.toFixed(1)} km da te`;
}

/**
 * Ottiene la posizione corrente dell'utente via navigator.geolocation.
 */
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocalizzazione non supportata dal tuo browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/**
 * Estrae le coordinate da un oggetto posto (supporta sia `place.coordinates` che `coordinates`).
 */
export function getCoordinates(item: PlaceWithCoordinates): LocationCoordinates | undefined {
  if (
    item.place?.coordinates &&
    typeof item.place.coordinates.lat === 'number' &&
    typeof item.place.coordinates.lng === 'number'
  ) {
    return item.place.coordinates;
  }
  if (
    item.coordinates &&
    typeof item.coordinates.lat === 'number' &&
    typeof item.coordinates.lng === 'number'
  ) {
    return item.coordinates;
  }
  return undefined;
}

/**
 * Ordina una lista di posti in base alla distanza dalla posizione utente.
 * I posti senza coordinate valide vengono messi in fondo.
 */
export function sortPlacesByDistance<T extends PlaceWithCoordinates>(
  places: T[],
  userLocation: UserLocation
): (T & { distanceKm?: number })[] {
  const mapped = places.map((item) => {
    const coords = getCoordinates(item);
    if (!coords) return { item, distanceKm: undefined };
    const distanceKm = calculateHaversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      coords.lat,
      coords.lng
    );
    return { item, distanceKm };
  });

  mapped.sort((a, b) => {
    const distA = a.distanceKm ?? Number.POSITIVE_INFINITY;
    const distB = b.distanceKm ?? Number.POSITIVE_INFINITY;
    return distA - distB;
  });

  return mapped.map(({ item, distanceKm }) =>
    distanceKm !== undefined ? Object.assign({}, item, { distanceKm }) : item
  );
}

/**
 * Filtra e restituisce i posti entro `maxDistanceKm` dalla posizione utente, ordinati per distanza.
 */
export function getPlacesNearby<T extends PlaceWithCoordinates>(
  places: T[],
  userLocation: UserLocation,
  maxDistanceKm: number = 50
): (T & { distanceKm: number })[] {
  const sorted = sortPlacesByDistance(places, userLocation);
  return sorted.filter(
    (item): item is T & { distanceKm: number } =>
      item.distanceKm !== undefined && item.distanceKm <= maxDistanceKm
  );
}

/**
 * Genera l'URL per le indicazioni di navigazione Google Maps.
 */
export function getGoogleMapsDirectionsUrl(destination: {
  lat: number;
  lng: number;
  address?: string;
}): string {
  if (destination.address && destination.address.trim()) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination.address.trim())}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
}
