---
title: HANDOFF_diario-narrativo_ui-designer_to_asset-curator
status: consumed
created: 2026-07-19
from: travellini-ui-designer
to: travellini-asset-curator
slug: diario-narrativo
expires: 2026-08-02
type: handoff
area: delivery
---

# Handoff: direzione fotografica "imperfetta/backstage" + mappa disegnata a mano per la variante Diario

## Why this work matters

Il Diario narrativo vive di verità fotografica: "la perfezione attira, l'imperfezione autentica crea affezione". È l'anti-DMO patinata ed è la ragione della regola "real photography only". Servono scatti che sembrino vissuti, non da campagna, più una mappa disegnata a mano come firma editoriale calda accanto (non al posto) di quella funzionale.

## Decisions already made

- Registro "imperfetto/backstage": selezionare dall'archivio REALE scatti tipo — risate, stanchezza vera, valigie/preparativi, pioggia, pasti improvvisati, errori di percorso, backstage, incontri con persone del posto, dettagli (biglietti, chiavi, mani). NON foto-copertina patinate.
- Zero AI-imagery. Nessuna generazione, nessun "finto backstage": solo archivio reale di Rodrigo & Betta. Se manca lo scatto giusto per un beat, segnalalo come gap [VERIFY archivio] invece di riempirlo.
- I 2-3 flagship di partenza: Egitto/Mar Rosso, Volterra/Volturi, Batu Caves (Malesia).

> **CORREZIONE 2026-07-19 (post-verifica Firestore, main thread):** nessuno dei 3 è un articolo pubblicato — sono solo voci del catalogo reel (`isPlaceholder:true`), senza corpo lungo. L'unico con un corpo scritto reale è Burton Juice, ma è bloccato su una sezione recensione owner-only (voto/foto reali R&B), non ancora pubblicato. Conseguenza: tratta questa curation come direzione fotografica **evergreen** (principi + shortlist dall'archivio reale) piuttosto che come lavoro legato a una pubblicazione imminente — nessun articolo è pronto a riceverla oggi. Se vuoi partire da un candidato concreto per la shortlist, usa Burton Juice (è il più vicino a pubblicazione), ma non promettere consegna legata a un preview live.

- Almeno un frame per pezzo deve avere la coppia dentro (brand people-led).
- Attenzione watermark: alcune cover reel hanno testo/watermark TikTok baked-in (noto dal progetto home) — per il Diario servono frame PULITI. Se un frame utile è watermarkato, segnalalo.
- Mappa disegnata a mano: asset DECORATIVO editoriale interno al Diario, in stile illustrato/manuale, caldo, coerente con sand/terracotta. NON sostituisce né imita la MapLibre/Mapbox funzionale già in pagina ("Mappa del viaggio"): è un'illustrazione della rotta reale del racconto.

## Context the receiver needs

- Source files: [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) (dove atterrano le foto del Diario e dove resta la mappa funzionale, righe ~991-1023 — la mappa disegnata è un asset separato, non un rimpiazzo). La rotta reale da illustrare si ricava dai `mapMarkers`/itinerario dell'articolo.
- Related docs: [DESIGN.md](../../DESIGN.md) (peso immagini, alt text, token colore), [docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md](../BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md).
- Brand / voice notes specific to this piece: sand #faf8f4 + terracotta #c2410c + Fraunces. Le foto imperfette sono la texture emotiva; la mappa disegnata è la firma artigianale. Crop editoriali (persone, gesto, luogo), non stock.

## What the receiver should produce

- Output 1: per ciascuno dei 2-3 flagship, una shortlist di 3-4 scatti reali "imperfetti" (uno per beat narrativo), con alt text italiano specifico, formato/peso ottimizzati (AVIF/WebP, sizes corretti), e nota su eventuali gap d'archivio.
- Output 2: brief/stile per UNA mappa disegnata a mano per il primo flagship (o l'indicazione dell'illustratore/asset), che riproduce la rotta reale del racconto, in palette brand, come asset decorativo.
- Where it lands: asset ottimizzati in `public/images/...` (cartella per articolo) + nota di consegna nella docs pertinente; alt text pronti per il frontend-builder che li innesta nel template Diario.

## Out of scope (do NOT touch)

- Home cinematografica, `/mappa` MapLibre/Mapbox funzionale, globo 3D, shop, pagina Collaborazioni: restano come sono.
- Nessuna imagery generata da AI, mai.
- File high-risk (`server.ts`, `firestore.rules`, `src/config/admin.ts`): mai.

## Open questions / decisions for the user

- Per la mappa disegnata a mano: illustrazione commissionata esterna o stile "hand-drawn" prodotto internamente? (Impatta tempi/costo — decisione owner.)
- Quanti flagship al primo giro: 2 o 3? (Proposta: partire da 1 completo — Volterra — per validare il registro, poi estendere.)

## Next hand-off

- Next agent: travellini-frontend-builder (innesta gli asset nel template Diario) -> poi quality-auditor + browser-auditor.
- Trigger: shortlist foto + alt text pronti e almeno la mappa del primo flagship definita.

## Notes

- Handoff gemello: `docs/50_Scratch/HANDOFF_diario-narrativo_ui-designer_to_frontend-builder.md` (struttura del template). Coordinati sui nomi file degli asset così il frontend non rilinka a mano.
- Peso/CWV: il Diario è foto-pesante — priorità al primo scatto (LCP), lazy per il resto; niente regressioni Lighthouse (a11y >= 0.95, CLS <= 0.1 sono bloccanti in CI).
