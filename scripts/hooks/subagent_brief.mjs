#!/usr/bin/env node
/**
 * SubagentStart — dà a ogni agente lo stato reale del repo prima che cominci.
 *
 * Perché esiste. Ogni definizione di agente contiene «Read first (always):
 * CLAUDE.md, …», e niente lo verifica: `CLAUDE.md` stesso classifica quelle
 * righe fra le regole che nessun comando fa rispettare. Un agente parte quindi
 * senza sapere su che branch è, se ci sono modifiche non committate, o se sta
 * per toccare un file che serve la produzione — e lo scopre, quando lo scopre,
 * spendendo tool call.
 *
 * Perché in Node e non in Python. Gli altri quattro hook passano da
 * `run-hook.mjs`, che esce con 0 se non trova un interprete: falliscono aperti.
 * Questo non ha quella dipendenza.
 *
 * Perché anche il log. `routing_log.py` è montato su `PostToolUse`, che per
 * definizione scatta solo dopo un tool **riuscito**: un agente interrotto o
 * fallito non lascia riga nel ROUTING_LOG, che `CLAUDE.md` indica come la prova
 * da usare quando si propone di cambiare le regole di routing. Qui si registra
 * al dispatch, non al ritorno.
 *
 * Contratto: esce SEMPRE con 0. Un brief mancato non deve impedire il lavoro.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();

/** git che non esplode: se il comando fallisce, il brief perde una riga e basta. */
function git(...args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', timeout: 5000 }).trim();
  } catch {
    return '';
  }
}

function leggiPayload() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

const payload = leggiPayload();
const tipo = payload.agent_type || 'sconosciuto';

const branch = git('rev-parse', '--abbrev-ref', 'HEAD') || 'sconosciuto';
const sporchi = (git('status', '--porcelain') || '').split('\n').filter(Boolean).length;
const nonPushati = (git('log', '--oneline', `origin/${branch}..HEAD`) || '')
  .split('\n')
  .filter(Boolean).length;

// Le righe sotto sono deliberatamente poche: il brief entra nel contesto di OGNI
// agente, e un brief lungo costa più di quanto risolva.
const righe = [
  `Stato del repo al tuo avvio (iniettato da SubagentStart, non dedurlo):`,
  `- branch \`${branch}\`, ${sporchi} file modificati non committati, ${nonPushati} commit non pushati`,
  `- se un file ti risulta diverso da git, è perché il lavoro è in corso: non "correggerlo" senza chiedere`,
  ``,
  `Prima di toccare questi, fermati e dichiaralo: \`src/server/apiRoutes.ts\` (webhook Stripe),`,
  `\`functions/src/index.ts\` (Admin SDK, scavalca firestore.rules), \`firebase.json\`, \`.firebaserc\`,`,
  `\`.github/workflows/*\`. \`firestore.rules\` e \`src/config/admin.ts\` sono bloccati da due livelli.`,
  ``,
  `Ogni finding che riporti dichiara come è stato prodotto: \`[MISURATO: <comando o file:riga>]\``,
  `oppure \`[DEDOTTO]\`. Un \`[DEDOTTO]\` che afferma un impatto porta anche \`Si smentisce se:\`.`,
  `Misurare bene e interpretare male è il modo più comune di sbagliare qui.`,
];

// Nota deliberata: qui NON si scrive nel ROUTING_LOG.
//
// La prima versione di questo hook lo faceva, per chiudere un buco vero:
// `routing_log.py` sta su `PostToolUse`, che scatta solo dopo un tool
// **riuscito**, quindi un agente interrotto non lascia traccia nel registro che
// `CLAUDE.md` indica come la prova da portare quando si cambiano le regole di
// routing.
//
// Ma il rimedio era peggiore del male, misurato poche ore dopo:
//   - non toglieva la scrittura al ritorno, quindi ogni agente riuscito
//     produceva DUE righe;
//   - il payload di `SubagentStart` non contiene la descrizione del compito,
//     quindi la riga di dispatch poteva dire solo «avviato» — rumore in cambio
//     di niente su ogni run riuscito;
//   - e usava la data dell'ultimo commit al posto dell'ora vera, quindi tutte le
//     righe di una sessione avrebbero avuto lo stesso timestamp.
//
// Il buco resta aperto e dichiarato: **un agente interrotto non compare nel
// ROUTING_LOG.** Chi legge quel file per decidere una regola di routing lo sappia.
// Non vale due righe di rumore per ogni agente che invece finisce bene.

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SubagentStart',
      additionalContext: righe.join('\n'),
    },
  })
);
process.exit(0);
