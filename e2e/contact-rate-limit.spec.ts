import { test, expect, type APIRequestContext } from '@playwright/test';

/**
 * Prova runtime del `contactLimiter` (server.ts:1278-1288): 5 richieste per IP
 * ogni 10 minuti su /api/contact-lead, poi HTTP 429.
 *
 * Nasce da TASK-004 / [AUDIT-003], che dava il limiter per assente cercandolo
 * su `/api/contact` — una route che non esiste. L'endpoint reale e
 * `/api/contact-lead` e il limiter c'era gia: questo spec sostituisce
 * l'ispezione statica con una verifica eseguita.
 */

const CONTACT_ENDPOINT = '/api/contact-lead';
const LIMIT = 5;

/** Messaggio prodotto SOLO dal limiter (server.ts:1283). */
const LIMITER_MESSAGE = 'Troppi invii ravvicinati. Riprova tra qualche minuto.';

/**
 * Payload con honeypot valorizzato: l'handler cortocircuita a server.ts:1588
 * restituendo 200 senza scrivere su Firestore e senza inviare email. Cosi le
 * richieste "sotto soglia" esercitano il limiter a effetto collaterale zero.
 */
const HONEYPOT_PAYLOAD = {
  name: 'Rate Limit Probe',
  email: 'probe@example.invalid',
  topic: 'other',
  message: 'Sonda automatica del rate limiter.',
  website: 'https://honeypot.invalid',
};

/**
 * IP sintetico diverso per ogni test, pescato a caso nei 131072 indirizzi di
 * 198.18.0.0/15 (range benchmark RFC 2544, mai instradato).
 *
 * Serve perche il limiter usa lo store in memoria: il dev server viene riusato
 * tra un run e l'altro (`reuseExistingServer`) e i test girano in parallelo
 * (`fullyParallel`), quindi un IP fisso — o un contatore, che riparte da zero
 * in ogni worker — porterebbe test diversi a spartirsi lo stesso budget.
 * L'header funziona perche server.ts:1186 imposta `trust proxy: 1`, quindi
 * `req.ip` viene letto da X-Forwarded-For.
 */
function freshClientIp(): string {
  const n = Math.floor(Math.random() * 131072);
  return `198.${18 + (n >>> 16)}.${(n >>> 8) & 255}.${n & 255}`;
}

/** Esaurisce il budget di `ip` e restituisce la prima risposta bloccata. */
async function exhaustBudget(request: APIRequestContext, ip: string) {
  for (let i = 0; i < LIMIT; i++) {
    await request.post(CONTACT_ENDPOINT, {
      headers: { 'X-Forwarded-For': ip },
      data: HONEYPOT_PAYLOAD,
    });
  }
  return request.post(CONTACT_ENDPOINT, {
    headers: { 'X-Forwarded-For': ip },
    data: HONEYPOT_PAYLOAD,
  });
}

test.describe('POST /api/contact-lead — rate limiting', () => {
  test('accetta 5 richieste per IP e blocca la sesta con 429', async ({ request }) => {
    const ip = freshClientIp();

    for (let i = 1; i <= LIMIT; i++) {
      const res = await request.post(CONTACT_ENDPOINT, {
        headers: { 'X-Forwarded-For': ip },
        data: HONEYPOT_PAYLOAD,
      });

      expect(res.status(), `richiesta ${i}/${LIMIT} non deve essere bloccata`).toBe(200);
    }

    const blocked = await request.post(CONTACT_ENDPOINT, {
      headers: { 'X-Forwarded-For': ip },
      data: HONEYPOT_PAYLOAD,
    });

    expect(blocked.status()).toBe(429);

    // standardHeaders: true => draft-6. Gli header si asseriscono solo qui:
    // sulle risposte passanti li sovrascrive il generalApiLimiter (vedi il
    // test successivo), mentre sul 429 la catena si ferma al contactLimiter.
    expect(blocked.headers()['ratelimit-limit']).toBe(String(LIMIT));
    expect(blocked.headers()['ratelimit-remaining']).toBe('0');
    expect(blocked.headers()['ratelimit-reset']).toBeDefined();
    expect(blocked.headers()['ratelimit-policy']).toContain(String(LIMIT));
  });

  test('gli header sulle risposte passanti espongono il limite generico, non quello contatti', async ({
    request,
  }) => {
    const res = await request.post(CONTACT_ENDPOINT, {
      headers: { 'X-Forwarded-For': freshClientIp() },
      data: HONEYPOT_PAYLOAD,
    });

    expect(res.status()).toBe(200);

    // Comportamento noto, non un difetto di sicurezza: il generalApiLimiter
    // (server.ts:1292, 100/15min) e montato DOPO il contactLimiter (:1287) e
    // ne sovrascrive gli header RateLimit-*. Il blocco reale avviene comunque
    // a 5 (test sopra); e solo l'annuncio al client a essere impreciso.
    // Asserito per accorgersi se l'ordine dei mount cambia.
    expect(res.headers()['ratelimit-limit']).toBe('100');
  });

  test('la richiesta bloccata non raggiunge mai l handler, quindi non parte email', async ({
    request,
  }) => {
    const blocked = await exhaustBudget(request, freshClientIp());

    expect(blocked.status()).toBe(429);

    // Il body e il messaggio del limiter, non uno dei messaggi dell'handler
    // ("Tutti i campi obbligatori...", "Email non valida.", "Impossibile
    // salvare la richiesta."). Il limiter e montato a server.ts:1287, prima di
    // express.json (:1435) e dell'handler (:1579), e chiude la risposta senza
    // chiamare next(): saveLeadBackup e sendEmail restano irraggiungibili.
    expect(await blocked.json()).toEqual({ error: LIMITER_MESSAGE });
  });

  test('anche le richieste invalide consumano il budget', async ({ request }) => {
    const ip = freshClientIp();

    // skipFailedRequests e false di default: uno spammer non puo aggirare il
    // limite mandando payload malformati.
    for (let i = 1; i <= LIMIT; i++) {
      const res = await request.post(CONTACT_ENDPOINT, {
        headers: { 'X-Forwarded-For': ip },
        data: {},
      });
      expect(res.status(), `richiesta invalida ${i}/${LIMIT}`).toBe(400);
    }

    const blocked = await request.post(CONTACT_ENDPOINT, {
      headers: { 'X-Forwarded-For': ip },
      data: HONEYPOT_PAYLOAD,
    });

    expect(blocked.status()).toBe(429);
  });

  test('il blocco resta confinato all endpoint contatti', async ({ request }) => {
    const ip = freshClientIp();

    expect((await exhaustBudget(request, ip)).status()).toBe(429);

    const health = await request.get('/api/health', { headers: { 'X-Forwarded-For': ip } });
    expect(health.status()).toBe(200);
    expect(await health.json()).toEqual({ status: 'ok' });

    const home = await request.get('/', { headers: { 'X-Forwarded-For': ip } });
    expect(home.status()).toBe(200);
  });

  test('/api/media-kit-lead condivide lo stesso budget', async ({ request }) => {
    const ip = freshClientIp();

    expect((await exhaustBudget(request, ip)).status()).toBe(429);

    // server.ts:1287-1288 monta la STESSA istanza di limiter sulle due route,
    // quindi lo store e condiviso. Voluto: stesso vettore di abuso, un solo
    // budget per IP. Asserito per renderlo esplicito, non accidentale.
    const mediaKit = await request.post('/api/media-kit-lead', {
      headers: { 'X-Forwarded-For': ip },
      data: { email: 'probe@example.invalid' },
    });

    expect(mediaKit.status()).toBe(429);
  });
});
