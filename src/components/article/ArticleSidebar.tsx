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
}

export default function ArticleSidebar({
  tocItems,
  articleUrl,
  articleTitle,
  articleDescription,
  articleImage,
  onCopyLink,
}: ArticleSidebarProps) {
  return (
    <div className="lg:w-1/3 hidden lg:block">
      <div className="sticky top-32 p-8 border border-zinc-200 bg-zinc-50/50 backdrop-blur-sm rounded-[2.5rem] shadow-sm mb-8">
        <h4 id="indice" className="font-serif text-2xl mb-8 border-b border-zinc-200 pb-4">Indice</h4>
        <TableOfContents items={tocItems} variant="desktop" />

        <div className="mt-12 pt-10 border-t border-black/10">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-black/40">Condividi l&apos;ispirazione</h4>
          <ShareButtons
            articleUrl={articleUrl}
            articleTitle={articleTitle}
            articleDescription={articleDescription}
            articleImage={articleImage}
            onCopyLink={onCopyLink}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-[var(--color-ink)] p-8 text-white shadow-lg">
        <h4 className="mb-3 font-serif text-2xl text-[var(--color-accent)]">Travel insights</h4>
        <p className="mb-6 text-sm font-light leading-relaxed text-white/70">
          Ricevi guide pratiche e posti da salvare quando pubblichiamo contenuti davvero utili.
        </p>
        <Newsletter variant="compact" source="article_sidebar" />
      </div>
    </div>
  );
}
