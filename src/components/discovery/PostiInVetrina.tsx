import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { PARTNERSHIP_LABEL } from '@/src/types/content';
import type { ContentItem } from '@/src/types/content';

/**
 * I primi posti veri, dentro l'apertura di «Esplora».
 *
 * Prima il primo schermo della pagina della scoperta non conteneva **niente da
 * scoprire**: occhiello, titolo, sottotitolo, campo di ricerca e quattro
 * pastiglie su fondo vuoto, con meta' fascia inutilizzata. La prima scheda di
 * un posto compariva a 2481px — tre schermate sotto — mentre il sito possiede
 * 29 copertine reali prese dai reel.
 *
 * **Non e' decorazione: segue i filtri.** Riceve la stessa lista gia' filtrata
 * per zona e tipo che alimenta la griglia sotto, quindi stringendo la ricerca
 * cambia anche qui. Una vetrina che restasse ferma sarebbe un poster.
 *
 * Entrano solo schede verificate: su un placeholder si atterrerebbe su una
 * pagina vuota. Se non ne resta nessuna, la vetrina sparisce invece di
 * mostrare riquadri finti.
 */
export default function PostiInVetrina({
  items,
  quanti = 4,
}: {
  items: ContentItem[];
  quanti?: number;
}) {
  const scelti = items.filter((item) => !item.isPlaceholder && item.cover).slice(0, quanti);
  if (scelti.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
        Ci siamo stati
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {scelti.map((item) => {
          const disclosure = PARTNERSHIP_LABEL[item.partnership.kind];
          return (
            <li key={item.id}>
              <Link
                to={`/posto/${item.id}`}
                className="group block focus-visible:outline-none"
                aria-label={`${item.title}, ${item.place.city ?? item.place.country}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-deep)] shadow-[var(--shadow-md)] transition-shadow group-hover:shadow-[var(--shadow-lg)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)]">
                  {/* `coverFocusY` sposta il crop verso il basso: le copertine
                      sono frame di reel con la title-card impressa in cima. */}
                  <OptimizedImage
                    src={item.cover}
                    alt={item.coverAlt ?? item.title}
                    sizes="(min-width: 1024px) 190px, 45vw"
                    responsiveWidths={[320, 480]}
                    style={{ objectPosition: `50% ${item.coverFocusY ?? 50}%` }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Velatura alta e con passaggio intermedio: l'etichetta
                      della citta' e' in arancione e cadeva nella parte debole
                      del gradiente, sopra zone chiare dell'immagine. */}
                  <span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

                  {disclosure && (
                    <span className="absolute right-2 top-2 -rotate-3 whitespace-nowrap rounded-sm border border-[var(--color-accent-on-dark)]/80 bg-black/50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-on-dark)] backdrop-blur-sm">
                      {disclosure}
                    </span>
                  )}

                  <span className="absolute inset-x-3 bottom-2.5">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-on-dark)]">
                      {item.place.city ?? item.place.country}
                    </span>
                    <span className="mt-0.5 flex items-start gap-1 font-serif text-sm leading-tight text-white">
                      <span className="line-clamp-2">{item.title}</span>
                      <ArrowUpRight
                        size={12}
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
    </div>
  );
}
