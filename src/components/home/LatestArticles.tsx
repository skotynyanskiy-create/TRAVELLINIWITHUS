import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../../services/firebaseService';
import OptimizedImage from '../OptimizedImage';
import ArticleSkeleton from '../ArticleSkeleton';
import { SITE_URL } from '../../config/site';
import { siteContentDefaults } from '../../config/siteContent';
import { DEMO_ARTICLE_PREVIEW, DEMO_ARTICLES_EXTRA } from '../../config/demoContent';
import { useSiteContent } from '../../hooks/useSiteContent';
import { formatDateValue, toMillis, type DateValue } from '../../utils/dateValue';
import { getPublicArticlePath } from '../../utils/articleRoutes';
import type { ArticleType } from '../article';

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  type?: ArticleType;
  readTime?: string;
  createdAt?: DateValue;
  updatedAt?: DateValue;
  verifiedAt?: DateValue;
  excerpt?: string;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  experienceTypes?: string[];
  tripIntents?: string[];
  budgetBand?: string;
  disclosureType?: string;
  featuredPlacement?: string | null;
  duration?: string;
}

const EDITORIAL_PREVIEWS: Article[] = [DEMO_ARTICLE_PREVIEW, ...DEMO_ARTICLES_EXTRA];

function formatDate(dateInput: DateValue) {
  return formatDateValue(dateInput);
}

function selectHomepageArticles(articles: Article[]) {
  const sorted = [...articles].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  const flagships = sorted.filter((article) => article.featuredPlacement === 'home-flagship');

  if (flagships.length >= 3) {
    return flagships.slice(0, 3);
  }

  const usedIds = new Set(flagships.map((article) => article.id));
  const fillers = sorted.filter((article) => !usedIds.has(article.id));
  return [...flagships, ...fillers].slice(0, 3);
}

export default function LatestArticles() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const { data: recentArticlesData, isLoading: loadingArticles } = useQuery<{
    articles: Article[];
    usingExamples: boolean;
  }>({
    queryKey: ['articles', 'recent', demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetched = await fetchArticles();
      const fetchedArticles = fetched as Article[];
      const flagshipCount = fetchedArticles.filter(
        (article) => article.featuredPlacement === 'home-flagship'
      ).length;

      // Firestore articles get priority. When demo mode is on AND Firestore
      // has fewer than 3 flagships, merge demo previews to fill the editorial
      // flagship slot instead of falling back to random filler.
      if (demoSettings.showEditorialDemo && flagshipCount < 3) {
        const seen = new Set(fetchedArticles.map((article) => article.id));
        const combined = [
          ...fetchedArticles,
          ...EDITORIAL_PREVIEWS.filter((preview) => !seen.has(preview.id)),
        ];
        return {
          articles: selectHomepageArticles(combined),
          usingExamples: fetchedArticles.length === 0,
        };
      }

      if (fetchedArticles.length === 0) {
        return { articles: [], usingExamples: false };
      }

      return { articles: selectHomepageArticles(fetchedArticles), usingExamples: false };
    },
  });

  const recentArticles = recentArticlesData?.articles ?? [];

  return (
    <section id="storie" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Dalla redazione
            </span>
            <h2 className="mt-2 text-3xl font-serif leading-tight text-ink md:text-4xl">
              Le guide che stiamo finendo di scrivere.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-black/70">
              Puglia slow in cinque giorni, Islanda Ring Road d'estate e d'inverno: itinerari
              vissuti sul posto con hotel testati, numeri reali e stagioni giuste.
            </p>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link
              to="/guide"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black/62 transition-transform hover:translate-x-0.5 hover:text-[var(--color-accent-text)]"
            >
              Guide pratiche <ArrowRight size={12} />
            </Link>
            <Link
              to="/itinerari"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-transform hover:translate-x-0.5"
            >
              Itinerari <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {loadingArticles ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : recentArticles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Articolo Principale */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8"
            >
              <Link
                to={getPublicArticlePath(recentArticles[0])}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-black/8 bg-white transition-all duration-500 hover:border-[var(--color-accent)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <OptimizedImage
                    src={recentArticles[0].image}
                    alt={recentArticles[0].title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur-md">
                      {recentArticles[0].category}
                    </span>
                    {recentArticles[0].readTime && (
                      <span className="rounded-lg bg-[var(--color-accent)]/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        <Clock size={10} className="inline mr-1" />
                        {recentArticles[0].readTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-7 md:p-9">
                  <div>
                    <div className="mb-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/40">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[var(--color-accent)]" />
                        {formatDate(recentArticles[0].createdAt)}
                      </div>
                    </div>
                    <h3 className="mb-4 text-3xl font-serif leading-[1.12] text-ink transition-colors group-hover:text-[var(--color-accent)] md:text-4xl lg:text-5xl">
                      {recentArticles[0].title}
                    </h3>
                    <p className="mb-4 text-base font-normal leading-relaxed text-black/64 line-clamp-2 md:text-lg">
                      {recentArticles[0].excerpt ||
                        'Un contenuto pensato per ispirarti davvero e aiutarti a capire se questo luogo merita di entrare nei tuoi prossimi piani.'}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                      {recentArticles[0].tripIntents?.[0] && (
                        <span className="rounded-full bg-[var(--color-sand)] px-3 py-1">
                          {recentArticles[0].tripIntents[0]}
                        </span>
                      )}
                      {recentArticles[0].budgetBand && (
                        <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[var(--color-accent-text)]">
                          Budget {recentArticles[0].budgetBand}
                        </span>
                      )}
                      {(recentArticles[0].verifiedAt || recentArticles[0].updatedAt) && (
                        <span className="rounded-full bg-black/4 px-3 py-1">
                          Verificato{' '}
                          {formatDate(
                            (recentArticles[0].verifiedAt ||
                              recentArticles[0].updatedAt) as DateValue
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink mt-auto group-hover:text-[var(--color-accent)] transition-colors">
                    Apri il contenuto
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Articoli Secondari */}
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:gap-6 lg:col-span-4">
              {recentArticles.slice(1, 3).map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="flex-1"
                >
                  <Link
                    to={getPublicArticlePath(article)}
                    className="group relative flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-black/8 bg-white transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <OptimizedImage
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-lg bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-ink">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 lg:p-6">
                      <div className="mb-2 flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-black/40">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[var(--color-accent)]" />
                          {formatDate(article.createdAt)}
                        </div>
                      </div>
                      <h3 className="mb-3 text-lg font-serif leading-[1.2] text-ink transition-colors group-hover:text-[var(--color-accent)] lg:text-2xl">
                        {article.title}
                      </h3>
                      <div className="mt-auto space-y-3">
                        <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-black/38">
                          {article.tripIntents?.[0] && (
                            <span className="rounded-full bg-[var(--color-sand)] px-3 py-1">
                              {article.tripIntents[0]}
                            </span>
                          )}
                          {article.budgetBand && (
                            <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[var(--color-accent-text)]">
                              {article.budgetBand}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-auto inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink group-hover:text-[var(--color-accent)] transition-colors">
                        Leggi <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-y border-black/8 py-16">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                Archivio in costruzione
              </span>
              <h3 className="mt-2 text-3xl font-serif text-ink">Le storie stanno arrivando.</h3>
              <p className="mt-3 text-base leading-relaxed text-black/60">
                Intanto puoi esplorare l'archivio per luogo o per esperienza e salvare le prime idee
                per il prossimo viaggio.
              </p>
              <Link
                to="/destinazioni"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Esplora l'archivio <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function getArticleSchema(articles: Article[], usingPreviews: boolean) {
  if (usingPreviews) return [];
  return articles.map((article) => ({
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.image,
    url: `${SITE_URL}${getPublicArticlePath(article)}`,
    publisher: { '@type': 'Organization', name: 'Travelliniwithus' },
  }));
}
