import { Check, Minus } from 'lucide-react';
import type { ContentReview } from '../types/content';
import { formatScore } from '../utils/formatScore';
import VerdictSeal from './VerdictSeal';

/**
 * Scheda redazionale R+B di un posto — voto, verdetto, criteri, pro e contro.
 * Non è una striscia di stelle da content-farm: è un giudizio editoriale calmo.
 *
 * Renderizzata SOLO quando ci sono dati reali. Nessun voto è mai inventato:
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

  const { overall, verdict, summary, criteria, pros, cons } = review;
  const hasCriteria = criteria != null && criteria.length > 0;
  const hasPros = pros != null && pros.length > 0;
  const hasCons = cons != null && cons.length > 0;

  if (overall == null && !hasCriteria && !hasPros && !hasCons) return null;

  return (
    <section
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8"
      aria-label={placeName ? `La nostra scheda: ${placeName}` : 'La nostra scheda'}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
        La nostra scheda
      </p>

      {overall != null && (
        <div className="mt-4 flex items-center gap-4">
          <VerdictSeal overall={overall} size="lg" />
          {verdict && (
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-text)]">
              {verdict}
            </span>
          )}
        </div>
      )}

      {summary && (
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-2)]">{summary}</p>
      )}

      {hasCriteria && (
        <dl className="mt-6 space-y-3">
          {criteria.map((criterion) => {
            const pct = Math.max(0, Math.min(100, (criterion.score / 10) * 100));
            return (
              <div key={criterion.name} className="flex items-center gap-4">
                <dt className="w-28 shrink-0 text-sm text-[var(--color-ink-2)]">
                  {criterion.name}
                </dt>
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-muted-bg)]"
                  role="meter"
                  aria-valuenow={criterion.score}
                  aria-valuemin={0}
                  aria-valuemax={10}
                  aria-label={`${criterion.name}: ${formatScore(criterion.score)} su 10`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <dd className="w-9 shrink-0 text-right font-serif text-sm text-[var(--color-ink)]">
                  {formatScore(criterion.score)}
                </dd>
              </div>
            );
          })}
        </dl>
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
