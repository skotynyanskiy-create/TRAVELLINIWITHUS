import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Sparkles, Compass, ArrowRight } from 'lucide-react';
import TiltCard from '@/src/components/TiltCard';
import Button from '@/src/components/Button';

export interface WeekendIdea {
  title: string;
  location: string;
  zone: string;
  vibe: string;
  costEstimate: string;
  duration: string;
  description: string;
  coverImage: string;
  link: string;
}

const IDEAS_DATABASE: Record<string, WeekendIdea> = {
  romantico_toscana: {
    title: 'La Taverna dei Draghi & Notti nel Borgo',
    location: 'Volterra, Toscana',
    zone: 'Italia',
    vibe: 'Romantico & Misterioso',
    costEstimate: '€ 140–180 / notte',
    duration: '48 Ore (Weekend)',
    description:
      'Cena a lume di candela in un sotterraneo in pietra del 1300, passeggiata al tramonto sulle balze e risveglio in dimora storica.',
    coverImage: '/images/reels/reel-3-cover.webp',
    link: '/posto/taverna-volterra-toscana',
  },
  relax_puglia: {
    title: 'Masseria di Luce con Trulli Privati',
    location: "Val d'Itria, Puglia",
    zone: 'Italia',
    vibe: 'Natura & Relax',
    costEstimate: '€ 160–220 / notte',
    duration: '3 Giorni',
    description:
      'Piscina incastonata nella roccia bianca, colazione sotto gli ulivi secolari e silenzio totale a 15 minuti dal mare.',
    coverImage: '/images/reels/reel-2-cover.webp',
    link: '/esplora?zone=italia',
  },
  avventura_europa: {
    title: "Fuga tra le Case sull'Acqua nei Fiordi",
    location: 'Lofoten, Norvegia',
    zone: 'Europa',
    vibe: 'Grande Avventura',
    costEstimate: '€ 190–250 / notte',
    duration: '4 Giorni',
    description:
      'Antica rorbu di pescatori riconvertita, aurora boreale dal letto e zuppa di pesce fresca al porto.',
    coverImage: '/images/reels/reel-4-cover.webp',
    link: '/esplora?zone=europa',
  },
};

export default function WeekendGeneratorWidget() {
  const [selectedVibe, setSelectedVibe] = useState<'romantico' | 'relax' | 'avventura'>(
    'romantico'
  );
  const [selectedZone, setSelectedZone] = useState<'toscana' | 'puglia' | 'europa'>('toscana');
  const [generated, setGenerated] = useState<WeekendIdea | null>(IDEAS_DATABASE.romantico_toscana);

  const generateIdea = () => {
    const key = `${selectedVibe}_${selectedZone}`;
    const fallback = IDEAS_DATABASE.romantico_toscana;
    setGenerated(IDEAS_DATABASE[key] ?? fallback);
  };

  return (
    <section className="bg-[var(--color-sand,#faf7f2)] py-20 md:py-28 text-[var(--color-ink)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
            <Sparkles size={14} />
            Generatore di Fuga di Coppia
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
            Trova il tuo weekend perfetto in 3 click.
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted-fg)] md:text-lg">
            Seleziona atmosfera e destinazione: ti mostriamo un posto speciale provato di persona
            con costi reali.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Form Controls */}
          <div className="rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-[var(--color-surface,#ffffff)] p-6 md:p-8 shadow-sm">
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
                    { id: 'romantico', label: 'Romantica', icon: Heart },
                    { id: 'relax', label: 'Relax & Natura', icon: Compass },
                    { id: 'avventura', label: 'Avventura', icon: Sparkles },
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
                    { id: 'toscana', label: 'Toscana' },
                    { id: 'puglia', label: 'Puglia' },
                    { id: 'europa', label: 'Europa' },
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
              Genera l'idea weekend
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          {/* Generated Result Card 3D Tilt */}
          <AnimatePresence mode="wait">
            {generated && (
              <motion.div
                key={generated.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <TiltCard maxTilt={6} className="w-full">
                  <div className="relative overflow-hidden rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white shadow-xl">
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={generated.coverImage}
                        alt={generated.title}
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
                          {generated.vibe}
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
                            Costo stimato
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
                          Vedi dettagli
                        </Button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
