#!/usr/bin/env node
/**
 * PostToolUse — formatta il file appena scritto, subito.
 *
 * Perché esiste. Il 2026-08-14 dodici file sono entrati nel repo non formattati,
 * e `format:check` era rosso da prima. La causa non era distrazione: la
 * formattazione avveniva **solo al commit**, via lint-staged, che eseguiva
 * `eslint` e `prettier --write` su due chiavi glob separate — quindi in
 * parallelo, sullo stesso file, uno che leggeva mentre l'altro scriveva.
 *
 * Quella corsa è stata corretta. Ma la lezione più utile è un'altra: se il file
 * viene formattato **quando lo scrivo**, il difetto non può proprio nascere, e
 * il controllo al commit diventa una rete invece che l'unica difesa.
 *
 * Scelte di progetto:
 * - `--ignore-unknown` fa saltare le estensioni che prettier non gestisce, senza
 *   che io debba tenere una lista che divergerebbe dal suo default.
 * - `.prettierignore` viene rispettato da prettier stesso: i file protetti
 *   (tsconfig, firebase.json, i generati) restano intoccati senza logica qui.
 * - **Esce sempre con 0.** Una formattazione fallita non deve mai fermare il
 *   lavoro: al massimo `format:check` lo dirà dopo.
 * - In Node, non in Python: non passa da `run-hook.mjs`, che esce con 0 quando
 *   non trova un interprete. Un hook di qualità che si spegne in silenzio è
 *   peggio di nessun hook.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();

let payload = {};
try {
  payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}

const file = payload.tool_input?.file_path || payload.tool_input?.path;
if (!file) process.exit(0);

// Solo file dentro il repo: un Edit su un file di scratch non ci riguarda.
const assoluto = path.resolve(file);
if (!assoluto.startsWith(path.resolve(ROOT))) process.exit(0);
if (!fs.existsSync(assoluto)) process.exit(0);

try {
  execFileSync('npx', ['prettier', '--write', '--ignore-unknown', assoluto], {
    cwd: ROOT,
    stdio: 'ignore',
    timeout: 15000,
    shell: process.platform === 'win32',
  });
} catch {
  // Prettier può fallire su sintassi non ancora valida — normale mentre si
  // scrive. Silenzio: il file resta com'è e i cancelli lo diranno dopo.
}

process.exit(0);
