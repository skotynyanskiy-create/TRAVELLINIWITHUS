import { Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import PinterestIcon from './PinterestIcon';

interface ShareButtonsProps {
  articleUrl: string;
  articleTitle: string;
  articleDescription: string;
  articleImage: string;
  onCopyLink: () => void;
}

export default function ShareButtons({ articleUrl, articleTitle, articleDescription, articleImage, onCopyLink }: ShareButtonsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : articleUrl;

  return (
    <div className="flex gap-4 flex-wrap">
      <button onClick={onCopyLink} title="Copia link" aria-label="Copia link articolo" className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm">
        <LinkIcon size={18} />
      </button>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" title="Condividi su Facebook" aria-label="Condividi su Facebook" className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center hover:bg-[var(--color-social-facebook)] hover:text-white hover:border-[var(--color-social-facebook)] transition-all shadow-sm">
        <Facebook size={18} />
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(articleTitle)}`} target="_blank" rel="noopener noreferrer" title="Condividi su X" aria-label="Condividi su X" className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center hover:bg-[var(--color-social-twitter)] hover:text-white hover:border-[var(--color-social-twitter)] transition-all shadow-sm">
        <Twitter size={18} />
      </a>
      <a
        href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(articleImage || '')}&description=${encodeURIComponent(articleTitle + ' — ' + articleDescription)}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Salva su Pinterest"
        aria-label="Salva su Pinterest"
        className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center hover:bg-[var(--color-social-pinterest)] hover:text-white hover:border-[var(--color-social-pinterest)] transition-all shadow-sm"
      >
        <PinterestIcon size={18} />
      </a>
    </div>
  );
}
