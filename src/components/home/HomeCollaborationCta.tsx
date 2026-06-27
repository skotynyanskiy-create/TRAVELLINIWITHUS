import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import PartnerLogosStrip from './PartnerLogosStrip';
import Button from '../Button';
import OptimizedImage from '../OptimizedImage';

const COLLAB_IMG = '/images/brand/collab-work.webp';

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
        clearProps: 'all',
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
    <section ref={sectionRef} className="bg-[var(--color-ink-deep)] py-16 text-white md:py-20">
      <PartnerLogosStrip />
      <div className="mx-auto mt-12 max-w-7xl px-6 md:mt-16 md:px-12">
        <div className="group/card grid gap-10 overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] transition-all duration-500 hover:border-white/16 hover:shadow-[var(--shadow-xl)] lg:grid-cols-[0.9fr_1.1fr]">
          <div
            data-collab-image
            className="relative min-h-[280px] overflow-hidden rounded-t-[var(--radius-lg)] [clip-path:inset(0_0_0_0)] lg:min-h-[480px] lg:rounded-l-[var(--radius-lg)] lg:rounded-tr-none"
          >
            <OptimizedImage
              src={COLLAB_IMG}
              alt="Travelliniwithus al lavoro su una collaborazione editoriale"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/card:scale-103"
              responsiveWidths={[320, 480, 768]}
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--color-ink-deep)]/20 lg:bg-gradient-to-l lg:from-[var(--color-ink-deep)]/40" />
          </div>

          <div
            data-collab-content
            className="flex flex-col justify-center gap-5 p-8 md:p-12 lg:p-14"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Per hotel, destinazioni, brand travel & lifestyle
            </span>
            <h2 className="text-display-2 max-w-3xl">
              Hai un luogo, un hotel o un progetto che merita un racconto fatto bene?
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Lavoriamo con realtà travel, hospitality e lifestyle quando c&apos;è allineamento
              reale tra progetto, pubblico e libertà editoriale.
            </p>

            <div className="mt-2 flex flex-col gap-3.5 sm:flex-row">
              <Button
                to="/collaborazioni"
                variant="cta"
                size="md"
                magnetic
                trackingId="collab_cta_lavora_con_noi"
                className="group/btn h-12 rounded-full px-6 shadow-[var(--shadow-md)]"
              >
                <span className="text-xs font-bold uppercase tracking-widest">Lavora con noi</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/btn:translate-x-1"
                />
              </Button>

              <Button
                to="/media-kit"
                variant="outline-light"
                size="md"
                magnetic
                trackingId="collab_cta_media_kit"
                className="h-12 rounded-full px-6"
              >
                <span className="text-xs font-bold uppercase tracking-widest">
                  Richiedi il media kit
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
