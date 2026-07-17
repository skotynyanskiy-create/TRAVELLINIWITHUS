import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  ExternalLink,
  MapPin,
  Play,
  Navigation,
  Clock,
  Phone,
  CalendarCheck,
  Heart,
  Share2,
  CheckCircle,
} from 'lucide-react';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Newsletter from '../components/Newsletter';
import ReviewBlock from '../components/ReviewBlock';
import RatingPill from '../components/RatingPill';
import DealCard from '../components/DealCard';
import PostNavigation from '../components/PostNavigation';
import { Link } from '@/src/components/TransitionLink';
import { getContentById } from '../config/contentLibrary';
import { findDestinationByRegionName, getDestinationUrl } from '../config/destinations';
import { SITE_URL } from '../config/site';
import { useFavorites } from '../context/FavoritesContext';
import { trackEvent } from '../services/analytics';
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsListingUrl,
  getBookingProviderFromUrl,
} from '../utils/placeLinks';
import type { ContentType } from '../config/contentTaxonomy';
import { PARTNERSHIP_LABEL } from '../types/content';

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
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  if (!item) {
    return <Navigate to="/esplora" replace />;
  }

  const canonical = `${SITE_URL}/posto/${item.id}`;
  const coverGradient = TYPE_GRADIENT[item.types[0]] ?? TYPE_GRADIENT._default;
  const partnerLabel = PARTNERSHIP_LABEL[item.partnership.kind];

  const placeLabel = [item.place.city, item.place.region, item.place.country]
    .filter(Boolean)
    .join(', ');
  const placeDetailLabel = [item.place.name, placeLabel].filter(Boolean).join(' — ');

  const schemaType = TYPE_SCHEMA[item.types[0]] ?? TYPE_SCHEMA._default;

  const saved = isFavorite(item.id);
  const coordinates = item.place.coordinates;
  const directionsUrl = buildGoogleMapsDirectionsUrl({
    name: item.place.name,
    city: item.place.city,
    coordinates,
    googlePlaceQuery: item.place.googlePlaceQuery,
  });
  const listingUrl = buildGoogleMapsListingUrl({
    name: item.place.name,
    city: item.place.city,
    googlePlaceQuery: item.place.googlePlaceQuery,
  });
  const mapPinUrl = coordinates ? `/mappa?place=${encodeURIComponent(item.id)}` : undefined;
  const bookingLabel = item.types[0] === 'Food & Ristoranti' ? 'Prenota un tavolo' : 'Prenota';

  const handleDirectionsClick = () => {
    trackEvent('place_directions_click', {
      place_id: item.id,
      has_coordinates: Boolean(coordinates),
    });
  };

  const handleGoogleListingClick = () => {
    trackEvent('place_google_listing_click', { place_id: item.id });
  };

  const handleBookingClick = () => {
    trackEvent('place_booking_click', {
      place_id: item.id,
      provider: item.place.bookingUrl
        ? getBookingProviderFromUrl(item.place.bookingUrl)
        : 'unknown',
    });
  };

  const handlePhoneClick = () => {
    trackEvent('place_phone_click', { place_id: item.id });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(item.id);
    if (!saved) {
      trackEvent('place_favorite_add', { place_id: item.id, source: 'posto' });
    }
  };

  const handleShare = async () => {
    const method = navigator.share ? 'native' : 'copy';
    trackEvent('place_share_click', { place_id: item.id, method });

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, url: canonical });
      } catch {
        // condivisione annullata dall'utente — nessuna azione
      }
    } else {
      await navigator.clipboard.writeText(canonical);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Link alla pagina destinazione della regione/paese — solo se il nodo esiste
  // nell'albero destinations (regioni italiane + paesi). Altrimenti testo semplice.
  const destNode =
    findDestinationByRegionName(item.place.region ?? '') ??
    findDestinationByRegionName(item.place.country ?? '');
  const destUrl = destNode ? getDestinationUrl(destNode) : undefined;

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
    ...(item.deal
      ? {
          offers: {
            '@type': 'Offer',
            url: item.deal.url,
            availability: 'https://schema.org/InStock',
            ...(item.deal.validUntil ? { priceValidUntil: item.deal.validUntil } : {}),
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
        // Pass di onestà: i posti placeholder restano visibili ma NON indicizzati
        // (evita thin-content su ~40 pagine finte). Reversibile: quando l'import
        // Instagram porta il dato reale (isPlaceholder:false) tornano indicizzabili.
        noindex={item.isPlaceholder}
        jsonLd={placeJsonLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Esplora', url: '/esplora' },
          ...(destNode && destUrl ? [{ name: destNode.name, url: destUrl }] : []),
          { name: item.title, url: `/posto/${item.id}` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <Breadcrumbs
          items={[
            { label: 'Esplora', href: '/esplora' },
            ...(destNode && destUrl ? [{ label: destNode.name, href: destUrl }] : []),
            { label: item.title },
          ]}
        />

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
          {/* Overlay play decorativo (mouse-hover): aria-hidden + non-focusabile,
              così la stessa destinazione non crea un secondo tab stop. Il link
              accessibile è il CTA visibile "Guarda il reel" più sotto. */}
          <a
            href={item.permalink}
            target="_blank"
            rel="noreferrer"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
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
              {destUrl ? (
                <Link
                  to={destUrl}
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)] underline-offset-4 transition-colors hover:underline"
                >
                  <MapPin size={14} />
                  {placeLabel}
                </Link>
              ) : (
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)]">
                  <MapPin size={14} />
                  {placeLabel}
                </p>
              )}
              <RatingPill overall={item.review?.overall} />
            </div>

            {/* Riga Salva / Condividi — leggera, fuori dalla card Info pratiche */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-ink-2)]">
                Salvalo, o mandalo a chi ci deve venire.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  aria-pressed={saved}
                  aria-label={saved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
                  className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:flex-none ${
                    saved
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  <Heart size={14} className={saved ? 'fill-current' : ''} aria-hidden />
                  {saved ? 'Salvato' : 'Salva'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Condividi questo posto"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 sm:flex-none"
                >
                  {copied ? (
                    <CheckCircle size={14} aria-hidden />
                  ) : (
                    <Share2 size={14} aria-hidden />
                  )}
                  {copied ? 'Link copiato' : 'Condividi'}
                </button>
              </div>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Link copiato negli appunti' : ''}
              </span>
            </div>

            {/* Card "Info pratiche" — Dove + Orari e contatti */}
            <section
              aria-label="Info pratiche"
              className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8"
            >
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {/* DOVE */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    Dove si trova
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-sm text-[var(--color-ink-2)]">
                    <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
                    {placeDetailLabel}
                  </p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleDirectionsClick}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:w-auto"
                  >
                    <Navigation size={14} aria-hidden /> Indicazioni
                  </a>
                  {mapPinUrl && (
                    <Link
                      to={mapPinUrl}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-2)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    >
                      <MapPin size={14} aria-hidden /> Apri sulla mappa
                    </Link>
                  )}
                </div>

                {/* ORARI E CONTATTI */}
                <div className="border-t border-[var(--color-border)] pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    <Clock size={13} aria-hidden /> Orari e contatti
                  </p>

                  {(item.place.hours || item.place.phone) && (
                    <div className="mt-3 space-y-2.5">
                      {item.place.hours && (
                        <p className="flex items-center gap-2 text-sm text-[var(--color-ink-2)]">
                          <Clock size={14} className="shrink-0" aria-hidden /> {item.place.hours}
                        </p>
                      )}
                      {item.place.phone && (
                        <a
                          href={`tel:${item.place.phone.replace(/\s+/g, '')}`}
                          onClick={handlePhoneClick}
                          className="flex items-center gap-2 text-sm text-[var(--color-ink-2)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                        >
                          <Phone size={14} className="shrink-0" aria-hidden /> Chiama ·{' '}
                          {item.place.phone}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.place.bookingUrl && (
                      <a
                        href={item.place.bookingUrl}
                        target="_blank"
                        rel="sponsored noopener"
                        onClick={handleBookingClick}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                      >
                        <CalendarCheck size={14} aria-hidden /> {bookingLabel}
                      </a>
                    )}
                    <a
                      href={listingUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleGoogleListingClick}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    >
                      <ExternalLink size={14} aria-hidden /> Vedi su Google
                    </a>
                  </div>

                  <p className="mt-4 text-[11px] text-[var(--color-muted-fg)]">
                    Orari, telefono e prenotazione sono aggiornati direttamente da Google.
                  </p>
                </div>
              </div>
            </section>

            {/* Descrizione */}
            {item.description && (
              <p className="mt-8 text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
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
            </div>
          </div>

          {/* Colonna destra — valore + offerta, solo se c'è almeno un dato reale */}
          {(item.value?.price || item.description || item.deal) && (
            <div className="w-full shrink-0 space-y-6 md:w-64">
              {(item.value?.price || item.description) && (
                <aside className="w-full rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-surface)] p-6">
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
              <DealCard deal={item.deal} />
            </div>
          )}
        </div>

        {/* Navigazione prev/next tra posti */}
        <PostNavigation currentId={item.id} />

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
