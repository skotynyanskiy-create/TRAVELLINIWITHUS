export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: number;
}

const STORAGE_KEY = 'tw:consent';
const CONSENT_VERSION = 1;
const EVENT_NAME = 'tw:consent-changed';

const DEFAULT_STATE: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
  version: CONSENT_VERSION,
};

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return DEFAULT_STATE;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: Number(parsed.timestamp) || 0,
      version: CONSENT_VERSION,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function hasRespondedToConsent(): boolean {
  return getConsent().timestamp > 0;
}

export function setConsent(next: { analytics: boolean; marketing: boolean }) {
  if (typeof window === 'undefined') return;
  const state: ConsentState = {
    necessary: true,
    analytics: next.analytics,
    marketing: next.marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
}

export function onConsentChange(handler: (state: ConsentState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<ConsentState>;
    handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

export function acceptAll() {
  setConsent({ analytics: true, marketing: true });
}

export function rejectAll() {
  setConsent({ analytics: false, marketing: false });
}

export function canLoad(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  return getConsent()[category];
}
