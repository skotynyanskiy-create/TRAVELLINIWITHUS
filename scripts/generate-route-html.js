/**
 * Emette un file HTML per rotta con meta corrette, dopo `vite build`.
 *
 * PERCHE ESISTE
 * In produzione l'hosting e statico: `firebase.json` ha `"public": "dist"` e un
 * unico rewrite `**` → `/index.html`, senza rewrite verso Cloud Run o Functions.
 * Quindi `server.ts` — e tutto il suo SSR, `injectMetaTags` incluso — non viene
 * mai eseguito in produzione. Senza questo pass ogni URL servirebbe lo stesso
 * shell con `<title>Travelliniwithus</title>` e zero tag Open Graph, e ogni
 * condivisione su WhatsApp, Instagram, Facebook o LinkedIn mostrerebbe una card
 * vuota: quegli scraper non eseguono JavaScript.
 *
 * COME
 * Firebase Hosting serve un file statico corrispondente PRIMA di applicare il
 * rewrite `**`, quindi `dist/posto/<id>/index.html` risponde a `/posto/<id>`
 * senza toccare `firebase.json`.
 *
 * AUTORITA SULLE ROTTE
 * L'elenco arriva da `dist/sitemap.xml`, non da una lista locale: cosi
 * l'insieme delle pagine emesse coincide con l'insieme degli URL dichiarati a
 * Google per costruzione, e non per disciplina.
 */
import fs from 'fs';
import path from 'path';
import { STATIC_ROUTE_META, ogSlugForPath, findRouteMeta } from '../src/config/routeMeta.ts';
import { getDestination } from '../src/config/destinations.ts';
import { buildReviewJsonLd } from '../src/lib/placeReviewSchema.ts';
import { buildArticleJsonLd } from '../src/lib/seo.ts';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const contentSeed = require('../src/data/content-seed.json');

const BASE_URL = 'https://travelliniwithus.it';
const SITE_NAME = 'Travelliniwithus';
const DIST = path.resolve(process.cwd(), 'dist');

/** Replica di SEO.tsx: il nome del sito non si duplica nel title. */
function fullTitle(title) {
  return title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} | ${SITE_NAME}`;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readRoutesFromSitemap() {
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(
      'dist/sitemap.xml assente. Questo script deve girare DOPO `vite build` ' +
        '(che copia public/ in dist/), e `generate-sitemap` deve averlo prodotto.'
    );
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return locs.map((loc) => {
    const route = loc.replace(BASE_URL, '') || '/';
    return route.startsWith('/') ? route : `/${route}`;
  });
}

const MAX_DESCRIPTION = 200;

/** Taglia a confine di parola: una description tronca a metà parola è peggio che corta. */
function clamp(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_DESCRIPTION) return clean;
  const cut = clean.slice(0, MAX_DESCRIPTION);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

/**
 * Meta per una pagina-posto, dai soli posti reali.
 *
 * `title` e `description` replicano il <SEO> di Posto.tsx (`hook — title`, campo
 * `description`), così la card che si vede condivisa e la pagina che si apre
 * dicono la stessa cosa.
 *
 * L'og:image NON è `item.cover`, che Posto.tsx usa a runtime: le cover sono
 * frame di reel 9:16 e gli scraper si aspettano 1200x630. Per gli scraper vale
 * la card generata; per gli utenti l'immagine non cambia nulla.
 *
 * Il JSON-LD e' lo stesso `Review` di Posto.tsx (stessa funzione,
 * `buildReviewJsonLd`), non una versione ridotta: gli scraper che NON
 * eseguono JS — la ragione d'essere di questo script — vedevano solo un
 * `Place` generico, mentre chi esegue JS vedeva il verdetto onesto. Due
 * fonti diverse per lo stesso fatto sono un rischio quanto un fatto sbagliato
 * solo. `SEO.tsx` deduplica lato client leggendo `data-prerender-jsonld`, cosi'
 * l'utente/crawler che ESEGUE JS non vede la Review due volte.
 */
function postoMeta(route) {
  const id = route.replace(/^\/posto\//, '');
  const item = contentSeed.find((entry) => entry.id === id && !entry.isPlaceholder);
  if (!item) return null;

  const place = item.place || {};
  const where = [place.city, place.region, place.country].filter(Boolean).join(', ');
  const title = item.hook
    ? `${item.hook} — ${item.title || place.name}`
    : item.title || place.name || id;
  const description = clamp(
    item.description || `${item.title || place.name}${where ? ` — ${where}` : ''}.`
  );

  const reviewBody = item.review?.summary || item.description;
  const jsonLd = reviewBody ? buildReviewJsonLd(item, reviewBody) : null;

  return {
    title,
    description,
    ogSlug: `posto-${id}`,
    ogType: 'article',
    jsonLd,
  };
}

function staticMeta(route) {
  const entry = findRouteMeta(route);
  if (!entry) return null;
  return {
    title: entry.title,
    description: entry.description,
    ogSlug: ogSlugForPath(entry.path),
    ogType: 'website',
    jsonLd: null,
  };
}

/**
 * Meta per zone/regioni/paesi dell'albero DESTINATIONS (dato locale, non
 * Firestore — stessa categoria di `/posto/*`, quindi copertura obbligatoria
 * qui, non un warning). Titolo/description replicano <SEO> di
 * DestinationWorld in Destinazione.tsx: stessa regola di postoMeta, la card
 * condivisa e la pagina aperta devono dire la stessa cosa. Il nodo si
 * risolve sempre dall'ULTIMO segmento della rotta — stessa logica del router
 * in Destinazione.tsx (subSlug se presente, altrimenti zoneSlug).
 *
 * ogSlug fisso a 'default': generate-og-images.mjs non genera una card per
 * ogni destinazione (solo statiche/articoli/posti), quindi puntare a uno slug
 * dedicato produrrebbe un'immagine OG rotta (404) sulle unfurl social.
 */
function destinazioneMeta(route) {
  const slug = route.split('/').filter(Boolean).pop();
  const node = getDestination(slug);
  if (!node) return null;

  const title = `${node.name} — Le nostre destinazioni`;
  const description = clamp(
    node.intro || `I posti particolari di ${node.name} visti da Rodrigo & Betta.`
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: node.name,
    url: `${BASE_URL}${route}`,
  };
  if (node.coordinates) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: node.coordinates.lat,
      longitude: node.coordinates.lng,
    };
  }

  return { title, description, ogSlug: 'default', ogType: 'website', jsonLd };
}

/**
 * Meta per una pagina-articolo, letta dal seed in repo
 * (`src/data/articles/<slug>.seed.ts`), non da Firestore: il build non ha
 * credenziali garantite (stessa ragione di `generate-sitemap.js`, righe
 * 156-199). Se il seed non esiste (articolo non ancora scritto, o pubblicato
 * da /admin senza un seed corrispondente) la rotta resta fra gli `skipped`
 * "owned" ma non bloccanti — vedi il filtro `/articolo/` in fondo a `main()`.
 *
 * `title`/`description` replicano <SEO> di Articolo.tsx (title = H1 = H1
 * dell'articolo, description = excerpt). Il JSON-LD e' un'approssimazione
 * best-effort per i crawler che non eseguono JS: usa `createdAt`/`updatedAt`
 * del seed, che al momento della pubblicazione reale diventano
 * `serverTimestamp()` — qui, prima del `--commit`, sono solo la data del
 * build. E' una degradazione nota (stesso principio gia' documentato sopra
 * per l'og:image dei posti), non una data falsa spacciata per reale: il
 * render idratato (che Google esegue) legge sempre il valore vero da
 * Firestore.
 */
async function articoloMeta(route) {
  const slug = route.replace(/^\/articolo\//, '');
  const seedPath = path.join(process.cwd(), 'src', 'data', 'articles', `${slug}.seed.ts`);
  if (!fs.existsSync(seedPath)) return null;

  const { articleSeed } = await import(`file://${seedPath.replace(/\\/g, '/')}`);

  // Ogni card OG generata per un articolo vive in public/og/<slug>.jpg: se non
  // c'e' (la maggioranza dei seed oggi non ne ha una dedicata), stessa ricaduta
  // su 'default' gia' usata da destinazioneMeta() per non produrre un'immagine
  // 404 nell'unfurl social.
  const hasOgCard = fs.existsSync(path.join(process.cwd(), 'public', 'og', `${slug}.jpg`));
  const publishedAt = articleSeed.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString();
  const updatedAt = articleSeed.updatedAt?.toDate?.()?.toISOString() ?? publishedAt;

  const jsonLd = buildArticleJsonLd({
    slug,
    title: articleSeed.title,
    excerpt: articleSeed.excerpt,
    coverImage: articleSeed.coverImage,
    publishedAt,
    updatedAt,
    category: articleSeed.category,
  });

  return {
    title: articleSeed.title,
    description: clamp(articleSeed.excerpt),
    ogSlug: hasOgCard ? slug : 'default',
    ogType: 'article',
    jsonLd,
  };
}

async function metaForRoute(route) {
  if (route.startsWith('/posto/')) return postoMeta(route);
  if (route.startsWith('/destinazione/')) return destinazioneMeta(route);
  if (route.startsWith('/articolo/')) return articoloMeta(route);
  return staticMeta(route);
}

function buildHead(route, meta) {
  const url = `${BASE_URL}${route === '/' ? '/' : route}`;
  const image = `${BASE_URL}/og/${meta.ogSlug}.jpg`;
  const title = fullTitle(meta.title);

  const tags = [
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="it_IT" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ];

  if (meta.jsonLd) {
    tags.push(
      `<script type="application/ld+json" data-prerender-jsonld>${JSON.stringify(meta.jsonLd)}</script>`
    );
  }

  return { title, tags };
}

const BLOCK_START = '<!-- route-meta:start (scripts/generate-route-html.js) -->';
const BLOCK_END = '<!-- route-meta:end -->';

/**
 * Rende il template pulito e riproducibile.
 *
 * Serve perche la rotta `/` scrive proprio su `dist/index.html`, che e anche il
 * template: senza questo, una seconda esecuzione senza rebuild userebbe come
 * base un file gia iniettato e produrrebbe tag Open Graph DOPPIE su ogni
 * pagina (la home piu la rotta). Verificato: succedeva.
 *
 * Toglie anche `<meta name="description">` e i tag `og:`/`twitter:` statici
 * del template (index.html, 2026-07-30: fallback per crawler/unfurl su rotte
 * MAI prerenderizzate da questo script — vedi commento in cima a index.html):
 * per le rotte che QUESTO script copre, i tag route-specific sostituiscono
 * quelli statici, non si sommano. Due title/description/og:image sono
 * ambigui, non additivi — e la guardia sotto in main() blocca la build se
 * questo strip non li ha tolti tutti.
 */
function sanitizeTemplate(html) {
  // Ricerca per stringa, non per RegExp: i sentinel contengono `(`, `)` e `.`,
  // che come pattern sarebbero gruppi e jolly e non matcherebbero i literal.
  let out = html;
  // In ciclo, non una volta sola: rimuovere un blocco per esecuzione crea un
  // punto fisso: N blocchi in ingresso → N-1 dopo lo strip → N in uscita. Lo
  // script risultava idempotente sull'hash ed emetteva comunque tag duplicate.
  for (;;) {
    const start = out.indexOf(BLOCK_START);
    if (start === -1) break;
    const end = out.indexOf(BLOCK_END, start);
    if (end === -1) break;
    // Si consuma anche il whitespace adiacente: lasciarlo faceva crescere il
    // file di due righe vuote a ogni esecuzione.
    const before = out.slice(0, start).replace(/\s+$/, '');
    const after = out.slice(end + BLOCK_END.length).replace(/^\s+/, '');
    out = `${before}\n  ${after}`;
  }
  // Va rimossa DOPO il blocco: se il blocco c'e', la sua description e' la prima
  // del documento e verrebbe rimossa al posto di quella del template.
  out = out.replace(/[ \t]*<meta\s+name="description"[\s\S]*?\/>\s*\n?/i, '');
  // Tag og:*/twitter:* statici di index.html: stessa logica, tolti prima
  // dell'iniezione route-specific. `[\s\S]*?` regge sia la forma su una riga
  // sia quella multi-riga con attributi impaginati.
  out = out.replace(
    /[ \t]*<meta\s+(?:property="og:[^"]*"|name="twitter:[^"]*")[\s\S]*?\/>\s*\n?/gi,
    ''
  );
  return out;
}

/**
 * Toglie i `<link rel="preload">` dell'immagine LCP, che valgono solo per la
 * home.
 *
 * `index.html` preloada la copertina del poster della home con
 * `fetchpriority="high"`: sulla home e' giusto ed e' documentato li' sopra. Ma
 * `sanitizeTemplate()` rimuove i blocchi meta e i tag `og:`/`twitter:`, non i
 * preload — quindi ogni rotta emessa ereditava quel preload. Verificato con un
 * build completo il 2026-08-17: **133 file su 133**, `/privacy` compresa,
 * scaricavano 173 KB di una foto che non renderizzano mai — fra il 13% e il 21%
 * del peso pagina su `/mappa`, `/posto/*` e `/collaborazioni`.
 *
 * Si toglie per rotta invece che nel template perche' la home passa da qui come
 * tutte le altre (`outputPathFor('/')` riscrive proprio `dist/index.html`):
 * ripulire il template a monte spegnerebbe il preload dove serve davvero.
 */
function rimuoviPreloadDiRotta(html) {
  return html.replace(/[ \t]*<link\s+rel="preload"[\s\S]*?\/?>\s*\n?/gi, '');
}

function renderHtml(template, route, meta) {
  const { title, tags } = buildHead(route, meta);
  const base = route === '/' ? template : rimuoviPreloadDiRotta(template);
  const html = base.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`);

  const block = `\n    ${BLOCK_START}\n    ${tags.join('\n    ')}\n    ${BLOCK_END}\n  `;
  return html.replace(/<\/head>/i, `${block}</head>`);
}

function outputPathFor(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

async function main() {
  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html assente. Eseguire `vite build` prima di questo script.');
  }
  // Letto UNA volta e ripulito: la rotta `/` sovrascrive proprio questo file,
  // quindi il template va reso indipendente da esecuzioni precedenti.
  const template = sanitizeTemplate(fs.readFileSync(templatePath, 'utf8'));

  // Guardia contro il template inquinato. Lo strip toglie i blocchi marcati coi
  // sentinel, ma non puo' togliere tag Open Graph arrivate per altre vie. Se ne
  // restano, ogni pagina emessa le erediterebbe e finirebbe con og:title
  // duplicati: gli scraper leggono il primo, che e' quello sbagliato. E' un
  // errore silenzioso, quindi va reso esplicito.
  if (/property="og:/i.test(template)) {
    throw new Error(
      'dist/index.html contiene tag Open Graph non marcate: il template non e pulito.\n' +
        '  Rigenerarlo con `vite build` (o `npm run build`) prima di questo script.\n' +
        '  Questo script assume un index.html appena prodotto da Vite.'
    );
  }

  const routes = readRoutesFromSitemap();
  const emitted = [];
  const skipped = [];

  for (const route of routes) {
    const meta = await metaForRoute(route);
    if (!meta) {
      skipped.push(route);
      continue;
    }
    const dest = outputPathFor(route);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, renderHtml(template, route, meta));
    emitted.push(route);
  }

  console.log(
    `Route HTML: ${emitted.length}/${routes.length} pagine emesse ` +
      `(${STATIC_ROUTE_META.length} rotte statiche note, ${contentSeed.filter((i) => !i.isPlaceholder).length} posti reali).`
  );

  if (skipped.length === 0) return;

  // Rumore deliberato: una rotta nel sitemap senza meta serve lo shell generico,
  // cioe' esattamente il difetto che questo script esiste per chiudere.
  console.warn(
    `[route-html] ATTENZIONE — ${skipped.length} rotte nel sitemap senza meta, ` +
      `serviranno lo shell generico:\n  ${skipped.join('\n  ')}`
  );

  // Si distingue fra cio' che questo script controlla e cio' che non controlla.
  // Statiche e posti vengono da file in repo: se manca una meta e' un errore di
  // manutenzione e la build deve fermarsi. `/articolo/*` e `/shop/*` arrivano da
  // Firestore a build time: un articolo appena pubblicato non ha ancora una voce
  // qui, e far fallire il deploy per questo significherebbe che pubblicare un
  // articolo rompe il rilascio. Quelli restano warning.
  const owned = skipped.filter((r) => !r.startsWith('/articolo/') && !r.startsWith('/shop/'));
  if (owned.length > 0) {
    console.error(
      `[route-html] BLOCCANTE — ${owned.length} rotte che questo repo controlla non hanno meta:\n  ${owned.join('\n  ')}\n` +
        `  Aggiungere una voce in src/config/routeMeta.ts (statiche) o verificare content-seed.json (posti).`
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  // Messaggio, non stack: in un log di build lo stack e' rumore che nasconde la
  // riga che dice cosa fare.
  console.error(`[route-html] ${error.message}`);
  process.exit(1);
});
