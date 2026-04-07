import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, BadgeCheck, Compass, MapPin, Sparkles, Trees } from 'lucide-react';
import Button from '../Button';
import { BRAND_STATS } from '../../config/site';

const HERO_IMAGE =
  '/hero-adventure.jpg';

const trustPills = [
  { icon: MapPin, label: 'Posti provati davvero' },
  { icon: Trees, label: 'Natura e avventura' },
  { icon: Sparkles, label: 'Niente fuffa' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.06]);
  const heroOpacity = useTransform(heroScroll, [0, 0.82], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink pt-28 pb-14 md:min-h-[96svh] md:items-center md:pb-18"
    >
      <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center brightness-[0.94] saturate-[1.05]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(17,17,17,0.18)_0%,rgba(17,17,17,0.28)_24%,rgba(17,17,17,0.52)_62%,rgba(17,17,17,0.82)_100%)]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(196,164,124,0.22),transparent_34%),linear-gradient(90deg,rgba(17,17,17,0.46)_0%,rgba(17,17,17,0.12)_48%,rgba(17,17,17,0.38)_100%)]" />
      <div className="absolute inset-0 z-[1] opacity-15 bg-topo" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 text-white md:px-8"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md shadow-lg">
            <BadgeCheck size={14} className="text-[var(--color-gold)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/88 sm:text-xs">
              Archivio editoriale di viaggio
            </span>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]/70" />
            <Compass size={16} className="text-[var(--color-gold)]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]/70" />
          </div>

          <h1 className="max-w-4xl text-5xl font-serif font-medium leading-[0.92] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl lg:text-[6rem]">
            Posti particolari
            <br />
            <span className="font-script text-[0.6em] text-white/95">tra avventura e natura.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] sm:text-lg md:text-xl">
            Luoghi che lasciano qualcosa, itinerari costruiti sul vissuto e consigli pensati per
            farti partire meglio, non solo sognare meglio.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              to="/destinazioni"
              variant="cta"
              size="lg"
              className="group h-14 min-w-[240px] rounded-full shadow-[0_0_30px_rgba(196,164,124,0.28)] sm:h-16 sm:min-w-[260px]"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Scopri i posti</span>
              <ArrowRight
                size={20}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Button>
            <Button
              to="/guide"
              variant="outline-light"
              size="lg"
              className="h-14 min-w-[240px] rounded-full bg-black/15 sm:h-16 sm:min-w-[260px]"
            >
              <span className="text-sm font-bold uppercase tracking-widest">Leggi le guide</span>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {trustPills.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-4 py-2.5 backdrop-blur-md"
              >
                <item.icon size={14} className="text-[var(--color-gold)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/82">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid grid-cols-1 gap-3 md:max-w-4xl md:grid-cols-3"
        >
          <div className="rounded-[1.75rem] border border-white/12 bg-black/25 px-5 py-4 backdrop-blur-xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
              Community
            </div>
            <div className="mt-1 text-2xl font-serif text-white">{BRAND_STATS.totalFollowers}</div>
            <div className="text-sm text-white/72">tra Instagram e TikTok</div>
          </div>
          <div className="rounded-[1.75rem] border border-white/12 bg-black/25 px-5 py-4 backdrop-blur-xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
              Esperienza
            </div>
            <div className="mt-1 text-2xl font-serif text-white">{BRAND_STATS.yearsOfTravel} anni</div>
            <div className="text-sm text-white/72">di viaggi raccontati sul serio</div>
          </div>
          <div className="rounded-[1.75rem] border border-white/12 bg-black/25 px-5 py-4 backdrop-blur-xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
              Archivio
            </div>
            <div className="mt-1 text-2xl font-serif text-white">
              {BRAND_STATS.destinationsExplored}
            </div>
            <div className="text-sm text-white/72">destinazioni gia esplorate</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
          Scorri
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-6 justify-center rounded-full border border-white/28 pt-2"
        >
          <div className="h-2 w-0.5 rounded-full bg-white/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
