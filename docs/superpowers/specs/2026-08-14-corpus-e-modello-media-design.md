---
type: spec
area: content
status: da-approvare
owner: Skott
created: 2026-08-14
related:
  - '[[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]'
  - '[[13_Content/INSTAGRAM_IMPORT_RUNBOOK]]'
tags:
  - spec
  - content
  - instagram
  - media
---

# Corpus Instagram e modello media — design

Sessione del 2026-08-14. Raccoglie le decisioni prese dall'owner in giornata,
nell'ordine in cui le ha prese, e ciò che è stato verificato sul codice.

## 0. La decisione di metodo che ha riordinato tutto

Si era partiti da una revisione della logica delle pagine. L'owner l'ha fermata:

> «prima di tutto dobbiamo importare più reel possibili... prima tu devi sapere
> esattamente tutti i viaggi di TRAVELLINIWITHUS sia il contenuto e poi possiamo
> rendere più avanzato»

È corretta e vincola il resto: **l'architettura editoriale — guide, itinerari,
pagine destinazione — si progetta sul corpus reale, non su un campione.** Stavamo
per decidere la struttura su 79 posti mentre l'archivio ne conteneva 564 non
importati.

Il contenuto demo non era un errore: è impalcatura, scritta per progettare la
struttura delle pagine in vista di pubblicazioni vere. La pagina articolo che ne
è uscita è solida e resta.

## 1. Cosa è stato fatto

Enumerazione completa dello storico dal feed autenticato di Instagram, con
l'owner loggato nel browser dell'app. Metodo e trappole in
`[[enumerare-feed-instagram-autenticato]]` (memoria).

- **1.283 post distinti**, 25 lug 2021 → 13 ago 2026, in `src/data/instagram-corpus.json`
  (1,40 MB, non committato). 1.192 reel, 84 caroselli, 6 foto.
- **Caption integrali**, da 22 a 1.976 caratteri: nessuna troncata.
- **1.085 post con coordinate** (85%): la geocodifica è quasi tutta già nel dato.
- **640 luoghi distinti** per coordinata, 76 già in registro → **564 nuovi**,
  tutti risolti con geocodifica inversa Nominatim (564 su 564, zero fallimenti).
- **Reel e post vanno tenuti separati** (correzione dell'owner, 2026-08-14): dei
  564 luoghi nuovi, **533 hanno almeno un reel**; i restanti **31 esistono solo
  come post** — 30 caroselli, 2 foto, 1 video. Per quei 31 non c'è fotogramma
  verticale né video da collegare, e il blocco reel della scheda resterebbe
  vuoto. **La cifra di lavoro è 533**, non 564.
- Tolti 19 grappoli con etichetta generica («Italia», «Milano»…) che coprono 200
  post da attribuire a mano, restano **545 luoghi con indirizzo preciso**:
  399 in Italia, 144 in 26 altri paesi, 2 senza paese risolto.

### Deny-list: i luoghi che non diventano mai una scheda

**Regola aggiunta il 2026-08-15, prima che l'importatore esista.** Il filtro dei
545 esclude solo le etichette generiche, cioè scarta i luoghi **troppo vaghi** —
e non guarda affatto quelli **troppo privati**. Sono due criteri diversi, e il
secondo mancava.

Il caso che lo ha reso evidente: il post che annuncia la nascita è geotaggato
**«Ospedale Carlo Poma»** con coordinate a sei decimali, `classe: "candidato"`.
Ha un indirizzo preciso, quindi rientra nei 545 e la pipeline lo proporrebbe come
scheda-posto: una pagina indicizzata su un indirizzo sanitario associato alla
nascita di un minore.

Nessuno strumento oggi lo farebbe — `scripts/import-instagram.ts` non chiede
nemmeno il campo location all'API e scrive su un file di review. Ma l'importatore
del corpus non è ancora scritto, ed è **l'unico momento in cui questa regola
costa una riga** invece di una bonifica.

L'importatore deve **scartare, mai proporre**:

1. **Il post `Db72ZqegfYf`** in modo esplicito, per id.
2. **Strutture sanitarie**: ospedali, cliniche, poliambulatori, studi medici,
   case di cura, consultori. Il match va fatto sul nome del luogo, non sulla
   categoria — la categoria Nominatim non è affidabile su questi.
3. **Indirizzi residenziali privati** e ogni luogo che sia riconoscibilmente
   un'abitazione.
4. **Scuole, asili e nidi.**

Il criterio non è «è un posto brutto da mostrare»: è che un luogo **ricorrente e
riconducibile a una persona** non va pubblicato su una superficie indicizzata,
e questo vale a prescindere dal fatto che il post di origine sia pubblico su
Instagram. Un post è un momento; una scheda-posto è una voce permanente in un
registro con coordinate.

> Attenzione al falso amico: «Ospedale delle Bambole» a Napoli **è** un luogo
> visitabile ed è nel corpus. Una deny-list che matcha la sola parola «ospedale»
> lo scarterebbe. Serve il controllo umano sul dubbio, non solo la stringa.

### Il quadro geografico

Quattro posti italiani su cinque sono al Nord: Lombardia 147, Veneto 62,
Emilia-Romagna 48, Piemonte 35, Trentino 13 — 305 su 399. Il Sud è quasi assente:
Campania 15, Calabria 5, Sicilia 2, Puglia 1. **Sardegna, Marche, Friuli Venezia
Giulia, Molise, Basilicata e Norvegia restano a zero**: per quelle il contenuto
non è mai stato girato, e le loro pagine destinazione sono vive e indicizzabili
da sempre senza averne mai avuto la possibilità.

## 2. Modello media — decisione dell'owner

> «i video devono indirizzare al relativo Instagram, però nel sito devi mettere
> l'anteprima come su Instagram» … «vorrei che ci fosse la doppia possibilità»

**Due stati, per singolo posto — e valgono sui reel.**

| Stato          | Comportamento                                                                                                                        | Peso             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| **Default**    | Copertina verticale 9:16, badge play, handle. Il tap apre il reel su Instagram (`/reel/<code>`).                                     | la sola immagine |
| **Con spunta** | Stessa copertina come poster; il tap monta il `<video>` in pagina (`preload="none"`, mai autoplay). Sotto resta «Apri su Instagram». | il video         |

**Un carosello non è un reel e non usa questo componente.** Nessun video da
collegare, nessun fotogramma 9:16 (sono quadrati 1440×1440), permalink `/p/` e
non `/reel/`. Se un giorno i 31 luoghi solo-post entrano in registro, serve un
blocco galleria separato — non una variante di questo con un flag.

Il fallback esiste già: `src/components/article/directives/reel.tsx` è
poster-first e, se il video non carica, ripiega sul permalink Instagram. Il
lavoro è **invertire la priorità** in base a un flag, non riscrivere il
componente.

Le proporzioni sono già quelle giuste: 9:16 in quattro componenti, 4:5 in dieci.

**Escluso: l'embed ufficiale di Instagram.** Carica uno script di terza parte,
traccia i visitatori, e la CI ha due gate bloccanti — CLS ≤ 0,1 e a11y ≥ 0,95 —
che un embed esterno mette a rischio. La copertina ottiene lo stesso effetto
visivo senza nessuno di quei costi.

### I due ostacoli verificati

1. **La spunta non ha dove stare.** Le schede-posto vivono in
   `src/data/content-seed.json`, statico e letto al build. **Non esiste un editor
   admin per i posti** (ci sono articoli, prodotti, site-content, utenti, ordini).
   Oggi la spunta è un campo nel JSON, non una casella cliccabile.
2. **I video non arrivano in produzione.** `public/video/` pesa **429 MB, 52 MP4,
   ed è gitignored**: la CI non li ha, il `dist/` non li contiene. Sul localhost
   funzionano, sul sito pubblicato no. `VITE_VIDEO_BASE_URL` non è dichiarata.

### Hosting — deciso

**Object storage a egress zero** (Cloudflare R2 o equivalente), puntato da
`VITE_VIDEO_BASE_URL` — variabile che `src/utils/mediaUrl.ts` prevede già
esattamente per questo. Motivazione già scritta nel codice: Firebase Hosting
regala 360 MB di transfer al giorno, «una dozzina di reel visti esaurisce la
quota giornaliera», e oltre si paga 0,15 $/GB — un costo che cresce proprio
quando il sito inizia a funzionare.

L'account lo apre l'owner. Le credenziali restano nel suo `.env`.

## 3. Priorità, e perché in quest'ordine

1. **Modello a due stati con Instagram di default.** È codice, non dipende da
   nessun account, e sblocca tutti e 564 i posti nuovi — che un video non ce
   l'hanno e non lo avranno.
2. **Primo lotto di import: 21 reel** che accendono **sette pagine oggi vuote**
   — Trentino-Alto Adige, Liguria, Umbria, Sicilia, Abruzzo, Valle d'Aosta,
   Puglia. Nel lotto erano finiti anche 5 caroselli: sono scaricati ma tenuti
   fuori, perché non sono reel. Nove hanno **già il prezzo nella caption**
   (Hi Hotels 250€, Acquario di Genova 360€, Löwenhof 78€, Borgo La Chiaracia
   85€, Augurio 75€). La Lombardia è il filone profondo — 147 posti — ma partire
   da lì non accende niente che oggi sia spento.
3. **Storage e spunta.** Riguardano solo i 52 posti che un video ce l'hanno: non
   sono sul percorso critico.
4. **Editor admin dei posti.** Non deciso. È il pezzo che manca davvero per
   gestire 564 schede senza passare da una sessione di lavoro.

## 4. Divisione del lavoro

**Io:** bozze complete delle schede — titolo, descrizione, prezzo, rapporto
dichiarato, coordinate già risolte — derivate dalle caption integrali.

**Owner:** due cose che non sono delegabili.

- **Guardare le copertine.** La regola imagery-truth è dell'owner e vale:
  nessuna cover entra senza che l'abbia vista un umano.
- **Scrivere il verdetto «per chi è / per chi no».** Nelle caption non esiste in
  forma pronta, perché su Instagram il video mostrava il posto. Oggi esiste su
  **1 scheda su 79**, mentre la home promette «Ti diciamo se vale il viaggio»:
  è il campo che mantiene la promessa del sito, ed è vuoto quasi ovunque.

## 5. Rimandato, non chiuso

La revisione della logica delle pagine resta aperta e non blocca l'import.
Documentata in [Registro delle superfici]; in sintesi: quattro contatori diversi
per lo stesso archivio lungo un solo percorso (79 in home, 110 nell'indice, 109
sulla mappa, 6 su `/esplora`), due pulsanti con la stessa etichetta «Apri il
registro» che vanno in due posti diversi, una voce di menu che non si accende
mai su `/articolo/*`, e `/esplora` che è l'unica pagina ancora costruita attorno
all'articolo mentre tutto il resto del sito è costruito sulla scheda-posto.

Va ripresa **dopo** che il corpus è dentro, come deciso al punto 0.
