---
type: bug
area: workspace
status: done
priority: p1
owner: team
repo_path: docs/
related: '[[OBSIDIAN_HOME]] · [[VAULT_AND_GRAPHIFY_OPERATING_STATE]]'
source: audit completo vault 2026-06-28
tags:
  - obsidian
  - workspace
  - bug
---

# BUG — Vault Obsidian disallineato

> **2026-07-23:** `npm run audit:obsidian` → **PASS** (0 errors). Residual WARN = ~19 link storici a file codice rimossi — vedi [[VAULT_AND_GRAPHIFY_OPERATING_STATE]].

## Sintomo

- alcune Bases usavano uno schema legacy;
- tipi e stati delle note non seguivano una tassonomia unica;
- cartelle esterne e backup aumentavano il rumore di ricerca;
- file Base e Canvas anonimi erano visibili nel vault;
- mancava un controllo automatico dedicato.

## Impatto

Dashboard incomplete, risultati incoerenti nelle pipeline e ricerca lenta.

## Risoluzione

- migrate le cinque Bases legacy;
- corretti percorsi e filtri delle viste;
- normalizzati i metadati deterministici;
- aggiunto [[OBSIDIAN_INDEX]];
- aggiunti `generate:obsidian-index` e `audit:obsidian`;
- file anonimi spostati in `docs/99_Archive/Obsidian_Quarantine_2026-06-28/`;
- esclusi dall’indice backup, archivio e cataloghi esterni.

## Verifica

- [x] Local REST API risponde e punta alla root corretta
- [x] tutte le Bases canoniche usano YAML corrente
- [x] frontmatter operativo completo
- [x] dashboard collegata a viste esistenti
- [x] audit automatico disponibile
