---
title: COPY_mappa-delle-tracce-v1
type: content-brief
status: done
area: content
created: 2026-07-21
route: /mappa
owner: travellini-seo-conversion-strategist
---

# Mappa delle tracce — copy definitivo V1

## Intento e regole di verità

La pagina aiuta a scegliere un contenuto partendo da un luogo o da un tipo di esperienza. Il copy non deve trasformare anteprime, immagini o seed demo in prove di visita.

- `realCount` conta solo destinazioni associate a contenuti reali e non demo nel risultato filtrato.
- `previewCount` conta solo le anteprime editoriali nel risultato filtrato.
- `filteredCount` è la somma dei risultati visibili, senza valori hard-coded.
- Usare sempre il singolare con `1` e il plurale negli altri casi.
- “Esplorata/e” è ammesso solo per record reali la cui provenienza è verificata. Per demo e anteprime usare esclusivamente “anteprima/e editoriale/i”.
- Non usare “visitato”, “provato davvero”, “verificato” o formule equivalenti per seed demo, immagini e contenuti privi di prova editoriale.

## SEO

**Valore `title` per il componente SEO:**

> Mappa delle destinazioni

**Title tag atteso:**

> Mappa delle destinazioni | Travelliniwithus

**Meta description, 151 caratteri:**

> Esplora la mappa di Travelliniwithus: filtra destinazioni e contenuti per continente o esperienza, poi apri guide, reel e itinerari di Rodrigo e Betta.

Il metadata non deve citare mappa 3D, filtri per regione o periodo, né dichiarare che tutti i luoghi siano stati provati.

## Ingresso pagina

**Kicker**

> Taccuino di viaggio · Mappa delle tracce

**H1**

> Scegli un posto partendo dalla mappa.

**Intro**

> Parti da un continente o da un tipo di esperienza: ogni pin apre il contenuto disponibile per quel luogo.

## Contatore e provenienza dei contenuti

Il contatore è una live region educata e riflette sempre i filtri attivi.

### Stato real

- `1 destinazione esplorata`
- `{{realCount}} destinazioni esplorate`
- Nessun badge aggiuntivo.

### Stato mixed

- Contatore: `1 destinazione esplorata` oppure `{{realCount}} destinazioni esplorate`
- Label persistente: `Include anteprime editoriali`
- Testo esplicativo: `Le anteprime mostrano contenuti in preparazione e non indicano luoghi visitati o esperienze provate da noi.`
- Le anteprime non entrano mai in `realCount`.

### Stato demo

- `1 anteprima editoriale sulla mappa`
- `{{previewCount}} anteprime editoriali sulla mappa`
- Non mostrare il verbo “esplorare” nel contatore.

### Stato senza risultati

Il contatore non mostra `0 destinazioni esplorate`: viene sostituito dall’empty state definito sotto.

## Notice demo

**Titolo**

> Anteprime editoriali

**Testo**

> Questi pin mostrano come funziona la mappa. Non indicano luoghi visitati né esperienze provate da noi.

Nel mixed state usare la label e il testo esplicativo dedicati, non questo box completo.

## Filtri

**Titolo gruppo mobile**

> Filtra la mappa

**Prima riga**

- Label visibile: `Continente`
- Nome accessibile del gruppo: `Filtra per continente`
- Opzioni: `Tutti`, `Europa`, `Asia`, `Americhe`, `Africa`, `Oceania`

**Seconda riga**

- Label visibile: `Esperienza`
- Nome accessibile del gruppo: `Filtra per esperienza`
- Opzioni: `Tutte`, `Posti particolari`, `Cucina`, `Hotel`, `Borghi`, `Weekend`

**Reset filtri**

> Mostra tutte

## Percorsi suggeriti

**Titolo**

> Percorsi suggeriti

**Intro**

> Scegli una traccia: la mappa applica i filtri e restringe la selezione.

### Preset 1

- ID invariato: `italia-non-ovvia`
- Titolo pubblico: `Europa non ovvia`
- Meta: `Europa · posti particolari`
- Descrizione: `Per cercare luoghi meno scontati tra le tracce raccolte in Europa.`

Il titolo pubblico passa da “Italia non ovvia” a “Europa non ovvia” perché il preset applica il filtro `Europa`, non un filtro Italia.

### Preset 2

- ID invariato: `dove-dormire-bene`
- Titolo pubblico: `Alloggi con carattere`
- Meta: `Tutti i continenti · hotel`
- Descrizione: `Per trovare gli alloggi raccolti sulla mappa e scegliere da dove partire.`

### Preset 3

- ID invariato: `weekend-coppia`
- Titolo pubblico: `Weekend in coppia`
- Meta: `Europa · weekend`
- Descrizione: `Per restringere la mappa ai contenuti dedicati a una partenza in due.`

## Stati di sistema

### Loading

**Testo visibile**

> Tracciamo i nostri passi…

**Testo per la live region**

> La mappa si sta caricando.

Usare lo stesso testo nel fallback lazy e nel caricamento dati, evitando il passaggio da “Tracciamo i nostri passi…” a “Caricamento mappa…”.

### Empty

**Titolo**

> Nessuna traccia con questi filtri.

**Testo**

> Prova un altro continente o un altro tipo di esperienza.

**Azione**

> Mostra tutte

### Error

**Titolo**

> La mappa non si è caricata

**Testo**

> Puoi riprovare oppure continuare dall’archivio.

**Azioni**

- Primaria: `Riprova`
- Secondaria: `Apri l’archivio`
- Fallback con `/esplora` disattivato: `Vieni con noi`

## Risultati

**Titolo sezione**

> Tracce trovate

**Contatore**

- `1 risultato`
- `{{filteredCount}} risultati`

**Nome accessibile della lista**

- `1 traccia filtrata`
- `{{filteredCount}} tracce filtrate`

**Azione accessibile della card**

> Mostra {{title}} sulla mappa

## Scheda pin

La scheda usa solo dati provenienti dal record selezionato: luogo, categoria, titolo ed estratto non ricevono claim aggiuntivi.

**Ordine del copy**

1. Luogo: `{{country}}` oppure `{{continent}}`; fallback `In viaggio`.
2. Categoria: label canonica del record.
3. Provenienza, solo demo: `Anteprima editoriale`.
4. Titolo: `{{title}}`.
5. Estratto: `{{excerpt}}`, senza riscritture automatiche.

**CTA per tipo di contenuto**

- URL esterno reale: `Guarda il reel`
- Articolo interno reale: `Leggi la guida`
- Contenuto demo: `Apri l’anteprima`
- Nessun URL valido: nessuna CTA.

**Chiusura accessibile**

> Chiudi la scheda di {{title}}

## CTA archivio

**CTA standard, desktop e mobile**

> Apri l’archivio

**Fallback con `/esplora` disattivato**

> Vieni con noi

La CTA mobile sticky e la CTA finale non devono comparire insieme nello stesso viewport come due azioni duplicate.

## Note di implementazione per il builder

- Lo stato non può dipendere da un solo booleano `usingDemo` se la collezione contiene insieme record reali e anteprime: derivare `real`, `mixed` o `demo` dalla provenienza dei record effettivamente mostrati.
- In stato mixed il contatore usa `realCount`; il numero totale della lista usa `filteredCount`.
- Conservare eventuali suffissi dei filtri come informazioni separate dal contatore, senza fonderli in una frase che possa sembrare una prova di visita.
- Il copy pubblico definitivo è quello di questo brief; i testi correnti in `Mappa.tsx` e `MapboxWorldMap.tsx` sono da sostituire dove divergono.
