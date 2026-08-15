import { Car, Clock, CalendarDays, Info } from 'lucide-react';
import type { ContentItem } from '../../types/content';
import { meseAnno } from '../../utils/format';

/**
 * Le informazioni che servono per pianificare: come ci arrivi, quanto ci stai,
 * quando andarci, cosa sapere prima.
 *
 * **Perche' non sta nella carta-timbro** (`SchedaVerifica`). Quella risponde a
 * una domanda sola — «questo posto esiste davvero?» — e vive dentro una faccia
 * ad altezza fissa. Il 2026-08-15 queste righe erano finite li' dentro: il
 * contenuto e' passato da 4 a 8 righe e su mobile la faccia scrollava per il
 * doppio della propria altezza, seppellendo proprio «da sapere», che e' la riga
 * che puo' far cambiare programma a qualcuno. Sono due lavori diversi:
 * dimostrare che il posto e' vero, e aiutare a organizzarsi.
 *
 * Renderizzato SOLO se c'e' almeno un dato. Un campo vuoto non produce una riga
 * vuota, e un blocco senza dati non produce nulla: qui non si stima niente.
 */
export default function PrimaDiAndare({ item }: { item: ContentItem }) {
  const pratico = item.practical;
  const daSapere = pratico?.toKnow ?? [];

  const righe = [
    { icona: Car, etichetta: 'Come ci arrivi', valore: pratico?.gettingThere },
    { icona: Clock, etichetta: 'Quanto ci stai', valore: pratico?.duration },
    { icona: CalendarDays, etichetta: 'Quando', valore: pratico?.when },
  ].filter((r) => Boolean(r.valore));

  if (righe.length === 0 && daSapere.length === 0) return null;

  return (
    <section
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8"
      aria-labelledby="prima-di-andare"
    >
      <h2
        id="prima-di-andare"
        className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]"
      >
        Prima di andare
      </h2>

      {righe.length > 0 && (
        <dl className="mt-5 grid gap-5">
          {righe.map(({ icona: Icona, etichetta, valore }) => (
            <div key={etichetta} className="grid gap-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                <Icona size={15} className="shrink-0 text-[var(--color-muted-fg-2)]" aria-hidden />
                {etichetta}
              </dt>
              <dd className="text-base leading-relaxed text-[var(--color-ink-2)]">{valore}</dd>
            </div>
          ))}
        </dl>
      )}

      {daSapere.length > 0 && (
        <div
          className={righe.length > 0 ? 'mt-6 border-t border-[var(--color-border)] pt-6' : 'mt-5'}
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
            <Info size={15} className="shrink-0 text-[var(--color-muted-fg-2)]" aria-hidden />
            Da sapere
          </p>
          <ul className="mt-3 grid gap-2">
            {daSapere.map((voce) => (
              <li key={voce} className="text-base leading-relaxed text-[var(--color-ink-2)]">
                {voce}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Provenienza dei dati cercati, accanto ai dati che qualifica. Orari,
          prezzi e aperture cambiano: senza la data del controllo chi legge non
          sa quanto fidarsi, e un dato pratico senza provenienza vale meno di
          nessun dato. */}
      {pratico?.checked && (
        <p className="mt-6 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted-fg-2)]">
          Dati cercati su {pratico.checked.source} · ultima verifica:{' '}
          {meseAnno(pratico.checked.at) ?? pratico.checked.at}
        </p>
      )}
    </section>
  );
}
