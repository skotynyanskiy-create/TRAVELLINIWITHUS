# TRAVELLINIWITHUS — Deployment & Operations Runbook

**Status**: 🟡 PRE-PRODUCTION — infrastruttura Sprint 1 completa, attivazione chiavi e contenuti reali pendenti
**Last Updated**: 2026-04-22

---

## 0. Runbook correlati

Questa guida è il punto d'ingresso. Dettaglio operativo nelle runbook dedicate:

- [STRIPE_WEBHOOK_RUNBOOK.md](STRIPE_WEBHOOK_RUNBOOK.md) — configurazione endpoint Stripe live + smoke test A/B/C + incident response.
- [DISASTER_RECOVERY_RUNBOOK.md](DISASTER_RECOVERY_RUNBOOK.md) — backup Firestore automatico (GitHub Actions + GCS + OIDC), scenari restore, RPO/RTO.
- [20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md](20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md) — migrazione da email hardcoded a Firebase Custom Claims.
- [20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md](20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md) — attivazione Sentry (client + server) in sessione finale.
- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) — checklist pre-lancio aggiornata post Sprint 1.
- [10_Projects/PROJECT_RELEASE_READINESS.md](10_Projects/PROJECT_RELEASE_READINESS.md) — stato dettagliato release.

---

## 1. PRE-DEPLOYMENT CHECKLIST

### Environment variables richieste

```bash
# --- Firebase client bootstrap ---
# Il client e il server leggono il web config da `firebase-applet-config.json`.
# Verifica che il file presente nel deploy punti al progetto Firebase corretto.
# Variabile opzionale utile agli script admin/CI:
FIREBASE_PROJECT_ID=travelliniwithus

# --- Payments (Stripe) — vedi STRIPE_WEBHOOK_RUNBOOK.md ---
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# --- AI / content ---
GEMINI_API_KEY=

# --- Mail ---
RESEND_API_KEY=
MAIL_FROM="Travelliniwithus <hello@travelliniwithus.it>"
MAIL_TO_OWNER=hello@travelliniwithus.it

# --- Newsletter ---
BREVO_API_KEY=
BREVO_LIST_ID=

# --- Analytics / pixel (gated dal consenso) ---
VITE_GA_ID=G-XXXXXXX
VITE_META_PIXEL_ID=
VITE_TIKTOK_PIXEL_ID=

# --- Mappa ---
VITE_MAPBOX_TOKEN=pk.

# --- Error tracking (vedi DECISION_ERROR_TRACKING_STRATEGY) ---
VITE_SENTRY_DSN=
SENTRY_DSN=
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=

# --- Server ---
PORT=3000
APP_URL=https://travelliniwithus.it
NODE_ENV=production
ALLOW_MOCK_CHECKOUT=false
```

### Security checks

- [ ] `firestore.rules` deployati con `isAdmin()` basata su Custom Claims (no email hardcoded) — vedi [DECISION_ADMIN_CUSTOM_CLAIMS](20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md).
- [ ] Stripe webhook secret verificato (runbook dedicato).
- [ ] MFA attivo su tutti gli account admin.
- [ ] `.env*` non committati; secrets in Vercel env (Production + Preview distinti).
- [ ] `firebase-applet-config.json` nel deploy punta al progetto Firebase reale corretto.
- [ ] CORS `app.use(cors())` ok per API pubbliche; se si introducono endpoint sensibili, restringere per origin.
- [ ] HTTPS enforced (Vercel default).
- [ ] Firestore export settimanale verde (`firestore-backup` GitHub Action).

### Content checks

- [ ] Almeno 5 articoli con `published: true`.
- [ ] Almeno 3 prodotti con `published: true`, `price > 0`, `downloadUrl` se digitale.
- [ ] Flag `showEditorialDemo` e `showShopDemo` disattivati nell'admin `/admin/site-content`.
- [ ] OG image default aggiornata (1200×630) se brand asset rivisti.
- [ ] Sitemap rigenerata (`npm run predeploy` esegue `generate-sitemap.js`).

### Functional tests

- [ ] Home → Lighthouse > 80 (LCP, CLS, INP nel verde).
- [ ] Rendering articolo reale con JSON-LD Article + breadcrumb + eventuale FAQ.
- [ ] Flow shop → add to cart → checkout Stripe live (smoke test B in runbook).
- [ ] Newsletter signup → record in Firestore `leads` + sync Brevo se configurato.
- [ ] Contact form `/contatti` → email `MAIL_TO_OWNER`.
- [ ] Login admin con Custom Claims → dashboard accessibile.
- [ ] Banner cookie: accetta, rifiuta, personalizza; riapertura da footer e `/cookie`.
- [ ] Click affiliate in `/risorse` → evento `affiliate_click` in GA4 DebugView.

---

## 2. DEPLOYMENT STEPS

### Vercel (raccomandato)

```bash
# 1. Collega il repo GitHub al progetto Vercel (una tantum)
vercel link

# 2. Popola le env vars tramite UI Vercel (Production + Preview)
#    Usa la lista in sezione 1 come base.

# 3. Trigger deploy
vercel --prod

# 4. Smoke test
curl -I https://travelliniwithus.it
curl https://travelliniwithus.it/api/health
curl https://travelliniwithus.it/sitemap.xml | head
```

### Firebase Hosting (alternativa)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

### Self-hosted Node (fallback)

```bash
npm run build
scp -r dist/* user@server:/app/public/
scp server.ts user@server:/app/
ssh user@server "cd /app && npm ci --production && pm2 start server.ts --name travelliniwithus"
```

---

## 3. POST-DEPLOYMENT MONITORING

### Health checks

```bash
curl https://travelliniwithus.it/api/health
curl https://travelliniwithus.it/sitemap.xml
curl -I https://travelliniwithus.it
```

### Observability stack

- [ ] GA4: verifica eventi `page_view`, `affiliate_click`, `newsletter_subscribe`, `checkout_started` in DebugView (prime 24h).
- [ ] Search Console: proprietà verificata + sitemap submitted.
- [ ] Sentry: prima exception test ricevuta (attivazione per [DECISION_ERROR_TRACKING_STRATEGY](20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md)).
- [ ] Stripe Dashboard: alert email se delivery webhook fallisce > 3 volte (runbook Stripe §Monitoraggio).
- [ ] GitHub Actions: workflow `Firestore weekly backup` verde (check lunedì mattina).

### Performance

- Lighthouse CI non ancora configurato — post Sprint 1.
- Core Web Vitals monitorati via GA4 > Engagement > Events.
- Stripe API latency: Dashboard > Developers > Events.

---

## 4. COMMON ISSUES & SOLUTIONS

### Stripe checkout 503

`STRIPE_SECRET_KEY` mancante → server.ts risponde 503 per design. Fix: popola env var e redeploy. Verifica: `curl -X POST /api/checkout` con body valido → non più 503.

### Webhook signature verification failed

Vedi [STRIPE_WEBHOOK_RUNBOOK.md §Procedura incidente](STRIPE_WEBHOOK_RUNBOOK.md).

### Admin login OK ma dashboard 403

Custom claim mancante. Esegui script `setAdminClaim` documentato in [DECISION_ADMIN_CUSTOM_CLAIMS.md](20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md), quindi l'utente deve fare logout/login per refresh token.

### Newsletter signup silent fail

`BREVO_API_KEY` o `BREVO_LIST_ID` mancante → fallback save-lead-only. Verifica Firestore `leads/` per conferma, poi configura Brevo e redeploy.

### Products non visibili

- `published: false`?
- Shop in demo mode? Disattiva flag `showShopDemo`.

### Error tracking vuoto

Sentry SDK non installato. Segui [DECISION_ERROR_TRACKING_STRATEGY.md](20_Decisions/DECISION_ERROR_TRACKING_STRATEGY.md) sezione "Attivazione pre-deploy".

### Firestore backup non generato

Controlla: vars repo `GCP_PROJECT_ID`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_BACKUP_SERVICE_ACCOUNT`, `FIRESTORE_BACKUP_BUCKET` popolate? OIDC provider configurato? Service account ha `roles/datastore.importExportAdmin`? Guida in [DISASTER_RECOVERY_RUNBOOK.md](DISASTER_RECOVERY_RUNBOOK.md).

---

## 5. ROLLBACK PROCEDURE

```bash
# Vercel — via dashboard
# Deployments → seleziona precedente → Promote to Production (1 click)

# Git revert + redeploy
git revert HEAD
git push
# Vercel redeploya automaticamente

# Firebase Hosting
firebase hosting:clone SOURCE:live TARGET:live --version <previous-hash>
```

Rollback regole Firestore:

```bash
git checkout <commit-precedente> -- firestore.rules
firebase deploy --only firestore:rules
```

Rollback dati Firestore: vedi [DISASTER_RECOVERY_RUNBOOK.md §Scenario B](DISASTER_RECOVERY_RUNBOOK.md).

---

## 6. BACKUP & RECOVERY

Procedura completa in [DISASTER_RECOVERY_RUNBOOK.md](DISASTER_RECOVERY_RUNBOOK.md). In sintesi:

- Workflow `.github/workflows/firestore-backup.yml` weekly (domenica 03:00 UTC) + manual dispatch.
- Retention 30 giorni su bucket `gs://travelliniwithus-firestore-backups` (lifecycle policy).
- Restore: `gcloud firestore import <path-backup> --project travelliniwithus` (staging per tentativi, prod in Scenario B).
- Test restore trimestrale su progetto staging.

---

## 7. SCALING

| Soglia | Azione |
|--------|--------|
| Newsletter > 1000 subscriber | Upgrade Brevo plan o valutare ESP alternativo |
| Articoli > 250 | Implementare pagination + composite index su `articles` (published, createdAt desc) |
| Storage Firebase > 5GB | Migrare asset media a Cloudinary/Bunny CDN |
| Traffico > 1M pageview/mese | Valutare Cloudflare davanti a Vercel + runtime caching PWA |
| Ordini > 100/mese | Scrivere upsert `orders/` su `stripeSessionId` per idempotenza (oggi non presente, vedi runbook Stripe §Duplicati) |

---

## 8. SECURITY MAINTENANCE

### Monthly

- [ ] Review `firestore.rules` diff vs mese precedente.
- [ ] Verifica log admin access (Firebase Auth → Users → last sign-in).
- [ ] Controllo SSL certificate (Vercel automatico, ma verifica scadenza).
- [ ] `npm audit --audit-level=high` → zero CVE bloccanti.
- [ ] Firestore weekly backup presente (check lunedì).

### Quarterly

- [ ] Security audit codebase (manuale o `pr-review-toolkit:silent-failure-hunter` sul branch main).
- [ ] `npm outdated` + upgrade sicuro dipendenze maggiori.
- [ ] Test restore Firestore su staging (registrare in `docs/40_Daily/` con tag `[dr-test]`).
- [ ] Review error log Sentry per top 10 exception → tickets di fix.

---

## 9. CONTACT & ESCALATION

- **Owner / on-call**: skotynyanskiy@gmail.com (Rodrigo). Account `admin@travelliniwithus.it` pianificato come handover.
- **Stripe support**: Stripe Dashboard → Help.
- **Firebase support**: Firebase Console → Help.
- **Error monitoring**: Sentry (dopo attivazione DSN).
- **Backup bucket**: `gs://travelliniwithus-firestore-backups` (GCP console).

---

## Quick Start (Development)

```bash
npm install
cp .env.example .env.local  # popola con chiavi dev
npm run dev                 # http://localhost:3000
npm run typecheck
npm run audit:quality
npm run build && npm run preview
```

---

## Next Steps (post Sprint 1, 2026-04-20)

1. **Sessione finale pre-deploy** — attivazione chiavi reali:
   - [ ] Install `@sentry/react` + `@sentry/node`, popolare DSN, sostituire body init (vedi decision doc).
   - [ ] Stripe live endpoint + env + smoke test A/B/C.
   - [ ] Setup WIF + bucket GCS + primo backup Firestore.
   - [ ] Migrazione Custom Claims owner + redeploy rules.
   - [ ] Popolare GA4/Meta/TikTok/Mapbox ID nelle env vars di produzione.
2. **Content work (owner)**: 5 articoli + 3 prodotti reali secondo [EDITORIAL_PUBLISH_CHECKLIST](13_Content/EDITORIAL_PUBLISH_CHECKLIST.md).
3. **Post-launch**:
   - [ ] Lighthouse CI + budget JSON.
   - [ ] PWA runtime caching articoli (Workbox strategies).
   - [ ] Image pipeline WebP/AVIF build-time.
   - [ ] Refactor `server.ts` (1477 LOC → moduli `routes/`, `middleware/`, `services/`).
