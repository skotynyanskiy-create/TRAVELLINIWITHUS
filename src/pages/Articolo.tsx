import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock, Info, MapPin, Route, WalletCards } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { Helmet } from 'react-helmet-async';
import { fetchArticleBySlug, fetchArticles } from '../services/firebaseService';
import { useFavorites } from '../context/FavoritesContext';
import { useArticleAnalytics } from '../hooks/useArticleAnalytics';
import { useArticleReadingProgress } from '../hooks/useArticleReadingProgress';
import { trackEvent } from '../services/analytics';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import ArticlePageSkeleton from '../components/ArticlePageSkeleton';
import Skeleton from '../components/Skeleton';
import DemoContentNotice from '../components/DemoContentNotice';
import NotFound from './NotFound';
import { SITE_URL } from '../config/site';
import { PREVIEW_ARTICLES } from '../config/previewContent';
import { buildArticleJsonLd } from '../lib/seo';
import { getPlace, PLACE_CATALOG } from '../config/placeCatalog';
import {
  ArticleHero,
  ArticleSidebar,
  AuthorBio,
  Diary,
  MobileBottomBar,
  MobileTocOverlay,
  RelatedArticles,
  TableOfContents,
} from '../components/article';
import type { ArticleData, RelatedArticleSummary, TocItem } from '../components/article';

const InteractiveMap = lazy(() => import('../components/InteractiveMap'));
const ArticleMarkdownBody = lazy(() => import('../components/article/ArticleMarkdownBody'));
/* Anche ReadingMode importa react-markdown: lasciarlo statico terrebbe il chunk
   `markdown` (~46 KB gzip) nel download iniziale di /articolo, annullando il
   confine lazy qui sopra. E' una modale dietro un bottone, quindi si monta solo
   dopo la prima apertura. */
const ReadingMode = lazy(() => import('../components/article/ReadingMode'));

const BRAND_AUTHOR = 'Rodrigo & Betta';

const MONTHS_MAP: Record<string, number> = {
  gennaio: 0,
  febbraio: 1,
  marzo: 2,
  aprile: 3,
  maggio: 4,
  giugno: 5,
  luglio: 6,
  agosto: 7,
  settembre: 8,
  ottobre: 9,
  novembre: 10,
  dicembre: 11,
};

function toIsoDateString(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

    const match = trimmed.match(/^(\d{1,2})\s+([\p{L}]+)\s+(\d{4})$/u);
    if (!match) return null;

    const [, dayString, monthString, yearString] = match;
    const month = MONTHS_MAP[monthString.toLowerCase()];
    if (month === undefined) return null;

    return new Date(Number(yearString), month, Number(dayString), 8, 0, 0).toISOString();
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function getCategoryPath(category: string) {
  if (category === 'Guide' || category === 'Guida') return '/esplora?format=guida';
  if (category === 'Itinerari' || category === 'Itinerario') return '/esplora?format=itinerario';
  if (category === 'Storie' || category === 'Storia') return '/esplora?format=storia';
  return '/esplora';
}

function ensureArticleData(
  article: Partial<ArticleData> & {
    title: string;
    image: string;
    category: string;
    content: ArticleData['content'];
  }
): ArticleData {
  return {
    title: article.title,
    description: article.description || 'Guida e racconto di viaggio firmato Travelliniwithus.',
    image: article.image,
    imageAlt: article.imageAlt,
    ogImage: article.ogImage,
    category: article.category || 'Guide',
    date: article.date || 'In aggiornamento',
    author: article.author || BRAND_AUTHOR,
    readTime: article.readTime || '6 min',
    location: article.location || 'Destinazione',
    period: article.period || 'Da valutare',
    budget: article.budget || 'Da definire',
    duration: article.duration,
    continent: article.continent,
    content: article.content,
    isMarkdown: article.isMarkdown ?? typeof article.content === 'string',
    tips: article.tips,
    packingList: article.packingList,
    gallery: article.gallery,
    highlights: article.highlights,
    itinerary: article.itinerary,
    costs: article.costs,
    seasonality: article.seasonality,
    hiddenGems: article.hiddenGems,
    localFood: article.localFood,
    gear: article.gear,
    mapUrl: article.mapUrl,
    mapMarkers: article.mapMarkers,
    mapCenter: article.mapCenter,
    mapZoom: article.mapZoom,
    videoUrl: article.videoUrl,
    updatedAt: article.updatedAt,
    partnership: article.partnership,
  };
}

function buildTocItems(article: ArticleData): TocItem[] {
  return [
    { id: 'overview', label: 'Cos’è', show: true },
    { id: 'pratico', label: 'Quando?', show: true },
    { id: 'diario', label: 'Diario', show: !!article.diary?.length },
    { id: 'itinerario', label: 'Itinerario', show: !!article.itinerary?.length },
    { id: 'mappa', label: 'Mappa', show: !!(article.mapUrl || article.mapMarkers?.length) },
    {
      id: 'consigli',
      label: 'Consigli',
      show: !!(article.tips?.length || article.packingList?.length),
    },
    { id: 'risorse', label: 'Risorse', show: true },
  ];
}

/**
 * Conta parole effettive del body articolo per Article.wordCount schema.
 * Marathon FASE 1.D 2026-05-17 — entity layer per AI citation.
 */
function countWords(content: ArticleData['content']): number {
  if (typeof content !== 'string') return 0;
  const plain = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain ? plain.split(' ').length : 0;
}

/**
 * Inferisce Place entities citate nell'articolo dal Place catalog.
 *
 * Logic: cerca occorrenze case-insensitive di ogni place name nel titolo
 * + description + location + content (se markdown plain). Ritorna le entries
 * trovate. La prima diventa `about`, le altre `mentions`.
 *
 * Marathon FASE 1.D 2026-05-17. Approccio leggero (no NLP), buono per il
 * 80% dei casi dove il pillar nomina destinazioni canoniche.
 */
function inferPlaceEntities(article: ArticleData) {
  const haystack = [
    article.title,
    article.description,
    article.location,
    typeof article.content === 'string' ? article.content.slice(0, 4000) : '',
  ]
    .join(' ')
    .toLowerCase();

  const matched: Array<{ slug: string; firstIndex: number }> = [];
  for (const [slug, place] of Object.entries(PLACE_CATALOG)) {
    const idx = haystack.indexOf(place.name.toLowerCase());
    if (idx !== -1) {
      matched.push({ slug, firstIndex: idx });
    }
  }

  if (matched.length === 0) return { about: undefined, mentions: undefined };

  // Ordina per posizione: prima citazione = "about" principale
  matched.sort((a, b) => a.firstIndex - b.firstIndex);
  const about = getPlace(matched[0].slug);
  const mentions = matched
    .slice(1, 5) // max 4 mentions per evitare schema bloat
    .map(({ slug }) => getPlace(slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return { about, mentions: mentions.length > 0 ? mentions : undefined };
}

function getReadingTime(article: ArticleData) {
  if (article.readTime) return article.readTime;
  if (typeof article.content !== 'string') return '6 min';

  const plainText = article.content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  return `${Math.max(3, Math.ceil(wordCount / 200))} min`;
}

/**
 * Scheletro dimensionato per il corpo articolo mentre il chunk lazy di
 * `ArticleMarkdownBody` scarica react-markdown, remark-directive e le undici
 * direttive editoriali (~29 KB, vedi budget `article-route` in
 * `check-size.mjs`). Righe di testo, non un fallback vuoto: il corpo che
 * sparisce e rimonta e' esattamente lo spostamento di layout da evitare.
 */
function ArticleBodySkeleton() {
  return (
    <div aria-busy="true" className="space-y-4">
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
    </div>
  );
}

export function ArticleBody({ article, slug = '' }: { article: ArticleData; slug?: string }) {
  if (typeof article.content !== 'string') {
    return <>{article.content}</>;
  }

  return (
    <Suspense fallback={<ArticleBodySkeleton />}>
      <ArticleMarkdownBody content={article.content} slug={slug} title={article.title} />
    </Suspense>
  );
}

export default function Articolo() {
  const { slug } = useParams();
  const currentSlug = slug || '';
  const { isFavorite, toggleFavorite } = useFavorites();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [articleSource, setArticleSource] = useState<'preview' | 'published' | 'missing'>(
    'missing'
  );
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  /* Resta true dopo la prima apertura: smontare la modale alla chiusura
     taglierebbe l'animazione di uscita di AnimatePresence. */
  const [readingModeMounted, setReadingModeMounted] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const yHero = useTransform(scrollY, [0, 1000], prefersReducedMotion ? [0, 0] : [0, 260]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);

      try {
        if (!currentSlug) {
          setArticleSource('missing');
          setArticle(null);
          setRelatedArticles([]);
          return;
        }

        const previewArticle = PREVIEW_ARTICLES[currentSlug];
        if (previewArticle) {
          setArticle(ensureArticleData(previewArticle));
          setArticleSource('preview');
          setRelatedArticles([]);
          return;
        }

        const publicArticle = await fetchArticleBySlug(currentSlug);

        if (publicArticle) {
          setArticle(
            ensureArticleData(
              publicArticle as Partial<ArticleData> & {
                title: string;
                image: string;
                category: string;
                content: ArticleData['content'];
              }
            )
          );
          setArticleSource('published');
        } else {
          setArticleSource('missing');
          setArticle(null);
          setRelatedArticles([]);
          return;
        }

        const allArticles = await fetchArticles();
        const currentCategory = publicArticle.category;
        const currentContinent = (publicArticle as { continent?: string }).continent;
        const currentCountry = (publicArticle as { country?: string }).country;

        // Silos topical: priorita same-country > same-continent > same-category > resto.
        // Senza filtro i correlati sono random e zero compound SEO interno.
        const scored = allArticles
          .map((item) => ({
            id: item.slug || item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            date: item.date,
            continent: item.continent,
            country: item.country,
            _score:
              (item.country && item.country === currentCountry ? 100 : 0) +
              (item.continent === currentContinent ? 30 : 0) +
              (item.category === currentCategory ? 10 : 0),
          }))
          .filter((item) => item.id !== currentSlug)
          .sort((a, b) => b._score - a._score)
          .slice(0, 18)
          .map(({ _score, ...rest }) => rest);

        setRelatedArticles(scored);
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticleSource('missing');
        setArticle(null);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [currentSlug]);

  useArticleAnalytics({
    slug: currentSlug,
    category: article?.category,
    continent: article?.continent,
    title: article?.title,
    enabled: articleSource === 'published' && !loading,
  });

  const tocItems = useMemo(() => (article ? buildTocItems(article) : []), [article]);
  const { activeId: activeTocId, progress: readingProgress } = useArticleReadingProgress(tocItems);
  const activeTocLabel = tocItems.find((item) => item.id === activeTocId && item.show)?.label;

  const previewRelatedArticles = useMemo(
    () =>
      Object.entries(PREVIEW_ARTICLES)
        .filter(([previewSlug]) => previewSlug !== currentSlug)
        .map(
          ([previewSlug, previewArticle]) =>
            [previewSlug, ensureArticleData(previewArticle)] as [string, ArticleData]
        )
        .slice(0, 2),
    [currentSlug]
  );

  if (loading) {
    return (
      <PageLayout>
        <ArticlePageSkeleton />
      </PageLayout>
    );
  }

  if (articleSource === 'missing' || !article) {
    return <NotFound />;
  }

  const isPreviewArticle = articleSource === 'preview';
  const isSaved = isFavorite(currentSlug);
  const readingTime = getReadingTime(article);
  const authorName = article.author || BRAND_AUTHOR;
  const categoryPath = getCategoryPath(article.category);
  const articleTitle = article.title;
  const articleDescription = article.description;
  const articleImage = article.image;
  const articleUrl = `${SITE_URL}/articolo/${currentSlug}`;
  // Branded OG image generated at build time for preview slugs, o quella dichiarata
  // dal seed articolo (`article.ogImage`, per una card fotografica composta invece
  // della coverImage grezza); fallback sull'hero image altrimenti.
  const ogImage =
    article.ogImage || (isPreviewArticle ? `${SITE_URL}/og/${currentSlug}.jpg` : articleImage);
  const datePublished = toIsoDateString(article.date) || new Date().toISOString();
  const dateModified = toIsoDateString(article.updatedAt) || datePublished;
  const handleShare = async () => {
    const url = window.location.href;
    const channel = typeof navigator.share === 'function' ? 'native' : 'clipboard';
    trackEvent('article_share_click', { slug: currentSlug, channel });

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
      } catch {
        // Share API failed silently (e.g., cancelled by user)
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageLayout>
      <>
        <SEO
          title={articleTitle}
          description={articleDescription}
          canonical={articleUrl}
          image={ogImage}
          type="article"
          noindex={isPreviewArticle}
          jsonLd={
            isPreviewArticle
              ? undefined
              : (() => {
                  const placeEntities = inferPlaceEntities(article);
                  return buildArticleJsonLd({
                    slug: currentSlug,
                    title: articleTitle,
                    excerpt: articleDescription,
                    coverImage: articleImage,
                    gallery: article.gallery,
                    publishedAt: datePublished,
                    updatedAt: dateModified,
                    category: article.category,
                    wordCount: countWords(article.content) || undefined,
                    about: placeEntities.about,
                    mentions: placeEntities.mentions,
                  });
                })()
          }
          breadcrumbs={
            isPreviewArticle
              ? undefined
              : [
                  { name: 'Home', url: '/' },
                  { name: article.category, url: categoryPath },
                  { name: article.title, url: `/articolo/${currentSlug}` },
                ]
          }
        />
        <Helmet>
          {!isPreviewArticle && <meta property="article:published_time" content={datePublished} />}
          {/* `updatedAt` e' `unknown` (types.ts:16): puo' arrivare come Timestamp
              Firestore o come stringa. Senza `Boolean()` il ramo falso propaga
              `unknown` fra i figli di Helmet, che accetta solo ReactNode. */}
          {!isPreviewArticle && Boolean(article.updatedAt) && (
            <meta property="article:modified_time" content={dateModified} />
          )}
          <meta name="author" content={authorName} />
        </Helmet>

        <motion.div
          className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-[var(--color-accent)]"
          style={{ scaleX }}
        />

        <article className="mx-4 my-8 overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-white pb-24 shadow-xl shadow-black/5 md:mx-8 lg:mx-12">
          {categoryPath && (
            <div className="absolute left-8 top-8 z-50 hidden md:block">
              <Link
                to={categoryPath}
                className="inline-flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black/40"
              >
                <ArrowRight size={16} className="rotate-180" />
                Torna alla sezione
              </Link>
            </div>
          )}

          <ArticleHero
            article={article}
            authorName={authorName}
            readingTime={readingTime}
            categoryPath={categoryPath}
            isSaved={isSaved}
            copied={copied}
            onToggleFavorite={() => toggleFavorite(currentSlug)}
            onShare={handleShare}
            yHero={yHero}
            slug={currentSlug}
          />

          <div className="mx-auto mt-12 max-w-6xl px-5 md:px-8">
            <Breadcrumbs
              schema={false}
              items={[
                { label: article.category, href: categoryPath || undefined },
                {
                  label: article.location.split(',')[0],
                  href: `/esplora?zone=${encodeURIComponent(article.location.split(',')[0])}`,
                },
                { label: article.title.split(':')[0] },
              ]}
            />

            {isPreviewArticle && (
              <DemoContentNotice
                className="mt-10"
                title="Articolo in lavorazione"
                message="Questo articolo mostra struttura, tono e taglio editoriale. Prima della pubblicazione completa deve essere approvato con dettagli, foto e informazioni verificate."
              />
            )}

            <div
              id="overview"
              className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-12"
            >
              <div>
                <div className="border-l-2 border-[var(--color-accent)] py-2 pl-6">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                    In breve
                  </p>
                  <p className="text-xl font-serif italic leading-[1.55] text-[var(--color-ink)] md:text-2xl">
                    {article.description}
                  </p>
                </div>
                <TableOfContents
                  activeId={activeTocId}
                  items={tocItems}
                  readingProgress={readingProgress}
                  variant="mobile-inline"
                />
              </div>

              <ArticleSidebar
                activeTocId={activeTocId}
                tocItems={tocItems}
                articleUrl={articleUrl}
                articleTitle={articleTitle}
                articleDescription={articleDescription}
                articleImage={articleImage}
                onCopyLink={handleShare}
                onOpenReadingMode={() => {
                  setReadingModeMounted(true);
                  setIsReadingMode(true);
                }}
                readingProgress={readingProgress}
              />
            </div>

            <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
              <div className="min-w-0">
                <section id="pratico" className="scroll-mt-32">
                  <div className="grid grid-cols-1 overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-white md:grid-cols-4">
                    {[
                      { icon: <MapPin size={14} />, label: 'Dove', value: article.location },
                      { icon: <Clock size={14} />, label: 'Quando', value: article.period },
                      { icon: <WalletCards size={14} />, label: 'Budget', value: article.budget },
                      {
                        icon: <Route size={14} />,
                        label: 'Durata',
                        value: article.duration || readingTime,
                      },
                    ].map((item, idx, arr) => (
                      <div
                        key={item.label}
                        className={`p-6 ${
                          idx < arr.length - 1
                            ? 'border-b border-black/5 md:border-b-0 md:border-r'
                            : ''
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2 text-[var(--color-muted-fg)]">
                          {item.icon}
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                            {item.label}
                          </span>
                        </div>
                        <p className="font-serif text-xl leading-tight text-[var(--color-ink)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {article.highlights && article.highlights.length > 0 && (
                  <section className="mt-14 border-t border-black/8 pt-10">
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                      Perché salvarlo
                    </p>
                    <div className="grid gap-6 md:grid-cols-3">
                      {article.highlights.map((highlight) => (
                        <div key={highlight} className="flex gap-3">
                          <CheckCircle2
                            className="mt-1 shrink-0 text-[var(--color-accent)]"
                            size={18}
                          />
                          <p className="text-sm leading-relaxed text-black/68">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="prose-reset article-body mt-14">
                  <ArticleBody article={article} slug={currentSlug} />
                </section>

                {article.diary && article.diary.length > 0 && <Diary beats={article.diary} />}

                {article.itinerary && article.itinerary.length > 0 && (
                  <section id="itinerario" className="mt-20 scroll-mt-32">
                    <div className="mb-8 flex items-end justify-between gap-6">
                      <div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                          Ritmo suggerito
                        </p>
                        <h2 className="text-3xl font-serif md:text-4xl">Itinerario leggibile</h2>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {article.itinerary.map((step) => (
                        <div
                          key={`${step.day}-${step.title}`}
                          className="grid gap-5 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] p-6 md:grid-cols-[80px_1fr]"
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-ink)] font-serif text-2xl text-white">
                            {step.day}
                          </div>
                          <div>
                            <h3 className="font-serif text-2xl">{step.title}</h3>
                            <p className="mt-2 text-base leading-relaxed text-black/62">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(article.mapUrl || article.mapMarkers?.length) && (
                  <section id="mappa" className="mt-20 scroll-mt-32">
                    <h2 className="mb-8 text-3xl font-serif md:text-4xl">Mappa del viaggio</h2>
                    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
                      {article.mapMarkers && article.mapMarkers.length > 0 ? (
                        <Suspense
                          fallback={
                            <div className="h-[320px] w-full animate-pulse bg-[var(--color-muted-bg)] md:h-[420px]" />
                          }
                        >
                          <InteractiveMap
                            markers={article.mapMarkers}
                            center={article.mapCenter || [0, 30]}
                            zoom={article.mapZoom || 1}
                            className="h-[320px] md:h-[420px] w-full"
                            interactiveCountries={false}
                          />
                        </Suspense>
                      ) : (
                        <iframe
                          src={article.mapUrl}
                          width="100%"
                          className="h-[320px] md:h-[420px]"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Mappa del viaggio"
                        />
                      )}
                    </div>
                  </section>
                )}

                {/* La Selezione Travellini: Dove dormire, Cosa evitare, Quanto costa davvero */}
                <section className="mt-20 scroll-mt-32 border-t border-[var(--color-border)] pt-12">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                    La Selezione Travellini
                  </p>
                  <h2 className="mb-8 font-serif text-3xl md:text-4xl text-[var(--color-ink)]">
                    Analisi sul posto & Dettagli
                  </h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* 1. Dove dormire */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-xs">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]">
                          <MapPin size={16} />
                        </span>
                        <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                          Dove dormire
                        </h3>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-accent-text)] mb-2 uppercase tracking-wider text-[10px]">
                        Budget consigliato: {article.budget}
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                        {article.budget === 'Lean' &&
                          "Opzioni sotto i 100€ a notte: agriturismi a gestione familiare e boutique B&B per vivere l'autenticità locale a contatto con chi ci abita."}
                        {article.budget === 'Medio' &&
                          "Fascia 100-200€ a notte: hotel storici con carattere forte e masserie restaurate che mantengono l'anima del posto intatta."}
                        {article.budget === 'Premium' &&
                          'Sopra i 200€ a notte: dimore storiche uniche e resort di design integrati nel paesaggio, scelti esclusivamente per atmosfera e ospitalità.'}
                        {!['Lean', 'Medio', 'Premium'].includes(article.budget || '') &&
                          `Selezioniamo alloggi autentici e strutture indipendenti coerenti con l'atmosfera di questa zona.`}
                      </p>
                    </div>

                    {/* 2. Quanto costa davvero */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-xs">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success-text)]">
                          <WalletCards size={16} />
                        </span>
                        <h3 className="font-serif text-xl font-medium text-[var(--color-ink)]">
                          Quanto costa
                        </h3>
                      </div>
                      {article.costs ? (
                        <div className="space-y-2 text-sm text-[var(--color-ink-2)]">
                          <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                            <span className="text-[var(--color-muted-fg-2)]">Alloggio:</span>
                            <span className="font-medium text-[var(--color-ink)]">
                              {article.costs.alloggio}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                            <span className="text-[var(--color-muted-fg-2)]">Cibo:</span>
                            <span className="font-medium text-[var(--color-ink)]">
                              {article.costs.cibo}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                            <span className="text-[var(--color-muted-fg-2)]">Trasporti:</span>
                            <span className="font-medium text-[var(--color-ink)]">
                              {article.costs.trasporti}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--color-muted-fg-2)]">Attività:</span>
                            <span className="font-medium text-[var(--color-ink)]">
                              {article.costs.attivita}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                          Il budget stimato per questa zona è{' '}
                          <span className="font-semibold text-[var(--color-ink)]">
                            {article.budget}
                          </span>
                          . I costi locali sono mediamente in linea con una vacanza esperienziale
                          curata ed autentica.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section
                  id="consigli"
                  className="mt-20 grid scroll-mt-32 gap-10 border-t border-[var(--color-border)] pt-10 md:grid-cols-2 md:gap-12 md:pt-12"
                >
                  {article.tips && article.tips.length > 0 && (
                    <div>
                      <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl">
                        <Info size={20} className="text-[var(--color-accent)]" />
                        Consigli pratici
                      </h2>
                      <ul className="space-y-4">
                        {article.tips.map((tip) => (
                          <li
                            key={tip}
                            className="flex gap-3 text-sm leading-relaxed text-black/65"
                          >
                            <CheckCircle2
                              className="mt-1 shrink-0 text-[var(--color-accent)]"
                              size={16}
                            />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {article.packingList && article.packingList.length > 0 && (
                    <div>
                      <h2 className="mb-6 font-serif text-2xl text-[var(--color-ink)]">
                        Cosa tenere pronto
                      </h2>
                      <ul className="space-y-4">
                        {article.packingList.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-relaxed text-black/65"
                          >
                            <CheckCircle2
                              className="mt-1 shrink-0 text-[var(--color-accent)]"
                              size={16}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                <section
                  id="risorse"
                  className="mt-20 scroll-mt-32 border-t border-black/8 pt-10 md:pt-12"
                >
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                    Risorse utili
                  </p>
                  <h2 className="text-3xl font-serif md:text-4xl">Strumenti, non coupon a caso.</h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/64">
                    Quando un articolo ha risorse affiliate, devono aiutare davvero la decisione:
                    assicurazione, eSIM, prenotazioni o gear entrano solo se sono coerenti con il
                    viaggio.
                  </p>
                  <div className="mt-8 flex flex-col md:flex-row md:flex-wrap gap-3">
                    <Link
                      to="/risorse"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                    >
                      Vedi risorse selezionate
                      <ArrowRight size={15} />
                    </Link>
                    <Link
                      to="/esplora?format=guida"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
                    >
                      Torna alle guide
                    </Link>
                  </div>
                </section>

                <AuthorBio />

                <RelatedArticles
                  relatedArticles={relatedArticles}
                  demoRelatedArticles={isPreviewArticle ? previewRelatedArticles : []}
                />

                <div className="mt-20">
                  <Newsletter variant="article" source="article_bottom" />
                </div>
              </div>

              <div className="hidden xl:block" aria-hidden="true" />
            </div>
          </div>
        </article>

        <MobileTocOverlay
          activeTocId={activeTocId}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          readingProgress={readingProgress}
          tocItems={tocItems}
        />

        <MobileBottomBar
          activeLabel={activeTocLabel}
          article={article}
          isSaved={isSaved}
          copied={copied}
          onToggleFavorite={() => toggleFavorite(currentSlug)}
          onOpenToc={() => setIsMobileMenuOpen(true)}
          onShare={handleShare}
          readingProgress={readingProgress}
        />

        {readingModeMounted && (
          <Suspense fallback={null}>
            <ReadingMode
              article={article}
              authorName={authorName}
              readingTime={readingTime}
              open={isReadingMode}
              onClose={() => setIsReadingMode(false)}
            />
          </Suspense>
        )}
      </>
    </PageLayout>
  );
}
