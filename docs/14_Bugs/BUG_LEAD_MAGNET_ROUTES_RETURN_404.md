---
type: bug
area: seo
status: done
priority: p1
owner: team
severity: high
repo: TRAVELLINIWITHUS
route:
  - /vieni-con-noi
  - /lead-magnet
  - /iscrivi
related:
  - [[10_Projects/PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15]]
  - [[10_Projects/PROJECT_RELEASE_READINESS]]
source: advanced full site audit 2026-05-15
tags:
  - bug
  - seo
  - routing
  - lead-magnet
---

# BUG - Lead magnet routes return 404

## Sintomo

Le route `/vieni-con-noi` e `/lead-magnet` renderizzano correttamente nella SPA, con title e H1 corretti, ma la risposta HTTP iniziale del server e' 404.

## Impatto

- Campagne bio Instagram/TikTok possono puntare a URL che crawler e tool vedono come 404.
- SEO e social preview degradati.
- Tracking campagne e funnel lead magnet meno affidabili.
- `deploy` non dovrebbe considerare completo un funnel se la route diretta non torna 200.

## Repo context

- route: `/vieni-con-noi`, `/lead-magnet`, redirect `/iscrivi`
- repo_path: `src/App.tsx`, `server.ts`, sitemap route generation
- high-risk: `server.ts`

## Riproduzione

1. Avviare `npm run dev`.
2. Aprire `http://localhost:3000/vieni-con-noi`.
3. Verificare H1 `Pochi posti, raccontati bene.`.
4. Controllare response status: 404.
5. Ripetere su `/lead-magnet`.

## Fix

- Aggiungere `/vieni-con-noi`, `/lead-magnet` e `/iscrivi` alla lista server-side delle SPA static routes.
- Aggiornare sitemap/staticRoutes se manca la rappresentazione corretta.
- Verificare che `/iscrivi` faccia redirect/serve status coerente con la strategia scelta.

## Test

- `npm run typecheck`
- `npm run build`
- Browser check su `/vieni-con-noi`, `/lead-magnet`, `/iscrivi`
- Verificare HTTP 200 o redirect 3xx intenzionale, mai 404.

## Root cause

La SPA conosce le route, ma il server non le tratta come route applicative valide per fallback 200.

## Fix 2026-05-15

- Aggiunte `/vieni-con-noi`, `/lead-magnet` e `/iscrivi` a `STATIC_APP_ROUTES` in `server.ts`.
- Aggiunta `/vieni-con-noi` alla sitemap server-side.
- Verifica locale: `/vieni-con-noi`, `/lead-magnet`, `/iscrivi`, `/shop`, `/destinazioni`, `/mappa` rispondono HTTP 200 sul server aggiornato.
