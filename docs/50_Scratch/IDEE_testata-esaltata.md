---
title: IDEE_testata-esaltata
status: active
created: 2026-08-17
owner: travellini-ui-designer
slug: testata-esaltata
type: scratch
area: delivery
head: chore/config-hardening-2026-07-26
next: owner → travellini-frontend-builder
related:
  - '[[50_Scratch/DESIGN_navbar-premium]]'
  - '[[50_Scratch/COPY_navbar-edizioni]]'
  - '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
---

# La testata esaltata — idee, non verdetti

Non è un audit. La direzione (pillola galleggiante + commutatore centrato e
grande, tre segmenti, segmento attivo in velatura con un filo di colore sotto,
non fisso, scorre via con la testa del documento) **è data e non la rimetto in
discussione**. Qui c'è solo quello che nessuno ha ancora messo sul tavolo.

## 0. Strumenti, e come leggere i numeri

Questa sessione ha **Read / Grep / Glob / Write. Nessun browser, nessuna
shell.** Non ho aperto `localhost`, non ho misurato un pixel a schermo.

| Tag | Significato |
| --- | --- |
| `[MISURATO: file:riga]` | letto nel codice di questo albero, riproducibile aprendo quella riga |
| `[DEDOTTO]` | inferenza mia; se afferma un impatto porta sempre `Si smentisce se:` |
| `[VERIFY: ...]` | serve una sonda in browser prima di trattarlo come fatto |

Una nota di allineamento, detta una volta e poi mai più: **l'albero committato
non mostra ancora la forma decisa** — la testata è `fixed` a filo con bordo
`[MISURATO: Navbar.tsx:323]`, la fascia collassa su `isScrolled` invece di
scorrere via `[MISURATO: EditionBand.tsx:42-45]`, e a `≥lg` non ha tre segmenti
ma una riga di prosa più due uscite `[MISURATO: EditionBand.tsx:85-128]`. Cito il
codice **solo come substrato di costo** (quali token, quali componenti, quanta
fatica), mai come critica alla direzione. Se il ramo davanti a te è già oltre,
i costi reggono lo stesso: dipendono dai token, non dal markup.

---

## 1. L'idea che tiene insieme tutte le altre: **il filo**

Il commutatore è corretto e non memorabile perché **il filo di colore vive in un
posto solo**. Non serve aggiungere niente: serve accorgersi che quella riga da
2px il sito la disegna già in quattro punti diversi, e che sono tutti lo stesso
oggetto.

Il filo è l'edizione. Spessore unico, `--color-accent`, e compare:

1. **prima del sito** — nel preloader statico c'è già una riga da 2px larga 60px
   sotto il marchio `[MISURATO: index.html:243]`;
2. **dentro il nome** — la sillaba `with` è l'unica parte colorata del marchio
   `[MISURATO: Navbar.tsx:336-338]`;
3. **sotto il segmento attivo** del commutatore — la decisione presa;
4. **fuori dallo schermo** — `<meta name="theme-color">`, cioè la barra del
   browser su Android `[MISURATO: index.html:18]`.

Nessuno dei quattro è oggi legato all'edizione tranne il terzo. Le tre idee che
seguono sono, in sostanza, **collegare gli altri tre**. Costo aggregato: nessun
elemento nuovo a schermo, nessuna immagine, nessuna dipendenza.

Questa è anche la ragione per cui è raccontabile: «hanno un filo che cambia
colore in base a chi sei, e ce l'hanno anche nella barra del telefono» è una
frase che una persona dice. «Hanno un commutatore a tre segmenti» no.

---

## 2. Idea 1 — **Il cambio d'edizione diventa una cosa che si guarda**

### Il fatto

Oggi cambiare edizione è un taglio netto: `handleModeSwitch` chiama `navigate()`
nudo `[MISURATO: Navbar.tsx:200-223]`. Ma il sito **ha già** l'apparato per le
transizioni e lo usa su ogni link: `TransitionLink` avvolge la navigazione in
`document.startViewTransition` e si spegne da solo su `prefers-reduced-motion`
`[MISURATO: TransitionLink.tsx:42-43, 55-62]`; `index.css` dichiara
`@view-transition { navigation: auto }` e la dissolvenza di root a 220/280ms
`[MISURATO: index.css:445-454]`, con lo stop per reduced-motion
`[MISURATO: index.css:467-472]`.

Cioè: **il momento più importante del sito è l'unico che non passa da lì.**
Un link fra due articoli ha una transizione. Cambiare l'intera edizione no.

### La coreografia, in quattro tempi

Un solo gesto, quattro cose che non arrivano insieme. Tutte le durate sono token
già esistenti — 150 / 220 / 320ms, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
`[MISURATO: index.css:148-152]`. Non se ne inventa nessuna.

| t | Cosa succede | Durata |
| --- | --- | --- |
| 0 | **il filo parte** dal segmento vecchio verso quello nuovo, e mentre viaggia cambia colore (terracotta → rosa) | 220ms |
| +40ms | **la velatura lo segue** e, arrivando, cambia raggio: 14px in viaggiatori, 18px in family, 10px in collaborazioni `[MISURATO: index.css:133, 194, 221]` | 220ms |
| +80ms | **la pagina si dissolve** nell'altra edizione (colori, voci, CTA) | 320ms |
| ultimo | **il marchio** cambia colore per ultimo: la sillaba `with` si posa sul nuovo accento | 150ms |

L'ordine è la sostanza dell'idea. Oggi tutto cambia insieme e non si vede
niente; con un ordine si vede **una cosa che causa l'altra** — il filo si sposta,
e la pagina lo insegue. E il marchio che si posa per ultimo è la firma:
il nome è l'ultima cosa che si adegua, non la prima.

*(Alternativa difendibile e opposta: il marchio cambia per **primo**, e la
pagina si tinge a partire dal nome — «l'inchiostro parte da lì». È una micro
decisione da guardare in browser, non da decidere a tavolino. Raccomando di
provarle entrambe in una sessione sola: costo del confronto ≈ 10 minuti.)*

### Il meccanismo, e la trappola

- **Una tecnica sola, non due.** Durante una view transition il documento è
  congelato in uno snapshot: un'animazione `layoutId` di `motion/react` sotto non
  si vedrebbe. O l'una o l'altra. **Raccomando la view transition**, perché il
  cambio edizione quasi sempre naviga (family → `/family`, collaborazioni →
  `/collaborazioni` `[MISURATO: Navbar.tsx:211-222]`), e la VT è l'unica delle due
  che sa dissolvere *anche* la pagina.
- Il filo e la velatura ottengono un `view-transition-name` proprio: essendo
  presenti prima e dopo con posizione diversa, il browser li **interpola** invece
  di dissolverli. Lo scorrimento del filo è compositor, non layout: zero CLS,
  zero reflow.
- **La trappola, e vale la pena scriverla al builder**: dentro il callback di
  `startViewTransition` l'aggiornamento React deve essere già committato, o lo
  snapshot cattura lo stato vecchio due volte e non si anima niente. Serve
  `flushSync` attorno a `setAudience`, oppure il `viewTransition: true` di
  react-router per la parte di rotta. `[DEDOTTO. Si smentisce se: il builder vede
  il morph funzionare senza flushSync — nel qual caso React ha committato in
  sincrono e la nota è superflua, non dannosa.]`
- **Dove manca il supporto, si torna al taglio netto di oggi**: nessuna
  regressione possibile, perché il ramo è già quello attuale
  `[MISURATO: TransitionLink.tsx:42 — !document.startViewTransition ⇒ return]`.

### Costo

- **Pixel: zero.** Nessun elemento nuovo, nessuna altezza in più.
- **Codice**: ~10 righe CSS (`view-transition-name` + una classe transiente su
  `<html>` per rallentare la dissolvenza di root da 220/280 a 320/380 solo per
  questo evento) e ~15 righe in `Navbar.tsx`.
- **Rischio 1 — `/mappa`.** Snapshottare una pagina con canvas WebGL a tutto
  schermo può costare o rendere nero. Guardia: saltare la VT quando
  `pathname.startsWith('/mappa')`. `[VERIFY: cambio edizione da /mappa a 375 e 1440]`
- **Rischio 2 — la velatura `rounded-full` uccide il terzo tempo.** Se il
  contenitore attivo è a pillola piena, il raggio per edizione non si vede: la
  ricetta mobile oggi in produzione è `rounded-full`
  `[MISURATO: EditionBand.tsx:49, 60]`. **Per far vivere questa idea la velatura
  deve usare un token di raggio** (`--radius-lg` o `--radius-xl`), non `full`.
  È una decisione, non un dettaglio: vedi §8.

### Cosa la smentisce

- Un profilo che mostri il frame del cambio sopra i 16ms su `/esplora` a 375 →
  l'idea resta, ma perde il terzo tempo (la dissolvenza di pagina) e si limita a
  filo + velatura.
- Se in browser la sequenza si legge come «lag» invece che come «causa»: allora
  gli scarti (40/80ms) vanno a zero e resta un solo movimento. La coreografia è
  falsificabile guardandola, ed è giusto così.

---

## 3. Idea 2 — **Il filo esiste prima del sito** (la memoria che si dichiara)

L'idea più economica del documento, e quella che nessuno ha guardato perché sta
in `index.html`, non in React.

### Il fatto

Chi torna dopo aver scelto Family vede, nell'ordine:

1. il preloader col marchio e una riga da 2px **arancione fissa**
   `[MISURATO: index.html:243 — linear-gradient(90deg, #ff4d1a, #c2410c)]`;
2. poi il sito, azzurro e rosa.

Il tema è già corretto prima del CSS — lo script inline scrive `data-audience`
sull'`<html>` in `<head>`, quindi **prima** che il preloader dipinga
`[MISURATO: index.html:24-41]`. La memoria c'è. È solo muta nel primo mezzo
secondo, che è esattamente il momento del riconoscimento.

E c'è un dettaglio che va detto perché cambia come si implementa: **il blocco
`<style>` del preloader è codice morto.** `.twu-preloader-text` è applicato con
`className` in HTML puro `[MISURATO: index.html:237]` — attributo React, inerte
qui — e `.twu-preloader-line` non è applicato affatto: la riga porta solo stile
inline `[MISURATO: index.html:243]`. Quindi `twuLoaderPulse` e `twuLineGlow`
`[MISURATO: index.html:209-217]` non sono mai partite. Chi tocca quel blocco lo
sappia: non sta modificando qualcosa che funziona.

### L'idea

Tre regole CSS nel `<style>` già presente, agganciate all'attributo che lo
script scrive una riga sopra:

```
html[data-audience='family']    .twu-preloader-line { background: linear-gradient(90deg,#f43f77,#c2205a); }
html[data-audience='brand']     .twu-preloader-line { background: linear-gradient(90deg,#a8842f,#7d6426); }
```

Valori presi verbatim da `index.css:181-183` e `:209-211`. Nessun colore nuovo.
E la classe va davvero applicata (oggi non lo è).

**Secondo pezzo, lo stesso costo, effetto più grande: `theme-color` per
edizione.** Oggi è `#f7f0e5` `[MISURATO: index.html:18]`, che **non è nessuno dei
tre fondi** del sito (`#faf8f4` / `#eef6fb` / `#f6f4ef`
`[MISURATO: index.css:26, 176, 204]`): è un colore che il sito non usa da
nessuna parte. Allinearlo all'edizione significa che su Android **la barra
dell'indirizzo diventa rosa quando entri in Family**, e resta rosa quando torni.

Costo: due righe nello script inline già esistente (scrivere il `content` del
meta insieme al `dataset.audience`) più una riga nell'effetto che già scrive
l'audience sull'`<html>` `[MISURATO: AudienceContext.tsx:191-193]`.

### Perché è memorabile

Perché è l'unica idea del documento che **esce dal viewport**. È la differenza
fra «il sito si ricorda di me» e «il sito mi saluta»: la seconda si racconta.

### Costo

- **Pixel: zero. Peso: zero** (nessun JS nuovo, nessuna richiesta).
- **Complessità: la più bassa di tutte.** ~10 righe in due file.
- **Rischio**: la mappa rotte→audience è già duplicata fra `index.html` e
  `AudienceContext` per scelta dichiarata `[MISURATO: index.html:19-23]`. Questa
  idea **non aggiunge** duplicazione, ma la eredita: se un giorno nasce una
  quarta edizione, i posti da toccare restano due, non tre.

### Cosa la smentisce

- Se su iOS `theme-color` non è onorato nel browser in uso, metà dell'effetto
  vale solo su Android. `[DEDOTTO. Si smentisce se: una prova su Safari iOS mostra
  la barra colorata anche fuori standalone.]` Anche nel caso peggiore resta il
  filo del preloader, che è indipendente dal sistema operativo.

---

## 4. Idea 3 — **La domanda muore, la risposta resta**

### Il fatto

Oggi un primo visitatore riceve, in ordine: la pagina, il banner cookie a
schermo, la risposta, e ~1,2s dopo **un secondo dialogo a schermo intero** che
chiede «Cosa ti porta qui?» `[MISURATO: AudienceGate.tsx:174-197, 71-97, 99-104]`.
Due modali prima di una fotografia.

E dentro quel dialogo c'è una frase che oggi è quasi una promessa: «Puoi cambiare
quando vuoi dall'interruttore in alto» `[MISURATO: AudienceGate.tsx:194-197]`.
Con un commutatore grande e centrato nella testa del documento, **quell'interruttore
finalmente esiste** — e l'interstiziale diventa la spiegazione di una cosa già
visibile.

### L'idea

**La domanda non si fa in un modale: si fa una volta sola, nel posto dove sta la
risposta.**

Alla primissima visita — `hasChosen === false`, dato già esposto dal contesto
`[MISURATO: AudienceContext.tsx:177-185]` — la testa del documento nasce in
**forma estesa**:

```
                        Tre edizioni, gli stessi due autori.

              Viaggiatori          ·          Family          ·        Collaborazioni
   Posti particolari provati     Gravidanza, viaggi col      Collaborazioni, media kit
   di persona: mete, mappa       pancione e — presto —       e come lavoriamo con
   e come ci siamo andati.       col piccolo.                i partner.
```

- Le tre descrizioni **non si riscrivono: si spostano**. Sono già in produzione,
  già italiane, già specifiche, e vivono in un file solo
  `[MISURATO: audienceEditions.ts:31, 38, 45]`. È questo che permette al gate di
  sparire senza perdere una parola.
- **Nessuna velatura, nessun filo** finché non si sceglie: tre porte pari. Il filo
  lo disegna la prima scelta. Questo è anche l'unico stato in cui il commutatore
  ha diritto di essere la cosa più forte dello schermo.
- Dalla seconda visita in poi la testa è nella forma compatta decisa (tre nomi,
  velatura, filo) e le descrizioni spariscono.

### Perché non produce CLS — che è la ragione per cui si può fare

La forma la decide `localStorage`, letto **prima del CSS** dallo script inline
già presente `[MISURATO: index.html:24-41]`: basta che scriva un secondo
attributo (`data-edizione-scelta`) accanto a `data-audience`. Quindi l'altezza
della testa è giusta **al primo paint** e non cambia più durante la visita:
nessuno spostamento post-paint, nessun rischio sul cancello CLS ≤ 0,1 che
blocca la CI. La forma estesa non collassa allo scroll — **scorre via**, come
tutto il resto della testa.

### Copy — tre attacchi, la parola finale è dello strategist

Sono proposte di **direzione**, non copy definitivo: la lingua pubblica è di
`travellini-seo-conversion-strategist`.

1. **«Tre edizioni, gli stessi due autori.»** *(raccomandata)* — dichiarativa,
   non interrogativa. Non chiede niente a chi non sa ancora rispondere, e dice la
   cosa vera che il sito non dice mai: che dietro le tre c'è una coppia sola.
2. «Lo stesso sito si legge in tre modi. Il primo è il nostro.» — più in voce,
   più rischiosa: «il primo è il nostro» va verificata contro l'ordine reale.
3. «Da dove vuoi cominciare?» — se l'owner vuole tenere una domanda. Meglio
   dell'attuale «Cosa ti porta qui?», perché il lettore può rispondere guardando
   tre nomi invece che introspezionando.

Vietato qui, come ovunque: «scopri», «esplora il mondo», «unico»,
«personalizzato», «esperienza su misura».

### Costo

- **Pixel, a 375: circa +34px sulla prima schermata, solo alla prima visita**
  — la forma estesa mobile porta **una** riga di copy sopra i tre nomi, non tre
  descrizioni impilate. `[DEDOTTO: una riga da 13px con leading 1,5 ≈ 20px + 14 di
  spaziatura. Si smentisce se: la sonda a 375 mostra la riga andare a capo, nel
  qual caso sono ~54px e la frase va accorciata sotto i 40 caratteri.]`
- **Pixel, ≥768: circa +32px**, perché le tre descrizioni stanno **affiancate**
  sotto i rispettivi nomi, una riga ciascuna. `[VERIFY: la descrizione family è
  di 56 caratteri; a 11,5px su una colonna da ~230px potrebbe andare a due righe.]`
- **Codice**: ~40 righe in un componente, ~3 nello script inline.
- **Guadagno**: sparisce un `role="dialog"` a schermo intero con trap di focus,
  gestione ESC, tracciamento e kill-switch — cioè ~240 righe di componente
  `[MISURATO: AudienceGate.tsx, 239 righe]` sostituite da uno stato in più della
  testa. E sparisce il secondo modale della prima visita.

### Cosa la smentisce

- Se `audience_gate_select` mostra che il gate **converte** (la maggioranza di
  chi lo vede sceglie), spegnerlo costa scoperta. Gli eventi sono già in
  produzione `[MISURATO: AudienceGate.tsx:55, 64-67]`, e dal lato commutatore c'è
  già `audience_switch { from, to, surface, path }`
  `[MISURATO: Navbar.tsx:204-209]`. **Due settimane di dati chiudono questa
  decisione con un numero invece che con un'opinione**, e il kill-switch per
  provare esiste già `[MISURATO: AudienceGate.tsx:24]`.
- Se a 375 la forma estesa spinge l'`h1` sotto la piega: allora la copy sopra i
  nomi esce su mobile e resta solo ≥768.

---

## 5. Idea 4 — **Il vuoto si stampa** (family senza richiamo)

### Il fatto

Family non ha CTA: il ramo restituisce `null` per scelta dichiarata, perché
`getFamilyDeals()` filtra le voci con campo `deal`
`[MISURATO: familyLibrary.ts:24-26]` e oggi non ce ne sono
`[MISURATO: Navbar.tsx:265-269, commento con la condizione di riaccensione]`.

### L'idea

Uno slot vuoto è un **difetto** se la testata non lo nomina, e una
**dichiarazione** se lo nomina in prosa. La differenza non è il buco: è se
altrove nella testa c'è una frase che se ne assume la responsabilità.

**V1 — raccomandata: il vuoto resta vuoto, e la riga dell'edizione lo dichiara.**
La descrizione family dice già «Gravidanza, viaggi col pancione e — **presto** —
col piccolo» `[MISURATO: audienceEditions.ts:38]`. Quel «— presto —» è già la
frase più onesta della testata: è un brand che data le proprie assenze. Non
serve altro. Lo slot azione va **riservato in larghezza** (non ridistribuito), o
la geometria della riga 1 torna a dipendere dall'edizione.

**V2 — più forte, più rischiosa: il vuoto si stampa.** Nello slot azione, dove le
altre due edizioni hanno un bottone, family stampa una riga di prosa **non
cliccabile**:

> **Nessun codice, per ora.**

Regole che la rendono difendibile invece che triste:

- **registro di orientamento, non di azione**: serif, caso normale,
  `--color-muted-fg`. Nessuna pillola, nessun bordo, nessun maiuscolo — o si
  legge come un bottone rotto;
- **si spegne da sola**: renderizzata solo mentre `getFamilyDeals().length === 0`.
  Non può diventare una bugia, perché la condizione è la stessa che riaccende il
  bottone;
- **una sola volta nella testata**: se c'è questa, la riga dell'edizione non
  ripete il concetto.

### Perché V2 è raccontabile

Perché nessun sito lo fa. Un marchio che stampa un'assenza nella propria testata
sta dicendo, senza dirlo, che quando ci sarà scritto qualcosa sarà vero. È
esattamente il posizionamento «meraviglia concreta, con prezzo e prova
personale» del brand snapshot, applicato al proprio mobilio.

### Costo

- **Pixel**: zero in V1; in V2 la frase occupa uno slot che è già riservato.
- **Complessità**: V1 nulla. V2 ~8 righe più un import.
- **Rischio di V2, ed è reale**: quella frase starebbe su **ogni** pagina family.
  Un'edizione che si presenta ovunque con ciò che non ha può leggersi come
  un'edizione incompleta invece che onesta. `[DEDOTTO. Si smentisce se: l'owner
  legge la barra family e la frase gli suona come una promessa mantenuta e non
  come una scusa — è un giudizio di voce, e la voce è sua.]`

### Cosa la smentisce, tutte e due

Il giorno in cui esiste un `deal` reale, entrambe le versioni si ritirano da
sole e torna il bottone «I codici attivi» già specificato in
`COPY_navbar-edizioni` §4. **Nessuna delle due è una scelta permanente**, ed è la
ragione per cui si possono prendere in fretta.

---

## 6. Cinque dettagli piccoli, rapporto altissimo

1. **L'occhiello possessivo.** Una parola che porta tre stati: `Edizione` (non
   hai scelto) · **`La tua edizione`** (l'hai scelta tu, e ce la ricordiamo) ·
   `Solo su questa pagina` (te la impone la rotta). Il contesto espone già
   `userAudience` e `hasChosen` `[MISURATO: AudienceContext.tsx:177-185]`, e la
   fascia già distingue il caso forzato `[MISURATO: EditionBand.tsx:33-36]`.
   **Costo: un ternario.** È la memoria che si dichiara senza scrivere
   «Bentornato».

2. **La velatura in anteprima all'hover.** Passando sopra un segmento spento, la
   sua velatura prende un velo della **carta di quell'edizione** (`#eef6fb`,
   `#f6f4ef`): si vede che colore diventerà il sito prima di cliccare. Serve
   dichiarare tre token campione nel `:root` di base (mai override, mai colori
   inline nei `.tsx`, come impone `DESIGN.md`). **Costo: 3 var + 3 righe.**
   `[DEDOTTO. Si smentisce se: in browser i tre veli si leggono come un
   selettore di tema chiaro/scuro — allora l'anteprima esce e resta solo il
   filo.]` Su touch non esiste: è scoperta, non informazione.

3. **Non buttarmi fuori dalla pagina.** Oggi cambiare edizione naviga sempre
   `[MISURATO: Navbar.tsx:211-222]`. Ma `/chi-siamo` è nel menu di tutte e tre
   `[MISURATO: Navbar.tsx:238, 248, 256]`: cambiare edizione stando lì **non
   dovrebbe teletrasportarti**. Regola: se la rotta corrente esiste nel menu
   dell'edizione di destinazione, si resta e si ricolora soltanto. **Costo: ~8
   righe.** È anche il caso in cui la coreografia dell'Idea 1 si vede meglio,
   perché non c'è cambio pagina a coprirla.

4. **Il pallino da 6px si ritira.** Esiste un pallino accanto al marchio il cui
   unico lavoro è dichiarare il colore dell'edizione
   `[MISURATO: AudienceEditionChip.tsx:20-25]`. Ma il marchio **lo dichiara già**,
   e meglio: `with` è colorata con `--color-accent-text`
   `[MISURATO: Navbar.tsx:336-338]`, cioè terracotta / rosa scuro / oro
   `[MISURATO: index.css:43, 183, 211]`. Due indicatori a 8px di distanza per la
   stessa informazione. **Togliere il pallino è una sottrazione che rende il
   marchio più forte**, non una perdita: lo `sr-only` «Edizione …» si sposta sul
   marchio e nessuno perde informazione. −10px, −1 componente.

5. **`audience_switch` distingua la prima scelta.** L'evento esiste già con
   `surface` `[MISURATO: Navbar.tsx:200-209]`. Se l'Idea 3 entra, serve un valore
   dedicato (`testa-estesa`) per la prima scelta: è l'unico modo di confrontare
   «gate» e «testa» sullo stesso asse, e quindi di chiudere la §4 con un numero.

---

## 7. Cosa ho scartato, e perché (serve quanto le idee)

- **Un contatore, un badge, un «3 edizioni»** — numeri sulla testata sono la
  grammatica che il progetto ha già bandito. E qualunque numero qui sarebbe un
  numero su noi stessi.
- **Un tooltip di onboarding sul commutatore** («prova a cambiare!») — è
  didascalia della propria interfaccia. Se serve spiegarlo, la forma è sbagliata.
- **Testo che si riscrive da solo** (le tre descrizioni che si trasformano l'una
  nell'altra, macchina da scrivere, blur di parole) — animazione decorativa che
  non porta informazione. Esplicitamente fuori dal registro.
- **Tre pillole sempre accese, o tre colori sempre visibili** — due dei tre stati
  sarebbero permanentemente «spenti» accanto al marchio: ruba gerarchia alla CTA
  e trasforma la testata in un pannello di controllo.
- **Vibrazione al cambio, suono, coriandoli** — non serve argomentarlo.
- **Un tema scuro per edizione** — è un quarto asse su un sistema che ne ha già
  tre, e il progetto dichiara come limite accettato che `bg-white` e `text-black`
  non seguono il tema `[MISURATO: DESIGN.md:122-123]`. Aprirlo qui significa
  riaprirlo ovunque.
- **La numerazione da rivista** («Edizione n. 12») — sarebbe un numero inventato.
  Vietato dal contratto, e giustamente.

---

## 8. Le decisioni dell'owner, rese decidibili

1. **La velatura ha la forma dell'edizione?** Token di raggio (14/18/10px) →
   il terzo tempo della coreografia esiste. `rounded-full` → non esiste, e
   l'Idea 1 perde un tempo su quattro. *Raccomando il token.*
2. **Il filo esce dallo schermo?** `theme-color` per edizione: la barra del
   browser Android cambia colore. Costo ~10 righe, rischio zero.
   *Raccomando sì.* (Va comunque corretto: oggi è un colore che il sito non usa.)
3. **La domanda muore?** A: si spegne il gate e la testa estesa la eredita
   (Idea 3, ~mezza giornata) · B: si spegne e basta (una riga, il kill-switch
   c'è) · C: resta com'è. *Raccomando A, con due settimane di
   `audience_gate_*` contro `audience_switch` a fare da prova.*
4. **Il vuoto si stampa?** V1 (lo dichiara la riga dell'edizione, costo zero) ·
   V2 («Nessun codice, per ora.» nello slot azione). *Raccomando V1 se l'owner
   ha un dubbio, V2 se non ce l'ha: V2 è più memorabile e più esposta.*
5. **Il marchio guida o firma?** Cambia colore per primo (l'inchiostro parte dal
   nome) o per ultimo (il nome firma). Da provare in browser, dieci minuti.

---

## 9. Se si fa tutto, in che ordine

Dal più economico al più caro, così ogni gradino è già consegnabile da solo.

1. **Idea 2** — filo del preloader + `theme-color` (~10 righe, due file, zero pixel).
2. **§6.4** — ritiro del pallino; il marchio resta l'unico indicatore.
3. **§6.1** — occhiello possessivo (un ternario).
4. **§6.3** — non navigare se la rotta esiste anche nell'edizione di destinazione.
5. **Idea 1** — la coreografia. Prima senza dissolvenza di pagina (filo +
   velatura), poi con. Guardia su `/mappa`.
6. **Idea 4** — la versione scelta dall'owner.
7. **Idea 3** — la testa estesa alla prima visita, e il gate si spegne.

**Cancelli, invariati**: `npm run typecheck` · `npm run audit:ui` ·
`npm run audit:visual` · `npm run e2e` · CLS ≤ 0,1 e a11y ≥ 0,95 in CI. Tre
attenzioni specifiche a queste idee: ogni segmento resta ≥24×24 anche in forma
estesa; il contrasto dei due segmenti spenti va verificato sui tre fondi (i temi
family e brand ridefiniscono `--color-muted-fg` ma **non** `--color-muted-fg-2`
`[MISURATO: index.css:189-190, 216-217]`); e ogni animazione qui proposta si
spegne su `prefers-reduced-motion`, come già fa l'apparato esistente
`[MISURATO: index.css:467-472, TransitionLink.tsx:43]`.

**Handoff**: quando l'owner ha chiuso le cinque decisioni di §8, questo documento
diventa `HANDOFF_testata-esaltata_ui-designer_to_frontend-builder.md`. Prima no:
tre delle cinque cambiano cosa si costruisce.
