import { useState, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { ArrowRight, MapPin } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import ArchiveCard from '../components/discovery/ArchiveCard';
import InteractiveMap from '../components/InteractiveMap';
import OptimizedImage from '../components/OptimizedImage';
import ContentCard from '../components/content/ContentCard';
import { SITE_URL } from '../config/site';
import { DEMO_ARCHIVE_MAP_MARKERS } from '../config/demoArchive';
import { getArticlesByRegion, getRegionMeta, type RegionMeta } from '../lib/regions';
import type { ArchiveItem } from '../utils/contentArchive';
import {
  getContentByRegion,
  groupByIntention,
  INTENTION_LABEL,
  INTENTION_ORDER,
} from '../config/contentLibrary';
import {
  DESTINATIONS,
  countForDestination,
  getChildren,
  getContentForDestination,
  getDestination,
  getDestinationUrl,
  type DestinationNode,
} from '../config/destinations';

// ─── Router: risolve zona / regione / paese, con back-compat legacy ──────────

export default function Destinazione() {
  const { zoneSlug, subSlug } = useParams<{ zoneSlug?: string; subSlug?: string }>();

  const node = subSlug ? getDestination(subSlug) : zoneSlug ? getDestination(zoneSlug) : undefined;

  if (node) {
    return <DestinationWorld node={node} />;
  }

  // /destinazione (senza slug) → hub con tutte le zone (la radice della spina).
  if (!zoneSlug) {
    return <DestinationsHub />;
  }

  // Back-compat: slug regione legacy (puglia, sicilia, sardegna,
  // trentino-alto-adige, …) senza nodo nell'albero → vecchia landing.
  const legacyRegion = getRegionMeta(zoneSlug);
  if (legacyRegion) {
    return <LegacyRegionLanding region={legacyRegion} />;
  }

  return <Navigate to="/esplora" replace />;
}

// ─── Hub /destinazione: tutte le zone (radice della spina) ───────────────────

// ─── Hub /destinazione: tutte le zone, regioni e paesi ────────────────────────

function DestinationsHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');

  const allDestinations = useMemo(() => {
    return DESTINATIONS.filter((node) => node.level !== 'zone');
  }, []);

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchZone =
        selectedZoneFilter === 'all' ||
        dest.zone.toLowerCase() === selectedZoneFilter.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.zone.toLowerCase().includes(searchQuery.toLowerCase());
      return matchZone && matchQuery;
    });
  }, [allDestinations, selectedZoneFilter, searchQuery]);

  const canonical = `${SITE_URL}/destinazione`;

  return (
    <PageLayout>
      <SEO
        title="Tutte le Destinazioni — Italia, Europa e Mondo"
        description="Esplora tutte le 20 regioni italiane, i paesi europei e del mondo raccontati da Rodrigo e Betta con posti particolari provati sul posto."
        canonical={canonical}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Esplora', url: '/esplora' },
          { name: 'Destinazioni', url: '/destinazione' },
        ]}
      />

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mt-6">
          <Breadcrumbs
            items={[{ label: 'Esplora', href: '/esplora' }, { label: 'Destinazioni' }]}
          />
        </div>

        <header className="mt-8 max-w-3xl">
          <p className="mb-3 text-eyebrow !text-[var(--color-accent-text)]">
            Tutte le Destinazioni
          </p>
          <h1 className="font-serif text-5xl leading-tight text-[var(--color-ink)] md:text-6xl">
            Dove siamo stati, regione per regione.
          </h1>
          <p className="mt-5 font-serif text-lg italic leading-relaxed text-[var(--color-ink-2)] md:text-xl">
            Dai borghi d'Italia ai viaggi fuori dai confini. Cerca la tua regione o filtra per zona
            per scoprire tutte le nostre guide ed i posti provati.
          </p>
        </header>

        {/* Control Bar: Search Input & Zone Filters */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-4 shadow-sm">
          {/* Search Box */}
          <div className="relative flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca regione o paese (es. Toscana, Puglia, Norvegia...)"
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-sand)] px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zone Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Tutte' },
              { id: 'italia', label: 'Italia (20 Regioni)' },
              { id: 'europa', label: 'Europa' },
              { id: 'africa', label: 'Africa' },
              { id: 'asia', label: 'Asia' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedZoneFilter(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedZoneFilter === tab.id
                    ? 'bg-[var(--color-ink)] text-white shadow-sm'
                    : 'bg-[var(--color-sand)] text-[var(--color-ink-2)] hover:bg-[var(--color-border)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((dest) => {
            const count = countForDestination(dest);
            const hasCover = Boolean(dest.cover);
            return (
              <Link
                key={dest.slug}
                to={getDestinationUrl(dest)}
                className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] transition-transform duration-300 hover:-translate-y-1 ${
                  hasCover
                    ? 'bg-[var(--color-ink-deep)]'
                    : 'bg-white border border-[var(--color-border)]'
                }`}
              >
                {hasCover ? (
                  <>
                    <OptimizedImage
                      src={dest.cover}
                      alt={dest.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="twu-cover-scrim absolute inset-0" />
                    <div className="relative z-10 p-6">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        {dest.zone}
                      </span>
                      <h2 className="font-serif text-3xl leading-none text-white drop-shadow-md">
                        {dest.name}
                      </h2>
                      <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
                        {count} {count === 1 ? 'posto' : 'posti'}
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-8 -right-4 select-none font-serif text-[10rem] leading-none text-[var(--color-border)] opacity-60"
                    >
                      {dest.name.charAt(0)}
                    </span>
                    <div className="relative z-10 p-6">
                      <span
                        aria-hidden="true"
                        className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]"
                      >
                        {dest.zone}
                      </span>
                      <h2 className="font-serif text-3xl leading-none text-[var(--color-ink)]">
                        {dest.name}
                      </h2>
                      <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted-fg-2)]">
                        {count} {count === 1 ? 'posto' : 'posti'}
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </p>
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-24" />
      </div>
    </PageLayout>
  );
}

// ─── Template DESTINATION-WORLD (zona / regione / paese) ─────────────────────

function DestinationWorld({ node }: { node: DestinationNode }) {
  const zoneNode = node.parentSlug ? getDestination(node.parentSlug) : undefined;
  const children = useMemo(() => getChildren(node.slug), [node.slug]);
  const content = useMemo(() => getContentForDestination(node), [node]);

  const url = getDestinationUrl(node);
  const canonical = `${SITE_URL}${url}`;
  const count = content.length;

  const breadcrumbTrail = [
    { name: 'Esplora', url: '/esplora' },
    ...(zoneNode ? [{ name: zoneNode.name, url: `/destinazione/${zoneNode.slug}` }] : []),
    { name: node.name, url },
  ];

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: node.name,
    description: node.intro,
    url: canonical,
    inLanguage: 'it-IT',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Travelliniwithus',
      url: SITE_URL,
    },
    ...(node.matchCountry
      ? { address: { '@type': 'PostalAddress', addressCountry: node.matchCountry } }
      : {}),
    ...(node.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: node.coordinates.lat,
            longitude: node.coordinates.lng,
          },
        }
      : {}),
  };

  return (
    <PageLayout>
      <SEO
        title={`${node.name} — Le nostre destinazioni`}
        description={node.intro ?? `I posti particolari di ${node.name} visti da Rodrigo & Betta.`}
        canonical={canonical}
        image={node.cover}
        breadcrumbs={[{ name: 'Home', url: '/' }, ...breadcrumbTrail]}
        jsonLd={placeJsonLd}
      />

      {/* Hero — cover se disponibile, altrimenti header sand editoriale. */}
      {node.cover ? (
        <section className="relative -mt-32 md:-mt-24 h-[55vh] min-h-[440px] w-full overflow-hidden bg-[var(--color-ink)]">
          <OptimizedImage
            src={node.cover}
            alt={`${node.name} — destinazione`}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-12 md:pb-16">
            <div className="mx-auto max-w-6xl">
              <p className="mb-3 text-eyebrow !text-[var(--color-accent-on-dark)]">Destinazione</p>
              <h1 className="font-serif text-5xl leading-tight text-white md:text-7xl">
                {node.name}
              </h1>
              {node.intro && (
                <p className="mt-5 max-w-2xl font-serif text-lg italic leading-relaxed text-white/90 md:text-xl">
                  {node.intro}
                </p>
              )}
              <DestinationMeta count={count} />
            </div>
          </div>
        </section>
      ) : (
        <section className="-mt-32 md:-mt-24 bg-[var(--color-surface)] pt-40 md:pt-44">
          <div className="mx-auto max-w-6xl px-6 pb-12 md:px-12 md:pb-16">
            <p className="mb-3 text-eyebrow !text-[var(--color-accent-text)]">Destinazione</p>
            <h1 className="font-serif text-5xl leading-tight text-[var(--color-ink)] md:text-7xl">
              {node.name}
            </h1>
            {node.intro && (
              <p className="mt-5 max-w-2xl font-serif text-lg italic leading-relaxed text-[var(--color-ink-2)] md:text-xl">
                {node.intro}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
              <span>
                {count} {count === 1 ? 'posto' : 'posti'}
              </span>
              <span aria-hidden="true" className="text-black/30">
                ·
              </span>
              <span>Rodrigo & Betta</span>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mt-10">
          <Breadcrumbs
            items={[
              { label: 'Esplora', href: '/esplora' },
              ...(zoneNode
                ? [{ label: zoneNode.name, href: `/destinazione/${zoneNode.slug}` }]
                : []),
              { label: node.name },
            ]}
          />
        </div>

        {/* Figli: regioni/paesi della zona. Il conteggio qui è contestuale. */}
        {children.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-8 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              {node.level === 'zone' && node.zone === 'Italia' ? 'Le regioni' : 'Dove siamo stati'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => {
                const childCount = countForDestination(child);
                return (
                  <Link
                    key={child.slug}
                    to={getDestinationUrl(child)}
                    className="group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/20 hover:shadow-[var(--shadow-premium)]"
                  >
                    <div>
                      <p className="font-serif text-2xl leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                        {child.name}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
                        {childCount} {childCount === 1 ? 'posto' : 'posti'}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-[var(--color-accent-text)] transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Griglia posti particolari reali del nodo. */}
        {content.length > 0 ? (
          <section className="mt-20">
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)]" />
              <p className="text-eyebrow">Visti sul campo</p>
            </div>
            <h2 className="mb-10 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              I posti particolari di {node.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-20 rounded-[var(--radius-lg)] border border-dashed border-black/15 bg-[var(--color-surface)] p-10 text-center">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted-fg)]">
              Presto nuovi posti
            </p>
            <p className="mt-3 max-w-xl mx-auto font-serif text-xl leading-relaxed text-[var(--color-ink-2)]">
              Stiamo aggiungendo i posti particolari di {node.name}. Iscriviti alla newsletter per
              non perderli.
            </p>
            <Link
              to="/lead-magnet"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Iscriviti alla newsletter
              <ArrowRight size={15} />
            </Link>
          </section>
        )}

        <div className="mt-24" />
      </div>
    </PageLayout>
  );
}

function DestinationMeta({ count }: { count: number }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/75">
      <span>
        {count} {count === 1 ? 'posto' : 'posti'}
      </span>
      <span aria-hidden="true" className="text-white/40">
        ·
      </span>
      <span>Rodrigo & Betta</span>
    </div>
  );
}

// ─── Landing regione legacy (invariata) — back-compat inbound links ──────────

const PILLAR_CATEGORIES = new Set(['Guide', 'Guida', 'Hotel con carattere', 'Posti particolari']);

const ITINERARY_CATEGORIES = new Set([
  'Itinerari completi',
  'Itinerario',
  'Itinerari',
  'Weekend & Day trip',
]);

function classify(articles: ArchiveItem[]) {
  const pillars: ArchiveItem[] = [];
  const itineraries: ArchiveItem[] = [];
  const stories: ArchiveItem[] = [];
  for (const article of articles) {
    if (ITINERARY_CATEGORIES.has(article.category)) {
      itineraries.push(article);
    } else if (PILLAR_CATEGORIES.has(article.category)) {
      pillars.push(article);
    } else {
      stories.push(article);
    }
  }
  return { pillars, itineraries, stories };
}

function LegacyRegionLanding({ region }: { region: RegionMeta }) {
  const articles = useMemo(() => getArticlesByRegion(region.slug), [region.slug]);
  const { pillars, itineraries, stories } = useMemo(() => classify(articles), [articles]);

  const destinationContent = useMemo(() => getContentByRegion(region.name), [region.name]);
  const contentByIntention = useMemo(
    () => groupByIntention(destinationContent),
    [destinationContent]
  );

  const mapMarkers = useMemo(() => {
    const articleIds = new Set(articles.map((a) => a.id));
    return DEMO_ARCHIVE_MAP_MARKERS.filter((marker) => articleIds.has(marker.id));
  }, [articles]);

  const canonical = `${SITE_URL}/destinazione/${region.slug}`;
  const topArticleUrl = `/articolo/${region.topArticleSlug}`;
  const totalArticles = articles.length;
  const showSeeAll = totalArticles > 6;
  const visiblePillars = pillars.slice(0, 6);
  const visibleItineraries = itineraries.slice(0, 6);
  const visibleStories = stories.slice(0, 6);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${region.name} — Travelliniwithus`,
    description: region.chapeau,
    url: canonical,
    inLanguage: 'it-IT',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Travelliniwithus',
      url: SITE_URL,
    },
    about: {
      '@type': 'Place',
      name: region.name,
      address: {
        '@type': 'PostalAddress',
        addressCountry: region.country,
        addressRegion: region.name,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: region.coordinates[1],
        longitude: region.coordinates[0],
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalArticles,
      itemListElement: articles.slice(0, 20).map((article, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}${article.link}`,
        name: article.title,
      })),
    },
  };

  return (
    <PageLayout>
      <SEO
        title={`${region.name} — Le nostre guide e itinerari`}
        description={region.chapeau}
        canonical={canonical}
        image={region.heroImage}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Esplora', url: '/esplora' },
          { name: region.name, url: `/destinazione/${region.slug}` },
        ]}
        jsonLd={collectionJsonLd}
      />

      {/* Hero — cover se disponibile, altrimenti header sand editoriale (come DestinationWorld). */}
      {region.heroImage ? (
        <section className="relative -mt-32 md:-mt-24 h-[55vh] min-h-[440px] w-full overflow-hidden bg-[var(--color-ink)]">
          <OptimizedImage
            src={region.heroImage}
            alt={`${region.name} — destinazione`}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-12 md:pb-16">
            <div className="mx-auto max-w-6xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/85">
                Destinazione
              </p>
              <h1 className="font-serif text-5xl leading-tight text-white md:text-7xl">
                {region.name}
              </h1>
              <p className="mt-5 max-w-2xl font-serif text-lg italic leading-relaxed text-white/90 md:text-xl">
                {region.chapeau}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/75">
                <span>
                  {totalArticles} {totalArticles === 1 ? 'articolo' : 'articoli'}
                </span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span>Rodrigo & Betta</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="-mt-32 md:-mt-24 bg-[var(--color-surface)] pt-40 md:pt-44">
          <div className="mx-auto max-w-6xl px-6 pb-12 md:px-12 md:pb-16">
            <p className="mb-3 text-eyebrow !text-[var(--color-accent-text)]">Destinazione</p>
            <h1 className="font-serif text-5xl leading-tight text-[var(--color-ink)] md:text-7xl">
              {region.name}
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-lg italic leading-relaxed text-[var(--color-ink-2)] md:text-xl">
              {region.chapeau}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
              <span>
                {totalArticles} {totalArticles === 1 ? 'articolo' : 'articoli'}
              </span>
              <span aria-hidden="true" className="text-black/30">
                ·
              </span>
              <span>Rodrigo & Betta</span>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mt-10">
          <Breadcrumbs items={[{ label: 'Esplora', href: '/esplora' }, { label: region.name }]} />
        </div>

        {/* Intro autoriale */}
        <section className="max-w-3xl">
          <p className="font-serif text-lg leading-relaxed text-[var(--color-ink-2)] md:text-xl">
            {region.intro}
          </p>
        </section>

        {/* CTA pillar di partenza */}
        <section className="mt-14 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] p-8 md:p-10">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
            Il nostro pillar di partenza
          </p>
          <h2 className="font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
            La guida completa: {region.name}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)]">
            Il punto di ingresso editoriale per chi non è mai stato — o per chi torna e vuole capire
            dove abbiamo cambiato idea. Indirizzi testati, finestre stagionali e gli errori che
            abbiamo fatto noi per primi.
          </p>
          <Link
            to={topArticleUrl}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            Leggi la guida {region.name}
            <ArrowRight size={15} />
          </Link>
        </section>

        {/* I posti particolari reali, raggruppati per intenzione. */}
        {destinationContent.length > 0 && (
          <section className="mt-20">
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)]" />
              <p className="text-eyebrow">Visti sul campo</p>
            </div>
            <h2 className="mb-10 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              I posti particolari di {region.name}
            </h2>
            <div className="space-y-14">
              {INTENTION_ORDER.map((intention) => {
                const items = contentByIntention[intention];
                if (items.length === 0) return null;
                return (
                  <div key={intention}>
                    <h3 className="mb-6 font-serif text-2xl text-[var(--color-ink)]">
                      {INTENTION_LABEL[intention]}
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <ContentCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {visiblePillars.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              Le nostre guide pillar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePillars.map((article) => (
                <ArchiveCard key={article.id} item={article} variant="editorial" />
              ))}
            </div>
          </section>
        )}

        {visibleItineraries.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              Itinerari pronti
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItineraries.map((article) => (
                <ArchiveCard key={article.id} item={article} variant="editorial" />
              ))}
            </div>
          </section>
        )}

        {visibleStories.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              Storie e reportage
            </h2>
            <ul className="divide-y divide-black/5 border-y border-black/5">
              {visibleStories.map((article) => (
                <li key={article.id}>
                  <Link
                    to={article.link}
                    className="group flex flex-col gap-2 py-6 transition-colors hover:bg-black/[0.02] md:flex-row md:items-baseline md:gap-8"
                  >
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-text)] md:text-3xl">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted-fg)] md:max-w-xl">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    {article.city && (
                      <p className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted-fg)]">
                        <MapPin size={11} />
                        {article.city.split(',')[0]}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {totalArticles === 0 && (
          <section className="mt-20 rounded-[var(--radius-lg)] border border-dashed border-black/15 bg-[var(--color-surface)] p-10 text-center">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted-fg)]">
              In arrivo
            </p>
            <p className="mt-3 max-w-xl mx-auto font-serif text-xl leading-relaxed text-[var(--color-ink-2)]">
              Stiamo lavorando ai primi articoli su {region.name}. Iscriviti alla newsletter per
              ricevere il pillar appena pubblicato.
            </p>
            <Link
              to="/lead-magnet"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Iscriviti alla newsletter
              <ArrowRight size={15} />
            </Link>
          </section>
        )}

        {showSeeAll && (
          <section className="mt-12">
            <Link
              to={`/esplora?q=${encodeURIComponent(region.name)}`}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              Vedi tutti gli articoli su {region.name}
              <ArrowRight size={15} />
            </Link>
          </section>
        )}

        {mapMarkers.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
              Dove ci siamo stati
            </h2>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-black/5 bg-white">
              <InteractiveMap
                markers={mapMarkers}
                center={region.coordinates}
                zoom={4}
                interactiveCountries={false}
                className="h-[400px] w-full md:h-[500px]"
              />
            </div>
          </section>
        )}

        <div className="mt-24" />
      </div>
    </PageLayout>
  );
}
