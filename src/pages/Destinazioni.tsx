import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import InteractiveMap from '../components/InteractiveMap';
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

// TODO(@travelliniwithus): PLACEHOLDER — servono foto rappresentative per ogni gruppo geografico (una per continente/area)
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

    return demoSettings.showDestinationDemo
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
  }, [articles, demoSettings.showDestinationDemo]);

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
        description="Esplora il cuore editoriale di Travelliniwithus: destinazioni, regioni, città e articoli filtrabili anche per tipo di esperienza."
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
          <span className="mb-4 block font-script text-xl text-[var(--color-accent)] md:text-2xl">
            Archivio principale
          </span>
          <h1 className="mb-6 text-5xl font-serif font-medium leading-none text-white md:text-7xl lg:text-8xl">
            Destinazioni, regioni
            <br />
            <span className="italic text-white/60">e città da esplorare</span>
          </h1>
          <p className="max-w-xl text-lg font-normal leading-relaxed text-white/85">
            Tutto quello che abbiamo visitato, mangiato e vissuto — organizzato per farti trovare
            subito il posto giusto.
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
        </div>
      </section>

      {/* --- CONTINENT "PASSPORT STAMP" CARDS --- */}
      <Section>
        <div className="mb-16 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
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
                className={`group relative flex flex-col items-center overflow-hidden rounded-[1.8rem] border-2 bg-white p-5 pb-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  idx % 2 === 0 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'
                } hover:rotate-0 ${
                  isActive ? 'border-[var(--color-accent)] shadow-lg' : 'border-black/5'
                }`}
              >
                {/* Photo */}
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl">
                  <img
                    src={groupVisuals[group]}
                    alt={group}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Name */}
                <span className="mb-1 text-lg font-serif text-[var(--color-ink)]">{group}</span>

                {/* Stamp badge */}
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

        {/* Map Section */}
        <div className="mb-16 hidden md:block">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/5 shadow-sm">
            <div className="absolute left-0 top-0 z-10 rounded-br-2xl bg-white/90 px-6 py-3 backdrop-blur-md">
              <span className="font-script text-lg text-[var(--color-accent)]">
                Esplora la mappa
              </span>
            </div>
            <InteractiveMap />
          </div>
        </div>

        {/* Mobile map teaser */}
        <div className="mb-16 block md:hidden">
          <Link
            to="/mappa"
            className="flex items-center justify-between rounded-2xl border border-black/5 bg-[var(--color-accent-soft)] p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <span className="block font-script text-lg text-[var(--color-accent)]">
                Mappa interattiva
              </span>
              <span className="text-sm font-light text-black/60">
                Scopri tutti i contenuti sulla mappa
              </span>
            </div>
            <ArrowRight className="text-[var(--color-accent)]" size={20} />
          </Link>
        </div>

        {/* --- FILTERS --- */}
        <div className="mb-12 flex w-full flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)] p-6 shadow-sm">
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

          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-black/50">
              Area geografica
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
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

          {selectedGroup === 'Italia' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">
                  Regione
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
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
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/50">
                    Città / località
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
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
            .
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
            <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((item, index) => {
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
                        duration: 0.5,
                        delay: index * 0.08,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                      className={index % 3 === 1 ? 'md:mt-10' : index % 3 === 2 ? 'md:mt-5' : ''}
                    >
                      <Link
                        to={item.link}
                        className="group relative block aspect-[3/4] overflow-hidden rounded-[var(--radius-xl)] border border-black/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[var(--shadow-premium)] md:h-[420px] md:aspect-auto"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 md:group-hover:opacity-0" />

                        {/* Experience icon badge */}
                        {ExpIcon && (
                          <div
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 backdrop-blur-md"
                            style={{ backgroundColor: `${visual.color}20`, color: visual.color }}
                          >
                            <ExpIcon size={18} />
                          </div>
                        )}

                        <div className="absolute bottom-8 left-8 right-8 transition-all duration-500 md:group-hover:translate-y-4 md:group-hover:opacity-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                              {getArchiveLocationLabel(item)}
                            </span>
                            {item.primaryExperience && (
                              <span
                                className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md"
                                style={{
                                  backgroundColor: `${visual?.color ?? 'var(--color-accent)'}CC`,
                                }}
                              >
                                {item.primaryExperience}
                              </span>
                            )}
                          </div>
                          <h3 className="mb-4 text-2xl font-serif leading-tight text-white md:text-3xl">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white md:hidden">
                            Apri il contenuto <ArrowRight size={14} />
                          </div>
                        </div>

                        <div className="absolute inset-0 hidden flex-col items-center justify-center bg-black/40 p-8 text-center opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100 md:flex">
                          <h3 className="mb-6 translate-y-4 text-4xl font-serif leading-tight text-white transition-transform duration-500 group-hover:translate-y-0">
                            {item.title}
                          </h3>
                          <div className="flex translate-y-4 items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all duration-500 delay-75 group-hover:translate-y-0 hover:bg-white hover:text-black">
                            Apri il contenuto <ArrowRight size={16} />
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        {visual && (
                          <div
                            className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
                            style={{ backgroundColor: visual.color }}
                          />
                        )}
                      </Link>
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
