---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_ui-designer-direzione
status: consumed
created: 2026-09-29
from: travellini-orchestrator
to: travellini-ui-designer
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con ui-designer-architettura, growth, social, seo, asset-curator)
supersedes: docs/50_Scratch/HANDOFF_esplora-schermo-unico_orchestrator_to_ui-designer.md
---

# Handoff: direzione visiva della webapp — (A) evoluzione della DNA contro (B) direzione nuova

## Why this work matters

L'owner ha deciso che Travelliniwithus diventa una **webapp** con un'esperienza a
schermo unico al centro, e ha aggiunto: «se necessario partiamo da una nuova
direzione». È un **permesso condizionato, non un ordine**. Il tuo compito è decidere,
con evidenza e non per gusto, se la DNA attuale regge in un guscio app o se è nata per
la lettura lunga e lì si rompe. Da questo dipende tutto il resto del lavoro visivo.

## Le domande che devi risolvere (angolo divergente)

> **1. La DNA attuale è nata per la lettura lunga: serif grande, sabbia, molto spazio
> bianco. In un guscio a schermo unico su un telefono da 390 px, con una scheda aperta e
> una barra a schede, si rompe o regge? Dimostralo con il codice e con gli screenshot.**
>
> **2. Se partissi da zero per una webapp di Rodrigo e Betta, quale idea forte ti
> farebbe rinunciare a ciò che c'è già? Se non riesci a trovarne una che A non possa
> soddisfare, B perde, e va detto.**

Suggerimento per la domanda 1: nello screenshot 07 (scheda posto, mobile) guarda quanto
spazio verticale occupano testata, barra delle edizioni, breadcrumb e hero prima dell'H1.

## Decisions already made

- **Travelliniwithus diventa una webapp** (decisione owner, 2026-09-29). Non rimetterla in
  discussione e non proporre "modalità contro sostituto".
- **Articoli, guide e schede posto restano**: diventano livelli di contenuto dentro l'app,
  ognuno con la propria URL indicizzabile (`/posto/<slug>`, `/articolo/<slug>`,
  destinazioni).
- **Imagery truth: non negoziabile, vale anche per una direzione nuova.**
  Fonte: `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`.
  - Luoghi, persone ed esperienze: solo foto o fotogrammi reali, con un'etichetta di
    provenienza per ogni asset (`real-photo` / `real-frame` / `craft`), registrata in
    `BEST/src/data/asset-provenance.json` e controllata da `npm run audit:provenance`.
  - AI solo per asset `craft` non referenziali (carta, inchiostro, timbri, map wash,
    matte), approvati dall'owner uno per uno.
  - Gli asset `da-certificare` non si usano mai come prova su superfici nuove.
  - Mai testo di interfaccia dentro un'immagine (ASSET_STRATEGY §6).
  - Del riferimento visivo dell'owner (un guscio app con immagini generate) si prende
    l'idea di interazione, mai le immagini.
- **Criterio A/B**: B vince solo con una ragione che A non può soddisfare. Se proponi di
  cambiare font o palette, presentalo come proposta motivata, non come fatto compiuto.
  Le regole anti-drift del CLAUDE.md restano: niente skill di design anti-DNA.
- **Anti-SaaS**: l'app deve sembrare un atlante o una rivista viva, mai un pannello di
  controllo.
- **Invariati**: consenso per la mappa, budget del bundle, file ad alto rischio fuori
  scope, nessun segreto, nessun numero inventato, testo pubblico in italiano.

## Ipotesi di lavoro (raccomandazioni dell'orchestratore, da confermare dall'owner prima della sintesi R2)

- "Webapp" significa: un guscio persistente con navigazione a schede, una home a schermo
  unico e «I miei posti» salvati senza account e leggibili offline. L'installabilità
  (PWA) è una conseguenza, non l'obiettivo. Nessun login obbligatorio.
- Si lancia con i 79 posti visibili (più il primo lotto di 21 reel della spec), ma la
  struttura è progettata per 533 e oltre. Il corpus può comparire come **tracce** (reel
  geolocalizzati senza pagina propria), distinte dai **posti** (scheda, URL, cover
  certificata).
- Privacy: deny-list della spec; i luoghi ricorrenti vicino a casa si mostrano a livello
  di città; il post della nascita non compare mai.
- Metrica primaria: iscrizioni email nate nell'app.

Se una tua idea funziona solo con un'ipotesi diversa, dillo esplicitamente.

## Context the receiver needs

**Fatti verificati** (usa solo questi; tutto il resto va marcato `[VERIFY: ...]`):

Base e corpus
- Base di codice = ramo del PR #27, commit 4fe1794, checkout in sola lettura:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  Il repo `/home/user/TRAVELLINIWITHUS` è `main` fermo all'11 agosto: non è la base.
- 1.283 post Instagram (dal 25 lug 2021 al 13 ago 2026: 1.192 reel, 84 caroselli, 6 foto)
  in `BEST/src/data/instagram-corpus.json` (~1,5 MB, fuori dal bundle client).
- 624 luoghi geocodificati in `BEST/src/data/corpus-places.json` (108 KB): 463 Italia,
  31 Spagna, 17 UK, 15 Emirati, 11 Francia, 10 Egitto; 120 solo città o regione.
- 1.017 reel citano un luogo; circa 186 milioni di visualizzazioni sommate.
- Squilibrio geografico (spec corpus): Lombardia 147, Veneto 62, Emilia-Romagna 48;
  Puglia 1, Sicilia 2; Sardegna, Marche, Friuli Venezia Giulia, Molise e Basilicata a
  zero.
- Sul sito: 79 schede posto visibili su 110 nel registro. La scheda del PR #27 ne regge
  533. L'import del corpus in schede **non è fatto** (spec
  `BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md`, status
  da-approvare).

Già costruito nel PR #27
- Mappa: raggruppamento per zoom, culling, tetto di 60 marcatori (22 invece di 109;
  603 nodi DOM invece di 2.476). MapLibre è caricata solo dentro
  `FullScreenMapExperience`: una mini-mappa in un pannello è un costo a parte. Le
  tessere OpenFreeMap partono solo con il consenso marketing; senza, `/mappa` è un muro
  scuro con «Attiva la mappa» (screenshot 04).
- Scheda posto: verdetto «Il Timbro», «Cosa sapere prima», campi `checked` (fonte e
  data) e `visitedAt`, bollo «Esiste davvero?».
- Ricerca (`SearchModal`, Fuse.js) sui 79 posti.
- Commutatore "edizione" (Viaggiatori, Family, Collaborazioni) con fondi diversi: sabbia
  `#faf8f4`, azzurro `#eef6fb`, avorio `#f6f4ef`, salvati in localStorage.
- All'ingresso il sito apre una modale bloccante (AudienceGate) per scegliere
  l'edizione; la misurazione è in corso.
- Home: «Posti che sembrano inventati. Ma esistono davvero.»
- «I miei posti» è `/preferiti`; posti e articoli stanno nello stesso array.
- Media: 84 cover reali in `public/images/reels/`; `reels.ts` ha 67 voci con video in
  `/video/*.mp4`, ma `public/video/` è vuota nel checkout; in produzione i video
  arriverebbero da `VITE_VIDEO_BASE_URL` [VERIFY]. Il reel si mostra come copertina
  9:16 poster-first e il tap apre Instagram; l'embed di Instagram è escluso.

PWA (stato reale)
- Base installabile "da blog": manifest (description «Travel blog di Rodrigo & Betta»,
  `theme_color #ffffff` diverso dal `#faf8f4` di `index.html`, `display: standalone`,
  icone 192 e 512), service worker Workbox con aggiornamento automatico, nessun
  contenuto offline, nessuna UX d'installazione.

Vincoli tecnici
- Budget `initial-js`: 776 KB su 780. Tutte le viste nuove vanno in chunk lazy. Un
  guscio o una barra persistente su ogni rotta sta per forza nel bundle iniziale: va
  pagato sostituendo qualcosa (per esempio Navbar e Footer), non aggiungendo.
- CI: Lighthouse con a11y ≥ 0,95 e CLS ≤ 0,1 bloccanti; e2e; gitleaks.
- Una rotta top-level nuova richiede di modificare `server.ts` (alto rischio). `/`,
  `/esplora`, `/mappa` e `/preferiti` esistono già.

**Materiale da leggere (solo questo):**
- Screenshot: `/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`
  (01-03 home, 04 mappa, 05 esplora, 06-07 scheda posto, 08-12 articoli).
- `BEST/DESIGN.md` e i token in `BEST/src/index.css`.
- **Precedenti in `BEST/design-lab/`**: `index.html`, `direzione-a-rivista-viva.html`,
  `direzione-b-atlante-di-coppia.html`, `direzione-c-album-cinematico.html`, con il
  dossier `BEST/docs/30_Design/DIREZIONI_CREATIVE_ELEVAZIONE_2026-07.md`. Tutte e tre
  stanno dentro la DNA, non usano librerie nuove e sono state pensate per lo scroll, su
  29 posti. I gate owner sono rimasti aperti: base scura `#d1c6b7`; `--trace-red
  #bd3f23` contro `#c2410c`; font manoscritto; `rough-notation`; estrazione dei frame. In
  `docs/20_Decisions/` non c'è nessuna decisione di scelta [VERIFY].
- Fact pack del corpus, se è già pronto:
  `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`.

## What the receiver should produce

1. **Stress test della DNA nel formato app**: dove regge e dove si rompe (tipografia,
   densità, spazio verticale, contrasto sui fotogrammi reali, fondi per edizione),
   ogni punto con evidenza (file:riga dei token o numero dello screenshot).
2. **Percorso A: evoluzione.** Tesi in una frase; il primo schermo su desktop 1440×900
   e su mobile 390×844 (wireframe ASCII o griglia descritta); cosa guadagna e cosa
   perde; quali token cambierebbero, se ne cambia qualcuno.
3. **Percorso B: direzione nuova.** Stessi campi, più l'idea forte che la giustifica e
   il motivo preciso per cui A non può raggiungerla. Font e palette nuovi solo come
   proposta motivata.
4. **Precedenti del design-lab**: per A «Rivista Viva», B «Atlante di Coppia» e C «Album
   Cinematico», cosa si riprende e cosa no in un'app a schermo unico, e perché.
5. **Criteri di confronto A/B** da applicare ai prototipi, non alle descrizioni.
   L'orchestratore li bloccherà in R2. Parti da questa bozza e correggila:
   - leggibilità a 390 px (H1, nome del posto e CTA visibili senza scroll; testo di
     almeno 16 px; contrasto AA);
   - densità: quanti posti o reel reali si percepiscono senza sembrare una dashboard;
   - riconoscibilità senza logo;
   - tenuta con fotogrammi imperfetti (titolo impresso, poca luce);
   - costo tecnico (font e librerie nuove, token, impatto sulle pagine esistenti);
   - coerenza tra guscio e livelli di lettura (`/posto`, `/articolo`);
   - stato della mappa senza consenso;
   - motion e reduced motion.
6. **Spec del prototipo**: lo stesso UNICO schermo per A e per B, cioè il primo schermo
   dell'app con un posto reale aperto. Indica:
   - quale posto usare: uno con cover `real-frame` certificata nel registro;
   - altre 5 cover reali, di cui 2 imperfette (titolo impresso, poca luce);
   - lo stato della mappa;
   - i testi provvisori in italiano;
   - le dimensioni 390×844 e 1440×900.
   Deve essere abbastanza precisa perché travellini-frontend-builder la costruisca in
   HTML statico senza prendere decisioni di design.
7. **Raccomandazione A o B**, con il grado di fiducia e cosa ti farebbe cambiare idea.
8. **Kill list** di ciò che, del riferimento dell'owner o dei precedenti, porta verso
   SaaS o cliché da app di viaggio.
9. Le tue idee nel **formato scheda idea** (qui sotto).

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

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_ui-designer-direzione_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Codice e `src/`. `BEST/` è in sola lettura. Nessun file ad alto rischio.
- L'architettura dell'informazione (schede, primo minuto, ritorno, ingressi): la copre il
  brief parallelo `..._to_ui-designer-architettura.md`. Qui solo linguaggio visivo e
  primo schermo.
- Copy italiano definitivo: le etichette sono provvisorie. Il lessico lo propone
  travellini-seo-conversion-strategist.
- Generare immagini, anche solo per un mockup.
- **Vietato proporre**:
  - globo 3D che ruota;
  - swipe stile Tinder;
  - badge, punti o gamification;
  - chatbot o pianificatore AI;
  - feed infinito "per te";
  - contatori a badge da dashboard;
  - glassmorphism, gradient blob, dark mode neon;
  - una barra in basso con più di 5 voci.

## Open questions / decisions for the user

- La scelta tra A e B spetta all'owner, al gate R4 e con i prototipi affiancati. Non va
  chiesta adesso.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2). Poi travellini-frontend-builder
  costruisce i due prototipi statici dalla tua spec (R3) e browser-auditor li fotografa
  affiancati.
- Trigger: il tuo file di uscita esiste con i punti 1-9.

## Notes

- Molte cover dei reel hanno un titolo impresso (per esempio «Campigna» e «Somma
  Vesuviana (NA)» negli screenshot 05 e 06). Una direzione che funziona solo con foto
  perfette non regge.
- Il linguaggio corrente è quello di "Atlante delle Meraviglie Vere" (redesign approvato
  il 2026-07-22) e de "Il montaggio delle tracce" (home). Tienilo come termine di
  paragone per A.
