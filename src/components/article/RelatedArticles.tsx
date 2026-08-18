import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Plus } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '../OptimizedImage';
import { trackEvent } from '../../services/analytics';
import { rankByInterest } from '../../config/audienceInterests';
import { usePersonalizedInterest } from '../../hooks/usePersonalizedInterest';
import { scoreArticles } from '../../utils/recommendations';
import type { ArticleData, RelatedArticleSummary } from './types';

const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP = 6;

interface RelatedArticlesProps {
  relatedArticles: RelatedArticleSummary[];
  demoRelatedArticles: [string, ArticleData][];
}

function RelatedCard({
  to,
  title,
  image,
  category,
  date,
}: {
  to: string;
  title: string;
  image: string;
  category: string;
  date?: string;
}) {
  return (
    <Link to={to} className="group block">
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)]">
        <OptimizedImage
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute left-6 top-6">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
            {category}
          </span>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-[var(--color-accent)]" />
          <span>{date || 'In evidenza'}</span>
        </div>
      </div>
      <h4 className="text-2xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent-text)]">
        {title}
      </h4>
    </Link>
  );
}

export default function RelatedArticles({
  relatedArticles,
  demoRelatedArticles,
}: RelatedArticlesProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const { interest } = usePersonalizedInterest();

  const personalizedArticles = useMemo(
    () => rankByInterest(scoreArticles(relatedArticles), interest, (article) => [article.category]),
    [interest, relatedArticles]
  );

  const hasRelated = personalizedArticles.length > 0;
  const totalCount = hasRelated ? personalizedArticles.length : demoRelatedArticles.length;
  const hasMore = visibleCount < totalCount;
  const remaining = totalCount - visibleCount;
  const nextStep = Math.min(LOAD_MORE_STEP, remaining);

  const handleLoadMore = () => {
    const next = Math.min(visibleCount + LOAD_MORE_STEP, totalCount);
    trackEvent('related_articles_load_more', {
      from: visibleCount,
      to: next,
      total: totalCount,
    });
    setVisibleCount(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mt-24 border-t border-black/10 pt-12"
    >
      <h3 className="mb-12 text-3xl md:text-4xl font-serif">Potrebbe interessarti anche</h3>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {hasRelated ? (
          personalizedArticles
            .slice(0, visibleCount)
            .map((data) => (
              <RelatedCard
                key={data.id}
                to={`/articolo/${data.id}`}
                title={data.title}
                image={data.image}
                category={data.category}
                date={data.date}
              />
            ))
        ) : demoRelatedArticles.length > 0 ? (
          demoRelatedArticles
            .slice(0, visibleCount)
            .map(([slug, data]) => (
              <RelatedCard
                key={slug}
                to={`/articolo/${slug}`}
                title={data.title}
                image={data.image}
                category={data.category}
                date={data.date}
              />
            ))
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] p-10 md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
              Continua a esplorare
            </p>
            <p className="mt-4 text-base font-normal leading-relaxed text-black/70">
              Stiamo costruendo i collegamenti per tema, luogo e intento di lettura. Nel frattempo
              puoi sfogliare tutto l'archivio editoriale dal finder.
            </p>
            <Link
              to="/esplora"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-text)]"
            >
              Apri Esplora
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent-text)]"
          >
            <Plus size={14} />
            Mostra altri {nextStep} articoli
          </button>
        </div>
      )}
    </motion.div>
  );
}
