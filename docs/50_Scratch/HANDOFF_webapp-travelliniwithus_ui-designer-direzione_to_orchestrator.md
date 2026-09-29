---
title: HANDOFF_webapp-travelliniwithus_ui-designer-direzione_to_orchestrator
status: consumed
created: 2026-09-29
from: travellini-ui-designer
to: travellini-orchestrator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza) → input per la sintesi R2
responds_to: docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_ui-designer-direzione.md
---

# Handoff: direzione visiva della webapp. A «Atlante tascabile» contro B «Rullino»

## Why this work matters

L'owner ha dato un permesso condizionato a cambiare direzione. Questo documento risponde
con evidenza alle due domande del brief. La DNA regge nel guscio app; quello che si
rompe è la **grammatica di pagina**, cioè come la pagina è impaginata e in che ordine
presenta le cose, pensata per lo scroll lungo. B ha un'idea forte (il rullino), ma A può
assorbirne quasi tutto. **Raccomando A, con fiducia intorno al 75%.** Il prototipo
affiancato (spec al §6) deve confermarlo o smentirlo.

`BEST` = `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`
(PR #27, commit 4fe1794, in sola lettura; ignorata la patch locale a `src/lib/seo.ts`).
Screenshot: `.../scratchpad/shots/NN-*.png`, citati per numero e nome.

## Decisions already made (bloccate dal ui-designer: in R2 non si rinegoziano, salvo prototipo contrario)

1. **Nessun cambio di font né di palette in A.** Restano Fraunces (solo asse `wght`), Inter
   400/500/600, sabbia, inchiostro, terracotta, lucide.
2. **Il problema è la grammatica di pagina, non la DNA.** Le correzioni sono di
   composizione e di pochi token di scala e di layout (§2).
3. **Regola del cartiglio.** Quasi tutte le cover IG hanno in cima un cartiglio impresso
   che occupa circa il 22% dell'altezza del 9:16. Nei formati tagliati quella fascia non si
   mostra mai, e il nostro testo non va mai sopra il testo del fotogramma. I valori sono
   al §6.
4. **Un solo piano fisso in basso.** Barra delle voci e riga d'azione contestuale formano
   un'unica superficie. `MobileBottomBar` e `StickyMobileCTA` non convivono col guscio.
5. **Niente vetro nel guscio.** Nessun `backdrop-blur` su barre, pillole o controlli: solo
   fondi pieni.
6. **Nessun testo d'interfaccia sotto i 12 px.** Il testo corrente parte da 16 px, le
   etichette da 13 px.
7. **Le schede senza foto certificata sono tipografiche, su carta. Mai gradienti saturi.**
8. **La mappa senza consenso non è mai un muro vuoto.** Mostra i posti con dati locali e
   senza servizi esterni.
9. **Il prototipo usa Granduca di Campigna più 5 cover precise** (§6), uguali per A e B.

## Context the receiver needs

### 0. Correzioni ai fatti del brief (verificate nel codice di BEST)

- **AudienceGate non è più una modale bloccante.** È spenta dal 2026-08-17
  (`BEST/src/components/AudienceGate.tsx:24-29`, `AUDIENCE_GATE_ENABLED = false`). Alla
  prima visita compare la testata estesa con tre porte (`BEST/src/components/EditionBand.tsx:59-104`),
  ed è quella che si vede negli screenshot 01, 04, 05, 06 e 08.
- **«Il Timbro» (il verdetto) non esiste più nella scheda.** È stato tolto il 2026-08-15
  (`BEST/src/pages/Posto.tsx:234-236`, `BEST/src/components/article/Diary.tsx:83-85`).
  Oggi la scheda ha la carta girevole «Esiste davvero?» (`PostoStamp.tsx:129-141`),
  `SchedaVerifica`, «Cosa sapere prima» e il campo `checked`.
- **`corpus-places.json` non contiene coordinate.** Ho contato 0 campi lat o lng.
  "Geocodificato" qui significa città, regione, paese e il flag `amministrativo`. Per
  mettere il corpus su una carta a punti serve un passaggio di gazetteer (dal nome della
  città alle coordinate); senza, si lavora a livello di città o regione. Le coordinate
  esistono solo nelle schede (`content-seed.json`, `place.coordinates`).
- **Privacy.** `corpus-places.json` contiene una struttura sanitaria (1 reel).
  Va controllata con la deny-list della spec [VERIFY].
  [VERIFY: data-analyst / growth]
- **Screenshot degli articoli.** Solo 08, 09-guida-blocchi-intera e 10-guida-blocchi-mobile
  mostrano un articolo. 09-dormire, 10-burton-juice-desktop, 11-burton-juice-mobile,
  11-weekend-borgo e 12-weekend-borgo-mobile sono pagine 404, anche con la patch locale.
- **Il fact pack del data-analyst** (`HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`)
  non esiste ancora. Ho usato solo i fatti del brief e ciò che si legge nel codice.

---

### 1. Stress test della DNA nel formato app

**Risposta alla domanda 1.** La DNA regge: Fraunces, sabbia con inchiostro, fotogrammi
reali, lessico d'atlante. Si rompe la grammatica di pagina: testate impilate, una cover
4:5 prima dell'H1, la domanda al posto del nome, microetichette in maiuscolo spaziato,
tre pelli di edizione nel guscio, la mappa come mondo scuro a sé e due piani fissi in
basso. Nessuno di questi problemi chiede un font o una palette nuovi.

#### Dove regge (con evidenza)

- **Fraunces come voce.** A 390 px l'H1 della home, 36 px su 3 righe, è leggibile e
  riconoscibile anche senza marchio (screenshot 03). Il token `--text-h1` vale 36-64 px
  (`BEST/src/index.css:122`).
- **Il corpo di 17-18 px** (`index.css:125-129`) è già sopra la soglia dei 16 px.
- **La sabbia sotto fotogrammi saturi funziona.** Lo spa blu, il motel rosso e le sale a
  tema risaltano su `#faf8f4` (05). I nomi in bianco sopra lo scrim scuro (`.twu-card-scrim`,
  `index.css:239-246`) passano.
- **Il lessico d'atlante è già un gesto da app.** Il bollo «Esiste davvero?» gira la carta
  senza spostare il layout (`PostoStamp.tsx:30-39`, `atlante.css:291-304`). La didascalia
  di provenienza (`Posto.tsx:220-224`) è fiducia in una riga.
- **Il registro tipografico** («L'archivio, riga per riga», screenshot 02) è denso senza
  sembrare una dashboard. È il modello per mostrare centinaia di posti.

#### Dove si rompe (formato del contratto di output)

```
[blocker] /posto/:slug — mobile 390×844 (screenshot 07)
Problem: cornice e cover si mangiano lo schermo. Pillola testata 12-68 + EditionBand fino
  a ~152 (pt-[76px] pb-5, EditionBand.tsx:108) + breadcrumb 160-176 + carta 4:5 222-650
  (atlante.css:294) + didascalia + mt-10 (Posto.tsx:227): l'H1 parte a y≈724/844. Il nome
  del posto si vede solo nel breadcrumb, troncato in «GRA…». Nessuna azione sopra la piega.
Why it matters: in un'app la scheda aperta è il momento della decisione; senza nome,
  luogo e «Salva» nel primo schermo il posto sembra un post, non una guida.
Direction: barra alta di 52 px al posto di testata+band+breadcrumb; cover a filo di
  390×320; nome del posto come testo più grande; riga di prova; riga d'azione fissa (§6).
```

```
[blocker] /mappa senza consenso — Mappa.tsx:42-75 (screenshot 04)
Problem: sotto la band c'è un muro nero con metà superiore vuota (y 219-640); a 1440×900
  «Attiva la mappa» è tagliato dalla piega (y≈880-900). Fondo con colore crudo `bg-[#0a0705]`
  (Mappa.tsx:47) fuori token; occhiello a 10 px (Mappa.tsx:55).
Why it matters: in un guscio a schede «Mappa» è una voce fissa: senza consenso, che è il
  caso di default, una voce su quattro è uno schermo vuoto.
Direction: stato senza consenso = carta disegnata in locale (reticolo + punti delle
  schede, nessuna chiamata esterna) su `--color-atlante-carta`, con il comando per la
  mappa interattiva nel primo schermo (Idea 6).
```

```
[serious] cover dei reel in ogni formato tagliato — 05, 07, 10-guida-blocchi-mobile
Problem: il cartiglio impresso del reel c'è in 15 cover IG su 15 osservate (Novara,
  Volterra, Sarteano, Capo Vaticano, Jesolo, Granduca, Burton Juice, Bellano, Prato,
  Treviolo, Jazz Cafe, La Santoria, Raito, Lubiana, Magi BBQ; occupa ~20-22% in alto).
  Il ritaglio attuale lo taglia a metà («Campigna», «Somma Vesuviana (NA)» in 05 e 07).
  Nell'articolo mobile (10) il cartiglio intero «DOVE PASSARE UN WEEKEND ROMANTICO?»
  sta sopra l'H1 «I blocchi editoriali, visti in funzione»: due titoli si contendono lo
  schermo.
Why it matters: le scritte mozzate sono l'indizio più rapido di sito "montato"; la
  doppia titolazione rompe la gerarchia.
Direction: regola del cartiglio (Decisione 3; valori object-position al §6); nell'eroe
  articolo mobile, titolo sotto l'immagine e non sopra.
```

```
[serious] micro-tipografia come linguaggio di navigazione
Problem: etichette a 10-11-13 px in maiuscolo spaziato ovunque: `--text-eyebrow` 11 px
  (index.css:131), EditionBand 13 px (EditionBand.tsx:72), MobileBottomBar 10 px
  (MobileBottomBar.tsx:39,42), «Dove si trova» 10 px (Posto.tsx:306), badge della carta
  11 px (PostoStamp.tsx:117,124).
Why it matters: in un'app le etichette sono la navigazione, non la decorazione; il
  maiuscolo spaziato minuto lì diventa l'estetica "chip da dashboard".
Direction: niente sotto 12 px; etichette del guscio a 13 px in minuscolo con iniziale
  maiuscola; il maiuscolo spaziato resta solo per gli occhielli editoriali, da 12 px.
```

```
[serious] edizioni come pelle del guscio — index.css:185-235, EditionBand.tsx
Problem: cambiare edizione ridipinge il fondo (#faf8f4 / #eef6fb / #f6f4ef) e cambia i
  raggi di tutti i controlli di ±30% (index.css:203-208, 230-235). Alla prima visita il
  pannello a tre porte occupa y 80-198 su desktop in ogni rotta (01, 04, 05, 06, 08).
Why it matters: in un guscio persistente vuol dire tre app con tre forme di bottone; la
  memoria del pollice non si forma. La band pesa sopra la piega su ogni schermo.
Direction (proposta, gate owner perché modifica DESIGN.md «Temi per audience»): nel
  guscio l'edizione è una lente, non una pelle. Fondo, raggi e barre restano fissi;
  l'edizione cambia l'accento e la selezione dentro i contenuti. La scelta si fa una
  volta nella Home, non nella cornice di ogni rotta (flusso: brief architettura).
```

```
[serious] due piani fissi in basso — MobileBottomBar.tsx:36-37, StickyMobileCTA.tsx:93
Problem: l'articolo ha una pillola scura fissa (Salva/Indice/Condividi, `backdrop-blur-xl`,
  percentuale di lettura «0%»; screenshot 10-guida-blocchi-mobile). Altre 8 pagine
  montano `StickyMobileCTA` a tutta larghezza. Una barra a schede sarebbe il terzo piano.
Why it matters: due barre sovrapposte a 390 px lasciano ~550 px al contenuto; il vetro
  su fotogramma non garantisce il contrasto.
Direction: un solo piano: barra delle voci + riga d'azione contestuale (Salva / Guarda
  il reel sul posto; Indice / Salva sull'articolo; Attiva la mappa sulla mappa). Niente
  contatore percentuale.
```

```
[serious] posti senza cover certificata — PostoStamp.tsx:11-28, 70-81
Problem: il ripiego è un gradiente saturo per categoria con la domanda in bianco. Oggi
  le cover reali sono 84; la scheda è pensata per 533 posti.
Why it matters: a quella scala il ripiego diventa la maggioranza e l'app sembra un
  template di tessere colorate: è l'estetica SaaS da evitare.
Direction: scheda tipografica su `--color-atlante-carta`: nome in Fraunces, luogo, data
  del reel, filetti. Nessun gradiente, nessuna immagine sostitutiva (Idea 5).
```

```
[serious] /articolo desktop — Articolo.tsx:492-501 (screenshot 08)
Problem: «Torna alla sezione» è `absolute left-8 top-8` dentro un <article> senza
  `relative` (riga 492): si posiziona sulla pagina e finisce sopra il logo.
Why it matters: bug visibile sul primo schermo di ogni articolo desktop.
Direction: difetto indipendente dalla webapp, da correggere subito (frontend-builder):
  contesto di posizionamento sull'eroe. Nel guscio il ritorno sta nella barra alta.
```

```
[minor] deriva dei rossi — index.css:41, 43, 105-112, 682
Problem: #ff4d1a (accent), #c2410c (accent-text = atlante-timbro), #bd3f23 (--trace-red),
  #9a3412 (hover e timbro-text). Il commento di `--color-atlante-timbro` dice
  «= --color-accent», ma il valore è quello di accent-text.
Why it matters: nel guscio l'accento deve voler dire una cosa sola (azione, attivo,
  salvato). Molti fotogrammi hanno dominante rossa (Novara, La Santoria, Raito): un
  accento posato sulla foto sparisce (vedi la pillola «SU INVITO» sulla cover di Storyland, 05).
Direction: nel guscio solo due rossi: `--color-accent` per riempimenti e indicatori,
  `--color-accent-text` per il testo. Pensionare `--trace-red`. Mai testo in colore
  accento direttamente sopra una foto: le pillole su foto sono piene, sabbia o inchiostro.
```

```
[minor] home mobile — screenshot 03
Problem: «Guarda l'indice» è sotto la piega; la card ruotata «Da 39€…» tocca x=0.
  Sul bordo destro degli screenshot mobile (03, 07, 10, 12) c'è una fascia grigia.
Why it matters: nessuna azione nel primo schermo della home; possibile ombra di un
  cassetto fuori schermo.
Direction: [VERIFY: browser-auditor] overflow orizzontale e ombra del menu mobile.
```

```
[nit] didascalia di provenienza — PROVENANCE_LABEL (screenshot 06)
Problem: «Frame dal reel che abbiamo girato lì»: "frame" è un anglicismo.
Direction: proporre «Fotogramma dal reel…» a seo-strategist (lessico).
```

**Verdetto sul primo schermo "app" ricavato dal sito così com'è:** `Block — vedi 8 serious+`
(2 blocker, 6 serious). **Verdetto sulla DNA:** regge, e non va sostituita.

---

### 2. Percorso A — «Atlante tascabile» (evoluzione)

**Tesi.** Stessa carta e stesso inchiostro, impaginati come una guida tascabile: prima il
nome e la prova, poi la domanda; un solo piano di comando in basso; il fotogramma
ritagliato con una regola, mai a caso.

**Primo schermo mobile 390×844, posto aperto** (misure esatte al §6):

```
y   0 ┌──────────────────────────────────────┐
      │ ‹ Esplora                     ⌕   ⇪ │ barra alta 52, sabbia, filetto
   52 ├──────────────────────────────────────┤
      │  fotogramma reale a filo 390×320     │ cartiglio del reel fuori campo
      │                   [Esiste davvero?]  │ bollo inclinato −2°
  372 ├──────────────────────────────────────┤
      │ Fotogramma dal reel che abbiamo…     │ Fraunces corsivo 13
      │ SANTA SOFIA · EMILIA-ROMAGNA         │ occhiello 12
      │ Granduca di                          │ nome 34 (h1 nel prototipo)
      │ Campigna                             │
      │ Il posto perfetto per un weekend     │ domanda, Fraunces corsivo 19
      │ romantico?                           │
      │──────────────────┬───────────────────│
      │ da 98 € a notte  │ Verificato il     │ riga di prova
      │ Prezzo indicativo│ 15 ago 2026 su …  │
      │──────────────────┴───────────────────│
      │ Cosa sapere prima                    │ sbirciata
  704 ├──────────────────────────────────────┤
      │ [♥ Salva per il viaggio] [▷ Il reel] │ riga d'azione 68
  772 ├──────────────────────────────────────┤
      │  Home    Esplora    Mappa  I miei p. │ barra delle voci 72
  844 └──────────────────────────────────────┘
```

**Primo schermo desktop 1440×900:**

```
0   ┌──────────────────────────────────────────────────────────────────────────┐
    │ Travelliniwithus      Home  Esplora  Mappa  I miei posti    ⌕ [La guida] │ 64
64  ├───────────────────────────────────────────┬──────────────────────────────┤
    │ ESPLORA · 79 POSTI PROVATI DI PERSONA     │┌────────────────────────────┐│
    │ Posti provati di persona                  ││ fotogramma 552×310      [X]││
    │ ┌─────┐ ┌─────┐ ┌─────┐                   ││          [Esiste davvero?] ││
    │ │Gran.│ │Nova.│ │Sart.│  4:5 224×280      │└────────────────────────────┘│
    │ └─────┘ └─────┘ └─────┘  nome e luogo     │ SANTA SOFIA · EMILIA-ROMAGNA │
    │ ┌─────┐ ┌─────┐ ┌─────┐  sotto la foto    │ Granduca di Campigna      44 │
    │ │Capo │ │Burt.│ │Sant.│                   │ Il posto perfetto per un…    │
    │ └─────┘ └─────┘ └─────┘                   │ prova · azioni │ carta locale│
900 └───────────────────────────────────────────┴──────────────────────────────┘
```

Se l'architettura decide che su desktop la scheda è una pagina intera e non un pannello,
la scheda diventa una colonna centrale di 720 px e la griglia scende sotto. I valori
tipografici non cambiano.

**Guarda il reel in A.** È l'unica superficie scura. Si apre a tutto schermo, con la cover
9:16 intera (cartiglio compreso, perché lì è la locandina del reel), su
`--color-atlante-inchiostro`, e il tocco porta a Instagram. Così A si prende gran parte
dell'effetto di B senza cambiare terreno.

**Cosa guadagna:** continuità con le 79 schede, gli articoli e le URL indicizzate; zero
font, zero librerie; la prova (prezzo, verifica, cosa sapere) diventa visibile, ed è la
cosa che Instagram non ha; calma editoriale che distingue l'app da un social;
degradazione pulita per i posti senza foto.

**Cosa perde:** il 9:16 a misura nativa come terreno; un po' di effetto all'apertura; il
fotogramma è quasi sempre ritagliato.

**Token che cambierebbero (proposte, nessun font):**

| Token | Oggi | Proposta | Perché |
| --- | --- | --- | --- |
| `--text-eyebrow` | 11 px (`index.css:131`) | 12 px | nel guscio l'occhiello orienta |
| `--text-label` | non esiste | 13 px, Inter 500, minuscolo con iniziale | etichette del guscio, didascalie |
| `--text-place` | non esiste | `clamp(2.125rem, 1.6vw + 1.75rem, 2.75rem)`, 34-44 px | nome del posto nella scheda |
| `--shell-top-h` / `--shell-action-h` / `--shell-bar-h` | non esistono | 52 (64 desktop) / 68 / 72 px | budget verticale fisso e misurabile |
| `--trace-red` | #bd3f23 (`index.css:682`) | pensionato: si usa `--color-accent-text` | un solo rosso per il testo |
| edizioni nel guscio | ridefiniscono fondo e raggi | solo accento nei contenuti | lente, non pelle (gate owner) |
| mappa senza consenso | `#0a0705` crudo | `--color-atlante-carta` | coerenza di terreno tra le voci |

---

### 3. Percorso B — «Rullino» (direzione nuova)

**Idea forte.** Il telefono ha lo stesso formato del reel. In B il fotogramma 9:16 a
misura nativa **è** la superficie dell'app: la pagina sta dentro il fotogramma, non il
fotogramma dentro la pagina. Regola di voce: **la domanda la fa il reel, col suo
cartiglio; la risposta la dà l'app**, con nome, prezzo e verifica.

**Perché A non può raggiungerla.** In A il terreno è carta: il 9:16 può comparire solo
come livello aperto su richiesta, mai come fondo stabile della scheda. Se il valore sta
proprio nel fondo stabile, cioè entrare in un posto come si rientra nel video, A non ci
arriva senza smettere di essere carta. Il prototipo deve dire se questa differenza conta.

**Tesi.** Si entra in un posto come si rientra nel reel: il fotogramma intero, poi sotto
la prova.

**Primo schermo mobile 390×844:**

```
0   ┌──────────────────────────────────────┐
    │ ┌───────── cartiglio del reel ─────┐ │ resta visibile: è la locandina
    │ │ GRANDUCA WELLNESS HOTEL          │ │ nessun controllo nel 22% alto
    │ │ DOVE PASSARE UN WEEKEND ROMANT…? │ │
    │ └──────────────────────────────────┘ │
    │  fotogramma 9:16 nativo 390×693      │
520 │╭────────────────────────────────────╮│
    ││ ‹ Esplora          [Esiste davvero?]││ pannello inchiostro pieno
    ││ SANTA SOFIA · EMILIA-ROMAGNA        ││
    ││ Granduca di Campigna           32   ││
    ││ da 98 € a notte · verificato 15 ago ││
    ││ [♥ Salva per il viaggio] [▷ Reel]   ││
772 ├──────────────────────────────────────┤
    │  Home    Esplora    Mappa  I miei p. │ barra delle voci su inchiostro
844 └──────────────────────────────────────┘
```

**Primo schermo desktop 1440×900, «banco luminoso»:**

```
0   ┌──────────────────────────────────────────────────────────────────────────┐
    │ Travelliniwithus      Home  Esplora  Mappa  I miei posti    ⌕ [La guida] │ 64 inchiostro
64  ├──────────────────┬───────────────────────┬───────────────────────────────┤
    │ IL PROVINO       │                       │ SANTA SOFIA · EMILIA-ROMAGNA  │
    │ ┌──┐┌──┐┌──┐     │  fotogramma 9:16      │ Granduca di                   │
    │ │  ││  ││  │9:16 │  452×804 nativo       │ Campigna                  44  │
    │ └──┘└──┘└──┘144× │  cartiglio compreso   │ da 98 € a notte               │
    │ ┌──┐┌──┐┌──┐ 256 │                       │ [♥ Salva per il viaggio     ] │
    │ │  ││  ││  │     │                       │ [▷ Guarda il reel           ] │
    │ └──┘└──┘└──┘     │                       │ Cosa sapere prima  [carta]    │
900 └──────────────────┴───────────────────────┴───────────────────────────────┘
```

**Palette (proposta motivata, gate owner perché devia dalla DNA).** Nel guscio e nelle
schede il terreno passa da sabbia a `--color-atlante-inchiostro` #1e1c18, che è già un
token. Testo in `--color-sand`; testo secondario sabbia al 72% (≈#bcbab6, circa 8,7:1
calcolato); occhielli in `--color-accent-on-dark` #e8834e (6,3:1 calcolato su #1e1c18);
riempimento d'azione `--color-accent` #ff4d1a con testo inchiostro (circa 6:1). Gli
articoli restano su sabbia. **Font:** nessuno nuovo. Ho valutato una monospaziata per date
e codici e la scarto: aggiunge peso senza risolvere un problema reale.

**Cosa guadagna:** formato nativo sul telefono; i fotogrammi imperfetti (poca luce,
dominanti rosse, cartigli) sembrano voluti sull'inchiostro; la sensazione "app" più forte;
continuità con Instagram, da cui arriva il pubblico; mappa scura coerente con il resto.

**Cosa perde:** la sabbia come firma, e con lei la differenza dall'ecosistema social;
articoli e guscio diventano due mondi (sbalzo di fondo a ogni passaggio); le edizioni
azzurro e avorio non hanno senso sul nero; ogni componente va riverificato in a11y su
scuro; più rischio LCP (immagine grande per prima); senza foto un posto diventa uno
schermo nero con testo, e oggi le cover sono 84 contro un obiettivo di 533. Soprattutto:
**la navigazione naturale di un'interfaccia a fotogrammi è il feed verticale o le storie,
cioè proprio i pattern vietati dal brief.** Per evitarli B deve aggiungere una griglia
("provino"), e quella griglia è la griglia di A su fondo scuro.

---

### 4. Precedenti del design-lab: cosa si riprende in un'app a schermo unico

| Precedente | Si riprende | Non si riprende | Perché |
| --- | --- | --- | --- |
| **A «Rivista Viva»** | il numero datato come contenitore della Home (Idea 10); filetti sottili come separatori nelle liste dense; il sottotitolo in serif corsivo (la domanda sotto il nome); la didascalia `.trace-frame figcaption` | sezioni a `100svh`, rivelazione riga per riga con SplitText, sfoglio pagina sticky, base scura `#d1c6b7`, nota a mano (font manoscritto), testata grande | in app non c'è una lettura lineare da cadenzare: ogni animazione legata allo scroll diventa attesa, e la testata costa spazio verticale |
| **B «Atlante di Coppia»** | il registro (liste tipografiche, già in home 02); il bollo «Esiste davvero?»; numeri solo come frasi con dati veri; carta e inchiostro; icone a linea lucide | la rotta disegnata dallo scroll, i codici d'archivio «IT-07 · 2026» (a 533 posti diventano codici prodotto e non dicono niente), i numeri grandi da contatore, `rough-notation`, «Tappa N di 29» | la rotta presuppone un viaggio lineare; l'archivio è una collezione |
| **C «Album Cinematico»** | il pannello pieno sopra il fotogramma (è la base di B); «la scena che si posa» come unica transizione d'apertura (translateY 24→0 + opacità, 320 ms); la prima immagine con `priority` | scene a `100svh`, `lenis`, didascalie con numeri romani, il logo-timbro sopra la foto, l'«arco» di coppia con fotogrammi Family nel guscio | in app la scena è una e si apre a richiesta; privacy e confine Family |

**Gate owner rimasti aperti (la mia raccomandazione, la decisione resta all'owner):**
base `#d1c6b7` no; `--trace-red` da riallineare a `#c2410c`; font manoscritto no;
`rough-notation` no; estrazione dei fotogrammi sì, ma per coprire i posti senza foto
(serve ad A e a B), non per un album.

---

### 5. Criteri di confronto A/B (bozza corretta, da bloccare in R2)

Si giudicano **i prototipi affiancati, alle due misure, con lo stesso contenuto**, mai le
descrizioni. Ogni criterio è passa/non passa, con la misura scritta accanto.

1. **Leggibilità a 390×844, posto aperto, senza scroll.** Devono essere visibili: (a) un
   fotogramma reale alto almeno 280 px; (b) il nome del posto come testo più grande dello
   schermo; (c) comune e regione; (d) l'azione primaria; (e) la barra delle voci. Testo
   corrente ≥ 16 px, etichette ≥ 13 px, nulla sotto 12 px; il maiuscolo spaziato solo da
   12 px in su e mai oltre 4 parole. Contrasto AA misurato con axe, anche sul testo sopra
   un fotogramma. Bersagli di tocco ≥ 44 px.
2. **Densità senza dashboard.** Primo schermo desktop: almeno 6 posti reali, ciascuno
   riconoscibile dal nome senza hover. Zero contatori a badge, zero chip-filtro, nessuna
   card dentro una card, al massimo 3 livelli tipografici per card. Test dello sguardo
   sfocato: con lo screenshot sfocato di 8 px si deve leggere una pagina (blocchi di
   immagine e testo), non una griglia di controlli.
3. **Riconoscibilità senza logo.** Marchio coperto; affiancato a due app di viaggio note
   [VERIFY: quali, con l'owner]. L'owner indica la propria in 5 secondi e nomina almeno 3
   elementi suoi che non siano il colore dei bottoni.
4. **Tenuta con fotogrammi imperfetti.** Con La Santoria (poca luce, dominante rossa) e
   The Burton Juice (cartiglio lungo, testa alta nel quadro): nessuna scritta del
   fotogramma mozzata sul bordo, nessuna collisione tra il nostro testo e quello del
   fotogramma, nessun testo in colore accento sopra una foto.
5. **Tenuta senza foto** (criterio nuovo). Un posto senza cover certificata nello stesso
   schermo non sembra rotto né una "tessera colorata".
6. **Costo tecnico.** Font nuovi (numero e KB), librerie nuove (obiettivo 0), token nuovi
   o cambiati (numero), componenti toccati fuori dal guscio (numero), delta netto di
   `initial-js` ≤ 0 (il guscio sostituisce Navbar e Footer, budget 776/780 KB), CLS (solo
   layout a dimensioni fisse).
7. **Coerenza tra guscio e livelli.** Stessa barra alta, stesso piano in basso e stessa
   scala tipografica su `/posto` e `/articolo`. Colori di fondo tra le 4 voci e i 2 livelli
   ≤ 2. Mai due piani fissi in basso.
8. **Mappa senza consenso.** Lo stato senza consenso mostra dei posti (non un muro); il
   comando per attivare la mappa interattiva è nel primo schermo a entrambe le misure;
   nessuna richiesta a servizi esterni prima del consenso.
9. **Motion e reduced motion.** Un solo gesto per transizione (apertura della scheda,
   cambio di voce), ≤ 320 ms (`--duration-slow`), solo transform e opacity. Con
   `prefers-reduced-motion`: nessuna animazione e nessuna informazione persa. Nessun
   effetto legato allo scroll nel guscio.
10. **Tenuta delle edizioni** (criterio nuovo). Passando da Viaggiatori a Family a
    Collaborazioni il guscio non cambia forma (raggi, fondo, barre); cambia solo l'accento
    nei contenuti. Se l'owner non approva la "lente", si misura quanto cambia.

---

### 6. Spec del prototipo (uno schermo, due direzioni, due misure)

Lo scopo è che travellini-frontend-builder possa costruirlo senza prendere decisioni di
design.

**File.** Due HTML statici autonomi, per esempio `design-lab/webapp-a-atlante-tascabile.html`
e `design-lab/webapp-b-rullino.html` (percorso e ramo li decide l'orchestratore, BEST è in
sola lettura). Nessun framework, nessuna libreria JS.

**Catture (browser-auditor).** Per ogni direzione:
1. 390×844, primo schermo;
2. 1440×900, primo schermo;
3. ausiliaria: 390×844 dopo uno scroll che porta la griglia «Altri posti» in cima, per
   il criterio 4.

**Stato.** Edizione Viaggiatori; nessun consenso marketing (banner cookie **non** mostrato
nella cattura); nulla salvato; posto aperto Granduca di Campigna. Niente EditionBand,
footer, modale di ricerca o chat.

**Font.** Solo file locali, gli stessi della produzione (`index.css:7-11`). Niente Google
Fonts: il design-lab caricava l'asse `opsz` (`design-lab/index.html:10`), che rende
diversamente dalla produzione.
- `BEST/node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2`
  e `...-wght-italic.woff2` (`font-weight: 100 900`)
- `BEST/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2`, `-500-`, `-600-`

**Icone.** SVG lucide inline: ChevronLeft, Search, Share2, Heart, Play, Stamp, House,
Compass, Map, Navigation, X.

**Token da copiare** (valori di `BEST/src/index.css`): `--color-sand #faf8f4`,
`--color-surface #ffffff`, `--color-border #e7e5e4`, `--color-ink #0a0a0a`,
`--color-ink-2 #44403c`, `--color-muted-fg-2 #57534e`, `--color-accent #ff4d1a`,
`--color-accent-text #c2410c`, `--color-accent-on-dark #e8834e`,
`--color-atlante-carta #f2ecdf`, `--color-atlante-inchiostro #1e1c18`,
`--color-atlante-linea rgb(30 28 24 / 24%)`, `--radius-lg 14px`, `--radius-xl 20px`,
`--shadow-md`, `--ease-out cubic-bezier(0.16, 1, 0.3, 1)`, `--duration-slow 320ms`.
Solo nel prototipo, come proposte: `--text-eyebrow 12px`, `--text-label 13px`,
`--text-place clamp(2.125rem, 1.6vw + 1.75rem, 2.75rem)`.

**Immagini** (tutte da `BEST/public`, provenienza `real-frame` per
`asset-provenance.json:7-10`; nessun'altra immagine ammessa, nessuna generazione):

| # | Posto | File | Alt (da `content-seed.json`) | Dichiarazione | Ruolo |
| --- | --- | --- | --- | --- | --- |
| 1 | Granduca di Campigna, Santa Sofia (Emilia-Romagna) | `/images/reels/emilia-granduca-di-campigna-cover-768.webp` | «Piscina interna illuminata di blu nella spa ricavata in una grotta di pietra del Granduca wellness hotel a Campigna.» | nessuna (organic) | **posto aperto** |
| 2 | Emotional Grand Motel, Fontaneto d'Agogna (Piemonte) | `/images/reels/novara-emotional-grand-motel-cover-768.webp` [VERIFY: esiste la -768, altrimenti -480] | «Camera a tema con letto rotondo dentro una gabbia dorata e pareti rosse dell'Emotional Grand Motel.» | «In collaborazione» | dominante rossa |
| 3 | Chiostro Cennini, Sarteano (Toscana) | `/images/reels/sarteano-chiostro-cennini-cover-768.webp` | «Tavoli apparecchiati nel chiostro quattrocentesco del ristorante Chiostro Cennini a Sarteano.» [VERIFY alt: nel quadro c'è anche una persona sull'altalena] | «Su invito» | luce calda |
| 4 | Tonicello Resort & Spa, Capo Vaticano (Calabria) | `/images/reels/capovaticano-tonicello-resort-cover-768.webp` | «Vista sul mare cristallino della Costa degli Dei dal Tonicello Resort a Capo Vaticano.» | «Su invito» | esterno, giorno |
| 5 | The Burton Juice, Somma Vesuviana (Campania) | `/images/reels/campania-burton-juice-cover-768.webp` | «Poltrona bianca fra scacchi giganti e specchi fioriti nella sala a tema Alice del The Burton Juice a Somma Vesuviana.» | «ADV» | **imperfetta: cartiglio lungo, testa al 26-31% dell'altezza** |
| 6 | La Santoria, Madrid (Spagna) | `/images/reels/madrid-la-santoria-cover-768.webp` | «Interni a tema santería del cocktail bar La Santoria a Madrid.» | nessuna (organic) | **imperfetta: poca luce, rosso monocromo** |

**Regola di ritaglio in A** (cartiglio nel 0-22% del 9:16):
- scheda mobile 390×320: `object-position: 50% 72%`;
- scheda desktop 552×310: `50% 64%` (è `coverFocusY`);
- card 4:5: `50% 85%`, tranne Burton Juice `50% 80%`.

In B tutte le immagini stanno in riquadri 9:16 nativi, senza ritaglio.

**Dati del posto aperto** (verificati in `content-seed.json:3-53`): prezzo «da 98€/notte»,
fascia «Medio»; `checked`: granducacampigna.it, 2026-08-15; reel pubblicato il
2026-01-16; da sapere: «Animali ammessi.» e «La grotta e la spa si usano a turni privati,
non in comune.»; come arrivare: «65 km da Firenze, Forlì e Cesena. Senza auto: treno fino
a Forlì, poi la linea 132 di Start Romagna verso Santa Sofia.»; coordinate 43,872585 /
11,746244. Nei dati la regione è scritta «Emilia Romagna»: nel prototipo va
«Emilia-Romagna» (segnalare a seo o data).

**Testi provvisori in italiano** (il lessico definitivo è di seo-strategist; le voci della
barra sono del brief architettura):
- barra alta: «Esplora» (ritorno); voci: «Home», «Esplora», «Mappa», «I miei posti»;
  in alto a destra, desktop: «La guida in regalo»;
- didascalia: «Fotogramma dal reel che abbiamo girato lì»;
- occhiello: «Santa Sofia · Emilia-Romagna»;
- nome: «Granduca di Campigna»;
- domanda (solo A): «Il posto perfetto per un weekend romantico?»;
- prova: «da 98 € a notte» / «Prezzo indicativo» / «Verificato il 15 agosto 2026» /
  «su granducacampigna.it» / «Reel del 16 gennaio 2026»;
- azioni: «Salva per il viaggio», «Guarda il reel», «Indicazioni» (desktop); bollo:
  «Esiste davvero?»;
- «Cosa sapere prima» con le due voci sopra;
- carta: «Dove si trova» / «Santa Sofia (FC) · 43,87° N · 11,75° E» / «Apri la mappa
  interattiva» / «Usa le tessere di OpenFreeMap: parte solo con il consenso ai cookie di
  marketing.»;
- griglia: occhiello «Esplora · 79 posti provati di persona» (claim già pubblico, home
  01), titolo «Posti provati di persona»; in B occhiello «Il provino · 79 posti provati
  di persona»;
- sezione ausiliaria mobile: «Altri posti provati».

**Stato della mappa (A e B): "carta locale", senza consenso.** Nessuna tessera esterna.
Riquadro di 120×148 px: proiezione equirettangolare con x = (lng − 6,5) × 9,956 e
y = (47,5 − lat) × 13,4 (13,4 px per grado, scala delle longitudini ridotta a cos 42° =
0,743). Reticolo a filo sottile ogni 2° (lat 38/40/42/44/46, lng 8/10/12/14/16/18).
Punti:
- Granduca (52,2; 48,6), 9 px, `--color-accent-text` con anello di 2 px del colore del fondo;
- Sarteano (53,4; 60,4), Burton Juice (79,0; 88,8), Capo Vaticano (92,9; 119,0) e
  Fontaneto d'Agogna (19,8; 24,6), 5 px;
- Madrid è fuori carta e non si disegna.

Nessun contorno di paese nel prototipo. I contorni, se serviranno, verranno da una fonte
di pubblico dominio [VERIFY: Natural Earth], mai disegnati o generati. In A: fondo
`--color-atlante-carta`, linee `--color-atlante-linea`, punti inchiostro. In B: fondo
#1e1c18, linee sabbia al 16%, punti sabbia, punto aperto #ff4d1a.

**A · 390×844** (y in px dal bordo alto; fondo sabbia; nessuno scroll orizzontale):
- 0-52: barra alta sabbia con filetto inferiore `--color-border`. A sinistra ChevronLeft
  22 inchiostro + «Esplora», Inter 500 15 px `--color-ink-2`, area di tocco alta 44. A
  destra Search e Share2 da 20 px in aree da 44×44, a x 290 e x 338.
- 52-372: cover a filo 390×320, raggio 0, `object-fit: cover`, `object-position: 50% 72%`.
  Bollo «Esiste davvero?» a 16 px da destra e dal basso: alto 40, padding orizzontale 14,
  fondo sabbia, bordo 1,5 px `--color-accent-text`, testo `--color-accent-text` Inter 600
  13 px maiuscolo spaziatura 0,12 em, icona Stamp 14, `rotate(-2deg)`, raggio pieno.
  Nient'altro sopra la foto.
- 380-398: didascalia Fraunces corsivo 400, 13/18, `--color-muted-fg-2`, x 20.
- 414-430: occhiello Inter 600 12/16, maiuscolo, spaziatura 0,14 em, `--color-accent-text`.
- 436-510: nome `<h1>` Fraunces `wght` 460, 34/37, spaziatura −0,01 em, inchiostro,
  larghezza massima 350.
- 518-568: domanda Fraunces corsivo 400, 19/25, `--color-ink-2`.
- 584-648: riga di prova tra due filetti `--color-border`, divisa in due colonne da un
  filetto verticale a x 198. Colonna 20-190: «da 98 € a notte» Fraunces 460 20/24
  inchiostro + «Prezzo indicativo» Inter 400 13/18 `--color-muted-fg-2`. Colonna 206-370:
  «Verificato il 15 ago 2026» Inter 600 13/18 `--color-ink-2` + «su granducacampigna.it»
  Inter 400 13/18 `--color-muted-fg-2`.
- 664-690: «Cosa sapere prima» Fraunces 460 17 inchiostro; la prima voce parte a 696 e
  resta tagliata dalla riga d'azione (sbirciata voluta).
- 704-772, fissa: riga d'azione su sabbia con filetto superiore, padding 10 × 16.
  Primario x 16-232, alto 48, fondo inchiostro, testo sabbia Inter 600 15, Heart 18,
  «Salva per il viaggio». Secondario x 244-374, alto 48, bordo 1 px inchiostro, testo
  inchiostro, Play 16, «Guarda il reel». Raggio pieno.
- 772-844, fissa: barra delle voci su sabbia con filetto superiore; 4 voci da 97,5 px;
  icona 22 (House, Compass, Map, Heart) a y 782-804; etichetta Inter 500 12/16 a y
  808-824. Inattive `--color-muted-fg-2`; attiva «Esplora» in inchiostro con indicatore
  24×2 `--color-accent` sul bordo alto. Nessun contatore.
- Sotto la piega, in quest'ordine: «Cosa sapere prima» (2 righe Inter 16/26
  `--color-ink-2`, separate da filetti); «Come arrivare»; «Dove si trova» (carta locale,
  etichetta, collegamento al consenso); «Altri posti provati», griglia a 2 colonne di card
  169×211 (4:5) con nome Fraunces 16/20, luogo Inter 13 `--color-muted-fg-2` e
  dichiarazione Inter 600 12 `--color-ink-2` (per esempio «In collaborazione»).

**A · 1440×900:**
- 0-64: barra alta sabbia con filetto. Marchio a x 40 come in produzione («Travellini»
  inchiostro, «with» `--color-accent-text`, Fraunces 22). Voci centrate da x 560, Inter
  500 15, spazio 36: inattive `--color-muted-fg-2`, attiva «Esplora» in inchiostro con
  sottolineatura 2 px `--color-accent` distanziata 8. Search 44×44 a x 1186; CTA «La guida
  in regalo» x 1238-1400, alto 40, fondo `--color-accent`, testo inchiostro Inter 600 14,
  raggio pieno.
- Pannello sinistro x 40-760. Occhiello a y 96; titolo Fraunces 32/38 a y 116-154.
  Griglia 3×2 da y 180, colonne da 224 px con spazio 24 (x 40, 288, 536). Card: foto 4:5
  224×280 raggio 14, poi il nome Fraunces 460 18/22 dopo 10 px, poi luogo e dichiarazione
  Inter 13/18. Riga 1: Granduca, Emotional Grand Motel, Chiostro Cennini (y 180-516).
  Riga 2: Tonicello, The Burton Juice, La Santoria (y 540-876). La card aperta (Granduca)
  sta su un pannello `--color-atlante-carta` con 8 px di margine e raggio 14, più
  `aria-current`. Nessun'altra indicazione.
- Scheda x 784-1400, y 80-884: fondo `--color-surface`, bordo 1 px `--color-border`, raggio
  20, `--shadow-md`, padding 32 (contenuto x 816-1368).
  - Cover 552×310 a y 112-422, raggio 14, `object-position: 50% 64%`. Chiusura X: cerchio
    sabbia pieno da 40 in alto a destra della cover. Bollo in basso a destra come su mobile.
  - Didascalia a y 432; occhiello a y 470; nome Fraunces 460 44/46 a y 494-540; domanda
    Fraunces corsivo 20/28 a y 548-576.
  - Da y 596 due sotto-colonne.
    - Sinistra x 816-1196: «da 98 € a notte» Fraunces 20 + «Prezzo indicativo» (596-640);
      filetto a 648; «Verificato il 15 agosto 2026 su granducacampigna.it» Inter 13
      (656-674); «Reel del 16 gennaio 2026» Inter 13 (678-696); azioni a y 712-760
      («Salva per il viaggio» primario largo 220, «Guarda il reel» secondario largo 160,
      «Indicazioni» collegamento Inter 600 15 con icona Navigation); «Cosa sapere prima»
      a y 780; due voci Inter 16/24 a y 808-856.
    - Destra x 1220-1368: «Dove si trova» Inter 600 12 maiuscolo a y 596; carta 120×148 a
      y 620-768 (x 1234); etichetta Inter 12/16 `--color-muted-fg-2` a y 776-808;
      «Apri la mappa interattiva» Inter 600 13 `--color-accent-text` sottolineato a y 816;
      nota Inter 12 a y 838-866.

**B · 390×844** (fondo #1e1c18 ovunque):
- 0-693: fotogramma 9:16 nativo 390×693, raggio 0. **Nessun elemento nella fascia 0-152**
  (il cartiglio resta leggibile).
- 520-772: pannello pieno #1e1c18 con raggio 20 in alto, padding 16 × 20.
  - 528-572: a sinistra «‹ Esplora» Inter 500 15 sabbia al 72%; a destra il bollo
    «Esiste davvero?», alto 36, bordo 1,5 px #e8834e, testo #e8834e Inter 600 13
    maiuscolo, `rotate(-2deg)`.
  - 584-600: occhiello #e8834e.
  - 606-644: nome `<h1>` Fraunces 460 32/36 sabbia.
  - 652-672: «da 98 € a notte · verificato il 15 ago 2026», Inter 500 15/20, sabbia al 78%.
  - 692-740: primario x 20-236, fondo #ff4d1a, testo #0a0a0a Inter 600 15, Heart;
    secondario x 248-370, bordo 1 px sabbia al 40%, testo sabbia, Play.
  - **Niente domanda**: per regola la fa il cartiglio.
- 772-844: barra delle voci su #1e1c18 con filetto superiore sabbia al 12%; inattive
  sabbia al 72%, attiva sabbia piena con indicatore 24×2 #ff4d1a.
- Sotto la piega: «Il provino», griglia di miniature 9:16 110×196 su 3 colonne con spazio
  10; nome Fraunces 15 sabbia, luogo e dichiarazione Inter 12 sabbia al 72%. Poi «Cosa
  sapere prima» e la carta locale su inchiostro.

**B · 1440×900:**
- 0-64: barra alta su #1e1c18 con filetto sabbia al 12%. Marchio sabbia con «with» in
  #e8834e. Voci sabbia al 72%, attiva sabbia con sottolineatura #ff4d1a. CTA «La guida in
  regalo» con fondo #ff4d1a e testo inchiostro.
- Sinistra x 40-520: occhiello a y 96. Griglia 3×2 di miniature 9:16 144×256 con spazio
  24 (x 40, 208, 376), righe a y 124-380 e 452-708, con nome Fraunces 15/18 sabbia e luogo
  Inter 12/16 sabbia al 72% sotto ciascuna. Stesso ordine di A. Posto aperto: contorno 2
  px #ff4d1a staccato di 3.
- Centro: fotogramma 452×804 a x 560-1012, y 80-884, raggio 14.
- Destra x 1052-1400:
  - occhiello a y 96; nome Fraunces 460 44/48 su 2 righe a y 116-212;
  - «da 98 € a notte» Fraunces 22 a y 232;
  - verifica Inter 14/20 sabbia al 72% a y 268-308; «Reel del 16 gennaio 2026» a y 312;
  - bollo a y 352;
  - primario a tutta larghezza 348×48 a y 412; secondario 348×48 a y 472;
  - «Cosa sapere prima» a y 552, voci Inter 16/24 sabbia all'85% a y 582-650;
  - «Dove si trova» a y 680; carta 120×148 a y 700-848 (x 1052); etichetta, collegamento
    e nota a destra della carta (x 1188-1400, y 700-800).

**Motion (entrambe).** Un solo gesto: al caricamento la scheda (in B il pannello) entra
con translateY(24px)→0 e opacità 0→1 in 320 ms `--ease-out`. Con
`prefers-reduced-motion: reduce` nessuna animazione. Le catture si fanno a animazione
finita.

**Vietato nel prototipo:** gradienti, `backdrop-blur`, contatori, emoji, numeri non
elencati qui, immagini fuori tabella, testo nella fascia 0-22% dei fotogrammi (in A
perché ritagliata, in B perché riservata al cartiglio), barra con più di 4 voci. Nel
prototipo l'`<h1>` è il nome del posto; la decisione sull'H1 in produzione resta a
seo-strategist.

---

### 7. Raccomandazione

**A «Atlante tascabile». Fiducia: circa 75%.**

Motivi:
1. Il valore che Instagram non offre (prezzo, verifica, cosa sapere prima, come arrivare)
   è testo, e A lo mette nel primo schermo; B lo mette sotto il fotogramma, cioè sotto
   la cosa che Instagram offre già.
2. A resta un solo mondo tra guscio, schede e articoli; B ne crea due.
3. A degrada bene senza foto: 84 cover oggi, 533 posti come obiettivo. B no.
4. La navigazione naturale di B porta a feed o storie, che sono vietati.
5. A non costa font, librerie o palette; B chiede un gate owner sulla DNA e una verifica
   a11y di tutto su fondo scuro.

**Cosa mi farebbe cambiare idea:**
- Nei prototipi affiancati a 390 px, owner e Betta scelgono B come «app nostra», e B
  passa i criteri 1, 4 e 8 senza cadere in feed o storie.
- Il data-analyst mostra che le sessioni da mobile arrivano quasi tutte dal link in bio
  o dai reel e si fermano alla prima scheda [VERIFY: dati di sessione]. In quel caso
  conta rivedere più che leggere.
- La pipeline degli asset garantisce un fotogramma certificato per almeno il 90% dei
  posti, cioè la precondizione di B.
- Il prototipo di A, a 390 px, sembra un sito ristretto e non un'app, nonostante le
  misure.

---

### 8. Kill list (tutto ciò che porta verso il SaaS o il cliché da app di viaggio)

**Dal riferimento dell'owner:** colonna di filtri a sinistra con contatori; contatori
accanto ai filtri; barra in basso a 6 voci; immagini generate di posti o persone.

**Dal sito e dai precedenti:**
- strisce di numeri grandi come «79 / 67 / 0» (home, 02) e «33 collaborazioni
  dichiarate» (01) usate come cornice dell'app: nel guscio i numeri veri stanno solo in
  una frase;
- percentuale di lettura «0%» (`MobileBottomBar.tsx:42-43`);
- pillole di vetro (`MobileBottomBar.tsx:37`, `Articolo.tsx:497`, `PostoStamp.tsx:94,117,124`);
- gradienti di categoria come ripiego (`PostoStamp.tsx:11-28`);
- SplitText, sfoglio pagina, `lenis`, rotta legata allo scroll;
- codici d'archivio senza significato; numeri romani decorativi;
- base `#d1c6b7`; font manoscritto;
- più di un elemento inclinato per schermo (resta solo il bollo);
- l'edizione che ridipinge la cornice;
- la band a tre porte su ogni rotta;
- il muro scuro della mappa.

**Cliché da app di viaggio:** rotte d'aereo tratteggiate; collezioni di timbri da
passaporto o «paesi visitati»; meteo, conti alla rovescia, stelle, badge «Di tendenza»;
spilli con avatar sulla mappa; satellite scuro di default; polaroid col nastro; bandiere
emoji; «esplora il mondo», «scopri», «unico»; barre di avanzamento delle storie sopra i
fotogrammi; feed verticale in autoplay; esplosione di cuori al salvataggio;
trascina-per-aggiornare.

---

### 9. Schede idea

### Idea 1 — Il nome prima della domanda
- In una frase: nella scheda il nome del posto diventa il testo più forte e la domanda del reel scende a sottotitolo, così a 390 px nome, luogo e azione stanno nel primo schermo.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): «Granduca di Campigna» a metà schermo, con sotto «da 98 € a notte · verificato il 15 agosto»: sembra una guida vera, non un post.
- Dato reale su cui poggia: `Posto.tsx:229-232` (h1 = hook); screenshot 07 (h1 a y≈724 su 844; il nome si vede solo nel breadcrumb «GRA…»).
- Cosa richiede: codice (Posto.tsx; il rapporto 4:5 della carta su mobile); decisione seo-strategist sull'H1; 0 ore owner.
- Rischio principale: si cambia l'H1 di 79 URL; si perde l'apertura "a domanda" della voce.
- Regole toccate: SEO-URL (solo H1, non l'URL) | brand-DNA
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 4 / Costo 5 / Carico owner 5

### Idea 2 — La riga di prova
- In una frase: una riga subito sotto il nome con prezzo, «verificato il … su …» e data del reel, così «Esiste davvero» si vede senza girare la carta.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): la prova è la seconda cosa che si legge, e Instagram non la può dare.
- Dato reale su cui poggia: `practical.checked {source, at}` e `value.price` in `content-seed.json` (Granduca: granducacampigna.it, 2026-08-15, «da 98€/notte»); `publishedAt`.
- Cosa richiede: codice (riuso di `SchedaVerifica`); dati [VERIFY: quante delle 79 schede hanno `checked` e `price`].
- Rischio principale: le schede senza prezzo o verifica sembrano "meno vere". Serve uno stato vuoto onesto, scritto da seo-strategist.
- Regole toccate: nessuna
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 5 / Carico owner 4

### Idea 3 — Un solo piano in basso
- In una frase: barra delle voci e riga d'azione contestuale sono una sola superficie, e dentro il guscio spariscono `MobileBottomBar` e `StickyMobileCTA`.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): in ogni livello il pollice trova l'azione giusta sempre nello stesso punto (Salva, Indice, Attiva la mappa).
- Dato reale su cui poggia: `MobileBottomBar.tsx:36-37`; `StickyMobileCTA` montato in 8 pagine; screenshot 10-guida-blocchi-mobile.
- Cosa richiede: codice (il guscio sostituisce Navbar e Footer nel bundle iniziale).
- Rischio principale: il guscio deve pesare meno di ciò che sostituisce (776/780 KB) [VERIFY: peso di Navbar e Footer, perf-engineer].
- Regole toccate: bundle | anti-SaaS
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 4 / Business 4 / Costo 3 / Carico owner 5

### Idea 4 — Ritaglio sotto la locandina
- In una frase: una regola fissa di ritaglio che non mostra mai la fascia del cartiglio nei formati tagliati e non sovrappone mai il nostro testo al testo del fotogramma.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): niente più mezze scritte tagliate; le copertine sembrano scelte una per una senza esserlo.
- Dato reale su cui poggia: cartiglio in 15 cover IG su 15 osservate; screenshot 05, 07, 10; oggi le ricadrature si fanno a mano (`asset-provenance.json:72-74`).
- Cosa richiede: codice (object-position per formato, §6); un controllo di asset-curator sulle eccezioni.
- Rischio principale: quando il soggetto è in alto il ritaglio taglia la testa (Burton Juice), e servono eccezioni a mano.
- Regole toccate: imagery-truth (solo ritaglio, nessuna generazione)
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 3 / Costo 5 / Carico owner 5

### Idea 5 — Scheda senza foto
- In una frase: i posti senza cover certificata diventano schede tipografiche su carta (nome in Fraunces, luogo, data del reel, filetti) al posto dei gradienti di categoria.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): con 533 posti l'atlante resta un atlante: pagine scritte, non tessere colorate.
- Dato reale su cui poggia: 84 cover reali contro una scheda pensata per 533; ripiego a gradienti in `PostoStamp.tsx:11-28`.
- Cosa richiede: codice (ripiego di PostoStamp, card di esplora); 0 asset.
- Rischio principale: se sono troppe l'app sembra "senza foto". Serve una regola di cura su quante schede senza foto possono stare in una griglia [da decidere con growth].
- Regole toccate: imagery-truth | anti-SaaS
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 3 / Costo 4 / Carico owner 5

### Idea 6 — Carta senza consenso
- In una frase: senza consenso, al posto del muro scuro c'è una carta disegnata in locale (reticolo e punti dalle coordinate delle schede) che non chiama servizi esterni; la mappa a tessere resta un'opzione.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): si apre «Mappa» senza cookie e i posti ci sono lo stesso.
- Dato reale su cui poggia: coordinate in `content-seed.json` (per esempio Granduca 43,8726 / 11,7462); screenshot 04; `Mappa.tsx:42-75`. `corpus-places.json` non ha coordinate: le tracce si fermano alla città o alla regione.
- Cosa richiede: codice (SVG in un chunk lazy, nessuna libreria); eventuali contorni da fonte di pubblico dominio [VERIFY: Natural Earth e licenza], mai generati.
- Rischio principale: senza contorni 79 punti non disegnano un paese riconoscibile; le tracce vicino a casa vanno mostrate al livello di città.
- Regole toccate: privacy | bundle | imagery-truth
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 3 / Costo 3 / Carico owner 5

### Idea 7 — Indice dei luoghi
- In una frase: l'ampiezza del corpus come indice tipografico d'atlante per regione, con gli zeri dichiarati («Sardegna: non ancora»), senza grafici.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): è onesto: un creator che mostra anche dove non è stato.
- Dato reale su cui poggia: squilibrio dalla spec del corpus (Lombardia 147, Veneto 62, Emilia-Romagna 48, Puglia 1, Sicilia 2; Sardegna, Marche, Friuli Venezia Giulia, Molise e Basilicata a zero) [VERIFY: l'unità di misura, luoghi o reel].
- Cosa richiede: dati (conteggi calcolati prima, non i 108 KB nel client); codice (lista tipografica); il consenso dell'owner a mostrare i vuoti.
- Rischio principale: impaginato a barre diventa una metrica; i numeri vanno ricalcolati a ogni import.
- Regole toccate: metriche-pubbliche | privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 3 / Costo 4 / Carico owner 3

### Idea 8 — Tracce a matita
- In una frase: i reel geolocalizzati senza scheda compaiono come tracce (nome in corsivo grigio matita, niente foto, niente URL), ben distinte dai posti, che hanno inchiostro, foto e URL.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): dietro i 79 posti si vede il migliaio di reel, senza fingere schede che non esistono.
- Dato reale su cui poggia: 1.017 reel citano un luogo; 624 luoghi, di cui 120 solo città o regione; 79 schede visibili.
- Cosa richiede: import del corpus e deny-list per la privacy; codice; l'approvazione dell'owner sulla deny-list.
- Rischio principale: privacy (una struttura sanitaria è nel corpus [VERIFY]); se il contrasto visivo è debole, posti e tracce si confondono.
- Regole toccate: privacy | SEO-URL | imagery-truth
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 3 / Costo 3 / Carico owner 3

### Idea 9 — Il rullino
- In una frase: il fotogramma 9:16 a misura nativa è la superficie dell'app su fondo inchiostro: la domanda la fa il reel, la risposta la dà l'app.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): si apre il posto e sembra di rientrare nel video, con sotto il prezzo e la verifica.
- Dato reale su cui poggia: 1.192 reel su 1.283 post; 84 cover reali; cartiglio in 15 cover su 15 osservate.
- Cosa richiede: un fotogramma certificato per ogni posto (oggi 84); riverifica a11y di ogni componente su scuro; gate owner sulla palette.
- Rischio principale: scivola verso feed e storie; gli articoli restano chiari (due mondi); senza foto il posto è uno schermo vuoto.
- Regole toccate: brand-DNA | anti-SaaS | imagery-truth | bundle
- Variante: audace
- Autovalutazione 1-5: Stupore 4 / Verità 4 / Business 2 / Costo 2 / Carico owner 2

### Idea 10 — Il numero del mese
- In una frase: la Home dell'app è un numero datato di 6 posti scelti da Rodrigo e Betta, con folio e data, e il prossimo numero arriva per email.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): tornare e iscriversi hanno la stessa ragione, cioè il numero nuovo.
- Dato reale su cui poggia: metrica primaria = iscrizioni email nate nell'app (ipotesi dell'orchestratore); `publishedAt` di ogni posto; cadenza reale di pubblicazione [VERIFY: data-analyst].
- Cosa richiede: ore owner (scelta mensile e una nota); codice della Home; flusso email (growth). Il flusso lo decidono architettura e growth, qui c'è solo il linguaggio visivo.
- Rischio principale: carico ricorrente per l'owner; se un mese salta, il numero invecchia in bella vista.
- Regole toccate: nessuna (vietato qualunque contatore di iscritti)
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 4 / Carico owner 2

## What the receiver should produce

- **Orchestratore (R2):** bloccare i criteri del §5 così come sono o con correzioni
  scritte; confermare la spec del §6 come unica base dei due prototipi; incrociare le voci
  della barra con il brief architettura; raccogliere le domande owner qui sotto per R4.
- **R3:** travellini-frontend-builder costruisce i due HTML del §6 senza decisioni di
  design; browser-auditor fa le 3 catture per direzione e le mette affiancate.
- **Separato e subito:** frontend-builder corregge «Torna alla sezione» sopra il logo
  (`Articolo.tsx:492-501`); è indipendente dalla webapp.

## Out of scope (do NOT touch)

- Codice e `src/`; BEST in sola lettura; file ad alto rischio (`server.ts` per le rotte
  nuove).
- Architettura dell'informazione (voci, primo minuto, ritorno, ingressi): brief parallelo.
- Copy definitivo: tutti i testi del §6 sono provvisori.
- Generazione di immagini, anche per i mockup; contorni cartografici generati.

## Open questions / decisions for the user (per il gate R4, non ora)

1. Edizioni nel guscio come "lente, non pelle" (modifica DESIGN.md «Temi per audience»).
2. H1 della scheda: nome del posto o domanda (insieme a seo-strategist).
3. Mostrare gli zeri regionali (Idea 7).
4. Solo se vince B: terreno inchiostro al posto della sabbia, cioè una deviazione della DNA.
5. Gate storici del design-lab: la mia raccomandazione è al §4.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2), poi travellini-frontend-builder (R3,
  prototipi dal §6), poi browser-auditor (catture affiancate). Facoltativo: asset-curator
  sulle eccezioni di ritaglio (Burton Juice) e sugli alt da rivedere (Chiostro Cennini).
- Trigger: questo file esiste con i punti 1-9.

## Notes

- **Miglioria operativa da registrare** (l'orchestratore scelga la nota giusta):
  (1) la regola del cartiglio (Decisione 3 e §6) merita di diventare una regola scritta
  in DESIGN.md o in ASSET_STRATEGY, perché oggi ogni componente ritaglia a modo suo;
  (2) 6 catture su 18 di questo round erano pagine 404 o dimostrazioni di 404: lo script
  di cattura dovrebbe fallire quando l'H1 è «Pagina non trovata».
- **Deriva documentale:** `BEST/DESIGN.md:186` descrive un `pt-28` e riserve da 101/97 px
  che `PageLayout.tsx:10-14` non applica più (la riserva ora sta in `EditionBand`).
- Nello screenshot 02 le card di «Sei posti, presi uno per uno» sono segnaposto grigi
  sfocati: quasi certamente immagini lazy non caricate nella cattura a pagina intera
  [VERIFY: browser-auditor].
- Contrasti per B calcolati a mano con la formula WCAG (#e8834e su #1e1c18 = 6,3:1;
  #0a0a0a su #ff4d1a ≈ 6:1): da riconfermare con axe sul prototipo.
