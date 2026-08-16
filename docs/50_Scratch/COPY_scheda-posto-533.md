---
type: content-brief
area: delivery
status: done
created: 2026-08-15
from: travellini-seo-conversion-strategist
slug: scheda-posto-533
related:
  - '[[50_Scratch/DESIGN_scheda-posto-533]]'
  - '[[50_Scratch/HANDOFF_scheda-posto-533_ui-designer_to_seo]]'
tags:
  - copy
  - seo
  - posto
---

# `/posto/:slug` — le stringhe della variante C

D1 è chiuso: **C — il limite**. `practical.toKnow` esce da «Prima di andare» e
diventa un blocco proprio, subito dopo la descrizione. Nessun campo nuovo,
nessun arretrato.

Questo documento consegna quattro cose e nient'altro: il titolo del blocco, il
verdetto su `site.ts:66`, la regola dello stato vuoto, il contratto schema.org.
**Non tocco codice.** `src/pages/Posto.tsx` è in lavorazione da un altro agente
mentre scrivo.

## Come sono prodotte le misure

- `[MISURATO: <file:riga>]` — contato o letto nel codice di questo branch.
- `[DEDOTTO]` — calcolato, con la condizione che lo smentisce.
- `[VERIFY: …]` — non verificato, e non stimato.

Le misure nuove di questo documento, tutte su `src/data/content-seed.json`:

| fatto                                              | valore                | come                                            |
| -------------------------------------------------- | --------------------- | ----------------------------------------------- |
| array `toKnow` nel seed                            | **49**                | `[MISURATO: grep "toKnow" → 49]`                |
| blocchi `practical`                                | **79**                | `[MISURATO: grep '"practical": {' → 79]`        |
| schede `isPlaceholder: true`                       | **31**                | `[MISURATO: grep → 31]`                         |
| `gettingThere`                                     | **43**                | `[MISURATO: grep → 43]`                         |
| `when` / `duration`                                | **4 / 1**             | `[MISURATO: grep → 5 occorrenze totali]`        |
| blocchi `checked` con data                         | **78**, tutti `2026-08-15` | `[MISURATO: grep -o '"at": "20..-..-.."' → 78 righe, un solo valore distinto]` |
| `toKnow` con **una sola** voce                     | **38 su 49**          | `[MISURATO: conteggio delle 49 array]`          |
| `toKnow` con due voci                              | **11 su 49**          | idem — nessuna array ne ha tre                  |
| `checked.source` che contiene una parentesi        | **3**                 | `[MISURATO: righe 1633, 3292, 3466]`            |

`79 practical + 31 placeholder = 110`, cioè il totale delle schede misurato dal
designer. **Ne segue che i 31 placeholder non hanno `practical`, quindi non
hanno `toKnow`.** `[DEDOTTO: si smentisce se una scheda placeholder ha
`practical` e una scheda reale non ce l'ha — la somma tornerebbe uguale. Vale la
pena controllarlo prima di usare il 62% qui sotto in una decisione.]`

Da cui i due denominatori onesti, che vanno tenuti distinti:

- **49 / 110 = 44,5%** su tutte le schede del seed;
- **49 / 79 = 62,0%** sulle schede reali — cioè quelle indicizzabili, perché i
  placeholder sono `noindex` `[MISURATO: src/pages/Posto.tsx:142]`.

Per una promessa pubblica il denominatore giusto è il secondo: nessuno promette
qualcosa a nome di pagine che chiediamo a Google di non leggere.

---

## 1. Il titolo del blocco

### Cosa deve reggere davvero il titolo

Ho letto tutte e 49 le voci. Non sono una cosa sola. Si raggruppano così:

| famiglia                              | esempio verbatim dal seed                                                                 | quante |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| chiusure e finestre di apertura       | «Chiuso il lunedì e apre solo dal pomeriggio.» `[content-seed.json:3547]`                   | ~20    |
| omonimie e sedi da distinguere        | «Haru ha più sedi in Lombardia: questa è quella di Como.» `[:1593]`                         | ~9     |
| prenotazione (obbligatoria o assente) | «Non accetta prenotazioni: si entra e basta.» `[:1851]`                                     | ~7     |
| chi può entrare / com'è dentro        | «Solo maggiorenni: un minore entra unicamente accompagnato…» `[:2055]`                      | ~4     |
| biglietti e come si comprano          | «I biglietti si comprano solo dai canali ufficiali…» `[:2399]`                              | ~3     |
| dotazioni e permessi                  | «Animali ammessi.» `[:27]` · «Accessibile in sedia a rotelle, con parcheggio gratuito.» `[:2827]` | ~4 |
| geografia reale dell'attività         | «L'indirizzo è quello della sede a Lucca: le discese si fanno sul torrente Lima, altrove.» `[:2237]` | ~3 |

`[MISURATO: lettura delle 49 array. Il raggruppamento è mio e alcune voci
stanno a cavallo di due famiglie: i «~» sono lì apposta.]`

Tre conseguenze che il titolo deve rispettare, e che escludono da sole metà dei
candidati:

1. **Non sono tutti limiti.** «Animali ammessi», «Ha una spiaggia privata
   attrezzata», «Accessibile in sedia a rotelle» sono permessi e dotazioni. Un
   titolo che dice «i limiti» sarebbe falso su ~4 schede oggi e su un numero
   ignoto a 533.
2. **Sono quasi sempre uno solo.** **38 su 49** hanno una voce sola. Un titolo
   al plurale — «Cose da sapere», «I limiti», «Le regole» — è sbagliato sul
   **78%** delle schede che il campo ce l'hanno.
3. **Non sono tutti istruzioni.** «Haru ha più sedi in Lombardia» non dice a
   nessuno cosa fare: dice qual è il posto. Un titolo imperativo o
   pre-partenza («Prima di prenotare», «Come funziona») non le accoglie.

### Le tre opzioni

#### Opzione 1 — «Cosa sapere prima» ← **la mia scelta**

Neutro rispetto alla famiglia (accoglie chiusure, omonimie, permessi, biglietti),
neutro rispetto al numero (regge con una voce e con due), e colloca
l'informazione nel momento in cui vale: **prima**. Su «Chiuso il lunedì» quel
«prima» è tutto il valore della riga — saperlo il martedì mattina in macchina non
è la stessa cosa che saperlo la domenica sera.

In più: `site.ts:66` dice già «cosa sapere prima di andarci». Con questo titolo
la home nomina un blocco che esiste con quelle parole, invece di descrivere una
sensazione. È il caso raro in cui la coerenza non costa niente.

Contro, dichiarato: sfiora «Prima di andare», il blocco che resta sotto. Ho
misurato quanto: **3 schede su 110** — vedi §1-bis. È un costo reale e piccolo.

#### Opzione 2 — «Da sapere»

È letteralmente l'etichetta di oggi `[MISURATO: PrimaDiAndare.tsx:64]`. Costo di
migrazione zero, rischio zero, nessuna parola nuova da approvare.

Perché la scarto: oggi funziona perché è **annidata** dentro «Prima di andare»,
che le fornisce il quando. Promossa a titolo di blocco autonomo perde quel
contesto e diventa un'etichetta d'archivio: dichiara che le righe meritano
attenzione, non quando servono. Se il senso della promozione è che quelle righe
**cambiano programma**, il titolo deve dire quando cambiano programma. «Da
sapere» guadagna una posizione e perde l'unica informazione che quella posizione
doveva far emergere.

#### Opzione 3 — «Prima di andarci»

Mette il momento e taglia due parole. È anche la forma più parlata delle tre —
la frase che diresti a un amico.

Perché la scarto, due ragioni:

- è un **doppione frontale** di «Prima di andare», non un'assonanza. Due titoli
  a distanza di uno scroll che differiscono per una sillaba costringono a
  rinominare l'altro blocco, e rinominare un blocco per far posto a un titolo è
  un costo che l'opzione 1 non ha;
- promette istruzioni di partenza, e ~9 voci su 49 sono invece identificazioni
  («questa è la sede di Como»). Su quelle il titolo prometterebbe un'azione e
  consegnerebbe un'anagrafica.

### Scartate senza arrivare in finale, e perché

| candidato                       | muore su                                                                    |
| ------------------------------- | --------------------------------------------------------------------------- |
| «I limiti»                      | «Animali ammessi.» `[:27]` — un permesso non è un limite                    |
| «Cose da sapere»                | 38 schede su 49 hanno una voce sola: il plurale è falso sul 78%             |
| «Quello che non trovi nel reel» | 31 schede non hanno reel: il titolo rimanderebbe a un blocco assente        |
| «Prima di prenotare»            | un borgo e una passeggiata panoramica non si prenotano                      |
| «Prima di metterti in macchina» | Shanghai Disneyland `[:2397]`, Kuala Lumpur `[:3713]`, Cancún `[:2013]`     |
| «Come funziona»                 | non funziona su «Chiuso il lunedì», che è la famiglia più numerosa (~20)    |
| «Note pratiche»                 | collide con la card «Info pratiche» che sta 200px sopra, ed è burocratico   |
| «Attenzione»                    | allarme su una riga che spesso è una buona notizia                          |

### La prova su cinque tipi diversi

Il vincolo era «provala su almeno tre tipi». Ne uso cinque, con il testo reale.

| tipo di posto      | voce `toKnow` verbatim                                                                                    | «Cosa sapere prima» regge? |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | -------------------------- |
| hotel-spa          | «Animali ammessi.» + «La grotta e la spa si usano a turni privati, non in comune.» `[:27-28]`               | sì — permesso + regola d'uso |
| ristorante         | «Chiuso il lunedì e il martedì.» `[:888]`                                                                   | sì — è esattamente questo  |
| parco acquatico    | «Il biglietto è separato da quello di Europa-Park: sono due ingressi distinti.» `[:1447]`                    | sì — sorpresa di costo evitata |
| hotel di catena    | «A Cancún ci sono più hotel Riu: questo è l'Hotel Riu Cancún, da non confondere con i Riu Palace.» `[:2014]` | sì — identificazione       |
| attività all'aperto | «L'indirizzo è quello della sede a Lucca: le discese si fanno sul torrente Lima, altrove.» `[:2237]`        | sì — logistica che salva la giornata |

Nessuno dei cinque richiede una parola diversa. È il test che «I limiti» e
«Prima di prenotare» non passano.

### Le stringhe, pronte

```
Titolo del blocco:      Cosa sapere prima
Elemento:               <h2> con lo stile eyebrow (10px, bold, uppercase,
                        tracking 0.22em, --color-accent-text)
Icona:                  Info (lucide) — già nell'icon lock, §11 del design
Sottotitolo:            nessuno
Testo introduttivo:     nessuno
Punteggiatura aggiunta: nessuna
```

Tre note per chi implementa:

- **`<h2>`, non `<p>`.** Il precedente in repo è già giusto: `PrimaDiAndare.tsx:37-42`
  usa un `h2` vestito da eyebrow, con `aria-labelledby`. Un blocco che entra
  nella colonna di lettura con un titolo proprio deve stare nell'outline, o il
  gate a11y ≥ 0,95 si mangia il vantaggio.
- **Niente punteggiatura dal componente.** Le voci nel seed sono già frasi
  chiuse con il punto `[MISURATO: lettura delle 49 voci]`. Un componente che
  aggiunge «·» o «;» produrrebbe «Chiuso il lunedì.·».
- **A 38 schede su 49 il blocco è una sola frase.** Una card con eyebrow, icona,
  bordo e padding attorno a una riga è molto contorno per poco contenuto:
  segnalato al designer, non deciso qui.

---

## 1-bis. Cosa succede a «Prima di andare» — due effetti collaterali da non scoprire dopo

Non fanno parte delle quattro consegne, ma nascono dalla promozione e chi
implementa li incontra comunque.

### a) La collisione di titolo è misurabile e piccola

Tolto `toKnow`, `PrimaDiAndare` renderizza il proprio `h2` solo con ≥2 righe fra
`gettingThere`, `duration` e `when` (regola §3 del design). Oggi succede su
**3 schede**: `[MISURATO: content-seed.json:3246-3248, 3885-3887, 4009-4011]`.
Su tutte le altre il blocco è una riga sola senza titolo, e i due titoli non si
vedono mai insieme. **La collisione non giustifica un rename.**

### b) La riga di provenienza rischia di sparire su ~33 schede — questo sì è un problema

`PrimaDiAndare` restituisce `null` quando non ha né righe né `toKnow`
`[MISURATO: PrimaDiAndare.tsx:30]`, e la riga «Dati cercati su … · ultima
verifica: …» vive dentro quel `return` `[MISURATO: PrimaDiAndare.tsx:80-85]`.

- schede con `checked`: **78**
- schede con almeno una riga fra `gettingThere` / `duration` / `when`: **45**
  (43 `gettingThere` + 2 schede che hanno solo `when` — `[:1530]` e `[:3840]`)

Se `toKnow` esce e nient'altro cambia, su **~33 schede** la provenienza dei dati
sparisce dalla pagina. `[DEDOTTO: assume che ogni scheda con `gettingThere` abbia
anche `checked`. Si smentisce se non è così — nel qual caso il numero sale, non
scende.]`

Il danno non è estetico: è il pezzo che rende credibile un orario di chiusura
scritto da noi, e va con il dato che qualifica. **Il campo `toKnow` è al 100%
figlio di quella ricerca: tutte le 78 date `checked` valgono `2026-08-15`, cioè
una sola passata di ricerca.**

Regola di copy, per il builder — la stringa non cambia, cambia dove vive:

```
Testo:     Dati cercati su {source} · ultima verifica: {mese anno}
Dove:      una volta sola per pagina, sotto l'ultimo blocco pratico che
           renderizza — «Cosa sapere prima» se «Prima di andare» è assente,
           altrimenti in fondo a «Prima di andare»
Quando:    mai da sola. Se non renderizza né «Cosa sapere prima» né «Prima di
           andare», la riga non esiste: «dati cercati» senza dati mostrati è lo
           stesso errore di «Orari e contatti» senza orari né contatti
```

### c) Tre `checked.source` stampano una nota di lavorazione su pagina pubblica

`[MISURATO: content-seed.json:1633, 3292, 3466]`

| oggi                                                                                              | proposto                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `parchionline.it · iparchidivertimento.it (il sito ufficiale non risponde alle richieste automatiche)` | `parchionline.it · iparchidivertimento.it` |
| `burpple.com · guide.michelin.com (fonti in disaccordo sugli orari)`                                 | `burpple.com · guide.michelin.com`          |
| `enjoyhousebracciano.com (il sito respinge le richieste automatiche: dati dalle sue pagine pubbliche)` | `enjoyhousebracciano.com`                  |

Quelle parentesi raccontano al lettore come si è comportato il nostro scraper.
Nel secondo caso l'informazione utile c'è già dove serve — la stessa scheda ha
`toKnow`: «Apre solo di giorno e le fonti non concordano sugli orari: conviene
telefonare prima di andare.» `[MISURATO: :3289]` — quindi in `source` è un
doppione oltre che una nota interna.

**Regola che scala a 533: `checked.source` è un elenco di domini, non un diario
di lavorazione.** Se l'import scrive le fonti con lo stesso stile, oggi sono 3 e
domani sono decine.

---

## 2. `site.ts:66` — la riga regge. Non toccarla.

Testo attuale `[MISURATO: src/config/site.ts:65-66]`:

> Siamo Rodrigo e Betta. Viaggiamo in coppia per scovare borghi conservati,
> dimore di charme e trattorie locali. Ti diciamo quanto si spende davvero, cosa
> sapere prima di andarci e quali sono i limiti.

### Verifica, promessa per promessa

| promessa                       | campo che la mantiene                       | copertura        | regge? |
| ------------------------------ | ------------------------------------------- | ---------------- | ------ |
| «quanto si spende davvero»     | `value.price` (30/110) · `value.budget` (51/110) | 27% · 46%   | debole, e **non per colpa di C** |
| «cosa sapere prima di andarci» | `practical.toKnow` → il blocco «Cosa sapere prima» | 49/79 = 62% | sì, e da oggi è il **nome** del blocco |
| «quali sono i limiti»          | `practical.toKnow`, famiglia limiti          | ~35 voci su 49   | sì     |

Su «i limiti»: contando le voci che possono fermare o rovinare una visita —
chiusure, prenotazione obbligatoria, «Solo maggiorenni», «non è una cena
tranquilla», «Il biglietto è separato» — arrivo a **~35 su 49**. Le altre ~14
sono omonimie, permessi e dotazioni. `[MISURATO: classificazione mia sulla
lettura delle 49 voci; le voci di confine le ho contate come limite quando
possono far cambiare giorno o programma.]`

**Verdetto: la riga è vera. Non la riscrivo.** Riscrivere una riga di home che
funziona è lavoro sprecato e un rischio di conversione senza contropartita.

### L'unica cosa che dichiaro, perché il brief la chiede

Con C, «cosa sapere prima di andarci» e «quali sono i limiti» **puntano allo
stesso campo**. Non è una bugia — è una ridondanza: la frase elenca tre cose e
la pagina ne ha due. Non basta a giustificare una modifica, perché il triplo non
è un indice della pagina, è il registro del sito (prezzo, avvertenze, vincoli).
Lo scrivo qui perché sia una decisione presa, non una svista scoperta dopo.

### La soglia che l'handoff chiede — un numero, non «quando saranno tutti»

**La riga resta onesta finché `practical.toKnow` è compilato su almeno il 50%
delle schede pubblicate e indicizzabili.** Oggi: **62%**.

Perché 50 e non altro: chi arriva dalla home apre una o due schede, non venti.
A metà copertura, chi ne apre due incontra il blocco con probabilità 75%
`[DEDOTTO: 1 − 0,5²; si smentisce se le schede aperte non sono indipendenti dal
campo — ad esempio se i posti in evidenza sono sistematicamente i più
compilati, e allora la probabilità reale è più alta]`. Sotto il 50%, la
sessione mediana non incontra mai ciò che la home ha promesso, e la promessa
diventa una descrizione di qualcosa che il lettore non ha visto.

### L'allarme vero, ed è più grosso della riga

**Tutte le 78 date `checked` valgono `2026-08-15`.** Il 62% di copertura di
`toKnow` non è un sottoprodotto della scrittura: è l'output di **una singola
passata di ricerca**, fatta oggi, sui siti dei locali.

Le 533 schede in arrivo si derivano dalle caption, e una caption non contiene i
giorni di chiusura. Se l'import parte senza ripetere quella passata,
`toKnow` non resta al 62%: crolla verso lo zero sulle nuove, e la copertura
complessiva scende sotto la soglia il giorno stesso del deploy.

Cioè: la tesi «arretrato zero, per costruzione» della variante C è vera solo se
la passata di arricchimento viaggia **insieme** all'import, non dopo.

**Per l'owner, secco:** la ricerca fonti-per-scheda fa parte del batch di import
o è un secondo giro? Se è un secondo giro, `site.ts:66` va riletta al momento
della pubblicazione delle 533, non oggi.

**Suggerimento operativo, non specifica:** il conteggio si può misurare invece
che ricordare — è lo stesso mestiere che fa già `npm run stato:check`.
`[VERIFY: non ho controllato se `scripts/` ha già un contatore per campo su cui
appoggiarsi.]`

### `site.ts:67` — «Raccomandarne meno. Ma raccomandarli davvero.»

**Resta onesta. Chiudo la questione.** Il paragone implicito è con gli
aggregatori, non con la nostra dimensione di ieri: 533 schede contro i milioni
di TripAdvisor restano «meno», e la frase parla di selezione, non di conteggio.

Due avvertenze che lascio scritte:

- La riga sotto — «Ogni scheda nasce da un viaggio fatto insieme»
  `[MISURATO: site.ts:69]` — è quella che porta il peso fattuale, e a 533 diventa
  un'affermazione su 533 viaggi. `[VERIFY: che tutti i luoghi importati vengano
  da reel girati da loro due, e non da contenuti in collaborazione o da uno solo
  dei due. Non lo so e non lo stimo.]`
- «Viaggiamo in coppia per scovare borghi conservati, dimore di charme e
  trattorie locali» `[MISURATO: site.ts:66]` descrive un corpus che a 533 non
  esiste più: dentro ci sono Shanghai Disneyland `[:2397]`, Rulantica `[:1447]`,
  un Warner Bros Studio Tour `[:1809]`, il flyboard `[:1532]`, il rafting
  `[:2237]`, catene di sushi `[:1721]`. **Questo non è un effetto di C ed è
  fuori dal mio incarico**: la promessa la deve rivedere chi possiede la home,
  quando arrivano le 533. Lo segnalo perché è la parte di quella riga che
  invecchia per prima — molto prima de «i limiti».

---

## 3. Il vuoto — confermato, e nessuno inventi un fallback

`toKnow` manca su **61 schede su 110** (30 sulle 79 reali).

**Quando `practical.toKnow` è assente o è un array vuoto, il blocco non si
renderizza affatto.** Niente titolo, niente card, niente bordo, niente icona,
niente spazio riservato.

Questo è già il comportamento corretto del codice di oggi
`[MISURATO: PrimaDiAndare.tsx:58 — `daSapere.length > 0 &&`]` e va portato tale
e quale nel blocco nuovo.

### Stringhe che NON devono esistere

Nessuna di queste va scritta, in nessuna variante, in nessun commento «per
ora»:

- «Nessuna nota disponibile»
- «Non ci sono informazioni particolari da segnalare»
- «Niente da sapere prima»
- «Aggiorneremo presto questa sezione»
- «—» / «n.d.» / «Da verificare»
- uno scheletro, un placeholder grigio, o una card vuota

### Perché, in tre righe

1. **Il modello lo dice**: «ogni campo è opzionale, e vuoto è uno stato
   legittimo» `[MISURATO: src/types/content.ts:66]`, e «un campo in più che
   nessuno riempie non è neutro — fa sembrare la scheda incompleta invece che
   essenziale» `[MISURATO: content.ts:69-71]`.
2. **Il precedente è in repo**: «Orari e contatti» si intitola su dati che non ha
   ed è il difetto n. 1 del caso povero (design §2). Un placeholder qui sarebbe
   lo stesso errore, appena rifatto.
3. **Il conto**: un fallback verrebbe stampato **61 volte oggi** e un numero
   ignoto di volte a 533. Non è una frase, è una proprietà del sito — e la
   proprietà sarebbe «questo sito ha dei buchi».

**Nota CLS**: l'assenza non deve riservare spazio. Il gate è bloccante a
CLS ≤ 0,1 e questa pagina sta per esistere in 533 esemplari.

---

## 4. Il contratto schema.org — **no, `placeReviewSchema.ts` non cambia**

### La risposta, verificata sul codice

`src/lib/placeReviewSchema.ts` non legge `practical` da nessuna parte.
`buildItemReviewedJsonLd` legge `item.place` e `item.types`
`[MISURATO: placeReviewSchema.ts:82-115]`; `buildReviewJsonLd` legge
`item.publishedAt` e riceve `reviewBody` dal chiamante
`[MISURATO: :123-133]`. **Promuovere `toKnow` è uno spostamento di layout: stesso
dato, altra posizione. Schema.org descrive l'entità e la recensione, non
l'ordine delle sezioni.** Il file non si tocca.

### L'unica decisione che la promozione riapre davvero (e la chiudo)

Non è nel modulo: è nel **chiamante**, `Posto.tsx:127` —
`buildReviewJsonLd(item, item.description)`. Con `toKnow` promosso a blocco
visibile, qualcuno sarà tentato di appenderlo al `reviewBody`.

**Non farlo.** Tre ragioni, in ordine di peso:

1. **Provenienza sbagliata.** `reviewBody` è attribuito a
   `author: { '@type': 'Organization', name: 'Travelliniwithus' }`
   `[MISURATO: :128]`. `toKnow` viene dalla ricerca fonti: **78 blocchi `checked`
   datati tutti 2026-08-15**. Metterlo nel corpo della recensione significa
   firmare come nostro giudizio ciò che abbiamo letto sul sito del locale.
2. **Volatilità.** Un giorno di chiusura cambia e il corpo della recensione
   cambia con lui. Una recensione che muta con gli orari di apertura non è una
   recensione.
3. **Zero guadagno.** Qui non c'è rich result da attivare: per scelta il file
   rifiuta `reviewRating` e `aggregateRating` `[MISURATO: :117-122]`. Allungare
   `reviewBody` con testo operativo non compra niente e diluisce il resto.

**Contratto confermato, invariato:**

```
@type            Review
inLanguage       it-IT
author           Organization · Travelliniwithus
reviewBody       item.description  ← invariato
datePublished    item.publishedAt (se esiste)
itemReviewed     buildItemReviewedJsonLd(item)
voto             NESSUNO — né reviewRating né aggregateRating, per scelta
                 (self-authored su attività terza)
```

Una riga in più, perché l'handoff la chiedeva: **un `Review` il cui `reviewBody`
è una descrizione neutra è difendibile.** `Review` non richiede un voto e
`reviewBody` è definito come il corpo effettivo della recensione; un testo
nostro, pubblicato da noi, su un posto dove siamo stati, è esattamente quello.
La condizione che conta è che il testo sia **visibile in pagina**, e lo è
`[MISURATO: Posto.tsx:334-338]`.

### Due trappole da non aprire — segnalate perché la promozione le rende attraenti

- **`openingHours` derivato da `toKnow`.** «Chiuso il lunedì» sembra pronto per
  un `OpeningHoursSpecification`. Non lo è: sappiamo il giorno di chiusura, non
  gli orari di apertura. Emetterlo significherebbe inventare precisione — lo
  stesso errore che il file ha già rifiutato per `sameAs` `[MISURATO: :65-69]`.
- **`acceptsReservations` derivato da `toKnow`.** Il corpus contiene sia «Non
  accetta prenotazioni: si entra e basta» `[:1851]` sia «Si entra solo su
  prenotazione» `[:678]`. Ricavarne un booleano richiede di leggere prosa libera
  su 533 schede, e un parsing sbagliato pubblica un'affermazione **falsa e
  leggibile da una macchina** su un'attività di terzi. Se un giorno serve, è un
  campo nel modello, non un parser.

### Un buco che esiste già, e non è colpa di C

`place.hours` è compilato su 28 schede, è **renderizzato in pagina**
`[MISURATO: Posto.tsx:294-298]` e **non arriva mai allo schema**:
`buildItemReviewedJsonLd` emette indirizzo, telefono, geo e url, niente orari.
È la stessa classe di problema che il 2026-08-15 ha portato ad aggiungere
`streetAddress` e `telephone` `[MISURATO: placeReviewSchema.ts:91-97]` — «un
sito che vende informazione pratica la stava tenendo fuori dallo strato in cui
l'informazione pratica viene letta».

Lo segnalo, **non lo risolvo qui**: la soluzione onesta parte da `place.hours`
(testo strutturabile, es. «Mar-Dom 19:00-23:00»), non da `toKnow`. Va deciso
insieme al backend, dopo l'import.

---

## 5. Cosa non ho scritto

L'handoff del designer chiedeva anche cose che questo incarico non include, e
che restano aperte: le label degli altri blocchi («Il reel girato qui», «Orari e
contatti su Google», microcopy degli altri stati vuoti) e i **pattern di `title`
e `description` meta parametrici su 533 schede**, con i tre casi resi.

Il secondo è il più urgente dei due: oggi il meta title è
`` `${item.hook} — ${item.title}` `` `[MISURATO: Posto.tsx:132]`, e su 533 schede
un hook lungo produce title troncati in SERP senza che nessuno se ne accorga.
Va fatto prima della pubblicazione, non dopo.

## Cosa non ho verificato

- `[VERIFY]` che nessuna scheda `isPlaceholder: true` abbia `practical`. La
  somma 79 + 31 = 110 lo suggerisce ma non lo prova, e da lì dipende il 62%.
- `[VERIFY]` che ogni scheda con `gettingThere` abbia anche `checked` — da cui
  dipende il «~33» di §1-bis(b).
- `[VERIFY]` se l'import delle 533 include la passata di ricerca fonti. È la
  domanda da cui dipende se `site.ts:66` resta vera dopo il deploy.
- `[VERIFY]` che tutti i 533 luoghi vengano da reel girati da entrambi — vedi
  `site.ts:69`.
- Non ho misurato nulla in browser: questo documento non contiene numeri di
  runtime.
