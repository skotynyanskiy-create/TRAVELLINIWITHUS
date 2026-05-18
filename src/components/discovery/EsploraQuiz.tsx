import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { slugifyType, type Period, type Zone } from '../../config/contentTaxonomy';
import { trackEvent } from '../../services/analytics';

interface EsploraQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

type DurationChoice = 'Weekend' | 'Weekend lungo' | 'Settimana' | 'Due settimane';

interface QuizAnswers {
  zone: Zone | null;
  period: Period | null;
  duration: DurationChoice | null;
}

const STEPS = [
  {
    key: 'zone' as const,
    question: 'Dove ti porta la voglia adesso?',
    description: 'Scegli la zona da cui vorresti partire.',
    options: [
      { value: 'Italia' as Zone, label: 'Italia' },
      { value: 'Europa' as Zone, label: 'Europa' },
      { value: 'Asia' as Zone, label: 'Asia' },
      { value: null, label: 'Resto del mondo' },
    ],
  },
  {
    key: 'period' as const,
    question: 'Quando vorresti partire?',
    description: 'Il periodo ci aiuta a capire cosa è sensato consigliarti.',
    options: [
      { value: 'Primavera' as Period, label: 'Primavera' },
      { value: 'Estate' as Period, label: 'Estate' },
      { value: 'Autunno' as Period, label: 'Autunno' },
      { value: 'Inverno' as Period, label: 'Inverno' },
    ],
  },
  {
    key: 'duration' as const,
    question: 'Quanto tempo hai?',
    description: 'Per dirti se è realistico o se vale ripensarci.',
    options: [
      { value: 'Weekend' as DurationChoice, label: 'Weekend' },
      { value: 'Weekend lungo' as DurationChoice, label: 'Weekend lungo' },
      { value: 'Settimana' as DurationChoice, label: 'Settimana' },
      { value: 'Due settimane' as DurationChoice, label: 'Due settimane' },
    ],
  },
];

export default function EsploraQuiz({ isOpen, onClose }: EsploraQuizProps) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    zone: null,
    period: null,
    duration: null,
  });

  const currentStep = STEPS[stepIndex];
  const totalSteps = STEPS.length;

  // Reset stato quando il modale passa da chiuso a aperto.
  // Pattern "adjust state during render" (React 19) per evitare
  // react-hooks/set-state-in-effect: confronta isOpen con il valore
  // precedente e riallinea lo stato in render, non in useEffect.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setStepIndex(0);
      setAnswers({ zone: null, period: null, duration: null });
    }
  }

  // Tracking apertura: side-effect puro (no setState), useEffect e' corretto.
  useEffect(() => {
    if (!isOpen) return;
    trackEvent('quiz_open', { source_page: window.location.pathname });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSelect = (value: unknown) => {
    const key = currentStep.key;
    const nextAnswers = { ...answers, [key]: value } as QuizAnswers;
    setAnswers(nextAnswers);
    trackEvent('quiz_step_complete', {
      source_page: window.location.pathname,
      step: stepIndex + 1,
      step_key: key,
      step_value: String(value ?? 'all'),
    });

    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Ultimo step: finalize → redirect
      finalize(nextAnswers);
    }
  };

  const finalize = (final: QuizAnswers) => {
    const params = new URLSearchParams();
    if (final.zone) params.set('zone', final.zone);
    if (final.period) params.set('period', final.period.toLowerCase());
    if (final.duration) params.set('duration', final.duration.toLowerCase());
    params.set('quiz', 'true');

    // Bonus: se la zona è Italia + weekend → suggerisci type=Weekend romantici
    if (final.zone === 'Italia' && final.duration === 'Weekend') {
      params.set('type', slugifyType('Weekend romantici'));
    }

    trackEvent('quiz_finish', {
      source_page: window.location.pathname,
      zone: final.zone,
      period: final.period,
      duration: final.duration,
    });

    onClose();
    navigate(`/esplora?${params.toString()}`);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((prev) => prev - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Quiz: Da dove vuoi partire?"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[310] flex items-center justify-center px-4 py-10"
          >
            <div className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi quiz"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-black/55 transition-colors hover:bg-black/5 hover:text-[var(--color-ink)]"
              >
                <X size={18} />
              </button>

              <div className="px-7 pb-2 pt-8 md:px-10 md:pt-10">
                <div className="mb-6 flex items-center gap-2">
                  {STEPS.map((step, idx) => (
                    <span
                      key={step.key}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        idx <= stepIndex ? 'bg-[var(--color-ink)]' : 'bg-black/10'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                  Domanda {stepIndex + 1} di {totalSteps}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.key}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                  className="px-7 pb-8 md:px-10 md:pb-10"
                >
                  <h2 className="font-serif text-[28px] leading-[1] text-[var(--color-ink)] md:text-[34px]">
                    {currentStep.question}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-black/62 md:text-base">
                    {currentStep.description}
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {currentStep.options.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className="group/opt flex min-h-14 items-center justify-between rounded-[var(--radius-md)] border border-black/10 bg-white px-5 py-4 text-left text-base text-[var(--color-ink)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:shadow-[0_18px_40px_-20px_rgba(17,17,17,0.4)]"
                      >
                        <span className="font-serif">{option.label}</span>
                        <ArrowRight
                          size={16}
                          className="text-black/40 transition-all group-hover/opt:translate-x-1 group-hover/opt:text-[var(--color-ink)]"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={stepIndex === 0}
                      className="inline-flex items-center gap-1.5 text-sm text-black/55 transition-colors hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft size={14} /> Indietro
                    </button>
                    <button
                      type="button"
                      onClick={() => finalize(answers)}
                      className="text-sm text-black/45 underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
                    >
                      Salta e vedi tutto
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
