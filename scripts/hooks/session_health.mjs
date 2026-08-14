#!/usr/bin/env node
/**
 * SessionStart health check.
 *
 * Replaces an inline PowerShell command that only ran on Windows: on any other
 * platform it errored at session start instead of reporting anything.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const line = (s) => process.stdout.write(`${s}\n`);

line('--- TRAVELLINIWITHUS session health check ---');

try {
  const res = await fetch('http://localhost:3000', { signal: AbortSignal.timeout(1000) });
  line(`dev server: localhost:3000 raggiungibile (${res.status})`);
} catch {
  line('dev server: non attivo (avvia con: npm run dev)');
}

if (existsSync(join(root, '.git'))) {
  try {
    const git = (args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' });
    const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    const dirty = git(['status', '--porcelain']).split('\n').filter(Boolean).length;

    // I commit non pushati sono lavoro che esiste solo su questo disco. Vale una
    // riga a ogni avvio: il 2026-08-14 una giornata intera è rimasta scoperta
    // per ore senza che nessuno lo dicesse.
    let daPushare = '';
    try {
      const n = git(['log', '--oneline', `origin/${branch}..HEAD`])
        .split('\n')
        .filter(Boolean).length;
      if (n > 0) daPushare = ` | ${n} commit NON pushati`;
    } catch {
      daPushare = ' | branch mai pushato su origin';
    }

    line(`branch: ${branch} | file modificati: ${dirty}${daPushare}`);
  } catch {
    line('git: presente ma non interrogabile');
  }
}

line(existsSync(join(root, '.env')) ? '.env: presente' : '.env: MANCANTE');
line('---');
