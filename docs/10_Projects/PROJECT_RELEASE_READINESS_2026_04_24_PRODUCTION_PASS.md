---
type: project
area: delivery
status: open
priority: p1
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_RELEASE_READINESS]]'
source: production-ready implementation pass
tags:
  - project
  - delivery
  - release
---

# Release Readiness - Production Implementation Pass - 2026-04-24

## Completato

- [x] `npm run typecheck` pulito dopo riallineamento `ArticleType = pillar | guide | itinerary`.
- [x] Rimossi i 5 `NEW-WARN` di `audit:ui` su `GuideCategoryBrowser` e `HomeDiscoveryCards` sostituendo inline style con classi/token CSS.
- [x] `firestore.rules` riscritte in modalita custom-claim only: rimosso il fallback admin via email.
- [x] Aggiunta collection `hotels` alle rules con read pubblico solo per pubblicati e write admin.
- [x] Aggiornate le rules `articles` per i campi editoriali moderni: `type`, `description`, `verifiedAt`, `disclosureType`, `featuredPlacement`, `tripIntents`, `hotels`, `shopCta`.
- [x] `orders` non e piu scrivibile pubblicamente: create/update restano admin/server-backed.
- [x] Aggiunta collection `resources` alle rules, coerente con `fetchResources`.
- [x] `HotelDetail` marca il fallback locale come demo/noindex fino a popolamento Firestore reale.
- [x] Server CORS ristretto in produzione a `APP_URL`, `FRONTEND_URL`, `STAGING_URL` e domini pubblici Travellini.
- [x] Sitemap/RSS server-side aggiornati per usare `/guide/:slug` o `/itinerari/:slug` invece del legacy `/articolo/:slug`.
- [x] Route target `/destinazioni/:country/:slug` montata su template articolo.
- [x] Documentati `docs/FIRESTORE_SCHEMA.md` e `docs/API_CONTRACT.md`.
- [x] Rimosso `react-simple-maps` e sostituite le mappe pubbliche con SVG React interni per eliminare la catena vulnerabile `d3-color`.
- [x] Aggiunti `@types/react` e `@types/react-dom` come dipendenze dirette di sviluppo, evitando dipendenza da tipi transitivi.
- [x] Bloccati override sicuri per `quill@2.0.2` e `serialize-javascript@7.0.5`, validati con build.
- [x] Allineato il projectId Firebase reale: `.firebaserc`, `.env.example` e `firebase-applet-config.json` puntano a `gen-lang-client-0138696306`.
- [x] Script `audit:a11y` reso stabile con esecuzione seriale e timeout 60s.

## Check eseguiti

- [x] `npm run typecheck` PASS.
- [x] `npm run lint` PASS.
- [x] `npm run test` PASS: 4 file, 10 test.
- [x] `npm run build` PASS, senza warning CSS.
- [x] `npm run audit:ui` PASS: 0 errori, 0 new warnings, 23 resolved.
- [x] `npm run audit:firebase` PASS.
- [x] `npm run audit:stripe` PASS: 9 check.
- [x] `npm run audit:agents` PASS.
- [x] `npm run audit:a11y` PASS: 7 test.
- [x] `npm run audit:visual` PASS: 33 test.
- [x] `npm run e2e` PASS: 100 test.
- [x] `npm run predeploy` PASS.
- [x] `npm audit` eseguito: 0 high, restano 10 vulnerabilita moderate/low transitive Firebase Admin.

## Ancora aperto

- [ ] `npm audit` resta con moderate/low transitive da `firebase-admin` / Google SDK. Non usare `npm audit fix --force`: propone downgrade breaking a `firebase-admin@10.1.0`.
- [ ] Configurare custom claim admin reale prima di deploy rules, altrimenti il CMS risultera correttamente bloccato.
- [ ] Popolare Firestore `hotels` e validare roundtrip admin/pubblico.
- [ ] Decidere runtime API definitivo: Express separato oppure migrazione endpoint in funzioni serverless.
