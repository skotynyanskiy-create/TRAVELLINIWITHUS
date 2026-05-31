import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../../services/firebaseService';
import OptimizedImage from '../OptimizedImage';
import ArticleSkeleton from '../ArticleSkeleton';
import Section from '../Section';
import { SITE_URL } from '../../config/site';
import { siteContentDefaults } from '../../config/siteContent';
import { DEMO_ARTICLE_PREVIEW } from '../../config/demoContent';
import { useSiteContent } from '../../hooks/useSiteContent';

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  readTime?: string;
  createdAt?: Timestamp | string | Date;
  excerpt?: string;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  experienceTypes?: string[];
}

const EDITORIAL_PREVIEWS: Article[] = [DEMO_ARTICLE_PREVIEW];

function formatDate(dateInput: Timestamp | string | Date | undefined) {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : (dateInput instanceof Timestamp ? dateInput.toDate() : dateInput as Date);
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function LatestArticles() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const { data: recentArticlesData, isLoading: loadingArticles } = useQuery<{
    articles: Article[];
    usingExamples: boolean;
  }>({
    queryKey: ['articles', 'recent', demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetched = await fetchArticles();
      const sorted = [...fetched].sort((a, b) => {
        const dateA = a.createdAt && typeof (a.createdAt as Timestamp).toMillis === 'function'
          ? (a.createdAt as Timestamp).toMillis()
          : a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt && typeof (b.createdAt as Timestamp).toMillis === 'function'
          ? (b.createdAt as Timestamp).toMillis()
          : b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return dateB - dateA;
      });

      if (sorted.length > 0) {
        return { articles: sorted.slice(0, 4) as Article[], usingExamples: false };
      }

      if (demoSettings.showEditorialDemo) {
        return { articles: EDITORIAL_PREVIEWS, usingExamples: true };
      }

      return { articles: [], usingExamples: false };
    },
  });

  const { articles = [], usingExamples = false } = recentArticlesData ?? {};

  if (!loadingArticles && articles.length === 0) return null;

  return (
    <Section>
      <div className="mb-12 flex items-end justify-between">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-[var(--color-accent)]" />
            <span className="font-script text-lg text-[var(--color-accent-warm)]">Dal blog</span>
          </div>
          <h2 className="text-display-2">
            Ultimi<br />
            <span className="italic text-black/50">articoli</span>
          </h2>
        </div>
        <Link
          to="/destinazioni"
          className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-[var(--color-accent)] md:flex"
        >
          Esplora tutti
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {usingExamples && (
        <div className="mb-6 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-5 py-4">
          <p className="text-sm font-medium text-[var(--color-accent-text)]">
            Questi sono articoli di esempio. Aggiungi i tuoi contenuti dal pannello admin.
          </p>
        </div>
      )}

      {loadingArticles ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => <ArticleSkeleton key={n} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => {
            const isFeatured = index === 0 && articles.length > 1;

            if (isFeatured) {
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group col-span-full cursor-pointer overflow-hidden rounded-[var(--radius-2xl)] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl md:col-span-2"
                >
                  <Link to={`/articolo/${article.slug || article.id}`} className="flex flex-col md:flex-row">
                    <div className="relative aspect-[4/3] overflow-hidden md:w-1/2">
                      <OptimizedImage
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute top-5 left-5">
                        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center p-8 md:w-1/2">
                      <div className="mb-5 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                        <Calendar size={12} className="text-[var(--color-accent)]" />
                        <span>{formatDate(article.createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-black/10" />
                        <Clock size={12} className="text-[var(--color-accent)]" />
                        <span>{article.readTime || '5 min'}</span>
                      </div>

                      <h3 className="mb-6 text-3xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mb-6 line-clamp-2 text-sm font-normal leading-relaxed text-black/60">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-auto">
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 transition-colors group-hover:text-[var(--color-accent)]">
                          Leggi articolo
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-xl)] border border-zinc-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Link to={`/articolo/${article.slug || article.id}`} className="block overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex flex-grow flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                    <Calendar size={11} className="text-[var(--color-accent)]" />
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="h-1 w-1 rounded-full bg-black/10" />
                    <Clock size={11} className="text-[var(--color-accent)]" />
                    <span>{article.readTime || '5 min'}</span>
                  </div>

                  <h3 className="mb-4 line-clamp-2 flex-grow text-2xl font-serif leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                    {article.title}
                  </h3>

                  <div className="mt-auto border-t border-black/5 pt-5">
                    <Link
                      to={`/articolo/${article.slug || article.id}`}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-[var(--color-accent)]"
                    >
                      Leggi articolo
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex justify-center md:hidden">
        <Link
          to="/destinazioni"
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-[var(--color-accent)]"
        >
          Esplora tutti
          <ArrowRight size={16} />
        </Link>
      </div>
    </Section>
  );
}
