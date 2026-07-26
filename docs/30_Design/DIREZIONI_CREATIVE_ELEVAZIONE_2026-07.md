---
type: reference
area: design
status: active
created: 2026-07-24
related: '[[PROJECT_ELEVAZIONE_TOTALE_2026-07]]'
tags:
  - design
  - direction
  - elevazione
---

# DIREZIONI CREATIVE — Elevazione totale (FASE R3, 2026-07-24)

Sintesi della ricerca R1/R2 (`RESEARCH_DOSSIER_ELEVAZIONE_2026-07.md`) in **3 direzioni
creative alternative** tra cui l'owner sceglie. Questo è materiale di direzione, non
esecuzione: nessuna riga di codice qui, solo il vincolo per chi implementerà (R4).

**Base condivisa a tutte e tre** (non è in discussione): il DNA di brand — Fraunces
serif + Inter, superficie sand, inchiostro, accento terracotta, foto/frame REALI per
luoghi/persone (imagery-truth), icone lucide. Divieti condivisi: gradient blob, SaaS
dashboard, card-in-card, fake controls, copy inglese, numeri inventati.

Le tre direzioni sono **davvero diverse per struttura e gesto**, non tre sfumature:

- **A** costruisce sull'idea di _impaginato_ (rivista, filetti, folio, sommario).
- **B** costruisce sull'idea di _mappa_ (rotta, codici d'archivio, contatori onesti).
- **C** costruisce sull'idea di _scena_ (full-bleed, didascalie d'autore, pannello flottante).

Voce R&B di riferimento (dall'audit IG): promessa uppercase spesso in forma di domanda,
formula-firma «Posti che sembrano inventati. Ma ci siamo stati davvero.», pillar
«Sembra impossibile / Altrove, vicino / Dormire dentro una storia / Vale davvero?».

---

## DIREZIONE A — «Rivista Viva»

### 1. Concept (una frase)

Il sito è **un numero di rivista che si sfoglia**: masthead, sommario, folio e filetti
danno autorità editoriale, e il serif osa anche fuori dai titoli nei momenti d'autore.
**Riferimenti dossier**: Kinfolk (§1, coraggio del serif + ritmo "una cosa alla volta"),
Monocle (§2, filetti/hairline + etichette di sezione), Yolo Journal (§13, cover-block +
numero stagionale «Summer Issue»).

### 2. Cosa CAMBIA

- **Type scale** (Fraunces + Inter, invariati come famiglie):
  - h1 `clamp(3.4rem, 6vw, 6.4rem)/0.94`, tracking `-0.05em`, Fraunces 430.
  - **deck editoriale in SERIF** (il coraggio Kinfolk) `clamp(1.15rem, 1.5vw, 1.35rem)/1.55`, Fraunces 420 — non più solo sans.
  - etichetta di sezione (Monocle): Inter `0.68rem`, tracking `0.2em`, uppercase, con filetto passante.
  - folio/meta: Inter `0.62rem`, tracking `0.16em`.
  - body corrente resta Inter `1.0625rem/1.7` (leggibilità); il serif compare solo nei "momenti editoriali" (aperture, citazioni, verdetti).
- **Spacing**: ritmo "una cosa alla volta" — sezioni a piena altezza con `min-height: 100svh` alternate a fasce corte-di-respiro; gutter ampi `clamp(2rem, 6vw, 6.5rem)` (già nel journal-page).
- **Motion signature (UNO)**: _«il filetto che traccia il sommario»_. All'ingresso di ogni sezione, l'etichetta small-caps compare e il suo **filetto hairline si disegna da sinistra** (SVG `stroke-dashoffset` 100→0) mentre il titolo serif si rivela **riga per riga** (GSAP SplitText, già free in gsap 3.15). Un solo gesto ripetuto, coerente, informativo (segnala "nuova sezione della rivista"). ScrollTrigger `once: true`, durata ~0.6s, ease `power2.out`.
- **Trattamento immagini**: coppie di foto reali affiancate + **cover-block** (blocco inchiostro con titolo serif chiaro sopra, alla Yolo); figcaption discreta in basso a destra (già in `.trace-frame figcaption`).
- **Sezioni NUOVE**:
  1. **«Il Sommario»** — indice del numero in stile Monocle (pillar come rubriche: SEMBRA IMPOSSIBILE / ALTROVE, VICINO / VALE DAVVERO), con filetti e meta "N posti".
  2. **«L'occhio della coppia»** — curation dichiarata alla Yolo: 3-4 posti scelti "in questo numero" + nota a mano; la stagionalità reale dei loro viaggi diventa il "numero" (es. «Estate 2026»).
  3. **«Copertina del numero»** — cover-block d'apertura: coppia di frame reali + titolo serif su blocco inchiostro con la formula-firma.

### 3. Cosa NON cambia

DNA intatto: Fraunces+Inter, sand, inchiostro, accento terracotta, foto reali, lucide.
Divieti rispettati: nessun gradient blob, nessuna densità da quotidiano (si prende la
struttura a filetti di Monocle, NON la sua densità né il giallo), nessun monocromo
gallerista di Kinfolk (l'accento terracotta resta, serve conversione), niente card-in-card.

### 4. Asset dormienti riusati

L'**intero arsenale `journal-*`** (~1.400 righe già scritte) è la spina dorsale di A:
`journal-header` + `journal-wordmark` (masthead), `journal-progress` (posizione nel
numero), `journal-hero` + `journal-hero__copy`, `journal-page` sticky con `journal-folio`
(numeri di pagina = folio della rivista), `journal-handnote` (nota a mano dell'occhio-editor),
`journal-next-peek` (anteprima "pagina successiva"). Da `trace-*`: `.trace-frame figcaption`
per le didascalie. Riuso, non reinvenzione.

### 5. Impatto perf (budget LCP 2.5s / CLS 0.1)

- **Librerie**: **nessuna nuova** (GSAP+SplitText, motion, lenis già presenti — confermato R2).
- **LCP**: hero con una sola immagine `priority` + `responsiveWidths` → ok.
- **CLS**: le sezioni `journal-page` sticky usano `transform` (compositor, non layout); SplitText va inizializzato con `visibility` gestita per evitare FOUC ma non causa shift. Watch: il page-flip `perspective` su sticky va testato su mobile (già previsto fallback verticale in `@media`). Rischio CLS **basso**.

### 6. Sulla pagina-tempio `/posto` (62 URL)

1. **Folio + rubrica** in alto: `journal-folio` con numero + etichetta pillar («SEMBRA IMPOSSIBILE») al posto del breadcrumb nudo — la pagina-posto è "un articolo del numero".
2. **Apertura serif**: l'h1-hook resta, ma il deck/descrizione passa a Fraunces (momento editoriale), con filetto che traccia sopra la card Info pratiche.
3. **Cover-block** sul PostoStamp: la faccia "Sembra inventato" incornicia hook + luogo alla Yolo; il flip al retro "Esiste davvero" resta invariato.
4. **«Nel prossimo numero»**: `PostNavigation` restyled come `journal-next-peek` (anteprima pagina successiva) invece del prev/next standard.

---

## DIREZIONE B — «Atlante di Coppia»

### 1. Concept (una frase)

Il sito è **l'atlante personale di Rodrigo & Betta**: 29 posti reali schedati come un
archivio con codici, uniti da una rotta d'inchiostro che si disegna scrollando, con
contatori onesti al posto delle metriche inventate. **Riferimenti dossier**: Cereal (§3,
estetica d'archivio numerato + carta/inchiostro caldi quasi identici al DNA), Atlas
Obscura (§12, atlante personale + contatori "places added/been to" + icone line-art),
Polarsteps (§11, route-line con tappe numerate + "rivivi il viaggio", tradotta in
inchiostro-su-carta invece che satellite-app).

### 2. Cosa CAMBIA

- **Type scale** (influenza Cereal, ma con pavimento a11y — NON la scala minuta di Cereal):
  - h1 `clamp(2.8rem, 5vw, 4.6rem)/1.0` Fraunces 400 (più contenuto di A: qui comanda la mappa, non il titolo).
  - **codice d'archivio**: Inter `0.66rem`, tracking `0.24em`, uppercase — formato `IT-07 · 2026` sotto ogni posto (il "(218-09)" di Cereal reso onesto).
  - meta/didascalia: `0.8125rem` minimo (a11y floor, non i 12px di Cereal).
  - numero-tappa: Fraunces `clamp(2.7rem, 4.5vw, 4.5rem)/1` in terracotta (già in `.trace-number strong`).
- **Spacing**: griglia-archivio a schede uniformi (come Cereal/PostoStamp esistente), gutter regolari; la rotta occupa una colonna-margine sinistra costante (già `.trace-rail`).
- **Motion signature (UNO)**: _«la rotta che unisce le tappe»_. Una **route-line SVG verticale** (esiste già come `.trace-rail`: cerchio di partenza + linea + tappe numerate) si **disegna con lo scroll** (`stroke-dashoffset` legato a GSAP ScrollTrigger `scrub`), e ogni tappa (posto) "si accende" quando la linea la raggiunge. Un solo gesto, informativo: comunica "queste tappe sono un viaggio connesso, non una lista". Rispetta `prefers-reduced-motion` (linea già disegnata, nessuno scrub).
- **Trattamento immagini**: foto/frame reali dentro schede-archivio con codice; **icone line-art** lucide (pin, busta, penna) coerenti con Atlas Obscura; virata calda leggera già in `.journal-hero__image` (`saturate .82 sepia .08`).
- **Sezioni NUOVE**:
  1. **«La rotta»** — route-line che collega gli ultimi posti reali con tappe numerate (①→②→③), stile Polarsteps ma inchiostro-su-carta. Copy: «Dove siamo stati, in ordine».
  2. **«L'atlante»** — i 29 posti come griglia-archivio con codice catalogo + timbro _visitato_ (il PostoStamp è già la scheda perfetta).
  3. **«Contatori onesti»** — alla Atlas Obscura ma SENZA inventare: solo dati veri e verificabili (numero di posti schedati, regioni toccate). `[VERIFY: conteggio posti/regioni dal contentLibrary al momento dell'implementazione]` — nessun follower/reach inventato.

### 3. Cosa NON cambia

DNA intatto. Divieti rispettati: si prende la **meccanica** di Polarsteps (route-line,
tappe numerate) ma NON la sua estetica app-SaaS (rounded, mockup telefono, bold
geometrico); si prende l'atlante-personale di Atlas Obscura ma NON il suo sans utilitario
né la densità listicle. Contatori **solo su dati reali** (allineato alla bonifica 0.3 —
niente numeri inventati). L'accento resta terracotta; nessun verde bosco/ottone di Atlas.

### 4. Asset dormienti riusati

Cuore su `trace-*`: `.trace-rail` (+ `__start`, `__line`, tappe `a:nth-of-type`) È GIÀ la
route-line con tappe numerate — va solo animata con `stroke-dashoffset`; `.trace-section--paper`
/ `--ink` (alternanza carta/inchiostro), `.trace-number` (numero-tappa in terracotta),
`.trace-frame` + `figcaption` (schede foto con etichetta). Il **PostoStamp** è già la
scheda d'archivio con timbro. Da `journal-*`: la virata calda immagine.

### 5. Impatto perf (budget LCP 2.5s / CLS 0.1)

- **Librerie**: **nessuna nuova**. Watch-item R2: `rough-notation` (~3.8 kB) SOLO se il
  tratto "a penna" della rotta risultasse insufficiente in SVG puro — **richiede gate owner**;
  default è SVG+GSAP a mano, zero install.
- **LCP**: schede-archivio leggere; hero singola immagine `priority`.
- **CLS**: la route-line è `position: absolute`/`pointer-events: none`, non entra nel flusso → zero shift. ScrollTrigger `scrub` anima solo `stroke-dashoffset` (paint, non layout). Rischio CLS **molto basso**. È la direzione con il profilo perf più leggero.

### 6. Sulla pagina-tempio `/posto` (62 URL)

1. **Codice d'archivio** sotto l'hook: `IT-07 · 2026` (regione-numero · anno) — identità da schedario, coerente su tutti i 62 URL.
2. **«Tappa N di 29»** con mini route-line: il posto si colloca nell'atlante; link «Vedi la rotta».
3. **Timbro _visitato_** enfatizzato sul PostoStamp (già presente il meccanismo Stamp/flip) + `VerdictSeal` come sigillo d'archivio.
4. **Miniatura mappa** dal `mapPinUrl` esistente incorniciata come "posizione nell'atlante" accanto a Info pratiche.

---

## DIREZIONE C — «Album Cinematico di Coppia»

### 1. Concept (una frase)

Il sito è **l'album di coppia in movimento**: frame reali a piena pagina, una scena alla
volta, con didascalie d'autore numerate e un pannello-claim che si posa sopra
l'immagine — la voce di R&B scritta sulle loro foto vere. **Riferimenti dossier**: Hedwig
Curated Travel (§7, didascalie d'album numerate «I. When the locals…» + logo-timbro sopra
la foto), Lithuania Travel (§9, card-claim flottante sopra full-bleed video), Travel Next
Level (§10, disciplina "una scena, un'idea" + transizioni fluide — SENZA la sua imagery CG).

### 2. Cosa CAMBIA

- **Type scale** (cinematica, la più display delle tre):
  - claim/h1 `clamp(3.6rem, 7vw, 7.2rem)/0.9` Fraunces 400, tracking `-0.055em` (vicino a `.trace-hero h1`).
  - **didascalia d'autore numerata** (Hedwig): numero romano + testo, Fraunces `clamp(1.15rem, 1.6vw, 1.6rem)/1.35` — es. «I. La sera qui nessuno va in spiaggia prima del tramonto. Iseo.»
  - claim del pannello flottante: Fraunces `clamp(2rem, 4vw, 3.4rem)/1.05`.
  - kicker/meta sopra il pannello: Inter `0.66rem`, tracking `0.18em`, uppercase.
- **Spacing**: full-bleed edge-to-edge, scroll a **scene sequenziali** `100svh` (una scena, un'idea); il pannello-claim ha padding interno generoso e margine dal bordo (`clamp(2rem, 6vw, 6rem)`).
- **Motion signature (UNO)**: _«la scena che si posa»_. Ogni frame full-bleed entra e il **pannello-claim scivola e si assesta** (motion 12: `translateY(24px)→0` + `opacity 0→1`, spring morbido) mentre la **didascalia numerata si rivela** (GSAP SplitText, numero romano prima del testo). Nessun ken-burns aggressivo, nessuno scroll-jack: `lenis` (già presente) dà solo lo smorzamento. Un gesto, cinematografico ma calmo — TNL "una scena alla volta" senza lo spettacolo>contenuto.
- **Trattamento immagini**: **frame reali dei reel R&B** a piena pagina (imagery-truth), scrim inchiostro leggero per leggibilità del pannello (già `.trace-hero__shade`); logo-timbro disegnato sopra la foto alla Hedwig (usa il timbro di brand esistente, non un nuovo logo).
- **Sezioni NUOVE**:
  1. **«Il nostro arco 2016→2026»** — l'arc reale della coppia (dall'audit IG) come sequenza di frame album: da viaggiatori a family, «fagiolino / primo volo». Solo frame reali.
  2. **«Didascalie d'autore»** — full-bleed con numero romano + voce R&B sopra i posti-scoperta più forti (Tim Burton, Caraibi in Italia, malocchio a Madrid — tutti reali dall'audit).
  3. **«La copertina del viaggio»** — pannello-claim flottante alla Lithuania sopra l'hero cinematico esistente, con la formula-firma «Posti che sembrano inventati. Ma ci siamo stati davvero.»

### 3. Cosa NON cambia

DNA intatto. Divieti rispettati con particolare attenzione all'**imagery-truth**: NESSUNA
imagery CG/AI di TNL — solo frame reali dei reel (per questo serve `asset-curator`); niente
chartreuse Hedwig né palette pastello/foresta Lithuania (accento resta terracotta); niente
condensed caps; niente scroll-jack forzato («scroll nativo» — regola homepage dall'audit IG).
Sans-led di Hedwig NON adottato: i display restano Fraunces.

### 4. Asset dormienti riusati

Su `trace-*`: `.trace-hero` full-bleed + `.trace-hero__image` + `.trace-hero__shade`
(scrim) + `.trace-hero__content` sono già la scena cinematica con pannello. Il componente
**`CinematicHomepage.tsx`** (già in produzione, `src/components/home/cinematic/`) è la base
viva su cui innestare pannello-claim + didascalie numerate. `.trace-frame figcaption` →
seme delle didascalie d'autore. `lenis` + `motion` già montati.

### 5. Impatto perf (budget LCP 2.5s / CLS 0.1)

- **Librerie**: **nessuna nuova** (motion, lenis, GSAP+SplitText già presenti).
- **LCP**: **è la direzione a rischio LCP più alto** — full-bleed = immagine hero grande. Mitigazione obbligatoria: primo frame `priority`, `responsiveWidths` fino a 1600, `preload`, formato AVIF/WebP; i frame successivi `loading=lazy`. Con questo, 2.5s raggiungibile. Da validare con `perf-engineer` su rete reale.
- **CLS**: pannello e didascalia animati con `transform`/`opacity` (compositor), immagini con dimensioni fisse → shift **basso**. Attenzione al pannello flottante su mobile (deve stare nel viewport, non spingere il full-bleed): testare a 375px.

### 6. Sulla pagina-tempio `/posto` (62 URL)

1. **Cover full-bleed** con **didascalia d'autore numerata** al posto della card compatta: «I. {hook}. {luogo}» sopra il frame reale.
2. **Pannello-verdetto flottante** alla Lithuania: `VerdictSeal` + verdetto R&B posati sopra la cover invece che sotto.
3. **Reel come scena**: il CTA «Guarda il reel» diventa il gesto naturale — la cover è già un frame del reel; play-overlay già presente nel PostoStamp.
4. **Sequenza album prev/next**: `PostNavigation` come "scena precedente / prossima scena" con transizione morbida (View Transitions API nativa, nessuna libreria).

---

## Tabella comparativa

| Direzione                 | Concept in 3 parole           | Rischio                                                          | Sforzo impl.                            | Resa su `/posto`                                                                                            | Asset dormienti riusati                                                   | Nuove librerie                                        |
| ------------------------- | ----------------------------- | ---------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| **A · Rivista Viva**      | Impaginato · folio · filetti  | **Basso**                                                        | Medio (arsenale journal-\* già scritto) | Alta — folio + rubrica + cover-block danno subito autorità editoriale                                       | `journal-*` quasi intero + `.trace-frame`                                 | Nessuna                                               |
| **B · Atlante di Coppia** | Rotta · codici · contatori    | **Basso**                                                        | Medio                                   | Molto alta — codice d'archivio + "tappa N di 29" + timbro sono nativi del posto                             | `.trace-rail` (route-line), `.trace-section`, `.trace-number`, PostoStamp | Nessuna (`rough-notation` solo eventuale, gate owner) |
| **C · Album Cinematico**  | Scena · didascalia · pannello | **Medio** (LCP full-bleed + serve asset-curator per frame reali) | Medio-alto                              | Alta — cover full-bleed + didascalia d'autore + pannello-verdetto, ma dipende dalla qualità dei frame reali | `.trace-hero*`, `CinematicHomepage.tsx`, `.trace-frame figcaption`        | Nessuna                                               |

---

## Punti che richiedono gate owner

1. **Base scura `journal-home` `#d1c6b7`** (dir. A): il fondo-pagina del sistema journal è
   una carta più scura della sand di brand `#faf8f4`. Adottarla come superficie principale è
   una **deviazione di palette** → gate owner. Alternativa senza gate: mantenere la sand di
   brand e usare `#d1c6b7` solo come "fondo tra le pagine" nel page-flip.
2. **`--trace-red` `#bd3f23`** (dir. A e B) diverge dall'accento terracotta di brand
   `#c2410c`. Da riallineare al token di brand in implementazione, oppure **gate owner** se
   si vuole tenere il rosso-timbro più caldo del trace system.
3. **Terza famiglia tipografica `--font-script`** (nota a mano, dir. A `journal-handnote`):
   DESIGN.md fissa Fraunces+Inter. Introdurre un corsivo manoscritto per le note d'autore è un
   **gate owner** (o si rinuncia alla nota a mano, o la si approva esplicitamente).
4. **`rough-notation`** (dir. B, solo se il tratto della rotta a mano risultasse insufficiente
   in SVG puro): install di libreria → gate owner, con scheda `TPL_Tooling_Evaluation`. Default
   resta zero-install.
5. **Frame reali R&B** (dir. C): l'imagery-truth impone frame reali dei reel, non AI. La
   direzione C **non è eseguibile** senza un passaggio `asset-curator` che estragga/selezioni i
   frame — da mettere a piano prima dell'implementazione (non è un gate palette, è una
   dipendenza di asset).

---

_Prossimo passo: scelta owner della direzione → R4 (direction page in `design-lab/` +
handoff a `frontend-builder`, con eventuale `asset-curator` a monte per la C)._

---

## ADDENDUM 2026-07-24 — Input owner: motion alla Polarsteps + temi per audience

L'owner ha indicato polarsteps.com come riferimento per animazioni/dinamismo e
chiesto la differenziazione tematica di Viaggiatori / Family / Collaborazioni.
Analisi svolta nel browser reale (scroll completo della homepage + probe JS).

### Anatomia del motion Polarsteps (verificata)

Stack: il sito è **fatto con Framer** (classi `framer-*` ovunque) — cioè lo stesso
motore di `motion` 12 già nel repo — più **CSS scroll-driven animations**
(`scroll-timeline` presente nei fogli di stile) e UNA scena sticky. Zero canvas,
zero lottie, zero three al load. **Tutto replicabile con lo stack esistente.**

I 6 effetti che creano la sensazione "dinamico ma pulito":

1. **Oggetto-eroe sticky**: un solo telefono resta in scena e si raddrizza/ruota
   mentre lo scroll avanza; il CONTENUTO dentro lo schermo cambia per sotto-scena
   (crossfade). Un oggetto, molte scene.
2. **Capitoli con wayfinding**: barra PLAN / TRACK / RELIVE pinnata in basso che
   si aggiorna al passaggio di capitolo — lo scroll ha una mappa.
3. **Theme-flip per capitolo**: al capitolo TRACK l'intera pagina passa da crema
   `#fff2e5` a notte scura, poi torna chiara su RELIVE. Stessa struttura, tema
   diverso per capitolo.
4. **Accento per capitolo**: pill e kicker cambiano colore per capitolo
   (verde scuro / rosso / verde) — micro-identità dentro un solo sistema.
5. **Cards che si posano**: ventaglio di card-ricordo che entrano da fuori
   attorno all'oggetto-eroe (RELIVE).
6. **Kicker manoscritto colorato** per capitolo.

Perché resta pulito: un gesto per scena, molto bianco, solo transform/opacity
(compositor), nessuno scroll-jack duro.

### Siti simili (verificati oggi)

- **tripsy.app** — product page Apple-clean: telefono centrale + card UI
  flottanti attorno; ottimo per il pattern "cards che si posano".
- **findpenguins.com** — stesso genere, esecuzione più debole: utile come
  contro-esempio (hero+phone senza capitoli = piatto).
- **insideasiatours.com/when-to-travel** (Unseen Studio, awwwards SOTD) —
  scrollytelling narrativo GSAP su dati meteo/eventi di viaggio.
- Dal dossier R1: **Travel Next Level** (disciplina una-scena), **Lithuania
  Travel** (pannello su full-bleed) appartengono alla stessa famiglia.
- Pattern library: Codrops "On-Scroll Animation Ideas for Sticky Sections".

### Giudizio

La **meccanica** Polarsteps è eccellente e già prevista in nuce dalla direzione B
(la route-line È la firma Polarsteps tradotta in editoriale). La sua **estetica**
(mockup telefono, rounded-SaaS, bold geometrico) resta fuori DNA. La traduzione
giusta: il nostro oggetto-eroe sticky non è un telefono — è il taccuino/atlante
(o la scheda-posto), e i capitoli non sono PLAN/TRACK/RELIVE ma le tre audience
o i pillar editoriali.

### Proposta: «Un DNA, tre registri» (differenziazione audience)

Meccanismo theme-flip alla Polarsteps applicato alle 3 audience — stessa
struttura e stessi componenti, registro cromatico diverso:

| Audience           | Superficie                                                                     | Accento                                           | Registro                                                         |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------- |
| **Viaggiatori**    | carta `--color-atlante-carta`                                                  | terracotta `--color-accent`                       | Atlante — default                                                |
| **Collaborazioni** | notte `--color-atlante-notte` #17375a (token esistente, già "pagine verdetto") | terracotta su scuro `--color-accent-on-dark`      | Istituzionale — prova e misura                                   |
| **Family**         | sand `--color-sand`                                                            | **token NUOVO da definire** (accento più morbido) | Caldo-morbido — **GATE OWNER** (nessun token family esiste oggi) |

Implementazione: `data-theme` di sezione/rotta + wayfinding pill (il selettore a
3 audience esiste già in navbar/homepage — si eleva, non si inventa). Compatibile
con TUTTE e tre le direzioni R3; con la B è sinergia naturale.

### Impatto sui gate

- Il gate 5 (frame reali) e i gate palette restano invariati.
- NUOVO gate 6: accento/registro Family (token nuovo) — decidere con la scelta direzione.
- Nessuna libreria nuova neanche per questo: motion 12 + gsap + lenis coprono
  tutti e 6 gli effetti; CSS scroll-timeline è progressive enhancement.
