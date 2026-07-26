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

| Fase | Cosa                                                                           | Stato         |
| ---- | ------------------------------------------------------------------------------ | ------------- |
| 0    | Docs + decision superseded/nuova                                               | ✅ 2026-07-24 |
| 1    | `AudienceContext` (parità funzionale)                                          | ✅ 2026-07-24 |
| 2    | Rotte/pagine Family (`preview`)                                                | ✅ 2026-07-24 |
| 3    | Navbar/Footer a 3 (desktop+mobile)                                             | ✅ 2026-07-24 |
| 4    | AudienceGate primo accesso                                                     | ✅ 2026-07-24 |
| 5    | Import @travellinifamily → hub+consigli LIVE (8 entry reali); shop preview     | ✅ 2026-07-24 |
| 6    | Coerenza veritiera (15 immagini AI → reali, ChiSiamo)                          | ✅ 2026-07-24 |
| 7    | llms.txt + generate-sitemap (family incluse)                                   | ✅ 2026-07-24 |
| 7b   | seoRoutes.ts runtime → surfaces (HIGH-RISK: backend-engineer + conferma owner) | ⏳ aperto     |

Passi successivi consigliati: skill `cwv` sulla home mobile (validare il gate), `audit-ui`,
`/predeploy` prima del deploy; shop family a `live` quando esistono ≥3 codici reali.

## Vincoli fissi

- Perf: il gate non deve toccare LCP home (già BLOCK a 3,05-3,48s) — deferito, tipografico,
  kill-switch `AUDIENCE_GATE_ENABLED`.
- Shop family SENZA carrello: affiliate + codici, `rel="sponsored"`, AGCOM.
- Surfaces oneste: `preview` → `live` solo con ≥8 consigli reali e ≥3 deal reali.
- `server.ts`/`seoRoutes.ts`: mai nelle fasi 1-6; step dedicato backend-engineer + conferma.
