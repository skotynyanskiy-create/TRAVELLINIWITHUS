---
type: checklist
area: operations
status: active
priority: p0
owner: Rodrigo & Betta
opened: 2026-05-15
source: audit avanzato 2026-05-15 Fase D
tags:
  - rb-actions
  - operations
  - readiness
related:
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
  - '[[MARKETING_OPERATIONS_HUB]]'
  - '[[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]'
  - '[[13_Content/CONTENT_CALENDAR_H2_2026]]'
---

# Azioni Rodrigo & Betta per arrivare a "premium-ready" 10/10

Lista operativa post Fase A code (2026-05-15). Tutto il codice è stato chiuso
dove possibile; questi sono i punti **che solo voi potete fare** e che
determinano il passaggio del sito da 7.8/10 a 10/10.

Ordine per ROI/ora — partite dall'alto.

---

## 1) Bio Instagram + TikTok (15 min · ROI altissimo)

**Aggiornare la bio di entrambi i profili con il link tracciato:**

- Instagram: `https://travelliniwithus.it/vieni-con-noi?utm_source=instagram&utm_medium=bio&utm_campaign=lead_magnet`
- TikTok: `https://travelliniwithus.it/vieni-con-noi?utm_source=tiktok&utm_medium=bio&utm_campaign=lead_magnet`

**Perché:** la landing è pronta, il tracking GA4 cattura `landing_view` con UTM,
ma oggi è invisibile perché non c'è traffico bio. KPI atteso: 0,8-1,5% bio CTR
di 250K aggregati = 80-150 lead/mese realistici quando lead magnet è pronto.

**Verifica:** dopo 24h, GA4 Real-time → eventi `landing_view` con
`utm_source=instagram|tiktok`.

---

## 2) Setup env produzione (30 min · sblocca lead magnet + email)

**File da creare/aggiornare su Render/Vercel (NON in repo):**

```env
RESEND_API_KEY=re_...           # https://resend.com/api-keys
BREVO_API_KEY=xkeysib-...        # https://app.brevo.com/settings/keys/api
BREVO_LIST_ID=<id-lista>         # https://app.brevo.com/contact/list-listing
MAIL_FROM="Travelliniwithus <hello@travelliniwithus.it>"
MAIL_TO_OWNER=hello@travelliniwithus.it
LEAD_MAGNET_URL=https://travelliniwithus.it/lead-magnet-posti-italiani.pdf
```

**Perché:** oggi welcome email + lead magnet delivery sono no-op silenziosi.
Senza queste chiavi, ogni iscrizione finisce in `twu_newsletter_leads`
localStorage o Firestore `leads` collection ma l'utente non riceve nulla.
Trust speso al primo invio fallito.

**Verifica:** dopo setup, iscrizione test → mail welcome arriva entro 30s.

---

## 3) Affiliate stack signup (90 min · 50-400€/mese in 60gg)

**Programmi da attivare (in questo ordine):**

1. **Skyscanner BFCA** → https://www.skyscanner.it/affiliates
2. **Booking.com BFCA** → https://www.booking.com/affiliate-program/v2/
3. **Airalo Partner** → https://www.airalo.com/affiliates
4. **Revolut Affiliate** → https://www.revolut.com/affiliate

Per ciascuno: signup → link tracking generato → sostituire i link nudi attuali
in `src/pages/Risorse.tsx` e nelle `AffiliateBox` degli articoli (anche di
quelli demo).

**Perché:** oggi solo Heymondo + GetYourGuide hanno link affiliato attivo.
Skyscanner/Booking/Airalo/Revolut sono link nudi: ogni click = 0€. Per 250K
aggregati follower, ROI conservativo 50-120€/mese, realistico 200-400€ se
un pillar prende trazione SEO.

---

## 4) Lead magnet PDF — 10 luoghi reali (4-6h)

**File da compilare:** [13_Content/LEAD_MAGNET_POSTI_ITALIANI.md](13_Content/LEAD_MAGNET_POSTI_ITALIANI.md)

Per ciascuno dei 10 luoghi:

- nome luogo + regione
- coordinate (anche approssimate)
- 1 foto reale 4:3 (almeno 1200×900)
- 2 paragrafi di racconto (atmosfera, perché ci siete andati)
- 3 dettagli pratici (quando, come, costo orientativo)
- 1 indirizzo concreto (hotel, ristorante, esperienza)

Poi: `npm run generate:lead-magnet` rigenera il PDF (12 pagine A4).

**Perché:** oggi PDF generato ma compilato con placeholder. Ogni iscrizione
attuale = promessa non mantenuta. LTV bruciato.

---

## 5) Pillar Salento Agosto (8-12h distribuite)

**Outline pronto:** [13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md](13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md)

Da fare:

- riempire l'outline (1500-2000 parole reali R+B)
- 8-10 foto originali (no Unsplash) min 1600×1067
- pubblicare via admin editor entro **fine maggio 2026** (window estate stretta)
- aggiungere 2-3 affiliate widget contestuali (Skyscanner per voli su Brindisi,
  Booking per hotel zona, GetYourGuide per esperienze)

**Perché:** primo pillar SEO. Senza, il sito ha 0 articoli reali indicizzabili.
Stima 200-800 sessioni organiche/mese entro 90gg se pubblicato entro maggio.

---

## 6) Partner outreach Q3 2026 (1h/sett × 5 sett = 5h)

**Template pronto:** [12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS.md](12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS.md)

5 cold outreach da inviare entro 2026-09-30, una categoria alla settimana:

1. **Hotel boutique italiani**: Borgo Egnazia / Vocabolo Moscatelli / Il Sereno
2. **DMO regionale**: Visit Marche / APT Basilicata / Regione Molise
3. **Experience provider**: Casa Maria Luigia / Sailing Sardinia / Tasting Sicily
4. **Brand travel-gear**: Peak Design / Bric's Life / Aer
5. **Brand alimentare/wine**: validare con i nomi che già seguite

**Prerequisito hard:** prima del primo outreach reale serve almeno 1 case study
documentato (anche micro: una struttura amica, un brand minore) o screenshot
dashboard creator (IG insights / TikTok analytics) salvato in repo privato come
proof. Senza, reply rate sconta -20/-40%.

---

## 7) Foto people-led R+B in /public/images/brand/ (2-3 set fotografici)

Per arrivare a "0 Unsplash hotlink" totali, servono almeno:

- **Set 1 — Couple editorial** (10 foto): R+B in viaggio, sguardo verso
  paesaggio, dettagli (mappa, taccuino, valigia). Useranno come hero pagine,
  CoupleIntro polaroid scatter, fallback Reel.
- **Set 2 — Working/method** (6 foto): R+B che pianificano, scrivono, scelgono
  un hotel, sopralluogo. Useranno come about-editorial, MediaKit hero, MonetizationTeaser.
- **Set 3 — Instagram reel covers** (6 foto verticali 9:16): per
  InstagramGrid e FEATURED_REEL fallback.

Sostituiranno i TODO[R+B] in:

- `src/pages/ChiSiamo.tsx`
- `src/components/InstagramGrid.tsx`
- `src/components/home/CoupleIntro.tsx`
- `src/components/home/MonetizationTeaser.tsx`
- `src/components/home/HomePartnerSignal.tsx`

---

## 8) FEATURED_REEL valorizzato (5 min)

In [src/config/site.ts:39](../src/config/site.ts):

```ts
export const FEATURED_REEL = {
  url: 'https://www.instagram.com/reel/<shortcode>/', // ultimo reel reale
  thumbnail: '/images/brand/<screenshot-cover-9x16>.webp',
  caption: '<caption breve in italiano>',
};
```

**Perché:** oggi `url: ''` mostra fallback immagine. Iframe Instagram embed
funziona quando `url` è valorizzato.

---

## 9) Verifica numeri pubblici con screenshot dashboard (30 min)

In repo privato (NON pubblico) salvare screenshot:

- Instagram Creator Insights → Reach last 30 days → conferma "500K+" o aggiorna
- TikTok Analytics → Followers totali → conferma "90K+" o aggiorna
- TikTok Analytics → Engagement rate medio → conferma "6.5%" o aggiorna

Aggiornare `src/config/site.ts:20-28` se i numeri reali differiscono. Salvare
gli screenshot in `docs/12_Partnerships/proof/` (cartella nuova, gitignored)
per allegarli alle prime outreach partner.

**Perché:** oggi i numeri sono dichiarazione del founder, non documentati. Per
partner B2B è il momento più scivoloso del media kit.

---

## 10) Setup Firebase App Check (15 min, Google Cloud Console)

1. https://console.cloud.google.com → progetto Firebase Travelliniwithus
2. APIs & Services → Credentials → API key Web SDK
3. Application restrictions → HTTP referrers → aggiungere:
   - `https://travelliniwithus.it/*`
   - `https://www.travelliniwithus.it/*`
   - `http://localhost:3000/*` (per dev)
4. Firebase Console → Project Settings → App Check → registrare reCAPTCHA
   Enterprise → enforce su Firestore + Auth

**Perché:** la public Web API key è tracciata in repo (by design). Senza App
Check + referrer restriction, un attaccante può inizializzare client Firebase
con la stessa key da uno script esterno e tentare brute-force sulle rules.

---

## Riepilogo effort totale

| #   | Azione                | Effort R+B       | Impatto                               |
| --- | --------------------- | ---------------- | ------------------------------------- |
| 1   | Bio IG/TikTok         | 15 min           | Sblocca traffico funnel               |
| 2   | Env produzione        | 30 min           | Sblocca email + lead magnet           |
| 3   | Affiliate signup      | 90 min           | 50-400€/mese in 60gg                  |
| 4   | Lead magnet PDF reale | 4-6h             | LTV lead recuperato                   |
| 5   | Pillar Salento        | 8-12h            | 200-800 sessioni/mese in 90gg         |
| 6   | Partner outreach      | 5h × 5 sett      | 1 collab Q3, 2 risposte qualif        |
| 7   | Foto R+B (3 set)      | 1-2 giorni shoot | "0 Unsplash" totale + brand integrity |
| 8   | FEATURED_REEL         | 5 min            | Hero reel reale invece fallback       |
| 9   | Screenshot dashboard  | 30 min           | Proof per outreach partner            |
| 10  | App Check Console     | 15 min           | Security hardening Firebase           |

**Totale settimana 1:** azioni 1, 2, 3, 8, 9, 10 = ~3h30
**Totale settimana 2-4:** azioni 4, 5 = ~12-18h
**Totale 90 giorni:** azioni 6, 7 = ~25h totali

Dopo tutte le azioni: voto sito previsto **9.5-10/10**.

---

## Note metodologiche

- Le stime ROI affiliate sono ordini di grandezza basati su benchmark mid-tier
  italiani (100-300K aggregati travel couple-led). Non proiezioni garantite.
- Il pillar Salento è pubblicabile solo R+B perché serve esperienza diretta sul
  posto e foto originali. Outsourcing del body via editor esterno è possibile
  (~200-400€/articolo) ma riduce il margine editorial premium.
- Outreach partner: rispettare hard rule "1 partner ogni 4 editoriali" per non
  diluire la credibilità del progetto (vedi `12_Partnerships/PARTNER_CONTENT_LAYER.md`
  da creare).
