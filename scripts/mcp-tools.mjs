#!/usr/bin/env node
/**
 * Interroga ogni server MCP di `.mcp.json` e stampa i nomi reali dei suoi
 * strumenti. Handshake JSON-RPC vero, come lo fa Claude Code.
 *
 * Perché esiste. Il 2026-08-14 due errori sono nati dalla stessa causa:
 * dedurre il nome di uno strumento invece di chiederlo.
 *
 *   - Una regola `deny` su `mcp__firebase__init` non intercettava niente,
 *     perché il nome vero è `firebase_init`. Era la regola che doveva chiudere
 *     il buco più grave della giornata.
 *   - `travellini-data-analyst` si era tolto due strumenti dichiarando che non
 *     esistevano. Esistevano, ed erano già permessi.
 *
 * `firebase mcp --generate-tool-list` risponde a «il nome esiste?», ma **ignora
 * `--only`**: non dice se lo strumento è raggiungibile con la nostra
 * configurazione. Questo script risponde alla seconda domanda, che è quella che
 * conta quando si scrive una regola.
 *
 * Uso:
 *   npm run mcp:tools            tutti i server
 *   npm run mcp:tools -- firebase   uno solo
 *
 * Non stampa mai valori di variabili d'ambiente: solo nomi di strumenti.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const TIMEOUT_MS = 25000;

function leggiConfig() {
  try {
    return JSON.parse(fs.readFileSync('.mcp.json', 'utf8')).mcpServers ?? {};
  } catch {
    console.error('.mcp.json non leggibile (è gitignorato: normale su un clone pulito).');
    process.exit(0);
  }
}

/** Espande `${VAR}` nell'env dichiarato. I valori non escono mai da qui. */
function espandiEnv(env = {}) {
  const out = {};
  for (const [k, v] of Object.entries(env)) {
    out[k] = String(v).replace(/\$\{([A-Z_][A-Z0-9_]*)\}/g, (_, n) => process.env[n] ?? '');
  }
  return out;
}

/**
 * Handshake MCP su stdio: initialize -> initialized -> tools/list.
 * I messaggi sono JSON delimitati da newline.
 */
function interroga(nome, conf) {
  return new Promise((resolve) => {
    if (!conf.command) {
      return resolve({ nome, stato: 'saltato', nota: 'server remoto: serve OAuth, non sondabile' });
    }

    const proc = spawn(conf.command, conf.args ?? [], {
      env: { ...process.env, ...espandiEnv(conf.env) },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });

    let buffer = '';
    let errore = '';
    let chiuso = false;

    const fine = (esito) => {
      if (chiuso) return;
      chiuso = true;
      clearTimeout(timer);
      proc.kill();
      resolve(esito);
    };

    const timer = setTimeout(
      () => fine({ nome, stato: 'timeout', nota: `nessuna risposta in ${TIMEOUT_MS / 1000}s` }),
      TIMEOUT_MS
    );

    proc.on('error', (e) => fine({ nome, stato: 'non parte', nota: e.code ?? e.message }));
    proc.stderr.on('data', (d) => (errore += d.toString()));

    proc.stdout.on('data', (d) => {
      buffer += d.toString();
      for (const riga of buffer.split('\n')) {
        if (!riga.trim()) continue;
        let msg;
        try {
          msg = JSON.parse(riga);
        } catch {
          continue; // riga parziale: arriverà completa al prossimo chunk
        }
        if (msg.id === 1) {
          invia({ jsonrpc: '2.0', method: 'notifications/initialized' });
          invia({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
        }
        if (msg.id === 2) {
          const strumenti = (msg.result?.tools ?? []).map((t) => t.name).sort();
          fine({ nome, stato: 'ok', strumenti });
        }
      }
      buffer = buffer.slice(buffer.lastIndexOf('\n') + 1);
    });

    proc.on('exit', () => {
      const prima = (errore.split('\n').find((r) => /error|Error|Traceback/.test(r)) ?? '').trim();
      fine({ nome, stato: 'crash', nota: prima.slice(0, 120) || 'uscito senza rispondere' });
    });

    const invia = (o) => {
      try {
        proc.stdin.write(JSON.stringify(o) + '\n');
      } catch {
        /* il processo può essere già morto */
      }
    };

    invia({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'travellini-mcp-probe', version: '1.0.0' },
      },
    });
  });
}

// Il primo argomento che non è un flag è il nome del server da sondare.
const filtro = process.argv.slice(2).find((a) => !a.startsWith('--'));
const server = Object.entries(leggiConfig()).filter(([n]) => !filtro || n === filtro);

if (server.length === 0) {
  console.error(filtro ? `Nessun server chiamato "${filtro}".` : 'Nessun server in .mcp.json.');
  process.exit(1);
}

console.log(`Sondo ${server.length} server MCP con un handshake reale…\n`);

const esiti = await Promise.all(server.map(([n, c]) => interroga(n, c)));

let vivi = 0;
for (const e of esiti.sort((a, b) => a.nome.localeCompare(b.nome))) {
  if (e.stato === 'ok') {
    vivi++;
    console.log(`  ${e.nome} — ${e.strumenti.length} strumenti`);
    for (const s of e.strumenti) console.log(`      mcp__${e.nome}__${s}`);
  } else {
    console.log(`  ${e.nome} — ${e.stato.toUpperCase()}: ${e.nota}`);
  }
  console.log('');
}

console.log(`${vivi} server su ${esiti.length} rispondono.`);
console.log(
  'I nomi qui sopra sono quelli da usare in allow/deny e nei campi `tools:` degli agent.'
);

// --- modalità di controllo -------------------------------------------------
// `npm run mcp:tools -- --check` confronta ogni nome mcp__ citato nella
// configurazione con quelli appena rilevati. Non è un cancello di CI: richiede
// credenziali e ~25s di handshake. È il controllo da fare quando si scrive o si
// cambia una regola che nomina uno strumento.
if (!process.argv.includes('--check')) process.exit(0);

const reali = new Set(
  esiti
    .filter((e) => e.stato === 'ok')
    .flatMap((e) => e.strumenti.map((s) => `mcp__${e.nome}__${s}`))
);
const sondabili = new Set(esiti.filter((e) => e.stato === 'ok').map((e) => e.nome));

// `auth_update_user` è un nome vero, di un gruppo che `--only core,firestore`
// non carica: negarlo è una rete in avanti, non un errore. Documentato in
// .claude/rules/configurazione.md.
const ATTESI_ASSENTI = new Set(['mcp__firebase__auth_update_user']);

const problemi = [];
const controlla = (origine, nomi) => {
  for (const n of new Set(nomi)) {
    if (!sondabili.has(n.split('__')[1])) continue; // server non sondabile: non giudico
    if (!reali.has(n) && !ATTESI_ASSENTI.has(n)) problemi.push({ origine, nome: n });
  }
};

const cfg = JSON.parse(fs.readFileSync('.claude/settings.json', 'utf8'));
controlla(
  'allow',
  cfg.permissions.allow.filter((r) => r.startsWith('mcp__'))
);
controlla(
  'deny',
  cfg.permissions.deny.filter((r) => r.startsWith('mcp__'))
);
for (const f of fs.readdirSync('.claude/agents').filter((x) => x.endsWith('.md'))) {
  const testo = fs.readFileSync('.claude/agents/' + f, 'utf8');
  controlla(
    'agent ' + f.replace('.md', ''),
    [...testo.matchAll(/mcp__[\w-]+__[\w-]+/g)].map((m) => m[0])
  );
}

console.log(`\n--- controllo nomi: ${reali.size} strumenti reali ---`);
if (problemi.length === 0) {
  console.log('Nessun nome inesistente fra quelli verificabili.');
  process.exit(0);
}
for (const p of problemi) console.log(`  ${p.origine.padEnd(30)} ${p.nome}`);
console.error(`\nFAIL: ${problemi.length} nomi che il server non dichiara.`);
process.exit(1);
