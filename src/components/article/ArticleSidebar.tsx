import { BookOpen } from 'lucide-react';
import ShareButtons from './ShareButtons';
import TableOfContents from './TableOfContents';
import Newsletter from '../Newsletter';
import type { TocItem } from './types';

interface ArticleSidebarProps {
  tocItems: TocItem[];
  activeTocId?: string | null;
  articleUrl: string;
  articleTitle: string;
  articleDescription: string;
  articleImage: string;
  onCopyLink: () => void;
  onOpenReadingMode?: () => void;
  readingProgress?: number;
}

export default function ArticleSidebar({
  activeTocId,
  tocItems,
  articleUrl,
  articleTitle,
  articleDescription,
  articleImage,
  onCopyLink,
  onOpenReadingMode,
  readingProgress = 0,
}: ArticleSidebarProps) {
  const activeItem = tocItems.find((item) => item.id === activeTocId && item.show);
  const progressPercent = Math.round(readingProgress * 100);

  return (
    <div className="hidden xl:block">
      <div className="sticky top-32 p-8 border border-[var(--color-border)] bg-[var(--color-muted-bg)]/50 backdrop-blur-sm rounded-[var(--radius-lg)] shadow-sm mb-8">
        <div className="mb-8 rounded-[var(--radius-md)] bg-white p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Lettura
            </span>
            <span className="font-serif text-lg text-[var(--color-ink)]">{progressPercent}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] origin-left transition-transform duration-200 ease-out"
              style={{ transform: `scaleX(${readingProgress})` }}
            />
          </div>
          {activeItem && (
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-fg-2)]">
              Ora: <span className="font-medium text-[var(--color-ink)]">{activeItem.label}</span>
            </p>
          )}
        </div>

        <h4
          id="indice"
          className="font-serif text-2xl mb-8 border-b border-[var(--color-border)] pb-4"
        >
          In questa guida
        </h4>
        <TableOfContents
          activeId={activeTocId}
          items={tocItems}
          readingProgress={readingProgress}
          variant="desktop"
        />

        {onOpenReadingMode && (
          <button
            type="button"
            onClick={onOpenReadingMode}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-all hover:border-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
          >
            <BookOpen size={14} /> Modalita lettura
          </button>
        )}

        <div className="mt-10 pt-10 border-t border-black/10">
          <h4 className="font-serif text-2xl mb-6 text-[var(--color-ink)]">Condividi</h4>
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
