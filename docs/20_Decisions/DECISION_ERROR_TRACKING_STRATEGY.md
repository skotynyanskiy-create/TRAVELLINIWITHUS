---
title: Error Tracking Strategy (Sentry predisposto)
type: decision
status: active
date: 2026-04-20
owner: Rodrigo
tags: [observability, sentry, devops]
---

# Error Tracking Strategy

## Contesto

Il sito passa da "demo" a "produzione" con pagamenti Stripe, affiliate tracking e lead B2B: da oggi qualunque errore silente è un rischio (ordine perso, lead perso, credibility hit). Serve un canale di telemetria reale. Sentry è lo standard de-facto per React + Node; la memoria progetto impone di **non installare chiavi/SDK esterni fino alla sessione pre-deploy**.

## Decisione

Adottiamo un'architettura **gated con predisposizione completa**:

- [src/lib/errorTracking.ts](../../src/lib/errorTracking.ts) — lato client. Log in memoria, console, e `window.Sentry.captureException` se presente.
- [src/lib/serverErrorTracking.ts](../../src/lib/serverErrorTracking.ts) — lato server. Log strutturato, handler `unhandledRejection` / `uncaughtException`, Express error middleware finale.
- [src/main.tsx](../../src/main.tsx) chiama `initErrorTracking()` al bootstrap.
- [src/components/ErrorBoundary.tsx](../../src/components/ErrorBoundary.tsx) cattura errori React e chiama `captureException` con component stack.
- [server.ts](../../server.ts) chiama `initServerErrorTracking()` e installa i global handler + middleware finale.

Tutto funziona già senza DSN: l'app non crasha, gli errori vanno in console strutturata. Quando arriva la sessione pre-deploy, si attiva Sentry in ~30 minuti seguendo il runbook sotto.

## Runbook pre-deploy (attivazione Sentry)

**Prerequisiti**
- Account Sentry con un progetto React (per il client) e un progetto Node (per il server).
- DSN di entrambi i progetti copiati.
- Decisione su environment (`production` vs `staging`) e release tag.

**Client**
1. `npm i @sentry/react`
2. In `src/lib/errorTracking.ts`, sostituisci il blocco `console.info(...)` dentro `initErrorTracking()` con:
   ```ts
   import * as Sentry from '@sentry/react';
   Sentry.init({
     dsn,
     environment: import.meta.env.MODE,
     integrations: [Sentry.browserTracingIntegration()],
     tracesSampleRate: 0.1,
     replaysSessionSampleRate: 0.0,
     replaysOnErrorSampleRate: 0.5,
   });
   (window as unknown as { Sentry: typeof Sentry }).Sentry = Sentry;
   ```
   `captureException` / `captureMessage` già leggono `window.Sentry`, quindi non serve toccarli.
3. Aggiungi `VITE_SENTRY_DSN` in `.env.local` (dev) e nelle variabili di ambiente di produzione (Vercel / Firebase Hosting).

**Server**
1. `npm i @sentry/node`
2. In `src/lib/serverErrorTracking.ts`, sostituisci il corpo di `logEvent` aggiungendo:
   ```ts
   import * as Sentry from '@sentry/node';
   // in initServerErrorTracking(), dopo il check DSN:
   Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
   // in logEvent, per level === 'error':
   Sentry.captureException(event.context?.stack ? new Error(event.message) : event.message, {
     contexts: { app: event.context ?? {} },
   });
   ```
3. Aggiungi `SENTRY_DSN` nelle env di produzione (server).

**Verifica**
- Lancia `npm run dev` con `VITE_SENTRY_DSN` settato, apri DevTools console, forza errore (es. `throw new Error('test-sentry')` in un lazy page): l'errore appare nel dashboard Sentry entro pochi secondi.
- Lato server: colpisci un endpoint con payload invalido per generare 500, verifica evento in Sentry Node project.
- Controlla `ErrorBoundary` colpendo una pagina con un throw forzato.

## Trade-off considerati

- **No SDK pre-installato**: mantiene bundle leggero in dev, coerente con la policy "chiavi solo pre-deploy" e con l'assenza di account Sentry attivo. Costo: manca monitoraggio real-time in dev (accettato, dev già vede console).
- **Self-hosted vs SaaS Sentry**: SaaS free tier copre ampiamente (10k error/mese). Self-hosted richiede ops non in scope.
- **Alternative valutate**: Datadog (overkill per volume attuale), LogRocket (session replay costoso), Axiom (solo log, manca grouping).

## Riferimenti

- [Sentry React docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Node docs](https://docs.sentry.io/platforms/node/)
- [Error Boundary pattern](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
