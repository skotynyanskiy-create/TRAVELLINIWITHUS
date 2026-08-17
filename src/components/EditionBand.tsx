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

        {/* >=1024 — **una riga di prosa, non una barra di controlli.**
            Prima i tre nomi stavano qui tipograficamente uguali, distinti da un
            pallino da 6px, con la descrizione relegata a destra e troncata: la
            fascia leggeva come una riga di impostazioni, e l'unica cosa che
            riconfigura il sito intero sembrava una preferenza fra tre.
            Qui l'edizione corrente si **afferma** — nome in serif, descrizione
            attaccata da un trattino, una frase sola — e le altre due stanno a
            destra come uscite quiete. Una testata non si annuncia «EDIZIONE»:
            dichiara quale. */}
        <p className="hidden min-w-0 flex-1 items-baseline gap-2 font-serif text-[13px] lg:flex">
          <span className="shrink-0 text-[10px] font-sans font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
            Edizione
          </span>
          <span className="shrink-0 text-[15px] leading-none text-[var(--color-ink)]">
            {current.title}
          </span>
          {isForced && ownEdition ? (
            <span className="min-w-0 truncate text-[var(--color-muted-fg-2)]">
              — solo su questa pagina.{' '}
              <Link
                to="/"
                className="underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
              >
                La tua resta {ownEdition.title}
              </Link>
            </span>
          ) : (
            <span className="hidden min-w-0 truncate text-[var(--color-muted-fg)] xl:inline">
              — {current.description}
            </span>
          )}
        </p>

        {/* Le altre due edizioni: raggiungibili, mai in competizione con quella
            dichiarata. Sono l'uscita, non tre pari grado. */}
        <div className="hidden shrink-0 items-center gap-3 font-serif text-[13px] lg:flex">
          {AUDIENCE_EDITIONS.filter((choice) => choice.key !== audience).map((choice, index) => (
            <span key={choice.key} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="text-[var(--color-border)]">
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => onSwitch(choice.key)}
                className="flex min-h-6 cursor-pointer items-center whitespace-nowrap text-[var(--color-muted-fg-2)] underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:decoration-[var(--color-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {choice.title}
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
