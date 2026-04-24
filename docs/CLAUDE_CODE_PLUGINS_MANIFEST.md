---
type: reference
area: ops
status: stable
owner: skotynyanskiy
repo: TRAVELLINIWITHUS
related: '[[SECOND_PC_SETUP]]'
tags:
  - setup
  - claude-code
  - plugins
  - mcp
---

# Claude Code — Plugin & MCP manifest

Inventario dei plugin Claude Code e dei server MCP usati con questo progetto.

**I plugin Claude Code sono user-global, NON sono in git.** Per replicare l'ambiente sul secondo PC bisogna reinstallarli uno a uno via `/plugin` dal marketplace Claude.

Aggiornato: 2026-04-24

## 1. Plugin Claude Code (marketplace)

Installabili da dentro Claude Code con `/plugin install <nome>` (o dal pannello `/plugin`).

### Core workflow

| Plugin                 | Scopo                                                                                      | Note                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `commit-commands`      | Commit / push / PR helpers (`/commit`, `/commit-push-pr`, `/clean_gone`)                   | Usato quotidianamente                                                    |
| `code-review`          | Review PR con agent specializzato                                                          |                                                                          |
| `pr-review-toolkit`    | Review PR completa multi-agent (code-reviewer, silent-failure-hunter, test-analyzer, ecc.) | Per PR importanti                                                        |
| `hookify`              | Crea hook Claude Code da pattern conversazionali                                           | Ha sottocomandi `/hookify configure`, `/list`, `/help`, `/writing-rules` |
| `feature-dev`          | Feature development guidato con agent (code-architect, code-explorer, code-reviewer)       | Per feature complesse                                                    |
| `claude-md-management` | Audit / improve `CLAUDE.md`                                                                | `/revise-claude-md`, `/claude-md-improver`                               |
| `claude-code-setup`    | Automation recommender per nuovi repo                                                      |                                                                          |
| `remember`             | Salva stato di sessione (`/remember`)                                                      | Integrato con `.remember/` (gitignore)                                   |
| `skill-creator`        | Creazione / ottimizzazione skill                                                           | Per costruire nuove skill travellini-\*                                  |

### Deploy / Infra

| Plugin   | Scopo                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------ |
| `vercel` | `/deploy`, `/env`, `/marketplace`, `/status`, `/auth`, `/next-upgrade`, `/bootstrap`, ecc.       |
| `stripe` | `/explain-error`, `/test-cards`, `/stripe-projects`, `/stripe-best-practices`, `/upgrade-stripe` |
| `sentry` | `/seer`, `/sentry-sdk-setup`, `/sentry-workflow`, `/sentry-feature-setup`                        |

### Content / SEO

| Plugin            | Scopo                                                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `searchfit-seo`   | Suite SEO completa: `/seo-audit`, `/keyword-cluster`, `/content-brief`, `/content-strategy`, `/schema-markup`, `/internal-linking`, `/broken-links`, `/ai-visibility`, `/technical-seo`, `/content-translation`, ecc. |
| `figma`           | Figma design-to-code: `/figma-use`, `/figma-implement-design`, `/figma-generate-design`, `/figma-generate-library`, `/figma-code-connect`, `/figma-create-design-system-rules`                                        |
| `frontend-design` | UI production-grade code                                                                                                                                                                                              |

### Claude API

| Plugin       | Scopo                                                             |
| ------------ | ----------------------------------------------------------------- |
| `claude-api` | Build / debug / ottimizza app Claude API + migrazioni tra modelli |

## 2. Plugin del progetto (sono in git — non da reinstallare)

Queste skill vivono già in `.claude/skills/` e sono caricate automaticamente dal repo:

### Canonical travellini-\* (in `.agents/skills/`, mirror in `.claude/skills/`)

- `travellini-design-director`
- `travellini-page-builder`
- `travellini-release-quality`
- `travellini-stitch-figma-bridge`
- `travellini-web-quality-auditor`

### Claude-only di progetto (in `.claude/skills/`)

- `audit-browser`, `audit-ui`, `bug-triage`, `commit`, `deep-refactor`, `deploy`, `explain-module`, `firebase-check`, `new-article`, `new-page`, `predeploy`, `quick-review`, `route`, `seo-check`, `small-fix`, `smoke-test`, `stripe-flow`

### Agent custom di progetto (in `.claude/agents/`)

- `browser-auditor`
- `code-architect`
- `code-explorer`
- `travellini-frontend-builder`
- `travellini-quality-auditor`
- `travellini-seo-conversion-strategist`
- `travellini-ui-designer`

## 3. MCP server

### Di progetto — automatici, dichiarati in [`.mcp.json`](../.mcp.json) (SYNC via git)

Si abilitano automaticamente quando apri Claude Code dentro questa cartella, perché [`.claude/settings.json`](../.claude/settings.json) ha `enableAllProjectMcpServers: true`.

| Server                | Command                                                | Prerequisito sul secondo PC             | Scopo                                            |
| --------------------- | ------------------------------------------------------ | --------------------------------------- | ------------------------------------------------ |
| `playwright`          | `npx @playwright/mcp@latest --headless`                | nessuno (scarica on-demand)             | Browser automation per audit reali               |
| `codex`               | `codex mcp-server`                                     | Codex CLI installato globalmente + auth | Second-opinion MCP (vedi CLAUDE.md § delegation) |
| `sequential-thinking` | `npx @modelcontextprotocol/server-sequential-thinking` | nessuno                                 | Reasoning loop su problemi complessi             |

### User-level — NON in git (da autenticare sul secondo PC)

Alcuni MCP server sono collegati al tuo account Claude (via connettori claude.ai) o richiedono auth locale separata:

| Server                              | Auth                     | Note                       |
| ----------------------------------- | ------------------------ | -------------------------- |
| Canva (claude.ai Connectors)        | OAuth                    | Stesso account Claude      |
| Figma (claude.ai Connectors)        | OAuth                    | Idem                       |
| Google Drive (claude.ai Connectors) | OAuth                    | Idem                       |
| Firebase (plugin user-level)        | `firebase login` CLI     | Per Firestore MCP          |
| Stripe (plugin)                     | API key restricted       |                            |
| Sentry (plugin)                     | OAuth                    |                            |
| Vercel (plugin)                     | OAuth via `vercel login` |                            |
| Context7                            | nessuna auth             | Docs realtime per librerie |

## 4. Procedura "replica ambiente" sul secondo PC

Riassunto operativo:

```bash
# 0. Prerequisiti globali — vedi SECOND_PC_SETUP.md Step 1
#    (Node 20+, Claude Code CLI, Firebase CLI, Codex CLI opzionale)

# 1. Clone del repo
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install

# 2. Dentro la cartella
claude code

# Nel prompt Claude Code:
#    /login (se non già loggato con lo stesso account)
#    /plugin install commit-commands
#    /plugin install code-review
#    /plugin install pr-review-toolkit
#    /plugin install hookify
#    /plugin install feature-dev
#    /plugin install claude-md-management
#    /plugin install claude-code-setup
#    /plugin install remember
#    /plugin install skill-creator
#    /plugin install vercel
#    /plugin install stripe
#    /plugin install sentry
#    /plugin install searchfit-seo
#    /plugin install figma
#    /plugin install frontend-design
#    /plugin install claude-api

# 3. Autentica i connettori claude.ai (Canva, Figma, Google Drive) dal pannello connettori di Claude

# 4. Firebase + altri MCP user-level
firebase login
# Stripe / Sentry / Vercel: seguire i plugin guide interni
```

## 5. Verifica finale

Dopo il setup, testa che tutto risponda:

```bash
# Nel progetto
npm run typecheck
npm run audit:ui
npm run audit:agents   # verifica sync skill tra .agents e .claude/.cursor/.gemini/.github
```

Dentro Claude Code, prova una skill mirror per confermare che il hook BARC si attivi:

```
/route
```

Se vedi il tab del hook "[BARC] Prima di agire..." sei allineato.

## Mantenere aggiornato questo manifest

Quando installi un nuovo plugin user-level su un PC che vuoi poter replicare, aggiungilo qui e committa — è l'unica fonte di verità cross-machine per la lista dei plugin marketplace usati.
