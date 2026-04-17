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

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  readTime?: string;
  createdAt?: DateValue;
  excerpt?: string;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  experienceTypes?: string[];
}

const EDITORIAL_PREVIEWS: Article[] = [DEMO_ARTICLE_PREVIEW, ...DEMO_ARTICLES_EXTRA];

function formatDate(dateInput: DateValue) {
  return formatDateValue(dateInput);
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
      const sorted = [...fetched].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      if (sorted.length === 0) {
        return {
          articles: demoSettings.showEditorialDemo ? EDITORIAL_PREVIEWS : [],
          usingExamples: demoSettings.showEditorialDemo,
        };
      }
      return { articles: sorted.slice(0, 3) as Article[], usingExamples: false };
    },
  });

  const recentArticles = recentArticlesData?.articles ?? [];

  return (
    <section id="storie" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Editoriale
            </span>
            <h2 className="mt-1 text-3xl font-serif text-ink md:text-4xl">
              Storie da leggere prima di partire.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-black/60">
              Luoghi, atmosfere e dettagli utili per capire cosa salvare per il prossimo viaggio.
            </p>
          </div>
          <Link
            to="/guide"
            className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-transform hover:translate-x-0.5 sm:inline-flex"
          >
            Tutte le guide <ArrowRight size={12} />
          </Link>
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
                to={`/articolo/${recentArticles[0].slug || recentArticles[0].id}`}
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
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink mt-auto group-hover:text-[var(--color-accent)] transition-colors">
                    Leggi l'articolo
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
                    to={`/articolo/${article.slug || article.id}`}
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
    url: `${SITE_URL}/articolo/${article.slug || article.id}`,
    publisher: { '@type': 'Organization', name: 'Travelliniwithus' },
  }));
}
