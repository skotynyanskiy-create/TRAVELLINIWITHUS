import fs from 'node:fs';
import path from 'node:path';

const assetsDir = path.join(process.cwd(), 'dist', 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('[audit:size] dist/assets not found. Run npm run build first.');
  process.exit(1);
}

const files = fs
  .readdirSync(assetsDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => {
    const sizeKb = fs.statSync(path.join(assetsDir, file)).size / 1024;
    return { file, sizeKb };
  });

const budgets = [
  { name: 'react-core', match: /^react-core-/, maxKb: 320 },
  { name: 'firebase-firestore', match: /^firebase-firestore-/, maxKb: 280 },
  { name: 'mapbox-lazy-route', match: /^mapbox-/, maxKb: 1850 },
  { name: 'charts-lazy-route', match: /^charts-/, maxKb: 410 },
  { name: 'home-route', match: /^Home-/, maxKb: 110 },
  { name: 'article-route', match: /^Articolo-/, maxKb: 90 },
  { name: 'shop-route', match: /^Shop-/, maxKb: 35 },
  { name: 'product-route', match: /^ProductPage-/, maxKb: 30 },
  { name: 'media-kit-route', match: /^MediaKit-/, maxKb: 45 },
  { name: 'collaborazioni-route', match: /^Collaborazioni-/, maxKb: 65 },
];

const totalJsKb = files.reduce((sum, file) => sum + file.sizeKb, 0);
const failures = [];

for (const budget of budgets) {
  const matches = files.filter((file) => budget.match.test(file.file));
  if (matches.length === 0) {
    failures.push(`${budget.name}: bundle not found`);
    continue;
  }

  const largest = matches.reduce((max, file) => (file.sizeKb > max.sizeKb ? file : max));
  const status = largest.sizeKb <= budget.maxKb ? 'PASS' : 'FAIL';
  console.log(
    `[audit:size] ${status} ${budget.name}: ${largest.sizeKb.toFixed(1)} KB / ${budget.maxKb} KB (${largest.file})`
  );

  if (largest.sizeKb > budget.maxKb) {
    failures.push(`${budget.name}: ${largest.sizeKb.toFixed(1)} KB > ${budget.maxKb} KB`);
  }
}

const totalBudgetKb = 4300;
const totalStatus = totalJsKb <= totalBudgetKb ? 'PASS' : 'FAIL';
console.log(`[audit:size] ${totalStatus} total-js: ${totalJsKb.toFixed(1)} KB / ${totalBudgetKb} KB`);
if (totalJsKb > totalBudgetKb) {
  failures.push(`total-js: ${totalJsKb.toFixed(1)} KB > ${totalBudgetKb} KB`);
}

if (failures.length > 0) {
  console.error(`[audit:size] Bundle budget failed:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('[audit:size] Bundle budgets passed.');
}
