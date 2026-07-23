#!/usr/bin/env node
/**
 * Generate per-article Open Graph images (1200x630 WebP) from a brand-coherent
 * SVG template. Output: public/og/<slug>.webp consumed by SEO.tsx + Articolo.tsx.
 *
 * Engine: extend ARTICLES below as new articles ship. For Firestore-published
 * content the next iteration will fetch via firebase-admin during build.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = path.resolve(process.cwd(), 'public/og');

const COLORS = {
  bg1: '#f7f0e5',
  bg2: '#e8dec9',
  ink: '#1c1a17',
  accent: '#b08b63',
  accentSoft: '#f1e6d6',
};

const MAX_TITLE_CHARS_PER_LINE = 28;
const MAX_TITLE_LINES = 3;

function wrapTitle(title) {
  const words = title.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_TITLE_CHARS_PER_LINE && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, MAX_TITLE_LINES);
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg({ title, category, location }) {
  const titleLines = wrapTitle(title);
  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : 78}">${escapeXml(line)}</tspan>`
    )
    .join('');

  const eyebrow = location ? `${category.toUpperCase()} · ${location.toUpperCase()}` : category.toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${COLORS.bg1}"/>
        <stop offset="100%" stop-color="${COLORS.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#grad)"/>
    <rect x="0" y="0" width="6" height="630" fill="${COLORS.accent}"/>
    <text x="80" y="110" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="${COLORS.accent}">
      ${escapeXml(eyebrow)}
    </text>
    <text x="80" y="220" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="500" fill="${COLORS.ink}" style="letter-spacing:-1px;">
      ${titleTspans}
    </text>
    <line x1="80" y1="540" x2="200" y2="540" stroke="${COLORS.accent}" stroke-width="2"/>
    <text x="80" y="582" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="500" fill="${COLORS.ink}">
      Travellini<tspan font-weight="700" fill="${COLORS.accent}">with</tspan>us
    </text>
    <text x="80" y="610" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="${COLORS.ink}" opacity="0.55">
      RODRIGO &amp; BETTA · POSTI PARTICOLARI
    </text>
  </svg>`;
}

const ARTICLES = [
  {
    slug: 'demo-articolo-dolomiti',
    title: 'Dolomiti: rifugi di design e sentieri da salvare',
    category: 'Guide',
    location: 'Trentino-Alto Adige',
  },
  {
    slug: 'guida-in-regalo',
    title: "Alla scoperta dell'Italia nascosta",
    category: 'Guida gratuita',
    location: '10 posti provati e consigliati da noi',
  },
  {
    slug: 'lead-magnet',
    title: "Alla scoperta dell'Italia nascosta",
    category: 'Guida pratica',
    location: '10 posti provati e consigliati da noi',
  },
];

// WebP e' il formato principale (leggero, usato per default in SEO.tsx), ma
// WhatsApp/LinkedIn renderizzano WebP in modo inaffidabile nelle preview card:
// ogni entry produce anche un .jpg, cosi' i path .jpg gia' referenziati da
// <SEO image=...> (default.jpg, lead-magnet.jpg, ...) restano generati dallo
// stesso script invece di restare congelati a un pass manuale precedente.
async function generateBoth(svg, slug) {
  const buffer = Buffer.from(svg);
  const webpDest = path.join(OUT_DIR, `${slug}.webp`);
  const jpgDest = path.join(OUT_DIR, `${slug}.jpg`);
  await sharp(buffer).webp({ quality: 90, effort: 4 }).toFile(webpDest);
  await sharp(buffer).jpeg({ quality: 88 }).toFile(jpgDest);
  return [webpDest, jpgDest];
}

async function generateOne(article) {
  const svg = buildSvg(article);
  return generateBoth(svg, article.slug);
}

async function generateDefault() {
  const svg = buildSvg({
    title: 'Posti particolari che valgono davvero',
    category: 'Travelliniwithus',
    location: '',
  });
  return generateBoth(svg, 'default');
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const defFiles = await generateDefault();
  console.log(`Generated ${defFiles.join(', ')}`);

  for (const article of ARTICLES) {
    const files = await generateOne(article);
    console.log(`Generated ${files.join(', ')}`);
  }
  console.log(`Done: ${(ARTICLES.length + 1) * 2} OG images`);
}

main().catch((err) => {
  console.error('OG image generation failed:', err);
  process.exit(1);
});
