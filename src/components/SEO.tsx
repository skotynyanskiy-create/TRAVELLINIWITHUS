import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
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

export default function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
  breadcrumbs,
}: SEOProps) {
  const { pathname } = useLocation();
  const resolvedCanonical =
    canonical || `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  const finalTitle = title.toLowerCase().includes(DEFAULT_SITE_NAME.toLowerCase())
    ? title
    : `${title} | ${DEFAULT_SITE_NAME}`;

  // L'SSR (server.ts injectMetaTags) inietta gia uno schema Article ricco con
  // marker data-ssr-jsonld="article". Se presente, il client non deve duplicarlo
  // (i breadcrumbs restano sempre — vivono in <SEO breadcrumbs>, non in jsonLd).
  const ssrArticlePresent =
    typeof document !== 'undefined' &&
    document.querySelector('script[data-ssr-jsonld="article"]') !== null;

  const schemas: object[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(buildBreadcrumbListJsonLd(breadcrumbs));
  }
  if (jsonLd) {
    const incoming = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    const filtered = ssrArticlePresent
      ? incoming.filter((schema) => (schema as { '@type'?: string })['@type'] !== 'Article')
      : incoming;
    schemas.push(...filtered);
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <meta name="theme-color" content={THEME_COLOR} />
      <meta name="author" content={DEFAULT_SITE_NAME} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content={ogImageType(image)} />
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
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={CONTACTS.instagramHandle} />
      <meta name="twitter:creator" content={CONTACTS.instagramHandle} />
      <link rel="canonical" href={resolvedCanonical} />
      {schemas.map((schema, i) => (
        <script key={`ld-${i}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
