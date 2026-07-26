---
title: Assetto ambiente di lavoro AI — ricerca e decisioni
date: 2026-07-26
type: decision
status: proposto
---

# Assetto ambiente di lavoro AI (2026-07-26)

Ricerca sulla documentazione ufficiale Claude Code + fonti terze, confrontata con
la configurazione reale del repo. Segue la bonifica config della stessa sessione
(CLAUDE.md 325→224 righe, allow 45→97, hook riscritti).

## 1. Modalità permessi — l'unica cosa urgente

**Stato attuale**: la sessione gira in `bypassPermissions` (verificato leggendo il
payload di un hook PreToolUse: `"permission_mode": "bypassPermissions"`).

La documentazione ufficiale classifica questa modalità come **"Isolated containers
and VMs only"**. Questa macchina non lo è: è Windows 11 bare-metal con un `.env`
che contiene chiavi Stripe, Firebase, Sentry, GitHub e Obsidian.

**Decisione proposta: passare ad `auto` mode.** Tabella ufficiale delle modalità:

| Modalità            | Cosa gira senza chiedere          | Adatta a                           |
| ------------------- | --------------------------------- | ---------------------------------- |
| `default` (Manual)  | solo letture                      | lavoro sensibile                   |
| `acceptEdits`       | letture, edit, mkdir/mv/cp        | iterare su codice che rivedi       |
| `auto`              | tutto, con controlli di sicurezza | **task lunghi, meno interruzioni** |
| `dontAsk`           | solo tool pre-approvati           | CI e script                        |
| `bypassPermissions` | tutto, nessun controllo           | solo container e VM isolate        |

In `auto` un classificatore (Sonnet 5) valuta ogni azione. Letture e edit dentro la
working directory **saltano il classificatore**, quindi nessuna latenza sul lavoro
normale; il costo si concentra su comandi shell e rete.

Bloccato di default (estratto rilevante per noi): `curl | bash`, deploy in
produzione e migrazioni, force push, `git reset --hard` / `git clean -fd` /
`git stash drop`, `git commit --amend` su commit già pushato, commit o push che
farebbero uscire segreti dal repo, stampa di credenziali vive nel transcript,
`rm -rf "$VAR"` con target non risolvibile, disabilitare check CI, mergiare una PR
non approvata da un umano.

Permesso di default: operazioni sui file nella working directory, installare
dipendenze già dichiarate nei lockfile, leggere `.env` e mandare le credenziali
alla loro API corrispondente, richieste HTTP read-only, push su qualsiasi branch
del repo su cui stai lavorando.

Due comportamenti da conoscere:

- **I limiti detti a voce contano.** Se scrivo "non deployare finché non rivedo",
  il classificatore blocca le azioni corrispondenti anche quando le regole di
  default le permetterebbero. Il limite resta attivo finché non lo tolgo. Non è
  però persistente: sopravvive solo finché quel messaggio è nel contesto — per una
  garanzia dura serve una `deny` rule.
- **Fallback**: 3 blocchi consecutivi o 20 totali e auto mode si sospende, tornando
  a chiedere. Soglie non configurabili.

Nota: entrando in auto mode vengono **scartate** le allow rule larghe che
concedono esecuzione arbitraria (`Bash(*)`, interpreti con wildcard, comandi
package-manager). Le regole strette tipo `Bash(npm test)` restano. Parte delle 97
regole appena aggiunte potrebbe quindi non applicarsi in auto mode — non è un
problema, il classificatore copre il caso.

**Come si cambia**: `Shift+Tab` cicla le modalità nella CLI, oppure
`"permissions": {"defaultMode": "auto"}` in `.claude/settings.json`.

## 2. Sandbox — non disponibile, chiuso

`/sandbox` gira su macOS, Linux e WSL2. **Windows nativo non è supportato.**
Verificato: `wsl -l -v` → _"Il sottosistema Windows per Linux non è installato"_.

Migrare a WSL2 significherebbe rifare percorsi, launcher `py`, hook PowerShell di
SessionStart e Firebase CLI. **Decisione: non farlo.** Auto mode copre la maggior
parte del rischio senza migrazione. Questo è però il tetto della configurazione
attuale: l'isolamento a livello OS resta fuori portata finché si sta su Windows.

## 3. Verifica — la leva di qualità non ancora usata

L'intera guida ufficiale ruota attorno a una frase: _dai a Claude un controllo che
possa eseguire_. Gli script di verifica ci sono già e sono buoni (`typecheck`,
`audit:ui`, `audit:visual`, `e2e`, `audit:cwv`, `lighthouse` in CI). Manca il
**cancello** che obblighi a passarli prima di dichiarare finito.

Tre livelli, dal più leggero:

1. **Nel prompt**: "esegui X e itera finché non passa".
2. **`/goal <condizione>`** — un valutatore separato (Haiku) ricontrolla dopo ogni
   turno e il lavoro continua finché la condizione non regge. Una per sessione,
   fino a 4000 caratteri, si azzera con `/goal clear`. Il valutatore giudica solo
   ciò che è già comparso nella conversazione, quindi la condizione va scritta come
   qualcosa che l'output può dimostrare.
   Esempio per noi:
   `/goal npm run typecheck esce 0, npm run audit:ui non riporta errori, e la rotta modificata non ha overflow orizzontale a 375px verificato con screenshot`
3. **Stop hook** — permanente, in `settings.json`, script o prompt. Claude Code lo
   scavalca dopo 8 blocchi consecutivi.

**Questa è l'aggiunta a più alto rendimento del setup.** Gli strumenti ci sono, il
gate no.

## 4. Contesto MCP — già gestito, meno grave del previsto

Tool Search si attiva **automaticamente** quando le descrizioni dei tool MCP
superano il 10% del budget di contesto: il modello vede un indice ricercabile
invece di tutti gli schemi. È il motivo per cui a inizio sessione compaiono ~200
nomi di tool senza schema. Riduzioni riportate: 46,9% (Anthropic) fino all'85%.

**Conseguenza: non tagliare i 12 server MCP per motivi di contesto.** Vanno tagliati
solo se inutilizzati o se sono superficie di rischio. Da verificare con `/context`,
riga "MCP tools".

## 5. CLAUDE.md — ora allineato alla guida ufficiale

Il fallimento descritto nel doc è esattamente quello che avevamo: _"se CLAUDE.md è
troppo lungo, Claude ne ignora metà perché le regole importanti si perdono nel
rumore"_. Il test proposto — _"per ogni riga: toglierla causerebbe errori? Se no,
tagliala"_ — e il consiglio di convertire le istruzioni in hook sono ciò che è
stato fatto in questa sessione. Nessuna azione ulteriore.

## 6. Cosa manca davvero

- **Pattern Writer/Reviewer**: una seconda sessione che rivede in contesto pulito
  è meno prevenuta verso il codice appena scritto. Più forte di `/quick-review`
  nella stessa sessione.
- **`/rewind` e checkpoint**: permettono di tentare qualcosa di rischioso e
  tornare indietro. Non coprono le modifiche fatte via Bash — non sostituiscono git.
- **`/btw`** per domande laterali che non devono entrare nel contesto.
- **Statusline con consumo di contesto**: il doc raccomanda di monitorarlo di continuo.
- **Worktree / sessioni parallele** per esperimenti isolati.
- **`gh` è già installato** (2.96.0) — la guida lo indica come via più efficiente
  in contesto rispetto alla MCP GitHub. Preferirlo per PR, issue, run CI.

## 7. Stack di prodotto — una cosa da sapere

Firebase Hosting **non ha prerendering nativo e non ha una data** per averlo. La
soluzione build-time `scripts/generate-route-html.js` è quindi l'architettura
corretta per noi, non un ripiego. Verificato il 2026-07-26: `/chi-siamo`,
`/esplora`, `/family` hanno `<title>`, `og:title` e `og:description` distinti nel
`dist/`. Il rewrite `**` → `/index.html` resta solo come fallback SPA, perché
Firebase serve prima il file statico corrispondente.

**Regola operativa**: una rotta nuova che non appare nelle card social va aggiunta
a `generate-route-html.js`, **non** a `server.ts`.

## Ordine di intervento proposto

1. Passare ad `auto` mode (`Shift+Tab`, o `defaultMode` in settings). — _rischio giù, attrito uguale_
2. Adottare `/goal` sui task multi-turno con criterio verificabile. — _qualità su_
3. Verificare con `/context` quanto pesano davvero gli MCP prima di toccarli.
4. Statusline con consumo contesto.
5. Writer/Reviewer su cambi non banali.
6. Sandbox/WSL2: non ora.

## Fonti

- <https://code.claude.com/docs/en/best-practices>
- <https://code.claude.com/docs/en/permission-modes>
- <https://code.claude.com/docs/en/sandboxing>
- <https://code.claude.com/docs/en/goal>
- <https://www.anthropic.com/engineering/advanced-tool-use>
- <https://mcp.directory/blog/mcp-context-bloat-fix-2026-tool-search-code-mode-progressive-disclosure>
- <https://ccbd.dev/blog/open-graph-react-seo-fix-social-previews-and-add-og-meta-tags-2026-guide>
