---
# Il match usa semantica gitignore sul path relativo alla root, e un `/**`
# finale viene troncato: `.claude/**` e `.claude` sono identici. Scritti senza,
# cosi' la forma dice quello che fa. Un pattern senza slash matcha a OGNI
# livello: `package.json` prende anche `functions/package.json`.
# Un glob che non compila fallisce in silenzio, trattato come «non matcha nulla».
paths:
  - '.claude'
  - '.mcp.json'
  - 'scripts/hooks'
  - 'scripts/*.mjs'
  - '.github/workflows'
  - 'package.json'
  - '.prettierignore'
  - 'tsconfig*.json'
  - 'eslint.config.js'
---

# Verità di configurazione

Si carica quando apri la configurazione. Prima stava in coda a `CLAUDE.md` e si
pagava a ogni sessione anche quando nessuno la toccava.

I conteggi erano esatti il 2026-08-14, **e non c'è niente che li tenga tali**:
nessun comando li verifica. Quelli che decadono da soli sono i file in `docs/`, le
skill e i server MCP — trattali come ordine di grandezza e ricontrolla prima di
citarli. Le regole `allow`/`deny`, gli hook e `defaultMode` cambiano solo se
qualcuno modifica `.claude/settings.json`, quindi reggono di più. Non riscrivere
«verificato oggi» senza aver rieseguito il conteggio.

## Come è fatta

- **`.claude/settings.json` è la configurazione di progetto effettiva**: dichiara
  i 12 server di `.mcp.json`, 97 regole `allow`, 45 `deny`, 5 comandi hook su 3
  eventi, e `permissions.defaultMode: auto`. L'harness vince comunque: un flag
  come `--dangerously-skip-permissions` sovrascrive `defaultMode`.
- **`effortLevel` non sta qui** (rimosso il 2026-08-02). Le settings caricano
  utente → progetto → local, quindi un `effortLevel` di progetto sovrascriveva in
  silenzio la scelta dell'owner nel picker. Non rimetterlo.
- **I plugin sono abilitati globalmente**, non per progetto:
  `.claude/settings.local.json` non ha `enabledPlugins`.
- **Le skill vivono in 5 posizioni** da 53 voci: `.agents/skills` è la canonica,
  `.claude`, `.github`, `.cursor`, `.gemini` sono target di sincronizzazione
  validati da `npm run audit:agents`. Solo `.claude/skills` arriva al modello.
  Per togliere un mirror va tolta anche la sua voce in `scripts/audit-agent-stack.mjs`.
- **Gli agent invece hanno `.claude/agents` come canonica**, non `.agents`:
  `npm run sync:codex-agents` legge da lì e scrive i 16 TOML di `.codex/agents`.
- **Sette delle otto skill Higgsfield** e `travellini-stitch-figma-bridge` sono
  `user-invocable-only`: restano a una slash di distanza ma non occupano il
  listing. `higgsfield-hub` resta visibile apposta, è la porta d'ingresso.

## Skill che il modello non può invocare

`disable-model-invocation: true` tiene una skill a una slash di distanza: la lancia
solo l'owner. Dal 2026-08-14 ce l'hanno `deploy` e `commit`. Prima nessuna delle
53 lo usava, quindi il modello poteva invocare da sé la skill che deploya in
produzione — mentre `CLAUDE.md` scriveva «deploy solo su richiesta esplicita».
Era di nuovo una regola senza cancello.

Gli 8 `skillOverrides` in `settings.json` fanno una cosa diversa: tolgono la skill
dal listing per non occupare contesto. Sono due meccanismi separati, non
alternativi.

## Precedenza dei permessi — la regola che decide tutto

Dalla documentazione ufficiale, verificata il 2026-08-14:

> Rules are evaluated in order: **deny, then ask, then allow**. If a tool is
> denied at any level, no other level can allow it.

Da cui due conseguenze che cambiano dove si mette una protezione:

1. **Un hook che esce con 2 blocca prima che i permessi siano valutati**, quindi
   batte una regola `allow`. Ma un hook può non partire: `run-hook.mjs:36-44` esce
   con 0 se non trova un interprete Python. **Gli hook falliscono aperti.**
2. **Una regola `deny` non può fallire aperta**: è configurazione del client, non
   un processo che può mancare.

Perciò ciò che non deve accadere **mai** va in `permissions.deny`; l'hook è un
supplemento, non il livello primario.

**Riallineato il 2026-08-14.** Prima le `deny` avevano 10 regole `Bash` contro le
22 dell'hook, e quattordici famiglie distruttive — le varianti Windows
(`Remove-Item -Recurse`, `rd /s`, `del /f`, `format`), `git add -A`,
`git push origin +refspec`, `git branch -D`, `git rebase`, `git checkout .`,
`dd if=`, `firebase deploy`, `npm run deploy` — vivevano **solo** nel livello che
si spegne senza Python. Ora sono 31 regole `Bash` su 45 `deny` totali.

Resta nell'hook e solo lì il `curl | bash`: la sintassi delle `deny` non esprime
bene una pipe, e ogni sottocomando viene già valutato a sé. Se lo sposti, misura
che intercetti davvero prima di togliere la regola Python.

> Verificato in sessione, non dedotto: una regola `deny` aggiunta a metà sessione
> ha effetto **senza riavvio**. La prova è stata una sonda `Bash(echo DENYPROBE*)`
> su un comando che l'hook non tocca — bloccata, poi rimossa. Un test fatto con un
> comando che l'hook già copre non dimostra niente, perché l'hook scatta prima.

## Gli strumenti MCP vanno governati per nome reale, non per nome presunto

Audit del 2026-08-14, fatto leggendo il **codice dei server installati** e non i
nomi dichiarati. Ha trovato che il perimetro dichiarato era più stretto di quello
vero, in tre modi:

- **`mcp__firebase__init` scriveva `firestore.rules`, `firebase.json` e
  `.firebaserc`** senza passare da nessuna barriera. Il gruppo `core` è sempre
  caricato, e il suo default documentato sono regole aperte a 30 giorni.
- **`config_protection.py` ha matcher `Edit|Write|MultiEdit`**: non scatta mai su
  una chiamata MCP né su Bash. Il «doppio livello» su `firestore.rules` copriva
  un solo canale su tre.
- **Il gruppo `firestore` non è solo `query_collection`**: un server remoto
  aggiunge l'intero set Admin (`add_document`, `update_document`,
  `create_database`, `create_index`…), che scavalca `firestore.rules` come fa la
  Cloud Function.

Chiusi il 2026-08-14 portando in `deny` i sette strumenti Firebase di scrittura,
cinque GitHub, `sentry__update_issue` e i due Obsidian di scrittura. **Le `deny`
sono passate da 45 a 74.**

**Controprova che vale come metodo**: `mcp__firebase__auth_update_user` era in
`deny`, ma il gruppo `auth` non viene mai caricato sotto `--only core,firestore`.
Si stava negando uno strumento irraggiungibile mentre quelli raggiungibili
restavano scoperti. **Prima di scrivere una regola, verifica che il nome esista
davvero** — `firebase mcp --generate-tool-list` lo dice.

## Il blocco Edit/Write era aggirabile da shell

`cp`, `git checkout` e `git show` erano tutti in `allow`, quindi
`cp x firestore.rules` o `git show ref:file > file` scrivevano il file protetto
senza mai passare da Edit/Write. Chiuso con 14 `deny` mirate sui **verbi di
scrittura** (`cp`, `mv`, `git checkout`, `git restore`, `>`, `>>`, `tee`) verso
quei due percorsi. Le letture restano libere apposta: `wc`, `git log` e
`git diff` su `firestore.rules` continuano a funzionare.

## `firebase-applet-config.json` non è rimovibile

È importato da `src/lib/firebaseApp.ts:2` e letto da `src/server/data.ts:55`, e
**ha priorità sulle variabili d'ambiente** (`fromFile.projectId || process.env…`).
È il motivo per cui uno smoke test con `FIRESTORE_DATABASE_ID` di prova ha scritto
sul Firestore reale: l'env veniva ignorato. Chi propone di cancellarlo non l'ha
seguito fino a `data.ts`.

## Sintassi delle regole

- `Bash(cmd:*)` e `Bash(cmd *)` sono wildcard equivalenti. Un `*` copre anche gli
  spazi, quindi attraversa più argomenti.
- `*` finale **preceduto da spazio** impone un confine di parola: `Bash(ls *)`
  prende `ls -la` ma non `lsof`; `Bash(ls*)` prende entrambi.
- Ogni sottocomando di un comando composto viene controllato a sé, e le
  assegnazioni iniziali vengono spogliate: `Bash(rm *)` intercetta anche
  `FOO=bar rm file` e `echo $(rm -rf /)`.
- I runner non vengono spogliati: `Bash(npx *)` concederebbe qualunque cosa segua.

## Trappole misurate

- **`VITE_MAPBOX_TOKEN`** è passato come secret da tre job della CI, ma **nessun
  file sotto `src/` lo referenzia**: prima di considerarlo un requisito di build,
  verifica se serve ancora.
- **Le tre pipeline «controlla tutto» sono allineate dal 2026-08-14.** Erano tre
  composizioni diverse, nessuna sottoinsieme dell'altra: `audit:provenance` — la
  regola imagery-truth — girava solo dentro `audit:quality`, quindi nessuna
  macchina la verificava prima di un merge. Ora `audit:provenance`, `audit:seed`,
  `audit:llms`, `stato:check` e `format:check` stanno in tutte e tre. Se ne
  aggiungi una, mettila in `ci.yml`, `scripts/predeploy.mjs` **e**
  `audit:quality`, o la divergenza riparte.
- **`config_protection.py` protegge due file che non esistono**: `.gitleaks.toml`
  e `.markdownlint.json` sono nel suo set `PROTECTED` ma non stanno nel repo, e
  `npm run lint:md` non lo chiama nessuno. Non è un buco di sicurezza, è una
  guardia che non guarda niente.
- **`.prettierignore` è parte della protezione**: lint-staged fa
  `prettier --write` su ogni `.json` in stage, e `config_protection.py` intercetta
  gli agent ma non git. Se aggiungi un file protetto, aggiungilo anche lì.

Prima di aggiungere una regola qui, controlla che sia applicabile e vera. Una
regola che descrive un file inesistente costa contesto a ogni sessione e non
previene niente.
