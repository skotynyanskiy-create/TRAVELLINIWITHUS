---
title: HANDOFF_esplora-restructure_ui-designer_to_asset-curator
status: obsolete
created: 2026-05-24
from: travellini-ui-designer
to: travellini-asset-curator
slug: esplora-restructure
expires: 2026-06-07
type: handoff
area: workspace
---

# Handoff: piano foto per big-choice e collezioni di Esplora

## Why this work matters

Esplora e' photographer-first: le big-choice zone e le collezioni editoriali vivono o muoiono sulle immagini. Servono foto coerenti col mood premium (sand/ink, calm, coppia, posti veri) al peso giusto per non rompere LCP, dato che e' una route pubblica.

## Decisions already made

- IA e blocchi (quante big-choice, quante collezioni, dove la cover-story) lockati da ui-designer.
- Hero cover /esplora oggi e' `hero-amalfi.webp` placeholder.
- Molte `/images/destinations/*` sono AI placeholder da sostituire (residuo R+B noto).
- LCP target route pubblica <= 2.0s mobile 4G; il peso immagini conta.

## Context the receiver needs

- Direzione ui-designer: leggi la sua risposta (numero e posizione delle immagini, formati, aspect ratio).
- Asset esistenti: [public/images/destinations/], [public/images/hero-amalfi.webp], [public/images/reels/].
- Componenti che consumano immagini: ArchiveCard, HomeDiscoveryFinder, hero Esplora.

## What the receiver should produce

Inline:

1. **Piano foto**: per ogni big-choice zone e ogni collezione, quale asset usare (esistente reale > esistente placeholder marcato > [TODO R+B foto reale]). Niente Unsplash hotlink.
2. **Alt text italiano** editoriale per ciascuna immagine.
3. **Specifiche peso/formato**: AVIF + WebP fallback, dimensioni target, quale immagine e' LCP e va `fetchpriority=high` / `loading=eager`.
4. **Lista [TODO R+B]** delle foto reali mancanti, cosi' l'owner sa cosa fornire.

## Out of scope (do NOT touch)

- IA/layout (ui-designer).
- Copy/alt strategy SEO oltre l'alt text descrittivo (coordinare con seo se ambiguo).
- Generare/modificare immagini AI nuove come asset finali.
- Codice (frontend-builder).

## Next hand-off

- Next agent: travellini-frontend-builder (consuma piano foto + copy seo insieme)
- Trigger: piano foto consegnato.
