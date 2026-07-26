---
title: HANDOFF_real-content-realign_orchestrator_to_uidesigner
status: open
created: 2026-06-22
from: travellini-orchestrator
to: travellini-ui-designer
slug: real-content-realign
expires: 2026-07-06
type: handoff
area: workspace
---

# Handoff: direzione visiva social-first + aggiornamento DESIGN.md

## Why this work matters

L'owner ha deciso di spostare il sito verso un'estetica vicina al feed IG:
vivace, satura, value-first, griglia fitta di card, hook-domanda dominanti,
prezzo in evidenza, badge tipo + badge partnership. Questo SOVRASCRIVE il DNA
calmo/editoriale attuale di `DESIGN.md`. Serve la direzione visiva della card
`ContentItem` e della griglia, più l'aggiornamento del design system.

## Decisions already made (LOCK)

- Direzione: social-first è DECISA. Non riproporre il DNA calmo come alternativa.
  Puoi e devi segnalare la tensione e proteggere la qualità (non SaaS, non
  gradient blob, niente fake control), ma la rotta è questa.
- Card = unità visiva: cover + hook-domanda + 1 riga valore/prezzo + badge tipo
  - badge partnership trasparente. Griglia fitta tipo feed.
- DESIGN.md va aggiornato per riflettere la nuova direzione (con changelog che
  cita questa decisione e la tensione col DNA precedente).

## Context the receiver needs

- Fonte di verità contenuti: [docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md].
- Card esistente da evolvere: [src/components/discovery/ArchiveCard.tsx].
- Pagina Esplora esistente: [src/pages/Esplora.tsx] (già consolidata, vedi
  [docs/10_Projects/PROJECT_ESPLORA_CONSOLIDATION.md]).
- Design system: [DESIGN.md].

## What the receiver should produce

1. **Direzione visiva card `ContentItem`** (mock testuale/figma-ready): gerarchia
   cover/hook/prezzo, trattamento badge tipo + badge partnership ADV (deve
   leggersi come trasparenza, non come spam), stati hover, densità griglia,
   come la griglia social-first convive con la qualità premium (evitare il
   look "aggregatore booking").
2. **Layout hub `/destinazione/:regione`**: hero regione + sezioni Mangiare/
   Dormire/Esperienze/Vedere-Relax + mappa, come da seed doc.
3. **DESIGN.md aggiornato**: nuova direzione social-first, palette/densità,
   regole card, changelog che dichiara esplicitamente la sovrascrittura del DNA
   calmo e la tensione (per tracciabilità).

Dove atterra: aggiorna [DESIGN.md]; scrivi l'handoff verso frontend-builder con
le specifiche card+griglia+hub.

## Out of scope (do NOT touch)

- Codice React/CSS (è di frontend-builder).
- Italian copy delle schede (seo/editorial).
- Data-model (growth).
- server.ts / API.

## Open questions / decisions for the user

- Quanto "saturo/vivace" spingersi: serve un livello target (es. palette IG-like
  piena vs sand/ink scaldata) — proporre 1-2 opzioni e far scegliere l'owner.

## Next hand-off

- Next agent: travellini-frontend-builder
- Trigger: direzione card + layout hub + DESIGN.md aggiornati e approvati.
