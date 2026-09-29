---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_data-analyst
status: consumed
created: 2026-09-29
from: travellini-orchestrator
to: travellini-data-analyst
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R0 (brainstorming webapp — prima della divergenza)
supersedes: docs/50_Scratch/HANDOFF_esplora-schermo-unico_orchestrator_to_data-analyst.md
---

# Handoff: fact pack del corpus per il brainstorming "Travelliniwithus webapp"

## Why this work matters

L'owner ha deciso che Travelliniwithus diventa una **webapp** con un'esperienza a
schermo unico al centro, e vuole un brainstorming che lo stupisca. Subito dopo di te
lavorano in parallelo sei agenti (cinque su opus). **Sei l'unico che legge il corpus
grezzo**: loro leggono il tuo fact pack. Così le idee poggiano su numeri veri e
nessuno rilegge 1,5 MB di JSON sei volte.

## Decisions already made

- Travelliniwithus diventa una webapp (decisione owner, 2026-09-29).
- Base di codice = ramo del PR #27, commit 4fe1794, checkout in **sola lettura**:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  Il repo `/home/user/TRAVELLINIWITHUS` è `main` fermo all'11 agosto: non è la base.
- Il fact pack è **interno**: nessuna cifra va sul sito senza una fonte datata
  (`BEST/docs/20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07.md`).
- La deny-list privacy della spec corpus vale anche per l'analisi (vedi sotto).

## Context the receiver needs

Fatti già verificati (ricalcolali solo per riconciliarli):

- `BEST/src/data/instagram-corpus.json` (~1,5 MB, non è nel bundle client): 1.283 post
  distinti, dal 25 lug 2021 al 13 ago 2026 (1.192 reel, 84 caroselli, 6 foto). Campi per
  post: `code`, `pk`, `takenAt` (epoch in secondi), `tipo`, `location{name,lat,lng}`,
  `plays`, `likes`, `comments`, `inRegistro`, `classe`, `caption`.
- `BEST/src/data/corpus-places.json` (108 KB): 624 luoghi (la chiave è il nome), campi
  `citta`, `regione`, `paese`, `amministrativo`, `reel`, `plays`. 463 Italia, 31 Spagna,
  17 UK, 15 Emirati, 11 Francia, 10 Egitto; 120 amministrativi.
- 1.017 reel citano un luogo; circa 186 milioni di plays sommati.
- Spec: `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`
  (status da-approvare). Riporta 640 luoghi per coordinata, 76 in registro, 564 nuovi,
  533 con almeno un reel, 545 con indirizzo preciso (399 in Italia).
- Registro provenienza immagini: `BEST/src/data/asset-provenance.json`; 84 cover reali
  in `BEST/public/images/reels/`; `BEST/src/config/reels.ts` ha 67 voci.
- Schede visibili: 79 su 110 nel registro (`BEST/src/data/content-seed.json`).

Privacy (spec §1, obbligatoria anche per te):
- Escludi il post indicato nella deny-list della spec, le strutture sanitarie, gli indirizzi residenziali e
  scuole, asili e nidi. Attenzione al falso amico «Ospedale delle Bambole» (Napoli), che
  è un luogo visitabile.
- **Riporta solo conteggi per categoria, mai nomi o coordinate dei luoghi sensibili.**

## What the receiver should produce

Un fact pack con numeri tracciabili: sotto ogni tabella, il comando o lo script (anche
inline, `node -e`) che la produce. Niente stime presentate come dati.

1. **Riconciliazione** 640 / 624 / 564 / 545 / 533: da dove viene ogni cifra, e quale
   usare per "posti che possono avere una scheda con un reel".
2. **Tempo**: post per anno e per mese (`takenAt`), separati per `tipo`.
3. **Ritorni**: luoghi con reel in date distinte (almeno 2 visite a più di 30 giorni di
   distanza). Quanti sono, e i primi 15 per numero di visite (esclusi deny-list e
   luoghi amministrativi).
4. **Attenzione**: distribuzione dei plays per luogo (mediana, p90, massimo); quota dei
   ~186M concentrata nei primi 20 luoghi; quota attribuita a etichette amministrative
   generiche (es. «Italia»); data di snapshot dei plays [VERIFY: data dell'enumerazione].
5. **Prezzi nelle caption**: quanti post e quanti luoghi hanno un prezzo esplicito (€,
   euro, 💰 seguito da una cifra); range per tipo (a notte, a persona, a piatto) se si
   può ricavare.
6. **Collaborazioni**: post con marcatori espliciti (ADV, adv, «in collaborazione», «su
   invito», «ospiti di», #adv). Quanti luoghi; mediana dei plays con e senza marcatore.
7. **Geografia**: copertura per regione italiana e per paese; elenco delle regioni a zero.
8. **Stagionalità**: per regione, i mesi dell'anno coperti da almeno un reel; per ogni
   mese dell'anno, quanti luoghi distinti (serve all'idea "l'app cambia copertina ogni
   mese da sola").
9. **Lessico**: i 60 termini o bigrammi più frequenti nelle caption, ripuliti da hashtag
   generici, emoji e dalla formula ricorrente «L1nk in bi@ per super sc@nti…».
10. **Immagini**: delle 79 schede visibili, quante hanno una cover `real-frame` o
    `real-photo` nel registro, quante sono `da-certificare` e quante non hanno regola.
    Delle 84 cover in `public/images/reels/`, quante corrispondono a un luogo del corpus.
11. **Git**: `instagram-corpus.json` e `corpus-places.json` sono tracciati nel commit
    4fe1794? (`git -C BEST ls-files`, `git -C BEST show 4fe1794 --stat`). Conta perché
    decide se un indice derivato si può costruire in CI.
12. **Deny-list**: quanti luoghi e quanti post esclude, per categoria (solo conteggi).
13. **Commenti**: distribuzione dei `comments` per reel (solo conteggi; il testo non c'è).
14. **Ricorrenza vicino a casa** (serve a una decisione privacy dell'owner): quanti
    luoghi distinti e quanti post cadono nell'area con più visite ripetute, a 10, 25 e
    50 km dal suo baricentro. **Solo conteggi, nessuna coordinata o nome nel fact pack.**
15. **Tracce e posti**: quanti reel geolocalizzati NON hanno una scheda nel registro
    (sarebbero "tracce" senza pagina propria), e come si distribuiscono per anno.

- Output: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff e
  `to:` ui-designer (direzione e architettura), growth, social, seo, asset-curator.
  Una sezione per domanda, tabelle brevi, comando sotto ogni tabella. In fondo: "7 fatti
  che nessun sito di viaggi generico ha" (solo fatti, niente idee).
- Where it lands: il file sopra. Nessuna modifica a `BEST/` né al codice.

## Out of scope (do NOT touch)

- Proporre idee di prodotto o di UI (lo fanno gli agenti del giro 1).
- Modificare file in `BEST/` o in `src/` del repo; aggiungere script al repo.
- Pubblicare nomi o coordinate di luoghi in deny-list, caption con dati personali o
  commenti.
- Numeri social pubblici (follower, reach): non stanno nel corpus, non stimarli.

## Open questions / decisions for the user

- Nessuna bloccante. Se la domanda 11 rivela che il corpus non è tracciato in git,
  scrivilo in testa al fact pack: è un rischio di fattibilità per diverse idee.

## Next hand-off

- Next agent: giro 1 in parallelo — travellini-ui-designer (due brief),
  travellini-growth-revenue-operator, travellini-social-content-operator,
  travellini-seo-conversion-strategist, travellini-asset-curator.
- Trigger: il fact pack è su disco con tutte le 15 sezioni.

## Notes

- Il corpus pesa 1,5 MB: leggilo con script, non a occhio.
- Se trovi incongruenze con i fatti "verificati" qui sopra, riportale con l'evidenza:
  vince il dato.
