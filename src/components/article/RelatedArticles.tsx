import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import type { ArticleData, RelatedArticleSummary } from './types';
import { getPublicArticlePath } from '../../utils/articleRoutes';

interface RelatedArticlesProps {
  relatedArticles: RelatedArticleSummary[];
  demoRelatedArticles: [string, ArticleData][];
  fallbackHref?: string;
  fallbackLabel?: string;
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
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[2rem]">
        <OptimizedImage
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute left-6 top-6">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
            {category}
          </span>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-[var(--color-accent)]" />
          <span>{date || 'In evidenza'}</span>
        </div>
        <span className="h-1 w-1 rounded-full bg-black/10" />
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-[var(--color-accent)]" />
          <span>5 min</span>
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
  fallbackHref = '/guide',
  fallbackLabel = 'Vai alle guide',
}: RelatedArticlesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mt-24 border-t border-black/10 pt-12"
    >
      <h3 className="mb-12 text-3xl font-serif">Potrebbe interessarti anche</h3>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {relatedArticles.length > 0 ? (
          relatedArticles.map((data) => (
            <RelatedCard
              key={data.id}
              to={getPublicArticlePath({ slug: data.id, category: data.category })}
              title={data.title}
              image={data.image}
              category={data.category}
              date={data.date}
            />
          ))
        ) : demoRelatedArticles.length > 0 ? (
          demoRelatedArticles.map(([slug, data]) => (
            <RelatedCard
              key={slug}
              to={getPublicArticlePath({ slug, category: data.category, type: data.type })}
              title={data.title}
              image={data.image}
              category={data.category}
              date={data.date}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-10 md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
              Nessun correlato disponibile
            </p>
            <p className="mt-4 text-base font-normal leading-relaxed text-black/70">
              Quando inizierai a pubblicare i contenuti reali, qui potremo mostrare articoli
              collegati in modo più preciso per tema, luogo o intento di lettura.
            </p>
            <Link
              to={fallbackHref}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-text)]"
            >
              {fallbackLabel}
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
