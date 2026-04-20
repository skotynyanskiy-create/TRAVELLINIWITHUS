# Changelog

Tutti i cambiamenti notabili a Travelliniwithus sono documentati qui.
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [SemVer](https://semver.org/spec/v2.0.0.html) — fino al primo tag di release il progetto è in `0.x`.

## [Unreleased]

### Sprint 1 — 2026-04-20 · Infrastruttura production-gate

Obiettivo: chiudere tutti i gap non dipendenti da contenuto reale prima della sessione finale con chiavi API. Riferimento roadmap SWOT: `C:/Users/admin/.claude/plans/sei-un-principal-ai-dreamy-penguin.md`.

#### Aggiunto

- **Admin auth via Firebase Custom Claims** (`docs/20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md`): decisione architetturale, script `setAdminClaim`, template `firestore.rules` aggiornate per `request.auth.token.admin == true`, procedura migrazione owner + MFA.
- **Affiliate tracking v1** (`src/lib/affiliate.ts`, `src/pages/Risorse.tsx`, `src/components/AffiliateBox.tsx`):
  - `AFFILIATE_PARTNERS` registry con flag `disclosure` per ogni vendor.
  - `prepareAffiliateLink(partner, url, meta)` con UTM injection idempotente.
  - `trackAffiliateClick` gated su `canLoad('analytics')` → evento `affiliate_click` con `partner`, `campaign`, `placement`, `label`.
  - Migrazione completa grid Risorse + CTA Heymondo + copy Airalo.
  - Nuovo campo opzionale `partner` su `Resource` interface lato Firestore.
- **Editorial infrastructure**:
  - `src/utils/articleValidator.ts` — validator con regole titolo 20–75, slug kebab, descrizione 80–170, ≥600 parole, ≥3 heading, cover obbligatoria; errori bloccano publish, warning confermano.
  - Integrazione in `src/pages/admin/ArticleEditor.tsx` su `handleSave` quando `published === true`.
  - `docs/13_Content/EDITORIAL_PUBLISH_CHECKLIST.md` — checklist operativa per autori.
- **Schema.org travel esteso** (`src/components/SEO.tsx`):
  - `Article` esteso con `articleSection`, `keywords`, `wordCount`, `about`.
  - Nuovi builder `TouristDestination`, `TouristTrip` (con `subTrip` multi-stop + `geo`), `Review`.
  - Nuovi prop SEO: `destination`, `itinerary`, `review`.
- **Error tracking predisposto** (attivazione SDK in sessione finale):
  - `src/lib/errorTracking.ts` — `initErrorTracking`, `captureException`, `captureMessage`, hook `window.Sentry`.
  - `src/components/ErrorBoundary.tsx` → `onError` inoltra al tracker.
  - `src/lib/serverErrorTracking.ts` — init + capture server-side.
  - `server.ts` → middleware Express error + `unhandledRejection` + `uncaughtException`.
  - Runbook attivazione completo in `docs/20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md`.
- **Disaster recovery Firestore**:
  - Workflow `.github/workflows/firestore-backup.yml` (cron `0 3 * * 0` + `workflow_dispatch`), OIDC Workload Identity Federation, export su GCS.
  - `docs/DISASTER_RECOVERY_RUNBOOK.md` — RPO ≤7d, RTO ≤4h; setup bucket con lifecycle 30 giorni; scenari restore (corruzione parziale, perdita totale, rollback selettivo); monitoraggio e test trimestrale.
- **Runbook Stripe webhook production**: `docs/STRIPE_WEBHOOK_RUNBOOK.md` — setup endpoint, env vars, smoke test A (test mode `4242`) / B (live mode pagamento reale minimo) / C (error handling firma), procedure incidente (ordine mancante, duplicati, signature failure).
- **Consent banner riaperibile**:
  - `src/lib/consent.ts` → `openConsentPreferences()` + `onConsentReopenRequest(handler)` via CustomEvent `tw:consent-reopen`.
  - `src/components/ConsentBanner.tsx` ascolta l'evento e riapre in modalità `customize`.
  - `src/pages/legal/Cookie.tsx` espone pulsante "Apri preferenze cookie" in evidenza + disclosure vendor specifici (GA4, Meta Pixel, TikTok Pixel) e partner affiliate (Booking, Heymondo, Skyscanner, GetYourGuide, Airalo, Amazon).

#### Modificato

- `src/services/firebaseService.ts` — `Resource` estesa con `partner?: string` per tracking affiliate da CMS.
- `src/main.tsx` — `initErrorTracking()` prima di `createRoot`.
- `src/pages/Risorse.tsx` — Airalo copy button ora traccia anche `trackAffiliateClick` con `partner: 'airalo'`; Heymondo Button ora usa `heymondoCta.href/onClick`.
- `docs/LAUNCH_CHECKLIST.md` — riscritto post Sprint 1: tabella stato area, cross-link a runbook, separazione "contenuti reali" vs "attivazione chiavi".
- `docs/10_Projects/PROJECT_RELEASE_READINESS.md` — sezione Sprint 1 aggiunta con completato/aperto.
- `docs/DEPLOYMENT_RUNBOOK.md` — rifresh completo: cross-link runbook, env vars aggiornate (Sentry, Brevo, pixel, Mapbox), sezione runbook correlati, sezione next steps per sessione finale.

#### Governance (da [Unreleased] precedente)

- Governance GitHub: pull request template, issue template (bug/feature), CODEOWNERS, Dependabot (npm + github-actions).
- `.gitattributes` con normalizzazione LF cross-platform.
- Questo `CHANGELOG.md` root.
- Pulizia vault `docs/`: rimosso canvas Obsidian vuoto.
- Archivio memorie Claude Code legacy pre-aprile 2026.

## [0.1.0] — 2026-04-17 (pre-release)

Stato: `PRE-PRODUCTION` — dettagli in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.

### Baseline

- Stack: React 19 · TypeScript · Vite 6 · Tailwind 4 · Express · Firebase/Firestore · Stripe · Vitest · Playwright · PWA.
- Pagine pubbliche: home, destinazioni, articolo, guide, esperienze, mappa, shop, prodotto, media kit, collaborazioni, club, contatti, legali.
- Admin: dashboard, article editor, product editor, site content editor, users, orders.
- Audit script: `audit:ui`, `audit:firebase`, `audit:stripe`, `audit:agents`, `audit:visual`, `audit:quality`, `predeploy`.
- CI GitHub Actions: typecheck, lint, test, build, audit:ui, audit:firebase, audit:stripe.

[Unreleased]: https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS/releases/tag/v0.1.0
