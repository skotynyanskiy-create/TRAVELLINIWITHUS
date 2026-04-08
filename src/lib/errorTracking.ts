import { REMOTE_MONITORING_ENABLED } from '../config/runtime';

interface ErrorEvent {
  message: string;
  level: 'error' | 'warning' | 'info';
  context?: Record<string, unknown>;
  timestamp: string;
  url: string;
}

const isDevelopment = import.meta.env.DEV;
const errorLog: ErrorEvent[] = [];
let handlersRegistered = false;

async function sendRemoteEvent(event: ErrorEvent) {
  if (!REMOTE_MONITORING_ENABLED) {
    return;
  }

  try {
    await fetch('/api/client-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch (error) {
    if (isDevelopment) {
      console.warn('Remote monitoring request failed', error);
    }
  }
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
      userAgent: navigator.userAgent,
    },
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  errorLog.push(event);

  if (isDevelopment) {
    console.error('Error captured:', event);
  }

  void sendRemoteEvent(event);
  return event;
}

export function captureMessage(
  message: string,
  level: 'error' | 'warning' | 'info' = 'info',
  context?: Record<string, unknown>
) {
  const event: ErrorEvent = {
    message,
    level,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  errorLog.push(event);

  if (isDevelopment) {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }

  void sendRemoteEvent(event);
  return event;
}

export function trackUserAction(action: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();

  if (isDevelopment) {
    console.log(`Action: ${action}`, { timestamp, ...data });
  }
}

export function setupGlobalErrorHandlers() {
  if (handlersRegistered) {
    return;
  }

  handlersRegistered = true;

  window.addEventListener('error', (event) => {
    captureException(event.error ?? event.message, {
      source: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureException(event.reason, {
      source: 'window.unhandledrejection',
    });
  });
}

export function getErrorLog() {
  return errorLog;
}

export function clearErrorLog() {
  errorLog.length = 0;
}
