---
title: IDEE_voce-delle-edizioni
status: active
created: 2026-08-17
owner: travellini-editorial-writer
slug: voce-delle-edizioni
type: scratch
area: content
head: chore/config-hardening-2026-07-26
next: owner (3 decisioni) → travellini-frontend-builder
---

# La voce delle tre edizioni

Brainstorming, non revisione. Consegna nove frasi, il ragionamento che le regge
e quattro cose che l'owner deve decidere. **Nessun file di codice è stato
toccato.**

## 0. Come sono prodotte le misure

| Tag                     | Significato                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `[MISURATO: file:riga]` | letto in questo albero, riproducibile aprendo quella riga                          |
| `[DEDOTTO]`             | inferenza; se afferma un impatto porta `Si smentisce se:`                          |
| `[VERIFY: ...]`         | misura che questa sessione non poteva fare (nessun browser: solo Read/Grep/Glob)   |

I conteggi di caratteri sono contati a mano, spazi e punteggiatura inclusi.

---

## 1. Cosa promettono davvero, oggi

Le tre righe in produzione `[MISURATO: src/config/audienceEditions.ts:31, 38, 45]`:

| Edizione       | Riga                                                                       | Car.   |
| -------------- | -------------------------------------------------------------------------- | ------ |
| Viaggiatori    | «Posti particolari provati di persona: mete, mappa e come ci siamo andati.» | **73** |
| Family         | «Gravidanza, viaggi col pancione e — presto — col piccolo.»                 | **57** |
| Collaborazioni | «Collaborazioni, media kit e come lavoriamo con i partner.»                 | **57** |

Sono tre elenchi, sì — ma non dello stesso tipo di cosa, ed è questo il difetto
vero:

- **Viaggiatori elenca superfici del sito** (mete, mappa). Chi legge non sa
  ancora cos'è una «meta» qui dentro: gli stiamo dando la mappa del sito prima
  di avergli detto perché dovrebbe restarci.
- **Family elenca fasi di una vita.** È l'unica delle tre che nomini una persona
  reale in un momento reale. È anche l'unica con dentro una data di scadenza:
  «— presto —».
- **Collaborazioni elenca due pagine e una proposizione**, e apre ripetendo il
  nome dell'edizione. Il chip sopra dice `Collaborazioni`, la riga sotto
  ricomincia con `Collaborazioni`. Nel gate le due parole distano una manciata
  di pixel `[MISURATO: AudienceGate.tsx:213-218 — titolo e descrizione nello
  stesso blocco]`.

**Sotto i tre elenchi c'è una promessa che nessuna delle tre dice**, e che è
l'unica ragione per cui uno sconosciuto cambierebbe edizione:

> Le tre edizioni non contengono contenuti diversi. Contengono lo **stesso
> mestiere** applicato a **tre persone che stanno per fare tre cose diverse**.

- Viaggiatori: **sta decidendo dove andare.**
- Family: **sta cambiando vita, e viaggia lo stesso.**
- Collaborazioni: **sta valutando se pagarci.**

Questo è l'asse. Ogni riga dovrebbe rispondere a «perché dovrei cambiare
edizione?» dicendo *in che stato sei tu*, non *quali pagine ci sono*.

### Il vincolo che taglia fuori metà delle idee possibili

Il sito ha appena smesso di dare verdetti `[MISURATO: PROJECT_BACKLOG_UNICO_2026-07-31.md:106-108
— «la rimozione del giudizio ha portato via l'ultimo placeholder editoriale»]`.
Quindi **nessuna riga può promettere un giudizio**: fuori «se vale», «i posti
giusti», «quelli da saltare», «cosa non ci ha convinto». Restano: cosa c'è, cosa
abbiamo speso, cosa sapere prima, com'è dichiarato. È un vincolo che stringe, e
paradossalmente aiuta: costringe alla prova invece che all'aggettivo.

---

## 2. Le due fisiche della stessa stringa

La stessa `description` rende in due posti con regole opposte
`[MISURATO: AudienceGate.tsx:216-218 e EditionBand.tsx:103-105]`:

| Dove             | Come rende                                                            | Conseguenza                                                     |
| ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| **AudienceGate** | blocco `text-xs leading-relaxed`, **va a capo**, tutte e tre insieme  | si leggono **in sequenza**: la struttura del set si vede         |
| **EditionBand**  | riga singola in serif 13px con `truncate`, **solo da `xl` (1280px)**  | si legge **da sola**, in apposizione a «Edizione Viaggiatori — » |

Due conseguenze che nessuno dei documenti precedenti dice, e che cambiano cosa
si può scrivere:

**a) Sotto i 1280px la riga non esiste in testata.** La classe è
`hidden … xl:inline` `[MISURATO: EditionBand.tsx:103]`. Su telefono e tablet
l'unico posto dove queste tre frasi vengono lette è **il gate**. Quindi il gate
non è il posto secondario: è il primario.

**b) Nella fascia la riga è grammaticalmente un'apposizione.** Rende come
`Edizione · Family — <riga>` `[MISURATO: EditionBand.tsx:86-105]`. Una frase che
comincia con «Per chi…» ci sta male («Edizione Family — Per chi viaggia…»),
mentre nel gate, sotto il titolo `Family` e sotto la domanda «Cosa ti porta
qui?» `[MISURATO: AudienceGate.tsx:192]`, «Per chi…» è esattamente la risposta.
**Le due sedi vogliono due registri.** Ci torno in §7.

### Il budget di larghezza: più largo di quanto sembri

`[DEDOTTO]` A 1280px (la larghezza minima in cui la riga compare): contenitore
`max-w-[1360px] px-6` → 1232px interni `[MISURATO: EditionBand.tsx:47]`; via
l'occhiello «Edizione», il nome in serif 15px, il trattino, i due gap e il
gruppo di destra con le altre due edizioni → **restano ≈855px**, che a 13px
serif valgono **≈130 caratteri**.

Nessuna delle nove frasi qui sotto si avvicina. **La troncatura non è il vincolo
reale.** Il vincolo reale è che una riga di testata si legge in un colpo d'occhio:
oltre gli **80 caratteri** smette di essere una riga e diventa un paragrafo
appoggiato in alto. Tetto operativo che propongo: **80.**

`[VERIFY: la sonda in browser a 1024/1280/1440 su /, /family e /collaborazioni.
Il modello px/carattere è mio e la nota COPY_navbar-edizioni.md §7 avverte che i
numeri di larghezza di quest'area storicamente non tornano. Si smentisce se: la
sonda mostra meno di ~90 caratteri disponibili a 1280, nel qual caso la versione
A di Viaggiatori (80 car.) va accorciata.]`

---

## 3. Le nove frasi

Tre modi diversi di rispondere alla stessa domanda, non tre sinonimi:

- **A — l'inventario.** *Cosa ci trovi.* Front-load sull'oggetto concreto.
  Rischio basso, informazione alta, personalità bassa. È l'evoluzione di ciò che
  gira oggi.
- **B — il lettore.** *In che stato sei tu.* È la risposta più diretta a «perché
  cambiare edizione», ed è la versione che il gate chiede letteralmente.
- **C — la regola della casa.** *Come ci comportiamo qui.* La più riconoscibile
  come Rodrigo & Betta, la più memorabile, la più rischiosa: se la regola non è
  vera al 100% diventa una bugia in testata su ogni pagina.

### Viaggiatori

| Ver.  | Frase                                                                              | Car.   |
| ----- | ---------------------------------------------------------------------------------- | ------ |
| **A** | «Posti particolari provati di persona: cosa abbiamo speso e come ci siamo andati.» | **80** |
| **B** | «Per chi deve ancora decidere dove andare: mete provate, costi in chiaro.»          | **72** |
| **C** | «Ci siamo andati prima noi — anche nei posti in cui eravamo ospiti.»                | **66** |

**Cosa cambia fra le tre.**

**A** tiene «posti particolari», che non è una perifrasi ma **la frase del
brand**: è nella bio Instagram verbatim, «POSTI PARTICOLARI IN TUTTO IL MONDO»
`[MISURATO: BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md:28]`. Sostituisce le due
superfici (mete, mappa) con due prove (la spesa, il come). Nota di onestà: dice
«cosa abbiamo speso», non «quanto costano» — perché il prezzo non c'è su ogni
scheda `[MISURATO: DESIGN_mappa-densita.md:382 — il rapporto è dichiarato al 73%]`,
e la home stessa si copre con «Costi in chiaro **dove li abbiamo pagati**»
`[MISURATO: BrandCoherentHero.tsx:197]`. «Quanto costano» prometterebbe un
prezzo su tutte e 79 le schede.

**B** è l'unica che nomina un momento della testa di chi legge — «deve ancora
decidere» — e per questo è l'unica che spiega davvero perché stare qui invece
che in Family. Costo: perde «posti particolari».

**C** rinuncia a elencare e afferma. Funziona perché è verificabile: 33 delle 79
schede hanno una collaborazione dichiarata, contate dal codice
`[MISURATO: BrandCoherentHero.tsx:33-36 — POSTI_PROVATI e CON_COLLABORAZIONE
sono calcolati sul registro, non scritti a mano]`. **Ma attenzione a dove
finisce**: nella fascia della home questa riga sta a poche centinaia di pixel
dall'h1, che già dice «Nessun posto consigliato da desk. Solo viaggi provati di
persona.» `[MISURATO: src/config/site.ts:63-64]`. Due volte la stessa
affermazione nello stesso schermo è lo stesso difetto di «Travellini Family»
accanto al marchio. La fascia però si comprime allo scroll
`[MISURATO: EditionBand.tsx:43-45]`, quindi le due frasi potrebbero non essere
mai in campo insieme. `[DEDOTTO. Si smentisce se: la sonda in browser mostra
che a fascia aperta l'h1 è già visibile — nel qual caso C non è utilizzabile su
Viaggiatori.]`

### Family

| Ver.  | Frase                                                                 | Car.   |
| ----- | --------------------------------------------------------------------- | ------ |
| **A** | «Gravidanza e viaggi: cosa ci è servito davvero, provato su di noi.»   | **66** |
| **B** | «Per chi viaggia mentre la famiglia cambia: quello che stiamo imparando.» | **71** |
| **C** | «Prima col pancione, poi col piccolo: come cambia il viaggio.»          | **60** |

**Cosa cambia fra le tre.**

**A** è la più vicina a ciò che la pagina contiene davvero: il seed family ha 8
voci, 6 in categoria `gravidanza`, e sono cose materiali — il volo al settimo
mese, la borsa per l'ospedale, i leggings premaman
`[MISURATO: src/data/family-content-seed.json:4-119]`. «Provato su di noi» non è
inventato: è la lingua che la pagina family già usa, «Consigli veri, provati su
di noi, senza filtri» `[MISURATO: src/config/siteContent.ts:464]`.

**B** è la più larga e l'unica che non nomini una fase. «Mentre la famiglia
cambia» copre gravidanza, nascita, primi mesi, secondo figlio, tutto. Costo:
perde la parola «gravidanza», che è la sola specifica del set e la sola per cui
qualcuno cerca su Google. Guadagno: non scade mai.

**C** è la risposta alla domanda 3 e la spiego lì sotto, perché è il punto più
delicato di tutto il documento.

### Collaborazioni

| Ver.  | Frase                                                                       | Car.   |
| ----- | --------------------------------------------------------------------------- | ------ |
| **A** | «Formati, media kit e come dichiariamo ogni collaborazione.»                 | **58** |
| **B** | «Per chi sta valutando un progetto con noi: formati, numeri, media kit.»     | **70** |
| **C** | «Scriviamo quello che vediamo, anche quando è pagato. Il resto nel media kit.» | **76** |

**Cosa cambia fra le tre.**

**A** toglie il doppione — non ricomincia con «Collaborazioni» — e sposta il peso
sull'unica cosa che un partner non trova ovunque: **come viene dichiarata**.
Vero e documentato: disclosure sempre dichiarata, iscrizione all'elenco AGCOM
`[MISURATO: src/config/site.ts:54-60]`.

**B** è la sola che nomini l'errand di chi arriva. «Sta valutando un progetto» è
onesto: non promette un listino (la pagina dice esplicitamente «tracce di
lavoro, non listini rigidi» `[MISURATO: siteContent.ts:395-396]`) e non promette
tempi. Ho scartato l'idea di mettere in testata le 48 ore di risposta dichiarate
sul media kit: una promessa di servizio su **ogni pagina del sito** è un impegno
diverso da una promessa dentro un modulo.

**C** è la più forte e la meno neutra. Dice al partner, prima ancora che apra la
pagina, dove sta il confine. È coperta dal repo su entrambi i lati: «libertà
editoriale» è già uno dei quattro passi del processo
`[MISURATO: siteContent.ts:368]` e il manifesto dice «non prendiamo compensi per
cambiare quello che scriviamo» `[MISURATO: site.ts:69]`. È anche la sola frase
del set che un partner ripeterebbe a voce a un collega — che è il test vero di
una riga di testata. È lunga 76 e ha due periodi: nel gate va benissimo, nella
fascia i due periodi su una riga sola stringono.

---

## 4. Sorelle o no

**Sorelle, ma non gemelle.** E l'invariante non è la sintassi.

L'argomento decisivo è meccanico, non estetico: **nel gate le tre righe si
leggono insieme, impilate, nello stesso riquadro**
`[MISURATO: AudienceGate.tsx:199-223 — le tre scelte in una griglia con gap-3]`.
Nella fascia invece se ne legge **una sola alla volta**
`[MISURATO: EditionBand.tsx:103-105 — rende solo la description corrente]`. Quindi
il set esiste come set in un solo posto, ma è il posto che uno sconosciuto vede
per primo.

Tre righe con sintassi identica lette in fila diventano un modulo da compilare.
Tre righe con ritmo scorrelato diventano tre siti incollati. La via di mezzo non
è un compromesso: è **tenere uguale il contratto e libero il ritmo.**

Il contratto — tre cose verificabili riga per riga:

1. **Apre con un sostantivo o con «Per chi», mai con un verbo all'imperativo.**
   Stessa regola già decisa per le voci di menu
   `[MISURATO: COPY_navbar-edizioni.md §1]`. Coerenza a costo zero.
2. **Contiene almeno una prova o un limite**, non un aggettivo. «Cosa abbiamo
   speso», «provato su di noi», «come dichiariamo»: ognuna nomina un
   comportamento che si può controllare.
3. **Sta sotto 80 caratteri** e i primi ~40 reggono da soli.

Quello che invece **deve** cambiare fra le tre è il ritmo, perché cambia lo
stato di chi legge: chi sogna un viaggio ha tempo, chi sta per partorire no, chi
valuta un contratto vuole il perimetro in tre parole. Family è la più corta di
tutte e tre le versioni proposte, e non è un caso.

**Un anti-pattern da evitare esplicitamente**: fare tutte e tre «Per chi…». Nel
gate diventa una litania, e nella fascia rende «Edizione Family — Per chi…»,
che è una costruzione storta (§2b). Al massimo **una** delle tre può usare
quella forma.

---

## 5. La riga che family può dire fra un anno

**Esiste. È C: «Prima col pancione, poi col piccolo: come cambia il viaggio.» (60 car.)**

Il meccanismo per cui funziona vale la pena dirlo, perché è riusabile:

> **Una fase scade. Un passaggio no** — perché appena è successo diventa la
> storia.

«— presto — col piccolo» è una **fase**: è una promessa con dentro un orologio, e
l'orologio è quasi scaduto. Il seed dice «36 settimane» pubblicato il
2026-07-18, e «Verso la data presunta del parto» il 2026-07-07
`[MISURATO: family-content-seed.json:39-63]`. Da lì a oggi sono passate più di
quattro settimane. **La riga in produzione promette come futuro qualcosa che è
probabilmente già presente o passato.**

`[VERIFY: se il bambino è nato. È l'unico fatto da cui dipende l'urgenza di
questa correzione, e nessun file del repo lo dice. Non lo deduco: lo chiedo.]`

«Prima col pancione, poi col piccolo» è invece un **passaggio**, ed è vera in
entrambi gli stati del mondo: oggi si legge come programma, tra sei mesi come
cronologia. Non richiede di sapere se il bambino è nato — che è esattamente la
proprietà che serve a una stringa di configurazione che nessuno andrà a
riguardare.

**Fin dove regge, detto senza sconti.** Regge finché «il piccolo» è piccolo:
diciamo due o tre anni `[DEDOTTO]`. Poi l'edizione parlerà di viaggi con un
bambino che cammina, e la riga andrà riscritta. **Non esiste una riga
permanente per family, e non perché sia scritta male: perché l'edizione è
definita da una vita che si muove.** Le altre due descrivono un mestiere, questa
descrive delle persone.

Questo non è un difetto da sanare. È il motivo per cui Family è l'unica delle
tre che suoni come qualcuno che parla. Ma comporta due cose operative, e vanno
messe in conto adesso:

1. **La riga family è manutenzione ricorrente, non copy definitivo.** Va messa a
   calendario come i prezzi delle guide, non trattata come costante.
2. **Se l'owner vuole zero manutenzione**, la scelta è B — «Per chi viaggia
   mentre la famiglia cambia» — e il prezzo è perdere la parola «gravidanza».
   È un prezzo reale: è la parola più specifica delle nove e la sola con
   intenzione di ricerca dietro.

---

## 6. Tre logiche per tre nomi: non è un problema, ma va detto perché

`Viaggiatori` nomina il lettore, `Family` un tema, `Collaborazioni` un tipo di
rapporto. Sulla carta è un'incoerenza di paradigma. In pratica no, e la ragione
è che **quei tre nomi non vengono mai letti come una declinazione grammaticale:
vengono letti come tre porte.** A una porta si chiede una cosa sola — che chi
passa ci si riconosca:

- «Viaggiatori» → *sono io.*
- «Family» → *è la mia situazione.*
- «Collaborazioni» → *è la mia commissione.*

Tre logiche perché ci sono tre modi diversi di riconoscersi. Uniformare costa
più di quanto renda, e si vede provando:

| Paradigma unico             | Set risultante                          | Cosa si rompe                                                                                                                                             |
| --------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tutti **lettori**           | Viaggiatori · Genitori · Brand          | «Genitori» esclude chi è incinta e non ancora genitore — cioè il pubblico attuale di Family. «Brand» è ambiguo: il nostro o il tuo?                       |
| Tutti **temi**              | Viaggi · Famiglia · Collaborazioni      | «Viaggi» su un sito di viaggi è un'etichetta nulla: nomina l'intero sito, non una sezione                                                                 |
| Tutti **tipi di rapporto**  | —                                       | non esiste un set pulito: «lettura» e «genitorialità» non sono rapporti                                                                                    |

Sul terzo nome c'è già una decisione dell'owner del 2026-08-17, presa contro la
raccomandazione di tenere «Brand» nel commutatore
`[MISURATO: audienceEditions.ts:20-24]`. **Non la riapro.** Anzi, la decisione
regge meglio di quanto il documento che la contestava sostenesse, proprio per il
motivo qui sopra: «Brand» era coerente come paradigma e ambiguo come porta, e
una porta ambigua è peggio di un paradigma misto.

`Family` in inglese in mezzo a due parole italiane è l'altra apparente stonatura,
ed è giustificata: è il nome pubblico reale del sub-brand, `@travellinifamily`
`[MISURATO: BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md:17]`. Tradurlo romperebbe
il riconoscimento fra Instagram e sito.

**Dove l'incoerenza va davvero pagata: nelle descrizioni.** Se i nomi usano tre
logiche, sono le tre righe sotto a dover restituire l'unità — ed è esattamente
il lavoro del contratto di §4. È il collegamento fra la domanda 4 e la domanda
2: non sono due problemi, sono lo stesso problema visto da due altezze.

**Una cosa che invece mi permetto di segnalare come difetto vero**, perché è
misurabile e non è opinione: la chiave interna dell'edizione è `'brand'` mentre
il nome pubblico è `Collaborazioni` `[MISURATO: audienceEditions.ts:42-44]`.
Documentato, quindi non è una svista. Ma significa che l'evento analytics
`audience_gate_select` spedisce `audience: 'brand'`
`[MISURATO: AudienceGate.tsx:164]`: chi leggerà quei dati fra sei mesi deve
sapere che `brand` = Collaborazioni. Non è lavoro mio — lo lascio a
`travellini-data-analyst`.

---

## 7. Il set che raccomando

**Prima, la raccomandazione strutturale**, perché cambia quale set ha senso.

Una stringa sola fa due lavori con due grammatiche diverse (§2b). La soluzione
pulita è **due campi invece di uno**:

```
description  → il gate: risponde a «Cosa ti porta qui?», può andare a capo
tagline      → la fascia: apposizione a «Edizione X —», una riga, mai un «Per chi»
```

Costo: un campo in `AudienceEditionChoice` e una riga in `EditionBand`. Non lo
faccio io — è di `travellini-frontend-builder` — e non lo do per scontato: è una
decisione dell'owner, perché aggiunge tre stringhe da mantenere invece di zero.

**Se si fa lo split:**

| Edizione       | `description` (gate)                                                      | `tagline` (fascia)                                                  |
| -------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Viaggiatori    | «Per chi deve ancora decidere dove andare: mete provate, costi in chiaro.» (72) | «Posti particolari provati di persona, con quanto abbiamo speso.» (63) |
| Family         | «Per chi viaggia mentre la famiglia cambia: quello che stiamo imparando.» (71) | «Prima col pancione, poi col piccolo: come cambia il viaggio.» (60)   |
| Collaborazioni | «Per chi sta valutando un progetto con noi: formati, numeri, media kit.» (70) | «Formati, media kit e come dichiariamo ogni collaborazione.» (58)     |

Nel gate i tre «Per chi» diventano una virtù invece che una litania, perché
rispondono in coro alla domanda che il gate ha appena fatto. Nella fascia
nessuna comincia con un verbo o con «Per chi», e ognuna sta in una riga.

**Se NON si fa lo split** (una stringa sola, raccomandazione di ripiego):

| Edizione       | Riga                                                                          | Car.   |
| -------------- | ----------------------------------------------------------------------------- | ------ |
| Viaggiatori    | «Posti particolari provati di persona: cosa abbiamo speso e come ci siamo andati.» | **80** |
| Family         | «Prima col pancione, poi col piccolo: come cambia il viaggio.»                 | **60** |
| Collaborazioni | «Formati, media kit e come dichiariamo ogni collaborazione.»                   | **58** |

Tutte e tre reggono in apposizione dopo «Edizione X —», tutte e tre stanno da
sole nel gate, nessuna apre con un verbo, ognuna porta una prova. Rispetto a
oggi: **−1 elenco di superfici, −1 doppione del nome dell'edizione, −1 scadenza
in testata.**

**Cosa non metterei in nessuno dei due set, e perché.** I numeri. «79 posti»,
«33 collaborazioni», «172K»: sono forti, sono veri, e in home sono **contati dal
codice**, non scritti `[MISURATO: BrandCoherentHero.tsx:33-36]`. Metterli in
`audienceEditions.ts` significa creare una copia a mano di un numero che altrove
si aggiorna da solo: il giorno dell'import successivo la home dice 91 e la
testata dice 79, su ogni pagina del sito. Un numero in una stringa di
configurazione è un debito con la data di scadenza già scritta.

---

## 8. Cosa resta aperto

### Decisioni dell'owner

1. **§7 — uno o due campi.** Una stringa per due sedi (zero costo, un compromesso
   grammaticale) oppure `description` + `tagline` (tre stringhe in più, ogni sede
   con il suo registro).
2. **§5 — family: specifica o durevole.** `C` tiene «pancione» e «piccolo» ed è
   vera prima e dopo la nascita, ma va rivista fra due o tre anni. `B` non scade
   mai e perde la parola «gravidanza».
3. **§3 — quanto affilare Collaborazioni.** `A` è informativa e neutra; `C`
   («anche quando è pagato») dichiara il confine in testata a ogni partner che
   arriva. È una scelta di posizionamento, non di lingua: se serve un parere,
   è di `travellini-growth-revenue-operator`.
4. **La riga family in produzione ha una scadenza in corso** (§5). Anche se non
   si decide niente d'altro, quel «— presto —» va guardato adesso.

### `[VERIFY]` aperti

- **Se il bambino è nato.** Determina l'urgenza del punto 4 e nient'altro
  (nessuna delle frasi proposte dipende dalla risposta — è progettato così).
- **La sonda di larghezza in browser** a 1024/1280/1440 su `/`, `/family`,
  `/collaborazioni`. Il tetto di 80 caratteri è mio e dedotto (§2).
- **Se la fascia e l'h1 della home sono in campo insieme.** Decide se la
  versione C di Viaggiatori ripeta la headline. Si guarda, non si deduce.

### Cose che non ho toccato e a chi vanno

| Cosa                                                                   | Chi                                    |
| ---------------------------------------------------------------------- | -------------------------------------- |
| Implementazione delle stringhe, eventuale campo `tagline`              | `travellini-frontend-builder`          |
| Forma della fascia se le righe cambiano lunghezza                      | `travellini-ui-designer`               |
| Meta, H1, schema — nulla di qui ci finisce                             | `travellini-seo-conversion-strategist` |
| `audience: 'brand'` negli eventi vs. nome pubblico «Collaborazioni»    | `travellini-data-analyst`              |
| Se Family debba avere un proprio regalo-in-cambio-di-email             | `travellini-growth-revenue-operator`   |
