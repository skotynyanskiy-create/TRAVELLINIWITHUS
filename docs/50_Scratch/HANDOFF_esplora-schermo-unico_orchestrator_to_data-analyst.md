---
title: HANDOFF_esplora-schermo-unico_orchestrator_to_data-analyst
status: open
created: 2026-09-29
from: travellini-orchestrator
to: travellini-data-analyst
slug: esplora-schermo-unico
expires: 2026-10-13
type: handoff
area: delivery
round: R0 (brainstorming, prima della divergenza)
---

# Handoff: fact pack del corpus per il brainstorming "Esplora a schermo unico"

## Why this work matters

L'owner ha chiesto un brainstorming "che stupisca" su una modalità a schermo unico
per esplorare i posti e i reel di Rodrigo & Betta. Cinque agenti opus lavoreranno in
parallelo subito dopo di te. **Tu sei l'unico che legge il corpus grezzo**: loro
leggeranno il tuo fact pack. Se il fact pack è preciso, le idee poggiano su numeri
veri; se manca, ognuno dei cinque inventerebbe o rileggerebbe 1,4 MB di JSON (spreco).

## Decisions already made

- Base di codice = ramo del PR #27, commit 4fe1794, checkout in **sola lettura**:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  Il repo `/home/user/TRAVELLINIWITHUS` è `main` fermo all'11 agosto: non è la base.
- Nessun numero pubblicato: il fact pack è interno. Nessuna cifra verrà messa sul sito
  senza fonte datata (DECISION_PUBLIC_METRICS_SOURCE 2026-06-07).
- La deny-list della spec corpus (§1 "Deny-list") vale anche per l'analisi: vedi sotto.

## Context the receiver needs

Fatti già verificati (non ricalcolarli se non per riconciliarli):

- `BEST/src/data/instagram-corpus.json`: 1.283 post distinti, 25 lug 2021 → 13 ago 2026.
  Campi per post: `code`, `pk`, `takenAt` (epoch s), `tipo` (reel/carosello/foto),
  `location{name,lat,lng}`, `plays`, `likes`, `comments`, `inRegistro`, `classe`, `caption`.
- `BEST/src/data/corpus-places.json`: 624 luoghi (chiave = nome); campi `citta`, `regione`,
  `paese`, `amministrativo`, `reel`, `plays`. 463 Italia, 31 Spagna, 17 UK, 15 Emirati,
  11 Francia, 10 Egitto; 120 amministrativi.
- 1.017 reel citano un luogo; ~186 milioni di plays sommati.
- Spec: `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`
  (status da-approvare). Riporta 640 luoghi per coordinata, 76 in registro, 564 nuovi,
  533 con almeno un reel, 545 con indirizzo preciso (399 Italia).
- Registro provenienza immagini: `BEST/src/data/asset-provenance.json`.
- Schede visibili: 79 su 110 nel registro (`BEST/src/data/content-seed.json`).

Privacy (spec §1, obbligatorio anche per te):
- Escludi dall'analisi pubblicabile il post `Db72ZqegfYf`, strutture sanitarie, indirizzi
  residenziali, scuole/asili/nidi. Attenzione al falso amico «Ospedale delle Bambole»
  (Napoli), che è un luogo visitabile.
- **Riporta solo conteggi per categoria esclusa, mai i nomi dei luoghi sensibili.**

## What the receiver should produce

Un fact pack con numeri tracciabili: per ogni cifra, il comando o lo script
(anche inline `node -e`) che la produce. Niente stime spacciate per dati.

Domande (rispondi a tutte; se una non è risolvibile dai dati scrivi perché):

1. **Riconciliazione**: 640 / 624 / 564 / 545 / 533. Da dove viene ciascuna cifra e
   quale usare per "posti che possono avere una scheda con reel".
2. **Tempo**: post per anno e per mese (`takenAt`), separati per `tipo`.
3. **Ritorni**: luoghi con reel in date distinte (≥ 2 visite separate da > 30 giorni).
   Quanti sono, e i primi 15 per numero di visite (esclusi deny-list e amministrativi).
4. **Attenzione**: distribuzione dei plays per luogo (mediana, p90, max); quota delle
   ~186M concentrata nei primi 20 luoghi; quota attribuita a etichette amministrative
   generiche (es. «Italia»). Data di snapshot dei plays [VERIFY: data di enumerazione].
5. **Prezzi nelle caption**: quanti post e quanti luoghi hanno un prezzo esplicito
   (€, euro, 💰 seguito da cifra); range per tipo (notte, persona, piatto) se ricavabile.
6. **Collaborazioni**: post con marcatori espliciti (ADV, adv, «in collaborazione»,
   «su invito», «ospiti di», #adv) → quanti luoghi; confronto mediana plays con/senza.
7. **Geografia**: copertura per regione italiana e per paese; elenco regioni a zero.
8. **Stagionalità**: per regione, mesi dell'anno coperti da almeno un reel.
9. **Lessico**: i 60 termini/bigrammi più frequenti nelle caption, ripuliti di hashtag
   generici, emoji e della formula ricorrente «L1nk in bi@ per super sc@nti…».
10. **Immagini**: delle 79 schede visibili, quante hanno una cover con provenienza
    `real-frame`/`real-photo` nel registro e quante `da-certificare` o senza regola.
11. **Git**: `instagram-corpus.json` e `corpus-places.json` sono tracciati nel commit
    4fe1794? (`git -C BEST ls-files`, `git -C BEST show 4fe1794 --stat`). La spec dice che
    il corpus "non è committato": conta perché decide se un indice derivato può essere
    costruito in CI.
12. **Deny-list**: quanti luoghi e quanti post esclude, per categoria (solo conteggi).
13. **Commenti**: distribuzione dei `comments` per reel (solo conteggi, il testo non c'è).

- Output: `docs/50_Scratch/HANDOFF_esplora-schermo-unico_data-analyst_to_divergenza.md`
  nel repo `/home/user/TRAVELLINIWITHUS` (frontmatter del template handoff, `to:`
  ui-designer, growth, social, seo, asset-curator). Una sezione per domanda, tabelle
  brevi, comando sorgente sotto ogni tabella, e in coda "5 fatti che nessun sito di
  viaggi generico ha" (solo fatti, niente idee).
- Where it lands: il file sopra. Nessuna modifica a `BEST/` o al codice.

## Out of scope (do NOT touch)

- Proporre idee di prodotto o UI (lo fanno gli agenti del giro 1).
- Modificare file in `BEST/` o in `src/` del repo. Scrivere script dentro il repo.
- Pubblicare nomi di luoghi della deny-list, caption con dati personali, commenti.
- Numeri social pubblici (follower, reach): non sono nel corpus, non stimarli.

## Open questions / decisions for the user

- Nessuna bloccante. Se la domanda 11 rivela che il corpus non è tracciato in git,
  segnalalo in testa al fact pack: è un rischio di fattibilità per più idee.

## Next hand-off

- Next agent: travellini-ui-designer, travellini-growth-revenue-operator,
  travellini-social-content-operator, travellini-seo-conversion-strategist,
  travellini-asset-curator (in parallelo, giro 1).
- Trigger: il fact pack esiste su disco con tutte le 13 sezioni.

## Notes

- Il corpus è 1,40 MB: leggilo con script, non a occhio.
- Se trovi incongruenze con i fatti "verificati" sopra, riportale con evidenza: vince il dato.
