---
type: project
area: product
status: active
priority: p1
owner: team
repo: TRAVELLINIWITHUS
canonical_repo: https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS
tags:
  - project
  - product
  - delivery
---

# PROJECT_TRAVELLINIWITHUS_SITE

## Missione

Portare il sito Travelliniwithus verso una V1 pubblicabile con funnel reali, brand coerente e operativita stabile.

## Repository canonico

Decisione operativa: `skotynyanskiy-create/TRAVELLINIWITHUS` e il repository ufficiale e unico da usare per Travelliniwithus.

- codice sito, funnel e homepage vivono qui
- `docs/` e il vault Obsidian operativo ufficiale
- lavoro da secondo PC: clonare questo repo, aprire `docs/` in Obsidian, eseguire `npm install`
- repo duplicati o esperimenti vanno archiviati o rimossi dopo verifica, per evitare confusione
- nuove modifiche devono partire da branch di questo repo e rientrare con commit/PR

## Setup secondo PC

```bash
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install
npm run dev
```

Aprire Obsidian su:

```txt
docs/
```

## Note madri

- [[TRAVELLINIWITHUS_MASTER_PLAN]]
- [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- [[QUICK_START]]
- [[DEPLOYMENT_RUNBOOK]]
- [[MARKETING_OPERATIONS_HUB]]
- [[BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS]]

## Workstreams

- brand e messaging
- stabilita tecnica
- funnel e monetizzazione
- QA e rilascio
- rebuild authority-premium

## Checklist V1 rebuild forte

- [ ] Contenuti reali minimi: almeno 1 pillar Puglia pubblicabile, 2 supporting article validati, 1 hotel reale con asset e disclosure.
- [ ] Asset reali minimi: hero home approvata, foto coppia approvata, cover Puglia e cover prodotto non stock o dichiarate come provvisorie.
- [ ] Shop state: `Guida Premium Puglia Slow` resta bozza finche non esistono prezzo finale, PDF, downloadUrl, termini vendita e checkout testato.
- [ ] B2B proof verificata: loghi, metriche, testimonianze e case study restano nascosti finche non hanno fonte e data.
- [ ] SEO/indexability: sitemap senza filtri query; solo contenuti pubblicati e acquistabili entrano in sitemap/schema.
- [ ] Lead form testati: newsletter, contatti e media kit con salvataggio Firestore verificato.
- [ ] Demo guardrail: demo attivi solo in dev/admin preview o noindex dichiarato, mai come proof reale.

## Snapshot 2026-04-27 - V1 rebuild forte

- Cluster di lancio scelto: Puglia / Italia.
- Primo prodotto pianificato: `Guida Premium Puglia Slow`, PDF digitale, bozza non acquistabile.
- Navigazione pubblica semplificata in italiano e senza `Shop` prematuro.
- Home orientata a scoperta B2C, metodo Travellini e conversione B2B separata.
- Collaborazioni e media kit declassano i dati non verificati: meglio meno proof, ma credibile.

## Snapshot 2026-04-27 - predisposizioni senza contenuti reali

- Nessun nuovo contenuto reale viene pubblicato in questa fase.
- I draft Puglia/prodotto restano infrastruttura e traccia interna finche owner non valida dati, foto, prezzo, PDF e claim.
- Admin prodotti ora impedisce il publish se mancano slug valido, prezzo maggiore di zero o download digitale per prodotti digitali.
- `npm run check:v1` controlla regressioni su sitemap con query param, shop indicizzabile, loghi partner fallback, recensioni demo e media kit con numeri non verificati.
- `npm run predeploy` include `check:v1`, quindi il gate V1 diventa parte della procedura standard prima del deploy.

## Snapshot 2026-04-14

- rifinite le superfici chiave di brand e conversione: `Home`, `Collaborazioni`, `Media Kit`, `Chi Siamo`
- direzione confermata: premium caldo, bilanciato tra B2C e B2B, con piu enfasi su fiducia e chiarezza
- `Collaborazioni` ora filtra meglio i lead e spinge `Media Kit` come ingresso principale
- `Media Kit` ora si presenta come porta di accesso qualificata, non come download generico
- `Home` esplicita meglio i tre percorsi del sito: scoperta, strumenti, collaborazioni
- `Chi Siamo` sposta il focus dal racconto biografico al metodo editoriale e ai criteri di fiducia
- normalizzati i default CMS in `siteContent` per evitare divergenza tra copy pubblica e contenuti admin-editable
- `Destinazioni` e `Esperienze` sono entrate nel blocco discovery/SEO V1: meno archivio tecnico, piu sistema editoriale per luogo e intenzione di viaggio
- introdotto il sistema V1.1 di sezioni condivise: newsletter unica, CTA finale riutilizzabile, notice per preview controllate
- `Guide` e `Articolo` sono stati rifiniti come superfici editoriali centrali, con contenuti preview centralizzati e noindex quando non pubblicabili
- `Risorse` e `Shop` sono stati riposizionati verso monetizzazione sobria: toolkit editoriale e boutique di prodotti digitali, non pagina coupon/catalogo demo
- priorita successiva: QA visiva umana, roundtrip lead Firestore, sostituzione/approvazione contenuti preview e contenuti reali minimi prima del deploy pubblico

## Snapshot 2026-04-23 - master rebuild formalizzato

- creati i documenti madre [[TRAVELLINIWITHUS_MASTER_PLAN]] e [[TRAVELLINIWITHUS_EXECUTION_PLAN]]
- aperto il progetto dedicato [[10_Projects/PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM]]
- direzione ufficiale: Salt in Our Hair + Along Dusty Roads, authority editoriale prima di tutto
- decisione tecnica provvisoria: nessun replatform come prima mossa; prima si correggono IA, page system, content model e design discipline

## Registro collegato

- [[20_Decisions/DECISION_0001_OBSIDIAN_VAULT_STRATEGY]]
- [[30_Meetings/MEETING_2026-04-12_obsidian_vault_upgrade]]
- [[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[10_Projects/PROJECT_SITE_REBUILD_AUTHORITY_PREMIUM]]
- [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[10_Projects/PROJECT_EDITORIAL_SYSTEM_V1_1]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[11_Campaigns/CAMPAIGN_SITE_POSITIONING_AND_CONVERSION]]
- [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
- [[13_Content/CONTENT_PILLARS_TRAVELLINIWITHUS]]
- [[50_Scratch/INBOX]]

## Snapshot 2026-04-24 - first implementation pass del piano completo

- chiuso il bug tecnico che bloccava `typecheck` nell'admin editoriale
- nav pubblica riallineata al modello target: `Esplora`, `Guide`, `Pianifica`, `Collaborazioni`, `Chi siamo`
- introdotto il layer `planning` in `siteContent` per governare copy e CTA del funnel pratico
- `Inizia da qui` diventa il punto di ingresso esplicito del funnel `Pianifica`
- `Dove dormire` evolve da archivio statico a sistema con dettaglio dedicato via `/dove-dormire/:slug`
- introdotto il modello dati hotel (`HotelEntry`) con fallback locale e supporto Firestore `hotels`
- gates verificati in questo pass: `typecheck`, `lint`, `build`
- stato qualitativo: `audit:ui` migliorato ma non ancora chiuso del tutto; restano 5 warning inline-style da decidere nel prossimo pass
