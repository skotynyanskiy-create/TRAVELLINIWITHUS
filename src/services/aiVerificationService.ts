/**
 * AI verification service — calls server-side endpoints to avoid leaking API keys.
 * The actual Gemini interaction happens in server.ts behind /api/ai/* routes.
 */

export async function verifyWithSearch(content: string, title: string): Promise<string> {
  const response = await fetch('/api/ai/verify-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, title }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Errore durante la verifica.' }));
    throw new Error(error.error || `Verifica fallita: ${response.status}`);
  }

  const data = await response.json() as { result: string };
  return data.result;
}

export async function verifyWithMaps(content: string, title: string): Promise<string> {
  const response = await fetch('/api/ai/verify-maps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, title }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Errore durante la verifica.' }));
    throw new Error(error.error || `Verifica fallita: ${response.status}`);
  }

  const data = await response.json() as { result: string };
  return data.result;
}
