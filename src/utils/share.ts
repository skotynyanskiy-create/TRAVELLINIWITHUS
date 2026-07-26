/**
 * Share utility per Travelliniwithus: condivisione nativa tramite Web Share API
 * con fallback trasparente sugli appunti (clipboard).
 */

export interface ShareContentData {
  title: string;
  text?: string;
  url: string;
}

/**
 * Condivide il contenuto tramite navigator.share se disponibile.
 * Se navigator.share non è supportato o fallisce per mancanza di permessi/supporto,
 * esegue il fallback copiando l'URL negli appunti tramite navigator.clipboard.
 *
 * Restituisce true se la condivisione o la copia ha avuto successo, false altrimenti.
 */
export async function shareContent(data: ShareContentData): Promise<boolean> {
  if (typeof window !== 'undefined' && navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (err: unknown) {
      // Se l'utente annulla la condivisione nativa, non considerare come errore fatale
      if (err instanceof Error && err.name === 'AbortError') {
        return false;
      }
    }
  }

  if (typeof window !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(data.url);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
