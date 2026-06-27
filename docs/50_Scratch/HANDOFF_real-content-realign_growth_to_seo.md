---
title: HANDOFF_real-content-realign_growth_to_seo
status: open
created: 2026-06-22
from: travellini-growth-revenue-operator
to: travellini-seo-conversion-strategist
slug: real-content-realign
expires: 2026-07-06
---

# Handoff: copy schede ContentItem + meta/schema hub regione + voce ADV

## Why this work matters

Con il contratto `ContentItem` e la tassonomia ADV chiusi da growth, serve la
voce pubblica: il pattern testuale di ogni scheda (hook-domanda + valore/prezzo

- criterio "vale la pena?") e i meta/schema delle pagine hub
  `/destinazione/:regione`. È la traduzione del feed IG in copy on-site coerente.

## Decisions already made (LOCK)

- Social-first, value-first: hook a domanda dominante, prezzo SEMPRE esplicito
  quando noto, criterio "vale la pena? per chi?".
- `ContentItem` è l'unità; gli hub regione/città aggregano schede reali.
- Disclosure ADV con label decise da growth — usarle, non inventarne nuove.

## Context the receiver needs

- Fonte di verità: [docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md]
  — pattern voce R+B (riga "Pattern di descrizione contenuto") e i 70 hook reali.
- Contratto ContentItem + label ADV: handoff growth (questo file a monte).
- Tassonomia: [src/config/contentTaxonomy.ts].

## What the receiver should produce

1. **Template testuale scheda** `ContentItem`: regole per `hook` (domanda,
   maiuscola sì/no), `title` editoriale, `description` (1 frase cos'è + dato di
   valore + criterio), come si rende il prezzo, come si rende il badge ADV.
   NON scrivere tutte le 70 schede — fornisci il template + 5 schede campione
   complete come riferimento di voce.
2. **Meta + schema hub** `/destinazione/:regione`: pattern H1 ("I posti
   particolari di [Regione] che valgono"), title/description, slug, JSON-LD
   appropriato (CollectionPage / ItemList con i ContentItem).
3. **GEO/AI-search note** (`/ai-seo`): come gli hub vanno strutturati per AI
   search, dato che sono liste curate non essay.

Dove atterra: scrivi il template in un doc breve e l'handoff verso
editorial-writer (per le schede di massa) e asset-curator (cover/alt) +
frontend-builder (meta/schema implementazione).

## Out of scope (do NOT touch)

- Definizione del data-model (già chiuso da growth).
- Implementazione React / server.
- Visual/layout (ui-designer).

## Open questions / decisions for the user

- Hook in MAIUSCOLO come su IG, o sentence-case per il sito? (impatto leggibilità)

## Next hand-off

- Next agent: travellini-editorial-writer (schede di massa) → poi asset-curator
- Trigger: template scheda + meta/schema hub approvati.
