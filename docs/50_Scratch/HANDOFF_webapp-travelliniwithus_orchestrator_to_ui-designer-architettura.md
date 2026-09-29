---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_ui-designer-architettura
status: open
created: 2026-09-29
from: travellini-orchestrator
to: travellini-ui-designer
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con ui-designer-direzione, growth, social, seo, asset-curator)
---

# Handoff: architettura dell'informazione e interazione della webapp Travelliniwithus

## Why this work matters

L'owner ha deciso che Travelliniwithus diventa una **webapp**, con un'esperienza a
schermo unico al centro. Serve la struttura del prodotto: le schede, la gerarchia, il
primo minuto d'uso, l'onboarding minimo, il ritorno del visitatore, e il rapporto tra il
guscio e i contenuti editoriali, che restano pagine indicizzabili. Tu ti occupi del
**come** (interazione). Il **perché** qualcuno la installa o ci torna lo sviluppa in
parallelo travellini-growth-revenue-operator: non duplicarlo.

## Le domande che devi risolvere (angolo divergente)

> **1. Cosa succede nel primo minuto di una persona che arriva da un reel, sul telefono,
> senza sapere chi siete? E cosa succede la terza volta che torna?**
>
> **2. Cosa rende questa un'app di Rodrigo e Betta e non un'app di viaggi qualunque?
> Quale elemento, se lo togli, la rende generica?**

## Decisions already made

- **Travelliniwithus diventa una webapp** (decisione owner, 2026-09-29). Non rimetterla in
  discussione.
- **Articoli, guide e schede posto restano**: sono livelli di contenuto dentro l'app, e
  ognuno ha la propria URL indicizzabile (`/posto/<slug>`, `/articolo/<slug>`,
  destinazioni). Una persona che arriva da Google su una di queste URL deve trovare il
  contenuto, e poter entrare nell'app e tornare indietro senza perdersi.
- **Imagery truth (non negoziabile)** — `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`.
  - Luoghi, persone ed esperienze: solo foto o fotogrammi reali, con etichetta di
    provenienza per ogni asset (`real-photo` / `real-frame` / `craft`), registrata in
    `BEST/src/data/asset-provenance.json`.
  - AI solo per asset `craft` non referenziali, approvati dall'owner.
  - Mai testo di interfaccia dentro un'immagine.
  - Del riferimento dell'owner si prende l'interazione, mai le immagini.
- **Direzione visiva**: la scelta tra evoluzione della DNA e direzione nuova la sviluppa
  il brief parallelo `..._to_ui-designer-direzione.md`. Qui ragiona per strutture e
  stati, in modo che valgano con entrambe.
- **Anti-SaaS**: l'app è un atlante o una rivista viva, non un pannello di controllo.
- **Invariati**: consenso per la mappa, budget del bundle, file ad alto rischio fuori
  scope, nessun segreto, nessun numero inventato, testo pubblico in italiano.

## Ipotesi di lavoro (raccomandazioni dell'orchestratore, da confermare dall'owner prima della sintesi R2)

- "Webapp" significa: un guscio persistente con navigazione a schede, una home a schermo
  unico e «I miei posti» salvati senza account e leggibili offline. L'installabilità
  (PWA) è una conseguenza, non l'obiettivo. Nessun login obbligatorio.
- Si lancia con i 79 posti visibili (più il primo lotto di 21 reel della spec), con una
  struttura pensata per 533 e oltre. Il corpus può comparire come **tracce** (reel
  geolocalizzati senza pagina propria), distinte dai **posti** (scheda, URL, cover
  certificata).
- Privacy: deny-list della spec; i luoghi ricorrenti vicino a casa si mostrano a livello
  di città; il post della nascita non compare mai.
- Metrica primaria: iscrizioni email nate nell'app.

Se una tua idea funziona solo con un'ipotesi diversa, dillo esplicitamente.

## Context the receiver needs

**Fatti verificati** (usa solo questi; tutto il resto va marcato `[VERIFY: ...]`):

Base e corpus
- Base = ramo del PR #27, commit 4fe1794, checkout in sola lettura:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  `/home/user/TRAVELLINIWITHUS` è `main`, fermo all'11 agosto: non è la base.
- Corpus: 1.283 post (dal 25 lug 2021 al 13 ago 2026: 1.192 reel, 84 caroselli, 6 foto)
  in `BEST/src/data/instagram-corpus.json` (~1,5 MB, fuori dal bundle: nel client serve
  un indice leggero e statico); 624 luoghi in `BEST/src/data/corpus-places.json`
  (108 KB): 463 Italia, 31 Spagna, 17 UK, 15 Emirati, 11 Francia, 10 Egitto; 120 solo
  città o regione. 1.017 reel citano un luogo; circa 186 milioni di visualizzazioni
  sommate.
- Sul sito: 79 schede posto visibili su 110 nel registro. La scheda del PR #27 ne regge
  533. L'import del corpus **non è fatto** (spec da-approvare:
  `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`).

Già costruito nel PR #27
- Mappa: raggruppamento per zoom, culling, tetto di 60 marcatori. MapLibre è caricata
  solo dentro `FullScreenMapExperience`: una mini-mappa in un pannello è un costo a
  parte. Tessere OpenFreeMap solo con il consenso marketing; senza, `/mappa` è un muro
  scuro con «Attiva la mappa» (screenshot 04).
- Scheda posto: «Il Timbro» (verdetto), «Cosa sapere prima», `checked` (fonte e data),
  `visitedAt`, bollo «Esiste davvero?». 10 blocchi editoriali negli articoli.
- Ricerca `SearchModal` (Fuse.js) sui 79 posti.
- Edizioni Viaggiatori, Family e Collaborazioni: commutatore in testata, fondi diversi
  (`#faf8f4`, `#eef6fb`, `#f6f4ef`), scelta salvata in localStorage
  `travellini_audience`. **Il sito apre con una modale bloccante (AudienceGate)** prima
  di qualsiasi contenuto; è accessibile da tastiera e la misurazione GA4 è in corso
  (`BEST/docs/30_Design/UI_UX_ROADMAP_2026-08-02.md`, R5).
- «I miei posti» = `/preferiti` (privata): **posti e articoli sono mescolati nello stesso
  array**.
- Reel: copertina 9:16 poster-first, il tap apre Instagram; con una spunta si usa
  `<video preload="none">` in pagina, mai autoplay. Niente embed Instagram. 84 cover
  reali in `public/images/reels/`; i video in produzione arriverebbero da
  `VITE_VIDEO_BASE_URL` [VERIFY].

PWA (stato reale, da `BEST/vite.config.ts`, `index.html`, `public/`)
- `vite-plugin-pwa`, `registerType: autoUpdate`, `clientsClaim` + `skipWaiting`.
- Manifest: description «Travel blog di Rodrigo & Betta», `theme_color #ffffff` (mentre
  `index.html` usa `#faf8f4`, riscritto per edizione), `display: standalone`, icone 192
  e 512. Non dichiarati: start_url, scope, shortcuts, screenshots [VERIFY: default del
  plugin].
- Precache della build senza video, senza chunk della mappa e senza varianti
  responsive; `navigateFallback: /index.html`; `offline.html` esiste ma non è servita
  come fallback.
- Nel codice non c'è nessuna UX d'installazione (nessun `beforeinstallprompt` né
  `display-mode`).

SEO e rotte
- `scripts/generate-route-html.js` scrive a build `dist/posto/<id>/index.html` con
  title, description, OG e JSON-LD per i posti reali. `server.ts` inietta i meta di rotte
  statiche, articoli e prodotti. Il corpo della pagina sembra non prerenderizzato
  [VERIFY].
- Rotte esistenti in `server.ts` (`ALL_STATIC_APP_ROUTES`): `/`, `/esplora`, `/mappa`,
  `/preferiti`, `/destinazione`, `/itinerari` e altre. Una rotta top-level nuova richiede
  una modifica a `server.ts` (alto rischio: solo travellini-backend-engineer, con
  conferma owner).

Vincoli
- Budget `initial-js`: 776 KB su 780. **Un guscio o una barra a schede persistente sta
  per forza nel bundle iniziale**: va pagato sostituendo Navbar e Footer attuali, non
  aggiungendo. Tutte le viste pesanti vanno in chunk lazy.
- CI: Lighthouse con a11y ≥ 0,95 e CLS ≤ 0,1 bloccanti; e2e.

**Da leggere (solo questo):**
- gli screenshot in `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`;
- `BEST/src/config/surfaces.ts`, `BEST/src/App.tsx` (struttura delle rotte);
- AudienceGate, SearchModal, il contesto dei preferiti e `FullScreenMapExperience`,
  cercati con Grep;
- `BEST/docs/30_Design/UI_UX_ROADMAP_2026-08-02.md` (sezione R5);
- il fact pack, se è pronto:
  `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`.

## What the receiver should produce

1. **Mappa dell'app**:
   - le schede (al massimo 5 nella barra mobile) e la gerarchia;
   - cosa vive nel guscio persistente e cosa è un livello di contenuto;
   - come si comportano le edizioni: una lente sulla stessa app o una scheda a sé;
   - il destino delle 6 voci del riferimento dell'owner (Esplora, Mappa, Reel,
     Itinerari, Noi&Family, Collaborazioni) e delle tab Luoghi/Esperienze/Reel.
2. **I tre ingressi**, e per ognuno il primo schermo, cosa resta persistente, il
   comportamento del tasto indietro e dei gesti, lo stato nell'URL:
   - (a) home, o icona dell'app installata;
   - (b) Google su `/posto/<slug>` o `/articolo/<slug>`: come si entra nell'app da lì e
     come si torna;
   - (c) link da un reel dentro il browser integrato di Instagram [VERIFY:
     comportamento di storage e installazione nel webview di Instagram su iOS e
     Android].
3. **Primo minuto e onboarding minimo**: cosa diventa l'AudienceGate bloccante (tieni,
   trasforma o elimina, con il motivo) e come l'app sceglie l'edizione senza bloccare
   il contenuto.
4. **Il ritorno**:
   - cosa mostra l'app alla seconda e alla terza visita, senza account;
   - «I miei posti» con posti e articoli separati;
   - cosa resta leggibile offline;
   - quando e come proporre l'installazione (mai alla prima visita), con le differenze
     iOS/Android [VERIFY].
5. **Posti e tracce** (ipotesi): come l'interfaccia distingue un posto certificato (con
   scheda e URL) da una traccia del corpus (reel geolocalizzato senza pagina propria), e
   come una traccia "diventa" un posto.
6. **Stati**: vuoto, caricamento, offline, mappa senza consenso, errore, salvato,
   reduced motion, tastiera e ⌘K, ritorno del focus.
7. **La risposta alla domanda 2**: l'elemento che, se tolto, rende l'app generica.
8. Le tue idee nel **formato scheda idea** (qui sotto).

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

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-architettura_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Codice e `src/`. `BEST/` è in sola lettura. Nessun file ad alto rischio: se una
  soluzione richiede una rotta nuova, segnalala come "richiede `server.ts`".
- Direzione visiva, palette e font (brief parallelo).
- Motivazioni di business e metriche (growth).
- Copy definitivo (seo).
- **Vietato proporre**:
  - globo 3D che ruota;
  - swipe stile Tinder;
  - badge, punti o gamification;
  - chatbot o pianificatore AI;
  - feed infinito "per te";
  - contatori a badge da dashboard;
  - login obbligatorio per salvare;
  - notifiche push al primo accesso;
  - una barra in basso con più di 5 voci.

## Open questions / decisions for the user

- Nessuna nuova. Le quattro domande all'owner sono nel piano dell'orchestratore;
  lavora sulle ipotesi indicate sopra.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2), poi travellini-code-architect
  (verifica di fattibilità dell'architettura, R3).
- Trigger: il tuo file di uscita esiste con i punti 1-8.

## Notes

- Una barra a schede su mobile convive male con il banner del consenso e con la barra
  di sistema di iOS: tienine conto nello stato del primo accesso.
- Oggi il tetto di 60 marcatori sulla mappa è una conquista di performance (22 contro
  109). Non progettare viste che la annullano.
