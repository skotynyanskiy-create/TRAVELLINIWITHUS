/**
 * Admin policy — claim-first con email fallback TRANSITORIO.
 *
 * Architettura target (post Fase B pre-go-live):
 *   Il permesso admin deriva ESCLUSIVAMENTE da Firebase custom claim `admin=true`
 *   assegnato via `scripts/set-admin-claim.mjs`. Zero email hardcoded.
 *
 * Stato attuale (Fase A):
 *   Il claim NON è ancora assegnato perché Firebase Admin SDK non è configurato
 *   in dev. Per non bloccare lo sviluppo editoriale, manteniamo una fallback list
 *   di email come "admin emeriti".
 *
 * ⚠️ DA RIMUOVERE PRE-GO-LIVE:
 *   1. Eseguire `node scripts/set-admin-claim.mjs grant <email-ufficiale-travellini>`
 *   2. Verificare login + accesso dashboard via claim
 *   3. Svuotare `ADMIN_EMAILS_FALLBACK` a `[]`
 *   4. Rimuovere branch fallback da firestore.rules `isAdmin()`
 *   5. Redeploy rules + frontend
 *   Vedi `docs/LAUNCH_CHECKLIST.md` sezione "Custom Claims migration".
 */
import type { User } from 'firebase/auth';

/**
 * @deprecated TRANSITORIO — sostituire con custom claim prima del go-live.
 * Email autorizzate come admin finché il claim non è assegnato.
 */
export const ADMIN_EMAILS_FALLBACK: string[] = ['skotynyanskiy@gmail.com'];

/**
 * @deprecated Usare `isAdminUser(user)` che supporta anche custom claim.
 * Mantenuto per compat con codice esistente.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS_FALLBACK.includes(email.toLowerCase());
}

/**
 * Controlla se l'utente corrente ha permessi admin.
 * Preferenza: custom claim `admin=true`. Fallback: email nella lista (Fase A).
 *
 * Async perché `getIdTokenResult()` fa fetch/decode del token.
 */
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    if (tokenResult.claims.admin === true) {
      return true;
    }
  } catch {
    // Token check fallito — procedi con fallback
  }
  // Fallback transitorio via email
  return isAdminEmail(user.email);
}
