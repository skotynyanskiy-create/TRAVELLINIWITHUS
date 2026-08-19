import { afterEach, describe, expect, it } from 'vitest';
import { canLoad, getConsent, setConsent } from './consent';

const PERSONALIZATION_STORAGE_KEYS = [
  'travellini_interest_profile',
  'twu_personalization_signals',
  'twu_reading_history',
];

afterEach(() => {
  window.localStorage.clear();
});

describe('consent', () => {
  it('clears legacy personalization data before consent, when enabled, and when revoked', () => {
    PERSONALIZATION_STORAGE_KEYS.forEach((key) => window.localStorage.setItem(key, 'legacy'));

    setConsent({ analytics: false, marketing: false, personalization: false });

    PERSONALIZATION_STORAGE_KEYS.forEach((key) => {
      expect(window.localStorage.getItem(key)).toBeNull();
      window.localStorage.setItem(key, 'legacy');
    });

    setConsent({ analytics: false, marketing: false, personalization: true });

    expect(canLoad('personalization')).toBe(true);
    expect(getConsent().personalization).toBe(true);
    PERSONALIZATION_STORAGE_KEYS.forEach((key) => {
      expect(window.localStorage.getItem(key)).toBeNull();
      window.localStorage.setItem(key, 'current');
    });

    setConsent({ analytics: false, marketing: false, personalization: false });

    expect(canLoad('personalization')).toBe(false);
    PERSONALIZATION_STORAGE_KEYS.forEach((key) => {
      expect(window.localStorage.getItem(key)).toBeNull();
    });
  });
});
