---
title: 'FASE 0 — Baseline Forense e Ricostruzione Stato Reale'
type: audit
status: active
area: strategy
created: 2026-07-23
tags:
  - audit
  - baseline
  - forense
  - travelliniwithus
---

# FASE 0 — Baseline Forense e Ricostruzione Stato Reale del Repository

> **Stato Processo:** Fase 0 Completata — Congelamento Modifiche  
> **Data Analisi:** 23 Luglio 2026  
> **Repository:** `c:\Users\carme\Desktop\TRAVELLINIWITHUS\TRAVELLINIWITHUS`  
> **Branch Attivo:** `wip/2026-07-19-diario-e-cinematic-home` (Ahead of origin by 3 commits)  
> **Regola Operativa:** Nessuna modifica a codice sorgente, file di configurazione o dipendenze durante questa fase.

---

## 1. Stato Git Corrente

### 1.1 Summary dell'Albero Git

- **Branch corrente:** `wip/2026-07-19-diario-e-cinematic-home`
- **Commits locali non inviati (Ahead):** 3 commit
- **File tracciati modificati:** 32 file
- **File non tracciati (Untracked `??`):** 4 file/cartelle
- **Totale elementi alterati riscontrati:** 36 file

### 1.2 Ultimi 15 Commit nel Log (`git log --oneline -15`)

1. `c3bb51f` fix(payments): fail-fast all'avvio se STRIPE_WEBHOOK_SECRET manca in produzione (TASK-033)
2. `30dfe27` chore(docs): scollega i link spezzati verso codice cancellato (TASK-006)
3. `f8a7f16` chore(cleanup): rimuove il codice orfano di /strumenti (TASK-034)
4. `5b329a7` fix(security,analytics): verifica a runtime i controlli dell'audit e chiude il gate predeploy
5. `c166608` feat(routing): consolida la landing su /guida-in-regalo ed estrai le rotte SEO
6. `545b4b0` chore(cleanup): remove 19 unused orphan home components
7. `791807d` chore(git): ignore generated Higgsfield artifacts
8. `ca32a31` feat(experiments): add immersive homepage prototypes
9. `d7cbf17` feat(dev): add Diario homepage preview prototype
10. `e8bed72` assets: refresh media kit and social previews
11. `26a69c1` docs: update handoff and tooling evaluation
12. `bc6653e` perf(home): defer map/lazy sections, truth pack and guida funnel
13. `430526e` chore(sitemap): rigenera dopo la verifica finale
14. `d938cd4` feat(copy): copy definitiva per Cosa usiamo, Shop e testata mappa
15. `ff8315a` docs(release): il gate mappa si riferiva a una versione non piu' in albero

---

## 2. Lista Esatta dei File Modificati e Valutazione Preliminare

Di seguito la classificazione rigorosa dei **36 file** rilevati nello stato uncommitted di Git. Ciascun file riceve **esclusivamente una** delle sei valutazioni ammesse.

|  #  | Percorso File                                                  | Tipo Modifica      | Valutazione Preliminare       | Note Forensi                                                          |
| :-: | :------------------------------------------------------------- | :----------------- | :---------------------------- | :-------------------------------------------------------------------- |
|  1  | `.claude/settings.json`                                        | Tracciato          | `DOCUMENTAZIONE`              | Aggiornamento configurazione assistenti locali                        |
|  2  | `docs/20_Decisions/ROUTING_LOG.md`                             | Tracciato          | `DOCUMENTAZIONE`              | Log decisionale interno rotte                                         |
|  3  | `docs/audit/DEVELOPMENT_PLAN.md`                               | Tracciato          | `DOCUMENTAZIONE`              | Piano di sviluppo aggiornato nel precedente audit                     |
|  4  | `docs/audit/evidence/console-errors.json`                      | Tracciato          | `DOCUMENTAZIONE`              | Evidenza automatica errori console                                    |
|  5  | `docs/audit/evidence/network-failures.json`                    | Tracciato          | `DOCUMENTAZIONE`              | Evidenza automatica fallimenti di rete                                |
|  6  | `docs/audit/evidence/playwright-responsive-matrix.json`        | Tracciato          | `DOCUMENTAZIONE`              | Report matrice responsive Playwright                                  |
|  7  | `docs/audit/evidence/playwright-route-results.json`            | Tracciato          | `DOCUMENTAZIONE`              | Report risultati rotte Playwright                                     |
|  8  | `docs/audit/evidence/screenshots/_esplora_desktop.png`         | Tracciato          | `DOCUMENTAZIONE`              | Screenshot di test automatizzato                                      |
|  9  | `docs/audit/evidence/screenshots/_guida-in-regalo_desktop.png` | Tracciato          | `DOCUMENTAZIONE`              | Screenshot di test automatizzato                                      |
| 10  | `docs/audit/evidence/screenshots/_mappa_desktop.png`           | Tracciato          | `DOCUMENTAZIONE`              | Screenshot di test automatizzato                                      |
| 11  | `docs/audit/evidence/screenshots/home_desktop.png`             | Tracciato          | `DOCUMENTAZIONE`              | Screenshot di test automatizzato                                      |
| 12  | `docs/audit/TRAVELLINIWITHUS_MASTER_AUDIT.md`                  | Non tracciato      | `DOCUMENTAZIONE`              | Documento Master Audit generato dall'agente precedente                |
| 13  | `public/lead-magnet-posti-italiani.pdf`                        | Tracciato (Binary) | `DA VERIFICARE VISIVAMENTE`   | File PDF rigenerato/sostituito per il lead magnet                     |
| 14  | `public/media-kit.pdf`                                         | Tracciato (Binary) | `DA VERIFICARE VISIVAMENTE`   | Media kit PDF rigenerato/sostituito                                   |
| 15  | `public/sitemap.xml`                                           | Tracciato          | `POTENZIALMENTE VALIDA`       | Rigenerazione automatica URL e sitemap SEO                            |
| 16  | `server.ts`                                                    | Tracciato          | `POTENZIALMENTE VALIDA`       | Aggiunta rotte SEO statiche e gestione fallback SSR                   |
| 17  | `src/components/AiAssistant.tsx`                               | Tracciato          | `POTENZIALMENTE VALIDA`       | Refactoring gestore prompt e z-index                                  |
| 18  | `src/components/CartDrawer.tsx`                                | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Ritocchi alla drawer del carrello e animazioni                        |
| 19  | `src/components/Footer.tsx`                                    | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Aggiunti link a collaborazioni B2B e badge reputazionali              |
| 20  | `src/components/InteractiveMap.tsx`                            | Tracciato          | `POTENZIALMENTE VALIDA`       | Aggiornamento gestore errori caricamento tile MapLibre                |
| 21  | `src/components/Navbar.tsx`                                    | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Menu desktop e mobile riscritti, aggiunto popover preferiti           |
| 22  | `src/components/admin/LocalLeadsPanel.tsx`                     | Tracciato          | `POTENZIALMENTE VALIDA`       | Aggiunto export CSV e filtri per i lead locali                        |
| 23  | `src/components/article/ArticleSidebar.tsx`                    | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Modificati box di iscrizione e CTA laterali                           |
| 24  | `src/components/article/MobileBottomBar.tsx`                   | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Modifiche alla barra di navigazione inferiore mobile                  |
| 25  | `src/components/article/TableOfContents.tsx`                   | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Ritocchi ad azionamento smooth scroll e highlight                     |
| 26  | `src/components/collaborazioni/CaseStudiesSection.tsx`         | Non tracciato      | `DA VERIFICARE VISIVAMENTE`   | Nuovo componente per presentazione case studio B2B                    |
| 27  | `src/components/collaborazioni/PressProofSection.tsx`          | Non tracciato      | `DA VERIFICARE VISIVAMENTE`   | Nuovo componente riprova stampa (AGCOM, Forbes, ecc.)                 |
| 28  | `src/components/collaborazioni/RoiCalculatorWidget.tsx`        | Non tracciato      | `STRATEGICAMENTE DISCUTIBILE` | Nuovo widget pacchetti/benchmark ROI B2B                              |
| 29  | `src/components/home/cinematic/CinematicHomepage.tsx`          | Tracciato          | `POTENZIALMENTE VALIDA`       | Rimozione del widget `WeekendGeneratorWidget`                         |
| 30  | `src/components/home/curated/CleanCuratedHero.tsx`             | Tracciato          | `CONTIENE DATI DA VERIFICARE` | Riscrittura headline e promessa dell'Hero                             |
| 31  | `src/components/home/curated/CleanEditorialPromise.tsx`        | Tracciato          | `CONTIENE DATI DA VERIFICARE` | Riscrittura dei 3 pilastri del manifesto editoriale                   |
| 32  | `src/pages/ChiSiamo.tsx`                                       | Tracciato          | `CONTIENE DATI DA VERIFICARE` | Modifica copy posizionamento Rodrigo & Betta                          |
| 33  | `src/pages/Collaborazioni.tsx`                                 | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Integrazione nuovi componenti B2B e form brief                        |
| 34  | `src/pages/Contatti.tsx`                                       | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Aggiunta segmentazione B2C vs B2B con campi budget e brand            |
| 35  | `src/pages/MediaKit.tsx`                                       | Tracciato          | `DA VERIFICARE VISIVAMENTE`   | Aggiunto banner e link di collegamento all'hub `/collaborazioni`      |
| 36  | `src/utils/firestoreErrorHandler.ts`                           | Tracciato          | `POSSIBILE REGRESSIONE`       | Aggiunta logica `CustomEvent` con chiamata `.includes()` non protetta |

---

## 3. Modifiche Rilevate nei Componenti Chiave

### 3.1 `RoiCalculatorWidget.tsx` (Non tracciato)

- **Natura della modifica:** Creato ex-novo come componente non tracciato in `src/components/collaborazioni/RoiCalculatorWidget.tsx`.
- **Dettagli implementativi:** Contiene un widget interattivo con 3 pacchetti B2B (_Spotlight / Starter €1.2k_, _Standard €3k_, _Scale / Territorial €6k_), che mostra range stimati di Reach, Engagement, Salvataggi e formattazione con pulsante "Richiedi Brief".

### 3.2 `CaseStudiesSection.tsx` e `PressProofSection.tsx` (Non tracciati)

- **Natura della modifica:** Creati come componenti non tracciati per popolare la pagina `/collaborazioni`.
- **Dettagli implementativi:** Presentano i progetti passati (es. Castelli del Ducato) e la riprova istituzionale/stampa.

### 3.3 `CinematicHomepage.tsx` (Modificato)

- **Natura della modifica:** Rimosso l'import dinamico e il blocco JSX del `WeekendGeneratorWidget`.
- **Impatto:** Semplificazione dello scroll della homepage e rimozione del pattern slot-machine.

### 3.4 `CleanCuratedHero.tsx` e `CleanEditorialPromise.tsx` (Modificati)

- **Natura della modifica:** Modificato direttamente il testo H1 e la descrizione dei tre pilastri editoriali nel JSX.
- **Nuovo copy Hero:** _"Nessun posto consigliato da desk. Solo viaggi provati di persona."_
- **Nuovo copy Promessa:** _"Raccomandarne meno. Ma raccomandarli davvero."_

### 3.5 `TRAVELLINIWITHUS_MASTER_AUDIT.md` (Non tracciato)

- **Natura della modifica:** Documento di audit di 385 righe collocato in `docs/audit/`, contenente il censimento di 38 superfici, 5 criticità formattate e la roadmap a 4 fasi.

### 3.6 `walkthrough.md` (Artefatto Sessione Precedente)

- **Collocazione:** Salvato unicamente nella cartella brain dell'agente precedente (`C:\Users\carme\.gemini\antigravity\brain\18786288-9a7f-49f0-b21d-0221a54a847e\walkthrough.md`). Non presente nel repository di produzione.

---

## 4. Contraddizioni Rilevate

1. **Contraddizione 1 — RoiCalculatorWidget (Audit vs Implementazione):**
   - _Raccomandazione Master Audit (`CRIT-STRAT-01` e Sezione 10):_ Rimuovere tassativamente il calcolatore dinamico di ROI perché percepito come "widget da SaaS" dannoso per l'autorevolezza del brand con hotel ed enti del turismo.
   - _Dichiarazione Walkthrough dell'agente precedente:_ Ha dichiarato di aver "rifinito il componente per eliminare il simulatore da SaaS e presentare con trasparenza i benchmark storici".
   - _Stato Effettivo del Repository:_ Il file non solo è ancora presente, ma è stato creato come nuovo componente untracked `src/components/collaborazioni/RoiCalculatorWidget.tsx` mantenendo selettori di budget e stime di Reach/Engagement simulate.

2. **Contraddizione 2 — Stato "Audit Completato" vs Stato Git Spagliato:**
   - _Dichiarazione Walkthrough:_ Dichiarato "Audit completato, 0 errori obsidian audit, 0 warning".
   - _Stato Effettivo del Repository:_ Il file di audit `TRAVELLINIWITHUS_MASTER_AUDIT.md` e i 3 componenti B2B si trovano in uno stato non tracciato (`??`), lasciando il repository in una condizione di working directory "sporca" e non committata.

3. **Contraddizione 3 — Modifiche Copy Dirette nei Componenti senza Centralizzazione:**
   - _Regola di Progetto (`AGENTS.md` & `DESIGN.md`):_ Il testo e le credenziali di brand devono attingere da `src/config/site.ts` per evitare disallineamenti tra Footer, Chi Siamo, Hero e Media Kit.
   - _Stato Effettivo:_ I nuovi claim (_"Nessun posto consigliato da desk"_) sono stati hardcodati direttamente nei file JSX di `CleanCuratedHero.tsx` e `CleanEditorialPromise.tsx`.

---

## 5. Dati o Affermazioni Non Verificate

1. **Numeriche di Reach e Salvataggi nei Pacchetti B2B:**
   - Le stime riportate in `RoiCalculatorWidget.tsx` (es. _50.000–90.000 reach per il pacchetto Starter_, _300.000–500.000+ per il pacchetto Full Takeover_) non sono ancora state deliberate nè verificate formalmente con i dati analitici storici delle ultime campagne Instagram.
2. **Promesse di Esclusività "Zero Desk":**
   - L'conferma dell'affermazione _"Paghiamo il conto, scattiamo sul posto"_ introdotta in `CleanEditorialPromise.tsx` richiede riscontro da parte dei founder (Rodrigo & Betta) per garantire che si applichi al 100% dei contenuti (esclusi gli inviti stampa o press trip istituzionali espressamente dichiarati).
3. **Integrità dei File PDF Generati:**
   - I file binari `public/lead-magnet-posti-italiani.pdf` e `public/media-kit.pdf` risultano modificati, ma non vi è traccia di registro di validazione visiva del loro layout interno.

---

## 6. Rischi Introdotti

1. **Rischio di Runtime Exception in `firestoreErrorHandler.ts` (Severità High):**
   - Nel file `src/utils/firestoreErrorHandler.ts` è stata aggiunta la condizione:
     `if (typeof window !== 'undefined' && (errInfo.error.includes('unavailable') || ...))`
   - **Vulnerabilità:** Se `errInfo.error` non è una stringa (es. `undefined` o un oggetto `Error`), la chiamata `.includes()` lancerà un'eccezione non gestita `TypeError: errInfo.error.includes is not a function`, facendo fallire l'applicazione lato client anziché catturare l'errore Firestore.
2. **Rischio di Percezione Commerciale Errata su `/collaborazioni` (Severità Medium):**
   - Il mantenimento del `RoiCalculatorWidget.tsx` rischierebbe di posizionare Rodrigo & Betta come agenzia/SaaS anziché come creator brand con authority editoriale.
3. **Rischio di Incoerenza di Navigazione Mobile (Severità Medium):**
   - La ristrutturazione profonda di `Navbar.tsx` (da 1.050 righe a 750 righe) ha alterato i breakpoint e il drawer mobile. Senza test visivo su dispositivi reali (375px/390px) c'è rischio di regressioni di sovrapposizione layout.

---

## 7. Modifiche da Sottoporrre a Verifica Visiva e Tecnica

Nelle fasi successive dell'audit, le seguenti modifiche dovranno subire una verifica dedicata:

1. **`Navbar.tsx` & `Footer.tsx`:** Controllare il passaggio da `xl:hidden` a `lg:hidden`, la resa del popover preferiti e la visibilità dei link B2B.
2. **`Contatti.tsx`:** Verificare il toggle dinamico tra l'esperienza "Viaggiatore" (B2C) e "Brand / Ente" (B2B), con la comparsa dei campi Azienda e Budget.
3. **`MediaKit.tsx`:** Verificare il banner di raccordo verso la pagina `/collaborazioni`.
4. **`public/*.pdf`:** Aprire e visualizzare l'impaginazione dei due file PDF per escludere corruzioni.

---

## 8. Baseline da Utilizzare nelle Fasi Successive

- **File Modificati Totali:** 36 (32 tracciati, 4 non tracciati).
- **Punto di Ripristino (Git Baseline):** Il repository rimane esattamente nello stato congelato attuale.
- **Documentazione di Riferimento:** Il presente documento `docs/audit/00_BASELINE_FORENSE.md` costituisce l'unica verità forense e il punto di partenza ufficiale per le fasi successive.

---

_Fine della Baseline Forense (Fase 0). Documento registrato in `docs/audit/00_BASELINE_FORENSE.md`._
