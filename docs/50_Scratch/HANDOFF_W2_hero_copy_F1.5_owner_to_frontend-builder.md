---
title: HANDOFF_W2_hero_copy_F1.5_owner_to_frontend-builder
status: obsolete
created: 2026-05-15
from: owner (after pick)
to: travellini-frontend-builder
slug: hero-copy-f1.5-apply
expires: 2026-05-29
type: handoff
area: workspace
---

# Handoff: Applicare hero copy F1.5 scelta dall'owner

## Why this work matters

L'hero attuale è ancora "placeholder editoriale" (`Posti particolari che valgono davvero`). Il blocco F1.5 ha consegnato 4 varianti H1 + sub + CTA + meta in [docs/50_Scratch/F1.5_hero_copy_variants_for_owner.md](./F1.5_hero_copy_variants_for_owner.md). Una volta che l'owner pick una variante, va applicata in `src/components/home/HeroSection.tsx` + meta in [index.html](../../index.html) + SEO component.

## Decisions already made (LOCKED — non rilitigare)

- Italian-first. Voce R+B (calda/diretta/specifica), zero verbi banditi ("scopri", "esplora").
- Hero H1: Fraunces 500, max-width 18ch, allineato sx (decisione F2.1 LOCKED).
- 2 CTA: primaria terracotta + secondaria ghost ink (decisione F2.1 LOCKED).
- Meta description ≤ 160 char, include "coppia italiana" + "posti particolari" + 1 keyword geo.
- NESSUNA modifica al layout hero o tipografia — solo testo + meta.

## Context the receiver needs

- Variante scelta: [VERIFY: pick owner — da inserire qui appena disponibile]
- File da editare:
  - `src/components/home/HeroSection.tsx` — H1, eyebrow, paragraph, CTA labels
  - [index.html](../../index.html) — `<title>`, `<meta name="description">`, OG/Twitter
  - `src/pages/Home.tsx` o componente SEO se title/description sono gestiti React-side
- Sorgente varianti: [docs/50_Scratch/F1.5_hero_copy_variants_for_owner.md](./F1.5_hero_copy_variants_for_owner.md)

## What the receiver should produce

- Commit singolo `feat(hero): apply F1.5 copy variant <N>` con:
  - H1 nuovo applicato
  - Sub-headline applicata
  - CTA primaria + secondaria con label e href corretti
  - Meta title + description aggiornati
- Output: typecheck PASS, audit:ui PASS, screenshot mobile + desktop in commit body o seguente turno

## Out of scope (do NOT touch)

- Layout, spacing, immagine hero, font, palette
- Altre sezioni Home (F2.1 implementation è handoff separato)
- File backend (`server.ts`, `firestore.rules`, `admin.ts`)

## Open questions / decisions for the user

- Owner deve confermare la variante numerica (1/2/3/4) PRIMA che frontend-builder parta. Senza pick → BLOCKED.

## Next hand-off

- Next agent: `browser-auditor` per smoke test live (Hero LCP + leggibilità mobile)
- Trigger: commit hero copy pushato in branch, dev server up
