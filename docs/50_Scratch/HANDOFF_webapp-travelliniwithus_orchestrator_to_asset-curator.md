---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_asset-curator
status: consumed
created: 2026-09-29
from: travellini-orchestrator
to: travellini-asset-curator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con ui-designer x2, growth, social, seo)
---

# Handoff: centinaia di immagini vere, con provenienza, senza un fotografo, e cosa vede l'app offline

## Why this work matters

Travelliniwithus diventa una **webapp** (decisione owner, 2026-09-29). Il riferimento che
l'owner ha mostrato riempiva lo schermo di immagini generate: qui è vietato. Un'app a
schermo unico vive di immagini, e il corpus ha centinaia di luoghi senza una cover
certificata. Se la pipeline delle immagini reali non regge, tutte le idee visive
restano sulla carta. Sei anche l'unico che può dire quanto pesa l'app offline.

## Le domande che devi risolvere (angolo divergente)

> **1. Qual è il percorso con meno tocchi umani per mettere un fotogramma reale e
> certificato su ogni posto, sapendo che nessuna cover entra senza l'occhio di un umano
> e che un titolo impresso nel fotogramma è un bug?**
>
> **2. Cosa vede l'app offline, e quanto pesa?**

## Decisions already made

- **Imagery truth (non negoziabile, anche con una direzione visiva nuova)** —
  `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`:
  - luoghi, persone ed esperienze solo con foto (`real-photo`) o fotogrammi dei reel
    (`real-frame`) del brand, con un'etichetta di provenienza per ogni asset;
  - generazione ammessa solo per asset `craft` non referenziali (carta, inchiostro,
    timbri, map wash, matte), con scheda metadata e approvazione owner per ogni asset;
  - ogni de-placeholdering di un posto richiede una cover certificata e fatti passati da
    `/verify-facts`.
- **Gerarchia delle fonti** (`BEST/docs/ASSET_STRATEGY.md` §3): prima le foto
  proprietarie, poi i fotogrammi e le cover dei reel; la generazione arriva solo dopo
  due "no" documentati, e solo come `craft`.
- **Divieti assoluti** (§6): niente versioni finte di Rodrigo e Betta, niente
  viaggi non fatti, niente community o testimonianze generate, **mai testo di
  interfaccia dentro un'immagine**.
- **Higgsfield** (§7): ammesse solo trasformazioni di materiale reale (`reframe`,
  `upscale_image`/`upscale_video`, `personal_clipper`, `outpaint_image` senza inventare il
  luogo, `remove_background`), con approvazione owner e verifica crediti. Vietate le
  generazioni da zero di persone, luoghi ed esperienze.
- **Cover da guardare**: la regola della spec corpus §4 dice "nessuna cover entra senza
  che l'abbia vista un umano".
- **Privacy**: deny-list della spec corpus (il post indicato nella deny-list della spec, strutture sanitarie,
  residenze private, scuole); contenuti con il bambino e con minori secondo
  `BEST/docs/20_Decisions/DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24.md`.
- **Invariati**: brand, budget del bundle, file ad alto rischio fuori scope, **nessun
  segreto** (il token `IG_GRAPH_TOKEN` non va letto né stampato), nessun numero
  inventato.

## Ipotesi di lavoro (raccomandazioni dell'orchestratore, da confermare dall'owner prima della sintesi R2)

- Si lancia con i 79 posti visibili (più il primo lotto di 21 reel della spec), con una
  struttura pensata per 533 e oltre.
- Il corpus può comparire come **tracce**: reel geolocalizzati senza pagina propria, che
  possono anche non avere un'immagine locale. I **posti** hanno scheda, URL e cover
  certificata.
- «I miei posti»: salvati senza account e **leggibili offline**.

## Context the receiver needs

**Fatti verificati** (usa solo questi; tutto il resto va marcato `[VERIFY: ...]`):

- Base = ramo del PR #27, commit 4fe1794, checkout in sola lettura:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  `/home/user/TRAVELLINIWITHUS` è `main`, fermo all'11 agosto: non è la base.
- Corpus: 1.283 post (dal 25 lug 2021 al 13 ago 2026: 1.192 reel, 84 caroselli, 6 foto)
  in `BEST/src/data/instagram-corpus.json` (~1,5 MB, fuori dal bundle). 624 luoghi
  geocodificati in `corpus-places.json` (463 Italia, 31 Spagna, 17 UK, 15 Emirati, 11
  Francia, 10 Egitto; 120 solo città o regione). 1.017 reel citano un luogo. Secondo la
  spec, 533 luoghi nuovi hanno almeno un reel; 31 esistono solo come post (30 caroselli
  1440×1440, 2 foto, 1 video): niente fotogramma verticale.
- Sul sito: 79 schede posto visibili su 110. Import del corpus non fatto (spec
  `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`,
  da-approvare).
- Immagini oggi:
  - **84 cover reali in `BEST/public/images/reels/`**; `public/` pesa **123 MB**;
  - registro `BEST/src/data/asset-provenance.json`: `/images/reels/` = `real-frame`;
    `/images/atlante/carta-tile` = `craft`; `/images/home-journal/` e il resto di
    `/images/atlante/` = `da-certificare`;
  - controllo `npm run audit:provenance`.
- **Titoli impressi**: molte cover dei reel hanno il titolo impresso nel fotogramma (per
  esempio «Campigna» e «Somma Vesuviana (NA)», screenshot 05 e 06 in
  `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`).
- Video:
  - `BEST/src/config/reels.ts` ha 67 voci, tutte con `localPath /video/*.mp4`;
  - `public/video/` nel checkout è vuota (gitignored); secondo la spec sono 52 MP4 da
    429 MB che esistono solo in locale;
  - in produzione arriverebbero da `VITE_VIDEO_BASE_URL` (proposta R2 Cloudflare in
    `BEST/docs/20_Decisions/DECISION_VIDEO_EGRESS_2026-07-26.md`, status proposed) [VERIFY].
- Import: `scripts/import-instagram.ts` (`npm run import:instagram`) tira i media dalla
  Graph API con `IG_GRAPH_TOKEN` (solo `.env`, mai `VITE_`) e scrive un file di review,
  senza toccare `content-seed.json` (`BEST/docs/13_Content/INSTAGRAM_IMPORT_RUNBOOK.md`).
- PWA oggi (`BEST/vite.config.ts`):
  - il precache esclude video, chunk della mappa e **tutte le varianti responsive**
    (`-320`, `-480`, `-768`, `-1024` in AVIF e WebP);
  - la runtime cache c'è solo per i chunk pesanti;
  - **nessuna regola di cache per le immagini** [VERIFY];
  - `offline.html` non è servita come fallback.
- Modello media deciso: copertina 9:16 poster-first; il tap apre Instagram; `<video
  preload="none">` solo con una spunta; niente embed.
- Vincoli: budget `initial-js` 776 KB su 780; Lighthouse CLS ≤ 0,1 bloccante (ogni
  immagine deve avere dimensioni riservate).

**Da leggere (solo questo):** `BEST/docs/ASSET_STRATEGY.md` (§1-§8),
`BEST/src/data/asset-provenance.json`, `BEST/scripts/optimize-images.mjs`,
`BEST/scripts/check-size.mjs`, `BEST/vite.config.ts` (blocco `VitePWA`), un campione di
`BEST/public/images/reels/`, e il fact pack se è pronto
(`docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`, sezione
"Immagini").

## What the receiver should produce

1. **Pipeline** dal corpus al fotogramma certificato con voce di provenienza. Per ogni
   stadio:
   - automatico o umano;
   - **tocchi dell'owner per 100 posti**;
   - tempo per tocco [VERIFY con un test su 10 posti];
   - dove si blocca (token, video non disponibili, caroselli).
2. **Criteri di scelta del fotogramma**: fotogramma pulito contro title card; persone e
   minori; luce; verticale contro ritagli; cosa fare quando esiste solo la title card.
3. **Set di ritagli e pesi per l'app**: 9:16 (reel), 4:5 (card), 1:1 e 16:9 (hero
   desktop), più le miniature per le viste dense. Formati AVIF e WebP, peso obiettivo per
   variante [VERIFY misurando sul campione], naming.
4. **Certificazione dell'owner in blocco**: una UX di revisione (per esempio un provino a
   contatto con approva, scarta e cambia fotogramma) e come l'approvazione viene
   registrata nel registro di provenienza.
5. **Tassonomia dei fallback** per posti e tracce senza fotogramma: scheda tipografica,
   `craft` (map wash, timbro), solo coordinate e data. **Mai immagini generate di
   luoghi.**
6. **Strategia immagini offline**: cosa si mette in cache per «I miei posti», budget per
   posto salvato, invalidazione, rapporto con il precache attuale.
7. Le tue idee nel **formato scheda idea** (qui sotto).

Formato scheda idea (obbligatorio, una scheda per idea):

```
### Idea N — <nome italiano, max 5 parole>
- In una frase:
- Perché stupisce (la schermata che l'owner manderebbe a Betta):
- Dato reale su cui poggia: <fatto citato; se ignoto [VERIFY: ...]>
- Cosa richiede: dati / asset / codice / ore owner
- Rischio principale:
- Regole toccate: imagery-truth | anti-SaaS | brand-DNA | SEO-URL | file-alto-rischio | privacy | metriche-pubbliche | bundle | nessuna
- Variante: prudente | firma | audace
- Autovalutazione 1-5: Stupore / Verità / Business / Costo (5 = economico) / Carico owner (5 = leggero)
```

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_asset-curator_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Eseguire l'import, leggere o usare `IG_GRAPH_TOKEN`, scaricare media.
- Scrivere in `public/`, in `src/` o in `BEST/` (sola lettura). Nessun file ad alto
  rischio.
- Generare immagini, anche `craft`: puoi proporre quali asset craft servirebbero, con la
  scheda metadata da compilare, ma non produrli.
- Decisioni di direzione visiva (ui-designer).
- **Vietato proporre**:
  - immagini generate di luoghi, persone o esperienze, anche come placeholder o "demo";
  - stock;
  - screenshot di Google Maps o Street View;
  - l'embed di Instagram;
  - titoli o prezzi impressi nelle immagini.

## Open questions / decisions for the user

- Chi certifica le cover e con che ritmo è una decisione dell'owner (è nel piano). La
  tua pipeline deve dire quante ore richiede per 79, per 200 e per 533 posti, con le
  stime marcate `[VERIFY]`.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2). In R3, travellini-frontend-builder
  usa le tue indicazioni per scegliere le cover reali dei prototipi statici.
- Trigger: il tuo file di uscita esiste con i punti 1-7.

## Notes

- Anche i prototipi statici del gate A/B (R3) useranno solo cover `real-frame` già nel
  registro. Indica fin d'ora 6 cover adatte: 4 pulite e 2 imperfette (titolo impresso,
  poca luce), con il percorso di ciascuna.
