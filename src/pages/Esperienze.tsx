import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ArticleSkeleton from '../components/ArticleSkeleton';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import Pagination from '../components/Pagination';
import Section from '../components/Section';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import EmptyState from '../components/EmptyState';
import CrossLinkWidget from '../components/CrossLinkWidget';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_DESTINATION_CARD } from '../config/demoContent';
import { SITE_URL } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';
import { DESTINATION_GROUPS, EXPERIENCE_TYPES, getExperienceTypeFromQuery, slugifyExperienceType } from '../config/contentTaxonomy';
import { getArchiveLocationLabel, mapArticleToArchiveItem, type ArchiveItem } from '../utils/contentArchive';
import { getExperienceVisual, EXPERIENCE_VISUALS } from '../config/experienceVisuals';

const experienceDescriptions: Record<string, string> = {
  'Posti particolari': 'Luoghi fuori dall\'ordinario, indirizzi curiosi e scorci che danno personalità al viaggio.',
  'Food & Ristoranti': 'Ristoranti, tavole e indirizzi che meritano davvero una deviazione o una serata dedicata.',
  'Locali insoliti': 'Posti con atmosfera, concept o posizione che li rendono subito memorabili.',
  'Hotel con carattere': 'Strutture in cui design, atmosfera e contesto fanno parte dell\'esperienza.',
  'Weekend romantici': 'Idee e luoghi da vivere in coppia con un taglio più bello, utile e concreto.',
  'Borghi e città d\'arte': 'Centri storici, borghi e città che hanno fascino, patrimonio e una visita ben costruita.',
  'Passeggiate panoramiche': 'Percorsi, viste e camminate che valgono davvero il tempo del viaggio.',
  'Relax, terme e spa': 'Pause lente, benessere e posti dove rallentare con più criterio.',
  'Esperienze insolite': 'Musei strani, attività particolari e spunti da salvare proprio perché diversi.',
  'Gite e day trip': 'Uscite facili da organizzare per una giornata o un weekend vicino.',
};

/* Mood board span pattern for 10 types */
const spanPattern = [2, 2, 1, 1, 1, 2, 1, 1, 1, 2];

export default function Esperienze() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['experience-archive', demoSettings.showEditorialDemo],
    queryFn: fetchArticles,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const selectedExperience = getExperienceTypeFromQuery(searchParams.get('type')) || 'Tutti';
  const selectedGroup = searchParams.get('group') || 'Tutti';
  const selectedRegion = searchParams.get('area') || 'Tutti';
  const selectedCity = searchParams.get('city') || 'Tutti';
  const breadcrumbItems = [{ label: 'Esperienze' }];
  const itemsPerPage = 6;

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const mapped = articles.map((article) => mapArticleToArchiveItem(article)).filter((item) => item.experienceTypes.length > 0);
    if (mapped.length > 0) return mapped;
    return demoSettings.showEditorialDemo
      ? [{
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
        }]
      : [];
  }, [articles, demoSettings.showEditorialDemo]);

  const availableExperiences = useMemo(() => {
    const types = new Set<string>();
    archiveItems.forEach((item) => item.experienceTypes.forEach((type) => types.add(type)));
    return ['Tutti', ...EXPERIENCE_TYPES.filter((type) => types.has(type))];
  }, [archiveItems]);

  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    archiveItems.forEach((item) => groups.add(item.destinationGroup));
    return ['Tutti', ...DESTINATION_GROUPS.filter((group) => groups.has(group))];
  }, [archiveItems]);

  const availableRegions = useMemo(() => {
    if (selectedGroup !== 'Italia') return ['Tutti'];
    const regions = new Set(
      archiveItems.filter((item) => item.country === 'Italia' && item.region).map((item) => item.region as string)
    );
    return ['Tutti', ...Array.from(regions)];
  }, [archiveItems, selectedGroup]);

  const availableCities = useMemo(() => {
    if (selectedGroup !== 'Italia' || selectedRegion === 'Tutti') return ['Tutti'];
    const cities = new Set(
      archiveItems.filter((item) => item.country === 'Italia' && item.region === selectedRegion && item.city).map((item) => item.city as string)
    );
    return ['Tutti', ...Array.from(cities)];
  }, [archiveItems, selectedGroup, selectedRegion]);

  const filteredItems = useMemo(() => {
    return archiveItems.filter((item) => {
      const matchExperience = selectedExperience === 'Tutti' || item.experienceTypes.includes(selectedExperience);
      const matchGroup = selectedGroup === 'Tutti' || item.destinationGroup === selectedGroup;
      const matchRegion = selectedRegion === 'Tutti' || item.region === selectedRegion;
      const matchCity = selectedCity === 'Tutti' || item.city === selectedCity;
      return matchExperience && matchGroup && matchRegion && matchCity;
    });
  }, [archiveItems, selectedCity, selectedExperience, selectedGroup, selectedRegion]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const updateSearch = (updates: Record<string, string | null>) => {
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'Tutti') next.delete(key);
        else next.set(key, value);
      });
      return next;
    }, { replace: true });
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const floatingExperiences = Object.entries(EXPERIENCE_VISUALS).slice(0, 4);

  return (
    <PageLayout>
      <SEO
        title="Esperienze"
        description="Filtra lo stesso archivio Travelliniwithus per tipologia: posti particolari, food, hotel con carattere, weekend romantici e molto altro."
        canonical={`${SITE_URL}/esperienze`}
      />

      {/* --- VISUAL HERO --- */}
      <section className="bg-gradient-to-b from-[var(--color-accent-soft)] to-[var(--color-sand)] pb-8 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="mb-4 block font-script text-xl text-[var(--color-accent)]">Filtro tematico</span>
              <h1 className="mb-6 text-5xl font-serif font-medium leading-none text-[var(--color-ink)] md:text-7xl">
                Parti dal tipo<br />
                <span className="italic text-black/50">di esperienza</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg font-normal leading-relaxed text-black/70">
                Lo stesso archivio di Destinazioni, aperto dal lato delle esperienze: food, posti particolari, weekend romantici e molto altro.
              </p>

              {/* Discovery counter */}
              <motion.div
                key={filteredItems.length}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-accent)]/20 bg-white px-6 py-3 shadow-sm"
              >
                <Compass size={16} className="text-[var(--color-accent)]" />
                <span className="text-2xl font-serif text-[var(--color-ink)]">{filteredItems.length}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">esperienze trovate</span>
              </motion.div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/destinazioni"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-black"
                >
                  Vai a destinazioni <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Floating experience cards */}
            <div className="relative hidden h-72 lg:block">
              {floatingExperiences.map(([name, visual], idx) => {
                const Icon = visual.icon;
                const positions = [
                  { top: '0', left: '10%', rotate: -6 },
                  { top: '5%', right: '5%', rotate: 4 },
                  { bottom: '5%', left: '20%', rotate: 3 },
                  { bottom: '0', right: '15%', rotate: -4 },
                ];
                const pos = positions[idx];
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.12, duration: 0.6 }}
                    className="absolute"
                    style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                  >
                    <div
                      className="rounded-2xl border border-black/5 bg-white p-5 shadow-lg transition-transform hover:scale-105"
                      style={{ borderLeftColor: visual.color, borderLeftWidth: '4px' }}
                    >
                      <Icon size={24} style={{ color: visual.color }} className="mb-2" />
                      <span className="block text-sm font-serif text-[var(--color-ink)]">{name}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Section>
        {/* --- MOOD BOARD EXPERIENCE TYPES --- */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {EXPERIENCE_TYPES.filter((item) => availableExperiences.includes(item)).map((experience, idx) => {
            const visual = getExperienceVisual(experience);
            const Icon = visual.icon;
            const isActive = selectedExperience === experience;
            const span = spanPattern[idx] ?? 1;
            const count = archiveItems.filter((item) => item.experienceTypes.includes(experience)).length;

            return (
              <motion.button
                key={experience}
                type="button"
                onClick={() => updateSearch({ type: slugifyExperienceType(experience) })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className={`rounded-[1.8rem] border border-l-[3px] px-6 py-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  span === 2 ? 'md:col-span-2' : ''
                } ${
                  isActive
                    ? 'border-transparent shadow-lg'
                    : 'border-black/5 bg-white hover:border-black/10'
                }`}
                style={isActive ? { backgroundColor: visual.colorLight, borderColor: visual.color, borderLeftColor: visual.color } : { borderLeftColor: visual.color }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: isActive ? `${visual.color}20` : visual.colorLight, color: visual.color }}
                  >
                    <Icon size={20} />
                  </div>
                  {isActive && (
                    <span className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: visual.color }}>
                      Attivo
                    </span>
                  )}
                </div>
                <div className="mb-2 flex items-baseline gap-3">
                  <h2 className="text-xl font-serif text-[var(--color-ink)] md:text-2xl">{experience}</h2>
                  <span className="text-xs font-bold text-black/30">{count} {count === 1 ? 'articolo' : 'articoli'}</span>
                </div>
                <p className="text-sm font-normal leading-relaxed text-black/65">{experienceDescriptions[experience]}</p>
              </motion.button>
            );
          })}
        </div>

        {/* --- GEOGRAPHIC FILTERS --- */}
        <div className="mb-12 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-6 shadow-sm">
          {/* Active filters strip */}
          {(selectedExperience !== 'Tutti' || selectedGroup !== 'Tutti' || selectedRegion !== 'Tutti' || selectedCity !== 'Tutti') && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[10px] font-bold uppercase tracking-widest text-black/40">Filtri attivi:</span>
              {selectedExperience !== 'Tutti' && (
                <button onClick={() => updateSearch({ type: null })} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: getExperienceVisual(selectedExperience).color }}>
                  {selectedExperience} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              {selectedGroup !== 'Tutti' && (
                <button onClick={() => updateSearch({ group: null, area: null, city: null })} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  {selectedGroup} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              {selectedRegion !== 'Tutti' && (
                <button onClick={() => updateSearch({ area: null, city: null })} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  {selectedRegion} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              {selectedCity !== 'Tutti' && (
                <button onClick={() => updateSearch({ city: null })} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  {selectedCity} <span className="ml-1 opacity-70">&times;</span>
                </button>
              )}
              <button onClick={resetFilters} className="ml-2 text-[10px] font-bold uppercase tracking-widest text-black/40 underline transition-colors hover:text-[var(--color-accent)]">
                Resetta tutto
              </button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col gap-3 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest text-black/50">Area geografica</span>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {availableGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => updateSearch({ group, area: null, city: null })}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                      selectedGroup === group ? 'bg-black text-white' : 'bg-white text-black/60 hover:bg-black/5'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {selectedGroup === 'Italia' && (
              <>
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/50">Regione</span>
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {availableRegions.map((region) => (
                      <button
                        key={region}
                        onClick={() => updateSearch({ area: region, city: null })}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                          selectedRegion === region ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-black/60 hover:bg-black/5'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {availableCities.length > 1 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-black/50">Città / località</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                      {availableCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => updateSearch({ city })}
                          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                            selectedCity === city ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-black/60 hover:bg-black/5'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* --- ARTICLE GRID (Editorial Style) --- */}
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
            <div className="space-y-8">
              {/* First 2 items: horizontal editorial cards */}
              {paginatedItems.slice(0, 2).map((item, index) => {
                const visual = item.primaryExperience ? getExperienceVisual(item.primaryExperience) : null;
                const ExpIcon = visual?.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.link}
                      className="group block overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Accent top line */}
                      {visual && <div className="h-1 w-full" style={{ backgroundColor: visual.color }} />}

                      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]">
                        <div className="aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[280px]">
                          <OptimizedImage
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col justify-center p-8 md:p-10">
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            {item.primaryExperience && ExpIcon && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                                style={{ backgroundColor: visual.color }}
                              >
                                <ExpIcon size={12} />
                                {item.primaryExperience}
                              </span>
                            )}
                            <span className="rounded-full bg-black/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                              {getArchiveLocationLabel(item)}
                            </span>
                          </div>
                          <h3 className="mb-3 text-3xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)] md:text-4xl">
                            {item.title}
                          </h3>
                          <p className="mb-6 font-normal leading-relaxed text-black/65">
                            {getArchiveLocationLabel(item)}
                          </p>
                          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            Leggi il contenuto <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Remaining items: standard vertical cards */}
              {paginatedItems.length > 2 && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedItems.slice(2).map((item, index) => {
                    const visual = item.primaryExperience ? getExperienceVisual(item.primaryExperience) : null;
                    const ExpIcon = visual?.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                      >
                        <Link
                          to={item.link}
                          className="group block overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
                        >
                          {visual && <div className="h-1 w-full" style={{ backgroundColor: visual.color }} />}
                          <div className="aspect-[4/3] overflow-hidden">
                            <OptimizedImage
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-6">
                            <div className="mb-3 flex flex-wrap gap-2">
                              {item.primaryExperience && ExpIcon && (
                                <span
                                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                                  style={{ backgroundColor: visual.color }}
                                >
                                  <ExpIcon size={11} />
                                  {item.primaryExperience}
                                </span>
                              )}
                              <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
                                {getArchiveLocationLabel(item)}
                              </span>
                            </div>
                            <h3 className="text-2xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                              {item.title}
                            </h3>
                            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                              Apri il contenuto
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        <div className="mt-24">
          <CrossLinkWidget variant="to-destinazioni" />
        </div>

        <div className="mt-16">
          <Newsletter variant="sand" />
        </div>
      </Section>
    </PageLayout>
  );
}
