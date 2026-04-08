# Travelliniwithus

Sito editoriale e commerciale costruito con `React`, `Vite`, `Express` e `Firebase` per il progetto Travelliniwithus.

## Stack

- Frontend: `React 19`, `React Router`, `TanStack Query`, `Tailwind CSS`
- Backend runtime: `Express` + `Vite` server
- Dati: `Firebase / Firestore`
- Commerce: `Stripe`
- Lead capture: endpoint server + eventuale sync `Brevo`
- QA: `Vitest`, `Playwright`, audit custom del repo

## Requisiti

- `Node.js` 22+
- accesso al progetto Firebase collegato
- chiavi env solo se usi le relative integrazioni

## Avvio locale

1. Installa le dipendenze:

```bash
npm ci
```

2. Crea il file `.env.local` partendo da `.env.example`.

3. Avvia il server locale:

```bash
npm run dev
```

4. Apri `http://localhost:3000`.

## Variabili ambiente

Le variabili supportate sono documentate in [.env.example](/c:/Users/admin/Downloads/TRAVELLINIWITHUS-codex-local-import-20260408/.env.example).

Le più importanti:

- `APP_URL`: URL canonico dell'app
- `STRIPE_SECRET_KEY`: chiave server Stripe
- `STRIPE_WEBHOOK_SECRET`: secret webhook Stripe
- `ALLOW_MOCK_CHECKOUT`: abilita checkout mock in locale
- `BREVO_API_KEY`: sync contatti newsletter
- `VITE_GEMINI_API_KEY`: chiave client per gli strumenti AI interni
- `VITE_ENABLE_DEMO_CONTENT`: abilita contenuti demo solo in dev/staging
- `ENABLE_DEMO_CONTENT`: equivalente server-side per route demo e SSR

## Config Firebase

Il frontend legge la configurazione da `firebase-applet-config.json`.

Il backend usa lo stesso file per costruire le chiamate Firestore REST. Se cambi progetto o database, aggiorna quel file in modo coerente.

## Comandi utili

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:all
npm run predeploy
npm run e2e
```

## Gate consigliati prima di pubblicare

Esegui almeno:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run predeploy
npm run e2e
```

## Policy operative del progetto

- nessun contenuto demo deve comparire in produzione
- le CTA pubbliche devono puntare solo a flussi reali
- `previewAdmin=1` è una scorciatoia locale di sviluppo, non un accesso di produzione
- gli errori runtime client vengono inviati a `/api/client-error` quando il monitoring remoto è attivo

## Stato del progetto

Questo repo è pensato per una `V1` pubblica del sito Travelliniwithus: priorità a brand coherence, funnel pubblico, lead capture, shop reale e QA di rilascio.
