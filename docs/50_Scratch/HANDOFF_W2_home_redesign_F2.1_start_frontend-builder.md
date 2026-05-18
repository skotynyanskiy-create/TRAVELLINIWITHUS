---
title: HANDOFF_W2_home_redesign_F2.1_start_frontend-builder
status: open
created: 2026-05-15
from: travellini-orchestrator
to: travellini-frontend-builder
slug: home-redesign-f2.1-start
expires: 2026-05-29
---

# Handoff: Inizio implementazione Home redesign 11→7 sezioni (F2.1)

## Why this work matters

La direction F2.1 è LOCKED da `travellini-ui-designer` (vedi [docs/50_Scratch/HANDOFF_home_redesign_F2.1_ui-designer_to_frontend-builder.md](./HANDOFF_home_redesign_F2.1_ui-designer_to_frontend-builder.md)). L'owner deve dare GO esplicito prima dell'inizio implementativo (rischio bundle budget — 4289/4300 KB). Questo handoff è il trigger per partire IN W2 dopo GO.

## Decisions already made (LOCKED — non rilitigare)

Tutte le 12 decisioni del handoff ui-designer originale restano valide. Sintesi:

1. 7 sezioni totali (Hero, CoupleIntro, MapStrip+DiscoveryFinder, LatestArticles, InstagramGrid, NewsletterFeature, CommercialBlock).
2. `HomeTrustStrip`, `HomeQuizBudgetTeaser`, `MonetizationTeaser`, `HomeCollaborationCta` rimossi dalla Home (alcuni migrati in CommercialBlock).
3. Lazy boundary preservato solo per sezioni below-the-fold.
4. Bundle budget HARD: ≤ 4300 KB. PR rejected se sfora.
5. MapStrip mobile = immagine statica fallback (NO Mapbox runtime).

## Context the receiver needs

- Source direction: handoff F2.1 ui-designer link sopra
- File principali:
  - [src/pages/Home.tsx](../../src/pages/Home.tsx) — composizione attuale 11 sezioni
  - [src/components/home/](../../src/components/home/) — componenti da rimuovere/aggiungere
  - [src/index.css](../../src/index.css) — CSS vars (non aggiungere, riusare)
- Nuovi componenti da creare:
  - `src/components/home/MapStripDiscovery.tsx` (signature interaction)
  - `src/components/home/CommercialBlock.tsx` (B2C + B2B asimmetrico 60/40)
- Componenti da rimuovere (verificare nessun import residuo):
  - `HomeTrustStrip`, `HomeQuizBudgetTeaser`, `MonetizationTeaser`, `HomeCollaborationCta`, `HomePartnerSignal`, `PartnerLogosStrip`

## What the receiver should produce

- Branch dedicato `feat/f2.1-home-redesign`
- Implementazione progressiva (1 sezione/commit) per facilitare review owner
- Output finale: Home con 7 sezioni live in dev, audit:size PASS, audit:visual PASS, audit:ui PASS, e2e home.spec PASS
- Screenshot desktop + mobile 375px in PR description

## Out of scope (do NOT touch)

- Backend (`server.ts`, `firestore.rules`, `admin.ts`)
- Componenti usati da altre pagine (es. Newsletter è condiviso — non modificare API)
- Foto reali (sono F1.6, in parallelo)

## Open questions / decisions for the user

- **GO/NO-GO** dell'owner sull'inizio F2.1: sì → parti lunedì. No → defer W3.
- Conferma se F2.1 entra in W2 nonostante bundle budget tight (margine 11 KB).
- Se F1.6 non è chiuso, MapStripDiscovery può usare placeholder statico temporaneo? (default: sì, con TODO[F1.6]).

## Next hand-off

- Next agent: `travellini-quality-auditor` + `browser-auditor` (parallel gate finale)
- Trigger: tutte le 7 sezioni implementate + audit:size PASS
