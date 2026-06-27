---
type: project
area: security
status: open
priority: p0
owner: Skott
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_RELEASE_READINESS]]'
source: gitleaks scan 2026-05-14 + repo visibility check
tags:
  - project
  - security
  - firebase
  - hardening
---

# PROJECT_FIREBASE_HARDENING

## Contesto

Il repository GitHub `skotynyanskiy-create/TRAVELLINIWITHUS` e' pubblico.
Il file `firebase-applet-config.json` (root) non deve contenere la Firebase Web
API key reale. Gitleaks ha segnalato un valore storico come `gcp-api-key` nel
commit `f43be44144`.

Una Web API key Firebase **non e' un secret tradizionale**: viene comunque
spedita al client in produzione perche' fa parte di `firebaseConfig`. Identifica
il progetto, non autentica.

Il rischio reale non e' la key in se ma le mancate barriere a valle:

1. accesso senza filtri al backend (Firestore, Auth API)
2. burn di quota / costi
3. abuso di endpoint Auth (sign-in attempt, reset password spam)
4. enumeration del progetto

## Obiettivo

Indurire l'esposizione Firebase del progetto a livelli production-grade
**prima del deploy pubblico**.

## Stato 2026-06-07

- Valore reale rimosso da `firebase-applet-config.json`.
- Valore reale rimosso da questa nota.
- `src/lib/firebaseApp.ts` legge la Web API key da `VITE_FIREBASE_API_KEY`.
- `.env.example` documenta `VITE_FIREBASE_API_KEY`.
- `src/context/AuthContext.tsx` evita init Auth se la key manca, cosi le pagine pubbliche non emettono `auth/invalid-api-key`.
- `npm run audit:secrets` resta FAIL per leak storici in git history: serve azione owner su GCP e decisione su history rewrite.

Decisione operativa: prima del deploy pubblico, impostare `VITE_FIREBASE_API_KEY`
in env produzione e confermare restrizioni GCP. Dopo rotazione/restrizione,
il leak storico diventa gestibile; senza conferma, resta blocker.

## Piano operativo

### Fase 1 — GCP Console: restrizioni sulla API key (15 minuti)

Console GCP → APIs & Services → Credentials → trova la Firebase Web API key
del progetto → Edit:

1. **Application restrictions**: scegli "HTTP referrers (web sites)".
   Inserire come referrer accettati:
   - `travelliniwithus.it/*`
   - `*.travelliniwithus.it/*`
   - `localhost:3000/*` (per dev)
   - `localhost:5173/*` (per Vite dev)
2. **API restrictions**: scegli "Restrict key" e lascia abilitati solo i servizi
   effettivamente usati. Per Travelliniwithus servono almeno:
   - Identity Toolkit API (Firebase Auth)
   - Cloud Firestore API
   - Firebase Installations API
   - FCM Registration API (se PWA notifiche)
   - Cloud Storage for Firebase API (se upload immagini admin)

Salva. La chiave continua a funzionare dal sito ma non e' usabile da terzi
ospitati su domini diversi.

Nota repo: il valore reale della Web API key non deve essere scritto nei docs
o in `firebase-applet-config.json`. Usare `VITE_FIREBASE_API_KEY` in `.env`
locale/produzione.

### Fase 2 — Firestore Rules: verifica (gia' fatta)

Le `firestore.rules` sono **gia' tight**. Letta in audit 2026-05-14:

- `users`: read/write solo owner o admin
- `articles`, `products`: read solo se `published == true`, write solo admin
- `leads`: create da anonimo (necessario per form), read/update/delete solo admin
- `orders`: create anonimo (necessario per webhook server-side), read solo
  owner via uid/email match o admin
- `settings`, `siteContent`, `coupons`: read pubblico, write solo admin
- `logs`: read e write solo admin

**Action item**: confermare che `orders` venga creato **solo** dal webhook
Stripe lato server (admin SDK bypassa le rules). Se anche il client crea
ordini, qualunque visitatore puo' spammare order documents.

Verifica con: `grep -rn "collection('orders').add\|addDoc.*orders" src/`

### Fase 3 — App Check (30 minuti)

Firebase Console → App Check → Get Started.

1. Provider: **reCAPTCHA Enterprise** (consigliato — meno friction di
   reCAPTCHA v3, integrazione nativa con GCP)
2. Crea una nuova reCAPTCHA Enterprise key per `travelliniwithus.it`
3. Registra il sito web tra le app
4. Configura **enforcement mode**: lascia "Unenforced" (logging only)
   per 1-2 settimane per raccogliere baseline. Poi attiva "Enforced" su
   Firestore, Auth, Storage.

Codice client da aggiungere in `src/lib/firebaseApp.ts`:

```typescript
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}
```

Aggiungi `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` in `.env` e `.env.example`.

### Fase 4 — Cleanup config (10 minuti)

`firebase-applet-config.json` e' attualmente committato in root. E' un artefatto
generato da Firebase Studio (AI Applet) — non e' un file necessario al
funzionamento se la config viene gia' caricata via env.

Verifica come e' usato:

```bash
grep -rn "firebase-applet-config" src/ server.ts scripts/
```

Risultati attuali (audit 2026-05-14):

- [src/lib/firebaseApp.ts](src/lib/firebaseApp.ts) — import diretto
- [server.ts](server.ts) — referenza
- [scripts/generate-media-kit.tsx](scripts/generate-media-kit.tsx) — referenza

**Opzione A (raccomandata)**: spostare i valori in `.env` come
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, ecc. Costruire
firebaseConfig dinamicamente da env. Rimuove la dipendenza da file
trackato.

**Opzione B**: lasciare il file ma aggiungere a `.gitignore` e
forzare unstaging dal repo. La chiave resta nella history (gia'
indicizzata da gitleaks): per rimuoverla davvero serve `git filter-repo`
o BFG, **non strettamente necessario** se la Fase 1 e' eseguita.

### Fase 5 — Monitoring continuo

1. Abilitare `npm run audit:secrets` (gitleaks) nel pre-commit hook
2. Aggiungere alert su GCP per spike di Auth quota / Firestore reads
   sospetti
3. Considerare repo private se non c'e' motivo strategico per esserci
   pubblico (visibilita' open source, hiring portfolio, etc.)

## Done quando

- [ ] Fase 1 completata: API key restrittiva su domini
- [ ] Fase 2 verificata: orders creati solo server-side
- [ ] Fase 3 completata: App Check enforced
- [ ] Fase 4 completata: config in env, file unstaged
- [ ] Fase 5 attiva: pre-commit hook + GCP alert

## Note operative

- Se la repo deve restare pubblica per portfolio, motiva la decisione
  in README e accetta che ogni file trackato e' indicizzato da motori
  e bot. Non committare mai `.env`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`,
  `FIREBASE_SERVICE_ACCOUNT`.
- Se la repo passa a private, comunicalo a strumenti che dipendono da
  webhook GitHub pubblici (eventuali CI esterni).
