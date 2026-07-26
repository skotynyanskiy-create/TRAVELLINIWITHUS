/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ArrowDown, ArrowUp, Volume2, VolumeX } from 'lucide-react';
import { SENTIERO_STAGES, type SentieroStage } from './sentieroData';
import { trackEvent } from '../../services/analytics';
import SentieroLeadForm from './SentieroLeadForm';

function poster(media: SentieroStage['media']): string {
  if (media.type === 'image') return media.src;
  return media.src.replace('/video/', '/images/reels/').replace('.mp4', '-cover.webp');
}

/** Reel di tappa caricato pigro: scarica e riproduce SOLO quando la sezione entra
 *  in viewport (IntersectionObserver). Fuori vista resta il poster, niente MP4.
 *  Così la story non scarica 4 reel insieme — al massimo quello in vista. */
function LazyVideo({
  src,
  posterSrc,
  className,
}: {
  src: string;
  posterSrc: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
          setMuted(true);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (load) ref.current?.play?.().catch(() => {});
  }, [load]);

  return (
    <>
      <video
        ref={ref}
        src={load ? src : undefined}
        poster={posterSrc}
        muted={muted}
        loop
        playsInline
        preload="none"
        className={className}
      >
        {/* Reel di viaggio senza parlato: nessuna didascalia da fornire. */}
        <track kind="captions" />
      </video>
      <button
        type="button"
        onClick={() => {
          setMuted((m) => !m);
          ref.current?.play?.().catch(() => {});
        }}
        aria-label={muted ? 'Attiva audio del reel' : 'Disattiva audio del reel'}
        className="absolute right-4 top-24 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white cursor-pointer"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </>
  );
}

function stageHref(stage: SentieroStage): string {
  return stage.route;
}

/**
 * Mobile-first and reduced-motion version of "Le Tracce".
 * Renders as a vertical, screen-snapping cinematic story stack using HTML5 media.
 */
export default function SentieroFallback() {
  const scrollToStage = (index: number) => {
    const el = document.getElementById(`stage-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-[#0b0805] text-white scroll-smooth relative">
      <style>{`
        /* Hide scrollbars but keep functionality */
        main::-webkit-scrollbar { width: 0; height: 0; display: none; }
        main { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Floating Header */}
      <header className="fixed left-0 right-0 top-0 z-[150] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[var(--color-accent)] animate-spin-slow" />
          <span className="font-serif text-sm tracking-tight pointer-events-auto">
            Travellini<span className="text-[var(--color-accent)]">with</span>us
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Tracce
          </span>
        </div>
        <Link
          to="/"
          className="pointer-events-auto text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
        >
          Esci
        </Link>
      </header>

      {/* Slide 0: Cinematic Splash */}
      <section
        id="stage-intro"
        className="relative flex h-screen w-full snap-start flex-col items-center justify-center px-6 text-center"
      >
        <div className="absolute inset-0 twu-dot-grid opacity-15" aria-hidden="true" />
        <div className="relative z-10 max-w-lg">
          <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
            Le Tracce
          </span>
          <h1 className="mb-6 font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            Travellini<span className="text-[var(--color-accent)]">with</span>us
          </h1>
          <p className="mx-auto max-w-md font-serif text-base leading-relaxed text-white/70">
            Segui le tracce dei posti che abbiamo provato davvero. Una tappa alla volta,
            direttamente dal taccuino di viaggio di Rodrigo & Betta.
          </p>
          <button
            onClick={() => scrollToStage(0)}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-accent)] hover:text-white cursor-pointer"
          >
            Inizia il cammino <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-white/30 animate-pulse">
          Trascina per scorrere
        </div>
      </section>

      {/* Slides 1-6: Story Chapters */}
      {SENTIERO_STAGES.map((stage, i) => {
        const isFinal = i === 5;
        return (
          <section
            key={stage.id}
            id={`stage-${i}`}
            className="relative flex h-screen w-full snap-start flex-col justify-end pb-12 pt-20 px-6"
          >
            {/* Background full-bleed media */}
            <div className="absolute inset-0 z-0">
              {stage.media.type === 'video' ? (
                <LazyVideo
                  src={stage.media.src}
                  posterSrc={poster(stage.media)}
                  className="h-full w-full object-cover brightness-[0.38] saturate-[1.05]"
                />
              ) : (
                <img
                  src={stage.media.src}
                  alt=""
                  className="h-full w-full object-cover brightness-[0.38] saturate-[1.05]"
                />
              )}
              {/* Dark editorial gradient scrim overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0805] via-[#0b0805]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b0805]/40 via-transparent to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col justify-end min-h-[75vh]">
              {isFinal ? (
                /* Dynamic Final Slide: 3 Stacked CTAs for Mobile */
                <div className="flex flex-col gap-5 w-full bg-[#0b0805]/70 backdrop-blur-md rounded-2xl border border-white/10 p-5 md:p-8 max-w-lg mx-auto">
                  <div className="text-center pb-2 border-b border-white/10">
                    <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                      L&rsquo;inizio del viaggio
                    </span>
                    <h2 className="font-serif text-2xl font-medium text-white mt-1">
                      Scegli la tua traccia
                    </h2>
                  </div>

                  {/* CTA 1: Mappa */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className="font-serif text-sm font-medium text-white">La Mappa</h3>
                      <p className="text-[11px] text-white/50 font-light leading-snug">
                        I nostri posti geolocalizzati.
                      </p>
                    </div>
                    <Link
                      to="/mappa"
                      onClick={() => trackEvent('sentiero_fallback_final_cta', { cta_id: 'mappa' })}
                      className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                    >
                      Esplora <ArrowRight size={10} />
                    </Link>
                  </div>

                  {/* CTA 2: Newsletter */}
                  <div className="flex flex-col gap-2 border-y border-white/5 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-sm font-medium text-white">La Lettera</h3>
                        <p className="text-[11px] text-white/50 font-light leading-snug">
                          Dritte reali e prezzi sul campo.
                        </p>
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <SentieroLeadForm source="sentiero_final_mobile" layout="inline" />
                    </div>
                  </div>

                  {/* CTA 3: Collaborazioni */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className="font-serif text-sm font-medium text-white">Collabora</h3>
                      <p className="text-[11px] text-white/50 font-light leading-snug">
                        Lavora con noi a un progetto.
                      </p>
                    </div>
                    <Link
                      to="/collaborazioni"
                      onClick={() =>
                        trackEvent('sentiero_fallback_final_cta', { cta_id: 'collaborazioni' })
                      }
                      className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                    >
                      Parliamone <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Standard Slide: Chapter Details */
                <div className="flex flex-col bg-[var(--color-sand)] text-[var(--color-ink)] border border-black/10 rounded-2xl p-5 shadow-premium relative overflow-hidden">
                  {/* Stage Index */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs tracking-widest text-[var(--color-accent)] font-semibold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px w-6 bg-black/10" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-muted-fg)]">
                      {stage.kicker.replace(/^\d+\s*\/\s*/, '')}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="mb-2.5 font-serif text-xl sm:text-2xl font-medium leading-tight text-[var(--color-ink)]">
                    {stage.title}
                  </h2>
                  <p className="mb-3.5 text-xs font-light leading-relaxed text-[var(--color-ink-2)]">
                    {stage.description}
                  </p>

                  {/* Field Note (Taccuino) */}
                  <div className="mb-4.5 rounded-xl border border-black/5 bg-white/60 p-3.5 border-l-2 border-l-[var(--color-accent)]">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-0.5">
                      Nota di Campo
                    </span>
                    <p className="font-serif text-xs italic text-[var(--color-ink)] leading-relaxed">
                      "{stage.fieldNote}"
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between mt-1">
                    <Link
                      to={stageHref(stage)}
                      onClick={() =>
                        trackEvent('sentiero_fallback_varco_click', {
                          world_id: stage.id,
                          route: stageHref(stage),
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
                    >
                      {stage.cta} <ArrowRight size={12} />
                    </Link>

                    {/* Next step indicator */}
                    <button
                      onClick={() => scrollToStage(i + 1)}
                      className="flex items-center justify-center p-2 border border-black/10 rounded-full hover:bg-black/5 text-[var(--color-muted-fg)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Back to top footer */}
      <footer className="h-[25vh] bg-[#0b0805] flex flex-col items-center justify-center gap-4 text-center pb-8 border-t border-white/5">
        <Compass className="h-5 w-5 text-[var(--color-accent)] animate-spin-slow" />
        <p className="font-serif text-sm text-white/65">Le tracce continuano con te.</p>
        <button
          onClick={() => scrollToStage(0)}
          className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowUp size={12} /> Torna su
        </button>
      </footer>
    </main>
  );
}
