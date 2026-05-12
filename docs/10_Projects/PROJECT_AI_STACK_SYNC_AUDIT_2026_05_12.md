---
type: project
area: workspace
status: active
priority: p1
owner: team
repo: TRAVELLINIWITHUS
related: '[[AI_AGENT_STACK]]'
source: Codex audit 2026-05-12
tags:
  - ai
  - agents
  - workflow
  - mcp
---

# PROJECT_AI_STACK_SYNC_AUDIT_2026_05_12

## Obiettivo

Verificare che Codex, Claude Code, GitHub/Copilot, Cursor, Gemini, Obsidian e MCP siano allineati per lavorare sul progetto Travelliniwithus con il massimo rendimento operativo senza introdurre tool generici, duplicati o rischiosi.

## Prompt operativo

Usa questo prompt per ripetere l'audit in futuro:

```text
Agisci come release-quality auditor per TRAVELLINIWITHUS.

Verifica lo stack AI completo:
- istruzioni root: AGENTS.md, CLAUDE.md, DESIGN.md
- skill canoniche in .agents/skills
- copie sincronizzate in .claude/skills, .github/skills, .cursor/skills, .gemini/skills
- agenti Claude Code in .claude/agents
- hooks e safety gates in .claude/settings.json
- MCP server locali in .mcp.json e configurazioni globali disponibili
- plugin Codex/GitHub installati
- memoria Claude/Codex e rapporto con il vault docs/
- Obsidian: dashboard, taxonomy, workflow, templates, bases
- documentazione stack in docs/AI_AGENT_STACK.md e docs/AGENT_WORKFLOWS.md

Esegui:
1. npm run sync:agents
2. npm run audit:agents
3. npm run typecheck

Usa fonti ufficiali aggiornate per valutare MCP utili al progetto. Non installare nuovi MCP o plugin senza una motivazione specifica, una fonte autorevole, una policy di sicurezza e una nota in docs/AI_AGENT_STACK.md.

Output richiesto:
- stato PASS/WARN/FAIL per Codex, Claude Code, skills, hooks, MCP, GitHub plugin, memoria, Obsidian
- blocchi reali
- miglioramenti consigliati con priorita
- decisione su cosa NON installare
- comandi eseguiti e risultato
```

## Stato verificato

- `.agents/skills`: 7 skill canoniche.
- `.claude/skills`: 23 skill totali, incluse 7 Travellini sincronizzate e workflow Claude locali.
- `.github/skills`, `.cursor/skills`, `.gemini/skills`: 7 skill Travellini sincronizzate.
- `.claude/agents`: 9 agenti progetto, inclusi social e growth/revenue.
- Codex: plugin GitHub attivo in `~/.codex/config.toml`.
- Codex MCP: Playwright aggiunto in `~/.codex/config.toml` per allineare browser QA con Claude Code.
- Claude Code: `enableAllProjectMcpServers: true` nel progetto.
- MCP progetto: solo `playwright` in `.mcp.json`.
- Obsidian: `docs/` e il vault operativo, con home, dashboard, taxonomy, templates e bases presenti.

## Fix applicato

I project hook Claude in `.claude/settings.json` usavano `bash`, ma su questa macchina `bash` punta a WSL senza distribuzioni installate. I hook sono stati convertiti a PowerShell per rendere attivi:

- blocco comandi pericolosi: `rm -rf`, `git reset --hard`, `git clean -f`, force push, drop table, deploy Firebase prod diretto
- warning su file high-risk: `server.ts`, `firestore.rules`, `src/config/admin.ts`

## MCP valutati

### Attivi

- `playwright`: corretto per browser QA, visual audit e smoke test.

### Utili ma non da attivare di default

- GitHub MCP: utile per PR, issue, CI e code scanning. Per Codex e gia presente il plugin GitHub; per Claude va usato solo quando serve lavoro GitHub reale.
- Stripe MCP: utile per checkout, webhook, docs e sandbox Stripe. Non va attivato in automatico per evitare tool commerciali sempre disponibili.
- Firebase MCP: utile per esplorare Firestore e debug Firebase, ma richiede auth e puo toccare servizi reali. Da attivare solo per task Firebase.
- Figma MCP: utile solo con un file Figma reale e Dev Mode/remote MCP pronto. In assenza di file Figma, resta sufficiente `travellini-stitch-figma-bridge`.
- Obsidian MCP: non necessario per questo repo perche `docs/` e gia accessibile come filesystem versionato. Valutarlo solo se serve sincronizzare un vault esterno.

## Decisione

Non installare un catalogo completo di MCP o agenti esterni. Lo stack migliore per Travellini e un set ridotto:

- browser QA: Playwright
- repository/PR: GitHub plugin o GitHub MCP quando serve
- pagamenti: Stripe MCP solo per task Stripe
- dati Firebase: Firebase MCP solo per task Firestore/Firebase
- design: Figma MCP solo con sorgente Figma reale
- memoria: `docs/` come fonte primaria, Obsidian come UI

## Verifiche

```bash
npm run sync:agents
npm run audit:agents
npm run typecheck
```

Risultato:

- `sync:agents`: PASS, 7 skill sincronizzate su 4 directory.
- `audit:agents`: PASS, 0 errori, 0 warning.
- `typecheck`: PASS.
- Codex config TOML: PASS, parsing valido dopo aggiunta Playwright MCP.

## Follow-up consigliati

- Aggiornare periodicamente questo audit prima di installare nuovi MCP.
- Tenere `.mcp.json` minimale: ogni nuovo server deve avere owner, motivo, auth, rischi e rollback.
- Non duplicare memoria in Claude se la stessa informazione vive gia in `docs/`.
- Ripulire o ignorare i worktree Claude solo dopo aver confermato che non contengono lavoro utile.
