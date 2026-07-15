---
title: HANDOFF_burton-juice_editorial_to_asset
status: open
created: 2026-07-15
from: travellini-editorial-writer
to: travellini-asset-curator
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: piano foto del pillar "The Burton Juice" — solo fotografia reale

## Why this work matters

Un pillar a tema visivo (aree scenografiche Alice/Beetlejuice/Edward) vive
sulle immagini. Ma il brand DNA vieta immagini AI: qui puo' esserci solo
fotografia reale del locale, dai frame del reel o dagli scatti di R+B. Il tuo
piano decide se il materiale esistente basta o se va richiesto altro all'owner.

## Decisions already made (locked)

- **SOLO fotografia reale**: frame del reel pinned o foto proprietarie di R+B.
  MAI immagini AI, MAI stock generico che non sia il locale reale. Non
  negoziabile (brand DNA).
- Hero + foto di sezione + OG card, tutte con **alt text italiano** descrittivo
  (non duplicare l'H1; se assente, fallback su luogo + categoria).
- La pagina usa la scheda recensione: prevedi almeno un'immagine forte per
  ancorare il blocco review (piatto / area a tema).
- Body e outline gia' scritti dall'editorial: mappa le immagini sulle sezioni,
  non inventare sezioni nuove.

## Context the receiver needs

- Content note (compila la sezione "## Assets"):
  [ARTICLE_burton-juice-ristorante-tim-burton.md](../13_Content/ARTICLE_burton-juice-ristorante-tim-burton.md)
- Body con riferimenti immagine gia' inseriti dall'editorial (stessa nota).
- Seed: campo `coverImage` oggi placeholder `/hero-adventure.jpg` da sostituire:
  `src/data/articles/burton-juice-ristorante-tim-burton.seed.ts`
- Aree a tema da coprire visivamente: Alice, Beetlejuice, Jack Skeleton, Edward
  mani di forbice; cocktail bar; attori in sala; bakery.
- Fonte frame: reel pinned @travelliniwithus (mag 2024) — verifica quali
  inquadrature reggono a risoluzione hero/OG.

## What the receiver should produce

Compila la sezione **## Assets** della content note:

- **Hero photo**: scelta + crop + peso target + alt italiano.
- **Section photos**: una per sezione chiave del body, con alt italiano.
- **OG card**: immagine + eventuale overlay testo coerente col brand.
- **Alt text**: lista completa, italiano, specifico.
- **Gap material request**: se i frame del reel non bastano per
  hero/OG/sezioni a risoluzione adeguata, scrivi la **richiesta materiali
  esplicita a Rodrigo & Betta** (quali scatti servono, quali aree, quale
  formato/risoluzione, orizzontale per hero/OG). Questo e' un output atteso,
  non opzionale se il materiale e' insufficiente.
- Nomi file/path proposti sotto `public/` per il frontend-builder.

## Out of scope (do NOT touch)

- Nessuna immagine AI, nessun upscale generativo, nessuno stock non-del-locale.
- Non toccare codice/seed (proponi solo path + alt; li applica il frontend).
- Non riscrivere copy/alt in inglese: alt italiano.
- Non modificare body/outline.

## Open questions / decisions for the user

1. **Sufficienza materiale**: i frame del reel bastano per hero + OG + 4-5
   sezioni a qualita' premium, o R+B devono fornire scatti aggiuntivi del
   locale? Se servono, la richiesta va all'owner (effort R+B da stimare).
2. Diritti immagine: confermare che i frame/foto sono di proprieta' R+B e
   pubblicabili (nessun materiale del locale sotto copyright terzi senza
   permesso).

## Next hand-off

- Next agent: `travellini-frontend-builder`
- Trigger: piano foto completo + alt italiano + (se necessario) richiesta
  materiali all'owner evasa o path reali disponibili. Brief pronto in
  `HANDOFF_burton-juice_asset_to_frontend.md`.

## Notes

Se il materiale reale e' insufficiente e l'owner non puo' fornirlo a breve, il
pillar puo' andare live con meno immagini ma NON con immagini AI: meglio una
pagina piu' sobria che una che tradisce il DNA. Segnalalo esplicitamente.
