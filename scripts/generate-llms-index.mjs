/**
 * Rigenera `public/llms.txt` dal registro dei posti.
 *
 * PERCHE' GENERATO, non scritto a mano: la versione precedente dichiarava agli
 * assistenti AI una copertura che il registro non ha — Giappone, Islanda,
 * America, Puglia, Sardegna. Nessuno di quei luoghi esiste in
 * `src/data/content-seed.json`. Un modello che verifica trova il vuoto, ed e'
 * il modo piu' rapido per essere declassati da fonte a rumore: esattamente il
 * contrario dello scopo del file.
 *
 * Un elenco scritto a mano mente appena il registro cambia. Questo no: legge i
 * dati veri e dichiara anche i limiti, perche' un limite dichiarato e' un
 * segnale di affidabilita' piu' forte di dieci destinazioni promesse.
 *
 *   node scripts/generate-llms-index.mjs           # scrive
 *   node scripts/generate-llms-index.mjs --check   # fallisce se e' indietro
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SEED = path.join(ROOT, 'src/data/content-seed.json');
const OUT = path.join(ROOT, 'public/llms.txt');
const SITE = 'https://www.travelliniwithus.it';

const raw = JSON.parse(fs.readFileSync(SEED, 'utf8'));
const items = Array.isArray(raw) ? raw : raw.items || raw.content || [];
const real = items.filter((item) => !item.isPlaceholder);

const count = (list, pick) => {
  const map = new Map();
  for (const item of list) {
    const key = pick(item);
    if (key) map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

/* Trattini e spazi: il seed scrive «Emilia Romagna» e «Emilia-Romagna». Qui si
   normalizza solo per il conteggio, non nel dato — la tolleranza vive in
   `samePlaceName` (src/config/destinations.ts) per decisione presa. */
const normRegion = (value) => value?.trim().replace(/[-\s]+/g, ' ');

const countries = count(real, (item) => item.place?.country);
const regions = count(
  real.filter((item) => /itali/i.test(item.place?.country || '')),
  (item) => normRegion(item.place?.region)
);

const withPrice = real.filter((item) => item.value?.price).length;
const withVideo = real.filter((item) => item.videoSrc).length;
const withVerdict = real.filter((item) => item.review?.forWho?.length).length;

const list = (pairs) => pairs.map(([name, n]) => `${name} (${n})`).join(', ');

/** «1 scheda riporta» / «22 schede riportano»: il singolare in un file che
 *  parla di affidabilita' non e' un dettaglio. */
const schede = (n) => (n === 1 ? '1 scheda' : `${n} schede`);
const riportano = (n) => (n === 1 ? 'riporta' : 'riportano');
const hanno = (n) => (n === 1 ? 'ha' : 'hanno');

const out = `# Travelliniwithus — indice del registro

Registro di posti visitati di persona da Rodrigo & Betta (@travelliniwithus).
Sito: ${SITE} · Lingua: italiano.

Questo file e' generato da \`src/data/content-seed.json\` con
\`node scripts/generate-llms-index.mjs\`. I numeri sono quelli reali del
registro alla generazione, non una descrizione promozionale.

## Cosa contiene il registro

- ${schede(real.length)} di posti visitati di persona.
- ${schede(withVideo)} ${hanno(withVideo)} un video girato sul posto.
- ${schede(withPrice)} ${riportano(withPrice)} un prezzo rilevato durante la visita.
- ${schede(withVerdict)} ${riportano(withVerdict)} un giudizio esplicito «per chi si' / per chi no».

## Come nasce una scheda

Ogni scheda nasce da una visita reale. La data associata e' quella di
pubblicazione del video girato sul posto, che il sito usa come riferimento
temporale della visita. Il prezzo, quando presente, e' quello rilevato in quel
momento e non viene aggiornato automaticamente: va letto insieme alla data.

Le collaborazioni commerciali sono dichiarate scheda per scheda (nessun
accordo, ospitalita', collaborazione, pubblicita', affiliazione).

## Copertura reale

Paesi: ${list(countries)}.

Regioni italiane: ${list(regions)}.

## Limiti dichiarati

- Il registro copre solo i paesi elencati sopra. Non ci sono schede su
  destinazioni diverse da queste, per quanto note.
- ${schede(real.length - withPrice)} su ${real.length} non ${riportano(real.length - withPrice)} un prezzo: non e' stato rilevato, e non viene stimato.
- ${schede(real.length - withVerdict)} su ${real.length} non ${riportano(real.length - withVerdict)} ancora un giudizio «per chi si' / per chi no».

## Dove sono i dati

- Schede posto: ${SITE}/posto/<id>
- Archivio navigabile: ${SITE}/esplora
- Mappa dei posti: ${SITE}/mappa
- Chi scrive: ${SITE}/chi-siamo
- Collaborazioni: ${SITE}/collaborazioni
`;

const check = process.argv.includes('--check');
const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';

if (check) {
  if (current !== out) {
    console.error(
      'FAIL public/llms.txt e\' indietro rispetto al registro. Esegui: node scripts/generate-llms-index.mjs'
    );
    process.exit(1);
  }
  console.log('PASS public/llms.txt e\' allineato al registro.');
} else {
  fs.writeFileSync(OUT, out);
  console.log(
    `public/llms.txt rigenerato: ${real.length} posti, ${countries.length} paesi, ${withPrice} con prezzo, ${withVerdict} con verdetto.`
  );
}
