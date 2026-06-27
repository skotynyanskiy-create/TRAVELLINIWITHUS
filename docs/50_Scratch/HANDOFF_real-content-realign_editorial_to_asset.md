---
title: HANDOFF_real-content-realign_editorial_to_asset
status: open
created: 2026-06-22
from: travellini-editorial-writer
to: travellini-asset-curator
slug: real-content-realign
expires: 2026-07-13
---

# Handoff: strategia cover/asset per le schede ContentItem reali

## Why this work matters

Le schede reali esistono ma le thumbnail IG CDN sono oscurate (`[BLOCKED]` nel
seed doc): senza cover la griglia social-first non funziona. Serve la strategia
per ottenere e ottimizzare le cover di ogni `ContentItem`, più gli alt text.

## Decisions already made (LOCK)

- Cover obbligatoria per la griglia social-first (è cover-led).
- Fonti cover possibili, in ordine: (1) `media_url`/`thumbnail_url` da Instagram
  Graph API quando l'integrazione è viva; (2) frame estratti via ffmpeg dai 5
  MP4 reali già in `public/video/` (pattern già usato, vedi reels.ts cover);
  (3) foto reali fornite da R+B. NIENTE stock/AI placeholder spacciati per reali.
- I 5 reel reali hanno già cover frame in `public/images/reels/reel-N-cover.webp`.

## Context the receiver needs

- Seed schede: doc prodotto da editorial-writer (a monte).
- Nota cover: riga "Nota tecnica" e "Strategia cover/asset" in
  [docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md].
- Asset esistenti reel: [src/config/reels.ts], `public/images/reels/`.

## What the receiver should produce

1. **Piano cover per i ~70 item**: per ognuno, da dove arriva la cover (API /
   ffmpeg-frame / da fornire da R+B), e la priorità (prima i 5 reel + gli item
   con prezzo/partner completi).
2. **Specifiche di ottimizzazione**: dimensioni card (es. 800×1000), formato
   (AVIF+WebP), peso target (≤80KB), per non degradare CWV con una griglia fitta.
3. **Alt text** per le cover già disponibili (5 reel + qualsiasi frame estraibile
   ora), in italiano, descrittivo.
4. **Vincolo CWV griglia fitta**: lazy-load, dimensioni esplicite, numero card
   above-the-fold da preload — note per frontend-builder e perf-engineer.

Dove atterra: piano cover/alt in doc + handoff verso frontend-builder.
NOTA: per le cover via API serve l'integrazione IG (backend-engineer, parallelo)
— se non è pronta, il primo seed parte con frame ffmpeg + foto R+B.

## Out of scope (do NOT touch)

- Integrazione IG API (backend-engineer).
- Codice React (frontend-builder).
- Copy schede (editorial, già fatto).

## Open questions / decisions for the user

- R+B può fornire un export dei frame/cover originali dei post nel primo seed, o
  ci si limita ai 5 reel + ffmpeg finché l'API non è viva?

## Next hand-off

- Next agent: travellini-frontend-builder
- Trigger: piano cover + specifiche ottimizzazione pronti.
