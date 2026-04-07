import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowDownUp, ArrowRight, Calendar, Clock, Filter, Search } from 'lucide-react';
import { cardContainer, cardItem } from '../lib/animations';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
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
import { DEMO_ARTICLE_PREVIEW } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { SITE_URL } from '../config/site';
import { formatDateValue, toMillis, type DateValue } from '../utils/dateValue';

interface GuideArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  createdAt?: DateValue;
  readTime?: string;
}

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

  const {
    data: guides = [],
    isLoading,
    error,
  } = useQuery<GuideArticle[]>({
    queryKey: ['articles', 'guides-page', demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetchedGuides = await fetchArticles();
      if (fetchedGuides.length > 0) {
        return fetchedGuides as GuideArticle[];
      }

      return demoSettings.showEditorialDemo ? [DEMO_ARTICLE_PREVIEW] : [];
    },
  });

  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  if (error) {
    throw new Error('Impossibile caricare le guide');
  }

  const breadcrumbItems = [{ label: 'Guide' }];

  const categories = useMemo(() => {
    const cats = new Set(guides.map((guide) => guide.category));
    return ['Tutti', ...Array.from(cats)];
  }, [guides]);

  const filteredAndSortedGuides = useMemo(() => {
    let filtered =
      selectedCategory === 'Tutti'
        ? [...guides]
        : guides.filter((guide) => guide.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((guide) => guide.title.toLowerCase().includes(q));
    }

    filtered.sort((a, b) => {
      const dateA = toMillis(a.createdAt);
      const dateB = toMillis(b.createdAt);

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      return 0;
    });

    return filtered;
  }, [guides, selectedCategory, sortBy, searchQuery]);

  const paginatedGuides = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedGuides.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedGuides, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedGuides.length / itemsPerPage);

  return (
    <PageLayout>
      <SEO
        title="Guide di Viaggio"
        description="Guide, idee e consigli pratici per organizzare meglio i viaggi, capire se un posto merita davvero e trovare spunti utili da salvare."
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Guide di Viaggio — Travelliniwithus',
          description: 'Guide, idee e consigli pratici per organizzare meglio i viaggi.',
          url: `${SITE_URL}/guide`,
        }}
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
              <span className="font-script text-xl text-[var(--color-accent-warm)]">
                Consigli pratici
              </span>
            </div>

            <div className="relative inline-block">
              <h1 className="text-display-1">
                Tutte le <br className="md:hidden" />
                <span className="italic text-black/60">Guide</span>
              </h1>
              <motion.span
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -5, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                aria-hidden="true"
                className="absolute -right-12 -bottom-6 hidden font-script text-2xl text-[var(--color-accent)] opacity-80 sm:block md:text-3xl"
              >
                scopri di più
              </motion.span>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-4 shadow-sm md:w-auto md:flex-row md:justify-between">
            <div className="hide-scrollbar flex w-full items-center gap-4 overflow-x-auto pb-2 md:w-auto md:pb-0">
              <Filter size={18} className="shrink-0 text-black/40" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                      selectedCategory === category
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-white text-black/60 hover:bg-black/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-48">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cerca guida..."
                className="w-full rounded-full border border-black/5 bg-white py-2 pl-9 pr-4 text-sm text-zinc-700 placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="flex w-full shrink-0 items-center gap-3 md:w-auto">
              <ArrowDownUp size={18} className="text-black/40" />
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setCurrentPage(1);
                }}
                className="relative cursor-pointer appearance-none rounded-[var(--radius-xl)] border-none bg-zinc-100 py-2 px-4 pr-8 text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2318181b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px top 50%',
                  backgroundSize: '10px auto',
                }}
              >
                <option value="newest">Più recenti</option>
                <option value="oldest">Meno recenti</option>
              </select>
            </div>
          </div>
        </div>

        {!isLoading && filteredAndSortedGuides.length > 0 && (
          <div className="mb-10 flex flex-col gap-3 text-sm text-black/50 md:flex-row md:items-center md:justify-between">
            <p>
              {filteredAndSortedGuides.length}{' '}
              {filteredAndSortedGuides.length === 1 ? 'guida trovata' : 'guide trovate'}
              {selectedCategory !== 'Tutti' ? ` in ${selectedCategory}` : ''}.
            </p>
            <p>
              Pagina {currentPage} di {Math.max(totalPages, 1)}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : filteredAndSortedGuides.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm uppercase tracking-widest font-bold text-black/30 mb-2">
              Nessun risultato
            </p>
            <p className="text-base font-normal text-black/65">
              Prova a cambiare categoria o a cercare con parole diverse.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={cardContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedGuides.map((guide, index) => {
                const isFeatured = currentPage === 1 && index === 0 && paginatedGuides.length > 1;

                if (isFeatured) {
                  return (
                    <motion.div
                      key={guide.id}
                      variants={cardItem}
                      className="group col-span-full cursor-pointer overflow-hidden rounded-[var(--radius-2xl)] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <Link
                        to={`/articolo/${guide.slug || guide.id}`}
                        className="flex flex-col md:flex-row"
                      >
                        <div className="relative md:w-[60%] aspect-[16/9] overflow-hidden">
                          <OptimizedImage
                            src={guide.image}
                            alt={guide.title}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-warm)]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-6 left-6">
                            <span className="rounded-full bg-white/90 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
                              {guide.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center p-8 md:w-[40%] md:p-12">
                          <div className="mb-6 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-[var(--color-accent)]" />
                              <span>{formatDateValue(guide.createdAt) || 'Recente'}</span>
                            </div>
                            <span className="h-1 w-1 rounded-full bg-black/10"></span>
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[var(--color-accent)]" />
                              <span>{guide.readTime || '5 min'}</span>
                            </div>
                          </div>

                          <h3 className="mb-6 text-3xl md:text-4xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                            {guide.title}
                          </h3>

                          <div className="mt-auto">
                            <span className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 transition-colors group-hover:text-[var(--color-accent)] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[var(--color-accent)] after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300">
                              Leggi articolo
                              <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-2"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={guide.id}
                    variants={cardItem}
                    className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-xl)] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-zinc-200 hover:shadow-2xl"
                  >
                    <Link
                      to={`/articolo/${guide.slug || guide.id}`}
                      className="relative block aspect-[16/10] overflow-hidden"
                    >
                      <OptimizedImage
                        src={guide.image}
                        alt={guide.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-warm)]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-6 left-6">
                        <span className="rounded-full bg-white/90 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
                          {guide.category}
                        </span>
                      </div>
                    </Link>

                    <div className="flex flex-grow flex-col p-8">
                      <div className="mb-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[var(--color-accent)]" />
                          <span>{formatDateValue(guide.createdAt) || 'Recente'}</span>
                        </div>
                        <span className="h-1 w-1 rounded-full bg-black/10"></span>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-[var(--color-accent)]" />
                          <span>{guide.readTime || '5 min'}</span>
                        </div>
                      </div>

                      <Link to={`/articolo/${guide.slug || guide.id}`} className="flex-grow">
                        <h3 className="mb-6 line-clamp-2 text-2xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                          {guide.title}
                        </h3>
                      </Link>

                      <div className="mt-auto border-t border-black/5 pt-6">
                        <Link
                          to={`/articolo/${guide.slug || guide.id}`}
                          className="group/btn relative inline-flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-[var(--color-accent)] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[var(--color-accent)] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                        >
                          <span>Leggi articolo</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover/btn:translate-x-2"
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <div className="mt-24">
          <Newsletter variant="sand" />
        </div>
      </Section>
    </PageLayout>
  );
}
