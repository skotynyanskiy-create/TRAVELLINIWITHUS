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
import path from 'node:path';

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

// Riga di dispatch, scritta ORA e non al ritorno.
try {
  const logPath = path.join(ROOT, 'docs', '20_Decisions', 'ROUTING_LOG.md');
  if (fs.existsSync(logPath)) {
    const ts = git('log', '-1', '--format=%cI') || '';
    fs.appendFileSync(logPath, `| ${ts} | ${tipo} | dispatch | ${branch} |\n`);
  }
} catch {
  /* il log non è mai un motivo per bloccare un agente */
}

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SubagentStart',
      additionalContext: righe.join('\n'),
    },
  })
);
process.exit(0);
