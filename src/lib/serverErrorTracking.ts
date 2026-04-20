/**
 * Error tracking lato server (Express + SSR).
 * Mantiene lo stesso contratto di `errorTracking.ts` lato client ma
 * lavora con process.env e console. Nessuna dipendenza installata:
 * in fase pre-deploy si completa sostituendo `logEvent` con una chiamata
 * al SDK scelto (Sentry Node, Betterstack, Axiom, ecc.).
 */

type Level = 'error' | 'warning' | 'info';

interface ServerErrorEvent {
  message: string;
  level: Level;
  context?: Record<string, unknown>;
  timestamp: string;
}

const MAX_LOG = 200;
const recentEvents: ServerErrorEvent[] = [];

function logEvent(event: ServerErrorEvent) {
  recentEvents.push(event);
  if (recentEvents.length > MAX_LOG) recentEvents.shift();

  const prefix = `[server:${event.level}]`;
  if (event.level === 'error') {
    console.error(prefix, event.message, event.context ?? {});
  } else if (event.level === 'warning') {
    console.warn(prefix, event.message, event.context ?? {});
  } else if (process.env.NODE_ENV !== 'production') {
    console.info(prefix, event.message, event.context ?? {});
  }
}

export function initServerErrorTracking() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[serverErrorTracking] SENTRY_DSN mancante — logging locale attivo (predisposizione mode)');
    }
    return;
  }
  console.info(
    '[serverErrorTracking] SENTRY_DSN presente ma SDK server non ancora installato. ' +
    'In fase pre-deploy: npm i @sentry/node, Sentry.init({ dsn }), sostituisci logEvent con Sentry.captureException.'
  );
}

export function captureServerException(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  logEvent({
    message,
    level: 'error',
    context: { ...context, stack },
    timestamp: new Date().toISOString(),
  });
}

export function captureServerMessage(message: string, level: Level = 'info', context?: Record<string, unknown>) {
  logEvent({
    message,
    level,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function getRecentServerEvents() {
  return recentEvents.slice();
}
