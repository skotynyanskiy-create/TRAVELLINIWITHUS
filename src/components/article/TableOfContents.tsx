import type { TocItem } from './types';

interface TableOfContentsProps {
  items: TocItem[];
  onItemClick?: () => void;
  variant?: 'desktop' | 'mobile-inline' | 'mobile-overlay';
}

export default function TableOfContents({ items, onItemClick, variant = 'desktop' }: TableOfContentsProps) {
  const visibleItems = items.filter((item) => item.show);

  if (variant === 'mobile-inline') {
    return (
      <div id="indice-mobile" className="lg:hidden mb-12 p-8 bg-[var(--color-sand)] rounded-3xl border border-black/5 scroll-mt-32">
        <h4 className="font-serif text-xl mb-6 text-accent">Indice dei Contenuti</h4>
        <ul className="space-y-4 text-sm font-medium text-black/60 list-none pl-0 m-0">
          {visibleItems.map((item) => (
            <li key={item.id} className="m-0">
              <a href={`#${item.id}`} onClick={onItemClick} className="flex items-center gap-3 hover:text-accent transition-all">
                <span className="w-4 h-px bg-black/10"></span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'mobile-overlay') {
    return (
      <ul className="space-y-6 list-none pl-0 m-0">
        {visibleItems.map((item) => (
          <li key={item.id} className="m-0 border-b border-black/5 pb-6 last:border-0 last:pb-0">
            <a
              href={`#${item.id}`}
              onClick={onItemClick}
              className="flex items-center justify-between text-xl font-serif text-black hover:text-accent transition-colors"
            >
              {item.label}
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  // Desktop sidebar variant
  return (
    <ul className="space-y-5 text-sm font-medium text-zinc-500 list-none pl-0 m-0">
      {visibleItems.map((item) => (
        <li key={item.id} className="m-0">
          <a href={`#${item.id}`} className="flex items-center gap-4 hover:text-accent transition-all group">
            <span className="w-5 h-px bg-zinc-300 group-hover:bg-accent transition-all group-hover:w-8"></span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
