---
type: reference
area: workspace
status: active
priority: p1
owner: team
updated: 2026-07-23
tags:
  - obsidian
  - graphify
  - workspace
  - operating-state
---

# Vault + Graphify — stato operativo (2026-07-23)

## Architettura dual-graph (canonica)

| Sistema      | Corpus                                   | Ruolo                                             |
| ------------ | ---------------------------------------- | ------------------------------------------------- |
| **Obsidian** | cartella `docs/` come vault              | Note, wikilink, Bases, brand, marketing, progetti |
| **Graphify** | root repo, filtrato da `.graphifyignore` | Dipendenze e call-path **codice**                 |

**Decisione:** [[20_Decisions/DECISION_0004_OBSIDIAN_GRAPHIFY_SPLIT_VAULT_STRATEGY]]

### Cosa NON fare

- Non aprire la root del repo come vault Obsidian
- Non esportare wiki Graphify dentro `docs/`
- Non indicizzare `docs/`, `.env`, media con Graphify
- Non confondere grafo note (Obsidian) con grafo codice (Graphify)

## Come aprire Obsidian

```
Open folder as vault →
  ...\TRAVELLINIWITHUS\docs
```

Home: [[OBSIDIAN_HOME]]  
Dashboard: [[OBSIDIAN_DASHBOARD]]  
Brand MOC: [[BRAND_KNOWLEDGE_MOC]]  
Marketing: [[MARKETING_OPERATIONS_HUB]]

## Comandi di salute

```bash
# Vault metadata + link check
npm run audit:obsidian

# Rigenera indice note
npm run generate:obsidian-index

# Graphify (codice)
npm run graphify:setup    # se manca .tools/graphify
npm run graphify:check
npm run graphify:index    # dopo cambi strutturali codice
npm run graphify:query -- "come funziona il checkout"
```

## Allineamento eseguito 2026-07-23

| Azione                                  | Esito                                                 |
| --------------------------------------- | ----------------------------------------------------- |
| Fix handoff mancante `area`             | fatto                                                 |
| `npm run generate:obsidian-index`       | fatto                                                 |
| MOC brand [[BRAND_KNOWLEDGE_MOC]]       | creato                                                |
| Decision Family boundary                | creata                                                |
| Hub home/dashboard/marketing link brand | aggiornati                                            |
| Dossier presence Part I–III             | in vault                                              |
| Family note ufficiale                   | in vault                                              |
| Graphify refresh                        | eseguito in sessione (vedi sotto)                     |
| Plugin/config audit                     | [[OBSIDIAN_PLUGIN_CONFIG_AUDIT_2026-07-23]]           |
| Filtri vault `app.json`                 | corretti per root=`docs/` (non path legacy root-repo) |
| Templater + Omnisearch                  | data.json / hide excluded allineati                   |

## Debito noto (non bloccante audit)

### Warning link Markdown assenti (~19)

Molti sono **riferimenti storici** a file codice rimossi o path di un altro PC:

- `src/pages/Home.tsx`, `HomeLegacy`, `AtlanteLab` (home cutover)
- `MapboxWorldMap.tsx` (mappa sostituita)
- path assoluti `C:\Users\ccocu\...`
- markdown malformati in handoff (caption con `](url.avif`)

**Policy:** non riscrivere in massa audit storici. Nuove note: solo wikilink a note vault o path relativi validi al repo corrente. Link codice → preferire `` `src/...` `` monospazio se il file può sparire.

### Brand truth gaps (contenuto, non vault schema)

Vedi [[BRAND_KNOWLEDGE_MOC#Alert aperti (da dossier Part III)]].

## Checklist coerenza mensile

- [ ] `npm run audit:obsidian` → PASS (0 errors)
- [ ] Index aggiornato se nuove note hub
- [ ] Snapshot metriche = `site.ts`
- [ ] Family decision ancora allineata alla realtà IG
- [ ] Graphify index se cambi route/server/services
- [ ] Nessun secret in note

## Percorsi machine

| Cosa          | Path tipico                                          |
| ------------- | ---------------------------------------------------- |
| Repo          | `...\TRAVELLINIWITHUS\`                              |
| Vault         | `...\TRAVELLINIWITHUS\docs\`                         |
| Graphify out  | `...\TRAVELLINIWITHUS\graphify-out\` (gitignored)    |
| Graphify tool | `...\TRAVELLINIWITHUS\.tools\graphify\` (gitignored) |
