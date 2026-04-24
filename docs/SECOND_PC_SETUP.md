---
type: reference
area: ops
status: stable
owner: skotynyanskiy
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
tags:
  - setup
  - ops
  - dev-env
---

# Setup sul secondo PC — TRAVELLINIWITHUS

Guida operativa per allineare completamente un nuovo PC al progetto, incluso Claude Code e tutte le parti user-level che **non** vengono sincronizzate da git.

## TL;DR

Dopo `git clone`, il repo porta con sé circa l'80% della configurazione:

- Regole di progetto (`CLAUDE.md`, `AGENTS.md`, `DESIGN.md`, `README.md`)
- Skill, agent e hook di Claude Code per-progetto (`.claude/`)
- Config MCP di progetto (`.mcp.json`)
- Skill canonical cross-tool (`.agents/skills/`) e i loro mirror (`.cursor`, `.gemini`, `.github/skills/`)
- Template env (`.env.example`)
- Workflow GitHub Actions (`.github/workflows/`)
- Vault Obsidian completo (`docs/`)

Resta da fare a mano sul secondo PC:

1. Installare Node, Claude Code CLI, Firebase CLI
2. Creare il file `.env` dalle tue chiavi reali
3. Reinstallare i plugin Claude Code dal marketplace — vedi [`CLAUDE_CODE_PLUGINS_MANIFEST.md`](CLAUDE_CODE_PLUGINS_MANIFEST.md)
4. Riautenticare MCP server user-level (Canva, Figma, Google Drive, Firebase, Stripe, Vercel, Sentry)
5. Aprire Obsidian sulla cartella `docs/` come vault

## Step 1 — Strumenti globali

### Node.js 20+

Scarica dal sito ufficiale: <https://nodejs.org>. Verifica:

```bash
node --version   # v20.x o superiore
npm --version
```

### Claude Code CLI

Seguire le istruzioni ufficiali Anthropic. Una volta installato:

```bash
claude --version
```

### Firebase CLI (richiesto se amministri Firestore / rules / hosting)

```bash
npm i -g firebase-tools
firebase login
```

### Codex CLI (opzionale, ma richiesto per il MCP `codex` dichiarato in `.mcp.json`)

Seguire le istruzioni ufficiali OpenAI Codex. Verifica:

```bash
codex --version
```

Se non installato, il server MCP `codex` fallirà silenziosamente — il sistema continua a funzionare, ma la delega "second-opinion" a Codex non sarà disponibile (comportamento documentato in [CLAUDE.md § Claude ↔ Codex delegation]).

### Git user config

```bash
git config --global user.name "Denys"
git config --global user.email "<email>"
```

## Step 2 — Clone del repo

```bash
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install
```

## Step 3 — Variabili ambiente

```bash
cp .env.example .env
```

Poi apri `.env` e compila i valori reali (le chiavi vanno tenute in un password manager, **mai** committate):

- `VITE_FIREBASE_*` — Firebase client SDK
- Stripe secret + publishable key
- Brevo API key (newsletter)
- Sentry DSN
- Mapbox token
- GA4 measurement ID
- Meta Pixel ID
- TikTok Pixel ID

Vedi `.env.example` per l'elenco completo e il formato atteso.

## Step 4 — Claude Code sul secondo PC

Dentro la cartella del progetto:

```bash
claude code
# login con lo stesso account Claude del primo PC
```

Il repo porta già con sé:

- Hook `BARC` (routing haiku/sonnet/opus via `UserPromptSubmit`)
- Guard `PreToolUse` su comandi rischiosi (`rm -rf`, `git push --force`, `firestore.rules`, `.env`, service account)
- Reminder `PostToolUse` su `.ts`/`.tsx` che ricordano `npm run typecheck`
- I 7 agent custom (`browser-auditor`, `code-architect`, `code-explorer`, `travellini-frontend-builder`, `travellini-quality-auditor`, `travellini-seo-conversion-strategist`, `travellini-ui-designer`)
- Le 22 skill Claude-only (`/audit-browser`, `/audit-ui`, `/bug-triage`, `/commit`, `/deploy`, `/predeploy`, `/new-article`, `/new-page`, ecc.)
- I 5 skill canonical travellini-\* (condivisi con Cursor, Gemini, Copilot)

Cosa fare in più:

1. **Reinstallare i plugin user-level**: lista completa in [`CLAUDE_CODE_PLUGINS_MANIFEST.md`](CLAUDE_CODE_PLUGINS_MANIFEST.md).
2. **MCP server user-level**: autenticare connettori claude.ai (Canva, Figma, Google Drive) dal pannello connettori.

### MCP server di progetto (automatici)

I 3 server dichiarati in `.mcp.json` si abilitano automaticamente perché `.claude/settings.json` ha `enableAllProjectMcpServers: true`:

- `playwright` — richiede solo `npx` (scarica `@playwright/mcp@latest` al volo)
- `codex` — richiede il binario `codex` nel PATH (vedi Step 1)
- `sequential-thinking` — via `npx`

## Step 5 — Obsidian

Installare Obsidian dal sito ufficiale. Poi:

1. Aprire l'app
2. "Open folder as vault"
3. Selezionare `./docs/` del repo

Tutto il contenuto del vault (progetti, dashboard, marketing hub, editorial guide, taxonomy, bases, canvas, templates) è in git. I layout personali di Obsidian (pannelli aperti, plugin Obsidian installati) non sono sincronizzati perché `.obsidian/` è gitignorato.

## Step 6 — Verifica ambiente

```bash
npm run dev
# in un'altra shell:
npm run typecheck
npm run audit:ui
npm run build
```

Se tutti e 4 sono verdi, l'ambiente è allineato.

## Memoria di sessione Claude (opzionale)

La "auto memory" di Claude Code vive in:

```
%USERPROFILE%\.claude\projects\<encoded-path>\memory\
```

**Non è in git**. Se vuoi portare la storia di sessione dal PC-A al PC-B:

1. Copia a mano il contenuto di quella cartella.
2. Il path sul secondo PC avrà lo stesso encoding del path del repo (es. `c--Users-<user>-...`).

Altrimenti, parti con memoria pulita sul PC-B — si ricostruisce naturalmente nelle prime sessioni.

## Cosa NON serve copiare

Viene regenerato o non rilevante:

- `node_modules/` — ri-generato da `npm install`
- `dist/`, `build/` — artefatti di build
- `.claude/settings.local.json` — preferenze per-machine di Claude Code
- `.playwright-mcp/`, `.remember/`, `.lighthouseci/`, `.vercel/` — cache di sessione
- `audit-*.png`, `audit-*.jpeg` — screenshot audit rigenerati on demand

## Troubleshooting

Problemi comuni (dev server, Firebase permessi, Stripe webhook, build, test): vedi [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

Architettura stack, data flow, boundaries: vedi [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Riferimenti

- [`CLAUDE_CODE_PLUGINS_MANIFEST.md`](CLAUDE_CODE_PLUGINS_MANIFEST.md) — plugin Claude Code da reinstallare
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — mappa tecnica
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) — problemi frequenti
- [`DEPLOYMENT_RUNBOOK.md`](DEPLOYMENT_RUNBOOK.md) — runbook deploy
- [`STRIPE_WEBHOOK_RUNBOOK.md`](STRIPE_WEBHOOK_RUNBOOK.md) — runbook webhook Stripe
- [`AI_AGENT_STACK.md`](AI_AGENT_STACK.md) — mappa agent e skill
