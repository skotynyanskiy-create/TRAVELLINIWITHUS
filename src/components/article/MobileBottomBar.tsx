import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Menu, Share2, CheckCircle } from 'lucide-react';
import PinterestIcon from './PinterestIcon';
import { heartPulse } from '../../lib/animations';
import type { ArticleData } from './types';

interface MobileBottomBarProps {
  article: ArticleData;
  isSaved: boolean;
  copied: boolean;
  onToggleFavorite: () => void;
  onOpenToc: () => void;
  onShare: () => void;
}

export default function MobileBottomBar({ article, isSaved, copied, onToggleFavorite, onOpenToc, onShare }: MobileBottomBarProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const handleFavorite = () => {
    setPulseKey((k) => k + 1);
    onToggleFavorite();
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
      <div className="bg-[var(--color-ink)]/90 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl">
        <button
          onClick={handleFavorite}
          aria-label={isSaved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all ${isSaved ? 'text-accent' : 'text-white'}`}
        >
          <motion.span key={pulseKey} variants={heartPulse} animate="beat" className="flex items-center justify-center">
            <Heart size={20} className={isSaved ? 'fill-current' : ''} />
          </motion.span>
          <span className="text-xs uppercase tracking-widest font-bold">{isSaved ? 'Salvato' : 'Salva'}</span>
        </button>
        <div className="w-px h-6 bg-white/10"></div>
        <button
          onClick={onOpenToc}
          aria-label="Apri indice dei contenuti"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-full"
        >
          <Menu size={20} />
          <span className="text-xs uppercase tracking-widest font-bold">Indice</span>
        </button>
        <div className="w-px h-6 bg-white/10"></div>
        <a
          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&media=${encodeURIComponent(article.image || '')}&description=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-full"
          aria-label="Salva su Pinterest"
        >
          <PinterestIcon size={20} />
          <span className="text-xs uppercase tracking-widest font-bold">Pin</span>
        </a>
        <div className="w-px h-6 bg-white/10"></div>
        <button
          onClick={onShare}
          aria-label="Condividi articolo"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-full"
        >
          {copied ? <CheckCircle size={20} className="text-[var(--color-accent)]" /> : <Share2 size={20} />}
          <span className="text-xs uppercase tracking-widest font-bold">{copied ? 'Copiato!' : 'Link'}</span>
        </button>
      </div>
    </div>
  );
}
