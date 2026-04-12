---
type: reference
area: workspace
status: active
tags:
  - obsidian
  - taxonomy
  - workspace
---

# Obsidian Taxonomy

## Standard properties

Usa queste properties nelle note operative:

- `type`: `project`, `task`, `bug`, `decision`, `meeting`, `daily`, `guide`, `plan`, `report`, `workflow`, `release`, `ui-change`, `content-change`, `campaign`, `partner`, `content-brief`, `monthly-report`, `hub`, `dashboard`, `reference`
- `status`: `open`, `in-progress`, `blocked`, `done`, `active`, `snapshot`, `archived`
- `priority`: `p0`, `p1`, `p2`, `p3`
- `area`: `engineering`, `brand`, `operations`, `delivery`, `workspace`, `content`, `product`, `marketing`, `commercial`, `social`
- `owner`: persona o team responsabile
- `due`: data target, quando serve
- `repo`: nome repo, quando la nota parla di una codebase specifica
- `repo_path`: file o cartella rilevante nel repo
- `route`: pagina o area del sito coinvolta, se utile
- `branch`: branch di lavoro, se utile
- `commit`: commit rilevante, se utile
- `blocked_by`: dipendenza o blocco esplicito
- `related`: nota madre o nota collegata principale
- `source`: documento o meeting sorgente

## Naming

- `PROJECT_<topic>` per note progetto
- `TASK_<topic>` per task atomici
- `BUG_<topic>` per bug note
- `UI_<topic>` per modifiche visuali isolate
- `DECISION_<nnnn>_<topic>` per decisioni
- `MEETING_<yyyy-mm-dd>_<topic>` per handoff o meeting
- `RELEASE_<yyyy-mm-dd>_<topic>` per note rilascio

## Link policy

- linka sempre il piano o la guida che da contesto
- linka i file chiave con path assoluti solo nella documentazione fuori da Obsidian
- dentro Obsidian preferisci i wikilink
- se una nota parla di codice, salva anche `repo_path`
- se una nota parla di UI, salva anche `route`
- se una nota nasce da una riunione o handoff, salva anche `source`

## Tag policy

Mantieni pochi tag stabili:

- `obsidian`
- `engineering`
- `brand`
- `operations`
- `delivery`
- `content`
- `workspace`

## Practical schemas

### Feature or redesign

- `type: project`
- `status: in-progress`
- `priority: p1`
- `area: product` o `engineering`
- `route: /home`
- `repo_path: src/components/home/HeroSection.tsx`

### Bug

- `type: bug`
- `status: open`
- `priority: p1`
- `area: engineering`
- `repo_path: <file principale>`

### Decision

- `type: decision`
- `status: active`
- `area: workspace` o `engineering`
- `related: [[PROJECT_...]]`
