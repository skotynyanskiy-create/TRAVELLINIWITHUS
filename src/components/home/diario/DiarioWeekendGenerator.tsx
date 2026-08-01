import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

const MOOD_OPTIONS = [
  { id: 'romantico', label: 'Weekend Romantico', icon: '❤️' },
  { id: 'insolito', label: 'Cena & Posto Insolito', icon: '🔮' },
  { id: 'relax', label: 'Relax & Spa', icon: '🌿' },
  { id: 'avventura', label: 'Natura & Panorami', icon: '⛰️' },
];

const DISTANCE_OPTIONS = [
  { id: 'vicino', label: 'Entro 2h di macchina' },
  { id: 'medio', label: 'Fuga in Italia (3-5h)' },
  { id: 'volo', label: 'Volo breve in Europa' },
];

const BUDGET_OPTIONS = [
  { id: 'smart', label: 'Smart (< 150€/coppia)' },
  { id: 'medio', label: 'Medio (150€ - 300€)' },
  { id: 'luxury', label: "Esperienza d'Eccezione (> 300€)" },
];

const RECOMMENDATIONS: Record<
  string,
  { title: string; location: string; link: string; copy: string }
> = {
  romantico: {
    title: 'Podere tra le Crete Senesi con idromassaggio',
    location: 'Toscana · Crete Senesi',
    link: '/posto/toscana-glamping-cupole-suvereto',
    copy: 'Privacy totale, tramonto sulle colline e vasca riscaldata sotto le stelle.',
  },
  insolito: {
    title: 'Cenare nella tana dei draghi a Volterra',
    location: 'Volterra · Toscana',
    link: '/posto/toscana-aperitivo-volterra',
    copy: 'Porzioni abbondanti, drago colossale in sala e atmosfera da leggenda.',
  },
  relax: {
    title: 'Resort all-inclusive sul Mar Rosso economico',
    location: 'Marsa Alam · Egitto',
    link: '/posto/egitto-marsa-alam-dream-lagoon',
    copy: 'Acqua trasparente, barriera corallina e relax totale senza spendere troppo.',
  },
  avventura: {
    title: 'Batu Caves e la scalinata arcobaleno',
    location: 'Kuala Lumpur · Malesia',
    link: '/posto/malesia-batu-caves',
    copy: 'Statua dorata gigante e templi incastonati nella roccia.',
  },
};

export default function DiarioWeekendGenerator() {
  const [selectedMood, setSelectedMood] = useState('insolito');
  const [selectedDistance, setSelectedDistance] = useState('vicino');
  const [selectedBudget, setSelectedBudget] = useState('medio');

  const currentRecommendation = RECOMMENDATIONS[selectedMood] ?? RECOMMENDATIONS.insolito;

  return (
    <section className="border-b border-[var(--color-border,#e5dcd0)] bg-[var(--color-sand,#faf7f2)] py-20 text-[var(--color-ink,#1a2b3c)] md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          {/* Left Text */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              <Sparkles size={14} />
              Generatore Interattivo
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[var(--color-ink)] md:text-5xl">
              Trova la tua prossima fuga in 3 click.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted-fg,#546274)]">
              Seleziona il mood di coppia, la distanza desiderata e la fascia di budget: ti
              mostriamo subito il posto verificato più adatto provato da Rodrigo &amp; Betta.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-xs font-semibold text-[var(--color-ink)]">
              <div className="rounded-xl border border-[var(--color-border,#e5dcd0)] bg-white p-4 shadow-xs">
                <span className="text-[var(--color-accent)] font-bold">01. Mood</span>
                <p className="mt-1 text-black/60">Atmosfera di coppia</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border,#e5dcd0)] bg-white p-4 shadow-xs">
                <span className="text-[var(--color-accent)] font-bold">02. Distanza</span>
                <p className="mt-1 text-black/60">Tempo di viaggio</p>
              </div>
              <div className="rounded-xl border border-[var(--color-border,#e5dcd0)] bg-white p-4 shadow-xs">
                <span className="text-[var(--color-accent)] font-bold">03. Budget</span>
                <p className="mt-1 text-black/60">Costo reale stimato</p>
              </div>
            </div>
          </div>

          {/* Right Widget Card */}
          <div className="rounded-[var(--radius-xl,24px)] border border-[var(--color-border,#e5dcd0)] bg-white p-6 shadow-xl md:p-8">
            <h3 className="mb-6 font-serif text-2xl">Configura la tua ricerca</h3>

            {/* Step 1: Mood */}
            <fieldset className="mb-6 border-0 p-0 m-0">
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg,#546274)]">
                1. Qual è il vostro mood?
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-semibold transition-all ${
                      selectedMood === m.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft,#fdf0ec)] text-[var(--color-accent)] shadow-xs'
                        : 'border-black/10 bg-white text-black/70 hover:border-black/20'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Step 2: Distance */}
            <fieldset className="mb-6 border-0 p-0 m-0">
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg,#546274)]">
                2. Quanto volete spostarvi?
              </legend>
              <div className="flex flex-wrap gap-2">
                {DISTANCE_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDistance(d.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selectedDistance === d.id
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                        : 'border-black/10 bg-white text-black/70 hover:border-black/20'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Step 3: Budget */}
            <fieldset className="mb-8 border-0 p-0 m-0">
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg,#546274)]">
                3. Fascia di budget indicativa
              </legend>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBudget(b.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selectedBudget === b.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-ink)]'
                        : 'border-black/10 bg-white text-black/70 hover:border-black/20'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Result Box */}
            <motion.div
              key={`${selectedMood}-${selectedDistance}-${selectedBudget}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-[var(--color-accent,#c85a32)]/30 bg-[var(--color-accent-soft,#fdf0ec)] p-5 text-[var(--color-ink)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)]">
                  <Flame size={12} /> Posto Consigliato
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/60">
                  {currentRecommendation.location}
                </span>
              </div>
              <h4 className="mt-2 font-serif text-xl font-normal leading-snug">
                {currentRecommendation.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-black/70">
                {currentRecommendation.copy}
              </p>
              <Link
                to={currentRecommendation.link}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)] hover:underline"
              >
                Vedi Scheda Completa <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
