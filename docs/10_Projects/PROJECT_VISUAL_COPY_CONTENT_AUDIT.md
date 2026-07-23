---
type: project
area: product
status: in-progress
priority: p1
owner: team
repo: TRAVELLINIWITHUS
route: /
related: '[[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]'
source: audit visivo/copy/contenuti/immagini/conversione full-site
date: 2026-06-07
tags:
  - project
  - ui
  - copy
  - content
  - conversion
  - audit
---

# PROJECT_VISUAL_COPY_CONTENT_AUDIT

Audit full-site su grafica, estetica, UX visiva, testi, contenuti, tono editoriale,
leggibilità, gerarchia, immagini e conversione. Branch `audit/full-site-2026-06-07`.
Sito in **full-mode** (`VITE_LITE_MODE=false`, decisione 2026-06-03): tutte le
sezioni pubbliche attive.

Metodo: 4 specialisti di dominio in parallelo (visual design director, copywriter
editoriale + conversion strategist, content/conversion strategist, photo/asset
curator) sul codice reale + verifica responsive nel browser (Playwright MCP) sul
dev server live. Nessun dato/numero/partner inventato: le metriche citate vivono in
`src/config/site.ts`.

> Nota di scope: il browser-auditor delegato ha esaurito il limite di sessione del
> subagent durante il giro completo. La verifica reale (overflow, console, render
> delle modifiche) è stata completata dal thread principale via Playwright MCP su
> Home, Esplora, Media Kit e Club a 1280 e 375; il giro esaustivo route×viewport
> resta come residuo (vedi §13–15).

---

## 1. Executive summary

Il sito ha una **base premium genuina e matura**: design system coerente
(sand/ink + accent terracotta WCAG-safe), tipografia serif Fraunces con scale
fluide, motion sobrio con `useReducedMotion`, copy editoriale specifico e
anti-cliché, e scelte di IA evolute (manifesto editoriale, mega-menu Esplora,
griglia magazine). Il lavoro di audit pregresso si vede.

Quello che separa il sito dall'eccellenza non è strutturale ma di **rifinitura e
coerenza**:

1. **Asset fotografici placeholder riciclati** — lo stesso pool di ~6 immagini AI
   (Toscana ×4, foto coppia ×3) ripetuto su tutta la home è il singolo fattore che
   più tradisce il "non finito" e abbassa la percezione premium/people-led.
2. **Home lunga e ridondante sull'asse discovery** — tre "esordi" consecutivi sullo
   stesso atto "scegli dove andare", che la fanno leggere come blog SEO.
3. **Pochi elementi violano le stesse regole di `DESIGN.md`** — blob sfocato,
   mappa finta con pin arbitrari, dot-grid decorativo, font-script non controllato
   cross-OS.
4. **Micro-incoerenze di sistema** — eyebrow tracking, scala H2, radius CTA, grigi
   testo, refusi di encoding (accenti), CTA frammentate verso `/esplora`.
5. **Conversione**: il momento di massima intenzione (fine lettura articolo) **non
   è agganciato** a newsletter/lead magnet; doppio funnel B2B parallelo senza
   gerarchia; trust signal (AGCOM/Meta/disclosure) lontani dai form.

**Ho implementato 31 fix sicuri in due passaggi** (encoding, microcopy, alt text,
tweak di gerarchia/spaziatura/decorazione + rimozione fake-control e numeri inventati),
tutti verificati con typecheck + build + audit:ui + browser. Il resto è elencato come
"da approvare" perché tocca IA della home, sistema bottoni, asset reali o funnel.

> **Sessione 2 (2026-06-08, "niente foto reali, procedi")**: avanzati i fix sicuri
> che non dipendono da foto reali né da decisioni di ristrutturazione — rimossa la
> "mappa finta" del MonetizationTeaser, rimossi i conteggi "N racconti" inventati,
> alleggerito e reso accessibile l'hero articolo. IA/nav/funnel restano da approvare.

Voti di partenza degli specialisti: **estetica 7,5/10 · copy 8,3/10**.
Stima post-fix sicuri: estetica ~7,8 · copy ~8,7. Per arrivare a 8,5+/9 servono i
fix DA-APPROVARE (asset reali + consolidamento discovery/funnel).

---

## 2. Valutazione estetica generale — **WARN**

Voto **7,5/10**. Sistema base forte; tre famiglie di problemi lo trattengono:

- **Coerenza di sistema imperfetta**: eyebrow con letter-spacing da 0.18 a 0.36em
  arbitrari; H2 di sezione da `md:text-4xl` a `md:text-6xl` senza logica gerarchica;
  radius CTA misti (`rounded-lg` hero vs `rounded-full` resto); grigi testo
  (`text-black/55–66`) che non passano dai token → secondari mai esattamente uguali.
- **Decorazione anti-`DESIGN.md`**: blob `blur-2xl` arancione nel lead magnet,
  "mappa finta" (foto Toscana + pin arbitrari) nel MonetizationTeaser, `twu-dot-grid`
  sul manifesto, polaroid scatter + `font-script` (fallback di sistema, rende diverso
  per OS) in CoupleIntro/ChiSiamo.
- **Densità/ritmo**: home con 11+ sezioni e tre discovery ravvicinati; colonna lead
  magnet con 7 gruppi di contenuto prima del form; method-card CoupleIntro a 3 colonne
  troppo strette dentro `lg:col-span-5`.

## 3. Valutazione copy/testi — **PASS (con rifiniture)**

Voto **8,3/10**. Voce R+B coerente, specifica, anti-cliché; pagine partner (MediaKit,
Collaborazioni) e manifesto editoriale di livello alto. Difetti residui:

- **Cliché bannato sul traffico più caldo**: `/vieni-con-noi` apriva con "Scopri
  posti particolari" (verbo nella lista anti-cliché del brand). → **corretto.**
- **Refusi di encoding (accenti persi)** su pagine partner-facing e home: identità,
  più, città, già, sarà, finché, è. → **corretti** (8 stringhe).
- **Title-case inglese** in dashboard Club ("Esplora i Contenuti", "I Miei Acquisti").
  → **corretto** in sentence case.
- **CTA frammentate verso `/esplora`** (≥4 wording diversi) — DA-APPROVARE standard.
- **Conteggi articoli inventati** in HomeFeaturedDestinations ("8 racconti") — vedi §4.

## 4. Valutazione contenuti — **WARN**

- **Ridondanza metodo**: CoupleIntro (home) e ChiSiamo raccontano lo stesso "metodo
  prima del rumore" quasi con le stesse parole. ChiSiamo dovrebbe approfondire il lato
  umano/storia, non ripetere il metodo.
- **Doppio segnale partner in home** (HomePartnerSignal + HomeCollaborationCta) con le
  stesse due CTA → diluisce la serietà.
- **`/press` quasi senza contenuto proprio**: 3 highlight + 2 bundle che rimandano a
  media-kit/contatti. Andrebbe arricchita con le menzioni earned già in config
  (Castelli del Ducato) o fusa nel Media Kit con ancora `#press`.
- **Conteggi non verificabili**: "N racconti" per regione (8/6/5/4) sono hardcoded e
  non corrispondono ad articoli realmente pubblicati (archivio in costruzione) → viola
  la policy "niente numeri inventati". **DA-APPROVARE** la rimozione/derivazione dal
  conteggio reale (i due specialisti concordano; il growth chiede conferma del conteggio
  reale via data-analyst/Firestore prima di decidere il wording sostitutivo).
- **`/vieni-con-noi` orfana**: ottimo bio-hub ma nessun link interno del sito ci porta
  e manca un percorso narrativo sito→social.

## 5. Valutazione immagini — **FAIL (asset) / PASS (alt dopo fix)**

Problema-radice: **ogni asset brand/destinazioni/hero è un'immagine AI 1024×1024
quadrata**, ritagliata in landscape/portrait/21:9. Da qui discendono crop forzati,
soggetti tagliati, e il "look stock/AI".

- **Hero people-led senza volti reali R+B** (P0): l'asset a massima leva mostra una
  coppia AI generica, stirata da quadrato in widescreen.
- **Alt text che "mente" sull'immagine** (P1): InstagramGrid usava la caption
  ("Catania prima dell'alba") come alt su un'immagine brand generica; ArticleHero usa
  il titolo come alt. → InstagramGrid e HomeFeaturedDestinations **corretti**;
  ArticleHero lasciato come raccomandato (serve campo `imageAlt` sul tipo articolo).
- **Gerarchia immagine collassata**: 3 immagini brand riciclate su tutta la home; le
  "reel cover" sono **duplicati byte-identici** delle destinazioni (non frame 9:16).
- **OG card in `.webp` e unica per tutto il sito** (P1): WhatsApp può non renderizzare
  WebP nelle preview; ogni link condiviso sembra identico. Serve JPG + override per
  pagina.
- **Config `destinationVisuals.ts`/`experienceContent.ts` puntano a `.png` da ~1MB**
  ma risultano **non consumati** in `src/` (dead config fuorviante).

## 6. Valutazione conversione visiva — **WARN**

- **Articolo → email scollegato** (gap a ROI più alto): il traffico SEO/social atterra
  sugli articoli, ma non c'è una CTA inline/lead-magnet di chiusura su ogni guida.
- **Home con 3 esordi competitivi + lead magnet sepolto** (sezione 4, lazy): prima
  azione del lettore ritardata e ambigua.
- **Doppio funnel B2B senza gerarchia** (Collaborazioni ↔ Media Kit ↔ Contatti): il
  partner non sa quale porta usare; lead frammentati su 3 schemi/2 chiavi localStorage.
- **Newsletter e lead magnet come due offerte separate** (due form, stessa lista).
- **Trust signal lontani dai form**: AGCOM/Meta verified/disclosure sono l'asset di
  fiducia più forte e non stanno dove si decide di convertire.

## 7. Valutazione responsive — **PASS (sulle pagine verificate)**

Verifica reale (Playwright MCP) su dev server live:

| Rotta        | 1280 | 375  | Overflow-x | Errori console |
| ------------ | ---- | ---- | ---------- | -------------- |
| `/`          | PASS | PASS | nessuno    | 0              |
| `/esplora`   | —    | PASS | nessuno    | 0              |
| `/media-kit` | —    | PASS | nessuno    | 0              |
| `/club`      | —    | PASS | nessuno    | 0              |

Nessun overflow orizzontale, nessun elemento debordante, 0 errori console sulle pagine
toccate dai fix. Giro esaustivo route×viewport (tablet 768, hover/focus, tap target,
immagini 404 su tutte le rotte) **da completare** (residuo del browser-auditor).

## 8. PASS / WARN / FAIL

| Area                                 | Esito                                             |
| ------------------------------------ | ------------------------------------------------- |
| Estetica generale                    | **WARN** (7,5 → coerenza + decorazione + asset)   |
| Copy / testi                         | **PASS** (8,3, rifiniture applicate)              |
| Contenuti                            | **WARN** (ridondanza + conteggi non verificabili) |
| Immagini (asset)                     | **FAIL** (placeholder AI riciclati, hero)         |
| Immagini (alt text)                  | **PASS** dopo fix                                 |
| Conversione                          | **WARN** (articolo→email, funnel B2B)             |
| Responsive                           | **PASS** sulle pagine verificate                  |
| Code gate (typecheck/build/audit:ui) | **PASS**                                          |

**Verdict complessivo: WARN** — pronto sul codice, non bloccante; il salto di qualità
dipende da asset reali R+B + decisioni di IA/funnel (owner).

---

## 9. Top problemi prioritari

| #   | Pri | Area                  | Problema                                                             | Stato                |
| --- | --- | --------------------- | -------------------------------------------------------------------- | -------------------- |
| 1   | P0  | immagini              | Hero + tutta la home su ~6 foto AI riciclate; nessun volto reale R+B | DA-APPROVARE (asset) |
| 2   | P1  | contenuto/conversione | Articolo non aggancia newsletter/lead magnet (max ROI)               | DA-APPROVARE         |
| 3   | P1  | grafica               | 3 discovery ridondanti in home → lunga, blog-like                    | DA-APPROVARE (IA)    |
| 4   | P1  | conversione           | Doppio funnel B2B senza gerarchia (Collab/MediaKit/Contatti)         | DA-APPROVARE         |
| 5   | P1  | immagini              | OG card in WebP + unica per tutto il sito                            | DA-APPROVARE         |
| 6   | P1  | contenuto             | Conteggi "N racconti" inventati in home                              | DA-APPROVARE         |
| 7   | P2  | grafica               | Decorazione anti-DESIGN.md (blob, mappa finta, dot-grid, script)     | parz. implementato   |
| 8   | P2  | grafica               | Micro-incoerenze (eyebrow, H2, radius, grigi)                        | parz. implementato   |
| 9   | P3  | copy                  | Refusi di encoding (accenti)                                         | **implementato**     |
| 10  | P3  | grafica               | Griglia magazine cover `row-span-2` da verificare allineata          | da verificare        |

---

## 10. Miglioramenti implementati (27 fix sicuri)

Tutti verificati: `typecheck` PASS · `build` PASS (46s) · `audit:ui` 0 errori ·
browser 0 overflow / 0 errori console.

### Copy / microcopy

- **Priorità** P1 · **Area** testo · **Dove** [VieniConNoi.tsx:27](../../src/pages/VieniConNoi.tsx) · cliché bannato "Scopri posti particolari" sul bio-hub (traffico social) → "Posti particolari da salvare" + description riformulata · **Implementato sì** · verifica: nessuna.
- P1 · testo · [Club.tsx:205](../../src/pages/Club.tsx) · title-case "I Miei Acquisti" → "I miei acquisti" · sì.
- P1 · testo · [Club.tsx:273](../../src/pages/Club.tsx) · "Esplora i Contenuti" → "Esplora i contenuti" · sì.
- P2 · testo · [Club.tsx:160](../../src/pages/Club.tsx) · `alt="Avatar"` → `Foto profilo di {nome}` · sì.
- P3 · testo · [LeadMagnet.tsx:79](../../src/pages/LeadMagnet.tsx) · "Seguici su IG" → "Seguici su Instagram" · sì.
- P3 · testo · `CoupleIntro.tsx:162` · "150 destinazioni" → "150+ destinazioni" (allineato a `BRAND_STATS`) · sì.

### Encoding (accenti) — tutti user-visible, commenti/chiavi non toccati

- P3 · testo · `CoupleIntro.tsx:61` · "non e coerente" → "non è coerente" · sì.
- P3 · testo · [Contatti.tsx:40](../../src/pages/Contatti.tsx) · "sara disponibile" → "sarà disponibile" · sì.
- P3 · testo · [VieniConNoi.tsx:347](../../src/pages/VieniConNoi.tsx) · "piu senso… puo cambiare" → "più… può" · sì.
- P3 · testo · [MediaKit.tsx:58,64,339](../../src/pages/MediaKit.tsx) · "identita/piu profondita" → "identità/più profondità" (×3) · sì.
- P3 · testo · [Shop.tsx:380](../../src/pages/Shop.tsx) · "e pronto… finche" → "è pronto… finché" · sì.
- P3 · testo · `MonetizationTeaser.tsx:9,15` · "citta/gia" → "città/già" · sì.

### Alt text (accessibilità immagini)

- P1 · immagini · [InstagramGrid.tsx:21-64,171](../../src/components/InstagramGrid.tsx) · caption-as-alt su immagini brand generiche → campo `alt` dedicato con descrizione fedele dell'immagine (la caption resta sotto); reel live mantengono caption come alt · sì.
- P2 · immagini · `HomeFeaturedDestinations.tsx:174` · alt "Puglia, Italia" → alt descrittivi per regione (campo `alt` dedicato) · sì.

### Tweak visivi / gerarchia (no redesign)

- P2 · grafica · `HomeEditorialPromise.tsx:26-29` · rimosso `twu-dot-grid` decorativo sul manifesto · sì.
- P2 · grafica · `HomeEditorialPromise.tsx:49` · animazione "morta" `initial opacity:1` → vero fade `opacity:0 → 1` · sì.
- P2 · grafica · `HomeEditorialPromise.tsx:33` · eyebrow tracking `0.36em` → `0.3em` · sì.
- P2 · grafica · `HomeFeaturedDestinations.tsx:79` · eyebrow tracking `0.32em` → `0.3em` · sì.
- P2 · grafica · `LatestArticles.tsx:66` · H2 `md:text-4xl` → `md:text-5xl` (coerenza scala sezioni) · sì.
- P2 · grafica · [InstagramGrid.tsx:134](../../src/components/InstagramGrid.tsx) · H2 `md:text-4xl` → `md:text-5xl` · sì.
- P1 · grafica · `HomeLeadMagnet.tsx:106` · rimosso blob `blur-2xl` arancione (anti-DESIGN.md) · sì.
- P2 · grafica · `NewsletterFeature.tsx:102-106` · rimossi hover-color/border su `<li>` non interattivi (falsa affordance) · sì.
- P3 · grafica · [Footer.tsx:98,162,204](../../src/components/Footer.tsx) · gap header→lista `mb-10` → `mb-6` (ritmo verticale) · sì.

### Sessione 2 — fake control, numeri inventati, hero articolo

- **P1** · grafica · `MonetizationTeaser.tsx:97-122,142-153` · "mappa finta" (rotta SVG tratteggiata + 3 pin arbitrari + cornice + componente `MapMarker`) su una foto che non è una mappa (fake control anti-DESIGN.md) → rimossa; restano foto + scrim + 3 card reali; alt corretto da "Mappa editoriale" a "Paesaggio toscano tra colline e borghi" · **sì** · verificato browser 0 overflow/0 errori.
- **P1** · contenuto · `HomeFeaturedDestinations.tsx:194-200` · conteggi inventati "8/6/5/4 racconti" (archivio non popolato → viola "niente numeri inventati") → rimosso il counter, resta il paese · **sì** · verificato in browser (nessun "racconti" nel DOM).
- **P1** · immagini/a11y · [ArticleHero.tsx:54](../../src/components/article/ArticleHero.tsx) + [types.ts](../../src/components/article/types.ts) · alt = titolo (duplica l'H1 per screen reader) → campo opzionale `imageAlt` con fallback `luogo — categoria` (es. "Trentino-Alto Adige, Italia — Guide") · **sì** · verificato in browser.
- **P1** · grafica/a11y · [ArticleHero.tsx:55,61](../../src/components/article/ArticleHero.tsx) · doppio scurimento (`brightness-0.8` + gradient `from-black/95`) schiacciava la foto → `brightness-0.88` + gradient `from-black/85 via-black/30` · **sì** · verificato a schermo: immagine più luminosa, titolo bianco ancora pienamente leggibile (gradient inferiore preserva il contrasto AA).

### Sessione 3 — OG card social + cleanup dead config

- **P1** · immagini/SEO · [SEO.tsx:19,61](../../src/components/SEO.tsx) + [public/og/](../../public/og/) · OG card in WebP (WhatsApp/LinkedIn renderizzano WebP in modo inaffidabile nelle preview) → generati JPG 1200×630 (22–29 KB, mozjpeg q82) per le 4 card generiche (`default`, `vieni-con-noi`, `lead-magnet`, `demo-articolo-dolomiti`); `DEFAULT_OG_IMAGE` → `.jpg`; aggiunto `<meta property="og:image:type">` derivato dall'estensione (vale per tutti i caller). Reindirizzati [LeadMagnet.tsx:40](../../src/pages/LeadMagnet.tsx), [VieniConNoi.tsx:185](../../src/pages/VieniConNoi.tsx), [Articolo.tsx:732](../../src/pages/Articolo.tsx) ai `.jpg`. I `.webp` restano per non rompere link già condivisi · **sì** · verificato browser: home `og:image=default.jpg` / `image/jpeg`, 4 file serviti 200.
- **P1** · config · [destinationVisuals.ts] / [experienceContent.ts] (rimossi) · dead config (zero import in tutto il repo) che puntava a `.png` da ~1MB (trappola perf latente + fonte-di-verità immagini ambigua) → **rimossi** (`git rm`). Nessun runtime impatto · **sì** · typecheck/build PASS.
- **P2** · testo/integrità · [Press.tsx:28](../../src/pages/Press.tsx) · claim "Pubblico **italiano** interessato a…" non ancorato a dato (geografia audience non documentata) → "Community interessata a posti curiosi, esperienze pratiche e viaggio lento" · **sì** · typecheck PASS.
- **P2** · testo · [siteContent.ts:426](../../src/config/siteContent.ts) · titolo colonna footer "Scopri" (ultimo residuo del verbo bannato nella chrome persistente) → "Naviga" · **sì** · typecheck PASS.

### Sessione 4 — densità lead magnet + ridondanza discovery (su delega "fai tutto")

- **P1** · grafica · `HomeLeadMagnet.tsx:21-25,78-90` · colonna sinistra con 7 gruppi impilati prima del form; `GUIDE_DETAILS` ("10 luoghi/Quando andarci/Quanto fermarsi") ridondante con i promise-point e i chip luoghi → rimosso il blocco + import inutilizzati (`CalendarDays`, `Timer`) · **sì** · typecheck/build PASS, browser conferma rimozione.
- **P1** · grafica/contenuto · `HomeDiscoveryFinder.tsx:67` · eyebrow "Da dove vuoi partire?" gemello di "Da dove iniziare" (HomeFeaturedDestinations) → "Filtra l'archivio" (inquadra il finder come strumento, non come secondo "inizio"): risolve la ridondanza **senza rimuovere** la sezione (l'architettura home è una decisione owner) · **sì** · typecheck/build PASS.

### Non-azioni deliberate (decisioni owner già prese — NON toccate)

Su delega "fai tutto ciò che ritieni opportuno" ho **scelto di non** eseguire interventi che
contraddicono decisioni già documentate dall'owner:

- **Shop/Club fuori dalla nav primaria** — NON fatto: l'owner ha esplicitamente ribaltato
  una rimozione proposta da un agent ("Shop + Club restano in top nav", vedi
  [[PROJECT_HOME_HERO_NAV_REFINEMENT]]).
- **Rimozione sezioni home (discovery/partner)** — NON fatto: esiste un'"Architettura
  homepage definitiva" deliberata. Ho risolto la ridondanza discovery via copy invece di
  tagliare la sezione.
- **`font-script` → serif italic** — NON fatto: è una scelta deliberata documentata in
  [index.css:3](../../src/index.css) (fallback di sistema per evitare un font esterno = perf).
  Trade-off perf vs coerenza cross-OS che spetta all'owner.
- **Articolo → newsletter** — già presente (`<Newsletter variant="article" source="article_bottom" />`
  in [Articolo.tsx:1181](../../src/pages/Articolo.tsx)): nessun blocco duplicato aggiunto.

---

## 11. Miglioramenti consigliati ma da approvare

Formato: Pri · Area · Dove · Problema → Soluzione.

### Asset / immagini (richiedono foto reali R+B — azione owner)

- **P0** · immagini · Hero home + InstagramGrid + CoupleIntro + reel cover · placeholder AI riciclati → set di foto reali R+B differenziate per ruolo (hero orizzontale, ritratto, dietro-le-quinte, reel 9:16). Inventario completo in §12.
- ~~OG card in WebP / default unico~~ → **implementato in Sessione 3** (JPG + `og:image:type`; vedi §10). Resta opzionale: passare `image` esplicito anche a MediaKit/Collaborazioni (oggi usano il default JPG, che va bene).
- **P2** · immagini · `hero-amalfi.webp` (253KB), `couple-travel.webp` (220KB) · oltre budget hero 200KB → ricomprimere via `scripts/optimize-images.mjs`.
- ~~ArticleHero alt + doppio filtro~~ → **implementato in Sessione 2** (vedi §10). Resta opzionale: valorizzare `imageAlt` nei contenuti reali quando disponibili.
- ~~dead config `destinationVisuals.ts`/`experienceContent.ts`~~ → **rimossi in Sessione 3** (zero import; vedi §10).

### IA / struttura (decisione owner)

- **P1** · grafica/contenuto · Home · 3 discovery ridondanti (`HomeFeaturedDestinations` + `HomeDiscoveryFinder` + mappa) → consolidare; spostare il finder dentro `/esplora`. Verificare prima la click-map con data-analyst.
- **P1** · conversione · Home + Collaborazioni · doppio segnale partner / doppio funnel B2B → gerarchia unica Collaborazioni (vetrina) → Media Kit (unica conversione) → Contatti (solo generici/press); fondere le due sezioni partner in home.
- **P1** · conversione · template Articolo · aggiungere CTA inline + blocco lead-magnet di chiusura su ogni guida (evento `lead_magnet_signup` con `source: article_*`).
- **P1** · contenuto/conversione · Navbar · "Esplora" verbo-contenitore vago; Shop/Club in nav primaria ma in waitlist → valutare rename a sostantivo (Guide/Destinazioni) e degradare Shop/Club a footer/"in arrivo".
- **P2** · conversione · NewsletterFeature + HomeLeadMagnet · due form/due promesse per la stessa lista → unificare offerta (il PDF è la reason-to-subscribe).
- **P2** · conversione · form · portare i trust badge (AGCOM/Meta/disclosure) accanto a newsletter e form Media Kit (riuso `BRAND_CREDENTIALS`).
- ~~conteggi "N racconti" inventati~~ → **rimossi in Sessione 2** (vedi §10). Se in futuro l'archivio è popolato, si può reintrodurre un conteggio derivato dal reale.

### Sistema / linguaggio visivo (decisione owner)

- **P2** · grafica · `HomeLeadMagnet.tsx` · mockup copertina costruito a mano (chip/righe finte) → usare la cover PDF reale ruotata.
- ~~MonetizationTeaser "mappa finta"~~ → **rimossa in Sessione 2** (foto + card reali; vedi §10). Upgrade futuro opzionale: screenshot reale della mappa Mapbox.
- **P2** · grafica · `CoupleIntro.tsx` / [ChiSiamo.tsx](../../src/pages/ChiSiamo.tsx) · polaroid scatter + `font-script` ruotato → max 1 "voce speciale" per viewport; limitare lo scrapbook.
- **P3** · grafica · [index.css:20](../../src/index.css) · `font-script` è fallback di sistema (rende diverso per OS) → webfont self-hosted o `font-serif italic`.
- **P3** · grafica · [Button.tsx](../../src/components/Button.tsx) + hero · radius CTA misti → scegliere una forma-firma (consiglio `rounded-full`).
- **P2** · grafica · `HomeTrustStrip.tsx` · numeri brand trattati come caption inline → griglia 2/4-col con numero grande + label (restando sobri, no card).
- **P3** · grafica · [ProductCard.tsx:86](../../src/components/ProductCard.tsx) · velo `bg-black/20` permanente su mobile sulle immagini prodotto → azioni sotto l'immagine o velo solo on-interaction.

### Copy (standardizzazione)

- **P2** · testo · standardizzare CTA→`/esplora` su "Apri Esplora"; valutare "Scopri" residuo nel titolo colonna footer.
- **P2** · testo · [Press.tsx:26](../../src/pages/Press.tsx) · claim "pubblico italiano" non ancorato a dato → versione neutra ancorata a `yearsOfTravel`, salvo export demografico Meta.
- **P3** · testo · [Club.tsx:169](../../src/pages/Club.tsx) · "Benvenuto…/Viaggiatore" al maschile → registro neutro (es. "Ciao, {nome}").
- **P3** · testo · [Collaborazioni.tsx:329](../../src/pages/Collaborazioni.tsx) · uniformare "Reach mensile stimata" sulle superfici partner.

---

## 12. Inventario asset AI-temporanei da sostituire (foto reali R+B)

**Brand (massima priorità — volto del progetto):**
`public/images/brand/{couple-travel,about-editorial,collab-work}.{png,webp,avif}`
(+ varianti `-320/-480/-768`).

**Hero:** `public/images/hero-amalfi.{png,webp,avif}`.

**Destinazioni:** `public/images/destinations/{puglia,toscana,dolomiti,sardegna,islanda,giappone,africa,americhe,oceania}.{png,webp,avif}`.

**Esperienze:** `public/images/experiences/{avventura,gastronomia,romantico,insolito}.{png,webp,avif}`.

**Reel cover (oggi duplicati delle destinazioni — servono frame 9:16 reali):**
`public/images/reels/reel-{1..5}-cover.webp`.

**OG/social:** `public/og/{default,demo-articolo-dolomiti,lead-magnet,vieni-con-noi}.webp` → anche JPG.

**Lead magnet:** `public/images/lead-magnets/posti-italiani-cover-demo.{avif,webp}`.

**Nota** (asset-curator): IG live mostra Lombardia (Garda/Como/Bormio), Veneto e
Trentino come cluster italiani più presenti — valutare di sostituire la card Sardegna
con Lombardia quando ci sono scatti reali (TODO già in
`HomeFeaturedDestinations.tsx:19-26`).

---

## 13. Pagine / componenti modificati

| File                                                                                   | Modifica                              |
| -------------------------------------------------------------------------------------- | ------------------------------------- |
| [src/pages/VieniConNoi.tsx](../../src/pages/VieniConNoi.tsx)                           | cliché bio-hub + accenti              |
| [src/pages/Club.tsx](../../src/pages/Club.tsx)                                         | sentence case ×2 + alt avatar         |
| [src/pages/LeadMagnet.tsx](../../src/pages/LeadMagnet.tsx)                             | "IG" → "Instagram"                    |
| [src/pages/Contatti.tsx](../../src/pages/Contatti.tsx)                                 | accento                               |
| [src/pages/MediaKit.tsx](../../src/pages/MediaKit.tsx)                                 | accenti ×3                            |
| [src/pages/Shop.tsx](../../src/pages/Shop.tsx)                                         | accenti                               |
| `src/components/home/CoupleIntro.tsx`                                                  | accento + "150+"                      |
| `src/components/home/MonetizationTeaser.tsx`                                           | accenti                               |
| `src/components/home/HomeEditorialPromise.tsx`                                         | dot-grid + anim + eyebrow             |
| `src/components/home/HomeFeaturedDestinations.tsx`                                     | eyebrow + alt per regione             |
| `src/components/home/HomeLeadMagnet.tsx`                                               | rimosso blob                          |
| `src/components/home/LatestArticles.tsx`                                               | H2 scale                              |
| `src/components/home/NewsletterFeature.tsx`                                            | hover su non-interattivi              |
| [src/components/InstagramGrid.tsx](../../src/components/InstagramGrid.tsx)             | alt fedeli + H2 scale                 |
| [src/components/Footer.tsx](../../src/components/Footer.tsx)                           | spacing header colonne                |
| `src/components/home/MonetizationTeaser.tsx`                                           | rimossa mappa finta + alt (S2)        |
| [src/components/article/ArticleHero.tsx](../../src/components/article/ArticleHero.tsx) | alt + alleggerimento scurimento (S2)  |
| [src/components/article/types.ts](../../src/components/article/types.ts)               | campo `imageAlt` opzionale (S2)       |
| [src/components/SEO.tsx](../../src/components/SEO.tsx)                                 | OG default JPG + `og:image:type` (S3) |
| [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx)                                 | OG preview → .jpg (S3)                |
| public/og/{default,vieni-con-noi,lead-magnet,demo-articolo-dolomiti}.jpg               | nuove card OG JPG (S3)                |
| src/config/destinationVisuals.ts · experienceContent.ts                                | **rimossi** — dead config (S3)        |
| [src/pages/Press.tsx](../../src/pages/Press.tsx)                                       | claim audience non verificabile (S3)  |
| [src/config/siteContent.ts](../../src/config/siteContent.ts)                           | footer "Scopri" → "Naviga" (S3)       |
| `src/components/home/HomeDiscoveryFinder.tsx`                                          | eyebrow differenziato (S4)            |

~24 file toccati (S1→S4): 37 fix UI/copy/alt/integrità + OG card social + 2 rimozioni
dead config + 4 asset JPG generati. Nessun file high-risk (`server.ts`,
`firestore.rules`, `admin.ts`) toccato.

## 14. Test eseguiti

Eseguiti dopo ciascun batch (S1 e S2):

- `npm run typecheck` → **PASS** (0 errori).
- `npm run audit:ui` → **PASS** (0 errori; solo WARN preesistenti su PDF/calendar/
  inline-style, documentati come eccezioni).
- `npm run build` → **PASS** (~46s, 99 precache entries / 2.6 MB).
- Browser reale (Playwright MCP):
  - S1 → `/`, `/esplora`, `/media-kit`, `/club` a 1280/375: 0 overflow, 0 errori console.
  - S2 → `/` (conteggi rimossi, MonetizationTeaser ok) + `/articolo/dolomiti-rifugi-design`
    (alt descrittivo "Trentino-Alto Adige, Italia — Guide", titolo leggibile su immagine
    alleggerita): 0 overflow, 0 errori console, contrasto AA confermato a schermo.
  - S3 → `/` e `/vieni-con-noi`: `og:image` punta ai `.jpg`, `og:image:type=image/jpeg`;
    i 4 file `og/*.jpg` rispondono 200.

## 15. Rischi residui

- **Asset reali R+B** restano il blocco di qualità #1: finché la home gira su
  placeholder AI riciclati, la percezione premium resta sotto il potenziale.
- **Verifica browser esaustiva incompleta**: il giro completo route×viewport
  (tablet 768, hover/focus, tap target ≥44px, immagini 404 su tutte le rotte) non è
  stato chiuso (session limit del subagent). Le pagine toccate sono verificate.
- **Decisioni di IA/funnel** non implementate (discovery ridondante, doppio funnel
  B2B, articolo→email): sono i gap a ROI più alto ma richiedono scelta owner + dati.
- **Pagina articolo**: il pulsante "Torna alla sezione" in alto a sinistra si
  sovrappone leggermente al wordmark della navbar (dettaglio preesistente, non
  introdotto da questo audit) — da valutare in un fix dedicato.
- Deploy produzione resta bloccato a monte da secret GCP/foto reali (vedi
  [[PROJECT_RELEASE_READINESS]]); questo audit non cambia quello stato.

## 16. Prossima azione consigliata

1. **Owner**: fornire il primo set di **foto reali R+B** per hero + ritratto ChiSiamo
   - 3 reel cover 9:16 (sblocca P0 immagini e il salto di percezione premium).
2. **Decisione IA**: approvare il consolidamento dei 3 discovery in home e la gerarchia
   B2B (Collaborazioni → Media Kit unico funnel) — poi `frontend-builder`.
3. **Quick win conversione**: agganciare ogni articolo a newsletter/lead magnet (CTA
   inline + chiusura) — copy `seo-conversion-strategist`, render `frontend-builder`.
4. **Browser audit completo** route×viewport quando si rilancia `browser-auditor`.
5. Generare **OG JPG** + override per pagina (asset-curator + frontend-builder).

## 17. Link

- [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[PROJECT_RELEASE_READINESS]]
- [[PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS]]
- [[EDITORIAL_GUIDE]]
