import { Timestamp } from 'firebase/firestore';
import type { ArticleSeed } from './types';

/**
 * Pillar approvato dall'owner il 2026-08-18 (report «Comitato Travellini»):
 * un solo articolo capofila, su dati reali. Scelto sull'analisi di
 * src/data/instagram-corpus.json — alloggi particolari: mediana 50.091 play
 * su 105 reel, con Emotional Grand Motel a 4,5M (reel n°2 di sempre).
 * Le voci escono SOLO dal registro (content-seed.json): 16 alloggi italiani
 * reali, 9 dei quali organic. Disclosure per voce nel corpo.
 *
 * H1/meta title, excerpt e tags: docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md,
 * sezione ## SEO. Corpo: stessa nota, sezione ## Body (dal separatore dopo
 * l'intestazione fino a prima di «Note di consegna»), con le 5 section photo
 * inserite nei punti indicati dalla sezione ## Assets.
 */
export const articleSeed: ArticleSeed = {
  title: 'Posti che sembrano inventati, e ci dormi',
  slug: 'dormire-posti-sembrano-inventati',
  excerpt:
    'Dieci alloggi italiani che sembrano scenografie: casa di specchi, bolla nel bosco, spa in grotta. Ci siamo stati davvero, e diciamo chi ci ha invitato.',
  content: `Il primo posto di questa lista sta a cento metri da un casello autostradale. Si esce a Borgomanero sulla A26, si svolta, ed è lì. La stanza si chiama Celebrity: letto rotondo dentro una gabbia dorata, pareti rosse, una vasca che non somiglia a nessuna vasca d'albergo. Alla reception, oltre alla notte, si prenotano anche soggiorni a ore. Messe in fila, queste cose non sembrano dello stesso indirizzo. Invece sono tutte l'Emotional Grand Motel, a Fontaneto d'Agogna, provincia di Novara.

Il reel è di settembre 2024, il più vecchio di questa pagina, e lo scriviamo subito: la domanda che ci fate ogni volta non è «è bello?», è «esiste davvero o è montato bene?». Qui sotto ci sono dieci alloggi italiani in cui abbiamo dormito, in tre gruppi: quattro dove la cosa improbabile è la struttura, quattro dove sta dentro la camera, due dove è quello che si vede aprendo la finestra. Per ognuno trovate cos'ha di strano, com'è passarci una notte e per chi non funziona — che di solito è l'informazione più utile.

Due cose prima di cominciare. Sette di questi dieci ce li siamo scelti noi: nessuno ci ha invitati, nessuno ci ha pagati per parlarne, e infatti sulla loro scheda non compare nessuna etichetta. Gli altri tre ce l'hanno, scritta dentro la voce e non in fondo alla pagina. E tutte e dieci le schede le abbiamo ricontrollate sui siti delle strutture il 15 agosto 2026: dove un prezzo non compare, non l'avevamo verificato.

## Quattro alloggi che sembrano scenografie

Qui quello che non torna si vede da fuori, prima di entrare. E si arriva in auto e basta: nessuno di questi quattro indirizzi sta dentro un centro abitato.

### Un letto dentro una gabbia dorata

Le stanze sono a tema e una diversa dall'altra: noi abbiamo dormito nella Celebrity, quella con la gabbia. Colazione a scelta, in camera o al buffet. Il prezzo cambia con la stanza e con quanto ci si ferma, per questo qui non ne troverete uno: quello della Celebrity non varrebbe per nessun'altra.

Non è un posto per tutti, e non per la ragione che sembra. È un motel a tutti gli effetti, coi soggiorni a ore che avete letto sopra: non aspettatevi il silenzio di un albergo di charme, e non prendetelo come base per girare la zona. Si va lì per la stanza, e la stanza è tutto il viaggio. Con l'Emotional Grand Motel abbiamo una collaborazione, dichiarata sulla scheda e dichiarata qui: è l'unico dei dieci con questa etichetta.

:::posto{id="novara-emotional-grand-motel"}
:::

### Una casa rivestita di specchi, in Lunigiana

Spino Fiorito Stay è una casa interamente rivestita di specchi, in località Padula, fuori da Casola in Lunigiana. Gli specchi riflettono il bosco intorno e cambiano colore con la luce del giorno: il risultato è che da lontano la casa non si vede, si vede il bosco spostato di qualche metro. Dentro c'è una sauna con la vetrata puntata sulle montagne, e finisce che si sta lì.

La scheda dice una frase che sottoscriviamo: si arriva in auto, poi si sta. Non c'è un programma, non c'è niente da raggiungere a piedi. Se vi serve un bar sotto casa o qualcosa da fare alle sei di sera, questo non è il posto: il vuoto intorno è il servizio principale, e o lo cercate o vi pesa. Ci siamo andati per conto nostro, senza accordi con nessuno; il reel è di ottobre 2025, e la scheda di [Spino Fiorito Stay](/posto/casola-spino-fiorito) ha indirizzo e telefono.

:::reel{posto="casola-spino-fiorito"}
:::

### Una bolla di tela nel bosco, senza internet

Placat è un campeggio nuovo dentro il bosco sopra il lago d'Iseo, al Parco di Gavazzano, a Bossico. Si dorme in strutture geodetiche di tela con una vetrata che dà sugli abeti. Si arriva in auto fino a un certo punto, poi si cammina su passerelle di legno: detto così sembra un dettaglio, e invece decide come fate la valigia.

La cosa che separa Placat dagli altri nove non è la forma della tenda: è che non c'è internet. Non «prende poco»: non c'è, ed è una scelta loro. Vuol dire che la sera avete davanti gli abeti oltre il vetro, e nient'altro, e che se dovete rispondere a un messaggio di lavoro entro domenica non è qui che dovete venire. Ci siamo andati per conto nostro, nessuno ci ha chiamati; il reel è di luglio 2025. La scheda è quella di [Placat](/posto/bossico-placat).

![Struttura geodetica di tela fra gli abeti del bosco di Bossico, con la luce che filtra tra i tronchi.](/images/articles/dormire-posti-sembrano-inventati/section-bossico-placat.webp)

### Una rete sospesa fra i tronchi, e sotto il vuoto

Alle Fattorie di Celli, in località Celli appena fuori Poppi, ci sono reti sospese fra i tronchi con i cuscini sopra: ci si sdraia, e sotto non c'è niente. È l'immagine del bosco del Casentino che gira di più, ed è vera — nel nostro video siamo noi due lassù.

Qui però va detta una cosa che gli elenchi copiati non dicono: la rete è la rete, e gli alloggi sono alloggi nel bosco. Se la vostra domanda è «ci si passa la notte, lassù?», fatela a loro prima di prenotare: il telefono sta sulla scheda, e una chiamata da un minuto vale più di dieci articoli. Non è un posto per chi il vuoto sotto i piedi lo sente. Ci siamo andati per conto nostro; il reel è di settembre 2025, e la scheda è quella delle [Fattorie di Celli](/posto/poppi-fattorie-di-celli).

![Coppia seduta su cuscini sopra una rete sospesa fra i tronchi, nel bosco delle Fattorie di Celli a Poppi.](/images/articles/dormire-posti-sembrano-inventati/section-poppi-fattorie-di-celli.webp)

## Quattro camere con dentro una spa, una jacuzzi o un cinema

Da qui in avanti, da fuori non si vede niente: quattro posti normali visti dalla strada, con la cosa improbabile dentro. Sono anche le quattro voci in cui il weekend è la camera — se uscite tutto il giorno, avete speso male.

### Una spa dentro una grotta, con l'aperitivo

Il Granduca di Campigna sta a Santa Sofia, in Emilia Romagna, dentro le foreste casentinesi — le stesse di Celli, viste dall'altro versante. Gli appartamenti sono grandi, alcuni con la jacuzzi in camera, e la cena di prodotti locali si può farsi portare in stanza. Ma la ragione per cui è in questa lista è la spa: è ricavata in una grotta di pietra, con la piscina illuminata di blu, e l'aperitivo si beve lì dentro.

La grotta e la spa si usano a turni privati, non in comune: lo slot si prenota, non ci si presenta e basta. E gli animali sono ammessi — è l'unica delle dieci schede che lo dichiara. Si parte da 98€ a notte, la tariffa più bassa dei dieci: la prova che «insolito» e «caro» non sono la stessa parola. Nessuno ci ha invitati, ci siamo andati per conto nostro; il reel è di gennaio 2026.

:::posto{id="emilia-granduca-di-campigna"}
:::

### Una jacuzzi riscaldata con vista, in uno chalet

Narciso Home è uno chalet a Grone, in provincia di Bergamo, comodo anche da Milano, Brescia e Orio al Serio. Dentro: sauna, doccia emozionale e una jacuzzi riscaldata puntata sulla natura. Nel soggiorno sono inclusi un aperitivo con prodotti del territorio e il necessario per cena e colazione: una volta chiusa la porta non dovete più uscire. È il senso del posto ed è anche il suo limite: qui si entra il venerdì e si esce la domenica.

Questa voce è pubblicità: ci hanno pagato per parlarne, e sulla scheda è marcata ADV. Sta in mezzo alle altre, con lo stesso spazio e lo stesso metro, perché l'etichetta dice da dove arriva la voce, non quanto vale il posto. Se un giorno leggete un nostro ADV senza questa riga, l'errore è nostro. Il reel è di maggio 2026; la scheda è quella di [Narciso Home](/posto/grone-narciso-home-chalet).

:::reel{posto="grone-narciso-home-chalet"}
:::

### L'aperitivo servito a bordo della jacuzzi in camera

Enjoy House sta dentro il borgo medievale di Bracciano, quello affacciato sul lago, in via dell'Arazzeria. La suite ha una jacuzzi privata in camera e l'aperitivo ve lo portano lì: nel nostro video si vede il tagliere di salumi e fritti appoggiato sul bordo della vasca, fra la schiuma e le luci azzurre. È un po' kitsch. Funziona lo stesso.

Il ristorante e le suite sono della stessa proprietà, a pochi passi di distanza: comodo, ma vuol dire anche che non siete isolati. Siete dentro un paese, e il paese si gira a piedi con calma — se quello che cercate è il silenzio della campagna, questo non è. Ci siamo andati per conto nostro, nessun accordo; il reel è di ottobre 2025 e la scheda è quella di [Enjoy House Bracciano](/posto/bracciano-enjoy-house).

![Tagliere di salumi, formaggi e fritti appoggiato sul bordo di una jacuzzi con luci azzurre, a Enjoy House Bracciano.](/images/articles/dormire-posti-sembrano-inventati/section-bracciano-enjoy-house.webp)

### Un cinema da cento pollici dentro la camera

Suite Spa Civico 4 non è un hotel: è una suite privata a Follonica, in via Ludovico Ariosto, con ingresso indipendente e pensata esclusivamente per due persone. Dentro ci sono sauna a infrarossi, vasca idromassaggio, doccia emozionale e uno schermo da cento pollici davanti al letto. È la cosa più assurda di tutta la lista, perché è l'unica che non c'entra niente col paesaggio: potreste essere ovunque.

È dichiaratamente solo per maggiorenni — un minore entra unicamente accompagnato e con delega del genitore — quindi no, non è un posto per famiglie, e non lo diciamo noi. Si parte da 190€ a notte, 210€ nel weekend: è il tetto dei dieci. Qui ci hanno invitati, e sulla scheda leggete «Su invito»; il reel è di giugno 2026. Con le altre voci toscane della lista la trovate nella [pagina della Toscana](/destinazione/italia/toscana). Scheda: [Suite Spa Civico 4](/posto/toscana-suite-spa-civico-4).

![Due schermi sovrapposti che proiettano un film, in luce viola, dentro la Suite Spa Civico 4 in Toscana.](/images/articles/dormire-posti-sembrano-inventati/section-toscana-suite-spa-civico-4.webp)

## Due posti dove la cosa improbabile è la vista

Gli ultimi due non hanno niente di strano in camera. Hanno la finestra al posto giusto, che è la cosa più difficile da rimediare: una spa si costruisce, una vista no.

### Una jacuzzi con Capri davanti

Il Relais Freedom Club sta in via Titigliano, a Massa Lubrense, in penisola sorrentina, fra Sorrento e la costiera. La terrazza guarda il mare con Capri all'orizzonte, e sopra ci sono piscina, jacuzzi, lettini e un bar a bordo vasca. La descrizione della scheda è onesta e la copiamo volentieri: si sta lì tutto il giorno, è quello il punto.

Che è anche l'avvertimento. Se il piano prevede di muoversi ogni mattina — gli scavi, i traghetti, la costiera in auto — questo posto vi lavora contro: pagate una terrazza e la usate due ore prima di cena. Ci siamo andati per conto nostro, nessuno ci ha chiamati; il reel è di agosto 2025 e la scheda è quella del [Relais Freedom Club](/posto/massa-lubrense-relais-freedom).

![Due persone sedute su una terrazza con vista sulla costiera sorrentina e Capri all'orizzonte, al Relais Freedom Club.](/images/articles/dormire-posti-sembrano-inventati/section-massa-lubrense-relais-freedom.webp)

### Una villa del Trecento con Firenze davanti

Villa Tolomei è una villa trecentesca, costruita dai Tolomei sulle colline di Marignolle, fuori dal centro storico di Firenze. All'ingresso si arriva da un viale di cipressi che scende lungo la collina con la città sullo sfondo: è la prima cosa che si vede, ed è già mezza ragione per venire. Poi ci sono due ore di spa privata con sauna e bagno turco, il massaggio di coppia e una piscina panoramica esterna con Firenze davanti.

La cosa da mettere in conto è proprio quella distanza: la sera non si esce a piedi per un giro in città, o si scende in auto o si resta. Per noi restare è la scelta giusta, ma va decisa prima, non alle otto di sera con la fame. Nessuno ci ha invitati, ci siamo andati per conto nostro; il reel è di dicembre 2025.

:::posto{id="firenze-villa-tolomei"}
:::

Su una cartina stanno su sei regioni e non si toccano quasi mai: per capire quale vi cade più vicino, sono tutti nella [mappa](/mappa).

E allora diciamola tutta, perché è la domanda vera. Funziona se siete in due, se partite il venerdì sera per una o due notti e se accettate che il viaggio sia la stanza: nessuna di queste dieci è un buon quartier generale per visitare qualcos'altro. Non funziona con i bambini, se vi serve il wi-fi per lavorare, o se prenotare un posto strano è il modo per non decidere dove andare. In quel caso spendete meno e dormite meglio in un albergo normale, e non è una battuta.

:::dati{tipo="pratiche" titolo="Sei righe che cambiano il weekend"}

- Senza auto ne resta uno · Granduca di Campigna: treno fino a Forlì, poi la linea 132 di Start Romagna verso Santa Sofia
- Il più semplice · Emotional Grand Motel, a cento metri dal casello di Borgomanero sulla A26
- Dove internet non c'è · Placat, sopra il lago d'Iseo: l'ultimo pezzo si fa a piedi, su passerelle di legno
- Solo maggiorenni · Suite Spa Civico 4, a Follonica: un minore entra accompagnato e con delega del genitore
- Con il cane · Il Granduca dichiara gli animali ammessi; nessuna delle altre nove schede lo dichiara
- Fuori dal centro, quasi sempre · Spino Fiorito in località Padula, Celli fuori da Poppi, Villa Tolomei sulle colline di Marignolle

:::

## Due posti dove non si dorme, e ve li diciamo lo stesso

Due voci non sono entrate nella lista qui sopra per un motivo solo: non ci si dorme. Le scriviamo comunque, perché sono fra i posti più strani che abbiamo visto, e perché tenerle in mezzo agli alloggi avrebbe fatto danni.

Il Chiostro Cennini, a Sarteano in provincia di Siena, è un ristorante ricavato in un chiostro quattrocentesco. Si comincia con un aperitivo su un'altalena, con prodotti di loro produzione, poi arriva una cucina tipica rivisitata con menù stagionale, e a fine serata ci si può fermare nel chiostro anche solo per il dopocena. Da sapere prima: è chiuso il giovedì, e la prenotazione è obbligatoria con carta a garanzia — non è un posto in cui capitare. Qui ci hanno invitati; il reel è di luglio 2026.

La Contea del Vignolo Fiorito, a Graffignana in provincia di Lodi, è un agriturismo con molti animali, buona parte salvati da situazioni difficili. Ci si va per la giornata: la piscina costa 40€ d'ingresso, 50€ con il lettino, e nel prezzo c'è il pranzo a buffet oppure l'apericena. Il ristorante apre sabato e domenica — pranzo dalle 12:45, cena dalle 19:30 — e in settimana solo per eventi. Questa è pubblicità: ci hanno pagato per parlarne, ed è marcata ADV. Il reel è di giugno 2026.

Il motivo per cui quei 40€ stanno scritti qui e non in mezzo agli alloggi è semplice: sono il biglietto di una giornata in piscina. Dentro un elenco di posti dove dormire, un numero così si legge come una tariffa a notte — e nessuno lo avrebbe scritto davvero: sarebbe successo e basta, in silenzio. È il tipo di errore che rende inutili le liste copiate.

## Le domande che ci fate ogni volta

:::domande

### Quanto costa dormire in questi posti?

Di tariffe a notte ne pubblichiamo due, perché due sono quelle che abbiamo verificato: il Granduca di Campigna parte da 98€, la Suite Spa Civico 4 da 190€, 210€ nel weekend. Sugli altri otto non scriviamo un numero: le tariffe cambiano con stagione, stanza e durata, e una cifra sbagliata qui vi farebbe programmare un weekend sui nostri errori. Telefono e sito di ognuno stanno sulla scheda.

### Sono posti adatti a chi viaggia con bambini?

No, e su una è la struttura stessa a dirlo: la Suite Spa Civico 4 è solo per maggiorenni. Le altre nove non sono vietate, ma nessuna è pensata per una famiglia: sono suite per due, chalet per due, alloggi dove il servizio è il silenzio. Con i bambini si va da un'altra parte, e non è una rinuncia.

### Ci siete stati davvero o li avete solo visti?

Ci abbiamo dormito. Ognuna delle dieci ha un nostro reel — le date stanno dentro ogni voce, dal settembre 2024 al giugno 2026 — e una scheda con indirizzo, coordinate e telefono, ricontrollata sui siti delle strutture il 15 agosto 2026. È il motivo per cui certe righe qui sono meno lusinghiere di quelle che leggete altrove: chi non c'è stato non ha niente da correggere.

### Che differenza c'è fra le voci con l'etichetta e le altre?

Sette delle dieci sono senza etichetta, e vuol dire che non c'è nessun rapporto commerciale: nessun invito, nessun compenso, nessun accordo. Delle altre tre: con l'Emotional Grand Motel c'è una collaborazione, alla Suite Spa Civico 4 ci hanno invitati, Narciso Home è un ADV. La differenza sta in come ci siamo arrivati, non in come ne scriviamo — anche nelle tre voci con l'etichetta trovate scritto per chi non vanno bene, ed è lì apposta.

:::

## Sette su dieci non ce li ha offerti nessuno

Sette di questi dieci non ce li ha offerti nessuno, e sulla loro scheda non vedete nessuna dicitura: l'assenza non è una dimenticanza, è l'etichetta. Le altre tre — la collaborazione, l'invito, l'ADV — le avete già lette, dichiarate una per una dentro le voci.

Se dovete sceglierne uno solo, prendete quello che vi ha fatto fermare la prima volta, aprite la scheda e telefonate. Sono dieci posti, non un itinerario: se ne prenotate uno per un venerdì sera, questa pagina ha fatto il suo lavoro. Gli altri, quelli che non sono entrati qui dentro, stanno tutti nel [registro](/esplora).

Se gestite una struttura e volete sapere come lavoriamo prima di scriverci, sta scritto nella [pagina collaborazioni](/collaborazioni).`,
  category: 'esperienze',
  destination: 'Italia',
  partnership: { kind: 'organic' },
  tags: ['italia', 'alloggi-insoliti', 'posti-particolari', 'weekend-di-coppia', 'dormire'],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  /* Ritaglio (non generazione) del fotogramma reale della cover reel EGM, sotto
     la title-card bruciata: stessa scena del primo paragrafo del corpo ("letto
     rotondo dentro una gabbia dorata, pareti rosse"). Dettagli crop/peso/scelta
     su Spino Fiorito scartata: ARTICLE_dormire-posti-sembrano-inventati.md,
     sezione ## Assets -> ### Hero photo. Provenienza real-frame registrata in
     asset-provenance.json (prefisso /images/articles/dormire-posti-sembrano-inventati/). */
  coverImage: '/images/articles/dormire-posti-sembrano-inventati/hero-emotional-grand-motel.webp',
  imageAlt:
    "Letto rotondo dentro una gabbia dorata con pareti e tende rosse, all'Emotional Grand Motel di Novara.",
  /* Card fotografica composta (stesso soggetto dell'hero, ricadrato 1200x630 +
     scrim + testo + wordmark), non il template tipografico standard: prova
     visiva della tesi del pezzo ("ci siamo stati davvero"). Senza questo campo
     Articolo.tsx ricadrebbe sulla coverImage grezza per l'unfurl social. */
  ogImage: '/og/dormire-posti-sembrano-inventati.jpg',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
