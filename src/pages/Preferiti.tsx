import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ArrowRight, BookOpen } from 'lucide-react';
import { heartPulse } from '../lib/animations';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import Button from '../components/Button';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import ArticleSkeleton from '../components/ArticleSkeleton';
import { fetchArticles } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_PREVIEW } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';

interface FavoriteArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  excerpt?: string;
}

export default function Preferiti() {
  const { favorites, toggleFavorite } = useFavorites();
  const [pulseKeys, setPulseKeys] = useState<Record<string, number>>({});
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const { data: availableArticles = [], isLoading } = useQuery<FavoriteArticle[]>({
    queryKey: ['articles', 'favorites-page', demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetchedArticles = await fetchArticles();
      if (fetchedArticles.length > 0) {
        return fetchedArticles as FavoriteArticle[];
      }

      return demoSettings.showEditorialDemo ? ([DEMO_ARTICLE_PREVIEW] as FavoriteArticle[]) : [];
    },
  });

  const breadcrumbItems = [{ label: 'Preferiti' }];

  const savedArticles = useMemo(
    () => availableArticles.filter((article) => favorites.includes(article.slug)),
    [availableArticles, favorites]
  );

  const missingFavoritesCount = useMemo(() => {
    const availableSlugs = new Set(availableArticles.map((article) => article.slug));
    return favorites.filter((slug) => !availableSlugs.has(slug)).length;
  }, [availableArticles, favorites]);

  return (
    <PageLayout>
      <SEO
        title="Preferiti"
        description="Ritrova facilmente le guide e i contenuti che hai salvato su Travelliniwithus."
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mx-auto mt-8 mb-16 max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
            <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              La tua collezione
            </span>
            <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
          </div>
          <h1 className="text-display-1 mb-8">
            I tuoi <span className="italic text-black/60">preferiti</span>
          </h1>
          <p className="text-lg font-light leading-relaxed text-black/70">
            Qui ritrovi le guide e i contenuti che hai deciso di salvare, così puoi tornarci quando vuoi senza perderli
            nel flusso del sito.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : savedArticles.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] py-20 text-center shadow-sm">
            <Heart size={48} className="mx-auto mb-4 text-[var(--color-ink)]/20" />
            <span className="font-script text-2xl text-[var(--color-accent)]/50 mb-2 block">Inizia a esplorare</span>
            <h3 className="mb-4 text-2xl font-serif">
              {favorites.length === 0 ? 'Nessun contenuto salvato' : 'I tuoi preferiti non sono disponibili qui'}
            </h3>
            <p className="mx-auto mb-8 max-w-xl text-black/60">
              {favorites.length === 0
                ? 'Non hai ancora aggiunto nessun contenuto ai preferiti. Esplora le guide e salva quello che vuoi ritrovare più facilmente.'
                : 'Hai contenuti salvati, ma non risultano tra quelli pubblici disponibili in questo momento. Potrebbero essere cambiati, rimossi o non ancora presenti nel catalogo attuale.'}
            </p>
            <Button to="/destinazioni" variant="primary" size="lg">
              Esplora i contenuti
            </Button>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/destinazioni" className="text-[var(--color-accent)] hover:underline">Destinazioni</Link>
              <span className="text-[var(--color-ink)]/20">·</span>
              <Link to="/esperienze" className="text-[var(--color-accent)] hover:underline">Esperienze</Link>
              <span className="text-[var(--color-ink)]/20">·</span>
              <Link to="/guide" className="text-[var(--color-accent)] hover:underline">Guide</Link>
            </div>
          </div>
        ) : (
          <>
            {missingFavoritesCount > 0 && (
              <div className="mb-8 rounded-[1.5rem] border border-black/5 bg-[var(--color-sand)] px-6 py-5 text-sm font-normal leading-relaxed text-black/70">
                {missingFavoritesCount === 1
                  ? 'Un contenuto che avevi salvato non è disponibile nel catalogo pubblico attuale.'
                  : `${missingFavoritesCount} contenuti che avevi salvato non sono disponibili nel catalogo pubblico attuale.`}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {savedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-black/5 bg-white shadow-sm transition-all hover:shadow-[var(--shadow-premium)]"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPulseKeys((prev) => ({ ...prev, [article.slug]: (prev[article.slug] || 0) + 1 }));
                      toggleFavorite(article.slug);
                    }}
                    className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-accent)] shadow-sm transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                    aria-label={`Rimuovi ${article.title} dai preferiti`}
                  >
                    <motion.span key={pulseKeys[article.slug] || 0} variants={heartPulse} animate="beat" className="flex items-center justify-center">
                      <Heart size={18} className="fill-current" />
                    </motion.span>
                  </button>

                  <Link to={`/articolo/${article.slug}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden">
                      <OptimizedImage
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                        <BookOpen size={14} />
                        {article.category}
                      </div>
                      <h3 className="mb-4 line-clamp-2 text-xl font-serif transition-colors group-hover:text-[var(--color-accent)]">
                        {article.title}
                      </h3>
                      <p className="mb-5 line-clamp-2 text-sm font-normal leading-relaxed text-black/70">
                        {article.excerpt || 'Un contenuto salvato per ritrovarlo facilmente quando vorrai tornarci.'}
                      </p>
                      <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-black/60 transition-colors group-hover:text-black">
                        Apri contenuto <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </Section>
    </PageLayout>
  );
}
