---
title: HANDOFF_webapp-travelliniwithus_ui-designer-raffinamento_to_frontend-builder
status: open
created: 2026-09-29
from: travellini-ui-designer
to: travellini-frontend-builder
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R5 (raffinamento della direzione A scelta dall'owner)
consumes:
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-direzione_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-architettura_to_orchestrator.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_owner_sintesi-R2.md
  - docs/50_Scratch/HANDOFF_webapp-travelliniwithus_seo_to_orchestrator.md (solo lessico e h1)
---

# Handoff: «Atlante tascabile» da prototipo a prodotto. Sistema, schermate, specifica

Documento in un repo pubblico. Nessun id di post, nessuna struttura sanitaria o abitazione,
nessuna coordinata di zone private. Gli unici luoghi nominati sono i 6 dei prototipi. I soli
numeri di fatto sono quelli dei prototipi e del fact pack (1.192 reel, 62 mesi, 409 luoghi
nuovi, 79 posti visibili); il resto è misura di progetto (px, ms) o è marcato `[VERIFY]`.
Contrasti: calcolati a mano con la formula WCAG, da confermare con axe.

Abbreviazioni per le catture: `A/NN` = `.../scratchpad/prototipi/A/shots/NN-*-390.png`,
`A/NN-1440` = la versione desktop; `B/NN` = `.../prototipi/B/shots/`; `SITO/NN` =
`.../scratchpad/shots/`. `SCRATCH` = `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad`.

---

## Per l'owner, in una pagina

**In breve.** L'anima di A non cambia: sabbia, Fraunces, fotogrammi veri, il timbro. Cambia il
modo in cui è costruita. Al posto di valori scelti caso per caso arriva un sistema unico di
misure e stati; il movimento collega le schermate invece di farle apparire; e ci sono tre
momenti che può avere solo Travelliniwithus.

**Cosa noterete per prima cosa**
1. **Il posto ha più spazio.** In basso resta un piano solo, più basso (116 px invece di 142).
   La foto si adatta all'altezza del telefono. Nome, domanda, prezzo e controllo stanno sempre
   nel primo schermo, senza righe tagliate a metà.
2. **Un formato di foto vostro: 5:7.** È il formato più alto che non mostra mai la scritta
   stampata sul reel. Il 9:16 compare solo quando il tocco porta al reel: il formato dice dove
   porta il tocco.
3. **La carta sembra una tavola d'atlante.** Cornice graduata, scala in km, nord, nomi in
   inchiostro, Madrid in un riquadro a parte come negli atlanti. Non c'è un contorno d'Italia
   disegnato: sono i vostri posti a farne vedere la forma.
4. **Ogni scheda ha la stessa ossatura:** prezzo, controllo, reel, a che titolo. Se un dato
   manca c'è scritto «non ancora», e non resta uno spazio vuoto.
5. **Sul computer, il banco dell'atlante.** Indice, scheda e carta stanno affiancati e i bordi
   si possono spostare. Esplora e Mappa sono lo stesso banco, con proporzioni diverse.
6. **La foto della card vola nella copertina della scheda.** Quando tornate indietro rientra
   al suo posto e la pagina è ancora dove l'avevate lasciata.
7. **Pulizia.** Via l'aletta «Prototipo», via l'arancio usato come colore del testo. Un solo
   tasto pieno per schermata. Il consenso della mappa sta dentro la carta, non in una finestra
   sopra la pagina.

**I tre momenti-firma**
- **Il retro del fotogramma.** Premete «Esiste davvero?» e la foto si gira. Sul retro ci sono i
  dati della scheda e un timbro con la data vera del controllo.
- **Dalla foto alla locandina.** «Guarda il reel» allunga la foto fino al 9:16 intero, con la
  scritta del reel. La domanda la fa il reel; la risposta la dà la scheda.
- **La ripassata a inchiostro.** Quando una traccia a matita diventa un posto, la prima volta
  che la rivedete il nome passa dal corsivo a matita all'inchiostro e compare la foto. Succede
  solo se è successo davvero.

**Perché sarà più professionale.** Ogni misura viene da una scala unica (spazi, testo, raggi,
ombre, tempi). Ogni pezzo ha tutti i suoi stati, compresi vuoto, errore e senza rete. Ogni regola
si può controllare con un test automatico: non vi chiederemo di verificare a occhio.

**Cosa non cambia.** Fraunces e Inter, la sabbia, la terracotta, le foto vere, le icone lucide,
la barra a 5 voci. Niente feed, niente autoplay, niente storie, niente pop-up, niente
contatori.

**Quattro decisioni vostre** (nessuna blocca questo giro; sotto trovate la mia raccomandazione):
il formato 5:7; il Chiostro Cennini in fondo alla griglia finché la sua cover è in attesa; il
tasto «La guida in regalo» contornato invece che pieno sul desktop; una foto vera di voi due per
«Noi».

**Questo giro** costruisce A2 (un nuovo prototipo accanto ad A, che resta intatto): il sistema,
il guscio, la scheda, la carta, il banco desktop, i primi due momenti-firma e la ricerca con
⌘K. **Il giro dopo** porterà i reel mese per mese, le tracce a matita, «Qui non ci siamo
stati», le liste e l'installazione.

---

## Why this work matters

L'owner ha scelto A e chiede che diventi professionale e avanzata senza tradire il brand. Il
prototipo di A dimostra la direzione, ma è costruito con valori scelti caso per caso: ha stati
mancanti, un solo punto di rottura del layout e un desktop che resta «griglia più pannello».
Questa consegna trasforma A in un sistema con token, stati e movimento. Disegna le 8 schermate
che mancano e dà al frontend-builder una specifica senza decisioni di design aperte, con criteri
verificabili con Playwright.

## Decisions already made (bloccate dal ui-designer: il builder non le rinegozia)

1. **Direzione A.** B non si riapre. Da B si prendono solo tre idee, riadattate: il 9:16 dove
   si guarda un reel, il «banco luminoso» come livello del reel, il retro del fotogramma.
2. **Un solo piano in basso da 116 px** (riga d'azione 60 + barra 56), senza filetto interno.
   La barra alta resta a 52 px su mobile e 64 su desktop.
3. **Il formato dice dove porta il tocco.** 5:7 pulito per i posti; 9:16 intero (scritta del reel
   compresa) solo dove il tocco porta al reel, con il badge «Reel · Instagram». 16:9 solo per la
   copertina nel riquadro della scheda su desktop.
4. **Regola del cartiglio misurabile:** la parte visibile del fotogramma comincia almeno 1 punto
   percentuale sotto il cartiglio (formula al §2.8).
5. **Ossatura fissa della scheda:** Prezzo, Controllato, Reel, A che titolo. Un campo vuoto si
   scrive «—» con la nota «non ancora».
6. **Un solo riempimento pieno per schermata**: l'azione primaria, in inchiostro. L'arancio
   `#ff4d1a` riempie solo indicatori di stato; non è mai colore di testo.
7. **Nessuna modale sulle voci.** Consenso della mappa e «Esiste davvero?» si risolvono dentro la
   pagina. Le uniche superfici sovrapposte sono la ricerca, il foglio trascinabile su mobile e il
   livello del reel.
8. **Carta senza contorni di paese e senza tessere esterne prima del consenso** (motivo al §6).
9. **Il corsivo ha tre usi soli:** la domanda del reel, la didascalia di provenienza e le tracce
   a matita. Mai su etichette, tasti o numeri.
10. **Movimento solo su transform e opacity**, un gesto per transizione, niente animazioni legate
    allo scroll (i cambi a soglia con IntersectionObserver sono ammessi), e con
    `prefers-reduced-motion` nessuna informazione persa.
11. **Chiostro Cennini** (cover con persona in gravidanza, hold Family): nessuna schermata nuova
    lo usa come protagonista. Nella griglia va in ultima posizione. Nelle ricerche d'esempio si
    usano altri posti.
12. **Copy:** tutti i testi qui sono provvisori. Dove esiste, uso il lessico provvisorio di
    seo-strategist (`HANDOFF_..._seo_to_orchestrator.md` §4-5); la parola finale resta a seo.

---

## Context the receiver needs

### 1. Diagnosi onesta dell'A attuale (20 punti)

Verdetto sul prototipo A come base di prodotto: **Block — vedi 11 serious** (nessun blocker:
la direzione regge, l'esecuzione no). Come direzione: confermata.

```
D1 [serious] guscio mobile, piano in basso — A/01, A/07a, A/14, A/15, A/16
Problema: riga d'azione 68 + barra 72 + due filetti = 142 px fissi; con la barra alta da 52
  restano 650 px su 844. In A/01 la prima voce di «Cosa sapere prima» finisce tagliata a metà
  sotto i tasti.
Perché conta: sembra un sito ristretto, non un'app, ed è la prima cosa che l'owner ha notato.
Correzione: piano unico da 116 (60 + 56, un solo filetto in cima), tasti da 44, copertina con
  altezza legata allo schermo (§9 P0-1, P0-6). Quando c'è contenuto sotto il piano, compare
  un'ombra che fa da stato.
```
```
D2 [serious] aletta «Prototipo — testi provvisori» — tutte le catture
Problema: pillola nera fissa in alto al centro, sopra la barra; su desktop copre «Esplora»
  nella barra delle voci (A/01-1440).
Perché conta: sporca ogni cattura e fa leggere tutto come bozza.
Correzione: toglierla dal layout; la nota resta nel <title> e in un parametro ?nota=1.
```
```
D3 [serious] la carta sembra un reticolo — A/05, A/05c, A/03-1440, A/05-1440
Problema: linee ogni 2° tutte dello stesso peso, gradi scritti dentro la mappa con alone,
  riquadro con bordo dentro un pannello con bordo (una card dentro l'altra, A/05-1440), 5
  punti in 740 px di vuoto; etichette in corsivo e una sola in tondo.
Perché conta: legge come carta millimetrata o grafico; per una voce fissa della barra è poco.
Correzione: tavola d'atlante (§6): cornice graduata, gradi fuori dalla cornice, reticolo
  al 12%, scala in km, nord, nomi in tondo, riquadro per Madrid, niente pannello attorno.
```
```
D4 [serious] schede corte e timbro incoerente — A/14, A/15, A/16, A/14-1440
Problema: su 5 posti su 6 la prova è una frase («Qui la scheda non l'abbiamo ancora scritta:
  niente prezzo e niente verifica») mentre il bollo «Esiste davvero?» resta sulla foto; «ADV»
  galleggia da solo sotto la domanda, senza etichetta.
Perché conta: la scheda sembra rotta e il bollo promette una prova che la pagina nega.
Correzione: ossatura fissa a 4 campi con «—» e «non ancora» (Decisione 5); dichiarazione dentro
  l'ossatura; bollo solo se c'è almeno la data del reel.
```
```
D5 [serious] «79» con 6 posti — A/03, A/09, A/03-1440
Problema: «Esplora · 79 posti provati di persona» e «Tutti i 79 posti…» aprono un elenco di 6.
Perché conta: è la regola di verità del brand, violata nel primo schermo.
Correzione: il numero si calcola da ciò che è mostrato; nel prototipo «6 posti su 79 (nel
  prototipo)» in coda all'indice. Mai un numero scritto a mano nel markup.
```
```
D6 [serious] «Il mese nell'archivio» sbagliato — A/09, A/06
Problema: l'etichetta mette in mostra Granduca, il cui reel è di gennaio, mentre il mese in
  corso è settembre.
Perché conta: l'idea 9 della sintesi è «reel usciti in questo mese negli anni passati»: così è
  falsa.
Correzione: l'etichetta nomina il mese («Settembre, negli anni passati») e sceglie un posto con
  un reel di quel mese [VERIFY: publishedAt dei 6 in content-seed]; se nessuno dei 6 va bene,
  nel prototipo l'etichetta diventa «Un posto dall'archivio».
```
```
D7 [serious] desktop pulito ma non avanzato — A/01-1440, A/09-1440, A/07-1440, A/08-1440
Problema: Esplora è griglia 3×2 più pannello; la Home è un «hero» testo a sinistra e foto a
  destra; I miei posti è una colonna di 640 px su 1440; la Mappa è un riquadro vuoto nel riquadro.
Perché conta: è il layout di mille siti, non uno strumento d'atlante.
Correzione: il banco a tre riquadri (§5); Home come prima pagina del numero (§5.4).
```
```
D8 [serious] gerarchia dei tasti — A/01-1440, A/05, A/13
Problema: su desktop il riempimento più forte di ogni schermata è l'arancio di «La guida in
  regalo» nella barra alta, più forte di «Salva per il viaggio». Sulla Mappa mobile il tasto
  pieno a tutta larghezza è «Apri la mappa interattiva», cioè il consenso pubblicitario.
Perché conta: la cornice grida più del contenuto, e la voce Mappa spinge verso un consenso che
  la sintesi (B4) chiede di separare.
Correzione: CTA della barra contornata; sulla Mappa la riga d'azione mostra il posto scelto
  («Apri la scheda»), mentre la mappa interattiva diventa un comando secondario dentro la carta.
```
```
D9 [serious] locandina con finto tasto play — A/11, A/11-1440
Problema: un cerchio play da 56 px al centro in basso della locandina sembra un player; tutta
  la locandina porta al profilo Instagram, non al reel.
Perché conta: DESIGN.md vieta i controlli media finti; il link al profilo delude chi voleva
  quel reel.
Correzione: badge in basso a sinistra «Reel · Instagram ↗», link al permalink del reel
  (campo dati [VERIFY: esiste in content-seed?]); se manca, testo onesto «Apri il profilo
  Instagram».
```
```
D10 [serious] modali centrate su desktop — A/10-1440, A/13-1440, A/13
Problema: «Esiste davvero?» e il consenso della mappa aprono una finestra al centro con lo
  sfondo scurito; su mobile, un foglio.
Perché conta: sono pop-up per nome e forma, e rompono la calma della pagina.
Correzione: «Esiste davvero?» gira la foto (firma 1); il consenso si apre come striscia
  dentro la carta (P0-10).
```
```
D11 [serious] nessun layout tra 390 e 1100 px — sorgente di A, righe 367-502
Problema: c'è un solo punto di rottura (1100). A 768 e 1024 la copertina resta alta 320 su tutta
  la larghezza, cioè un taglio di circa 3:1 che mostra il 17% del fotogramma; le 5 voci si
  allargano a 150-200 px l'una e le card a 2 colonne diventano larghe 360-480 px.
Perché conta: tablet e portatili piccoli vedono un telefono gonfiato.
Correzione: punti di rottura 768 e 1024 (§5.2). [VERIFY browser-auditor: catture 768 e 1024]
```
```
D12 [minor] arancio usato come testo e colori crudi — A/09, A/09-1440; sorgente righe 215, 449
Problema: «Ma esistono davvero.» è in `--color-accent` #ff4d1a (3,1:1 su sabbia, passa solo
  come testo grande); `.pane-carta .eyebrow{color:#9a3412}` è un esadecimale crudo.
Correzione: `--color-accent-text` sul corsivo della Home; su carta `--color-atlante-timbro-text`.
```
```
D13 [minor] 4:5 contro 9:16 — A/03, A/03b, B/03
Problema: il 4:5 è una scelta di comodo; il 9:16 di B mostra il cartiglio in ogni miniatura.
Correzione: 5:7, il taglio più alto che esclude il cartiglio (Decisione 3, §2.8).
```
```
D14 [minor] ritmo verticale e scala senza regola — A/01, A/02, A/08; sorgente
Problema: distanze 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32 senza logica; il titolo di
  sezione (17 px) è quasi uguale al testo (16 px); le date compaiono in due formati («16 gen
  2026» e «16 gennaio 2026»), con didascalia e data su due allineamenti diversi.
Correzione: scala 4/8 e scala tipografica chiuse (§2); date lunghe nel contenuto e corte solo
  nelle righe dense; didascalia unica «Fotogramma dal reel del 16 gennaio 2026».
```
```
D15 [minor] card selezionata su desktop — A/01-1440, A/14-1440
Problema: la card aperta si trova su un fondo carta che sborda di 8 px, come la selezione di un
  file manager.
Correzione: anello interno di 2 px in inchiostro sulla foto e nome sottolineato in accento; nessun
  fondo.
```
```
D16 [minor] ricerca minima — A/12, A/12-1440
Problema: una lista piatta con l'occhiello «RISULTATI», nessun evidenziato, nessun gruppo,
  nessuna navigazione da tastiera, nessuna traccia di ⌘K.
Correzione: palette di comando (§4e).
```
```
D17 [minor] I miei posti — A/06, A/07, A/06-1440, A/07-1440
Problema: nello stato vuoto compare l'occhiello «Il mese nell'archivio», che confonde; su
  desktop il 70% dello schermo resta vuoto; non ci sono liste, condivisione o stato senza rete.
Correzione: §4f.
```
```
D18 [minor] «Noi» con la foto di un posto — A/08, A/08-1440
Problema: il titolo è «Rodrigo e Betta», ma la foto è un fotogramma del Tonicello con una
  persona di spalle.
Perché conta: la pagina di chi siamo usa come ritratto una prova di luogo.
Correzione: una testata tipografica finché asset-curator non certifica una foto vera di
  entrambi [VERIFY]; §4g.
```
```
D19 [nit] Chiostro Cennini in prima riga — A/03, A/01-1440
Problema: la cover in attesa (hold Family) è tra i primi tre posti su entrambe le misure.
Correzione: ultima posizione nell'indice; mai come posto aperto, esempio o Home.
```
```
D20 [nit] miniatura del Granduca — A/03, A/14b
Problema: nella card 4:5 accanto al viso c'è un rettangolo rosato che sembra pixelato; nella
  copertina (A/01) lo stesso vaso è nitido.
Correzione: [VERIFY asset-curator: artefatto della variante 320 o 480?]
```

### 2. Sistema visivo di livello prodotto

I valori di colore sono quelli del PR #27 (BEST), gli stessi del prototipo. **Attenzione:** nel
checkout attuale `src/index.css` ha `--color-accent: #c2410c` e `--color-accent-text: #9a3412`,
mentre BEST ha `#ff4d1a` e `#c2410c`. Il prototipo A2 usa i valori di BEST, come chiede l'owner.
L'allineamento in `src/` lo decide code-architect dopo R4 `[VERIFY]`.

#### 2.1 Colori e ruoli (una regola ciascuno)

| Token | Valore | Ruolo | Regola d'uso |
| --- | --- | --- | --- |
| `--color-sand` | #faf8f4 | terreno | Fondo di guscio e pagine. Tutto parte da qui |
| `--color-surface` | #ffffff | foglio | Solo il riquadro della scheda su desktop e i campi di testo |
| `--color-atlante-carta` | #f2ecdf | documento | Cose «stampate»: carta, retro, stati vuoti, blocco guida, fogli |
| `--color-atlante-carta-deep` | #e6ddcd | carta in ombra | Premuto su carta, striscia del consenso |
| `--color-ink` | #0a0a0a | inchiostro | Testo primario e riempimento dell'unico tasto primario |
| `--color-ink-2` | #44403c | testo secondario | Domanda, corpo secondario, valori deboli |
| `--color-muted-fg-2` | #57534e | meta | Comune, didascalie, voci inattive (7,2:1 su sabbia, 6,5:1 su carta) |
| `--color-matita` **nuovo** | #6f6862 | matita | Solo tracce: nome, anello tratteggiato (5,2:1 su sabbia, 4,7:1 su carta) |
| `--color-border` | #e7e5e4 | filetto | Separatori su sabbia |
| `--color-atlante-linea` | rgb(30 28 24 / 24%) | filetto su carta | Cornici e filetti del registro su carta |
| `--color-atlante-linea-fine` **nuovo** | rgb(30 28 24 / 12%) | reticolo | Solo meridiani e paralleli |
| `--color-accent` | #ff4d1a | segno di stato | Solo riempimenti: indicatore di voce, cuore salvato. Solo su sabbia (3,1:1) o inchiostro (6:1). **Mai testo, mai su carta** (2,8:1) |
| `--color-accent-text` | #c2410c | accento testo | Occhielli, link, bollo, punto aperto sulla carta (4,9:1 su sabbia). Su carta passa solo per grafica (4,4:1) |
| `--color-atlante-timbro-text` | #9a3412 | accento su carta | Qualunque testo d'accento su carta (6,2:1) |
| `--color-atlante-inchiostro` | #1e1c18 | l'unico scuro | Solo il livello del reel («banco luminoso») e i punti della carta |
| `--color-accent-on-dark` | #e8834e | accento su scuro | Testo d'accento sul banco luminoso |

Mai testo in colore accento sopra una foto: le pillole su foto sono piene, sabbia o inchiostro.

#### 2.2 Tipografia (Fraunces asse `wght` + Inter 400/500/600)

Token pronti per `font: var(--type-…)`. Mobile, poi il valore da 1024 px in su.

| Token | Mobile | ≥1024 | Tracking | Uso |
| --- | --- | --- | --- | --- |
| `--type-display` | 440 36px/40px serif | 440 64px/68px | −0.015em | h1 della Home e di Noi |
| `--type-title-1` | 460 34px/38px serif | 460 44px/48px | −0.01em | Nome del posto (`h1` scheda) |
| `--type-title-2` | 460 30px/34px serif | 460 40px/44px | −0.01em | h1 delle voci (Esplora, Mappa, I miei posti) |
| `--type-title-3` | 460 20px/26px serif | 460 22px/28px | −0.005em | h2 di sezione («Cosa sapere prima») |
| `--type-name` | 460 17px/22px serif | 460 18px/22px | −0.005em | Nome nelle card |
| `--type-name-row` | 460 18px/24px serif | idem | −0.005em | Nome nelle righe del registro e della ricerca |
| `--type-hook` | italic 400 19px/26px serif | italic 400 20px/28px | 0 | Domanda del reel |
| `--type-caption` | italic 400 13px/18px serif | idem | 0 | Didascalia di provenienza |
| `--type-trace` | italic 400 17px/22px serif | italic 400 18px/24px | 0 | Nome di una traccia nelle righe |
| `--type-map` | 400 14px/18px serif | idem | 0 | Etichette dei punti sulla carta (corsivo solo per le tracce) |
| `--type-numeral` | 460 20px/24px serif, `tabular-nums lining-nums` | idem | 0 | Prezzo |
| `--type-body` | 400 16px/26px sans | 400 17px/28px | 0 | Testo corrente |
| `--type-ui` | 500 15px/20px sans | idem | 0 | Tasti, voci desktop, ritorno |
| `--type-ui-strong` | 600 15px/20px sans | idem | 0 | Tasti primari |
| `--type-label` | 400 13px/18px sans | idem | 0 | Comune · regione, note |
| `--type-label-strong` | 600 13px/18px sans | idem | 0 | Valori brevi nelle righe (dichiarazione) |
| `--type-tab` | 500 12px/16px sans | — | 0 | Etichette della barra mobile (unico 12 fuori dagli occhielli) |
| `--type-eyebrow` | 600 12px/16px sans, maiuscolo | idem | +0.12em | Occhiello; massimo 4 parole; mai nella cornice |
| `--type-kbd` | 500 12px/16px sans | idem | 0 | Tasti suggeriti nella palette |

Regole: nulla sotto i 12 px; il maiuscolo spaziato solo con `--type-eyebrow`; i pesi di
Fraunces sono 400 (corsivo), 440, 460 e 520 (solo l'etichetta del punto aperto sulla carta);
numeri con `tabular-nums` nei valori, nelle date e nelle scale. **Corsivo:** voce (domanda),
provenienza (didascalia) e matita (tracce). Altrove mai.

#### 2.3 Spazi, griglia e ritmo (base 4, passi da 8)

```css
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:20px;
--space-6:24px; --space-8:32px; --space-10:40px; --space-12:48px; --space-16:64px;
--gutter-m:20px; --gutter-t:32px; --gutter-d:40px; --gutter-banco:24px;
```

- Griglie: 390 → 4 colonne, margini 20, intercolonna 12 (contenuto 350); 768 → 8 colonne,
  margini 32, intercolonna 16; 1024 → 8 colonne, margini 24, intercolonna 24; 1440 → 12
  colonne, margini 40, intercolonna 24 (nel banco margini 24).
- Ritmo verticale: 4 dentro una riga composta (occhiello-nome), 8 tra elementi dello stesso
  gruppo, 16 tra gruppi, 32 tra sezioni, 48 prima di un blocco nuovo (per esempio «Altri
  posti»). Ogni altezza di riga è un multiplo di 2 e ogni blocco un multiplo di 4.
- Le altezze fisse (barre, tasti, righe) sono multipli di 4: 44, 52, 56, 60, 64.

#### 2.4 Raggi

```css
--radius-paper:2px;   /* nuovo: carta, retro, riquadri della tavola: la carta si taglia, non si arrotonda */
--radius-sm:6px;      /* miniature fino a 64 px */
--radius-md:10px;     /* righe attive, riga della palette */
--radius-lg:14px;     /* foto nelle card, copertina nel riquadro desktop */
--radius-xl:20px;     /* fogli (solo angoli alti su mobile), riquadro scheda desktop */
--radius-pill:999px;  /* tasti, campo di ricerca, bollo, badge */
```
Foto a filo di schermo: raggio 0.

#### 2.5 Elevazione (solo quattro, sobrie)

```css
--elev-panel: 0 1px 2px rgb(10 10 10 / 4%), 0 12px 32px rgb(10 10 10 / 6%);  /* riquadro scheda desktop */
--elev-sheet: 0 -12px 32px rgb(10 10 10 / 10%);                               /* foglio mobile */
--elev-float: 0 8px 24px rgb(10 10 10 / 12%);                                 /* palette, toast */
--elev-dock:  0 -8px 24px rgb(10 10 10 / 6%);                                 /* piano in basso, solo con contenuto sotto */
```
Card, carta, foto, bollo e barra alta non hanno ombra. Un'ombra che compare come stato si
anima solo in opacità, su uno pseudo-elemento.

#### 2.6 Guscio, strati, rapporti

```css
--shell-top-h:52px; /* 64px da 1024 */   --shell-action-h:60px;   --shell-bar-h:56px;
--dock-h:calc(var(--shell-action-h) + var(--shell-bar-h) + env(safe-area-inset-bottom,0px));
--z-dock:20; --z-topbar:30; --z-sheet:50; --z-palette:60; --z-reel:70; --z-toast:80;
--ratio-clean:5 / 7;    /* posti: card, righe, miniature */
--ratio-poster:9 / 16;  /* reel: locandina, banco luminoso */
--ratio-cover-d:16 / 9; /* copertina nel riquadro scheda desktop */
--cover-h-m:clamp(260px, 36svh, 340px);  /* copertina scheda mobile; svh per evitare salti con la barra del browser */
```

#### 2.7 Icone lucide

| Token | Misura | Tratto | Uso |
| --- | --- | --- | --- |
| `--icon-sm` | 16 | 2 | In riga con testo da 13-15 (ArrowUpRight, ChevronRight, Check) |
| `--icon-md` | 20 | 1.75 | Barra alta, azioni di riga, campo di ricerca |
| `--icon-lg` | 24 | 1.5 | Barra delle voci; voce attiva a tratto 2 invece che piena |

Set: House, Compass, Map, Heart, Users, Search, Share, ChevronLeft, ChevronRight, ChevronDown,
ArrowUpRight (sostituisce ExternalLink), ArrowUp (nord), Stamp, Film, MapPin, ShieldCheck,
Navigation, X, Check, LayoutGrid, List, Luggage (la valigia), PencilLine (tracce), Bell
(avviso), Link, WifiOff, CornerDownLeft, Undo2. Nessun SVG a mano: il nord è `ArrowUp` più la
lettera «N» in `--type-eyebrow`.

#### 2.8 Regola del cartiglio (formula verificabile)

Per un fotogramma 9:16 in un riquadro `object-fit: cover`, la frazione nascosta in alto è:

```
imgH = boxW × 16/9 × zoom          (se il riquadro è più stretto del 9:16)
visibleTop = (imgH − boxH) × posY / imgH
Vincolo: visibleTop ≥ cartiglio + 0,01
```

| Posto | cartiglio (stima) | Card 5:7 (posY 100%) zoom | Cover mobile 390×304 | Cover desktop 16:9 (432×243) |
| --- | --- | --- | --- | --- |
| Granduca di Campigna | 0,20 | 1,00 | 50% 72% (visibile da 40%) | 50% 64% (da 44%) |
| Emotional Grand Motel | 0,22 | 1,02 | 50% 72% | 50% 64% |
| Chiostro Cennini | 0,22 | 1,02 | 50% 72% | 50% 64% |
| Tonicello Resort & Spa | 0,22 | 1,02 | 50% 72% | 50% 64% |
| The Burton Juice | 0,24 | 1,05 | 50% 44% (da 24,7%) | **50% 36%** (da 24,6%; il 34% di A scende al 23%) |
| La Santoria | 0,22 | 1,02 | 50% 58% | 50% 52% |

Card 5:7 con allineamento in basso: mostra il 78,7% inferiore, quindi nasconde il 21,3%.
Lo zoom minimo è `max(1, 0,787 / (0,99 − cartiglio))`, applicato con `transform: scale()` e
origine `50% 100%`. È un ritaglio, non si inventano pixel. Tutti i valori di cartiglio vanno
misurati da asset-curator `[VERIFY]` e diventano un campo `cartiglio` nel dato dell'asset. Ogni
copertina 16:9 (anche 504×284 a 1024) nasconde la stessa frazione, quindi vale la stessa colonna.

#### 2.9 Componenti base e stati

«n/a» vuol dire che lo stato non esiste per quel componente, non che è stato dimenticato.

| Componente | Default | Hover (solo puntatore) | Focus | Pressed | Disabled | Loading | Empty | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tasto primario | ink pieno, testo sabbia, `--type-ui-strong`, h 44 (48 desktop), pill | fondo `--color-atlante-inchiostro` | anello 2 px `--color-accent-text`, offset 2 | scale .97 in 100 ms | fondo `--color-border`, testo `--color-muted-fg-2`, `aria-disabled`, motivo in una riga sotto | etichetta ferma, larghezza bloccata, `aria-busy`; «…» solo dopo 400 ms | n/a | torna default, riga d'errore sotto con `role="alert"` |
| Tasto secondario | bordo 1 px ink, testo ink | fondo ink al 4% | come sopra | fondo ink all'8%, scale .97 | bordo `--color-border`, testo muted | come primario | n/a | come primario |
| Link | `--color-accent-text`, sottolineato 1 px offset 3 | sottolineatura 2 px | anello | colore `--color-atlante-timbro-text` | n/a | n/a | n/a | n/a |
| Tasto icona 44×44 | icona 20 ink | cerchio ink al 5% | anello circolare | scale .94 | icona `--color-muted-fg-2` | n/a | n/a | n/a |
| Voce della barra (mobile) | icona 24/1.5 e etichetta 12 in `--color-muted-fg-2` | n/a | anello su tutta l'area 78×56 | scale .95 | n/a | n/a | n/a | n/a |
| — voce attiva | ink, tratto 2, indicatore 24×2 `--color-accent` sul filetto alto, `aria-current="page"` | | | | | | | |
| Voce desktop | `--type-ui`, muted | ink | anello | n/a | n/a | n/a | n/a | n/a |
| — voce attiva | ink, sottolineatura 2 px accento a 8 px sotto la linea di base | | | | | | | |
| Selettore a due viste | `--type-ui` muted, bordo basso trasparente | ink | anello | n/a | n/a | n/a | n/a | n/a |
| — scelta | ink, bordo basso 2 px `--color-accent`, `aria-pressed` | | | | | | | |
| Card posto | foto 5:7 r14, nome `--type-name`, meta `--type-label`, dichiarazione `--type-label-strong` | foto scale 1.02 in 300 ms, nome sottolineato 2 px accento | anello 2 px `--color-accent-text` offset 3 sulla foto | scale .98 della card in 100 ms | n/a | anteprima dal fotogramma (M7) sotto la foto | scheda tipografica su carta: nome Fraunces 20/24, comune, «Reel di gen 2026», filetti; nessuna icona | come empty; mai l'icona di immagine rotta |
| — card aperta | anello interno 2 px ink sulla foto, nome sottolineato 2 px accento, `aria-current` | | | | | | | |
| Riga del registro | nome `--type-name-row`, meta a sinistra, dichiarazione a destra, filetto sotto | nome sottolineato accento | anello `--radius-md` | fondo carta | n/a | n/a | «Nessun posto qui.» + come allargare | n/a |
| Riga traccia | anello tratteggiato 10 px matita, nome `--type-trace` matita, meta | nome sottolineato matita | anello | fondo carta | n/a | n/a | n/a | n/a |
| Bollo «Esiste davvero?» | pill h 40, sabbia, bordo 1,5 `--color-accent-text`, testo 13/600 maiuscolo, −2° | fondo carta | anello che segue la rotazione | M3 | **assente** se manca la data del reel | n/a | n/a | n/a |
| Punto della carta | 7 px ink, alone 2 px carta | etichetta visibile, anello 11 px | anello 2 px accento-testo a 22 px | scale .85 | n/a | n/a | n/a | n/a |
| — scelto / salvato | 12 px `--color-accent-text` con alone 3 px ed etichetta in Fraunces 520; salvato: anello 1,5 px ink da 11 px attorno al punto | | | | | | | |
| Campo ricerca e palette | h 48 (56 desktop), bordo `--color-border`, fondo surface, icona 20 | bordo `--color-atlante-linea` | bordo ink, nessun anello doppio | n/a | n/a | riga «Cerco anche nei reel…» in coda, mai sopra | esempi veri (solo i 6) | «Nessun posto per «x». Prova con il nome di una città.» |
| Campo email («Avvisami») | `FormField` + `Input` boxed, h 48 | bordo linea | bordo ink | n/a | senza rete: disabilitato con «Serve la rete per l'avviso» | «Invio…», `aria-busy` | n/a | bordo `--color-error`, messaggio `role="alert"` |
| Foglio (mobile) | carta, r20 in alto, maniglia 36×4, `--elev-sheet` | n/a | focus al titolo | trascinamento M5 | n/a | n/a | n/a | n/a |
| Riga di conferma / toast | sostituisce i tasti della riga d'azione (mobile); pill ink in basso (desktop), 5 s, «Annulla» | n/a | «Annulla» raggiungibile, niente timeout durante il focus | n/a | n/a | n/a | n/a | n/a |
| Riquadro immagine | colore dominante, poi anteprima, poi foto | n/a | n/a | n/a | n/a | M7 | ripiego tipografico | ripiego tipografico, nessun alt visibile |
| Separatore del banco | filetto 1 px `--color-border`, area di presa 12 px | linea 2 px ink, cursore `col-resize` | linea 2 px `--color-accent-text` | trascinamento: linea 2 px ink | alla larghezza minima: niente cursore | n/a | n/a | n/a |
| Riga senza rete | striscia 36 px carta sotto la barra alta, WifiOff 16, testo 13 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

Anello di focus unico per tutto: `outline: 2px solid var(--color-accent-text); outline-offset: 2px`.
Sulla carta usa `--color-atlante-timbro-text`, sull'inchiostro `--color-accent-on-dark`.

### 3. Sistema di movimento

```css
--dur-press:100ms; --dur-quick:160ms; --dur-base:220ms; --dur-slow:320ms; --dur-flip:400ms; --dur-exit:180ms;
--ease-out:cubic-bezier(0.16,1,0.3,1);        /* entrate (esiste) */
--ease-in:cubic-bezier(0.5,0,0.75,0);          /* uscite */
--ease-in-out:cubic-bezier(0.4,0,0.2,1);       /* rotazioni (esiste) */
--ease-settle:linear(0, 0.18 5%, 0.5 13%, 0.78 24%, 0.94 36%, 1.012 50%, 1.015 62%, 1.004 78%, 1); /* rilascio del foglio, superamento ≤1,5% */
```

Regole comuni: solo `transform` e `opacity`, oppure le istantanee delle View Transitions. Un
gesto per transizione. Uscita più corta dell'entrata. `will-change` solo durante l'animazione.
Nessuna animazione legata allo scroll: i cambi a soglia (IntersectionObserver) cambiano solo
uno stato. L'immagine LCP non si anima mai. Le due eccezioni al tetto di 320 ms sono i gesti
chiesti dall'utente (M4 e M10), mai la navigazione. Budget: CLS 0 causato dal movimento, nessun
frame oltre 16 ms nelle catture delle prestazioni.

| # | Transizione | Dove | Durata · easing | Cosa si muove | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| M1 | **Card → scheda, foto condivisa** | Esplora, Home, riga della Mappa → scheda (mobile: livello; desktop: riquadro) | 320 · ease-out | View Transition con `view-transition-name: foto-<slug>`: il gruppo va dal rettangolo della card (169×237, r14) alla copertina (390×304, r0). Le istantanee hanno `object-fit: cover` per non deformare. Il resto della pagina vecchia svanisce in 120 ms. Nome, domanda e prova salgono di 12→0 px con opacità, a 40 ms l'uno dall'altro, partendo da 120 ms (massimo 3 blocchi) | nessuna View Transition; cambio istantaneo, focus sull'h1 |
| M2 | **Cambio voce della barra** | tutte le radici | uscita 90 ms opacità; entrata 180 · ease-out | contenuto: opacità più translateY 6→0. Nessuno scorrimento laterale, perché le voci non sono pagine in fila (sarebbero storie). Indicatore: translateX 260 ms ease-out | istantaneo, l'indicatore salta |
| M3 | **Pressione del timbro** | bollo sulla copertina | pressione 100 ms, ritorno 180 ms ease-out; anello d'inchiostro 360 ms | bollo: scale .94 e rotazione −2→−4°, poi ritorno; pseudo-elemento: anello da scale 1 a 1,3 con opacità da .6 a 0 | nessuna animazione, si passa subito a M4 |
| M4 | **Il retro del fotogramma** (firma 1) | copertina della scheda | 400 · ease-in-out; parte a 120 ms da M3 | contenitore con `perspective: 1200px`: rotateY 0→180°, due facce con `backface-visibility: hidden`, altezza invariata. Il timbro datario sul retro «atterra» dopo il giro: scale 1,08→1 con opacità in 160 ms | scambio istantaneo delle facce, focus sul titolo del retro |
| M5 | **Foglio con inerzia** | foglio del posto sulla Mappa mobile, foglio della traccia, indice dell'articolo, liste | inseguimento 1:1; rilascio 180-320 ms · ease-settle | translateY. Velocità misurata sugli ultimi 80 ms; posizione proiettata = y + v × 200 ms; aggancio al livello più vicino (spiata 132, metà `50svh`, pieno `100svh − 52`). Chiusura se la proiezione va oltre la spiata di 60 px o se v > 1,1 px/ms verso il basso. Oltre il livello pieno la resistenza è 0,35. Velo di fondo: opacità legata alla posizione | il trascinamento funziona, l'aggancio è istantaneo; la maniglia è un tasto che passa da un livello all'altro |
| M6 | **Titolo nella barra alta** | radici e scheda, mobile | 160 · ease-out | quando l'h1 passa sotto la barra (IntersectionObserver, `rootMargin: -52px 0 0 0`), nella barra compare il titolo compatto (`--type-ui-strong`, massimo 200 px, puntini): opacità più translateY 4→0. Compare anche il filetto basso (opacità). L'altezza della barra non cambia mai | istantaneo |
| M7 | **Immagine con anteprima vera** | ogni riquadro immagine tranne l'LCP | 220 · ease-out | livello 1: colore dominante del fotogramma (campo `dominant`); livello 2: miniatura da 24 px dello **stesso** fotogramma (`<stem>-24.webp`, fatta in build con sharp, già in devDependencies), `filter: blur(12px)` e `scale(1.1)`; livello 3: la foto, con opacità 0→1 dopo `img.decode()`. L'anteprima resta sotto, quindi niente lampi. Nel prototipo il livello 2 è la variante `-320` sfocata | la foto compare senza dissolvenza |
| M8 | **Ritorno con scroll ripristinato** | indietro dalla scheda a una radice (tasto, gesto o browser) | come M1 al contrario | lo scroll della voce viene rimesso **prima** dell'istantanea nuova, nello stesso frame; poi la foto torna nella sua card. Se la card è fuori schermo, solo dissolvenza. Il focus torna alla card che aveva aperto la scheda | scroll rimesso, cambio istantaneo, focus alla card |
| M9 | **Salva → Salvato** | riga d'azione, riquadro desktop | 160 cuore; 200 riga | cuore: due SVG in dissolvenza incrociata (vuoto → pieno accento) più scale 1→1,12→1 in 220 ms; i tasti escono verso l'alto di 6 px e la conferma entra dal basso di 6 px. Nessun volo verso la voce, nessun contatore | cambio istantaneo, annuncio `aria-live` |
| M10 | **Dalla foto alla locandina** (firma 2) | «Guarda il reel» | 320 · ease-out; fondo 200 | View Transition dalla copertina (ritagliata) alla locandina 9:16 intera: il ritaglio si apre e compare il cartiglio del reel. Il fondo inchiostro sale in opacità | istantaneo |
| M11 | **Scelta di un punto sulla carta** | Mappa | 200 · ease-out | punto: scale 1→1,7 (da 7 a 12 px), cambio di colore istantaneo; la riga d'azione mobile cambia posto con M9 (6 px) | istantaneo |

Scelta tecnica: View Transitions dello stesso documento (`document.startViewTransition`), a zero
KB. Nel prototipo: `history.pushState` e `render()` sincrono dentro la callback, e lo stesso su
`popstate`. Senza supporto si usa la vecchia salita di 320 ms. Il nome di transizione va
assegnato solo durante il passaggio: alla card nello stato vecchio, alla copertina nello stato
nuovo. Sul banco desktop card e copertina esistono insieme, e due nomi uguali annullano la
transizione.

### 4. Schermate ancora da disegnare

Misure a 390×844 (sicurezza 0, come nelle catture) e 1440×900. Le y sono misurate dal bordo
alto. Barra alta e piano in basso sono quelli del §2.6.

#### (a) Esplora, vista «Reel per mese»

URL `/esplora?vista=reel&mese=2026-01` (nomi dei parametri di code-architect). h1 provvisorio di
seo: **«I posti come li abbiamo girati»** (sostituisce l'h1 di Esplora in questa vista; canonical
su `/esplora`). Sempre e solo al livello del comune: nessuna coordinata, nessun punto.

**Il formato annuncia dove porta il tocco:** nelle righe mobile, i reel che hanno una scheda
portano alla scheda e usano il 5:7; sul banco desktop le locandine portano al reel e usano il 9:16.

390×844:
- 0-52 barra alta (marchio, ⌕). 68-136 h1 `--type-title-2` (2 righe). 144-162 frase
  `--type-label` muted: «1.192 reel in 62 mesi, dal luglio 2021: nessun mese vuoto.» (fact pack §2).
- 172-216 selettore a due viste «Posti · Reel per mese» (a sinistra) e, solo nella vista Posti,
  il tasto densità LayoutGrid/List (a destra, 44×44).
- 224-272, **striscia del mese, fissa** (`position: sticky; top: 52px`): fondo sabbia, filetto
  basso, h 48. A sinistra il mese in lettura, «Gennaio 2026» in `--type-title-3`, aggiornato con
  IntersectionObserver sulle intestazioni. A destra «Cambia mese» (`--type-ui`, ChevronDown 16),
  che apre il foglio «Scegli il mese».
- Sezione del mese: intestazione «Gennaio 2026», `--type-title-3`, 32 px sopra e 8 sotto, più
  una riga `--type-label` muted «{n} reel · {k} con la scheda» (dall'indice, mai scritta a mano
  [VERIFY]). Poi le righe in ordine di data:
  - **reel con scheda**, riga di 84 px: miniatura 5:7 48×67 r6; nome `--type-name` ink; meta
    «Santa Sofia · 16 gen»; ChevronRight 16. Porta alla scheda (M1).
  - **traccia**, riga di 64 px: colonna di 48 px con l'anello tratteggiato matita da 10 px al
    centro; nome `--type-trace` matita; meta «{Comune} · 3 mar · traccia a matita»; ChevronRight.
    Apre il foglio della traccia (b).
  - **reel senza luogo**, riga di 48 px: colonna vuota; «Reel del {giorno mese}» `--type-label`
    muted; ArrowUpRight 16. Porta al reel su Instagram. Il testo della caption non si mostra mai.
- Foglio «Scegli il mese» (M5, livello metà): per ogni anno, dal 2026 al 2021, l'etichetta
  `--type-eyebrow` e poi i mesi su 2 righe da 6 celle 56×44 («gen»…«giu», «lug»…«dic»). Le celle
  fuori dal periodo (prima di luglio 2021, dopo agosto 2026) sono vuote e non si possono premere.
  Nessuna intensità di colore per numero di reel: sarebbe una heatmap, cioè una metrica.
- Stati: caricamento dell'indice (chunk lazy) con 6 righe scheletro statiche di 64 px, carta,
  senza luccichio; errore «L'indice dei reel non si è aperto. Riprova.»; senza rete «Senza rete
  vedi solo i reel dei posti che hai salvato.».

1440×900 (dentro il banco, §5): il riquadro A diventa l'**indice dei mesi**, largo 360: 6 righe
di anni con 12 celle 24×32 in `--type-label` («g f m a m g l a s o n d»); il mese in lettura ha
il fondo ink e il testo sabbia. Il resto (x 408-1416) è il **banco del mese**:
- «Gennaio 2026» in `--type-title-2`, poi la frase dei conteggi;
- la fila delle **locandine 9:16** 180×320 dei reel con scheda, ciascuna con il badge «Reel ↗»
  in basso a sinistra, il nome e la data sotto. Il tocco apre il banco luminoso (M10), e sotto
  c'è il link «Apri la scheda»;
- «Tracce a matita», righe su 2 colonne da 480;
- «Altri reel del mese», righe senza luogo.
Lo scorrimento è continuo per mese; l'indice evidenzia il mese visibile.

#### (b) Tracce a matita

Una traccia non ha pagina (Decisione 5 dell'architettura). Si apre come **foglio** su mobile e
nel riquadro C su desktop. URL: stato in query (`?traccia=<codice>`), mai indicizzato.

390×844, foglio a metà (y 420-728, appoggiato sul piano, che resta visibile):
- maniglia 36×4 a y 428; occhiello a y 448, con PencilLine 16 e «Traccia a matita» in
  `--color-atlante-timbro-text` (siamo su carta);
- nome a y 472-540, Fraunces corsivo 460 30/34 in `--color-matita`, su 2 righe al massimo
  (larghezza 214, a sinistra della carta mini);
- «{Comune} · {Regione}» `--type-ui` ink-2 a y 548; «Reel di marzo 2023» `--type-label` a y 572;
- a y 600-648 una nota tra due filetti `--color-atlante-linea`, `--type-body` ink-2: «Qui la
  scheda non l'abbiamo ancora scritta: niente prezzo, niente controllo, niente foto.» E sotto,
  a y 656-674, `--type-label` muted: «Posizione presa dal geotag, non ricontrollata.»;
- carta mini 120×148 a destra (x 250-370, y 472-620), con l'anello tratteggiato di 16 px sul
  comune e nessun punto;
- in questo livello la riga d'azione diventa: primario ink «Guarda il reel ↗» e secondario
  «Salva». Il terzo gesto («Avvisami quando c'è la scheda») esiste solo se passa l'idea 15, che
  è nel pacchetto Audace, non in Firma.
- Nessuna immagine, mai, finché la traccia non diventa un posto (firma 3).

1440: il riquadro C (496) mostra, al posto della copertina, un blocco carta 432×220 r2 con il
nome in Fraunces corsivo 40/44 matita, a sinistra, e la carta mini a destra; poi gli stessi
campi.

#### (c) Regione a zero reel: «Qui non ci siamo stati»

Rotta esistente `/destinazione/<regione>`, `noindex, follow`, fuori dalla sitemap (seo). Nessuna
immagine: la copertina generata attuale viene tolta (B3 della sintesi). Qui la regione resta un
segnaposto: `{Regione}`.

390×844 (radice Esplora, barra alta «‹ Esplora»):
- 64-80 occhiello «{Regione}»; 84-160 h1 `--type-title-1` «Qui non ci siamo stati», su 2
  righe; 172-252 testo `--type-body` ink-2 dal lessico seo: «In {Regione} non abbiamo ancora
  girato niente. Non riempiamo il vuoto con posti che non abbiamo visto.»;
- 272-528 **tavola vuota** 350×256 r2: cornice graduata, reticolo, il nome «{REGIONE}» in
  maiuscolo spaziato (`--type-eyebrow`, spaziatura 0.3em) al centro, nessun punto. Dove c'è
  spazio, i posti provati più vicini sono indicatori sul bordo («→ The Burton Juice») `[VERIFY:
  serve il centroide della regione da una fonte pubblica]`;
- 552-596 **l'unico gesto:** tasto secondario a tutta larghezza «Avvisami se ci andiamo»
  (Bell 18). Al tocco si apre sotto, nella pagina, un modulo di 176 px (non una modale):
  `FormField` «La tua email», la nota «Ti scriviamo una volta sola, quando esce il primo reel da
  qui.» [VERIFY growth: lista e consenso separati], il primario «Avvisami». Stati: invio
  («Invio…»), fatto («Fatto. Ti scriviamo solo se ci andiamo.»), errore («Non è partito.
  Riprova.»), senza rete (disabilitato, con il motivo);
- **Finché il bug P0 degli endpoint è aperto** (B1 della sintesi) il gesto non si mostra: al
  suo posto c'è solo «Intanto, i posti provati più vicini» (3 righe del registro);
- in fondo «Tutte le regioni» (link) e il colofone.

1440: due colonne. A sinistra (x 40-680) la tavola vuota 640×720; a destra (x 744-1344)
occhiello, h1 44/48, testo, gesto, righe.

#### (d) Dall'app all'articolo di lettura

L'articolo resta chiaro, lungo e indicizzato. È un livello, non una voce.

- **Si entra** da una riga «Guida» in Esplora o da «Nelle guide» della scheda. La miniatura della
  riga diventa l'immagine d'apertura (M1). Su mobile l'apertura è: immagine 390×260 tagliata
  senza cartiglio (50% 72%), poi l'occhiello, l'h1 `--type-title-1` **sotto** l'immagine (mai
  sopra, per non avere due titoli con il cartiglio), il sommario, e «Rodrigo & Betta · {data} ·
  {n} min».
- **Resta del guscio:** la barra alta (52), che diventa barra di lettura con «‹ Esplora», il
  titolo compatto (M6), Indice (List 20), Salva (Heart 20) e Condividi (Share 20); e la barra
  delle voci (56). Nessuna riga d'azione, nessuna pillola scura, nessuna percentuale di lettura.
- **Corpo:** Inter 18/30 (token dell'articolo in produzione), colonna di 350 su mobile e di 680
  su desktop, al massimo 68 caratteri per riga. I blocchi editoriali di oggi restano.
- **Indice:** un foglio (M5) con gli h2; la sezione in lettura è segnata con IntersectionObserver
  (è uno stato, non un'animazione).
- **Si esce:** con indietro si torna a Esplora con lo scroll rimesso (M8). In fondo all'articolo:
  «I posti di questa guida» (registro), Salva e «Tutti i posti».
- **Desktop 1440:** pagina intera, niente banco. Colonna di 680 centrata (x 380-1060); a
  sinistra (x 120-340) l'indice fisso sotto la barra; a destra (x 1100-1380) «I posti di questa
  guida» con la carta mini. Il bug «Torna alla sezione» sopra il logo (B14) sparisce perché il
  ritorno sta nella barra alta.

#### (e) Ricerca ⌘K come palette di comando

Nel guscio, aperta da ⌘K/Ctrl+K, dall'icona ⌕ o dal campo della Home. Segue il pattern ARIA
combobox + listbox con `aria-activedescendant`.

1440×900: pannello 640×(fino a 560) a x 400, y 96, fondo sabbia, r20, `--elev-float`, velo
sabbia all'80%, **senza sfocatura**.
- Campo h 56: Search 20, input Inter 400 17/24, a destra il tasto «Esc» (`--type-kbd`, bordo
  1 px `--color-border`, r6, 24×20).
- Senza testo, tre gruppi con intestazione `--type-label-strong` muted (niente maiuscolo
  spaziato): «Posti» (3 righe: Granduca, Tonicello, The Burton Juice), «Vai a» (Mappa, I miei
  posti, La guida in regalo, con l'icona della voce), «Dove siamo stati» (le regioni presenti).
- Con testo, i gruppi sono: «Posti» (miniatura 5:7 40×56 r6, nome `--type-name-row` con la parte
  trovata in `<mark>`, cioè sottolineatura 2 px `--color-accent` senza fondo giallo; meta);
  «Comuni e regioni» (MapPin 16, «Emilia-Romagna · 1 posto», contato dai dati); «Tracce a
  matita» (solo se l'indice è caricato: righe matita); «Guide».
- Tastiera: ↑↓ spostano la riga attiva (fondo carta, `--radius-md`), Invio apre, Esc chiude. Il
  focus torna al comando che l'aveva aperta.
- Piede di 36 px, `--type-kbd` muted: «↑↓ per scegliere · ↵ per aprire · Esc per chiudere».
- Nessun risultato: «Nessun posto per «x». Prova con il nome di una città.» Se però l'indice
  delle tracce ne trova una: «C'è un nostro reel a {comune}: è una traccia a matita.»
- Caricamento: i posti rispondono subito (dati di build); le tracce arrivano da un chunk lazy,
  segnalato da una riga in coda «Cerco anche nei reel…». I risultati si aggiungono solo in coda,
  così nulla sopra si sposta.
- Esempio nelle catture: «camp» → Granduca di Campigna. Mai il Chiostro Cennini.

390×844: livello a tutto schermo sopra il guscio. Campo nella barra (h 52), gli stessi gruppi,
righe di 64, nessun piede con i tasti. Ricerche recenti solo con il consenso di
personalizzazione; senza, non se ne salva nessuna.

#### (f) I miei posti: liste, condivisione, «la valigia»

URL `/preferiti` (etichetta «I miei posti»), privata, noindex.

390×844:
- 64-98 h1 `--type-title-2` «I miei posti»; 106-150 selettore «Posti · Guide».
- 162-198 **riga della valigia**, sotto il selettore: Luggage 16, poi «In valigia: si aprono
  anche senza rete» (`--type-label` ink-2) quando tutti i salvati sono in cache; «Sto mettendo in
  valigia 2 posti…» mentre scarica; senza rete «Senza rete: qui trovi solo ciò che è in
  valigia».
- «Le tue liste», registro: «Tutti i salvati» (sempre primo), poi le liste create («Weekend di
  ottobre»). Ogni riga ha il nome `--type-name-row` e «3 posti · aggiornata il 29 set». In fondo
  la riga «Nuova lista», che apre un foglio con un campo nome e «Crea». Niente chip, niente
  modalità di modifica.
- Lista aperta (livello): righe da 96 con miniatura 5:7 56×78, nome, comune, «Salvato il 29
  set», a destra lo stato della valigia (Luggage 16 ink = in valigia, testo muted «in arrivo») e
  il cuore 44×44. Il tocco sul cuore toglie il posto e mostra «Tolto dai miei posti · Annulla»
  per 5 s.
- Azioni della lista, nella riga d'azione: primario «Mandala a chi viene con te» (Share 18),
  cioè la condivisione nativa con `/preferiti?lista=<id,id,id>` (solo id pubblici), e in
  alternativa la copia del link con «Link copiato»; secondario «Vedi sulla mappa».
- Chi riceve il link vede il livello «Una lista da aggiungere»: le righe in anteprima, il
  primario «Aggiungi ai miei posti» (chiede conferma, non sovrascrive mai) e il secondario «Solo
  guardare».
- Nel browser di Instagram, in testa, una nota su carta: Link 16, «Salvati in questo browser.
  Per ritrovarli altrove, copia il link della lista.» e «Copia il link».
- Vuoto, su carta r14: Heart 24 e la frase seo «Qui finiscono i posti che salvi. Per ora è vuoto:
  tocca Salva su una scheda e lo ritrovi qui.»; poi «Da dove cominciare: il posto del mese» (una
  riga) e il secondario «Tutti i posti».

1440: banco a tre (§5). A (360) le liste; C (536) le righe della lista scelta; B (448) la
**tavola inquadrata sui salvati** con un titolo discreto «Il tuo atlante» e i punti salvati
cerchiati.

#### (g) Noi, con Family e Collaborazioni come lenti

Nessuna modale, nessuna domanda d'ingresso, nessuna pelle nuova: la lente cambia l'ordine della
Home, la CTA della barra alta desktop e la prima porta di Noi. Non cambia fondo né raggi.

390×844:
- **Testata tipografica** (D18), finché non c'è una foto certificata di entrambi: 64-80
  occhiello «Travelliniwithus»; 84-124 h1 `--type-display` «Rodrigo e Betta»; 136-214 testo
  `--type-body` (quello di A).
- «Come lo raccontiamo»: le 3 righe di A (reel, controllo, dichiarazione), invariate: sono buone.
- **«Le edizioni»**, un gruppo di scelta (`role="radiogroup"`) disegnato come registro: 3 righe
  da 72 px. Ogni riga ha il nome `--type-name-row` («Viaggiatori», «Family», «Collaborazioni»),
  una frase `--type-label` (da `audienceEditions.ts`) e a destra un cerchio da 20 px; quella in
  uso ha il cerchio pieno ink e la scritta «In uso». Sotto Family: «@travellinifamily è un
  profilo a parte» più il link. Sotto Collaborazioni: «Media kit e come lavoriamo» più il link.
  Il cambio vale subito, senza ricaricare e senza animazioni oltre M9.
- «La guida in regalo», blocco carta r14 con il tasto secondario «Ricevila» → `/guida-in-regalo`.
- «Su questo dispositivo»: «Privacy e mappa» (consensi), «Tienila sul telefono» (vedi h),
  «Posti in valigia: 3» (con il link a I miei posti).
- Colofone.

1440: colonna di contenuto di 640 (x 160-800); a destra (x 880-1280), fissa, la catena «Come lo
raccontiamo» come registro su carta.

#### (h) Primo avvio e proposta d'installazione

- **Primo avvio:** nessuna schermata di benvenuto. Il banner del consenso **occupa il piano in
  basso** al posto di riga d'azione e barra (148 px + sicurezza). Contiene 2 righe
  `--type-label` ink-2 [testo di seo o del legale], due tasti secondari di pari peso, «Rifiuta» e
  «Accetta», 44 h, e il link «Scegli». Dopo la risposta il piano torna a 116 px con una
  dissolvenza di 200 ms. Il contenuto è ancorato in alto, quindi non si sposta nulla di visibile.
- **Proposta d'installazione.** Condizioni, tutte insieme: almeno la seconda sessione, almeno un
  salvataggio, app non già installata, fuori dal browser di Instagram, nessun «Non ora» negli
  ultimi 90 giorni. Luogo: **una scheda in testa a «I miei posti»** e una riga in Noi. Mai modale,
  banner, toast o contatore.
- Scheda d'installazione, carta r14, padding 16, 350×(148 Android / 196 iOS): icona dell'app
  40×40 r10 (quella del manifest [VERIFY asset]); titolo `--type-title-3` «Tienila sul
  telefono»; testo `--type-label`: «Si apre come un'app e i posti in valigia restano anche senza
  rete. Nessuna registrazione.»
  - Android/Chromium: primario «Aggiungi alla schermata Home» (usa il `beforeinstallprompt`
    rimandato) e link «Non ora».
  - iPhone: due passi numerati in riga, «1. Tocca Condividi [Share 16]» e «2. Scegli "Aggiungi
    alla schermata Home"» [VERIFY dicitura iOS]. Se ci sono salvati, prima: «Copia il link della
    lista e aprilo dall'app», perché su iOS l'app non vede lo spazio di Safari [VERIFY].
- **Primo avvio dell'app installata:** la Home nello stato di ritorno. Se non ci sono salvati
  (iOS), una nota su carta: «Hai salvato dei posti in Safari? Apri qui il link della lista.»

### 5. Desktop più avanzato di una griglia con pannello: il banco dell'atlante

#### 5.1 Il banco a tre riquadri

Sul tavolo (sabbia) stanno tre oggetti: l'**indice** (A), il **foglio** della scheda (C, bianco,
`--elev-panel`) e la **tavola** (B, carta, r2). Tra i riquadri non ci sono cornici né card
annidate: solo filetti e separatori mobili. Non ci sono contatori laterali, né barre a 6 voci,
né barre di strumenti con icone.

1440×900, barra alta 64 (marchio, 5 voci di testo, ⌕ con «⌘K» in `--type-kbd`, CTA contornata
«La guida in regalo»), riquadri tra y 80 e 884, margini 24, separatori da 24:

| Stato del banco | A · indice | B · tavola | C · foglio | Quando |
| --- | --- | --- | --- | --- |
| **Esplora, nulla aperto** | x 24-624 (600): griglia 5:7 a 3 colonne da 186 (foto 186×260), 6 posti nel primo schermo | x 648-1416 (768): tavola grande 652×804 centrata, con legenda e riquadri esterni | — | `/esplora` |
| **Posto aperto** | x 24-624 (600) | x 1168-1416 (248): striscia con la tavola 248×306 e sotto «Nello stesso giro · entro 30 km» (lessico seo) | x 648-1144 (496): copertina 16:9 432×243, nome 44/48, prova, azioni in pagina, sezioni | `/posto/<slug>` aperto dall'app |
| **Mappa** | x 24-384 (360): registro per regione | x 408-1416 (1008): tavola 652×804 più i riquadri esterni nel margine | si apre al posto di metà B quando scegli un punto | `/mappa` |
| **I miei posti** | x 24-384 (360): liste | x 968-1416 (448): «Il tuo atlante» | x 408-944 (536): righe | `/preferiti` |

- **Separatori** tra A-B e B-C (o A-C): area di presa di 24 px con un filetto di 1 px al centro;
  `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow` in px, focalizzabile; ←→
  spostano di 24 px e Home/Fine portano ai limiti. Doppio clic: la tavola si chiude a 0 (e resta
  il tasto «Carta» nell'intestazione di C) o si riapre.
- **Larghezze minime:** A 320 (sotto i 440 passa alle righe; 2 colonne da 440 a 599; 3 colonne
  da 600); B 248, sotto la quale si chiude; C 440-600. Le larghezze restano in sessionStorage
  (preferenza tecnica, niente consenso [VERIFY legale]).
- **Cambio di stato:** A resta ferma. B e C cambiano larghezza con una View Transition di 320 ms
  (le istantanee si spostano in transform). Con reduced motion il cambio è istantaneo.
- **Sincronia:** passare sopra una card accende il suo punto (anello da 11 px) e passare sopra un
  punto accende la sua card. Solo il clic fa scorrere. Nulla si muove da solo.
- **Link diretto** (da Google) su `/posto/<slug>`: pagina intera, non il banco. Colonna di 720
  centrata; a destra (x 1120-1400) la tavola mini, le azioni e «Apri nell'atlante», che porta al
  banco con il posto aperto (architettura §2b).

#### 5.2 Passaggi tra le misure

| Larghezza | Navigazione | Esplora | Scheda | Mappa |
| --- | --- | --- | --- | --- |
| **390** (< 768) | barra alta 52 + piano in basso 116 | 1 colonna, griglia 2×(169×237) | livello a tutta pagina, copertina 390×`--cover-h-m` | tavola 350×432, riga d'azione con il posto scelto |
| **768** (768-1023) | barra alta 52, piano in basso con **icona ed etichetta affiancate** (5 voci da 153, h 56); la riga d'azione resta solo sulla scheda | margini 32, griglia a 3 colonne da 224 (foto 224×314) | livello; copertina 768×400 a 50% 66%; corpo su 2 colonne (nome, domanda, prova a sinistra 400; sezioni a destra 296) | tavola 704×520 + registro sotto |
| **1024** (1024-1279) | barra alta desktop 64, niente piano in basso | banco a due: A 400 (righe o 2 colonne) + B/C 552 | nel riquadro C (552): copertina 16:9 504×284 | A registro 360 + B tavola |
| **1440** (≥ 1280) | barra alta 64 | banco a tre (§5.1) | riquadro C 496 | come §5.1 |
| **≥ 1680** | come 1440 | il banco si ferma a 1600 ed è centrato; crescono A e B, C al massimo 600 | | |

Da 1024 in su le azioni della scheda stanno in pagina e le voci nella barra alta; sotto i 1024
stanno nel piano in basso. L'URL è sempre lo stesso: cambia solo la veste (idea 5 della sintesi).

#### 5.3 Perché non è una dashboard

Nessun numero come titolo, nessun riquadro con indicatori, nessuna barra laterale di filtri.
I riquadri sono oggetti di carta, non widget. Il test della sfocatura a 8 px (criterio 2 di R1)
deve far vedere «una pagina, una carta, un foglio».

#### 5.4 Home desktop come prima pagina

1440: griglia a 12 colonne. Nelle colonne 1-5 l'h1 `--type-display`, il testo, il campo di
ricerca (con «⌘K») e il link. Nelle colonne 6-9 il posto del mese, foto 5:7 392×549, con
occhiello, nome e «Reel di …». Nelle colonne 10-12 «Nello stesso mese, negli anni» (fino a 4
righe del registro) e la tavola mini 200×246, che porta alla Mappa. Resta tutto in un solo
schermo.

### 6. La carta: una tavola d'atlante, con 6 punti come con 79

**Perché niente contorni di paese.** La spec del mio giro precedente li vietava per tre motivi.
1. Un contorno disegnato o generato è la rappresentazione inventata di un luogo reale: ricade
   nella regola sulle immagini vere. Sarebbe ammesso solo da una fonte di pubblico dominio con
   licenza verificata [VERIFY: Natural Earth], con una decisione a parte.
2. Pesa: qualche decina di KB di geometria contro un budget di `initial-js` quasi pieno.
3. Una costa precisa suggerisce una precisione che le tracce non hanno e non devono avere, perché
   stanno al comune.

Resta vero anche qui: **nessun contorno, nessuna tinta per area** (una tinta di regione richiede
un confine) **e nessuna tessera esterna prima del consenso**.

**Come fa a sembrare una carta** (tutto in SVG locale, `role="img"` più l'elenco equivalente):

| Elemento | Misura (tavola mobile 350×432) | Regola |
| --- | --- | --- |
| Cornice | filetto esterno 1 px `--color-atlante-inchiostro`; 4 px dentro il **bordo graduato**, segmenti di 1° alternati inchiostro e carta; poi 8 px di margine | È il segno più riconoscibile di una tavola |
| Gradi | fuori dalla cornice: latitudini a sinistra e a destra, longitudini sotto, solo ogni 2°, `--type-label` tabular in `--color-muted-fg-2` | Mai dentro l'area della carta |
| Reticolo | meridiani e paralleli ogni 2°, 0,5 px, `--color-atlante-linea-fine` | Leggero: non deve sembrare carta millimetrata |
| Scala | in basso a sinistra, dentro la cornice: «0 · 100 · 200 km», barra a segmenti come la cornice, 64 px | 1 unità del viewBox vale 8,3 km (111,2 / 13,4), quindi 100 km = 12,05 unità; a 322 px di larghezza utile sono 32 px ogni 100 km |
| Nord | in alto a destra: ArrowUp 16 più «N» `--type-eyebrow` | Nessuna rosa dei venti decorativa |
| Posti | punto ink 7 px con alone 2 px carta; etichetta `--type-map` **tondo** ink | Il tondo vale per i posti, il corsivo per le tracce |
| Posto scelto | 12 px `--color-accent-text` con alone 3 px; etichetta Fraunces 520 | Su carta l'arancio pieno non passa il 3:1 |
| Salvati | punto con anello ink da 1,5 px e 11 px di diametro | |
| Tracce (solo nella vista Reel o con lo stato «tracce» attivo) | anello tratteggiato 10 px `--color-matita`, 1,25 px, tratto 2-2, sul centroide del comune; etichetta corsiva matita 13 | Mai pieno, mai su un indirizzo |
| Nomi delle regioni | maiuscolo spaziato `--type-eyebrow` con spaziatura 0.24em in `--color-muted-fg-2`, posato sulla media dei posti di quella regione e spostato per non coprire i punti | Sostituisce le «tinte regionali» senza disegnare confini; solo per le regioni con almeno 3 posti |
| Posti fuori tavola | **riquadro esterno** 72×72 r2 con cornice 1 px, un reticolo suo, il titolo «Madrid» `--type-eyebrow` e il punto, messo nell'angolo senza punti. Se non c'è spazio, un **indicatore sul bordo** alla latitudine giusta: chevron più «La Santoria, Madrid» | Come i riquadri degli atlanti; niente mappa del mondo con tre punti |
| Estensione | di default 6,5-18,5° E e 36,5-47,5° N (quella di A); i posti fuori da quest'area vanno nei riquadri | Proiezione di A invariata |

**Densità dei nomi** (etichette posizionate da un algoritmo avido: 4 posizioni candidate, destra,
sinistra, sopra, sotto; se nessuna è libera l'etichetta non si disegna):

| Punti | Etichette sempre visibili | Il resto |
| --- | --- | --- |
| fino a 12 | tutte | — |
| 13-40 | scelto, salvati, poi quelle che non si scontrano, in ordine di reel più recente | visibili al passaggio e al focus |
| oltre 40 (i 79) | scelto, salvati, nomi delle regioni | visibili al passaggio e al focus; l'elenco sotto (o in A) ha sempre tutti i nomi |

Con 79 punti la penisola si vede da sola, perché la forma la disegnano i vostri posti. È una
carta che nasce dai dati, e per questo è onesta.

**Consenso, dentro la tavola.** In basso a destra c'è il comando secondario «Mappa» (Map 16,
testo `--type-ui`, h 44), non una finestra. Al tocco sale dal fondo della tavola una striscia
`--color-atlante-carta-deep` di 132 px con il testo seo: «La mappa carica le tessere da
OpenFreeMap, che vede il tuo indirizzo IP. Attivarla vuol dire accettare i cookie di
marketing.» [VERIFY: vale finché non esiste il consenso «mappe» separato, B4]. Poi due tasti
secondari di pari peso, «Attiva la mappa» e «Resta sulla carta». Nessuna richiesta di rete prima
di «Attiva».

### 7. Tre momenti-firma

Ogni momento ha una regola che lo tiene onesto. Se la regola non si può rispettare, il momento
non si mostra: non si finge mai.

**Firma 1 · Il retro del fotogramma** (M3 + M4)
- Cosa: il bollo «Esiste davvero?» si preme e la copertina si gira. Sul retro, su carta, c'è la
  scheda d'archivio.
- Retro mobile 390×304 (su desktop 432×243, con righe da 32):
  - y+20: a sinistra l'occhiello «Il retro del fotogramma» in `--color-atlante-timbro-text`; a
    destra il **timbro datario**, 140×64, ruotato di −4°, bordo 1,5 px e testo
    `--color-atlante-timbro-text`, con «CONTROLLATO» (`--type-eyebrow`), «15 AGO 2026»
    (Fraunces 460 18/22, maiuscolo) e «granducacampigna.it» (`--type-label`);
  - y+88: 4 righe da 36 del registro: etichetta `--type-label` muted da 88 px più valore
    `--type-ui` ink. «Reel · 16 gennaio 2026», «Dove · Santa Sofia (FC)», «Prezzo · da 98 € a notte
    (indicativo)», «A che titolo · Nessuna dichiarazione» [VERIFY B5];
  - y+240: «Torna al fotogramma» (Undo2 16) a sinistra e «Guarda il reel ↗» a destra, 44 h.
- Regola: ogni riga del retro è un campo del dato, con la sua fonte. Un campo mancante si scrive
  «—» con «non ancora». **Il timbro datario compare solo se esiste `checked.at`**, con quella data
  e basta. Il retro non contiene niente che non sia anche nella pagina: è una vista, non una
  fonte, e la faccia nascosta è `inert`.
- Durata: pressione 100 + giro 400, parzialmente sovrapposti (circa 520 ms in tutto); il timbro
  atterra in 160 ms.
- Reduced motion: facce scambiate subito, timbro fermo, focus sul titolo del retro.

**Firma 2 · Dalla foto alla locandina** (M10)
- Cosa: «Guarda il reel» apre il ritaglio della copertina fino al fotogramma 9:16 intero. Compare
  il cartiglio del reel, cioè la domanda con la loro grafica, su fondo inchiostro. È l'unico
  momento scuro dell'app: il banco luminoso.
- Mobile: la barra 52 in inchiostro con X; la locandina 390×693 (y 52-745); il piede (y 745-844)
  con «Granduca di Campigna · Reel del 16 gennaio 2026» (`--type-caption` sabbia al 78%) e il
  primario **sabbia pieno con testo ink** «Guarda su Instagram ↗».
- Desktop: la locandina 452×804 (x 494-946, y 48-852); a destra (x 986-1400) il nome
  `--type-title-1` sabbia, la data, «A che titolo», il primario sabbia «Guarda su Instagram ↗» e
  il secondario «Torna alla scheda». A sinistra, solo se il posto ha più reel [VERIFY dato], il
  loro provino 9:16 da 96×171.
- Badge sulla locandina in basso a sinistra: «Reel · Instagram ↗», pill 32 h, sabbia, testo ink
  `--type-label-strong`. Nessun cerchio play al centro.
- Regola: il cartiglio si vede solo qui (e nel banco del mese), sempre con il badge. Il link
  porta al permalink del reel, mai al profilo, a meno che non sia scritto. Niente autoplay,
  niente embed, niente scorrimento al reel successivo.
- Durata: 320 ms. Reduced motion: istantaneo.

**Firma 3 · La ripassata a inchiostro** (giro successivo, serve l'indice delle tracce)
- Cosa: una traccia che da quando l'avete vista l'ultima volta è diventata un posto si presenta
  una volta sola ancora a matita, poi l'inchiostro ci passa sopra.
- Nella riga (84 px; su desktop nel riquadro):
  - 0-160 ms: il nome corsivo matita e il nome tondo ink si scambiano in dissolvenza incrociata
    (due livelli di testo sovrapposti);
  - 160-320 ms: il punto pieno sale dentro l'anello (scale .6→1 con opacità);
  - 320-480 ms: nella colonna da 48 compare la foto 5:7 48×67 con M7;
  - poi l'etichetta datata «Ora ha la scheda · ottobre 2026».
- Regola: parte solo se `promossaIl > ultimaVisita` ed è successo davvero. Una volta per elemento
  (id in `localStorage`, [VERIFY categoria di consenso]). Mai messa in scena. Nel prototipo solo
  dietro `?demo=inchiostro`, con la scritta visibile «Esempio dimostrativo».
- Reduced motion: stato finale subito, etichetta presente.

### 8. Cosa NON si tocca

- **DNA:** Fraunces (solo asse `wght`), Inter 400/500/600, sabbia `#faf8f4`, terracotta, icone
  lucide, foto vere. Nessun font, nessuna palette, nessuna libreria nuova.
- **Regola sulle immagini vere:** luoghi, persone ed esperienze sono solo fotogrammi certificati
  dei 6 posti già nel prototipo, con la provenienza scritta. Senza foto, stato tipografico. Le
  anteprime sfocate vengono dallo stesso fotogramma e ne seguono la provenienza.
- **Anti-SaaS:** niente contatori a badge, KPI, chip-filtro, card dentro card, sfocatura di
  vetro, gradienti, luccichii degli scheletri.
- **Niente feed verticale, autoplay o storie.** Nessuno scorrimento laterale tra le voci, nessun
  «reel successivo».
- **Barra a 5 voci** (Home, Esplora, Mappa, I miei posti, Noi), uguale in ogni edizione.
- **Niente pop-up:** nessuna modale di consenso, benvenuto o installazione; nessun toast che
  chiede qualcosa.
- **Un h1 per rotta**, mai nel guscio (regola di seo).
- `server.ts`, `firestore.rules`, `src/config/admin.ts`: non entrano in questo giro.

---

## What the receiver should produce

### 9. Specifica per il frontend-builder

**Dove.** Un prototipo nuovo: `SCRATCH/prototipi/A2/index.html` (HTML e CSS statici, JS senza
librerie). Gli asset si leggono da `../A/assets/`. **A non si modifica.** Le catture vanno in
`SCRATCH/prototipi/A2/shots/`, con lo stesso script di A esteso e lo stesso `report.json`. Il
codice React aspetta il via di R4 e il brief di code-architect; token e componenti hanno già i
nomi per `src/index.css` e per `src/components/shell/`.

**Dati.** Solo i 6 posti di A, nell'ordine Granduca, Tonicello, Emotional Grand Motel, The Burton
Juice, La Santoria, Chiostro Cennini (D19). Per le date del reel dei 5 posti senza dati si
leggono i `publishedAt` in `BEST/src/data/content-seed.json` [VERIFY che ci siano]; se mancano,
il campo mostra «—».

#### P0 · Senza queste non è professionale

**P0-1 · Guscio e piano unico** — tutte le schermate mobile
- Barra alta 52; piano in basso = riga d'azione 60 + barra 56, **un solo filetto** in cima al
  piano; tasti 44; 5 voci da 78×56; icone `--icon-lg`.
- Ombra `--elev-dock` su `::before`, solo in opacità, quando c'è contenuto sotto il piano
  (sentinella IntersectionObserver in fondo al contenuto).
- PW: a 390×844 su `/posto/granduca-di-campigna`, `#dock` alto 116 ±1 e `#topbar` alto 52; lo
  stile calcolato `border-top-width` della barra vale 0 quando c'è la riga d'azione; ogni `.tab`
  misura almeno 44×44.

**P0-2 · Via l'aletta**
- Nessun elemento visibile che dica «Prototipo»; la nota resta in `document.title`; con
  `?nota=1` compare in fondo al colofone.
- PW: `page.getByText(/Prototipo/)` non è visibile senza `?nota=1`.

**P0-3 · Token e scala tipografica**
- Il blocco `:root` con i §2.1-2.7; ogni `font` usa `var(--type-*)`; ogni distanza usa
  `var(--space-*)`.
- PW: raccogliere il `font-size` calcolato di tutti i nodi di testo visibili a 390, 768, 1024 e
  1440. L'insieme sta dentro {12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 30, 34, 36, 40, 44, 64}, con
  un minimo di 12. Con `grep` sul CSS: 0 esadecimali fuori da `:root`.

**P0-4 · Ruoli dei colori**
- L'arancio `#ff4d1a` mai come `color`; accento su carta = `--color-atlante-timbro-text`; il
  corsivo della Home in `--color-accent-text`.
- PW: nessun nodo di testo con `color` = rgb(255, 77, 26); axe senza violazioni di contrasto a
  390 e 1440 su tutte le catture.

**P0-5 · Formato 5:7 e regola del cartiglio**
- Card e miniature a `aspect-ratio: 5 / 7`, `object-position: 50% 100%`, con zoom per asset dalla
  tabella §2.8 (`data-cartiglio`); copertine con i valori della stessa tabella (Burton desktop
  50% 36%).
- PW: per ogni `img` dei posti si calcola `visibleTop` con la formula §2.8 da dimensioni,
  `object-position` e `transform` calcolati; deve valere almeno `data-cartiglio` + 0,01. Le card
  hanno rapporto 0,714 ±0,01.

**P0-6 · Scheda: primo schermo e ossatura**
- 390×844, in y:
  - 52-356: copertina `--cover-h-m` (304);
  - 364-382: «Fotogramma dal reel del 16 gennaio 2026» (`--type-caption`), oppure «Fotogramma
    dal reel che abbiamo girato lì» se la data manca;
  - 398-414: occhiello;
  - 418-494: h1 `--type-title-1`;
  - 502-554: domanda;
  - 570-634: **riga di prova** a 2 colonne (178 | resto), cioè «Prezzo» (`--type-numeral` o
    «—» con «non ancora») e «Controllato» («15 ago 2026 · su granducacampigna.it» oppure «—» con
    «non ancora»); se c'è una dichiarazione, sotto la riga, tra due filetti, «A che titolo ·
    ADV» (`--type-label` più `--type-label-strong`), 32 px;
  - 658-684: «Cosa sapere prima» `--type-title-3`; da 692 la prima voce.
- Il bollo compare solo se esiste la data del reel. Il `.decl-line` isolato non c'è più.
- PW: su Granduca il `boundingBox` dell'h1 è dentro 0-728 e quello della prima voce di «Cosa
  sapere prima» finisce entro 728; su Burton, Santoria e Chiostro la riga di prova ha 2 celle,
  con «—» e «non ancora» dove il dato manca; `.stamp` è assente sui posti senza data del reel.

**P0-7 · Numeri onesti**
- Il numero accanto a un elenco si calcola dai dati; nel prototipo «6 posti su 79 (nel
  prototipo)» in coda all'indice; il link della Home dice «Tutti i posti».
- PW: ogni elemento `[data-count]` contiene un numero uguale a quello delle card o delle righe
  mostrate; nessun «79» fuori da una frase che contenga «su 79».

**P0-8 · Gerarchia dei tasti**
- Un solo riempimento ink per schermata (l'azione primaria). CTA desktop «La guida in regalo»
  contornata, 40 h. Riga d'azione della Mappa: miniatura 5:7 30×42, nome `--type-name`, comune,
  tasto secondario «Apri la scheda» (84×44).
- PW: nel viewport, i `button` o `a` con fondo rgb(10, 10, 10) o rgb(255, 77, 26) sono al massimo
  1 per schermata (esclusi indicatore di voce e cella del mese).

**P0-9 · Locandina onesta**
- Via `.reel-play`; badge «Reel · Instagram ↗» in basso a sinistra; link al permalink del reel
  se il dato c'è, altrimenti la scritta «Apri il profilo Instagram».
- PW: `.reel-play` non esiste; il testo del link contiene «Instagram»; nessun elemento
  interattivo nella fascia alta del 22% della locandina.

**P0-10 · Consenso dentro la carta**
- Comando «Mappa» nella tavola, striscia di 132 px dentro la tavola, due tasti di pari
  dimensione. Nessun `role="dialog"`.
- PW: dopo il clic su «Mappa» non c'è nessun `[aria-modal="true"]`; i due tasti hanno la stessa
  larghezza ±1; `page.on('request')` non registra richieste verso host esterni prima di «Attiva
  la mappa» (in A2 «Attiva» mostra solo la nota «nel prototipo non è collegata»).

**P0-11 · Punti di rottura 768 e 1024**
- Tabella §5.2.
- PW: a 768×1024 `scrollWidth` = `clientWidth`, griglia a 3 colonne e copertina alta 400; a
  1024×768 due riquadri e niente `#dock`; a 1440×900 tre riquadri.

**P0-12 · Stati dei componenti**
- Tabella §2.9 applicata a tutti i componenti presenti in A2.
- PW: axe con 0 violazioni sulle catture; il giro di Tab sulla scheda mobile rispetta l'ordine
  salta-contenuto → barra alta → contenuto → riga d'azione → barra; ogni elemento focalizzato ha
  `outline-style` diverso da `none` e `outline-width` di 2px.

**P0-13 · Tavola d'atlante**
- Tabella §6 (cornice graduata, gradi fuori, reticolo fine, scala, nord, tondo e corsivo,
  riquadro Madrid) e collisione delle etichette.
- PW: esiste `[data-scale]` con il testo «200 km»; esiste `[data-inset="la-santoria"]`; nessuna
  coppia di etichette visibili si sovrappone (intersezione dei `boundingBox` = 0); nessun testo di
  grado dentro il rettangolo della cornice interna.

#### P1 · La rende avanzata

**P1-1 · Foto condivisa card → scheda (M1) con ritorno (M8)**
- View Transitions con `pushState`; il nome assegnato solo durante il passaggio.
- PW: si spia `document.startViewTransition`, che viene chiamato al clic su una card; con
  `reducedMotion: 'reduce'` non viene chiamato. Esplora scrollata a 600, card aperta, indietro:
  `#main.scrollTop` torna a 600 ±2 e il focus è sulla card.

**P1-2 · Il retro del fotogramma (firma 1)** — sostituisce il foglio «Esiste davvero?»
- Misure §7.
- PW: dopo il clic sul bollo, `.cover[data-face="back"]` esiste e il `boundingBox` della copertina
  resta uguale ±0; il retro ha 4 righe; il timbro datario c'è su Granduca e manca sugli altri 5;
  Esc riporta al fronte e il focus torna al bollo.

**P1-3 · Titolo nella barra alta (M6)**
- PW: sulla scheda, dopo `#main.scrollTo(0, 500)`, il titolo compatto nella barra ha opacità 1 e
  la barra resta alta 52.

**P1-4 · Banco a tre riquadri (§5.1)**
- P1-4a: layout e stati. P1-4b: separatori da tastiera (rimandabile se il tempo manca).
- PW: a 1440×900 su `/esplora` A è 600 ±4 e B 768 ±4; con un posto aperto A è 600, C 496 e B
  248 ±4. Con il separatore a fuoco, ArrowRight allarga il riquadro di sinistra di 24.

**P1-5 · Palette ⌘K (§4e)**
- PW: Meta+K apre `[role="combobox"]`; digitando «camp» compare un `<mark>` con «Camp»;
  ArrowDown cambia `aria-activedescendant`; Invio apre `/posto/granduca-di-campigna`; Esc chiude
  e riporta il focus.

**P1-6 · Anteprima vera delle immagini (M7)**
- PW: ogni riquadro immagine ha lo sfondo con il colore dominante e un livello di anteprima;
  l'immagine LCP (la copertina) ha `animation-name: none` e `opacity: 1` al primo paint; con le
  immagini ritardate via `page.route` di 800 ms l'anteprima è visibile nella cattura.

**P1-7 · Dalla foto alla locandina (firma 2, M10)**
- PW: al clic su «Guarda il reel» la locandina ha rapporto 0,5625 ±0,01; su desktop occupa
  452×804 ±4.

**P1-8 · Foglio con inerzia (M5)** sulla Mappa mobile. **P1-9 · Esplora «Reel per mese» (§4a).**
**P1-10 · I miei posti v2 (§4f).** **P1-11 · Noi con le lenti (§4g).** **P1-12 · «Qui non ci siamo
stati» (§4c).**
- Criteri: le misure delle rispettive sezioni. Dati delle tracce e dei reel senza luogo:
  **solo segnaposto espliciti** («Traccia d'esempio», «{Comune}») con la scritta «Esempio
  dimostrativo». Nessun nome del corpus.

#### P2 · Rifiniture

- P2-1 Firma 3 dietro `?demo=inchiostro`.
- P2-2 Foglio «Scegli il mese».
- P2-3 Livello articolo (§4d) con testo provvisorio in italiano dichiarato come tale; niente
  lorem.
- P2-4 Banner del consenso nel piano al primo avvio (§4h).
- P2-5 Riga senza rete simulata con `?offline=1`.
- P2-6 Scheda d'installazione con `?install=android|ios`.
- P2-7 Test di densità della tavola con i 79 posti visibili, letti in esecuzione da
  `content-seed.json` di BEST [VERIFY main thread: consentito nel prototipo in scratchpad];
  catture senza etichette.
- P2-8 Home desktop come prima pagina (§5.4).

### Ordine di costruzione consigliato

1. `:root` e reset (P0-3, P0-4).
2. Guscio e punti di rottura (P0-1, P0-2, P0-11).
3. Componenti e stati (P0-12, P0-8).
4. Scheda (P0-6, P0-5).
5. Esplora e numeri (P0-7).
6. Tavola e consenso (P0-13, P0-10).
7. Locandina (P0-9 → P1-7).
8. View Transitions e ritorno (P1-1).
9. Retro (P1-2).
10. Titolo nella barra (P1-3).
11. Banco desktop (P1-4a, poi P1-4b).
12. Palette (P1-5).
13. Anteprime (P1-6).
14. Catture e report.

**In un solo passaggio (questo giro):** tutto il P0, più P1-1, P1-2, P1-3, P1-4a, P1-5, P1-6 e
P1-7. Sono le cose che l'owner vedrà: sistema, spazio, carta, banco e due firme.

**Rimandato al giro dopo:** P1-4b (se manca il tempo), P1-8, P1-9, P1-10, P1-11, P1-12 e tutto il
P2. Hanno bisogno di dati (indice delle tracce, date dei reel), di decisioni (P0 del backend per
«Avvisami», consenso «mappe») o di uno stato dimostrativo da etichettare con cura.

**Catture richieste (A2/shots, a 390 e 1440 dove ha senso):** le 21 schermate di A con gli stessi
nomi, più: `17-posto-retro`, `18-locandina`, `19-palette` (1440), `20-banco-indice` (1440),
`21-banco-posto` (1440), `22-banco-mappa` (1440), `23-esplora-768`, `24-posto-768`,
`25-banco-1024`, `26-mappa-consenso-inline`, `27-anteprima-ritardata`. Poi il confronto A/A2
affiancato, come `confronto-mobile.png`.

## Out of scope (do NOT touch)

- Il prototipo A e i file di B; `src/`; i file ad alto rischio; commit e push (li fa il main
  thread).
- Immagini nuove, generate, stock o prese da fuori; contorni cartografici.
- Il copy definitivo: tutti i testi sono provvisori; la parola finale è di seo-strategist.
- Nomi di luoghi del corpus oltre ai 6, coordinate delle tracce, testo delle caption.
- Librerie JS, font nuovi, file `full` di Fraunces.

## Open questions / decisions for the user

1. **5:7 come formato delle miniature** (raccomandato: sì). Resta nella DNA, perché è un
   ritaglio del fotogramma vero.
2. **Chiostro Cennini in ultima posizione** finché la cover resta in attesa (raccomandato: sì).
3. **«La guida in regalo» contornata nella barra desktop** (raccomandato: sì; growth può
   chiedere un'altra collocazione in pagina, non un riempimento nella cornice).
4. **Una foto vera di Rodrigo e Betta insieme per «Noi»** (asset-curator); fino ad allora,
   testata tipografica.
5. Da seo e non da voi: «Esplora» come etichetta della voce, dato che la lista seo lo vieta come
   titolo e come CTA; «Reel per mese» o «Video» come nome della vista.

## Next hand-off

- Next agent: browser-auditor (catture A2 e `report.json`, axe, rete) → travellini-ui-designer
  (revisione A2 con questa diagnosi come griglia) → owner.
- Trigger: `A2/index.html` esiste, il P0 è completo e le catture sono in `A2/shots/`.
- In parallelo, senza bloccare: asset-curator misura il campo `cartiglio` sui 6 e controlla il
  rettangolo del Granduca (D20); seo sceglie le etichette del punto 5.

## Notes

- **Da B si riprende:** il retro del fotogramma, che diventa la firma 1 su carta e non su
  inchiostro; il banco luminoso, che diventa il livello del reel (firma 2) e il banco del mese; il
  9:16, solo dove il tocco porta al reel. **Da B non si riprende:** il fondo inchiostro nel
  guscio, le miniature 9:16 con il cartiglio nell'indice, il pannello sopra il fotogramma.
- **Miglioria operativa riusabile** (da registrare dopo R4): la formula `visibleTop` del §2.8
  può diventare un test Playwright condiviso (`e2e/visual-quality.spec.ts`) per tutte le cover.
  Chiude per sempre la classe di difetti «scritta del reel mozzata» (B16). La regola «il formato
  dice dove porta il tocco» va in DESIGN.md, sezione immagini, insieme alla regola del cartiglio.
- **Deriva dei token:** il ramo base e BEST hanno valori diversi per `--color-accent` e
  `--color-accent-text` (§2). Va riallineato prima di portare i token in `src/`.
- **Contrasti calcolati a mano** (WCAG 2.x): da confermare con axe sulle catture di A2.
- **Idee scartate in questo giro, e perché:**
  - barra che si nasconde con lo scroll: sposta il bersaglio del pollice (architettura);
  - scrubber degli anni sul bordo destro: bersagli sotto i 44 px, conflitto con i gesti;
  - heatmap dei mesi: è una metrica;
  - tinte regionali ad area: servono confini;
  - perforazioni da pellicola nel rullino: decorazione;
  - vibrazione al timbro: non ha un equivalente su iOS ed è decorativa.
