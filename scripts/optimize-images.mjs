#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public/images');
const FORMATS = [
  { ext: 'avif', options: { quality: 55, effort: 6 } },
  { ext: 'webp', options: { quality: 78, effort: 5 } },
];
const RESPONSIVE_WIDTHS = [320, 480, 768];
const RESPONSIVE_DIRS = new Set([
  'brand',
  'destinations',
  'reels',
  // Senza queste due, il mobile scaricava l'arte full-size: home-journal pesa
  // 9 MB e i suoi tre ambienti sono renderizzati dalla home.
  'home-journal',
  'experiences',
  // Cover reali dei posti + texture del layer atlante.
  'atlante',
  // Cover reali dei contenuti Travellini Family (frame reel).
  'family',
  // Immagini alla radice di /images (hero-amalfi & co.): usate come cover
  // fallback da ArchiveCard/regions/articleData — senza varianti scaricavano
  // la base intera (~253 KB webp) in card da ~430px.
  '',
]);
// Directories whose .webp files are ORIGINAL sources (not PNG-derived variants).
// For them we generate the .avif + responsive derivatives; the base .webp IS the
// source, so it is never re-written. Reel covers are extracted video frames (.webp).
const WEBP_SOURCE_DIRS = new Set(['reels', 'family']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (/\.(png|jpe?g)$/i.test(e.name)) files.push(p);
    else if (
      /\.webp$/i.test(e.name) &&
      !/-\d+\.webp$/i.test(e.name) && // skip generated responsive variants
      WEBP_SOURCE_DIRS.has(path.relative(ROOT, dir).split(path.sep)[0])
    )
      files.push(p);
  }
  return files;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function convertOne(file, { force }) {
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const srcStat = await fs.stat(file);
  const relDir = path.relative(ROOT, dir).split(path.sep)[0];
  const metadata = await sharp(file).metadata();
  const summary = { file, originalKB: srcStat.size / 1024, generated: [] };
  const srcIsWebp = /\.webp$/i.test(file);

  for (const { ext, options } of FORMATS) {
    // A .webp source is already its own base .webp — never overwrite it; only add .avif.
    if (ext === 'webp' && srcIsWebp) continue;
    const dest = path.join(dir, `${base}.${ext}`);
    if (!force && (await fileExists(dest))) {
      const s = await fs.stat(dest);
      if (s.mtimeMs > srcStat.mtimeMs) {
        summary.generated.push({ ext, sizeKB: s.size / 1024, skipped: true });
        continue;
      }
    }
    const buf = await sharp(file).toFormat(ext, options).toBuffer();
    await fs.writeFile(dest, buf);
    summary.generated.push({ ext, sizeKB: buf.length / 1024, skipped: false });
  }

  if (RESPONSIVE_DIRS.has(relDir) && metadata.width) {
    for (const width of RESPONSIVE_WIDTHS) {
      if (metadata.width <= width) continue;

      for (const { ext, options } of FORMATS) {
        const dest = path.join(dir, `${base}-${width}.${ext}`);
        if (!force && (await fileExists(dest))) {
          const s = await fs.stat(dest);
          if (s.mtimeMs > srcStat.mtimeMs) {
            summary.generated.push({
              ext: `${width}.${ext}`,
              sizeKB: s.size / 1024,
              skipped: true,
            });
            continue;
          }
        }

        const buf = await sharp(file)
          .resize({ width, withoutEnlargement: true })
          .toFormat(ext, options)
          .toBuffer();
        await fs.writeFile(dest, buf);
        summary.generated.push({
          ext: `${width}.${ext}`,
          sizeKB: buf.length / 1024,
          skipped: false,
        });
      }
    }
  }

  return summary;
}

async function main() {
  const force = process.argv.includes('--force');
  const files = await walk(ROOT);
  console.log(`Optimize ${files.length} images in ${ROOT}\n`);

  let totalOriginal = 0;
  let totalAvif = 0;
  let totalWebp = 0;

  for (const f of files) {
    const r = await convertOne(f, { force });
    totalOriginal += r.originalKB;
    const rel = path.relative(ROOT, r.file);
    const parts = r.generated
      .map((g) => `${g.ext}=${g.sizeKB.toFixed(0)}KB${g.skipped ? '*' : ''}`)
      .join(' ');
    console.log(`  ${rel.padEnd(48)} orig=${r.originalKB.toFixed(0)}KB  ${parts}`);
    for (const g of r.generated) {
      if (g.ext === 'avif') totalAvif += g.sizeKB;
      if (g.ext === 'webp') totalWebp += g.sizeKB;
    }
  }

  console.log('\nTotals:');
  console.log(`  original: ${(totalOriginal / 1024).toFixed(1)} MB`);
  console.log(
    `  avif:     ${(totalAvif / 1024).toFixed(1)} MB  (${((1 - totalAvif / totalOriginal) * 100).toFixed(0)}% smaller)`
  );
  console.log(
    `  webp:     ${(totalWebp / 1024).toFixed(1)} MB  (${((1 - totalWebp / totalOriginal) * 100).toFixed(0)}% smaller)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
