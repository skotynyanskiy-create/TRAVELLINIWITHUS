import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '../components/SEO';

const MapboxWorldMap = lazy(() => import('../components/map/MapboxWorldMap'));

function MapShellFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink-deep)]">
      <div className="flex flex-col items-center gap-4 text-white/60">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        <span className="text-xs font-bold uppercase tracking-widest">Prepariamo la mappa...</span>
      </div>
    </div>
  );
}

export default function Mappa() {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldLoadMap(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    // isolation: isolate crea uno stacking context locale che impedisce
    // al <main> di Layout (con flex-grow) di sovrapporsi al popup Mapbox.
    // mt-20 sposta il container sotto la Navbar fissa (top-4 + h~60px).
    <div
      className="relative mt-20 h-[calc(100dvh-5rem)] bg-[var(--color-ink-deep)]"
      style={{ isolation: 'isolate' }}
    >
      <SEO
        title="Mappa dei posti che abbiamo visitato"
        description="La mappa interattiva 3D di Travelliniwithus: destinazioni verificate sul posto, filtrate per regione, esperienza e periodo."
      />

      {shouldLoadMap ? (
        <Suspense fallback={<MapShellFallback />}>
          <MapboxWorldMap />
        </Suspense>
      ) : (
        <MapShellFallback />
      )}
    </div>
  );
}
