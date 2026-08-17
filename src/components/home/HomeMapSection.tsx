import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowRight, Compass, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { useInViewOnce } from '@/src/hooks/useInViewOnce';
import { canLoad, getConsent, onConsentChange, setConsent } from '@/src/lib/consent';

const HomeMapLibreBackground = lazy(() => import('./HomeMapLibreBackground'));

export default function HomeMapSection() {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapInView = useInViewOnce(mapHostRef, '280px 0px');
  // La mappa carica le tessere da tiles.openfreemap.org, che riceve l'IP di
  // chi guarda: parte solo col consenso marketing, come i pixel Meta/TikTok
  // che già usano questa categoria in services/analytics.ts.
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
    <section className="relative border-b border-[var(--color-border,#e7e5e4)] bg-[var(--color-sand,#faf8f4)] py-24 text-[var(--color-ink,#0a0a0a)] md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="group relative flex min-h-[460px] items-center overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-ink-deep,#111111)] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-[var(--color-accent-on-dark,#e8834e)]/40 md:p-16">
          <div ref={mapHostRef} className="absolute inset-0 z-0 overflow-hidden">
            {mapConsentGranted && mapInView ? (
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

          {/* `justify-between` valeva a ogni larghezza, ma sotto md la griglia
              ha una sola colonna implicita: con `justify-content: space-between`
              quella traccia resta larga quanto il contenuto invece di seguire il
              contenitore. Su 375px il titolo diventava 348px dentro 263 e
              l'`overflow-hidden` della card ne tagliava via 54 — «Trovali sulla
              mapp». Il vincolo serve solo dove esistono due colonne. */}
          <div className="relative z-10 grid w-full items-center gap-10 md:grid-cols-[1fr_auto] md:justify-between">
            <div className="min-w-0 max-w-2xl">
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
                Sulla mappa ci sono solo posti in cui siamo stati: dove sono esattamente, quanto
                costano quando lo sappiamo, e a che titolo ci siamo andati.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs font-medium text-[var(--color-sand)]/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--color-accent-on-dark,#e8834e)]" />
                  <span>Coordinate GPS esatte</span>
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

              {/* Senza consenso marketing l'anteprima resta ferma: la mappa
                  carica tessere da un servizio esterno che riceve l'IP di chi
                  guarda, e non deve partire dopo un "rifiuta tutto". */}
              {!mapConsentGranted && (
                <p className="mt-4 max-w-xl text-xs leading-relaxed text-[var(--color-sand)]/70">
                  L&apos;anteprima è ferma: la mappa carica le tessere da un servizio esterno e
                  parte solo con il consenso ai cookie di marketing.{' '}
                  <button
                    type="button"
                    onClick={activateMap}
                    className="py-1 font-semibold text-[var(--color-accent-on-dark,#e8834e)] underline underline-offset-2 hover:text-white cursor-pointer"
                  >
                    Attivala
                  </button>
                </p>
              )}
            </div>

            {/* Anche la CTA sforava: `whitespace-nowrap` su «Apri la Mappa
                Interattiva» piu' due icone chiedeva piu' larghezza di quanta la
                card ne avesse su telefono, e la freccia finiva oltre il taglio.
                Su mobile ora occupa tutta la riga — come le CTA del menu — e
                l'etichetta dice il verbo e basta. */}
            <div className="flex items-center md:justify-end">
              <Link
                to="/mappa"
                className="inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[var(--color-accent,#c2410c)] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-[0_0_35px_rgba(194,65,12,0.4)] transition-all duration-300 hover:scale-105 hover:brightness-95 md:w-auto md:gap-3.5 md:px-9 md:py-5"
              >
                <Compass size={20} />
                Apri la mappa
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
