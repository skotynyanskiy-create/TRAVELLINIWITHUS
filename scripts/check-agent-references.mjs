#!/usr/bin/env node
/**
 * Verifica che i percorsi e i comandi npm citati da agent e skill esistano.
 *
 * Perché esiste. Il 2026-08-14 un audit ha aperto uno per uno i file citati da
 * 53 skill e 16 agent, e ne ha trovati sette che non esistevano più:
 * `src/services/firebaseInit.ts`, `src/pages/Home.tsx`, `src/content/articles`,
 * `.lighthouserc.json`, e due documenti archiviati citati come fonti vive. Erano
 * sopravvissuti a refactor e rinomine che nessuno aveva propagato.
 *
 * Un agente che legge «apri src/pages/Home.tsx» e non lo trova non fallisce: fa
 * qualcosa di plausibile e va avanti. È il modo peggiore in cui una definizione
 * può essere sbagliata, perché non produce mai un errore.
 *
 * Cosa NON controlla, deliberatamente: i percorsi dentro blocchi di codice, che
 * spesso sono esempi; i glob; gli URL. Meglio pochi falsi negativi che un gate
 * che nessuno può tenere verde.
 */
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const SCRIPT_NPM = new Set(Object.keys(pkg.scripts));

/** File da analizzare: tutto ciò che il modello legge come istruzione. */
function raccogli() {
  const out = [];
  for (const f of fs.readdirSync('.claude/agents').filter((x) => x.endsWith('.md'))) {
    out.push(path.join('.claude/agents', f));
  }
  for (const d of fs.readdirSync('.agents/skills')) {
    const p = path.join('.agents/skills', d, 'SKILL.md');
    if (fs.existsSync(p)) out.push(p);
  }
  // I file di istruzione veri e propri erano fuori copertura fino al
  // 2026-08-14, ed è il buco peggiore: `CLAUDE.md` è l'unico file garantito in
  // contesto a ogni sessione, e le regole path-scoped arrivano proprio quando
  // si apre l'area che descrivono. Un percorso morto lì costa più che altrove.
  for (const f of ['CLAUDE.md', 'AGENTS.md']) {
    if (fs.existsSync(f)) out.push(f);
  }
  if (fs.existsSync('.claude/rules')) {
    for (const f of fs.readdirSync('.claude/rules').filter((x) => x.endsWith('.md'))) {
      out.push(path.join('.claude/rules', f));
    }
  }
  return out;
}

/** Toglie i blocchi di codice: dentro ci sono esempi, non riferimenti. */
function senzaCodice(testo) {
  return testo.replace(/```[\s\S]*?```/g, '');
}

const problemi = [];

for (const file of raccogli()) {
  const testo = senzaCodice(fs.readFileSync(file, 'utf8'));

  // Percorsi in backtick che sembrano file del repo: hanno una barra e
  // un'estensione nota, oppure finiscono con `/` (cartella).
  const percorsi = [...testo.matchAll(/`([\w./-]+\.(?:ts|tsx|js|mjs|json|md|css|rules|py|yml))`/g)]
    .map((m) => m[1])
    .filter((p) => p.includes('/'));

  // Le skill Higgsfield descrivono file dentro i **siti che generano**, non in
  // questo repo: `app/src/app-meta.json` è un artefatto dell'output, non una
  // promessa sul nostro albero. Controllarne i percorsi produce solo rumore.
  const descriveOutputEsterno = file.includes('higgsfield-');

  if (!descriveOutputEsterno) {
    for (const p of new Set(percorsi)) {
      // Un percorso può essere relativo alla root del repo oppure alla cartella
      // che contiene la definizione, come fanno le skill con un proprio bundle.
      const candidati = [p, path.normalize(path.join(path.dirname(file), p))];
      if (!candidati.some((c) => fs.existsSync(c))) {
        problemi.push({ file, tipo: 'percorso', valore: p });
      }
    }
  }

  // Comandi `npm run <nome>` citati. Scarto i tronconi di prosa tipo
  // «npm run audit:*» o una riga che finisce a metà: un nome vero non termina
  // con i due punti e non è vuoto.
  const comandi = [...testo.matchAll(/npm run ([\w:-]+)/g)]
    .map((m) => m[1])
    .filter((c) => c && !c.endsWith(':'));
  for (const c of new Set(comandi)) {
    if (!SCRIPT_NPM.has(c)) {
      problemi.push({ file, tipo: 'npm run', valore: c });
    }
  }
}

if (problemi.length === 0) {
  console.log(`PASS: nessun riferimento morto in ${raccogli().length} definizioni.`);
  process.exit(0);
}

const perFile = new Map();
for (const p of problemi) {
  if (!perFile.has(p.file)) perFile.set(p.file, []);
  perFile.get(p.file).push(p);
}
for (const [file, lista] of perFile) {
  console.log(`\n  ${file}`);
  for (const p of lista) console.log(`     ${p.tipo.padEnd(9)} ${p.valore}`);
}
console.error(
  `\nFAIL: ${problemi.length} riferimenti a file o comandi che non esistono.\n` +
    `Correggi la definizione, oppure crea cio' che promette.`
);
process.exit(1);
