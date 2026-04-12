/**
 * generate-assets.mjs
 * Generates PWA icons, OG image and favicon.ico from scratch using only Node builtins.
 * Colors: ink #1a1a1a / gold #c4a47c / sand #f9f9f8
 */

import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// ---------- PNG helpers ----------

function crc32(data) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++)
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

/**
 * Generate a solid-color RGBA PNG with an optional centered circle accent.
 * @param {number} w
 * @param {number} h
 * @param {{r,g,b}} bg       background color
 * @param {{r,g,b}} [accent] circle fill (drawn in center, radius = w*0.35)
 */
function makePNG(w, h, bg, accent) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // RGB
  // rest are 0

  const cx = w / 2;
  const cy = h / 2;
  const r2 = accent ? Math.pow(Math.min(w, h) * 0.35, 2) : -1;

  const rowBytes = 1 + w * 3;
  const raw = Buffer.alloc(h * rowBytes);

  for (let y = 0; y < h; y++) {
    raw[y * rowBytes] = 0; // filter None
    for (let x = 0; x < w; x++) {
      const dx = x - cx, dy = y - cy;
      const inCircle = accent && (dx * dx + dy * dy) <= r2;
      const { r, g, b } = inCircle ? accent : bg;
      const off = y * rowBytes + 1 + x * 3;
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b;
    }
  }

  const ihdr = chunk('IHDR', ihdrData);
  const idat = chunk('IDAT', deflateSync(raw, { level: 9 }));
  const iend = chunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ---------- ICO helper (embeds a 32x32 PNG) ----------

function makeICO(pngBuf) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);  // reserved
  header.writeUInt16LE(1, 2);  // type: ICO
  header.writeUInt16LE(1, 4);  // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry[0] = 32; // width (0 = 256)
  dirEntry[1] = 32; // height
  dirEntry[2] = 0;  // color count
  dirEntry[3] = 0;  // reserved
  dirEntry.writeUInt16LE(1, 4);  // planes
  dirEntry.writeUInt16LE(32, 6); // bit count
  dirEntry.writeUInt32LE(pngBuf.length, 8);
  dirEntry.writeUInt32LE(6 + 16, 12); // offset to image data

  return Buffer.concat([header, dirEntry, pngBuf]);
}

// ---------- Brand colors ----------

const INK    = { r: 26,  g: 26,  b: 26  };  // #1a1a1a
const GOLD   = { r: 196, g: 164, b: 124 };  // #c4a47c
const SAND   = { r: 249, g: 249, b: 248 };  // #f9f9f8
const WARM   = { r: 232, g: 218, b: 196 };  // warm sand

// ---------- Generate files ----------

// pwa-192x192.png — ink bg, gold circle
const icon192 = makePNG(192, 192, INK, GOLD);
writeFileSync(join(publicDir, 'pwa-192x192.png'), icon192);
console.log('✓ pwa-192x192.png');

// pwa-512x512.png — ink bg, gold circle
const icon512 = makePNG(512, 512, INK, GOLD);
writeFileSync(join(publicDir, 'pwa-512x512.png'), icon512);
console.log('✓ pwa-512x512.png');

// og-default.png — 1200x630, warm sand bg, gold bar at top (simulated)
const ogBuf = makePNG(1200, 630, WARM, GOLD);
writeFileSync(join(publicDir, 'og-default.png'), ogBuf);
console.log('✓ og-default.png');

// apple-touch-icon.png — 180x180, ink bg, gold circle
const apple = makePNG(180, 180, INK, GOLD);
writeFileSync(join(publicDir, 'apple-touch-icon.png'), apple);
console.log('✓ apple-touch-icon.png');

// favicon.ico — embeds a 32x32 PNG
const fav32 = makePNG(32, 32, INK, GOLD);
const icoBuf = makeICO(fav32);
writeFileSync(join(publicDir, 'favicon.ico'), icoBuf);
console.log('✓ favicon.ico');

console.log('\nDone. Replace these placeholder assets with final brand artwork when ready.');
