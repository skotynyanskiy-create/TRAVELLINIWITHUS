---
type: decision
area: workspace
status: superseded
priority: p2
owner: team
tags:
  - decision
  - obsidian
  - workspace
---

# DECISION_0001_OBSIDIAN_VAULT_STRATEGY

> [!warning] Superseded
> Sostituita da [[DECISION_0004_OBSIDIAN_GRAPHIFY_SPLIT_VAULT_STRATEGY]] il
> 2026-07-05 dopo misurazioni reali di carico sul vault root.

## Context

Il progetto aveva gia documentazione valida in `docs/`, ma mancava una struttura Obsidian completa e condivisa.

## Decisione

Usare la root del repository come vault Obsidian del progetto:

```txt
<radice del repository>
```

_(Il percorso assoluto scritto qui in origine puntava alla macchina di un'altra
persona. La decisione è «la root del repo», non un percorso: quella resta valida
ovunque il repo sia clonato.)_

Le note operative restano in `docs/`, che continua a essere la memoria versionata del progetto. La root viene usata come vault per permettere a Obsidian Local REST API, MCP e strumenti AI di vedere sia le note sia il codice dello stesso progetto.

Versionare:

- note `.md`
- file `.base`
- una selezione minima di config documentale in `docs/.obsidian/`

Tenere locali:

- workspace layout
- hotkeys personali
- cache e stato effimero
- `.obsidian/` root, incluso Local REST API e chiavi locali

## Impatto

- onboarding piu rapido
- note operative uniformi
- migliore tracciabilita tra piani, decisioni e lavoro attivo

## Collegamenti

- [[OBSIDIAN_HOME]]
- [[OBSIDIAN_WORKFLOW]]
- [[OBSIDIAN_TAXONOMY]]
