import Map, { Marker, type MapRef } from 'react-map-gl/maplibre';
import { useCallback } from 'react';
import { installOpenFreeMapStyleFallback } from '../../../lib/openFreeMap';
import type { ContentPlace } from '../../../types/content';
import 'maplibre-gl/dist/maplibre-gl.css';

interface ArticleMiniMapItem {
  id: string;
  title: string;
  place: ContentPlace;
}

interface ArticleMiniMapProps {
  items: ArticleMiniMapItem[];
  zoom?: number;
}

/**
 * Canvas della direttiva `:::mappa`, caricata solo dietro consenso marketing
 * e solo quando il blocco entra in viewport (vedi `directives/mappa.tsx`).
 * Decorativa e non interattiva: l'accessibilita' del blocco e' l'elenco
 * testuale che la direttiva renderizza sotto la mappa, non questa canvas —
 * per questo niente controlli di zoom finti, niente marker cliccabili.
 */
export default function ArticleMiniMap({ items, zoom = 8 }: ArticleMiniMapProps) {
  const setMapRef = useCallback((instance: MapRef | null) => {
    if (instance) installOpenFreeMapStyleFallback(instance.getMap());
  }, []);

  const coords = items
    .map((item) => item.place.coordinates)
    .filter((coordinate): coordinate is { lat: number; lng: number } => Boolean(coordinate));

  if (coords.length === 0) return null;

  const centerLat = coords.reduce((sum, coordinate) => sum + coordinate.lat, 0) / coords.length;
  const centerLng = coords.reduce((sum, coordinate) => sum + coordinate.lng, 0) / coords.length;

  return (
    <div className="pointer-events-none relative h-full w-full" aria-hidden="true">
      <Map
        ref={setMapRef}
        initialViewState={{ longitude: centerLng, latitude: centerLat, zoom }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/dark"
        interactive={false}
        attributionControl={false}
        locale={{ 'Map.Title': 'Mappa' }}
        reuseMaps
      >
        {items.map((item) =>
          item.place.coordinates ? (
            <Marker
              key={item.id}
              longitude={item.place.coordinates.lng}
              latitude={item.place.coordinates.lat}
              anchor="center"
            >
              <span className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--color-accent,#c2410c)] shadow-md" />
            </Marker>
          ) : null
        )}
      </Map>
    </div>
  );
}
