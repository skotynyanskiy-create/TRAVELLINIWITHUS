---
type: reference
area: engineering
status: active
tags:
  - troubleshooting
  - dx
  - engineering
---

# Troubleshooting — TRAVELLINIWITHUS

Diagnosi rapida dei problemi comuni. Prima di aprire un bug note in
`docs/14_Bugs/`, controlla se qualcosa qui ti sblocca.

Per problemi di deploy vedi [`DEPLOYMENT_RUNBOOK.md`](./DEPLOYMENT_RUNBOOK.md).
Per incident response vedi [`DISASTER_RECOVERY_RUNBOOK.md`](./DISASTER_RECOVERY_RUNBOOK.md).

---

## 1. Dev server

### `npm run dev` non parte / exit immediato

1. **Node version**: il repo richiede `Node >= 22`. Verifica con `node -v`. Se usi `nvm` → `nvm use 22`.
2. **Port busy**: default `3000`. Se occupato, imposta `PORT=3002 npm run dev` o chiudi il processo (`npx kill-port 3000`).
3. **`tsx` non trovato**: `npm install` non è andato a buon fine. Rilancia.
4. **Env mancanti**: il sito parte anche senza `.env.local`. Se fallisce leggendo env, è un bug — aprire bug note.

### Dev server parte ma la homepage è bianca

1. Apri DevTools → Console. Errore React? Riporta lo stack.
2. Network tab: status `200` su `/`? Se `500`, guarda il terminale `npm run dev` → probabile errore SSR in `server.ts`.
3. Hard refresh (Ctrl+Shift+R). Il PWA service worker può servire cache vecchia.

### La porta 3000 risponde ma non ricarica (HMR rotto)

- File watching limit (Windows/WSL): chiudi e riapri editor.
- `.vite` cache corrotta: stop server, `rm -rf node_modules/.vite`, restart.

---

## 2. Firebase / Firestore

### "Firebase config not found" o auth fallisce in dev

1. `.env.local` ha i `VITE_FIREBASE_*`? Vedi `.env.example`. In dev il sito funziona anche con zero chiavi (degradazione silenziosa).
2. `FIREBASE_PROJECT_ID` e il `projectId` di `firebase-applet-config.json` **devono combaciare** — `npm run predeploy` lo verifica.

### Admin access denied dopo login

1. Email nel whitelist `src/config/admin.ts`? (fallback transitorio pre-go-live).
2. Custom claim `admin: true` assegnato? `npm run admin:list` per verificare, `npm run admin:grant <email>` per assegnare.
3. Dopo grant: **logout + login** per refresh del token.

### Firestore query ritorna vuoto su dati che esistono

- Stai filtrando per `published: true`? I query pubblici devono farlo (vedi `firestore.rules`).
- `where('published', '==', true)` — typo su `publish`/`publised` è una causa storica.

### "Permission denied" da Firestore in console browser

- Rules production-ready: custom-claim only (`request.auth.token.admin == true`). Login con account admin corretto.
- Dev emulator non è configurato in questo repo — si lavora contro Firestore live del progetto `gen-lang-client-0138696306`.

---

## 3. Stripe / Checkout

### Add to cart funziona, checkout non

1. `ALLOW_MOCK_CHECKOUT=true` in `.env.local`? Mock mode redirige a `/shop?success=true` senza Stripe reale.
2. Stripe reale: `STRIPE_SECRET_KEY` (server) + `VITE_STRIPE_PUBLISHABLE_KEY` (client) entrambi settati?
3. Terminale `npm run dev` mostra `POST /api/create-checkout-session`? Se no, il frontend non sta chiamando l'endpoint (errore client-side).

### Webhook Stripe non arrivano

Vedi [`STRIPE_WEBHOOK_RUNBOOK.md`](./STRIPE_WEBHOOK_RUNBOOK.md). Cause frequenti: `STRIPE_WEBHOOK_SECRET` sbagliato, endpoint URL in Dashboard Stripe errato, rate limit.

---

## 4. Build & Deploy

### `npm run build` fallisce

1. **TypeScript errors**: `npm run typecheck` li isola. Un singolo `any` dove prima non c'era → revert o fix.
2. **Sitemap**: `scripts/generate-sitemap.js` gira prima del build. Se fallisce, verifica che `server.ts` esporti le route statiche aggiornate.
3. **Media kit PDF**: `scripts/generate-media-kit.tsx` gira prima di Vite. Se fallisce, vedi stacktrace — di solito è font mancante o `@react-pdf/renderer` style invalido.
4. **Out of memory**: progetti Vite grandi → `NODE_OPTIONS="--max-old-space-size=4096" npm run build`.

### `npm run predeploy` blocca

- Elenca tutti i controlli fallati. Fissali uno alla volta — ogni check è motivato in `scripts/predeploy.mjs`.
- Se il bloccante è `audit:ui` warning baseline drift, rigenera baseline solo se il cambio è intenzionale: `npm run audit:ui:update-baseline`.

---

## 5. Testing

### `npm run test` fallisce con "Cannot find module"

Vitest 4 richiede Node 22+. Verifica `node -v`.

### `npm run e2e` fallisce con "browser not found"

Prima run dopo clone: `npx playwright install --with-deps chromium`. La config usa chromium + Mobile Chrome.

### `npm run audit:visual` mostra diff su screenshot

- **Intenzionale**: `npx playwright test e2e/visual-quality.spec.ts --update-snapshots` e committa i nuovi PNG.
- **Regressione**: apri il trace con `npx playwright show-report` → identifica componente → fix.

### Playwright dice "timeout 30s exceeded" in local

- Dev server partiva lento? `npm run dev` in terminale separato prima di `npm run e2e`.
- Connessione Firebase lenta? Molti test dipendono da dati live Firestore.

---

## 6. Lint / Formatting / Commit

### `git commit` bloccato da pre-commit hook

- **ESLint max-warnings=0**: lint-staged esegue ESLint con zero tolleranza sui file staged. Risolvi il warning (`npm run lint:fix` può aiutare) e ristaging.
- **Prettier mismatch**: `npm run format` sistema il repo. Poi re-commit.
- **Non aggirare con `--no-verify`**. Se proprio serve, documenta il perché.

### Prettier riformatta più di quello che hai toccato

Succede se il file aveva CRLF e passa a LF (lint-staged converte automaticamente). Normale — non preoccuparti.

---

## 7. Claude Code runtime

### Hook blocca la lettura di `.env.local`

Comportamento corretto. Vedi `.claude/settings.json` → matcher `Edit|Write|Read` su pattern secret → exit 2. Se devi davvero leggere il file (es. debug in sessione finale pre-deploy), chiedi esplicitamente al proprietario o bypass usando `cat .env.local` via Bash del tuo terminale esterno (non via Claude).

### Hook warning su `server.ts` / `firestore.rules` / `admin.ts`

Intenzionale. Questi sono high-risk files. Leggi attentamente prima di modificare e conferma con l'owner.

### Claude Code dice "permission denied" su comando bash

Il comando matcha il pattern destructive (`rm -rf`, `git push --force`, `git reset --hard`, `git clean -f`, `DROP TABLE`, `firebase deploy --project prod`). Se è intenzionale, giustificalo all'owner.

### PostToolUse reminder `npm run typecheck` appare sempre

Normale: dopo ogni Edit/Write di `.ts/.tsx` non-test esce un reminder su stderr. Non blocca nulla, è un nudge. Se diventa rumoroso senza valore, disabilitalo in `.claude/settings.json`.

### Gli hook `.claude/settings.json` non sembrano attivi

I hook si caricano **all'inizio della sessione**. Modifiche a `.claude/settings.json` durante una sessione non sono attive — apri una nuova sessione o `/clear` per ricaricare.

### MCP server Codex non parte / Claude Code non vede i tool `codex()`

Il repo dichiara in [`.mcp.json`](../.mcp.json) due MCP server: `playwright` (test runner) e `codex` (OpenAI Codex CLI come delegable agent).

**Prerequisito**: Codex CLI installato globalmente e nel PATH.

```bash
# Install
npm i -g @openai/codex

# Autenticazione (apre browser per OAuth OpenAI)
codex login

# Verifica
codex --version                # codex-cli 0.124.x o superiore
codex mcp-server --help        # deve mostrare "Start Codex as an MCP server (stdio)"
```

Attenzione: il sottocomando MCP è **`mcp-server`** (stdio), non `mcp`. `codex mcp` è invece il manager degli MCP server esterni che Codex stesso può chiamare — ruolo opposto.

**Poi riavvia Claude Code**: il server MCP viene bootstrappato solo all'inizio della sessione. Da un nuovo `/clear` o restart, Claude Code esegue `codex mcp` come subprocess e i tool `codex()` / `codex-reply()` diventano disponibili.

**Diagnosi se ancora non va:**

- `which codex` dal terminale dove lanci Claude Code → deve restituire un path. Su Windows + Git Bash, `codex` è un wrapper `.cmd`; assicurati che `C:\Users\<user>\AppData\Roaming\npm` sia nel PATH.
- Multi-profilo Windows: se Codex è installato su un altro profilo utente, installalo anche sul profilo che usi con Claude Code. La config globale di Codex (auth, config file) è in `~/.codex/` per-user.
- `codex mcp-server` in un terminale separato lancia il server stdio e resta in attesa di messaggi JSON-RPC su stdin; se fallisce lì (crash, stack trace), fallisce anche in Claude Code. Ctrl+C per uscire.
- Quota OpenAI esaurita → Codex MCP risponderà ma i tool call daranno 429. Verifica [platform.openai.com/usage](https://platform.openai.com/usage).

**Disattivare temporaneamente Codex MCP**: commenta la voce `codex` in `.mcp.json`, riavvia Claude Code. Non tocca gli altri MCP server.

---

## 8. Dipendenze / npm audit

### `npm audit` mostra 10 moderate vulnerabilities

Tutte transitive via `firebase-admin` → `@google-cloud/storage` → `uuid <14` (GHSA-w5hq-g745-h8pq: missing buffer bounds check in v3/v5/v6).

**Decisione documentata**: non risolvere con `npm audit fix --force` — richiederebbe downgrade di `firebase-admin` a `10.1.0` (breaking). Vedi [`20_Decisions/DECISION_UUID_FIREBASE_ADMIN_VULNERABILITY.md`](./20_Decisions/DECISION_UUID_FIREBASE_ADMIN_VULNERABILITY.md).

**Trigger per rivedere**: quando Google Cloud Storage SDK bump a `uuid >=14` (monitor Dependabot PR).

### `npm install` è lentissimo

Cache npm corrotta: `npm cache verify`. Se persiste: `rm -rf node_modules package-lock.json && npm install` (last resort — commit del nuovo lockfile dopo).

---

## 9. Git / GitHub

### `git pull` dice "divergent branches"

Locale ahead + remote ahead = qualcuno ha pushato mentre lavoravi. Risolvi con merge (`git pull --no-rebase`) o rebase (`git pull --rebase`). Non fare `reset --hard` senza backup.

### `git push` rifiutato per "non-fast-forward"

Qualcuno ha pushato sul tuo branch. `git pull --rebase` → risolvi conflitti → `git push`.

### Dependabot PR rompe il build

Merge solo dopo CI verde. Se break: chiudi PR e apri issue "manual upgrade needed for X".

---

## 10. Obsidian vault

### Obsidian apre canvas vuoto invece di `OBSIDIAN_HOME`

`.obsidian/workspace.json` può puntare a un canvas che non c'è più. Soluzione: `app.json` ha `homePath: OBSIDIAN_HOME` → usa Ctrl+Shift+H (Open home note).

### Le Bases non mostrano dati

1. Core plugin "Bases" abilitato? (`.obsidian/core-plugins.json`)
2. I file che la Base dovrebbe mostrare hanno il frontmatter corretto (`type:`, `status:`)? Vedi `OBSIDIAN_TAXONOMY.md`.

### Daily note di oggi non creata

1. `core-plugins.json` → `daily-notes: true`?
2. `daily-notes.json` → `autorun: true`?
3. Se entrambi OK, apri manualmente Ctrl+P → "Daily notes: Open today's daily note".

---

## Quando aprire un bug note

- Problema riproducibile che blocca la produzione.
- Sintomo atteso non presente qui dopo aver seguito il troubleshooting.

Template: `docs/90_Templates/TPL_Bug.md`. Location: `docs/14_Bugs/BUG_<slug>.md`.
