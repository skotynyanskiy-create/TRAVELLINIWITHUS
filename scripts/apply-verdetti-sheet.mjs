import fs from 'node:fs';
import path from 'node:path';
import { caricaSeed, leggiSchedaConLegacy } from './lib/verdetti.mjs';

/**
 * Riporta nel seed i verdetti scritti a mano in
 * `docs/50_Scratch/VERDETTI_DA_COMPILARE.md`.
 *
 * Il verso opposto di `generate-verdetti-sheet.mjs`. Finora mancava: la scheda
 * si generava, l'owner la compilava, e poi qualcuno ricopiava i campi dentro
 * `content-seed.json` a mano — 79 volte.
 *
 * Dry-run per default, come `publish-article-seed.mjs`. Serve `--commit` per
 * scrivere davvero.
 */

const root = process.cwd();
const commit = process.argv.includes('--commit');

const { seedPath, seed, items } = caricaSeed(root);
const scritti = leggiSchedaConLegacy(root);

if (Object.keys(scritti).length === 0) {
  console.log('Nessun verdetto compilato trovato nella scheda.');
  console.log('Genera la scheda con: npm run verdetti:scheda');
  process.exit(0);
}

const perId = new Map(items.map((item) => [item.id, item]));
const modifiche = [];
const orfani = [];

for (const [id, campi] of Object.entries(scritti)) {
  const item = perId.get(id);
  if (!item) {
    orfani.push(id);
    continue;
  }

  const cambi = [];

  for (const chiave of ['verdict', 'forWho', 'notForWho']) {
    const nuovo = campi[chiave];
    if (!nuovo || item.review?.[chiave] === nuovo) continue;
    if (commit) {
      item.review = { ...(item.review ?? {}), [chiave]: nuovo };
    }
    cambi.push(`review.${chiave}`);
  }

  for (const chiave of ['price', 'budget']) {
    const nuovo = campi[chiave];
    if (!nuovo || item.value?.[chiave] === nuovo) continue;
    if (commit) {
      item.value = { ...(item.value ?? {}), [chiave]: nuovo };
    }
    cambi.push(`value.${chiave}`);
  }

  if (cambi.length > 0) modifiche.push({ id, titolo: item.title ?? id, cambi });
}

if (orfani.length > 0) {
  console.log(`\nId nella scheda che non esistono nel seed (${orfani.length}):`);
  orfani.forEach((id) => console.log(`  ${id}`));
}

if (modifiche.length === 0) {
  console.log('\nNessuna modifica: il seed e\' gia\' allineato alla scheda.');
  process.exit(0);
}

console.log(`\n${modifiche.length} schede da aggiornare:`);
for (const m of modifiche) {
  console.log(`  ${m.titolo.padEnd(42).slice(0, 42)} ${m.cambi.join(', ')}`);
}

if (!commit) {
  console.log('\nDry-run: nessun file toccato. Per scrivere davvero:');
  console.log('  npm run verdetti:applica -- --commit');
  process.exit(0);
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + '\n', 'utf8');
console.log(`\nScritto: ${path.relative(root, seedPath)}`);

const conVerdetto = items.filter((i) => i.review?.forWho && !i.isPlaceholder).length;
const reali = items.filter((i) => !i.isPlaceholder).length;
console.log(`Schede reali con "per chi e'": ${conVerdetto} su ${reali}`);
console.log('Ricordati di rigenerare i documenti: npm run stato && npm run audit:llms');
