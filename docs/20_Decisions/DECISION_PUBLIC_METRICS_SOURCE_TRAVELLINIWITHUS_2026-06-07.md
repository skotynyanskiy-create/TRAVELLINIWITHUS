---
type: decision
area: marketing
status: active
date: 2026-06-07
tags:
  - decision
  - metrics
  - media-kit
  - trust
---

# Decisione — Fonte metriche pubbliche Travelliniwithus

## Decisione

Il sito usa una sola fonte configurata per i numeri pubblici: `src/config/site.ts`.

I numeri pubblici sono segnali orientativi, non report di campagna. Ogni proposta partner deve essere aggiornata con export ufficiali prima dell'invio.

## Snapshot usato nel sito

| Metrica          | Valore pubblico nel sito | Stato                           |
| ---------------- | -----------------------: | ------------------------------- |
| Instagram        |                   `170K` | snapshot pubblico da confermare |
| TikTok           |                   `90K+` | snapshot pubblico da confermare |
| Community totale |                  `260K+` | derivata da IG + TikTok         |
| Reach mensile    |                  `500K+` | richiede conferma Insights      |
| Engagement rate  |                   `6.5%` | richiede conferma Insights      |

Fonte tecnica: `BRAND_STATS` e `BRAND_STATS_SOURCE` in `src/config/site.ts`.

## Regola operativa

- Non inserire numeri social hard-coded in pagine, email o PDF.
- Ogni pagina business deve dichiarare che i dati sono uno snapshot pubblico da aggiornare con Insights.
- Newsletter counter pubblico disattivato finche non esiste un numero verificato da Brevo/Firestore.
- Se R&B consegnano nuovi dati, aggiornare prima `src/config/site.ts`, poi rigenerare PDF/media kit se necessario.

## Dati da chiedere a R&B

- Export Meta Business Suite ultimi 90 giorni.
- Export TikTok Analytics ultimi 90 giorni.
- Screenshot con follower, reach, engagement e top content.
- Conferma handle TikTok ufficiale.
- Dati newsletter da Brevo/Firestore prima di riattivare counter pubblico.

## Pagine impattate

- `/media-kit`
- `/collaborazioni`
- `/press`
- email welcome newsletter
- note marketing e snapshot pubblico
