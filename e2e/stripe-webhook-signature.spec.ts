import { test, expect } from '@playwright/test';
import { createHmac } from 'node:crypto';

/**
 * Prova runtime della verifica di firma su POST /api/webhook (server.ts:1298).
 *
 * Nasce da TASK-003, il cui tag evidenza era `[FILE]`: la firma risultava
 * verificata per sola ispezione statica. Qui si dimostra che l'endpoint
 * rifiuta davvero cio' che non e' firmato da Stripe, e che il rifiuto avviene
 * prima di qualunque persistenza.
 *
 * Nota: l'esito e' 400 sia quando `STRIPE_WEBHOOK_SECRET` manca (server.ts:1303
 * chiude subito) sia quando c'e' ma la firma non torna (constructEvent lancia,
 * :1312). Il test e' quindi valido a prescindere dall'ambiente locale.
 */

const WEBHOOK_ENDPOINT = '/api/webhook';

/** Evento plausibile: se la firma passasse, creerebbe un ordine. */
const FAKE_EVENT = JSON.stringify({
  id: 'evt_test_forged',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_forged',
      amount_total: 9900,
      customer_details: { name: 'Attaccante', email: 'forged@example.invalid' },
      metadata: {},
    },
  },
});

/** Firma nel formato Stripe (`t=...,v1=...`) ma prodotta con un secret arbitrario. */
function forgedSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  return `t=${timestamp},v1=${digest}`;
}

test.describe('POST /api/webhook — verifica firma Stripe', () => {
  test('rifiuta una richiesta senza header stripe-signature', async ({ request }) => {
    const res = await request.post(WEBHOOK_ENDPOINT, {
      headers: { 'Content-Type': 'application/json' },
      data: FAKE_EVENT,
    });

    expect(res.status()).toBe(400);
    expect(await res.text()).toContain('Webhook Error');
  });

  test('rifiuta una firma malformata', async ({ request }) => {
    const res = await request.post(WEBHOOK_ENDPOINT, {
      headers: { 'Content-Type': 'application/json', 'stripe-signature': 'non-una-firma' },
      data: FAKE_EVENT,
    });

    expect(res.status()).toBe(400);
    expect(await res.text()).toContain('Webhook Error');
  });

  test('rifiuta una firma ben formata ma prodotta con il secret sbagliato', async ({ request }) => {
    const res = await request.post(WEBHOOK_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': forgedSignature(FAKE_EVENT, 'whsec_secret_non_valido'),
      },
      data: FAKE_EVENT,
    });

    // E' il caso che conta: payload credibile, formato della firma corretto,
    // solo il secret e' sbagliato. Senza constructEvent qui nascerebbe un
    // ordine falso in Firestore.
    expect(res.status()).toBe(400);
    expect(await res.text()).toContain('Webhook Error');
  });

  test('nessuna richiesta non firmata viene mai accettata', async ({ request }) => {
    // Annotato: il primo caso omette apposta `stripe-signature`, e senza il tipo
    // esplicito l'inferenza lo marca `?: undefined` su tutta la lista, che
    // Playwright non accetta come header.
    const attempts: Record<string, string>[] = [
      { 'Content-Type': 'application/json' },
      { 'Content-Type': 'application/json', 'stripe-signature': '' },
      { 'Content-Type': 'application/json', 'stripe-signature': 't=0,v1=0' },
      {
        'Content-Type': 'application/json',
        'stripe-signature': forgedSignature(FAKE_EVENT, 'whsec_altro_secret'),
      },
    ];

    for (const headers of attempts) {
      const res = await request.post(WEBHOOK_ENDPOINT, { headers, data: FAKE_EVENT });
      expect(res.status()).toBe(400);
      // `{ received: true }` e' la risposta di successo dell'handler: non deve
      // mai comparire senza una firma valida.
      expect(await res.text()).not.toContain('received');
    }
  });

  test('il webhook resta fuori dal rate limit generico', async ({ request }) => {
    // Regressione di docs/14_Bugs/BUG_2026-05-15_webhook_in_general_rate_limit.md:
    // se il webhook ricadesse sotto generalApiLimiter (100/15min, server.ts:1264)
    // un burst di retry Stripe durante un outage verrebbe throttlato e gli
    // ordini andrebbero persi definitivamente dopo 3 giorni di tentativi.
    const burst = 120;
    const statuses = new Set<number>();

    for (let i = 0; i < burst; i++) {
      const res = await request.post(WEBHOOK_ENDPOINT, {
        headers: { 'Content-Type': 'application/json' },
        data: FAKE_EVENT,
      });
      statuses.add(res.status());
    }

    expect(statuses.has(429), `${burst} richieste non devono mai produrre 429`).toBe(false);
    expect([...statuses]).toEqual([400]);
  });
});
