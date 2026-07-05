---
type: audit
generated: 2026-05-17
specialists: [quality, security, perf, ui-designer, seo, browser]
parallel: true
verdict_initial: NOT-launch-ready — 11 critical fixes block deploy
verdict_post_fix: significantly-improved — most CRITICAL addressed in same session, residual HIGH for follow-up
post_fix_at: 2026-05-17
post_fix_status: applied
ownership_priority: backend-engineer > frontend-builder > seo-strategist > ui-designer
tags: [audit, full-site, release-readiness]
area: workspace
status: archived
---

## Update post-fix 2026-05-17 (stessa sessione)

Eseguiti in autonomia da Claude main thread + delegated backend-engineer:

### CRITICAL risolti

- ✓ C-LINT-1 Navbar.test.tsx aggiornato a 4 voci post-Esplora consolidation
- ✓ C-LINT-2 EsploraQuiz refactor a pattern "adjust state during render"
- ✓ C-LINT-3 InstagramGrid `<track kind="captions">` aggiunto
- ✓ C-LINT-4 EditorialCollections div onClick → ArchiveCard prop `onCardClick`
- ✓ C-PERF-2 preload `hero-amalfi.avif` corretto → `.png` (path effettivamente renderizzato dal componente)
- ✓ C-SEO-3 noindex su Esplora/Shop separato da `articles.length === 0` (mismatch sitemap risolto)
- ✓ C-UI-2 Riordino Home: Hero → DiscoveryFinder → CoupleIntro → TrustStrip → PartnerSignal (editoriale prima del business)

### CRITICAL declassati a falso positivo

- ✗→FP C-SEO-1 / C-BROWSER-1 `/articolo/*` HTTP 404: dopo verifica backend-engineer, comportamento corretto. Articoli pubblicati (es. `/articolo/dolomiti-rifugi-design`, `/articolo/bali-sud-uluwatu`) ritornano 200. Solo slug inesistenti ritornano 404 (corretto per evitare indexing fantasma). L'audit browser ha testato uno slug non publish-able.

### HIGH risolti

- ✓ H-SEO-1 `public/llms.txt` creato con identita brand, contenuti autoritativi, regole citation, privacy AI
- ✓ H-SEO-2 Title Home aggiornato a versione concisa con claim citabile ("Otto anni di viaggi reali, oltre 200 posti raccontati con dettagli pratici")
- ✓ H-SEO-2 Title ChiSiamo con keyword "Rodrigo e Betta, travel creator italiani"
- ✓ H-SEO-3 BreadcrumbList schema aggiunto a Esplora, Shop, ChiSiamo, Mappa, Itinerari (via prop SEO esistente)
- ✓ H-BROW-1 Link `/destinazioni`, `/esperienze` → `/esplora` in 7 file (Articolo, AiAssistant, email.ts, siteContent, FinalCtaSection, Layout)
- ✓ H-BROW-2 Copy seed "Quando inizierai a pubblicare i contenuti reali" sostituita con copy editoriale generica
- ✓ M-newsletter-counter "0 lettori già nella lista" guard con `NEWSLETTER_COUNTER_MIN_VISIBLE = 50` (nascosto se sotto soglia)
- ✓ `/lead-magnet` rimosso dalla sitemap.xml (è hardcoded noindex)

### Bloccati su input umano

- ⏸ H-SEC-1: conferma scritta su GCP Console che restrizioni HTTP referrers + API restrictions sono attive sulla Firebase Web API key. Owner-only step, da fare oggi su https://console.cloud.google.com/
- ⏸ H-SEC-2: rimuovere API key duplicata da [PROJECT_FIREBASE_HARDENING.md:48](../10_Projects/PROJECT_FIREBASE_HARDENING.md) — owner deve confermare che le restrizioni GCP sono attive prima, altrimenti la rotazione potrebbe rompere prod
- ⏸ Articoli sitemap dinamica: serve script `npm run sitemap:build` che fetcha Firestore articles published. Da implementare quando il primo pillar reale esce dalla pipeline /verify-facts → /anti-ai-slop

### Da fare con agent dedicato (fuori scope quick-fix session)

- C-UI-1 HomeTrustStrip riduzione a 1 riga editoriale (richiede direzione ui-designer + decisione owner se tenere i 4 KPI o no)
- C-UI-3 HomeDiscoveryFinder 4 card → 2 ingressi image-led (richiede asset-curator per scelta foto)
- C-PERF-1 LCP font preload Fraunces: misurazione in PROD (dev mode non rappresentativo); rifare cwv su build prod prima di intervenire
- C-SEO-2 Sitemap dinamica articoli: serve script di build quando articoli reali entrano in Firestore
- Refusi accenti ChiSiamo (`l anno`, `non e`): pass copy-edit dedicato
- 130 occorrenze `text-black/XX` → token `--color-ink-2`/`--color-muted`: refactor CSS systematico

# Full Site Audit — Travelliniwithus

Eseguito 2026-05-17 con 6 specialisti in parallelo: quality-auditor, security-auditor, perf-engineer, ui-designer, seo-conversion-strategist, browser-auditor.

## Verdict globale

**NOT-launch-ready.** 11 issue CRITICAL, 14 HIGH. Il sito ha asset editoriali forti (Hero, CoupleIntro, Esplora, motion, brand voice) ma 4 famiglie di problemi bloccano il go-live:

1. **SEO infrastruttura rotta**: articoli HTTP 404, sitemap fuori sync, noindex su pagine pubbliche, zero llms.txt
2. **Performance**: LCP 3.2s (target <2.5s) per font render-blocking + preload spurio
3. **Lint/test failure**: 4 errori bloccanti contraddicono lo snapshot "lint 0 errori"
4. **UI top-of-homepage SaaS-y**: TrustStrip + PartnerSignal + DiscoveryFinder rompono la lettura "rivista travel"

Tutto risolvibile in 2-3 settimane focused. Dopo i fix CRITICAL la base e' deploy-ready.

---

## CRITICAL — Fix entro 7 giorni (blocca deploy)

### SEO infrastruttura (3 critical, owner: backend-engineer + seo-strategist)

| #           | Issue                                                                                                                                                                                            | File                                                                                                                                         | Owner                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **C-SEO-1** | `/articolo/[slug]` restituisce HTTP 404 anche se la SPA renderizza. Google legge "soft 404" → zero indexing articoli pillar.                                                                     | [server.ts](../../server.ts) catch-all SPA fallback                                                                                          | backend-engineer                  |
| **C-SEO-2** | `sitemap.xml` fuori sync con `App.tsx`. Mancano `/articolo/:slug`, `/itinerari/:slug`, `/guide/:slug`, `/vieni-con-noi`, `/preferiti`, `/quiz`. Articoli pillar **non esistono per il crawler**. | [public/sitemap.xml](../../public/sitemap.xml)                                                                                               | seo-strategist                    |
| **C-SEO-3** | `noindex` su `/esplora`, `/shop`, `/lead-magnet`, `/club` (rotta marketing). Hub di scoperta invisibile a Google finche Firestore non popola.                                                    | [src/pages/Esplora.tsx](../../src/pages/Esplora.tsx), [Shop.tsx](../../src/pages/Shop.tsx), [LeadMagnet.tsx](../../src/pages/LeadMagnet.tsx) | seo-strategist + frontend-builder |

### Performance (2 critical, owner: frontend-builder)

| #            | Issue                                                                                                                                                                                     | Stima impatto           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **C-PERF-1** | LCP **3.20s** (target <2.5s). H1 attende Fraunces caricato via `@import` render-blocking (4 weight × woff2). Fix: preload diretto Fraunces 500 latin + self-host + `font-display: swap`.  | **-800/1200ms** sul LCP |
| **C-PERF-2** | `index.html:22` preload di `/images/hero-amalfi.avif` che NON e' LCP image della home — spreca priorita di rete sul woff2. Fix: rimuovere il preload, lasciare solo `couple-travel.avif`. | **-150/300ms** LCP      |

### Lint/test (4 critical, owner: frontend-builder)

| #            | Issue                                                                                                                                                               | File:line                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **C-LINT-1** | Test obsoleto fallisce: cerca "Destinazioni / Esperienze / Guide" rimossi post-Esplora consolidation.                                                               | [src/components/Navbar.test.tsx:13-15](../../src/components/Navbar.test.tsx#L13)                                      |
| **C-LINT-2** | `set-state-in-effect` error in `useEffect(() => setStepIndex(0))`.                                                                                                  | [src/components/discovery/EsploraQuiz.tsx:76](src/components/discovery/EsploraQuiz.tsx#L76)                           |
| **C-LINT-3** | `<video>` senza `<track>` per captions (jsx-a11y/media-has-caption). Snapshot F1.8 lo dichiarava chiuso → regressione.                                              | [src/components/InstagramGrid.tsx:243](../../src/components/InstagramGrid.tsx#L243)                                   |
| **C-LINT-4** | `<div onClick>` senza keyboard handler/role — accessibility blocker su componente discovery pubblico. Fix: `<button>` o `role="button"` + `onKeyDown` + `tabIndex`. | [src/components/discovery/EditorialCollections.tsx:112](../../src/components/discovery/EditorialCollections.tsx#L112) |

### Browser regression (1 critical aggregato, owner: backend-engineer)

| #               | Issue                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **C-BROWSER-1** | Stesso problema di C-SEO-1 visto end-to-end: `/articolo/[slug]` 404 HTTP + body renderizza. Conferma indipendente. |

### UI top-of-homepage SaaS-y (3 critical aggregati, owner: ui-designer → frontend-builder)

| #          | Issue                                                                                                                                                                                                                                              | File                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **C-UI-1** | `HomeTrustStrip` 4 KPI numeri serif + icone = pattern "overbuilt statistic strip" vietato da [DESIGN.md:48](../../DESIGN.md#L48). Direzione: convertire in 1 riga editoriale o spostare sotto fold.                                                | [HomeTrustStrip.tsx](../../src/components/home/HomeTrustStrip.tsx)                        |
| **C-UI-2** | Sequenza `Hero → TrustStrip → PartnerSignal → DiscoveryFinder` = 3 sezioni "business-first" prima del primo segnale editoriale. Direzione: rimuovere/ridurre TrustStrip, spostare PartnerSignal dopo CoupleIntro, promuovere DiscoveryFinder a #2. | [Home.tsx:78-90](../../src/pages/Home.tsx#L78)                                            |
| **C-UI-3** | `HomeDiscoveryFinder` 4 card icon+title+arrow generiche tipo Linear/Notion. Direzione: 2 ingressi image-led basati sulle foto picks gia presenti sotto.                                                                                            | [HomeDiscoveryFinder.tsx:106-136](../../src/components/home/HomeDiscoveryFinder.tsx#L106) |

---

## HIGH — Fix entro 30 giorni

### Security (sblocco deploy condizionato)

- **H-SEC-1**: Firebase Web API key `AIzaSyD_HR...AMtDU` committata in chiaro in `firebase-applet-config.json:4`. Tollerabile SOLO se restrizioni GCP referrer + API attive (vedi [PROJECT_FIREBASE_HARDENING.md Fase 1](../10_Projects/PROJECT_FIREBASE_HARDENING.md)). **Azione**: confermare oggi su GCP Console che Application restrictions = HTTP referrers e API restrictions = solo Identity Toolkit/Firestore/FCM. Senza, qualsiasi attaccante puo' fare quota-burn / auth abuse.
- **H-SEC-2**: Stessa API key ripetuta in chiaro in [PROJECT_FIREBASE_HARDENING.md:48](../10_Projects/PROJECT_FIREBASE_HARDENING.md#L48). Anche con restrizioni attive, evitare di committare chiavi in docs.

### Perf (oltre i 2 CRITICAL)

- **H-PERF-1**: `dist/assets/mapbox-o2CeMAGj.js` = 1.68 MB raw / 464 KB gz. Verificare che `MapboxWorldMap` sia lazy + Suspense e mai eager dalla Home. Se accidentalmente eager: -400ms TTI.
- **H-PERF-2**: `puglia.webp` 369×395 above-fold con `loading="lazy"` in HomeDiscoveryFinder. Switch a `eager` per le 3-4 card finder visibili: -100/200ms FCP.

### SEO + AI SEO (oltre i 3 CRITICAL)

- **H-SEO-1**: nessun `public/llms.txt`. Gap totale per indexing LLM (Perplexity, ChatGPT search, Claude). Per un brand "consigliamo posti veri" e' il canale citation piu' strategico.
- **H-SEO-2**: `<title>` Home 70 char (truncato in SERP). `<title>` Chi Siamo generico ("Chi Siamo | Travelliniwithus"), nessuna keyword (Rodrigo, Betta, travel creator italiani).
- **H-SEO-3**: nessun `BreadcrumbList` schema su Esplora, Itinerari, Mappa, Shop, ChiSiamo. Solo `Articolo.tsx` lo emette. Perdita rich result.
- **H-SEO-4**: `Article` schema senza `wordCount`, `speakable`, `about`/`mentions` con entita geografiche. Articoli pillar non disambiguano luoghi (no `Place` con `geo` o `sameAs` Wikidata). Citation entity-level zero.
- **H-SEO-5**: meta description Home senza claim citabile (no numeri specifici: "8 anni", "30 posti", ecc.). Aggiungere.

### UI debt visivo

- **H-UI-1**: Navbar sbilanciato — 4 link sx vs 5 elementi cluster dx (CTA "Collabora" + Search pill + Heart + User). Collassare Search in icona pura o togliere CTA dal navbar (gia coperto dal dropdown).
- **H-UI-2**: `HomePartnerSignal` bianco bordato sopra DiscoveryFinder `bg-surface-2` → effetto "strip pubblicitaria" SaaS. O fondere con TrustStrip o spostare in fondo prima di CollaborationCta.
- **H-UI-3**: `HomeQuizBudgetTeaser` dark card con 3 radio + bottoni interattivi = mini-form inline che rompe ritmo editoriale tra LatestArticles e InstagramGrid. Convertire in card image-led, demandare l'interazione a `/quiz`.
- **H-UI-4**: 3 sfumature neutro adiacenti (`surface-2` + `sand` + `white`) creano "molte sezioni grigiastre". Alternare solo `sand` ↔ `white`.

### Browser regressioni copy/route

- **H-BROW-1**: `/articolo/*` body link "Continua a esplorare" ancora puntano a `/destinazioni`, `/esperienze` (rotte rimosse → redirect a `/esplora`). Hop SEO inutile + breadcrumb mostra "Destinazione". Refactor in [Articolo.tsx](../../src/pages/Articolo.tsx) + `RelatedArticles` + breadcrumb generator.
- **H-BROW-2**: `/articolo/*` sezione "Potrebbe interessarti anche" mostra copy seed di sviluppo: "Quando inizierai a pubblicare i contenuti reali...". Voce dev visibile in produzione. Nascondere blocco se array vuoto o fallback editoriale.

### Quality docs/release stale

- **H-QUAL-1**: [docs/LAUNCH_CHECKLIST.md](../LAUNCH_CHECKLIST.md) totalmente stale — parla ancora di "Destinazioni e Guide" come sezioni separate. Bloccante per onboarding R+B. Riscrittura sezione 1 contenuti.
- **H-QUAL-2**: [PROJECT_RELEASE_READINESS.md:573-575](../10_Projects/PROJECT_RELEASE_READINESS.md#L573) — "npm run build da verificare / audit:ui da verificare" rimasti aperti. Aggiornare con esiti (build PASS 34.23s, audit:ui PASS warning preesistenti, test FAIL come C-LINT-1).

---

## MEDIUM — Backlog 30-60 giorni

- **CSS drift**: 130 occorrenze `text-black/XX` invece di token `--color-ink-2`/`--color-muted`. Refactor a tokens.
- **Eyebrow inconsistente**: 5 valori `tracking` diversi. Allineare a `.text-eyebrow` gia definito in `index.css:121`.
- **AdminMetricsOverview**: 94 warning audit:ui per raw hex colors `#1c1a17`. Rotta admin, non blocca, ma drift dai tokens.
- **Sentry CSP**: `script-src` include `unsafe-inline` + `unsafe-eval`. Necessario per Stripe/GTM ora, ma pianificare nonce-based post-launch.
- **Admin gate drift**: `ADMIN_EMAIL` hardcoded in 3 file ([server.ts:1645](../../server.ts#L1645), [firestore.rules:84](../../firestore.rules#L84), [src/config/admin.ts:1](../../src/config/admin.ts#L1)). Centralizzare.
- **`firestore.rules:isAdmin()`** fallback su `request.auth.token.email` senza custom claim canonical. Considerare claim `admin: true`.
- **Hero CTA copy**: "Apri Esplora" gergale per un utente nuovo. Sostituire con CTA che spiega cosa fa.
- **Alt text generici** in HomeDiscoveryFinder (`alt={type}`). Sostituire con descrizioni italiane.
- **Newsletter counter 0** visibile in pubblico (anti-conversion). Nascondere sotto soglia.
- **Refusi accenti** in ChiSiamo (`l anno`, `non e`). Pass copy-edit.
- **Footer + CollaborationCta entrambi `bg-ink-deep`** → 2 sezioni nere in coda. Separatore o footer su sand.
- **`/articolo/*` body content thin**: copy seed che salta direttamente a CTA. Editorial-writer per draft pieni.
- **Bug aperto** [BUG_2026-05-15_discovery_sitemap_noindex_mismatch.md](../14_Bugs/BUG_2026-05-15_discovery_sitemap_noindex_mismatch.md): verificare se chiuso dal consolidamento o marcare risolto.
- **CoupleIntro polaroid scatter**: verificare che le 3 foto siano reali R+B non placeholder.

---

## LOW — Nice-to-have

- Navbar.test.tsx coverage debole (solo logo + 3 link). Dopo fix C-LINT-1, smoke su mega-menu Esplora.
- `@import` font in CSS resta anti-pattern: spostare i font in `<link rel="stylesheet">` paralleli o `@font-face` inline.
- Style recalc 319ms su 934 elementi (DOM 777 nodi denso). Virtualizzare LatestArticles se >12 card.
- 4 weight Fraunces caricati (400/500/600 + italic). Above-fold usa solo 500. Lazy gli altri via `font-display: optional`: -150 KB.
- 14 file con `style={{...}}` inline gestibili — quasi tutti giustificati ma `style={{ fontSize: 'var(--text-display-1)' }}` ripetuto eliminabile con `.text-display-1` utility.
- HomeTrustStrip: gerarchia visiva numero+icona equiparati. Icona dovrebbe essere muted, numero ink.
- Rate-limit assente su `/api/validate-coupon`, `/api/admin/ai-verify` (coperti solo da generic 100/15min). Admin-gated → accettabile.

---

## Roadmap 30-60-90 giorni

### 30 giorni — CRITICAL + HIGH essenziali (sblocca launch)

**Sprint 1 (giorni 1-7) — Owner principali: backend-engineer + frontend-builder**

- [ ] [backend-engineer] Fix C-SEO-1 + C-BROWSER-1: SPA fallback HTTP 200 per `/articolo/*` in `server.ts`
- [ ] [frontend-builder] Fix C-LINT-1/2/3/4: aggiornare test Navbar + fix set-state-in-effect + caption track + button keyboard
- [ ] [frontend-builder] Fix C-PERF-1 + C-PERF-2: preload Fraunces 500 latin + rimuovere preload hero-amalfi
- [ ] [frontend-builder] Verifica H-PERF-1 (mapbox lazy) + fix H-PERF-2 (puglia.webp eager)
- [ ] **GATE**: re-run `/cwv` su homepage → LCP <2.5s. Re-run `npm run lint` → 0 error.

**Sprint 2 (giorni 8-21) — Owner principali: seo-strategist + ui-designer → frontend-builder**

- [ ] [seo-strategist] Fix C-SEO-2: rebuild sitemap.xml con articoli reali e itinerari + breadcrumb schema su Esplora/Itinerari/Mappa/Shop/ChiSiamo
- [ ] [seo-strategist] Fix C-SEO-3: rimuovere `noindex` da Esplora/Shop/LeadMagnet quando contenuto reale presente; lasciare solo se preview-mode
- [ ] [seo-strategist] Fix H-SEO-1: creare `public/llms.txt` con identita brand
- [ ] [seo-strategist] Fix H-SEO-2/3/4/5: title Home + Chi Siamo, BreadcrumbList, Article schema wordCount/about, meta description con claim
- [ ] [ui-designer] Direzione visiva per C-UI-1/2/3: de-saas-ify top-of-homepage
- [ ] [frontend-builder] Implementa direzione ui-designer + H-UI-1/2/3/4 (Navbar bilanciamento, PartnerSignal placement, QuizTeaser image-led, palette neutro alternato)
- [ ] [frontend-builder] Fix H-BROW-1/2: link articoli a `/esplora?zone=` + nascondere blocco "Quando inizierai a pubblicare"

**Sprint 3 (giorni 22-30) — Quality + security gate**

- [ ] [owner] H-SEC-1: confermare restrizioni GCP Firebase API key attive (HTTP referrers + API restrictions)
- [ ] [security-auditor] H-SEC-2: rimuovere API key da docs/10_Projects/PROJECT_FIREBASE_HARDENING.md
- [ ] [quality-auditor] H-QUAL-1/2: aggiornare LAUNCH_CHECKLIST.md + PROJECT_RELEASE_READINESS.md
- [ ] [browser-auditor] full re-audit dopo fix → screenshot diff
- [ ] [perf-engineer] re-measure CWV all public routes
- [ ] **GATE**: `/predeploy` PASS senza warning critical

### 60 giorni — Polish editorial + AI SEO maturity

- [ ] [editorial-writer + asset-curator + frontend-builder] Pubblicare il primo pillar reale (Salento agosto) seguendo il flow: brief popolato R+B → editorial-writer → `/anti-ai-slop` → `/verify-facts` → `/ai-seo` → `/seo-check` → quality-auditor → publish → `/repurpose`
- [ ] [seo-strategist] Entity disambiguation: aggiungere `Place` schema con `geo`/`sameAs` Wikidata sui pillar articles
- [ ] [growth-operator] Lead magnet `/risorse/10-posti-italiani-non-ovvi` indicizzabile (versione SEO della rotta `noindex`)
- [ ] [frontend-builder] Refactor `text-black/XX` → token `--color-ink-2`/`--color-muted` (130 occorrenze)
- [ ] [ui-designer] Eyebrow tracking unification, footer separator
- [ ] [data-analyst] Setup baseline metriche pre-traffico: GA4 events, web-vitals dashboard, Sentry release tag
- [ ] [backend-engineer] Centralizzare admin gate (server.ts + firestore.rules + admin.ts → single source)

### 90 giorni — Growth foundations

- [ ] [growth-operator + social-operator] Calendario editorial: 1 pillar al mese + 4 satellite (carosello + Reel + quiz + newsletter) via `/repurpose`
- [ ] [seo-strategist] Topic clustering: il pillar Salento agosto fa da hub per 3 supporting articles gia briefati
- [ ] [growth-operator] Partner pipeline: contatti reali per 2-3 boutique/masseria Salento (per i placeholder)
- [ ] [data-analyst] Weekly review cadence con `/weekly-review` skill
- [ ] [perf-engineer] CSP nonce-based post-Stripe stabilization
- [ ] [security-auditor] Audit cadence: re-run ogni 4 settimane
- [ ] [editorial-writer] Pillar #2 in pipeline (probabilmente "Cosa portare per il mare in Italia ad agosto" — supporting del Salento agosto, gia menzionato nel brief)

---

## Quick wins (oggi/domani, <2h ognuno)

1. **Preload font** + **togliere hero-amalfi preload** in index.html → -1000ms LCP
2. **Fix Navbar.test.tsx** → npm run test PASS
3. **Caption track al video** in InstagramGrid → 1 lint error fixed
4. **`role="button"` + onKeyDown` su EditorialCollections div** → 2 lint error fixed
5. **Creare `public/llms.txt`** con il template della skill `/ai-seo` → gap AI search chiuso strutturalmente
6. **Hot-fix link articoli** (`/destinazioni` → `/esplora?zone=`) in Articolo.tsx → SEO hop morto eliminato

Stima totale: **mezza giornata** per chiudere 6 finding e rendere il sito visibilmente piu' professionale.

---

## Ownership matrix

| Agent                                    | CRITICAL owned                                | HIGH owned                                   | Carico stimato     |
| ---------------------------------------- | --------------------------------------------- | -------------------------------------------- | ------------------ |
| **travellini-backend-engineer**          | C-SEO-1, C-BROWSER-1                          | H-SEC-1 (conferma), centralizzare admin gate | 1-2 giorni         |
| **travellini-frontend-builder**          | C-LINT-1/2/3/4, C-PERF-1/2, C-UI-1/2/3 (impl) | H-PERF-1/2, H-UI-1/2/3/4, H-BROW-1/2         | 5-7 giorni         |
| **travellini-seo-conversion-strategist** | C-SEO-2, C-SEO-3                              | H-SEO-1/2/3/4/5                              | 3-4 giorni         |
| **travellini-ui-designer**               | C-UI-1/2/3 (direzione)                        | H-UI-\* (direzione)                          | 1 giorno read-only |
| **travellini-security-auditor**          | —                                             | H-SEC-2, audit cadence                       | 1 ora              |
| **travellini-quality-auditor**           | —                                             | H-QUAL-1/2, re-audit dopo fix                | 1 giorno           |
| **travellini-editorial-writer**          | —                                             | (60gg) pillar Salento body                   | 2-3 giorni         |
| **travellini-asset-curator**             | —                                             | (60gg) foto pillar Salento                   | 1 giorno           |

Carico totale **single-thread sequenziale**: ~3-4 settimane. Con parallelizzazione realistica (seo + frontend + ui in parallelo): **2 settimane** alla riga di launch.

---

## Final verdict

Il sito ha la base giusta per essere un brand premium editorial di alto livello. I problemi attuali sono **specifici, identificati, e fix-abili in 2-3 settimane**.

Non c'e' nulla di architetturalmente rotto. C'e' del polish da finire, una pipeline SEO da connettere ai contenuti reali, una pagina home da ricalibrare per togliere il sapore SaaS dal terzo superiore, e 4 errori di lint che fanno saltare il test. Tutto risolvibile.

**Prossimo step consigliato**: partire dai 6 quick wins (mezza giornata) per avere un primo screenshot "before/after" tangibile, poi attaccare in parallelo backend-engineer + seo-strategist + frontend-builder per i fix CRITICAL dello Sprint 1.

---

## Raw outputs

I 6 report originali completi sono nei tool result della sessione 2026-05-17. Agent IDs:

- quality-auditor: `a0c3e997effbf3ff1`
- security-auditor: `ab6962a7e555baa0e`
- perf-engineer: `a25880789fe0af546`
- ui-designer: `aa46c1d33d21953fa`
- seo-strategist: `af1fb515dbf9d05a2`
- browser-auditor: `a20b5f53cbb46bbd0`

Per ri-interrogare ognuno con domande approfondite, usare SendMessage con l'agent ID corrispondente.
