---
title: HANDOFF_dormire-posti-sembrano-inventati_frontend_to_social
status: consumed
created: 2026-08-18
from: travellini-frontend-builder
to: travellini-social-content-operator
slug: dormire-posti-sembrano-inventati
expires: 2026-09-15
type: handoff
area: delivery
---

# Handoff: repurpose del pillar «Posti che sembrano inventati» — Reel, carosello, newsletter

## Why this work matters

Il traffico organico su questo pezzo, oggi, è zero: il dominio non serve ancora
il sito. L'unico canale che porta lettori adesso è Instagram, dove il brand ha
già dimostrato che questa categoria funziona. Il repurpose non è un
«di più»: nella condizione attuale **è la distribuzione**.

## Decisions already made (locked — non rilitigare)

1. **L'articolo è la fonte, non il punto di partenza.** Corpo, voci e disclosure
   sono già decisi: leggi la content note, non riscrivere il pezzo in formato
   social.
2. **Il reel di apertura esiste già**: Emotional Grand Motel, 4,5M play, reel
   n°2 di sempre del brand [fonte: sezione «Dati che ancorano il pezzo» della
   content note]. La domanda non è «che reel facciamo», è **come si riporta
   traffico da qualcosa che è già stato visto 4,5 milioni di volte**.
3. **La categoria è provata**: «alloggi particolari», mediana 50.091 play su 105
   reel. Non serve validarla di nuovo.
4. **Le disclosure valgono anche sui social**, con le regole della piattaforma:
   `collaboration`, `adv` e `affiliate` vanno dichiarate. Non ereditare
   silenziosamente l'etichetta dal sito.
5. **Nessun numero inventato**, nemmeno in una caption: niente «oltre 20 posti»
   se sono 9, niente «migliaia di richieste».

## Context the receiver needs

- Content note: `docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`
  (compila la sezione `## Repurpose`)
- Corpus reel per i confronti: `src/data/instagram-corpus.json`
- Registro delle strutture citate: `src/data/content-seed.json`
- Manifest dei reel già pubblicati (materiale riutilizzabile):
  `src/config/reels.ts`
- Landing di destinazione del link in bio: `/guida-in-regalo` esiste già con UTM
  [fonte: `docs/MARKETING_OPERATIONS_HUB.md`, tabella funnel]. **Verifica se è
  ancora quella giusta prima di darla per buona.**

## What the receiver should produce

Nella sezione `## Repurpose` della content note:

- **1 Reel** — hook nelle prime 3 parole, struttura a beat, quali fotogrammi già
  esistono e quali mancano. Se serve girato nuovo, dillo esplicitamente: è tempo
  di R+B, ed è il collo di bottiglia del progetto.
- **1 carosello** — quante slide, cosa sta su ognuna, e la slide finale che porta
  al pezzo. Il carosello è il formato che regge 8-10 voci; il reel no.
- **1 newsletter** — oggetto, preview text, corpo breve, un solo link.
- **Il piano di distribuzione**: dove va il link (bio, storia con sticker,
  commento fissato), con che UTM, e **in che ordine nel tempo**.
- **La condizione di lancio**: cosa deve essere vero prima di pubblicare i social
  (vedi domanda aperta).
- **Come si misura**: una metrica per formato, coerente con la metrica primaria
  del Brief. Non cinque.

## Out of scope (do NOT touch)

- Non riscrivere H1, meta o corpo.
- Non toccare `src/`, il seed, il registro, il manifest reel.
- Non promettere numeri di reach o conversione: il corpus dice cosa ha fatto il
  passato, non cosa farà questo.
- Non pianificare un calendario mensile: qui serve il lancio di **un** pezzo.
- Non usare foto o video generati: vale la stessa regola di verità delle
  immagini del sito.

## Open questions / decisions for the user

1. **Il link porta a una pagina che non è online.** Il dominio risponde da un
   proxy Aruba con marker WordPress e l'articolo è `published: false`. Fino a
   quando quelle due cose non cambiano, **mandare traffico è mandarlo su una
   coming soon**. Proponi il piano, ma marca il lancio come «bloccato su:
   dominio ripuntato + articolo pubblicato».
2. **Quanto girato nuovo è disponibile?** Se la risposta è «zero», il piano si
   costruisce su materiale d'archivio e va detto in apertura, non scoperto a
   metà.

## Next hand-off

- Next agent: nessuno — revisione con l'owner.
- Trigger: sezione `## Repurpose` compilata con la condizione di lancio esplicita.

## Notes

Questo step gira **in parallelo** al gate qualità, non dopo: non dipende dal
verdetto tecnico. Ma non si pubblica niente sui social finché il gate non è
verde e la pagina non è raggiungibile — altrimenti si brucia il reel migliore
del brand su un link morto.

## Stato reale al 2026-08-18 (travellini-frontend-builder)

Questo handoff era stato pre-scritto dall'orchestratore prima che il lavoro
iniziasse. Ora il seed è completo (H1, corpo, hero, 5 section photo, OG card
fotografica) — resta materiale di riferimento pronto per il repurpose, non
più una bozza. Condizione di lancio **invariata**: `published: false` e il
dominio non serve ancora il sito (proxy Aruba, marker WordPress) — vale
ancora "manda traffico solo quando il gate è verde e la pagina è
raggiungibile". Non ho toccato `src/`, il seed, il registro o il manifest
reel per scopi social: fuori dal mio perimetro, come da handoff.

## Consumato il 2026-08-18 (travellini-social-content-operator)

Sezione `## Repurpose` compilata in
`docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`: reel di lancio
(hook 0-3s + 10 beat), carosello a 12 slide, newsletter con oggetto da 43
caratteri e un solo link, 3 hook alternativi, piano di distribuzione relativo a
`T0`, una metrica per formato.

Risposte alle due domande aperte del handoff:

1. **Il lancio è bloccato**, come previsto, e la condizione è scritta per esteso
   in quattro gate (G1 dominio · G2 articolo pubblicato · G3 indicizzabile e
   osservabile · G4 link in bio). Tutti e quattro aperti. In più: `BIO_LINKS`
   punta a `/guida-in-regalo`, non all'articolo, e non è importato da nessun
   modulo `src/` — è una costante da copiare a mano nella bio.
2. **Girato nuovo disponibile: zero, e non serve.** 9 voci su 10 hanno un reel
   già pubblicato, 5 su 10 hanno l'MP4 nel repo. Placat non ha nessun reel (solo
   un frame reale) e della mirror house non esiste un fotogramma verificato
   della facciata a specchi: entrambe le cose sono dichiarate in apertura di
   piano, non scoperte a metà. L'unica produzione nuova è un voice-over da 30
   secondi e dieci ritagli 4:5 da fotogrammi esistenti.

Fuori dal mio perimetro, segnalato all'owner: due conflitti con
`CONTENT_CALENDAR_H2_2026` (slot agosto e slot novembre) e il riuso del girato
ADV/collaborazione, che va verificato con Narciso Home e Emotional Grand Motel —
nel repo non esiste nessuna clausola d'uso.
