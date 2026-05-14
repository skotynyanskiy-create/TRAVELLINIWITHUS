import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const COLLAB_IMG = '/images/brand/collab-work.png';

gsap.registerPlugin(ScrollTrigger);

export default function HomeCollaborationCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = sectionRef.current;
      if (!root) return;

      gsap.from('[data-collab-image]', {
        clipPath: 'inset(8% 8% 8% 8%)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('[data-collab-content] > *', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="bg-[var(--color-ink)] py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-10 overflow-hidden rounded-[var(--radius-md)] border border-white/10 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            data-collab-image
            className="relative min-h-[280px] overflow-hidden lg:min-h-[480px]"
            style={{ clipPath: 'inset(0 0 0 0)' }}
          >
            <img
              src={COLLAB_IMG}
              alt="Travelliniwithus al lavoro su una collaborazione editoriale"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--color-ink)]/20 lg:bg-gradient-to-l lg:from-[var(--color-ink)]/40" />
          </div>

          <div
            data-collab-content
            className="flex flex-col justify-center gap-5 p-8 md:p-12 lg:p-14"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Collaborazioni
            </span>
            <h2
              className="max-w-3xl font-serif leading-[1.05] tracking-tight"
              style={{ fontSize: 'var(--text-display-2, clamp(2.25rem, 4vw + 1rem, 4rem))' }}
            >
              Hai un luogo, un hotel o un progetto che merita un racconto fatto bene?
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Lavoriamo con realtà travel, hospitality e lifestyle quando c’è allineamento reale tra
              progetto, pubblico e libertà editoriale.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/collaborazioni"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
              >
                Scopri le collaborazioni <ArrowRight size={14} />
              </Link>
              <Link
                to="/media-kit"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/18 px-6 text-xs font-bold uppercase tracking-widest text-white/76 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Richiedi il media kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
