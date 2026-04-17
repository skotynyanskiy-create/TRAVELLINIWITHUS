---
name: seo-check
description: Audit TRAVELLINIWITHUS SEO quality across meta tags, Open Graph, structured data, image alt text, sitemap, robots, headings, and Core Web Vitals basics.
---

# /seo-check

Audit SEO quality across the TRAVELLINIWITHUS site.

## Arguments

Optional: page route to audit specifically (e.g. `/seo-check /destinazioni`)
If no argument, audit all public pages.

## What to check

### 1. Meta tags — per page

For each page component in `src/pages/`, verify:

- `<SEO>` component is used with `title`, `description`, `canonical`
- `title` is under 60 characters
- `description` is between 120–160 characters
- `canonical` URL uses `SITE_URL` from `src/config/site.ts`
- No duplicate titles across pages

### 2. Open Graph

Check `src/components/SEO.tsx`:

- `og:image` points to a real PNG/JPG (not SVG) — `public/og-default.png` is correct
- `og:image:width` = 1200, `og:image:height` = 630
- `og:locale` = `it_IT`
- `og:type` = `website` for index pages, `article` for article pages

### 3. Structured Data (JSON-LD)

Check `src/pages/Home.tsx` and `src/pages/Articolo.tsx`:

- Homepage: `WebSite` schema with `name`, `url`, `description`
- Article pages: `Article` schema with `headline`, `author`, `datePublished`, `image`
- Collaborazioni/MediaKit: `Organization` schema if present

### 4. Image ALT text

Scan all `<img>` tags in `src/`:

- Decorative images must have `alt=""` and `aria-hidden="true"` (hero image is correct)
- Content images must have descriptive `alt` text
- Flag any missing `alt` attributes entirely

### 5. Sitemap

Check `public/sitemap.xml`:

- All public routes present (`/`, `/destinazioni`, `/esperienze`, `/guide`, `/shop`, `/chi-siamo`, `/collaborazioni`, `/media-kit`, `/contatti`, `/risorse`)
- Admin routes (`/admin/*`) must NOT be in sitemap
- Legal routes present (`/privacy`, `/cookie`, `/termini`, `/disclaimer`)

### 6. robots.txt

Check `public/robots.txt`:

- `User-agent: *` is present
- `Disallow: /admin` is present
- `Sitemap:` line points to correct URL

### 7. Heading hierarchy

For each page: verify there is exactly one `<h1>` and it contains the primary keyword.
Flag pages with multiple `<h1>` or missing `<h1>`.

### 8. Core Web Vitals checklist

Static checks only (no browser required):

- Hero image has `fetchPriority="high"` ✓ (verify)
- Hero image has `<link rel="preload">` in `index.html` ✓ (verify)
- All page components are lazy-loaded in `App.tsx` ✓ (verify)
- No render-blocking scripts in `index.html`

## Output

Report grouped by category: PASS / WARN / FAIL.
For each issue: file path, line number, and recommended fix.
Priority order: FAIL → WARN → PASS.
