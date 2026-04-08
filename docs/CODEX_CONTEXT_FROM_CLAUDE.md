# Import Da Claude Code A Codex

Questo file porta nel progetto il contenuto del piano Claude salvato in `C:\Users\ccocu\.claude\plans\serialized-twirling-moth.md`, cosi' puo' essere riusato come contesto operativo anche in Codex.

## Obiettivo

Tradurre il piano nato per Claude Code in un riferimento stabile per questo progetto, senza dipendere dalla cartella utente `.claude`.

## Contesto Progetto

- Brand travel italiano
- Frontend: React 19 + TypeScript + Vite
- UI: Tailwind CSS 4
- Backend: Express + Firebase Firestore
- Pagamenti: Stripe
- AI: Gemini
- Mappe: Mapbox
- Test: Vitest + Playwright
- Deploy: Google Cloud Run / AI Studio

## Punti Del Piano Claude Che Restano Utili Anche Qui

### 1. Istruzioni di progetto forti

Priorita' alta: mantenere istruzioni operative chiare e centralizzate per gli agenti che lavorano sul repository.

Raccomandazioni:
- riusare come fonte `.github/copilot-instructions.md`
- sintetizzare convenzioni reali del progetto
- includere stack, regole di editing, vincoli su Firebase, Stripe e contenuti editoriali

### 2. Workflow GitHub integrato

Utile se il repository viene gestito con PR, review e issue.

Benefici:
- review piu' rapide
- triage issue
- gestione branch e PR direttamente dall'agente

### 3. Skill mirate al progetto

Il piano originale scarta correttamente le skill generiche Next.js. Per questo progetto hanno senso skill mirate a:

- audit UI e accessibilita'
- verifiche Firebase / Firestore
- controllo checkout Stripe
- scaffold nuove pagine React + routing + SEO
- predeploy check

### 4. Guardrail di sicurezza e qualita'

Restano validi:
- blocco di comandi distruttivi
- attenzione speciale su `.env`
- attenzione speciale su `firestore.rules`
- attenzione speciale su configurazioni admin
- typecheck e lint dopo modifiche rilevanti

## Cose Da Non Portare Pari Pari

- agenti o skill Next.js
- pack enormi e generici di skill
- integrazioni WordPress
- MCP di terze parti non necessari

## Backlog Proposto

### Fase 1

- creare un file di istruzioni progetto leggibile dagli agenti
- consolidare le convenzioni gia' presenti nel repository

### Fase 2

- definire skill operative piccole e specifiche
- standardizzare i check prima del deploy

### Fase 3

- aggiungere guardrail su file e comandi sensibili
- automatizzare i controlli minimi post-edit

## Nota Operativa

Codex non importa automaticamente memoria, hook o configurazioni private di Claude Code. Quello che si puo' trasferire davvero e':

- il contenuto testuale del piano
- le convenzioni di progetto
- i checklist operativi
- eventuali file di configurazione equivalenti creati dentro il repository

## Fonte

Origine del contenuto:

- `C:\Users\ccocu\.claude\plans\serialized-twirling-moth.md`
