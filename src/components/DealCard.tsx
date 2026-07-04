import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Copy, Tag } from 'lucide-react';
import type { ContentItem } from '../types/content';

/** Formatta una data ISO nel formato italiano dd/mm/yyyy. */
function formatItalianDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/**
 * Offerta/deal collegata a un posto — codice promo o sconto affiliato.
 * Renderizzata SOLO quando `deal` è presente: nessuna offerta è mai inventata.
 * Superficie calma e premium, non un banner spammoso.
 */
export default function DealCard({ deal }: { deal?: ContentItem['deal'] }) {
  const [copied, setCopied] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (!deal) return null;

  const hasCode = deal.kind === 'code' && Boolean(deal.code);

  const handleCopy = async () => {
    if (!deal.code) return;
    try {
      await navigator.clipboard.writeText(deal.code);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard non disponibile: il codice resta comunque leggibile a schermo
    }
  };

  return (
    <section
      aria-label="Offerta"
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-center gap-2">
        <Tag size={13} className="text-[var(--color-accent)]" aria-hidden />
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
          Offerta
        </p>
        {deal.provider && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-fg)]">
            · {deal.provider}
          </span>
        )}
      </div>

      {deal.label && (
        <p className="mt-3 font-serif text-2xl leading-snug text-[var(--color-ink)]">
          {deal.label}
        </p>
      )}

      {hasCode && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Codice copiato' : `Copia il codice ${deal.code}`}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-muted-bg)] px-4 py-3 text-left transition-colors hover:border-[var(--color-accent)]"
        >
          <span className="font-mono text-base font-semibold tracking-wider text-[var(--color-ink)]">
            {deal.code}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--color-accent-text)]">
            {copied ? (
              <>
                <Check size={14} aria-hidden /> Copiato!
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden /> Copia
              </>
            )}
          </span>
        </button>
      )}

      {hasCode && (
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? 'Codice copiato negli appunti' : ''}
        </span>
      )}

      <a
        href={deal.url}
        target="_blank"
        rel="nofollow noopener"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
      >
        Vai all'offerta
        <ArrowUpRight size={14} aria-hidden />
      </a>

      {deal.validUntil && (
        <p className="mt-3 text-center text-[11px] text-[var(--color-muted-fg)]">
          Valida fino al {formatItalianDate(deal.validUntil)}
        </p>
      )}

      {deal.terms && (
        <div className="mt-4 border-t border-[var(--color-border)] pt-3">
          <button
            type="button"
            onClick={() => setTermsOpen((open) => !open)}
            aria-expanded={termsOpen}
            aria-controls="deal-terms"
            className="flex w-full items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-fg-2)] transition-colors hover:text-[var(--color-ink)]"
          >
            Termini e condizioni
            <ChevronDown
              size={15}
              aria-hidden
              className={`shrink-0 transition-transform motion-reduce:transition-none ${
                termsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {termsOpen && (
            <p
              id="deal-terms"
              role="region"
              aria-label="Termini e condizioni"
              className="mt-3 text-xs leading-relaxed text-[var(--color-ink-2)]"
            >
              {deal.terms}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
