---
name: route
description: Quick-reference della tabella di routing modelli/agenti per Travelliniwithus. Mostra quale agent e modello usare per il tipo di task corrente.
---

# /route

Tabella di routing veloce. Usa questa guida quando non sai quale agent/modello scegliere per un task.

## Principi

- Default modello: **sonnet** (`~/.claude/settings.json`).
- **Mai escalare a opus** senza motivo: `code-architect` solo per refactor multi-file o debug profondo multi-layer.
- **Sempre usare haiku** (`code-explorer`) per lookup, grep, "dov'è X", riassunti, lettura log.
- Target operativo: ~95% sonnet, ~4% haiku, <1% opus.

## Routing per tipo di task

| Task | Skill / Agent | Modello |
|------|---------------|---------|
| Lookup, grep, "dov'è X", leggere log, riassunto | Agent `code-explorer` o `/explain-module` | **haiku** |
| Bugfix singolo file | `/bug-triage` → `/small-fix` | sonnet |
| Componente nuovo / feature single-file | default + `/new-page` o `/new-article` | sonnet |
| Refactor multi-file, architettura | Agent `code-architect` o `/deep-refactor` | **opus** |
| UI critique, visual direction, brand fit | Agent `travellini-ui-designer` | sonnet |
| Copy IT, SEO, conversion, lead capture | Agent `travellini-seo-conversion-strategist` o `/seo-check` | sonnet |
| Release QA, audit regressivo | Agent `travellini-quality-auditor` o `/audit-ui` · `/firebase-check` · `/stripe-flow` | sonnet |
| UX reale browser, responsive, regressioni | Agent `browser-auditor` o `/audit-browser` · `/smoke-test` | sonnet + Playwright MCP |
| Implementazione di piano chiaro | Agent `travellini-frontend-builder` o `/new-page` | sonnet |
| Release coordination, predeploy, deploy | `/predeploy` → `/deploy` | sonnet |
| Pre-commit review | `/quick-review` | sonnet |

## Quando invocare questa skill

- Sei incerto su quale skill usare per un task.
- Vuoi ricordarti quale agent è economico (haiku) vs costoso (opus).
- Stai per lanciare opus — ferma e verifica che sia davvero necessario.

## Riferimento canonico

La tabella di routing autoritativa è in `CLAUDE.md` — sezione "Model routing (cost discipline)".
Questa skill è una quick-ref sintetica.
