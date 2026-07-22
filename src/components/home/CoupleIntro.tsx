import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BadgeCheck, Camera, MapPinned } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import OptimizedImage from '../OptimizedImage';
import RevealHeading from '../RevealHeading';

const COUPLE_IMG = '/images/brand/about-editorial.webp';

/** Polaroid scatter con asset locali controllati, in attesa degli scatti R+B finali. */
interface CouplePolaroid {
  image: string;
  alt: string;
  caption: string;
  /** Rotazione iniziale come classe Tailwind. */
  rotateClass: string;
  /** Posizione absolute classi Tailwind. */
  position: string;
}

const POLAROIDS: CouplePolaroid[] = [
  {
    image: '/images/brand/couple-travel.webp',
    alt: 'Rodrigo e Betta in viaggio',
    caption: 'In viaggio',
    rotateClass: 'rotate-[-8deg]',
    position: '-top-6 -left-10 z-10',
  },
  {
    image: '/images/brand/about-editorial.webp',
    alt: 'Rodrigo e Betta durante una selezione editoriale',
    caption: 'Sul posto',
    rotateClass: 'rotate-[5deg]',
    position: 'top-1/3 -right-8 z-10',
  },
  {
    image: '/images/brand/collab-work.webp',
    alt: 'Travelliniwithus al lavoro su contenuti travel',
    caption: 'Metodo',
    rotateClass: 'rotate-[-4deg]',
    position: '-bottom-10 left-1/3 z-10',
  },
];

const METHOD_STANDARDS = [
  {
    icon: MapPinned,
    title: 'Provati sul posto',
    text: '150+ destinazioni esplorate in 8 anni — niente recensione scritta da scrivania.',
  },
  {
    icon: Camera,
    title: 'Immagini al servizio del luogo',
    text: 'Le foto devono aiutare a capire atmosfera, scala e dettagli, non solo riempire la pagina.',
  },
  {
    icon: BadgeCheck,
    title: 'Zero marketing forzato',
    text: 'Quando un partner non è coerente, non lo accettiamo. La linea editoriale resta nostra.',
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

      // Il reveal delle righe-titolo NON usa più GSAP: l'heading vive in un
      // contenitore lg:sticky e ScrollTrigger calcola male lo start (titolo
      // che resta nascosto per sempre). Ora è RevealHeading (motion/react),
      // lo stesso gesto-firma del resto del sito.

      // Polaroid scatter: entry fan-out con stagger e rotazione finale.
      // Inizialmente "tutte vicine al centro" (translate 0, rotate 0),
      // animate alle posizioni absolute finali via rotation finale.
      gsap.from('[data-couple-polaroid]', {
        opacity: 0,
        scale: 0.6,
        rotate: 0,
        y: 60,
        x: (idx) => (idx === 1 ? -40 : 40),
        duration: 0.9,
        ease: 'back.out(1.3)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '[data-couple-image]',
          start: 'top 70%',
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
              className="aspect-[3/2] overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] lg:aspect-[5/6]"
            >
              <OptimizedImage
                src={COUPLE_IMG}
                alt="Rodrigo e Betta — Travelliniwithus"
                className="h-full w-full object-cover"
                responsiveWidths={[320, 480, 768]}
                sizes="(max-width: 1024px) 92vw, 54vw"
              />
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg border border-[var(--color-accent)]/20 bg-white/90 px-4 py-3 backdrop-blur-sm">
              <div className="font-script text-xl text-[var(--color-accent)]">
                Rodrigo &amp; Betta
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--color-muted-fg)]">
                8 anni, 150+ destinazioni, niente scrivania
              </div>
            </div>

            {/*
              Polaroid scatter: 3 momenti scattered intorno alla foto
              principale. Solo lg+ per non clutter su mobile.
              Effetto entry: fan-out con rotation + scale via GSAP.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              {POLAROIDS.map((p, idx) => (
                <div
                  key={idx}
                  data-couple-polaroid
                  className={`absolute ${p.position} ${p.rotateClass} w-40 rounded-[2px] bg-white p-2 pb-4 shadow-[var(--shadow-lg)]`}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[var(--color-muted-bg)]">
                    <OptimizedImage
                      src={p.image}
                      alt={p.alt}
                      className="h-full w-full object-cover"
                      responsiveWidths={[320, 480]}
                      sizes="160px"
                    />
                  </div>
                  <div className="mt-2 px-1 text-center font-serif italic text-xs leading-none text-[var(--color-ink-2)]">
                    {p.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Chi siamo
            </span>
            <RevealHeading
              className="text-display-2 mt-3 max-w-2xl text-ink"
              lines={[
                'Andiamo, proviamo, raccontiamo.',
                <span key="accent" className="text-[var(--color-accent)]">
                  Solo dopo consigliamo.
                </span>,
              ]}
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
              Travelliniwithus non nasce come catalogo turistico o elenco di attrazioni. Esiste per
              selezionare i luoghi che hanno un'anima reale e raccontarli con la cura e i dettagli
              pratici di cui hai bisogno prima di partire in coppia.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-muted-fg)] md:text-lg">
              Otto anni di viaggi insieme ci hanno insegnato a unire lo sguardo editoriale con foto
              oneste e informazioni reali. Perché un viaggio riuscito non si misura in chilometri,
              ma nella scelta del posto giusto al momento giusto.
            </p>

            <div data-couple-cards className="mt-7 grid gap-3 md:grid-cols-3">
              {METHOD_STANDARDS.map((standard) => {
                const Icon = standard.icon;
                return (
                  <div
                    key={standard.title}
                    data-couple-card
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/20"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-ink">{standard.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-fg)]">
                      {standard.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              to="/chi-siamo"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:text-[var(--color-accent)]"
            >
              Come lavoriamo davvero{' '}
              <ArrowRight
                size={14}
                className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
