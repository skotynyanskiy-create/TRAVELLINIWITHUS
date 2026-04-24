import { Quote } from 'lucide-react';
import type { ArticlePullQuote } from './types';

interface PullQuoteProps {
  quote: ArticlePullQuote;
  className?: string;
}

export default function PullQuote({ quote, className = '' }: PullQuoteProps) {
  return (
    <figure
      className={`relative mx-auto max-w-3xl border-l-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)]/50 py-8 pl-8 pr-6 md:pl-12 ${className}`}
    >
      <Quote
        size={28}
        className="absolute -left-[14px] top-6 rounded-full bg-[var(--color-accent)] p-1.5 text-white"
        aria-hidden="true"
      />
      <blockquote className="font-serif text-2xl italic leading-snug text-[var(--color-ink)] md:text-3xl">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      {quote.attribution && (
        <figcaption className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
          — {quote.attribution}
        </figcaption>
      )}
    </figure>
  );
}
