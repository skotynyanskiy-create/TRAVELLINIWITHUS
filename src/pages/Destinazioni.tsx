import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import Pagination from '../components/Pagination';
import PageLayout from '../components/PageLayout';
import OptimizedImage from '../components/OptimizedImage';
import Section from '../components/Section';
import ArticleSkeleton from '../components/ArticleSkeleton';
import EmptyState from '../components/EmptyState';
import CrossLinkWidget from '../components/CrossLinkWidget';
import SEO from '../components/SEO';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_DESTINATION_CARD } from '../config/demoContent';
import { SITE_URL } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';
import { DESTINATION_GROUPS } from '../config/contentTaxonomy';
import {
  getArchiveLocationLabel,
  mapArticleToArchiveItem,
  type ArchiveItem,
} from '../utils/contentArchive';
import { getExperienceVisual } from '../config/experienceVisuals';
import { DEMO_CONTENT_ENABLED } from '../config/runtime';

// TODO(@travelliniwithus): PLACEHOLDER â€” servono foto rappresentative per ogni gruppo geografico (una per continente/area)
const groupVisuals: Record<string, string> = {
  Italia:
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200&auto=format&fit=crop',
  Europa:
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
  Asia: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
  Americhe:
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop',
  Africa:
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200&auto=format&fit=crop',
  Oceania:
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop',
};

const groupDescriptions: Record<string, string> = {
  Italia: 'Regioni, citta e tappe da usare quando vuoi scendere subito nel dettaglio.',
  Europa: 'Capitali, city break e itinerari facili da confrontare tra loro.',
  Asia: 'Mete, atmosfere e indirizzi da aprire quando vuoi uscire dai percorsi piu ovvi.',
  Americhe: 'Viaggi lunghi, grandi citta e tappe da valutare con piu criterio.',
  Africa: 'Paesaggi, strutture e spunti da leggere con taglio piu selettivo.',
  Oceania: 'Ispirazioni piu rare, da aprire quando vuoi mete lontane ma ben filtrate.',
};

export default function Destinazioni() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const destinationDemoEnabled = DEMO_CONTENT_ENABLED && demoSettings.showDestinationDemo;
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['destination-archive', destinationDemoEnabled],
    queryFn: fetchArticles,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const selectedGroup = searchParams.get('group') || searchParams.get('region') || 'Tutti';
  const selectedRegion = searchParams.get('area') || 'Tutti';
  const selectedCity = searchParams.get('city') || 'Tutti';

  /* Hero parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.12]);

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const mapped = articles
      .map((article) => mapArticleToArchiveItem(article))
      .filter((item) => item.destinationGroup !== 'Altro');

    if (mapped.length > 0) return mapped;

    return destinationDemoEnabled
      ? [
          {
            id: DEMO_DESTINATION_CARD.id,
            title: DEMO_DESTINATION_CARD.title,
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
          },
        ]
      : [];
  }, [articles, destinationDemoEnabled]);

  const itemsPerPage = 6;
  const breadcrumbItems = [{ label: 'Destinazioni' }];
  const groups = useMemo(() => ['Tutti', ...DESTINATION_GROUPS], []);

  const availableRegions = useMemo(() => {
    if (selectedGroup !== 'Italia') return ['Tutti'];
    const regions = new Set(
      archiveItems
        .filter((item) => item.country === 'Italia' && item.region)
        .map((item) => item.region as string)
    );
    return ['Tutti', ...Array.from(regions)];
  }, [archiveItems, selectedGroup]);

  const availableCities = useMemo(() => {
    if (selectedGroup !== 'Italia' || selectedRegion === 'Tutti') return ['Tutti'];
    const cities = new Set(
      archiveItems
        .filter((item) => item.country === 'Italia' && item.region === selectedRegion && item.city)
        .map((item) => item.city as string)
    );
    return ['Tutti', ...Array.from(cities)];
  }, [archiveItems, selectedGroup, selectedRegion]);

  const filteredItems = useMemo(() => {
    return archiveItems.filter((item) => {
      const matchGroup = selectedGroup === 'Tutti' || item.destinationGroup === selectedGroup;
      const matchRegion = selectedRegion === 'Tutti' || item.region === selectedRegion;
      const matchCity = selectedCity === 'Tutti' || item.city === selectedCity;
      return matchGroup && matchRegion && matchCity;
    });
  }, [archiveItems, selectedCity, selectedGroup, selectedRegion]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const featuredItem = paginatedItems[0];
  const secondaryItems = paginatedItems.slice(1);
  const activeGeoLabel =
    selectedCity !== 'Tutti'
      ? selectedCity
      : selectedRegion !== 'Tutti'
        ? selectedRegion
        : selectedGroup !== 'Tutti'
          ? selectedGroup
          : 'Tutte le aree';
  const activeGeoNote =
    selectedCity !== 'Tutti'
      ? 'Stai guardando il livello piu preciso del filtro geografico.'
      : selectedRegion !== 'Tutti'
        ? 'Hai ristretto la selezione a una regione o area italiana.'
        : selectedGroup !== 'Tutti'
          ? 'Hai scelto una macro-area geografica come punto di ingresso.'
          : 'Parti da una macro-area e lascia che il filtro restringa solo quando serve.';

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

  const activeGroupImage =
    groupVisuals[selectedGroup === 'Tutti' ? 'Italia' : selectedGroup] || groupVisuals.Italia;

  return (
    <PageLayout>
      <SEO
        title="Destinazioni"
        description="Esplora l archivio geografico di Travelliniwithus: destinazioni, regioni e citta da filtrare in modo chiaro per arrivare subito ai contenuti giusti."
        canonical={`${SITE_URL}/destinazioni`}
      />

      {/* --- IMMERSIVE HERO --- */}
      <section
        ref={heroRef}
        className="relative flex min-h-[60vh] items-end overflow-hidden bg-ink pb-16 pt-32 md:min-h-[70vh] md:pt-40"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGroupImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <motion.div style={{ scale: heroScale }} className="h-full w-full">
              <OptimizedImage
                src={activeGroupImage}
                alt="Destinazioni Travelliniwithus"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/20" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
          <div className="mb-6">
            <Breadcrumbs
              items={breadcrumbItems}
              className="[&_a]:text-white/60 [&_span]:text-white/40 [&_svg]:text-white/30"
            />
          </div>
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)] md:text-xs">
            Archivio per luogo
          </span>
          <h1 className="mb-6 text-5xl font-serif font-medium leading-none text-white md:text-7xl lg:text-8xl">
            Parti da un luogo,
            <br />
            <span className="italic text-white/60">poi restringi bene</span>
          </h1>
          <p className="max-w-xl text-lg font-normal leading-relaxed text-white/85">
            Questo e l ingresso geografico del progetto: gruppi, regioni e citta per capire in fretta dove approfondire, senza perderti in listing troppo ampi o poco leggibili.
          </p>

          {/* Discovery counter */}
          <motion.div
            key={filteredItems.length}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-md"
          >
            <MapPin size={16} className="text-[var(--color-accent)]" />
            <span className="text-2xl font-serif text-white">{filteredItems.length}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              contenuti trovati
            </span>
          </motion.div>

          <div className="mt-8 grid gap-3 md:max-w-3xl md:grid-cols-3">
            {[
              ['1', 'Scegli la macro-area', 'Italia, Europa o un gruppo geografico piu ampio.'],
              ['2', 'Restringi se serve', 'In Italia puoi scendere a regione e localita.'],
              ['3', 'Apri solo i contenuti giusti', 'Ogni card ti porta al contenuto gia filtrato dal luogo.'],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-2xl border border-white/12 bg-black/18 px-5 py-4 backdrop-blur-md">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Step {step}
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/72">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTINENT "PASSPORT STAMP" CARDS --- */}
      <Section>
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {DESTINATION_GROUPS.map((group, idx) => {
            const isActive = selectedGroup === group;
            const count = archiveItems.filter((i) => i.destinationGroup === group).length;
            return (
              <motion.button
                key={group}
                onClick={() => updateSearch({ group, region: null, area: null, city: null })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className={`group relative flex flex-col overflow-hidden rounded-[1.8rem] border-2 bg-white p-4 text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-5 md:pb-6 ${
                  idx % 2 === 0 ? 'md:rotate-[0.5deg]' : 'md:-rotate-[0.5deg]'
                } md:hover:rotate-0 ${
                  isActive ? 'border-[var(--color-accent)] shadow-lg' : 'border-black/5'
                }`}
              >
                <div className="relative mb-4 aspect-[4/4.6] w-full overflow-hidden rounded-[1.4rem]">
                  <OptimizedImage
                    src={groupVisuals[group]}
                    alt={group}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="pr-8">
                  <span className="block text-xl font-serif leading-none text-[var(--color-ink)]">{group}</span>
                  <p className="mt-2 text-sm leading-relaxed text-black/58">
                    {groupDescriptions[group]}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/42">
                  <span>{count} {count === 1 ? 'contenuto' : 'contenuti'}</span>
                  <span className="text-[var(--color-accent)] transition-colors group-hover:text-[var(--color-ink)]">
                    Apri area
                  </span>
                </div>

                <div
                  className={`absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed text-xs font-bold transition-all ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white scale-110'
                      : 'border-[var(--color-accent)]/40 bg-white text-[var(--color-accent)]'
                  }`}
                  style={{ transform: `rotate(${12 + idx * 5}deg)` }}
                >
                  {count}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mb-10 rounded-[2rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Esplora meglio
              </span>
              <h2 className="mt-3 text-3xl font-serif text-[var(--color-ink)]">
                Qui il filtro principale e il luogo. Tutto il resto viene dopo.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-accent-text)]">
                Prima scegli l area geografica, poi se serve scendi di dettaglio. Se invece non hai ancora una meta chiara e vuoi partire dal tipo di viaggio, conviene andare su Esperienze.
              </p>
            </div>
            <Link
              to="/esperienze"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]"
            >
              Vai alle esperienze <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mb-12 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="archive-panel-light">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Percorso attivo
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <h2 className="text-3xl font-serif text-[var(--color-ink)]">{activeGeoLabel}</h2>
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                {filteredItems.length} {filteredItems.length === 1 ? 'contenuto' : 'contenuti'}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/62">{activeGeoNote}</p>
          </div>

          <div className="archive-panel-dark">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Uso rapido
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/78">
              <li>Usa la macro-area per togliere subito rumore.</li>
              <li>Scendi a regione e localita solo quando sei gia in Italia.</li>
              <li>Se la meta non e chiara, passa a Esperienze.</li>
            </ul>
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="archive-filter-shell mb-12 flex w-full flex-col gap-6">
          {/* Active filters strip */}
          {(selectedGroup !== 'Tutti' ||
            selectedRegion !== 'Tutti' ||
            selectedCity !== 'Tutti') && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mr-2">
                Filtri attivi:
              </span>
              {selectedGroup !== 'Tutti' && (
                <button
                  onClick={() => updateSearch({ group: null, area: null, city: null })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  {selectedGroup} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              {selectedRegion !== 'Tutti' && (
                <button
                  onClick={() => updateSearch({ area: null, city: null })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  {selectedRegion} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              {selectedCity !== 'Tutti' && (
                <button
                  onClick={() => updateSearch({ city: null })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  {selectedCity} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              <button
                onClick={resetFilters}
                className="ml-2 text-[10px] font-bold uppercase tracking-widest text-black/40 underline transition-colors hover:text-[var(--color-accent)]"
              >
                Resetta tutto
              </button>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
            <div className="archive-filter-panel bg-[var(--color-sand)]">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Step 1 · Macro-area
              </div>
              <div className="archive-filter-track">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => updateSearch({ group, region: null, area: null, city: null })}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                      selectedGroup === group
                        ? 'bg-black text-white'
                        : 'bg-white text-black/60 hover:bg-black/5'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="archive-filter-panel bg-white">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
                Criterio
              </div>
              <p className="text-sm leading-relaxed text-black/62">
                In questa pagina il luogo comanda la navigazione. Ogni step serve a restringere senza duplicare pagine o creare percorsi confusi.
              </p>
            </div>
          </div>

          {selectedGroup === 'Italia' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="archive-filter-panel bg-[var(--color-sand)]">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Step 2 · Regione
                </div>
                <div className="archive-filter-track">
                  {availableRegions.map((region) => (
                    <button
                      key={region}
                      onClick={() => updateSearch({ area: region, city: null })}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                        selectedRegion === region
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-white text-black/60 hover:bg-black/5'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {availableCities.length > 1 && (
                <div className="archive-filter-panel bg-white">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
                    Step 3 · Localita
                  </div>
                  <div className="archive-filter-track">
                    {availableCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => updateSearch({ city })}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                          selectedCity === city
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'bg-white text-black/60 hover:bg-black/5'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] px-5 py-4 text-sm text-[var(--color-accent-text)]">
            Qui stai filtrando i contenuti per <strong>luogo</strong>. Se vuoi partire dallo stile
            di viaggio, usa la sezione{' '}
            <Link
              to="/esperienze"
              className="font-semibold underline underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
            >
              Esperienze
            </Link>
            : lo stesso archivio, ma ordinato per mood e tipo di esperienza.
          </div>
        </div>

        {/* --- ARTICLE GRID --- */}
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
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Archivio filtrato
                </div>
                <h2 className="mt-3 text-3xl font-serif text-[var(--color-ink)]">
                  Destinazioni ordinate dal luogo
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-black/58">
                Un contenuto in evidenza per orientarti subito, poi una selezione piu compatta da aprire in base all area che hai scelto.
              </p>
            </div>
            <div className="space-y-8">
              {featuredItem && (() => {
                const visual = featuredItem.primaryExperience
                  ? getExperienceVisual(featuredItem.primaryExperience)
                  : null;
                const ExpIcon = visual?.icon;

                return (
                  <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="archive-featured-card">
                    <Link
                      to={featuredItem.link}
                      className="archive-featured-link group lg:grid-cols-[1.15fr_minmax(0,0.85fr)]"
                    >
                      <div className="archive-featured-media">
                        <OptimizedImage
                          src={featuredItem.image}
                          alt={featuredItem.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/18 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                            {getArchiveLocationLabel(featuredItem)}
                          </span>
                          {featuredItem.primaryExperience && (
                            <span
                              className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white"
                              style={{ backgroundColor: `${visual?.color ?? 'var(--color-accent)'}CC` }}
                            >
                              {featuredItem.primaryExperience}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="archive-featured-body">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                            Contenuto in evidenza
                          </div>
                          <h2 className="mt-4 text-3xl font-serif leading-[1.02] text-[var(--color-ink)] md:text-4xl">
                            {featuredItem.title}
                          </h2>
                          <p className="mt-5 text-base leading-relaxed text-black/65">
                            Apri questo contenuto se vuoi partire da <strong>{getArchiveLocationLabel(featuredItem)}</strong> e vedere subito un esempio chiaro di come il sito ordina le destinazioni.
                          </p>
                        </div>

                        <div className="archive-featured-support">
                          <div className="text-sm leading-relaxed text-black/60">
                            {ExpIcon && featuredItem.primaryExperience
                              ? `Ha anche un taglio esperienza: ${featuredItem.primaryExperience}.`
                              : 'Ingresso geografico puro, pensato per farti partire dal posto.'}
                          </div>
                          <div className="shrink-0 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                            Apri <ArrowRight size={14} className="inline ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })()}

              {secondaryItems.length > 0 && (
                <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {secondaryItems.map((item, index) => {
                      const visual = item.primaryExperience
                        ? getExperienceVisual(item.primaryExperience)
                        : null;
                      const ExpIcon = visual?.icon;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.45,
                            delay: index * 0.06,
                            ease: [0.21, 0.47, 0.32, 0.98],
                          }}
                        >
                          <Link to={item.link} className="archive-grid-card group">
                            <div className="archive-grid-card-media">
                              <OptimizedImage
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                            <div className="archive-grid-card-body">
                              <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                                  {getArchiveLocationLabel(item)}
                                </span>
                                {item.primaryExperience && ExpIcon && (
                                  <span
                                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                                    style={{ backgroundColor: visual.color }}
                                  >
                                    <ExpIcon size={11} />
                                    {item.primaryExperience}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-2xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                                {item.title}
                              </h3>
                              <p className="mt-4 text-sm leading-relaxed text-black/62">
                                Parti da qui se vuoi capire in fretta se questa area merita davvero una deviazione o un approfondimento.
                              </p>
                              <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                                Apri il contenuto
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <div className="mt-24">
          <CrossLinkWidget variant="to-esperienze" />
        </div>

        <div className="mt-16">
          <Newsletter variant="sand" />
        </div>
      </Section>
    </PageLayout>
  );
}


