import { useMemo } from 'react';
import { Link } from '@/src/components/TransitionLink';
import { ArrowRight } from 'lucide-react';
import ArchiveCard from './ArchiveCard';
import Section from '../Section';
import {
  EDITORIAL_COLLECTIONS,
  MONTH_LABEL,
  type EditorialCollection,
} from '../../config/editorialCollections';
import { trackEvent } from '../../services/analytics';
import type { ArchiveItem } from '../../utils/contentArchive';

interface EditorialCollectionsProps {
  /** Archivio completo dal quale risolvere gli slug curated. */
  archive: ArchiveItem[];
  /** Source page per analytics (default: /esplora). */
  sourcePage?: string;
  /** linkState propagato alle card per preservare il contesto di ritorno. */
  linkState?: Record<string, unknown>;
}

interface ResolvedCollection extends EditorialCollection {
  items: ArchiveItem[];
}

function resolveCollections(
  archive: ArchiveItem[],
  collections: EditorialCollection[]
): ResolvedCollection[] {
  const archiveById = new Map(archive.map((item) => [item.id, item]));
  return collections
    .map((collection) => ({
      ...collection,
      items: collection.slugs
        .map((slug) => archiveById.get(slug))
        .filter((item): item is ArchiveItem => Boolean(item)),
    }))
    .filter((collection) => collection.items.length >= 2);
}

/**
 * Sezione editoriale curated sopra l'archivio Esplora. Pattern derivato da
 * Atlas Obscura (multi-path discovery con collezioni tematiche) + Roadbook
 * (archivio magazine-style con eyebrow + collezione + griglia 3-col).
 *
 * Renderizza nulla quando:
 *  - Nessuna collezione ha almeno 2 item risolti (archivio vuoto o slug
 *    mancanti). Fallisce silenziosamente, l'archivio sotto resta visibile.
 */
export default function EditorialCollections({
  archive,
  sourcePage = '/esplora',
  linkState,
}: EditorialCollectionsProps) {
  const collections = useMemo(() => resolveCollections(archive, EDITORIAL_COLLECTIONS), [archive]);

  if (collections.length === 0) return null;

  return (
    <Section className="bg-[var(--color-surface-2)]">
      <div className="mb-12 max-w-3xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
          Editorial · {MONTH_LABEL}
        </span>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-[var(--color-ink)] md:text-5xl">
          I posti che stiamo guardando questo mese.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-black/62 md:text-lg">
          Tre collezioni scelte da Rodrigo &amp; Betta. Non escono dai filtri: le mettiamo qui
          perché reggono adesso, in questo mese, non in teoria.
        </p>
      </div>

      <div className="space-y-16">
        {collections.map((collection) => (
          <article key={collection.id}>
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-black/45">
                  {collection.eyebrow}
                </span>
                <h3 className="mt-2 font-serif text-2xl leading-tight text-[var(--color-ink)] md:text-3xl">
                  {collection.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-black/62 md:text-base">
                  {collection.description}
                </p>
              </div>
              {collection.ctaHref && collection.ctaLabel && (
                <Link
                  to={collection.ctaHref}
                  onClick={() =>
                    trackEvent('editorial_collection_cta_click', {
                      source_page: sourcePage,
                      collection_id: collection.id,
                      destination_url: collection.ctaHref,
                    })
                  }
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {collection.ctaLabel} <ArrowRight size={13} />
                </Link>
              )}
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {collection.items.map((item, index) => (
                <ArchiveCard
                  key={item.id}
                  item={item}
                  variant="editorial"
                  className="h-full"
                  linkState={linkState}
                  onCardClick={() =>
                    trackEvent('editorial_collection_card_click', {
                      source_page: sourcePage,
                      collection_id: collection.id,
                      content_id: item.id,
                      position: index,
                    })
                  }
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
