---
type: project
area: site
status: in-review
owner: skotxx
created: 2026-05-14
updated: 2026-05-14
priority: P0
tags:
  - audit
  - release
  - marketing
  - seo
  - performance
  - accessibility
  - agent-stack
related-projects:
  - [[PROJECT_RELEASE_READINESS]]
  - [[PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN]]
  - [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
  - [[PROJECT_DESTINATIONS_SECTION_REVIEW]]
  - [[MARKETING_OPERATIONS_HUB]]
  - [[AI_AGENT_STACK]]
---

# PROJECT — Full site / marketing / tech / agent-stack audit

> Audit operativo multidisciplinare richiesto il 2026-05-14. Lavoro condotto come team senior (webmaster + frontend + SEO + design director + marketing + social + growth + a11y/perf + agent stack architect). Esecuzione reale di typecheck/build/audit:\* + browser audit Playwright su 10 pagine chiave.

## 1. Executive summary

Il sito e' a **V2 con H2 2026 ultra-piano dichiarato completato oggi**. Tecnicamente solido: typecheck PASS, build PASS in 26.97s, audit:agents PASS (24 skill canonizzate), audit:ui 0 errori / 94 warning di natura accettabile (admin + motion). Stripe checkout integrity verificata correttamente sul codice (il FAIL di `audit:stripe` e' un **falso positivo** dello script). Firestore rules pulite.

Lo stack agent e' stato esteso: da 7 a **24 skill canoniche** in `.agents/skills`, sincronizzate su Codex/Cursor/Gemini via `npm run sync:agents`, validate da `npm run audit:agents`.

Il blocco residuo al deploy V2 NON e' tecnico: e' **content-side**. Tre componenti home (`CoupleIntro`, `NewsletterFeature`, `PartnerLogosStrip`) sono in `TODO R+B` con placeholder. Lead magnet PDF e archivio newsletter non sono ancora ancorati su contenuti reali R+B. Foto people-led hero e shortlist partner sono pending.

Raccomandazione finale (sezione 15): **non deployare V2 finche non sono caricati i 3 asset reali della homepage** e finche non e' configurato `.env.production` con `RESEND_API_KEY`, `BREVO_*`, `STRIPE_*`, `VITE_MAPBOX_TOKEN`, `VITE_GA_ID`. Il sito tecnicamente puo' andare in prod oggi, ma il messaggio "people-led" cade se i visitatori vedono placeholder Unsplash.

## 2. Stato generale

| Asse                        | Stato                        | Note                                                                                                                                                                                                                                                                         |
| --------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tipi / build                | PASS                         | `tsc --noEmit` clean. `vite build` 26.97s, 87 entries precache (4.5 MB), `mapbox` lazy 1.7 MB / gzip 477 KB.                                                                                                                                                                 |
| Lint / format               | n/a (skip)                   | Non richiesto da audit, ma incluso in `npm run audit:quality`.                                                                                                                                                                                                               |
| UI consistency              | PASS (warn)                  | 94 warning: admin dashboard usa palette emerald/amber (semantica UI legittima); inline `style={{}}` su componenti motion (uso intenzionale). 0 errori.                                                                                                                       |
| Firebase rules              | PASS                         | `audit:firebase` 0 errori.                                                                                                                                                                                                                                                   |
| Stripe integrity            | PASS (script falso positivo) | Client invia solo `{id, quantity}` via `getCheckoutItems()`. Server filtra con `isCheckoutRequestItem`. Lo script `check-stripe.mjs:69` matcha la stringa `price: item.price` dentro `trackEvent('begin_checkout')` che e' solo analytics GA4, non payload Stripe. Vedi #18. |
| Agent stack                 | PASS                         | 24 skill canoniche, sync su 4 target, audit PASS dopo canonizzazione.                                                                                                                                                                                                        |
| Routing                     | PASS                         | 36 pagine pubbliche, tutte lazy-loaded, SEO completa per ognuna.                                                                                                                                                                                                             |
| Lead capture                | PASS (tracking)              | 8 eventi commerciali mappati a standard Meta/TikTok + 40+ eventi custom.                                                                                                                                                                                                     |
| Mobile responsive           | TBD                          | In verifica dal browser audit (Phase 3 in corso).                                                                                                                                                                                                                            |
| LCP / CWV                   | TBD                          | In verifica dal browser audit.                                                                                                                                                                                                                                               |
| Content reale R+B           | FAIL                         | 3 TODO espliciti, foto/newsletter/partner non sostituiti. Vedi BUG nota dedicata.                                                                                                                                                                                            |
| OG dinamica articoli        | PASS                         | `Articolo.tsx:348` usa `${SITE_URL}/og/${slug}.webp` per preview articles, `articleImage` per articoli reali (Firestore cover).                                                                                                                                              |
| ExitIntentPopup persistente | PASS (uncommitted)           | Refactor `sessionStorage` -> `localStorage` con cooldown 30gg. Pronto al commit dopo verifica in browser.                                                                                                                                                                    |

## 3. Punteggio qualitativo (1-10)

| Asse                    | Punteggio | Razionale                                                                                                                                                                                                                                                                                   |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand clarity           | 7.5       | Premium editorial coerente in DESIGN.md e architettura, ma indebolito da 3 placeholder visibili in home (CoupleIntro, NewsletterFeature, PartnerLogosStrip).                                                                                                                                |
| UX/UI                   | 8         | PageLayout/Section/Hero ben modulati, motion contenuto, lucide icons coerenti. Da verificare overflow mobile (TBD browser audit).                                                                                                                                                           |
| Technical quality       | 8.5       | Build pulito, typecheck pulito, tests presenti, audit suite estesa. -1.5 per TypeScript non strict e per 94 warning audit:ui da revisionare in 30gg.                                                                                                                                        |
| SEO                     | 8         | Sitemap auto, robots, OG per-page generata build-time + dinamica per articoli. Schema Organization, WebSite, Person. -2 per articoli reali con OG che dipende da Firestore cover quality.                                                                                                   |
| Performance             | 7.5       | Lazy-loading aggressivo, Mapbox isolato, Workbox precache 4.5 MB. -2.5 per mapbox bundle 1.7 MB (gzip 477 KB) — solo /mappa. LCP misurato in Phase 3.                                                                                                                                       |
| Accessibility           | 7         | Form components con label, lucide a11y-friendly. -3 in attesa di verifica WCAG 2.2 AA con browser audit (contrast, focus, alt).                                                                                                                                                             |
| Conversion              | 7         | 8 funnel commerciali tracciati (add*to_cart, begin_checkout, purchase_complete, newsletter_signup, media_kit_request_success, contact_submit_success, club_waitlist_success, lead_magnet_download). -3 perche manca `product_view`, `map_popup_click`, `exit_intent*\*`, scroll depth home. |
| Social / content engine | 7         | 5 pillar editoriali documentati, 8 slot mensili content workflow, content calendar template. -3 perche archivio newsletter, reel hero, foto coppia ancora placeholder.                                                                                                                      |
| Partnership readiness   | 6.5       | Media kit PDF generato (11 KB), form B2B con tracking + email + Firestore. -3.5 perche shortlist partner vuota, schema Person live ma social proof partner assente.                                                                                                                         |
| Agent stack maturity    | 9         | 24 skill canoniche, sync su Codex/Cursor/Gemini, hook safety PowerShell, MCP minimale (Playwright default), docs/ come fonte unica. -1 perche manca skill "schema-audit" e "docs-consistency" identificate come gap.                                                                        |

**Media ponderata:** 7.6 / 10. Sito **forte tecnicamente e architetturalmente**, debole **operativamente** (asset reali pending) e **misurazione** (browser audit in corso).

## 4. FAIL / WARN / PASS sintetica

| Check                    | Risultato                  | File / linea                               |
| ------------------------ | -------------------------- | ------------------------------------------ |
| `npm run typecheck`      | PASS                       | clean                                      |
| `npm run audit:ui`       | PASS (94 warn)             | admin + motion legittimi                   |
| `npm run audit:firebase` | PASS                       | clean                                      |
| `npm run audit:stripe`   | FAIL (falso positivo)      | `scripts/check-stripe.mjs:69` greedy regex |
| `npm run audit:agents`   | PASS (post-canonizzazione) | 24 skill, 0 errori                         |
| `npm run build`          | PASS                       | 26.97s                                     |
| `npm run sync:agents`    | PASS                       | 24 skill su 4 target                       |
| Browser audit Playwright | TBD                        | in background                              |

## 5. Top 20 problemi prioritari

> Findings dal browser audit Playwright reale su 10 pagine, 3 viewport, console + a11y tree + responsive sweep + LCP indicativo. Codifica: `[Priorita] [Area] — titolo`.

### P0

1. **~~[P0 / Marketing+Trust] Statistiche "0K+" in /` e /collaborazioni~~ — FALSO POSITIVO** (verifica visiva owner 2026-05-14)
   - **Esito:** chiuso. Il browser-auditor ha letto lo stato iniziale dell'`AnimatedCounter` (motion `useSpring` + IntersectionObserver) prima del trigger viewport. I valori reali sono gia' centralizzati in [src/config/site.ts:20-29](../../src/config/site.ts) come `BRAND_STATS` e renderizzati in [src/components/home/HomeTrustStrip.tsx:24-29](../../src/components/home/HomeTrustStrip.tsx) con suffissi `K+` / `+`. Screenshot owner mostra `500K+ / 167K+ / 90K+ / 150+` correttamente animati.
   - **Causa root del falso positivo:** Playwright `browser_snapshot` cattura il DOM in un singolo tick — se l'elemento non e' ancora in viewport o l'animazione non e' completa, il testo e' `"0K+"`.
   - **Residuo P3 a11y:** screen reader potrebbe leggere "0K+" prima dell'animazione. Mitigazione opzionale: aggiungere `aria-label` statico su AnimatedCounter.
   - **Residuo P2 tooling:** lo skill `audit-browser` dovrebbe attendere fine animazione prima di snapshot. Vedi nota in [BUG_HOMEPAGE_STATS_INCONSISTENT.md](../14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md).
   - **Bug ticket:** [docs/14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md](../14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md) — **status: closed-false-positive**.

2. **[P0 / Content+Firestore] FirebaseError "Missing or insufficient permissions" sugli articoli reali**
   - **Dove:** `/articolo/<slug>` per qualsiasi slug non-mock (es. `dolomiti-rifugi-coppia`)
   - **Problema:** doppia chiamata `fetchArticleBySlug` fallisce con permissions. Console mostra 2 errori Firebase consecutivi. Il fallback porta a 404.
   - **Impatto:** P0 content discovery. Articoli pubblicati su Firestore non sono leggibili in dev e potenzialmente neanche in prod (dipende dal rules). Funnel editoriale rotto.
   - **Soluzione:** verificare [firestore.rules](../../firestore.rules) — la regola `allow read if resource.data.published == true` deve gestire anche fallback senza-published per articoli legacy. Verificare auth state durante fetch (utente anonimo deve poter leggere articoli pubblicati).
   - **File:** [firestore.rules](../../firestore.rules), [src/services/firebaseService.ts:131](../../src/services/firebaseService.ts).
   - **Verifica:** dopo fix, navigare a un articolo non-mock e non-preview deve caricare il body senza console errors.
   - **Bug ticket:** [docs/14_Bugs/BUG_FIRESTORE_ARTICLES_PERMISSIONS.md](../14_Bugs/BUG_FIRESTORE_ARTICLES_PERMISSIONS.md) — creato in questo audit.

3. **[P0 / Marketing] Asset placeholder R+B in homepage (3 componenti)**
   - **Dove:** `CoupleIntro`, `NewsletterFeature`, `PartnerLogosStrip`
   - **Problema:** TODO espliciti per 3 foto coppia, 3-5 numeri newsletter reali, 5-7 partner shortlist.
   - **Impatto:** P0 brand clarity. People-led dichiarato non e' veicolato visivamente.
   - **Bug ticket:** [docs/14_Bugs/BUG_HOMEPAGE_PLACEHOLDER_ASSET_R_B.md](../14_Bugs/BUG_HOMEPAGE_PLACEHOLDER_ASSET_R_B.md) — creato.

4. **[P0 / Marketing] Testo "(demo)" visibile pubblicamente nella partner strip**
   - **Dove:** home, sezione partner — testo "Tra i progetti che raccontiamo **(demo)**" visibile a tutti.
   - **Problema:** la nota dev e' rimasta in pubblico.
   - **Impatto:** P0 trust. Un partner vede "(demo)" su una sezione che dovrebbe mostrare prova sociale.
   - **Soluzione:** rimuovere dal testo pubblico oppure attivare `data-state="demo"` overlay only su staging.
   - **File:** `src/components/home/PartnerLogosStrip.tsx`.

### P1

5. **[P1 / SEO+Routing] Slug `/articolo/dolomiti-rifugi-coppia` non esiste**
   - **Dove:** linkato come articolo demo dalla home; restituisce 404.
   - **Soluzione:** o creare l'articolo in Firestore, o correggere il link interno (probabile `src/config/previewContent.ts` o `featured articles` in `Home.tsx`).

6. **[P1 / a11y+UX] Label form non semantiche su /media-kit e /contatti**
   - **Dove:** entrambi i form usano `<div>` con testo sopra `<input>` invece di `<label htmlFor={id}>`.
   - **Impatto:** screen reader non legge associazione, click-area label non funziona, autocomplete mobile degradato.
   - **Soluzione:** rifattorizzare `src/components/FormField.tsx` (se condiviso) o i form inline per usare `<label>` con `htmlFor`.
   - **Verifica:** lighthouse a11y score deve aumentare di ~3-5 punti.

7. **[P1 / Security+Conversion] Honeypot assente su /media-kit**
   - **Dove:** form `/media-kit` non mostra campo honeypot nel DOM a11y tree.
   - **Problema:** /contatti e /vieni-con-noi hanno honeypot, /media-kit no. Forme B2B sono target di scraping bot.
   - **Soluzione:** aggiungere campo `website` hidden + check server-side (gia' presente nel pattern Contatti.tsx:70).
   - **File:** [src/pages/MediaKit.tsx](../../src/pages/MediaKit.tsx) — verificare se honeypot e' presente in source o se va aggiunto.

8. **[P1 / Conversion+Revenue] /lead-magnet accessibile senza email gate**
   - **Dove:** rotta `/lead-magnet` mostra direttamente la thank-you con link al PDF `/lead-magnet-posti-italiani.pdf`.
   - **Problema:** chiunque puo' scaricare il PDF senza email gate. Funnel di lead capture bypassabile.
   - **Soluzione:** opzione (a) servire il PDF via endpoint server-side con token in cookie/localStorage dopo submit; opzione (b) rendere il PDF privato in Firebase Storage con URL firmato emesso post-submit. **Preferenza (b)** per durabilita.
   - **File:** [src/pages/LeadMagnet.tsx](../../src/pages/LeadMagnet.tsx), [public/lead-magnet-posti-italiani.pdf](../../public/lead-magnet-posti-italiani.pdf), endpoint server.

9. **[P1 / Asset+UX] Asset 404 in console su /vieni-con-noi e /lead-magnet**
   - **Dove:** entrambe le pagine generano un 404 nella network — probabile immagine hero/sfondo.
   - **Soluzione:** identificare e correggere path (probabile `public/og/vieni-con-noi.webp` o `public/hero/...` referenziato male).

10. **[P1 / Mappa] Token Mapbox non caricato in dev — area mappa vuota**
    - **Dove:** `/mappa`.
    - **Problema:** senza `VITE_MAPBOX_TOKEN` valido, la mappa non mostra tiles. Fallback editoriale (5 destinazioni anteprima + filtri funzionanti) attivo ma il valore principale della pagina cade.
    - **Soluzione:** documentare in `.env.example` (gia' fatto), configurare in `.env.staging/.env.production`. Aggiungere messaggio esplicito "Mappa in caricamento — token non configurato" nel dev mode.
    - **File:** [src/pages/Mappa.tsx](../../src/pages/Mappa.tsx), [src/components/map/MapboxWorldMap.tsx](../../src/components/map/MapboxWorldMap.tsx).

11. **[P1 / Performance] Font Fraunces preloaded ma non usato entro load**
    - **Dove:** ogni pagina (console warning).
    - **Problema:** `<link rel="preload">` per Fraunces e' in head ma il browser non rileva uso above-fold entro timeout. Spreco bandwidth.
    - **Soluzione:** (a) verificare che il font sia usato above-fold con `font-display: swap` esplicito; (b) rimuovere preload se non critico per LCP; (c) usare `<link rel="preload" as="font" crossorigin>` con fallback proper.
    - **File:** `index.html` o `vite.config` web fonts strategy.

12. **[P1 / a11y] Heading gap h1→h3 su /contatti e /articolo sidebar**
    - **Dove:** `/contatti` salta h2 (h1 → h3 "I nostri recapiti"); ArticleSidebar usa h4 senza h2/h3 intermedi.
    - **Impatto:** Lighthouse a11y -1 punto, screen reader struttura confusa.
    - **Soluzione:** demote h3 a h2 oppure introdurre h2 implicito (es. "Recapiti" come h2).
    - **File:** [src/pages/Contatti.tsx:188](../../src/pages/Contatti.tsx), `src/components/article/ArticleSidebar.tsx`.

### P2

13. **[P2 / Content] Articolo /articolo/guida-bali mostra solo placeholder body**
    - **Problema:** body letterale "Tutto quello che devi sapere su Bali..." — content non scritto.
    - **Soluzione:** o popolare body Markdown reale in Firestore/preview, o rimuovere il link pubblico finche non scritto.

14. **[P2 / a11y] Footer heading gap h1→h4**
    - **Dove:** Footer usa h4 ("Scopri", "Risorse", "Progetto") senza h2/h3.
    - **Soluzione:** usare `<p>` con styling heading o `<strong>` invece di h4 per le intestazioni di colonna.

15. **[P2 / a11y] Immagini decorative senza alt esplicito**
    - **Dove:** hero home (ref=e50), card destinazioni (ref=e89, e96, e103, e112), icone lucide wrapper, anteprime media kit, illustrazione lead-magnet.
    - **Soluzione:** aggiungere `alt=""` esplicito per immagini decorative; verificare che le icone hanno `aria-hidden="true"`.

16. **[P2 / SEO+CWV] Hero image priority/preload non ottimali**
    - **Problema:** il warning Fraunces suggerisce che la strategia above-fold non e' ottimizzata. Hero `<img>` probabilmente senza `loading="eager"` o `fetchpriority="high"`.
    - **Soluzione:** sull'immagine hero home aggiungere `fetchpriority="high"` e `loading="eager"`. Verificare AVIF/WebP serving.

17. **[P2 / a11y+SEO] Articolo correlati mostrati come "Nessun correlato disponibile"**
    - **Dove:** `/articolo/guida-bali`.
    - **Problema:** placeholder pubblico visibile.
    - **Soluzione:** se l'articolo non ha correlati, omettere la sezione invece di mostrare il placeholder. File: `src/components/article/RelatedArticles.tsx`.

18. **[P2 / DX] `audit:stripe` script falso positivo blocca `audit:quality`**
    - **Dove:** [scripts/check-stripe.mjs:69](../../scripts/check-stripe.mjs).
    - **Problema:** regex greedy `body:\s*JSON\.stringify\(\{[\s\S]*price:` matcha la stringa `price: item.price` dentro `trackEvent('begin_checkout', { price })` precedente al fetch. Il client invia solo `{id, quantity}` via `getCheckoutItems()`.
    - **Soluzione:** restringere la regex al primo `}` o escludere blocchi `trackEvent(` prima del match.

19. **[P2 / Analytics+Conversion] Eventi mancanti**
    - **Dove:** `/shop/:slug`, `/mappa`, exit intent popup.
    - **Missing:** `product_view` (Pinterest, Meta), `map_popup_click`, `map_filter_change`, `exit_intent_view`, `exit_intent_dismiss`, `exit_intent_subscribe`.
    - **Soluzione:** aggiungere chiamate `trackEvent` nei rispettivi componenti.

20. **[P2 / DX+Bundle] Mapbox lazy chunk 1.7 MB (gzip 477 KB)**
    - **Dove:** dist build output.
    - **Problema:** /mappa carica un chunk pesante. Va bene solo se CTR /mappa giustifica il costo.
    - **Soluzione:** monitorare CTR primi 30 giorni. Se < 5% sessioni, valutare lazy condizionale o sostituzione con `react-simple-maps` (gia' presente).

## 6. Top 20 opportunita

> Ordinate per impatto sul brand (clarity + autorevolezza + conversion). Le P0/P1 dei problemi (sez. 5) sono opportunita implicite — qui aggiungo quelle non-bug.

1. **Allineare BRAND_STATS in `src/config/site.ts`** — una singola constant `BRAND_STATS = { ig: 167000, tiktok: 90000, reach: 500000, anni: 8, destinazioni: 27 }` usata da Home, Collaborazioni, MediaKit, ChiSiamo. Risolve P0 #1 e abilita ricaricamento automatico quando i numeri crescono.
2. **OG image per articoli reali Firestore** — generazione build-time o server-side per articoli pubblicati (non solo preview). Effort ~4-6h, valore per CTR social share.
3. **Skill `schema-audit` nuova** — validare coerenza `firestore.rules` ↔ `src/types.ts` ↔ Stripe webhook handler. Previene il bug Firestore permissions emerso oggi.
4. **Skill `docs-consistency` nuova** — validare `AGENTS.md` ↔ skill reali, `DESIGN.md` ↔ CSS vars usati, `MARKETING_OPERATIONS_HUB.md` ↔ analytics events effettivamente trackati.
5. **Modulo BRAND_TRUST centralizzato** — single source of truth per stats, recensioni, social handle, premi. Componente che le 4 pagine consumano.
6. **Lighthouse CI in `predeploy`** — soglie LCP <= 2.5s, INP <= 200ms, CLS <= 0.1, a11y >= 95.
7. **Lead magnet gate Firebase Storage** — PDF servito via URL firmato emesso dopo submit form. Chiude leak attuale + tracking conversion completo.
8. **ExitIntentPopup tracking analytics** — aggiungere `exit_intent_view/dismiss/subscribe`. Misurare valore reale del popup.
9. **Articoli body reali pillar Salento + Dolomiti** — sostituire placeholder "Tutto quello che devi sapere..." con 1800-3000 parole reali. Cluster SEO + autorita editoriale.
10. **Partner outreach kit pre-built** — 1 template email + media kit + offerta tipo, gia' pronto in `docs/MARKETING_OPERATIONS_HUB.md`. Riduce friction R+B per i primi 5 send.
11. **CWV tracking lato client** — gia' presente `src/lib/telemetry.ts` web-vitals, ma niente dashboard. Aggiungere Sentry tag `cwv:<metric>` per filter.
12. **Schema Article + BreadcrumbList per Articolo** — gia' presente, verificare che ogni articolo Firestore lo emetta correttamente. Test con Google Rich Results.
13. **Sticky CTA mobile su /collaborazioni e /media-kit** — gia' presente `StickyMobileCTA` componente; verificare attivazione su pagine B2B.
14. **Reel hero in home** — sostituire placeholder reel widget con reel reale recente. Effort minimo, brand boost.
15. **Search modal con results trackati** — gia' tracking `search_query_submit` + `search_result_click`. Analizzare query reali post-deploy per pillar editoriali emergenti.
16. **Quiz funnel completion email** — quando `quiz_completed` trigger, inviare email con itinerario suggerito + offerta newsletter.
17. **Affiliate dashboard interna** — pagina admin con `affiliate_click` aggregato per brand, periodo, conversione stimata.
18. **A/B test home hero CoupleIntro vs Mappa preview** — useExperiment gia' presente, candidato P1 per ottimizzare CTR primary CTA.
19. **Cache Mapbox tiles via Workbox** — workbox attivo, aggiungere route Mapbox tiles all'`offline-first` strategy.
20. **Sentry breadcrumbs per form submit** — vedere flusso utente che porta a errore con piu' contesto.

## 7. Piano 24 ore

1. **R+B (content):** caricare 3 foto coppia per `CoupleIntro` (orizzontali, min 1600px, formato `.webp`). Vedi `docs/14_Bugs/BUG_HOMEPAGE_PLACEHOLDER_ASSET_R_B.md`.
2. **R+B (content):** elenco 3-5 numeri newsletter reali con link Brevo o slug archivio.
3. **R+B (content):** shortlist 5-7 partner con logo + categoria.
4. **Dev:** committare gitignore + bug ticket + AI_AGENT_STACK update (i 3 fix non-content gia' pronti in working tree).
5. **Dev:** committare le 17 skill canoniche in `.agents/skills/` + sync su `.claude/.github/.cursor/.gemini`.
6. **Dev:** patch script `scripts/check-stripe.mjs` per evitare falso positivo (escludere righe interne a `trackEvent`). Vedi #18.
7. **Owner:** decidere se attivare `data-state="demo"` overlay sui 3 blocchi placeholder finche pending.
8. **Dev:** verificare visivamente `ExitIntentPopup` in browser con cooldown localStorage 30gg, committare.

## 8. Piano 7 giorni

1. **Stripe live:** caricare `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` in env produzione, testare end-to-end con `audit:visual`.
2. **Brevo/Resend live:** `RESEND_API_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID`, `MAIL_FROM`, `MAIL_TO_OWNER` in env. Testare welcome email + media kit + contact notification.
3. **Mapbox:** validare `VITE_MAPBOX_TOKEN` `pk.*` in produzione. Fallback editoriale deve restare attivo se token assente.
4. **OG image articoli reali:** quando si pubblica un articolo Firestore, generare `og/articles/<slug>.webp` con script `generate:og` esteso al loop su collection `articles`. Oggi solo i preview hanno OG dedicato.
5. **Lead magnet PDF:** rigenerare con i 10 luoghi reali R+B in italiano (vedi nota content workflow di MARKETING_OPERATIONS_HUB).
6. **Articolo pillar Salento:** scriverlo, pubblicarlo, linkarlo da `/destinazioni` e dalla home.
7. **Analytics events mancanti:** aggiungere tracking eventi `product_view`, `map_popup_click`, `map_filter_change`, `exit_intent_view`, `exit_intent_dismiss`, `exit_intent_subscribe`. Aggiornare `MARKETING_OPERATIONS_HUB.md` con contract aggiornato.
8. **CWV reali:** lanciare `audit:visual` su preview prod (`vite preview`), registrare LCP/CLS/INP, salvare baseline.

## 9. Piano 30 giorni

1. **TypeScript strict mode:** abilitare `strict: true` in `tsconfig.json`, fixare gradualmente (~20-50 errori probabili). Migliora robustezza forms, Firebase mapping, Stripe payload integrity.
2. **Bundle Mapbox:** valutare se sostituire `mapbox-gl` con `react-simple-maps` per gli use case attuali. Mapbox 1.7 MB lazy va bene se /mappa e' usata; misurare CTR /mappa nei primi 30 giorni post-deploy.
3. **Schema audit skill nuova:** implementare skill `schema-audit` per validare coerenza `firestore.rules` + Stripe webhook handler + `src/types.ts`. Aggiungere a `.agents/skills/` e a `npm run audit:quality`.
4. **Docs consistency skill nuova:** implementare skill `docs-consistency` per validare `AGENTS.md` ↔ skill reali + `DESIGN.md` ↔ componenti CSS vars effettivamente usati.
5. **Partner pipeline attiva:** 5 proposte send entro fine Q3 secondo template di `MARKETING_OPERATIONS_HUB.md`.
6. **Content calendar 2 settimane:** scrivere 1 reel + 1 carousel + 1 newsletter su Salento (pillar), Dolomiti (rifugi coppia), Lago di Como (slow). Tracking `landing_view` con UTM per misurare CTR bio IG/TikTok.
7. **A/B test home hero:** valutare 2 varianti (CoupleIntro vs Mappa preview above-fold) tramite hook `useExperiment` gia presente in `src/hooks/useExperiment.ts:45`.
8. **Lighthouse CI:** integrare `npm run audit:cwv` in pre-deploy con soglie LCP <= 2.5s p75, INP <= 200ms, CLS <= 0.1.

## 10. Fix implementati durante questo audit

1. **[gitignore]** Aggiunti pattern `mappa-*.png`, `map-*.png`, `mappa.png`, `.audit-screenshots/` a `.gitignore`. Rimossi dal git status 22 screenshot mappa non versionati. Verifica: `git status --short` (now clean of map screenshots).
2. **[docs/14_Bugs]** Creato `BUG_HOMEPAGE_PLACEHOLDER_ASSET_R_B.md` con: 3 TODO documentati, asset richiesti a R+B, mitigazione opzionale `data-state="demo"`, verifica checklist.
3. **[agent stack]** Canonizzate 17 skill operative (`audit-ui`, `audit-browser`, `cwv`, `a11y-check`, `responsive-check`, `smoke-test`, `seo-check`, `firebase-check`, `stripe-flow`, `predeploy`, `deploy`, `copywriting-italian`, `new-article`, `new-page`, `social-card`, `design-research`, `animate`) da `.claude/skills/` a `.agents/skills/`. Aggiunto "Project context" block standard a ognuna. Eseguito `npm run sync:agents` (24 skill su 4 target). Eseguito `npm run audit:agents` (PASS, 0 errori).
4. **[docs/AI_AGENT_STACK.md]** Riscritta sezione "Local Skills" in due gruppi: "Strategic & operator skills" (7) + "Operational skills (canonicalized 2026-05-14)" (17). Aggiunto blocco "Claude-only support skills (not canonicalized)" per `bug-triage`, `small-fix`, `deep-refactor`, `quick-review`, `commit`, `explain-module`.
5. **[verifica]** `Articolo.tsx:348` confermato: OG image dinamica per articoli reali e' gia implementata (`articleImage` per Firestore articles, `/og/${slug}.webp` per preview build-time). Nessuna modifica necessaria.
6. **[verifica]** `ExitIntentPopup.tsx` (uncommitted) verificato come refactor completo (`localStorage` cooldown 30gg). Test browser delegato a browser-auditor agent. Da committare dopo conferma visiva.
7. **[CLI tooling]** Nuovo doc [docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md](PROJECT_CLI_TOOLING_INTEGRATION.md) con catalogo 11 CLI integrate opt-in: Lighthouse CI, Unlighthouse, axe-core, gitleaks, size-limit, knip, markdownlint-cli2, Stripe CLI, Firebase Emulators, Sentry CLI, vite-bundle-visualizer. Aggiunti 11 nuovi `npm run` script al [package.json](../../package.json) (`audit:cwv`, `audit:bulk`, `audit:a11y`, `audit:secrets`, `audit:size`, `audit:bundle:viz`, `audit:deps`, `lint:md`, `webhook:listen`, `emulators`, `release:sentry`). Tutti opt-in (no break su `audit:quality`).
8. **[agent stack]** Aggiornate 4 skill canoniche (`cwv`, `a11y-check`, `stripe-flow`, `firebase-check`) con sezione "Local CLI alternative" che cita i nuovi script. Sync su `.claude/`, `.github/`, `.cursor/`, `.gemini/` via `npm run sync:agents`. `npm run audit:agents` PASS post-modifiche.
9. **[doc update]** [docs/AI_AGENT_STACK.md](../AI_AGENT_STACK.md) esteso con sezione "CLI Tooling (2026-05-14)" + matrice CLI.
10. **[verifica stats falso positivo]** Owner ha confermato visivamente che le statistiche home (`500K+/167K+/90K+/150+`) renderizzano correttamente. [BUG_HOMEPAGE_STATS_INCONSISTENT](../14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md) chiuso come falso positivo del browser-auditor (Playwright snapshot vs AnimatedCounter timing). Residuo P3 a11y + P2 tooling.

## 11. Fix da approvare (NON implementati senza green light)

1. **`scripts/check-stripe.mjs` patch del falso positivo** — la regex `body:\s*JSON\.stringify\(\{[\s\S]*price:` matcha anche dentro `trackEvent('begin_checkout', { ..., price: item.price, ... })` che e' contenuto in CartDrawer.tsx prima del fetch a `/api/create-checkout-session`. Fix proposto: limitare il match a `body:\s*JSON\.stringify\(\{[^}]*price:` (no `[\s\S]*` greedy) oppure escludere righe interne a `trackEvent(`. Tocca uno script di audit, basso rischio ma richiede review.
2. **Articolo OG image per articoli reali con cover migliore** — quando l'autore non carica cover articolo, il fallback e' `/og/default.webp`. Considerare generazione dinamica server-side OG con titolo + hero come @vercel/og. Effort ~4h, valore per CTR social share.
3. **Bundle Mapbox / fallback** — se Mapbox usage post-deploy e' basso (<10% sessioni), considerare lazy con fallback statico. Effort ~6h, riduce LCP /mappa.
4. **TypeScript strict mode** — abilitare progressivo `strict: true` in tsconfig. Effort 8-16h iniziali + manutenzione, beneficio robustezza alta. Vedi piano 30 giorni.
5. **Skill nuove: `schema-audit` e `docs-consistency`** — vedi piano 30 giorni.

## 12. Comandi eseguiti e risultati

```
$ npm run typecheck         # PASS
$ npm run audit:agents      # 7 canonical, 0 errors, 0 warnings (pre-canonization)
$ npm run audit:ui          # 0 errors, 94 warnings (admin palette + motion inline styles)
$ npm run audit:firebase    # 0 errors, 0 warnings
$ npm run audit:stripe      # 8 PASS, 1 FAIL (falso positivo regex su trackEvent in CartDrawer)
$ npm run build             # PASS, 26.97s, 87 precache entries (4.5 MB), mapbox 1.7MB lazy
$ npm run sync:agents       # PASS synced 24 skills to 4 agent directories
$ npm run audit:agents      # PASS 24 canonical, 0 errors (post-canonization)
```

Browser audit Playwright (10 pagine, 3 viewports): vedi sezione browser audit dedicata.

## 13. Documenti aggiornati

- **NUOVO** [docs/10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md](PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md) (questo file)
- **NUOVO** [docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md](PROJECT_CLI_TOOLING_INTEGRATION.md) — catalogo CLI 2026, script opt-in, matrice priorita
- **NUOVO** [docs/14_Bugs/BUG_HOMEPAGE_PLACEHOLDER_ASSET_R_B.md](../14_Bugs/BUG_HOMEPAGE_PLACEHOLDER_ASSET_R_B.md)
- **NUOVO** [docs/14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md](../14_Bugs/BUG_HOMEPAGE_STATS_INCONSISTENT.md) (**P0** — emerso da browser audit)
- **NUOVO** [docs/14_Bugs/BUG_FIRESTORE_ARTICLES_PERMISSIONS.md](../14_Bugs/BUG_FIRESTORE_ARTICLES_PERMISSIONS.md) (**P0** — emerso da browser audit)
- **AGGIORNATO** [docs/AI_AGENT_STACK.md](../AI_AGENT_STACK.md) (sezione Local Skills riscritta + 17 skill canonizzate + sezione CLI Tooling)
- **AGGIORNATO** [.gitignore](../../.gitignore) (pattern screenshot mappa)
- **AGGIORNATO** [package.json](../../package.json) — aggiunti 11 script opt-in: `audit:cwv`, `audit:bulk`, `audit:a11y`, `audit:secrets`, `audit:size`, `audit:bundle:viz`, `audit:deps`, `lint:md`, `webhook:listen`, `emulators`, `release:sentry`
- **CREATI** 17 file SKILL.md canonici in `.agents/skills/` + 68 file sincronizzati in `.claude/`, `.github/`, `.cursor/`, `.gemini/`

## 14. Rischi residui

1. ~~**Statistiche "0K+" in home + collaborazioni**~~ — **CHIUSO** (falso positivo Playwright vs `AnimatedCounter`). Residuo P3 a11y.
2. **FirebaseError permissions su articoli reali** — **P0** content discovery rotto in prod. Vedi #2 sezione 5.
3. **Asset placeholder R+B in 3 componenti home** — **P0** brand clarity.
4. **Testo "(demo)" visibile pubblicamente nella partner strip** — **P0** trust.
5. **`.env.production` non configurato** — Stripe live, Resend, Brevo, Mapbox token. Senza, lead capture cade in fallback localStorage ma email non parte, Stripe non addebita. **P0** revenue.
6. **Slug articolo demo linkato in home → 404** — `/articolo/dolomiti-rifugi-coppia` non esiste in Firestore. **P1**.
7. **/lead-magnet PDF accessibile senza email gate** — funnel bypassabile. **P1** revenue/lead.
8. **Label form non semantiche** su /media-kit e /contatti — **P1** a11y.
9. **Honeypot mancante su /media-kit** — **P1** spam B2B.
10. **Asset 404 in console** su /vieni-con-noi e /lead-magnet — **P1** asset path errato.
11. **Mapbox tiles non caricano in dev** — **P1** in dev, da verificare in staging/prod con token.
12. **Font Fraunces preloaded ma non usato entro load** — **P1** LCP spreco.
13. **Heading gap h1→h3/h4** in /contatti, articolo sidebar, footer — **P2** a11y.
14. **Articolo body solo placeholder** ("Tutto quello che devi sapere...") — **P2** content.
15. **TypeScript non strict** — possibile drift su nuovi tipi Firestore. **P2** robustezza.
16. **`audit:stripe` script falso positivo** — non blocca tecnicamente, ma confonde release manager. **P2** DX.
17. **Mapbox 1.7 MB bundle** — accettabile se /mappa CTR > 5% sessioni. **P3** da misurare.
18. **Analytics events mancanti** (`product_view`, `map_popup_click`, `exit_intent_*`) — **P2** funnel measurement.

## 15. Raccomandazione finale

**Verdetto: NON pronto per deploy V2 oggi.** Dopo verifica owner, i P0 reali scendono da 4 a 3 (il bug stats "0K+" e' confermato falso positivo del browser audit). Rimangono comunque blocchi sostanziali.

**Blocchi P0 da risolvere (24-48h, ordine):**

1. **Fix Firestore rules per articoli pubblicati** — articoli con `published: true` devono essere leggibili da utenti anonimi. Verificare auth state in `fetchArticleBySlug`. Effort 2-4h.
2. **Rimuovere "(demo)" dal testo pubblico** in PartnerLogosStrip + caricare i 3 asset reali R+B (foto coppia, archivio newsletter, partner shortlist). Effort R+B (asset) + 1h dev.
3. **Configurare `.env.production`** — RESEND, BREVO, STRIPE, MAPBOX, GA. Effort R+B + 30min dev.

**Blocchi P1 prima del lancio pubblico (7gg):**

- Slug `/articolo/dolomiti-rifugi-coppia` esistente (creare o riallineare link)
- Label form semantiche `/media-kit` + `/contatti`
- Honeypot `/media-kit`
- /lead-magnet PDF gate (Firebase Storage signed URL o token cookie)
- Asset 404 fix (path immagine sfondo)
- Font Fraunces preload strategy
- Mapbox token verificato in staging

**Pronto al deploy oggi:** stack tecnico (build PASS, types PASS, rules PASS, agent stack PASS), 36 rotte, SEO base, OG dinamica articoli preview, motion, accessibility primitives, 24 skill canoniche, 8 funnel commerciali tracciati.

**Tempo stimato a release con tutti i P0+P1 chiusi:** 5-7 giorni lavorativi se R+B carica asset entro 48h e env e' configurato entro 24h.

**Recommendation matrix:**

| Scenario                          | Quando       | Rischio                                                                                               |
| --------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| Deploy V2 oggi                    | 14-may-2026  | **ALTO**: home con "0K+", articoli rotti, partner "(demo)" — danno reputazionale > vantaggio velocita |
| Deploy V2 in 48h con P0 chiusi    | ~16-may-2026 | **MEDIO**: P1 a11y/form/lead-magnet leak ancora aperti, ma funnel funzionante e brand clarity OK      |
| Deploy V2 in 7gg con P0+P1 chiusi | ~21-may-2026 | **BASSO**: release di qualita coerente con la maturita dichiarata                                     |

**Raccomandazione operativa:** **target deploy 21-may-2026** (7 giorni), con preview staging attivo entro 16-may-2026 per content review R+B.

---

## 16. Browser audit Phase 3 — sommario per pagina

> Eseguito via `browser-auditor` agent con Playwright MCP su dev server localhost:3000. 10 pagine × 3 viewports (375 / 768 / 1440). Tutti i dettagli (console, a11y tree, responsive, brand, conversion, LCP, priorita) sono nel transcript Playwright dell'agent. Sintesi qui:

| Pagina                             | Console err           | H1           | Overflow mobile | CTA above fold 375 | Note critiche                                                                                   |
| ---------------------------------- | --------------------- | ------------ | --------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `/` Home                           | 0 (1 warn font)       | 1            | no              | si                 | "0K+" stats P0, "(demo)" partner P0, font Fraunces preload waste                                |
| `/mappa`                           | 0                     | 1            | no              | si                 | Tiles non caricano (token), filtri OK, fallback editoriale attivo                               |
| `/collaborazioni`                  | 0                     | 1            | no              | si                 | "0K+" stats P0, FAQ + sezione "Quello che non facciamo" forte                                   |
| `/media-kit`                       | 0                     | 1            | no              | si                 | Numeri reali (167K+/90K+/500K+) **coerenti**, label form non semantiche P1, honeypot assente P1 |
| `/vieni-con-noi`                   | 1 (asset 404)         | 1            | no              | si                 | Standalone OK, honeypot OK, asset 404 P1                                                        |
| `/articolo/dolomiti-rifugi-coppia` | 3 (Firebase x2 + 404) | 1 (404 page) | n/a             | n/a                | **P0 Firestore permissions errors**, slug non esistente                                         |
| `/articolo/guida-bali`             | 1 (asset)             | 1            | no              | si                 | Body placeholder visibile P2, correlati placeholder P2, sidebar h4 gap                          |
| `/shop`                            | 0                     | 1            | no              | si                 | Boutique-in-apertura coerente, demo OK                                                          |
| `/chi-siamo`                       | 0 (1 warn font)       | 1            | no              | si                 | **Pagina piu' forte del sito**, stats reali coerenti, foto con alt                              |
| `/contatti`                        | 0                     | 1            | no              | si                 | Honeypot OK, label non semantiche P1, h1→h3 gap P1                                              |
| `/lead-magnet`                     | 1 (asset)             | 1            | no              | si                 | Bypassabile senza email P1, h1→h3 gap P2                                                        |

### ExitIntentPopup

Test passivo (9 secondi attesa): popup NON apparso. Mouse-exit non dispatchabile via Playwright in sicurezza. **Verifica manuale richiesta** prima del commit di `src/components/ExitIntentPopup.tsx` (uncommitted). Suggerimento: aggiungere data-attribute `data-test="exit-intent-trigger"` per test E2E.

### Coerenza statistics (P0 root cause confermato)

- `/` → "0K+" follower / "0+" destinazioni
- `/collaborazioni` → "0K+" proof numbers
- `/media-kit` → "167K+ IG" / "90K+ TikTok" / "500K+ reach"
- `/chi-siamo` → "8 anni" / "167K+ IG" / "90K+ TikTok"

→ **Fonte diversa per home/collab vs media-kit/chi-siamo.** Probabile: home/collab leggono da Firestore (vuoto in dev), gli altri usano hardcoded. Soluzione in #1 sezione 5.
