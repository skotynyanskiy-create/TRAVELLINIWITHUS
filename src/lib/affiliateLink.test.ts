import { describe, it, expect } from 'vitest';
import { buildAffiliateLink, AFFILIATE_ANCHOR_ATTRS } from './affiliateLink';

describe('buildAffiliateLink — disabled partner', () => {
  it('returns bare base URL with no UTM when partner is disabled', () => {
    // All partners are disabled in test env (no VITE_AFFILIATE_* vars set).
    const url = buildAffiliateLink({
      partner: 'skyscanner',
      utmCampaign: 'test-campaign',
    });
    expect(url).toBe('https://www.skyscanner.it/');
    expect(url).not.toContain('utm_');
    expect(url).not.toContain('associateid');
  });

  it('appends a path to the base URL when disabled', () => {
    const url = buildAffiliateLink({
      partner: 'booking',
      path: '/hotel/italia',
      utmCampaign: 'test',
    });
    expect(url).toBe('https://www.booking.com/hotel/italia');
    expect(url).not.toContain('utm_');
  });
});

describe('AFFILIATE_ANCHOR_ATTRS', () => {
  it('includes "sponsored" and "noopener" in rel', () => {
    expect(AFFILIATE_ANCHOR_ATTRS.rel).toContain('sponsored');
    expect(AFFILIATE_ANCHOR_ATTRS.rel).toContain('noopener');
  });

  it('opens in a new tab', () => {
    expect(AFFILIATE_ANCHOR_ATTRS.target).toBe('_blank');
  });
});
