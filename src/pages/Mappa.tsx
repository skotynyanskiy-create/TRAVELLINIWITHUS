import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import InteractiveMap from '../components/InteractiveMap';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { DEMO_ARTICLE_MARKERS } from '../config/demoContent';
import { siteContentDefaults } from '../config/siteContent';
import { SITE_URL } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchArticles } from '../services/firebaseService';
import { getPublicArticlePath } from '../utils/articleRoutes';

interface BuiltMarker {
  id: string;
  name: string;
  coordinates: [number, number];
  title?: string;
  image?: string;
  category?: string;
  link?: string;
  country?: string;
}

const PAGE_URL = `${SITE_URL}/mappa`;

export default function MappaPage() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;

  const { data: articles = [] } = useQuery({
    queryKey: ['mappa-articles'],
    queryFn: fetchArticles,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCountry = searchParams.get('country') ?? 'Tutti';

  const markers = useMemo<BuiltMarker[]>(() => {
    const fromArticles = articles
      .map<BuiltMarker | null>((article) => {
        const center = article.mapCenter ?? article.mapMarkers?.[0]?.coordinates;
        if (!center) return null;
        return {
          id: article.id,
          name: article.location?.split(',')[0]?.trim() || article.title,
          title: article.title,
          coordinates: center,
          image: article.image,
          category: article.category,
          country: article.country,
          link: getPublicArticlePath({
            slug: article.slug,
            category: article.category,
            type: article.type,
          }),
        };
      })
      .filter((m): m is BuiltMarker => m !== null);

    if (fromArticles.length > 0) return fromArticles;

    if (demoSettings.showDestinationDemo) {
      return DEMO_ARTICLE_MARKERS.map<BuiltMarker>((m) => ({
        id: m.id,
        name: m.name,
        title: m.title,
        coordinates: m.coordinates,
        image: m.image,
        category: m.category,
        link: m.link,
      }));
    }

    return [];
  }, [articles, demoSettings.showDestinationDemo]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    for (const m of markers) {
      if (m.country) set.add(m.country);
    }
    return ['Tutti', ...Array.from(set).sort()];
  }, [markers]);

  const filteredMarkers = useMemo(() => {
    if (selectedCountry === 'Tutti') return markers;
    return markers.filter((m) => m.country === selectedCountry);
  }, [markers, selectedCountry]);

  const handleCountryChange = (next: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (next === 'Tutti') {
      newParams.delete('country');
    } else {
      newParams.set('country', next);
    }
    setSearchParams(newParams, { replace: true });
  };

  return (
    <PageLayout>
      <SEO
        title="La nostra mappa — tutti i posti che abbiamo raccontato"
        description="Esplora su mappa interattiva tutte le destinazioni, gli hotel e i posti particolari raccontati su Travelliniwithus. Filtra per paese."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Mappa', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs items={[{ label: 'Mappa' }]} />

          <div className="mt-8 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Esplora su mappa
            </p>
            <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
              I posti che <span className="italic text-black/55">stiamo raccontando</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
              Una mappa di tutto quello che abbiamo visitato e salvato — destinazioni, hotel, luoghi
              particolari. Si allarga solo quando un posto ha abbastanza da dire per meritare un
              racconto completo, non una scheda copiata.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-black/70">
              <MapPin size={12} className="text-accent" />
              {filteredMarkers.length}{' '}
              {filteredMarkers.length === 1 ? 'destinazione raccontata' : 'destinazioni raccontate'}
            </span>
            {availableCountries.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                {availableCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleCountryChange(country)}
                    className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                      country === selectedCountry
                        ? 'border-ink bg-ink text-white'
                        : 'border-black/10 bg-white text-black/70 hover:border-accent hover:text-accent-text'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="wide">
        <div className="overflow-hidden rounded-4xl border border-black/5 bg-white shadow-sm">
          <InteractiveMap markers={filteredMarkers} className="h-[500px] w-full md:h-[680px]" />
        </div>

        {filteredMarkers.length === 0 && (
          <div className="mt-10 rounded-4xl border border-black/5 bg-sand p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-text">
              Mappa in costruzione
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/70">
              Stiamo aggiungendo coordinate ai posti via via che pubblichiamo i racconti completi.
              Intanto puoi sfogliare le destinazioni dall'archivio.
            </p>
            <Link
              to="/destinazioni"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
            >
              Esplora le destinazioni
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
