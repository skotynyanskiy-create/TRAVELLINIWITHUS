import { useMemo } from 'react';
import { selectHomeGridItems, type HomeGridSelection } from '@/src/lib/homeGridSelection';
import { selectHomeFeaturedItems } from '@/src/lib/homeContentSelection';
import { compositionFor } from '@/src/config/homeComposition';
import { useAudience } from '@/src/context/AudienceContext';
import { usePersonalizedInterest } from '@/src/hooks/usePersonalizedInterest';

/**
 * Quali posti finiscono nella griglia della home, per la composizione corrente.
 *
 * Sta qui e non dentro `CleanFeaturedGrid` perché la risposta serve a due
 * sezioni: alla griglia per stamparli, e al registro per **non** ristamparli.
 * Ricalcolarla in due posti con argomenti leggermente diversi era già bastato a
 * far ricomparire un posto in entrambe le sezioni.
 */
export function useHomeGridSelection(): HomeGridSelection {
  const { audience } = useAudience();
  const { interest } = usePersonalizedInterest();

  return useMemo(() => {
    const featuredIds = selectHomeFeaturedItems(interest).map((item) => item.id);
    const includesFeaturedSection = compositionFor(audience, interest).sections.includes(
      'featured'
    );
    return selectHomeGridItems(
      undefined,
      undefined,
      includesFeaturedSection ? featuredIds : [],
      includesFeaturedSection ? [] : featuredIds
    );
  }, [audience, interest]);
}
