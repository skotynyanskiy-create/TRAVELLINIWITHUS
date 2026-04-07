import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { MapPin, Calendar, DollarSign, Info, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchArticleBySlug, fetchArticles } from '../services/firebaseService';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import AffiliateWidget from '../components/AffiliateWidget';
import Newsletter from '../components/Newsletter';
import InlineNewsletterBanner from '../components/InlineNewsletterBanner';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import InteractiveMap from '../components/InteractiveMap';
import SEO from '../components/SEO';
import ArticlePageSkeleton from '../components/ArticlePageSkeleton';
import NotFound from './NotFound';
import { SAMPLE_ARTICLE } from '../data/seedArticle';
import { SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { DEMO_ARTICLE_SLUG } from '../config/demoContent';
import { useSiteContent } from '../hooks/useSiteContent';

import {
  ArticleHero,
  ArticleSidebar,
  AuthorBio,
  RelatedArticles,
  MobileBottomBar,
  MobileTocOverlay,
  SocialFollowCTA,
  TableOfContents,
} from '../components/article';
import type { ArticleData, RelatedArticleSummary, TocItem } from '../components/article';

const BRAND_AUTHOR = 'Travelliniwithus';

const MONTHS_MAP: Record<string, number> = {
  gennaio: 0, febbraio: 1, marzo: 2, aprile: 3, maggio: 4, giugno: 5,
  luglio: 6, agosto: 7, settembre: 8, ottobre: 9, novembre: 10, dicembre: 11,
};

function toIsoDateString(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const isoDate = new Date(trimmed);
    if (!Number.isNaN(isoDate.getTime())) return isoDate.toISOString();

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
  return '/guide';
}

const articlesData: Record<string, ArticleData> = {
  'dolomiti-rifugi-design': {
    ...SAMPLE_ARTICLE,
    date: "17 Marzo 2026",
    isMarkdown: false,
    content: (
      <>
        <div className="relative mb-16">
          <p className="text-2xl font-serif leading-relaxed text-black/80 italic border-l-4 border-[var(--color-accent)] pl-8 py-4">
            "Le Dolomiti non sono solo montagne; sono un'opera d'arte geologica. In questo viaggio abbiamo voluto unire la fatica dei sentieri alla bellezza del design d'alta quota."
          </p>
        </div>

        <h2 id="architettura" className="text-4xl font-serif mt-20 mb-10 text-black scroll-mt-32">L'Architettura che Rispetta la Roccia</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <p className="text-lg leading-relaxed text-black/70 mb-6">
              Uno dei punti forti di questo itinerario è il <strong className="text-black">Rifugio Oberholz</strong>. Situato a 2.096 metri, questa struttura è un esempio magistrale di come il legno e il vetro possano dialogare con le vette circostanti.
            </p>
            <div className="bg-[var(--color-sand)] p-8 rounded-3xl border border-black/5">
              <p className="text-sm font-light m-0 leading-relaxed italic">
                "Le sue tre grandi vetrate incorniciano i massicci del Latemar come se fossero quadri in una galleria, creando un'esperienza immersiva dove il confine tra interno ed esterno svanisce."
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <OptimizedImage
              // TODO(@travelliniwithus): PLACEHOLDER — servono foto fallback articolo
              src="https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=1200&auto=format&fit=crop"
              alt="Rifugio Oberholz"
              className="w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-2xl shadow-black/10"
            />
          </div>
        </div>

        <div className="my-24 bg-ink text-white p-12 md:p-20 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 id="percorso" className="text-4xl font-serif mb-8 text-white scroll-mt-32">Il Percorso: Oltre le Tre Cime</h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl leading-relaxed">
              Mentre tutti si affollano alle Tre Cime di Lavaredo, noi vi suggeriamo di esplorare il <span className="text-accent font-medium">Gruppo del Catinaccio</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { num: '01', label: 'Partenza', text: 'Vigo di Fassa, funivia Catinaccio' },
                { num: '02', label: 'Trekking', text: 'Verso il Rifugio Re Alberto I' },
                { num: '03', label: 'Traguardo', text: 'Vista sulle Torri del Vajolet' },
              ].map((step) => (
                <div key={step.num} className="p-6 bg-[#1C1C1C] rounded-2xl border border-white/8">
                  <div className="text-accent font-bold text-3xl mb-2">{step.num}</div>
                  <div className="text-sm uppercase tracking-widest font-bold mb-2">{step.label}</div>
                  <p className="text-xs text-white/50 m-0">{step.text}</p>
                </div>
              ))}
            </div>

            <p className="text-lg italic text-white/60 border-l-2 border-white/20 pl-6">
              "La vista sulle Torri del Vajolet è qualcosa che rimarrà impressa nella vostra memoria per sempre."
            </p>
          </div>
        </div>

        <h2 id="perche-rifugi" className="text-4xl font-serif mt-20 mb-10 text-black scroll-mt-32 text-center">Perché scegliere i rifugi di design?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <Clock size={24} />, title: 'Esperienza Sensoriale', text: 'Il profumo del cirmolo e la luce naturale che inonda gli spazi.' },
            { icon: <DollarSign size={24} />, title: 'Cucina Gourmet', text: 'Piatti raffinati d\'alta quota che elevano il concetto di rifugio.' },
            { icon: <MapPin size={24} />, title: 'Design & Natura', text: 'Un\'estetica che non invade ma celebra il paesaggio circostante.' },
          ].map((item) => (
            <div key={item.title} className="text-center group">
              <div className="w-16 h-16 bg-[var(--color-sand)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h4 className="font-serif text-xl mb-4">{item.title}</h4>
              <p className="text-sm text-black/60 font-light leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </>
    )
  }
};

function buildTocItems(article: ArticleData): TocItem[] {
  return [
    { id: 'highlights', label: 'Highlights', show: !!(article.highlights && article.highlights.length > 0) },
    { id: 'itinerario', label: 'Itinerario', show: !!(article.itinerary && article.itinerary.length > 0) },
    { id: 'sapori-locali', label: 'Sapori Locali', show: !!(article.localFood && article.localFood.length > 0) },
    { id: 'mappa', label: 'Mappa', show: !!(article.mapUrl || (article.mapMarkers && article.mapMarkers.length > 0)) },
    { id: 'budget', label: 'Budget Indicativo', show: !!article.costs },
    { id: 'tips-packing', label: 'Tips & Packing', show: !!((article.tips && article.tips.length > 0) || (article.packingList && article.packingList.length > 0)) },
    { id: 'gallery', label: 'Gallery', show: !!(article.gallery && article.gallery.length > 0) },
    { id: 'dove-dormire', label: 'Dove Dormire', show: true },
    { id: 'consigli', label: 'Consigli Reali', show: true },
  ];
}

export default function Articolo() {
  const { slug } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [dynamicArticle, setDynamicArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticleSummary[]>([]);
  const [articleSource, setArticleSource] = useState<'demo' | 'published' | 'missing'>('demo');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSlug = slug || '';

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        let currentArticle: ArticleData | null = null;

        if (!currentSlug) {
          setArticleSource('missing');
          setDynamicArticle(null);
          setRelatedArticles([]);
          return;
        }

        if (demoSettings.showEditorialDemo && currentSlug === DEMO_ARTICLE_SLUG && articlesData[currentSlug]) {
          currentArticle = articlesData[currentSlug];
          setArticleSource('demo');
          setDynamicArticle(currentArticle);
        } else {
          const publicArticle = await fetchArticleBySlug(currentSlug);

          if (publicArticle) {
            currentArticle = publicArticle as ArticleData;
            setArticleSource('published');
            setDynamicArticle(currentArticle);
          } else {
            setArticleSource('missing');
            setDynamicArticle(null);
            setRelatedArticles([]);
            return;
          }
        }

        if (currentArticle) {
          try {
            const allArticles = await fetchArticles();
            const currentContinent = typeof currentArticle.continent === 'string' ? currentArticle.continent : undefined;
            const related = allArticles
              .map((article) => ({
                id: article.slug || article.id,
                title: article.title,
                image: article.image,
                category: article.category,
                date: article.date,
                continent: article.continent,
              }) satisfies RelatedArticleSummary)
              .filter((article) => article.id !== currentSlug && (article.category === currentArticle.category || article.continent === currentContinent))
              .slice(0, 3);
            setRelatedArticles(related);
          } catch (e) {
            console.error("Error fetching related articles", e);
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticleSource('missing');
        setDynamicArticle(null);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [currentSlug, demoSettings.showEditorialDemo]);

  const article =
    dynamicArticle || (demoSettings.showEditorialDemo ? articlesData[DEMO_ARTICLE_SLUG] : null);
  const isSaved = isFavorite(currentSlug);
  const isDemoArticle = articleSource === 'demo';
  const demoRelatedArticles = isDemoArticle
    ? Object.entries(articlesData).filter(([slugKey]) => slugKey === DEMO_ARTICLE_SLUG && slugKey !== currentSlug).slice(0, 2)
    : [];

  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const yHero = useTransform(scrollY, [0, 1000], prefersReducedMotion ? [0, 0] : [0, 350]);

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

  const readingTime = article.readTime || (() => {
    if (typeof article.content !== 'string') return '5 min';
    const plainText = article.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText ? plainText.split(' ').length : 0;
    const minutes = Math.max(3, Math.ceil(wordCount / 200));
    return `${minutes} min`;
  })();

  const authorName = isDemoArticle ? BRAND_AUTHOR : article.author || BRAND_AUTHOR;
  const categoryPath = getCategoryPath(article.category);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const articleTitle = article.title;
  const articleDescription = article.description;
  const articleImage = article.image;
  const articleUrl = `${SITE_URL}/articolo/${currentSlug}`;
  const datePublished = toIsoDateString(article.date) || new Date().toISOString();
  const dateModified = toIsoDateString(article.updatedAt) || datePublished;

  const structuredDataArray: Record<string, unknown>[] = [];

  if (!isDemoArticle) {
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": articleTitle,
      "image": [articleImage],
      "datePublished": datePublished,
      "dateModified": dateModified,
      "author": [{ "@type": "Person", "name": authorName, "url": `${SITE_URL}/chi-siamo` }],
      "publisher": { "@type": "Organization", "name": "Travelliniwithus", "url": SITE_URL }
    });
  }

  if (!isDemoArticle && article.category === 'Guide' && article.itinerary && article.itinerary.length > 0) {
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `Come visitare ${article.location}`,
      "description": article.description,
      "image": article.image,
      "step": article.itinerary.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": step.description
      }))
    });
  } else if (!isDemoArticle && article.category === 'Guide' && article.tips && article.tips.length > 0) {
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.tips.map((tip) => ({
        "@type": "Question",
        "name": `Consiglio utile per ${article.location}`,
        "acceptedAnswer": { "@type": "Answer", "text": tip }
      }))
    });
  }

  const breadcrumbItems = [
    { label: article.category, href: categoryPath },
    { label: article.location.split(',')[0], href: '/destinazioni' },
    { label: article.title.split(':')[0] }
  ];

  const tocItems = buildTocItems(article);

  return (
    <PageLayout>
      <>
        <SEO
          title={articleTitle}
          description={articleDescription}
          canonical={articleUrl}
          image={articleImage}
          type="article"
          noindex={isDemoArticle}
        />
        <Helmet>
          {!isDemoArticle && <meta property="article:published_time" content={datePublished} />}
          {!isDemoArticle && article.updatedAt && <meta property="article:modified_time" content={dateModified} />}
          {!isDemoArticle && <meta property="article:author" content={article.author || "Travelliniwithus"} />}
          <meta name="author" content={authorName} />
          {structuredDataArray.map((data, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(data)}
            </script>
          ))}
        </Helmet>

        {/* Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[60]"
          style={{ scaleX }}
        />

        <article className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-black/5 mx-4 md:mx-8 lg:mx-12 my-8 pb-24">
          {/* Navigation Header */}
          <div className="absolute top-8 left-8 z-50 hidden md:block">
            <Link to={categoryPath} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
              <ArrowRight size={16} className="rotate-180" />
              Torna ai Racconti
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

          {/* Article Content */}
          <div className="max-w-4xl mx-auto px-4 md:px-6 mt-12">
            <Breadcrumbs items={breadcrumbItems} />

            {/* Key Takeaways / Summary */}
            {article.description && (
              <div className="mt-12 mb-16 p-8 md:p-12 bg-zinc-50/80 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-accent)]/10 shadow-lg shadow-[var(--color-accent)]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <h3 className="text-xl md:text-2xl font-serif mb-4 relative z-10 font-medium text-accent">In Breve</h3>
                <p className="text-lg md:text-xl font-light text-zinc-700 leading-relaxed relative z-10 italic">
                  "{article.description}"
                </p>
              </div>
            )}

            {/* Affiliate Disclaimer */}
            <div className="mt-4 mb-8 text-[10px] uppercase tracking-widest text-black/40 italic">
              * Questo articolo contiene link di affiliazione. Se acquisti tramite questi link, potremmo ricevere una piccola commissione senza alcun costo aggiuntivo per te. Consigliamo solo cio che amiamo veramente.
            </div>

            {/* Travel Essentials Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black/5 rounded-[2.5rem] overflow-hidden border border-black/5 mb-20 shadow-sm">
                {[
                  { icon: <MapPin className="text-accent" size={20} />, label: 'Destinazione', value: article.location },
                  { icon: <Calendar className="text-accent" size={20} />, label: 'Periodo Migliore', value: article.period },
                  { icon: <DollarSign className="text-accent" size={20} />, label: 'Budget Stimato', value: article.budget },
                  { icon: <Clock className="text-accent" size={20} />, label: 'Durata Consigliata', value: article.duration || readingTime + ' di lettura' },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-8 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-sand)] flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-1">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Content Body with Sticky Sidebar */}
            <div className="flex flex-col lg:flex-row gap-16 relative">

              {/* Main Content */}
              <div className="lg:w-2/3 prose prose-lg prose-headings:font-serif prose-headings:font-normal prose-a:text-accent max-w-none text-black/80 font-light leading-relaxed markdown-body">

                {/* Mobile Table of Contents */}
                <TableOfContents items={tocItems} variant="mobile-inline" />

                {/* Highlights Section */}
                {article.highlights && article.highlights.length > 0 && (
                  <div id="highlights" className="mb-16 p-10 bg-[var(--color-sand)] rounded-[2.5rem] border border-black/5 scroll-mt-32">
                    <h2 className="text-3xl font-serif mb-8 mt-0">Highlights del Viaggio</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {article.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shrink-0 mt-1 text-[10px] font-bold">
                            {i + 1}
                          </div>
                          <p className="m-0 text-base font-medium text-black/70">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {article.isMarkdown ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content as string}
                  </ReactMarkdown>
                ) : (
                  article.content
                )}

                <InlineNewsletterBanner source="article_inline" />

                {/* Itinerary Section */}
                {article.itinerary && article.itinerary.length > 0 && (
                  <div id="itinerario" className="my-20 scroll-mt-32">
                    <h2 className="text-3xl font-serif mb-10">L'Itinerario Giorno per Giorno</h2>
                    <div className="space-y-12">
                      {article.itinerary.map((step, i) => (
                        <div key={i} className="relative pl-12 border-l border-black/10 pb-12 last:pb-0 last:border-0">
                          <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[var(--color-accent)] flex items-center justify-center z-10">
                            <div className="w-2 h-2 rounded-full bg-accent"></div>
                          </div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2">Giorno {step.day}</div>
                          <h3 className="text-2xl font-serif mb-4 mt-0">{step.title}</h3>
                          <p className="text-black/60 font-light m-0">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video TikTok / Reel embed */}
                {article.videoUrl && (
                  <div className="my-16">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px flex-1 bg-black/10"></div>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 flex items-center gap-2">
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" className="text-black/40"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z"/></svg>
                        Il nostro video su questo posto
                      </span>
                      <div className="h-px flex-1 bg-black/10"></div>
                    </div>
                    <div className="flex justify-center">
                      {article.videoUrl.includes('tiktok.com') ? (
                        <blockquote
                          className="tiktok-embed rounded-3xl overflow-hidden max-w-sm w-full"
                          cite={article.videoUrl}
                          data-video-id={article.videoUrl.split('/video/')[1]?.split('?')[0]}
                        >
                          <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center h-48 bg-black/5 rounded-3xl text-sm text-black/40 gap-3 hover:bg-black/10 transition-colors">
                            <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z"/></svg>
                            Guarda il video su TikTok
                          </a>
                        </blockquote>
                      ) : (
                        <div className="w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-lg">
                          <iframe
                            src={article.videoUrl}
                            width="100%"
                            height="100%"
                            allowFullScreen
                            loading="lazy"
                            title="Video del viaggio"
                            className="border-0"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Gallery Section */}
                {article.gallery && article.gallery.length > 0 && (
                  <div id="gallery" className="my-16 scroll-mt-32">
                    <h2 className="text-3xl font-serif mb-8">Momenti dal Viaggio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {article.gallery.map((img, i) => (
                        <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
                          <OptimizedImage src={img} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hidden Gems Section */}
                {article.hiddenGems && article.hiddenGems.length > 0 && (
                  <div className="my-20">
                    <h2 className="text-3xl font-serif mb-8">Hidden Gems <span className="text-sm font-sans font-normal text-black/40 ml-2 italic">Oltre i soliti percorsi</span></h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {article.hiddenGems.map((gem, i) => (
                        <div key={i} className="p-8 bg-[var(--color-sand)] rounded-[2.5rem] border border-black/5 hover:shadow-lg transition-all">
                          <h3 className="text-xl font-serif mb-4 mt-0">{gem.title}</h3>
                          <p className="text-sm text-black/60 font-light m-0 leading-relaxed">{gem.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Local Food Section */}
                {article.localFood && article.localFood.length > 0 && (
                  <div id="sapori-locali" className="my-20 scroll-mt-32">
                    <h2 className="text-3xl font-serif mb-8">Sapori Locali <span className="text-sm font-sans font-normal text-black/40 ml-2 italic">Cosa assaggiare assolutamente</span></h2>
                    <div className="grid grid-cols-1 gap-6">
                      {article.localFood.map((food, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-black/5 rounded-3xl hover:shadow-md transition-all">
                          {food.image && (
                            <div className="sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden">
                              <OptimizedImage src={food.image} alt={food.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-serif mb-2 mt-0">{food.name}</h3>
                            <p className="text-sm text-black/60 font-light m-0 leading-relaxed">{food.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map Section */}
                {(article.mapUrl || (article.mapMarkers && article.mapMarkers.length > 0)) && (
                  <div id="mappa" className="my-20 scroll-mt-32">
                    <h2 className="text-3xl font-serif mb-8">Mappa del Viaggio</h2>
                    <div className="w-full rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm transition-all">
                      {article.mapMarkers && article.mapMarkers.length > 0 ? (
                        <InteractiveMap
                          markers={article.mapMarkers}
                          center={article.mapCenter || [0, 30]}
                          zoom={article.mapZoom || 1}
                          className="w-full h-[450px]"
                        />
                      ) : (
                        <div className="w-full h-[450px] grayscale-[0.2] hover:grayscale-0 transition-all">
                          <iframe
                            src={article.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mappa del viaggio"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Budget Breakdown */}
                {article.costs && (
                  <div id="budget" className="my-20 p-10 bg-ink text-white rounded-[2.5rem] scroll-mt-32">
                    <h2 className="text-3xl font-serif mb-2 mt-0 text-white">Quanto abbiamo speso</h2>
                    <p className="text-white/50 text-sm font-light mb-8">Budget indicativo per 2 persone, basato sulla nostra esperienza reale.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                      {Object.entries(article.costs).map(([key, value]) => {
                        const labelMap: Record<string, string> = {
                          alloggio: 'Alloggio', cibo: 'Cibo & Food', trasporti: 'Trasporti',
                          attivita: 'Attività', voli: 'Voli', totale: 'Totale',
                        };
                        return (
                          <div key={key} className="text-center">
                            <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">{labelMap[key] ?? key}</div>
                            <div className="text-2xl font-serif text-accent">{value}</div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-8 text-xs text-white/40 font-light italic">
                      * I costi sono indicativi. Prezzi e disponibilità possono variare in base alla stagione e a quanto prenotate in anticipo.
                    </p>
                  </div>
                )}

                {/* Tips & Packing List */}
                <div id="tips-packing" className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16 scroll-mt-32">
                  {article.tips && article.tips.length > 0 && (
                    <div className="bg-[var(--color-sand)] p-8 rounded-3xl border border-black/5">
                      <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                        <Info size={20} className="text-accent" />
                        Pro Tips
                      </h3>
                      <ul className="space-y-4 list-none pl-0 m-0">
                        {article.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-light leading-relaxed m-0">
                            <CheckCircle size={16} className="text-accent mt-1 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {article.packingList && article.packingList.length > 0 && (
                    <div className="bg-ink text-white p-8 rounded-3xl">
                      <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-accent" />
                        Cosa Portare
                      </h3>
                      <div className="space-y-4">
                        {article.packingList.map((item, i) => (
                          <label key={i} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input type="checkbox" className="peer appearance-none w-5 h-5 border border-white/30 rounded-md checked:bg-accent checked:border-[var(--color-accent)] transition-all" />
                              <CheckCircle size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-sm font-light text-white/80 group-hover:text-white transition-colors peer-checked:line-through peer-checked:opacity-50">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <h2 id="dove-dormire" className="text-3xl mt-12 mb-6 text-black scroll-mt-32">Dove Dormire</h2>
                <p>
                  Noi cerchiamo sempre il miglior rapporto qualità-prezzo — non il più economico in assoluto, ma quello che vale davvero ogni euro. Il trucco è prenotare in anticipo, soprattutto per i weekend e l'estate, e puntare sulla cancellazione gratuita così puoi cambiare idea senza stress.
                </p>
                <AffiliateWidget type="booking" />

                <h2 id="consigli" className="text-3xl mt-12 mb-6 text-black scroll-mt-32">I Nostri Consigli da Coppia in Viaggio</h2>
                <p>
                  Dopo 10 anni di viaggi insieme, abbiamo imparato a distinguere ciò che è davvero utile da ciò che si porta per niente. Queste sono le cose che non mancano mai nelle nostre valigie — e che vi consigliamo sinceramente.
                </p>
                <AffiliateWidget type="insurance" />
                <AffiliateWidget type="esim" />

                <ul>
                  <li><strong>Assicurazione Viaggio:</strong> Non si parte senza, davvero. Heymondo è quella che usiamo noi — con il codice <strong>TRAVELLINIWITHUS</strong> hai il 10% di sconto.</li>
                  <li><strong>eSIM per restare connessi:</strong> Fuori dall'UE la eSIM Airalo è una svolta. Con il codice <strong>TRAVELLINI3</strong> hai credito extra al primo acquisto.</li>
                  <li><strong>Prenotare le attività:</strong> GetYourGuide è il nostro go-to per tour e ingressi — spesso hanno prezzi migliori e niente code.</li>
                </ul>
              </div>

              {/* Sticky Sidebar */}
              <ArticleSidebar
                tocItems={tocItems}
                articleUrl={articleUrl}
                articleTitle={articleTitle}
                articleDescription={articleDescription}
                articleImage={articleImage}
                onCopyLink={handleShare}
              />
            </div>

            <AuthorBio />

            <Newsletter variant="white" source="article_bottom" />

            <SocialFollowCTA />

            {/* Premium Shop Cross-Selling */}
            <div className="mt-24 p-12 bg-ink rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                  Guide Premium
                </div>
                <h3 className="text-3xl font-serif md:text-4xl mb-4 leading-tight">Parti preparato davvero.</h3>
                <p className="text-white/70 font-light text-lg">Itinerari pratici, consigli budget e guide scritte dopo averle vissute. Niente teoria — solo quello che funziona.</p>
              </div>
              <div className="relative z-10 shrink-0">
                <Link to="/shop" className="inline-flex items-center justify-center bg-accent text-ink hover:bg-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-colors shadow-lg">
                  Esplora lo Shop <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Recommended Gear */}
            {(article.gear && article.gear.length > 0) ? (
              <div className="mt-24 bg-[var(--color-sand)] rounded-3xl p-10 md:p-16 border border-black/5">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-px bg-accent"></div>
                      <span className="uppercase tracking-widest text-xs font-semibold text-accent">Travel Gear</span>
                    </div>
                    <h3 className="text-3xl font-serif">Cosa portiamo con noi</h3>
                  </div>
                  <Link to="/risorse" className="text-sm uppercase tracking-widest font-semibold text-black/60 hover:text-accent transition-colors flex items-center gap-2">
                    Vedi tutte le risorse <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {article.gear.map((item, idx) => (
                    <AffiliateWidget
                      key={idx}
                      type="gear"
                      title={item.title}
                      description={item.description}
                      link={item.link}
                      cta={item.cta || "Vedi Prodotto"}
                      image={item.image}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-24 bg-[var(--color-sand)] rounded-3xl p-10 md:p-16 border border-black/5">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-px bg-accent"></div>
                      <span className="uppercase tracking-widest text-xs font-semibold text-accent">Travel Gear</span>
                    </div>
                    <h3 className="text-3xl font-serif">Cosa portiamo con noi</h3>
                  </div>
                  <Link to="/risorse" className="text-sm uppercase tracking-widest font-semibold text-black/60 hover:text-accent transition-colors flex items-center gap-2">
                    Vedi tutte le risorse <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AffiliateWidget
                    type="gear"
                    title="Osprey Farpoint 40"
                    description="Lo zaino perfetto per i viaggi solo bagaglio a mano. Resistente e organizzato."
                    link="https://amazon.it"
                    cta="Vedi su Amazon"
                    // TODO(@travelliniwithus): PLACEHOLDER — servono foto fallback articolo
                    image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop"
                  />
                  <AffiliateWidget
                    type="gear"
                    title="Sony A7IV"
                    description="La nostra camera principale per foto e video di qualita professionale."
                    link="https://amazon.it"
                    cta="Vedi su Amazon"
                    // TODO(@travelliniwithus): PLACEHOLDER — servono foto fallback articolo
                    image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop"
                  />
                </div>
              </div>
            )}

            <RelatedArticles
              relatedArticles={relatedArticles}
              demoRelatedArticles={demoRelatedArticles}
            />
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
