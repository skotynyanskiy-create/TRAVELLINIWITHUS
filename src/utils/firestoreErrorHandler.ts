import type { Auth } from 'firebase/auth';

// auth viene risolto pigramente per non trascinare firebase/auth nel
// modulepreload eager di ogni rotta. e' usato solo nel ramo errore (diagnostica):
// alla prima chiamata avvia il caricamento del chunk, intanto currentUser resta
// null. Le chiamate successive lo trovano popolato.
let authRef: Auth | null = null;
let authLoading = false;
function ensureAuth() {
  if (authRef || authLoading) return;
  authLoading = true;
  void import('../lib/firebaseAuth').then((mod) => {
    authRef = mod.auth;
  });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  ensureAuth();
  const currentUser = authRef?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  if (typeof window !== 'undefined' && typeof errInfo.error === 'string') {
    const errLower = errInfo.error.toLowerCase();
    if (
      errLower.includes('unavailable') ||
      errLower.includes('offline') ||
      errLower.includes('network')
    ) {
      window.dispatchEvent(
        new CustomEvent('twu:firestore-error', {
          detail: {
            message: 'Connessione al database non disponibile. Verifica la tua connessione.',
            errInfo,
          },
        })
      );
    }
  }

  throw new Error(JSON.stringify(errInfo));
}
