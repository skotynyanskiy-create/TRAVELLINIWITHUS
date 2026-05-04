import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Hourglass } from 'lucide-react';
import DestinationHubLayout from '../components/hub/DestinationHubLayout';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { countMatchingArticles, getDestinationHub, isHubVisible } from '../config/destinationHubs';
import { SITE_URL } from '../config/site';
import { fetchArticles } from '../services/firebaseService';
import NotFound from './NotFound';

interface DestinationHubPageProps {
  /** Se passato, bypassa useParams (compat con route legacy o uso esplicito). */
  country?: string;
}

export default function DestinationHubPage({ country }: DestinationHubPageProps) {
  const params = useParams();
  const countrySlug = country || params.country || '';
  const regionSlug = params.region;
  const lookupKey = regionSlug ? `${countrySlug}/${regionSlug}` : countrySlug;
  const hub = getDestinationHub(lookupKey);

  // Solo per hub regionali serve la query (paesi top-level sono sempre visibili).
  const isRegional = Boolean(hub?.parent);
  const { data: articles = [] } = useQuery({
    queryKey: ['hub-articles', lookupKey],
    queryFn: fetchArticles,
    enabled: isRegional,
    staleTime: 5 * 60 * 1000,
  });

  if (!hub) {
    return <NotFound />;
  }

  if (isRegional) {
    const matchCount = countMatchingArticles(hub, articles);
    const visible = isHubVisible(hub, matchCount);
    if (!visible) {
      return <RegionalHubComingSoon hubName={hub.country} parentSlug={hub.parent ?? 'italia'} />;
    }
  }

  return <DestinationHubLayout hub={hub} />;
}

interface ComingSoonProps {
  hubName: string;
  parentSlug: string;
}

function RegionalHubComingSoon({ hubName, parentSlug }: ComingSoonProps) {
  const parentHref = `/destinazioni/${parentSlug}`;
  const pageUrl = `${SITE_URL}/destinazioni/${parentSlug}/${hubName.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <PageLayout>
      <SEO
        title={`${hubName} — In arrivo su Travelliniwithus`}
        description={`Stiamo costruendo la guida completa di ${hubName}. Lasciaci la tua email e ti avviseremo quando i primi articoli saranno online.`}
        canonical={pageUrl}
        noindex
      />

      <section className="bg-sand pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
            <Hourglass size={12} />
            In arrivo
          </span>
          <h1 className="mt-8 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
            {hubName} <span className="italic text-black/55">arriva presto</span>.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
            Stiamo lavorando alla guida completa di {hubName}: itinerari testati, indirizzi
            verificati, hotel scelti. Pubblichiamo solo quando il livello e quello che vorremmo
            trovare anche noi. Lasciaci la tua email e ti scriviamo quando il primo pezzo e online.
          </p>

          <div className="mt-12 mx-auto max-w-md">
            <Newsletter
              variant="compact"
              source={`region_coming_soon_${hubName.toLowerCase().replace(/\s+/g, '_')}`}
            />
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <Link
              to={parentHref}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-accent"
            >
              Torna al hub paese
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/destinazioni"
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/55 transition-colors hover:text-accent-text"
            >
              Esplora tutte le destinazioni
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
