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
              Posti particolari, food, borghi e hotel con carattere.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/62 md:text-base">
              Filtra per stile: scegli cosa cerchi e l&apos;archivio si apre da lì.
            </p>
          </div>
          <Link
            to="/esperienze"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:text-[var(--color-accent)]"
          >
            Apri tutte le esperienze <ArrowRight size={13} />
          </Link>
        </div>

        {/*
          Bento grid asimmetrico (ref: Cereal, Apple feature pages):
          - Feature card (Posti particolari) span 2x2 in alto-sinistra
          - 4 card compatte 1x1 a destra
          - 1 card wide 4x1 in basso
          Stop al pattern uniform grid: l'asimmetria segnala "non e' un catalogo,
          e' una selezione editoriale". Su mobile resta 2-col semplice.
        */}
        <div className="grid grid-cols-2 gap-4 lg:auto-rows-[200px] lg:grid-cols-4">
          {HOME_EXPERIENCE_TYPES.map((type, idx) => {
            const isFeature = idx === 0;
            const isWide = idx === 5;
            const cls = isFeature
              ? 'lg:col-span-2 lg:row-span-2'
              : isWide
                ? 'lg:col-span-4'
                : 'lg:col-span-1';
            return <ExperienceCard key={type} type={type} className={cls} featured={isFeature} />;
          })}
        </div>
      </div>
    </section>
  );
}
