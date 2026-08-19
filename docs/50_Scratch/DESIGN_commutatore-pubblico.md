---
title: DESIGN_commutatore-pubblico
status: archived
created: 2026-08-17
owner: travellini-ui-designer
slug: commutatore-pubblico
type: design-reference
area: delivery
head: b4066b8
next: travellini-frontend-builder
implemented: '2026-08-17'
---

# Il commutatore di pubblico — direzione esecutiva

> **Esito, 2026-08-17.** Implementato — vedi
> `PROJECT_HOME_RICOMPOSIZIONE_2026-07-26` §15.
>
> **Le misure di spazio in §2 e §11 erano aritmetica, non browser, e
> sbagliavano.** Lo spazio libero reale in navbar è **66px a ogni larghezza
> desktop** (1024, 1280, 1440), non 150-165; il bottone account ne vale 32, non
> 36; e il chip con l'etichetta più lunga costa **130px**, non 163. I numeri
> veri vengono dall'aver iniettato l'elemento nella pagina e letto l'overflow,
> non dal moltiplicare caratteri per larghezza media. La conclusione della
> direzione — «non entra senza liberare spazio» — resta giusta; la sua
> aritmetica no.
>
> **Non implementati**: §6 (stato temporaneo su rotta forzata) e §8
> (spegnimento del gate). Fuori dai punti chiesti dall'owner per questo giro,
> e l'owner ha scelto di decidere sul gate dopo aver raccolto i dati.

## 0. Cosa ho misurato e cosa no

Questa sessione dell'agente **non ha browser né shell** (tool: Read/Grep/Glob/Write).
Non ho potuto sondare `localhost:3000` a 320/375/768/1280. Di conseguenza:

| Tag                        | Cosa significa qui                                                  |
| -------------------------- | ------------------------------------------------------------------- |
| `[MISURATO: file:riga]`    | letto direttamente nel codice, riproducibile aprendo quella riga     |
| `[DEDOTTO — aritmetica]`   | calcolato dalle classi Tailwind con le assunzioni dichiarate in §2   |
| `[VERIFY: ...]`            | serve una sonda in browser reale prima di trattarlo come fatto       |

La sonda che chiude i `[VERIFY]` è in §11. **Non implementare la §2 senza averla
fatta girare**: il numero che ha ucciso la versione precedente di questo controllo
era un numero di larghezza, e sbagliarlo la seconda volta costerebbe due giri.

## 1. La diagnosi — perché «l'icona account non va bene»

L'owner ha ragione, ma la causa non è l'icona: è che **un solo glifo da 32px è la
porta di quattro cose che non c'entrano fra loro**, e quella che cambia di più il
sito è sepolta più in fondo.

Cosa c'è dietro il bottone persona `[MISURATO: src/components/Navbar.tsx:709-822]`:

1. **Modalità** (il commutatore a 3) — cambia dodici componenti e il tema CSS
2. **Personalizza esperienza** → `InterestPicker`
3. **I miei preferiti**
4. **Lingua** (IT/EN)
5. **Pannello Admin** (solo admin)
6. **Accedi / Disconnetti**

Tre prove che il contenitore è sbagliato, tutte nel codice:

- **L'etichetta lo confessa già.** `aria-label="Menu utente, modalità e impostazioni"`
  `[MISURATO: Navbar.tsx:659]`. Tre sostantivi per un'icona. Quando un'etichetta ha
  bisogno di tre sostantivi, il controllo sta facendo tre lavori.
- **Non può fare il proprio lavoro per i primi 8 secondi.** L'init di Firebase Auth
  è deliberatamente rimandato di 8000ms fuori da `/admin`
  `[MISURATO: src/context/AuthContext.tsx:132 — delay = /^\/admin(?:\/|$)/.test(...) ? 0 : 8000]`.
  Per tutta la finestra in cui un lettore decide se restare, il bottone mostra il
  glifo generico anche a chi è loggato. Come indicatore d'identità è **sempre
  sbagliato** nel momento che conta.
- **Porta un numero che non è suo.** Il contatore preferiti è renderizzato addosso
  al bottone account `[MISURATO: Navbar.tsx:674-678]`. Un badge numerico su
  un'icona persona si legge come «notifiche», non come «posti salvati».

E c'è un quarto elemento, dentro lo stesso menu, che è un problema di brand a sé:

- **Il selettore Lingua è un controllo finto.** `src/i18n` è importato da esattamente
  **due** file in tutto `src/`: `Navbar.tsx` e `services/analytics.ts`
  `[MISURATO: grep "i18n" su src/ → 2 file]`. `setLocale` scrive una variabile di
  modulo, non persiste e non provoca re-render `[MISURATO: src/i18n/index.ts:21-24]`.
  Cliccando «Lingua» cambia solo il badge IT→EN e un parametro di analytics: **niente
  sulla pagina si traduce.** `CLAUDE.md` e `DESIGN.md` vietano esplicitamente i
  controlli finti. Questo lo è.

### Perché il commutatore non si vede: era stato tolto apposta

Non è una svista, ed è la cosa più importante di questo documento. Il codice
registra la misura che lo ha ucciso `[MISURATO: Navbar.tsx:701-708]`:

> «era una barra segmentata a tre nel corpo della navbar. Con brand, menu, ricerca,
> CTA e account nella stessa riga la pillola serviva **1.476px di contenuto in 1.182
> disponibili a 1280**: il CTA e questo stesso bottone finivano fuori schermo a
> _ogni_ larghezza desktop.»

**Qualunque direzione che rimetta tre segmenti etichettati nella pillola ripete
quel fallimento.** Per far entrare il commutatore, qualcosa deve uscire prima. La
§2 dice quanto spazio c'è e quanto costa ciascuna uscita.

## 2. Il budget di spazio — quanto costa davvero

Assunzioni dell'aritmetica, dichiarate perché sono la parte fragile: avanzamento
medio Inter maiuscolo ≈ 0,62em; Fraunces caso misto ≈ 0,52em; il `tracking` si
somma per carattere. Errore atteso ±8%.

**Larghezza utile della pillola** `[DEDOTTO — aritmetica da Navbar.tsx:322-329]`:
viewport − 48 (`md:px-6`) − 2 (bordo) − 40 (`md:px-5`).

- a 1280 → **1190px** (il commento in codice registra 1.182 → il mio modello del
  contenitore è corretto entro 8px)
- a 1024 → **934px**

**Sottigliezza che cambia quale larghezza è il caso peggiore** `[DEDOTTO]`: con una
scrollbar classica da ~15px, una finestra da 1280 ha viewport CSS ~1265 e **`xl:`
non si applica**. Il breakpoint `xl` entra davvero verso ~1295 fisici. Quindi il
desktop più stretto in cui la navbar è completa non è 1280 in modalità `xl`, è
**1024 in modalità `lg`**. Vanno sondati entrambi.
`Si smentisce se: la macchina usa scrollbar overlay (macOS, o Windows con overlay attivo), nel qual caso 1280 = xl.`

**Occupazione attuale, modalità viaggiatori** `[DEDOTTO — aritmetica]`:

| Blocco                          | a 1280 (`xl`) | a 1024 (`lg`) |
| ------------------------------- | ------------- | ------------- |
| Marchio + `pl-1`                | ~175          | ~147          |
| 4 voci di menu + spaziature     | ~456          | ~320          |
| Ricerca (icona + parola + `kbd`)| ~135          | ~86           |
| CTA «La guida in regalo»        | ~183          | ~162          |
| Account (`pl-1` + `h-8 w-8`)    | 36            | 36            |
| `gap-3` × 2 + `space-x`         | ~40           | ~36           |
| **Totale**                      | **~1025**     | **~787**      |
| **Spazio libero**               | **~165**      | **~147**      |

Cioè: **~150px di margine a ogni larghezza desktop**, non di più.

**Costo del chip proposto in §3**, etichetta più lunga «Collaborazioni», serif 13px,
senza tracking: 95 (testo) + 6 (pallino) + 6 + 11 (chevron) + 4 + 24 (`px-3`) + 17
(divisore e margini) = **~163px** `[DEDOTTO — aritmetica]`.

**Conclusione operativa: 163 > 147. Il chip NON entra senza liberare spazio.**

Cosa si può liberare, in ordine di costo di brand crescente:

| Cosa esce                            | Guadagno | Costo                                                   |
| ------------------------------------ | -------- | ------------------------------------------------------- |
| `kbd` ⌘K/Ctrl+K nel bottone ricerca  | ~54px    | quasi nullo — è arredo da sviluppatore su un sito che si legge `[MISURATO: Navbar.tsx:621-623]` |
| Bottone account                      | ~36px    | vedi le tre opzioni rese in §7 — decisione dell'owner    |
| Parola «Cerca» (solo `xl`)           | ~39px    | la lente è una convenzione capita; il glifo persona no   |

- **Minimo vitale**: togliere il `kbd`. 147 + 54 = 201 contro 163 → margine 38px a 1024. Passa, stretto.
- **Raccomandato**: `kbd` + account. 147 + 90 = 237 contro 163 → **margine 74px**. Questo è il numero su cui costruire.

## 3. La forma — testata a edizioni, non barra segmentata

I tre pubblici non sono una preferenza di dispositivo: sono **tre edizioni della
stessa testata**. Il precedente giusto è l'indicazione di edizione sotto la testata
di un giornale, non un toggle da toolbar. Da qui discende tutto il resto.

**Un solo controllo, non tre**, attaccato al marchio, non al cluster d'azione:

```
Travelliniwithus │ ● Viaggiatori ⌄
```

Perché questa forma e non le alternative:

- **Segmented control a 3 nella barra** — misurato impossibile (§2). Scartato.
- **Tab** — implicano che il contenuto sottostante è lo stesso con tre viste. Qui
  cambiano rotte, CTA, nav, tema. Mentirebbero.
- **Tre pillole sempre visibili** — stesso problema di larghezza del segmented, più
  il difetto che due dei tre stati sono sempre «spenti»: tre etichette accese al 50%
  accanto al marchio rubano la gerarchia alla CTA.
- **Menu a tendina generico** — troppo debole per una cosa che ricolora il sito. E
  indistinguibile dal selettore lingua che sta lì accanto (e che è finto, §1).
- **Chip di edizione con popover** — un solo controllo (163px, non ~300), dichiara
  lo stato **anche quando non lo si tocca**, e stando a sinistra col marchio non
  compete con la CTA per lo slot dell'azione primaria. **Scelto.**

### Contratto visuale del chip

- **Tipografia serif, non maiuscolo.** Le voci di menu sono 11,5px maiuscolo bold
  `tracking-[0.14em]`: quella è la voce «azione». Il chip usa **Fraunces ~13px,
  caso normale, `--color-ink-2`, nessun tracking**. Questo lo lega otticamente alla
  testata invece che alla nav — ed è anche il motivo per cui costa 163px e non 220:
  il serif minuscolo avanza ~6,8px/carattere contro ~8,7 del maiuscolo tracciato.
- **Divisore**: una hairline verticale 1px `--color-border`, alta ~16px, con 8px di
  margine per lato. È il segno che dice «questo appartiene al marchio», non «questo
  è un'altra voce di menu».
- **Il pallino**: cerchio pieno 6px in `--color-accent`, `aria-hidden`. Siccome
  `--color-accent` è per-audience — terracotta, rosa, oro antico
  `[MISURATO: src/index.css:181, :209]` — **il pallino è letteralmente il colore che
  il sito è appena diventato**. È il modo più silenzioso possibile di dire «questo è
  lo stato»: mostra il tema come campione. Il significato lo porta l'etichetta, non
  il pallino: WCAG 1.4.11 non è in gioco (`aria-hidden`, ridondante), e comunque
  tutti e tre gli accent stanno ≥3,18:1 su sand `[MISURATO: src/index.css:181,209]`.
- **Chevron** 11px, `opacity-60`, ruota di 180° all'apertura — stessa grammatica dei
  dropdown esistenti `[MISURATO: Navbar.tsx:378-381]`.
- **Nessun riempimento accent, nessuna ombra, nessun bordo pieno.** Il chip è una
  dichiarazione con un'affordance, non un bottone. Se attira l'occhio prima della
  CTA, è sbagliato.
- **Target**: `min-h-[32px]` desktop — pari al bottone account che sostituisce
  `[MISURATO: Navbar.tsx:660 h-8]`, ben oltre i 24×24 di WCAG 2.5.8 AA. Nel drawer
  restano i 44px della convenzione locale.
- Stati: `hover` → il divisore passa a `--color-accent`; `focus-visible` → anello
  2px `--color-accent` (stesso pattern di AudienceGate.tsx:233).

### Il popover

`role="menu"`, ancorato a sinistra, largo 22rem, `rounded-2xl`, bordo
`--color-border`, superficie bianca, ombra come i dropdown esistenti
`[MISURATO: Navbar.tsx:468-471]`.

- Eyebrow 10px maiuscolo `tracking-[0.28em]` `--color-accent-text`: **«Edizione»**
- Tre righe, ciascuna: icona in pastiglia `--color-accent-soft` 32px · nome in serif
  17px · **una riga di cosa cambia** in 11,5px `--color-muted-fg-2`.
- **Le tre descrizioni non si riscrivono: si spostano.** Sono già scritte, già
  italiane, già specifiche, e sono in produzione dentro il gate
  `[MISURATO: src/components/AudienceGate.tsx:36-64]`. Riusarle verbatim è ciò che
  permette al gate di sparire senza perdere niente (§8).
- La riga attiva: fondo `--color-sand`, `aria-current="true"`, e un segno di spunta
  no — basta il fondo più il pallino accent già acceso nell'icona.
- Nessuna riga «Personalizza esperienza» qui dentro. È un'altra decisione (scegliere
  un interesse dentro un'edizione), e infilarla nel popover ricrea in piccolo il
  problema del menu account. Va nel footer e resta nel drawer.

## 4. Spec per breakpoint

Tre gradini, agganciati ai breakpoint che il file usa già. **La barra non cresce
mai**: resta 80px desktop / 74px mobile.

### 320–767 (`< md`) — solo marcatore, nessun controllo nella barra

Spazio libero nella pillola a 320: 262 (contenuto) − 130 (marchio a 16px) − 92
(due bottoni 44px + gap) = **~40px** `[DEDOTTO — aritmetica]`. Non ci sta una parola.

- **Pallino accent 6px subito dopo il marchio**, `aria-hidden`, + uno `<span class="sr-only">Edizione Family</span>`. Costo: ~10px. Entra a 320 con margine.
- **Non è un bottone.** 6px è sotto 24×24: renderlo cliccabile violerebbe WCAG 2.5.8,
  che il progetto ha appena chiuso. Il controllo resta nel drawer.
- Il controllo nel drawer **non si tocca**: il segmented a tre esistente è corretto,
  ha già `min-h-[44px]` per segmento, ed è già il secondo elemento dopo la ricerca
  `[MISURATO: Navbar.tsx:908-951]`. Il problema misurato dall'owner è che è l'**unico**
  posto, non che sia fatto male.

Perché non forzare il controllo nella barra a 320: significherebbe accorciare il
marchio o togliere la ricerca, per un controllo che è comunque a un tap di distanza
e già a norma. Non vale il prezzo.

### 768–1023 (`md`) — marcatore con la parola, passivo

Spazio libero a 768: ~488px `[DEDOTTO]`. Ci sta la parola.

- `Travelliniwithus ● Family` — pallino + serif 13px `--color-ink-2`.
- Ancora **passivo**: il burger è ancora montato (`lg:hidden`) e il controllo vero è
  nel drawer, primo schermo. Farlo aprire il drawer creerebbe due controlli identici
  a 8px di distanza. Se il builder lo trova stonato, l'alternativa accettabile è
  renderlo un bottone che apre il drawer — ma allora **solo lui**, e il burger perde
  la doppia funzione. Default: passivo.

### ≥1024 (`lg`) — il chip, controllo pieno

- Marchio · divisore hairline · pallino · etichetta · chevron → apre il popover.
- **Precondizione bloccante**: il `kbd` esce dal bottone ricerca (§2). Senza,
  a 1024 il chip spinge la CTA fuori dalla pillola. Di nuovo.
- Nota di composizione: la nav centrale è centrata da `flex-1 justify-center`
  `[MISURATO: Navbar.tsx:358]`, quindi aggiungere ~163px a sinistra sposta il suo
  centro ottico di ~80px a destra. È voluto e va guardato, non corretto con un
  margine compensativo.

## 5. Come dichiara lo stato senza urlare

Metà del lavoro **è già fatto e nessuno lo sta sfruttando**: il tema per audience
riscrive fondo, accento e radius su `:root[data-audience=...]`
`[MISURATO: src/index.css:175-225]`. Chi arriva da `/family` vede già un sito
azzurro-e-rosa con angoli più morbidi. Quello che manca non è un segnale in più:
manca **il nome di quello che sta già vedendo**.

Quindi la dichiarazione di stato è, in ordine di forza decrescente:

1. **Il tema** (già attivo, invariato) — il sito è di un altro colore.
2. **Il pallino accent nel chip** — quel colore, nominato, dentro la testata.
3. **L'etichetta** — la parola.
4. **La nav che cambia voci** (già attiva, invariata) `[MISURATO: Navbar.tsx:507-604]`.

Nessun banner, nessun toast, nessun badge «MODALITÀ FAMILY ATTIVA». La riga di
`AudienceGate` che promette «Puoi cambiare quando vuoi dall'interruttore in alto»
`[MISURATO: AudienceGate.tsx:221-223]` diventa finalmente **vera**: oggi quell'interruttore
in alto non esiste a nessuna larghezza.

**Da rimuovere: il toast B2B** `[MISURATO: Navbar.tsx:287-316]`. Con un chip permanente
è ridondante, e come copy è fuori brand: «Modalità Partner Attiva» è maiuscolo da
finestra di dialogo Windows, «Hub B2B Travelliniwithus» è gergo inglese su un sito
editoriale italiano. Un pillolino flottante che appare 4,5s per dire una cosa che
ora sta scritta stabilmente nella testata.

## 6. Gli override di rotta — il caso limite

Stato attuale, misurato:

- `resolvedAudience = routeAudience ?? userAudience ?? 'viaggiatori'` — la rotta
  vince sempre `[MISURATO: src/context/AudienceContext.tsx:156-157]`.
- `handleModeSwitch` **naviga già**: brand → `/collaborazioni`, family → `/family`,
  viaggiatori da una rotta altrui → `/` `[MISURATO: Navbar.tsx:202-219]`.

**Quindi il fallimento ingenuo che la richiesta teme — «tocco viaggiatori su
/collaborazioni e non succede niente» — non esiste già oggi.** Restano però due
difetti veri, entrambi risolvibili senza toccare `AudienceContext`:

### (a) Il chip mente su chi comanda

Se `userAudience = 'viaggiatori'` ma sei su `/media-kit`, il chip dice
«Collaborazioni». L'utente crede di aver cambiato preferenza. Non l'ha fatta. Poi
naviga su `/esplora`, il sito torna arancione, e sembra rotto.

**Direzione**: quando `audienceFromPath(pathname) !== null && userAudience !== audience`,
il chip entra in **stato temporaneo**:

- il divisore hairline diventa **tratteggiato** (1px dashed) — unico cambio visivo,
  silenzioso, coerente col linguaggio della carta;
- il popover apre con una riga in testa, sopra l'eyebrow:
  **«Questa pagina è nella sezione Collaborazioni. La tua edizione resta Viaggiatori.»**
- la prima azione del popover diventa **«Torna a Viaggiatori»**, che naviga a `/`.

Il contesto espone già **sia** `audience` **sia** `userAudience` **sia** `hasChosen`
`[MISURATO: AudienceContext.tsx:177-185]`. **Questa direzione richiede zero modifiche
ad `AudienceContext.tsx`.** È l'unica ragione per cui la stimo piccola.

### (b) Il commutatore è un navigatore travestito da interruttore

Toccare «Family» mentre stai leggendo un articolo ti porta su `/family` e l'articolo
lo perdi. Oggi il controllo è sepolto in un menu, quindi ci finisce quasi nessuno.
**Renderlo prominente rende comune un teletrasporto accidentale.**
`[DEDOTTO. Si smentisce se: i dati mostrano che chi cambia edizione voleva comunque cambiare pagina. Oggi il dato non esiste — vedi §9.]`

**Direzione**: la descrizione sotto ogni nome nel popover deve dire dove si va, non
solo cosa cambia. Le tre righe del gate lo fanno già a metà; per family e brand
aggiungere l'esito in coda, es. «Gravidanza, viaggi col pancione e — presto — col
piccolo. **→ ti porta su /family**». Piccolo, 10px, `--color-muted-fg`. Non è
decorazione: è l'unica informazione che impedisce di perdere l'articolo per sbaglio.

**Selezionare l'edizione che la rotta già impone** (es. «Collaborazioni» stando su
`/collaborazioni`) deve essere un no-op che persiste la scelta, senza navigare.
Funziona già così `[MISURATO: Navbar.tsx:207-210]`. Non regredirlo.

## 7. L'icona account — tre opzioni rese, decide l'owner

Il glifo persona costa 36px e ne servono 163. Ma la decisione non è aritmetica: è
se il sito vuole dichiarare un'area account nella testata. Tre opzioni rese, con il
conto sotto ciascuna.

### Opzione 1 — sparisce dal desktop, il contenuto si ridistribuisce *(raccomandata)*

- **Preferiti** → icona cuore propria nel cluster, col suo contatore. Il numero
  finisce finalmente sulla cosa che conta. ~32px.
- **Lingua** → **si rimuove del tutto**, non si sposta: è un controllo finto (§1).
  Torna quando `src/i18n` sarà consumato da qualcosa.
- **Admin** → via dalla navbar. `/admin` è dietro `ProtectedRoute`; un admin usa un
  segnalibro. In cambio, ogni lettore smette di vedere un segnale «qui hai un account».
- **Accedi / Disconnetti** → footer, più le superfici dove il login serve davvero e
  che esistono già: `/preferiti`, `/club`, `/miei-acquisti`.
- **Conto**: libera 36px. Con il `kbd` (54) → margine 74px a 1024. Il più sicuro.
- **Onestà**: il login **ha** tre benefici reali per il lettore (preferiti
  sincronizzati, `/club`, `/miei-acquisti` `[MISURATO: grep useAuth() → FavoritesContext, Club, MieiAcquisti]`).
  Nessuno dei tre è un lavoro da prima visita, e la testata è spazio da prima visita.

### Opzione 2 — resta, ma smette di fingersi un account

- `UserIcon` → `SlidersHorizontal` (già importato, `[MISURATO: Navbar.tsx:21]`),
  etichetta «Impostazioni». Il badge preferiti se ne va comunque su un cuore proprio.
- Il commutatore esce da qui e diventa il chip; dentro restano Personalizza, Lingua
  (da riparare o togliere), Admin, Accedi.
- **Conto**: non libera nulla. Serve togliere il `kbd` **e** la parola «Cerca» a
  `xl` per arrivare a ~93px → margine 30px a 1024. **Stretto: da non fare senza la
  sonda §11.**

### Opzione 3 — resta identica, paga la ricerca

- La ricerca collassa a sola lente da `lg` a `xl`: via `kbd` e via «Cerca», ~93px.
- **Conto**: margine ~30px a 1024. Account intatto.
- **Costo**: la lente senza parola è una convenzione universale; il glifo persona
  che significa «modalità, preferiti, lingua, admin, login» non lo è. Si sacrifica
  il controllo comprensibile per salvare quello ambiguo.

**Raccomandazione: Opzione 1.** L'istinto dell'owner è giusto per una ragione che
non ha detto: la testata sta pubblicizzando la cosa che serve dopo (l'account) e
nascondendo quella che serve subito (l'edizione).

## 8. Il primo accesso — il gate sopravvive?

**Come oggetto visivo, no.** Questa parte è una chiamata di direzione, e me la
prendo:

`AudienceGate` si monta solo sulla home, solo alla prima visita, deferito da
`requestIdleCallback` con fallback 1,2s `[MISURATO: AudienceGate.tsx:112]`, e
**solo dopo che il banner cookie è stato risolto** `[MISURATO: AudienceGate.tsx:127-140]`.
La sequenza reale per un primo visitatore è quindi: la pagina dipinge → banner
cookie a schermo → rispondi → ~1,2s dopo **un secondo dialogo a schermo pieno**.
Due modali prima di un contenuto. È l'opposto della «gerarchia calma» che
`DESIGN.md` mette come prima riga della direzione visiva.

E chiede «Cosa ti porta qui?» prima che il visitatore abbia visto una fotografia.
Chi arriva da un reel non sa se è «Viaggiatori» o «Family» **nel vocabolario di
questo sito** — sono parole nostre, non sue. Intanto il caso di maggior valore è
già gestito senza chiedere niente: atterrare su `/family` da un link in bio imposta
l'audience in silenzio `[MISURATO: AudienceContext.tsx:129-138]`.

**Se la domanda debba sopravvivere del tutto è decisione dell'owner**, perché è una
questione di conversione e **oggi non c'è il dato per deciderla** (§9). Due opzioni
rese:

| | **A — spegnere il gate** | **B — declassarlo a fascia in pagina** |
| --- | --- | --- |
| Come | `AUDIENCE_GATE_ENABLED = false`, kill-switch già presente `[MISURATO: AudienceGate.tsx:24]` | la stessa domanda, ma come sezione della home sotto l'hero, accanto a `HomeAudienceVoice` |
| Costo | una riga | mezza giornata di frontend |
| Guadagno | via il doppio modale; il chip porta tutto | via il doppio modale, la domanda resta ma **dopo** che il visitatore ha visto cosa è il sito |
| Rischio | se il gate era l'unica cosa che rendeva scopribili family e brand, la scoperta cala | nessuno noto |

**Preferenza di design: B.** `HomeAudienceVoice` è già, per dichiarazione nel suo
stesso codice, «il momento in cui il sito si gira verso chi sta guardando»
`[MISURATO: src/components/home/HomeAudienceVoice.tsx:13]`. È il posto naturale per
una domanda che oggi arriva 1,2 secondi dopo il caricamento.

**In entrambi i casi le tre descrizioni del gate non si buttano: migrano nel
popover** (§3). È il motivo per cui togliere il gate non toglie informazione.

## 9. Il buco di misura che rende indecidibile la §8

`audience_gate_view`, `_select`, `_dismiss` sono tracciati
`[MISURATO: AudienceGate.tsx:81, 86-94]`. **Il cambio da navbar e da drawer non è
tracciato affatto**: `handleModeSwitch` non chiama `trackAnalyticsEvent`
`[MISURATO: Navbar.tsx:202-219]`.

Quindi oggi nessuno può dire se il commutatore viene usato, e il confronto
«gate contro chip» non è calcolabile. **Da aggiungere insieme al chip**, non dopo:

```
audience_switch  { from, to, surface: 'chip' | 'drawer' | 'gate', path }
```

Due settimane di questo dato chiudono la §8 con un numero invece che con un'opinione.

## 10. Copy — nomenclatura da bloccare

Oggi la terza audience ha **quattro nomi diversi** in tre file:

| Dove | Come si chiama | Riga |
| --- | --- | --- |
| Gate | «Brand & aziende» | `AudienceGate.tsx:60` |
| Menu account | «Collaborazioni» | `Navbar.tsx:718` |
| Drawer | «Collaborazioni» | `Navbar.tsx:919` |
| Toast | «Modalità Partner Attiva» / «Hub B2B» | `Navbar.tsx:298` |

Da bloccare, una volta sola:

- **Viaggiatori** — resta. È il lettore.
- **Family** — resta in inglese. È il nome pubblico reale del sub-brand
  (`@travellinifamily`, `[MISURATO: docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md:17]`).
  Tradurlo romperebbe il riconoscimento.
- **Collaborazioni** — vince. È già la parola sulla rotta, nel footer e nella card
  B2B del drawer. Muoiono «Brand & aziende», «Modalità Partner», «Hub B2B».
  («Brand» come etichetta rivolta all'utente è inglese e ambigua: *il* brand qui è
  Travelliniwithus.)
- Il sostantivo del gruppo passa da **«Modalità» a «Edizione»**. «Modalità» è lingua
  da impostazioni di sistema (modalità aereo, modalità scura); «edizione» è lingua
  editoriale ed è quello che il sito effettivamente fa. Aggiornare anche
  `aria-label="Scegli la tua modalità"` → `"Scegli l'edizione"`
  `[MISURATO: Navbar.tsx:713, 913]`.
- Vietato in questo lavoro: «scopri», «esplora il mondo», «unico», «personalizzato»,
  «esperienza su misura», qualunque maiuscolo tipo Titolo Di Windows.

`[VERIFY: «Personalizza esperienza» (Navbar.tsx:752, 957) è vago-aziendale ma è l'ingresso a InterestPicker e ha uno scope suo. Passa a travellini-seo-conversion-strategist, non a questo lavoro.]`

## 11. La sonda che chiude i [VERIFY]

Da far girare a **320, 375, 768, 1024, 1280, 1440** su `http://localhost:3000/`,
`/family` e `/collaborazioni`, prima di implementare la §2 e la §4.

```js
// larghezza reale di ogni blocco della pillola + overflow
(() => {
  const pill = document.querySelector('nav > div');
  const r = (el) => (el ? Math.round(el.getBoundingClientRect().width) : null);
  const cs = getComputedStyle(pill);
  const kids = [...pill.children];
  return {
    viewport: window.innerWidth,
    docScrollW: document.documentElement.scrollWidth,
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
    pillOuter: r(pill),
    pillContent: Math.round(pill.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)),
    pillHeight: Math.round(pill.getBoundingClientRect().height),
    navBottom: Math.round(pill.getBoundingClientRect().bottom),
    blocchi: kids.map((k) => ({ cls: k.className.slice(0, 40), w: r(k), visible: k.offsetParent !== null })),
    sommaBlocchi: kids.reduce((a, k) => a + (k.offsetParent ? r(k) : 0), 0),
    xlAttivo: window.matchMedia('(min-width: 1280px)').matches,
    lgAttivo: window.matchMedia('(min-width: 1024px)').matches,
    audience: document.documentElement.dataset.audience,
  };
})();
```

Cosa deve tornare perché la §2 regga:
- `pillContent − sommaBlocchi ≥ 163` dopo aver tolto `kbd` e account, a **1024 e a 1280**;
- `overflowX === false` a 320 con l'edizione più lunga attiva (`brand`);
- `pillHeight` invariato: 62 (mobile) e ~62 (desktop), `navBottom` 74 / 80.

E il controllo che il progetto già ha: `npm run audit:ui` e `npm run audit:visual`.
Nessun test e2e attuale dipende dalla struttura della navbar
`[MISURATO: grep nav|navbar|header su e2e/ → solo stripe-webhook, contact-rate-limit, shop-and-checkout]`,
quindi non c'è una rete che avvisi di una regressione qui: **la sonda è la rete.**

## 12. Cosa NON cambia

- `AudienceContext.tsx` — zero modifiche. Espone già tutto il necessario.
- `src/index.css`, i tre temi, i valori WCAG verificati.
- Il segmented control nel drawer mobile (`Navbar.tsx:908-951`).
- `audienceFromPath` e gli override di rotta.
- Fraunces, sabbia, terracotta, icone lucide.
- **Altezza della barra: 80px desktop / 74px mobile.** Il chip sta nella riga
  esistente; l'elemento più alto lì è il lockup del marchio (~40px), non il bottone
  account da 32 `[DEDOTTO — Navbar.tsx:335 py-1 + xl:text-[1.35rem] contro :660 h-8. Si smentisce se: la line-height ereditata sul marchio è < 1,3, nel qual caso la riga la governa il cluster e il margine verticale è minore — comunque sufficiente per un chip da 32px]`.

## 13. Findings, per severità

```
[blocker] src/components/Navbar.tsx
Problem: il controllo che cambia di più il sito non è visibile a nessuna larghezza — zero controlli che nominano un pubblico in navbar a 1280 e a 375.
Why it matters: dodici componenti leggono useAudience(); il sito sa parlare a tre pubblici e nessun visitatore lo scopre. È capacità costruita e non consegnata.
Direction: chip di edizione nella testata a ≥1024 (§3), marcatore passivo a <1024 (§4), previa liberazione di ≥163px (§2).

[serious] src/components/Navbar.tsx:654-826
Problem: un glifo persona da 32px è la porta di sei cose non correlate, e per 8s non può nemmeno mostrare l'identità (AuthContext.tsx:132).
Why it matters: la testata pubblicizza l'account (che serve dopo) e nasconde l'edizione (che serve subito). È il difetto che l'owner ha sentito senza nominarlo.
Direction: Opzione 1 di §7 — sciogliere il menu; cuore proprio per i preferiti; login nel footer e sulle superfici che lo richiedono.

[serious] src/components/Navbar.tsx:772-788 + src/i18n/index.ts:21-24
Problem: il selettore Lingua è un controllo finto — i18n è importato da 2 soli file e nulla si traduce.
Why it matters: CLAUDE.md e DESIGN.md vietano i controlli finti. Questo è esattamente quello, e sta nel menu che stiamo riaprendo.
Direction: rimuoverlo. Rientra quando esiste una superficie che consuma en.json.

[serious] src/components/Layout.tsx:53-58 + AudienceGate.tsx:127-140
Problem: primo accesso = banner cookie a schermo pieno, poi ~1,2s dopo un secondo dialogo a schermo pieno, prima di qualunque contenuto.
Why it matters: due modali prima di una fotografia è l'opposto della gerarchia calma; e la domanda arriva prima che il visitatore possa rispondervi.
Direction: §8 — opzione A o B, decide l'owner; in entrambi i casi il gate smette di essere un interstiziale e le sue tre descrizioni migrano nel popover.

[serious] AudienceGate.tsx:60 · Navbar.tsx:298, 718, 919
Problem: la terza audience ha quattro nomi: «Brand & aziende», «Collaborazioni», «Modalità Partner Attiva», «Hub B2B».
Why it matters: rende impossibile costruire un chip che dichiari lo stato — non c'è uno stato da dichiarare, ci sono quattro.
Direction: §10. Vince «Collaborazioni». Il sostantivo del gruppo passa da «Modalità» a «Edizione».

[serious] src/components/Navbar.tsx:202-219
Problem: il cambio di pubblico da navbar/drawer non emette nessun evento analytics, mentre il gate ne emette tre.
Why it matters: senza questo, «il chip serve più del gate?» resta un'opinione. È la misura che chiude §8.
Direction: audience_switch { from, to, surface, path }, aggiunto insieme al chip, non dopo.

[minor] src/components/Navbar.tsx:287-316
Problem: il toast «Modalità Partner Attiva — Hub B2B Travelliniwithus» è gergo inglese in maiuscolo da dialogo di sistema, per 4,5 secondi.
Why it matters: con un chip permanente è ridondante, e da solo è la cosa meno editoriale della navbar.
Direction: rimuovere.

[minor] src/components/Navbar.tsx:621-623
Problem: il badge ⌘K / Ctrl+K occupa ~54px in una barra che non ne ha 163 liberi.
Why it matters: è arredo da sviluppatore su un sito che si legge, ed è precisamente lo spazio che serve al chip.
Direction: rimuovere dalla barra. La scorciatoia continua a funzionare (Navbar.tsx:125-129); si dichiara dentro SearchModal.

[minor] src/components/Navbar.tsx:674-678
Problem: il contatore preferiti è renderizzato addosso al bottone account.
Why it matters: un badge numerico su un'icona persona si legge come notifiche.
Direction: cuore dedicato nel cluster, col contatore addosso — coerente col drawer, che il cuore ce l'ha già (Navbar.tsx:1176-1188).

[nit] src/components/Navbar.tsx:746-753, 952-958
Problem: «Personalizza esperienza» non dice cosa personalizza.
Why it matters: è la porta di InterestPicker; un'etichetta vaga fa sembrare opzionale una scelta che cambia la griglia della home.
Direction: fuori scope qui. Passa a travellini-seo-conversion-strategist insieme al copy di InterestPicker.
```

**Verdetto: Block — 1 blocker + 5 serious.**

## 14. Decisioni che restano all'owner

1. **§7 — l'icona account**: Opzione 1 (sparisce, raccomandata) · Opzione 2 (resta come «Impostazioni») · Opzione 3 (resta, paga la ricerca).
2. **§8 — il gate**: A (spegnere, una riga) · B (declassare a fascia in pagina, mezza giornata). Il declassamento da interstiziale è direzione di design; se la domanda sopravviva è chiamata sua.
3. **§1 — il selettore Lingua**: rimuoverlo, oppure aprire un lavoro separato per rendere reale l'EN. Non può restare com'è.

## 15. Ordine di esecuzione per travellini-frontend-builder

1. Sonda §11 a 320/375/768/1024/1280/1440. **Se il margine dopo le rimozioni è < 163px a 1024, fermati e torna qui.**
2. Togliere il `kbd` dalla ricerca. Ri-sondare.
3. Bloccare la nomenclatura §10 (`Collaborazioni`, `Edizione`) in `siteContent` e nei tre file.
4. Chip + popover a `lg`, marcatore a `md`, pallino a `< md` (§3, §4).
5. Stato temporaneo su rotta forzata (§6a) e riga «→ ti porta su …» nel popover (§6b).
6. `audience_switch` (§9).
7. Rimuovere il toast B2B; applicare l'opzione scelta dall'owner per account e gate.
8. `npm run typecheck` · `npm run audit:ui` · `npm run audit:visual` · sonda §11 di nuovo su tutte e tre le audience.
