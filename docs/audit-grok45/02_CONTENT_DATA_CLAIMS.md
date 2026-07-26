---
type: reference
area: quality
status: active
owner: team
tags:
  - reference
---

# 02 — Content, Data & Claims

**Snapshot:** 2026-07-24  
**Metodo:** analisi statica codice/config · nessuna verifica esterna completa · nessun secret  
**Label:** VERIFICATO DAL CODICE | VERIFICATO DA CONFIGURAZIONE | IPOTESI DA VALIDARE | OWNER

---

## 1. Mappa fonti contenuti

| Tipo fonte        | Location                                                                                                                                                 | Alimenta                                                      | Stato live                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------- |
| TypeScript config | `src/config/site.ts`, `destinations.ts`, `reels.ts`, `placeCatalog.ts`, `contentTaxonomy.ts`, `editorialCollections.ts`, `demo*.ts`, `previewContent.ts` | brand, IA, demo, SEO place                                    | **primaria**                    |
| JSON seed         | `src/data/content-seed.json` (**40** items)                                                                                                              | posto, mappa, esplora, home indice, destinazioni              | **40/40 `isPlaceholder: true`** |
| JSON fixture      | `instagram-media.fixture.json`                                                                                                                           | adapter/test import                                           | tooling                         |
| TS article seeds  | `src/data/articles/*.seed.ts` (~6)                                                                                                                       | script/admin                                                  | non auto-pubblici               |
| Firestore         | articles, products, orders, leads, resources, coupons, site content, stats                                                                               | Articolo, Shop, Club, Preferiti, Risorse, admin, stats collab | se configurato                  |
| Firebase Storage  | asset prodotti                                                                                                                                           | download                                                      | server                          |
| API Express       | newsletter, contact-lead, checkout, media-kit, SEO                                                                                                       | form, commerce                                                | Brevo/Resend/Stripe opzionali   |
| Hardcoded UI      | case studies, press quotes, featured places, ROI tiers, timeline, PARTNER_AREAS                                                                          | B2B + home                                                    | **alta superficie claim**       |
| Media locali      | `/public/video`, `/public/images`, PDF                                                                                                                   | reels, cover, lead magnet                                     |                                 |
| Instagram         | permalink seed + `reels.ts`                                                                                                                              | provenance                                                    | parziale; no Graph API UI path  |
| Map tiles         | OpenFreeMap via MapLibre                                                                                                                                 | mappa, home teaser                                            | esterno                         |
| Wikidata          | `placeCatalog.ts` Q-ID                                                                                                                                   | JSON-LD                                                       | statico                         |
| Markdown runtime  | non primario                                                                                                                                             | —                                                             | docs vault only                 |

**Pipeline dichiarata:** IG → adapter → Firestore → sito.  
**Runtime osservato:** seed JSON + demo + Firestore sparso.  
Label: VERIFICATO DAL CODICE.

---

## 2. Inventario domini contenuto

| Dominio         | Dove                                                       | Natura                       | Verificato in codice?                                      |
| --------------- | ---------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------- |
| Destinazioni    | `destinations.ts` (Italia 20 regioni + Europa/Africa/Asia) | struttura + intro            | struttura sì; volume dipende da seed                       |
| Posti           | content-seed 40                                            | hook, geo, type; placeholder | **non pubblicabili come verificati**                       |
| Guide           | DEMO_GUIDES                                                | 2–3 demo                     | demo only                                                  |
| Articoli        | FS + PREVIEW + demoArchive                                 | misto                        | preview noindex                                            |
| Itinerari       | DEMO_ITINERARIES                                           | 3 visibili / 10 raw          | demo                                                       |
| Video/Reels     | `reels.ts` 5 MP4 locali                                    | frame reali claim            | URL/views incompleti                                       |
| Collaborazioni  | page + widgets                                             | servizi, process             | marketing                                                  |
| Case study      | `CaseStudiesSection`                                       | 3 + metriche                 | **senza source link**                                      |
| Metriche brand  | `site.ts` BRAND_STATS                                      | multi-surface                | snapshot dichiarato; non Insights-backed in code           |
| Servizi B2B     | Collaborazioni / MediaKit                                  | qualitativi                  |                                                            |
| Prodotti        | 1 demo SKU waitlist                                        | €24.9 Dolomiti               | cart off                                                   |
| Media kit       | form + slide mock + script generate                        | gated                        |                                                            |
| Proof linkabili | `PUBLIC_PROOF_SIGNALS`                                     | Castelli del Ducato URLs     | esistenza URL verificabile esternamente in fasi successive |

---

## 3. Tabella claim e metriche

| Claim / metrica                                    | File                                          | Uso                                         | Fonte dichiarata       | Data                                               | Verificabilità                       | Rischio                           |
| -------------------------------------------------- | --------------------------------------------- | ------------------------------------------- | ---------------------- | -------------------------------------------------- | ------------------------------------ | --------------------------------- |
| IG **172K**                                        | `site.ts` BRAND_STATS                         | MediaKit, Collab, ChiSiamo, SocialFollow, … | Snapshot pubblico IG   | `observedAt` 2026-07-23 (commento dual 2026-05-29) | profilo pubblico                     | **M**                             |
| TT **90K+**                                        | site.ts                                       | stesse surface                              | non dettagliata        | same                                               | pubblico TT                          | **M**                             |
| Community **260K+**                                | site.ts                                       | Hero, Footer, VieniConNoi                   | somma/round            | same                                               | derivata                             | **M**                             |
| Engagement **6.5%**                                | site.ts                                       | Collab, Social                              | “update with Insights” | same                                               | **OWNER Insights**                   | **H**                             |
| Reach mensile **500K+**                            | site.ts                                       | MediaKit, Collab                            | same                   | same                                               | OWNER                                | **H**                             |
| Post **1.272**                                     | site.ts                                       | disponibile                                 | count-style            |                                                    | public-ish                           | **L-M**                           |
| Destinazioni **150+**                              | site.ts                                       | CleanCuratedHero                            | nessuna                |                                                    | brand claim                          | **M**                             |
| Anni **8** / brand **2018**                        | site.ts, ChiSiamo                             | badge, timeline                             | narrativa              |                                                    | OWNER                                | **L-M**                           |
| Admin default ER **8.5%**, IG **250K+**            | AdminDashboard                                | form default                                | nessuna                |                                                    | **conflitto** con site 6.5%/172K     | **H** se salvato FS e mostrato    |
| ROI tier reach/ER/saves                            | `RoiCalculatorWidget.tsx`                     | Collaborazioni                              | “stime” UI             | nessuna                                            | stime marketing non storiche         | **H** se lette come garanzia      |
| Case Castelli: reach 142k+, save 8.4%, click 1250+ | CaseStudiesSection                            | Collab                                      | nessuna in code        | nessuna                                            | no report/Insights                   | **H**                             |
| Case Salento: 89.5k views, 6.1k int, 380 req       | same                                          | Collab                                      | nessuna                |                                                    | non verificato                       | **H**                             |
| Case gear: ER 9.2%, 520 click                      | same                                          | Collab                                      | nessuna                |                                                    | non verificato                       | **H**                             |
| Quote TGCOM24, VF, Repubblica, Radio105            | PressProofSection                             | Collab                                      | nessuna / no URL       |                                                    | **rischio fabbricazione**            | **H**                             |
| Badge “Metriche Verificate… Meta Insights”         | PressProofSection                             | Collab                                      | self-claim             |                                                    | circolare                            | **H**                             |
| Castelli del Ducato URLs                           | site.ts PUBLIC_PROOF                          | Collab + MediaKit                           | URL partner live       |                                                    | fetchabili                           | **L** esistenza / **M** narrativa |
| “Nessun posto da desk” / zero desk                 | BRAND_PROMISE, EditorialPromise, ANTI_TARGETS | home + B2B                                  | policy editoriale      |                                                    | metodo                               | **M** brand                       |
| “verificato sul campo” / posti provati             | home/map/posto copy                           | UI                                          | policy                 |                                                    | **contraddetto** da placeholder seed | **H** trust gap                   |
| “Coordinate GPS esatte”                            | HomeMapSection                                | home                                        | nessuna                |                                                    | geocode + fallback                   | **M**                             |
| Orari / telefono posto                             | Posto UI                                      | se presenti                                 | seed raramente fill    |                                                    | empty onesto                         | **L**                             |
| Prezzi shop demo                                   | demo products                                 | waitlist                                    | demo                   |                                                    | cart off                             | **L** se labeled                  |
| Prezzi guide €12–18                                | demoGuides                                    | Guida                                       | demo                   |                                                    | locked                               | **L**                             |
| Newsletter counter                                 | NEWSLETTER_RECENT_SIGNUPS=0                   | nascosto &lt;50                             | intentional            |                                                    | safe                                 | **L**                             |
| AGCOM + Meta verified                              | BRAND_CREDENTIALS                             | trust strips                                | “live IG bio”          |                                                    | lista pubblica                       | **L-M**                           |
| Diario `172K+` hardcode                            | DiarioConversionSection                       | **DEV only**                                | hardcode               |                                                    | off prod                             | **L** prod                        |
| AdminMetricsOverview demo sessions                 | admin charts                                  | admin                                       | DEMO                   |                                                    | fake se scambiato                    | **M** interno                     |
| “Compliance 100% AGCM”                             | PressProofSection                             | Collab                                      | nessuna                |                                                    | overclaim legale                     | **H**                             |
| ROI budgets €1200/3000/6000                        | RoiCalculatorWidget                           | Collab                                      | stime                  |                                                    | pricing marketing                    | **M-H**                           |

---

## 4. Conteggi claim non verificati

| Bucket                                   | Count approssimativo | Note                           |
| ---------------------------------------- | -------------------: | ------------------------------ |
| Metriche pubbliche senza Insights export |          **5+** core | ER, reach, community, TT, dest |
| Numeri ROI calculator                    |                **9** | 3 tier × reach/ER/saves        |
| Metriche case study                      |                **9** | 3×3                            |
| Press quotes senza URL                   |                **4** | rischio massimo                |
| Self-cert “metriche verificate”          |                **1** |                                |
| Claim compliance assoluti                |              **1–2** | “100% AGCM”                    |
| Claim field-verification vs placeholder  |        **sistemico** | home/map/posto                 |
| Proof URL linkabili solidi               |                **3** | Castelli/earned                |

**Totale claim quantitativi/testimoniali pubblici non verificati in codice: ~30+**  
**Item ad alto rischio (H): ~20**

---

## 5. Paradosso editoriale (strutturale)

```
Marketing:  "posti provati", "zero desk", "GPS esatte", "verificato sul campo"
Codice:     content-seed.json → isPlaceholder: true su 40/40
Runtime:    /posto/:slug → noindex se placeholder
            /esplora → preview path se solo seed
```

Label: VERIFICATO DAL CODICE — **gap di fiducia sistemico**, non un singolo string.

---

## 6. Inconsistenze metriche

| Superficie A          | Valore A | Superficie B                           | Valore B    |
| --------------------- | -------- | -------------------------------------- | ----------- |
| `site.ts` IG          | 172K     | AdminDashboard default                 | 250K+       |
| `site.ts` ER          | 6.5%     | AdminDashboard default                 | 8.5%        |
| `site.ts` ER 6.5%     |          | Case study gear                        | 9.2%        |
| Canonical BRAND_STATS |          | DiarioConversionSection hardcode 172K+ | dual source |

Label: VERIFICATO DAL CODICE.

---

## 7. Contatti / lead data (WIP)

| Campo UI Contatti                    | In state | In payload submit                 | Rischio          |
| ------------------------------------ | -------- | --------------------------------- | ---------------- |
| name, email, topic, message, website | sì       | sì (osservato)                    | L                |
| audience B2C/B2B                     | sì       | da verificare backend             | M                |
| company                              | sì       | **non nel body submit osservato** | **H** dati persi |
| budget                               | sì       | **non nel body submit osservato** | **H** dati persi |

Label: VERIFICATO DAL CODICE (client). Backend schema: IPOTESI DA VALIDARE in fase successiva.

---

## 8. Special search results

| Query                   | Esito                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **172K**                | Canonico `site.ts`; Diario DEV hardcode; audit docs citano scrape 172.497              |
| **Castelli del Ducato** | PUBLIC_PROOF_SIGNALS + CaseStudiesSection                                              |
| **Weekend Generator**   | file orfano; DiarioWeekendGenerator DEV-only; **rimosso da CinematicHomepage** (dirty) |
| **RoiCalculator**       | **montato** su Collaborazioni (untracked + import page dirty)                          |
| desk / field claims     | BRAND_PROMISE + EditorialPromise + ANTI_TARGETS                                        |
| coordinate / orari      | coords su tutti i 40 seed; hours/phone opzionali e spesso vuoti                        |

---

## 9. Rischi contenuti (priorità)

1. **CRITICO** — ROI + case metrics + press quotes su Collaborazioni senza fonti.
2. **ALTO** — placeholder seed vs claim “verificato sul campo”.
3. **ALTO** — metriche ER/reach pubbliche senza export Insights.
4. **MEDIO** — dual source follower strings.
5. **MEDIO** — Contatti B2B fields non persistiti.
6. **BASSO** — demo shop/guide se correttamente labeled e noindex.

---

## 10. Cosa NON è stato fatto in FASE 0

- Nessuno scrape IG/TT live.
- Nessun fetch URL partner Castelli.
- Nessuna query Firestore produzione.
- Nessuna rimozione o soft-edit di claim.
- Nessuna validazione legale founder.

Queste verifiche appartengono a FASE 1, 12–13, 15, 20 e 22.
