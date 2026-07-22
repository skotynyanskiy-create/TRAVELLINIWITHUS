import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock, Info, MapPin, Route, WalletCards } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkUnwrapImages from 'remark-unwrap-images';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
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
import DemoContentNotice from '../components/DemoContentNotice';
import NotFound from './NotFound';
import ReviewBlock from '../components/ReviewBlock';
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
  ReadingMode,
  RelatedArticles,
  TableOfContents,
} from '../components/article';
import type { ArticleData, RelatedArticleSummary, TocItem } from '../components/article';
import DropCap from '../components/article/editorial/DropCap';
import FullBleedFigure from '../components/article/editorial/FullBleedFigure';
import InlineFigure from '../components/article/editorial/InlineFigure';
import PullQuote from '../components/article/editorial/PullQuote';
import SourceBlock from '../components/article/editorial/SourceBlock';
import VerifiedBox from '../components/article/editorial/VerifiedBox';

const InteractiveMap = lazy(() => import('../components/InteractiveMap'));

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
    review: article.review,
    partnership: article.partnership,
  };
}

function buildTocItems(article: ArticleData): TocItem[] {
  return [
    { id: 'overview', label: 'Vale davvero?', show: true },
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
 * Editorial primitives (handoff editorial-primitives-v1 — 2026-05-18).
 *
 * remark-directive supporta sintassi ::: name {attrs} ... :::. Convertiamo
 * i nodi container directive (`pullquote`, `fullbleed`, `source`) in tag
 * HAST custom (`pullquote-directive` etc.) cosi react-markdown li mappa
 * sui componenti React via la prop `components`.
 *
 * Per `pullquote` estraiamo l'eventuale attribuzione finale (paragrafo che
 * inizia con em-dash / en-dash / doppio hyphen) e la passiamo come prop,
 * rimuovendola dal body. Per `fullbleed` estraiamo src/alt/title della
 * prima image e li passiamo come prop, scartando i children.
 */

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string | null | undefined>;
  children?: Array<{
    type: string;
    value?: string;
    url?: string;
    alt?: string;
    title?: string | null;
    children?: DirectiveNode['children'];
  }>;
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

function getNodeText(node: NonNullable<DirectiveNode['children']>[number]): string {
  if (typeof node.value === 'string') return node.value;
  if (!node.children) return '';
  return node.children.map(getNodeText).join('');
}

const ATTRIBUTION_PREFIX = /^\s*[—–-]{1,2}\s*/u; /* em-dash, en-dash, hyphen(s) */

function markParagraphsBare(children: NonNullable<DirectiveNode['children']>) {
  for (const child of children) {
    if (child.type === 'paragraph') {
      const childNode = child as DirectiveNode;
      const data = childNode.data || (childNode.data = {});
      data.hName = 'directive-p';
    }
  }
}

function remarkEditorialDirectives() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const directive = node as DirectiveNode;
      if (directive.type !== 'containerDirective') return;
      const name = directive.name;
      if (name !== 'pullquote' && name !== 'fullbleed' && name !== 'source' && name !== 'verified')
        return;

      const data = directive.data || (directive.data = {});
      const props: Record<string, unknown> = {};

      if (name === 'pullquote') {
        const children = directive.children || [];
        const last = children[children.length - 1];
        if (last && last.type === 'paragraph') {
          /* Caso A: ultima riga e' un paragrafo dedicato all'attribuzione
             (autore ha inserito linea vuota prima del trattino). */
          const text = getNodeText(last);
          if (ATTRIBUTION_PREFIX.test(text)) {
            props['data-attribution'] = text.replace(ATTRIBUTION_PREFIX, '').trim();
            children.pop();
          } else if (last.children && last.children.length >= 2) {
            /* Caso B: attribuzione e' nello stesso paragrafo del corpo, separata
               da soft-break / line-break. Trova l'ultimo break e, se il testo
               che lo segue inizia con trattino, estrai. */
            const inner = last.children;
            let breakIdx = -1;
            for (let i = inner.length - 1; i >= 0; i--) {
              const t = inner[i].type;
              if (t === 'break' || t === 'thematicBreak') {
                breakIdx = i;
                break;
              }
            }
            if (breakIdx !== -1 && breakIdx < inner.length - 1) {
              const tailNodes = inner.slice(breakIdx + 1);
              const tailText = tailNodes.map((c) => getNodeText(c)).join('');
              if (ATTRIBUTION_PREFIX.test(tailText)) {
                props['data-attribution'] = tailText.replace(ATTRIBUTION_PREFIX, '').trim();
                last.children = inner.slice(0, breakIdx);
              }
            }
          }
        }
        markParagraphsBare(children);
        data.hName = 'pullquote-directive';
      } else if (name === 'fullbleed') {
        const imageNode = findFirstImage(directive.children || []);
        if (imageNode) {
          if (imageNode.url) props['data-src'] = imageNode.url;
          if (imageNode.alt) props['data-alt'] = imageNode.alt;
          if (imageNode.title) props['data-title'] = imageNode.title;
        }
        const attrs = directive.attributes || {};
        if (attrs.ratio) props['data-ratio'] = attrs.ratio;
        directive.children = []; /* children scartati: la figure rendera' solo via props */
        data.hName = 'fullbleed-directive';
      } else if (name === 'source') {
        const attrs = directive.attributes || {};
        if (attrs.href) props['data-href'] = attrs.href;
        if (attrs.author) props['data-author'] = attrs.author;
        if (attrs.verified) props['data-verified'] = attrs.verified;
        if (attrs.date) props['data-date'] = attrs.date;
        markParagraphsBare(directive.children || []);
        data.hName = 'source-directive';
      } else if (name === 'verified') {
        const attrs = directive.attributes || {};
        if (attrs.visited) props['data-visited'] = attrs.visited;
        if (attrs.pricesChecked) props['data-prices-checked'] = attrs.pricesChecked;
        if (attrs.contacts) props['data-contacts'] = attrs.contacts;
        markParagraphsBare(directive.children || []);
        data.hName = 'verified-directive';
      }

      data.hProperties = props;
    });
  };
}

/**
 * Marca il primo paragrafo top-level del documento con
 * `data-first-paragraph="true"`. Esegue dopo remarkEditorialDirectives,
 * quindi i paragrafi dentro directive (pullquote/source) hanno gia' hName
 * = "directive-p" e vengono saltati: il DropCap si applica solo al primo
 * paragrafo body vero (e mai a quelli dentro le directive).
 */
function markFirstBodyParagraph() {
  return (tree: Root) => {
    const children = (tree as Root & { children?: Array<DirectiveNode> }).children || [];
    for (const child of children) {
      if (child.type === 'paragraph') {
        const data = child.data || (child.data = {});
        const props = (data.hProperties || (data.hProperties = {})) as Record<string, unknown>;
        props['data-first-paragraph'] = 'true';
        return;
      }
    }
  };
}

function findFirstImage(
  children: NonNullable<DirectiveNode['children']>
): { url?: string; alt?: string; title?: string | null } | null {
  for (const child of children) {
    if (child.type === 'image') return child;
    if (child.children) {
      const nested = findFirstImage(child.children);
      if (nested) return nested;
    }
  }
  return null;
}

/** Parsing del `title` markdown immagine: `Caption | Foto: Rodrigo` → split. */
function parseImageTitle(title?: string | null): { caption?: string; credit?: string } {
  if (!title) return {};
  const trimmed = title.trim();
  if (!trimmed) return {};
  const pipeIdx = trimmed.indexOf(' | ');
  if (pipeIdx === -1) return { caption: trimmed };
  return {
    caption: trimmed.slice(0, pipeIdx).trim() || undefined,
    credit: trimmed.slice(pipeIdx + 3).trim() || undefined,
  };
}

const QUOTE_OPEN_CHARS = new Set(['"', '«', "'", '‘', '“']);

function extractText(node: unknown): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return extractText(props?.children);
  }
  return '';
}

/**
 * Splitta i children React del primo paragrafo per estrarre la prima lettera
 * "stampabile" (saltando virgolette di apertura) e il resto.
 */
function splitFirstLetter(children: unknown): { firstChar: string; rest: unknown } | null {
  const flat = Array.isArray(children) ? [...children] : [children];

  for (let i = 0; i < flat.length; i++) {
    const item = flat[i];
    if (typeof item !== 'string') continue;

    let idx = 0;
    while (idx < item.length && QUOTE_OPEN_CHARS.has(item[idx])) idx++;
    if (idx >= item.length) continue; /* solo virgolette: cerca nel pezzo dopo */

    const firstChar = item[idx];
    const prefix = item.slice(0, idx);
    const tail = item.slice(idx + 1);
    const restArr: unknown[] = [];
    if (prefix) restArr.push(prefix);
    if (tail) restArr.push(tail);
    restArr.push(...flat.slice(i + 1));
    return { firstChar, rest: restArr };
  }

  return null;
}

function ArticleBody({ article }: { article: ArticleData }) {
  if (typeof article.content !== 'string') {
    return <>{article.content}</>;
  }

  const components = {
    h2: ({ children }) => (
      <h2 className="mt-10 md:mt-14 scroll-mt-32 text-3xl md:text-4xl font-serif leading-tight text-[var(--color-ink)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 md:mt-10 text-2xl font-serif leading-tight text-[var(--color-ink)]">
        {children}
      </h3>
    ),
    p: ({
      children,
      'data-first-paragraph': isFirstParagraph,
    }: {
      children?: React.ReactNode;
      'data-first-paragraph'?: string;
    }) => {
      if (isFirstParagraph === 'true') {
        const text = extractText(children).trim();
        if (text.length >= 280) {
          const split = splitFirstLetter(children);
          if (split) {
            return <DropCap firstChar={split.firstChar} rest={split.rest as React.ReactNode} />;
          }
        }
      }
      return (
        <p className="mt-5 text-[17px] md:text-lg leading-[1.65] md:leading-[1.7] text-[var(--color-ink-2)]">
          {children}
        </p>
      );
    },
    ul: ({ children }) => (
      <ul className="mt-6 space-y-3 pl-0 text-base leading-relaxed text-[var(--color-ink-2)]">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex gap-2.5 md:gap-3">
        <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={16} />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>
    ),
    img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => {
      const { caption, credit } = parseImageTitle(title);
      return <InlineFigure src={src || ''} alt={alt || ''} caption={caption} credit={credit} />;
    },
    /* Inner paragraphs delle directive (pullquote/source) — bare <p> senza
       margin/font override del body, eredita lo styling dal wrapper directive. */
    'directive-p': ({ children }: { children?: React.ReactNode }) => (
      <p className="[&:not(:first-child)]:mt-3">{children}</p>
    ),
    /* Container directive overrides (custom tag names emessi da remarkEditorialDirectives) */
    'pullquote-directive': ({
      children,
      'data-attribution': attribution,
    }: {
      children?: React.ReactNode;
      'data-attribution'?: string;
    }) => <PullQuote attribution={attribution}>{children}</PullQuote>,
    'fullbleed-directive': ({
      'data-src': src,
      'data-alt': alt,
      'data-title': title,
      'data-ratio': ratio,
    }: {
      'data-src'?: string;
      'data-alt'?: string;
      'data-title'?: string;
      'data-ratio'?: string;
    }) => {
      const { caption, credit } = parseImageTitle(title);
      return (
        <FullBleedFigure
          src={src || ''}
          alt={alt || ''}
          ratio={ratio}
          caption={caption}
          credit={credit}
        />
      );
    },
    'source-directive': ({
      children,
      'data-href': href,
      'data-author': author,
      'data-verified': verified,
      'data-date': date,
    }: {
      children?: React.ReactNode;
      'data-href'?: string;
      'data-author'?: string;
      'data-verified'?: string;
      'data-date'?: string;
    }) => (
      <SourceBlock href={href} author={author} verified={verified === 'true'} date={date}>
        {children}
      </SourceBlock>
    ),
    'verified-directive': ({
      children,
      'data-visited': visited,
      'data-prices-checked': pricesChecked,
      'data-contacts': contacts,
    }: {
      children?: React.ReactNode;
      'data-visited'?: string;
      'data-prices-checked'?: string;
      'data-contacts'?: string;
    }) => (
      <VerifiedBox visited={visited} pricesChecked={pricesChecked} contacts={contacts === 'true'}>
        {children}
      </VerifiedBox>
    ),
  } as unknown as Components;

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkDirective,
        remarkEditorialDirectives,
        markFirstBodyParagraph,
        remarkUnwrapImages,
      ]}
      components={components}
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
  const [isReadingMode, setIsReadingMode] = useState(false);

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
  // Branded OG image generated at build time for preview slugs; falls back to hero image otherwise.
  const ogImage = isPreviewArticle ? `${SITE_URL}/og/${currentSlug}.jpg` : articleImage;
  const datePublished = toIsoDateString(article.date) || new Date().toISOString();
  const dateModified = toIsoDateString(article.updatedAt) || datePublished;
  const handleShare = async () => {
    const url = window.location.href;
    const channel = navigator.share ? 'native' : 'clipboard';
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
          {!isPreviewArticle && article.updatedAt && (
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
                onOpenReadingMode={() => setIsReadingMode(true)}
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
                  <ArticleBody article={article} />
                </section>

                {article.review && (
                  <ReviewBlock review={article.review} placeName={article.title} />
                )}

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
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
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

        <ReadingMode
          article={article}
          authorName={authorName}
          readingTime={readingTime}
          open={isReadingMode}
          onClose={() => setIsReadingMode(false)}
        />
      </>
    </PageLayout>
  );
}
