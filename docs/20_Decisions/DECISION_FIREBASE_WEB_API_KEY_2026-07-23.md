---
title: 'DECISION — Chiave Firebase Web API: restringere, non ruotare'
type: decision
status: active
decided: 2026-07-23
decided_by: '[VERIFY: in attesa di applicazione owner su GCP Console]'
area: security
tags:
  - firebase
  - security
  - api-key
  - gcp
# `status: active` vale per LA DECISIONE (restringere, non ruotare), che e presa.
# Lo stato dell'AZIONE e nei tre campi qui sotto, letti da
# scripts/check-public-footprint.mjs: aggiornarli SOLO dopo aver applicato
# davvero la restrizione su GCP Console.
restrizione_applicata: false
restrizione_data: ''
domini_autorizzati: []
---

# DECISION — Chiave Firebase Web API: restringere, non ruotare

Risolve `[AUDIT-002]` / `TASK-002`, il cui titolo originale era "Rotazione **e**
restrizione". L'analisi del 2026-07-23 mostra che la rotazione non è il rimedio
e che la restrizione lo è.

## Fatti accertati (2026-07-23)

**Identificativi** (da `firebase_list_apps` via MCP, non sono segreti):

|                            |                                                                   |
| -------------------------- | ----------------------------------------------------------------- |
| Progetto                   | `gen-lang-client-0138696306` (generato da AI Studio)              |
| Web app                    | `ai-studio-applet-webapp`                                         |
| App ID                     | `1:231770621248:web:96061a2ba15d66e1e9a6a5`                       |
| **API key da restringere** | `apiKeyId: 6f7a0fce-54de-428b-9931-69e308a32efb`                  |
| Billing                    | **disabilitato** — limita l'abuso a consumo di quota, non a costi |

**Esposizione storica** — misurata con la regex `AIza[0-9A-Za-z_-]{35}` sui
commit restituiti da `git log --all -S 'AIza'`:

- **1 sola chiave reale** in tutta la history (fingerprint SHA-256 `bfe5a2e6a546`).
- Presente in **2 file**: `firebase-applet-config.json` e
  `docs/10_Projects/PROJECT_FIREBASE_HARDENING.md`.
- I 7 commit segnalati da `git log -S 'AIza'` includono **falsi positivi**: gli
  script `check-*.mjs`, gli agent `.md` e alcune note contengono la stringa
  letterale `AIza` come parte del _pattern_ di ricerca, non una chiave.
- **Working tree oggi pulito**: nessun file tracciato o untracked contiene la
  chiave. In `firebase-applet-config.json` il campo `apiKey` è una stringa
  vuota; il valore reale arriva da `VITE_FIREBASE_API_KEY` a build time
  (`src/lib/firebaseApp.ts`).

## Decisione

**Applicare la restrizione. Non ruotare la chiave**, salvo evidenza di abuso.

Motivo: una Firebase Web API key **non è un segreto**. È progettata per essere
pubblica ed è incorporata in ogni bundle frontend servito — chiunque apra il
sito la può leggere dal sorgente. Rimuoverla dalla history non la renderebbe
privata, e una chiave nuova sarebbe altrettanto pubblica al primo deploy.

Ne segue che:

- **Riscrivere la history git non serve** e costerebbe un force-push su un repo
  condiviso — operazione vietata senza conferma esplicita dell'owner.
- **La superficie di rischio reale** è una chiave _non ristretta_: consente di
  usare le API del progetto da domini arbitrari e di consumare quota
  Identity Toolkit (spam di signup). Con billing disabilitato il danno è
  denial-of-service sulla quota, non una bolletta.
- **I controlli che contano** sono: restrizione HTTP referrer sulla chiave,
  restrizione delle API abilitate, `firestore.rules`, e i domini autorizzati
  in Firebase Auth.

La rotazione resta un'opzione **dopo** la restrizione, e solo se emerge un uso
anomalo: farla prima aprirebbe una finestra in cui la chiave nuova è ancora
senza restrizioni.

## Runbook — azione owner su GCP Console

Non eseguibile da Claude Code: richiede accesso alla console Google Cloud.

1. Aprire **Google Cloud Console → API e servizi → Credenziali**, progetto
   `gen-lang-client-0138696306`.
2. Selezionare la chiave con ID `6f7a0fce-54de-428b-9931-69e308a32efb`
   (è quella legata a `ai-studio-applet-webapp`).
3. **Restrizioni applicazione → Siti web (HTTP referrer)**, aggiungere:
   - `https://travelliniwithus.it/*`
   - `https://www.travelliniwithus.it/*`
   - il dominio `*.web.app` / `*.firebaseapp.com` del progetto, se il deploy
     Firebase Hosting viene usato in anteprima
   - `http://localhost:3000/*` **solo** se serve autenticarsi in locale con la
     stessa chiave; altrimenti ometterlo e usare gli emulatori
     (`npm run emulators`).
4. **Restrizioni API**: limitare alle sole API effettivamente usate — Identity
   Toolkit, Cloud Firestore, Firebase Installations, Token Service. Escludere
   tutto il resto.
5. Salvare e attendere la propagazione (fino a ~5 minuti).
6. Verificare che il sito in produzione continui a fare login e a leggere
   Firestore. Se qualcosa si rompe, il referrer mancante è quasi sempre la
   causa.
7. **Aggiornare il frontmatter di questo file**: `restrizione_applicata: true`,
   `restrizione_data` con la data e `domini_autorizzati` con l'elenco reale.
   (`status` resta `active`: descrive la decisione, non l'azione.)

Il passo 7 non è burocrazia: `npm run audit:public-footprint` legge quei campi
e continua a segnalare WARN finché non sono compilati.

## Limite dichiarato di questa verifica

I campi qui sopra sono un'**attestazione dell'owner**, non un controllo
tecnico. Nessuno script del repo può leggere lo stato reale delle restrizioni:
servirebbe `apikeys.googleapis.com`, che richiede credenziali GCP che gli agent
non devono maneggiare. Il check serve a rendere il task chiudibile e a tenere
traccia della data, non a dimostrare che la restrizione esista.

## Conseguenze

- `TASK-002` resta aperto ma con un criterio ora verificabile.
- Il WARN permanente in `check-public-footprint.mjs` — che prima era hardcoded
  e non poteva spegnersi mai — diventa condizionale a questi campi.
- Se in futuro la chiave venisse ruotata, aggiornare `apiKeyId` qui sopra.
