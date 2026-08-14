import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Baby, BriefcaseBusiness, Compass } from 'lucide-react';
import { useAudience, type Audience } from '../context/AudienceContext';
import { canLoad, hasRespondedToConsent, onConsentChange } from '../lib/consent';
import { trackAnalyticsEvent } from '../services/analytics';

/**
 * Porta d'ingresso a 3 vie (decision 2026-07-24): al primo accesso sulla home
 * l'utente sceglie la sua strada — Viaggiatori, Family, Collaborazioni — e la
 * scelta viene ricordata. Vincoli perf (home LCP è già in zona rossa):
 *  - montaggio DEFERITO post-paint (idle callback, fallback 1.2s)
 *  - solo tipografia, zero immagini
 *  - overlay `fixed` → zero CLS
 * «Decido dopo» sopprime il gate per la sessione (sessionStorage).
 *
 * Il gate attende che il consenso sia stato deciso (2026-08-03). Prima si
 * aprivano insieme e la prima schermata del sito erano due dialoghi
 * sovrapposti: una sola richiesta alla volta, e prima quella che governa il
 * tracciamento dell'altra — `audience_gate_view` non può precedere l'opt-in.
 */

/** Kill-switch: se il CWV audit segnala regressioni, spegnere da qui. */
export const AUDIENCE_GATE_ENABLED = true;

const SESSION_DISMISS_KEY = 'twu_gate_dismissed';

export function wasGateDismissedThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

const CHOICES: Array<{
  key: Audience;
  icon: typeof Compass;
  title: string;
  description: string;
  to: string | null;
}> = [
  {
    key: 'viaggiatori',
    icon: Compass,
    title: 'Viaggiatori',
    description: 'Posti particolari provati di persona: atlante, mappa e come ci siamo andati.',
    to: null, // resta sulla home
  },
  {
    key: 'family',
    icon: Baby,
    title: 'Family',
    description: 'Gravidanza, viaggi col pancione e — presto — col piccolo.',
    to: '/family',
  },
  {
    key: 'brand',
    icon: BriefcaseBusiness,
    title: 'Brand & aziende',
    description: 'Collaborazioni, media kit e come lavoriamo con i partner.',
    to: '/collaborazioni',
  },
];

export default function AudienceGate() {
  const { setAudience } = useAudience();
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [consentSettled, setConsentSettled] = useState(hasRespondedToConsent);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const viewTrackedRef = useRef(false);
  const interactionTrackedRef = useRef(false);

  const trackView = useCallback(() => {
    if (viewTrackedRef.current || !canLoad('analytics')) return;
    viewTrackedRef.current = true;
    trackAnalyticsEvent('audience_gate_view', { entry_path: location.pathname });
  }, [location.pathname]);

  const trackInteraction = useCallback(
    (
      eventName: 'audience_gate_select' | 'audience_gate_dismiss',
      params: Record<string, string>
    ) => {
      if (interactionTrackedRef.current) return;
      interactionTrackedRef.current = true;
      trackAnalyticsEvent(eventName, { entry_path: location.pathname, ...params });
    },
    [location.pathname]
  );

  // Montaggio deferito: mai in competizione col primo paint / LCP.
  useEffect(() => {
    let cancelled = false;
    const show = () => {
      if (!cancelled) setVisible(true);
    };
    // `Window & { requestIdleCallback?: ... }` non rende opzionale niente: in
    // `lib.dom.d.ts` la proprieta' e' gia' dichiarata obbligatoria, e
    // l'intersezione la tiene tale — da cui TS2774 sul controllo qui sotto.
    // Passare da `unknown` rompe l'intersezione e lascia sopravvivere l'opzionale,
    // che e' la verita': su Safari `requestIdleCallback` non esiste.
    const idle = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: object) => number;
      }
    ).requestIdleCallback;
    const handle = idle ? idle(show, { timeout: 1800 }) : window.setTimeout(show, 1200);
    return () => {
      cancelled = true;
      if (idle) {
        (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback?.(
          handle as number
        );
      } else {
        clearTimeout(handle as number);
      }
    };
  }, []);

  // Una richiesta alla volta: finché il banner cookie è sullo schermo il gate
  // resta chiuso, e si apre appena il visitatore ha deciso.
  useEffect(() => {
    if (consentSettled) return;
    return onConsentChange(() => setConsentSettled(true));
  }, [consentSettled]);

  // Il consenso può arrivare dopo il montaggio del gate: conta la vista solo
  // quando il visitatore ha autorizzato analytics, senza registrare nulla prima.
  useEffect(() => {
    if (!visible || dismissed || !consentSettled) return;
    trackView();
    return onConsentChange((consent) => {
      if (consent.analytics) trackView();
    });
  }, [consentSettled, dismissed, trackView, visible]);

  // Focus management: sposta il focus nel dialog, ESC = decido dopo, trap Tab.
  useEffect(() => {
    if (!visible || dismissed || !consentSettled) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>('button, a')?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        dismissForSession('escape');
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const focusables = [...dialog.querySelectorAll<HTMLElement>('button, a[href]')].filter(
        (el) => !el.hasAttribute('disabled')
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // capture: vince sull'handler globale della Navbar (ESC chiude menu).
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, dismissed, consentSettled]);

  const restoreFocus = () => previousFocusRef.current?.focus?.();

  const dismissForSession = (method: 'button' | 'escape') => {
    trackInteraction('audience_gate_dismiss', { method });
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    } catch {
      // sessionStorage negato: il gate resta soppresso solo per questo mount
    }
    setDismissed(true);
    restoreFocus();
  };

  const choose = (choice: (typeof CHOICES)[number]) => {
    trackInteraction('audience_gate_select', { audience: choice.key });
    setAudience(choice.key);
    setDismissed(true);
    if (choice.to) {
      navigate(choice.to);
    } else {
      restoreFocus();
    }
  };

  if (!visible || dismissed || !consentSettled) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-[var(--color-ink)]/45 backdrop-blur-[2px] p-4 sm:items-center motion-safe:animate-[fadeIn_220ms_var(--ease-out,ease-out)]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audience-gate-title"
        className="w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-sand)] p-7 shadow-[var(--shadow-xl)] md:p-9"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[var(--tracking-eyebrow,0.18em)] text-[var(--color-accent-text)]">
          Benvenuti da Rodrigo &amp; Betta
        </p>
        <h2
          id="audience-gate-title"
          className="mt-2 font-serif text-3xl leading-tight text-[var(--color-ink)] md:text-4xl"
        >
          Cosa ti porta qui?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">
          Scegli la tua strada: ti mostriamo solo quello che ti riguarda. Puoi cambiare quando vuoi
          dall&apos;interruttore in alto.
        </p>

        <div className="mt-6 grid gap-3">
          {CHOICES.map((choice) => {
            const ChoiceIcon = choice.icon;
            return (
              <button
                key={choice.key}
                type="button"
                onClick={() => choose(choice)}
                className="group flex w-full items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer md:p-5"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <ChoiceIcon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block font-serif text-xl text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                    {choice.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[var(--color-muted-fg-2)]">
                    {choice.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => dismissForSession('button')}
          className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-fg)] transition-colors hover:text-[var(--color-ink)] cursor-pointer"
        >
          Decido dopo
        </button>
      </div>
    </div>
  );
}
