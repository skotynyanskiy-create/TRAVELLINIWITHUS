---
title: HANDOFF_real-content-realign_asset_to_frontend
status: open
created: 2026-06-22
from: travellini-asset-curator
to: travellini-frontend-builder
slug: real-content-realign
expires: 2026-07-13
type: handoff
area: workspace
---

# Handoff: implementare modello ContentItem, seed, /esplora social-first, /destinazione/:regione

## Why this work matters

Tutte le decisioni a monte (data-model, voce, visual, schede, cover) sono
chiuse. Qui si rende vivo il riallineamento: modello `ContentItem`, seed dei
~70 item reali, migrazione dei placeholder, griglia social-first su `/esplora`
e nuove pagine hub `/destinazione/:regione`.

## Decisions already made (LOCK)

- `ContentItem` è l'unità (vedi contratto growth). `reels.ts` diventa un caso
  particolare → migrare gli attuali 5 reel reali a ContentItem, non duplicarli.
- Social-first: griglia fitta, card cover+hook+prezzo+badge tipo+badge ADV
  (direzione visiva da ui-designer).
- Placeholder INVENTATI da rimuovere/migrare secondo la decisione growth:
  `seedArticle.ts` (Dolomiti demo), pillar Salento, lead magnet "10 posti
  italiani". I 5 reel in `reels.ts` sono REALI → migrali, non cancellarli.
- Disclosure ADV con label decise da growth/seo.

## Context the receiver needs

- Contratto ContentItem: handoff growth. Voce/template: handoff seo.
  Visual card+hub: handoff ui-designer. Schede: doc editorial. Cover: doc asset.
- Tassonomia già pronta: [src/config/contentTaxonomy.ts] (riusare, non duplicare).
- Esplora esistente: [src/pages/Esplora.tsx], [src/components/discovery/ArchiveCard.tsx],
  [docs/10_Projects/PROJECT_ESPLORA_CONSOLIDATION.md].
- Reel reali da migrare: [src/config/reels.ts].
- Placeholder da rimuovere: [src/data/seedArticle.ts].

## What the receiver should produce

1. **Modello `ContentItem`** in `src/` (tipo + helper, riusando i tipi della
   tassonomia). `reels.ts` rifattorizzato come sottoinsieme.
2. **Seed dati** dei ~70 item reali (dal doc editorial) in un file config/seed.
3. **Card `ContentItem`** e **griglia social-first** su `/esplora` secondo la
   direzione ui-designer (hook-domanda, prezzo, badge tipo, badge partnership).
4. **Pagina hub `/destinazione/:regione`** (route + componenti) come da seed doc:
   hero regione + sezioni Mangiare/Dormire/Esperienze/Vedere-Relax + mappa.
5. **Rimozione/migrazione placeholder**: Dolomiti seed, pillar Salento, lead
   magnet inventato — secondo la decisione growth. Aggiornare i consumer e i
   redirect dove serve.
6. `npm run typecheck` + `npm run audit:ui` PASS; verifica in browser
   (preview / chrome-devtools MCP) con prova visiva.

VINCOLO DURO: NON toccare `server.ts`, `firestore.rules`, `src/config/admin.ts`.
L'integrazione Instagram Graph API è di travellini-backend-engineer (parallela).
Consuma il `ContentItem` come modello stabile: l'adapter API riempirà i campi
raw più avanti senza rompere il seed.

## Out of scope (do NOT touch)

- server.ts / firestore.rules / admin.ts / webhook Stripe / API IG.
- Riscrittura della tassonomia.
- Copy nuovo (usa quello di editorial/seo).

## Open questions / decisions for the user

- Il seed va in un file statico `src/config/` o su Firestore? (statico = più
  semplice per il primo seed, Firestore = pronto per l'enrichment admin).

## Next hand-off

- Next agent: travellini-quality-auditor + browser-auditor (gate)
- Trigger: pagine live su localhost, typecheck/audit:ui verdi.
