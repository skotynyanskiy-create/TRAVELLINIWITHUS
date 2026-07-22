---
title: Asset Strategy — inventario, regola immagini, pipeline Higgsfield
type: reference
status: active
updated: 2026-07-22
area: brand
tags:
  - assets
  - images
  - brand
  - higgsfield
  - performance
---

# Asset Strategy

Questo documento è l'autorità sugli asset visivi di TRAVELLINIWITHUS: cosa c'è oggi,
quale regola governa la provenienza delle immagini, da dove arrivano le nuove, e a
quali condizioni si può usare Higgsfield.

Vale insieme a `DESIGN.md` (sistema visivo), `docs/EDITORIAL_GUIDE.md` (voce) e
`docs/TRAVELLINI-HOMEPAGE.md` (composizione home). Dove questo documento e una skill
Higgsfield sono in disaccordo, vince questo documento.

---

## 1. Inventario misurato — 2026-07-22

Misure reali dal filesystem (`du -sb`, `find -printf %s`), non stime.

| Percorso                        | Byte         | Note                              |
| ------------------------------- | ------------ | --------------------------------- |
| `public/`                       | `38.431.608` | 36,6 MiB totali                   |
| `public/images/`                | `37.431.239` | 97,4% del peso di `public/`       |
| `public/images/destinations/`   | `14.762.790` | 81 file, la directory più pesante |
| `public/images/home-journal/`   | `9.060.071`  | 12 file, home cinematografica     |
| `public/images/brand/`          | `4.991.394`  | 27 file, coppia + collaborazioni  |
| `public/images/experiences/`    | `4.480.308`  | 12 file                           |
| `public/images/reels/`          | `1.353.156`  | 30 file, cover estratte dai Reel  |
| `public/images/home-cinematic/` | `687.564`    | 3 file, solo `.webp`              |
| `public/images/lead-magnets/`   | `433.441`    | 2 file                            |
| `public/images/placeholders/`   | `1.780`      | 2 file                            |
| `public/og/`                    | `194.352`    | card social generate              |
| `public/audio/`                 | `3.127`      |                                   |

### File più pesanti

| File                                                | Byte        |
| --------------------------------------------------- | ----------- |
| `public/images/home-journal/notebook-reference.png` | `2.833.714` |
| `public/images/home-journal/dentro-storia.png`      | `1.388.426` |
| `public/images/home-journal/altrove-vicino.png`     | `1.240.245` |
| `public/images/hero-amalfi.png`                     | `1.215.998` |
| `public/images/destinations/giappone.png`           | `1.186.872` |
| `public/images/brand/couple-travel.png`             | `1.075.236` |
| `public/images/experiences/insolito.png`            | `1.044.794` |
| `public/images/home-journal/hero-impossible.png`    | `1.040.853` |
| `public/images/destinations/dolomiti.png`           | `1.025.062` |
| `public/images/destinations/puglia.png`             | `1.015.849` |
| `public/images/destinations/americhe.png`           | `979.605`   |
| `public/images/destinations/toscana.png`            | `971.412`   |

I `.png` sono **sorgenti**, non il formato servito: il markup serve AVIF → WebP e usa
il PNG solo come `src` di fallback. Pesano comunque nel repo e nel deploy.

### Formati presenti in `public/`

80 `.webp` · 73 `.avif` · 25 `.png` · 5 `.jpg` · 4 `.svg`.

### Copertura varianti responsive (`-320` / `-480` / `-768`)

| Directory         | File | 320 | 480 | 768 | Stato                                         |
| ----------------- | ---- | --- | --- | --- | --------------------------------------------- |
| `destinations/`   | 81   | sì  | 18  | 18  | completa                                      |
| `brand/`          | 27   | sì  | 6   | 6   | completa                                      |
| `reels/`          | 30   | sì  | 10  | 0   | 768 assente: le cover sono più strette di 768 |
| `experiences/`    | 12   | no  | 0   | 0   | **nessuna variante**                          |
| `home-journal/`   | 12   | no  | 0   | 0   | **nessuna variante**                          |
| `home-cinematic/` | 3    | no  | 0   | 0   | **nessuna variante, e nessun AVIF**           |
| `lead-magnets/`   | 2    | no  | 0   | 0   | nessuna variante                              |

Le cause sono nella configurazione di `scripts/optimize-images.mjs` — vedi §8.

---

## 2. La regola sulle immagini, e la sua contraddizione aperta

### Regola dichiarata

`CLAUDE.md:302` — sezione "Design — anti-drift guard":

> No AI-generated imagery on the site: real photography only.

### Contraddizione in essere

La regola non è rispettata dallo stato attuale del repo, e la deviazione è documentata,
non accidentale.

**Posizione A — la regola vieta l'imagery generata.**
Fonte: `CLAUDE.md:302`. Motivazione di brand: la proposta di valore di Travelliniwithus è
"ci siamo andati davvero". Persone e luoghi generati la contraddicono alla radice.

**Posizione B — l'imagery generata è già in produzione, dichiaratamente.**
Fonte: `docs/TRAVELLINI-HOMEPAGE.md` (`status: active`, `updated: 2026-07-21`), sezione
"Asset e trasparenza":

> I tre ambienti editoriali sono stati generati con ImageGen per questa composizione.

Gli asset sono `public/images/home-journal/hero-impossible.*`, `dentro-storia.*`,
`altrove-vicino.*` — 9.060.071 byte, serviti dalla home via
`src/components/home/cinematic/CinematicHomepage.tsx`. La nota argomenta che sono
art direction editoriale, non prova fotografica di un luogo, e che la promessa
"esperienze reali" riguarda il metodo, non la provenienza delle immagini.

**Risolta il 2026-07-22 sulle superfici live** — vedi la tabella per-superficie
nella decisione. `public/images/brand/*` resta sul disco (usata solo da
componenti non più raggiungibili, in coda alla Fase 5 di cancellazione).

**Aggravante — imagery generata presentata come le persone reali.**
Fonte: memoria di progetto `ai-images-fake-couple` (verificata 2026-07-21).
`public/images/brand/couple-travel.*` e `public/images/brand/about-editorial.*` sono
immagini AI di una coppia generica — volti diversi tra i due file, luce da stock — e
**non** sono Rodrigo e Betta. Sono usate come se fossero reali in `ChiSiamo.tsx`,
`CoupleIntro.tsx`, `HeroSection.tsx`, `ArticleHero.tsx`. Questo è un caso diverso e più
grave dell'art direction della home: qui l'immagine afferma un fatto falso sulle persone.

### DECISIONE PRESA — 2026-07-22

> Risolta con la variante **(b) delimitata**, ratificata dall'owner con
> l'approvazione del piano redesign "L'Atlante delle Meraviglie Vere":
> **ruoli referenziali (luoghi, persone, esperienze) → solo fotografia/frame
> reali** con etichetta di provenienza per asset (`real-photo` / `real-frame` /
> `craft`); **generazione ammessa SOLO per craft non-referenziale** (texture
> carta, inchiostro, timbri, map wash, matte di transizione), etichettata
> `craft`. La coppia AI viene rimossa da tutte le superfici live (fase 3 del
> piano). Dettaglio completo, conseguenze e follow-up:
> `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`.
> `CLAUDE.md:302` è stato emendato nella stessa sessione.

**Certificazione pendente (owner):** i quattro asset `home-journal/*` restano in
pagina ma con provenienza da certificare — la documentazione interna è
contraddittoria (dichiarati ImageGen qui sotto, ma `hero-impossible` corrisponde
alla cover del reel reale The Burton Juice, testo title-card incluso). Finché non
sono certificati, nessuna nuova superficie li adotta come "prova" e il posto
`campania-burton-juice` resta `isPlaceholder: true` (noindex). Vale anche per
`notebook-reference.png` (2.833.714 byte): nasce come reference di design ma è
servito in pagina in `.journal-binding` — se resta in pagina è un asset `craft`
da etichettare; se è solo reference, va fuori da `public/`.

---

## 3. Gerarchia delle fonti per l'imagery del sito

In ordine. Si scende di livello solo quando il livello sopra è esaurito, non quando è
scomodo.

1. **Fotografia proprietaria di Rodrigo e Betta.** Scatti loro, dei posti dove sono
   stati davvero. È l'unica fonte che regge la promessa del brand senza note a piè di
   pagina.
2. **Fotogrammi e cover dai Reel Instagram del brand.** Sono materiale reale già
   prodotto e già pubblico. Esiste un percorso di acquisizione: `scripts/import-instagram.ts`
   (`npm run import:instagram`) tira i media da `graph.instagram.com/me/media` usando
   `IG_GRAPH_TOKEN` da `.env`, e scrive un file di **review** in
   `src/data/instagram-import.json` senza toccare `content-seed.json`. Le cover in
   `public/images/reels/` vengono da lì. Il token è un secret: solo `.env`, mai
   `VITE_*`, mai stampato.
3. **Imagery generata — sospesa.** Ammessa solo se e quando l'owner risolve la
   contraddizione di §2 in quel senso, e solo nei ruoli che la decisione delimita.

Per ogni immagine nuova la domanda è, in quest'ordine: esiste uno scatto loro? esiste un
frame di un Reel? Solo dopo due "no" documentati si apre la discussione sul terzo livello.

---

## 4. Pipeline di produzione Higgsfield — PROPOSTA, non installata

**Stato verificato 2026-07-22: nessuna directory `generated/` esiste nel repo.**
Quanto segue è la forma che la pipeline deve avere _se e quando_ verrà attivata. Non
descrive niente di esistente e non autorizza da solo alcuna generazione.

### Albero di staging — fuori da `public/`

```
generated/
  concepts/     # output grezzo, ogni tentativo, incluso lo scarto
  approved/     # solo ciò che ha superato l'approvazione owner
  rejected/     # scarti conservati per non rigenerare gli stessi errori
  prompts/      # prompt integrali, uno per asset, versionati
  metadata/     # una scheda per asset, schema §5
```

Vincoli, non suggerimenti:

- **`generated/` non sta dentro `public/`.** Niente in staging può finire in un
  deploy per distrazione.
- **`generated/concepts/` e `generated/rejected/` vanno in `.gitignore`.** Sono
  scarti pesanti e non sono storia di progetto. `approved/`, `prompts/` e `metadata/`
  restano tracciati: sono la prova di provenienza.
- **Nessun file raggiunge `public/` senza uno step di approvazione esplicito
  dell'owner.** L'approvazione è un atto umano registrato nella scheda metadata, non
  una condizione dedotta da un agente.
- Il passaggio in `public/` avviene solo dopo ottimizzazione (§8) e con le varianti
  responsive richieste dalla directory di destinazione.

---

## 5. Metadata obbligatori per ogni asset generato

Una scheda in `generated/metadata/<slug>.md` per asset. Nessun campo è opzionale;
quelli non applicabili si marcano `n/a`, non si omettono.

| Campo               | Contenuto                                                  |
| ------------------- | ---------------------------------------------------------- |
| `purpose`           | a cosa serve, in una frase concreta                        |
| `source_references` | file sorgente reali usati come riferimento, con percorso   |
| `prompt`            | prompt integrale, non riassunto                            |
| `model`             | modello e versione esatti                                  |
| `dimensions`        | larghezza × altezza in px                                  |
| `duration`          | secondi, per i video; `n/a` per le immagini                |
| `target`            | pagina e sezione di destinazione                           |
| `viewport`          | desktop, mobile, o entrambi                                |
| `approval_status`   | `pending` / `approved` / `rejected` + data e chi ha deciso |
| `optimized_output`  | percorsi dei file ottimizzati effettivamente serviti       |
| `fallback`          | cosa viene mostrato se l'asset non carica o viene ritirato |

Un asset senza scheda completa non è approvabile e non entra in `public/`.

---

## 6. Divieti assoluti

Valgono a prescindere da come l'owner risolva §2. Non sono negoziabili per un singolo
task, una scadenza o una campagna.

- **Mai** generare versioni finte di Rodrigo e Betta: volti, corpi, voci, doppiaggi che
  li facciano dire cose che non hanno detto.
- **Mai** rappresentare viaggi, tappe o esperienze che non hanno fatto.
- **Mai** generare membri della community, follower, volti di clienti.
- **Mai** generare testimonianze, recensioni o citazioni attribuite a chiunque.
- **Mai** rappresentare partnership, brand o collaborazioni non esistenti o non
  formalizzate.
- **Mai** generare risultati di performance: numeri di audience, conversioni, ricavi,
  crescita. Se un dato serve, si chiede a `travellini-data-analyst`.
- **Mai** rendere testo di interfaccia dentro un'immagine o un video: titoli, CTA,
  etichette, prezzi, navigazione. Il testo è HTML — per accessibilità, SEO,
  traduzione e leggibilità. Un'immagine con testo dentro è un bug.

---

## 7. Capacità Higgsfield compatibili con la regola, oggi

Compatibili **solo** le operazioni che trasformano materiale reale già esistente di
Rodrigo e Betta, senza inventare contenuto:

| Capacità                          | Uso ammesso                                             |
| --------------------------------- | ------------------------------------------------------- |
| `reframe`                         | riquadrare un video reale per un altro aspect ratio     |
| `upscale_image` / `upscale_video` | alzare la risoluzione di foto e video loro              |
| `personal_clipper`                | ritagliare clip da un loro video lungo                  |
| `dubbing` / `voice_change`        | doppiare in altra lingua un loro parlato reale          |
| `outpaint_image`                  | estendere il bordo di una loro foto per un crop diverso |
| `remove_background`               | scontornare un soggetto da una loro foto                |

Anche queste restano soggette ai divieti di §6 — `dubbing` e `voice_change` non possono
far dire loro cose non dette, e `outpaint_image` non può inventare un luogo attorno al
soggetto.

**Vietate per regola** (decisione §2, 2026-07-22 — non più "in attesa"): generazione
da zero di persone, luoghi, scene ed esperienze presentate come reali; Soul
Character; product photoshoot e marketing studio riferiti a viaggi/persone del
brand. **Ammesse** (post-decisione): generazioni `craft` non-referenziali — texture
carta, inchiostro, timbri, map wash, matte di transizione — con scheda metadata
(§5), staging `generated/` (§4), approvazione owner per-asset e verifica crediti
preventiva.

---

## 8. Budget di performance sulle immagini

### `scripts/optimize-images.mjs` — cosa fa davvero

Radice: `public/images`. Formati generati: **AVIF `quality: 55, effort: 6`** e
**WebP `quality: 78, effort: 5`**. Larghezze responsive: **320 / 480 / 768**, con
`withoutEnlargement` (una variante più larga della sorgente non viene prodotta — per
questo `reels/` non ha `-768`).

Due insiemi decidono tutto il resto:

- `RESPONSIVE_DIRS = { brand, destinations, reels }` — **solo** queste tre directory
  ricevono le varianti responsive.
- `WEBP_SOURCE_DIRS = { reels }` — solo qui un `.webp` è trattato come sorgente.

Conseguenze reali, già visibili nell'inventario di §1:

- **`home-journal/` è escluso da `RESPONSIVE_DIRS`**: riceve AVIF e WebP dal PNG, ma
  **nessuna variante responsive**. Il mobile scarica l'immagine full-size. Con 9 MB in
  quella directory, è il buco più costoso del sito.
- **`experiences/` e `lead-magnets/`**: stessa situazione, AVIF+WebP senza responsive.
- **`home-cinematic/` è ignorato del tutto**: `walk()` raccoglie `.png`/`.jpg` ovunque
  ma i `.webp` solo dentro `WEBP_SOURCE_DIRS`. Quella directory contiene _solo_ `.webp`
  e non è in quell'insieme, quindi non ha né AVIF né varianti.

Correggere significa aggiungere la directory a `RESPONSIVE_DIRS` (e a `WEBP_SOURCE_DIRS`
per `home-cinematic/`) e rilanciare `node scripts/optimize-images.mjs`. È una modifica di
configurazione che tocca il peso servito: va misurata prima e dopo.

### `scripts/check-size.mjs` — cosa NON copre

`check-size.mjs` è un budget **solo sui bundle JavaScript** di `dist/assets`. Soglie
attuali: `initial-js` **780 KB raw / 250 KB gzip**; poi per-chunk, tra cui `react-core`
320 KB, `mapbox-lazy-route` 1850 KB, `three-webgl-lazy` 1650 KB / 480 KB gzip,
`react-pdf-lazy-export` 1650 KB / 560 KB gzip, `firebase-firestore-lazy` 430 KB / 105 KB
gzip, `charts-lazy-route` 410 KB, `home-route` 110 KB, `article-route` 90 KB,
`collaborazioni-route` 65 KB, `media-kit-route` 45 KB, `shop-route` 35 KB,
`product-route` 30 KB. Fallisce la CI al superamento.

**Non esiste oggi alcun budget automatico sul peso delle immagini.** Un asset da 1 MB
entra in `public/` senza che nessun controllo protesti. Finché quel gate non esiste, il
peso immagine è responsabilità di chi apre la PR, con misura esplicita nella descrizione.

---

## Quando aggiornare questo documento

- quando l'owner risolve la OPEN OWNER DECISION di §2 — obbligatorio, stessa sessione;
- quando cambiano `RESPONSIVE_DIRS` / `WEBP_SOURCE_DIRS` / le soglie in
  `optimize-images.mjs` o `check-size.mjs`;
- quando la pipeline `generated/` di §4 passa da proposta a installata;
- quando entra in `public/` una nuova directory di asset;
- quando fotografie proprietarie sostituiscono asset generati.
