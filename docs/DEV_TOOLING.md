---
type: reference
area: engineering
status: active
tags:
  - tooling
  - cli
  - mcp
  - plugins
  - reference
---

# Dev Tooling — TRAVELLINIWITHUS

Catalogo dei tool AI-assisted e CLI adottati dal progetto, con **stato install corrente**, motivo della scelta, e criteri di selezione. Aggiornato 2026-04-24.

La filosofia di base è la **skill diet**: ogni tool deve avere una motivazione chiara e ricorrente. "22 plugin essenziali da 75 possibili" — vedi `memory/project_skills_diet_decision_2026_04_20.md`.

---

## CLI installati

| CLI              | Versione     | Installato via              | Scope                           |
| ---------------- | ------------ | --------------------------- | ------------------------------- |
| Node.js          | ≥22          | system                      | runtime                         |
| npm              | 10.9.2       | bundled                     | package manager                 |
| git              | system       | —                           | VCS                             |
| tsx              | via npm dep  | `package.json`              | run TS directly (`npm run dev`) |
| Vite             | 6.x          | npm dep                     | build + dev server              |
| Playwright       | 1.58.2       | npm dep                     | e2e runner                      |
| **Codex CLI**    | 0.124.0      | `npm i -g @openai/codex`    | MCP server + delegation agent   |
| **Firebase CLI** | 15.15.0      | `npm i -g firebase-tools`   | deploy/emulate/rules + admin    |
| **Vercel CLI**   | (installato) | `npm i -g vercel`           | frontend deploy + env sync      |
| **GitHub CLI**   | 2.91.0       | `winget install GitHub.cli` | PR/issue/release dalla shell    |

## CLI raccomandati ma NON installati automaticamente

| CLI                    | Uso                                                          | Install                                                                           | Priorità                                       |
| ---------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Stripe CLI**         | webhook test locale, log Stripe events, smoke checkout       | `winget install Stripe.StripeCLI` (o download .msi da stripe.com/docs/stripe-cli) | **HIGH** quando si lavora su checkout/webhook  |
| `jq`                   | manipolazione JSON da Bash (parse Firestore export, CI logs) | `winget install jqlang.jq`                                                        | LOW — solo se si fanno molti pipe JSON manuali |
| `lhci` (Lighthouse CI) | performance budget automation                                | `npx --yes @lhci/cli` già in `npm run audit:lighthouse`                           | già coperto, no global install                 |

Non installati perché **duplicano tool nativi Claude Code**: `rg` (ripgrep — uso Grep tool), `fd` (uso Glob tool), `bat` (uso Read tool).

Non installati perché **non pertinenti allo stack**: `supabase`, `bun`, `ollama`, `gemini-cli` (non esiste ufficiale Google).

---

## MCP servers attivi (`.mcp.json`)

| Server                | Command                                                | Scope                                                                     | Attivazione                                     |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------- |
| `playwright`          | `npx @playwright/mcp@latest --headless`                | browser automation per UX audit                                           | al boot sessione                                |
| `codex`               | `codex mcp-server`                                     | OpenAI Codex agent delegabile in-session                                  | al boot sessione, richiede `codex login` attivo |
| `sequential-thinking` | `npx @modelcontextprotocol/server-sequential-thinking` | extended reasoning multi-step per problemi architetturali/debug complessi | al boot sessione                                |

**Regola di scelta**: il MCP server entra in `.mcp.json` se (a) il server è ufficiale Anthropic o maturo, (b) lo stack del progetto ne beneficia, (c) non duplica un plugin Anthropic già attivo.

## MCP servers proposti ma NON attivi

| Server                     | Perché vale la pena                                                     | Blocker all'attivazione                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Sentry MCP**             | close-loop su error triage: Claude vede stack trace, release, frequenza | richiede `SENTRY_AUTH_TOKEN` + project config — attivare in sessione finale pre-deploy insieme a `VITE_SENTRY_DSN`         |
| **Obsidian MCP**           | query live vault `docs/` (frontmatter, backlinks, Bases)                | richiede plugin community MCP-bridge installato nella vault Obsidian + Obsidian aperto — overhead alto per un single-owner |
| **Memory MCP (Anthropic)** | memoria persistente oltre al plugin `remember`                          | ridondante con plugin `remember` già attivo → skip                                                                         |

Per attivare uno dei primi due: vedi `docs/TROUBLESHOOTING.md` → sezione "MCP server Codex non parte" per pattern generale (il restart sessione è sempre necessario).

---

## Plugin Claude Code (marketplace Anthropic)

Allow-list globale — 22 plugin, vedi `memory/project_claude_code_config.md`:

**Build / edit**: `typescript-lsp`, `frontend-design`, `code-simplifier`, `feature-dev`, `hookify`, `skill-creator`, `claude-code-setup`, `claude-md-management`.
**Review**: `code-review`, `pr-review-toolkit`, `security-guidance`.
**Commit / PR**: `commit-commands`, `github`.
**Docs / context**: `context7`, `remember`.
**Design**: `figma`.
**Platform integrations**: `vercel`, `stripe`, `firebase`, `playwright`, `chrome-devtools-mcp`.
**SEO**: `searchfit-seo`.

Tutti gli altri plugin del marketplace restano `false` per default, flippabili on-demand. La regola è: non aggiungere un plugin "a caso" perché potrebbe servire — aggiungilo quando il bisogno reale si manifesta.

## Plugin community — policy

Non installati. Motivazioni:

- Ecosystem Anthropic è maturo e copre 90% dei casi.
- I plugin community non sono signed → rischio supply-chain.
- La memoria `project_skills_diet_decision_2026_04_20.md` ha già fatto skip di 7 plugin community @thejacksonyew valutati individualmente.

Unica eccezione **potenziale** (non attiva): `openai/codex-plugin-cc` — oggi non serve perché il Codex MCP server copre già il caso d'uso.

---

## Criteri per aggiungere un nuovo tool

Prima di installare un nuovo CLI/plugin/MCP server:

1. **Chiede almeno 4 use case ricorrenti** — tre occorrenze isolate non giustificano un nuovo tool (principio dal `CLAUDE.md`: "Three similar lines is fine; abstract only at 4+ occurrences").
2. **Non duplica uno esistente** — Confrontare con tabelle sopra.
3. **Ha un maintainer attivo** — Se ultimo commit > 6 mesi, skip.
4. **Se richiede auth/token**: documentarne la policy in `SECURITY.md`.
5. **Se aggiungibile a `.mcp.json`**: verificare che non richieda Claude Code restart a ogni modifica di config applicativa (fragilità).

## Aggiornamenti futuri previsti

- **Sentry MCP**: attivare insieme a `VITE_SENTRY_DSN` nella sessione finale pre-deploy. Permetterà a Claude di vedere error reports in-session.
- **Stripe CLI**: installare quando si aprirà il blocco "checkout QA finale" nel `PROJECT_RELEASE_READINESS`.
- **Obsidian MCP**: rivalutare se/quando la vault cresce oltre 50 note operative e il manual frontmatter query diventa faticoso.

## Related

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — come questi tool si incastrano nello stack
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) — cosa fare se uno di questi tool non parte
- [`AI_AGENT_STACK.md`](./AI_AGENT_STACK.md) — shared vs Claude-only, canonical skill mirror
- [`SECURITY.md`](../SECURITY.md) — policy secrets per auth token tool
