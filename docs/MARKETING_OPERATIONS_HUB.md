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

| Funnel                      | Pre                     | Post (2026-05-14)                 | Attivo a regime                    |
| --------------------------- | ----------------------- | --------------------------------- | ---------------------------------- |
| BOFU GA4 + Meta tracking    | cieco                   | wired                             | dopo setup `RESEND_API_KEY`        |
| Lead capture B2B            | tracking 0              | tracking + fallback localStorage  | live                               |
| Welcome email automatica    | assente                 | template + trigger Resend         | dopo setup `RESEND_API_KEY`        |
| Order confirmation email    | assente                 | template + trigger webhook        | dopo setup Stripe live             |
| Lead magnet PDF             | inesistente             | 12 pagine A4 generato (23 KB)     | dopo compilazione 10 luoghi R+B    |
| Landing bio IG/TikTok       | inesistente             | `/vieni-con-noi` standalone + UTM | dopo aggiornamento bio R+B         |
| Content calendar            | inesistente             | 8 slot mensili documentati        | dopo compilazione destinazioni R+B |
| Partner pipeline            | vuota                   | 5 categorie + outreach template   | dopo shortlist nomi R+B            |
| Posizionamento couple-led   | non dichiarato sul sito | hero + caption + paragraph        | live                               |
| Schema Person Rodrigo+Betta | assente                 | dedicato in `/chi-siamo`          | live (Google indexer entro 7gg)    |

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
- [[13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO]] — outline 1500 parole + schema
- [[13_Content/LEAD_MAGNET_POSTI_ITALIANI]] — outline 10 luoghi + tone
- [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]] — 5 categorie + outreach

## Main project links

- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
- [[10_Projects/PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]
- [[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
