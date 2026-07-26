import { describe, it, expect, vi } from 'vitest';
import {
  calculateHaversineDistance,
  formatGeoDistance,
  sortPlacesByDistance,
  getPlacesNearby,
  getGoogleMapsDirectionsUrl,
  getUserLocation,
} from './geo';

describe('geo utils', () => {
  it('calculateHaversineDistance calculates correct distance between Rome and Milan', () => {
    // Rome ~ 41.9028, 12.4964
    // Milan ~ 45.4642, 9.1900
    const distance = calculateHaversineDistance(41.9028, 12.4964, 45.4642, 9.19);
    // Expected distance is approx 477-480 km
    expect(distance).toBeGreaterThan(470);
    expect(distance).toBeLessThan(490);
    // Verify it returns a number rounded to 1 decimal place
    expect(distance).toBe(Number(distance.toFixed(1)));
  });

  it('formatGeoDistance formats meters and kilometers correctly', () => {
    expect(formatGeoDistance(0.45)).toBe('450 m da te');
    expect(formatGeoDistance(14.24)).toBe('14.2 km da te');
  });

  it('sortPlacesByDistance sorts places by proximity to user location', () => {
    const userLoc = { latitude: 41.9, longitude: 12.5 }; // Rome
    const places = [
      { id: 'milan', place: { coordinates: { lat: 45.46, lng: 9.19 } } }, // ~477 km
      { id: 'rome-center', place: { coordinates: { lat: 41.91, lng: 12.49 } } }, // ~1 km
      { id: 'florence', place: { coordinates: { lat: 43.77, lng: 11.25 } } }, // ~230 km
      { id: 'no-coords', place: {} },
    ];

    const sorted = sortPlacesByDistance(places, userLoc);
    expect(sorted[0].id).toBe('rome-center');
    expect(sorted[1].id).toBe('florence');
    expect(sorted[2].id).toBe('milan');
    expect(sorted[3].id).toBe('no-coords');
    expect(sorted[0].distanceKm).toBeDefined();
  });

  it('getPlacesNearby filters places within maxDistanceKm', () => {
    const userLoc = { latitude: 41.9, longitude: 12.5 }; // Rome
    const places = [
      { id: 'milan', place: { coordinates: { lat: 45.46, lng: 9.19 } } },
      { id: 'rome-center', place: { coordinates: { lat: 41.91, lng: 12.49 } } },
      { id: 'florence', place: { coordinates: { lat: 43.77, lng: 11.25 } } },
    ];

    const nearby = getPlacesNearby(places, userLoc, 50); // within 50km
    expect(nearby.length).toBe(1);
    expect(nearby[0].id).toBe('rome-center');
  });

  it('getGoogleMapsDirectionsUrl returns correct Google Maps directions URL', () => {
    const urlCoords = getGoogleMapsDirectionsUrl({ lat: 41.9, lng: 12.5 });
    expect(urlCoords).toBe('https://www.google.com/maps/dir/?api=1&destination=41.9,12.5');

    const urlAddress = getGoogleMapsDirectionsUrl({
      lat: 41.9,
      lng: 12.5,
      address: 'Trattoria Roma, Via Roma 1',
    });
    expect(urlAddress).toContain('https://www.google.com/maps/dir/?api=1&destination=');
    expect(urlAddress).toContain(encodeURIComponent('Trattoria Roma, Via Roma 1'));
  });

  it('getUserLocation resolves with latitude and longitude when geolocation succeeds', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) =>
        success({
          coords: { latitude: 45.0, longitude: 9.0 },
        })
      ),
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });

    const loc = await getUserLocation();
    expect(loc).toEqual({ latitude: 45.0, longitude: 9.0 });

    vi.unstubAllGlobals();
  });
});
