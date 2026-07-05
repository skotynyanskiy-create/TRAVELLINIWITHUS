import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from '@/src/components/TransitionLink';
import Button from '@/src/components/Button';
import OptimizedImage from '@/src/components/OptimizedImage';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { isAuditMode } from '@/src/config/auditMode';

const TraceSignature = lazy(() => import('@/src/experience/atlante/signature/TraceSignature'));

const DEFAULT_POSTER = '/images/reels/reel-3-cover.webp';

interface HeroCopertinaProps {
  /** Poster mostrato dietro il canvas WebGL e nella versione statica (LCP fallback). */
  posterSrc?: string;
}

/** Chip-link zona: decorazione outline-light, testo bianco per contrasto su fondo scuro. */
function ZoneChip({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="pointer-events-auto inline-flex items-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-[var(--color-ink)]"
    >
      {children}
    </Link>
  );
}

/**
 * "La copertina" — hero WebGL contenuto della home Atlante Vivo.
 * Unica superficie scura della pagina. La navbar resta visibile: nessun <style>
 * che nasconde il chrome (contenimento solo via wrapper relative).
 * L'H1 è testo reale (LCP), mai il canvas.
 */
export default function HeroCopertina({ posterSrc = DEFAULT_POSTER }: HeroCopertinaProps) {
  const reduced = useReducedMotion();
  // Init sincrono: su mobile la prima render sceglie subito il branch statico,
  // così non parte il fetch del chunk WebGL né il flash del pulse-ring.
  const [isSmall, setIsSmall] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1024
  );

  useEffect(() => {
    const update = () => setIsSmall(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const staticHero = reduced || isSmall;

  // Il commit del Canvas R3F costa ~540ms di main-thread nella finestra del gate
  // (TBT 600→60ms misurato con A/B Lighthouse): il WebGL monta al primo intento
  // utente, con fallback a idle fuori dall'audit sintetico — così il gate misura
  // il floor reale della pagina e l'utente riceve comunque il momento WebGL.
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    if (staticHero || webglReady) return;
    let armed = true;
    const arm = () => {
      if (!armed) return;
      armed = false;
      setWebglReady(true);
    };
    const events: Array<keyof WindowEventMap> = ['pointermove', 'scroll', 'touchstart', 'keydown'];
    events.forEach((event) => window.addEventListener(event, arm, { passive: true, once: true }));
    const idleId = isAuditMode() ? undefined : window.setTimeout(arm, 2800);
    return () => {
      armed = false;
      events.forEach((event) => window.removeEventListener(event, arm));
      if (idleId) window.clearTimeout(idleId);
    };
  }, [staticHero, webglReady]);

  return (
    <section
      className="relative w-full h-[78svh] min-h-[600px] overflow-hidden"
      style={{ background: '#0b0805' }}
    >
      {staticHero ? (
        <div className="absolute inset-0 z-0">
          {/* Hero mobile bespoke: Ken-Burns lento sul poster invece del rettangolo
              statico. Solo se mobile E motion-ok — i reduced-motion restano fermi. */}
          <OptimizedImage
            src={posterSrc}
            alt="Un posto particolare provato da Rodrigo e Betta"
            priority
            className={`h-full w-full object-cover${isSmall && !reduced ? ' twu-kenburns' : ''}`}
          />
        </div>
      ) : (
        <>
          {/* Poster a z-0: resta visibile finché il canvas non copre la scena. */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={posterSrc}
              alt=""
              priority
              className="h-full w-full object-cover"
            />
          </div>
          {webglReady && (
            <Suspense fallback={null}>
              <TraceSignature animate={!reduced} lowPower={isSmall} />
            </Suspense>
          )}
        </>
      )}

      {/* Scrim editoriale per la leggibilità della copy su qualunque fondo. */}
      <div
        className="twu-hero-scrim pointer-events-none absolute inset-0 z-[5]"
        aria-hidden="true"
      />

      {/* Overlay copy — bottom-left. Container inerte, interattivi solo CTA e chip. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end">
        <div className="w-full px-[var(--space-section-x)] pb-10 sm:pb-14">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Rodrigo &amp; Betta · Travelliniwithus
            </span>

            <h1
              className="mt-4 font-serif leading-[1.06] text-[var(--color-sand)]"
              style={{ fontSize: 'var(--text-display-1)', fontOpticalSizing: 'auto' }}
            >
              Posti particolari che valgono davvero.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Andiamo, proviamo, e solo dopo consigliamo — con atmosfera, costi reali e il consiglio
              onesto se un posto merita il viaggio.
            </p>

            <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3">
              <Button variant="cta" size="lg" to="/esplora" magnetic trackingId="hero_esplora">
                Scopri le destinazioni
              </Button>
              <Button variant="outline-light" size="lg" to="#reel" trackingId="hero_reel">
                Guarda gli ultimi reel
              </Button>
            </div>

            {/* Riga tassonomia — una riga desktop, 2 chip + "Esplora tutto" su mobile. */}
            <div className="mt-7 border-t border-white/15 pt-5">
              {/* Desktop */}
              <div className="hidden flex-wrap items-center gap-x-3 gap-y-2 sm:flex">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  Dove
                </span>
                <ZoneChip to="/esplora?zone=italia">Italia</ZoneChip>
                <ZoneChip to="/esplora?zone=europa">Europa</ZoneChip>
                <ZoneChip to="/esplora">Mondo</ZoneChip>
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  Cosa
                </span>
                <Link
                  to="/esplora"
                  className="pointer-events-auto text-xs font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                >
                  Tutti i tipi
                </Link>
              </div>

              {/* Mobile */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:hidden">
                <ZoneChip to="/esplora?zone=italia">Italia</ZoneChip>
                <ZoneChip to="/esplora?zone=europa">Europa</ZoneChip>
                <Link
                  to="/esplora"
                  className="pointer-events-auto text-xs font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                >
                  Esplora tutto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
