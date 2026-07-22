---
type: audit
status: active
area: content
title: ASSET_mappa-delle-tracce-v1
created: 2026-07-21
slug: mappa-delle-tracce
owner: travellini-asset-curator
---

# Asset audit — Mappa delle tracce V1

## Esito

`/mappa` può andare al builder senza nuove immagini. La resa di produzione deve essere **paper-first**: fotografia opzionale, mai necessaria per capire marker, scheda pin, lista o CTA.

Le sei cover locali effettivamente raggiunte dal fallback demo appartengono al lotto già documentato come AI/stock e non sono pubblicabili come fotografia editoriale o prova di visita. Vanno omesse dalla nuova UI e sostituite, solo quando disponibili, da immagini reali con provenienza verificata. I dieci `ContentItem` geocodificati hanno già `cover: ""` e devono quindi usare il fallback di carta.

## Perimetro verificato

- `src/components/map/MapboxWorldMap.tsx`
- `src/config/contentLibrary.ts` e il suo seed `src/data/content-seed.json`
- `src/config/demoContent.ts`
- `src/config/demoArchive.ts`
- soltanto i file immagine raggiunti dai marker effettivi risultanti da queste fonti

La mappa usa tre classi di contenuto:

1. articoli Firestore, se presenti;
2. dieci marker geocodificati dal seed Instagram, tutti senza cover;
3. se Firestore è vuoto, sei anteprime demo con cover locali.

Nota di drift: i commenti in `demoArchive.ts` parlano ancora di 30 seed e, in un punto, di 7 visibili. Il codice effettivo espone 6 seed; dopo la deduplica con `demoContent.ts`, la mappa mostra 6 anteprime demo complessive.

## Matrice pubblicabile / fallback / da sostituire

| Fonte effettiva                             | Marker o uso                                                           | Asset corrente                         | Provenienza nota                                                                                     | Stato                              | Decisione per `/mappa`                                                                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firestore `articles[].image`                | Articoli reali caricati a runtime                                      | URL non enumerabile nei file in scope  | Non verificabile da questo audit; manca un registro locale di proprietà/licenza, luogo e autore      | **Fallback finché non verificato** | Mostrare l'immagine solo se supera il gate di provenienza sotto; altrimenti cartiglio paper-first. Lo stato `real` del contenuto non rende automaticamente reale o riutilizzabile la cover. |
| `content-seed.json` via `contentLibrary.ts` | 10 `ContentItem` geocodificati, fonte `instagram`, con permalink reale | `cover: ""` per tutti e 10             | Nota la fonte editoriale del contenuto; nessun file fotografico associato                            | **Fallback**                       | Pubblicabile senza foto. Non ricavare automaticamente un frame dal Reel e non hotlinkare Instagram.                                                                                         |
| `DEMO_ARTICLE_PREVIEW`                      | `dolomiti-rifugi-design`                                               | `/images/destinations/dolomiti.webp`   | Lotto locale AI/stock documentato; WebP derivato dal PNG del repository, nessuna licenza fotografica | **Da sostituire**                  | Omettere in produzione; targa di carta. Una futura foto deve mostrare il luogo reale descritto e non essere usata come prova di visita senza conferma editoriale.                           |
| `DEMO_ARTICLES_EXTRA`                       | `puglia-trulli-masserie`                                               | `/images/destinations/puglia.webp`     | Lotto locale AI/stock documentato; nessuna licenza fotografica                                       | **Da sostituire**                  | Omettere; targa di carta. La coerenza geografica generica non basta per renderla pubblicabile.                                                                                              |
| `DEMO_ARTICLES_EXTRA`                       | `toscana-borghi-nascosti`                                              | `/images/destinations/toscana.webp`    | Lotto locale AI/stock documentato; nessuna licenza fotografica                                       | **Da sostituire**                  | Omettere; targa di carta. L'immagine-cartolina non identifica uno dei borghi citati.                                                                                                        |
| `DEMO_ARCHIVE_SEEDS`                        | `costiera-amalfitana-fuori-stagione`                                   | `/images/hero-amalfi.webp`             | Lotto locale AI/stock documentato; nessuna licenza fotografica                                       | **Da sostituire**                  | Omettere; targa di carta. Il file pesa anche 247,1 KB ed è sovradimensionato per entrambi gli slot.                                                                                         |
| `DEMO_ARCHIVE_SEEDS`                        | `sicilia-orientale-5-giorni`                                           | `/images/experiences/gastronomia.webp` | Placeholder esplicito nel codice; lotto AI/stock                                                     | **Da sostituire — priorità P0**    | Omettere. La scena gastronomica generica/toscana non documenta Catania, Siracusa o Etna.                                                                                                    |
| `DEMO_ARCHIVE_SEEDS`                        | `sardegna-interna-barbagia`                                            | `/images/destinations/sardegna.webp`   | Lotto locale AI/stock documentato; nessuna licenza fotografica                                       | **Da sostituire — priorità P0**    | Omettere. La costa balneare contraddice il tema della Sardegna interna/Barbagia.                                                                                                            |

Non risultano cover locali classificabili come **pubblicabili** nell'insieme effettivamente usato dalla mappa. “Demo” consente di mostrare un'anteprima testuale dichiarata; non autorizza fotografia AI o geograficamente ambigua.

## Inventario tecnico delle sei cover demo

| File               |  Dimensioni | Peso corrente | Fit narrativo                               | Esito                |
| ------------------ | ----------: | ------------: | ------------------------------------------- | -------------------- |
| `dolomiti.webp`    | 1024 × 1024 |      192,1 KB | Montagna generica, registro cartolina       | Ritirare dalla mappa |
| `puglia.webp`      | 1024 × 1024 |      186,2 KB | Puglia generica, non prova del percorso     | Ritirare dalla mappa |
| `toscana.webp`     | 1024 × 1024 |      155,2 KB | Toscana idealizzata, luogo non identificato | Ritirare dalla mappa |
| `hero-amalfi.webp` | 1024 × 1024 |      247,1 KB | Costiera generica; peso oltre budget        | Ritirare dalla mappa |
| `gastronomia.webp` | 1024 × 1024 |      113,8 KB | Non pertinente alla Sicilia orientale       | Ritirare dalla mappa |
| `sardegna.webp`    | 1024 × 1024 |      152,0 KB | Mare, non Barbagia/interno                  | Ritirare dalla mappa |

Provenienza tecnica nota: i PNG del lotto sono entrati nel repository il 2026-04-14; le varianti WebP sono state prodotte dalla pipeline Sharp il 2026-05-13. Gli audit interni classificano l'intero lotto `destinations/*`, `experiences/*` e `hero-amalfi` come AI-generated/stock. Non è presente un credito o una licenza fotografica che ne consenta la pubblicazione editoriale.

## Gate per una futura immagine pubblicabile

Una cover può passare da fallback a pubblicabile soltanto se il record editoriale conserva:

- proprietario/autore e diritto di utilizzo web;
- origine verificabile del file o consegna diretta R+B;
- corrispondenza esatta con luogo e contenuto, senza riuso “per atmosfera” su un'altra destinazione;
- conferma che non sia AI-generated e che non contenga watermark o testo bruciato;
- consenso/permesso quando compaiono persone riconoscibili o interni privati;
- focal point e `imageAlt` verificati, se l'immagine non è decorativa.

In assenza anche di uno solo di questi dati, la UI usa il fallback di carta. Nessuna immagine dimostra da sola che Rodrigo e Betta abbiano visitato, provato o consigliato il luogo.

## Contratto crop e peso

Le regole seguenti valgono per future immagini che superano il gate, non per recuperare le sei cover ritirate.

| Slot                   | Crop consegnato | Focal point                                                                                                             | Output consigliato                 |                             Budget | Caricamento     |
| ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------: | --------------- |
| Scheda pin selezionata | **16:9**        | Manuale per asset; proteggere volto, gesto o segno distintivo del luogo nel 60% centrale. Vietato il center-crop cieco. | 320 × 180 e 640 × 360, AVIF + WebP | ≤60 KB AVIF o ≤90 KB WebP a 640 px | Lazy; non è LCP |
| Thumbnail lista        | **1:1**         | Derivata dallo stesso master con focal indipendente; soggetto leggibile a 48 px                                         | 96 × 96 e 144 × 144, AVIF + WebP   |          ≤15 KB AVIF o ≤25 KB WebP | Lazy            |

- Non servire il master 1024 × 1024 nello slot da 48 px.
- Non usare il crop quadrato per la scheda pin e non simulare il 16:9 con bande o sfondi sfocati.
- Se un solo master non regge entrambi i crop senza perdere il soggetto, mantenere solo il 16:9 e usare la targa nella lista.
- Conservare il focal point per contenuto, non per nome file globale: lo stesso asset può richiedere posizioni diverse nei due slot.
- Un errore di rete o decodifica deve attivare lo stesso fallback paper-first previsto per `image` assente, senza spazio nero o icona rotta.

## Alt text e immagini decorative

| Contesto                       | Regola                                                                                                                                                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Immagine 16:9 nella scheda pin | Usare un `imageAlt` italiano verificato che descriva la scena, idealmente 70–125 caratteri. Non usare automaticamente il titolo dell'articolo. Se manca un alt affidabile, rendere l'immagine decorativa con `alt=""` perché titolo, categoria ed estratto sono già presenti. |
| Thumbnail quadrata nella lista | Sempre decorativa: `alt=""`. Il pulsante possiede già nome accessibile, titolo e categoria; ripeterli nell'immagine aggiunge rumore.                                                                                                                                          |
| Targa/fallback di carta        | Nessun elemento `<img>`. Texture, timbro o icona sono decorativi con `aria-hidden="true"`; il testo visibile resta la fonte accessibile.                                                                                                                                      |
| Foto con persone               | L'alt descrive soltanto ciò che è verificabile nella scena. Non attribuire identità, emozioni, visita o partnership non confermate.                                                                                                                                           |

Nel componente corrente la scheda pin usa `alt={selectedArticle.title}`: il builder deve sostituire questo automatismo con il contratto sopra. La thumbnail usa già correttamente `alt=""`.

## Comportamento paper-first

- **Scheda pin:** il blocco media è opzionale. Senza cover, la scheda inizia con categoria, titolo, estratto e CTA; non lascia un rettangolo scuro vuoto.
- **Lista:** al posto della thumbnail mostra una piccola targa di carta con icona categoria decorativa. Titolo, luogo e stato selezionato restano invariati.
- **Demo/mixed:** l'etichetta “Anteprime editoriali” o “Include anteprime editoriali” rimane persistente anche quando una cover futura è presente.
- **Loading:** lo skeleton non promette uno slot fotografico; carta + canvas mappa bastano.
- **Empty/error:** nessuna illustrazione obbligatoria. Cartiglio testuale e azioni previste dalla direzione UI restano completi.
- **Immagine fallita:** rimuovere il media e passare alla targa, senza retry infinito e senza cambiare il conteggio dei risultati.
- **Separazione semantica:** disponibilità dell'immagine, stato `real/mixed/demo` e prova di visita sono tre segnali indipendenti.

## Consegna al frontend-builder

1. Rendere `image` davvero opzionale sia nella scheda pin sia nella lista.
2. Non wire-are le sei cover demo locali nella nuova composizione pubblica.
3. Applicare il fallback targa anche alle URL Firestore senza provenienza registrata o che falliscono al caricamento.
4. Preparare due role/crop distinti soltanto quando arriverà un master reale verificato.
5. Mantenere i dieci marker Instagram geocodificati senza foto: permalink, titolo, estratto e CTA sono sufficienti.

Nessuna immagine è stata generata, modificata o aggiunta durante questo audit.
