---
title: DESIGN_navbar-premium
status: archived
created: 2026-08-17
owner: travellini-ui-designer
slug: navbar-premium
type: design-reference
area: delivery
head: b0d4d34
next: travellini-frontend-builder
related:
  - '[[50_Scratch/DESIGN_commutatore-pubblico]]'
  - '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
---

# La testata — direzione esecutiva

Redesign chiesto esplicitamente dall'owner. La regola «conserva il linguaggio
visivo» è sospesa **per la barra e solo per la barra**: hero, home, schede,
footer e palette non si toccano.

## 0. Cosa ho misurato e cosa no — leggere prima di tutto

**Questa sessione non ha browser né shell** (strumenti: Read / Grep / Glob /
Write). Non ho aperto `localhost:3000`. È la stessa condizione in cui la
direzione precedente ha consegnato aritmetica spacciata per misura — quindi qui
il metodo cambia.

| Tag                      | Significato                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `[MISURATO: file:riga]`  | letto nel codice, riproducibile aprendo quella riga                                                  |
| `[DEDOTTO — modello]`    | previsione del modello geometrico di §0.1, **che è calibrato su tre misure browser vere dell'owner** |
| `[DEDOTTO]`              | inferenza semplice; porta sempre `Si smentisce se:`                                                  |
| `[VERIFY: ...]`          | serve una sonda in browser prima di trattarlo come fatto                                             |

### 0.1 Il modello geometrico, e perché stavolta ci si può fidare

Ricostruito dalle classi e **verificato contro tre numeri misurati in browser
che non ho prodotto io** (tabella dell'owner + `PROJECT_HOME_RICOMPOSIZIONE`
§15):

```
altezza pillola = contenuto + padding verticale + 2 (bordo)
navBottom       = altezza pillola + offset del wrapper
```

`[MISURATO: Navbar.tsx:295 px-3 pt-3 md:px-6 md:pt-4]` · `[MISURATO: Navbar.tsx:298 py-2 md:py-2.5]`

| Caso                    | Modello                    | Misura reale             | Scarto |
| ----------------------- | -------------------------- | ------------------------ | -----: |
| desktop 1024, viaggiatori | 36 + 20 + 2 = 58 → +16 = **74** | 74 (owner) · 58 (§15)   | **0** |
| desktop 1024, family      | 42 + 20 + 2 = 64 → +16 = **80** | 80 (owner)              | **0** |
| mobile 375                | 44 + 16 + 2 = **62** → +12 = 74 | 62 (§15) · 74 (owner)   | **0** |

Tre centri su tre. Le previsioni di §4 restano `[DEDOTTO — modello]`, non fatti:
**il builder sonda prima di costruire** (§9). Ma non sono aritmetica a caso.

---

## 1. Il difetto strutturale: la geometria dipende dall'edizione

Il numero dell'owner — 74 / 80 / 74px a 1024 — ha una causa sola e sta nel
codice.

`whitespace-nowrap` esiste su **due** elementi: il lockup del marchio
`[MISURATO: Navbar.tsx:308]` e le voci dell'edizione viaggiatori
`[MISURATO: Navbar.tsx:343]`. **Non esiste** sulle voci family
`[MISURATO: Navbar.tsx:492, 503, 514, 525]` né su quelle brand
`[MISURATO: Navbar.tsx:546, 557, 568]`.

A 1024 (`lg`, non `xl`) le voci girano a `text-[10px]` con
`tracking-[0.14em]`. Family ne ha quattro, e le sue etichette sono le più lunghe
del sito: `Travellini Family` (17 caratteri), `Codici e sconti` (15)
`[MISURATO: siteContent.ts:477-479]`. Brand ne ha tre, più corte, e non va a capo.

**Una voce family va a capo su due righe → contenuto 42 invece di 36 → barra 80
invece di 74.** `[DEDOTTO — modello. Si smentisce se: la sonda a 1024 mostra
contenuto 42 con tutte le voci su una riga sola, nel qual caso i 6px vengono da
un'altra fonte — candidato successivo: il line-box del badge `SurfaceBadge`
(`text-[9px]` + `py-0.5` + bordo) dentro una voce.]`

Non è un bug di padding: è che **oggi l'altezza della barra la decide chiunque
sia più alto**, e chi è più alto cambia con l'edizione. È esattamente la cosa che
la §2 rende impossibile.

---

## 2. La regola di composizione — 5 slot, geometria congelata

Una barra sola. L'edizione cambia **il contenuto** degli slot, **mai** la loro
geometria.

### Riga 1 — la testata

| Slot           | Cosa ammette                                                                                                | Se l'edizione non ha niente                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **A · Marchio**  | **solo** il lockup. Più il pallino accent 6px `aria-hidden`. Nient'altro si attacca mai.                     | impossibile                                                                                                          |
| **B · Voci**     | **3 o 4** voci. Una riga, `whitespace-nowrap`, ≤16 caratteri, nessuna icona. **Al massimo UNA** porta un pannello. | **non si accorcia la barra.** Meno di 3 = il lavoro si ferma e si decide la terza voce. Uno slot vuoto che ridistribuisce spazio è di nuovo geometria che cambia con l'edizione. |
| **C · Ricerca**  | icona sola, identica nelle tre edizioni                                                                     | impossibile                                                                                                          |
| **D · Azione**   | **esattamente 1** CTA                                                                                       | default dichiarato: «Scrivici» → `/contatti`. Mai un buco, mai un link di riempimento.                               |

### Riga 2 — la riga dell'edizione

| Slot           | Cosa ammette                                                                                     | Se l'edizione non ha niente |
| -------------- | -------------------------------------------------------------------------------------------------- | --------------------------- |
| **E · Edizione** | **sempre 3 segmenti**, stessi nomi, stesso ordine (Viaggiatori · Family · Brand), in tutte e tre le edizioni. | non si dà: è l'unico elemento della barra identico ovunque — ed è ciò che lo rende un commutatore e non una navigazione. |

### I tre invarianti che fanno la differenza

1. **L'altezza della riga 1 la decide lo slot A e nessun altro.** Altezza fissa
   sul contenitore di riga, non risultante dal contenuto. B, C, D sono tappati
   sotto. Oggi vale il contrario, ed è §1.
2. **Nessuno slot va mai a capo.** `whitespace-nowrap` su tutte e tre le
   edizioni, non su una. E poiché nowrap da solo sposta il difetto da verticale a
   orizzontale, arriva con un budget: **≤16 caratteri per voce, ≤48 in totale**.
   Oggi: viaggiatori 34 ✓ · brand 31 ✓ · **family 49 ✗** — l'unica fuori budget è
   l'unica che sballa in altezza. `[MISURATO: siteContent.ts:477-495]`
3. **Il pannello non contribuisce mai all'altezza**: è un overlay, non un
   contenuto in riga.

### Conseguenza sul copy, una sola

`Travellini Family` → **`Family`** nella voce di nav. Il nome esteso è già
dichiarato dalla riga dell'edizione otto pixel più sotto: ripeterlo nella nav è
la ragione per cui l'edizione va fuori budget. Family passa da 49 a 38
caratteri. Nessun'altra etichetta cambia.

---

## 3. «Ultra premium» per questo marchio — una scelta forte, il resto zitto

Astratto no: qui significa **una cosa sola, e le altre nove che smettono di
parlare.**

### La scelta forte: la barra smette di galleggiare e diventa una testata

Oggi la barra è una pillola `rounded-full` flottante, `backdrop-blur-2xl`,
`bg-sand/85`, doppia ombra, `transition-all duration-500`, ingresso animato
`y:-100`, CTA con `hover:scale-[1.02]`
`[MISURATO: Navbar.tsx:291-302, 604, 612, 620]`.

Quel vocabolario — pillola traslucida sospesa, vetro, scala all'hover — è
letteralmente l'elenco che `DESIGN.md` mette sotto «Avoid» e che `CLAUDE.md`
chiama SaaS. **È il difetto che l'owner ha sentito e non ha nominato.** Non è
brutto: è di un altro mestiere.

**Direzione: fondo sabbia pieno, a filo del bordo superiore, chiuso da un
filetto da 1px `--color-border`. Niente blur, niente ombra, niente pillola,
niente animazione d'ingresso, niente scala all'hover.**

Perché è questa e non un'altra:

- **È la mossa che rende possibile la seconda riga.** Due pillole flottanti
  impilate sono una toolbar da applicazione. Una testata chiusa da un filetto,
  con la riga dell'edizione dentro lo stesso rettangolo, è una testata di
  giornale con la sua riga di edizione. La direzione precedente aveva già scelto
  la metafora giusta («tre edizioni della stessa testata») e non poteva
  eseguirla: la pillola non aveva dove metterla.
- **Toglie un problema di contrasto che nessun cancello vede.** `bg-sand/85` su
  un elemento fisso significa che il contrasto della barra è funzione di ciò che
  ci scorre sotto. Lighthouse legge gli stili calcolati, non i pixel compositati:
  su un sito di fotografia questa è una falla di a11y reale e silenziosa.
  `[DEDOTTO. Si smentisce se: nessuna rotta fa scorrere fotografia sotto la barra —
  falso almeno su `/mappa` e sulle schede posto.]`
- **Toglie `backdrop-blur-2xl` da un elemento fisso a schermo intero**, che è
  lavoro GPU per frame accanto all'elemento LCP.
  `[DEDOTTO. Si smentisce se: il profilo mostra il blur sotto 1ms/frame — allora
  resta comunque fuori per ragioni di brand, non di perf.]`

**Rischio da guardare, non da ignorare**: sulla home il blur non serve — l'eroe
ha già fondo sabbia e `pt-24` `[MISURATO: BrandCoherentHero.tsx:87]`, quindi la
barra non galleggia su nessuna foto. Su `/mappa`, che è scura e a tutto schermo,
una testata sabbia opaca diventa una fascia visibile.
`[VERIFY: aprire /mappa a 375 e 1440 e decidere se la testata opaca è la cornice
giusta della mappa (probabile) o va resa `--color-ink-deep` su quella rotta.]`

### Le nove che devono stare zitte

Due registri, dichiarati, niente terzo:

- **Serif = orientamento.** Marchio, voci di nav, nomi delle edizioni. Fraunces,
  caso normale, nessun tracking.
- **Sans maiuscolo = azione.** Solo la CTA e la ricerca. Inter, `tracking-[0.12em]`.

Tutto il resto non esiste: niente icone accanto alle voci di nav (oggi family e
brand ne hanno una per voce, viaggiatori no — è già un'incoerenza
`[MISURATO: Navbar.tsx:498, 509, 520, 531 contro :343]`), niente pillole di
sfondo sulle voci, niente ombre, un solo stato attivo.

**Stato attivo, uno solo per tutte e tre le edizioni**: filetto accent 1px,
6px sotto la linea di base. Oggi viaggiatori usa `border-b-2` + colore
`[MISURATO: Navbar.tsx:345]`, family e brand usano un fondo `accent/10` + colore
`[MISURATO: Navbar.tsx:494, 548]`. Due grammatiche per la stessa informazione.

### La tipografia — il difetto che il budget di spazio ha prodotto

`[MISURATO: Navbar.tsx:343]` le voci sono **`text-[9.5px]`** fra 1024 e 1279.
La CTA idem `[MISURATO: Navbar.tsx:604, 612, 620]`. Il `kbd` è `text-[9px]`
`[MISURATO: Navbar.tsx:595]`. **Fra 1024 e 1279 l'intera barra desktop vive fra
9 e 10px.** Non è una scelta tipografica: è il sintomo della carestia di spazio.

Direzione: **voci in Fraunces 14px, caso normale, `--color-ink`, a ogni
larghezza ≥1024.** Un solo valore, nessun gradino `lg`/`xl`. Il gradino esisteva
solo perché lo spazio non bastava, e lo spazio adesso c'è.

Stessa logica sul marchio: oggi tre misure (`text-base` / `md:text-lg` /
`xl:text-[1.35rem]`) `[MISURATO: Navbar.tsx:308]`. Una testata non cresce in tre
scatti: **20px sotto `md`, 24px da `md` in su.**

---

## 4. La fascia dell'edizione — forma, altezza, comportamento, costo

### Forma

Dentro la stessa testata, sotto la riga 1, **sopra** il filetto di chiusura —
così le due righe sono un oggetto solo, non due barre.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Travellini·with·us  ●          Mete   Guide e racconti   Mappa   Chi siamo        ⌕   La guida in regalo  │
│  EDIZIONE   ▸ Viaggiatori ·  Family  ·  Brand        Posti particolari provati di persona: atlante,…       │
└──────────────────────────────────────────────────────────────────────────┘  ← filetto 1px
```

- **≥1024**: eyebrow `EDIZIONE` 10px maiuscolo `tracking-[0.28em]`
  `--color-accent-text` — stessa ricetta dell'eyebrow già spedito nel popover
  `[MISURATO: AudienceEditionChip.tsx:86-88]`. Poi i tre nomi in Fraunces 13px.
  L'attivo: `--color-ink` + pallino accent 6px davanti. I due spenti:
  `--color-muted-fg-2`, nessun fondo, nessun bordo, nessuna pillola.
- **≥1280 soltanto**: a destra, la descrizione dell'edizione attiva in Fraunces
  13px `--color-muted-fg`, presa **verbatim** da
  `AUDIENCE_EDITIONS[].description` `[MISURATO: audienceEditions.ts:29, 36, 43]`.
  Nessun copy nuovo, nessuna invenzione. Riempie la metà destra che a 1440
  sarebbe vuota, e la riempie con informazione. Sotto 1280 sparisce.
  `[VERIFY: la descrizione viaggiatori è di 76 caratteri; a 13px serif la stimo
  ~517px ±25%. A 1280 c'è spazio; a 1024 potrebbe non essercene — per questo il
  taglio è a 1280 e non a 1024.]`
- **<768**: la ricetta è **quella già spedita e già provata a 320 nel drawer**
  `[MISURATO: Navbar.tsx:708-750]`: tre segmenti `flex-1`, icona 12px + etichetta
  10px maiuscolo, attivo su fondo bianco. Non invento un layout mobile nuovo:
  copio quello che i cancelli hanno già validato.

**Niente pillola segmentata su desktop.** Il segmented è grammatica da
impostazioni; qui i tre nomi stanno su una riga come i sommari di una testata, e
la selezione è tipografica (peso + pallino), non un contenitore.

### Altezza e costo — i numeri

`[DEDOTTO — modello §0.1]`

| | oggi | proposto a riposo | proposto dopo lo scroll |
| --- | ---: | ---: | ---: |
| riga 1 | 62 (mobile) / 58–69 (desktop) | **56** | **56** |
| fascia | — | **44** mobile / **40** desktop | **0** |
| filetto | — | 1 | 1 |
| **testata totale** | 74 mobile / 74–85 desktop | **101** / **97** | **57** |

**Comportamento: la fascia scorre via.** Collassa al primo scroll, riappare solo
in cima. Il flag esiste già: `isScrolled` a `window.scrollY > 20`
`[MISURATO: Navbar.tsx:105]` — con isteresi (chiude >24, riapre <8) perché Lenis
è montato e uno scroll con inerzia attorno alla soglia sfarfalla.
`[VERIFY: sfarfallio alla soglia con SmoothScrollProvider attivo.]`

Non riappare allo scroll all'insù. Quella è la barra che ti insegue: fidgety, e
non è questo marchio.

**Perché scorre via e non resta**: è un'impostazione, si consulta una volta; non
è un aiuto alla navigazione che serve di continuo. Una riga di impostazioni
permanente in cima a ogni schermata è il pattern SaaS che stiamo togliendo dieci
righe più su. E lo stato non si perde comunque — vedi §6.

**Il costo, dichiarato in px.** La testata è `fixed`, quindi le pagine ne
riservano lo spazio col padding. La riserva oggi è 96px
`[MISURATO: PageLayout.tsx:10 pt-24]`, contro una barra alta 74 → 22px di aria.
Con la testata a riposo a 101px la riserva deve salire a 128 (`pt-32`):

> **Costo: +32px sopra la piega, mobile e desktop, su ogni rotta.**
> A 375×812 sono il **3,9% della prima schermata**. Sulla home (12.897px a 375
> `[MISURATO: PROJECT_HOME_RICOMPOSIZIONE §14]`) sono lo **0,25% della lunghezza**.

Tre file, enumerati, nient'altro: `PageLayout.tsx:10` ·
`BrandCoherentHero.tsx:87` · `VieniConNoi.tsx:167`.
`[VERIFY: /mappa e /esplora gestiscono la riserva per conto proprio — Esplora.tsx:487
commenta di appoggiarsi a PageLayout, la mappa va guardata.]`

### Perché quei 32px valgono

Tre argomenti, in ordine di forza:

1. **Non sono 32px di costo netto: sono 32px una volta, contro 17px risparmiati
   sempre.** Dopo lo scroll la testata occlude **57px contro i 74 di oggi**. Su
   una pagina da 12.897px si legge sotto una barra più bassa del 23% per tutta la
   lettura. La riserva si paga in cima; l'occlusione si paga a ogni schermata.
2. **Compra il controllo che oggi non esiste dove serve.** Il commutatore è
   invisibile sotto 1024 se non si apre un drawer, e sopra 1024 è un chip che va
   cliccato. Cambia dodici componenti, il tema CSS, la nav e la CTA. È la
   capacità più costosa del sito, consegnata a chi la cerca.
3. **Compra i 9,5px.** I 66px liberati dallo spostamento sono esattamente ciò che
   permette alle voci di stare a 14px invece che a 9,5.

E un argomento che **non** userei, perché sarebbe falso: che la fascia non costi
niente perché collassa. Il padding è statico: i 32px stanno nel documento anche
quando la fascia non si vede.

### Densità — il prima e il dopo

Controlli a riposo (marchio, voci, ricerca, CTA, + 3 segmenti della fascia):

| Edizione | oggi a 1440 | proposto | pannello, solo su intenzione |
| --- | ---: | ---: | ---: |
| viaggiatori | **16** | **10** | +4 |
| family | 8 | **10** | — |
| brand | 7 | **9** | — |

`[MISURATO: conteggio sul codice — viaggiatori 1 marchio + 1 chip + 4 voci + 3
primaryLinks + 1 feature + 4 subLinks + ricerca + CTA = 16 (Navbar.tsx:306-625);
family 8 (:490-533); brand 7 (:544-576). Riproduce esattamente i tre numeri
misurati dall'owner in browser.]`

**Lo scarto passa da 9 a 1.**

---

## 5. I due pannelli di «viaggiatori» — la decisione strutturale

**Uno solo resta un pannello. «Mete» lo tiene. «Guide e racconti» lo perde e
diventa un link semplice a `/esplora`.**

Tre ragioni, tutte nel codice, nessuna estetica:

1. **Tre link su quattro puntano alla stessa pagina.**
   `/esplora?format=guida`, `/itinerari`, `/esplora?format=storia`, `/esplora`
   `[MISURATO: Navbar.tsx:179-187]`.
2. **Due su quattro duplicano un controllo che la pagina di destinazione ha già.**
   `/esplora` espone il filtro formato come chip in pagina
   `[MISURATO: Esplora.tsx:718-719 activeValue={filters.format}]`. Un menu che
   preapplica un filtro che la pagina già offre non è navigazione: è una
   scorciatoia travestita da struttura.
3. **`/itinerari` è `preview`**, con `missing: 'itinerari reali al posto dei due
   demo'` `[MISURATO: surfaces.ts:53]`. Porta già il badge «anteprima» dentro la
   nav `[MISURATO: Navbar.tsx:350, 465]`. Una superficie che il repo stesso
   dichiara non pronta non giustifica un pannello sulla navigazione primaria.

**«Mete» tiene il pannello** perché lì una tassonomia vera esiste — Italia /
Europa / tutte le zone, fino alla regione `[MISURATO: Navbar.tsx:149-164]` — e
perché la sua targa editoriale è già stata bonificata dalle foto stock
`[MISURATO: Navbar.tsx:166-176]`.

**La regola generale, che è la parte riusabile**: un pannello si giustifica solo
se apre una **tassonomia** (rami che non esistono altrove come pagina). Un
pannello che apre **filtri** va nella pagina, non nella barra. Family e brand non
hanno tassonomie e quindi non avranno mai pannelli — e adesso questo è un
principio, non un caso.

`/itinerari` resta raggiungibile da `/esplora` (`Esplora.tsx:432-435` ha già il
rimando quando `format=Itinerario`) e dal footer. Non perde accesso: perde un
posto in prima fila che non si era guadagnato.

---

## 6. Cosa fa il marchio, adesso che è libero

Oggi il chip gli è attaccato `[MISURATO: Navbar.tsx:320]`. Con lo switch in
fascia, lo slot A torna a essere solo il marchio. Il contratto dello slot A è
**che nient'altro ci si attacchi mai** — è la regola che impedisce fra sei mesi
di riappendergli il prossimo controllo.

Una sola eccezione, ed è già scritta e spedita: **il pallino accent da 6px**,
`aria-hidden`, con `sr-only` accanto
`[MISURATO: AudienceEditionChip.tsx:45-48]`. Oggi vive solo sotto `md`; diventa
**permanente a ogni larghezza**.

È il pezzo che tiene in piedi «la fascia può scorrere via»: siccome
`--color-accent` è ridefinito per audience — terracotta, rosa, oro antico
`[MISURATO: index.css:41, 181, 209]` — **quel pallino è letteralmente il colore
che il sito è appena diventato**, stampato accanto al marchio. Costa ~10px.

La dichiarazione di stato, in ordine di forza decrescente:

1. il tema (già attivo, invariato) — il sito è di un altro colore;
2. il pallino accanto al marchio — permanente, anche a fascia chiusa;
3. i tre nomi in fascia — finché la fascia è aperta;
4. le voci di nav che cambiano (già attivo, invariato).

Il chip con popover (`AudienceEditionChip`, ramo `≥lg`) **si ritira**: la fascia
fa lo stesso lavoro con un layer in meno e senza un click. Restano vivi i due
rami `<lg` (pallino e pallino+parola), che diventano il punto 2.

---

## 7. Findings

```
[blocker] src/components/Navbar.tsx:343 · 492,503,514,525 · 546,557,568
Problem: alla stessa larghezza la barra cambia altezza con l'edizione — 74/80/74px a 1024 — perché `whitespace-nowrap` c'è sulle voci viaggiatori e manca su quelle family e brand, e una voce family va a capo. [DEDOTTO — modello §0.1, calibrato su tre misure browser. Si smentisce se: la sonda a 1024 mostra contenuto 42px senza alcun a-capo.]
Why it matters: è la prova che oggi l'altezza della testata la decide chiunque sia più alto, e chi è più alto dipende dal pubblico. Nessuna quantità di rifinitura rende «coerente» una barra la cui geometria è un effetto collaterale del contenuto.
Direction: §2 — altezza fissa sulla riga 1 decisa dallo slot A; `whitespace-nowrap` su tutte e tre le edizioni; budget di 16 caratteri per voce; `Travellini Family` → `Family`.

[serious] src/components/Navbar.tsx:291-302, 604, 612, 620
Problem: pillola flottante `rounded-full` + `backdrop-blur-2xl` + doppia ombra + `transition-all duration-500` + ingresso `y:-100` + `hover:scale-[1.02]` sulla CTA. [MISURATO]
Why it matters: è punto per punto l'elenco «Avoid» di DESIGN.md. Il marchio è editoriale e fotografico; la barra è di un'app. È il difetto che l'owner ha sentito senza nominarlo.
Direction: §3 — testata piena a filo, sabbia opaca, chiusa da un filetto 1px. Una scelta forte, e tutto il resto muto: due registri (serif orientamento / sans maiuscolo azione), un solo stato attivo, zero icone sulle voci.

[serious] src/components/Navbar.tsx:343, 595, 604, 612, 620
Problem: fra 1024 e 1279 l'intera barra desktop vive fra 9 e 10px — voci `text-[9.5px]`, CTA `text-[9.5px]`, kbd `text-[9px]`. [MISURATO]
Why it matters: 9,5px maiuscolo tracciato non è una scelta tipografica, è una carestia di spazio resa visibile. Su un sito che vende cura editoriale è la riga che la smentisce.
Direction: §3 — voci Fraunces 14px caso normale, valore unico a ogni larghezza ≥1024; marchio 20/24px in due gradini, non tre; via il `kbd` dalla barra (la scorciatoia continua a funzionare, Navbar.tsx:123-133).

[serious] src/components/Navbar.tsx:610-616 + src/config/surfaces.ts:47-51
Problem: la CTA primaria dell'edizione family punta a `/family/shop`, che il registro delle superfici dichiara `preview`, `missing: 'codici sconto family reali e attivi (≥3 deal)'`. E la nav family desktop non monta `SurfaceBadge`, mentre il drawer sì (Navbar.tsx:783): il desktop nasconde uno stato che il mobile mostra. [MISURATO]
Why it matters: l'azione più prominente di un'intera edizione promette sconti che il repo stesso dichiara inesistenti, su un sito che ha già fatto un commit di bonifica dei claim non verificati. È integrità, non estetica.
Direction: o lo slot D di family cambia destinazione finché i codici non esistono (default dichiarato: `/family/consigli`, che è `live`), o `SurfaceBadge` compare anche sulla nav desktop. Non entrambe le cose tacciono. Decisione dell'owner, §8.

[serious] src/context/AudienceContext.tsx:91-94, 156-157 + AudienceEditionChip.tsx:26
Problem: `audience = rotta ?? scelta utente ?? viaggiatori`, e il chip legge solo `audience`. Su `/collaborazioni` e `/media-kit` la fascia mostrerà «Brand» selezionato anche a chi ha scelto Viaggiatori. [MISURATO]
Why it matters: oggi la bugia è sepolta in un popover che quasi nessuno apre. Una fascia a tre segmenti larga tutta la pagina la rende un falso stato visibile su due rotte. §6a della direzione precedente specificava la correzione e non è stata implementata.
Direction: quando `audienceFromPath(pathname) !== null && userAudience !== audience`, il segmento attivo si marca come temporaneo — un solo cambio: il pallino diventa un anello vuoto invece che pieno — e la fascia aggiunge a destra «La tua edizione resta Viaggiatori», con il nome che è un link a `/`. `AudienceContext` espone già `userAudience` e `hasChosen` (:177-185): zero modifiche al contesto.

[serious] src/components/Navbar.tsx:179-187 + src/pages/Esplora.tsx:718-719 + surfaces.ts:53
Problem: il pannello «Guide e racconti» ha 4 voci: tre puntano a `/esplora` (due come query di formato che la pagina espone già come chip) e una a `/itinerari`, che è `preview`. [MISURATO]
Why it matters: è metà del divario di densità 16-contro-7, ed è densità che non compra struttura — compra scorciatoie a filtri che esistono già a destinazione.
Direction: §5 — il pannello sparisce, la voce resta come link semplice a `/esplora`. Regola generale: un pannello apre una tassonomia, mai dei filtri.

[minor] src/components/Navbar.tsx:587
Problem: `py-1.2` non è un gradino della scala di spaziatura, e convive con `xl:py-1.5` sullo stesso elemento. [MISURATO]
Why it matters: se Tailwind 4 non emette regola per quel valore, il bottone ricerca ha padding verticale asimmetrico rispetto ai suoi vicini a `lg` — cioè proprio alla larghezza dove tutto è già stretto.
Direction: [VERIFY: cercare `py-1.2` nel CSS generato]. In ogni caso la §3 lo riscrive.

[minor] src/components/Navbar.tsx:712, 728
Problem: il drawer dice ancora «Scegli la tua modalità» e «Passa alla modalità X», mentre il chip spedito dice «Scegli l'edizione». [MISURATO]
Why it matters: la decisione «modalità → edizione» è stata presa e applicata a metà. Due nomi per la stessa cosa nello stesso componente.
Direction: allineare i due `aria-label` a «edizione». Il controllo segmentato del drawer **non si tocca in nient'altro** (§8).

[nit] DESIGN.md:186 contro src/components/PageLayout.tsx:10
Problem: DESIGN.md dichiara che PageLayout applica `pt-32 md:pt-24 pb-32`; il codice applica `pt-24 pb-32`. [MISURATO]
Why it matters: è la riserva contro cui si calcola il costo della fascia. Una direzione che si fidasse del doc sbaglierebbe di 32px su mobile — esattamente l'ordine di grandezza della decisione in §4.
Direction: correggere DESIGN.md quando la §4 atterra.
```

**Verdetto: Block — 1 blocker + 5 serious.** Non è un blocco al redesign: è che
la barra non va rifinita finché §1 (geometria) e §3 (vocabolario) non sono
decise, altrimenti si ridipinge la stessa incoerenza.

---

## 8. Decisioni che restano all'owner

Tre, tutte rese decidibili.

**1 · La forma della testata** (§3)

| | A — testata piena a filo *(raccomandata)* | B — pillola conservata, fascia come seconda pillola | C — pillola conservata, fascia dentro la pagina |
| --- | --- | --- | --- |
| Aspetto | filetto 1px, sabbia opaca | due pillole impilate | pillola + riga che scorre col contenuto |
| Costo | riscrive il contenitore | minimo | medio: tocca il padding di ogni pagina |
| Rischio | `/mappa` da verificare | resta il vocabolario SaaS, cioè il difetto | due oggetti scollegati, la fascia non appartiene alla testata |

**2 · La CTA family** (§7, terzo serious) — (a) punta a `/family/consigli`
finché i codici non esistono · (b) resta su `/family/shop` e la nav desktop
monta `SurfaceBadge` come il drawer · (c) resta com'è, e il sito promette
sconti che non ha. **(c) non la raccomando.**

**3 · La descrizione in fascia a ≥1280** (§4) — (a) sì, verbatim da
`AUDIENCE_EDITIONS` · (b) no, fascia coi soli tre nomi e metà destra vuota.

---

## 9. Cosa NON cambia — e il perimetro dei cancelli

**Non si tocca:**

- **Il controllo segmentato del drawer mobile** `[MISURATO: Navbar.tsx:708-750]`
  — ha già i 44px, è testato, e resta l'unico modo di cambiare edizione quando la
  fascia è scorsa via. Unica modifica ammessa: i due `aria-label` (§7). **Se il
  builder deve toccarlo per altro, si ferma e lo dichiara.**
- `AudienceContext.tsx` — espone già tutto (§7, quinto serious).
- `src/index.css`, i tre temi, i valori WCAG verificati, `audienceFromPath`.
- Fraunces, sabbia, terracotta, icone lucide, foto vere.
- Il gate del primo accesso (fuori perimetro qui).

**Cancelli da non far regredire:**

| Cancello | Cosa rischia la fascia | Perché regge |
| --- | --- | --- |
| `e2e/rotte-target-e-overflow.spec.ts` — ogni controllo ≥24×24, 20 rotte × 4 larghezze | 3 controlli nuovi su ogni rotta | i segmenti sono specificati a 36–44px; a <768 la ricetta è quella del drawer, già validata a 320 |
| stessa spec — overflow 0 da 320 | tre etichette su una riga a 320 | `flex-1` + la ricetta del drawer, che a 320 già passa. Nota: `BUG_HOME_FAMILY_OVERFLOW_320` è preesistente e non causato da qui |
| stessa spec — gerarchia dei titoli | — | **la fascia non introduce nessun heading**: `role="group"` + `aria-label`, mai `h1`–`h4` |
| stessa spec — zero errori console | — | nessuna dipendenza nuova |
| `e2e/tastiera-e-focus.spec.ts` | ordine di tabulazione | la fascia entra dopo la riga 1 e prima di `<main>`; non è un dialog; anello `focus-visible` obbligatorio su ogni segmento |
| CI: CLS ≤ 0,1 (bloccante) | il collasso della fascia | **la testata è `fixed`: cambiarne l'altezza non può spostare il layout del documento.** È la ragione tecnica per cui il collasso è sicuro, e va detta al builder perché non lo implementi in flusso |
| CI: a11y ≥ 0,95 (bloccante) | contrasto dei due segmenti spenti | `--color-muted-fg-2` (#57534e) su sabbia; i temi family e brand ridefiniscono `--color-muted-fg` ma **non** `-fg-2` (`index.css:189-190, 216-217`) → `[VERIFY: contrasto di #57534e su #eef6fb e #f6f4ef]` |

---

## 10. Ordine di esecuzione per travellini-frontend-builder

1. **Sonda prima di costruire.** A 320/375/768/1024/1280/1440 × 3 edizioni, con
   lo script di `DESIGN_commutatore-pubblico.md` §11. Servono tre numeri:
   contenuto di riga a 1024 per family (il modello dice 42), altezza pillola, e
   se una voce family va davvero a capo. **Se family non va a capo, il blocker di
   §1 ha un'altra causa: fermarsi e tornare qui.**
2. §2 — slot e invarianti: altezza fissa di riga 1, `whitespace-nowrap` sulle tre
   edizioni, `Travellini Family` → `Family`.
3. §3 — il contenitore: testata a filo, filetto, via blur/ombra/pillola/scala/
   ingresso animato; due registri; stato attivo unico; via il `kbd`.
4. §5 — cade il pannello «Guide e racconti».
5. §4 — la fascia: desktop, poi `<768` con la ricetta del drawer, poi il collasso
   con isteresi e `prefers-reduced-motion` → istantaneo.
6. Riserva: `PageLayout.tsx:10`, `BrandCoherentHero.tsx:87`,
   `VieniConNoi.tsx:167`. Poi guardare `/mappa` e `/esplora`.
7. §7 quinto serious — stato temporaneo su rotta forzata.
8. Ritiro del ramo `≥lg` di `AudienceEditionChip`; il pallino diventa permanente.
9. `npm run typecheck` · `npm run audit:ui` · `npm run audit:visual` ·
   `npm run e2e` (le due spec di §9) · sonda di nuovo su tre edizioni.

Handoff: `docs/50_Scratch/HANDOFF_navbar-premium_ui-designer_to_frontend-builder.md`
quando l'owner ha chiuso le tre decisioni di §8.
