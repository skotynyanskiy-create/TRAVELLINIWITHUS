interface LeadMagnetCoverProps {
  className?: string;
  /** 'full': wordmark + descrittore + timbro (landing, teaser home).
   *  'compact': solo il timbro, per la thumbnail nel popup exit-intent (~72-96px). */
  variant?: 'full' | 'compact';
  /** Numero di collana nel timbro — "01" per la prima guida, "02" per la prossima. */
  stampNumber?: string;
}

/**
 * Copertina unica del funnel lead magnet (Route B — craft tipografica, cfr.
 * docs/50_Scratch/HANDOFF_lead-magnet-rework_asset_to_frontend.md): nessuno dei
 * 10 posti della guida ha una foto reale certificata in libreria, quindi la
 * copertina riusa la texture carta dell'Atlante invece di una foto stock.
 * Un solo componente per landing (/guida-in-regalo), teaser home e thumbnail
 * popup: un domani il numero di collana o la texture cambiano in un punto solo.
 */
export default function LeadMagnetCover({
  className = '',
  variant = 'full',
  stampNumber = '01',
}: LeadMagnetCoverProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`atlante-carta-surface flex h-full w-full items-center justify-center ${className}`}
      >
        <span
          aria-hidden="true"
          className="atlante-stamp-mark flex h-7 w-7 items-center justify-center rounded-full text-[9px]"
        >
          {stampNumber}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`atlante-carta-surface flex h-full w-full flex-col justify-between p-6 md:p-7 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-atlante-inchiostro)]/70">
          Travelliniwithus
        </span>
        <span
          aria-hidden="true"
          className="atlante-stamp-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs"
        >
          {stampNumber}
        </span>
      </div>
      <p className="max-w-[15rem] font-serif text-2xl leading-[1.08] text-[var(--color-atlante-inchiostro)] md:text-3xl">
        10 posti provati e consigliati da noi
      </p>
    </div>
  );
}
