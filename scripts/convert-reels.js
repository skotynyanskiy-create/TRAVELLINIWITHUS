#!/usr/bin/env node
/**
 * convert-reels.js
 *
 * Pipeline asset per i 5 reel Instagram/TikTok di Rodrigo & Betta.
 *
 * Input  : C:\Users\ccocu\Desktop\TRAVELLINIWITHUS\video\WhatsApp Video 2026-05-14*.mp4
 * Output : public/video/reel-{1-5}.webm + public/images/reels/reel-{1-5}-cover.webp
 *
 * - Se ffmpeg è installato (PATH): full pipeline VP9 ~400KB + cover WebP ~80-120KB.
 * - Se ffmpeg manca: fallback graceful — copia i .mp4 originali in public/video/
 *   (file pesanti ~5-6 MB ciascuno), e usa cover placeholder editoriali dalle
 *   destinations esistenti. Stampa le istruzioni per installare ffmpeg.
 *
 * Idempotente: skip file di output già esistenti (a meno di --force).
 */

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const SOURCE_DIR = 'C:\\Users\\ccocu\\Desktop\\TRAVELLINIWITHUS\\video';
const OUT_VIDEO_DIR = join(repoRoot, 'public', 'video');
const OUT_COVER_DIR = join(repoRoot, 'public', 'images', 'reels');

// Cover placeholder mapping (usato quando ffmpeg manca o quando R+B non ha
// ancora generato cover reali). Riusiamo asset destinations già curati.
const PLACEHOLDER_COVERS = [
  'puglia.webp',
  'toscana.webp',
  'dolomiti.webp',
  'sardegna.webp',
  'islanda.webp',
];

const FORCE = process.argv.includes('--force');

function detectFfmpeg() {
  const result = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  return result.status === 0;
}

function findSourceVideos() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`[convert-reels] source dir not found: ${SOURCE_DIR}`);
    process.exit(1);
  }
  return readdirSync(SOURCE_DIR)
    .filter((name) => /\.mp4$/i.test(name))
    .sort()
    .slice(0, 5);
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function copyPlaceholderCover(index) {
  const src = join(repoRoot, 'public', 'images', 'destinations', PLACEHOLDER_COVERS[index]);
  const dst = join(OUT_COVER_DIR, `reel-${index + 1}-cover.webp`);
  if (existsSync(dst) && !FORCE) {
    console.log(`[skip] cover reel-${index + 1} (exists)`);
    return;
  }
  if (!existsSync(src)) {
    console.warn(`[warn] placeholder cover not found: ${src} — skipping cover-${index + 1}`);
    return;
  }
  copyFileSync(src, dst);
  const size = statSync(dst).size;
  console.log(`[copy] reel-${index + 1}-cover.webp (placeholder from ${PLACEHOLDER_COVERS[index]}, ${formatKB(size)})`);
}

function convertWithFfmpeg(srcPath, index) {
  const dstVideo = join(OUT_VIDEO_DIR, `reel-${index + 1}.webm`);
  const dstCover = join(OUT_COVER_DIR, `reel-${index + 1}-cover.webp`);

  if (existsSync(dstVideo) && !FORCE) {
    console.log(`[skip] reel-${index + 1}.webm (exists)`);
  } else {
    const videoResult = spawnSync(
      'ffmpeg',
      [
        '-y',
        '-i',
        srcPath,
        '-c:v',
        'libvpx-vp9',
        '-crf',
        '32',
        '-b:v',
        '450k',
        '-c:a',
        'libopus',
        '-b:a',
        '64k',
        '-vf',
        'scale=-2:720',
        dstVideo,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] }
    );
    if (videoResult.status !== 0) {
      console.error(`[fail] ffmpeg conversion for reel-${index + 1}`);
      return;
    }
    const size = statSync(dstVideo).size;
    console.log(`[ok] reel-${index + 1}.webm (${formatKB(size)})`);
  }

  if (existsSync(dstCover) && !FORCE) {
    console.log(`[skip] cover reel-${index + 1} (exists)`);
  } else {
    const coverResult = spawnSync(
      'ffmpeg',
      [
        '-y',
        '-ss',
        '0',
        '-i',
        srcPath,
        '-frames:v',
        '1',
        '-vf',
        'scale=-1:1080',
        '-q:v',
        '2',
        dstCover,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] }
    );
    if (coverResult.status !== 0) {
      console.warn(`[warn] cover extraction failed for reel-${index + 1}, using placeholder`);
      copyPlaceholderCover(index);
      return;
    }
    const size = statSync(dstCover).size;
    console.log(`[ok] reel-${index + 1}-cover.webp (${formatKB(size)})`);
  }
}

function copyMp4Fallback(srcPath, index) {
  const dst = join(OUT_VIDEO_DIR, `reel-${index + 1}.mp4`);
  if (existsSync(dst) && !FORCE) {
    console.log(`[skip] reel-${index + 1}.mp4 (exists)`);
    return;
  }
  copyFileSync(srcPath, dst);
  const size = statSync(dst).size;
  console.log(`[copy] reel-${index + 1}.mp4 (${formatKB(size)} — fallback, ffmpeg not available)`);
}

function main() {
  console.log('[convert-reels] starting');
  ensureDir(OUT_VIDEO_DIR);
  ensureDir(OUT_COVER_DIR);

  const sources = findSourceVideos();
  if (sources.length === 0) {
    console.error('[convert-reels] no .mp4 found in source dir');
    process.exit(1);
  }

  const hasFfmpeg = detectFfmpeg();
  if (hasFfmpeg) {
    console.log('[convert-reels] ffmpeg detected — full pipeline');
  } else {
    console.log('[convert-reels] ffmpeg NOT detected — fallback mode (copy mp4 + placeholder covers)');
    console.log('[convert-reels] to enable optimal compression install ffmpeg:');
    console.log('[convert-reels]   winget install -e --id Gyan.FFmpeg');
    console.log('[convert-reels]   (or download from https://www.gyan.dev/ffmpeg/builds/)');
  }

  sources.forEach((name, index) => {
    const src = join(SOURCE_DIR, name);
    console.log(`\n[reel ${index + 1}] ${basename(src)}`);
    if (hasFfmpeg) {
      convertWithFfmpeg(src, index);
    } else {
      copyMp4Fallback(src, index);
      copyPlaceholderCover(index);
    }
  });

  console.log('\n[convert-reels] done');
}

main();
