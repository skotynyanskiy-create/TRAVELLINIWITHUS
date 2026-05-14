import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../../services/firebaseService';
import ArticleSkeleton from '../ArticleSkeleton';
import OptimizedImage from '../OptimizedImage';
import { SITE_URL } from '../../config/site';
import { siteContentDefaults } from '../../config/siteContent';
import { DEMO_ARTICLE_PREVIEW, DEMO_ARTICLES_EXTRA } from '../../config/demoContent';
import { useSiteContent } from '../../hooks/useSiteContent';
import { toMillis, type DateValue } from '../../utils/dateValue';

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
      return { articles: sorted.slice(0, 6) as Article[], usingExamples: false };
    },
  });

  const recentArticles = (recentArticlesData?.articles ?? []) as Article[];
  const articlesGrid = recentArticles.slice(0, 6);

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
            Tutti gli articoli <ArrowRight size={12} />
          </Link>
        </div>

        {loadingArticles ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : articlesGrid.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articlesGrid.map((article, index) => (
              <motion.article
                key={article.id || article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group flex h-full min-h-[420px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <Link
                  to={`/articolo/${article.slug || article.id}`}
                  className="relative block aspect-[16/10] overflow-hidden"
                >
                  <OptimizedImage
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] backdrop-blur-md">
                    {article.category}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} className="text-[var(--color-accent)]" />
                      {article.country || article.continent || 'In evidenza'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} className="text-[var(--color-accent)]" />
                      {article.readTime || '5 min'}
                    </span>
                  </div>
                  <Link to={`/articolo/${article.slug || article.id}`} className="block">
                    <h3 className="line-clamp-2 text-xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-text)] md:text-2xl">
                      {article.title}
                    </h3>
                  </Link>
                  {article.excerpt && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-black/60">
                      {article.excerpt}
                    </p>
                  )}
                  <Link
                    to={`/articolo/${article.slug || article.id}`}
                    className="mt-auto inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    Leggi <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="border-y border-black/8 py-16">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                Archivio in costruzione
              </span>
              <h3 className="mt-2 text-3xl font-serif text-ink">Le storie stanno arrivando.</h3>
              <p className="mt-3 text-base leading-relaxed text-black/60">
                Intanto puoi esplorare l&apos;archivio per luogo o per esperienza.
              </p>
              <Link
                to="/destinazioni"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Esplora l&apos;archivio <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center sm:hidden">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Tutti gli articoli <ArrowRight size={12} />
          </Link>
        </div>
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
