---
type: reference
area: quality
status: active
owner: team
tags:
  - reference
---

# AUDIT_ROADMAP — TRAVELLINIWITHUS (Grok 4.5)

**Serie:** `docs/audit-grok45/`  
**Prerequisito:** FASE 0 completata · **nessuna fase successiva avviata senza OK utente**

---

## Regole globali

1. **Fase per fase.** Stop obbligatorio a fine fase; attesa approvazione.
2. **Evidenza prima del giudizio.** Label di certezza su ogni claim.
3. **Nessuna implementazione** nelle fasi classificate SOLO AUDIT.
4. **High-risk files** (`server.ts`, `firestore.rules`, `src/config/admin.ts`): solo con fase esplicita + backup.
5. **WIP preesistente:** non sovrascrivere senza decisione utente su commit/freeze.
6. **Docs Grok** restano in `docs/audit-grok45/`; non riscrivere Master Audit altrui salvo fase dedicata.
7. **Stop se:** secret exposure, richiesta deploy non autorizzata, contraddizione critica irrisolta su claim legali.

### Classi fase

| Classe                      | Significato                            |
| --------------------------- | -------------------------------------- |
| **SOLO AUDIT**              | Documenti + evidenze; zero code change |
| **AUDIT + IMPLEMENTAZIONE** | Audit poi patch minime autorizzate     |
| **VERIFICA TRASVERSALE**    | Cross-cutting checks su più superfici  |

### Agenti / skill tipici

| Ruolo                                               | Quando                                   |
| --------------------------------------------------- | ---------------------------------------- |
| Coordinatore Grok/OpenCode                          | tutte le fasi                            |
| Explore subagents (max 4)                           | mappatura parallela read-only            |
| `audit-browser` / Playwright                        | fasi browser                             |
| `seo-check` / `ai-seo`                              | FASE 20                                  |
| `a11y-check` / axe                                  | FASE 19                                  |
| `cwv` / `perf-audit`                                | FASE 21                                  |
| `security-audit` / `stripe-flow` / `firebase-check` | FASE 22                                  |
| `copywriting-italian` / `anti-ai-slop`              | FASE 15                                  |
| `predeploy`                                         | FASE 23                                  |
| travellini-\* specialists                           | su handoff orchestrator se multi-dominio |

---

## Dipendenze tra fasi (ordine)

```
0 Baseline ✓
  → 1 Strategia
    → 2 Journey (viaggiatori + brand)
      → 3 IA / tassonomie
        → 4 Routing / nav / footer
          → 5 Homepage
          → 6 Esplora
          → 7 Destinazioni
          → 8 Posto
          → 9 Guide/articoli/itinerari
          → 10 Mappa
          → 11 Chi siamo
          → 12 Collaborazioni
          → 13 Case/media-kit/contatti
          → 14 Shop
        → 15 Copy (può iniziare dopo 5/12 in parallelo controllato)
        → 16 Design system
        → 17 Responsive
        → 18 Motion
        → 19 A11y
        → 20 SEO
        → 21 Perf
        → 22 Security/privacy/analytics
        → 23 QA finale + prep deploy
```

Fasi 15–22 possono **parzialmente** parallelizzarsi dopo 5+12 se lock decisioni; default **sequenziale** per ridurre thrash.

---

## FASE 0 — Baseline forense ✓

| Campo     | Contenuto                                                           |
| --------- | ------------------------------------------------------------------- |
| Obiettivo | Mappa git, stack, route, contenuti, tool, audit precedenti, roadmap |
| Output    | 7 doc in `docs/audit-grok45/`                                       |
| Classe    | SOLO AUDIT                                                          |
| Stato     | **COMPLETATA**                                                      |

---

## FASE 1 — Strategia, identità e proposta di valore

| Campo            | Contenuto                                                                      |
| ---------------- | ------------------------------------------------------------------------------ |
| Obiettivo        | Chiarire chi serve il sito, promise, differenziazione, anti-posizionamento     |
| Pagine           | Home hero/promise, Chi siamo, Collaborazioni hero, brand docs                  |
| Input            | `BRAND_PUBLIC_SNAPSHOT`, `EDITORIAL_GUIDE`, `site.ts` BRAND\_\*, FASE 0 claims |
| Prospettive      | Viaggiatore · Partner · Brand honesty · Legal claim risk                       |
| Strumenti        | Read docs + code; **no** implementazione                                       |
| Evidenze         | Matrice promise vs codice; gap claim; decisioni aperte ROI/case                |
| Output           | `docs/audit-grok45/10_STRATEGY_VALUE_PROP.md`                                  |
| Decisioni utente | Audience priority; tone; keep/kill ROI; proof policy                           |
| Accettazione     | Promise unica scritta; lista claim ammessi/vietati; no code change             |
| Classe           | **SOLO AUDIT**                                                                 |

---

## FASE 2 — Viaggiatori, brand e user journey

| Campo        | Contenuto                                                      |
| ------------ | -------------------------------------------------------------- |
| Obiettivo    | Journey map B2C e B2B; entry point; conversion path            |
| Pagine       | Home→Esplora/Mappa/Posto; Home→Guida; Collab→MediaKit→Contatti |
| Input        | FASE 1 + route matrix + Navbar/Footer                          |
| Prospettive  | First-time visitor · returning · partner procurement           |
| Strumenti    | Flow diagrams da routing reale                                 |
| Evidenze     | Path coverage; dead-end; mode switch B2B impact                |
| Output       | `11_USER_JOURNEYS.md`                                          |
| Decisioni    | Job-to-be-done primari; CTA hierarchy                          |
| Accettazione | ≥2 journey B2C + ≥1 B2B con friction list                      |
| Classe       | **SOLO AUDIT**                                                 |

---

## FASE 3 — Architettura informazione e tassonomie

| Campo        | Contenuto                                                      |
| ------------ | -------------------------------------------------------------- |
| Obiettivo    | Validare destinazioni tree, taxonomy content, surfaces, naming |
| Pagine       | Destinazione, Esplora filters, posto types                     |
| Input        | `destinations.ts`, `contentTaxonomy`, `surfaces.ts`, seed      |
| Prospettive  | Findability · SEO entity · editorial ops                       |
| Strumenti    | Code + optional Graphify query (se refresh autorizzato)        |
| Evidenze     | Orphan taxonomy; mismatch surfaces vs routes                   |
| Output       | `12_IA_TAXONOMY.md`                                            |
| Decisioni    | Naming hub Destinazioni vs Esplora; status preview content     |
| Accettazione | Mappa tassonomia + gap list                                    |
| Classe       | **SOLO AUDIT**                                                 |

---

## FASE 4 — Routing, navbar, menu mobile e footer

| Campo        | Contenuto                                                  |
| ------------ | ---------------------------------------------------------- |
| Obiettivo    | Audit navigazione reale vs intenzionale; WIP Navbar        |
| Pagine       | Tutte le entry nav/footer                                  |
| Sezioni      | Desktop nav, mobile drawer, mode switch, footer columns    |
| Input        | Navbar/Footer dirty + FASE 2–3                             |
| Strumenti    | Browser smoke + code; `responsive-check` opzionale         |
| Evidenze     | Screenshot nav stati; link inventory                       |
| Output       | `13_NAV_FOOTER_AUDIT.md`                                   |
| Decisioni    | Mode switch navigate-away sì/no; label; hide preview links |
| Accettazione | Inventory link live; lista fix prioritizzati               |
| Classe       | **SOLO AUDIT** (implementazione solo se autorizzata dopo)  |

---

## FASE 5 — Homepage, sezione per sezione

| Campo        | Contenuto                                                         |
| ------------ | ----------------------------------------------------------------- |
| Obiettivo    | Valutare 6 sezioni live vs obiettivi FASE 1–2                     |
| Pagine       | `/`                                                               |
| Sezioni      | Hero, Featured, Map teaser, Editorial promise, Reels, Indice vivo |
| Input        | CinematicHomepage tree + brand decisions                          |
| Strumenti    | Browser P0; LCP note; no redesign implementato in audit-only      |
| Evidenze     | Section scorecard; claim flags; orphan note Weekend               |
| Output       | `14_HOMEPAGE_SECTIONS.md`                                         |
| Decisioni    | Stats in hero; featured source; ordine sezioni                    |
| Accettazione | Scorecard completa 6/6 + backlog                                  |
| Classe       | **SOLO AUDIT** → opz. **AUDIT + IMPLEMENTAZIONE** se OK           |

---

## FASE 6 — Esplora, ricerca e filtri

| Campo     | Contenuto                                         |
| --------- | ------------------------------------------------- |
| Obiettivo | Discovery quality; preview mode; dual data        |
| Pagine    | `/esplora`                                        |
| Input     | Esplora.tsx, contentLibrary, demoArchive          |
| Strumenti | Browser filters; URL state                        |
| Evidenze  | Empty/preview; zero-count chips; noindex behavior |
| Output    | `15_ESPLORA_AUDIT.md`                             |
| Classe    | **SOLO AUDIT**                                    |

---

## FASE 7 — Destinazioni e pagine geografiche

| Campo     | Contenuto                                      |
| --------- | ---------------------------------------------- |
| Obiettivo | Hub + zone + sub; empty regions; cover quality |
| Pagine    | `/destinazione/*`                              |
| Input     | destinations tree + Destinazione.tsx           |
| Strumenti | Browser sample Italia + 1 non-Italia           |
| Output    | `16_DESTINATIONS_AUDIT.md`                     |
| Classe    | **SOLO AUDIT**                                 |

---

## FASE 8 — Schede luogo

| Campo     | Contenuto                                         |
| --------- | ------------------------------------------------- |
| Obiettivo | Template Posto; placeholder honesty; CTA pratiche |
| Pagine    | `/posto/:slug` (sample)                           |
| Input     | seed + Posto.tsx                                  |
| Evidenze  | noindex; empty hours; claim mismatch              |
| Output    | `17_POSTO_AUDIT.md`                               |
| Decisioni | Quando pubblicare un posto non-placeholder        |
| Classe    | **SOLO AUDIT**                                    |

---

## FASE 9 — Guide, articoli e itinerari

| Campo     | Contenuto                                        |
| --------- | ------------------------------------------------ |
| Obiettivo | Editorial quality path; demo vs FS               |
| Pagine    | `/articolo/:slug`, `/guide/:slug`, `/itinerari*` |
| Input     | Articolo, DEMO\_\*, preview articles             |
| Output    | `18_EDITORIAL_SURFACES.md`                       |
| Classe    | **SOLO AUDIT**                                   |

---

## FASE 10 — Mappa

| Campo     | Contenuto                                     |
| --------- | --------------------------------------------- |
| Obiettivo | Full-screen UX; data truth; mobile breakpoint |
| Pagine    | `/mappa` (+ home teaser cross-check)          |
| Strumenti | Browser desktop+mobile; tile load             |
| Output    | `19_MAP_AUDIT.md`                             |
| Classe    | **SOLO AUDIT**                                |

---

## FASE 11 — Chi siamo

| Campo     | Contenuto                                     |
| --------- | --------------------------------------------- |
| Obiettivo | Trust narrative; stats; timeline verify needs |
| Pagine    | `/chi-siamo`                                  |
| Output    | `20_CHI_SIAMO_AUDIT.md`                       |
| Classe    | **SOLO AUDIT**                                |

---

## FASE 12 — Collaborazioni

| Campo     | Contenuto                                                        |
| --------- | ---------------------------------------------------------------- |
| Obiettivo | B2B hub integrity; **ROI/case/press** decision enforcement       |
| Pagine    | `/collaborazioni`                                                |
| Input     | FASE 1 decisions + widgets                                       |
| Evidenze  | Claim table re-verified; CTA flow                                |
| Output    | `21_COLLABORAZIONI_AUDIT.md`                                     |
| Decisioni | Must-have prima di implementazione: ROI policy                   |
| Classe    | **SOLO AUDIT** → **AUDIT + IMPLEMENTAZIONE** solo post-decisione |

---

## FASE 13 — Case study, media kit e contatti

| Campo     | Contenuto                                     |
| --------- | --------------------------------------------- |
| Obiettivo | Proof package; form quality; payload Contatti |
| Pagine    | case sections, `/media-kit`, `/contatti`      |
| Evidenze  | Network form submit (browser); PDF gate       |
| Output    | `22_B2B_CONVERSION_AUDIT.md`                  |
| Classe    | **SOLO AUDIT** (+ fix payload se autorizzato) |

---

## FASE 14 — Shop e conversioni

| Campo     | Contenuto                                     |
| --------- | --------------------------------------------- |
| Obiettivo | Waitlist honesty; Stripe path se attivo; club |
| Pagine    | `/shop*`, `/club`, cart, checkout API         |
| Strumenti | `stripe-flow` skill; e2e shop se safe         |
| Output    | `23_SHOP_CONVERSION_AUDIT.md`                 |
| Classe    | **SOLO AUDIT** (Stripe live = OWNER)          |

---

## FASE 15 — Copy e rimozione AI slop

| Campo     | Contenuto                                                    |
| --------- | ------------------------------------------------------------ |
| Obiettivo | Voce Rodrigo & Betta; rimuovere slop; allineare claim policy |
| Pagine    | Home, Chi siamo, Collab, guide sample                        |
| Skill     | `copywriting-italian`, `anti-ai-slop`, `hook`                |
| Output    | `24_COPY_AUDIT.md` + bozze se autorizzate                    |
| Classe    | **SOLO AUDIT** o **AUDIT + IMPLEMENTAZIONE** (copy only)     |

---

## FASE 16 — Design system e UI

| Campo     | Contenuto                                                    |
| --------- | ------------------------------------------------------------ |
| Obiettivo | Token compliance; residual raw colors; component consistency |
| Input     | DESIGN.md, audit:ui                                          |
| Strumenti | `npm run audit:ui`, Storybook spot                           |
| Output    | `25_DESIGN_SYSTEM_AUDIT.md`                                  |
| Classe    | **VERIFICA TRASVERSALE**                                     |

---

## FASE 17 — Responsive

| Campo     | Contenuto                                   |
| --------- | ------------------------------------------- |
| Obiettivo | Matrix 320/375/768/1024/1440 su route P0–P1 |
| Skill     | `responsive-check`                          |
| Output    | `26_RESPONSIVE_MATRIX.md` + evidence        |
| Classe    | **VERIFICA TRASVERSALE**                    |

---

## FASE 18 — Motion e storytelling immersivo

| Campo     | Contenuto                                           |
| --------- | --------------------------------------------------- |
| Obiettivo | Motion premium vs perf/a11y; lab experiences policy |
| Pagine    | Home, manifesto, reels                              |
| Skill     | `animate` (solo se implementazione)                 |
| Output    | `27_MOTION_AUDIT.md`                                |
| Decisioni | Keep/kill `/manifesto`; lab quarantine              |
| Classe    | **SOLO AUDIT**                                      |

---

## FASE 19 — Accessibilità WCAG 2.2 AA

| Campo        | Contenuto                                               |
| ------------ | ------------------------------------------------------- |
| Obiettivo    | Evidence reale axe + keyboard + contrast                |
| Strumenti    | `audit:a11y`, `a11y-check`, eslint jsx-a11y             |
| Output       | `28_A11Y_AUDIT.md` + evidence files                     |
| Accettazione | Nessun CRITICAL aperto su P0; AA claim solo se evidence |
| Classe       | **VERIFICA TRASVERSALE** (+ fix se autorizzati)         |

---

## FASE 20 — SEO e dati strutturati

| Campo     | Contenuto                                            |
| --------- | ---------------------------------------------------- |
| Obiettivo | Meta, OG, JSON-LD, sitemap, robots, surfaces, AI SEO |
| Skill     | `seo-check`, `ai-seo`                                |
| Output    | `29_SEO_AUDIT.md`                                    |
| Classe    | **VERIFICA TRASVERSALE**                             |

---

## FASE 21 — Performance

| Campo     | Contenuto                        |
| --------- | -------------------------------- |
| Obiettivo | CWV su P0; bundle; image/font    |
| Skill     | `cwv`, `perf-audit`; `audit:cwv` |
| Output    | `30_PERF_AUDIT.md`               |
| Classe    | **VERIFICA TRASVERSALE**         |

---

## FASE 22 — Sicurezza, privacy e analytics

| Campo     | Contenuto                                                              |
| --------- | ---------------------------------------------------------------------- |
| Obiettivo | Secrets, Stripe, Firestore rules, headers, consent, admin gate         |
| Skill     | `security-audit`, `firebase-check`, `stripe-flow`, `secret-protection` |
| Output    | `31_SECURITY_PRIVACY_AUDIT.md`                                         |
| Note      | OWNER per GCP key restriction                                          |
| Classe    | **VERIFICA TRASVERSALE**                                               |

---

## FASE 23 — QA finale e preparazione al deploy

| Campo        | Contenuto                                                                  |
| ------------ | -------------------------------------------------------------------------- |
| Obiettivo    | Gate predeploy; smoke browser; release note; no false complete             |
| Strumenti    | `predeploy`, e2e, smoke-test                                               |
| Output       | `32_FINAL_QA.md` + update release docs se autorizzato                      |
| Accettazione | predeploy green; P0 claim policy enforced; user GO deploy                  |
| Classe       | **VERIFICA TRASVERSALE** (+ deploy solo con skill `deploy` e OK esplicito) |

---

## Criteri di accettazione globali (ogni fase)

- [ ] Output documentato in `docs/audit-grok45/`
- [ ] Evidenze con label
- [ ] Incertezze esplicite
- [ ] Nessun secret
- [ ] Nessun code change se SOLO AUDIT
- [ ] Lista decisioni utente
- [ ] Prossima fase nominata
- [ ] STOP e attesa OK

---

## Regole di stop (kill switch)

| Trigger                                              | Azione                                       |
| ---------------------------------------------------- | -------------------------------------------- |
| Richiesta di “completa tutto e deploya” senza fasi   | Rifiuta; resta sul piano                     |
| Trovato secret in output                             | Redact; security fase                        |
| Conflitto WIP agent multiplo                         | Freeze; chiedi owner                         |
| Claim legale non verificabile su superficie pubblica | Blocca implementazione copy finché decisione |
| predeploy CRITICAL                                   | Blocca FASE 23 GO                            |

---

## Stato esecuzione

| Fase | Stato                                    |
| ---- | ---------------------------------------- |
| 0    | **DONE**                                 |
| 1–23 | **NOT STARTED** — attendono approvazione |
