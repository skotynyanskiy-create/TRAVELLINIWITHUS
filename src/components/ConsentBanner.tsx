import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  type ConsentState,
  acceptAll,
  getConsent,
  hasRespondedToConsent,
  onConsentReopenRequest,
  rejectAll,
  setConsent,
} from '../lib/consent';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'banner' | 'customize'>('banner');
  const [prefs, setPrefs] = useState<Pick<ConsentState, 'analytics' | 'marketing'>>(() => {
    if (typeof window === 'undefined') {
      return {
        analytics: false,
        marketing: false,
      };
    }

    const current = getConsent();
    return {
      analytics: current.analytics,
      marketing: current.marketing,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timer: number | undefined;
    if (!hasRespondedToConsent()) {
      timer = window.setTimeout(() => setVisible(true), 600);
    }
    const unsubscribe = onConsentReopenRequest(() => {
      const current = getConsent();
      setPrefs({ analytics: current.analytics, marketing: current.marketing });
      setMode('customize');
      setVisible(true);
    });
    return () => {
      if (timer) window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const close = () => setVisible(false);

  const handleAcceptAll = () => {
    acceptAll();
    close();
  };

  const handleRejectAll = () => {
    rejectAll();
    close();
  };

  const handleSave = () => {
    setConsent(prefs);
    close();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Informativa cookie"
      className="fixed inset-x-3 bottom-3 z-[1000] mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white/95 p-4 shadow-premium backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-6"
    >
      {mode === 'banner' ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex-1">
            <h2 className="hidden text-base font-serif font-semibold text-[var(--color-ink)] sm:block">
              Cookie e privacy
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600 sm:mt-2">
              <span className="sm:hidden">
                Usiamo cookie per far funzionare il sito e, col tuo ok, per capire come viene usato.{' '}
              </span>
              <span className="hidden sm:inline">
                Usiamo cookie tecnici necessari al funzionamento del sito e, con il tuo consenso, cookie
                analitici e di marketing per migliorare l&apos;esperienza.{' '}
              </span>
              <Link
                to="/cookie"
                className="underline decoration-[var(--color-accent)] underline-offset-2"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-shrink-0">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Accetta
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded-full border border-black/15 px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-black/30"
              >
                Rifiuta
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMode('customize')}
              className="text-xs font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[var(--color-ink)]"
            >
              Personalizza
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-serif font-semibold text-[var(--color-ink)]">
            Preferenze cookie
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            <ConsentRow
              title="Necessari"
              description="Indispensabili per il funzionamento del sito. Non disattivabili."
              checked
              disabled
            />
            <ConsentRow
              title="Analitici"
              description="Statistiche anonime su come viene usato il sito (Google Analytics)."
              checked={prefs.analytics}
              onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
            />
            <ConsentRow
              title="Marketing"
              description="Pixel per campagne pubblicitarie e retargeting (Meta, TikTok)."
              checked={prefs.marketing}
              onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Salva preferenze
            </button>
            <button
              type="button"
              onClick={() => setMode('banner')}
              className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-black/30"
            >
              Indietro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsentRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const inputId = useId();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/5 bg-[var(--color-sand)]/60 p-3">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)] disabled:opacity-60"
      />
      <label htmlFor={inputId} className="cursor-pointer">
        <span className="block text-sm font-semibold text-[var(--color-ink)]">{title}</span>
        <span className="block text-xs text-zinc-600">{description}</span>
      </label>
    </div>
  );
}
