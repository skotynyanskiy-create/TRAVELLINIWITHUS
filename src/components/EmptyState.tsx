import { motion } from 'motion/react';
import { Compass, MapPin, Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  variant: 'no-content' | 'no-results';
  onReset?: () => void;
}

export default function EmptyState({ variant, onReset }: EmptyStateProps) {
  if (variant === 'no-content') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md py-24 text-center"
      >
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--color-accent-soft)]" />
          <Compass size={56} className="relative text-[var(--color-accent)]" strokeWidth={1.2} />
          <MapPin
            size={20}
            className="absolute -right-1 top-4 text-[var(--color-accent-warm,#C4A47C)] rotate-12"
          />
          <MapPin
            size={16}
            className="absolute -left-2 bottom-6 text-[var(--color-accent)] -rotate-12 opacity-60"
          />
        </div>
        <h3 className="mb-3 text-2xl font-serif text-[var(--color-ink)]">La mappa è ancora vuota</h3>
        <p className="font-normal leading-relaxed text-black/65">
          I contenuti sono in arrivo. Iscriviti alla newsletter per essere tra i primi a scoprirli.
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
        <Search size={48} className="relative text-[var(--color-accent)] opacity-60" strokeWidth={1.2} />
      </div>
      <h3 className="mb-3 text-2xl font-serif text-[var(--color-ink)]">Nessun risultato per questi filtri</h3>
      <p className="mb-8 font-normal leading-relaxed text-black/65">
        Prova a modificare i filtri o a resettarli per vedere tutti i contenuti disponibili.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-ink)]/85"
        >
          <RotateCcw size={14} />
          Resetta filtri
        </button>
      )}
    </motion.div>
  );
}
