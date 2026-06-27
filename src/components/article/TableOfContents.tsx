import type { TocItem } from './types';

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string | null;
  onItemClick?: () => void;
  readingProgress?: number;
  variant?: 'desktop' | 'mobile-inline' | 'mobile-overlay';
}

export default function TableOfContents({
  activeId,
  items,
  onItemClick,
  readingProgress = 0,
  variant = 'desktop',
}: TableOfContentsProps) {
  const visibleItems = items.filter((item) => item.show);
  const progressPercent = Math.round(readingProgress * 100);

  if (variant === 'mobile-inline') {
    return (
      <div
        id="indice-mobile"
        className="mb-12 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] p-6 scroll-mt-32 lg:hidden md:p-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <h4 className="font-serif text-xl text-[var(--color-ink)]">In questa guida</h4>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
            {progressPercent}%
          </span>
        </div>
        <div className="mb-6 h-1 overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${readingProgress})`, transformOrigin: 'left' }}
          />
        </div>
        <ul className="m-0 grid list-none gap-3 pl-0 text-sm font-medium text-black/60">
          {visibleItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id} className="m-0">
                <a
                  href={`#${item.id}`}
                  onClick={onItemClick}
                  aria-current={isActive ? 'location' : undefined}
                  className={`flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-1.5 transition-all hover:text-[var(--color-accent)] ${
                    isActive ? 'bg-white text-[var(--color-ink)] shadow-sm' : ''
                  }`}
                >
                  <span
                    className={`h-px transition-all ${
                      isActive ? 'w-6 bg-[var(--color-accent)]' : 'w-4 bg-black/10'
                    }`}
                  ></span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (variant === 'mobile-overlay') {
    return (
      <div>
        <div className="mb-8 h-1 overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${readingProgress})`, transformOrigin: 'left' }}
          />
        </div>
        <ul className="m-0 list-none space-y-5 pl-0">
          {visibleItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li
                key={item.id}
                className="m-0 border-b border-black/5 pb-5 last:border-0 last:pb-0"
              >
                <a
                  href={`#${item.id}`}
                  onClick={onItemClick}
                  aria-current={isActive ? 'location' : undefined}
                  className={`flex items-center justify-between rounded-[var(--radius-sm)] py-1 font-serif text-xl transition-colors ${
                    isActive
                      ? 'text-[var(--color-accent-text)]'
                      : 'text-black hover:text-[var(--color-accent)]'
                  }`}
                >
                  {item.label}
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={
                      isActive ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-accent)]'
                    }
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Desktop sidebar variant
  return (
    <ul className="space-y-5 text-sm font-medium text-[var(--color-muted-fg)] list-none pl-0 m-0">
      {visibleItems.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id} className="m-0">
            <a
              href={`#${item.id}`}
              aria-current={isActive ? 'location' : undefined}
              data-active={isActive ? 'true' : undefined}
              className={`flex items-center gap-4 hover:text-accent transition-all group ${
                isActive ? 'text-[var(--color-ink)] font-semibold' : ''
              }`}
            >
              <span
                className={`h-px transition-all group-hover:bg-accent group-hover:w-8 ${
                  isActive ? 'w-8 bg-[var(--color-accent)]' : 'w-5 bg-[var(--color-muted-bg-2)]'
                }`}
              ></span>
              <span>{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
