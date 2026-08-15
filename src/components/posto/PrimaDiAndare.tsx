import { Car, Clock, CalendarDays } from 'lucide-react';
import type { ContentItem } from '../../types/content';
import { meseAnno } from '../../utils/format';

/**
 * Le informazioni che servono per organizzarsi: come ci arrivi, quanto ci
 * stai, quando andarci.
 *
 * **Perche' non sta nella carta-timbro** (`SchedaVerifica`). Quella risponde a
 * una domanda sola — «questo posto esiste davvero?» — e vive dentro una faccia
 * ad altezza fissa. Il 2026-08-15 queste righe erano finite li' dentro: il
 * contenuto e' passato da 4 a 8 righe e su mobile la faccia scrollava per il
 * doppio della propria altezza. Sono due lavori diversi: dimostrare che il
 * posto e' vero, e aiutare a organizzarsi.
 *
 * `practical.toKnow` non vive piu' qui: e' `CosaSaperePrima`, un blocco
 * proprio subito dopo la descrizione (variante C,
 * `docs/50_Scratch/DESIGN_scheda-posto-533.md`). Questo componente resta per
 * `gettingThere`/`duration`/`when`, che restano rari (43, 1 e 4 schede su
 * 110): quando sono tutti assenti il blocco non esiste, non stampa una card
 * vuota.
 *
 * `mostraProvenienza` arriva da `Posto.tsx`: la riga «Dati cercati su...»
 * vive sotto l'ultimo blocco pratico che renderizza in pagina — se questo
 * componente non ha righe, la riga tocca a `CosaSaperePrima`, non a lui.
 */
export default function PrimaDiAndare({
  item,
  mostraProvenienza,
}: {
  item: ContentItem;
  mostraProvenienza: boolean;
}) {
  const pratico = item.practical;

  const righe = [
    { icona: Car, etichetta: 'Come ci arrivi', valore: pratico?.gettingThere },
    { icona: Clock, etichetta: 'Quanto ci stai', valore: pratico?.duration },
    { icona: CalendarDays, etichetta: 'Quando', valore: pratico?.when },
  ].filter((r) => Boolean(r.valore));

  if (righe.length === 0) return null;

  return (
    <section
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8"
      aria-labelledby="prima-di-andare"
    >
      <h2
        id="prima-di-andare"
        className="font-serif text-xl font-normal text-[var(--color-ink)] md:text-2xl"
      >
        Prima di andare
      </h2>

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

      {/* Provenienza dei dati cercati, accanto ai dati che qualifica. Orari,
          prezzi e aperture cambiano: senza la data del controllo chi legge non
          sa quanto fidarsi, e un dato pratico senza provenienza vale meno di
          nessun dato. Renderizza solo se questo e' l'ultimo blocco pratico
          della pagina (vedi Posto.tsx): mai da sola. */}
      {mostraProvenienza && pratico?.checked && (
        <p className="mt-6 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted-fg-2)]">
          Dati cercati su {pratico.checked.source} · ultima verifica:{' '}
          {meseAnno(pratico.checked.at) ?? pratico.checked.at}
        </p>
      )}
    </section>
  );
}
