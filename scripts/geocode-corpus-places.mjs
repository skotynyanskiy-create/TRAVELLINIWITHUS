/**
 * Geocodifica inversa dei luoghi del corpus Instagram → `src/data/corpus-places.json`.
 *
 * PERCHE' ESISTE. Questa passata e' gia' stata fatta due volte — la specifica
 * `docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md` dichiara
 * «564 su 564, zero fallimenti» — e **il risultato non e' mai stato salvato**.
 * Ogni volta che serve sapere in che regione sta un luogo, o se un'etichetta e'
 * un locale o una citta', si ricomincia da capo. Questo script persiste.
 *
 * COSA RISOLVE, e sono due cose con una passata sola:
 *
 * 1. **Quali etichette sono amministrative.** «Milano», «Emilia-Romagna»,
 *    «Cuneo» sono geotag Instagram validi ma non sono locali: non possono
 *    diventare una scheda-posto. Distinguerli a occhio non funziona (un elenco
 *    scritto a mano ne prende ~40 su centinaia) e nemmeno per dispersione delle
 *    coordinate — misurato il 2026-08-15: Instagram assegna **una coordinata
 *    unica per pagina-luogo**, quindi «Milano» ha 42 reel a 24 metri di
 *    distanza l'uno dall'altro, esattamente come un ristorante. L'unico segnale
 *    affidabile e' confrontare l'etichetta con il nome amministrativo che
 *    risolve a quelle coordinate.
 * 2. **In che regione/paese sta ogni luogo**, che serve a sapere quali pagine
 *    destinazione si riempirebbero.
 *
 * Nominatim e non Mapbox: e' gratuito, non chiede token (`VITE_MAPBOX_TOKEN`
 * non e' impostato su questa macchina) e fa geocodifica inversa. In cambio
 * impone **max 1 richiesta al secondo** e uno User-Agent identificabile: sono
 * rispettati entrambi, e non vanno alzati.
 *
 * Resumibile per necessita': ~560 luoghi a 1 req/s sono una decina di minuti.
 * Ogni luogo gia' presente nell'output viene saltato, quindi rilanciarlo dopo
 * un'interruzione riprende da dove era.
 *
 *   node scripts/geocode-corpus-places.mjs           # scrive/riprende
 *   node scripts/geocode-corpus-places.mjs --stats   # solo il riepilogo
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CORPUS = path.join(ROOT, 'src/data/instagram-corpus.json');
const OUT = path.join(ROOT, 'src/data/corpus-places.json');
const UA = 'travelliniwithus-site/1.0 (contatto: info@travelliniwithus.it)';
const SOLO_STATS = process.argv.includes('--stats');

/** Normalizza per il confronto etichetta ↔ nome amministrativo. */
const norm = (v) =>
  (v || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* L'etichetta porta spesso il paese in coda («Firenze, Italy», «Shanghai,china»):
   si confronta anche la sola prima parte, altrimenti nessuna citta' matcha. */
const varianti = (etichetta) => {
  const n = norm(etichetta);
  const primaVirgola = norm(etichetta.split(',')[0]);
  return [...new Set([n, primaVirgola])].filter(Boolean);
};

function leggiCorpus() {
  const raw = JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
  const posts = Array.isArray(raw) ? raw : raw.posts || raw.items || [];
  const perEtichetta = new Map();
  for (const p of posts) {
    const nome = p.location?.name?.trim();
    if (!nome) continue;
    if (typeof p.location.lat !== 'number' || typeof p.location.lng !== 'number') continue;
    if (!perEtichetta.has(nome)) {
      perEtichetta.set(nome, { nome, lat: p.location.lat, lng: p.location.lng, reel: 0, plays: 0 });
    }
    const e = perEtichetta.get(nome);
    if (p.tipo === 'reel') e.reel += 1;
    e.plays += p.plays || 0;
  }
  return [...perEtichetta.values()];
}

async function reverse(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}` +
    `&zoom=14&accept-language=it`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const j = await res.json();
  const a = j.address || {};
  return {
    citta: a.city || a.town || a.village || a.municipality || a.county || null,
    regione: a.state || a.region || null,
    paese: a.country || null,
  };
}

const esistenti = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const luoghi = leggiCorpus();

if (!SOLO_STATS) {
  const daFare = luoghi.filter((l) => !esistenti[l.nome]);
  console.log(`${luoghi.length} luoghi con coordinate · ${daFare.length} da risolvere`);

  let i = 0;
  for (const l of daFare) {
    i += 1;
    try {
      const r = await reverse(l.lat, l.lng);
      /* Amministrativo = l'etichetta E' il nome del comune, della regione o del
         paese che risolve a quelle coordinate. Non «contiene»: e' uguale, dopo
         normalizzazione — «Ristorante al Mago» contiene «mago», non e' Albairate. */
      const v = varianti(l.nome);
      const amministrativo = [r.citta, r.regione, r.paese]
        .filter(Boolean)
        .some((x) => v.includes(norm(x)));
      esistenti[l.nome] = { ...r, amministrativo, reel: l.reel, plays: l.plays };
    } catch (e) {
      esistenti[l.nome] = { errore: String(e.message), reel: l.reel, plays: l.plays };
    }
    if (i % 25 === 0 || i === daFare.length) {
      fs.writeFileSync(OUT, JSON.stringify(esistenti, null, 2) + '\n');
      console.log(`  ${i}/${daFare.length} salvati`);
    }
    await new Promise((r) => setTimeout(r, 1100)); // policy Nominatim: max 1/s
  }
  fs.writeFileSync(OUT, JSON.stringify(esistenti, null, 2) + '\n');
}

const voci = Object.entries(esistenti);
const amm = voci.filter(([, v]) => v.amministrativo);
const err = voci.filter(([, v]) => v.errore);
console.log(`\nrisolti        ${voci.length - err.length}/${voci.length}`);
console.log(`amministrativi ${amm.length}  (non possono diventare una scheda-posto)`);
console.log(`locali         ${voci.length - amm.length - err.length}`);
if (err.length) console.log(`errori         ${err.length}`);

const perRegione = new Map();
for (const [, v] of voci) {
  if (v.amministrativo || v.errore || !v.regione) continue;
  perRegione.set(v.regione, (perRegione.get(v.regione) || 0) + 1);
}
console.log('\nluoghi-locale per regione (prime 12):');
for (const [k, n] of [...perRegione.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`  ${String(n).padStart(3)}  ${k}`);
}
