import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import type { ArticleData, RelatedArticleSummary } from './types';

interface RelatedArticlesProps {
  relatedArticles: RelatedArticleSummary[];
  demoRelatedArticles: [string, ArticleData][];
}

export default function RelatedArticles({ relatedArticles, demoRelatedArticles }: RelatedArticlesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-24 pt-12 border-t border-black/10"
    >
      <h3 className="text-3xl font-serif mb-12">Potrebbe interessarti anche</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {relatedArticles.length > 0 ? relatedArticles.map((data) => (
          <Link key={data.id} to={`/articolo/${data.id}`} className="group block">
            <div className="overflow-hidden rounded-[2rem] mb-6 aspect-[16/10] relative">
              <OptimizedImage src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold text-ink shadow-sm">
                  {data.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] font-bold text-black/30 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-accent" />
                <span>{data.date || 'Recente'}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-black/10"></span>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-accent" />
                <span>5 min</span>
              </div>
            </div>
            <h4 className="text-2xl font-serif group-hover:text-accent transition-colors leading-tight">{data.title}</h4>
          </Link>
        )) : demoRelatedArticles.length > 0 ? demoRelatedArticles.map(([s, data]) => (
          <Link key={s} to={`/articolo/${s}`} className="group block">
            <div className="overflow-hidden rounded-[2rem] mb-6 aspect-[16/10] relative">
              <OptimizedImage src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold text-ink shadow-sm">
                  {data.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] font-bold text-black/30 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-accent" />
                <span>Recente</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-black/10"></span>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-accent" />
                <span>5 min</span>
              </div>
            </div>
            <h4 className="text-2xl font-serif group-hover:text-accent transition-colors leading-tight">{data.title}</h4>
          </Link>
        )) : (
          <div className="md:col-span-2 rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-10">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-accent">
              Nessun correlato disponibile
            </p>
            <p className="mt-4 text-base font-normal leading-relaxed text-black/70">
              Quando inizierai a pubblicare i contenuti reali, qui potremo mostrare articoli collegati in modo
              più preciso per tema, luogo o intento di lettura.
            </p>
            <Link
              to="/guide"
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-ink transition-colors hover:text-accent"
            >
              Vai alle guide
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
