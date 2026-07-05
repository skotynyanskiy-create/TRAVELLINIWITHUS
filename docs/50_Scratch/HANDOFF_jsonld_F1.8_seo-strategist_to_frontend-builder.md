---
title: HANDOFF_jsonld_F1.8_seo-strategist_to_frontend-builder
status: consumed
created: 2026-05-15
consumed: 2026-05-15
from: travellini-seo-conversion-strategist
to: travellini-frontend-builder
slug: jsonld-schema-org
expires: 2026-05-29
type: handoff
area: workspace
---

> **Status consumed (2026-05-15)**: implementato in [src/lib/seo.ts](../../src/lib/seo.ts), [src/components/SEO.tsx](../../src/components/SEO.tsx), [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx), [index.html](../../index.html). Typecheck PASS. Bundle 4248.8 KB / 4300 KB (delta -40.2 KB vs pre-F1.8). Logo path adattato a `/pwa-512x512.png` (icon-512x512 non esistente). QA voto 9.3/10 ([QA_post_F1.8_2026-05-15.md](QA_post_F1.8_2026-05-15.md)).

# Handoff: JSON-LD strutturato globale + Article + BreadcrumbList

## Why this work matters

Attualmente:

- `index.html` NON ha JSON-LD `Organization`/`WebSite` globale (gap SEO).
- `src/pages/Articolo.tsx` ha un blocco JSON-LD inline (linee 371-424) — funziona ma non centralizzato, manca `inLanguage`, `articleSection`, `keywords`, `mainEntityOfPage` come WebPage, doppio autore, `sameAs`.
- `src/components/SEO.tsx` non ha props per JSON-LD, va esteso.

Output atteso: Google Rich Results Test PASS su home + articolo, sitelinks SearchAction abilitata, `@graph` coerente tra Organization (dichiarata in index.html) e Article (referenziato via `@id`).

## Decisions already made

- **Dominio canonical**: `https://travelliniwithus.it` (NON `.com` — verificato in [src/config/site.ts](../../src/config/site.ts:1))
- **Social `sameAs` reali** (verificati in [src/config/site.ts](../../src/config/site.ts:12-17)):
  - Instagram: `https://www.instagram.com/travelliniwithus/`
  - TikTok: `https://www.tiktok.com/@travellini.withus` (handle con punto, non `@travelliniwithus`)
  - Facebook: `https://www.facebook.com/travelwithuss/`
  - (Pinterest NON presente — non includerlo)
- **Schema Article completo** (no `BlogPosting`) con doppio author Rodrigo + Betta.
- **BreadcrumbList**: home → categoria → articolo (3 livelli, statico).
- **Centralizzare** in [SEO.tsx](../../src/components/SEO.tsx) — rimuovere il blocco inline da [Articolo.tsx:371-424](../../src/pages/Articolo.tsx).
- **Helper estratti** in `src/lib/seo.ts` (NUOVO file) per testabilità.

## Context the receiver needs

- File da modificare: [index.html](../../index.html), [src/components/SEO.tsx](../../src/components/SEO.tsx), [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx).
- File da creare: `src/lib/seo.ts` (helpers `buildArticleJsonLd`, `buildBreadcrumbListJsonLd`).
- Config esistente: [SITE_URL](../../src/config/site.ts:1), [CONTACTS](../../src/config/site.ts:7).
- Component esistente: [SEO.tsx](../../src/components/SEO.tsx) (66 righe, usa `react-helmet-async`).

## What the receiver should produce

### 1. Blocco da aggiungere in `index.html` (prima di `</head>`, una volta sola)

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://travelliniwithus.it/#organization",
        "name": "Travelliniwithus",
        "url": "https://travelliniwithus.it",
        "logo": {
          "@type": "ImageObject",
          "url": "https://travelliniwithus.it/icon-512x512.png",
          "width": 512,
          "height": 512
        },
        "description": "Posti particolari, esperienze memorabili e consigli di viaggio raccontati da Rodrigo e Betta.",
        "founder": [
          {
            "@type": "Person",
            "@id": "https://travelliniwithus.it/#rodrigo",
            "name": "Rodrigo",
            "url": "https://travelliniwithus.it/chi-siamo",
            "sameAs": [
              "https://www.instagram.com/travelliniwithus/",
              "https://www.tiktok.com/@travellini.withus",
              "https://www.facebook.com/travelwithuss/"
            ]
          },
          {
            "@type": "Person",
            "@id": "https://travelliniwithus.it/#betta",
            "name": "Betta",
            "url": "https://travelliniwithus.it/chi-siamo",
            "sameAs": [
              "https://www.instagram.com/travelliniwithus/",
              "https://www.tiktok.com/@travellini.withus",
              "https://www.facebook.com/travelwithuss/"
            ]
          }
        ],
        "sameAs": [
          "https://www.instagram.com/travelliniwithus/",
          "https://www.tiktok.com/@travellini.withus",
          "https://www.facebook.com/travelwithuss/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://travelliniwithus.it/#website",
        "url": "https://travelliniwithus.it",
        "name": "Travelliniwithus",
        "inLanguage": "it-IT",
        "description": "Travelliniwithus racconta posti particolari, esperienze memorabili e consigli utili da salvare e vivere davvero.",
        "publisher": { "@id": "https://travelliniwithus.it/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://travelliniwithus.it/esplora?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }
</script>
```

### 2. NUOVO file `src/lib/seo.ts`

```typescript
import { SITE_URL } from '../config/site';

export interface ArticleSchemaInput {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  gallery?: string[];
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags?: string[];
  authors?: Array<{ name: string; url?: string; sameAs?: string[] }>;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const DEFAULT_AUTHORS = [
  {
    name: 'Rodrigo',
    url: `${SITE_URL}/chi-siamo`,
    sameAs: [
      'https://www.instagram.com/travelliniwithus/',
      'https://www.tiktok.com/@travellini.withus',
      'https://www.facebook.com/travelwithuss/',
    ],
  },
  {
    name: 'Betta',
    url: `${SITE_URL}/chi-siamo`,
    sameAs: [
      'https://www.instagram.com/travelliniwithus/',
      'https://www.tiktok.com/@travellini.withus',
      'https://www.facebook.com/travelwithuss/',
    ],
  },
];

function toAbsoluteUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function buildArticleJsonLd(article: ArticleSchemaInput) {
  const canonical = `${SITE_URL}/articolo/${article.slug}`;
  const images = [article.coverImage, ...(article.gallery ?? [])]
    .filter(Boolean)
    .map(toAbsoluteUrl);
  const authors = (article.authors ?? DEFAULT_AUTHORS).map((author) => ({
    '@type': 'Person' as const,
    name: author.name,
    url: author.url ?? `${SITE_URL}/chi-siamo`,
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title.slice(0, 110),
    description: article.excerpt,
    image: images,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: authors,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Travelliniwithus',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512x512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    articleSection: article.category,
    inLanguage: 'it-IT',
    ...(article.tags && article.tags.length > 0 ? { keywords: article.tags.join(', ') } : {}),
    url: canonical,
  };
}

export function buildBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
```

### 3. Patch su `SEO.tsx`

Aggiungere due props opzionali a `SEOProps` e rendere i blocchi `<script>` dentro `<Helmet>`:

```tsx
import { buildBreadcrumbListJsonLd, type BreadcrumbItem } from '../lib/seo';

interface SEOProps {
  // ... props esistenti
  jsonLd?: object | object[];
  breadcrumbs?: BreadcrumbItem[];
}

// Dentro il componente, prima del return:
const schemas: object[] = [];
if (breadcrumbs && breadcrumbs.length > 0) {
  schemas.push(buildBreadcrumbListJsonLd(breadcrumbs));
}
if (jsonLd) {
  schemas.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));
}

// Dentro <Helmet>, dopo <link rel="canonical">:
{
  schemas.map((schema, i) => (
    <script key={`ld-${i}`} type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  ));
}
```

### 4. Refactor di `Articolo.tsx`

Rimuovere il blocco JSON-LD inline alle linee 371-424 e usare:

```tsx
import { buildArticleJsonLd } from '../lib/seo';

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
      : buildArticleJsonLd({
          slug: currentSlug,
          title: articleTitle,
          excerpt: articleDescription,
          coverImage: articleImage,
          gallery: article.gallery,
          publishedAt: datePublished,
          updatedAt: dateModified,
          category: article.category,
          tags: article.tags,
        })
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
/>;
```

## Out of scope (do NOT touch)

- `server.ts` — non necessario (tutto client-side).
- `firestore.rules`, `admin.ts` — non riguarda questo task.
- Cambio dominio (è già `.it`, non `.com`).
- Modifiche al SEO.tsx OG/Twitter — sono già OK.

## Open questions / decisions for the user

- **Logo path**: `icon-512x512.png` esiste in `public/`? Se manca, sostituire con `/og/default.webp` o `/images/brand/couple-travel.webp` (>112×112 richiesto da Google).
- **Pre-deploy validation**: dopo l'implementazione, far girare Google Rich Results Test su `/` + 1 articolo pubblicato + log risultato in `docs/14_Bugs/` se fail.

## Next hand-off

- **Next agent**: dopo merge, `travellini-quality-auditor` per regression sweep + Rich Results Test.
- **Trigger**: PR merged + smoke test live.

## Notes

- L'agent A2 originale aveva ipotizzato dominio `.com` e Pinterest — entrambi corretti qui contro `src/config/site.ts`.
- `headline` capped a 110 char per limite Google Rich Results.
- `mainEntityOfPage` ora è WebPage object con `@id` (più completo di una stringa).
- `inLanguage: "it-IT"` su WebSite e Article.
