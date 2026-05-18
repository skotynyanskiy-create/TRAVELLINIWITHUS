/**
 * Centralized affiliate-link builder for Travelliniwithus.
 *
 * Goal: every outbound affiliate URL passes through this module so we get
 *   - consistent UTM tagging,
 *   - automatic injection of the partner ID (once approved),
 *   - a single place to disable/enable a partner during the signup pipeline,
 *   - a single place to add `rel="sponsored noopener"` semantics at call-site.
 *
 * Env vars are intentionally `VITE_` (public) — affiliate IDs are
 * semi-public by design (visible in outbound URLs). This is NOT a leak risk;
 * see docs/SECURITY.md for the distinction vs. server-only secrets.
 *
 * Status (2026-05-15): all partners DISABLED until owner completes the
 * affiliate signup (F1.9 in the 10/10 transformation plan). When disabled,
 * the builder returns the bare base URL with no UTM noise — safe to ship.
 */

export type AffiliatePartner = 'skyscanner' | 'booking' | 'airalo' | 'revolut';

interface PartnerConfig {
  readonly baseUrl: string;
  readonly partnerParam: string;
  readonly partnerId: string;
  readonly enabled: boolean;
  readonly displayName: string;
}

const env = import.meta.env as Record<string, string | undefined>;

const PARTNERS: Record<AffiliatePartner, PartnerConfig> = {
  skyscanner: {
    baseUrl: 'https://www.skyscanner.it',
    partnerParam: 'associateid',
    partnerId: env.VITE_AFFILIATE_SKYSCANNER_ID ?? '',
    enabled: Boolean(env.VITE_AFFILIATE_SKYSCANNER_ID),
    displayName: 'Skyscanner',
  },
  booking: {
    baseUrl: 'https://www.booking.com',
    partnerParam: 'aid',
    partnerId: env.VITE_AFFILIATE_BOOKING_ID ?? '',
    enabled: Boolean(env.VITE_AFFILIATE_BOOKING_ID),
    displayName: 'Booking.com',
  },
  airalo: {
    baseUrl: 'https://www.airalo.com',
    partnerParam: 'ref',
    partnerId: env.VITE_AFFILIATE_AIRALO_ID ?? '',
    enabled: Boolean(env.VITE_AFFILIATE_AIRALO_ID),
    displayName: 'Airalo',
  },
  revolut: {
    baseUrl: 'https://www.revolut.com',
    partnerParam: 'referral',
    partnerId: env.VITE_AFFILIATE_REVOLUT_ID ?? '',
    enabled: Boolean(env.VITE_AFFILIATE_REVOLUT_ID),
    displayName: 'Revolut',
  },
};

export interface AffiliateLinkParams {
  partner: AffiliatePartner;
  /** Path appended to the partner base URL, e.g. "/hotel/it/masseria-salento.html" */
  path?: string;
  /** Override default utm_source (rare — default = travelliniwithus) */
  utmSource?: string;
  /** Override default utm_medium (default = affiliate) */
  utmMedium?: string;
  /** Campaign slug. Required for meaningful attribution. */
  utmCampaign: string;
  /** Position in the page that fired the click. E.g. "article-inline-1", "sidebar-cta", "lead-magnet-p3". */
  utmContent?: string;
  /** Additional query params merged at the end (partner-specific overrides). */
  extraParams?: Record<string, string>;
}

/**
 * Build a fully-qualified affiliate URL.
 *
 * Behavior when the partner is disabled (no env var present):
 *   returns `${baseUrl}${path}` with NO UTM and NO partnerId.
 *   This keeps the link working and avoids broken UTM-only URLs in production.
 */
export function buildAffiliateLink(params: AffiliateLinkParams): string {
  const config = PARTNERS[params.partner];
  const targetUrl = new URL(config.baseUrl + (params.path ?? ''));

  if (!config.enabled || !config.partnerId) {
    return targetUrl.toString();
  }

  targetUrl.searchParams.set(config.partnerParam, config.partnerId);
  targetUrl.searchParams.set('utm_source', params.utmSource ?? 'travelliniwithus');
  targetUrl.searchParams.set('utm_medium', params.utmMedium ?? 'affiliate');
  targetUrl.searchParams.set('utm_campaign', params.utmCampaign);
  if (params.utmContent) {
    targetUrl.searchParams.set('utm_content', params.utmContent);
  }
  if (params.extraParams) {
    for (const [key, value] of Object.entries(params.extraParams)) {
      targetUrl.searchParams.set(key, value);
    }
  }
  return targetUrl.toString();
}

/** Check if a given partner is ready for live affiliate links. */
export function isAffiliateEnabled(partner: AffiliatePartner): boolean {
  const config = PARTNERS[partner];
  return config.enabled && Boolean(config.partnerId);
}

/** Human-readable name for the partner (used in disclosures & UI). */
export function getPartnerName(partner: AffiliatePartner): string {
  return PARTNERS[partner].displayName;
}

/** Recommended anchor attributes for affiliate links (FTC + Google compliance). */
export const AFFILIATE_ANCHOR_ATTRS = {
  target: '_blank',
  rel: 'sponsored noopener noreferrer',
} as const;
