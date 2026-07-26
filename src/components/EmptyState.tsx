import { motion } from 'motion/react';
import { Compass, MapPin, Search, RotateCcw } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';

interface EmptyStateProps {
  variant: 'no-content' | 'no-results';
  onReset?: () => void;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function EmptyState({
  variant,
  onReset,
  secondaryHref,
  secondaryLabel,
}: EmptyStateProps) {
  if (variant === 'no-content') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="mx-auto max-w-md py-24 text-center"
      >
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)]/50" />
          <Compass size={48} className="relative text-[var(--color-accent)]" strokeWidth={1.5} />
          <MapPin
            size={20}
            className="absolute -right-1 top-4 text-[var(--color-accent)] rotate-12"
          />
          <span className="absolute -bottom-4 rounded-full border border-[var(--color-accent)]/20 bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] shadow-sm">
            Presto online
          </span>
        </div>
        <h3 className="mb-3 text-2xl font-serif text-[var(--color-ink)]">
          Destinazione in esplorazione
        </h3>
        <p className="font-normal leading-relaxed text-black/65">
          Stiamo curando i contenuti perfetti per questo luogo. Nel frattempo esplora altre aree o
          iscriviti per sapere quando saranno disponibili.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md py-24 text-center"
    >
      <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[var(--color-accent-soft)]" />
        <Search
          size={48}
          className="relative text-[var(--color-accent)] opacity-60"
          strokeWidth={1.2}
        />
      </div>
      <h3 className="mb-3 text-2xl font-serif text-[var(--color-ink)]">
        Nessun risultato per questi filtri
      </h3>
      <p className="mb-8 font-normal leading-relaxed text-black/65">
        Prova a modificare i filtri o a resettarli per vedere tutti i contenuti disponibili.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-ink)]/85"
          >
            <RotateCcw size={14} />
            Resetta filtri
          </button>
        )}
        {secondaryHref && secondaryLabel && (
          <Link
            to={secondaryHref}
            className="inline-flex min-h-11 items-center rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black/62 transition-colors hover:border-black/25 hover:text-black"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </motion.div>
  );
}
