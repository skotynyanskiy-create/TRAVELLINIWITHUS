import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Compass, Filter, MapPin, Search, ShieldCheck, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ArticleSkeleton from '../components/ArticleSkeleton';
import Breadcrumbs from '../components/Breadcrumbs';
import CrossLinkWidget from '../components/CrossLinkWidget';
import EmptyState from '../components/EmptyState';
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

const EXPERIENCE_DESCRIPTIONS: Record<string, string> = {
  'Posti particolari':
    'Luoghi insoliti, indirizzi salvabili e scoperte che danno personalita al viaggio.',
  'Food & Ristoranti':
    'Tavole, mercati e indirizzi scelti per atmosfera, sostanza e utilita reale.',
  'Locali insoliti':
    'Locali con concept, posizione o carattere capaci di rendere memorabile una tappa.',
  'Hotel con carattere':
    'Soggiorni dove design, atmosfera e contesto fanno parte del viaggio.',
  'Weekend romantici':
    'Idee brevi, curate e realistiche per partire in coppia senza costruire un sogno finto.',
  "Borghi e citta d'arte":
    'Centri storici, scorci e patrimonio da vivere con calma, non solo da fotografare.',
  'Passeggiate panoramiche':
    'Percorsi, viste e camminate che valgono davvero il tempo del viaggio.',
  'Relax, terme e spa':
    'Pause lente, terme e luoghi dove staccare con criterio.',
  'Esperienze insolite':
    'Musei strani, attivita particolari e spunti da salvare proprio perche diversi.',
  'Gite e day trip':
    'Uscite facili da organizzare per una giornata o un weekend vicino.',
};

const HERO_VISUAL =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop';

function uniqueValues(items: Array<string | undefined>) {
  return Array.from(new Set(items.filter((item): item is string => Boolean(item && item !== 'Da definire'))));
}

function getDemoArchiveItem(): ArchiveItem {
  return {
    id: DEMO_DESTINATION_CARD.id,
    title: DEMO_DESTINATION_CARD.title,
    excerpt:
      'Una preview editoriale temporanea per mostrare come appariranno le esperienze quando saranno pubblicati contenuti reali.',
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
  children: string;
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

function ExperienceCard({
  experience,
  count,
  active,
  onSelect,
}: {
  experience: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  const visual = getExperienceVisual(experience);
  const Icon = visual.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-[1.75rem] border bg-white p-6 text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
        active ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/10' : 'border-black/5'
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <Icon size={23} style={{ color: visual.color }} />
        </span>
        <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/45">
          {count} {count === 1 ? 'storia' : 'storie'}
        </span>
      </div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-black/35">
        {visual.label}
      </span>
      <h2 className="text-2xl font-serif leading-tight text-[var(--color-ink)]">{experience}</h2>
      <p className="mt-4 text-sm leading-relaxed text-black/65">{EXPERIENCE_DESCRIPTIONS[experience]}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
        {active ? 'Filtro attivo' : 'Filtra'} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function StoryCard({ item, isDemo }: { item: ArchiveItem; isDemo: boolean }) {
  const visual = item.primaryExperience ? getExperienceVisual(item.primaryExperience) : getExperienceVisual('Posti particolari');
  const Icon = visual.icon;

  return (
    <Link
      to={item.link}
      className="group block overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
    >
      <div className="grid h-full md:grid-cols-[0.95fr_1.25fr]">
        <div className="relative min-h-[240px] overflow-hidden">
          <OptimizedImage
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {isDemo && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black/60">
              Preview
            </span>
          )}
        </div>
        <div className="flex flex-col justify-center p-7 md:p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
              <Icon size={12} style={{ color: visual.color }} />
              {item.primaryExperience || 'Esperienza'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black/45">
              <MapPin size={12} />
              {getArchiveLocationLabel(item)}
            </span>
          </div>
          <h3 className="text-3xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
            {item.title}
          </h3>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-black/65">
            {item.excerpt ||
              'Una storia da leggere per capire se questa esperienza merita davvero di entrare nel prossimo viaggio.'}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            Leggi il contenuto <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

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

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const mapped = articles
      .map((article) => mapArticleToArchiveItem(article))
      .filter((item) => item.experienceTypes.length > 0);

    if (mapped.length > 0) return mapped;
    return demoSettings.showEditorialDemo ? [getDemoArchiveItem()] : [];
  }, [articles, demoSettings.showEditorialDemo]);

  const availableGroups = useMemo(() => {
    const groups = new Set(archiveItems.map((item) => item.destinationGroup));
    return ['Tutti', ...DESTINATION_GROUPS.filter((group) => groups.has(group))];
  }, [archiveItems]);

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

  const filteredItems = useMemo(
    () =>
      archiveItems.filter((item) => {
        const matchExperience =
          selectedExperience === 'Tutti' || item.experienceTypes.includes(selectedExperience);
        const matchGroup = selectedGroup === 'Tutti' || item.destinationGroup === selectedGroup;
        const matchRegion = selectedRegion === 'Tutti' || item.region === selectedRegion;
        const matchCity = selectedCity === 'Tutti' || item.city === selectedCity;

        return matchExperience && matchGroup && matchRegion && matchCity;
      }),
    [archiveItems, selectedCity, selectedExperience, selectedGroup, selectedRegion]
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const hasActiveFilters =
    selectedExperience !== 'Tutti' ||
    selectedGroup !== 'Tutti' ||
    selectedRegion !== 'Tutti' ||
    selectedCity !== 'Tutti';
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
        title="Esperienze"
        description="Esplora Travelliniwithus per intenzione di viaggio: posti particolari, food, hotel con carattere, borghi, relax, weekend e gite."
        canonical={`${SITE_URL}/esperienze`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Esperienze Travelliniwithus',
          url: `${SITE_URL}/esperienze`,
          description:
            'Archivio tematico di esperienze travel selezionate da Travelliniwithus.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Esperienze', item: `${SITE_URL}/esperienze` },
            ],
          },
        }}
      />

      <section className="relative overflow-hidden bg-[var(--color-sand)] pb-20 pt-32 md:pt-40">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <OptimizedImage
            src={HERO_VISUAL}
            alt=""
            aria-hidden="true"
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-sand)] via-[var(--color-sand)]/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <Breadcrumbs items={[{ label: 'Esperienze' }]} />
          <div className="mt-10 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)] shadow-sm">
              <Search size={14} /> Tassonomia editoriale
            </span>
            <h1 className="text-5xl font-serif font-medium leading-[0.95] text-[var(--color-ink)] md:text-7xl lg:text-8xl">
              Scegli il ritmo
              <span className="block italic text-black/50">del viaggio</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-black/70 md:text-xl">
              Non sempre si parte da un Paese. A volte si parte da un tavolo, un hotel, un borgo,
              una vista o una pausa lenta. Qui trovi lo stesso archivio organizzato per intenzione.
            </p>
          </div>

          <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
            {['Intenzione prima della lista', 'Categorie sostenute dai contenuti', 'Ponte naturale verso guide e destinazioni'].map(
              (item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                  <ShieldCheck size={16} className="mb-3 text-[var(--color-accent)]" />
                  <p className="text-xs font-semibold leading-relaxed text-black/62">{item}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {EXPERIENCE_TYPES.map((experience) => (
            <ExperienceCard
              key={experience}
              experience={experience}
              count={archiveItems.filter((item) => item.experienceTypes.includes(experience)).length}
              active={selectedExperience === experience}
              onSelect={() =>
                updateSearch({
                  type: selectedExperience === experience ? null : slugifyExperienceType(experience),
                })
              }
            />
          ))}
        </div>

        <div className="mb-12 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-surface)] p-5 shadow-sm md:p-7">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                <Filter size={14} /> Raffina la scelta
              </span>
              <h2 className="mt-2 text-2xl font-serif text-[var(--color-ink)]">
                Incrocia esperienza e luogo.
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

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-black/45">
                Area geografica
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {availableGroups.map((group) => (
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

            {selectedGroup === 'Italia' && availableRegions.length > 1 && (
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
            )}

            {selectedGroup === 'Italia' && availableCities.length > 1 && (
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
        </div>

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              <Compass size={14} /> {filteredItems.length} contenuti trovati
            </span>
            <h2 className="mt-2 text-3xl font-serif text-[var(--color-ink)]">
              {selectedExperience === 'Tutti' ? 'Esperienze da leggere e salvare' : selectedExperience}
            </h2>
          </div>
          <Link
            to="/destinazioni"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]"
          >
            Cerca per destinazione <ArrowRight size={14} />
          </Link>
        </div>

        {usingDemo && (
          <div className="mb-8 rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-5 py-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
            Questa e una preview editoriale temporanea: serve a mostrare il layout finche non ci
            sono contenuti reali pubblicati. Prima del deploy pubblico va sostituita o disattivata.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
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
                    <StoryCard item={item} isDemo={usingDemo && item.id === DEMO_DESTINATION_CARD.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        <div className="mt-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CrossLinkWidget variant="to-destinazioni" />
            <CrossLinkWidget variant="to-guide" />
          </div>
        </div>

        <div className="mt-16">
          <Newsletter variant="sand" />
        </div>
      </Section>
    </PageLayout>
  );
}
