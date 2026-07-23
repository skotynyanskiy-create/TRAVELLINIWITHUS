import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import Button from '../Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import HeroBackdrop from './HeroBackdrop';

const HERO_IMAGE_DESKTOP = '/images/brand/couple-travel.webp';
const HERO_IMAGE_MOBILE = '/images/hero-amalfi.webp';
// videoSrc omitted finché public/videos/hero.webm non è disponibile (evita HEAD 404 in console)
const HERO_VIDEO: string | undefined = undefined;

// Righe visive del titolo: wrap dopo "particolari" (editoriale pulito, evita
// il pronome "che" orfano a fine riga).
const HERO_TITLE_LINES = ['Posti particolari', 'che valgono davvero.'] as const;
// Testo completo per aria-label (screen-reader legge il titolo per intero).
const HERO_TITLE_FULL = 'Posti particolari che valgono davvero.';

const PROOF_POINTS = [
  { label: 'Metodo', value: 'Provato sul posto', short: 'Provato sul posto' },
  { label: 'Focus', value: 'Coppie e viaggi reali', short: 'Coppie reali' },
  { label: 'Filtro', value: 'Criterio, non hype', short: 'Criterio' },
];

// Easing condiviso intro (cubic-bezier premium, ref ui-designer).
const INTRO_EASE = [0.87, 0, 0.13, 1] as const;

// introItem: usato per eyebrow/paragraph/CTA/proof (fade+slide piccolo).
const introItem = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: INTRO_EASE, delay } },
});

// titleLine: clip reveal puro (translateY senza opacity — LCP-safe).
// Il testo è dipinto subito, solo mascherato dall'overflow-hidden del wrapper.
const titleLine = (delay: number): Variants => ({
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.6, ease: INTRO_EASE, delay } },
});

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const animate = !reducedMotion;

  // Parallax scroll: l'immagine scala leggermente man mano che l'hero esce
  // dalla viewport (sostituisce lo scrub di ScrollTrigger, niente pin).
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[90svh] w-full items-center overflow-hidden bg-[var(--color-ink)] px-6 pb-14 pt-32 text-white md:items-end md:px-12 md:pb-20 md:pt-36 xl:min-h-[92svh]"
    >
      {/* L'immagine LCP deve essere visibile subito. Manteniamo solo il leggero
          parallax in scroll: niente wipe iniziale su clip-path. */}
      <motion.div
        data-hero-image-wrap
        className="absolute inset-0 z-0"
        style={animate ? { scale: imageScale } : undefined}
      >
        <HeroBackdrop
          imageDesktop={HERO_IMAGE_DESKTOP}
          imageMobile={HERO_IMAGE_MOBILE}
          videoSrc={HERO_VIDEO}
        />
      </motion.div>

      <div
        data-hero-overlay
        // Scrim responsive ammorbidito (ui-designer 10/10): verticale su mobile,
        // orizzontale su md+ con picco sinistro ridotto a 0.74 così la coppia a
        // destra resta leggibile invece di essere sepolta nel nero.
        className="twu-hero-scrim absolute inset-0 z-[1]"
      />

      {/* Micro-scrim dal basso: protegge solo la proof line senza scurire il
          centro dell'immagine. Attivo su tutti i breakpoint. */}
      <div
        aria-hidden
        className="twu-bottom-scrim pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3"
      />

      <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-[51rem]">
          <motion.span
            data-hero-eyebrow
            className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] drop-shadow sm:text-sm"
            variants={animate ? introItem(0.1) : undefined}
            initial={animate ? 'hidden' : false}
            animate={animate ? 'show' : false}
          >
            Rodrigo & Betta · dal 2018
          </motion.span>

          {/* D1: clip reveal per riga — il titolo è il momento d'ingresso.
              aria-label sull'h1 fornisce il testo completo per screen-reader.
              Niente opacity:0 → LCP-safe (il testo è dipinto, solo traslato
              fuori dal clip container). reducedMotion → h1 statico. */}
          <h1
            data-hero-title
            aria-label={HERO_TITLE_FULL}
            className="mt-5 max-w-[15ch] font-serif text-[clamp(2.75rem,5vw+1rem,6rem)] font-medium leading-[1.02] text-white [text-wrap:balance] lg:leading-[0.95]"
          >
            {animate
              ? HERO_TITLE_LINES.map((line, i) => (
                  <span key={line} className="block overflow-hidden">
                    <motion.span
                      aria-hidden
                      className="block"
                      variants={titleLine(0.15 + i * 0.1)}
                      initial="hidden"
                      animate="show"
                    >
                      {line}
                    </motion.span>
                  </span>
                ))
              : HERO_TITLE_FULL}
          </h1>

          <motion.p
            data-hero-paragraph
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/92 md:text-xl"
            variants={animate ? introItem(0.4) : undefined}
            initial={animate ? 'hidden' : false}
            animate={animate ? 'show' : false}
          >
            Guide pratiche per coppie che cercano posti veri: cosa vedere, dove fermarsi, cosa
            evitare e quando vale davvero la pena partire.
          </motion.p>

          <motion.div
            data-hero-cta
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            variants={animate ? introItem(0.48) : undefined}
            initial={animate ? 'hidden' : false}
            animate={animate ? 'show' : false}
          >
            <Button
              to="/esplora"
              variant="cta"
              size="lg"
              trackingId="home_hero_esplora"
              magnetic
              className="group h-14 min-w-[230px] rounded-lg shadow-[var(--shadow-lg)] sm:h-16"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Apri Esplora</span>
              <ArrowRight
                size={20}
                className="ml-2 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5"
              />
            </Button>

            {/* Secondaria come link ghost (no min-w, no border): la primaria
                accent resta visibilmente l'azione dominante. Solo da sm+. */}
            <Link
              to="/#storie"
              data-tracking-id="home_hero_storie"
              className="group hidden h-14 items-center justify-center gap-2 px-2 text-sm font-bold uppercase tracking-widest text-white/82 transition-colors duration-300 hover:text-white sm:inline-flex sm:h-16"
            >
              <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-white/70 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                Ultime guide
              </span>
              <ArrowRight
                size={18}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>

            {/* Via di fuga mobile: micro-link testuale sotto la primaria. */}
            <Link
              to="/#storie"
              data-tracking-id="home_hero_storie_mobile"
              className="inline-flex items-center gap-1.5 text-sm text-white/72 underline underline-offset-4 transition-colors hover:text-white sm:hidden"
            >
              Oppure leggi le ultime guide
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            data-hero-proof
            className="mt-8 max-w-2xl"
            variants={animate ? introItem(0.56) : undefined}
            initial={animate ? 'hidden' : false}
            animate={animate ? 'show' : false}
          >
            {/* Mobile: riga inline ·-separata, value-first, sempre visibile. */}
            <div className="flex flex-wrap items-center gap-2 border-t border-white/14 pt-4 text-xs font-semibold text-white/82 sm:hidden">
              {PROOF_POINTS.map((point, index) => (
                <span key={point.label} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden className="text-white/35">
                      ·
                    </span>
                  )}
                  {point.short}
                </span>
              ))}
            </div>

            {/* Desktop: griglia 3 colonne, value-first (il dato è forte, la
                label è l'occhiello). */}
            <div className="hidden gap-4 border-t border-white/14 pt-5 sm:grid sm:grid-cols-3">
              {PROOF_POINTS.map((point) => (
                <div key={point.label}>
                  <p className="text-sm font-semibold text-white/90 sm:text-base">{point.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
                    {point.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
