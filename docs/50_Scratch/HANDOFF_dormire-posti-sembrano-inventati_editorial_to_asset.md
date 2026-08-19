---
title: HANDOFF_dormire-posti-sembrano-inventati_editorial_to_asset
status: consumed
created: 2026-08-18
from: travellini-editorial-writer
to: travellini-asset-curator
slug: dormire-posti-sembrano-inventati
expires: 2026-09-30
type: handoff
area: delivery
---

# Handoff: foto, alt text e OG card per il pillar «Posti che sembrano inventati, e ci dormi»

## Why this work matters

Il corpo è scritto e vive di una promessa sola: **si legge che ci abbiamo
dormito**. Le immagini o confermano quella promessa o la smontano. Un'immagine
stock, o una foto che non corrisponde alla cosa strana dichiarata nell'H3,
rimette il pezzo esattamente in mezzo ai listicle da scrivania che stiamo
cercando di battere.

## Decisions already made (locked — non rilitigare)

1. **Le dieci voci e il loro ordine sono chiusi** (sezione `## Brief` della
   content note). Non si aggiunge una foto di una struttura che non è in lista.
2. **Gli H3 dicono la cosa strana, non il nome del posto.** L'immagine di ogni
   sezione deve mostrare **quella cosa lì**, non una veduta generica della
   struttura. Se la sezione dice «Una spa dentro una grotta, con l'aperitivo», la
   foto è la grotta, non la facciata.
3. **Tre voci hanno un blocco `:::posto`** (EGM, Granduca di Campigna, Villa
   Tolomei) e **due un blocco `:::reel`** (Spino Fiorito, Narciso Home). Quei
   cinque blocchi **portano già la loro immagine dal registro / dal manifest**:
   `cover`, `coverAlt`, `coverFocusY` per `:::posto`
   [MISURATO: `directives/posto.tsx:59-68`], `cover` + varianti 320/480/768 per
   `:::reel`. **Non servono foto editoriali aggiuntive per quelle cinque
   sezioni**, e aggiungerne trasformerebbe la pagina in una galleria.
4. **Regola di verità delle immagini** (`DECISION_IMAGERY_TRUTH_RULE_2026-07-22`):
   dieci strutture reali e due locali reali. Tutto ciò che le rappresenta è
   `real-photo` o `real-frame`. Nessuna generazione, per nessun motivo, nemmeno
   «solo per la hero». Ogni asset va registrato in
   `src/data/asset-provenance.json` o `npm run audit:provenance` fallisce — è un
   errore bloccante in CI dal 2026-08-14.
5. **`bossico-placat` non ha voce reel** nel manifest e non ha `videoSrc`
   [MISURATO: `src/config/reels.ts`, `content-seed.json:4109-4147`]. Ha però la
   cover. Se serve un'immagine per quella sezione, la fonte è la cover della
   scheda, non un frame che non esiste.

## Context the receiver needs

- **Corpo definitivo**: `docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`,
  sezione `## Body`. Leggi gli H3: ognuno dichiara letteralmente cosa deve
  mostrare la foto.
- **Registro, unica fonte dei fatti**: `src/data/content-seed.json`. Per ogni
  voce ci sono già `cover`, `coverAlt`, `coverFocusY`.
- **Manifest reel**: `src/config/reels.ts` — `cover`, `alt`, `location`.
- **Gli `coverAlt` esistenti sono buoni e sono già usati dal corpo**: alcune
  frasi dell'articolo derivano da lì (il tagliere di salumi e fritti sul bordo
  della vasca a Bracciano, il viale di cipressi di Villa Tolomei, la piscina
  illuminata di blu nella grotta del Granduca, gli abeti dietro la vetrata di
  Placat). **Se cambi un alt, controlla che non contraddica il corpo.**

### Le dieci voci, in ordine, con la cosa che l'immagine deve mostrare

| #   | `id`                            | Cosa deve mostrarsi                                        | Ha già un blocco?      |
| --- | ------------------------------- | ---------------------------------------------------------- | ---------------------- |
| 1   | `novara-emotional-grand-motel`  | Il letto rotondo dentro la gabbia dorata, pareti rosse      | sì — `:::posto`        |
| 2   | `casola-spino-fiorito`          | La casa di specchi che riflette il bosco                    | sì — `:::reel`         |
| 3   | `bossico-placat`                | La struttura geodetica di tela fra gli abeti, la passerella | **no**                 |
| 4   | `poppi-fattorie-di-celli`       | La rete sospesa fra i tronchi, con il vuoto sotto           | **no**                 |
| 5   | `emilia-granduca-di-campigna`   | La spa nella grotta di pietra, piscina blu                  | sì — `:::posto`        |
| 6   | `grone-narciso-home-chalet`     | La jacuzzi riscaldata con la vista                          | sì — `:::reel`         |
| 7   | `bracciano-enjoy-house`         | Il tagliere appoggiato sul bordo della jacuzzi              | **no**                 |
| 8   | `toscana-suite-spa-civico-4`    | Lo schermo da cento pollici davanti al letto                | **no**                 |
| 9   | `massa-lubrense-relais-freedom` | La terrazza con Capri all'orizzonte                         | **no**                 |
| 10  | `firenze-villa-tolomei`         | Il viale di cipressi con Firenze sullo sfondo               | sì — `:::posto`        |

Le due voci della micro-sezione «Due posti dove non si dorme» (Chiostro Cennini,
Contea del Vignolo Fiorito) **non ricevono immagini nel corpo**: sono in prosa,
senza link e senza blocchi, e una foto le rimetterebbe visivamente in lista.

## What the receiver should produce

Nella content note, sezione `## Assets`:

- **Hero photo** — una sola, e la scelta è di posizionamento: la hero dovrebbe
  essere la voce 1 (è l'apertura lockata del corpo e la scena delle prime
  centocinquanta parole). Se scegli diversamente, scrivi perché.
- **Section photos** — al massimo per le **cinque voci senza blocco** (3, 4, 7,
  8, 9). Le altre cinque hanno già la loro immagine dal blocco. Meno di cinque va
  benissimo: il corpo regge senza.
- **OG card** — `/og/dormire-posti-sembrano-inventati.jpg`, **1200×630, JPG non
  WebP**. Motivo misurato dalla SEO: per un articolo pubblicato `ogImage` è la
  `coverImage`, cioè un `.webp` [MISURATO: `Articolo.tsx:410`], e il commento in
  `SEO.tsx:19-21` spiega perché le anteprime social lo gestiscono male.
- **Alt text in italiano** per ogni asset nuovo: descrive la scena visibile, non
  l'atmosfera e non l'hook.
- **Riga in `src/data/asset-provenance.json`** per ogni asset, con etichetta
  `real-photo` o `real-frame`.

## Out of scope (do NOT touch)

- Non toccare il corpo in `## Body`, gli H2/H3, l'ordine delle voci.
- Non toccare H1, meta, excerpt, slug (lockati dalla SEO).
- Non aggiungere immagini alla micro-sezione «Due posti dove non si dorme».
- Non sostituire le `cover` del registro o del manifest reel: sono usate anche da
  `/posto/:id` e dalla home, e cambiarle qui sposta cose che questo pezzo non
  possiede.
- Nessuna generazione AI di luoghi, persone o esperienze. Nessuna eccezione.

## Open questions / decisions for the user

- **Esistono foto orizzontali vere per le cinque voci senza blocco?** Le cover
  del registro sono frame verticali di reel. Se per la voce 7 (il tagliere sul
  bordo della vasca) non esiste un orizzontale reale, **meglio nessuna foto che
  un crop che taglia via la cosa dichiarata nell'H3**. Il corpo funziona anche a
  sole cinque immagini.
- **La hero**: la scena d'apertura è una camera a tema con luce rossa. Va
  verificato che regga il contrasto del testo sopra e la palette sabbia del
  brand, altrimenti serve un secondo candidato — che però indebolisce l'aggancio
  fra la prima riga e la prima immagine.

## Next hand-off

- Next agent: `travellini-frontend-builder`
- Trigger: `## Assets` compilata con OG card, alt text e provenienza registrata.
  Il frontend applica corpo + stringhe SEO + `ItemList` al seed; l'ordine di
  prima apparizione dei dieci `/posto/:id` è già scritto in coda al `## Body` e
  deve coincidere con `position` dell'evento `article_place_click`.

## Notes

Due trappole tecniche che il frontend eredita e che è meglio non scoprire in
review — sono scritte per esteso in coda al `## Body`, qui solo il titolo:

1. Le cinque direttive senza corpo (`:::posto` ×3, `:::reel` ×2) **hanno una riga
   di chiusura `:::` e va tenuta**: senza, il container si estende fino a fine
   documento e mangia il resto dell'articolo in silenzio.
2. `:::verdetto` **non esiste** nel registro delle direttive: il verdetto del
   pezzo è in prosa, ed è voluto.
