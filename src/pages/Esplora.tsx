import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Map as MapIcon,
  Route,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import ActiveFilterChips from '../components/discovery/ActiveFilterChips';
import AtlanteViews from '../components/atlante/AtlanteViews';
import ArchiveCard from '../components/discovery/ArchiveCard';
import ArticleSkeleton from '../components/ArticleSkeleton';
import AutocompleteResults, {
  type AutocompleteSuggestion,
} from '../components/discovery/AutocompleteResults';
import ContentCard from '../components/content/ContentCard';
import EditorialCollections from '../components/discovery/EditorialCollections';
import EmptyState from '../components/EmptyState';
import InteractiveMap from '../components/InteractiveMap';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import Pagination from '../components/Pagination';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { NearMeFilterButton } from '../components/discovery/NearMeFilterButton';
import { sortPlacesByDistance } from '../utils/geo';
import StickyMobileCTA from '../components/StickyMobileCTA';
import {
  BUDGETS,
  DURATIONS,
  FORMATS,
  PERIODS,
  TYPES,
  ZONES,
  slugifyFormat,
  slugifyType,
  type Budget,
  type ContentFormat,
  type Duration,
  type Period,
  type Zone,
} from '../config/contentTaxonomy';
import { CONTENT_ITEMS } from '../config/contentLibrary';
import {
  DEMO_ARCHIVE_ITEMS,
  DEMO_ARCHIVE_MAP_MARKERS,
  DEMO_ARCHIVE_SLUGS,
} from '../config/demoArchive';
import { SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { trackEvent } from '../services/analytics';
import { fetchArticles } from '../services/firebaseService';
import { mapArticleToArchiveItem, type ArchiveItem } from '../utils/contentArchive';
import {
  buildFilterQuery,
  filterByScope,
  hasAnyFilter,
  parseDiscoveryFilters,
  sanitizeDiscoveryFilters,
  type DiscoveryFilters,
} from '../utils/discoveryQuery';

const ITEMS_PER_PAGE = 9;

// Domanda-guida inline: 4 scelte, risultato immediato (no modal, no quiz).
// Label corte (sostantivi nudi) per chip scrollabili mobile senza wrap.
const GUIDE_INTENTS: Array<{
  label: string;
  apply: Partial<DiscoveryFilters> | 'reset';
}> = [
  { label: 'In Italia', apply: { zone: 'Italia' } },
  { label: 'In coppia', apply: { type: 'Weekend romantici' } },
  { label: 'Fuori rotta', apply: { type: 'Insolito' } },
  { label: 'Mostrami tutto', apply: 'reset' },
];

// Chip "type" sobri (calmo, lowercase, niente uppercase aggressive).
function TypeChip({
  active,
  children,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`min-h-11 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-[var(--shadow-premium)]'
          : 'border-black/10 bg-white text-black/65 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:bg-[var(--color-sand)]/40'
      }`}
    >
      {children}
    </button>
  );
}

function AdvancedFilterRow({
  label,
  values,
  activeValue,
  onSelect,
}: {
  label: string;
  values: readonly string[];
  activeValue: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-fg-2)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={activeValue === value}
            onClick={() => onSelect(activeValue === value ? null : value)}
            className={`min-h-10 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
              activeValue === value
                ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-[var(--shadow-premium)]'
                : 'border-black/10 bg-white text-black/55 hover:border-black/30 hover:text-black/80 hover:bg-[var(--color-sand)]/40'
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Esplora() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const viewLoggedRef = useRef(false);
  const searchFormRef = useRef<HTMLFormElement>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['explore-archive', demoSettings.showEditorialDemo, demoSettings.showDestinationDemo],
    queryFn: fetchArticles,
  });

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const mapped = articles
      .map(mapArticleToArchiveItem)
      .filter((item) => item.destinationGroup !== 'Altro');
    if (mapped.length > 0) return mapped;
    if (!demoSettings.showDestinationDemo && !demoSettings.showEditorialDemo) return [];
    return DEMO_ARCHIVE_ITEMS;
  }, [articles, demoSettings.showDestinationDemo, demoSettings.showEditorialDemo]);

  const filters = useMemo<DiscoveryFilters>(
    () => sanitizeDiscoveryFilters(parseDiscoveryFilters(searchParams)),
    [searchParams]
  );

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Posti particolari reali — filtrati per zona e tipo attivi, ordinati per distanza se Vicino a me è attivo.
  const filteredContentItems = useMemo(() => {
    const items = CONTENT_ITEMS.filter((item) => {
      if (filters.zone && item.zone !== filters.zone) return false;
      if (filters.type && !item.types.includes(filters.type)) return false;
      return true;
    });

    if (userLocation) {
      return sortPlacesByDistance(items, {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      });
    }
    return items;
  }, [filters.zone, filters.type, userLocation]);

  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  const filteredItems = useMemo(
    () => filterByScope(archiveItems, filters),
    [archiveItems, filters]
  );

  useEffect(() => {
    if (viewLoggedRef.current) return;
    viewLoggedRef.current = true;
    trackEvent('explore_view', {
      source_page: '/esplora',
      total_items: archiveItems.length,
      filtered_count: filteredItems.length,
      has_filters: hasAnyFilter(filters),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveItems.length]);

  // Apri "filtri avanzati" automaticamente se l'utente arriva con un filtro
  // periodo/budget/durata/formato attivo (non vorrebbe vederlo nascosto).
  useEffect(() => {
    if (filters.period || filters.budget || filters.duration || filters.format) {
      setShowAdvanced(true);
    }
  }, [filters.period, filters.budget, filters.duration, filters.format]);

  // Chiudi autocomplete su click esterno o ESC
  useEffect(() => {
    if (!showAutocomplete) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchFormRef.current?.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowAutocomplete(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showAutocomplete]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.zone,
    filters.type,
    filters.format,
    filters.period,
    filters.budget,
    filters.duration,
    filters.search,
  ]);

  const updateFilter = (updates: Partial<DiscoveryFilters>) => {
    const next = sanitizeDiscoveryFilters({ ...filters, ...updates });
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) return;
      trackEvent('explore_filter_apply', {
        source_page: '/esplora',
        filter_type: key,
        filter_value: String(value),
        results_count: filterByScope(archiveItems, next).length,
      });
    });
    const qs = buildFilterQuery(next);
    setSearchParams(qs ? new URLSearchParams(qs) : {}, { replace: true });
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  const handleGuideIntent = (intent: (typeof GUIDE_INTENTS)[number]) => {
    trackEvent('explore_intent_click', {
      source_page: '/esplora',
      intent: intent.label,
    });
    if (intent.apply === 'reset') {
      resetFilters();
    } else {
      updateFilter(intent.apply);
    }
  };

  const removeFilter = (key: keyof DiscoveryFilters) => {
    updateFilter({ [key]: null } as Partial<DiscoveryFilters>);
  };

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    updateFilter({ search: trimmed || null });
    if (trimmed.length >= 2) {
      trackEvent('explore_search', {
        source_page: '/esplora',
        query: trimmed.toLowerCase(),
        results_count: filterByScope(archiveItems, { ...filters, search: trimmed }).length,
      });
    }
    // Chiudi autocomplete dopo submit
    setShowAutocomplete(false);
  };

  const handleAutocompleteSelect = (suggestion: AutocompleteSuggestion) => {
    trackEvent('explore_search_suggest_click', {
      source_page: '/esplora',
      suggestion_category: suggestion.category,
      suggestion_label: suggestion.label,
    });
    setShowAutocomplete(false);
    setSearchInput('');
    if (suggestion.applyFilter) {
      updateFilter({ [suggestion.applyFilter.key]: suggestion.applyFilter.value });
    } else if (suggestion.navigateTo) {
      navigate(suggestion.navigateTo, {
        state: {
          from: `/esplora${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
          fromLabel: 'Torna ai risultati',
        },
      });
    }
  };

  // Banner "anteprima editoriale" e noindex quando niente di cio' che mostriamo
  // e' verificato. Attenzione al "reali": conta se i ContentItem sono veri, non
  // se esistono — 40 item tutti isPlaceholder restano un'anteprima, e prima
  // questa riga guardava .length, quindi la pagina si dichiarava pubblica.
  const hasRealContentItems = CONTENT_ITEMS.some((item) => !item.isPlaceholder);
  const usingPreview =
    !hasRealContentItems &&
    archiveItems.length > 0 &&
    archiveItems.some((item) => DEMO_ARCHIVE_SLUGS.includes(item.id));
  const active = hasAnyFilter(filters);

  const mapMarkers = useMemo(() => {
    const fromArticles = articles.flatMap((article) =>
      (article.mapMarkers ?? []).map((marker) => ({
        id: marker.id,
        name: marker.name,
        coordinates: marker.coordinates,
        title: marker.title || article.title,
        category: marker.category || article.category,
        image: article.image,
        link: `/articolo/${article.slug || article.id}`,
      }))
    );
    if (fromArticles.length > 0) return fromArticles;
    if (!demoSettings.showDestinationDemo) return [];
    return DEMO_ARCHIVE_MAP_MARKERS;
  }, [articles, demoSettings.showDestinationDemo]);

  const newsletterSource = useMemo(() => {
    const parts = [
      'esplora',
      filters.zone?.toLowerCase(),
      filters.type ? slugifyType(filters.type) : null,
      filters.format ? slugifyFormat(filters.format) : null,
    ].filter(Boolean);
    return parts.join('_') || 'esplora_bottom';
  }, [filters.zone, filters.type, filters.format]);

  // Chip TYPE con conteggio dinamico nel contesto dei filtri attuali.
  // Type a 0 risultati vengono nascosti (non disabilitati): un finder su
  // archivio quasi vuoto non deve mostrare opzioni morte.
  const typeCounts = useMemo(
    () =>
      TYPES.map((type) => ({
        type,
        count: filterByScope(archiveItems, { ...filters, type }).length,
      })).filter((entry) => entry.count > 0 || filters.type === entry.type),
    [archiveItems, filters]
  );

  // Conteggio dei filtri avanzati attualmente applicati (per il trigger).
  const advancedActiveCount =
    (filters.format ? 1 : 0) +
    (filters.period ? 1 : 0) +
    (filters.budget ? 1 : 0) +
    (filters.duration ? 1 : 0);

  // Rimando agli Itinerari quando l'intenzione lo suggerisce: format=Itinerario
  // oppure durata lunga (Settimana / Due settimane).
  const suggestsItinerari =
    filters.format === 'Itinerario' ||
    filters.duration === 'Settimana' ||
    filters.duration === 'Due settimane';

  return (
    <PageLayout>
      <SEO
        title="Esplora viaggi scelti a mano"
        description="Le idee di viaggio che scegliamo davvero noi: posti, weekend in coppia e mete fuori rotta da filtrare per zona, periodo e budget. Archivio Travellini."
        canonical={`${SITE_URL}/esplora`}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Esplora', url: `${SITE_URL}/esplora` },
        ]}
        noindex={usingPreview}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Esplora Travelliniwithus',
          url: `${SITE_URL}/esplora`,
          description:
            'Archivio editoriale di destinazioni, esperienze e guide curato da Travelliniwithus.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Esplora', item: `${SITE_URL}/esplora` },
            ],
          },
          // ItemList dei contenuti reali: aiuta crawler classici e AI search
          // (GEO) a capire cosa contiene l'archivio. Escluso in anteprima demo
          // (pagina già noindex) per non esporre contenuti fittizi.
          ...(usingPreview || archiveItems.length === 0
            ? {}
            : {
                mainEntity: {
                  '@type': 'ItemList',
                  numberOfItems: archiveItems.length,
                  itemListElement: archiveItems.slice(0, 20).map((item, position) => ({
                    '@type': 'ListItem',
                    position: position + 1,
                    name: item.title,
                    url: `${SITE_URL}${item.link}`,
                  })),
                },
              }),
        }}
      />

      {/* HEADER COMPATTO — banda carta atlante, ricerca inline. */}
      <section className="bg-[var(--color-sand,#faf7f2)] border-b border-[var(--color-border)] pt-28 pb-10 md:pt-32 md:pb-12 text-[var(--color-ink,#1a2b3c)]">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
              Esplora &amp; Archivio
            </p>
            <AtlanteViews current="archivio" />
          </div>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,4vw+1rem,3.75rem)] leading-[1.02] text-[var(--color-ink)]">
            Il prossimo posto, prima ancora di sapere dove.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/62 md:text-lg">
            Inizia dalle collezioni che scegliamo a mano, poi stringi per zona, tipo di posto e
            periodo.
          </p>

          <div className="relative mt-8 max-w-2xl">
            <form
              ref={searchFormRef}
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(searchInput);
              }}
              className="relative flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 shadow-sm"
            >
              <Search
                size={18}
                className="ml-3 shrink-0 text-black/40 md:ml-4"
                aria-hidden="true"
              />
              <input
                aria-label="Cerca nei posti, nelle esperienze e nelle guide"
                aria-autocomplete="list"
                type="search"
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                  setShowAutocomplete(event.target.value.trim().length >= 2);
                }}
                onFocus={() => {
                  if (searchInput.trim().length >= 2) setShowAutocomplete(true);
                }}
                placeholder="es. Puglia, hotel con vista, weekend in Toscana…"
                className="min-w-0 flex-1 bg-transparent py-3 text-base text-[var(--color-ink)] placeholder:text-black/35 focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-11 rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)] sm:px-6"
              >
                Cerca
              </button>
              {showAutocomplete && (
                <AutocompleteResults
                  query={searchInput}
                  archiveItems={archiveItems}
                  onSelect={handleAutocompleteSelect}
                />
              )}
            </form>
            <button
              type="button"
              onClick={() => setShowMap((prev) => !prev)}
              aria-expanded={showMap}
              className="mt-3 inline-flex items-center gap-2 text-sm text-black/55 transition-colors hover:text-[var(--color-ink)]"
            >
              <MapIcon size={14} /> {showMap ? 'Nascondi anteprima mappa' : 'Anteprima mappa'}
            </button>
          </div>

          {/* DOMANDA-GUIDA INLINE — 4 scelte, risultato immediato. */}
          <div className="mt-8 border-t border-black/10 pt-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">Cosa cerchi adesso?</p>
            <div className="-mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
              {GUIDE_INTENTS.map((intent) => {
                const isActive =
                  intent.apply !== 'reset' &&
                  ((intent.apply.zone && filters.zone === intent.apply.zone) ||
                    (intent.apply.type && filters.type === intent.apply.type));
                return (
                  <button
                    key={intent.label}
                    type="button"
                    aria-pressed={Boolean(isActive)}
                    onClick={() => handleGuideIntent(intent)}
                    className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
                      isActive
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-[var(--shadow-premium)]'
                        : 'border-black/10 bg-white text-black/65 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {intent.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence initial={false}>
        {showMap && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[var(--color-sand)]"
          >
            <div className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
              <InteractiveMap markers={mapMarkers} className="h-[360px] w-full md:h-[440px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHIP TYPE + filtri avanzati progressivi */}
      <Section id="esplora-archivio" spacing="tight" className="!pt-4">
        {usingPreview && (
          <div className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-5 py-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
            Stai vedendo l'archivio in anteprima editoriale. I contenuti vengono aggiornati man mano
            con foto, guide e dettagli verificati.
          </div>
        )}
        <div className="rounded-[var(--radius-xl)] border border-black/5 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-black/55">
              {filteredItems.length} {filteredItems.length === 1 ? 'risultato' : 'risultati'} per la
              tua ricerca
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <NearMeFilterButton activeCoords={userLocation} onLocationFound={setUserLocation} />
              {active && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm text-black/55 transition-colors hover:text-[var(--color-ink)]"
                >
                  <X size={14} /> Resetta
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                aria-expanded={showAdvanced}
                className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-sm text-black/50 transition-colors hover:text-[var(--color-ink)]"
              >
                <SlidersHorizontal size={14} /> Filtri avanzati
                {advancedActiveCount > 0 && (
                  <span className="text-black/45">({advancedActiveCount} attivi)</span>
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Chip Tipo — solo i type con >=1 risultato, con conteggio dinamico.
              Wrapper relative con gradient fade right su mobile per overflow. */}
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {typeCounts.map(({ type, count }) => (
                <TypeChip
                  key={type}
                  active={filters.type === type}
                  ariaLabel={`Filtra per tipo di posto: ${type}, ${count} risultati`}
                  onClick={() => updateFilter({ type: filters.type === type ? null : type })}
                >
                  {type}{' '}
                  <span className={filters.type === type ? 'text-white/65' : 'text-black/35'}>
                    ({count})
                  </span>
                </TypeChip>
              ))}
            </div>
            {/* Scroll hint: gradient fade right (solo se c'è overflow, su mobile) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--color-surface)] to-transparent md:hidden"
            />
          </div>

          {/* Filtri avanzati — accordion */}
          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-7 grid gap-6 border-t border-black/5 pt-7 lg:grid-cols-2">
                  <AdvancedFilterRow
                    label="Formato"
                    values={FORMATS}
                    activeValue={filters.format}
                    onSelect={(value) => updateFilter({ format: value as ContentFormat | null })}
                  />
                  <AdvancedFilterRow
                    label="Periodo"
                    values={PERIODS}
                    activeValue={filters.period}
                    onSelect={(value) => updateFilter({ period: value as Period | null })}
                  />
                  <AdvancedFilterRow
                    label="Budget"
                    values={BUDGETS}
                    activeValue={filters.budget}
                    onSelect={(value) => updateFilter({ budget: value as Budget | null })}
                  />
                  <AdvancedFilterRow
                    label="Durata"
                    values={DURATIONS}
                    activeValue={filters.duration}
                    onSelect={(value) => updateFilter({ duration: value as Duration | null })}
                  />
                  {/* Unica superficie zona oltre alla domanda-guida: lo switch
                      completo (Italia/Europa/Asia/Americhe/Africa/Oceania). */}
                  <div className="lg:col-span-2">
                    <AdvancedFilterRow
                      label="Zona specifica"
                      values={ZONES}
                      activeValue={filters.zone}
                      onSelect={(value) => updateFilter({ zone: value as Zone | null })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>

      {/* COLLEZIONI EDITORIALI — curatela-first: primo blocco di contenuto,
          sempre montate. Senza filtri stanno sopra l'archivio; quando si filtra
          si spostano SOTTO i risultati (vedi più giù) per non sparire mai. */}
      {!active && !isLoading && (
        <EditorialCollections
          archive={archiveItems}
          sourcePage="/esplora"
          linkState={{
            from: '/esplora',
            fromLabel: 'Torna alle collezioni',
          }}
        />
      )}

      {/* POSTI PARTICOLARI — griglia social-first dai ContentItem reali.
          Sempre visibile (risponde a filtri zona/tipo). È il contenuto REALE
          che prende priorità visiva sull'archivio articoli. */}
      {filteredContentItems.length > 0 && (
        <Section spacing="tight" className="!pt-0">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                Posti particolari
              </p>
              <h2 className="mt-1 font-serif text-2xl leading-tight text-[var(--color-ink)] md:text-3xl">
                Ci siamo stati per davvero.
              </h2>
            </div>
            {(filters.zone || filters.type) && (
              <p className="shrink-0 text-xs text-black/45">
                {filteredContentItems.length}{' '}
                {filteredContentItems.length === 1 ? 'posto' : 'posti'}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredContentItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </Section>
      )}

      {/* RISULTATI */}
      <Section spacing="tight" className="!pt-4">
        <ActiveFilterChips
          filters={filters}
          onRemove={removeFilter}
          onResetAll={resetFilters}
          sourcePage="/esplora"
        />
        {suggestsItinerari && (
          <Link
            to="/itinerari"
            onClick={() =>
              trackEvent('explore_to_itinerari_click', {
                source_page: '/esplora',
                format: filters.format,
                duration: filters.duration,
              })
            }
            className="mb-8 flex items-center gap-3 rounded-[var(--radius-lg)] border border-black/10 bg-white px-5 py-4 text-sm text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]/40"
          >
            <Route size={18} className="shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
            <span className="flex-1">
              Cerchi un piano giorno-per-giorno? Quello sta negli Itinerari.
            </span>
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </Link>
        )}
        {!active && !isLoading && filteredItems.length > 0 && (
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/45">
              Archivio completo
            </span>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-[var(--color-ink)] md:text-4xl">
              Tutto quello che abbiamo raccontato finora.
            </h2>
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleSkeleton key={index} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          archiveItems.length === 0 ? (
            <div className="space-y-12">
              <EmptyState
                variant="no-content"
                secondaryHref="/mappa"
                secondaryLabel="Apri la mappa"
              />
              <div className="rounded-[var(--radius-xl)] border border-black/5 bg-white p-6 text-center shadow-sm md:p-8">
                <h3 className="font-serif text-2xl leading-tight text-[var(--color-ink)]">
                  Intanto lasciaci un indirizzo.
                </h3>
                <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-black/60">
                  Ti scriviamo quando pubblichiamo i primi posti, senza spam.
                </p>
                <div className="mx-auto mt-6 max-w-md">
                  <Newsletter variant="compact" source="esplora_no_content" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <EmptyState variant="no-results" onReset={resetFilters} />
              <p className="mt-12 text-sm text-black/50">
                Intanto, parti da quello che abbiamo scelto noi:
              </p>
            </>
          )
        ) : (
          <>
            {/*
              Griglia asimmetrica editoriale (magazine).
              Solo prima pagina ha la cover story: index 0 = feature (md:col-span-2 lg:col-span-2 lg:row-span-2);
              gli altri 8 sono cards regolari. Da pagina 2 in poi, layout uniforme 3-col.
            */}
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:auto-rows-[minmax(420px,auto)] lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((item, index) => {
                  const isFeatureCard = currentPage === 1 && index === 0;
                  const linkState = {
                    from: `/esplora${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
                    fromLabel: 'Torna ai risultati',
                  } as const;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                      onClick={() =>
                        trackEvent('explore_card_click', {
                          source_page: '/esplora',
                          content_id: item.id,
                          content_type: item.category,
                          position: (currentPage - 1) * ITEMS_PER_PAGE + index,
                          is_preview: DEMO_ARCHIVE_SLUGS.includes(item.id),
                          is_feature: isFeatureCard,
                        })
                      }
                      className={isFeatureCard ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
                    >
                      <ArchiveCard
                        item={item}
                        variant={isFeatureCard ? 'mood' : 'editorial'}
                        className={isFeatureCard ? 'h-full min-h-[480px]' : 'h-full'}
                        linkState={linkState}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Section>

      {/* COLLEZIONI EDITORIALI (sotto i risultati quando si filtra) — restano
          sempre montate: niente schermo vuoto, curatela sempre raggiungibile. */}
      {active && !isLoading && (
        <EditorialCollections
          archive={archiveItems}
          sourcePage="/esplora"
          linkState={{
            from: `/esplora${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
            fromLabel: 'Torna ai risultati',
          }}
        />
      )}

      {/* NEWSLETTER + B2B — sobri, fondo pagina */}
      <Section className="!py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[var(--radius-xl)] border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-black/45">
              <Mail size={14} className="-mt-1 mr-1.5 inline" /> Newsletter
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[var(--color-ink)]">
              {active
                ? 'Ricevi i prossimi posti coerenti con questa ricerca.'
                : 'Ricevi le prossime storie e guide direttamente in inbox.'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/60">
              Niente popup, niente spam: ti scriviamo quando c'è davvero qualcosa di nuovo da
              salvare per il prossimo viaggio.
            </p>
            <div className="mt-6">
              <Newsletter
                variant="compact"
                source={newsletterSource}
                ctaLabel={active ? 'Salva questa ricerca' : 'Iscriviti alla newsletter'}
              />
            </div>
          </div>

          <Link
            to="/collaborazioni"
            onClick={() =>
              trackEvent('partner_cta_click_from_explore', {
                source_page: '/esplora',
                zone: filters.zone,
                type: filters.type,
              })
            }
            className="flex flex-col justify-between gap-6 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-ink)] p-6 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-8"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-accent)]">
                Per destinazioni e strutture
              </p>
              <h3 className="mt-3 font-serif text-2xl leading-tight">
                Vuoi essere raccontato con criterio?
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/68">
                Selezioniamo poche collaborazioni all'anno con territori, hotel e brand coerenti con
                il nostro modo di viaggiare.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)]">
              Come lavoriamo <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </Section>
      <StickyMobileCTA
        label="Apri archivio"
        href="#esplora-archivio"
        trackingId="esplora_sticky_mobile"
        revealAfter={-1}
      />
    </PageLayout>
  );
}
