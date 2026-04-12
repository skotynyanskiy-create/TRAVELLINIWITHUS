import ShareButtons from './ShareButtons';
import TableOfContents from './TableOfContents';
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

      {/* Newsletter Sidebar Widget */}
      <div className="bg-ink p-10 rounded-4xl text-white overflow-hidden relative shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <h4 className="font-serif text-2xl mb-4 relative z-10 text-accent">Travel Insights</h4>
        <p className="text-white/80 text-sm font-light mb-8 relative z-10 leading-relaxed">
          Ricevi idee viaggio, guide e risorse premium per organizzare al meglio le tue prossime partenze.
        </p>
        <button
          onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
          className="relative z-10 w-full py-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest hover:bg-accent hover:border-accent transition-all"
        >
          Iscriviti Ora
        </button>
      </div>
    </div>
  );
}
