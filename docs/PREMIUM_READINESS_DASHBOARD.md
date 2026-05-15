---
type: dashboard
area: release
status: active
created: 2026-05-15
updated: 2026-05-15
tags:
  - dashboard
  - premium-readiness
  - release
  - quality
---

# Premium Readiness Dashboard

Dashboard operativa per portare Travelliniwithus a standard premium completo.

## Stato sintetico

| Area                       |                          Stato | Note                                                                                                  |
| -------------------------- | -----------------------------: | ----------------------------------------------------------------------------------------------------- |
| Routing pubblico           |                          fixed | `/vieni-con-noi`, `/lead-magnet`, `/iscrivi` rispondono 200.                                          |
| Broken images              |                          fixed | Sweep browser su route critiche: 0 immagini rotte.                                                    |
| Stripe audit               |                          fixed | `npm run audit:stripe` PASS.                                                                          |
| Firestore orders           | fixed-pending-integration-test | Create pubblica bloccata; `audit:revenue` verifica contratto server-side.                             |
| Stripe webhook idempotenza | fixed-pending-integration-test | Idempotente su `stripeSessionId`; `audit:revenue` PASS, serve replay Stripe CLI reale.                |
| UI/a11y quick wins         |                    in-progress | Nav focus dropdown, MediaKit form shared components, ProductCard touch/focus, partner CTA above fold. |
| QA e2e/visual              |                          fixed | 15/15 Playwright chromium mirato + `audit:visual` 12/12 desktop/mobile.                               |
| CWV/size budget            |                        partial | `audit:size` configurato e PASS; `audit:cwv` resta da stabilizzare.                                   |
| Asset reali R+B            |                           open | Attesi entro 7 giorni.                                                                                |
| Lead magnet reale          |                editorial-ready | 10 luoghi reali inseriti e PDF rigenerato; serve revisione/approvazione R+B prima della bio.          |
| Pillar Salento             |                           open | Outline pronto, articolo reale da pubblicare.                                                         |

## Gate premium

- [x] Route funnel senza 404.
- [x] Demo images locali e non rotte.
- [x] `typecheck`, `lint`, `test`, `build`, `audit:ui`, `audit:firebase`, `audit:stripe`, `audit:agents`.
- [x] Playwright mirato home/shop/visual.
- [x] `audit:visual` completo desktop/mobile.
- [x] `audit:a11y` automatico su home, collaborazioni, media kit, chi siamo.
- [ ] Stripe CLI webhook replay test.
- [ ] Firestore emulator rule test su `orders`.
- [ ] `audit:cwv` stabile.
- [x] `audit:size` configurato.
- [ ] Asset reali R+B caricati.
- [x] Lead magnet reale con 10 luoghi.
- [ ] Pillar Salento pubblicato.

## Ultimo avanzamento - 2026-05-15

- Homepage: aggiunto blocco partner sopra la prima sezione discovery, con tracking `partner_cta_click`.
- Placeholder pubblici: rimossi fallback Unsplash da reel, CoupleIntro e Collaborazioni; newsletter non simula più un archivio storico.
- Analytics funnel: aggiunti `lead_magnet_signup`, `lead_magnet_download` arricchito, `media_kit_submit`, `partner_cta_click`, `product_view`, `checkout_intent`.
- Lead magnet: sostituiti placeholder con 10 luoghi italiani reali e PDF rigenerato.
- QA: `npm run typecheck`, `npm run build`, `npm run audit:revenue`, `npm run audit:size` PASS.

## Link

- [[10_Projects/PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[14_Bugs/BUG_LEAD_MAGNET_ROUTES_RETURN_404]]
- [[14_Bugs/BUG_DEMO_UNSPLASH_IMAGES_BROKEN]]
- [[14_Bugs/BUG_FIRESTORE_PUBLIC_ORDER_CREATION]]
- [[14_Bugs/BUG_STRIPE_WEBHOOK_ORDER_IDEMPOTENCY]]
- [[14_Bugs/BUG_QA_TEST_SUITE_STALE]]
