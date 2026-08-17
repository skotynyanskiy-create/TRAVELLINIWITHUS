import { Link } from '@/src/components/TransitionLink';
import { AUDIENCE_EDITIONS } from '../config/audienceEditions';
import type { Audience } from '../context/AudienceContext';

interface EditionBandProps {
  audience: Audience;
  userAudience: Audience | null;
  isScrolled: boolean;
  onSwitch: (next: Audience) => void;
}

/**
 * Riga 2 della testata — "la fascia dell'edizione". Sempre 3 segmenti, stessi
 * nomi, stesso ordine, in tutte e tre le edizioni: è l'unico elemento della
 * barra identico ovunque, ed è ciò che lo rende un commutatore e non una
 * navigazione (DESIGN_navbar-premium §2, §4).
 *
 * Sotto `lg` riusa la ricetta del segmented control del drawer mobile (icona
 * 12px + etichetta 10px maiuscolo, attivo su fondo bianco) — non un layout
 * nuovo. Il drawer stesso non cambia: resta l'unico controllo quando questa
 * fascia è scorsa via.
 */
export default function EditionBand({
  audience,
  userAudience,
  isScrolled,
  onSwitch,
}: EditionBandProps) {
  const current =
    AUDIENCE_EDITIONS.find((choice) => choice.key === audience) ?? AUDIENCE_EDITIONS[0];
  // Rotta forzata (es. /collaborazioni con scelta 'viaggiatori' salvata):
  // il segmento attivo si marca come temporaneo invece di mentire in silenzio.
  const isForced = userAudience !== null && userAudience !== audience;
  const ownEdition = isForced
    ? (AUDIENCE_EDITIONS.find((choice) => choice.key === userAudience) ?? null)
    : null;

  return (
    <div
      role="group"
      aria-label="Edizione"
      aria-hidden={isScrolled}
      className={`overflow-hidden transition-[max-height,opacity] duration-300 motion-reduce:transition-none ${
        isScrolled ? 'pointer-events-none max-h-0 opacity-0' : 'max-h-16 opacity-100'
      }`}
    >
      <div className="mx-auto flex h-11 max-w-[1360px] items-center gap-4 px-4 md:h-10 md:px-6">
        {/* <1024: ricetta già validata nel drawer — icona 12 + etichetta 10 maiuscolo. */}
        <div className="flex w-full items-center rounded-full border border-[var(--color-ink)]/8 bg-[var(--color-ink)]/5 p-0.5 lg:hidden">
          {AUDIENCE_EDITIONS.map((choice) => {
            const ChoiceIcon = choice.icon;
            const active = choice.key === audience;
            return (
              <button
                key={choice.key}
                type="button"
                onClick={() => onSwitch(choice.key)}
                aria-current={active ? 'true' : undefined}
                aria-label={`Edizione ${choice.title}`}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-full py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  active
                    ? 'bg-white text-[var(--color-ink)] shadow-2xs'
                    : 'text-[var(--color-ink)]/70'
                }`}
              >
                <ChoiceIcon
                  size={12}
                  className={active ? 'text-[var(--color-accent)]' : 'opacity-60'}
                />
                <span>{choice.title}</span>
              </button>
            );
          })}
        </div>

        {/* >=1024: testata di giornale — eyebrow + i tre nomi su una riga. */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Edizione
          </span>
          <div className="flex items-center gap-2.5 font-serif text-[13px]">
            {AUDIENCE_EDITIONS.map((choice, index) => {
              const active = choice.key === audience;
              return (
                <span key={choice.key} className="flex items-center gap-2.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-[var(--color-border)]">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onSwitch(choice.key)}
                    aria-current={active ? 'true' : undefined}
                    className={`flex min-h-6 cursor-pointer items-center gap-1.5 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                      active
                        ? 'text-[var(--color-ink)]'
                        : 'text-[var(--color-muted-fg-2)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className={
                          isForced
                            ? 'h-1.5 w-1.5 rounded-full border border-[var(--color-accent)]'
                            : 'h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]'
                        }
                      />
                    )}
                    {choice.title}
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* >=1280: metà destra — nota di stato temporaneo o descrizione dell'edizione, mai entrambe. */}
        <div className="hidden min-w-0 flex-1 justify-end xl:flex">
          {isForced && ownEdition ? (
            <Link
              to="/"
              className="flex min-h-6 max-w-md items-center truncate text-[13px] font-serif text-[var(--color-muted-fg-2)] underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
            >
              La tua edizione resta {ownEdition.title}
            </Link>
          ) : (
            <p className="flex min-h-6 max-w-md items-center truncate text-[13px] font-serif text-[var(--color-muted-fg)]">
              {current.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
