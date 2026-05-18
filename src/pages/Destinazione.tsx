import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import ArchiveCard from '../components/discovery/ArchiveCard';
import InteractiveMap from '../components/InteractiveMap';
import OptimizedImage from '../components/OptimizedImage';
import NotFound from './NotFound';
import { SITE_URL } from '../config/site';
import { DEMO_ARCHIVE_MAP_MARKERS } from '../config/demoArchive';
import { getArticlesByRegion, getRegionMeta } from '../lib/regions';
import type { ArchiveItem } from '../utils/contentArchive';

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

export default function Destinazione() {
  const { regionSlug } = useParams<{ regionSlug: string }>();
  const region = regionSlug ? getRegionMeta(regionSlug) : undefined;

  const articles = useMemo(() => (region ? getArticlesByRegion(region.slug) : []), [region]);

  const { pillars, itineraries, stories } = useMemo(() => classify(articles), [articles]);

  const mapMarkers = useMemo(() => {
    const articleIds = new Set(articles.map((a) => a.id));
    return DEMO_ARCHIVE_MAP_MARKERS.filter((marker) => articleIds.has(marker.id));
  }, [articles]);

  if (!region) {
    return <NotFound />;
  }

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

      {/* Hero — medium height (55vh) per segnalare "indice di regione" vs pillar 85vh. */}
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
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
            Il nostro pillar di partenza
          </p>
          <h2 className="font-serif text-3xl text-[var(--color-ink)] md:text-4xl">
            La guida completa: {region.name}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)]">
            Il punto di ingresso editoriale per chi non e' mai stato — o per chi torna e vuole
            capire dove abbiamo cambiato idea. Indirizzi testati, finestre stagionali e gli errori
            che abbiamo fatto noi per primi.
          </p>
          <Link
            to={topArticleUrl}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            Leggi la guida {region.name}
            <ArrowRight size={15} />
          </Link>
        </section>

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
