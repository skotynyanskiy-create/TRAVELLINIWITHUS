/**
 * Utility affiliate tracking per Travelliniwithus.
 * Connette i builder di link di affiliazione con la tracciabilità analytics.
 */

import { trackEvent } from '../services/analytics';
import {
  buildAffiliateLink,
  isAffiliateEnabled,
  type AffiliatePartner,
} from '../lib/affiliateLink';

const KNOWN_PARTNERS: AffiliatePartner[] = [
  'skyscanner',
  'booking',
  'airalo',
  'revolut',
  'heymondo',
  'getyourguide',
];

/**
 * Traccia un click su un link di affiliazione via analytics e restituisce l'URL di destinazione
 * arricchito con parametri UTM e partner ID.
 *
 * @param partner Il nome del partner (es. 'booking', 'getyourguide', 'heymondo')
 * @param originalUrl L'URL originale o il percorso di destinazione
 * @param campaign Lo slug della campagna (default: 'posto_detail')
 * @returns L'URL pronto per la navigazione con i parametri di tracciamento
 */
export function trackAffiliateClick(
  partner: string,
  originalUrl: string,
  campaign: string = 'posto_detail'
): string {
  trackEvent('affiliate_click', {
    partner,
    original_url: originalUrl,
    campaign,
  });

  const normalizedPartner = partner.toLowerCase() as AffiliatePartner;

  if (KNOWN_PARTNERS.includes(normalizedPartner)) {
    try {
      const parsedUrl = new URL(originalUrl);
      parsedUrl.searchParams.set('utm_source', 'travelliniwithus');
      parsedUrl.searchParams.set('utm_medium', 'affiliate');
      parsedUrl.searchParams.set('utm_campaign', campaign);
      return parsedUrl.toString();
    } catch {
      return buildAffiliateLink({
        partner: normalizedPartner,
        path: originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`,
        utmCampaign: campaign,
      });
    }
  }

  try {
    const parsedUrl = new URL(originalUrl);
    parsedUrl.searchParams.set('utm_source', 'travelliniwithus');
    parsedUrl.searchParams.set('utm_medium', 'affiliate');
    parsedUrl.searchParams.set('utm_campaign', campaign);
    return parsedUrl.toString();
  } catch {
    return originalUrl;
  }
}

export { isAffiliateEnabled };
