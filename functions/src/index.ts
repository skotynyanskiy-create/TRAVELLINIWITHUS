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

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2026-02-25.clover' })
  : null;

const app = express();
app.disable('x-powered-by');

// Nessun middleware CORS: la function e' raggiungibile attraverso il rewrite
// `/api/**` di Firebase Hosting, quindi le richieste del sito sono same-origin.
// Aggiungerlo servirebbe solo per chiamate dirette all'URL della function, che
// non sono un percorso che vogliamo incoraggiare.
app.use(
  createApiRouter({
    stripe,
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

export const api = onRequest(
  {
    region: 'europe-west1',
    // express-rate-limit tiene lo stato in memoria: ogni istanza ha il proprio
    // contatore. Poche istanze rendono il limite approssimato ma non inutile, e
    // fanno da tetto di spesa.
    maxInstances: 3,
    invoker: 'public',
  },
  app
);
