/**
 * AI verification service — chiama endpoint server-side proxy per Gemini.
 * Gli endpoint sono admin-only (middleware requireAdmin in server.ts):
 * richiedono Authorization: Bearer <firebaseIdToken> + custom claim admin=true.
 * Se auth backend non configurato lato server → risposta 503 graceful (gestita dal chiamante).
 */
import { auth } from '../firebase';

async function callAiEndpoint(path: string, content: string, title: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Sessione scaduta. Effettua di nuovo l'accesso.");
  }
  const token = await user.getIdToken();

  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, title }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Errore durante la verifica.' }));
    throw new Error(error.error || `Verifica fallita: ${response.status}`);
  }

  const data = (await response.json()) as { result: string };
  return data.result;
}

export function verifyWithSearch(content: string, title: string): Promise<string> {
  return callAiEndpoint('/api/ai/verify-search', content, title);
}

export function verifyWithMaps(content: string, title: string): Promise<string> {
  return callAiEndpoint('/api/ai/verify-maps', content, title);
}
