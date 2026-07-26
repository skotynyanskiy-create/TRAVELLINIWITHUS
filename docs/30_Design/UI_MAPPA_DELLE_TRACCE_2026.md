---
type: ui-change
area: product
status: open
priority: p1
owner: team
repo: TRAVELLINIWITHUS
route: /mappa
repo_path: src/pages/Mappa.tsx
related: '[[PLAN_mappa-delle-tracce-redesign-2026]]'
source: '[[HANDOFF_mappa-delle-tracce_orchestrator_to_ui-designer]]'
tags:
  - ui
  - product
  - mappa
---

# UI_MAPPA_DELLE_TRACCE_2026

## Goal

Trasformare `/mappa` nel primo foglio operativo dopo il `Diario delle meraviglie vere`: la persona passa dalla meraviglia a una traccia concreta senza percepire una seconda applicazione. La mappa resta lo strumento dominante; carta, rilegatura e linguaggio editoriale servono a darle contesto, non a coprirla.

## Direzione unica bloccata

**Mappa delle tracce — carta piegata nel taccuino.** Una superficie di carta calda contiene una grande tavola cartografica scura, incorniciata con linee sottili da archivio. Introduzione, filtri e percorsi sono elementi in-flow sul foglio; sulla mappa rimangono soltanto marker, cluster, popup selezionato e controlli nativi. Niente pannelli glass sovrapposti, capsule flottanti, card arrotondate in serie o decorazione WebGL.

La homepage è congelata. Restano invariati la navbar e il footer globali, MapLibre/OpenFreeMap, il dataset, le coordinate, le query, il lazy-load, il tracking, i filtri, i preset, i cluster, i pin, il popup, il deep link `?place=` e la destinazione `/esplora`.

## Gerarchia dei moduli

1. **Ingresso editoriale:** kicker, un solo H1, intro di una riga e stato/provenienza dei contenuti.
2. **Controlli della carta:** percorsi suggeriti e due gruppi di filtri, sempre esterni alla mappa.
3. **Tavola cartografica:** mappa scura, marker e controlli nativi con la massima area disponibile.
4. **Scheda traccia:** un solo popup contestuale per il pin selezionato; non duplicare la scheda in un pannello laterale.
5. **Indice delle tracce:** elenco sincronizzato con filtri e pin; orizzontale compatto su desktop, verticale su mobile.
6. **Uscita:** CTA in-flow `Apri l'archivio`, con gli stessi parametri `zone` e `type` già costruiti oggi.

## Wireframe esecutivo — desktop 1440 px

### Griglia e superficie

- La navbar globale resta intatta. La route comincia sotto il suo offset corrente di `80px`.
- Superficie route: carta calda `--journal-paper` o equivalente tokenizzato, minimo `calc(100dvh - 80px)`, senza immagine hero.
- Rilegatura: fascia visiva a sinistra larga `48px`; non intercetta input. Riutilizzare l'asset esistente soltanto dopo verifica dell'asset-curator; fallback ammesso: banda piatta `--journal-blue`, non illustrazione simulata.
- Area contenuto: da `x=96px` a `x=1392px`, larghezza utile `1296px`, padding destro `48px`. Max-width `1296px`, centrata nello spazio dopo la rilegatura.
- Linee, bordi e ombre riprendono la home: raggio `0–4px`, bordo `1px`, ombra solo sul foglio mappa. Vietati `rounded-2xl`, pillole decorative e backdrop blur sui moduli editoriali.

### Ingresso, `y=104–242`

- Riga alta `24px`: kicker a sinistra; folio/stato a destra. Corpo `10–11px`, uppercase, tracking `0.16em`, terracotta per il kicker e inchiostro attenuato per lo stato.
- H1: max `760px`, Fraunces `56px/0.96`, peso `430`, margine superiore `20px`.
- Intro: max `620px`, Inter `16px/1.5`, margine superiore `14px`.
- Stato contenuti: allineato a destra, max `340px`; un'etichetta e massimo due righe. Non usare il numero totale come prova di visita.
- Altezza massima dell'intero ingresso: `138px`. La mappa deve essere visibile senza scroll a `1440 × 900`.

### Controlli, `y=258–366`

- Un blocco con bordo superiore e inferiore, non una card. Padding verticale `14px`.
- Prima riga, `44px`: etichetta `Percorsi suggeriti` larga `168px` + tre segnalibri-button uguali. Ogni segnalibro misura circa `240 × 44px`; mostra titolo e meta breve, non la descrizione lunga. Stato attivo: fondo terracotta, testo chiaro, nessuna scala.
- Seconda riga, `44px`, margine top `8px`: gruppo zona seguito dal gruppo esperienza. Le due etichette sono visibili. Button alti `36px`, padding inline `14px`, bordo squadrato/raggio massimo `2px`.
- I gruppi possono scorrere orizzontalmente se lo spazio finisce; nessun fade artificiale che copra il testo.

### Tavola mappa, `y=390–970`

- Frame largo `1296px`, alto `580px`, bordo `1px solid var(--journal-line)`, padding carta `10px`, ombra `0 18px 40px rgb(40 31 21 / 16%)`.
- Mappa interna occupa il `100%`, raggio massimo `2px`. Nessun overlay persistente sopra la cartografia.
- Controlli MapLibre: colonna in basso a destra, margine interno `16px`; area libera minima `56 × 112px`.
- Marker singolo: target interattivo `44 × 44px`, disco visivo `34–38px`; terracotta per contenuto editoriale, token success per partnership verificata. Il pulse infinito corrente viene eliminato.
- Cluster: diametri `32/40/52px`, terracotta, anello carta `2px`, label `12px` ad alto contrasto.
- Popup: max `320px`, carta o inchiostro profondo coerente con la home, raggio massimo `4px`; pulsante chiudi esplicito `44 × 44px`. Immagine opzionale `16:9`, testo e CTA sotto. Non deve coprire i controlli nativi; MapLibre può cambiare anchor per mantenerlo nel viewport.

### Indice e uscita

- Subito sotto il frame, margine `24px`, titolo riga `Tracce sulla carta` + count live.
- Lista desktop: una sola riga orizzontale, card-segnalibro `280 × 88px`, gap `12px`, snap facoltativo; scroll nativo con tastiera. Immagine `64 × 64px` soltanto se pubblicabile, altrimenti segno categoria + testo.
- Stato selezionato: bordo terracotta `2px` senza cambiare dimensioni; il click mette a fuoco il pin e apre il popup.
- CTA archivio: in-flow, allineata a destra, altezza `52px`, margine `28px 0 48px`; stile terracotta primario. Nessuna CTA sticky concorrente.

## Wireframe esecutivo — mobile 375 px

### Flusso e misure

- Navbar globale invariata. Rilegatura larga `14px`; tutto il contenuto parte dopo di essa. Nessun elemento esce dalla viewport.
- Carta a tutta altezza; padding contenuto `20px` a sinistra/destra oltre la rilegatura.
- Ingresso: padding top `24px`, kicker `9px`, H1 Fraunces `42px/0.96`, intro `15px/1.5`. Stato/provenienza sotto l'intro, mai affiancato. Altezza target `210–250px`.
- Controlli: sticky sotto la navbar con `top` pari all'altezza effettiva della navbar; fondo carta opaco, bordo inferiore, z-index inferiore a popup/menu globale. L'intero blocco non supera `156px`.
- Percorsi suggeriti: riga orizzontale di tre button `214 × 56px`, scroll-snap, titolo + meta; target minimo `44px`.
- Filtri: due righe separate, ciascuna alta `44px` e orizzontalmente scrollabile. Etichetta del gruppo sempre presente prima dei button; stato attivo non dipende soltanto dal colore.
- Mappa: immediatamente dopo i controlli, larghezza disponibile completa, altezza `52svh` con minimo `360px` e massimo `520px`; nessun pannello editoriale persistente sopra la mappa.
- Popup selezionato: transiente, max `calc(100vw - 48px)`, ancorato senza coprire i controlli nativi; close visibile `44 × 44px`. Escape chiude. Se lo spazio verticale non basta, l'immagine viene omessa prima di ridurre testo o target.
- Lista: in-flow sotto la mappa, padding `20px`, card verticale larga `100%`, min-height `88px`, gap `10px`. Nessun carosello orizzontale per i risultati.
- CTA archivio: unica CTA finale in-flow, larga `100%`, alta almeno `52px`, margine bottom `32px`. Rimuovere la duplicazione con `StickyMobileCTA` soltanto su `/mappa`.

## Regole responsive intermedie

- `<768px`: flusso mobile sopra descritto; niente `absolute` per intro, filtri, preset, lista o CTA.
- `768–1023px`: layout ancora in-flow; rilegatura `24px`, contenuto max `calc(100% - 72px)`, mappa `56svh` min `480px`; risultati in griglia a due colonne; filtri scrollabili.
- `1024–1279px`: ingresso e controlli desktop compatti; rilegatura `36px`, padding `36px`; mappa min-height `540px`; H1 `48px`.
- `>=1280px`: applicare il contratto 1440. Oltre `1536px` il contenuto resta max `1296px` e aumenta soltanto il margine esterno.
- Verificare `320/375/768/1024/1440`; la larghezza documento deve coincidere con la viewport.

## Component map

| Decisione | Elemento corrente                                       | Contratto                                                                                      |
| --------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Preserve  | Lazy import e `Suspense` in `Mappa.tsx`                 | Mappa caricata dopo il primo paint; l'ingresso semantico non dipende dal chunk mappa.          |
| Preserve  | `SEO`, breadcrumb e route `/mappa`                      | Rivedere soltanto il copy non verificabile nella fase SEO.                                     |
| Preserve  | `react-map-gl/maplibre` + OpenFreeMap dark              | Nessuna migrazione, token o stile provider nuovo.                                              |
| Preserve  | Fetch Firestore, content library, demo seed, coordinate | Nessuna query o dato modificato; aggiungere solo metadati di provenienza UI se già derivabili. |
| Preserve  | Filtri continente/esperienza e tre preset               | Stessi valori e tracking; cambia la presentazione.                                             |
| Preserve  | Cluster, pin, popup, deep link, pan, zoom, fullscreen   | Stesse azioni; popup reso chiudibile e focusabile.                                             |
| Preserve  | Link reel/articolo e query `/esplora`                   | CTA e destinazioni restano reali.                                                              |
| Recompose | H1 e intro oggi in overlay                              | Portarli in `Mappa.tsx`, fuori dal lazy boundary e in-flow sul foglio. Un solo H1.             |
| Recompose | Due tablist a capsule                                   | Due gruppi di toggle button con `aria-pressed`; non sono tab perché non cambiano tabpanel.     |
| Recompose | Preset in card dark overlay                             | Tre segnalibri compatti nel blocco controlli.                                                  |
| Recompose | Mappa full-bleed con overlay                            | Tavola scura incorniciata, libera da overlay persistenti.                                      |
| Recompose | Popup card molto arrotondata                            | Scheda traccia squadrata, close esplicito, provenienza e CTA chiara.                           |
| Recompose | Lista overlay desktop / lista mobile                    | Indice in-flow sincronizzato; riga orizzontale desktop, verticale mobile.                      |
| Recompose | Loading overlay animato                                 | Shell carta stabile + placeholder mappa con stato testuale; nessun layout shift.               |
| Remove    | Pulse infinito dei marker                               | Il marker selezionato usa una sola transizione breve.                                          |
| Remove    | Glassmorphism, scale-hover e card-in-card               | Sostituiti da bordi, carta, inchiostro e terracotta.                                           |
| Remove    | `StickyMobileCTA` su `/mappa`                           | Resta una sola CTA archivio in-flow con la stessa destinazione.                                |

## State matrix

| Stato                 | Ingresso/stato                                                             | Mappa                                                                           | Controlli                                      | Indice e azione                                                                                                   |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Loading               | H1 e intro subito visibili; label `Prepariamo la carta…` con `role=status` | Frame alla dimensione finale, fondo ink-deep, simbolo statico; `aria-busy=true` | Visibili ma disabled; niente skeleton pulsanti | Placeholder di tre righe non animato; CTA disabilitata finché i filtri non sono pronti                            |
| Solo reali            | Label `Contenuti pubblicati` e count reale                                 | Marker normali                                                                  | Attivi                                         | Nessun notice demo                                                                                                |
| Mix reali + anteprime | Label esplicita `Contenuti pubblicati + anteprime editoriali`              | Marker conservati; la provenienza non è affidata al solo colore                 | Attivi                                         | Notice breve prima dell'indice; ogni voce demo ha label testuale `Anteprima`                                      |
| Solo anteprime        | Label `Anteprime editoriali`                                               | Mappa utilizzabile                                                              | Attivi                                         | Notice: struttura dimostrativa, non prova di visita; media non verificati sostituiti da fallback paper-first      |
| Filtro vuoto          | Count `0 tracce`                                                           | Basemap resta visibile, nessun marker                                           | Selezione attuale evidente                     | Stato in-flow `Nessuna traccia con questi filtri` + button `Mostra tutte`; nessuna CTA nascosta senza spiegazione |
| Pin selezionato       | Count invariato                                                            | Marker selezionato + popup unico                                                | Restano utilizzabili                           | Voce corrispondente con `aria-pressed=true`; chiusura popup rimuove anche lo stato selezionato                    |
| Errore dati           | Avviso `Non riusciamo ad aggiornare le tracce`                             | Basemap e contenuti locali già disponibili restano usabili                      | Disabled solo se mancano i dati necessari      | Button `Riprova`; nessun messaggio tecnico o promessa di completezza                                              |
| Reduced motion        | Identico contenuto                                                         | `flyTo/easeTo` duration `0`; niente pulse                                       | Stato istantaneo                               | Nessun reveal/cascade; focus e selezione restano visibili                                                         |

La distinzione real/mixed/demo deve derivare dalla provenienza effettiva, non dal fatto che un array sia vuoto. Il copy corrente `destinazioni esplorate` e la meta description `Ogni posto che abbiamo provato davvero` non sono ammessi quando compaiono seed o anteprime.

## Motion grammar

- Ingresso iniziale: solo foglio e frame mappa, `opacity 0→1` + `translateY 8→0`, `260ms`, ease `cubic-bezier(.22,1,.36,1)`. Massimo due elementi insieme.
- Cambio filtro/preset: colore, bordo e background, `160ms ease-out`; niente scale o movimento dell'intera lista.
- Pin selezionato: scala visiva `1→1.08→1`, massimo `180ms`; nessun loop.
- Centratura pin: `650ms` desktop, `450ms` mobile; cluster `600ms`. Reduced motion `0ms`.
- Popup: `opacity` + `translateY 6px`, `180ms`; un solo elemento.
- Risultati: aggiornamento immediato, senza stagger. Se il count cambia, solo crossfade `120ms`.
- Non animare mai più di tre elementi contemporaneamente. Vietati scroll hijacking, parallax, rotazione di pagina, autoplay e animazioni continue.

## Accessibilità e input

- Un solo H1, renderizzato fuori dal lazy chunk della mappa.
- I due insiemi di filtri usano `role=group` + nome accessibile; ogni button usa `aria-pressed`. I preset sono button reali, non link o tab.
- Marker singoli sono `button` reali da `44 × 44px`, attivabili con Invio e Spazio. Cluster e controlli MapLibre restano tastierabili.
- Popup: `role=dialog`, `aria-modal=false`, titolo referenziato; focus al titolo/CTA quando aperto, Escape e close button lo chiudono, focus restituito al trigger.
- Focus visibile: outline terracotta `2px` + offset carta `3px`; sul fondo scuro usare outline carta chiara.
- Target touch minimo `44 × 44px`; distanza minima `8px` tra target adiacenti.
- Testo su carta usa `--journal-ink`; testo secondario su fondo scuro deve raggiungere AA e non usare opacità sotto il livello verificato dal test di contrasto.
- Count/filtri: `aria-live=polite` soltanto dopo un'azione utente, per evitare annunci multipli al caricamento.
- Immagini nelle card con titolo adiacente sono decorative (`alt=""`); nessun alt ripete il titolo. Link esterni dichiarano visivamente e per screen reader l'apertura di Instagram in nuova scheda.
- Fullscreen conserva un nome accessibile e una via d'uscita da tastiera. Il menu globale e il popup devono rimanere sopra il foglio senza conflitti di z-index.

## Contratto asset e copy per la fase successiva

- Nessun nuovo hero visual e nessuna immagine AI richiesta per questa route.
- Verificare provenienza e pubblicabilità di: asset rilegatura esistente, `article.image`, `ContentItem.cover` e immagini dei demo seed.
- Fallback senza media: carta calda, icona Lucide della categoria e titolo; non creare illustrazioni CSS/SVG.
- Copy da finalizzare: title/description SEO, kicker, H1, intro, tre meta preset, etichette provenienza per real/mixed/demo, notice anteprime, empty, errore, popup CTA reel/articolo e CTA archivio.
- Tono: utile, diretto, personale; niente numeri inventati, `visitato/provato/esplorato` solo per contenuti con prova reale.

## Acceptance

- [ ] A `1440 × 900` ingresso, controlli e almeno `440px` verticali di mappa sono visibili senza scroll.
- [ ] A `375px` l'ordine è ingresso → controlli → mappa → lista → CTA e nessun overlay persistente copre la mappa.
- [ ] Tutte le funzioni preservate nella component map restano operative.
- [ ] Nessuna UI persistente copre i controlli MapLibre.
- [ ] Un solo H1, zero overflow, focus visibile, target `>=44px`, contrasto AA.
- [ ] Stati loading, real, mixed, demo, empty, selected, error e reduced motion verificabili.
- [ ] Nessuna modifica a homepage, navbar, footer, provider, dataset, backend o file high-risk.

## QA notes

La fonte visuale è `docs/30_Design/references/home-journal-target-2026-07-21.png`; `design-qa.md` stabilisce come qualità minima pagina-oggetto, gerarchia calma, mobile intenzionale e zero fake proof. La verifica finale deve includere la catena home → `/mappa` → selezione pin → `/esplora` a `320/375/768/1024/1440`.

## Links

- [[PLAN_mappa-delle-tracce-redesign-2026]]
- [[HANDOFF_mappa-delle-tracce_orchestrator_to_ui-designer]]
- [[BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS]]
