import { Compass, Receipt } from 'lucide-react';

export interface DatiRow {
  label: string;
  value: string;
}

export type DatiTipo = 'costi' | 'pratiche';

interface DatiBlockProps {
  tipo: DatiTipo;
  titolo: string;
  quando?: string;
  perQuante?: string;
  righe: DatiRow[];
  totale?: DatiRow;
}

const TIPO_ICON: Record<DatiTipo, typeof Receipt> = {
  costi: Receipt,
  pratiche: Compass,
};

/**
 * Peso visivo L3 dell'handoff editorial-blocks-v2: solo filo sopra/sotto,
 * nessun fondo, nessun angolo arrotondato. `<dl>` semantico vero — nessun
 * `div` travestito — perché e' l'unico markup che una `dl` deve avere.
 */
export default function DatiBlock({
  tipo,
  titolo,
  quando,
  perQuante,
  righe,
  totale,
}: DatiBlockProps) {
  const Icon = TIPO_ICON[tipo];

  return (
    <aside aria-label={titolo} className="my-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
          <Icon size={14} aria-hidden="true" />
          {titolo}
        </span>
        {tipo === 'costi' && quando && (
          <span className="text-[11px] text-[var(--color-muted-fg)]">Aggiornato · {quando}</span>
        )}
      </div>

      <dl className="border-y border-[var(--color-border)]">
        {righe.map((riga, index) => (
          <div
            key={`${riga.label}-${index}`}
            className={`${
              tipo === 'costi'
                ? 'flex items-baseline justify-between gap-4'
                : 'flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4'
            } py-3 ${index > 0 ? 'border-t border-dashed border-[var(--color-border)]/60' : ''}`}
          >
            <dt className="text-[var(--color-ink-2)]">{riga.label}</dt>
            <dd
              className={
                tipo === 'costi'
                  ? 'tabular-nums text-[var(--color-ink)]'
                  : 'text-[var(--color-ink)]'
              }
            >
              {riga.value}
            </dd>
          </div>
        ))}
        {totale && (
          <div className="flex items-baseline justify-between gap-4 border-t border-[var(--color-border)] py-3">
            <dt className="font-medium text-[var(--color-ink)]">{totale.label}</dt>
            <dd className="text-right">
              <span className="font-medium tabular-nums text-[var(--color-ink)]">
                {totale.value}
              </span>
              {perQuante && (
                <span className="mt-0.5 block text-[11px] font-normal normal-case tracking-normal text-[var(--color-muted-fg)]">
                  {perQuante}
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
