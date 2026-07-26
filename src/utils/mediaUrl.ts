/**
 * Destinazione dei video, configurabile via `VITE_VIDEO_BASE_URL`.
 *
 * I 29 mp4 in `public/video/` pesano 276 MB (13 minuti di verticale 1080p a
 * ~2,7 Mbps: già codificati bene, ricomprimerli farebbe risparmiare il 2%).
 * Firebase Hosting regala 360 MB di transfer al giorno, quindi una dozzina di
 * reel visti esaurisce la quota giornaliera e oltre si paga 0,15 $/GB — un
 * costo che cresce proprio quando il sito inizia a funzionare. Servendoli da un
 * object storage a egress zero il costo resta nullo a qualsiasi volume.
 *
 * Senza la variabile il comportamento è identico a oggi: percorsi relativi
 * serviti da Hosting. Impostarla è quindi l'unico passo per spostare l'egress,
 * senza toccare le 29 voci di `content-seed.json` né il manifest dei reel.
 */
/**
 * Questo modulo viene caricato da due runtime diversi: il bundle browser
 * (Vite, dove esiste `import.meta.env`) e il processo Node del dev server, che
 * importa la stessa libreria contenuti e dove `import.meta.env` e' undefined.
 * Leggere solo il primo faceva crashare `npm run dev` all'avvio.
 */
function readVideoBase(): string {
  const fromVite = import.meta.env?.VITE_VIDEO_BASE_URL;
  if (fromVite) return fromVite;
  if (typeof process !== 'undefined') return process.env?.VITE_VIDEO_BASE_URL ?? '';
  return '';
}

const VIDEO_BASE = readVideoBase().trim().replace(/\/+$/, '');

/** Separata da `resolveVideoUrl` per poterla testare senza dipendere da `import.meta.env`. */
export function joinVideoBase(base: string, path?: string): string | undefined {
  if (!path || !base) return path;
  // Un URL già assoluto viene da una fonte esterna (Instagram, CDN): non riscriverlo.
  if (/^(https?:)?\/\//i.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function resolveVideoUrl(path?: string): string | undefined {
  return joinVideoBase(VIDEO_BASE, path);
}
