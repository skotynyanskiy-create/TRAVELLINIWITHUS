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
    title: 'Provati sul posto',
    text: '150+ destinazioni esplorate in 8 anni — niente recensione scritta da scrivania.',
  },
  {
    icon: Camera,
    title: 'Foto reali, non stock',
    text: 'Ogni articolo usa scatti nostri: luce, prospettiva, dettagli che riconosci sul posto.',
  },
  {
    icon: BadgeCheck,
    title: 'Zero marketing forzato',
    text: 'Quando un partner non e coerente, non lo accettiamo. La linea editoriale resta nostra.',
  },
];

const COUNTER_STATS = [
  { value: '167K+', label: 'Instagram' },
  { value: '90K+', label: 'TikTok' },
  { value: '8', label: 'Anni di viaggi' },
  { value: '150+', label: 'Destinazioni' },
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
        clearProps: 'all',
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
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/70 md:text-lg">
              Travelliniwithus non nasce per mostrare più posti possibile. Nasce per selezionare
              quelli che meritano davvero, con un racconto abbastanza concreto da aiutarti a
              decidere.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
              Rodrigo e Betta tengono insieme sguardo personale, immagini, ricerca e dettagli
              pratici: è questo che rende il progetto utile sia per chi legge sia per i partner
              giusti.
            </p>

            <dl className="mt-6 grid grid-cols-4 gap-x-4 gap-y-2 border-y border-black/8 py-5">
              {COUNTER_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-serif text-2xl text-[var(--color-ink)] md:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div data-couple-cards className="mt-7 grid gap-3 md:grid-cols-3">
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
