/**
 * Admin policy: custom-claim only.
 *
 * Il permesso admin deriva esclusivamente da Firebase custom claim `admin=true`
 * assegnato via `scripts/set-admin-claim.mjs`. Nessuna email hardcoded concede
 * accesso admin: se il claim manca, l'utente puo autenticarsi ma non accede al CMS.
 */
import type { User } from 'firebase/auth';

/**
 * Mantenuto per compatibilita di firma, ma svuotato per il go-live.
 * L'accesso admin ora e governato esclusivamente dai Custom Claims.
 */
export const ADMIN_EMAILS_FALLBACK: string[] = [];

/**
 * @deprecated Usare `isAdminUser(user)` che supporta custom claim.
 */
export function isAdminEmail(_email?: string | null): boolean {
  return false;
}

/**
 * Controlla se l'utente corrente ha permessi admin.
 * Autorizzazione: custom claim `admin=true`.
 */
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    if (tokenResult.claims.admin === true) {
      return true;
    }
  } catch {
    console.error('Failed to verify admin custom claims');
  }
  return false;
}
