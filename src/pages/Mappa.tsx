import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '../components/SEO';

const MapboxWorldMap = lazy(() => import('../components/map/MapboxWorldMap'));

function MapShellFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
      <div className="flex flex-col items-center gap-4 text-white/60">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        <span className="text-xs font-bold uppercase tracking-widest">
          Prepariamo la mappa...
        </span>
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
    <div className="relative h-screen bg-[#111] pt-20">
      <SEO
        title="Esplora la Mappa Globale"
        description="Scopri gli itinerari e le destinazioni di Travelliniwithus attraverso la nostra mappa interattiva 3D."
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
