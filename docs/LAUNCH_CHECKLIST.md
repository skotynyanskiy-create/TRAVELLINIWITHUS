# TRAVELLINIWITHUS — Checklist Finale di Lancio

Aggiornamento: 2026-04-20 (post Sprint 1 infrastruttura).

Questo documento riassume ciò che manca tra lo stato corrente e il lancio pubblico reale. La base tecnica, il design, la sicurezza di base, il tracciamento, il consenso GDPR e la disaster recovery sono **predisposti** e documentati. Ciò che determina il passaggio da "demo" a "business operativo" sono ormai **contenuti reali + attivazione chiavi API in sessione finale pre-deploy**.

## Stato a colpo d'occhio

| Area | Stato | Riferimento |
|------|-------|-------------|
| Architettura + build + CI | ✅ Production-ready | `docs/10_Projects/PROJECT_RELEASE_READINESS.md` |
| Admin auth multi-utente | ✅ Custom Claims documentati | [20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md](20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md) |
| Affiliate tracking | ✅ v1 attivo con consenso | `src/lib/affiliate.ts` + `src/pages/Risorse.tsx` |
| Cookie consent GDPR | ✅ Banner + pagina + riapertura | `src/components/ConsentBanner.tsx`, `src/pages/legal/Cookie.tsx` |
| Error tracking | ⚠️ Predisposto, SDK da installare pre-deploy | [20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md](20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md) |
| Disaster recovery Firestore | ⚠️ Workflow pronto, WIF da configurare pre-deploy | [DISASTER_RECOVERY_RUNBOOK.md](DISASTER_RECOVERY_RUNBOOK.md) |
| Stripe webhook prod | ⚠️ Runbook pronto, endpoint da configurare pre-deploy | [STRIPE_WEBHOOK_RUNBOOK.md](STRIPE_WEBHOOK_RUNBOOK.md) |
| Validator editoriale | ✅ Gate errori/warning in admin | `src/utils/articleValidator.ts` |
| Contenuti reali (articoli + prodotti) | ❌ Da caricare | Sezione 1 di questo documento |

## 1. Contenuti e CMS (owner)

Il sito resta in Demo Mode finché il catalogo editoriale e shop non vengono popolati.

- [ ] **Accesso admin**: login con account Google autorizzato su `/admin`.
- [ ] **Articoli reali**: pubblicare 5 articoli tra Destinazioni e Guide usando i template in `docs/90_Templates/`. Il validator blocca titoli <20 char, descrizioni fuori intervallo, contenuto <600 parole o senza heading.
- [ ] **Prodotti reali**: caricare almeno 3 prodotti (guide PDF/toolkit) in `products/` con `published: true`, `price > 0`, `downloadUrl` valido se digitale.
- [ ] **Disattivazione flag demo**: da Admin → Impostazioni, disattivare `showEditorialDemo` e `showShopDemo` quando il catalogo è pronto.
- [ ] **Checklist editoriale**: per ogni articolo seguire [13_Content/EDITORIAL_PUBLISH_CHECKLIST.md](13_Content/EDITORIAL_PUBLISH_CHECKLIST.md).

## 2. Analisi, tracking e integrazioni (pre-deploy)

Stack GA4 / Meta / TikTok già gated sul consenso. Da completare con ID reali.

- [ ] In `src/config/integrations.ts` inserire `googleAnalyticsId`, `metaPixelId`, eventuale `tiktokPixelId`.
- [ ] Verifica che i pixel carichino solo dopo consenso (test: rifiuta nel banner → nessuna chiamata di rete a `googletagmanager.com`).
- [ ] UTM affiliate: controllare dashboard GA4/Plausible → evento `affiliate_click` presente con `partner`, `campaign`, `placement`.
- [ ] Newsletter: se Brevo attivo verificare `BREVO_API_KEY` + `BREVO_LIST_ID` in env, altrimenti fallback save-lead-only rimane attivo.

## 3. Shop e pagamenti (pre-deploy)

Runbook completo: [STRIPE_WEBHOOK_RUNBOOK.md](STRIPE_WEBHOOK_RUNBOOK.md).

- [ ] Stripe account live verificato (Identity/Business).
- [ ] Endpoint webhook `https://travelliniwithus.it/api/webhook` registrato su Stripe con eventi `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`.
- [ ] Env vars `STRIPE_SECRET_KEY` (`sk_live_...`), `STRIPE_WEBHOOK_SECRET` (`whsec_...`), `VITE_STRIPE_PUBLISHABLE_KEY` (`pk_live_...`) impostate in Vercel.
- [ ] Smoke test A (test mode con card `4242 4242 4242 4242`) + smoke test B (acquisto reale minimo) + smoke test C (errore firma) eseguiti e registrati.

## 4. Legal e GDPR

- [ ] Verifica che `src/pages/legal/Privacy.tsx`, `Termini.tsx`, `Disclaimer.tsx` riportino dati corretti (email contatto, riferimenti fiscali se applicabili).
- [ ] Cookie policy (`src/pages/legal/Cookie.tsx`) già ampliata con vendor (GA4, Meta Pixel, TikTok Pixel) e disclosure affiliate. Verifica finale su nomi reali + eventuali aggiunte.
- [ ] Banner cookie: test su mobile (layout side-by-side, 158px height circa), test desktop. Riapertura da footer + pagina `/cookie` funzionante.
- [ ] Affiliate disclosure: blocco "Trasparenza affiliazioni" in `/risorse` visibile; eventuale revisione copy con consulente legale se necessario.

## 5. Sicurezza e auth

Decisione di riferimento: [20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md](20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md).

- [ ] Migrazione admin a Custom Claims completata per gli account owner (Rodrigo + Betta + eventuale backup). Verifica: `firebase auth:export` → colonna `customClaims` con `{ "admin": true }`.
- [ ] `firestore.rules` aggiornato per leggere `request.auth.token.admin == true` al posto dell'email hardcoded (vedi decision doc).
- [ ] Redeploy rules + smoke test: login con claim → accesso admin; login senza claim → accesso negato.
- [ ] Abilitare MFA su tutti gli account admin (Firebase Auth → Sign-in method → Multi-factor).

## 6. Error tracking e disaster recovery

- [ ] Eseguire attivazione Sentry seguendo [20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md](20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md) (install pacchetti + DSN env + sostituire body `initErrorTracking`/`initServerErrorTracking`).
- [ ] Configurare Workload Identity Federation per GitHub Actions (guida in [DISASTER_RECOVERY_RUNBOOK.md](DISASTER_RECOVERY_RUNBOOK.md)).
- [ ] Creare bucket GCS `travelliniwithus-firestore-backups` + service account + vars repo.
- [ ] Lanciare manualmente il workflow `Firestore weekly backup` → verificare export presente in GCS.

## 7. Deploy finale

- [ ] `npm run audit:quality` verde.
- [ ] `npm run build` locale verde.
- [ ] Deploy su Vercel (o provider scelto) con tutte le env vars popolate.
- [ ] Smoke test produzione: home, articolo reale, checkout test, form newsletter, admin login, banner cookie.
- [ ] Aggiornare [10_Projects/PROJECT_RELEASE_READINESS.md](10_Projects/PROJECT_RELEASE_READINESS.md) marcando "revisione umana finale" completata.

---

## Verifiche di qualità (già completate)

- [x] SEO: meta dinamici, OpenGraph, JSON-LD `TravelAgency`, `Article`, `BreadcrumbList`, `FAQPage`, `TouristDestination`, `TouristTrip`, `Review`.
- [x] Performance: lazy loading, OptimizedImage con srcSet, manual chunks Vite.
- [x] Navigazione: link luoghi/esperienze/guide verificati in audit 2026-04-17.
- [x] Mobile: audit Playwright 375px senza overflow orizzontale.
- [x] Consent: banner GDPR con categorie granulari + riapertura da pagina Cookie e footer.
- [x] Affiliate: UTM idempotenti + evento `affiliate_click` gated su consenso analytics.
- [x] Validator: gate qualità pre-publish in admin.

**Creato il**: 15 aprile 2026  
**Ultimo aggiornamento**: 20 aprile 2026  
**Stato**: INFRASTRUCTURE PRONTA · CONTENUTI + ATTIVAZIONE CHIAVI IN SESSIONE FINALE  
**Prossimo passo owner**: caricare il primo articolo reale usando [13_Content/EDITORIAL_PUBLISH_CHECKLIST.md](13_Content/EDITORIAL_PUBLISH_CHECKLIST.md).
