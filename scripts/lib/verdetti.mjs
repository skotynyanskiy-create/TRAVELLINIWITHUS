import fs from 'node:fs';
import path from 'node:path';

/**
 * Formato condiviso fra il generatore della scheda dei verdetti e lo script che
 * la riporta nel seed. Sta qui perche' i due devono leggere lo stesso markdown:
 * se le due regex divergono, il lavoro scritto dall'owner sparisce in silenzio.
 */

export const OUT_NAME = 'VERDETTI_DA_COMPILARE.md';
/** Il nome vecchio diceva 29 quando il seed ne aveva 79. Lo leggiamo ancora per
 *  non perdere quello che fosse gia' stato scritto li' dentro. */
export const LEGACY_NAMES = ['VERDETTI_29_DA_COMPILARE.md'];

export const SCRATCH_DIR = ['docs', '50_Scratch'];

export function schedaPath(root, name = OUT_NAME) {
  return path.join(root, ...SCRATCH_DIR, name);
}

/**
 * I segnaposto del generatore: se il campo contiene ancora l'istruzione, non e'
 * compilato. Il riconoscimento e' per pattern e non per stringa esatta perche'
 * un formattatore markdown riscrive `*corsivo*` in `_corsivo_` e un confronto
 * letterale smetterebbe di funzionare in silenzio — e' successo davvero.
 */
const SEGNAPOSTO = /lascia solo quell[ai] giust[ai]/i;

/** Righe di nota del generatore, non testo dell'owner. Anche qui i marcatori
 *  di corsivo possono essere asterischi o trattini bassi. */
const NOTA_GENERATORE = /^\s*[*_]\(.*\)[*_]\s*$/;

function ripulisci(valore) {
  if (!valore) return '';
  const testo = valore
    .split('\n')
    .filter((riga) => !NOTA_GENERATORE.test(riga))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return SEGNAPOSTO.test(testo) ? '' : testo;
}

const CAMPI = {
  verdict: 'Verdetto',
  notForWho: 'Non fa per te se',
  forWho: 'Per chi',
  price: 'Prezzo reale',
  budget: 'Fascia',
};

/**
 * Legge la scheda e restituisce `{ [id]: { verdict, notForWho, forWho, price,
 * budget } }` con i soli campi davvero compilati. Un file assente non e' un
 * errore: significa che la scheda non e' ancora stata generata.
 */
export function leggiScheda(file) {
  if (!fs.existsSync(file)) return {};
  const testo = fs.readFileSync(file, 'utf8');
  const risultato = {};

  for (const blocco of testo.split(/^---$/m)) {
    const id = blocco.match(/^- `id: ([^`]+)`$/m)?.[1]?.trim();
    if (!id) continue;

    const compilati = {};
    for (const [chiave, etichetta] of Object.entries(CAMPI)) {
      const re = new RegExp(`^\\*\\*${etichetta}:\\*\\*([\\s\\S]*?)(?=\\n\\*\\*|\\n### |$)`, 'm');
      const valore = ripulisci(blocco.match(re)?.[1]);
      if (valore) compilati[chiave] = valore;
    }
    if (Object.keys(compilati).length > 0) risultato[id] = compilati;
  }

  return risultato;
}

/** Unisce quanto trovato nella scheda corrente e in quelle col nome vecchio. */
export function leggiSchedaConLegacy(root) {
  const unione = {};
  for (const nome of [...LEGACY_NAMES, OUT_NAME]) {
    Object.assign(unione, leggiScheda(schedaPath(root, nome)));
  }
  return unione;
}

export function caricaSeed(root) {
  const seedPath = path.join(root, 'src', 'data', 'content-seed.json');
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const items = Array.isArray(seed) ? seed : seed.items || Object.values(seed).find(Array.isArray);
  return { seedPath, seed, items };
}
