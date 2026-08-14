import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import type Stripe from 'stripe';
import {
  sendEmail,
  renderContactNotification,
  renderContactAutoReply,
  renderMediaKitNotification,
  renderMediaKitAutoReply,
  renderWelcomeEmail,
  renderOrderConfirmation,
} from '../lib/email';
import type {
  CheckoutItem,
  CheckoutRequestItem,
  CouponRecord,
  FirestoreValue,
  ProductAssetRecord,
  ProductRecord,
  StripeOrderRecord,
  VerifiedUser,
} from './types';

/**
 * Layer /api/* del sito, estratto da `server.ts` (stadio 1).
 *
 * Esisteva come 754 righe inline dentro `startServer()`, quindi raggiungibile
 * solo dal dev server. In produzione Firebase Hosting serve file statici e ogni
 * chiamata a /api/... riceveva lo shell HTML della SPA: newsletter, contatti,
 * media kit, coupon, checkout e webhook Stripe non avevano una destinazione.
 * Vedi docs/14_Bugs/BUG_API_ENDPOINTS_SENZA_BACKEND_IN_PROD_2026-07-26.md
 *
 * Ora e' un factory sullo stampo di `createSeoRouter`: lo montano sia
 * `server.ts` in sviluppo sia la Cloud Function in produzione, cosi' esiste un
 * solo corpo di codice invece di due copie che divergono.
 *
 * ORDINE CRITICO, non riordinare:
 *   1. i rate limiter, con /api/webhook escluso da quello generico — un burst
 *      di retry Stripe durante un outage non deve essere throttlato o gli
 *      ordini si perdono dopo 3 giorni di tentativi;
 *   2. /api/webhook con `express.raw()`, che DEVE precedere `express.json()`:
 *      la verifica della firma Stripe lavora sul body grezzo, e un body gia'
 *      parsato la fa fallire silenziosamente su ogni pagamento.
 */
export interface ApiRouterDeps {
  stripe: Stripe | null;
  /** Consente ai runtime serverless di leggere il secret Stripe solo durante
   * l'esecuzione della richiesta, mantenendo compatibile il server locale. */
  getStripe?: () => Stripe | null;
  firebaseConfig: Record<string, string | undefined>;
  OWNER_EMAIL: string;
  LEAD_MAGNET_URL: string;
  MEDIA_KIT_URL: string;
  /** `created: false` quando l'ordine esisteva gia': il webhook Stripe puo'
   *  essere consegnato piu' volte, e la rotta usa questo flag per non mandare
   *  due email di conferma per lo stesso pagamento. */
  saveStripeOrder: (
    order: StripeOrderRecord,
    stripeEventId: string
  ) => Promise<{ created: boolean; id: string }>;
  verifyOptionalIdToken: (authHeader: string | undefined) => Promise<VerifiedUser | null>;
  fetchProductById: (
    productId: string,
    options?: { includeUnpublished?: boolean }
  ) => Promise<ProductRecord | null>;
  fetchProductAssets: (productId: string) => Promise<ProductAssetRecord | null>;
  fetchCouponByCode: (code: string) => Promise<CouponRecord | null>;
  /** Type predicate, non un semplice boolean: senza `value is` TypeScript non
   *  restringe il tipo e le righe del carrello restano `unknown`. */
  isCheckoutRequestItem: (value: unknown) => value is CheckoutRequestItem;
}

export function createApiRouter(deps: ApiRouterDeps): Router {
  const {
    stripe: configuredStripe,
    getStripe: getStripeFromDeps,
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
  } = deps;
  const getStripe = getStripeFromDeps ?? (() => configuredStripe);

  const router = Router();

  /**
   * `sendEmail` non rigetta quando salta l'invio: risolve con `ok: false`.
   * Quindi un `.catch` non scatta e `Promise.allSettled` lo conta come riuscito.
   * Questo wrapper guarda l'esito vero, cosi' un'email mai partita lascia una
   * riga di log invece di sparire.
   */
  const inviaEmail = async (etichetta: string, input: Parameters<typeof sendEmail>[0]) => {
    try {
      const esito = await sendEmail(input);
      if (!esito.ok) {
        console.error(
          `[email:${etichetta}] NON inviata — ${esito.reason ?? 'motivo non riportato'}`
        );
      }
      return esito.ok;
    } catch (err) {
      console.error(`[email:${etichetta}] errore durante l'invio:`, err);
      return false;
    }
  };

  // Rate limiting — protegge da abuse e spam
  const newsletterLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppi tentativi. Riprova tra un minuto.' },
  });
  const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppi tentativi di checkout. Riprova tra poco.' },
  });
  const generalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    // Stripe webhook burst durante retry/outage NON deve cadere sotto rate
    // limit (perderebbe ordini definitivamente dopo 3gg di tentativi).
    // Anche /api/health resta libero per probe esterne (uptime monitor).
    skip: (req) =>
      req.path === '/webhook' ||
      req.path === '/api/webhook' ||
      req.path === '/health' ||
      req.path === '/api/health',
  });
  const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppi invii ravvicinati. Riprova tra qualche minuto.' },
  });
  router.use('/api/newsletter-subscribe', newsletterLimiter);
  router.use('/api/create-checkout-session', checkoutLimiter);
  router.use('/api/contact-lead', contactLimiter);
  router.use('/api/media-kit-lead', contactLimiter);
  // Generic /api/* limiter, but skip /api/webhook so Stripe retry bursts are
  // never throttled (signature verification + idempotent doc.create() already
  // protect that route).
  router.use(/^\/api\/(?!webhook(?:\/|$)).*/, generalApiLimiter);

  router.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  router.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = getStripe();
    const rawBody = req.body;
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !endpointSecret || !sig || typeof sig !== 'string') {
      res.status(400).send('Webhook Error: Missing configuration or signature');
      return;
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const metadataItems = (() => {
        const raw = session.metadata?.cartItems;
        if (!raw) return [];

        try {
          const parsed = JSON.parse(raw) as unknown[];
          return Array.isArray(parsed) ? parsed.filter(isCheckoutRequestItem) : [];
        } catch (error) {
          console.error('Failed to parse cartItems metadata:', error);
          return [];
        }
      })();

      let enrichedItems = (
        await Promise.all(
          metadataItems.map(async (item) => {
            const product = await fetchProductById(item.id, { includeUnpublished: true });
            if (!product) return null;

            const assets = product.isDigital ? await fetchProductAssets(product.id) : null;

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity,
              downloadUrl: assets?.downloadUrl ?? null,
              isDigital: product.isDigital || false,
            };
          })
        )
      ).filter((item): item is NonNullable<typeof item> => item !== null);

      if (enrichedItems.length === 0) {
        let lineItems: Stripe.LineItem[] = [];
        try {
          const result = await stripe.checkout.sessions.listLineItems(session.id);
          lineItems = result.data;
        } catch (e) {
          console.error('Failed to fetch line items from Stripe:', e);
        }

        enrichedItems = lineItems.map((item) => ({
          id: String(item.price?.product || item.description || 'unknown'),
          name: item.description,
          price: (item.amount_total || 0) / Math.max(item.quantity || 1, 1) / 100,
          quantity: item.quantity || 1,
          downloadUrl: null,
          isDigital: false,
        }));
      }

      const order = {
        customerName: session.customer_details?.name || 'Unknown',
        email:
          session.customer_details?.email ||
          session.customer_email ||
          session.metadata?.userEmail ||
          '',
        total: (session.amount_total || 0) / 100,
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
        items: enrichedItems,
        userId: userId || null,
        stripeSessionId: session.id,
      };

      let orderSaveResult: { created: boolean; id: string };
      try {
        orderSaveResult = await saveStripeOrder(order, event.id);
      } catch (error) {
        console.error('[stripe-webhook] failed to persist order:', error);
        res.status(500).json({ error: 'Order persistence failed.' });
        return;
      }

      if (!orderSaveResult.created) {
        console.log(
          `[stripe-webhook] duplicate checkout.session.completed ignored for ${order.stripeSessionId}.`
        );
        res.json({ received: true, duplicate: true });
        return;
      }

      // Order confirmation email: invia al customer se ho email + items.
      // Fire-and-forget, sendEmail e no-op se RESEND_API_KEY manca.
      if (order.email && order.items.length > 0) {
        const hasDigital = order.items.some((item) => item.isDigital);
        const confirmation = renderOrderConfirmation({
          customerName: order.customerName !== 'Unknown' ? order.customerName : undefined,
          orderId: order.stripeSessionId,
          total: order.total,
          items: order.items.map((item) => ({
            name: item.name ?? 'Prodotto',
            quantity: item.quantity,
            price: item.price,
          })),
          isDigital: hasDigital,
        });
        void inviaEmail('stripe:conferma-ordine', {
          to: order.email,
          ...confirmation,
          tags: [{ name: 'type', value: 'order_confirmation' }],
        });
      }
    }

    res.json({ received: true });
  });

  // 32kb is enough for any contact-lead message; bigger payloads are dropped
  // before they reach our handlers, capping JSON-parse CPU under abuse.
  router.use(express.json({ limit: '32kb' }));

  const saveLeadBackup = async ({
    type,
    source,
    email,
    name,
    company,
    website,
    topic,
    message,
    budget,
    period,
  }: {
    type: 'contact' | 'newsletter' | 'media-kit';
    source: string;
    email: string;
    name?: string;
    company?: string;
    website?: string;
    topic?: string;
    message?: string;
    budget?: string;
    period?: string;
  }): Promise<boolean> => {
    // Ritorna un booleano invece di void: chi chiama deve poter distinguere
    // "salvato" da "uscito senza fare niente". Prima questo ramo era un return
    // muto, e il chiamante lo leggeva come successo.
    if (!firebaseConfig.projectId || !firebaseConfig.firestoreDatabaseId) {
      console.error(
        `[lead:${type}] configurazione Firestore incompleta ` +
          `(projectId: ${firebaseConfig.projectId ? 'ok' : 'mancante'}, ` +
          `databaseId: ${firebaseConfig.firestoreDatabaseId ? 'ok' : 'mancante'}) — ` +
          'lead NON salvato.'
      );
      return false;
    }

    const fields: Record<string, FirestoreValue> = {
      email: { stringValue: email },
      type: { stringValue: type },
      source: { stringValue: source },
      createdAt: { timestampValue: new Date().toISOString() },
    };

    if (name) fields.name = { stringValue: name };
    if (company) fields.company = { stringValue: company };
    if (website) fields.website = { stringValue: website };
    if (topic) fields.topic = { stringValue: topic };
    if (message) fields.message = { stringValue: message };
    if (budget) fields.budget = { stringValue: budget };
    if (period) fields.period = { stringValue: period };

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/leads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      throw new Error(`Lead save failed: ${response.status} ${await response.text()}`);
    }

    return true;
  };

  router.post('/api/newsletter-subscribe', async (req, res) => {
    const {
      email,
      source = 'website',
      website,
    } = req.body as {
      email?: string;
      source?: string;
      website?: string;
    };

    if (typeof website === 'string' && website.trim().length > 0) {
      res.json({ success: true });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Email non valida.' });
      return;
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListIdRaw = process.env.BREVO_LIST_ID;
    const brevoListId = brevoListIdRaw ? Number(brevoListIdRaw) : null;
    let savedSubscription = false;

    if (brevoApiKey && Number.isInteger(brevoListId) && brevoListId && brevoListId > 0) {
      try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            email,
            listIds: [brevoListId],
            updateEnabled: true,
            attributes: { SOURCE: source, SIGNUP_DATE: new Date().toISOString().split('T')[0] },
          }),
        });

        if (!response.ok && response.status !== 204) {
          const errorBody = await response.text();
          console.error('Brevo API error:', response.status, errorBody);
        } else {
          savedSubscription = true;
        }
      } catch (err) {
        console.error('Brevo request failed:', err);
      }
    } else if (!brevoApiKey) {
      // Il caso piu' frequente e prima il piu' silenzioso: senza chiave il ramo
      // di avviso precedente non partiva, perche' richiedeva a sua volta la
      // chiave. Vale anche in produzione: un degrado muto e' indistinguibile da
      // un sistema che funziona.
      console.warn(
        '[newsletter] BREVO_API_KEY assente: nessuna iscrizione alla lista, ' +
          'solo salvataggio del lead.'
      );
    } else {
      console.warn(
        '[newsletter] BREVO_API_KEY presente ma BREVO_LIST_ID mancante o non valido. ' +
          'Newsletter in save-lead-only mode.'
      );
    }

    try {
      const salvato = await saveLeadBackup({
        email,
        type: 'newsletter',
        source,
      });
      if (salvato) savedSubscription = true;
    } catch (err) {
      console.error('Firestore newsletter save failed:', err);
    }

    if (!savedSubscription) {
      res.status(503).json({
        error: 'Iscrizione temporaneamente non disponibile. Riprova tra poco.',
      });
      return;
    }

    // Welcome email: fire-and-forget, non bloccare la response.
    const welcome = renderWelcomeEmail({ source, leadMagnetUrl: LEAD_MAGNET_URL });
    void inviaEmail('newsletter:benvenuto', { to: email, ...welcome });

    res.json({ success: true });
  });

  router.post('/api/contact-lead', async (req, res) => {
    const { name, email, topic, message, website } = req.body as {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
      website?: string;
    };

    if (typeof website === 'string' && website.trim().length > 0) {
      res.json({ success: true });
      return;
    }

    if (!name?.trim() || !email?.trim() || !topic?.trim() || !message?.trim()) {
      res.status(400).json({ error: 'Tutti i campi obbligatori devono essere compilati.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Email non valida.' });
      return;
    }

    const lead = {
      name: name.trim(),
      email: email.trim(),
      topic: topic.trim(),
      message: message.trim(),
    };

    try {
      const salvato = await saveLeadBackup({
        type: 'contact',
        source: 'contact-form',
        ...lead,
      });
      if (!salvato) {
        res.status(503).json({ error: 'Invio temporaneamente non disponibile. Riprova tra poco.' });
        return;
      }
    } catch (error) {
      console.error('Contact lead save failed:', error);
      res.status(500).json({ error: 'Impossibile salvare la richiesta.' });
      return;
    }

    const notification = renderContactNotification(lead);
    const autoReply = renderContactAutoReply({ name: lead.name });

    void Promise.all([
      inviaEmail('contatti:notifica', { to: OWNER_EMAIL, replyTo: lead.email, ...notification }),
      inviaEmail('contatti:risposta-automatica', { to: lead.email, ...autoReply }),
    ]);

    res.json({ success: true });
  });

  router.post('/api/media-kit-lead', async (req, res) => {
    const { email, company, website, topic, message, budget, period } = req.body as {
      email?: string;
      company?: string;
      website?: string;
      topic?: string;
      message?: string;
      budget?: string;
      period?: string;
    };

    if (
      !email?.trim() ||
      !company?.trim() ||
      !topic?.trim() ||
      !message?.trim() ||
      !budget?.trim() ||
      !period?.trim()
    ) {
      res.status(400).json({ error: 'Compila azienda, email, focus, budget, periodo e brief.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Email non valida.' });
      return;
    }

    const lead = {
      email: email.trim(),
      company: company.trim(),
      website: website?.trim(),
      focus: topic.trim(),
      brief: message.trim(),
      budget: budget.trim(),
      period: period.trim(),
    };

    try {
      const salvato = await saveLeadBackup({
        type: 'media-kit',
        source: 'media-kit-page',
        email: lead.email,
        company: lead.company,
        website: lead.website,
        topic: lead.focus,
        message: lead.brief,
        budget: lead.budget,
        period: lead.period,
      });
      if (!salvato) {
        res.status(503).json({ error: 'Invio temporaneamente non disponibile. Riprova tra poco.' });
        return;
      }
    } catch (error) {
      console.error('Media kit lead save failed:', error);
      res.status(500).json({ error: 'Impossibile salvare la richiesta.' });
      return;
    }

    const notification = renderMediaKitNotification(lead);
    const autoReply = renderMediaKitAutoReply({
      company: lead.company,
      mediaKitUrl: MEDIA_KIT_URL,
    });

    void Promise.all([
      inviaEmail('media-kit:notifica', { to: OWNER_EMAIL, replyTo: lead.email, ...notification }),
      inviaEmail('media-kit:risposta-automatica', { to: lead.email, ...autoReply }),
    ]);

    res.json({ success: true });
  });

  router.post('/api/create-checkout-session', async (req, res) => {
    try {
      const stripe = getStripe();
      const body = req.body as {
        items?: unknown;
        couponCode?: string;
        userId?: string; // accettato per backward-compat ma ignorato se id-token presente
        userEmail?: string; // idem
      };

      // M8 fix: verifica id-token Firebase se presente, e usa i valori
      // verificati invece di quelli dal body (evita pollution storico ordini).
      // Se l'id-token manca, l'ordine resta anonimo (userId vuoto): coerente
      // con il pattern guest checkout, niente pollution lato Firestore.
      const verifiedIdentity = await verifyOptionalIdToken(req.headers.authorization);
      const trustedUserId = verifiedIdentity?.uid || '';
      const trustedUserEmail = verifiedIdentity?.email || '';

      const requestedItems = Array.isArray(body.items)
        ? body.items.filter(isCheckoutRequestItem)
        : [];

      if (requestedItems.length === 0) {
        res.status(400).json({ error: 'No valid items received.' });
        return;
      }

      const normalizedCouponCode =
        typeof body.couponCode === 'string' && body.couponCode.trim().length > 0
          ? body.couponCode.trim().toUpperCase()
          : '';
      const coupon = normalizedCouponCode ? await fetchCouponByCode(normalizedCouponCode) : null;

      if (normalizedCouponCode && !coupon) {
        res.status(400).json({ error: 'Coupon non valido o scaduto.' });
        return;
      }

      const checkoutItems = (
        (await Promise.all(
          requestedItems.map(async (item) => {
            const product = await fetchProductById(item.id);

            if (!product) {
              return null;
            }

            return {
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              quantity: item.quantity,
            } satisfies CheckoutItem;
          })
        )) as Array<CheckoutItem | null>
      ).filter((item): item is CheckoutItem => item !== null);

      if (checkoutItems.length !== requestedItems.length) {
        res.status(400).json({ error: 'One or more products are invalid or unavailable.' });
        return;
      }

      if (!stripe) {
        if (process.env.ALLOW_MOCK_CHECKOUT === 'true') {
          res.json({
            url: '/shop?success=true',
            mock: true,
          });
          return;
        }

        res.status(503).json({ error: 'Checkout is not configured yet.' });
        return;
      }

      const lineItems = checkoutItems.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const stripeDiscount =
        coupon?.type === 'fixed'
          ? await stripe.coupons.create({
              amount_off: Math.min(
                Math.round(coupon.value * 100),
                Math.max(
                  0,
                  lineItems.reduce(
                    (sum, item) => sum + item.price_data.unit_amount * item.quantity,
                    0
                  )
                )
              ),
              currency: 'eur',
              duration: 'once',
              name: coupon.code,
              metadata: {
                source: 'travelliniwithus',
                couponCode: coupon.code,
              },
            })
          : coupon
            ? await stripe.coupons.create({
                percent_off: coupon.value,
                duration: 'once',
                name: coupon.code,
                metadata: {
                  source: 'travelliniwithus',
                  couponCode: coupon.code,
                },
              })
            : null;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/shop?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        customer_email: trustedUserEmail || body.userEmail || undefined,
        discounts: stripeDiscount ? [{ coupon: stripeDiscount.id }] : undefined,
        metadata: {
          userId: trustedUserId,
          userEmail: trustedUserEmail,
          couponCode: coupon?.code || '',
          cartItems: JSON.stringify(
            checkoutItems.map((item) => ({ id: item.id, quantity: item.quantity }))
          ),
        },
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Checkout non disponibile in questo momento.' });
    }
  });

  /**
   * AI verification — admin only. Sostituisce il vecchio client-side
   * `aiVerificationService` che leggeva VITE_GEMINI_API_KEY (leak bundle).
   * Verifica id-token + email whitelist, poi chiama Gemini server-side con
   * `GEMINI_API_KEY` (mai esposta al client).
   */
  router.post('/api/admin/ai-verify', async (req, res) => {
    try {
      const identity = await verifyOptionalIdToken(req.headers.authorization);
      const adminEmail = process.env.ADMIN_EMAIL || 'skotynyanskiy@gmail.com';
      if (!identity || identity.email?.toLowerCase() !== adminEmail.toLowerCase()) {
        res.status(403).json({ error: 'Forbidden: admin only.' });
        return;
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        res
          .status(503)
          .json({ error: 'AI verification non configurata (GEMINI_API_KEY mancante).' });
        return;
      }

      const body = req.body as { mode?: 'search' | 'maps'; content?: string; title?: string };
      const mode = body.mode === 'maps' ? 'maps' : 'search';
      const content = typeof body.content === 'string' ? body.content : '';
      const title = typeof body.title === 'string' ? body.title : '';

      if (!content || content.length < 50 || content.length > 50000) {
        res.status(400).json({ error: 'Contenuto non valido (50-50000 caratteri).' });
        return;
      }

      // Dynamic import: non vogliamo che `@google/genai` finisca nel bundle
      // server di partenza. Lazy.
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: geminiKey });

      const prompt =
        mode === 'search'
          ? `Sei un editor esperto di viaggi. Verifica e arricchisci il seguente articolo. Usa la ricerca Google per fatti storici, culturali e generali precisi e aggiornati. Correggi inesattezze e aggiungi dettagli se utili. Mantieni tono diretto, concreto, autentico — niente retorica luxury/brochure.\n\nTitolo: ${title}\nContenuto:\n${content}\n\nRestituisci SOLO l'articolo revisionato in Markdown.`
          : `Sei un editor esperto di viaggi. Verifica informazioni geografiche e logistiche dell'articolo. Usa Google Maps per nomi luoghi, indirizzi, distanze, vicinanze. Correggi e aggiungi dettagli utili (quartieri, punti d'interesse). Tono diretto, autentico — niente retorica luxury.\n\nTitolo: ${title}\nContenuto:\n${content}\n\nRestituisci SOLO l'articolo revisionato in Markdown.`;

      const response = await ai.models.generateContent({
        model: mode === 'search' ? 'gemini-2.5-flash' : 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [mode === 'search' ? { googleSearch: {} } : { googleMaps: {} }] },
      });

      res.json({ content: response.text || content });
    } catch (err) {
      console.error('[ai-verify] error:', err);
      res.status(500).json({ error: 'AI verification failed.' });
    }
  });

  // Coupon validation endpoint
  router.post('/api/validate-coupon', async (req, res) => {
    const { code } = req.body as { code?: string };
    if (!code || typeof code !== 'string' || !code.trim()) {
      res.status(400).json({ valid: false, error: 'Codice coupon mancante.' });
      return;
    }
    const normalizedCode = code.trim().toUpperCase();
    try {
      const coupon = await fetchCouponByCode(normalizedCode);
      if (!coupon) {
        res.json({ valid: false, error: 'Codice non valido.' });
        return;
      }

      res.json({
        valid: true,
        code: normalizedCode,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      });
    } catch (err) {
      console.error('Coupon validation error:', err);
      res.status(500).json({ valid: false, error: 'Errore durante la validazione.' });
    }
  });

  /*
   * /api/ai-companion — AI Travel Companion "Chiedi a R+B" (Marathon FASE 2.A)
   *
   * Stato attuale: STUB. Endpoint risponde 503 finche ANTHROPIC_API_KEY +
   * OPENAI_API_KEY + vector store non sono configurati.
   *
   * Quando configurato:
   *   1. Embedding query con OpenAI text-embedding-3-small
   *   2. Cosine similarity contro Firestore vector store (collezione `ai_corpus`)
   *   3. Top-K chunks → context window Claude Haiku
   *   4. System prompt severo (vedi src/config/aiCompanion.ts)
   *   5. Refusal patterns deterministic prima del LLM call
   *   6. Cost cap tracking in `ai_companion_usage/{YYYY-MM}`
   *   7. Citation enforcement nel response shape
   *
   * Rate limit: 100/15min generico copre. Per ulteriore protezione anti-abuse
   * aggiungere cap per-session via cookie quando si attiva.
   */
  router.post('/api/ai-companion', async (req, res) => {
    const { query } = req.body as { query?: string; history?: unknown };

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query mancante.' });
      return;
    }
    if (query.length > 500) {
      res.status(400).json({ error: 'Query troppo lunga (max 500 caratteri).' });
      return;
    }

    const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY);
    const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);
    const corpusReady = process.env.AI_COMPANION_CORPUS_READY === 'true';

    if (!hasAnthropicKey || !hasOpenAiKey || !corpusReady) {
      // Mode 'disabled' — client cade su keyword matching demo.
      res.status(503).json({
        error: 'ai-companion-not-configured',
        message: 'Il companion AI non e ancora attivo. Stiamo lavorando per accendere il backend.',
        mode: 'disabled',
      });
      return;
    }

    // TODO Marathon FASE 2.A implementazione completa:
    //   1. const embedding = await openai.embeddings.create({ ... });
    //   2. const chunks = await vectorStore.query({ vector: embedding, topK: AI_COMPANION_TOP_K });
    //   3. const context = chunks.map(c => `[${c.title}](${c.url})\n${c.text}`).join('\n---\n');
    //   4. const response = await anthropic.messages.create({
    //        model: AI_COMPANION_MODEL,
    //        max_tokens: AI_COMPANION_MAX_OUTPUT_TOKENS,
    //        system: AI_COMPANION_SYSTEM_PROMPT,
    //        messages: [{ role: 'user', content: `Contesto:\n${context}\n\nDomanda: ${query}` }],
    //      });
    //   5. await incrementCostTracker({ inputTokens, outputTokens });
    //   6. res.json({ reply: response.content[0].text, sources: chunks.map(c => ({ title, url })) });
    res.status(503).json({
      error: 'ai-companion-implementation-pending',
      mode: 'maintenance',
    });
  });

  return router;
}
