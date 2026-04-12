---
type: guide
area: workspace
status: active
tags:
  - obsidian
  - workflow
  - workspace
---

# Obsidian Workflow

## Struttura del vault

- `10_Projects/` note di lavoro e feature
- `20_Decisions/` decision log architetturale e operativo
- `30_Meetings/` meeting notes e handoff
- `40_Daily/` daily notes
- `50_Scratch/` cattura rapida e note transitorie
- `90_Templates/` template condivisi
- `95_Bases/` viste database per il vault

## Flusso consigliato

1. Parti da [[OBSIDIAN_HOME]]
2. Controlla [[OBSIDIAN_DASHBOARD]]
3. Cattura velocemente in [[50_Scratch/INBOX]]
4. Trasforma la cattura in nota strutturata con un template
5. Collega la nota al progetto o alla decisione giusta
6. Chiudi il loop aggiornando la documentazione stabile del repo

## Routine pratica

### Nuova feature

1. Crea una nota da [[90_Templates/TPL_Project]]
2. imposta `status`, `priority`, `area`
3. compila `route`, `repo_path`, `related`, `source` se servono
4. collega piano, file chiave e decisioni
5. quando la feature si stabilizza, promuovi il contenuto nei docs stabili

### Tweak UI o copy

1. Usa [[90_Templates/TPL_UI_Change]]
2. salva sempre `route` e `repo_path`
3. allega note QA, screenshot e decisioni
4. se il tweak diventa piu ampio, promuovilo a `project`

### Nuova campagna

1. Usa [[90_Templates/TPL_Campaign]]
2. imposta `goal`, `channel`, `start`, `end`
3. collega sito, asset e CTA
4. collega la campagna al progetto principale o alla release

### Nuovo partner o lead commerciale

1. Usa [[90_Templates/TPL_Partner]]
2. salva `company`, `stage`, `offer_type`
3. annota fit brand, prossima azione e owner

### Nuovo contenuto o brief

1. Usa [[90_Templates/TPL_Content_Brief]]
2. salva `pillar`, `channel`, `route`
3. collega il brief al contenuto del sito o alla campagna

### Nuovo bug

1. Crea una nota da [[90_Templates/TPL_Bug]]
2. cattura sintomo, impatto, riproduzione e fix
3. compila `repo_path`, `blocked_by`, `source` quando servono
4. linka PR, commit, file e test

### Nuova decisione

1. Crea una nota da [[90_Templates/TPL_Decision]]
2. descrivi contesto, opzioni e decisione presa
3. linka le note impattate

### Riunioni e handoff

1. Usa [[90_Templates/TPL_Meeting]]
2. assegna owner e follow-up
3. collega sempre la nota al progetto attivo

### Release o checkpoint

1. Usa [[90_Templates/TPL_Release_Note]]
2. collega decisioni, fix, bug chiusi e rischi residui
3. promuovi la nota se serve in runbook o report

## Config condivisa

- la cartella `docs/.obsidian/` contiene solo la configurazione team-safe
- `workspace*.json`, `hotkeys.json` e cache restano locali
- i plugin usati nel setup sono core features, cosi il vault resta portabile

## Agent handoff pattern

- usa [[AGENT_WORKFLOWS]] come riferimento operativo
- quando un agente o assistente modifica il repo, crea o aggiorna una nota progetto o bug
- salva sempre i file chiave in `repo_path`
- se la modifica nasce da chat o review, annota la sorgente in `source`
- se cambia una decisione, apri o aggiorna una nota in `20_Decisions/`

## Marketing operating pattern

- usa [[MARKETING_OPERATIONS_HUB]] come dashboard giornaliera marketing
- gestisci home, funnel e collaborazioni come progetti collegati
- usa campagne e partner come pipeline, non come note sparse
- trasforma i contenuti social importanti in brief collegati al sito
