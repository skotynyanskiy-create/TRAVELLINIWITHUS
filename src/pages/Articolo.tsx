import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock, Info, MapPin, Route, WalletCards } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchArticleBySlug, fetchArticles } from '../services/firebaseService';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import InteractiveMap from '../components/InteractiveMap';
import SEO from '../components/SEO';
import ArticlePageSkeleton from '../components/ArticlePageSkeleton';
import DemoContentNotice from '../components/DemoContentNotice';
import FinalCtaSection from '../components/FinalCtaSection';
import NotFound from './NotFound';
import { SITE_URL } from '../config/site';
import { PREVIEW_ARTICLES } from '../config/previewContent';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import {
  AffiliateBar,
  ARTICLE_DISCLOSURE_LABELS,
  ArticleHero,
  ArticleSidebar,
  AuthorBio,
  HotelRecommendations,
  MobileBottomBar,
  MobileTocOverlay,
  PinterestSaveBanner,
  RelatedArticles,
  ShopContextualCta,
  TableOfContents,
} from '../components/article';
import type { ArticleData, RelatedArticleSummary, TocItem } from '../components/article';
import { formatDateValue } from '../utils/dateValue';
import {
  getPublicArticleCollectionPath,
  getPublicArticlePath,
  getPublicSectionLabel,
  getPublicArticleSection,
} from '../utils/articleRoutes';

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
  if (category === 'Esperienze') return '/esperienze';
  if (category === 'Destinazioni') return '/destinazioni';
  return getPublicArticleCollectionPath({ category });
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
    category: article.category || 'Guide',
    type: article.type || 'guide',
    date: article.date || 'In aggiornamento',
    author: article.author || BRAND_AUTHOR,
    readTime: article.readTime || '6 min',
    location: article.location || 'Destinazione',
    period: article.period || 'Da valutare',
    budget: article.budget || 'Da definire',
    budgetBand: article.budgetBand,
    duration: article.duration,
    continent: article.continent,
    tripIntents: article.tripIntents,
    disclosureType: article.disclosureType,
    featuredPlacement: article.featuredPlacement,
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
    verifiedAt: article.verifiedAt,
    hotels: article.hotels,
    shopCta: article.shopCta,
  };
}

function buildTocItems(article: ArticleData): TocItem[] {
  return [
    { id: 'overview', label: 'Perché leggerla', show: true },
    { id: 'pratico', label: 'Cose da sapere', show: true },
    { id: 'itinerario', label: 'Itinerario', show: !!article.itinerary?.length },
    { id: 'mappa', label: 'Mappa', show: !!(article.mapUrl || article.mapMarkers?.length) },
    {
      id: 'consigli',
      label: 'Consigli pratici',
      show: !!(article.tips?.length || article.packingList?.length),
    },
    { id: 'risorse', label: 'Risorse utili', show: true },
  ];
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

function ArticleBody({ article }: { article: ArticleData }) {
  if (typeof article.content !== 'string') {
    return <>{article.content}</>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="mt-14 scroll-mt-32 text-3xl font-serif leading-tight text-[var(--color-ink)] md:text-4xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-10 text-2xl font-serif leading-tight text-[var(--color-ink)]">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mt-5 text-lg leading-relaxed text-black/70">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mt-6 space-y-3 pl-0 text-base leading-relaxed text-black/70">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="flex gap-3">
            <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={18} />
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>
        ),
      }}
    >
      {article.content}
    </ReactMarkdown>
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

  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

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
        } else if (demoSettings.showEditorialDemo && PREVIEW_ARTICLES[currentSlug]) {
          setArticle(ensureArticleData(PREVIEW_ARTICLES[currentSlug]));
          setArticleSource('preview');
          setRelatedArticles([]);
          return;
        } else {
          setArticleSource('missing');
          setArticle(null);
          setRelatedArticles([]);
          return;
        }

        const allArticles = await fetchArticles();
        const related = allArticles
          .map((item) => ({
            id: item.slug || item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            date: item.date,
            continent: item.continent,
          }))
          .filter((item) => item.id !== currentSlug)
          .slice(0, 3);

        setRelatedArticles(related);
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
  }, [currentSlug, demoSettings.showEditorialDemo]);

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
  const editorialSection = getPublicArticleSection({
    category: article.category,
    type: article.type,
  });
  const collectionLabel = getPublicSectionLabel(editorialSection);
  const returnToArchiveLabel =
    categoryPath === '/itinerari'
      ? 'Torna agli itinerari'
      : categoryPath === '/guide'
        ? 'Torna alle guide'
        : 'Torna alla sezione';
  const articleTitle = article.title;
  const articleDescription = article.description;
  const articleImage = article.image;
  const articlePath = getPublicArticlePath({
    slug: currentSlug,
    category: article.category,
    type: article.type,
  });
  const articleUrl = `${SITE_URL}${articlePath}`;
  const datePublished = toIsoDateString(article.date) || new Date().toISOString();
  const dateModified = toIsoDateString(article.updatedAt) || datePublished;
  const tocItems = buildTocItems(article);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPillar = article.type === 'pillar';
  const articleSchemaData = isPreviewArticle
    ? undefined
    : {
        headline: articleTitle,
        description: articleDescription,
        image: articleImage,
        datePublished,
        dateModified,
        authorName,
        url: articleUrl,
        articleSection: isPillar ? `Guida completa — ${article.category}` : article.category,
      };

  const articleBreadcrumbs = isPreviewArticle
    ? undefined
    : [
        { name: 'Home', url: SITE_URL },
        { name: article.category, url: `${SITE_URL}${categoryPath}` },
        { name: article.title, url: articleUrl },
      ];

  return (
    <PageLayout>
      <>
        <SEO
          title={articleTitle}
          description={articleDescription}
          canonical={articleUrl}
          image={articleImage}
          type="article"
          noindex={isPreviewArticle}
          article={articleSchemaData}
          breadcrumbs={articleBreadcrumbs}
        />
        <Helmet>
          {!isPreviewArticle && <meta property="article:published_time" content={datePublished} />}
          {!isPreviewArticle && article.updatedAt && (
            <meta property="article:modified_time" content={dateModified} />
          )}
          <meta name="author" content={authorName} />
        </Helmet>

        <motion.div
          className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-[var(--color-accent)]"
          style={{ scaleX }}
        />

        <article className="mx-4 my-8 overflow-hidden rounded-[2.5rem] border border-black/5 bg-white pb-24 shadow-xl shadow-black/5 md:mx-8 lg:mx-12">
          <div className="absolute left-8 top-8 z-50 hidden md:block">
            <Link
              to={categoryPath}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              <ArrowRight size={16} className="rotate-180" />
              Torna alla sezione
            </Link>
          </div>

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
          />

          <div className="mx-auto mt-12 max-w-6xl px-5 md:px-8">
            <Breadcrumbs
              items={[
                { label: article.category, href: categoryPath },
                { label: article.location.split(',')[0], href: '/destinazioni' },
                { label: article.title.split(':')[0] },
              ]}
            />

            {isPreviewArticle && (
              <DemoContentNotice
                className="mt-10"
                message="Questo articolo e una preview controllata: mostra struttura, tono e livello finale. Prima della pubblicazione deve essere approvato, completato con dettagli verificati o sostituito da un contenuto reale."
              />
            )}

            <div
              id="overview"
              className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
            >
              <div>
                <div className="rounded-[2rem] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 md:p-10">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                    In breve
                  </p>
                  <p className="text-2xl font-serif leading-relaxed text-[var(--color-ink)] md:text-3xl">
                    {article.description}
                  </p>
                </div>
                <TableOfContents items={tocItems} variant="mobile-inline" />
              </div>

              <ArticleSidebar
                tocItems={tocItems}
                articleUrl={articleUrl}
                articleTitle={articleTitle}
                articleDescription={articleDescription}
                articleImage={articleImage}
                onCopyLink={handleShare}
              />
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <section id="pratico" className="scroll-mt-32">
                  <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-black/5 bg-black/5 md:grid-cols-4">
                    {[
                      { icon: <MapPin size={18} />, label: 'Dove', value: article.location },
                      { icon: <Clock size={18} />, label: 'Quando', value: article.period },
                      { icon: <WalletCards size={18} />, label: 'Budget', value: article.budget },
                      {
                        icon: <Route size={18} />,
                        label: 'Durata',
                        value: article.duration || readingTime,
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-white p-6">
                        <div className="mb-4 flex items-center gap-2 text-[var(--color-accent-text)]">
                          {item.icon}
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/38">
                            {item.label}
                          </span>
                        </div>
                        <p className="font-serif text-xl leading-tight text-[var(--color-ink)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {article.tripIntents?.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[var(--color-sand)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/55"
                      >
                        {item}
                      </span>
                    ))}
                    {article.budgetBand && (
                      <span className="rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                        Budget {article.budgetBand}
                      </span>
                    )}
                    {article.verifiedAt && (
                      <span className="rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/45 ring-1 ring-black/5">
                        Verificato {formatDateValue(article.verifiedAt)}
                      </span>
                    )}
                    {article.disclosureType && (
                      <span className="rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/45 ring-1 ring-black/5">
                        {ARTICLE_DISCLOSURE_LABELS[article.disclosureType] ??
                          article.disclosureType}
                      </span>
                    )}
                  </div>
                </section>

                {article.highlights && article.highlights.length > 0 && (
                  <section className="mt-14 rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                      Perché salvarlo
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      {article.highlights.map((highlight) => (
                        <div key={highlight} className="rounded-2xl bg-[var(--color-sand)] p-5">
                          <CheckCircle2 className="mb-4 text-[var(--color-accent)]" size={20} />
                          <p className="text-sm leading-relaxed text-black/68">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="prose-reset mt-14">
                  <ArticleBody article={article} />
                </section>

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
                          className="grid gap-5 rounded-[2rem] border border-black/5 bg-[var(--color-sand)] p-6 md:grid-cols-[80px_1fr]"
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
                    <div className="overflow-hidden rounded-[2.5rem] border border-black/5 shadow-sm">
                      {article.mapMarkers && article.mapMarkers.length > 0 ? (
                        <InteractiveMap
                          markers={article.mapMarkers}
                          center={article.mapCenter || [0, 30]}
                          zoom={article.mapZoom || 1}
                          className="h-[420px] w-full"
                        />
                      ) : (
                        <iframe
                          src={article.mapUrl}
                          width="100%"
                          height="420"
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

                {article.shopCta && (
                  <ShopContextualCta
                    destinationName={article.location.split(',')[0]}
                    productType={article.shopCta.productType}
                    productUrl={article.shopCta.productUrl}
                    count={article.shopCta.count}
                  />
                )}

                {article.hotels && article.hotels.length > 0 && (
                  <HotelRecommendations
                    hotels={article.hotels}
                    destination={article.location.split(',')[0]}
                  />
                )}

                <section id="consigli" className="mt-20 grid scroll-mt-32 gap-8 md:grid-cols-2">
                  {article.tips && article.tips.length > 0 && (
                    <div className="rounded-[2rem] bg-[var(--color-sand)] p-8">
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
                    <div className="rounded-[2rem] bg-[var(--color-ink)] p-8 text-white">
                      <h2 className="mb-6 font-serif text-2xl">Cosa tenere pronto</h2>
                      <ul className="space-y-4">
                        {article.packingList.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-relaxed text-white/70"
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

                <section id="risorse" className="mt-20 scroll-mt-32">
                  <div className="rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-sm md:p-10">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
                      Risorse utili
                    </p>
                    <h2 className="text-3xl font-serif md:text-4xl">
                      Strumenti, non coupon a caso.
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/64">
                      Quando un articolo ha risorse affiliate, devono aiutare davvero la decisione:
                      assicurazione, eSIM, prenotazioni o gear entrano solo se sono coerenti con il
                      viaggio.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        to="/risorse"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
                      >
                        Vedi risorse selezionate
                        <ArrowRight size={15} />
                      </Link>
                      <Link
                        to={categoryPath}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
                      >
                        {returnToArchiveLabel}
                      </Link>
                    </div>
                  </div>
                </section>

                <div className="mt-20">
                  <Newsletter variant="article" source="article_bottom" />
                </div>

                <PinterestSaveBanner
                  articleUrl={articleUrl}
                  articleTitle={articleTitle}
                  articleDescription={articleDescription}
                  articleImage={articleImage}
                />

                <AuthorBio />

                <div className="mt-20">
                  <FinalCtaSection intent="discovery" />
                </div>

                <div className="mt-20">
                  <AffiliateBar destination={article.location.split(',')[0]} />
                </div>

                <RelatedArticles
                  relatedArticles={relatedArticles}
                  demoRelatedArticles={isPreviewArticle ? previewRelatedArticles : []}
                  fallbackHref={categoryPath}
                  fallbackLabel={`Vai a ${collectionLabel.toLowerCase()}`}
                />
              </div>

              <div className="hidden lg:block" aria-hidden="true" />
            </div>
          </div>
        </article>

        <MobileTocOverlay
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          tocItems={tocItems}
        />

        <MobileBottomBar
          article={article}
          isSaved={isSaved}
          copied={copied}
          onToggleFavorite={() => toggleFavorite(currentSlug)}
          onOpenToc={() => setIsMobileMenuOpen(true)}
          onShare={handleShare}
        />
      </>
    </PageLayout>
  );
}
