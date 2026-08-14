import fs from 'node:fs';
import path from 'node:path';

/**
 * Valida la forma di `src/data/content-seed.json`.
 *
 * Serve perche' `src/config/contentLibrary.ts` importa il JSON con
 * `seed as unknown as ContentItem[]`: quel cast **spegne il typecheck sul
 * file**. Oggi un item con `types: []`, `place.country` mancante o una `zone`
 * non canonica passa typecheck, lint e tutti i test tranne quello su coordinate
 * e cover in `src/config/routeMeta.test.ts`. Con centinaia di schede in arrivo
 * dall'archivio Instagram, un errore di forma non intercettato qui si scopre
 * come pagina rotta in produzione.
 *
 * Uso: `npm run audit:seed`
 */

const root = process.cwd();
const seedPath = path.join(root, 'src', 'data', 'content-seed.json');

const ZONES = ['Italia', 'Europa', 'Asia', 'Americhe', 'Africa', 'Oceania'];
const TYPES = [
  'Posti particolari',
  'Food & Ristoranti',
  'Hotel con carattere',
  "Borghi e città d'arte",
  'Passeggiate panoramiche',
  'Relax, terme e spa',
  'Weekend romantici',
  'Insolito',
];
const MEDIA_TYPES = ['reel', 'post', 'carousel'];
const SOURCES = ['instagram', 'tiktok'];
const PARTNERSHIP_KINDS = ['organic', 'adv', 'invited', 'gifted', 'collaboration', 'affiliate'];

const errori = [];
const avvisi = [];

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const items = Array.isArray(seed) ? seed : (seed.items ?? Object.values(seed).find(Array.isArray));

if (!Array.isArray(items)) {
  console.error('content-seed.json non contiene un array di item.');
  process.exit(1);
}

const visti = new Set();

for (const [i, item] of items.entries()) {
  const dove = item?.id ? `${item.id}` : `item #${i}`;
  const err = (m) => errori.push(`${dove}: ${m}`);
  const avv = (m) => avvisi.push(`${dove}: ${m}`);

  // `cover` non e' qui: su una scheda in lavorazione e' legittimamente vuota e
  // `ContentCard` mostra la targa editoriale al suo posto. Diventa obbligatoria
  // quando la scheda viene pubblicata, piu' sotto.
  for (const campo of [
    'id',
    'source',
    'permalink',
    'mediaType',
    'hook',
    'title',
    'description',
    'zone',
  ]) {
    if (typeof item?.[campo] !== 'string' || item[campo].trim() === '') {
      err(`campo obbligatorio "${campo}" mancante o vuoto`);
    }
  }

  if (typeof item?.isPlaceholder !== 'boolean') err('"isPlaceholder" deve essere un booleano');
  if (item?.id && visti.has(item.id)) err('id duplicato');
  if (item?.id) visti.add(item.id);

  if (item?.source && !SOURCES.includes(item.source)) err(`source "${item.source}" non canonica`);
  if (item?.mediaType && !MEDIA_TYPES.includes(item.mediaType)) {
    err(`mediaType "${item.mediaType}" non canonico`);
  }
  if (item?.zone && !ZONES.includes(item.zone)) err(`zone "${item.zone}" non canonica`);

  if (!Array.isArray(item?.types) || item.types.length === 0) {
    err('"types" deve avere almeno un valore');
  } else {
    for (const t of item.types) if (!TYPES.includes(t)) err(`type "${t}" non canonico`);
  }

  const place = item?.place;
  if (!place || typeof place !== 'object') {
    err('"place" mancante');
  } else {
    if (!place.name?.trim()) err('"place.name" mancante');
    if (!place.country?.trim()) err('"place.country" mancante');
    const c = place.coordinates;
    if (c && (typeof c.lat !== 'number' || typeof c.lng !== 'number')) {
      err('"place.coordinates" presenti ma non numeriche');
    }
  }

  const kind = item?.partnership?.kind;
  if (!kind) err('"partnership.kind" mancante');
  else if (!PARTNERSHIP_KINDS.includes(kind)) err(`partnership.kind "${kind}" non canonico`);

  // Le schede pubblicate hanno requisiti in piu': senza questi la pagina esiste
  // ma non serve a niente, e alcune finiscono in sitemap.
  if (item?.isPlaceholder === false) {
    if (!item?.place?.coordinates?.lat) err('scheda pubblicata senza coordinate');
    if (!item?.cover?.trim()) err('scheda pubblicata senza copertina');
    if (!item?.coverAlt?.trim()) avv('scheda pubblicata senza coverAlt: l’alt ripiega sul titolo');
    if (!item?.review?.forWho) avv('scheda pubblicata senza verdetto "per chi e\'"');
  }
}

const reali = items.filter((i) => i.isPlaceholder === false).length;
console.log(`content-seed.json — ${items.length} voci (${reali} pubblicate)`);

if (avvisi.length > 0) {
  console.log(`\n${avvisi.length} avvisi:`);
  const perTipo = avvisi.reduce((acc, a) => {
    const chiave = a.split(': ').slice(1).join(': ');
    acc[chiave] = (acc[chiave] ?? 0) + 1;
    return acc;
  }, {});
  for (const [msg, n] of Object.entries(perTipo).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)} × ${msg}`);
  }
}

if (errori.length > 0) {
  console.error(`\n${errori.length} ERRORI di forma:`);
  errori.slice(0, 40).forEach((e) => console.error(`  ${e}`));
  if (errori.length > 40) console.error(`  … e altri ${errori.length - 40}`);
  process.exit(1);
}

console.log('\nForma valida: nessun errore.');
