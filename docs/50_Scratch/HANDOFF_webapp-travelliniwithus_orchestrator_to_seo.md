---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_seo
status: open
created: 2026-09-29
from: travellini-orchestrator
to: travellini-seo-conversion-strategist
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con ui-designer x2, growth, social, asset-curator)
---

# Handoff: una webapp a schermo unico, centinaia di URL. Architettura SEO/AI-search e lessico dell'interfaccia

## Why this work matters

Travelliniwithus diventa una **webapp** (decisione owner, 2026-09-29). Il sito viene
trovato su Google e sui motori di risposta AI. Se il guscio app nasconde i contenuti, o
li riduce a una sola URL, l'app è bella e invisibile. Tu progetti la relazione tra il
guscio e i livelli editoriali (posto, articolo, destinazione) e il linguaggio con cui
l'interfaccia parla.

## Le domande che devi risolvere (angolo divergente)

> **1. Come fanno Google e un motore di risposta AI, che spesso non esegue JavaScript
> [VERIFY per singolo crawler], a vedere centinaia di pagine dentro un'app a schermo
> unico? E cosa succede esattamente quando Google porta qualcuno su `/posto/<slug>`: una
> pagina, l'app, o entrambe?**
>
> **2. Quali parole mette l'interfaccia al posto di "Filtri", "Risultati", "Dashboard",
> "Feed" e "Preferiti", perché ogni etichetta sia una promessa verificabile nella voce di
> Rodrigo e Betta?**

## Decisions already made

- **Travelliniwithus diventa una webapp**, con lo schermo unico al centro. Non rimetterla
  in discussione.
- **Articoli, guide e schede posto restano**: sono livelli di contenuto dentro l'app,
  ognuno con la propria URL indicizzabile. **Vincolo invariato**: ogni posto è
  `/posto/<slug>`, ogni articolo `/articolo/<slug>`; un solo `h1` per pagina; copy
  italiano; CTA specifica.
- **Imagery truth (non negoziabile)** — `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`:
  - luoghi, persone ed esperienze solo con foto o fotogrammi reali, con etichetta di
    provenienza (`real-photo` / `real-frame` / `craft`);
  - AI solo per asset `craft`;
  - anche le immagini OG e quelle negli schema.org seguono la regola;
  - mai testo di interfaccia dentro un'immagine.
- **Metriche pubbliche**: nessun numero social scritto nel codice, fonte datata
  obbligatoria (`BEST/docs/20_Decisions/DECISION_PUBLIC_METRICS_SOURCE_TRAVELLINIWITHUS_2026-06-07.md`).
- **Invariati**: brand, consenso per la mappa, budget del bundle, file ad alto rischio
  fuori scope, nessun segreto, nessun numero inventato.

## Ipotesi di lavoro (raccomandazioni dell'orchestratore, da confermare dall'owner prima della sintesi R2)

- "Webapp" significa: un guscio persistente con schede, una home a schermo unico e «I
  miei posti» salvati senza account e leggibili offline. L'installabilità è una
  conseguenza.
- Si lancia con i 79 posti visibili (più il primo lotto di 21 reel della spec), con una
  struttura per 533 e oltre. **Posti e tracce**: un posto ha scheda, URL, cover
  certificata e verdetto; una traccia è un reel geolocalizzato del corpus **senza pagina
  propria**. È un'ipotesi che devi validare o smontare dal punto di vista SEO: pagine
  sottili, noindex, fragment, sitemap.
- Metrica primaria: iscrizioni email nate nell'app.

## Context the receiver needs

**Fatti verificati** (usa solo questi; tutto il resto va marcato `[VERIFY: ...]`):

Base e corpus
- Base = ramo del PR #27, commit 4fe1794, checkout in sola lettura:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  `/home/user/TRAVELLINIWITHUS` è `main`, fermo all'11 agosto: non è la base.
- 1.283 post (dal 25 lug 2021 al 13 ago 2026) con caption integrali in
  `BEST/src/data/instagram-corpus.json` (~1,5 MB, fuori dal bundle client). 624 luoghi
  geocodificati in `BEST/src/data/corpus-places.json` (463 Italia, 31 Spagna, 17 UK, 15
  Emirati, 11 Francia, 10 Egitto; 120 solo città o regione). 1.017 reel citano un luogo;
  circa 186 milioni di visualizzazioni sommate.
- 79 schede posto visibili su 110 (31 "in lavorazione", nascoste). La scheda del PR #27
  ne regge 533. Import corpus non fatto (spec da-approvare
  `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`).
- **Regioni a zero** (Sardegna, Marche, Friuli Venezia Giulia, Molise, Basilicata) con
  pagine destinazione vive e indicizzabili, senza contenuto (spec §1). Puglia 1, Sicilia
  2.

Come i crawler vedono il sito oggi
- `BEST/scripts/generate-route-html.js` scrive a build `dist/posto/<id>/index.html`
  (anche destinazioni e articoli da seed) con title, description, OG e JSON-LD, solo per
  i posti reali (`!isPlaceholder`). La description e il `reviewBody` vengono dal campo
  della scheda.
- `server.ts`:
  - `resolveAppStatus` risponde 200 su `/posto/<id>` solo per gli id reali, altrimenti
    404;
  - inietta i meta di rotte statiche (`STATIC_ROUTE_META`), articoli (Firestore) e
    prodotti;
  - esiste un precedente di **prerender del corpo**: `injectSentieroPrerender` per
    `/sentiero`.
  - Il corpo di `/posto` e `/articolo` sembra **non** prerenderizzato (solo `<head>`)
    [VERIFY].
- `server.ts` ha una lista fissa di rotte (`ALL_STATIC_APP_ROUTES`: `/`, `/esplora`,
  `/mappa`, `/preferiti`, `/destinazione`, `/itinerari` e altre). **Una rotta top-level
  nuova richiede una modifica a `server.ts`** (alto rischio, solo
  travellini-backend-engineer con conferma owner).
- AI-search: esistono `public/llms.txt` e `public/llms-full.txt`, e gli script
  `audit:ai-seo` e `audit:llms`. Gli helper JSON-LD sono in `BEST/src/lib/seo.ts`.
- **Difetto noto del PR #27**: `buildPlaceItemListJsonLd` è stata segnalata come
  importata ma inesistente (blocca gli articoli). Nel checkout BEST però **risulta
  presente** in `src/lib/seo.ts:212` [VERIFY: working tree contro commit 4fe1794]. È un
  prerequisito, non un compito tuo; segnalalo se lo trovi incoerente.

Già costruito nel PR #27
- Scheda posto: «Il Timbro» (verdetto), «Cosa sapere prima», `checked` (fonte e data),
  `visitedAt`, bollo «Esiste davvero?».
- Home: «Posti che sembrano inventati. Ma esistono davvero.»
- Ricerca `SearchModal` sui 79 posti.
- Edizioni Viaggiatori, Family e Collaborazioni, con una modale d'ingresso bloccante.
- Mappa con tessere solo dietro consenso (senza, un muro scuro con H1 «Dove siamo stati
  davvero»).
- «I miei posti» su `/preferiti`, rotta privata.

PWA e vincoli
- Manifest attuale: description «Travel blog di Rodrigo & Betta», `display: standalone`,
  nessun start_url, scope o shortcuts dichiarati [VERIFY: default del plugin].
  `navigateFallback: /index.html`.
- Budget `initial-js`: 776 KB su 780. CI: Lighthouse a11y ≥ 0,95 (bloccante), SEO
  tracciato in `lighthouserc.json`.

**Da leggere (solo questo):**
- `BEST/src/config/routeMeta.ts`, `BEST/src/config/surfaces.ts`, `BEST/src/lib/seo.ts`;
- `BEST/scripts/generate-route-html.js`;
- `BEST/server.ts`, solo da riga 120 a 230 e da 343 a 420, poi `injectStaticMeta` e
  `injectSentieroPrerender` (in lettura);
- `BEST/public/llms.txt`;
- screenshot 01, 04 e 06 in
  `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`;
- il fact pack, se è pronto:
  `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`,
  per lessico delle caption, prezzi e stagionalità.

## What the receiver should produce

1. **Tabella delle architetture** (almeno 3 opzioni). Esempi da valutare, non da
   copiare:
   - (a) ogni scheda aperta nell'app aggiorna l'URL in `/posto/<slug>` e l'accesso
     diretto apre la stessa vista app con la scheda a tutta pagina;
   - (b) pagina completa per l'accesso diretto e per i crawler, con il guscio che "si
     apre" attorno alla navigazione successiva;
   - (c) prerender del corpo per posti e articoli (precedente `/sentiero`) contro il
     solo `<head>`.
   Per ciascuna:
   - indicizzabilità e canonical;
   - `h1`;
   - JSON-LD;
   - link `<a href>` crawlabili;
   - sitemap e `llms.txt`;
   - condivisione dell'URL;
   - comportamento del tasto indietro;
   - visibilità per i crawler AI senza JS;
   - **tocca `server.ts` sì o no**;
   - impatto sul bundle iniziale.
   Chiudi con la raccomandazione.
2. **Posti e tracce, zone bianche**: trattamento SEO delle tracce del corpus (nessuna
   URL, noindex, fragment o altro) e delle pagine destinazione a contenuto zero
   (noindex, o trasformarle in pagine vere e utili).
3. **Superfici proprie dell'app**: `h1`, title e meta proposti per la home app, la
   scheda Mappa, la scheda Reel e «I miei posti», con la regola "un solo `h1`" anche
   dentro un guscio.
4. **Lessico dell'interfaccia**: almeno 30 righe nella forma "termine generico →
   termine Travelliniwithus → perché".
5. **Microcopy degli stati**: vuoto, offline, mappa senza consenso, salvato, zona
   bianca, errore, invito a installare, ritorno dopo tempo. Due varianti ciascuno.
6. **GEO / AI-search**: come caption ("con le loro parole"), verdetti, date `checked` e
   prezzi datati diventano fatti citabili dai motori di risposta, senza esporre dati
   privati e senza numeri social scritti nel codice.
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

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_seo_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Codice e `src/`. `BEST/` è in sola lettura. **Mai modificare `server.ts`**: se
  un'opzione lo richiede, scrivilo nella tabella.
- Meta per tutti i 533 posti; articoli; correggere `buildPlaceItemListJsonLd`.
- Direzione visiva (ui-designer), meccanismi di business (growth).
- **Vietato proporre**:
  - pagine sottili generate in massa per i luoghi del corpus senza scheda vera;
  - cloaking (HTML diverso per i bot e per gli utenti);
  - hash routing che rompe le URL dei posti;
  - numeri social scritti nel codice;
  - termini inglesi nell'interfaccia pubblica.

## Open questions / decisions for the user

- Se la raccomandazione richiede una modifica a `server.ts` (prerender del corpo o nuova
  rotta), indicala come decisione owner con motivazione e alternativa.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2), poi travellini-code-architect
  (fattibilità, R3).
- Trigger: il tuo file di uscita esiste con i punti 1-7.

## Notes

- La home promette «Ti diciamo se vale il viaggio», ma il verdetto «per chi è / per chi
  no» esiste su 1 scheda su 79 (spec corpus §4). Un'architettura che espone il verdetto
  come fatto citabile rende visibile anche la sua assenza: tienine conto.
