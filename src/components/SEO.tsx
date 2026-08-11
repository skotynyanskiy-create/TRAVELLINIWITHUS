import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { isIndexable } from '../config/surfaces';
import { CONTACTS, SITE_URL, THEME_COLOR } from '../config/site';
import { buildBreadcrumbListJsonLd, type BreadcrumbItem } from '../lib/seo';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object | object[];
  breadcrumbs?: BreadcrumbItem[];
}

const DEFAULT_SITE_NAME = 'Travelliniwithus';
// JPG per massima compatibilità preview social (WhatsApp/LinkedIn renderizzano WebP
// in modo inaffidabile nelle card di anteprima).
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;

function ogImageType(src: string): string {
  if (/\.(jpe?g)(?=$|[?#])/i.test(src)) return 'image/jpeg';
  if (/\.png(?=$|[?#])/i.test(src)) return 'image/png';
  return 'image/webp';
}

/**
 * og:image e twitter:image devono essere assoluti: gli unfurler di
 * WhatsApp/LinkedIn/Slack non risolvono un path relativo contro la pagina.
 * DEFAULT_OG_IMAGE lo era gia', ma le cover degli articoli e dei posti
 * arrivano da Firestore come `/images/...`, quindi ogni link condiviso di un
 * articolo sarebbe uscito senza immagine.
 */
function absoluteOgImage(src: string): string {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  return `${SITE_URL}${src.startsWith('/') ? src : `/${src}`}`;
}

export default function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex,
  jsonLd,
  breadcrumbs,
}: SEOProps) {
  const { pathname } = useLocation();
  const resolvedCanonical =
    canonical || `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  // Il registro decide se la superficie e indicizzabile; la pagina puo solo
  // aggiungere noindex per ragioni per-contenuto (isDemo, isPlaceholder),
  // mai toglierlo.
  const resolvedNoindex = !isIndexable(pathname) || noindex === true;
  const resolvedImage = absoluteOgImage(image);
  const finalTitle = title.toLowerCase().includes(DEFAULT_SITE_NAME.toLowerCase())
    ? title
    : `${title} | ${DEFAULT_SITE_NAME}`;

  // L'SSR (server.ts injectMetaTags) inietta gia uno schema Article ricco con
  // marker data-ssr-jsonld="article". Se presente, il client non deve duplicarlo
  // (i breadcrumbs restano sempre — vivono in <SEO breadcrumbs>, non in jsonLd).
  const ssrArticlePresent =
    typeof document !== 'undefined' &&
    document.querySelector('script[data-ssr-jsonld="article"]') !== null;

  // In produzione l'hosting e' statico (vedi generate-route-html.js):
  // `dist/posto/<id>/index.html` porta gia' un `<script data-prerender-jsonld>`
  // per gli scraper che non eseguono JS. Quel nodo vive fuori dall'albero
  // gestito da react-helmet-async, quindi l'idratazione non lo rimuove da
  // sola: senza questo controllo un utente/crawler che ESEGUE JS vedrebbe due
  // Review identiche per la stessa pagina — non due bugie, ma comunque un
  // duplicato che i motori possono leggere come recensione gonfiata.
  const prerenderedType = (() => {
    if (typeof document === 'undefined') return undefined;
    const node = document.querySelector('script[data-prerender-jsonld]');
    if (!node?.textContent) return undefined;
    try {
      return (JSON.parse(node.textContent) as { '@type'?: string })['@type'];
    } catch {
      return undefined;
    }
  })();

  const schemas: object[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(buildBreadcrumbListJsonLd(breadcrumbs));
  }
  if (jsonLd) {
    const incoming = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    const filtered = incoming.filter((schema) => {
      const type = (schema as { '@type'?: string })['@type'];
      if (ssrArticlePresent && type === 'Article') return false;
      if (prerenderedType && type === prerenderedType) return false;
      return true;
    });
    schemas.push(...filtered);
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={resolvedNoindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <meta name="theme-color" content={THEME_COLOR} />
      <meta name="author" content={DEFAULT_SITE_NAME} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:type" content={ogImageType(resolvedImage)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Travelliniwithus - posti particolari, esperienze reali e consigli di viaggio"
      />
      <meta property="og:locale" content="it_IT" />
      <meta property="og:url" content={resolvedCanonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:site" content={CONTACTS.instagramHandle} />
      <meta name="twitter:creator" content={CONTACTS.instagramHandle} />
      <link rel="canonical" href={resolvedCanonical} />
      <link rel="alternate" hrefLang="it" href={resolvedCanonical} />
      <link
        rel="alternate"
        hrefLang="en"
        href={`${SITE_URL}/en${pathname === '/' ? '' : pathname}`}
      />
      <link rel="alternate" hrefLang="x-default" href={resolvedCanonical} />
      <link rel="author" href={`${SITE_URL}/llms.txt`} type="text/plain" />

      {schemas.map((schema, i) => (
        <script key={`ld-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
