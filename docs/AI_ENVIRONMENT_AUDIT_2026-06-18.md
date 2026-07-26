---
title: AI/Dev Environment Audit — ULTRACODE
date: 2026-06-18
type: audit
scope: Claude Code · Codex · Antigravity/Gemini · VS Code Agent · MCP · hooks · skills · agents · security
status: active
backup: backups/ultracode-2026-06-18/
area: workspace
---

# AI/Dev Environment Audit — ULTRACODE (2026-06-18)

Read-only inventory + benchmark of the whole AI/dev operating stack, with a
strict apply-only-if-safe policy. This note is the persistent record; the
executive summary lives in the session chat.

## 1. Diagnosi iniziale

L'ambiente è **già maturo e ben architettato**, molto sopra la media. Non serve
una ricostruzione: serve rifinitura mirata e chiusura di **un solo gap di
sicurezza reale** (Codex Stripe in scrittura).

**Voto iniziale: 8.5 / 10.**

Punti di forza già presenti:

- 14 agent `travellini-*` + `code-explorer`/`code-architect`/`browser-auditor`, con routing e cost-discipline documentati in `CLAUDE.md`.
- Skill canoniche in `.agents/skills` con fan-out deterministico a `.claude/.github/.cursor/.gemini` via `scripts/sync-agent-skills.mjs` (validato da `audit:agents` → PASS).
- 9 MCP server, token via `${ENV}` (nessun secret in chiaro), Stripe `--read-only` lato Claude.
- Hook Python (block_dangerous_bash, quality-bar prompt/precommit/agent-output) + Husky pre-commit con `gitleaks protect --staged`.
- `.gitignore` molto difensivo (secrets, service-account, screenshot, log Codex, MCP cache).
- Profili Codex `audit/safe/fast/advanced` ben tarati.

## 2. Inventario (FASE 1)

| Componente                            | Stato                                 | Problema                                                         | Rischio      | Azione                               | Applico subito                | Prio   |
| ------------------------------------- | ------------------------------------- | ---------------------------------------------------------------- | ------------ | ------------------------------------ | ----------------------------- | ------ |
| `.mcp.json` (9 server)                | OK                                    | —                                                                | Basso        | Tenere                               | —                             | —      |
| Stripe MCP (Claude)                   | `--read-only`                         | —                                                                | Basso        | Tenere                               | —                             | —      |
| **Stripe MCP (Codex global)**         | `--tools=all` **senza** `--read-only` | Codex può **scrivere** su Stripe (refund/charge)                 | **Alto**     | Aggiungere `--read-only`             | No (file globale → conferma)  | **P1** |
| `.claude/settings.json`               | OK (committed)                        | —                                                                | Basso        | Tenere (no auto-edit permessi)       | —                             | —      |
| `.claude/settings.local.json`         | OK (gitignored)                       | —                                                                | Basso        | Tenere                               | —                             | —      |
| Hook globali `~/.claude/hooks`        | OK                                    | `mainnet_gate.py` (trading bot) gira su ogni Bash anche qui      | Trascurabile | Tollerare (no-op fuori progetto)     | —                             | P4     |
| Skill canoniche `.agents/skills` (26) | OK                                    | 5 skill editoriali tool-agnostic vivono solo in `.claude/skills` | Basso        | Promuovere le 5 a canoniche          | No (scope fan-out → conferma) | P3     |
| Skill Claude-only (12)                | OK by design                          | invocano agent Claude → giustamente non fanned-out               | Nessuno      | Tenere così                          | —                             | —      |
| `~/.codex/config.toml`                | OK                                    | Stripe write (vedi sopra)                                        | Alto         | Vedi P1                              | —                             | —      |
| `~/.codex/AGENTS.md`                  | **vuoto (0 righe)**                   | Codex globale senza regole operative                             | Basso        | Popolare con pointer                 | No (globale → conferma)       | P3     |
| `.codex-*.log` (root, x6)             | clutter                               | log dev-server Codex 8-9 giu, gitignored                         | Nessuno      | Eliminare                            | No (delete → conferma)        | P4     |
| `.vscode/tasks.json` + `launch.json`  | OK                                    | PORT 3001 vs audit-scripts su 3000 (coerente internamente)       | Trascurabile | Lasciare / allineare se infastidisce | —                             | P4     |
| VS Code Agent / Copilot               | OK                                    | `copilot-instructions.md` rimanda ad `AGENTS.md`                 | Basso        | Tenere                               | —                             | —      |
| Antigravity / Gemini                  | superficie `.gemini/skills`           | nessuna config dedicata                                          | Basso        | Tenere come superficie SAFE/research | —                             | —      |
| `backups/`                            | OK                                    | convenzione `config-YYYY-MM-DD/` già attiva                      | Nessuno      | Tenere                               | —                             | —      |
| Secret scanning                       | `gitleaks` (secrets)                  | nessun SAST (es. Semgrep)                                        | Basso        | Valutare Semgrep CLI/CI              | No (adozione → conferma)      | P3     |

## 3. Benchmark esterno (FASE 2)

- **Marketplace ufficiale Anthropic** (`anthropics/claude-plugins-official`): fonte affidabile per plugin/skill/agent. La config attuale è bespoke e più aderente al brand → non sostituire, ma usarla come sorgente di scouting via `/plugin-evaluator`.
- **Standard aperto `agentskills.io`** (skill portabili Claude/Cursor/Copilot/Codex/Gemini): copre lo stesso problema che `sync-agent-skills.mjs` risolve a mano. Candidato **monitor**, non adottare ora (lo script custom funziona ed è validato).
- **Security MCP (Snyk/Semgrep/Trivy)**: complementari a `gitleaks` (solo secret). Semgrep MCP è deprecato a favore del binario → preferire `semgrep` come step CLI/CI, non MCP. Candidato P3.
- **Verdetto**: lo stack è già su tooling corrente e ufficiale (Opus 4.8, gpt-5.5, MCP `@latest`, chrome-devtools-mcp, context7). Nessun ritardo tecnologico.

## 4. Matrice strumenti (FASE 5)

| Task                           | Primario                                     | Secondario             | Conferma manuale         |
| ------------------------------ | -------------------------------------------- | ---------------------- | ------------------------ |
| Nuova feature / componente     | Claude Code (sonnet→builder)                 | Codex (review)         | No                       |
| Bug fixing                     | Claude `/bug-triage`→`/small-fix`            | Codex                  | No                       |
| Refactor multi-file            | Claude `code-architect`                      | Codex (alt impl)       | No                       |
| Code review avversariale       | Codex `--profile audit`                      | Claude `/quick-review` | No                       |
| Sicurezza / secrets            | `gitleaks` + `travellini-security-auditor`   | Codex audit            | Sì se tocca server/rules |
| Performance / CWV              | `travellini-perf-engineer` + chrome-devtools | —                      | No                       |
| UI/UX direction                | `travellini-ui-designer`                     | Figma MCP              | No                       |
| Copy/SEO IT                    | `travellini-seo-conversion-strategist`       | —                      | No                       |
| Deploy                         | `/predeploy`→`/deploy`                       | —                      | **Sì (OWNER)**           |
| Git push                       | —                                            | —                      | **Sì (OWNER)**           |
| `.env` / Stripe/Firebase write | —                                            | —                      | **Sì (OWNER)**           |
| Design generativo veloce       | Antigravity/Gemini (research)                | Figma MCP              | No (solo research)       |

## 5. Sicurezza (FASE 10) — matrice

| Rischio                      | Gravità | Prob. | Mitigazione                             | Applico subito              |
| ---------------------------- | ------- | ----- | --------------------------------------- | --------------------------- |
| Codex Stripe in scrittura    | Alta    | Bassa | `--read-only` in `~/.codex/config.toml` | No → **P1 conferma**        |
| Secret in chiaro nei config  | —       | —     | già `${ENV}` ovunque                    | già OK                      |
| Push/force/reset distruttivi | Media   | Bassa | deny in settings + block_dangerous_bash | già OK                      |
| `.env` overwrite             | Alta    | Bassa | deny `Write/Edit(**/.env)` globale      | già OK                      |
| SAST assente                 | Bassa   | Media | Semgrep CLI/CI (opz.)                   | No → P3                     |
| GitHub PAT scope ampio       | Media   | Bassa | verificare scope minimi del PAT         | No (gestione token → owner) |

## 6. Gruppi azione (FASE 13) — esito

**GRUPPO 1 — applicato (safe/reversibile):**

- Snapshot backup `backups/ultracode-2026-06-18/` (config + `.agents/skills` + git count).
- `npm run audit:agents` → PASS (validazione non distruttiva).
- Questa nota di audit.

**GRUPPO 2 — applicato dopo conferma owner (2026-06-18):**

1. **[P1 sicurezza] FATTO** — `--read-only` aggiunto allo Stripe MCP in `~/.codex/config.toml` (riga 94). Codex non può più scrivere su Stripe. Predisposizione sicura: pronto ma read-only finché non servirà.
2. **[P3] TENTATO → REVERTITO** — Promuovere le 5 skill editoriali a canoniche rompe il contratto di `audit:agents`: ogni skill canonica DEVE referenziare `AGENTS.md`/`CLAUDE.md`/`docs/MARKETING_OPERATIONS_HUB.md`/`docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`. Le editoriali non lo fanno → sono **Claude-only by design**. Revert pulito, audit di nuovo PASS. Restano in `.claude/skills` dove vengono usate.
3. **[P3] FATTO** — `~/.codex/AGENTS.md` (era 0 righe) popolato con regole operative generiche + uso profili.
4. **[P4] FATTO** — 6 `.codex-*.log` stray rimossi dalla root.

**Non applicato (richiede valutazione, non urgente):**

- **[P3]** Semgrep come step `audit:sast` CLI/CI (via `/cli-evaluator`). Prematuro in fase struttura/grafica.

**GRUPPO 3 — evitare/rimandare:**

- Nuovi MCP con permessi ampi (filesystem/memory/brave): già coperti dall'harness; aumentano superficie d'attacco per ROI marginale.
- Editare i permessi di `.claude/settings.json` in automatico (guardrail: modifiche manuali).
- Sostituire il sync custom con `agentskills.io` ora (monitor).
- Forzare le skill editoriali nel canonico (rompe il contratto doc-reference).

## 7. Stato finale

- **Voto: 8.5 → 9.2.** Chiuso l'unico gap di sicurezza reale (Codex Stripe write), Codex globale documentato, root pulita, audit verde.
- Per **10/10** mancano (tutti owner-gated): SAST in CI, review scope del PAT GitHub, test di rollback documentato end-to-end, e — se si vuole portabilità editoriale cross-tool — rendere le 5 skill editoriali conformi al contratto canonico (aggiungere il footer di project-reference) invece di tenerle Claude-only.

## 8. Rollback

Ogni file toccabile ha `.bak` in `backups/ultracode-2026-06-18/`. Ripristino:
`cp backups/ultracode-2026-06-18/<file>.bak <percorso-originale>`. Le skill
target sono rigenerabili con `npm run sync:agents`.
