#!/usr/bin/env node
/**
 * Verifica che /api/** in produzione arrivi alla Cloud Function e non allo
 * shell HTML della SPA.
 *
 * E' il gate chiesto da docs/14_Bugs/BUG_API_ENDPOINTS_SENZA_BACKEND_IN_PROD:
 * il guasto originale era invisibile proprio perche' nessuno controllava il
 * *tipo* della risposta. Un 200 non basta — il rewrite catch-all `**` risponde
 * 200 con `text/html` a qualunque path, /api compreso.
 *
 *   PROD_URL=https://travelliniwithus.it npm run audit:api-live
 *
 * Senza PROD_URL il controllo si dichiara saltato e non blocca: in locale non
 * c'e' niente da verificare, ma il messaggio deve restare visibile.
 */
const target = process.env.PROD_URL || process.env.APP_URL;

if (!target) {
  console.warn(
    '[api-live] SALTATO: ne PROD_URL ne APP_URL sono impostate. ' +
      'Prima di un deploy pubblico eseguire: PROD_URL=https://<dominio> npm run audit:api-live'
  );
  process.exit(0);
}

const origin = target.replace(/\/+$/, '');
const url = `${origin}/api/health`;

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000);

try {
  const response = await fetch(url, {
    signal: controller.signal,
    headers: { Accept: 'application/json' },
  });
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();

  if (contentType.includes('text/html')) {
    const server = response.headers.get('server') || 'sconosciuto';
    const looksLikeAnotherSite = /wp-content|wp-includes/.test(body);
    console.error(
      `[api-live] FAIL ${url} risponde ${response.status} ${contentType} (server: ${server}).\n` +
        (looksLikeAnotherSite
          ? '         La risposta contiene marker WordPress: il dominio NON serve questo\n' +
            '         progetto Firebase. Prima del gate API va ripuntato il DNS/hosting.'
          : "         E' lo shell della SPA: il rewrite /api/** non arriva alla function.\n" +
            '         Verificare `hosting.rewrites` in firebase.json e che la function `api`\n' +
            '         sia deployata in europe-west1.')
    );
    process.exit(1);
  }

  if (!contentType.includes('application/json')) {
    console.error(`[api-live] FAIL ${url} risponde ${response.status} con ${contentType || 'nessun content-type'}.`);
    process.exit(1);
  }

  if (response.status === 503) {
    console.error(
      `[api-live] FAIL ${url} risponde 503: la function e' raggiungibile ma non configurata.\n` +
        '         Mancano APP_URL o FIRESTORE_DATABASE_ID fra i parametri della function.'
    );
    process.exit(1);
  }

  if (response.status !== 200) {
    console.error(`[api-live] FAIL ${url} risponde ${response.status}: ${body.slice(0, 200)}`);
    process.exit(1);
  }

  console.log(`[api-live] OK ${url} -> 200 ${contentType} ${body.slice(0, 120)}`);
} catch (error) {
  console.error(`[api-live] FAIL richiesta a ${url} non riuscita: ${error?.message || error}`);
  process.exit(1);
} finally {
  clearTimeout(timeout);
}
