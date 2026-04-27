import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { siteContentDefaults } from '../config/siteContent';
import { SITE_URL } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchArticles } from '../services/firebaseService';
import {
  getPublicArticlePath,
  getPublicArticleSection,
  getPublicSectionLabel,
  type PublicArticleSection,
} from '../utils/articleRoutes';

const PAGE_URL = `${SITE_URL}/diario`;

type Tab = 'all' | PublicArticleSection;

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Tutti' },
  { id: 'guide', label: 'Guide' },
  { id: 'itinerari', label: 'Itinerari' },
  { id: 'reportage', label: 'Reportage' },
];

function toMillis(value: unknown): number {
  if (!value) return 0;
  if (typeof value === 'string') {
    const t = Date.parse(value);
    return Number.isNaN(t) ? 0 : t;
  }
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    try {
      return (value as { toDate: () => Date }).toDate().getTime();
    } catch {
      return 0;
    }
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return (value as { seconds: number }).seconds * 1000;
  }
  return 0;
}

function formatDate(value: unknown): string {
  const ms = toMillis(value);
  if (!ms) return '';
  return new Date(ms).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DiarioPage() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const tabFromUrl = searchParams.get('tab') as Tab | null;
  const activeTab: Tab = tabFromUrl && TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl : 'all';

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['diario-archive', demoSettings.showEditorialDemo],
    queryFn: fetchArticles,
  });

  const sectionCounts = useMemo(() => {
    const counts: Record<PublicArticleSection | 'all', number> = {
      all: articles.length,
      guide: 0,
      itinerari: 0,
      reportage: 0,
    };
    for (const article of articles) {
      const section = getPublicArticleSection(article);
      counts[section] = (counts[section] ?? 0) + 1;
    }
    return counts;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles
      .filter((article) => {
        if (activeTab === 'all') return true;
        return getPublicArticleSection(article) === activeTab;
      })
      .filter((article) => {
        if (!q) return true;
        return [article.title, article.excerpt, article.location, article.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      })
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  }, [articles, activeTab, searchQuery]);

  const handleTabChange = (next: Tab) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', next);
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <PageLayout>
      <SEO
        title="Diario — guide, itinerari e reportage di viaggio"
        description="Il feed editoriale unificato di Travelliniwithus: guide pratiche, itinerari e reportage in ordine cronologico, filtrabili per sezione."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Diario', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs items={[{ label: 'Diario' }]} />

          <div className="mt-8 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Archivio editoriale
            </p>
            <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
              Diario di viaggio,{' '}
              <span className="italic text-black/55">in ordine di pubblicazione</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
              Tutto quello che scriviamo, raccolto in un unico flusso. Dalle guide pratiche agli
              itinerari completi, fino ai reportage piu personali. Filtra per sezione o cerca per
              luogo, mood, stagione.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {TABS.map((tab) => {
              const count = sectionCounts[tab.id] ?? 0;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'border-ink bg-ink text-white'
                      : 'border-black/10 bg-white text-black/70 hover:border-accent hover:text-accent-text'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-black/50'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 max-w-md">
            <label className="relative block">
              <span className="sr-only">Cerca nel diario</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca per luogo, tema o categoria..."
                className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-black/40 focus:border-accent focus:outline-none"
              />
            </label>
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="wide">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-4/5 animate-pulse rounded-4xl border border-black/5 bg-white"
              />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-4xl border border-black/5 bg-sand p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-text">
              Nessun risultato
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/70">
              {searchQuery.trim()
                ? `Nessun articolo trovato per "${searchQuery.trim()}". Prova un altro termine o cambia sezione.`
                : 'Questa sezione non ha ancora contenuti pubblicati. Sta arrivando.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, idx) => {
              const path = getPublicArticlePath({
                slug: article.slug,
                category: article.category,
                type: article.type,
              });
              const section = getPublicArticleSection(article);
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  <Link to={path} className="group block">
                    <div className="relative mb-6 aspect-4/5 overflow-hidden rounded-4xl">
                      <OptimizedImage
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur-md">
                          {getPublicSectionLabel(section)}
                        </span>
                        {article.category && (
                          <span className="rounded-full bg-ink/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            {article.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                      <Calendar size={12} className="text-accent" />
                      <span>{formatDate(article.createdAt) || 'In evidenza'}</span>
                      {article.location && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-black/15" />
                          <span className="truncate">{article.location.split(',')[0]}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl font-serif leading-tight text-ink transition-colors group-hover:text-accent-text">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/65">
                        {article.excerpt}
                      </p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-accent-text">
                      Continua a leggere
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </Section>

      <Section spacing="default" maxWidth="default">
        <div className="rounded-4xl border border-black/5 bg-ink p-10 text-white md:p-14">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Newsletter
              </p>
              <h2 className="mt-4 text-3xl font-serif leading-tight md:text-4xl">
                Una email ogni tanto.{' '}
                <span className="italic text-white/60">Solo quando c'e qualcosa da salvare.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/70">
                Niente rumore. Solo i nuovi pezzi del diario, gli itinerari testati e i posti che
                rifaremmo davvero.
              </p>
            </div>
            <Newsletter variant="article" source="diario_newsletter" />
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
