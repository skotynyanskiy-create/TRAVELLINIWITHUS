import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DESTINATION_GROUPS } from '../../config/contentTaxonomy';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { DestinationFeature, DestinationTile } from './discoveryCards';

gsap.registerPlugin(ScrollTrigger);

export default function DiscoveryDestinations() {
  const [featured, ...secondary] = DESTINATION_GROUPS;
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = sectionRef.current;
      if (!root) return;
      ScrollTrigger.batch(root.querySelectorAll('[data-discovery-reveal]'), {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            opacity: 0,
            y: 32,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.08,
            clearProps: 'all',
          }),
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="bg-[var(--color-surface-2)] py-16 md:py-20">
      <div className="mx-auto max-w-[82rem] px-6 md:px-10 xl:px-12">
        <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Esplora per luogo
            </span>
            <h2 className="mt-3 text-4xl font-serif leading-tight text-ink md:text-6xl">
              Trova il prossimo posto da salvare.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/62 md:text-lg">
              Parti da una zona, da un continente, da un&apos;idea precisa. L&apos;archivio si apre
              da qui.
            </p>
          </div>

          <Link
            to="/destinazioni?search="
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg border border-black/10 px-5 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Search size={14} />
            Cerca nell&apos;archivio
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <DestinationFeature group={featured} />
          {/*
            Mobile: horizontal scroll-snap (ergonomia pollice destro,
            ref: Airbnb/Booking mobile categories). Su lg torna a grid.
            scroll-snap-mandatory garantisce stop pulito su ogni tile.
          */}
          <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-5 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {secondary.map((group, index) => (
              <DestinationTile
                key={group}
                group={group}
                className={`shrink-0 basis-[68%] snap-start sm:basis-[42%] lg:basis-auto lg:shrink ${
                  index < 2 ? 'lg:col-span-3' : 'lg:col-span-2 lg:min-h-[238px]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
