---
type: content-brief
area: content
status: in-progress
priority: p1
owner: marketing
channel: website
pillar: posti particolari
related: '[[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]'
source: src/data/corpus-places.json
tags:
  - content
  - reel
  - archivio
---

# I 404 luoghi girati che il sito non ha

Ordine di lavoro ricavato dall'intero archivio reel. Tutte le cifre vengono da
`src/data/instagram-corpus.json` e `src/data/corpus-places.json`, incrociati con
`src/data/content-seed.json`.

## Il numero

Su **1.192 reel** restano **606 etichette di luogo** dopo aver tolto listicle,
adv-prodotto e non-posto (70), i reel senza geotag (123) e i geotag di città
generica. Di quelle:

| | |
| --- | ---: |
| Etichette amministrative (comuni, regioni, vie) | 112 |
| Luoghi già coperti da una scheda | 90 |
| **Luoghi girati e mai pubblicati** | **404** |

Su quei 404 stanno **90,4 milioni di visualizzazioni** che non portano a nessuna
pagina, e **60 hanno più di un reel**.

### Come è stato ottenuto, e i tre tentativi sbagliati prima

Il conteggio è passato per **537 → 528 → 465 → 404**. Solo l'ultimo è misurato;
i primi tre erano euristiche, e vale la pena sapere perché hanno fallito.

1. **Confronto sui nomi** → 537. Le etichette Instagram non sono i nomi
   editoriali: «Ristorante al Mago» sul sito è «Al Mago». In cima alla lista
   comparivano posti che il sito ha già.
2. **Confronto sulle coordinate entro 200 m** → 528. Misurata la distanza fra
   geotag e scheda per lo stesso locale: **da 0,7 a 3 km**. I geotag li scrivono
   gli utenti, le coordinate del sito vengono da geocodifica sul nome.
3. **Filtro dei generici come elenco scritto a mano** → 465. Quaranta nomi
   previsti, centinaia passati: restavano dentro «Emilia-Romagna», «Cuneo»,
   «Amsterdam», «Viale Monza».

**Provato e scartato:** distinguere i locali dalle città per dispersione delle
coordinate — l'idea che un locale abbia i reel concentrati e una città sparsi.
Non funziona: Instagram assegna **una coordinata unica per pagina-luogo**, quindi
«Milano» ha 42 reel con 24 metri di dispersione, esattamente come un ristorante.

**Quello che funziona** è la geocodifica inversa: risolvere le coordinate e
confrontare l'etichetta con il nome amministrativo che ci sta sopra. Fatta su
**624 luoghi, zero errori**, e persistita in `src/data/corpus-places.json` —
rigenerabile con `node scripts/geocode-corpus-places.mjs`, che salta ciò che ha
già risolto.

### Il residuo noto

Resta un piccolo margine verso l'alto. Il confronto e' per **uguaglianza esatta**,
e non prende il caso in cui l'etichetta e' un nome di citta' ma le coordinate del
geotag cadono nel comune accanto: «Mantova, Italy» risolve a «Porto Mantovano» e
sopravvive come se fosse un locale.

**Il rimedio ovvio e' peggiore del difetto.** Allargando a un confronto per
sottostringa si recuperano 130 etichette, ma la maggior parte sono locali veri
che portano il nome della citta' nell'insegna — «La Santoria Madrid», «TAKO SUSHI
ROMA», «Ristorante La Forchetta Parma», «Black Moon Firenze». Meglio 404 con
qualche riga da scartare a mano che 274 avendo buttato cento posti veri.

## Prima di leggere le regioni: alcuni geotag hanno coordinate sbagliate

Non imprecise — **sbagliate di paese**. Emerso guardando le tabelle qui sotto:

| Etichetta | Risolve a |
| --- | --- |
| `Pisa, Italy` | Stati Uniti |
| `Ponte Carlo / Praga` | Brasile |
| `Praga, Czech Republic` | Stati Uniti |
| `Warner Bros Studio London` | Svezia |
| `Marsa Alam, Egypt` | Repubblica Ceca |
| `Lazise, Italia` | Germania |
| `Praga, Republica Ceca` | Italia |

Su **63 etichette che nominano un paese verificabile, 7 risolvono altrove: l'11%.**
Estrapolato ai 624 luoghi sono una settantina di coordinate inattendibili.

La causa è nel dato di origine: le pagine-luogo di Instagram le creano gli utenti,
e più pagine omonime convivono — «Praga» esiste anche in Brasile e negli Stati
Uniti. La geocodifica inversa non sbaglia: risolve fedelmente coordinate che sono
già sbagliate in partenza.

**Due conseguenze, entrambe operative:**

- **La ripartizione per regione qui sotto è indicativa, non esatta.** «Torino,
  Italy» conta come Lombardia perché le sue coordinate cadono a Milano. L'ordine
  di grandezza regge, il singolo numero no.
- **Nessun importatore deve fidarsi delle coordinate del geotag** per riempire
  `place.coordinates`: sul sito quel campo alimenta la mappa, e un locale che
  compare in Svezia è un difetto visibile. Le coordinate vanno prese dalla
  geocodifica sul nome del posto, come gia' fa `scripts/geocode-content.mjs`, e
  il geotag va usato solo come indizio.

## Dove il divario è più largo

La geocodifica dà anche la regione, quindi si può confrontare il girato con il
pubblicato. **La Lombardia non è la regione più affamata: è la meglio coperta.**

| Regione | Girati mai pubblicati | Schede sul sito | Divario |
|---|---:|---:|---:|
| Inghilterra | 14 | 0 | 14× |
| — | 12 | 0 | 12× |
| Comunidad de Madrid | 10 | 0 | 10× |
| Emirato di Abu Dhabi | 8 | 0 | 8× |
| Lazio | 31 | 3 | 8× |
| Emilia-Romagna | 35 | 4 | 7× |
| Isola di Francia | 7 | 0 | 7× |
| Trentino-Alto Adige | 6 | 0 | 6× |
| Comunità Valenzana | 6 | 0 | 6× |
| Piemonte | 22 | 3 | 6× |
| Lombardia | 110 | 21 | 5× |
| Veneto | 46 | 12 | 4× |
| Campania | 8 | 3 | 2× |
| Toscana | 20 | 12 | 2× |

Fuori dall'Italia il divario è totale: **Inghilterra 14 luoghi e zero schede,
Madrid 10 e zero, Abu Dhabi 8 e zero.**

> Questo corregge una raccomandazione data poche ore prima, «le prossime sono
> Veneto e Toscana»: era vera contando le schede che esistono, sbagliata contando
> il materiale disponibile.

## Il collo di bottiglia sono le copertine

In `public/images/reels/` ci sono **342 file** per **86 slug distinti** — le
varianti responsive contano più file per slug. Ottanta corrispondono a una
scheda; **sei sono orfane**, fra cui una reale: `milano-zizania`, che ha la
copertina e non ha la scheda. È l'unica in quello stato.

Portare 404 luoghi a scheda significa **404 copertine nuove**, e ognuna richiede
un controllo umano: la regola di verità delle immagini
(`DECISION_IMAGERY_TRUTH_RULE_2026-07-22`) e `npm run audit:provenance`, che è
**errore non negoziabile**.

Quindi la divisione del lavoro è netta: indirizzo, orari, telefono e sito **si
cercano** — non consumano il tempo di R&B. Copertina e alt text **no**.

## L'ordine di lavoro

### I 60 luoghi con più di un reel

Più materiale girato, e in molti casi visite ripetute negli anni.

| Luogo | Dove | Reel | Visualizzazioni | Ultimo |
|---|---|---:|---:|---|
| Phobos Group Verona | Bussolengo, Veneto | 9 | 2.0M | 2025-10-17 |
| Mantova, Italy | Porto Mantovano, Lombardia | 8 | 722k | 2026-04-23 |
| Torino, Italy | Milano, Lombardia | 7 | 2.6M | 2024-12-30 |
| Milano italy | Milano, Lombardia | 7 | 947k | 2024-07-12 |
| Londra | City of London, Inghilterra | 5 | 215k | 2023-12-29 |
| Phantasialand | Colonia, Renania Settentrionale-Vestfalia | 4 | 3.0M | 2026-02-23 |
| Il Rifugio Degli Artisti | Roversetto, Emilia-Romagna | 4 | 1.3M | 2025-03-21 |
| Torino,Italy | Piacenza, Emilia-Romagna | 4 | 152k | 2024-12-28 |
| CUBE Challenges - Roma | Roma, Lazio | 3 | 3.5M | 2024-05-13 |
| Warner Bros Studio London | Söderhamn | 3 | 954k | 2024-12-07 |
| Binario Magic Pub | Gromlongo, Lombardia | 3 | 887k | 2024-12-23 |
| Valle Dei Re  Luxor | Governatorato del Mar Rosso | 3 | 810k | 2026-07-25 |
| Memorabilia | Agrate Brianza, Lombardia | 3 | 667k | 2024-01-25 |
| Enigma Modena - Escape Room | Modena, Emilia-Romagna | 3 | 475k | 2023-03-22 |
| Mirabilandia | Chioggia, Veneto | 3 | 396k | 2026-05-15 |
| Bienno | Prestine, Lombardia | 3 | 214k | 2026-08-11 |
| Gardaland | Verona, Veneto | 3 | 171k | 2025-07-17 |
| Relais & Spa Castello di Casiglio | Erba, Lombardia | 3 | 99k | 2025-03-29 |
| Splash e Spa Tamaro | Monteceneri, Ticino | 3 | 97k | 2026-02-17 |
| Rifugio Degli Artisti | Roversetto, Emilia-Romagna | 3 | 94k | 2024-03-14 |
| Villa Adele Canneto sull'Oglio | Canneto sull'Oglio, Lombardia | 3 | 93k | 2025-06-06 |
| Hyperspace Trampoline Parks Verona | San Giovanni Lupatoto, Veneto | 2 | 4.2M | 2023-10-24 |
| Hi Hotels | Trento, Trentino-Alto Adige | 2 | 4.1M | 2024-04-26 |
| Mr Martini | Verona, Veneto | 2 | 1.9M | 2023-05-02 |
| Theway | — | 2 | 1.2M | 2025-03-14 |
| Kudafushi Resort & Spa | މާޅޮސްމަޑުލު އުތުރުބުރި | 2 | 1.0M | 2023-01-03 |
| ImpactFood_it | Roma, Lazio | 2 | 860k | 2025-12-09 |
| TAKO SUSHI ROMA | Roma, Lazio | 2 | 711k | 2026-04-03 |
| Acquario di Genova | Genova, Liguria | 2 | 702k | 2024-12-05 |
| Maldives | Alor Gajah, Malacca | 2 | 641k | 2022-07-02 |
| Harry Potter - the Exhibition - Milano | Milano, Lombardia | 2 | 561k | 2025-09-28 |
| Lindt Home of Chocolate | Kilchberg (ZH), Zurigo | 2 | 560k | 2024-11-16 |
| Barcellona,Spagna | Seregno, Lombardia | 2 | 495k | 2025-09-17 |
| La Tana Cameri | Cameri, Piemonte | 2 | 428k | 2025-03-02 |
| Nira Mountain Resort | Valdidentro, Lombardia | 2 | 362k | 2025-01-18 |
| Falkensteiner Hotel Antholz | Rasun-Anterselva, Trentino-Alto Adige | 2 | 348k | 2025-12-03 |
| Piranha Hotel & Motel | Casalino, Piemonte | 2 | 329k | 2024-12-27 |
| China Garten | Zurigo, Zurigo | 2 | 313k | 2025-07-26 |
| Chalet i Poggetti | Fauglia, Toscana | 2 | 301k | 2026-08-13 |
| Fiabilandia, Rimini | Rimini, Emilia-Romagna | 2 | 252k | 2026-07-16 |
| Comix Pub | Fiorano Modenese, Emilia-Romagna | 2 | 239k | 2023-10-25 |
| A'DAM Lookout | Amsterdam, Noord-Holland | 2 | 235k | 2025-05-21 |
| Pirates' Bay | Olgiate Olona, Lombardia | 2 | 184k | 2025-06-20 |
| Riu Cancun | Cancún, Quintana Roo | 2 | 108k | 2026-06-20 |
| La Tana del Drago Fumante | San Giuliano Terme, Toscana | 2 | 105k | 2026-05-11 |
| MZMTR Milano | Pero, Lombardia | 2 | 96k | 2025-10-24 |
| Parco Giardino Sigurtà | Valeggio sul Mincio, Veneto | 2 | 93k | 2024-03-27 |
| L'emporio Stregato | — | 2 | 91k | 2022-11-26 |
| Ferrara | Coli, Emilia-Romagna | 2 | 87k | 2024-10-15 |
| Antwerp Axe Throwing | Anversa, Anversa | 2 | 80k | 2025-03-12 |
| Marsa Alam, Egypt | Ostrava, Moravskoslezský kraj | 2 | 78k | 2025-04-12 |
| The Iceberg Lounge at Park Row | City of Westminster, Inghilterra | 2 | 76k | 2024-01-16 |
| Perhentian Island, Malaysia | Terengganu | 2 | 75k | 2025-09-12 |
| exphera | Gromlongo, Lombardia | 2 | 68k | 2025-07-20 |
| Borgo La Chiaracia Resort & Spa | Castel Giorgio, Umbria | 2 | 68k | 2025-03-25 |
| Lin Tasting Emotion | Legnano, Lombardia | 2 | 62k | 2025-10-20 |
| Bergamo Città Alta | Bergamo, Lombardia | 2 | 54k | 2023-12-08 |
| Inhala Hotel Garden | Madrid, Comunidad de Madrid | 2 | 38k | 2026-03-30 |
| La Reina Lagarta | Madrid, Comunidad de Madrid | 2 | 31k | 2024-03-17 |
| Bussolengo Flover Garden | Bussolengo, Veneto | 2 | 25k | 2021-12-02 |

### I 40 luoghi con un solo reel che hanno reso di più

| Luogo | Dove | Visualizzazioni | Data |
|---|---|---:|---|
| MOOD Sushi Restaurant Verona | Verona, Veneto | 3.0M | 2022-10-21 |
| Calenzano (FI) | Calenzano, Toscana | 2.6M | 2023-02-27 |
| Amy Sushi | Reggio Emilia, Emilia-Romagna | 1.8M | 2022-10-05 |
| MEININGER Hotels | Parigi, Isola di Francia | 1.7M | 2024-03-16 |
| Löwenhof | Varna, Trentino-Alto Adige | 1.7M | 2023-09-22 |
| The Race Club Roma Speakeasy | Roma, Lazio | 1.4M | 2022-08-14 |
| Acquaworld | Concorezzo, Lombardia | 1.3M | 2023-04-25 |
| MIC Ramen Firenze Sud | Firenze, Toscana | 1.2M | 2024-11-10 |
| Fabbrica del Vapore | Milano, Lombardia | 1.2M | 2024-12-18 |
| Il Poggio dell'Artilla | Castiglione in Teverina, Lazio | 1.2M | 2022-09-11 |
| Grosio | Ravoledo, Lombardia | 1.0M | 2025-01-15 |
| Espacio Delicias | Madrid, Comunidad de Madrid | 831k | 2023-03-28 |
| Viale Monza | Milano, Lombardia | 799k | 2025-11-20 |
| Incantum Roma | Roma, Lazio | 774k | 2023-08-31 |
| Secretos de Lola | Madrid, Comunidad de Madrid | 731k | 2023-04-13 |
| Seriate - Bergamo | Seriate, Lombardia | 726k | 2025-04-05 |
| Brunch Republic | Vicenza, Veneto | 702k | 2024-03-06 |
| Sushi Zero | Buguggiate, Lombardia | 670k | 2022-12-28 |
| Roma Movie | Roma, Lazio | 578k | 2023-05-15 |
| Egitto-Cairo | Lazise, Veneto | 572k | 2024-08-24 |
| Lilelo - Little Leisure Lodge | Cascine Napoli, Piemonte | 484k | 2023-04-19 |
| K Kaiseki Restaurant - Ambivere | Ambivere, Lombardia | 446k | 2023-05-10 |
| Il Cappellaio Matto | Milano, Lombardia | 445k | 2022-11-05 |
| C-Rooms | Cremella, Lombardia | 444k | 2022-10-16 |
| Parco Rossi | Santorso, Veneto | 440k | 2025-03-19 |
| Ramen Shifu Milano | Milano, Lombardia | 429k | 2023-09-12 |
| Flover | Bussolengo, Veneto | 399k | 2024-11-20 |
| CandyWorld Experience | Arese, Lombardia | 388k | 2023-04-16 |
| Zero-Gravity | Roma, Lazio | 369k | 2022-09-01 |
| Roma - Piazza Di Spagna | Roma, Lazio | 350k | 2026-02-18 |
| Château du Haut-Koenigsbourg | Orschwiller, Grande Est | 346k | 2026-04-13 |
| Ichiban Ramen Verona | Verona, Veneto | 344k | 2021-12-07 |
| Clet | Firenze, Toscana | 341k | 2022-05-02 |
| Outernet-London | Londra, Inghilterra | 308k | 2024-11-02 |
| Sky Views Observatory | Dubai, Emirato di Dubai | 308k | 2022-07-05 |
| Locanda Perbellini al Lago | Garda, Veneto | 305k | 2023-08-04 |
| Domobianca 365 | Domodossola, Piemonte | 302k | 2024-12-19 |
| Onore (Italia) | Onore, Lombardia | 302k | 2026-04-09 |
| Calle De Marques De Santa Ana | Madrid, Comunidad de Madrid | 296k | 2026-03-01 |
| Andre Heller Garden | Marrakech, Marrakech-Safi ⵎⵕⵕⴰⴽⵛ-ⴰⵙⴼⵉ مراكش-أسفي | 291k | 2022-03-31 |

## Cosa NON entra in questa lista

- **I reel con geotag di città generica.** Non diventano una scheda-posto — non
  c'è un locale da nominare — ma sono materiale per le pagine destinazione.
- **123 reel senza geotag.** Il luogo esiste, l'etichetta no: vanno attribuiti a
  mano o abbandonati.
- **70 fra listicle, adv-prodotto e non-posto**, già classificati nel corpus.
- **Tutto ciò che la deny-list esclude** — strutture sanitarie, indirizzi
  residenziali, scuole e nidi: vedi
  `docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`.

## Come si rigenera

```bash
node scripts/geocode-corpus-places.mjs
```

Le tabelle di questo documento sono state prodotte in sessione incrociando i tre
JSON. Se la lista diventa un lavoro ricorrente, il pezzo che vale la pena salvare
in `scripts/` è **il matcher fra corpus e seed**, non le tabelle: è la parte che
ha sbagliato tre volte prima di funzionare.
