import fs from 'node:fs';
import path from 'node:path';

/**
 * Audit di provenienza delle immagini.
 *
 * `DECISION_IMAGERY_TRUTH_RULE_2026-07-22` impone un'etichetta per asset
 * (real-photo / real-frame / craft) e vieta di usare materiale generato per
 * affermare un fatto — un luogo, una persona, un'esperienza. La regola pero'
 * non era scritta da nessuna parte se non in prosa: nessun campo, nessun
 * registro, nessun controllo. Questo script la rende verificabile.
 *
 * ERROR  un asset referenziato dal codice non ha regola nel registro
 *        (la tracciabilita' e' incompleta: e' l'unico errore non negoziabile)
 * ERROR  un asset `ai-generated` o `placeholder` e' usato dove afferma un fatto
 * WARN   un asset `da-certificare` e' in uso: elenco di lavoro per l'owner
 *
 * Le rotte non pubbliche (admin, dev, test, storie) restano fuori: non
 * affermano nulla al lettore.
 */

const rootDir = process.cwd();
const registryPath = path.join(rootDir, 'src', 'data', 'asset-provenance.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const rules = [...registry.rules].sort((a, b) => b.prefix.length - a.prefix.length);

/** Cartelle che non parlano al lettore: pannello admin, fixture, test, storie. */
const EXCLUDED = [
  path.join('src', 'pages', 'admin'),
  path.join('src', 'pages', 'dev'),
  path.join('src', 'components', 'admin'),
  path.join('src', 'experience'),
];
const EXCLUDED_SUFFIX = ['.test.ts', '.test.tsx', '.stories.tsx', '.spec.ts', '.spec.tsx'];

/**
 * File che possono citare un asset non referenziale senza affermare nulla:
 * il registro stesso, e le bozze editoriali dichiarate come anteprima demo.
 */
const NON_REFERENTIAL_CONTEXT = [
  path.join('src', 'data', 'asset-provenance.json'),
  path.join('src', 'config', 'assetProvenance.ts'),
  path.join('src', 'config', 'previewContent.ts'),
];

const IMAGE_REF = /["'`(\s](\/(?:images|og)\/[A-Za-z0-9._/-]+\.(?:avif|webp|png|jpe?g|svg))/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(tsx?|json|html)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function ruleFor(assetPath) {
  return rules.find((rule) => assetPath.startsWith(rule.prefix)) ?? null;
}

const scanned = [...walk(path.join(rootDir, 'src')), path.join(rootDir, 'index.html')].filter(
  (file) => {
    const rel = path.relative(rootDir, file);
    if (EXCLUDED.some((dir) => rel.startsWith(dir))) return false;
    if (EXCLUDED_SUFFIX.some((suffix) => rel.endsWith(suffix))) return false;
    return true;
  }
);

const issues = [];
const inventory = new Map();

for (const file of scanned) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const nonReferential = NON_REFERENTIAL_CONTEXT.some((entry) =>
    path.relative(rootDir, file).startsWith(entry)
  );

  lines.forEach((line, index) => {
    for (const match of line.matchAll(IMAGE_REF)) {
      // Le varianti responsive (-320/-480/-768) sono lo stesso asset.
      const asset = match[1].replace(/-(?:320|480|768|1080)\.(avif|webp)$/, '.$1');
      const rule = ruleFor(asset);
      const key = rule ? rule.prefix : asset;
      const entry = inventory.get(key) ?? {
        provenance: rule?.provenance ?? 'SCONOSCIUTA',
        uses: 0,
        files: new Set(),
      };
      entry.uses += 1;
      entry.files.add(rel);
      inventory.set(key, entry);

      if (!rule) {
        issues.push({
          level: 'error',
          rel,
          line: index + 1,
          message: `${asset} non ha una regola in src/data/asset-provenance.json — la provenienza non e' tracciabile.`,
        });
        continue;
      }

      if (nonReferential) continue;

      if (rule.provenance === 'ai-generated' || rule.provenance === 'placeholder') {
        issues.push({
          level: 'error',
          rel,
          line: index + 1,
          message: `${asset} e' "${rule.provenance}" ma è usato dove afferma un fatto. ${rule.source}`,
        });
      } else if (rule.provenance === 'da-certificare') {
        issues.push({
          level: 'warn',
          rel,
          line: index + 1,
          message: `${asset} attende la certificazione dell'owner. ${rule.source}`,
        });
      }
    }
  });
}

/**
 * Cricchetto. Le 54 immagini generate gia' in pagina sono debito noto e
 * sequenziato dalla DECISION (fase 5, in attesa delle foto reali dell'owner):
 * farle fallire oggi renderebbe rosso `audit:quality` e il controllo verrebbe
 * spento entro una settimana. La baseline le congela — l'audit blocca solo le
 * violazioni *nuove*, e il numero puo' solo scendere. `--update-baseline` la
 * riscrive dopo una bonifica.
 */
const baselinePath = path.join(rootDir, 'src', 'data', 'asset-provenance-baseline.json');
const signature = (issue) => `${issue.rel}|${issue.message.split(' e\' "')[0].split(' non ha')[0]}`;

const errors = issues.filter((issue) => issue.level === 'error');
const warnings = issues.filter((issue) => issue.level === 'warn');

if (process.argv.includes('--update-baseline')) {
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        note: 'Violazioni di provenienza note al momento dell istantanea. Sono debito, non permesso: l audit fallisce su tutto cio che non e in questa lista, e questa lista puo solo accorciarsi. Rigenerare con `npm run audit:provenance -- --update-baseline` DOPO una bonifica, mai per far passare una regressione.',
        updated: registry.version,
        known: [...new Set(errors.map(signature))].sort(),
      },
      null,
      2
    )}\n`
  );
  console.log(`Baseline aggiornata: ${[...new Set(errors.map(signature))].length} voci.`);
}

const baseline = fs.existsSync(baselinePath)
  ? new Set(JSON.parse(fs.readFileSync(baselinePath, 'utf8')).known)
  : new Set();

const newErrors = errors.filter((issue) => !baseline.has(signature(issue)));
const errorCount = newErrors.length;
const warnCount = warnings.length;

console.log('Image provenance audit');
console.log(`Registry: ${path.relative(rootDir, registryPath).replace(/\\/g, '/')}`);
console.log(`Files scanned: ${scanned.length}`);
console.log(`Errori nuovi: ${errorCount}`);
console.log(`Debito in baseline: ${errors.length - newErrors.length}`);
console.log(`Warnings: ${warnCount}`);
console.log('');
console.log('Inventario per famiglia di asset:');
for (const [key, entry] of [...inventory.entries()].sort((a, b) => b[1].uses - a[1].uses)) {
  console.log(`  ${entry.provenance.padEnd(15)} ${String(entry.uses).padStart(3)} usi  ${key}`);
}

const printed = [...newErrors, ...warnings];
if (printed.length > 0) {
  console.log('');
  for (const issue of printed) {
    console.log(
      `${issue.level.toUpperCase().padEnd(5)} ${issue.rel}:${issue.line} - ${issue.message}`
    );
  }
}

if (errorCount === 0) {
  console.log('');
  console.log(
    errors.length === 0
      ? 'PASS  Ogni immagine in uso ha una provenienza dichiarata e ammessa.'
      : `PASS  Nessuna violazione nuova. Restano ${errors.length} usi in baseline: sono la lista di lavoro, non un permesso.`
  );
}

process.exitCode = errorCount > 0 ? 1 : 0;
