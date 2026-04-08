import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../../services/firebaseService';
import OptimizedImage from '../OptimizedImage';
import ArticleSkeleton from '../ArticleSkeleton';
import Section from '../Section';
import { SITE_URL } from '../../config/site';
import { siteContentDefaults } from '../../config/siteContent';
import { DEMO_ARTICLE_PREVIEW } from '../../config/demoContent';
import { useSiteContent } from '../../hooks/useSiteContent';
import { formatDateValue, toMillis, type DateValue } from '../../utils/dateValue';
import { DEMO_CONTENT_ENABLED } from '../../config/runtime';
import type { HomeContent } from '../../config/siteContent';

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
}

const EDITORIAL_PREVIEWS: Article[] = [DEMO_ARTICLE_PREVIEW];

function getArticleLocation(article: Article) {
  return article.city || article.region || article.country || article.continent || article.category;
}

function getDecisionLine(article: Article, fallback: string) {
  if (article.excerpt?.trim()) {
    return article.excerpt.trim();
  }

  const location = getArticleLocation(article);
  return location
    ? `${fallback} Inizia da ${location} e capisci in fretta se il taglio di questo viaggio fa davvero per te.`
    : fallback;
}

function formatDate(dateInput: DateValue) {
  return formatDateValue(dateInput);
}

interface LatestArticlesProps {
  content: HomeContent['editorial'];
}

export default function LatestArticles({ content }: LatestArticlesProps) {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const editorialDemoEnabled = DEMO_CONTENT_ENABLED && demoSettings.showEditorialDemo;

  const { data: recentArticlesData, isLoading: loadingArticles } = useQuery<{
    articles: Article[];
    usingExamples: boolean;
  }>({
    queryKey: ['articles', 'recent', editorialDemoEnabled],
    queryFn: async () => {
      const fetched = await fetchArticles();
      const sorted = [...fetched].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      if (sorted.length === 0) {
        return {
          articles: editorialDemoEnabled ? EDITORIAL_PREVIEWS : [],
          usingExamples: editorialDemoEnabled,
        };
      }
      return { articles: sorted.slice(0, 5) as Article[], usingExamples: false };
    },
  });

  const recentArticles = recentArticlesData?.articles ?? [];

  return (
    <Section className="bg-[var(--color-sand)]" spacing="spacious">
      <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.75fr)] lg:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-accent)]">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 max-w-4xl text-4xl font-serif leading-[1] text-[var(--color-ink)] md:text-5xl lg:text-[3.7rem]">
            {content.title}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/42">
            {content.helperLabel}
          </div>
          <p className="max-w-xl text-base leading-relaxed text-black/65">{content.description}</p>
          <Link
            to="/destinazioni"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all hover:gap-3 hover:text-[var(--color-accent-warm)]"
          >
            {content.ctaLabel}
            <ArrowRight size={14} />
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.82fr)]">
          <Link
            to={`/articolo/${recentArticles[0].slug || recentArticles[0].id}`}
            className="group relative block overflow-hidden rounded-[2.3rem] bg-white shadow-[var(--shadow-editorial)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[var(--shadow-editorial)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <OptimizedImage
                src={recentArticles[0].image}
                alt={recentArticles[0].title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: 'var(--color-overlay-card-strong)' }} />
              <div className="absolute left-6 top-6 rounded-full border border-white/14 bg-black/28 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
                {content.reasonToOpen}
              </div>
            </div>

            <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/42">
                  <span className="rounded-full bg-[var(--color-gold-soft)] px-3 py-1.5 text-[var(--color-accent-text)]">
                    {recentArticles[0].category}
                  </span>
                  {recentArticles[0].createdAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} className="text-[var(--color-accent)]" />
                      {formatDate(recentArticles[0].createdAt)}
                    </span>
                  )}
                  {getArticleLocation(recentArticles[0]) && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} className="text-[var(--color-accent)]" />
                      {getArticleLocation(recentArticles[0])}
                    </span>
                  )}
                </div>

                <h3 className="max-w-4xl text-3xl font-serif leading-[1.04] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-warm)] md:text-4xl lg:text-[3rem]">
                  {recentArticles[0].title}
                </h3>

                <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/70 md:text-lg">
                  {getDecisionLine(recentArticles[0], content.reasonToOpen)}
                </p>
              </div>

              <div className="space-y-5 rounded-[1.8rem] border border-black/6 bg-[var(--color-sand)] px-5 py-5">
                {recentArticles[0].readTime && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55">
                    <Clock size={12} className="text-[var(--color-accent)]" />
                    {recentArticles[0].readTime}
                  </div>
                )}
                <div className="text-sm leading-relaxed text-black/62">
                  Una storia da aprire quando vuoi capire se il posto e davvero allineato al tuo modo di viaggiare.
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all group-hover:gap-3 group-hover:text-[var(--color-accent-warm)]">
                  Leggi l articolo
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
            {recentArticles.slice(1, 3).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/articolo/${article.slug || article.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <OptimizedImage
                      src={article.image}
                      alt={article.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'var(--color-overlay-card-soft)' }} />
                  </div>

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/42">
                      <span>{article.category}</span>
                      {article.createdAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={11} className="text-[var(--color-accent)]" />
                          {formatDate(article.createdAt)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-serif leading-[1.12] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-warm)]">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-black/62">
                      {getDecisionLine(article, content.reasonToOpen)}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all group-hover:gap-3 group-hover:text-[var(--color-accent-warm)]">
                      Apri la storia
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500">Nessun contenuto disponibile al momento.</div>
      )}
    </Section>
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
