---
title: Egress dei video — misure e destinazione
date: 2026-07-26
type: decision
status: proposto
area: delivery
---

# Egress dei video (2026-07-26)

## Il numero

`dist/` pesa 356 MB, di cui **276,5 MB sono 29 file `.mp4`** in `public/video/`.
Firebase Hosting regala **360 MB di transfer al giorno**. Il file più grande,
`capovaticano-tonicello-resort.mp4`, pesa 29,7 MB: **una singola visualizzazione
consuma l'8% della quota giornaliera.** Circa dodici reel visti la esauriscono;
oltre si paga 0,15 $/GB.

| Visualizzazioni reel/mese | Transfer | Costo Firebase Hosting |
| ------------------------- | -------- | ---------------------- |
| 1.000                     | ~15 GB   | ~0,60 $                |
| 10.000                    | ~150 GB  | **~21 $**              |
| 50.000                    | ~750 GB  | **~111 $**             |

È l'unica voce di costo del progetto che cresce proporzionalmente al successo.

## Comprimere non serve — misurato, non supposto

Durata letta dal box `mvhd` di ogni MP4, bitrate calcolato:

- 28 file leggibili · 247 MB · **12,9 minuti** · bitrate medio **2,7 Mbps**
- I peggiori arrivano a 5-6 Mbps (`lazise-movieland-caneva`, `garfagnana-luccarfting-kayak`)

Per verticale 1080×1920, 2,7 Mbps è già una codifica corretta. Ricomprimere tutto
a 2,5 Mbps produrrebbe **il 2% di risparmio** con perdita di qualità visibile.
**La compressione non è la leva.** Un passaggio ad AV1/H.265 darebbe ~50% a parità
percettiva, ma è ottimizzazione di velocità, non la soluzione al costo.

## La leva è l'egress, non il peso

Con un object storage a egress zero il costo sparisce invece di ridursi:

| Destinazione            | Storage                           | Egress                    | Costo per noi        |
| ----------------------- | --------------------------------- | ------------------------- | -------------------- |
| Firebase Hosting (oggi) | incluso                           | 0,15 $/GB oltre 360 MB/gg | cresce col traffico  |
| **Cloudflare R2**       | 0,015 $/GB-mese, **10 GB gratis** | **zero, a ogni volume**   | **0 $**              |
| Bunny Stream            | 1 $/1000 min                      | a consumo                 | ~0,02 $/mese + banda |

276 MB stanno interamente dentro la franchigia gratuita di R2, e l'egress è
gratuito a qualsiasi volume. **Costo previsto: zero, anche se un reel diventa
virale.** Bunny Stream aggiungerebbe il bitrate adattivo (vantaggio reale su
mobile) ma introduce un secondo fornitore per un problema che R2 chiude a costo nullo.

## Cosa è già stato fatto (codice)

`src/utils/mediaUrl.ts` rende la destinazione una variabile d'ambiente invece di
un percorso scritto a mano in 29 righe di JSON. Applicato ai due unici punti di
ingresso: `src/config/contentLibrary.ts` (29 `videoSrc` dal seed) e
`src/config/reels.ts` (manifest reel).

**Senza `VITE_VIDEO_BASE_URL` il comportamento è identico a oggi** — verificato:
typecheck pulito, 126 test verdi, il caso "senza base lascia il percorso
invariato" è nella suite.

## Cosa resta all'owner

Non posso creare account né inserire credenziali. I passi sono:

1. Creare un bucket R2 su Cloudflare.
2. Caricarci `public/video/` **mantenendo il prefisso `/video/`** nel percorso
   dell'oggetto (l'helper concatena base + percorso esistente).
3. Collegare un dominio custom al bucket (es. `media.travelliniwithus.it`) —
   serve anche perché la CSP in `firebase.json` elenca gli host consentiti.
4. Impostare `VITE_VIDEO_BASE_URL=https://media.travelliniwithus.it` in `.env`.
5. Ricostruire e verificare che un reel parta davvero dal nuovo host.

**Attenzione alla CSP**: `firebase.json` ha `media-src 'self' https: blob:`, che
consente già qualunque host https — quindi il passaggio non la rompe. Se in futuro
`media-src` venisse ristretta, il dominio R2 va aggiunto lì.

## Problema collaterale da non dimenticare

`public/video/` è **gitignorato** (`.gitignore:164`). I 276 MB esistono solo su
questa macchina: un clone pulito costruisce un sito con 29 video mancanti, e non
esiste alcun backup. Spostarli su R2 risolve anche questo — l'object storage
diventa la copia autoritativa.

## Correlati

- [[DECISION_AMBIENTE_LAVORO_2026-07-26]]
- [[BUG_API_ENDPOINTS_SENZA_BACKEND_IN_PROD_2026-07-26]] — il backend resta il
  blocco successivo; costa zero, questo no.
