/**
 * Genera la parte fattuale di docs/STATO_DEL_SITO.md leggendo il codice.
 *
 * Girato via tsx (`npm run stato`) per poter importare i moduli dati .ts senza
 * riparsarli a mano. Dove un modulo tira dentro dipendenze browser il blocco
 * degrada a "non rilevabile" invece di far fallire l'intero script.
 *
 * Due regioni, con regole diverse:
 *   STATO    — deterministica dal codice sorgente, verificata da --check.
 *   CONSEGNA — stato git/deploy, volatile per costruzione: rigenerata ma MAI
 *              verificata, altrimenti ogni commit renderebbe rossa la CI.
 *
 * Non stampa mai valori di variabili d'ambiente: solo nomi e SET/EMPTY.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import prettier from 'prettier';

const root = process.cwd();
const output = path.join(root, 'docs', 'STATO_DEL_SITO.md');
const MARKERS = {
  stato: ['<!-- STATO:START', '<!-- STATO:END -->'],
  consegna: ['<!-- CONSEGNA:START', '<!-- CONSEGNA:END -->'],
};

const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const readJson = (rel) => JSON.parse(read(rel));
const exists = (rel) => fs.existsSync(path.join(root, rel));
const git = (...args) => {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
};

/** Blocco che non si è potuto rilevare: si dice, non si finge. */
const unavailable = (why) => `_Non rilevabile: ${why}._`;

// ---------------------------------------------------------------- superfici

async function blockSurfaces() {
  let SURFACES;
  try {
    ({ SURFACES } = await import('../src/config/surfaces.ts'));
  } catch (error) {
    return unavailable(`import di src/config/surfaces.ts fallito (${error.message})`);
  }

  const count = (state) => SURFACES.filter((s) => s.state === state).length;
  const rows = SURFACES.map(
    (s) => `| \`${s.path}\` | ${s.state} | ${s.private ? 'sì' : '—'} | ${s.missing ?? '—'} |`
  );

  const noMissing = SURFACES.filter((s) => s.state !== 'live' && !s.missing);
  const gap = SURFACES.filter((s) => s.missing).map((s) => `| \`${s.path}\` | ${s.missing} |`);

  return [
    `**${SURFACES.length} superfici registrate** — live ${count('live')} · preview ${count('preview')} · soon ${count('soon')} · private ${SURFACES.filter((s) => s.private).length}.`,
    '',
    'Registro: `src/config/surfaces.ts`. È la fonte unica di `noindex` e sitemap:',
    'indicizzabile solo se `state: live` e non `private`.',
    '',
    '| Rotta | Stato | Privata | Cosa manca per essere live |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
    '### Il divario, per superficie',
    '',
    gap.length
      ? ['| Rotta | Manca |', '| --- | --- |', ...gap].join('\n')
      : '_Nessun campo `missing` valorizzato._',
    '',
    noMissing.length
      ? `⚠️ ${noMissing.length} superfici non-live senza \`missing\`: ${noMissing.map((s) => `\`${s.path}\``).join(', ')}. Il divario non è dichiarato nel codice.`
      : 'Ogni superficie non-live dichiara cosa le manca.',
  ].join('\n');
}

// ---------------------------------------------------------------- contenuti

async function blockContent() {
  const lines = [];

  // Registro posti/esperienze.
  try {
    const items = readJson('src/data/content-seed.json');
    const real = items.filter((i) => !i.isPlaceholder).length;
    lines.push(
      `- **Registro** (\`src/data/content-seed.json\`): ${items.length} item — **${real} reali**, ${items.length - real} placeholder, ${items.filter((i) => i.featured).length} featured.`
    );
  } catch (error) {
    lines.push(`- **Registro**: ${unavailable(error.message)}`);
  }

  // Area family.
  try {
    const items = readJson('src/data/family-content-seed.json');
    const real = items.filter((i) => !i.isPlaceholder).length;
    const deals = items.filter((i) => i.deal).length;
    lines.push(
      `- **Family** (\`src/data/family-content-seed.json\`): ${items.length} item — ${real} reali, ${items.length - real} placeholder. Deal attivi: **${deals}**.`
    );
  } catch (error) {
    lines.push(`- **Family**: ${unavailable(error.message)}`);
  }

  // Articoli: i seed importano firebase/firestore, quindi si leggono a testo.
  try {
    const dir = 'src/data/articles';
    const files = exists(dir)
      ? fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.seed.ts'))
      : [];
    const published = files.filter((f) => /published:\s*true/.test(read(`${dir}/${f}`)));
    const placeholderExcerpt = files.filter((f) =>
      /excerpt:\s*['"`]PLACEHOLDER/i.test(read(`${dir}/${f}`))
    );
    lines.push(
      `- **Articoli** (\`${dir}/*.seed.ts\`): ${files.length} seed — **${published.length} con \`published: true\`**, ${placeholderExcerpt.length} con excerpt ancora \`PLACEHOLDER\`.`
    );
  } catch (error) {
    lines.push(`- **Articoli**: ${unavailable(error.message)}`);
  }

  // Reel.
  try {
    const { REELS } = await import('../src/config/reels.ts');
    const real = REELS.filter((r) => !r.isPlaceholder).length;
    lines.push(
      `- **Reel** (\`src/config/reels.ts\`): ${REELS.length} visibili — ${real} compilati, ${REELS.length - real} placeholder.`
    );
  } catch (error) {
    lines.push(
      `- **Reel**: ${unavailable(`import di src/config/reels.ts fallito (${error.message})`)}`
    );
  }

  return lines.join('\n');
}

// ------------------------------------------------------------ integrazioni

/** Le chiavi dichiarate in `.env.example`, ordinate. Usata da due blocchi. */
function envKeys() {
  if (!exists('.env.example')) return [];
  const declared = [...read('.env.example').matchAll(/^\s*#?\s*([A-Z][A-Z0-9_]+)=/gm)].map(
    (m) => m[1]
  );
  return [...new Set(declared)].sort();
}

function blockEnv() {
  if (!exists('.env.example')) return unavailable('.env.example assente');

  const keys = envKeys();

  // Tre livelli, perché "mai letta" da sola mente: le chiavi degli MCP e della
  // CI non compaiono nel runtime applicativo pur essendo in uso.
  const gather = (paths, extensions) =>
    paths
      .filter(exists)
      .map((rel) => {
        const full = path.join(root, rel);
        if (fs.statSync(full).isFile()) return read(rel);
        const out = [];
        const walk = (dir) => {
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const p = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(p);
            else if (extensions.test(entry.name)) out.push(fs.readFileSync(p, 'utf8'));
          }
        };
        walk(full);
        return out.join('\n');
      })
      .join('\n');

  const app = gather(['src', 'server.ts', 'functions/src'], /\.(ts|tsx|js|mjs)$/);
  const tooling = gather(
    ['.mcp.json', 'scripts', '.github/workflows'],
    /\.(mjs|js|ts|yml|yaml|json)$/
  );

  const tier = (key) => (app.includes(key) ? 'app' : tooling.includes(key) ? 'tooling' : null);

  /*
   * Qui c'era una terza colonna, `.env` locale, con SET/EMPTY per ogni chiave.
   * Era **machine-local dentro la regione che --check verifica**: sul disco di
   * chi lavora dice SET, in un checkout senza `.env` dice EMPTY, quindi
   * `stato:check` non poteva essere verde in CI — e non lo era, restava
   * nascosto dietro un altro cancello che falliva prima (misurato il
   * 2026-08-17 in un clone pulito, prima che la CI ci arrivasse).
   *
   * Il conteggio aggregato resta, ma va nel blocco CONSEGNA, che e' volatile
   * per costruzione e che --check non guarda apposta. Quello che si perde e' il
   * SET/EMPTY per singola chiave; chi deve saperlo guarda il proprio `.env`,
   * che e' l'unico posto dove quell'informazione e' vera.
   */
  const rows = keys.map((k) => `| \`${k}\` | ${tier(k) ?? '**mai**'} |`);
  const orphan = keys.filter((k) => !tier(k));

  return [
    `**${keys.length} variabili dichiarate** in \`.env.example\`. "Letta da": \`app\` = \`src/\`, \`server.ts\`, \`functions/src/\`; \`tooling\` = \`.mcp.json\`, \`scripts/\`, workflow CI.`,
    'Quali abbiano un valore **su questa macchina** sta nel blocco Consegna: dipende dal disco, non dal codice.',
    '',
    '| Variabile | Letta da |',
    '| --- | --- |',
    ...rows,
    '',
    orphan.length
      ? `⚠️ ${orphan.length} dichiarate e mai lette da nessuna parte: ${orphan.map((k) => `\`${k}\``).join(', ')}.`
      : 'Ogni variabile dichiarata è letta da qualche parte.',
  ].join('\n');
}

// ---------------------------------------------------------------- endpoint

function blockEndpoints() {
  const file = 'src/server/apiRoutes.ts';
  if (!exists(file)) return unavailable(`${file} assente`);

  const src = read(file);
  const routes = [
    ...src.matchAll(/router\.(get|post|put|patch|delete)\(\s*['"`]([^'"`]+)['"`]/g),
  ].map((m) => `| ${m[1].toUpperCase()} | \`${m[2]}\` |`);

  return [
    `**${routes.length} endpoint** definiti in \`${file}\`, montati sia da \`server.ts\` (dev) sia da \`functions/src/index.ts\` (prod).`,
    '',
    '| Metodo | Path |',
    '| --- | --- |',
    ...routes,
  ].join('\n');
}

// ------------------------------------------------------- consegna (volatile)

function blockDelivery() {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD') ?? '?';
  const ahead = git('rev-list', '--count', 'main..HEAD') ?? '?';
  const behind = git('rev-list', '--count', 'HEAD..main') ?? '?';
  const dirty = (git('status', '--porcelain') ?? '').split('\n').filter(Boolean).length;
  const funcsOnMain = git('ls-tree', '-r', '--name-only', 'origin/main', '--', 'functions/');

  let apiRewrite = '?';
  try {
    apiRewrite = (readJson('firebase.json').hosting?.rewrites ?? []).some(
      (r) => r.source === '/api/**'
    )
      ? 'presente'
      : 'assente';
  } catch {
    apiRewrite = 'firebase.json non leggibile';
  }

  /* Presenza locale delle variabili: solo il conteggio, mai i nomi e mai i
     valori. Sta qui e non nella tabella sopra perche' dipende dal disco: nella
     regione verificata rendeva `stato:check` impossibile da tenere verde in CI. */
  const dichiarate = envKeys();
  const conValore = exists('.env')
    ? [...read('.env').matchAll(/^\s*([A-Z][A-Z0-9_]+)=(.*)$/gm)].filter(
        (m) => m[2].trim().replace(/^['"]|['"]$/g, '') && dichiarate.includes(m[1])
      ).length
    : 0;

  return [
    `- Branch corrente: \`${branch}\` — ${ahead} commit avanti su \`main\`, ${behind} dietro.`,
    `- File non committati: **${dirty}**.`,
    `- Variabili con un valore in \`.env\` **su questa macchina**: ${conValore} su ${dichiarate.length}.`,
    `- \`functions/\` su \`origin/main\`: **${funcsOnMain === null ? 'non verificabile' : funcsOnMain ? 'presente' : 'assente'}**.`,
    `- Rewrite \`/api/**\` in \`firebase.json\`: ${apiRewrite}.`,
    '',
    '_Blocco volatile: rigenerato da `npm run stato`, escluso da `stato:check`._',
  ].join('\n');
}

// -------------------------------------------------------------------- main

function replaceRegion(doc, [start, end], body, label) {
  const startIdx = doc.indexOf(start);
  const endIdx = doc.indexOf(end);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.error(`Marcatori ${label} assenti o invertiti in docs/STATO_DEL_SITO.md`);
    process.exit(1);
  }
  const headEnd = doc.indexOf('-->', startIdx) + 3;
  return doc.slice(0, headEnd) + '\n\n' + body + '\n\n' + doc.slice(endIdx);
}

function extractRegion(doc, [start, end]) {
  const startIdx = doc.indexOf(start);
  const endIdx = doc.indexOf(end);
  if (startIdx === -1 || endIdx === -1) return null;
  return doc.slice(doc.indexOf('-->', startIdx) + 3, endIdx).trim();
}

if (!exists('docs/STATO_DEL_SITO.md')) {
  console.error('docs/STATO_DEL_SITO.md non esiste: creare prima lo scheletro con i marcatori.');
  process.exit(1);
}

const stato = [
  '### Superfici pubbliche',
  '',
  await blockSurfaces(),
  '',
  '### Contenuti',
  '',
  await blockContent(),
  '',
  '### Integrazioni',
  '',
  blockEnv(),
  '',
  '### Endpoint API',
  '',
  blockEndpoints(),
].join('\n');

const doc = read('docs/STATO_DEL_SITO.md');

/**
 * lint-staged passa il documento sotto `prettier --write` a ogni commit. Senza
 * formattare anche qui, il confronto di --check fallirebbe per sempre su una
 * differenza di spaziatura nelle tabelle. Prettier e' idempotente: formattare
 * entrambi i lati rende il confronto stabile.
 */
const prettify = async (markdown) => {
  const options = await prettier.resolveConfig(output);
  return prettier.format(markdown, { ...options, parser: 'markdown' });
};

let next = replaceRegion(doc, MARKERS.stato, stato, 'STATO');
next = replaceRegion(next, MARKERS.consegna, blockDelivery(), 'CONSEGNA');
next = await prettify(next);

if (process.argv.includes('--check')) {
  const current = extractRegion(await prettify(doc), MARKERS.stato);
  if (current !== extractRegion(next, MARKERS.stato)) {
    console.error(
      'DRIFT docs/STATO_DEL_SITO.md non riflette il codice corrente - eseguire npm run stato'
    );
    process.exit(2);
  }
  console.log('docs/STATO_DEL_SITO.md is up to date');
} else {
  fs.writeFileSync(output, next, 'utf8');
  console.log('Generated docs/STATO_DEL_SITO.md');
}
