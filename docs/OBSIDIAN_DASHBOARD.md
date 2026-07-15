---
type: dashboard
area: workspace
status: active
cssclasses:
  - dashboard
tags:
  - obsidian
  - dashboard
  - workspace
---

# Travellini — Dashboard

> [!tip] Inizia da qui
> [[50_Scratch/INBOX|Cattura un’idea o un follow-up]] ·
> [[OBSIDIAN_WORKFLOW|Apri le routine operative]] ·
> [[MARKETING_OPERATIONS_HUB|Vai al marketing hub]]

## Focus settimanale

> _Cosa pubblichiamo questa settimana? Qual è la priorità sito? Chi contattare?_

**Settimana del**: 2026-06-29

**Focus editoriale**: completare il lead magnet con 10 luoghi reali

**Focus sito**: chiudere gli activation gate in [[10_Projects/PROJECT_RELEASE_READINESS]]

**Follow-up commerciale**: completare affiliazioni e aggiornare bio Instagram/TikTok

---

## Contenuti in corso

```dataview
TABLE status, priority, pillar
FROM "13_Content"
WHERE type = "content-brief" AND (status = "in-progress" OR status = "draft")
SORT priority ASC
```

---

## Priorità sito (Progetti)

```dataview
TABLE status, priority, owner
FROM "10_Projects"
WHERE type = "project" AND (status = "in-progress" OR status = "active")
SORT priority ASC
```

---

## Task aperti

```dataview
TASK
WHERE !completed AND (file.folder = "10_Projects" OR file.folder = "11_Campaigns" OR file.folder = "12_Partnerships" OR file.folder = "13_Content")
LIMIT 15
```

---

## SEO — Da ottimizzare

```dataview
TABLE target_keywords, priority
FROM "13_Content" OR "10_Projects"
WHERE type = "seo-page" OR contains(tags, "seo")
SORT priority ASC
```

---

## Partner pipeline

```dataview
TABLE stage, priority, owner
FROM "12_Partnerships"
WHERE type = "partner" AND status != "closed"
SORT priority ASC
```

---

## Campagne attive

```dataview
TABLE status, priority, owner
FROM "11_Campaigns"
WHERE type = "campaign" AND status = "active"
SORT priority ASC
```

---

## Bug aperti

```dataview
TABLE severity, priority, owner
FROM "14_Bugs"
WHERE type = "bug" AND status != "resolved" AND status != "closed"
SORT priority ASC
```

---

## Decisioni recenti

```dataview
TABLE owner, status, priority
FROM "20_Decisions"
WHERE type = "decision"
SORT file.mtime DESC
LIMIT 5
```

---

## Inbox da processare

[[50_Scratch/INBOX]]

---

## Link rapidi

### Modelli

Apri il modello, duplicalo nella cartella indicata e rinomina la nuova nota.

- [[90_Templates/TPL_Article|Articolo]]
- [[90_Templates/TPL_Destination_Guide|Guida destinazione]]
- [[90_Templates/TPL_Place|Luogo/Hotel]]
- [[90_Templates/TPL_Itinerary|Itinerario]]
- [[90_Templates/TPL_SEO_Page|SEO page]]
- [[90_Templates/TPL_Collaboration|Collaborazione]]
- [[90_Templates/TPL_Product|Prodotto]]
- [[90_Templates/TPL_Web_Clip|Web clip]]
- [[90_Templates/TPL_Project|Progetto sito]]
- [[90_Templates/TPL_Bug|Bug]]

### Hub principali

- [[MARKETING_OPERATIONS_HUB]] — campagne, partner, contenuti
- [[OBSIDIAN_INDEX]] — indice completo del vault
- [[EDITORIAL_GUIDE]] — regole editoriali
- [[OBSIDIAN_TAXONOMY]] — naming e properties
- [[OBSIDIAN_WORKFLOW]] — tutti i flussi

### Pipeline

- [[95_Bases/Content_Pipeline.base|Content pipeline]]
- [[95_Bases/Editorial_Archive.base|Archivio editoriale]]
- [[95_Bases/Place_Library.base|Library luoghi]]
- [[95_Bases/Shop_Products.base|Prodotti shop]]
