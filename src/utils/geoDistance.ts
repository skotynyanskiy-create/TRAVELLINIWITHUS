import { calculateHaversineDistance, formatGeoDistance } from './geo';

/**
 * Haversine formula to calculate distance between two geographical points in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  return calculateHaversineDistance(lat1, lon1, lat2, lon2);
}

export function formatDistanceKm(distanceKm: number): string {
  return formatGeoDistance(distanceKm);
}
