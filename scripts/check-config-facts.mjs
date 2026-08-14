#!/usr/bin/env node
/**
 * Verifica che i conteggi scritti in `.claude/rules/configurazione.md`
 * corrispondano alla configurazione reale.
 *
 * Perché esiste. Quella regola conteneva questa frase, scritta il 2026-08-14:
 * «I conteggi erano esatti oggi, e non c'è niente che li tenga tali: nessun
 * comando li verifica». Nelle sei ore successive cinque di quei numeri sono
 * scaduti — deny, server MCP, comandi hook, eventi — tutti per modifiche fatte
 * nella stessa sessione che aveva scritto l'avvertimento.
 *
 * Un documento che descrive la configurazione o è verificato, o mente. Questo
 * script toglie la terza possibilità, cioè che menta senza che nessuno lo sappia.
 */
import fs from 'node:fs';

const REGOLA = '.claude/rules/configurazione.md';
const testo = fs.readFileSync(REGOLA, 'utf8');
const settings = JSON.parse(fs.readFileSync('.claude/settings.json', 'utf8'));

const deny = settings.permissions.deny;
const hooks = settings.hooks || {};

const FATTI = [
  {
    nome: 'regole allow',
    reale: settings.permissions.allow.length,
    re: /(\d+) regole `allow`/,
  },
  {
    nome: 'regole deny',
    reale: deny.length,
    re: /(\d+) `deny`,/,
  },
  {
    nome: 'server MCP abilitati',
    reale: (settings.enabledMcpjsonServers || []).length,
    re: /i (\d+) server di `\.mcp\.json`/,
  },
  {
    nome: 'comandi hook',
    reale: Object.values(hooks).flat().reduce((n, g) => n + (g.hooks || []).length, 0),
    re: /(\d+) comandi hook/,
  },
  {
    nome: 'eventi hook',
    reale: Object.keys(hooks).length,
    re: /comandi hook su (\d+)\s*\n?\s*eventi/,
  },
  {
    nome: 'skill sincronizzate',
    reale: fs.readdirSync('.claude/skills').length,
    re: /da (\d+) voci/,
  },
  {
    nome: 'regole Bash in deny',
    reale: deny.filter((r) => r.startsWith('Bash(')).length,
    re: /(\d+) regole `Bash` su/,
  },
];

let errori = 0;
for (const f of FATTI) {
  const m = testo.match(f.re);
  if (!m) {
    console.log(`  SALTATO  ${f.nome} — la frase non compare più nella regola`);
    continue;
  }
  const scritto = Number(m[1]);
  if (scritto === f.reale) {
    console.log(`  ok       ${f.nome.padEnd(24)} ${f.reale}`);
  } else {
    console.log(`  ERRORE   ${f.nome.padEnd(24)} scritto ${scritto}, reale ${f.reale}`);
    errori++;
  }
}

if (errori) {
  console.error(
    `\nFAIL: ${errori} conteggio/i in ${REGOLA} non corrisponde alla configurazione.\n` +
      `Aggiorna la prosa, non questo script: la configurazione è la verità.`
  );
  process.exit(1);
}
console.log(`\nPASS: ${FATTI.length} fatti di configurazione verificati.`);
