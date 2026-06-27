---
title: HANDOFF_esplora-restructure_orchestrator_to_growth
status: open
created: 2026-05-24
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: esplora-restructure
expires: 2026-06-07
---

# Handoff: definire il workflow utile e l'innesto monetizzazione di Esplora

## Why this work matters

Esplora e' l'hub canonico di discovery (post-consolidamento 5->2 pagine). Oggi e' un finder a 6 dimensioni costruito su un archivio quasi vuoto (<6 articoli reali, regime noindex). Prima di ridisegnare UX o copy serve decidere COSA e' davvero utile alla coppia italiana che cerca "posti veri da vivere" e DOVE la monetizzazione (club 5,90 euro/mese, newsletter, lead magnet, affiliate /risorse, B2B) si innesta senza rompere il tono editoriale.

## Decisions already made (dall'owner, da non relitigare)

- Quiz pubblico rimosso (2026-05-24): `/quiz` -> redirect `/esplora`, `HomeQuizBudgetTeaser` e calcolatori budget eliminati. Tensione aperta: `EsploraQuiz.tsx` ancora referenziato in `Esplora.tsx` (git: deleted). Decidi se il finder guidato torna sotto altra forma o sparisce del tutto.
- 2 sole pagine discovery pubbliche: `/esplora` + `/mappa`. Itinerari resta sottosistema separato.
- Tassonomia canonical a 6 dimensioni gia' lockata in `contentTaxonomy.ts` (ZONES, TYPES, FORMATS, PERIODS, BUDGETS, DURATIONS).
- Regime noindex finche' <6 articoli reali pubblicati.

## Context the receiver needs

- Stato Esplora: [docs/10_Projects/PROJECT_ESPLORA_CONSOLIDATION.md]
- Stato release / cosa e' wired vs attivo: [docs/10_Projects/PROJECT_RELEASE_READINESS.md], [docs/MARKETING_OPERATIONS_HUB.md] (tabella "Revenue surface")
- Pagina: [src/pages/Esplora.tsx], tassonomia [src/config/contentTaxonomy.ts], picks [src/config/discoveryPicks.ts]
- Monetizzazione: club pre-lancio 5,90/mese, shop preorder-first 1 SKU, affiliate 2/6 attivi, lead magnet pre-attivazione (RESEND mancante).

## What the receiver should produce

Documento di direzione (inline nella risposta, no file extra) con:

1. **Job-to-be-done** primario di Esplora per la coppia target, in una frase.
2. **Risposta alle 5 domande strategiche** (vedi sotto) con decisione netta, non opzioni aperte.
3. **Curatela vs finder**: la curatela editoriale deve precedere il finder a 6 dimensioni dato l'archivio vuoto? Quale ordine di priorita' delle 6 dimensioni (quali sempre visibili, quali in accordion, quali da rimuovere finche' i contenuti non le giustificano).
4. **Punti di innesto monetizzazione** mappati sul flusso (dove newsletter contestuale, dove club teaser, dove affiliate, dove B2B) con la regola "non rompere il calm editorial".
5. **Metrica primaria di successo** di Esplora (es. explore_card_click rate / newsletter signup da contesto / club teaser CTR) e cosa NON misurare ora.

Le 5 domande strategiche a cui rispondere:

- Esplora vs Mappa vs Itinerari si sovrappongono nella testa dell'utente? Confine netto di ciascuna.
- Il finder a 6 dimensioni e' over-engineering con archivio quasi vuoto? Quante dimensioni reggono ora.
- La curatela (collezioni editoriali) deve venire PRIMA del finder?
- Il quiz/finder guidato deve tornare (in altra forma) o e' morto definitivamente?
- Qual e' il primo momento monetizzabile nel flusso senza tradire il tono?

## Out of scope (do NOT touch)

- Layout/visual decisions (spettano a ui-designer).
- Copy dei filtri / meta / schema (spettano a seo-strategist).
- Codice (spetta a frontend-builder).
- Non inventare numeri di audience o conversione: marca [VERIFY] se servono dati -> data-analyst.

## Next hand-off

- Next agent: travellini-ui-designer
- Trigger: direzione growth approvata dall'owner; le 5 domande hanno risposta netta.
