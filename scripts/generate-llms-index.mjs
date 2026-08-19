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
const OUT_FULL = path.join(ROOT, 'public/llms-full.txt');
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
/* Fino al 2026-08-15 qui si contavano i verdetti. Sono stati tolti: il sito
   descrive e informa, non giudica. Al loro posto si conta cio' che ha preso il
   loro ruolo, cioe' l'informazione pratica — e si conta un campo vero, non la
   presenza del blocco, altrimenti un `practical: {}` gonfierebbe il numero. */
const haPratico = (item) =>
  Boolean(
    item.practical &&
    (item.practical.gettingThere ||
      item.practical.duration ||
      item.practical.when ||
      item.practical.toKnow?.length)
  );
const withPractical = real.filter(haPratico).length;

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
- ${schede(withPractical)} ${riportano(withPractical)} informazioni pratiche verificate (come arrivarci, quanto ci stai, cosa sapere prima).

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
- ${schede(real.length - withPractical)} su ${real.length} non ${riportano(real.length - withPractical)} ancora informazioni pratiche.
- Il registro non contiene voti, punteggi ne' verdetti: descrive i posti e
  lascia a chi legge la decisione se andarci.

## Dove sono i dati

- Schede posto: ${SITE}/posto/<id>
- Archivio navigabile: ${SITE}/esplora
- Mappa dei posti: ${SITE}/mappa
- Chi scrive: ${SITE}/chi-siamo
- Collaborazioni: ${SITE}/collaborazioni
`;

/* `llms-full.txt` conteneva itinerari dettagliati di Dolomiti, Puglia,
   Sardegna, Costiera Amalfitana, Giappone e Islanda — passi panoramici, JR
   Pass, aurora boreale. Nessuno di quei luoghi e' nel registro: era un
   inventario di contenuti inventato, presentato agli assistenti AI come se
   fosse il catalogo del sito.
   La versione "full" di un indice deve essere il dato esteso, non la prosa
   promozionale: qui e' il registro riga per riga, con quello che c'e' e senza
   riempire i buchi. Una scheda senza prezzo lo dice; non lo stima. */
const DISCLOSURE = {
  organic: 'nessun accordo',
  adv: 'pubblicita a pagamento',
  invited: 'ospiti della struttura',
  gifted: 'prodotto ricevuto in regalo',
  collaboration: 'collaborazione',
  affiliate: 'link di affiliazione',
};

const row = (item) => {
  const dove = [item.place?.name, item.place?.city, item.place?.region, item.place?.country]
    .filter(Boolean)
    .join(', ');
  const parti = [`- ${item.title} — ${dove}`];
  parti.push(`  url: ${SITE}/posto/${item.id}`);
  if (item.place?.coordinates?.lat != null) {
    parti.push(`  coordinate: ${item.place.coordinates.lat}, ${item.place.coordinates.lng}`);
  }
  parti.push(
    item.value?.price
      ? `  prezzo rilevato: ${item.value.price}`
      : '  prezzo: non rilevato, non stimato'
  );
  if (item.publishedAt)
    parti.push(`  video girato sul posto, pubblicato il ${item.publishedAt.slice(0, 10)}`);
  parti.push(`  rapporto commerciale: ${DISCLOSURE[item.partnership?.kind] ?? 'non dichiarato'}`);
  /* `toKnow` e' una lista, gli altri sono prosa: la stessa funzione appiattisce
     entrambi, cosi' una voce futura importata come array non rompe il file. */
  const frase = (value) => (Array.isArray(value) ? value.join('; ') : value)?.trim();
  const pratico = item.practical;
  if (item.place?.address) parti.push(`  indirizzo: ${item.place.address}`);
  if (frase(pratico?.gettingThere)) parti.push(`  come arrivarci: ${frase(pratico.gettingThere)}`);
  if (frase(pratico?.duration)) parti.push(`  quanto ci stai: ${frase(pratico.duration)}`);
  if (frase(pratico?.when)) parti.push(`  quando: ${frase(pratico.when)}`);
  if (frase(pratico?.toKnow)) parti.push(`  da sapere: ${frase(pratico.toKnow)}`);
  if (pratico?.checked?.source) {
    parti.push(`  dati cercati su ${pratico.checked.source}, verificati il ${pratico.checked.at}`);
  }
  return parti.join('\n');
};

const outFull = `# Travelliniwithus — registro esteso

Generato da \`src/data/content-seed.json\` con
\`node scripts/generate-llms-index.mjs\`. Indice sintetico: ${SITE}/llms.txt

Ogni voce e' un posto visitato di persona. Dove un dato manca, e' scritto che
manca: nessun prezzo stimato, nessun dato dedotto. La data e' quella del
video girato sul posto.

${real.map(row).join('\n\n')}
`;

const check = process.argv.includes('--check');
const files = [
  [OUT, out, 'public/llms.txt'],
  [OUT_FULL, outFull, 'public/llms-full.txt'],
];

if (check) {
  const stale = files.filter(([file, expected]) => {
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    return current !== expected;
  });
  if (stale.length > 0) {
    console.error(
      `FAIL ${stale.map(([, , label]) => label).join(' e ')} indietro rispetto al registro. Esegui: node scripts/generate-llms-index.mjs`
    );
    process.exit(1);
  }
  console.log('PASS llms.txt e llms-full.txt sono allineati al registro.');
} else {
  for (const [file, content] of files) fs.writeFileSync(file, content);
  console.log(
    `Rigenerati llms.txt e llms-full.txt: ${real.length} posti, ${countries.length} paesi, ${withPrice} con prezzo, ${withPractical} con informazioni pratiche.`
  );
}
