/**
 * Importatore Instagram → ContentItem.
 *
 * Tira giù TUTTI i media reali di @travelliniwithus dall'Instagram Graph API
 * (percorso "Instagram API with Instagram Login": graph.instagram.com/me/media)
 * e li mappa+arricchisce in `ContentItem` riusando i service esistenti.
 *
 * Uso:   IG_GRAPH_TOKEN nel .env, poi `npm run import:instagram`
 * Output: src/data/instagram-import.json (file di REVIEW — NON tocca
 *         content-seed.json, così la curatela a mano dei ~40 posti resta intatta).
 *
 * Sicurezza: il token è un SECRET. Vive solo in .env (gitignored), non viene
 * mai stampato, mai committato, mai esposto al client (`VITE_*`).
 *
 * Nota: l'importazione produce item `isPlaceholder: true` con i campi raw
 * (permalink/cover/caption/data) + arricchimento euristico della caption
 * (hook/prezzo/partner/disclosure). I campi curati (zone/types/luogo) vanno
 * rivisti prima di promuovere gli item in content-seed.json.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { enrichInstagramFeed, type InstagramMedia } from '../src/services/instagramContentAdapter';

const TOKEN = process.env.IG_GRAPH_TOKEN;
const OUT = path.join(process.cwd(), 'src', 'data', 'instagram-import.json');
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const BASE = 'https://graph.instagram.com';

if (!TOKEN) {
  console.error(
    'IG_GRAPH_TOKEN mancante in .env. Aggiungi il token long-lived (Instagram Login) e riprova.'
  );
  process.exit(1);
}

interface MediaPage {
  data?: InstagramMedia[];
  paging?: { next?: string };
}

async function fetchAllMedia(): Promise<InstagramMedia[]> {
  const all: InstagramMedia[] = [];
  let url: string | null = `${BASE}/me/media?fields=${FIELDS}&limit=100&access_token=${TOKEN}`;
  let page = 0;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Instagram API ${res.status}: ${body.slice(0, 240)}`);
    }
    const json = (await res.json()) as MediaPage;
    const batch = json.data ?? [];
    all.push(...batch);
    page += 1;
    console.log(`pagina ${page}: ${batch.length} media (totale ${all.length})`);
    url = json.paging?.next ?? null;
    if (url) await new Promise((r) => setTimeout(r, 200));
  }
  return all;
}

const media = await fetchAllMedia();
const items = enrichInstagramFeed(media);
fs.writeFileSync(OUT, JSON.stringify(items, null, 2) + '\n');

console.log(`\nImportati ${items.length} contenuti reali → ${path.relative(process.cwd(), OUT)}`);
console.log(
  'content-seed.json NON è stato toccato. Rivedi i campi curati prima di promuovere gli item.'
);
