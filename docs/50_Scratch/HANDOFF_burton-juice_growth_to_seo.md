---
title: HANDOFF_burton-juice_growth_to_seo
status: open
created: 2026-07-15
from: travellini-growth-revenue-operator
to: travellini-seo-conversion-strategist
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: SEO del pillar "The Burton Juice" — H1, meta, keyword cluster, schema

## Why this work matters

Il pillar deve intercettare una domanda organica che oggi vive solo su
Instagram: chi cerca "ristorante tema Tim Burton in Italia" non trova una
pagina autorevole. Tu definisci l'ossatura di ranking (H1, meta, slug, cluster,
schema) prima che l'editorial scriva, cosi' il body nasce gia' allineato alle
query reali.

## Decisions already made (locked)

- Slug FISSO: `burton-juice-ristorante-tim-burton`. Non riscriverlo.
- Categoria esperienze, destinazione Somma Vesuviana (Napoli), Campania.
- Il pillar e' una **recensione vissuta** con scheda `review` (voto + criteri +
  pro/contro): tienine conto per lo schema (angolo Review, non solo Article).
- Audience e metrica primaria: leggile dalla sezione "## Brief" della content
  note gia' compilata dal growth-operator. Non ridefinirle.
- **Registro LOCKATO: serata adulti/coppie/gruppi di amici (primario)**, con
  nota famiglia SECONDARIA (bakery + area Alice) come sezione dedicata, non come
  frame. H1/meta devono parlare a fandom Burton 25-40, non a "gita in famiglia".
- **Relazione col locale LOCKATA: organico puro** (nessun #ADV, nessuna
  relazione commerciale nota) → niente linguaggio/disclosure sponsor in meta.
- **Metrica primaria LOCKATA: SEO organico puro** (sessioni organiche alla
  pagina). Nessuna conversione forzata: CTA editoriale/soft, non un click da
  ottimizzare. Non introdurre in meta/schema angoli da lead-gen.

## Context the receiver needs

- Content note (compila la sezione "## SEO"):
  [ARTICLE_burton-juice-ristorante-tim-burton.md](../13_Content/ARTICLE_burton-juice-ristorante-tim-burton.md)
- Brief growth gia' compilato nella stessa nota (audience + metrica lockate).
- Analisi query reali:
  [IG_CONTENT_ANALYSIS_2026-07-15.md](../13_Content/IG_CONTENT_ANALYSIS_2026-07-15.md)
  (long-tail dimostrate: "ristorante tema X in Italia", "posti particolari
  Campania", nomi di scena delle aree).
- Fatti verificati: Via Marigliano 168, Somma Vesuviana (NA); primo ristorante
  d'Europa dedicato a Tim Burton; aree Alice / Beetlejuice / Jack Skeleton /
  Edward; theburtonjuice.com. `[VERIFY: prezzi/orari]`
- Seed da aggiornare a valle (campo `excerpt`, oggi placeholder):
  `src/data/articles/burton-juice-ristorante-tim-burton.seed.ts`

## What the receiver should produce

Compila la sezione **## SEO** della content note:

- **H1**: una sola, forte, italiana, specifica (non "scopri il magico mondo").
- **Meta title** (<= 60 char) e **Meta description** (<= 160 char, italiano,
  specifica: nomina Tim Burton + Napoli/Campania + esperienza).
- **Excerpt** per il seed (<= 160 char) — questa e' la stringa che sostituisce
  il placeholder in `.seed.ts`.
- **Keyword cluster**: primaria + secondarie + long-tail (marca personaggio,
  luogo, tipo esperienza). Segnala quali entrano come H2 nel body.
- **Schema.org**: proposta = `Review` con `itemReviewed: Restaurant` +
  `BlogPosting`/`Article` (angolo GEO/AI-search forte: e' una recensione con
  voto). Nomina i campi che dovranno essere popolati a valle dalla scheda
  review reale.
- **Struttura H2/H3** suggerita per l'editorial (le sezioni che catturano le
  long-tail).

## Out of scope (do NOT touch)

- Non scrivere il body (editorial-writer).
- Non assegnare voti/criteri della recensione (owner + editorial).
- Non toccare codice (solo indicare l'`excerpt` per il seed; lo applica il
  frontend-builder).
- Niente prezzi/orari come fatti definitivi finche' `[VERIFY]` non e' risolto.

## Open questions / decisions for the user

- Nessuna aperta dal lato growth: registro, relazione col locale e metrica sono
  lockati (vedi sopra). Produci UNA sola variante H1/meta, sul registro adulti.
- Resta solo la conferma owner sull'assunzione "organico puro" e l'eventuale
  interesse a una collaborazione futura con The Burton Juice: non blocca il tuo
  step (nessuna disclosure prevista), ma segnalalo al gate pre-publish.

## Next hand-off

- Next agent: `travellini-editorial-writer`
- Trigger: sezione "## SEO" compilata (H1 + meta + cluster + schema + outline
  H2). Brief pronto in `HANDOFF_burton-juice_seo_to_editorial.md`.

## Notes

Lo schema `Review` e' il vero differenziatore GEO/AI-search: passa
all'editorial l'indicazione esplicita che il voto complessivo e i criteri
devono essere reali (dati owner), altrimenti lo schema non e' pubblicabile.
