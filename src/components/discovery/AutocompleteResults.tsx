import { useMemo } from 'react';
import { BookOpen, Compass, MapPin, type LucideIcon } from 'lucide-react';
import { TYPES, ZONES, type ContentType, type Zone } from '../../config/contentTaxonomy';
import type { ArchiveItem } from '../../utils/contentArchive';

export interface AutocompleteSuggestion {
  id: string;
  label: string;
  category: 'Luogo' | 'Esperienza' | 'Articolo';
  icon: LucideIcon;
  /** Quando settato, applica questo filtro */
  applyFilter?: { key: 'zone' | 'type'; value: Zone | ContentType };
  /** Quando settato, naviga direttamente (es. articolo) */
  navigateTo?: string;
}

interface AutocompleteResultsProps {
  query: string;
  archiveItems: ArchiveItem[];
  onSelect: (suggestion: AutocompleteSuggestion) => void;
  maxResults?: number;
}

/**
 * Genera suggerimenti instant matching su:
 *  - ZONES (taxonomy)
 *  - TYPES (taxonomy)
 *  - title degli articoli/preview presenti in archiveItems
 *
 * Non usa Fuse per restare leggero (~50 LOC, no dipendenze nuove).
 * Match: case-insensitive `includes`, no fuzzy. Sufficiente per finder
 * editoriale dove la taxonomy è limitata.
 */
export default function AutocompleteResults({
  query,
  archiveItems,
  onSelect,
  maxResults = 6,
}: AutocompleteResultsProps) {
  const trimmed = query.trim().toLowerCase();

  const suggestions = useMemo<AutocompleteSuggestion[]>(() => {
    if (trimmed.length < 2) return [];

    const zoneMatches: AutocompleteSuggestion[] = ZONES.filter((zone) =>
      zone.toLowerCase().includes(trimmed)
    ).map((zone) => ({
      id: `zone-${zone}`,
      label: zone,
      category: 'Luogo',
      icon: MapPin,
      applyFilter: { key: 'zone', value: zone },
    }));

    const typeMatches: AutocompleteSuggestion[] = TYPES.filter((type) =>
      type.toLowerCase().includes(trimmed)
    ).map((type) => ({
      id: `type-${type}`,
      label: type,
      category: 'Esperienza',
      icon: Compass,
      applyFilter: { key: 'type', value: type },
    }));

    const articleMatches: AutocompleteSuggestion[] = archiveItems
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(trimmed) ||
          item.location.toLowerCase().includes(trimmed) ||
          (item.region ?? '').toLowerCase().includes(trimmed)
        );
      })
      .slice(0, 4)
      .map((item) => ({
        id: `article-${item.id}`,
        label: item.title,
        category: 'Articolo',
        icon: BookOpen,
        navigateTo: item.link,
      }));

    return [...zoneMatches, ...typeMatches, ...articleMatches].slice(0, maxResults);
  }, [trimmed, archiveItems, maxResults]);

  if (suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      aria-label="Suggerimenti di ricerca"
      className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[var(--radius-md)] border border-black/10 bg-white shadow-[var(--shadow-xl)]"
    >
      <ul className="py-1.5">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <li key={suggestion.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => onSelect(suggestion)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[var(--color-ink)] transition-colors hover:bg-[var(--color-sand)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-black/55">
                  <Icon size={14} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium text-[var(--color-ink)]">
                    {suggestion.label}
                  </span>
                  <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-black/60">
                    {suggestion.category}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
