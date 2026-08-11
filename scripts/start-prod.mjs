/**
 * Avvio del server in modalità produzione (self-host).
 *
 * `npm start` era `node server.ts`, e aveva due difetti che si nascondevano a
 * vicenda. Il primo lo si vedeva subito, se solo lo si fosse lanciato: Node non
 * risolve un import TypeScript senza estensione, quindi il comando moriva
 * all'avvio con ERR_MODULE_NOT_FOUND su `src/experience/sentiero/sentieroData`.
 * Il secondo era peggiore e silenzioso: non impostava `NODE_ENV`, e in
 * `server.ts` tutta la protezione della CSP — header applicato a ogni risposta
 * HTML, e rifiuto di partire se `firebase.json` non la dichiara — vive dietro
 * `isProd`. Senza quella variabile il server avrebbe servito pagine senza
 * policy, e senza nemmeno lamentarsi: la garanzia introdotta dal commit
 * 5928395 sarebbe sparita proprio sulla strada che deve proteggere.
 *
 * Un wrapper invece di `cross-env`: la variabile va impostata su Windows come
 * su Linux, e questo repo non ha bisogno di una dipendenza in più per due
 * righe. `tsx` c'è già ed è lo stesso runtime che usa `npm run dev`.
 */
import { spawn } from 'node:child_process';

process.env.NODE_ENV = 'production';

const child = spawn('npx', ['tsx', 'server.ts'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (error) => {
  console.error("Impossibile avviare il server:", error.message);
  process.exit(1);
});
