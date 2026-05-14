import { BookOpen } from 'lucide-react';
import ShareButtons from './ShareButtons';
import TableOfContents from './TableOfContents';
import Newsletter from '../Newsletter';
import type { TocItem } from './types';

interface ArticleSidebarProps {
  tocItems: TocItem[];
  articleUrl: string;
  articleTitle: string;
  articleDescription: string;
  articleImage: string;
  onCopyLink: () => void;
  onOpenReadingMode?: () => void;
}

export default function ArticleSidebar({
  tocItems,
  articleUrl,
  articleTitle,
  articleDescription,
  articleImage,
  onCopyLink,
  onOpenReadingMode,
}: ArticleSidebarProps) {
  return (
    <div className="lg:w-1/3 hidden lg:block">
      <div className="sticky top-32 p-8 border border-zinc-200 bg-zinc-50/50 backdrop-blur-sm rounded-[var(--radius-lg)] shadow-sm mb-8">
        <h4 id="indice" className="font-serif text-2xl mb-8 border-b border-zinc-200 pb-4">
          Indice
        </h4>
        <TableOfContents items={tocItems} variant="desktop" />

        {onOpenReadingMode && (
          <button
            type="button"
            onClick={onOpenReadingMode}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] transition-all hover:border-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
          >
            <BookOpen size={14} /> Modalita lettura
          </button>
        )}

        <div className="mt-10 pt-10 border-t border-black/10">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-black/40">
            Condividi l&apos;ispirazione
          </h4>
          <ShareButtons
            articleUrl={articleUrl}
            articleTitle={articleTitle}
            articleDescription={articleDescription}
            articleImage={articleImage}
            onCopyLink={onCopyLink}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-ink)] p-8 text-white shadow-lg">
        <h4 className="mb-3 font-serif text-2xl text-[var(--color-accent)]">Travel insights</h4>
        <p className="mb-6 text-sm font-light leading-relaxed text-white/70">
          Ricevi guide pratiche e posti da salvare quando pubblichiamo contenuti davvero utili.
        </p>
        <Newsletter variant="compact" source="article_sidebar" />
      </div>
    </div>
  );
}
