---
title: HANDOFF_dormire-posti-sembrano-inventati_orchestrator_to_growth
status: consumed
created: 2026-08-18
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: dormire-posti-sembrano-inventati
expires: 2026-09-15
type: handoff
area: delivery
---

# Handoff: brief del pillar «Posti che sembrano inventati» — audience, metrica, lista definitiva delle voci

## Why this work matters

È l'**unico** articolo in produzione: un capofila fatto bene su dati reali,
scelto dall'analisi del corpus reel. Serve a due cose insieme — aprire il canale
organico (oggi zero, cfr. la catena critica del backlog unico) e diventare la
vetrina che un partner hospitality guarda prima di comprare uno «Stay
editoriale». Tu decidi **per chi è**, **cosa misuriamo** e **quali schede
entrano**. Tutto il resto della catena eredita queste tre cose.

## Decisions already made (locked — non rilitigare)

1. **Slug fisso**: `dormire-posti-sembrano-inventati`. Titolo di lavoro: «Posti
   che sembrano inventati: dove dormirci davvero». Categoria `esperienze`,
   destinazione `Italia`, tipo pillar.
2. **Apertura con Emotional Grand Motel** (`novara-emotional-grand-motel`,
   `partnership.kind: collaboration`), disclosure dichiarata nel corpo.
3. **Le voci escono SOLO da `src/data/content-seed.json`.** Nessun posto
   inventato, nessun posto «sentito dire», nessuna struttura mai visitata.
4. **Nessun numero inventato.** Il prezzo si scrive solo se è nel campo
   `value.price` della scheda. Se manca, **non si scrive niente** — vedi il
   vincolo tecnico sotto, che rende `[VERIFY]` impubblicabile.
5. **Disclosure per ogni voce nel corpo**, con l'etichetta reale del registro
   (`organic` / `invited` / `adv` / `collaboration` / `affiliate`).
6. **Vincolo tecnico non negoziabile** [MISURATO: `scripts/publish-article-seed.mjs:22-28,97-100`]:
   la stringa `[VERIFY` in `content`, `excerpt` o `title` **fa fallire la
   pubblicazione**. I `[VERIFY]` vivono nella content note, mai nel corpo. Un
   dato non verificato non entra nel pezzo: si tace.
7. **Link interni a `/posto/:id`** per ogni struttura citata — l'id è la chiave
   `id` del seed, non il nome.

## Context the receiver needs

- Content note (è lì che scrivi): `docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`
  → compila la sezione `## Brief`.
- Seed articolo: `src/data/articles/dormire-posti-sembrano-inventati.seed.ts` (non toccarlo).
- Registro: `src/data/content-seed.json`. Manifest reel: `src/config/reels.ts`.
- Offerta partner esistente: `src/pages/Collaborazioni.tsx:265-277` — «Stay
  editoriale», *«1 contenuto long-form + copertura social coerente»*, per
  «hotel, masserie, relais e soggiorni speciali». **La pagina non espone un
  prezzo**: i formati sono dichiarati «tracce di lavoro, non listini rigidi»
  (riga 264). Il €1.500 citato nel comitato **non è sul sito** — se lo vuoi nel
  funnel, è una decisione che passa dall'owner, non da questo articolo.
- Backlog: `docs/10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31.md` §1 (catena
  critica) e §3 (la pubblicazione vera è bloccata su owner: DNS + credenziali).

### Dati verificati sul registro il 2026-08-18 — leggili prima di scegliere

[MISURATO: `src/data/content-seed.json`, righe indicate]

| Scheda (`id`)                            | kind          | `value.price`                     | riga |
| ---------------------------------------- | ------------- | --------------------------------- | ---- |
| `novara-emotional-grand-motel`           | collaboration | «Prezzo variabile per stanza»     | 1411 |
| `toscana-suite-spa-civico-4`             | invited       | «Da 190€/notte (210€ weekend)»    | 2070 |
| `emilia-granduca-di-campigna`            | organic       | «da 98€/notte»                    | 41   |
| `casola-spino-fiorito`                   | organic       | —                                 | 3382 |
| `poppi-fattorie-di-celli`                | organic       | —                                 | 3643 |
| `bossico-placat`                         | organic       | —                                 | 4145 |
| `bracciano-enjoy-house`                  | organic       | —                                 | 3476 |
| `asciano-casa-lavanda-podere-fossaccio`  | invited       | —                                 | 1900 |
| `grone-narciso-home-chalet`              | adv           | —                                 | 2206 |
| `lombardia-agriturismo-graffignana`      | adv           | «Piscina 40€ (50€ con lettino)»   | 950  |
| `sarteano-chiostro-cennini`              | invited       | —                                 | 1779 |

**Tre cose che questa tabella dice e che vanno decise, non ignorate:**

1. **Su tutto il registro, gli alloggi italiani con un prezzo a notte dichiarato
   sono due**: Suite Spa Civico 4 (190€) e Granduca di Campigna (98€). La
   promessa «costo per ogni voce» non è sostenibile sui dati di oggi. O l'owner
   fornisce i costi realmente pagati, o il differenziatore si sposta su ciò che
   abbiamo davvero per tutte: **data del reel + disclosure + link alla scheda +
   il reel stesso**. Vedi domanda aperta 1.
2. **`sarteano-chiostro-cennini` è un ristorante**, non un alloggio: la
   descrizione dice «un ristorante ricavato in un chiostro quattrocentesco»
   [MISURATO: `content-seed.json:1749`]. In un pezzo intitolato «dove dormirci»
   non ci sta. Default proposto: **fuori**.
3. **`lombardia-agriturismo-graffignana` (Contea del Vignolo Fiorito)**: la
   scheda documenta piscina, pranzo e animali; **il pernottamento non è
   documentato** [MISURATO: `content-seed.json:920,931,954`]. Default proposto:
   **fuori**, oppure dentro solo se l'owner conferma di averci dormito.

### Un difetto del registro che tocca questo pezzo

Spino Fiorito ha **due schede**: `casola-spino-fiorito` (completa, organic,
coordinate in Lunigiana) e `toscana-mirror-house-spinofiorito`
(`isPlaceholder: true`, `cover: ""`, coordinate 44.023/12.413 — che cadono in
Romagna, non in Lunigiana) [MISURATO: `content-seed.json:56-83` e `3346-3386`].
**L'articolo linka `casola-spino-fiorito`.** La bonifica del duplicato è fuori
dallo scope di questo pezzo: segnalala al backlog, non risolverla qui.

## What the receiver should produce

Compila la sezione `## Brief` della content note con:

- **Why now** — in due righe, ancorate al dato del corpus (mediana 50.091 play
  su 105 reel «alloggi particolari»; Emotional Grand Motel 4,5M, reel n°2 di
  sempre). Non ripetere il dato: di' cosa implica.
- **Audience** — **una** persona sola e specifica (chi, età, occasione,
  budget). Non «chi ama viaggiare».
- **Business goal** — quale dei due pesa di più: ingresso organico o vetrina per
  il funnel partner. Se pesano uguale, l'articolo non ha una forma sola: scegli.
- **Primary metric** — **una**, osservabile con gli strumenti che abbiamo oggi.
- **Lista definitiva delle voci in ordine di apparizione**, con per ciascuna:
  `id` della scheda, disclosure, prezzo (solo se in `value.price`), e **una riga
  che dice perché quella scheda merita il posto**. Apertura EGM già lockata.
  Target: 8-10 voci, motiva se ne proponi meno o più.
- **Angolo del funnel partner** — la frase che un albergatore deve pensare
  leggendo: cosa deve capire di come lavoriamo. E dove sta il link a
  `/collaborazioni` (uno solo, di coda, non in mezzo al testo).

## Out of scope (do NOT touch)

- Non scrivere H1, meta o slug (seo-strategist).
- Non scrivere il corpo né gli attacchi delle sezioni (editorial-writer).
- Non scegliere le foto (asset-curator).
- Non toccare `src/`, né il seed, né il registro.
- Non inventare un prezzo, una data di visita, un nome di partner o una metrica
  storica. Se un numero non è nel repo, non esiste.

## Open questions / decisions for the user

1. **Il costo per voce.** Solo 2 alloggi italiani su 16 hanno un prezzo a notte
   nel registro. Servono i costi reali pagati (anche approssimati per fascia,
   purché veri) per le altre voci? Se la risposta è no, il pezzo promette
   «prova sul campo» con data + reel + disclosure e **non** con il costo, e il
   titolo delle sezioni va scritto di conseguenza.
2. **Chiostro Cennini e Contea del Vignolo Fiorito**: confermi che restano
   fuori? (Il primo è un ristorante; del secondo non risulta il pernottamento.)
3. **La «data visita»**: nel repo esiste `publishedAt`, che è la data di
   **pubblicazione del reel**, non della visita [MISURATO: il fallback è
   documentato in `PROJECT_BACKLOG_UNICO_2026-07-31.md` §«Due difetti emersi
   importando»]. Si scrive «reel pubblicato il …» — che è vero — oppure l'owner
   fornisce le date di visita reali?

Le tre domande **non bloccano il tuo step**: scrivi il brief con il default
proposto e marca la riga come «in attesa di conferma owner». Bloccano
l'editorial-writer, quindi devono essere chiuse prima dello step 3.

## Next hand-off

- Next agent: `travellini-seo-conversion-strategist`
- Trigger: sezione `## Brief` compilata con audience, metrica e lista voci
  ordinata. Brief pronto in
  `HANDOFF_dormire-posti-sembrano-inventati_growth_to_seo.md`.

## Notes

Il sito **non è pubblico**: il dominio risponde da un proxy Aruba con marker
WordPress, e le functions non sono deployate. Questo pezzo si porta fino a
«pubblicabile e verificato in locale»; la pubblicazione vera è una decisione
dell'owner con le credenziali Admin. Non promettere risultati di traffico con
una data: promettili con una condizione.
