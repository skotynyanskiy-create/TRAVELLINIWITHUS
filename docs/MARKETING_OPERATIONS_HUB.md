---
type: hub
area: marketing
status: active
cssclasses:
  - dashboard
tags:
  - marketing
  - hub
---

# Marketing Operations Hub

## Brand snapshot

- profilo Instagram: [travelliniwithus](https://www.instagram.com/travelliniwithus/?hl=it)
- sito: [travelliniwithus.it](https://www.travelliniwithus.it/)
- riferimento pubblico rapido: [[BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS]]
- **dossier presenza online (iper-analisi 2026-07-23):** [[13_Content/DOSSIER_PRESENZA_ONLINE_TRAVELLINIWITHUS_2026-07-23]]
- audit IG contenuti: [[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]
- **sub-brand family (parte del progetto):** [[BRAND_TRAVELLINI_FAMILY]] · [@travellinifamily](https://www.instagram.com/travellinifamily/)
- **MOC brand (mappa unica):** [[BRAND_KNOWLEDGE_MOC]]
- **Decision Family boundary (superseded):** [[20_Decisions/DECISION_TRAVELLINI_FAMILY_BOUNDARY_2026-07-23]]
- **Area Family pubblica approvata (2026-07-24):** [[20_Decisions/DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24]] · piano [[10_Projects/PROJECT_FAMILY_AREA_2026-07-24]] · funnel bio @travellinifamily → `/family`
- **Vault + Graphify ops:** [[VAULT_AND_GRAPHIFY_OPERATING_STATE]]

## Campaigns

![[95_Bases/Campaign_Pipeline.base#Active Campaigns]]

## Partnerships

![[95_Bases/Partnership_Pipeline.base#Partner Pipeline]]

## Content pipeline

![[95_Bases/Content_Pipeline.base#Content Pipeline]]

## H2 2026 — ultra-piano marketing/growth

Implementazione tecnica completa al 2026-05-14. Sintesi in
[[10_Projects/PROJECT_RELEASE_READINESS#Snapshot H2 2026 — Ultra-piano marketing/growth (2026-05-14)]].

**Stato funnel (post-implementazione)**:

| Funnel                      | Pre                     | Post (2026-05-14)                | Attivo a regime                    |
| --------------------------- | ----------------------- | -------------------------------- | ---------------------------------- |
| BOFU GA4 + Meta tracking    | cieco                   | wired                            | dopo setup `RESEND_API_KEY`        |
| Lead capture B2B            | tracking 0              | tracking + fallback localStorage | live                               |
| Welcome email automatica    | assente                 | template + trigger Resend        | dopo setup `RESEND_API_KEY`        |
| Order confirmation email    | assente                 | template + trigger webhook       | dopo setup Stripe live             |
| Lead magnet PDF             | inesistente             | 12 pagine A4 generato (23 KB)    | dopo compilazione 10 luoghi R+B    |
| Landing bio IG/TikTok       | hub pronto              | `/guida-in-regalo` + UTM (unica) | dopo aggiornamento bio R+B         |
| Content calendar            | inesistente             | 8 slot mensili documentati       | dopo compilazione destinazioni R+B |
| Partner pipeline            | vuota                   | 5 categorie + outreach template  | dopo shortlist nomi R+B            |
| Posizionamento couple-led   | non dichiarato sul sito | hero + caption + paragraph       | live                               |
| Schema Person Rodrigo+Betta | assente                 | dedicato in `/chi-siamo`         | live (Google indexer entro 7gg)    |

## Setup minimo per attivazione (R+B)

`.env.production` deve avere:

```
RESEND_API_KEY=re_...
BREVO_API_KEY=xkeysib_...
BREVO_LIST_ID=...
MAIL_FROM="Travelliniwithus <hello@travelliniwithus.it>"
MAIL_TO_OWNER=hello@travelliniwithus.it
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_GA_ID=G-...
VITE_META_PIXEL_ID=...
VITE_TIKTOK_PIXEL_ID=...
VITE_MAPBOX_TOKEN=pk.ey...
LEAD_MAGNET_URL=https://travelliniwithus.it/lead-magnet-posti-italiani.pdf
```

Workflow di pubblicazione contenuti (mensile, ~6h R+B):

- settimana 1 → stesura articolo pillar (riferimento outline in [[13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO]])
- settimana 2 → pubblicazione articolo + reel #1 + stories serie
- settimana 3 → reel #2 + newsletter mensile
- settimana 4 → preparazione mese successivo

Workflow outreach partner (Q3 2026, ~1h R+B/settimana):

- riferimento template in [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
- target 5 proposte entro 2026-09-30
- aggiornare 1 nota partner/settimana in `docs/12_Partnerships/[nome].md`

## Content + partnership docs (H2 2026)

- [[13_Content/CONTENT_CALENDAR_H2_2026]] — 8 slot mensili luglio→febbraio
- [[13_Content/CONTENT_PROOF_LIBRARY_TRAVELLINIWITHUS]] — intake top 20 contenuti social e schede proof proprietarie
- [[13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO]] — outline 1500 parole + schema
- [[13_Content/LEAD_MAGNET_POSTI_ITALIANI]] — outline 10 luoghi + tone
- [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]] — 5 categorie + outreach
- [[12_Partnerships/CASE_STUDY_EMILIA_FANTASTICA_CASTELLI_DUCATO]] — proof draft basato su fonti pubbliche
- [[20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07]] — fonte unica metriche pubbliche

## Activation gate (May → Jun 2026)

Tre check da spuntare prima che il funnel sia considerato live (post audit
avanzato 2026-05-15). Vedere [[R_B_ACTIONS_FOR_PREMIUM_READY]] per dettagli
operativi step-by-step.

- [ ] **Affiliate signup completi**: Skyscanner BFCA + Booking BFCA + Airalo + Revolut (effort R+B ~90 min)
- [ ] **PDF lead magnet compilato con 10 luoghi reali** + `RESEND_API_KEY` + `BREVO_API_KEY` attivi in `.env.production` + test end-to-end (welcome email arriva, PDF link 200) (effort R+B ~5h tra contenuti + setup)
- [ ] **Bio IG + TikTok aggiornate** con link `travelliniwithus.it/guida-in-regalo?utm_source=ig_bio|tt_bio` (solo dopo go-live stabile; effort R+B 15 min)

## Public footprint sprint — 2026-06-07

Implementazione da audit pubblico:

- `src/config/site.ts` ora contiene bio link proprietari, fonte metriche datata e proof pubbliche.
- `/guida-in-regalo` è l’unica landing lead/bio hub; `/vieni-con-noi` non esiste più come route.
- `/media-kit`, `/collaborazioni` e `/press` dichiarano fonte dei numeri e mostrano proof pubbliche linkate.
- `/risorse` separa click affiliati da click editoriali e usa `rel="sponsored"` solo sui link commerciali.
- email welcome newsletter usa i dati social dalla config, non numeri hard-coded.

Blocchi owner:

- confermare dati Insights ufficiali;
- aggiornare bio IG/TikTok live;
- fornire top 20 reel/post e metriche;
- autorizzare case study Emilia-Fantastica / Castelli del Ducato.

## Canali di relazione — regola di priorità (2026-07-15)

Il brand ha già una community Telegram attiva (link in bio IG/TikTok, non
ancora esposta sul sito). Decisione da [[50_Scratch/TOOLS_INTEGRATIONS_STRATEGY_2026-07-15]]:
**Telegram: disabilitato per ora** (decisione owner 2026-07-23). Non esporre
URL né CTA Telegram sul sito finché non riattivato esplicitamente.
Newsletter resta l'unica conversione di relazione primaria.

## Quality bar partner outreach

Una sola regola hard prima del primo outreach reale:

> Deve esistere almeno 1 case study (anche micro) o screenshot dashboard
> creator (IG insights / TikTok analytics) salvato in repo privato come
> prova.

Senza, l'outreach va rimandato — la reply rate sui partner B2B sconta -20/-40%
se "i numeri" non sono documentati. Salvare screenshot in `docs/12_Partnerships/proof/`
(cartella gitignored).

Inoltre rispettare la regola **1 partner content ogni 4 contenuti editoriali**
per non diluire la credibilità del progetto.

## Revenue surface — stato wired vs attivo

| Surface                  | Wired                                          | Attivo                                   | Primo € atteso                            |
| ------------------------ | ---------------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| Newsletter / lead magnet | sì                                             | no (Resend missing)                      | post activation gate                      |
| Partner pipeline B2B     | sì                                             | no (0 outreach inviati)                  | Q3 2026                                   |
| Affiliate stack          | parziale (2/6 attivi: Heymondo + GetYourGuide) | parziale                                 | entro 30gg se signup completati           |
| Shop digitale            | sì                                             | no (cart disabled, preorder-first 1 SKU) | 60-90gg se waitlist ≥ 20                  |
| MediaKit B2B             | sì                                             | sì (form attivo)                         | quando arriva prima richiesta qualificata |

## Decision log Shop

**2026-05-15** — Decisione preorder-first: lo shop viene lanciato in produzione
solo con 1 sola SKU MVP (ipotesi: "Roadtrip in Puglia" 19,90€ o "Fuga in Trentino
3 giorni spa & relax" 14,90€), in modalità waitlist. Stripe live non viene
abilitato finché non ci sono ≥ 20 nominativi confermati in lista d'attesa che
hanno espresso intent reale (CTA "iscriviti alla lista" in pagina prodotto).
Motivazione: ridurre rischio post-vendita (Rodrigo & Betta non hanno banda per
supporto multi-SKU) e validare prezzo prima dell'investimento contenuti reali.

## Main project links

- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
- [[10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026]]
- [[10_Projects/PROJECT_PUBLIC_FOOTPRINT_ULTRA_IMPROVEMENT_PLAN_2026-06-07]]
- [[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]
- [[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[R_B_ACTIONS_FOR_PREMIUM_READY]]
