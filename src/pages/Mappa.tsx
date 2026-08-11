import { lazy, Suspense, useEffect, useState } from 'react';
import { MapPinOff } from 'lucide-react';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import { canLoad, getConsent, onConsentChange, setConsent } from '../lib/consent';

const FullScreenMapExperience = lazy(() => import('../components/map/FullScreenMapExperience'));

function MapLoaderFallback() {
  return (
    <div className="mt-20 h-[calc(100dvh-80px)] w-full bg-[#0b0805] flex flex-col items-center justify-center gap-4 text-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--color-accent,#c85a32)]" />
      <p className="font-serif italic text-sm text-white/70">Caricamento della Mappa...</p>
    </div>
  );
}

/**
 * Qui la mappa È la pagina: senza consenso marketing non mostriamo un buco
 * nero, spieghiamo perché (tessere caricate da un servizio esterno che
 * riceve l'IP di chi guarda) e diamo un modo diretto per attivarla.
 */
function MapConsentPlaceholder({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="mt-20 flex h-[calc(100dvh-80px)] w-full flex-col items-center justify-center gap-4 bg-[#0a0705] px-6 text-center text-white">
      {/* `--color-accent-on-dark`, non `--color-accent-text`: quest'ultimo e'
          l'accento leggibile su fondo CHIARO e qui dava 3,56:1 su #0a0705,
          sotto la soglia AA di 4,5 per testo piccolo — ha fatto scendere
          /mappa sotto lo 0,95 di accessibilita' che blocca la CI. Il token
          giusto e' documentato in index.css:44 proprio come «eyebrow/testo su
          scuro». */}
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-on-dark)]">
        Mappa dei posti particolari
      </span>
      <h1 className="font-serif text-2xl font-medium leading-tight sm:text-3xl">
        Dove siamo stati davvero
      </h1>
      <MapPinOff size={28} className="mt-1 text-white/40" aria-hidden="true" />
      <p className="max-w-md text-sm leading-relaxed text-white/70">
        La mappa carica le tessere da un servizio esterno (OpenFreeMap), che riceve l&apos;indirizzo
        IP di chi la guarda. Parte solo con il consenso ai cookie di marketing, che hai rifiutato o
        non ancora dato.
      </p>
      <button
        type="button"
        onClick={onActivate}
        className="mt-2 rounded-full bg-[var(--color-accent,#c85a32)] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-md transition-all hover:brightness-95 cursor-pointer"
      >
        Attiva la mappa
      </button>
    </div>
  );
}

export default function Mappa() {
  // Stessa categoria e stesso pattern di consenso già in uso altrove nel
  // repo (es. src/services/analytics.ts): la mappa carica tessere da un
  // servizio esterno, quindi vive dietro il consenso marketing.
  const [mapConsentGranted, setMapConsentGranted] = useState(() => canLoad('marketing'));

  useEffect(() => onConsentChange((consent) => setMapConsentGranted(consent.marketing)), []);

  const activateMap = () => {
    const current = getConsent();
    setConsent({
      analytics: current.analytics,
      marketing: true,
      personalization: current.personalization,
    });
  };

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

      {mapConsentGranted ? (
        <Suspense fallback={<MapLoaderFallback />}>
          <FullScreenMapExperience />
        </Suspense>
      ) : (
        <MapConsentPlaceholder onActivate={activateMap} />
      )}
    </div>
  );
}
