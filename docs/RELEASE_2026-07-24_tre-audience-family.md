---
type: release
area: delivery
status: published
priority: p1
owner: team
related: '[[10_Projects/PROJECT_FAMILY_AREA_2026-07-24]] · [[20_Decisions/DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24]] · [[10_Projects/PROJECT_RELEASE_READINESS]]'
source: gate S6 2026-07-24
tags:
  - release
  - delivery
  - family
  - audience
---

# RELEASE_2026-07-24_tre-audience-family

Primo deploy dopo il 2026-05-14. URL: https://gen-lang-client-0138696306.web.app

## Scope

Sito a 3 pubblici (Viaggiatori · Travellini Family · Brand/Collaborazioni) +
contenuti reali importati dai profili IG del brand + coerenza imagery-truth.

## Included changes

- **Contenuti reali**: 62 posti in seed di cui 29 reali con cover ufficiali
  (2 tranche di import reel via yt-dlp), 34 reel nel carosello home, 63 pin
  geocodati su /mappa; de-dup della home (via il triplo Burton).
- **Audience layer**: `AudienceContext` a 3 (migrazione da travellini_nav_mode),
  `AudienceGate` al primo accesso (deferito, zero impatto LCP/CLS verificato),
  switcher a 3 in navbar desktop E drawer mobile, menu/CTA per audience.
- **Travellini Family**: `/family` (hub), `/family/consigli` (LIVE, 8 momenti/
  consigli reali da @travellinifamily con disclosure AGCOM), `/family/shop`
  (preview onesta finché non esistono ≥3 codici reali).
- **Imagery truth**: le ultime 15 immagini AI della coppia sostituite con foto
  reali (couple-real Warner Bros, cover reali dei posti, texture craft).
- **Fix da gate S6**: `/family*` 404 server-side (allowlist `server.ts`, edit
  manuale owner), bug PWA `navigateFallback` (il SW serviva "Sei offline" su
  ogni hard-nav non-home dai visitatori di ritorno — preesistente dal
  2026-05-13), priority LCP sulla prima card family, 2 test fix, frontmatter
  vault.
- **SEO/AI**: /family in sitemap + Lighthouse CI, llms.txt con Family come
  sub-brand.

## Risks

- Firebase Web API key: restrizioni referrer/API su console GCP ancora in capo
  all'owner ([[10_Projects/PROJECT_FIREBASE_HARDENING]]) — nota pre-deploy
  accettata dall'owner col lancio di /deploy.
- Offline page reale assente (il fallback ora è l'app shell): backlog
  catchHandler/injectManifest nell'handoff perf.
- Perf non-home con Firestore live (gap metodologico LHCI `?twu_audit=1`):
  indagine bundle nel backlog.

## Checks

- [x] build (4602 moduli, PWA precache 102 entry)
- [x] predeploy sweep: tutto PASS (obsidian sbloccato in sessione)
- [x] gate S6: quality + security + perf + browser tutti verdi
- [x] smoke test live: `/`, `/family`, `/family/consigli`, `/esplora`,
      `/collaborazioni` → 200; home con AudienceGate visibile; console pulita
