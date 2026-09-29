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
round: A3 (riscritto dopo la correzione dell'owner: l'archivio intero, non i soli 79 posti; la mappa vera è il cuore)
consumes:
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-raffinamento_to_frontend-builder.md (A2: sostituito dove qui è detto, valido altrove)
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md (fact pack: Esito in testa, §1, §2, §7, §12, §14, §15)
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_owner_sintesi-R2.md
  - BEST/src/components/map/FullScreenMapExperience.tsx (mappa del sito: livelli, tetto dei marcatori, stili)
---

# Handoff: A3, l'archivio intero. La carta come cuore, i 79 posti in inchiostro, tutto il resto a matita

Documento in un repo pubblico. **Nessun nome di locale che esista solo nel corpus**: le tracce
compaiono qui solo come «Traccia · comune di {comune}» o con regioni e paesi aggregati del fact
pack. I nomi citati sono solo tra i 79 posti visibili del sito. Nessun id di post, nessuna
coordinata, nessuna struttura sanitaria. Numeri di fatto: quelli del fact pack
(`HANDOFF_..._data-analyst_to_divergenza.md`) e del main thread; tutto il resto è misura di
progetto (px, ms) o `[VERIFY]`. **Nell'app nessun numero si scrive a mano: si calcola dal dato
mostrato.** Contrasti calcolati a mano (WCAG 2.x), da confermare con axe.

Abbreviazioni: `A2/NN` = catture di A2 in `SCRATCH/prototipi/A2/shots/`; `PROVINO` =
`SCRATCH/confronto/catalogo-79.png`; `CARTIGLI` = `SCRATCH/confronto/cartigli.png`; `FP §n` =
sezione del fact pack; `MAPPA-SITO` = `BEST/src/components/map/FullScreenMapExperience.tsx`.
`SCRATCH` = `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad`.

---

## Per l'owner, in una pagina

**Cosa cambia rispetto al prototipo di prima (A2), in parole semplici**

A2 mostrava 6 posti su una carta disegnata con 5 punti. A3 mostra **tutto quello che avete
pubblicato dal luglio 2021**, cioè più di mille post in 62 mesi, su **una carta vera**. I 79 posti
con la scheda sono il 6% dell'archivio: diventano i punti d'inchiostro, quelli completi. Tutto il
resto sono **tracce a matita**: un reel che sappiamo dov'è stato girato, ma di cui non abbiamo
ancora scritto la scheda.

1. **La Home si apre sulla carta.** Il primo schermo è una tavola d'atlante a tutta larghezza:
   coste, confini, laghi, i nomi delle regioni, e sopra tutti i vostri luoghi. L'Italia del Nord
   si riempie di quadretti a matita, i 79 posti sono punti d'inchiostro, e una fotografia (il posto
   di oggi, con la sua domanda) è appuntata sulla tavola. Sopra, in un cartiglio da atlante: «Posti
   che sembrano inventati. Ma esistono davvero.»
2. **La Mappa è quella vera, portata nel vostro stile.** Si avvicina in tre passi, come quella del
   sito: prima le regioni e i paesi con il loro numero («Lombardia»), poi i comuni, poi i singoli
   luoghi. Il posto con la scheda è un punto d'inchiostro con un anello; la traccia è un cerchietto
   a matita, vuoto e più piccolo. Ha una versione chiara (carta color crema) e una scura.
3. **La trama dell'archivio.** Dove avete girato tanto, la carta si riempie di quadretti a matita,
   come un taccuino a quadretti colorato a mano. Ogni quadretto è 5 km. È la firma della carta, e
   nessun sito di viaggi può averla.
4. **Tutto il mondo sulla stessa carta.** Europa, Asia, Americhe si raggiungono con un tocco (o
   rimpicciolendo), con i loro numeri. I 20 posti fuori d'Italia non stanno più in un riquadrino.
5. **Il rullino di 62 mesi.** Dal luglio 2021 ad agosto 2026 nessun mese è vuoto. Ogni mese ha il
   suo nome scritto enorme in corsivo, i comuni da cui vengono i reel, e le foto quando c'è una
   scheda.
6. **Si sfoglia in quattro modi:** per posto (i 79 con foto, porte colorate per categoria), per
   mese (il rullino), per luogo (un indice da atlante: regione, comune, luogo) e sulla carta.
7. **Le schede dei 79 posti restano ricche.** Il vostro cartiglio con la domanda è ricomposto sulla
   foto. Tre prove ci sono sempre (data del reel, controllo, a che titolo) e il prezzo compare
   grande quando c'è. «Vicino a questo» ora conta anche le tracce.
8. **Oggi le tracce sono solo testo.** Per le tracce non ci sono fotogrammi su disco. Oggi sono a
   matita, senza foto. Se la scansione con i fotogrammi arriva, una traccia prende la sua foto
   **solo dopo che l'avete approvata voi**.

**Perché non sarà più una bozza**
- La prima cosa che si vede è la mole vera dell'archivio su una carta credibile, non 6 card.
- Scala tipografica con contrasto (da 12 a 96 px), foto a filo schermo, un cartiglio riconoscibile
  da Instagram, due materiali (inchiostro e matita) che dicono subito cosa è completo e cosa no.
- Cinque momenti-firma, e due nascono dall'archivio: «l'atlante si apre» (dalla Home alla mappa) e
  «dalla carta alla scheda».
- Controlli automatici su tutti i luoghi, non su uno d'esempio.

**Cosa non cambia.** Fraunces e Inter, la sabbia, la terracotta, le foto vere, le icone lucide, la
barra a 5 voci. Niente feed, autoplay, storie, pop-up o dashboard. Niente visualizzazioni né like,
niente testo delle caption, niente posizioni esatte delle tracce.

**Sei decisioni vostre** (nessuna blocca il primo giro; la mia raccomandazione è in fondo):
1. copertina della Home **chiara** (crema) o **scura** (i punti come luci): le fotograferemo
   entrambe;
2. i quadretti della trama: se contarli per **luoghi** (raccomandato, per la privacy) o per reel;
3. la zona di casa (FP §14): se volete che i quadretti vicino a casa restino al tono più chiaro;
4. i colori di tre categorie nuove;
5. l'elenco dei fotogrammi da non mettere in evidenza;
6. le diciture di «a che titolo».

**Il primo giro** costruisce: la carta locale con i tre livelli e la trama, la Home-copertina, la
Mappa, il foglio della traccia, le schede dei 79, Esplora per posti, la ricerca. **Il secondo giro**
aggiunge il rullino dei 62 mesi, l'indice dei luoghi, la versione scura, i movimenti nuovi, «Il
mese negli anni», le raccolte, Noi con «Come è fatto questo atlante».

---

## Why this work matters

L'owner ha giudicato A2 una bozza. La correzione chiarisce il perché più profondo: il prodotto non
sono 79 schede, è **l'archivio di cinque anni di reel** con una mappa vera. A3 deve far sentire
quella mole nel primo schermo, dare due materiali leggibili (inchiostro per ciò che è completo,
matita per ciò che è traccia), e riusare nell'app vera la mappa MapLibre del sito portandola nel
brand. Il prototipo pubblicato deve rendere la stessa esperienza senza rete, con una base
cartografica locale da geometrie pubbliche.

## Decisions already made (bloccate: il builder non le rinegozia)

1. **Due strati, due materiali.** POSTO = uno dei 79 con scheda (foto, cartellino, indirizzo):
   **inchiostro**. TRACCIA = reel o post geolocalizzato senza scheda: **matita**. Mai confondibili,
   né per forma né per colore (§1).
2. **La carta è il cuore e il primo «wow».** La Home si apre su una tavola d'atlante (§7.1). La
   Mappa è la stessa carta resa interattiva (§6).
3. **Contorni sì, da geometria pubblica vera.** Ribalto la regola del mio giro precedente, «niente
   contorni di paese», che valeva per contorni disegnati a mano. Coste, confini e regioni vengono da
   Natural Earth (pubblico dominio): è lo stesso dato di `world-atlas` che il sito usa in
   `InteractiveMap.tsx`. Non si inventa nessun luogo: sono la base che rende la carta credibile.
4. **Costante unica di privacy: `GRIGLIA_KM = 5`.** Ogni traccia si posa al centro della sua cella
   di 5 km; niente coordinate più precise. La trama usa le stesse celle. Solo i 79 posti (attività
   pubbliche con indirizzo) hanno la posizione esatta.
5. **Le etichette generiche non sono punti.** Un geotag come «Italia» cade in Umbria (FP §7: 89
   reel). Le etichette generiche di livello comune si posano sul comune. Quelle di livello regione
   o paese non diventano segni: vivono nel rullino e nell'indice.
6. **Tracce in due stati:** (a) oggi solo testo a matita; (b) domani, con un fotogramma
   **certificato dall'owner**, la traccia mostra la foto ma resta traccia finché non ha la scheda
   (§1.3). Nessuna foto senza certificazione. Nel prototipo lo stato (b) è solo impaginazione, con
   un riquadro vuoto dichiarato.
7. **Riuso nell'app vera:** `FullScreenMapExperience` (MapLibre, OpenFreeMap, livelli territorio,
   area e posto, tetto di 60 marcatori, `?posto=<id>`, consenso prima delle tessere), portata nel
   brand (§6.9). **Satellite solo nell'app vera.**
8. **Il cartiglio ricomposto** resta il dispositivo dei 79 posti (§4). **Il cartellino** resta la
   prova (§5).
9. **Niente metriche e niente caption:** nessuna visualizzazione, like o commento, e nessun testo di
   caption, in nessuna schermata.
10. **Date di pubblicazione**, sempre: «reel del…», «reel di…». Mai «visitato», «ci siamo stati», o
    «nessun reel» detto come «non ci siamo stati».
11. **Evidenza vietata** per i fotogrammi in attesa (§13).
12. **Hash a un solo token**, niente rete, librerie, geolocalizzazione o login. Copy provvisorio,
    la parola finale spetta a seo.

---

## Context the receiver needs

### 0. Diagnosi aggiornata

**Verdetto su A2 come prodotto: Block. Vedi 1 blocker e 8 serious.** Direzione A confermata; la
scala e il cuore del prodotto erano sbagliati.

**Dalla diagnosi del main thread restano validi:** la Home senza idea, la scala tipografica timida,
i momenti-firma invisibili a riposo, la mancanza di profondità. **Si aggiunge:** la mappa è il cuore
dell'app e deve essere il primo «wow».

```
[blocker] tutta l'app — A2/09, A2/03, A2/05
Problema: 6 posti mostrati su un archivio di 1.283 post; la carta ha 5 punti su una griglia di
  gradi senza costa.
Perché conta: l'app nasconde proprio ciò che la rende unica, cinque anni di reel geolocalizzati.
Direzione: i due strati (posti e tracce) in ogni schermata; la carta come Home (§6, §7.1).
```
```
[serious] Mappa — A2/05, A2/22-1440
Problema: senza costa, confini e laghi la carta legge come un grafico; 5 punti in un riquadro.
Perché conta: la regola «niente contorni» nata per non inventare luoghi ha tolto la credibilità.
Direzione: base Natural Earth locale, tre livelli, trama, tutto il mondo (§6).
```
```
[serious] Home — A2/09-390, A2/09-1440
Problema: nessuna idea e nessuna scala nel primo schermo.
Direzione: la copertina-atlante (§7.1).
```
```
[serious] scala tipografica — A2/01, A2/03
Problema: domanda del reel a 19 px, h1 a 30 px, niente oltre i 64 px.
Direzione: §3.2 (fino a 96 px) e il cartiglio (§4).
```
```
[serious] scheda con ossatura fissa — A2/14
Problema: «Prezzo — non ancora» sul 71% delle schede (56 su 79).
Direzione: il cartellino (§5).
```
```
[serious] Esplora — A2/03
Problema: griglia uniforme, niente modi per sfogliare un archivio.
Direzione: quattro modi (posti, mesi, luoghi, carta), porte e pillole (§7.3).
```
```
[serious] desktop — confronto-desktop.png
Problema: copertina 16:9 da un 9:16 (31% del fotogramma) e banco a tre da strumento.
Direzione: colonna fotografica 5:7 (§7.4); banco solo sulla Mappa.
```
```
[serious] momenti-firma — A2/10, A2/11
Problema: esistono solo dopo un tocco; a riposo non lasciano segni.
Direzione: ogni firma ha uno stato a riposo visibile e catture a metà (§8).
```
```
[serious] mappa del sito da portare nel brand — MAPPA-SITO righe 47-49, 454, 919-1429
Problema: stile predefinito «Cinema Dark»; pannelli `bg-stone-900/95 backdrop-blur-2xl` (vetro
  pesante, palette grezza); l'etichetta «Satellite Hybrid» carica lo stile `bright` di
  OpenFreeMap, che non è un satellite.
Perché conta: sono tre violazioni del brand e una della verità (un nome che promette ciò che non c'è).
Direzione: §6.9.
```

**Cosa mancava anche nella correzione (e cambia il progetto)**

- **La qualità del geotag.** Nel controllo del FP §7, 10 etichette su 51 che nominano un paese
  cadono in un altro paese (19,6%). L'etichetta «Italia» (89 reel) cade in Umbria: per questo la
  riga «Umbria» conta 93 reel ma solo 3 luoghi veri. Senza una regola, la trama mostrerebbe un
  «centro dell'archivio» falso in Umbria. Regola: decisione 5 più il flag `paeseIncerto` (§1.4).
- **Puglia e Basilicata non sono vuote.** Hanno zero reel ma 3 luoghi con soli caroselli (FP §7).
  «Nessun reel da qui» è vero; «qui non ci siamo stati» sarebbe falso. Senza alcun post, in tutto il
  corpus, restano **quattro** regioni: Sardegna, Marche, Friuli-Venezia Giulia, Molise.
- **Le schede sono tutte recenti.** I reel con scheda e coordinate sono tutti del 2024-2026 (FP
  §15: 2 nel 2024, 31 nel 2025, 44 nel 2026). I mesi dal 2021 al 2023 del rullino saranno **solo
  matita**, e vanno disegnati per esserlo, non come mesi «rotti».
- **Paesi: 11 contro 26.** I 79 posti stanno in 11 paesi; l'archivio ha reel in 26 paesi (FP §7), ma
  con il 19,6% di etichette che cadono nel paese sbagliato. Nel copy pubblico il numero dei paesi
  dell'archivio si scrive solo dopo la pulizia `paeseIncerto` `[VERIFY data-analyst]`.
- **La zona di casa.** La trama, contata per reel, farebbe da faro sulle zone dove si torna più
  spesso. Il FP §14 non trova un'area dominante, ma la decisione è dell'owner. Regola: la trama conta
  **luoghi distinti**, non reel, e ha solo 3 toni (§6.5).
- **I preset della mappa del sito puntano al vuoto.** Tra le scorciatoie ci sono «Puglia» (zero
  reel) e «Norvegia», mentre nel file non c'è nessun luogo norvegese (FP, incongruenze). In A3 i preset
  si calcolano dai dati.
- **Resta valido dal mio giro precedente:** la «domanda di una parola» del provino è l'ultima riga
  di un cartiglio su più righe, e il testo stampato non coincide sempre con `hook` (Emotional Grand
  Motel: stampato «SUITE A TEMA?», dato «Dormiresti in una gabbia?»). Il dispositivo usa l'`hook`
  alla lettera e ricompone la forma del cartiglio (§4). Resta valido anche il probabile errore
  «Emilia Romagna» contro «Emilia-Romagna»: la mappa del sito lo normalizza già (MAPPA-SITO, righe
  129-149); A3 fa lo stesso.

### 1. Vocabolario e dati: posti, tracce, reel senza luogo

#### 1.1 Gli strati (dal FP §15, reel usabili 1.190, deny-list esclusa)

| Strato | Cosa è | Quanti (fatto) | Sulla carta | Nelle liste |
| --- | --- | --- | --- | --- |
| **Posto** | una delle 79 schede visibili | 79 schede; 77 reel con scheda propria e coordinate (FP §15, colonna A) | punto d'inchiostro con anello, posizione esatta | foto 5:7, cartiglio, cartellino |
| **Traccia su un posto** | reel che cade sulle coordinate di una scheda ma non è il suo reel | 86 reel (FP §15, colonna B) | niente segno proprio: si conta nel posto («e altri {n} reel da qui») | riga sotto il posto |
| **Traccia locale** | reel su un luogo senza scheda | 484 reel su 409 coordinate (colonna C) | cerchietto a matita, sulla cella di 5 km | riga a matita |
| **Traccia di comune** | etichetta generica di livello comune | parte dei 369 generici (colonna D) `[VERIFY data-analyst: suddividere i 369 per livello]` | cerchietto a matita sul comune, con il nome del comune | «Reel a {comune}» |
| **Generico di regione o paese** | etichetta «Toscana», «Italia», … | resto dei 369 | **nessun segno**; conta solo nel rullino | «Reel · {regione}» |
| **Senza coordinate / senza luogo** | etichetta senza coordinate, o nessun luogo | 25 + 149 (colonne F e G) | nessun segno | riga «Reel del {data}» |
| **Caroselli e foto** | post non reel con luogo | 84 caroselli + 6 foto (+1 video) | come traccia, con la dicitura «post fotografico» | riga a matita |

Nota sui due «86»: i post collegati a una scheda del registro sono 86 (79 visibili più 7
segnaposto, FP §1 e §15); i reel che cadono su un posto con scheda senza esserne il reel sono altri
86 (colonna B). Sono due insiemi diversi.

Le classi `adv-prodotto` (19) e `non-posto` (2) **non sono luoghi**: non entrano né sulla carta né
nell'indice dei luoghi. Nel rullino restano come righe «Reel del {data}» senza luogo. `listicle`
(48) e `incerto` (8) seguono la loro etichetta di luogo. Deny-list (2 post, FP §12): **tolta dal
dato** prima di tutto, anche dai conteggi.

#### 1.2 La costante di privacy

```js
const GRIGLIA_KM = 5;                                   // unica; la usano tracce, trama, «Vicino a questo»
const PASSO_LAT = GRIGLIA_KM / 111.2;                   // ≈ 0,045°
const passoLng = (lat) => PASSO_LAT / Math.cos(lat * Math.PI / 180);
// centro della cella di una traccia (calcolato in build, mai coordinate grezze nel file del prototipo)
cella = { lat: (Math.floor(lat / PASSO_LAT) + 0.5) * PASSO_LAT,
          lng: (Math.floor(lng / passoLng(latCella)) + 0.5) * passoLng(latCella) };
```

**Il file dati delle tracce contiene solo i centri di cella**, mai le coordinate originali.

#### 1.3 Le due vite di una traccia

| Stato | Quando | Carta | Foglio | Riga |
| --- | --- | --- | --- | --- |
| **(a) traccia a matita** | oggi, tutte | cerchietto 7 px vuoto, tratto 1,25 `--color-matita` | nome del geotag in Fraunces *italic* matita, «Traccia · comune di {comune}», i reel con la data, «Posizione dal geotag del reel, non ricontrollata.» | colonna vuota con l'anello tratteggiato, nome in corsivo matita |
| **(b) traccia con fotogramma** | se arriva la scansione dei fotogrammi **e** l'owner certifica quel fotogramma | stesso cerchietto, più un punto pieno matita al centro | in cima il fotogramma 5:7 con cornice matita di 1 px, la didascalia «Fotogramma dal reel del {data} · scheda non ancora scritta»; niente cartiglio, niente cartellino | miniatura 5:7 con bordo matita |
| **posto** | quando la scheda è scritta | punto d'inchiostro con anello | scheda completa | tessera con foto |

Il passaggio da (a) o (b) a posto è la **ripassata a inchiostro** (firma di A2, qui P2 e solo se
succede davvero). **Nel prototipo lo stato (b) non si mostra con foto**: non ci sono fotogrammi
certificati di tracce, e usare la foto di un posto sarebbe falso. Si mostra solo come impaginazione
dietro `?demo=traccia-b`, con un riquadro vuoto su carta e la scritta visibile «Esempio di
impaginazione: qui andrà il fotogramma, dopo la vostra approvazione».

#### 1.4 Flag del dato (per il costruttore dei dati)

`generico: 'no' | 'comune' | 'regione' | 'paese'`, `paeseIncerto: bool` (etichetta che nomina un
paese diverso da quello risolto: esclusa dalla carta finché non si verifica), `stato: 'a' | 'b' |
'posto'`, `tipo: 'reel' | 'carosello' | 'foto' | 'video'`, `classe`, `data` (pubblicazione),
`cella`, `comune`, `regione` (normalizzata), `paese`, `codice` (per il permalink; mai i codici in
deny-list), `etichetta` (il nome del geotag, solo se `generico = 'no'`). **Mai** `caption`,
`plays`, `likes` o `commenti` nel file del prototipo.

### 2. Il sistema, alzato di livello

#### 2.1 Superfici e materiali

| Superficie | Token | Ruolo | Regola |
| --- | --- | --- | --- |
| Sabbia | `--color-sand` #faf8f4 | il tavolo; **il mare** in Atlas Cream | fondo di tutto |
| Carta | `--color-atlante-carta` #f2ecdf + trama | documenti; **la terra** in Atlas Cream | cartellino, retro, cartigli di tavola, stati vuoti |
| Inchiostro | `--color-atlante-inchiostro` #1e1c18 | i posti; il buio del reel; **la terra** in Cinema Dark | fuori dalla mappa, una fascia per pagina al massimo |
| Matita | `--color-matita` #6f6862 (A2) | le tracce e la trama | 5,2:1 su sabbia, 4,7:1 su carta: passa per il testo |
| Notte | `--color-atlante-notte` #17375a | categoria Hotel | solo fascia della porta |

**Inchiostro contro matita** è la regola che regge tutta l'app: ciò che è completo e verificato è
pieno e nero, ciò che è traccia è grafite, vuoto e più piccolo. Vale su carta, in lista, nel
rullino e nella ricerca.

#### 2.2 Colori delle categorie (solo i 79 posti: le tracce non hanno categoria)

| Categoria | Posti | Token | Valore | Testo sulla fascia |
| --- | --- | --- | --- | --- |
| Food & Ristoranti | 37 | `--color-cat-food` (esiste) | #fe6d73 | inchiostro (7,2:1) |
| Insolito | 28 | `--color-cat-insolito` (esiste) | #c0afff | inchiostro (10,2:1) |
| Hotel con carattere | 20 | `--color-cat-hotel` = `var(--color-atlante-notte)` (alias nuovo) | #17375a | sabbia (11,5:1) |
| Posti particolari | 17 | `--color-cat-particolari` **PROPOSTA** | #8cc084 | inchiostro (9,4:1) |
| Relax, terme e spa | 13 | `--color-cat-relax` (esiste) | #4cb2be | inchiostro (7,9:1) |
| Weekend romantici | 5 | `--color-cat-romantici` **PROPOSTA** | #f2a7c3 | inchiostro (10,5:1) |
| Borghi e città d'arte | 1 | `--color-cat-borghi` (esiste) | #fdaf40 | inchiostro (10,8:1) |

Uso: fascia delle porte, punto da 8 px nelle righe, pillola attiva. Sulla carta i posti restano
d'inchiostro; il colore di categoria compare solo con la lente di categoria attiva (anello colorato
attorno al punto). Mai testo in colore di categoria.

#### 2.3 Regole mie che cambiano, e perché

| Regola precedente | Diventa | Motivo |
| --- | --- | --- |
| «Nessun contorno di paese» (A2, §6) | **Contorni da Natural Earth** | La regola era contro contorni disegnati a mano. Una geometria pubblica vera non inventa niente ed è ciò che rende la carta credibile |
| Carta come tavola a gradi per 6-79 punti | **Carta interattiva a livelli** su tutto l'archivio | La scala vera è 1.087 post con coordinate |
| Ossatura fissa con «non ancora» | **Cartellino** a 3 celle più «Quanto» facoltativo | Buco sul 71% delle schede |
| Corsivo a 3 usi, domanda a 19 px | 4 usi (domanda fino a 40 px, provenienza, matita, **nomi dei mesi** fino a 96 px) | Il corsivo è la voce del brand |
| Scala fino a 64 px | fino a **96 px** | serve un momento di scala |
| «Niente chip-filtro» | pillole in una fila, senza badge | serve filtrare un archivio |
| Un riempimento pieno per schermata esteso al colore | vale solo per i **tasti**; sono ammesse fasce e tavole | aveva tolto ogni massa di colore |
| Banco a tre in Esplora; copertina 16:9 | banco solo sulla Mappa; colonna fotografica 5:7 | strumento, non rivista; il 16:9 mostra il 31% del fotogramma |
| «Qui non ci siamo stati» sulle regioni a zero reel | «**Nessun reel da qui**» (6 regioni) e «**Nessun post da qui**» (4) | Puglia e Basilicata hanno post a caroselli |
| Pesi Fraunces fino a 520 | aggiungo 360 e 380 sopra i 38 px (**PROPOSTA**) | eleganza da rivista a 64-96 px `[VERIFY: asse nel file incorporato]` |

#### 2.4 Trama e timbro (craft, non referenziali)

Trama della carta: `carta-tile.webp` del sito se è tra i file pubblicati `[VERIFY]`, altrimenti
SVG `feTurbulence` inline al 5% in `multiply`. Il filtro timbro è P2. Le foto non si toccano mai.

### 3. Token A3 (in aggiunta ad A2)

#### 3.1 Colori

```css
--color-cat-food:#fe6d73; --color-cat-insolito:#c0afff; --color-cat-relax:#4cb2be;
--color-cat-borghi:#fdaf40; --color-cat-hotel:var(--color-atlante-notte);
--color-cat-particolari:#8cc084; /* PROPOSTA */ --color-cat-romantici:#f2a7c3; /* PROPOSTA */
--color-atlante-notte:#17375a; --color-matita:#6f6862;
/* Carta — Atlas Cream */
--mappa-mare:var(--color-sand); --mappa-terra:var(--color-atlante-carta);
--mappa-costa:rgb(30 28 24 / 62%); --mappa-confine:rgb(30 28 24 / 38%); --mappa-regione:rgb(30 28 24 / 20%);
--mappa-lago:#e9eef0; /* unico tono freddo: acqua dolce, per orientarsi tra Garda, Como, Maggiore */
--trama-1:rgb(111 104 98 / 22%); --trama-2:rgb(111 104 98 / 42%); --trama-3:rgb(111 104 98 / 68%);
/* Carta — Cinema Dark */
--mappa-d-mare:#151411; --mappa-d-terra:var(--color-atlante-inchiostro);
--mappa-d-costa:rgb(250 248 244 / 40%); --mappa-d-confine:rgb(250 248 244 / 22%); --mappa-d-regione:rgb(250 248 244 / 12%);
--trama-d-1:rgb(232 131 78 / 28%); --trama-d-2:rgb(232 131 78 / 52%); --trama-d-3:rgb(232 131 78 / 82%); /* --color-accent-on-dark */
```

Il lago è l'unico colore nuovo che non viene dal brand. Serve perché il 76% dei luoghi italiani sta
al Nord (FP §7), tra i laghi, e senza acqua la Lombardia a livello area è una distesa crema senza
riferimenti. **PROPOSTA**; in alternativa, il lago in `--color-sand` come il mare.

#### 3.2 Tipografia (mobile, poi da 1024)

| Token | 390 | ≥1024 | Uso |
| --- | --- | --- | --- |
| `--type-poster` | Fraunces 400 38/40, −0.02em | Fraunces 360 72/72 (nel cartiglio di tavola: 64/64) | h1 di Home, Esplora, Mappa, Noi |
| `--type-title-1` | Fraunces 400 38/40 | 360 64/64 | nome del posto (h1 scheda) |
| `--type-title-2` | Fraunces 440 28/32 | 400 40/44 | h2 grandi |
| `--type-title-3` | Fraunces 460 20/26 | 460 24/30 | h2 nella scheda |
| `--type-month` | Fraunces *italic* 360 64/60, minuscolo | *italic* 360 96/88 | mese nel rullino |
| `--type-cartiglio-q` | *italic* 380: eroe 30/32, copertina 28/30, tessera L 24/26 | colonna 40/42, lente 26/28, L 28/30 | domanda nel cartiglio |
| `--type-cartiglio-name` | Inter 600 12/16, maiuscolo +0.2em | idem | nome nel cartiglio |
| `--type-cartiglio-place` | Fraunces 400 14/18 | 16/20 | comune nel cartiglio |
| `--type-map-region` | Inter 600 12/16, maiuscolo +0.22em, `--color-muted-fg-2` | 13/16 | nomi di regione e paese sulla carta (tondo) |
| `--type-map-place` | Fraunces 460 14/18 ink | 15/18 | nome di un posto sulla carta |
| `--type-map-trace` | Fraunces *italic* 400 13/16 matita | 14/18 | comune o nome di una traccia sulla carta |
| `--type-map-count` | Fraunces 460 13/16, `tabular-nums` | 14/16 | numero nei dischi |
| `--type-numeral-xl` | Fraunces 460 26/30, `tabular-nums` | 32/36 | prezzo breve |
| `--type-door` · `--type-chip` · `--type-cell-label` · `--type-cell-value` · `--type-year` | come nel mio giro precedente: Inter 600 14/18 · Inter 500 14/20 · Inter 600 12/16 maiuscolo · Inter 600 15/20 · Fraunces 460 20/24 | 16/20 · idem · idem · 16/22 · 24/28 | porte, pillole, cartellino, anni |

Restano quelli di A2. **Insieme ammesso di `font-size`**: {12, 13, 14, 15, 16, 17, 18, 20, 22, 24,
26, 28, 30, 32, 38, 40, 56, 64, 72, 96}.

#### 3.3 Griglie, immagini, costanti della carta

```css
--sheet-cols-m:6; --sheet-gap-m:2px; --sheet-cols-d:16; --sheet-gap-d:6px;  /* provino dei 79 */
--door-w-m:140px; --door-h-m:196px;
--cover-h-m:clamp(320px, 47.4svh, 440px);
--mark-posto:8px;   --mark-posto-anello:14px;  --mark-traccia:7px;   /* segni sulla carta, costanti a ogni zoom */
--disc-s:32px; --disc-m:40px; --disc-l:48px;   /* dischi: tre misure discrete come nel sito (<10, 10-49, ≥50) */
```

Tre livelli di immagine (solo per i 79): T0 eroe e copertina (`fetchpriority=high`, mai animata),
T1 tessere e lente (lazy, anteprima sfocata), T2 provino (lazy, solo colore dominante).

### 4. Il cartiglio ricomposto (solo posti)

Invariato rispetto alla mia versione precedente: ogni reel stampa in cima un riquadro con nome,
domanda, filetto e luogo (`CARTIGLI`). Il ritaglio 5:7 lo toglie e noi lo **ricomponiamo in HTML
nello stesso punto**, come riquadro sabbia pieno (`--radius-paper`, niente trasparenza né ombra),
centrato, largo `min(84%, 340px)` su mobile e `min(78%, 520px)` sulla colonna desktop, al 6%
dell'altezza dal bordo alto. Righe: nome (`--type-cartiglio-name`, tolto sulla scheda perché c'è
l'h1), domanda = `hook` **alla lettera** (al massimo 3 righe; se non ci sta scende di un gradino
della scala), filetto di 1 px, comune. Senza `hook` il cartiglio non esiste. Nella locandina il
nostro scompare prima che si veda quello stampato vero (F3).

**Doppio senso voluto:** in un atlante il *cartiglio* è il riquadro del titolo della tavola. La
Home usa lo stesso oggetto per l'h1 sulla carta (§7.1): cartiglio del reel e cartiglio dell'atlante
sono la stessa forma.

### 5. Il cartellino (la prova dei 79, anche senza prezzo)

Invariato:
- **Tre celle sempre piene**, su carta: REEL (data, «Instagram ↗»), CONTROLLATO (data, fonte), A
  CHE TITOLO («Nessuna collaborazione» [VERIFY B5], «Su invito», «ADV», «In collaborazione»,
  «Affiliazione», più il partner se c'è).
- **Riga «Quanto»** sopra le celle, solo se c'è `price` (≤ 18 caratteri → Fraunces 26/30; più
  lungo o con «·» → parti una per riga; senza cifre → testo) o `budget` (scala di tre € in ink e
  `--color-border`).
- **Frase dell'assenza**, una volta sola, in «Prima di andare»: «Il prezzo non l'abbiamo segnato.
  Chiedilo sul sito: {dominio} ↗».
- «Non ancora» solo per l'unico posto senza controllo.
- Sulle tessere: il prezzo breve o la fascia, più la dichiarazione non organica, **sempre**.

---

## What the receiver should produce

### 6. La carta (il cuore)

#### 6.1 Due incarnazioni, un solo disegno

| | App vera | Prototipo pubblicato |
| --- | --- | --- |
| Motore | MapLibre (`FullScreenMapExperience`, riuso) | SVG locale, pan e zoom scritti a mano, niente librerie |
| Base | tessere OpenFreeMap **dopo il consenso**; **prima del consenso la base locale del prototipo** (raccomandazione, §6.9) | base locale: geometrie Natural Earth incorporate |
| Stili | Atlas Cream (predefinito), Cinema Dark, Satellite **solo se è un satellite vero** | Atlas Cream (predefinito), Cinema Dark |
| Livelli | territorio < 8,5 ≤ area < 12 ≤ posto (MAPPA-SITO, righe 107-115) | **stessi numeri** con la stessa proiezione (Web Mercator), più un livello «mondo» sotto 4,5 |
| Tetto | 60 marcatori DOM | 60 elementi interattivi; i segni non interattivi (trama, tracce lontane) in un solo livello SVG |
| Collegamento | `?posto=<id>` | `#posto-<slug>`, `#traccia-<cella>`, `#mappa-<preset>` |

#### 6.2 La base locale (prototipo)

**Fonti** (tutte di pubblico dominio, da incorporare; nessuna rete in esecuzione):
- mondo: `world-atlas` `countries-110m` (Natural Earth 1:110M), lo stesso dato che il sito carica
  in `InteractiveMap.tsx` da unpkg;
- Europa e Mediterraneo: Natural Earth 1:50M (`countries-50m`), ritagliato a 25° O-45° E, 25-72° N;
- Italia e Alpi: Natural Earth 1:10M per costa e confini, **regioni italiane** da Natural Earth
  admin-1 10M, dissolte per regione `[VERIFY builder: in NE admin-1 l'Italia è per province con
  l'attributo regione; se no, fonte alternativa con licenza compatibile, mai disegnata a mano]`;
- laghi: Natural Earth 1:10M `lakes`, ritagliato su Italia e Alpi.

**Preparazione (in build, non in esecuzione):** proiezione Web Mercator pre-calcolata; coordinate
intere su una griglia di 65.536 unità per lato del mondo; semplificazione (Visvalingam o
Douglas-Peucker) con tolleranza adatta a ogni scala; una stringa `d` SVG per strato e livello di
dettaglio. **Budget di peso:** tutte le geometrie ≤ 400 KB non compressi `[VERIFY builder: misura]`.
Se non si riesce a procurarle offline: il prototipo usa la sola base a 110M con il riquadro Italia a
50M, **mai** contorni disegnati a mano.

**Strati, dall'alto in basso:** selezione e cartigli → etichette → segni interattivi (dischi,
posti) → tracce → trama → confini regionali → confini di stato → costa → laghi → terra → mare.
Tutti i tratti con `vector-effect: non-scaling-stroke`, così restano sottili a ogni zoom.

| Strato | Atlas Cream | Cinema Dark |
| --- | --- | --- |
| mare | `--mappa-mare` (sabbia) | `--mappa-d-mare` |
| terra | `--mappa-terra` (carta, con trama del foglio) | `--mappa-d-terra` |
| costa | 0,75 px `--mappa-costa` | 0,75 px `--mappa-d-costa` |
| confine di stato | 0,6 px `--mappa-confine`, tratteggio 3-2 | idem, `--mappa-d-confine` |
| confine di regione (Italia) | 0,5 px `--mappa-regione`, punteggiato 1-2; solo da z 4,5 | idem, `--mappa-d-regione` |
| laghi | `--mappa-lago` con costa 0,5 px | `--mappa-d-mare` |
| reticolo | nessuno (è una carta vera, non un grafico) | nessuno |
| cornice | nessuna a tutto schermo; **cornice graduata** solo sulle tavole ferme (copertina Home, tavole mini) | idem |

**Scritte della carta:** regioni e paesi in `--type-map-region` tondo maiuscolo spaziato, posati sul
baricentro della geometria e spostati se coprono un segno; budget di nomi 3 fino a 375 px, 5 fino a
1024, 8 oltre, come nel sito (MAPPA-SITO, righe 393-399). Niente nomi dei mari (il corsivo è
riservato ad altro). Scala in km in basso a sinistra, ricalcolata a ogni zoom («0 · 50 km»), e «N»
con `ArrowUp`. Attribuzione in basso a destra, `--type-label` muted: «Confini: Natural Earth,
pubblico dominio». Nell'app vera: «© OpenStreetMap · OpenFreeMap».

#### 6.3 I livelli di zoom

| Livello | Zoom | Cosa si vede | Disco (cartiglio del gruppo) |
| --- | --- | --- | --- |
| **Mondo** | < 4,5 | un disco per paese, **Italia compresa come disco unico** | numero = luoghi del paese |
| **Territorio** | 4,5 - 8,5 | Italia: un disco per regione; estero: un disco per paese; sotto, la **trama** | numero = luoghi della regione o del paese |
| **Area** | 8,5 - 12 | un disco per comune; i posti soli e le tracce sole diventano segni | numero = luoghi del comune |
| **Luoghi** | ≥ 12 | ogni posto e ogni cella di traccia | — |

**Il disco:** fondo `--mappa-terra` (sulla scura `--mappa-d-terra`), numero `--type-map-count`, tre
misure fisse (32/40/48 per <10, 10-49, ≥50 luoghi, come nel sito). Il cerchio proporzionale resta
vietato, come stabilito dal sito («legge come data-viz», MAPPA-SITO, righe 385-391).
- **anello pieno 1,5 px d'inchiostro** se il gruppo contiene almeno un posto;
- **anello tratteggiato 1,25 px matita** se contiene solo tracce.
- Etichetta: il nome della regione, del paese o del comune in `--type-map-region`, nel budget dei
  nomi.
- **Si legge così:** l'anello dice *che cosa* c'è (inchiostro: almeno una scheda; matita: solo
  tracce), il numero *quanti luoghi*, il nome *dove*. Il numero dei posti con scheda non va nel disco
  (due numeri in un disco non si leggono): sta nella riga del foglio.

**Un luogo** = un posto oppure una coordinata distinta di traccia, dopo le esclusioni (§1.1). Un
gruppo con un solo membro non è un gruppo: diventa il suo segno (regola A del sito).

#### 6.4 I segni: posto e traccia

| Segno | Forma (Atlas Cream) | Forma (Cinema Dark) | Etichetta (al livello Luoghi, nel budget) |
| --- | --- | --- | --- |
| **Posto** | punto pieno ink 8 px, spazio carta di 1,5 px e **anello ink da 14 px**: il simbolo del capoluogo negli atlanti | punto sabbia 8 px con anello `--color-accent-on-dark` | nome in `--type-map-place` |
| **Traccia (a)** | cerchietto **vuoto** 7 px, tratto 1,25 `--color-matita` | tratto sabbia al 60% | comune in `--type-map-trace` |
| **Traccia (b)** | come (a) più un punto pieno matita di 3 px al centro | idem | idem |
| **Più tracce nella stessa cella** | un cerchietto solo, con il numero in `--type-label` matita accanto («3») | idem | idem |
| **Posto scelto** | punto 10 px `--color-accent-text`, anello 18 px, etichetta in Fraunces 520 | `--color-accent-on-dark` | sempre visibile |
| **Salvato** | secondo anello ink da 18 px attorno | sabbia | — |
| **Lente di categoria attiva** | l'anello del posto prende il colore della categoria (2 px) | idem | — |

Area di tocco di ogni segno: 44×44 invisibile, centrata. Se due aree si sovrappongono vince il segno
più vicino al dito; se non si separano nemmeno allo zoom massimo, il tocco apre l'elenco (regola del
sito, MAPPA-SITO, righe 600 e 817).

#### 6.5 La trama dell'archivio (la firma della carta)

**Cosa:** a livello Mondo e Territorio, ogni cella di 5 km che contiene almeno una traccia si
colora con un **quadretto** (quadrato che riempie il 78% della cella) in uno di **tre toni di
matita**: 1 luogo → `--trama-1`, 2-4 → `--trama-2`, 5 o più → `--trama-3`. Sulla scura i toni sono
`--trama-d-*` (luci calde). A zoom basso i quadretti sono di 1-2 px e diventano una grana. Verso
zoom 8 diventano un mosaico leggibile, come un **taccuino a quadretti colorato a matita**. Da zoom
8,5 la trama svanisce (opacità in 160 ms) e parlano i segni.

**Perché così e non una «mappa di calore» sfumata:**
1. Una macchia sfumata è un «gradient blob», vietato dal brand.
2. Una sfumatura continua è data-viz, e il sito vieta già le aree proporzionali.
3. Un picco di calore contato per reel farebbe da faro sui luoghi dove si torna più spesso, cioè
   potenzialmente la zona di casa (FP §14).

La trama a quadretti è discreta, conta i luoghi e non i reel, ha un tetto a 3 toni e usa la stessa
griglia della privacy.

**Regole:** contano solo le tracce con `generico ∈ {no, comune}` e `paeseIncerto = false`; i posti
non entrano nella trama (sono inchiostro, sopra). Legenda: «Ogni quadretto è 5 km. Più scuro: più
luoghi dai reel.» **Zona riservata** `[VERIFY owner, FP §14]`: se l'owner lo decide, le celle entro
un raggio privato (configurazione fuori dal repo) restano al tono 1.

#### 6.6 Il mondo sulla stessa carta

- È una sola carta continua. **Preset** in una fila di pillole sopra la carta, **calcolati dai
  dati** (solo zone con almeno un luogo): «Italia» (predefinito, estensione dei luoghi italiani),
  «Europa», «Mondo», e un preset per ogni altra zona continentale con luoghi [calcolato: per esempio
  Asia, Medio Oriente e Africa, Americhe]. Nessun preset su zone vuote.
- A livello Mondo l'Italia è un disco unico, e la trama resta visibile fino a quel livello.
- **Riquadri fuori quadro** (solo sulle tavole ferme: copertina Home e desktop): le zone lontane in
  riquadri 160×160 con cornice graduata e i loro dischi, come gli atlanti. Il tocco porta la carta
  interattiva su quel preset.
- **«Nessun post da qui» / «Nessun reel da qui»:** a livello Territorio le regioni italiane senza
  alcun luogo (calcolate; dal FP oggi: Sardegna, Marche, Friuli-Venezia Giulia, Molise) restano
  **terra nuda**, senza trama né segni, e portano la scritta `--type-map-trace` «Nessun post da
  qui» (una per vista, nel budget dei nomi). Puglia e Basilicata mostrano i loro segni di
  carosello; nel loro foglio di regione c'è la riga «Nessun reel da qui: solo post fotografici».

#### 6.7 Interazione

**Gesti (prototipo):** trascinamento con un dito o con il mouse (pan); pizzico e rotella, con Ctrl
su desktop (zoom attorno al punto); doppio tocco = zoom +1; tasti +/− 44×44 in colonna a destra;
«Centra» (`LocateFixed` 20: centra sul preset attivo, **non** sulla posizione dell'utente, che è
bloccata); da tastiera: frecce = pan di 80 px, + e − = zoom, Tab percorre i segni interattivi in
ordine di distanza dal centro. `touch-action: none` sulla carta della Mappa. **Sulla Home la carta
non cattura mai lo scroll** (niente pan né zoom): è una copertina.

**Durante il gesto** si muove solo `transform` del gruppo SVG (compositore). Alla fine del gesto
(120 ms di quiete): nuovo livello, ricalcolo di dischi, etichette e tetto dei 60, poi le etichette
nuove entrano in opacità in 160 ms.

**Tocchi:**
- **disco** → lo zoom va sul rettangolo dei suoi membri più il 20% (M-C); se non si separerebbe
  nemmeno allo zoom massimo, si apre l'elenco dei membri nel foglio;
- **posto** → scelto (M11 di A2); il foglio, a livello spiata, mostra la miniatura 5:7 da 48×67, il
  nome, il comune e il cartellino compatto (tre valori brevi), con il tasto secondario «Apri la
  scheda». Un secondo tocco o «Apri la scheda» apre la scheda con **F5**;
- **traccia** → scelta; il foglio mostra il foglio della traccia (§7.5);
- **fondo della carta** → toglie la scelta.

#### 6.8 La schermata Mappa

**390×844**
- 0-52: barra alta.
- 52-788: carta a tutto schermo (390×736).
- **Cartiglio della tavola** in alto a sinistra (x 12, y 64), sabbia, `--radius-paper`, padding
  12/16, largo al massimo 280: h1 `--type-title-2` 28/32 «Dove siamo stati», poi `--type-label`
  «Inchiostro: con la scheda. Matita: tracce dai reel.» Dopo la prima interazione il cartiglio si
  riduce al solo h1 su una riga (M6: opacità e translate, altezza fissa, niente CLS).
- **Pillole dei preset** a y 64 a destra del cartiglio, poi sotto quando è ridotto: una fila
  orizzontale scorrevole.
- A destra, in colonna da y 200: `+`, `−`, «Centra», «Stile» (Sun/Moon 20: chiara o scura),
  «Trama» (`Grid3x3` 20, `aria-pressed`), tutti tasti da 44×44 su sabbia con bordo
  `--color-border`, **senza vetro né sfocatura**.
- In basso: scala e «N» a sinistra, attribuzione a destra, sopra il foglio.
- **Foglio** (M5 di A2), tre livelli:
  - **spiata** (132): senza scelta mostra la vista («Lombardia · {n} luoghi, {k} con la scheda») e
    la legenda (● posto · ○ traccia · ▦ trama 5 km); con una scelta mostra il posto o la traccia;
  - **metà**: l'elenco di ciò che è nella vista, ordinato per distanza dal centro (come nel sito),
    con i posti in righe con foto e le tracce in righe a matita;
  - **pieno**: tutto l'elenco.
- Riga d'azione del piano in basso solo con un posto scelto: «Apri la scheda» (secondario) e
  «Salva».

**1440×900: banco a due più uno**
- A: registro della vista (x 24-384): h1 `--type-poster` 72/72 in testa, poi l'elenco raggruppato
  (regione → comune) con i posti e le tracce.
- B: carta (x 408-1416) con cartiglio, pillole e comandi come su mobile.
- C: pannello da 480 che entra da destra sopra B quando c'è una scelta: per un posto, la foto 5:7
  200×280 con il cartiglio senza nome, il nome, il cartellino, «Apri la scheda» e «Salva»; per una
  traccia, il foglio della traccia.
- Passare sopra una riga di A accende il segno, e viceversa.

**Consenso (solo app vera):** la base locale non chiede nulla. Il comando «Dettaglio stradale»
(`Map` 16) dentro la carta apre la striscia di consenso di A2 (P0-10 di A2). Nessuna richiesta
esterna prima di «Attiva».

#### 6.9 Portare `FullScreenMapExperience` nel brand (per il dopo-prototipo; code-architect e frontend)

| Oggi nel sito | Diventa | Motivo |
| --- | --- | --- |
| stile predefinito `dark` (riga 454) | **Atlas Cream** predefinito; «Cinema Dark» a scelta | il brand è sabbia |
| «Satellite Hybrid» = OpenFreeMap `bright` (righe 47-49) | togliere l'etichetta, oppure un satellite vero con un fornitore scelto `[VERIFY costi e licenza]` | un nome che promette ciò che non c'è è un problema di verità |
| pannelli `bg-stone-900/95 backdrop-blur-2xl`, `bg-black/90` (righe 919-1429) | superfici sabbia/carta (chiara) o inchiostro pieno (scura), niente sfocatura, token del brand | niente vetro oltre un velo leggero; niente palette grezza |
| marcatori con icona di categoria e dischi | segni posto/traccia del §6.4, dischi del §6.3 (tre misure già uguali) | un solo linguaggio |
| preset fissi (righe 60-70) con «Puglia» e «Norvegia» | preset calcolati dai luoghi | nessuna scorciatoia verso il vuoto |
| tre livelli (8,5 / 12) | tenuti, più il livello «mondo» sotto 4,5 | l'Italia in 14 dischi a zoom mondiale diventa una macchia |
| tessere solo dopo il consenso, prima nulla | **prima del consenso la base locale di A3**; le tessere diventano «Dettaglio stradale» | idea 6 della sintesi: la mappa che non chiede niente |
| `?posto=<id>` | tenuto, più `?traccia=<cella>` | collegamento alle tracce |

### 7. Le schermate

Misure a 390×844 e 1440×900. Barra alta 52/64; piano in basso 116 (riga d'azione più barra) o 56.

#### 7.1 Home: «L'atlante si apre»

**L'idea.** Chi arriva capisce in cinque secondi:
1. che questa coppia ha girato **tantissimo**, perché la carta è coperta dei loro segni;
2. che alcuni posti sono **completi e provati**: punti d'inchiostro, e una foto appuntata con la sua
   domanda;
3. la promessa: «Posti che sembrano inventati. Ma esistono davvero.»

La carta è la prova, la foto è l'esempio, il cartiglio è la voce. Nessun contatore: la mole si vede.

**390×844, primo schermo**
- 0-52: barra alta.
- 64-184: **h1** `--type-poster` 38/40 su 3 righe: «Posti che sembrano inventati.» e in corsivo
  `--color-accent-text` «Ma esistono davvero.»
- 192-210: `--type-label` muted, con la data calcolata: «Ogni segno è un luogo dei nostri reel e
  post, dal luglio 2021.»
- 222-742: **tavola di copertina** a filo schermo 390×520, Atlas Cream, **ferma**:
  - estensione calcolata per contenere i luoghi italiani (circa 6-19° E, 36-47,5° N), adattata al
    riquadro;
  - cornice graduata sottile di 4 px sui bordi sinistro e destro (la tavola è un oggetto);
  - trama, tracce da 5 px e i **posti d'inchiostro** (79 meno quelli all'estero), senza dischi e
    senza etichette tranne i nomi delle regioni con più luoghi (budget 3);
  - **fotografia appuntata**: il posto di oggi (§7.1.1) in 5:7 da 116×162, con bordo sabbia di 4
    px, ruotata di −1,5°, posata nell'angolo della tavola con meno segni (di norma in basso a
    sinistra, sul mare); un filetto di 1 px `--color-accent-text` la collega al suo punto, che è
    nello stato «scelto». Sotto la foto, un cartellino sabbia 150×40 con la domanda in Fraunces
    *italic* 14/18 ink (2 righe al massimo; se è più lunga, il nome del posto al suo posto);
  - legenda in basso a destra, `--type-label`: «● con la scheda ○ tracce».
  - Tutta la tavola è un link a `#mappa` (F4). La foto è un link alla scheda (F1).
- 788-844: barra a 5 voci.

**Scorrendo (390)**
1. **«I 79 con la scheda»** `--type-title-2`: il **provino** a filo schermo, 6 colonne con gap 2,
   celle 63×88 5:7 (T2), ordine per data del reel decrescente, righe d'anno (2026, 2025, 2024).
   Link «Tutti i posti con la scheda →».
2. **«{Settembre}, negli anni»** (idea 1, §9): per ogni anno passato con reel nel mese corrente,
   una riga con l'anno `--type-year`, i comuni in corsivo matita separati da « · » (i primi 8,
   poi «e altri {n}»), le miniature dei posti con scheda di quel mese se ci sono.
3. **Il righello dei 62 mesi**: una striscia larga 350 e alta 48, con 62 tacche verticali d'inchiostro
   (1 px, una per mese, **tutte uguali**) e sotto gli anni. Sopra: «Nessun mese vuoto, da luglio
   2021 ad agosto 2026.» Tutto è un link al rullino. Non è un grafico: tutte le tacche sono uguali, e
   il fatto è proprio che nessuna manca.
4. «La guida in regalo» (blocco carta, tasto secondario «Ricevila»), poi il colofone con il link
   «Come è fatto questo atlante».

**1440×900, primo schermo: la tavola a tutta pagina**
- 0-64: barra alta.
- 64-900: **tavola di copertina** a filo schermo 1440×836, estensione Europa e Mediterraneo
  (circa 11° O-33° E, 34-58° N, adattata), ferma, con trama, tracce, posti e i nomi dei paesi e
  delle regioni principali (budget 8).
- **Cartiglio della tavola** (x 40, y 104; spostato nell'angolo con meno segni se serve), sabbia
  piena, `--radius-paper`, padding 32/40, largo 520: occhiello «Atlante di Rodrigo e Betta · dal
  luglio 2021» (calcolato); h1 `--type-poster` 64/64; `--type-body`: «Ogni segno è un luogo dei
  nostri reel e post. In inchiostro i {79} posti con la scheda.»; campo di ricerca h 48 con «⌘K»;
  link «Apri la mappa →». Filetto doppio sul bordo (1 px ink, 3 px carta, 1 px ink): il cartiglio da
  atlante.
- **Fotografia appuntata**: 5:7 da 200×280, bordo sabbia 6, −1,5°, nel mare a ovest dell'Italia
  (angolo calcolato); filetto al punto; cartellino con la domanda in Fraunces *italic* 18/24.
- **Riquadri fuori quadro** in basso a destra: da 2 a 4 tavole 160×160 per le zone lontane con
  luoghi (calcolate), ciascuna con cornice graduata, trama, segni e titolo.
- Legenda e scala in basso a sinistra.
- **Al passaggio del mouse** su un posto o su una traccia: etichetta del segno. **Al clic**:
  `#mappa` con quel segno scelto (F4). La rotella scorre la pagina e non zooma mai.

**Scorrendo (1440):** il **provino dei 79 con la lente** (foglio a 16 colonne; blocco titolo
«I 79 con la scheda» 6×4; lente 4×4 che mostra il posto sotto il puntatore con cartiglio e data; i
fotogrammi in ordine di data nelle celle libere); poi «{Settembre}, negli anni» su 5 colonne (una
per anno); il righello dei 62 mesi a tutta larghezza (tacche ogni 20 px); guida; colofone.

**768:** come 390, con margini 32; tavola 768×620 con la foto appuntata da 150×210. **1024:**
come 1440, con la tavola 1024×704 e il cartiglio largo 440.

##### 7.1.1 Il posto di oggi (scelta deterministica)

```
eleggibili = posti con evidenza=true && hook && (price || budget) && controllo
candidati  = eleggibili con mese(reel) == mese(oggi) && reel < oggi    // ?oggi=2026-09-29 nelle catture
scelto     = candidati ≠ ∅ ? candidati[giornoDellAnno mod n] : il più recente degli eleggibili
```

#### 7.2 Il rullino dei 62 mesi (Esplora → «Mesi»)

**Cosa racconta:** la storia della coppia per reel pubblicati, da agosto 2026 a luglio 2021, 62
sezioni. Nessun mese è vuoto (FP §2). Sempre al livello del comune: mai punti, mai «siamo stati».

**390×844**
- Testata di Esplora, selettore su «Mesi».
- **Striscia del mese fissa** (`sticky; top:52`), h 48: il mese in lettura in Fraunces *italic*
  400 20/24 («novembre»), l'anno `--type-year` 16, e «Cambia mese» (ChevronDown 16), che apre il
  foglio con la griglia dei 62 mesi. Nel foglio: **una riga per anno** (dal 2026 al 2021) con
  l'anno in `--type-year`; sotto, i mesi di quell'anno in **due file da 6 celle** (gen-giu,
  lug-dic), celle 52×44 con l'abbreviazione del mese («gen», «feb»…). Le celle fuori dal periodo
  (prima di luglio 2021, dopo agosto 2026) sono vuote e non si premono. Nessun colore per quantità.
- **Sezione del mese:**
  - testata: il mese `--type-month` 64/60 corsivo minuscolo ink, l'anno `--type-year` in alto a
    destra, e una riga calcolata in `--type-label`: «{n} reel · {k} con la scheda» (con k = 0 la
    parte «· 0 con la scheda» non si scrive);
  - **i posti con scheda del mese** (se ci sono): 1 → tessera L 350×438 con il cartiglio; 2-4 → 2
    colonne S; 5 o più → 3 colonne;
  - **la riga dei comuni**, in Fraunces *italic* 17/26 matita: i comuni delle tracce del mese in
    ordine di data, separati da « · », con le ripetizioni come «{comune} ×3»; se i comuni sono più di
    12 la riga passa alle regioni e ai paesi («Lombardia · Veneto · Spagna…»). Ogni nome è un link che
    apre il foglio delle tracce di quel comune o di quella regione in quel mese;
  - **«Tutti i reel del mese ({n})»**: un espansore (`aria-expanded`) che apre le righe da 48: giorno
    `tabular-nums`, cerchietto matita o punto ink, «{comune}» o «Reel senza luogo», ArrowUpRight
    16 verso il reel;
  - 64 px tra i mesi. Le sezioni hanno `content-visibility:auto` con `contain-intrinsic-size:auto
    320px`.
- **Mesi 2021-2023** (senza schede): testata, riga dei comuni ed espansore, niente foto. Sono pagine
  a matita del diario, ed è giusto che lo sembrino.

**1440×900:** in testa, fisso, l'**indice dei 62 mesi**: 6 righe (una per anno) × 12 celle 48×32
con l'iniziale del mese; il mese in lettura è sottolineato in accento, le celle fuori periodo sono
vuote. Poi ogni mese è una riga: a sinistra (x 40-340), fissa nella riga, il mese a 96/88, l'anno e
il conteggio; a destra (x 380-1400) i posti con foto (fino a 5 per fila, 184×258), la riga dei
comuni e l'espansore.

#### 7.3 Esplora: quattro modi di sfogliare

URL `#esplora` (Posti), `#esplora-mesi`, `#esplora-luoghi`, e la voce Mappa. Selettore di vista in
testa: **«Posti · Mesi · Luoghi»**. Stato dei filtri in `sessionStorage`.

**(a) Posti: i 79 con foto** (invariato nel disegno)
- h1 «Posti provati di persona»; riga calcolata «{79} posti con la scheda, da maggio 2024 ad agosto
  2026, in {11} paesi.»
- **Porte** (6: le categorie con almeno 5 posti), fila orizzontale da 140×196: foto 140×140 T1 più
  fascia colore 56 con nome e numero. Borghi (1 posto) è solo una pillola.
- **Pillole** fisse sotto la barra alta: categoria attiva, «Italia» (che apre le regioni),
  «Europa», «Asia», «Americhe», «Con il prezzo», i budget; «Ordina» fisso a destra.
- **Griglia a ritmo** S S / S S / L (L con cartiglio, mai un posto in attesa); fine elenco onesta;
  vuoto con i tasti «Togli {filtro} ({n} posti)». Esempio di vuoto sicuro: Borghi + Italia (l'unico
  posto Borghi è in Francia).
- 1440: 5 colonne, L 2×2 alternata, porte in fila da 213×280, interruttore «Carta» (colonna di
  480 con la tavola sincronizzata).

**(b) Mesi:** §7.2.

**(c) Luoghi: l'indice dell'atlante**
- In testa, un campo «Cerca un comune o una regione» e le pillole di zona. Interruttore «Anche le
  tracce» (predefinito: sì).
- Registro a tre livelli:
  - **regione o paese** (riga da 64): nome `--type-name-row`, a destra «{n} luoghi · {k} con la
    scheda», ChevronDown;
  - **comune** (riga da 56): nome, «{n}»;
  - **luoghi** del comune: i posti come righe da 72 con miniatura 40×56, nome e punto di categoria;
    le tracce come righe da 56 con l'anello matita, nome del geotag in corsivo matita e «{n} reel ·
    ultimo {mese anno}».
- Ordine: regioni per numero di luoghi decrescente, comuni e luoghi in ordine alfabetico. Le
  regioni senza luoghi in fondo, in matita: «Sardegna: nessun post da qui» (calcolato).
- Ogni riga porta sulla carta con `#mappa` e il segno scelto (F4) oppure, per un posto, alla scheda.

#### 7.4 La scheda del posto (i 79)

Invariata rispetto al mio giro precedente, con una sezione più ricca.

**390**, primo schermo:
- 52-452: copertina 400 con il cartiglio, il bollo «Esiste davvero?» e l'orecchia del retro;
- didascalia «Fotogramma dal reel del {data}»;
- occhiello con comune, regione e punti di categoria;
- h1 38/40;
- riga «Quanto» se c'è;
- cartellino.

Riga d'azione: «Salva per il viaggio» (unico pieno) e «Guarda il reel».

**Sotto:**
1. Prima di andare (voci di `toKnow`, «Come arrivare», frase dell'assenza).
2. Il racconto.
3. **Vicino a questo**: tavola locale 350×220 (**base Natural Earth**, costa e laghi, livello area)
   con il posto, i suoi 4 posti vicini (punti ink con i km in linea d'aria) e **le tracce entro 30 km**
   (cerchietti matita, senza km perché sono celle di 5 km). Sotto, le righe dei posti («a {km} km in
   linea d'aria») e una riga di sintesi: «E {n} tracce dai reel entro 30 km →», che apre la carta
   lì. Titoli: entro 30 km «Nello stesso giro»; 30-150 km «Vicino a questo»; oltre 150 km «Il posto
   più vicino in archivio» con una riga sola.
4. **Altri reel da qui** (solo se ci sono tracce sullo stesso posto): righe «Reel del {data} ↗».
5. Altri: {categoria}.
6. Il reel (fascia inchiostro con la locandina).
7. Colofone.

**1440:** colonna fotografica 620×836 fissa a sinistra, con il cartiglio 40/42; colonna di testo a
destra (x 680-1360), h1 64/64.

#### 7.5 Il foglio della traccia (nessuna pagina propria, `#traccia-<cella>`, mai indicizzato)

**390, foglio a metà** (y 420-728, sopra il piano):
- maniglia; occhiello `--color-atlante-timbro-text` con `PencilLine` 16 «Traccia a matita»;
- nome del geotag in Fraunces *italic* 460 28/32 `--color-matita` (2 righe). Per una traccia di
  comune: «Reel a {comune}»;
- «Traccia · comune di {comune} · {regione}» `--type-ui` ink-2;
- elenco dei reel della cella (fino a 4, poi «e altri {n}»): «Reel del {data}» con ArrowUpRight
  verso il permalink; per un post fotografico: «Post fotografico del {data}»;
- tra due filetti, `--type-label` muted: «**Posizione dal geotag del reel, non ricontrollata.**
  Qui la scheda non l'abbiamo ancora scritta: niente prezzo, niente controllo.»;
- carta mini 120×148 a destra con la cella (quadrato di 5 km tratteggiato), mai un punto preciso;
- riga d'azione: «Guarda il reel ↗» (primario, il più recente) e «Salva».
- **Stato (b)** `?demo=traccia-b`: in cima un riquadro 5:7 da 120×168 su carta, vuoto, con la
  scritta «Esempio di impaginazione: qui andrà il fotogramma, dopo la vostra approvazione»; poi la
  didascalia «Fotogramma dal reel del {data} · scheda non ancora scritta».

**1440:** nel pannello C della Mappa, stessi contenuti; il nome a 40/44.

**Mai** nel foglio: caption, visualizzazioni, like, commenti, coordinate numeriche.

#### 7.6 Ricerca ⌘K sull'archivio

Palette di A2 (combobox più listbox, tastiera, `<mark>` sottolineato). Indice in memoria: 79 posti,
luoghi delle tracce (etichette non generiche), comuni, regioni e paesi, categorie, domande dei 79.
Senza accenti né maiuscole, per prefisso di parola. **Gruppi** in quest'ordine, fino a 5 righe
ciascuno con «Mostra tutti ({n})»:
1. «Posti» (miniatura, ink);
2. «Domande» (Fraunces *italic*, solo i 79);
3. «Comuni e regioni» (MapPin, «{n} luoghi · {k} con la scheda») → carta su quel livello;
4. «Tracce» (anello matita, nome in corsivo matita, comune) → foglio della traccia;
5. «Categorie» → Esplora.

Senza testo: «Prova con:» e quattro esempi dai dati. Senza risultati: «Nessun luogo per «{x}».
Prova con il nome di un comune.»

#### 7.7 I miei posti

Come nel mio giro precedente (tavola «Il tuo atlante», raccolte, mosaico 2×2, `#lista-<codici>`,
vista di chi riceve, nessuna promessa offline). **Novità:** si possono salvare anche le tracce.
Nelle righe sono a matita, sulla tavola sono cerchietti, e il link della raccolta porta i codici di
cella.

#### 7.8 Noi e «Come è fatto questo atlante»

- Noi: h1 «Rodrigo e Betta», cartiglio del brand su carta («RODRIGO E BETTA / Posti che sembrano
  inventati? / Travelliniwithus»), «Come lo raccontiamo» (tre principi con esempi veri dai dati), le
  edizioni come lenti (A2), la guida, il colofone.
- **«Come è fatto questo atlante»** (`#noi-atlante`), il colofone dell'archivio. Tutto in frasi,
  senza grafici né riquadri di numeri, con i numeri calcolati:
  - «Ogni segno viene da un nostro post su Instagram, dal 25 luglio 2021 al 13 agosto 2026: {n}
    post, {m} reel.»
  - «Nessun mese è vuoto.»
  - «In inchiostro i {79} posti con la scheda: li abbiamo ricontrollati e sappiamo a che titolo ci
    siamo andati. A matita tutte le altre tracce: la posizione viene dal geotag del reel e non
    l'abbiamo ricontrollata.»
  - «Le tracce stanno su una griglia di 5 km, mai sul punto preciso.»
  - «Le date sono di pubblicazione, non della visita.»
  - «Alcuni geotag di Instagram cadono nel paese sbagliato: quelli li teniamo fuori dalla carta
    finché non li controlliamo.»
  - «Alcuni post non compaiono per rispetto della privacy.»
  - «Confini: Natural Earth.»
  - Nessuna visualizzazione, like o commento.

### 8. Movimento e drammaturgia

Regole di A2 invariate: solo `transform`, `opacity` e istantanee delle View Transitions. Due
eccezioni dichiarate: `clip-path` in F5, e l'opacità degli strati SVG della carta. Un gesto per
transizione; LCP mai animato; nessuna animazione legata allo scroll.

| # | Firma | Stato a riposo (visibile nelle catture) | Gesto | Durata · easing | Reduced motion | Regola di onestà |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | **Il volo del fotogramma** | cartiglio su tessere L, provino e foto appuntata | tessera o foto → scheda: foto e cartiglio volano nella copertina, poi salgono h1, «Quanto» e cartellino | 320 · ease-out | istantaneo, fuoco sull'h1 | il cartiglio è il testo del dato |
| F2 | **Il retro del fotogramma** | orecchia di carta nell'angolo della copertina | bollo o orecchia → la copertina ruota; sul retro il cartellino e il timbro datario | 100 + 400 · ease-in-out | facce scambiate subito | timbro solo con `checked.at` |
| F3 | **Dalla foto alla locandina** | badge «Reel · Instagram ↗» | il cartiglio ricomposto svanisce (120), il ritaglio si apre al 9:16 con il cartiglio stampato vero, sale l'inchiostro | 120 + 320 · ease-out | istantaneo | il cartiglio vero si vede solo qui |
| F4 | **L'atlante si apre** (nuova) | la tavola di copertina con la cornice graduata e il cartiglio | tocco sulla tavola della Home o su una riga dell'indice → la tavola (elemento condiviso `atlante`) cresce dal suo riquadro a tutto schermo; la cornice e il cartiglio grande escono (opacità 120); poi la trama si risolve nei dischi del livello Territorio (etichette in 160) | 420 · ease-out (gesto dell'utente, eccezione al tetto dei 320) | istantaneo | è la stessa geometria e la stessa proiezione: niente si sposta di luogo |
| F5 | **Dalla carta alla scheda** (nuova) | posto scelto con anello e etichetta in Fraunces 520 | secondo tocco o «Apri la scheda» → la copertina nuova si apre come un cerchio che cresce dal punto (`clip-path: circle(0 at x y)` → `150%`), poi F1 per il testo | 360 · ease-out | istantaneo | parte dal punto vero |

Movimenti di sistema: **M-A** ingresso (sulla Home la frase «Ma esistono davvero.» entra a 350
ms, una volta per sessione); **M-B** cambio di mese (uscita 140, entrata 200, 8 px); **M-C** zoom
della carta (320 ease-in-out, solo `transform` durante; etichette dopo, in 160); **M-D** lente del
provino (dissolvenza incrociata 160); **M-E** trama che svanisce a z 8,5 (opacità 160).

**Catture:** per ogni firma, a riposo, a metà (`page.clock` o animazioni in pausa al 50%) e alla
fine.

**Costi:**
- carta mobile: SVG unico, geometrie pre-proiettate, 60 elementi interattivi al massimo, trama in un
  solo `<path>` per tono (le celle concatenate in una `d`), tracce lontane in un solo `<path>`
  (cerchi come archi);
- durante il gesto solo `transform`; nessun long task > 50 ms durante un pan simulato;
- provino T2 lazy; tutte le immagini con `aspect-ratio`; **CLS < 0,02** con le immagini ritardate
  di 800 ms.

### 9. Tre idee «avanzate» (con la regola che le tiene oneste)

1. **Il mese negli anni** (P1). La Home e il rullino, il primo del mese, mostrano quel mese in ogni
   anno passato: «Settembre, negli anni: 2021 · 2022 · 2023 · 2024 · 2025», con i comuni da cui
   venivano i reel e le foto dei posti. Con 62 mesi senza buchi, ogni mese ha sempre almeno 4 anni
   di storia. *Regola:* «reel usciti a settembre», mai «settembre è il mese giusto per andarci»; mai
   classifiche.
2. **Nello stesso giro, con le tracce** (P1). «Vicino a questo» non conta più solo i 79 posti: conta
   anche le tracce entro 30 km («e 12 tracce dai reel qui intorno»). «Salva il giro» crea una raccolta
   «{Comune} e dintorni» con il posto, i posti vicini e le tracce della zona. *Regola:* distanze in
   linea d'aria solo tra posti (posizioni esatte); le tracce non hanno km (sono celle di 5 km), mai
   tempi o strade, mai «il nostro itinerario».
3. **La trama dell'archivio e la terra nuda** (P0 la trama, P1 la terra nuda). I quadretti a matita
   dicono dove si è girato; le regioni senza alcun post restano terra nuda con «Nessun post da qui».
   Nessun altro sito può mostrare il proprio vuoto con la stessa onestà del proprio pieno. *Regola:*
   conta i luoghi e non i reel, 3 toni, griglia di 5 km, niente etichette generiche; «nessun reel»
   non vuol mai dire «non ci siamo stati» (Puglia e Basilicata hanno post fotografici).

**In riserva:** l'indice delle domande dei 79 (P2); la lente di categoria sul provino (P2);
l'«Avvisami se ci andiamo» sulle regioni nude (serve il P0 degli endpoint, B1 della sintesi).
**Scartate:** la mappa di calore sfumata (§6.5), la stagionalità come consiglio, i conteggi di
visualizzazioni per luogo (metriche pubbliche vietate).

---

### 10. SPECIFICA per il costruttore

**Dove.** `SCRATCH/prototipi/A3/index.html`, pagina pubblicabile come artifact: HTML, CSS e JS
senza librerie, font incorporate, nessuna rete, immagini dai file pubblicati. **A e A2 non si
toccano.** Catture in `SCRATCH/prototipi/A3/shots/`.

#### 10.0 Dati e rotte

- `a3-data.js` (79 posti, già in preparazione) più **`a3-archivio.js`**: le tracce e i reel senza
  luogo, dal corpus con i campi del §1.4. Il file **non contiene** caption, plays, like, commenti,
  coordinate grezze delle tracce né codici in deny-list. Stima intorno a 150 KB `[VERIFY]`.
  Dipende da data-analyst per la suddivisione dei generici per livello e per il flag
  `paeseIncerto`.
- **`a3-carta.js`**: le geometrie pre-proiettate (§6.2).
- Normalizzazione dei nomi di regione come in MAPPA-SITO (minuscole, senza spazi e trattini, vince la
  grafia più frequente).
- **Rotte:** `#home`, `#esplora`, `#esplora-mesi`, `#esplora-luoghi`, `#mappa`,
  `#mappa-<preset>`, `#posto-<slug>`, `#traccia-<cella>`, `#miei`, `#lista-<codici>`, `#noi`,
  `#noi-atlante`. **Parametri:** `?oggi=AAAA-MM-GG`, `?stile=scuro`, `?demo=traccia-b`.

#### P0: primo giro, senza queste non è il prodotto

**P0-1 · L'archivio nei dati**
- Due strati caricati, deny-list assente, generici trattati come al §1.1.
- PW:
  - `window.__A3.posti.length === 79`;
  - il numero di post nell'archivio è uguale a quello del file meno la deny-list;
  - nessun oggetto dell'archivio ha le chiavi `caption`, `plays`, `likes` o `commenti`;
  - per ogni traccia, `lat` e `lng` sono centri di cella della `GRIGLIA_KM` (tolleranza 1e-6);
  - nessun segno sulla carta ha `generico ∈ {regione, paese}` o `paeseIncerto = true`.

**P0-2 · Token, scala tipografica, materiali**
- PW: l'insieme dei `font-size` visibili a 390, 768, 1024 e 1440 sta nell'insieme del §3.2; nessun
  nodo di testo in `#ff4d1a` o in un colore di categoria; axe con 0 violazioni.

**P0-3 · La base cartografica locale**
- PW:
  - esistono `[data-strato="terra"]`, `[data-strato="costa"]`, `[data-strato="confini"]`,
    `[data-strato="regioni"]` e `[data-strato="laghi"]`;
  - il testo «Natural Earth» è presente;
  - `page.on('request')` non registra host esterni, su tutte le rotte;
  - a z 5,2 sull'Italia la costa ha un `getBBox()` non nullo;
  - a zoom diversi `vector-effect` è `non-scaling-stroke` sui tratti.

**P0-4 · I livelli e i segni**
- PW:
  - a z < 4,5 esiste un solo `[data-disco="paese:italia"]`;
  - a z 5,2 i dischi italiani sono tanti quante le regioni con almeno 2 luoghi, e ogni numero è
    uguale al conteggio del dato;
  - a z 9 su una regione i dischi sono per comune;
  - a z 12,5 i segni `[data-segno="posto"]` visibili coincidono con i posti nella vista;
  - i segni posto hanno un anello (2 cerchi) e i segni traccia hanno `fill: none`;
  - gli elementi interattivi montati sono al massimo 60;
  - nessuna coppia di etichette visibili si sovrappone;
  - ogni disco ha l'anello pieno se e solo se contiene un posto.

**P0-5 · La trama**
- PW:
  - a z 5,2 esiste `[data-strato="trama"]` con al massimo 3 `path` (un tono per `path`);
  - il tono di ogni cella corrisponde a 1 / 2-4 / 5+ **luoghi distinti** del dato;
  - i posti non sono nella trama;
  - a z 9 la trama ha opacità 0;
  - le regioni senza alcun luogo non hanno celle e mostrano «Nessun post da qui» quando sono in
    vista a livello Territorio.

**P0-6 · La Mappa (schermata)**
- PW a 390:
  - carta 390×736 ±2;
  - il cartiglio contiene l'h1 «Dove siamo stati»;
  - i tasti +, −, Centra, Stile e Trama misurano almeno 44×44;
  - il tocco su un disco cambia lo zoom e porta i membri nella vista;
  - il tocco su un posto apre il foglio con «Apri la scheda»;
  - il tocco su una traccia apre il foglio con il testo «Posizione dal geotag del reel, non
    ricontrollata»;
  - `#mappa-europa` e i preset esistono solo per zone con luoghi.
- PW a 1440: A 360 ±4 e B 1008 ±4; C 480 ±4 con una scelta.
- PW: durante un trascinamento simulato di 300 px, `PerformanceObserver('longtask')` non registra
  nulla oltre i 50 ms.

**P0-7 · La Home-copertina**
- PW a 390 con `?oggi=2026-09-29`:
  - h1 entro y 184;
  - tavola 390×520 ±2 da y 222;
  - la foto appuntata è un posto con `evidenza=true` ed è collegata con un filetto al suo segno
    scelto;
  - la tavola non cambia `transform` a una rotella o a un trascinamento;
  - il clic sulla tavola porta a `#mappa`.
- PW a 1440:
  - tavola 1440×836 ±2;
  - il cartiglio (h1 incluso) copre al massimo 5 segni (intersezione dei `boundingBox`);
  - esistono da 2 a 4 riquadri fuori quadro, tutti con almeno un luogo;
  - più sotto esiste il provino con 79 celle e la lente, che cambia `data-slug` al passaggio.

**P0-8 · Cartiglio e regola del cartiglio (79)**
- Come nel mio giro precedente: la `.domanda` è uguale all'`hook`, al massimo 3 righe; `visibleTop ≥
  cartiglio + 0,01` su ogni immagine di posto e ogni taglio.

**P0-9 · Scheda del posto con cartellino e «Vicino a questo»**
- PW in ciclo sulle 79:
  - 3 celle piene;
  - «non ancora» in una sola scheda;
  - `[data-quanto]` se e solo se c'è `price` o `budget`;
  - `[data-prezzo-mancante]` se e solo se mancano entrambi;
  - le tracce nella tavola locale non hanno etichette in km;
  - la riga «E {n} tracce» ha n uguale al conteggio entro 30 km.

**P0-10 · Foglio della traccia**
- PW:
  - nessun nodo di testo con «visualizzazioni», «plays», «like» o «commenti»;
  - nessun testo di coordinate (regex `\d+[.,]\d{3,}°?`);
  - il permalink porta a instagram.com (link, non richiesta);
  - con `?demo=traccia-b` il riquadro è vuoto (nessun `img`) e la scritta «Esempio di impaginazione»
    è visibile.

**P0-11 · Esplora «Posti»** (porte, pillole, ritmo, vuoti; mai tessere L con `evidenza=false`)
**P0-12 · Ricerca sull'archivio** (i gruppi del §7.6; «madrid» dà almeno 2 posti; un comune dà
il gruppo «Comuni e regioni»)
**P0-13 · F1, F2 e F3 sui 79** (criteri del mio giro precedente)
**P0-14 · Overflow e CLS** (`scrollWidth === clientWidth` a 390, 768, 1024 e 1440; CLS < 0,02 con
le immagini ritardate)

#### P1: la rende avanzata

- **P1-1** Rullino dei 62 mesi con M-B (§7.2).
  PW:
  - `[data-mese]` è 62, dal 2026-08 al 2021-07;
  - ogni mese ha almeno 1 reel;
  - la somma dei reel è uguale al dato;
  - nessun testo con «visitat», «ci siamo stati» o «siamo stati a»;
  - i mesi del 2021-2023 senza schede non hanno `img`.
- **P1-2** Esplora «Luoghi» (§7.3 c). PW: la somma dei luoghi delle regioni è uguale ai luoghi
  sulla carta; le regioni nude sono in fondo con la frase.
- **P1-3** Cinema Dark (`?stile=scuro`, e il tasto Stile). PW: `data-stile="scuro"`; i toni della
  trama sono quelli `--trama-d-*`; axe senza violazioni sui testi della carta.
- **P1-4** F4 «L'atlante si apre» e F5 «Dalla carta alla scheda». PW: `startViewTransition`
  chiamato al tocco della tavola della Home e al secondo tocco su un posto; niente con reduced
  motion; in F5 il centro del `clip-path` è entro ±8 px dal punto.
- **P1-5** «Il mese negli anni» (idea 1) su Home e rullino. PW: con `?oggi=2026-09-29` le righe sono
  gli anni con reel a settembre, in ordine decrescente.
- **P1-6** Nello stesso giro con le tracce e «Salva il giro» (idea 2).
- **P1-7** I miei posti con raccolte e tracce salvabili; `#lista-<codici>` con i codici di cella.
- **P1-8** Noi e «Come è fatto questo atlante». PW: ogni numero della pagina è uguale a un calcolo
  sul dato esposto.
- **P1-9** Ingresso M-A.

#### P2: rifiniture

P2-1 lo stato (b) della traccia oltre il segnaposto (quando arrivano i fotogrammi); P2-2 la ripassata
a inchiostro; P2-3 l'indice delle domande; P2-4 il filtro timbro; P2-5 la lente di categoria sul
provino; P2-6 i fiumi principali (Natural Earth 10M) come strato di orientamento; P2-7 la zona
riservata della trama (dopo la decisione dell'owner).

#### Ordine di costruzione in due passaggi

**Primo giro: deve già stupire.**
1. Dati: posti, archivio ed esclusioni (P0-1).
2. `:root` A3 (P0-2).
3. Geometrie pre-proiettate e motore della carta: pan, zoom, livelli, tetto dei 60 (P0-3, P0-4).
4. La trama (P0-5).
5. **La Home-copertina a 390 e a 1440** (P0-7).
6. **La Mappa** con foglio e pannello (P0-6).
7. Il foglio della traccia (P0-10).
8. Cartiglio, scheda del posto e cartellino (P0-8, P0-9).
9. Esplora «Posti» (P0-11).
10. Ricerca (P0-12).
11. F1, F2 e F3 (P0-13).
12. Overflow e CLS (P0-14), poi le catture.

**Secondo giro: profondità.**
1. Rullino dei 62 mesi (P1-1).
2. Indice dei luoghi (P1-2).
3. Cinema Dark (P1-3).
4. F4 e F5 (P1-4).
5. Il mese negli anni (P1-5).
6. Nello stesso giro (P1-6).
7. I miei posti (P1-7).
8. Noi e l'atlante (P1-8), ingresso (P1-9).
9. P2.
10. Catture finali e confronto A2/A3.

**Catture richieste** (390 e 1440 salvo nota):
- Home: `01-home-copertina` (chiara), `01s-home-copertina-scura` (`?stile=scuro`, per la decisione
  1 dell'owner), `01b-home-provino`, `01c-home-lente-1440`.
- Mappa: `02-mappa-italia` (Territorio con trama), `02b-mappa-lombardia` (Area),
  `02c-mappa-luoghi` (livello Luoghi, posti e tracce vicini), `02d-mappa-mondo`,
  `02e-mappa-europa`, `02f-mappa-posto-scelto`, `02g-mappa-traccia-scelta`,
  `02h-mappa-regione-nuda`, `02s-mappa-scura`.
- Traccia: `03-traccia-foglio`, `03b-traccia-stato-b` (segnaposto).
- Schede: `04-scheda-granduca` (con prezzo), `04b-scheda-senza-prezzo`, `04c-scheda-vicino`
  (tavola locale con le tracce).
- Esplora: `05-esplora-posti`, `05b-esplora-vuoto`, `06-rullino` (un mese del 2026 e uno del
  2022), `07-luoghi-indice`.
- Altro: `08-ricerca`, `09-noi-atlante`.
- Firme F1-F5: a riposo, a metà, alla fine.
- Poi `confronto-A2-A3-mobile.png` e `confronto-A2-A3-desktop.png`.

## Out of scope (do NOT touch)

- Prototipi A, A2, B; `src/`; i file ad alto rischio; commit e push.
- Qualunque immagine per le tracce (nessun fotogramma esiste su disco); immagini generate, stock o
  esterne; contorni disegnati a mano; tessere di mappa nel prototipo; geolocalizzazione; service
  worker.
- Caption, visualizzazioni, like e commenti in qualunque schermata o file del prototipo.
- La modifica di `FullScreenMapExperience.tsx`: il §6.9 è per il giro React (code-architect e
  frontend).
- Copy definitivo (seo), diciture legali (seo e legale), zona riservata (owner).

## Open questions / decisions for the user

1. **Copertina della Home chiara o scura.** *Raccomandato: chiara* (Atlas Cream: è il brand); la
   scura resta come stile della Mappa. Decidete sulle due catture.
2. **Trama per luoghi o per reel.** *Raccomandato: per luoghi*, 3 toni: niente fari sulle zone dove
   si torna spesso.
3. **Zona di casa** (FP §14). *Raccomandato:* decidere un raggio privato; le celle lì dentro restano
   al tono più chiaro. La configurazione resta fuori dal repo.
4. **Colori delle tre categorie nuove** (notte, salvia, cipria) e il **colore dei laghi**.
   *Raccomandato: sì.*
5. **Fotogrammi da non mettere in evidenza** (§13). *Raccomandato:* confermarli uno per uno.
6. **«Satellite» nella mappa del sito:** togliere l'etichetta o comprare un satellite vero.
   *Raccomandato: toglierla ora.*
7. **Dove sta l'output della scansione con i fotogrammi delle tracce** (domanda del main thread):
   finché non c'è, le tracce restano solo testo.

## Next hand-off

- **Prima di costruire:** data-analyst produce `a3-archivio.js` (generici per livello,
  `paeseIncerto`, celle, deny-list tolta, nessun campo vietato), dagli script del FP. Frontend-builder
  procura le geometrie Natural Earth e le pre-proietta (`a3-carta.js`).
- **Poi:** frontend-builder (primo giro) → browser-auditor (catture, axe, rete, long task, CLS) →
  travellini-ui-designer (revisione con il §0) → owner.
- **Trigger:** `A3/index.html` esiste con P0-1…P0-14 e le catture del primo giro.
- **In parallelo:** asset-curator misura `cartiglio` sui 79 e controlla il §13 a piena risoluzione;
  seo scrive diciture e frasi; code-architect prende il §6.9 per il giro React.

## Notes

### 11. Cosa si tiene e cosa si lascia

- **Da A2 resta:** guscio e piano unico, barra a 5 voci, regola del cartiglio, M1-M11 dove non
  sostituiti, consenso dentro la carta (per le tessere dell'app vera), palette ⌘K, stati di §2.9.
- **Dal sito si riusa:** la mappa MapLibre con i suoi livelli, il tetto dei 60, i dischi a tre
  misure, il budget dei nomi, la normalizzazione delle regioni, il collegamento `?posto=`.
- **Dalla mia prima versione di A3** (79 posti; questo file la sostituisce): il cartiglio, il
  cartellino, il provino con la lente, le porte, le pillole, la colonna fotografica, i colori di
  categoria. **Si lascia:** le «quattro tavole» a punti senza contorni, la Home con eroe fotografico,
  il rullino di 28 mesi.

### 12. Miglioria operativa riusabile

Due regole da proporre per `DESIGN.md` (Layout Principles e sezione mappe):
1. **«Scala prima»:** i prototipi si fanno sul dataset intero quando è pubblico, mai su un
   sottoinsieme «per cautela». Un layout disegnato su 6 elementi è un altro layout.
2. **«Inchiostro e matita»:** ciò che è verificato è pieno e scuro, ciò che è traccia è grafite,
   vuoto e più piccolo, in ogni superficie. È una regola di verità visiva, e si può testare (stili
   calcolati di posti e tracce).

Più una verifica da aggiungere al quality-auditor: **nessun nome di etichetta di mappa punta a una
zona senza dati** (i preset «Puglia» e «Norvegia» di oggi).

### 13. Da far confermare all'owner (fotogrammi dei 79; numeri come nel `PROVINO`)

Tutti partono con `evidenza=false`: restano nella griglia e nel provino al loro posto di data, ma mai
come foto appuntata, lente, porta, tessera grande o copertina di mese.

**In attesa (indicati dal main thread):**
- 18 · Chiostro Cennini
- 28 · Narciso Home
- 5 · Alessandro Benini Wines (la «Vigna Benini»)
- 21 · Casa Lavanda, Podere Fossaccio
- 32 · Agriturismo Cornali

**Dubbio mio: possibile gravidanza** (guardati a circa 100 px: da ricontrollare a piena
risoluzione):
- 27 · Agriturismo Il Campagnino
- 36 · Garden Village Bled
- 56 · Nonno Andrea
- 60 · The Sense Experience Resort
- 62 · Iconic Marjorie Hotel

**Contesti di parco e attrazione** (possibili minori sullo sfondo):
- 3 · Storyland
- 11 · Rulantica
- 15 · Movieland Park & Caneva Aquapark
- 23 · Parco Cavour
- 30 · Capyland
- 33 · Shanghai Disneyland
- 41 · Phantasialand
- 52 · Europa-Park

**Personaggi o marchi di terzi** (domanda aperta dell'asset-curator):
- 3 · Storyland
- 19 · Warner Bros. Studio Tour London
- 33 · Shanghai Disneyland
- 50 · Choco Story Torino

Nessun contesto di salute riconosciuto a questa misura `[VERIFY]`.
