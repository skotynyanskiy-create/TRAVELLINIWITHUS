import { Map } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import AtlanteCard from '../../atlante/AtlanteCard';
import { getRegistroItems } from '../../../config/contentLibrary';

/**
 * Pagina 02 del taccuino — il registro: l'indice vivo dei posti provati.
 * Alimentato da content-seed (posti reali dai reel del brand); ogni riga
 * dichiara lo stato della sua scheda — mai più di quello che è verificato.
 */
export default function HomeIndiceVivo() {
  const items = getRegistroItems(6);

  return (
    <>
      <div className="mb-10 text-left max-w-2xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent,#c85a32)]">
          Indice Vivo dei Posti Provati
        </span>
        <h2
          id="page-02-title"
          className="mt-2 font-serif text-3xl font-normal leading-tight text-[var(--color-ink)] md:text-4xl"
        >
          Posti provati, uno per uno.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-fg)]">
          Ogni voce nasce da un viaggio vero. Quando la scheda è completa trovi prezzo, posizione e
          verdetto — pubblicati solo dopo averli verificati.
        </p>
      </div>

      <ol className="atlante-ledger">
        {items.map((item, index) => (
          <AtlanteCard key={item.id} item={item} index={index} />
        ))}
      </ol>

      <div className="journal-registry-actions">
        <Link to="/mappa" className="journal-button journal-button--ink">
          Apri la mappa <Map size={17} aria-hidden="true" />
        </Link>
        <Link to="/esplora" className="journal-button journal-button--text">
          Sfoglia tutto l&apos;archivio
        </Link>
      </div>
    </>
  );
}
