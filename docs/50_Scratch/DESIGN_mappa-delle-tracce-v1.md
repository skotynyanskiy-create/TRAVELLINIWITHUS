---
title: DESIGN_mappa-delle-tracce-v1
status: active
created: 2026-07-21
owner: travellini-ui-designer
slug: mappa-delle-tracce
type: design-reference
area: delivery
---

# Mappa delle tracce — direzione esecutiva V1

## Idea guida

`/mappa` è la carta geografica piegata custodita nel **Diario delle meraviglie vere**. Non è una dashboard: è una pagina-oggetto calda che incornicia uno strumento scuro, preciso e vivo. Si conservano MapLibre/OpenFreeMap, dati, filtri, preset, marker, cluster, popup, deep link e tracking; cambia esclusivamente la composizione visuale. Nessuna immagine decorativa è necessaria: carta, tipografia, bordi e micro-segni bastano. Le anteprime demo restano dichiarate e non diventano prova di visita.

## Contratto visuale

- Fondo pagina: carta calda già presente nel sistema; fascia verticale blu-inchiostro larga 28 px a sinistra su desktop, assente su mobile. Texture solo CSS molto lieve, mai sopra la mappa.
- Contenitore: max-width 1320 px, margin auto, padding 32 px desktop / 16 px mobile. Angoli 2–8 px sui fogli; evitare il linguaggio corrente a pillole e i grandi pannelli glass.
- Titoli in Fraunces/font serif esistente; label, filtri e metadati nel sans esistente. Inchiostro blu per testo, terracotta per stato attivo e CTA, carta chiara per superfici.
- Mappa dark invariata, dentro una cornice carta da 10 px desktop / 6 px mobile, bordo inchiostro 1 px e ombra corta. Una linea tratteggiata decorativa può attraversare solo il margine carta, mai simulare un itinerario reale.

## Desktop 1440 px

Viewport utile sotto navbar; pagina scrollabile, non bloccata a `100dvh`.

1. **Ingresso**, 1320 × 156 px: soprattitolo “Taccuino di viaggio · Mappa delle tracce”, H1 “Scegli un posto partendo dalla mappa.” (max 720 px, 52–60 px), testo max 620 px e contatore live. La nota demo è una riga esplicita sotto il contatore.
2. **Tavola principale**, griglia 9/3 con gap 20 px. A sinistra mappa incorniciata alta 660 px; a destra foglio “Percorsi suggeriti”, largo circa 300 px, tre preset verticali da almeno 88 px. Nessun pannello sovrapposto copre la cartografia.
3. **Filtri**, dentro il bordo superiore della tavola ma fuori dal canvas: due righe compatte, label fissa da 110 px + chip. Prima continenti, poi esperienze. Altezza totale 104 px; target 40 px minimo desktop. Attivo terracotta pieno; inattivo carta con bordo blu 20%.
4. **Scheda pin**: selezione apre un cartiglio ancorato, max 300 px, con immagine solo se disponibile, categoria, titolo, estratto e link. Fondo carta, testo inchiostro, chiusura esplicita 44 px in alto a destra oltre a click mappa/Esc.
5. **Tracce trovate**, sotto la tavola, margine-top 28 px: titolo + numero risultati, poi una fila orizzontale di card 260 × 84 px con scorrimento/snap. La card selezionata usa bordo terracotta 2 px, non scale.
6. **CTA archivio**, allineata a destra dopo le card: bottone terracotta “Apri l’archivio” solo quando `/esplora` è attivo; altrimenti usare la destinazione già prevista dal fallback, senza duplicare la sticky CTA.

## Mobile 375 px

Flusso rigorosamente in pagina; nessun overlay persistente sulla mappa.

1. Ingresso con padding 20/16 px, soprattitolo, H1 38–42 px su massimo tre righe, testo e contatore. Nota demo subito visibile.
2. Filtri prima della mappa, due rail orizzontali separati con label sopra; altezza target 48 px, fade-edge solo come affordance. Il chip selezionato viene portato al centro.
3. Mappa 343 × 430 px, pitch iniziale ridotto visivamente se necessario ma stessa logica. Controlli MapLibre distanziati dalla sticky CTA. Cornice 6 px.
4. Percorsi suggeriti dopo la mappa: tre pulsanti-foglio full width, min-height 84 px, nessun carosello.
5. Selezione pin: non affidarsi al popup flottante. Mostrare una **scheda in-flow** immediatamente sotto la mappa, con chiusura 44 px, immagine 16:9 opzionale e CTA. Il pin e la corrispondente card lista restano sincronizzati.
6. Lista verticale full width, card min-height 76 px; prime sei visibili, quindi normale prosecuzione della lista (nessun contenitore interno scrollabile).
7. CTA finale full width con almeno 56 px di altezza e spazio inferiore sufficiente alla sticky CTA esistente.

## Component map

| Azione        | Elementi                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Preserve**  | lazy load e fallback; MapLibre/OpenFreeMap; coordinate e fonti dati; cluster; marker e categorie; filtri e preset; deep link; tracking; CTA/fallback lite mode; `aria-live`; reduced-motion hook.                                                                                                  |
| **Recompose** | shell a tutta altezza → pagina scrollabile; hero overlay → ingresso editoriale; filtri overlay → toolbar fuori canvas; preset glass → foglio laterale/in-flow; carosello overlay → sezione risultati; popup mobile → scheda in-flow; loading → skeleton carta + canvas; CTA → chiusura editoriale. |
| **Remove**    | glassmorphism dominante; pulse decorativo infinito; hover scale; pannelli che coprono la mappa; icona “Mappa interattiva” animata; doppia CTA mobile; bordi tutti molto arrotondati.                                                                                                               |

## State matrix

| Stato          | Resa e comportamento                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading        | Ingresso e filtri presenti; mappa come rettangolo inchiostro con spinner etichettato e testo “Tracciamo i nostri passi…”. Contenuti non interattivi, `aria-busy=true`.          |
| Real           | Contatore “N destinazioni esplorate”; nessun badge aggiuntivo.                                                                                                                  |
| Mixed          | Contatore reale + label persistente “Include anteprime editoriali”; tooltip/testo spiega la distinzione senza attribuire visite.                                                |
| Demo           | Box carta-terra “Anteprime editoriali” prima della mappa; mai usare “visitato/provato”.                                                                                         |
| Empty          | Canvas resta utilizzabile; cartiglio sotto filtri con frase contestuale e pulsante “Mostra tutte” 44 px.                                                                        |
| Selected pin   | Pin, card e scheda condividono stato attivo; focus spostato alla scheda solo dopo azione da tastiera/lista, non durante pan libero. Esc chiude e restituisce focus all’origine. |
| Error          | Cornice mappa sostituita da cartiglio chiaro: “La mappa non si è caricata”; azioni “Riprova” e link all’archivio/fallback attivo. Filtri disabilitati, nessun loop di spinner.  |
| Reduced motion | Nessun pulse, transform, smooth scroll, fly/ease animato o stagger; cambi stato immediati con soli colore/bordo.                                                                |

## Motion e accessibilità

Massimo tre elementi animati insieme. Entrata pagina: ingresso `opacity 0→1` e `y 8→0`, 260 ms; cornice mappa `opacity`, 320 ms; foglio preset `opacity`, 320 ms, senza stagger oltre questi tre. Interazioni: colore/bordo 160 ms; apertura scheda `opacity` + `y 6`, 200 ms; pan/fly esistente massimo 800 ms. Solo `transform` e `opacity`, easing `cubic-bezier(.22,1,.36,1)`; fallback reduced-motion immediato.

Ordine tastiera: ingresso → filtri → mappa/controlli → preset → scheda selezionata → lista → CTA. Focus visibile con outline terracotta 3 px e offset 3 px. Tutti i target touch almeno 44 × 44 px (CTA 56 px). Chip come controlli selezionabili con stato annunciato; non usare semantica `tablist` se non implementa le frecce previste dal pattern ARIA: preferire gruppo di toggle button. Contrasto WCAG AA, testo secondario mai sotto 4.5:1, informazioni di categoria mai affidate al solo colore. H1 unico; mappa con nome accessibile; messaggi loading/empty/error in live region non invasiva.

## Vincolo documentale

La documentazione che parla ancora di Mapbox/token va aggiornata in una fase successiva: l’implementazione corrente è MapLibre con OpenFreeMap e non deve essere migrata.
