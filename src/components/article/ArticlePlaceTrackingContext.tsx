import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PlaceReference } from '../../lib/articlePlaceReferences';

/**
 * Slug dell'articolo + posizione (1-based, ordine di prima apparizione) di
 * ogni `/posto/:id` citato nel corpo. Attraversa il confine `:::posto` /
 * link in prosa: entrambi leggono da qui per l'evento `article_place_click`.
 *
 * Vive interamente dentro il chunk lazy di `ArticleMarkdownBody` (Provider e
 * consumer sono entrambi importati solo da li'), quindi non pesa sul chunk
 * eager `Articolo-*.js`.
 */
interface ArticlePlaceTracking {
  slug: string;
  positions: Map<string, number>;
}

const EMPTY: ArticlePlaceTracking = { slug: '', positions: new Map() };

const ArticlePlaceTrackingContext = createContext<ArticlePlaceTracking>(EMPTY);

export function ArticlePlaceTrackingProvider({
  slug,
  references,
  children,
}: {
  slug: string;
  references: PlaceReference[];
  children: ReactNode;
}) {
  const value = useMemo<ArticlePlaceTracking>(
    () => ({ slug, positions: new Map(references.map((ref) => [ref.id, ref.position])) }),
    [slug, references]
  );

  return (
    <ArticlePlaceTrackingContext.Provider value={value}>
      {children}
    </ArticlePlaceTrackingContext.Provider>
  );
}

export function useArticlePlaceTracking(): ArticlePlaceTracking {
  return useContext(ArticlePlaceTrackingContext);
}
