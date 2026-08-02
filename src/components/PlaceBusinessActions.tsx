import React, { useState } from 'react';
import {
  Navigation,
  ExternalLink,
  Phone,
  CalendarCheck,
  Share2,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import type { ContentItem } from '../types/content';
import {
  calculateHaversineDistance,
  formatGeoDistance,
  getGoogleMapsDirectionsUrl,
  type UserLocation,
} from '../utils/geo';
import { shareContent } from '../utils/share';
import { trackAffiliateClick } from '../utils/affiliate';
import { buildGoogleMapsListingUrl, getBookingProviderFromUrl } from '../utils/placeLinks';
import { SITE_URL } from '../config/site';
import { trackEvent } from '../services/analytics';

export interface PlaceBusinessActionsProps {
  item: ContentItem;
  userLocation?: UserLocation | null;
  className?: string;
  variant?: 'card' | 'full' | 'compact';
  /**
   * Il componente nasce per fondi chiari e usa `--color-ink` per il testo.
   * Nel cassetto della mappa il fondo e' nero: senza questo flag «Condividi»
   * era testo `rgb(10,10,10)` su nero, cioe' invisibile (rapporto ~1:1).
   */
  suFondoScuro?: boolean;
}

export const PlaceBusinessActions: React.FC<PlaceBusinessActionsProps> = ({
  item,
  userLocation,
  className = '',
  variant = 'full',
  suFondoScuro = false,
}) => {
  const [copied, setCopied] = useState(false);

  const coordinates = item.place.coordinates;
  const distanceKm =
    userLocation && coordinates
      ? calculateHaversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordinates.lat,
          coordinates.lng
        )
      : null;

  const directionsUrl = coordinates
    ? getGoogleMapsDirectionsUrl({
        lat: coordinates.lat,
        lng: coordinates.lng,
        address: item.place.googlePlaceQuery || `${item.place.name}, ${item.place.city ?? ''}`,
      })
    : buildGoogleMapsListingUrl({
        name: item.place.name,
        city: item.place.city,
        googlePlaceQuery: item.place.googlePlaceQuery,
      });

  const listingUrl = buildGoogleMapsListingUrl({
    name: item.place.name,
    city: item.place.city,
    googlePlaceQuery: item.place.googlePlaceQuery,
  });

  const handleDirectionsClick = () => {
    trackEvent('place_directions_click', {
      place_id: item.id,
      has_coordinates: Boolean(coordinates),
    });
  };

  const handleListingClick = () => {
    trackEvent('place_google_listing_click', { place_id: item.id });
  };

  const handlePhoneClick = () => {
    trackEvent('place_phone_click', { place_id: item.id });
  };

  const handleShareClick = async () => {
    const url = `${SITE_URL}/posto/${item.id}`;
    trackEvent('place_share_click', {
      place_id: item.id,
      method: typeof navigator !== 'undefined' && navigator.share ? 'native' : 'clipboard',
    });

    const success = await shareContent({
      title: item.title,
      text: item.description || item.hook,
      url,
    });

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const bookingProvider = item.place.bookingUrl
    ? getBookingProviderFromUrl(item.place.bookingUrl)
    : 'unknown';

  const trackedBookingUrl = item.place.bookingUrl
    ? trackAffiliateClick(bookingProvider, item.place.bookingUrl, 'posto_detail')
    : undefined;

  const handleBookingClick = () => {
    trackEvent('place_booking_click', {
      place_id: item.id,
      provider: bookingProvider,
    });
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {distanceKm !== null && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent-text)] dark:bg-amber-500/20">
            <MapPin size={13} aria-hidden />
            {formatGeoDistance(distanceKm)}
          </span>
        )}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleDirectionsClick}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            suFondoScuro
              ? 'bg-white text-[var(--color-ink)] hover:bg-white/85'
              : 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent-hover)]'
          }`}
        >
          <Navigation size={12} aria-hidden /> Indicazioni
        </a>
        <button
          type="button"
          onClick={handleShareClick}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            suFondoScuro
              ? 'border-white/30 text-white hover:border-white/60'
              : 'border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]'
          }`}
        >
          {copied ? <CheckCircle size={12} /> : <Share2 size={12} />}
          {copied ? 'Copiato' : 'Condividi'}
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {distanceKm !== null && (
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-[var(--color-accent-text)]">
          <MapPin size={14} className="shrink-0" aria-hidden />
          <span>Posto a {formatGeoDistance(distanceKm)}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleDirectionsClick}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          <Navigation size={14} aria-hidden /> Indicazioni Maps
        </a>

        {trackedBookingUrl && (
          <a
            href={trackedBookingUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={handleBookingClick}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            <CalendarCheck size={14} aria-hidden /> Prenota
          </a>
        )}

        <a
          href={listingUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleListingClick}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          <ExternalLink size={14} aria-hidden /> Scheda Google Business
        </a>

        {item.place.phone && (
          <a
            href={`tel:${item.place.phone.replace(/\s+/g, '')}`}
            onClick={handlePhoneClick}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            <Phone size={14} aria-hidden /> {item.place.phone}
          </a>
        )}

        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Condividi questo posto"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          {copied ? <CheckCircle size={14} aria-hidden /> : <Share2 size={14} aria-hidden />}
          {copied ? 'Link copiato' : 'Condividi'}
        </button>
      </div>
    </div>
  );
};

export default PlaceBusinessActions;
