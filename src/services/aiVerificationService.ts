/**
 * AI verification client.
 *
 * La chiave Gemini NON sta nel bundle frontend: la chiamata passa attraverso
 * l'endpoint server admin-only `/api/admin/ai-verify` che verifica id-token
 * Firebase + whitelist admin email prima di invocare Gemini server-side
 * (vedi server.ts `verifyOptionalIdToken` + `isAdminEmail`).
 *
 * Questo evita due leak path che il vecchio codice aveva:
 *   1. `VITE_GEMINI_API_KEY` finiva nel bundle pubblico al build
 *   2. `define: { 'process.env.GEMINI_API_KEY' }` in vite.config.ts sostituiva
 *      la stringa con la chiave reale nel bundle
 */
import { auth } from '../lib/firebaseAuth';

type VerifyMode = 'search' | 'maps';

async function callAiVerify(mode: VerifyMode, content: string, title: string): Promise<string> {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) {
    throw new Error('Non autenticato. Effettua login admin per usare la verifica AI.');
  }

  const response = await fetch('/api/admin/ai-verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ mode, content, title }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || `AI verify failed (${response.status})`);
  }

  const data = (await response.json()) as { content?: string };
  return data.content || content;
}

export function verifyWithSearch(content: string, title: string): Promise<string> {
  return callAiVerify('search', content, title);
}

export function verifyWithMaps(content: string, title: string): Promise<string> {
  return callAiVerify('maps', content, title);
}
