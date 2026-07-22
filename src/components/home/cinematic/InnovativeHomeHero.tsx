import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Sun, Moon, CloudSun, Leaf } from 'lucide-react';
import Button from '@/src/components/Button';
import OptimizedImage from '@/src/components/OptimizedImage';

export type MoodSeason = 'tramonto' | 'alba' | 'notte' | 'autunno';

interface MoodPreset {
  id: MoodSeason;
  label: string;
  icon: typeof Sun;
  bgImage: string;
  tagline: string;
  accentColor: string;
}

const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'tramonto',
    label: 'Tramonto in Costiera',
    icon: Sun,
    bgImage: '/images/reels/reel-3-cover.webp',
    tagline: 'Luce dorata, calici al tramonto e borghi sul mare',
    accentColor: '#c85a32',
  },
  {
    id: 'alba',
    label: 'Alba nel Borgo',
    icon: CloudSun,
    bgImage: '/images/reels/reel-2-cover.webp',
    tagline: 'Voli di rondini, strade di pietra e il primo caffè',
    accentColor: '#d4af37',
  },
  {
    id: 'notte',
    label: 'Notte Stellata',
    icon: Moon,
    bgImage: '/images/reels/reel-4-cover.webp',
    tagline: 'Hotel da sogno, cieli aperti e totale tranquillità',
    accentColor: '#3b82f6',
  },
  {
    id: 'autunno',
    label: 'Autunno nel Chianti',
    icon: Leaf,
    bgImage: '/images/reels/reel-5-cover.webp',
    tagline: 'Colline rosse, camino acceso e trattorie segrete',
    accentColor: '#b45309',
  },
];

export default function InnovativeHomeHero() {
  const [activeMood, setActiveMood] = useState<MoodSeason>('tramonto');
  const current = MOOD_PRESETS.find((m) => m.id === activeMood) ?? MOOD_PRESETS[0];

  return (
    <section className="relative w-full min-h-[85svh] overflow-hidden bg-[var(--color-ink-deep,#0b0805)] text-white">
      {/* Background Image Layer with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full w-full"
          >
            <OptimizedImage
              src={current.bgImage}
              alt={current.label}
              priority
              className="h-full w-full object-cover brightness-[0.7] contrast-[1.05]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Editorial Scrim Overlay */}
        <div className="twu-hero-scrim pointer-events-none absolute inset-0 z-[5]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex min-h-[85svh] max-w-7xl flex-col justify-between px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-36">
        {/* Top Badge */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)] backdrop-blur-md">
            <Sparkles size={14} className="text-[var(--color-accent)]" />
            Atlante Vivo · Rodrigo &amp; Betta
          </span>
        </div>

        {/* Center Main Headline & Tagline */}
        <div className="my-auto max-w-3xl py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-serif text-4xl font-normal leading-[1.08] text-[var(--color-sand)] sm:text-6xl lg:text-7xl">
                Posti particolari che valgono davvero.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
                {current.tagline}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="cta"
              size="lg"
              to="/esplora"
              magnetic
              trackingId="innovative_hero_esplora"
            >
              <Compass size={18} className="mr-2" />
              Esplora l'Atlante
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              to="/chi-siamo"
              trackingId="innovative_hero_chisiamo"
            >
              La nostra promessa
            </Button>
          </div>
        </div>

        {/* Bottom Interactive Season/Mood Switcher Bar */}
        <div className="border-t border-white/15 pt-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.26em] text-white/50">
            Seleziona il mood dell'esperienza:
          </p>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {MOOD_PRESETS.map((preset) => {
              const IconComponent = preset.icon;
              const isActive = preset.id === activeMood;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActiveMood(preset.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-[var(--color-ink)] shadow-lg scale-105'
                      : 'border border-white/20 bg-black/40 text-white/80 hover:border-white/40 hover:bg-black/60'
                  }`}
                >
                  <IconComponent
                    size={14}
                    style={{ color: isActive ? preset.accentColor : undefined }}
                  />
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
