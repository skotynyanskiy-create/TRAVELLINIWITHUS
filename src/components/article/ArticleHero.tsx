import { useState } from 'react';
import { motion, MotionValue } from 'motion/react';
import { Clock, Heart, Share2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import { heartPulse } from '../../lib/animations';
import type { ArticleData } from './types';
import { ARTICLE_DISCLOSURE_LABELS } from './types';

interface ArticleHeroProps {
  article: ArticleData;
  authorName: string;
  readingTime: string;
  categoryPath: string;
  isSaved: boolean;
  copied: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  yHero: MotionValue<number>;
}

export default function ArticleHero({
  article,
  authorName,
  readingTime,
  categoryPath,
  isSaved,
  copied,
  onToggleFavorite,
  onShare,
  yHero,
}: ArticleHeroProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const handleFavorite = () => {
    setPulseKey((k) => k + 1);
    onToggleFavorite();
  };

  return (
    <header className="relative h-[70vh] md:h-[85vh] w-full flex items-end pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <motion.div style={{ y: yHero, scale: 1.1 }} className="w-full h-full origin-top">
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover saturate-[0.85] brightness-[0.8]"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex flex-wrap items-center gap-4 mb-8 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Link
              to={categoryPath}
              className="bg-accent text-white px-4 py-1.5 rounded-full shadow-lg shadow-accent/20"
            >
              {article.category}
            </Link>
            {article.type === 'pillar' && (
              <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-white backdrop-blur-sm">
                Guida completa
              </span>
            )}
            <span className="w-8 h-px bg-white/30"></span>
            <span className="flex items-center gap-2 text-white/80">
              <Clock size={14} /> {readingTime} di lettura
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8 tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-sm text-white/70 font-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-semibold uppercase tracking-widest">
                TWU
              </div>
              <span>
                Di <strong className="font-medium text-white">{authorName}</strong>
              </span>
            </div>
            <div className="w-[1px] h-4 bg-white/20 hidden sm:block"></div>
            <span>{article.date}</span>
          </div>

          {(article.disclosureType || article.verifiedAt || article.verifiedContext) && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
              {article.disclosureType && (
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">
                  {ARTICLE_DISCLOSURE_LABELS[article.disclosureType] ?? article.disclosureType}
                </span>
              )}
              {(article.verifiedContext || article.verifiedAt) && (
                <span className="rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/14 px-3 py-1.5">
                  {article.verifiedContext
                    ? `Verificato · ${article.verifiedContext}`
                    : 'Verificato sul posto'}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-3">
        <button
          onClick={handleFavorite}
          aria-label={isSaved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
          className={`w-14 h-14 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all duration-500 ${isSaved ? 'bg-accent text-white border-[var(--color-accent)]' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
        >
          <motion.span
            key={pulseKey}
            variants={heartPulse}
            animate="beat"
            className="flex items-center justify-center"
          >
            <Heart size={24} className={isSaved ? 'fill-current' : ''} />
          </motion.span>
        </button>
        <button
          onClick={onShare}
          aria-label="Condividi articolo"
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition-all duration-500"
        >
          {copied ? <CheckCircle size={24} /> : <Share2 size={24} />}
        </button>
      </div>
    </header>
  );
}
