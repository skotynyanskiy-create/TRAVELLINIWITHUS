import { type ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';
import { captureException } from '../lib/errorTracking';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Errore imprevisto';

  return (
    <div
      role="alert"
      className="min-h-[70vh] flex items-center justify-center bg-[var(--color-sand)] px-6 py-20"
    >
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
          <AlertTriangle className="text-[var(--color-accent)]" size={32} />
        </div>
        <span className="mb-4 block font-script text-3xl text-[var(--color-accent)]">
          Ops, qualcosa non va
        </span>
        <h1 className="text-display-2 mb-6">
          Qualcosa <span className="italic opacity-60">è andato storto</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-black/70">
          Si è verificato un errore inatteso durante il caricamento di questa pagina. Puoi riprovare
          oppure tornare alla home.
        </p>
        {import.meta.env.DEV && (
          <pre className="mx-auto mb-8 max-w-xl overflow-auto rounded-lg bg-white/70 p-4 text-left text-xs text-black/70">
            {message}
          </pre>
        )}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
          >
            Riprova
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Torna alla home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        captureException(error, {
          source: 'react-error-boundary',
          componentStack: info.componentStack,
        });
      }}
      onReset={() => {
        // Intentionally empty for now.
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
