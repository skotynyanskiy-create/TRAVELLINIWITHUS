import { lazy, Suspense, useRef } from 'react';
import { ArrowRight, Compass, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { useInViewOnce } from '@/src/hooks/useInViewOnce';

const HomeMapLibreBackground = lazy(() => import('./HomeMapLibreBackground'));

export default function HomeMapSection() {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapInView = useInViewOnce(mapHostRef, '280px 0px');

  return (
    <section className="relative border-b border-[var(--color-border,#e7e5e4)] bg-[var(--color-sand,#faf8f4)] py-24 text-[var(--color-ink,#0a0a0a)] md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="group relative flex min-h-[460px] items-center overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-ink-deep,#111111)] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-[var(--color-accent-on-dark,#e8834e)]/40 md:p-16">
          <div ref={mapHostRef} className="absolute inset-0 z-0 overflow-hidden">
            {mapInView ? (
              <Suspense
                fallback={<div className="h-full w-full bg-[var(--color-ink-deep,#111111)]" />}
              >
                <HomeMapLibreBackground />
              </Suspense>
            ) : (
              <div
                className="h-full w-full bg-[var(--color-ink-deep,#111111)]"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="relative z-10 grid w-full items-center justify-between gap-10 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-on-dark,#e8834e)]/30 bg-[var(--color-accent)]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.26em] text-[var(--color-accent-on-dark,#e8834e)] backdrop-blur-md">
                <Sparkles size={14} className="text-[var(--color-accent-on-dark,#e8834e)]" />
                Dove cercare
              </span>

              <h2 className="mt-5 font-serif text-3xl font-normal leading-tight text-white md:text-5xl lg:text-6xl">
                Trovali sulla mappa, <br />
                <span className="font-serif italic text-[var(--color-accent-on-dark,#e8834e)]">
                  prima di partire.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-[var(--color-sand)]/90 md:text-lg">
                Niente consigli presi online o per sentito dire. Su questa mappa trovi solo i posti
                in cui siamo stati davvero, con le nostre foto e la nostra opinione sincera.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs font-medium text-[var(--color-sand)]/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--color-accent-on-dark,#e8834e)]" />
                  <span>Coordinate GPS Esatte</span>
                </div>
                <span className="text-white/20">·</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[var(--color-accent-on-dark,#e8834e)]" />
                  <span>Posti provati di persona</span>
                </div>
                <span className="text-white/20">·</span>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[var(--color-accent-on-dark,#e8834e)]" />
                  <span>Costi e collaborazioni dichiarate</span>
                </div>
              </div>
            </div>

            <div className="flex items-center md:justify-end">
              <Link
                to="/mappa"
                className="inline-flex items-center gap-3.5 whitespace-nowrap rounded-full bg-[var(--color-accent,#c2410c)] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-[0_0_35px_rgba(194,65,12,0.4)] transition-all duration-300 hover:scale-105 hover:brightness-95 md:px-9 md:py-5"
              >
                <Compass size={20} />
                Apri la Mappa Interattiva
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
