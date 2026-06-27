---
type: release
area: delivery
status: draft
priority: p1
owner: team
due:
related:
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
  - '[[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]'
source: predeploy 2026-06-03
tags:
  - release
  - delivery
  - full-mode
---

# RELEASE_2026-06-03_full-mode-predeploy

## Scope

Full-mode release candidate for Travelliniwithus: public navigation restored for discovery, shop waitlist, Club waitlist, itineraries and saved area.

## Included changes

- `VITE_LITE_MODE=false` in `.env` and `.env.example`.
- Full-mode public routes visible and smoke-tested: `/`, `/esplora`, `/shop`, `/club`, `/risorse`, `/collaborazioni`, `/media-kit`, `/contatti`, `/mappa`, `/itinerari`.
- Club copy aligned to pre-launch state: waitlist, preview, no live checkout promise.
- Shop aligned to one priority waitlist SKU.
- Resources disclose commercial link status.
- Media kit and press flows no longer push direct complete PDF download as primary CTA.
- Tests fixed: ErrorBoundary accented Italian copy; Navbar tests isolated from Firebase initialization.
- Lead magnet session unlock avoids synchronous `setState` in effect.

## Risks

- Shop and Club are public but remain pre-launch waitlist funnels.
- `audit:ui` still reports known warnings on admin/inline/raw-color patterns.
- Build warning remains for CSS class text containing `[file:line]`.
- Production env must be verified before deploy: `APP_URL`, Brevo keys/list, Sentry token if sourcemap upload is enabled, Firebase Hosting domain/SSL.

## Checks

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run audit:ui`
- [x] `npm run audit:firebase`
- [x] `npm run audit:stripe`
- [x] `npm run audit:agents`
- [x] `npm run predeploy`
- [x] Browser smoke matrix on full-mode public routes

## Follow-up

- Confirm production environment variables before deploy.
- Decide whether `/shop` should remain out of sitemap until checkout/product delivery are live.
- Keep `/itinerari` noindex/out of sitemap until real itineraries replace preview content.

## Links

- [[DEPLOYMENT_RUNBOOK]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
