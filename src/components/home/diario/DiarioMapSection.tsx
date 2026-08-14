import { useState } from 'react';
import { Compass, MapPin, Sparkles } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import InteractiveMap, { type MapMarker } from '@/src/components/InteractiveMap';
import { getGeocodedContentItems } from '@/src/config/contentLibrary';
import type { ContentType } from '@/src/config/contentTaxonomy';

type MapFilter = 'all' | ContentType;

// Un campo solo invece di due opzionali. `value?` e `type?` codificavano
// «esattamente uno dei due», che il tipo non sa esprimere: `filter.type ??
// filter.value` restava `| undefined` anche se nessuna voce lascia entrambi
// vuoti. Cosi' il caso impossibile non esiste, invece di essere gestito.
interface MoodFilterOption {
  label: string;
  filter: MapFilter;
}

const MOOD_FILTERS: MoodFilterOption[] = [
  { label: 'Tutti i posti', filter: 'all' },
  { label: 'Cena insolita', filter: 'Food & Ristoranti' },
  { label: 'Alloggi di charme', filter: 'Hotel con carattere' },
  { label: 'Esperienze e relax', filter: 'Relax, terme e spa' },
  { label: 'Posti particolari', filter: 'Insolito' },
];

export default function DiarioMapSection() {
  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');
  const geocodedItems = getGeocodedContentItems();

  const filteredItems =
    activeFilter === 'all'
      ? geocodedItems
      : geocodedItems.filter((item) => item.types.includes(activeFilter));

  const mapMarkers: MapMarker[] = filteredItems.map((item) => ({
    id: item.id,
    name: item.title,
    coordinates: [item.place.coordinates!.lng, item.place.coordinates!.lat],
    link: `/posto/${item.id}`,
    image: item.cover,
    category: item.types[0],
    title: item.title,
  }));

  return (
    <section className="relative border-b border-neutral-200 bg-[#FAF8F5] py-24 text-neutral-900 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
              <Sparkles size={14} />
              Geolocalizzazione Reale
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-neutral-900 md:text-5xl lg:text-6xl">
              Esplora la Mappa dell’Atlante.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 font-light">
              Ogni pin sulla mappa è un posto provato sul campo da Rodrigo e Betta con coordinate
              GPS verificate e scheda completa.
            </p>
          </div>

          <Link
            to="/mappa"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 transition-all hover:border-neutral-900 md:mt-0 shadow-xs"
          >
            Mappa Full Screen <Compass size={16} />
          </Link>
        </div>

        {/* Filter Mood Chips */}
        <div className="mb-8 flex flex-wrap items-center gap-2.5">
          {MOOD_FILTERS.map((filter) => {
            const filterValue = filter.filter;
            const isActive = activeFilter === filterValue;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filterValue)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900'
                }`}
              >
                <MapPin size={12} className={isActive ? 'text-amber-400' : 'text-neutral-500'} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Map Interactive Frame */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-3 shadow-2xl">
          <div className="h-[460px] w-full overflow-hidden rounded-2xl md:h-[560px]">
            <InteractiveMap markers={mapMarkers} className="h-full w-full" />
          </div>

          {/* Bottom Bar Info Overlay */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 bg-white px-6 py-4 rounded-b-2xl">
            <span className="text-xs font-medium text-neutral-600">
              Mostrando <strong className="text-neutral-900">{filteredItems.length}</strong> posti
              verificati sulla mappa
            </span>
            <Link
              to="/esplora"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 hover:underline"
            >
              Filtra per Regione o Tipologia &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
