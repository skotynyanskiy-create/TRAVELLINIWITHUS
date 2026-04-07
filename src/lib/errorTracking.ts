/**
 * Error tracking and monitoring setup
 * Currently configured for console logging in development
 * Ready to integrate Sentry, Rollbar, or LogRocket in production
 */

interface ErrorEvent {
  message: string;
  level: 'error' | 'warning' | 'info';
  context?: Record<string, unknown>;
  timestamp: string;
  url: string;
}

const isDevelopment = import.meta.env.DEV;
const errorLog: ErrorEvent[] = [];

export function captureException(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const event: ErrorEvent = {
    message,
    level: 'error',
    context: {
      ...context,
      stack,
      userAgent: navigator.userAgent,
    },
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  errorLog.push(event);

  if (isDevelopment) {
    console.error('🔴 Error captured:', event);
  }

  // TODO: Send to Sentry/Rollbar in production
  // if (import.meta.env.PROD && window.Sentry) {
  //   Sentry.captureException(error, { contexts: { ...context } });
  // }

  return event;
}

export function captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info', context?: Record<string, unknown>) {
  const event: ErrorEvent = {
    message,
    level,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  errorLog.push(event);

  if (isDevelopment) {
    console.log(`🟡 [${level.toUpperCase()}]`, message, context);
  }

  // TODO: Send to monitoring service in production
  return event;
}

export function trackUserAction(action: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  
  if (isDevelopment) {
    console.log(`✅ Action: ${action}`, { timestamp, ...data });
  }

  // TODO: Send to analytics in production
  // - Add to Firebase Analytics
  // - Add to Mixpanel / Amplitude
  // - Add to GA4
}

export function getErrorLog() {
  return errorLog;
}

export function clearErrorLog() {
  errorLog.length = 0;
}
