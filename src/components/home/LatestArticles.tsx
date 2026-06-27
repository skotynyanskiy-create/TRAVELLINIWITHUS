import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
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
import { LITE_MODE } from '../../config/liteMode';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { IMAGE_WIPE_EASE } from '../../lib/animations';

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
            <h2 className="mt-1 text-3xl font-serif text-ink md:text-5xl">
              Storie da leggere prima di partire.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-black/60">
              Luoghi, atmosfere e dettagli utili per capire cosa salvare per il prossimo viaggio.
            </p>
          </div>
          {!LITE_MODE && (
            <Link
              to="/esplora"
              className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-transform hover:translate-x-0.5 sm:inline-flex"
            >
              Tutti gli articoli <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {loadingArticles ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : articlesGrid.length > 0 ? (
          <MagazineGrid articles={articlesGrid} />
        ) : (
          <div className="border-y border-black/8 py-16">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                Archivio in costruzione
              </span>
              <h3 className="mt-2 text-3xl font-serif text-ink">Le storie stanno arrivando.</h3>
              <p className="mt-3 text-base leading-relaxed text-black/60">
                {LITE_MODE
                  ? 'Iscriviti alla newsletter per ricevere il primo pillar appena pubblicato.'
                  : "Intanto puoi esplorare l'archivio per luogo o per esperienza."}
              </p>
              {!LITE_MODE && (
                <Link
                  to="/esplora"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
                >
                  Esplora l&apos;archivio <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}

        {!LITE_MODE && (
          <div className="mt-12 flex justify-center sm:hidden">
            <Link
              to="/esplora"
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Tutti gli articoli <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

type CardVariant = 'cover' | 'sub' | 'secondary';

/**
 * Magazine grid asimmetrico stile editorial (ref: Cereal, Kinfolk):
 * 1 cover story dominante + 2 sub-feature + 3 secondary su lg.
 * Riusa la stessa ArticleCard con tre varianti di proporzioni.
 *
 * Layout 12-col lg:
 *  ┌────────────────────┬──────────┐
 *  │   COVER (col-7)    │ SUB (5)  │
 *  │                    ├──────────┤
 *  │                    │ SUB (5)  │
 *  ├──────┬──────┬──────┴──────────┘
 *  │ SEC  │ SEC  │ SEC              (col-4 ognuna)
 *  └──────┴──────┴──────┘
 */
function MagazineGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  const [cover, ...rest] = articles;
  if (articles.length === 1) {
    return (
      <div className="mx-auto max-w-3xl">
        <ArticleCard article={cover} variant="cover" index={0} />
      </div>
    );
  }

  const subFeatures = rest.slice(0, 2);
  const secondary = rest.slice(2, 5);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
      <ArticleCard
        article={cover}
        variant="cover"
        index={0}
        className="lg:col-span-7 lg:row-span-2"
      />
      {subFeatures.map((article, idx) => (
        <ArticleCard
          key={article.id || article.slug}
          article={article}
          variant="sub"
          index={idx + 1}
          className="lg:col-span-5"
        />
      ))}
      {secondary.map((article, idx) => (
        <ArticleCard
          key={article.id || article.slug}
          article={article}
          variant="secondary"
          index={idx + 3}
          className="lg:col-span-4"
        />
      ))}
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  variant: CardVariant;
  index: number;
  className?: string;
}

function ArticleCard({ article, variant, index, className = '' }: ArticleCardProps) {
  const href = `/articolo/${article.slug || article.id}`;
  const reducedMotion = useReducedMotion();

  const aspect = {
    cover: 'aspect-[16/11] lg:aspect-[16/12]',
    sub: 'aspect-[16/10]',
    secondary: 'aspect-[16/10]',
  }[variant];

  const titleSize = {
    cover: 'text-2xl leading-[1.15] md:text-4xl lg:text-5xl',
    sub: 'text-xl leading-tight md:text-2xl',
    secondary: 'text-lg leading-snug md:text-xl',
  }[variant];

  const showExcerpt = variant !== 'secondary';
  const showMeta = variant !== 'secondary';

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-premium)] ${className}`}
    >
      <Link to={href} className={`relative block overflow-hidden ${aspect}`}>
        <motion.div
          className="h-full w-full"
          initial={reducedMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
          whileInView={reducedMotion ? {} : { clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: IMAGE_WIPE_EASE, delay: index * 0.06 + 0.1 }}
        >
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
        </motion.div>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
          {article.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {showMeta && (
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
        )}
        <Link to={href} className="block">
          <h3
            className={`line-clamp-3 font-serif text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-text)] ${titleSize}`}
          >
            {article.title}
          </h3>
        </Link>
        {showExcerpt && article.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-black/60">{article.excerpt}</p>
        )}
        <Link
          to={href}
          className="mt-auto inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
        >
          Leggi{' '}
          <ArrowRight
            size={12}
            className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.article>
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
