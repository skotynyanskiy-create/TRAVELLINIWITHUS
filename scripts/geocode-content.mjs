/**
 * Geocoding dei ContentItem: nome venue/città → lat/lng via Mapbox Geocoding.
 * Riempie `place.coordinates` per gli item che non le hanno ancora, così la
 * mappa (`MapboxWorldMap`) può mostrare pin precisi invece dei marker-paese.
 *
 * Uso:   node scripts/geocode-content.mjs
 * Requisiti: VITE_MAPBOX_TOKEN nell'ambiente (.env, già presente per /mappa).
 *
 * Sicurezza: il token NON viene stampato. Invia a Mapbox solo nomi di luoghi
 * pubblici (nessun dato sensibile). Aggiorna in-place src/data/content-seed.json.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.VITE_MAPBOX_TOKEN;
const SEED = path.join(process.cwd(), 'src', 'data', 'content-seed.json');

if (!TOKEN) {
  console.error('VITE_MAPBOX_TOKEN mancante. Aggiungilo a .env (lo stesso usato da /mappa) e riprova.');
  process.exit(1);
}
if (!fs.existsSync(SEED)) {
  console.error(`Seed non trovato: ${path.relative(process.cwd(), SEED)}`);
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(SEED, 'utf8'));

async function geocode(query) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?limit=1&language=it&access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox ${res.status}`);
  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;
  const [lng, lat] = feature.center;
  return { lat, lng };
}

let done = 0;
let skipped = 0;
let failed = 0;

for (const item of items) {
  if (item.place?.coordinates) {
    skipped++;
    continue;
  }
  const query = [item.place?.name, item.place?.city, item.place?.region, item.place?.country]
    .filter(Boolean)
    .join(', ');
  if (!query) {
    failed++;
    console.warn(`SKIP ${item.id}: luogo vuoto`);
    continue;
  }
  try {
    const coords = await geocode(query);
    if (coords) {
      item.place.coordinates = coords;
      done++;
      console.log(`OK   ${query} -> ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    } else {
      failed++;
      console.warn(`MISS ${query}`);
    }
  } catch (error) {
    failed++;
    console.warn(`ERR  ${query}: ${error.message}`);
  }
  await new Promise((r) => setTimeout(r, 150)); // rate-limit gentile
}

fs.writeFileSync(SEED, JSON.stringify(items, null, 2) + '\n');
console.log(`\nGeocoded ${done}, gia presenti ${skipped}, falliti ${failed}.`);
console.log(`Aggiornato ${path.relative(process.cwd(), SEED)}`);
