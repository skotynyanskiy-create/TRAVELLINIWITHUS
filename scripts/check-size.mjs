import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const assetsDir = path.join(process.cwd(), 'dist', 'assets');
const indexHtmlPath = path.join(process.cwd(), 'dist', 'index.html');

if (!fs.existsSync(assetsDir)) {
  console.error('[audit:size] dist/assets not found. Run npm run build first.');
  process.exit(1);
}

const files = fs
  .readdirSync(assetsDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => {
    const filePath = path.join(assetsDir, file);
    const content = fs.readFileSync(filePath);
    const sizeKb = content.length / 1024;
    const gzipKb = gzipSync(content).length / 1024;
    return { file, sizeKb, gzipKb };
  });

const budgets = [
  { name: 'react-core', match: /^react-core-/, maxKb: 320 },
  { name: 'three-webgl-lazy', match: /^three-/, maxKb: 1650, maxGzipKb: 480 },
  { name: 'firebase-firestore-lazy', match: /^firebase-firestore-/, maxKb: 430, maxGzipKb: 105 },
  { name: 'mapbox-lazy-route', match: /^mapbox-/, maxKb: 1850 },
  { name: 'react-pdf-lazy-export', match: /^react-pdf\.browser-/, maxKb: 1650, maxGzipKb: 560 },
  { name: 'charts-lazy-route', match: /^charts-/, maxKb: 410 },
  { name: 'home-route', match: /^AtlanteHome-/, maxKb: 110 },
  { name: 'article-route', match: /^Articolo-/, maxKb: 90 },
  { name: 'shop-route', match: /^Shop-/, maxKb: 35 },
  { name: 'product-route', match: /^ProductPage-/, maxKb: 30 },
  { name: 'media-kit-route', match: /^MediaKit-/, maxKb: 45 },
  { name: 'collaborazioni-route', match: /^Collaborazioni-/, maxKb: 65 },
];

function getInitialChunkNames() {
  if (!fs.existsSync(indexHtmlPath)) {
    return new Set();
  }

  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  const chunks = new Set();
  for (const match of html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)) {
    chunks.add(match[1]);
  }
  return chunks;
}

function formatSize(file) {
  return `${file.sizeKb.toFixed(1)} KB raw, ${file.gzipKb.toFixed(1)} KB gzip`;
}

const totalJsKb = files.reduce((sum, file) => sum + file.sizeKb, 0);
const totalGzipKb = files.reduce((sum, file) => sum + file.gzipKb, 0);
const initialChunkNames = getInitialChunkNames();
const initialFiles = files.filter((file) => initialChunkNames.has(file.file));
const initialRawKb = initialFiles.reduce((sum, file) => sum + file.sizeKb, 0);
const initialGzipKb = initialFiles.reduce((sum, file) => sum + file.gzipKb, 0);
const failures = [];

const initialBudget = { name: 'initial-js', maxKb: 780, maxGzipKb: 250 };
if (initialFiles.length === 0) {
  failures.push(`${initialBudget.name}: no initial chunks found in dist/index.html`);
} else {
  const initialStatus =
    initialRawKb <= initialBudget.maxKb && initialGzipKb <= initialBudget.maxGzipKb ? 'PASS' : 'FAIL';
  console.log(
    `[audit:size] ${initialStatus} ${initialBudget.name}: ${initialRawKb.toFixed(1)} KB / ${initialBudget.maxKb} KB raw, ${initialGzipKb.toFixed(1)} KB / ${initialBudget.maxGzipKb} KB gzip (${initialFiles.length} chunks)`
  );

  if (initialRawKb > initialBudget.maxKb) {
    failures.push(`${initialBudget.name}: ${initialRawKb.toFixed(1)} KB raw > ${initialBudget.maxKb} KB`);
  }
  if (initialGzipKb > initialBudget.maxGzipKb) {
    failures.push(`${initialBudget.name}: ${initialGzipKb.toFixed(1)} KB gzip > ${initialBudget.maxGzipKb} KB`);
  }
}

for (const budget of budgets) {
  const matches = files.filter((file) => budget.match.test(file.file));
  if (matches.length === 0) {
    failures.push(`${budget.name}: bundle not found`);
    continue;
  }

  const largest = matches.reduce((max, file) => (file.sizeKb > max.sizeKb ? file : max));
  const rawPass = largest.sizeKb <= budget.maxKb;
  const gzipPass = budget.maxGzipKb === undefined || largest.gzipKb <= budget.maxGzipKb;
  const status = rawPass && gzipPass ? 'PASS' : 'FAIL';
  const gzipBudget = budget.maxGzipKb === undefined ? '' : `, ${budget.maxGzipKb} KB gzip`;
  console.log(
    `[audit:size] ${status} ${budget.name}: ${formatSize(largest)} / ${budget.maxKb} KB raw${gzipBudget} (${largest.file})`
  );

  if (!rawPass) {
    failures.push(`${budget.name}: ${largest.sizeKb.toFixed(1)} KB > ${budget.maxKb} KB`);
  }
  if (!gzipPass) {
    failures.push(`${budget.name}: ${largest.gzipKb.toFixed(1)} KB gzip > ${budget.maxGzipKb} KB`);
  }
}

console.log(
  `[audit:size] INFO total-js-all-chunks: ${totalJsKb.toFixed(1)} KB raw, ${totalGzipKb.toFixed(1)} KB gzip (lazy chunks tracked by targeted budgets)`
);

if (failures.length > 0) {
  console.error(`[audit:size] Bundle budget failed:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('[audit:size] Bundle budgets passed.');
}
