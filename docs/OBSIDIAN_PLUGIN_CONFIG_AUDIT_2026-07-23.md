---
type: audit
area: workspace
status: active
priority: p1
owner: team
observed_at: 2026-07-23
tags:
  - obsidian
  - plugins
  - audit
  - workspace
---

# Audit plugin e configurazione Obsidian — 2026-07-23

## Ambito

Vault operativo: **`docs/`** (non root repo) — [[20_Decisions/DECISION_0004_OBSIDIAN_GRAPHIFY_SPLIT_VAULT_STRATEGY]].

Analizzati: core plugins, community plugins, `app.json`, appearance, templates, daily notes, hotkeys, snippets, setup script, sicurezza Local REST API, overlap con Graphify/Bases/Dataview.

**Segreti:** Local REST API ha `apiKey` + certificati in `data.json` locale. **Non** sono stati copiati in questa nota. File gitignored. Non committare mai `plugins/**/data.json` con chiavi.

---

## 1. Executive verdict

| Area                         | Voto /10 | Sintesi                                                                               |
| ---------------------------- | -------: | ------------------------------------------------------------------------------------- |
| Allineamento vault docs/     |        8 | Decisione 0004 corretta; filtri app.json erano legacy root → **corretti in sessione** |
| Stack plugin vs uso reale    |      6.5 | Core solido; 2 community poco usati (Kanban, Excalidraw)                              |
| Sicurezza locale             |      5.5 | REST API utile ma insecure HTTP on + chiavi su disco                                  |
| Coerenza Templates/Templater |        6 | Doppia stack; Templater senza data → **data.json creato**                             |
| Performance                  |      7.5 | Vault docs leggero; Omnisearch migliorato (hide excluded)                             |
| Documentazione ops           |        8 | Workflow + setup script presenti                                                      |
| **Complessivo config**       |  **7.0** | Usabile e maturo; serve disciplina plugin + secret hygiene                            |

---

## 2. Core plugins

| Plugin                                                   | Stato | Valutazione                             |
| -------------------------------------------------------- | ----- | --------------------------------------- |
| file-explorer, search, switcher, command-palette         | on    | Essenziali                              |
| graph, backlink, outgoing-link, tag-pane, outline        | on    | Essenziali knowledge                    |
| properties, bookmarks, page-preview                      | on    | OK con taxonomy YAML                    |
| **bases**                                                | on    | **Critico** — 16 `.base` in `95_Bases/` |
| canvas                                                   | on    | 6 canvas in uso                         |
| daily-notes                                              | on    | `40_Daily` + TPL_Daily                  |
| templates (core)                                         | on    | folder `90_Templates`                   |
| workspaces, file-recovery, word-count, slash-command     | on    | OK                                      |
| publish, sync                                            | off   | Corretto (repo git)                     |
| slides, audio, zk-prefixer, random, footnotes, webviewer | off   | OK                                      |

**Nota:** DECISION_0004 cita **Extended Graph** community, ma **non è installato**. Grafo = core Graph only. O installare Extended Graph on-demand, o aggiornare la decision (fatto sotto in raccomandazioni).

---

## 3. Community plugins (installati)

| ID                         | Nome                 | Versione locale | Uso nel vault                      | Verdetto                                       |
| -------------------------- | -------------------- | --------------- | ---------------------------------- | ---------------------------------------------- |
| dataview                   | Dataview             | 0.5.68          | Dashboard query live               | **KEEP — critico**                             |
| templater-obsidian         | Templater            | 2.24.0          | Hotkey + template insert           | **KEEP** (configurato ora)                     |
| omnisearch                 | Omnisearch           | 1.29.3          | Ctrl+Shift+F                       | **KEEP** (filtri migliorati)                   |
| obsidian-linter            | Linter               | 1.32.0          | Ctrl+Alt+L; regole quasi tutte off | **KEEP** ma profilo debole                     |
| obsidian-local-rest-api    | Local REST API + MCP | 4.1.7           | Automazione AI/MCP                 | **KEEP** con igiene secret                     |
| obsidian-kanban            | Kanban               | 2.0.51          | **0 board** `.kanban`              | **CANDIDATE REMOVE** o creare 1 board pipeline |
| obsidian-excalidraw-plugin | Excalidraw           | 2.25.3          | **0 file** excalidraw              | **CANDIDATE REMOVE** (Canvas core basta)       |

### Setup script vs installati

`scripts/install-obsidian-plugins.mjs` / `npm run setup:obsidian-plugins` installa:

- dataview, kanban, templater, linter, omnisearch, excalidraw

**Non** installa Local REST API (va da Community Plugins a mano — corretto, ha secret).

`community-plugins.json` include REST API + i sei sopra. File **gitignored** (macchina locale).

---

## 4. Impostazioni app (pre/post fix)

### Prima (problema)

```json
"userIgnoreFilters": [
  "backups/",
  "claude-plugins-official/",
  "docs/99_Archive/"
]
```

Con vault = `docs/`, i path `docs/99_Archive/` e `claude-plugins-official/` **non esistono nel vault** → filtri inutili; archive non nascosta.

### Dopo (applicato 2026-07-23)

```json
"userIgnoreFilters": [
  "99_Archive/",
  "backups/",
  ".trash/"
]
```

Altri setting buoni già presenti:

- `homePath`: OBSIDIAN_HOME
- `newFileFolderPath`: 50_Scratch
- `attachmentFolderPath`: 70_Assets
- `alwaysUpdateLinks`: true
- `useMarkdownLinks`: false (wikilink)
- `newLinkFormat`: shortest

### Audit script

`scripts/audit-obsidian.mjs` richiedeva i filtri legacy root → **aggiornato** a `99_Archive/` + `backups/`.

---

## 5. Duplicazioni e confusione

| Problema                     | Dettaglio                                                   | Azione                                                                                           |
| ---------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Templates core + Templater   | Entrambi puntano a `90_Templates`                           | OK se Templater ha folder config (ora sì). Non duplicare template “Templater-only” senza bisogno |
| Graph core vs Extended Graph | Decision parla Extended; non installato                     | Allineare docs o installare                                                                      |
| Graphify vs Obsidian Graph   | Due grafi diversi (codice vs note)                          | Già documentato in [[VAULT_AND_GRAPHIFY_OPERATING_STATE]] — non unire                            |
| Bases vs Dataview            | Entrambi per tabelle                                        | Complementari: Bases = UI nativa; Dataview = dashboard flessibile. **Tenere entrambi**           |
| Kanban vs Bases pipeline     | Kanban zero board; Bases hanno pipeline                     | Preferire Bases; Kanban opzionale                                                                |
| Excalidraw vs Canvas         | 6 canvas, 0 excalidraw                                      | Preferire Canvas; rimuovere Excalidraw se non serve whiteboard freeform                          |
| DECISION_0001 superseded     | Ancora in index; status superseded                          | OK lasciare; home non deve linkarla come attiva                                                  |
| Root `.obsidian`             | Workflow dice legacy; su questa macchina può essere assente | Non aprire root come vault                                                                       |
| Snippet theme + vault        | entrambi enabled                                            | OK se non confliggono                                                                            |

---

## 6. Sicurezza Local REST API

| Check                             | Stato                                                 |
| --------------------------------- | ----------------------------------------------------- |
| `data.json` con apiKey + cert/key | Presente in locale                                    |
| Git tracked?                      | **No** (ignore `.obsidian/`)                          |
| `enableInsecureServer: true`      | **Rischio locale** — HTTP senza TLS su porta insecure |
| Porte 27123/27124                 | Default plugin                                        |

### Raccomandazioni (owner)

1. Non condividere screenshot di Settings → Local REST API
2. Se la chiave è mai finita in chat/log → **rigenera** in Obsidian e aggiorna MCP (`.mcp.json` locale, non committare)
3. Preferire solo HTTPS locale se i client lo supportano; spegni insecure se non serve
4. Firewall: non esporre porte su LAN
5. Non aggiungere `data.json` a git con `git add -f`

---

## 7. Linter

Quasi tutte le regole YAML **disabled**. Utile come comando manuale, non come normalizzatore taxonomy.

**Opzione leggera (non applicata in automatico sul vault intero):**

- trailing whitespace
- consistent line endings
- headings blank lines

**Non abilitare** yaml-key-sort aggressivo senza test — rompe frontmatter custom.

---

## 8. Plugin nuovi — valutazione

| Plugin                          | Utilità Travellini   | Rischio                  | Verdetto                           |
| ------------------------------- | -------------------- | ------------------------ | ---------------------------------- |
| **Homepage** / Custom Frames    | homePath già nativo  | basso                    | **No** — ridondante                |
| **Metadata Menu**               | taxonomy type/status | medio learning           | **Lab** se pain su properties      |
| **Projects**                    | Gantt progetti       | overlap Bases            | **No** ora                         |
| **Tasks**                       | task query avanzate  | overlap Dataview TASK    | **Lab** opzionale                  |
| **Calendar**                    | daily nav            | basso                    | **Sì utile** se usi molto 40_Daily |
| **Recent Files**                | switch veloce        | nullo                    | **Sì leggero**                     |
| **Style Settings**              | tema                 | solo se custom CSS       | No urgente                         |
| **Git**                         | commit da Obsidian   | conflitto con husky/repo | **No** — usa CLI/git               |
| **Smart Connections / Copilot** | AI in vault          | privacy, costo, slop     | **No** — stack AI già fuori        |
| **Extended Graph**              | grafo avanzato       | CPU (motivo split vault) | **Solo on-demand**, mai auto-open  |
| **DB Folder**                   | tabelle              | overlap Bases            | **No**                             |
| **Paste URL into selection**    | UX link              | basso                    | Nice-to-have                       |
| **Various Complements**         | autocomplete         | basso                    | Nice-to-have                       |

### Nuove “connessioni”

| Connessione              | Stato              | Nota                                      |
| ------------------------ | ------------------ | ----------------------------------------- |
| MCP ↔ Local REST API     | Prevista           | Chiave locale; non in git                 |
| Graphify ↔ Obsidian      | Separati by design | Non bridgeare export                      |
| Bases embed in Dashboard | Già                | MARKETING hub + dashboard                 |
| Telegram / IG in vault   | Solo note          | Nessun plugin social ufficiale affidabile |

---

## 9. Pulizia consigliata (azioni)

### Fatto in questa sessione

- [x] Corretti `userIgnoreFilters` per vault `docs/`
- [x] Allineato `audit-obsidian.mjs` ai filtri nuovi
- [x] Creato `templater-obsidian/data.json` (folder templates + daily folder template)
- [x] Omnisearch: hide excluded + downrank Scratch/Archive/superpowers
- [x] Questa nota di audit

### Da fare (owner, 10–20 min in Obsidian UI)

- [x] **Excalidraw rimosso** da community-plugins + setup script + cartella locale
- [x] **Kanban rimosso** da community-plugins + setup script + cartella locale
- [ ] Verifica Templater folder = `90_Templates` dopo reload
- [ ] Extended Graph: o installi e lo usi on-demand, o togli il nome da DECISION_0004
- [ ] Local REST API: conferma insecure server solo se MCP lo richiede
- [ ] Reload vault / “Open folder as vault” = `docs`

### Non fare

- Non installare 5+ AI plugin
- Non riaprire root repo come vault
- Non versionare `plugins/` o chiavi
- Non mass-lint tutto il vault in un colpo

---

## 10. Target stack “pulito” consigliato

### Core (invariato)

Bases, Canvas, Graph, Daily notes, Properties, Backlinks, Templates

### Community minimo efficace

1. Dataview
2. Templater
3. Omnisearch
4. Linter (manuale)
5. Local REST API (solo se usi MCP)

### Opzionale

- Calendar
- Recent Files
- Extended Graph (on-demand)
- Kanban (solo se una board reale)

### Fuori stack

Excalidraw (se zero file), Smart Connections, Git plugin, DB Folder

---

## 11. Hotkeys attuali

| Combo        | Comando          |
| ------------ | ---------------- |
| Ctrl+Shift+F | Omnisearch       |
| Ctrl+Alt+L   | Linter file      |
| Ctrl+Shift+I | Templater insert |

Coerenti. Nessun conflitto ovvio.

---

## 12. Snippet CSS

- `travellini-vault.css` — tracked, layout dashboard
- `travellini-theme.css` — locale (appearance enabled; verificare se in git)

Entrambi enabled. Se theme non è tracked, OK locale.

---

## 13. Checklist salute post-audit

```bash
npm run audit:obsidian
npm run generate:obsidian-index
```

In Obsidian: Settings → Community plugins → solo lista target · Files & Links → excluded files = allineati ad app.json.

---

## Collegamenti

- [[VAULT_AND_GRAPHIFY_OPERATING_STATE]]
- [[OBSIDIAN_WORKFLOW]]
- [[OBSIDIAN_HOME]]
- [[BRAND_KNOWLEDGE_MOC]]
- [[20_Decisions/DECISION_0004_OBSIDIAN_GRAPHIFY_SPLIT_VAULT_STRATEGY]]
