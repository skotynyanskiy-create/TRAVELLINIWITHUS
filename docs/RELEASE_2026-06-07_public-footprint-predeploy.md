---
type: release
area: delivery
status: blocked
priority: p0
owner: team
due:
related:
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
  - '[[10_Projects/PROJECT_PUBLIC_FOOTPRINT_ULTRA_IMPROVEMENT_PLAN_2026-06-07]]'
source: public footprint audit + predeploy 2026-06-07
tags:
  - release
  - delivery
  - security
  - public-footprint
---

# RELEASE_2026-06-07_public-footprint-predeploy

## Scope

Release candidate per l'aggiornamento public footprint Travelliniwithus: bio hub, media kit proof, collaborazioni, press, risorse affiliate/editoriali e hardening Firebase client config.

## Included changes

- Bio hub proprietario su `/vieni-con-noi`.
- Proof pubbliche e fonte metriche su `/media-kit`, `/collaborazioni`, `/press`.
- Tracking affiliate/editoriale separato su `/risorse`.
- Email welcome allineata alla config social.
- Counter newsletter pubblico spento finche il dato non e verificato.
- Firebase Web API key rimossa dai file correnti e spostata su `VITE_FIREBASE_API_KEY`.
- Auth provider protetto da config Firebase mancante in locale.
- Audit e ultra piano salvati in `docs/`.

## Risks

- Deploy bloccato da `audit:secrets`: leak storici GCP API key in git history.
- Produzione richiede `VITE_FIREBASE_API_KEY` impostata in env.
- Bio IG/TikTok live ancora da aggiornare da R&B.
- Metriche social ufficiali ancora da confermare con Insights.

## Checks

- [x] `npm run predeploy`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run audit:ui`
- [x] `npm run audit:firebase`
- [x] `npm run audit:stripe`
- [x] `npm run audit:revenue`
- [x] `npm run audit:agents`
- [x] `npm run audit:size`
- [x] `npm run audit:public-footprint` — 39 pass, 0 fail, 2 warning owner/GCP
- [x] `npm run audit:visual`
- [x] Browser smoke su `/`, `/vieni-con-noi`, `/media-kit`, `/collaborazioni`, `/press`, `/risorse`
- [x] Firebase Hosting preview deploy
- [x] Browser smoke live preview su `/`, `/vieni-con-noi`, `/media-kit`, `/collaborazioni`, `/press`, `/risorse`
- [ ] `npm run audit:secrets` — blocked da history leak

## Preview

- URL: https://gen-lang-client-0138696306--public-footprint-20260607-y3k31dtl.web.app
- Expires: 2026-06-14 14:49 UTC
- Channel: `public-footprint-20260607`
- Scope: non-production review only.

## Follow-up

- Ruotare/restringere Firebase Web API key in GCP.
- Impostare `VITE_FIREBASE_API_KEY` in produzione.
- Decidere history rewrite o accettazione post-rotazione.
- Aggiornare bio IG/TikTok con link proprietario.
- Inserire dati Insights reali nel media kit.
- Usare `npm run audit:public-footprint` come gate rapido prima di ogni modifica su bio hub/media kit/proof pubbliche.

## Links

- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[10_Projects/PROJECT_FIREBASE_HARDENING]]
- [[10_Projects/PROJECT_PUBLIC_FOOTPRINT_ULTRA_IMPROVEMENT_PLAN_2026-06-07]]
