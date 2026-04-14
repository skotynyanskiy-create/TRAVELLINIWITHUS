---
type: bug
area: engineering
status: fixed
priority: p1
owner: codex
severity: high
repo: TRAVELLINIWITHUS
route: /media-kit
repo_path: public/media-kit.pdf
blocked_by:
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: phase-a trust funnel hardening
tags:
  - bug
  - funnel
  - media-kit
  - newsletter
---

# BUG_TRUST_FUNNEL_MEDIA_KIT_AND_NEWSLETTER_PREDISPOSITION

## Sintomo

- la pagina media kit raccoglieva lead ma il PDF pubblico linkato non esisteva
- la newsletter era predisposta a Brevo ma con `listIds` hardcoded, quindi non allineata a `.env.example`

## Impatto

- promessa B2B non verificabile dopo il form media kit
- setup newsletter poco affidabile in fase pre-deploy e non coerente con il pattern "guard + env"

## Repo context

- route: `/media-kit`
- repo_path: `public/media-kit.pdf`

## Riproduzione

1. aprire `/media-kit`
2. inviare la richiesta
3. verificare il link a `/media-kit.pdf`
4. controllare che `BREVO_LIST_ID` non governasse davvero la subscription

## Fix

- aggiunto generatore `scripts/generate-media-kit.tsx`
- aggiunto documento PDF `src/pdf/MediaKitDocument.tsx`
- `npm run build` ora genera `public/media-kit.pdf` prima della build Vite
- `server.ts` usa `BREVO_LIST_ID` da env con fallback save-lead-only se mancante o invalido
- `.env.example` documenta `MEDIA_KIT_URL`
- `scripts/predeploy.mjs` verifica anche l'esistenza del PDF

## Test

- `npm run generate:media-kit`
- `npm run build`
- `npm run predeploy`

## Root cause

- il funnel media kit era stato progettato lato UI/server ma senza l'asset finale pubblicato
- la predisposizione newsletter non era stata completata fino all'uso coerente delle variabili ambiente

## Link

- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[TRAVELLINIWITHUS_MASTER_PLAN]]
