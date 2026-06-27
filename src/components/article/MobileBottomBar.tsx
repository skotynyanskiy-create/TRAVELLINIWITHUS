import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, List, Share2, CheckCircle } from 'lucide-react';
import { heartPulse } from '../../lib/animations';
import type { ArticleData } from './types';

interface MobileBottomBarProps {
  article: ArticleData;
  activeLabel?: string;
  isSaved: boolean;
  copied: boolean;
  onToggleFavorite: () => void;
  onOpenToc: () => void;
  onShare: () => void;
  readingProgress?: number;
}

export default function MobileBottomBar({
  activeLabel,
  article: _article,
  isSaved,
  copied,
  onToggleFavorite,
  onOpenToc,
  onShare,
  readingProgress = 0,
}: MobileBottomBarProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const handleFavorite = () => {
    setPulseKey((k) => k + 1);
    onToggleFavorite();
  };

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-6 right-6 z-50 lg:hidden">
      <div className="mb-2 overflow-hidden rounded-full border border-white/10 bg-[var(--color-ink)]/88 px-4 py-2 text-white shadow-lg backdrop-blur-xl">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-white/68">
            {activeLabel || 'Lettura'}
          </span>
          <span className="text-[10px] font-bold text-white/80">
            {Math.round(readingProgress * 100)}%
          </span>
        </div>
        <div className="h-0.5 overflow-hidden rounded-full bg-white/14">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${readingProgress})`, transformOrigin: 'left' }}
          />
        </div>
      </div>
      <div className="bg-[var(--color-ink)]/90 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl">
        <button
          onClick={handleFavorite}
          aria-label={isSaved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all ${isSaved ? 'text-accent' : 'text-white'}`}
        >
          <motion.span
            key={pulseKey}
            variants={heartPulse}
            animate="beat"
            className="flex items-center justify-center"
          >
            <Heart size={20} className={isSaved ? 'fill-current' : ''} />
          </motion.span>
          <span className="text-xs uppercase tracking-widest font-bold">Salva</span>
        </button>
        <div className="w-px h-6 bg-white/10"></div>
        <button
          onClick={onOpenToc}
          aria-label="Apri indice dei contenuti"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-full"
        >
          <List size={20} />
          <span className="text-xs uppercase tracking-widest font-bold">Indice</span>
        </button>
        <div className="w-px h-6 bg-white/10"></div>
        <button
          onClick={onShare}
          aria-label="Condividi articolo"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-full"
        >
          {copied ? (
            <CheckCircle size={20} className="text-[var(--color-accent)]" />
          ) : (
            <Share2 size={20} />
          )}
          <span className="text-xs uppercase tracking-widest font-bold">
            {copied ? 'Copiato!' : 'Condividi'}
          </span>
        </button>
      </div>
    </div>
  );
}
