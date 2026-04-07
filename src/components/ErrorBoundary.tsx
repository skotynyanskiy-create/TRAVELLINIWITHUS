import { type ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Errore imprevisto';

  return (
    <div role="alert" className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800">
      <h2 className="text-lg font-semibold mb-2">Qualcosa e andato storto</h2>
      <p className="text-sm mb-4">{message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
      >
        Riprova
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Intentionally empty for now.
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
