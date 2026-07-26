---
title: HANDOFF_site-levelup_growth_to_seo-social
status: open
created: 2026-07-05
from: travellini-growth-revenue-operator
to: travellini-seo-conversion-strategist + travellini-social-content-operator
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

# Handoff: metrica + offer àncora + priorità distribution (esecuzione gated TIER 1+2)

## Why this work matters

Growth è il dominio più debole (4/10) e i dati sono ciechi (GA4/Firestore/Sentry
irraggiungibili). In questa finestra costruiamo l'unico motore B2C ripetibile e
posseduto — la lista newsletter — perché è il prerequisito di ogni altra
monetizzazione (waitlist shop, proof engagement per i partner). La distribution
NON parte finché TIER 1 (trust killer rimossi) e TIER 2 (contenuti reali nei
vuoti) non sono verdi: spingere traffico su un sito con fake-badge o pagine
demo brucia reach e danneggia il brand.

## Decisions already made (LOCK — non rilitigare)

- **Metrica primaria interim (finestra attuale, analytics ciechi):** `% route
pubbliche oltre il gate premium` (a11y≥0.95, CLS≤0.1, perf≥0.85, LCP≤2500).
  Stato: 83% (5/6). Leva unica: la home (perf 0.63-0.68, TBT 579-812ms, layer
  WebGL). Target finestra: 100%. Questa è un gate tecnico/qualità (proxy di
  "premium-calm"), NON la metrica di crescita: nessuna campagna a pagamento
  finché non è 100%.
- **Metrica primaria graduata (quando sblocca):** `newsletter signup-rate`
  (visita → opt-in confermato) su `/vieni-con-noi` + surface newsletter home/articolo.
  Trigger di graduazione: GA4 ADC attivo + project Firestore corretto confermato
  - Brevo/Resend live + ≥7 giorni di dati raccolti. Target provvisori dal
    PROJECT_SITE_V2 (home ≥2%, articolo ≥3%) da VALIDARE contro baseline reale
    prima del lock — non trattarli come dati.
- **Offer àncora della finestra: lead-magnet PDF "posti italiani" (gratis) →
  opt-in newsletter confermato.** Una sola offer. NON lanciare media-kit push né
  shop preorder in parallelo in questa finestra.
- **Regole di credibilità invariate:** 1 partner content : 4 editoriali; nessun
  outreach partner senza ≥1 case study/screenshot proof salvato in repo privato.
- **Affiliate attivi utilizzabili ORA: solo Heymondo + GetYourGuide (2/6).** Gli
  altri 4 (Skyscanner/Booking/Airalo/Revolut) sono owner-gated: non citarli come
  attivi né inserirli come link finché signup non confermati.
- **Nessun numero inventato.** Audience/reach/follower restano `[VERIFY]` finché
  l'owner non conferma gli Insights ufficiali.

## Context the receiver needs

- Baseline dati: handoff data-analyst (stessa cartella). Sintesi: unico
  misurabile = Lighthouse lab 2026-06-26.
- Stato revenue surface: `docs/MARKETING_OPERATIONS_HUB.md` §"Revenue surface".
  Sintesi operativa: newsletter/lead-magnet WIRED ma NON attivo (manca
  Resend/Brevo); form media-kit ATTIVO; shop BLOCCATO (cart disabled, waitlist ≥20
  prima di Stripe live).
- Materia prima contenuti: 40 posti seed + 6 reel reali già nel repo (inventario,
  non pubblicato). I 5/6 reel veri: Egitto/Mar Rosso, Sushi Kibo, Tavernal draghi,
  Batu Caves Malesia, Volterra Volturi (vedi memoria brand). Identità:
  vibrante/esperienziale/internazionale.
- Articolo pillar pronto come outline: `docs/13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md`
  (stagionale — finestra agosto).
- Landing di cattura: `/vieni-con-noi` (standalone + UTM già implementata).
- Lead magnet outline: `docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md`.

## What the receiver should produce (SOLO dopo TIER 1+2 verdi)

Priorità distribution in ordine. Ogni azione ha un prerequisito tecnico esplicito:
NON iniziare l'azione se il prerequisito non è verde.

### Azione 1 — Attivare il funnel lead-magnet + bio (CAPTURE)

- **Prerequisito tecnico (owner-gated):** `RESEND_API_KEY`/`BREVO_API_KEY`/
  `BREVO_LIST_ID`/`MAIL_FROM` in `.env.production` + PDF compilato con 10 luoghi
  reali + welcome email testata end-to-end (arriva, link PDF 200) + bio IG/TikTok
  che punta a `/vieni-con-noi?utm_source=ig_bio|tt_bio`.
- **seo-strategist:** copy IT di `/vieni-con-noi` orientata all'opt-in (H1 +
  promessa lead-magnet + CTA specifica), meta + structured data della landing,
  microcopy del double opt-in. Niente "scopri il magico mondo".
- **social-content-operator:** sequenza stories/reel che porta dalla bio al
  lead-magnet (hook → valore → CTA "link in bio"), riusando i 6 reel reali.
- **Canale:** bio IG/TikTok (audience posseduta → lista posseduta).
- **Perché prima:** senza meccanismo di cattura, ogni altra spinta è reach persa.

### Azione 2 — Pubblicare + spingere il pillar Salento agosto (INTENT ALTO)

- **Prerequisito tecnico:** articolo pubblicato reale (TIER 2), meta/H1/slug/schema
  a posto, CTA newsletter contestuale nel corpo, box affiliate SOLO Heymondo +
  GetYourGuide con `rel="sponsored"`.
- **seo-strategist:** cluster keyword + H1 + meta + JSON-LD Article/BreadcrumbList;
  posizionamento CTA newsletter dentro l'articolo (target V2 ≥3% da articolo, da
  validare).
- **social-content-operator:** piano repurpose pillar → reel/stories (usare
  `/repurpose`), con rimando all'articolo, non alla home.
- **Canale:** SEO + repurpose IG.
- **Perché ora:** finestra stagionale agosto; è la surface editoriale a più alta
  intenzione per l'opt-in.

### Azione 3 — Portare i 40 posti seed in /esplora + /destinazioni (DISCOVERY)

- **Prerequisito tecnico:** posti reali PUBBLICATI (non più seed inventario) +
  fake-badge rimossi (TIER 1 fatto) + nessun overflow mobile.
- **seo-strategist:** canonical/collection schema per le pagine discovery che
  hanno contenuto reale sufficiente; motivazione editoriale "perché te lo
  consigliamo" nelle card (brief copy, non il body).
- **social-content-operator:** stories/carousel che portano da social a
  `/esplora` filtrata, poi a newsletter.
- **Canale:** IG stories/social → discovery.
- **Perché terza:** amplifica la scoperta ma converte meno dell'articolo mirato;
  utile dopo che cattura + intent alto sono live.

## Out of scope (do NOT touch)

- Eseguire qualsiasi azione PRIMA che TIER 1+2 siano verdi (gated).
- Media-kit outreach B2B e push shop preorder: fuori da questa finestra.
- Spesa a pagamento: vietata finché la home non passa il gate (metrica interim 100%).
- Inventare audience/reach/prezzi/nomi partner.
- Scrivere il PDF lead-magnet (contenuto owner) o abilitare le chiavi (owner).
- Toccare `server.ts`/`firestore.rules`/`admin.ts` (backend-engineer + owner).

## Open questions / decisions for the user (owner-only — escalare, non decidere)

- Project Firebase corretto: `.firebaserc` punta a `gen-lang-client-0138696306`
  con Firestore NON provisionato → probabile project sbagliato. Confermare il
  project di produzione reale.
- GA4: eseguire `gcloud` ADC auth + enable API + restart (sblocca analytics →
  graduazione metrica).
- Attivare Brevo/Resend: `RESEND_API_KEY`/`BREVO_API_KEY`/`BREVO_LIST_ID`/`MAIL_FROM`.
- Compilare il PDF lead-magnet con 10 luoghi reali.
- Aggiornare bio IG + TikTok con `/vieni-con-noi?utm...`.
- Confermare Insights ufficiali (audience figures oggi `[VERIFY]`).
- Confermare l'offer àncora raccomandata (lead-magnet).
- Rinviati fuori finestra: scelta SKU shop + budget; signup 4 affiliate mancanti;
  autorizzazione case study Emilia-Fantastica.

## Next hand-off

- Next agent: dopo copy (seo) + piano social (social-operator) →
  `travellini-frontend-builder` (impl) → `travellini-quality-auditor` +
  `browser-auditor` (gate) prima di qualunque go-live.
- Trigger: TIER 1+2 verdi + prerequisiti tecnici di ciascuna azione soddisfatti.

## Notes

- Sequenza logica: la newsletter è il prerequisito delle altre due monetizzazioni.
  Lo shop non può raggiungere la waitlist ≥20 senza lista; i partner chiedono
  proof di engagement che la lista + i case study forniscono. Per questo l'offer
  àncora è la lista, non il media-kit (demand-driven, non scalabile via
  distribution) né lo shop (bloccato a monte).
