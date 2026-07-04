import { Star } from 'lucide-react';

/** Formatta un voto 0-10 con la virgola decimale italiana (es. 8.6 → "8,6"). */
function formatScore(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/**
 * Pill compatta di voto redazionale ("★ 8,6"). Renderizzata solo quando esiste
 * un voto complessivo — mai un placeholder.
 */
export default function RatingPill({
  overall,
  className,
}: {
  overall?: number;
  className?: string;
}) {
  if (overall == null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--color-accent-text)] ${className ?? ''}`}
      aria-label={`Voto redazionale ${formatScore(overall)} su 10`}
    >
      <Star size={11} className="text-[var(--color-accent)]" fill="currentColor" aria-hidden />
      <span className="font-serif">{formatScore(overall)}</span>
    </span>
  );
}
