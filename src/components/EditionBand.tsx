import { Link } from '@/src/components/TransitionLink';
import { AUDIENCE_EDITIONS } from '../config/audienceEditions';
import type { Audience } from '../context/AudienceContext';

interface EditionBandProps {
  audience: Audience;
  userAudience: Audience | null;
  hasChosen: boolean;
  onSwitch: (next: Audience) => void;
}

/**
 * Il commutatore — secondo oggetto contenuto della testata, sotto la pillola
 * del marchio. Non è `fixed`: appartiene al flusso del documento e scorre via
 * con la pagina (la pillola resta appiccicata da sola). Nessun collasso
 * animato, nessuna dipendenza da `isScrolled`.
 *
 * Due forme, decise da `hasChosen` (context, `AudienceContext.tsx`):
 *  - **estesa** (prima visita, `hasChosen === false`) — tre porte pari, nomi
 *    + descrizioni verbatim da `AUDIENCE_EDITIONS`, nessuna velatura, nessun
 *    filo. Sostituisce il gate a schermo intero (spento in `AudienceGate.tsx`).
 *  - **compatta** (dopo la prima scelta) — tre segmenti coi soli nomi. Il
 *    segmento attivo è una velatura (`--color-accent-soft` + `--color-accent-text`
 *    + un filo di 2px `--color-accent` sotto), mai un riempimento pieno, e usa
 *    i token dell'edizione ATTIVA (corretto: l'ambiente coincide col tema).
 *    I due segmenti spenti portano un pallino 7px nel token STATICO della
 *    propria edizione (`--edition-<key>-accent-text` in index.css) — non
 *    quello ambiente — così si vede il colore che si sta scegliendo prima di
 *    leggerlo. Radius dai token (`--radius-lg`), mai `rounded-full`: lascia
 *    aperta la porta a una futura animazione che cambi il raggio con la meta.
 */

const EDITION_DOT_CLASS: Record<Audience, string> = {
  viaggiatori: 'bg-[var(--edition-viaggiatori-accent-text)]',
  family: 'bg-[var(--edition-family-accent-text)]',
  brand: 'bg-[var(--edition-brand-accent-text)]',
};

export default function EditionBand({
  audience,
  userAudience,
  hasChosen,
  onSwitch,
}: EditionBandProps) {
  const isForced = userAudience !== null && userAudience !== audience;
  const ownEdition = isForced
    ? (AUDIENCE_EDITIONS.find((choice) => choice.key === userAudience) ?? null)
    : null;

  // Prima visita: tre porte pari, nessuno stato attivo — la scelta non è
  // ancora stata fatta, quindi non c'è ancora niente da dichiarare attivo.
  //
  // Sotto `sm` le tre porte con descrizione impilate mangiavano metà del
  // primo schermo su OGNI rotta: la prima schermata del sito era wayfinding,
  // non la promessa del brand. La variante mobile riusa il pattern della
  // forma compatta (segmenti a misura di contenuto, mai a capo, provato a
  // 320px) con i pallini-colore su tutte e tre le porte; le descrizioni
  // restano da `sm` in su, dove lo spazio non le fa pagare al hero.
  if (!hasChosen) {
    return (
      <div className="px-4 pt-[76px] pb-5 md:px-6 md:pt-20">
        <div
          role="group"
          aria-label="Scegli l'edizione"
          className="mx-auto flex max-w-full items-stretch justify-center gap-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-sand)] p-1 shadow-[var(--shadow-sm)] sm:hidden"
        >
          {AUDIENCE_EDITIONS.map((edition) => (
            <button
              key={edition.key}
              type="button"
              onClick={() => onSwitch(edition.key)}
              className="flex min-h-[48px] shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-lg)] px-1.5 text-center font-serif text-[13px] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-muted-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <span
                aria-hidden="true"
                className={`h-[7px] w-[7px] shrink-0 rounded-full ${EDITION_DOT_CLASS[edition.key]}`}
              />
              <span className="whitespace-nowrap">{edition.title}</span>
            </button>
          ))}
        </div>
        <div
          role="group"
          aria-label="Scegli l'edizione"
          className="mx-auto hidden max-w-[1360px] grid-cols-1 gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-sand)] p-3 shadow-[var(--shadow-sm)] sm:grid sm:grid-cols-3 sm:gap-3 sm:p-4"
        >
          {AUDIENCE_EDITIONS.map((edition) => (
            <button
              key={edition.key}
              type="button"
              onClick={() => onSwitch(edition.key)}
              className="flex flex-col items-start gap-1 rounded-[var(--radius-lg)] p-3 text-left transition-colors hover:bg-[var(--color-muted-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <span className="font-serif text-[17px] leading-tight text-[var(--color-ink)]">
                {edition.title}
              </span>
              <span className="text-[13px] leading-snug text-[var(--color-muted-fg)]">
                {edition.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 px-4 pt-[76px] pb-5 md:px-6 md:pt-20">
      <div
        role="group"
        aria-label="Scegli l'edizione"
        className="flex max-w-full items-stretch gap-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-sand)] p-1 shadow-[var(--shadow-sm)]"
      >
        {AUDIENCE_EDITIONS.map((edition) => {
          const active = edition.key === audience;
          return (
            <button
              key={edition.key}
              type="button"
              onClick={() => onSwitch(edition.key)}
              aria-current={active ? 'true' : undefined}
              className={`flex min-h-[52px] shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-lg)] px-2.5 text-center font-serif text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:px-7 sm:text-[18px] ${
                active
                  ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent-text)] shadow-[inset_0_-2px_0_var(--color-accent)]'
                  : 'text-[var(--color-muted-fg)] hover:text-[var(--color-ink)]'
              }`}
            >
              {!active && (
                <span
                  aria-hidden="true"
                  className={`h-[7px] w-[7px] shrink-0 rounded-full ${EDITION_DOT_CLASS[edition.key]}`}
                />
              )}
              {/* I segmenti si dimensionano sul contenuto, a ogni larghezza.
                  Con `flex-1` erano tre terzi uguali — 90px a 320px — e due
                  nomi su tre si spezzavano a meta' parola: «Collaborazio / ni»
                  ovunque, piu' «Viaggia / tori» a 320. Nessun cancello lo
                  vedeva, perche' `break-words` teneva l'overflow a zero: era
                  brutto, non rotto. Dando a ciascuno la sua larghezza il
                  surplus di «Family» va dove serve e nessuno va a capo. */}
              <span className="whitespace-nowrap">{edition.title}</span>
            </button>
          );
        })}
      </div>

      {isForced && ownEdition && (
        <p className="text-center text-[11px] text-[var(--color-muted-fg-2)]">
          Solo su questa pagina. La tua edizione resta{' '}
          <Link
            to="/"
            className="underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
          >
            {ownEdition.title}
          </Link>
          .
        </p>
      )}
    </div>
  );
}
