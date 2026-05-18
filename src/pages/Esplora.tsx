import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import ActiveFilterChips from '../components/discovery/ActiveFilterChips';
import ArchiveCard from '../components/discovery/ArchiveCard';
import ArticleSkeleton from '../components/ArticleSkeleton';
import AutocompleteResults, {
  type AutocompleteSuggestion,
} from '../components/discovery/AutocompleteResults';
import EditorialCollections from '../components/discovery/EditorialCollections';
import EmptyState from '../components/EmptyState';
import EsploraQuiz from '../components/discovery/EsploraQuiz';
import InteractiveMap from '../components/InteractiveMap';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import Pagination from '../components/Pagination';
import Section from '../components/Section';
import SEO from '../components/SEO';
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

// Hero cover photo — placeholder editoriale fino a quando R+B fornisce
// asset dedicato in /images/esplora/hero-cover.webp.
const HERO_COVER_IMAGE = '/images/hero-amalfi.webp';

// Big-choice cards: 3 ingressi geografici primari con foto editoriale.
// Le altre zone (Americhe / Africa / Oceania) restano accessibili dai
// "filtri avanzati" o digitando in ricerca.
const BIG_CHOICE_ZONES: Array<{
  zone: Zone | 'all';
  label: string;
  description: string;
  image: string;
}> = [
  {
    zone: 'Italia',
    label: 'Italia',
    description: 'I posti di casa, raccontati con criterio.',
    image: '/images/destinations/toscana.webp',
  },
  {
    zone: 'Europa',
    label: 'Europa',
    description: 'Vicino ma diverso, dalle Dolomiti al Portogallo.',
    image: '/images/destinations/dolomiti.webp',
  },
  {
    zone: 'all',
    label: 'Resto del mondo',
    description: 'Asia, Americhe, Africa, Oceania.',
    image: '/images/destinations/giappone.webp',
  },
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
      className={`min-h-11 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all ${
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
          : 'border-black/10 bg-white text-black/65 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)]'
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
      <p className="mb-2 text-xs font-medium text-black/55">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={activeValue === value}
            onClick={() => onSelect(activeValue === value ? null : value)}
            className={`min-h-10 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
              activeValue === value
                ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                : 'border-black/10 bg-white text-black/55 hover:border-black/30 hover:text-black/80'
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
  const [showQuiz, setShowQuiz] = useState(false);
  const viewLoggedRef = useRef(false);
  const heroRef = useRef<HTMLElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  // Parallax leggero sul background del hero (translate y 0 → -60px sui
  // primi 600px di scroll). Genera profondità senza dramma eccessivo.
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, -60]);

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

  const usingPreview =
    archiveItems.length > 0 && archiveItems.some((item) => DEMO_ARCHIVE_SLUGS.includes(item.id));
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

  // Zone Italia/Europa hanno una big-choice card dedicata; tutte le altre
  // (Asia/Americhe/Africa/Oceania) ricadono nel terzo card "Resto del mondo".
  const activeBigChoice: Zone | 'all' = filters.zone ?? 'all';
  const hasDedicatedBigChoice =
    activeBigChoice !== 'all' && BIG_CHOICE_ZONES.some((entry) => entry.zone === activeBigChoice);

  return (
    <PageLayout>
      <Helmet>
        {/* LCP hero cover: preload prioritario per ridurre il time-to-paint */}
        <link rel="preload" as="image" href="/images/hero-amalfi.avif" type="image/avif" />
        <link rel="preload" as="image" href="/images/hero-amalfi.webp" type="image/webp" />
      </Helmet>
      <SEO
        title="Esplora — posti, esperienze, guide per viaggiare con criterio"
        description="Il finder editoriale Travelliniwithus: zona, tipo di posto, formato, periodo, budget e durata in un unico archivio."
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
        }}
      />

      {/* HERO — photographer-first: foto full-width + parallax + h1 overlay. */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[var(--color-ink)] pb-24 pt-32 text-white md:pb-32 md:pt-44"
      >
        {/* Background image con parallax leggero */}
        <motion.div
          style={{ y: heroParallaxY }}
          className="absolute inset-0 h-[120%] w-full"
          aria-hidden="true"
        >
          <img
            src={HERO_COVER_IMAGE}
            alt=""
            className="h-full w-full object-cover opacity-65"
            // Hero LCP — caricamento prioritario
            fetchPriority="high"
          />
        </motion.div>
        {/* Overlay gradient per leggibilità del testo */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-[var(--color-ink)]/95"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.32em] text-white/72"
          >
            Esplora
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-serif text-[44px] leading-[0.95] md:text-[72px]"
          >
            Trova il prossimo posto
            <br />
            <span className="italic text-white/82">che vale il viaggio.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/82 md:text-lg"
          >
            Cerca per zona, intenzione o ritmo. Un solo archivio editoriale curato dalle storie e
            dalle guide di Rodrigo &amp; Betta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative mx-auto mt-10 max-w-2xl"
          >
            <form
              ref={searchFormRef}
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(searchInput);
              }}
              className="relative flex items-center gap-2 rounded-full border border-white/20 bg-white px-2 py-1.5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)]"
            >
              <Search size={18} className="ml-4 text-black/40" aria-hidden="true" />
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
                className="flex-1 bg-transparent py-3 text-base text-[var(--color-ink)] placeholder:text-black/35 focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-11 rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            <button
              type="button"
              onClick={() => {
                setShowQuiz(true);
                trackEvent('quiz_trigger_click', { source_page: '/esplora' });
              }}
              className="group inline-flex items-center gap-2 text-sm text-white/82 transition-colors hover:text-white"
            >
              <span className="border-b border-white/30 pb-0.5 group-hover:border-white">
                Non sai da dove partire? Scopri in 30 secondi
              </span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
            <span className="text-white/30" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={() => setShowMap((prev) => !prev)}
              aria-expanded={showMap}
              className="inline-flex items-center gap-2 text-sm text-white/72 transition-colors hover:text-white"
            >
              <MapIcon size={14} />{' '}
              {showMap ? 'Nascondi anteprima mappa' : 'Mostra anteprima mappa'}
            </button>
          </motion.div>
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

      {/* BIG CHOICE — 3 ingressi geografici con foto */}
      <Section spacing="tight" className="!pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {BIG_CHOICE_ZONES.map((entry, index) => {
            // aria-pressed solo se l'URL ha esplicitamente questo filtro zone.
            // Senza ?zone= nessuna big-choice e' "pressed": il default neutro
            // evita di comunicare a screen-reader che un filtro e' gia' applicato.
            const isActive = entry.zone !== 'all' && filters.zone === entry.zone;
            return (
              <button
                key={entry.label}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  updateFilter({
                    zone: entry.zone === 'all' ? null : (entry.zone as Zone),
                  })
                }
                className={`group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border text-left transition-all ${
                  isActive
                    ? 'border-[var(--color-ink)] shadow-[var(--shadow-premium)]'
                    : 'border-black/5 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-premium)]'
                }`}
              >
                <OptimizedImage
                  src={entry.image}
                  alt={entry.label}
                  priority={index === 0}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 text-white">
                  <h2 className="font-serif text-3xl leading-tight md:text-4xl">{entry.label}</h2>
                  <p className="mt-2 max-w-xs text-sm leading-snug text-white/85">
                    {entry.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
                    {isActive ? 'Filtro attivo' : 'Apri'} <ArrowRight size={13} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* CHIP TYPE + filtri avanzati progressivi */}
      <Section spacing="tight" className="!pt-4">
        <div className="rounded-[var(--radius-xl)] border border-black/5 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-black/55">
              {filteredItems.length} {filteredItems.length === 1 ? 'risultato' : 'risultati'} per la
              tua ricerca
            </p>
            <div className="flex items-center gap-3">
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
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]/40"
              >
                <SlidersHorizontal size={14} /> Filtri avanzati
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Chip Tipo — sempre visibile, sobri. Wrapper relative con gradient
              fade right su mobile per indicare overflow scrollabile. */}
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TYPES.map((type) => (
                <TypeChip
                  key={type}
                  active={filters.type === type}
                  ariaLabel={`Filtra per tipo di posto: ${type}`}
                  onClick={() => updateFilter({ type: filters.type === type ? null : type })}
                >
                  {type}
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
                  {/* Mostra lo switch zona completo nei filtri avanzati quando
                      la zona attiva non ha una big-choice card dedicata
                      (es. utente atterra con ?zone=Asia da link esterno). */}
                  {!hasDedicatedBigChoice && (
                    <div className="lg:col-span-2">
                      <AdvancedFilterRow
                        label="Zona specifica"
                        values={ZONES}
                        activeValue={filters.zone}
                        onSelect={(value) => updateFilter({ zone: value as Zone | null })}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {usingPreview && (
          <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-5 py-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
            Stai vedendo l'archivio in modalità preview editoriale (noindex). Mostra il prodotto
            finale mentre R+B sostituiscono i seed con contenuti e foto reali.
          </div>
        )}
      </Section>

      {/* COLLEZIONI EDITORIALI — pattern Atlas Obscura + Roadbook: curatela
          visibile sopra l'archivio. Si nasconde quando l'utente filtra (focus
          mode) e quando l'archivio è ancora in caricamento. */}
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

      {/* RISULTATI */}
      <Section spacing="tight" className="!pt-4">
        <ActiveFilterChips
          filters={filters}
          onRemove={removeFilter}
          onResetAll={resetFilters}
          sourcePage="/esplora"
        />
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
          <EmptyState
            variant={archiveItems.length === 0 ? 'no-content' : 'no-results'}
            onReset={archiveItems.length > 0 ? resetFilters : undefined}
            secondaryHref="/mappa"
            secondaryLabel="Apri la mappa"
          />
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

      <EsploraQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </PageLayout>
  );
}
