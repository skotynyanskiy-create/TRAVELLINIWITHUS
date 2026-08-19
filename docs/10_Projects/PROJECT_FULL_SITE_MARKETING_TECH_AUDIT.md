---
type: project
area: site
status: archived
owner: skotxx
created: 2026-05-14
updated: 2026-06-07
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
superseded_by: PROJECT_BACKLOG_UNICO_2026-07-31
---

> **Superato il 2026-07-31.** Questo piano non è più "cosa fare".
> Il lavoro ancora vivo è confluito in [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]; la direzione è in `PROJECT_BACKLOG_UNICO_2026-07-31`.
> Resta leggibile come storico — non aggiungerci voci nuove.

# PROJECT — Full site / marketing / tech / agent-stack audit

> Audit operativo multidisciplinare ri-eseguito il **2026-06-07** come team senior integrato (webmaster + frontend React/TS + technical SEO + design director + brand + marketing + social + growth/partnership + a11y/perf + analytics + agent-stack architect). Questa revisione **supersede** lo snapshot 2026-05-14. Metodo: lettura codice + docs, esecuzione reale dei gate tecnici, 5 agenti specialisti in parallelo (mappa codice, UX/brand, marketing/revenue, SEO, social). READ-ONLY salvo 2 fix documentali sicuri (sezione 10).

---

## 1. Executive summary

Il sito è **tecnicamente pronto al deploy** e **commercialmente inerte**. Tutti i gate di codice passano (typecheck, build, lint, test 10/10, audit:ui/firebase/stripe/revenue/agents/size/public-footprint). L'infrastruttura di funnel (lead capture, media kit, affiliate, shop, analytics) è **costruita ma non attivata**: il collo di bottiglia non è codice, sono ~7h di azioni owner (env keys delivery email, PDF lead magnet con 10 luoghi reali, 4 signup affiliate, bio social aggiornate, foto reali R&B) più la rotazione/restrizione della Firebase Web API key su GCP.

Tre verità emerse dalla riconciliazione cross-agente:

1. **Activation gate è la leva #1.** Senza `RESEND_API_KEY`/`BREVO_API_KEY`, chi si iscrive non riceve nulla — rottura di fiducia sul segmento più caldo. `buildAffiliateLink` è scritto ma **mai importato** da nessuna pagina: l'attribuzione affiliate è interamente inerte e `/risorse` usa URL hardcoded (4 nudi, senza partner ID). Zero revenue possibile finché non si collega.
2. **Il brand people-led non è ancora mostrato.** Gli asset "umani" riciclano 3 sole immagini AI/placeholder (`couple-travel.webp`, `about-editorial.webp`, `collab-work.webp`) su hero, polaroid, Instagram fallback e card collab. Una coppia people-led senza un volto reale verificabile contraddice la promessa "provato sul posto".
3. **Il contenuto editoriale reale è in larga parte ancora preview/DEMO/noindex.** Gli asset già scritti (pillar Puglia trulli-masserie, Salento agosto, Sicilia orientale) vanno trasformati in articoli pubblicati e indicizzabili per costruire il silo Sud Italia. Senza, ogni ottimizzazione SEO gira a vuoto.

**Verdetto deploy:** il codice può andare in produzione, ma il deploy pubblico resta **BLOCCATO** da: (a) secret history GCP da ruotare/restringere (owner), (b) `VITE_FIREBASE_API_KEY` da impostare in env produzione. Raccomandazione: chiudere prima i 2 blocker di sicurezza + i 2 P0 brand (foto reali, promessa nav Shop/Club), poi deploy; in parallelo chiudere l'activation gate per non lanciare un funnel muto.

---

## 2. Stato generale del sito

| Asse                  | Stato                     | Note                                                                                                                                                    |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tipi / build          | **PASS**                  | `tsc --noEmit` clean (exit 0). `vite build` PASS (exit 0), bundle budgets passati.                                                                      |
| Lint / Test           | **PASS**                  | eslint clean, vitest 4 file / 10 test passati.                                                                                                          |
| UI consistency        | **PASS (warn)**           | `audit:ui` 0 errori; warning su `LeadMagnetDocument.tsx` (react-pdf, raw color intenzionali) + raw color in `Collaborazioni`/`CoupleIntro` (vedi P-08). |
| Firebase rules        | **PASS**                  | `audit:firebase` 0/0. `audit:revenue` 6/6 (orders server-side, idempotenza, fail-closed).                                                               |
| Stripe integrity      | **PASS**                  | `audit:stripe` 8/8 (rate-limit, webhook signature, payload senza prezzi).                                                                               |
| Agent stack           | **PASS**                  | `audit:agents` 18 skill canoniche, 0 errori, sincronizzate.                                                                                             |
| Bundle size           | **PASS**                  | home 5.4 KB gz, articolo 22.5 KB gz; total lazy 1.88 MB gz tracciato.                                                                                   |
| Public footprint      | **PASS (2 warn)**         | `VITE_FIREBASE_API_KEY` non in shell (atteso); secret history da ruotare (owner).                                                                       |
| Routing               | **PASS**                  | ~42 rotte pubbliche full-mode (`VITE_LITE_MODE=false`), tutte lazy + SEO.                                                                               |
| Lead capture (wiring) | **PASS**                  | form + fallback localStorage + 40+ eventi analytics.                                                                                                    |
| Lead capture (attivo) | **FAIL**                  | delivery email OFF (env mancanti); welcome email/PDF non partono.                                                                                       |
| Affiliate revenue     | **FAIL**                  | `buildAffiliateLink` mai usato; 4/6 signup mancanti; link hardcoded nudi.                                                                               |
| Content reale R&B     | **WARN**                  | pillar già scritti ma non pubblicati; landing regione noindex/DEMO; proof library vuota.                                                                |
| Asset umani reali     | **FAIL**                  | 3 immagini AI/placeholder riciclate; nessun volto reale verificabile.                                                                                   |
| Perf / CWV (live)     | **N/A (non ri-misurato)** | lavoro CWV storico esteso (LCP -84%, SW precache -3.75 MB); non ri-tracciato live in questa sessione.                                                   |
| A11y (live)           | **N/A (non ri-eseguito)** | `audit:a11y` storicamente 0 violazioni; contrasti già corretti; non ri-run questa sessione.                                                             |
| Sicurezza deploy      | **BLOCKED**               | secret history GCP + `VITE_FIREBASE_API_KEY` env (owner).                                                                                               |

---

## 3. Punteggi (1-10)

| Asse                    | Voto    | Razionale                                                                                                                                                                         |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand clarity           | **8.0** | Hero risponde a chi/cosa/perché-fidarsi; posizionamento couple-led Sud Italia netto. Penalizza la frammentazione delle prove e incoerenza cronologica (2016/2017/2018, "8 anni"). |
| UX/UI                   | **7.5** | Gerarchia hero curata, mega-menu editoriale, media kit funnel forte. Penalizzano densità home (11 sezioni, 5 di conversione) e empty-state Shop/Club dietro la nav.               |
| Technical quality       | **9.0** | Tutti i gate PASS, stack moderno, audit suite ampia, revenue contract verificato. Margine solo su perf/a11y non ri-misurati live.                                                 |
| SEO                     | **7.0** | Base AI-search sopra media (entity Wikidata, speakable, Person @graph, llms.txt). Penalizzano FAQ schema assente, meta home generica, landing regione noindex/DEMO.               |
| Performance             | **8.5** | Bundle budget PASS, lavoro CWV storico forte. Non ri-misurato live → voto su base statica.                                                                                        |
| Accessibility           | **8.0** | Form condivisi, focus states, contrasti corretti storicamente. Non ri-validato live questa sessione.                                                                              |
| Conversion              | **6.0** | Funnel ben progettato ma inerte: delivery OFF, affiliate scollegato, lead magnet PDF non compilato.                                                                               |
| Social / content engine | **6.5** | Sistema repurpose progettato (template Puglia pronto), ma proof library vuota e contenuti non pubblicati.                                                                         |
| Partnership readiness   | **6.5** | Media kit funnel è il migliore del sito; manca 1 proof salvata e la shortlist 5 categorie.                                                                                        |
| Agent stack maturity    | **9.0** | 17 agent + 18 skill canoniche + skill editoriali + 8 MCP + audit suite. Gap: skill editoriali non promosse cross-tool; manca audit analytics/affiliate.                           |

**Media ponderata indicativa: 7.4 / 10** — "premium-ready sul codice, pre-attivazione sul business".

---

## 4. FAIL / WARN / PASS (gate eseguiti 2026-06-07)

**PASS:** `typecheck` · `build` · `lint` · `test` (10/10) · `audit:ui` (0 err) · `audit:firebase` (0/0) · `audit:stripe` (8/8) · `audit:revenue` (6/6) · `audit:agents` (18, 0 err) · `audit:size` · `audit:public-footprint` (core PASS).

**WARN:** `audit:ui` raw-color react-pdf + Collaborazioni/CoupleIntro · `audit:public-footprint` `VITE_FIREBASE_API_KEY` non in shell + secret history da ruotare.

**FAIL / BLOCKED (owner, non di codice):** `audit:secrets` leak storico GCP in git history (BLOCKED deploy) · delivery email lead (env) · affiliate revenue (signup + wiring).

**Non eseguiti questa sessione (richiedono dev server / browser):** `audit:visual`, `audit:a11y`, `audit:cwv`, `audit:browser` — storicamente PASS; ri-eseguire prima del deploy come da gate canonico S6.

---

## 5. Top 20 problemi prioritari

Formato: **Priorità · Area · Dove · Problema → Soluzione · Verifica**

1. **P0 · Sicurezza · git history / GCP** — Firebase Web API key leakata in 3 commit storici (`audit:secrets` FAIL). → Ruotare/restringere la key su GCP (HTTP referrer + API allow-list + App Check), impostare `VITE_FIREBASE_API_KEY` in env prod, decidere se riscrivere history. · Verifica: `audit:secrets` post-rotazione + GCP console. **(owner, blocca deploy)**
2. **P0 · Marketing · `.env.production`** — Delivery email OFF: chi si iscrive non riceve welcome email né PDF. → Impostare `RESEND_API_KEY` + `BREVO_API_KEY` + `BREVO_LIST_ID`, test end-to-end iscrizione→email→PDF 200. · Verifica: ciclo completo manuale. **(owner)**
3. **P0 · Revenue · `src/lib/affiliateLink.ts` + `Risorse.tsx`** — `buildAffiliateLink` mai importato; link hardcoded, 4 nudi senza partner ID → zero attribuzione/commissione. → Completare 4 signup (Skyscanner/Booking/Airalo/Revolut), mettere ID in env, migrare `Risorse.tsx` (+ articoli) a `buildAffiliateLink`. · Verifica: grep import + click test con UTM. **(owner signup → frontend-builder)**
4. **P0 · UX/Brand · Hero / CoupleIntro / InstagramGrid** — 3 immagini AI/placeholder riciclate come unico asset "umano". → Sostituire con 5-6 foto reali R&B distinte; evitare ripetizione stesso file. · Verifica: asset-curator selezione/crop/alt. **(owner foto → asset-curator)**
5. **P0 · UX/Brand · Navbar Shop/Club** — Voci top-nav di pari grado ma empty-state pre-lancio dietro (`/club` "buco bianco" doc-tracked). → Completare empty-state credibile o degradare a label "In arrivo". · Verifica: `browser-auditor` su `/shop` `/club`.
6. **P0 · Content/Lead · `public/lead-magnet-posti-italiani.pdf`** — Promessa "10 posti" non coperta da contenuto reale compilato. → Compilare i 10 luoghi reali (guideline in `docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md`), rigenerare PDF. · Verifica: download + contenuto. **(owner)**
7. **P0 · SEO · `seo.ts` + `Articolo.tsx`** — Nessun builder FAQPage schema: persa opportunità #1 di featured snippet + AI Overviews. → Aggiungere `buildFaqPageJsonLd()` e popolarlo dagli articoli. · Verifica: Rich Results Test. **(da approvare → frontend-builder/backend per schema)**
8. **P1 · SEO · `index.html` meta description** — Home description generica, zero keyword geo/intent. → Riscrivere 140-160 char couple/Sud Italia (bozza in §11). · Verifica: SERP preview.
9. **P1 · SEO · `Destinazione.tsx` + sitemap** — Landing regione (puglia, sicilia…) noindex/DEMO: hub naturali per query head "viaggio in [regione]" sono peso morto. → Popolare con contenuto reale `/destinazione/puglia` e `/sicilia`, togliere noindex, `REGION_LANDINGS_PUBLISHED=true`. **Non** sbloccare con DEMO. · Verifica: URL Inspection.
10. **P1 · UX/Brand · `Collaborazioni.tsx:705-740`** — Violazione DESIGN.md: `radial-gradient` decorativo + `animate-pulse` su pagina B2B che deve trasmettere serietà editoriale. → Rimuovere gradient/pulse, fondo `--color-ink` pulito. · Verifica: `audit:ui` + visivo.
11. **P1 · UX/Brand · `Collaborazioni.tsx` + `CoupleIntro.tsx`** — Raw color `text-black/xx`, `bg-neutral-50` invece dei token (DESIGN.md vieta). Incoerenza con ChiSiamo (corretto). → Migrare a `--color-ink-2`/`--color-muted-fg`. · Verifica: `audit:ui` raw-color.
12. **P1 · Brand · `config/site.ts`** — `engagementRate: '6.5%'` hardcoded senza fonte; numeri proof ripetuti con 4-5 framing. → Verificare 6.5% con export Meta/TikTok o rimuovere; gerarchizzare le prove per sezione. · Verifica: data-analyst su export reali. **([VERIFY])**
13. **P1 · Marketing · `MediaKit.tsx`** — Numeri reach/engagement marcati "da aggiornare in call" + form a campi obbligatori al primo contatto. → Form a 2 step (email+azienda+focus → poi budget/periodo), range dichiarato con data snapshot, 1 proof verificabile sopra al form. · Verifica: browser-auditor mobile.
14. **P1 · Marketing · Partnership** — Nessuna proof salvata prima dell'outreach (regola hard hub); shortlist 5 categorie vuota. → Salvare proof Castelli del Ducato (già pubblico) in `docs/12_Partnerships/proof/`, compilare shortlist nomi reali. · Verifica: doc popolati. **(owner)**
15. **P1 · UX · `Home.tsx`** — 11 sezioni, 5 di conversione che competono: nessuna CTA dominante sotto la fold. → Accorpare LeadMagnet+NewsletterFeature e MonetizationTeaser+CollaborationCta; una CTA per fascia. · Verifica: decisione editoriale/growth. **([VERIFY] n. articoli reali)**
16. **P1 · SEO/E-E-A-T · `seo.ts` vs `index.html`** — Autori articolo sono Person "magri"; `buildAuthorPersonJsonLd` probabile dead code; jobTitle discordanti tra fonti. → Far convergere autori sugli `@id` globali `#rodrigo`/`#betta`. · Verifica: grep consumer + Rich Results.
17. **P2 · Content/Social · Proof library** — `CONTENT_PROOF_LIBRARY` vuota (`[R&B INPUT]`): impossibile alimentare schede sito/proof partner e misurare social→sito. → Compilare top 20 (URL reel + metriche reali). **(owner)**
18. **P2 · SEO · `Itinerari.tsx` title** — "Itinerari di viaggio in Italia e nel mondo" iper-competitivo e disallineato (couple/Sud Italia). → Restringere title/meta, lasciare H1 evocativo. · Verifica: pre-riapertura.
19. **P2 · SEO · sitemap priority piatta 0.8** — Legali in sitemap a 0.8 come i contenuti: gerarchia sprecata. → Parametrizzare priority per tipo in `generate-sitemap.js`, escludere/abbassare legali e `/mappa`. · Verifica: rigenera sitemap.
20. **P2 · UX · `HeroSection.tsx:140-162`** — CTA secondaria "Ultime guide" → `/#storie`: anchor potenzialmente inesistente in `Home.tsx`. → Verificare `id="storie"` o ripuntare a `/esplora?format=guida`. · Verifica: `browser-auditor` click test.

> Risolti in questa sessione (fix documentali, §10): drift **llms.txt / llms-full.txt** (dichiaravano lite mode con /esplora·/itinerari·/shop·/club·/preferiti "non pubblicati" mentre il repo è full-mode `VITE_LITE_MODE=false` e la sitemap li include).

---

## 6. Top 20 opportunità

1. **P0** Chiudere activation gate lead magnet (env Resend/Brevo + PDF reale) → sblocca l'unico asset owned scalabile.
2. **P0** Aggiornare bio IG/TikTok con `/vieni-con-noi?utm_source=ig_bio|tt_bio` → cattura il traffico social oggi non tracciato.
3. **P0** Collegare `buildAffiliateLink` + 4 signup → primo € affiliate entro 30gg.
4. **P1** Pubblicare il pillar **Puglia trulli-masserie** (pacchetto repurpose già draftato) + **Salento agosto** → ingresso SEO evergreen + magnete affiliate in-content.
5. **P1** CTA lead magnet **inline negli articoli** (`Newsletter variant="article"` già esiste) → intercetta il lettore SEO, il lead più caldo.
6. **P1** Salvare 1 proof/case study prima dell'outreach → +reply rate partner.
7. **P1** Riaprire `/destinazione/puglia` e `/sicilia` con contenuto reale → hub di silo che cattura le query head.
8. **P1** FAQPage schema sugli articoli → featured snippet + citazioni AI Overviews/Perplexity.
9. **P1** Aggiungere download PDF media kit + one-pager pubblico no-gate → abbassa la frizione B2B.
10. **P2** Standardizzare l'analytics event contract (§ marketing) → decidere su dati, non a sensazione.
11. **P2** Newsletter mensile reale (ritmo retention) appena la lista è attiva.
12. **P2** Aprire waitlist shop 1 SKU MVP (no Stripe live) → validare prezzo verso soglia 20 nominativi.
13. **P2** Template OG riusabile (sand `#F2EDE6`, Fraunces 500) replicato su tutti i pillar.
14. **P2** Reel screen-capture di `/mappa` e `/strumenti` → asset proprietari che IG non possiede.
15. **P2** Reel "pinned" stabile "10 posti italiani, gratis in bio" → flusso continuo verso la lista.
16. **P3** Cluster stagionali anticipati dal content calendar (foliage non-Dolomiti, mare onesto) → compounding SEO.
17. **P3** Monogramma/mark brand in navbar/OG → memorabilità.
18. **P3** WhatsApp CTA tracciata su media kit (canale ad alta risposta per partner IT).
19. **P3** Auto-reply qualificato per fascia budget sui lead media kit.
20. **P3** Promuovere le skill editoriali a `.agents/skills` (cross-tool) dopo validazione operativa.

---

## 7. Piano 24 ore (owner, costo zero)

- [ ] Aggiornare **bio IG + TikTok** con link `/vieni-con-noi?utm_source=ig_bio|tt_bio` (15 min).
- [ ] **Autorizzare il case study Castelli del Ducato** (già pubblico) come proof partner.
- [ ] Decidere la **SKU shop MVP** (Puglia 19,90€ / Trentino 14,90€) per la waitlist.
- [ ] (Owner GCP) Avviare **rotazione/restrizione Firebase Web API key** — è il blocker deploy.
- [ ] Confermare il valore reale di **`engagementRate`** o rimuoverlo dal sito finché non verificato.

## 8. Piano 7 giorni (chiusura activation gate + quick win editoriale)

- [ ] Compilare il **PDF "10 posti italiani"** con luoghi reali (~5h R&B).
- [ ] Impostare **`RESEND_API_KEY` + `BREVO_API_KEY` + `BREVO_LIST_ID`** in env prod + test end-to-end.
- [ ] Completare i **4 signup affiliate** (~90 min) e mettere gli ID in env.
- [ ] **Pubblicare il pillar Puglia trulli-masserie** (pacchetto repurpose già pronto) + finalizzare caption carousel.
- [ ] Compilare la **shortlist 5 categorie partner** con nomi reali.
- [ ] Caricare almeno **2-3 foto reali R&B** per hero/ChiSiamo/CoupleIntro.
- [ ] Rieseguire i gate browser (`audit:visual`, `audit:a11y`, `audit:cwv`, `browser-auditor`) prima del deploy.

## 9. Piano 30 giorni (attivazione revenue + outreach + SEO compounding)

- [ ] Migrare `/risorse` + articoli a **`buildAffiliateLink`** (post-signup).
- [ ] Pubblicare **pillar Salento** + **Sicilia orientale** costruendo il silo Sud Italia.
- [ ] Riaprire **landing regione** Puglia/Sicilia con contenuto reale (no DEMO) + togliere noindex.
- [ ] Implementare **FAQPage schema** + convergere autori su `@id` globali.
- [ ] Inviare le prime **2-3 proposte partner** (target pipeline 5 entro 30/09) dopo aver salvato la proof.
- [ ] Aprire **waitlist shop MVP** (no Stripe live), misurare verso 20.
- [ ] Far girare **`travellini-data-analyst`** sui primi 2-4 settimane di dati post-attivazione per fissare i baseline CR e i kill criteria (oggi tutti [VERIFY]).
- [ ] Compilare **CONTENT_PROOF_LIBRARY** top 20.

---

## 10. Fix implementati in questa sessione

| Fix                                                                                                                                                                                             | File                                                         | Tipo                 | Stato                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------- | ------------------------------ |
| Sync llms.txt allo stato full-mode (rimossa nota lite stale 2026-05-28; aggiunti /esplora·/itinerari come autoritativi; /shop·/club riclassificati commerciali/funzionali)                      | `public/llms.txt`                                            | SEO/AI doc, sicuro   | ✅                             |
| Sync llms-full.txt allo stato full-mode (stessa correzione)                                                                                                                                     | `public/llms-full.txt`                                       | SEO/AI doc, sicuro   | ✅                             |
| Meta description home riscritta on-brand couple/Sud Italia (P1-08)                                                                                                                              | `index.html`                                                 | SEO metadata, sicuro | ✅                             |
| Sitemap priority differenziata per ruolo (P2-19): home 1.0 · discovery 0.9 · brand/B2B 0.8 · risorse 0.7 · utility/press/map 0.6 · club 0.5 · legali 0.3 (prima tutto 0.8). Sitemap rigenerata. | `scripts/generate-sitemap.js`, `public/sitemap.xml`          | SEO, sicuro          | ✅                             |
| Collaborazioni: rimosso radial-gradient decorativo + animate-pulse (DESIGN.md), migrate 16 raw color → token (P1-10, P1-11)                                                                     | `src/pages/Collaborazioni.tsx`                               | UI quality           | ✅ (typecheck + audit:ui PASS) |
| CoupleIntro: migrate 4 raw color → token (P1-11)                                                                                                                                                | `src/components/home/CoupleIntro.tsx`                        | UI quality           | ✅                             |
| Itinerari: title SEO ristretto a "Itinerari di viaggio in coppia nel Sud Italia" (P2-18)                                                                                                        | `src/pages/Itinerari.tsx`                                    | SEO copy             | ✅                             |
| Audit consolidato 2026-06-07 (questo documento)                                                                                                                                                 | `docs/10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md` | doc                  | ✅                             |

Razionale llms.\*: dichiaravano agli LLM di non citare /esplora·/itinerari·/shop·/club·/preferiti come "temporaneamente non pubblicati", ma il repo è full-mode (`.env.example` `VITE_LITE_MODE=false`, `src/config/liteMode.ts`, `public/sitemap.xml` include /esplora e /club). Drift documentazione→stato reale: fix sicuro e reversibile.

**Falso positivo chiarito:** P2-20 (CTA hero "Ultime guide" → `/#storie` anchor inesistente) **NON è un bug**: la sezione `id="storie"` esiste in `src/components/home/LatestArticles.tsx:59` e il deep-link è gestito da `src/components/ScrollToTop.tsx`. Nessun fix necessario.

Implementati via routing corretto: fix metadata/script dal main thread; fix UI multi-file da `travellini-frontend-builder` (typecheck PASS, audit:ui pulito sui file toccati). NON implementati (owner/data/redesign/tracking): vedi §11.

---

## 11. Fix da approvare (NON implementati — richiedono OK owner/redesign)

- **FAQPage schema** su articoli (`seo.ts`, `Articolo.tsx`) — tocca generazione schema, valutare campo `faq[]`. (P0-07)
- **Affiliate wiring** (`Risorse.tsx` → `buildAffiliateLink` + props `partner`/`position`) — owner-gated (serve signup IDs) e tocca tracking: patch plan, non unilaterale. (P0-03)
- **Home**: accorpamento sezioni lead/revenue (redesign) → decisione growth+editorial. (P1-15)
- **MediaKit**: form a 2 step + download PDF (modifica funnel) → growth. (P1-13)
- **Landing regione** riapertura con contenuto reale → editorial + frontend. (P1-09)
- **Coerenza cronologica brand** (2016/2017/2018, "8 anni") da fissare in `config/site.ts` → owner conferma date reali. (P2)
- **engagementRate 6.5%** — verificare con export Meta/TikTok o rimuovere → owner data. (P1-12)

---

## 12. Agent stack recommendations

Stack già **maturo** (17 agent in `.claude/agents`, 18 skill canoniche in `.agents/skills`, skill Claude-local + editoriali, 8 MCP). Gap reali:

1. **P2 · Promuovere le 5 skill editoriali** (`anti-ai-slop`, `hook`, `repurpose`, `ai-seo`, `verify-facts`) da `.claude/skills` a `.agents/skills` dopo prima validazione operativa → parità cross-tool (Codex/Cursor/Gemini). Rischio: basso. _Implementare dopo_ (serve 1 ciclo d'uso reale). Output: `npm run sync:agents` + `audit:agents` + update `AI_AGENT_STACK.md`.
2. **P2 · Skill/agent "analytics-contract guardian"** — nessun automatismo verifica che i `trackEvent(...)` nel codice combacino con un contratto eventi versionato. Oggi il drift è invisibile. → Definire il contratto (§ marketing) come file e uno script `audit:analytics`. Rischio: basso. _Implementare dopo._
3. **P3 · Estendere `check-public-footprint.mjs`** per intercettare il drift **llms.txt ↔ liteMode ↔ sitemap** (questa sessione l'ha trovato a mano). Rischio: basso. _Implementare ora se si tocca lo script._
4. **P3 · Niente nuovi agent UX/SEO/social/partnership**: già coperti dai `travellini-*`. Evitare proliferazione (regola AGENTS.md "copy, reduce, attribute, adapt").

Per ogni proposta sopra: **nome / scopo / quando / input / output / file / rischio / priorità** sono indicati inline. Nessuna implementata in questa sessione per non aprire modifiche allo stack senza validazione (l'audit resta principalmente READ-ONLY).

## 13. MCP / subagent / skill recommendations

- **MCP set completo** (playwright, obsidian, context7, chrome-devtools, sentry, github, firebase, stripe). **Nessun nuovo MCP raccomandato.** Figma resta approved-on-demand (solo con file Figma reale). Non aggiungere registry o server community come default (policy `AI_AGENT_STACK.md`).
- **Subagenti**: la copertura per dominio è già 1:1 con i bisogni del brand. Non servono nuovi subagent; servono **dati reali** che alimentino quelli esistenti (data-analyst è cieco finché GA4/Brevo non producono numeri).
- **Skill audit mancanti** ad alto valore: `audit:analytics` (contratto eventi), `audit:affiliate` (flag dead revenue infra come `buildAffiliateLink` non importato — l'avrebbe intercettato). Priorità P2.

---

## 14. Comandi eseguiti e risultati (2026-06-07)

| Comando                          | Esito             | Note                                                                        |
| -------------------------------- | ----------------- | --------------------------------------------------------------------------- |
| `npm run typecheck`              | **PASS**          | exit 0, 0 errori                                                            |
| `npm run build`                  | **PASS**          | exit 0 (media-kit + lead-magnet + og + optimize + sitemap + vite)           |
| `npm run lint`                   | **PASS**          | eslint clean                                                                |
| `npm run test`                   | **PASS**          | 4 file / 10 test                                                            |
| `npm run audit:ui`               | **PASS (warn)**   | 0 err; warning react-pdf + raw color                                        |
| `npm run audit:firebase`         | **PASS**          | 0/0                                                                         |
| `npm run audit:stripe`           | **PASS**          | 8/8                                                                         |
| `npm run audit:revenue`          | **PASS**          | 6/6 contract checks                                                         |
| `npm run audit:agents`           | **PASS**          | 18 skill, 0 err                                                             |
| `npm run audit:size`             | **PASS**          | budget rispettati                                                           |
| `npm run audit:public-footprint` | **PASS (2 warn)** | API key non in shell + secret history (owner)                               |
| Verifica sitemap/lite/og         | OK                | sitemap include /esplora·/club (full-mode); `public/og/default.webp` esiste |

Non eseguiti (richiedono dev server/browser): `audit:visual`, `audit:a11y`, `audit:cwv`, `audit:browser`, `audit:secrets` (gitleaks) — da rieseguire al gate deploy.

---

## 15. Documenti aggiornati

- `docs/10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md` — questo audit (supersede 2026-05-14).
- `public/llms.txt`, `public/llms-full.txt` — sync full-mode.
- (Cross-link aggiunto in `PROJECT_RELEASE_READINESS.md`.)

Da aggiornare a valle delle azioni owner: `MARKETING_OPERATIONS_HUB.md` (activation gate), `docs/12_Partnerships/` (proof + shortlist), `AI_AGENT_STACK.md` (se si promuovono skill o si aggiungono audit script).

---

## 16. Rischi residui

- **Sicurezza (alto):** secret history GCP non ruotata → key esposta finché non ristretta. Blocca deploy pubblico.
- **Fiducia (alto):** lancio con funnel muto (delivery OFF) o con foto AI → danno reputazionale sul segmento più caldo.
- **SEO (medio):** pubblicare landing regione con contenuto DEMO = rischio "scaled content abuse". Evitare assolutamente.
- **Revenue (medio):** affiliate scollegato → traffico monetizzabile sprecato.
- **Dati (medio):** ogni target di conversione è `[VERIFY]` finché non c'è baseline reale. Non fissare KPI su numeri inventati.
- **Perf/A11y (basso):** non ri-misurati live questa sessione; storicamente verdi ma da riconfermare al gate.

---

## 17. Raccomandazione finale

**NON PRONTO per deploy pubblico oggi** — non per ragioni di codice (tutti i gate PASS) ma per **2 blocker di sicurezza owner** (rotazione/restrizione Firebase Web API key + `VITE_FIREBASE_API_KEY` in env prod) e **2 P0 brand** (foto reali R&B; promessa nav Shop/Club vs empty-state).

**Sequenza consigliata al go-live:**

1. Owner: ruota/restringi la key GCP, imposta env prod, rieseguì `audit:secrets`.
2. Chiudi i 2 P0 brand (foto reali; decisione nav Shop/Club).
3. Chiudi l'activation gate (env delivery + PDF + signup affiliate) — per non lanciare un funnel muto.
4. Rieseguì il gate canonico S6 (quality + security + perf + browser).
5. Deploy. Poi: pubblica il primo pillar reale + repurpose, attiva il loop social↔sito misurato con UTM.

Il sito è a un passo dall'essere ottimo: l'ostacolo non è "costruire di più", è **attivare e mostrare ciò che è già costruito**.
