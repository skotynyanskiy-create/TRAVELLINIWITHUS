import { type ReactNode } from 'react';
import { CalendarDays, Clock3, Filter, Wallet, X } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import {
  DESTINATION_GROUPS,
  EXPERIENCE_TYPES,
  slugifyExperienceType,
} from '../../config/contentTaxonomy';
import { MEDIA } from '../../config/mediaAssets';
import type { ArchiveItem } from '../../utils/contentArchive';

export const GROUP_VISUALS: Record<string, string> = MEDIA.destinationGroups;

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
        active
          ? 'bg-[var(--color-ink)] text-white'
          : 'border border-black/5 bg-white text-black/55 hover:border-black/15 hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}

interface DestinationFiltersProps {
  archiveItems: ArchiveItem[];
  selectedGroup: string;
  selectedExperience: string;
  selectedRegion: string;
  selectedCity: string;
  selectedPeriod: string;
  selectedBudget: string;
  selectedDuration: string;
  availableRegions: string[];
  availableCities: string[];
  availablePeriods: string[];
  availableBudgets: string[];
  availableDurations: string[];
  hasActiveFilters: boolean;
  onUpdate: (updates: Record<string, string | null>) => void;
  onReset: () => void;
}

export default function DestinationFilters({
  archiveItems,
  selectedGroup,
  selectedExperience,
  selectedRegion,
  selectedCity,
  selectedPeriod,
  selectedBudget,
  selectedDuration,
  availableRegions,
  availableCities,
  availablePeriods,
  availableBudgets,
  availableDurations,
  hasActiveFilters,
  onUpdate,
  onReset,
}: DestinationFiltersProps) {
  return (
    <>
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {DESTINATION_GROUPS.map((group) => {
          const count = archiveItems.filter((item) => item.destinationGroup === group).length;
          const active = selectedGroup === group;
          return (
            <button
              key={group}
              type="button"
              onClick={() => onUpdate({ group, area: null, city: null })}
              className={`group overflow-hidden rounded-[1.4rem] border bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                active ? 'border-[var(--color-accent)]' : 'border-black/5'
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <OptimizedImage
                  src={GROUP_VISUALS[group]}
                  alt={group}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <span className="font-serif text-lg text-[var(--color-ink)]">{group}</span>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-12 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-surface)] p-5 shadow-sm md:p-7">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              <Filter size={14} /> Filtri per decidere
            </span>
            <h2 className="mt-2 text-2xl font-serif text-[var(--color-ink)]">
              Luogo, esperienza, periodo, budget e durata.
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black/55 transition-colors hover:border-black/25 hover:text-black"
            >
              <X size={14} /> Resetta
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-black/45">Area</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['Tutti', ...DESTINATION_GROUPS].map((group) => (
                <FilterButton
                  key={group}
                  active={selectedGroup === group}
                  onClick={() => onUpdate({ group, area: null, city: null })}
                >
                  {group}
                </FilterButton>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-black/45">
              Esperienza
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['Tutti', ...EXPERIENCE_TYPES].map((experience) => (
                <FilterButton
                  key={experience}
                  active={selectedExperience === experience}
                  onClick={() =>
                    onUpdate({
                      type: experience === 'Tutti' ? null : slugifyExperienceType(experience),
                    })
                  }
                >
                  {experience}
                </FilterButton>
              ))}
            </div>
          </div>

          {selectedGroup === 'Italia' && availableRegions.length > 1 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-black/45">
                  Regione
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableRegions.map((region) => (
                    <FilterButton
                      key={region}
                      active={selectedRegion === region}
                      onClick={() => onUpdate({ area: region, city: null })}
                    >
                      {region}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {availableCities.length > 1 && (
                <div>
                  <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-black/45">
                    Città / località
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {availableCities.map((city) => (
                      <FilterButton
                        key={city}
                        active={selectedCity === city}
                        onClick={() => onUpdate({ city })}
                      >
                        {city}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { label: 'Periodo', key: 'period', value: selectedPeriod, values: availablePeriods, icon: CalendarDays },
              { label: 'Budget', key: 'budget', value: selectedBudget, values: availableBudgets, icon: Wallet },
              { label: 'Durata', key: 'duration', value: selectedDuration, values: availableDurations, icon: Clock3 },
            ].map(({ label, key, value, values, icon: Icon }) => (
              <div key={key}>
                <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/45">
                  <Icon size={14} /> {label}
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {values.map((item) => (
                    <FilterButton
                      key={item}
                      active={value === item}
                      onClick={() => onUpdate({ [key]: item })}
                    >
                      {item}
                    </FilterButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
