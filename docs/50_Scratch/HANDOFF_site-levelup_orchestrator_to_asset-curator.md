---
title: HANDOFF_site-levelup_orchestrator_to_asset-curator
status: open
created: 2026-07-05
from: travellini-orchestrator
to: travellini-asset-curator
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

# Handoff: killare i vuoti-immagine con gli asset reali GIÀ adattati (no IG import)

## Why this work matters

La promessa del brand è "posti veri". La pagina Destinazioni con ZERO immagini
reali è un vuoto di specificità e fiducia: contraddice il posizionamento a
prima vista. L'import Instagram Graph API è PARCHEGGIATO dall'owner (2026-07-04),
quindi NON si aspetta: si usa ciò che è già adattato (~80%) per riempire i vuoti
più visibili adesso.

## Decisions already made (LOCK)

- Solo foto reali. Nessuna AI imagery, nessun hotlink Unsplash.
- Usa gli asset REALI già in repo: `content-seed.json` (~40 posti), `reels.ts`
  (5 reel reali), `src/config/site.ts`, e la libreria `/images/*`.
- NON aspettare l'import IG (parcheggiato). Lavora con ciò che esiste.
- Le immagini atterrano nelle superfici DOPO che ui-designer ha lockato il loro
  layout/placeholder spec (vedi trigger).

## Context the receiver needs

- Il cluster `real-content-realign` (handoff `HANDOFF_real-content-realign_*`,
  ora perlopiù consumed/in scadenza) ha già costruito gli hub
  `/destinazione/:regione`: qui si tratta di POPOLARLI, non ricostruirli.
- Vuoti prioritari: pagina Destinazioni (zero immagini), hub Esplora.
- Voce/alt: italiano, specifico (luogo nominato), no "scopri il magico mondo".

## What the receiver should produce

- **Photo plan** che mappa asset reali esistenti → superfici vuote (Destinazioni +
  hub Esplora): quale immagine per quale slot, crop, peso ottimizzato (AVIF/WebP).
- **Alt text italiano** per ogni immagine + OG card dove serve.
- **Lista dei posti che NON hanno ancora alcuna immagine usabile** →
  `[VERIFY: foto owner necessaria]` (input per l'owner, non inventare).
- Handoff `HANDOFF_site-levelup_asset_to_frontend.md` verso frontend-builder.

## Out of scope (do NOT touch)

- Inventare luoghi o foto non esistenti.
- Copy editoriale / meta (seo-strategist, editorial-writer).
- Redesign del layout (ui-designer).
- L'import IG Graph API (parcheggiato).

## Open questions / decisions for the user

- Per i posti senza foto usabile: l'owner fornisce scatti reali o li teniamo fuori
  dalla superficie finché non ci sono? (default consigliato: fuori, mai placeholder).

## Next hand-off

- Next agent: travellini-frontend-builder (wire immagini + alt) → poi
  browser-auditor (LCP ≤ 2.0s mobile sulle route toccate) + quality-auditor.
- Trigger: ui-designer ha lockato il layout/placeholder spec di Destinazioni/Esplora
  (TIER 1) E il photo plan è pronto.
