import { useRef } from 'react';
import { Link } from '@/src/components/TransitionLink';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedImage from '../OptimizedImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { HOMEPAGE_TYPES, HOMEPAGE_ZONES } from '../../config/discoveryPicks';
import { slugifyType } from '../../config/contentTaxonomy';
import { trackEvent } from '../../services/analytics';

gsap.registerPlugin(ScrollTrigger);

// Visual asset per le zone homepage. Asset locali in /public/images/destinations/.
const ZONE_VISUALS: Record<string, string> = {
  Italia: '/images/destinations/toscana.webp',
  Europa: '/images/destinations/dolomiti.webp',
  Asia: '/images/destinations/giappone.webp',
};

const TYPE_VISUALS: Record<string, string> = {
  'Posti particolari': '/images/experiences/insolito.webp',
  'Food & Ristoranti': '/images/experiences/gastronomia.webp',
  // hero-amalfi.webp è il nostro asset hotel-iconico (esisteva già a /images/);
  // sostituisce un path /images/destinations/amalfi.webp mai esistito.
  'Hotel con carattere': '/images/hero-amalfi.webp',
  'Weekend romantici': '/images/experiences/romantico.webp',
};

export default function HomeDiscoveryFinder() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = sectionRef.current;
      if (!root) return;
      ScrollTrigger.batch(root.querySelectorAll('[data-finder-reveal]'), {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
            clearProps: 'all',
          }),
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-surface-2)] py-16 md:py-24"
      aria-labelledby="home-discovery-heading"
    >
      <div className="mx-auto max-w-[82rem] px-6 md:px-10 xl:px-12">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl" data-finder-reveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Filtra l'archivio
            </span>
            <h2
              id="home-discovery-heading"
              className="mt-3 text-4xl font-serif leading-tight text-[var(--color-ink)] md:text-6xl"
            >
              Scegli il prossimo viaggio per luogo o per ritmo.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/62 md:text-lg">
              Parti da una zona che hai in mente oppure dal tipo di viaggio che vuoi vivere. Tutto
              porta alla stessa libreria curata da Rodrigo & Betta, con mappa e guide sempre a un
              passo.
            </p>
          </div>

          <Link
            to="/esplora"
            onClick={() =>
              trackEvent('home_discovery_click', {
                source_page: '/',
                destination_url: '/esplora',
                discovery_type: 'open_finder',
              })
            }
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full border border-black/10 px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            data-finder-reveal
          >
            Apri il finder <ArrowRight size={14} />
          </Link>
        </div>

        {/* 2 tessere image-led */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <Link
            to="/esplora?zone=Italia"
            onClick={() =>
              trackEvent('home_discovery_click', {
                source_page: '/',
                destination_url: '/esplora?zone=Italia',
                discovery_type: 'zone',
              })
            }
            className="group relative aspect-[3/2] overflow-hidden rounded-2xl border border-black/5 shadow-sm md:aspect-[16/10]"
            data-finder-reveal
          >
            <OptimizedImage
              src="/images/destinations/toscana.webp"
              alt="Parti dal posto che hai in mente"
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              responsiveWidths={[320, 480, 768]}
              sizes="(max-width: 768px) 92vw, 46vw"
            />
            <div className="twu-card-scrim absolute inset-0" />
            <div className="absolute inset-x-5 bottom-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/75">
                Per zona
              </span>
              <h3 className="mt-2 font-serif text-2xl leading-tight text-white md:text-3xl">
                Parti dal posto che hai in mente
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/85">
                Apri{' '}
                <ArrowRight
                  size={12}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>

          <Link
            to="/esplora?type=posti-particolari"
            onClick={() =>
              trackEvent('home_discovery_click', {
                source_page: '/',
                destination_url: '/esplora?type=posti-particolari',
                discovery_type: 'type',
              })
            }
            className="group relative aspect-[3/2] overflow-hidden rounded-2xl border border-black/5 shadow-sm md:aspect-[16/10]"
            data-finder-reveal
          >
            <OptimizedImage
              src="/images/experiences/romantico.webp"
              alt="Scegli il ritmo, poi la meta"
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="twu-card-scrim absolute inset-0" />
            <div className="absolute inset-x-5 bottom-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/75">
                Per intenzione
              </span>
              <h3 className="mt-2 font-serif text-2xl leading-tight text-white md:text-3xl">
                Scegli il ritmo, poi la meta
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/85">
                Apri{' '}
                <ArrowRight
                  size={12}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </div>

        {/* Picks zone + tipo (single source) */}
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div data-finder-reveal>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-black/45">
              Zone più amate
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {HOMEPAGE_ZONES.map((zone) => (
                <Link
                  key={zone}
                  to={`/esplora?zone=${encodeURIComponent(zone)}`}
                  onClick={() =>
                    trackEvent('home_discovery_click', {
                      source_page: '/',
                      destination_url: `/esplora?zone=${zone}`,
                      discovery_type: 'zone_pick',
                      filter_value: zone,
                    })
                  }
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 bg-[var(--color-muted-bg)] shadow-sm"
                >
                  <OptimizedImage
                    src={ZONE_VISUALS[zone] || '/images/destinations/toscana.webp'}
                    alt={`Posti particolari in ${zone}`}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    responsiveWidths={[320, 480, 768]}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 14vw"
                  />
                  <div className="twu-card-scrim-balanced absolute inset-0" />
                  <div className="absolute inset-x-4 bottom-4 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1">
                    <p className="font-serif text-xl leading-tight text-white">{zone}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/85">
                      Apri archivio{' '}
                      <ArrowRight
                        size={11}
                        className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div data-finder-reveal>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-black/45">
              Per intenzione di viaggio
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {HOMEPAGE_TYPES.map((type) => (
                <Link
                  key={type}
                  to={`/esplora?type=${slugifyType(type)}`}
                  onClick={() =>
                    trackEvent('home_discovery_click', {
                      source_page: '/',
                      destination_url: `/esplora?type=${slugifyType(type)}`,
                      discovery_type: 'type_pick',
                      filter_value: type,
                    })
                  }
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 bg-[var(--color-muted-bg)] shadow-sm"
                >
                  <OptimizedImage
                    src={TYPE_VISUALS[type] || '/images/experiences/insolito.webp'}
                    alt={type}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="twu-card-scrim-strong absolute inset-0" />
                  <div className="absolute inset-x-4 bottom-4 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1">
                    <p className="font-serif text-lg leading-tight text-white">{type}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/82">
                      Apri{' '}
                      <ArrowRight
                        size={11}
                        className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
