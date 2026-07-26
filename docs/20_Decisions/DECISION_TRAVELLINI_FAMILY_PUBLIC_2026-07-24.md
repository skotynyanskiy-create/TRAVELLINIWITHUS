---
type: decision
area: brand
status: active
priority: p1
owner: team
decided: 2026-07-24
related: '[[BRAND_TRAVELLINI_FAMILY]]'
tags:
  - decision
  - brand
  - family
  - travellinifamily
  - audience
---

# DECISION — TravelliniFamily sezione pubblica + sito a 3 audience (2026-07-24)

## Contesto

L'owner ha richiesto in sessione (2026-07-24) una struttura del sito a **tre pubblici
distinti** — Viaggiatori, Brand/Collaborazioni, **Family** — con scelta semplice all'ingresso
e zero confusione tra sezioni. Betta è all'8° mese di gravidanza; il sub-brand
`@travellinifamily` (77 post, 2.200 follower) è attivo. Questa decisione supera
[[DECISION_TRAVELLINI_FAMILY_BOUNDARY_2026-07-23]] (punto 3: approvazione owner avvenuta).

## Decisione

1. **Sezione pubblica Family approvata**: rotta **`/family`** (redirect `/famiglia` →
   `/family`), hub «Travellini Family», figli `/family/consigli` e `/family/shop`.
2. **Audience layer a 3**: `viaggiatori | family | brand`, con porta di scelta al primo
   accesso (ricordata) + switch persistente in navbar (desktop e mobile). Deep-link imposta
   l'audience in silenzio.
3. **Contenuti Family solo da import reale** di `@travellinifamily` (pipeline reel rodata).
   Nessun contenuto inventato; caption/prezzi/codici solo se dichiarati nei post reali.
4. **Shop Family = vetrina affiliate + codici sconto reali** con `rel="sponsored"` e
   disclosure AGCOM (pattern `/risorse`). **Nessun carrello/Stripe**: la decisione shop
   2026-05-15 (attivazione con ≥20 waitlist) resta invariata.
5. **Stati superfici onesti**: le rotte family nascono `preview` in `surfaces.ts`; flip a
   `live` solo con ≥8 consigli reali e ≥3 deal reali.
6. **Imagery truth invariata**: solo foto/frame reali della coppia; nessuna generazione AI di
   persone.
7. Restano validi dalla decision precedente: metriche non sommate tra account, cross-post
   solo se pertinente, AI briefs da riscrivere (family = sub-brand con sezione dedicata).

## Ancora aperto (gate owner in Fase 5)

- **Diritti/opportunità asset gravidanza & neonato sul web**: conferma esplicita owner prima
  di pubblicare foto della gravidanza nell'hub.
- Timeline pubblica nascita / contenuti "col piccolo".

## Collegamenti

- Piano esecutivo: [[10_Projects/PROJECT_FAMILY_AREA_2026-07-24]]
- [[BRAND_TRAVELLINI_FAMILY]] · [[MARKETING_OPERATIONS_HUB]]
