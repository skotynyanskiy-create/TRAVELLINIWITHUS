# FRONTEND EXCELLENCE REPORT — Travelliniwithus

Audit a sei pilastri (architettura, performance, SEO, a11y, design system, security)
con refactoring diretto e validazione completa. Eseguito il 2026-08-18 sul branch
`chore/config-hardening-2026-07-26`.

Metodo: ogni finding statico è stato **verificato sul codice o nel browser reale
prima di intervenire**. I falsi positivi sono documentati quanto i fix — un audit
che elenca 50 interventi inventati vale meno di uno che ne dimostra 3 veri.

---

## 1. Executive Matrix

| Pilastro                       | Pre-audit                                                                                      | Post-audit                                                | Delta                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------ |
| **Architettura & Type-Safety** | 0 `any` in `src/` non-test; ErrorBoundary root + Shop; stato in custom hooks/context           | Invariato + 1 file orfano rimosso (−106 righe)            | Dead code azzerato                   |
| **Performance / CWV**          | Budget bundle tutti PASS; route article già sotto lazy-boundary; LCP poster preloadato         | Invariato + 1 fonte CLS eliminata (`/manifesto` fallback) | CLS residuo → 0 anche su rotta lab   |
| **SEO & Semantic DOM**         | 100% pagine con `<SEO>` (canonical, OG, Twitter); JSON-LD per tipologia; sitemap 133 pagine    | Invariato — verificato in DOM reale su 6 rotte            | Confermato, non presunto             |
| **Accessibilità WCAG 2.2**     | Skip-link, landmark completi, `alt` al 100%, focus-visible diffuso, `<details>` nativi per FAQ | Invariato — verificato in DOM reale a 375px               | Confermato, non presunto             |
| **Design System & Responsive** | CSS vars brand, zero overflow orizzontale, skeleton loaders (incluso ArticleBodySkeleton)      | Invariato                                                 | Già a norma                          |
| **Client Security**            | 2 iniezioni JSON-LD non-escapate (script-breakout); localStorage solo dati non sensibili       | **2 vettori chiusi** via componente `JsonLd`              | Superficie XSS ridotta a 0 sink noti |

**Baseline onesta**: questa codebase era già vicina al benchmark prima dell'audit
— zero `any`, budget bundle attivi in CI, audit statici propri (`audit:ui`,
`audit:size`), 380 test. Il valore di questo passaggio è nei tre difetti reali
trovati e chiusi, e nella verifica strumentale di ciò che prima era solo dichiarato.

---

## 2. Interventi eseguiti (con file e riga)

### 2.1 Security — script-breakout JSON-LD (2 fix, il finding più serio)

`src/components/JsonLd.tsx` esegue l'escape di `<` → `<` prima
dell'iniezione. Due componenti bypassavano il componente e iniettavano
`JSON.stringify` grezzo in `dangerouslySetInnerHTML`:

- **`src/components/article/directives/domande.tsx`** — le FAQ arrivano
  dall'editor articoli: un `</script>` in una risposta avrebbe chiuso il tag
  e aperto un vettore di markup injection. Ora passa da `<JsonLd>`.
- **`src/components/club/ClubFaq.tsx`** — contenuto statico (rischio solo
  teorico), allineato per coerenza e DRY.

Verificato in browser: su `/club` il `FAQPage` JSON-LD post-refactor parsa
come JSON valido (`JSON.parse` ok, `@type: "FAQPage"` presente).

### 2.2 CLS — fallback Controluce (`/manifesto`)

**`src/experience/controluce/ControluceFallback.tsx`** — le 5 cover reel
(720×1296 ÷ 1080×1944, ~5:9) erano `w-64` senza altezza riservata: ogni load
spostava il testo sottostante. Aggiunto `aspect-[5/9] object-cover`.
Verificato in DOM reale a 375px: ogni `<img>` riserva 256×461 prima del load.

### 2.3 Dead code

**`src/components/ui/MotionSignature.tsx`** eliminato (106 righe, wrapper
motion mai importato da `src/`, `scripts/`, config o test — verificato con
scanner + grep incrociato). La cartella `ui/` conteneva solo questo file.

---

## 3. Falsi positivi documentati (nessun intervento, con prova)

| Segnalazione                                                              | Verità sul codice                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 10 × `target="_blank"` "senza noopener"                                   | Tutti hanno `rel="noreferrer"`, che **implica** `noopener` in ogni browser moderno; `Risorse.tsx` ha già la gestione `rel` affiliata dedicata                                                                                                    |
| 4 × `<img>` senza dimensioni in `OptimizedImage.tsx`                      | `width`/`height` passano via spread `sharedProps` — lo scanner non attraversava lo spread                                                                                                                                                        |
| `<img>` in `ControluceOverlay.tsx`                                        | Absolute-positioned, `opacity-0`, decorativa: non sposta layout                                                                                                                                                                                  |
| ~40 file "orfani" (pagine incluse)                                        | Bug dello scanner: l'harness Bash collassa `\\` negli heredoc e la regex sugli import `lazy()` diventava un gruppo di cattura. Ricontrollo senza backslash: 17 candidati, di cui 16 vivi (lazy-import, script di pipeline, server, vitest setup) |
| `AiAssistant.tsx` + `aiCompanion.ts` "dead code"                          | Dormienti **per decisione documentata** (Layout.tsx:60): si rimontano quando il RAG avrà un corpus. Non si eliminano                                                                                                                             |
| Warn `audit:ui` su colori raw (`#c85a32`, `#faf7f2`…) nei componenti home | Palette deliberata della composizione cinematic/diario — il brand DNA non è un difetto da sanare. Restano WARN informativi, non errori                                                                                                           |

---

## 4. Registro per rotta — verifica in browser reale (viewport 375×812)

| Rotta                              | h1  | Overflow-X | Landmark                           | img senza alt | JSON-LD                  | Risorse ≥400 |
| ---------------------------------- | --- | ---------- | ---------------------------------- | ------------- | ------------------------ | ------------ |
| `/` (home)                         | 1   | 0          | header/nav/main/footer + skip-link | 0             | 4 (validi)               | 0            |
| `/esplora`                         | 1   | 0          | ✓                                  | 0             | 4                        | 0            |
| `/posto/volterra-antica-velathri`  | 1   | 0          | ✓                                  | 0             | 3                        | 0            |
| `/club`                            | 1   | 0          | ✓                                  | 0             | 4 (incl. FAQPage valido) | 0            |
| `/collaborazioni` (audience brand) | 1   | 0          | ✓ + `data-audience="brand"` attivo | 0             | 4                        | 0            |
| `/manifesto` (lab, noindex)        | —   | 0          | fallback reduced-motion attivo     | 0             | —                        | 0            |

Link esterni con `target="_blank"` privi di `rel` protettivo trovati nel DOM: **0**
su tutte le rotte sondate. Console: un solo 404 osservato nel primo giro,
**non riproducibile** in nessuna delle sei rotte al secondo passaggio
(transiente dev-server/service-worker, non un asset del sito).

---

## 5. Validazione (self-healing loop — esito: nessun healing necessario)

| Comando                                                                                            | Esito                                   |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `tsc --noEmit`                                                                                     | 0 errori                                |
| `eslint . --max-warnings=0`                                                                        | 0 errori, 0 warning                     |
| `vitest run` (suite completa)                                                                      | **380/380 test, 65 file**               |
| `npm run build` (catena completa: media-kit, lead-magnet, OG, immagini, sitemap, vite, route-HTML) | Exit 0 — 133/133 pagine statiche emesse |
| `npm run audit:size`                                                                               | Tutti i budget PASS                     |

### Budget bundle (post-intervento)

| Budget                                     | Misura                       | Limite       |
| ------------------------------------------ | ---------------------------- | ------------ |
| initial-js                                 | 762.4 KB raw / 237.7 KB gzip | 780 / 250 KB |
| article-route                              | 54.2 KB raw / 15.3 KB gzip   | 90 KB        |
| home-route                                 | 36.7 KB raw / 10.1 KB gzip   | 110 KB       |
| react-core                                 | 284.7 KB raw                 | 320 KB       |
| three, maplibre, mapbox, firestore, charts | tutti PASS                   | —            |

---

## 6. Cosa NON è stato fatto, e perché

- **Nessun repaint della palette home** — i token raw dei componenti
  cinematic/diario sono scelta di brand, protetta dalle regole di progetto.
- **Nessun file guardiato toccato** — `server.ts`, `firestore.rules`,
  `admin.ts`, config lint/TS restano fuori dal perimetro frontend per policy.
- **Nessuna memoizzazione speculativa** — nessun re-render patologico
  osservato in console; ottimizzare senza una misura che lo giustifichi è
  rumore, non architettura.
- **Nessun componente dormiente eliminato** — AiAssistant resta per il
  rientro del RAG, da decisione dell'owner.

## 7. Prossimi passi suggeriti (fuori scope di questo audit)

1. Il collo di bottiglia del sito non è tecnico: è editoriale (articoli seed
   non pubblicati). Lighthouse era già 89–96 con CLS 0 prima di questo audit.
2. ~~Una spec e2e sulla rotta `/articolo`~~ — **chiuso nel round 2** (sotto):
   la rotta è verificata in browser reale via `PREVIEW_ARTICLES`.
3. I WARN di `audit:ui` sui colori raw possono essere azzerati promuovendo i
   3 colori cinematic a CSS var di brand — decisione di design, non di codice.

---

## 8. Round 2 (stesso giorno) — misure vere e due sprechi trovati dai numeri

### 8.1 Lighthouse CI completo: la domanda `/mappa` è chiusa

Eseguita l'intera suite CI (`lighthouserc.json`, 9 URL, stesse soglie del gate):

| Rotta                        | Perf | A11y    | BP  | LCP    | CLS   |
| ---------------------------- | ---- | ------- | --- | ------ | ----- |
| `/`                          | 93   | **100** | 100 | 1670ms | 0.000 |
| `/esplora`                   | 92   | **100** | 100 | 1739ms | 0.000 |
| `/chi-siamo`                 | 96   | **100** | 100 | 1386ms | 0.000 |
| `/collaborazioni`            | 94   | **100** | 100 | 1548ms | 0.000 |
| `/media-kit`                 | 95   | **100** | 100 | 1426ms | 0.000 |
| `/shop`                      | 95   | **100** | 100 | 1427ms | 0.000 |
| `/family`                    | 95   | **100** | 100 | 1513ms | 0.000 |
| `/posto/verona-vigna-benini` | 91   | **100** | 100 | 1970ms | 0.000 |
| `/mappa`                     | 96   | **100** | 100 | 1379ms | 0.000 |

**Accessibilità 100/100 su tutte e nove le rotte.** Il `/mappa` a 0.94 che
minacciava il gate CI è storia: sopravviveva solo nei report vecchi in
`.lighthouseci/reports`, il fix footer h3→h2 del 2026-08-14 l'aveva già chiuso.
Zero assertion fallite sull'intera suite.

### 8.2 Rotta `/articolo` verificata in browser reale

Via `PREVIEW_ARTICLES` (`/articolo/guida-blocchi-editoriali`, 375px): chunk
`ArticleMarkdownBody` caricato **on demand** (lazy boundary vivo), disclosure
affiliati auto-iniettata, 10 h2, direttiva `:::domande` → 3 `<details>` nativi,
h1 unico, `noindex` corretto, zero overflow, zero risorse fallite. Il DropCap
non scatta sui preview: primi paragrafi da 102–162 char, sotto la soglia dei
280 — comportamento content-driven, non un bug.

### 8.3 Due sprechi immagine trovati da `uses-responsive-images` (fix + prova)

- **`PostNavigation.tsx`** (nav Precedente/Successivo su ogni pagina posto):
  thumb 64×64 che scaricavano le cover base intere — 437KB + 241KB per due
  miniature. Aggiunti `responsiveWidths={[320]}` + `sizes="64px"`. Verificato
  nel DOM: ora risolvono `-320.avif`, **74KB invece di 678KB, ×79 pagine**.
  Waste Lighthouse della rotta: da 516KB a 73KB (il residuo è floor — per
  thumb 64px anche la -320 è larga; varianti -128 = rendimenti decrescenti).
- **`hero-amalfi`** (cover fallback di ArchiveCard/regions/articleData):
  viveva alla radice di `/images`, fuori da `RESPONSIVE_DIRS`, quindi senza
  varianti — le card di `/esplora` scaricavano la base da 253KB. Fix doppio:
  la pipeline (`optimize-images.mjs`) ora genera varianti anche per la radice,
  e `ArchiveCard` riconosce le dir con varianti (prima whitelist solo
  `destinations/`, ora anche `reels/`, `atlante/`, `family/` e root).
  Verificato: le card risolvono `hero-amalfi-480.avif`, 67KB caricati una
  volta. Sparita dalla lista waste di Lighthouse.

### 8.4 Un errore mio, dichiarato

Il primo edit a `PostNavigation` ha messo un commento JSX dentro le parentesi
del ternario: sintassi rotta, Vite in errore, pagina bianca. Preso da
`tsc --noEmit`, corretto, riverificato. È il motivo per cui il loop di
validazione esiste.

### 8.5 Validazione finale round 2

`tsc` 0 errori · `eslint --max-warnings=0` pulito · **390/390 test** ·
build exit 0 (133/133 pagine) · tutti i budget bundle PASS · LHCI senza
assertion fallite.

### Watch-list residua (non bloccante)

- Su `/esplora` restano ~50–75KB di waste per card reel che pescano una
  variante sopra il necessario (`sizes` dichiara 100vw/50vw a breakpoint dove
  il render è ~430px): tuning fine dei `sizes`, guadagno piccolo, sotto-fold.
- `PostoStamp` dichiara `sizes="896px"` anche dove il render è più stretto —
  stesso discorso, non tocca LCP.

---

## 9. Round 3 — audit brutale su tema e superficie visibile (2026-08-18)

Richiesta esplicita dell'owner: più critico e brutale su tutto ciò che si
vede. Metodo: sonde DOM su dev server reale a 375px (screenshot non
disponibile su questo pane), computed styles, contrasti composti a mano,
lettura integrale del copy. Ogni accusa è stata riverificata prima di entrare
qui; i falsi positivi del mio stesso strumento sono in fondo, perché un audit
che non dichiara i propri errori non è brutale, è solo rumoroso.

### 9.1 Colpi confermati e CORRETTI in sessione

| #   | Difetto                                                                                                                                                                                                                                                                         | Dove                                                                                                          | Fix                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | **«Jack Skeleton»** — il personaggio si chiama Jack Skellington, in italiano ufficiale **Jack Skeletron**. Errore di specificità in homepage, su un brand che vende specificità                                                                                                 | `content-seed.json` (fonte della card), `reels.ts`, seed articolo Burton, nota Obsidian — 9 occorrenze totali | Corretto ovunque in «Jack Skeletron»; verificato nel DOM vivo |
| 2   | **`172K+` follower hardcoded** in `DiarioConversionSection` mentre la fonte governata è `BRAND_STATS` (site.ts, misurato 172.680). Il commento di Collaborazioni.tsx:315 predica «un numero pubblico deve stare in un file che passa da una code review» — e la home lo violava | `DiarioConversionSection.tsx:215`                                                                             | Ora legge `BRAND_STATS.instagramFollowers`                    |

### 9.2 Colpi confermati, NON corretti (decisioni di design → owner)

**A. Micro-tipografia 9–10px come sistema.** Le etichette che reggono
l'intero linguaggio del sito — categoria, provenienza, navigazione — vivono a
9 e 10px uppercase con tracking largo:

- **9px**: badge di provenienza «ADV / Su invito / In collaborazione»
  (`ContentCard`, `CleanFeaturedGrid`, `ArchiveCard:123,171`,
  `PostoStamp:113,117`, `ClubMembershipHero:193,226`, `RelatedArticles:42,47`).
  La disclosure pubblicitaria — che per AGCOM deve essere «chiaramente
  percepibile» — è **la scritta più piccola dell'intero sito**. Su un brand
  costruito sulla trasparenza («33 collaborazioni dichiarate» è nel hero!)
  è un'incoerenza sostanziale, non cosmetica: la trasparenza c'è, ma a 9px.
- **9px**: le etichette informative della pagina posto («Dove», «Indirizzo»,
  «Cos'è», «Ci siamo stati») — lo scheletro informativo della pagina che
  monetizza, alla dimensione minima del sito.
- **10px**: audience switcher (Viaggiatori/Family/Collaborazioni), «IT»,
  riga prezzi nelle card reel.
- **Raccomandazione**: 11px minimo per la disclosure e le etichette
  informative; i badge ADV meritano 10-11px per ragione normativa prima che
  estetica. Una passata sola, token unico (`text-label`?), non 9 valori sparsi.

**B. Prezzi amputati dall'ellipsis.** Nel carosello reel della home
(`HiggsfieldReelCarousel`, riga meta `truncate text-[10px] font-bold
text-white/75`): a 375px «Pranzo da 14,90€ · Cena da 28,90€» perde 25px,
«Promo 30€ (2 spritz XL + sushi pizza)» ne perde 36. **Il dato che
differenzia il brand — il costo reale — è la prima cosa che il truncate
taglia.** Bianco al 75% su foto, 10px, bold, troncato: quattro scelte che
singolarmente passano e insieme uccidono l'informazione. Raccomandazione:
2 righe con `line-clamp-2`, o prezzo separato dal resto della meta.

**C. 25+ titoli interrogativi consecutivi nel diario.** «Dormiresti in una
gabbia?», «Voleresti sull'acqua?», «Credi nella magia?», «Un sushi a forma di
alveare?»… — l'intero stream è caption Instagram incollate nel sito. Uno è un
hook; venticinque di fila sono un tic che appiattisce la voce editoriale
esattamente come i cliché che `anti-ai-slop` combatte. Raccomandazione: sul
sito, titolo dichiarativo + la domanda semmai nel sottotitolo (il permalink IG
conserva l'hook dov'è nato).

**D. Contrasto al limite esatto sulle etichette accent.** `--color-accent-text`
(#c2410c) è documentato «4,85:1, AA» su fondo chiaro — vero su sand pieno. Ma
sulle chip con velo `bg-black/5` il fondo composito scende e il rapporto
atterra a **4,4–4,6 a seconda della superficie sottostante**, a cavallo del
minimo 4,5 — su testo da 10px. Analogo su `/club`: etichette a 3,8 misurato.
Un sistema premium non vive sul filo del minimo legale alla dimensione minima.
Raccomandazione: su chip scurite, testo ink; accent-text solo su fondo pieno.

**E. Tap target di navigazione 24–28px.** «Esplora» e «Mappa» in header a
24px, CTA footer a 28px: passano il minimo WCAG 2.2 AA (24px) di misura,
lontani dai 44px delle HIG. Padding verticale, non redesign.

**F. Sotto-fold interamente a `opacity: 0` finché il reveal JS non scatta.**
Tutto ciò che sta sotto la prima schermata non esiste senza JS/motion:
fragilità da progressive enhancement (chi naviga con JS lento vede pagine
mozze). Nessun utente reale lo sperimenta oggi; resta un rischio strutturale
da conoscere.

### 9.3 Cosa regge il colpo (va detto con la stessa brutalità)

Il copy della home è il migliore asset visibile del sito: «79 posti provati di
persona · 33 collaborazioni dichiarate · Costi in chiaro», il contatore «Posti
che non abbiamo visto: 0», date e prezzi reali per card, disclosure per-card.
Nessun sito travel italiano nella fascia mostra questa disciplina. Gli stati
vuoti (`/preferiti`) e il 404 hanno copy, CTA e vie d'uscita. La struttura
semantica, i landmark, la sitemap, gli OG sono a posto ovunque. Il problema
del tema non è la sostanza: è che la sostanza è impaginata a 9px.

### 9.4 Accuse ritirate (falsi positivi del mio strumento, dichiarati)

- «Cover sfocata sul featured della home»: il pick `-320` era un artefatto dei
  resize della sessione; a caricamento pulito sceglie `-768` correttamente.
- «Testo invisibile su /collaborazioni» (nero su nero a 30px): erano card a
  `opacity: 0` pre-reveal — lo scroll programmatico è un no-op con Lenis, la
  sonda non può farle rivelare; l'utente reale le vede normalmente.
- Contrasti «1,1:1» su testo bianco: il mio parser rgb non legge i colori
  `oklab()` di Tailwind 4 — quelle righe erano bianco su nero, contrasto
  massimo.
- «`-768.avif` sfocata» su /esplora e /posto: `naturalWidth` delle immagini da
  srcset è già corretto per densità; il confronto ri-moltiplicato per DPR
  accusava immagini perfette.

### 9.5 Validazione round 3

`tsc` 0 errori · lint pulito sui file toccati · test home 12/12 · fix
«Skeletron» e `BRAND_STATS` verificati nel DOM del dev server.

---

## 10. Round 4 — fix di sezione 9.2 applicati su approvazione owner («procedi»)

I punti A, B, D, E della sezione 9.2 sono stati implementati e verificati.
Il punto C (25+ titoli interrogativi del diario) resta editoriale: riscrivere
i titoli è lavoro di voce, non di codice — va all'editorial-writer.

### 10.1 Cosa è cambiato

| Pilastro                              | Intervento                                                                                                                                                               | File                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — disclosure 11px**               | Tutti i badge di trasparenza commerciale (ADV / Su invito / In collaborazione / Affiliato / commercialLabel) da 9-10px a **11px**                                        | `PostoStamp`, `QuickViewDrawer`, `PostiInVetrina`, `HiggsfieldReelCarousel` (×2), `SorprendimiOverlay`, `PostiVicini`, `Risorse`, `CleanFeaturedGrid`, `ContentCard` |
| **A — etichette informative**         | `.atlante-scheda__label` («Dove / Indirizzo / Cos'è / Ci siamo stati») da 0.56rem (9px) a **0.6875rem (11px)**                                                           | `src/styles/atlante.css`                                                                                                                                             |
| **B — prezzi mai amputati**           | Riga meta del carosello reel: `whitespace-nowrap`+`truncate` → `flex-wrap`; il prezzo passa a 11px `white/85` e non si tronca più                                        | `HiggsfieldReelCarousel`                                                                                                                                             |
| **D — token giusto sul fondo giusto** | Eyebrow categoria SULLA foto e label del club hero su fondo ink: `--color-accent-text` (token per fondo chiaro) → `--color-accent-on-dark` (#e8834e, nato per questo)    | `CleanFeaturedGrid`, `CleanFeaturedPlaces`, `ClubMembershipHero`                                                                                                     |
| **E — hit-area nav**                  | Link di navigazione desktop: pseudo-elemento `after:-inset-x-2 after:-inset-y-3` — area cliccabile ~51px senza alcun cambiamento visivo (l'underline attivo resta dov'è) | `Navbar`                                                                                                                                                             |

Fuori scope per scelta dichiarata: le chip categoria/status decorative a 9px
(«Anteprima», status ordini, tag risorse, cover PDF, UI mappa) — non sono
disclosure né scheletro informativo, e bomparle alla cieca senza occhi sul
layout rischiava collisioni (es. il timbro sotto la X di SorprendimiOverlay).

### 10.2 Verifica nel DOM reale (dev server, 375px e 1280px)

- Prezzi con «€» troncati sulla home: **0** (erano 3+).
- Eyebrow categoria su foto: `rgb(232,131,78)` = accent-on-dark. Applicato.
- Badge disclosure a campione (6 sulla home, 1 su /posto): **tutti 11px**.
- `/posto`: «Dove / Indirizzo / Cos'è / Ci siamo stati» **tutti 11px**.
- `/club` «Guide riservate»: contrasto **da 3,82:1 a 7,34:1** (11px,
  accent-on-dark su ink) — da AA-fail a sopra soglia AAA.
- Nav desktop: click a 8px sopra il box del link colpisce il link
  (`elementFromPoint` → hit-area estesa attiva su Mete / Guide / Mappa / Chi
  siamo), zero spostamenti visivi.
- Overflow orizzontale: 0 su tutte le rotte sondate.

### 10.3 Validazione round 4

`tsc --noEmit` 0 errori · eslint pulito sui 12 file toccati · **394/394
test** · `audit:ui` senza nuove segnalazioni (i WARN restanti sono i colori
raw pre-esistenti dei componenti cinematic, decisione di brand).

---

## 11. Round 5 — consolidamento palette: la «palette parallela» non esiste più

L'indagine sui 134 WARN colore di `audit:ui` ha dato un esito migliore del
temuto e più imbarazzante del previsto: **il navy `#1a2b3c`, la terracotta
alternativa `#c85a32` e la sabbia `#faf7f2` non renderizzavano mai** — erano
valori di _fallback_ dentro `var(--token, #hex)`, reliquie di un'iterazione
di design precedente. In produzione i token brand vincono sempre. Il rischio
era latente ma reale: alla prima rottura dei token la home sarebbe diventata
navy, con una terracotta che il brand non usa.

### 11.1 Cosa è stato fatto (129 sostituzioni, `src/components/home`)

- **Fallback bugiardi eliminati** (~70): `var(--color-ink,#1a2b3c)` →
  `var(--color-ink)` e analoghi per sand/accent/border/muted-fg/ink-deep/
  accent-on-dark/accent-soft — allineato alla convenzione del resto del
  repo, che usa `var()` puro.
- **Raw tokenizzati**: `bg-[#FAF8F5]` → `var(--color-sand)` (Δ 1/255 sul
  canale blu, impercettibile); `neutral-900/700/600/300/200` → token
  ink/ink-2/muted-fg/border; `text-amber-700/800` (su chiaro) →
  `accent-text`; `amber-400/300` (su scuro/foto) → `accent-on-dark`;
  stella rating `fill-amber-500` → `accent` (UI non testuale, soglia 3:1
  documentata in index.css). L'amber faceva da _terza_ famiglia accento
  nel diario — ora c'è una sola terracotta, quella del DNA.
- Residuo hex in `home/`: **1**, dentro un commento esplicativo.

### 11.2 Perimetro di rischio

I file `diario/*` (dove vivevano amber e neutral) montano solo su
`/diario-preview`, rotta dev. Sulla home viva il delta visivo è **zero**:
i fallback non scattavano mai. Verificato nel DOM (375px): hero ink
`rgb(10,10,10)`, eyebrow terracotta `rgb(194,65,12)`, badge 11px, zero
errori di rete, overflow 0.

### 11.3 Validazione round 5

`tsc` 0 errori · eslint pulito · **394/394 test** · **WARN `audit:ui`:
da ~163 a 81** — il rumore colore della home è azzerato; gli 81 restanti
sono fuori da `home/` (prossimo candidato se si vuole continuare).

---

## 12. Round 6 — «sistema tutto»: chiusura completa dei fronti aperti

Su mandato owner, chiusi i tre fronti residui. Nota di misura: il «81» del
round 5 era il **cap di stampa** dello script (80 righe + 1 di troncamento),
non il conteggio vero — rialzato il cap su copia temporanea, i WARN reali
erano 88 pre-round e restano 88 post-round, ma la loro composizione è ora
**interamente giustificata** (sotto).

### 12.1 Fronte WARN — il debito colore è terminale

- **28 fallback bugiardi eliminati fuori da `home/`**: i 20 `#c85a32` di
  `/mappa` (la vecchia terracotta sopravviveva SOLO come fallback), il navy
  in `App.tsx` (PageLoader!) ed `Esplora.tsx`, ink-deep e accent-hover
  spuri, `ConsentBanner` tokenizzato.
- **`NearMeFilterButton` rebrandizzato**: era l'unico controllo del sito con
  palette propria (amber/stone) e — peggio — con varianti `dark:` che in
  Tailwind 4 scattano con `prefers-color-scheme`: un utente con OS scuro
  vedeva quel solo bottone andare in dark mode su un sito interamente
  chiaro. Ora: surface/ink/border, attivo ink, errore `--color-error`.
  Verificato nel DOM: `rgb(255,255,255)` / `rgb(10,10,10)` / zero amber.
- **Bottoni mappa** («Vicino a me», «Sorprendimi»): amber → accent.
- **Diario hero**: amber → token; il `text-blue-600` sul badge Meta
  Verified resta — è il blu di Meta, semanticamente suo.
- **I 53 WARN colore residui sono il fondo tecnico**: recharts (18, admin),
  @react-pdf (19 — i PDF non hanno CSS vars), maplibre/WebGL (7), rgba di
  ombre e glow con valori brand (4), 3 commenti che citano hex, il fondo
  `#0a0705` che si fonde col canvas mappa, il blu Meta. I 35 inline style
  sono `objectPosition` dinamici e motion. **Non c'è più deriva da
  correggere: c'è solo requisito tecnico dichiarato.**

### 12.2 Fronte micro-tipografia — 9px estinto (1 eccezione)

Bumpate a 11px le 29 occorrenze rimaste (chip categoria, status, tag,
media-kit, LeadMagnetCover web, etichette mappa). Unica eccezione
deliberata: il counter badge dentro il cerchio `h-4 w-4` della mappa —
11px sborderebbe dal contenitore fisso. `text-[9px]` nel repo: **1**.

### 12.3 Fronte immagini — tre difetti di serving trovati misurando

| Difetto                                                                | Prima                                           | Dopo (verificato nel DOM a 1280px)            |
| ---------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| Feature card Esplora (col-span-2) dichiarava `33vw`                    | `-480` **stirata a 773px** — sfocata su desktop | dichiara `66vw` → `toscana-768` su slot 773px |
| Griglia `xl:grid-cols-4` dichiarava `33vw`                             | `-480` per card da 277px                        | prop `sizes` per contesto → **`-320`**        |
| Regex varianti di ArchiveCard copriva 4 dir su 7 (bug mio del round 5) | `gastronomia.avif` **base, senza srcset**       | tutte le 7 dir + root → `gastronomia-480`     |

`ContentCard` e `ArchiveCard` ora accettano `sizes` per contesto con il
default invariato per le griglie standard (Destinazione 3-col intatta).

### 12.4 Un altro errore mio, dichiarato

Secondo commento JSX in posizione illegale (tra gli attributi del button di
NearMeFilterButton): pagina Esplora bianca finché `tsc` non l'ha preso.
Stesso pattern dell'errore in sezione 8.4 — evidentemente una mia abitudine
da sorvegliare, non un incidente isolato.

### 12.5 Validazione round 6

`tsc` 0 errori · `eslint --max-warnings=0` pulito · **394/394 test** ·
verifiche DOM: NearMe brand-token, feature card `-768`, griglia `-320`,
`gastronomia-480`, «Vicino a me» senza amber.

---

## 13. Certificazione e2e — l'albero è commit-ready

Suite Playwright completa sull'intero albero modificato (round 2–6 + lavoro
parallelo articolo): **164/164 test passati** (chromium + Mobile Chrome,
tutte le rotte pubbliche a 320/375/768/1280, mappa camera-vs-marker,
visual quality, form, consent).

Il percorso per arrivarci è documentazione utile quanto il verde:

1. Primo run: 11 falliti — **collisione HMR** fra due dev server (il mio
   5173 da audit + quello spawnato da Playwright su 3000, entrambi sulla
   porta websocket 24678).
2. Secondo run: 7 falliti — **server zombie**: HTTP vivo, websocket HMR
   morto; ogni pagina loggava l'errore ws e i cancelli console fallivano.
3. Terzo/quarto run: timeout webServer — TIME_WAIT sulla 3000 dopo il kill
   (`server.ts` non fa autoPort per policy CORS).
4. Quinto run: 5 falliti, tutti la stessa causa VERA: la spec
   `rotte-target-e-overflow` attendeva **900ms fissi** dopo il reload e
   sotto 12 worker fotografava `/esplora` ancora in skeleton («0 h1» — un
   h1 che esiste, verificato più volte nel DOM). Flake committato, non mio.
5. Fix: attesa a condizione (`waitFor h1, timeout 15s, catch`) PRIMA della
   sonda, **assertion invariata** — un h1 davvero assente fallisce ancora.
   → **164/164.**

Nessuno dei fallimenti era un difetto dei ~40 file modificati: due erano
il mio ambiente d'audit, uno era un flake pre-esistente della spec. Ora
che il flake è indurito, anche la CI ne beneficia.

---

## 14. Round 7 — i quattro fronti del menu, in ordine e per intero

### 14.1 Titoli del reel stream (punto C, chiuso senza riscrivere una riga)

La soluzione non era editoriale ma strutturale: **67/67 reel hanno un
`postoId`** e quindi un titolo dichiarativo già scritto e già vero. La card
del carosello ora apre col nome («Emotional Grand Motel», «Haru Sushi») e
la domanda scende a riga secondaria — il tic da caption è spezzato, ogni
hook resta intatto e fedele all'opener IG, zero contenuto inventato.
Verificato nel DOM: 6 card campione, titolo primario + hook sotto.
Il campo `hook` non è stato toccato: sul timbro flip-card («Sembra
inventato?» → «Esiste davvero») la domanda È il meccanismo del design.

### 14.2 Audit tastiera e focus (Playwright, eventi reali)

Esemplare quasi ovunque: skip link primo Tab e visibile al focus, tab-walk
25 passi senza perdite né elementi invisibili, focus trap del menu mobile
(15 Tab dentro, Escape chiude E restituisce il focus al trigger), Ctrl+K
apre la ricerca nell'input ed Escape la chiude.

**Un difetto reale trovato e corretto**: tre famiglie di link card
(`PostiInVetrina`, `HomeAudienceVoice`, `PostiVicini`) spegnevano l'outline
(`focus-visible:outline-none`) delegando il ring al figlio via
`group-focus-visible:ring-2` — e quel ring **non renderizza**: sei sonde
hanno dimostrato che `--tw-ring-shadow` si valorizza (`0 0 0 2px #ff4d1a`)
ma il box-shadow composto della card (che usa `shadow-[var(--shadow-md)]`
arbitrario) lo ignora. Chi navigava da tastiera attraversava quelle card
alla cieca. Fix robusto: outline accent esplicito sul link
(`outline-2 outline-offset-2 outline-[var(--color-accent)]`), che non
dipende da alcuna catena di variabili. Ri-verificato: **25/25 passi di Tab
con indicazione di focus visibile, 0 senza**.

### 14.3 Il 404

«Ops, ci siamo persi!» → **«Questo posto sembra inventato. E stavolta lo è
davvero.»** — il rovescio della tagline del brand al posto dell'unico
filler-cliché rimasto. Verificato nel DOM.

### 14.4 Gate di pubblicazione del pillar «dormire-posti-sembrano-inventati»

Eseguita la parte statica del gate prescritto da
`HANDOFF_..._frontend_to_gate.md`:

- `audit:provenance` PASS (nessuna violazione nuova) ·
  `audit:obsidian` PASS 0/0 · **dry-run publish pulito**: 2945 parole,
  excerpt 151 caratteri, cover reale con alt descrittivo, OG presente,
  `published: false` confermato.
- **Fact-check meccanico** (script che incrocia corpo ↔ registro):
  7/7 posti linkati esistono e non sono placeholder · **5/5 prezzi del
  corpo testualmente presenti nelle `value.price`** delle schede (98€ =
  Granduca «da 98€/notte»; 40/50€ = Graffignana «Piscina 40€ (50€ con
  lettino)» — citate per nome, senza link) · disclosure dichiarate a parole
  («Questa è pubblicità: ci hanno pagato per parlarne, ed è marcata ADV») ·
  anti-slop pulito · zero `[VERIFY]`.

**Verdetto: PASSA CON RISERVE.**

1. La verifica browser della pagina reale è impossibile pre-publish
   (`published: false` → Firestore non serve il documento): limite
   dichiarato dallo stesso handoff. Il motore di rendering è però coperto
   da 30 test jsdom sulle direttive + verifica browser via preview articles.
2. Nota del dry-run: `partnership`/`imageAlt`/`ogImage` non sono campi
   ammessi da `firestore.rules` e passano solo via Admin SDK — file
   blindato, decisione owner.
3. La pubblicazione resta un'azione dell'owner:
   `npm run publish:article -- dormire-posti-sembrano-inventati --commit --publish`.

---

## 15. Round 8 — «ciò che l'utente si aspetterebbe»: audit dei flussi reali

Cambio d'angolo su mandato owner: non più «com'è fatto» ma «fa quello che un
visitatore si aspetta?». Sei percorsi utente eseguiti con eventi reali
(Playwright): ricerca, preferiti, roulette, condivisione, back, azioni scheda.

### 15.1 Cosa reggeva già

Preferiti end-to-end (cuore → /preferiti → elemento presente, `aria-pressed`),
condivisione presente sulla scheda, «Indicazioni» con href Google Maps
corretto, «Portami in un posto a caso» (apre l'overlay Sorprendimi: è il
design, non un difetto), doppio link reel → Instagram.

### 15.2 La ricerca non conosceva il sito (CORRETTO)

Il colpo più serio del round: **«sushi» → zero risultati** con tre sushi nel
registro, e i suggerimenti proponevano Bali, Marocco e Andalusia — mete che il
sito non copre. L'indice includeva pagine statiche, percorsi, articoli
Firestore (tutti `published:false` → vuoto) e preview — **mai i 79 posti**.

- `POSTO_RESULTS`: i posti reali entrano nell'indice come costante di build
  (titolo, città/regione, tipi e HOOK come keywords — «gabbia» trova
  l'Emotional Grand Motel).
- Suggerimenti e tag popolari solo su contenuto che l'indice trova davvero.
- **Selezione da tastiera**: il modale si apriva con ⌘K ma si completava solo
  col mouse. Ora frecce (ordine visivo dei gruppi), Invio, highlight della
  riga attiva, `aria-activedescendant`, hint aggiornato.

Verificato end-to-end: «gabbia»+Invio → `/posto/novara-emotional-grand-motel`;
«sushi»+frecce×2 → Better Sushi → Invio → la sua scheda.

### 15.3 Scroll al back: indagine completa, fix parziale deliberato

Il back da una scheda NON riporta dove l'utente era nella lista (atterra a
~753px da 1500). Otto sonde strumentate hanno mappato l'intero meccanismo:

1. `scroll-behavior: smooth` globale nel CSS trasforma ogni `scrollTo` in
   animazione;
2. Lenis si inizializza **3,2s dopo il mount** e congela qualunque ease in
   corso al valore raggiunto;
3. allo swap di rotta la pagina nuova monta corta e il clamp del browser
   (1500→753) genera un evento di scroll che corrompe il salvataggio della
   posizione, con attribuzione alla pagina vecchia;
4. la navigazione passa da `startViewTransition`, che riordina render e swap.

Tre architetture di ripristino tentate e misurate: tutte pareggiano il
baseline. **Scelta deliberata: non spedire macchinari a metà.** Consegnato il
minimo provato e sicuro — azzeramento `instant` sul PUSH (sparisce il «volo»
animato verso la cima a ogni cambio pagina) e nessuna lotta sul POP in
entrambi i contendenti (`ScrollToTop`, `SmoothScrollProvider`). Il ripristino
pieno richiede una decisione di design: o la restituzione della proprietà
dello scroll a un solo sistema (togliere lo smooth CSS globale o integrare il
ripristino dentro Lenis post-init), non un cerotto. Registrato qui perché chi
riapre il tema riparta dalla mappa, non da zero.
