import { useCallback, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ArticleSkeleton from '../components/ArticleSkeleton';
import Breadcrumbs from '../components/Breadcrumbs';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import OptimizedImage from '../components/OptimizedImage';
import DemoContentNotice from '../components/DemoContentNotice';
import FinalCtaSection from '../components/FinalCtaSection';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { PREVIEW_GUIDES } from '../config/previewContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { SITE_URL } from '../config/site';
import { type GuideCategory } from '../config/contentTaxonomy';
import GuideCategoryBrowser from '../components/discovery/GuideCategoryBrowser';
import { formatDateValue, toMillis, type DateValue } from '../utils/dateValue';

interface GuideArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  excerpt?: string;
  createdAt?: DateValue;
  readTime?: string;
  location?: string;
}

const guidePillars = [
  {
    title: 'Prima di partire',
    text: 'Checklist, periodi migliori, budget e scelte pratiche prima di prenotare.',
  },
  {
    title: 'Durante il viaggio',
    text: 'Mappe, tempi reali, cosa salvare e come muoversi senza trasformare tutto in corsa.',
  },
  {
    title: 'Dopo la scoperta',
    text: 'Risorse, strumenti e collegamenti per continuare a organizzare meglio le prossime partenze.',
  },
];

export default function GuideWrapper() {
  return (
    <ErrorBoundary
      fallback={<div className="py-20 text-center text-red-500">Impossibile caricare le guide</div>}
    >
      <Guide />
    </ErrorBoundary>
  );
}

function Guide() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [selectedCategory, setSelectedCategory] = useState('Tutte');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['articles', 'guides-page', demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetchedGuides = await fetchArticles();

      if (demoSettings.showEditorialDemo) {
        const existingSlugs = new Set(fetchedGuides.map((g) => g.slug));
        const demoOnly = (PREVIEW_GUIDES as GuideArticle[]).filter(
          (preview) => !existingSlugs.has(preview.slug),
        );
        return [...(fetchedGuides as GuideArticle[]), ...demoOnly];
      }

      if (fetchedGuides.length > 0) {
        return fetchedGuides as GuideArticle[];
      }

      return PREVIEW_GUIDES as GuideArticle[];
    },
  });

  if (error) {
    throw new Error('Impossibile caricare le guide');
  }

  const usingPreview = articles.length > 0 && articles.every((guide) => PREVIEW_GUIDES.some((preview) => preview.slug === guide.slug));
  const categories = useMemo(() => {
    const cats = new Set(articles.map((guide) => guide.category).filter(Boolean));
    return ['Tutte', ...Array.from(cats)];
  }, [articles]);

  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return articles
      .filter((guide) => selectedCategory === 'Tutte' || guide.category === selectedCategory)
      .filter((guide) => {
        if (!q) return true;
        return [guide.title, guide.excerpt, guide.location, guide.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      })
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  }, [articles, selectedCategory, searchQuery]);

  const handleCategorySelect = useCallback((cat: GuideCategory | null) => {
    setSelectedCategory(cat ?? 'Tutte');
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<GuideCategory, number>> = {};
    for (const article of articles) {
      if (article.category) {
        const cat = article.category as GuideCategory;
        counts[cat] = (counts[cat] ?? 0) + 1;
      }
    }
    return counts;
  }, [articles]);

  return (
    <PageLayout>
      <SEO
        title="Guide pratiche di viaggio"
        description="Guide Travelliniwithus per scegliere meglio dove andare, cosa salvare e come organizzare viaggi utili, belli e credibili."
        canonical={`${SITE_URL}/guide`}
        noindex={usingPreview}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Guide pratiche di viaggio - Travelliniwithus',
          description:
            'Guide editoriali e checklist pratiche per organizzare viaggi, weekend e destinazioni con più criterio.',
          url: `${SITE_URL}/guide`,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Guide', item: `${SITE_URL}/guide` },
            ],
          },
        }}
      />

      <Section className="pt-8" spacing="tight">
        <Breadcrumbs items={[{ label: 'Guide' }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Biblioteca pratica
            </span>
            <h1 className="text-display-1">
              Guide per partire <span className="italic text-black/55">con più criterio</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">
              Non solo ispirazione: qui raccogliamo metodi, checklist e itinerari pensati per
              capire se un posto fa per te, quando andarci e come organizzarlo senza rumore.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="text-[var(--color-accent)]" size={22} />
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-black/45">
                Come leggerle
              </p>
            </div>
            <div className="grid gap-5">
              {guidePillars.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={18} />
                  <div>
                    <p className="font-serif text-lg">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/58">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="tight">
      {/* ─── CATEGORY BROWSER ─── */}
      <div className="mb-2">
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-black/45">
          Scegli un argomento
        </h2>
        <GuideCategoryBrowser
          selectedCategory={selectedCategory === 'Tutte' ? null : selectedCategory as GuideCategory}
          onSelect={handleCategorySelect}
          counts={categoryCounts}
        />
      </div>

        {usingPreview && (
          <DemoContentNotice
            className="mt-12"
            message="Le guide mostrate sono preview controllate: servono a vedere ritmo, formato e qualità finale. Prima del deploy pubblico vanno approvate, completate o sostituite con contenuti reali."
          />
        )}

        <div className="mt-14 rounded-[2rem] border border-black/5 bg-white/75 p-4 shadow-sm backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
              <Filter size={18} className="shrink-0 text-black/35" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    selectedCategory === category
                      ? 'bg-[var(--color-ink)] text-white'
                      : 'bg-white text-black/50 hover:bg-[var(--color-sand)] hover:text-black/75'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cerca per tema o luogo..."
                className="w-full rounded-full border border-black/5 bg-white py-3 pl-10 pr-4 text-sm text-[var(--color-ink)] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-sm text-black/50 md:flex-row md:items-center md:justify-between">
          <p>
            {filteredGuides.length}{' '}
            {filteredGuides.length === 1 ? 'guida disponibile' : 'guide disponibili'}
            {selectedCategory !== 'Tutte' ? ` in ${selectedCategory}` : ''}.
          </p>
          <p>Ordinate per contenuto più recente o prioritario.</p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-12 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              Nessuna guida trovata
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-black/62">
              Prova a cambiare filtro o ricerca. Se il catalogo reale è ancora vuoto, puoi attivare
              le preview editoriali dal pannello admin per vedere la struttura finale.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {filteredGuides.map((guide, index) => {
              const isFeatured = index === 0;
              const path = `/articolo/${guide.slug || guide.id}`;

              return (
                <motion.article
                  key={guide.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.06, 0.24) }}
                  className={`group overflow-hidden rounded-[2.25rem] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                    isFeatured ? 'lg:col-span-8' : 'lg:col-span-4'
                  }`}
                >
                  <Link to={path} className={isFeatured ? 'grid h-full md:grid-cols-[1.1fr_0.9fr]' : 'block h-full'}>
                    <div className={`relative overflow-hidden ${isFeatured ? 'min-h-[360px]' : 'aspect-[16/11]'}`}>
                      <OptimizedImage
                        src={guide.image}
                        alt={guide.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/92 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
                          {guide.category}
                        </span>
                        {usingPreview && (
                          <span className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                            Preview
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`flex h-full flex-col p-7 ${isFeatured ? 'md:p-10' : ''}`}>
                      <div className="mb-5 flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/35">
                        <span>{formatDateValue(guide.createdAt) || 'In evidenza'}</span>
                        <span className="h-1 w-1 rounded-full bg-black/12" />
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={12} className="text-[var(--color-accent)]" />
                          {guide.readTime || '5 min'}
                        </span>
                      </div>

                      <h2 className={`${isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl'} font-serif leading-tight transition-colors group-hover:text-[var(--color-accent-text)]`}>
                        {guide.title}
                      </h2>

                      {guide.excerpt && (
                        <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-black/58">
                          {guide.excerpt}
                        </p>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[10px] font-bold uppercase tracking-[0.22em] text-black/42 transition-colors group-hover:text-[var(--color-accent-text)]">
                        Leggi la guida
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        <div className="mt-24">
          <Newsletter variant="editorial" source="guides_newsletter" />
        </div>

        <div className="mt-16">
          <FinalCtaSection intent="discovery" />
        </div>
      </Section>

      <Section className="!py-0 !pb-16">
        <Newsletter variant="sand" />
      </Section>
    </PageLayout>
  );
}
