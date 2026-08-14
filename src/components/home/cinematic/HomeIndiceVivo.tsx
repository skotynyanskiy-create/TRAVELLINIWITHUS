import { useMemo } from 'react';
import { Map } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import AtlanteCard from '../../atlante/AtlanteCard';
import { CONTENT_ITEMS, getRegistroItems } from '../../../config/contentLibrary';
import { useHomeGridSelection } from '@/src/hooks/useHomeGridSelection';

/**
 * Pagina 02 del taccuino — il registro: l'assaggio dell'archivio dei posti
 * provati. Ogni riga dichiara lo stato della sua scheda: mai più di quello che
 * è verificato.
 *
 * Erano dodici righe sotto un titolo che diceva «Tutti i posti»: ne mostrava
 * dodici su sessantadue, e cinque erano gli stessi posti già stampati come
 * fotografia poco sopra, nella stessa schermata. Un indice che ripete la
 * copertina non è un indice, è la pagina due dello stesso catalogo.
 *
 * Ora sono sei righe che dichiarano il perimetro vero — quante schede sono
 * complete, quante ancora no — e la CTA porta dove stanno tutte. La copertina
 * seleziona, l'archivio archivia.
 */
const COMPLETE = CONTENT_ITEMS.filter((item) => !item.isPlaceholder).length;
const IN_LAVORAZIONE = CONTENT_ITEMS.length - COMPLETE;

export default function HomeIndiceVivo() {
  // Le card della griglia sono già in pagina come fotografia: qui si mostra il
  // resto. Stesso hook della griglia — se le due selezioni divergono anche di
  // un argomento, un posto ricompare in entrambe le sezioni.
  const inCopertina = useHomeGridSelection();
  const items = useMemo(
    () => getRegistroItems(6, new Set(inCopertina.items.map((item) => item.id))),
    [inCopertina]
  );

  return (
    <>
      <div className="mb-10 max-w-2xl text-left">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
          Il registro
        </span>
        <h2
          id="page-02-title"
          className="mt-2 font-serif text-3xl font-normal leading-tight text-[var(--color-ink)] md:text-4xl"
        >
          L&apos;archivio, riga per riga.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-fg)]">
          Su ogni voce trovi cos&apos;è quel posto, dov&apos;è, quando ci siamo stati e a che titolo
          — il prezzo quando l&apos;abbiamo verificato. {COMPLETE} schede sono complete,{' '}
          {IN_LAVORAZIONE} sono ancora in lavorazione: restano nell&apos;archivio, dichiarate per
          quello che sono.
        </p>
      </div>

      <ol className="atlante-ledger">
        {items.map((item, index) => (
          <AtlanteCard key={item.id} item={item} index={index} />
        ))}
      </ol>

      <div className="journal-registry-actions">
        {/* Senza numero: il paragrafo sopra dichiara già complete e in
            lavorazione, e un totale qui faceva a pugni con le altre cifre che
            il visitatore incontra sullo stesso percorso — home, mappa, esplora. */}
        <Link to="/esplora" className="journal-button journal-button--ink">
          Sfoglia il registro completo
        </Link>
        <Link to="/mappa" className="journal-button journal-button--text">
          Vedile sulla mappa <Map size={17} aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
