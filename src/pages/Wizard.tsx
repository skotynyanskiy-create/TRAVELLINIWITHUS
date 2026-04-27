import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, RefreshCw } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { SITE_URL } from '../config/site';
import { fetchArticles } from '../services/firebaseService';
import { getPublicArticlePath } from '../utils/articleRoutes';
import type { ArticleType } from '../components/article';

const PAGE_URL = `${SITE_URL}/trova-viaggio`;

type Duration = 'weekend' | '5-7' | '7-10' | 'oltre-10';
type Mood = 'mare' | 'montagna' | 'citta' | 'borghi' | 'food' | 'spa' | 'mix';
type Season = 'estate' | 'spalla' | 'inverno' | 'qualsiasi';
type Budget = 'low' | 'mid' | 'high';

interface Answers {
  duration?: Duration;
  mood?: Mood;
  season?: Season;
  budget?: Budget;
}

interface StepDef<K extends keyof Answers> {
  key: K;
  question: string;
  options: { value: NonNullable<Answers[K]>; label: string; description?: string }[];
}

const STEPS: [StepDef<'duration'>, StepDef<'mood'>, StepDef<'season'>, StepDef<'budget'>] = [
  {
    key: 'duration',
    question: 'Quanto tempo hai per il viaggio?',
    options: [
      { value: 'weekend', label: 'Weekend', description: '2-3 giorni, fuga breve.' },
      { value: '5-7', label: '5-7 giorni', description: 'Una settimana classica.' },
      { value: '7-10', label: '7-10 giorni', description: 'Una settimana piena con margine.' },
      { value: 'oltre-10', label: 'Oltre 10 giorni', description: 'Viaggio lungo o road trip.' },
    ],
  },
  {
    key: 'mood',
    question: 'Che mood cerchi?',
    options: [
      { value: 'mare', label: 'Mare', description: 'Calette, costiera, isole.' },
      { value: 'montagna', label: 'Montagna', description: 'Quote, rifugi, sentieri.' },
      { value: 'citta', label: 'Citta', description: 'Capitali e capoluoghi.' },
      { value: 'borghi', label: 'Borghi e campagna', description: 'Lentezza e tradizione.' },
      {
        value: 'food',
        label: 'Food experience',
        description: 'Mangiare e bere come asse del viaggio.',
      },
      { value: 'spa', label: 'Relax e wellness', description: 'Terme, lodge, ritmi lenti.' },
      { value: 'mix', label: 'Mix', description: 'Un po di tutto, senza vincolo netto.' },
    ],
  },
  {
    key: 'season',
    question: 'Quando partiresti?',
    options: [
      {
        value: 'estate',
        label: 'Estate (giu-ago)',
        description: 'Alta stagione, mare e quote alte.',
      },
      {
        value: 'spalla',
        label: 'Spalla (apr-mag, set-ott)',
        description: 'La nostra finestra preferita.',
      },
      { value: 'inverno', label: 'Inverno (nov-mar)', description: 'Sci, terme, citta d arte.' },
      { value: 'qualsiasi', label: 'Qualsiasi', description: 'Decido in base alle proposte.' },
    ],
  },
  {
    key: 'budget',
    question: 'Che fascia di budget hai in mente?',
    options: [
      { value: 'low', label: 'Low', description: 'Backpacker / agriturismo / B&B.' },
      { value: 'mid', label: 'Mid', description: 'Hotel 3-4 stelle, qualche lusso mirato.' },
      { value: 'high', label: 'High', description: 'Hotel selezionati, ristoranti d autore.' },
    ],
  },
];

const MOOD_KEYWORDS: Record<Mood, string[]> = {
  mare: ['mare', 'spiaggia', 'caletta', 'costa', 'isola'],
  montagna: ['montagna', 'rifugio', 'dolomiti', 'alpe', 'sentiero', 'trekking'],
  citta: ['citta', 'capitale', 'urbano', 'museo'],
  borghi: ['borgo', 'borghi', 'paese', 'campagna', 'agriturismo'],
  food: ['food', 'cucina', 'cibo', 'ristorante', 'trattoria', 'mangiare'],
  spa: ['spa', 'terme', 'wellness', 'relax', 'lodge'],
  mix: [],
};

const DURATION_KEYWORDS: Record<Duration, string[]> = {
  weekend: ['weekend', 'day trip', '2 giorni', '3 giorni'],
  '5-7': ['5 giorni', '6 giorni', '7 giorni', 'settimana'],
  '7-10': ['7 giorni', '8 giorni', '10 giorni', 'settimana'],
  'oltre-10': ['10 giorni', '12 giorni', '14 giorni', 'roadtrip', 'road trip'],
};

interface ScoredArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  type: ArticleType;
  location: string;
  score: number;
}

function scoreArticles(
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    type: ArticleType;
    location: string;
    duration?: string;
    period?: string;
    budgetBand?: string;
    experienceTypes?: string[];
    tripIntents?: string[];
  }>,
  answers: Answers
): ScoredArticle[] {
  const moodKeywords = answers.mood ? MOOD_KEYWORDS[answers.mood] : [];
  const durationKeywords = answers.duration ? DURATION_KEYWORDS[answers.duration] : [];

  return articles
    .map<ScoredArticle>((article) => {
      let score = 0;
      const haystack = [
        article.title,
        article.excerpt,
        article.location,
        article.category,
        article.duration ?? '',
        article.period ?? '',
        ...(article.experienceTypes ?? []),
        ...(article.tripIntents ?? []),
      ]
        .join(' ')
        .toLowerCase();

      // Mood matches (peso 3)
      for (const kw of moodKeywords) {
        if (haystack.includes(kw)) score += 3;
      }

      // Duration matches (peso 2)
      for (const kw of durationKeywords) {
        if (haystack.includes(kw)) score += 2;
      }

      // Season matches (peso 2)
      if (answers.season && answers.season !== 'qualsiasi') {
        const seasonMap: Record<Exclude<Season, 'qualsiasi'>, string[]> = {
          estate: ['estate', 'giugno', 'luglio', 'agosto'],
          spalla: ['aprile', 'maggio', 'settembre', 'ottobre', 'spalla'],
          inverno: ['inverno', 'novembre', 'dicembre', 'gennaio', 'febbraio', 'marzo'],
        };
        for (const kw of seasonMap[answers.season]) {
          if (haystack.includes(kw)) score += 2;
        }
      }

      // Budget match (peso 1)
      if (answers.budget && article.budgetBand) {
        const budgetMap: Record<Budget, string[]> = {
          low: ['economico', 'low'],
          mid: ['medio', 'mid'],
          high: ['alto', 'lusso', 'premium', 'high'],
        };
        const expected = budgetMap[answers.budget];
        if (expected.some((e) => article.budgetBand?.toLowerCase().includes(e))) {
          score += 1;
        }
      }

      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        image: article.image,
        category: article.category,
        type: article.type,
        location: article.location,
        score,
      };
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function WizardPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const { data: articles = [] } = useQuery({
    queryKey: ['wizard-articles'],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
  });

  const currentStep = STEPS[stepIndex];
  const totalSteps = STEPS.length;
  const isLastStep = stepIndex === totalSteps - 1;

  const results = useMemo(() => {
    if (!showResults) return [];
    return scoreArticles(articles, answers);
  }, [showResults, articles, answers]);

  const handleAnswer = <K extends keyof Answers>(key: K, value: NonNullable<Answers[K]>) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (isLastStep) {
      setShowResults(true);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setStepIndex(0);
    setShowResults(false);
  };

  return (
    <PageLayout>
      <SEO
        title="Trova il tuo prossimo viaggio — Wizard Travelliniwithus"
        description="Cinque domande, tre suggerimenti curati. Il nostro wizard editoriale ti propone destinazioni, itinerari e weekend basati sui tuoi tempi, mood, periodo e budget."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Trova viaggio', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Breadcrumbs items={[{ label: 'Trova viaggio' }]} />

          <div className="mt-8 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Wizard editoriale
            </p>
            <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
              Trova il tuo <span className="italic text-black/55">prossimo viaggio</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
              Quattro domande veloci, tre suggerimenti curati dal nostro archivio. Niente algoritmi
              cinici: pesiamo mood, periodo, durata e budget contro guide e itinerari che abbiamo
              testato sul campo.
            </p>
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="default">
        <div className="rounded-4xl border border-black/5 bg-white p-8 shadow-sm md:p-12">
          {!showResults ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
                  Domanda {stepIndex + 1} di {totalSteps}
                </span>
                <div className="h-1 w-32 overflow-hidden rounded-full bg-black/8">
                  <motion.div
                    className="h-full origin-left rounded-full bg-accent"
                    initial={false}
                    animate={{ scaleX: (stepIndex + 1) / totalSteps }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-serif leading-tight text-ink md:text-4xl">
                    {currentStep.question}
                  </h2>
                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {currentStep.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswer(currentStep.key, opt.value)}
                        className="group rounded-2xl border border-black/8 bg-sand p-5 text-left transition-all hover:border-accent hover:bg-white hover:shadow-md"
                      >
                        <span className="text-base font-bold text-ink group-hover:text-accent-text">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="mt-1 block text-xs leading-relaxed text-black/55">
                            {opt.description}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIndex(stepIndex - 1)}
                  className="mt-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/55 hover:text-ink"
                >
                  Indietro
                </button>
              )}
            </>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
                  3 proposte per te
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-black/55 hover:text-accent-text"
                >
                  <RefreshCw size={12} />
                  Ricomincia
                </button>
              </div>

              {results.length === 0 ? (
                <div className="rounded-3xl border border-black/5 bg-sand p-10 text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-text">
                    Nessun match perfetto
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-black/70">
                    L archivio non ha ancora abbastanza contenuti per matchare al meglio le tue
                    preferenze. Sfoglia liberamente le destinazioni o iscriviti per ricevere le
                    nuove guide via email.
                  </p>
                  <Link
                    to="/destinazioni"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-accent"
                  >
                    Esplora le destinazioni
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {results.map((article, idx) => {
                    const path = getPublicArticlePath({
                      slug: article.slug,
                      category: article.category,
                      type: article.type,
                    });
                    return (
                      <Link
                        key={article.id}
                        to={path}
                        className="group block overflow-hidden rounded-3xl border border-black/5 bg-sand transition-all hover:shadow-md"
                      >
                        <div className="relative aspect-4/5 overflow-hidden">
                          <OptimizedImage
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-accent-text">
                            <Check size={10} />
                            Match {idx + 1}
                          </span>
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
                            {article.category}
                          </span>
                          <h3 className="mt-2 text-xl font-serif leading-tight text-ink group-hover:text-accent-text">
                            {article.title}
                          </h3>
                          {article.location && (
                            <p className="mt-2 text-xs text-black/55">
                              {article.location.split(',')[0]}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
