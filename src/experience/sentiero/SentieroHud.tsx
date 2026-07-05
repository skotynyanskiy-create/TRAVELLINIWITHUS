import { type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import { SENTIERO_STAGES, type SentieroStage } from './sentieroData';
import { isDisabled } from '../../config/liteMode';
import { trackEvent } from '../../services/analytics';
import SentieroLeadForm from './SentieroLeadForm';

/** Varco verso la pagina reale, con fallback se la route è off in LITE_MODE. */
function stageHref(stage: SentieroStage): string {
  return isDisabled(stage.route) && stage.routeFallback ? stage.routeFallback : stage.route;
}

export default function SentieroHud({
  active,
  progressRef,
  endRef,
}: {
  active: number;
  progressRef: RefObject<HTMLDivElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
}) {
  const total = SENTIERO_STAGES.length;

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] text-white">
      {/* Logo e H1 per SEO */}
      <div className="absolute left-8 top-8 flex items-center gap-3">
        <Compass className="h-4 w-4 animate-spin-slow text-[var(--color-accent)]" />
        <h1 className="font-serif text-sm tracking-tight">
          <Link
            to="/"
            className="text-white hover:text-[var(--color-accent)] transition-colors pointer-events-auto"
          >
            Travellini<span className="text-[var(--color-accent)]">with</span>us
          </Link>
        </h1>
        <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
          Le Tracce
        </span>
      </div>

      {/* Mappa in alto a destra come prodotto centrale / escape path */}
      <Link
        to="/mappa"
        className="pointer-events-auto absolute right-8 top-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
      >
        Mappa
      </Link>

      {/* Barra di progresso verticale (riempita dal canvas via ref) */}
      <div className="absolute right-9 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <span className="font-serif text-base">{String(active + 1).padStart(2, '0')}</span>
        <div className="relative h-44 w-0.5 overflow-hidden rounded-full bg-white/15">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full w-full origin-top bg-[var(--color-accent)]"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-white/40">
          / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Mondo attivo + varco (tutte le tappe sono sempre nel DOM per SEO e accessibilità) */}
      <div className="absolute bottom-12 left-8 right-8 z-[130] pointer-events-none min-h-[350px] flex items-end">
        {SENTIERO_STAGES.map((s, i) => {
          const isActive = i === active;
          const isFinal = i === 5;
          const alignmentClass = isFinal
            ? 'mx-auto w-full max-w-5xl justify-center'
            : i % 2 === 0
              ? 'mr-auto text-left'
              : 'ml-auto text-right';

          if (isFinal) {
            return (
              <motion.div
                key="final-panel"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 24,
                  scale: isActive ? 1 : 0.96,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  pointerEvents: isActive ? 'auto' : 'none',
                  display: isActive ? 'block' : 'none',
                }}
                className={`w-full ${alignmentClass}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full bg-[#0b0805]/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
                  {/* Colonna 1: Mappa */}
                  <div className="flex flex-col justify-between h-full text-left">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                        01 / Esplora
                      </span>
                      <h2 className="font-serif text-lg font-medium mt-1.5 text-white">
                        La Mappa delle Tracce
                      </h2>
                      <p className="text-xs text-white/60 font-light mt-2 mb-6 leading-relaxed">
                        Visualizza tutti i posti che abbiamo testato di persona. Filtra per
                        categoria, zona e tipo di alloggio.
                      </p>
                    </div>
                    <Link
                      to="/mappa"
                      onClick={() => trackEvent('sentiero_final_cta', { cta_id: 'mappa' })}
                      className="inline-flex items-center justify-between w-full rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[var(--color-ink)] transition-all duration-300 cursor-pointer pointer-events-auto"
                    >
                      Apri la Mappa <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Colonna 2: Newsletter (Lead Capture) */}
                  <div className="flex flex-col justify-between h-full border-y md:border-y-0 md:border-x border-white/10 py-5 md:py-0 md:px-8 text-left">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                        02 / Newsletter
                      </span>
                      <h2 className="font-serif text-lg font-medium mt-1.5 text-white">
                        La Lettera delle Tracce
                      </h2>
                      <p className="text-xs text-white/60 font-light mt-2 mb-4 leading-relaxed">
                        Ricevi ogni settimana le nostre recensioni senza filtri, i prezzi reali e
                        gli itinerari inediti sul campo.
                      </p>
                    </div>
                    <SentieroLeadForm source="sentiero_final_desktop" layout="stacked" />
                  </div>

                  {/* Colonna 3: Collaborazioni */}
                  <div className="flex flex-col justify-between h-full text-left">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                        03 / Collaborazioni
                      </span>
                      <h2 className="font-serif text-lg font-medium mt-1.5 text-white">
                        Lavoriamo Insieme
                      </h2>
                      <p className="text-xs text-white/60 font-light mt-2 mb-6 leading-relaxed">
                        Sei un hotel, un ristorante o un brand del turismo? Parliamo di come
                        valorizzare la tua realtà.
                      </p>
                    </div>
                    <Link
                      to="/collaborazioni"
                      onClick={() => trackEvent('sentiero_final_cta', { cta_id: 'collaborazioni' })}
                      className="inline-flex items-center justify-between w-full rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[var(--color-ink)] transition-all duration-300 cursor-pointer pointer-events-auto"
                    >
                      Collabora con Noi <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={s.id}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : 18,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                pointerEvents: isActive ? 'auto' : 'none',
                display: isActive ? 'block' : 'none',
              }}
              className={`max-w-md w-full ${alignmentClass}`}
            >
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {s.kicker}
              </div>
              <h2 className="mb-3 font-serif text-2xl md:text-3xl font-medium leading-tight text-white">
                {s.title}
              </h2>
              <p className="mb-4 text-xs md:text-sm font-light leading-relaxed text-white/70">
                {s.description}
              </p>

              {/* Nota di Campo: riga corsivo serif con filetto sinistro/destro accent */}
              <p
                className={`mb-6 pl-3 border-l-2 border-l-[var(--color-accent)] font-serif text-xs italic text-white/65 leading-relaxed ${
                  i % 2 === 0
                    ? 'text-left'
                    : 'text-right border-l-0 border-r-2 border-r-[var(--color-accent)] pr-3 pl-0'
                }`}
              >
                &ldquo;{s.fieldNote}&rdquo;
              </p>

              <Link
                to={stageHref(s)}
                onClick={() =>
                  trackEvent('sentiero_varco_click', {
                    world_id: s.id,
                    route: stageHref(s),
                  })
                }
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[var(--color-accent)] cursor-pointer pointer-events-auto"
              >
                {s.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Suggerimento scroll all'inizio */}
      {active === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50"
        >
          Scorri <ArrowDown size={14} />
        </motion.div>
      )}

      {/* Vicino alla fine: invito a risalire il sentiero (reso visibile via ref) */}
      <div
        ref={endRef}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 opacity-0 transition-opacity duration-500"
        style={{ pointerEvents: 'none' }}
      >
        <ArrowUp size={14} /> Torna sui tuoi passi
      </div>
    </div>
  );
}
