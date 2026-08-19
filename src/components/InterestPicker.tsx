import { useEffect, useState } from 'react';
import { Compass, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { getAudienceInterests } from '../config/audienceInterests';
import { useAudience } from '../context/AudienceContext';
import { usePersonalizedInterest } from '../hooks/usePersonalizedInterest';
import { clearPersonalizationSignals } from '../lib/personalization';
import { canLoad, onConsentChange } from '../lib/consent';
import { trackEvent } from '../services/analytics';

export default function InterestPicker() {
  const { audience, setInterest, clearInterest } = useAudience();
  const { interest, source } = usePersonalizedInterest();
  const choices = getAudienceInterests(audience);
  const [canRememberInterest, setCanRememberInterest] = useState(() => canLoad('personalization'));

  useEffect(
    () => onConsentChange((consent) => setCanRememberInterest(consent.personalization)),
    []
  );

  const choose = (interestId: (typeof choices)[number]['id']) => {
    setInterest(interestId);
    trackEvent('personalization_interest_select', { audience, interest: interestId });
  };

  const reset = () => {
    clearInterest();
    clearPersonalizationSignals();
    trackEvent('personalization_reset', { audience });
  };

  return (
    <section
      id="personalizza-esperienza"
      aria-labelledby="personalizza-esperienza-title"
      className="border-b border-[var(--color-border)] bg-[var(--color-sand)] py-10 md:py-14"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                <SlidersHorizontal size={13} aria-hidden /> Esperienza su misura
              </p>
              <h2
                id="personalizza-esperienza-title"
                className="mt-2 font-serif text-2xl leading-tight text-[var(--color-ink)] md:text-3xl"
              >
                Cosa cerchi oggi?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">
                Scegli un punto di partenza: riordiniamo contenuti e prossimi passi senza nascondere
                il resto.
              </p>
            </div>
            {interest && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted-fg)]">
                <Compass size={14} aria-hidden className="text-[var(--color-accent)]" />
                {source === 'inferred'
                  ? 'Adattato dalle tue esplorazioni'
                  : canRememberInterest
                    ? 'Scelta ricordata'
                    : 'Scelta valida per questa sessione'}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Interessi">
            {choices.map((choice) => {
              const selected = interest === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose(choice.id)}
                  className={`min-h-24 rounded-[var(--radius-lg)] border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    selected
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-[var(--shadow-sm)]'
                      : 'border-[var(--color-border)] bg-white hover:-translate-y-0.5 hover:border-[var(--color-accent)]'
                  }`}
                >
                  <span className="block font-serif text-lg text-[var(--color-ink)]">
                    {choice.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--color-muted-fg)]">
                    {choice.description}
                  </span>
                </button>
              );
            })}
          </div>

          {!canRememberInterest && (
            <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              Senza il consenso alla personalizzazione, questa scelta non viene salvata e si azzera
              alla chiusura della sessione.
            </p>
          )}

          {interest && (
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex min-h-10 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted-fg)] transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <RotateCcw size={14} aria-hidden /> Azzera preferenze
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
