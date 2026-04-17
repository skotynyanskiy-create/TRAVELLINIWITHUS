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

```
docs/
├── 10_Projects/     note di lavoro, feature, sprint
├── 11_Campaigns/    campagne marketing
├── 12_Partnerships/ collaborazioni brand e lead commerciali
├── 13_Content/      pillar strategici, content calendar
├── 14_Bugs/         bug e issue tracking
├── 20_Decisions/    decision log (ADR)
├── 30_Meetings/     meeting notes e handoff
├── 40_Daily/        daily notes
├── 50_Scratch/      inbox e note transitorie
├── 60_Editorial/    archivio contenuti pubblicati e in corso
│   ├── Articoli/
│   ├── Guide/
│   ├── Itinerari/
│   └── Destinazioni/
├── 70_Brand/        knowledge base brand
│   ├── Voce_e_Tono/
│   ├── Personas/
│   └── Visual/
├── 80_SEO/          sistema SEO per pagine
│   ├── Keywords/
│   └── Pagine/
├── 85_Shop/         prodotti e affiliati
│   ├── Prodotti/
│   └── Affiliati/
├── 86_Social/       content planning social
│   ├── Instagram/
│   └── TikTok/
├── 87_References/   web clips e reference visive
│   ├── Competitor/
│   ├── Design/
│   ├── Luoghi/
│   ├── Trend/
│   ├── Articoli/
│   └── Idee/
├── 90_Canvas/       mappe visive
├── 90_Templates/    tutti i template
└── 95_Bases/        database Obsidian
```

---

## Workflow editoriale — Nuovo articolo

1. **Idea** → cattura in [[50_Scratch/INBOX]]: titolo + angolo editoriale + keyword
2. **Brief** → crea `60_Editorial/Articoli/ART_<slug>.md` da [[90_Templates/TPL_Article]]
   - imposta `pillar`, `keyword_primaria`, `route`, `author`
3. **Sviluppo** → scrivi draft nella nota
   - collega `[[DEST_]]` se c'è destinazione
   - collega `[[PLACE_]]` per luoghi specifici
4. **SEO** → crea `80_SEO/Pagine/SEO_<slug>.md` da [[90_Templates/TPL_SEO_Page]]
5. **Review** → `status: review`, aggiorna link interni e CTA
6. **Pubblicazione** → imposta `status: published`, `published_at`, `route` finale
7. **Post-publish** → aggiungi link dall'articolo in note destinazione/guide correlate

---

## Workflow editoriale — Nuova destinazione

1. Crea `60_Editorial/Destinazioni/DEST_<nome>.md` da [[90_Templates/TPL_Destination_Guide]]
2. Crea luoghi collegati in `87_References/Luoghi/` da [[90_Templates/TPL_Place]]
3. Crea itinerario in `60_Editorial/Itinerari/ITIN_<dest>_<durata>.md` da [[90_Templates/TPL_Itinerary]]
4. Crea SEO page in `80_SEO/Pagine/SEO_<slug>.md`
5. Collega tutti gli articoli correlati con wikilink bidirezionali

---

## Workflow editoriale — Prodotto shop

1. Crea `85_Shop/Prodotti/PROD_<nome>.md` da [[90_Templates/TPL_Product]]
2. Collega contenuti correlati: guide, articoli, destinazioni
3. Scrivi copy vendita nella nota
4. Collega a campagna lancio se pianificata
5. Checklist lancio nella nota: asset, Stripe, route live

---

## Workflow commerciale — Collaborazione brand

1. Crea `12_Partnerships/COLLAB_<brand>.md` da [[90_Templates/TPL_Collaboration]]
2. Collega a [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
3. Valuta `fit_brand` prima di rispondere
4. Se accordo → crea brief contenuto con [[90_Templates/TPL_Content_Brief]]
5. Collega deliverable a campagna dedicata

---

## Workflow SEO — Audit pagina

1. Crea `80_SEO/Pagine/SEO_<route>.md` da [[90_Templates/TPL_SEO_Page]]
2. Compila analisi attuale (title, h1, meta, score)
3. Identifica ottimizzazioni e link interni mancanti
4. Imposta `priority` e `status: in-corso`
5. Quando completato → `status: ottimizzato`, aggiorna `last_audit`

---

## Workflow web clipper

1. Salva URL in Omnivore/Readwise con tag di categoria
2. Sync in Obsidian → atterrano in `50_Scratch/INBOX` o direttamente in `87_References/`
3. Una volta a settimana: processa inbox, sposta in sottocartella giusta
4. Aggiungi `action` e collega a note rilevanti
5. **Regola**: clip senza `action` entro 7 giorni → cancella o archivia

---

## Workflow operativo — Nuova feature / tweak sito

1. Parti da [[OBSIDIAN_HOME]]
2. Crea nota da [[90_Templates/TPL_Project]] o [[90_Templates/TPL_UI_Change]]
3. Imposta `status`, `priority`, `route`, `repo_path`
4. Collega piano, file chiave, decisioni
5. Quando stabile → promuovi in docs stabili del repo

---

## Workflow operativo — Nuovo bug

1. Crea nota da [[90_Templates/TPL_Bug]]
2. Cattura: sintomo, impatto, riproduzione, fix
3. Compila `repo_path`, `blocked_by` se rilevanti
4. Linka PR, commit, file e test
5. Chiudi con `status: done` e aggiorna nota progetto padre

---

## Routine giornaliera (5 min)

1. Apri [[OBSIDIAN_DASHBOARD]] → controlla focus settimanale
2. Processa `50_Scratch/INBOX` se ci sono nuove clip/idee
3. Aggiorna `status` note in progress
4. Fine lavoro: annota in `40_Daily/` cosa è cambiato

---

## Routine settimanale (20 min)

- Processa tutto l'inbox di `87_References/`
- Aggiorna [[MARKETING_OPERATIONS_HUB]]: campagne, partner, contenuti
- Pianifica i contenuti social della settimana successiva
- Controlla se ci sono SEO page con `priority: p1` da ottimizzare

---

## Routine mensile (45 min)

- Archivia note `status: done/archived` vecchie di 3+ mesi
- Aggiorna i Canvas rilevanti (`90_Canvas/`)
- Review pipeline collaborazioni e follow-up
- Verifica keyword in `80_SEO/Keywords/`
- Monthly report da [[90_Templates/TPL_Monthly_Marketing_Report]]

---

## Agent handoff pattern

- Quando un agente modifica il repo → crea/aggiorna nota progetto o bug
- Salva sempre `repo_path` nella nota
- Se la modifica nasce da chat/review → compila `source`
- Se cambia una decisione → apri/aggiorna nota in `20_Decisions/`

---

## Config condivisa

- `docs/.obsidian/` contiene solo config team-safe
- `workspace*.json`, `hotkeys.json`, cache → restano locali (gitignore)
- I plugin del setup sono core features: vault portabile senza plugin obbligatori
- Plugin community consigliati: Templater, Omnivore/Readwise (opzionale: Dataview)
