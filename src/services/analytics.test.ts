import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setConsent } from '../lib/consent';
import { trackAnalyticsEvent } from './analytics';

describe('trackAnalyticsEvent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.gtag = undefined;
    window.fbq = undefined;
    window.ttq = undefined;
  });

  it('does not emit before analytics consent', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    setConsent({ analytics: false, marketing: true, personalization: false });

    trackAnalyticsEvent('audience_gate_view');

    expect(gtag).not.toHaveBeenCalled();
  });

  it('emits to GA4 only, even when marketing consent is available', () => {
    const gtag = vi.fn();
    const fbq = vi.fn();
    const ttqTrack = vi.fn();
    window.gtag = gtag;
    window.fbq = fbq;
    window.ttq = {
      track: ttqTrack,
      page: vi.fn(),
      load: vi.fn(),
    };
    setConsent({ analytics: true, marketing: true, personalization: false });

    trackAnalyticsEvent('audience_gate_select', { audience: 'family' });

    expect(gtag).toHaveBeenCalledWith('event', 'audience_gate_select', { audience: 'family' });
    expect(fbq).not.toHaveBeenCalled();
    expect(ttqTrack).not.toHaveBeenCalled();
  });
});
