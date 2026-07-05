import { useMemo, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import type { LineLayerSpecification } from 'maplibre-gl';
import { MapPin } from 'lucide-react';
import { POI_CATALOG, POI_CATEGORY_LABELS, type Poi } from '../config/poiCatalog';

/**
 * ItineraryMap — mini-mappa Mapbox del giorno attivo dell'ItineraryBuilder.
 *
 * Marathon 2026-05-18 (post-FASE 3.A export PDF).
 *
 * Caratteristiche:
 * - Marker numerati 01..N per ogni POI del giorno (ordine = sequenza visita)
 * - Linea connettiva tra POI consecutivi (path giornaliero)
 * - Click marker → popup con nome + categoria + ora stimata
 * - Auto-fit bounds sui POI del giorno (centroide + padding)
 * - Style "light-v11" (coerente con palette sand del brand, NO dark)
 * - NavigationControl bottom-right
 * - Fallback graceful se VITE_MAPBOX_TOKEN mancante (mostra pannello con coords)
 *
 * Non duplica logica MapboxWorldMap: stessa libreria (react-map-gl/mapbox)
 * ma scope diverso (mini-mappa di pianificazione, non globe esploratorio).
 */

// MapLibre GL JS non richiede token client-side per basemap liberi o self-hosted.

interface ItineraryMapProps {
  /** POI ids per il giorno attivo, in ordine */
  poiIds: string[];
  /** Numero giorno (per analytics + label) */
  day: number;
}

interface ResolvedPoi {
  poi: Poi;
  position: number;
}

/**
 * Calcola il centro geometrico (centroide) di un array di coordinate.
 * Usato per inizializzare la vista quando ci sono POI.
 */
function centroid(coords: Array<{ longitude: number; latitude: number }>): {
  longitude: number;
  latitude: number;
} | null {
  if (coords.length === 0) return null;
  const sum = coords.reduce(
    (acc, c) => ({ longitude: acc.longitude + c.longitude, latitude: acc.latitude + c.latitude }),
    { longitude: 0, latitude: 0 }
  );
  return {
    longitude: sum.longitude / coords.length,
    latitude: sum.latitude / coords.length,
  };
}

/**
 * Calcola zoom euristico dato l'extent dei POI.
 * Piu lontani sono i POI, piu basso lo zoom.
 */
function fitZoom(coords: Array<{ longitude: number; latitude: number }>): number {
  if (coords.length <= 1) return 12; // zoom alto su singolo POI
  const lngs = coords.map((c) => c.longitude);
  const lats = coords.map((c) => c.latitude);
  const lngRange = Math.max(...lngs) - Math.min(...lngs);
  const latRange = Math.max(...lats) - Math.min(...lats);
  const maxRange = Math.max(lngRange, latRange);
  // Heuristic: range 0.1° → zoom 11, range 1° → zoom 8, range 5° → zoom 6
  if (maxRange < 0.05) return 12;
  if (maxRange < 0.2) return 11;
  if (maxRange < 0.5) return 10;
  if (maxRange < 1.5) return 8;
  if (maxRange < 4) return 6;
  return 4;
}

export default function ItineraryMap({ poiIds, day }: ItineraryMapProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Risolvi POI ids → oggetti Poi con position numerica.
  const resolvedPois = useMemo<ResolvedPoi[]>(() => {
    return poiIds
      .map((id, idx) => {
        const poi = POI_CATALOG[id];
        if (!poi) return null;
        return { poi, position: idx + 1 };
      })
      .filter((x): x is ResolvedPoi => x !== null);
  }, [poiIds]);

  // Vista iniziale: centroide + zoom euristico.
  const initialViewState = useMemo(() => {
    if (resolvedPois.length === 0) {
      // Default Italia
      return { longitude: 12.5, latitude: 42.0, zoom: 5 };
    }
    const coords = resolvedPois.map((r) => ({
      longitude: r.poi.geo.longitude,
      latitude: r.poi.geo.latitude,
    }));
    const center = centroid(coords);
    return {
      longitude: center?.longitude ?? 12.5,
      latitude: center?.latitude ?? 42.0,
      zoom: fitZoom(coords),
    };
  }, [resolvedPois]);

  // GeoJSON path connessione POI in ordine (LineString).
  const pathGeoJson = useMemo(() => {
    if (resolvedPois.length < 2) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: resolvedPois.map((r) => [r.poi.geo.longitude, r.poi.geo.latitude]),
      },
    };
  }, [resolvedPois]);

  const lineLayerStyle: LineLayerSpecification = {
    id: 'itinerary-line',
    type: 'line',
    source: 'itinerary-path',
    paint: {
      'line-color': '#0a0a0a',
      'line-width': 2,
      'line-dasharray': [2, 2],
      'line-opacity': 0.6,
    },
  };

  // MapLibre non richiede controlli sul token client-side.

  if (resolvedPois.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-black/8 bg-[var(--color-sand)] p-6 text-center">
        <MapPin size={20} className="mx-auto mb-3 text-black/30" />
        <p className="text-sm leading-snug text-black/65">
          Aggiungete una tappa al Giorno {day} per vederla sulla mappa.
        </p>
      </div>
    );
  }

  const selected = selectedIdx !== null ? resolvedPois[selectedIdx] : null;

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-md)] border border-black/8"
      style={{ height: '440px' }}
    >
      <Map
        key={`day-${day}-${resolvedPois.length}`}
        initialViewState={initialViewState}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Path linea tra POI consecutivi */}
        {pathGeoJson && (
          <Source id="itinerary-path" type="geojson" data={pathGeoJson}>
            <Layer {...lineLayerStyle} />
          </Source>
        )}

        {/* Marker numerati */}
        {resolvedPois.map((r, idx) => (
          <Marker
            key={r.poi.id}
            longitude={r.poi.geo.longitude}
            latitude={r.poi.geo.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedIdx(idx);
            }}
          >
            <button
              type="button"
              aria-label={`Tappa ${r.position}: ${r.poi.name}`}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--color-ink)] font-serif text-sm font-medium text-white shadow-md ring-2 ring-white transition-transform hover:scale-110"
            >
              {String(r.position).padStart(2, '0')}
            </button>
          </Marker>
        ))}

        {/* Popup POI selezionato */}
        {selected && (
          <Popup
            anchor="top"
            longitude={selected.poi.geo.longitude}
            latitude={selected.poi.geo.latitude}
            onClose={() => setSelectedIdx(null)}
            closeButton={true}
            closeOnClick={false}
            offset={[0, 18]}
            maxWidth="260px"
          >
            <div className="px-1 py-1">
              <p className="text-eyebrow !text-black/55">
                Tappa {String(selected.position).padStart(2, '0')} ·{' '}
                {POI_CATEGORY_LABELS[selected.poi.category]}
              </p>
              <h4 className="mt-1.5 font-serif text-base leading-snug text-[var(--color-ink)]">
                {selected.poi.name}
              </h4>
              <p className="mt-2 text-xs leading-snug text-black/65">{selected.poi.description}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
