import { type ReactNode, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  Filter,
  MapPin,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ArticleSkeleton from '../components/ArticleSkeleton';
import Breadcrumbs from '../components/Breadcrumbs';
import CrossLinkWidget from '../components/CrossLinkWidget';
import EmptyState from '../components/EmptyState';
import InteractiveMap from '../components/InteractiveMap';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import Pagination from '../components/Pagination';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { DEMO_DESTINATION_CARD } from '../config/demoContent';
import {
  DESTINATION_GROUPS,
  EXPERIENCE_TYPES,
  getExperienceTypeFromQuery,
  slugifyExperienceType,
} from '../config/contentTaxonomy';
import { getExperienceVisual } from '../config/experienceVisuals';
import { siteContentDefaults } from '../config/siteContent';
import { SITE_URL } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchArticles } from '../services/firebaseService';
import {
  getArchiveLocationLabel,
  mapArticleToArchiveItem,
  type ArchiveItem,
} from '../utils/contentArchive';

const ITEMS_PER_PAGE = 6;

const GROUP_VISUALS: Record<string, string> = {
  Italia:
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1600&auto=format&fit=crop',
  Europa:
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop',
  Asia: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
  Americhe:
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1600&auto=format&fit=crop',
  Africa:
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1600&auto=format&fit=crop',
  Oceania:
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1600&auto=format&fit=crop',
};

const TRUST_STRIP = [
  'Luoghi vissuti o verificati',
  "Dettagli pratici prima dell'ispirazione",
  'Filtri pensati per decidere',
  'Nessun contenuto spacciato per proof',
];

function uniqueValues(items: Array<string | undefined>) {
  return Array.from(new Set(items.filter((item): item is string => Boolean(item && item !== 'Da definire'))));
}

function getDemoArchiveItem(): ArchiveItem {
  return {
    id: DEMO_DESTINATION_CARD.id,
    title: DEMO_DESTINATION_CARD.title,
    excerpt:
      'Una preview editoriale temporanea per mostrare come appariranno le destinazioni quando saranno pubblicati contenuti reali.',
    image: DEMO_DESTINATION_CARD.image,
    link: DEMO_DESTINATION_CARD.link,
    category: DEMO_DESTINATION_CARD.category,
    country: 'Italia',
    region: 'Trentino-Alto Adige',
    city: 'Dolomiti',
    continent: 'Europa',
    location: 'Italia, Trentino-Alto Adige, Dolomiti',
    destinationGroup: 'Italia',
    experienceTypes: ['Posti particolari', 'Passeggiate panoramiche'],
    primaryExperience: 'Posti particolari',
    period: 'Giugno - Settembre',
    budget: 'Medio',
    duration: 'Weekend lungo',
  };
}

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

function ArchiveCard({ item, isDemo }: { item: ArchiveItem; isDemo: boolean }) {
  const visual = item.primaryExperience ? getExperienceVisual(item.primaryExperience) : null;
  const ExpIcon = visual?.icon;

  return (
    <Link
      to={item.link}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <OptimizedImage
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isDemo && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/60 backdrop-blur">
              Preview
            </span>
          )}
          {item.primaryExperience && ExpIcon && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/70 backdrop-blur"
            >
              <ExpIcon size={12} style={{ color: visual.color }} />
              {item.primaryExperience}
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            <MapPin size={12} />
            {getArchiveLocationLabel(item)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
          {item.period && <span>{item.period}</span>}
          {item.duration && <span>{item.duration}</span>}
          {item.budget && <span>{item.budget}</span>}
        </div>
        <h2 className="text-2xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
          {item.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-black/65">
          {item.excerpt ||
            'Un contenuto da salvare per capire atmosfera, logistica e dettagli utili prima di partire.'}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Leggi e salva <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function Destinazioni() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['destination-archive', demoSettings.showDestinationDemo],
    queryFn: fetchArticles,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const selectedGroup = searchParams.get('group') || searchParams.get('region') || 'Tutti';
  const selectedExperience = getExperienceTypeFromQuery(searchParams.get('type')) || 'Tutti';
  const selectedRegion = searchParams.get('area') || 'Tutti';
  const selectedCity = searchParams.get('city') || 'Tutti';
  const selectedPeriod = searchParams.get('period') || 'Tutti';
  const selectedBudget = searchParams.get('budget') || 'Tutti';
  const selectedDuration = searchParams.get('duration') || 'Tutti';

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const mapped = articles
      .map(mapArticleToArchiveItem)
      .filter((item) => item.destinationGroup !== 'Altro');

    if (mapped.length > 0) return mapped;
    return demoSettings.showDestinationDemo ? [getDemoArchiveItem()] : [];
  }, [articles, demoSettings.showDestinationDemo]);

  const mapMarkers = useMemo(
    () =>
      articles.flatMap((article) =>
        (article.mapMarkers ?? []).map((marker) => ({
          id: marker.id,
          name: marker.name,
          coordinates: marker.coordinates,
          title: marker.title || article.title,
          category: marker.category || article.category,
          image: article.image,
          link: `/articolo/${article.slug || article.id}`,
        }))
      ),
    [articles]
  );

  const availableRegions = useMemo(() => {
    if (selectedGroup !== 'Italia') return ['Tutti'];
    return ['Tutti', ...uniqueValues(archiveItems.filter((item) => item.country === 'Italia').map((item) => item.region))];
  }, [archiveItems, selectedGroup]);

  const availableCities = useMemo(() => {
    if (selectedGroup !== 'Italia' || selectedRegion === 'Tutti') return ['Tutti'];
    return [
      'Tutti',
      ...uniqueValues(
        archiveItems
          .filter((item) => item.country === 'Italia' && item.region === selectedRegion)
          .map((item) => item.city)
      ),
    ];
  }, [archiveItems, selectedGroup, selectedRegion]);

  const availablePeriods = useMemo(() => ['Tutti', ...uniqueValues(archiveItems.map((item) => item.period))], [archiveItems]);
  const availableBudgets = useMemo(() => ['Tutti', ...uniqueValues(archiveItems.map((item) => item.budget))], [archiveItems]);
  const availableDurations = useMemo(() => ['Tutti', ...uniqueValues(archiveItems.map((item) => item.duration))], [archiveItems]);

  const filteredItems = useMemo(
    () =>
      archiveItems.filter((item) => {
        const matchGroup = selectedGroup === 'Tutti' || item.destinationGroup === selectedGroup;
        const matchExperience =
          selectedExperience === 'Tutti' || item.experienceTypes.includes(selectedExperience);
        const matchRegion = selectedRegion === 'Tutti' || item.region === selectedRegion;
        const matchCity = selectedCity === 'Tutti' || item.city === selectedCity;
        const matchPeriod = selectedPeriod === 'Tutti' || item.period === selectedPeriod;
        const matchBudget = selectedBudget === 'Tutti' || item.budget === selectedBudget;
        const matchDuration = selectedDuration === 'Tutti' || item.duration === selectedDuration;

        return (
          matchGroup &&
          matchExperience &&
          matchRegion &&
          matchCity &&
          matchPeriod &&
          matchBudget &&
          matchDuration
        );
      }),
    [
      archiveItems,
      selectedBudget,
      selectedCity,
      selectedDuration,
      selectedExperience,
      selectedGroup,
      selectedPeriod,
      selectedRegion,
    ]
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const activeGroupImage = GROUP_VISUALS[selectedGroup === 'Tutti' ? 'Italia' : selectedGroup] || GROUP_VISUALS.Italia;
  const hasActiveFilters =
    selectedGroup !== 'Tutti' ||
    selectedExperience !== 'Tutti' ||
    selectedRegion !== 'Tutti' ||
    selectedCity !== 'Tutti' ||
    selectedPeriod !== 'Tutti' ||
    selectedBudget !== 'Tutti' ||
    selectedDuration !== 'Tutti';
  const usingDemo = archiveItems.length === 1 && archiveItems[0]?.id === DEMO_DESTINATION_CARD.id;

  const updateSearch = (updates: Record<string, string | null>) => {
    setCurrentPage(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (!value || value === 'Tutti') next.delete(key);
          else next.set(key, value);
        });
        return next;
      },
      { replace: true }
    );
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  return (
    <PageLayout>
      <SEO
        title="Destinazioni"
        description="Trova posti particolari da salvare e vivere davvero: destinazioni, regioni, esperienze e guide Travelliniwithus filtrabili con criterio."
        canonical={`${SITE_URL}/destinazioni`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Destinazioni Travelliniwithus',
          url: `${SITE_URL}/destinazioni`,
          description:
            'Archivio editoriale di destinazioni, regioni e posti particolari selezionati da Travelliniwithus.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Destinazioni', item: `${SITE_URL}/destinazioni` },
            ],
          },
        }}
      />

      <section className="relative overflow-hidden bg-[var(--color-ink)] pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="absolute inset-0">
          <OptimizedImage
            src={activeGroupImage}
            alt=""
            aria-hidden="true"
            priority
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <Breadcrumbs
            items={[{ label: 'Destinazioni' }]}
            className="[&_a]:text-white/70 [&_span]:text-white/45 [&_svg]:text-white/35"
          />
          <div className="mt-10 max-w-4xl">
            <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75 backdrop-blur">
              Archivio discovery
            </span>
            <h1 className="text-5xl font-serif font-medium leading-[0.95] md:text-7xl lg:text-8xl">
              Trova posti particolari
              <span className="block italic text-white/62">da salvare e vivere davvero</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/82 md:text-xl">
              Parti da un luogo, da uno stile di viaggio o da un vincolo pratico. Ogni scheda deve
              aiutarti a capire se quel posto merita davvero spazio nei tuoi piani.
            </p>
          </div>

          <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_STRIP.map((item) => (
              <div key={item} className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck size={16} className="mb-3 text-[var(--color-gold)]" />
                <p className="text-xs font-semibold leading-relaxed text-white/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <div className="-mt-24 mb-14 rounded-[2rem] border border-black/5 bg-white p-5 shadow-[var(--shadow-premium)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:items-center">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                <Compass size={14} /> Mappa + archivio
              </span>
              <h2 className="text-3xl font-serif leading-tight text-[var(--color-ink)] md:text-4xl">
                Orientati prima sulla mappa, poi restringi con i filtri.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/65">
                La V1 funziona anche con pochi contenuti: se non ci sono pin reali, la mappa resta
                un orientamento visuale e la griglia diventa il punto di scelta principale.
              </p>
              <Link
                to="/mappa"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
              >
                Apri mappa completa <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-black/5">
              <InteractiveMap markers={mapMarkers} className="h-[360px] w-full md:h-[430px]" />
            </div>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {DESTINATION_GROUPS.map((group) => {
            const count = archiveItems.filter((item) => item.destinationGroup === group).length;
            const active = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => updateSearch({ group, area: null, city: null })}
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
                onClick={resetFilters}
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
                    onClick={() => updateSearch({ group, area: null, city: null })}
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
                      updateSearch({
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
                        onClick={() => updateSearch({ area: region, city: null })}
                      >
                        {region}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                {availableCities.length > 1 && (
                  <div>
                    <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-black/45">
                      Citta / localita
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {availableCities.map((city) => (
                        <FilterButton
                          key={city}
                          active={selectedCity === city}
                          onClick={() => updateSearch({ city })}
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
                        onClick={() => updateSearch({ [key]: item })}
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

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {filteredItems.length} contenuti trovati
            </span>
            <h2 className="mt-2 text-3xl font-serif text-[var(--color-ink)]">
              {hasActiveFilters ? 'Risultati filtrati con criterio' : 'Ultimi luoghi da esplorare'}
            </h2>
          </div>
          <Link
            to="/esperienze"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]"
          >
            Cerca per esperienza <ArrowRight size={14} />
          </Link>
        </div>

        {usingDemo && (
          <div className="mb-8 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-5 py-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
            Questa e una preview editoriale temporanea: serve a mostrare il layout finche non ci
            sono contenuti reali pubblicati. Prima del deploy pubblico va sostituita o disattivata.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            variant={archiveItems.length === 0 ? 'no-content' : 'no-results'}
            onReset={archiveItems.length > 0 ? resetFilters : undefined}
          />
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ArchiveCard item={item} isDemo={usingDemo && item.id === DEMO_DESTINATION_CARD.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        <div className="mt-24">
          <CrossLinkWidget variant="to-esperienze" />
        </div>
      }
      filters={
        <DiscoveryFilterBar
          sections={sections}
          onClearAll={hasAnyFilter(filters) ? clearAll : undefined}
          resultsLabel={resultsLabel}
        />
      }
    >
      <AnimatePresence initial={false}>
        {mapOpen && (
          <motion.div
            key="map"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mb-10 overflow-hidden rounded-[var(--radius-2xl)] border border-black/5 shadow-sm">
              <InteractiveMap />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ArticleSkeleton key={idx} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          variant={archiveItems.length === 0 ? 'no-content' : 'no-results'}
          onReset={archiveItems.length > 0 ? clearAll : undefined}
        />
      ) : (
        <>
          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {paginated.map((item) => (
              <ArchiveCard key={item.id} item={item} />
            ))}
          </motion.div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Section className="!py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CrossLinkWidget variant="to-esperienze" />
          <CrossLinkWidget variant="to-guide" />
        </div>
      </Section>

      <Section className="!py-0 !pb-16">
        <Newsletter variant="sand" />
      </Section>
    </DiscoveryPageLayout>
  );
}
