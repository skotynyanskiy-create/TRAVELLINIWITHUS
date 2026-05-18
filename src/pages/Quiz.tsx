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
import {
  ARCHETYPES,
  QUIZ_QUESTIONS,
  computeArchetype,
  type ArchetypeId,
} from '../config/quizArchetypes';
import { SITE_URL } from '../config/site';
import { trackEvent } from '../services/analytics';

export default function Quiz() {
  const [stepIndex, setStepIndex] = useState(0);
  /** Array di optionId selezionate, una per ogni domanda risposta. */
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const isComplete = stepIndex >= QUIZ_QUESTIONS.length;

  /** Calcolo archetipo solo al completamento. */
  const archetypeId: ArchetypeId | null = useMemo(() => {
    if (!isComplete) return null;
    if (selectedOptionIds.length !== QUIZ_QUESTIONS.length) return null;
    return computeArchetype(selectedOptionIds);
  }, [isComplete, selectedOptionIds]);

  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;
  const currentQuestion = QUIZ_QUESTIONS[stepIndex];

  const handleSelect = (questionId: string, optionId: string) => {
    const next = [...selectedOptionIds];
    next[stepIndex] = optionId;
    setSelectedOptionIds(next);
    trackEvent('quiz_answer', { step: questionId, value: optionId, step_index: stepIndex });

    if (stepIndex < QUIZ_QUESTIONS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(QUIZ_QUESTIONS.length);
      const computed = computeArchetype(next);
      trackEvent('quiz_completed', {
        archetype: computed,
        ga4_archetype: ARCHETYPES[computed].ga4Tag,
      });
      trackEvent('archetype_assigned', {
        archetype: computed,
        segment: ARCHETYPES[computed].segmentLabel,
      });
      // Persist in localStorage per personalizzazione homepage successiva.
      try {
        window.localStorage.setItem('tw_archetype', computed);
        window.localStorage.setItem('tw_archetype_at', new Date().toISOString());
      } catch {
        // localStorage non disponibile in alcune modalita private — ignore.
      }
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleRestart = () => {
    setSelectedOptionIds([]);
    setStepIndex(0);
    trackEvent('quiz_restart');
  };

  const progress = isComplete ? 100 : Math.round((stepIndex / QUIZ_QUESTIONS.length) * 100);

  return (
    <PageLayout>
      <SEO
        title="Che coppia di viaggiatori siete — quiz Travelliniwithus"
        description="Sette domande per scoprire il vostro archetipo di viaggio: tre destinazioni firmate Rodrigo & Betta su misura, scelte tra otto anni di posti vissuti davvero."
        canonical={`${SITE_URL}/quiz`}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Quiz', url: `${SITE_URL}/quiz` },
        ]}
      />

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Quiz' }]} />

        <div className="mt-10 max-w-2xl">
          <span className="text-eyebrow">Quiz coppia</span>
          <h1 className="mt-5 font-serif font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] text-[clamp(2.5rem,5vw+0.5rem,5.5rem)]">
            Che coppia di viaggiatori
            <br />
            <span className="italic text-black/55">siete?</span>
          </h1>
          <p className="mt-7 text-body-editorial">
            Sette domande oneste, niente domande di marketing. Alla fine vi diciamo a quale dei
            nostri sei archetipi italiani assomigliate di piu, e quali tre destinazioni del nostro
            archivio sono pensate per voi.
          </p>
        </div>

        <div className="mt-14 max-w-3xl">
          <div className="mb-4 flex items-center justify-between text-eyebrow">
            <span>
              {isComplete
                ? 'Quiz completato'
                : `Domanda ${stepIndex + 1} di ${QUIZ_QUESTIONS.length}`}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-px w-full overflow-hidden bg-black/10">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[var(--color-ink)]"
            />
          </div>
        </div>
      </Section>

      <Section className="pt-10">
        <AnimatePresence mode="wait">
          {!isComplete && currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <h2 className="font-serif leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
                {currentQuestion.question}
              </h2>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {currentQuestion.options.map((option) => {
                  const selected = selectedOptionIds[stepIndex] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(currentQuestion.id, option.id)}
                      aria-pressed={selected}
                      className={`group flex items-start gap-4 rounded-[var(--radius-lg)] border bg-white p-7 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-md)] ${
                        selected
                          ? 'border-[var(--color-ink)] shadow-[var(--shadow-sm)]'
                          : 'border-black/10'
                      }`}
                    >
                      <span className="flex-1 font-serif text-xl leading-snug text-[var(--color-ink)] md:text-2xl">
                        {option.label}
                      </span>
                      <ArrowRight
                        size={18}
                        className="mt-1 shrink-0 text-black/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-ink)]"
                      />
                    </button>
                  );
                })}
              </div>

              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-12 inline-flex items-center gap-2 text-eyebrow transition-colors hover:text-[var(--color-ink)]"
                >
                  <ArrowLeft size={14} /> Risposta precedente
                </button>
              )}
            </motion.div>
          ) : archetype ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-10 overflow-hidden rounded-[var(--radius-xl)] border border-black/8 bg-white shadow-[var(--shadow-lg)] md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px] md:min-h-full">
                  <OptimizedImage
                    src={archetype.heroImage}
                    alt={archetype.heroImageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
                    <Sparkles size={12} className="text-[var(--color-ink)]" />
                    Il vostro archetipo
                  </div>
                </div>

                <div className="p-9 md:p-12">
                  <span className="text-eyebrow">{archetype.eyebrow}</span>
                  <h2 className="mt-4 font-serif font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] text-[clamp(2rem,3.5vw+0.5rem,3.5rem)]">
                    {archetype.name}
                  </h2>
                  <p className="mt-5 font-serif italic text-xl leading-snug text-black/65 md:text-2xl">
                    {archetype.tagline}
                  </p>
                  <p className="mt-7 text-body-editorial">{archetype.description}</p>

                  <div className="mt-10">
                    <p className="text-eyebrow mb-5">Tre destinazioni per voi</p>
                    <ul className="space-y-3">
                      {archetype.signatureDestinations.map((slug, idx) => (
                        <li key={slug} className="flex items-baseline gap-4">
                          <span className="dispatch-index-number">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <Link
                            to={`/articolo/${slug}`}
                            onClick={() =>
                              trackEvent('archetype_destination_click', {
                                archetype: archetype.id,
                                destination: slug,
                                position: idx,
                              })
                            }
                            className="font-serif text-lg leading-snug text-[var(--color-ink)] underline-offset-4 transition-colors hover:underline hover:text-[var(--color-accent-text)]"
                          >
                            {slug
                              .split('-')
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(' ')}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      to="/esplora"
                      onClick={() =>
                        trackEvent('archetype_cta_explore', { archetype: archetype.id })
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-4 text-eyebrow text-white transition-colors hover:bg-[var(--color-accent)]"
                    >
                      Apri l&apos;archivio <ArrowRight size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center gap-2 rounded-full border border-black/12 px-7 py-4 text-eyebrow text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
                    >
                      <RotateCw size={14} /> Rifai il quiz
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-20 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
                <div>
                  <span className="text-eyebrow">Ricevete il piano da 3 giorni</span>
                  <h3 className="mt-5 font-serif font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
                    Un itinerario da tre giorni
                    <br />
                    cucito sul vostro archetipo.
                  </h3>
                  <p className="mt-6 text-body-editorial">
                    Iscrivetevi alla nostra mailing: ricevete il piano da 3 giorni sul vostro
                    archetipo (preparato a mano da Rodrigo & Betta) + una mail al mese con il posto
                    del momento. Nessun spam. Annullate quando volete.
                  </p>
                </div>
                <Newsletter compact variant="sand" source={`quiz_archetype_${archetype.id}`} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Section>

      <Section className="my-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-black/8 bg-[var(--color-sand)] p-8">
          <div className="flex items-center gap-3">
            <Compass className="text-[var(--color-ink)]" size={22} />
            <p className="text-body-editorial">Vuoi sfogliare tutto l&apos;archivio?</p>
          </div>
          <Link
            to="/esplora"
            className="inline-flex items-center gap-2 text-eyebrow text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
          >
            Apri Esplora <ArrowRight size={13} />
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
}
