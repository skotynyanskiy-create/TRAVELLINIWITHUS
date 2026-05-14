import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BadgeCheck, Camera, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const COUPLE_IMG = '/images/brand/about-editorial.png';

const METHOD_STANDARDS = [
  {
    icon: MapPinned,
    title: 'Provato sul posto',
    text: 'Atmosfera, zona, logistica e tempi filtrati da chi c’è stato davvero.',
  },
  {
    icon: Camera,
    title: 'Immagini e dettagli reali',
    text: 'Foto e note utili per capire cosa aspettarti, non per venderti un sogno generico.',
  },
  {
    icon: BadgeCheck,
    title: 'Consigli che aiutano a decidere',
    text: 'Non liste infinite, ma informazioni abbastanza chiare da farti scegliere meglio.',
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function CoupleIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = sectionRef.current;
      if (!root) return;

      gsap.from('[data-couple-image]', {
        yPercent: 8,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
        },
      });

      gsap.set('[data-couple-line]', { yPercent: 110, opacity: 0 });
      gsap.to('[data-couple-line]', {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '[data-couple-heading]',
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('[data-couple-card]', {
        y: 28,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '[data-couple-cards]',
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="bg-[var(--color-sand)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="relative lg:col-span-7">
            <div
              data-couple-image
              className="aspect-[3/2] overflow-hidden rounded-[var(--radius-md)] shadow-[0_30px_70px_-20px_rgba(17,17,17,0.25)] lg:aspect-[5/6]"
            >
              <img
                src={COUPLE_IMG}
                alt="Rodrigo e Betta — Travelliniwithus"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg border border-[var(--color-accent)]/20 bg-white/90 px-4 py-3 backdrop-blur-sm">
              <div className="font-script text-xl text-[var(--color-accent)]">
                Rodrigo &amp; Betta
              </div>
              <div className="text-[10px] uppercase tracking-widest text-black/50">
                Il metodo Travelliniwithus
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Il metodo
            </span>
            <h2
              data-couple-heading
              className="mt-3 max-w-2xl font-serif leading-[1.02] tracking-tight text-ink"
              style={{ fontSize: 'var(--text-display-2, clamp(2.25rem, 4vw + 1rem, 4rem))' }}
            >
              <span className="sr-only">
                Andiamo, proviamo, raccontiamo. Solo dopo consigliamo.
              </span>
              <span aria-hidden="true" className="block overflow-hidden">
                <span data-couple-line className="block">
                  Andiamo, proviamo, raccontiamo.
                </span>
              </span>
              <span aria-hidden="true" className="block overflow-hidden">
                <span data-couple-line className="block text-[var(--color-accent)]">
                  Solo dopo consigliamo.
                </span>
              </span>
            </h2>
            <p className="drop-cap mt-6 max-w-2xl text-base leading-relaxed text-black/70 md:text-lg">
              Travelliniwithus non nasce per mostrare più posti possibile. Nasce per selezionare
              quelli che meritano davvero, con un racconto abbastanza concreto da aiutarti a
              decidere.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
              Rodrigo e Betta tengono insieme sguardo personale, immagini, ricerca e dettagli
              pratici: è questo che rende il progetto utile sia per chi legge sia per i partner
              giusti.
            </p>

            <div data-couple-cards className="mt-8 grid gap-3 md:grid-cols-3">
              {METHOD_STANDARDS.map((standard) => {
                const Icon = standard.icon;
                return (
                  <div
                    key={standard.title}
                    data-couple-card
                    className="rounded-xl border border-black/8 bg-white/70 p-4 backdrop-blur-sm"
                  >
                    <Icon size={18} className="text-[var(--color-accent)]" />
                    <h3 className="mt-3 text-sm font-bold text-ink">{standard.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-black/55">{standard.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border-t border-black/8 pt-6">
              <p className="max-w-2xl text-xs font-bold uppercase tracking-[0.22em] text-black/65">
                Meno rumore, più criterio. Meno lista, più esperienza vera.
              </p>
            </div>

            <Link
              to="/chi-siamo"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:text-[var(--color-accent)]"
            >
              Come lavoriamo davvero <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
