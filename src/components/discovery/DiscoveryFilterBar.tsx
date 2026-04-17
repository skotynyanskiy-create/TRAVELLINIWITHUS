import { Filter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: string;
}

export interface DiscoveryFilterBarProps {
  sections: FilterSection[];
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  onClearAll?: () => void;
  resultsLabel?: string;
  sticky?: boolean;
}

export default function DiscoveryFilterBar({
  sections,
  search,
  onClearAll,
  resultsLabel,
  sticky = true,
}: DiscoveryFilterBarProps) {
  const hasActive =
    sections.some((section) => section.selectedValue !== null) || Boolean(search?.value.trim());

  return (
    <div
      className={`${
        sticky ? 'sticky top-[88px] z-30' : ''
      } -mx-6 mb-10 border-y border-black/5 bg-[var(--color-sand)]/92 px-6 py-4 backdrop-blur-md md:-mx-12 md:px-12`}
    >
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <FilterRow key={section.id} section={section} />
        ))}

        {(search || resultsLabel || hasActive) && (
          <div className="flex flex-col gap-3 border-t border-black/5 pt-3 md:flex-row md:items-center md:justify-between">
            {search && (
              <label className="relative block w-full md:max-w-xs">
                <Search
                  size={13}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35"
                />
                <input
                  type="search"
                  value={search.value}
                  onChange={(event) => search.onChange(event.target.value)}
                  placeholder={search.placeholder || 'Cerca...'}
                  className="w-full rounded-full border border-black/8 bg-white py-2 pl-10 pr-4 text-xs tracking-wide text-[var(--color-ink)] placeholder:text-black/35 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                />
              </label>
            )}

            <div className="flex items-center gap-3">
              {resultsLabel && (
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/50">
                  {resultsLabel}
                </span>
              )}
              {hasActive && onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-black/60 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <X size={11} />
                  Azzera filtri
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRow({ section }: { section: FilterSection }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setHasOverflow(el.scrollWidth > el.clientWidth + 4);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [section.options.length]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex shrink-0 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-black/50">
        <Filter size={12} className="text-black/40" />
        {section.title}
      </div>
      <div
        ref={scrollRef}
        className={`hide-scrollbar relative flex flex-1 items-center gap-1.5 overflow-x-auto py-0.5 ${
          hasOverflow ? 'mask-image-[linear-gradient(to_right,black_85%,transparent)]' : ''
        }`}
      >
        <FilterChip
          label={section.allLabel || 'Tutto'}
          selected={section.selectedValue === null}
          onClick={() => section.onSelect(null)}
        />
        {section.options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            count={option.count}
            selected={section.selectedValue === option.value}
            onClick={() =>
              section.onSelect(section.selectedValue === option.value ? null : option.value)
            }
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-all ${
        selected
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
          : 'border-black/10 bg-white text-black/65 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
      }`}
    >
      {label}
      {typeof count === 'number' && count > 0 && (
        <span
          className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
            selected ? 'bg-white/20 text-white' : 'bg-black/5 text-black/55'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
