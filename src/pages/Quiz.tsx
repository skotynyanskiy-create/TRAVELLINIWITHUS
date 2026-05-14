import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Compass, RotateCw, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import Newsletter from '../components/Newsletter';
import { DEMO_ITINERARIES } from '../config/demoItineraries';
import { SITE_URL } from '../config/site';
import { trackEvent } from '../services/analytics';

type DurationAnswer = 'weekend' | 'week' | 'long';
type StyleAnswer = 'slow' | 'romantic' | 'outdoor' | 'design';
type BudgetAnswer = 'lean' | 'medium' | 'premium';

interface Answers {
  duration?: DurationAnswer;
  style?: StyleAnswer;
  budget?: BudgetAnswer;
}

const STEPS = [
  {
    key: 'duration',
    question: 'Quanto tempo hai per il prossimo viaggio?',
    helper: 'Niente bugie a te stesso: meglio un viaggio piu corto ma vero.',
    options: [
      { id: 'weekend', label: 'Un weekend lungo', sub: '2-4 giorni' },
      { id: 'week', label: 'Una settimana', sub: '5-7 giorni' },
      { id: 'long', label: 'Slow trip', sub: '8 giorni o piu' },
    ],
  },
  {
    key: 'style',
    question: 'Che ritmo cerchi?',
    helper: 'Una sola risposta: prova a essere onesto su come ti riposi davvero.',
    options: [
      { id: 'slow', label: 'Slow & culturale', sub: 'Camminare, leggere, mangiare bene' },
      { id: 'romantic', label: 'Romantico in coppia', sub: 'Boutique, tramonti, ritmi morbidi' },
      { id: 'outdoor', label: 'Avventura outdoor', sub: 'Montagna, trek, lago' },
      {
        id: 'design',
        label: 'Boutique & design',
        sub: 'Hotel curati, architettura, food d autore',
      },
    ],
  },
  {
    key: 'budget',
    question: 'Budget indicativo a testa?',
    helper: 'Voli e alloggi inclusi. Restiamo realisti, non aspirazionali.',
    options: [
      { id: 'lean', label: 'Sotto i 600 EUR', sub: 'Lean ma curato' },
      { id: 'medium', label: '600 - 1500 EUR', sub: 'Equilibrio classico' },
      { id: 'premium', label: 'Sopra i 1500 EUR', sub: 'Premium senza essere luxury' },
    ],
  },
] as const;

function scoreItinerary(itinerary: (typeof DEMO_ITINERARIES)[number], answers: Required<Answers>) {
  let score = 0;
  const styleMap: Record<StyleAnswer, string> = {
    slow: 'Slow & culturale',
    romantic: 'Romantico in coppia',
    outdoor: 'Avventura outdoor',
    design: 'Boutique & design',
  };
  const durationMap: Record<DurationAnswer, number> = { weekend: 3, week: 6, long: 10 };

  if (itinerary.style === styleMap[answers.style]) score += 4;
  if (itinerary.budgetTier === answers.budget) score += 3;

  const targetDays = durationMap[answers.duration];
  const diff = Math.abs(itinerary.durationDays - targetDays);
  score += Math.max(0, 3 - diff);

  return score;
}

export default function Quiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const isComplete = stepIndex >= STEPS.length;

  const result = useMemo(() => {
    if (!isComplete) return null;
    if (!answers.duration || !answers.style || !answers.budget) return null;

    const scored = DEMO_ITINERARIES.map((itinerary) => ({
      itinerary,
      score: scoreItinerary(itinerary, answers as Required<Answers>),
    })).sort((a, b) => b.score - a.score);

    return scored[0];
  }, [isComplete, answers]);

  const handleSelect = (key: string, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    trackEvent('quiz_answer', { step: key, value });

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(STEPS.length);
      trackEvent('quiz_completed', { answers: next });
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
    trackEvent('quiz_restart');
  };

  const progress = isComplete ? 100 : Math.round((stepIndex / STEPS.length) * 100);
  const currentStep = STEPS[stepIndex];

  return (
    <PageLayout>
      <SEO
        title="Quiz: trova il tuo prossimo viaggio"
        description="Tre domande per ricevere un suggerimento di itinerario calibrato su tempo, stile e budget. Niente registrazione."
        canonical={`${SITE_URL}/quiz`}
      />

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Quiz' }]} />

        <div className="mt-8 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Quiz viaggio
          </span>
          <h1 className="mt-4 text-5xl font-serif leading-[1.05] tracking-tight md:text-6xl">
            Tre domande.
            <br />
            <span className="italic text-black/55">Una direzione.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-black/70">
            Niente form. Solo tre scelte per capire dove stai andando con la testa, e ricevere il
            suggerimento giusto da cui partire.
          </p>
        </div>

        <div className="mt-12 max-w-3xl">
          <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
            <span>
              {isComplete ? 'Quiz completato' : `Domanda ${stepIndex + 1} di ${STEPS.length}`}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-black/5">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-[var(--color-accent)]"
            />
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <AnimatePresence mode="wait">
          {!isComplete && currentStep ? (
            <motion.div
              key={currentStep.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <h2 className="text-3xl font-serif leading-tight md:text-4xl">
                {currentStep.question}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-black/55">{currentStep.helper}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {currentStep.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(currentStep.key, option.id)}
                    className="group flex flex-col items-start gap-2 rounded-[var(--radius-lg)] border border-black/8 bg-white p-7 text-left transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-md"
                  >
                    <span className="text-2xl font-serif text-[var(--color-ink)] group-hover:text-[var(--color-accent-text)]">
                      {option.label}
                    </span>
                    <span className="text-sm text-black/55">{option.sub}</span>
                    <ArrowRight
                      size={16}
                      className="mt-2 text-black/30 transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                    />
                  </button>
                ))}
              </div>

              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-black/45 transition-colors hover:text-[var(--color-accent)]"
                >
                  <ArrowLeft size={14} /> Risposta precedente
                </button>
              )}
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid gap-10 overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-white shadow-xl md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[260px] md:min-h-full">
                  <OptimizedImage
                    src={result.itinerary.image}
                    alt={result.itinerary.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                  <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-ink)]">
                    <Sparkles size={12} className="text-[var(--color-accent)]" />
                    Suggerito per te
                  </div>
                </div>
                <div className="p-8 md:p-12">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                    {result.itinerary.destination}
                  </p>
                  <h2 className="mt-4 text-4xl font-serif leading-tight md:text-5xl">
                    {result.itinerary.title}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-black/68">
                    {result.itinerary.excerpt}
                  </p>
                  <ul className="mt-7 space-y-2 text-sm text-black/60">
                    <li>
                      <strong className="text-[var(--color-ink)]">Durata:</strong>{' '}
                      {result.itinerary.durationDays} giorni
                    </li>
                    <li>
                      <strong className="text-[var(--color-ink)]">Stile:</strong>{' '}
                      {result.itinerary.style}
                    </li>
                    <li>
                      <strong className="text-[var(--color-ink)]">Budget:</strong>{' '}
                      {result.itinerary.budget}
                    </li>
                  </ul>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <Link
                      to={`/itinerari/${result.itinerary.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
                    >
                      Apri l itinerario <ArrowRight size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 px-7 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
                    >
                      <RotateCw size={14} /> Ricomincia
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-14 grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                    Salva e continua
                  </span>
                  <h3 className="mt-4 text-3xl font-serif leading-tight md:text-4xl">
                    Vuoi ricevere il PDF di questo itinerario?
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-black/65">
                    Iscriviti alla newsletter: appena il content sara pubblicato ti arriva il
                    download dell itinerario gia compilato, senza spam.
                  </p>
                </div>
                <Newsletter compact variant="sand" source="quiz_result" />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Section>

      <Section className="my-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] p-7">
          <div className="flex items-center gap-3">
            <Compass className="text-[var(--color-accent)]" size={22} />
            <p className="text-sm leading-snug text-black/65">Vuoi vedere tutti gli itinerari?</p>
          </div>
          <Link
            to="/itinerari"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
          >
            Sfoglia gli itinerari <ArrowRight size={13} />
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
}
