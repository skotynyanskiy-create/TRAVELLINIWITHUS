---
title: HANDOFF_burton-juice_seo_to_editorial
status: consumed
created: 2026-07-15
from: travellini-seo-conversion-strategist
to: travellini-editorial-writer
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: body del pillar "The Burton Juice" — recensione vissuta 1500-3500 parole

## Why this work matters

Questo e' il cuore del pillar: una recensione che DEVE suonare vissuta, perche'
Rodrigo & Betta ci sono stati davvero. Il reel da 63K like ha promesso
un'esperienza; la pagina la mantiene con dettagli concreti, voto onesto,
pro/contro. Se il body suona da brochure, il pezzo fallisce.

## Decisions already made (locked)

- Body italiano, 1500-3500 parole, registro Rodrigo & Betta (caldo, diretto,
  specifico, prima persona plurale — "noi ci siamo stati").
- **Scheda recensione OBBLIGATORIA**: il pezzo alimenta il campo `review`
  (`ReviewBlock`/`RatingPill`). Devi produrre: voto complessivo, verdetto breve,
  una riga di summary, 2-5 criteri con score, pro e contro. Forma esatta sotto.
- H1 / meta / slug / cluster / schema: gia' fissati dalla seo-strategist nella
  sezione "## SEO" della content note. Non riscriverli.
  - **H1 locked:** "The Burton Juice: com'è una serata nel ristorante a tema Tim
    Burton vicino a Napoli". Il body deve mantenere questa promessa ("com'è" =
    racconto vissuto in prima persona, non descrizione da brochure).
- **Outline H2 locked** (ognuno cattura una query reale — scrivi in quest'ordine,
  non reinventarlo):
  1. Apertura vissuta — l'arrivo, la prima sala, cosa colpisce entrando (no
     preamboli generici; parti da un dettaglio concreto della serata di R+B).
  2. **Dove si trova e come arrivare** — Via Marigliano 168, Somma Vesuviana
     (NA); parcheggio, distanza da Napoli. (query: dove si trova / parcheggio)
  3. **Come si prenota** — prenotazione WhatsApp obbligatoria, anticipo, alta
     domanda. (query: prenotazioni online / contatti / "come prenoto")
  4. **Le sale a tema** — Alice, Beetlejuice, Jack Skeleton, Edward mani di
     forbice; attori in sala, teatro. (query: personaggi / "c'è qualcosa a tema…")
  5. **Il menu e i prezzi** — cocktail bar + cucina; cosa hanno ordinato R+B.
     Prezzi solo se confermati, altrimenti `[VERIFY]`. (query: menu / menù prezzi)
  6. **Per chi è (e per chi no)** — registro serale adulti/coppie/amici primario;
     nota famiglia (bakery + area Alice) come sotto-sezione, non come frame.
  7. **Il voto: la nostra recensione** — scheda review reale (sotto). (query:
     the burton juice recensioni)
  8. Chiusura + CTA soft (salva/condividi + segui @travelliniwithus). Niente CTA
     hard: la metrica è organica pura.
- Constraint fatti: indirizzo e format del locale sono verificati; prezzi/orari
  restano `[VERIFY]` — se li citi, marcali `[VERIFY]`, non inventarli.
- Solo fotografia reale (deciso a valle): scrivi didascalie/riferimenti immagine
  in modo che l'asset-curator possa mapparli su frame reali, non su render.

## Context the receiver needs

- Content note (scrivi nella sezione "## Body"):
  [ARTICLE_burton-juice-ristorante-tim-burton.md](../13_Content/ARTICLE_burton-juice-ristorante-tim-burton.md)
- Sezioni "## Brief" (audience/registro) e "## SEO" (H1/H2/cluster) gia'
  compilate nella stessa nota. Leggile prima di scrivere.
- Registro e prove: caption reali contengono gia' prezzi e "consiglio onesto"
  ([IG_CONTENT_ANALYSIS_2026-07-15.md](../13_Content/IG_CONTENT_ANALYSIS_2026-07-15.md),
  vedi "La scheda recensione e' il loro registro naturale").
- Fatti locale: aree a tema Alice / Beetlejuice / Jack Skeleton / Edward mani di
  forbice; cocktail bar + ristorante + teatro + bakery; attori in sala;
  prenotazione WhatsApp obbligatoria; theburtonjuice.com.
- Forma del campo review (da `src/types/content.ts`), popola SOLO con dati reali
  dell'owner:
  `review = { overall?: number(0-10), verdict?: string, summary?: string,
criteria?: [{ name, score(0-10) }] (2-5), pros?: string[], cons?: string[] }`.
  Criteri proposti (adatta ai dati owner): Scenografia, Cucina, Servizio/attori
  in sala, Rapporto qualita'-prezzo, Atmosfera.

## What the receiver should produce

- Body completo 1500-3500 parole nella sezione "## Body" della content note,
  seguendo l'outline H2 SEO, con drop-cap/pull-quote/figure previsti dai
  componenti editoriali esistenti.
- Blocco recensione proposto (voto + verdetto + summary + criteri + pro/contro)
  in forma compilabile nel campo `review`.
- Marcatura chiara di ogni fatto `[VERIFY]` (prezzi, orari) per il gate
  `/verify-facts`.
- Riferimenti immagine coerenti col reel/foto owner (per l'asset-curator).

## Out of scope (do NOT touch)

- Non toccare codice ne' il seed (solo testo nella content note).
- Non scegliere/croppare le foto (asset-curator).
- Non inventare voti: se l'owner non ha ancora fornito le sue impressioni reali,
  lascia il blocco review con placeholder `[OWNER: voto/criteri reali]` e
  segnalalo come blocco (vedi open questions) invece di inventare.
- Non riscrivere H1/meta.

## Open questions / decisions for the user (CRITICO)

1. **Impressioni reali della visita**: servono i dati vissuti di R+B per la
   recensione — piatti ordinati, cosa li ha colpiti, cosa no, che voto darebbero
   a scenografia/cucina/servizio/qualita-prezzo/atmosfera. Senza questi la
   scheda review NON e' pubblicabile onestamente. Questo e' il blocker
   principale del pillar.
2. Conferma il registro (adulti/coppie vs family) se il growth l'ha lasciato
   aperto — cambia il tono del body.

## Next hand-off

- Next agent: `travellini-asset-curator`
- Trigger: body 1500-3500 parole completo + blocco review compilato (o
  esplicitamente in attesa dei dati owner). Brief pronto in
  `HANDOFF_burton-juice_editorial_to_asset.md`.

## Notes

Il differenziatore del pezzo e' l'onesta': includi almeno un contro reale (i
locali a tema spesso hanno cucina secondaria alla scenografia — se e' cosi',
dillo). E' esattamente cio' che l'audience premia (918 commenti sul reel).
