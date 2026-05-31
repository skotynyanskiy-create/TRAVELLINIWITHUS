import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Map, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Timestamp } from 'firebase/firestore';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import ArticleSkeleton from '../components/ArticleSkeleton';
import Pagination from '../components/Pagination';
import Section from '../components/Section';
import OptimizedImage from '../components/OptimizedImage';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { SITE_URL } from '../config/site';

interface ItineraryArticle {
  id: string;
  title: string;
  slug: string;
  image: string;
  coverImage: string;
  category: string;
  country?: string;
  city?: string;
  location?: string;
  readTime?: string;
  experienceTypes?: string[];
  createdAt?: Timestamp;
}

export default function ItinerariWrapper() {
  return (
    <ErrorBoundary fallback={<div className="py-20 text-center text-red-500">Impossibile caricare gli itinerari</div>}>
      <Itinerari />
    </ErrorBoundary>
  );
}

function Itinerari() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const { data: allArticles = [], isLoading, error } = useQuery<ItineraryArticle[]>({
    queryKey: ['articles', 'itinerari-page', demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetched = await fetchArticles();
      return fetched as ItineraryArticle[];
    },
  });

  const itinerari = useMemo(
    () => allArticles.filter((a) => a.experienceTypes?.includes('Itinerari')),
    [allArticles]
  );

  const [selectedCountry, setSelectedCountry] = useState('Tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (error) throw new Error('Impossibile caricare gli itinerari');

  const countries = useMemo(() => {
    const set = new Set(itinerari.map((a) => a.country).filter(Boolean) as string[]);
    return ['Tutti', ...Array.from(set).sort()];
  }, [itinerari]);

  const filtered = useMemo(() => {
    let list = selectedCountry === 'Tutti' ? [...itinerari] : itinerari.filter((a) => a.country === selectedCountry);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.city?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
      const dA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const dB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return dB - dA;
    });
  }, [itinerari, selectedCountry, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const breadcrumbItems = [{ label: 'Itinerari' }];

  return (
    <PageLayout>
      <SEO
        title="Itinerari di Viaggio"
        description="Itinerari costruiti sul campo da Rodrigo & Betta: tappe reali, orari verificati e consigli pratici per Budapest, Barcellona e molte altre destinazioni."
        canonical={`${SITE_URL}/itinerari`}
      />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Itinerari di Viaggio — Travelliniwithus',
        description: 'Itinerari costruiti sul campo con tappe reali, orari verificati e consigli pratici.',
        url: `${SITE_URL}/itinerari`,
      }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F0FDFA] to-[var(--color-sand)] pb-8 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#0F766E20' }}
                >
                  <Map size={20} style={{ color: '#0F766E' }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: '#0F766E' }}>
                  Percorsi reali
                </span>
              </div>
              <h1 className="mb-4 text-5xl font-serif font-medium leading-none text-[var(--color-ink)] md:text-7xl">
                Itinerari<br />
                <span className="italic text-black/40">di viaggio</span>
              </h1>
              <p className="max-w-lg text-lg font-normal leading-relaxed text-black/65">
                Non liste da TripAdvisor. Percorsi costruiti sul campo, con tappe precise, orari reali e quello che vale davvero il tempo che costa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex shrink-0 items-center gap-3 rounded-2xl border border-black/5 bg-white px-6 py-4 shadow-sm"
            >
              <Map size={18} style={{ color: '#0F766E' }} />
              <div>
                <p className="text-2xl font-serif text-[var(--color-ink)]">{itinerari.length}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                  {itinerari.length === 1 ? 'itinerario' : 'itinerari'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section>
        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedCountry(c); setCurrentPage(1); }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  selectedCountry === c ? 'text-white' : 'bg-white text-black/60 hover:bg-black/5'
                }`}
                style={selectedCountry === c ? { backgroundColor: '#0F766E' } : {}}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cerca destinazione..."
              className="w-full rounded-full border border-black/5 bg-white py-2 pl-9 pr-4 text-sm text-zinc-700 placeholder:text-black/30 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#0F766E' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => <ArticleSkeleton key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-black/30">Nessun itinerario trovato</p>
            <p className="text-base font-normal text-black/60">
              {itinerari.length === 0
                ? 'I primi itinerari sono in arrivo — torna presto.'
                : 'Prova a cambiare filtro o cerca con parole diverse.'}
            </p>
            {itinerari.length > 0 && (
              <button
                onClick={() => { setSelectedCountry('Tutti'); setSearchQuery(''); }}
                className="mt-6 text-xs font-bold uppercase tracking-widest underline"
                style={{ color: '#0F766E' }}
              >
                Mostra tutti
              </button>
            )}
          </div>
        ) : (
          <>
            {!isLoading && (
              <p className="mb-8 text-sm text-black/40">
                {filtered.length} {filtered.length === 1 ? 'itinerario' : 'itinerari'}
                {selectedCountry !== 'Tutti' ? ` in ${selectedCountry}` : ''}
              </p>
            )}

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {paginated.map((article, index) => {
                const isFeatured = currentPage === 1 && index === 0 && paginated.length > 1;

                if (isFeatured) {
                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="group col-span-full cursor-pointer overflow-hidden rounded-[var(--radius-2xl)] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <Link to={`/articolo/${article.slug || article.id}`} className="flex flex-col md:flex-row">
                        <div className="relative aspect-[16/9] overflow-hidden md:w-[60%]">
                          <OptimizedImage
                            src={article.image || article.coverImage}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-6 left-6">
                            <span className="rounded-full bg-white/90 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md" style={{ color: '#0F766E' }}>
                              {article.country || 'Itinerario'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center p-8 md:w-[40%] md:p-12">
                          <div className="mb-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                            <Clock size={12} style={{ color: '#0F766E' }} />
                            <span>{article.readTime || '8 min'}</span>
                            {article.city && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-black/10" />
                                <span>{article.city}</span>
                              </>
                            )}
                          </div>
                          <h2 className="mb-6 text-3xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent)] md:text-4xl">
                            {article.title}
                          </h2>
                          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#0F766E' }}>
                            Leggi l'itinerario <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-xl)] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <Link to={`/articolo/${article.slug || article.id}`} className="relative block aspect-[16/10] overflow-hidden">
                      <OptimizedImage
                        src={article.image || article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-5 left-5">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md" style={{ color: '#0F766E' }}>
                          {article.country || 'Itinerario'}
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-grow flex-col p-7">
                      <div className="mb-3 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                        <Clock size={11} style={{ color: '#0F766E' }} />
                        <span>{article.readTime || '8 min'}</span>
                        {article.city && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-black/10" />
                            <span>{article.city}</span>
                          </>
                        )}
                      </div>
                      <h3 className="mb-4 line-clamp-2 flex-grow text-2xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                        {article.title}
                      </h3>
                      <div className="mt-auto border-t border-black/5 pt-5">
                        <Link
                          to={`/articolo/${article.slug || article.id}`}
                          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                          style={{ color: '#0F766E' }}
                        >
                          Leggi l'itinerario <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        <div className="mt-24">
          <Newsletter variant="sand" />
        </div>
      </Section>
    </PageLayout>
  );
}
