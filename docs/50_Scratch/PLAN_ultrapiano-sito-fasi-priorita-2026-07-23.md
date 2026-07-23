---
type: plan
area: delivery
status: active
priority: p0
owner: team
created: 2026-07-23
related: '[[10_Projects/PROJECT_RELEASE_READINESS]] · [[MARKETING_OPERATIONS_HUB]] · [[DESIGN]] · [[BRAND_KNOWLEDGE_MOC]] · [[PLAN_next-wave-after-research-2026-07-23]]'
tags:
  - plan
  - ultrapiano
  - roadmap
  - release
  - homepage
---

# ULTRAPIANO — Cosa è meglio per il sito Travelliniwithus

## Richiesta (1 frase)

Analisi di dettaglio su **cosa conviene fare al sito** e roadmap operativa a fasi + priorità, senza ricostruire da zero e senza eseguire ora.

## Principio guida (non negoziabile)

**Presentabile al pubblico prima di Awwwards.**

Ordine di valore:

1. Verità e onestà (niente CTA morte, niente claim contraddittori)
2. Funnel owned (bio hub → lead → esplora/posto)
3. Homepage chiara + veloce + accessibile
4. Contenuti owned che trasformano i Reel top in schede
5. Release sicura (security owner + hosting)
6. Solo dopo: rifinitura motion / wow Awwwards

Non rifare da zero. Stack React 19 + Vite 6 + Tailwind 4 + Firebase + Express è solido. Migliorare e rifattorizzare a slice.

---

## Stato di partenza (2026-07-23)

### Già fatto (non rifare)

| Area                                                                           | Stato   |
| ------------------------------------------------------------------------------ | ------- |
| Truth pack (nascita 2018, Rodrigo cubano, bio `/guida-in-regalo`, shop no)     | fatto   |
| Home integrity B (nested main, lazy, reduced-motion map, reel a11y, footer NL) | fatto   |
| Shop honesty C (niente add-to-cart pubblico)                                   | fatto   |
| Seed D parziale (6 place + 5 seed article + Burton avanzato)                   | avviato |
| Vault Obsidian + Graphify + plugin cleanup                                     | fatto   |
| Dossier presence + Family boundary                                             | fatto   |
| Mappa full-screen slice locale                                                 | forte   |
| Audit script / CI / predeploy tooling                                          | forte   |

### Blocchi aperti

| Blocco                                       | Tipo      | Owner                       |
| -------------------------------------------- | --------- | --------------------------- |
| Live = holding "SITO IN COSTRUZIONE"         | release   | deploy                      |
| Home LCP 3–3.5s / TBT alto (misura storica)  | perf      | build                       |
| Secret history Firebase/GCP key              | security  | **owner only**              |
| Hosting-only vs Node API                     | arch      | **owner**                   |
| Bio IG ancora Linktree                       | marketing | **owner** (deciso: non ora) |
| Lead magnet 10 luoghi reali R+B              | content   | **R+B**                     |
| Schede seed incomplete (voti/prezzi/foto)    | content   | R+B + asset                 |
| CartDrawer non montato (ok finché shop soon) | commerce  | ok                          |
| Affiliate signup incompleti                  | growth    | owner                       |

### Decisioni già lockate

1. Nascita brand **2018**
2. Rodrigo **cubano di nascita**
3. Bio hub **`/guida-in-regalo`**
4. Shop **per ora no** (waitlist only; carrello off)
5. Hosting topology **dopo** (owner: decido più avanti)
6. Bio IG **solo dopo go-live stabile**
7. Family = **sub-brand separato**, audience non sommata
8. Go-live: **nessuna data** — qualità prima
9. Contenuti R+B a breve: **niente** — solo codice/UI (no claim nuovi senza input)
10. **Telegram disabilitato per ora** — non inserire URL, non esporre CTA Telegram
11. **Prossima sessione esecutiva: Fase 2B — perf homepage (LCP/TBT)**
12. **Fase 2B completata 2026-07-23 (code):** lazy sotto-fold; MapLibre on-viewport + 28 pin + pause tab; hero webp/srcSet; no Magnetic/Tilt LCP; featured 3 posti reali; weekend su seed reali; reel lightbox Escape+scroll lock+link scheda; truth sweep 2018; Telegram off; typecheck+eslint OK. Residuo: misura CWV reale in browser.
13. **Fase 3 avviata 2026-07-23:** `/guida-in-regalo` — path secondari Esplora/Mappa/Collaborazioni; success onesto (PDF sul sito, no fake email delivery); a11y form; LeadMagnet copy; R_B_ACTIONS bio URL. Blocco R+B: 10 luoghi + keys ESP.
14. **Residui honesty 2026-07-23:** Footer NL → Link `/guida-in-regalo`; FinalCta newsletter → guida; AiAssistant shop/waitlist; 230+ legacy off; Navbar.test allineato IA; **unit 82/82 PASS**.

---

## Nord strategico del sito (cosa deve fare)

Il sito non deve competere con Instagram sul volume di scroll. Deve essere:

| Job                      | Route / asset                        | Priorità         |
| ------------------------ | ------------------------------------ | ---------------- |
| Chi siamo / fiducia      | `/`, `/chi-siamo`                    | P0               |
| Scoprire posti           | `/esplora`, `/posto/:slug`, `/mappa` | P0               |
| Catturare lead da social | `/guida-in-regalo`                   | P0               |
| Convertire partner       | `/collaborazioni`, `/media-kit`      | P1               |
| Monetizzare dopo         | `/shop`, affiliate `/risorse`        | P2 (dopo verità) |
| Community                | newsletter > Telegram secondario     | P1               |

Promessa editoriale da difendere (`DESIGN.md` + dossier):

> Posti particolari provati sul campo. Costi, per chi è, se vale.  
> Non liste. Non brochure. Non template SaaS.

---

## Matrice priorità (come leggere tutto il piano)

| Codice    | Significato                             | Quando si fa        |
| --------- | --------------------------------------- | ------------------- |
| **P0**    | Blocca presentazione pubblica o fiducia | Subito              |
| **P1**    | Blocca qualità percepita / conversione  | Subito dopo P0      |
| **P2**    | Amplifica crescita / SEO / content      | Dopo P0–P1 stabili  |
| **P3**    | Wow / Awwwards / lab                    | Solo se P0–P2 verdi |
| **OWNER** | Serve decisione o azione R+B / GCP      | Non indovinabile    |

---

# FASI OPERATIVE

## FASE 0 — Protezione e freeze (P0, Effort S, 0.5 giorno)

**Obiettivo:** non perdere lavoro, non mischiare vault e code.

### Attività

| #   | Task                                                           | Chi  | Note                 |
| --- | -------------------------------------------------------------- | ---- | -------------------- |
| 0.1 | Commit o stash separati: `docs/vault` vs `src truth+home+shop` | dev  | branch WIP già ahead |
| 0.2 | Snapshot branch + tag locale pre-build grande                  | dev  |                      |
| 0.3 | Verificare `.env` non committato; `audit:env` read-only        | dev  |                      |
| 0.4 | Aggiornare `PROJECT_RELEASE_READINESS` con wave A–D fatte      | docs |                      |

**Gate:** git pulito a slice; nessun secret in status.  
**Rischio:** commit monolitico = rollback impossibile.  
**Risultato:** base sicura per build.

---

## FASE 1 — Verità pubblica e honesty di prodotto (P0, Effort S, 1 giorno)

**Obiettivo:** zero contraddizioni pubbliche; zero commerce finto.

### Già fatto

- Timeline 2018, Rodrigo cubano, llms, BIO_LINKS, shop CTA off, posts 1.272

### Residui da chiudere

| #   | Task                                                                     | Priorità | File / area                                                                             |
| --- | ------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------- |
| 1.1 | Sweep residuale "8 anni" / "5 anni" / "2017" fuori dai punti già toccati | P0       | `AuthorBio`, `LeadMagnet`, `LeadMagnetDocument`, `server.ts` meta, i18n, messaging docs |
| 1.2 | Allineare Marketing hub checklist bio path a `/guida-in-regalo`          | P0       | `MARKETING_OPERATIONS_HUB`, `R_B_ACTIONS_*`                                             |
| 1.3 | Surfaces: shop/itinerari/guide = soon/preview coerenti in nav ovunque    | P0       | `surfaces.ts`, Navbar, Footer                                                           |
| 1.4 | AiAssistant copy shop = "in preparazione"                                | P1       | `AiAssistant.tsx`                                                                       |
| 1.5 | Non montare CartDrawer finché shop non live (confermare regola in docs)  | P1       | Layout, decision note                                                                   |

**Gate:** grep zero claim timeline/nazionalità/bio path in conflitto; typecheck.  
**Risultato:** un solo racconto brand.

---

## FASE 2 — Homepage: una storia, una velocità (P0–P1, Effort M, 2–4 giorni)

**Obiettivo:** home presentabile, leggibile, più veloce, non lab 3D.

### Principio

Home attuale = `AtlanteHome` → `CinematicHomepage` (curated hero + featured + mappa + promise + weekend + reels + indice).  
È la direzione giusta. **Non** riattivare Sentiero/Wow/Immersive come home default.

### 2A — Struttura e messaggio (P0)

| #    | Task                                                                                                | Perché        |
| ---- | --------------------------------------------------------------------------------------------------- | ------------- |
| 2A.1 | Hero: una promessa + 2 CTA max (`/esplora`, `/guida-in-regalo`)                                     | chiarezza     |
| 2A.2 | Trust strip: solo metriche da `site.ts` (niente "230+ posti" se non canonico)                       | truth         |
| 2A.3 | Featured 3: solo posti con `/posto/:slug` reale o seed live                                         | no link morti |
| 2A.4 | Sezione mappa: teaser + CTA full `/mappa` (non caricare MapLibre se non in viewport)                | perf          |
| 2A.5 | Weekend generator: onesto come "ispirazione", non "algoritmo magico"                                | UX honesty    |
| 2A.6 | Reels: deep link a posto quando `postoId` c'è                                                       | owned loop    |
| 2A.7 | Indice vivo: max N item, resto → Esplora                                                            | scannability  |
| 2A.8 | Aggiungere blocco newsletter o anchor `#newsletter` vero in home **oppure** lasciare footer → guida | conversione   |

### 2B — Performance home (P0, BLOCK storico)

| #    | Task                                                                                       | Impatto atteso |
| ---- | ------------------------------------------------------------------------------------------ | -------------- |
| 2B.1 | Hero LCP: formato webp/avif, dimensioni corrette, `priority` solo hero                     | LCP ↓          |
| 2B.2 | Lazy sezioni sotto fold (weekend, reels, indice) via dynamic import o IntersectionObserver | TBT ↓          |
| 2B.3 | MapLibre: caricare solo quando sezione entra in viewport; spin off su reduced-motion (già) | TBT/INP        |
| 2B.4 | Non importare Three/GSAP pesanti sulla home se non usati dal cinematic attuale             | bundle         |
| 2B.5 | Defer analytics non critici; consent-first                                                 | TBT            |
| 2B.6 | Misura reale: 5 cold run mobile 4G (Lighthouse/CWV skill)                                  | gate           |

**Target gate home (mobile 4G):**

- LCP ≤ 2.5 s (stretch ≤ 2.0)
- CLS ≤ 0.1
- TBT ≤ 300 ms (stretch)
- INP menu usabile

### 2C — A11y home (P0–P1)

| #    | Task                                          |
| ---- | --------------------------------------------- |
| 2C.1 | Un solo H1                                    |
| 2C.2 | Focus visibile su CTA e reel (già parziale)   |
| 2C.3 | Escape chiude lightbox reel + focus trap base |
| 2C.4 | Contrasto testi muted su sand                 |
| 2C.5 | Touch target ≥ 44px su mobile                 |

**Gate:** smoke 375/768/1440 + axe home + typecheck.  
**Risultato:** home da far vedere a partner senza vergogna.

---

## FASE 3 — Funnel owned (bio hub + lead) (P0–P1, Effort M, 2–3 giorni)

**Obiettivo:** Instagram/TikTok → sito → email, senza dipendere da Linktree (quando owner decide).

### 3A — `/guida-in-regalo` (P0)

| #    | Task                                                               |
| ---- | ------------------------------------------------------------------ |
| 3A.1 | Copy IT scroll-stopper + una sola CTA primaria                     |
| 3A.2 | Path secondari: Esplora / Media kit / Collaborazioni (non 10 link) |
| 3A.3 | Form: errori chiari, honeypot, rate limit server                   |
| 3A.4 | Success state onesto (niente "PDF inviato" se non c'è)             |
| 3A.5 | OG card `/og/guida-in-regalo` brand-coherent                       |
| 3A.6 | UTM da BIO_LINKS già ok; tracking eventi standard                  |

### 3B — Lead magnet contenuto (P1, OWNER content)

| #    | Task                                             | Dipende      |
| ---- | ------------------------------------------------ | ------------ |
| 3B.1 | 10 luoghi reali da R+B (non inventare)           | R+B          |
| 3B.2 | PDF generate + link download firmato             | build + keys |
| 3B.3 | Email welcome (Resend/Brevo) e2e                 | OWNER keys   |
| 3B.4 | Counter newsletter resta 0 finché non verificato | già regola   |

### 3C — Attivazione social (OWNER, dopo sito ready)

| #    | Task                                                          | Quando                |
| ---- | ------------------------------------------------------------- | --------------------- |
| 3C.1 | Bio IG/TikTok → `travelliniwithus.it/guida-in-regalo?utm_...` | dopo FASE 2–3 stabili |
| 3C.2 | Telegram URL in `site.ts` come CTA secondaria                 | owner fornisce URL    |

**Gate:** form e2e staging; no fake delivery.  
**Risultato:** funnel misurabile.

---

## FASE 4 — Contenuti owned: le 6 schede che contano (P1–P2, Effort L, 1–3 settimane)

**Obiettivo:** i Reel top diventano pagine del sito, non solo video IG.

### Priorità schede (ordine SEO × proof × facilità)

| Rank | Scheda                      | Seed  | Completare con                        | Effort |
| ---- | --------------------------- | ----- | ------------------------------------- | ------ |
| 1    | **Burton Juice**            | forte | voto R+B, foto reali, prezzi, publish | M      |
| 2    | **Batu Caves / KL**         | base  | dettagli pratici, foto, `/posto` live | M      |
| 3    | **Bled glamping**           | base  | partner/prezzo, foto                  | M      |
| 4    | **Caraibi Italia / Jesolo** | base  | luogo preciso R+B, foto               | M      |
| 5    | **Madrid malocchio**        | base  | nome locale esatto, disclosure        | M      |
| 6    | **Sushi Kibo**              | base  | location esatta, menu/prezzi          | S–M    |

### Pipeline per ogni scheda (S1 ridotto)

1. **Growth:** perché questa scheda (query + funnel)
2. **SEO:** title, meta, slug, internal links, Place entity
3. **Editorial:** draft IT anti-slop + fact-check
4. **Asset:** foto reali only (DECISION imagery truth)
5. **Frontend:** `/posto/:slug` + eventuale articolo
6. **Social:** repurpose da pillar (opzionale)
7. **QA:** typecheck + browser + no claim non verificato

### Regole hard

- Nessuna foto stock/AI come hero
- Prezzi solo se verificati o esplicitamente "indicativi"
- Partnership/ADV dichiarata
- Family content **non** entra nel core travel

### Oltre le 6

| #   | Task                                           | Priorità |
| --- | ---------------------------------------------- | -------- |
| 4.x | Esplora: filtri coerenti, zero empty dead ends | P1       |
| 4.y | Mappa: pin solo su posti con scheda            | P1       |
| 4.z | 1 pillar/mese dopo le 6 (Salento ecc.)         | P2       |

**Gate per scheda:** publish solo se foto + claim minimi verificati + SEO base.  
**Risultato:** sito con sostanza, non solo shell.

---

## FASE 5 — Pagine business e fiducia (P1, Effort M, 2–4 giorni)

**Obiettivo:** convertire brand/DMO e sostenere media kit.

| #   | Task                                                               | Priorità |
| --- | ------------------------------------------------------------------ | -------- |
| 5.1 | `/collaborazioni`: offerta chiara, proof Emilia, CTA email         | P1       |
| 5.2 | `/media-kit`: numeri da `site.ts` + PDF aggiornato + data snapshot | P1       |
| 5.3 | `/chi-siamo`: allineato a nascita 2018 + metodo (già parziale)     | P1       |
| 5.4 | `/risorse`: affiliate `rel=sponsored`, disclosure                  | P1       |
| 5.5 | Case study Emilia-Fantastica: owner autorizza testo pubblico       | OWNER    |
| 5.6 | Press redirect ok; non inventare clip                              | P2       |

**Gate:** smoke business pages + metriche coerenti.  
**Risultato:** partner-ready.

---

## FASE 6 — Shop e monetizzazione (P2, Effort M, solo quando owner dice sì)

**Obiettivo:** commerce vero o niente.

| #   | Task                                                   | Condizione      |
| --- | ------------------------------------------------------ | --------------- |
| 6.1 | Primo SKU reale (planner) con file + prezzo + consegna | owner           |
| 6.2 | Montare `CartDrawer` in Layout                         | solo se 6.1     |
| 6.3 | Stripe e2e + webhook + audit:stripe                    | solo se 6.1     |
| 6.4 | Surface shop → `live`                                  | solo se 6.1–6.3 |
| 6.5 | Finché no: restare waitlist (stato attuale)            | **default**     |

**Non fare ora:** aprire carrello simulato.

---

## FASE 7 — Performance di sistema (P1, Effort M, continuo)

**Obiettivo:** CWV accettabili sulle top route.

| Route              | Focus                       |
| ------------------ | --------------------------- |
| `/`                | LCP hero, TBT map/reels     |
| `/esplora`         | liste, immagini, filtri INP |
| `/mappa`           | lazy MapLibre (già forte)   |
| `/posto/*`         | immagini, CLS               |
| `/guida-in-regalo` | form INP, no bloat          |

### Azioni tecniche

| #   | Task                                                                                   |
| --- | -------------------------------------------------------------------------------------- |
| 7.1 | Bundle audit (`audit:size`, visualizer) — taglia dead home/experience dal path critico |
| 7.2 | Code-split aggressivo esperienze lab (sentiero, controluce, three) fuori da home       |
| 7.3 | Font: solo variable necessari (già direction Fraunces)                                 |
| 7.4 | Image pipeline: `optimize:images` su hero e 6 schede                                   |
| 7.5 | Terze parti: Sentry/analytics after consent                                            |
| 7.6 | Cadenza: `perf-audit` prima di ogni release candidate                                  |

**Gate:** Lighthouse CI blocking rules già in CI (a11y≥0.95, CLS≤0.1).  
**Risultato:** non solo bello, usabile su 4G.

---

## FASE 8 — Accessibilità e responsive (P1, Effort M, 2–3 giorni)

| #   | Task                                                   | Tool             |
| --- | ------------------------------------------------------ | ---------------- |
| 8.1 | Matrix 320/375/768/1024/1440 su `/`, hub, posto, mappa | responsive-check |
| 8.2 | Keyboard nav Navbar + drawer + lightbox                | a11y-check       |
| 8.3 | Contrasto AA su accent/muted                           | a11y             |
| 8.4 | Form label/error association                           | a11y             |
| 8.5 | `prefers-reduced-motion` ovunque motion non essenzial  | animate/a11y     |
| 8.6 | Safe area / 100vh mobile su mappa e hero               | CSS              |

**Gate:** zero overflow critici; axe AA sulle top 5 route.

---

## FASE 9 — SEO tecnico + AI search (P1–P2, Effort M, 3–5 giorni)

| #   | Task                                               | Priorità      |
| --- | -------------------------------------------------- | ------------- |
| 9.1 | Title/meta unici IT su ogni route live             | P1            |
| 9.2 | Canonical + noindex coerenti con `surfaces.ts`     | P1            |
| 9.3 | Sitemap solo route indexabili                      | P1            |
| 9.4 | JSON-LD Organization/Person/Place/Article          | P1            |
| 9.5 | Internal linking: home → 6 schede → esplora        | P1            |
| 9.6 | `llms.txt` / `llms-full` tenuti allineati a verità | P1 (già base) |
| 9.7 | OG per schede e hub                                | P2            |
| 9.8 | AI-SEO pass su pillar pubblicati                   | P2            |

**Gate:** `audit:ai-seo` + seo-check sulle live.  
**Risultato:** citabile e indicizzabile.

---

## FASE 10 — Architettura e debito tecnico (P1–P2, Effort M–L)

**Obiettivo:** manutenibilità senza big-bang rewrite.

| #    | Task                                                                 | Priorità | Note          |
| ---- | -------------------------------------------------------------------- | -------- | ------------- |
| 10.1 | Una home canonica; lab solo `/manifesto` o dev routes                | P1       | già direction |
| 10.2 | Eliminare/isolare import morti home wow/immersive dal bundle home    | P1       | knip + bundle |
| 10.3 | Content model unico: `contentLibrary` + seeds → posto/articolo       | P1       |               |
| 10.4 | Cart context resta ma drawer off finché shop soon                    | P2       |               |
| 10.5 | Non toccare `server.ts` / `firestore.rules` / `admin.ts` senza owner | P0 rule  |               |
| 10.6 | TypeScript strict progressivo (file nuovi first)                     | P3       |               |
| 10.7 | Ridurre overlap GSAP vs motion dove ridondante                       | P3       |               |

**Non ricostruire:** Express+Vite hybrid, Firebase, design tokens CSS vars.

---

## FASE 11 — Design system e coerenza UI (P2, Effort M)

| #    | Task                                                          |
| ---- | ------------------------------------------------------------- |
| 11.1 | Tokens solo da CSS vars (`DESIGN.md`)                         |
| 11.2 | PageLayout + Section ovunque                                  |
| 11.3 | CTA hierarchy: primary / outline / ghost                      |
| 11.4 | Card place standard (foto, luogo, verdetto, CTA)              |
| 11.5 | Niente gradient blob / fake controls                          |
| 11.6 | Storybook solo per primitivi stabili (Button, Section, cards) |

**Risultato:** qualità percepita senza redesign random.

---

## FASE 12 — Motion “premium ma sobrio” (P3, Effort M, dopo perf)

**Solo se FASE 2B e 8 verdi.**

| #    | Task                                                   | Regola             |
| ---- | ------------------------------------------------------ | ------------------ |
| 12.1 | Micro-interazioni CTA / card (Tilt solo desktop hover) | reduced-motion off |
| 12.2 | Page transition leggere se già in TransitionLink       | no scroll hijack   |
| 12.3 | NO autoplay video pesanti above fold                   |                    |
| 12.4 | Lab Three.js resta fuori home                          |                    |
| 12.5 | Un “moment” wow max per pagina                         |                    |

**Anti-goal:** sito lento e barocco.

---

## FASE 13 — Security e privacy (P0 owner + P1 eng, Effort S–M)

| #    | Task                                                              | Chi         |
| ---- | ----------------------------------------------------------------- | ----------- |
| 13.1 | Rotazione/restrizione Firebase/GCP Web API key se storica esposta | **OWNER**   |
| 13.2 | App Check + referrer restrictions                                 | OWNER + eng |
| 13.3 | `audit:secrets` pre-release                                       | eng         |
| 13.4 | Stripe webhook integrity se shop on                               | eng         |
| 13.5 | Consent banner + analytics gate                                   | eng         |
| 13.6 | CORS / security headers su server prod                            | eng         |

**Gate:** security BLOCK rimosso in `PROJECT_RELEASE_READINESS`.  
**Senza 13.1–13.2: niente deploy pubblico reale.**

---

## FASE 14 — Test e qualità (P1, Effort continuo)

| Layer         | Comando / pratica    | Quando           |
| ------------- | -------------------- | ---------------- |
| Type          | `npm run typecheck`  | ogni PR          |
| Lint          | `npm run lint`       | ogni PR          |
| Unit          | `npm run test:unit`  | ogni PR          |
| UI static     | `audit:ui`           | UI change        |
| Browser smoke | smoke-test skill     | dopo home/funnel |
| A11y          | a11y-check / axe     | pre-release      |
| CWV           | cwv / audit:cwv      | pre-release      |
| E2E           | Playwright top flows | pre-release      |
| Secrets       | audit:secrets        | pre-release      |
| Full gate     | `predeploy`          | prima deploy     |

Flussi E2E minimi:

1. Home → Esplora → Posto
2. Home → Guida in regalo → submit
3. Collaborazioni → mailto/media-kit
4. Mappa → pin → scheda

---

## FASE 15 — Deploy e go-live (P0 quando ready, Effort M)

### Pre-requisiti assoluti

- [ ] FASE 1 truth chiusa
- [ ] FASE 2 home gate perf/a11y
- [ ] FASE 3 funnel form non bugiardo
- [ ] FASE 13 security owner
- [ ] `npm run predeploy` PASS
- [ ] Decisione hosting (static Hosting vs Node)

### Sequenza go-live

| Step | Azione                                    |
| ---- | ----------------------------------------- |
| 15.1 | Staging/preview Firebase o URL review     |
| 15.2 | Smoke reale su staging                    |
| 15.3 | Sostituire holding "SITO IN COSTRUZIONE"  |
| 15.4 | DNS/HTTPS ok                              |
| 15.5 | Monitor Sentry + analytics                |
| 15.6 | Solo dopo stabilità: bio IG switch (3C.1) |
| 15.7 | Release note in docs                      |

**Risultato:** sito pubblico vero.

---

## FASE 16 — Crescita post-launch (P2–P3, ongoing)

| #    | Task                                            |
| ---- | ----------------------------------------------- |
| 16.1 | Cadenza 1 scheda o pillar / 2 settimane         |
| 16.2 | Weekly review data (GA4 + form)                 |
| 16.3 | Partner outreach con media kit live             |
| 16.4 | Affiliate completi (Skyscanner, Booking, ecc.)  |
| 16.5 | Shop SKU 1 quando contenuto pronto              |
| 16.6 | Experiment motion/Awwwards solo con budget perf |

---

# COSA NON FARE (anti-roadmap)

1. Ricostruire il sito su altro framework
2. Nuova home sperimentale come default
3. Attivare shop/carrello finto
4. Inventare 10 luoghi lead magnet
5. Sommare audience Family + Travel
6. Deploy senza security owner
7. Inseguire Awwwards prima di LCP e truth
8. Installare altri plugin Obsidian / tool senza eval card
9. Toccare `server.ts` / rules / admin senza conferma
10. Cambiare bio IG prima che hub e form siano solidi

---

# BACKLOG PRIORITIZZATO (vista unica)

### Questa settimana (P0)

1. Commit slice A–D
2. Sweep truth residuale (1.1–1.2)
3. Home perf pass (2B) + smoke
4. Escape/focus trap reel (2C.3)
5. Featured home → solo link vivi

### Prossime 2 settimane (P0–P1)

6. Raffinare `/guida-in-regalo`
7. Pubblicare Burton completo (foto+voto R+B)
8. Batu Caves posto live end-to-end
9. Business pages metriche/proof
10. CWV home sotto soglia

### Mese 1 (P1–P2)

11. Completare 6 schede
12. Lead magnet 10 luoghi reali
13. Security owner + staging
14. Go-live (togliere holding)
15. Bio IG switch

### Mese 2+ (P2–P3)

16. Shop SKU1
17. Pillar SEO (Salento…)
18. Motion premium controllato
19. Partner pipeline attiva

---

# EFFORT E RACI (sintesi)

| Fase          | Effort | Dev | Owner R+B      | Blocca go-live?   |
| ------------- | ------ | --- | -------------- | ----------------- |
| 0 Protezione  | S      | ●   |                | no                |
| 1 Truth       | S      | ●   | parziale       | sì se claim falsi |
| 2 Home        | M      | ●   | review         | sì                |
| 3 Funnel      | M      | ●   | keys+contenuti | sì se form fake   |
| 4 6 schede    | L      | ●   | foto/voti      | no (ma qualità)   |
| 5 Business    | M      | ●   | proof          | partner-ready     |
| 6 Shop        | M      | ●   | sì prodotto    | no                |
| 7 Perf        | M      | ●   |                | sì se LCP peggio  |
| 8 A11y/RWD    | M      | ●   |                | sì se rotti       |
| 9 SEO         | M      | ●   |                | parziale          |
| 10 Arch       | M      | ●   |                | no                |
| 11 Design sys | M      | ●   |                | no                |
| 12 Motion     | M      | ●   |                | no                |
| 13 Security   | S–M    | ●   | **● critico**  | **sì**            |
| 14 Test       | cont.  | ●   |                | sì                |
| 15 Deploy     | M      | ●   | **●**          | —                 |
| 16 Growth     | cont.  | ●   | ●              | post              |

---

# METRICHE DI SUCCESSO

| Metrica                 | Baseline nota    | Target V1            |
| ----------------------- | ---------------- | -------------------- |
| Live ≠ holding          | holding          | sito reale           |
| Home LCP mobile         | ~3.0–3.5s        | ≤2.5s                |
| Claim pubblici coerenti | parziale         | 100%                 |
| Schede owned pubblicate | ~poche           | ≥6 prioritarie       |
| Lead form e2e           | incerto          | PASS                 |
| Shop add-to-cart        | nascosto ok      | waitlist o live vero |
| Security gate           | BLOCK owner      | PASS                 |
| Bio hub traffic         | Linktree         | sito (quando owner)  |
| Partner page ready      | media kit ok-ish | proof+CTA chiari     |

---

# PRIMA AZIONE CONSIGLIATA (dopo conferma)

**Non eseguire multi-agent in parallelo.**  
Eseguire in ordine:

1. **FASE 0** — commit/slice del lavoro già fatto
2. **FASE 2B** — performance homepage (il BLOCK più doloroso per “sito presentabile”)
3. In parallelo leggero: **1.1 truth sweep** residuale

Oppure, se owner preferisce sostanza editoriale:  
2bis. **Burton completo** (FASE 4 rank 1) mentre si misura home.

---

# Decisioni ancora aperte (chiedere prima di fasi grandi)

1. Hosting-only Firebase vs Node server in prod
2. Quando attivare bio IG
3. URL Telegram
4. Priorità immediata: **perf home** vs **Burton publish** vs **lead magnet R+B**
5. Data target go-live desiderata

---

## Handoff briefs

0 multi-agent finché non si sceglie la prossima fase esecutiva.  
Quando si apre FASE 4 su una scheda: usare skill `/new-article` o sequenza S1 ridotta.

## Full plan path

`docs/50_Scratch/PLAN_ultrapiano-sito-fasi-priorita-2026-07-23.md`
