---
title: COPY_navbar-edizioni
status: done
created: 2026-08-17
owner: travellini-seo-conversion-strategist
slug: navbar-edizioni
type: content-brief
area: delivery
head: chore/config-hardening-2026-07-26
next: travellini-frontend-builder
---

# La lingua della navbar, nelle tre edizioni

Questo documento consegna **stringhe e regole**, non forma. La forma è di
`travellini-ui-designer`, che lavora in parallelo: dove una scelta di lingua
ricade sul suo lavoro l'ho segnalata con **→ designer**.

Vale anche come handoff verso `travellini-frontend-builder`: §8 elenca file,
riga e stringa esatta. Nessun componente è stato toccato.

## 0. Come leggere i tag

| Tag | Significato |
| --- | --- |
| `[MISURATO: file:riga]` | letto nel codice di questo albero, riproducibile aprendo quella riga |
| `[DEDOTTO]` | inferenza; se afferma un impatto porta `Si smentisce se:` |
| `[VERIFY: ...]` | serve una misura che questa sessione non poteva fare (nessun browser, nessuna shell: solo Read/Grep/Glob/Write) |

**Niente qui promette una conversione migliore.** Il sito non è pubblicato e non
esiste un dato di conversione. Gli argomenti sono di **chiarezza** (un'etichetta
dice dove porta) e di **coerenza** (la stessa cosa si chiama in un solo modo):
entrambe si verificano leggendo il codice, non aspettando il traffico.

---

## 1. La regola che genera tutte le altre

Prima di ogni singola stringa, la distinzione da cui discende tutto il resto:

> **Una voce di menu nomina un posto. Un richiamo promette una cosa.**
> Un posto magro si può nominare lo stesso. Una cosa che non esiste non si può promettere.

E la grammatica che tiene insieme le tre edizioni:

> **Ogni voce di menu è un sostantivo o un sintagma nominale.**
> Mai un verbo, mai una frase, mai un nome di marca, mai una promessa commerciale.

Applicata allo stato di oggi:

| Edizione | Voci | Rispettano la regola |
| --- | --- | --- |
| viaggiatori | Mete · Guide e racconti · Mappa · Chi siamo | 4 / 4 |
| family | Travellini Family · Consigli · Codici e sconti · Chi Siamo | 2 / 4 — «Travellini Family» è un marchio, «Codici e sconti» è una promessa commerciale |
| brand | Come Lavoriamo · Chi Siamo · Contatti | 2 / 3 — «Come Lavoriamo» è una proposizione |

L'incoerenza che l'owner ha visto non è di lunghezza né di numero: è che
**viaggiatori parla per sostantivi e le altre due no**.

### La parità non conta. Il ritmo sì.

Domanda esplicita dell'owner: un'edizione può averne meno delle altre?

**Sì, e va bene.** Tre voci in brand non sono un'edizione incompleta: sono
un'edizione che ha tre posti. Forzare una quarta voce per simmetria significa
inventare un posto o promuovere un sotto-elemento — è così che nascono i menu
che si leggono a fatica.

Ciò che deve essere uguale fra le tre non è il conteggio, sono **tre cose
verificabili**: la classe grammaticale (sostantivo), la grafia (frase italiana,
§2) e il tetto di larghezza (§7). Con queste tre allineate, 3-4-4 si legge come
un sistema; con queste disallineate, 4-4-4 si legge come tre menu diversi
incollati.

---

## 2. La grafia unica delle voci condivise

**Regola: frase italiana.** Maiuscola sulla prima parola e sui nomi propri.
Basta. `Chi Siamo` e `Media Kit` sono maiuscole da finestra di dialogo Windows,
non tipografia italiana.

### «Chi siamo» — la grafia è già decisa, il codice non la usa

La forma canonica **esiste già** ed è `Chi siamo`
`[MISURATO: src/config/siteContent.ts:488 — aboutLabel: 'Chi siamo']`. La usano
la breadcrumb `[MISURATO: src/pages/ChiSiamo.tsx:124]`, la ricerca
`[MISURATO: src/components/SearchModal.tsx:80]`, i meta di rotta
`[MISURATO: src/config/routeMeta.ts:70]`, la bio autore
`[MISURATO: src/components/article/AuthorBio.tsx:61]` e il footer
`[MISURATO: src/components/Footer.tsx:187, via navigation.aboutLabel]`.

**Il Title Case esiste in un solo file: `Navbar.tsx`.** Tre stringhe, tutte
scritte a mano invece di leggere il token:

- `[MISURATO: src/components/Navbar.tsx:532]` — barra family
- `[MISURATO: src/components/Navbar.tsx:564]` — barra brand
- `[MISURATO: src/components/Navbar.tsx:920]` — card B2B del drawer mobile

Una precisazione che cambia dove si vede il difetto, e che va detta perché è
esattamente il punto in cui è facile misurare bene e concludere male:

**a 1440 le tre grafie non sono distinguibili a occhio.** Le voci desktop
hanno `uppercase` in classe `[MISURATO: Navbar.tsx:343, 492, 546]`, quindi
rendono tutte `CHI SIAMO`. La differenza è reale nel sorgente, nei test, nel
nome accessibile — **e a schermo nel drawer mobile**, che rende in serif senza
`uppercase` `[MISURATO: Navbar.tsx:775 (text-2xl font-serif), 909 (text-[15px] font-serif)]`.

E lì c'è il caso peggiore, che è dimostrabile con uno screenshot:

> **In edizione brand, il drawer mobile mostra le due grafie insieme.** Le voci
> di menu del drawer sono renderizzate per `audience !== 'family'`
> `[MISURATO: Navbar.tsx:788]`, quindi in brand compare la lista viaggiatori con
> `Chi siamo` (token); e la card B2B è nascosta solo per family
> `[MISURATO: Navbar.tsx:897]`, quindi sotto compare `Chi Siamo`. **Stesso
> drawer, stesso link, due grafie, poche decine di pixel di distanza.**

*(Nota fuori scope-copy: che in edizione brand il drawer mostri il menu
viaggiatori è un difetto di struttura, non di lingua. Lo segnalo qui perché è
la causa del doppione; la correzione è di `travellini-frontend-builder`.)*

**Decisione: `Chi siamo` ovunque, letto da `navigation.aboutLabel`.** Zero
stringhe nuove: il token c'è già.

### Le altre voci nella stessa condizione — cercate, non supposte

Grep su `src/**/*.{ts,tsx}`. Tre casi oltre a «Chi siamo»:

**1. «Media kit» — cinque grafie, ed è il caso peggiore del repo.**

| Grafia | Dove |
| --- | --- |
| `Media kit` ✅ canonica | `siteContent.ts:487` (token) · `routeMeta.ts:81, 84` · `MediaKit.tsx:408, 427` · `Collaborazioni.tsx:203` · `LocalLeadsPanel.tsx:49` |
| `Media Kit` | `Navbar.tsx:607, 937, 961` · `MediaKit.tsx:120` (breadcrumb) · `SearchModal.tsx:88` · `Footer.tsx:231` · `PressProofSection.tsx:85` · `CaseStudiesSection.tsx:299` |
| `Media Kit B2B` | `DiarioConversionSection.tsx:232` |

La pagina si contraddice **dentro se stessa**: la breadcrumb dice `Media Kit`
`[MISURATO: MediaKit.tsx:120]`, l'occhiello sopra l'h1 dice `Media kit`
`[MISURATO: MediaKit.tsx:427]`. Canonica: **`Media kit`**.

**2. «Come lavoriamo» — due grafie e due funzioni diverse.**
`Come Lavoriamo` in navbar `[MISURATO: Navbar.tsx:553, 912]`, `Come lavoriamo`
come titolo di sezione dentro la pagina
`[MISURATO: siteContent.ts:350, Collaborazioni.tsx:236]`. Il conflitto si
dissolve da solo con §4: la stringa di navbar muore.

**3. Le etichette delle edizioni hanno due sorgenti.** Il chip legge
`AUDIENCE_EDITIONS` `[MISURATO: src/config/audienceEditions.ts:24-46]`, il
segmented control del drawer riscrive a mano `Viaggiatori` e `Brand` e legge
`navigation.familyLabel` solo per family `[MISURATO: Navbar.tsx:714-719]`. Due
sorgenti per gli stessi tre nomi: oggi coincidono, domani no. **Il drawer deve
leggere `AUDIENCE_EDITIONS`.**

---

## 3. Le voci, edizione per edizione

Rotte verificate in `[MISURATO: src/App.tsx:124-173]`.

### Viaggiatori — 4 voci, nessuna cambia

| # | Voce | Rotta | Car. | Sorgente |
| --- | --- | --- | --- | --- |
| 1 | **Mete** | `/destinazione` | 4 | `navigation.destinationsLabel` |
| 2 | **Guide e racconti** | `/esplora` | 16 | `navigation.storiesLabel` |
| 3 | **Mappa** | `/mappa` | 5 | `navigation.mapLabel` |
| 4 | **Chi siamo** | `/chi-siamo` | 9 | `navigation.aboutLabel` |

**Perché non tocco niente qui.** L'ordine codifica due assi ortogonali dichiarati
nel codice — DOVE × COSA `[MISURATO: Navbar.tsx:148]` — più uno strumento e
un'identità: `dove → cosa → come → chi`. È già un sistema.

«Guide e racconti» è l'unica etichetta con una «e» dentro, e di norma una «e» in
un menu significa due voci travestite da una. **Qui l'eccezione è giustificata**:
il dropdown contiene davvero Guide, Itinerari, Racconti e Tutti i contenuti
`[MISURATO: Navbar.tsx:179-187]`, e lo stato attivo della voce copre articolo,
guida e itinerario `[MISURATO: Navbar.tsx:253-260]`. L'etichetta descrive
esattamente ciò che c'è sotto.

Resta il fatto che è **la più lunga della barra e diventa il tetto di §7**.

### Family — 4 voci, tre cambiano

| # | Voce oggi | Voce proposta | Rotta | Car. |
| --- | --- | --- | --- | --- |
| 1 | Travellini Family (17) | **Gravidanza** *(decidibile, vedi sotto)* | `/family` | 10 |
| 2 | Consigli | **Consigli** — invariata | `/family/consigli` | 8 |
| 3 | Codici e sconti (15) | **Codici sconto** | `/family/shop` | 13 |
| 4 | Chi Siamo | **Chi siamo** | `/chi-siamo` | 9 |

**Voce 1 — perché «Travellini Family» deve uscire.** Ripete entrambi i vicini:
il marchio `Travelliniwithus` è a sinistra `[MISURATO: Navbar.tsx:306-319]` e il
chip di edizione dice `Family` in mezzo ai due `[MISURATO: AudienceEditionChip.tsx:67]`.
Tre apparizioni del marchio in una manciata di pixel: il primo slot di menu,
quello più prezioso, non porta informazione.

Cosa dovrebbe fare quello slot: nominare la **prima pagina dell'edizione**. Serve
perché il marchio porta a `/` (la home viaggiatori), non a `/family` — ed è
giusto così: il marchio è il sito, non la sezione.

*(Il chip non può sostituirla: da `/family/consigli`, scegliere «Family» nel chip
è un no-op, perché la guardia è `if (!isFamilyRoute) navigate('/family')` con
`isFamilyRoute = startsWith('/family')` `[MISURATO: Navbar.tsx:192, 217-219]`.
In brand invece la guardia è `startsWith('/collaborazioni')`, quindi da
`/media-kit` il chip **naviga** `[MISURATO: Navbar.tsx:211-215]`. Asimmetria
reale, di comportamento: la segnalo a frontend, non la decido io.)*

**Decisione dell'owner — due nomi, entrambi corretti:**

| | **F1 — «Gravidanza»** *(raccomandata)* | **F2 — «Il diario»** |
| --- | --- | --- |
| Perché | è il soggetto reale della pagina: 6 delle 8 voci del seed hanno `category` gravidanza `[MISURATO: src/data/family-content-seed.json:45, 59, 73, 87, 101, 115]`, e l'hero parla di quello `[MISURATO: siteContent.ts:462-463]`. Specifico, cercabile, nella voce di R&B | non scade mai, registro editoriale, copre gravidanza + primi mesi + viaggi |
| Contro | **ha una scadenza**: alla nascita l'etichetta è vecchia | è generico — infrange in parte la regola «specifico batte generico» |
| Mitigazione | è un token: una riga il giorno che serve | — |
| Collisione | nessuna | `diario` è già un concetto della home viaggiatori `[MISURATO: src/components/home/diario/DiarioConversionSection.tsx]` — non è un'etichetta pubblica, ma è vicino |

**Non raccomando la terza opzione (lasciare «Travellini Family»)**, per la
ragione sopra: ripete due volte ciò che ha già accanto.

**Voce 3 — «Codici e sconti» → «Codici sconto».** Due ragioni, entrambe
verificabili: (a) elimina la «e» che fa leggere due categorie dove ce n'è una;
(b) allinea l'ancora al titolo della pagina, che è
`Codici sconto e cose che usiamo` `[MISURATO: siteContent.ts:467]` e il cui
title SEO è `Codici sconto family | Travellini Family`
`[MISURATO: FamilyShop.tsx:26]`. Due caratteri in meno, zero informazione persa.

**Voce 3 nomina una pagina oggi vuota, e va bene lo stesso.** Vedi §1: una voce
di menu nomina un posto. Il posto è magro (§4 lo misura), ma esiste e ha un
percorso. Il problema non è la voce: è il richiamo.

### Brand — 3 voci, una cambia

| # | Voce oggi | Voce proposta | Rotta | Car. |
| --- | --- | --- | --- | --- |
| 1 | Come Lavoriamo (14) | **Collaborazioni** | `/collaborazioni` | 14 |
| 2 | Chi Siamo | **Chi siamo** | `/chi-siamo` | 9 |
| 3 | Contatti | **Contatti** — invariata | `/contatti` | 8 |

**Perché «Collaborazioni» batte «Come Lavoriamo»:**

1. È il nome che la pagina ha già in ogni altro punto del sito: la rotta
   `/collaborazioni` `[MISURATO: App.tsx:147]`, il footer
   `[MISURATO: Footer.tsx:204]`, il token `collaborationsLabel`
   `[MISURATO: siteContent.ts:486]`, e la descrizione dell'edizione nel chip,
   che si apre proprio con quella parola `[MISURATO: audienceEditions.ts:43]`.
   Oggi **la stessa pagina ha due nomi a seconda di dove la guardi**: è il
   difetto di coerenza più grosso della barra, più della grafia di «Chi siamo».
2. È un sostantivo, non una proposizione (§1).
3. «Come lavoriamo» non si perde: **resta dov'era giusto**, come titolo di
   sezione dentro la pagina `[MISURATO: siteContent.ts:350]`. Una proposizione
   è un buon titolo e una cattiva voce di menu.
4. Costo di spazio: **zero o quasi.** Entrambe 14 caratteri; «Collaborazioni»
   non ha lo spazio, quindi è marginalmente più larga `[DEDOTTO]`. `Si smentisce
   se: la sonda §7 misura oltre i 178px a 1440, nel qual caso la barra brand ha
   comunque il margine più ampio delle tre — 3 voci contro 4.`

**Ordine invariato**: cosa facciamo → chi siamo → come ci si scrive. Un partner
legge in quest'ordine, e la sequenza è la stessa promessa che fa la pagina
`/collaborazioni`.

---

## 4. I tre richiami

### Cosa promettono oggi

| Edizione | Richiamo | Rotta | Cosa trova chi clicca |
| --- | --- | --- | --- |
| viaggiatori | La guida in regalo | `/guida-in-regalo` | il PDF «Alla scoperta dell'Italia nascosta», 10 posti provati, in cambio dell'email `[MISURATO: VieniConNoi.tsx:160-161]` |
| family | Codici e sconti | `/family/shop` | **niente** — vedi sotto |
| brand | Richiedi Media Kit | `/media-kit` | un modulo di richiesta, riscontro dichiarato entro 48 ore `[MISURATO: MediaKit.tsx:650, 800]` |

**Il richiamo family promette codici che non esistono.**
`getFamilyDeals()` filtra le voci con un campo `deal`
`[MISURATO: src/config/familyLibrary.ts:24-26]`; nel seed **la stringa `"deal"`
non compare nemmeno una volta**
`[MISURATO: grep '"deal"' su src/data/family-content-seed.json → 0 occorrenze]`.
Quindi `/family/shop` rende oggi lo stato vuoto: «I primi codici family arrivano
con le prossime collaborazioni» `[MISURATO: FamilyShop.tsx:47, 61-68]`.

E il sito **lo sa già e si copre da solo altrove**: la home family scrive
`${dealsCount} codici attivi` se ce ne sono, e ripiega su «Apri la vetrina» se
non ce ne sono `[MISURATO: FamilyHome.tsx:119]`. La barra è l'unico posto dove
la stessa promessa esce **senza rete**, e per di più è l'elemento più permanente
del sito: sta su ogni pagina, sempre.

Questo è anche il vero motivo del doppione notato dall'owner. La stessa stringa
`navigation.familyShopLabel` è renderizzata **due volte nella stessa barra**, come
voce di menu `[MISURATO: Navbar.tsx:521]` e come richiamo primario
`[MISURATO: Navbar.tsx:615]`, e una terza volta nel drawer
`[MISURATO: Navbar.tsx:952]`.

### La regola delle sorelle

> **Articolo determinativo + sostantivo che nomina una cosa che esiste.
> Nessun verbo. Massimo 18 caratteri.**

Il verbo esce perché il richiamo nomina l'oggetto e la **pagina** fa la domanda.
`/media-kit` ha già il proprio bottone «Richiedi il media kit»
`[MISURATO: MediaKit.tsx:456, 788]`: metterlo anche in barra fa chiedere due
volte, e trasforma la testata in un modulo.

| Edizione | Richiamo | Rotta | Car. | Stato |
| --- | --- | --- | --- | --- |
| viaggiatori | **La guida in regalo** | `/guida-in-regalo` | 18 | invariato |
| family | **nessuno** *(vedi sotto)* | — | — | il bottone esce dalla barra |
| brand | **Il media kit** | `/media-kit` | 12 | da «Richiedi Media Kit» |

Lette in fila: *La guida in regalo · Il media kit*. Stessa struttura, stesso
registro, ciascuna nomina un documento reale, e la parola che porta il prezzo
sta dentro il nome («in regalo») invece che in un'esclamazione accanto.

### Family: perché il richiamo esce, e cosa lo riaccende

**Raccomandazione: nessun bottone in barra finché `getFamilyDeals()` è vuoto.**

Non è pudore: è che nessuna riscrittura risolve il problema. «Codici e sconti»,
«I codici attivi», «La vetrina» — tutte promettono un contenuto che la pagina non
ha. E le due alternative che ho considerato cadono entrambe:

- **puntare a `/family/consigli`** → ricrea il doppione, perché «Consigli» è già
  voce di menu. Si sposta il difetto, non si toglie;
- **puntare a Instagram** → un link fuori sito nel controllo più permanente del
  sito. No.

**La condizione che riaccende il bottone è verificabile, non opinabile:** una
voce con campo `deal` in `src/data/family-content-seed.json`. Da quel momento la
stringa è pronta:

> **`I codici attivi`** → `/family/shop` (15 car.)

Sorella delle altre due, e riecheggia il contatore che la home family già
calcola `[MISURATO: FamilyHome.tsx:119]`.

**→ designer:** una barra a tre edizioni in cui una non ha bottone è una
decisione di forma che ti arriva da qui. La leva che ti lascio: family è anche
l'edizione con il menu più leggero dopo la cura (§7), quindi lo spazio a destra
può respirare invece di ospitare un bottone finto.

**→ owner, decisione che non è di copy:** se family debba avere un proprio
regalo-in-cambio-di-email — l'equivalente della guida per i viaggiatori — è una
scelta di offerta, non di lingua. Va a
`travellini-growth-revenue-operator`. È l'unica cosa che rende le tre sorelle
davvero simmetriche: oggi due su tre sono raccolte di contatto e la terza è un
link a uno scaffale.

### Brand: la variante col verbo, se l'owner la preferisce

`Chiedi il media kit` (19 car.) mantiene il verbo e resta sotto il costo attuale
di `Richiedi Media Kit` (18 car. ma con l'icona `Send` accanto,
`[MISURATO: Navbar.tsx:606]`). **Non è la mia raccomandazione** — rompe la
simmetria con «La guida in regalo» — ma è difendibile se l'owner vuole che la
barra dichiari che lì si compila qualcosa.

---

## 5. Le etichette delle edizioni nel commutatore

Oggi: `Viaggiatori` · `Family` · `Brand`, con le descrizioni migrate
dall'interstiziale `[MISURATO: src/config/audienceEditions.ts:24-46]`.

### I tre nomi reggono. Uno è una decisione di posizionamento aperta.

**`Viaggiatori`** — resta. È il lettore, è la parola più larga possibile senza
diventare vuota.

**`Family`** — resta in inglese. Non è un anglicismo pigro: è il nome pubblico
reale del sub-brand, `@travellinifamily`
`[MISURATO: docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md:17]`. Tradurlo
romperebbe il riconoscimento fra Instagram e sito.

**`Brand`** — **decisione dell'owner, e va detto che qui il codice ha già
scavalcato un documento.** `DESIGN_commutatore-pubblico.md` §10 aveva deciso
«Collaborazioni» e dichiarato morte le altre; l'implementazione ha spedito
`Brand` con un commento che lo dà per nome unico
`[MISURATO: audienceEditions.ts:19-23]`. Nessuno dei due è sbagliato, ma non
possono valere insieme.

| | **B1 — «Brand» nel chip** *(raccomandata)* | **B2 — «Collaborazioni» nel chip** |
| --- | --- | --- |
| Grammatica del set | *Viaggiatori · Family · Brand* → tre **lettori**. Coerente | *Viaggiatori · Family · Collaborazioni* → due lettori e una sezione. Registro misto |
| Ambiguità | «brand» qui può leggersi come *il nostro* brand — attenuata dall'occhiello «Edizione» sopra le tre righe `[MISURATO: AudienceEditionChip.tsx:87]` | nessuna |
| Costo | zero: è ciò che gira | rinomina + il chip finirebbe a dire la stessa parola della voce di menu §3 |

**B1 funziona solo insieme a §3**: il chip nomina **chi legge** (Brand), la voce
di menu nomina **la pagina** (Collaborazioni). Sono due lavori diversi e con due
parole diverse smettono di competere. Con «Come Lavoriamo» al posto di
«Collaborazioni», invece, la terza edizione ha ancora tre nomi.

### Le descrizioni: due su tre reggono, una nomina una rotta morta

| Edizione | Descrizione | Verdetto |
| --- | --- | --- |
| viaggiatori | «Posti particolari provati di persona: **atlante**, mappa e come ci siamo andati.» | **da correggere** |
| family | «Gravidanza, viaggi col pancione e — presto — col piccolo.» | tenere verbatim |
| brand | «Collaborazioni, media kit e come lavoriamo con i partner.» | tenere verbatim |

**`atlante` non è più una superficie del sito**: `/atlante` reindirizza alla home
`[MISURATO: App.tsx:127 — <Route path="atlante" element={<Navigate to="/" replace />} />]`.
La descrizione elenca tre cose e la prima non esiste. Correzione minima, una
parola, allineata alle voci di menu che il lettore vedrà un istante dopo:

> **«Posti particolari provati di persona: mete, mappa e come ci siamo andati.»**
> (74 car.)

Le altre due non si toccano: sono specifiche, italiane, e family è l'unica frase
della barra che dica una cosa vera e datata sulle persone che scrivono.

**Occhiello `Edizione`** — resta. È il sostantivo giusto: «modalità» è lingua da
impostazioni di sistema, «edizione» è lingua editoriale ed è ciò che il sito
effettivamente fa.

---

## 6. Cosa NON deve comparire in barra

Una barra premium si riconosce da cosa esclude. Sette cose, in ordine di quanto
sono difendibili.

**1. Il badge `⌘K` / `Ctrl+K`** `[MISURATO: Navbar.tsx:595-597]`. È arredo da
sviluppatore su un sito che si legge. La scorciatoia continua a funzionare, è
registrata sulla finestra `[MISURATO: Navbar.tsx:123-133]`, e si può dichiarare
dentro `SearchModal`. *Nota: la rimozione era la precondizione dichiarata per
far entrare il chip di edizione — il chip è entrato, il badge è ancora lì.*

**2. Il nome del marchio ripetuto** — «Travellini Family» a pochi pixel dal
marchio e dal chip (§3).

**3. La stessa stringa due volte con due pesi** — `familyShopLabel` come voce e
come richiamo (§4). Chi legge non sa quale delle due conti, e la risposta è che
contano uguale, il che è peggio.

**4. Verbi e proposizioni** — «Come Lavoriamo», «Richiedi Media Kit»,
«Personalizza esperienza». Una voce di menu che contiene un verbo suggerisce che
l'azione avvenga nella barra. Non avviene: si apre una pagina.

**5. Il Title Case** — §2. È tipografia di sistema, non italiana. Si vede nel
drawer, nel sorgente, nei test e nel nome accessibile.

**6. Un bottone che promette un contenuto assente** — §4.

**7. La parola «Cerca» accanto alla lente** `[MISURATO: Navbar.tsx:594]`. La
lente è una convenzione capita ovunque; la parola è una didascalia della propria
icona. **→ designer:** è tuo, non mio — lo elenco perché è lingua ridondante, ma
la decisione dipende dal peso visivo del cluster destro. L'`aria-label` resta in
ogni caso `[MISURATO: Navbar.tsx:588]`.

### Due correzioni nel drawer, stessa famiglia di difetti

**«Personalizza esperienza»** `[MISURATO: Navbar.tsx:756]` non dice cosa
personalizza, ed è un verbo. Porta a `InterestPicker`, il cui titolo è
**«Cosa cerchi oggi?»** `[MISURATO: InterestPicker.tsx:49]`. Un link dovrebbe
nominare la propria destinazione:

> **`Cosa cerchi oggi`** (16 car., senza punto interrogativo: è un'etichetta,
> non una domanda). L'ancora `#personalizza-esperienza` non cambia.

*(A margine: l'occhiello dello stesso blocco dice «Esperienza su misura»
`[MISURATO: InterestPicker.tsx:43]`, che è vocabolario da agenzia. Fuori dallo
scope navbar — lo lascio scritto perché è la prossima riga da sistemare.)*

**Il segnaposto della ricerca** dice «Cerca destinazioni, storie, guide...»
`[MISURATO: Navbar.tsx:699]`, ma il menu chiama quel formato **Racconti**
`[MISURATO: Navbar.tsx:183]`. Allineare: **«Cerca mete, racconti, guide…»**
(l'ellissi tipografica al posto dei tre punti).

---

## 7. Il budget di larghezza

**Le due misure dell'owner sono l'unica verità di questo paragrafo**: a 1440,
«Guide e racconti» = 174px, «Come Lavoriamo» = 173px. Da lì, un modello grezzo
`[DEDOTTO]`: **≈40px di cornice per voce + ≈9px per carattere** a 1280/1440.
Riproduce 183 contro 174 (+5%) e 169 contro 173 (−2%). Errore ≤5%: basta per
decidere «ci sta», non per impaginare. A 1024 il corpo scende a 9,5-10px
`[MISURATO: Navbar.tsx:343, 492, 546]`, quindi ≈ ×0,82.

**Il tetto operativo: 16 caratteri.** È «Guide e racconti», la più lunga che
oggi spedisce e che l'owner ha misurato. Nessuna etichetta nuova la supera;
obiettivo ≤14.

| Etichetta proposta | Car. | Sotto il tetto |
| --- | --- | --- |
| Gravidanza · Consigli · Codici sconto · Chi siamo | 10 · 8 · 13 · 9 | sì |
| Collaborazioni · Chi siamo · Contatti | 14 · 9 · 8 | sì |
| Il media kit *(richiamo)* | 12 | sì |
| Cosa cerchi oggi *(drawer)* | 16 | al tetto |

**Bilancio, per edizione** `[DEDOTTO col modello sopra]`:

| Edizione | Caratteri di menu oggi → proposti | Effetto |
| --- | --- | --- |
| viaggiatori | 34 → 34 | invariato |
| family | 49 → 40 | **≈80px liberati** sul menu |
| brand | 31 → 31 | invariato sul menu |

Più, sui richiami: brand ≈50px liberati (18→12 caratteri, e senza l'icona
`Send`); family libera l'intero bottone, ≈180px.

**Nessuna edizione diventa più larga.** È la proprietà che conta, perché il
budget reale non lo conosco:

`[VERIFY: lo spazio libero effettivo a 1024 e 1280 con il chip montato. La nota
di correzione in DESIGN_commutatore-pubblico.md dichiara 66px liberi a ogni
larghezza desktop, chip 130px, bottone account 32px — i conti non tornano (66+32
< 130) e il badge ⌘K, che doveva uscire come precondizione, è ancora in barra a
Navbar.tsx:595-597. Prima di trattare qualunque numero di questo paragrafo come
sicuro va rifatta la sonda §11 di quel documento, a 320/375/768/1024/1280/1440
su /, /family e /collaborazioni.]`

---

## 8. Il diff, per `travellini-frontend-builder`

Nessun file toccato da me. Stringhe esatte.

### `src/config/siteContent.ts`

| Riga | Da | A |
| --- | --- | --- |
| 479 | `familyShopLabel: 'Codici e sconti'` | `familyShopLabel: 'Codici sconto'` |
| — | *(nuovo)* | `familyHomeLabel: 'Gravidanza'` — o `'Il diario'`, secondo §3 |

Aggiungere `familyHomeLabel` a `SiteContentNavigation` (vicino a riga 147) **e**
al blocco `fields` della definizione `navigation` (righe 759-779). **Nota:**
`familyLabel`, `familyAdviceLabel` e `familyShopLabel` esistono nel tipo ma
**non** in `fields` `[MISURATO: siteContent.ts:759-779]`, quindi oggi non sono
editabili da `/admin/site-content/navigation`. Se si aggiunge la nuova, tanto
vale aggiungere anche le tre esistenti.

### `src/components/Navbar.tsx`

| Riga | Da | A |
| --- | --- | --- |
| 499 | `<span>Travellini Family</span>` | `<span>{navigation.familyHomeLabel}</span>` |
| 532 | `<span>Chi Siamo</span>` | `<span>{navigation.aboutLabel}</span>` |
| 553 | `<span>Come Lavoriamo</span>` | `<span>{navigation.collaborationsLabel}</span>` |
| 564 | `<span>Chi Siamo</span>` | `<span>{navigation.aboutLabel}</span>` |
| 575 | `<span>Contatti</span>` | `<span>{navigation.contactsLabel}</span>` *(stessa stringa, toglie l'ultimo hardcode)* |
| 595-597 | `<kbd>…{isMac ? '⌘K' : 'Ctrl+K'}</kbd>` | rimuovere (§6.1) |
| 601-608 | ramo `audience === 'brand'` → `Richiedi Media Kit` | `Il media kit` *(valutare se l'icona `Send` resta: nomina un documento, non un invio)* |
| 609-616 | ramo `audience === 'family'` → `/family/shop` | rimuovere il ramo; family non ha richiamo in barra (§4) |
| 699 | `Cerca destinazioni, storie, guide...` | `Cerca mete, racconti, guide…` |
| 714-719 | array switcher con `'Viaggiatori'` e `'Brand'` a mano | leggere da `AUDIENCE_EDITIONS` (§2.3) |
| 756 | `Personalizza esperienza` | `Cosa cerchi oggi` |
| 764 | `{ name: 'Travellini Family', … }` | `{ name: navigation.familyHomeLabel, … }` |
| 767 | `{ name: 'Chi siamo', … }` | `{ name: navigation.aboutLabel, … }` |
| 912 | `Come Lavoriamo` | `{navigation.collaborationsLabel}` |
| 920 | `Chi Siamo` | `{navigation.aboutLabel}` |
| 929 | `Contatti` | `{navigation.contactsLabel}` |
| 937 | `Richiedi Media Kit` | `Il media kit` |
| 946-954 | ramo drawer family → `/family/shop` | rimuovere; il richiamo family esce anche dal drawer |
| 961 | `Richiedi Media Kit` | `Il media kit` |

### `src/config/audienceEditions.ts`

| Riga | Da | A |
| --- | --- | --- |
| 29 | `'Posti particolari provati di persona: atlante, mappa e come ci siamo andati.'` | `'Posti particolari provati di persona: mete, mappa e come ci siamo andati.'` |

### Fuori navbar — la sweep «Media kit», da fare o da schedulare

Nove stringhe con la grafia sbagliata, tutte banali
`[MISURATO: grep 'Media [Kk]it' su src/**/*.{ts,tsx}]`:

`MediaKit.tsx:120` · `SearchModal.tsx:88` · `Footer.tsx:231` ·
`PressProofSection.tsx:85` · `CaseStudiesSection.tsx:299` ·
`DiarioConversionSection.tsx:232` (+ le tre di Navbar già sopra).
In tutte: `Media Kit` → `Media kit`.

*(`src/pdf/MediaKitDocument.tsx:187, 189, 193` è il PDF: «Travelliniwithus Media
Kit» è il titolo del documento, un nome proprio. **Non toccare.**)*

### Test

`npm run typecheck` · `npm run audit:ui` · `npm run test` · `npm run audit:visual`.

**Nessun test si rompe** `[MISURATO: src/components/Navbar.test.tsx:62-116]`.
Le asserzioni toccano solo l'edizione viaggiatori — `Mete`, `Guide e racconti`,
`Mappa`, `/Chi siamo/i` (case-insensitive), `La guida in regalo` — e nessuna di
quelle stringhe cambia. Nessuna asserzione su family, brand o `Richiedi Media
Kit`.

**Da aggiungere insieme al diff**, perché oggi non c'è rete su questo: un test
che monti la navbar nelle tre edizioni e verifichi che il testo `Chi siamo`
compaia con una sola grafia. È il difetto che si è ripresentato tre volte in un
file solo.

---

## 9. La metà SEO

La navbar è il blocco di link interni più ripetuto del sito: sta su ogni pagina.
Il testo delle sue ancore è quindi il segnale più costante che diamo su cosa sia
ciascuna pagina. Tre effetti **verificabili** (nessuno è una promessa di
posizionamento):

1. **`/collaborazioni` smette di avere due ancore diverse.** Oggi riceve
   «Come Lavoriamo» dalla navbar e «Collaborazioni» dal footer. Dopo: una sola,
   uguale allo slug, al token e all'occhiello della pagina.
2. **`/family/shop` allinea l'ancora al proprio title.** «Codici sconto» ↔
   `Codici sconto family | Travellini Family` `[MISURATO: FamilyShop.tsx:26]`.
3. **`/chi-siamo` riceve una sola grafia** da tutte e tre le edizioni e dal
   drawer.

Nessun `schema.org` cambia: la navbar non emette dati strutturati e non deve
farlo — `SiteNavigationElement` non è un tipo che Google usi in modo
documentato, e aggiungerlo sarebbe peso senza ritorno. La breadcrumb resta il
solo dato strutturato di navigazione, per pagina.

---

## 10. Rischi e cose che restano aperte

| Rischio | Chi lo chiude |
| --- | --- |
| «Gravidanza» scade alla nascita | owner, con un token: scelta consapevole, non svista (§3) |
| family senza bottone in barra è un problema di forma a tre edizioni | `travellini-ui-designer` (§4) |
| il budget di larghezza è ereditato da una misura che non torna | sonda in browser, `travellini-frontend-builder` (§7) |
| se family debba avere un proprio lead magnet | `travellini-growth-revenue-operator` — è offerta, non lingua (§4) |
| in edizione brand il drawer mobile mostra il menu viaggiatori | `travellini-frontend-builder` — struttura, non copy (§2) |
| il chip non riporta alla prima pagina in family ma sì in brand | `travellini-frontend-builder` — comportamento, non copy (§3) |

## 11. Le tre decisioni dell'owner

1. **§3 — la prima voce family**: `Gravidanza` *(raccomandata, specifica, scade)*
   oppure `Il diario` *(durevole, generica)*.
2. **§4 — il richiamo family**: nessun bottone finché non c'è un `deal`
   *(raccomandato)*; oppure aprire il lavoro «lead magnet family» con
   growth-revenue-operator.
3. **§5 — l'etichetta della terza edizione**: `Brand` nel chip *(raccomandato,
   con `Collaborazioni` come voce di menu)* oppure `Collaborazioni` nel chip,
   come aveva deciso `DESIGN_commutatore-pubblico.md` §10 prima che
   l'implementazione scegliesse altrimenti.
