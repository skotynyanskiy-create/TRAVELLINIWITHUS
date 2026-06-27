---
title: HANDOFF_real-content-realign_orchestrator_to_growth
status: open
created: 2026-06-22
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: real-content-realign
expires: 2026-07-06
---

# Handoff: definire il modello-contenuto reale e la tassonomia partnership/ADV

## Why this work matters

L'owner ha deciso di riallineare il sito dal contenuto PLACEHOLDER INVENTATO
(reels.ts, seedArticle, lead magnet "10 posti italiani", pillar Salento) al
contenuto REALE del profilo `@travelliniwithus` (170K, 1.251 post, AGCOM).
Il sito diventa social-first, value-first, a griglia fitta. Prima di toccare
codice servono due decisioni di prodotto che solo growth può chiudere: il
contratto del modello `ContentItem` e il sistema di disclosure ADV trasparente.

## Decisions already made (LOCK — non rimettere in discussione)

- Direzione brand: PIENO ALLINEAMENTO social-first. Sovrascrive il DNA calmo
  di `DESIGN.md`. La tensione va segnalata, non rinegoziata.
- Unità di contenuto: `ContentItem` (non più pillar-essay). `reels.ts` diventa
  un caso particolare di `ContentItem` (source instagram, mediaType reel).
  Gli articoli lunghi sopravvivono SOLO come hub di città/regione che aggregano
  schede reali.
- Sorgente dati a regime: Instagram Graph API (account proprio) per i 1.251
  post. Seed iniziale: i 70 reel già documentati nel seed doc.
- Tassonomia ZONES/TYPES già esiste in `src/config/contentTaxonomy.ts` e
  combacia col seed doc — NON reinventarla, riusala.

## Context the receiver needs

- Fonte di verità unica: [docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md]
  — 70 caption integrali con hook/luogo/prezzo/partner/tipo-ADV, schema
  `ContentItem`, struttura `/destinazione/:regione`, pattern voce R+B.
- Tassonomia esistente: [src/config/contentTaxonomy.ts] (ZONES, TYPES, FORMATS,
  PERIODS, BUDGETS, DURATIONS — riusare).
- Tipi ADV osservati nel dataset: `adv / invito|invited / gifted / collaborazione
/ pubblicità / affiliazione / organic`. ~40 venue partner reali taggati.

## What the receiver should produce

1. **Contratto `ContentItem` finalizzato** (campi raw da IG API + campi curati
   da enrichment) con i valori canonici di `partnership.kind` e la mappa
   ADV → label pubblica trasparente AGCOM-compliant. Specifica per OGNI kind:
   - label pubblica italiana mostrata sulla card/scheda (es. `adv` → "Pubblicità",
     `gifted` → "Prodotto regalato", `affiliate` → "Link affiliato", `organic`
     → nessun badge),
   - se serve disclosure estesa nel dettaglio,
   - regola: nessun contenuto monetizzato senza badge.
2. **Tassonomia hub regione/città**: quali regioni/città diventano hub (Praga è
   cluster forte; Madrid; Italia capillare) e la regola di soglia (min N schede
   per promuovere una zona a hub).
3. **Metrica primaria** del riallineamento e come si misura.
4. **Decisione esplicita** su cosa fare dei placeholder che escono di scena
   (reels.ts attuale, seedArticle Dolomiti, pillar Salento, lead magnet "10
   posti italiani"): rimuovere / archiviare / ripensare come contenuto reale.

Dove atterra: aggiorna [docs/MARKETING_OPERATIONS_HUB.md] e
[docs/10_Projects/PROJECT_ESPLORA_CONSOLIDATION.md] con le decisioni; scrivi
l'handoff successivo verso seo-strategist.

## Out of scope (do NOT touch)

- Implementazione React, CSS, server.ts, firestore.rules.
- Scrittura delle schede editoriali (è di editorial/seo).
- Visual design della griglia (è di ui-designer).

## Open questions / decisions for the user

- Conferma label pubbliche ADV preferite (es. "Pubblicità" vs "ADV" vs
  "In collaborazione") — scelta legale/brand.
- Conferma se il lead magnet "10 posti italiani" va ritirato o rifatto su
  contenuto reale.

## Next hand-off

- Next agent: travellini-seo-conversion-strategist
- Trigger: contratto `ContentItem` + tassonomia ADV approvati dall'owner.
