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

| Metrica          | Valore pubblico nel sito | Stato                                           |
| ---------------- | -----------------------: | ----------------------------------------------- |
| Instagram        |                   `172K` | **verificato 2026-08-15: 172.680 sul profilo**  |
| TikTok           |                   `90K+` | **non verificabile senza login** (vedi sotto)   |
| Community totale |                  `260K+` | derivata da IG + TikTok                         |
| Reach mensile    |                  `500K+` | richiede conferma Insights                      |
| Engagement rate  |                   `6.5%` | richiede conferma Insights                      |

> **2026-08-15 — Instagram è confermato, gli altri quattro no.** Il conteggio
> follower è pubblico e si legge sul profilo senza login: 172.680, quindi il
> `172K` di `src/config/site.ts` è corretto e i due valori che giravano in
> parallelo (`167K` nel template di outreach, `170K` in questa tabella) erano
> vecchi — ora allineati.
>
> **Reach ed engagement restano non verificabili dall'esterno**: stanno in
> Insights, dietro il login, e nessuno li ha misurati. Restano in `BRAND_STATS`
> come snapshot dichiarato; il giorno in cui un partner chiede l'export, `500K+`
> e `6.5%` sono le due righe che vanno confermate o corrette.
>
> **TikTok: provato lo stesso giorno, non si legge.** A differenza di Instagram,
> `tiktok.com/@travellini.withus` reindirizza a un login obbligatorio
> (`/login?...&enter_method=mandatory`) e il conteggio non compare né nel DOM né
> nelle meta della pagina servita. Non è una svista da riprovare: il `90K+` può
> confermarlo **solo l'owner**, dall'app dove è già autenticato. Fino ad allora
> resta un valore dichiarato esattamente come reach ed engagement — e vale la
> pena saperlo, perché compare accanto a `172K`, che invece è verificato, e la
> vicinanza fa sembrare verificati entrambi.

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
