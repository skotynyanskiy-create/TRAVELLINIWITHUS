import { useEffect, useId, useState } from 'react';
import { Link } from '@/src/components/TransitionLink';
import {
  type ConsentState,
  acceptAll,
  getConsent,
  hasRespondedToConsent,
  rejectAll,
  setConsent,
} from '../lib/consent';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'banner' | 'customize'>('banner');
  const [prefs, setPrefs] = useState<
    Pick<ConsentState, 'analytics' | 'marketing' | 'personalization'>
  >(() => {
    if (typeof window === 'undefined') {
      return {
        analytics: false,
        marketing: false,
        personalization: false,
      };
    }

    const current = getConsent();
    return {
      analytics: current.analytics,
      marketing: current.marketing,
      personalization: current.personalization,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasRespondedToConsent()) {
      const timer = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(timer);
    }
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
      className="fixed inset-x-3 bottom-3 z-[1000] mx-auto max-w-3xl rounded-[var(--radius-md)] border border-white/10 bg-[#0b0805]/85 p-4 text-white shadow-premium backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-5"
    >
      {mode === 'banner' ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex-1">
            <h2 className="hidden text-base font-serif font-semibold text-white sm:block">
              Cookie e privacy
            </h2>
            <p className="text-sm leading-relaxed text-white/80 sm:mt-2">
              <span className="sm:hidden">
                Usiamo cookie per far funzionare il sito e, col tuo ok, per capire come viene usato
                e ricordare le preferenze che scegli.{' '}
              </span>
              <span className="hidden sm:inline">
                Usiamo cookie tecnici necessari al funzionamento del sito e, con il tuo consenso,
                cookie analitici, marketing e preferenze di personalizzazione per migliorare
                l&apos;esperienza.{' '}
              </span>
              <Link
                to="/cookie"
                className="underline decoration-[var(--color-accent)] underline-offset-2 text-white hover:text-[var(--color-accent)] transition-colors"
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
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)] cursor-pointer"
              >
                Accetta
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 hover:border-white/40 cursor-pointer"
              >
                Rifiuta
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMode('customize')}
              className="text-xs font-semibold uppercase tracking-widest text-white/55 transition-colors hover:text-white cursor-pointer"
            >
              Personalizza
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-serif font-semibold text-white">Preferenze cookie</h2>
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
            <ConsentRow
              title="Personalizzazione"
              description="Ricorda localmente gli interessi per ordinare contenuti e suggerimenti pertinenti."
              checked={prefs.personalization}
              onChange={(v) => setPrefs((p) => ({ ...p, personalization: v }))}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)] cursor-pointer"
            >
              Salva preferenze
            </button>
            <button
              type="button"
              onClick={() => setMode('banner')}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 hover:border-white/40 cursor-pointer"
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
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)] disabled:opacity-60 cursor-pointer"
      />
      <label htmlFor={inputId} className="cursor-pointer">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-white/60">{description}</span>
      </label>
    </div>
  );
}
