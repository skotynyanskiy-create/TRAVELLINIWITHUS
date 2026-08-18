import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { useMemo } from 'react';
import { selectHomeGridItems } from '@/src/lib/homeGridSelection';
import { rankByInterest } from '@/src/config/audienceInterests';
import { usePersonalizedInterest } from '@/src/hooks/usePersonalizedInterest';
import { useHomeGridSelection } from '@/src/hooks/useHomeGridSelection';
import { getReelForPosto } from '@/src/config/reels';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import { aMeseAnno } from '@/src/utils/format';

interface GridTile {
  id: string;
  title: string;
  location: string;
  category: string;
  /** Prezzo reale, o la sola fascia quando è tutto ciò che sappiamo. Mai un riempitivo. */
  price: string | null;
  /** Mese della visita — l'unica prova che tutte e 29 le schede reali portano. */
  visited: string | null;
  /** Disclosure AGCOM: ADV / Su invito / … — vuota se il posto è organico. */
  disclosure: string;
  image: string;
  focusY: number;
  link: string;
  description: string;
  isFeatured: boolean;
}

function toGridTile(
  item: ReturnType<typeof selectHomeGridItems>['items'][number],
  featuredId: string | null
): GridTile {
  return {
    id: item.id,
    title: item.title,
    location: item.place.city ?? item.place.region ?? item.place.country,
    category: item.types[0],
    // Era `item.value?.price ?? 'Scheda dal viaggio'`: dove il prezzo mancava,
    // lo slot del prezzo si riempiva di una frase che non è un prezzo. La
    // fascia è un dato vero; il vuoto è meglio di un riempitivo.
    price:
      item.value?.price ??
      (item.value?.budget ? `Budget ${item.value.budget.toLowerCase()}` : null),
    // Stesso ripiego di SchedaVerifica: il manifest dei reel prima, la data
    // dell'item quando il video non è in locale.
    visited: aMeseAnno(getReelForPosto(item.id)?.publishedAt ?? item.publishedAt),
    disclosure: PARTNERSHIP_LABEL[item.partnership.kind],
    image: item.cover,
    focusY: item.coverFocusY ?? 50,
    link: `/posto/${item.id}`,
    description: item.description,
    isFeatured: item.id === featuredId,
  };
}

/** In lettere, perché la voce della home è editoriale e non un contatore.
 *  Il tetto della selezione è GRID_SIZE; la tabella tiene qualche numero in
 *  più perché il tetto è una scelta editoriale e può cambiare. */
const NUMERALE: Record<number, string> = {
  1: 'Un',
  2: 'Due',
  3: 'Tre',
  4: 'Quattro',
  5: 'Cinque',
  6: 'Sei',
  7: 'Sette',
  8: 'Otto',
  9: 'Nove',
};

export default function CleanFeaturedGrid() {
  const { interest } = usePersonalizedInterest();
  const { items, featuredId } = useHomeGridSelection();
  const gridTiles = useMemo(
    () =>
      rankByInterest(items, interest, (item) => item.types).map((item) =>
        toGridTile(item, featuredId)
      ),
    [items, featuredId, interest]
  );
  const numeroPosti = NUMERALE[gridTiles.length] ?? String(gridTiles.length);
  const postiPresi = gridTiles.length === 1 ? 'posto, preso' : 'posti, presi';

  if (gridTiles.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28 text-[var(--color-ink)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
              <Sparkles size={14} />
              Una prima selezione
            </span>
            {/* selectHomeGridItems ne restituisce "fino a" GRID_SIZE: se un
                posto perde la cover o esce dalla selezione la griglia ne mostra
                uno in meno, e un titolo scritto a mano direbbe il falso. Il
                numero si conta dalle tile vere, come impone homeComposition.ts. */}
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              {numeroPosti} {postiPresi} uno per uno.
            </h2>
          </div>
          <Link
            to="/esplora"
            className="mt-4 inline-flex items-center gap-2 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] hover:text-[var(--color-accent-text)] md:mt-0"
          >
            Vedi tutte le destinazioni
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* 3x3 uniform grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {gridTiles.map((tile) => (
            <Link
              key={tile.id}
              to={tile.link}
              className={`group flex flex-col overflow-hidden rounded-[var(--radius-lg,16px)] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                tile.isFeatured
                  ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                  : 'border-[var(--color-border)]'
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
                <OptimizedImage
                  src={tile.image}
                  alt={`${tile.title} — ${tile.location}`}
                  sizes="(max-width: 768px) 92vw, 30vw"
                  responsiveWidths={[320, 480, 768]}
                  style={{ objectPosition: `50% ${tile.focusY}%` }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Qui c'era una stella accent piena accanto a un testo che
                    era o la disclosure («ADV», «Su invito») o «Provato di
                    persona»: una pubblicità vestita da voto, su un sito che i
                    voti li rifiuta per scelta editoriale dichiarata
                    (`types/content.ts`, ContentReview). La disclosure ora è una
                    disclosure — stessa targa scura di ContentCard — e la prova
                    è il mese della visita, scritto in chiaro sotto la foto. */}
                <div className="absolute left-3 top-3 right-3 flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <MapPin size={10} className="text-[var(--color-accent)]" />
                    {tile.location}
                  </span>
                  {tile.disclosure && (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {tile.disclosure}
                    </span>
                  )}
                </div>

                {tile.isFeatured && (
                  <span className="absolute left-3 bottom-[4.75rem] inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    In evidenza
                  </span>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  {/* accent-on-dark, non accent-text: questo eyebrow sta SULLA
                      foto — accent-text (#c2410c) e' il token per fondo chiaro
                      e sul gradiente scuro sparisce (index.css:44). */}
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-on-dark)]">
                    {tile.category}
                  </span>
                  <h3
                    className={`mt-1 font-serif font-normal leading-snug text-white ${
                      tile.isFeatured ? 'text-2xl' : 'text-xl'
                    }`}
                  >
                    {tile.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <p className="line-clamp-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">
                  {tile.description}
                </p>
                <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                  {/* Prezzo e mese sono i due dati che decidono se vale la pena
                      aprire la scheda. Quando mancano, la riga sparisce invece
                      di riempirsi. */}
                  {(tile.price || tile.visited) && (
                    <p className="text-xs font-semibold text-[var(--color-ink)]">
                      {tile.price}
                      {tile.price && tile.visited ? (
                        <span className="font-normal text-[var(--color-muted-fg)]"> · </span>
                      ) : null}
                      {tile.visited && (
                        <span className="font-normal text-[var(--color-muted-fg)]">
                          ci siamo stati {tile.visited}
                        </span>
                      )}
                    </p>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-text)] transition-transform group-hover:translate-x-1">
                    Apri la scheda &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
