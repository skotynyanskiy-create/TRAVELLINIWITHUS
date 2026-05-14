import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_EXPERIENCE_TYPES } from '../../config/experienceContent';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ExperienceCard } from './discoveryCards';

gsap.registerPlugin(ScrollTrigger);

export default function DiscoveryExperiences() {
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
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Esplora per esperienza
            </span>
            <h2 className="mt-1 text-3xl font-serif leading-tight text-ink md:text-5xl">
              Scegli il ritmo del viaggio.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/62 md:text-base">
              Filtri per stile, non per categoria: posti particolari, food, hotel con carattere,
              weekend romantici, borghi.
            </p>
          </div>
          <Link
            to="/esperienze"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:text-[var(--color-accent)]"
          >
            Apri tutte le esperienze <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {HOME_EXPERIENCE_TYPES.map((type) => (
            <ExperienceCard key={type} type={type} />
          ))}
        </div>
      </div>
    </section>
  );
}
