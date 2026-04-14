interface ErrorEvent {
  message: string;
  level: 'error' | 'warning' | 'info';
  context?: Record<string, unknown>;
  timestamp: string;
  url: string;
}

interface SentryLike {
  captureException: (err: unknown, hint?: { contexts?: Record<string, unknown> }) => void;
  captureMessage: (msg: string, level?: string) => void;
}

const isDevelopment = import.meta.env.DEV;
const errorLog: ErrorEvent[] = [];
const MAX_LOG = 100;

function getSentry(): SentryLike | null {
  if (typeof window === 'undefined') return null;
  const sentry = (window as unknown as { Sentry?: SentryLike }).Sentry;
  return sentry ?? null;
}

export function initErrorTracking() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    if (isDevelopment) {
      console.info('[errorTracking] VITE_SENTRY_DSN mancante — Sentry init skipped (predisposizione mode)');
    }
    return;
  }

  if (typeof window === 'undefined') return;
  const existing = (window as unknown as { Sentry?: SentryLike }).Sentry;
  if (existing) return;

  console.info('[errorTracking] Sentry DSN presente ma @sentry/react non ancora installato. ' +
    'Installa la dipendenza e completa l\'init in fase finale pre-deploy.');
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const event: ErrorEvent = {
    message,
    level: 'error',
    context: {
      ...context,
      stack,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    },
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  pushLog(event);
  if (isDevelopment) console.error('[error]', event);

  const sentry = getSentry();
  if (sentry) {
    sentry.captureException(error, { contexts: { app: context ?? {} } });
  }

  return event;
}

export function captureMessage(
  message: string,
  level: 'error' | 'warning' | 'info' = 'info',
  context?: Record<string, unknown>,
) {
  const event: ErrorEvent = {
    message,
    level,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  pushLog(event);
  if (isDevelopment) console.log(`[${level}]`, message, context);

  const sentry = getSentry();
  if (sentry) sentry.captureMessage(message, level);

  return event;
}

export function trackUserAction(action: string, data?: Record<string, unknown>) {
  if (isDevelopment) {
    console.log(`[action] ${action}`, data);
  }
}

export function getErrorLog() {
  return errorLog.slice();
}

export function clearErrorLog() {
  errorLog.length = 0;
}

function pushLog(event: ErrorEvent) {
  errorLog.push(event);
  if (errorLog.length > MAX_LOG) errorLog.shift();
}
