import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Map, Sparkles, ArrowRight } from 'lucide-react';

const MapboxWorldMap = lazy(() => import('../map/MapboxWorldMap'));

function MapLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-ink-deep)] gap-4 text-white/50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
      <span className="text-[10px] font-mono uppercase tracking-widest">
        Inizializzazione mappa 3D...
      </span>
    </div>
  );
}

/**
 * Sezione Portale Mappa.
 * Consente di caricare pigramente (lazy) il modulo pesante MapboxGL (~470KB)
 * soltanto quando l'utente raggiunge la fine del Diario di Viaggio.
 * Su mobile, mostra un fallback statico premium che linka a `/mappa` per salvare le performance.
 */
export default function InteractiveMapSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Attiva il caricamento della mappa quando l'elemento entra in viewport
  useEffect(() => {
    if (isMobile) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    const el = document.getElementById('interactive-map-portal');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div
      id="interactive-map-portal"
      className="relative w-full h-[680px] bg-[var(--color-ink-deep)] overflow-hidden flex flex-col items-center justify-center text-white"
    >
      {/* Sfondo geometrico / reticolato scuro */}
      <div className="absolute inset-0 twu-dot-grid opacity-10 pointer-events-none" />

      {isMobile ? (
        /* ================= MOBILE MAP STATIC FALLBACK ================= */
        <div className="relative z-10 w-full h-full px-6 flex flex-col items-center justify-center text-center gap-6">
          <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <Compass className="h-8 w-8 text-[var(--color-accent)] animate-spin-slow" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[var(--color-accent)]">
            Esplora Geografica
          </span>

          <h2 className="font-serif text-3xl font-medium tracking-tight max-w-sm">
            La mappa interattiva dei posti particolari
          </h2>

          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Abbiamo localizzato ogni singola tappa, hotel segreto ed esperienza provata sul campo da
            noi.
          </p>

          <Link
            to="/mappa"
            className="mt-4 px-8 py-4 rounded-full bg-white text-[var(--color-ink)] font-sans text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 flex items-center gap-3 shadow-[var(--shadow-lg)]"
          >
            Apri Mappa Interattiva <Map size={14} />
          </Link>
        </div>
      ) : (
        /* ================= DESKTOP MAP LIVE EMBED ================= */
        <div className="relative w-full h-full flex">
          {/* Overlay informativo a sinistra per bilanciare la composizione (Awwwards design) */}
          <div className="absolute top-12 left-12 z-20 max-w-sm bg-[var(--color-ink-deep)]/90 backdrop-blur-md border border-white/10 p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] flex flex-col gap-4 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">
                Atlante Geografico
              </span>
            </div>
            <h3 className="font-serif text-2xl font-medium">Esplora i nostri luoghi particolari</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Filtra la mappa per continente, zona o intenzione. Clicca sui pin per sbloccare le
              guide dettagliate o i video reel registrati direttamente da noi.
            </p>
            <Link
              to="/mappa"
              className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] hover:text-white transition-colors"
            >
              Apri a Schermo Intero <ArrowRight size={14} />
            </Link>
          </div>

          {/* Contenitore Mappa Live */}
          <div className="relative w-full h-full z-10">
            {shouldLoadMap ? (
              <Suspense fallback={<MapLoader />}>
                <MapboxWorldMap />
              </Suspense>
            ) : (
              <MapLoader />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
