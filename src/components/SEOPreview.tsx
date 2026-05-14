import React from 'react';
import { Globe, Share2 } from 'lucide-react';

interface SEOPreviewProps {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  type?: 'article' | 'product';
}

export default function SEOPreview({
  title,
  description,
  slug,
  imageUrl,
  type = 'article',
}: SEOPreviewProps) {
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}/${type === 'article' ? 'articolo' : 'shop'}/${slug}`;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-muted-bg)] flex items-center gap-2">
        <Globe size={18} className="text-[var(--color-muted-fg)]" />
        <h3 className="text-sm font-semibold text-[var(--color-ink-2)] uppercase tracking-wider">
          Anteprima SEO & Social
        </h3>
      </div>

      <div className="p-6 space-y-8">
        {/* Google Preview */}
        <div>
          <p className="text-xs text-[var(--color-muted-fg)] mb-2 font-mono">
            Google Search Result
          </p>
          <div className="max-w-[600px]">
            <p className="text-[#1a0dab] text-xl hover:underline cursor-pointer mb-1 truncate">
              {title || 'Titolo della pagina'} | Senza Confini
            </p>
            <p className="text-[#006621] text-sm mb-1 truncate">{fullUrl}</p>
            <p className="text-[#4d5156] text-sm line-clamp-2">
              {description ||
                'Inserisci una descrizione o un riassunto per vedere come apparirà nei risultati di ricerca di Google...'}
            </p>
          </div>
        </div>

        {/* Social Preview (Open Graph) */}
        <div>
          <p className="text-xs text-[var(--color-muted-fg)] mb-2 font-mono flex items-center gap-1">
            <Share2 size={12} /> Social Share (Facebook/LinkedIn/WhatsApp)
          </p>
          <div className="max-w-[500px] border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#f2f3f5]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-48 bg-[var(--color-muted-bg-2)] flex items-center justify-center text-[var(--color-muted-fg)]">
                Nessuna immagine
              </div>
            )}
            <div className="p-3">
              <p className="text-[12px] text-[var(--color-muted-fg)] uppercase font-medium mb-1">
                senza-confini.it
              </p>
              <p className="text-[16px] font-bold text-[var(--color-ink)] mb-1 truncate">
                {title || 'Titolo della pagina'}
              </p>
              <p className="text-[14px] text-[var(--color-ink-2)] line-clamp-1">
                {description || 'Descrizione per i social...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
