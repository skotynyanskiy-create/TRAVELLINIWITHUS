---
title: DESIGN_mappa-densita
status: active
created: 2026-08-15
owner: travellini-ui-designer
slug: mappa-densita
type: design-reference
area: delivery
next: travellini-frontend-builder
---

# Mappa ad alta densità — direzione visiva

Non è un redesign. Fraunces, sabbia, terracotta, icone lucide, MapLibre +
OpenFreeMap, il cassetto scheda, i filtri e i preset restano **esattamente
come sono**. Cambia una cosa sola: **cosa fa la mappa quando i posti sono
tanti**.

## 0. Onestà sul metodo — leggere prima di fidarsi

**Non ho avuto strumenti browser in questa sessione.** Il mio toolset era
Read / Grep / Glob / Write: niente Bash, niente Playwright, niente
chrome-devtools. Non ho aperto `http://localhost:3000/mappa`, non ho provato
gli zoom, **non ho cliccato sulla sovrapposizione di Milano**. Il brief mi
chiedeva di farlo e non ho potuto: dirlo è meno costoso che consegnare numeri
inventati con l'aria di essere stati misurati.

Quello che segue è misurato **sul codice e sui dati**, con riga e file. La
geometria che ne ricavo si convalida da sola su un punto: calcolo che la
pillola sia **alta 30px**, e il `browser-auditor` in browser ne ha misurati
**30**. Le due strade indipendenti danno lo stesso numero, quindi il modello
geometrico che uso sotto regge.

Tre cose restano scoperte e sono marcate `[VERIFY]` nel testo: cosa risolve
davvero un tap sulla sovrapposizione, il costo reale in frame durante il pan,
e l'API `icon-text-fit` di MapLibre 5.24.

---

## 1. La diagnosi in quattro numeri

### 1.1 La pillola è larga fino a 165px e alta 30

`[MISURATO: src/components/map/FullScreenMapExperience.tsx:729-740]`

| parte              | classe               | px          |
| ------------------ | -------------------- | ----------- |
| padding orizzontale | `px-3`               | 12 + 12     |
| icona              | `size={13}`          | 13          |
| gap                | `gap-1.5`            | 6           |
| testo              | `max-w-[120px]`      | fino a 120  |
| bordo              | `border`             | 1 + 1       |
| **larghezza max**  |                      | **165**     |
| padding verticale  | `py-1.5`             | 6 + 6       |
| riga di testo      | `text-xs`            | 16          |
| bordo              |                      | 1 + 1       |
| **altezza**        |                      | **30**      |

Selezionata: `border-2` + `scale-110` → **~182px**.

`anchor="bottom"` `[riga 703]` centra la pillola sul punto: ogni pin **occupa
±82px orizzontali** attorno alla propria coordinata. Due nomi non si toccano
solo se distano ≥165px in orizzontale **oppure** ≥30px in verticale.

### 1.2 A vista iniziale sette pin di Milano stanno in 2,1 × 2,1 px

`[MISURATO: src/data/content-seed.json, righe 364, 396, 428, 2511, 2731, 2859, 3961]`

| posto              | lat        | lng       |
| ------------------ | ---------- | --------- |
| Lievità            | 45.456789  | 9.183012  |
| Azabu              | 45.464222  | 9.191926  |
| Lievità Sottocorno | 45.466055  | 9.210881  |
| Sleppa             | 45.470130  | 9.204217  |
| (riga 2859)        | 45.477287  | 9.170728  |
| Wagyu Oh           | 45.482127  | 9.178698  |
| (riga 3961)        | 45.485454  | 9.182270  |

Riquadro: **0,0402° lng × 0,0287° lat**.

MapLibre lavora a tile 512: la larghezza del mondo è `512 · 2^z` px, quindi
`px/grado lng = 1,4222 · 2^z` e `px/grado lat = 1,4222 · 2^z · sec(45,47°) =
2,028 · 2^z`.

- **z 5,2** — la vista iniziale `[MISURATO: riga 685]`: il riquadro è
  **2,1 × 2,1 px**. Aggiungendo Albairate (8.930712) e San Donato (9.265481)
  sono **9 pin in 17,5 × 4,4 px**. È esattamente ciò che il `browser-auditor`
  ha visto: otto pillole fra x=420 e x=450.
- **z 11** — il preset «Milano» `[MISURATO: riga 55]`: il riquadro diventa
  117 × 119 px. La coppia più stretta (Wagyu Oh / riga 3961) dista **10,4 px
  in orizzontale e 13,8 in verticale**. Due pillole larghe fino a 165 e alte
  30: **completamente sovrapposte**. Il preset dedicato a Milano non risolve
  Milano.
- **soglia reale** per quella coppia: **z ≥ 12,12** per staccarsi
  verticalmente, **z ≥ 14,97** per staccarsi orizzontalmente.
- `handlePinClick` vola a **z 12,5** `[MISURATO: riga 241]` → 39 px verticali,
  sopra soglia. **Dopo aver cliccato si legge; prima di cliccare no.** La
  mappa è leggibile solo dove sei già stato.

### 1.3 Il corpus non è denso: è concentrato

`[MISURATO: src/data/corpus-places.json]` — 624 voci, di cui **120 con
`"amministrativo": true`** (non sono punti, sono etichette tipo «Italia»).
Conteggi diretti: **Milano 49 · Roma 31 · Verona 20 · Lombardia 166 ·
Veneto 72**.

`[MISURATO: docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md:100-102]`
— la ripartizione ufficiale dei 545 con indirizzo preciso, 399 italiani:

> Lombardia 147, Veneto 62, Emilia-Romagna 48, Piemonte 35, Trentino 13 —
> **305 su 399**. Campania 15, Calabria 5, Sicilia 2, Puglia 1.

**Quattro posti italiani su cinque stanno in cinque regioni contigue.** La
mappa non diventerà «piena»: diventerà una macchia sulla Pianura Padana e un
foglio vuoto sotto Roma.

`[DEDOTTO]` A z8 la Lombardia occupa circa 1056 × 985 px. 147 pillole da
165 × 30 sono 727.650 px² di sola etichetta contro 1.040.160 px² di canvas:
**il 70% della regione coperto di testo** (51% se la larghezza media è 120px
invece del massimo). *Si smentisce se:* la geocodifica dei 147 li distribuisce
fuori dal riquadro che ho assunto (8,5–11,4 lng · 44,7–46,6 lat) — cambia la
percentuale, non il verdetto.

### 1.4 Il tetto non esiste, e il DOM lo paga due volte

`[MISURATO: righe 695-783]` — ogni pin monta: marcatore MapLibre, wrapper,
anello di pulsazione, pillola, `svg` lucide con i suoi figli, `span` del nome,
**e un tooltip nascosto** che contiene un `OptimizedImage` → `<picture>` +
2 `<source>` + `<img>` `[MISURATO: src/components/OptimizedImage.tsx:184-189]`.

**~17-19 nodi DOM per pin**, di cui **circa 8 sono il tooltip che nessuno sta
guardando**. Oggi ≈1.850 nodi; a 545 pin ≈**9.300**.

`[DEDOTTO]` MapLibre riscrive il `transform` di ogni marcatore a ogni evento
`move`: a 545 pin sono 545 scritture di stile per frame durante il pan.
*Si smentisce se:* un profilo Performance mostra il costo dominante altrove
(decode delle tile, raster del globo) e non in `Marker._update`.

Il repo ha già il precedente giusto:
`[MISURATO: src/components/home/HomeMapLibreBackground.tsx:9]`
`const HOME_MAP_PIN_LIMIT = 28`. La home si è data un tetto. `/mappa` no.

---

## 2. Il principio: il punto non è l'etichetta

Oggi **la pillola È il pin**. Non c'è nient'altro: niente puntino, niente
stelo, niente ancora visibile. Quando due pillole si sovrappongono non
perdi solo il nome — **perdi la posizione**. Non sai più quale pillola sta
dove, e la mappa smette di essere una mappa.

Da qui in poi valgono due oggetti separati:

- **Il punto** — 10px, sempre visibile, sempre esattamente sulla coordinata.
  Dice *dove*. Non si nasconde mai, non collide mai (10px si toccano ma
  restano leggibili come un grappolo di punti, che è un'informazione onesta).
- **L'etichetta** — la pillola col nome, satellite del punto, offset in alto.
  Dice *cosa*. **Si guadagna**, non si eredita: compare solo se c'è posto.

Questo scioglie la tensione del brief. La domanda era: «la pillola col nome è
una scelta di brand, ma a 624 il nome è illeggibile comunque». La risposta è
che il nome non sparisce — **cambia granularità**:

| zoom      | cosa nomina la mappa | esempio         |
| --------- | -------------------- | --------------- |
| basso     | il territorio        | «Lombardia 147» |
| medio     | la città             | «Milano 56»     |
| alto      | il posto             | «Wagyu Oh»      |

**A ogni zoom la mappa dice un nome vero, mai «c'è qualcosa qui».** La
promessa di brand è intatta; è la scala che si muove.

---

## 3. D1 — Cosa diventa un pin, a quale zoom

Due regole **indipendenti**, ciascuna con un compito solo. È importante che
restino due: una soglia unica non può governare Milano e le Lofoten insieme.

### Regola A — la soglia decide gruppo o pin

| tier             | zoom       | cosa si vede                                                              |
| ---------------- | ---------- | ------------------------------------------------------------------------- |
| **Territorio**   | z < 8,5    | Solo dischi per **regione** (Italia) o **paese** (estero). Nessun pin.    |
| **Area**         | 8,5 ≤ z < 12 | Dischi per **città**. I posti soli nella loro città sono pin, non dischi. |
| **Posto**        | z ≥ 12     | Solo pin individuali. Nessun disco.                                       |

Il taglio a **12** non è arrotondato a occhio: è la soglia misurata in §1.2
(z 12,12) sotto la quale la coppia più stretta di Milano non si stacca
nemmeno in verticale. Sopra 12 i pin hanno statisticamente spazio; sotto,
mai.

Il taglio a **8,5** è dove il preset regionale della UI già lavora — i preset
Toscana/Puglia/Dolomiti sono a z9 `[MISURATO: righe 52-59]`. Sopra il preset
vedi le città, sotto vedi le regioni: la soglia cade dove l'utente già passa.

**Un gruppo da 1 non è un gruppo.** Un posto solo nella sua città o regione si
disegna come pin con nome a qualunque zoom. Altrimenti la Norvegia diventa un
disco con dentro «1», che è il modo più veloce di far sembrare vuota una mappa
che vuota non è.

### Regola B — la collisione decide se il pin ha il nome

Sopra z12 **tutti** i pin del viewport sono punti. Il nome si assegna così:

1. Ordina i pin per distanza dal centro della mappa (chi guardi conta di più).
2. Per ciascuno, proietta la coordinata con `map.project()` e costruisci il
   rettangolo dell'etichetta: `larghezza ≈ 43 + min(120, 7 × lunghezza del
   titolo)`, `altezza 30`, offset sopra il punto.
3. Assegna il nome **solo se** il rettangolo non tocca nessuno di quelli già
   assegnati **e** il budget non è esaurito. Altrimenti resta punto.

**Budget dei nomi** (questo è il numero che tiene la pagina calma):

| viewport   | nomi simultanei | perché                                            |
| ---------- | --------------- | ------------------------------------------------- |
| ≤ 375px    | **3**           | 375 / 165 = 2,3 pillole affiancate. Oltre 3 è muro |
| 376–1023px | **5**           |                                                   |
| ≥ 1024px   | **8**           | 1280 / 165 = 7,7 affiancate                       |

Il nome resta **sempre** sul pin selezionato, fuori budget, e sul pin sotto il
puntatore. Su questi due la collisione non si applica: sono la risposta a un
gesto, non decorazione.

### Perché due regole e non una

La soglia da sola lascia 56 pin di Milano tutti con il nome a z12: il muro
torna. La collisione da sola lascia 545 punti addosso alla Pianura Padana a
z5: illeggibile e pesantissimo. Servono entrambe, e ognuna risolve un
problema che l'altra non tocca.

---

## 4. D2 — Che aspetto ha un gruppo

**Cluster per luogo, non per pixel.** Il raggruppamento non è geometrico: usa
`item.place.city` e `item.place.region`, che sono **già nel dato**
`[MISURATO: src/data/content-seed.json:360-362]`. Il disco si posiziona sul
centroide dei suoi membri.

È una scelta di brand, non solo di tecnica: un grappolo geometrico produce
«17» in mezzo al nulla; un grappolo amministrativo produce «Milano 56». Il
primo è un algoritmo che si vede, il secondo è un indice.

### Anatomia del disco

```
        ╭──────╮
        │  56  │   ← disco: bg nero/85, bordo terracotta 1,5px,
        ╰──────╯     numero bianco, sans bold, tabular-nums
         MILANO    ← nome sotto: 10px, uppercase, tracking .16em,
                     var(--color-accent-text)
```

- **Fondo `bg-black/85`, bordo `--color-accent` 1,5px.** Stesso vocabolario
  della pillola esistente `[riga 732: border-white/30 bg-black/85]`: il gruppo
  e il pin devono sembrare parenti, non due sistemi.
- **Numero nel sans, non in Fraunces.** Il serif è dei titoli; i conteggi nel
  sito sono già sans `[MISURATO: righe 632, 644]`. Fraunces a 12px dentro un
  disco da 40 non si legge e sembra un errore.
- **Tre misure discrete, non un'area proporzionale.** 32px (2-9) · 40px
  (10-49) · 48px (50+). Il cerchio proporzionale è una convenzione da
  data-viz: legge come dashboard, e le dashboard sono vietate.
- **Nessuna icona di categoria dentro il disco.** Due motivi. Uno di forma:
  l'icona costringe il numero a rimpicciolirsi e il disco diventa affollato.
  Uno di verità: «l'icona dominante» su 56 posti al 51% food **afferma una
  cosa falsa** su Milano. Il gruppo risponde a *quanti*, non a *che tipo*.
  Che tipo lo dicono i filtri, che esistono già.
- **Il nome sta sotto il disco, sempre.** È il nome, non il conteggio, a
  tenere in piedi la promessa editoriale. Se manca il nome (città non
  risolta), il disco non si disegna: quei posti restano pin.
- **Nessuna pulsazione, nessun `animate-pulse`.** L'anello che pulsa
  `[riga 719-725]` su un pin selezionato è un feedback; moltiplicato per 30
  dischi è rumore. I dischi sono fermi.

### Area di tocco

Il disco da 32px ha un'area trasparente da **44 × 44**. È il minimo tattile e
i dischi piccoli sono i più numerosi.

---

## 5. D3 — Cosa succede al tap

| oggetto                         | tap                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------ |
| **Disco** (normale)             | `flyTo` sui bounds dei membri, `padding 80`, durata 1200ms, `pitch` invariato. |
| **Disco** (zoom non separa)     | Apre **l'elenco laterale già esistente**, filtrato su quei membri.             |
| **Punto** senza nome            | Come oggi: `handlePinClick` → cassetto scheda `[riga 811]`.                    |
| **Punto** con nome              | Identico. Il nome non cambia il comportamento, solo la leggibilità.            |

Tre precisazioni che valgono più della tabella.

**Niente popover nuovo.** Il cassetto di riga 811 è già il popover di un
posto. Aggiungerne un secondo per i gruppi produce schede dentro schede, che
`DESIGN.md` vieta esplicitamente.

**Niente ragnatela.** Il cluster che esplode a raggiera è un idioma da Google
Maps: sembra un controllo, e i controlli finti sono fuori dal brand. Lo zoom
è la lingua nativa della mappa: si usa quella.

**Il caso terminale conta.** Se due posti hanno lo stesso indirizzo, zoomare
non li separa mai e il tap diventa un gesto morto: il disco resta lì e non
succede niente. Regola: se i bounds dei membri, proiettati al max zoom,
restano sotto 40px, **non zoomare — aprire l'elenco**. L'elenco è già
costruito, già accessibile, e ha già `handlePinClick` sulle righe
`[MISURATO: righe 656-675]`. Zero componenti nuovi.

`[VERIFY]` Cosa risolva **oggi** un tap sulla sovrapposizione di Milano non
l'ho potuto provare. `[DEDOTTO]` dal codice: `.maplibregl-marker` ha un
`transform`, che apre uno stacking context; quindi le classi `z-10`/`z-30`
interne `[righe 731-732]` **non escono dal proprio marcatore**. Fra marcatori
decide l'ordine nel DOM, cioè l'ordine di `filteredItems`. Se è così,
**delle 8 pillole di Milano ne è cliccabile una sola** — sempre la stessa — e
le altre 7 sono raggiungibili solo da tastiera o dall'elenco. *Si smentisce
se:* maplibre-gl 5.24 assegna un `z-index` dinamico ai marcatori (basta
leggere lo `style` inline di due `.maplibregl-marker` sovrapposti).

Conseguenza indipendente dalla densità, da correggere comunque: **il pin
selezionato va renderizzato per ultimo** nell'array dei marcatori. Oggi
`scale-110` e il bordo bianco `[riga 731]` possono finire dietro un vicino, e
il feedback della selezione si perde proprio dove serve.

---

## 6. D4 — Filtri ed elenco laterale

### Un numero solo, tre posti

La mappa non deve mai mostrare un conteggio che smentisce i due già in pagina
`[MISURATO: riga 632 «{filteredItems.length} posti» e riga 644 «Destinazioni
Provate ({filteredItems.length})»]`. **I dischi contano gli item filtrati,
non tutti.** Un disco «Milano 56» con i filtri su «Hotel» mente.

### L'elenco è l'altra metà del problema, e nessuno l'ha guardata

`[MISURATO: riga 656]` — l'elenco fa `filteredItems.map` **senza tetto**. A
545 posti sono 545 bottoni in un contenitore scrollabile: a ~76px l'uno,
**oltre 41.000px di scroll**. Non è una lista, è un pozzo. Arriva con lo
stesso corpus e non ha nessuna difesa, esattamente come i pin.

**Direzione: l'elenco mostra ciò che è in vista.** Non è un ripiego, è la cosa
più forte che una UI di mappa possa fare — lega la lista alla mappa nei due
sensi. E risolve i 545 bottoni gratis.

Serve una distinzione netta nello stato, che è anche la trappola da evitare:

| insieme         | contenuto                        | chi lo usa                                             |
| --------------- | -------------------------------- | ------------------------------------------------------ |
| `filteredItems` | filtri (zona/tipo/budget/cerca)  | il conteggio riga 632, **e «Sorprendimi»** `[riga 304]` |
| `visibleItems`  | `filteredItems` ∩ bounds attuali | marcatori, dischi, elenco laterale                      |

**«Sorprendimi» deve restare sull'insieme filtrato.** Se lo si lega al
viewport, sorprende con quello che hai già davanti — il bottone perde
esattamente il suo senso. È il tipo di regressione che si scopre tre
settimane dopo.

`visibleItems` si ricalcola su `moveend` (non su `move`), con debounce 150ms.

### Copy

- Riga 644: `Destinazioni Provate (N)` → **`In vista · N posti`**.
  Tre ragioni: «Destinazioni Provate» è Title Case, che in italiano non
  esiste; «Provate» ripete «Provato di persona» del cassetto `[riga 919]`; e
  soprattutto **quel titolo diventa falso** quando la lista è legata al
  viewport.
- Riga 632 resta sui filtri ma va disambiguata: **`634 posti con questi
  filtri`**. Così i due numeri possono legittimamente divergere e si capisce
  perché, invece di sembrare un bug.
- **Manca lo stato vuoto** `[MISURATO: righe 655-676, nessun controllo su
  `length`]`. Con l'elenco legato alla vista, spostarsi sul mare dà zero
  risultati e un pannello bianco. Serve:
  «Qui non siamo ancora stati. Sposta la mappa o togli un filtro.» con un
  bottone che chiama `resetView` `[riga 312]`, che esiste già.

### La testata mente su una scala diversa

`[MISURATO: riga 392]` — «{allItems.length} posti che abbiamo visitato di
persona, {completeCount} con la scheda completa».

`[MISURATO: 110 item nel seed, 31 con "isPlaceholder": true]` → oggi 109
posti / 79 schede complete: **73%**, e la frase regge. A ×6, con le schede
complete ferme a 79, diventa 654 / 79: **12%**. La stessa frase passa da
«quasi tutte pronte» a «un archivio di segnaposti». Il commento alle righe
385-390 dice che quella riga esiste per chiudere una frattura di credibilità:
al nuovo rapporto **la riapre**. Va rivista insieme all'import, non dopo.

---

## 7. D5 — Il tetto di rendering

**Il disegno da solo non basta.** Raggruppare senza tagliare per viewport
monta comunque tutti i membri fuori schermo: si guadagna in leggibilità e non
si guadagna niente in DOM.

Il tetto è quindi **esplicito e dichiarato**, non un effetto collaterale:

```
Mai più di 60 marcatori DOM montati insieme.
Di questi, al massimo 8 portano un nome (5 tablet, 3 mobile).
Se un viewport ne risolverebbe più di 60 → si raggruppa di più,
non si renderizza di più.
```

Perché 60 regge: un disco è **~4 nodi** (marcatore, wrapper, cerchio, nome)
contro i ~17-19 di un pin completo. 60 dischi ≈ 240 nodi. Anche nel caso
peggiore — z12 su Milano, 56 pin tutti in vista — con 8 nomi e 48 punti si
sta sotto i 400 nodi, contro i ~9.300 di oggi proiettati a 545.

Due interventi che vanno fatti **comunque**, indipendenti dalla direzione
scelta, perché tagliano il costo per marcatore alla radice:

1. **Il tooltip non può stare dentro ogni marcatore.** `[righe 743-779]` sono
   ~8 dei ~17 nodi per pin, per un elemento che è `hidden` finché non ci passi
   sopra. Va sollevato a **un solo componente** pilotato dallo stato di hover.
   **Da solo dimezza il DOM per pin**, prima ancora di raggruppare.
2. **Il pin selezionato per ultimo nell'array** (vedi §5).

---

## 8. Le due strade — decisione da prendere sapendo il prezzo

Il brief pone la scelta come «GeoJSON o niente». È più aperta di così, e per
una ragione che va detta subito perché cambia il calcolo:

> **Passare a GeoJSON non fa perdere il nome.** Un symbol layer ha
> `text-field`, e con `text-allow-overlap: false` + `text-optional: true`
> MapLibre **nasconde da sé le etichette che collidono e tiene l'icona**:
> è la Regola B di §3, gratis e fatta meglio di qualunque cosa scritta a mano.
> Anche la pillola è riproducibile, con uno sprite stirabile e
> `icon-text-fit`. `[VERIFY: confermare icon-text-fit e sprite stretchable su
> maplibre-gl 5.24 con context7 — se l'API non c'è, la pillola diventa un
> alone di testo e la stima cambia]`

Quello che si perde con GeoJSON non è il nome: è **l'albero di
accessibilità**. Un layer non produce nodi DOM, quindi **zero elementi
focalizzabili**. Sparisce anche il lavoro di riga 706-711, che assegna
a mano un `aria-label` parlante a ogni marcatore. La mappa diventa un unico
controllo e l'elenco laterale diventa **l'unica** superficie accessibile.

### Confronto

| | **B — Marker DOM raggruppati** *(raccomandata)* | **A — Layer GeoJSON** |
| --- | --- | --- |
| Pillola col nome | identica, è lo stesso JSX | ricostruita con sprite `[VERIFY]` |
| Decluttering | scritto a mano, ~25 righe | nativo MapLibre, migliore |
| Albero a11y | conservato, da 545 a ~60 nodi | **azzerato** |
| `aria-label` riga 706-711 | resta | **si perde** |
| Tooltip con copertina | resta React, sollevato a uno | resta React, su `queryRenderedFeatures` |
| Dipendenze nuove | **zero** (raggruppo per città/regione) | zero |
| Righe toccate | ~695-783 + stato viewport | 695-783 riscritte + sprite + hit-testing |
| Selettori e2e | intatti | da rifare `[MISURATO: e2e/visual-quality.spec.ts:6, e2e/wcag-responsive-check.spec.ts]` |
| Tetto DOM | **va imposto a mano** (§7) | risolto per costruzione |
| Tenuta oltre ~1.500 pin | da verificare | certa |

### Raccomandazione

**B adesso.** Risolve il 90% del problema a una frazione del costo, non tocca
il linguaggio visivo, non rompe i test, e **non smonta l'accessibilità per
un corpus che è ancora un file in attesa**. Il raggruppamento per città e
regione non richiede `supercluster`: i campi ci sono già nel dato, e produce
nomi veri invece di baricentri geometrici.

**A resta l'endgame**, e va aperta quando si verifica una di queste due —
non prima:

- il pan a 545 pin resta scattoso **dopo** aver applicato §7 (misurabile: se
  il frame supera 16ms con 60 marcatori, il problema non è il DOM ed è A);
- il corpus supera ~1.500 posti, o le etichette continuano a litigare oltre
  z14 dove la Regola B ha poco margine.

---

## 9. Decisioni che restano all'owner

Le lascio decidibili, non decise.

**D1 — Il taglio a z12 fra dischi e pin.**
È misurato, non arbitrario (§1.2), ma è tarato su Milano.
`a)` z12 come proposto — Milano corretta, i borghi mostrano dischi più a lungo
del necessario. `b)` z11 — i pin arrivano prima ovunque, Milano resta
illeggibile fra 11 e 12. `c)` soglia per città in base ai membri — corretta
ovunque, ma è uno stato in più da mantenere.
*Raccomando `a`. `c` è ottimizzazione prematura su un corpus non ancora
importato.*

**D2 — Il budget dei nomi su mobile: 3.**
`a)` 3 — calmo, molti punti anonimi. `b)` 5 — più informazione, le pillole si
toccano (375/165 = 2,3 affiancate). `c)` 0 su mobile, il nome solo su tap —
massima pulizia, ma la mappa diventa muta finché non la tocchi.
*Raccomando `a`.*

**D3 — La camera iniziale.**
`[MISURATO: riga 685]` la vista apre su `[12,5 · 42,0] z5,2`, cioè il Lazio.
Il baricentro del corpus è al Nord: 305 posti italiani su 399 fra Lombardia,
Veneto, Emilia, Piemonte e Trentino. **La mappa si apre puntata sulla parte
più vuota del proprio archivio**, e a ×6 il difetto si moltiplica.
`a)` lasciare — copre bene anche i 144 posti in 26 altri paesi.
`b)` spostare a `[10,5 · 45,0] z6` — apre sulla densità vera, sacrifica la
vista europea. `c)` `fitBounds` sugli item filtrati al primo load — sempre
corretta, ma l'inquadratura cambia a ogni cambio di filtro e si perde il
gesto d'apertura.
*Non raccomando: dipende se `/mappa` è «l'Italia dei posti particolari» o
«il mondo». È posizionamento, non layout.*

**D4 — Cosa fa il disco quando lo zoom non separa** (§5).
`a)` elenco filtrato — riusa quello che c'è. `b)` zoom al massimo e basta —
niente da costruire, ma il tap muore in silenzio. *Raccomando `a`.*

---

## 10. Cosa NON cambia — perimetro chiuso

Da non toccare, in nessuna delle due direzioni:

- Fraunces, sabbia, terracotta, `--color-accent*`, icone lucide.
- MapLibre + OpenFreeMap, `projection="globe"`, `pitch`, i tre stili.
- La barra dei controlli, i preset, «Sorprendimi», «Vicino a me», l'audio.
- Il cassetto scheda `[riga 811]` e tutto il suo contenuto.
- I deep-link `?posto=<id>` `[righe 260-269]` — **il deep-link deve
  continuare a funzionare quando il posto è dentro un gruppo**: `handlePinClick`
  vola a z12,5, che è sopra la soglia dischi/pin, quindi funziona già. Da
  tenere d'occhio se D1 sceglie `b`.
- `MAP_LOCALE`, la testata, l'`h1` «Dove siamo stati davvero».
- La regola di verità delle immagini: nessuna copertina generata.

---

## 11. Verifiche aperte per chi implementa

1. `[VERIFY]` Aprire `/mappa`, zoom di default, cliccare sull'ammasso di
   Milano: quale posto si apre? Ripetere tre volte — se è sempre lo stesso,
   §5 è confermato e le altre 7 pillole sono morte al tocco.
2. `[VERIFY]` `icon-text-fit` + sprite stirabili su maplibre-gl 5.24
   (`context7`). Riguarda solo la direzione A.
3. `[VERIFY]` Profilo Performance del pan a 109 pin, oggi. Se
   `Marker._update` non domina, la stima di §1.4 va rifatta prima di usarla
   come argomento.
4. `[VERIFY]` **I 545 si sommano ai 109 o li sostituiscono?** La spec dice
   «640 luoghi distinti, 76 già in registro → 564 nuovi»
   `[docs/superpowers/specs/2026-08-14-…:49-50]`, ma `corpus-places.json`
   ne conta 624 con 120 amministrativi. Il totale finale sta fra 545 e ~673 e
   **non è ancora un numero solo**. Il budget di §7 regge in tutto
   l'intervallo, ma la riga di testata (§6) cambia parecchio.
5. Dopo l'implementazione: `npm run audit:ui`, `npm run audit:visual`, e una
   passata a 375 **e** 1280 con lo screenshot allegato al PR.

---

## 12. Consegna

Prossimo: `travellini-frontend-builder`.
File: `src/components/map/FullScreenMapExperience.tsx` (righe 179-201 per lo
stato, 640-678 per l'elenco, 695-783 per i marcatori).

Bloccanti prima di scrivere codice: **D1, D2, D4** (§9). D3 è indipendente e
può viaggiare da sola.

Da fare comunque, anche se le decisioni slittano — sono correzioni, non
densità:

1. Sollevare il tooltip fuori dai marcatori (§7.1) — dimezza il DOM per pin.
2. Renderizzare il pin selezionato per ultimo (§5) — la selezione smette di
   nascondersi dietro un vicino.
3. Stato vuoto dell'elenco (§6).
