import { Check, Minus } from 'lucide-react';
import type { ContentReview } from '../types/content';

/**
 * Scheda redazionale R+B di un posto — verdetto, giudizio, pro e contro.
 * Non è una striscia di stelle da content-farm e non è un voto: è un giudizio
 * editoriale calmo, scritto a parole.
 *
 * Renderizzata SOLO quando ci sono dati reali. Nessun giudizio è mai inventato:
 * se `review` è vuota o assente, il componente non produce nulla.
 */
export default function ReviewBlock({
  review,
  placeName,
}: {
  review?: ContentReview;
  placeName?: string;
}) {
  if (!review) return null;

  const { verdict, summary, pros, cons } = review;
  const hasPros = pros != null && pros.length > 0;
  const hasCons = cons != null && cons.length > 0;

  if (!verdict && !summary && !hasPros && !hasCons) return null;

  return (
    <section
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8"
      aria-label={placeName ? `La nostra scheda: ${placeName}` : 'La nostra scheda'}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
        La nostra scheda
      </p>

      {verdict && (
        <p className="mt-4 font-serif text-2xl leading-tight text-[var(--color-ink)] md:text-3xl">
          {verdict}
        </p>
      )}

      {summary && (
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-2)]">{summary}</p>
      )}

      {(hasPros || hasCons) && (
        <div className="mt-6 grid gap-6 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2">
          {hasPros && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-success-text)]">
                Il meglio
              </p>
              <ul className="space-y-2">
                {pros.map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-2 text-sm text-[var(--color-ink-2)]"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--color-success)]"
                      aria-hidden
                    />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasCons && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg-2)]">
                Da sapere
              </p>
              <ul className="space-y-2">
                {cons.map((con) => (
                  <li
                    key={con}
                    className="flex items-start gap-2 text-sm text-[var(--color-ink-2)]"
                  >
                    <Minus
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--color-muted-fg-2)]"
                      aria-hidden
                    />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
