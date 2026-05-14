import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GUIDE_CATEGORIES } from '../../config/contentTaxonomy';
import { GUIDE_CATEGORY_VISUALS } from '../../config/guideContent';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GuideTile } from './discoveryCards';

gsap.registerPlugin(ScrollTrigger);

export default function DiscoveryGuides() {
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
        <div className="grid gap-6 lg:grid-cols-[0.76fr_1.44fr]">
          <div className="rounded-lg border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] p-7 md:p-9">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              <BookOpen size={13} />
              Guide di viaggio
            </div>
            <h2 className="mt-7 text-3xl font-serif leading-tight text-ink md:text-5xl">
              Pianifica con guide scritte a mano.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-black/62 md:text-base">
              Itinerari, consigli pratici, costi indicativi. Per prepararti prima di partire e
              orientarti durante.
            </p>
            <Link
              to="/guide"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Apri guide <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {GUIDE_CATEGORIES.slice(0, 6).map((cat) => (
              <GuideTile
                key={cat}
                category={cat}
                description={GUIDE_CATEGORY_VISUALS[cat].description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
