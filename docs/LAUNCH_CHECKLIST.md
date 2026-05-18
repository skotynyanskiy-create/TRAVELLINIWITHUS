# TRAVELLINIWITHUS — Checklist Finale di Lancio

Questo documento riassume i passi necessari per portare il sito dallo stato attuale (sviluppo/predisposizione) al lancio ufficiale in produzione. La struttura tecnica, il design e la logica di navigazione sono completati e verificati.

**Aggiornato 2026-05-17** dopo consolidamento Esplora (rimozione `/destinazioni`, `/esperienze`, `/guide` separate → un unico hub `/esplora`) e Full Site Audit con 6 specialisti paralleli. Riferimento: [AUDIT_FULL_SITE_2026-05-17.md](50_Scratch/AUDIT_FULL_SITE_2026-05-17.md).

## 1. Contenuti e CMS (Azione richiesta: Rodrigo & Betta)

Il sito e' attualmente in "Demo Mode": l'archivio mostra contenuti seed (`src/config/demoArchive.ts` + `demoItineraries.ts`) finche Firestore non e' popolato. Per renderlo reale:

- [ ] **Accesso Admin**: Accedi a `/admin` con un account Google autorizzato (email in `src/config/admin.ts`).
- [ ] **Articoli Reali**: Carica almeno 3-5 articoli reali. Ogni articolo ha categoria (es. "Destinazione", "Esperienza", "Guida pratica", "Itinerario") ma vive nello stesso archivio unificato `/esplora`. La taxonomy e' in [src/config/contentTaxonomy.ts](../src/config/contentTaxonomy.ts).
- [ ] **Prima pillar pipeline**: il primo pillar in coda e' [PILLAR_ARTICLE_SALENTO_AGOSTO](13_Content/PILLAR_ARTICLE_SALENTO_AGOSTO.md). Il brief e' pronto; necessari dati R+B per popolare i placeholder (4 localita mare, 4 strutture, 5 indirizzi cibo). Vedi fact-checklist a-priori in [VERIFY_FACTS_salento-agosto_2026-05-17](50_Scratch/VERIFY_FACTS_salento-agosto_2026-05-17.md).
- [ ] **Sequenza canonica per pillar**: `/new-article` → `editorial-writer` → `/anti-ai-slop` → `/verify-facts` → `/ai-seo` → `/seo-check` → `quality-auditor` → publish → `/repurpose`. Skill editorial leverage aggiunte 2026-05-17.
- [ ] **Prodotti Shop**: Carica i prodotti digitali (o fisici) reali nella collezione `products`.
- [ ] **Disattivazione Demo**: Una volta caricati i contenuti, dalle impostazioni admin disattiva `showEditorialDemo` e `showShopDemo`.

## 2. Analisi e Tracciamento

Predisposizione gia' completata, solo da popolare con ID reali.

- [ ] **ID Integrazioni**: Apri [src/config/integrations.ts](../src/config/integrations.ts).
- [ ] **Inserimento ID**:
  - Google Analytics 4 (`googleAnalyticsId`)
  - Meta Pixel (`metaPixelId`)
  - TikTok Pixel (se attivo)
- [ ] **Newsletter**: Se usi un servizio esterno (Mailchimp/Brevo/Flodesk), inserisci l'URL del form in `newsletterActionUrl`. Counter pubblico ha guard `NEWSLETTER_COUNTER_MIN_VISIBLE = 50` per evitare anti-conversion da numeri bassi.
- [ ] **Sentry**: `SENTRY_DSN` in env e source maps upload via `npm run release:sentry`.

## 3. Sicurezza e Hardening (Azione richiesta: owner)

Esiti del security-auditor 2026-05-17:

- [ ] **Firebase Web API Key restrictions (BLOCKER)**: confermare su [GCP Console](https://console.cloud.google.com/) che la chiave `AIzaSyD_HR...AMtDU` in [firebase-applet-config.json](../firebase-applet-config.json) ha:
  - Application restrictions = HTTP referrers (`travelliniwithus.it/*`, `*.travelliniwithus.it/*`, `localhost/*` solo per dev)
  - API restrictions = solo Identity Toolkit, Firestore, FCM
  - Vedi [PROJECT_FIREBASE_HARDENING.md Fase 1](10_Projects/PROJECT_FIREBASE_HARDENING.md).
- [ ] **API Key duplicate da rimuovere**: dopo conferma restrizioni attive, rimuovere la chiave in chiaro da [PROJECT_FIREBASE_HARDENING.md:48](10_Projects/PROJECT_FIREBASE_HARDENING.md).
- [ ] **Stripe webhook signing**: verificare che `STRIPE_WEBHOOK_SECRET` sia popolato in env prod e che server.ts lo enforce. Audit conferma OK al 2026-05-17.
- [ ] **Admin gate**: centralizzare `ADMIN_EMAIL` (oggi in 3 file: server.ts, firestore.rules, src/config/admin.ts) — backlog medio.

## 4. Shop e Pagamenti

- [ ] **Account Stripe**: Crea o configura il tuo account Stripe.
- [ ] **Firebase Extension**: Configura l'estensione "Run Payments with Stripe" su Firebase.
- [ ] **Webhook**: webhook di Stripe puntano al backend per sbloccare i contenuti digitali acquistati. Test end-to-end con `npm run webhook:listen` (Stripe CLI).

## 5. Aspetti Legali e GDPR

- [ ] **Privacy & Cookie**: I testi in [src/pages/legal/](../src/pages/legal/) sono bozze strutturate. Verifica che i dati (email, riferimenti fiscali) siano corretti.
- [ ] **Banner Cookie**: Se usi Iubenda, inserisci lo script fornito in [index.html](../index.html).

## 6. SEO + AI SEO (parzialmente fatto 2026-05-17)

Eseguiti in audit:

- [x] `public/llms.txt` creato con identita brand, contenuti autoritativi, regole citation, privacy AI
- [x] BreadcrumbList schema aggiunto a Esplora, Shop, ChiSiamo, Mappa, Itinerari
- [x] Title Home + ChiSiamo con keyword e claim citabile
- [x] Sitemap mismatch (`/lead-magnet` hardcoded noindex era in sitemap) risolto

Da fare prima del lancio organico:

- [ ] **Sitemap dinamica**: serve script `npm run sitemap:build` che fetcha articoli published da Firestore e popola `public/sitemap.xml` (oggi statica). Critico per indexing articoli pillar.
- [ ] **Article schema arricchito**: aggiungere `wordCount`, `about`/`mentions` con `Place` schema (geo + sameAs Wikidata) sui pillar — entity-level citation.
- [ ] **Pagina lead-magnet indicizzabile**: il `/lead-magnet` corrente e' post-conversion (noindex OK). Creare versione SEO `/risorse/10-posti-italiani-non-ovvi` indicizzabile per acquisition organico.

## 7. Performance (parzialmente fatto 2026-05-17)

Eseguiti:

- [x] Preload hero image corretto da AVIF spurio a PNG (path effettivamente renderizzato)
- [x] Build prod misurata: ~34s, no error

Da rimisurare in prod:

- [ ] **CWV su build prod**: dev mode mostra LCP 3.20s (font render-blocking apparente), ma `font-display: swap` e' attivo su @fontsource. Build prod con minify + compression scende molto. Lanciare `npm run audit:cwv` su prod o staging URL.
- [ ] **Mapbox lazy verify**: 1.68 MB raw / 464 KB gz nel chunk `mapbox-*.js`. Verificare che sia caricato solo da `/mappa` e non eager da Home.
- [ ] **puglia.webp eager above-fold**: passare da `loading="lazy"` a `eager` per le card finder visibili a primo paint.

## 8. Deployment Finale

- [ ] **Build Check**: `npm run build` PASS in locale (verificato 2026-05-17).
- [ ] **Pre-deploy gate**: `npm run predeploy` deve PASS. Eventualmente lanciare manualmente `/predeploy` skill per gate consolidato.
- [ ] **Firebase Hosting**: deploy via `firebase deploy --only hosting`. Dominio `travelliniwithus.it` mappato.
- [ ] **HTTPS**: certificato SSL automatico via Firebase Hosting.
- [ ] **Real-browser smoke post-deploy**: lanciare `/audit-browser` skill sul dominio prod per regression check.

---

### Verifiche di Qualita (Audit 2026-05-17)

- [x] **SEO base**: Meta tag, OpenGraph, sitemap (statica), robots.txt, JSON-LD Organization + WebSite + Article + BreadcrumbList configurati
- [x] **AI SEO**: `llms.txt` creato; entity layer base; freshness signals via `dateModified`
- [x] **Performance**: build prod < 35s, preload immagini corretti, font-display swap attivo
- [x] **Navigazione**: rotte legacy `/destinazioni`, `/esperienze`, `/guide` redirected a `/esplora` (lato client + email + SearchAction)
- [x] **Mobile**: responsive ok su tutte le rotte testate da browser-auditor (1280 + 768 + 375)
- [x] **Lint**: 4 errori bloccanti del 2026-05-15 risolti (Navbar.test, EsploraQuiz set-state, InstagramGrid track, EditorialCollections keyboard)
- [x] **Test**: `npm run test` PASS dopo aggiornamento Navbar.test
- [x] **Typecheck**: `npm run typecheck` PASS

### Audit residuo (cose da NON dimenticare)

- Conferma GCP restrictions su Firebase API key (BLOCKER, owner-only)
- Sitemap dinamica articoli (build script da scrivere)
- Direzione ui-designer per HomeTrustStrip + HomeDiscoveryFinder de-saas-ify
- CWV misurato in prod (dev mode non rappresentativo)
- Refactor `text-black/XX` → token (130 occorrenze, debito CSS)
- Refusi accenti ChiSiamo

---

**Aggiornato**: 17 Maggio 2026
**Stato**: PRONTO PER CARICAMENTO CONTENUTI + 2 BLOCKER OWNER (GCP restrictions + primi articoli reali)
**Prossimo Passo**: confermare GCP restrictions su Firebase API key + popolare brief Salento Agosto con dati R+B per partire la pipeline editoriale.
