---
title: HANDOFF_webapp-travelliniwithus_ui-designer-catalogo79_to_frontend-builder
status: open
created: 2026-09-29
from: travellini-ui-designer
to: travellini-frontend-builder
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: A3 (salto di livello dopo il giudizio dell'owner su A2: «è proprio una bozza semplice»)
consumes:
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-raffinamento_to_frontend-builder.md (A2: sostituito dove qui è detto, valido altrove)
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_owner_sintesi-R2.md
---

# Handoff: A3, l'Atlante tascabile con tutti i 79 posti. Idea, sistema, schermate, specifica

Documento in un repo pubblico. I nomi dei posti citati sono solo tra i 79 visibili del sito.
Nessun id di post, nessuna coordinata, nessun indirizzo. I soli numeri di fatto sono quelli del
brief del main thread (79 posti, conteggi per paese, zona, regione, categoria, dichiarazione,
copertura dei campi) e quelli letti in `content-seed.json` di BEST (formati di `price`,
`budget`, `hook`). Tutto il resto è misura di progetto (px, ms) oppure `[VERIFY]`.
Contrasti calcolati a mano con la formula WCAG 2.x: da confermare con axe.

Abbreviazioni per le catture: `A2/NN` = `SCRATCH/prototipi/A2/shots/NN-*-390.png` (o
`-1440`), `B/NN` = `SCRATCH/prototipi/B/shots/`, `SITO/NN` = `SCRATCH/shots/`, `PROVINO` =
`SCRATCH/confronto/catalogo-79.png`, `CARTIGLI` = `SCRATCH/confronto/cartigli.png`.
`SCRATCH` = `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad`.

---

## Per l'owner, in una pagina

**In una frase.** A2 era un plastico con sei casette. A3 è la città intera: 79 posti veri e
un'app costruita per reggerne il peso e farvelo sentire appena si apre.

**Cosa vedrete di diverso**

1. **La Home fa una domanda e poi vi mostra tutto.** In alto c'è un vostro fotogramma a tutta
   larghezza. Sopra, nel punto dove il reel stampa il titolo, c'è la sua domanda riscritta da noi
   («Dormiresti in una gabbia?»). Sotto arriva la risposta: «Posti che sembrano inventati. Ma
   esistono davvero.» Scendendo trovate il **provino**: tutti i fotogrammi dell'archivio in un
   colpo d'occhio, dal più recente al primo. Sul computer il provino *è* la Home: circa 70
   fotogrammi nel primo schermo, il titolo incastonato dentro e una **lente** che ingrandisce
   quello su cui passate.
2. **Il vostro cartiglio diventa la firma dell'app.** Il riquadro bianco con la domanda, che
   su Instagram vi riconoscono, lo tagliamo dalla foto e lo ricomponiamo in pagina, pulito, nello
   stesso punto. Chi arriva da un reel si sente a casa. Chi arriva da Google legge un testo vero.
3. **Esplora ha porte colorate e pillole.** Ci sono sei porte con una foto e un colore (Food,
   Insolito, Hotel con carattere, Posti particolari, Relax, Weekend romantici) e pillole per
   zona, regione e budget. La griglia alterna foto piccole e foto grandi, e le grandi portano la
   loro domanda.
4. **La mappa regge 79 punti.** Raggruppa per regione («Lombardia 21»), si avvicina con un tocco
   e ha tre tavole fuori d'Italia: Europa, Asia, Americhe. Resta una carta disegnata da noi, con
   i punti al loro posto e senza confini inventati.
5. **Nessuna scheda sembra vuota.** Tre prove ci sono sempre: la data del reel, il controllo e a
   che titolo ci siete andati. Il prezzo, quando c'è, compare grande. Quando manca lo diciamo una
   volta sola, in fondo, con il sito dove chiederlo. Addio al «non ancora» ripetuto.
6. **«Vicino a questo».** Da ogni posto vedete i più vicini con i chilometri veri, in linea d'aria.
7. **Il rullino dei mesi.** Da maggio 2024 ad agosto 2026, mese per mese, come un diario. Il
   nome del mese è scritto enorme e in corsivo. I mesi senza schede restano bianchi, e lo diciamo.
8. **Più scala e più coraggio.** Titoli molto più grandi, foto a filo schermo, fasce di colore
   per le categorie, e una sola fascia scura dove si guarda un reel.

**Perché non sarà più una bozza**
- Ogni schermata è piena di contenuto vero: nessuna griglia da 6, nessuna carta con 5 punti.
- Ogni schermata ha un'idea e un momento grande, visibile anche da ferma in una cattura, non
  solo nel movimento.
- La scala tipografica ha contrasto: si passa da 12 a 96 px, non più da 13 a 38.
- Cinque momenti-firma, e due nascono dall'archivio: la lente sul provino e il volo dalla carta
  alla scheda.
- Controlli automatici su tutti e 79 i posti, non su uno di esempio.

**Cosa non cambia.** Fraunces e Inter, la sabbia, la terracotta, le foto vere, le icone lucide,
la barra a 5 voci. Niente feed, autoplay, storie o pop-up, e nessun contatore da dashboard.

**Cinque decisioni vostre** (nessuna blocca il primo giro; trovate la mia raccomandazione
sotto, alla fine):
1. i colori di tre categorie nuove (Hotel con carattere, Posti particolari, Weekend romantici);
2. l'elenco delle copertine da tenere fuori dai posti in evidenza (sezione «Da far confermare
   all'owner»);
3. una fascia scura per pagina, solo dove si guarda un reel;
4. un peso più leggero di Fraunces (360) per i titoli molto grandi;
5. le diciture di «a che titolo» (per esempio «Nessuna collaborazione» per i posti organici).

**Il primo giro** costruisce: i 79 posti, la Home con provino e lente, il cartiglio ricomposto,
Esplora con porte e pillole, la scheda nuova, la mappa a gruppi con le tavole estere, la
ricerca e i tre momenti già approvati. **Il secondo giro** aggiunge il rullino dei mesi, la lente
che filtra l'archivio, il volo dalla carta alla scheda, le raccolte condivisibili, Noi con le
lenti e le tre idee avanzate.

---

## Why this work matters

L'owner ha giudicato A2 corretto ma povero. La causa principale è la scala: sei posti su 79. Ma
anche il mio sistema era prudente, e con sei posti la prudenza è diventata vuoto. A3 deve
sembrare un prodotto finito e ambizioso con i dati veri, restando Travelliniwithus. Questa
consegna dà al costruttore un'idea per ogni schermata, un sistema tipografico e cromatico alzato
di livello e criteri verificabili con Playwright su tutti i 79 posti.

## Decisions already made (bloccate: il builder non le rinegozia)

1. **Direzione A, edizione completa.** Tutti i 79 posti visibili, sempre. Nessuna schermata
   pensata per un sottoinsieme.
2. **Il cartiglio ricomposto** (§3) è il dispositivo tipografico dell'app: la domanda del reel
   (campo `hook`, alla lettera) in un riquadro sabbia, in cima al fotogramma, dove il reel stampa
   il suo.
3. **Il cartellino** (§4) sostituisce l'«ossatura fissa» di A2. Ha tre celle sempre piene
   (Reel, Controllato, A che titolo) e la riga «Quanto» solo se c'è un dato. «Non ancora» resta
   solo per l'unico posto senza controllo.
4. **Home = una domanda, poi l'archivio intero** (§5.1). Il provino è il cuore della Home.
5. **Pillole orizzontali e porte per immagini** in Esplora (§5.2). Correggo la mia regola «niente
   chip-filtro» (§1.3).
6. **Mappa a gruppi per regione** con ingrandimento e **quattro tavole** (Italia, Europa, Asia,
   Americhe), senza contorni e senza tessere prima del consenso (§5.4).
7. **Scheda desktop a colonna fotografica** (foto 5:7 alta tutto lo schermo a sinistra, testo a
   destra). Via la copertina 16:9 e via il banco a tre riquadri in Esplora. Il banco resta solo
   sulla Mappa (§1.3).
8. **Una sola fascia scura per pagina**, solo dove il soggetto è un reel (locandina, blocco «Il
   reel» in fondo alla scheda).
9. **Evidenza vietata** per le copertine dell'elenco «Da far confermare all'owner» (§12): mai
   come eroe, lente, porta, tessera grande o copertina di mese finché l'owner non conferma.
10. **Date:** la data è sempre quella di pubblicazione del reel. Si scrive «reel del…», «reel
    di…» o «reel usciti a…», mai «ci siamo stati», «visitato» o «a che mese andarci».
11. **Hash a un solo token** per le rotte (§9.0). Niente librerie, rete, geolocalizzazione o
    login.
12. **Copy provvisorio.** Tutti i testi qui sono provvisori. La parola finale spetta a
    seo-strategist; le diciture di «a che titolo» vanno verificate da seo e legale (B5).

---

## Context the receiver needs

### 0. Diagnosi: dove quella del main thread regge, dove sbaglia, cosa mancava

**Verdetto su A2 come prodotto: Block. Vedi 1 blocker e 7 serious.** Come direzione, A resta
confermata.

| # | Punto del main thread | Il mio giudizio |
| --- | --- | --- |
| 1 | 6 posti su 79 | **Giusto, ed è la causa principale.** Però non basta versare 79 posti nei layout di A2, perché ogni componente era dimensionato su 6: la carta senza gruppi, la griglia senza ritmo né filtri, la Home con un solo posto. Serve un sistema che cambia forma con la scala (§5). E «5 schede su 6 non scritte» non era vero dei dati: il controllo c'è su 78 posti su 79. Era la mia ossatura a mettere in vetrina ciò che mancava |
| 2 | Sistema timido | **Giusto.** Le regole mie che l'hanno prodotta sono elencate al §1.3, con il motivo |
| 3 | Firme invisibili nelle catture | **Giusto**, e aggiungo la causa: in A2 nessuna firma lasciava un segno a riposo. In A3 ogni firma ha uno stato fermo visibile (il cartiglio, l'angolo del retro, la lente) e le catture includono fotogrammi a metà transizione |
| 4 | Nessuna profondità | **Giusto.** Adesso i dati per le relazioni esistono (i 4 più vicini con i km, le categorie multiple, le date). Mancava anche la profondità materiale: carta, inchiostro, timbro e sovrapposizioni |
| 5 | La Home senza idea | **Giusto.** L'idea è al §5.1 |

**Cosa la diagnosi non ha visto (e che cambia il progetto)**

- **La «domanda di una parola» non è una domanda di una parola.** In `CARTIGLI` si vede che la
  scritta stampata è un cartiglio su più righe: il nome in maiuscoletto, poi la domanda su 2-3
  righe, un filetto e il luogo. Nel `PROVINO`, che taglia la parte alta, si legge solo l'ultima
  riga: «ROMANTICO?» è la coda di «DOVE PASSARE UN WEEKEND ROMANTICO?», «TEMA?» di «SUITE A
  TEMA?». Non tutte sono domande: «LA COSTA DEGLI DEI» non lo è. Inoltre il testo stampato **non
  coincide sempre** con il campo `hook`. Per l'Emotional Grand Motel il reel stampa «SUITE A
  TEMA?», mentre il dato dice «Dormiresti in una gabbia?». Se estraessimo «una parola» la
  inventeremmo. Il dispositivo deve quindi usare l'`hook` intero, alla lettera, e ricomporre la
  *forma* del cartiglio, non il suo testo (§3).
- **I protagonisti sono nelle foto.** In quasi ogni copertina del `PROVINO` compaiono Betta o
  Rodrigo. A2 le ha trattate come foto di luoghi. Il provino intero è già un ritratto della coppia
  («provati di persona» dimostrato in un colpo d'occhio). È la prova di presenza più forte che il
  sito abbia, e per questo diventa la Home.
- **Il colore lo portano già le foto.** Il `PROVINO` è violento di colore: rossi, magenta, piscine
  blu, verdi. Più coraggio non vuol dire interfaccia colorata attorno a foto colorate. Vuol dire
  fasce piene e intenzionali (categorie, inchiostro, carta) in zone senza foto, e intorno alle
  foto sabbia e inchiostro.
- **I dati hanno forme irregolari.** `price` è testo libero: «8€», «da 98€/notte», «Pranzo da
  19,90€ · Cena da 35,90€», «All you can eat: pranzo feriale 16€ · weekend 21€ · cena 30€» e
  perfino «Prezzo variabile per stanza», che non è un prezzo. `budget` vale «Basso», «Medio» o
  «Alto». Il layout deve reggere tutte le forme (§4).
- **I mesi sono 28, non 27.** Dal 3 maggio 2024 al 10 agosto 2026 passano 27 mesi, ma i mesi di
  calendario toccati sono 28 (da maggio 2024 ad agosto 2026 compresi). Nel copy pubblico non
  si scrive nessun numero di mesi: si scrive l'intervallo, «da maggio 2024 ad agosto 2026».
- **Probabile errore nei dati delle regioni.** Il Granduca ha `region: "Emilia Romagna"` senza
  trattino, mentre gli altri hanno «Emilia-Romagna». Il conteggio «Emilia-Romagna 3» del brief
  probabilmente ne perde uno. Nel `PROVINO` ne conto 4: Granduca, Better Sushi, Mamma Mia e La
  Forchetta. `[VERIFY builder: normalizzare i nomi di regione in a3-data.js prima di raggruppare]`.
  Altrimenti la carta mostra due gruppi per la stessa regione.
- **«Qui non ci siamo stati» non vale sui 79.** L'idea della sintesi vive sul corpus intero
  (1.192 reel). Sui 79 le regioni vuote sono molte di più, ma non vuol dire che la coppia non ci
  sia stata. Sui 79 si scrive «Nessun posto con la scheda», mai «non ci siamo stati» (§8, bonus).

**Rilievi su A2** (formato di revisione):

```
[blocker] tutta l'app — A2/09, A2/03, A2/05
Problema: 6 posti su 79, 5 senza prezzo; la Home è testo più una card, Esplora è una griglia da
  6, la carta ha 5 punti.
Perché conta: l'app sembra vuota e il primo giudizio dell'owner è «bozza».
Direzione: i 79 posti da a3-data.js in ogni schermata (P0-1); nessun layout pensato per un
  sottoinsieme.
```
```
[serious] Home 390 e 1440 — A2/09-390, A2/09-1440
Problema: a 390 sotto «Tutti i posti» resta vuoto il 25% del primo schermo; a 1440 tre oggetti
  galleggiano sulla sabbia con buchi tra l'uno e l'altro.
Perché conta: non comunica né la scala né l'idea del brand in 5 secondi.
Direzione: la Home del §5.1 (domanda, risposta, provino).
```
```
[serious] scala tipografica — A2/01, A2/03
Problema: la domanda del reel è in corsivo da 19 px sotto il nome, dove si legge come un
  sottotitolo; l'h1 di Esplora è di 30 px; nessun elemento supera i 64 px su desktop.
Perché conta: tutto è ordinato e nulla è memorabile.
Direzione: scala del §2.2 (fino a 96 px su desktop, 64 px su mobile per i mesi) e il
  cartiglio del §3.
```
```
[serious] Esplora — A2/03, A2/20-1440
Problema: griglia uniforme 2×n o 3×n, senza porte né filtri né variazioni.
Perché conta: con 79 posti diventa un muro e non si scopre niente.
Direzione: porte, pillole, ritmo S/L, fine elenco onesta (§5.2).
```
```
[serious] Mappa — A2/05, A2/22-1440
Problema: la tavola da 350×380 con 5 punti non ha gruppi, livelli né tavole estere (Madrid in un
  riquadro da 72 px); a 79 punti la Lombardia (21 posti in circa 60×40 px) diventa una macchia.
Perché conta: la voce fissa della barra non regge la scala.
Direzione: gruppi per regione, ingrandimento a livello di regione e tavole II-IV (§5.4).
```
```
[serious] scheda, ossatura fissa — A2/14 (Burton)
Problema: «Prezzo — non ancora» sul 71% delle schede (56 su 79).
Perché conta: la scheda sembra rotta proprio dove il brand promette la prova.
Direzione: il cartellino del §4.
```
```
[serious] desktop, banco a tre e copertina 16:9 — confronto-desktop.png, A2/21-1440
Problema: una copertina 16:9 da 432×243 presa da un fotogramma 9:16 mostra il 31% del
  fotogramma; il banco con i separatori sembra uno strumento, non una rivista.
Perché conta: su desktop la foto, cioè la cosa più forte, è la più piccola.
Direzione: la colonna fotografica 5:7 alta tutto lo schermo (§5.3). Il banco resta solo sulla
  Mappa.
```
```
[serious] momenti-firma — A2/10, A2/11, A2/18
Problema: retro e locandina esistono solo dopo un tocco e su un posto solo; a riposo non
  lasciano segni.
Perché conta: l'owner giudica dalle catture e dal primo sguardo.
Direzione: ogni firma ha uno stato a riposo visibile (§6) e le catture a metà transizione.
```
```
[minor] domanda del reel in Home — A2/09-390
Problema: il posto del mese mostra nome e dichiarazione ma non la sua domanda, che è la cosa
  più riconoscibile del reel.
Direzione: cartiglio ricomposto sull'eroe (§3, §5.1).
```
```
[minor] dati delle regioni — seed, Granduca
Problema: «Emilia Romagna» e «Emilia-Romagna».
Direzione: normalizzare in a3-data.js [VERIFY].
```

### 1. Il sistema, alzato di livello

#### 1.1 Superfici e materiali (quattro, ognuna con un ruolo)

| Superficie | Token | Ruolo | Regola |
| --- | --- | --- | --- |
| Sabbia | `--color-sand` #faf8f4 | il tavolo | Fondo di tutto. Attorno alle foto c'è sempre sabbia o inchiostro, mai un colore di categoria |
| Carta | `--color-atlante-carta` #f2ecdf + trama | i documenti | Cartellino, retro, tavole della carta, stati vuoti, blocco guida, cartiglio della Home desktop. **Ha la trama** (§1.4) |
| Inchiostro | `--color-atlante-inchiostro` #1e1c18 | il buio dove si guarda un reel | **Una fascia per pagina al massimo**: locandina (livello) e blocco «Il reel» in fondo alla scheda |
| Notte | `--color-atlante-notte` #17375a (esiste) | la categoria Hotel | Solo come fascia della porta e punto della lente «Hotel con carattere». Testo sabbia sopra (11,5:1) |

#### 1.2 Colori delle categorie (7 categorie, 6 porte)

Le 7 categorie dei 79 si mappano così. Quattro token esistono già in `index.css` di BEST, uno è
un alias di un token esistente e due sono **proposte** (decisione 1 dell'owner).
`--color-cat-panoramiche` non ha posti tra i 79 e non si usa in A3.

| Categoria | Posti | Token | Valore | Testo sulla fascia | Contrasto (calcolato a mano) |
| --- | --- | --- | --- | --- | --- |
| Food & Ristoranti | 37 | `--color-cat-food` (esiste) | #fe6d73 | inchiostro | 7,2:1 |
| Insolito | 28 | `--color-cat-insolito` (esiste) | #c0afff | inchiostro | 10,2:1 |
| Hotel con carattere | 20 | `--color-cat-hotel` **nuovo alias** = `var(--color-atlante-notte)` | #17375a | sabbia | 11,5:1 |
| Posti particolari | 17 | `--color-cat-particolari` **PROPOSTA** | #8cc084 (salvia) | inchiostro | 9,4:1 |
| Relax, terme e spa | 13 | `--color-cat-relax` (esiste) | #4cb2be | inchiostro | 7,9:1 |
| Weekend romantici | 5 | `--color-cat-romantici` **PROPOSTA** | #f2a7c3 (cipria) | inchiostro | 10,5:1 |
| Borghi e città d'arte | 1 | `--color-cat-borghi` (esiste) | #fdaf40 | inchiostro | 10,8:1 |

Perché Hotel è notte: è la sola categoria che vuol dire dormire, e tra sei fasce pastello ne
serve una scura che dia peso alla fila. Perché salvia per i Posti particolari: nel `PROVINO` sono
in gran parte parchi, giardini, fattorie e boschi. Il verde esistente #11884f non passa AA né con
l'inchiostro (4,4:1) né con la sabbia (4,25:1).

**Regole d'uso** (mai testo in colore di categoria, su nessun fondo):
- fascia piena della **porta** (§5.2), con il nome in inchiostro (sabbia sulla notte);
- **punto da 8 px** prima del comune nelle tessere e nelle righe (fino a 3 punti se il posto ha
  più categorie), con alone di 1 px sabbia;
- **pillola di categoria attiva**: punto da 10 px più fondo `--color-atlante-carta-deep`;
- **lente** sul provino e sulla carta: filetto di 3 px sotto le celle che corrispondono, e punti
  della carta colorati;
- mai come fondo di pagina, mai attorno a una foto, mai sui tasti.

#### 1.3 Regole mie che cambiano, e perché

| Regola di A2 | Diventa | Motivo |
| --- | --- | --- |
| «Ossatura fissa a 4 campi, «—» e «non ancora»» (Decisione 5) | **Cartellino**: 3 celle sempre piene più la riga «Quanto» facoltativa (§4) | Con 79 posti avrebbe mostrato un buco sul 71% delle schede. La prova si mostra per ciò che c'è, e l'assenza si dice una volta, dove serve |
| «Il corsivo ha tre usi soli» (Decisione 9) con la domanda a 19-20 px | Corsivo per **quattro** usi: domanda (fino a 40 px), provenienza, matita e stati vuoti, **nomi dei mesi** (fino a 96 px). Resta vietato su etichette, tasti e numeri | Il corsivo di Fraunces è la voce del brand («Ma esistono davvero.»). Tenerlo piccolo ha spento il dispositivo più forte |
| Scala chiusa fino a 64 px su desktop e 36 su mobile | Fino a **96 px** su desktop e **64** su mobile (§2.2) | Senza un momento di scala ogni schermata ha lo stesso volume |
| «Anti-SaaS: niente chip-filtro» (§8 di A2) | **Pillole ammesse** in una sola fila orizzontale, senza badge numerici, senza barra laterale | Con 79 posti filtrare è necessario. Una fila di pillole è un indice, non un pannello di controllo |
| «Un solo riempimento pieno per schermata» esteso di fatto a ogni massa di colore | Resta per i **tasti** (uno solo in inchiostro). Sono ammesse **fasce** piene: porte di categoria, carta, inchiostro, notte | La regola nata per la gerarchia dei tasti aveva tolto ogni massa di colore |
| «Home desktop: tutto in un solo schermo» (§5.4 di A2) | Home con **racconto in scorrimento**: domanda, poi provino, carta, guida | Un solo schermo con tre oggetti è una vetrina, non una casa |
| Banco a tre riquadri con separatori in Esplora e I miei posti | **Solo sulla Mappa**. Esplora desktop è una griglia a tutta larghezza con la colonna «Carta» facoltativa | Sembrava uno strumento. Complesso da costruire e poco rilevante per lo stupore |
| Copertina 16:9 nel riquadro desktop | **Colonna fotografica 5:7** alta tutto lo schermo (§5.3) | Il 16:9 da un 9:16 mostra il 31% del fotogramma |
| Pesi Fraunces 400/440/460/520 | Aggiungo **360 e 380** solo sopra i 38 px (**PROPOSTA**, decisione 4 dell'owner) | A 64-96 px il 440 diventa pesante; il 360 ha l'eleganza da rivista. Stesso asse `wght`, nessun file nuovo `[VERIFY builder: il Fraunces variabile incorporato in A2 copre 360?]`; se no, 400 |

#### 1.4 Trama e timbro (craft, non referenziali)

- **Trama della carta:** se `carta-tile.webp` del sito è tra i file pubblicati usabili
  dall'artifact `[VERIFY builder]`, la si usa come in `atlante.css` (moltiplica, tile 420). In
  alternativa: SVG inline `feTurbulence` (`baseFrequency 0.9`, `numOctaves 2`) come data-URI, in
  `multiply` al 5%. È craft generato proceduralmente, etichettato `craft`, e non raffigura luoghi.
- **Timbro:** bollo «Esiste davvero?» e timbro datario del retro con un filtro SVG
  `feDisplacementMap` leggero (scala 1,2) sul bordo, per l'effetto inchiostro sulla gomma. È P2;
  senza il filtro il timbro resta com'è in A2.
- Niente grane, rumori o sfumature sulle foto: le foto non si toccano mai.

### 2. Token A3 (in aggiunta a quelli di A2, che restano validi dove non sono citati)

#### 2.1 Colori nuovi

```css
--color-cat-food:#fe6d73; --color-cat-insolito:#c0afff; --color-cat-relax:#4cb2be;
--color-cat-borghi:#fdaf40; --color-cat-hotel:var(--color-atlante-notte);
--color-cat-particolari:#8cc084; /* PROPOSTA */ --color-cat-romantici:#f2a7c3; /* PROPOSTA */
--color-atlante-notte:#17375a;
--color-lente-velo:rgb(250 248 244 / 82%); /* sabbia sopra le celle escluse dalla lente */
```

#### 2.2 Tipografia (mobile, poi da 1024)

| Token | 390 | ≥1024 | Uso |
| --- | --- | --- | --- |
| `--type-poster` | Fraunces 400 38/40, −0.02em | Fraunces 360 72/72, −0.025em | h1 di Home (a 1440 nel blocco: 56/58), Esplora, Mappa, Noi, I miei posti |
| `--type-title-1` | Fraunces 400 38/40 | Fraunces 360 64/64 | h1 della scheda (nome) |
| `--type-title-2` | Fraunces 440 28/32 | Fraunces 400 40/44 | h2 grandi: «Tutto l'archivio», «Dove siamo stati», «Vicino a questo» |
| `--type-title-3` | Fraunces 460 20/26 | Fraunces 460 24/30 | h2 nella scheda: «Prima di andare», «Il racconto» |
| `--type-month` | Fraunces *italic* 360 64/60, minuscolo | *italic* 360 96/88 | nome del mese nel rullino |
| `--type-cartiglio-q` | Fraunces *italic* 380: eroe 30/32, copertina 28/30, tessera L 24/26 | eroe/colonna 40/42, lente 26/28, tessera L 28/30 | domanda nel cartiglio |
| `--type-cartiglio-name` | Inter 600 12/16, maiuscolo, +0.2em | idem | prima riga del cartiglio (nome) |
| `--type-cartiglio-place` | Fraunces 400 14/18 | Fraunces 400 16/20 | ultima riga (comune) |
| `--type-numeral-xl` | Fraunces 460 26/30, `tabular-nums` | 460 32/36 | prezzo breve nella riga «Quanto» |
| `--type-door` | Inter 600 14/18 | Inter 600 16/20 | nome sulla porta |
| `--type-chip` | Inter 500 14/20 | idem | pillole |
| `--type-cell-label` | Inter 600 12/16, maiuscolo, +0.12em | idem | etichette del cartellino |
| `--type-cell-value` | Inter 600 15/20 | Inter 600 16/22 | valori del cartellino |
| `--type-year` | Fraunces 460 20/24, `tabular-nums` | 460 24/28 | anno nel provino e nel rullino |

Restano quelli di A2: `--type-name`, `--type-name-row`, `--type-caption`, `--type-body`,
`--type-ui`, `--type-ui-strong`, `--type-label`, `--type-label-strong`, `--type-tab`,
`--type-eyebrow`, `--type-kbd`, `--type-map`, `--type-trace`.

**Insieme ammesso di `font-size`** per il test P0-2: {12, 13, 14, 15, 16, 17, 18, 20, 22, 24,
26, 28, 30, 32, 38, 40, 56, 64, 72, 96}. Se un cartiglio lungo scala (§3), scende di un gradino
dentro lo stesso insieme.

#### 2.3 Griglie e ritmo

```css
--sheet-gap-m:2px;  --sheet-cols-m:6;   /* provino a 390, a filo schermo */
--sheet-gap-t:4px;  --sheet-cols-t:10;  /* 768 */
--sheet-gap-d:6px;  --sheet-cols-d:12;  /* 1024 */  --sheet-cols-w:16; /* ≥1280 */  --sheet-cols-x:18; /* ≥1680, banco max 1600 */
--tile-gap-m:12px;  --tile-row-gap-m:24px;  --tile-gap-d:24px;  --tile-row-gap-d:32px;
--door-w-m:140px;   --door-h-m:196px;       /* porta mobile: foto 140×140 + fascia 56 */
--cover-h-m:clamp(320px, 47.4svh, 440px);   /* copertina scheda mobile: 400 a 844 */
--hero-h-m:clamp(360px, 52svh, 480px);      /* eroe Home mobile: 440 a 844 */
```

#### 2.4 Tre livelli di immagine (per 79 foto)

| Livello | Dove | Variante | Caricamento | Anteprima |
| --- | --- | --- | --- | --- |
| T0 | eroe Home, copertina/colonna della scheda | la più grande | `fetchpriority="high"`, non lazy, **mai animata** | colore dominante sotto |
| T1 | tessere S/L, porte, lente, «Vicino a questo» | la media | `loading="lazy"` `decoding="async"` | colore dominante + anteprima sfocata (M7 di A2) |
| T2 | celle del provino, miniature 40-67 px | la più piccola | `loading="lazy"` `fetchpriority="low"` | solo colore dominante (niente livello sfocato: risparmia 79 livelli di pittura) |

Le tre varianti sono quelle che prepara il costruttore dei dati `[VERIFY: larghezze reali in
a3-data.js]`. Ogni riquadro ha `aspect-ratio` fisso, quindi nessuna immagine sposta il layout.

### 3. Il dispositivo: il cartiglio ricomposto

**Cos'è.** Ogni reel stampa in cima un riquadro chiaro con quattro righe: nome in maiuscoletto,
domanda grande, filetto e luogo (`CARTIGLI`). Il nostro ritaglio 5:7 lo toglie (regola del
cartiglio di A2, §2.8). A3 lo **ricompone in HTML nello stesso punto**, con la stessa struttura
e i font del brand. È riconoscibile da chi arriva da Instagram, leggibile da chi arriva da Google
e sempre a contrasto pieno, perché è inchiostro su sabbia e non serve un velo scuro sulla foto.

**Anatomia** (posizionato dentro il riquadro della foto, `position:absolute`):
- riquadro `--color-sand` pieno (niente trasparenza né sfocatura), `--radius-paper` 2 px, nessuna
  ombra; larghezza `min(84%, 340px)` su mobile e `min(78%, 520px)` sulla colonna desktop;
  **centrato** in orizzontale come nel reel; distanza dal bordo alto della foto 6% dell'altezza
  del riquadro (minimo 16 px); padding 12/16 (16/24 su desktop);
- riga 1: **nome** `--type-cartiglio-name` ink, centrato (sulla scheda questa riga si toglie,
  perché il nome è l'h1 subito sotto: niente doppioni);
- riga 2: **domanda** `--type-cartiglio-q` ink, centrata, al massimo 3 righe, testo = `hook`
  **alla lettera** (nessuna riscrittura, nessuna estrazione di «parola chiave»);
- filetto: 1 px `--color-atlante-inchiostro`, a tutta larghezza interna, 8 px sopra e sotto;
- riga 3: **comune** `--type-cartiglio-place` `--color-ink-2`, centrato.

**Adattamento.** Se la domanda supera 3 righe alla misura del contesto, scende di un gradino
della scala (30 → 28 → 26 → 24 → 22). Il riquadro ha altezza calcolata prima della pittura (le
font sono incorporate), quindi non c'è CLS. Se `hook` manca `[VERIFY: quanti dei 79 lo hanno]`, il
cartiglio non si disegna: niente domanda inventata.

**Dove compare**

| Contesto | Righe | Misura domanda |
| --- | --- | --- |
| Eroe della Home (390, 768) | nome, domanda, filetto, comune | 30/32 |
| Lente della Home desktop | nome, domanda, filetto, comune | 26/28 |
| Copertina della scheda mobile | domanda, filetto, comune | 28/30 |
| Colonna fotografica della scheda desktop | domanda, filetto, comune | 40/42 |
| Tessera grande (L) in Esplora | domanda, filetto, comune | 24/26 (390) · 28/30 (1440) |
| Mese con un solo posto nel rullino | domanda, filetto, comune | 24/26 |
| Tessere S, celle del provino, righe | **mai** (troppo piccolo) | — |

**Regola che lo tiene onesto.** Il cartiglio contiene solo campi del dato (`title`, `hook`,
`place.city`), alla lettera. Non imita la font del reel e non si sovrappone mai al cartiglio
stampato (che è ritagliato via). Nella locandina, dove il cartiglio stampato si vede, il nostro
scompare prima che il ritaglio si apra (F3).

**Accessibilità.** La domanda è un `<p class="domanda">` che precede l'h1 nell'ordine di
lettura solo nella scheda (`aria-describedby` dell'h1). Il nome nel cartiglio, dove duplica
un h1, è `aria-hidden`.

### 4. Il cartellino: la prova quando il prezzo manca

**Principio.** La prova si mostra per ciò che c'è. Tre prove esistono su 78 schede su 79: la data
del reel (79/79), la dichiarazione (79/79) e il controllo (78/79). Diventano tre celle fisse. Il
prezzo (23/79) e la fascia (25/79) sono una riga in più, **sopra**, solo quando c'è un dato.
Quando manca, lo si dice una volta sola, nella sezione pratica, insieme a dove chiederlo.

#### 4.1 Riga «Quanto» (facoltativa)

| Caso | Resa |
| --- | --- |
| `price` breve (≤ 18 caratteri, per esempio «8€», «da 98€/notte», «Da 39€») | `--type-numeral-xl` ink, alla lettera; a destra, sulla stessa linea di base, `--type-label` muted «Fascia media» se esiste `budget`; sotto, `--type-label` muted «Prezzo indicativo, segnato da noi» [VERIFY seo] |
| `price` lungo o con «·» | etichetta «QUANTO» `--type-cell-label`, poi le parti separate da «·» una per riga, in `--type-ui` ink («Pranzo da 19,90€» / «Cena da 35,90€»); la fascia se c'è |
| `price` che non è una cifra (nessuna cifra nel testo, come «Prezzo variabile per stanza») | niente numero grande; «QUANTO» e il testo in `--type-ui` ink-2 |
| solo `budget` | «Fascia di spesa» `--type-cell-label` più la **scala di tre €** in Fraunces 460 26/30: pieni in ink quelli fino al livello (Basso = 1, Medio = 2, Alto = 3), gli altri in `--color-border`; a destra la parola «bassa/media/alta» in `--type-label` |
| né `price` né `budget` | **la riga non esiste**: nessun trattino, nessun «non ancora» |

#### 4.2 Le tre celle (sempre)

Striscia carta con trama, `--radius-paper`, larghezza piena, 3 colonne uguali divise da filetti
`--color-atlante-linea`, padding 12, altezza 76 (390) · 84 (desktop).

| Cella | Etichetta | Valore (`--type-cell-value`) | Sotto (`--type-label` muted) | Link |
| --- | --- | --- | --- | --- |
| Reel | REEL | «16 gen 2026» | «Instagram ↗» | permalink del reel `[VERIFY: presente su 79/79?]`; se manca, niente link e «su Instagram» |
| Controllo | CONTROLLATO | «15 ago 2026» | fonte («granducacampigna.it») | nessuno (la fonte è testo) |
| Dichiarazione | A CHE TITOLO | vedi sotto | partner se c'è (`partnership.partner`) | nessuno |

Diciture della dichiarazione [VERIFY seo e legale, B5]: organico → «Nessuna» con sotto
«collaborazione»; invito → «Su invito»; ADV → «ADV» con sotto «pubblicità»; collaborazione →
«In collaborazione»; affiliazione → «Affiliazione» con sotto «link affiliato».

Unico caso vuoto: il posto senza controllo mostra «Non ancora» in `--type-cell-value` muted e
nessuna fonte. È l'unica occorrenza di «non ancora» nell'app.

#### 4.3 La frase dell'assenza

Nella sezione «Prima di andare», come ultima voce, solo se mancano sia `price` sia `budget`:
- con `place.website`: «Il prezzo non l'abbiamo segnato. Chiedilo sul sito: {dominio} ↗»;
- senza: «Il prezzo non l'abbiamo segnato.»

`data-prezzo-mancante` sull'elemento, per il test.

#### 4.4 Sulle tessere (una riga di prova)

Seconda riga della meta, `--type-label-strong`: il `price` breve se c'è, altrimenti «Fascia
bassa/media/alta», altrimenti niente. Poi, se la dichiarazione non è organica, «· Su invito» /
«· ADV» / «· In collaborazione» / «· Affiliazione». La dichiarazione non organica **compare
sempre** su ogni tessera, riga e cella della lente: è trasparenza, non un'opzione.

---

## What the receiver should produce

### 5. Le schermate

Misure a 390×844 (sicurezza 0) e 1440×900. La barra alta è di 52/64. Il piano in basso è di
116 (con riga d'azione) o 56 (solo barra), come in A2. Le y sono dal bordo alto.

#### 5.1 Home: «Una domanda, poi l'archivio intero»

**L'idea.** In cinque secondi chi arriva deve capire tre cose, in quest'ordine:
1. un posto vero e improbabile gli fa una domanda (fotogramma e cartiglio);
2. il brand risponde (h1: «Posti che sembrano inventati. Ma esistono davvero.»);
3. non è un posto solo: c'è un archivio intero, di due persone, da maggio 2024 ad agosto 2026
   (il provino).

Nessun contatore: la scala si vede dal numero di fotogrammi, non da una cifra.

**Il posto di oggi (scelta deterministica).**
```
eleggibili = posti con evidenza=true && hook && (price || budget) && controllo
oggi = data del giorno (nelle catture: ?oggi=2026-09-29)
candidati = eleggibili con mese(reel) == mese(oggi) && reel < oggi
se candidati ≠ ∅ → candidati[giornoDellAnno(oggi) mod n]; didascalia «Fotogramma dal reel di {mese anno}»
altrimenti → il più recente degli eleggibili; didascalia «Fotogramma dal reel del {data}»
```
Con `?oggi=2026-09-29` il candidato atteso è un reel di settembre. A2 mostrava l'Emotional Grand
Motel come «Reel di settembre 2024». `[VERIFY: ha price o budget? Se no, il criterio sceglie un
altro reel di settembre, e va bene così]`.

**390×844, primo schermo**
- 0-52: barra alta (marchio, ⌕).
- 52-492: **eroe** a filo schermo 390×`--hero-h-m` (440), T0, `object-position` da
  `coverFocusY` vincolato dalla regola del cartiglio (`visibleTop ≥ cartiglio + 0,01`), raggio 0.
  Sopra: cartiglio completo (nome, domanda 30/32, filetto, comune), in alto al centro. Tutto
  l'eroe è un link alla scheda (`aria-label` = nome).
- 500-518: didascalia `--type-caption` muted: «Fotogramma dal reel di settembre 2024».
- 534-654: **h1** `--type-poster` 38/40 su 3 righe: «Posti che sembrano inventati.» in ink e
  «Ma esistono davvero.» in corsivo `--color-accent-text`.
- 666-710: `--type-body` 15/22 ink-2: «Siamo Rodrigo e Betta. Prima ci andiamo, poi qui trovate
  il reel girato sul posto.»
- 722-770: campo di ricerca h 48: «Cerca un posto, una città, una domanda».
- 788-844: barra a 5 voci (la Home non ha riga d'azione).

**Scorrendo**
1. **«Tutto l'archivio»** (`--type-title-2`), 48 px sopra; sotto, in `--type-label` muted:
   «Dal reel più recente al primo: da agosto 2026 a maggio 2024.» Le date vengono dai dati, mai
   scritte a mano.
2. **Il provino** a filo schermo: 6 colonne, gap 2 sabbia, celle 63×88 (5:7), T2, ordine per
   data del reel decrescente. **Tutti i 79**, compreso il posto di oggi. A ogni cambio d'anno
   una riga di 40 px con l'anno `--type-year` a sinistra (x 20) e un filetto: «2026», «2025»,
   «2024». Ogni cella è un link alla scheda con `aria-label` «{nome}, {comune}». Il fuoco è un
   anello di 2 px dentro la cella. Le celle in evidenza vietata stanno al loro posto di data (non
   sono in evidenza: sono una cella tra 79). Righe con `content-visibility:auto` e
   `contain-intrinsic-size:auto 90px`. Altezza stimata circa 1.450 px.
3. **«Dove siamo stati»** (`--type-title-2`) con la frase calcolata «{59} posti in Italia, {20}
   fuori.»; **Tavola I** 350×432 su carta con i **79 punti da 4 px, senza gruppi e senza
   etichette**: la forma dell'Italia la disegnano i posti. Sotto, tre riquadri 110×110 (Tavole
   II, III e IV, §5.4) con titolo e numero. Tutto porta alla Mappa.
4. **«La guida in regalo»**: blocco carta, tasto secondario «Ricevila».
5. Colofone.

**1440×900: il provino è la Home**
- 0-64: barra alta.
- Da y 72: il **foglio del provino**, larghezza 1392 (margini 24), 16 colonne con gap 6, celle
  81×114 (5:7). Il foglio ha tre inquilini in una griglia CSS con posizioni esplicite, e i
  fotogrammi scorrono in ordine di data nelle celle libere (`grid-auto-flow: row dense`):
  - **Blocco titolo**, colonne 1-6 × righe 1-4 (518×474), su sabbia, senza bordo: occhiello
    «Rodrigo e Betta · Travelliniwithus»; h1 `--type-poster` a 56/58 su 4 righe; testo
    `--type-body`; campo di ricerca 48 con «⌘K»; link «Tutti i posti →».
  - **Lente**, colonne 7-10 × righe 1-4 (344×474, 5:7): il posto di oggi, T1 (è sotto il
    titolo, non è LCP), cartiglio completo 26/28; in basso sulla foto una pillola sabbia
    `--type-label-strong` «Reel di settembre 2024». È un link alla scheda.
  - **Fotogrammi:** colonne 11-16 delle righe 1-4, poi righe 5-7 intere, poi di seguito. Nel
    primo schermo ce ne stanno circa 72; la riga 7 esce di poco dal bordo e invita a scendere.
- **La lente si sposta.** Passando sopra una cella (o con il fuoco da tastiera) la lente mostra
  quel posto: foto, cartiglio e data. Esce il posto precedente e non entra un posto a caso.
  Uscendo dal foglio la lente torna al posto di oggi. Nessun cambio avviene da solo. Ritardo di 60
  ms contro il passaggio veloce; la foto della lente usa T1, che si carica solo al primo passaggio.
- Sotto il foglio: «Dove siamo stati» in una fascia carta a tutta larghezza, con la Tavola I
  (520×640) a sinistra e le Tavole II-IV (200×200 ciascuna) a destra, più la frase calcolata;
  poi la guida e il colofone.

**768:** come 390, con margini 32, eroe 768×540, provino a 10 colonne (celle 67×94).
**1024:** foglio a 12 colonne (celle 76×107); blocco titolo 5×4 e lente 4×4.
**≥1680:** 18 colonne, foglio al massimo 1600 e centrato; blocco titolo 7×4.

**Ingresso (una volta per sessione):** vedi M-A al §6.2.

#### 5.2 Esplora a scala 79

URL `#esplora` (vista Posti), `#esplora-mesi`, `#esplora-elenco`. Lo stato dei filtri è in
`sessionStorage`, non nell'hash.

**390×844**
- 0-52: barra alta.
- 64-144: h1 `--type-poster` «Posti provati di persona» (2 righe).
- 152-170: `--type-label` muted, calcolato: «Da maggio 2024 ad agosto 2026, in Italia e in altri
  10 paesi.»
- 184-228: **selettore di vista** «Posti · Per mese · Elenco» (sottolineatura accento, A2).
- 240-436: **Le porte**, una fila orizzontale con scroll-snap (l'**unico** scorrimento
  orizzontale della schermata oltre alle pillole), padding sinistro 20 e gap 12:
  - 6 porte, **solo per le categorie con almeno 5 posti** (Food, Insolito, Hotel, Particolari,
    Relax, Romantici; Borghi, con 1 posto, è solo una pillola);
  - porta 140×196: foto 140×140 (T1, ritaglio quadrato allineato in basso, che nasconde il 44%
    in alto, quindi la regola del cartiglio è rispettata), sotto una **fascia piena** di 56 px
    del colore della categoria, con il nome in `--type-door` (2 righe al massimo) e a destra il
    numero di posti in Fraunces 460 14 `tabular-nums`;
  - foto della porta: il posto più recente della categoria con `evidenza=true`;
  - è un `button` con `aria-pressed`: il tocco attiva la pillola di categoria e scorre ai
    risultati. La terza porta si vede per metà, così si capisce che la fila continua.
- **Barra delle pillole**, fissa (`position:sticky; top:52px`), h 52, sabbia; il filetto basso
  compare solo quando è attaccata. Pillole h 36 (area di tocco 44) in una fila orizzontale:
  - se c'è una categoria attiva, per prima la pillola con il punto colore, il nome e ×;
  - zona: «Italia», «Europa», «Asia», «Americhe». Toccando «Italia» la fila diventa **«‹ Italia»
    più le regioni** con almeno 3 posti, calcolate dai dati (Lombardia, Veneto, Toscana,
    Campania, Piemonte, Emilia-Romagna, Lazio [VERIFY dopo la normalizzazione]) e «Altre
    regioni»;
  - «Con il prezzo», «Budget basso», «Budget medio», «Budget alto»;
  - **a destra, fisso fuori dalla fila che scorre**: «Ordina» (ArrowDownUp 16 più testo), che
    apre un foglio con: «Reel più recente» (predefinito), «Reel meno recente», «Nome A-Z»,
    «Budget, dal più basso» (chi non ha budget va in fondo, con la nota «senza fascia in fondo»).
  - Nessun badge numerico sulle pillole.
- **Riga del risultato**, `--type-label`: «{n} posti · {filtri attivi}», per esempio «37 posti ·
  Food & Ristoranti», più il link «Azzera». Il numero è calcolato (`data-count`).
- **Griglia a ritmo** (2 colonne da 169, gap 12, righe da 24). Schema a blocchi di 5: **S S / S S
  / L**.
  - **S**: foto 169×237 (5:7) r14 T1; nome `--type-name`; comune con i punti di categoria;
    riga di prova (§4.4); cuore «salvato» 28×28 sabbia nell'angolo alto destro della foto,
    solo se salvato.
  - **L**: foto a tutta larghezza 350×438 (4:5, allineata in basso: nasconde il 30% in alto)
    r14 T1, **con il cartiglio** (domanda 24/26); sotto il nome `--type-title-3`, la meta e la
    riga di prova.
  - La posizione L tocca al posto successivo nell'ordine. Se quel posto è in evidenza vietata,
    resta S e lo schema scala di un posto. L'ordine non cambia mai per far posto a una L.
- **Fine elenco:** «Hai visto tutti i {n} posti di {filtri}.» più «Prova anche:» e le due porte
  più grandi non attive. Nessuno scorrimento infinito.
- **Vuoto dei filtri** (su carta r2), per esempio con Borghi e città d'arte più Italia (l'unico
  posto di Borghi è in Francia): «Nessun posto di Borghi e città d'arte in Italia.» Poi un tasto
  secondario per ogni filtro attivo, con il numero calcolato di ciò che si ottiene togliendolo:
  «Togli Italia ({n} posti)», «Togli Borghi e città d'arte ({n} posti)». Mai una schermata vuota
  senza uscita.

**1440×900**
- Intestazione: h1 `--type-poster` 72/72 a x 40; a destra il selettore di vista e l'interruttore
  «Carta» (Map 16, `aria-pressed`).
- **Porte**: una fila di 6 senza scorrimento, 213×280 ciascuna (foto 213×213 più fascia 67), gap
  16.
- Barra delle pillole fissa sotto la barra alta (top 64).
- **Griglia** a 5 colonne da 253 (foto 253×354), gap 24. Schema a coppie di righe: una **L 2×2**
  (foto 530×742 con il cartiglio a 28/30) più 6 S, e nella coppia successiva la L passa a
  destra. Stesse regole di evidenza.
- **Con «Carta» attivo**: la griglia va a 3 colonne in 840 e a destra, fissa sotto le pillole,
  c'è la Tavola I 480×620 con i punti del risultato. Passare sopra una tessera accende il suo
  punto e viceversa. Solo il clic fa scorrere.
- **768**: 3 colonne da 224, L = 2 colonne; porte in fila con scorrimento. **1024**: 4 colonne,
  L 2×2.

**Vista «Elenco»**: registro raggruppato per regione (e per paese fuori d'Italia), con
intestazioni fisse «Lombardia · 21». Righe da 72: miniatura 40×56 T2, nome `--type-name-row`,
comune con i punti di categoria, a destra la riga di prova.

**Vista «Per mese»**: §5.5.

#### 5.3 La scheda ricca

URL `#posto-<slug>`. Apertura con F1 (§6).

**390×844, primo schermo**
- 0-52: barra alta «‹ Esplora» (o l'origine), Condividi, ⌕.
- 52-452: **copertina** 390×`--cover-h-m` (400) T0 a filo, con il cartiglio (domanda 28/30,
  filetto, comune). Bollo «Esiste davvero?» in basso a destra (A2). **Angolo del retro:** in
  basso a sinistra un'orecchia di carta 20×20 (triangolo `--color-atlante-carta` con filetto),
  che a riposo dice che la foto ha un retro. Toccarla fa lo stesso gesto del bollo.
- 460-478: didascalia «Fotogramma dal reel del 16 gennaio 2026».
- 490-506: occhiello `--color-accent-text` «Santa Sofia · Emilia-Romagna», a destra i punti di
  categoria con il nome della prima («● Relax, terme e spa»).
- 510-594: h1 `--type-title-1` 38/40 (2 righe al massimo; oltre, 32/36).
- 606-650: riga «Quanto», se c'è (§4.1).
- 660-736: **cartellino** (§4.2). Con un nome su una riga o senza «Quanto» tutto sale di 42/44 px.
- Piano in basso: riga d'azione «Salva per il viaggio» (unico tasto pieno, ink) e «Guarda il
  reel» (secondario).

**Sotto, in quest'ordine** (ogni sezione esiste solo se ha contenuto; 48 px tra le sezioni):
1. **Prima di andare** `--type-title-3`: le voci di `toKnow` come elenco numerato con numeri
   Fraunces 460 20 `--color-accent-text`; poi «Come arrivare» (`gettingThere`) con il link «Apri
   in Mappe ↗» (link esterno con le coordinate, aperto solo dall'utente); poi la frase
   dell'assenza (§4.3).
2. **Il racconto** `--type-title-3`: `description` in `--type-body` 17/28.
3. **Vicino a questo** `--type-title-2`: tavola locale 350×220 su carta con il posto (punto da 12
   `--color-accent-text`) e i suoi 4 vicini (punti da 7), uniti da **filetti tratteggiati** di 1 px
   con i km a metà (`--type-label` `tabular-nums`, «{km} km»). Sotto, 4 righe: miniatura 48×67,
   nome, «a {km} km in linea d'aria», ChevronRight. Titolo per distanza:
   - vicino più vicino entro 30 km: «Nello stesso giro»;
   - tra 30 e 150 km: «Vicino a questo»;
   - oltre 150 km: «Il posto più vicino in archivio» con **una riga sola** («a {km} km in linea
     d'aria»). Con il Riu Cancún, per esempio, la verità è la distanza.
   - Nessun tempo di viaggio, nessuna strada, nessun «itinerario».
4. **Altri: {categoria}**: intestazione con il punto e il nome della prima categoria del posto,
   poi 4 tessere S in 2×2 (i più recenti della stessa categoria, escluso questo). Link «Tutti i
   {n}» che apre Esplora con la pillola attiva.
5. **Il reel**: **fascia inchiostro** a filo schermo (l'unica della pagina), alta 280: locandina
   9:16 da 120×213 a sinistra con il badge «Reel · Instagram ↗», a destra in sabbia «Reel del 16
   gennaio 2026», «A che titolo: …» e il tasto sabbia pieno «Guarda su Instagram ↗», che apre F3.
6. Colofone.

**1440×900: colonna fotografica**
- Barra alta 64.
- **Colonna foto** x 0-620, y 64-900, `position:sticky; top:64px`, T0 a filo del bordo sinistro:
  il fotogramma a 620 di larghezza misura 1102 di altezza e ne restano visibili 836, cioè il 75,8%
  in basso. Nasconde il 24,2%, quindi serve lo zoom per ogni asset con cartiglio oltre 0,232
  (Burton, regola di A2 §2.8). Cartiglio 40/42 largo fino a 520. Bollo in basso a destra,
  orecchia in basso a sinistra, didascalia sulla foto in basso a sinistra, sopra l'orecchia,
  come pillola sabbia `--type-caption`.
- **Colonna testo** x 680-1360 (contenuto fino a 600): occhiello a y 112; h1 64/64; «Quanto»
  32/36; cartellino 600×84; azioni in pagina (primario «Salva per il viaggio», secondari
  «Guarda il reel» e «Condividi»); poi le sezioni 1-4 come su mobile (tavola «Vicino a questo»
  600×360, tessere in 4 colonne); la fascia «Il reel» larga come la colonna testo.
- **Link diretto e apertura dall'app** hanno la stessa veste (nessun banco). Il ritorno a
  Esplora rimette lo scroll (M8 di A2).
- **768**: copertina 768×520; corpo su una colonna di 560 centrata. **1024**: colonna foto 440,
  testo 520.

#### 5.4 La Mappa a 79 punti

URL `#mappa`, `#mappa-<regione>`, `#mappa-europa`, `#mappa-asia`, `#mappa-americhe`.

**Quattro tavole** (SVG locale su carta con trama, cornice graduata, reticolo al 12%, scala in
km e nord come in A2; **nessun contorno, nessuna tinta d'area, nessuna tessera prima del
consenso**):

| Tavola | Estensione | Contenuto |
| --- | --- | --- |
| I · Italia | 6,5-18,5° E, 36,5-47,5° N | 59 posti |
| II · Europa | circa 5° O-21° E, 39-53° N [VERIFY: estensione dai punti con 10% di margine] | 12 posti, più l'Italia come **un solo gruppo** «ITALIA 59» sulla media dei punti italiani, che porta alla Tavola I |
| III · Asia | dall'estensione dei punti con 10% di margine | 7 posti (Malesia e Shanghai, agli angoli opposti della tavola) |
| IV · Americhe | dall'unico punto, con un margine di 6° | 1 posto e la frase «L'unico posto nelle Americhe, per ora.» |

Il titolo della tavola va in `--type-eyebrow` in alto a sinistra dentro la cornice («TAVOLA I ·
ITALIA»). Non è un codice d'archivio: è il nome della tavola, come in un atlante.

**Livelli sulla Tavola I**
- **Livello 0 (Italia):** un **gruppo per regione** sulla media delle coordinate dei suoi posti.
  - regione con 1 posto: punto da 7 px ink, etichetta solo al passaggio o al fuoco;
  - regione con 2 o più posti: anello di 1,5 px ink, diametro per fascia (2-4 → 24, 5-12 → 32,
    13+ → 40), fondo carta, numero dentro in Fraunces 460 13/16 `tabular-nums`, e accanto il
    nome della regione in `--type-eyebrow` spaziato 0.2em («LOMBARDIA»). Posizione del nome con
    l'algoritmo avido di A2 (destra, sinistra, sopra, sotto).
  - Le etichette sono al massimo una per regione: con 79 posti la tavola resta leggibile.
- **Livello 1 (regione):** il tocco su un gruppo **avvicina** la tavola al rettangolo dei suoi
  punti più il 20% (animazione M-C, §6.2). I punti diventano singoli (7 px); le etichette sono
  i nomi dei posti (tondo, `--type-map`) con l'algoritmo avido; le regioni vicine restano come
  punti al 30% di opacità, per contesto. In alto a sinistra «‹ Italia» per tornare. Scala in km
  ricalcolata.
- **Livello 2 (posto):** il tocco su un punto lo sceglie (M11 di A2): punto da 12 in
  `--color-accent-text` con etichetta Fraunces 520, e la riga d'azione mobile mostra miniatura,
  nome, comune e «Apri la scheda». Un secondo tocco sullo stesso punto, o «Apri la scheda», apre
  la scheda con **F5** (§6.1).

**390×844**
- 0-52 barra alta; 64-104 h1 `--type-poster` «Dove siamo stati» (1 riga); 112-130
  `--type-label`: «In Italia e in altri 10 paesi. Tocca una regione per avvicinarti.» [numero
  calcolato].
- 142-590: **tavola corrente** 350×448.
- 602-734: **«Fuori d'Italia»**, tre riquadri 110×110 (gap 10) con la tavola in miniatura (punti
  da 3 px) e sotto «Europa · 12», «Asia · 7», «Americhe · 1». Sono pulsanti con `aria-pressed`:
  il tocco mette quella tavola al posto della corrente; quando è attiva un'estera, il primo
  riquadro diventa «Italia · 59».
- Sotto: il registro per regione della tavola corrente (le righe della vista Elenco, §5.2).
- Comando «Mappa» e consenso dentro la tavola, come in A2 (P0-10 di A2 resta valido).

**1440×900: banco a due più uno.** A = registro per regione, 360 (x 24-384), con le
intestazioni fisse. B = tavola corrente 1008×804 (x 408-1416), con le **Tavole II-IV come
riquadri** 180×180 posati negli angoli senza punti. La posizione si calcola evitando i punti: a
livello 0, per esempio, l'angolo in basso a sinistra della Tavola I è libero. C = il posto scelto
come foglio da 496 che sostituisce la metà destra di B, con la foto 5:7 da 200×280, il cartiglio
senza nome, il nome, il cartellino e «Apri la scheda». Niente separatori trascinabili.

**Bonus P2, «Carta bianca»:** sotto il registro della Tavola I, la riga in corsivo matita «Nessun
posto con la scheda, per ora:» seguita dalle regioni italiane senza posti tra i 79, calcolate
dall'elenco ufficiale delle 20 regioni. **Mai** «non ci siamo stati».

#### 5.5 Il rullino dei mesi (vista «Per mese» di Esplora)

**Cosa racconta.** La storia di una coppia per reel pubblicati, da agosto 2026 a maggio 2024: 28
sezioni, una per mese, dal più recente. Sempre al livello del comune. Mai un punto, mai «siamo
stati», mai «visitato».

**390×844**
- Stessa testata di Esplora; il selettore di vista è su «Per mese». Niente porte, niente
  pillole: il filtro qui è il tempo.
- **Striscia del mese fissa** (`sticky; top:52px`), h 48: a sinistra il mese in lettura in
  Fraunces *italic* 400 20/24 («settembre») più l'anno `--type-year` 16; a destra «Cambia mese»
  (ChevronDown 16), che apre un foglio con la griglia dei 28 mesi (tre righe: 2024 da maggio a
  dicembre, 2025 da gennaio a dicembre, 2026 da gennaio ad agosto). I mesi vuoti sono in matita
  e non si possono premere.
- **Sezione del mese:**
  - testata: il nome del mese `--type-month` 64/60 corsivo minuscolo in ink («settembre»),
    accanto in alto l'anno `--type-year` e sotto una riga `--type-label` calcolata: «{n} posti ·
    {comuni separati da virgola}»;
  - fotogrammi in base al numero: **1** → una tessera grande 350×438 con il cartiglio; **2-4** →
    2 colonne S; **5 o più** → 3 colonne da 109×153, con il nome sotto in `--type-label-strong`;
  - 64 px tra i mesi.
- **Mese vuoto** (`data-vuoto`): una sola riga di 72 px, con il nome del mese in Fraunces
  *italic* 400 28/32 `--color-matita` più l'anno, e sotto `--type-label` muted: «Nessun posto con
  la scheda da questo mese.» È la pagina bianca del diario: si vede ma non occupa spazio.
- Il cambio del mese nella striscia fissa usa **M-B** (§6.2).

**1440×900**
- In testa, fisso sotto la barra alta, l'**indice dei mesi** su 3 righe (anni) con celle
  48×32 in `--type-label` («mag», «giu», …). I mesi con posti sono in ink e cliccabili, quelli
  vuoti in matita e disattivi. Il mese in lettura ha la sottolineatura di 2 px in accento.
  Nessuna intensità di colore, nessun numero nelle celle (niente mappa di calore).
- Ogni mese è una **riga**: a sinistra (x 40-340), fissa dentro la riga, la testata con il mese a
  96/88, l'anno e i comuni; a destra (x 380-1400) i fotogrammi 5:7 da 184×258 in fila che va a
  capo (fino a 5), con nome e comune sotto. Un mese con un solo posto usa la tessera L (380×532)
  con il cartiglio.
- Mese vuoto: riga di 88 con il mese in matita a 40/44 e la frase.

#### 5.6 Ricerca ⌘K a scala 79

Resta la palette di A2 (pattern combobox più listbox, tastiera, `<mark>` sottolineato in accento).
Cambia il contenuto:
- ricerca senza accenti e senza maiuscole, per prefisso di parola, su: nome, comune,
  regione, paese, categoria e **domanda** (`hook`);
- **gruppi**, in quest'ordine, 5 righe al massimo per gruppo con «Mostra tutti ({n})»:
  1. «Posti» (miniatura 40×56, nome, comune e punti di categoria);
  2. «Domande»: la domanda in Fraunces *italic* 17/22 con la parte trovata segnata e sotto il
     nome in `--type-label` («gabbia» → «Dormiresti in una gabbia?» · Emotional Grand Motel);
  3. «Comuni e regioni» (MapPin 16, «Lombardia · 21 posti»), che porta alla Mappa su quel livello;
  4. «Categorie» (punto colore, «Food & Ristoranti · 37»), che porta a Esplora con la pillola
     attiva;
- **senza testo:** «Prova con:» e quattro esempi presi dai dati, come pillole: «sushi»,
  «Madrid», «Relax», «gabbia»; poi «Vai a» (voci);
- **nessun risultato:** «Nessun posto per «{x}». Prova con il nome di una città o con una parola
  della domanda.»;
- 390: a tutto schermo, righe da 64. 1440: pannello 640, come in A2.

#### 5.7 I miei posti

- **390, vuoto:** h1 «I miei posti»; blocco carta con la frase in Fraunces *italic* 22/28 matita
  «Qui finiscono i posti che salvi.» e il testo seo di A2; poi «Da dove cominciare» con 3 tessere
  S (il posto di oggi e i suoi due vicini più prossimi). Nessuna casualità.
- **390, con salvati:** h1; **«Il tuo atlante»**: tavola 350×220 inquadrata sui salvati (punti
  con anello, come in A2), con la scala; poi la fila di pillole delle **raccolte**: «Tutti i
  salvati» (sempre prima), le raccolte create e «+ Nuova raccolta» (un foglio con il campo nome e
  «Crea»); poi le righe da 96 (miniatura 56×78, nome, comune, «Salvato il 29 set», cuore 44×44 che
  toglie, con «Tolto · Annulla» per 5 s).
- **Raccolta aperta:** copertina a **mosaico 2×2** con i primi 4 fotogrammi (T2), nome della
  raccolta `--type-title-2`, frase calcolata «{n} posti, al massimo a {km} km l'uno dall'altro in
  linea d'aria» (distanza massima tra coppie, dalle coordinate). Nella riga d'azione: primario
  «Manda la raccolta» (condivisione nativa o copia del link `#lista-<codici>`), secondario
  «Vedi sulla carta».
- **Chi riceve il link** vede «Una raccolta da aggiungere»: il mosaico, le righe, il primario
  «Aggiungi ai miei posti» (mai sovrascrive) e il secondario «Solo guardare».
- **Senza rete e valigia:** nell'artifact non c'è service worker, quindi **nessuna promessa
  offline**. La riga dice solo «Salvati in questo browser. Per ritrovarli altrove, manda la
  raccolta.»
- **1440:** a sinistra (x 40-400) le raccolte come registro con i mosaici 64×64; al centro le
  righe; a destra (x 1000-1400) «Il tuo atlante» 400×520.

#### 5.8 Noi, con le lenti

- **390:** occhiello «Travelliniwithus»; h1 `--type-poster` 38/40 «Rodrigo e Betta»; sotto un
  **cartiglio del brand su carta** (senza foto): nome «RODRIGO E BETTA», domanda «Posti che
  sembrano inventati?», filetto, «Travelliniwithus». È l'unico cartiglio senza fotogramma, ed è
  il nostro.
- **«Come lo raccontiamo»**: tre principi numerati (1 Il reel, 2 Il controllo, 3 A che titolo),
  ognuno con un **esempio vero** preso dai dati e mostrato come riga del cartellino («Controllato
  il 15 ago 2026 su granducacampigna.it»).
- **«Tutti i fotogrammi vengono dai nostri reel.»** e una fila di 12 celle del provino (T2),
  escluse quelle in evidenza vietata, con il link «Tutto l'archivio».
- **Le edizioni**, gruppo di scelta come in A2 (Viaggiatori, Family, Collaborazioni). La lente
  **Collaborazioni** aggiunge sotto una frase di trasparenza calcolata, in `--type-body` (non una
  striscia di cifre): «Su {79} posti, {33} hanno una collaborazione dichiarata: {17} su invito,
  {11} ADV, {4} in collaborazione, {1} con affiliazione.» Più «Media kit e come lavoriamo ↗». La
  lente **Family** mostra solo il rimando a @travellinifamily, senza copertine (sono in attesa per
  default).
- Guida in regalo, «Su questo dispositivo», colofone (A2).
- **1440:** colonna di 640 a sinistra; a destra, fisso, il cartiglio del brand 400×300 su carta.

### 6. Movimento e drammaturgia

Regole comuni di A2 invariate: solo `transform`, `opacity` e istantanee delle View Transitions.
C'è **una eccezione dichiarata**: `clip-path` in F5 (pittura di un solo elemento per 360 ms). Un
gesto per transizione, l'uscita più corta dell'entrata, l'LCP mai animato, e nessuna animazione
legata allo scroll (i cambi a soglia con IntersectionObserver sono ammessi).

#### 6.1 Cinque momenti-firma (con lo stato a riposo che si vede nelle catture)

| # | Firma | Stato a riposo (visibile senza toccare) | Gesto | Durata · easing | Reduced motion | Regola di onestà |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | **Il volo del fotogramma** (evoluzione di M1) | il cartiglio sulle L, sull'eroe e sulla lente | tessera, cella o lente → scheda: la foto **con il suo cartiglio** vola nella copertina (lo stesso `view-transition-name`), poi salgono h1, «Quanto» e cartellino (12→0 px, a 40 ms l'uno dall'altro) | 320 · `--ease-out`; testo da 120 ms | cambio istantaneo, fuoco sull'h1 | il cartiglio che vola è lo stesso testo del dato |
| F2 | **Il retro del fotogramma** (convalidato, più ricco) | orecchia di carta 20×20 nell'angolo in basso a sinistra della copertina | bollo o orecchia → la copertina ruota (M3 più M4 di A2) | 100 + 400 · `--ease-in-out`; il timbro atterra in 160 | facce scambiate subito | ogni riga del retro è un campo del dato; il timbro datario compare solo se c'è `checked.at` |
| F3 | **Dalla foto alla locandina** (convalidato, ripensato) | badge «Reel · Instagram ↗» nella fascia «Il reel» | «Guarda il reel»: prima il **cartiglio ricomposto svanisce** (120 ms), poi il ritaglio si apre fino al 9:16 intero e compare **il cartiglio stampato vero** nello stesso punto; il fondo inchiostro sale | 120 + 320 · `--ease-out` | istantaneo | il cartiglio vero si vede solo qui, con il badge; il link porta al permalink |
| F4 | **La lente sul provino** (nuova, dall'archivio) | le pillole sopra il provino della Home desktop e sopra la griglia | una categoria, una zona o un budget: nel **provino** le celle escluse si coprono di `--color-lente-velo`, mentre quelle incluse restano piene con un filetto di 3 px del colore; **le posizioni non cambiano**. Nella **griglia di Esplora** gli esclusi escono (opacità 1→0, 120 ms), i rimasti si ricompongono con FLIP (solo `transform`) | provino 180 · `--ease-out`, sfalsato per colonna, al massimo 240 in tutto; griglia 120 + 260 | velo e ricomposizione istantanei | l'ordine resta sempre quello della data: nessuna classifica nascosta; i numeri sono calcolati |
| F5 | **Dalla carta alla scheda** (nuova, dall'archivio) | punto scelto da 12 px con l'etichetta in Fraunces 520 | secondo tocco o «Apri la scheda»: la copertina nuova si apre come un **cerchio che cresce dal punto** (`clip-path: circle(0 at x y)` → `circle(150%)` sull'istantanea nuova della View Transition), poi F1 per il testo | 360 · `--ease-out` | istantaneo | parte dalla posizione vera del punto sulla tavola: il gesto dice «dove», poi «cosa» |

**Firme che stanno nelle catture:** per ciascuna, una cattura a riposo, una a metà (tempo
congelato con `page.clock` o animazioni in pausa a 50%) e una finale.

#### 6.2 Movimenti di sistema nuovi

| # | Movimento | Dove | Durata | Cosa si muove | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| M-A | **Ingresso: la risposta dopo la domanda** | Home, una volta per sessione (`sessionStorage`) | «Ma esistono davvero.» parte a 350 ms: 320 · `--ease-out` | solo la seconda frase dell'h1: opacità 0→1 e translateY 8→0. L'eroe (LCP) e il resto sono fermi. Lo spazio della frase è già riservato | tutto subito |
| M-B | **Il cambio di mese** | striscia fissa del rullino | uscita 140 · `--ease-in`, entrata 200 · `--ease-out` | il mese vecchio sale di 8 px e svanisce, il nuovo entra da 8 px sotto, come una pagina di calendario. Soglia con IntersectionObserver sulle testate | cambio istantaneo |
| M-C | **Avvicinare la tavola** | Mappa, livello 0 ↔ 1 | 320 · `--ease-in-out` | `transform: scale/translate` sul gruppo SVG dei punti; le etichette del livello nuovo compaiono **dopo** (opacità 160 ms), mai durante | salto istantaneo |
| M-D | **La lente della Home si sposta** | Home desktop | 160 · `--ease-out` | dissolvenza incrociata tra due livelli sovrapposti della lente (foto più cartiglio); la foto nuova entra solo dopo `decode()` | cambio istantaneo |
| M-E | **Porta → risultati** | Esplora | scorrimento nativo `smooth` (mai con reduced motion), poi F4 | — | salto più velo istantaneo |

#### 6.3 Costo su mobile con 79 foto (budget verificabili)

- Primo schermo della Home a 390: **al massimo 1 immagine T0** più le T2 che rientrano nel
  viewport (nessuna nel primo schermo). Richieste di immagini prima dello scroll: ≤ 3.
- Provino: T2 lazy; `content-visibility:auto` sulle righe; nessun livello sfocato.
- Esplora: T1 lazy; con FLIP si animano solo gli elementi nel viewport più 1 schermo (gli altri
  saltano alla posizione finale).
- Lente e porte: le T1 si caricano al primo passaggio o quando entrano nel viewport.
- Memoria: stima delle T2 decodificate intorno a 160×224×4 byte ciascuna, meno di 12 MB per
  tutte e 79 `[VERIFY: misura con performance.memory in Chromium]`.
- **CLS < 0,02** su Home, Esplora, Scheda e Mappa, con le immagini ritardate di 800 ms.

### 7. Stati dei componenti nuovi (gli altri restano quelli di A2 §2.9)

| Componente | Default | Hover | Focus | Pressed | Attivo | Vuoto / errore |
| --- | --- | --- | --- | --- | --- | --- |
| Cartiglio | sabbia, righe §3 | n/a (è dentro un link) | l'anello va sul link che lo contiene | n/a | n/a | nessun `hook`: il cartiglio non esiste |
| Cella del provino | foto T2 su colore dominante | anello interno 2 px ink e la lente si sposta (desktop) | anello 2 px `--color-accent-text` interno | scale .96 | lente: velo sugli esclusi, filetto 3 px sugli inclusi | immagine mancante: carta con il nome in Fraunces 12/14, mai l'icona rotta |
| Porta | foto più fascia colore | foto scale 1.03 (300 ms) | anello attorno a tutta la porta | scale .97 | `aria-pressed=true`: filetto di 3 px ink sopra la fascia e Check 16 prima del nome | n/a |
| Pillola | bordo `--color-border`, testo ink | bordo ink | anello | scale .97 | fondo `--color-atlante-carta-deep`, bordo 1,5 ink, Check 16 (o punto di categoria) | n/a |
| Tessera L | foto 4:5 con cartiglio, nome, meta | foto scale 1.02 e nome sottolineato | anello sulla foto | scale .98 | aperta: anello interno ink | immagine mancante: carta con il cartiglio sopra (che c'è comunque) |
| Cartellino | 3 celle su carta | n/a | la cella con il link ha l'anello sul link | n/a | n/a | «Non ancora» solo nella cella controllo del posto senza controllo |
| Gruppo sulla carta | anello, numero e nome | anello 2 px | anello `--color-atlante-timbro-text` a 4 px | scale .92 | livello aperto: il gruppo sparisce e restano i punti | n/a |
| Riquadro tavola estera | tavola mini con il titolo | bordo 1,5 ink | anello | scale .97 | `aria-pressed`: bordo 2 ink più la dicitura «Tavola aperta» | n/a |
| Riga del mese vuoto | matita e frase | n/a | n/a | n/a | n/a | è essa stessa lo stato vuoto |
| Riga di vicinanza | miniatura, nome, km | nome sottolineato | anello `--radius-md` | fondo carta | n/a | oltre 150 km: una riga sola con la distanza |

---

### 8. Tre idee «avanzate» (con la regola che le tiene oneste)

1. **La lente sul provino** (F4; P1). L'archivio intero resta fermo, in ordine di data, e una
   pillola ne accende una parte: le 13 celle di Relax, le 20 fuori d'Italia, le 25 con la fascia
   di spesa. Si vede la *forma* di una categoria nel tempo, per esempio se i reel di Food si
   addensano in certi mesi. Nessun sito generico ha un archivio personale da mostrare così.
   *Regola:* niente ordini nascosti o classifiche, niente «più visti»; ordine sempre per data del
   reel; conteggi calcolati; l'etichetta dice «reel usciti», non «stagione giusta».
2. **Nello stesso giro** (§5.3 punto 3 e §5.7; P1). Dai 4 vicini con i km veri nasce il gesto
   «Salva il giro», che crea una raccolta «{Comune} e dintorni» con il posto e i vicini entro 30
   km `[VERIFY soglia con growth]`. La raccolta mostra la tavola con i filetti e la frase «al
   massimo a {km} km l'uno dall'altro». *Regola:* sempre «in linea d'aria», mai tempi o strade,
   mai «il nostro itinerario» (non l'hanno fatto in quel giro); solo i vicini precalcolati dal
   dato.
3. **L'indice delle domande** (P2). Nella vista Elenco, l'interruttore «Per domanda» elenca
   tutte le domande dei reel, raggruppate per prima parola quando un gruppo ha almeno 3 domande
   («Dormiresti…?», «Ceneresti…?») e poi «Altre domande». Ogni riga ha la domanda in Fraunces
   *italic* 20/28 e sotto nome e comune. È il modo in cui il pubblico ricorda i reel, e nessun
   sito di viaggi ha questo materiale. *Regola:* domande alla lettera dal campo `hook`, nessuna
   riscritta; i gruppi si calcolano dalla prima parola e non si curano a mano; la domanda non è
   una promessa, perché la risposta è la scheda.

**Scartate in questo giro:** la stagionalità come consiglio («da fare a settembre»), perché la
data è di pubblicazione e non di visita; il planisfero con 20 punti, che senza contorni è un
vuoto con dei puntini; i codici di griglia nell'indice («Tav. I · C4»), perché la sintesi ha già
scartato i codici d'archivio; l'autoplay del provino, perché è un'animazione decorativa.

---

### 9. SPECIFICA per il costruttore

**Dove.** Prototipo nuovo `SCRATCH/prototipi/A3/index.html`: una pagina pubblicabile come
artifact, in HTML, CSS e JS senza librerie né rete, con le font incorporate come data-URI e le
immagini dai file pubblicati. Dati da `SCRATCH/prototipi/A3/assets/a3-data.js`. **A e A2 non si
modificano.** Catture in `SCRATCH/prototipi/A3/shots/`.

#### 9.0 Dati e rotte (prerequisiti)

- **Campi usati** (nomi semantici, da mappare sul formato di a3-data.js): `slug`, `nome`
  (`title`), `comune`, `regione` (normalizzata), `paese`, `zona`, `coord`, `hook`, `descrizione`,
  `price` (testo), `budget` (Basso/Medio/Alto), `controllo {fonte, data}`, `toKnow[]`,
  `gettingThere`, `website`, `dichiarazione {tipo, partner}`, `permalink`, `dataReel`, `categorie[]`,
  `vicini[4] {slug, km}`, `dominante`, `anteprima`, `varianti {s, m, l}`, `coverFocusY`,
  **`cartiglio`** (frazione, default 0,22 finché asset-curator non misura) e **`evidenza`**
  (booleano; `false` per l'elenco del §12 finché l'owner non conferma).
- **Normalizzazione:** i nomi delle regioni (trattini, maiuscole) prima di ogni raggruppamento.
- **Rotte hash a un solo token:** `#home`, `#esplora`, `#esplora-mesi`, `#esplora-elenco`,
  `#mappa`, `#mappa-<regione>`, `#mappa-europa`, `#mappa-asia`, `#mappa-americhe`,
  `#posto-<slug>`, `#miei`, `#lista-<codici>` (i codici sono gli indici dei posti in base 36, 2
  caratteri ciascuno, concatenati), `#noi`. Parametri per le catture: `?oggi=AAAA-MM-GG`,
  `?attesa=carta` (vedi §12).

#### P0: primo giro, senza queste non è un prodotto

**P0-1 · 79 posti veri ovunque**
- Home, Esplora, Mappa, ricerca e rullino leggono tutti i 79 posti. Nessuna nota «nel
  prototipo», nessun numero scritto a mano.
- PW: `document.querySelectorAll('.provino-cella').length === 79` su `#home` a 390;
  `[data-count]` di Esplora senza filtri = 79; somma dei numeri dei gruppi della Tavola I più i
  punti singoli = 59; Tavole II + III + IV = 20. Ogni `[data-count]` è uguale agli elementi
  mostrati. Nessun nodo di testo contiene «nel prototipo».

**P0-2 · Token A3, scala tipografica, colori di categoria**
- §1.1, §1.2, §2. Nessun esadecimale fuori da `:root`.
- PW: l'insieme dei `font-size` calcolati dei nodi di testo visibili a 390, 768, 1024 e 1440 è
  contenuto in {12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 32, 38, 40, 56, 64, 72, 96};
  nessun nodo di testo ha `color` uguale a un colore di categoria né a rgb(255, 77, 26); axe con
  0 violazioni di contrasto su tutte le catture.

**P0-3 · Cartiglio ricomposto**
- §3, tutti i contesti della tabella.
- PW: su ogni `.cartiglio`, il testo di `.domanda` è uguale al campo `hook` del suo posto
  (confronto con i dati esposti in `window.__A3`); `.domanda` ha al massimo 3 righe
  (`height / lineHeight ≤ 3,05`); il riquadro sta tutto dentro la foto; il `boundingBox` del
  cartiglio non cambia tra il primo paint e dopo `document.fonts.ready` (±0,5). Sulla scheda la
  riga del nome del cartiglio non esiste.

**P0-4 · Regola del cartiglio su tutti i 79 e su tutti i tagli**
- Formula di A2 §2.8 estesa a 5:7, 4:5, 1:1 (porte), eroe, copertina e colonna.
- PW: per ogni `img[data-slug]` visibile in Home, Esplora (S, L, porte), Scheda (le 79 schede,
  in ciclo) e Rullino si calcola `visibleTop` da dimensioni, `object-position` e `transform`, e
  deve valere almeno `data-cartiglio + 0,01`.

**P0-5 · Home 390 e 1440 (§5.1)**
- PW a 390×844 con `?oggi=2026-09-29`: l'eroe è 390×440 ±2 da y 52; l'h1 finisce entro y 788;
  il campo di ricerca è visibile senza scroll; il posto dell'eroe ha `evidenza=true`, `hook` e
  `price` o `budget`, e il mese del suo reel è settembre (se ne esiste uno eleggibile); le celle
  del provino sono in ordine di `dataReel` decrescente; esistono 3 righe d'anno.
- PW a 1440×900: esistono `.blocco-titolo` (518×474 ±4) e `.lente` (344×474 ±4, rapporto 0,726
  ±0,01); le celle nel viewport sono almeno 60; `hover` su una cella cambia `data-slug` della
  lente entro 300 ms; `mouseleave` dal foglio lo riporta al posto di oggi. La lente non usa mai
  un posto con `evidenza=false`.

**P0-6 · Scheda con cartellino (§4, §5.3)**
- PW, in ciclo sulle 79 schede a 390: `.cartellino [data-cell]` è 3; ogni cella ha un valore
  non vuoto; il testo «non ancora» compare in una sola scheda (quella senza controllo);
  `[data-quanto]` esiste se e solo se c'è `price` o `budget`; `[data-prezzo-mancante]` esiste se
  e solo se mancano entrambi; nelle schede con il nome su una riga il cartellino finisce entro
  y 728. A 1440: `.colonna-foto` è 620 ±4 di larghezza e 836 ±4 di altezza, `position: sticky`.
- «Vicino a questo»: le distanze mostrate sono uguali a `vicini[].km` (arrotondate come nel
  dato); il titolo segue le soglie 30/150; oltre 150 km c'è una riga sola.

**P0-7 · Esplora a scala (§5.2)**
- Porte (6, solo le categorie con almeno 5 posti), pillole in fila fissa, riga del risultato,
  ritmo S/L, fine elenco, vuoto dei filtri con i tasti «Togli …».
- PW: `.porta` è 6; nessuna porta con meno di 5 posti; la pillola «Italia» porta alla fila delle
  regioni; ogni combinazione porta–zona dà `[data-count]` uguale al conteggio dei dati; le
  `.tessera--l` non hanno mai `evidenza=false`; l'ordine delle `data-slug` è uguale all'ordine
  atteso (L compresa); Borghi e città d'arte più Italia dà lo stato vuoto (l'unico posto Borghi è
  in Francia) con un tasto «Togli» per filtro e il numero corretto di ciascuno; a 390
  `scrollWidth === clientWidth` (le file orizzontali scorrono dentro il loro contenitore).

**P0-8 · Mappa a gruppi e quattro tavole (§5.4)**
- PW: a livello 0 i `[data-cluster]` sono tanti quante le regioni con almeno 2 posti; nessuna
  coppia di etichette visibili si sovrappone; il clic su «Lombardia» mostra 21 `[data-punto]`
  [VERIFY dopo la normalizzazione] e `#mappa-lombardia`; i riquadri esteri hanno 12, 7 e 1 punti;
  nella Tavola II esiste `[data-cluster="italia"]` con il testo 59; `page.on('request')` non
  registra host esterni; nessun testo di grado dentro la cornice (A2 P0-13).

**P0-9 · F1, F2, F3 portati a 79**
- F1 con il cartiglio nel gruppo che vola; F2 con orecchia e retro più ricco (righe: Reel, Dove,
  Quanto oppure «—», A che titolo, Il più vicino, cioè nome e km); F3 con l'uscita del
  cartiglio ricomposto prima dell'apertura.
- PW: `startViewTransition` viene chiamato al clic su una cella, su una L e sulla lente, e non
  con `reducedMotion: 'reduce'`; dopo il clic sull'orecchia esiste `.cover[data-face="back"]`
  con il `boundingBox` invariato; in F3, a 60 ms, `.cartiglio` ha opacità < 1 e la locandina ha
  ancora il rapporto della copertina; alla fine il rapporto è 0,5625 ±0,01.

**P0-10 · Ricerca a scala (§5.6)**
- PW: «gabbia» dà un risultato nel gruppo «Domande» con `<mark>`; «madrid» dà almeno 2 posti;
  «emilia romagna» (senza trattino) trova la regione normalizzata; ↑↓ cambiano
  `aria-activedescendant`; Invio apre la scheda o il livello della Mappa.

**P0-11 · Punti di rottura, overflow, CLS**
- PW a 390, 768, 1024 e 1440: `scrollWidth === clientWidth`; CLS < 0,02 (PerformanceObserver
  `layout-shift`) su Home, Esplora, Scheda e Mappa con le immagini ritardate di 800 ms via
  `page.route`; prima dello scroll della Home a 390 partono al massimo 3 richieste di immagini.

#### P1: la rende avanzata

**P1-1 · Ingresso M-A** (primo giro)
- PW: con `sessionStorage` vuoto, al tempo 0 la seconda frase dell'h1 ha opacità < 0,1 e
  l'immagine dell'eroe ha opacità 1 e nessuna animazione; a 800 ms la frase ha opacità 1; al
  secondo caricamento nella stessa sessione non c'è animazione.

**P1-2 · Rullino dei mesi e M-B (§5.5)** (secondo giro, primo punto)
- PW: `[data-mese]` è 28, dal 2026-08 al 2024-05 in ordine decrescente; i mesi senza posti hanno
  `data-vuoto` e la frase; la somma dei posti nei mesi è 79; nessun nodo di testo contiene
  «visitat», «ci siamo stati» o «siamo stati a»; la striscia fissa cambia testo dopo lo scroll
  oltre una testata; a 1440 le celle vuote dell'indice sono `aria-disabled`.

**P1-3 · F4 La lente** (secondo giro)
- PW: sul provino della Home, attivando «Relax» ci sono 13 celle senza velo e le altre con velo
  (o i numeri del dato); il `boundingBox` di ogni cella resta invariato ±0; nella griglia di
  Esplora le animazioni attive (`document.getAnimations()`) toccano solo `transform` e
  `opacity`.

**P1-4 · F5 Dalla carta alla scheda e M-C** (secondo giro)
- PW: il secondo tocco su un punto chiama `startViewTransition`; durante il passaggio l'istantanea
  nuova ha `clip-path` con un centro entro ±8 px dal centro del punto; con reduced motion, nessuna
  transizione.

**P1-5 · Colonna «Carta» di Esplora desktop, con la sincronia** (secondo giro)
**P1-6 · I miei posti v3 (§5.7):** raccolte, mosaico, `#lista-<codici>`, vista di chi riceve
(secondo giro).
- PW: la creazione di una raccolta con 3 posti genera un hash che, aperto in una pagina nuova,
  mostra «Una raccolta da aggiungere» con le stesse 3 `data-slug`; «Aggiungi» non toglie mai i
  salvati esistenti.

**P1-7 · Nello stesso giro (idea 2)** (secondo giro)
**P1-8 · Noi con le lenti e il cartiglio del brand (§5.8)** (secondo giro)
- PW: la frase di trasparenza nella lente Collaborazioni ha numeri uguali ai conteggi dei dati.

#### P2: rifiniture

- P2-1 L'indice delle domande (idea 3).
- P2-2 Carta bianca (§5.4 bonus).
- P2-3 Filtro timbro (§1.4).
- P2-4 Rifiniture a 768 e 1024 oltre ai criteri P0-11.
- P2-5 `?attesa=carta`: le celle in evidenza vietata diventano carte tipografiche nel provino,
  come alternativa da mostrare all'owner.

#### Ordine di costruzione in due passaggi

**Primo giro: deve già stupire.**
1. Dati: i 79 posti, la normalizzazione, `evidenza` e `cartiglio` (P0-1).
2. `:root` A3, le superfici, la trama, i colori di categoria (P0-2).
3. Il cartiglio ricomposto come componente unico (P0-3) e la regola del cartiglio (P0-4).
4. **Home 390 e 1440 con provino e lente** (P0-5), più l'ingresso (P1-1).
5. **Scheda** mobile e colonna desktop con cartellino, Prima di andare, Vicino a questo, Altri
   della categoria e fascia «Il reel» (P0-6).
6. **Esplora** Posti ed Elenco con porte, pillole, ritmo e vuoti (P0-7).
7. **Mappa**: livelli 0 e 1 e le tavole II-IV (P0-8).
8. F1, F2 e F3 portati sui 79 (P0-9).
9. Ricerca (P0-10).
10. Rottura, overflow e CLS (P0-11), poi le catture del primo giro.

**Secondo giro: profondità.**
1. Rullino dei mesi con M-B (P1-2).
2. F4 lente e FLIP (P1-3).
3. F5 e M-C (P1-4).
4. Colonna «Carta» (P1-5).
5. I miei posti v3 (P1-6) e Nello stesso giro (P1-7).
6. Noi (P1-8).
7. P2.
8. Catture finali e confronto A2/A3.

**Catture richieste** (a 390 e 1440 dove ha senso; a 768 e 1024 le principali):
`01-home` (390, 1440), `01b-home-provino-390`, `01c-home-lente-hover-1440`, `02-scheda-granduca`
(con prezzo), `02b-scheda-burton` (senza prezzo [VERIFY che non abbia budget; se ce l'ha, un
altro posto senza nessuno dei due]), `02c-scheda-cancun` (vicino oltre 150 km), `02d-scheda-sotto`
(Vicino a questo e fascia Il reel), `03-esplora` (con porte e pillole), `03b-esplora-food`
(porta attiva), `03c-esplora-vuoto`, `03d-esplora-l` (tessera L), `04-mappa-italia`,
`04b-mappa-lombardia`, `04c-mappa-europa`, `04d-mappa-punto`, `05-rullino`, `05b-mese-vuoto`,
`06-ricerca-gabbia`, `07-miei-raccolta`, `08-noi-collaborazioni`, e per ogni firma F1-F5 tre
catture (a riposo, a metà, alla fine). Poi `confronto-A2-A3-mobile.png` e
`confronto-A2-A3-desktop.png` affiancati, con le stesse schermate.

## Out of scope (do NOT touch)

- Prototipi A, A2 e B; `src/`; i file ad alto rischio; commit e push (li fa il main thread).
- Immagini nuove, generate, stock o esterne; contorni cartografici; tessere di mappa prima del
  consenso; geolocalizzazione; service worker.
- Copy definitivo (seo), diciture legali di «a che titolo» (seo e legale), soglie di growth.
- Posti fuori dai 79, tracce a matita, reel senza scheda, caption: non entrano in A3.
- Librerie JS, font nuovi, file `full` di Fraunces.

## Open questions / decisions for the user

1. **Colori delle tre categorie nuove:** Hotel = blu notte (token esistente), Posti particolari
   = salvia #8cc084, Weekend romantici = cipria #f2a7c3. *Raccomandato: sì.*
2. **Copertine da tenere fuori dall'evidenza:** l'elenco del §12, con due certe e le altre in
   dubbio. *Raccomandato:* confermarle una per una nel provino dell'owner. Fino ad allora sono
   `evidenza=false` (restano nella griglia al loro posto, mai grandi).
3. **Una fascia scura per pagina**, solo dove si guarda un reel. *Raccomandato: sì.* È il «banco
   luminoso» di B, ridotto a un momento.
4. **Fraunces 360 e 380** per i titoli oltre i 38 px. *Raccomandato: sì*, se il file incorporato
   ha l'asse; altrimenti 400.
5. **Diciture di «a che titolo»**, in particolare «Nessuna collaborazione» per i 46 posti
   organici (seo e legale, B5).

## Next hand-off

- Next agent: browser-auditor (catture A3, axe, rete, CLS) → travellini-ui-designer (revisione
  A3 con il §0 come griglia) → owner.
- Trigger: `A3/index.html` esiste, il primo giro (P0 più P1-1) è completo e le catture del primo
  giro sono in `A3/shots/`.
- In parallelo, senza bloccare: asset-curator misura `cartiglio` sui 79 e controlla a piena
  risoluzione l'elenco del §12; seo scrive le diciture del cartellino e le frasi dell'assenza;
  growth fissa la soglia di «Nello stesso giro».

## Notes

### 10. Da B e da A2 si riprende / si lascia

- **Da A2 resta:** guscio e piano unico (116/56), barra a 5 voci, regola del cartiglio e sua
  formula, M1-M11 dove non sostituiti, consenso dentro la tavola, palette ⌘K e stati di §2.9.
- **Da B si riprende:** il fotogramma grande e verticale su desktop (colonna fotografica) e il
  banco luminoso come unica fascia scura. **Non si riprende:** il fondo scuro del guscio e il
  cartiglio stampato nelle miniature.
- **Da A2 si lascia:** l'ossatura fissa con «non ancora», la copertina 16:9, il banco a tre in
  Esplora e I miei posti, i separatori trascinabili e la Home «prima pagina» a tre oggetti.

### 11. Miglioria operativa riusabile

**Regola «scala prima»:** quando il dataset è pubblico, i prototipi si fanno sul dataset intero,
mai su un sottoinsieme «per cautela». Un layout disegnato su 6 elementi è un altro layout, non
una versione ridotta, e giudicarlo porta a un giudizio sbagliato («bozza»). Da proporre per
`DESIGN.md` (sezione Layout Principles) e per il brief dei prossimi prototipi, insieme alla
regola «ogni firma di movimento ha uno stato a riposo visibile in cattura».

### 12. Da far confermare all'owner (copertine: numeri e nomi come nel `PROVINO`)

Le ho guardate nel provino a circa 100 px di larghezza: **non è un giudizio a piena
risoluzione**. Tutte partono con `evidenza=false` finché l'owner o asset-curator non le guarda a
piena misura.

**Certe (segnalate dal main thread):**
- 18 · Chiostro Cennini: gravidanza.
- 28 · Narciso Home: gravidanza.

**Dubbio: possibile gravidanza** (figura intera in abito ampio o chiaro, in piedi o di profilo):
- 5 · Alessandro Benini Wines
- 21 · Casa Lavanda, Podere Fossaccio
- 27 · Agriturismo Il Campagnino
- 36 · Garden Village Bled
- 56 · Nonno Andrea
- 60 · The Sense Experience Resort
- 62 · Iconic Marjorie Hotel

**Dubbio: possibili minori sullo sfondo** (luoghi affollati per famiglie):
- 3 · Storyland
- 11 · Rulantica
- 15 · Movieland Park & Caneva Aquapark
- 23 · Parco Cavour
- 33 · Shanghai Disneyland
- 41 · Phantasialand
- 52 · Europa-Park

**Non sensibili, ma con personaggi o marchi di terzi** (domanda aperta dell'asset-curator, n. 4).
Non vanno come eroe o porta finché non si decide:
- 3 · Storyland (personaggio in costume)
- 19 · Warner Bros. Studio Tour London
- 33 · Shanghai Disneyland
- 50 · Choco Story Torino (statua di un personaggio)

Nessuna copertina con contesti di salute l'ho riconosciuta a questa misura `[VERIFY]`.
