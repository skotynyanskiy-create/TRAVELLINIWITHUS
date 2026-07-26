/**
 * Stadio 0 — provare il tubo.
 *
 * Firebase Hosting serve solo file statici: il rewrite `**` -> /index.html
 * intercetta anche /api/..., quindi oggi ogni chiamata API riceve lo shell HTML
 * della SPA invece di JSON (misurato: GET /api/health sul dominio del progetto
 * restituisce l'HTML). Questa function esiste per dare una destinazione reale a
 * quel percorso.
 *
 * Qui c'e' volutamente il solo /health: serve a validare rewrite, regione,
 * runtime ed emulatore PRIMA di spostarci le 727 righe di endpoint veri. Se
 * questo non risponde JSON, non ha senso estrarre nulla.
 *
 * JavaScript e non TypeScript di proposito: allo stadio 0 non condividiamo
 * ancora codice con src/, quindi una pipeline di build sarebbe impalcatura
 * costruita prima di servire. Arrivera' allo stadio 2 con il router condiviso.
 */
import { onRequest } from 'firebase-functions/v2/https';

export const api = onRequest(
  {
    region: 'europe-west1',
    // Tetto di spesa e di concorrenza: express-rate-limit tiene lo stato in
    // memoria, quindi ogni istanza ha il proprio contatore. Poche istanze
    // rendono il limite approssimato ma non inutile.
    maxInstances: 3,
    invoker: 'public',
  },
  (req, res) => {
    // Con il rewrite Hosting la function riceve il percorso completo
    // (/api/health); invocata direttamente riceve /health.
    const path = req.path.replace(/^\/api/, '') || '/';

    if (path === '/health') {
      res.json({
        status: 'ok',
        stage: 0,
        runtime: process.version,
        receivedPath: req.path,
      });
      return;
    }

    res.status(404).json({ error: 'not_found', receivedPath: req.path });
  }
);
