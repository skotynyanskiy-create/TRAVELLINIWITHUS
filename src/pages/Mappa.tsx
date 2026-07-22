import { lazy, Suspense } from 'react';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';

const FullScreenMapExperience = lazy(() => import('../components/map/FullScreenMapExperience'));

function MapLoaderFallback() {
  return (
    <div className="mt-20 h-[calc(100dvh-80px)] w-full bg-[#0b0805] flex flex-col items-center justify-center gap-4 text-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--color-accent,#c85a32)]" />
      <p className="font-serif italic text-sm text-white/70">Caricamento della Mappa Mappa...</p>
    </div>
  );
}

export default function Mappa() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0b0805]">
      <SEO
        title="Mappa Interattiva delle Destinazioni"
        description="Esplora la mappa a tutto schermo di Travelliniwithus: filtra hotel, trattorie, borghi e destinazioni provate di persona da Rodrigo e Betta."
        canonical={`${SITE_URL}/mappa`}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Mappa', url: `${SITE_URL}/mappa` },
        ]}
      />

      <Suspense fallback={<MapLoaderFallback />}>
        <FullScreenMapExperience />
      </Suspense>
    </div>
  );
}
