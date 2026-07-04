import { useParams, Navigate } from 'react-router-dom';
import { ExternalLink, MapPin, Play } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import ReviewBlock from '../components/ReviewBlock';
import RatingPill from '../components/RatingPill';
import { Link } from '@/src/components/TransitionLink';
import { getContentById } from '../config/contentLibrary';
import { SITE_URL } from '../config/site';
import type { ContentType } from '../config/contentTaxonomy';
import type { PartnershipKind } from '../types/content';

/** Gradiente saturo per tipo canonical — identico a ContentCard per coerenza visiva. */
const TYPE_GRADIENT: Record<ContentType | '_default', string> = {
  'Food & Ristoranti': 'linear-gradient(145deg, #b45309 0%, #dc2626 100%)',
  'Hotel con carattere': 'linear-gradient(145deg, #0f4c81 0%, #1e3a5f 100%)',
  Insolito: 'linear-gradient(145deg, #6d28d9 0%, #be185d 100%)',
  'Passeggiate panoramiche': 'linear-gradient(145deg, #065f46 0%, #0f766e 100%)',
  'Relax, terme e spa': 'linear-gradient(145deg, #0e7490 0%, #0c4a6e 100%)',
  'Posti particolari': 'linear-gradient(145deg, #92400e 0%, #b45309 100%)',
  "Borghi e città d'arte": 'linear-gradient(145deg, #7c3aed 0%, #4338ca 100%)',
  'Weekend romantici': 'linear-gradient(145deg, #9d174d 0%, #c2410c 100%)',
  _default: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)',
};

const PARTNERSHIP_LABEL: Record<PartnershipKind, string> = {
  organic: '',
  adv: 'ADV',
  invited: 'Su invito',
  gifted: 'Gifted',
  collaboration: 'In collaborazione',
  affiliate: 'Affiliato',
};

/** Mappa types[0] → @type Schema.org per il JSON-LD della pagina-posto. */
const TYPE_SCHEMA: Record<ContentType | '_default', string> = {
  'Food & Ristoranti': 'Restaurant',
  'Hotel con carattere': 'LodgingBusiness',
  'Relax, terme e spa': 'HealthAndBeautyBusiness',
  Insolito: 'TouristAttraction',
  'Passeggiate panoramiche': 'TouristAttraction',
  'Posti particolari': 'TouristAttraction',
  "Borghi e città d'arte": 'TouristAttraction',
  'Weekend romantici': 'TouristAttraction',
  _default: 'TouristAttraction',
};

export default function Posto() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getContentById(slug) : undefined;

  if (!item) {
    return <Navigate to="/esplora" replace />;
  }

  const canonical = `${SITE_URL}/posto/${item.id}`;
  const coverGradient = TYPE_GRADIENT[item.types[0]] ?? TYPE_GRADIENT._default;
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];

  const placeLabel = [item.place.city, item.place.region, item.place.country]
    .filter(Boolean)
    .join(', ');

  const schemaType = TYPE_SCHEMA[item.types[0]] ?? TYPE_SCHEMA._default;

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: item.title,
    description: item.description,
    url: canonical,
    inLanguage: 'it-IT',
    address: {
      '@type': 'PostalAddress',
      addressLocality: item.place.city ?? item.place.region ?? '',
      addressRegion: item.place.region ?? '',
      addressCountry: item.place.country,
    },
    ...(item.cover ? { image: item.cover } : {}),
    ...(item.place.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: item.place.coordinates.lat,
            longitude: item.place.coordinates.lng,
          },
        }
      : {}),
    // Recensione EDITORIALE di prima parte (Travelliniwithus recensisce il
    // posto). NON usiamo aggregateRating: sarebbe un rating self-authored su
    // un'attività terza — vietato dalle policy Google structured-data e segnale
    // da content-farm. Un Review con author=Organization è corretto e onesto.
    ...(item.review?.overall != null
      ? {
          review: {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: item.review.overall,
              bestRating: 10,
              worstRating: 0,
            },
            author: { '@type': 'Organization', name: 'Travelliniwithus' },
            ...(item.review.summary ? { reviewBody: item.review.summary } : {}),
          },
        }
      : {}),
  };

  return (
    <PageLayout>
      <SEO
        title={`${item.hook} — ${item.title}`}
        description={item.description}
        canonical={canonical}
        image={item.cover || undefined}
        jsonLd={placeJsonLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Esplora', url: '/esplora' },
          { name: item.title, url: `/posto/${item.id}` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Esplora', href: '/esplora' }, { label: item.title }]} />

        {/* Cover / hero */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-ink)]">
          {item.cover ? (
            <img src={item.cover} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full flex-col justify-end p-8"
              style={{ background: coverGradient }}
            >
              <p className="font-serif text-2xl leading-snug text-white drop-shadow-sm md:text-3xl">
                {item.hook}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                {placeLabel}
              </p>
            </div>
          )}

          {/* Badge tipo */}
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink)] backdrop-blur-md">
            {item.types[0]}
          </span>

          {/* Badge partnership */}
          {partnerLabel && (
            <span className="absolute right-4 top-4 rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              {partnerLabel}
            </span>
          )}

          {/* Pulsante play — linka al reel IG */}
          <a
            href={item.permalink}
            target="_blank"
            rel="noreferrer"
            aria-label="Guarda il reel su Instagram"
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40 transition-transform hover:scale-110">
              <Play size={28} className="translate-x-0.5 text-white" fill="white" />
            </span>
          </a>
        </div>

        {/* Corpo editoriale */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            {/* h1 = hook */}
            <h1 className="font-serif text-4xl leading-tight text-[var(--color-ink)] md:text-5xl">
              {item.hook}
            </h1>

            {/* Luogo + voto redazionale */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)]">
                <MapPin size={14} />
                {placeLabel}
              </p>
              <RatingPill overall={item.review?.overall} />
            </div>

            {/* Descrizione */}
            {item.description && (
              <p className="mt-6 text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
                {item.description}
              </p>
            )}

            {/* Scheda redazionale — solo se ci sono dati reali */}
            <ReviewBlock review={item.review} placeName={item.place?.name} />

            {/* CTA reel */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={item.permalink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                <Play size={14} fill="currentColor" /> Guarda il reel
              </a>
              {item.place.coordinates ? (
                <Link
                  to={`/mappa`}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <MapPin size={14} /> Apri sulla mappa
                </Link>
              ) : (
                <Link
                  to="/esplora"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <ExternalLink size={14} /> Esplora altri posti
                </Link>
              )}
            </div>
          </div>

          {/* Riquadro valore — solo se c'è price o description */}
          {(item.value?.price || item.description) && (
            <aside className="w-full shrink-0 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] p-6 md:w-64">
              {item.value?.price && (
                <div className="mb-4 border-b border-black/5 pb-4">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    Prezzo indicativo
                  </p>
                  <p className="font-serif text-2xl font-medium text-[var(--color-ink)]">
                    {item.value.price}
                  </p>
                  {item.value.budget && (
                    <p className="mt-1 text-[11px] text-[var(--color-muted-fg)]">
                      Budget: {item.value.budget}
                    </p>
                  )}
                </div>
              )}
              {item.description && (
                <>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    Vale la pena?
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-ink-2)]">
                    {item.description}
                  </p>
                </>
              )}
            </aside>
          )}
        </div>

        {/* Strip newsletter */}
        <div className="mt-20">
          <Newsletter
            variant="compact"
            source={`posto_${item.id}`}
            title="Ricevi i prossimi posti da salvare."
            stacked
          />
        </div>

        <div className="mt-24" />
      </div>
    </PageLayout>
  );
}
