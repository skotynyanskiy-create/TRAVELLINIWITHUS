import type { Map as MapLibreMap, MapStyleImageMissingEvent } from 'maplibre-gl';

const MISSING_OPEN_FREE_MAP_ICON = 'circle-11';
const mapsWithFallback = new WeakSet<MapLibreMap>();

/**
 * Lo stile remoto OpenFreeMap dark riferisce `circle-11`, ma lo sprite corrente
 * non lo pubblica. Il simbolo e solo un puntino decorativo per le citta a zoom
 * basso: un fallback trasparente conserva le etichette ed evita un errore di
 * rendering senza alterare marker, dati o interazioni dell'app.
 */
export function resolveOpenFreeMapStyleImage(map: MapLibreMap, imageId: string) {
  if (imageId !== MISSING_OPEN_FREE_MAP_ICON || map.hasImage(imageId)) return;

  map.addImage(imageId, {
    width: 11,
    height: 11,
    data: new Uint8Array(11 * 11 * 4),
  });
}

/** Installs the native MapLibre listener before the remote style can render. */
export function installOpenFreeMapStyleFallback(map: MapLibreMap) {
  if (mapsWithFallback.has(map)) return;

  map.on('styleimagemissing', (event: MapStyleImageMissingEvent) => {
    resolveOpenFreeMapStyleImage(map, event.id);
  });
  mapsWithFallback.add(map);
}
