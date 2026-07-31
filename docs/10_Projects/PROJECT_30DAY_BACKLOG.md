---
type: project
area: growth
status: archived
priority: p0
owner: Skott
repo: TRAVELLINIWITHUS
related: '[[MARKETING_OPERATIONS_HUB]]'
source: travellini-growth-revenue-operator audit 2026-05-14
tags:
  - project
  - growth
  - revenue
  - backlog
superseded_by: PROJECT_BACKLOG_UNICO_2026-07-31
---

> **Superato il 2026-07-31.** Questo piano non è più "cosa fare".
> Il lavoro ancora vivo è confluito in [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]; la direzione è in `PROJECT_BACKLOG_UNICO_2026-07-31`.
> Resta leggibile come storico — non aggiungerci voci nuove.

# PROJECT_30DAY_BACKLOG

Backlog operativo prossimi 30 giorni dal Growth & Revenue audit del
2026-05-14. Ordine per ROI atteso. Effort: S=&lt;2h, M=2-6h, L=&gt;6h.

## Funnel leak identificati

1. **Media kit non scaricabile senza form** — barriera alta per partner
   che arrivano da ricerca a freddo
2. **ExitIntentPopup senza lead magnet specifico** — copy generico, offerta
   debole
3. **`RESEND_API_KEY` non configurato** — ogni lead catturato e' silenzioso
   (no welcome, no media kit auto-reply, no order confirmation)
4. **`FEATURED_REEL` vuoto + thumbnail Unsplash** — trust killer in home
   (parzialmente mitigato dalla patch del 2026-05-14: caption demo non
   piu' esposta, ma URL reale ancora necessario)
5. **Shop e articoli in modalita' demo** — zero contenuto indicizzabile
   per SEO organico, sitemap senza rotte dinamiche

## Punti deboli media kit attuale

- Nessuna anteprima visiva del PDF nella pagina /media-kit
- Numeri brand non collegati a fonti verificabili pubbliche (no breakdown
  per geografia, genere, eta')
- Nessun caso studio o attivazione passata
- "Risposta entro 48 ore" senza segnale di volume
- Form senza budget range o periodo previsto → brief vaghi

## Backlog 30 giorni

| #   | Titolo                                                                              | Why                                                                           | Effort | Impatto                   | Owner             |
| --- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------ | ------------------------- | ----------------- |
| 1   | Configurare `RESEND_API_KEY` + testare welcome/media-kit/order confirmation         | Ogni lead catturato ora e' silenzioso, freeze post-form ~100%                 | S      | lead nurturing immediato  | Skott             |
| 2   | Inserire URL reel reale in `site.ts` + sostituire thumbnail Unsplash con foto brand | Trust killer ancora visibile (la patch rimuove "demo" ma il visual e' stock)  | S      | trust / bounce rate       | Skott + R+B asset |
| 3   | Lead magnet PDF come offerta nell'ExitIntentPopup                                   | Offerta concreta vs newsletter generica                                       | S      | lead B2C                  | frontend-builder  |
| 4   | Screenshot del media kit PDF nella pagina /media-kit                                | Riduce friction per partner che valuta senza compilare form                   | S      | lead B2B                  | frontend-builder  |
| 5   | Campi "budget range" e "periodo previsto" nel form media kit                        | Lead meglio qualificati, meno round di qualificazione                         | S      | qualified lead rate       | frontend-builder  |
| 6   | Compilare il lead magnet PDF "10 posti italiani" con contenuto reale                | File 23KB di template, manca payload reale                                    | M      | lead B2C, autorita'       | Skott + R+B       |
| 7   | Pubblicare primo articolo pillar reale (es. Salento agosto)                         | Prima pagina indicizzabile, test sitemap dinamica + redirect /articoli→/guide | M      | SEO organico, newsletter  | Skott + R+B       |
| 8   | Foto reali Rodrigo & Betta in hero e chi-siamo                                      | Asset necessari per sprint successivi e media kit premium                     | M      | trust, conversion         | R+B foto          |
| 9   | Aggiornare media kit PDF con dati reali + 1 slide caso studio                       | Il PDF e' il punto d'arrivo del funnel B2B                                    | M      | partner conversion        | Skott             |
| 10  | Configurare Mapbox token live in `.env.production`                                  | Mappa va in empty state senza token, riduce engagement                        | S      | discovery, engagement     | Skott             |
| 11  | Tracking `media_kit_download` e `partner_form_submit`                               | Zero visibilita' su cosa converte nel funnel B2B                              | S      | analytics                 | frontend-builder  |
| 12  | Newsletter segmentata: lista "partner" separata da "reader" in Brevo                | Ora tutto in unico contenitore, deliverability mista                          | S      | deliverability, nurturing | Skott             |
| 13  | Pubblicare `/vieni-con-noi` + aggiornare bio Instagram con link                     | Landing pronta ma non live nelle bio                                          | S      | lead da social, UTM       | Skott + R+B       |
| 14  | Outreach 3 hotel/boutique property coerenti con il brand                            | Pipeline partner vuota                                                        | M      | revenue                   | Skott + R+B       |
| 15  | Pubblicare 2-3 guide destinazione (anche brevi) per test sitemap                    | Contenuto sufficiente per route `/guide` indicizzabili                        | L      | SEO organico              | Skott + R+B       |

## Quick wins questa settimana

### QW.1 — Lead magnet nel popup di uscita (&lt;2h)

Modificare [src/components/ExitIntentPopup.tsx](../../src/components/ExitIntentPopup.tsx):
aggiungere link diretto al PDF `/public/lead-magnet-posti-italiani.pdf` come CTA
secondaria o principale, sostituendo il copy generico. Tracciare `lead_magnet_click`
con `source: exit_popup`.

### QW.2 — URL reel reale + screenshot media kit (&lt;1h totali)

- R+B mandano URL ultimo reel pubblicato → Skott aggiorna `FEATURED_REEL.url`
  in [src/config/site.ts](../../src/config/site.ts)
- Screenshot di una pagina del media kit PDF → aggiunto nella sezione
  "Cosa troverai" in [src/pages/MediaKit.tsx](../../src/pages/MediaKit.tsx)

### QW.3 — Budget + periodo nel form media kit (&lt;1h)

Aggiungere select "Budget indicativo" (&lt;500€ / 500-1500 / 1500-3000 / &gt;3000 /
da definire) e "Periodo previsto" (input month o text libero) al form in
[src/pages/MediaKit.tsx](../../src/pages/MediaKit.tsx). Non bloccare submit, include
valori nel payload Firestore e nelle email Resend.

## Esperimento serio in corso

**Lead magnet gated vs ungated** — test di friction sul funnel B2C.

Il PDF "10 posti italiani" esiste in `/public/lead-magnet-posti-italiani.pdf`
ma non e' distribuito. Test:

- **Versione A (ungated)**: link diretto al PDF nella bio Instagram +
  `/vieni-con-noi`, senza form. Traccia `lead_magnet_download` via UTM.
- **Versione B (gated)**: form email leggero (solo email) in `/vieni-con-noi`,
  PDF arriva via Resend. Traccia `newsletter_signup` con
  `source: lead_magnet_vieni_con_noi`.

Durata: 3 settimane. Minimo 200 click per decidere.

Metriche: download rate (A) vs form completion rate (B), retention 7 giorni
sugli iscritti via B, open rate welcome email.

Vincolo: B richiede `RESEND_API_KEY` configurato (item #1). Se Resend non
e' pronto entro 3 giorni, lancia solo A come baseline.

## Note operative

- Vincolo lingua: italiano per copy front-end, inglese per file tecnici
- Tono editoriale: caldo, diretto, specifico. Niente buzzword, niente
  cliche' travel ("vibrante", "eclettico", "imperdibile")
- Ogni esperimento deve avere tracking events espliciti prima del lancio
- Aggiornare `MARKETING_OPERATIONS_HUB.md` man mano che gli item passano
  in done
