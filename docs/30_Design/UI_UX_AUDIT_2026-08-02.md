# Audit UI/UX — 2026-08-02

Audit su browser reale (Playwright + axe-core 4.11.1), non su lettura del JSX.
Server: `localhost:5173`, branch `chore/config-hardening-2026-07-26`.
Rotte coperte: `/`, `/esplora`, `/collaborazioni`, `/chi-siamo`, `/media-kit`,
`/contatti` × viewport 375 e 1280.

## Sintesi

Il sito parte da una base **alta**, non da un progetto in difficoltà: zero errori
in console, un solo `h1` per pagina, **45 immagini su 45 con alt**, nessun
overflow orizzontale a 375px, 154 test unitari verdi, token WCAG-verificati e
una tipografia fluida già sistemata. Non serviva un redesign e non ne è stato
fatto uno.

Quello che l'audit ha trovato è di un'altra natura: **regole che il progetto ha
già scritto per sé e che il codice in alcuni punti non rispettava.** Cinque
difetti su sei nascono così — non da assenza di sistema, ma da punti in cui il
sistema è stato aggirato.

| #   | Problema                                                        | Gravità | Stato                  |
| --- | --------------------------------------------------------------- | ------- | ---------------------- |
| 1   | Marchio in navbar sotto AA (3,13:1) + token inesistente         | **P1**  | Risolto                |
| 2   | Voce di nav attiva sotto AA (3,13:1)                            | **P1**  | Risolto                |
| 3   | Testo terziario sotto AA sui temi family e brand                | **P1**  | Risolto                |
| 4   | `--shadow-soft` inesistente spegne il focus ring di ContentCard | **P1**  | Risolto                |
| 5   | Etichette delle statistiche lette due volte da screen reader    | **P2**  | Risolto                |
| 6   | «Nove posti» scritto a mano su una lista variabile              | **P2**  | Risolto                |
| 7   | Home: 10,8 schermate, quattro collezioni di posti               | **P2**  | Da decidere (§ Aperti) |
| 8   | Focus dei campi form affidato al solo bordo, non all'outline    | P3      | Aperto                 |

Risultato misurato: **violazioni axe da 8 a 0** su 6 rotte × 2 viewport.
Sul focus, 554 elementi attraversati con Tab reale: i **3 controlli senza alcun
indicatore** sono stati corretti; restano 6 campi form che si affidano al solo
cambio di bordo — conformi, ma più deboli (§8).

> ### Rettifica — una prima versione di questo audit sbagliava
>
> La v1 dichiarava come **P1** che il gate d'ingresso lasciava 3 bottoni su 4
> senza indicatore di focus, e come **P1 sistemico** che 29 componenti si
> affidavano a un `ring` che «si calcola trasparente e a 0px».
>
> **Erano entrambi falsi**, e nascevano da tre errori di misura miei:
>
> 1. la `box-shadow` veniva troncata a 90 caratteri, quindi si leggevano solo i
>    tre slot placeholder di Tailwind — sempre trasparenti — e non il quarto
>    segmento, che conteneva l'anello vero (`rgb(255,77,26) 0 0 0 2px`);
> 2. lo stato «a riposo» veniva letto senza aspettare la fine delle
>    `transition-*`, quindi risultava identico a quello a fuoco;
> 3. `.focus()` programmatico non attiva `:focus-visible` sui `<button>`, quindi
>    alcuni controlli risultavano privi di stile quando semplicemente non erano
>    nello stato giusto.
>
> Il pattern `focus-visible:ring-*` **funziona**. La verifica corretta (§4) ha
> però trovato un difetto reale che la v1 non aveva visto.

---

## 1-2. Accento usato come testo — P1

`--color-accent` (`#ff4d1a`) su sand rende **3,13:1**. Per il testo AA chiede
4,5:1. `DESIGN.md` lo dice già, esplicitamente: l'accento è per «riempimenti con
testo scuro, display, UI non testuale», e per il testo su chiaro esiste
`--color-accent-text` (4,88:1).

Due punti lo violavano, entrambi in `Navbar.tsx`, entrambi presenti su **ogni
pagina**:

- **`:322`** — il «with» del marchio. In più l'hover puntava a
  `var(--color-gold)`, **un token che non esiste** e che qui non aveva fallback:
  la classe non cambiava nulla. (In `App.tsx:89` lo stesso token è usato con
  fallback `#d4af37`, quindi lì funziona.)
- **`:405`** — la voce di navigazione **attiva**, cioè proprio quella che deve
  leggersi meglio delle altre.

**Fix.** Entrambi a `--color-accent-text`. Il bordo inferiore della voce attiva
resta `--color-accent`: è UI non testuale, soglia 3:1, e così l'accento visivo
non cambia.

> **Nota di perimetro.** `text-[var(--color-accent)]` ricorre 226 volte, ma la
> quasi totalità sono **icone**, per cui la soglia è 3:1 e l'uso è corretto e
> documentato. Non è stata fatta nessuna sostituzione di massa: sono stati
> corretti solo i nodi di testo che axe ha dimostrato sotto soglia.

---

## 3. I temi spostano il fondo ma non il testo terziario — P1

I temi per audience ridefiniscono `--color-sand`, ma **non** i token di testo
terziario. Misurato:

| token                                    | default `#faf8f4` | brand `#f6f4ef` | family `#eef6fb` |
| ---------------------------------------- | ----------------- | --------------- | ---------------- |
| `--color-ink`                            | 18,67             | 18,01           | 18,11            |
| `--color-ink-2`                          | 9,68              | 9,35            | 9,40             |
| **`--color-muted` / `--color-muted-fg`** | **4,52**          | **4,36 ✗**      | **4,39 ✗**       |
| `--color-muted-fg-2`                     | 7,19              | 6,94            | 6,98             |

Il default passa per 0,02. I due temi **non passano**. Ogni didascalia muted su
`/collaborazioni`, `/media-kit`, `/chi-siamo`, `/contatti` e `/family` era sotto AA.

Il commento del blocco family dichiarava «stessi contrasti»: per il testo
terziario non era vero.

**Causa a monte.** La checklist di verifica in `DESIGN.md` elenca ink/sand,
accent/sand, accent-text, bianco/accent-hover, accent-on-dark/ink — **muted-fg
non c'è**. Il token non è stato dimenticato per distrazione: non era nella lista
di controllo.

**Fix.** Override `--color-muted` e `--color-muted-fg` a `#6f6862` nei due
blocchi tema (4,99:1 brand, 5,01:1 family). Il default resta intatto: passa già,
e l'architettura del progetto dice che un tema è un blocco di override, non un
fork. `DESIGN.md` aggiornato con il token mancante nella checklist.

---

## 5. Le statistiche lette due volte — P2

`HomeAudienceVoice.tsx` aveva `<dt class="sr-only">` con l'etichetta, e la
**stessa etichetta ripetuta visibile** dentro il `<dd>`. Uno screen reader
leggeva: _«posti provati di persona, 29, posti provati di persona»_, per tre
statistiche di fila.

**Fix.** L'etichetta è il `<dt>`, una volta sola; il numero è il `<dd>`.
`flex-col-reverse` tiene il numero sopra, quindi **l'aspetto non cambia**.

**Verifica.** Ogni etichetta compare ora esattamente 1 volta; `numberAboveLabel: true`.

---

## 6. Un numero scritto a mano — P2

`CleanFeaturedGrid.tsx:55` diceva «Nove posti, presi uno per uno.» sopra una
griglia costruita da `selectHomeGridItems`, che per sua stessa documentazione ne
restituisce «**fino a** 9». Se un posto perde la cover o esce dalla selezione, la
griglia ne mostra 8 sotto un titolo che dice nove.

Oggi il conto è giusto (9 tile, 9 reali). **Non era un bug attivo: era un bug
latente** — ed è esattamente ciò che `homeComposition.ts` vieta per iscritto:

> «Nessun numero scritto a mano. […] Un claim che si scrive a mano è un claim che
> invecchia senza che nessuno se ne accorga.»

Per un brand la cui intera promessa è la verificabilità, è il difetto peggiore
possibile in termini di credibilità.

**Fix.** Il numero si conta dalle tile, in lettere per non perdere la voce
editoriale. Oggi rende la stringa **identica**: zero differenza visiva, ma ora
non può più mentire.

---

## 7. La home ripete se stessa — P2, aperto

Misurato a 1280×900: **9.734px, 10,8 schermate**.

La composizione `viaggiatori` monta otto blocchi, e **quattro** sono collezioni
di posti, ciascuna introdotta da una variante della stessa frase:

| Sezione                   | Altezza     | Titolo                                      |
| ------------------------- | ----------- | ------------------------------------------- |
| `featured-places`         | 1.026px     | «I posti che ci hanno conquistato.»         |
| `griglia-posti`           | **2.426px** | «Nove posti, presi uno per uno.»            |
| `mappa-interattiva-reale` | 764px       | «Tutti i posti in cui siamo stati davvero.» |
| `reels-stream`            | 965px       | «29 posti, filmati mentre ci eravamo.»      |
| `indice-vivo`             | 1.573px     | «Posti provati, uno per uno.»               |

Otto `h2` sulla pagina riaffermano **la stessa singola promessa** («li abbiamo
provati davvero») invece di far avanzare il lettore. La promessa è forte — ed è
il posizionamento giusto — ma dopo la terza riformulazione smette di persuadere e
comincia a costare scroll.

**Perché non è stato toccato.** Tagliare o riordinare una sezione è una decisione
di prodotto, non un difetto: la composizione è deliberata
(`PROJECT_HOME_RICOMPOSIZIONE_2026-07-26`) e la leva esiste già ed è pulita —
l'array `sections` in `homeComposition.ts:151`. Serve la scelta dell'owner, non
una patch. Proposta in `UI_UX_ROADMAP_2026-08-02.md`.

---

## 4. Un token inesistente spegneva un focus ring — P1

**Passata completa (R1).** 554 elementi attraversati con **Tab reale** su 8
rotte, contando come indicatore un outline con stile disegnabile **oppure** una
box-shadow con un segmento opaco, **anche su un discendente** (il pattern
`group-focus-visible:ring-*` mette l'anello sul figlio, non sul focusabile).

Su 554, **un solo controllo** non mostrava nulla: il bottone «Anteprima rapida»
delle card, `ContentCard.tsx:46`.

**Causa.** Non il ring. Il bottone dichiarava `shadow-[var(--shadow-soft)]`, e
**`--shadow-soft` non esiste**: non è definito né in `index.css` né altrove, ed
è usato in questo unico punto. Una `var()` non definita dentro `shadow-[]` rende
invalido `--tw-shadow`, e con esso **l'intera catena `box-shadow`** di Tailwind —
che è la stessa proprietà su cui viaggia il focus ring.

Misurato prima del fix, sul bottone a fuoco:

```
--tw-ring-shadow : 0 0 0 calc(2px + 2px) #ff4d1a   ← l'anello si calcola GIUSTO
box-shadow       : none                             ← ma non viene mai disegnato
```

Un token mancante ne portava giù due cose insieme: l'ombra a riposo del bottone
(mai vista da nessuno) e il suo indicatore di focus.

**Fix.** `--shadow-soft` → `--shadow-sm`. Dopo:

```
box-shadow : ... rgb(255,255,255) 0 0 0 2px, rgb(255,77,26) 0 0 0 4px, rgba(10,10,10,.06) ...
```

Anello accento **e** ombra a riposo tornano entrambi.

**Nota.** I 29 componenti che accoppiano `focus-visible:outline-none` a un
`ring` sono stati verificati e **funzionano**. Il pattern è sano; il problema
era un token, non l'architettura del focus.

### Altri due controlli senza focus, trovati dalla stessa passata

Raffinando la misura (attesa delle transizioni, indicatore cercato anche sugli
**antenati** per il pattern `focus-within`) sono emersi altri due punti in cui
`focus:outline-none` non aveva nulla a sostituirlo — né ring, né cambio di bordo:

| Punto                                | Cosa succedeva                           | Fix                                                 |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------------- |
| `Shop.tsx:190` — chip dei filtri     | `outlineStyle: none`, nient'altro cambia | tolto `focus:outline-none` → vale la regola globale |
| `Esplora.tsx:498` — barra di ricerca | idem sull'`<input>`                      | `focus-within:ring-2` sul **contenitore**           |

Sulla ricerca l'indicatore non poteva stare sull'`<input>`: è un pill composito
(icona + campo + bottone «Cerca»), e un outline sul solo campo disegna un
rettangolo in mezzo alla pillola. Col ring sul `<form>` segue il `rounded-full`,
e l'`<input>` tiene il suo `focus:outline-none` proprio per questo.

Verificato: chip shop `outlineStyle: none → solid` 2px `accent-text`; barra di
ricerca `rgb(255,77,26) 0 0 0 2px` sul contenitore, con l'ombra a riposo intatta.

**Stato finale.** Su 554 elementi attraversati, **nessun controllo resta senza
affordance di focus**. I 6 ancora segnalati dalla scansione severa sono campi
form che cambiano solo il bordo: vedi §8.

---

## 8. Il focus dei campi form vive solo sul bordo — P3

Su `/contatti`, `/media-kit`, `/chi-siamo` e `/shop` i campi fanno
`focus:outline-none` e affidano il focus a un cambio di colore del bordo:

```
borderColor: oklab(0 0 0 / 0.1)  →  rgb(255, 77, 26)
```

Il cambio **c'è ed è percepibile**, quindi WCAG 2.4.7 (AA) è soddisfatto: non è
una violazione. Ma è più debole dell'outline che il sito applica ovunque
(`index.css:637`), e su un campo `border-b` sottile l'indicazione è una linea da
1px.

Sono sei campi, su `/chi-siamo`, `/media-kit` e `/contatti`. Non toccati: è una
scelta editoriale coerente (gli input underline di Contatti) e irrobustirla è una
decisione di design, non un fix. La strada, se si vuole, è un
`focus-visible:outline` esplicito al posto di `outline-none` — non un ring.

> Distinzione che conta: questi sei **cambiano qualcosa**. I tre corretti ai §4
> non cambiavano nulla. È la differenza fra «debole» e «assente», e solo la
> seconda è una violazione.

---

## Aperti / non risolti

- **Preload dell'hero.** Console: `hero-impossible-320.avif` preloadato e non
  usato. L'invariante che il codice si impone (`imagesizes` del preload identico
  a `sizes` dell'immagine) **è rispettata** — verificato, entrambi
  `(max-width: 1023px) 80vw, 37vw`. La causa non è stata isolata e potrebbe
  essere un artefatto di DPR dell'harness. Da confermare con Lighthouse reale
  prima di toccare qualcosa.
- **Target tattili nel drawer mobile.** Voci di nav a 32px e chip audience a
  31px. Sopra il minimo WCAG 2.2 AA (24×24), sotto i 44px di comfort. Non
  toccato: incide sul ritmo verticale del drawer, è una scelta di design.
- **`npm run audit:a11y` è rotto in locale.** ChromeDriver 151 vs Chrome 150.
  L'audit è stato eseguito iniettando axe-core via Playwright.
- **`npm run lint` fallisce in locale** su `functions/lib/index.js`, artefatto di
  build **gitignorato**. In CI non esiste, quindi non blocca la pipeline. Rumore
  locale, non un problema di prodotto.
- **Gate d'ingresso come interstiziale.** Il sito apre con una modale bloccante
  prima di qualsiasi contenuto. È accessibile (focus trap corretto, anello
  accento visibile su tutti e quattro i bottoni), ma resta il primo ostacolo fra
  il visitatore e la prima riga di testo. Questione di prodotto, non di codice.

## Metodo

- axe-core 4.11.1 iniettato in Playwright, tag `wcag2a wcag2aa wcag21aa wcag22aa`
- focus verificato con **pressioni Tab reali** + `matches(':focus-visible')`,
  leggendo la `box-shadow` **per intero** e attendendo la fine delle
  `transition-*` prima di confrontare lo stato a riposo con quello a fuoco
- indicatore cercato anche sui **discendenti** del focusabile
  (`group-focus-visible:ring-*` disegna sul figlio)
- contrasti ricalcolati sulla formula WCAG per i tre fondi tema
- `npm run typecheck`, `npm run test:unit` (154/154), `npm run audit:ui` (exit 0)

### Lezione di metodo

Tre conclusioni sbagliate su questo audit sono nate tutte dallo **strumento di
misura**, non dal sito: output troncato, transizioni non attese, `.focus()`
programmatico al posto del Tab. Ogni volta il difetto sembrava più grande e più
sistemico di quanto fosse. Prima di dichiarare rotto un pattern usato in 29
punti, conviene costruire il controprova: un elemento sonda con le stesse classi.
È così che il falso allarme è caduto.
