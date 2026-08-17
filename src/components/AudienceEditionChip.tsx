import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useAudience, type Audience } from '../context/AudienceContext';
import { AUDIENCE_EDITIONS } from '../config/audienceEditions';

interface AudienceEditionChipProps {
  onSwitch: (next: Audience) => void;
}

/**
 * Chip di edizione, attaccato al marchio: sostituisce il bottone account che
 * prima chiudeva modalità, preferiti, lingua e login dietro un solo glifo.
 * Il pallino usa --color-accent, che il tema ridefinisce per audience
 * (index.css `:root[data-audience=...]`) — è letteralmente il colore che il
 * sito è appena diventato.
 *
 * Tre gradini, agganciati ai breakpoint che la navbar usa già:
 *  - < md: solo un pallino 6px `aria-hidden` + testo per lettori di schermo.
 *    Non è un bottone — sotto 24×24 violerebbe WCAG 2.5.8. Il commutatore
 *    vero resta il segmented control del drawer mobile.
 *  - md–lg: pallino + parola, passivo (il drawer resta l'unico controllo).
 *  - ≥ lg: chip interattivo con popover a tre righe.
 */
export default function AudienceEditionChip({ onSwitch }: AudienceEditionChipProps) {
  const { audience } = useAudience();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current =
    AUDIENCE_EDITIONS.find((choice) => choice.key === audience) ?? AUDIENCE_EDITIONS[0];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <span className="flex items-center pl-1.5 md:hidden" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="sr-only">Edizione {current.title}</span>
      </span>

      <span className="hidden items-center gap-1.5 pl-2 font-serif text-[13px] text-[var(--color-ink-2)] md:flex lg:hidden">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        {current.title}
      </span>

      <div className="relative hidden items-center pl-2 lg:flex">
        <span aria-hidden="true" className="mr-2 h-4 w-px bg-[var(--color-border)]" />
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Scegli l'edizione del sito"
          className="flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-full px-1.5 font-serif text-[13px] text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          <span>{current.title}</span>
          <ChevronDown
            size={11}
            aria-hidden="true"
            className={`opacity-60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="menu"
              aria-label="Edizioni del sito"
              className="absolute left-0 top-full z-50 mt-3 w-[22rem] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-2 text-[var(--color-ink)] shadow-2xl backdrop-blur-xl"
            >
              <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                Edizione
              </p>
              {AUDIENCE_EDITIONS.map((choice) => {
                const ChoiceIcon = choice.icon;
                const active = choice.key === audience;
                return (
                  <button
                    key={choice.key}
                    type="button"
                    role="menuitem"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => {
                      onSwitch(choice.key);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                      active ? 'bg-[var(--color-sand)]' : 'hover:bg-[var(--color-sand)]/60'
                    }`}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <ChoiceIcon size={16} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-serif text-[17px] leading-tight text-[var(--color-ink)]">
                        {choice.title}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-snug text-[var(--color-muted-fg-2)]">
                        {choice.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
