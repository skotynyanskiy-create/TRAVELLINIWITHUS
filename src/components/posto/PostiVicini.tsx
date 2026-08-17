import { MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { postiVicini, formattaDistanza } from '@/src/lib/postiVicini';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import type { ContentItem } from '@/src/types/content';

/**
 * «Nei dintorni» — cosa altro c'e' a poca strada da questo posto.
 *
 * E' la domanda che chiunque si fa arrivando su una scheda («ok, ma cosa c'e'
 * di fianco?») e a cui il sito non rispondeva: da qui si usciva solo verso
 * Instagram o indietro. Le distanze sono calcolate sulle coordinate vere delle
 * schede, quindi non sono inventabili ne' invecchiano.
 *
 * Se entro il raggio non c'e' niente, la sezione **non esiste**: meglio il
 * silenzio che tre riquadri di riempimento.
 */
export default function PostiVicini({ posto }: { posto: ContentItem }) {
  const vicini = postiVicini(posto);
  if (vicini.length === 0) return null;

  return (
    <section aria-labelledby="nei-dintorni" className="mt-16">
      <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <h2
          id="nei-dintorni"
          className="font-serif text-xl font-normal text-[var(--color-ink)] md:text-2xl"
        >
          Nei dintorni
        </h2>
        <Link
          to="/mappa"
          className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-text)] underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          Tutti sulla mappa
        </Link>
      </div>

      {/* Le colonne seguono quante card ci sono davvero. Da quando la selezione
          impone una categoria per slot il numero e' variabile — 1, 2 o 3 — e una
          griglia fissa da tre lasciava un buco a destra che faceva sembrare la
          sezione incompleta invece che essenziale. E' lo stesso difetto della
          colonna «Orari e contatti» che si intitolava a vuoto, spostato di un
          livello: qui non manca il titolo, manca la composizione. */}
      <ul
        className={`mt-6 grid gap-5 ${
          vicini.length === 1
            ? 'sm:grid-cols-1 lg:grid-cols-2'
            : vicini.length === 2
              ? 'sm:grid-cols-2'
              : 'sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {vicini.map(({ item, distanzaKm }, indice) => {
          const disclosure = PARTNERSHIP_LABEL[item.partnership.kind];
          /* La selezione garantisce una categoria diversa per slot, quindi la
             categoria e' l'informazione che distingue una card dall'altra —
             prima qui c'era la citta', che in una sezione intitolata «nei
             dintorni» ripete quello che la distanza dice gia'. Resta
             nell'`aria-label`, dove non costa altezza. */
          const categoria = item.types?.[0];
          return (
            /* Il terzo slot non compare sotto i 640px: tre card impilate sono
               tre schermate su una pagina che stiamo accorciando. */
            <li key={item.id} className={indice === 2 ? 'hidden sm:block' : undefined}>
              <Link
                to={`/posto/${item.id}`}
                className="group block focus-visible:outline-none"
                aria-label={`${item.title}${categoria ? `, ${categoria}` : ''}${
                  item.place.city ? `, ${item.place.city}` : ''
                }, a ${formattaDistanza(distanzaKm)} da qui`}
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-deep)] shadow-[var(--shadow-md)] transition-shadow group-hover:shadow-[var(--shadow-lg)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)] sm:aspect-[4/3]">
                  <OptimizedImage
                    src={item.cover}
                    alt={item.coverAlt ?? item.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 300px"
                    responsiveWidths={[320, 480, 640]}
                    style={{ objectPosition: `50% ${item.coverFocusY ?? 50}%` }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* La distanza sta sull'immagine perche' e' il motivo per cui
                      questa card e' qui: e' l'informazione, non un dettaglio. */}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    <MapPin size={11} aria-hidden /> {formattaDistanza(distanzaKm)}
                  </span>

                  {disclosure && (
                    <span className="absolute right-3 top-3 -rotate-3 whitespace-nowrap rounded-sm border border-[var(--color-accent-on-dark)]/80 bg-black/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-on-dark)] backdrop-blur-sm">
                      {disclosure}
                    </span>
                  )}

                  <span className="absolute inset-x-4 bottom-3">
                    <span className="block truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-on-dark)]">
                      {categoria ?? item.place.city ?? item.place.country}
                    </span>
                    <span className="mt-1 flex items-start gap-1 font-serif text-base leading-tight text-white">
                      <span className="line-clamp-2">{item.title}</span>
                      <ArrowUpRight
                        size={13}
                        className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
