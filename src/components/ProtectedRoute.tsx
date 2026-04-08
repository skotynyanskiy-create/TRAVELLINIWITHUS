import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading, signIn, signOut, isAdmin, authError, clearAuthError } = useAuth();
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const hasPreviewParam = new URLSearchParams(location.search).get('previewAdmin') === '1';

  if (typeof window !== 'undefined' && isLocalHost) {
    if (hasPreviewParam) {
      sessionStorage.setItem('admin-preview', '1');
    }
  }

  const isPreviewAdmin =
    isLocalHost &&
    typeof window !== 'undefined' &&
    sessionStorage.getItem('admin-preview') === '1';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-sand)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
  }

  if (isPreviewAdmin) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-sand)] p-8 text-center">
        <h1 className="mb-6 text-3xl font-serif">Accesso Riservato</h1>
        <p className="mb-8 max-w-md text-zinc-600">
          Questa sezione e accessibile solo agli amministratori autorizzati. Effettua l accesso per continuare.
        </p>
        {authError && (
          <div className="mb-6 max-w-md rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            <p>{authError}</p>
            <button
              type="button"
              onClick={clearAuthError}
              className="mt-3 text-xs font-bold uppercase tracking-widest text-red-700 transition-colors hover:text-red-900"
            >
              Chiudi
            </button>
          </div>
        )}
        <button
          onClick={signIn}
          className="rounded-full bg-[var(--color-ink)] px-8 py-3 text-white transition-colors hover:bg-[var(--color-accent)]"
        >
          Accedi con Google
        </button>
        {isLocalHost && (
          <Link
            to={`${location.pathname}?previewAdmin=1`}
            className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)]"
          >
            Apri anteprima admin locale
          </Link>
        )}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-sand)] p-8 text-center">
        <h1 className="mb-6 text-3xl font-serif">Accesso Negato</h1>
        <p className="mb-8 max-w-md text-zinc-600">
          Questo account non risulta autorizzato per l area amministrativa. Se deve avere accesso, assegna il ruolo <strong>admin</strong> al relativo profilo utente in Firestore.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-[var(--color-ink)] px-8 py-3 text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            Torna alla home
          </Link>
          <button
            onClick={signOut}
            className="rounded-full border border-black/10 px-8 py-3 transition-colors hover:border-black/30"
          >
            Esci
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
