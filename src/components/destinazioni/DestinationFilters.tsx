import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, MapPin } from 'lucide-react';
import {
  DESTINATION_GROUPS,
  EXPERIENCE_TYPES,
  slugifyExperienceType,
} from '../../config/contentTaxonomy';
import { MEDIA } from '../../config/mediaAssets';

export type DestinationView = 'luogo' | 'esperienza';

export const GROUP_VISUALS: Record<string, string> = MEDIA.destinationGroups;

function FilterPill({
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
      className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.04em] transition-all duration-200 ${
        active
          ? 'bg-[var(--color-ink)] text-white shadow-sm'
          : 'border border-black/8 bg-white text-black/60 hover:border-black/25 hover:text-[var(--color-ink)]'
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
        {label}
      </span>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">{children}</div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function TabButton({ active, icon, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex items-center justify-center gap-2 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
        active ? 'text-[var(--color-ink)]' : 'text-black/40 hover:text-[var(--color-ink)]'
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && (
        <motion.span
          layoutId="destination-tab-indicator"
          className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[var(--color-accent)]"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </button>
  );
}

interface DestinationFiltersProps {
  view: DestinationView;
  selectedGroup: string;
  selectedExperience: string;
  selectedRegion: string;
  selectedCity: string;
  availableRegions: string[];
  availableCities: string[];
  hasActiveFilters: boolean;
  onChangeView: (view: DestinationView) => void;
  onUpdate: (updates: Record<string, string | null>) => void;
  onReset: () => void;
}

export default function DestinationFilters({
  view,
  selectedGroup,
  selectedExperience,
  selectedRegion,
  selectedCity,
  availableRegions,
  availableCities,
  hasActiveFilters,
  onChangeView,
  onUpdate,
  onReset,
}: DestinationFiltersProps) {
  const isLuogo = view === 'luogo';
  const showItalyDetail = isLuogo && selectedGroup === 'Italia' && availableRegions.length > 1;
  const showCityDetail = showItalyDetail && availableCities.length > 1;

  return (
    <div className="mb-12 overflow-hidden rounded-[1.6rem] border border-black/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 border-b border-black/6 bg-[var(--color-sand)]/40">
        <TabButton
          active={isLuogo}
          icon={<MapPin size={14} strokeWidth={1.8} />}
          label="Per luogo"
          onClick={() => onChangeView('luogo')}
        />
        <TabButton
          active={!isLuogo}
          icon={<Compass size={14} strokeWidth={1.8} />}
          label="Per esperienza"
          onClick={() => onChangeView('esperienza')}
        />
      </div>

      <div className="px-5 pb-6 pt-5 md:px-7 md:pb-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
            {isLuogo ? 'Scegli il paese, poi affina' : 'Scegli il tipo di viaggio'}
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`text-[10px] font-bold uppercase tracking-[0.22em] transition-colors ${
              hasActiveFilters
                ? 'text-[var(--color-accent)] hover:text-[var(--color-ink)]'
                : 'pointer-events-none text-transparent'
            }`}
          >
            Resetta filtri
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {isLuogo ? (
              <>
                <FilterGroup label="Paese">
                  {['Tutti', ...DESTINATION_GROUPS].map((group) => (
                    <FilterPill
                      key={group}
                      active={selectedGroup === group}
                      onClick={() => onUpdate({ group, area: null, city: null })}
                    >
                      {group}
                    </FilterPill>
                  ))}
                </FilterGroup>

                {showItalyDetail && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <FilterGroup label="Regione">
                      {availableRegions.map((region) => (
                        <FilterPill
                          key={region}
                          active={selectedRegion === region}
                          onClick={() => onUpdate({ area: region, city: null })}
                        >
                          {region}
                        </FilterPill>
                      ))}
                    </FilterGroup>

                    {showCityDetail && (
                      <FilterGroup label="Città / località">
                        {availableCities.map((city) => (
                          <FilterPill
                            key={city}
                            active={selectedCity === city}
                            onClick={() => onUpdate({ city })}
                          >
                            {city}
                          </FilterPill>
                        ))}
                      </FilterGroup>
                    )}
                  </div>
                )}
              </>
            ) : (
              <FilterGroup label="Tipo di esperienza">
                {['Tutti', ...EXPERIENCE_TYPES].map((experience) => (
                  <FilterPill
                    key={experience}
                    active={selectedExperience === experience}
                    onClick={() =>
                      onUpdate({
                        type: experience === 'Tutti' ? null : slugifyExperienceType(experience),
                      })
                    }
                  >
                    {experience}
                  </FilterPill>
                ))}
              </FilterGroup>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
