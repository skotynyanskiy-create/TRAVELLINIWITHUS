---
type: reference
area: api
status: active
owner: team
tags:
  - api
  - backend
  - deployment
---

# API Contract

Base URL:

- Locale full-stack: `http://localhost:3000`
- Produzione raccomandata: API Express su runtime Node dedicato e frontend statico con `VITE_API_BASE_URL`
- Se il deploy resta Vercel-only, gli endpoint sotto devono essere migrati in Vercel Functions prima del go-live

## Health

`GET /api/health`

- Auth: none
- Response 200: `{ "status": "ok" }`
- Uso: smoke post-deploy e monitor base

## Newsletter

`POST /api/newsletter-subscribe`

- Auth: none
- Rate limit: 3/min/IP
- Body: `{ "email": "nome@example.com", "source": "newsletter_form" }`
- Response 200: `{ "success": true }`
- Errori: `400` email non valida, `429` rate limit, `500` errore server
- Persistenza: `leads` con `type: newsletter`

## Contact Lead

`POST /api/contact-lead`

- Auth: none
- Rate limit: 5/10min/IP
- Body: `{ "name": "...", "email": "...", "topic": "...", "message": "..." }`
- Response 200: `{ "success": true }`
- Persistenza: `leads` con `type: contact`

## Media Kit Lead

`POST /api/media-kit-lead`

- Auth: none
- Rate limit: 5/10min/IP
- Body: `{ "email": "...", "company": "...", "website": "...", "topic": "...", "message": "..." }`
- Response 200: `{ "success": true, "mediaKitUrl": "..." }`
- Persistenza: `leads` con `type: media-kit`

## Stripe Checkout

`POST /api/create-checkout-session`

- Auth: none per checkout pubblico; user id/email opzionali se disponibili
- Rate limit: 20/15min/IP
- Body: `{ "items": [{ "id": "productId", "quantity": 1 }], "couponCode": "OPTIONAL" }`
- Response 200: `{ "url": "https://checkout.stripe.com/..." }` oppure mock URL solo se `ALLOW_MOCK_CHECKOUT=true`
- Errori: `400` payload non valido, `404` prodotto non trovato, `503` Stripe non configurato
- Regola: ordini definitivi si persistono solo dopo webhook Stripe valido

## Stripe Webhook

`POST /api/webhook`

- Auth: firma Stripe `stripe-signature`
- Body: raw `application/json`
- Env richiesti: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Eventi principali: `checkout.session.completed`
- Persistenza: `orders`

## Coupon Validation

`POST /api/validate-coupon`

- Auth: none
- Body: `{ "code": "ABC123" }`
- Response valid: `{ "valid": true, "code": "...", "type": "percent|fixed", "value": 10, "description": "..." }`
- Response invalid: `{ "valid": false, "error": "..." }`

## AI Admin Endpoints

`POST /api/ai/verify-search`

`POST /api/ai/verify-maps`

- Auth: Firebase ID token con custom claim `admin=true`
- Rate limit: dedicato `/api/ai/*`
- Env richiesto: `GEMINI_API_KEY`
- Uso: solo admin editoriale

## SEO Feeds

`GET /sitemap.xml`

`GET /rss.xml`

- Auth: none
- Le URL articolo devono usare `/guide/:slug` o `/itinerari/:slug`, non legacy `/articolo/:slug`

## CORS

- In produzione sono accettati solo `APP_URL`, `FRONTEND_URL`, `STAGING_URL`, `https://travelliniwithus.it`, `https://www.travelliniwithus.it`.
- In locale l'origine non viene bloccata.

## Error Shape

Le API pubbliche devono rispondere con:

- Successo: `{ "success": true, ... }`
- Errore: `{ "error": "Messaggio leggibile" }`

Non esporre stack trace, token, payload Stripe completi o dati personali nei log client.
