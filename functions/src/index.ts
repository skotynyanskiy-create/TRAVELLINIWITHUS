/**
 * Stadio 2b — la Cloud Function monta lo stesso router del dev server.
 *
 * `createApiRouter` vive in src/server/apiRoutes.ts e le sue 11 dipendenze in
 * src/server/data.ts: entrambi importati qui e da server.ts, quindi esiste un
 * solo corpo di codice per gli endpoint invece di due copie che divergono.
 *
 * Cosa NON funziona ancora, di proposito: senza i segreti in Secret Manager la
 * function non ha chiavi Stripe ne' Brevo, quindi checkout ed email rispondono
 * con errori di configurazione. E' lo stadio 3, e richiede il piano Blaze.
 */
import express from 'express';
import Stripe from 'stripe';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret, defineString, type StringParam } from 'firebase-functions/params';
import { createApiRouter } from '../../src/server/apiRoutes';
import {
  LEAD_MAGNET_URL,
  MEDIA_KIT_URL,
  OWNER_EMAIL,
  fetchCouponByCode,
  fetchProductAssets,
  fetchProductById,
  firebaseConfig,
  isCheckoutRequestItem,
  saveStripeOrder,
  verifyOptionalIdToken,
} from '../../src/server/data';

// Parametri non sensibili: la CLI ferma il deploy finché non esiste un valore.
// Il database Firestore di questo progetto non è "(default)", quindi ometterlo
// farebbe puntare API e ordini a una destinazione errata o non salvare i lead.
const appUrl = defineString('APP_URL', {
  label: 'URL canonico del sito',
  description: 'URL HTTPS usato per callback Stripe, canonical e link email.',
});
const firestoreDatabaseId = defineString('FIRESTORE_DATABASE_ID', {
  label: 'ID del database Firestore',
  description: 'Nome del database Firestore non-default usato dal sito.',
});
// Non e' un segreto (e' l'id numerico di una lista Brevo) ma senza di esso
// /api/newsletter-subscribe degrada in silenzio a save-lead-only: il lead resta
// in Firestore e non arriva mai a Brevo. Vedi apiRoutes.ts, ramo BREVO_LIST_ID.
const brevoListId = defineString('BREVO_LIST_ID', {
  label: 'ID della lista Brevo',
  description: 'Lista a cui iscrivere i contatti raccolti dalla newsletter.',
});

// I segreti restano nel Secret Manager e vengono esposti solo alla Function
// api; non vanno mai aggiunti a .env.example o al bundle client.
//
// Solo i segreti che un endpoint legge davvero: `defineSecret` blocca il deploy
// finche' il segreto non esiste in Secret Manager, quindi dichiararne uno di
// troppo obbliga a creare (e pagare) una chiave per una funzionalita' spenta.
// OPENAI_API_KEY e ANTHROPIC_API_KEY erano qui per /api/ai-companion, che
// risponde 503 per progetto: si rimettono insieme all'implementazione RAG.
const apiSecrets = [
  defineSecret('STRIPE_SECRET_KEY'), // create-checkout-session, webhook
  defineSecret('STRIPE_WEBHOOK_SECRET'), // webhook
  defineSecret('RESEND_API_KEY'), // email transazionali
  defineSecret('BREVO_API_KEY'), // newsletter-subscribe
  defineSecret('GEMINI_API_KEY'), // admin/ai-verify
];

let stripe: Stripe | null | undefined;

function getStripe() {
  if (stripe !== undefined) return stripe;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, { apiVersion: '2026-02-25.clover' })
    : null;
  return stripe;
}

function createApiApp() {
  const app = express();
  app.disable('x-powered-by');

  // Nessun middleware CORS: la function e' raggiungibile attraverso il rewrite
  // `/api/**` di Firebase Hosting, quindi le richieste del sito sono same-origin.
  // Aggiungerlo servirebbe solo per chiamate dirette all'URL della function, che
  // non sono un percorso che vogliamo incoraggiare.
  app.use(
    createApiRouter({
      stripe: null,
      getStripe,
      firebaseConfig,
      OWNER_EMAIL,
      LEAD_MAGNET_URL,
      MEDIA_KIT_URL,
      saveStripeOrder,
      verifyOptionalIdToken,
      fetchProductById,
      fetchProductAssets,
      fetchCouponByCode,
      isCheckoutRequestItem,
    })
  );

  return app;
}

const app = createApiApp();

const requiredRuntimeParameters: Array<{ name: string; parameter: StringParam }> = [
  { name: 'APP_URL', parameter: appUrl },
  { name: 'FIRESTORE_DATABASE_ID', parameter: firestoreDatabaseId },
];

function missingRequiredRuntimeConfig() {
  return requiredRuntimeParameters.flatMap(({ name, parameter }) =>
    parameter.value().trim() ? [] : [name]
  );
}

/**
 * Parametri che degradano una singola funzionalita' invece di rompere l'API:
 * non entrano nel gate 503, ma il router li legge da `process.env`, quindi qui
 * si travasa il valore del parametro e si logga una volta sola se manca. Senza
 * questo, la newsletter falliva in silenzio e il lead non arrivava mai a Brevo.
 */
let optionalConfigApplied = false;

function applyOptionalRuntimeConfig() {
  if (optionalConfigApplied) return;
  optionalConfigApplied = true;

  const listId = brevoListId.value().trim();
  if (listId) {
    process.env.BREVO_LIST_ID = listId;
    return;
  }

  if (process.env.BREVO_API_KEY) {
    console.warn(
      '[api] BREVO_LIST_ID non configurato: i lead newsletter restano su Firestore ' +
        'e non vengono iscritti a Brevo.'
    );
  }
}

export const api = onRequest(
  {
    region: 'europe-west1',
    // express-rate-limit tiene lo stato in memoria: ogni istanza ha il proprio
    // contatore. Poche istanze rendono il limite approssimato ma non inutile, e
    // fanno da tetto di spesa.
    maxInstances: 3,
    invoker: 'public',
    secrets: apiSecrets,
  },
  (req, res) => {
    const missing = missingRequiredRuntimeConfig();
    if (missing.length > 0) {
      console.error(
        '[api] Required Firebase Function configuration is missing: ' + missing.join(', ')
      );
      res.status(503).json({ error: 'Servizio temporaneamente non configurato.' });
      return;
    }

    applyOptionalRuntimeConfig();
    app(req, res);
  }
);
