---
type: bug
area: delivery
status: open
priority: p0
owner: team
repo: TRAVELLINIWITHUS
source: audit ambiente di lavoro 2026-07-26
tags:
  - bug
  - delivery
  - blocker
  - release
---

# Gli 8 endpoint `/api/*` non hanno un backend in produzione

## Stato 2026-08-02 — fix locale pronto, produzione ancora da verificare

Il testo storico sotto descriveva il deploy del 2026-07-26. Nel branch di
lavoro attuale sono ora presenti:

- Function HTTP api e rewrite Hosting /api/\*\* → europe-west1;
- hook Firebase che costruisce functions/lib/index.js prima del deploy;
- dipendenza runtime esplicita firebase-admin;
- parametri obbligatori APP_URL e FIRESTORE_DATABASE_ID, più binding dei
  segreti Stripe, Resend, Brevo, OpenAI, Anthropic e Gemini;
- gate CI/predeploy: install, build e smoke test del bundle.

Lo smoke locale verifica che /api/health restituisca **503** senza la
configurazione obbligatoria e **200 JSON** quando è presente. Non è stato
eseguito alcun deploy né impostato un segreto reale: il bug resta aperto finché
un owner non valida sulla revisione Firebase effettivamente pubblicata
Hosting → Function, Firestore e le integrazioni abilitate.

## Sintesi

> Nota storica: questa sintesi era corretta al 2026-07-26; non descrive più
> l'albero locale corrente.

Il client chiama 8 endpoint `/api/*`. In produzione **nessuno di questi esiste**:
`firebase.json` dichiara solo `hosting` e `firestore`, senza `functions` e senza
rewrite verso Cloud Run. L'unico rewrite è `**` → `/index.html`, quindi ogni
chiamata a `/api/...` riceve lo shell HTML della SPA invece di JSON.

`server.ts` (~2000 righe, dove gli endpoint sono realmente definiti) gira **solo**
con `npm run dev`. Non è mai stato messo in condizione di girare in produzione.

## Prova

Richiesta reale al dominio Firebase del progetto, 2026-07-26:

```
GET https://gen-lang-client-0138696306.web.app/api/health
→ HTML della SPA ("Travelliniwithus / Rodrigo & Betta"), non JSON
```

Atteso: `app.get('/api/health', ...)` a [server.ts:1311](../../server.ts).

Ricognizione a supporto:

- `firebase.json` → chiavi `['hosting','firestore']`, `functions` assente.
- Nessuna directory `functions/`.
- Nessun `Dockerfile`, `cloudbuild.yaml`, `apphosting.yaml`, `app.yaml`,
  `vercel.json`, `netlify.toml`.
- Nessuno step di deploy in `.github/workflows/ci.yml`.
- Le sole chiavi Stripe in `.env.example` sono server-side
  (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CLUB_PRICE_ID`):
  il checkout non può funzionare interamente lato client.

## Superficie rotta al primo deploy

| Endpoint                       | Definito a       | Chiamato da                                                                                                          |
| ------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/api/newsletter-subscribe`    | `server.ts:1510` | `Newsletter.tsx`, `VieniConNoi.tsx`, `ClubMembershipHero.tsx`, `DiarioConversionSection.tsx`, `SentieroLeadForm.tsx` |
| `/api/contact-lead`            | `server.ts:1596` | `Contatti.tsx`                                                                                                       |
| `/api/media-kit-lead`          | `server.ts:1654` | `MediaKit.tsx`                                                                                                       |
| `/api/create-checkout-session` | `server.ts:1728` | `CartDrawer.tsx`                                                                                                     |
| `/api/validate-coupon`         | `server.ts:1931` | `CartDrawer.tsx`                                                                                                     |
| `/api/ai-companion`            | `server.ts:1976` | `AiAssistant.tsx`                                                                                                    |
| `/api/admin/ai-verify`         | `server.ts:1880` | `aiVerificationService.ts`                                                                                           |
| `/api/webhook` (Stripe)        | `server.ts:1315` | Stripe                                                                                                               |

In pratica: **raccolta lead, contatti, media kit, coupon, checkout e assistente AI
sono tutti non funzionanti** appena il sito va online così com'è. Il webhook Stripe
non ha un indirizzo a cui arrivare, quindi nessun pagamento verrebbe confermato.

## Perché non se n'è accorto nessuno

`travelliniwithus.it` oggi serve una pagina **"SITO IN COSTRUZIONE"** che non
esiste in questo repository: il dominio non punta al progetto Firebase. Il sito
vero non è ancora esposto al pubblico, quindi il guasto non è visibile. È un
blocco al lancio, non un incidente in corso.

## Opzioni

1. **Firebase Functions** — aggiungere `functions` a `firebase.json` più un
   rewrite `/api/**` verso la function, e adattare l'app Express a
   `onRequest`. È il percorso con meno attrito: resta tutto in Firebase.
2. **Cloud Run** — containerizzare `server.ts` e puntarci il rewrite `/api/**`.
   Più adatto se il server deve restare un Express completo (rate limit,
   webhook con body raw).
3. **Riduzione della superficie** — spostare newsletter/lead direttamente su
   Firestore dal client con regole di sicurezza adeguate, e tenere il server solo
   per Stripe. Riduce il backend ma richiede regole Firestore scritte con cura
   (`firestore.rules` è file ad alto rischio).

La scelta è dell'owner. Il punto non negoziabile: **il gate di pre-deploy deve
includere una verifica che gli endpoint rispondano JSON in produzione**, altrimenti
lo stesso guasto può tornare.

## Correlati

- [[DECISION_AMBIENTE_LAVORO_2026-07-26]]
- `docs/10_Projects/PROJECT_RELEASE_READINESS.md` — da aggiornare: dichiara gate
  PASS mentre questo blocco è aperto.
