---
type: project
area: product
status: open
priority: p0
owner: team
repo: TRAVELLINIWITHUS
route: /
created: 2026-07-26
source: sessione brainstorming owner + misurazione browser di 6 riferimenti reali
related:
  - '[[10_Projects/PROJECT_REDESIGN_DIREZIONE_2026-07-22]]'
  - '[[10_Projects/PROJECT_FAMILY_AREA_2026-07-24]]'
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
  - '[[20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22]]'
tags:
  - project
  - home
  - audience
  - design
  - perf
---

# PROJECT — La home che si ricompone (2026-07-26)

**Stato: SPEC — in attesa di rilettura owner. Nessun codice modificato.**

## 1. Il difetto vero

La home non è brutta: è **muta**. E il motivo è verificabile, non estetico.

Il layer a 3 audience esiste (`AudienceContext`, gate al primo accesso, switch in
navbar). Ma `useAudience()` è consumato solo da `App`, `Layout`, `Navbar`,
`Footer`, `AudienceGate` e `Contatti`. **`AtlanteHome` e `CinematicHomepage` non
lo leggono mai.**

Il visitatore dichiara se è viaggiatore, famiglia o brand — e atterra sulla
stessa identica home in tutti e tre i casi. Cambiano menu, footer e contatti.
Il contenuto no.

Da qui discende tutto il resto: quattro home rifatte in due mesi erano quattro
ridisegni di _una_ home per _tre_ pubblici. Una superficie che deve parlare a
tre persone insieme non è specifica con nessuna, e senza specificità non c'è
energia. Il grigiore è una **conseguenza strutturale**, non una scelta
tipografica.

## 2. Misurazione — la home contro sei riferimenti reali

Ogni sito aperto nel browser, valori calcolati estratti con lo stesso script.

| Sito                 | Fondo     | Accento   | Titoli   | Canvas |    Img |   Altezza |
| -------------------- | --------- | --------- | -------- | -----: | -----: | --------: |
| **Travelliniwithus** | `#faf7f2` | `#c2410c` | **48px** |  **0** | **38** | **8.046** |
| Lando Norris · SOTY  | `#282c20` | `#d2ff00` | 32–38px  |     21 |    133 |    18.314 |
| Floema · SOTM giu 26 | `#f2efea` | `#e9e778` | 41–45px  |      3 |     64 |    21.886 |
| by·kin               | `#f4f2ed` | `#ff6542` | 67px     |      0 |     15 |         — |
| Monocle              | `#ffffff` | `#ffc500` | 24–32px  |      0 |    208 |     8.718 |
| The Gentlewoman      | bianco    | `#2bdbcf` | —        |      0 |     10 |         — |
| Studio Feixen        | `#f8f8f8` | mono      | 20–40px  |      0 |     58 |     9.600 |

Tre conclusioni che **ribaltano** l'ipotesi iniziale «serve più scala»:

1. **La scala non è il problema.** I titoli a 48px sono già più grandi di quasi
   tutti i riferimenti, incluso il Site of the Year (32–38px). Ingrandirli
   ancora produce «lo stesso sito col titolo più grande».
2. **La sabbia non è il problema.** `#faf7f2` è a un soffio da `#f4f2ed`,
   `#f2efea`, `#f8f8f8`. Il fondo caldo è una scelta giusta e va **tenuta**.
3. **I difetti veri sono tre e sono sistemici:** accento senza voltaggio,
   pagina più corta di tutte, movimento tiepido.

## 3. Decisioni bloccate dall'owner

| Decisione        | Scelta                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| Identità         | Logo e nome **restano**. Palette, tipografia, layout, materia e motion sono aperti. |
| Modello dinamico | **Una home che si ricompone** (non tre home, non tre porte).                        |
| Prima audience   | **Viaggiatori.**                                                                    |
| Accento          | **`#ff4d1a`** — stessa famiglia del terracotta, più voltaggio.                      |
| Movimento        | **Three.js subito**, accettando che il perf diventi la fase 1.                      |

## 4. Architettura

Un file `src/config/homeComposition.ts` mappa `Audience → lista ordinata di
sezioni`. La home diventa un renderer di quella lista.

```
Audience = 'viaggiatori' | 'family' | 'brand'
SectionKey = 'featured' | 'grid' | 'map' | 'reels' | 'method' | 'index'
           | 'atlante3d' | 'newsletter'
```

**Nessun componente nuovo per il riordino.** Cambia l'ordine e quale CTA è
primaria.

### Apertura costante

`BrandCoherentHero` è identico per tutte le audience. Non è pigrizia: protegge
le due cose fragili.

- **SEO** — Google vede una sola `/` e deve trovarci sempre la stessa promessa.
- **Perf** — l'elemento LCP resta identico a ogni visita, quindi la
  ricomposizione non può generare layout shift sopra la piega.

La ricomposizione agisce **solo sotto la piega**. Chi ha scelto family o brand
vede il proprio sommario senza salti visibili.

> Servire l'ordine giusto già dal server leggendo un cookie sarebbe più
> elegante, ma tocca `server.ts` (file ad alto rischio → `backend-engineer` +
> conferma owner). **Fuori perimetro per questa v1.**
>
> **Correzione 2026-07-26 (verificata):** è fuori perimetro per un secondo
> motivo, più definitivo. `firebase.json` ha `"public": "dist"` e due rewrite:
> `/api/**` → Cloud Function `api` (europe-west1) e `**` → `/index.html`.
> Esiste quindi un backend, **ma solo per `/api/**`**: ogni richiesta di pagina
> è servita staticamente e **non c'è SSR\*\*. Nessuna strategia server-side di
> ricomposizione è realizzabile finché l'hosting resta così.
>
> (Una versione precedente di questa nota diceva «senza rewrite verso Cloud Run
> o Functions»: impreciso — il rewrite a Functions esiste, è limitato a `/api`.)

### Composizione viaggiatori

```
hero (costante)
 1 featured    CleanFeaturedPlaces        riuso
 2 grid        (componente NUOVO)         da scrivere sull'inventario reale
 3 map         HomeMapSection             riuso (lazy)
 4 atlante3d   AtlanteExperience          già scritto, mai montato
 5 reels       HiggsfieldReelCarousel     riuso (lazy)
 6 method      CleanEditorialPromise      riuso
 7 index       HomeIndiceVivo             riuso (lazy)
 8 newsletter  CTA primaria
```

Due scelte editoriali dichiarate, entrambe reversibili:

- **il metodo scende dal 3° al 6° posto.** Chi cerca dove andare vuole i posti;
  il metodo è la prova che serve _dopo_ aver desiderato qualcosa.
- **entra una griglia densa nuova**, che attacca direttamente il difetto densità.

> **Correzione 2026-07-26 (verificata): `WowFeaturedGrid` non esiste più.**
> Insieme a `WowHomeHero` e `WowTactileJournal` è stato rimosso da
> `src/components/home/wow/` da una sessione parallela sullo stesso working
> tree, e la rimozione è **committata** (`64b0406`). Erano prototipi mai
> importati.
>
> **Impatto sulla spec: la sezione 2 passa da «riuso» a «componente nuovo».**
> Non è una perdita — il file hardcodava posti inventati con prezzi e punteggi
> finti, quindi violava comunque la regola di integrità del progetto e non era
> riusabile. Il markup delle card resta consultabile con
> `git show ca32a31:src/components/home/wow/WowFeaturedGrid.tsx`.

Family e Brand restano **schizzi non progettati**. La struttura regge tre
sommari, ma i loro contenuti si definiscono quando toccherà a loro.

## 5. Le tre correzioni di energia

### 5.1 Accento — con una legge di contrasto vincolante

Contrasti calcolati (WCAG, soglia AA testo normale = 4,5):

| Colore             | su sabbia | bianco sopra |
| ------------------ | --------: | -----------: |
| `#c2410c` (oggi)   |  **4,85** |     **5,18** |
| `#ff4d1a` (scelto) |  **3,11** |     **3,32** |

`accessibility ≥ 0.95` è una delle **due sole asserzioni bloccanti** del CI.
Sostituire l'accento senza altro produrrebbe pulsanti bianco-su-arancio a 3,32
e **romperebbe la build**.

**Legge di brand, non nota a margine: accento elettrico = testo scuro sopra.**
È esattamente ciò che fanno i riferimenti (lime di Lando con testo `#2a3200`,
citron di Floema con testo scuro). Mai bianco.

Sistema a due token, entrambi già previsti in `DESIGN.md`:

- `--color-accent: #ff4d1a` — **solo** riempimenti con testo scuro sopra,
  display grande, elementi UI non testuali (timbri, filetti, stato attivo).
  La soglia per componenti UI è 3:1 → 3,11 passa.
- `--color-accent-text: #c2410c` — testo inline, link e testo piccolo su
  chiaro. Resta a 4,85 e passa AA.

Il cambio è globale (tutte le pagine). Richiede `npm run audit:a11y` e
`npm run audit:ui` su tutte le rotte pubbliche, non solo la home.

### 5.2 Densità — senza produrre nulla di nuovo

Nel repo esistono già **62 schede contenuto** (`content-seed.json` — campi
`place`, `zone`, `types`, `cover`, `hook`, `partnership`, `isPlaceholder`) e
**34 reel** (`config/reels.ts`). La home ne mostra una frazione: 38 immagini,
8.046px.

> **Correzione 2026-07-26 (misurata, sostituisce la nota precedente).** Questo
> paragrafo affermava «nessuna coordinata» e «**zero** hanno coordinate». È
> falso: **62 su 62** hanno `place.coordinates.lat/lng`. Le coordinate sono
> **annidate dentro `place`**, non al livello superiore dell'oggetto — il check
> che ha prodotto la nota cercava `lat`/`lng` in cima e non le ha trovate.
> Conseguenza: alimentare la mappa dall'inventario reale **non è bloccato**, non
> richiede geocoding e non richiede lavoro dati.

**Il vincolo vero della densità non sono le coordinate: è la verifica.**

|                                      | conteggio | `cover`             |
| ------------------------------------ | --------: | ------------------- |
| entry reali (`isPlaceholder: false`) |    **29** | tutte valide        |
| placeholder (`isPlaceholder: true`)  |    **33** | **32 vuote** (`""`) |

- la **griglia nuova** (sezione 2) porta 12–16 posti al posto di 3 — **pescando
  dalle 29 reali**;
- `HomeIndiceVivo` diventa l'indice dei **29 verificati**, non dei 62;
- il carosello pesca più dei 34 reel disponibili.

> **Rischio che questa spec non vedeva.** Montare i 62 senza filtro pubblica 33
> schede di cui 32 senza immagine, su un sito la cui promessa è «l'abbiamo
> provato di persona» — due commit dopo `fix(integrita): bonifica claim B2B non
verificati`. Inoltre [SEO.tsx:42](../../src/components/SEO.tsx) contiene un
> commento che prevede il `noindex` per `isPlaceholder`, **mai implementato**.
> Prerequisito della fase 2: o il filtro `!isPlaceholder`, o uno stato editoriale
> dichiarato («in verifica»). Non il silenzio.

Obiettivo: **~13.000px**, tra Monocle e Lando Norris. Tutto sotto la piega e in
`lazy`: l'elemento LCP non cambia.

> **Tetto onesto.** Con 29 posti verificati e 34 reel, ~13.000px è raggiungibile
> ma è **il massimo dignitoso**: è il limite dell'inventario vero, non un
> obiettivo prudente. Superarlo richiede una delle due, entrambe fuori da questa
> spec: verificare parte dei 33 placeholder, o dichiararli «in verifica» come
> stato editoriale esplicito. **Non si allunga la pagina ripetendo le stesse 29
> schede in sezioni diverse** — sarebbe densità finta, l'esatto difetto che i
> riferimenti misurati non hanno.

### 5.3 Movimento — `atlante`

Correzione a un'assunzione iniziale: **Lenis è già montato**
(`SmoothScrollProvider` in `Layout.tsx`). Lo scroll fluido c'è; manca un gesto
riconoscibile. GSAP è installato con **zero import** (cruft, non peso: non
importato = non spedito).

Nel repo dormono tre esperienze Three.js complete — `atlante` (1.187 righe),
`controluce` (807), `sentiero` (2.122). **`controluce` è già in produzione** su
`/manifesto` (noindex, fuori da nav e sitemap): il WebGL è già collaudato
online.

**Si accende `atlante`**, per tre motivi:

- la home _è_ «Atlante Vivo» — il concetto combacia;
- `AtlanteExperience` ha già il guard corretto: `isMobile` inizializzato a
  `true` (Three non si scarica finché non è provato desktop ≥1024px), fallback
  su `prefers-reduced-motion`;
- `AtlanteFallback` e `AtlanteHud` esistono già.

Diventa il **cuore interattivo sotto la piega**.

## 6. Verità sul gate CI

Da `lighthouserc.json`, `preset: "desktop"`:

| Asserzione                 | Soglia | Esito     |
| -------------------------- | ------ | --------- |
| `categories:accessibility` | ≥ 0.95 | **error** |
| `cumulative-layout-shift`  | ≤ 0.1  | **error** |
| `largest-contentful-paint` | 2500ms | warn      |
| `total-blocking-time`      | 200ms  | warn      |
| `categories:performance`   | ≥ 0.85 | warn      |

LCP e TBT **non bloccano il merge**. I numeri di BLOCK del 22 luglio
(LCP 3,05–3,48s) erano misure **mobile**, diverse da ciò che il gate controlla.

Ne discendono i due soli rischi bloccanti reali:

1. **CLS del canvas.** `AtlanteExperience` è `h-screen`. Senza altezza riservata
   prima del mount → layout shift → CLS > 0.1 → **merge bloccato**. Vincolo:
   il contenitore riserva `100vh` esatti da SSR, il canvas monta dentro uno slot
   già dimensionato.
2. **Contrasto dell'accento** (§5.1).

Nota: `twu_audit` commuta solo il recupero contenuti da Firebase a statico per
audit deterministici. Non spegne nulla di visivo — resta legittimo.

## 7. Fasi

| Fase | Cosa                                                                 | Definition of done                   |
| ---- | -------------------------------------------------------------------- | ------------------------------------ |
| 1    | **Perf** — sbloccare LCP/TBT mobile (dovuto comunque, pre-esistente) | LCP mobile ≤ 2,5s simulato 4G/CPU 4x |

> **Causa radice della fase 1, individuata il 2026-07-26.** Non è un problema
> diffuso: è una regressione su due componenti.
> [BrandCoherentHero.tsx:143](../../src/components/home/cinematic/BrandCoherentHero.tsx)
> serve l'elemento LCP come `<img>` nudo su `hero-impossible.png`
> (**1.016 KB**), senza `srcset`, `<picture>` né `fetchpriority`, mentre
> `hero-impossible.avif` (**195 KB**) e la scala `-320/-480/-768` sono già in
> repo. In più il `<head>` contiene un `<link rel="preload" as="image"
type="image/avif" imagesrcset="…">` per quella scala: l'AVIF **viene scaricato
> e mai usato**, perché nessun elemento lo referenzia (rete osservata: PNG ×3,
> AVIF ×2). `OptimizedImage` risolve già tutto questo ed è usato correttamente da
> 26 file — con un test, `OptimizedImage.baseWidth.test.tsx`, che asserisce lo
> srcset giusto **proprio per questa immagine**. I soli due componenti che lo
> bypassano sono `BrandCoherentHero` e `DiarioHeroCinematic`.
> | 2 | **Accento + densità** — due token, griglia nuova, indice dei 29 verificati, filtro `!isPlaceholder` | contrasto AA su tutte le rotte; ~13.000px; LCP invariato; zero placeholder pubblicati |
> | 3 | **`homeComposition.ts`** — renderer + composizione viaggiatori | `/` invariata a prima pittura; nessun CLS sopra la piega |
> | 4 | **`atlante` WebGL** — cuore interattivo sotto la piega | CLS ≤ 0.1; fallback mobile e reduced-motion verificati |

Ogni fase: un branch, commit piccoli, `typecheck` + `build` + `audit:ui` +
`audit:visual`. Gate finale `/predeploy` (S6 completo).

## 8. Fuori perimetro

- `server.ts`, `firestore.rules`, `src/config/admin.ts` — nessuna modifica.
- Composizioni Family e Brand — schizzate, non progettate.
- `controluce` e `sentiero` — restano dormienti; `/manifesto` invariata.
- Nessuna immagine generata di persone o luoghi (regola imagery invariata).
- Nessun commit, push o deploy senza richiesta esplicita dell'owner.

## 9. Rollback

Ogni fase è un branch indipendente. La fase 3 introduce un renderer che, con
una sola composizione, produce esattamente l'ordine attuale → rollback = tornare
alla lista precedente in `homeComposition.ts`. La fase 4 è dietro il guard
`isMobile`/`prefers-reduced-motion` già esistente → rollback = non montare la
sezione `atlante3d` nella lista.

## 10. Approvazioni richieste

- [ ] rilettura e ok alla spec;
- [ ] ok alla legge «accento elettrico = testo scuro» (cambia l'aspetto dei
      pulsanti su tutto il sito: da bianco-su-arancio a scuro-su-arancio);
- [ ] ok a far scendere «il metodo» al 6° posto nella home viaggiatori;
- [ ] conferma che la fase 1 (perf) precede tutto, come conseguenza della
      scelta «Three.js subito».

## 11. Stato implementazione — sezione 2 (griglia), 2026-07-29

**Fatto.** `src/components/home/curated/CleanFeaturedGrid.tsx` è montato in
`CinematicHomepage.tsx` (`#griglia-posti`, tra `featured-places` e
`mappa-interattiva-reale`), con selezione in `src/lib/homeGridSelection.ts`:

- 9 slot, 3×3 desktop → 2 colonne tablet → 1 colonna mobile;
- selezione per **regola**, non ID hardcodati: filtra `!isPlaceholder` +
  `cover` presente, un vincitore per ciascuna categoria di `TYPES` con
  candidati (oggi 6 delle 8), poi riempimento con i più recenti — così la
  griglia si auto-aggiorna quando i 33 placeholder diventano reali, senza
  toccare codice;
- esclude i 3 `CURATED_IDS` già mostrati sopra da `CleanFeaturedPlaces`, per
  non ripetere lo stesso posto due volte in home;
- tile "in evidenza" (badge + bordo accento + titolo maggiore) compare **solo**
  se un item ha `featured: true` esplicito nel seed — oggi nessuna delle 29
  entry verificate lo è, quindi tutte e 9 le card sono equivalenti. Il campo
  esisteva già nel tipo `ContentItem` (usato anche da `getRegistroItems`); non
  è stato impostato su nessuna entry — resta scelta editoriale di Rodrigo &
  Betta;
- copertura test in `src/lib/homeGridSelection.test.ts`: determinismo, zero
  duplicati, esclusione, tiebreak `featured`, `featuredId` nullo in assenza di
  featured, comportamento sul pool reale.
- Verificato in browser reale (Playwright) a 375/768/1440: colonne corrette,
  9/9 cover caricate, card uniformi, nessuno stacco con le sezioni sopra/sotto.

> **Debito architetturale emerso, non chiuso in questa sessione.** In home
> convivono due sistemi di selezione contenuti che si ignorano a vicenda:
> `CleanFeaturedPlaces` sceglie 3 posti per `CURATED_IDS` hardcodati
> (editoriale, manuale), `homeGridSelection` ne sceglie 9 per regola
> (categoria + recency, automatico). Oggi il secondo esclude esplicitamente
> gli ID del primo per evitare doppioni, ma è un cerotto: se in futuro
> `CleanFeaturedPlaces` cambia i suoi ID, o se una terza sezione home avrà
> bisogno di una propria selezione, la stessa toppa va ripetuta altrove e il
> rischio di doppioni torna. La soluzione pulita a tendere è **un'unica fonte
> di selezione condivisa** (una funzione/hook che tutte le sezioni home
> consultano, con un pool di "già usati" passato esplicitamente, non
> ricostruito sezione per sezione) — non implementata qui perché fuori dal
> perimetro concordato per questa sessione. Vedi anche il punto 3,
> `homeComposition.ts`, non ancora scritto: è probabilmente il posto giusto
> dove far vivere questa fonte unica quando si arriverà a quella fase.

## 12. Esperienza dinamica per interessi — implementazione locale, 2026-08-02

L'audience non decide più solo tema e navigazione. Ogni pubblico può scegliere
un interesse, modificabile dal pannello **Cosa cerchi oggi?** presente nei
suoi hub e raggiungibile dalla navbar. La scelta viene ricordata localmente
solo con il consenso **Personalizzazione**; senza, resta valida per la sola
sessione e l'interfaccia lo dichiara esplicitamente.

- Viaggiatori: weekend in coppia, fuori rotta, mangiare e dormire bene;
- Family: gravidanza, partire col pancione, essenziali pratici;
- Brand: capire il fit, vedere i format, richiedere il media kit.

La scelta riordina i moduli della home, le selezioni delle card, Family,
Esplora e la mappa. URL e filtri espliciti dell'utente restano prioritari; le
schede editoriali e i metadata restano canonici e non vengono riscritti.

Il comportamento è un affinamento opzionale: filtri per tipo e letture
alimentano segnali solo dopo consenso **Personalizzazione**. Alla prima
autorizzazione o alla revoca, gli eventuali dati locali precedenti vengono
rimossi: non possono essere riutilizzati profili creati senza opt-in e la
revoca svuota interesse, segnali e cronologia di lettura. Il controllo
"Azzera preferenze" rimuove interesse e segnali locali. Non vengono creati
account, cookie di marketing, API o varianti SEO.

La selezione continua a escludere `isPlaceholder`; nessuna scelta può
riempire la home con contenuto non verificato. Per Family, dove alcuni filoni
hanno una sola risorsa reale, il ranking può portarla in testa ma non inventa
card aggiuntive.

**Correzione 2026-08-03.** `HomeFamilyPicks` ora applica realmente quel
ranking ai consigli mostrati nella home: prima l'interesse Family cambiava
l'ordine dei moduli, ma non le tre card. Il test dedicato verifica che una
scelta come «Essenziali pratici» porti davanti il consiglio corrispondente.

Nella stessa correzione, un interesse Brand rende specifica la CTA della fascia
audience: «Capire il fit» porta al fit partner, «Vedere i format» ai format e
«Richiedere il media kit» al media kit. L'ordine dei moduli resta coerente con
lo stesso bisogno; un interesse di un pubblico diverso viene ignorato.

Dal 2026-08-02 la composizione **Viaggiatori** ha una sola collezione di
posti: la griglia sostituisce la sequenza `featured` + griglia, che ripeteva
lo stesso gesto poco più sotto. I tre posti che avrebbero occupato la sezione
rimossa entrano con priorità nella griglia, anche nelle varianti per interesse,
così la riduzione non nasconde contenuto. Le intestazioni rimanenti distinguono
la funzione di ogni passaggio: selezione iniziale, mappa, prove video e
archivio completo.

Il teaser MapLibre della home, e la mappa completa che usa lo stesso stile
OpenFreeMap, gestiscono inoltre il riferimento remoto mancante `circle-11`
con un fallback trasparente locale. Restano visibili le etichette delle citta,
senza errori in console o modifiche a marker, dati e interazioni.

## 13. UX e accessibilita: overlay e discovery — implementazione locale, 2026-08-02

Le interfacce temporanee ora mantengono la navigazione da tastiera nel loro
perimetro e restituiscono il focus al controllo di origine quando si chiudono:
ricerca, anteprima rapida, popup di uscita e menu mobile. Il menu mobile
espone semantica di dialogo solo mentre e aperto.

Un unico stack decide quale overlay e in primo piano e mantiene il blocco dello
scroll finché l'ultimo non si chiude. Il popup di uscita rispetta inoltre ogni
dialogo preesistente, incluso il consenso cookie, così non vengono mai proposte
due richieste concorrenti alla stessa persona.

Quando non e possibile aggiornare i dati remoti, Ricerca conserva un archivio
minimo utile per navigare il sito e mostra un messaggio con **Riprova**;
Esplora mantiene i contenuti disponibili, comunica l'errore e permette un
nuovo caricamento. Gli skeleton di Esplora sono ora annunciati ai lettori di
schermo come stato di caricamento.

Verifica locale: focus desktop e mobile, chiusure concorrenti, blocco exit
intent, test unitari di stack e ricerca (32 file, 162 test), typecheck e lint
mirato: PASS. Nessun commit, push o deploy eseguito.
