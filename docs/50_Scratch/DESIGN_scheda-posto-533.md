---
type: design-reference
area: delivery
status: active
created: 2026-08-15
from: travellini-ui-designer
slug: scheda-posto-533
related:
  - '[[50_Scratch/HANDOFF_scheda-posto-533_orchestrator_to_ui-designer]]'
  - '[[50_Scratch/HANDOFF_place-tools_ui_to_frontend]]'
  - '[[superpowers/specs/2026-08-14-corpus-e-modello-media-design]]'
tags:
  - design
  - posto
  - template
---

# `/posto/:slug` a 533 schede — direzione di design

Non è un redesign. Fraunces, sabbia `#faf8f4`, terracotta `#c2410c`, foto reali,
icone lucide: il DNA resta. Questo documento cambia **ordine, densità e stati
vuoti** di un template che oggi funziona su 79 schede curate a mano e che sta per
essere stampato 533 volte su materiale più povero.

## Come sono state prodotte le misure

- `[MISURATO: <file:riga>]` — letto nel codice o contato nel dato di questo branch
  (HEAD `edda387`, working tree con soli artefatti di build).
- `[MISURATO: browser-auditor]` — numeri consegnati dal browser-auditor nel brief
  di incarico, non rimisurati da me: in questa sessione non ho accesso a un
  browser né a una shell.
- `[DEDOTTO]` — calcolato da CSS e dato, con la condizione che lo smentisce.

---

## 0. Il dato che riscrive il brief

Il modello (`src/types/content.ts:66-72`) motiva la regola «ogni campo è
opzionale, vuoto è uno stato legittimo» con questa frase: `place.hours`,
`place.phone` e `place.bookingUrl` sono «compilati su 0 schede su 79».

**Nel seed di oggi quella frase non è più vera.**

| campo                       | schede che lo hanno | su   |
| --------------------------- | ------------------- | ---- |
| `place.phone`               | 59                  | 110  |
| `place.hours`               | 28                  | 110  |
| `value.budget`              | 51                  | 110  |
| `value.price`               | 30                  | 110  |
| `practical`                 | 79                  | 110  |
| `practical.toKnow`          | **49**              | 110  |
| `practical.gettingThere`    | 43                  | 110  |
| `practical.checked/visitedAt` | 78                | 110  |
| `practical.when`            | 4                   | 110  |
| `practical.duration`        | **1**               | 110  |
| `deal`                      | **0**               | 110  |

`[MISURATO: src/data/content-seed.json — 110 oggetti di primo livello, 31 con
isPlaceholder: true → 79 schede reali]`

Tre conseguenze di progetto, tutte e tre non opinabili:

1. **La regola resta giusta, la sua prova va aggiornata.** Il caso povero resta
   il caso normale a 533 — le bozze si derivano dalle caption (spec §4), e una
   caption non contiene orari di apertura. Ma il commento nel modello va corretto,
   perché oggi descrive un file che non esiste più. Lo segnalo come finding, non
   lo tocco.
2. **`duration` (1/110) e `when` (4/110) sono campi morti.** Due delle tre righe
   di `PrimaDiAndare` non si accendono quasi mai. Progettare quel blocco come una
   `dl` a tre voci significa progettare per uno stato che si verifica sull'1% delle
   schede.
3. **`toKnow` è il campo più compilato del blocco pratico (49/110, 44,5%)** ed è
   più popolato di prezzo, orari e durata messi insieme. È l'unico contenuto
   soggettivo-ma-fattuale che l'owner scrive davvero. Questo è il pilastro della
   variante C in D1.

---

## 1. Anatomia della scheda a 533

### Ordine, e cosa cambio rispetto alla legge del 2026-07-16

`HANDOFF_place-tools_ui_to_frontend.md` (consumed) fissa due regole che **non
rilitigo e confermo**:

- **un solo primario in pagina = Indicazioni**;
- la card «Info pratiche» sta **prima** della descrizione, perché la domanda
  dominante è «dove si trova».

Cambio una cosa sola, e la dichiaro: **la riga Salva / Condividi scende sotto il
blocco reel.** Oggi sta fra la riga-luogo e la card, e a 375px spinge in basso
«Indicazioni» di ~120px `[DEDOTTO: p su 2 righe ≈40px + gap 12 + riga bottoni 44px
+ mt-6 24px — Posto.tsx:205-241; si smentisce se la riga di contesto sta su una
riga sola, allora sono ~100px]`. Salvare è un'azione **dopo** aver letto, non
prima. Lo spostamento serve la metrica `place_directions_click ≥ 15%` invece di
metterla a rischio: è l'unico motivo per cui lo propongo.

Ordine risultante (colonna unica < 768px, due colonne ≥ 768px solo se c'è
prezzo o deal):

```
 1  Breadcrumb
 2  PostoStamp (4/5 mobile, 16/9 desktop)          — invariato
 3  riga provenienza immagine (solo se certificata) — invariato
 4  h1 = hook
 5  luogo → link destinazione
 6  card «Info pratiche»  (Dove [+ Contatti solo se esistono])
 7  descrizione (2 righe, il caso normale)
 8  «Prima di andare» — solo se ha ≥2 blocchi di contenuto (vedi §2)
 9  «Il reel girato qui»
10  riga Salva / Condividi                          — SPOSTATA QUI
11  «Nei dintorni»
12  PostNavigation
13  Newsletter
```

### La gerarchia tipografica oggi è piatta, e a 533 si vede

Tre sezioni di pari rango semantico (`h2`) hanno tre pesi visivi incompatibili:

- `PrimaDiAndare` → `text-[10px] uppercase tracking-[0.22em]`
  `[MISURATO: src/components/posto/PrimaDiAndare.tsx:37-42]`
- `ReelDelPosto` → `text-xs uppercase tracking-[0.2em]`
  `[MISURATO: src/components/posto/ReelDelPosto.tsx:65-70]`
- `PostiVicini` → `font-serif text-2xl md:text-3xl`
  `[MISURATO: src/components/posto/PostiVicini.tsx:26-31]`

Due titoli su tre leggono come etichette. Il risultato è una pagina lunga 5.688px
senza spina dorsale visibile, e l'unico titolo che si vede è quello della sezione
di **navigazione**, non del contenuto.

**Legge tipografica, una sola regola:**

- **Titolo di sezione** (`h2`, figlio diretto della colonna di lettura) →
  `font-serif text-xl md:text-2xl font-normal text-[var(--color-ink)]`.
- **Eyebrow** (`text-[10px] font-bold uppercase tracking-[0.22em]
  text-[var(--color-accent-text)]`) → **solo per etichette dentro una card**:
  «Dove si trova», «Orari e contatti», «Prezzo indicativo».

`Nei dintorni` scende da `text-2xl/3xl` a `text-xl/2xl` come le altre: è
navigazione, non deve essere il titolo più grande della pagina dopo l'`h1`.

---

## 2. Il caso povero e il caso ricco

**Il caso normale è quello povero.** Lo dichiaro qui e tutto il resto del
documento discende da questa riga.

### Caso povero — cosa arriva davvero dall'import

Hook, titolo, descrizione di due righe, città + coordinate, cover 9:16, permalink
reel. Niente prezzo, niente orari, niente telefono, niente deal, spesso niente
`gettingThere`.

```
375px — CASO POVERO (com'è oggi)                    375px — CASO POVERO (direzione)

┌───────────────────────────┐                       ┌───────────────────────────┐
│  cover 4/5 · 409px        │                       │  cover 4/5 · 409px        │
│  [Esiste davvero?]        │                       │  [Esiste davvero?]        │
└───────────────────────────┘                       └───────────────────────────┘
  frame reale del reel                                frame reale del reel

Un aperitivo in vigna?      ← h1                    Un aperitivo in vigna?
📍 LAVAGNO, VENETO                                  📍 LAVAGNO, VENETO

Salvalo, o mandalo a chi                            ┌───────────────────────────┐
ci deve venire.                                     │ DOVE SI TROVA             │
[ ♡ Salva ] [ ⇪ Condividi ]                         │ 📍 Nome — Città, Regione  │
                                                    │ ┌───────────────────────┐ │
┌───────────────────────────┐                       │ │  ➤ INDICAZIONI        │ │
│ DOVE SI TROVA │ 🕐 ORARI E │                      │ └───────────────────────┘ │
│ 📍 Nome —     │  CONTATTI  │                      │ 📍 Vedi sulla mappa       │
│    Città      │            │                      │ ↗ Orari su Google         │
│ ┌───────────┐ │ ┌────────┐ │                      └───────────────────────────┘
│ │➤ INDICAZ.││ │ │➤ INDIC.│ │  ← DUE primari
│ └───────────┘ │ │  MAPS  │ │                      Aperitivo tra i filari a
│ 📍 Vedi sulla │ └────────┘ │                      Lavagno: vino della cantina,
│    mappa      │ ┌────────┐ │                      musica e tramonto.
│               │ │↗ SCHEDA│ │
│               │ │ GOOGLE │ │                      Il reel girato qui
│               │ └────────┘ │                      ┌─────────┐
│               │ ┌────────┐ │                      │ 9:16    │  Lavagno, giugno
│               │ │⇪ CONDIV││ │  ← doppione        │ 200px   │  2026. Il video è
│               │ └────────┘ │                      │ ×355px  │  quello pubblicato
│               │ ➤ Calcola  │                      │  ▶      │  su Instagram.
│               │   distanza │                      └─────────┘
│               │ Orari e    │                      [ ↗ Guardalo su Instagram ]
│               │ telefono   │
│               │ da Google  │  ← promette dati    Salvalo, o mandalo a chi
└───────────────┴────────────┘     che non ci sono   ci deve venire.
                                                    [ ♡ Salva ] [ ⇪ Condividi ]
Aperitivo tra i filari…
                                                    Nei dintorni  →
[ ▶ APRI SU INSTAGRAM ]  ← 3° primario              ┌───────────────────────────┐
                                                    │ card 3/2 · 218px          │
Il posto in movimento                               └───────────────────────────┘
┌─────────┐                                         ┌───────────────────────────┐
│ 9:16    │                                         │ card 3/2 · 218px          │
│ 240px   │                                         └───────────────────────────┘
│ ×427px  │
│  ▶      │
└─────────┘
```

Tre difetti strutturali del caso povero, tutti moltiplicati per 533:

1. **«Orari e contatti» si intitola su dati che non ha.** Il blocco renderizza
   l'eyebrow, il fascio di bottoni Google, «Calcola quanto dista da me» e il
   micro-disclaimer *anche quando `hours`, `phone` e `bookingUrl` sono tutti
   assenti* `[MISURATO: src/pages/Posto.tsx:286-329 — l'unico gate è
   (item.place.hours || item.place.phone) alla riga 292, e copre solo le due
   righe di testo, non la colonna]`. Su una scheda importata il lettore vede una
   sezione intitolata «Orari e contatti» che non contiene né orari né contatti.
   È esattamente il fallimento descritto nel modello: la scheda sembra
   **incompleta** invece che **essenziale**.
2. **Tre primari, non uno.** `Indicazioni` (Posto.tsx:266-274), `Indicazioni Maps`
   (PlaceBusinessActions.tsx:179-187) e `Apri su Instagram` (Posto.tsx:356-364)
   sono tre pill piene `bg-[var(--color-ink)] text-white` nella stessa colonna di
   lettura. `Condividi` è renderizzato due volte (Posto.tsx:224-236 e
   PlaceBusinessActions.tsx:220-228). `[MISURATO]` La legge del 2026-07-16 dice
   «un solo primario in pagina = Indicazioni»: oggi è violata su **tutte** le
   schede, non solo sulle povere.
3. **Il blocco reel pesa 531px per non dare niente in cambio.** Vedi §4.

### Caso ricco — cosa lo distingue

Prezzo (30/110), budget (51/110), orari (28/110), telefono (59/110), `toKnow`
compilato, `checked` con fonte e data. La colonna destra compare, la principale
si stringe a 504px e la sidebar prende 256px `[MISURATO: browser-auditor]`.

**Quella degradazione è corretta per costruzione e non va toccata.** Il gate
`(item.value?.price || item.deal)` a `Posto.tsx:374` fa sparire l'intera colonna
senza lasciare vuoto: è il pezzo di questo template che già oggi è progettato per
il caso povero. È il modello da estendere agli altri blocchi, non da rivedere.

Il caso ricco non ha bisogno di niente in più. Ha bisogno che il caso povero
smetta di sembrare la sua versione rotta.

---

## 3. Stati vuoti — la regola generale

**Un blocco senza payload non si intitola. Un blocco con un solo dato non si
incornicia.**

| blocco                | 0 dati            | 1 dato                                                  | ≥2 dati              |
| --------------------- | ----------------- | ------------------------------------------------------- | -------------------- |
| Info pratiche · Dove  | mai (c'è sempre)  | card a colonna singola, nessun divisorio                 | card a due colonne   |
| Info pratiche · Orari | **niente**: nessun eyebrow, nessun disclaimer, nessun fascio bottoni. Resta **una** riga quieta sotto «Vedi sulla mappa»: `↗ Orari e contatti su Google` | riga di testo + link Google | eyebrow + righe + link |
| Prima di andare       | assente (già ok)  | **riga in chiaro sotto la descrizione**, senza card né h2 | card con h2 serif    |
| Il reel girato qui    | assente (già ok)  | —                                                        | —                    |
| Nei dintorni          | assente (già ok)  | 1 card                                                   | max 2 mobile / 3 desktop |
| Colonna prezzo/deal   | assente (già ok)  | solo il riquadro che ha dato                             | prezzo + deal        |

Il micro-disclaimer «Orari, telefono e prenotazione sono aggiornati direttamente
da Google» (Posto.tsx:326-328) **è vero solo se qualcosa è mostrato**. Su una
scheda senza dati è una frase che spiega l'assenza di un servizio che non stiamo
offrendo: va emessa solo insieme ad almeno un dato o al link Google.

---

## 4. Il blocco reel — correzione di due assunzioni del brief

**Non esiste nessun `<video>` in pagina, su nessuna scheda.** `videoInPagina: true`
è presente su **0 entry** del manifest `[MISURATO: src/config/reels.ts]`, e il ramo
di rendering è `apreIlVideo = reel.videoInPagina === true || !reel.instagramUrl`
`[MISURATO: src/components/posto/ReelDelPosto.tsx:43]`: con `instagramUrl`
compilato e nessuna spunta, si renderizza sempre l'`<a>` verso Instagram. La
misura del browser-auditor («nessun nodo `video` nell'albero di accessibilità») è
confermata dal codice. Autoplay, audio e controlli di riproduzione **non sono un
tema di questo template**.

Quindi la domanda vera è quella posta nel brief: **531px per un fermo immagine che
porta fuori dal sito.** A 533 schede è il secondo blocco più pesante della pagina
e la sua unica azione è l'uscita.

Non lo elimino: la copertina è un fotogramma reale del reel, è il singolo asset più
convincente del progetto e rispetta la regola imagery-truth. Lo ridimensiono e
smetto di promettere movimento.

**Direzione:**

- **Titolo: «Il reel girato qui»** invece di «Il posto in movimento». Il secondo
  promette un video e consegna una foto, 533 volte. Il primo è vero in entrambi
  gli stati della spec §2.
- **Larghezza media a 375px: `max-w-[12.5rem]` (200px → 355px di altezza)**,
  contro gli attuali `max-w-[15rem]` (240px → 427px)
  `[MISURATO: ReelDelPosto.tsx:75]`. Su ≥768px resta 240px. Risparmio 72px.
  `[DEDOTTO: 200 × 16/9 = 355,5; si smentisce se il contenitore ha un min-width
  che non ho letto]`
- **La CTA finale «Apri su Instagram» (Posto.tsx:355-365) si elimina.** La
  copertina del reel è già un link a Instagram con badge play: la pill sotto è la
  stessa azione ripetuta, in peso primario, dopo che l'utente l'ha già vista.
  L'etichetta dell'affordance passa sotto la copertina come link quieto:
  `↗ Guardalo su Instagram`. Risparmio ~76px e un primario in meno.
  **Eccezione da conservare**: sui permalink ridotti al solo profilo la label
  resta `Segui su Instagram` — quella distinzione (Posto.tsx:363) è giusta e va
  portata nel link quieto.
- **Stato «nessun reel»: il blocco non esiste.** `if (!reel) return null` è già
  corretto `[MISURATO: ReelDelPosto.tsx:40]` e va difeso. Per i 31 luoghi
  solo-post niente galleria, niente «presto disponibile», niente placeholder:
  spec §2 lo esclude esplicitamente.
- **Stato «con spunta» (video in pagina)**: la geometria non cambia — stessa
  scatola 9:16, stessa larghezza. Cambia solo il ramo di rendering e compare il
  link `Aprilo su Instagram ↗` sotto, già implementato
  `[MISURATO: ReelDelPosto.tsx:118-130]`. **Zero lavoro di design aggiuntivo:
  l'unico requisito è che il montaggio del `<video>` non alteri l'altezza della
  scatola**, altrimenti il gate CLS ≤ 0,1 salta su 52 schede.

---

## 5. `PostiVicini` — densità alta e densità zero

### Cosa succede oggi

Raggio fisso 100 km, i 3 più vicini in linea d'aria, sezione assente se zero
`[MISURATO: src/lib/postiVicini.ts:23,37,44-52]`. Il raggio è stato scelto su 29
schede sparse: «a 30 km solo 15 su 29 avrebbero un vicino, a 100 km sono 24».

### Perché a 533 quella regola si rovescia

Con 147 posti in Lombardia, entro 100 km da Milano ci sono **decine** di
candidati. «I tre più vicini» diventano tre indirizzi a due chilometri l'uno
dall'altro, spesso della stessa categoria — il corpus è pieno di ristoranti
milanesi. Due effetti, entrambi peggiorativi:

- **Ripetizione invece di scoperta**: una scheda di sushi che ne propone altri tre.
- **Effetto hub**: le stesse tre schede centrali compaiono su decine di pagine,
  rendendo 533 pagine visivamente intercambiabili.

`[DEDOTTO dalla distribuzione geografica della spec §1 + dall'ordinamento per sola
distanza. Si smentisce se: applicando il raggio a 25 km su una scheda di Milano il
risultato coincide con quello a 100 km — in quel caso i posti non sono clusterati
e la regola attuale basta.]`

### Regola di selezione che fisso

1. **Raggio adattivo, non fisso.** Se esistono ≥3 candidati entro **25 km**, il
   raggio è 25 km. Altrimenti si allarga a 100 km. La costante
   `RAGGIO_DINTORNI_KM = 100` resta come limite esterno, non come default.
   Una scheda in Basilicata continua a comportarsi esattamente come oggi.
2. **Diversità di tipo**: al massimo **1 slot** può condividere il
   `types[0]` della scheda corrente. Gli altri due vengono dal candidato più
   vicino di tipo diverso. Se non esistono tipi diversi nel raggio, si mostra un
   solo vicino invece di tre uguali.
3. **Tetto**: 3 su desktop, **2 su mobile**. Il terzo è raggiungibile da «Tutti
   sulla mappa», che è già in testa alla sezione.
4. **Zero vicini: la sezione non esiste.** Regola già in vigore, la confermo.
   Niente riempitivi, niente «esplora altre zone».
5. **La distanza resta sull'immagine.** È il motivo per cui quella card è lì
   (commento a `PostiVicini.tsx:61-62`, corretto). Non si sposta.

### Geometria

A 375px la card è `aspect-[4/3]` su 327px di larghezza = **245px** ciascuna
`[DEDOTTO: 375 − 48 di px-6; si smentisce se il padding effettivo differisce]`.
Tre card impilate + gap 20 + intestazione ≈ 809px. Direzione: **`aspect-[3/2]`
sotto 640px (218px) e massimo 2 card** → 530px, −280px nel caso denso.
Su ≥640px resta `aspect-[4/3]` a 2 colonne, ≥1024px 3 colonne: invariato.

---

## 6. Budget di altezza a 375px

Baseline misurata: **5.688px** su `/posto/campania-burton-juice`
`[MISURATO: browser-auditor]` — circa **7 schermate** su un viewport 375×812.

**Tetto che mi do: 4.400px per il caso normale (povero), 5.200px per il caso
ricco.** Il numero non è arbitrario: è quello che si ottiene togliendo solo
duplicazioni e chrome, **senza cancellare una sola informazione.**

| voce                                                  | risparmio | fonte                                                  |
| ----------------------------------------------------- | --------- | ------------------------------------------------------ |
| `PlaceBusinessActions` variant `full` rimosso dalla card | ~170px  | 3 pill impilate 44px + 2 gap 12 + `mt-4` `[DEDOTTO]`   |
| CTA «Apri su Instagram» rimossa                       | ~76px     | pill 44 + `mt-8` 32 `[MISURATO: Posto.tsx:355]`        |
| Reel media 240 → 200px di larghezza                   | 72px      | 9:16 `[DEDOTTO]`                                       |
| `Nei dintorni`: 3 card 4/3 → 2 card 3/2               | ~280px    | solo nel caso denso `[DEDOTTO]`                        |
| Spaziatore nudo `<div className="mt-24" />`           | 96px      | `[MISURATO: Posto.tsx:412]`, sopra un `pb-32` già di 128px |
| Blocco «Orari e contatti» assente nel caso povero      | ~200px    | eyebrow + bottoni + disclaimer `[DEDOTTO]`             |

Il perché del tetto, in una riga: **una pagina lunga non è una scelta di design,
è una scelta ripetuta 533 volte.** Ogni 100px di chrome inutile sono 53.300px di
scroll distribuiti sul sito. Nessuno di questi tagli tocca il contenuto scritto
da Rodrigo e Betta — tolgono solo bottoni ripetuti e aria in fondo alla pagina.

`[VERIFY: l'altezza finale va rimisurata dopo l'implementazione con probe JS su
tutte e tre le schede campione. I risparmi in tabella sono calcolati, non
osservati.]`

---

## 7. D1 — il confronto reso. **Non scelgo io.**

Stessa scheda, tre varianti: **`/posto/verona-vigna-benini`**. La scelgo perché è
`partnership: invited` `[MISURATO: content-seed.json:686-688]` — cioè il caso in
cui un limite scritto è l'unica cosa che rende credibile il resto — e perché ha
già `toKnow`, prezzo e `checked` compilati.

Il testo reale della scheda oggi:

- **descrizione**: «Aperitivo tra i filari a Lavagno, vicino Verona: vino
  prodotto dalla cantina, musica e tramonto. Con una bottiglia è incluso un
  tagliere di salumi, formaggi e taralli, a 28€.»
- **`toKnow[0]`**: «Si entra solo su prenotazione: non è una cantina con visita
  libera.»

### A — la scheda non giudica (com'è oggi)

```
Un aperitivo in vigna?
📍 LAVAGNO, VENETO

[card Info pratiche]

Aperitivo tra i filari a Lavagno, vicino Verona: vino
prodotto dalla cantina, musica e tramonto. Con una
bottiglia è incluso un tagliere di salumi, formaggi e
taralli, a 28€.

Prima di andare                          ← h2 serif
  ℹ Da sapere
    Si entra solo su prenotazione: non è una cantina
    con visita libera.
  Dati cercati su beninialessandro.it · agosto 2026
```

Il limite c'è già ed è scritto — ma è **sepolto**: sta in una lista senza
puntatore dentro un blocco che si intitola «Prima di andare», dopo la descrizione
e dopo la card. Chi scorre veloce non lo vede.

- **Costo di scrittura ricorrente: 0 righe.** Nessun campo nuovo.
- **Cosa obbliga a cambiare altrove**: `src/config/site.ts:66` promette ancora
  «quali sono i limiti». Con A quella promessa non ha un campo che la mantenga in
  modo visibile → la stringa va riscritta. `docs/50_Scratch/VERDETTI_DA_COMPILARE.md`
  va chiuso (`status: archived`), altrimenti resta uno strumento di raccolta vivo
  per un layer che non esiste.
- **Cosa il sito perde**: il differenziale «raccomandarne meno» resta solo nella
  selezione, invisibile a chi arriva da Google su una scheda singola.

### B — il giudizio torna come campo opzionale

```
Un aperitivo in vigna?
📍 LAVAGNO, VENETO

  «Ci si va per il tramonto sui filari,             ← serif 20px, corsivo,
   non per una degustazione tecnica.»                 filetto terracotta a sx
                                                      SOLO se compilato

[card Info pratiche]

Aperitivo tra i filari a Lavagno, vicino Verona: …

┌──────────────────────────────────────────────┐
│ NON FA PER TE SE                             │  ← eyebrow accent-text
│ Cerchi una visita guidata in cantina: qui si │     card surface, radius-lg
│ sta seduti fra i filari e si beve.           │     MAI ristampa description
└──────────────────────────────────────────────┘

Prima di andare
  ℹ Da sapere · Si entra solo su prenotazione…
```

Il bug del 2026-08-15 (`Posto.tsx:369-373`: sotto «Vale la pena?» veniva
ristampata `item.description`) non torna: sono due campi distinti, e il blocco
non renderizza se il campo è vuoto.

- **Costo di scrittura ricorrente: 2 righe di testo libero + 1 scelta multipla
  per scheda.**
- **Arretrato oggi: 78 schede su 79.** `docs/50_Scratch/VERDETTI_DA_COMPILARE.md`
  è `status: active`, 79 predisposte, **1 compilata** (#78 The Burton Juice) —
  e quella non è nemmeno approvata: il documento stesso dice «non è un verdetto
  approvato e non so chi l'abbia scritto» `[MISURATO: VERDETTI_DA_COMPILARE.md:40-42]`.
- **A regime: 1.066 righe di testo libero su 533 schede**, più 2 righe per ogni
  import futuro. `[VERIFY: quanto tempo costa una riga a Rodrigo e Betta. Non lo
  so e non lo stimo.]`
- **Cosa obbliga a cambiare altrove**: `site.ts:66` resta valida così com'è.
  `homeComposition.ts:142-148` è già stato cambiato in direzione opposta («Se vale
  il viaggio, lo decidi tu») e andrebbe rimesso indietro.
- **Il rischio vero non è il design, è il riempimento parziale.** Con un campo
  compilato su un terzo delle schede, il sito comunica un giudizio dove c'è e
  silenzio dove non c'è — e il silenzio, su un posto `invited`, si legge come
  reticenza. **B è coerente solo se compilato quasi ovunque.**

### C — il limite, non il verdetto

Nessun campo nuovo. `practical.toKnow` — **già compilato su 49 schede su 110** —
esce da «Prima di andare» e diventa un blocco proprio, subito dopo la descrizione.

```
Un aperitivo in vigna?
📍 LAVAGNO, VENETO

[card Info pratiche]

Aperitivo tra i filari a Lavagno, vicino Verona: …

┌──────────────────────────────────────────────┐
│ COSA SAPERE PRIMA                            │  ← eyebrow accent-text
│ Si entra solo su prenotazione: non è una     │     stessa card family
│ cantina con visita libera.                   │     0 → blocco assente
└──────────────────────────────────────────────┘

Prima di andare                            ← resta, senza «Da sapere»
  🚗 Come ci arrivi · …
  Dati cercati su beninialessandro.it · agosto 2026
```

- **Costo di scrittura ricorrente: 1 riga, e solo dove esiste un vincolo vero.**
- **Arretrato: zero, per costruzione.** Un campo che si compila solo quando c'è
  qualcosa da dire non accumula arretrato. Oggi è già al **44,5%**.
- **Cosa obbliga a cambiare altrove**: `site.ts:66` («quali sono i limiti») resta
  **vera** — è letteralmente questo campo. `homeComposition.ts:142-148` resta
  com'è. `VERDETTI_DA_COMPILARE.md` va chiuso.
- **Cosa C non fa, e va detto**: C dà **limiti**, non **verdetti**. Non mantiene
  la promessa «ti diciamo se vale il viaggio» — mantiene «ti diciamo cosa sapere
  prima». Se per l'owner il differenziale del brand è il giudizio, C non lo
  sostituisce.
- **Sotto-variante C-bis** (quella proposta nel brief: la scelta multipla
  coppia / famiglia / gruppo / da soli + fascia di prezzo): costa secondi per
  scheda e alimenta i filtri, ma **è un giudizio di adeguatezza travestito da
  dato**. È esattamente ciò che la decisione del 2026-07-26 chiamava «il sito
  giudica l'adeguatezza, non il merito» `[MISURATO: VERDETTI_DA_COMPILARE.md:35-36]`.
  Sceglierla pensando che sia neutra sarebbe un errore. Nota che `value.budget` è
  già compilato su **51/110** e la fascia di prezzo quindi esiste già: la parte
  nuova sarebbe solo «per chi».

### Tabella di decisione

| | A — non giudica | B — verdetto torna | C — il limite |
| --- | --- | --- | --- |
| campi nuovi nel modello | 0 | 2 (`verdict`, `nonFaPerTeSe`) | 0 |
| righe da scrivere per scheda | 0 | 2 | 1, solo se esiste |
| arretrato su 79 | 0 | **78** | 30 (49 già fatte) |
| a regime su 533 | 0 | 1.066 righe | solo dove serve |
| copre `site.ts:66` «i limiti» | no → riscrivere | sì | **sì** |
| coerente con `homeComposition.ts:142` | sì | no → rimettere indietro | sì |
| rischio | il sito diventa un registro | riempimento parziale = reticenza | non è un giudizio |

**Non scelgo.** Le tre sono rese sopra sulla stessa scheda, con lo stesso testo
reale. Quello che dico è solo questo: **B è l'unica che introduce un arretrato, e
l'arretrato è 78 su 79 dopo undici mesi che il foglio esiste.**

---

## 8. D2 — variante family: raccomando fuori scope

La scheda non legge `useAudience()` e **non deve iniziare a farlo.** Il motivo è
già scritto nel modello, non lo invento io:

> «È il campo che rende una scheda leggibile da un genitore senza bisogno di una
> sezione family separata — un vincolo non è un giudizio, è un fatto.»
> `[MISURATO: src/types/content.ts:87-90]`

Un tema per audience nel repo è **un blocco di override di token, mai un fork di
componenti** `[MISURATO: DESIGN.md:105-107]`. Una scheda che cambia contenuto in
base all'audience sarebbe il primo fork di contenuto del sito, su 533 pagine, e
raddoppierebbe la superficie di QA.

«Va bene dai 3 anni» è una riga di `toKnow`, non una variante di template.

**Domanda per l'owner, secca**: confermi che la scheda posto serve un pubblico
solo, e che il family si esprime dentro `toKnow`? Se la risposta è no, il lavoro
non è di design ma di modello e va rifatto prima dell'import.

---

## 9. Tap target — sciolgo il fork dei 44px

Il browser-auditor rimanda a me la decisione: 44px ovunque o solo nel drawer?

**Decisione: 44px resta la convenzione dei controlli-azione. 24×24 è il minimo
di ogni controllo, ovunque, ottenuto con padding verticale — mai ingrandendo il
testo.** Motivo: la tipografia editoriale piccola (breadcrumb 11px, link quieti
12-14px) è parte del registro calmo del brand; ingrandirla per raggiungere i 44
trasformerebbe la pagina in una lista di bottoni. L'area cliccabile si allarga,
il carattere no.

Fallimenti WCAG 2.5.8 AA da correggere `[MISURATO: browser-auditor]`, con il
rimedio esatto:

| controllo | oggi | rimedio |
| --- | --- | --- |
| «Vedi sulla mappa» (`Posto.tsx:276-283`) | 20px | `inline-flex py-1.5` → 32px |
| «Chiama · +39…» (`Posto.tsx:299-308`) | 20px | `inline-flex py-1.5` → 32px |
| «Calcola quanto dista da me» (`Posto.tsx:316-324`) | 16px | `py-2` → 32px |
| «Torna a Esplora» (`PostNavigation.tsx:46-54`) | 16px | `py-2` → 32px |
| breadcrumb (`Breadcrumbs.tsx:59-100`) | 14-17px | `py-1.5` sui `<Link>`, non sul `<nav>` |
| link legali footer | 16px | `py-1.5` — **fuori dal mio scope, vale su ogni rotta** |

Restano volutamente sotto i 44 (passano AA, non seguono la convenzione drawer):
nav desktop 29px, toolbar `/mappa` 34px, chip continenti 24px. **Non li tocco**:
sono controlli densi in superfici dense, e portarli a 44 gonfierebbe la nav.

`[DEDOTTO: i valori di rimedio assumono line-height corrente. Si smentisce se un
controllo eredita un `leading` che ho letto male — vanno rimisurati dopo la patch.]`

---

## 10. Duplicazioni da rimuovere — il finding più pesante

`PlaceBusinessActions` è montato in `variant="full"` (default) dentro la colonna
«Orari e contatti» `[MISURATO: src/pages/Posto.tsx:313]`. Su **ogni** scheda
produce:

- `Indicazioni Maps` — pill piena, identica per funzione a `Indicazioni` 40 righe
  sopra;
- `Scheda Google Business` — pill outline;
- `Condividi` — identico al `Condividi` della riga Salva/Condividi;
- `Chiama · telefono` — duplicato della riga telefono già renderizzata (si
  verifica su **59 schede**, quelle con `phone`).

**Direzione: `PlaceBusinessActions` esce dalla scheda posto.** Al suo posto, nella
colonna Dove, un solo link quieto: `↗ Orari e contatti su Google`. Il componente
resta dov'è utile — il cassetto della mappa, dove non ci sono altri controlli
`[MISURATO: usato anche in src/components/map/FullScreenMapExperience.tsx]`.

Nota collaterale, sempre in quel file: `bg-amber-500/10` a
`PlaceBusinessActions.tsx:135` e `:172` è una utility di palette Tailwind grezza
su superficie pubblica, vietata da `DESIGN.md:76`. Se il componente resta montato
sulla mappa va comunque portata a `--color-accent-soft`.

---

## 11. Icon lock (lucide-react) e token

**Nessuna icona nuova.** Confermo il lock del 2026-07-16 ed estendo ai blocchi
nati dopo:

`Navigation` (Indicazioni) · `MapPin` (marker luogo, «Vedi sulla mappa», chip
distanza) · `Clock` (orari) · `Phone` (Chiama) · `CalendarCheck` (Prenota) ·
`ExternalLink` (Google) · `Heart` (Salva, outline→fill) · `Share2`→`CheckCircle`
(Condividi→copiato) · `Play` (badge sulla copertina reel) · `Car` (Come ci
arrivi) · `CalendarDays` (Quando) · `Info` (Cosa sapere prima) · `Compass`
(Torna a Esplora) · `ArrowUpRight` (card vicini) · `Stamp` (gira la carta).

Regola invariata: **un'icona per ruolo.** `MapPin` è il marker del luogo,
`Navigation` è l'azione. Non si scambiano.

**Token** — nessuno nuovo:

- superfici `--color-surface`, `--color-sand`
- bordi `--color-border`
- testo `--color-ink`, `--color-ink-2`, `--color-muted-fg`, `--color-muted-fg-2`
- accento `--color-accent`, `--color-accent-text`, `--color-accent-hover`,
  `--color-accent-on-dark`
- raggi `--radius-md`, `--radius-lg` · ombre `--shadow-sm`, `--shadow-md`
- primario: `bg-[var(--color-ink)] text-white hover:bg-[var(--color-accent-hover)]`
- secondario: `border-[var(--color-border)] hover:border-[var(--color-accent)]
  hover:text-[var(--color-accent-text)]`
- `focus-visible:ring-2 ring-[var(--color-accent)] ring-offset-2` su **ogni**
  controllo — il gate a11y è bloccante a ≥0,95.

---

## 12. Cosa non ho verificato

- **Non ho misurato in browser.** In questa sessione non ho accesso a Playwright
  né a una shell: i numeri di runtime vengono dal browser-auditor, i miei calcoli
  vengono da CSS e dal seed. Ogni risparmio in §6 è `[DEDOTTO]` e va rimisurato.
- `[VERIFY]` il costo in tempo di scrittura per l'owner di una riga di verdetto.
- `[VERIFY]` la coerenza fra i 59 `phone` nel seed e la misura del browser-auditor
  che riporta «Chiama · +39…» su tutte e tre le schede campione:
  `shanghai-disneyland` **non ha `phone`** `[MISURATO: content-seed.json:2384-2394]`,
  quindi quella riga non può renderizzare lì. Da riconciliare prima di usare
  quella misura come base.

## Prossimo passaggio

1. **All'owner**: D1 (A / B / C) e D2 (sì / no family). Senza D1 il SEO
   scriverebbe microcopy per un layer che potrebbe non esistere.
2. **A `travellini-frontend-builder`**, indipendentemente da D1 — §3, §4, §5, §9
   e §10 non dipendono dalla scelta sul verdetto e valgono in tutte e tre le
   varianti.
3. **A `travellini-seo-conversion-strategist`** dopo D1, per le stringhe:
   `site.ts:66`, il titolo «Il reel girato qui», l'eyebrow «Cosa sapere prima»,
   il link «Orari e contatti su Google».
