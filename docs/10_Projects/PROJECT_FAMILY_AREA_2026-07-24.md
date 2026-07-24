---
type: project
area: product
status: in-progress
priority: p1
owner: team
started: 2026-07-24
related: '[[20_Decisions/DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24]] · [[BRAND_TRAVELLINI_FAMILY]]'
tags:
  - project
  - family
  - audience
  - navigation
---

# PROJECT — Area Family + sito a 3 audience (2026-07-24)

Obiettivo: strutturare il sito per tre pubblici — **Viaggiatori · Travellini Family ·
Brand/Collaborazioni** — con porta di scelta al primo accesso (ricordata) e switch a 3 in
navbar (desktop e mobile). Area Family: hub `/family`, consigli maternità/viaggio col bimbo
(`/family/consigli`), vetrina affiliate + codici (`/family/shop`). Contenuti SOLO da import
reale di `@travellinifamily`. DNA design invariato.

Piano esecutivo completo (fasi 0-7, verification, rischi): approvato in sessione 2026-07-24.

## Stato fasi

| Fase | Cosa                                                                          | Stato         |
| ---- | ----------------------------------------------------------------------------- | ------------- |
| 0    | Docs + decision superseded/nuova                                              | ✅ 2026-07-24 |
| 1    | `AudienceContext` (parità funzionale)                                         | ⏳            |
| 2    | Rotte/pagine Family (`preview`)                                               | ⏳            |
| 3    | Navbar/Footer a 3 (desktop+mobile)                                            | ⏳            |
| 4    | AudienceGate primo accesso                                                    | ⏳            |
| 5    | Import @travellinifamily + flip `live` (gate owner: diritti asset gravidanza) | ⏳            |
| 6    | Coerenza veritiera (16 immagini AI → reali, ChiSiamo)                         | ⏳            |
| 7    | llms.txt + sitemap script (+ step seoRoutes high-risk separato)               | ⏳            |

## Vincoli fissi

- Perf: il gate non deve toccare LCP home (già BLOCK a 3,05-3,48s) — deferito, tipografico,
  kill-switch `AUDIENCE_GATE_ENABLED`.
- Shop family SENZA carrello: affiliate + codici, `rel="sponsored"`, AGCOM.
- Surfaces oneste: `preview` → `live` solo con ≥8 consigli reali e ≥3 deal reali.
- `server.ts`/`seoRoutes.ts`: mai nelle fasi 1-6; step dedicato backend-engineer + conferma.
