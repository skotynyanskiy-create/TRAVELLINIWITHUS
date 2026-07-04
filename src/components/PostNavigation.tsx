import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { CONTENT_ITEMS } from '../config/contentLibrary';
import type { ContentItem } from '../types/content';

/**
 * Navigazione prev/next tra posti della stessa zona (ordine libreria, no wrap).
 * Renderizzata solo se esiste almeno un vicino. Onesta: se il posto corrente è
 * reale, i placeholder vengono esclusi dai vicini.
 */
export default function PostNavigation({ currentId }: { currentId: string }) {
  const current = CONTENT_ITEMS.find((item) => item.id === currentId);
  if (!current) return null;

  const sameZone = CONTENT_ITEMS.filter((item) => item.zone === current.zone);
  const pool = sameZone.length > 1 ? sameZone : CONTENT_ITEMS;
  const siblings = current.isPlaceholder ? pool : pool.filter((item) => !item.isPlaceholder);

  const index = siblings.findIndex((item) => item.id === currentId);
  if (index === -1) return null;

  const prev = index > 0 ? siblings[index - 1] : undefined;
  const next = index < siblings.length - 1 ? siblings[index + 1] : undefined;

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Naviga tra i posti"
      className="mt-16 border-t border-[var(--color-border)] pt-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {prev ? (
          <NeighbourLink item={prev} direction="prev" />
        ) : (
          <span className="hidden sm:block" aria-hidden />
        )}
        {next ? (
          <NeighbourLink item={next} direction="next" />
        ) : (
          <span className="hidden sm:block" aria-hidden />
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/esplora"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg-2)] transition-colors hover:text-[var(--color-accent-text)]"
        >
          <Compass size={14} aria-hidden />
          Torna a Esplora
        </Link>
      </div>
    </nav>
  );
}

function NeighbourLink({ item, direction }: { item: ContentItem; direction: 'prev' | 'next' }) {
  const isPrev = direction === 'prev';
  const eyebrow = isPrev ? 'Precedente' : 'Successivo';

  return (
    <Link
      to={`/posto/${item.id}`}
      aria-label={`${eyebrow}: ${item.title}`}
      className={`group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--color-accent)] ${
        isPrev ? 'text-left' : 'flex-row-reverse text-right'
      }`}
    >
      {item.cover ? (
        <OptimizedImage
          src={item.cover}
          alt={item.title}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] object-cover"
        />
      ) : (
        <span
          className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] bg-[var(--color-muted-bg)]"
          aria-hidden
        />
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)] ${
            isPrev ? '' : 'flex-row-reverse'
          }`}
        >
          {isPrev ? <ArrowLeft size={13} aria-hidden /> : <ArrowRight size={13} aria-hidden />}
          {eyebrow}
        </span>
        <span className="mt-1 line-clamp-2 font-serif text-base leading-snug text-[var(--color-ink)]">
          {item.title}
        </span>
      </span>
    </Link>
  );
}
