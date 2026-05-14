import { Info } from 'lucide-react';

interface AffiliateDisclosureProps {
  /** Tono visivo: 'inline' (nel testo articolo) o 'card' (box dedicato) */
  variant?: 'inline' | 'card';
  /** Override testo. Default: copy generico. */
  text?: string;
  className?: string;
}

const DEFAULT_TEXT =
  'Alcuni link in questa pagina sono affiliati: se prenoti o acquisti attraverso di essi, riceviamo una piccola commissione senza costi aggiuntivi per te. Consigliamo solo cose che usiamo o che abbiamo verificato di persona.';

/**
 * Disclosure di affiliazione visibile, conforme alle linee guida FTC
 * e al Codice del Consumo italiano per pubblicità trasparente.
 *
 * Va inserita VICINO ai link affiliati, non a fine pagina.
 * Per articoli con affiliate, posizionarla in cima alla sezione che
 * contiene i link (es. "Dove dormire", "Risorse pratiche").
 */
export default function AffiliateDisclosure({
  variant = 'inline',
  text = DEFAULT_TEXT,
  className = '',
}: AffiliateDisclosureProps) {
  if (variant === 'card') {
    return (
      <div
        role="note"
        aria-label="Informativa affiliazione"
        className={`flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-muted-bg)] px-4 py-3 text-xs leading-relaxed text-[var(--color-ink-2)] ${className}`}
      >
        <Info
          size={14}
          className="mt-0.5 shrink-0 text-[var(--color-muted-fg)]"
          aria-hidden="true"
        />
        <p className="m-0">{text}</p>
      </div>
    );
  }

  return (
    <p
      role="note"
      aria-label="Informativa affiliazione"
      className={`my-3 text-xs italic leading-relaxed text-[var(--color-muted-fg)] ${className}`}
    >
      {text}
    </p>
  );
}
