import { describe, it, expect, vi } from 'vitest';
import { trackAffiliateClick } from './affiliate';
import * as analytics from '../services/analytics';

describe('affiliate util', () => {
  it('trackAffiliateClick fires analytics event and appends UTM parameters', () => {
    const trackSpy = vi.spyOn(analytics, 'trackEvent').mockImplementation(() => {});

    const url = trackAffiliateClick(
      'booking',
      'https://www.booking.com/hotel/it/masseria.html',
      'posto_page'
    );

    expect(trackSpy).toHaveBeenCalledWith('affiliate_click', {
      partner: 'booking',
      original_url: 'https://www.booking.com/hotel/it/masseria.html',
      campaign: 'posto_page',
    });

    expect(url).toContain('utm_source=travelliniwithus');
    expect(url).toContain('utm_medium=affiliate');
    expect(url).toContain('utm_campaign=posto_page');

    trackSpy.mockRestore();
  });
});
