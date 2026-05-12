import * as Sentry from '@sentry/react';
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface AnalyticsWindow extends Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

const SENTRY_DSN = (import.meta.env.VITE_SENTRY_DSN as string | undefined)?.trim();
const APP_ENV = (import.meta.env.MODE ?? 'development') as string;
const isProd = APP_ENV === 'production';

export function initTelemetry(): void {
  if (typeof window === 'undefined') return;

  if (SENTRY_DSN && isProd) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: APP_ENV,
      release: import.meta.env.VITE_APP_VERSION as string | undefined,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.5,
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
      sendDefaultPii: false,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });
  }

  const reportMetric = (metric: Metric): void => {
    const w = window as AnalyticsWindow;
    const payload = {
      name: metric.name,
      value: Math.round(metric.value * 1000) / 1000,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    };

    if (w.gtag) {
      w.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }

    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'web_vitals', ...payload });
    }

    if (!isProd) {
      console.debug(`[web-vitals] ${metric.name}=${metric.value} (${metric.rating})`);
    }
  };

  onCLS(reportMetric);
  onFCP(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}

export const captureException = (error: unknown, context?: Record<string, unknown>): void => {
  if (SENTRY_DSN && isProd) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else if (!isProd) {
    console.error('[telemetry] captureException (dev no-op)', error, context);
  }
};
