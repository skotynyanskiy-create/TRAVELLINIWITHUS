---
title: HANDOFF_W2_pillar_F1.7_editorial-writer_to_frontend-builder
status: open
created: 2026-05-15
from: travellini-editorial-writer
to: travellini-frontend-builder
slug: pillar-f1.7-publish
expires: 2026-05-29
---

# Handoff: Pubblicare 3 pillar reali su Firestore (F1.7)

## Why this work matters

Il sito ha 0 articoli reali pubblicati (`published: true`); 30 demo sono noindex. Bloccante P0 per SEO + trust. L'owner ha confermato 1-3 pillar scritti in W1. F1.7 li porta da Markdown/Word → documento Firestore `articles` → render pubblico con JSON-LD Article (F1.8 consumato in parallelo) + sitemap aggiornata.

## Decisions already made (LOCKED — non rilitigare)

- Schema collezione `articles` già esistente. Campi: `slug`, `title`, `subtitle`, `heroImage`, `body` (rich-text/markdown), `published: true`, `publishedAt`, `author: 'Rodrigo & Betta'`, `category`, `zone`, `type`, `seoTitle`, `seoDescription`, `relatedArticleIds`.
- JSON-LD Article: handoff F1.8 in implementazione parallela — frontend-builder DEVE consumarlo (template articolo rende automatica `<script type="application/ld+json">`).
- Slug pattern: `<destinazione>-<intent>` (es. `salento-cosa-vedere`, `lisbona-weekend-coppia`).
- Foto reali R+B obbligatorie (no stock) — coordinato con F1.6.
- Sitemap rigenerata via `npm run build` (script `scripts/generate-sitemap.js` — già attivo, ma per ora statico; F3.2 lo renderà dinamico).

## Context the receiver needs

- Pillar 1: Salento — outline in [docs/13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md](../../docs/13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md)
- Pillar 2-3: testi owner-written [VERIFY: location + titoli]
- File chiave:
  - [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) — template render
  - [src/utils/discoveryQuery.ts](../../src/utils/discoveryQuery.ts) — query articles published
  - [scripts/generate-sitemap.js](../../scripts/generate-sitemap.js) — sitemap (statico per W2)
- Firestore: collezione `articles` (rules già OK post Fase A, bloccante F1.1 in attesa conferma owner per rivalidare)

## What the receiver should produce

- 3 documenti Firestore in `articles/` con `published: true` (via admin panel o script di import)
- 3 URL pubblici live: `/articolo/<slug>` con render PASS, JSON-LD valido (Rich Results Test PASS)
- Sitemap statica aggiornata con 3 nuove voci
- typecheck + audit:ui PASS

## Out of scope (do NOT touch)

- Backend rules (`firestore.rules`) — è responsabilità `travellini-backend-engineer` se F1.1 non chiuso
- Sitemap dinamica live da Firestore — è F3.2
- Editing prosa: l'editorial-writer/owner ha consegnato il body; frontend-builder NON riscrive copy

## Open questions / decisions for the user

- L'owner deve consegnare i 2 pillar non-Salento (titolo + body + foto coordinata con F1.6) entro mercoledì 20/05 per stare nella W2.
- F1.1 (firestore rules) deve essere già chiuso o l'owner deve dare conferma esplicita per riaprire scrittura admin.

## Next hand-off

- Next agent: `travellini-seo-conversion-strategist` per validazione JSON-LD via Rich Results Test
- Trigger: 3 articoli live su `/articolo/<slug>` con HTTP 200
