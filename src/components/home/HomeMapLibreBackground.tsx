import { useRef, useEffect, useMemo, useSyncExternalStore } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/maplibre';
import { CONTENT_ITEMS } from '@/src/config/contentLibrary';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import 'maplibre-gl/dist/maplibre-gl.css';

/** Cap pin count on home teaser — full set lives on /mappa. */
const HOME_MAP_PIN_LIMIT = 28;

function subscribeVisibility(onChange: () => void) {
  if (typeof document === 'undefined') return () => {};
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function getVisibilitySnapshot() {
  return typeof document === 'undefined' ? true : document.visibilityState === 'visible';
}

export default function HomeMapLibreBackground() {
  const mapRef = useRef<MapRef>(null);
  const reduceMotion = useReducedMotion();
  const tabVisible = useSyncExternalStore(subscribeVisibility, getVisibilitySnapshot, () => true);

  const geocodedItems = useMemo(
    () =>
      CONTENT_ITEMS.filter(
        (item) => item.place?.coordinates?.lat && item.place?.coordinates?.lng
      ).slice(0, HOME_MAP_PIN_LIMIT),
    []
  );

  // Slow bearing spin only when motion allowed and tab visible
  useEffect(() => {
    if (reduceMotion || !tabVisible) return;

    let animationFrameId = 0;
    let currentBearing = 0;

    const animate = () => {
      currentBearing = (currentBearing - 0.015) % 360;
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        if (map && map.loaded()) {
          map.setBearing(currentBearing);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [reduceMotion, tabVisible]);

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden opacity-70">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 12.0,
          latitude: 48.0,
          zoom: 3.2,
          pitch: 45,
          bearing: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/dark"
        interactive={false}
        attributionControl={false}
        reuseMaps
      >
        {geocodedItems.map((item) => {
          const { lng, lat } = item.place.coordinates!;
          return (
            <Marker key={item.id} longitude={lng} latitude={lat} anchor="center">
              <div className="relative flex items-center justify-center">
                {!reduceMotion && (
                  <span className="absolute h-6 w-6 animate-ping rounded-full bg-[var(--color-accent,#c2410c)]/50" />
                )}
                <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--color-accent,#c2410c)] shadow-md" />
              </div>
            </Marker>
          );
        })}
      </Map>

      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-deep,#111111)] via-[var(--color-ink-deep,#111111)]/75 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(194,65,12,0.12)_0%,transparent_60%)]" />
    </div>
  );
}
