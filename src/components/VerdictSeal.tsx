import { formatScore } from '../utils/formatScore';

const CONTAINER_SIZE: Record<'md' | 'lg', string> = {
  md: 'h-14 w-14 md:h-16 md:w-16',
  lg: 'h-20 w-20 md:h-24 md:w-24',
};

const NUMBER_SIZE: Record<'md' | 'lg', string> = {
  md: 'text-xl md:text-2xl',
  lg: 'text-3xl md:text-4xl',
};

/**
 * "Il Timbro" — medaglione circolare del voto redazionale. Doppio hairline
 * ink, numerale Fraunces, "su 10". Nessuna stella, nessun fill, nessuna
 * ombra: è un timbro notarile, non un badge e-commerce.
 *
 * Renderizzato SOLO quando esiste un voto complessivo — mai un placeholder.
 */
export default function VerdictSeal({
  overall,
  size = 'md',
}: {
  overall?: number;
  size?: 'md' | 'lg';
}) {
  if (overall == null) return null;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--color-ink)]/25 bg-[var(--color-surface)] ${CONTAINER_SIZE[size]}`}
      role="img"
      aria-label={`Voto della redazione ${formatScore(overall)} su 10`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] rounded-full border border-[var(--color-ink)]/12"
      />
      <span aria-hidden="true" className="flex flex-col items-center">
        <span className={`font-serif leading-none text-[var(--color-ink)] ${NUMBER_SIZE[size]}`}>
          {formatScore(overall)}
        </span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
          su 10
        </span>
      </span>
    </span>
  );
}
