import type { ContentItem } from '../../types/content';
import { meseAnno } from '../../utils/format';

/**
 * «Cosa sapere prima» — i limiti e le particolarita' scritte da Rodrigo e
 * Betta su un posto: chiusure, prenotazione obbligatoria, omonimie da non
 * confondere, chi puo' entrare. E' `practical.toKnow`, promosso da riga
 * annidata dentro «Prima di andare» a blocco proprio, subito dopo la
 * descrizione (variante C, `docs/50_Scratch/DESIGN_scheda-posto-533.md`): il
 * campo copre gia' 49 schede su 110, piu' di prezzo, orari e durata messi
 * insieme.
 *
 * Renderizzato SOLO se `toKnow` ha almeno una voce. Manca su 61 schede su
 * 110: niente titolo, niente card, niente bordo, niente spazio riservato per
 * quelle.
 *
 * `mostraProvenienza` arriva da `Posto.tsx`: la riga «Dati cercati su...»
 * vive sotto l'ultimo blocco pratico che renderizza in pagina — qui se
 * «Prima di andare» e' assente, altrimenti li'. Mai da sola.
 */
export default function CosaSaperePrima({
  item,
  mostraProvenienza,
}: {
  item: ContentItem;
  mostraProvenienza: boolean;
}) {
  const pratico = item.practical;
  const daSapere = pratico?.toKnow ?? [];

  if (daSapere.length === 0) return null;

  return (
    <section
      className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8"
      aria-labelledby="cosa-sapere-prima"
    >
      <h2
        id="cosa-sapere-prima"
        className="font-serif text-xl font-normal text-[var(--color-ink)] md:text-2xl"
      >
        Cosa sapere prima
      </h2>

      <ul className="mt-5 grid gap-2">
        {daSapere.map((voce) => (
          <li key={voce} className="text-base leading-relaxed text-[var(--color-ink-2)]">
            {voce}
          </li>
        ))}
      </ul>

      {/* Provenienza dei dati cercati, accanto ai dati che qualifica. Vedi
          Posto.tsx per la regola di collocazione. */}
      {mostraProvenienza && pratico?.checked && (
        <p className="mt-6 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted-fg-2)]">
          Dati cercati su {pratico.checked.source} · ultima verifica:{' '}
          {meseAnno(pratico.checked.at) ?? pratico.checked.at}
        </p>
      )}
    </section>
  );
}
