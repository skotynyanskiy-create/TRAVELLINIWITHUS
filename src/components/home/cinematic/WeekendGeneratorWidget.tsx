import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Sparkles, Compass, ArrowRight } from 'lucide-react';
import Button from '@/src/components/Button';
import OptimizedImage from '@/src/components/OptimizedImage';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

export interface WeekendIdea {
  id: string;
  title: string;
  location: string;
  vibe: 'romantico' | 'relax' | 'avventura';
  zone: 'italia' | 'europa' | 'mondo';
  vibeLabel: string;
  costEstimate: string;
  duration: string;
  description: string;
  coverImage: string;
  link: string;
}

/** Solo ispirazioni legate a schede seed reali — non è un algoritmo. */
const IDEAS: WeekendIdea[] = [
  {
    id: 'volterra',
    title: 'Aperitivo gotico a Volterra',
    location: 'Volterra, Toscana',
    vibe: 'romantico',
    zone: 'italia',
    vibeLabel: 'Romantico & misterioso',
    costEstimate: 'Aperitivo + borgo',
    duration: 'Weekend',
    description:
      'Drink scenografici e atmosfera da borgo medievale. Ideale per una sera diversa in Toscana.',
    coverImage: '/images/reels/reel-5-cover.webp',
    link: '/posto/toscana-aperitivo-volterra',
  },
  {
    id: 'burton',
    title: 'Cena al The Burton Juice',
    location: 'Somma Vesuviana, Campania',
    vibe: 'avventura',
    zone: 'italia',
    vibeLabel: 'Esperienza insolita',
    costEstimate: 'Su prenotazione',
    duration: 'Una serata',
    description:
      'Sale a tema Tim Burton, attori e cocktail. Una cena-spettacolo alle porte di Napoli.',
    coverImage: '/images/home-journal/hero-impossible.webp',
    link: '/posto/campania-burton-juice',
  },
  {
    id: 'jesolo',
    title: 'Caraibi in Italia a Jesolo',
    location: 'Jesolo, Veneto',
    vibe: 'relax',
    zone: 'italia',
    vibeLabel: 'Mare & relax',
    costEstimate: 'Giornata / weekend',
    duration: '1–2 giorni',
    description: 'Acqua chiara e vibe estiva senza volo lungo. Per una fuga breve dal Nord Italia.',
    coverImage: '/images/reels/reel-1-cover.webp',
    link: '/posto/jesolo-caribe-bay',
  },
  {
    id: 'madrid',
    title: 'Storyland a Madrid',
    location: 'Madrid, Spagna',
    vibe: 'romantico',
    zone: 'europa',
    vibeLabel: 'City break',
    costEstimate: 'Biglietto + città',
    duration: 'Weekend',
    description:
      'Un locale immersivo a tema fiabe/Disney a Madrid: ideale per una serata speciale in città.',
    coverImage: '/images/reels/reel-3-cover.webp',
    link: '/posto/madrid-storyland-disney',
  },
  {
    id: 'batu',
    title: 'Batu Caves a Kuala Lumpur',
    location: 'Kuala Lumpur, Malesia',
    vibe: 'avventura',
    zone: 'mondo',
    vibeLabel: 'Posto particolare',
    costEstimate: 'Ingresso gratis',
    duration: 'Mezza giornata',
    description: 'Scalinata arcobaleno, templi e scimmie. Low cost e fotogenico: vale la pena?',
    coverImage: '/images/reels/reel-4-cover.webp',
    link: '/posto/malesia-batu-caves',
  },
  {
    id: 'egitto',
    title: 'Mar Rosso a Marsa Alam',
    location: 'Marsa Alam, Egitto',
    vibe: 'relax',
    zone: 'mondo',
    vibeLabel: 'Mare & snorkel',
    costEstimate: 'Resort low-mid',
    duration: '4–7 giorni',
    description:
      'Acqua trasparente e reef vicini al pontile. Resort economico con mare da cartolina.',
    coverImage: '/images/reels/reel-1-cover.webp',
    link: '/posto/egitto-marsa-alam-dream-lagoon',
  },
];

export default function WeekendGeneratorWidget() {
  const reducedMotion = useReducedMotion();
  const [selectedVibe, setSelectedVibe] = useState<WeekendIdea['vibe']>('romantico');
  const [selectedZone, setSelectedZone] = useState<WeekendIdea['zone']>('italia');
  const [generated, setGenerated] = useState<WeekendIdea>(IDEAS[0]);

  const match = useMemo(() => {
    const exact = IDEAS.find((i) => i.vibe === selectedVibe && i.zone === selectedZone);
    if (exact) return exact;
    return (
      IDEAS.find((i) => i.zone === selectedZone) ??
      IDEAS.find((i) => i.vibe === selectedVibe) ??
      IDEAS[0]
    );
  }, [selectedVibe, selectedZone]);

  const generateIdea = () => setGenerated(match);

  return (
    <section className="bg-[var(--color-sand,#faf7f2)] py-20 text-[var(--color-ink)] md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
            <Sparkles size={14} />
            Ispirazione weekend
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
            Un posto vero, in pochi click.
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted-fg)] md:text-lg">
            Non è un algoritmo magico: scegli atmosfera e zona, ti mostriamo un posto che abbiamo
            già mappato sul sito.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-[var(--color-surface,#ffffff)] p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <span
                id="weekend-vibe-label"
                className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                1. Che atmosfera cerchi?
              </span>
              <div
                className="grid grid-cols-3 gap-2.5"
                role="group"
                aria-labelledby="weekend-vibe-label"
              >
                {(
                  [
                    { id: 'romantico' as const, label: 'Romantica', icon: Heart },
                    { id: 'relax' as const, label: 'Relax', icon: Compass },
                    { id: 'avventura' as const, label: 'Insolita', icon: Sparkles },
                  ] as const
                ).map((vibe) => (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-semibold transition-all ${
                      selectedVibe === vibe.id
                        ? 'border-2 border-[var(--color-accent)] bg-[var(--color-sand)] text-[var(--color-ink)] shadow-sm'
                        : 'border border-[var(--color-border)] bg-white text-[var(--color-muted-fg)] hover:border-gray-300'
                    }`}
                  >
                    <vibe.icon
                      size={18}
                      className={selectedVibe === vibe.id ? 'text-[var(--color-accent)]' : ''}
                    />
                    {vibe.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <span
                id="weekend-zone-label"
                className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                2. Dove ti piacerebbe andare?
              </span>
              <div
                className="grid grid-cols-3 gap-2.5"
                role="group"
                aria-labelledby="weekend-zone-label"
              >
                {(
                  [
                    { id: 'italia' as const, label: 'Italia' },
                    { id: 'europa' as const, label: 'Europa' },
                    { id: 'mondo' as const, label: 'Mondo' },
                  ] as const
                ).map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`rounded-xl py-3 text-xs font-semibold transition-all ${
                      selectedZone === zone.id
                        ? 'border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-sm'
                        : 'border border-[var(--color-border)] bg-white text-[var(--color-muted-fg)] hover:border-gray-300'
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="cta"
              size="lg"
              onClick={generateIdea}
              className="w-full justify-center"
              trackingId="generate_weekend_click"
            >
              Mostra l&apos;idea
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {generated && (
              <motion.div
                key={generated.id}
                initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
              >
                <div className="relative w-full overflow-hidden rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white shadow-xl">
                  <div className="relative h-64 w-full overflow-hidden">
                    <OptimizedImage
                      src={generated.coverImage}
                      alt={generated.title}
                      sizes="(max-width: 1024px) 92vw, 48vw"
                      responsiveWidths={[320, 480, 768]}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      <MapPin size={12} className="text-[var(--color-accent)]" />
                      {generated.location}
                    </span>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                        {generated.vibeLabel}
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-muted-fg)]">
                        {generated.duration}
                      </span>
                    </div>

                    <h3 className="mt-2 font-serif text-2xl font-normal leading-snug">
                      {generated.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-fg)]">
                      {generated.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                          Indicazione
                        </span>
                        <span className="text-sm font-bold text-[var(--color-ink)]">
                          {generated.costEstimate}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        to={generated.link}
                        trackingId="view_weekend_detail"
                      >
                        Apri la scheda
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
