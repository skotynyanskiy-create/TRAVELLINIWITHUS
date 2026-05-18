import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SourceBlockProps {
  href?: string;
  author?: string;
  verified?: boolean;
  date?: string;
  children: ReactNode;
}

export default function SourceBlock({ href, author, verified, date, children }: SourceBlockProps) {
  return (
    <aside
      className="my-10 rounded-r-[var(--radius-md)] border-l-2 border-[var(--color-accent)] bg-[var(--color-sand)] p-5 md:p-6"
      aria-label="Fonte citata"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
          Fonte
        </span>
        {verified && <CheckCircle2 size={12} className="text-[var(--color-accent)]" />}
        {date && <span className="text-[11px] text-[var(--color-muted-fg)]">({date})</span>}
      </div>
      <div className="text-base leading-relaxed text-[var(--color-ink-2)]">{children}</div>
      {author && (
        <footer className="mt-3 text-sm text-[var(--color-muted-fg)]">
          —{' '}
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-text)] hover:underline"
            >
              {author} ↗
            </a>
          ) : (
            author
          )}
        </footer>
      )}
    </aside>
  );
}
