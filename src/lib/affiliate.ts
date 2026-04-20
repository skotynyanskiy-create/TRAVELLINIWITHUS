import { trackEvent } from '../services/analytics';

export type AffiliatePartner =
  | 'booking'
  | 'heymondo'
  | 'skyscanner'
  | 'getyourguide'
  | 'airalo'
  | 'revolut'
  | 'splitwise'
  | 'amazon'
  | 'generic';

interface PartnerMeta {
  /** Nome riconoscibile per dashboard analytics. */
  label: string;
  /** Modello di partnership — per report finanziari/ROI. */
  program: 'affiliate' | 'referral' | 'sponsor' | 'promo-code' | 'none';
  /** Se true il partner accetta UTM query params sui suoi link. */
  acceptsUtm: boolean;
}

export const AFFILIATE_PARTNERS: Record<AffiliatePartner, PartnerMeta> = {
  booking: { label: 'Booking.com', program: 'affiliate', acceptsUtm: true },
  heymondo: { label: 'Heymondo', program: 'affiliate', acceptsUtm: true },
  skyscanner: { label: 'Skyscanner', program: 'affiliate', acceptsUtm: true },
  getyourguide: { label: 'GetYourGuide', program: 'affiliate', acceptsUtm: true },
  airalo: { label: 'Airalo', program: 'promo-code', acceptsUtm: false },
  revolut: { label: 'Revolut', program: 'referral', acceptsUtm: false },
  splitwise: { label: 'Splitwise', program: 'none', acceptsUtm: false },
  amazon: { label: 'Amazon', program: 'affiliate', acceptsUtm: false },
  generic: { label: 'Partner', program: 'none', acceptsUtm: true },
};

export interface UtmOptions {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const DEFAULT_UTM: Required<Pick<UtmOptions, 'source' | 'medium'>> = {
  source: 'travelliniwithus',
  medium: 'affiliate',
};

/**
 * Aggiunge UTM standard a un URL affiliate mantenendo idempotenza: parametri
 * gia presenti non vengono sovrascritti, cosi da rispettare eventuali
 * tracking originali dei partner (es. Heymondo cod_descuento).
 */
export function buildAffiliateUrl(url: string, utm: UtmOptions = {}): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    const params: Record<string, string | undefined> = {
      utm_source: utm.source ?? DEFAULT_UTM.source,
      utm_medium: utm.medium ?? DEFAULT_UTM.medium,
      utm_campaign: utm.campaign,
      utm_content: utm.content,
      utm_term: utm.term,
    };
    for (const [key, value] of Object.entries(params)) {
      if (value && !parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, value);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export interface AffiliateClickParams {
  partner: AffiliatePartner;
  /** Destinazione finale (post-UTM). */
  url: string;
  /** Id campagna per separare le fonti (es. articolo, risorse, widget). */
  campaign?: string;
  /** Contesto ulteriore (es. slug articolo, categoria risorsa). */
  placement?: string;
  /** Label visibile all'utente — utile per dashboard. */
  label?: string;
}

/**
 * Evento click affiliate unificato. Lato GA4/Meta/TikTok appare come
 * `affiliate_click` con payload normalizzato, cosi le dashboard possono
 * filtrare per partner, campagna e placement senza mapping ad-hoc.
 */
export function trackAffiliateClick(params: AffiliateClickParams) {
  const partnerMeta = AFFILIATE_PARTNERS[params.partner] ?? AFFILIATE_PARTNERS.generic;
  trackEvent('affiliate_click', {
    partner: params.partner,
    partner_label: partnerMeta.label,
    program: partnerMeta.program,
    campaign: params.campaign ?? 'default',
    placement: params.placement ?? 'unknown',
    label: params.label,
    link_url: params.url,
  });
}

/**
 * Helper combinato per handler click: costruisce URL con UTM e spara l'evento.
 * Restituisce l'URL arricchito cosi il caller puo usarlo direttamente in `href`.
 */
export function prepareAffiliateLink(
  partner: AffiliatePartner,
  baseUrl: string,
  options: {
    campaign?: string;
    placement?: string;
    label?: string;
    utm?: UtmOptions;
  } = {}
): { href: string; onClick: () => void } {
  const partnerMeta = AFFILIATE_PARTNERS[partner] ?? AFFILIATE_PARTNERS.generic;
  const href = partnerMeta.acceptsUtm
    ? buildAffiliateUrl(baseUrl, {
        campaign: options.campaign,
        content: options.placement,
        ...options.utm,
      })
    : baseUrl;

  return {
    href,
    onClick: () =>
      trackAffiliateClick({
        partner,
        url: href,
        campaign: options.campaign,
        placement: options.placement,
        label: options.label,
      }),
  };
}
