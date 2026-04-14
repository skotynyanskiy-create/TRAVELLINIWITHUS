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

## Registro collegato

- [[20_Decisions/DECISION_0001_OBSIDIAN_VAULT_STRATEGY]]
- [[30_Meetings/MEETING_2026-04-12_obsidian_vault_upgrade]]
- [[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[10_Projects/PROJECT_EDITORIAL_SYSTEM_V1_1]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[11_Campaigns/CAMPAIGN_SITE_POSITIONING_AND_CONVERSION]]
- [[12_Partnerships/PARTNER_PIPELINE_TRAVELLINIWITHUS]]
- [[13_Content/CONTENT_PILLARS_TRAVELLINIWITHUS]]
- [[50_Scratch/INBOX]]
