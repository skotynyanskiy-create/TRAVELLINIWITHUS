import { useEffect, useState } from 'react';
import type { TocItem } from './types';

interface TableOfContentsProps {
  items: TocItem[];
  onItemClick?: () => void;
  variant?: 'desktop' | 'mobile-inline' | 'mobile-overlay';
}

export default function TableOfContents({
  items,
  onItemClick,
  variant = 'desktop',
}: TableOfContentsProps) {
  const visibleItems = items.filter((item) => item.show);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Section "accesa" appena entra nella meta superiore del viewport.
  // Solo desktop: su mobile il TOC e inline/overlay, l'indicatore visivo
  // non serve. Marathon polish 2026-05-18.
  useEffect(() => {
    if (variant !== 'desktop' || typeof window === 'undefined') return;

    const ids = visibleItems.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // Prendi la sezione piu in alto fra quelle visibili
        const topmost = visible.reduce((prev, curr) =>
          prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
        );
        setActiveId(topmost.target.id);
      },
      { threshold: 0.3, rootMargin: '-120px 0px -50% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [variant, visibleItems]);

  if (variant === 'mobile-inline') {
    return (
      <div
        id="indice-mobile"
        className="lg:hidden mb-12 p-8 bg-[var(--color-sand)] rounded-[var(--radius-lg)] border border-black/5 scroll-mt-32"
      >
        <h4 className="font-serif text-xl mb-6 text-accent">Indice dei Contenuti</h4>
        <ul className="space-y-4 text-sm font-medium text-black/60 list-none pl-0 m-0">
          {visibleItems.map((item) => (
            <li key={item.id} className="m-0">
              <a
                href={`#${item.id}`}
                onClick={onItemClick}
                className="flex items-center gap-3 hover:text-accent transition-all"
              >
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
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
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
