import type { ReactNode } from 'react';

interface PullQuoteProps {
  attribution?: string;
  children: ReactNode;
}

export default function PullQuote({ attribution, children }: PullQuoteProps) {
  return (
    <blockquote className="my-12 md:my-16 border-l-2 border-[var(--color-accent)] pl-6 md:pl-8">
      <div className="font-serif italic text-2xl md:text-3xl lg:text-4xl leading-[1.25] text-[var(--color-ink)]">
        {children}
      </div>
      {attribution && (
        <footer className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
