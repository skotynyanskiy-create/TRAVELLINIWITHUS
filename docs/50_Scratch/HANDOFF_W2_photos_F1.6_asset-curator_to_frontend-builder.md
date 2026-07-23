---
title: HANDOFF_W2_photos_F1.6_asset-curator_to_frontend-builder
status: obsolete
created: 2026-05-15
from: travellini-asset-curator
to: travellini-frontend-builder
slug: photos-f1.6-rb-real
expires: 2026-05-29
type: handoff
area: workspace
---

# Handoff: Sostituire foto stock con foto reali R+B (F1.6)

## Why this work matters

Le superfici Home + ChiSiamo + MediaKit + template Articolo usano ancora asset locali "demo/AI placeholder" (sostituiti da Unsplash in audit Fase A, ma non ancora foto reali). L'owner ha confermato disponibilità di foto reali R+B. Sostituzione + alt text italiano + AVIF/WebP/PNG triplet + peso entro budget.

## Decisions already made (LOCKED — non rilitigare)

- Photo people-led: R+B visibili nelle hero principali (Home, ChiSiamo, MediaKit).
- Stack format: AVIF first + WebP fallback + PNG fallback (Vite imagetools già configurato).
- Alt text italiano descrittivo specifico (non "couple traveling" — invece "Rodrigo e Betta al tramonto sulla costa di Otranto").
- Peso target: hero ≤ 180KB AVIF, secondary ≤ 80KB AVIF.
- LCP hero preload preservato.

## Context the receiver needs

- Output asset-curator (in arrivo W1 weekend): photo plan + shopping list + alt text in `docs/50_Scratch/F1.6_photo_audit_*.md`
- Foto reali R+B: location locale fornita dall'owner [VERIFY: path cartella]
- File da editare:
  - `src/components/home/HeroSection.tsx`
  - `src/components/home/CoupleIntro.tsx`
  - [src/pages/ChiSiamo.tsx](../../src/pages/ChiSiamo.tsx)
  - [src/pages/MediaKit.tsx](../../src/pages/MediaKit.tsx)
  - Template articolo hero in [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx)
- Cartella asset: `public/images/brand/`, `public/images/destinations/`, `public/images/experiences/`

## What the receiver should produce

- Foto reali importate in cartella corretta con triplet (AVIF/WebP/PNG)
- Componenti aggiornati con `<picture>` o `srcset` AVIF-first
- Alt text italiano applicato
- Hero preload aggiornato a nuovo asset
- typecheck PASS + audit:size PASS (no bundle regression) + Lighthouse hero LCP ≤ 2.5s

## Out of scope (do NOT touch)

- Layout, spacing, hierarchy delle sezioni
- Demo InstagramGrid (è F2.10 — futura)
- Reel video (F2.11 — futura)

## Open questions / decisions for the user

- L'owner deve indicare la cartella sorgente delle foto reali e dare l'OK su shopping list (output asset-curator).

## Next hand-off

- Next agent: `browser-auditor` smoke su Home + ChiSiamo + MediaKit (desktop + mobile 375px)
- Trigger: commit photo replacement + dev server up
