import { ArrowUpRight, Instagram } from 'lucide-react';
import OptimizedImage from '@/src/components/OptimizedImage';
import { FAMILY_CATEGORY_LABEL, type FamilyEntry } from '../../types/family';
import { PARTNERSHIP_LABEL } from '../../types/content';

/**
 * Riga editoriale di un consiglio Travellini Family: cover reale, categoria,
 * hook, punti del consiglio e link al post sorgente. Disclosure partnership
 * sempre visibile quando presente (AGCOM).
 */
export default function FamilyEntryCard({
  entry,
  priority = false,
}: {
  entry: FamilyEntry;
  /** Prima card sopra la piega: fetchpriority alta + niente lazy-load. */
  priority?: boolean;
}) {
  const disclosure = PARTNERSHIP_LABEL[entry.partnership.kind];

  return (
    <article className="grid gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] md:grid-cols-[280px_1fr] md:gap-10 md:p-8">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-black/5">
        <OptimizedImage
          src={entry.cover}
          alt={entry.coverAlt}
          sizes="(max-width: 768px) 92vw, 280px"
          responsiveWidths={[320, 480, 768]}
          priority={priority}
          style={{ objectPosition: `50% ${entry.coverFocusY ?? 50}%` }}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
            {FAMILY_CATEGORY_LABEL[entry.category]}
          </span>
          {disclosure && (
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted-fg-2)]">
              {disclosure}
              {entry.partnership.partner ? ` · ${entry.partnership.partner}` : ''}
            </span>
          )}
        </div>

        <h3 className="mt-3 font-serif text-2xl leading-snug text-[var(--color-ink)] md:text-3xl">
          {entry.hook}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-2)]">{entry.excerpt}</p>

        {entry.body && entry.body.length > 0 && (
          <ul className="mt-5 space-y-3 border-t border-[var(--color-border)] pt-5">
            {entry.body.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-sm leading-relaxed text-[var(--color-ink-2)]"
              >
                <span
                  aria-hidden
                  className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent-text)]"
          >
            <Instagram size={14} aria-hidden />
            Guarda il momento reale
            <ArrowUpRight size={13} aria-hidden />
          </a>
          {entry.publishedAt && (
            <span className="text-[11px] text-[var(--color-muted-fg)]">
              {new Date(entry.publishedAt).toLocaleDateString('it-IT', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
