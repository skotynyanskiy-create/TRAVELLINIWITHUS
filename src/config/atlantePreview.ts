/**
 * Feature flag per la nuova home "Atlante Vivo" (Fetta 1).
 *
 * Stesso pattern di feature flag ad-ambiente: la rotta di anteprima `/atlante`
 * viene montata solo quando il flag è attivo, così il build di produzione non
 * la include e la `/` attuale (Sentiero) resta intatta fino al cutover deliberato.
 *
 * Dev: aggiungere `VITE_ATLANTE_PREVIEW=true` a `.env.local`.
 * Prod: omettere → la rotta è assente dal bundle.
 *
 * Cutover (più avanti, una riga): puntare la index route a AtlanteHome e
 * rimuovere questo flag + la rotta di anteprima.
 */
export const ATLANTE_PREVIEW = import.meta.env.VITE_ATLANTE_PREVIEW === 'true';
