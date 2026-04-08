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
import { DEMO_CONTENT_ENABLED } from '../config/runtime';

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

const experienceUseCases: Record<string, string> = {
  'Posti particolari': 'Quando cerchi qualcosa che dia subito personalita al viaggio.',
  'Food & Ristoranti': 'Quando scegli dove mangiare prima ancora del resto.',
  'Locali insoliti': 'Quando conta piu l atmosfera del posto che la checklist classica.',
  'Hotel con carattere': 'Quando la struttura fa parte dell esperienza, non solo del pernottamento.',
  'Weekend romantici': 'Quando vuoi filtrare subito idee da vivere in coppia.',
  'Borghi e cittÃ  d\'arte': 'Quando vuoi un taglio piu culturale e meno casuale.',
  'Passeggiate panoramiche': 'Quando il viaggio ruota attorno a viste, percorsi e aria aperta.',
  'Relax, terme e spa': 'Quando ti serve rallentare e trovare posti in cui fermarti davvero.',
  'Esperienze insolite': 'Quando cerchi attivita o luoghi fuori dai soliti itinerari.',
  'Gite e day trip': 'Quando vuoi idee pratiche da fare in poco tempo.',
};

/* Mood board span pattern for 10 types */
const spanPattern = [2, 2, 1, 1, 1, 2, 1, 1, 1, 2];

export default function Esperienze() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const editorialDemoEnabled = DEMO_CONTENT_ENABLED && demoSettings.showEditorialDemo;
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['experience-archive', editorialDemoEnabled],
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
    return editorialDemoEnabled
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
  }, [articles, editorialDemoEnabled]);

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
  const featuredItem = paginatedItems[0];
  const secondaryItems = paginatedItems.slice(1);
  const activeExperienceLabel = selectedExperience !== 'Tutti' ? selectedExperience : 'Tutti i mood';
  const activeExperienceNote =
    selectedExperience !== 'Tutti'
      ? 'Hai gia scelto il tipo di esperienza. La geografia ora serve solo a stringere.'
      : 'Parti dal mood che vuoi vivere. Il luogo entra dopo, solo se serve restringere meglio.';

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
        description="Filtra l archivio Travelliniwithus per esperienza: food, hotel con carattere, posti particolari, weekend romantici e altri ingressi tematici chiari."
        canonical={`${SITE_URL}/esperienze`}
      />

      {/* --- VISUAL HERO --- */}
      <section className="bg-gradient-to-b from-[var(--color-accent-soft)] to-[var(--color-sand)] pb-8 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">Archivio per mood</span>
              <h1 className="mb-6 text-5xl font-serif font-medium leading-none text-[var(--color-ink)] md:text-7xl">
                Parti dal tipo di viaggio<br />
                <span className="italic text-black/50">che vuoi vivere</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg font-normal leading-relaxed text-black/70">
                Lo stesso archivio di Destinazioni, ma aperto dal lato dell esperienza: food, hotel con carattere, weekend romantici e altri ingressi utili quando la meta non e ancora chiara.
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

              <div className="mb-8 grid gap-3 md:max-w-3xl md:grid-cols-3">
                {[
                  ['1', 'Scegli il mood', 'Parti dal tipo di esperienza che vuoi vivere.'],
                  ['2', 'Usa il luogo solo se ti serve', 'La geografia qui serve a restringere, non a guidare la pagina.'],
                  ['3', 'Apri i contenuti piu coerenti', 'Ogni risultato resta nello stesso archivio, ma ordinato dal lato giusto.'],
                ].map(([step, title, text]) => (
                  <div key={step} className="rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                      Step {step}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-black/62">{text}</p>
                  </div>
                ))}
              </div>

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
                className={`archive-card-thematic border-l-[3px] px-5 py-5 text-left md:px-6 md:py-6 ${
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
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                  {experienceUseCases[experience]}
                </p>
              </motion.button>
            );
          })}
        </div>

        <div className="mb-12 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="archive-panel-light">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Mood attivo
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <h2 className="text-3xl font-serif text-[var(--color-ink)]">{activeExperienceLabel}</h2>
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                {filteredItems.length} {filteredItems.length === 1 ? 'contenuto' : 'contenuti'}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/62">{activeExperienceNote}</p>
          </div>

          <div className="archive-panel-dark">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Uso rapido
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/78">
              <li>Scegli il tipo di esperienza prima di guardare il luogo.</li>
              <li>Usa area, regione o localita solo per stringere il risultato.</li>
              <li>Se hai gia una meta chiara, passa a Destinazioni.</li>
            </ul>
          </div>
        </div>

        {/* --- GEOGRAPHIC FILTERS --- */}
        <div className="archive-filter-shell mb-12 bg-[var(--color-sand)]">
          <div className="mb-6 rounded-2xl border border-[var(--color-accent)]/15 bg-white px-5 py-4 text-sm leading-relaxed text-black/60">
            In questa pagina il filtro principale e <strong>l esperienza</strong>. I filtri geografici servono solo a restringere meglio il risultato dopo che hai gia scelto il tipo di viaggio.
          </div>

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
              <div className="archive-filter-track">
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
                  <div className="archive-filter-track">
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
                    <div className="archive-filter-track">
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
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Archivio filtrato
                </div>
                <h2 className="mt-3 text-3xl font-serif text-[var(--color-ink)]">
                  Esperienze ordinate per mood
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-black/58">
                Prima un contenuto che chiarisce il taglio del mood scelto, poi una selezione piu compatta da aprire con precisione.
              </p>
            </div>
            <div className="space-y-8">
              {featuredItem && (() => {
                const visual = featuredItem.primaryExperience ? getExperienceVisual(featuredItem.primaryExperience) : null;
                const ExpIcon = visual?.icon;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="archive-featured-card"
                  >
                    <Link
                      to={featuredItem.link}
                      className="archive-featured-link group lg:grid-cols-[0.9fr_minmax(0,1.1fr)]"
                    >
                      <div className="archive-featured-media">
                        <OptimizedImage
                          src={featuredItem.image}
                          alt={featuredItem.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2">
                          {featuredItem.primaryExperience && ExpIcon && (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white"
                              style={{ backgroundColor: visual.color }}
                            >
                              <ExpIcon size={12} />
                              {featuredItem.primaryExperience}
                            </span>
                          )}
                          <span className="rounded-full bg-white/18 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                            {getArchiveLocationLabel(featuredItem)}
                          </span>
                        </div>
                      </div>

                      <div className="archive-featured-body">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                            Mood in evidenza
                          </div>
                          <h2 className="mt-4 text-3xl font-serif leading-[1.02] text-[var(--color-ink)] md:text-4xl">
                            {featuredItem.title}
                          </h2>
                          <p className="mt-5 text-base leading-relaxed text-black/65">
                            Apri questo contenuto se vuoi capire in fretta cosa significa <strong>{featuredItem.primaryExperience ?? 'questo mood'}</strong> dentro il progetto, senza partire da una meta precisa.
                          </p>
                        </div>

                        <div className="archive-featured-support">
                          <div className="text-sm leading-relaxed text-black/60">
                            {getArchiveLocationLabel(featuredItem)} e il contesto geografico. Il punto di ingresso, qui, resta il tipo di esperienza.
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {secondaryItems.map((item, index) => {
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
                        <Link to={item.link} className="archive-grid-card group">
                          {visual && <div className="h-1 w-full" style={{ backgroundColor: visual.color }} />}
                          <div className="archive-grid-card-media">
                            <OptimizedImage
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="archive-grid-card-body">
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
                            <p className="mt-4 text-sm leading-relaxed text-black/62">
                              Aprilo quando il tipo di esperienza conta piu della meta e vuoi usare il luogo solo per rifinire.
                            </p>
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
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
