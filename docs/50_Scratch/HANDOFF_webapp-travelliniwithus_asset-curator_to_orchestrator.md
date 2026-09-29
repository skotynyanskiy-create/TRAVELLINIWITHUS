---
title: HANDOFF_webapp-travelliniwithus_asset-curator_to_orchestrator
status: open
created: 2026-09-29
from: travellini-asset-curator
to: travellini-orchestrator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza)
consumes: HANDOFF_webapp-travelliniwithus_orchestrator_to_asset-curator
---

# Handoff: dal corpus al fotogramma certificato, e cosa pesa l'app offline

Documento interno, repo pubblico: nessun id di post in deny-list, nessun nome di
struttura sanitaria o abitazione, nessuna coordinata di zone private. Ignoto =
`[VERIFY: ...]`. Base di codice letta in sola lettura (PR #27, `4fe1794`). Non ho
modificato codice, non ho generato né scaricato immagini, non ho lanciato
`optimize-images.mjs`, non ho toccato `IG_GRAPH_TOKEN`.

## Esito in testa

**Domanda 1: il percorso con meno tocchi.**

- Il vincolo «nessuna cover senza l'occhio di un umano» fissa il minimo: **uno sguardo
  per posto, cioè 100 tocchi per 100 posti**. Tutto il resto deve costare zero: elenco
  candidati, sorgente, estrazione, ritaglio, encode, nome, registro, seed, audit.
  Con alternative di fotogramma, correzioni di fuoco e scarti la stima sale a
  **circa 155 tocchi per 100 posti**, a circa 9 s l'uno [VERIFY: test su 10 posti].
  Ore dell'owner solo per certificare il fotogramma: 79 posti 0,4 h, 200 posti 0,9 h,
  409 posti 1,9 h, 533 posti 2,5 h (forbice in §1).
- **Il titolo impresso non si cancella dal file, si esclude con la geometria.** Misurato
  sulle 86 cover: tutte hanno testo impresso (80 col cartiglio del template, 6 con altro
  testo o logo di un'altra piattaforma). Il cartiglio occupa in altezza dal 2% al 20% e in
  larghezza dal 12% all'88%. Regola fissa proposta: **si scarta il 22% superiore prima di
  qualsiasi forma**. Non si usano inpainting, generative fill né overlay che copre.
- **Il collo di bottiglia non è il tempo dell'owner, è la sorgente.** Per i 409 posti nuovi
  non esiste né una cover né un video su disco, e il corpus non contiene URL di media
  (campi: `code`, `pk`, `takenAt`, `tipo`, `location`, `plays`, `likes`, `comments`,
  `inRegistro`, `classe`, `caption`). Senza export Instagram (o token) l'unico insieme
  certificabile sono i 79 già in sito.
- **La certificazione diventa verificabile dalla macchina**: un registro per singolo
  fotogramma (estende `asset-provenance.json`, non lo sostituisce) e un audit che fallisce
  se una cover nella cartella nuova non ha la firma dell'owner.

**Domanda 2: cosa vede l'app offline, e quanto pesa.**

- **Oggi** nessuna immagine è garantita offline: nessuna rotta di cache per le immagini
  nel `VitePWA`, e il precache non ha `globPatterns` propri (default workbox
  `**/*.{js,css,html}`) [VERIFY: leggere il manifest di `dist/sw.js` dopo un build, qui non
  c'è `dist/`]. Le immagini stanno solo nella cache HTTP (`max-age=31536000, immutable`
  in `firebase.json`), che il browser può svuotare. Peso della shell: [VERIFY].
- **Proposta «valigia»**: per ogni posto salvato si tengono in una cache dedicata la
  miniatura 1:1 e la card 4:5 (media **67 KB**, massimo del campione 114 KB), più il
  poster 9:16 se serve (media **122 KB**, massimo 213 KB); il testo pesa 1,3 KB.
  25 posti salvati: 1,7-3,0 MB. 60 posti (tetto): 3,9-7,1 MB. Mappa e video mai offline.
  Misure di §3 e §6.

**Decisioni che servono all'owner** (dettaglio in fondo): (1) titolo in HTML e immagine
senza testo, contro la lettura letterale di «anteprima come su Instagram»; (2) export
Instagram, token oppure solo i 79; (3) cover con gravidanza, neonato o minori in hold di
default; (4) personaggi di terzi visibili nei fotogrammi; (5) soglia di storage oltre i
circa 250 posti.

## Verdetto sulle ipotesi di lavoro dell'orchestratore

| Ipotesi | Verdetto |
| --- | --- |
| Lancio con 79 posti + primo lotto di 21 reel | **Da correggere.** I 79 hanno cover su disco (86 stem, 84 con variante 768). I 21 del primo lotto non hanno né cover né video su disco: nessuno dei 897 reel candidati fuori registro ha una cover reale. Restano `isPlaceholder` (noindex) finché non arriva la sorgente. Lancio realistico: 79 ritagliati e certificati; i 21 quando arriva l'export. |
| Corpus come tracce, posti con scheda e cover certificata | **Regge, e protegge la SEO**: una traccia non ha URL e non ha casella immagine, quindi niente pagine sottili. Sui 1.016 reel con coordinate, 939 (92,4%) non hanno scheda propria. |
| «I miei posti» salvati senza account, leggibili offline | **Regge con un limite**: testo e miniatura sì, poster opzionale, mappa no (chunk `maplibre` fuori precache). `travellini_favorites` (slug in localStorage) esiste già in `FavoritesContext.tsx`: si estende, non si rifà. |

## Fatti misurati da me (checkout in sola lettura)

| Fatto | Valore | Come |
| --- | --- | --- |
| `public/` | 123 MB su disco (`du -sm`), 125.754.798 byte apparenti | `du` |
| `public/images/reels/` | 684 file, 68.718.981 byte (55% di `public/`), 86 stem | `du`, conteggio |
| Cover originali | 80 su 86 a 1080×1920; 3 a 1080×1944; una ciascuna a 900×1600, 640×1136, 720×1296. Le 768 sono 768×1365 (81) e 768×1382 (3) | `sharp.metadata` |
| Peso varianti attuali, media (max), tutte le 86 | 320: AVIF 27,5 (51) KB, WebP 31,0 (54). 480: AVIF 50,0 (109), WebP 58,3 (116). 768: AVIF 94,6 (240), WebP 116,4 (263). Originale 1080: AVIF 164 (477), WebP 243 (624) | `stat` |
| Cartiglio del template | scatola principale 2%-17,1% dell'altezza (test automatico sul bordo, identico su 62 cover), striscia località fino a circa 20% (misura a occhio su una cover a 480 px); larghezza 12%-88% | analisi + provino |
| Testo impresso | 80 cover col cartiglio del template, 5 `reel-N` con didascalia bruciata e logo TikTok, 1 con banner giallo «POV»: **86 su 86** | provino di tutte le 86 |
| Effetto del CSS attuale | `coverFocusY` = 64 su 77 schede visibili su 79. In un riquadro 4:5 nasconde il cartiglio tranne circa 1% dell'altezza dell'immagine: visibile nello screenshot mobile della scheda posto (mezza riga di località sopra l'etichetta) | calcolo + screenshot `07` |
| Cover visibili non censite in `reels.ts` | 13 su 79 (per esempio Riquewihr): `real-frame` solo per prefisso di cartella | confronto seed/`reels.ts` |
| Orfani `reel-1..5` | 3.055.452 byte, non nel censimento, con logo TikTok | `find` |
| Testo di un posto | 1,28 KB medio nel seed (153.023 byte per 110 schede) | `wc` |
| `carta-tile` (craft già in registro) | AVIF 0,8 KB a 320, 3,1 KB a 768, 8 KB a 1024 | `ls` |
| Header immagini | `Cache-Control: public, max-age=31536000, immutable`, nomi non hashati | `firebase.json` |

Consequenza dell'ultima riga: **una cover ritagliata di nuovo con lo stesso nome non
si aggiorna nei browser che l'hanno già vista**. Ogni asset nuovo deve avere un nome con
hash.

## 1. Pipeline dal corpus al fotogramma certificato

**Sorgenti, in ordine di preferenza per posto** (la gerarchia di `ASSET_STRATEGY` §3
resta: prima foto proprie, poi fotogrammi dei reel):

| Corsia | Sorgente | Copertura oggi | Note |
| --- | --- | --- | --- |
| A | Cover già su disco, ritagliata | 86 stem, 79 posti visibili | zero dipendenze; ha il cartiglio, si ritaglia; solo 9:16 zoomato, 4:5, 1:1 |
| B | MP4 locale, fotogrammi estratti con `ffmpeg` | 52 MP4 (429 MB) solo sul disco dell'owner; 66 schede visibili hanno `videoSrc` [VERIFY: quali 52] | fotogramma pulito e 9:16 pieno senza zoom; `scripts/convert-reels.js` già usa `ffmpeg` di sistema |
| C | Export Instagram dell'owner («Scarica le tue informazioni») | tutti i 1.192 reel [VERIFY: che includa i video originali, formato, tempi di preparazione, dimensione stimata in GB] | niente token, niente scadenza; è l'unica via per i 409 |
| D | API Graph (`npm run import:instagram`) | tutti | serve `IG_GRAPH_TOKEN` (Rodrigo accetta l'invito tester, poi vale 60 giorni). `thumbnail_url` è la cover pubblicata, cioè col cartiglio; `media_url` è il video. Per le immagini non aggiunge nulla rispetto a C |
| E | Foto proprie dell'owner | da richiedere | `real-photo`, sorgente più grande: l'unica che regge un hero 16:9 a piena larghezza |

Raccomandazione: **A subito (79), B dove c'è, C per sbloccare i 409**, D solo per i
metadati (didascalie), non per le immagini. E per i posti di punta.

**Stadi:**

| # | Stadio | Chi | Tocchi owner per 100 posti | Tempo per tocco | Dove si blocca |
| --- | --- | --- | --- | --- | --- |
| 1 | Elenco candidati: cluster per coordinata da `instagram-corpus.json` + `content-seed.json`; esclusi deny-list (letta da fuori repo, variabile d'ambiente) e i 136 luoghi con etichetta generica; ordinati per regione scoperta e visualizzazioni | auto | 0 | n/a | la deny-list per codice non è nei dati: serve `DENY_CODES` fuori repo |
| 2 | Acquisizione sorgente per posto (corsie A-E) | auto; una tantum owner (export o token) | 0 (1-2 tocchi una tantum) | 5 min una tantum [VERIFY] | token assente; video assenti per tutti i 409; caroselli (sotto) |
| 3 | Estrazione: 8 fotogrammi per reel tra il 15% e l'85% della durata, taglio di scena; scarto di neri, sfocati, duplicati; punteggio luce e nitidezza | auto | 0 | n/a | `ffmpeg` non c'è su questa macchina [VERIFY sul PC dell'owner]; il cartiglio è anche nel video? [VERIFY su un MP4 locale] |
| 4 | Ritaglio: scarto del 22% superiore, 4 forme, 3 preset di fuoco; encode AVIF e WebP in una cartella di staging fuori da `public/` | auto | 0 | n/a | soggetto sotto il cartiglio (collisione): il fotogramma proposto passa all'alternativo |
| 5 | **Provino a contatto**: un riquadro per posto, primo fotogramma più 2-4 alternativi | **umano** | **circa 155**: 100 sguardi, 30 alternative, 15 correzioni di fuoco, 10 scarti o flag [VERIFY] | 3 s (approva a vista), 9 s (atteso), 20 s (dubbio, apre il reel) | qui e solo qui serve l'occhio |
| 6 | Promozione: copia con nome a hash in `public/images/places/`, voce per fotogramma, aggiornamento di `cover` nel seed | auto | 0 | n/a | nessuno |
| 7 | Gate CI: `audit:provenance` esteso, `audit:images` (pesi), `check-content-seed` | auto | 0 | n/a | nessuno |
| 8 | Merge della PR del lotto | umano | 1 per lotto (circa 2,5 per 100) | 2-5 min | nessuno |

**Ore dell'owner per certificare il fotogramma** (sessioni da 40 riquadri, 5 min di
apertura e chiusura a sessione; tutte le cifre `[VERIFY: test su 10 posti]`):

| Posti | Sessioni | Ottimistico (3 s) | Atteso (9 s) | Pessimistico (20 s) |
| --- | --- | --- | --- | --- |
| 79 | 2 | 0,2 h | 0,4 h | 0,6 h |
| 200 | 5 | 0,6 h | 0,9 h | 1,5 h |
| 409 | 11 | 1,3 h | 1,9 h | 3,2 h |
| 533 (tetto) | 14 | 1,6 h | 2,5 h | 4,1 h |

Restano fuori da queste ore: il verdetto «per chi è / per chi no», `/verify-facts`, i
prezzi. Per confronto, a mano (aprire il reel, screenshot, ritaglio, nome, registro)
ipotizzo 5-8 min a posto, cioè 7-11 h per 79 e 44-71 h per 533 [VERIFY: ipotesi mia].

**Protocollo del test su 10 posti**: le 6 cover del §7 più 4 a caso dai 79. Il provino
registra da solo secondi per decisione, quota di alternative, correzioni di fuoco e
flag: il test calibra tutte le cifre sopra.

**Dove si blocca, per fonte:**

- **Token**: assente. L'invito tester deve essere accettato dal titolare dell'account, il
  token dura 60 giorni e va rinnovato dopo circa 50. Aggira: corsia C.
- **Video non disponibili**: `public/video/` è vuota nel checkout (gitignored); 67 voci di
  `reels.ts` puntano a `/video/*.mp4`, che dovrebbero arrivare da `VITE_VIDEO_BASE_URL`
  [VERIFY, non verificabile da qui]. **La pipeline non dipende dai video del sito**: usa
  MP4 locali o l'export, e in `public/` entrano solo fotogrammi.
- **Caroselli** (84, più 6 foto e 1 video): sono 1440×1440, quindi solo forme 1:1 e 4:5
  (ritaglio 1152×1440), mai 9:16. Le 31 località che esistono solo come post passano da
  qui. Una slide può essere una grafica con testo: il provino mostra tutte le slide come
  alternative. Etichetta `real-photo` se è una fotografia [VERIFY: slide-per-slide]. Il
  poster 9:16 resta un componente dei soli reel.
- **Deny-list**: i JSON tracciati contengono ancora le voci escluse (fact pack, «Esito in
  testa»). La pipeline le esclude in ingresso leggendo l'elenco da fuori repo. Se il repo è
  pubblico quelle voci sono già leggibili: decisione dell'owner, fuori dal mio scope.
- **Privacy nel repo pubblico**: nel file delle decisioni committato si registrano solo
  approva e scarta. I motivi (minori, gravidanza, privacy) restano nel file locale
  gitignorato, altrimenti il repo dichiara proprio quello che si voleva proteggere.
  Candidati scartati e staging non si committano mai.

## 2. Criteri di scelta del fotogramma

**Cancelli (un «no» scarta il fotogramma):**

1. **Nessun testo aggiunto in post**: cartiglio, didascalia, adesivo, banner «POV», logo o
   handle di un'altra piattaforma, prezzo, CTA. Il testo *nella scena* (insegna, menu,
   logo del locale) resta ammesso perché è il posto vero, purché non sia l'elemento
   principale né contenga prezzi o contenuti espliciti (esempio nel campione: un poster
   esplicito in un locale milanese, da scartare per un marchio premium).
2. **Provenienza integra**: un fotogramma di un reel del brand; mai composito o
   ricreato.
3. **Privacy**: non è un luogo in deny-list; nessun minore riconoscibile; nessun estraneo
   in primo piano; nessuna targa, numero civico o interno di abitazione privata.
   **Gravidanza e neonato: hold di default** (la decisione Family chiede conferma
   esplicita dell'owner per asset); i volti di terzi in primo piano, e i personaggi con
   licenza (per esempio pupazzi di un franchise in un ristorante a tema), vanno segnalati
   e decide l'owner.
4. **Tecnica**: non nero, non dissolvenza, non mosso; nitidezza e esposizione sopra soglia.
   Le soglie non le invento: **si tarano sui 79 già in sito**, che sono la verità di
   riferimento [VERIFY].
5. **Soggetto fuori dalla fascia del cartiglio** per le forme che si consegnano.

**Punteggio (ordina i candidati, non scarta):**

| Criterio | Cosa premia |
| --- | --- |
| Prova del posto | la stanza, la vista, la facciata riconoscibile prima del volto o del piatto |
| Persone | Rodrigo e Betta in contesto, non in posa (niente silhouette al tramonto, niente mano con caffè e vista) |
| Luce | luce che lavora: esposizione media, alte luci bruciate sotto il 6% [VERIFY soglia]; una scena volutamente rossa o viola è ammessa se è la luce del posto |
| Verticale | soggetto nella fascia sicura; 4:5 e 1:1 lo contengono; il 16:9 solo se il soggetto sta in una fascia alta il 31% |
| Palette | sabbia e inchiostro del `DESIGN.md`: le cromie forti si etichettano «cromia forte», non si scartano; mai in hero |
| Varietà | non due volte di seguito lo stesso schema (donna di spalle sul mare) nella stessa pagina regione |

**Quando esiste solo la title card** (nessun video, nessuna alternativa), in ordine:

1. Ritaglio fisso, se il soggetto sta sotto il 22%: `real-frame` ricavato dalla cover.
2. Se il soggetto collide (nel campione: una cover su 6, volto sotto la fascia): altro
   fotogramma dal video, se c'è; altrimenti un altro reel della stessa coordinata (in 99
   coordinate senza scheda ci sono almeno 2 reel [mio calcolo, deny-list per codice non
   applicata]).
3. Altrimenti **niente cover**: scheda tipografica (§5). Mai cancellare il cartiglio con
   inpainting o generative fill (inventa pixel di un luogo), mai coprirlo con una fascia
   CSS (il file continua a portare il titolo: OG, ricerca immagini, «salva immagine»).

**Finding sul fuoco automatico.** Ho provato il ritaglio sulla fascia sicura con la
strategia `attention` di `sharp` su 6 cover in 4 forme: **2 su 6 corrette**. Errori: il
16:9 di una scena nel bosco sceglie i piedi del soggetto; un locale rosso a scarsa luce
perde la persona in 4:5 e 9:16; una balaustra sul mare taglia la persona al bordo nel
9:16. Conclusione: si automatizza la fascia sicura (deterministica), non il fuoco. Il fuoco
si decide nel provino con 3 preset verticali e 3 orizzontali.

## 3. Set di ritagli, pesi e nomi

**Sorgente e tetto di risoluzione.** Le cover sono 1080 px di larghezza: nessuna forma
può superarla senza upscaling. Dopo lo scarto del 22% restano 1080×1498.

| Forma | Ritaglio dalla fascia sicura | Ruolo |
| --- | --- | --- |
| `p916` (9:16) | da video: fotogramma pieno; da cover: 842×1498 (zoom 1,28) | poster del reel |
| `c45` (4:5) | 1080×1350, ancorato in alto alla fascia sicura, poi preset di fuoco | card, apertura scheda mobile |
| `s11` (1:1) | 1080×1080 | miniature, liste, pin, viste dense |
| `h169` (16:9) | 1080×608, fuoco obbligatoriamente umano | hero desktop, solo dove regge |

**Larghezze e pesi.** Misurati con gli stessi encoder dello script attuale (AVIF `q55
effort 6`, WebP `q78 effort 5`) su **6 cover** del campione, in memoria, senza scrivere
file; il campione è piccolo [VERIFY: rimisurare sul lotto dei 79]. Colonna «tetto» = mia
proposta, allineata ai budget di ruolo (hero ≤ 200 KB, sezione ≤ 150, inline ≤ 120,
miniatura ≤ 80, griglia ≤ 100).

| Forma-larghezza | Ruolo | AVIF media (max) | WebP media (max) | Tetto AVIF | Tetto WebP |
| --- | --- | --- | --- | --- | --- |
| `p916-480` | poster mobile | 55 (100) KB | 64 (110) | 90 | 110 |
| `p916-720` | poster a tutto schermo | 94 (188) | 116 (217) | 150 | 180 |
| `c45-360` | card | 28 (42) | 31 (46) | 45 | 55 |
| `c45-540` | card 2x, scheda mobile | 59 (104) | 64 (107) | 80 | 95 |
| `c45-720` | inline articolo | 81 (154) | 94 (166) | 120 | 140 |
| `s11-96` | pin, riga di lista | 2,8 (3,9) | 2,5 (3,1) | 5 | 5 |
| `s11-192` | miniatura densa 2x | 8 (9,7) | 8 (10) | 12 | 12 |
| `s11-320` | griglia | 18 (28) | 20 (29) | 30 | 32 |
| `h169-640` | hero tablet | 29 (52) | 34 (58) | 60 | 70 |
| `h169-1080` | hero desktop | 70 (143) | 83 (164) | 150 | 170 |

- **Scala di qualità**: si codifica a AVIF 55, poi 50, poi 45 finché rientra nel tetto. Se
  a 45 sfora ancora (nel campione: un bosco fitto, 100 KB a `p916-480`), il provino lo
  segnala («fotogramma troppo dettagliato») e propone un altro fotogramma.
- **Nome**: `/images/places/<slug>/<hash8>-<forma>-<larghezza>.<avif|webp>`, per esempio
  `.../9f3a12c4-c45-540.avif`. `<slug>` è l'`id` del seed; `<hash8>` sono i primi 8 caratteri
  dello sha256 del master ritagliato. Un master nuovo dà un nome nuovo, quindi niente
  cache `immutable` obsoleta.
- **Seed**: `cover` diventa `{ h, f, c }` (hash, forme presenti, colore dominante a 7
  caratteri come sfondo di attesa). Gli URL si derivano per convenzione, le dimensioni
  sono fisse per forma (proporzioni riservate, CLS ≤ 0,1). Circa 60 byte a posto.
- **Alt**: `coverAlt` esiste su tutte le 79. Va riverificato quando cambia il ritaglio:
  l'alt descrive ciò che il ritaglio mostra.
- **Hero LCP**: caricamento immediato con `fetchpriority="high"` e preload dell'AVIF;
  tutto il resto in `loading="lazy"`. `<picture>` con AVIF poi WebP.
- **Vincolo di layout per ui-designer**: `h169-1080` non oltre 1080 px CSS di larghezza. A
  tutta larghezza sarebbe un upscaling 1,3x. Lo screenshot attuale della scheda posto
  usa già un hero da circa 800 px.

**Profili per posto e peso su disco** (medie del campione):

| Profilo | Contenuto | Peso medio |
| --- | --- | --- |
| Posto | AVIF di `p916-480`, `c45-360`, `c45-540`, `s11-96`, `s11-192`; WebP di `p916-480`, `c45-360`, `s11-96`, `s11-192` | **circa 258 KB** |
| Traccia con fotogramma | `s11-96`, `s11-192`, `c45-360` in AVIF e WebP | circa 80 KB |
| Hero (solo posti di punta) | `h169-1080` e `c45-720` in AVIF e WebP | circa 328 KB |

| Scenario | Peso immagini «Posto» | `public/` risultante |
| --- | --- | --- |
| 79 posti, 20 hero | 20,4 MB + 6,6 MB = 27 MB | da 123 a circa **81 MB** dopo il ritiro delle vecchie cover (-68,7 MB) |
| 200 posti | 51,7 MB | oltre il peso attuale di `reels/` solo a **266 posti** |
| 409 posti | 105,7 MB | da rivedere |
| 533 (tetto, non obiettivo) | 137,7 MB | da rivedere |

Soglia di revisione a circa **250 posti**: o le immagini vanno su storage a egress zero
(stessa logica della proposta R2 per i video, `DECISION_VIDEO_EGRESS_2026-07-26`, status
proposed [VERIFY]), o si rinuncia al gemello WebP dopo aver letto in GA4 la quota di
Safari precedente al 16.4 [VERIFY: data-analyst]. Ogni ritaglio nuovo aggiunge blob alla
storia di git: **la regola di ritaglio va congelata (`sicuro-v1`) prima di promuovere
centinaia di posti**.

**Rapporto con gli script esistenti**: `optimize-images.mjs` non si tocca. Le varianti
sono fisse per forma e non 320/480/768, e i file nuovi sono solo AVIF/WebP, quindi il suo
`walk()` non li vede. Serve uno script nuovo a parte (`covers:build`, staging fuori da
`public/`, come `generated/` in `ASSET_STRATEGY` §4).

**Cover OG** (`og-source`): 1200×630 senza upscaling con una **cartolina**: fondo sabbia
`#f7f0e5` (`generate-og-images.mjs`), fotografia 4:5 di 504×630 a destra, nome del posto a
sinistra (max 6 parole, italiano). JPG q80: **44-83 KB, media 62 KB** sul campione, senza
testo (il testo aggiunge 2-5 KB) [VERIFY], contro il tetto di 300 KB. Nessun ritaglio dei
volti.

## 4. Certificazione dell'owner in blocco

**Provino a contatto** (script locale, pagina statica, nessun tocco a `server.ts`;
implementazione R3 a `travellini-frontend-builder`):

- Un riquadro per posto, alla **dimensione consegnata** (la `c45-540`, non una miniatura
  da 100 px: a quella scala testo e volti non si vedono). 12 riquadri per schermo.
- Tasto **Spazio** tenuto premuto: mostra il master intero con le guide di ogni forma e la
  fascia del cartiglio in rosso. Serve a decidere il fuoco.
- Tasti: `A` approva; `X` scarta questo fotogramma e mostra il successivo; `←` `→` scorrono
  le alternative; `W` `S` `D` `E` spostano il fuoco tra i preset; `F` mette in hold
  (motivo registrato solo in locale); `U` annulla.
- **Approvazione in blocco onesta**: «approva la pagina» agisce solo sui riquadri rimasti
  visibili per almeno 0,7 s. Il provino registra `seenMs` per riquadro.
- Non ripropone mai un fotogramma già scartato (hash in memoria locale): meno tocchi.
- Il provino calcola da solo i tempi del §1.

**Registrazione.** Un file di decisioni per lotto, committato, con solo approva o scarta (un
hold non compare finché non si risolve):
`docs/13_Content/covers-decisions/AAAA-MM-GG-lotto-NN.json` (percorso proposto). Poi lo script di promozione scrive
una voce per fotogramma in un nuovo `src/data/asset-provenance-assets.json`:

```json
"/images/places/<slug>/<hash8>": {
  "provenance": "real-frame",
  "origin": "video-frame | ig-cover-recrop | owner-photo",
  "reel": "<codice pubblico del reel>", "t": 14.2,
  "crop": "sicuro-v1", "forms": ["p916", "c45", "s11"],
  "sha256": "<master>", "certifiedBy": "owner", "certifiedAt": "AAAA-MM-GG",
  "decision": "docs/13_Content/covers-decisions/AAAA-MM-GG-lotto-NN.json#<id>"
}
```

**Estensione di `check-image-provenance.mjs`** (estende, non sostituisce):

1. Il prefisso `/images/places/` entra nel registro come `da-certificare` (rifiuto per
   default): un file sfuggito alla lista non diventa mai `real-frame` per cartella.
2. Per gli asset sotto quel prefisso si cerca prima la voce per fotogramma. Vale solo se
   `certifiedBy` è `owner`, il file esiste e lo sha256 coincide.
3. ERROR (non warn) per cover non certificata in uso: il prefisso è nuovo, quindi non
   ha debito in baseline.
4. Lo strip delle varianti (`-320|480|768|1080`) non riconosce `-c45-540`: va normalizzato,
   altrimenti ogni variante sembra un asset sconosciuto.
5. Il bundle non importa il registro completo (circa 250 byte a voce). Al build si scrive nel
   seed solo il bit `certificato` e la data, per la riga di provenienza che la DECISION già
   prevede.
6. `check-content-seed.mjs` (riga «scheda pubblicata senza copertina») chiede anche una voce
   certificata.
7. **Ripulire i 79**: oggi la provenienza è per cartella (`/images/reels/` = `real-frame`) e
   13 cover non sono nel censimento di `reels.ts`. Dopo il primo provino le 79 hanno una voce
   ciascuna con `origin: ig-cover-recrop`.

## 5. Tassonomia dei fallback

| Livello | Cosa si vede | Provenienza | Peso | Per chi |
| --- | --- | --- | --- | --- |
| F0 | fotogramma certificato | `real-frame` o `real-photo` | §3 | posti con scheda e URL: **obbligatorio** per uscire da `isPlaceholder` |
| F1 | fotogramma certificato di un altro reel della stessa coordinata | `real-frame` | §3 | posti e tracce; dopo il provino |
| F2 | **scheda tipografica**: nome in Fraunces, regione, data del reel, coordinate, su `carta-tile` | `craft` (testo HTML) | 0-3 KB (la trama è già in cache) | posti placeholder (noindex, dicitura «in arrivo») |
| F3 | punto d'inchiostro alla coordinata e timbro | `craft` | 1-3 KB (SVG condivisi) | tracce nella vista atlante |
| F4 | solo coordinate e data, **nessuna casella immagine** | n/a | 0 | tracce nelle liste; 369 reel con etichetta generica (città, regione, paese) |

**Mai:** immagini generate di luoghi, persone o esperienze, anche come segnaposto o
demo; stock; screenshot di Google Maps o Street View, o mappe satellitari; la cover di un
altro posto «simile» usata come segnaposto (sembrerebbe prova); un'immagine `ai-generated`
di `destinations/` o `hero-amalfi`. Nelle liste una traccia senza foto non riserva una
casella vuota.

**Asset `craft` da proporre**, nessuno prodotto qui (tutti vettoriali; se disegnati a mano
la scheda §5 di `ASSET_STRATEGY` dice `n/a` su prompt e modello):

| Asset | Scopo | Bersaglio | Peso | Fallback | Approvazione |
| --- | --- | --- | --- | --- | --- |
| `atlante/carta-tile` | fondo delle schede F2 | tutte le viste | già presente (0,8-8 KB) | tinta sabbia CSS | già in registro `craft` |
| `craft/timbro-luogo.svg` | cornice circolare di timbro; il testo dentro è HTML | F3, scheda posto | ≤ 3 KB | cerchio CSS | owner, per asset |
| `craft/inchiostro-punto.svg` (3 varianti) | marker di traccia sull'atlante | mappa, mobile e desktop | ≤ 1 KB l'una | cerchio pieno CSS | owner, per asset |
| `craft/carta-strappo.svg` | bordo della casella «foto in arrivo» | F2 | ≤ 4 KB | bordo CSS | owner, per asset |

Totale nuovo: circa 10 KB. Nessuna mappa generata: il fondo mappa viene da geodati reali
(MapLibre è già nello stack), perché una mappa disegnata da un generatore può sbagliare la
geografia. Scheda metadata da compilare a produzione: `purpose`, `target`, `viewport`,
`dimensions`, `optimized_output`, `fallback`, `approval_status`.

## 6. Immagini offline

**Fatti dal codice:** `registerType: autoUpdate`, `skipWaiting`, `clientsClaim`;
`navigateFallback: '/index.html'`; `globIgnores` esclude video, chunk mappa/grafici/editor/PDF/3D
e tutte le varianti `-320|480|768|1024`; una sola `runtimeCaching` (chunk pesanti,
`CacheFirst`, 30 voci, 30 giorni); `offline.html` non è servita come fallback (servirebbe
`injectManifest` e un `catchHandler`, già annotato nel commento di `vite.config.ts`).

| Superficie | Oggi | Proposto |
| --- | --- | --- |
| Shell, JS, CSS | sì (precache) [VERIFY manifest] | invariato |
| Testo dei posti | sì, nel chunk del seed (1,3 KB a posto) | oltre 200 posti va in un chunk lazy: `initial-js` è a 776 su 780 KB (per frontend-builder e perf-engineer) |
| Miniatura e card dei posti salvati | non garantite | **garantite** |
| Poster 9:16 | non garantito | opzionale nel pacchetto del posto |
| Hero 16:9 | non garantito | solo online (la vista offline usa la card 4:5) |
| Mappa | no (`maplibre` fuori precache) | no: vista lista con coordinate testuali |
| Video | no | mai |

**Regole della valigia:**

1. Cache dedicata `my-places-v1`, **fuori** dal precache di workbox: il ciclo di vita lo
   governa l'app, non gli aggiornamenti del service worker. Alternativa senza toccare il SW:
   in caso di errore di caricamento l'immagine legge da `caches.match(url)` e mostra un
   `blob:`. Niente `injectManifest` per partire.
2. **Un solo formato per posto salvato**, scelto al salvataggio con un test di decodifica
   AVIF; altrimenti WebP (circa +20%).
3. **Contenuto per posto**: `s11-192` + `c45-540` (media 67 KB, max 114 KB); più `p916-480`
   se la pagina ha il poster (media 122 KB, max 213 KB). Tetto rigido 220 KB per posto.
4. **Tetto di 60 posti** («la valigia è piena»). Peso, misurato sul campione:

   | Posti salvati | Senza poster | Con poster | Caso peggiore del campione |
   | --- | --- | --- | --- |
   | 10 | 0,7 MB | 1,2 MB | 2,1 MB |
   | 25 | 1,7 MB | 3,0 MB | 5,2 MB |
   | 60 | 3,9 MB | 7,1 MB | 12,5 MB |

5. **Cache di navigazione** (`places-browse`, `CacheFirst`, 120 voci, 30 giorni,
   `purgeOnQuotaError`) solo su `/images/places/`, con `statuses: [200]`: circa 2-4 MB.
   Tetto di progetto per le immagini offline: circa **12 MB** più la shell [VERIFY].
6. **Invalidazione**: i nomi hanno hash e header `immutable`, quindi niente purga HTTP. Ad
   app aperta e online, per ogni posto salvato si confronta l'hash del seed con quello
   registrato: se cambia, si scarica il nuovo, poi si cancella il vecchio (mai una valigia a
   metà). Posto tolto dal seed: si cancella. Cambio di formato: `my-places-v2`.
7. **Precache**: non si tocca. Si aggiunge `'**/images/places/**'` a `globIgnores`: dei nomi
   nuovi solo quelli con `-480` cadono nei pattern esistenti, gli altri (`-360`, `-540`,
   `-720`, `-1080`) no, quindi se qualcuno aggiungesse le immagini ai `globPatterns`
   l'installazione peserebbe molto di più. Peso della shell invariato.
8. `navigator.storage.persist()` alla prima volta che si salva un posto. In Safari non
   installata lo spazio scrivibile può essere svuotato dopo 7 giorni senza visite [VERIFY:
   politica attuale]; nella PWA installata no [VERIFY].
9. Misura: `navigator.storage.estimate()` alimenta un contatore vero («3,1 MB, 24 posti»).

## 7. Sei cover per i prototipi statici di R3

Tutte già in `public/images/reels/`, regola di registro `/images/reels/` = `real-frame`,
`id` del seed uguale allo stem. Formati su disco: `<stem>-cover.{webp,avif}` (1080×1920) e
`<stem>-cover-{320,480,768}.{webp,avif}`. A colpo d'occhio nessuna mostra un minore o una
gravidanza [VERIFY nel provino].

**Ricetta CSS per i prototipi** (solo prototipi: il file continua a portare il cartiglio):
riquadro 4:5, `object-fit: cover; object-position: 50% 74%` (finestra da 22%); 1:1 al 50%;
16:9 al 32% come base. Per il 9:16 zoom `scale(1.282)` con `transform-origin: 50% 100%`.
Il valore attuale 64 lascia visibile circa l'1% del cartiglio in 4:5.

| # | Stem | Tipo | Perché | Fuoco 4:5 / 16:9 | Percorso e avvertenze |
| --- | --- | --- | --- | --- | --- |
| 1 | `capovaticano-tonicello-resort` | pulita | persona di spalle sul mare, costa calabra (Sud quasi assente dal corpus); luce piena | 85% / no | in `reels.ts` (`reel-capovaticano-tonicello-resort`), video locale [VERIFY]. Il 16:9 taglia la testa: non usarlo. Il 9:16 zoomato la porta al bordo |
| 2 | `sirmione-hotel-lugana-parco` | pulita | il caso ideale: soggetto piccolo, lago, orizzonte; regge tutte le forme | 74% / 62% | in `reels.ts`, video locale [VERIFY]. Unico candidato hero 16:9 del gruppo |
| 3 | `bled-garden-village` | pulita | natura, luce naturale, soggetto nella fascia sicura | 74% / no | in `reels.ts`. Fogliame: 100 KB in `p916-480`, mette alla prova il tetto. Il 16:9 automatico sbaglia soggetto |
| 4 | `riquewihr-alsazia` | pulita | vicolo, persone in contesto, nessun testo sotto il 22% | 74% / 62% | **non in `reels.ts`, `videoSrc` falso**: percorso «solo cover», e una delle 13 con `real-frame` solo per prefisso. Segnale del bisogno di voce per fotogramma |
| 5 | `madrid-storyland-disney` | imperfetta: titolo che tocca il soggetto | il volto sta sotto il cartiglio: 4:5 e 1:1 lo tagliano o lo dimezzano; il 16:9 mostra solo il piatto | nessuno | in `reels.ts`, video locale [VERIFY]. Serve un altro fotogramma dal video o F2. Ha personaggi con licenza di terzi: flag per l'owner. Prova il comportamento «non certificabile per ritaglio» |
| 6 | `kuala-lumpur-raito-izakaya` | imperfetta: poca luce | dominante rossa, soggetto piccolo e in diagonale, cartiglio; passa i cancelli ma sta in fondo al punteggio | 74% / no | in `reels.ts`. Alternativa: `madrid-la-santoria` (stesso tipo). Prova la palette contro la sabbia della pagina |

**Alt (italiano, 70-125 caratteri, per il ritaglio 4:5)**

1. «Donna di spalle a una balaustra sul mare, con la costa rocciosa della Calabria e l'acqua azzurra sullo sfondo»
2. «Uomo in maglietta bianca su un sentiero di lastre nel prato, con il lago di Garda e le montagne dietro di lui»
3. «Uomo in piedi sulle rocce accanto a un torrente nel bosco, con una tenda glamping su palafitta sullo sfondo»
4. «Due donne sedute a un tavolino di caffè in un vicolo di Riquewihr, davanti a una facciata blu e a una gialla»
5. «Piatto a forma di drago rosso e boccali a tema fiabe su un tavolo di un ristorante a Madrid» (descrive ciò che resta nel ritaglio)
6. «Scala illuminata di rosso lungo una parete di bottiglie retroilluminate in un izakaya di Kuala Lumpur»

## 8. Schede idea

### Idea 1 — Ritaglio sicuro a fascia fissa
- In una frase: una sola regola geometrica, scartare il 22% superiore, toglie il titolo impresso da tutti i file prima di ogni forma.
- Perché stupisce (la schermata che l'owner manderebbe a Betta): la card di Campigna con la mezza riga «Campigna» in cima non c'è più, e l'immagine pesa meno.
- Dato reale su cui poggia: cartiglio a 2%-20% dell'altezza misurato; testo impresso su 86 cover su 86; `coverFocusY` 64 lascia circa l'1% visibile nello screenshot `07`.
- Cosa richiede: codice (script di ritaglio, `covers:build`); asset nessuno; ore owner 0.
- Rischio principale: soggetto sotto la fascia in circa 1 cover su 10 [VERIFY: contarle sui 79]; il 9:16 da cover è zoomato di 1,28.
- Regole toccate: imagery-truth
- Variante: prudente
- Autovalutazione 1-5: Stupore 2 / Verità 5 / Business 3 / Costo 5 / Carico owner 5

### Idea 2 — Provino a contatto dell'owner
- In una frase: una pagina locale con 12 riquadri per schermo, tasti per approvare, scartare, cambiare fotogramma e spostare il fuoco, con registrazione di quanto ogni riquadro è stato visto.
- Perché stupisce: l'owner certifica 40 posti in circa 6 minuti [VERIFY] e vede esattamente ciò che verrà consegnato, con la fascia del cartiglio in rosso.
- Dato reale su cui poggia: 155 tocchi per 100 posti in 9 s [VERIFY: test su 10 posti]; fuoco automatico corretto in 2 casi su 6 (misurato).
- Cosa richiede: codice (pagina statica, script locale), ore owner 0,4 h per 79 [VERIFY].
- Rischio principale: l'approva a raffica senza guardare: mitigato da `seenMs` e dal tetto di 40 per sessione.
- Regole toccate: imagery-truth, privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 5 / Business 4 / Costo 4 / Carico owner 4

### Idea 3 — Registro per singolo fotogramma
- In una frase: ogni cover ha una voce con origine, reel, istante, regola di ritaglio, hash e firma dell'owner, e la CI fallisce se manca.
- Perché stupisce: sotto la foto compare una riga vera, «fotogramma del reel del 14 marzo, controllato il 3 ottobre», dove un'app di immagini generate non può scriverla.
- Dato reale su cui poggia: provenienza assegnata per cartella, 13 cover visibili fuori dal censimento di `reels.ts`; `audit:provenance` esiste già.
- Cosa richiede: codice (estensione dello script e uno strip delle varianti), dati (voce per ogni cover), ore owner 0 oltre al provino.
- Rischio principale: il file di voci si può scrivere a mano da un agente; mitigazione: firma che rimanda a un file di decisioni committato e revisione dell'owner in PR [VERIFY: CODEOWNERS].
- Regole toccate: imagery-truth, metriche-pubbliche (le date sono di pubblicazione, non di visita)
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 3 / Costo 4 / Carico owner 5

### Idea 4 — Fotogrammi dall'archivio Instagram
- In una frase: l'owner chiede l'export ufficiale una volta sola e uno script locale ne ricava 8 fotogrammi per reel, senza token; in repo entrano solo immagini fisse.
- Perché stupisce: dopo un pomeriggio i 409 posti nuovi hanno un provino con fotogrammi puliti, non un elenco di coordinate.
- Dato reale su cui poggia: 409 nuovi luoghi per coordinata possono avere una scheda; 897 reel candidati, 0 con cover su disco; `instagram-corpus.json` senza URL di media.
- Cosa richiede: ore owner (richiesta dell'export, circa 5 min una tantum [VERIFY]); asset (ZIP di più GB in locale [VERIFY]); codice (estrazione con `ffmpeg` di sistema).
- Rischio principale: l'export potrebbe non includere i video originali o essere lento [VERIFY]; il cartiglio potrebbe essere anche nel video [VERIFY su un MP4 locale].
- Regole toccate: imagery-truth, privacy
- Variante: firma
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 5 / Costo 3 / Carico owner 3

### Idea 5 — Dalla traccia alla fotografia
- In una frase: nell'atlante ogni reel geolocalizzato è un punto d'inchiostro con data; solo i posti certificati mostrano una fotografia «sviluppata».
- Perché stupisce: una mappa con fino a 939 punti d'inchiostro (409 coordinate distinte per i locali senza scheda) e 79 fotografie vere mostra a colpo d'occhio quanto abbiamo girato e quanto è già verificato, senza una sola immagine finta.
- Dato reale su cui poggia: 939 su 1.016 reel con coordinate senza scheda propria (92,4%); 79 schede visibili con cover.
- Cosa richiede: dati (già nel corpus), asset (3 SVG `craft`, circa 10 KB), codice (vista atlante, sviluppo del ritaglio, decisione di ui-designer sul movimento).
- Rischio principale: 939 marcatori sulla mappa in prestazioni e bundle [VERIFY: perf-engineer]; le date sono di pubblicazione.
- Regole toccate: imagery-truth, SEO-URL (le tracce non hanno URL né pagine sottili), brand-DNA, bundle
- Variante: audace
- Autovalutazione 1-5: Stupore 5 / Verità 5 / Business 4 / Costo 3 / Carico owner 4

### Idea 6 — La valigia dei posti
- In una frase: «I miei posti» tengono offline miniatura e card di ogni posto salvato, con un contatore reale del peso.
- Perché stupisce: in aereo l'app apre ancora i 24 posti salvati, e in alto dice «3,1 MB nella valigia» perché è vero.
- Dato reale su cui poggia: 67 KB (max 114) a posto senza poster, 122 KB (max 213) con poster, misurati su 6 cover; `travellini_favorites` già in `FavoritesContext.tsx`; nessuna rotta di cache immagini oggi.
- Cosa richiede: codice (cache dedicata, contatore, invalidazione per hash); dati (hash nel seed); ore owner 0.
- Rischio principale: lo svuotamento del browser (Safari, 7 giorni) [VERIFY]; la mappa non è offline.
- Regole toccate: bundle (poco: codice piccolo, fuori dall'`initial-js`), anti-SaaS (il contatore è l'unico numero e non è un cruscotto)
- Variante: firma
- Autovalutazione 1-5: Stupore 4 / Verità 4 / Business 3 / Costo 3 / Carico owner 5

### Idea 7 — Ritorni in coppia
- In una frase: dove il brand è tornato, la scheda mostra due fotogrammi certificati dello stesso luogo, con le due date di pubblicazione.
- Perché stupisce: lo stesso posto a distanza di anni, con due fotografie vere: nessun sito di viaggi generico ha questa prova.
- Dato reale su cui poggia: 106 luoghi ripubblicati a più di 30 giorni di distanza, 62 locali veri, il più ripetuto con 6 visite in 3 anni (fact pack, sezione 3); 33 delle 76 coordinate con scheda hanno almeno 2 reel [mio calcolo, deny-list per codice non applicata].
- Cosa richiede: asset (secondo fotogramma dal reel gemello: idea 4); codice (coppia nella scheda); ore owner circa 10 s a posto in più.
- Rischio principale: le date sono di pubblicazione, non di visita: la dicitura è «reel del ...», mai «visita del ...».
- Regole toccate: imagery-truth, metriche-pubbliche
- Variante: audace
- Autovalutazione 1-5: Stupore 5 / Verità 5 / Business 3 / Costo 2 / Carico owner 3

### Idea 8 — Cartolina per ogni condivisione
- In una frase: la cover social di ogni posto certificato è una cartolina: fondo sabbia, fotografia 4:5 a destra, il nome a sinistra.
- Perché stupisce: il link inviato su WhatsApp mostra la foto vera del posto con un ritaglio che non taglia mai il volto.
- Dato reale su cui poggia: 44-83 KB in JPG q80, media 62 KB, misurati su 6 cover; le 202 card attuali di `public/og/` sono tipografiche (4,7 MB, nessuna foto).
- Cosa richiede: codice (estensione di `generate-og-images.mjs`), asset nessuno; per 79 posti circa 4,9 MB in più.
- Rischio principale: i pesi in git crescono con i posti; testare l'anteprima reale su WhatsApp e LinkedIn dopo il deploy (`browser-auditor`).
- Regole toccate: imagery-truth, SEO-URL
- Variante: prudente
- Autovalutazione 1-5: Stupore 3 / Verità 5 / Business 4 / Costo 4 / Carico owner 5

### Idea 9 — Budget dei pesi a semaforo
- In una frase: un controllo `audit:images` fa fallire la CI se una variante supera il tetto o un posto supera 260 KB.
- Perché stupisce: non è una schermata, è quello che tiene la pagina veloce: `ASSET_STRATEGY` §8 riconosce che oggi «un asset da 1 MB entra senza che nessun controllo protesti».
- Dato reale su cui poggia: tetti di §3; `public/` 123 MB, di cui `reels/` 68,7 MB; orfani `reel-1..5` 3,05 MB con logo TikTok.
- Cosa richiede: codice (script, riga in `audit:quality`); ritiro delle vecchie cover come passo separato con conferma dell'owner.
- Rischio principale: tetti calibrati su 6 cover [VERIFY: rimisurare sui 79].
- Regole toccate: nessuna
- Variante: prudente
- Autovalutazione 1-5: Stupore 1 / Verità 4 / Business 3 / Costo 5 / Carico owner 5

## 9. Scartato, e perché

- **Cancellare il cartiglio con inpainting o generative fill**: inventa pixel di un luogo.
- **Coprirlo con una fascia CSS in produzione**: il file porta ancora il titolo (OG, ricerca immagini).
- **Upscaling 1080 a 1920 per un hero a piena larghezza** (anche `upscale_image` di Higgsfield):
  ammesso dalla regola ma inventa dettaglio. Solo per asset, con OK owner, mai di default. La
  via giusta è la corsia E.
- **Estendere in 16:9 una cover verticale con `outpaint_image`**: dovrebbe inventare l'80% del
  quadro.
- **Fuoco automatico per tutti**: 2 casi su 6.
- **Overwrite delle cover esistenti con lo stesso nome**: cache `immutable` di un anno.
- **Embed di Instagram, stock, Google Maps, Street View**: fuori brief.

## 10. Assets missing (richieste a R&B) e `[VERIFY]`

- **Export Instagram** (5 min dell'owner): sblocca i 409 posti (corsia C).
- **Controllo di un MP4 locale**: il cartiglio è anche nel video? (5 minuti, decide se il
  fotogramma da video è davvero pulito).
- **Circa 20 foto proprie** sul lato lungo di almeno 2400 px per i posti di punta, per un
  hero 16:9 a piena larghezza. Entrano dallo stesso provino come `real-photo`.
- **Licenza: VERIFY con R&B** per i reel in collaborazione: il materiale è girato da loro o
  fornito dal partner? Nel provino il badge «ADV» è visibile, e la riga di provenienza non
  sostituisce l'informativa AGCOM.

Elenco `[VERIFY]` delle cifre di questo documento: tempi per tocco e ore (test su 10
posti); pesi (campione di 6, rimisurare sui 79); soglie di luce e nitidezza (da tarare
sui 79); manifest del precache attuale e peso della shell (`npm run build`, lettura di
`dist/sw.js`); contenuto dell'export Instagram; cartiglio nel video; ffmpeg sul PC
dell'owner; quali 52 MP4 esistono; politica di Safari sul limite dei 7 giorni; quota di
Safari precedente al 16.4 in GA4; stato della proposta R2.

## Open questions / decisions for the user

1. **Titolo in HTML, immagine senza testo.** Contraddice la lettura letterale di «anteprima
   come su Instagram» (citazione dell'owner nella spec del 14 agosto, §2): il titolo si
   ricompone con i dati del seed
   (`title`, `hook`), in Fraunces, accessibile e indicizzabile. Raccomando di sì.
2. **Sorgente per i 409**: export Instagram (raccomandato), token, oppure lancio con i soli 79.
3. **Gravidanza, neonato, minori**: hold di default per asset, come chiede la decisione
   Family. Nel campione ho visto più cover con gravidanza visibile tra quelle già in registro:
   vanno riesaminate nel primo provino [VERIFY: contarle sui 79].
4. **Personaggi con licenza di terzi** nei fotogrammi (ristoranti a tema): ammessi o da evitare.
5. **Soglia di storage**: oltre circa 250 posti, storage esterno oppure senza gemello WebP.
6. **Deny-list nei JSON tracciati** (fact pack, «Esito in testa»): resta dell'owner, ma se il
   repo è pubblico le voci sono già leggibili.

## Next hand-off

- Next agent: `travellini-orchestrator` (sintesi R2).
- In R3: `travellini-frontend-builder` per le 6 cover del §7, il provino e `covers:build`;
  `travellini-perf-engineer` per il manifest del precache, il peso della shell e il chunk
  lazy del seed; `travellini-ui-designer` per il vincolo `h169` e gli stati F0-F4;
  `travellini-data-analyst` per la quota di browser senza AVIF. Il handoff assets verso il
  frontend (`HANDOFF_webapp-travelliniwithus_assets_to_frontend.md`) lo scrivo dopo la
  sintesi R2, quando la pipeline è scelta.
- Trigger: sintesi R2 chiusa e decisioni 1-2 dell'owner prese.

## Notes

- Solo lettura su `BEST` e sul repo. Gli unici file scritti fuori da questo documento stanno
  nell'area temporanea della sessione (provini a contatto per guardare le 86 cover, script di
  misura). I pesi di §3 sono codifiche **in memoria**: nessun file scritto, nessuna ottimizzazione
  del repo.
- Non ho letto le altre uscite R1 dei colleghi. Non ho letto né stampato `IG_GRAPH_TOKEN`.
- Miglioramento operativo riusabile: il provino con la fascia del cartiglio in rosso è anche
  il modo più rapido per far vedere all'owner perché un titolo impresso è un bug.
