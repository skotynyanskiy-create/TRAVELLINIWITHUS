---
type: project
area: product
status: open
priority: p0
owner: team
repo: TRAVELLINIWITHUS
route: /
created: 2026-07-22
source: analisi strategica Fable (codebase + docs + audit IG + asset reali)
related:
  - '[[10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026]]'
  - '[[10_Projects/PROJECT_ELEVATION_BRAINSTORM_2026-07-04]]'
  - '[[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]'
  - '[[10_Projects/PROJECT_RELEASE_READINESS]]'
tags:
  - project
  - redesign
  - brand
  - proposal
---

# PROJECT — Redesign radicale: tre direzioni, una scelta (2026-07-22)

**Stato: PROPOSTA — in attesa di approvazione owner. Nessun codice modificato,
nessun asset generato, nessuna dipendenza installata.**

## 1. Diagnosi (cosa è vero oggi)

1. **Il brand è «meraviglia concreta»**: posti che sembrano inventati, provati
   davvero, con prezzo e verdetto onesto. L'audit IG 2026-07-21 lo dimostra con
   i numeri: contenuti organici di scoperta mediana 5.922 like vs 590 dei
   contenuti ADV (10x). I top: Burton Juice 63K, Kuala Lumpur 20K, Bled 17K.
2. **Gli asset reali sono pochi ma veri**: 5 reel MP4 (gitignored, cover-frame
   reali estratte), 40 posti reali in `content-seed.json` con hook, prezzo,
   coordinate e stato partnership — ma zero cover e permalink generici. 1
   pillar Salento + articolo Burton Juice. Toolchain di acquisizione reel
   propria documentata e testata (yt-dlp + ffmpeg + sharp, 8/8).
3. **Emergenza integrità**: le foto della "coppia" su tutto il sito
   (`couple-travel.*`, `about-editorial.*`, e le 3 immagini del diario
   `hero-impossible` / `altrove-vicino` / `dentro-storia`) sono AI e
   ritraggono una coppia finta nei posti reali, con caption luogo e timbro
   «Provato». Contraddice frontalmente la promessa «ci siamo stati davvero».
   Le foto vere di R&B esistono dentro i frame dei loro reel.
4. **Quattro home in due mesi** (editoriale → Sentiero WebGL → Atlante Vivo →
   Montaggio delle tracce → Diario delle meraviglie vere): tutte ben eseguite,
   tutte cornici intorno allo stesso vuoto di media reali. La quinta home da
   zero NON è la risposta.
5. **Blocchi deploy**: perf mobile home (LCP 3,05–3,48s, TBT 1.008ms = BLOCK),
   rotazione/restrizione Firebase Web API key (owner), env produzione (owner).
   La bio IG/TikTok punta ancora a Linktree: il sito non è ancora la casa.
6. **Commercio reale**: revenue = ADV/inviti/affiliazioni; funnel B2B
   collaborazioni/media-kit; newsletter Brevo (automazione non verificata);
   shop/club in waitlist; prova pubblica: AGCOM, badge Meta, press Castelli
   del Ducato.

**Conclusione diagnostica**: il redesign che serve non è un'altra metafora di
home. È dare al sito **un'identità-istituzione che i social non possono avere**,
costruita sui contenuti veri, con una pipeline media reale e la fine delle
prove finte.

## 2. Le tre direzioni

### Direzione A — «L'Atlante Timbrato»

- **Idea centrale**: il sito è la collezione definitiva dei posti
  impossibili-ma-veri: un atlante-schedario dove ogni posto è una scheda
  verificata (hook, prezzo, periodo, mappa, timbro «Provato»). Identità =
  collezione/spazio.
- **Perché è brand-fit**: «posti particolari in tutto il mondo» è letteralmente
  la bio; i 40 posti reali del seed sono l'atlante già in embrione; la Mappa
  delle tracce (già consegnata, PASS) è la sua tavola cartografica.
- **Homepage**: apertura sull'oggetto-atlante: indice numerato cinematografico
  (01–40), una scheda in evidenza, mappa scura come cuore, pillar come
  collezioni («Sembra impossibile», «Altrove vicino», «Dentro una storia»).
- **Navigazione/struttura**: Atlante (indice) · Mappa · Diario · Noi ·
  Collabora. Il posto è l'unità atomica; articoli e reel orbitano attorno.
- **Mobile**: indice verticale a schede, mappa full-height, filtri a
  linguetta già collaudati su /mappa.
- **Higgsfield**: minimo — restauro cover reali (crop/outpaint/upscale),
  texture carta/atlante dichiarate come illustrazione. Niente ambienti
  generati.
- **Business value**: SEO per-posto (40 pagine vere), affiliate contestuale,
  credibilità partner («il tuo posto diventa una scheda dell'atlante»).
- **Complessità tecnica**: bassa-media — re-skin di Esplora/Posto/Mappa già
  esistenti attorno alla scheda.
- **Forze**: massima fattibilità; usa tutto ciò che esiste; utilità evidente;
  invecchia bene. **Debolezze**: la meno differenziante delle tre (atlanti ed
  archivi esistono); emozione più fredda; rischia di sembrare l'ennesimo
  «esplora» rifinito.

### Direzione B — «Il Canale delle Meraviglie»

- **Idea centrale**: il sito come canale proprietario di Rodrigo & Betta:
  episodi video verticali nativi (i reel veri) + il livello che i social non
  hanno: il dossier con prezzo, periodo, per-chi. Identità = tempo/racconto.
- **Perché è brand-fit**: sono creator video; il formato hook→reveal→dettagli
  è già la loro firma; il sito diventa la versione «completa» del feed, non
  una brochure.
- **Homepage**: full-bleed di un reel vero (muted, poster-first), hook
  tipografico gigante, scroll = episodio successivo; tap = il dossier si apre
  sopra il video.
- **Navigazione/struttura**: Episodi · Posti · Mappa · Noi · Collabora. Ogni
  episodio è legato al suo posto/dossier.
- **Mobile**: nativo 9:16, è il suo habitat; desktop = «sala cinema» con loop
  ambient riquadrati 16:9 (reframe dai verticali).
- **Higgsfield**: massimo — reframe 9:16→16:9, upscale video, pulizia cover,
  image-to-video su frame reali per transizioni e loop ambient.
- **Business value**: cattura il traffico bio (sostituisce Linktree con
  l'esperienza più simile a IG), inventario ADV vendibile («episodio +
  dossier permanente»), newsletter come «nuovi episodi».
- **Complessità tecnica**: alta — pipeline media obbligatoria (harvest,
  conversione, pulizia), budget CWV difficilissimo (la home attuale è già
  BLOCK con sole immagini), SEO da costruire sul layer testuale.
- **Forze**: impatto emotivo massimo; mobile eccellente; ponte perfetto
  dall'audience IG. **Debolezze**: fattibilità e manutenibilità più basse
  (ogni contenuto nuovo richiede lavorazione media senza API IG); rischio
  «feed fotocopiato» se il layer dossier non domina; peso pagina.

### Direzione C — «Vale Davvero» (l'istituzione del verdetto)

- **Idea centrale**: il sito è l'istituzione del verdetto onesto sui posti
  che sembrano inventati. Ogni posto riceve il **Timbro Travellini**:
  «Provato + data» e un verdetto in tre gradi — **Vale davvero / Vale, se… /
  Solo per…** — con prezzo reale, periodo giusto, per chi sì e per chi no, e
  lo stato di trasparenza (organico/invito/ADV, dato già nel seed). Identità
  = giudizio/metodo. I social mostrano la meraviglia; il sito emette il
  verdetto.
- **Perché è brand-fit**: «Vale davvero?» è già il pillar che l'audit indica
  come la differenza funzionale sito-vs-social; il verdetto è già nella voce
  dei reel («È gratis, il posto è indescrivibile», «vale la pena per chi…»);
  i primitivi esistono già nel codice (VerdictSeal «Il Timbro», RatingPill,
  campo `verdict` nel content model, variante Diario). AGCOM + badge Meta +
  disclosure dichiarata = credenziali da istituzione, non da influencer.
- **Homepage**: manifesto + registro. Copertina con frame reale e Timbro
  animato; «L'ultimo verdetto» (dossier in evidenza con reel verticale vero);
  l'atlante come corpo; il metodo in 3 atti con prova (AGCOM/Meta/press);
  registro dei verdetti recenti; chiusura «Ricevi il prossimo verdetto».
- **Navigazione/struttura**: Atlante · Mappa · Diario · Noi · Collabora +
  pill newsletter «Il prossimo verdetto». Il dossier-posto è il tempio del
  verdetto.
- **Mobile**: stessa storia verticale; il colpo di timbro è un micro-moment
  CSS leggerissimo; reel tap-to-play con facade.
- **Higgsfield**: mirato — restauro cover reali, 3–5 loop ambient da frame
  reali (movimenti camera credibili), kit texture/timbro dichiarato. Mai
  persone o luoghi generati come prova.
- **Business value**: il più alto. B2B: il Timbro diventa il prodotto che i
  partner vogliono («porta il tuo posto nell'atlante, verdetto incluso») e la
  trasparenza per-posto è un argomento di vendita unico per un creator AGCOM.
  Reader: la decisione assistita è l'utilità massima; AI-search: claim
  citabili (verdetto+prezzo+data) = GEO perfetto. Newsletter con promessa
  concreta.
- **Complessità tecnica**: media — è un sistema editoriale sopra la spina
  esistente; la v1 non dipende dai media (i verdetti sono testo+dati).
- **Forze**: differenziazione vera (nessun template travel fa «istituzione
  del verdetto»); riusa il meglio già costruito; utile oltre l'estetica;
  scala per testo prima che per media. **Debolezze**: richiede disciplina
  editoriale dell'owner (verdetti veri per ~40 posti); tensione da gestire
  tra verdetto e ospitalità partner (risolta dalla grammatica «per chi
  sì/no» + trasparenza, mai stroncature finte).

## 3. Scoring

| Criterio        | A · Atlante | B · Canale | C · Vale Davvero |
| --------------- | ----------: | ---------: | ---------------: |
| Brand fit       |           9 |        8,5 |          **9,5** |
| Originalità     |           7 |        8,5 |            **9** |
| Utilità         |           9 |        7,5 |          **9,5** |
| Impatto emotivo |         7,5 |    **9,5** |              8,5 |
| Usabilità       |       **9** |        7,5 |              8,5 |
| Qualità mobile  |         8,5 |      **9** |              8,5 |
| Fattibilità     |       **9** |        6,5 |              8,5 |
| Manutenibilità  |       **9** |        6,5 |              8,5 |
| **Totale**      |      **68** |   **63,5** |         **70,5** |

**Selezione autonoma: Direzione C — «Vale Davvero»**, che assorbe la spina
archivio di A (l'atlante è il corpo dei verdetti) e il layer video di B come
prova dentro i dossier (mai come sistema operativo del sito).

## 4. Concept finale

> **«Vale Davvero» — l'atlante timbrato delle meraviglie provate.**
> I social mostrano posti che sembrano inventati. Il sito è dove Rodrigo &
> Betta emettono il verdetto: provato, prezzo vero, per chi sì e per chi no,
> con trasparenza dichiarata su ogni collaborazione.

Il gesto di brand è **il colpo di timbro**: ogni superficie del sito ruota
attorno a questo atto (motion signature, sigillo, registro, data).

**Grammatica del verdetto** (partner-safe, mai finta negatività):

- `VALE DAVVERO` — vale senza condizioni;
- `VALE, SE…` — il grado più comune e più onesto (condizione esplicita);
- `SOLO PER…` — di nicchia dichiarata (fantasy lovers, fuori stagione, …).

Ogni verdetto porta: per chi sì · per chi no · prezzo reale · periodo giusto ·
il limite da sapere · **trasparenza** (organico / invito / ADV — campo
`partnership.kind` già nel seed) · data «Provato il…». Voto /10 (VerdictSeal)
opzionale, solo dove la redazione vuole esporsi.

## 5. Storyboard homepage (evoluzione del Diario, non sesta home)

1. **Copertina** — frame reale Burton Juice (dal reel pinnato 63K), H1
   esistente «Posti che sembrano inventati. Ma esistono davvero.» + deck «Li
   proviamo noi. E ti diciamo se valgono.»; il Timbro si imprime all'ingresso
   (signature motion). CTA: «L'ultimo verdetto» · «Apri l'atlante».
2. **L'ultimo verdetto** — dossier in evidenza: reel verticale vero
   (facade, tap-to-play), card verdetto completa, CTA al dossier.
3. **L'atlante** — il corpo: conteggi veri per pillar, 3 schede in evidenza,
   invito alla mappa. «Trova il posto giusto per te.»
4. **Il metodo, firmato** — 3 atti (Ci andiamo / Segniamo tutto / Ti diciamo
   per chi è) + frame reale di R&B + striscia prova: AGCOM · Meta verificato ·
   press Castelli del Ducato + promessa «qui solo fotografie vere».
5. **Registro dei verdetti** — le ultime 3–4 righe timbrate (posto · verdetto
   · prezzo): il ritmo dell'istituzione.
6. **La prossima traccia** — newsletter «Ricevi il prossimo verdetto»
   (primaria) · «Porta il tuo posto nell'atlante» (B2B) · «Chi siamo».

Mobile: stessa sequenza verticale; nessuna simulazione di pagina; timbro CSS.

## 6. Information architecture

```
/                    Home «Vale Davvero»
/esplora             L'Atlante (URL stabile, label nuova; curation-first)
/mappa               Mappa delle tracce (già consegnata — resta)
/posto/:slug         Il Dossier v2 (verdetto-led; JSON-LD Review+FAQ)
/articolo/:slug      Diario (variante Diario già pronta dietro flag)
/chi-siamo           Noi (episodi reali, non timeline astratta)
/collaborazioni      Lavora con noi (+ /media-kit split instant/qualificato)
/vieni-con-noi       Bio hub (standalone, resta; allineato al verdetto)
/risorse             Risorse (affiliate con disclosure)
legal                invariate
STANDBY (LITE flags): /shop /club /itinerari /strumenti /preferiti
```

Nav: **Atlante · Mappa · Diario · Noi · Collabora** + pill «Il prossimo
verdetto» (newsletter, reader-first come da elevation lens).

## 7. Direzione visiva e motion

- DNA invariato: Fraunces + Inter, sand caldo, terracotta, ink; carta calda e
  inchiostro del Diario mantenuti. Nessun nuovo colore, nessun blob.
- **Una sola motion signature**: il colpo di timbro (scale-settle + micro
  rotazione + ink bleed, ~400ms, `prefers-reduced-motion` = statico). Il
  serif-reveal già implementato resta; il page-turn desktop resta sobrio.
- Fotografia: SOLO reale (frame harvest dai reel propri). AI ammessa solo per
  texture/timbri/illustrazioni dichiarate — mai persone, mai luoghi-prova.
- Budget perf vincolante: home LCP mobile ≤2,5s (oggi 3,05–3,48 = da fixare),
  CLS ≤0,1, poster ≤200KB, loop ambient ≤1,5MB webm, niente video eager.

## 8. Conversioni principali

1. **Newsletter «Ricevi il prossimo verdetto»** — home S6, fine di ogni
   dossier, bio hub. KPI: signup/settimana per source (eventi già wired).
2. **B2B «Porta il tuo posto nell'atlante»** — hook su ogni dossier →
   /collaborazioni → media kit split (instant download + form qualificato).
   KPI: `partner_inquiry_start`.
3. **Affiliate contestuale sul dossier** (assicurazione/attività del posto,
   `rel="sponsored"`, disclosure). KPI: click affiliate per dossier.
4. **Migrazione bio** Linktree → `/vieni-con-noi` (azione owner). KPI:
   sessioni da `bio_hub`.

Nuovi eventi: `verdict_view`, `dossier_open`, `verdict_ledger_click`.

## 9. Piano asset Higgsfield (SOLO dopo approvazione)

Regole: mai generare persone o luoghi presentati come prova; solo (a)
enhancement di footage proprio, (b) illustrazione dichiarata, (c) varianti
formato. Ogni asset documentato in vault.

- **Wave 0 — senza Higgsfield (gratis)**: harvest ~10 reel propri via
  toolchain documentata (yt-dlp/ffmpeg/sharp) — include Burton Juice, Bled,
  Jesolo/Caribe Bay, KL. Sostituisce le 3 immagini AI del diario e le foto
  coppia. [richiede ok owner al download dei propri contenuti]
- **Wave 1 — validazione (credits minimi)**: 1 cover restaurata (crop zona
  pulita + outpaint + upscale 2K) + 1 loop ambient 5s image-to-video da frame
  reale (camera credibile, niente morphing). Giudizio brand-fit prima di
  proseguire.
- **Wave 2 — produzione**: ~8 cover restaurate; 3–5 loop ambient (home +
  dossier top) in doppia variante 16:9/9:16 via reframe; kit texture
  carta/timbro (GPT Image 2) dichiarato come illustrazione; opzionali 2
  transizioni capitolo se il budget perf regge.
- **Nota accesso**: il server MCP `higgsfield` risulta non autenticato in
  questa sessione (autorizzare dai connector claude.ai o via `/mcp` in
  sessione interattiva); il connettore Higgsfield e le skill CLI sono
  disponibili. Verificare credits prima della Wave 2.

## 10. Strategia di migrazione

- **Fase 0 — Integrità (P0, nessuna dipendenza)**: rimozione immagini AI
  della coppia da ogni superficie-prova (ChiSiamo, CoupleIntro, ArticleHero,
  FEATURED_REEL.thumbnail, trio home-journal) con sostituzione da harvest
  reale o fallback text-first; fix perf mobile home (BLOCK noto); verifica
  chiusura honesty-pass (noindex placeholder, filler articoli).
- **Fase 1 — Sistema verdetto**: estensione content model (per-chi, limite,
  trasparenza visibile), template Dossier v2 su /posto, JSON-LD Review+FAQ,
  motion timbro.
- **Fase 2 — Home + registro**: evoluzione della home Diario allo storyboard
  §5, nav labels, ledger verdetti.
- **Fase 3 — Atlante**: re-skin curation-first di /esplora; /mappa invariata.
- **Fase 4 — Media**: wave Higgsfield 1–2 + layer video sui dossier.
- **Fase 5 — Gate e deploy**: predeploy S6 completo + azioni owner (rotazione
  Firebase key, env produzione, switch bio IG/TikTok).

Rollback: un branch per fase, commit piccoli approvati, pattern HomeLegacy e
LITE flags già rodati. `server.ts`/`firestore.rules`/`admin.ts` fuori
perimetro (eventuali ritocchi solo via backend-engineer + conferma owner).

## 11. Vertical slice (primo taglio da costruire)

**Dossier «The Burton Juice»** end-to-end + aggancio home:

1. harvest reel Burton Juice (pinnato, 63K) + estrazione frame puliti;
2. Dossier v2 su `/posto/burton-juice-…`: Timbro «Provato», verdetto
   `VALE, SE…` reale dell'owner, prezzo/periodo/per-chi/limite, trasparenza,
   reel tap-to-play, blocco risorse, posti vicini, JSON-LD Review+FAQ;
3. home S1 (copertina con frame reale) + S2 (ultimo verdetto → Burton Juice).

**Definition of done**: mobile 375 senza overflow; LCP ≤2,5s simulato 4G/CPU
4x; axe 0 violazioni; un solo H1; zero immagini AI-persone; typecheck, build,
audit:ui, audit:visual PASS.

## 12. Approvazioni richieste prima di procedere

- [ ] conferma direzione «Vale Davvero» (o richiesta di variante);
- [ ] ok all'harvest dei reel propri (download contenuti propri, lista URL);
- [ ] ok alla rimozione delle immagini AI-coppia dalle superfici pubbliche;
- [ ] ok a Wave 1 Higgsfield (credits) + autorizzazione connettore se serve;
- [ ] verdetti reali owner per i primi 3 posti (Burton Juice, Bled, Jesolo);
- [ ] nessun commit/push/deploy finché non richiesto esplicitamente.
