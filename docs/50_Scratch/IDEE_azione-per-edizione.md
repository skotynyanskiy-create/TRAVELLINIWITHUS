---
title: IDEE_azione-per-edizione
status: active
created: 2026-08-17
owner: travellini-growth-revenue-operator
slug: azione-per-edizione
type: scratch
area: growth
head: chore/config-hardening-2026-07-26
related:
  - '[[50_Scratch/COPY_navbar-edizioni]]'
  - '[[50_Scratch/DESIGN_navbar-premium]]'
  - '[[20_Decisions/DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24]]'
next: owner
---

# Lo slot azione, edizione per edizione

Brainstorm, non audit. Tre proposte, non dieci idee.

Arriva da `COPY_navbar-edizioni.md` §4 e §11.2, che chiude così: «se family debba
avere un proprio regalo-in-cambio-di-email è una scelta di offerta, non di lingua.
Va a `travellini-growth-revenue-operator`». Questo documento risponde.

## 0. Come leggere i tag

| Tag | Significato |
| --- | --- |
| `[MISURATO: file:riga]` | letto in questo albero, riproducibile aprendo quella riga |
| `[DEDOTTO]` | inferenza; se afferma un impatto porta `Si smentisce se:` |
| `[VERIFY: ...]` | serve un dato che solo l'owner ha |

**Nessun numero di conversione compare qui.** Il sito non è pubblicato: qualunque
tasso sarebbe inventato. Ogni proposta porta invece una **verifica senza
traffico** — uno stato del sito o del mondo che si può guardare e dire sì o no.

---

## 1. Prima di rispondere su family: guardare viaggiatori

La domanda arriva con una premessa — «due su tre raccolgono un contatto, il terzo
è vuoto». La premessa è vera sul meccanismo e **falsa sulla sostanza**, e la
correzione cambia l'ordine delle cose da fare.

### Cosa consegna davvero «La guida in regalo»

Il richiamo dei viaggiatori porta a `/guida-in-regalo`, che promette
**«10 posti provati e consigliati da noi — non un algoritmo, non una classifica»**
`[MISURATO: src/pages/VieniConNoi.tsx:181]`. In cambio dell'email arriva
`public/lead-magnet-posti-italiani.pdf`, generato da un elenco di dieci luoghi
scritto nel codice `[MISURATO: scripts/generate-lead-magnet.tsx:13-133]`:

> Specchia · Tricase Porto · Acaya · Vico del Gargano · Scanno · Rasiglia ·
> Castelluccio di Norcia · Lago di Tovel · Val di Funes · Bosa

Ho cercato tutti e dieci i nomi nei due archivi che il sito considera prova:

- `src/data/instagram-corpus.json` (1.283 post) → **0 occorrenze**
  `[MISURATO: grep dei 10 nomi → nessun match]`
- `src/data/content-seed.json` (il registro dei posti) → **0 occorrenze**
  `[MISURATO: stesso grep → nessun match]`

Il commento sopra l'elenco lo dice da solo: «Selezione editoriale **pronta per
revisione R+B** prima della promozione in bio» `[MISURATO:
generate-lead-magnet.tsx:12]`. Quella revisione non risulta avvenuta: il backlog
tiene ancora aperta la voce P2 #12 «Compilare il PDF con luoghi reali», effort L
`[MISURATO: PROJECT_BACKLOG_UNICO_2026-07-31.md §2, P2]`. E l'handoff che generò
la selezione è `status: obsolete` e propone **dieci luoghi diversi da questi** —
Matera, Marzamemi, Civita di Bagnoregio, Procida, Apricale, Cividale
`[MISURATO: HANDOFF_lead-magnet_F1.10_editorial-writer_to_owner.md:39-48]`. Due
liste da dieci, nessuna delle due ancorata all'archivio.

**Quindi**: `[DEDOTTO]` il PDF non è una guida di posti provati, è una selezione
editoriale mai verificata. `Si smentisce se: R&B confermano di esserci stati
davvero — un viaggio senza post, o raccontato in storie, non entra nel corpus. In
quel caso il problema non è il contenuto ma la prova: la guida resta com'è e
guadagna una riga «ci siamo stati a …».`

C'è un dettaglio che rende la cosa quasi comica, ed è la ragione per cui la
segnalo qui e non in un bug: durante il rework della landing sono stati rimossi
dalla home quattro nomi di posti (Procida, Maremma, Val d'Orcia, Cilento) perché
«nessuno dei 4 posti nominati è tra i 10 posti reali della guida: **errore
fattuale**, non solo di posizionamento» `[MISURATO:
HANDOFF_lead-magnet-rework_frontend_to_gate.md:50-56]`. Si è controllato il
teaser contro il PDF. Non si è mai controllato il PDF contro l'archivio.

### Cosa cambia nella domanda

Non è «due azioni oneste e una casella vuota». È:

| Edizione | Slot | Stato reale |
| --- | --- | --- |
| viaggiatori | La guida in regalo | **pieno, e non dimostrabile** |
| family | *(niente)* | **vuoto, e onesto** |
| brand | Il media kit | **pieno, e dimostrabile** — il PDF esiste, il modulo chiede azienda, focus, budget, periodo e brief `[MISURATO: MediaKit.tsx:110-113, 141-148]`, e dichiara riscontro in 48 ore |

Lo slot vuoto è **il più sano dei tre**. La scelta dell'owner di lasciarlo vuoto
invece di promettere codici inesistenti è esattamente il criterio che, applicato
a viaggiatori, dice che quel PDF non è pronto a partire.

E ribalta l'urgenza. Uno slot vuoto non fa danno a nessuno: chi arriva in family
non riceve una promessa. Una guida che dice «provati da noi» e non lo dimostra
parte **nel bio link, verso il pubblico più grande che il progetto ha**, il
giorno stesso della pubblicazione. È il primo documento che 172K persone
riceverebbero `[MISURATO: src/config/site.ts:28 — instagramFollowers '172K']`.

---

## 2. Sorelle no: due parlano a lettori, una parla a un compratore

Risposta secca alla seconda domanda: **è una differenza da rivendicare, non una
simmetria da completare.**

Il motivo non è estetico. Le tre edizioni hanno tre economie diverse, e una sola
delle tre ha il sito come collo di bottiglia:

- **brand** — le collaborazioni arrivano già, e sono pagate. Il media kit non
  serve a *generarle*: serve a **qualificarle prima che rubino tempo**. Il modulo
  chiede budget e periodo obbligatori `[MISURATO: MediaKit.tsx:141-148]`: è un
  filtro, non un amo. Un documento è lo strumento giusto perché il lettore è un
  compratore e sta valutando un acquisto.
- **viaggiatori** e **family** — il lettore non compra niente. Il lead magnet gli
  chiede l'email prima di avergli dato una ragione, su un sito dove ci sono già
  **79 schede complete con foto vera, coordinate, data e prezzo dichiarato**
  `[MISURATO: PROJECT_BACKLOG_UNICO §8, tranche 4]`. Il regalo compete col
  gratuito che c'è già.

Forzare la simmetria significa costruire un secondo lead magnet per family — cioè
un PDF su gravidanza e viaggio, scritto da due persone che in queste settimane
hanno la banda più bassa dell'anno. **Non lo raccomando**, ed è la prima cosa che
ho scartato.

La simmetria che invece regge è di un'altra classe, e la propongo in §5.

---

## 3. Proposta A — La condizione esatta che riaccende family, e chi la produce

**Ipotesi**: i codici family non arrivano da una pipeline partner nuova; arrivano
da due marchi che hanno già pubblicato con R&B e che si contattano con due
messaggi diretti.

### Il «finché» ha già due nomi e una data

Il seed family dichiara due rapporti `gifted`, con l'handle scritto dentro:

| Voce | Partner | Cosa | Riga |
| --- | --- | --- | --- |
| `volare-in-gravidanza` | `@solvea.official` | leggings premaman | `[MISURATO: family-content-seed.json:18]` |
| `borsa-ospedale-teddybag` | `@teddybag.official` | borsa per l'ospedale | `[MISURATO: family-content-seed.json:32]` |

Un rapporto gifted che ha **già prodotto un reel pubblicato** è il contesto più
economico che esista per chiedere un codice: non è un'offerta commerciale, è la
coda naturale di una collaborazione andata bene. Il messaggio è una riga: *il
reel è uscito, la scheda è online sul sito, ci dai un codice per chi legge?*

**Chi la produce**: R&B, due DM. **Effort onesto: 30-40 minuti**, quasi tutti di
attesa. Poi servono quattro campi da ricopiare — codice, URL, scadenza, termini —
`[MISURATO: src/types/content.ts:145-157]`, e la scheda si aggiorna in place.

### Il cancello dichiarato dice 3, i partner disponibili sono 2

`surfaces.ts` tiene `/family/shop` in `preview` con
`missing: 'codici sconto family reali e attivi (≥3 deal)'`
`[MISURATO: src/config/surfaces.ts:47-51]`, e il 3 viene dalla decisione del
2026-07-24 `[MISURATO: DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24, punto 5]`.

Con due sì si arriva a due. Le uscite sono tre, e sono tutte legittime:

1. un terzo partner family reale — è la sola che costa lavoro nuovo;
2. l'owner abbassa il cancello a 2 **con una motivazione scritta** nella
   decisione: due codici veri su una vetrina che si chiama «Codici sconto» sono
   una vetrina magra, non una vetrina falsa;
3. il cancello resta a 3 e la vetrina resta `preview` finché non lo raggiunge.

Non decido io fra 2 e 3: è il numero che l'owner ha scritto in una decisione, e
cambiarlo è cambiare la decisione. Ma **il cancello va guardato prima di mandare
i DM**, non dopo, perché altrimenti due sì producono comunque zero pagina.

### Il difetto che va corretto PRIMA del primo codice

Questo è il pezzo che nessun documento dice, e che si rompe da solo in una data
che nessuno ha in calendario.

- `getFamilyDeals()` filtra su `Boolean(item.deal)` e basta
  `[MISURATO: src/config/familyLibrary.ts:24-26]`
- `validUntil` è **obbligatoria** sul tipo `deal`
  `[MISURATO: src/types/content.ts:151-155]`
- `DealCard` **non renderizza nulla** quando la scadenza è passata
  `[MISURATO: src/components/DealCard.tsx:46]`

Quindi il giorno in cui l'ultimo codice scade, senza che nessuno tocchi niente:

- la home family continua a scrivere «2 codici attivi»
  `[MISURATO: src/pages/FamilyHome.tsx:119]`;
- `/family/shop` renderizza **l'etichetta di categoria con il vuoto sotto** — la
  riga «Gravidanza · Gifted · @solvea.official» resta, la card dentro torna
  `null` `[MISURATO: FamilyShop.tsx:49-58 + DealCard.tsx:46]`;
- e il bottone in barra, se ripristinato sulla condizione scritta oggi nel
  commento `[MISURATO: src/components/Navbar.tsx:265-269]`, torna a promettere
  codici inesistenti — **esattamente il difetto che l'owner ha appena chiuso a
  mano**.

**La condizione che riaccende lo slot non è `deal`, è `deal && non scaduto`**, e
deve stare in un solo posto letto da tutti e tre i punti. Una funzione
`isDealActive(deal)` accanto a `getFamilyDeals()`, e `getFamilyDeals()` che
filtra anche quella. È lavoro di `travellini-frontend-builder`, ~1h, zero
decisioni aperte. Senza, la riaccensione ha una scadenza silenziosa incorporata.

### La scheda

- **Test più piccolo**: due DM. Non una pipeline, non un media kit family, non
  una tariffa.
- **Verifica senza traffico**: la `DealCard` rende con codice, URL e scadenza
  veri; il contatore della home family coincide con le card sullo scaffale;
  `npm run audit:ui` e `audit:visual` passano. Sono stati del sito, guardabili.
- **Criterio di stop**: se dopo 14 giorni nessuno dei due marchi ha dato un
  codice, **lo slot non si riapre e la domanda cambia**. Vuol dire che il
  rapporto gifted non regge una richiesta commerciale — che è di per sé
  un'informazione utile — e l'azione family diventa la Proposta B.
- **Effort R&B**: 30-40 min. Più ~1h di frontend per `isDealActive`.
- **Rischio di brand**: un codice ottenuto per cortesia da un marchio che R&B non
  userebbero più. Un codice è un consiglio con dentro un interesse: se il
  prodotto non è ancora in uso oggi, il codice non si chiede. Vale soprattutto
  per la borsa ospedale, che è un oggetto da usare **una volta**.

---

## 4. Proposta B — L'azione di family è una domanda, non un codice

**Ipotesi**: quello che una lettrice incinta vuole da Betta non è uno sconto; è
la risposta a una domanda che nessuna listicle le dà, e che Betta ha perché
l'ha fatto.

### Perché proprio questo, e perché family

Delle 8 voci del seed, **una sola ha un corpo vero**: `volare-in-gravidanza`, con
cinque punti operativi — certificato dopo la 28ª settimana, modulo Ryanair
compilato dal ginecologo, priorità ai controlli, calze a compressione oltre le 4
ore, cintura sotto il pancione `[MISURATO: family-content-seed.json:7-13]`. Le
altre sette hanno excerpt e cover, nessun corpo
`[MISURATO: stesso file — campo body presente in 1 voce su 8]`.

Quel corpo è l'unica cosa nell'edizione family che risponde a una domanda invece
di raccontare un momento. Ed è **la prova che il formato giusto per questa
edizione è la risposta**, non il download.

Uno slot che chiede una domanda fa tre cose insieme, e nessuna delle tre richiede
che il sito abbia traffico per essere utile:

1. raccoglie un contatto **con l'intento scritto dentro** — non un'email nuda;
2. produce il **brief editoriale** della prossima voce family, che oggi non
   esiste (il calendario family non ha una coda);
3. crea la prova per la conversazione con un partner futuro: *ci arrivano N
   domande al mese su X*. È il materiale che
   `MARKETING_OPERATIONS_HUB` chiede come precondizione all'outreach
   `[MISURATO: MARKETING_OPERATIONS_HUB.md, «Quality bar partner outreach»]`.

È l'unica azione che **produce altra se stessa**. Un lead magnet consuma; una
domanda alimenta.

### Cosa serve perché esista

Poco, e nulla di nuovo lato backend:

- il modulo contatti accetta già un `topic` da querystring e lo invia a
  `/api/contact-lead` `[MISURATO: src/pages/Contatti.tsx:43-46, 177, 198]`;
- esiste già un pannello admin che legge i lead salvati in fallback
  `[MISURATO: src/components/admin/LocalLeadsPanel.tsx]`;
- `trackEvent('contact_submit_success', { topic })` è già mappato su `Lead` per
  i pixel `[MISURATO: src/services/analytics.ts:121, 133]`.

Il blocco vive **in fondo a `/family/consigli`**, non in barra: due campi (la
domanda, l'email), stesso endpoint, `topic: 'family'`. `travellini-frontend-builder`,
~3h. Il copy è di `travellini-seo-conversion-strategist`, ~1h.

### Il vincolo che decide se si può fare

**R&B devono rispondere.** È l'unico costo vero, ed è ricorrente: ~20 minuti a
domanda, onestamente. Da cui due conseguenze non negoziabili:

- il blocco deve promettere **una risposta pubblica, non una privata**: «le
  domande più frequenti diventano un consiglio qui» e non «ti rispondiamo».
  Una casella di domande senza risposta è **peggio di uno slot vuoto**, perché
  rompe una promessa fatta a una persona con un nome, non a un visitatore
  anonimo;
- non si apre questa settimana. Vedi §6.

### La scheda

- **Test più piccolo**: un blocco a due campi in fondo a `/family/consigli`.
  Niente in barra, niente pagina nuova, niente endpoint nuovo.
- **Verifica senza traffico**: **le domande stesse**. Se ne arrivano 10 e 6 sono
  varianti della stessa, quella diventa la prossima voce family — e l'hai
  imparato senza un solo numero di analytics. È l'unica proposta qui che produce
  conoscenza invece di misurarla.
- **Criterio di stop**: meno di 5 domande vere nei primi 60 giorni dalla
  pubblicazione → l'edizione family non ha ancora un pubblico **sul sito**, ce
  l'ha solo su Instagram. Il blocco si toglie e lo slot torna vuoto senza
  rimpianti. Verso l'alto: più di ~5 domande a settimana e R&B non reggono; a
  quel punto il formato diventa una raccolta periodica, non un dialogo.
- **Effort R&B**: 0h per costruirlo, poi ricorrente. È la voce che l'owner deve
  guardare più a lungo prima di dire sì.
- **Rischio di brand — il più alto dei tre, e va nominato**: sotto una sezione
  sulla gravidanza arriveranno domande **mediche**. R&B non sono medici. Il
  perimetro va scritto nel copy prima di aprire — «cosa abbiamo fatto noi», mai
  «cosa devi fare tu» — ed è un vincolo, non una gentilezza. Se l'owner non se
  la sente di tenere quel confine in ogni risposta, questa proposta non si fa.

---

## 5. Proposta C — Lo slot non è un bottone: è la data dell'edizione

L'idea che non abbiamo considerato, e la risposta alla terza domanda: **cosa
chiede un'edizione quando non ha niente da vendere.**

Non chiede niente. **Dichiara dove si trova.**

### Il sito ha già scelto la parola giusta e non l'ha usata

Le tre sezioni si chiamano **edizioni** — nel tipo, nel file di configurazione,
nel testo per screen reader accanto al marchio
`[MISURATO: src/config/audienceEditions.ts:5, src/components/AudienceEditionChip.tsx:23]`.
La direzione di design chiama la barra **testata** e le assegna esplicitamente il
lavoro di dichiarare uno stato — «la dichiarazione di stato, in ordine di forza
decrescente» `[MISURATO: DESIGN_navbar-premium.md:379-384]`.

Una testata di giornale, in quel punto, non porta un bottone. **Porta la data
dell'edizione.** Non è una metafora presa a prestito: è la convenzione che il
sito ha già adottato a parole e non ha ancora onorato.

### Come si riempie senza che nessuno lo scriva a mano

La regola: **una riga vera per costruzione, derivata dal contenuto, non redatta.**

| Edizione | Cosa può dire | Da dove |
| --- | --- | --- |
| viaggiatori | l'ultimo posto entrato, con la sua data | il registro ordina già per data e i contatori della home si aggiornano da soli `[MISURATO: PROJECT_BACKLOG_UNICO §8]` |
| family | l'ultimo diario, con la sua data | `getFamilyEntries()` ordina già per `publishedAt` decrescente `[MISURATO: src/config/familyLibrary.ts:13-17]` |
| brand | **niente: qui resta «Il media kit»** | §2 — il lettore è un compratore, e un documento *è* il passo successivo |

Le due edizioni che parlano a lettori portano uno stato; l'edizione che parla a un
compratore porta un documento. **È la differenza di §2, resa visibile invece che
subita.** Oggi il sito ha esattamente il contrario: tre offerte, zero stato — e
family, non avendo un'offerta, resta senza niente.

Tre proprietà che nessuna offerta ha:

- **non può essere vuota.** Finché esiste un contenuto, esiste una data.
- **non può mentire.** È calcolata, non scritta.
- **invecchia nel modo giusto.** Una riga stantia non inganna il lettore: gli
  dice che l'archivio è fermo, e dice a R&B di pubblicare. Il difetto diventa
  visibile all'unica persona che può risolverlo.

E qui c'è la misura che convince più di ogni argomento: **la voce family più
recente è del 2026-07-24** `[MISURATO: family-content-seed.json:104]`. Sono 24
giorni fa, e sono le settimane in cui — a giudicare dalla cronologia del seed
stesso, con «36 settimane» pubblicato il 18 luglio `[MISURATO: stesso file:48]` —
sta succedendo la cosa più importante che quella edizione racconterà mai.
`[DEDOTTO: la finestra della data presunta cade in questo periodo. Si smentisce
se: il reel delle 36 settimane è stato pubblicato in ritardo sulla settimana
reale.]` Il sito non lo sa, non lo dice, e al suo posto mostra uno spazio bianco.

Una data avrebbe detto qualcosa di vero. Un bottone «I codici attivi», anche se i
codici fossero esistiti, non avrebbe detto niente.

### La scheda

- **Test più piccolo**: **una sola edizione, family**, e nemmeno in barra —
  in cima a `/family`, sopra l'hero. Una riga. Se non regge lì, in una testata
  non regge di sicuro.
- **Verifica senza traffico**: la riga è corretta il giorno dopo un import senza
  che nessuno l'abbia toccata. Verificabile pubblicando una voce e ricaricando.
- **Criterio di stop**: se `travellini-ui-designer` giudica che a schermo somigli
  a un badge di dashboard, muore lì. È il rischio reale e non lo decido io: un
  numero in una testata è a un passo dal vocabolario SaaS che `DESIGN.md`
  esclude, e la stessa direzione di design ha già bocciato la barra attuale
  proprio per quello `[MISURATO: DESIGN_navbar-premium.md:400-403]`.
- **Effort R&B**: **zero**, ora e per sempre. È l'unica delle tre che non consuma
  la risorsa scarsa.
- **Rischio di brand**: dichiarare in ogni pagina che l'archivio è fermo. È un
  rischio reale — ed è la ragione per cui la proposta vale: nessuno accetta di
  mostrare una data vecchia, e questo è precisamente il punto.

---

## 6. Cosa non fare, e perché

- **Un lead magnet family.** §2. Un PDF su gravidanza e viaggio scritto nelle
  settimane della data presunta è il modo più veloce di ottenere un documento
  mediocre da due persone esauste.
- **Riempire `/family/shop` con un affiliato travel.** Heymondo ha un codice
  reale e attivo `[MISURATO: src/pages/Risorse.tsx:65-75]`, e «assicurazione in
  gravidanza» sarebbe perfino un accostamento sensato. Ma la vetrina family
  esiste per i partner family: metterci un codice travel è il ripiego che
  l'owner ha già rifiutato una volta, con un'etichetta diversa.
- **Puntare lo slot family a `/family/consigli`.** Era l'opzione (a) della
  direzione di design `[MISURATO: DESIGN_navbar-premium.md:459-462]` ed è già
  stata scartata in sede di copy: ricrea il doppione, perché «Consigli» è già
  voce di menu `[MISURATO: COPY_navbar-edizioni.md §4]`. Non la riapro.
- **Qualsiasi cosa che chieda tempo a R&B questa settimana.** Vedi §5: la
  finestra della data presunta è adesso. Le proposte A e B si preparano e si
  aprono quando l'owner dice che si può.
- **Toccare `/media-kit`.** Funziona, qualifica, ha budget e periodo obbligatori.
  *(A margine: la voce P2 #11 del backlog — «Campi budget e periodo nel form
  media kit» — risulta **già fatta** `[MISURATO: MediaKit.tsx:111-112, 144-148]`.
  Vale la regola: una voce si chiude quando il codice lo dimostra.)*

---

## 7. La sequenza, e la raccomandazione della settimana

**Questa settimana: niente su family.** Lo slot vuoto non fa danno a nessuno e
può restare vuoto per mesi senza costare niente. La cosa che va decisa adesso è
un'altra, e sta in §1:

> **I dieci posti della guida in regalo sono posti dove siete stati?**

È una domanda, non un lavoro. Se la risposta è sì, la guida resta com'è e
guadagna la riga di prova che le manca. Se è no, la sostituzione è **più
economica di quanto il backlog stimi**: il backlog dà `L` alla voce «compilare il
PDF con luoghi reali», ma quella stima è del 31 luglio, **prima** delle quattro
tranche di import che hanno portato il registro da 29 a 79 schede complete
`[MISURATO: PROJECT_BACKLOG_UNICO §8]`. Oggi ci sono 79 posti con foto vera,
coordinate, data e in molti casi il prezzo dichiarato. Scegliere dieci di quelli
significa **scegliere**, non scrivere: ~2h di R&B, più una rigenerazione.

Sarebbe anche una guida diversa e migliore per come questo sito è fatto: dieci
posti che il lettore può poi aprire sul sito, con il reel, il pin e la data.
La guida e il registro si citerebbero a vicenda invece di ignorarsi.

Poi, in ordine:

1. **`isDealActive`** (§3, ~1h frontend, nessuna decisione aperta). Va prima dei
   DM, non dopo: senza, la riaccensione nasce con una scadenza silenziosa.
2. **I due DM** (§3, 30-40 min R&B) — quando l'owner ha banda.
3. **La riga di stato su `/family`** (§5) — solo se `travellini-ui-designer` dice
   che sta in piedi.
4. **La casella delle domande** (§4) — ultima, e solo dopo che R&B hanno detto sì
   al costo ricorrente e al perimetro medico.

---

## 8. Le decisioni che restano all'owner

1. **§1 — i dieci posti della guida.** Ci siete stati? Se no: si sostituiscono
   con dieci dei 79 verificati, o si cambia la promessa della landing da «provati
   da noi» a qualcosa di vero. `[VERIFY: solo R&B lo sanno]`
2. **§3 — il cancello dei deal.** Resta a 3, scende a 2 con motivazione scritta
   nella decisione del 2026-07-24, o si cerca un terzo partner family.
3. **§4 — la casella delle domande.** Il costo non è costruirla, è rispondere per
   sempre. Sì solo se il perimetro «cosa abbiamo fatto noi, mai cosa devi fare
   tu» regge in ogni risposta.
4. **§5 — la riga di stato.** Vale la pena provarla su `/family`? La decisione di
   forma è di `travellini-ui-designer`; quella di principio — se la testata
   dichiara uno stato invece di offrire qualcosa — è dell'owner.
