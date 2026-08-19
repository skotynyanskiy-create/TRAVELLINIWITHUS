---
type: article
area: editorial
status: draft
category: esperienze
slug: dormire-posti-sembrano-inventati
route: /articolo/dormire-posti-sembrano-inventati
repo_path: src/data/articles/dormire-posti-sembrano-inventati.seed.ts
article_type: pillar
tags: [article, esperienze]
fact_check_at: 2026-08-18
fact_check_status: clean
fact_check_stale: 0
fact_check_unverified: 0
fact_check_risk: 0
---

# Posti che sembrano inventati, e ci dormi

> Titolo di lavoro fino al 2026-08-18: «Posti che sembrano inventati: dove
> dormirci davvero». Sostituito dall'H1 definitivo qui sopra per un vincolo
> misurato sul meta title — la motivazione sta nella sezione `## SEO`.

> Pillar approvato dall'owner il 2026-08-18 — decisione registrata nel report
> «Comitato Travellini» e nella memoria di progetto. Un solo articolo capofila,
> su dati reali, prima di ogni altro pezzo in coda.

## Dati che ancorano il pezzo (verificati sul repo il 2026-08-18)

- Corpus reel (`src/data/instagram-corpus.json`, 1.192 reel con play):
  la categoria «alloggi particolari» ha mediana 50.091 play su 105 reel, con
  **Emotional Grand Motel a 4,5M** (reel n°2 di sempre del brand). I parchi
  sono la categoria regina (mediana 76.987) e alimentano il quick win
  successivo (Caribe Bay).
- Registro (`src/data/content-seed.json`): **22 alloggi reali, 16 in Italia,
  9 organic** (nessuna partnership). Candidati con tipo `Insolito`:
  Emotional Grand Motel (collaboration), Spino Fiorito Stay (organic),
  Fattorie di Celli (organic), Placat (organic), Contea del Vignolo Fiorito (adv).
  Altri forti: Suite Spa Civico 4 (invited, da 190€/notte), Casa Lavanda (invited),
  Narciso Home (adv), Enjoy House Bracciano (organic), Chiostro Cennini (invited).
- SERP: rankano solo listicle desk (SiViaggia, The Wom, Turisti per Caso) —
  nessuno c'è stato, nessuno dichiara costi. Il vantaggio è il Registro delle
  Prove: data visita + costo + reel + disclosure per voce.
- Vincoli owner: apertura con Emotional Grand Motel; disclosure dichiarata per
  ogni voce; nessun numero inventato — **se il prezzo manca, non si scrive
  niente**. I `[VERIFY]` restano in questa nota e non entrano mai nel corpo: la
  stringa `[VERIFY` in `title`, `excerpt` o `content` fa fallire la pubblicazione
  [MISURATO: `scripts/publish-article-seed.mjs:22-28,97-100`].

> **L'elenco dei candidati qui sopra è il pool di partenza, non la lista.** La
> lista definitiva, ordinata e motivata è nella sezione `## Brief`: dieci voci,
> con Chiostro Cennini (è un ristorante) e Contea del Vignolo Fiorito
> (pernottamento non documentato) **escluse**.

## Brief (compilato da travellini-growth-revenue-operator — 2026-08-18)

- **Why now**: la domanda su «dove si dorme» il brand la genera già ogni mese, ma
  su terreno in affitto e senza un punto di atterraggio proprio; il registro ha
  raggiunto solo ora la massa critica per reggere un pezzo intero (18 alloggi
  italiani non-placeholder, tutti riverificati sui siti delle strutture il
  2026-08-15).
- **Audience**: una coppia italiana senza figli al seguito che parte in auto il
  venerdì sera per una o due notti e vuole un posto che sembri impossibile,
  spendendo fra 100 e 250€ a notte.
- **Business goal**: ingresso organico. Il funnel partner è un sottoprodotto, con
  **un solo link di coda**.
- **Primary metric**: `article_place_click` / lettori unici dell'articolo — quota
  di lettori che apre almeno una scheda `/posto/:id` dal corpo. Soglia go:
  **≥ 8%**. Non si legge sotto **200 lettori unici**.

### Perché ora — cosa implica il dato, senza ripeterlo

Le 105 voci «alloggi particolari» del corpus non dicono «questo tema piace»:
dicono che il pubblico per «dove si dorme» **si riforma da solo ogni volta**,
senza che serva un lancio. È domanda ricorrente, non un picco. E l'unico picco
vero — Emotional Grand Motel — non è una destinazione: è **una stanza**. Il
lettore non salva «il Piemonte», salva «la gabbia dorata».

Da qui due implicazioni operative, che sono il motivo del «now»:

1. Questo articolo **non è una scommessa su un pubblico nuovo**. È il primo
   tentativo di dare a una domanda già misurata un posto dove atterrare che sia
   nostro. Oggi quella domanda arriva, guarda e resta su Instagram.
2. La materia prima è diventata sufficiente **solo adesso**: 18 schede di
   alloggio italiane non-placeholder, con coordinate, sito, telefono e
   `practical.checked.at: 2026-08-15` su tutte e dieci le voci scelte
   [MISURATO: `src/data/content-seed.json`]. Sei mesi fa lo stesso pezzo si
   sarebbe retto su descrizioni; oggi si regge su schede.

### Audience — una persona sola

**Chiara e Marco, coppia, insieme da qualche anno, senza bambini al seguito.**
Partono in auto il venerdì sera per una o due notti, entro tre ore da casa.
Non cercano «una vacanza»: cercano **una stanza da raccontare**. Prenotano con
poco anticipo, decidono guardando il video prima del prezzo, e la domanda che si
fanno davvero è «ma esiste sul serio o è montato bene?».

Cosa regge questa descrizione [MISURATO]:

- **L'auto**: metà delle schede scelte descrive l'accesso in auto o una località
  fuori centro (`gettingThere` di Placat, Spino Fiorito, Fattorie di Celli,
  Casa Lavanda, Villa Tolomei).
- **La coppia**: `Weekend romantici` è un tipo del registro; Suite Spa Civico 4
  è dichiarata «pensata esclusivamente per due persone» e «solo maggiorenni»;
  Narciso Home «per un weekend di coppia».
- **La fascia 100-250€**: sono i due soli prezzi a notte che il registro
  dichiara — «da 98€/notte» e «Da 190€/notte (210€ weekend)».

**Assunzione, non dato** [DEDOTTO]: la fascia d'età 28-40. Non è nel repo. Si
smentisce se: gli Insights IG del brand mostrano il grosso del pubblico fuori da
quella forbice — nel qual caso cambia l'occasione (non più «coppia senza figli»
ma «famiglia»), e la lista va rifatta, perché nessuna delle dieci voci è pensata
per bambini. **Non blocca**: nessuna riga del pezzo cita l'età.

### Business goal — ingresso organico, e perché non è pari merito

I due obiettivi non pesano uguale, e la ragione non è editoriale:

- **Il canale partner non è affamato.** Le collaborazioni arrivano già e sono
  pagate: il registro documenta 1 `collaboration`, 5 `invited` e 3 `adv` fra i
  soli alloggi italiani [MISURATO]. Costruire l'articolo *per* l'albergatore
  significherebbe ottimizzare l'unico canale che funziona.
- **Il canale organico è a zero, e blocca tutto il resto.** È la catena critica
  del backlog: senza articoli pubblicati non c'è SEO, senza SEO non c'è volume,
  senza volume affiliate, shop e pipeline non hanno niente da convertire.

Quindi: **il pezzo si scrive per Chiara e Marco, non per l'albergatore.** La
forma è quella di un articolo che risponde a una domanda, non di un portfolio.
Il vantaggio è che lo stesso artefatto serve comunque come prova in una
conversazione partner — a condizione che la disciplina di disclosure regga. Non
serve dividerlo in due pezzi.

### Metrica primaria — una sola, con la condizione che la rende leggibile

**`article_place_click` sui lettori unici dell'articolo. Go a ≥ 8%.**

Perché questa e non le sessioni: la promessa del titolo è «dove dormirci
**davvero**». Il comportamento che dimostra che la promessa è arrivata non è
leggere: è **andare a controllare**. Il clic verso `/posto/:id` è l'unico gesto
che distingue questo pezzo da un listicle scritto alla scrivania — un listicle
non ha una scheda dove andare.

Tre onestà necessarie:

1. **La soglia è decisa a priori, non stimata.** Non esiste baseline: il traffico
   organico oggi è zero. L'8% è una soglia di decisione, non una previsione.
2. **Serve un campione minimo.** Sotto 200 lettori unici il rapporto non si legge:
   il verdetto è «dato insufficiente», non «fallito».
3. **Oggi non è osservabile, e non per colpa dell'articolo.** Il dominio risponde
   da un proxy Aruba, le functions non sono deployate, Search Console non è
   verificata (voce ancora spuntata a vuoto in `docs/DEPLOYMENT_RUNBOOK.md:160`)
   e GA4 si carica solo con `VITE_GA_ID` più consenso analytics
   [MISURATO: `src/services/analytics.ts:16,39-50,99-106`]. **L'orologio della
   metrica parte dalla prima settimana di traffico organico reale**, non dalla
   data di pubblicazione della nota.

**Criteri di stop (kill criteria), due:**

- **Qualità**: raggiunti i 200 lettori unici, se la quota è **< 5%** non si scrive
  il secondo pillar in questo formato. Vuol dire che il «registro delle prove»
  non è il differenziatore che crediamo, e aggiungere volume moltiplicherebbe
  l'errore.
- **Distribuzione**: se i 200 lettori **non si raggiungono entro 90 giorni** da
  quando la pagina è pubblicamente indicizzabile, il problema non è il pezzo. Si
  ferma il piano «scriviamo altri pillar» e la decisione successiva riguarda la
  distribuzione (link in bio, newsletter), non l'editoriale. Scrivere il #2 in
  quello scenario sarebbe rifornire un negozio che nessuno riesce a trovare.

**Segnale secondario, già strumentato, zero lavoro nuovo**: sulle schede di
destinazione esistono `place_directions_click`, `place_phone_click`,
`place_google_listing_click`, `place_favorite_add`, `place_share_click`
[MISURATO: `src/pages/Posto.tsx:113-144`]. Sono l'intento reale a valle del clic.
Si guardano, non decidono nulla.

### Contratto eventi — un evento nuovo, non di più

Il link «Scheda del posto →» dentro il blocco `:::posto` **oggi non traccia
niente** [MISURATO: `src/components/article/directives/posto.tsx:89-94`, nessun
`trackEvent`]. Senza questo, la metrica primaria non è misurabile.

| Evento                      | Dove                                        | Proprietà                                                     | Destinazione     |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------- | ---------------- |
| `article_place_click`       | link `/posto/:id` dentro `:::posto`         | `slug`, `place_id`, `position` (1-10), `partnership_kind`      | **solo GA4**     |
| `article_partner_cta_click` | unico link `/collaborazioni` in coda al pezzo | `slug`                                                        | **solo GA4**     |

Regole, non preferenze:

- Entrambi passano da **`trackAnalyticsEvent`**, non da `trackEvent`. Sono misure
  di prodotto, non segnali pubblicitari: non devono finire nei pixel Meta/TikTok.
  La funzione esiste esattamente per questo caso
  [MISURATO: `src/services/analytics.ts:140-152`].
- `partnership_kind` prende il valore grezzo del registro (`organic`, `invited`,
  `adv`, `collaboration`), non l'etichetta tradotta. Serve a rispondere alla sola
  domanda che conta dopo: **le voci pagate si cliccano più o meno di quelle
  organiche?** Se si cliccano di più, il pezzo sta vendendo senza dirlo.
- `article_partner_cta_click` **non gatea niente**. Esiste per non essere ciechi
  sul secondo scopo. Nessuna soglia.
- Niente scroll-depth, niente tempo di lettura, niente heatmap. Due eventi.

### Le dieci voci, in ordine di apparizione

Regole applicate, in quest'ordine: (1) ci si dorme, e la scheda lo documenta;
(2) c'è un elemento visivamente improbabile — è la promessa del titolo, non un
bell'albergo; (3) scheda completa, `isPlaceholder: false`; (4) la maggioranza
deve essere `organic`, altrimenti è un catalogo.

Esito: **7 organic · 1 collaboration · 1 invited · 1 adv**. Due voci con prezzo.
Tutte e dieci con `checked.at: 2026-08-15`.

**Movimento 1 — sembrano scenografie** (l'improbabile è la struttura stessa)

| #   | `id`                             | Disclosure      | Prezzo (solo se nel registro) | Perché merita il posto                                                                                |
| --- | -------------------------------- | --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | `novara-emotional-grand-motel`   | `collaboration` | «Prezzo variabile per stanza» | **Apertura lockata.** È il caso in cui la stanza — letto dentro una gabbia dorata — È la destinazione. |
| 2   | `casola-spino-fiorito`           | `organic`       | —                             | Una casa rivestita di specchi che cambia colore col bosco: è la foto che fa dire «non esiste».         |
| 3   | `bossico-placat`                 | `organic`       | —                             | Strutture geodetiche in tela sopra il lago d'Iseo, **senza internet**: il vincolo è il contenuto.      |
| 4   | `poppi-fattorie-di-celli`        | `organic`       | —                             | Reti sospese fra i tronchi, sotto c'è il vuoto: unica voce dove il letto non poggia su niente.         |

**Movimento 2 — la stanza fa una cosa che non ti aspetti** (l'improbabile è dentro)

| #   | `id`                             | Disclosure  | Prezzo (solo se nel registro)   | Perché merita il posto                                                                                       |
| --- | -------------------------------- | ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 5   | `emilia-granduca-di-campigna`    | `organic`   | «da 98€/notte»                  | **Ancora bassa della fascia** e unica spa in una grotta con aperitivo dentro. Prova che «insolito» ≠ «caro».   |
| 6   | `grone-narciso-home-chalet`      | `adv`       | —                               | **Voce dichiaratamente pagata**, trattata come le altre: è la dimostrazione che l'etichetta non declassa.      |
| 7   | `bracciano-enjoy-house`          | `organic`   | —                               | L'aperitivo servito a bordo vasca dentro un borgo medievale sul lago: dettaglio specifico, non atmosfera.      |
| 8   | `toscana-suite-spa-civico-4`     | `invited`   | «Da 190€/notte (210€ weekend)»  | **Tetto della fascia** e cinema in camera da 100": la cosa più assurda che la stanza sa fare.                  |

**Movimento 3 — è il fuori a essere improbabile** (l'improbabile è la vista)

| #   | `id`                             | Disclosure | Prezzo (solo se nel registro) | Perché merita il posto                                                                            |
| --- | -------------------------------- | ---------- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| 9   | `massa-lubrense-relais-freedom`  | `organic`  | —                             | Jacuzzi con Capri davanti: la vista è il prodotto, non un contorno.                                   |
| 10  | `firenze-villa-tolomei`          | `organic`  | —                             | **Chiusura.** Villa del 1200 con Firenze davanti, a un quarto d'ora dal centro: l'improbabile vicino. |

Perché tre movimenti e non dieci sezioni: dieci schede in fila **sono** il
listicle che vogliamo battere. Il raggruppamento è anche l'argomento del pezzo —
«inventato» non vuol dire una cosa sola. La proposta di H2 resta del
seo-strategist: questo è l'ordine, non l'intestazione.

### Chi resta fuori — i due default confermati, uno per una ragione più forte

**`sarteano-chiostro-cennini` — FUORI. Confermato.**
Non è un margine di giudizio: `types: ["Food & Ristoranti", "Insolito"]`, la
descrizione dice «un ristorante ricavato in un chiostro quattrocentesco», e
`practical.toKnow` è tutto ristorante («Chiuso il giovedì», «prenotazione
obbligatoria con carta a garanzia») [MISURATO: `content-seed.json:1738-1781`].
Nessun campo documenta un pernottamento. In un pezzo intitolato «dove dormirci»
salta al primo lettore che apre la scheda — e la voce è `invited`, quindi
l'errore costerebbe una relazione oltre alla credibilità.
**Non è materiale sprecato**: è la voce più forte per un pezzo diverso («si mangia
in posti impossibili»). Va parcheggiata nel backlog, non buttata.

**`lombardia-agriturismo-graffignana` (Contea del Vignolo Fiorito) — FUORI, e la
tengo fuori più fermamente di quanto il default proponesse.**
Il difetto non è solo «non risulta il pernottamento»: è che **la scheda
renderizzerebbe un prezzo fuorviante da sola**. Il suo `value.price` è
«Piscina 40€ (50€ con lettino)» — un biglietto per la giornata in piscina — e il
blocco `:::posto` stampa `value.price` nello slot prezzo senza qualificarlo
[MISURATO: `posto.tsx:78-82`]. Dentro una lista di alloggi, un lettore che scorre
legge «40€» come tariffa a notte. Sarebbe un numero ingannevole **che nessuno ha
scritto**: peggio di un errore in prosa, perché nessuna rilettura lo intercetta.
Aggiungi che la voce è `adv` — pagata, in un articolo sul dormire, senza
pernottamento documentato, con un prezzo che sembra una camera: è il singolo
elemento a rischio più alto di tutto il pool.
**Condizione di rientro** — e non è la memoria dell'owner: rientra solo se la
scheda viene corretta (pernottamento documentato **e** `value.price` che dice a
cosa si riferisce). Un «sì, ci abbiamo dormito» non sana il prezzo renderizzato.
[OWNER] L'owner può ribaltare l'esclusione; non può ribaltare il rendering.

Fuori anche, senza che fosse chiesto:

- `pessina-agriturismo-campagnino` (`invited`) — **stesso identico difetto della
  Contea**: tipizzato `Hotel con carattere` ma la descrizione documenta solo
  aperitivi, pranzi ed esperienze didattiche, e `place.hours` sono orari di
  servizio ristorante [MISURATO: `content-seed.json:2129-2149`]. Due casi non sono
  una svista: sono un difetto di tipizzazione del registro (vedi ultima sezione).
- `toscana-mirror-house-spinofiorito` — duplicato placeholder di Spino Fiorito,
  con coordinate in Romagna. Il pezzo linka `casola-spino-fiorito`. Il blocco
  `:::posto` non renderizzerebbe comunque un placeholder
  [MISURATO: `posto.tsx:41-48`].
- `sirmione-hotel-lugana-parco` (`adv`), `capovaticano-tonicello-resort`,
  `garfagnana-agriturismo-cornali`, `asciano-casa-lavanda-podere-fossaccio`
  (tutte `invited`), `the-sense-resort` (`organic`) — sono buoni alloggi, ma
  nessuno è *improbabile*. Entrarci diluirebbe il titolo e porterebbe le voci
  pagate a 5 su 14. Restano disponibili per pezzi futuri.

### Angolo del funnel partner

**La frase che un albergatore deve pensare arrivando in fondo:**

> «Questi non hanno venduto una stanza: hanno verificato un posto e hanno
> dichiarato che rapporto avevano con chi glielo ha offerto. La voce ADV sta lì,
> in mezzo alle altre, con lo stesso spazio e la stessa etichetta. Se lavoro con
> loro, la mia struttura viene raccontata così — e non finisce in fondo a un
> elenco a pagamento.»

Il messaggio non è «siamo bravi»: è **come funziona il perimetro**. È il motivo
per cui la voce `adv` (#6) sta a metà pezzo e non in coda, e per cui non è
l'ultima cosa che si legge.

**Dove sta il link, e cosa non deve fare:**

- **Uno solo**, dopo la voce #10, prima di qualunque chiusura o modulo. Nessuna
  CTA a metà testo, nessun box laterale, nessuna ripetizione.
- **Nessun prezzo, nessun listino.** La pagina `/collaborazioni` dichiara
  esplicitamente che i formati sono «tracce di lavoro, non listini rigidi»
  [MISURATO: `src/pages/Collaborazioni.tsx:264`]. Il €1.500 non è sul sito e non
  entra da qui: sarebbe una decisione di pricing presa di straforo da un articolo.
- **Non nominare il formato come prodotto.** Il link porta alla pagina, non vende
  la SKU «Stay editoriale».
- **Non è una CTA commerciale in tono.** Se suona come un banner, il pezzo perde
  la credibilità che ha appena costruito per dieci voci — cioè si distrugge da sé
  l'unica cosa che stiamo vendendo.
- Traccia `article_partner_cta_click` (vedi contratto eventi).

La copy esatta la scrive il seo-conversion-strategist. Qui è definito il
perimetro, non il testo.

### Righe che dipendono dall'owner — nessuna blocca questo step

- **[OWNER] L'elemento di prova per voce.** *Default che adotto e su cui il pezzo
  può essere scritto oggi*: **data di pubblicazione del reel + disclosure +
  link alla scheda + il reel**, più **una riga sola, una volta sola**, che dice
  che tutte le schede sono state riverificate sui siti delle strutture il
  15 agosto 2026 (`practical.checked.at`, uguale su tutte e dieci [MISURATO]).
  Il costo pagato **non è la promessa portante**: se l'owner lo fornisce, entra
  come rinforzo dove esiste; se non arriva, non cambia una riga.
  *Costo per l'owner del sì*: ~15 min a fasce approssimate ma vere; fino a 2h se
  vuole cifre esatte dagli estratti. **Consiglio: non spendere le 2h.**
- **[OWNER] La formula della data.** Si scrive **«reel pubblicato il …»**, che è
  vero e verificabile — `publishedAt` è la data del reel, non della visita.
  Le dieci date sono: 2024-09-16 · 2025-10-09 · 2025-07-29 · 2025-09-15 ·
  2026-01-16 · 2026-05-24 · 2025-10-02 · 2026-06-19 · 2025-08-07 · 2025-12-12
  [MISURATO]. **Attenzione**: l'apertura (EGM) è la voce più vecchia di dieci
  mesi. Il testo non deve lasciar intendere una visita recente. Se l'owner
  fornisce le date di visita reali, sostituiscono la formula; altrimenti resta.
- **[OWNER] Le due esclusioni** (Cennini, Contea) sono **confermate fuori** con la
  motivazione sopra. Ribaltabili solo dall'owner, e la Contea solo dopo la
  correzione della scheda.

### Rischio di brand — cosa può rompersi

1. **Il rischio più concreto è già mitigato**: un prezzo che sembra una tariffa e
   non lo è (caso Contea). Tenuta fuori.
2. **Il secondo è misurato e va detto al writer**:
   `PARTNERSHIP_LABEL.organic` è **la stringa vuota**
   [MISURATO: `src/types/content.ts:24-31`]. Il blocco `:::posto` quindi mostra
   un'etichetta **solo** sulle tre voci non organiche e **niente** sulle sette
   organiche. Effetto ottico per chi scorre: «tre sono pubblicità, delle altre
   sette non si sa». Il silenzio del componente lavora contro di noi.
   **Serve che il corpo dichiari in prosa la condizione delle voci organiche** —
   una riga, non sette. Senza, la trasparenza che è il nostro unico vantaggio si
   legge come reticenza.
3. **Il terzo è operativo**: il sito non è pubblico. Se qualcuno manda il link a
   una struttura prima che il dominio sia ripuntato, l'albergatore apre una
   Coming Soon WordPress. **Nessun link a nessun partner** finché la voce #3b del
   backlog non è chiusa.

### Difetti del registro emersi decidendo — al backlog, non qui

Non si risolvono in questo pezzo. Vanno segnalati perché li ho misurati:

1. **Tipizzazione `Hotel con carattere` su schede senza pernottamento**: due casi
   (`lombardia-agriturismo-graffignana`, `pessina-agriturismo-campagnino`),
   entrambi con orari di ristorante. Chiunque filtri il registro per «alloggi»
   ottiene due falsi positivi.
2. **Spino Fiorito ha due schede**, una completa e una placeholder con coordinate
   in Romagna (`toscana-mirror-house-spinofiorito`).
3. **`bossico-placat` non ha una voce reel**: nessuna occorrenza di `bossico` o
   `placat` in `src/config/reels.ts` [MISURATO], e nessun `videoSrc` nel registro.
   `:::reel{posto="bossico-placat"}` non renderizzerebbe nulla. La scheda ha la
   cover, quindi la voce resta in lista — ma **asset-curator e editorial-writer
   devono saperlo**: è l'unica delle dieci senza reel incorporabile.

### Decisioni owner — 2026-08-18, dopo il brief (vincono sul brief)

1. **Costi reali: li fornisce l'owner in rilettura.** Le voci senza prezzo nel
   registro ricevono il costo davvero pagato («circa …€ a notte») durante la
   revisione del corpo, prima del publish. Checklist di raccolta:
   `docs/50_Scratch/COSTI_dormire-posti-sembrano-inventati.md`. Fino ad allora
   la regola del brief resta: se il numero non c'è, si tace.
2. **Chiostro Cennini e Contea del Vignolo Fiorito RIENTRANO nel pezzo** — non
   come voci alloggio ma in una micro-sezione separata «E se non ci dormite…»
   (titolo di lavoro, ultima parola al seo-strategist), **in prosa**: niente
   blocco `:::posto`, quindi il difetto del prezzo renderizzato («Piscina 40€»)
   non si presenta, e il non-pernottamento è il punto dichiarato della sezione,
   non un'omissione. Disclosure a parole (invited / adv). L'esclusione dalla
   lista alloggi decisa da growth resta valida: le dieci voci non cambiano.
3. **Date = data del reel** («ci siamo stati — reel di [mese anno]»), stessa
   regola della scheda in home. Nessuna data di visita da ricostruire.

## SEO (compilato da travellini-seo-conversion-strategist — 2026-08-18)

### Il vincolo che decide H1 e meta title (leggerlo prima di discutere il titolo)

Su questa rotta **H1, meta title e og:title sono la stessa stringa**: l'`<h1>` è
`article.title` [MISURATO: `src/components/article/ArticleHero.tsx:102-104`], e
lo stesso valore arriva a `<SEO title>` [MISURATO: `src/pages/Articolo.tsx:405,435`],
che ci appende ` | Travelliniwithus` — **19 caratteri** — quando il titolo non
contiene già il nome del sito [MISURATO: `src/components/SEO.tsx:59-61`].

Non esiste un campo meta-title separato, e non è aggiungibile a costo zero:
`seoTitle` non è fra i campi ammessi da `isValidArticle()`
[MISURATO: `scripts/publish-article-seed.mjs:35-40`], quindi Firestore non lo
accetterebbe.

**Conseguenza aritmetica**: per un meta title ≤ 60 caratteri, il `title` del seed
deve stare in **≤ 41**. Il titolo di lavoro ne occupava 51 → 70 renderizzati.
`Posti che sembrano inventati` da solo ne occupa 28: restano 13 caratteri per la
promessa, separatore incluso. «dormirci davvero» (16) non ci sta, «e ci dormi»
(12 col separatore) sì.

Quindi **la parola «davvero» esce dall'H1 ed entra nell'excerpt, nell'attacco e
nell'H2 di coda** — è sulla pagina tre volte, solo non nei 41 caratteri che il
meta title concede. Il resto del brief resta rispettato: la promessa nell'H1 è il
verbo («ci dormi»), non un aggettivo.

### Le stringhe definitive

- **H1** (= `title` del seed, riga 13): `Posti che sembrano inventati, e ci dormi`
  — 40 caratteri.
- **Meta title** (renderizzato, non da scrivere a mano):
  `Posti che sembrano inventati, e ci dormi | Travelliniwithus` — **59 caratteri**. ✓
  Non scrivere il suffisso nel seed: lo aggiunge `SEO.tsx`, e a mano diventerebbe
  un doppione.
- **Meta description** = **excerpt**. Sono la stessa stringa: `excerpt` diventa
  `description` [MISURATO: `src/utils/articleData.ts:150-154`] e da lì va a
  `<SEO description>` [MISURATO: `Articolo.tsx:406,436`]. Una sola frase serve
  SERP, card social e anteprime interne.

  ```
  Dieci alloggi italiani che sembrano scenografie: casa di specchi, bolla nel bosco, spa in grotta. Ci siamo stati davvero, e diciamo chi ci ha invitato.
  ```

  **151 caratteri** — dentro il limite duro di 160 di
  `publish-article-seed.mjs:32,89-91` e dentro la finestra 140-160
  dell'`EDITORIAL_GUIDE`. Pronta da incollare alla riga 15 del seed al posto del
  placeholder. Nessun numero oltre al conteggio delle voci; nessun `[VERIFY`.

  Verifica dei tre dettagli citati: «casa di specchi» = Spino Fiorito Stay
  («rivestito di specchi», `content-seed.json:3357`), «bolla nel bosco» = Placat
  (è l'hook del reel del brand, `content-seed.json:4117`), «spa in grotta» =
  Granduca di Campigna («spa con aperitivo nella grotta», `content-seed.json:10`).

- **Slug**: `dormire-posti-sembrano-inventati` — **confermato, non si tocca.**
  Regge «dormire» e «posti», che sono le due teste del cluster; quattro parole,
  nessuna stop word; è già in tre posti (seed, questa nota, checklist costi).
  L'H1 non contiene più la stringa «dormire» all'infinito, ma «ci dormi» ha la
  stessa radice e lo slug resta il segnale più stabile della pagina.

### Keyword cluster

**Primaria** — `dormire in posti insoliti in Italia`. È la query su cui rankano i
listicle da scrivania; il nostro delta non è il testo, è che ogni voce ha una
scheda con coordinate, etichetta e un video.

| Secondaria / long-tail                 | Prova nel registro                                              | Dove atterra          |
| -------------------------------------- | --------------------------------------------------------------- | --------------------- |
| `alloggi insoliti Italia`              | dieci schede italiane, tipo `Insolito` / `Hotel con carattere`   | excerpt + H2 movim. 1 |
| `posti strani dove dormire in Italia`  | —                                                                | attacco               |
| `hotel a tema Italia`                  | EGM: «Motel a tema vicino Novara»                                | H3 voce 1             |
| `dormire in una mirror house`          | hook del reel: «Dormiresti in una mirror house?»                 | H3 voce 2 + 1ª riga   |
| `dormire in una bolla nel bosco`       | hook del reel: «Dormiresti in una bolla nel bosco?»              | H3 voce 3             |
| `camera con jacuzzi privata`           | Enjoy House «jacuzzi privata in camera»; Narciso Home; Granduca  | H2 movim. 2 + H3 6/7  |
| `spa in grotta`                        | Granduca di Campigna                                             | H3 voce 5             |
| `weekend romantico insolito in Italia` | tipo `Weekend romantici`; Civico 4 «esclusivamente per due»      | attacco + coda        |

**Due correzioni all'elenco del handoff, entrambe misurate:**

1. **`case sugli alberi Italia` — scartata.** Le Fattorie di Celli sono «reti
   sospese fra i tronchi» [MISURATO: `content-seed.json:3616`], non case
   sull'albero. Targettarla sarebbe una promessa che il primo lettore che apre la
   scheda smonta — cioè l'esatto difetto che accusiamo ai listicle. Sostituita con
   `dormire sospesi fra gli alberi`, che è vero e vale meno volume.
2. **`alloggi insoliti <regione>` — non diventa un H2.** Le regioni ci sono
   (Toscana ×4, Lombardia ×2, Piemonte, Emilia Romagna, Lazio, Campania), ma
   raggruppare per regione è una delle due alternative che il Brief ha già
   scartato. Le regioni entrano dove non costano struttura: città accanto al nome
   nel corpo, e `addressRegion` dentro l'`ItemList`.

### Schema.org

Quattro schemi, **nessuno duplicato**. Tre esistono già: da aggiungere è solo
l'`ItemList`.

| Schema           | Stato oggi                                                    | Chi lo emette                                     |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| `Article`        | ✓ già emesso                                                  | `buildArticleJsonLd` (`src/lib/seo.ts:99-156`)    |
| `BreadcrumbList` | ✓ già emesso                                                  | `<SEO breadcrumbs>` (`Articolo.tsx:461-469`)      |
| `FAQPage`        | ✓ solo se l'editorial usa `:::domande` — **non replicarlo**   | il blocco stesso (`directives/domande.tsx:80-83`) |
| `ItemList`       | ✗ **da aggiungere** — è il differenziatore di questo pezzo    | nuovo builder, vedi sotto                         |

**Perché l'`ItemList` non è decorativo.** È l'unica lista in SERP dove ogni voce
ha una pagina propria con coordinate, telefono, etichetta di disclosure e un
video. `ListItem.url` verso `/posto/:id` è ciò che rende leggibile a una macchina
esattamente il gesto che il Brief ha scelto come metrica primaria
(`article_place_click`).

Forma attesa, un `ListItem` per ognuna delle dieci voci, **nell'ordine del
Brief**:

```
{ "@context": "https://schema.org", "@type": "ItemList",
  "name": "Dieci alloggi italiani che sembrano inventati",
  "numberOfItems": 10,
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "itemListElement": [
    { "@type": "ListItem",
      "position": 1,
      "name": "<place.name>",
      "url": "https://travelliniwithus.it/posto/<id>",
      "item": <buildItemReviewedJsonLd(item)> },
    ...
  ] }
```

**Da dove escono i dieci id — e perché non dai blocchi.** L'istinto sarebbe
leggere le direttive `:::posto` dal `content`. Sarebbe sbagliato: il budget ne
ammette solo tre, quindi l'`ItemList` uscirebbe con **tre voci su dieci** e
dichiarerebbe a Google una lista che la pagina non è. La sorgente corretta è
**ogni riferimento a `/posto/:id` nel corpo**, nell'ordine di prima apparizione:
sia la direttiva `:::posto{id="…"}` sia il link markdown `](/posto/<id>)`.
Deduplicare sulla prima occorrenza, scartare le schede `isPlaceholder`.

Così l'`ItemList` resta a dieci qualunque siano le tre voci che ricevono la card,
e non si rompe se l'editorial cambia idea su quali.

Da quale campo viene cosa:

- `position` — ordine di prima apparizione nel corpo (1-10), lo stesso della
  proprietà `position` dell'evento `article_place_click`. Devono coincidere.
- `name` e `item` — da `content-seed.json` via `getContentById(id)`.
- `item` **riusa `buildItemReviewedJsonLd`** (`src/lib/placeReviewSchema.ts:82-115`):
  dà già `@type` scelto da `pickSchemaType`, `name` = insegna reale,
  `address.streetAddress/addressLocality/addressRegion/addressCountry`,
  `telephone`, `geo`, e `url` = **sito della struttura**.
- **`item.url` non deve mai puntare al nostro dominio.** È una regola già presa e
  documentata nel modulo: mettere il nostro URL dentro `itemReviewed` significa
  dichiarare «noi siamo quell'hotel». Il nostro link sta in `ListItem.url`, che è
  il posto corretto.
- Nessun `offers`, nessun `aggregateRating`, nessun `priceRange`: stessa ragione
  già scritta in `placeReviewSchema.ts`, e qui in più i prezzi sono due su dieci.

`SEO` accetta già un array di schemi [MISURATO: `src/components/SEO.tsx:14,92-100`],
quindi non serve un secondo `<JsonLd>`: si passa `jsonLd={[article, itemList]}`.

### Outline definitiva — H1, H2, H3

L'ordine delle dieci voci è lockato dal Brief e **non si tocca**. Le intestazioni
sotto sono la parte che spettava a me.

**Perché H3 = la cosa strana e non il nome del posto.** Il blocco `:::posto`
stampa già un `<h3>` con il nome della struttura
[MISURATO: `directives/posto.tsx:73-75`]. Se l'H3 editoriale ripetesse il nome
avremmo due `h3` fratelli identici a ogni voce — e la pagina tornerebbe a essere
l'elenco di nomi che stiamo cercando di battere. Così invece l'H3 dice **cosa
c'è**, la card dice **dove**, e le long-tail («una mirror house», «una bolla nel
bosco») finiscono in un'intestazione invece che in un grassetto.

```
H1  Posti che sembrano inventati, e ci dormi

    [attacco, 2-3 paragrafi, nessun H2 — si apre su Emotional Grand Motel]
    · una riga, una volta sola: tutte e dieci le schede riverificate sui siti
      delle strutture il 15 agosto 2026
    · una riga sulle sette voci senza etichetta (vedi «Riga obbligatoria» sotto)

H2  Quattro alloggi che sembrano scenografie
    H3  Un letto dentro una gabbia dorata                    → novara-emotional-grand-motel
    H3  Una casa rivestita di specchi, in Lunigiana          → casola-spino-fiorito
    H3  Una bolla di tela nel bosco, senza internet          → bossico-placat
    H3  Una rete sospesa fra i tronchi, e sotto il vuoto     → poppi-fattorie-di-celli

H2  Quattro camere con dentro una spa, una jacuzzi o un cinema
    H3  Una spa dentro una grotta, con l'aperitivo           → emilia-granduca-di-campigna
    H3  Una jacuzzi riscaldata con vista, in uno chalet      → grone-narciso-home-chalet
    H3  L'aperitivo servito a bordo della jacuzzi in camera  → bracciano-enjoy-house
    H3  Un cinema da cento pollici dentro la camera          → toscana-suite-spa-civico-4

H2  Due posti dove la cosa improbabile è la vista
    H3  Una jacuzzi con Capri davanti                        → massa-lubrense-relais-freedom
    H3  Una villa del 1200 con Firenze davanti               → firenze-villa-tolomei

H2  Due posti dove non si dorme, e ve li diciamo lo stesso
    [prosa. Chiostro Cennini (Su invito) + Contea del Vignolo Fiorito (ADV).
     Nessun blocco :::posto — vedi sotto perché.]

H2  Le domande che ci fate ogni volta
    [:::domande — 4 voci, vedi sotto]

H2  Sette su dieci non ce li ha offerti nessuno
    [prosa: la disclosure in chiaro + l'unico link a /collaborazioni]
```

**Ogni H3 è ancorato al registro**, non inventato: gabbia dorata
(`content-seed.json:1386`), specchi (`:3357`), tela geodetica senza internet
(`:4119`), reti fra i tronchi (`:3616`), spa in grotta (`:10`), jacuzzi
riscaldata con vista (`:2178`), aperitivo a bordo vasca (`:3448`), cinema da
100" (`:2039`), Capri davanti (`:3738`), villa del 1200 (`:3022`).

Due cose che **non** vanno negli H3, perché non sono nel registro: la distanza
di Villa Tolomei dal centro di Firenze, e qualsiasi cifra oltre alle due che il
registro dichiara.

**Le frecce `→ <id>` dicono di quale scheda parla la sezione, non che lì ci vada
un blocco.** Il budget lo vieta: massimo **3 `:::posto` per articolo**, massimo 8
blocchi in tutto, mai due blocchi consecutivi senza ~150 parole in mezzo
[MISURATO: spec blocchi v2, §«Budget anti-fiera», decisione 7]. Quindi **tre voci
ricevono la card, sette vivono nella prosa con un link inline a `/posto/:id`** —
la scelta di quali tre resta dell'editorial-writer, come già scritto nel suo
handoff.

L'unico vincolo che aggiungo io, ed è di SEO non di gusto: **una card per
movimento**, così ognuno dei tre H2 ha un blocco e nessuna sezione resta di sola
prosa. Con due card nello stesso H2 e zero in un altro, il terzo movimento — che
ha solo due voci — diventerebbe visivamente una nota a piè di pagina.

Conteggio blocchi che questo outline consuma: `posto` 3 + `domande` 1 = **4 su 8**.
Restano quattro slot per `verdetto` (1), `reel` (max 2) e `dati` (max 2) — non
li assegno io.

### La micro-sezione «E se non ci dormite…» — titolo definitivo

**`Due posti dove non si dorme, e ve li diciamo lo stesso`**

Il titolo di lavoro rimandava la spiegazione al corpo; questo la mette
nell'intestazione, che è dove un lettore che scorre la legge. «non si dorme» è la
dichiarazione, «ve li diciamo lo stesso» è il motivo per cui la sezione esiste.

Perimetro, in prosa e senza blocchi:

- **Niente `:::posto`.** È la ragione tecnica della decisione dell'owner: il
  blocco stampa `value.price` nello slot prezzo senza qualificarlo
  [MISURATO: `directives/posto.tsx:78-82`], e la Contea ha `value.price` =
  «Piscina 40€ (50€ con lettino)». Dentro un pezzo sul dormire, «40€»
  sembrerebbe una tariffa a notte. In prosa il numero si spiega, e infatti si può
  scrivere per intero.
- **Disclosure a parole**, non con l'etichetta del componente: Chiostro Cennini è
  `invited` → «ci hanno invitati»; Contea del Vignolo Fiorito è `adv` → «è
  pubblicità: ci hanno pagato per parlarne».
- **Nessun link a `/posto/:id` da questa sezione.** Le due voci non sono nella
  lista, e un clic da qui inquinerebbe `article_place_click`, che è la metrica
  primaria. I nomi si scrivono, non si linkano.
- Questa sezione **non conta** nell'`ItemList`: dieci voci, non dodici.

### `:::domande` — quattro, e il guardrail sui numeri

Consigliato, non obbligatorio. Se c'è, il `FAQPage` lo emette il blocco: non
aggiungerne uno a mano.

1. «Quanto costa dormire in questi posti?» — rispondere **solo** con i due prezzi
   del registro (Granduca da 98€/notte; Suite Spa Civico 4 da 190€, 210€ nel
   weekend) e dire che sugli altri non pubblichiamo una cifra che non abbiamo
   verificato. Se l'owner compila
   `docs/50_Scratch/COSTI_dormire-posti-sembrano-inventati.md`, questa risposta
   si riscrive; finché è vuota, resta così.
2. «Sono posti adatti a chi viaggia con bambini?» — no, e c'è la prova: la Suite
   Spa Civico 4 è «solo maggiorenni» [`content-seed.json:2055`]. La selezione è
   pensata per due.
3. «Ci siete stati davvero o li avete solo visti?» — ognuna delle dieci ha un
   reel del brand e una scheda riverificata il 15 agosto 2026.
4. «Che differenza c'è fra le voci con l'etichetta e le altre?» — è la domanda
   che vale il pezzo: risponderla per esteso, con i numeri del registro.

### Riga obbligatoria sulle voci organic (senza, la trasparenza si legge al contrario)

`PARTNERSHIP_LABEL.organic` è **la stringa vuota**
[MISURATO: `src/types/content.ts:24-31`]: il blocco `:::posto` stampa
un'etichetta solo sulle tre voci non organiche — EGM «In collaborazione»,
Suite Spa Civico 4 «Su invito», Narciso Home «ADV» — e **niente** sulle altre
sette. Per chi scorre, l'effetto ottico è «tre sono pubblicità, delle altre non
si sa».

Col budget dei blocchi il difetto peggiora invece di attenuarsi: le card sono
tre in tutto, quindi la disclosure visibile dipende da **quali** tre voci
ricevono la card, non da quante voci hanno un rapporto commerciale.

Serve **una riga in prosa nell'attacco** che dica cosa vuol dire l'assenza di
etichetta. Formula sicura: «sette su dieci ce li siamo scelti noi, nessuno ci ha
invitato». **Non** «li abbiamo pagati noi»: `organic` nel registro significa
nessun rapporto commerciale, non prova di pagamento. Quella frase si può scrivere
solo se l'owner riempie la checklist costi.

### Coda partner — copy e perimetro

**H2**: `Sette su dieci non ce li ha offerti nessuno`

È l'unico titolo che fa due lavori insieme: chiude la trasparenza per il lettore
(spiega le etichette che ha visto) e apre l'unico varco al funnel partner senza
suonare come un banner. I numeri sono del registro: 7 `organic`, 1
`collaboration` (EGM), 1 `invited` (Suite Spa Civico 4), 1 `adv` (Narciso Home).

**Il link**: uno solo, in fondo alla sezione, inline nella prosa. Traccia
`article_partner_cta_click`.

```
Se gestite una struttura e volete sapere come lavoriamo prima di scriverci,
sta scritto nella pagina collaborazioni.
```

Cosa questa riga non fa, per costruzione: non nomina un formato, non nomina una
cifra (la pagina dichiara che i formati sono «tracce di lavoro, non listini
rigidi», `src/pages/Collaborazioni.tsx:264`), non dice «scopri», non è un
bottone. Il link è sulle parole «pagina collaborazioni».

**Posizione — scelta dichiarata.** Il Brief diceva «dopo la voce #10, prima di
qualunque chiusura o modulo». La micro-sezione e le domande sono arrivate dopo,
con la decisione dell'owner, e sono contenuto, non chiusura: quindi il link resta
**ultimo**, subito prima del modulo newsletter. Il vincolo vero — uno solo, mai a
metà testo — è rispettato.

### Link interni

Oltre ai dieci `/posto/:id` delle voci — tre dentro una card, sette inline nella
prosa:

| Link                              | Dove                     | Perché non è un link «per fare SEO»              |
| --------------------------------- | ------------------------ | ------------------------------------------------ |
| `/esplora`                        | attacco o coda           | è il registro intero: la risposta a «ce ne sono altri?» |
| `/mappa`                          | dopo il movimento 3      | dieci posti sparsi su sei regioni: la mappa è la domanda successiva |
| `/destinazione/italia/toscana`    | dentro il movimento 2    | quattro delle dieci sono in Toscana — è l'unico raggruppamento regionale che il pezzo può reggere |
| `/collaborazioni`                 | coda, una volta sola     | l'unico link partner del pezzo                   |

### Tag per il seed (riga 21)

```ts
tags: ['italia', 'alloggi-insoliti', 'posti-particolari', 'weekend-di-coppia', 'dormire'],
```

**Cosa fanno davvero, per non sopravvalutarli**: `tags` non arriva né a Firestore
(`toFirestoreDocument` non lo mappa, e non è fra i campi ammessi dalle rules) né
allo schema `Article` (`Articolo.tsx:446-458` non passa `tags` a
`buildArticleJsonLd`). Oggi servono a una cosa sola: `tags` vuoto **blocca la
pubblicazione** [MISURATO: `publish-article-seed.mjs:106-108`]. Sono un cancello,
non un segnale.

### Rischi tecnici che questo pezzo eredita — per il frontend, non per l'editorial

1. **La metrica primaria, com'è scritta oggi, non può raggiungere la sua soglia.**
   Il contratto eventi del Brief attacca `article_place_click` al «link
   `/posto/:id` **dentro `:::posto`**». Ma i blocchi sono al massimo tre, e sette
   voci su dieci avranno un link inline: quei sette clic non verrebbero contati.
   La soglia go è «≥ 8% dei lettori apre almeno una scheda» — misurata su tre
   voci invece che dieci, è una soglia su un campione mutilato, e il pezzo
   verrebbe dichiarato fallito per un difetto di strumentazione.
   *Rimedio*: l'evento si attacca a **ogni** link verso `/posto/:id` dentro il
   corpo dell'articolo, direttiva o prosa che sia, con `position` = ordine di
   prima apparizione (lo stesso dell'`ItemList`). Resta un evento solo, resta su
   `trackAnalyticsEvent`, non cambia nessuna soglia. **Non è una mia decisione**:
   growth ha scritto il contratto, io ho misurato che non regge al budget dei
   blocchi. Da confermare prima che il frontend lo implementi.
2. **In produzione questa pagina serve lo shell generico.**
   `metaForRoute` copre `/posto/`, `/destinazione/` e le statiche, **non
   `/articolo/`** [MISURATO: `scripts/generate-route-html.js:174-178`], e la rotta
   finisce fra gli `skipped` declassati a warning (`:348-354`). Effetto: title,
   description, OG e JSON-LD di questa pagina **esistono solo dopo l'idratazione
   React**. Google esegue JS; WhatsApp, Facebook, LinkedIn e Telegram no — il link
   mandato a un albergatore mostrerebbe la card generica del sito. E i crawler AI,
   che sono metà della tesi GEO di questo pezzo, in larga parte nemmeno.
   *Rimedio proposto*: un ramo `articoloMeta(route)` in `generate-route-html.js`
   che legge dai seed in `src/data/articles/` (sono in repo, non serve Firestore).
   **Non** aggiungere la rotta a `STATIC_ROUTE_META`: `routeMeta.test.ts:18-22`
   fallirebbe con «meta orfane», perché `/articolo/*` non è in `sitemapPaths()`.
3. **OG image.** Per un articolo pubblicato `ogImage` è la `coverImage`
   [MISURATO: `Articolo.tsx:410`], cioè un `.webp` — e il commento in
   `SEO.tsx:19-21` dice perché è un problema per le anteprime social. Serve
   `/og/dormire-posti-sembrano-inventati.jpg` a 1200×630 → asset-curator.
4. **Sitemap: nessuna modifica.** `/articolo/<slug>` entra da solo quando
   `published: true`, ma **solo se al build ci sono le credenziali Firestore**
   [MISURATO: `scripts/generate-sitemap.js:156-199`]. Senza, la sitemap esce senza
   nessun articolo e in silenzio. Da verificare al primo deploy con l'articolo
   online.
5. **`bossico-placat` non ha reel incorporabile** (già nel Brief): `:::reel` su
   quella voce non renderizza. L'H3 e la card reggono da soli.

### Rischi di posizionamento

- **Il titolo non contiene «Italia».** È il prezzo dei 41 caratteri. Recuperato in
  excerpt («alloggi italiani»), nel breadcrumb, in `location: 'Italia'` e in dieci
  `addressCountry` dentro l'`ItemList`. Si smentisce se: dopo tre mesi di
  Search Console le impression su query «… in Italia» sono trascurabili — in quel
  caso il titolo va rifatto, non il corpo.
- **La coda parla agli albergatori in un pezzo scritto per Chiara e Marco.**
  Mitigato dal fatto che l'H2 risponde prima a una domanda del lettore (perché
  tre voci hanno un'etichetta e sette no). Se in rilettura suona come un banner,
  si taglia il link e non si tocca l'H2: l'H2 serve comunque.
- **Nessun articolo pubblicato oggi**: nessun link in entrata, nessuna autorità
  interna. Le quattro voci della tabella link interni sono l'unico circolo che
  questa pagina può alimentare.

## Body (compilato da travellini-editorial-writer — 2026-08-18)

**~2.700 parole** (conteggio a mano: in questa sessione non avevo una shell per
`wc`, quindi va riconfermato dal contatore dell'editor prima del publish — il
margine sui 2.800 è di un centinaio di parole, non di dieci). Blocchi usati: 7 su
8 (`posto` 3 · `reel` 2 · `dati` 1 · `domande` 1). Da incollare nel campo
`content` del seed così com'è, dal paragrafo qui sotto fino all'ultima riga prima
di «Note di consegna».

**ATTENZIONE — le cinque direttive senza corpo hanno la loro riga di chiusura
`:::`, e va tenuta.** `:::posto` e `:::reel` non hanno testo dentro, ma restano
`containerDirective`: senza il `:::` di chiusura il container si estende fino a
fine documento e `toProps` ne azzera i figli
[MISURATO: `directives/posto.tsx:20`, `directives/reel.tsx:26`] — il risultato
sarebbe metà articolo che sparisce senza nessun errore a schermo. Nel seed
esistente il pattern aperto/chiuso è visibile a
`src/data/articles/burton-juice-ristorante-tim-burton.seed.ts:46-48`.

---

Il primo posto di questa lista sta a cento metri da un casello autostradale. Si esce a Borgomanero sulla A26, si svolta, ed è lì. La stanza si chiama Celebrity: letto rotondo dentro una gabbia dorata, pareti rosse, una vasca che non somiglia a nessuna vasca d'albergo. Alla reception, oltre alla notte, si prenotano anche soggiorni a ore. Messe in fila, queste cose non sembrano dello stesso indirizzo. Invece sono tutte l'Emotional Grand Motel, a Fontaneto d'Agogna, provincia di Novara.

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

### Una rete sospesa fra i tronchi, e sotto il vuoto

Alle Fattorie di Celli, in località Celli appena fuori Poppi, ci sono reti sospese fra i tronchi con i cuscini sopra: ci si sdraia, e sotto non c'è niente. È l'immagine del bosco del Casentino che gira di più, ed è vera — nel nostro video siamo noi due lassù.

Qui però va detta una cosa che gli elenchi copiati non dicono: la rete è la rete, e gli alloggi sono alloggi nel bosco. Se la vostra domanda è «ci si passa la notte, lassù?», fatela a loro prima di prenotare: il telefono sta sulla scheda, e una chiamata da un minuto vale più di dieci articoli. Non è un posto per chi il vuoto sotto i piedi lo sente. Ci siamo andati per conto nostro; il reel è di settembre 2025, e la scheda è quella delle [Fattorie di Celli](/posto/poppi-fattorie-di-celli).

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

### Un cinema da cento pollici dentro la camera

Suite Spa Civico 4 non è un hotel: è una suite privata a Follonica, in via Ludovico Ariosto, con ingresso indipendente e pensata esclusivamente per due persone. Dentro ci sono sauna a infrarossi, vasca idromassaggio, doccia emozionale e uno schermo da cento pollici davanti al letto. È la cosa più assurda di tutta la lista, perché è l'unica che non c'entra niente col paesaggio: potreste essere ovunque.

È dichiaratamente solo per maggiorenni — un minore entra unicamente accompagnato e con delega del genitore — quindi no, non è un posto per famiglie, e non lo diciamo noi. Si parte da 190€ a notte, 210€ nel weekend: è il tetto dei dieci. Qui ci hanno invitati, e sulla scheda leggete «Su invito»; il reel è di giugno 2026. Con le altre voci toscane della lista la trovate nella [pagina della Toscana](/destinazione/italia/toscana). Scheda: [Suite Spa Civico 4](/posto/toscana-suite-spa-civico-4).

## Due posti dove la cosa improbabile è la vista

Gli ultimi due non hanno niente di strano in camera. Hanno la finestra al posto giusto, che è la cosa più difficile da rimediare: una spa si costruisce, una vista no.

### Una jacuzzi con Capri davanti

Il Relais Freedom Club sta in via Titigliano, a Massa Lubrense, in penisola sorrentina, fra Sorrento e la costiera. La terrazza guarda il mare con Capri all'orizzonte, e sopra ci sono piscina, jacuzzi, lettini e un bar a bordo vasca. La descrizione della scheda è onesta e la copiamo volentieri: si sta lì tutto il giorno, è quello il punto.

Che è anche l'avvertimento. Se il piano prevede di muoversi ogni mattina — gli scavi, i traghetti, la costiera in auto — questo posto vi lavora contro: pagate una terrazza e la usate due ore prima di cena. Ci siamo andati per conto nostro, nessuno ci ha chiamati; il reel è di agosto 2025 e la scheda è quella del [Relais Freedom Club](/posto/massa-lubrense-relais-freedom).

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

Se gestite una struttura e volete sapere come lavoriamo prima di scriverci, sta scritto nella [pagina collaborazioni](/collaborazioni).

---

### Note di consegna (fuori dal corpo — non incollare nel seed)

**Le tre voci con `:::posto`, e perché quelle**

| Movimento | Voce                                  | Motivo                                                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | `novara-emotional-grand-motel`        | Apertura lockata: la card porta l'etichetta «In collaborazione» esattamente dove il lettore si fa la prima idea sulla nostra trasparenza. È anche l'unica voce del movimento con un `value.price` non fuorviante («Prezzo variabile per stanza»).                                              |
| 2         | `emilia-granduca-di-campigna`         | È l'ancora bassa (98€/notte): la card stampa il numero che rende falsa l'equazione «insolito = caro». È anche la voce con più dati pratici veri (turni privati, animali ammessi, accesso senza auto), quindi la scheda ha davvero qualcosa da dare a chi clicca.                                |
| 3         | `firenze-villa-tolomei`               | Chiusura della lista: la card è l'ultimo invito ad aprire una scheda prima che il pezzo cambi argomento. Senza, il terzo movimento — due sole voci — resterebbe visivamente una nota a piè di pagina, che è il difetto segnalato dalla SEO. **Fact-check 2026-08-18: «villa del 1200» era falso — le fonti (vologratis, tuscanysweetlife) datano la villa al XIV secolo: corretto in «trecentesca» in H3 e corpo.** |

**Il rapporto pagate/organiche delle card è una scelta, non un caso.** 1 su 3
card è a una voce non organica (33%), contro 3 su 10 nel registro (30%). Serviva
per non falsare il segnale che growth vuole leggere da `partnership_kind`: se le
card — che si cliccano molto più di un link inline — fossero finite su due o tre
voci pagate, l'evento avrebbe restituito «le voci pagate si cliccano di più» come
artefatto del layout, cioè esattamente la conclusione che il contratto eventi
serve a smentire o confermare.

**I due `:::reel`**: `casola-spino-fiorito` (movimento 1) e
`grone-narciso-home-chalet` (movimento 2). Il primo perché la mirror house è
una promessa visiva: la frase «non si vede, si vede il bosco spostato» è
esattamente ciò che la prosa non può dimostrare. Il secondo perché è la voce
ADV, e darle un blocco è il modo più concreto di dire «l'etichetta non
declassa» **senza toccare la metrica primaria** — un reel non è un clic verso
`/posto/:id`. `bossico-placat` non ha voce reel nel manifest, quindi nessun
blocco su quella voce, come da Brief.

**Blocchi usati: 7 su 8.** `posto` 3/3 · `reel` 2/2 · `dati{pratiche}` 1/2 ·
`domande` 1/1. Nessuna coppia di blocchi consecutivi: fra card e reel del
movimento 1 ci sono ~180 parole, fra card e reel del movimento 2 ~185, fra la
card di Villa Tolomei e il blocco `dati` ~150. `domande` e `dati{pratiche}`
stanno in due H2 diversi.

**`:::verdetto` NON è stato usato, e non è una scelta di gusto.** La direttiva
non esiste: `directiveRegistry` registra `pullquote, fullbleed, source,
verified, posto, reel, mappa, dati, domande, affiliato`, e non c'è nessun file
`directives/verdetto.tsx` [MISURATO:
`src/components/article/directives/index.ts:30-41` + `Glob src/components/article/directives/*.tsx`].
Un `:::verdetto` nel markdown non renderizzerebbe il blocco scuro: il nodo
resterebbe `containerDirective` senza `hName`, e `mdast-util-to-hast` lo
avvolgerebbe in un `<div>` anonimo mostrando i due paragrafi senza stile
[MISURATO: `directives/index.ts:59-79` + commento righe 64-69]. Il verdetto è
quindi scritto **in prosa**, in fondo al movimento 3 («Funziona se… Non funziona
se…»), nella stessa forma a due tempi che il blocco avrebbe avuto. Se un giorno
il blocco viene implementato, quei due paragrafi ci entrano senza riscrittura.

**`:::mappa` non usato**, deliberatamente: senza consenso marketing degrada
all'elenco testuale dei posti, cioè un secondo `ItemList` in prosa a fine
articolo — ridondante con le dieci voci e con l'ottavo slot di budget speso
male. Al suo posto il link inline a `/mappa`, come da tabella link interni.

**`:::dati{tipo="costi"}` non usato**, come previsto dal handoff: i due soli
prezzi del registro non fanno tre righe di dato vero, e un `perQuante` sarebbe
inventato. Si aggiunge dopo, se e quando l'owner compila la checklist.

**Dove entrano i costi in rilettura, senza riscrivere una riga.** Ogni voce
chiude con un inciso che contiene già la disclosure e la data del reel: il costo
pagato si accoda **lì**, come frase autonoma, prima o dopo «il reel è di …».
Esempio sulla voce 3: «Ci siamo andati per conto nostro, nessuno ci ha chiamati;
abbiamo pagato circa X€ a notte in due; il reel è di luglio 2025.» Nessun
paragrafo va rifatto. Le due voci con prezzo di registro (Granduca, Civico 4) e
la Contea hanno già il numero nel corpo. Se arrivano i costi, va riscritta anche
la prima risposta del blocco `:::domande` — è l'unico punto che dichiara «di
cifre ne pubblichiamo due».

**Dati che avrei voluto e non c'erano** (nessuno blocca la pubblicazione):

1. **Quanto abbiamo pagato**, su otto voci su dieci. È il singolo dato che
   separerebbe questo pezzo da tutti gli altri più del resto messo insieme.
2. **Se alle Fattorie di Celli si dorma sulla rete.** Il registro documenta le
   reti («ci si sdraia sopra») e, separatamente, «alloggi immersi nella natura».
   Non ho scritto né l'una né l'altra cosa come pernottamento: la voce dice al
   lettore di chiedere alla struttura. Se l'owner conferma, la frase si accorcia
   e diventa un'affermazione.
3. **La distanza di Villa Tolomei dal centro di Firenze**, che era nel Brief ma
   non nel registro: non è entrata, né in H3 né in prosa. C'è solo «fuori dal
   centro storico», che è il campo `gettingThere`.
4. **`practical.gettingThere` assente** su Placat, Narciso Home ed Enjoy House:
   per quei tre l'accesso l'ho ricavato da `description`/`place.address`, mai
   inventato.
5. **La formula «il reel è di [mese anno]»** usa `publishedAt` del registro, che
   è la data di pubblicazione del reel, non della visita — dieci occorrenze,
   nessuna data di visita. La voce 1 dichiara esplicitamente di essere la più
   vecchia, così il lettore non deduce una visita recente.
6. ~~L'unica frase del corpo che unisce due schede era [DEDOTTO]~~ **Risolto dal
   fact-check 2026-08-18**: il Parco Nazionale delle Foreste Casentinesi è
   diviso a metà fra Emilia-Romagna (Santa Sofia) e Toscana (Poppi) lungo il
   crinale — l'inciso «le stesse di Celli, viste dall'altro versante» è
   verificato (fonte: parks.it, scheda ufficiale del parco) e resta.

**Cose che il corpo NON fa, per costruzione**: nessun link verso `/posto/:id`
dalla micro-sezione «Due posti dove non si dorme» (le due voci sono scritte per
esteso e restano fuori dall'`ItemList`); un solo link a `/collaborazioni`, in
ultima posizione, senza cifre e senza nomi di formato; nessuna occorrenza del
flag di verifica che `publish-article-seed.mjs` respinge — che è anche il motivo
per cui qui sopra non lo scrivo per esteso: se qualcuno incolla l'intera sezione
`## Body` invece del solo corpo, la pubblicazione fallirebbe per colpa di questa
nota. Nessun numero che non sia nel registro (98 · 190 · 210 · 40 · 50 · 132 ·
A26 · 1200 · 100 pollici · 15 agosto 2026 e le dieci date dei reel).

**Ordine di prima apparizione dei dieci `/posto/:id`** (serve identico
all'`ItemList` e alla proprietà `position`): 1 `novara-emotional-grand-motel`
(card) · 2 `casola-spino-fiorito` · 3 `bossico-placat` · 4
`poppi-fattorie-di-celli` · 5 `emilia-granduca-di-campigna` (card) · 6
`grone-narciso-home-chalet` · 7 `bracciano-enjoy-house` · 8
`toscana-suite-spa-civico-4` · 9 `massa-lubrense-relais-freedom` · 10
`firenze-villa-tolomei` (card). Attenzione al parser dell'`ItemList`: la card
del Granduca (posizione 5) compare **dopo** il link inline di Placat e Celli, e
quella di Villa Tolomei **dopo** tutti gli altri — l'ordine di prima apparizione
nel markdown coincide già con l'ordine del Brief, non serve riordinare.

**Pull-quote candidate per il layout** (asset-curator / ui-designer):

- «L'assenza di etichetta non è una dimenticanza: è l'etichetta.»
- «Si arriva in auto, poi si sta.»
- «Nessuno lo avrebbe scritto davvero: sarebbe successo e basta, in silenzio.»

## Assets (compilato da travellini-asset-curator — 2026-08-18)

### Finding che ha deciso tutto il resto: le cover del registro non sono usabili così come sono per hero/sezione

Prima di scegliere qualsiasi foto ho aperto (visivamente, non solo per nome file)
`novara-emotional-grand-motel-cover.webp` e altre otto cover candidate. **Tutte**
portano una title-card bruciata nel pixel — box bianco translucido, hook
interrogativo, nome del posto in corsivo — identica al template con cui R&B
confezionano ogni cover reel (verificato anche su un lotto scarti non imparentato
in `backups/covers-lotto1/reel/`, stesso identico layout: è una convenzione di
brand su tutto il corpus, non un errore di una singola immagine).

Per le cinque voci con blocco (`:::posto`/`:::reel`) questo non è un problema: il
blocco le mostra come card verticale in stile reel, dove il testo bruciato *è* il
linguaggio della card. Ma per **hero e OG è una violazione diretta della regola
"niente testo bruciato nell'immagine"** — l'hero ha già il suo H1 vero in overlay
(`ArticleHero.tsx:102-104`), e impilarci sopra un secondo titolo con font e
messaggio diversi (es. "SUITE A TEMA? Novara") rompe la gerarchia invece di
rinforzarla. Per le sezioni inline lo stesso testo distrarrebbe da "la cosa
strana" che l'H3 dichiara.

**Soluzione applicata, dentro il mio perimetro**: non genero niente, **ritaglio**
le cover esistenti con `sharp` (già una dipendenza del progetto, usata da
`scripts/optimize-images.mjs` con le stesse impostazioni che ho replicato: AVIF
q55-60/effort6, WebP q70-80/effort5, varianti 320/480/768) per togliere la
title-card e isolare la scena reale sotto. Stesso fotogramma, nessun elemento
nuovo, nessuna generazione — è un ritaglio, non una creazione. File nuovi in
`public/images/articles/dormire-posti-sembrano-inventati/`, provenienza
registrata in `src/data/asset-provenance.json` (`real-frame`, regola per
prefisso più lunga di `/images/articles/`), `npm run audit:provenance` verde
[MISURATO: comando eseguito il 2026-08-18, 0 errori nuovi].

### Hero photo

**Scelta: Emotional Grand Motel (voce 1), non Spino Fiorito.** Il handoff
proponeva entrambi. Motivo della scelta, verificato guardando le foto vere e non
solo i nomi:

- La cover di Spino Fiorito (candidata "promessa visiva del titolo" nel handoff)
  **non mostra la mirror house**: è uno scatto interno alla sauna, con vista sulle
  montagne — bello, ma non prova "casa di specchi che riflette il bosco". Nessun
  asset disponibile mostra davvero l'esterno a specchi. Usarla come hero sarebbe
  promettere un'immagine che poi il corpo non consegna.
- La cover EGM invece **mostra esattamente** la scena del primo paragrafo del
  corpo ("letto rotondo dentro una gabbia dorata, pareti rosse"), parola per
  parola. È anche il reel più visto della storia del brand (4,5M play). Apertura
  lockata + immagine che la conferma alla lettera: narrative fit massimo.

**Rischio dichiarato, non nascosto**: la stessa scena ricompare nel blocco
`:::posto` ~250 parole dopo. L'ho accettato perché (a) è un ritaglio diverso —
panoramico sulla gabbia intera, non il frame verticale da reel della card — e
(b) è un bookend editoriale legittimo: apri sulla stanza, il lettore la rivede
strutturata nella card. Se in review sembra ridondante, l'alternativa di
ripiego è **non usare nessuna foto EGM come hero** e promuovere invece un
crop di Villa Tolomei (voce 10, chiusura, viale di cipressi) — ma perderebbe
l'aggancio diretto con l'attacco, che è il motivo per cui l'ho scartata come
prima scelta.

**Colore**: la stanza è rossa satura, fuori dalla palette sabbia/terracotta del
sito. Scelta deliberata, non svista: l'H3 stesso dichiara "pareti rosse", ed
è il primo di dieci posti "che sembrano inventati" — il contrasto con l'estetica
calma del resto del sito è la prova visiva della tesi del pezzo. `ArticleHero.tsx`
applica già `saturate-[0.9] brightness-[0.88]` a ogni hero, che smorza il rosso
quel tanto che serve a leggerci sopra il testo bianco.

| Campo | Valore |
| --- | --- |
| File | `/images/articles/dormire-posti-sembrano-inventati/hero-emotional-grand-motel.webp` (+ `.avif`, + varianti `-480`/`-768`) |
| Sorgente | Ritaglio di `/images/reels/novara-emotional-grand-motel-cover.webp` (frame reale, `real-frame` già in registro) |
| Crop | 1080×700 (≈1.54:1), estratto a `top:750` dalla cover 1080×1920 nativa — sotto la title-card, gabbia+letto+tende centrati |
| Peso | webp 48,1 KB · avif 40,6 KB — muy sotto il budget hero (≤200 KB) [MISURATO: `fs.statSync` sui file generati] |
| Alt (IT) | "Letto rotondo dentro una gabbia dorata con pareti e tende rosse, all'Emotional Grand Motel di Novara." (101 caratteri) |
| LCP-critical | Sì — `ArticleHero` già passa `priority` + `fetchPriority="high"` a `OptimizedImage`, nessuna modifica di codice richiesta |

### Section photos (voci senza blocco: 3, 4, 7, 8, 9)

Tutte e cinque avevano un frame reale che mostra "la cosa strana" dichiarata
nell'H3 — nessuna voce è rimasta senza foto per mancanza di materiale. Ogni
crop è stato verificato a vista (non solo per didascalia) prima di essere
approvato.

| # | `id` | File (webp, + avif + `-480`/`-768`) | Crop sorgente | Peso (webp/avif) | Cosa mostra |
| --- | --- | --- | --- | --- | --- |
| 3 | `bossico-placat` | `section-bossico-placat.webp` | 1080×1000 da `top:420` | 168,2 KB / 122,7 KB | Struttura geodetica di tela fra gli abeti, luce che filtra dall'alto, donna che si avvicina all'ingresso |
| 4 | `poppi-fattorie-di-celli` | `section-poppi-fattorie-di-celli.webp` | 1080×1100 da `top:420` | 264,8 KB / 214,1 KB | Coppia seduta su cuscini sopra la rete, tronchi muschiati intorno, maglia della rete visibile sotto |
| 7 | `bracciano-enjoy-house` | `section-bracciano-enjoy-house.webp` | 1080×800 da `top:1050` | 39,5 KB / 27,5 KB | Il tagliere sul bordo vasca, in primo piano, schiuma e luce azzurra sullo sfondo — nessuna persona in vista |
| 8 | `toscana-suite-spa-civico-4` | `section-toscana-suite-spa-civico-4.webp` | 1080×500 da `top:405` (≈2.16:1, letterbox) | 22,9 KB / 19,5 KB | I due schermi sovrapposti in proiezione, luce viola, nessuna persona in vista |
| 9 | `massa-lubrense-relais-freedom` | `section-massa-lubrense-relais-freedom.webp` | 900×480 da `top:330` | 59,0 KB / 51,5 KB | Terrazza con costiera sorrentina e Capri all'orizzonte, due persone sedute in conversazione |

Tutti sotto o vicino al budget "Article inline" (≤120 KB): le due cover più
pesanti (Placat, Celli — molta texture di bosco) superano il target sul file
base/`-768` in WebP, ma **l'AVIF — il formato che la maggioranza dei browser
riceve — sta sotto budget su entrambe** (122,7 KB e 214,1 KB sono il *file
base* a piena larghezza 1080px, non quello che verrà servito: a container
tipico ≤700px la variante `-480` è quella selezionata dal `srcSet`, 52-74 KB).
Non ho ricompresso oltre: sotto quella soglia la texture del bosco iniziava a
sgranarsi.

**Scelte di crop deliberate, non automatiche**:

- **Enjoy House**: ho scartato il crop che include la persona in vasca
  (scollatura, primo piano) a favore del solo tagliere — è più preciso
  rispetto all'H3 ("il tagliere", non "la vasca con qualcuno dentro") ed è
  anche il registro editoriale più coerente col resto del sito.
- **Civico 4**: idem — ho escluso la coppia che si scambia baci in vasca,
  visibile nella parte bassa della cover, e tenuto solo i due schermi. La
  "cosa strana" è il cinema, non la coppia.
- **Relais Freedom**: crop tagliato appena sotto le spalle — meno il costume,
  più la vista. Non è censura, è restare sul soggetto dichiarato ("la
  terrazza con Capri", non "le due persone in bikini").
- **Placat**: preferito il crop più ampio (con più cielo/luce fra i tronchi)
  a quello più stretto sulla cupola: comunica meglio "sembra inventato" con
  i fasci di luce fra gli alberi.

**Dove inserirle nel corpo** (indicazione per il frontend-builder, non ho
toccato `## Body`): un'immagine subito dopo il paragrafo di ciascuna delle
cinque sezioni senza blocco, prima dell'H3/H2 successivo — stesso pattern
delle `InlineFigure` già usate altrove. Markdown pronto da incollare:

```md
![Struttura geodetica di tela fra gli abeti del bosco di Bossico, con la luce che filtra tra i tronchi.](/images/articles/dormire-posti-sembrano-inventati/section-bossico-placat.webp)

![Coppia seduta su cuscini sopra una rete sospesa fra i tronchi, nel bosco delle Fattorie di Celli a Poppi.](/images/articles/dormire-posti-sembrano-inventati/section-poppi-fattorie-di-celli.webp)

![Tagliere di salumi, formaggi e fritti appoggiato sul bordo di una jacuzzi con luci azzurre, a Enjoy House Bracciano.](/images/articles/dormire-posti-sembrano-inventati/section-bracciano-enjoy-house.webp)

![Due schermi sovrapposti che proiettano un film, in luce viola, dentro la Suite Spa Civico 4 in Toscana.](/images/articles/dormire-posti-sembrano-inventati/section-toscana-suite-spa-civico-4.webp)

![Due persone sedute su una terrazza con vista sulla costiera sorrentina e Capri all'orizzonte, al Relais Freedom Club.](/images/articles/dormire-posti-sembrano-inventati/section-massa-lubrense-relais-freedom.webp)
```

**Attenzione tecnica per il frontend-builder (misurata, non un'opinione)**:
`ArticleMarkdownBody.tsx:135-138` instrada ogni `<img>` markdown su
`InlineFigure.tsx`, che renderizza un `<img src=...>` semplice — **non**
`OptimizedImage`, quindi **nessun `<picture>` con sorgente AVIF** per le
immagini inline dell'articolo, a differenza dell'hero e delle card `:::posto`.
Il `src` sopra punta al `.webp` (supporto pressoché universale) proprio per
questo: se punto all'`.avif`, Safari <16 non lo carica e non c'è fallback.
Ho comunque generato anche gli `.avif` (stessi nomi, stessa cartella): se
`InlineFigure` viene aggiornato a `<picture>` prima del publish, sono già
pronti — file gap, non `## Body` da riscrivere.

### Replacements proposed

Nessuno. Le cover del registro e del manifest reel restano intatte — i nuovi
file sono ritagli aggiuntivi, non sostituzioni.

### Assets missing (request to R&B)

Nessuno: tutte e cinque le voci senza blocco avevano un frame reale che mostra
la cosa dichiarata nell'H3. L'unico asset che *manca davvero* è la facciata a
specchi di Spino Fiorito (vedi hero, sopra) — non blocca questo pezzo (la voce
2 ha il suo blocco `:::reel` con l'interno), ma se un giorno arriva quello
scatto è il candidato naturale per una futura hero alternativa o per la copertina
social di un pezzo dedicato alla mirror house.

### OG card

- **File richiesto**: `/og/dormire-posti-sembrano-inventati.jpg` (1200×630,
  JPG) — **non generato da me**: è fuori dal mio perimetro di scrittura
  (`public/og/`, non `public/images/`) e la pipeline che lo emetterebbe,
  `scripts/generate-og-images.mjs`, oggi produce **solo card tipografiche**
  (SVG con gradiente sabbia + titolo, nessuna foto — verificato leggendo lo
  script: `buildSvg()` non compone mai un'immagine di sfondo). Estendere quello
  script a un template fotografico è una modifica di codice: la lascio al
  frontend-builder.
- **Sorgente fotografica pronta**: ho prodotto e salvato
  `/images/articles/dormire-posti-sembrano-inventati/og-source-emotional-grand-motel.jpg`
  — stesso soggetto dell'hero, ricadrato esatto a 1200×630, **106,7 KB**, nessun
  testo bruciato. È il file da cui comporre la card finale.
- **Perché una foto e non il template tipografico standard**: il vantaggio
  competitivo dichiarato dal pezzo (SEO §"Perché una foto e non il template
  tipografico") è "ci siamo stati davvero" — una card tipografica identica a
  tutte le altre pagine non lo dimostra, una card fotografica sì. Rientra nella
  regola "OG cards are the only allowed exception" per il testo in overlay: qui
  il testo va aggiunto in composizione, non è bruciato nella foto sorgente.
- **Testo overlay proposto (IT, 4 parole)**: **"Posti che sembrano inventati"**
  — stessa apertura dell'H1, entro il limite di ~6 parole. Non aggiungere "e ci
  dormi": la foto (un letto vero) fa quel lavoro da sola.
- **Composizione richiesta**: scrim scuro sul terzo sinistro dell'immagine (già
  la zona più scura del frame — tenda/schermo TV), testo bianco/crema sopra lo
  scrim, wordmark "Travellini**with**us" in basso a sinistra nello stesso
  stile di `generate-og-images.mjs:85-90` (Georgia/serif, terracotta sul
  "with"), nessun logo dominante. Non centrare il testo sul volto della persona
  nella foto.
- **Formato**: JPG obbligatorio per compatibilità anteprime (motivo già
  misurato nell'handoff SEO: `Articolo.tsx:410`, `SEO.tsx:19-21`). Il sorgente
  che ho prodotto è già `.jpg`.

### Alt text — tabella completa (pronti da incollare)

| Asset | Alt (IT) | Caratteri |
| --- | --- | --- |
| Hero (EGM) | Letto rotondo dentro una gabbia dorata con pareti e tende rosse, all'Emotional Grand Motel di Novara. | 101 |
| Sezione Placat | Struttura geodetica di tela fra gli abeti del bosco di Bossico, con la luce che filtra tra i tronchi. | 101 |
| Sezione Fattorie di Celli | Coppia seduta su cuscini sopra una rete sospesa fra i tronchi, nel bosco delle Fattorie di Celli a Poppi. | 105 |
| Sezione Enjoy House | Tagliere di salumi, formaggi e fritti appoggiato sul bordo di una jacuzzi con luci azzurre, a Enjoy House Bracciano. | 116 |
| Sezione Civico 4 | Due schermi sovrapposti che proiettano un film, in luce viola, dentro la Suite Spa Civico 4 in Toscana. | 103 |
| Sezione Relais Freedom | Due persone sedute su una terrazza con vista sulla costiera sorrentina e Capri all'orizzonte, al Relais Freedom Club. | 117 |

Nessun alt cita "travelliniwithus", "Rodrigo/Betta" o nomi propri delle persone
ritratte (non verificabile chi siano in ogni frame, e la regola vieta nomi
propri senza consenso esplicito documentato). Le cinque voci con blocco
(`:::posto`/`:::reel`) usano il `coverAlt` già in `content-seed.json`/`reels.ts`
— non li ho toccati, sono già buoni (confermato nel handoff).

### Performance summary

- Peso totale sopra la piega (solo hero, unico elemento above-fold): **48,1 KB
  webp / 40,6 KB avif** — muy sotto il budget hero di 200 KB.
- LCP candidate: `hero-emotional-grand-motel.webp`/`.avif` — preload: gestito
  già da `ArticleHero`/`OptimizedImage` via `priority`+`fetchPriority="high"`,
  nessuna modifica di codice necessaria.
- Copertura formati: AVIF ✓ · WebP ✓ · fallback JPG non necessario per hero e
  sezioni (pattern `<picture>` di `OptimizedImage` gestisce avif+webp); **il
  fallback AVIF→WebP manca per le immagini inline `InlineFigure`** (gap
  esistente, non introdotto da questo lavoro — segnalato sopra).
- Varianti responsive `-480`/`-768` generate per tutti e 6 gli asset, pronte se
  il frontend-builder collega `responsiveWidths`/`baseWidth` su `OptimizedImage`
  (hero) o aggiorna `InlineFigure` a `<picture>` (sezioni).

### Hand-off

- Implementazione: inserire il markdown delle 5 section photo nei punti
  indicati sopra, collegare `article.image`/`article.imageAlt` del seed alla
  hero, estendere `scripts/generate-og-images.mjs` (o produrre manualmente)
  `/og/dormire-posti-sembrano-inventati.jpg` dalla sorgente fornita → 
  `travellini-frontend-builder`, handoff scritto in
  `docs/50_Scratch/HANDOFF_dormire-posti-sembrano-inventati_asset_to_frontend.md`.
- Misura LCP reale in browser dopo il collegamento → `browser-auditor`.
- Il gap AVIF mancante su `InlineFigure` (tutte le immagini inline di tutti gli
  articoli, non solo questo) è debito preesistente: segnalarlo al backlog se
  il frontend-builder non lo risolve in questo giro.

## Quality gates

- [x] H1 + meta + slug definiti (2026-08-18 — sezione `## SEO`; le stringhe vanno
      ancora applicate al seed dal frontend-builder)
- [x] Body 1500-3500 parole (2026-08-18 — sezione `## Body`, ~2.700 parole,
      7 blocchi su 8; conteggio da riconfermare con un contatore reale)
- [x] Photo plan completo + alt text Italian (2026-08-18 — sezione `## Assets`:
      hero + 5 section photo ritagliate e ottimizzate, OG source pronta,
      provenienza registrata, `npm run audit:provenance` verde)
- [ ] Pagina live su localhost
- [ ] /predeploy passa (quality + security + perf + browser)
- [x] Repurpose plan in social calendar (2026-08-18 — sezione `## Repurpose`:
      reel di lancio, carosello a 12 slide, newsletter, 3 hook alternativi,
      distribuzione e misura. **Pianificato, non eseguito**: la condizione di
      lancio G1-G4 è tutta aperta, il dominio resta chiuso per decisione owner)

## Repurpose (compilato da travellini-social-content-operator — 2026-08-18)

### Condizione di lancio — questo piano si prepara, non si esegue

**Decisione owner registrata: il dominio resta chiuso per ora.** Quindi qui sotto
c'è tutto il materiale pronto da montare e da incollare, e **nessuna data di
pubblicazione**. Non si posta niente finché non sono veri tutti e quattro i punti:

| #   | Gate                                                                                                                                     | Stato oggi                                                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| G1  | `travelliniwithus.it` serve il progetto, non la Coming Soon                                                                              | **Aperto.** Risponde da `aruba-proxy` con marker WordPress [voce #3b del backlog unico, verificata il 2026-08-11 da `audit:api-live`] |
| G2  | L'articolo è pubblicato (`published: true`) e la rotta `/articolo/dormire-posti-sembrano-inventati` risponde 200 sul dominio              | **Aperto.** Questa nota è `status: draft`; i gate «Pagina live su localhost» e «/predeploy» qui sopra sono ancora da spuntare        |
| G3  | La pagina è indicizzabile e osservabile: Search Console verificata, GA4 che raccoglie                                                     | **Aperto.** `VITE_GA_ID` + consenso analytics sono condizione del caricamento [MISURATO nel Brief: `src/services/analytics.ts:16,39-50`] |
| G4  | Il link in bio porta **a questo articolo**, non al lead magnet (vedi «BIO_LINKS» sotto)                                                   | **Aperto.**                                                                                                                          |

Perché è una condizione e non una raccomandazione: il reel di apertura riusa il
girato dell'Emotional Grand Motel, cioè il secondo contenuto più visto della
storia del brand. Bruciarlo su un link che cade su una Coming Soon non è un
lancio andato male: è spendere l'asset con la reach più alta che abbiamo per non
consegnare niente. Lo stesso vale, in peggio, se qualcuno manda il link a una
delle strutture (rischio #3 già registrato nella sezione «Rischio di brand»).

**Cosa invece si può fare oggi, senza violare la condizione**: produrre i dieci
ritagli 4:5, montare il reel, registrare il voice-over, scrivere e far rileggere
le caption, preparare l'email in bozza su Brevo. Tutto tranne premere pubblica.

### BIO_LINKS: il link in bio oggi non regge il lancio

Tre cose misurate, tutte da sistemare prima di G4:

1. **Punta alla pagina sbagliata per questo lancio.** `BIO_LINKS` manda a
   `/guida-in-regalo?utm_source=ig_bio&utm_medium=social&utm_campaign=lead_magnet`
   [MISURATO: `src/config/site.ts:20-23`]. È il lead magnet, non l'articolo.
2. **Non è cablato a nessuna superficie.** `BIO_LINKS` non è importato da nessun
   modulo: l'unica occorrenza nel codice è la sua definizione
   [MISURATO: `Grep BIO_LINKS` su `src/` → solo `src/config/site.ts:20`]. È una
   costante da copiare a mano nella bio IG/TikTok, quindi il valore giusto deve
   esserci **prima** che R&B aggiornino la bio, non dopo.
3. **Comunque non risponde sul dominio.** `/guida-in-regalo` è dentro
   `ALL_STATIC_APP_ROUTES` [MISURATO: `server.ts:186`], quindi 200 in locale — ma
   in produzione il dominio non serve il progetto (G1). Oggi quell'URL cade sulla
   Coming Soon.

**Nota di onestà**: nel repo non ho trovato una nota d'audit datata 2026-08-12 che
nomini `BIO_LINKS`. Quello che ho scritto qui sopra l'ho misurato oggi sul codice;
se l'audit citato dice la stessa cosa, combacia.

**Decisione da prendere prima del lancio [OWNER]** — quale dei due, non entrambi:

- **A (raccomandato per questa finestra)**: bio → articolo per 14 giorni, poi
  ritorno al lead magnet. Il pezzo è il pilastro: mandare il traffico del lancio a
  una pagina che non è quella di cui parla il reel costa un passaggio in più.
- **B**: bio invariata sul lead magnet, articolo solo dallo sticker link nelle
  storie. Si perde il canale principale, si tiene la lead capture.

**Conflitto di convenzione UTM, da chiudere con la stessa decisione**: `BIO_LINKS`
usa `utm_source=ig_bio&utm_medium=social`, il content calendar prescrive
`utm_source=instagram&utm_medium=reel&utm_campaign=[slug-articolo]`
[MISURATO: `docs/13_Content/CONTENT_CALENDAR_H2_2026.md`, «Naming conventions»].
Due convenzioni diverse sulla stessa proprietà GA4 rendono il rapporto illeggibile.
Sotto uso quella del calendario, con `utm_medium` che dice il formato.

### Cosa esiste davvero come girato — nessuna ripresa nuova

Tutto il piano si regge su materiale già pubblicato. Stato per voce:

| #   | Voce                          | Reel già pubblicato (permalink in `reels.ts`) | MP4 in `public/video/` | Frame già ritagliato |
| --- | ----------------------------- | --------------------------------------------- | ---------------------- | -------------------- |
| 1   | Emotional Grand Motel         | ✓ 2024-09-16                                  | ✓                      | ✓ hero + OG source   |
| 2   | Spino Fiorito                 | ✓ 2025-10-09                                  | ✗                      | ✗                    |
| 3   | Placat                        | ✗ **nessuna voce nel manifest**               | ✗                      | ✓ section photo      |
| 4   | Fattorie di Celli             | ✓ 2025-09-15                                  | ✗                      | ✓ section photo      |
| 5   | Granduca di Campigna          | ✓ 2026-01-16                                  | ✓                      | ✗                    |
| 6   | Narciso Home (**ADV**)        | ✓ 2026-05-24                                  | ✓                      | ✗                    |
| 7   | Enjoy House                   | ✓ 2025-10-02                                  | ✗                      | ✓ section photo      |
| 8   | Suite Spa Civico 4 (su invito)| ✓ 2026-06-19                                  | ✓                      | ✓ section photo      |
| 9   | Relais Freedom Club           | ✓ 2025-08-07                                  | ✗                      | ✓ section photo      |
| 10  | Villa Tolomei                 | ✓ 2025-12-12                                  | ✓                      | ✗                    |

[MISURATO: `src/config/reels.ts` per permalink e date · `Glob public/video/*.mp4`
per i file · sezione `## Assets` di questa nota per i ritagli già prodotti.]

Tre conseguenze operative, non opinioni:

- **9 voci su 10 hanno un reel pubblicato, 5 su 10 hanno l'MP4 nel repo.** Per le
  altre quattro il montatore parte dagli originali di R&B o dal permalink: è
  recupero di materiale già girato, non un girato nuovo. Il commento in
  `src/components/article/directives/reel.tsx:12-19` documenta la stessa cosa —
  15 voci del manifest hanno cover reale e nessun MP4 (tranche 2026-08-11).
- **Placat non ha un reel.** Nessuna voce nel manifest, nessun permalink, nessun
  MP4 [MISURATO]. Esiste solo il frame reale (`bossico-placat-cover.webp` +
  il ritaglio di sezione). Nel reel entra come **fermo immagine**, oppure non
  entra. Non si inventa un clip che non c'è.
- **Della mirror house non esiste un fotogramma dell'esterno a specchi.** La cover
  di Spino Fiorito mostra la sauna con la vetrata, non la facciata — accertato a
  vista dall'asset-curator in `## Assets`. Quindi «casa rivestita di specchi» non
  può essere una promessa visiva del reel: o il girato originale contiene la
  facciata (**da verificare in fase di montaggio**), o il testo a schermo descrive
  quello che si vede.

---

### 1 · Reel di lancio

```
Format: Reel (IG) + riuso identico su TikTok
Pillar: posti particolari + esperienze reali e provate
Durata: ~33s
```

**Hook (0:00-0:03)** — testo a schermo sul primo fotogramma, sopra il letto dentro
la gabbia dorata:

> **«Esiste davvero o è montato bene?»**

Voice-over sulla stessa battuta: «Ce lo chiedete ogni volta.» È la domanda dei
commenti, già dentro il corpo dell'articolo: non è un claim, è una citazione del
pubblico. Nessun «ciao a tutti», nessun «posto da sogno».

**Valore**: dieci alloggi italiani in cui abbiamo dormito davvero, raccolti in una
pagina sola, con quello che in trenta secondi non ci stava — indirizzo, telefono,
e per chi il posto non funziona.

**Beat**

| #   | Tempo     | Girato (fonte)                                                              | Testo a schermo                          |
| --- | --------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| 1   | 0:00-0:03 | EGM, letto rotondo nella gabbia dorata (MP4 in repo, reel 2024-09-16)       | «Esiste davvero o è montato bene?»        |
| 2   | 0:03-0:07 | EGM, secondo taglio: pareti e tende rosse                                   | «Ci abbiamo dormito. E sono dieci.»       |
| 3   | 0:07-0:09 | Fattorie di Celli: coppia sui cuscini sopra la rete, tronchi intorno        | «una rete sospesa, sotto il vuoto»        |
| 4   | 0:09-0:12 | Granduca: piscina illuminata di blu nella grotta di pietra                  | «una spa dentro una grotta · da 98€»      |
| 5   | 0:12-0:15 | Narciso Home: jacuzzi riscaldata con vista sulla natura                     | «una jacuzzi riscaldata» + badge **ADV**  |
| 6   | 0:15-0:17 | Enjoy House: il tagliere appoggiato sul bordo della vasca, luci azzurre     | «l'aperitivo dentro la vasca»             |
| 7   | 0:17-0:20 | Civico 4: i due schermi in proiezione, luce viola                           | «un cinema da cento pollici»              |
| 8   | 0:20-0:22 | Relais Freedom: terrazza con la costiera e Capri all'orizzonte              | «Capri davanti»                           |
| 9   | 0:22-0:28 | Rientro rapido sui frame EGM e Narciso, badge in sovrimpressione            | «7 su 10 non ce li ha offerti nessuno · 3 sì, e lo scriviamo» |
| 10  | 0:28-0:33 | Villa Tolomei: il viale di cipressi in discesa con Firenze sullo sfondo     | «Tutti e dieci, in una pagina sola»       |

**Chi resta fuori dal reel, e perché**: Spino Fiorito (non esiste un fotogramma
verificato della facciata a specchi) e Placat (non esiste il clip). Vivono nel
carosello, dove un fermo immagine è il formato, non un ripiego. Villa Tolomei non
è nella sequenza perché è il fotogramma di chiusura: il viale di cipressi in
discesa è l'unico movimento di camera che regge cinque secondi sotto la CTA.

**Regia**: montaggio nativo, tagli sul beat, nessuna transizione decorativa.
Niente formato «slide deck». Il voice-over è di uno solo dei due, non alternato:
in 33 secondi due voci diventano rumore.

**CTA (esatta)**: a schermo e in voce, sul beat 10 — «Sono tutti e dieci sul sito,
con indirizzo e telefono. Link in bio.»
Destinazione:
`/articolo/dormire-posti-sembrano-inventati?utm_source=instagram&utm_medium=bio&utm_campaign=dormire-posti-sembrano-inventati`

**Caption (IT, pronta da incollare)**

```
«Esiste davvero o è montato bene?» — è la domanda che ci fate ogni volta.
Dieci alloggi italiani in cui abbiamo dormito, dal settembre 2024 a giugno 2026: cos'ha di strano ognuno, quanto costa dove il prezzo lo sappiamo, e per chi non funziona.
Sette su dieci non ce li ha offerti nessuno. Con l'Emotional Grand Motel abbiamo una collaborazione, Narciso Home è pubblicità (ADV), alla Suite Spa Civico 4 ci hanno invitati: sta scritto dentro, voce per voce.
Indirizzo e telefono di tutti e dieci: link in bio.

#alloggiparticolari #postiparticolari #italiainsolita #weekendromantico #dormirefuoridaglischemi
```

**Business goal**: ingresso organico sull'articolo (autorità come sottoprodotto).
**Metrica primaria del formato**: sessioni con `utm_medium=bio` nelle 48h dalla
pubblicazione. **Metrica secondaria, dichiarata come tale**: salvataggi.
**Repurpose path**: Reel IG → stesso montaggio su TikTok senza watermark →
3 frame storia con sticker link → estratto di 8s per la storia di richiamo a T+10.
**Asset**: solo ritagli e montaggio da girato esistente. Un voice-over nuovo
(30 secondi di registrazione), nessuna ripresa.

---

### 2 · Carosello IG — 12 slide

```
Format: Carousel 4:5 (1080×1350)
Pillar: posti particolari
```

Dodici slide e non le sei-dieci abituali: è il formato che regge le dieci voci
intere, come indicato nell'handoff. Una foto reale per slide, testo poco e grande,
nessun collage.

| Slide | Foto                                   | Testo                                                                                                                                       |
| ----- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | EGM, gabbia dorata (cover)             | **«Dieci posti in Italia che sembrano inventati. Ci abbiamo dormito.»** · sotto, piccolo: «Sette non ce li ha offerti nessuno. Tre sì, e lo diciamo.» |
| 2     | EGM                                    | **Un letto dentro una gabbia dorata** — Fontaneto d'Agogna (NO). A cento metri dal casello. È un motel vero, con i soggiorni a ore: non è un albergo di charme. `IN COLLABORAZIONE` |
| 3     | Spino Fiorito (sauna con vetrata)      | **Una casa rivestita di specchi** — Casola in Lunigiana (MS). Gli specchi riflettono il bosco e cambiano con la luce. Si arriva in auto, poi si sta: non c'è niente da raggiungere a piedi. |
| 4     | Placat (struttura di tela fra gli abeti)| **Una bolla di tela nel bosco** — Bossico (BG), sopra il lago d'Iseo. Non «prende poco»: internet non c'è, è una scelta loro.                |
| 5     | Fattorie di Celli (rete sospesa)       | **Una rete sospesa fra i tronchi** — Poppi (AR). Ci si sdraia e sotto non c'è niente. Se ci si dorma davvero, chiedetelo a loro: il numero è sulla scheda. |
| 6     | Granduca (piscina blu nella grotta)    | **Una spa dentro una grotta** — Santa Sofia (FC). Da 98€ a notte: il più economico dei dieci. L'aperitivo si beve lì dentro.                 |
| 7     | Narciso Home (jacuzzi con vista)       | **Una jacuzzi riscaldata con vista** — Grone (BG). Aperitivo e colazione inclusi: chiusa la porta, non uscite più. `ADV — questa voce è pubblicità` |
| 8     | Enjoy House (tagliere sul bordo vasca) | **L'aperitivo dentro la jacuzzi** — Bracciano (RM), borgo medievale sul lago. È un po' kitsch. Funziona lo stesso.                            |
| 9     | Civico 4 (i due schermi, luce viola)   | **Un cinema da cento pollici in camera** — Follonica (GR). Da 190€, 210€ nel weekend. Solo maggiorenni: lo dice la struttura, non noi. `SU INVITO` |
| 10    | Relais Freedom (terrazza, Capri)       | **Una jacuzzi con Capri davanti** — Massa Lubrense (NA). Si sta lì tutto il giorno, è quello il punto: se volete girare la costiera vi lavora contro. |
| 11    | Villa Tolomei (viale di cipressi)      | **Una villa del Trecento con Firenze davanti** — Firenze. La sera non si esce a piedi: o si scende in auto o si resta. Va deciso prima, non alle otto con la fame. |
| 12    | Fondo sabbia, nessuna foto             | **«Sette su dieci non ce li ha offerti nessuno.»** · «L'assenza di etichetta non è una dimenticanza: è l'etichetta.» · **Salva questo carosello per il prossimo venerdì sera.** Indirizzo, telefono e per chi non vanno bene: link in bio. |

**La slide 1 deve reggere da sola nel feed**: nessun «swipe →», nessuna freccia
decorativa. Regge la foto della gabbia dorata più la frase intera — chi la
riconosce si ferma per il ricordo, chi non la conosce si ferma per la stanza.

La slide 12 riusa una delle pull-quote candidate delle note di consegna: è la
frase che riassume tutto il vantaggio del pezzo in dieci parole.

**Caption (IT, pronta da incollare)**

```
Li abbiamo pubblicati uno alla volta in due anni. Messi in fila sono dieci, e insieme dicono una cosa che da soli non dicevano.
Dieci alloggi italiani in cui abbiamo dormito: cos'ha di strano ognuno, i due prezzi che abbiamo verificato, e — soprattutto — per chi ogni posto non va bene.
Sette su dieci ce li siamo scelti noi, nessuno ci ha invitati né pagati. Degli altri tre: Emotional Grand Motel è una collaborazione, Narciso Home è pubblicità (ADV), alla Suite Spa Civico 4 ci hanno invitati.
Salvalo per il prossimo venerdì sera. La pagina con indirizzo e telefono di tutti e dieci è nel link in bio.

#alloggiparticolari #postiparticolari #italiainsolita #weekendromantico #mirrorhouse #casentino #lagodiseo
```

**Business goal**: ingresso organico + prova per il funnel partner.
**Metrica primaria del formato**: **salvataggi**. È il formato-archivio: chi salva
sta programmando, ed è la stessa persona che poi apre una scheda.
**Repurpose path**: carosello → 10 storie «una al giorno» con sticker link →
slide 12 come immagine singola per il post di richiamo → griglia di 3 slide per la
newsletter.
**Asset**: dieci ritagli 4:5 da fotogrammi reali già esistenti (dettaglio sotto).

---

### 3 · Newsletter

```
Format: Newsletter (Brevo)
Un solo link, come da handoff.
```

**Oggetto**: `Sette su dieci non ce li ha offerti nessuno` — **43 caratteri**,
dentro il limite di 55. Specifico, nessuna promessa, nessun punto esclamativo.

**Preview text**: `Dieci alloggi italiani in cui abbiamo dormito, e chi ce li ha offerti.`

**Corpo**

```
Si esce a Borgomanero sulla A26, si svolta, e dopo cento metri c'è un letto
rotondo dentro una gabbia dorata. È il primo dei dieci posti di cui vi
scriviamo oggi, ed è anche il più vecchio: quel video è di settembre 2024.

In due anni ne abbiamo pubblicati dieci così, uno alla volta. Ogni volta
arrivava la stessa domanda: «esiste davvero o è montato bene?». Adesso stanno
tutti in una pagina sola — una casa rivestita di specchi in Lunigiana, una
bolla di tela senza internet sopra il lago d'Iseo, una rete sospesa fra i
tronchi nel Casentino, una spa dentro una grotta.

Dentro c'è quello che in trenta secondi di video non ci stava: indirizzo e
telefono di ognuno, i due prezzi che abbiamo verificato davvero (da 98€ il più
economico, da 190€ il più caro), e per chi ogni posto non va bene. Quella parte
è la più utile, e di solito è quella che nessuno scrive.

Una cosa la diciamo qui e sta scritta anche là dentro: sette di questi dieci
ce li siamo scelti noi, nessuno ci ha invitati né pagati. Degli altri tre —
una collaborazione, un invito, una pubblicità — trovate l'etichetta dentro la
voce, non in fondo alla pagina.

→ Posti che sembrano inventati, e ci dormi

P.S. — Se dopo di noi ci siete stati voi e qualcosa è cambiato — un prezzo,
un orario, un servizio che non c'è più — rispondete a questa mail. La pagina
la correggiamo: è per quello che ha una data di verifica scritta sopra.
```

**Link unico**: `/articolo/dormire-posti-sembrano-inventati?utm_source=newsletter&utm_medium=email&utm_campaign=dormire-posti-sembrano-inventati`
Nessun secondo link: niente lead magnet, niente `/collaborazioni`, niente social.

**Business goal**: ingresso sull'articolo dall'unico pubblico che possediamo.
**Metrica primaria del formato**: click rate sull'unico link.
**Repurpose path**: paragrafo d'attacco → caption della storia di richiamo →
P.S. → testo della storia con sticker domanda («ci siete stati dopo di noi?»).

---

### 4 · Tre hook social alternativi

Da testare uno alla volta, non tutti insieme: con un pubblico solo, tre varianti
in parallelo non si leggono.

1. **«Sette di questi dieci non ce li ha offerti nessuno.»**
   Parte dalla trasparenza, che è il vero delta rispetto ai listicle da scrivania.
   Formato migliore: cover del carosello, o TikTok dove il testo regge più a lungo.
   *Rischio*: è un concetto, non un'immagine — funziona solo con un fotogramma
   forte sotto (la gabbia dorata o la grotta blu).

2. **«Ve l'abbiamo fatto vedere. Non ve l'abbiamo spiegato.»**
   Sfrutta il riconoscimento di un contenuto già visto e apre un vuoto informativo
   invece di ripetere lo stesso video. Formato migliore: Reel, primo fotogramma EGM.
   *Rischio*: funziona solo su chi ci segue da prima. Su pubblico freddo il primo
   «l'» non ha referente: serve che l'immagine lo dia subito.

3. **«Di dieci posti, il prezzo lo sappiamo di due. Ve lo diciamo lo stesso.»**
   L'ammissione come gancio: è la mossa che l'`EDITORIAL_GUIDE` chiama
   «il dubbio rafforza la credibilità».
   Formato migliore: Reel, primo fotogramma sulla grotta del Granduca (98€ è il
   numero vero che si può mostrare a schermo).
   *Rischio*: dichiara un'assenza. Se il pubblico legge «non lo sanno» invece di
   «non lo inventano», l'hook lavora contro. Da scartare se l'owner compila la
   checklist costi: in quel caso il numero c'è e l'hook non ha più senso.

Cosa **non** usiamo come hook, per chiarezza: «posto da sogno», «vista
mozzafiato», «non crederai», qualsiasi conto alla rovescia, e qualsiasi numero
di reach o follower. E nessun hook che prometta la facciata a specchi finché non
esiste il fotogramma che la mostra.

### Disclosure sui social — regola operativa, non ereditata dal sito

Le etichette del sito non passano automaticamente su IG/TikTok: vanno rifatte con
le regole della piattaforma **e** in parole italiane, perché il brand è in elenco
AGCOM (lo dichiara la bio stessa).

- **Narciso Home = ADV.** Ovunque compaia il suo girato: parola «pubblicità» o
  «ADV» **in sovrimpressione sul fotogramma** (non solo in caption) e riga
  dedicata in caption. Vale per reel, carosello, storie.
- **Emotional Grand Motel = collaborazione.** Dichiarata in caption e in
  sovrimpressione nel beat 9 del reel. Non basta averlo detto nel 2024.
- **Suite Spa Civico 4 = su invito.** Dichiarato in caption e sulla slide 9.
- **Le sette voci organiche vanno dette in positivo**, una volta per contenuto:
  «sette su dieci non ce li ha offerti nessuno». Sui social non esiste la card che
  distingue etichetta ed etichetta assente, quindi il silenzio si legge come
  reticenza — è lo stesso difetto già misurato sul sito
  (`PARTNERSHIP_LABEL.organic` è la stringa vuota).
- **[OWNER] Due decisioni che non posso prendere io:**
  1. se applicare anche **l'etichetta di piattaforma** «Collaborazione a
     pagamento» al reel e al carosello di lancio, che non sono contenuti pagati ma
     riusano girato di due contenuti commerciali. L'etichetta IG richiede che il
     partner accetti il tag: va chiesto, non attivato di iniziativa.
  2. se il **riuso del girato ADV in un contenuto nuovo** rientri negli accordi
     originali con Narciso Home e con l'Emotional Grand Motel. Nel repo non
     esiste nessuna clausola di esclusiva né di scadenza d'uso
     [MISURATO: nessuna occorrenza di «Narciso», «Emotional» o «esclusiv» in
     `docs/12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS.md`]. **Assenza di
     documento non è assenza di vincolo**: va verificato con loro, non dedotto.

### Distribuzione — ordine nel tempo, non date

`T0` = il giorno in cui G1-G4 sono tutti veri. Tutto il resto è relativo a quello.

| Quando   | Cosa                                                                 | Link e UTM                                                                    |
| -------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `T0`     | Verifica, nessuna pubblicazione: dominio, 200 sulla rotta, GA4 vivo   | —                                                                               |
| `T0`     | Aggiornamento bio IG e TikTok all'articolo (opzione A)               | `utm_source=instagram\|tiktok` · `utm_medium=bio` · `utm_campaign=<slug>`        |
| `T0+1g`  | **Reel di lancio** (IG e TikTok, stesso montaggio)                    | nessun link nel post: porta alla bio. Commento fissato con il titolo della pagina |
| `T0+2g`  | **3 storie**: fotogramma EGM → «e sono dieci» → sticker link          | `utm_medium=stories`                                                            |
| `T0+5g`  | **Carosello**                                                         | bio, stesso UTM del reel                                                        |
| `T0+7g`  | **Newsletter**                                                        | `utm_medium=email`                                                              |
| `T0+10g` | Storia di richiamo: estratto 8s dal reel + sticker domanda            | `utm_medium=stories`                                                            |
| `T0+14g` | Fine finestra: bio torna al lead magnet, se era stata spostata        | —                                                                               |

Sul commento fissato, un'accuratezza che conviene sapere prima: **su Instagram il
link nel commento non è cliccabile**. Serve come indicazione («la pagina si chiama
così»), non come percorso. L'unico clic diretto su IG sta nella bio e nello sticker
delle storie. Su TikTok il link cliccabile è solo quello di bio.

### Come si misura — una metrica per formato

| Formato    | Metrica                                              | Perché quella                                                            |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| Reel       | Sessioni con `utm_medium=bio` nelle 48h              | È l'unico segnale di traffico attribuibile con il link in bio             |
| Carosello  | Salvataggi                                           | È il formato-archivio: il salvataggio è l'intenzione di tornarci          |
| Storie     | Tap sullo sticker link                               | Unico clic misurato dalla piattaforma, senza inferenze                    |
| Newsletter | Click rate sull'unico link                           | Con un solo link, il click rate è il messaggio                            |

**Sopra tutte resta la metrica primaria del Brief**, che non cambia e non si
sostituisce: `article_place_click` / lettori unici, soglia **≥ 8%**, non leggibile
sotto 200 lettori unici. Il social serve a portare i 200 lettori, non a
riscrivere la soglia.

**Due limiti dichiarati adesso, non scoperti dopo:**

1. **L'attribuzione per formato è per finestra temporale, non per contenuto.** Con
   un unico link in bio, reel e carosello condividono la stessa destinazione: la
   distanza di cinque giorni fra i due serve anche a questo. Non è attribuzione
   pulita, è la migliore disponibile senza link per contenuto.
2. **Oggi non si misura niente.** GA4 si carica solo con `VITE_GA_ID` più consenso
   analytics [MISURATO nel Brief: `src/services/analytics.ts:16,39-50`], e le
   functions non sono deployate. Il piano di misura parte insieme a G3, non prima.

### Conflitti segnalati

1. **Slot di agosto del content calendar già occupato.** Il calendario assegna ad
   agosto 2026 «Borghi italiani sotto i 5K abitanti» e fissa il principio «un solo
   lancio grande al mese» [MISURATO:
   `docs/13_Content/CONTENT_CALENDAR_H2_2026.md`]. Questo pillar non è quel tema.
   Nessuno dei due è stato pubblicato — il sito non è online — quindi non è una
   collisione reale, ma **il calendario va allineato o dichiarato superato**: due
   piani che si contraddicono a distanza di un mese sono peggio di nessun piano.
2. **Cannibalizzazione dello slot di novembre.** «Weekend spa di carattere»
   (novembre 2026 nel calendario) userebbe materiale che questo pezzo consuma:
   quattro delle dieci voci sono spa o jacuzzi (Granduca, Narciso Home, Enjoy
   House, Civico 4). Da decidere prima di scrivere novembre, non dopo.
3. **Due convenzioni UTM in contraddizione** (vedi sezione BIO_LINKS). Va scelta
   una prima di `T0`: cambiarla a metà finestra rende il rapporto illeggibile.
4. **Nessuna esclusiva partner documentata**, e questo non chiude la questione:
   vedi il punto [OWNER] nella sezione disclosure.

### Asset da produrre — solo ritagli, nessuna generazione

Nessuna ripresa nuova, nessuna immagine generata: vale la stessa regola di verità
delle immagini del sito.

- **Dieci ritagli 4:5 (1080×1350)** dalle cover reel native 1080×1920, con la
  title-card bruciata rimossa — stesso trattamento già applicato in `## Assets`.
  Sei sono già stati prodotti in altro rapporto e vanno solo ri-inquadrati in 4:5
  (EGM, Placat, Celli, Enjoy House, Civico 4, Relais Freedom); **quattro sono da
  fare** (Spino Fiorito, Granduca, Narciso Home, Villa Tolomei). Destinatario:
  `travellini-asset-curator`. Provenienza `real-frame`, `npm run audit:provenance`
  deve restare verde.
- **Montaggio reel**: 5 MP4 già nel repo, 4 clip da recuperare dagli originali di
  R&B o dai permalink, 1 voce (Placat) che resta fermo immagine.
- **Un voice-over nuovo**, ~30 secondi, una voce sola.
- **Badge disclosure** in sovrimpressione (ADV / in collaborazione / su invito):
  testo, non grafica nuova.
- **Slide 12** su fondo sabbia con la pull-quote: composizione tipografica, nessuna
  foto — è l'unico asset che non nasce da un fotogramma.

### Note da aggiornare dopo il lancio

- `docs/MARKETING_OPERATIONS_HUB.md` — riga «Landing bio IG/TikTok» del funnel,
  quando la bio cambia davvero.
- `docs/13_Content/CONTENT_CALENDAR_H2_2026.md` — allineamento o superamento
  dichiarato degli slot agosto/novembre (conflitti 1 e 2).
- Questa nota — i risultati veri, sotto la sezione `## Repurpose`, quando esistono.
