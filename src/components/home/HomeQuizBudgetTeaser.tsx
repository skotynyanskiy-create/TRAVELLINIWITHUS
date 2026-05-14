import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, Wallet } from 'lucide-react';
import { trackEvent } from '../../services/analytics';

/**
 * Mini-quiz inline (1 domanda preview) come hook al quiz completo.
 * Ref pattern: Netflix "what's your vibe" + Spotify Wrapped onboarding.
 * Mostra valore PRIMA del click "Inizia il quiz" → +CR atteso 2-3x.
 */
const QUICK_QUESTIONS = [
  {
    id: 'weekend',
    label: 'Un weekend',
    sub: '2-4 giorni',
    teaser: 'Romagna, Trentino, Costiera, Salento — abbiamo guide pronte.',
  },
  {
    id: 'week',
    label: 'Una settimana',
    sub: '5-7 giorni',
    teaser: 'Itinerari da Slovenia a Cilento, da Bali a Lisbona.',
  },
  {
    id: 'long',
    label: 'Slow trip',
    sub: '8+ giorni',
    teaser: 'Viaggi lunghi raccontati passo per passo, costi reali.',
  },
] as const;

export default function HomeQuizBudgetTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-12 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Strumenti pratici
          </span>
          <h2 className="mt-4 text-4xl font-serif leading-tight tracking-tight md:text-5xl">
            Non sai da dove partire?{' '}
            <span className="italic text-black/55">Te lo diciamo noi.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-black/65">
            Quiz veloci e calcolatori usati da chi viaggia con criterio. Niente form, niente
            registrazione: solo le risposte giuste per orientarti.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <QuickQuizCard />
          <TeaserCard
            icon={Wallet}
            eyebrow="Budget viaggio"
            title="Quanto puo costare davvero il prossimo viaggio?"
            description="Stima realistica con voli, alloggi, cibo e spostamenti. Per orientarti prima di prenotare."
            cta="Calcola la stima"
            to="/strumenti"
          />
        </div>
      </div>
    </section>
  );
}

function QuickQuizCard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<(typeof QUICK_QUESTIONS)[number] | null>(null);

  const handleSelect = (option: (typeof QUICK_QUESTIONS)[number]) => {
    setSelected(option);
    trackEvent('quiz_inline_preview_answer', { duration: option.id });
  };

  const handleContinue = () => {
    if (!selected) return;
    trackEvent('quiz_inline_preview_continue', { duration: selected.id });
    navigate(`/quiz?duration=${selected.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col gap-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 bg-[var(--color-ink)] p-8 text-white transition-all hover:-translate-y-1 md:p-10"
    >
      <div>
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
          <Compass size={22} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Quiz viaggio
        </p>
        <h3 className="mt-4 text-3xl font-serif leading-tight md:text-4xl">
          Quanto tempo hai per il prossimo viaggio?
        </h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-white/65">
          Una risposta, e ti diamo subito un assaggio. Il quiz completo richiede 3 domande in tutto.
        </p>
      </div>

      <div className="space-y-2.5">
        {QUICK_QUESTIONS.map((option) => {
          const isActive = selected?.id === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className={`flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] border px-4 py-3 text-left transition-all ${
                isActive
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                  : 'border-white/14 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <span>
                <span className="block text-sm font-semibold">{option.label}</span>
                <span className="block text-xs text-white/55">{option.sub}</span>
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-[var(--color-ink)]'
                    : 'bg-white/10 text-white/60'
                }`}
                aria-hidden="true"
              >
                {isActive ? <Sparkles size={13} /> : <ArrowRight size={13} />}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="continue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <p className="text-sm leading-relaxed text-white/72">{selected.teaser}</p>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:bg-white"
            >
              Completa il quiz (2 domande) <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-white/45"
          >
            Scegli una risposta per iniziare.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface TeaserCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  accent?: boolean;
}

function TeaserCard({ icon: Icon, eyebrow, title, description, cta, to, accent }: TeaserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`group flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] border p-8 transition-all hover:-translate-y-1 md:p-10 ${
        accent
          ? 'border-[var(--color-accent)]/20 bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink)]/95'
          : 'border-black/5 bg-white text-[var(--color-ink)] hover:border-[var(--color-accent)]'
      }`}
    >
      <div>
        <div
          className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] ${
            accent
              ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
              : 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
          }`}
        >
          <Icon size={22} />
        </div>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
            accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent-text)]'
          }`}
        >
          {eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-serif leading-tight md:text-4xl">{title}</h3>
        <p
          className={`mt-4 max-w-md text-base leading-relaxed ${
            accent ? 'text-white/70' : 'text-black/62'
          }`}
        >
          {description}
        </p>
      </div>
      <Link
        to={to}
        className={`inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
          accent
            ? 'bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-white'
            : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent)]'
        }`}
      >
        {cta} <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
