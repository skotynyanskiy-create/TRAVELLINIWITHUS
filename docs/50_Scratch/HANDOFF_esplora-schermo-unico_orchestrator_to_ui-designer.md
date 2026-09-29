---
title: HANDOFF_esplora-schermo-unico_orchestrator_to_ui-designer
status: open
created: 2026-09-29
from: travellini-orchestrator
to: travellini-ui-designer
slug: esplora-schermo-unico
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con growth, social, seo, asset-curator)
---

# Handoff: il guscio a schermo unico come oggetto del brand, non come app

## Why this work matters

L'owner vuole una modalità "Esplora a schermo unico" (viewport intera, nessuno scroll
di pagina) per esplorare posti e reel, e ha chiesto un risultato che lo stupisca. Il
riferimento che ha mostrato è un guscio da app: filtri a sinistra con contatori, hero
full-bleed, pannello a destra, barra in basso a 6 voci, tab Luoghi/Esperienze/Reel,
ricerca ⌘K, «I miei posti», immagini generate. **Il rischio numero uno è il drift verso
una dashboard SaaS.** Il tuo angolo decide se questa cosa sembra Travelliniwithus o un
template.

## La domanda che devi risolvere (angolo divergente)

> **Se il guscio fosse un oggetto che Rodrigo e Betta tengono sul tavolo, quale sarebbe?
> E cosa succede, fisicamente, quando "apri" un posto?**

Tre metafore sono già sul tavolo dell'orchestratore: **il tavolo luminoso con i provini
a contatto**, **il taccuino a doppia pagina** (indice a sinistra, posto a destra),
**l'atlante tascabile che si sfoglia**. Puoi svilupparne due, ma **la terza direzione
deve essere diversa da tutte e tre.** Almeno una delle tre direzioni deve essere
"quasi troppo" (audace) e dirlo.

## Decisions already made

- **Imagery truth (non negoziabile)** — `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`:
  luoghi, persone ed esperienze solo con foto o fotogrammi reali, etichetta di provenienza
  per asset (`real-photo` / `real-frame` / `craft`). AI solo per `craft` non referenziale
  (carta, inchiostro, timbri, map wash, matte), approvato dall'owner per asset. Gli asset
  `da-certificare` (`/images/home-journal/`, `/images/atlante/` tranne `carta-tile`) non
  diventano prova su superfici nuove. Mai testo di interfaccia dentro un'immagine
  (ASSET_STRATEGY §6). Del riferimento dell'owner si prende l'idea d'interazione, mai
  le immagini né l'aspetto.
- **Brand DNA**: Fraunces + sabbia `#faf8f4` + terracotta `#c2410c` + foto reali + lucide-react.
  È deliberato. Vietati gli strumenti di design elencati nel CLAUDE.md come anti-DNA.
- **Anti-SaaS**: niente dashboard, niente gradient blob, niente controlli finti.
- **SEO**: ogni posto resta una URL indicizzabile `/posto/<slug>`; un solo `h1` per
  pagina, anche nel guscio.
- **Tecnica**: budget `initial-js` 776 KB su 780 → il guscio sarà un chunk di rotta
  lazy. Lighthouse a11y ≥ 0,95 e CLS ≤ 0,1 sono gate bloccanti in CI.
- **Ipotesi di lavoro** (decisione owner pendente): il guscio è una **modalità su rotta
  dedicata**, non sostituisce il sito. Se una tua direzione funziona solo come
  sostituzione, dillo esplicitamente.

## Context the receiver needs

Base di codice (sola lettura): `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`
(ramo PR #27, commit 4fe1794). Il repo `/home/user/TRAVELLINIWITHUS` è `main`, vecchio: non è la base.

Fatti verificati (tutto il resto va marcato `[VERIFY: ...]`):
- 1.283 post Instagram (25 lug 2021 → 13 ago 2026); 624 luoghi geocodificati (463 Italia,
  31 Spagna, 17 UK, 15 Emirati, 11 Francia, 10 Egitto; 120 solo città/regione); 1.017 reel
  citano un luogo; ~186 milioni di visualizzazioni sommate.
- Sul sito 79 schede posto visibili (su 110 nel registro); la scheda del PR #27 è pensata
  per reggerne 533. L'import del corpus in schede **non è fatto**.
- Già costruito nel PR #27 (riusa prima di inventare): mappa con raggruppamento per zoom,
  culling, tetto 60 marcatori; tessere OpenFreeMap solo con consenso marketing —
  **senza consenso `/mappa` è un muro scuro con "Attiva la mappa"** (vedi screenshot 04);
  scheda posto con verdetto «Il Timbro», «Cosa sapere prima», campi `checked` e
  `visitedAt`, bollo «Esiste davvero?»; ricerca che conosce i 79 posti; commutatore
  "edizione" Viaggiatori/Family/Collaborazioni in testata; home «Posti che sembrano
  inventati. Ma esistono davvero.»
- Modello media deciso dall'owner: reel = copertina 9:16 poster-first, il tap apre
  Instagram di default; con spunta, `<video>` in pagina, `preload="none"`, mai autoplay.
  Embed Instagram escluso. I caroselli (1440×1440) non sono reel.
- Squilibrio geografico (spec corpus): Lombardia 147 posti; Sardegna, Marche, FVG,
  Molise, Basilicata a zero; Puglia 1, Sicilia 2.
- Screenshot del ramo: `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`
  (01 home, 04 mappa, 05 esplora, 06/07 scheda posto desktop/mobile).
- Fact pack del corpus (se già pronto): `docs/50_Scratch/HANDOFF_esplora-schermo-unico_data-analyst_to_divergenza.md`.

File da leggere (solo questi): `DESIGN.md`, gli screenshot sopra, `BEST/src/config/surfaces.ts`,
il componente mappa e la scheda posto in `BEST/src/` (trovali con Grep, non leggere tutto `src/`).

## What the receiver should produce

1. **Tre direzioni** (prudente / firma / audace), ciascuna con:
   - nome italiano e metafora in una riga;
   - layout desktop 1440×900 e mobile 375×667 (wireframe ASCII o griglia descritta);
   - **il gesto firma**: l'unica interazione che uno ricorda;
   - cosa diventa la scheda posto aperta, e come si apre un reel;
   - come regge 22–60 marcatori visibili e 533 posti in archivio;
   - stato "mappa senza consenso" (non può essere un muro scuro);
   - regole di motion + stato `prefers-reduced-motion`;
   - scala tipografica (Fraunces) e uso della terracotta;
   - cosa significa "nessuno scroll di pagina" (dove si scorre ancora, dentro i pannelli?).
2. **Tabella del riferimento**: per ogni elemento del riferimento dell'owner (filtri +
   contatori a sinistra, hero full-bleed, pannello a destra, barra in basso a 6 voci
   Esplora/Mappa/Reel/Itinerari/Noi&Family/Collaborazioni, tab Luoghi/Esperienze/Reel,
   ⌘K, «I miei posti») → **tieni / trasforma / elimina**, con motivo.
3. **Stati obbligatori** della direzione raccomandata: vuoto (filtro senza risultati),
   caricamento, errore, posto salvato, tastiera/⌘K, focus e ritorno del focus.
4. **Una raccomandazione** con la direzione su cui scommetti e perché.
5. Le idee nel **formato scheda idea** (sotto), perché l'orchestratore le confronterà con
   quelle degli altri quattro agenti.

Formato scheda idea (obbligatorio, una per idea):

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

- Where it lands: `docs/50_Scratch/HANDOFF_esplora-schermo-unico_ui-designer_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS` (frontmatter del template handoff).

## Out of scope (do NOT touch)

- Codice, `src/`, `BEST/` (sola lettura), qualunque file ad alto rischio.
- Copy italiano definitivo: usa etichette provvisorie in italiano; il lessico
  dell'interfaccia lo propone `travellini-seo-conversion-strategist`.
- Generare immagini, anche "per mockup". Nessuna immagine generata di luoghi o persone.
- **Vietato proporre**: globo 3D che ruota, swipe stile Tinder, badge/punti/gamification,
  chatbot o pianificatore AI, feed infinito "per te", contatori-badge da dashboard,
  glassmorphism, gradient blob, dark mode neon, barra in basso con più di 5 voci.

## Open questions / decisions for the user

- Se una direzione richiede una rotta nuova (e quindi una modifica a `server.ts`),
  segnalalo: `/esplora` e `/mappa` esistono già in `ALL_STATIC_APP_ROUTES`.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2), poi tu di nuovo per il veto di
  brand sui 3 pacchetti (R3).
- Trigger: il tuo file di uscita esiste con le 3 direzioni, la tabella del riferimento
  e le schede idea.

## Notes

- Una direzione che funziona solo con foto perfette non regge: molte cover dei reel
  hanno un titolo impresso (es. «Campigna», «Somma Vesuviana (NA)» negli screenshot).
  Progetta per fotogrammi reali imperfetti.
- Il lavoro precedente "Atlante delle Meraviglie Vere" (redesign approvato il 2026-07-22)
  e "Il montaggio delle tracce" (home) sono il linguaggio visivo corrente: parti da lì.
