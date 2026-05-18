import { X } from 'lucide-react';
import { trackEvent } from '../../services/analytics';
import type { DiscoveryFilters } from '../../utils/discoveryQuery';

interface ActiveFilterChipsProps {
  filters: DiscoveryFilters;
  onRemove: (key: keyof DiscoveryFilters) => void;
  onResetAll: () => void;
  /** Source page per analytics (default: pathname corrente). */
  sourcePage?: string;
}

const FILTER_LABELS: Record<keyof DiscoveryFilters, string> = {
  zone: 'Zona',
  type: 'Tipo',
  format: 'Formato',
  period: 'Periodo',
  budget: 'Budget',
  duration: 'Durata',
  search: 'Cerca',
};

const FILTER_ORDER: Array<keyof DiscoveryFilters> = [
  'zone',
  'type',
  'format',
  'period',
  'budget',
  'duration',
  'search',
];

/**
 * Chip rimovibili che mostrano i filtri attivi in cima alla griglia
 * risultati. Click sulla X rimuove SOLO quel filtro (gli altri restano).
 * Quando nessun filtro è attivo, il componente non renderizza nulla.
 */
export default function ActiveFilterChips({
  filters,
  onRemove,
  onResetAll,
  sourcePage,
}: ActiveFilterChipsProps) {
  const activeEntries = FILTER_ORDER.map((key) => ({ key, value: filters[key] })).filter(
    (entry): entry is { key: keyof DiscoveryFilters; value: string } => Boolean(entry.value)
  );

  if (activeEntries.length === 0) return null;

  const handleRemove = (key: keyof DiscoveryFilters, value: string) => {
    onRemove(key);
    trackEvent('explore_filter_remove', {
      source_page: sourcePage ?? window.location.pathname,
      filter_type: key,
      filter_value: value,
    });
  };

  const handleResetAll = () => {
    onResetAll();
    trackEvent('explore_filter_reset_all', {
      source_page: sourcePage ?? window.location.pathname,
      removed_count: activeEntries.length,
    });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Filtri attivi">
      <span className="text-xs font-medium text-black/55">Stai cercando:</span>
      {activeEntries.map(({ key, value }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleRemove(key, value)}
          aria-label={`Rimuovi filtro ${FILTER_LABELS[key]}: ${value}`}
          className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--color-ink)] bg-[var(--color-ink)] px-3.5 py-1 text-xs text-white transition-colors hover:bg-black"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
            {FILTER_LABELS[key]}
          </span>
          <span className="text-xs">{value}</span>
          <X
            size={13}
            className="ml-1 text-white/65 transition-colors group-hover:text-white"
            aria-hidden="true"
          />
        </button>
      ))}
      {activeEntries.length > 1 && (
        <button
          type="button"
          onClick={handleResetAll}
          className="ml-1 text-xs font-medium text-black/55 underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline"
        >
          Resetta tutto
        </button>
      )}
    </div>
  );
}
