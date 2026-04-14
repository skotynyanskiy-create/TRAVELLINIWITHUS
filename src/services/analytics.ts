import { canLoad, getConsent, onConsentChange } from '../lib/consent';

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;
type TtqFn = { track: (...args: unknown[]) => void; page: () => void; load: (id: string) => void };

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    fbq?: FbqFn;
    ttq?: TtqFn;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const TIKTOK_PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined;

const loaded = {
  ga4: false,
  meta: false,
  tiktok: false,
};

function injectScript(src: string, attrs: Record<string, string> = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function loadGA4() {
  if (loaded.ga4 || !GA_ID || typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  const gtag: GtagFn = function gtag(...args: unknown[]) {
    (window.dataLayer as unknown[]).push(args);
  };
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  void injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  loaded.ga4 = true;
}

function loadMetaPixel() {
  if (loaded.meta || !META_PIXEL_ID || typeof window === 'undefined') return;
  const w = window as Window & { fbq?: FbqFn & { callMethod?: GtagFn; queue?: unknown[]; loaded?: boolean; version?: string; push?: FbqFn } };
  if (w.fbq) return;
  const fbq: FbqFn & { callMethod?: GtagFn; queue?: unknown[]; loaded?: boolean; version?: string; push?: FbqFn } = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else (fbq.queue = fbq.queue || []).push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  w.fbq = fbq;
  void injectScript('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
  loaded.meta = true;
}

function loadTikTokPixel() {
  if (loaded.tiktok || !TIKTOK_PIXEL_ID || typeof window === 'undefined') return;
  void injectScript(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${TIKTOK_PIXEL_ID}&lib=ttq`);
  loaded.tiktok = true;
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  applyConsent();
  onConsentChange(() => applyConsent());
}

function applyConsent() {
  const consent = getConsent();
  if (consent.analytics) loadGA4();
  if (consent.marketing) {
    loadMetaPixel();
    loadTikTokPixel();
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  if (canLoad('analytics') && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
  if (canLoad('marketing')) {
    if (window.fbq) window.fbq('trackCustom', eventName, eventParams);
    if (window.ttq) window.ttq.track(eventName, eventParams);
  }
  if (import.meta.env.DEV) {
    console.log(`[analytics] event "${eventName}"`, eventParams);
  }
};

export const trackPageview = (path: string) => {
  if (typeof window === 'undefined') return;
  if (canLoad('analytics') && window.gtag && GA_ID) {
    window.gtag('config', GA_ID, { page_path: path });
  }
  if (canLoad('marketing') && window.fbq) {
    window.fbq('track', 'PageView');
  }
};
