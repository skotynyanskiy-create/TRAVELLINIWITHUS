---
type: decision
area: workspace
status: active
priority: p1
owner: Rodrigo
tags:
  - decision
  - obsidian
  - graphify
  - workspace
---

# DECISION_0004_OBSIDIAN_GRAPHIFY_SPLIT_VAULT_STRATEGY

## Contesto

La root del repository come vault obbligava Obsidian a osservare anche codice,
`node_modules`, cache e output tecnici. I filtri nascondevano questi file
dall'interfaccia, ma il carico misurato restava elevato. Graphify aggiunge un
indice specializzato del codice e rende inutile duplicare quel corpus in
Obsidian.

## Decisione

- Vault Obsidian operativo: la cartella `docs/` di questo repository.
  _(In origine qui c'era un percorso assoluto sulla macchina di un'altra
  persona: la decisione è la cartella, non il percorso.)_
- Corpus Graphify: repository root, limitato al codice da `.graphifyignore`.
- Obsidian (core Graph + Bases + wikilink) gestisce note, proprietà, campagne e
  progetti. **Extended Graph non è nel stack installato di default** (2026-07-23):
  se serve, installarlo solo on-demand e non aprirlo all'avvio (carico CPU).
- Graphify gestisce dipendenze, call path e blast radius del codice.
- Nessun export Obsidian di Graphify nel vault live.
- Audit plugin aggiornato: [[OBSIDIAN_PLUGIN_CONFIG_AUDIT_2026-07-23]].

## Evidenza

Nel test contemporaneo, Obsidian sul vault root superava ripetutamente il 300%
CPU aggregato. Sul vault `docs/`, con Graphify interrogato nello stesso momento,
il campione è sceso a circa 14% aggregato.

## Rollback

Le configurazioni precedenti sono conservate localmente in
`.obsidian/backups/graphify-obsidian-20260705-205649/`. Per tornare indietro,
chiudere Obsidian, ripristinare i file e riaprire la root solo dopo conferma del
proprietario.

## Collegamenti

- [[DECISION_0001_OBSIDIAN_VAULT_STRATEGY]]
- [[OBSIDIAN_HOME]]
- [[OBSIDIAN_WORKFLOW]]
- [[AI_AGENT_STACK]]
