import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { MEDIA } from '../../config/mediaAssets';

const HERO_IMAGE = MEDIA.hero.primary;

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.045]);
  const heroOpacity = useTransform(heroScroll, [0, 0.82], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-ink px-6 pb-12 pt-32 text-white md:px-12 md:pb-16 md:pt-28 xl:min-h-[94svh]"
    >
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="h-full w-full object-cover object-center brightness-[0.96] saturate-[1.04]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(17,17,17,0.08)_0%,rgba(17,17,17,0.24)_34%,rgba(17,17,17,0.64)_100%)]" />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(17,17,17,0.78)_0%,rgba(17,17,17,0.46)_48%,rgba(17,17,17,0.2)_100%)]" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] sm:text-xs">
            Travel creator editoriali
          </span>

          <h1 className="mt-5 max-w-4xl text-5xl font-serif font-medium leading-[0.92] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl xl:text-[6.15rem]">
            Rodrigo & Betta, Travelliniwithus.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] md:text-xl">
            Posti particolari, guide utili, hotel provati e itinerari da salvare. Partiamo dalla
            Puglia slow, con borghi bianchi, masserie e tavole vere.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              to="/destinazioni/italia/puglia"
              variant="cta"
              size="lg"
              className="group h-14 min-w-[230px] rounded-lg shadow-[0_18px_44px_rgba(0,0,0,0.18)] sm:h-16"
            >
              <span className="text-sm font-bold uppercase tracking-widest">
                Inizia dalla Puglia
              </span>
              <ArrowRight
                size={20}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Button>

            <Link
              to="/collaborazioni"
              className="inline-flex h-14 min-w-[230px] items-center justify-center rounded-lg border border-white/24 bg-black/5 px-8 text-sm font-bold uppercase tracking-widest text-white/88 transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white sm:h-16"
            >
              Collabora con noi
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
