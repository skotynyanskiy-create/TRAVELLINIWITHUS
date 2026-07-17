import { formatScore } from '../utils/formatScore';

const TONE_CLASSES: Record<'light' | 'dark', string> = {
  light: 'border-[var(--color-ink)]/15 bg-[var(--color-surface)] text-[var(--color-ink)]',
  dark: 'border-white/25 bg-white/5 text-white',
};

const SLASH_TONE_CLASSES: Record<'light' | 'dark', string> = {
  light: 'text-[var(--color-muted-fg)]',
  dark: 'text-white/55',
};

/**
 * Token inline del voto redazionale ("8,6/10") per liste dense e meta-row.
 * DNA condivisa col "Timbro" (VerdictSeal): Fraunces + hairline, nessuna
 * stella. Renderizzato solo quando esiste un voto complessivo.
 */
export default function RatingPill({
  overall,
  tone = 'light',
  className,
}: {
  overall?: number;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  if (overall == null) return null;

  return (
    <span
      className={`inline-flex items-baseline gap-0.5 rounded-full border px-2.5 py-1 ${TONE_CLASSES[tone]} ${className ?? ''}`}
      role="img"
      aria-label={`Voto redazionale ${formatScore(overall)} su 10`}
    >
      <span className="font-serif text-sm font-medium leading-none">{formatScore(overall)}</span>
      <span className={`text-[10px] font-medium leading-none ${SLASH_TONE_CLASSES[tone]}`}>
        /10
      </span>
    </span>
  );
}
