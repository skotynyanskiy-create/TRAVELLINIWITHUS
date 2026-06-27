---
title: HANDOFF_real-content-realign_seo_to_editorial
status: open
created: 2026-06-22
from: travellini-seo-conversion-strategist
to: travellini-editorial-writer
slug: real-content-realign
expires: 2026-07-13
---

# Handoff: scrivere le 70 schede ContentItem reali (seed) dal dataset IG

## Why this work matters

Il seed iniziale del sito riallineato sono i 70 reel già documentati. Servono le
schede `ContentItem` scritte nella voce R+B (hook-domanda + valore + criterio),
pronte a essere serializzate nel seed dati. Questo è il riempimento di massa che
segue il template voce definito da seo.

## Decisions already made (LOCK)

- Voce: hook-domanda, prezzo esplicito quando noto, criterio "vale la pena? per
  chi?". Seguire il template scheda fornito da seo (NON inventare un nuovo stile).
- Disclosure ADV con le label decise da growth — riportare il `partnership.kind`
  corretto da ogni riga del dataset, non inventare.
- NON scrivere essay lunghi: ogni ContentItem è una scheda breve. Gli hub
  regione/città sono aggregazioni, non articoli pillar.

## Context the receiver needs

- Fonte dati: la tabella "70 caption INTEGRALI" in
  [docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md] (hook/luogo/prezzo/
  partner/ADV già estratti). Più i 5 reel reali in [src/config/reels.ts]
  (Egitto, Sushi Kibo, Tavernal, Batu Caves, Volterra) da migrare a ContentItem.
- Template scheda + 5 campioni: handoff seo a monte.
- Tassonomia per `zone`/`types`: [src/config/contentTaxonomy.ts].

## What the receiver should produce

- Per ciascuno dei ~70 item: `hook`, `title`, `description` (1 frase cos'è +
  dato valore + criterio), `place` (name/city/region/country), `zone`, `types`
  (1-3), `partnership.kind` + `partner`, `value.price`/`budget` quando noto.
- Marcare `[VERIFY: ...]` ogni dato mancante (prezzo, partner oscurato da
  "sc@nti"/"bi@", coordinate). NON inventare prezzi o partner.
- Consegnare in forma strutturata (tabella o JSON-like) pronta per la
  serializzazione del seed da parte di frontend-builder.

Dove atterra: un doc seed in `docs/50_Scratch/` + handoff verso asset-curator
(cover/alt) e frontend-builder (serializzazione modello).

## Out of scope (do NOT touch)

- Codice/serializzazione TS finale (frontend-builder).
- Selezione foto/cover (asset-curator).
- Meta/schema pagine (seo, già fatto).

## Open questions / decisions for the user

- Per gli item con prezzo/partner mancante: pubblicare con `[VERIFY]` nascosto o
  tenerli fuori dal primo seed? (proporre: primo seed = solo item completi)

## Next hand-off

- Next agent: travellini-asset-curator
- Trigger: schede testuali pronte.
