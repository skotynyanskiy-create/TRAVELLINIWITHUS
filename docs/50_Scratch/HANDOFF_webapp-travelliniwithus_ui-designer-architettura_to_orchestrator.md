---
title: HANDOFF_webapp-travelliniwithus_ui-designer-architettura_to_orchestrator
status: open
created: 2026-09-29
from: travellini-ui-designer
to: travellini-orchestrator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza) → input per la sintesi R2
responds_to: docs/50_Scratch/HANDOFF_webapp-travelliniwithus_orchestrator_to_ui-designer-architettura.md
consumes: docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md
---

# Handoff: architettura dell'informazione e interazione della webapp. Cinque voci, un piano, posti e tracce

## Why this work matters

La decisione dell'owner (webapp) chiede una struttura che regga tre ingressi molto diversi:
un reel visto su Instagram, una ricerca su Google, l'icona sul telefono. Oggi il sito
risponde a tutti e tre con la stessa cornice da sito: testata, fascia delle edizioni,
breadcrumb, footer. Questo documento definisce le schede, gli stati e i gesti che
trasformano quella cornice in un'app, senza togliere a Google le URL che già indicizza e
senza aggiungere rotte top-level (quindi senza toccare `server.ts` per la struttura di base).
Qui c'è il **come**; il **perché** qualcuno installa o torna lo sviluppa growth.

`BEST` = `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`
(PR #27, commit 4fe1794, sola lettura; ignorata la patch locale a `src/lib/seo.ts`). I
numeri vengono dal fact pack del data-analyst; dove il brief diverge, vince il fact pack.
Della direzione visiva ho letto solo i fatti (misure a 390 px, ritagli, spec del
prototipo). La sua raccomandazione A/B non entra qui: l'architettura vale identica con A e con B.

## Decisions already made (proposte bloccate dall'architettura: in R2 si confermano o si respingono per iscritto)

1. **Cinque voci, identiche in ogni edizione e in ogni livello**: Home · Esplora · Mappa
   · I miei posti · Noi. Se l'owner ne vuole quattro, «Noi» confluisce nel colofone
   della Home e nel marchio della barra alta, e nient'altro cambia.
2. **Un solo piano fisso in basso**: la barra delle voci più, solo quando il livello ha
   un'azione primaria, una riga d'azione (posto: Salva e il reel; mappa: attiva la mappa
   interattiva). Nell'articolo le azioni stanno nella barra alta. Nel guscio non entrano
   EditionBand, AudienceGate, ExitIntentPopup, ScrollProgressBar, SmoothScrollProvider,
   Footer, MobileBottomBar e StickyMobileCTA.
3. **L'edizione è una lente, non una scheda e non una domanda.** Si deduce dalla rotta
   d'ingresso (il meccanismo `audienceFromPath` esiste già), vale di default
   «Viaggiatori» e si cambia solo da «Noi». Nessuna scelta di edizione prima del contenuto.
4. **Nessuna rotta top-level nuova.** Le tracce, la vista Reel e la lista condivisa sono
   stati in query su rotte che esistono già (`/esplora`, `/mappa`, `/preferiti`).
5. **Posto ≠ traccia.** Un posto ha fotogramma certificato, URL indicizzabile e punto
   preciso. Una traccia ha solo testo, nessuna immagine e nessuna URL propria, e sta sul
   comune, mai su un punto.
6. **Lo stato condivisibile sta nell'URL.** Sfogliare usa `replace`, aprire un livello usa
   `push`. Lo stato privato (salvati, ultimo posto aperto) sta in `localStorage`.
7. **«I miei posti» è tipizzato** (posto / articolo / traccia, con la data di
   salvataggio), leggibile offline e senza login.
8. **L'installazione non si propone mai alla prima visita, mai nel browser di Instagram,
   mai con una modale.**
9. **Nell'app non compare mai il testo delle caption** senza revisione: 130 caption su
   1.281 contengono frasi in inglese (fact pack §9) e alcune toccano gravidanza, nascita e
   salute (§12, solo conteggi).

## Context the receiver needs

### 0. Rilievi sul codice di BEST che condizionano l'architettura

Correzioni al brief già applicate: il gate a modale è spento dal 17 agosto
(`BEST/src/components/AudienceGate.tsx:29`) e al suo posto, alla prima visita, compare la
testata estesa con le tre porte (`EditionBand.tsx:59-104`). «Il Timbro» non esiste più
(`Posto.tsx:234-236`). Esiste invece il bollo «Esiste davvero?» (`PostoStamp.tsx:129-141`).
`corpus-places.json` non ha coordinate: le coordinate per reel stanno in
`instagram-corpus.json`, con i limiti di qualità del fact pack (§7). Nessuna idea qui sotto
poggia sul verdetto.

```
[serious] src/pages/Posto.tsx:79 ↔ src/components/map/FullScreenMapExperience.tsx:643, 666
Problem: «Vedi sulla mappa» apre `/mappa?place=<id>`, ma la mappa scrive e legge solo
  `?posto=<id>`: il link atterra sulla mappa generica, senza il posto.
Why it matters: in un'app a schede il passaggio posto → mappa è il gesto più frequente
  fra due voci, e oggi fallisce senza nessun segnale.
Direction: un solo nome di parametro (`posto`) in un contratto unico dei parametri URL,
  con un test e2e di andata e ritorno (Idea 10). Si può correggere subito, a prescindere
  dalla webapp.
```

```
[serious] src/pages/Mappa.tsx:86-93 + src/services/analytics.ts:157-184
Problem: «Attiva la mappa» accende il consenso `marketing`, lo stesso che fa partire
  eventi e pagine viste verso i pixel di Meta e TikTok.
Why it matters: con «Mappa» voce fissa della barra, chi vuole solo la mappa accetta anche
  il tracciamento pubblicitario, e un brand che vende fiducia non può permetterselo
  [VERIFY: pixel caricati in produzione; valutazione legale].
Direction: un consenso a parte per le mappe (Idea 9). Lo stato di partenza della voce
  Mappa è la carta locale, che non chiama nessun servizio esterno.
```

```
[serious] src/App.tsx:81-96, 108
Problem: il fallback di Suspense avvolge tutte le rotte, Layout compreso: la prima
  apertura di ogni livello lazy sostituisce lo schermo intero con il PageLoader, testata
  inclusa.
Why it matters: in un guscio persistente la barra non può sparire mentre si carica una
  scheda. Oggi è anche un salto di layout.
Direction: il confine di Suspense va dentro il guscio, attorno alla sola area contenuto,
  con l'altezza riservata.
```

```
[serious] src/context/FavoritesContext.tsx:15-18, 105-110 + src/pages/Preferiti.tsx:37-91
Problem: posti (per id) e articoli (per slug) stanno nello stesso array di stringhe, senza
  data. Gli articoli si risolvono solo con una chiamata a Firestore.
Why it matters: «Posti» e «Guide» non si separano in modo affidabile; offline gli articoli
  salvati risultano «non disponibili»; senza data di salvataggio il ritorno non ha
  memoria di cosa è cambiato.
Direction: uno schema v2 {tipo: posto | articolo | traccia, id, salvatoIl} che migra
  l'array attuale. Per chi ha un account, il campo Firestore si decide con
  travellini-backend-engineer, perché `firestore.rules` è un file ad alto rischio.
```

```
[serious] src/components/EditionBand.tsx:59-104 + src/pages/Mappa.tsx:19-22
Problem: alla prima visita la fascia a tre porte sta in testa a ogni rotta, e su mobile la
  mappa riserva 393 px prima di cominciare (`MAP_TOP_RESERVE_CLASS.extended`). Sulla
  scheda mobile l'h1 parte a y≈725 su 844 (screenshot 07).
Why it matters: chi arriva da un reel si trova davanti una scelta di edizione invece del
  posto, e la voce Mappa perde metà dello schermo.
Direction: la fascia esce dal guscio; l'edizione si deduce dalla rotta e si cambia da «Noi»
  (§3, Idea 2).
```

```
[serious] src/pages/Posto.tsx:52-54
Problem: uno slug sconosciuto rimanda senza avviso a /esplora.
Why it matters: i link mandati in DM e negli sticker restano in giro per anni. Chi tocca un
  link vecchio finisce in un archivio senza sapere perché, e Google riceve un redirect
  morbido [VERIFY con seo-strategist].
Direction: un livello «non trovato» esplicito, con la ricerca. Il redirect resta solo per
  le tracce diventate posti, tramite una mappa esplicita traccia → posto (§5).
```

```
[serious] repository pubblico: src/data/instagram-corpus.json (fact pack, «Esito in testa» e §12)
Problem: il file grezzo tracciato contiene le coordinate esatte di tutti i post, comprese
  le 2 voci in deny-list e i luoghi ricorrenti.
Why it matters: generalizzare nella UI (tracce al comune) non protegge ciò che nel repo è
  già leggibile. È il presupposto delle idee 4 e 5.
Direction: fuori dal mio perimetro. Decide l'owner con travellini-security-auditor: nel
  repo resta solo l'indice derivato e generalizzato, e va valutata la storia git. Qui
  nessun dettaglio.
```

```
[minor] src/components/atlante/SchedaVerifica.tsx:36-43
Problem: quando manca `visitedAt`, la riga «Ci siamo stati» ripiega sulla data di
  pubblicazione del reel.
Why it matters: `takenAt` è la data di pubblicazione (fact pack, convenzioni), quindi la
  riga può affermare una visita nel mese sbagliato.
Direction: con `visitedAt` resta «Ci siamo stati: …», senza diventa «Reel del …» (il
  lessico lo decide seo-strategist).
```

```
[minor] src/components/map/FullScreenMapExperience.tsx:455, 611-633, 644-650, 1237
Problem: il suono al tocco del pin è acceso di default; il volo verso il pin ha
  un'inclinazione di 50° e dura 1,8 s; la proiezione è a globo.
Why it matters: nel guscio un suono non richiesto e un volo lungo sono decorazione che
  rallenta.
Direction: suono spento di default; volo breve e senza inclinazione; con reduced motion
  si usa `jumpTo` [VERIFY: come la mappa gestisce oggi reduced motion]. Il globo non deve
  mai ruotare da solo.
```

```
[minor] src/components/Layout.tsx:38-67
Problem: il layout monta ExitIntentPopup (reagisce al mouse che esce dalla pagina e
  importa Newsletter e LeadMagnetCover), ScrollProgressBar e SmoothScrollProvider (lenis
  e gsap).
Why it matters: su un telefono non si «esce col mouse»; lo scroll deve restare nativo
  perché il ripristino della posizione per scheda funzioni. Questi tre componenti sono il
  budget con cui pagare la barra.
Direction: tutti e tre fuori dal guscio [VERIFY: peso reale, travellini-perf-engineer].
```

```
[minor] vite.config.ts:33-53, 61-79, 104
Problem: il manifest dice «Travel blog di Rodrigo & Betta», ha theme_color #ffffff contro
  #faf8f4 e non dichiara start_url, scope, id né shortcuts [VERIFY: default del plugin].
  Le immagini non vanno né in precache né in runtime cache, e offline.html è inclusa ma
  non viene usata.
Why it matters: installata, l'app si presenta come un blog; offline le schede si aprono
  senza foto.
Direction: un manifest da app (§4), la cache delle cover al salvataggio (Idea 7); lo
  stato offline vive nel guscio.
```

```
[nit] BEST/docs/30_Design/UI_UX_ROADMAP_2026-08-02.md:131-164
Problem: R5 descrive e misura una modale bloccante spenta dal 17 agosto; gli eventi
  `audience_gate_*` non partono più.
Direction: aggiornare R5. Oggi la prima scelta è `audience_switch` con surface
  `testa-estesa` (Navbar.tsx:277-287). Se passa il §3, R5 si chiude.
```

**Verdetto sulla base attuale come guscio di un'app:** `Block — vedi 7 serious+`.

---

### 1. Mappa dell'app

#### Gerarchia

```
GUSCIO (bundle iniziale, sostituisce Navbar + Footer + EditionBand)
├─ Barra alta ........ marchio (radici) oppure ‹ indietro/su (livelli) · ⌕ · azioni del livello
├─ Area contenuto .... unico confine di Suspense, altezza riservata
├─ Piano in basso .... mobile: [riga d'azione del livello, se c'è] + barra delle 5 voci
│                      prima visita: il banner del consenso occupa il piano (§2, §6)
├─ Riga offline ...... sotto la barra alta, solo senza rete
└─ Annunciatore ...... aria-live con il titolo del livello a ogni cambio

VOCI (radici)                              VISTE E STATI IN URL
1 Home          /                          nessuno
2 Esplora       /esplora                   vista=posti|reel · zone · type · format · q · mese · traccia
3 Mappa         /mappa                     posto (esiste) · traccia · miei
4 I miei posti  /preferiti (privata)       vista=posti|guide · lista
5 Noi           /chi-siamo                 nessuno

LIVELLI (URL propria, indicizzabile dove lo è già, chunk lazy)   GENITORE
/posto/:slug ............................... la voce di provenienza; su link diretto Esplora
/articolo/:slug, /destinazione/..., /itinerari/... (preview), /guide/:slug ... Esplora
/family/..., /collaborazioni, /media-kit, /guida-in-regalo, /contatti, legali ... Noi
```

I nomi dei parametri sono provvisori. `zone`, `type`, `format` e `q` esistono già
(`App.tsx:135-138`); `posto` sulla mappa esiste già (`FullScreenMapExperience.tsx:666`).
L'uniformità dei nomi la decide code-architect.

#### Cosa sta nel guscio e cosa è un livello

| Nel guscio (sempre montato) | Livello di contenuto (lazy, URL propria) |
| --- | --- |
| barra alta, barra delle voci, slot della riga d'azione | posto, articolo, destinazione, itinerario, guida |
| apertura della ricerca con ⌘K (oggi in `Navbar.tsx:116-126`); il foglio `SearchModal` resta lazy | Family, Collaborazioni, media kit, guida in regalo, contatti, legali |
| slot del banner del consenso | foglio della traccia, foglio dei filtri, indice dell'articolo |
| riga offline, annunciatore di rotta, ripristino dello scroll per voce | carta locale della mappa, motore MapLibre (chunk a parte, come oggi) |
| colofone legale: una riga in fondo a ogni livello lungo (Privacy · Cookie · Termini) | scheda d'installazione (dentro il chunk di «I miei posti») |

Budget: `initial-js` a 776 KB su 780. Il guscio è in pari solo togliendo ciò che sostituisce
(punto 2 delle decisioni) [VERIFY: delta netto, travellini-perf-engineer]. `Mappa` oggi è
eager (`App.tsx:17-19`): con la carta locale come stato di partenza, la carta deve stare
in un chunk suo oppure pesare pochissimo.

#### Home a schermo unico

Sul telefono la Home sta in un solo schermo tra barra alta e barra delle voci (390×844:
circa 720 px utili) e fa quattro cose: dice chi sono in una riga, mostra un posto vero
(«Il mese nell'archivio», Idea 3), apre la ricerca e porta ai 79 posti. Le sezioni lunghe
di oggi (screenshot 02) si spostano:

| Sezione di oggi | Dove va |
| --- | --- |
| «Il posto te lo descriviamo…» con la striscia 79 / 67 / 0 | Noi, come frasi; la striscia di numeri sparisce |
| «Cosa cerchi oggi?» (interessi) | Esplora, come tre righe d'ingresso, senza chip |
| «Sei posti, presi uno per uno» | Esplora, collezione in testa |
| «Trovali sulla mappa» | la voce Mappa |
| «Luoghi veri, ripresi sul posto» (carosello di reel) | Esplora, vista Reel (Idea 5) |
| manifesto «Raccomandarne meno…» | Noi |
| «L'archivio, riga per riga» | Esplora, vista Posti (è il modello del registro) |
| Footer | Noi più il colofone di una riga |

La Home si accorcia, e con lei il testo indicizzabile di `/`: decide seo-strategist (domande
per l'owner).

#### Le edizioni: una lente, non una scheda

- La barra e le voci non cambiano mai. La lente cambia l'ordine della Home, la CTA della
  barra alta desktop (oggi «La guida in regalo» o «Il media kit», `Navbar.tsx:223-240`) e
  la prima porta di «Noi».
- Viaggiatori (default e ingresso da reel): Home come sopra.
- Family (ingresso da `/family...`): la voce attiva è «Noi»; la Home mette in testa la
  porta «Travellini Family». Family è un sotto-marchio separato
  (decisione del 23 luglio sul confine), quindi i suoi contenuti non entrano in Esplora né
  in Mappa. Il post della nascita non compare mai (deny-list).
- Collaborazioni (ingresso da `/collaborazioni` o `/media-kit`): stessa barra da
  consumatore. È voluto: chi valuta una collaborazione vede il prodotto che comprerebbe.
  La riga d'azione su `/collaborazioni` è «Richiedi il media kit».
- Se l'owner non approva la lente (è una modifica a DESIGN.md, «Temi per audience»), le
  tre pelli di oggi possono restare: l'architettura non cambia, cambia solo quanto cambia
  il colore.

#### Che fine fanno le 6 voci del riferimento dell'owner e le tab Luoghi/Esperienze/Reel

| Voce del riferimento | Destino | Perché |
| --- | --- | --- |
| Esplora | voce 2 | è l'indice: posti, guide, filtri |
| Mappa | voce 3 | con la carta locale funziona anche senza consenso |
| Reel | vista «Reel» dentro Esplora, non una voce | una voce Reel copierebbe la griglia di Instagram e porterebbe al feed; come registro per mese è un indice (Idea 5) |
| Itinerari | formato dentro Esplora, visibile solo quando ci sono itinerari veri | superficie `preview` con due demo (`surfaces.ts:53-55`) |
| Noi & Family | voce 5 «Noi»; Family è una porta dentro Noi | Family è un sotto-marchio con il suo profilo e il suo pubblico |
| Collaborazioni | porta dentro Noi; sul desktop una voce di testo nella barra alta con la lente Collaborazioni | è B2B: in una barra da viaggiatore toglierebbe il posto a I miei posti |
| tab Luoghi / Esperienze / Reel | in Esplora un solo commutatore «Posti · Reel»; «Esperienze» diventa il filtro per tipo | nel corpus il posto è l'esperienza: «posto» compare in 237 caption, «esperienza» in 219, «locale» in 186 (fact pack §9); separarli inventerebbe una tassonomia |

Barra alta desktop (1440): marchio · Home · Esplora · Mappa · I miei posti · Noi · ⌕ · CTA
della lente. Nessuna barra in basso.

---

### 2. I tre ingressi

Schema comune: **indietro** vuol dire tornare nella storia se l'ingresso è avvenuto dentro
l'app, e salire al genitore se il livello è stato aperto con un link diretto (il flag sta in
`history.state`). Il tasto indietro del browser o del sistema non viene mai intercettato:
nessun «Sei sicuro di uscire?».

#### (a) Home, oppure l'icona dell'app installata

| Aspetto | Comportamento |
| --- | --- |
| Primo schermo, prima visita | barra alta (marchio, ⌕) · h1 del brand (testo di seo) · una riga su chi sono · la card «Il mese nell'archivio» (fotogramma, nome, comune, prezzo se c'è) · il campo «Cerca un posto o una città», che apre il foglio di ricerca · il link a tutti i 79 posti. In basso il banner del consenso occupa il piano: la barra delle voci compare dopo la risposta |
| Primo schermo, ritorno | con almeno un salvataggio: in testa «I tuoi posti» (fino a 3 fotogrammi); «Dove eri rimasto» solo con il consenso di personalizzazione; poi «Il mese nell'archivio» |
| Icona installata | `start_url` punta a `/` con un marcatore di sorgente (quale lo decidono seo e growth); si apre sulla Home nello stato di ritorno. Su iOS l'app installata ha uno spazio separato da Safari [VERIFY], quindi al primo avvio può non avere né consenso né salvati: vedi Idea 6 |
| Cosa resta fisso | barra alta, piano in basso |
| Indietro | la Home è una radice: il tasto indietro esce dal sito o dall'app |
| Gesti | nessun gesto personalizzato; nessun trascina-per-aggiornare costruito da noi |
| URL | `/`; il foglio di ricerca apre uno stato di storia senza cambiare URL (indietro lo chiude) |

#### (b) Da Google su `/posto/<slug>` o `/articolo/<slug>`

```
390×844, prima visita, /posto/<slug>
┌──────────────────────────────────────┐
│ ‹ Esplora                    ⌕    ⇪ │ su = /esplora?zone=<regione del posto>
├──────────────────────────────────────┤
│ fotogramma del reel     [Esiste davvero?]│ prova di passaggio
│ nome del posto · comune, regione     │ h1 (se nome o domanda lo decide seo)
│ prezzo · verificato il … su …        │ riga di prova: dati veri, oppure assente
│ Cosa sapere prima …                  │
├──────────────────────────────────────┤
│ banner del consenso                  │ occupa il piano in basso
└──────────────────────────────────────┘
dopo la risposta al banner:
├──────────────────────────────────────┤
│ [♥ Salva per il viaggio] [▷ Il reel] │ riga d'azione del livello
│ Home  Esplora  Mappa  I miei p.  Noi │ voce attiva: Esplora (genitore su link diretto)
└──────────────────────────────────────┘
```

- **Come si entra nell'app da qui.** Nessun passaggio da fare, perché la barra delle voci è
  già l'app. Tre porte, nessuna bloccante: la barra; «Vedi sulla mappa» →
  `/mappa?posto=<id>` (col parametro corretto); in fondo alla scheda «Altri posti in
  <regione>» (3 righe) e il colofone.
- **Come si torna.** Il browser torna a Google, senza intercettazioni. «‹ Esplora» sale
  (push) a Esplora filtrata sulla regione del posto. Se invece si è arrivati da Esplora
  dentro l'app, la stessa freccia è «indietro»: ripristina scroll e filtri (lo scroll al
  POP oggi è già lasciato al browser, `ScrollToTop.tsx:9-11`).
- **Desktop.** Con un link diretto la scheda è una pagina intera. Aperta da Esplora o dalla
  Mappa è un pannello sopra la voce, e l'URL resta `/posto/<slug>` (la rotta usa una
  «background location»). Esc e X equivalgono a indietro. `QuickViewDrawer` confluisce qui:
  un pannello senza URL non si condivide [VERIFY: se QuickView ha un URL].
- **`/articolo/<slug>`.** Barra alta: «‹ Esplora», Indice (apre un foglio), Salva, ⌕. In
  basso solo la barra delle voci, senza riga d'azione e senza la pillola con «0%». In
  fondo: «I posti di questa guida» (quelli citati nei blocchi) e Salva.
- **Slug sconosciuto.** Livello «Questo posto non è qui», noindex, con la ricerca. Una
  traccia diventata posto invece si sostituisce con `replace` verso la nuova scheda.
- **URL.** `/posto/<slug>` è canonica; eventuali ancore di sezione (`#come-arrivare`) le
  decide seo; «Guarda il reel» esce verso Instagram.

#### (c) Link da un reel, dentro il browser integrato di Instagram

Una caption di reel non ha link cliccabili: i link arrivano dalla bio, dagli sticker nelle
storie o dai DM automatici (le formule «scrivici», «commenta» compaiono tra le righe tolte
nel fact pack §9) [VERIFY con social: quali canali si usano davvero e verso quali URL].

| Aspetto | Comportamento |
| --- | --- |
| Destinazione del link | `/posto/<slug>` se la scheda esiste. Altrimenti `/esplora?traccia=<codice>`, che apre il foglio della traccia sopra la vista Reel già posizionata sul mese. Mai la Home: chi arriva da un reel vuole quel posto |
| Primo schermo, posto | come in (b). Il fotogramma è la cover del reel appena visto: chi lo tocca lo riconosce in un secondo |
| Primo schermo, traccia | nome del luogo (etichetta del geotag; se è solo un indirizzo si mostra il comune), comune, «Reel di marzo 2023», una riga onesta («Qui la scheda non l'abbiamo ancora scritta: niente prezzo e niente verifica»), «Guarda il reel», «Salva», e, solo se passa l'Idea 8, «Avvisami quando c'è la scheda» |
| Installazione | mai: nel browser di Instagram non si può installare [VERIFY iOS e Android] |
| Spazio di memoria | separato da Safari e da Chrome [VERIFY]. «I miei posti» lo dice in una riga («Salvati in questo browser») e offre «Copia il link della lista» (Idea 6) |
| Indietro | la X o l'indietro di Instagram riportano a Instagram; dentro l'app vale lo schema comune. Nessun trucco per forzare l'apertura del browser di sistema [VERIFY: fattibilità e regole della piattaforma] |
| Barre di sistema | Instagram aggiunge le sue barre sopra e sotto [VERIFY: altezze su iOS e Android]; il guscio usa `100dvh` e `env(safe-area-inset-bottom)` e non fissa mai un'altezza di schermo |
| URL | `/posto/<slug>?utm_…` oppure `/esplora?traccia=<codice>&utm_…` (convenzione UTM già in uso nel brand snapshot) |

---

### 3. Primo minuto e onboarding minimo

**AudienceGate: da eliminare** (componente, flag e montaggio in `Layout.tsx:54-58`).
È spento dal 17 agosto: tenerlo nel codice lascia aperta una porta che l'owner ha già
chiuso e occupa bundle [VERIFY: peso]. **EditionBand: da togliere dal guscio**, sia nella
forma estesa sia in quella compatta. I motivi:

1. La rotta dice già l'edizione. `audienceFromPath` copre `/family`, `/collaborazioni` e
   `/media-kit` (`AudienceContext.tsx:91-97`), e chi arriva dai reel di @travelliniwithus
   è un viaggiatore per definizione.
2. Il costo sta sopra la piega di ogni rotta: 393 px riservati sulla mappa mobile
   (`Mappa.tsx:19-22`), h1 della scheda a y≈725 (screenshot 07), pannello a tre porte fra
   y 80 e 198 su desktop (screenshot 01, 04, 05, 06).
3. DESIGN.md chiede di «partire dal compito vero dell'utente, non dal marketing astratto»
   (Layout Principles).

**Come l'app sceglie l'edizione senza bloccare.** La rotta di ingresso decide; altrimenti
vale la scelta salvata (`travellini_audience`, come oggi), e in mancanza di entrambe
«Viaggiatori». Il cambio si fa da «Noi», con tre porte descritte (i testi di
`audienceEditions.ts`), e da una riga in fondo alla Home («Cerchi Travellini Family? · Sei
un brand?»; testo provvisorio). Si perde la misura dell'interesse per le edizioni al primo
accesso: la sostituiscono gli eventi `audience_switch` da Noi e la distribuzione delle
rotte d'ingresso (la lettura spetta a growth).

**Onboarding: zero schermate.** Si insegna dentro gli stati: «I miei posti» vuoto spiega
cosa fa Salva; il primo salvataggio dice che il posto resta leggibile anche offline; la
carta locale spiega il consenso in una riga.

**Il primo minuto di chi arriva da un reel sul telefono, senza sapere chi sono:**

| Secondi | Cosa succede | Cosa non succede |
| --- | --- | --- |
| 0-1 | Si apre la scheda. I dati del posto sono nel bundle, senza chiamate; il fotogramma è l'LCP e coincide con la cover del reel appena visto | nessuna scelta di edizione, nessuna modale |
| 1-10 | Legge nome, comune e prezzo, poi «verificato il …», cioè quello che il reel non diceva | nessun testo di caption |
| 10-20 | Il banner del consenso occupa il piano in basso: un tocco, con «Rifiuta» dello stesso peso. Poi compaiono barra e riga d'azione | mai banner e barra impilati: una richiesta alla volta, come già stabilito in `AudienceGate.tsx:17-20` |
| 20-40 | Tocca «Salva per il viaggio»: il bottone diventa «Salvato» e nella riga compare «In I miei posti · Annulla» | nessun numero sull'icona, nessuna esplosione di cuori |
| 40-60 | In fondo trova «Altri posti in <regione>», oppure torna al reel con «Guarda il reel» | nessun popup della newsletter (ExitIntentPopup fuori dal guscio), nessuna proposta d'installazione |

Chi sono lo capisce dalla prova, non da una presentazione: il fotogramma del loro reel, la
data e la riga di provenienza. «Noi» sta nella barra per chi vuole saperne di più.

---

### 4. Il ritorno

#### Seconda visita, senza account

- La Home è nello stato di ritorno (§2a). Se è cambiato qualcosa, una sola frase datata:
  «Dal 12 settembre: 2 schede nuove» [VERIFY: la scheda ha oggi un campo con la sua data di
  creazione? `checked.at` e `publishedAt` hanno un altro significato].
- «Dove eri rimasto» (l'ultimo posto aperto) compare solo con il consenso di
  personalizzazione. Il meccanismo esiste già: `twu_reading_history` si cancella quando il
  consenso viene ritirato (`consent.ts:15-19`). Senza consenso non compare nulla, ed è giusto
  così.

#### Terza visita

- La Mappa si apre inquadrata sui posti salvati se sono almeno 2 (`/mappa?miei=1` è lo
  stato condivisibile), con «Tutti i posti» per allargare.
- Sui posti salvati compaiono solo righe di fatto: «Verificato di nuovo il …» se `checked.at`
  è posteriore al salvataggio; «Ora ha la scheda» se una traccia salvata è diventata un posto.
- Se le condizioni ci sono (vedi sotto), in «I miei posti» compare la scheda
  d'installazione.

#### «I miei posti» con posti e articoli separati

```
/preferiti                       (label della voce: «I miei posti»; l'URL resta, niente server.ts)
  commutatore: Posti · Guide     (?vista=guide)
  Posti
    Con la scheda                fotogramma, nome, comune; ordinati per data di salvataggio
    Ancora senza scheda          tracce: solo testo, «Reel di …»
    (da 8 posti in su si raggruppa per regione)
  Guide                          articoli salvati: titolo, data; copia offline se esiste (Idea 7)
  in fondo                       «Vedi sulla mappa» (?miei=1) · «Copia il link della lista» (?lista=…)
  riga di contesto               solo nel browser di Instagram: «Salvati in questo browser»
```

Nessun contatore, nessuna modalità di modifica: si toglie un elemento col cuore, e compare
«Annulla» per 5 secondi.

#### Cosa resta leggibile offline

| Contenuto | Offline | Come |
| --- | --- | --- |
| guscio e voci | sì | precache della build (oggi JS, CSS e HTML [VERIFY: globPatterns di default]) |
| testo delle 79 schede | sì | i dati dei posti sono di build [VERIFY: `content-seed` in un chunk in precache] |
| fotogrammi dei posti salvati | sì | cache della variante 480 al momento del salvataggio (Idea 7) |
| fotogrammi dei posti non salvati | no | la scheda si apre tipografica, senza gradienti |
| guide salvate | sì, se esiste una copia statica | [VERIFY con code-architect: copia JSON al salvataggio oppure persistenza offline di Firestore] |
| tracce | sì, se l'indice è già stato caricato una volta | chunk lazy in cache |
| mappa interattiva | no | resta la carta locale |
| ricerca | sì, sui posti | indice di build (`SearchModal.tsx:110-121`) |

#### Quando e come proporre l'installazione

- **Condizioni, tutte insieme:** almeno la seconda sessione; almeno un salvataggio; non già
  installata (`display-mode: standalone`, `navigator.standalone`); non nel browser di
  Instagram [VERIFY: segnale dello user agent]; nessun rifiuto negli ultimi 90 giorni.
- **Dove:** una scheda dentro «I miei posti», in testa alla lista, e una riga fissa in «Noi →
  Preferenze». Mai una modale, un banner, un toast o un contatore.
- **Android e Chrome:** si intercetta `beforeinstallprompt`, lo si rimanda e lo si chiama
  dal nostro bottone [VERIFY: criteri d'installabilità attuali di Chrome].
- **iOS con Safari:** non c'è un'API. La scheda mostra due passaggi, l'icona Condividi e
  «Aggiungi alla schermata Home» [VERIFY: dicitura esatta su iOS 17 e 18; supporto da altri
  browser iOS dalla 16.4]. Prima dei due passaggi, se ci sono salvati: «Copia il link della
  lista, poi aprilo nell'app», perché su iOS l'app installata non vede lo spazio di Safari
  [VERIFY].
- **Nel browser di Instagram:** mai.
- **Manifest da app:** `description` non più «Travel blog»; `theme_color` allineato alla
  sabbia; `start_url`, `scope` e `id` espliciti; `shortcuts` verso I miei posti, Mappa e
  Cerca (solo Android [VERIFY]). Testi a seo-strategist.

---

### 5. Posti e tracce

**Cos'è una traccia.** Un reel con coordinate su un locale che non ha scheda: il gruppo C del
fact pack, **484 reel su 409 coordinate** (297 in Italia; 53 con almeno 2 reel). I reel con
etichetta generica (369: «Milano», «Italia»…), quelli con un'etichetta senza coordinate (25)
e quelli senza luogo (149) **non vanno sulla mappa**: compaiono solo nella vista Reel, come
righe con la sola città o senza luogo. Il motivo è concreto: l'etichetta «Italia», con 89
reel, cade in Umbria (§7).

| | Posto | Traccia |
| --- | --- | --- |
| Quanti | 79 visibili, struttura per 533 (il tetto) | 409 coordinate candidate |
| Immagine | fotogramma certificato `real-frame` (79 su 79) | nessuna, mai: 0 su 897 reel candidati hanno una cover su disco (§10), e un'immagine sostitutiva violerebbe imagery-truth |
| Nome | inchiostro, Fraunces | testo secondario con contrasto AA (tono «matita»; il valore lo decide la direzione) più l'etichetta «Traccia» |
| Dati | prezzo, verifica, cosa sapere, come arrivare | solo nome, comune e mese del reel. Il prezzo in caption c'è in 132 reel su 119 luoghi nuovi (§5), ma non si mostra: non è verificato |
| Dove sulla mappa | punto preciso | segno sul comune, mai un punto (Idea 4) |
| URL | `/posto/<slug>`, indicizzabile | stato in query (`?traccia=<codice>`), con canonical sulla rotta base; mai indicizzata |
| Marcatori | hanno la precedenza nel tetto di 60 | riempiono i posti rimasti sotto il tetto e solo dallo zoom «area» in su; un segno per comune, qualunque sia il numero di reel |
| Azioni | Salva, Il reel, Indicazioni, Condividi | Salva, Il reel; «Avvisami» solo con l'Idea 8 |
| Privacy | coordinate della scheda, verificate dall'owner | deny-list applicata alla costruzione dell'indice; centroide del comune da un gazetteer pubblico [VERIFY: fonte e licenza], mai calcolato dai punti dei reel (la media di pochi punti può coincidere con un indirizzo) |

**Da dove arrivano i dati.** Un indice statico costruito in CI da `instagram-corpus.json`,
che è tracciato (fact pack §11), in un chunk lazy caricato solo dalla vista Reel e dalla
Mappa allo zoom «area». Campi: codice, etichetta, comune, regione, paese, mese; niente
plays, niente caption. Peso [VERIFY con code-architect: stima nell'ordine delle decine di
KB non compressi]. Il corpus non si rigenera in CI (§«Esito in testa»): l'indice si
ricostruisce dal file committato. Prerequisito: l'approvazione della spec del 14 agosto.

**Come una traccia diventa un posto.**

1. L'owner sceglie la traccia: a mano, oppure seguendo le richieste dell'Idea 8, che non
   sono mai pubbliche.
2. Scrive la scheda (prezzo, `checked`, cosa sapere) e asset-curator certifica il fotogramma.
3. Alla build l'indice registra `traccia → postoId`.
4. Nell'interfaccia il segno vuoto sul comune diventa un punto pieno sull'indirizzo; la riga
   nella vista Reel prende il fotogramma; i link `?traccia=<codice>` già in giro (DM, sticker)
   si sostituiscono con `replace` verso `/posto/<slug>`; in «I miei posti» la traccia salvata
   diventa un posto con la riga «Ora ha la scheda».
5. Per 30 giorni la nuova scheda porta un'etichetta datata («Scheda nuova · ottobre 2026»):
   è un fatto con una data, non un badge «di tendenza».

---

### 6. Stati

| Stato | Comportamento | Cosa non fa |
| --- | --- | --- |
| Primo accesso | il banner del consenso occupa il piano in basso al posto di barra e riga d'azione; la barra alta e il contenuto restano usabili e scorrevoli | mai tre strati in basso; nessuna scelta d'edizione |
| Vuoto: I miei posti | una frase che insegna il gesto e dice che vale anche offline, il posto del mese come primo candidato, «Apri Esplora» | niente cuore grigio grande (`Preferiti.tsx:202`), niente «Inizia a esplorare» |
| Vuoto: Esplora con 0 risultati | dice quale filtro togliere; se ci sono tracce che corrispondono le offre come righe («Nessuna scheda qui, 3 reel in questa zona») | nessun risultato inventato |
| Vuoto: regione senza reel | «Non ci siamo ancora stati», solo con l'ok dell'owner (sei regioni a zero, §7) | nessun grafico, nessuna barra |
| Vuoto: ricerca | esempi che esistono davvero (già così, `SearchModal.tsx:697-702`), più le tracce se l'indice è caricato | |
| Caricamento | il guscio non sparisce mai; i posti non hanno caricamento (dati di build); le guide mostrano righe scheletro a misura fissa; la Mappa mostra subito la carta locale e il motore interattivo si carica al suo posto | niente PageLoader a tutto schermo (`App.tsx:81-96`), niente spinner su fondo nero (`Mappa.tsx:24-35`) |
| Offline | una riga sotto la barra alta, annunciata una volta («Sei senza rete: vedi i posti salvati e le schede già aperte»); schede non salvate tipografiche; le azioni che richiedono la rete sono disattivate con il motivo scritto | niente toast ripetuti; non si serve offline.html |
| Mappa senza consenso | la carta locale con i punti dei posti e l'elenco sotto; il comando per la mappa interattiva nel primo schermo; una riga che spiega perché | nessun muro scuro (screenshot 04), nessuna chiamata esterna prima del consenso |
| Errore | guide che non arrivano: «Le guide non si caricano. Riprova», e i posti restano; motore della mappa fallito: la carta locale resta, con «Riprova»; slug sconosciuto: un livello esplicito; traccia inesistente o esclusa: lo stesso messaggio neutro | mai un indizio sul perché una traccia non esiste |
| Salvato | `aria-pressed`, etichetta «Salvato», conferma nella riga d'azione con «Annulla» per 5 secondi (`aria-live`); in background la cache per l'offline | nessun contatore sulla voce, nessuna animazione del cuore (`heartPulse` in `Preferiti.tsx:154-160`) |
| Reduced motion | cambio di voce e apertura dei fogli istantanei; mappa con `jumpTo`, senza inclinazione; il bollo gira la carta senza animazione (già previsto in `PostoStamp.tsx:37-38`) | nessun suono, per nessuno di default |
| Tastiera e ⌘K | ⌘K e Ctrl+K aprono la ricerca da ogni livello (vive nel guscio); Esc chiude il foglio più in alto (`useOverlayLayer`); ordine di tabulazione: salta-al-contenuto → barra alta → contenuto → riga d'azione → barra delle voci; la barra è un `nav` con `aria-current="page"`; nella carta locale ogni punto è un bottone, e l'elenco equivalente sta sotto | nessuna scorciatoia a lettera singola fuori dal campo di ricerca |
| Ritorno del focus | link nel contenuto: focus sull'h1 del livello nuovo e titolo annunciato. Indietro: focus sull'elemento che aveva aperto il livello (id in `history.state`). Voce della barra: il focus resta sulla voce e il titolo viene annunciato. Chiusura di un foglio: focus sul comando che l'aveva aperto | nessun salto in cima alla pagina dopo un indietro |

---

### 7. La risposta alla domanda 2

**L'elemento che, se lo togli, rende l'app generica è la prova di passaggio: il fotogramma
di un reel girato da loro, con la sua data, attaccato a un indirizzo.**

Il test: in qualunque schermata copri il fotogramma e la data del reel. Se quello che resta
(nome, prezzo, indirizzo, un punto sulla mappa) potrebbe stare su Google Maps o in una guida
qualunque, la schermata era già generica prima. Il sito ha già la catena intera: 79 schede
su 79 hanno una cover `real-frame` legata per codice a un reel del corpus (fact pack §10). Il
corpus conta 62 mesi di fila con almeno un reel (§2). Nessun'app di viaggi generica ha
questa catena.

Conseguenze per l'architettura:

1. Ogni voce ha una prova di passaggio nel primo schermo:

   | Voce | Prova di passaggio |
   | --- | --- |
   | Home | il fotogramma del posto del mese e «Reel di …» |
   | Esplora | i fotogrammi nella griglia; nella vista Reel, la data di ogni riga |
   | Mappa | ogni punto è un posto girato; il foglio del punto si apre col fotogramma |
   | I miei posti | i fotogrammi dei salvati |
   | Noi | una foto vera di Rodrigo e Betta [VERIFY asset-curator: esiste una foto certificata] |

2. Un posto senza fotogramma certificato è tipografico, ma porta comunque la data del reel.
3. Le tracce sono prove di passaggio senza scheda, per questo si mostrano come tali invece
   di nasconderle. La seconda cosa che solo una persona può dire, «qui non ci siamo ancora
   stati», nasce dallo stesso principio.
4. Cosa **non** è l'elemento: la palette, l'inclinazione del bollo, il verdetto (tolto il
   15 agosto). Sono tutti sostituibili; la prova di passaggio no.

---

### 8. Schede idea

### Idea 1 — Cinque voci, un piano
- In una frase: la barra ha cinque voci fisse (Home, Esplora, Mappa, I miei posti, Noi), uguali in ogni edizione e in ogni livello, e sopra di lei compare al massimo una riga d'azione del livello aperto.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): arrivati da un reel su un posto, in basso c'è già tutta l'app, e la stessa barra resta su posto, articolo, Family e Collaborazioni. Nessun menu a tendina, nessuna seconda barra.
- Dato reale su cui poggia: sulla scheda mobile l'h1 parte a y≈725 su 844 sotto pillola, fascia e breadcrumb (screenshot 07); le voci del menu cambiano per edizione (`Navbar.tsx:180-216`); l'articolo ha un secondo piano fisso (screenshot 10-guida-blocchi-mobile).
- Cosa richiede: codice (un guscio nuovo al posto di Navbar, Footer ed EditionBand; Suspense dentro il guscio); 0 asset; decisione owner fra 5 e 4 voci; 0 ore ricorrenti.
- Rischio principale: il bundle iniziale (776/780 KB) [VERIFY perf-engineer]; la barra con la barra degli indirizzi di Safari in basso [VERIFY browser-auditor].
- Regole toccate: bundle | anti-SaaS
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 4 / Costo 3 / Carico owner 5

### Idea 2 — Nessuna domanda all'ingresso
- In una frase: l'edizione si deduce dalla rotta d'ingresso e si cambia solo da «Noi», e dal guscio spariscono la fascia a tre porte e il gate spento.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): chi arriva dal reel di Granduca vede per prima cosa Granduca, non la domanda «Viaggiatori, Family o Collaborazioni?».
- Dato reale su cui poggia: gate spento dal 17 agosto (`AudienceGate.tsx:29`); la fascia estesa riserva 393 px sulla mappa mobile (`Mappa.tsx:19-22`); `audienceFromPath` copre già le tre rotte di edizione (`AudienceContext.tsx:91-97`).
- Cosa richiede: codice (rimozione e porte in Noi); decisione owner (rivede la sua scelta del 24 luglio sulla porta a 3 vie); lettura degli eventi `audience_switch` a growth.
- Rischio principale: Family e Collaborazioni perdono visibilità alla prima visita su `/`.
- Regole toccate: brand-DNA (DESIGN.md «Temi per audience», solo se passa anche la lente)
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 3 / Costo 5 / Carico owner 5

### Idea 3 — Il mese nell'archivio
- In una frase: il blocco centrale della Home mostra i posti il cui reel è uscito in questo mese dell'anno, negli anni passati, e cambia da solo il primo del mese.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): a ottobre la Home si apre sui posti degli ottobre passati. Sembra scelta da loro; è il loro calendario.
- Dato reale su cui poggia: schede visibili per mese di pubblicazione del reel: gen 3, feb 5, mar 2, apr 4, mag 8, giu 11, lug 19, ago 5, set 6, ott 8, nov 4, dic 4 (fact pack §8), quindi ogni mese ne ha almeno 2; luoghi locali per mese, tracce comprese, da 31 (agosto) a 54 (novembre). La data è di pubblicazione, non di visita.
- Cosa richiede: codice (la Home); dati già presenti (`publishedAt`); 0 ore owner; un'etichetta onesta da seo («Reel usciti a ottobre», non «visitati a ottobre»).
- Rischio principale: marzo ha solo 2 schede e luglio 19. Serve una regola minima: sotto le 3 schede si aggiungono le tracce del mese come righe di testo.
- Regole toccate: nessuna (i conteggi solo dentro frasi)
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 4 / Business 3 / Costo 5 / Carico owner 5

### Idea 4 — Le tracce stanno sulla città
- In una frase: i reel senza scheda compaiono sulla mappa solo come segno vuoto sul comune e mai come punto preciso; il punto preciso spetta ai posti certificati.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): zoomando su una regione, accanto ai punti pieni compaiono cerchi vuoti sui paesi: «qui c'è un nostro reel, la scheda arriverà».
- Dato reale su cui poggia: 484 reel su 409 coordinate senza scheda, 297 in Italia (§1, §15); il 19,6% delle etichette che nominano un paese cade in un paese diverso (§7), quindi la coordinata del geotag non è affidabile; i dati non dimostrano quale sia l'area di casa (§14), perciò la generalizzazione vale per tutte le tracce.
- Cosa richiede: dati (indice statico in CI con deny-list; centroidi comunali da una fonte pubblica [VERIFY licenza]); codice (un layer nel chunk della mappa, dentro il tetto di 60); l'approvazione della spec del 14 agosto.
- Rischio principale: il file grezzo con le coordinate esatte è già nel repo pubblico. La UI generalizza, il file no (rilievo §0).
- Regole toccate: privacy | bundle | SEO-URL
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 3 / Costo 3 / Carico owner 4

### Idea 5 — Il rullino tipografico
- In una frase: in Esplora la vista «Reel» elenca tutti i reel mese per mese dal luglio 2021; quelli con scheda hanno il fotogramma e aprono il posto, gli altri sono righe di testo che portano al reel su Instagram.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): 62 mesi di fila senza un buco, uno sotto l'altro. La costanza della coppia diventa un indice, non un feed.
- Dato reale su cui poggia: 1.192 reel, nessun mese vuoto fra luglio 2021 e agosto 2026 (§2); 1.104 reel su 1.190 usabili senza una scheda propria (§15).
- Cosa richiede: dati (lo stesso indice dell'Idea 4, più i reel con etichetta generica o senza luogo); codice (lista virtualizzata, salto per anno); nessuna cover nuova.
- Rischio principale: con anteprime video o autoplay diventa il feed vietato. Solo testo e fotogrammi certificati, mai il testo delle caption.
- Regole toccate: anti-SaaS | privacy | bundle
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 2 / Costo 3 / Carico owner 5

### Idea 6 — La lista è un link
- In una frase: «I miei posti» si porta ovunque con un link (`/preferiti?lista=…`) che apre la lista su un altro browser o un altro telefono e, dopo una conferma, la aggiunge ai propri salvati, senza account.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): salvi tre posti nel browser di Instagram, copi il link e lo mandi a chi parte con te; sul suo telefono c'è la stessa lista.
- Dato reale su cui poggia: senza account i salvati vivono solo in `localStorage` (`FavoritesContext.tsx:15-18, 105-110`); il browser di Instagram e l'app installata su iOS hanno uno spazio separato da Safari [VERIFY]; «Weekend in coppia» è uno dei tre interessi viaggiatori (`audienceInterests.ts:32-38`) e il bigramma «weekend romantico» compare in 15 caption (§9).
- Cosa richiede: codice (un parametro su una rotta che esiste già, che è privata e noindex); solo id pubblici nell'URL, nessun dato personale.
- Rischio principale: link lunghi quando i posti sono tanti; l'import deve sempre chiedere conferma e non deve mai sovrascrivere.
- Regole toccate: nessuna
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 4 / Costo 4 / Carico owner 5

### Idea 7 — Salvare è tenere offline
- In una frase: il tocco su «Salva» mette in cache anche la scheda e la sua copertina ridotta, così «I miei posti» si apre anche senza rete.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): in aereo apri la lista e ci sono tutti i posti, con le foto.
- Dato reale su cui poggia: oggi il service worker esclude dal precache tutte le varianti responsive e non ha una cache per le immagini (`vite.config.ts:61-94`); gli articoli arrivano da Firestore (`Preferiti.tsx:37-66`).
- Cosa richiede: codice (runtime cache al salvataggio; schema v2 tipizzato con migrazione); copia statica degli articoli [VERIFY code-architect].
- Rischio principale: la quota di storage su iOS; una cover ritirata perché non più certificata deve sparire anche dalla cache.
- Regole toccate: imagery-truth (la cache segue la provenienza) | bundle
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 3 / Costo 3 / Carico owner 5

### Idea 8 — La traccia chiede la scheda
- In una frase: su ogni traccia c'è «Avvisami quando c'è la scheda» (via email). Le richieste non si mostrano mai, e dicono all'owner quali tracce scrivere per prime.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): il pubblico sceglie il prossimo posto senza voti né classifiche, e all'owner arriva una lista già ordinata.
- Dato reale su cui poggia: 409 luoghi candidati (§1); 0 dei 897 reel candidati ha una cover su disco (§10), quindi ogni promozione costa una cover e una scheda e serve un ordine. La metrica primaria nell'ipotesi è l'iscrizione email.
- Cosa richiede: backend (una lista o un attributo email per traccia, su Brevo o su Firestore; `server.ts` e `firestore.rules` sono ad alto rischio → travellini-backend-engineer con conferma dell'owner); codice; ore owner per scrivere le schede richieste.
- Rischio principale: una promessa non mantenuta se le schede non arrivano; serve un ritmo dichiarato, da decidere con growth; il consenso privacy per l'email.
- Regole toccate: file-alto-rischio | privacy | metriche-pubbliche (il numero di richieste non si mostra mai)
- Variante: audace. **Dipende dall'ipotesi** che la metrica primaria sia l'iscrizione email.
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 2 / Carico owner 2

### Idea 9 — La mappa senza pubblicità
- In una frase: la voce «Mappa» apre sempre la carta locale dei posti; la mappa interattiva chiede un consenso suo («mappe di servizi esterni»), separato da quello di marketing che oggi accende anche i pixel pubblicitari.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): tocchi «Mappa» e i posti ci sono; attivi la mappa interattiva e non hai accettato nessuna pubblicità.
- Dato reale su cui poggia: «Attiva la mappa» imposta `marketing: true` (`Mappa.tsx:86-93`), e con `marketing` `trackEvent` e `trackPageview` scrivono a Meta e TikTok (`analytics.ts:157-184`) [VERIFY: pixel attivi in produzione]; oggi senza consenso la mappa è un muro scuro (screenshot 04).
- Cosa richiede: codice (una categoria nuova in `consent.ts`, nel banner e nella pagina /cookie); verifica legale [VERIFY]; decisione owner.
- Rischio principale: meno consensi di marketing, quindi meno segnali ai pixel (è una scelta di growth e dell'owner).
- Regole toccate: privacy
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 3 / Costo 4 / Carico owner 4

### Idea 10 — Ogni stato ha un indirizzo
- In una frase: tutto ciò che si può mandare a qualcuno ha un URL (posto sulla mappa, traccia, mese della vista Reel, lista); sfogliare usa `replace` e aprire usa `push`; su desktop la scheda si apre in un pannello ma resta `/posto/<slug>`.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): incolli un link in chat, l'altro vede esattamente la tua schermata e il suo tasto indietro torna dove deve.
- Dato reale su cui poggia: il link della scheda verso la mappa usa `?place=` mentre la mappa legge `?posto=` (`Posto.tsx:79`, `FullScreenMapExperience.tsx:666`); uno slug sconosciuto rimanda senza avviso a /esplora (`Posto.tsx:52-54`).
- Cosa richiede: codice (un contratto unico dei parametri; rotte con «background location»; un test e2e di andata e ritorno per ogni parametro); nessuna rotta nuova.
- Rischio principale: il pannello desktop con URL di pagina complica il focus e il titolo del documento.
- Regole toccate: SEO-URL
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 3 / Costo 4 / Carico owner 5

### Idea 11 — Il tuo atlante, senza account
- In una frase: dalla seconda visita la Home si apre sui posti salvati e la Mappa si inquadra su di loro; sui salvati compare «Verificato di nuovo il …» quando la verifica è più recente del salvataggio.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): la terza volta l'app sembra tua. Si apre sulla tua lista e ti dice cosa è cambiato, senza login e senza un feed.
- Dato reale su cui poggia: `checked {source, at}` e `visitedAt` nel tipo della scheda (`types/content.ts:94-96`); una cronologia di lettura esiste già, dietro il consenso di personalizzazione (`consent.ts:15-19`).
- Cosa richiede: codice (Home a due stati; inquadratura sui salvati; data di salvataggio nello schema v2); «Dove eri rimasto» solo con il consenso.
- Rischio principale: scivolare nel «per te» se si aggiungono suggerimenti, che sono vietati; per chi rifiuta la personalizzazione l'app resta uguale per tutti, ed è corretto.
- Regole toccate: privacy | anti-SaaS
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 4 / Carico owner 5

### Idea 12 — Ci siamo tornati
- In una frase: sui posti con più reel usciti a mesi di distanza, una riga di fatti («Reel di giugno 2023 e di ottobre 2025»), solo dopo che l'owner ha confermato che sono visite diverse.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): senza voti né verdetti, la prova più forte che un posto merita: ci sono tornati.
- Dato reale su cui poggia: 106 luoghi hanno reel pubblicati a più di 30 giorni di distanza, e 62 sono locali veri (§3); la data però è di pubblicazione, quindi due reel possono venire dalla stessa visita.
- Cosa richiede: dati (l'elenco per posto con la conferma dell'owner, posto per posto); una riga di codice nella scheda; ore owner.
- Rischio principale: può essere letto come un giudizio implicito, e l'owner ha tolto ogni giudizio il 15 agosto (`SchedaVerifica.tsx:9-13`). **Dipende da una decisione dell'owner** che un ritorno non sia un verdetto: se lo è, l'idea cade. Privacy: non si mostra mai la geografia dei ritorni.
- Regole toccate: privacy | metriche-pubbliche
- Variante: audace
- Autovalutazione 1-5: Stupore 3 / Verità 3 / Business 3 / Costo 4 / Carico owner 2

## What the receiver should produce

- **Orchestratore (R2):** confermare o respingere per iscritto le 9 decisioni in testa;
  incrociare le voci della barra con la spec del prototipo della direzione, che ne ha 4
  (Home, Esplora, Mappa, I miei posti). La quinta voce, «Noi», aggiunge 1 slot e non
  cambia le misure del piano. Raccogliere le domande qui sotto per il gate R4.
- **travellini-code-architect (R3), verifica di fattibilità:**
  1. confine di Suspense dentro il guscio e delta netto di `initial-js`;
  2. rotte con «background location» per il pannello desktop, e destino di `QuickViewDrawer`;
  3. schema v2 dei salvati, migrazione e campo Firestore (con backend-engineer);
  4. indice statico delle tracce in CI: campi, peso, applicazione della deny-list, fonte dei centroidi;
  5. runtime cache al salvataggio e copia offline delle guide;
  6. contratto dei parametri URL e test e2e di andata e ritorno;
  7. comportamento di storage e installazione nel browser di Instagram e nell'app installata su iOS [VERIFY su dispositivo con browser-auditor].
- **Subito e separato (travellini-frontend-builder):** `?place=` → `?posto=` in
  `Posto.tsx:79`. Non dipende dalla webapp.
- Where it lands: questo file.

## Out of scope (do NOT touch)

- Codice e `src/`. `BEST` è in sola lettura. Nessun file ad alto rischio: l'Idea 8 e il campo
  Firestore dei salvati passano da travellini-backend-engineer con la conferma dell'owner.
  L'architettura di base non richiede `server.ts`.
- Direzione visiva, palette, font e misure pixel: le altezze citate qui sono solo budget di
  stato, compatibili con la spec della direzione.
- Motivazioni di business e metriche (growth); copy definitivo (seo): tutti i testi fra
  virgolette qui sono provvisori.
- Pulizia del corpus nel repo pubblico: travellini-security-auditor e owner.

## Open questions / decisions for the user (per il gate R4, non ora)

1. Cinque voci (con «Noi») o quattro.
2. Togliere la fascia delle edizioni e il gate spento; edizione dedotta dalla rotta e
   cambiata da «Noi» (rivede la decisione del 24 luglio sulla porta a 3 vie).
3. Tracce visibili al pubblico, sempre a livello di comune e mai come punto.
4. Consenso separato per la mappa interattiva, invece del consenso marketing (con verifica
   legale).
5. Home a schermo unico: le sezioni lunghe si spostano in Esplora e in Noi (impatto SEO su `/`
   da valutare con seo-strategist).
6. «Ci siamo tornati»: è un fatto o un giudizio? (Idea 12)
7. «Non ci siamo ancora stati» per le sei regioni a zero.
8. Il file grezzo del corpus nel repo pubblico (con security-auditor).

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2), poi travellini-code-architect (R3,
  fattibilità: vedi l'elenco in 7 punti qui sopra).
- Trigger: questo file esiste con i punti 1-8 e i rilievi del §0.

## Notes

- **Miglioria operativa da registrare** (la nota giusta la sceglie l'orchestratore): un
  contratto unico dei parametri URL, per esempio in `src/config/`, con un test e2e di andata
  e ritorno per ciascun parametro. Il bug `?place=` / `?posto=` è rimasto invisibile perché
  nessun test apre la mappa da una scheda.
- **Compatibilità con la direzione visiva:** barra, piano unico, stati e URL sono gli stessi
  con A e con B. B cambierebbe solo il fondo del guscio, non la struttura. Non ho adottato
  la raccomandazione A/B.
- **Indipendenza:** non ho letto le uscite di growth, social, seo e asset-curator. Numeri dal
  fact pack, con le correzioni del main thread (1.192 reel e 211.941.714 plays in totale;
  409 come cifra d'uso; 533 come tetto).
- **Privacy di questo file:** nessun id di post in deny-list, nessun nome di struttura
  sanitaria o abitazione, nessuna coordinata di zone private; per i luoghi ricorrenti solo
  conteggi. L'unico posto nominato (Granduca di Campigna) è pubblico e compare già nella spec
  della direzione.
- **Deriva documentale:** R5 della roadmap UI/UX (in BEST) descrive un componente spento.
- **Scartate e perché:** una voce «Reel» nella barra (porta al feed); una voce «Cerca» (la
  ricerca vive nella barra alta con ⌘K, e una sesta voce è vietata); anteprime delle tracce
  generate o prese dal CDN di Instagram (imagery-truth, e nessun embed); prezzi delle tracce
  letti dalle caption (non verificati); nascondere la barra durante lo scroll (è un effetto
  legato allo scroll e sposta il bersaglio del pollice).
